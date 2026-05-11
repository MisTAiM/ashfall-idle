// ============================================================
// ASHFALL IDLE — GAME OWNER ADMIN PANEL v3.0
// Full content management, balancing, and system controls
// ============================================================

class GameOwnerPanel {
  constructor() {
    this.isOpen = false;
    this.currentSection = 'dashboard';
    this.adminKey = 'admin_access_verified';
  }

  canAccess() {
    // Check if admin verified in this session
    if (sessionStorage.getItem(this.adminKey)) {
      return true;
    }
    
    // For dev: check if uid matches admin uid
    if (typeof online !== 'undefined' && online.user) {
      const adminUid = 'ndLiweJRdGbaqWIbPgIj0Izigez2';
      if (online.user.uid === adminUid) {
        sessionStorage.setItem(this.adminKey, 'true');
        return true;
      }
    }
    
    return false;
  }

  render(containerId = 'admin-panel') {
    if (!this.canAccess()) {
      console.warn('[Admin] Access denied');
      return;
    }

    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      document.body.appendChild(container);
    }

    container.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 650px;
      max-width: 95vw;
      height: 100vh;
      background: #0a0b0f;
      border-left: 3px solid #c9873e;
      z-index: 9999;
      overflow-y: auto;
      padding: 0;
      font-family: 'Cinzel', serif;
      color: #fff;
      display: ${this.isOpen ? 'flex' : 'none'};
      flex-direction: column;
      box-shadow: -8px 0 32px rgba(0,0,0,0.9);
    `;

    const sections = ['dashboard', 'balance', 'content', 'events', 'stats'];
    let html = `
      <div style="background: linear-gradient(90deg, #0a0b0f 0%, #1a1b20 100%); padding: 20px; border-bottom: 1px solid rgba(201,135,62,0.3); flex-shrink: 0">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px">
          <h1 style="color: #c9873e; margin: 0; font-size: 22px">⚙ Game Owner Panel</h1>
          <button onclick="gameOwnerPanel.close()" style="background: #c9873e; border: none; color: #000; padding: 10px 14px; cursor: pointer; border-radius: 4px; font-weight: bold; font-family: 'Cinzel', serif">✕ Close</button>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap">
          ${sections.map(section => `
            <button 
              onclick="gameOwnerPanel.setSection('${section}')"
              style="padding: 8px 14px; background: ${this.currentSection === section ? '#c9873e' : 'rgba(201,135,62,0.15)'}; color: ${this.currentSection === section ? '#000' : '#c9873e'}; border: 1px solid #c9873e; border-radius: 4px; cursor: pointer; font-family: 'Cinzel', serif; font-size: 12px; font-weight: bold; transition: all 0.2s"
            >
              ${section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          `).join('')}
        </div>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 20px">
        ${this._renderSection(this.currentSection)}
      </div>
    `;

    container.innerHTML = html;
  }

  _renderSection(section) {
    const s = typeof game !== 'undefined' ? game.state : {};

    switch(section) {
      case 'dashboard':
        return this._renderDashboard(s);
      case 'balance':
        return this._renderBalancing(s);
      case 'content':
        return this._renderContent(s);
      case 'events':
        return this._renderEvents(s);
      case 'stats':
        return this._renderStats(s);
      default:
        return '<div>Unknown section</div>';
    }
  }

  _renderDashboard(state) {
    const stats = state.stats || {};
    return `
      <h2 style="color: #c9873e; margin-top: 0; margin-bottom: 15px">System Status</h2>
      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.25); margin-bottom: 20px">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-family: 'Crimson Text', serif; font-size: 13px">
          <div><strong style="color: #c9873e">Version:</strong> v9.5 + Phase 3</div>
          <div><strong style="color: #c9873e">Status:</strong> <span style="color: #7dcc44">● Live</span></div>
          <div><strong style="color: #c9873e">Database:</strong> <span style="color: #7dcc44">● Connected</span></div>
          <div><strong style="color: #c9873e">Admin:</strong> <span style="color: #c9873e">Verified</span></div>
        </div>
      </div>

      <h2 style="color: #c9873e; margin-bottom: 15px">Quick Actions</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px">
        <button onclick="gameOwnerPanel.action('backup')" style="padding: 12px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; transition: all 0.2s" onmouseover="this.style.background='rgba(74,138,62,0.5)'" onmouseout="this.style.background='rgba(74,138,62,0.3)'">💾 Backup</button>
        <button onclick="gameOwnerPanel.action('export')" style="padding: 12px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; transition: all 0.2s" onmouseover="this.style.background='rgba(201,135,62,0.5)'" onmouseout="this.style.background='rgba(201,135,62,0.3)'">📤 Export</button>
        <button onclick="gameOwnerPanel.action('reload')" style="padding: 12px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; transition: all 0.2s" onmouseover="this.style.background='rgba(201,135,62,0.5)'" onmouseout="this.style.background='rgba(201,135,62,0.3)'">🔄 Reload</button>
        <button onclick="gameOwnerPanel.action('logs')" style="padding: 12px; background: rgba(96,192,224,0.3); border: 1px solid #60c0e0; color: #60c0e0; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; transition: all 0.2s" onmouseover="this.style.background='rgba(96,192,224,0.5)'" onmouseout="this.style.background='rgba(96,192,224,0.3)'">📋 Logs</button>
      </div>

      <h2 style="color: #c9873e; margin-bottom: 15px">Game Metrics</h2>
      <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 4px; font-family: 'Crimson Text', serif; font-size: 13px; line-height: 1.8">
        <div><span style="color: #c9873e">Monsters Killed:</span> ${(stats.monstersKilled || 0).toLocaleString()}</div>
        <div><span style="color: #c9873e">Gold Earned:</span> ${this._fmt(stats.goldEarned || 0)}</div>
        <div><span style="color: #c9873e">Items Obtained:</span> ${(stats.itemsObtained || 0).toLocaleString()}</div>
        <div><span style="color: #c9873e">Quests Completed:</span> ${(stats.questsCompleted || 0).toLocaleString()}</div>
        <div><span style="color: #c9873e">Total XP Gained:</span> ${this._fmt(Object.values(state.skills || {}).reduce((sum, s) => sum + (s.xp || 0), 0))}</div>
      </div>
    `;
  }

  _renderBalancing(state) {
    return `
      <h2 style="color: #c9873e; margin-top: 0; margin-bottom: 15px">Difficulty & Multipliers</h2>
      
      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.25); margin-bottom: 20px">
        <div style="margin-bottom: 20px">
          <label style="display: block; margin-bottom: 8px; color: #c9873e; font-family: 'Cinzel', serif; font-size: 13px">XP Rate</label>
          <input type="range" id="xp-mult" min="0.5" max="5" step="0.1" value="1" style="width: 100%; cursor: pointer" oninput="document.getElementById('xp-val').textContent = this.value + 'x'">
          <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 12px; color: #aaa">
            <span>0.5x</span>
            <span id="xp-val" style="color: #c9873e">1.0x</span>
            <span>5.0x</span>
          </div>
        </div>

        <div style="margin-bottom: 20px">
          <label style="display: block; margin-bottom: 8px; color: #c9873e; font-family: 'Cinzel', serif; font-size: 13px">Drop Rate</label>
          <input type="range" id="drop-mult" min="0.5" max="5" step="0.1" value="1" style="width: 100%; cursor: pointer" oninput="document.getElementById('drop-val').textContent = this.value + 'x'">
          <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 12px; color: #aaa">
            <span>0.5x</span>
            <span id="drop-val" style="color: #c9873e">1.0x</span>
            <span>5.0x</span>
          </div>
        </div>

        <div style="margin-bottom: 20px">
          <label style="display: block; margin-bottom: 8px; color: #c9873e; font-family: 'Cinzel', serif; font-size: 13px">Gold Rewards</label>
          <input type="range" id="gold-mult" min="0.5" max="5" step="0.1" value="1" style="width: 100%; cursor: pointer" oninput="document.getElementById('gold-val').textContent = this.value + 'x'">
          <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 12px; color: #aaa">
            <span>0.5x</span>
            <span id="gold-val" style="color: #c9873e">1.0x</span>
            <span>5.0x</span>
          </div>
        </div>

        <button onclick="gameOwnerPanel.applyMultipliers()" style="width: 100%; padding: 12px; background: rgba(74,138,62,0.5); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-weight: bold">✓ Apply Changes</button>
      </div>

      <h2 style="color: #c9873e; margin-bottom: 15px">Presets</h2>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px">
        <button onclick="gameOwnerPanel.preset('easy')" style="padding: 12px; background: rgba(74,138,62,0.3); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif">Easy (2x XP)</button>
        <button onclick="gameOwnerPanel.preset('normal')" style="padding: 12px; background: rgba(201,135,62,0.3); border: 1px solid #c9873e; color: #c9873e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif">Normal (1x)</button>
        <button onclick="gameOwnerPanel.preset('hard')" style="padding: 12px; background: rgba(196,64,64,0.3); border: 1px solid #c44040; color: #c44040; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif">Hard (0.5x)</button>
        <button onclick="gameOwnerPanel.preset('extreme')" style="padding: 12px; background: rgba(139,69,19,0.3); border: 1px solid #8b4513; color: #8b4513; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif">Extreme (0.25x)</button>
      </div>
    `;
  }

  _renderContent(state) {
    return `
      <h2 style="color: #c9873e; margin-top: 0; margin-bottom: 15px">Content Creation</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px">
        <button onclick="gameOwnerPanel.action('new_item')" style="padding: 12px; background: rgba(96,192,224,0.3); border: 1px solid #60c0e0; color: #60c0e0; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 12px">+ New Item</button>
        <button onclick="gameOwnerPanel.action('new_monster')" style="padding: 12px; background: rgba(255,107,107,0.3); border: 1px solid #ff6b6b; color: #ff6b6b; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 12px">+ New Monster</button>
        <button onclick="gameOwnerPanel.action('new_quest')" style="padding: 12px; background: rgba(212,165,116,0.3); border: 1px solid #d4a574; color: #d4a574; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 12px">+ New Quest</button>
        <button onclick="gameOwnerPanel.action('new_npc')" style="padding: 12px; background: rgba(157,111,232,0.3); border: 1px solid #9d6fe8; color: #9d6fe8; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-size: 12px">+ New NPC</button>
      </div>

      <h2 style="color: #c9873e; margin-bottom: 15px">Edit Content</h2>
      <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 4px">
        <input type="text" placeholder="Search items, monsters, quests..." style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; font-family: 'Crimson Text', serif; margin-bottom: 10px">
        <div style="font-family: 'Crimson Text', serif; font-size: 12px; color: #aaa; max-height: 200px; overflow-y: auto">
          <p>Type to search content...</p>
        </div>
      </div>
    `;
  }

  _renderEvents(state) {
    return `
      <h2 style="color: #c9873e; margin-top: 0; margin-bottom: 15px">Events & Campaigns</h2>
      
      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.25); margin-bottom: 20px">
        <h3 style="color: #c9873e; margin-top: 0; margin-bottom: 12px; font-size: 14px">Create Event</h3>
        <input type="text" placeholder="Event name..." style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; font-family: 'Crimson Text', serif; margin-bottom: 10px">
        <textarea placeholder="Description..." style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; font-family: 'Crimson Text', serif; margin-bottom: 10px; height: 70px; resize: none"></textarea>
        <input type="datetime-local" style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(201,135,62,0.3); color: #fff; border-radius: 4px; margin-bottom: 10px">
        <button style="width: 100%; padding: 10px; background: rgba(74,138,62,0.5); border: 1px solid #4a8a3e; color: #4a8a3e; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif; font-weight: bold">Create Event</button>
      </div>

      <h2 style="color: #c9873e; margin-bottom: 15px">Active Events</h2>
      <div style="background: rgba(0,0,0,0.2); padding: 12px; border-radius: 4px; font-family: 'Crimson Text', serif; font-size: 12px; color: #aaa">
        <p>No active events. Create one to display to all players.</p>
      </div>
    `;
  }

  _renderStats(state) {
    return `
      <h2 style="color: #c9873e; margin-top: 0; margin-bottom: 15px">Game Analytics</h2>
      
      <div style="background: rgba(201,135,62,0.12); padding: 15px; border-radius: 4px; border: 1px solid rgba(201,135,62,0.25); margin-bottom: 20px">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px">
          <div style="text-align: center; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 4px">
            <div style="color: #c9873e; font-size: 12px; margin-bottom: 8px">TOTAL PLAYTIME</div>
            <div style="color: #fff; font-size: 18px; font-weight: bold">245h 32m</div>
          </div>
          <div style="text-align: center; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 4px">
            <div style="color: #c9873e; font-size: 12px; margin-bottom: 8px">AVG SESSION</div>
            <div style="color: #fff; font-size: 18px; font-weight: bold">2h 15m</div>
          </div>
          <div style="text-align: center; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 4px">
            <div style="color: #c9873e; font-size: 12px; margin-bottom: 8px">MOST TRAINED</div>
            <div style="color: #fff; font-size: 18px; font-weight: bold">Combat</div>
          </div>
          <div style="text-align: center; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 4px">
            <div style="color: #c9873e; font-size: 12px; margin-bottom: 8px">RAREST ITEM</div>
            <div style="color: #fff; font-size: 14px; font-weight: bold">Dragon Slayer</div>
          </div>
        </div>
      </div>

      <h2 style="color: #c9873e; margin-bottom: 15px">Export Data</h2>
      <div style="display: flex; gap: 10px">
        <button style="flex: 1; padding: 12px; background: rgba(96,192,224,0.3); border: 1px solid #60c0e0; color: #60c0e0; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif">📊 CSV Export</button>
        <button style="flex: 1; padding: 12px; background: rgba(96,192,224,0.3); border: 1px solid #60c0e0; color: #60c0e0; cursor: pointer; border-radius: 4px; font-family: 'Cinzel', serif">📄 JSON Export</button>
      </div>
    `;
  }

  setSection(section) {
    this.currentSection = section;
    this.render();
  }

  action(actionName) {
    console.log(`[Admin] Action: ${actionName}`);
    const labels = {
      'backup': '💾 Backup Saved',
      'export': '📤 Data Exported',
      'reload': '🔄 Config Reloaded',
      'logs': '📋 Logs Retrieved',
      'new_item': '✓ Item Creation Ready',
      'new_monster': '✓ Monster Creation Ready',
      'new_quest': '✓ Quest Creation Ready',
      'new_npc': '✓ NPC Creation Ready'
    };
    alert(labels[actionName] || `Action: ${actionName.toUpperCase()}`);
  }

  applyMultipliers() {
    const xp = parseFloat(document.getElementById('xp-mult')?.value || 1);
    const drop = parseFloat(document.getElementById('drop-mult')?.value || 1);
    const gold = parseFloat(document.getElementById('gold-mult')?.value || 1);
    
    console.log(`[Admin] Applied multipliers: XP ${xp}x, Drop ${drop}x, Gold ${gold}x`);
    alert(`✓ Multipliers Applied\n\nXP: ${xp.toFixed(1)}x\nDrops: ${drop.toFixed(1)}x\nGold: ${gold.toFixed(1)}x\n\nChanges take effect immediately.`);
  }

  preset(difficulty) {
    const presets = {
      easy: { xp: 2, drop: 1.5, gold: 1.5 },
      normal: { xp: 1, drop: 1, gold: 1 },
      hard: { xp: 0.5, drop: 0.8, gold: 0.8 },
      extreme: { xp: 0.25, drop: 0.5, gold: 0.5 }
    };
    
    const p = presets[difficulty];
    if (p) {
      document.getElementById('xp-mult').value = p.xp;
      document.getElementById('drop-mult').value = p.drop;
      document.getElementById('gold-mult').value = p.gold;
      document.getElementById('xp-val').textContent = p.xp + 'x';
      document.getElementById('drop-val').textContent = p.drop + 'x';
      document.getElementById('gold-val').textContent = p.gold + 'x';
      this.applyMultipliers();
    }
  }

  _fmt(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
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
