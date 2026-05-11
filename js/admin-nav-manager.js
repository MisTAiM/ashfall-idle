// ============================================================
// ASHFALL IDLE — ADMIN NAV MANAGER v1.0
// Reorganize tabs into sidebar with categories
// ============================================================

class AdminNavManager {
  constructor() {
    this.expandedGroups = {
      GAME: true,
      CONTENT: true,
      PLAYERS: false,
      ECONOMY: false,
      WORLD: false,
      CREATE: false
    };

    this.tabs = {
      GAME: [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'settings', label: 'Settings', icon: '⚙' },
        { id: 'logs', label: 'Logs', icon: '📋' },
        { id: 'broadcast', label: 'Broadcast', icon: '📢' },
        { id: 'tools', label: 'Tools', icon: '🛠' }
      ],
      CONTENT: [
        { id: 'items', label: 'Items', icon: '📦' },
        { id: 'monsters', label: 'Monsters', icon: '💀' },
        { id: 'recipes', label: 'Recipes', icon: '🔥' },
        { id: 'quests', label: 'Quests', icon: '📜' },
        { id: 'npcs', label: 'NPCs', icon: '🧑' },
        { id: 'abilities', label: 'Abilities', icon: '⚡' }
      ],
      PLAYERS: [
        { id: 'players', label: 'Players', icon: '👥' },
        { id: 'guilds_adm', label: 'Guilds', icon: '🏰' },
        { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
        { id: 'online', label: 'Online', icon: '🟢' }
      ],
      ECONOMY: [
        { id: 'gold', label: 'Gold', icon: '💰' },
        { id: 'shop_mgr', label: 'Shop Manager', icon: '🛍' },
        { id: 'economy', label: 'Economy', icon: '📈' },
        { id: 'worldboss', label: 'Worldboss', icon: '👑' }
      ],
      WORLD: [
        { id: 'combat', label: 'Combat', icon: '⚔' },
        { id: 'theatre', label: 'Theatre', icon: '🎭' },
        { id: 'skills', label: 'Skills', icon: '📚' },
        { id: 'state', label: 'State', icon: '🔍' }
      ],
      CREATE: [
        { id: 'create', label: 'Create Content', icon: '✨' }
      ],
      MEDIA: [
        { id: 'images', label: 'Media Library', icon: '🖼' }
      ]
    };

    this.favorites = [];
    this.recentTabs = [];
    this.loadPreferences();
  }

  loadPreferences() {
    try {
      const saved = localStorage.getItem('admin_nav_prefs');
      if (saved) {
        const prefs = JSON.parse(saved);
        this.expandedGroups = { ...this.expandedGroups, ...prefs.expanded };
        this.favorites = prefs.favorites || [];
        this.recentTabs = prefs.recent || [];
      }
    } catch (e) {
      console.warn('[AdminNav] Load preferences failed');
    }
  }

  savePreferences() {
    try {
      localStorage.setItem('admin_nav_prefs', JSON.stringify({
        expanded: this.expandedGroups,
        favorites: this.favorites,
        recent: this.recentTabs
      }));
    } catch (e) {
      console.warn('[AdminNav] Save preferences failed');
    }
  }

  toggleGroup(group) {
    this.expandedGroups[group] = !this.expandedGroups[group];
    this.savePreferences();
  }

  addToFavorites(tabId) {
    if (!this.favorites.includes(tabId)) {
      this.favorites.push(tabId);
      this.savePreferences();
    }
  }

  removeFromFavorites(tabId) {
    this.favorites = this.favorites.filter(t => t !== tabId);
    this.savePreferences();
  }

  addToRecent(tabId) {
    this.recentTabs = this.recentTabs.filter(t => t !== tabId);
    this.recentTabs.unshift(tabId);
    if (this.recentTabs.length > 8) this.recentTabs.pop();
    this.savePreferences();
  }

  isFavorite(tabId) {
    return this.favorites.includes(tabId);
  }

  getVisibleTabs() {
    const visible = [];
    for (const [group, tabs] of Object.entries(this.tabs)) {
      for (const tab of tabs) {
        if (adminRoles.canAccess(tab.id)) {
          visible.push({ group, ...tab });
        }
      }
    }
    return visible;
  }

  renderSidebar() {
    let html = `<div class="admin-sidebar">
      <div class="admin-sidebar-header">
        <div style="font-size:18px; font-weight:bold; color:#c9873e">⚙ Admin</div>
        <div style="font-size:11px; color:var(--text-dim)">${adminRoles.getCurrentUserInfo().name}</div>
      </div>

      <div class="admin-sidebar-search">
        <input type="text" placeholder="Search tabs…" id="admin-nav-search" class="bank-search-input" style="width:100%; padding:6px 8px; font-size:12px" oninput="adminNav.filterTabs(this.value)">
      </div>`;

    // Favorites section
    if (this.favorites.length > 0) {
      html += `<div class="admin-sidebar-section">
        <div class="admin-sidebar-label">⭐ Favorites</div>`;
      for (const favId of this.favorites) {
        const tab = this.findTab(favId);
        if (tab && adminRoles.canAccess(tab.id)) {
          html += `<button class="admin-sidebar-tab" onclick="ui._admTab='${tab.id}';ui.renderPage('admin')" style="background:rgba(255,215,0,0.1); border-left:3px solid #ffd700">
            ${tab.icon} ${tab.label}
            <span style="margin-left:auto; cursor:pointer" onclick="event.stopPropagation();adminNav.removeFromFavorites('${tab.id}');ui.renderPage('admin')">✕</span>
          </button>`;
        }
      }
      html += `</div>`;
    }

    // Recent tabs
    if (this.recentTabs.length > 0) {
      html += `<div class="admin-sidebar-section">
        <div class="admin-sidebar-label">🕐 Recent</div>`;
      for (const recId of this.recentTabs.slice(0, 3)) {
        const tab = this.findTab(recId);
        if (tab && adminRoles.canAccess(tab.id)) {
          html += `<button class="admin-sidebar-tab" onclick="ui._admTab='${tab.id}';ui.renderPage('admin')">
            ${tab.icon} ${tab.label}
          </button>`;
        }
      }
      html += `</div>`;
    }

    // Main groups
    for (const [group, tabs] of Object.entries(this.tabs)) {
      const visibleTabs = tabs.filter(t => adminRoles.canAccess(t.id));
      if (visibleTabs.length === 0) continue;

      const isExpanded = this.expandedGroups[group];
      html += `<div class="admin-sidebar-section">
        <div class="admin-sidebar-group-header" onclick="adminNav.toggleGroup('${group}');ui.renderPage('admin')" style="cursor:pointer; user-select:none">
          <span>${isExpanded ? '▼' : '▶'}</span> <strong>${group}</strong> <span style="font-size:11px; color:var(--text-dim)">(${visibleTabs.length})</span>
        </div>
        ${isExpanded ? `
          <div>
            ${visibleTabs.map(tab => `
              <button class="admin-sidebar-tab" onclick="ui._admTab='${tab.id}';ui.renderPage('admin')">
                ${tab.icon} ${tab.label}
                <span style="margin-left:auto; cursor:pointer; opacity:0; font-size:14px" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0'" onclick="event.stopPropagation();adminNav.${adminNav.isFavorite(tab.id) ? 'removeFromFavorites' : 'addToFavorites'}('${tab.id}');ui.renderPage('admin')">
                  ${adminNav.isFavorite(tab.id) ? '★' : '☆'}
                </span>
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>`;
    }

    html += `<div class="admin-sidebar-footer">
      <button class="btn btn-xs" onclick="adminRoles.logAudit('ADMIN_SESSION_END'); location.reload()" style="width:100%">Exit Admin</button>
    </div></div>`;

    return html;
  }

  findTab(tabId) {
    for (const tabs of Object.values(this.tabs)) {
      const tab = tabs.find(t => t.id === tabId);
      if (tab) return tab;
    }
    return null;
  }

  filterTabs(query) {
    const search = query.toLowerCase();
    const tabs = document.querySelectorAll('.admin-sidebar-tab');
    tabs.forEach(tab => {
      const text = tab.textContent.toLowerCase();
      tab.style.display = text.includes(search) ? '' : 'none';
    });
  }
}

// Global instance
const adminNav = new AdminNavManager();
