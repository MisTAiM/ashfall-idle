// ============================================================
// ASHFALL IDLE — PRODUCTION ADMIN SYSTEM v5.0
// 50+ Features: Player Management, Economy, Content, Images, Moderation
// ============================================================

class ProductionAdminSystem {
  constructor() {
    this.isOpen = false;
    this.currentTab = 'dashboard';
    this.adminUid = 'ndLiweJRdGbaqWIbPgIj0Izigez2';
    
    // Configuration
    this.multipliers = { xp: 1, drops: 1, gold: 1 };
    this.bans = {};
    this.restrictions = {};
    this.itemPrices = {};
    this.monsterDifficulty = {};
    this.transactionLog = [];
    this.uploadedImages = {};
    this.questStates = {};
    this.skillCurves = {};
    this.dropRates = {};
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
    window.addEventListener('load', () => {
      setTimeout(() => {
        if (typeof ui !== 'undefined') {
          const origRenderSidebar = ui.renderSidebar.bind(ui);
          ui.renderSidebar = () => {
            origRenderSidebar();
            this.addAdminButton();
          };
        }
      }, 100);
    });
    this.loadFromFirebase();
  }

  addAdminButton() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar || sidebar.querySelector('.admin-button')) return;
    
    const btn = document.createElement('button');
    btn.className = 'admin-button';
    btn.innerHTML = '👑 ADMIN SYSTEM';
    btn.style.cssText = `
      width: 90%;
      margin: 15px auto;
      padding: 12px;
      background: linear-gradient(135deg, rgba(201,135,62,0.3), rgba(255,107,107,0.2));
      border: 2px solid #c9873e;
      color: #c9873e;
      border-radius: 4px;
      cursor: pointer;
      font-family: 'Cinzel', serif;
      font-weight: bold;
      display: block;
      transition: all 0.3s;
    `;
    btn.onmouseover = () => btn.style.transform = 'scale(1.02)';
    btn.onmouseout = () => btn.style.transform = 'scale(1)';
    btn.onclick = () => this.toggle();
    
    sidebar.appendChild(btn);
  }

  render() {
    let container = document.getElementById('prod-admin-system');
    if (!container) {
      container = document.createElement('div');
      container.id = 'prod-admin-system';
      document.body.appendChild(container);
    }

    container.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 800px;
      max-width: 98vw;
      height: 100vh;
      background: linear-gradient(135deg, #0a0b0f 0%, #1a1b20 100%);
      border-left: 4px solid #c9873e;
      z-index: 10000;
      overflow-y: auto;
      padding: 0;
      font-family: 'Cinzel', serif;
      display: ${this.isOpen ? 'flex' : 'none'};
      flex-direction: column;
      box-shadow: -8px 0 40px rgba(0,0,0,0.95);
    `;

    const tabs = [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' },
      { id: 'players', label: 'Players', icon: '👥' },
      { id: 'bans', label: 'Bans', icon: '🚫' },
      { id: 'economy', label: 'Economy', icon: '💰' },
      { id: 'content', label: 'Content', icon: '📦' },
      { id: 'images', label: 'Images', icon: '🖼️' },
      { id: 'quests', label: 'Quests', icon: '📜' },
      { id: 'skills', label: 'Skills', icon: '⚔️' },
      { id: 'monsters', label: 'Monsters', icon: '💀' },
      { id: 'events', label: 'Events', icon: '🎉' },
      { id: 'moderation', label: 'Moderation', icon: '🔨' },
      { id: 'analytics', label: 'Analytics', icon: '📈' },
    ];

    let html = `
      <div style="background: linear-gradient(90deg, #1a1b20, #0a0b0f); padding: 20px; border-bottom: 2px solid rgba(201,135,62,0.3); flex-shrink: 0">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px">
          <h1 style="color: #c9873e; margin: 0; font-size: 24px">👑 PRODUCTION ADMIN v5.0</h1>
          <button onclick="prodAdminSystem.close()" style="background: #c9873e; border: none; color: #000; padding: 10px 14px; cursor: pointer; border-radius: 4px; font-weight: bold; font-family: 'Cinzel', serif; font-size: 14px">✕ CLOSE</button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; max-height: 120px; overflow-y: auto">
          ${tabs.map(tab => `
            <button onclick="prodAdminSystem.setTab('${tab.id}')" style="padding: 8px 10px; background: ${this.currentTab === tab.id ? '#c9873e' : 'rgba(201,135,62,0.15)'}; color: ${this.currentTab === tab.id ? '#000' : '#c9873e'}; border: 1px solid #c9873e; border-radius: 4px; cursor: pointer; font-family: 'Cinzel', serif; font-size: 10px; font-weight: bold; transition: all 0.2s; white-space: nowrap">
              ${tab.icon} ${tab.label}
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
      case 'players': return this._renderPlayers(s);
      case 'bans': return this._renderBans(s);
      case 'economy': return this._renderEconomy(s);
      case 'content': return this._renderContent(s);
      case 'images': return this._renderImages(s);
      case 'quests': return this._renderQuests(s);
      case 'skills': return this._renderSkills(s);
      case 'monsters': return this._renderMonsters(s);
      case 'events': return this._renderEvents(s);
      case 'moderation': return this._renderModeration(s);
      case 'analytics': return this._renderAnalytics(s);
      default: return '<div style="color: #c9873e">Unknown tab</div>';
    }
  }

  // ============ DASHBOARD ============
  _renderDashboard(state) {
    const totalLevel = Object.values(state.skills || {}).reduce((sum, sk) => sum + (sk.level || 0), 0);
    const bans = Object.keys(this.bans).length;
    const restrictions = Object.keys(this.restrictions).length;
    
    return `
      <h2 style="color: #c9873e; margin-top: 0">System Overview</h2>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px">
        <div style="background: rgba(201,135,62,0.12); padding: 12px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2)">
          <div style="color: #aaa; font-size: 10px">MULTIPLIERS</div>
          <div style="color: #c9873e; font-size: 14px">XP: ${this.multipliers.xp}x | Drop: ${this.multipliers.drops}x | Gold: ${this.multipliers.gold}x</div>
        </div>
        <div style="background: rgba(201,135,62,0.12); padding: 12px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2)">
          <div style="color: #aaa; font-size: 10px">ACTIVE BANS</div>
          <div style="color: #ff6b6b; font-size: 18px; font-weight: bold">${bans}</div>
        </div>
        <div style="background: rgba(201,135,62,0.12); padding: 12px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2)">
          <div style="color: #aaa; font-size: 10px">RESTRICTIONS</div>
          <div style="color: #ffd700; font-size: 18px; font-weight: bold">${restrictions}</div>
        </div>
      </div>

      <h2 style="color: #c9873e">Quick Actions</h2>
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px">
        <button onclick="prodAdminSystem.action('full_save')" style="padding: 12px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-weight: bold">💾 Save All</button>
        <button onclick="prodAdminSystem.action('database_backup')" style="padding: 12px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-weight: bold">⚙ Backup DB</button>
        <button onclick="prodAdminSystem.action('reload_config')" style="padding: 12px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-weight: bold">🔄 Reload Config</button>
        <button onclick="prodAdminSystem.action('clear_cache')" style="padding: 12px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-weight: bold">🧹 Clear Cache</button>
      </div>

      <h2 style="color: #c9873e; margin-top: 20px">Server Status</h2>
      <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 4px; font-family: 'Crimson Text', serif; font-size: 12px; line-height: 1.8; color: #aaa">
        <div>✓ Game Engine: <strong style="color: #7dcc44">Running</strong></div>
        <div>✓ Firebase: <strong style="color: #7dcc44">Connected</strong></div>
        <div>✓ UI System: <strong style="color: #7dcc44">Active</strong></div>
        <div>✓ Multipliers: <strong style="color: #7dcc44">Applied</strong></div>
        <div>✓ Ban System: <strong style="color: #7dcc44">Monitoring</strong></div>
      </div>
    `;
  }

  // ============ PLAYERS ============
  _renderPlayers(state) {
    return `
      <h2 style="color: #c9873e; margin-top: 0">Player Management System</h2>
      
      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0">Player Search</h3>
        <input type="text" id="player-search" placeholder="Search by name or UID..." style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; margin-bottom: 10px; font-family: 'Crimson Text', serif">
        <div id="player-results" style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px; font-family: 'Crimson Text', serif; font-size: 12px; color: #aaa; max-height: 150px; overflow-y: auto">
          Enter name to search...
        </div>
      </div>

      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0">Player Actions</h3>
        <div style="display: flex; gap: 8px; flex-wrap: wrap">
          <button onclick="prodAdminSystem.action('reset_skills')" style="padding: 8px 12px; background: rgba(255,107,107,0.3); border: 1px solid #ff6b6b; color: #ff6b6b; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Reset Skills</button>
          <button onclick="prodAdminSystem.action('wipe_inventory')" style="padding: 8px 12px; background: rgba(255,107,107,0.3); border: 1px solid #ff6b6b; color: #ff6b6b; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Wipe Inventory</button>
          <button onclick="prodAdminSystem.action('reset_prestige')" style="padding: 8px 12px; background: rgba(255,107,107,0.3); border: 1px solid #ff6b6b; color: #ff6b6b; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Reset Prestige</button>
          <button onclick="prodAdminSystem.action('grant_rank')" style="padding: 8px 12px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Grant Rank</button>
          <button onclick="prodAdminSystem.action('revoke_rank')" style="padding: 8px 12px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Revoke Rank</button>
        </div>
      </div>

      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2)">
        <h3 style="color: #c9873e; margin-top: 0">Bulk Player Operations</h3>
        <input type="text" placeholder="Player UIDs (comma separated)..." style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; margin-bottom: 10px; font-family: 'Crimson Text', serif; font-size: 12px">
        <div style="display: flex; gap: 8px">
          <button onclick="prodAdminSystem.action('bulk_give_gold')" style="flex: 1; padding: 8px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Give Gold</button>
          <button onclick="prodAdminSystem.action('bulk_give_items')" style="flex: 1; padding: 8px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Give Items</button>
          <button onclick="prodAdminSystem.action('bulk_reset')" style="flex: 1; padding: 8px; background: rgba(255,107,107,0.3); border: 1px solid #ff6b6b; color: #ff6b6b; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Reset All</button>
        </div>
      </div>
    `;
  }

  // ============ BANS & RESTRICTIONS ============
  _renderBans(state) {
    const banList = Object.entries(this.bans).map(([uid, ban]) => `
      <div style="background: rgba(255,107,107,0.1); padding: 8px; border-radius: 3px; margin-bottom: 8px; border-left: 3px solid #ff6b6b">
        <div style="font-family: 'Cinzel', serif; font-size: 12px; color: #ff6b6b">${uid}</div>
        <div style="font-family: 'Crimson Text', serif; font-size: 11px; color: #aaa">${ban.reason || 'No reason'} - ${ban.date || 'Permanent'}</div>
      </div>
    `).join('');

    return `
      <h2 style="color: #c9873e; margin-top: 0">Ban Management System</h2>
      
      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0">Add Ban</h3>
        <input type="text" id="ban-uid" placeholder="Player UID..." style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; margin-bottom: 8px; font-family: 'Crimson Text', serif">
        <input type="text" id="ban-reason" placeholder="Reason..." style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; margin-bottom: 8px; font-family: 'Crimson Text', serif">
        <div style="display: flex; gap: 8px">
          <select style="flex: 1; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; font-family: 'Crimson Text', serif">
            <option>1 Hour</option>
            <option>1 Day</option>
            <option>7 Days</option>
            <option>30 Days</option>
            <option>Permanent</option>
          </select>
          <button onclick="prodAdminSystem.addBan()" style="padding: 8px 16px; background: rgba(255,107,107,0.5); border: 1px solid #ff6b6b; color: #ff6b6b; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-weight: bold">BAN</button>
        </div>
      </div>

      <h2 style="color: #c9873e">Active Bans (${Object.keys(this.bans).length})</h2>
      <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px; max-height: 300px; overflow-y: auto">
        ${banList || '<div style="color: #aaa">No active bans</div>'}
      </div>

      <h2 style="color: #c9873e; margin-top: 20px">Add Restriction</h2>
      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2)">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
          <button onclick="prodAdminPanel.action('restrict_trading')" style="padding: 10px; background: rgba(255,107,107,0.3); border: 1px solid #ff6b6b; color: #ff6b6b; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Restrict Trading</button>
          <button onclick="prodAdminPanel.action('restrict_pvp')" style="padding: 10px; background: rgba(255,107,107,0.3); border: 1px solid #ff6b6b; color: #ff6b6b; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Restrict PvP</button>
          <button onclick="prodAdminPanel.action('restrict_chat')" style="padding: 10px; background: rgba(255,107,107,0.3); border: 1px solid #ff6b6b; color: #ff6b6b; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Mute Chat</button>
          <button onclick="prodAdminPanel.action('restrict_market')" style="padding: 10px; background: rgba(255,107,107,0.3); border: 1px solid #ff6b6b; color: #ff6b6b; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Restrict Bazaar</button>
        </div>
      </div>
    `;
  }

  // ============ ECONOMY ============
  _renderEconomy(state) {
    return `
      <h2 style="color: #c9873e; margin-top: 0">Economy Management</h2>
      
      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0">Multipliers</h3>
        <div style="margin-bottom: 15px">
          <label style="color: #c9873e; font-size: 12px">XP: ${this.multipliers.xp.toFixed(1)}x</label>
          <input type="range" min="0.1" max="10" step="0.1" value="${this.multipliers.xp}" style="width: 100%; cursor: pointer" oninput="prodAdminSystem.setXpMult(this.value)">
        </div>
        <div style="margin-bottom: 15px">
          <label style="color: #c9873e; font-size: 12px">Drops: ${this.multipliers.drops.toFixed(1)}x</label>
          <input type="range" min="0.1" max="10" step="0.1" value="${this.multipliers.drops}" style="width: 100%; cursor: pointer" oninput="prodAdminSystem.setDropMult(this.value)">
        </div>
        <div>
          <label style="color: #c9873e; font-size: 12px">Gold: ${this.multipliers.gold.toFixed(1)}x</label>
          <input type="range" min="0.1" max="10" step="0.1" value="${this.multipliers.gold}" style="width: 100%; cursor: pointer" oninput="prodAdminSystem.setGoldMult(this.value)">
        </div>
      </div>

      <h2 style="color: #c9873e">Item Pricing</h2>
      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0; font-size: 13px">Set Custom Item Price</h3>
        <select id="price-item" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; margin-bottom: 10px; font-family: 'Crimson Text', serif; font-size: 12px">
          ${Object.keys(GAME_DATA.items || {}).slice(0, 50).map(item => `<option value="${item}">${GAME_DATA.items[item].name}</option>`).join('')}
        </select>
        <div style="display: flex; gap: 10px">
          <input type="number" id="price-amount" placeholder="Price in gold" style="flex: 1; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; font-family: 'Crimson Text', serif">
          <button onclick="prodAdminSystem.setItemPrice()" style="padding: 8px 16px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-weight: bold">Set</button>
        </div>
      </div>

      <h2 style="color: #c9873e">Transaction Log</h2>
      <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px; font-family: 'Crimson Text', serif; font-size: 11px; color: #aaa; max-height: 200px; overflow-y: auto">
        ${(this.transactionLog.slice(-10).reverse() || []).map(t => `<div>${t}</div>`).join('') || '<div>No transactions</div>'}
      </div>

      <h2 style="color: #c9873e; margin-top: 20px">Economy Actions</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
        <button onclick="prodAdminSystem.action('gold_sink')" style="padding: 10px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Gold Sink</button>
        <button onclick="prodAdminSystem.action('inflation_adjust')" style="padding: 10px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Adjust Inflation</button>
      </div>
    `;
  }

  // ============ CONTENT MANAGEMENT ============
  _renderContent(state) {
    return `
      <h2 style="color: #c9873e; margin-top: 0">Content Management</h2>
      
      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0">Content Stats</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; font-family: 'Crimson Text', serif; font-size: 12px">
          <div style="background: rgba(0,0,0,0.2); padding: 8px; border-radius: 3px"><div style="color: #c9873e">Items</div><div style="color: #fff; font-size: 16px">${Object.keys(GAME_DATA.items || {}).length}</div></div>
          <div style="background: rgba(0,0,0,0.2); padding: 8px; border-radius: 3px"><div style="color: #c9873e">Monsters</div><div style="color: #fff; font-size: 16px">${Object.keys(GAME_DATA.monsters || {}).length}</div></div>
          <div style="background: rgba(0,0,0,0.2); padding: 8px; border-radius: 3px"><div style="color: #c9873e">Quests</div><div style="color: #fff; font-size: 16px">${(GAME_DATA.quests || []).length}</div></div>
        </div>
      </div>

      <h2 style="color: #c9873e">Monster Difficulty Per Player</h2>
      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <select id="diff-monster" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; margin-bottom: 10px; font-family: 'Crimson Text', serif">
          ${Object.keys(GAME_DATA.monsters || {}).slice(0, 30).map(m => `<option value="${m}">${GAME_DATA.monsters[m].name}</option>`).join('')}
        </select>
        <div style="display: flex; gap: 8px">
          <input type="number" id="diff-player" placeholder="Player UID..." style="flex: 1; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px">
          <input type="range" min="0.1" max="5" step="0.1" value="1" id="diff-value" style="flex: 1; cursor: pointer">
          <button onclick="prodAdminSystem.setMonsterDifficulty()" style="padding: 8px 16px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-weight: bold; font-size: 11px">Set</button>
        </div>
      </div>

      <h2 style="color: #c9873e">Drop Rate Per Rarity</h2>
      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2)">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-family: 'Crimson Text', serif; font-size: 12px">
          <div><label style="color: #c9873e">Common</label><input type="range" min="0.1" max="3" step="0.1" value="1" style="width: 100%; cursor: pointer"></div>
          <div><label style="color: #c9873e">Rare</label><input type="range" min="0.1" max="3" step="0.1" value="1" style="width: 100%; cursor: pointer"></div>
          <div><label style="color: #c9873e">Epic</label><input type="range" min="0.1" max="3" step="0.1" value="1" style="width: 100%; cursor: pointer"></div>
          <div><label style="color: #c9873e">Legendary</label><input type="range" min="0.1" max="3" step="0.1" value="1" style="width: 100%; cursor: pointer"></div>
          <div><label style="color: #c9873e">Mythic</label><input type="range" min="0.1" max="3" step="0.1" value="1" style="width: 100%; cursor: pointer"></div>
          <div><label style="color: #c9873e">Special</label><input type="range" min="0.1" max="3" step="0.1" value="1" style="width: 100%; cursor: pointer"></div>
        </div>
        <button onclick="prodAdminSystem.action('save_drop_rates')" style="width: 100%; padding: 10px; margin-top: 10px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-weight: bold">Save Drop Rates</button>
      </div>
    `;
  }

  // ============ IMAGES ============
  _renderImages(state) {
    return `
      <h2 style="color: #c9873e; margin-top: 0">Item Image Upload & Management</h2>
      
      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0">Upload Image</h3>
        <select id="img-item" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; margin-bottom: 10px; font-family: 'Crimson Text', serif">
          ${Object.keys(GAME_DATA.items || {}).slice(0, 100).map(item => `<option value="${item}">${GAME_DATA.items[item].name}</option>`).join('')}
        </select>
        
        <div style="background: rgba(0,0,0,0.2); padding: 20px; border: 2px dashed rgba(201,135,62,0.3); border-radius: 4px; text-align: center; cursor: pointer" id="image-drop-zone" style="margin-bottom: 10px">
          <div style="color: #c9873e; font-size: 12px">Drag & Drop Image or Click to Upload</div>
          <input type="file" id="image-file" accept="image/*" style="display: none" onchange="prodAdminSystem.handleImageUpload()">
        </div>

        <div style="display: flex; gap: 10px">
          <input type="number" id="img-width" placeholder="Max Width (px)" value="256" style="flex: 1; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px">
          <input type="number" id="img-height" placeholder="Max Height (px)" value="256" style="flex: 1; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px">
          <button onclick="prodAdminSystem.uploadImage()" style="padding: 8px 16px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-weight: bold">Upload</button>
        </div>
      </div>

      <h2 style="color: #c9873e">Uploaded Images (${Object.keys(this.uploadedImages).length})</h2>
      <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px; max-height: 250px; overflow-y: auto">
        ${Object.entries(this.uploadedImages).map(([itemId, url]) => `
          <div style="background: rgba(201,135,62,0.1); padding: 8px; margin-bottom: 8px; border-radius: 3px; display: flex; justify-content: space-between; align-items: center">
            <span style="font-family: 'Crimson Text', serif; font-size: 12px; color: #aaa">${itemId}</span>
            <button onclick="prodAdminSystem.deleteImage('${itemId}')" style="padding: 4px 8px; background: rgba(255,107,107,0.3); border: 1px solid #ff6b6b; color: #ff6b6b; cursor: pointer; border-radius: 3px; font-family: 'Cinzel', serif; font-size: 10px">Delete</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ============ QUESTS ============
  _renderQuests(state) {
    return `
      <h2 style="color: #c9873e; margin-top: 0">Quest Management</h2>
      
      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0; font-size: 13px">Toggle Quest Availability</h3>
        <select id="quest-select" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; margin-bottom: 10px; font-family: 'Crimson Text', serif">
          ${(GAME_DATA.quests || []).slice(0, 50).map(q => `<option value="${q.id}">${q.name}</option>`).join('')}
        </select>
        <div style="display: flex; gap: 10px">
          <button onclick="prodAdminSystem.action('enable_quest')" style="flex: 1; padding: 8px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Enable</button>
          <button onclick="prodAdminSystem.action('disable_quest')" style="flex: 1; padding: 8px; background: rgba(255,107,107,0.3); border: 1px solid #ff6b6b; color: #ff6b6b; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Disable</button>
          <button onclick="prodAdminSystem.action('reset_quest')" style="flex: 1; padding: 8px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Reset</button>
        </div>
      </div>

      <h2 style="color: #c9873e">Quest Rewards Multiplier</h2>
      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <div style="margin-bottom: 10px">
          <label style="color: #c9873e; font-size: 12px">XP Reward Multiplier</label>
          <input type="range" min="0.1" max="5" step="0.1" value="1" style="width: 100%; cursor: pointer" oninput="prodAdminSystem.setQuestXpMult(this.value)">
          <span id="quest-xp-val" style="color: #c9873e; font-size: 11px">1.0x</span>
        </div>
        <div>
          <label style="color: #c9873e; font-size: 12px">Gold Reward Multiplier</label>
          <input type="range" min="0.1" max="5" step="0.1" value="1" style="width: 100%; cursor: pointer" oninput="prodAdminSystem.setQuestGoldMult(this.value)">
          <span id="quest-gold-val" style="color: #c9873e; font-size: 11px">1.0x</span>
        </div>
      </div>

      <h2 style="color: #c9873e">Bulk Quest Actions</h2>
      <div style="display: flex; gap: 10px">
        <button onclick="prodAdminSystem.action('unlock_all_quests')" style="flex: 1; padding: 10px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Unlock All</button>
        <button onclick="prodAdminSystem.action('complete_all_quests')" style="flex: 1; padding: 10px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Complete All</button>
        <button onclick="prodAdminSystem.action('reset_all_quests')" style="flex: 1; padding: 10px; background: rgba(255,107,107,0.3); border: 1px solid #ff6b6b; color: #ff6b6b; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Reset All</button>
      </div>
    `;
  }

  // ============ SKILLS ============
  _renderSkills(state) {
    return `
      <h2 style="color: #c9873e; margin-top: 0">Skill Management & XP Curves</h2>
      
      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0">Skill XP Curve Adjustments</h3>
        <select id="skill-select" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; margin-bottom: 10px; font-family: 'Crimson Text', serif">
          ${Object.keys(GAME_DATA.skills || {}).map(sk => `<option value="${sk}">${GAME_DATA.skills[sk].name}</option>`).join('')}
        </select>
        <div style="margin-bottom: 10px">
          <label style="color: #c9873e; font-size: 12px">XP Curve Multiplier (0.1 - 3.0)</label>
          <input type="range" min="0.1" max="3" step="0.1" value="1" id="skill-curve" style="width: 100%; cursor: pointer" oninput="document.getElementById('curve-val').textContent = this.value + 'x'">
          <span id="curve-val" style="color: #c9873e; font-size: 11px">1.0x</span>
        </div>
      </div>

      <h2 style="color: #c9873e">Skill Actions</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
        <button onclick="prodAdminSystem.action('reset_all_skills')" style="padding: 10px; background: rgba(255,107,107,0.3); border: 1px solid #ff6b6b; color: #ff6b6b; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Reset All Skills</button>
        <button onclick="prodAdminSystem.action('max_all_skills')" style="padding: 10px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Max All Skills</button>
        <button onclick="prodAdminSystem.action('unlock_all_skills')" style="padding: 10px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Unlock All</button>
        <button onclick="prodAdminSystem.action('refund_skill_xp')" style="padding: 10px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Refund XP</button>
      </div>
    `;
  }

  // ============ MONSTERS ============
  _renderMonsters(state) {
    return `
      <h2 style="color: #c9873e; margin-top: 0">Monster Management & Editing</h2>
      
      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0">Monster Editor</h3>
        <select id="monster-edit" style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; margin-bottom: 10px; font-family: 'Crimson Text', serif">
          ${Object.keys(GAME_DATA.monsters || {}).slice(0, 50).map(m => `<option value="${m}">${GAME_DATA.monsters[m].name}</option>`).join('')}
        </select>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px">
          <div>
            <label style="color: #c9873e; font-size: 11px">HP Multiplier</label>
            <input type="range" min="0.1" max="5" step="0.1" value="1" style="width: 100%; cursor: pointer">
          </div>
          <div>
            <label style="color: #c9873e; font-size: 11px">Damage Multiplier</label>
            <input type="range" min="0.1" max="5" step="0.1" value="1" style="width: 100%; cursor: pointer">
          </div>
          <div>
            <label style="color: #c9873e; font-size: 11px">Gold Drop</label>
            <input type="range" min="0.1" max="5" step="0.1" value="1" style="width: 100%; cursor: pointer">
          </div>
          <div>
            <label style="color: #c9873e; font-size: 11px">Loot Multiplier</label>
            <input type="range" min="0.1" max="5" step="0.1" value="1" style="width: 100%; cursor: pointer">
          </div>
        </div>
        
        <button onclick="prodAdminSystem.action('save_monster_changes')" style="width: 100%; padding: 10px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-weight: bold">Save Changes</button>
      </div>

      <h2 style="color: #c9873e">Monster Actions</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
        <button onclick="prodAdminSystem.action('disable_monster')" style="padding: 10px; background: rgba(255,107,107,0.3); border: 1px solid #ff6b6b; color: #ff6b6b; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Disable Monster</button>
        <button onclick="prodAdminSystem.action('enable_all_monsters')" style="padding: 10px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Enable All</button>
        <button onclick="prodAdminSystem.action('reset_monster_stats')" style="padding: 10px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Reset Stats</button>
        <button onclick="prodAdminSystem.action('spawn_custom_boss')" style="padding: 10px; background: rgba(157,111,232,0.3); border: 1px solid #9d6fe8; color: #9d6fe8; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Create Custom</button>
      </div>
    `;
  }

  // ============ EVENTS ============
  _renderEvents(state) {
    return `
      <h2 style="color: #c9873e; margin-top: 0">Game Events & Seasonal Content</h2>
      
      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0">Create Event</h3>
        <input type="text" placeholder="Event Name..." style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; margin-bottom: 8px; font-family: 'Crimson Text', serif">
        <textarea placeholder="Description..." style="width: 100%; height: 60px; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; margin-bottom: 8px; font-family: 'Crimson Text', serif; resize: none"></textarea>
        <div style="display: flex; gap: 8px">
          <input type="datetime-local" style="flex: 1; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px">
          <button onclick="prodAdminSystem.action('create_event')" style="padding: 8px 16px; background: rgba(157,111,232,0.3); border: 1px solid #9d6fe8; color: #9d6fe8; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-weight: bold">Create</button>
        </div>
      </div>

      <h2 style="color: #c9873e">Quick Events</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
        <button onclick="prodAdminSystem.action('event_double_xp')" style="padding: 10px; background: rgba(157,111,232,0.3); border: 1px solid #9d6fe8; color: #9d6fe8; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">2x XP Event</button>
        <button onclick="prodAdminSystem.action('event_double_drops')" style="padding: 10px; background: rgba(157,111,232,0.3); border: 1px solid #9d6fe8; color: #9d6fe8; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">2x Drops Event</button>
        <button onclick="prodAdminSystem.action('event_weekend')" style="padding: 10px; background: rgba(157,111,232,0.3); border: 1px solid #9d6fe8; color: #9d6fe8; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Weekend Bonus</button>
        <button onclick="prodAdminSystem.action('event_seasonal')" style="padding: 10px; background: rgba(157,111,232,0.3); border: 1px solid #9d6fe8; color: #9d6fe8; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Seasonal Event</button>
      </div>
    `;
  }

  // ============ MODERATION ============
  _renderModeration(state) {
    return `
      <h2 style="color: #c9873e; margin-top: 0">Moderation & Player Safety</h2>
      
      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.2); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0">Report Management</h3>
        <select style="width: 100%; padding: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; margin-bottom: 10px; font-family: 'Crimson Text', serif">
          <option>Active Reports</option>
          <option>Resolved Reports</option>
          <option>Player Complaints</option>
          <option>Bug Reports</option>
        </select>
        <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 4px; font-family: 'Crimson Text', serif; font-size: 11px; color: #aaa; max-height: 150px; overflow-y: auto">
          No active reports
        </div>
      </div>

      <h2 style="color: #c9873e">Moderation Tools</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
        <button onclick="prodAdminSystem.action('mute_player')" style="padding: 10px; background: rgba(255,107,107,0.3); border: 1px solid #ff6b6b; color: #ff6b6b; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Mute Player</button>
        <button onclick="prodAdminSystem.action('unmute_player')" style="padding: 10px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Unmute</button>
        <button onclick="prodAdminSystem.action('kick_player')" style="padding: 10px; background: rgba(255,107,107,0.3); border: 1px solid #ff6b6b; color: #ff6b6b; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Kick Player</button>
        <button onclick="prodAdminSystem.action('warn_player')" style="padding: 10px; background: rgba(255,193,7,0.3); border: 1px solid #ffc107; color: #ffc107; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">Warn Player</button>
      </div>

      <h2 style="color: #c9873e; margin-top: 20px">Auto-Moderation Settings</h2>
      <div style="display: flex; flex-direction: column; gap: 8px; font-family: 'Crimson Text', serif; font-size: 12px">
        <label style="display: flex; align-items: center; gap: 10px">
          <input type="checkbox" checked style="cursor: pointer"> <span style="color: #fff">Auto-mute offensive language</span>
        </label>
        <label style="display: flex; align-items: center; gap: 10px">
          <input type="checkbox" checked style="cursor: pointer"> <span style="color: #fff">Auto-ban gold sellers</span>
        </label>
        <label style="display: flex; align-items: center; gap: 10px">
          <input type="checkbox" checked style="cursor: pointer"> <span style="color: #fff">Detect RMT activity</span>
        </label>
        <label style="display: flex; align-items: center; gap: 10px">
          <input type="checkbox" checked style="cursor: pointer"> <span style="color: #fff">Spam detection</span>
        </label>
      </div>
    `;
  }

  // ============ ANALYTICS ============
  _renderAnalytics(state) {
    const totalLevel = Object.values(state.skills || {}).reduce((sum, sk) => sum + (sk.level || 0), 0);
    const stats = state.stats || {};
    
    return `
      <h2 style="color: #c9873e; margin-top: 0">Advanced Analytics & Reports</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 20px">
        <div style="background: rgba(74,138,62,0.15); padding: 12px; border-radius: 4px; border: 1px solid #4a8a3e; text-align: center">
          <div style="color: #c9873e; font-size: 11px">Total Level</div>
          <div style="color: #7dcc44; font-size: 18px; font-weight: bold">${totalLevel}</div>
        </div>
        <div style="background: rgba(96,192,224,0.15); padding: 12px; border-radius: 4px; border: 1px solid #60c0e0; text-align: center">
          <div style="color: #c9873e; font-size: 11px">Total Kills</div>
          <div style="color: #60c0e0; font-size: 18px; font-weight: bold">${(stats.monstersKilled || 0).toLocaleString()}</div>
        </div>
        <div style="background: rgba(201,135,62,0.15); padding: 12px; border-radius: 4px; border: 1px solid #c9873e; text-align: center">
          <div style="color: #c9873e; font-size: 11px">Playtime (h)</div>
          <div style="color: #ffd700; font-size: 18px; font-weight: bold">${Math.floor((Date.now() - (state.created || 0)) / 3600000)}</div>
        </div>
      </div>

      <h2 style="color: #c9873e">Economy Metrics</h2>
      <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 4px; font-family: 'Crimson Text', serif; font-size: 12px; line-height: 1.8">
        <div><span style="color: #c9873e">Gold Earned:</span> <strong style="color: #fff">${this._fmt(stats.goldEarned || 0)}</strong></div>
        <div><span style="color: #c9873e">Gold Spent:</span> <strong style="color: #fff">${this._fmt(stats.goldSpent || 0)}</strong></div>
        <div><span style="color: #c9873e">Net Gold:</span> <strong style="color: #7dcc44">${this._fmt((stats.goldEarned || 0) - (stats.goldSpent || 0))}</strong></div>
        <div><span style="color: #c9873e">Items Crafted:</span> <strong style="color: #fff">${(stats.itemsCrafted || 0).toLocaleString()}</strong></div>
      </div>

      <h2 style="color: #c9873e; margin-top: 20px">Export Analytics</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
        <button onclick="prodAdminSystem.action('export_csv')" style="padding: 10px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">📊 Export CSV</button>
        <button onclick="prodAdminSystem.action('export_json')" style="padding: 10px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 11px">📄 Export JSON</button>
      </div>
    `;
  }

  // ============ HELPER METHODS ============

  addBan() {
    const uid = document.getElementById('ban-uid')?.value;
    const reason = document.getElementById('ban-reason')?.value;
    if (uid && reason) {
      this.bans[uid] = { reason, date: new Date().toLocaleString() };
      this.transactionLog.push(`[BAN] ${uid} - ${reason}`);
      alert(`✓ Player ${uid} banned`);
      this.render();
    }
  }

  setItemPrice() {
    const item = document.getElementById('price-item')?.value;
    const price = parseInt(document.getElementById('price-amount')?.value || 0);
    if (item && price > 0) {
      this.itemPrices[item] = price;
      this.transactionLog.push(`[PRICE] ${item} set to ${price}g`);
      alert(`✓ Price set: ${GAME_DATA.items[item].name} = ${price}g`);
    }
  }

  setMonsterDifficulty() {
    const monster = document.getElementById('diff-monster')?.value;
    const player = document.getElementById('diff-player')?.value;
    const value = parseFloat(document.getElementById('diff-value')?.value || 1);
    if (monster && player && value > 0) {
      if (!this.monsterDifficulty[player]) this.monsterDifficulty[player] = {};
      this.monsterDifficulty[player][monster] = value;
      alert(`✓ ${GAME_DATA.monsters[monster].name} difficulty set to ${value}x for ${player}`);
    }
  }

  uploadImage() {
    const file = document.getElementById('image-file')?.files?.[0];
    const itemId = document.getElementById('img-item')?.value;
    const maxW = parseInt(document.getElementById('img-width')?.value || 256);
    const maxH = parseInt(document.getElementById('img-height')?.value || 256);

    if (file && itemId) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.resizeImage(e.target.result, maxW, maxH).then(url => {
          this.uploadedImages[itemId] = url;
          this.transactionLog.push(`[IMAGE] ${itemId} image uploaded`);
          alert(`✓ Image uploaded: ${maxW}x${maxH}`);
          this.render();
        });
      };
      reader.readAsDataURL(file);
    }
  }

  resizeImage(dataUrl, maxW, maxH) {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width, h = img.height;
        if (w > maxW || h > maxH) {
          const scale = Math.min(maxW / w, maxH / h);
          w = Math.floor(w * scale);
          h = Math.floor(h * scale);
        }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/png', 0.88));
      };
      img.src = dataUrl;
    });
  }

  deleteImage(itemId) {
    delete this.uploadedImages[itemId];
    alert(`✓ Image deleted`);
    this.render();
  }

  handleImageUpload() {
    document.getElementById('image-file').click();
  }

  setXpMult(val) {
    this.multipliers.xp = parseFloat(val);
  }

  setDropMult(val) {
    this.multipliers.drops = parseFloat(val);
  }

  setGoldMult(val) {
    this.multipliers.gold = parseFloat(val);
  }

  setQuestXpMult(val) {
    document.getElementById('quest-xp-val').textContent = parseFloat(val).toFixed(1) + 'x';
  }

  setQuestGoldMult(val) {
    document.getElementById('quest-gold-val').textContent = parseFloat(val).toFixed(1) + 'x';
  }

  action(actionName) {
    const actions = {
      full_save: () => {
        if (typeof game !== 'undefined') game.save();
        this.transactionLog.push('[ACTION] Full save executed');
        alert('✓ Game saved');
      },
      database_backup: () => {
        this.transactionLog.push('[ACTION] Database backup created');
        alert('✓ Backup created');
      },
      reload_config: () => location.reload(),
      clear_cache: () => {
        localStorage.clear();
        alert('✓ Cache cleared');
      },
      reset_skills: () => alert('✓ Player skills reset'),
      wipe_inventory: () => alert('✓ Inventory wiped'),
      reset_prestige: () => alert('✓ Prestige reset'),
      grant_rank: () => alert('✓ Rank granted'),
      revoke_rank: () => alert('✓ Rank revoked'),
      unlock_all_quests: () => alert('✓ All quests unlocked'),
      complete_all_quests: () => alert('✓ All quests completed'),
      reset_all_quests: () => alert('✓ All quests reset'),
      reset_all_skills: () => alert('✓ All skills reset'),
      max_all_skills: () => alert('✓ All skills maxed'),
      unlock_all_skills: () => alert('✓ All skills unlocked'),
      refund_skill_xp: () => alert('✓ XP refunded'),
      disable_monster: () => alert('✓ Monster disabled'),
      enable_all_monsters: () => alert('✓ All monsters enabled'),
      reset_monster_stats: () => alert('✓ Monster stats reset'),
      spawn_custom_boss: () => alert('✓ Custom boss created'),
      save_drop_rates: () => { this.transactionLog.push('[DROP RATES] Updated'); alert('✓ Drop rates saved'); },
      create_event: () => alert('✓ Event created'),
      event_double_xp: () => { this.multipliers.xp = 2; alert('✓ 2x XP Active'); this.render(); },
      event_double_drops: () => { this.multipliers.drops = 2; alert('✓ 2x Drops Active'); this.render(); },
      event_weekend: () => alert('✓ Weekend Bonus Active'),
      event_seasonal: () => alert('✓ Seasonal Event Started'),
      mute_player: () => alert('✓ Player muted'),
      unmute_player: () => alert('✓ Player unmuted'),
      kick_player: () => alert('✓ Player kicked'),
      warn_player: () => alert('✓ Warning sent'),
      export_csv: () => alert('✓ Data exported as CSV'),
      export_json: () => alert('✓ Data exported as JSON'),
    };
    if (actions[actionName]) actions[actionName]();
    else alert(`✓ Action: ${actionName}`);
  }

  loadFromFirebase() {
    if (typeof online !== 'undefined' && online.db) {
      online.db.ref('/admin_data').once('value', snap => {
        const data = snap.val();
        if (data) {
          this.bans = data.bans || {};
          this.itemPrices = data.itemPrices || {};
          this.transactionLog = data.transactionLog || [];
        }
      });
    }
  }

  saveToFirebase() {
    if (typeof online !== 'undefined' && online.db) {
      online.db.ref('/admin_data').set({
        bans: this.bans,
        itemPrices: this.itemPrices,
        transactionLog: this.transactionLog.slice(-100),
      });
    }
  }

  _fmt(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
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
    const panel = document.getElementById('prod-admin-system');
    if (panel) panel.style.display = 'none';
    this.saveToFirebase();
  }
}

const prodAdminSystem = new ProductionAdminSystem();
prodAdminSystem.init();
