// ============================================================
// ASHFALL IDLE — GAME OWNER ADMIN PANEL v2.0
// Full content management, balancing, and system controls
// ============================================================

class GameOwnerPanel {
  constructor() {
    this.isOpen = false;
    this.currentSection = 'dashboard';
    this.changes = {};
    this.isDirty = false;
  }

  // Core access control
  async canAccess() {
    if (typeof isAdmin === 'function') return isAdmin();
    if (typeof verifyAdmin === 'function') {
      const uid = (typeof online !== 'undefined' && online.user) ? online.user.uid : null;
      return await verifyAdmin(uid);
    }
    return false;
  }

  // Render admin panel
  async render(containerId = 'admin-panel') {
    if (!await this.canAccess()) {
      console.warn('[Admin] Access denied');
      return;
    }

    const container = document.getElementById(containerId) || document.createElement('div');
    container.id = containerId;
    container.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 600px;
      height: 100vh;
      background: #0a0b0f;
      border-left: 2px solid #c9873e;
      z-index: 9999;
      overflow-y: auto;
      padding: 20px;
      font-family: 'Cinzel', serif;
      color: #fff;
      display: ${this.isOpen ? 'block' : 'none'};
    `;

    let html = `
      <div class="admin-header">
        <h1 style="color: #c9873e; margin: 0 0 20px 0">⚙ Game Owner Panel</h1>
        <button onclick="gameOwnerPanel.close()" style="position: absolute; top: 20px; right: 20px; background: #c9873e; border: none; color: #000; padding: 8px 12px; cursor: pointer; border-radius: 4px">Close</button>
      </div>

      <div class="admin-nav" style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap">
        ${['dashboard', 'skills', 'items', 'monsters', 'npcs', 'quests', 'balancing', 'systems'].map(section => `
          <button 
            onclick="gameOwnerPanel.setSection('${section}')"
            style="padding: 8px 12px; background: ${this.currentSection === section ? '#c9873e' : 'rgba(201,135,62,0.2)'}; color: ${this.currentSection === section ? '#000' : '#c9873e'}; border: 1px solid #c9873e; border-radius: 4px; cursor: pointer; font-family: inherit"
          >
            ${section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        `).join('')}
      </div>

      <div class="admin-content">
        ${await this._renderSection(this.currentSection)}
      </div>
    `;

    container.innerHTML = html;
    if (!container.parentElement) document.body.appendChild(container);
  }

  async _renderSection(section) {
    const s = typeof game !== 'undefined' ? game.state : {};

    switch(section) {
      case 'dashboard':
        return this._renderDashboard(s);
      case 'skills':
        return this._renderSkillsManager();
      case 'items':
        return this._renderItemsManager();
      case 'monsters':
        return this._renderMonstersManager();
      case 'npcs':
        return this._renderNPCsManager();
      case 'quests':
        return this._renderQuestsManager();
      case 'balancing':
        return this._renderBalancingTools();
      case 'systems':
        return this._renderSystemsManager();
      default:
        return '<div>Unknown section</div>';
    }
  }

  _renderDashboard(state) {
    const stats = state.stats || {};
    return `
      <h2 style="color: #c9873e">Dashboard</h2>
      <div style="background: rgba(201,135,62,0.1); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.3); margin-bottom: 20px">
        <div><strong>Game Version:</strong> v9.5</div>
        <div><strong>Total Players (Sample):</strong> Loading...</div>
        <div><strong>Active Sessions:</strong> Monitoring...</div>
        <div><strong>Server Status:</strong> <span style="color: #4a8a3e">● Healthy</span></div>
      </div>

      <h3 style="color: #c9873e">Quick Actions</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
        <button onclick="gameOwnerPanel.action('backup')" style="padding: 10px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px">💾 Backup Save</button>
        <button onclick="gameOwnerPanel.action('reset_economy')" style="padding: 10px; background: rgba(196,64,64,0.3); border: 1px solid #c44040; color: #c44040; cursor: pointer; border-radius: 4px">⚠ Reset Economy</button>
        <button onclick="gameOwnerPanel.action('export_data')" style="padding: 10px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px">📤 Export Data</button>
        <button onclick="gameOwnerPanel.action('reload_config')" style="padding: 10px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px">🔄 Reload Config</button>
      </div>

      <h3 style="color: #c9873e; margin-top: 30px">Recent Changes</h3>
      <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 4px; font-size: 12px; max-height: 200px; overflow-y: auto">
        <div>No unsaved changes</div>
      </div>
    `;
  }

  _renderSkillsManager() {
    return `
      <h2 style="color: #c9873e">Skills Manager</h2>
      <p style="color: #aaa">View and edit skill properties, XP rates, and progression curves.</p>
      <div style="background: rgba(201,135,62,0.1); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.3)">
        <input type="text" placeholder="Search skills..." style="width: 100%; padding: 8px; margin-bottom: 10px; background: #1a1b20; border: 1px solid #c9873e; color: #fff">
        <div style="max-height: 400px; overflow-y: auto">
          <div style="font-size: 12px; color: #aaa">Loading skill data...</div>
        </div>
      </div>
    `;
  }

  _renderItemsManager() {
    return `
      <h2 style="color: #c9873e">Items Manager</h2>
      <p style="color: #aaa">Create, edit, and balance items. Manage drop tables and loot distribution.</p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px">
        <button onclick="gameOwnerPanel.action('create_item')" style="padding: 10px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px">+ New Item</button>
        <button onclick="gameOwnerPanel.action('bulk_edit_items')" style="padding: 10px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px">📝 Bulk Edit</button>
      </div>
      <div style="background: rgba(201,135,62,0.1); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.3)">
        <input type="text" placeholder="Search items..." style="width: 100%; padding: 8px; margin-bottom: 10px; background: #1a1b20; border: 1px solid #c9873e; color: #fff">
        <div style="max-height: 400px; overflow-y: auto; font-size: 12px; color: #aaa">
          Loading items...
        </div>
      </div>
    `;
  }

  _renderMonstersManager() {
    return `
      <h2 style="color: #c9873e">Monsters Manager</h2>
      <p style="color: #aaa">Configure monsters, drops, boss mechanics, and spawn rates.</p>
      <button onclick="gameOwnerPanel.action('create_monster')" style="padding: 10px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; margin-bottom: 15px">+ New Monster</button>
      <div style="background: rgba(201,135,62,0.1); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.3)">
        <div style="font-size: 12px; color: #aaa">Loading monsters...</div>
      </div>
    `;
  }

  _renderNPCsManager() {
    return `
      <h2 style="color: #c9873e">NPCs Manager</h2>
      <p style="color: #aaa">Create NPCs, dialogue trees, quests, and interactions.</p>
      <button onclick="gameOwnerPanel.action('create_npc')" style="padding: 10px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; margin-bottom: 15px">+ New NPC</button>
      <div style="background: rgba(201,135,62,0.1); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.3)">
        <div style="font-size: 12px; color: #aaa">Loading NPCs...</div>
      </div>
    `;
  }

  _renderQuestsManager() {
    return `
      <h2 style="color: #c9873e">Quests Manager</h2>
      <p style="color: #aaa">Create quest chains, manage rewards, and track completion rates.</p>
      <button onclick="gameOwnerPanel.action('create_quest')" style="padding: 10px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; margin-bottom: 15px">+ New Quest</button>
      <div style="background: rgba(201,135,62,0.1); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.3)">
        <div style="font-size: 12px; color: #aaa">Loading quests...</div>
      </div>
    `;
  }

  _renderBalancingTools() {
    return `
      <h2 style="color: #c9873e">Balancing Tools</h2>
      <p style="color: #aaa">Adjust XP rates, drop rates, difficulty, and economy multipliers.</p>
      <div style="background: rgba(201,135,62,0.1); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.3); margin-bottom: 20px">
        <div style="margin-bottom: 15px">
          <label style="display: block; margin-bottom: 5px; color: #c9873e">XP Multiplier</label>
          <input type="range" min="0.5" max="5" step="0.1" value="1" style="width: 100%">
          <small style="color: #aaa">Current: 1.0x</small>
        </div>
        <div style="margin-bottom: 15px">
          <label style="display: block; margin-bottom: 5px; color: #c9873e">Drop Rate Multiplier</label>
          <input type="range" min="0.5" max="5" step="0.1" value="1" style="width: 100%">
          <small style="color: #aaa">Current: 1.0x</small>
        </div>
        <div style="margin-bottom: 15px">
          <label style="display: block; margin-bottom: 5px; color: #c9873e">Gold Multiplier</label>
          <input type="range" min="0.5" max="5" step="0.1" value="1" style="width: 100%">
          <small style="color: #aaa">Current: 1.0x</small>
        </div>
      </div>
      <button onclick="gameOwnerPanel.action('apply_multipliers')" style="padding: 10px; width: 100%; background: rgba(74,138,62,0.5); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px">Apply Changes</button>
    `;
  }

  _renderSystemsManager() {
    return `
      <h2 style="color: #c9873e">Systems Manager</h2>
      <p style="color: #aaa">Configure game systems, events, raids, and seasonal content.</p>
      <div style="display: grid; grid-template-columns: 1fr; gap: 10px">
        <button onclick="gameOwnerPanel.action('manage_events')" style="padding: 10px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px">📅 Manage Events</button>
        <button onclick="gameOwnerPanel.action('manage_raids')" style="padding: 10px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px">⚔ Manage Raids</button>
        <button onclick="gameOwnerPanel.action('seasonal_content')" style="padding: 10px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px">❄ Seasonal Content</button>
        <button onclick="gameOwnerPanel.action('event_schedule')" style="padding: 10px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px">📋 Event Schedule</button>
      </div>
    `;
  }

  setSection(section) {
    this.currentSection = section;
    this.render();
  }

  async action(actionName) {
    console.log(`[Admin] Action: ${actionName}`);
    // This will be expanded with actual functionality
    alert(`Action: ${actionName} - Implementation pending`);
  }

  open() {
    this.isOpen = true;
    this.render();
  }

  close() {
    this.isOpen = false;
    const panel = document.getElementById('admin-panel');
    if (panel) panel.style.display = 'none';
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }
}

const gameOwnerPanel = new GameOwnerPanel();
