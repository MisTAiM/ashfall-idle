// ============================================================
// ASHFALL IDLE — CUSTOMIZABLE DASHBOARD v1.0
// Pick which widgets to show, drag-drop reorder
// ============================================================

class DashboardCustomizer {
  constructor() {
    this.widgets = {
      quick_stats: { name: 'Quick Stats', icon: '📊', enabled: true, priority: 1 },
      recent_edits: { name: 'Recent Edits', icon: '📝', enabled: true, priority: 2 },
      game_health: { name: 'Game Health', icon: '❤️', enabled: true, priority: 3 },
      quick_actions: { name: 'Quick Actions', icon: '⚡', enabled: true, priority: 4 },
      item_warnings: { name: 'Item Warnings', icon: '⚠️', enabled: true, priority: 5 },
      monster_warnings: { name: 'Monster Warnings', icon: '⚠️', enabled: false, priority: 6 },
      economy_stats: { name: 'Economy Stats', icon: '💰', enabled: true, priority: 7 },
      content_summary: { name: 'Content Summary', icon: '📚', enabled: false, priority: 8 }
    };

    this.loadPreferences();
  }

  loadPreferences() {
    try {
      const saved = localStorage.getItem('dashboard_prefs');
      if (saved) {
        const prefs = JSON.parse(saved);
        Object.assign(this.widgets, prefs.widgets);
      }
    } catch (e) {
      console.warn('[Dashboard] Load preferences failed');
    }
  }

  savePreferences() {
    try {
      localStorage.setItem('dashboard_prefs', JSON.stringify({ widgets: this.widgets }));
    } catch (e) {
      console.warn('[Dashboard] Save preferences failed');
    }
  }

  toggleWidget(widgetId) {
    if (this.widgets[widgetId]) {
      this.widgets[widgetId].enabled = !this.widgets[widgetId].enabled;
      this.savePreferences();
    }
  }

  getEnabledWidgets() {
    return Object.entries(this.widgets)
      .filter(([_, w]) => w.enabled)
      .sort((a, b) => a[1].priority - b[1].priority)
      .map(([id]) => id);
  }

  renderQuickStatsWidget() {
    const items = Object.keys(GAME_DATA.items).length;
    const monsters = Object.keys(GAME_DATA.monsters || {}).length;
    const quests = (GAME_DATA.quests || []).length;
    const recipes = Object.values(GAME_DATA.recipes || {}).reduce((a, v) => a + (Array.isArray(v) ? v.length : 0), 0);

    return `
      <div class="dashboard-widget">
        <h4>📊 Quick Stats</h4>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
          <div style="background:rgba(125,204,68,0.1); padding:10px; border-radius:4px">
            <div style="font-size:12px; color:var(--text-dim)">Items</div>
            <div style="font-size:20px; font-weight:bold; color:#7dcc44">${items}</div>
          </div>
          <div style="background:rgba(255,107,107,0.1); padding:10px; border-radius:4px">
            <div style="font-size:12px; color:var(--text-dim)">Monsters</div>
            <div style="font-size:20px; font-weight:bold; color:#ff6b6b">${monsters}</div>
          </div>
          <div style="background:rgba(255,215,0,0.1); padding:10px; border-radius:4px">
            <div style="font-size:12px; color:var(--text-dim)">Quests</div>
            <div style="font-size:20px; font-weight:bold; color:#ffd700">${quests}</div>
          </div>
          <div style="background:rgba(201,135,62,0.1); padding:10px; border-radius:4px">
            <div style="font-size:12px; color:var(--text-dim)">Recipes</div>
            <div style="font-size:20px; font-weight:bold; color:#c9873e">${recipes}</div>
          </div>
        </div>
      </div>
    `;
  }

  renderWidgetCustomizer() {
    return `
      <div class="adm-section">
        <h3>🎨 Dashboard Customizer</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
          ${Object.entries(this.widgets).map(([id, widget]) => `
            <label style="background:rgba(0,0,0,0.2); padding:10px; border-radius:6px; border:2px solid ${widget.enabled ? '#c9873e' : 'rgba(201,135,62,0.2)'}; cursor:pointer; display:flex; align-items:center; gap:10px">
              <input type="checkbox" ${widget.enabled ? 'checked' : ''} onchange="dashboardCustomizer.toggleWidget('${id}'); ui.renderPage('admin')">
              <span>${widget.icon} ${widget.name}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }
}

const dashboardCustomizer = new DashboardCustomizer();
