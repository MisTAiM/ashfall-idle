// ================================================================
// ASHFALL IDLE — ui/skills.js
// All skill page rendering.
// Merges: skills-ui-components.js + skills-ui-integration.js
// ================================================================
// ================================================================
// ASHFALL IDLE — Skills UI Components v1.0
// Mana bars, spell buttons, quality indicators, ammo counter,
// farm visuals, familiar UI, weapon displays
// ================================================================

// ── MANA BAR UI ────────────────────────────────────────────────
class ManaBarComponent {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.updateInterval = null;
  }

  render(manaPercent) {
    if (!this.container) return;
    
    const clamp = (v) => Math.max(0, Math.min(100, v));
    const pct = clamp(manaPercent);
    
    this.container.innerHTML = `
      <div class="mana-bar-wrapper">
        <div class="mana-bar-label">
          <span class="mana-text">Mana</span>
          <span class="mana-value">${Math.round(pct)}%</span>
        </div>
        <div class="mana-bar-bg">
          <div class="mana-bar-fill" style="width: ${pct}%"></div>
          <div class="mana-bar-regen"></div>
        </div>
      </div>
    `;
  }

  update(engine) {
    if (engine && engine.state.combat.mana) {
      const pct = engine.getManaPercent();
      const current = engine.state.combat.mana.current;
      const max = engine.state.combat.mana.max;
      console.log('[ManaBar] Update: ', current + '/' + max + ' = ' + pct + '%');
      this.render(pct);
    }
  }

  startAutoUpdate(engine, intervalMs = 100) {
    console.log('[ManaBar] Starting auto-update every ' + intervalMs + 'ms');
    if (this.updateInterval) clearInterval(this.updateInterval);
    this.updateInterval = setInterval(() => this.update(engine), intervalMs);
  }

  stop() {
    if (this.updateInterval) clearInterval(this.updateInterval);
  }
}

// ── SPELL SCHOOL SELECTOR ──────────────────────────────────────
class SpellSchoolSelector {
  constructor(containerId, engine, callback) {
    this.containerId = containerId;
    this.engine = engine;
    this.callback = callback;
    this.activeSchool = 'combat';
    this.container = document.getElementById(containerId);
  }

  render() {
    if (!this.container) return;

    const schools = MANA_SYSTEM.spellSchools;
    let html = '<div class="spell-school-selector">';
    html += '<div class="school-tabs">';

    for (const [schoolId, school] of Object.entries(schools)) {
      const isActive = this.activeSchool === schoolId;
      const magicLevel = this.engine?.getSkillLevel?.('magic') || 0;
      const canAccess = magicLevel >= school.levelReq;
      
      html += `
        <button 
          class="school-tab ${isActive ? 'school-tab-active' : ''} ${!canAccess ? 'school-tab-locked' : ''}"
          onclick="uiSpells.selectSchool('${schoolId}')"
          title="${school.name} (Lvl ${school.levelReq}+)"
          style="border-left-color: ${school.color}"
          ${!canAccess ? 'disabled' : ''}
        >
          ${school.name}
        </button>
      `;
    }

    html += '</div>';
    html += '<div class="school-spells" id="school-spells"></div>';
    html += '</div>';

    this.container.innerHTML = html;
    this.renderSchoolSpells();
  }

  selectSchool(schoolId) {
    const school = MANA_SYSTEM.spellSchools[schoolId];
    if (!school) return;

    const magicLevel = this.engine?.getSkillLevel?.('magic') || 0;
    if (magicLevel < school.levelReq) {
      if (typeof ui !== 'undefined') {
        ui.toast({ type: 'warn', text: `Magic level ${school.levelReq} required`, duration: 3000 });
      }
      return;
    }

    this.activeSchool = schoolId;
    this.renderSchoolSpells();
    this.callback?.(schoolId);
  }

  renderSchoolSpells() {
    const spellsDiv = document.getElementById('school-spells');
    if (!spellsDiv) return;

    const school = MANA_SYSTEM.spellSchools[this.activeSchool];
    if (!school) return;

    const magicLevel = this.engine?.getSkillLevel?.('magic') || 0;
    let html = '<div class="spells-grid">';

    for (const spell of school.spells) {
      const canCast = magicLevel >= spell.level && this.engine?.canCastSpell?.(spell.id, this.activeSchool);
      const manaPercent = (this.engine?.state?.combat?.mana?.current || 0) / (this.engine?.state?.combat?.mana?.max || 100) * 100;
      const hasEnoughMana = (this.engine?.state?.combat?.mana?.current || 0) >= spell.manaCost;

      let spellDesc = '';
      if (spell.damage) spellDesc = `${spell.damage} dmg`;
      else if (spell.healing) spellDesc = `${spell.healing} heal`;
      else if (spell.effect) spellDesc = spell.effect;

      html += `
        <div class="spell-card ${canCast ? 'spell-card-ready' : 'spell-card-locked'} ${!hasEnoughMana ? 'spell-card-nomana' : ''}">
          <div class="spell-header">
            <div class="spell-name">${spell.name}</div>
            <div class="spell-level">Lvl ${spell.level}</div>
          </div>
          <div class="spell-cost">⚡ ${spell.manaCost}</div>
          <div class="spell-effect">${spellDesc}</div>
          <button 
            class="spell-btn ${!canCast || !hasEnoughMana ? 'disabled' : ''}"
            onclick="uiSpells.castSpell('${spell.id}', '${this.activeSchool}')"
            ${!canCast || !hasEnoughMana ? 'disabled' : ''}
            title="${!canCast ? `Requires Magic Lvl ${spell.level}` : !hasEnoughMana ? 'Not enough mana' : 'Click to cast'}"
          >
            Cast
          </button>
        </div>
      `;
    }

    html += '</div>';
    spellsDiv.innerHTML = html;
  }

  castSpell(spellId, schoolId) {
    if (this.engine?.castSpell?.(spellId, schoolId)) {
      this.render(); // Refresh UI
      if (typeof ui !== 'undefined') {
        ui.toast({
          type: 'success',
          text: `Cast ${MANA_SYSTEM.spellSchools[schoolId].spells.find(s => s.id === spellId)?.name || 'spell'}`,
          duration: 2000
        });
      }
    }
  }
}

// ── QUALITY INDICATOR ──────────────────────────────────────────
function getQualityHTML(quality) {
  const tier = QUALITY_TIERS[quality];
  if (!tier) return '';
  
  return `<span class="quality-badge quality-${quality}" style="color: ${tier.color}; border-color: ${tier.color}">◆ ${tier.name}</span>`;
}

function addQualityToItemDisplay(itemEl, quality) {
  if (!quality) return;
  const qualityHtml = getQualityHTML(quality);
  const nameEl = itemEl.querySelector('.item-name, .inv-name, [data-name]');
  if (nameEl) {
    nameEl.innerHTML += ' ' + qualityHtml;
  }
}

// ── WEAPON TYPE DISPLAY ────────────────────────────────────────
class WeaponDisplayComponent {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
  }

  render(engine) {
    if (!this.container || !engine) return;

    const weaponTypeId = engine.state.combat.weaponType;
    const weaponType = SKILL_WEAPON_TYPES[weaponTypeId];
    if (!weaponType) return;

    const stats = {
      damage: engine.getWeaponBonus('damage'),
      speed: engine.getWeaponBonus('speed'),
      accuracy: engine.getWeaponBonus('accuracy'),
    };

    let html = `<div class="weapon-display">`;
    html += `<div class="weapon-name">${weaponType.name}</div>`;
    html += `<div class="weapon-stats">`;

    if (stats.damage !== 1.0) {
      const damageText = stats.damage > 1.0 ? `+${(stats.damage - 1).toFixed(0)}%` : `-${(1 - stats.damage).toFixed(0)}%`;
      html += `<div class="stat-row"><span class="stat-label">Damage:</span><span class="stat-value ${stats.damage > 1.0 ? 'positive' : 'negative'}">${damageText}</span></div>`;
    }

    if (stats.speed !== 1.0) {
      const speedText = stats.speed > 1.0 ? `+${(stats.speed - 1).toFixed(0)}%` : `-${(1 - stats.speed).toFixed(0)}%`;
      html += `<div class="stat-row"><span class="stat-label">Speed:</span><span class="stat-value ${stats.speed > 1.0 ? 'positive' : 'negative'}">${speedText}</span></div>`;
    }

    if (stats.accuracy !== 1.0) {
      const accText = stats.accuracy > 1.0 ? `+${(stats.accuracy - 1).toFixed(0)}%` : `-${(1 - stats.accuracy).toFixed(0)}%`;
      html += `<div class="stat-row"><span class="stat-label">Accuracy:</span><span class="stat-value ${stats.accuracy > 1.0 ? 'positive' : 'negative'}">${accText}</span></div>`;
    }

    if (weaponType.bleed) {
      html += `<div class="stat-row"><span class="stat-label">Bleed:</span><span class="stat-value positive">${(weaponType.bleed * 100).toFixed(0)}%</span></div>`;
    }

    if (weaponType.stun) {
      html += `<div class="stat-row"><span class="stat-label">Stun:</span><span class="stat-value positive">${(weaponType.stun * 100).toFixed(0)}%</span></div>`;
    }

    html += `</div></div>`;
    this.container.innerHTML = html;
  }
}

// ── AMMO COUNTER ───────────────────────────────────────────────
class AmmoCounterComponent {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
  }

  render(engine) {
    if (!this.container || !engine) return;

    const weaponTypeId = engine.state.combat.weaponType;
    const weaponType = SKILL_WEAPON_TYPES[weaponTypeId];
    
    if (!weaponType || !weaponType.ammoType) {
      this.container.innerHTML = '';
      return;
    }

    const ammoCount = engine.getAmmoCount(weaponType.ammoType);
    const ammoType = AMMO_TYPES[weaponType.ammoType];
    const ammoName = ammoType?.name || weaponType.ammoType;

    let html = `<div class="ammo-counter">`;
    html += `<div class="ammo-label">${ammoName}</div>`;
    html += `<div class="ammo-count ${ammoCount <= 0 ? 'ammo-empty' : ammoCount <= 10 ? 'ammo-low' : 'ammo-ok'}">${ammoCount}</div>`;
    
    if (ammoCount <= 0) {
      html += `<div class="ammo-warning">Out of ammo!</div>`;
    } else if (ammoCount <= 10) {
      html += `<div class="ammo-warning">Low ammo</div>`;
    }

    html += `</div>`;
    this.container.innerHTML = html;
  }
}

// ── FARM PLOT DISPLAY ──────────────────────────────────────────
class FarmPlotComponent {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
  }

  render(engine) {
    if (!this.container) return;

    const plots = engine?.state?.farming?.plots || {};
    let html = '<div class="farm-plots">';

    for (let i = 0; i < 4; i++) {
      const plotId = `plot_${i}`;
      const plot = plots[plotId];
      
      html += '<div class="farm-plot">';
      
      if (!plot) {
        html += '<div class="plot-empty">Empty</div>';
        html += '<button class="plot-btn" onclick="uiFarm.showPlantDialog(\'' + plotId + '\')">Plant</button>';
      } else {
        const crop = FARMING_IMPROVEMENTS.cropVarieties.find(c => c.id === plot.cropId);
        const timeElapsed = (Date.now() - plot.plantedAt) / 1000;
        const growthPercent = Math.min(100, (timeElapsed / (plot.growthTime / 1000)) * 100);
        
        html += `<div class="plot-info">
          <div class="crop-name">${crop?.name || plot.cropId}</div>
          <div class="crop-progress" style="width: 100%; height: 20px; background: #333; margin: 5px 0; border-radius: 3px; overflow: hidden;">
            <div style="width: ${growthPercent}%; height: 100%; background: linear-gradient(90deg, #4abe6c, #7ec444); transition: width 0.3s;"></div>
          </div>
          <div class="crop-status">
            ${plot.diseased ? '<span class="disease-warning">🦠 Diseased</span>' : 'Healthy'}
            ${growthPercent >= 100 ? '<span class="harvest-ready">Ready!</span>' : ''}
          </div>
        </div>`;
        
        if (growthPercent >= 100) {
          html += `<button class="plot-btn harvest-btn" onclick="uiFarm.harvestPlot('${plotId}')">Harvest</button>`;
        } else if (plot.diseased) {
          html += `<button class="plot-btn cure-btn" onclick="uiFarm.showCureDialog('${plotId}')">Cure</button>`;
        }
      }
      
      html += '</div>';
    }

    html += '</div>';
    this.container.innerHTML = html;
  }
}

// ── FAMILIAR DISPLAY ───────────────────────────────────────────
class FamiliarComponent {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
  }

  render(engine) {
    if (!this.container || !engine) return;

    const familiar = engine.state.combat.familiar;
    
    if (!familiar) {
      this.container.innerHTML = '<div class="familiar-empty">No familiar summoned</div>';
      return;
    }

    const hpPercent = (familiar.hp / familiar.maxHp) * 100;
    const hpColor = hpPercent > 50 ? '#4abe6c' : hpPercent > 25 ? '#c9873e' : '#cc5500';

    let html = `<div class="familiar-display">`;
    html += `<div class="familiar-header">`;
    html += `<div class="familiar-name">${familiar.name}</div>`;
    html += `<button class="familiar-dismiss" onclick="uiFamiliar.dismiss()" title="Dismiss familiar">✕</button>`;
    html += `</div>`;
    
    html += `<div class="familiar-hp">`;
    html += `<div class="hp-bar-bg">`;
    html += `<div class="hp-bar-fill" style="width: ${hpPercent}%; background-color: ${hpColor};"></div>`;
    html += `</div>`;
    html += `<div class="hp-text">${familiar.hp}/${familiar.maxHp}</div>`;
    html += `</div>`;

    if (familiar.special) {
      html += `<div class="familiar-special">`;
      html += `<span class="special-label">Ability:</span>`;
      html += `<span class="special-name">${familiar.special}</span>`;
      html += `</div>`;
    }

    html += `</div>`;
    this.container.innerHTML = html;
  }
}

// ── POTION QUALITY BADGE ───────────────────────────────────────
function getPotionQualityBadge(quality) {
  const qualities = {
    failed: { emoji: '✗', color: '#cc5500', effect: '50%' },
    normal: { emoji: '◯', color: '#c9c9c9', effect: '100%' },
    enhanced: { emoji: '◆', color: '#0066ff', effect: '150%' },
    perfect: { emoji: '★', color: '#ffaa00', effect: '200%' },
  };

  const q = qualities[quality];
  if (!q) return '';

  return `<span class="potion-quality" style="color: ${q.color}" title="Effectiveness: ${q.effect}">${q.emoji}</span>`;
}

// ── GLOBAL UI SPELL HANDLER ────────────────────────────────────
const uiSpells = {
  selector: null,
  
  init(engine) {
    this.engine = engine;
    this.selector = new SpellSchoolSelector('spell-school-selector', engine, (schoolId) => {
      console.log('[UI] Selected spell school:', schoolId);
    });
  },

  render() {
    this.selector?.render();
  },

  selectSchool(schoolId) {
    this.selector?.selectSchool(schoolId);
  },

  castSpell(spellId, schoolId) {
    this.selector?.castSpell(spellId, schoolId);
  }
};

// ── GLOBAL UI FARMING HANDLER ──────────────────────────────────
const uiFarm = {
  engine: null,
  
  init(engine) {
    this.engine = engine;
  },

  showPlantDialog(plotId) {
    const crops = FARMING_IMPROVEMENTS.cropVarieties;
    const farmingLevel = this.engine?.getSkillLevel?.('farming') || 0;
    
    let html = '<div class="modal-content"><h3>Plant Crop</h3><div class="crop-list">';
    for (const crop of crops) {
      const canPlant = farmingLevel >= crop.level;
      html += `<button class="crop-option ${!canPlant ? 'disabled' : ''}" onclick="uiFarm.plantCrop('${plotId}', '${crop.id}')" ${!canPlant ? 'disabled' : ''}>
        ${crop.name} (Lvl ${crop.level}+)
      </button>`;
    }
    html += '</div></div>';
    
    if (typeof ui !== 'undefined') {
      ui.showModal(html);
    }
  },

  plantCrop(plotId, cropId) {
    const farmingLevel = this.engine?.getSkillLevel?.('farming') || 0;
    if (this.engine?.plantCrop?.(plotId, cropId, farmingLevel)) {
      if (typeof ui !== 'undefined') {
        ui.toast({ type: 'success', text: 'Crop planted!', duration: 2000 });
        ui.closeModal();
      }
    }
  },

  harvestPlot(plotId) {
    if (typeof ui !== 'undefined') {
      ui.toast({ type: 'success', text: 'Plot harvested!', duration: 2000 });
    }
  },

  showCureDialog(plotId) {
    const cures = FARMING_IMPROVEMENTS.diseaseSystem.cureItems;
    if (typeof ui !== 'undefined') {
      ui.toast({ type: 'warn', text: `Need one of: ${cures.join(', ')}`, duration: 4000 });
    }
  }
};

// ── GLOBAL UI FAMILIAR HANDLER ─────────────────────────────────
const uiFamiliar = {
  engine: null,
  
  init(engine) {
    this.engine = engine;
  },

  dismiss() {
    this.engine.state.combat.familiar = null;
    if (typeof ui !== 'undefined') {
      ui.toast({ type: 'info', text: 'Familiar dismissed', duration: 2000 });
    }
  }
};

// ── CSS STYLES (injected) ──────────────────────────────────────
function injectUIStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Mana Bar */
    .mana-bar-wrapper {
      margin: 8px 0;
      padding: 8px;
      background: rgba(25, 25, 35, 0.8);
      border: 1px solid #4a6fb5;
      border-radius: 4px;
    }
    .mana-bar-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      font-size: 12px;
      color: #a8d5ff;
    }
    .mana-bar-bg {
      position: relative;
      height: 16px;
      background: #1a1a2e;
      border: 1px solid #334455;
      border-radius: 2px;
      overflow: hidden;
    }
    .mana-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #3366cc, #6699ff);
      transition: width 0.2s;
    }

    /* Spell School Selector */
    .spell-school-selector {
      margin: 8px 0;
    }
    .school-tabs {
      display: flex;
      gap: 4px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }
    .school-tab {
      padding: 6px 12px;
      background: #222;
      color: #999;
      border: 1px solid #444;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s;
    }
    .school-tab:hover:not(:disabled) {
      background: #333;
      color: #bbb;
    }
    .school-tab-active {
      background: #334455;
      color: #fff;
      border-color: #4a6fb5;
    }
    .school-tab-locked {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .spells-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 6px;
    }
    .spell-card {
      padding: 8px;
      background: #1a1a2e;
      border: 1px solid #444;
      border-radius: 4px;
      font-size: 11px;
    }
    .spell-card-ready {
      border-color: #4abe6c;
      background: rgba(74, 190, 108, 0.1);
    }
    .spell-card-nomana {
      opacity: 0.6;
      border-color: #cc5500;
    }
    .spell-card-locked {
      opacity: 0.4;
      border-color: #555;
    }
    .spell-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
    }
    .spell-name {
      font-weight: bold;
      color: #fff;
    }
    .spell-level {
      color: #999;
      font-size: 10px;
    }
    .spell-cost {
      color: #6699ff;
      margin: 2px 0;
    }
    .spell-effect {
      color: #aaa;
      margin: 2px 0 4px;
    }
    .spell-btn {
      width: 100%;
      padding: 4px;
      background: #4a6fb5;
      color: #fff;
      border: none;
      border-radius: 2px;
      cursor: pointer;
      font-size: 11px;
      transition: background 0.2s;
    }
    .spell-btn:hover:not(.disabled) {
      background: #5a7fd5;
    }
    .spell-btn.disabled {
      background: #444;
      cursor: not-allowed;
      opacity: 0.5;
    }

    /* Quality Badge */
    .quality-badge {
      display: inline-block;
      padding: 2px 6px;
      border: 1px solid;
      border-radius: 2px;
      font-size: 11px;
      font-weight: bold;
      margin-left: 4px;
      vertical-align: middle;
    }
    .quality-normal { color: #999; border-color: #666; }
    .quality-uncommon { color: #4abe6c; border-color: #4abe6c; }
    .quality-rare { color: #0066ff; border-color: #0066ff; }
    .quality-epic { color: #aa00ff; border-color: #aa00ff; }
    .quality-masterwork { color: #ffaa00; border-color: #ffaa00; }

    /* Ammo Counter */
    .ammo-counter {
      padding: 6px;
      background: #222;
      border: 1px solid #444;
      border-radius: 3px;
      font-size: 12px;
    }
    .ammo-label {
      color: #999;
      margin-bottom: 3px;
    }
    .ammo-count {
      font-size: 18px;
      font-weight: bold;
      color: #4abe6c;
    }
    .ammo-empty { color: #cc5500; }
    .ammo-low { color: #c9873e; }
    .ammo-warning {
      font-size: 10px;
      color: #cc5500;
      margin-top: 2px;
    }

    /* Farm Plots */
    .farm-plots {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 8px;
    }
    .farm-plot {
      padding: 8px;
      background: #1a1a2e;
      border: 2px solid #444;
      border-radius: 4px;
      text-align: center;
    }
    .plot-empty {
      color: #666;
      padding: 20px;
      font-size: 12px;
    }
    .crop-name {
      font-weight: bold;
      color: #fff;
      margin-bottom: 4px;
    }
    .crop-status {
      font-size: 11px;
      color: #999;
      margin-top: 4px;
    }
    .disease-warning {
      color: #cc5500;
      margin-right: 4px;
    }
    .harvest-ready {
      color: #4abe6c;
      margin-left: 4px;
    }
    .plot-btn {
      width: 100%;
      padding: 6px;
      margin-top: 6px;
      background: #4a6fb5;
      color: #fff;
      border: none;
      border-radius: 2px;
      cursor: pointer;
      font-size: 11px;
    }
    .plot-btn:hover {
      background: #5a7fd5;
    }

    /* Familiar Display */
    .familiar-display {
      padding: 8px;
      background: #1a1a2e;
      border: 1px solid #663399;
      border-radius: 4px;
      color: #fff;
    }
    .familiar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    .familiar-name {
      font-weight: bold;
      color: #e0a0ff;
    }
    .familiar-dismiss {
      background: #cc0000;
      color: #fff;
      border: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 12px;
    }
    .hp-bar-bg {
      height: 12px;
      background: #333;
      border-radius: 2px;
      overflow: hidden;
      margin: 4px 0;
    }
    .hp-bar-fill {
      height: 100%;
      transition: width 0.3s;
    }
    .hp-text {
      font-size: 10px;
      color: #999;
    }
    .familiar-special {
      font-size: 11px;
      color: #e0a0ff;
      margin-top: 6px;
    }
    .special-label {
      color: #999;
      margin-right: 4px;
    }
  `;
  document.head.appendChild(style);
}

// ── INITIALIZATION ─────────────────────────────────────────────
if (window._ASHFALL_DEBUG) {
  console.log('[Ashfall] Skills UI Components v1.0 loaded');
  console.log('  ManaBarComponent ready');
  console.log('  SpellSchoolSelector ready');
  console.log('  Quality indicators ready');
  console.log('  Ammo counter ready');
  console.log('  Farm plots ready');
  console.log('  Familiar display ready');
}

// Inject styles on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectUIStyles);
} else {
  injectUIStyles();
}

// Export for use
window.ManaBarComponent = ManaBarComponent;
window.SpellSchoolSelector = SpellSchoolSelector;
window.WeaponDisplayComponent = WeaponDisplayComponent;
window.AmmoCounterComponent = AmmoCounterComponent;
window.FarmPlotComponent = FarmPlotComponent;
window.FamiliarComponent = FamiliarComponent;
window.uiSpells = uiSpells;
window.uiFarm = uiFarm;
window.uiFamiliar = uiFamiliar;
window.getQualityHTML = getQualityHTML;
window.getPotionQualityBadge = getPotionQualityBadge;

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
