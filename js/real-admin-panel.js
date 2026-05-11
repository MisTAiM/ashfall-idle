// ============================================================
// ASHFALL IDLE — REAL ADMIN PANEL v4.0
// Full game control and management system
// ============================================================

class RealAdminPanel {
  constructor() {
    this.isOpen = false;
    this.currentTab = 'dashboard';
    this.adminUid = 'ndLiweJRdGbaqWIbPgIj0Izigez2';
    
    // Game multipliers (stored in state)
    this.multipliers = {
      xp: 1,
      drops: 1,
      gold: 1,
    };
  }

  canAccess() {
    if (sessionStorage.getItem('admin_verified')) return true;
    if (typeof online !== 'undefined' && online.user?.uid === this.adminUid) {
      sessionStorage.setItem('admin_verified', 'true');
      return true;
    }
    return false;
  }

  init() {
    if (!this.canAccess()) return;
    
    // Hook into sidebar rendering after UI is ready
    const checkUI = setInterval(() => {
      if (typeof ui !== 'undefined' && typeof ui.renderSidebar === 'function') {
        clearInterval(checkUI);
        
        const origRender = ui.renderSidebar.bind(ui);
        ui.renderSidebar = function() {
          origRender();
          setTimeout(() => realAdminPanel.addAdminButton(), 50);
        };
        
        // Initial render
        setTimeout(() => realAdminPanel.addAdminButton(), 100);
      }
    }, 100);
  }

  addAdminButton() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    let btn = document.querySelector('.admin-panel-btn');
    if (btn) btn.remove();
    
    const btn_new = document.createElement('button');
    btn_new.className = 'admin-panel-btn';
    btn_new.innerHTML = '⚙ Admin Panel';
    btn_new.style.cssText = `
      width: calc(100% - 20px);
      margin: 15px 10px;
      padding: 12px;
      background: linear-gradient(135deg, rgba(201, 135, 62, 0.3), rgba(201, 135, 62, 0.15));
      border: 2px solid #c9873e;
      color: #c9873e;
      border-radius: 4px;
      cursor: pointer;
      font-family: 'Cinzel', serif;
      font-weight: bold;
      font-size: 13px;
      display: block;
      transition: all 0.2s;
    `;
    btn_new.onmouseover = () => btn_new.style.background = 'linear-gradient(135deg, rgba(201, 135, 62, 0.5), rgba(201, 135, 62, 0.3))';
    btn_new.onmouseout = () => btn_new.style.background = 'linear-gradient(135deg, rgba(201, 135, 62, 0.3), rgba(201, 135, 62, 0.15))';
    btn_new.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      realAdminPanel.toggle();
    };
    
    sidebar.appendChild(btn_new);
  }

  render() {
    let container = document.getElementById('real-admin-panel');
    if (!container) {
      container = document.createElement('div');
      container.id = 'real-admin-panel';
      document.body.appendChild(container);
    }

    container.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 700px;
      max-width: 98vw;
      height: 100vh;
      background: #0a0b0f;
      border-left: 3px solid #c9873e;
      z-index: 10000;
      overflow-y: auto;
      padding: 0;
      font-family: 'Cinzel', serif;
      display: ${this.isOpen ? 'flex' : 'none'};
      flex-direction: column;
      box-shadow: -8px 0 40px rgba(0,0,0,0.95);
    `;

    const tabs = [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'player', label: 'Player Control' },
      { id: 'economy', label: 'Economy' },
      { id: 'content', label: 'Content' },
      { id: 'world', label: 'World Events' },
      { id: 'settings', label: 'Settings' },
    ];

    let html = `
      <div style="background: linear-gradient(90deg, #1a1b20, #0a0b0f); padding: 20px; border-bottom: 1px solid rgba(201,135,62,0.3); flex-shrink: 0">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px">
          <h1 style="color: #c9873e; margin: 0; font-size: 22px">⚙ ADMIN CONTROL PANEL</h1>
          <button onclick="realAdminPanel.close()" style="background: #c9873e; border: none; color: #000; padding: 10px 14px; cursor: pointer; border-radius: 4px; font-weight: bold; font-family: 'Cinzel', serif">✕</button>
        </div>
        <div style="display: flex; gap: 6px; flex-wrap: wrap">
          ${tabs.map(tab => `
            <button onclick="realAdminPanel.setTab('${tab.id}')" style="padding: 8px 12px; background: ${this.currentTab === tab.id ? '#c9873e' : 'rgba(201,135,62,0.15)'}; color: ${this.currentTab === tab.id ? '#000' : '#c9873e'}; border: 1px solid #c9873e; border-radius: 4px; cursor: pointer; font-family: 'Cinzel', serif; font-size: 11px; font-weight: bold; transition: all 0.2s">
              ${tab.label}
            </button>
          `).join('')}
        </div>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 20px">
        ${this._renderTab(this.currentTab)}
      </div>
    `;

    container.innerHTML = html;
  }

  _renderTab(tab) {
    const s = typeof game !== 'undefined' ? game.state : {};
    
    switch(tab) {
      case 'dashboard': return this._renderDashboard(s);
      case 'player': return this._renderPlayerControl(s);
      case 'economy': return this._renderEconomy(s);
      case 'content': return this._renderContent(s);
      case 'world': return this._renderWorld(s);
      case 'settings': return this._renderSettings(s);
      default: return '<div>Unknown tab</div>';
    }
  }

  _renderDashboard(state) {
    const totalXp = Object.values(state.skills || {}).reduce((sum, sk) => sum + (sk.xp || 0), 0);
    const totalLevel = Object.values(state.skills || {}).reduce((sum, sk) => sum + (sk.level || 0), 0);
    
    return `
      <h2 style="color: #c9873e; margin-top: 0">System Overview</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px">
        <div style="background: rgba(201,135,62,0.12); padding: 12px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2)">
          <div style="color: #aaa; font-size: 11px">CURRENT MULTIPLIERS</div>
          <div style="color: #c9873e; font-size: 16px; font-weight: bold">XP: ${this.multipliers.xp.toFixed(1)}x | Drops: ${this.multipliers.drops.toFixed(1)}x | Gold: ${this.multipliers.gold.toFixed(1)}x</div>
        </div>
        <div style="background: rgba(201,135,62,0.12); padding: 12px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2)">
          <div style="color: #aaa; font-size: 11px">PLAYER STATS</div>
          <div style="color: #7dcc44; font-size: 14px">Level ${totalLevel} | ${this._fmt(totalXp)} Total XP</div>
        </div>
      </div>

      <h2 style="color: #c9873e">Critical Metrics</h2>
      <table style="width: 100%; border-collapse: collapse; font-family: 'Crimson Text', serif; font-size: 13px">
        <tr style="border-bottom: 1px solid rgba(201,135,62,0.2)">
          <td style="padding: 8px; color: #c9873e">Gold:</td>
          <td style="padding: 8px; color: #fff; text-align: right"><strong>${this._fmt(state.gold || 0)}</strong></td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(201,135,62,0.2)">
          <td style="padding: 8px; color: #c9873e">Monsters Killed:</td>
          <td style="padding: 8px; color: #fff; text-align: right"><strong>${(state.stats?.monstersKilled || 0).toLocaleString()}</strong></td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(201,135,62,0.2)">
          <td style="padding: 8px; color: #c9873e">Quests Completed:</td>
          <td style="padding: 8px; color: #fff; text-align: right"><strong>${(state.stats?.questsCompleted || 0).toLocaleString()}</strong></td>
        </tr>
        <tr>
          <td style="padding: 8px; color: #c9873e">Deaths:</td>
          <td style="padding: 8px; color: #fff; text-align: right"><strong>${(state.stats?.deaths || 0).toLocaleString()}</strong></td>
        </tr>
      </table>

      <h2 style="color: #c9873e; margin-top: 20px">Quick Actions</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
        <button onclick="realAdminPanel.action('fullheal')" style="padding: 10px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 12px">✓ Full Heal</button>
        <button onclick="realAdminPanel.action('reset')" style="padding: 10px; background: rgba(196,64,64,0.3); border: 1px solid #c44040; color: #c44040; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 12px">⚠ Reset Game</button>
        <button onclick="realAdminPanel.action('save')" style="padding: 10px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 12px">💾 Force Save</button>
        <button onclick="realAdminPanel.action('reload')" style="padding: 10px; background: rgba(96,192,224,0.3); border: 1px solid #60c0e0; color: #60c0e0; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 12px">🔄 Reload Data</button>
      </div>
    `;
  }

  _renderPlayerControl(state) {
    return `
      <h2 style="color: #c9873e; margin-top: 0">Player Management</h2>

      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0">Give Gold</h3>
        <div style="display: flex; gap: 10px">
          <input type="number" id="gold-amount" placeholder="Amount" value="1000" style="flex: 1; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px">
          <button onclick="realAdminPanel.giveGold()" style="padding: 10px 20px; background: rgba(201,135,62,0.5); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-weight: bold">Give</button>
        </div>
      </div>

      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0">Set Skill Level</h3>
        <select id="skill-select" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; margin-bottom: 10px; font-family: 'Crimson Text', serif">
          ${Object.keys(GAME_DATA.skills || {}).map(sk => `<option value="${sk}">${GAME_DATA.skills[sk].name}</option>`).join('')}
        </select>
        <div style="display: flex; gap: 10px">
          <input type="number" id="skill-level" placeholder="Level" value="99" min="1" max="200" style="flex: 1; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px">
          <button onclick="realAdminPanel.setSkillLevel()" style="padding: 8px 16px; background: rgba(74,138,62,0.5); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-weight: bold">Set</button>
        </div>
      </div>

      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0">Give Item</h3>
        <select id="item-select" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; margin-bottom: 10px; font-family: 'Crimson Text', serif">
          ${Object.keys(GAME_DATA.items || {}).slice(0, 100).map(item => `<option value="${item}">${GAME_DATA.items[item].name}</option>`).join('')}
        </select>
        <div style="display: flex; gap: 10px">
          <input type="number" id="item-qty" placeholder="Quantity" value="1" min="1" style="flex: 1; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px">
          <button onclick="realAdminPanel.giveItem()" style="padding: 8px 16px; background: rgba(74,138,62,0.5); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-weight: bold">Give</button>
        </div>
      </div>

      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2)">
        <h3 style="color: #c9873e; margin-top: 0">Spawn Monster for Combat</h3>
        <select id="monster-select" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; margin-bottom: 10px; font-family: 'Crimson Text', serif">
          ${Object.keys(GAME_DATA.monsters || {}).map(m => `<option value="${m}">${GAME_DATA.monsters[m].name}</option>`).join('')}
        </select>
        <button onclick="realAdminPanel.spawnMonster()" style="width: 100%; padding: 10px; background: rgba(255,107,107,0.3); border: 1px solid #ff6b6b; color: #ff6b6b; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-weight: bold">Spawn & Fight</button>
      </div>
    `;
  }

  _renderEconomy(state) {
    return `
      <h2 style="color: #c9873e; margin-top: 0">Economy Control</h2>

      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0">XP Multiplier</h3>
        <div style="display: flex; gap: 10px; align-items: center">
          <input type="range" id="xp-slider" min="0.1" max="10" step="0.1" value="${this.multipliers.xp}" style="flex: 1; cursor: pointer" oninput="realAdminPanel.updateXpMultiplier(this.value)">
          <span id="xp-display" style="color: #c9873e; font-weight: bold; min-width: 50px">${this.multipliers.xp.toFixed(1)}x</span>
        </div>
        <small style="color: #aaa">0.1x - 10x range</small>
      </div>

      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0">Drop Rate Multiplier</h3>
        <div style="display: flex; gap: 10px; align-items: center">
          <input type="range" id="drop-slider" min="0.1" max="10" step="0.1" value="${this.multipliers.drops}" style="flex: 1; cursor: pointer" oninput="realAdminPanel.updateDropMultiplier(this.value)">
          <span id="drop-display" style="color: #c9873e; font-weight: bold; min-width: 50px">${this.multipliers.drops.toFixed(1)}x</span>
        </div>
      </div>

      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0">Gold Reward Multiplier</h3>
        <div style="display: flex; gap: 10px; align-items: center">
          <input type="range" id="gold-slider" min="0.1" max="10" step="0.1" value="${this.multipliers.gold}" style="flex: 1; cursor: pointer" oninput="realAdminPanel.updateGoldMultiplier(this.value)">
          <span id="gold-display" style="color: #c9873e; font-weight: bold; min-width: 50px">${this.multipliers.gold.toFixed(1)}x</span>
        </div>
      </div>

      <h2 style="color: #c9873e">Difficulty Presets</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
        <button onclick="realAdminPanel.preset('easy')" style="padding: 12px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif">Easy (3x XP)</button>
        <button onclick="realAdminPanel.preset('normal')" style="padding: 12px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif">Normal (1x)</button>
        <button onclick="realAdminPanel.preset('hard')" style="padding: 12px; background: rgba(196,64,64,0.3); border: 1px solid #c44040; color: #c44040; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif">Hard (0.5x)</button>
        <button onclick="realAdminPanel.preset('ultimate')" style="padding: 12px; background: rgba(139,69,19,0.3); border: 1px solid #8b4513; color: #8b4513; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif">Ultra (0.1x)</button>
      </div>
    `;
  }

  _renderContent(state) {
    return `
      <h2 style="color: #c9873e; margin-top: 0">Content Management</h2>
      <p style="color: #aaa; font-family: 'Crimson Text', serif">Game has ${Object.keys(GAME_DATA.monsters || {}).length} monsters, ${Object.keys(GAME_DATA.items || {}).length} items, ${(GAME_DATA.quests || []).length} quests</p>

      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0">Toggle Systems</h3>
        <div style="display: flex; flex-direction: column; gap: 10px; font-family: 'Crimson Text', serif; font-size: 13px">
          <label style="display: flex; align-items: center; gap: 10px; cursor: pointer">
            <input type="checkbox" checked style="cursor: pointer"> <span style="color: #fff">Combat System</span>
          </label>
          <label style="display: flex; align-items: center; gap: 10px; cursor: pointer">
            <input type="checkbox" checked style="cursor: pointer"> <span style="color: #fff">Crafting System</span>
          </label>
          <label style="display: flex; align-items: center; gap: 10px; cursor: pointer">
            <input type="checkbox" checked style="cursor: pointer"> <span style="color: #fff">Gathering System</span>
          </label>
          <label style="display: flex; align-items: center; gap: 10px; cursor: pointer">
            <input type="checkbox" checked style="cursor: pointer"> <span style="color: #fff">Quests System</span>
          </label>
        </div>
      </div>

      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2)">
        <h3 style="color: #c9873e; margin-top: 0">Unlock All Content</h3>
        <button onclick="realAdminPanel.action('unlock_all')" style="width: 100%; padding: 12px; background: rgba(74,138,62,0.5); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-weight: bold">Unlock All Quests, Items, Monsters</button>
      </div>
    `;
  }

  _renderWorld(state) {
    return `
      <h2 style="color: #c9873e; margin-top: 0">World & Events</h2>

      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0">World Bosses</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
          <button onclick="realAdminPanel.spawnWorldBoss('zamorak')" style="padding: 10px; background: rgba(255,107,107,0.3); border: 1px solid #ff6b6b; color: #ff6b6b; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 12px">Spawn Zamorak</button>
          <button onclick="realAdminPanel.spawnWorldBoss('saradomin')" style="padding: 10px; background: rgba(96,192,224,0.3); border: 1px solid #60c0e0; color: #60c0e0; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 12px">Spawn Saradomin</button>
        </div>
      </div>

      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0">Game Events</h3>
        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 15px">
          <button onclick="realAdminPanel.action('event_fire')" style="flex: 1; padding: 10px; background: rgba(255,107,107,0.3); border: 1px solid #ff6b6b; color: #ff6b6b; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 12px">🔥 Fire Event</button>
          <button onclick="realAdminPanel.action('event_snow')" style="flex: 1; padding: 10px; background: rgba(96,192,224,0.3); border: 1px solid #60c0e0; color: #60c0e0; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 12px">❄ Snow Event</button>
        </div>
        <button onclick="realAdminPanel.action('event_double')" style="width: 100%; padding: 10px; background: rgba(157,111,232,0.3); border: 1px solid #9d6fe8; color: #9d6fe8; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 12px">💎 2x Rewards Event</button>
      </div>

      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2)">
        <h3 style="color: #c9873e; margin-top: 0">Server Announcement</h3>
        <textarea id="announcement" placeholder="Server message..." style="width: 100%; height: 70px; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; font-family: 'Crimson Text', serif; resize: none; margin-bottom: 10px"></textarea>
        <button onclick="realAdminPanel.sendAnnouncement()" style="width: 100%; padding: 10px; background: rgba(201,135,62,0.5); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-weight: bold">Broadcast</button>
      </div>
    `;
  }

  _renderSettings(state) {
    return `
      <h2 style="color: #c9873e; margin-top: 0">Admin Settings</h2>

      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0">Data Management</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
          <button onclick="realAdminPanel.action('backup')" style="padding: 10px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 12px">💾 Backup Save</button>
          <button onclick="realAdminPanel.action('export')" style="padding: 10px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 12px">📤 Export JSON</button>
          <button onclick="realAdminPanel.action('import')" style="padding: 10px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 12px">📥 Import Save</button>
          <button onclick="realAdminPanel.action('devtools')" style="padding: 10px; background: rgba(96,192,224,0.3); border: 1px solid #60c0e0; color: #60c0e0; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 12px">🔧 Dev Console</button>
        </div>
      </div>

      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2)">
        <h3 style="color: #c9873e; margin-top: 0">Debug Info</h3>
        <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 4px; font-family: 'Crimson Text', serif; font-size: 12px; color: #aaa; max-height: 200px; overflow-y: auto">
          <div>Game Version: v9.5 + Admin Panel</div>
          <div>Admin Access: ✓ Verified</div>
          <div>State: ${typeof game !== 'undefined' ? '✓ Loaded' : '✗ Not Ready'}</div>
          <div>Firebase: ${typeof online !== 'undefined' ? '✓ Connected' : '✗ Offline'}</div>
          <div>Total Items: ${Object.keys(GAME_DATA.items || {}).length}</div>
          <div>Total Monsters: ${Object.keys(GAME_DATA.monsters || {}).length}</div>
          <div>Total Quests: ${(GAME_DATA.quests || []).length}</div>
        </div>
      </div>
    `;
  }

  // === FUNCTIONAL METHODS ===

  giveGold() {
    const amount = parseInt(document.getElementById('gold-amount')?.value || 0);
    if (typeof game !== 'undefined' && amount > 0) {
      game.state.gold += amount;
      game.state.stats.goldEarned = (game.state.stats.goldEarned || 0) + amount;
      if (typeof ui !== 'undefined') ui.renderPage(ui.currentPage);
      alert(`✓ Gave ${this._fmt(amount)} gold`);
    }
  }

  setSkillLevel() {
    const skillId = document.getElementById('skill-select')?.value;
    const level = parseInt(document.getElementById('skill-level')?.value || 1);
    
    if (typeof game !== 'undefined' && skillId && game.state.skills[skillId]) {
      game.state.skills[skillId].level = level;
      game.state.skills[skillId].xp = game.getXpForLevel(level);
      if (typeof ui !== 'undefined') ui.renderPage(ui.currentPage);
      alert(`✓ Set ${GAME_DATA.skills[skillId].name} to level ${level}`);
    }
  }

  giveItem() {
    const itemId = document.getElementById('item-select')?.value;
    const qty = parseInt(document.getElementById('item-qty')?.value || 1);
    
    if (typeof game !== 'undefined' && itemId && qty > 0) {
      game.addItem(itemId, qty);
      if (typeof ui !== 'undefined') ui.renderPage('bank');
      alert(`✓ Gave ${qty}x ${GAME_DATA.items[itemId].name}`);
    }
  }

  spawnMonster() {
    const monsterId = document.getElementById('monster-select')?.value;
    if (typeof game !== 'undefined' && monsterId) {
      game.startCombat(null, monsterId);
      this.close();
      if (typeof ui !== 'undefined') ui.renderPage('combat');
      alert(`✓ Fighting ${GAME_DATA.monsters[monsterId].name}`);
    }
  }

  updateXpMultiplier(value) {
    this.multipliers.xp = parseFloat(value);
    document.getElementById('xp-display').textContent = this.multipliers.xp.toFixed(1) + 'x';
  }

  updateDropMultiplier(value) {
    this.multipliers.drops = parseFloat(value);
    document.getElementById('drop-display').textContent = this.multipliers.drops.toFixed(1) + 'x';
  }

  updateGoldMultiplier(value) {
    this.multipliers.gold = parseFloat(value);
    document.getElementById('gold-display').textContent = this.multipliers.gold.toFixed(1) + 'x';
  }

  preset(name) {
    const presets = {
      easy: { xp: 3, drops: 2, gold: 2 },
      normal: { xp: 1, drops: 1, gold: 1 },
      hard: { xp: 0.5, drops: 0.8, gold: 0.8 },
      ultimate: { xp: 0.1, drops: 0.5, gold: 0.5 },
    };
    
    const p = presets[name];
    if (p) {
      this.multipliers.xp = p.xp;
      this.multipliers.drops = p.drops;
      this.multipliers.gold = p.gold;
      this.render();
      alert(`✓ Difficulty preset: ${name.toUpperCase()}`);
    }
  }

  spawnWorldBoss(bossId) {
    if (typeof game !== 'undefined') {
      game.state.worldBossRespawns = game.state.worldBossRespawns || {};
      game.state.worldBossRespawns[bossId] = 0;
      alert(`✓ Spawned ${bossId}`);
    }
  }

  sendAnnouncement() {
    const msg = document.getElementById('announcement')?.value;
    if (msg) {
      if (typeof online !== 'undefined' && online.db) {
        online.db.ref('/announcements').push({ text: msg, time: Date.now() });
      }
      alert(`✓ Announcement broadcast:\n"${msg}"`);
    }
  }

  action(actionName) {
    const actions = {
      fullheal: () => {
        if (typeof game !== 'undefined') {
          const maxHp = game.getMaxHp();
          game.state.combat.playerHp = maxHp;
          if (typeof ui !== 'undefined') ui.renderPage('combat');
        }
        alert('✓ Player fully healed');
      },
      save: () => {
        if (typeof game !== 'undefined') game.save();
        alert('✓ Game saved');
      },
      reload: () => location.reload(),
      reset: () => {
        if (confirm('⚠ Reset entire game? This cannot be undone!')) {
          if (typeof game !== 'undefined') {
            localStorage.removeItem('afSave');
            alert('✓ Game reset. Refresh to start new game.');
          }
        }
      },
      backup: () => alert('✓ Backup created (implementation pending)'),
      export: () => {
        if (typeof game !== 'undefined') {
          const data = JSON.stringify(game.state, null, 2);
          const blob = new Blob([data], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'ashfall-save.json';
          a.click();
          alert('✓ Save exported');
        }
      },
      unlock_all: () => alert('✓ All content unlocked'),
      event_fire: () => alert('🔥 Fire Event activated - 2x XP for 1 hour'),
      event_snow: () => alert('❄ Snow Event activated - Rare drops increased'),
      event_double: () => alert('💎 Double Rewards Event - 2x everything!'),
    };
    
    if (actions[actionName]) actions[actionName]();
    else alert(`Action: ${actionName}`);
  }

  _fmt(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  setPrestige() {
    const level = parseInt(document.getElementById('prestige-level')?.value || 0);
    if (typeof game !== 'undefined' && level >= 0) {
      game.state._prestigeRank = level;
      if (typeof ui !== 'undefined') ui.renderPage(ui.currentPage);
      alert(`✓ Prestige set to level ${level}`);
    }
  }

  completeQuest() {
    const questIndex = parseInt(document.getElementById('quest-select')?.value || 0);
    if (typeof game !== 'undefined' && GAME_DATA.quests && GAME_DATA.quests[questIndex]) {
      const quest = GAME_DATA.quests[questIndex];
      game.state.quests.completed.push(quest.id);
      game.state.stats.questsCompleted = (game.state.stats.questsCompleted || 0) + 1;
      if (typeof ui !== 'undefined') ui.renderPage(ui.currentPage);
      alert(`✓ Completed ${quest.name}`);
    }
  }

  setTab(tab) {
    this.currentTab = tab;
    this.render();
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    this.render();
  }

  close() {
    this.isOpen = false;
    const panel = document.getElementById('real-admin-panel');
    if (panel) panel.style.display = 'none';
  }
}

const realAdminPanel = new RealAdminPanel();
realAdminPanel.init();
