// ============================================================
// ASHFALL IDLE — ADMIN PANEL
// Live editing, debug controls, state inspection
// Admin access verified via SHA-256 hash check
// ============================================================

(function() {

function _checkAdmin() {
  return typeof isAdmin === 'function' ? isAdmin() : false;
}

function applyAdminPanel() {
  if (typeof UI === 'undefined' || typeof GameEngine === 'undefined') {
    setTimeout(applyAdminPanel, 200);
    return;
  }

  // ── INJECT ADMIN PAGE ROUTE ─────────────────────────────
  const origRenderPage = UI.prototype.renderPage;
  UI.prototype.renderPage = function(pageId) {
    if (pageId === 'admin') {
      const main = document.getElementById('main-content');
      if (main) this.renderAdminPanel(main);
      return;
    }
    origRenderPage.call(this, pageId);
  };

  // ── INJECT ADMIN SIDEBAR ENTRY ──────────────────────────
  const origRenderSidebar = UI.prototype.renderSidebar;
  UI.prototype.renderSidebar = function() {
    origRenderSidebar.call(this);
    if (!_checkAdmin()) return;
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    const nav = sidebar.querySelector('.sidebar-nav');
    if (!nav) return;
    // Don't add twice
    if (nav.querySelector('[data-page="admin"]')) return;
    const section = document.createElement('div');
    section.className = 'nav-section';
    section.innerHTML = `<div class="nav-header">Admin</div>
      <div class="nav-item ${this.currentPage==='admin'?'active':''}" data-page="admin">
        <span class="nav-icon">${typeof icon==='function'?icon('settings',16):''}</span>
        <span class="nav-label">Admin Panel</span>
      </div>`;
    nav.appendChild(section);
  };

  // ── ADMIN PANEL RENDER ──────────────────────────────────
  UI.prototype.renderAdminPanel = function(el) {
    if (!_checkAdmin()) {
      el.innerHTML = '<div class="bank-empty">Access denied.</div>';
      return;
    }

    const s = game.state;
    const tab = this._admTab || 'overview';

    let html = `<div class="admin-panel">`;
    html += `<div class="admin-header-bar">
      <div class="ahb-title">Admin Panel</div>
      <div class="ahb-sub">UID: ${online.user.uid} | ${online.displayName || 'Admin'}</div>
    </div>`;

    // Tabs
    const tabs = [
      {id:'overview', label:'Overview'},
      {id:'items',    label:'Items'},
      {id:'skills',   label:'Skills'},
      {id:'combat',   label:'Combat'},
      {id:'quests',   label:'Quests'},
      {id:'monsters', label:'Monsters'},
      {id:'state',    label:'State'},
      {id:'tools',    label:'Tools'},
    ];
    html += '<div class="admin-tabs">';
    for (const t of tabs) {
      html += `<button class="admin-tab ${tab===t.id?'active':''}" onclick="ui._admTab='${t.id}';ui.renderPage('admin')">${t.label}</button>`;
    }
    html += '</div>';

    html += '<div class="admin-body">';

    // ── OVERVIEW TAB ──────────────────────────────────────
    if (tab === 'overview') {
      const totalItems = Object.keys(s.bank).filter(k => s.bank[k] > 0).length;
      const totalLevel = Object.values(s.skills).reduce((a, sk) => a + (sk.level||1), 0);
      const combatLv = game.getCombatLevel();

      html += `<div class="adm-section">
        <h3>Game State</h3>
        <div class="adm-grid">
          <div class="adm-stat">Gold: <strong>${this.fmt(s.gold)}</strong></div>
          <div class="adm-stat">Total Level: <strong>${totalLevel}</strong></div>
          <div class="adm-stat">Combat Level: <strong>${combatLv}</strong></div>
          <div class="adm-stat">Bank Items: <strong>${totalItems}</strong></div>
          <div class="adm-stat">Monsters Killed: <strong>${this.fmt(s.stats.monstersKilled||0)}</strong></div>
          <div class="adm-stat">Quests Done: <strong>${s.quests?.completed?.length||0}/${GAME_DATA.quests?.length||0}</strong></div>
          <div class="adm-stat">Fight Cave: <strong>${s.stats.fightCaveCompletions||0} clears / ${s.stats.fightCaveDeaths||0} deaths</strong></div>
          <div class="adm-stat">Prayer Points: <strong>${s.prayerPoints||0}</strong></div>
        </div>
      </div>`;

      html += `<div class="adm-section">
        <h3>Quick Actions</h3>
        <div class="adm-btn-grid">
          <button class="btn btn-sm" onclick="ui._admGiveGold()">Give Gold</button>
          <button class="btn btn-sm" onclick="ui._admMaxAll()">Max All Skills</button>
          <button class="btn btn-sm" onclick="ui._admFullHeal()">Full Heal</button>
          <button class="btn btn-sm" onclick="ui._admFillPrayer()">Fill Prayer</button>
          <button class="btn btn-sm" onclick="ui._admGiveAllItems()">Give All Items</button>
          <button class="btn btn-sm" onclick="ui._admClearBank()">Clear Bank</button>
          <button class="btn btn-sm" onclick="ui._admCompleteQuests()">Complete All Quests</button>
          <button class="btn btn-sm" onclick="ui._admResetFightCave()">Reset FC Stats</button>
        </div>
      </div>`;

      html += `<div class="adm-section">
        <h3>Broadcast</h3>
        <div class="adm-row-flex">
          <input type="text" id="adm-broadcast" class="bank-search-input" placeholder="System message...">
          <button class="btn btn-sm" onclick="ui._admBroadcast()">Send</button>
        </div>
      </div>`;
    }

    // ── ITEMS TAB ─────────────────────────────────────────
    if (tab === 'items') {
      html += `<div class="adm-section">
        <h3>Give Item</h3>
        <div class="adm-row-flex">
          <input type="text" id="adm-item-search" class="bank-search-input" placeholder="Search item ID or name..." oninput="ui._admFilterItems(this.value)">
        </div>
        <div id="adm-item-list" class="adm-item-list">`;
      const itemSearch = this._admItemSearch || '';
      const allItems = Object.values(GAME_DATA.items);
      const matchedItems = itemSearch ? allItems.filter(i =>
        i.id.includes(itemSearch.toLowerCase()) || (i.name||'').toLowerCase().includes(itemSearch.toLowerCase())
      ).slice(0, 30) : allItems.slice(0, 30);
      for (const item of matchedItems) {
        const qty = s.bank[item.id] || 0;
        html += `<div class="adm-item-row">
          <span class="adm-item-name" style="${this.getRarityColor(item.id)?'color:'+this.getRarityColor(item.id):''}">${item.name}</span>
          <span class="adm-item-id">${item.id}</span>
          <span class="adm-item-qty">x${qty}</span>
          <button class="btn btn-xs" onclick="ui._admGiveItem('${item.id}',1)">+1</button>
          <button class="btn btn-xs" onclick="ui._admGiveItem('${item.id}',10)">+10</button>
          <button class="btn btn-xs" onclick="ui._admGiveItem('${item.id}',100)">+100</button>
        </div>`;
      }
      html += `</div></div>`;
    }

    // ── SKILLS TAB ────────────────────────────────────────
    if (tab === 'skills') {
      html += `<div class="adm-section"><h3>Skills</h3><div class="adm-skill-grid">`;
      for (const [id, sk] of Object.entries(s.skills)) {
        const name = GAME_DATA.skills[id]?.name || id;
        html += `<div class="adm-skill-row">
          <span class="adm-sk-name">${name}</span>
          <span class="adm-sk-level">Lv ${sk.level}</span>
          <span class="adm-sk-xp">${this.fmt(sk.xp)} XP</span>
          <button class="btn btn-xs" onclick="game.addXp('${id}',1000);ui.renderPage('admin')">+1K</button>
          <button class="btn btn-xs" onclick="game.addXp('${id}',10000);ui.renderPage('admin')">+10K</button>
          <button class="btn btn-xs" onclick="game.addXp('${id}',100000);ui.renderPage('admin')">+100K</button>
          <button class="btn btn-xs" onclick="game.state.skills['${id}'].level=99;game.state.skills['${id}'].xp=13034431;ui.renderPage('admin')">Max</button>
        </div>`;
      }
      html += `</div></div>`;
    }

    // ── COMBAT TAB ────────────────────────────────────────
    if (tab === 'combat') {
      const c = s.combat;
      html += `<div class="adm-section"><h3>Combat State</h3>
        <div class="adm-grid">
          <div class="adm-stat">Active: <strong>${c.active ? 'Yes' : 'No'}</strong></div>
          <div class="adm-stat">Monster: <strong>${c.monster || 'None'}</strong></div>
          <div class="adm-stat">Player HP: <strong>${c.playerHp || 0}/${game.getMaxHp()}</strong></div>
          <div class="adm-stat">Monster HP: <strong>${c.monsterHp || 0}</strong></div>
          <div class="adm-stat">Style: <strong>${c.combatStyle || 'melee'}</strong></div>
          <div class="adm-stat">Area: <strong>${c.area || 'None'}</strong></div>
          <div class="adm-stat">Dungeon: <strong>${c.dungeon || 'None'}</strong></div>
          <div class="adm-stat">Fight Cave: <strong>${s.fightCave?.active ? 'Wave ' + ((s.fightCave.currentWave||0)+1) : 'Inactive'}</strong></div>
          <div class="adm-stat">Spec Energy: <strong>${s.specEnergy || 0}%</strong></div>
          <div class="adm-stat">Active Prayers: <strong>${(s.activePrayers||[]).join(', ') || 'None'}</strong></div>
        </div>
      </div>`;

      html += `<div class="adm-section"><h3>Combat Actions</h3>
        <div class="adm-btn-grid">
          <button class="btn btn-sm" onclick="game.stopCombat();ui.renderPage('admin')">Stop Combat</button>
          <button class="btn btn-sm" onclick="game.state.combat.playerHp=game.getMaxHp();ui.renderPage('admin')">Full Heal</button>
          <button class="btn btn-sm" onclick="game.state.specEnergy=100;ui.renderPage('admin')">Fill Spec</button>
          <button class="btn btn-sm" onclick="game.state.prayerPoints=99;ui.renderPage('admin')">Fill Prayer</button>
          <button class="btn btn-sm" onclick="game.state.combat.monsterHp=1;ui.renderPage('admin')">Monster → 1 HP</button>
          <button class="btn btn-sm" onclick="if(game.state.fightCave?.active){game.state.fightCave.currentWave=61;game.state.fightCave.betweenWaves=true;game.state.fightCave.betweenWaveTimer=1;}ui.renderPage('admin')">Skip to Wave 62</button>
        </div>
      </div>`;
    }

    // ── QUESTS TAB ────────────────────────────────────────
    if (tab === 'quests') {
      html += `<div class="adm-section"><h3>Quest Status</h3>`;
      html += `<div class="adm-btn-grid" style="margin-bottom:8px">
        <button class="btn btn-sm" onclick="ui._admCompleteQuests()">Complete All</button>
        <button class="btn btn-sm" onclick="game.state.quests={completed:[],active:[]};ui.renderPage('admin')">Reset All</button>
      </div>`;
      if (GAME_DATA.quests) {
        for (const q of GAME_DATA.quests) {
          const done = s.quests?.completed?.includes(q.id);
          const active = s.quests?.active?.find(a => a.id === q.id);
          html += `<div class="adm-quest-row ${done?'adm-q-done':active?'adm-q-active':''}">
            <span class="adm-q-status">${done ? '✓' : active ? '▶' : '○'}</span>
            <span class="adm-q-name">${q.name}</span>
            <span class="adm-q-id">${q.id}</span>
            ${!done ? `<button class="btn btn-xs" onclick="if(!game.state.quests.completed.includes('${q.id}'))game.state.quests.completed.push('${q.id}');game.state.quests.active=game.state.quests.active.filter(a=>a.id!=='${q.id}');ui.renderPage('admin')">Complete</button>` : ''}
          </div>`;
        }
      }
      html += `</div>`;
    }

    // ── MONSTERS TAB ──────────────────────────────────────
    if (tab === 'monsters') {
      html += `<div class="adm-section"><h3>Monster Database (${Object.keys(GAME_DATA.monsters).length})</h3>
        <input type="text" class="bank-search-input" placeholder="Search monsters..." oninput="ui._admMonSearch=this.value;ui.renderPage('admin')">
      </div>`;
      const monSearch = (this._admMonSearch || '').toLowerCase();
      const monsters = Object.values(GAME_DATA.monsters)
        .filter(m => !monSearch || m.name.toLowerCase().includes(monSearch) || m.id.toLowerCase().includes(monSearch))
        .slice(0, 40);
      html += `<div class="adm-section"><div class="adm-mon-grid">`;
      for (const m of monsters) {
        html += `<div class="adm-mon-card">
          <div class="adm-mon-name">${m.name} <small>(${m.id})</small></div>
          <div class="adm-mon-stats">HP:${m.hp} | Hit:${m.maxHit} | Lv:${m.combatLevel} | ${m.style} | ${m.xp||0}xp | Spd:${m.attackSpeed}</div>
          <div class="adm-mon-drops">${(m.drops||[]).map(d => `${d.item} ${(d.chance*100).toFixed(1)}%`).join(', ') || 'No drops'}</div>
          <button class="btn btn-xs" onclick="game.startCombat(null,'${m.id}')">Fight</button>
        </div>`;
      }
      html += `</div></div>`;
    }

    // ── STATE TAB ─────────────────────────────────────────
    if (tab === 'state') {
      html += `<div class="adm-section"><h3>Inspect State</h3>
        <div class="adm-row-flex">
          <input type="text" id="adm-state-path" class="bank-search-input" placeholder="Path (e.g. skills.attack, combat, fightCave)" value="${this._admStatePath||''}">
          <button class="btn btn-sm" onclick="ui._admInspectState()">Inspect</button>
        </div>
        <pre class="adm-state-output" id="adm-state-output">${this._admStateResult || 'Enter a state path to inspect'}</pre>
      </div>`;

      html += `<div class="adm-section"><h3>Save/Load</h3>
        <div class="adm-btn-grid">
          <button class="btn btn-sm" onclick="game.saveGame();ui.toast({type:'success',text:'Game saved'})">Force Save</button>
          <button class="btn btn-sm" onclick="if(confirm('Export save to clipboard?')){navigator.clipboard.writeText(JSON.stringify(game.state));ui.toast({type:'success',text:'Save copied to clipboard'})}">Export Save</button>
          <button class="btn btn-sm btn-danger" onclick="if(confirm('RESET ALL PROGRESS? This cannot be undone!')){localStorage.removeItem('ashfall_save');location.reload()}">Hard Reset</button>
        </div>
      </div>`;
    }

    // ── TOOLS TAB ─────────────────────────────────────────
    if (tab === 'tools') {
      html += `<div class="adm-section"><h3>Testing Tools</h3>
        <div class="adm-btn-grid">
          <button class="btn btn-sm" onclick="game.startFightCave()">Start Fight Cave</button>
          <button class="btn btn-sm" onclick="game.state.fightCave.currentWave=62;game.state.fightCave.betweenWaves=true;game.state.fightCave.betweenWaveTimer=1;ui.toast({type:'info',text:'Skipped to Jad wave'})">Skip to Jad</button>
          <button class="btn btn-sm" onclick="ui._admGiveItem('fire_cape',1)">Give Fire Cape</button>
          <button class="btn btn-sm" onclick="ui._admGiveItem('prayer_potion',20)">20x Prayer Pots</button>
          <button class="btn btn-sm" onclick="ui._admGiveItem('shark',100)">100x Sharks</button>
          <button class="btn btn-sm" onclick="game.state.specEnergy=100">Fill Spec</button>
        </div>
      </div>`;

      html += `<div class="adm-section"><h3>Give Custom Item</h3>
        <div class="adm-row-flex">
          <input type="text" id="adm-give-id" class="bank-search-input" placeholder="Item ID">
          <input type="number" id="adm-give-qty" class="bank-search-input" placeholder="Qty" value="1" style="width:80px">
          <button class="btn btn-sm" onclick="ui._admGiveCustom()">Give</button>
        </div>
      </div>`;

      html += `<div class="adm-section"><h3>Give Custom XP</h3>
        <div class="adm-row-flex">
          <select id="adm-xp-skill" class="bank-search-input" style="width:140px">
            ${Object.keys(s.skills).map(sk => `<option value="${sk}">${GAME_DATA.skills[sk]?.name||sk}</option>`).join('')}
          </select>
          <input type="number" id="adm-xp-amt" class="bank-search-input" placeholder="Amount" value="10000" style="width:100px">
          <button class="btn btn-sm" onclick="ui._admGiveCustomXp()">Give XP</button>
        </div>
      </div>`;

      html += `<div class="adm-section"><h3>Teleport Gold</h3>
        <div class="adm-row-flex">
          <input type="number" id="adm-gold-amt" class="bank-search-input" placeholder="Amount" value="100000" style="width:120px">
          <button class="btn btn-sm" onclick="const a=parseInt(document.getElementById('adm-gold-amt').value)||0;game.state.gold+=a;ui.toast({type:'success',text:'+'+a+' gold'});ui.renderPage('admin')">Give Gold</button>
        </div>
      </div>`;
    }

    html += '</div></div>';
    el.innerHTML = html;
  };

  // ── ADMIN ACTION METHODS ────────────────────────────────
  UI.prototype._admGiveGold = function() {
    const amt = parseInt(prompt('Gold amount:', '100000')) || 0;
    if (!amt) return;
    game.state.gold += amt;
    this.toast({type:'success', text:`+${this.fmt(amt)} gold`});
    this.renderPage('admin');
  };

  UI.prototype._admMaxAll = function() {
    for (const sk of Object.keys(game.state.skills)) {
      game.state.skills[sk].level = 99;
      game.state.skills[sk].xp = 13034431;
    }
    this.toast({type:'success', text:'All skills maxed to 99'});
    this.renderSidebar();
    this.renderPage('admin');
  };

  UI.prototype._admFullHeal = function() {
    game.state.combat.playerHp = game.getMaxHp();
    this.toast({type:'success', text:'Fully healed'});
    this.renderPage('admin');
  };

  UI.prototype._admFillPrayer = function() {
    game.state.prayerPoints = 99;
    this.toast({type:'success', text:'Prayer points filled'});
    this.renderPage('admin');
  };

  UI.prototype._admGiveAllItems = function() {
    let count = 0;
    for (const [id, item] of Object.entries(GAME_DATA.items)) {
      if (!game.state.bank[id]) { game.addItem(id, 10); count++; }
    }
    this.toast({type:'success', text:`Given ${count} item types (10 each)`});
    this.renderPage('admin');
  };

  UI.prototype._admClearBank = function() {
    if (!confirm('Clear entire bank? This cannot be undone!')) return;
    game.state.bank = {};
    this.toast({type:'success', text:'Bank cleared'});
    this.renderPage('admin');
  };

  UI.prototype._admCompleteQuests = function() {
    if (!GAME_DATA.quests) return;
    for (const q of GAME_DATA.quests) {
      if (!game.state.quests.completed.includes(q.id)) game.state.quests.completed.push(q.id);
    }
    game.state.quests.active = [];
    this.toast({type:'success', text:`All ${GAME_DATA.quests.length} quests completed`});
    this.renderPage('admin');
  };

  UI.prototype._admResetFightCave = function() {
    game.state.stats.fightCaveAttempts = 0;
    game.state.stats.fightCaveCompletions = 0;
    game.state.stats.fightCaveDeaths = 0;
    game.state.stats.fightCaveBestWave = 0;
    game.state.stats.jadKills = 0;
    game.state.stats.jadDeaths = 0;
    this.toast({type:'success', text:'Fight Cave stats reset'});
    this.renderPage('admin');
  };

  UI.prototype._admBroadcast = function() {
    const input = document.getElementById('adm-broadcast');
    const text = input?.value?.trim();
    if (!text) return;
    if (typeof online !== 'undefined' && online.isOnline) {
      online.sendSystemMessage(text);
      this.toast({type:'success', text:'Broadcast sent'});
      input.value = '';
    } else {
      this.toast({type:'warn', text:'Not online'});
    }
  };

  UI.prototype._admGiveItem = function(itemId, qty) {
    game.addItem(itemId, qty);
    this.toast({type:'success', text:`+${qty}x ${GAME_DATA.items[itemId]?.name || itemId}`});
    this.renderPage('admin');
  };

  UI.prototype._admFilterItems = function(val) {
    this._admItemSearch = val;
    this.renderPage('admin');
  };

  UI.prototype._admInspectState = function() {
    const input = document.getElementById('adm-state-path');
    const path = input?.value?.trim();
    if (!path) return;
    this._admStatePath = path;
    try {
      let val = game.state;
      for (const p of path.split('.')) val = val?.[p];
      this._admStateResult = typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val);
    } catch(e) {
      this._admStateResult = 'Error: ' + e.message;
    }
    this.renderPage('admin');
  };

  UI.prototype._admGiveCustom = function() {
    const id = document.getElementById('adm-give-id')?.value?.trim();
    const qty = parseInt(document.getElementById('adm-give-qty')?.value) || 1;
    if (!id) return;
    if (!GAME_DATA.items[id]) { this.toast({type:'warn', text:`Item "${id}" not found`}); return; }
    game.addItem(id, qty);
    this.toast({type:'success', text:`+${qty}x ${GAME_DATA.items[id].name}`});
    this.renderPage('admin');
  };

  UI.prototype._admGiveCustomXp = function() {
    const skill = document.getElementById('adm-xp-skill')?.value;
    const amt = parseInt(document.getElementById('adm-xp-amt')?.value) || 0;
    if (!skill || !amt) return;
    game.addXp(skill, amt);
    this.toast({type:'success', text:`+${amt} ${GAME_DATA.skills[skill]?.name||skill} XP`});
    this.renderPage('admin');
  };

  console.log('[Ashfall] Admin panel loaded.');
}

// Apply immediately
applyAdminPanel();

// ── DIRECT ACCESS ROUTES ──────────────────────────────────
// #admin hash route — navigate to ashfall-idle.vercel.app/#admin
window.addEventListener('hashchange', function() {
  if (location.hash === '#admin' && typeof ui !== 'undefined') {
    if (typeof isAdmin === 'function' && isAdmin()) {
      ui.currentPage = 'admin';
      ui.renderSidebar();
      ui.renderPage('admin');
    }
  }
});

// Check hash on initial load too
window.addEventListener('DOMContentLoaded', function() {
  setTimeout(function() {
    if (location.hash === '#admin' && typeof ui !== 'undefined' && typeof isAdmin === 'function' && isAdmin()) {
      ui.currentPage = 'admin';
      ui.renderSidebar();
      ui.renderPage('admin');
    }
  }, 2000); // Wait for auth to complete
});

// Console command: type openAdmin() in browser console
window.openAdmin = function() {
  if (typeof isAdmin === 'function' && isAdmin()) {
    ui.currentPage = 'admin';
    ui.renderSidebar();
    ui.renderPage('admin');
    console.log('[Admin] Panel opened.');
  } else {
    console.warn('[Admin] Access denied — not verified as admin.');
  }
};

// Periodic sidebar check — ensures admin entry appears after async auth completes
(function() {
  let _admSidebarChecks = 0;
  const _admSidebarInterval = setInterval(function() {
    _admSidebarChecks++;
    if (_admSidebarChecks > 30) { clearInterval(_admSidebarInterval); return; } // Stop after 30s
    if (typeof isAdmin === 'function' && isAdmin() && typeof ui !== 'undefined') {
      const sidebar = document.getElementById('sidebar');
      if (sidebar && !sidebar.querySelector('[data-page="admin"]')) {
        ui.renderSidebar();
      }
      clearInterval(_admSidebarInterval);
    }
  }, 1000);
})();

})();
