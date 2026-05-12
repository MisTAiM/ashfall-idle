// ================================================================
// ASHFALL IDLE — Skills UI Integration Patches
// Add components to combat page, equipment screen, and inventory
// Hook into existing UI rendering
// ================================================================

// ── PATCH COMBAT PAGE RENDERING ────────────────────────────────
const originalRenderCombatPage = UI.prototype.renderCombatPage;
UI.prototype.renderCombatPage = function(el) {
  console.log('[SkillUI] renderCombatPage patched called');
  
  // Call original rendering first
  if (originalRenderCombatPage) {
    originalRenderCombatPage.call(this, el);
  }

  // Add mana bar after combat controls
  const controlsEl = el.querySelector('.combat-controls');
  if (controlsEl && this.engine.state.combat.mana) {
    console.log('[SkillUI] Adding mana bar');
    const manaContainer = document.createElement('div');
    manaContainer.id = 'combat-mana-bar';
    manaContainer.style.marginTop = '12px';
    controlsEl.parentNode.insertBefore(manaContainer, controlsEl.nextSibling);

    // Initialize and render mana bar
    const manaBar = new ManaBarComponent('combat-mana-bar');
    manaBar.render(this.engine.getManaPercent());
    manaBar.startAutoUpdate(this.engine, 100);
  }

  // Add spell school selector after XP panel (for magic only)
  if (this.engine.state.combat.combatStyle === 'magic') {
    const xpPanel = el.querySelector('.combat-xp-panel');
    if (xpPanel) {
      const spellContainer = document.createElement('div');
      spellContainer.id = 'spell-school-selector';
      spellContainer.style.marginTop = '12px';
      xpPanel.parentNode.insertBefore(spellContainer, xpPanel.nextSibling);

      // Initialize spell selector
      uiSpells.engine = this.engine;
      uiSpells.selector = new SpellSchoolSelector('spell-school-selector', this.engine, (schoolId) => {
        console.log('[UI] Selected school:', schoolId);
      });
      uiSpells.selector.render();
    }
  }

  // Add weapon display and ammo counter
  const combatPage = el.querySelector('.combat-page');
  if (combatPage) {
    const infoRow = document.createElement('div');
    infoRow.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px;';

    // Weapon display
    const weaponDiv = document.createElement('div');
    weaponDiv.id = 'weapon-display';
    infoRow.appendChild(weaponDiv);

    // Ammo counter
    const ammoDiv = document.createElement('div');
    ammoDiv.id = 'ammo-counter';
    infoRow.appendChild(ammoDiv);

    combatPage.appendChild(infoRow);

    // Render components
    const weaponDisplay = new WeaponDisplayComponent('weapon-display');
    weaponDisplay.render(this.engine);

    const ammoCounter = new AmmoCounterComponent('ammo-counter');
    ammoCounter.render(this.engine);

    // Update on weapon change
    this.engine.on('weaponChanged', () => {
      weaponDisplay.render(this.engine);
      ammoCounter.render(this.engine);
    });
  }

  // Add familiar display if summoned
  const familiar = this.engine.state.combat.familiar;
  if (familiar) {
    const familiarContainer = document.createElement('div');
    familiarContainer.id = 'familiar-display';
    familiarContainer.style.marginTop = '12px';
    el.appendChild(familiarContainer);

    const familiarComponent = new FamiliarComponent('familiar-display');
    familiarComponent.render(this.engine);

    uiFamiliar.engine = this.engine;
  }
};

// ── PATCH EQUIPMENT PAGE RENDERING ─────────────────────────────
const originalRenderEquipmentPage = UI.prototype.renderEquipmentPage;
UI.prototype.renderEquipmentPage = function(el) {
  // Call original
  originalRenderEquipmentPage.call(this, el);

  // Add weapon type bonuses info box
  const equipmentEl = el.querySelector('.equipment-grid') || el.querySelector('[data-equipment]');
  if (equipmentEl) {
    const infoBox = document.createElement('div');
    infoBox.style.cssText = 'margin-top: 12px; padding: 8px; background: #1a1a2e; border: 1px solid #444; border-radius: 4px; font-size: 12px;';
    infoBox.innerHTML = `
      <div style="color: #999; margin-bottom: 6px;">⚔️ Weapon Bonuses</div>
      <div id="weapon-bonus-info" style="color: #aaa; font-size: 11px;"></div>
    `;
    equipmentEl.parentNode.appendChild(infoBox);

    // Update weapon bonus display
    const updateWeaponInfo = () => {
      const infoDiv = document.getElementById('weapon-bonus-info');
      if (infoDiv && this.engine.state.combat.weaponType) {
        const weaponType = SKILL_WEAPON_TYPES[this.engine.state.combat.weaponType];
        if (weaponType) {
          let text = `<strong>${weaponType.name}</strong><br/>`;
          if (weaponType.damage && weaponType.damage !== 1.0) {
            text += `Damage: ${(weaponType.damage * 100).toFixed(0)}%<br/>`;
          }
          if (weaponType.speed && weaponType.speed !== 1.0) {
            text += `Speed: ${(weaponType.speed * 100).toFixed(0)}%<br/>`;
          }
          if (weaponType.accuracy && weaponType.accuracy !== 1.0) {
            text += `Accuracy: ${(weaponType.accuracy * 100).toFixed(0)}%<br/>`;
          }
          if (weaponType.bleed) {
            text += `Bleed: ${(weaponType.bleed * 100).toFixed(0)}%<br/>`;
          }
          infoDiv.innerHTML = text;
        }
      }
    };

    updateWeaponInfo();
    this.engine.on('weaponChanged', updateWeaponInfo);
  }
};

// ── PATCH INVENTORY RENDERING ──────────────────────────────────
const originalRenderInventory = UI.prototype.renderInventory;
UI.prototype.renderInventory = function(el) {
  // Call original
  originalRenderInventory.call(this, el);

  // Add quality indicators to items
  const itemElements = el.querySelectorAll('[data-item-id]');
  itemElements.forEach(itemEl => {
    const itemId = itemEl.getAttribute('data-item-id');
    const item = this.engine.state.inventory[itemId];

    // Add quality badge if item has quality property
    if (item && item.quality) {
      const qualityHtml = getQualityHTML(item.quality);
      const nameEl = itemEl.querySelector('.inv-name, .item-name, [data-name]');
      if (nameEl && !nameEl.querySelector('.quality-badge')) {
        const badge = document.createElement('span');
        badge.innerHTML = qualityHtml;
        nameEl.appendChild(badge);
      }
    }

    // Add potion quality badge
    if (item && item.potionQuality) {
      const qualityBadge = getPotionQualityBadge(item.potionQuality);
      const countEl = itemEl.querySelector('.inv-qty, .item-qty, [data-qty]');
      if (countEl && !countEl.querySelector('.potion-quality')) {
        const badge = document.createElement('span');
        badge.innerHTML = qualityBadge;
        badge.style.marginLeft = '4px';
        countEl.appendChild(badge);
      }
    }

    // Add ammo count highlight
    if (item && item.isAmmo) {
      itemEl.classList.add('ammo-item');
      const count = item.qty || 0;
      if (count <= 0) {
        itemEl.classList.add('ammo-empty');
      } else if (count <= 10) {
        itemEl.classList.add('ammo-low');
      }
    }
  });
};

// ── NEW PAGE: FARMING ──────────────────────────────────────────
UI.prototype.renderFarmingPage = function(el) {
  const s = this.engine.state;
  let html = '<div class="farming-page">';

  // Skill info
  const farmLevel = s.skills.farming?.level || 0;
  const farmXp = s.skills.farming?.xp || 0;
  const farmProgress = this.engine.getXpProgress('farming');

  html += `<div class="skill-header">
    <h2>Farming</h2>
    <div class="skill-stats">
      Level ${farmLevel} | ${this.fmt(farmXp)} XP
      <div class="xp-bar" style="width: 100%; height: 20px; background: #333; margin-top: 6px; border-radius: 3px; overflow: hidden;">
        <div style="width: ${(farmProgress * 100).toFixed(1)}%; height: 100%; background: linear-gradient(90deg, #4abe6c, #7ec444);"></div>
      </div>
    </div>
  </div>`;

  // Farm plots
  html += '<div style="margin-top: 12px;"><h3>Farm Plots</h3>';
  const farmContainer = document.createElement('div');
  farmContainer.id = 'farm-plots-container';
  
  // Initialize farming UI
  uiFarm.engine = this.engine;

  html += '<div id="farm-plots-container"></div></div>';

  // Crop reference
  html += '<div style="margin-top: 12px;"><h3>Crops</h3>';
  html += '<table style="width: 100%; font-size: 12px; border-collapse: collapse;">';
  html += '<tr style="background: #222;"><th style="padding: 6px; text-align: left; border-bottom: 1px solid #444;">Crop</th><th style="padding: 6px; border-bottom: 1px solid #444;">Level</th><th style="padding: 6px; border-bottom: 1px solid #444;">Growth</th><th style="padding: 6px; border-bottom: 1px solid #444;">Yield</th></tr>';
  
  for (const crop of FARMING_IMPROVEMENTS.cropVarieties) {
    const canGrow = farmLevel >= crop.level;
    html += `<tr style="background: ${canGrow ? '#1a1a2e' : '#222'}; opacity: ${canGrow ? '1' : '0.5'};">
      <td style="padding: 6px; border-bottom: 1px solid #333;">${crop.name}</td>
      <td style="padding: 6px; border-bottom: 1px solid #333;">${crop.level}</td>
      <td style="padding: 6px; border-bottom: 1px solid #333;">${crop.growTime} min</td>
      <td style="padding: 6px; border-bottom: 1px solid #333;">${crop.yield} items</td>
    </tr>`;
  }
  
  html += '</table></div>';
  html += '</div>';

  el.innerHTML = html;

  // Render farm plots
  setTimeout(() => {
    const plotsDiv = document.getElementById('farm-plots-container');
    if (plotsDiv) {
      const farmComponent = new FarmPlotComponent('farm-plots-container');
      farmComponent.render(this.engine);

      // Auto-update farm plots
      setInterval(() => {
        farmComponent.render(this.engine);
      }, 5000); // Update every 5 seconds
    }
  }, 10);
};

// ── NEW PAGE: SPELLBOOK ────────────────────────────────────────
UI.prototype.renderSpellbookPage = function(el) {
  const s = this.engine.state;
  let html = '<div class="spellbook-page">';

  // Magic skill info
  const magicLevel = s.skills.magic?.level || 0;
  const magicXp = s.skills.magic?.xp || 0;
  const magicProgress = this.engine.getXpProgress('magic');
  const manaPercent = this.engine.getManaPercent();

  html += `<div class="skill-header">
    <h2>Magic</h2>
    <div class="skill-stats">
      Level ${magicLevel} | ${this.fmt(magicXp)} XP
      <div class="xp-bar" style="width: 100%; height: 20px; background: #333; margin-top: 6px; border-radius: 3px; overflow: hidden;">
        <div style="width: ${(magicProgress * 100).toFixed(1)}%; height: 100%; background: linear-gradient(90deg, #6699ff, #99ccff);"></div>
      </div>
    </div>
  </div>`;

  // Mana display
  html += `<div style="margin-top: 12px; padding: 8px; background: rgba(102, 153, 255, 0.1); border: 1px solid #6699ff; border-radius: 4px;">
    <div style="color: #99ccff; margin-bottom: 6px;">Mana: ${Math.round(manaPercent)}%</div>
    <div style="height: 20px; background: #333; border-radius: 3px; overflow: hidden;">
      <div style="width: ${manaPercent}%; height: 100%; background: linear-gradient(90deg, #3366cc, #6699ff); transition: width 0.3s;"></div>
    </div>
  </div>`;

  // Spell schools
  html += '<div style="margin-top: 12px;"><h3>Spell Schools</h3>';
  html += '<div id="spellbook-schools"></div></div>';

  el.innerHTML = html;

  // Render spell schools
  setTimeout(() => {
    const schoolsDiv = document.getElementById('spellbook-schools');
    if (schoolsDiv) {
      let schoolsHtml = '';
      for (const [schoolId, school] of Object.entries(MANA_SYSTEM.spellSchools)) {
        const canAccess = magicLevel >= school.levelReq;
        schoolsHtml += `<div style="margin-bottom: 12px; padding: 8px; background: #1a1a2e; border-left: 3px solid ${school.color}; border-radius: 2px; opacity: ${canAccess ? '1' : '0.5'};">
          <div style="color: ${school.color}; font-weight: bold; margin-bottom: 6px;">${school.name} ${!canAccess ? '(Lvl ' + school.levelReq + '+)' : ''}</div>`;

        if (canAccess) {
          for (const spell of school.spells) {
            let effect = '';
            if (spell.damage) effect = `${spell.damage} damage`;
            else if (spell.healing) effect = `${spell.healing} heal`;
            else if (spell.effect) effect = spell.effect;

            schoolsHtml += `<div style="font-size: 11px; color: #aaa; margin-bottom: 4px;">
              <strong>${spell.name}</strong> (Lvl ${spell.level}) - ⚡ ${spell.manaCost} | ${effect}
            </div>`;
          }
        }

        schoolsHtml += '</div>';
      }
      schoolsDiv.innerHTML = schoolsHtml;
    }
  }, 10);
};

// ── HOOK INTO SKILL PAGES ──────────────────────────────────────
const originalRenderSkillPage = UI.prototype.renderSkillPage;
UI.prototype.renderSkillPage = function(el, skillId, skill) {
  // Guard: ensure originalRenderSkillPage exists
  if (!originalRenderSkillPage || typeof originalRenderSkillPage !== 'function') {
    console.warn('[UI] renderSkillPage: original method not found');
    return;
  }
  
  // For farming skill, show farm UI
  if (skillId === 'farming') {
    this.renderFarmingPage(el);
    return;
  }

  // For magic skill, show spellbook UI
  if (skillId === 'magic') {
    this.renderSpellbookPage(el);
    return;
  }

  // Otherwise use original
  try {
    originalRenderSkillPage.call(this, el, skillId, skill);
  } catch (e) {
    console.error('[UI] renderSkillPage error:', e);
  }
};

// ── CSS ADDITIONS ──────────────────────────────────────────────
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
  /* Combat page additions */
  .combat-mana-bar {
    margin: 12px 0;
    padding: 8px;
    background: rgba(102, 153, 255, 0.1);
    border: 1px solid #6699ff;
    border-radius: 4px;
  }

  /* Weapon bonus info */
  .weapon-bonus-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 8px;
  }

  /* Ammo item highlighting */
  .ammo-item {
    border-left: 2px solid #4a6fb5 !important;
  }
  .ammo-item.ammo-low {
    border-left-color: #c9873e !important;
  }
  .ammo-item.ammo-empty {
    border-left-color: #cc5500 !important;
    opacity: 0.6;
  }

  /* Farming page */
  .farming-page {
    padding: 8px;
  }
  .skill-header {
    padding: 8px;
    background: #1a1a2e;
    border: 1px solid #444;
    border-radius: 4px;
  }
  .skill-header h2 {
    margin: 0 0 8px 0;
    color: #fff;
  }
  .skill-stats {
    font-size: 12px;
    color: #aaa;
  }
  .xp-bar {
    margin-top: 6px;
  }

  /* Spellbook page */
  .spellbook-page {
    padding: 8px;
  }
`;

document.head.appendChild(additionalStyles);

// ── LOGGING ────────────────────────────────────────────────────
if (window._ASHFALL_DEBUG) {
  console.log('[Ashfall] Skills UI Integration patches loaded');
  console.log('  Combat page: mana bar, spells, weapon info');
  console.log('  Equipment page: weapon bonuses');
  console.log('  Inventory: quality badges, ammo highlighting');
  console.log('  New pages: Farming, Spellbook');
}
