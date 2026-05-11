// ============================================================
// ASHFALL IDLE — SMART GLOBAL SEARCH SYSTEM v2.0
// Unified search for everything: skills, items, monsters, NPCs, quests, etc
// ============================================================

class SmartSearchEngine {
  constructor() {
    this.index = [];
    this.searchHistory = [];
    this.maxHistory = 20;
    this.built = false;
    this.debounceTimer = null;
  }

  buildIndex() {
    if (this.built && Object.keys(GAME_DATA).length > 0) return;
    
    this.index = [];

    // === SKILLS ===
    if (GAME_DATA.skills) {
      for (const [id, skill] of Object.entries(GAME_DATA.skills)) {
        this.index.push({
          type: 'skill',
          id,
          name: skill.name,
          icon: skill.icon || 'sparkle',
          category: 'Skills',
          description: skill.description || '',
          action: () => ui.renderPage(id),
        });
      }
    }

    // === ITEMS ===
    if (GAME_DATA.items) {
      for (const [id, item] of Object.entries(GAME_DATA.items)) {
        if (!item.name) continue;
        this.index.push({
          type: 'item',
          id,
          name: item.name,
          icon: 'package',
          category: 'Items',
          description: `${item.type || 'item'}${item.stats ? ' • ' + Object.keys(item.stats).join(', ') : ''}`,
          rarity: item.rarity,
          action: () => {
            ui.currentPage = 'bank';
            ui.renderSidebar();
            ui.renderPage('bank');
            // Try to highlight the item
            setTimeout(() => {
              const itemEl = document.querySelector(`[data-item-id="${id}"]`);
              if (itemEl) itemEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 200);
          },
        });
      }
    }

    // === MONSTERS ===
    if (GAME_DATA.monsters) {
      for (const [id, monster] of Object.entries(GAME_DATA.monsters)) {
        this.index.push({
          type: 'monster',
          id,
          name: monster.name,
          icon: 'skull',
          category: 'Monsters',
          description: `Level ${monster.combatLevel} • ${monster.hitpoints} HP`,
          action: () => {
            ui.engine.startCombat(id, false);
            ui.currentPage = 'combat';
            ui.renderSidebar();
            ui.renderPage('combat');
          },
        });
      }
    }

    // === QUESTS ===
    if (GAME_DATA.quests) {
      for (const quest of GAME_DATA.quests) {
        this.index.push({
          type: 'quest',
          id: quest.id,
          name: quest.name,
          icon: 'scroll',
          category: 'Quests',
          description: quest.series ? `${quest.series} • Difficulty: ${quest.difficulty || 'Medium'}` : `Difficulty: ${quest.difficulty || 'Medium'}`,
          action: () => {
            ui.currentPage = 'quests';
            ui.renderSidebar();
            ui.renderPage('quests');
            setTimeout(() => {
              const questEl = document.querySelector(`[data-quest-id="${quest.id}"]`);
              if (questEl) questEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 200);
          },
        });
      }
    }

    // === NPCs ===
    if (GAME_DATA.npcs) {
      for (const [id, npc] of Object.entries(GAME_DATA.npcs)) {
        this.index.push({
          type: 'npc',
          id,
          name: npc.name,
          icon: 'person',
          category: 'NPCs',
          description: npc.title || 'NPC',
          action: () => {
            ui.currentPage = 'quests';
            ui.renderSidebar();
            ui.renderPage('quests');
          },
        });
      }
    }

    // === LOCATIONS / PAGES ===
    const pages = [
      { id: 'combat', name: 'Combat', category: 'Pages', icon: 'sword', desc: 'Fight monsters' },
      { id: 'bank', name: 'Bank', category: 'Pages', icon: 'bag', desc: 'Manage items' },
      { id: 'equipment', name: 'Equipment', category: 'Pages', icon: 'armor', desc: 'Equip items' },
      { id: 'quests', name: 'Quests', category: 'Pages', icon: 'scroll', desc: 'Quest log' },
      { id: 'slayer', name: 'Slayer', category: 'Pages', icon: 'target', desc: 'Slayer tasks' },
      { id: 'character', name: 'Character', category: 'Pages', icon: 'person', desc: 'Stats & info' },
      { id: 'achievements', name: 'Achievements', category: 'Pages', icon: 'trophy', desc: 'Milestones' },
      { id: 'prestige', name: 'Prestige', category: 'Pages', icon: 'sparkle', desc: 'Reset & rebirth' },
      { id: 'activity', name: 'Activity Log', category: 'Pages', icon: 'scroll', desc: 'Event history' },
      { id: 'collection_log', name: 'Collection Log', category: 'Pages', icon: 'book', desc: 'Loot tracker' },
      { id: 'pets', name: 'Pets', category: 'Pages', icon: 'pet', desc: 'Pet companions' },
      { id: 'wilderness', name: 'Wilderness', category: 'Areas', icon: 'map', desc: 'PvP zone' },
      { id: 'dungeons', name: 'Dungeons', category: 'Areas', icon: 'cave', desc: 'Dungeon raids' },
      { id: 'fight_cave', name: 'Fight Cave', category: 'Areas', icon: 'cave', desc: '63-wave gauntlet' },
      { id: 'bazaar', name: 'Bazaar', category: 'Trading', icon: 'shop', desc: 'Trading post' },
      { id: 'chat', name: 'Chat', category: 'Social', icon: 'chat', desc: 'Global chat' },
      { id: 'leaderboards', name: 'Leaderboards', category: 'Social', icon: 'ranking', desc: 'Rankings' },
    ];

    for (const page of pages) {
      this.index.push({
        type: 'page',
        id: page.id,
        name: page.name,
        icon: page.icon,
        category: page.category,
        description: page.desc,
        action: () => {
          ui.currentPage = page.id;
          ui.renderSidebar();
          ui.renderPage(page.id);
        },
      });
    }

    this.built = true;
  }

  search(query) {
    if (!this.built) this.buildIndex();
    if (!query || query.length < 1) return [];

    const term = query.toLowerCase();
    let results = this.index.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(term);
      const descMatch = item.description.toLowerCase().includes(term);
      const idMatch = item.id.toLowerCase().includes(term);
      return nameMatch || descMatch || idMatch;
    });

    // Score and sort by relevance
    results = results.map(item => {
      const name = item.name.toLowerCase();
      const term_lower = term;
      
      let score = 0;
      if (name === term_lower) score += 100; // Exact match
      else if (name.startsWith(term_lower)) score += 50; // Starts with
      else if (name.includes(' ' + term_lower)) score += 40; // Word boundary
      else score += 10; // Contains

      // Boost by type popularity
      const typeBoost = { skill: 5, item: 3, monster: 3, page: 4, quest: 3, npc: 2 };
      score += (typeBoost[item.type] || 0);

      return { ...item, score };
    }).sort((a, b) => b.score - a.score).slice(0, 20);

    return results;
  }

  addToHistory(result) {
    this.searchHistory = this.searchHistory.filter(r => r.id !== result.id);
    this.searchHistory.unshift(result);
    if (this.searchHistory.length > this.maxHistory) {
      this.searchHistory.pop();
    }
  }

  getHistory() {
    return this.searchHistory;
  }

  clearHistory() {
    this.searchHistory = [];
  }
}

const smartSearch = new SmartSearchEngine();
