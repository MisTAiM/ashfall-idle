// ============================================================
// ASHFALL IDLE — NAVIGATION SEARCH SYSTEM v1.0
// Find and navigate to skills, pages, items, and game systems
// ============================================================

class NavigationSearcher {
  constructor() {
    this.index = [];
    this.built = false;
  }

  buildIndex() {
    if (this.built) return; // Only build once
    this.built = true;
    this.index = [];

    // Skills
    if (typeof GAME_DATA !== 'undefined' && GAME_DATA.skills) {
      for (const [id, skill] of Object.entries(GAME_DATA.skills)) {
        this.index.push({
          id,
          name: skill.name,
          type: 'skill',
          pageId: id,
          icon: skill.icon || 'sparkle',
          category: 'Skills',
        });
      }
    }

    // Pages/Systems
    const pages = [
      { id: 'combat', name: 'Combat', category: 'Systems', icon: 'sword' },
      { id: 'bank', name: 'Bank', category: 'Systems', icon: 'bag' },
      { id: 'equipment', name: 'Equipment', category: 'Systems', icon: 'armor' },
      { id: 'quests', name: 'Quests', category: 'Systems', icon: 'scroll' },
      { id: 'slayer', name: 'Slayer', category: 'Systems', icon: 'target' },
      { id: 'character', name: 'Character', category: 'Systems', icon: 'person' },
      { id: 'achievements', name: 'Achievements', category: 'Systems', icon: 'trophy' },
      { id: 'prestige', name: 'Prestige', category: 'Systems', icon: 'sparkle' },
      { id: 'activity', name: 'Activity Log', category: 'Systems', icon: 'scroll' },
      { id: 'collection_log', name: 'Collection Log', category: 'Systems', icon: 'book' },
      { id: 'pets', name: 'Pets', category: 'Systems', icon: 'pet' },
      { id: 'wilderness', name: 'Wilderness', category: 'Areas', icon: 'map' },
      { id: 'dungeons', name: 'Dungeons', category: 'Areas', icon: 'cave' },
      { id: 'fight_cave', name: 'Fight Cave', category: 'Areas', icon: 'cave' },
      { id: 'bazaar', name: 'Bazaar', category: 'Trading', icon: 'shop' },
      { id: 'chat', name: 'Chat', category: 'Social', icon: 'chat' },
      { id: 'leaderboards', name: 'Leaderboards', category: 'Social', icon: 'ranking' },
    ];
    
    for (const page of pages) {
      this.index.push({
        id: page.id,
        name: page.name,
        type: 'page',
        pageId: page.id,
        icon: page.icon,
        category: page.category,
      });
    }

    // Items (popular ones, limit to keep search fast)
    if (typeof GAME_DATA !== 'undefined' && GAME_DATA.items) {
      const popular = ['oak_logs', 'copper_ore', 'bread', 'iron_pickaxe', 'bronze_sword',
                       'gold_bar', 'diamond_amulet', 'rune_essence', 'air_rune', 'oak_plank'];
      for (const itemId of popular) {
        const item = GAME_DATA.items[itemId];
        if (item) {
          this.index.push({
            id: itemId,
            name: item.name,
            type: 'item',
            icon: 'package',
            category: 'Items',
          });
        }
      }
    }

    // NPCs (sample)
    if (typeof GAME_DATA !== 'undefined' && GAME_DATA.npcs) {
      for (const [id, npc] of Object.entries(GAME_DATA.npcs).slice(0, 20)) {
        this.index.push({
          id,
          name: npc.name,
          type: 'npc',
          icon: 'person',
          category: 'NPCs',
        });
      }
    }
  }

  search(query) {
    if (!this.built) this.buildIndex();
    if (!query || query.length < 1) return [];

    const term = query.toLowerCase();
    const results = this.index.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(term);
      const idMatch = item.id.toLowerCase().includes(term);
      return nameMatch || idMatch;
    });

    // Sort by relevance (exact match first, then starts with, then contains)
    return results.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      // Exact match
      if (aName === term) return -1;
      if (bName === term) return 1;
      
      // Starts with
      if (aName.startsWith(term) && !bName.startsWith(term)) return -1;
      if (bName.startsWith(term) && !aName.startsWith(term)) return 1;
      
      // Length (shorter is more relevant)
      return aName.length - bName.length;
    }).slice(0, 15); // Limit results
  }

  navigate(pageId) {
    if (typeof ui !== 'undefined') {
      ui.currentPage = pageId;
      ui.renderSidebar();
      ui.renderPage(pageId);
    }
  }
}

const navigationSearcher = new NavigationSearcher();
