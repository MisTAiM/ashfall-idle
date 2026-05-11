// ============================================================
// ASHFALL IDLE — CONTENT ANALYZER & CHANGELOG v1.0
// Track dependencies, changelog, version history
// ============================================================

class ContentAnalyzer {
  // Analyze which items are used in recipes
  getItemUsage(itemId) {
    const usage = {
      inRecipes: [],
      inMonsterDrops: [],
      usedCount: 0
    };

    // Check recipes
    Object.entries(GAME_DATA.recipes || {}).forEach(([skill, recipes]) => {
      if (Array.isArray(recipes)) {
        recipes.forEach((recipe, idx) => {
          const inputs = recipe.inputs || [];
          if (inputs.some(inp => inp.item === itemId)) {
            usage.inRecipes.push({ skill, recipe: recipe.name || `Recipe ${idx}` });
            usage.usedCount++;
          }
        });
      }
    });

    // Check monster drops
    Object.entries(GAME_DATA.monsters || {}).forEach(([id, monster]) => {
      const drops = monster.drops || [];
      if (drops.some(d => d.item === itemId)) {
        usage.inMonsterDrops.push(id);
        usage.usedCount++;
      }
    });

    return usage;
  }

  // Check if monster is used in quests
  getMonsterUsage(monsterId) {
    const usage = { inQuests: [], inAreas: [], usedCount: 0 };

    // Check quests
    (GAME_DATA.quests || []).forEach(quest => {
      if (quest.monsters && quest.monsters.includes(monsterId)) {
        usage.inQuests.push(quest.name || quest.id);
        usage.usedCount++;
      }
    });

    // Check combat areas
    (GAME_DATA.combatAreas || []).forEach(area => {
      const monsters = area.monsters || [];
      if (monsters.includes(monsterId)) {
        usage.inAreas.push(area.name);
        usage.usedCount++;
      }
    });

    return usage;
  }

  renderDependencyAnalysis(type, id) {
    let analysis;

    if (type === 'item') {
      analysis = this.getItemUsage(id);
      return `
        <div class="adm-section">
          <h3>🔗 Item Dependencies</h3>
          ${analysis.usedCount === 0 ? '<div style="color:var(--text-dim)">Not used anywhere</div>' : `
            ${analysis.inRecipes.length > 0 ? `
              <div style="margin-bottom:12px">
                <h4 style="color:#c9873e; margin-bottom:8px">📚 Used in Recipes (${analysis.inRecipes.length})</h4>
                <div style="background:rgba(0,0,0,0.2); padding:8px; border-radius:4px">
                  ${analysis.inRecipes.map(r => `<div style="font-size:12px; padding:4px">• ${r.skill}: <strong>${r.recipe}</strong></div>`).join('')}
                </div>
              </div>
            ` : ''}
            ${analysis.inMonsterDrops.length > 0 ? `
              <div>
                <h4 style="color:#c9873e; margin-bottom:8px">💀 Dropped by Monsters (${analysis.inMonsterDrops.length})</h4>
                <div style="background:rgba(0,0,0,0.2); padding:8px; border-radius:4px">
                  ${analysis.inMonsterDrops.map(m => `<div style="font-size:12px; padding:4px">• ${GAME_DATA.monsters[m]?.name || m}</div>`).join('')}
                </div>
              </div>
            ` : ''}
          `}
        </div>
      `;
    } else if (type === 'monster') {
      analysis = this.getMonsterUsage(id);
      return `
        <div class="adm-section">
          <h3>🔗 Monster Dependencies</h3>
          ${analysis.usedCount === 0 ? '<div style="color:var(--text-dim)">Not used in any content</div>' : `
            ${analysis.inQuests.length > 0 ? `
              <div style="margin-bottom:12px">
                <h4 style="color:#c9873e; margin-bottom:8px">📜 In Quests (${analysis.inQuests.length})</h4>
                <div style="background:rgba(0,0,0,0.2); padding:8px; border-radius:4px">
                  ${analysis.inQuests.map(q => `<div style="font-size:12px; padding:4px">• ${q}</div>`).join('')}
                </div>
              </div>
            ` : ''}
            ${analysis.inAreas.length > 0 ? `
              <div>
                <h4 style="color:#c9873e; margin-bottom:8px">🗺️ In Combat Areas (${analysis.inAreas.length})</h4>
                <div style="background:rgba(0,0,0,0.2); padding:8px; border-radius:4px">
                  ${analysis.inAreas.map(a => `<div style="font-size:12px; padding:4px">• ${a}</div>`).join('')}
                </div>
              </div>
            ` : ''}
          `}
        </div>
      `;
    }

    return '';
  }
}

// Changelog System
class ChangeLog {
  constructor() {
    this.entries = [];
    this.loadChangelog();
  }

  addEntry(type, description, details = {}) {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      type,
      description,
      user: online?.displayName || 'unknown',
      details
    };

    this.entries.unshift(entry);
    if (this.entries.length > 100) this.entries.pop();

    localStorage.setItem('changelog', JSON.stringify(this.entries));
  }

  loadChangelog() {
    try {
      const saved = localStorage.getItem('changelog');
      if (saved) {
        this.entries = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Load changelog failed');
    }
  }

  renderChangelog() {
    return `
      <div class="adm-section">
        <h3>📜 Recent Changes (${this.entries.length})</h3>
        <div style="max-height:300px; overflow-y:auto">
          ${this.entries.length === 0 ? '<div style="color:var(--text-dim)">No changes recorded</div>' : `
            ${this.entries.slice(0, 20).map(entry => `
              <div style="background:rgba(0,0,0,0.2); padding:8px; border-radius:4px; margin-bottom:6px; border-left:3px solid ${this._getTypeColor(entry.type)}">
                <div style="display:flex; justify-content:space-between; font-size:11px">
                  <strong style="color:${this._getTypeColor(entry.type)}">${entry.type}</strong>
                  <div style="color:var(--text-dim)">${new Date(entry.timestamp).toLocaleTimeString()}</div>
                </div>
                <div style="font-size:12px; margin-top:4px">${entry.description}</div>
                <div style="font-size:10px; color:var(--text-dim); margin-top:2px">${entry.user}</div>
              </div>
            `).join('')}
          `}
        </div>
      </div>
    `;
  }

  _getTypeColor(type) {
    const colors = {
      'CREATED': '#7dcc44',
      'EDITED': '#ffd700',
      'DELETED': '#ff6b6b',
      'IMPORTED': '#88ccff',
      'EXPORTED': '#ffaa88'
    };
    return colors[type] || '#c9873e';
  }
}

const contentAnalyzer = new ContentAnalyzer();
const changelog = new ChangeLog();
