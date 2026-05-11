// ============================================================
// ASHFALL IDLE — ENHANCED MONSTER TOOLS v1.0
// SVG editor, visual drop builder, monster templates, balance checker
// ============================================================

class EnhancedMonsterTools {
  constructor() {
    this.svgTemplates = {
      humanoid: '<svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="30" r="20" fill="#aaa"/><rect x="35" y="50" width="30" height="40" fill="#666"/><rect x="20" y="95" width="15" height="70" fill="#999"/><rect x="65" y="95" width="15" height="70" fill="#999"/></svg>',
      dragon: '<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><ellipse cx="100" cy="75" rx="70" ry="50" fill="#d00"/><polygon points="100,30 120,50 100,40" fill="#d00"/><circle cx="50" cy="70" r="8" fill="#000"/><path d="M 150 75 L 190 70 L 185 80 Z" fill="#d00"/></svg>',
      beast: '<svg viewBox="0 0 150 120" xmlns="http://www.w3.org/2000/svg"><ellipse cx="75" cy="60" rx="50" ry="40" fill="#8b4513"/><circle cx="40" cy="50" r="8" fill="#000"/><polygon points="100,20 110,30 105,25" fill="#8b4513"/><rect x="30" y="90" width="10" height="25" fill="#8b4513"/><rect x="70" y="90" width="10" height="25" fill="#8b4513"/></svg>',
      skeleton: '<svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="30" r="20" fill="#ccc"/><rect x="35" y="50" width="30" height="50" fill="#999"/><circle cx="40" cy="35" r="4" fill="#000"/><circle cx="60" cy="35" r="4" fill="#000"/><rect x="25" y="100" width="12" height="60" fill="#888"/><rect x="63" y="100" width="12" height="60" fill="#888"/></svg>',
      slime: '<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="70" r="50" fill="#0f0" opacity="0.7"/><circle cx="35" cy="60" r="12" fill="#0f0" opacity="0.9"/><circle cx="65" cy="65" r="14" fill="#0f0" opacity="0.9"/><circle cx="50" cy="50" r="8" fill="#000"/></svg>'
    };

    this.monsterTemplates = [
      { name: 'Weak Goblin', type: 'goblin', hp: 30, hit: 5, level: 1, xp: 20 },
      { name: 'Imp', type: 'demon', hp: 50, hit: 10, level: 10, xp: 80 },
      { name: 'Orc', type: 'giant', hp: 100, hit: 15, level: 20, xp: 150 },
      { name: 'Ogre', type: 'giant', hp: 150, hit: 20, level: 30, xp: 250 },
      { name: 'Dragon', type: 'dragon', hp: 300, hit: 40, level: 60, xp: 500 },
      { name: 'Skeleton', type: 'undead', hp: 80, hit: 12, level: 15, xp: 100 },
      { name: 'Zombie', type: 'undead', hp: 120, hit: 16, level: 25, xp: 180 }
    ];
  }

  getSVGPreset(type) {
    return this.svgTemplates[type] || this.svgTemplates.humanoid;
  }

  renderSVGEditor(monsterId) {
    const monster = GAME_DATA.monsters[monsterId];
    const currentSVG = GAME_DATA.monsterArt?.[monsterId] || '';

    return `
      <div style="background:rgba(0,0,0,0.2); padding:15px; border-radius:6px; margin-bottom:15px">
        <h4 style="margin-top:0; color:#c9873e">SVG Editor</h4>
        
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px">
          <div>
            <label style="color:#c9873e; font-size:11px; display:block; margin-bottom:6px">SVG Code:</label>
            <textarea id="monster-svg-code" class="bank-search-input" style="width:100%; height:180px; font-family:monospace; font-size:11px" placeholder="<svg>...</svg>">${currentSVG}</textarea>
            <div style="display:flex; gap:6px; margin-top:8px">
              <button class="btn btn-xs" onclick="enhancedMonsterTools.insertTemplate('${monsterId}', 'humanoid')">👤 Humanoid</button>
              <button class="btn btn-xs" onclick="enhancedMonsterTools.insertTemplate('${monsterId}', 'dragon')">🐉 Dragon</button>
              <button class="btn btn-xs" onclick="enhancedMonsterTools.insertTemplate('${monsterId}', 'beast')">🦁 Beast</button>
              <button class="btn btn-xs" onclick="enhancedMonsterTools.insertTemplate('${monsterId}', 'skeleton')">💀 Skeleton</button>
              <button class="btn btn-xs" onclick="enhancedMonsterTools.insertTemplate('${monsterId}', 'slime')">🟢 Slime</button>
            </div>
          </div>
          
          <div>
            <label style="color:#c9873e; font-size:11px; display:block; margin-bottom:6px">Preview:</label>
            <div id="monster-svg-preview" style="width:100%; height:180px; background:rgba(0,0,0,0.3); border:1px solid rgba(201,135,62,0.3); border-radius:4px; display:flex; align-items:center; justify-content:center; overflow:hidden">
              ${currentSVG ? currentSVG : '<div style="color:#666">No SVG</div>'}
            </div>
            <button class="btn btn-xs" style="width:100%; margin-top:8px" onclick="enhancedMonsterTools.updateSVGPreview('${monsterId}')">🔄 Update Preview</button>
          </div>
        </div>
        
        <button class="btn btn-sm" onclick="enhancedMonsterTools.saveSVG('${monsterId}')">💾 Save SVG</button>
      </div>
    `;
  }

  insertTemplate(monsterId, templateType) {
    const svg = this.getSVGPreset(templateType);
    const textarea = document.getElementById('monster-svg-code');
    if (textarea) {
      textarea.value = svg;
      this.updateSVGPreview(monsterId);
    }
  }

  updateSVGPreview(monsterId) {
    const svg = document.getElementById('monster-svg-code')?.value;
    const preview = document.getElementById('monster-svg-preview');
    if (preview && svg) {
      try {
        preview.innerHTML = svg;
      } catch (e) {
        preview.innerHTML = '<div style="color:#f00">Invalid SVG</div>';
      }
    }
  }

  saveSVG(monsterId) {
    if (!adminRoles.hasPermission('edit:monster')) {
      adminRoles.showAccessDenied('edit monsters');
      return;
    }

    const svg = document.getElementById('monster-svg-code')?.value;
    if (!svg) {
      if (typeof ui !== 'undefined') {
        ui.toast({ type: 'warning', text: 'No SVG code' });
      }
      return;
    }

    GAME_DATA.monsterArt = GAME_DATA.monsterArt || {};
    GAME_DATA.monsterArt[monsterId] = svg;

    if (online?.db) {
      online.db.ref(`/monster_art/${monsterId}`).set(svg).then(() => {
        adminRoles.logAudit('MONSTER_SVG_UPDATE', { monsterId });
        if (typeof ui !== 'undefined') {
          ui.toast({ type: 'success', text: 'SVG saved!' });
        }
      }).catch(e => {
        if (typeof ui !== 'undefined') {
          ui.toast({ type: 'danger', text: 'Save failed: ' + e.message });
        }
      });
    }
  }

  renderDropBuilder(monsterId) {
    const monster = GAME_DATA.monsters[monsterId];
    const drops = monster.drops || [];

    return `
      <div style="background:rgba(0,0,0,0.2); padding:15px; border-radius:6px">
        <h4 style="margin-top:0; color:#c9873e">Drop Table Builder</h4>
        
        <div style="display:grid; grid-template-columns:1fr; gap:10px; margin-bottom:15px">
          ${drops.length > 0 ? drops.map((drop, idx) => `
            <div style="background:rgba(201,135,62,0.1); padding:10px; border-radius:4px; display:grid; grid-template-columns:1fr 80px 120px auto; gap:8px; align-items:center">
              <div>
                <div style="font-weight:bold; color:#c9873e">${GAME_DATA.items[drop.item]?.name || drop.item}</div>
                <div style="font-size:11px; color:var(--text-dim)">x${drop.qty}</div>
              </div>
              <div style="text-align:center">
                <div style="font-size:14px; color:#ffd700">${(drop.chance * 100).toFixed(1)}%</div>
              </div>
              <input type="range" min="0" max="1" step="0.01" value="${drop.chance}" style="width:100%; cursor:pointer" oninput="GAME_DATA.monsters['${monsterId}'].drops[${idx}].chance=parseFloat(this.value);ui.renderPage('admin')">
              <div style="display:flex; gap:4px">
                <button class="btn btn-xs" onclick="enhancedMonsterTools.editDrop('${monsterId}', ${idx})">✏</button>
                <button class="btn btn-xs btn-danger" onclick="GAME_DATA.monsters['${monsterId}'].drops.splice(${idx},1);ui.renderPage('admin')">🗑</button>
              </div>
            </div>
          `).join('') : '<div style="color:var(--text-dim); padding:10px">No drops yet</div>'}
        </div>

        <div style="background:rgba(0,0,0,0.2); padding:10px; border-radius:4px; margin-bottom:12px">
          <h4 style="margin:0 0 10px 0; color:#c9873e; font-size:13px">Add Drop</h4>
          <div style="display:grid; grid-template-columns:1fr 80px 100px auto; gap:8px">
            <select id="drop-item-new" class="bank-search-input">
              <option value="">Select Item...</option>
              ${Object.entries(GAME_DATA.items).slice(0,100).map(([id, item]) => `<option value="${id}">${item.name}</option>`).join('')}
            </select>
            <input type="number" id="drop-qty-new" class="bank-search-input" placeholder="Qty" value="1" style="width:100%">
            <input type="number" id="drop-chance-new" class="bank-search-input" placeholder="Chance 0-1" value="0.1" step="0.01" min="0" max="1" style="width:100%">
            <button class="btn btn-xs" onclick="enhancedMonsterTools.addDrop('${monsterId}')">+ Add</button>
          </div>
        </div>

        <button class="btn btn-sm" onclick="enhancedMonsterTools.saveDrops('${monsterId}')">💾 Save Drops</button>
      </div>
    `;
  }

  addDrop(monsterId) {
    const itemId = document.getElementById('drop-item-new')?.value;
    const qty = parseInt(document.getElementById('drop-qty-new')?.value || 1);
    const chance = parseFloat(document.getElementById('drop-chance-new')?.value || 0.1);

    if (!itemId) {
      if (typeof ui !== 'undefined') {
        ui.toast({ type: 'warning', text: 'Select an item' });
      }
      return;
    }

    if (!GAME_DATA.monsters[monsterId].drops) {
      GAME_DATA.monsters[monsterId].drops = [];
    }

    GAME_DATA.monsters[monsterId].drops.push({ item: itemId, qty, chance });
    if (typeof ui !== 'undefined') {
      ui.renderPage('admin');
    }
  }

  saveDrops(monsterId) {
    if (!adminRoles.hasPermission('edit:monster')) {
      adminRoles.showAccessDenied('edit monsters');
      return;
    }

    const drops = GAME_DATA.monsters[monsterId].drops || [];
    
    if (online?.db) {
      online.db.ref(`/monsters/${monsterId}/drops`).set(drops).then(() => {
        adminRoles.logAudit('MONSTER_DROPS_UPDATE', { monsterId, dropCount: drops.length });
        if (typeof ui !== 'undefined') {
          ui.toast({ type: 'success', text: `${drops.length} drops saved!` });
        }
      }).catch(e => {
        if (typeof ui !== 'undefined') {
          ui.toast({ type: 'danger', text: 'Save failed: ' + e.message });
        }
      });
    }
  }

  duplicateMonster(monsterId) {
    if (!adminRoles.hasPermission('create:monster')) {
      adminRoles.showAccessDenied('create monsters');
      return;
    }

    const original = GAME_DATA.monsters[monsterId];
    if (!original) return;

    const newId = `${monsterId}_copy_${Date.now()}`;
    const copy = JSON.parse(JSON.stringify(original));
    copy.id = newId;
    copy.name = copy.name + ' (Copy)';

    GAME_DATA.monsters[newId] = copy;

    if (typeof ui !== 'undefined') {
      ui._admMonEdit = newId;
      ui.renderPage('admin');
      ui.toast({ type: 'success', text: `Monster duplicated as "${newId}"` });
    }
  }

  analyzeMonsterBalance(monsterId) {
    const monster = GAME_DATA.monsters[monsterId];
    if (!monster) return null;

    const warnings = [];

    // HP check
    const expectedHP = monster.combatLevel * 3;
    if (monster.hp > expectedHP * 1.5) warnings.push('⚠ HP very high for level');
    if (monster.hp < expectedHP * 0.3) warnings.push('⚠ HP very low for level');

    // Damage check
    const expectedDamage = monster.combatLevel * 0.5;
    if (monster.maxHit > expectedDamage * 2) warnings.push('⚠ Damage very high');
    if (monster.maxHit < expectedDamage * 0.3) warnings.push('⚠ Damage very low');

    // XP check
    const expectedXP = monster.combatLevel * 5;
    if (monster.xp > expectedXP * 2) warnings.push('⚠ XP reward very high');

    // Gold check
    if (!monster.gold || monster.gold.max <= 0) warnings.push('⚠ No gold reward');

    return {
      hp: monster.hp,
      expectedHP,
      damage: monster.maxHit,
      level: monster.combatLevel,
      xp: monster.xp,
      warnings,
      difficultyScore: Math.round((monster.hp + monster.maxHit * 2 + monster.combatLevel) / 4)
    };
  }

  editDrop(monsterId, dropIdx) {
    // Placeholder for drop editor modal
    if (typeof ui !== 'undefined') {
      ui._admEditDropIdx = dropIdx;
      ui.renderPage('admin');
    }
  }
}

// Global instance
const enhancedMonsterTools = new EnhancedMonsterTools();
