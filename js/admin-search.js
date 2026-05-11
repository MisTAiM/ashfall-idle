// ============================================================
// ASHFALL IDLE — GLOBAL SEARCH & SUGGESTIONS v1.0
// Search everything, smart recommendations
// ============================================================

class AdminSearchEngine {
  constructor() {
    this.index = [];
    this.recentSearches = [];
    this.maxRecent = 10;
    this.buildIndex();
  }

  buildIndex() {
    this.index = [];

    // Index items
    Object.entries(GAME_DATA.items).forEach(([id, item]) => {
      this.index.push({
        type: 'item',
        id,
        name: item.name,
        icon: item.rarity ? `🔷` : '📦',
        keywords: [id, item.name, item.type, item.rarity].filter(Boolean)
      });
    });

    // Index monsters
    Object.entries(GAME_DATA.monsters || {}).forEach(([id, monster]) => {
      this.index.push({
        type: 'monster',
        id,
        name: monster.name,
        icon: '💀',
        keywords: [id, monster.name, monster.style].filter(Boolean)
      });
    });

    // Index recipes
    Object.entries(GAME_DATA.recipes || {}).forEach(([skill, recipes]) => {
      if (Array.isArray(recipes)) {
        recipes.forEach((recipe, idx) => {
          this.index.push({
            type: 'recipe',
            id: `${skill}_${idx}`,
            name: recipe.name || `Recipe ${idx}`,
            icon: '🔥',
            keywords: [recipe.name, skill].filter(Boolean)
          });
        });
      }
    });

    // Index quests
    (GAME_DATA.quests || []).forEach(quest => {
      this.index.push({
        type: 'quest',
        id: quest.id,
        name: quest.name,
        icon: '📜',
        keywords: [quest.id, quest.name]
      });
    });

    // Index NPCs
    Object.entries(GAME_DATA.npcs || {}).forEach(([id, npc]) => {
      this.index.push({
        type: 'npc',
        id,
        name: npc.name,
        icon: '🧑',
        keywords: [id, npc.name]
      });
    });
  }

  search(query, limit = 20) {
    if (!query || query.length < 2) return [];

    const q = query.toLowerCase();
    const results = this.index.filter(item =>
      item.keywords.some(kw => kw.toLowerCase().includes(q))
    ).slice(0, limit);

    return results;
  }

  addToRecent(item) {
    this.recentSearches = this.recentSearches.filter(r => r.id !== item.id);
    this.recentSearches.unshift(item);
    if (this.recentSearches.length > this.maxRecent) {
      this.recentSearches.pop();
    }
  }

  getRecentSearches() {
    return this.recentSearches;
  }

  renderSearchModal() {
    return `
      <div style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.9); z-index:9999; padding:20px; display:flex; align-items:flex-start; justify-content:center" onclick="if(event.target===this)this.remove()">
        <div style="background:#1a1b20; border:2px solid #c9873e; border-radius:8px; width:100%; max-width:600px; max-height:80vh; display:flex; flex-direction:column">
          <div style="padding:15px; border-bottom:1px solid rgba(201,135,62,0.2)">
            <input type="text" id="admin-global-search" placeholder="Search items, monsters, recipes, quests..." class="bank-search-input" style="width:100%; padding:10px; font-size:14px" autofocus oninput="adminSearch.renderSearchResults(this.value)">
          </div>
          <div id="admin-search-results" style="flex:1; overflow-y:auto; padding:10px"></div>
          <div style="padding:10px; border-top:1px solid rgba(201,135,62,0.2); font-size:11px; color:var(--text-dim)">
            Ctrl+K to open search • ESC to close
          </div>
        </div>
      </div>
    `;
  }

  renderSearchResults(query) {
    const results = this.search(query);
    const container = document.getElementById('admin-search-results');
    if (!container) return;

    let html = '';

    if (query.length < 2) {
      if (this.recentSearches.length > 0) {
        html += '<div style="padding:10px; color:#c9873e; font-size:12px">Recent Searches</div>';
        html += this.recentSearches.map(item => `
          <button class="admin-search-result" onclick="adminSearch.selectResult('${item.type}', '${item.id}')">
            <span style="font-size:16px">${item.icon}</span>
            <div>
              <div style="font-weight:bold; color:#c9873e">${item.name}</div>
              <div style="font-size:10px; color:var(--text-dim)">${item.type}</div>
            </div>
          </button>
        `).join('');
      }
    } else {
      if (results.length === 0) {
        html += '<div style="padding:20px; text-align:center; color:var(--text-dim)">No results found</div>';
      } else {
        html += results.map(item => `
          <button class="admin-search-result" onclick="adminSearch.selectResult('${item.type}', '${item.id}')">
            <span style="font-size:16px">${item.icon}</span>
            <div>
              <div style="font-weight:bold; color:#c9873e">${item.name}</div>
              <div style="font-size:10px; color:var(--text-dim)">${item.type} • ${item.id}</div>
            </div>
          </button>
        `).join('');
      }
    }

    container.innerHTML = html;
  }

  selectResult(type, id) {
    const item = this.index.find(i => i.type === type && i.id === id);
    if (!item) return;

    this.addToRecent(item);

    // Navigate to content
    if (type === 'item') {
      if (typeof ui !== 'undefined') {
        ui._admTab = 'items';
        ui._admItemEdit = id;
        ui.renderPage('admin');
      }
    } else if (type === 'monster') {
      if (typeof ui !== 'undefined') {
        ui._admTab = 'monsters';
        ui._admMonEdit = id;
        ui.renderPage('admin');
      }
    }

    // Close modal
    document.querySelector('[style*="background:rgba(0,0,0,0.9)"]')?.remove();
  }

  getSuggestions(itemId, type = 'item') {
    if (type === 'item') {
      const item = GAME_DATA.items[itemId];
      if (!item) return [];

      // Find similar items
      return Object.entries(GAME_DATA.items)
        .filter(([id, i]) => 
          id !== itemId && 
          i.type === item.type && 
          i.rarity === item.rarity
        )
        .slice(0, 5)
        .map(([id, i]) => ({ id, name: i.name }));
    }

    return [];
  }

  getPriceSuggestion(itemId) {
    const item = GAME_DATA.items[itemId];
    if (!item) return 0;

    const rarityPrices = {
      common: 50,
      uncommon: 500,
      rare: 2000,
      epic: 10000,
      legendary: 50000,
      mythic: 100000
    };

    const basePrice = rarityPrices[item.rarity] || 100;
    const statBonus = (item.stats?.attackBonus || 0) * 100;
    
    return Math.round(basePrice + statBonus);
  }

  getXPSuggestion(monsterId) {
    const monster = GAME_DATA.monsters[monsterId];
    if (!monster) return 0;

    // XP should scale with level
    return Math.round(monster.combatLevel * 5 + monster.hp * 0.5);
  }
}

const adminSearch = new AdminSearchEngine();

// Keyboard shortcut for search
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const modal = adminSearch.renderSearchModal();
    document.body.insertAdjacentHTML('beforeend', modal);
    document.getElementById('admin-global-search')?.focus();
  }

  if (e.key === 'Escape') {
    document.querySelector('[style*="background:rgba(0,0,0,0.9)"]')?.remove();
  }
});

// Add search results styling
const style = document.createElement('style');
style.textContent = `
  .admin-search-result {
    width: 100%;
    padding: 10px;
    background: rgba(0,0,0,0.2);
    border: none;
    border-bottom: 1px solid rgba(201,135,62,0.1);
    color: #aaa;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.2s;
    text-align: left;
  }
  .admin-search-result:hover {
    background: rgba(201,135,62,0.2);
    color: #c9873e;
  }
`;
document.head.appendChild(style);
