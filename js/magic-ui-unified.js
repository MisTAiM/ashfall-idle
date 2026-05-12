// ================================================================
// ASHFALL IDLE — UNIFIED MAGIC UI v1.0
// Rune spellcasting interface + Rune crafting
// ================================================================

class RuneSpellbookComponent {
  constructor(containerId, engine) {
    this.containerId = containerId;
    this.engine = engine;
    this.selectedSchool = 'combat';
    this.craftingMode = false;
  }

  render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const spells = this.engine.getSpellsBySchool(this.selectedSchool);
    const magicLevel = this.engine.state.skills.magic.level;

    let html = `
      <div style="background:#0a0b0f; border:1px solid #c9873e; border-radius:4px; padding:12px; margin:12px 0;">
        
        <!-- MODE TOGGLE -->
        <div style="display:flex; gap:8px; margin-bottom:12px; border-bottom:1px solid #333; padding-bottom:8px;">
          <button onclick="window.runeSpellbook.toggleMode(false)" 
            style="flex:1; padding:8px; background:${!this.craftingMode ? '#c9873e' : '#222'}; color:#fff; border:none; cursor:pointer; border-radius:3px; font-weight:bold;">
            🔮 CAST SPELLS
          </button>
          <button onclick="window.runeSpellbook.toggleMode(true)"
            style="flex:1; padding:8px; background:${this.craftingMode ? '#c9873e' : '#222'}; color:#fff; border:none; cursor:pointer; border-radius:3px; font-weight:bold;">
            🔨 CRAFT RUNES
          </button>
        </div>

        ${!this.craftingMode ? this.renderSpellcasting() : this.renderRuneCrafting()}
      </div>
    `;

    container.innerHTML = html;
  }

  renderSpellcasting() {
    const spells = this.engine.getSpellsBySchool(this.selectedSchool);
    const magicLevel = this.engine.state.skills.magic.level;
    const mana = this.engine.state.combat.mana;

    let html = `
      <!-- MANA STATUS -->
      <div style="background:#1a1a2e; padding:8px; border-radius:3px; margin-bottom:12px; border-left:3px solid #4169e1;">
        <div style="font-size:11px; color:#888;">MANA: ${mana?.current || 0}/${mana?.max || 100}</div>
        <div style="background:#222; height:8px; border-radius:2px; margin-top:4px; overflow:hidden;">
          <div style="background:#4169e1; height:100%; width:${(mana?.current || 0) / (mana?.max || 100) * 100}%;"></div>
        </div>
      </div>

      <!-- SCHOOL TABS -->
      <div style="display:flex; gap:4px; margin-bottom:12px; flex-wrap:wrap;">
    `;

    for (const school of Object.values(window.MAGIC_SYSTEM.SPELL_SCHOOLS)) {
      const isActive = school.id === this.selectedSchool;
      html += `
        <button onclick="window.runeSpellbook.selectSchool('${school.id}')"
          style="padding:6px 12px; background:${isActive ? '#c9873e' : '#1a1a2e'}; color:#fff; border:1px solid ${isActive ? '#c9873e' : '#333'}; cursor:pointer; border-radius:3px; font-size:11px;">
          ${school.icon} ${school.name}
        </button>
      `;
    }

    html += `</div>

      <!-- SPELLS LIST -->
      <div style="display:grid; grid-template-columns:1fr; gap:6px;">
    `;

    if (spells.length === 0) {
      html += `<div style="color:#888; text-align:center; padding:12px;">No spells available yet</div>`;
    } else {
      for (const spell of spells) {
        const hasRunes = this.checkHasRunes(spell);
        const hasMana = (mana?.current || 0) >= spell.manaCost;
        const canCast = hasRunes && hasMana && !this.craftingMode;

        html += `
          <div style="background:#1a1a2e; padding:8px; border-radius:3px; border-left:3px solid ${window.MAGIC_SYSTEM.SPELL_SCHOOLS[spell.school]?.color || '#888'};">
            <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:4px;">
              <div>
                <strong style="color:#c9873e;">${spell.name}</strong>
                <div style="font-size:10px; color:#888;">Lvl ${spell.levelRequired} • ${spell.manaCost} mana</div>
              </div>
              <button onclick="window.runeSpellbook.castSpell('${spell.id}')"
                style="padding:4px 8px; background:${canCast ? '#c9873e' : '#333'}; color:#fff; border:none; cursor:${canCast ? 'pointer' : 'not-allowed'}; border-radius:2px; font-size:10px; font-weight:bold;">
                CAST
              </button>
            </div>
            <div style="font-size:10px; color:#aaa; margin-bottom:4px;">${spell.effect}</div>
            <div style="display:flex; gap:4px; flex-wrap:wrap;">
              ${this.renderRuneRequirements(spell)}
            </div>
            ${!hasRunes ? `<div style="font-size:9px; color:#ff6b6b; margin-top:4px;">❌ Missing runes</div>` : ''}
            ${!hasMana ? `<div style="font-size:9px; color:#ff6b6b; margin-top:4px;">❌ Not enough mana</div>` : ''}
          </div>
        `;
      }
    }

    html += `</div>`;
    return html;
  }

  renderRuneCrafting() {
    let html = `
      <div style="color:#888; font-size:11px; margin-bottom:12px;">
        💡 Craft runes from essences to use in spellcasting
      </div>
      <div style="display:grid; grid-template-columns:1fr; gap:6px;">
    `;

    const magicLevel = this.engine.state.skills.magic.level;

    for (const recipe of Object.values(window.MAGIC_SYSTEM.RUNE_CRAFTING_RECIPES)) {
      const rune = window.MAGIC_SYSTEM.RUNE_SYSTEM.getRuneById(recipe.runeId);
      const canCraft = magicLevel >= recipe.level;
      const hasMatrls = this.checkHasMaterials(recipe);

      html += `
        <div style="background:#1a1a2e; padding:8px; border-radius:3px; border-left:3px solid ${rune.color};">
          <div style="display:flex; justify-content:space-between; align-items:start;">
            <div>
              <strong style="color:${rune.color};">${rune.name}</strong>
              <div style="font-size:10px; color:#888;">Lvl ${recipe.level} • ${recipe.xp} XP</div>
            </div>
            <button onclick="window.runeSpellbook.craftRune('${recipe.runeId}')"
              style="padding:4px 8px; background:${canCraft && hasMatrls ? rune.color : '#333'}; color:#fff; border:none; cursor:${canCraft && hasMatrls ? 'pointer' : 'not-allowed'}; border-radius:2px; font-size:10px;">
              CRAFT
            </button>
          </div>
          <div style="font-size:9px; color:#aaa; margin-top:4px;">
            ${this.renderMaterials(recipe)}
          </div>
          ${!canCraft ? `<div style="font-size:9px; color:#ff6b6b; margin-top:4px;">Need Magic ${recipe.level}</div>` : ''}
          ${!hasMatrls ? `<div style="font-size:9px; color:#ff6b6b; margin-top:4px;">❌ Missing materials</div>` : ''}
        </div>
      `;
    }

    html += `</div>`;
    return html;
  }

  renderRuneRequirements(spell) {
    let html = '';
    for (const [runeId, count] of Object.entries(spell.runes)) {
      const rune = window.MAGIC_SYSTEM.RUNE_SYSTEM.getRuneById(runeId);
      const have = this.getRuneCount(runeId);
      const color = have >= count ? rune.color : '#ff6b6b';
      html += `<span style="background:#333; padding:2px 6px; border-radius:2px; font-size:9px; color:${color};">${rune.name} ${have}/${count}</span>`;
    }
    return html;
  }

  renderMaterials(recipe) {
    let html = '';
    for (const [matId, count] of Object.entries(recipe.materials)) {
      const have = this.getMaterialCount(matId);
      const color = have >= count ? '#7fb069' : '#ff6b6b';
      html += `<span style="color:${color};">${count}x ${matId}</span> `;
    }
    return html;
  }

  checkHasRunes(spell) {
    for (const [runeId, count] of Object.entries(spell.runes)) {
      if (this.getRuneCount(runeId) < count) return false;
    }
    return true;
  }

  checkHasMaterials(recipe) {
    for (const [matId, count] of Object.entries(recipe.materials)) {
      if (this.getMaterialCount(matId) < count) return false;
    }
    return true;
  }

  getRuneCount(runeId) {
    const item = this.engine.state.inventory[`rune_${runeId}`];
    return item?.count || 0;
  }

  getMaterialCount(matId) {
    const item = this.engine.state.inventory[matId];
    return item?.count || 0;
  }

  toggleMode(isCrafting) {
    this.craftingMode = isCrafting;
    this.render();
  }

  selectSchool(schoolId) {
    this.selectedSchool = schoolId;
    this.craftingMode = false;
    this.render();
  }

  castSpell(spellId) {
    try {
      const result = this.engine.castSpell(spellId);
      console.log(`[Magic] Cast ${spellId}:`, result);
      this.render();
    } catch (e) {
      console.warn(`[Magic] Failed to cast: ${e.message}`);
    }
  }

  craftRune(runeId) {
    try {
      const magicLevel = this.engine.state.skills.magic.level;
      const result = this.engine.craftRune(runeId, magicLevel);
      console.log(`[Magic] Crafted ${runeId}:`, result);
      this.render();
    } catch (e) {
      console.warn(`[Magic] Failed to craft: ${e.message}`);
    }
  }
}

// ── INTEGRATION WITH COMBAT PAGE ───────────────────────────────
const originalRenderCombatPageMagic = UI.prototype.renderCombatPage;
UI.prototype.renderCombatPage = function(el) {
  originalRenderCombatPageMagic.call(this, el);

  // Add rune spellbook for magic combat
  if (this.engine.state.combat.combatStyle === 'magic') {
    const xpPanel = el.querySelector('.combat-xp-panel');
    if (xpPanel) {
      const spellbookContainer = document.createElement('div');
      spellbookContainer.id = 'rune-spellbook';
      xpPanel.parentNode.insertBefore(spellbookContainer, xpPanel.nextSibling);

      window.runeSpellbook = new RuneSpellbookComponent('rune-spellbook', this.engine);
      window.runeSpellbook.render();
    }
  }
};

// ── LOGGING ────────────────────────────────────────────────────
if (window._ASHFALL_DEBUG) {
  console.log('[Ashfall] Unified Magic UI loaded');
}
