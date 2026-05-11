// ============================================================
// ASHFALL IDLE — ADMIN PANEL  v3.0
// ============================================================

(function() {

const ADMIN_VERSION = '4.0';

function _checkAdmin() {
  // Owner/hardcoded admin
  if (typeof isAdmin === 'function' && isAdmin()) return true;
  // RTDB role-based access — any non-viewer role gets admin panel
  if (typeof adminRoles !== 'undefined' && adminRoles.currentUserRole) {
    const accessRoles = ['OWNER','ADMIN','LEAD_DEV','GAME_DESIGNER','COMMUNITY_MANAGER',
                         'MODERATOR','CONTENT_CREATOR','ART_LEAD','ARTIST','TESTER'];
    return accessRoles.includes(adminRoles.currentUserRole);
  }
  return false;
}

// ── CUSTOM IMAGE LOADERS ─────────────────────────────────
async function loadCustomMonsterImages() {
  if (typeof online === 'undefined' || !online.db) return;
  try {
    const snap = await online.db.ref('/monster_images').once('value');
    const data = snap.val(); if (!data) return;
    if (!GAME_DATA.monsterArt) GAME_DATA.monsterArt = {};
    let n = 0;
    for (const [id, img] of Object.entries(data)) {
      if (img) { GAME_DATA.monsterArt[id] = `<img src="${img}" class="monster-art-img" alt="${id}">`; n++; }
    }
    console.log(`[Admin] ${n} monster images loaded`);
    if (n && typeof ui !== 'undefined' && ui.currentPage === 'combat') ui.renderPage('combat');
  } catch(e) { console.warn('[Admin] Monster image load failed:', e); }
}

async function saveMonsterImage(id, url) {
  await online.db.ref(`/monster_images/${id}`).set(url);
  if (!GAME_DATA.monsterArt) GAME_DATA.monsterArt = {};
  GAME_DATA.monsterArt[id] = `<img src="${url}" class="monster-art-img" alt="${id}">`;
}
async function deleteMonsterImage(id) {
  await online.db.ref(`/monster_images/${id}`).remove();
  if (GAME_DATA.monsterArt?.[id]?.startsWith?.('<img')) delete GAME_DATA.monsterArt[id];
}

function _resizeImage(dataUrl, maxW, maxH) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      let w = img.width, h = img.height;
      if (w > maxW || h > maxH) { const s = Math.min(maxW/w, maxH/h); w=Math.floor(w*s); h=Math.floor(h*s); }
      c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(c.toDataURL('image/png', 0.88));
    };
    img.src = dataUrl;
  });
}

// ── INIT ─────────────────────────────────────────────────
function applyAdminPanel() {
  if (typeof UI === 'undefined' || typeof GameEngine === 'undefined') { setTimeout(applyAdminPanel, 200); return; }

  // Route
  const origRenderPage = UI.prototype.renderPage;
  UI.prototype.renderPage = function(pageId) {
    if (pageId === 'admin') { const m = document.getElementById('main-content'); if (m) this.renderAdminPanel(m); return; }
    origRenderPage.call(this, pageId);
  };

  // Sidebar entry
  const origSidebar = UI.prototype.renderSidebar;
  UI.prototype.renderSidebar = function() {
    origSidebar.call(this);
    if (!_checkAdmin()) return;
    const nav = document.querySelector('#sidebar .sidebar-nav');
    if (!nav || nav.querySelector('[data-page="admin"]')) return;
    const s = document.createElement('div');
    s.className = 'nav-section';
    s.innerHTML = `<div class="nav-header">Admin</div><div class="nav-item ${this.currentPage==='admin'?'active':''}" data-page="admin"><span class="nav-icon">${typeof icon==='function'?icon('settings',16):''}</span><span class="nav-label">Admin Panel</span></div>`;
    nav.appendChild(s);
  };

  // ── MAIN RENDER ─────────────────────────────────────────
  UI.prototype.renderAdminPanel = function(el) {
    if (!_checkAdmin()) { el.innerHTML = '<div class="bank-empty">Access denied.</div>'; return; }
    const s = game.state;
    const tab = this._admTab || 'dashboard';

    const TABS = [
      { id:'dashboard',  label:'Dashboard',   icon:'⚡' },
      { id:'players',    label:'Players',     icon:'👤' },
      { id:'online',     label:'Online',      icon:'🟢' },
      { id:'guilds_adm', label:'Guilds',      icon:'🏰' },
      { id:'economy',    label:'Economy',     icon:'📈' },
      { id:'items',      label:'Items',       icon:'⚔' },
      { id:'create',     label:'Create',      icon:'➕' },
      { id:'shop_mgr',   label:'Shop',        icon:'🛒' },
      { id:'recipes',    label:'Recipes',     icon:'📖' },
      { id:'monsters',   label:'Monsters',    icon:'💀' },
      { id:'theatre',    label:'Theatre',     icon:'🎭' },
      { id:'abilities',  label:'Abilities',   icon:'✦' },
      { id:'npcs',       label:'NPCs',        icon:'💬' },
      { id:'skills',     label:'Skills',      icon:'📊' },
      { id:'gold',       label:'Gold',        icon:'💰' },
      { id:'leaderboard',label:'Leaderboard', icon:'🏆' },
      { id:'content',    label:'Content',     icon:'📢' },
      { id:'settings',   label:'Settings',    icon:'🔧' },
      { id:'logs',       label:'Logs',        icon:'📋' },
      { id:'combat',     label:'Combat',      icon:'⚔' },
      { id:'quests',     label:'Quests',      icon:'📜' },
      { id:'worldboss',  label:'World Boss',  icon:'👑' },
      { id:'state',      label:'State',       icon:'🔍' },
      { id:'tools',      label:'Tools',       icon:'🛠' },
    ];

    let html = `<div class="admin-panel">
      <div class="admin-header-bar">
        <div class="ahb-title">⚙ Ashfall Admin <span class="ahb-ver">v${ADMIN_VERSION}</span></div>
        <div class="ahb-sub">
          ${online?.displayName||'Admin'} • ${new Date().toLocaleTimeString()}
          ${typeof adminRoles !== 'undefined' ? `<span style="margin-left:20px; padding:4px 8px; background:${adminRoles.getCurrentUserInfo().color}33; border:1px solid ${adminRoles.getCurrentUserInfo().color}; border-radius:4px; font-size:11px; color:${adminRoles.getCurrentUserInfo().color}">
            ${adminRoles.getCurrentUserInfo().icon} ${adminRoles.getCurrentUserInfo().name}
          </span>` : ''}
        </div>
      </div>
      <div class="admin-tabs">
        ${TABS.map(t=>`<button class="admin-tab ${tab===t.id?'active':''}" onclick="ui._admTab='${t.id}';ui.renderPage('admin')">${t.icon} ${t.label}</button>`).join('')}
      </div>
      <div class="admin-body">`;

    // ── DASHBOARD ─────────────────────────────────────────
    if (tab === 'dashboard') {
      const totalLevel = Object.values(s.skills).reduce((a,sk)=>a+(sk.level||1),0);
      const totalItems = Object.keys(s.bank).filter(k=>s.bank[k]>0).length;
      const playTimeH  = Math.floor((s.stats?.totalPlayTime||0)/3600);
      html += `
      <div class="adm-dashboard-grid">
        <div class="adm-kpi"><div class="adm-kpi-val">${this.fmt(s.gold)}</div><div class="adm-kpi-lbl">Gold</div></div>
        <div class="adm-kpi"><div class="adm-kpi-val">${totalLevel}</div><div class="adm-kpi-lbl">Total Level</div></div>
        <div class="adm-kpi"><div class="adm-kpi-val">${game.getCombatLevel()}</div><div class="adm-kpi-lbl">Combat Level</div></div>
        <div class="adm-kpi"><div class="adm-kpi-val">${totalItems}</div><div class="adm-kpi-lbl">Item Types</div></div>
        <div class="adm-kpi"><div class="adm-kpi-val">${this.fmt(s.stats?.monstersKilled||0)}</div><div class="adm-kpi-lbl">Kills</div></div>
        <div class="adm-kpi"><div class="adm-kpi-val">${s.quests?.completed?.length||0}</div><div class="adm-kpi-lbl">Quests</div></div>
        <div class="adm-kpi"><div class="adm-kpi-val">${playTimeH}h</div><div class="adm-kpi-lbl">Play Time</div></div>
        <div class="adm-kpi"><div class="adm-kpi-val">${s.stats?.fightCaveCompletions||0}</div><div class="adm-kpi-lbl">FC Clears</div></div>
      </div>`;

      // Render all widgets that are enabled
      if (typeof dashWidgets !== 'undefined') {
        if (dashboardCustomizer?.widgets?.quick_stats?.enabled) html += dashWidgets.renderQuickStats();
        if (dashboardCustomizer?.widgets?.recent_edits?.enabled) html += dashWidgets.renderRecentEdits();
        if (dashboardCustomizer?.widgets?.game_health?.enabled) html += dashWidgets.renderGameHealth();
        if (dashboardCustomizer?.widgets?.quick_actions?.enabled) html += dashWidgets.renderQuickActions();
        if (dashboardCustomizer?.widgets?.item_warnings?.enabled) html += dashWidgets.renderItemWarnings();
        if (dashboardCustomizer?.widgets?.monster_warnings?.enabled) html += dashWidgets.renderMonsterWarnings();
        if (dashboardCustomizer?.widgets?.economy_stats?.enabled) html += dashWidgets.renderEconomyStats();
        if (dashboardCustomizer?.widgets?.content_summary?.enabled) html += dashWidgets.renderContentSummary();
      }
    }

    // ── PLAYERS ──────────────────────────────────────────
    if (tab === 'players') {
      html += `<div class="adm-section"><h3>Player Management</h3>
        <div class="adm-row-flex" style="margin-bottom:8px">
          <button class="btn btn-sm" onclick="ui._admLoadPlayers()">🔄 Load Players</button>
          <button class="btn btn-sm" onclick="ui._admLoadPlayers('totalLevel')">Sort by Level</button>
          <button class="btn btn-sm" onclick="ui._admLoadPlayers('kills')">Sort by Kills</button>
          <button class="btn btn-sm btn-danger" onclick="ui._admDeleteGhosts()">Delete Ghosts</button>
        </div>
        <div class="adm-row-flex">
          <input type="text" class="bank-search-input" placeholder="Search by name or UID…" oninput="ui._admPlayerFilter=this.value;ui.renderPage('admin')" value="${this._admPlayerFilter||''}" style="flex:1">
          <span class="adm-stat" style="white-space:nowrap">${this._admPlayerList?.length||0} loaded</span>
        </div>
      </div>`;

      if (this._admPlayerEdit) {
        const p = this._admPlayerEdit;
        const uid = p.uid;
        const sv = this._admPlayerSave; // loaded save data
        const svLoading = this._admSaveLoading;
        
        html += `<div class="adm-section">
          <h3>Editing: <span style="color:var(--accent)">${p.displayName||p.uid}</span></h3>
          <button class="btn btn-xs" onclick="ui._admPlayerEdit=null;ui._admPlayerSave=null;ui.renderPage('admin')" style="margin-bottom:10px">← Back to List</button>
          <div class="adm-grid" style="margin-bottom:10px">
            <div class="adm-stat">UID: <code style="font-size:10px;cursor:pointer" onclick="navigator.clipboard?.writeText('${uid}')">${uid}</code></div>
            <div class="adm-stat">TL: ${p.totalLevel||'?'} | CL: ${p.combatLevel||'?'}</div>
            <div class="adm-stat">Kills: ${p.kills||0} | Quests: ${p.questsCompleted||0}</div>
            <div class="adm-stat">Last seen: ${p.lastSeen?.toDate?.()?.toLocaleDateString?.() || 'unknown'}</div>
          </div>`;

        if (svLoading) {
          html += `<div style="color:var(--amber);padding:20px;text-align:center">Loading player save data...</div>`;
        } else if (!sv) {
          html += `<div style="color:#cc6666;padding:20px;text-align:center">Could not load save. Player may not have a cloud save.</div>`;
        } else {
          // ── GOLD (from live save) ─────────────────────────
          html += `<h4 style="color:var(--accent);font-size:13px;margin:12px 0 6px">Gold — <span style="color:var(--text)">${(sv.gold||0).toLocaleString()}</span></h4>
          <div class="adm-remote-grid">
            <div class="adm-remote-card">
              <span class="adm-rc-label">Add Gold</span>
              <div class="adm-row-flex">
                <input type="number" id="adm-rp-gold" class="bank-search-input" value="10000" style="width:100px">
                <button class="btn btn-xs" onclick="online.adminGivePlayerGold('${uid}',parseInt(document.getElementById('adm-rp-gold').value)||0).then(()=>ui._admRefreshSave('${uid}'))">+ Add</button>
              </div>
            </div>
            <div class="adm-remote-card">
              <span class="adm-rc-label">Set Gold (exact)</span>
              <div class="adm-row-flex">
                <input type="number" id="adm-rp-gold-set" class="bank-search-input" value="${sv.gold||0}" style="width:100px">
                <button class="btn btn-xs" onclick="online.adminSetPlayerGold('${uid}',parseInt(document.getElementById('adm-rp-gold-set').value)||0).then(()=>ui._admRefreshSave('${uid}'))">Set</button>
              </div>
            </div>
          </div>`;

          // ── SKILLS (from live save — show actual level + XP) ──
          const skills = sv.skills || {};
          html += `<h4 style="color:var(--accent);font-size:13px;margin:12px 0 6px">Skills</h4>
          <div class="adm-row-flex" style="margin-bottom:8px;gap:4px">
            <button class="btn btn-xs" onclick="if(confirm('Max ALL skills to 99?'))online.adminMaxPlayerSkills('${uid}').then(()=>ui._admRefreshSave('${uid}'))">Max All → 99</button>
            <button class="btn btn-xs btn-danger" onclick="if(confirm('Reset ALL skills to 1?'))online.adminResetPlayerSkills('${uid}').then(()=>ui._admRefreshSave('${uid}'))">Reset All → 1</button>
            <button class="btn btn-xs" onclick="ui._admRefreshSave('${uid}')">🔄 Refresh</button>
          </div>
          <div style="display:grid;grid-template-columns:90px 35px 75px 120px 90px;gap:2px;font-size:11px;margin-bottom:12px">
            <div style="font-weight:700;color:var(--amber)">Skill</div>
            <div style="font-weight:700;color:var(--amber)">Lv</div>
            <div style="font-weight:700;color:var(--amber)">XP</div>
            <div style="font-weight:700;color:var(--amber)">Set Level</div>
            <div style="font-weight:700;color:var(--amber)">Give XP</div>`;
          for (const [id, sk] of Object.entries(skills)) {
            html += `<div style="color:var(--text)">${id}</div>
              <div style="color:var(--amber);font-weight:700">${sk.level}</div>
              <div style="color:var(--text-dim)">${(sk.xp||0).toLocaleString()}</div>
              <div><div class="adm-row-flex" style="gap:2px"><input type="number" id="adm-sl-${id}" class="bank-search-input" value="${sk.level}" min="1" max="99" style="width:45px;padding:1px 3px;font-size:10px"><button class="btn btn-xs" style="padding:0 4px;font-size:9px" onclick="online.adminSetPlayerLevel('${uid}','${id}',parseInt(document.getElementById('adm-sl-${id}').value)||1).then(()=>ui._admRefreshSave('${uid}'))">Set</button></div></div>
              <div><div class="adm-row-flex" style="gap:2px"><input type="number" id="adm-xp-${id}" class="bank-search-input" value="50000" style="width:55px;padding:1px 3px;font-size:10px"><button class="btn btn-xs" style="padding:0 4px;font-size:9px" onclick="online.adminGivePlayerXp('${uid}','${id}',parseInt(document.getElementById('adm-xp-${id}').value)||0).then(()=>ui._admRefreshSave('${uid}'))">+XP</button></div></div>`;
          }
          html += `</div>`;

          // ── ITEMS ─────────────────────────────────────────
          html += `<h4 style="color:var(--accent);font-size:13px;margin:12px 0 6px">Items</h4>
          <div class="adm-remote-grid">
            <div class="adm-remote-card">
              <span class="adm-rc-label">Give Item</span>
              <div class="adm-row-flex">
                <input type="text" id="adm-rp-item" class="bank-search-input" placeholder="item_id..." style="width:140px" list="adm-item-datalist">
                <input type="number" id="adm-rp-item-qty" class="bank-search-input" value="1" style="width:60px">
                <button class="btn btn-xs" onclick="online.adminGivePlayerItem('${uid}',document.getElementById('adm-rp-item').value,parseInt(document.getElementById('adm-rp-item-qty').value)||1).then(()=>ui._admRefreshSave('${uid}'))">Give</button>
              </div>
              <datalist id="adm-item-datalist">${Object.entries(GAME_DATA.items).slice(0,500).map(([id,it])=>`<option value="${id}">${it.name}</option>`).join('')}</datalist>
            </div>
            <div class="adm-remote-card">
              <span class="adm-rc-label">Remove Item</span>
              <div class="adm-row-flex">
                <input type="text" id="adm-rp-item-rm" class="bank-search-input" placeholder="item_id" style="width:140px" list="adm-item-datalist">
                <input type="number" id="adm-rp-item-rm-qty" class="bank-search-input" value="1" style="width:60px">
                <button class="btn btn-xs btn-danger" onclick="online.adminRemovePlayerItem('${uid}',document.getElementById('adm-rp-item-rm').value,parseInt(document.getElementById('adm-rp-item-rm-qty').value)||1).then(()=>ui._admRefreshSave('${uid}'))">Remove</button>
              </div>
            </div>
            <div class="adm-remote-card">
              <button class="btn btn-xs btn-danger" onclick="if(confirm('Clear entire bank?'))online.adminClearPlayerBank('${uid}').then(()=>ui._admRefreshSave('${uid}'))">Clear Entire Bank</button>
            </div>
          </div>`;

          // ── EQUIPMENT ─────────────────────────────────────
          html += `<h4 style="color:var(--accent);font-size:13px;margin:12px 0 6px">Equipment</h4>
          <div class="adm-remote-grid"><div class="adm-remote-card">
            <div class="adm-row-flex">
              <select id="adm-rp-eq-slot" class="bank-search-input" style="width:80px">
                ${['weapon','head','body','legs','boots','gloves','shield','cape','ring','amulet','ammo'].map(s=>`<option value="${s}">${s}</option>`).join('')}
              </select>
              <input type="text" id="adm-rp-eq-item" class="bank-search-input" placeholder="item_id (blank=unequip)" style="width:120px" list="adm-item-datalist">
              <button class="btn btn-xs" onclick="online.adminSetPlayerEquipment('${uid}',document.getElementById('adm-rp-eq-slot').value,document.getElementById('adm-rp-eq-item').value||null).then(()=>ui._admRefreshSave('${uid}'))">Set</button>
            </div>`;
          // Show current equipment
          const eq = sv.equipment || {};
          const slots = ['weapon','head','body','legs','boots','gloves','shield','cape','ring','amulet','ammo'];
          for (const slot of slots) {
            const itemId = eq[slot];
            if (itemId) {
              const name = GAME_DATA.items[itemId]?.name || itemId;
              html += `<div style="display:flex;justify-content:space-between;padding:2px 0;font-size:11px;border-bottom:1px solid rgba(255,255,255,0.05)"><span style="color:var(--amber)">${slot}:</span><span>${name}</span><button class="btn btn-xs" style="padding:0 4px;font-size:9px" onclick="online.adminSetPlayerEquipment('${uid}','${slot}',null).then(()=>ui._admRefreshSave('${uid}'))">×</button></div>`;
            }
          }
          html += `</div></div>`;

          // ── STAT EDITOR ───────────────────────────────────
          html += `<h4 style="color:var(--accent);font-size:13px;margin:12px 0 6px">Modify Any Stat</h4>
          <div class="adm-remote-grid"><div class="adm-remote-card">
            <div class="adm-row-flex">
              <input type="text" id="adm-rp-stat-path" class="bank-search-input" placeholder="e.g. stats.monstersKilled" style="width:180px">
              <input type="text" id="adm-rp-stat-val" class="bank-search-input" placeholder="value" style="width:80px">
              <button class="btn btn-xs" onclick="let v=document.getElementById('adm-rp-stat-val').value;try{v=JSON.parse(v)}catch(e){};online.adminSetPlayerStat('${uid}',document.getElementById('adm-rp-stat-path').value,v).then(()=>ui._admRefreshSave('${uid}'))">Set</button>
            </div>
            <div style="font-size:10px;color:var(--text-dim);margin-top:4px">Paths: gold, alignment, prayerPoints, stats.monstersKilled, stats.dungeonsCompleted, stats.barrowsCompletions, stats.infernoCompletions</div>
          </div></div>`;

          // ── VIEWERS ───────────────────────────────────────
          html += `<h4 style="color:var(--accent);font-size:13px;margin:12px 0 6px">View Data</h4>
          <div class="adm-remote-grid"><div class="adm-remote-card" style="grid-column:1/-1">
            <div class="adm-row-flex" style="margin-bottom:6px">
              <button class="btn btn-xs" onclick="ui._admLoadPlayerBank('${uid}')">View Bank</button>
              <button class="btn btn-xs" onclick="ui._admLoadPlayerStats('${uid}')">View Stats</button>
              <button class="btn btn-xs" onclick="ui._admLoadRawSave('${uid}')">Load Raw JSON</button>
            </div>
            <div id="adm-rp-save-display" style="font-size:11px;max-height:400px;overflow:auto;background:rgba(0,0,0,0.3);border-radius:4px;padding:8px;color:var(--text-dim)"></div>
          </div></div>`;

          // ── RAW JSON ──────────────────────────────────────
          html += `<h4 style="color:var(--accent);font-size:13px;margin:12px 0 6px">Raw JSON Editor</h4>
          <div class="adm-remote-card" style="margin-bottom:10px">
            <button class="btn btn-xs" onclick="ui._admLoadRawSave('${uid}')" style="margin-bottom:4px">Load Raw JSON</button>
            <textarea id="adm-rp-raw-json" class="bank-search-input" style="width:100%;height:200px;font-family:monospace;font-size:10px;resize:vertical" placeholder="Click Load Raw JSON first..."></textarea>
            <button class="btn btn-sm btn-danger" style="margin-top:4px" onclick="if(confirm('Overwrite entire save?')){ui._admSaveRawJson('${uid}')}">Save Raw JSON</button>
          </div>`;
        }

        html += `<div class="adm-btn-grid" style="margin-top:10px">
            <button class="btn btn-sm btn-danger" onclick="ui._admDeletePlayer('${uid}','${(p.displayName||'?').replace(/'/g,"\\'")}')">🗑 Delete Player</button>
            <button class="btn btn-sm" onclick="ui._admBanPlayer('${uid}','${(p.displayName||'?').replace(/'/g,"\\'")}')">🚫 Ban Player</button>
          </div>
        </div>`;
      }

      if (this._admPlayerList?.length > 0) {
        const pf = (this._admPlayerFilter||'').toLowerCase();
        const fp = pf ? this._admPlayerList.filter(p=>(p.displayName||'').toLowerCase().includes(pf)||p.uid.toLowerCase().includes(pf)) : this._admPlayerList;
        html += `<div class="adm-section"><div class="adm-player-table">
          <div class="adm-pt-header"><span>Name</span><span>UID</span><span>TL</span><span>CL</span><span>Kills</span><span>Actions</span></div>`;
        for (const p of fp.slice(0, 100)) {
          const isMe = p.uid === online?.user?.uid;
          const safe = (p.displayName||'?').replace(/[<>"&]/g,'').replace(/'/g,"\\'");
          html += `<div class="adm-pt-row ${isMe?'adm-pt-me':''}">
            <span class="adm-item-name" title="${p.uid}">${p.displayName||'?'}${isMe?' 👑':''}</span>
            <span class="adm-item-id">${p.uid.substring(0,10)}…</span>
            <span>${p.totalLevel||'?'}</span>
            <span>${p.combatLevel||'?'}</span>
            <span>${p.kills||0}</span>
            <span class="adm-pt-btns">
              <button class="btn btn-xs" onclick="ui._admOpenPlayer(${JSON.stringify(p).replace(/"/g,'&quot;').replace(/'/g,"\\'")})">View</button>
              ${!isMe?`<button class="btn btn-xs btn-danger" data-adm-delete-uid="${p.uid}" data-adm-delete-name="${safe}">Delete</button>`:''}
            </span>
          </div>`;
        }
        if (fp.length > 100) html += `<div class="adm-pt-row" style="color:var(--text-dim);font-size:11px">Showing 100 of ${fp.length} — refine search to see more</div>`;
        html += `</div></div>`;
      } else {
        html += `<div class="adm-section"><div class="bank-empty" style="padding:20px">Click "Load Players" to fetch the player list from Firebase.</div></div>`;
      }
    }

    // ── ONLINE PLAYERS ───────────────────────────────────
    if (tab === 'online') {
      html += `<div class="adm-section"><h3>Online Players (from RTDB Presence)</h3>
        <button class="btn btn-sm" onclick="ui._admLoadOnline()" style="margin-bottom:8px">🔄 Refresh</button>
        <div id="adm-online-list"><div class="adm-stat">Click Refresh to load.</div></div>
      </div>`;
      html += `<script>setTimeout(()=>{ui._admLoadOnline()},200);<\/script>`;
    }

    // ── GUILD ADMIN ──────────────────────────────────────
    if (tab === 'guilds_adm') {
      html += `<div class="adm-section"><h3>Guild Management</h3>
        <button class="btn btn-sm" onclick="ui._admLoadGuilds()" style="margin-bottom:8px">🔄 Load All Guilds</button>
        <div id="adm-guilds-list"><div class="adm-stat">Click Load to fetch guilds.</div></div>
      </div>`;
      if (this._admGuildEdit) {
        const g = this._admGuildEdit;
        html += `<div class="adm-section">
          <h3>Editing: <span style="color:var(--accent)">[${g.tag||''}] ${g.name}</span></h3>
          <button class="btn btn-xs" onclick="ui._admGuildEdit=null;ui.renderPage('admin')" style="margin-bottom:8px">← Back</button>
          <div class="adm-grid">
            <div class="adm-stat">ID: <code style="font-size:9px">${g.id}</code></div>
            <div class="adm-stat">Leader: ${g.leaderName||'?'} (${(g.leader||'').substring(0,10)}...)</div>
            <div class="adm-stat">Members: ${g.memberCount||g.members?.length||0}/50</div>
            <div class="adm-stat">Bank: ${g.bank||0}g</div>
            <div class="adm-stat">Join: ${g.settings?.joinType||'open'}</div>
            <div class="adm-stat">MOTD: ${g.motd||'none'}</div>
          </div>
          <h4 style="margin:10px 0 6px;font-size:12px;color:var(--accent)">Members</h4>
          <div class="adm-grid">${(g.members||[]).map(m=>{
            const rank = m.rank||m.role||'Recruit';
            return `<div class="adm-stat">${rank}: <strong>${m.name}</strong> (${(m.uid||'').substring(0,8)}...)</div>`;
          }).join('')}</div>
          <div class="adm-btn-grid" style="margin-top:10px">
            <button class="btn btn-sm" onclick="ui._admSetGuildGold('${g.id}')">Set Bank Gold</button>
            <button class="btn btn-sm btn-danger" onclick="ui._admDeleteGuild('${g.id}','${(g.name||'').replace(/'/g,"\\'")}')" >Delete Guild</button>
          </div>
        </div>`;
      }
    }

    // ── ECONOMY OVERVIEW ─────────────────────────────────
    if (tab === 'economy') {
      html += `<div class="adm-section"><h3>Economy Overview</h3>
        <button class="btn btn-sm" onclick="ui._admLoadEconomy()" style="margin-bottom:8px">🔄 Scan Economy</button>
        <div id="adm-economy-data"><div class="adm-stat">Click Scan to analyze.</div></div>
      </div>
      <div class="adm-section"><h3>Economy Controls</h3>
        <div class="adm-btn-grid">
          <button class="btn btn-sm" onclick="ui._admPushLive('xp_multiplier',2.0)">2x XP Event</button>
          <button class="btn btn-sm" onclick="ui._admPushLive('gold_multiplier',2.0)">2x Gold Event</button>
          <button class="btn btn-sm" onclick="ui._admPushLive('drop_multiplier',2.0)">2x Drop Event</button>
          <button class="btn btn-sm" onclick="ui._admPushLive('xp_multiplier',1.0);ui._admPushLive('gold_multiplier',1.0);ui._admPushLive('drop_multiplier',1.0)">Reset All Multipliers</button>
        </div>
      </div>
      <div class="adm-section"><h3>Active Bazaar Listings</h3>
        <button class="btn btn-sm" onclick="ui._admLoadBazaar()" style="margin-bottom:8px">Load Bazaar</button>
        <div id="adm-bazaar-data"><div class="adm-stat">Click Load to fetch.</div></div>
      </div>`;
    }

    // ── ITEMS ─────────────────────────────────────────────
    if (tab === 'items') {
      const editId = this._admItemEdit;
      const editItem = editId ? GAME_DATA.items[editId] : null;

      if (editItem) {
        const hasImg = !!editItem._customImage;
        html += `<div class="adm-section">
          <h3>Edit Item — <span style="color:${GAME_DATA.rarities?.[editItem.rarity]?.color||'var(--accent)'}">${editItem.name}</span></h3>
          <div style="display:flex; gap:8px; margin-bottom:10px">
            <button class="btn btn-xs" onclick="ui._admItemEdit=null;ui.renderPage('admin')">← Back to Items</button>
            <button class="btn btn-xs" onclick="if(typeof enhancedItemTools!=='undefined'){enhancedItemTools.duplicateItem('${editId}')}">📋 Duplicate</button>
          </div>

          ${typeof enhancedItemTools !== 'undefined' ? enhancedItemTools.renderItemPreview(editId) : ''}

          ${typeof adminTools !== 'undefined' ? adminTools.renderNotesUI(editId) : ''}

          ${typeof contentAnalyzer !== 'undefined' ? contentAnalyzer.renderDependencyAnalysis('item', editId) : ''}

          <div class="adm-item-edit-layout">
            <div class="adm-item-preview-col">
              <div class="adm-item-preview-box">
                ${hasImg ? `<img src="${editItem._customImage}" style="max-width:128px;max-height:128px;object-fit:contain">` : `<div class="adm-no-img-placeholder">No Image</div>`}
              </div>
              <div class="adm-img-rarity-badge" style="background:${GAME_DATA.rarities?.[editItem.rarity]?.color||'#888'}22;border:1px solid ${GAME_DATA.rarities?.[editItem.rarity]?.color||'#888'};border-radius:4px;padding:3px 10px;font-size:11px;color:${GAME_DATA.rarities?.[editItem.rarity]?.color||'#aaa'};text-align:center;margin-top:6px">${editItem.rarity||'none'}</div>
              <div class="adm-btn-grid" style="margin-top:8px;flex-direction:column">
                <input type="file" id="item-img-upload" accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml" style="display:none" onchange="ui._admUploadItemImage('${editId}',this)">
                <button class="btn btn-sm" onclick="document.getElementById('item-img-upload').click()">📷 Upload Image/SVG</button>
                ${hasImg?`<button class="btn btn-sm btn-danger" onclick="ui._admDeleteItemImage('${editId}')">🗑 Remove Image</button>`:''}
              </div>
              <div id="adm-item-img-status" class="adm-img-status"></div>
              <div class="adm-img-hint">PNG/JPG/WebP/SVG. Auto-resized to 128px. Stored globally in Firebase.</div>
            </div>

            <div class="adm-item-stats-col">
              <div class="adm-edit-grid">
                <label>Name</label><input type="text" id="ei-name" class="bank-search-input" value="${(editItem.name||'').replace(/"/g,'&quot;')}">
                <label>Description</label><input type="text" id="ei-desc" class="bank-search-input" value="${(editItem.desc||'').replace(/"/g,'&quot;')}">
                <label>Type</label><input type="text" id="ei-type" class="bank-search-input" value="${editItem.type||''}">
                <label>Subtype</label><input type="text" id="ei-subtype" class="bank-search-input" value="${editItem.subtype||''}">
                <label>Rarity</label>
                <select id="ei-rarity" class="bank-search-input">
                  ${['','common','uncommon','rare','epic','legendary','mythic'].map(r=>`<option value="${r}" ${editItem.rarity===r?'selected':''}>${r||'(none)'}</option>`).join('')}
                </select>
                <label>Sell Price</label><input type="number" id="ei-price" class="bank-search-input" value="${editItem.sellPrice||0}">
                ${editItem.stats?`
                <label style="color:var(--accent-dim);grid-column:1/-1;font-size:11px;margin-top:4px">— Combat Stats —</label>
                <label>Atk Bonus</label><input type="number" id="ei-atk" class="bank-search-input" value="${editItem.stats.attackBonus||0}">
                <label>Str Bonus</label><input type="number" id="ei-str" class="bank-search-input" value="${editItem.stats.strengthBonus||0}">
                <label>Mag Bonus</label><input type="number" id="ei-mag" class="bank-search-input" value="${editItem.stats.magicBonus||0}">
                <label>Rng Bonus</label><input type="number" id="ei-rng" class="bank-search-input" value="${editItem.stats.rangedBonus||0}">
                <label>Def Bonus</label><input type="number" id="ei-def" class="bank-search-input" value="${editItem.stats.defenceBonus||0}">
                `:''}
              </div>
              <div class="adm-btn-grid" style="margin-top:10px">
                <button class="btn btn-sm" onclick="ui._admSaveItemEdit('${editId}')">💾 Save Changes</button>
              </div>
            </div>
          </div>
        </div>

        <div class="adm-section"><h3>Give / Take — ${editItem.name}</h3>
          <div class="adm-row-flex">
            <input type="number" id="ei-qty" class="bank-search-input" value="1" style="width:80px">
            <button class="btn btn-sm" onclick="ui._admGiveItemQty('${editId}')">Give</button>
            <button class="btn btn-sm btn-danger" onclick="ui._admTakeItemQty('${editId}')">Take</button>
            <button class="btn btn-sm btn-danger" onclick="if(confirm('Remove all?')){game.state.bank['${editId}']=0;ui.renderPage('admin')}">Remove All</button>
          </div>
          <div style="margin-top:6px;font-size:12px;color:var(--text-dim)">In bank: <strong>${s.bank[editId]||0}</strong></div>
        </div>`;

      } else {
        // Item list
        const iSearch = (this._admItemSearch||'').toLowerCase();
        const iType   = this._admItemType||'';
        const iRarity = this._admItemRarity||'';
        const allI = Object.values(GAME_DATA.items)
          .filter(i=>(!iSearch||i.id.includes(iSearch)||(i.name||'').toLowerCase().includes(iSearch))
                  && (!iType  ||i.type===iType)
                  && (!iRarity||i.rarity===iRarity))
          .slice(0, 60);

        html += `<div class="adm-section"><h3>Items (${Object.keys(GAME_DATA.items).length} total)</h3>
          <div class="adm-row-flex" style="margin-bottom:8px;flex-wrap:wrap;gap:6px">
            <input type="text" class="bank-search-input" placeholder="Search ID or name…" oninput="ui._admItemSearch=this.value;ui.renderPage('admin')" value="${this._admItemSearch||''}" style="flex:1;min-width:150px">
            <select class="bank-search-input" style="width:120px" onchange="ui._admItemType=this.value;ui.renderPage('admin')">
              <option value="">All Types</option>
              ${[...new Set(Object.values(GAME_DATA.items).map(i=>i.type).filter(Boolean))].sort().map(t=>`<option value="${t}" ${this._admItemType===t?'selected':''}>${t}</option>`).join('')}
            </select>
            <select class="bank-search-input" style="width:120px" onchange="ui._admItemRarity=this.value;ui.renderPage('admin')">
              <option value="">All Rarities</option>
              ${['common','uncommon','rare','epic','legendary','mythic'].map(r=>`<option value="${r}" ${this._admItemRarity===r?'selected':''}>${r}</option>`).join('')}
            </select>
          </div>
          <div class="adm-item-list">`;
        for (const item of allI) {
          const qty = s.bank[item.id]||0;
          const col = GAME_DATA.rarities?.[item.rarity]?.color||'';
          const hasImg = !!item._customImage;
          html += `<div class="adm-item-row">
            ${hasImg?`<img src="${item._customImage}" class="adm-item-thumb" title="${item.id}">`:item.rarity?`<div class="adm-item-dot" style="background:${col}"></div>`:'<div class="adm-item-dot"></div>'}
            <span class="adm-item-name" style="${col?'color:'+col:''}">${item.name}</span>
            <span class="adm-item-id">${item.id}</span>
            <span class="adm-item-qty">x${qty}</span>
            <button class="btn btn-xs" onclick="ui._admGiveItem('${item.id}',1)">+1</button>
            <button class="btn btn-xs" onclick="ui._admGiveItem('${item.id}',10)">+10</button>
            <button class="btn btn-xs" onclick="ui._admGiveItem('${item.id}',100)">+100</button>
            <button class="btn btn-xs btn-danger" onclick="ui._admTakeItem('${item.id}',1)">-1</button>
            <button class="btn btn-xs btn-danger" onclick="ui._admTakeItem('${item.id}',10)">-10</button>
            <button class="btn btn-xs" onclick="ui._admItemEdit='${item.id}';ui.renderPage('admin')">✏ Edit</button>
          </div>`;
        }
        html += `</div>${allI.length===60?`<div style="font-size:11px;color:var(--text-dim);padding:4px 6px">Showing 60 results — refine search</div>`:''}</div>
        <div class="adm-section"><h3>Give / Take Custom</h3>
          <div class="adm-row-flex">
            <input type="text" id="adm-give-id" class="bank-search-input" placeholder="Item ID">
            <input type="number" id="adm-give-qty" class="bank-search-input" placeholder="Qty" value="1" style="width:80px">
            <button class="btn btn-sm" onclick="ui._admGiveCustom()">Give</button>
            <button class="btn btn-sm btn-danger" onclick="ui._admTakeCustom()">Take</button>
          </div>
        </div>`;
      }
    }

    // ── MONSTERS ──────────────────────────────────────────
    if (tab === 'monsters') {
      const editMon = this._admMonEdit ? GAME_DATA.monsters[this._admMonEdit] : null;
      if (editMon) {
        const mId = editMon.id;
        const hasCustom = GAME_DATA.monsterArt?.[mId]?.startsWith?.('<img');
        const hasSvg    = GAME_DATA.monsterArt?.[mId] && !hasCustom;
        html += `<div class="adm-section">
          <h3>Edit Monster — <span style="color:var(--accent)">${editMon.name}</span> <small style="color:var(--text-dim)">${mId}</small></h3>
          <div style="display:flex; gap:8px; margin-bottom:10px">
            <button class="btn btn-xs" onclick="ui._admMonEdit=null;ui.renderPage('admin')">← Back</button>
            <button class="btn btn-xs" onclick="if(typeof enhancedMonsterTools!=='undefined'){enhancedMonsterTools.duplicateMonster('${mId}')}">📋 Duplicate</button>
          </div>

          ${typeof enhancedMonsterTools !== 'undefined' ? enhancedMonsterTools.renderSVGEditor(mId) : ''}

          ${typeof adminTools !== 'undefined' ? adminTools.renderDifficultyWidget(mId) : ''}

          ${typeof contentAnalyzer !== 'undefined' ? contentAnalyzer.renderDependencyAnalysis('monster', mId) : ''}

          <div class="adm-item-edit-layout">
            <div class="adm-item-preview-col">
              <div class="adm-item-preview-box adm-mon-preview-large">${GAME_DATA.monsterArt?.[mId]||'<div class="adm-mon-no-art-lg">?</div>'}</div>
              <input type="file" id="mon-img-upload" accept="image/png,image/jpeg,image/gif,image/webp" style="display:none" onchange="ui._admUploadMonsterImage('${mId}',this)">
              <div class="adm-btn-grid" style="margin-top:8px;flex-direction:column">
                <button class="btn btn-sm" onclick="document.getElementById('mon-img-upload').click()">📷 Upload Image</button>
                ${hasCustom?`<button class="btn btn-sm btn-danger" onclick="ui._admDeleteMonsterImage('${mId}')">🗑 Remove Image</button>`:''}
                ${hasSvg?'<span class="adm-img-note">Has SVG — upload to override</span>':''}
              </div>
              <div id="adm-img-status" class="adm-img-status"></div>
              <div class="adm-img-hint">PNG/JPG/GIF/WebP. Auto-resized to 256px. Stored in Firebase RTDB for all players.</div>
            </div>
            <div class="adm-item-stats-col">
              <div class="adm-edit-grid">
                <label>Name</label><input type="text" id="em-name" class="bank-search-input" value="${(editMon.name||'').replace(/"/g,'&quot;')}">
                <label>HP</label><input type="number" id="em-hp" class="bank-search-input" value="${editMon.hp||100}">
                <label>Max Hit</label><input type="number" id="em-maxhit" class="bank-search-input" value="${editMon.maxHit||10}">
                <label>Combat Level</label><input type="number" id="em-cl" class="bank-search-input" value="${editMon.combatLevel||1}">
                <label>Atk Speed (s)</label><input type="number" id="em-spd" class="bank-search-input" value="${editMon.attackSpeed||3}" step="0.1">
                <label>XP per kill</label><input type="number" id="em-xp" class="bank-search-input" value="${editMon.xp||100}">
                <label>Gold Min</label><input type="number" id="em-goldmin" class="bank-search-input" value="${editMon.gold?.min||0}">
                <label>Gold Max</label><input type="number" id="em-goldmax" class="bank-search-input" value="${editMon.gold?.max||0}">
                <label>Style</label>
                <select id="em-style" class="bank-search-input">
                  ${['melee','ranged','magic'].map(st=>`<option value="${st}" ${editMon.style===st?'selected':''}>${st}</option>`).join('')}
                </select>
                <label>Melee Evasion</label><input type="number" id="em-evm" class="bank-search-input" value="${editMon.evasion?.melee||0}">
                <label>Ranged Evasion</label><input type="number" id="em-evr" class="bank-search-input" value="${editMon.evasion?.ranged||0}">
                <label>Magic Evasion</label><input type="number" id="em-evmg" class="bank-search-input" value="${editMon.evasion?.magic||0}">
              </div>
              <div class="adm-btn-grid" style="margin-top:10px">
                <button class="btn btn-sm" onclick="ui._admSaveMonsterEdit('${mId}')">💾 Save Stats</button>
                <button class="btn btn-sm" onclick="game.startCombat(null,'${mId}')">⚔ Fight</button>
              </div>
            </div>
          </div>
        </div>
        <div class="adm-section"><h4>Drops (${(editMon.drops||[]).length})</h4>
          <div class="adm-drop-list">`;
        for (let i=0;i<(editMon.drops||[]).length;i++) {
          const d=editMon.drops[i];
          html+=`<div class="adm-drop-row"><span class="adm-item-id" style="min-width:140px">${d.item}</span><span>x${d.qty}</span><span>${(d.chance*100).toFixed(2)}%</span><button class="btn btn-xs" onclick="ui._admEditDrop('${mId}',${i})">Edit</button><button class="btn btn-xs btn-danger" onclick="if(confirm('Remove?')){GAME_DATA.monsters['${mId}'].drops.splice(${i},1);ui.renderPage('admin')}">✕</button></div>`;
        }
        html+=`</div><div class="adm-row-flex" style="margin-top:8px">
          <input type="text" id="drop-item-id" class="bank-search-input" placeholder="Item ID">
          <input type="number" id="drop-qty" class="bank-search-input" placeholder="Qty" value="1" style="width:60px">
          <input type="number" id="drop-chance" class="bank-search-input" placeholder="Chance 0-1" value="0.05" step="0.005" style="width:100px">
          <button class="btn btn-sm" onclick="ui._admAddDrop('${mId}')">+ Add Drop</button>
        </div></div>`;
        if (this._admEditDropIdx != null) {
          const di=this._admEditDropIdx, dd=editMon.drops?.[di];
          if (dd) html+=`<div class="adm-modal-overlay"><div class="adm-modal"><h4>Edit Drop #${di}</h4><div class="adm-edit-grid"><label>Item ID</label><input type="text" id="dmod-item" class="bank-search-input" value="${dd.item}"><label>Qty</label><input type="number" id="dmod-qty" class="bank-search-input" value="${dd.qty}"><label>Chance (0-1)</label><input type="number" id="dmod-chance" class="bank-search-input" value="${dd.chance}" step="0.001"></div><div class="adm-btn-grid" style="margin-top:10px"><button class="btn btn-sm" onclick="ui._admSaveDrop('${mId}',${di})">Save</button><button class="btn btn-xs" onclick="ui._admEditDropIdx=null;ui.renderPage('admin')">Cancel</button></div></div></div>`;
        }
      } else {
        html+=`<div class="adm-section"><h3>Monsters (${Object.keys(GAME_DATA.monsters||{}).length})</h3>
          <input type="text" class="bank-search-input" placeholder="Search monsters…" oninput="ui._admMonSearch=this.value;ui.renderPage('admin')" value="${this._admMonSearch||''}" style="margin-bottom:8px">
          <div class="adm-mon-grid">`;
        const ms=(this._admMonSearch||'').toLowerCase();
        for (const m of Object.values(GAME_DATA.monsters||{}).filter(m=>!ms||m.name.toLowerCase().includes(ms)||m.id.toLowerCase().includes(ms))) {
          const hasC=GAME_DATA.monsterArt?.[m.id]?.startsWith?.('<img'),hasS=GAME_DATA.monsterArt?.[m.id]&&!hasC;
          html+=`<div class="adm-mon-card"><div class="adm-mon-thumb">${GAME_DATA.monsterArt?.[m.id]||'<div class="adm-mon-no-art">?</div>'}</div><div class="adm-mon-info"><div class="adm-mon-name">${m.name} <small>${m.id}</small>${hasC?' <span class="adm-badge-img">IMG</span>':hasS?' <span class="adm-badge-svg">SVG</span>':''}</div><div class="adm-mon-stats">HP:${m.hp} Hit:${m.maxHit} Lv:${m.combatLevel} ${m.style} ${m.xp||0}xp | ${(m.drops||[]).length} drops</div></div><div class="adm-mon-actions"><button class="btn btn-xs" onclick="ui._admMonEdit='${m.id}';ui._admEditDropIdx=null;ui.renderPage('admin')">✏ Edit</button><button class="btn btn-xs" onclick="game.startCombat(null,'${m.id}')">⚔</button></div></div>`;
        }
        html+=`</div></div>`;
      }
    }

    // ── SKILLS ────────────────────────────────────────────
    if (tab === 'skills') {
      html+=`<div class="adm-section"><h3>Skills</h3>
        <div class="adm-btn-grid" style="margin-bottom:10px">
          <button class="btn btn-sm" onclick="ui._admMaxAll()">Max All (99)</button>
          <button class="btn btn-sm btn-danger" onclick="if(confirm('Reset ALL skills to 1?')){for(const sk of Object.keys(game.state.skills)){game.state.skills[sk].level=1;game.state.skills[sk].xp=0;}ui.toast({type:'success',text:'Reset'});ui.renderPage('admin')}">Reset All to 1</button>
        </div>
        <div class="adm-skill-grid">`;
      for (const [id,sk] of Object.entries(s.skills)) {
        const name=GAME_DATA.skills[id]?.name||id, maxXp=13034431;
        const pct=Math.round((sk.xp/maxXp)*100);
        html+=`<div class="adm-skill-row">
          <span class="adm-sk-name">${name}</span>
          <span class="adm-sk-level">Lv <input type="number" value="${sk.level}" min="1" max="99" onchange="ui._admSetSkillLevel('${id}',parseInt(this.value))" style="width:38px;padding:2px 4px;background:var(--bg-deep);border:1px solid var(--border);color:var(--text);border-radius:3px;font-size:11px"></span>
          <div class="adm-sk-xpbar"><div class="adm-sk-xpfill" style="width:${pct}%"></div></div>
          <span class="adm-sk-xp">${this.fmt(sk.xp)} xp</span>
          <button class="btn btn-xs" onclick="game.addXp('${id}',1000);ui.renderPage('admin')">+1K</button>
          <button class="btn btn-xs" onclick="game.addXp('${id}',50000);ui.renderPage('admin')">+50K</button>
          <button class="btn btn-xs" onclick="ui._admSetSkillLevel('${id}',99)">Max</button>
          <button class="btn btn-xs btn-danger" onclick="ui._admTakeXp('${id}',10000)">-10K</button>
          <button class="btn btn-xs btn-danger" onclick="if(confirm('Reset ${name}?')){game.state.skills['${id}'].level=1;game.state.skills['${id}'].xp=0;ui.renderPage('admin')}">✕</button>
        </div>`;
      }
      html+=`</div></div>
      <div class="adm-section"><h3>Custom XP</h3><div class="adm-row-flex">
        <select id="adm-xp-skill" class="bank-search-input" style="width:140px">${Object.keys(s.skills).map(sk=>`<option value="${sk}">${GAME_DATA.skills[sk]?.name||sk}</option>`).join('')}</select>
        <input type="number" id="adm-xp-amt" class="bank-search-input" placeholder="Amount" value="10000" style="width:110px">
        <button class="btn btn-sm" onclick="ui._admGiveCustomXp()">Give XP</button>
        <button class="btn btn-sm btn-danger" onclick="ui._admTakeCustomXp()">Take XP</button>
      </div></div>`;
    }

    // ── GOLD ──────────────────────────────────────────────
    if (tab === 'gold') {
      html+=`<div class="adm-section"><h3>Gold — <span style="color:var(--accent)">${this.fmt(s.gold)}</span></h3>
        <div class="adm-btn-grid" style="margin-bottom:12px">
          ${[1000,10000,100000,1000000].map(v=>`<button class="btn btn-sm" onclick="game.state.gold+=${v};ui.toast({type:'success',text:'+${this.fmt(v)} gold'});ui.renderPage('admin')">+${this.fmt(v)}</button>`).join('')}
          ${[1000,10000,100000].map(v=>`<button class="btn btn-sm btn-danger" onclick="game.state.gold=Math.max(0,game.state.gold-${v});ui.renderPage('admin')">-${this.fmt(v)}</button>`).join('')}
          <button class="btn btn-sm btn-danger" onclick="if(confirm('Set gold to 0?')){game.state.gold=0;ui.renderPage('admin')}">Set 0</button>
        </div>
        <div class="adm-row-flex">
          <input type="number" id="adm-gold-amt" class="bank-search-input" placeholder="Custom amount" value="100000" style="width:160px">
          <button class="btn btn-sm" onclick="const a=parseInt(document.getElementById('adm-gold-amt').value)||0;game.state.gold+=a;ui.toast({type:'success',text:'+'+a+' gold'});ui.renderPage('admin')">Add</button>
          <button class="btn btn-sm btn-danger" onclick="const a=parseInt(document.getElementById('adm-gold-amt').value)||0;game.state.gold=Math.max(0,game.state.gold-a);ui.renderPage('admin')">Take</button>
          <button class="btn btn-sm" onclick="const a=parseInt(document.getElementById('adm-gold-amt').value)||0;game.state.gold=a;ui.toast({type:'info',text:'Gold set to '+a});ui.renderPage('admin')">Set Exact</button>
        </div>
      </div>`;
    }

    // ── LEADERBOARD ───────────────────────────────────────
    if (tab === 'leaderboard') {
      html+=`<div class="adm-section"><h3>Leaderboard Management</h3>
        <div class="adm-row-flex" style="margin-bottom:8px">
          <button class="btn btn-sm" onclick="ui._admLoadLeaderboard()">Load Leaderboard</button>
          <button class="btn btn-sm btn-danger" onclick="if(confirm('RESET ENTIRE LEADERBOARD? This deletes all entries permanently.')){online.resetLeaderboard().then(ok=>ui.toast({type:ok?'success':'warn',text:ok?'Leaderboard reset':'Failed'}))}">Reset Leaderboard</button>
        </div>
      </div>`;
      if (this._admLeaderboard?.length > 0) {
        html+=`<div class="adm-section"><div class="adm-player-table">
          <div class="adm-pt-header"><span>Rank</span><span>Name</span><span>TL</span><span>CL</span><span>Actions</span></div>`;
        for (let i=0;i<this._admLeaderboard.length;i++) {
          const p=this._admLeaderboard[i];
          html+=`<div class="adm-pt-row"><span>#${i+1}</span><span class="adm-item-name">${p.displayName||'?'}</span><span>${p.totalLevel||'?'}</span><span>${p.combatLevel||'?'}</span><span class="adm-pt-btns"><button class="btn btn-xs btn-danger" data-adm-delete-uid="${p.uid}" data-adm-delete-name="${(p.displayName||'?').replace(/"/g,'&quot;')}">Delete</button></span></div>`;
        }
        html+=`</div></div>`;
      }
    }

    // ── CONTENT ───────────────────────────────────────────
    if (tab === 'content') {
      html+=`<div class="adm-section"><h3>Announcements & Patch Notes</h3>
        <div class="adm-edit-grid" style="margin-bottom:10px">
          <label>Title</label><input type="text" id="ann-title" class="bank-search-input" placeholder="e.g. v9.4 Update">
          <label>Body</label><input type="text" id="ann-body" class="bank-search-input" placeholder="Message content…">
          <label>Type</label>
          <select id="ann-type" class="bank-search-input">
            <option value="info">Info</option><option value="success">Update</option><option value="warn">Warning</option><option value="event">Event</option>
          </select>
        </div>
        <div class="adm-btn-grid">
          <button class="btn btn-sm" onclick="ui._admPostAnnouncement()">📢 Post Announcement</button>
        </div>
      </div>
      <div class="adm-section"><h3>Current Announcements</h3>
        <div id="adm-announcements-list"><div class="adm-stat">Loading…</div></div>
      </div>
      <div class="adm-section"><h3>Global Chat Broadcast</h3>
        <div class="adm-row-flex">
          <input type="text" id="adm-broadcast2" class="bank-search-input" placeholder="System message for global chat…" style="flex:1">
          <button class="btn btn-sm" onclick="ui._admBroadcast('adm-broadcast2')">Send to Chat</button>
        </div>
      </div>`;
      // Load announcements async
      html+=`<script>setTimeout(async()=>{const el=document.getElementById('adm-announcements-list');if(!el)return;const anns=await online.getAnnouncements?.();if(!anns?.length){el.innerHTML='<div class="adm-stat">None.</div>';return;}el.innerHTML=anns.map(a=>'<div class="adm-item-row"><span class="adm-item-name">'+a.title+'</span><span class="adm-item-id">'+a.type+'</span><span style="flex:1;font-size:11px;color:var(--text-dim)">'+a.body+'</span><span style="font-size:10px;color:var(--text-dim)">'+new Date(a.at).toLocaleDateString()+'</span><button class="btn btn-xs btn-danger" onclick="online.deleteAnnouncement(\\''+(a.id||'')+'\\').then(()=>{ui.renderPage(\\'admin\\')})">✕</button></div>').join('');},300);<\/script>`;
    }

    // ── SETTINGS ─────────────────────────────────────────
    if (tab === 'settings') {
      // Branding Editor
      if (typeof brandingEditor !== 'undefined') {
        html += brandingEditor.renderUI();
      }

      // Backup/Restore
      if (typeof dataManager !== 'undefined') {
        html += dataManager.renderBackupUI();
      }

      // Keyboard Shortcuts
      if (typeof adminTools !== 'undefined') {
        html += adminTools.renderKeyboardShortcuts();
      }

      // Original Feature Flags section
      html+=`<div class="adm-section"><h3>Feature Flags <small style="color:var(--text-dim)">(stored in Firebase RTDB, live for all players)</small></h3>
        <div id="adm-settings-area"><div class="adm-stat">Loading…</div></div>
        <div class="adm-section" style="margin-top:10px"><h4>Set Custom Flag</h4>
          <div class="adm-row-flex">
            <input type="text" id="adm-flag-key" class="bank-search-input" placeholder="Flag key (e.g. double_xp)">
            <input type="text" id="adm-flag-val" class="bank-search-input" placeholder="Value (true/false/number/string)">
            <button class="btn btn-sm" onclick="ui._admSetFlag()">Set Flag</button>
          </div>
        </div>
      </div>`;
      // Live Push quick buttons
      html+=`<div class="adm-section"><h3>Live Push Controls</h3>
        <p style="font-size:11px;color:var(--text-dim);margin:0 0 8px">Push real-time updates to all connected clients. Changes take effect on next client poll.</p>
        <div class="adm-btn-grid">
          <button class="btn btn-sm" onclick="ui._admPushLive('xp_multiplier',2.0)">Enable 2x XP</button>
          <button class="btn btn-sm" onclick="ui._admPushLive('xp_multiplier',3.0)">Enable 3x XP</button>
          <button class="btn btn-sm" onclick="ui._admPushLive('xp_multiplier',1.0)">Reset XP (1x)</button>
          <button class="btn btn-sm" onclick="ui._admPushLive('gold_multiplier',2.0)">Enable 2x Gold</button>
          <button class="btn btn-sm" onclick="ui._admPushLive('gold_multiplier',1.0)">Reset Gold (1x)</button>
          <button class="btn btn-sm" onclick="ui._admPushLive('drop_multiplier',2.0)">Enable 2x Drops</button>
          <button class="btn btn-sm" onclick="ui._admPushLive('drop_multiplier',1.0)">Reset Drops (1x)</button>
          <button class="btn btn-sm" onclick="ui._admPushLive('maintenance',true)">Maintenance ON</button>
          <button class="btn btn-sm" onclick="ui._admPushLive('maintenance',false)">Maintenance OFF</button>
        </div>
        <div class="adm-row-flex" style="margin-top:10px">
          <input type="text" id="adm-push-key" class="bank-search-input" placeholder="Custom key">
          <input type="text" id="adm-push-val" class="bank-search-input" placeholder="Value (JSON)">
          <button class="btn btn-sm" onclick="try{ui._admPushLive(document.getElementById('adm-push-key').value,JSON.parse(document.getElementById('adm-push-val').value))}catch(e){ui.toast({type:'warn',text:'Invalid JSON'})}">Push</button>
        </div>
      </div>`;
      const knownFlags = [
        {key:'double_xp',       label:'Double XP',            desc:'2x XP for all skills'},
        {key:'xp_multiplier',   label:'XP Multiplier',        desc:'Float: 1.0 = normal, 2.0 = double'},
        {key:'gold_multiplier', label:'Gold Multiplier',       desc:'Float: 1.0 = normal, 2.0 = double'},
        {key:'drop_multiplier', label:'Drop Rate Multiplier',  desc:'Float: 1.0 = normal, 2.0 = double'},
        {key:'double_drops',    label:'Double Drops',          desc:'2x drop rates (legacy boolean)'},
        {key:'safe_wilderness', label:'Safe Wilderness',       desc:'Disable PvP in wilderness'},
        {key:'bazaar_disabled', label:'Disable Bazaar',        desc:'Take bazaar offline'},
        {key:'maintenance',     label:'Maintenance Mode',      desc:'Show maintenance banner'},
        {key:'event_active',    label:'Event Active',          desc:'Trigger event banner'},
        {key:'event_name',      label:'Event Name',            desc:'Name of the active event'},
        {key:'gifts_disabled',  label:'Disable Gifts',         desc:'Turn off gift/trade system'},
      ];
      html+=`<script>setTimeout(async()=>{const el=document.getElementById('adm-settings-area');if(!el)return;const settings=await online.getGameSettings?.();let h='<div class="adm-flags-grid">';for(const f of ${JSON.stringify(knownFlags)}){const v=settings[f.key];h+='<div class="adm-flag-row"><div><div class="adm-flag-name">'+f.label+'</div><div class="adm-flag-desc">'+f.desc+'</div></div><div class="adm-flag-val">'+JSON.stringify(v??null)+'</div><div class="adm-flag-actions"><button class="btn btn-xs" onclick="online.setGameSetting(\\''+f.key+'\\',true).then(()=>ui.renderPage(\\'admin\\'))">On</button><button class="btn btn-xs" onclick="online.setGameSetting(\\''+f.key+'\\',false).then(()=>ui.renderPage(\\'admin\\'))">Off</button><button class="btn btn-xs btn-danger" onclick="online.setGameSetting(\\''+f.key+'\\',null).then(()=>ui.renderPage(\\'admin\\'))">Clear</button></div></div>';}h+='</div>';el.innerHTML=h;},300);<\/script>`;
    }

    // ── LOGS ─────────────────────────────────────────────
    if (tab === 'logs') {
      // Activity Feed
      if (typeof adminActivityFeed !== 'undefined') {
        html += adminActivityFeed.renderActivityFeed();
      }

      // Changelog
      if (typeof changelog !== 'undefined') {
        html += changelog.renderChangelog();
      }

      html+=`<div class="adm-section"><h3>Admin Action Log</h3>
        <button class="btn btn-sm" onclick="ui._admLoadLogs()" style="margin-bottom:8px">🔄 Load Logs</button>
        <div id="adm-logs-area">`;
      if (this._admLogs?.length > 0) {
        for (const log of this._admLogs) {
          const d = JSON.parse(log.data||'{}');
          const time = new Date(log.at).toLocaleString();
          html+=`<div class="adm-log-row">
            <span class="adm-log-time">${time}</span>
            <span class="adm-log-by">${log.byName||log.by||'?'}</span>
            <span class="adm-log-action">${log.action}</span>
            <span class="adm-log-data">${d.targetName||d.key||d.itemId||d.title||''}</span>
          </div>`;
        }
      } else {
        html+=`<div class="adm-stat">Click Load Logs to fetch.</div>`;
      }
      html+=`</div></div>`;
    }

    // ── COMBAT ────────────────────────────────────────────
    if (tab === 'combat') {
      const c=s.combat;
      html+=`<div class="adm-section"><h3>Combat State</h3><div class="adm-grid">
        <div class="adm-stat">Active: <strong>${c.active?'Yes':'No'}</strong></div>
        <div class="adm-stat">Monster: <strong>${c.monster||'None'}</strong></div>
        <div class="adm-stat">Player HP: <strong>${c.playerHp||0}/${game.getMaxHp()}</strong></div>
        <div class="adm-stat">Monster HP: <strong>${c.monsterHp||0}</strong></div>
        <div class="adm-stat">Style: <strong>${c.combatStyle||'melee'}</strong></div>
        <div class="adm-stat">Spec Energy: <strong>${s.specEnergy||0}%</strong></div>
      </div></div>
      <div class="adm-section"><h3>Combat Actions</h3><div class="adm-btn-grid">
        <button class="btn btn-sm" onclick="game.stopCombat();ui.renderPage('admin')">Stop Combat</button>
        <button class="btn btn-sm" onclick="game.state.combat.playerHp=game.getMaxHp();ui.renderPage('admin')">Full Heal</button>
        <button class="btn btn-sm" onclick="game.state.specEnergy=100;ui.renderPage('admin')">Fill Spec</button>
        <button class="btn btn-sm" onclick="game.state.prayerPoints=99;ui.renderPage('admin')">Fill Prayer</button>
        <button class="btn btn-sm" onclick="game.state.combat.monsterHp=1;ui.renderPage('admin')">Monster → 1 HP</button>
        <button class="btn btn-sm" onclick="if(game.state.fightCave?.active){game.state.fightCave.currentWave=61;game.state.fightCave.betweenWaves=true;game.state.fightCave.betweenWaveTimer=1;}">Skip to Jad</button>
      </div></div>`;
    }

    // ── QUESTS ────────────────────────────────────────────
    if (tab === 'quests') {
      html+=`<div class="adm-section"><h3>Quests</h3>
        <div class="adm-btn-grid" style="margin-bottom:8px">
          <button class="btn btn-sm" onclick="ui._admCompleteQuests()">Complete All</button>
          <button class="btn btn-sm btn-danger" onclick="if(confirm('Reset all?')){game.state.quests={completed:[],active:[]};ui.renderPage('admin')}">Reset All</button>
        </div>`;
      if (GAME_DATA.quests) for (const q of GAME_DATA.quests) {
        const done=s.quests?.completed?.includes(q.id),active=s.quests?.active?.find(a=>a.id===q.id);
        html+=`<div class="adm-quest-row ${done?'adm-q-done':active?'adm-q-active':''}"><span class="adm-q-status">${done?'✓':active?'▶':'○'}</span><span class="adm-q-name">${q.name}</span><span class="adm-q-id">${q.id}</span>${!done?`<button class="btn btn-xs" onclick="if(!game.state.quests.completed.includes('${q.id}'))game.state.quests.completed.push('${q.id}');game.state.quests.active=game.state.quests.active.filter(a=>a.id!=='${q.id}');ui.renderPage('admin')">Complete</button>`:''}${done?`<button class="btn btn-xs btn-danger" onclick="game.state.quests.completed=game.state.quests.completed.filter(id=>id!=='${q.id}');ui.renderPage('admin')">Undo</button>`:''}</div>`;
      }
      html+=`</div>`;
    }

    // ── CREATE (no-code item/monster/recipe creator) ──────
    if (tab === 'create') {
      const cMode = this._admCreateMode || 'item';
      html += `<div class="adm-section"><h3>➕ Create New Game Content</h3>
        <div class="adm-btn-grid" style="margin-bottom:12px">
          <button class="btn btn-sm ${cMode==='item'?'btn-active':''}" onclick="ui._admCreateMode='item';ui.renderPage('admin')">New Item</button>
          <button class="btn btn-sm ${cMode==='monster'?'btn-active':''}" onclick="ui._admCreateMode='monster';ui.renderPage('admin')">New Monster</button>
          <button class="btn btn-sm ${cMode==='recipe'?'btn-active':''}" onclick="ui._admCreateMode='recipe';ui.renderPage('admin')">New Recipe</button>
          <button class="btn btn-sm ${cMode==='area'?'btn-active':''}" onclick="ui._admCreateMode='area';ui.renderPage('admin')">New Combat Area</button>
        </div>`;

      if (cMode === 'item') {
        html += `<div class="adm-create-form"><h4>New Item</h4>
          <div class="adm-edit-grid">
            <label>ID (no spaces)</label><input type="text" id="ci-id" class="bank-search-input" placeholder="e.g. dragon_platebody">
            <label>Name</label><input type="text" id="ci-name" class="bank-search-input" placeholder="Dragon Platebody">
            <label>Description</label><input type="text" id="ci-desc" class="bank-search-input" placeholder="A powerful dragonhide platebody.">
            <label>Type</label>
            <select id="ci-type" class="bank-search-input" onchange="ui.renderPage('admin')">
              <option value="weapon">weapon</option><option value="armor">armor</option><option value="ammo">ammo</option>
              <option value="food">food</option><option value="resource">resource</option><option value="potion">potion</option>
              <option value="tool">tool</option><option value="special">special</option><option value="quest">quest</option>
            </select>
            <label>Slot</label>
            <select id="ci-slot" class="bank-search-input">
              <option value="">(none)</option><option value="weapon">weapon</option><option value="shield">shield</option>
              <option value="head">head</option><option value="body">body</option><option value="legs">legs</option>
              <option value="boots">boots</option><option value="gloves">gloves</option><option value="ring">ring</option>
              <option value="amulet">amulet</option><option value="cape">cape</option><option value="ammo">ammo</option>
            </select>
            <label>Style (weapons)</label>
            <select id="ci-style" class="bank-search-input">
              <option value="">(none)</option><option value="melee">melee</option><option value="ranged">ranged</option><option value="magic">magic</option>
            </select>
            <label>Rarity</label>
            <select id="ci-rarity" class="bank-search-input">
              ${['common','uncommon','rare','epic','legendary','mythic'].map(r=>`<option value="${r}">${r}</option>`).join('')}
            </select>
            <label>Sell Price</label><input type="number" id="ci-price" class="bank-search-input" value="100">
            <label>Attack Speed</label><input type="number" id="ci-speed" step="0.1" class="bank-search-input" value="2.4" placeholder="2.4">
            <label>Heals (food)</label><input type="number" id="ci-heals" class="bank-search-input" value="0">
            <label style="color:var(--accent-dim);grid-column:1/-1;font-size:11px;margin-top:4px">— Combat Stats (0 = omit) —</label>
            <label>Attack Bonus</label><input type="number" id="ci-atk" class="bank-search-input" value="0">
            <label>Strength Bonus</label><input type="number" id="ci-str" class="bank-search-input" value="0">
            <label>Defence Bonus</label><input type="number" id="ci-def" class="bank-search-input" value="0">
            <label>Ranged Bonus</label><input type="number" id="ci-rng" class="bank-search-input" value="0">
            <label>Magic Bonus</label><input type="number" id="ci-mag" class="bank-search-input" value="0">
            <label>Dmg Reduction</label><input type="number" id="ci-dr" class="bank-search-input" value="0">
            <label style="color:var(--accent-dim);grid-column:1/-1;font-size:11px;margin-top:4px">— Level Requirements —</label>
            <label>Attack Req</label><input type="number" id="ci-req-atk" class="bank-search-input" value="0">
            <label>Defence Req</label><input type="number" id="ci-req-def" class="bank-search-input" value="0">
            <label>Ranged Req</label><input type="number" id="ci-req-rng" class="bank-search-input" value="0">
            <label>Magic Req</label><input type="number" id="ci-req-mag" class="bank-search-input" value="0">
            <label>Add to Shop?</label>
            <select id="ci-shop" class="bank-search-input">
              <option value="">No</option><option value="equipment">Yes – Equipment</option><option value="weapons">Yes – Weapons</option>
              <option value="food">Yes – Food</option><option value="potions">Yes – Potions</option>
            </select>
            <label>Shop Price</label><input type="number" id="ci-shop-price" class="bank-search-input" value="1000">
          </div>
          <div class="adm-btn-grid" style="margin-top:10px">
            <button class="btn btn-sm" onclick="ui._admCreateItem()">✅ Create Item</button>
            <button class="btn btn-sm" onclick="ui._admCreateItem(true)">✅ Create + Give 1</button>
          </div>
          <div id="adm-create-result" style="margin-top:8px;font-size:12px;color:var(--accent)"></div>
        </div>`;
      }

      if (cMode === 'monster') {
        html += `<div class="adm-create-form"><h4>New Monster</h4>
          <div class="adm-edit-grid">
            <label>ID (no spaces)</label><input type="text" id="cm-id" class="bank-search-input" placeholder="e.g. ash_giant">
            <label>Name</label><input type="text" id="cm-name" class="bank-search-input" placeholder="Ash Giant">
            <label>HP</label><input type="number" id="cm-hp" class="bank-search-input" value="200">
            <label>Max Hit</label><input type="number" id="cm-maxhit" class="bank-search-input" value="20">
            <label>Combat Level</label><input type="number" id="cm-cl" class="bank-search-input" value="30">
            <label>Attack Speed (s)</label><input type="number" step="0.1" id="cm-spd" class="bank-search-input" value="2.4">
            <label>XP Per Kill</label><input type="number" id="cm-xp" class="bank-search-input" value="150">
            <label>Style</label>
            <select id="cm-style" class="bank-search-input">
              <option value="melee">melee</option><option value="ranged">ranged</option><option value="magic">magic</option>
            </select>
            <label>Alignment</label>
            <select id="cm-align" class="bank-search-input">
              ${Object.keys(GAME_DATA.alignments||{}).map(a=>`<option value="${a}">${a}</option>`).join('')}
            </select>
            <label>Gold Min</label><input type="number" id="cm-gmin" class="bank-search-input" value="5">
            <label>Gold Max</label><input type="number" id="cm-gmax" class="bank-search-input" value="20">
            <label>Evasion Melee</label><input type="number" id="cm-evmelee" class="bank-search-input" value="10">
            <label>Evasion Ranged</label><input type="number" id="cm-evranged" class="bank-search-input" value="10">
            <label>Evasion Magic</label><input type="number" id="cm-evmagic" class="bank-search-input" value="10">
            <label style="color:var(--accent-dim);grid-column:1/-1;font-size:11px;margin-top:4px">— Drops (comma-separated: item_id:qty:chance) —</label>
            <label>Drop 1</label><input type="text" id="cm-drop1" class="bank-search-input" placeholder="bones:1:1.0">
            <label>Drop 2</label><input type="text" id="cm-drop2" class="bank-search-input" placeholder="gold_ore:2:0.30">
            <label>Drop 3</label><input type="text" id="cm-drop3" class="bank-search-input" placeholder="iron_sword:1:0.05">
            <label>Drop 4</label><input type="text" id="cm-drop4" class="bank-search-input" placeholder="">
            <label>Drop 5</label><input type="text" id="cm-drop5" class="bank-search-input" placeholder="">
            <label>Add to Area</label>
            <select id="cm-area" class="bank-search-input">
              <option value="">(none)</option>
              ${(GAME_DATA.combatAreas||[]).map(a=>`<option value="${a.id}">${a.name}</option>`).join('')}
            </select>
          </div>
          <div class="adm-btn-grid" style="margin-top:10px">
            <button class="btn btn-sm" onclick="ui._admCreateMonster()">✅ Create Monster</button>
          </div>
          <div id="adm-create-result" style="margin-top:8px;font-size:12px;color:var(--accent)"></div>
        </div>`;
      }

      if (cMode === 'recipe') {
        const skillsWithRecipes = Object.keys(GAME_DATA.recipes||{});
        html += `<div class="adm-create-form"><h4>New Recipe</h4>
          <div class="adm-edit-grid">
            <label>Recipe ID</label><input type="text" id="cr-id" class="bank-search-input" placeholder="e.g. cook_dragon_meat">
            <label>Display Name</label><input type="text" id="cr-name" class="bank-search-input" placeholder="Dragon Steak">
            <label>Skill</label>
            <select id="cr-skill" class="bank-search-input">
              ${skillsWithRecipes.map(sk=>`<option value="${sk}">${sk}</option>`).join('')}
            </select>
            <label>Level Required</label><input type="number" id="cr-level" class="bank-search-input" value="1">
            <label>XP Reward</label><input type="number" id="cr-xp" class="bank-search-input" value="100">
            <label>Craft Time (s)</label><input type="number" step="0.1" id="cr-time" class="bank-search-input" value="3.0">
            <label>Output Item ID</label><input type="text" id="cr-out-id" class="bank-search-input" placeholder="dragon_steak">
            <label>Output Quantity</label><input type="number" id="cr-out-qty" class="bank-search-input" value="1">
            <label style="color:var(--accent-dim);grid-column:1/-1;font-size:11px;margin-top:4px">— Inputs (item_id:qty) —</label>
            <label>Input 1</label><input type="text" id="cr-in1" class="bank-search-input" placeholder="raw_dragon:1">
            <label>Input 2</label><input type="text" id="cr-in2" class="bank-search-input" placeholder="coal_ore:2">
            <label>Input 3</label><input type="text" id="cr-in3" class="bank-search-input" placeholder="">
            <label>Input 4</label><input type="text" id="cr-in4" class="bank-search-input" placeholder="">
          </div>
          <div class="adm-btn-grid" style="margin-top:10px">
            <button class="btn btn-sm" onclick="ui._admCreateRecipe()">✅ Add Recipe</button>
          </div>
          <div id="adm-create-result" style="margin-top:8px;font-size:12px;color:var(--accent)"></div>
        </div>`;
      }

      if (cMode === 'area') {
        html += `<div class="adm-create-form"><h4>New Combat Area</h4>
          <div class="adm-edit-grid">
            <label>Area ID</label><input type="text" id="ca-id" class="bank-search-input" placeholder="e.g. ash_wastes">
            <label>Name</label><input type="text" id="ca-name" class="bank-search-input" placeholder="Ash Wastes">
            <label>Description</label><input type="text" id="ca-desc" class="bank-search-input" placeholder="A desolate wasteland.">
            <label>Combat Level Req</label><input type="number" id="ca-lvl" class="bank-search-input" value="1">
            <label>Monster IDs (comma-separated)</label><input type="text" id="ca-monsters" class="bank-search-input" placeholder="goblin,bandit,wolf">
          </div>
          <div class="adm-btn-grid" style="margin-top:10px">
            <button class="btn btn-sm" onclick="ui._admCreateArea()">✅ Create Area</button>
          </div>
          <div id="adm-create-result" style="margin-top:8px;font-size:12px;color:var(--accent)"></div>
        </div>`;
      }

      html += `</div>`;
    }

    // ── SHOP MANAGER ──────────────────────────────────────
    if (tab === 'shop_mgr') {
      html += `<div class="adm-section"><h3>🛒 Shop Manager</h3>
        <p style="font-size:11px;color:var(--text-dim);margin:0 0 10px">Add or remove items from the player shop. Changes are runtime-only unless you edit data.js.</p>
        <div class="adm-edit-grid" style="margin-bottom:10px">
          <label>Item ID</label><input type="text" id="sm-id" class="bank-search-input" placeholder="iron_sword">
          <label>Price (gold)</label><input type="number" id="sm-price" class="bank-search-input" value="500">
          <label>Category</label>
          <select id="sm-cat" class="bank-search-input">
            ${[...new Set((GAME_DATA.shop||[]).map(s=>s.category))].filter(Boolean).concat(['equipment','weapons','food','potions','thieving','special']).filter((v,i,a)=>a.indexOf(v)===i).map(c=>`<option value="${c}">${c}</option>`).join('')}
          </select>
          <label>Custom Category</label><input type="text" id="sm-cat-custom" class="bank-search-input" placeholder="Leave blank to use above">
        </div>
        <div class="adm-btn-grid" style="margin-bottom:12px">
          <button class="btn btn-sm" onclick="ui._admAddToShop()">➕ Add to Shop</button>
        </div>
        <h4 style="margin-bottom:6px">Current Shop (${(GAME_DATA.shop||[]).length} items)</h4>
        <input type="text" class="bank-search-input" placeholder="Search shop…" oninput="ui._admShopSearch=this.value;ui.renderPage('admin')" value="${this._admShopSearch||''}" style="margin-bottom:8px;width:100%">
        <div class="adm-item-list">`;
      const shopSearch = (this._admShopSearch||'').toLowerCase();
      const shopItems = (GAME_DATA.shop||[]).filter(si=>{
        const item=GAME_DATA.items[si.item];
        return !shopSearch || si.item.includes(shopSearch) || (item?.name||'').toLowerCase().includes(shopSearch);
      });
      for (let i=0;i<shopItems.length;i++) {
        const si = shopItems[i]; const item=GAME_DATA.items[si.item];
        const realIdx = GAME_DATA.shop.indexOf(si);
        html += `<div class="adm-item-row">
          <span class="adm-item-name">${item?.name||si.item}</span>
          <span class="adm-item-id">${si.item}</span>
          <span class="adm-item-qty">${si.price}g</span>
          <span style="font-size:10px;color:var(--text-dim)">${si.category||''}</span>
          <input type="number" value="${si.price}" style="width:70px;padding:2px 4px;background:var(--bg-deep);border:1px solid var(--border);color:var(--text);border-radius:3px;font-size:11px" onchange="GAME_DATA.shop[${realIdx}].price=parseInt(this.value)||0;ui.toast({type:'info',text:'Price updated'})">
          <button class="btn btn-xs btn-danger" onclick="GAME_DATA.shop.splice(${realIdx},1);ui.toast({type:'warn',text:'Removed from shop'});ui.renderPage('admin')">✕</button>
        </div>`;
      }
      html += `</div></div>`;
    }

    // ── RECIPES TAB ───────────────────────────────────────
    if (tab === 'recipes') {
      const rSkill = this._admRecipeSkill || Object.keys(GAME_DATA.recipes||{})[0];
      html += `<div class="adm-section"><h3>📖 Recipe Browser & Editor</h3>
        <div class="adm-row-flex" style="margin-bottom:10px">
          <select class="bank-search-input" style="width:150px" onchange="ui._admRecipeSkill=this.value;ui.renderPage('admin')">
            ${Object.keys(GAME_DATA.recipes||{}).map(sk=>`<option value="${sk}" ${rSkill===sk?'selected':''}>${sk}</option>`).join('')}
          </select>
          <input type="text" class="bank-search-input" placeholder="Search…" oninput="ui._admRecipeSearch=this.value;ui.renderPage('admin')" value="${this._admRecipeSearch||''}" style="flex:1">
        </div>`;
      const rSearch = (this._admRecipeSearch||'').toLowerCase();
      const recipes = (GAME_DATA.recipes?.[rSkill]||[]).filter(r=>!rSearch||r.name?.toLowerCase().includes(rSearch)||r.id?.includes(rSearch));
      html += `<div style="font-size:11px;color:var(--text-dim);margin-bottom:6px">${recipes.length} recipes in ${rSkill}</div>`;
      html += `<div class="adm-item-list">`;
      for (const r of recipes) {
        const out = GAME_DATA.items[r.output?.item];
        html += `<div class="adm-item-row" style="flex-wrap:wrap;gap:4px">
          <span class="adm-item-name">${r.name||r.id}</span>
          <span class="adm-item-id">Lv${r.level} · ${r.xp}xp · ${r.time}s</span>
          <span style="font-size:11px;color:var(--text-dim)">→ ${out?.name||r.output?.item} x${r.output?.qty||1}</span>
          <span style="font-size:10px;color:var(--text-dim)">${(r.input||[]).map(i=>`${i.item}x${i.qty}`).join(', ')}</span>
          <input type="number" value="${r.level}" style="width:45px;padding:2px;background:var(--bg-deep);border:1px solid var(--border);color:var(--text);border-radius:3px;font-size:10px" title="Level req" onchange="r.level=parseInt(this.value)||1">
          <input type="number" value="${r.xp}" style="width:55px;padding:2px;background:var(--bg-deep);border:1px solid var(--border);color:var(--text);border-radius:3px;font-size:10px" title="XP" onchange="GAME_DATA.recipes['${rSkill}'].find(rx=>rx.id==='${r.id}').xp=parseInt(this.value)||0">
          <button class="btn btn-xs btn-danger" onclick="if(confirm('Delete recipe ${r.id}?')){const idx=GAME_DATA.recipes['${rSkill}'].findIndex(rx=>rx.id==='${r.id}');if(idx>=0)GAME_DATA.recipes['${rSkill}'].splice(idx,1);ui.renderPage('admin')}">✕ Delete</button>
        </div>`;
      }
      html += `</div></div>`;
    }

    // ── WORLD BOSS ────────────────────────────────────────
    if (tab === 'worldboss') {
      html += `<div class="adm-section"><h3>👑 World Boss Control</h3>`;
      for (const boss of (GAME_DATA.worldBosses||[])) {
        const lastKill = s.worldBossRespawns?.[boss.id] || 0;
        const respawnLeft = Math.max(0, (lastKill + boss.respawn*1000) - Date.now());
        const respawnMin = Math.ceil(respawnLeft/60000);
        const isUp = respawnLeft <= 0;
        html += `<div class="adm-item-row" style="flex-wrap:wrap;gap:6px;align-items:center;padding:8px">
          <span class="adm-item-name">${boss.name}</span>
          <span class="adm-m-meta">Lv${boss.combatLevel} · ${boss.hp.toLocaleString()}HP</span>
          <span style="font-size:11px;${isUp?'color:#4aaa60':'color:#e06040'}">${isUp?'🟢 UP':'🔴 Respawns in '+respawnMin+'m'}</span>
          <button class="btn btn-xs" onclick="delete game.state.worldBossRespawns['${boss.id}'];ui.toast({type:'success',text:'${boss.name} spawned!'});ui.renderPage('admin')">Force Spawn</button>
          <button class="btn btn-xs btn-danger" onclick="game.state.worldBossRespawns['${boss.id}']=Date.now();ui.renderPage('admin')">Reset Timer</button>
          <button class="btn btn-xs" onclick="game.startWorldBoss('${boss.id}');ui.renderPage('combat')">Fight Now</button>
        </div>`;
      }
      html += `<div class="adm-section" style="margin-top:10px"><h3>Spawn All Bosses</h3>
        <button class="btn btn-sm" onclick="(GAME_DATA.worldBosses||[]).forEach(b=>delete game.state.worldBossRespawns[b.id]);ui.toast({type:'success',text:'All world bosses spawned!'});ui.renderPage('admin')">Spawn All World Bosses</button>
      </div></div>`;
    }

    // ── STATE ─────────────────────────────────────────────
    if (tab === 'state') {
      html+=`<div class="adm-section"><h3>Inspect / Edit State</h3>
        <div class="adm-row-flex">
          <input type="text" id="adm-state-path" class="bank-search-input" placeholder="Path e.g. skills.attack or combat.playerHp" value="${this._admStatePath||''}" style="flex:1">
          <button class="btn btn-sm" onclick="ui._admInspectState()">Inspect</button>
        </div>
        <pre class="adm-state-output">${this._admStateResult||'Enter a path to inspect'}</pre>
        <div class="adm-row-flex" style="margin-top:6px">
          <input type="text" id="adm-state-set-val" class="bank-search-input" placeholder='New value (JSON e.g. 99, true, "string")' style="flex:1">
          <button class="btn btn-sm" onclick="ui._admSetStateVal()">Set Value</button>
        </div>
      </div>
      <div class="adm-section"><h3>Save / Export</h3><div class="adm-btn-grid">
        <button class="btn btn-sm" onclick="game.saveGame();ui.toast({type:'success',text:'Saved'})">Force Save</button>
        <button class="btn btn-sm" onclick="navigator.clipboard.writeText(JSON.stringify(game.state)).then(()=>ui.toast({type:'success',text:'Copied'}))">Export to Clipboard</button>
        <button class="btn btn-sm btn-danger" onclick="if(confirm('HARD RESET? ALL progress lost!')){localStorage.removeItem('ashfall_save');location.reload()}">Hard Reset</button>
      </div></div>`;
    }

    // ── TOOLS ─────────────────────────────────────────────
    // ── THEATRE OF ASH ────────────────────────────────────
    if (tab === 'theatre') {
      const toa = GAME_DATA.theatreOfAsh;
      const t = s.theatre || {};
      html += `<div class="adm-section"><h3>Theatre State</h3><div class="adm-grid">
        <div class="adm-stat">Active: <strong>${t.active?'Yes':'No'}</strong></div>
        <div class="adm-stat">Room: <strong>${t.active?t.room+1+'/6':'—'}</strong></div>
        <div class="adm-stat">Deaths: <strong>${t.performance?.deaths||0}</strong></div>
        <div class="adm-stat">Completions: <strong>${s.stats?.theatreCompletions||0}</strong></div>
        <div class="adm-stat">Best Tier: <strong>${s.stats?.theatreBestTier||'—'}</strong></div>
      </div></div>
      <div class="adm-section"><h3>Theatre Actions</h3><div class="adm-btn-grid">
        <button class="btn btn-sm" onclick="game.startTheatreOfAsh();ui.renderPage('theatre')">Start Theatre</button>
        <button class="btn btn-sm" onclick="game.leaveTheatre();ui.renderPage('admin')">Force Leave</button>
        <button class="btn btn-sm" onclick="if(game.state.theatre?.active&&game.state.theatre.room<6){game._clearTheatreRoom(game.state.theatre.room);ui.renderPage('admin')}">Skip Room</button>
        <button class="btn btn-sm" onclick="game.state.theatre={active:false};s.stats.theatreCompletions=0;s.stats.theatreBestTier=undefined;ui.renderPage('admin')">Reset Theatre Stats</button>
        <button class="btn btn-sm" onclick="['veriax_scythe','bloodfire_staff','ashen_rapier','judicator_helm','judicator_plate','judicator_legs','hollow_ward','void_tear','veriax_eye'].forEach(id=>game.addItem(id,1));ui.toast({type:'success',text:'All Theatre items given'})">Give All Unique Items</button>
      </div></div>
      <div class="adm-section"><h3>Boss Editor</h3>`;
      for (const [bossId, boss] of Object.entries(typeof TOA_BOSSES!=='undefined'?TOA_BOSSES:{})) {
        html += `<div class="adm-monster-row"><div class="adm-monster-header" onclick="ui._admToggle('toa-${bossId}')">
          <strong>${boss.name}</strong> <span class="adm-m-meta">Lv${boss.combatLevel} · ${boss.hp.toLocaleString()}HP · ${boss.style}</span>
        </div><div id="toa-${bossId}" style="display:none;padding:8px">
          <div class="adm-edit-grid">
            <label>HP</label><input type="number" value="${boss.hp}" id="tb-${bossId}-hp" class="bank-search-input">
            <label>Max Hit</label><input type="number" value="${boss.maxHit}" id="tb-${bossId}-maxhit" class="bank-search-input">
            <label>Attack Speed</label><input type="number" step="0.1" value="${boss.attackSpeed}" id="tb-${bossId}-spd" class="bank-search-input">
            <label>Mechanic Interval (s)</label><input type="number" value="${boss.mechanic.interval}" id="tb-${bossId}-minterv" class="bank-search-input">
            <label>Mechanic Window (s)</label><input type="number" value="${boss.mechanic.windowSecs}" id="tb-${bossId}-mwindow" class="bank-search-input">
            <label>Miss Damage</label><input type="number" value="${boss.mechanic.missedDmg}" id="tb-${bossId}-mdmg" class="bank-search-input">
          </div>
          <button class="btn btn-sm" onclick="ui._admSaveToaBoss('${bossId}')">Save Changes (runtime)</button>
        </div></div>`;
      }
      html += `</div>`;
    }

    // ── ABILITIES ─────────────────────────────────────────
    if (tab === 'abilities') {
      html += `<div class="adm-section"><h3>Ability Manager</h3>
        <div class="adm-btn-grid">
          <button class="btn btn-sm" onclick="game.state.equippedAbilities=['power_strike','rapid_shot','arcane_burst','shield_wall'];ui.renderPage('admin')">Equip First 4</button>
          <button class="btn btn-sm" onclick="game.state.equippedAbilities=[null,null,null,null];ui.renderPage('admin')">Clear All Slots</button>
          <button class="btn btn-sm" onclick="game.state.combat.abilityCooldowns={};ui.renderPage('admin')">Reset All Cooldowns</button>
          <button class="btn btn-sm" onclick="game.state.skills.tactics={level:99,xp:13034431};ui.renderPage('admin')">Max Tactics (99)</button>
        </div>
      </div>
      <div class="adm-section"><h3>All Abilities (${GAME_DATA.abilities.length})</h3>`;
      for (const ab of GAME_DATA.abilities) {
        const cd = s.combat?.abilityCooldowns?.[ab.id] || 0;
        const equipped = (s.equippedAbilities||[]).indexOf(ab.id);
        html += `<div class="adm-ability-row">
          <div class="adm-ab-info">
            <strong>${ab.icon||'⚡'} ${ab.name}</strong>
            <span class="adm-m-meta">Tactics Lv${ab.tacticsReq} · ${ab.cooldown}s CD · ${ab.effect.type}</span>
            <span style="color:#5a4a5a;font-size:11px">${ab.desc}</span>
          </div>
          <div class="adm-ab-controls">
            ${cd>0?`<button class="btn btn-xs" onclick="delete game.state.combat.abilityCooldowns['${ab.id}'];ui.renderPage('admin')">Clear CD (${Math.ceil(cd)}s)</button>`:'<span style="color:#3a9e5c;font-size:10px">Ready</span>'}
            ${equipped>=0?`<span class="adm-m-meta">Slot ${equipped+1}</span>`:`<button class="btn btn-xs" onclick="for(let i=0;i<4;i++){if(!game.state.equippedAbilities[i]){game.state.equippedAbilities[i]='${ab.id}';break;}}ui.renderPage('admin')">Equip</button>`}
          </div>
        </div>`;
      }
      html += `</div>
      <div class="adm-section"><h3>Equipped Slots</h3>`;
      for (let i=0;i<4;i++) {
        const aid = (s.equippedAbilities||[])[i];
        const ab = aid ? GAME_DATA.abilities.find(a=>a.id===aid) : null;
        html += `<div class="adm-ab-slot-row">
          <strong>Slot ${i+1}:</strong>
          <span style="color:${ab?'#c9873e':'#3a2a3a'}">${ab?ab.name:'Empty'}</span>
          ${ab?`<button class="btn btn-xs btn-danger" onclick="game.state.equippedAbilities[${i}]=null;ui.renderPage('admin')">Unequip</button>`:''}
        </div>`;
      }
      html += `</div>`;
    }

    // ── NPCs ──────────────────────────────────────────────
    if (tab === 'npcs') {
      const npcs = GAME_DATA.npcs || {};
      html += `<div class="adm-section"><h3>NPC Manager (${Object.keys(npcs).length} NPCs)</h3>`;
      for (const [npcId, npc] of Object.entries(npcs)) {
        html += `<div class="adm-monster-row">
          <div class="adm-monster-header" onclick="ui._admToggle('npc-${npcId}')">
            <strong>${npc.name}</strong> <span class="adm-m-meta">${npc.role} · ${npc.location}</span>
          </div>
          <div id="npc-${npcId}" style="display:none;padding:10px">
            <div class="adm-edit-grid">
              <label>Name</label><input type="text" value="${npc.name}" id="npc-name-${npcId}" class="bank-search-input">
              <label>Role</label><input type="text" value="${npc.role}" id="npc-role-${npcId}" class="bank-search-input">
              <label>Location</label><input type="text" value="${npc.location}" id="npc-loc-${npcId}" class="bank-search-input">
              <label>Greeting</label><textarea id="npc-greet-${npcId}" class="bank-search-input" rows="2" style="grid-column:2">${npc.dialogue?.greeting||''}</textarea>
            </div>
            <button class="btn btn-sm" onclick="ui._admSaveNpc('${npcId}')">Save NPC</button>
            <div class="adm-section" style="margin-top:8px"><h4>Shop Inventory (${npc.shop?.length||0} items)</h4>
              ${(npc.shop||[]).map((entry,i)=>`<div class="adm-drop-row">
                <span>${GAME_DATA.items[entry.item]?.name||entry.item}</span>
                <input type="number" value="${entry.price}" id="npc-price-${npcId}-${i}" class="bank-search-input" style="width:80px">
                <button class="btn btn-xs" onclick="ui._admUpdateNpcShopPrice('${npcId}',${i})">Update</button>
                <button class="btn btn-xs btn-danger" onclick="GAME_DATA.npcs['${npcId}'].shop.splice(${i},1);ui.renderPage('admin')">✕</button>
              </div>`).join('')}
              <div class="adm-row-flex" style="margin-top:6px">
                <input type="text" id="npc-add-item-${npcId}" class="bank-search-input" placeholder="Item ID" style="flex:1">
                <input type="number" id="npc-add-price-${npcId}" class="bank-search-input" placeholder="Price" style="width:80px" value="100">
                <button class="btn btn-xs" onclick="ui._admAddNpcShopItem('${npcId}')">Add</button>
              </div>
            </div>
          </div>
        </div>`;
      }
      html += `</div>`;
    }

    if (tab === 'tools') {
      // Role Management
      if (typeof adminRoles !== 'undefined') {
        const currentRole = adminRoles.getCurrentUserInfo();
        html += `<div class="adm-section">
          <h3>👤 Role Management</h3>
          <div style="background:rgba(201,135,62,0.1); padding:12px; border-radius:6px; margin-bottom:12px">
            <div style="font-size:12px">Your Current Role:</div>
            <div style="font-size:18px; font-weight:bold; color:${currentRole.color}; margin:8px 0">${currentRole.icon} ${currentRole.name}</div>
            <div style="font-size:11px; color:var(--text-dim)">${currentRole.description}</div>
          </div>

          <h4 style="color:#c9873e; margin-top:15px">Assign Role to Player</h4>
          <div style="background:rgba(0,0,0,0.2); padding:12px; border-radius:6px">
            <div style="margin-bottom:10px">
              <label style="display:block; font-size:12px; color:var(--text-dim); margin-bottom:4px">Player Name</label>
              <input type="text" id="admin-player-search" class="bank-search-input" placeholder="Search player by name..." style="width:100%; margin-bottom:8px" oninput="adminRoleManager.searchPlayers(this.value)">
              <div id="admin-player-list" style="background:rgba(0,0,0,0.3); border-radius:4px; max-height:120px; overflow-y:auto; display:none"></div>
              <div id="admin-player-selected" style="padding:8px; background:rgba(201,135,62,0.1); border-radius:4px; margin-top:8px; display:none; font-size:12px">
                Selected: <strong id="admin-selected-name"></strong>
              </div>
            </div>

            <div style="margin-bottom:10px">
              <label style="display:block; font-size:12px; color:var(--text-dim); margin-bottom:4px">Role</label>
              <select id="admin-assign-role" class="bank-search-input" style="width:100%">
                <option value="">Select Role...</option>
                ${Object.entries(adminRoles.roles).map(([key, role]) => `<option value="${key}">${role.icon} ${role.name}</option>`).join('')}
              </select>
            </div>

            <button class="btn btn-sm" onclick="adminRoleManager.assignRole()">✓ Assign Role</button>
          </div>

          <h4 style="color:#c9873e; margin-top:15px">Remove Player Role</h4>
          <div style="background:rgba(255,107,107,0.1); padding:12px; border-radius:6px">
            <div style="margin-bottom:10px">
              <label style="display:block; font-size:12px; color:var(--text-dim); margin-bottom:4px">Player Name</label>
              <input type="text" id="admin-remove-player-search" class="bank-search-input" placeholder="Search player to remove..." style="width:100%; margin-bottom:8px" oninput="adminRoleManager.searchPlayersForRemove(this.value)">
              <div id="admin-remove-player-list" style="background:rgba(0,0,0,0.3); border-radius:4px; max-height:120px; overflow-y:auto; display:none"></div>
              <div id="admin-remove-selected" style="padding:8px; background:rgba(255,107,107,0.15); border-radius:4px; margin-top:8px; display:none; font-size:12px">
                Selected: <strong id="admin-remove-name"></strong>
              </div>
            </div>
            <button class="btn btn-sm btn-danger" onclick="adminRoleManager.removeRole()">🗑 Remove Role (Reset to VIEWER)</button>
          </div>
        </div>`;
      }

      // Bulk Operations
      if (typeof bulkOps !== 'undefined') {
        html += bulkOps.renderBulkPanel();
      }

      // Media Gallery
      if (typeof mediaManager !== 'undefined') {
        html += mediaManager.renderGallery();
      }

      // Dashboard Customizer
      if (typeof dashboardCustomizer !== 'undefined') {
        html += dashboardCustomizer.renderWidgetCustomizer();
      }

      // Original testing tools
      html+=`<div class="adm-section"><h3>Testing Tools</h3><div class="adm-btn-grid">
        <button class="btn btn-sm" onclick="game.startFightCave()">Start Fight Cave</button>
        <button class="btn btn-sm" onclick="if(game.state.fightCave){game.state.fightCave.currentWave=62;game.state.fightCave.betweenWaves=true;game.state.fightCave.betweenWaveTimer=1;}">Skip to Jad</button>
        <button class="btn btn-sm" onclick="ui._admGiveItem('fire_cape',1)">Give Fire Cape</button>
        <button class="btn btn-sm" onclick="ui._admGiveItem('prayer_potion',50)">50x Prayer Pots</button>
        <button class="btn btn-sm" onclick="ui._admGiveItem('shark',200)">200x Sharks</button>
        <button class="btn btn-sm" onclick="game.unlockAllSpellbooks?.()">Unlock Spellbooks</button>
        <button class="btn btn-sm" onclick="window.loadCustomMonsterImages?.().then(()=>ui.toast({type:'success',text:'Images refreshed'}))">Refresh Monster Images</button>
        <button class="btn btn-sm" onclick="online.loadAllItemImages?.().then(()=>ui.toast({type:'success',text:'Item images refreshed'}))">Refresh Item Images</button>
        <button class="btn btn-sm" onclick="ui._admResetFightCave()">Reset FC Stats</button>
      </div></div>
      <div class="adm-section"><h3>Give / Take Custom</h3><div class="adm-row-flex">
        <input type="text" id="adm-give-id" class="bank-search-input" placeholder="Item ID" style="flex:1">
        <input type="number" id="adm-give-qty" class="bank-search-input" placeholder="Qty" value="1" style="width:80px">
        <button class="btn btn-sm" onclick="ui._admGiveCustom()">Give</button>
        <button class="btn btn-sm btn-danger" onclick="ui._admTakeCustom()">Take</button>
      </div></div>
      <div class="adm-section"><h3>Future Roadmap</h3>
        <div class="adm-roadmap">
          <div class="adm-rm-section"><h4>🔜 Next Up</h4>
            <div class="adm-rm-item adm-rm-planned">Server-side save editor (write direct to player saves)</div>
            <div class="adm-rm-item adm-rm-planned">Event system with timed multipliers</div>
            <div class="adm-rm-item adm-rm-planned">Player messaging from admin panel</div>
            <div class="adm-rm-item adm-rm-planned">Bulk item give to all online players</div>
          </div>
          <div class="adm-rm-section"><h4>🗓 Planned</h4>
            <div class="adm-rm-item adm-rm-backlog">Role-based access (Moderator < Editor < Admin)</div>
            <div class="adm-rm-item adm-rm-backlog">Real-time active session count</div>
            <div class="adm-rm-item adm-rm-backlog">Spawn custom dungeon runs for players</div>
            <div class="adm-rm-item adm-rm-backlog">Drop rate override per area</div>
            <div class="adm-rm-item adm-rm-backlog">Asset version control (rollback images)</div>
            <div class="adm-rm-item adm-rm-backlog">CSV export of leaderboard</div>
          </div>
          <div class="adm-rm-section"><h4>💡 Considering</h4>
            <div class="adm-rm-item adm-rm-idea">Analytics dashboard (kills/hour heatmap)</div>
            <div class="adm-rm-item adm-rm-idea">Scheduled events (weekends = 2x XP)</div>
            <div class="adm-rm-item adm-rm-idea">In-game patch notes modal</div>
            <div class="adm-rm-item adm-rm-idea">Separate admin webapp (outside game)</div>
          </div>
        </div>
      </div>`;
    }

    html += '</div></div>';
    el.innerHTML = html;
  };

  // ══ ACTION METHODS ══════════════════════════════════════

  // Items
  UI.prototype._admGiveItem    = function(id,qty){game.addItem(id,qty);this.toast({type:'success',text:`+${qty}x ${GAME_DATA.items[id]?.name||id}`});this.renderPage('admin');};
  UI.prototype._admTakeItem    = function(id,qty){const t=Math.min(qty,game.state.bank[id]||0);if(!t){this.toast({type:'warn',text:'None to take'});return;}game.removeItem(id,t);this.toast({type:'info',text:`-${t}x ${GAME_DATA.items[id]?.name||id}`});this.renderPage('admin');};
  UI.prototype._admGiveItemQty = function(id){const q=parseInt(document.getElementById('ei-qty')?.value)||1;this._admGiveItem(id,q);};
  UI.prototype._admTakeItemQty = function(id){const q=parseInt(document.getElementById('ei-qty')?.value)||1;this._admTakeItem(id,q);};
  UI.prototype._admGiveCustom  = function(){const id=document.getElementById('adm-give-id')?.value?.trim(),qty=parseInt(document.getElementById('adm-give-qty')?.value)||1;if(!id)return;if(!GAME_DATA.items[id]){this.toast({type:'warn',text:`"${id}" not found`});return;}this._admGiveItem(id,qty);};
  UI.prototype._admTakeCustom  = function(){const id=document.getElementById('adm-give-id')?.value?.trim(),qty=parseInt(document.getElementById('adm-give-qty')?.value)||1;if(!id)return;if(!GAME_DATA.items[id]){this.toast({type:'warn',text:`"${id}" not found`});return;}this._admTakeItem(id,qty);};
  UI.prototype._admSaveItemEdit = function(id){const item=GAME_DATA.items[id];if(!item)return;const n=document.getElementById('ei-name')?.value?.trim();if(n)item.name=n;const d=document.getElementById('ei-desc')?.value?.trim();if(d)item.desc=d;const t=document.getElementById('ei-type')?.value?.trim();if(t)item.type=t;item.sellPrice=parseInt(document.getElementById('ei-price')?.value)||0;const r=document.getElementById('ei-rarity')?.value;if(r)item.rarity=r;if(item.stats){item.stats.attackBonus=parseInt(document.getElementById('ei-atk')?.value)||0;item.stats.strengthBonus=parseInt(document.getElementById('ei-str')?.value)||0;item.stats.magicBonus=parseInt(document.getElementById('ei-mag')?.value)||0;item.stats.rangedBonus=parseInt(document.getElementById('ei-rng')?.value)||0;item.stats.defenceBonus=parseInt(document.getElementById('ei-def')?.value)||0;}online?.adminLog?.('item_edit',{itemId:id,name:item.name});this.toast({type:'success',text:`${item.name} saved (runtime only — persists until reload)`});this.renderPage('admin');};
  UI.prototype._admUploadItemImage = async function(itemId,input){const file=input.files?.[0];if(!file)return;const status=document.getElementById('adm-item-img-status');if(status)status.textContent='Uploading…';const reader=new FileReader();reader.onload=async(e)=>{let dataUrl=e.target.result;if(file.type!=='image/svg+xml'&&file.size>150*1024)dataUrl=await _resizeImage(dataUrl,128,128);try{await online.saveItemImage(itemId,dataUrl);if(GAME_DATA.items[itemId])GAME_DATA.items[itemId]._customImage=dataUrl;if(status)status.textContent='✓ Uploaded';this.toast({type:'success',text:`${itemId} image saved globally`});setTimeout(()=>this.renderPage('admin'),400);}catch(err){if(status)status.textContent='✗ '+err.message;this.toast({type:'warn',text:'Upload failed: '+err.message});}};reader.readAsDataURL(file);};
  UI.prototype._admDeleteItemImage = async function(itemId){if(!confirm('Remove image?'))return;try{await online.deleteItemImage(itemId);if(GAME_DATA.items[itemId])delete GAME_DATA.items[itemId]._customImage;this.toast({type:'success',text:'Image removed'});this.renderPage('admin');}catch(e){this.toast({type:'warn',text:'Failed: '+e.message});}};

  // Skills
  UI.prototype._admSetSkillLevel = function(skillId,level){const lv=Math.max(1,Math.min(99,level||1));let xp=0;for(let i=1;i<lv;i++)xp+=Math.floor(i+300*Math.pow(2,i/7));xp=Math.floor(xp/4);game.state.skills[skillId].level=lv;game.state.skills[skillId].xp=xp;this.toast({type:'success',text:`${GAME_DATA.skills[skillId]?.name||skillId} → Lv ${lv}`});this.renderPage('admin');};
  UI.prototype._admTakeXp = function(skillId,amt){const sk=game.state.skills[skillId];if(!sk)return;sk.xp=Math.max(0,sk.xp-amt);let lv=1;for(let i=1;i<=99;i++){let n=0;for(let j=1;j<i;j++)n+=Math.floor(j+300*Math.pow(2,j/7));if(sk.xp>=Math.floor(n/4))lv=i;else break;}sk.level=lv;this.toast({type:'info',text:`-${amt} ${GAME_DATA.skills[skillId]?.name||skillId} XP`});this.renderPage('admin');};
  UI.prototype._admGiveCustomXp = function(){const sk=document.getElementById('adm-xp-skill')?.value,amt=parseInt(document.getElementById('adm-xp-amt')?.value)||0;if(!sk||!amt)return;game.addXp(sk,amt);this.toast({type:'success',text:`+${amt} ${GAME_DATA.skills[sk]?.name||sk} XP`});this.renderPage('admin');};
  UI.prototype._admTakeCustomXp = function(){const sk=document.getElementById('adm-xp-skill')?.value,amt=parseInt(document.getElementById('adm-xp-amt')?.value)||0;if(!sk||!amt)return;this._admTakeXp(sk,amt);};

  // Toggle expand/collapse for admin accordion rows
  UI.prototype._admToggle = function(elId) {
    const el = document.getElementById(elId);
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
  };

  // Theatre of Ash
  UI.prototype._admSaveToaBoss = function(bossId) {
    const boss = typeof TOA_BOSSES !== 'undefined' ? TOA_BOSSES[bossId] : null;
    const monster = GAME_DATA.monsters[bossId];
    if (!boss || !monster) return;
    const hp = parseInt(document.getElementById(`tb-${bossId}-hp`)?.value) || boss.hp;
    const maxHit = parseInt(document.getElementById(`tb-${bossId}-maxhit`)?.value) || boss.maxHit;
    const spd = parseFloat(document.getElementById(`tb-${bossId}-spd`)?.value) || boss.attackSpeed;
    const minterv = parseInt(document.getElementById(`tb-${bossId}-minterv`)?.value) || boss.mechanic.interval;
    const mwindow = parseInt(document.getElementById(`tb-${bossId}-mwindow`)?.value) || boss.mechanic.windowSecs;
    const mdmg = parseInt(document.getElementById(`tb-${bossId}-mdmg`)?.value) ?? boss.mechanic.missedDmg;
    boss.hp = hp; boss.maxHit = maxHit; boss.attackSpeed = spd;
    boss.mechanic.interval = minterv; boss.mechanic.windowSecs = mwindow; boss.mechanic.missedDmg = mdmg;
    monster.hp = hp; monster.maxHit = maxHit; monster.attackSpeed = spd;
    this.toast({ type:'success', text:`${boss.name} updated (runtime)` });
    this.renderPage('admin');
  };

  // NPC
  UI.prototype._admSaveNpc = function(npcId) {
    const npc = GAME_DATA.npcs?.[npcId]; if (!npc) return;
    npc.name     = document.getElementById(`npc-name-${npcId}`)?.value?.trim() || npc.name;
    npc.role     = document.getElementById(`npc-role-${npcId}`)?.value?.trim() || npc.role;
    npc.location = document.getElementById(`npc-loc-${npcId}`)?.value?.trim()  || npc.location;
    const greet  = document.getElementById(`npc-greet-${npcId}`)?.value?.trim();
    if (greet && npc.dialogue) npc.dialogue.greeting = greet;
    this.toast({ type:'success', text:`${npc.name} saved (runtime)` });
    this.renderPage('admin');
  };
  UI.prototype._admUpdateNpcShopPrice = function(npcId, idx) {
    const npc = GAME_DATA.npcs?.[npcId]; if (!npc?.shop?.[idx]) return;
    const price = parseInt(document.getElementById(`npc-price-${npcId}-${idx}`)?.value) || npc.shop[idx].price;
    npc.shop[idx].price = price;
    this.toast({ type:'success', text:'Price updated' });
    this.renderPage('admin');
  };
  UI.prototype._admAddNpcShopItem = function(npcId) {
    const npc = GAME_DATA.npcs?.[npcId]; if (!npc) return;
    const item = document.getElementById(`npc-add-item-${npcId}`)?.value?.trim();
    const price = parseInt(document.getElementById(`npc-add-price-${npcId}`)?.value) || 0;
    if (!item || !GAME_DATA.items[item]) { this.toast({ type:'warn', text:`"${item}" not found` }); return; }
    if (!npc.shop) npc.shop = [];
    npc.shop.push({ item, price });
    this.toast({ type:'success', text:`Added ${GAME_DATA.items[item].name}` });
    this.renderPage('admin');
  };

  // Monsters
  UI.prototype._admSaveMonsterEdit = function(mId){const m=GAME_DATA.monsters[mId];if(!m)return;m.name=document.getElementById('em-name')?.value?.trim()||m.name;m.hp=parseInt(document.getElementById('em-hp')?.value)||m.hp;m.maxHit=parseInt(document.getElementById('em-maxhit')?.value)||m.maxHit;m.combatLevel=parseInt(document.getElementById('em-cl')?.value)||m.combatLevel;m.attackSpeed=parseFloat(document.getElementById('em-spd')?.value)||m.attackSpeed;m.xp=parseInt(document.getElementById('em-xp')?.value)||m.xp;m.gold={min:parseInt(document.getElementById('em-goldmin')?.value)||0,max:parseInt(document.getElementById('em-goldmax')?.value)||0};m.style=document.getElementById('em-style')?.value||m.style;m.evasion={melee:parseInt(document.getElementById('em-evm')?.value)||0,ranged:parseInt(document.getElementById('em-evr')?.value)||0,magic:parseInt(document.getElementById('em-evmg')?.value)||0};online?.adminLog?.('monster_edit',{mId,name:m.name});this.toast({type:'success',text:`${m.name} saved (runtime)`});this.renderPage('admin');};
  UI.prototype._admAddDrop = function(mId){const m=GAME_DATA.monsters[mId];if(!m)return;const item=document.getElementById('drop-item-id')?.value?.trim(),qty=parseInt(document.getElementById('drop-qty')?.value)||1,chance=parseFloat(document.getElementById('drop-chance')?.value)||0.05;if(!item){this.toast({type:'warn',text:'Enter item ID'});return;}if(!GAME_DATA.items[item]){this.toast({type:'warn',text:`"${item}" not found`});return;}if(!m.drops)m.drops=[];m.drops.push({item,qty,chance:Math.min(1,Math.max(0,chance))});this.toast({type:'success',text:`Added ${item}`});this.renderPage('admin');};
  UI.prototype._admEditDrop = function(mId,idx){this._admEditDropIdx=idx;this.renderPage('admin');};
  UI.prototype._admSaveDrop = function(mId,idx){const m=GAME_DATA.monsters[mId];if(!m?.drops?.[idx])return;const item=document.getElementById('dmod-item')?.value?.trim(),qty=parseInt(document.getElementById('dmod-qty')?.value)||1,chance=parseFloat(document.getElementById('dmod-chance')?.value)||0;if(!GAME_DATA.items[item]){this.toast({type:'warn',text:`"${item}" not found`});return;}m.drops[idx]={item,qty,chance:Math.min(1,Math.max(0,chance))};this._admEditDropIdx=null;this.toast({type:'success',text:'Drop updated'});this.renderPage('admin');};
  UI.prototype._admUploadMonsterImage = async function(mId,input){const file=input.files?.[0];if(!file)return;const status=document.getElementById('adm-img-status');if(status)status.textContent='Uploading…';const reader=new FileReader();reader.onload=async(e)=>{let dataUrl=e.target.result;if(file.size>200*1024)dataUrl=await _resizeImage(dataUrl,256,256);try{await saveMonsterImage(mId,dataUrl);if(status)status.textContent='✓ Uploaded';this.toast({type:'success',text:`${mId} image saved`});setTimeout(()=>this.renderPage('admin'),400);}catch(err){if(status)status.textContent='✗ '+err.message;this.toast({type:'warn',text:'Upload failed: '+err.message});}};reader.readAsDataURL(file);};
  UI.prototype._admDeleteMonsterImage = async function(mId){if(!confirm('Remove?'))return;try{await deleteMonsterImage(mId);this.toast({type:'success',text:'Removed'});this.renderPage('admin');}catch(e){this.toast({type:'warn',text:'Failed: '+e.message});}};

  // Players
  UI.prototype._admLoadPlayers = async function(sort){if(!online?.isOnline){this.toast({type:'warn',text:'Not online'});return;}try{this.toast({type:'info',text:'Loading players…'});const snap=await online.firestore.collection('players').orderBy(sort||'totalLevel','desc').limit(200).get();this._admPlayerList=[];snap.forEach(doc=>this._admPlayerList.push({uid:doc.id,...doc.data()}));this.toast({type:'success',text:`${this._admPlayerList.length} players loaded`});this.renderPage('admin');}catch(e){this.toast({type:'warn',text:'Error: '+e.message});}};
  UI.prototype._admLoadLeaderboard = async function(){if(!online?.isOnline)return;try{const snap=await online.firestore.collection('leaderboard').orderBy('totalLevel','desc').limit(100).get();this._admLeaderboard=[];snap.forEach(doc=>this._admLeaderboard.push({uid:doc.id,...doc.data()}));this.renderPage('admin');}catch(e){this.toast({type:'warn',text:'Error: '+e.message});}};
  UI.prototype._admDeletePlayer = async function(uid,name){if(!confirm(`Delete "${name}" (${uid})?\n\nThis removes them from: players, leaderboard, saves, bazaar.\nThis action is logged.`))return;this.toast({type:'info',text:'Deleting…'});const result=await online.deletePlayer(uid,name);if(result.ok){this.toast({type:'success',text:`${name} deleted (${result.deleted.join(', ')})`});if(this._admPlayerList)this._admPlayerList=this._admPlayerList.filter(p=>p.uid!==uid);this._admPlayerEdit=null;this.renderPage('admin');}else{this.toast({type:'warn',text:`Failed: ${result.errors?.join(', ')||'unknown error'}`});console.error('[Admin] Delete errors:',result.errors);}};
  UI.prototype._admBanPlayer = async function(uid,name){if(!confirm(`Ban "${name}"? Marks account as banned in RTDB. They can still play but won't appear on leaderboard after next sync.`))return;try{await online.db.ref(`/admin_bans/${uid}`).set({banned:true,by:online.user.uid,at:Date.now(),name});await online.adminLog('ban_player',{targetUid:uid,targetName:name});this.toast({type:'success',text:`${name} banned`});}catch(e){this.toast({type:'warn',text:'Failed: '+e.message});}};
  UI.prototype._admDeleteGhosts = async function(){if(!this._admPlayerList){this.toast({type:'warn',text:'Load players first'});return;}const myUid=online?.user?.uid,myTL=game.getTotalLevel?.()||0;const ghosts=this._admPlayerList.filter(p=>p.uid!==myUid&&p.totalLevel===myTL);if(!ghosts.length){this.toast({type:'info',text:'No ghosts found'});return;}if(!confirm(`Delete ${ghosts.length} ghost(s) with TL=${myTL}?`))return;let done=0;for(const g of ghosts){const r=await online.deletePlayer(g.uid,g.displayName);if(r.ok)done++;}this._admPlayerList=this._admPlayerList.filter(p=>!ghosts.find(g=>g.uid===p.uid));this.toast({type:'success',text:`Deleted ${done}/${ghosts.length} ghosts`});this.renderPage('admin');};

  // Announcements
  UI.prototype._admPostAnnouncement = async function(){const title=document.getElementById('ann-title')?.value?.trim(),body=document.getElementById('ann-body')?.value?.trim(),type=document.getElementById('ann-type')?.value;if(!title||!body){this.toast({type:'warn',text:'Title and body required'});return;}const ok=await online.postAnnouncement(title,body,type);if(ok){this.toast({type:'success',text:'Announcement posted'});document.getElementById('ann-title').value='';document.getElementById('ann-body').value='';this.renderPage('admin');}else this.toast({type:'warn',text:'Failed to post'});};

  // Broadcast
  UI.prototype._admBroadcast = function(inputId){const input=document.getElementById(inputId||'adm-broadcast'),text=input?.value?.trim();if(!text)return;online.sendSystemMessage?.(text);this.toast({type:'success',text:'Broadcast sent'});if(input)input.value='';online?.adminLog?.('broadcast',{text});};

  // Settings
  UI.prototype._admSetFlag = async function(){const k=document.getElementById('adm-flag-key')?.value?.trim(),v=document.getElementById('adm-flag-val')?.value?.trim();if(!k||!v)return;let val;try{val=JSON.parse(v);}catch(e){val=v;}const ok=await online.setGameSetting(k,val);if(ok){this.toast({type:'success',text:`Flag "${k}" set to ${JSON.stringify(val)}`});this.renderPage('admin');}else this.toast({type:'warn',text:'Failed — check RTDB rules'});};

  // Remote player save viewer
  UI.prototype._admViewPlayerSave = async function(uid){
    const el = document.getElementById('adm-rp-save');
    if (!el) return;
    el.textContent = 'Loading...';
    const save = await online.adminGetPlayerSave(uid);
    if (!save) { el.textContent = 'No save found.'; return; }
    const sk = save.skills || {};
    const skillStr = Object.entries(sk).map(([id,s])=>`${id}:${s.level}`).join(', ');
    el.innerHTML = `<strong>Gold:</strong> ${save.gold||0}<br><strong>Skills:</strong> ${skillStr}`;
  };

  // Open player editor — auto-loads their cloud save
  UI.prototype._admOpenPlayer = async function(profileData) {
    this._admPlayerEdit = profileData;
    this._admPlayerSave = null;
    this._admSaveLoading = true;
    this.renderPage('admin');
    try {
      const save = await online.adminGetPlayerSave(profileData.uid);
      this._admPlayerSave = save;
      this._admSaveLoading = false;
      this.renderPage('admin');
    } catch(e) {
      this._admSaveLoading = false;
      this.renderPage('admin');
    }
  };

  // Refresh save after modification — reloads from Firebase and re-renders
  UI.prototype._admRefreshSave = async function(uid) {
    try {
      const save = await online.adminGetPlayerSave(uid);
      this._admPlayerSave = save;
      this.renderPage('admin');
    } catch(e) { console.error('[Admin] Refresh failed:', e); }
  };

  // ── ADMIN SAVE VIEWERS ──────────────────────────────────────
  UI.prototype._admLoadFullSave = async function(uid) {
    const el = document.getElementById('adm-rp-save-display');
    if (!el) return;
    el.innerHTML = '<span style="color:var(--amber)">Loading full save...</span>';
    const save = await online.adminGetPlayerSave(uid);
    if (!save) { el.innerHTML = 'No save found.'; return; }
    ui._admPlayerSave = save;
    const sk = save.skills || {};
    let html = `<div style="margin-bottom:8px"><strong style="color:var(--amber)">Player Save — ${save.playerName||'Unknown'}</strong></div>`;
    html += `<div><strong>Gold:</strong> ${(save.gold||0).toLocaleString()}</div>`;
    html += `<div><strong>Alignment:</strong> ${save.alignment||'neutral'}</div>`;
    html += `<div><strong>Prayer:</strong> ${save.prayerPoints||0}/${save.maxPrayerPoints||0}</div>`;
    html += `<div><strong>Monsters Killed:</strong> ${save.stats?.monstersKilled||0}</div>`;
    html += `<div><strong>Dungeons:</strong> ${save.stats?.dungeonsCompleted||0}</div>`;
    html += `<div><strong>Barrows:</strong> ${save.stats?.barrowsCompletions||0}</div>`;
    html += `<div><strong>Theatre:</strong> ${save.stats?.theatreCompletions||0}</div>`;
    html += `<div><strong>Chambers:</strong> ${save.stats?.chambersCompletions||0}</div>`;
    html += `<div><strong>Inferno:</strong> ${save.stats?.infernoCompletions||0}</div>`;
    html += `<div><strong>Gauntlet:</strong> ${save.stats?.gauntletCompletions||0}</div>`;
    html += `<div><strong>Play Time:</strong> ${Math.floor((save.stats?.totalPlayTime||0)/3600)}h</div>`;
    html += `<div><strong>Bank Items:</strong> ${Object.keys(save.bank||{}).filter(k=>(save.bank[k]||0)>0).length}</div>`;
    el.innerHTML = html;
  };

  UI.prototype._admLoadPlayerBank = async function(uid) {
    const el = document.getElementById('adm-rp-save-display');
    if (!el) return;
    el.innerHTML = '<span style="color:var(--amber)">Loading bank...</span>';
    const save = await online.adminGetPlayerSave(uid);
    if (!save) { el.innerHTML = 'No save found.'; return; }
    const bank = save.bank || {};
    const items = Object.entries(bank).filter(([k,v])=>v>0).sort((a,b)=>b[1]-a[1]);
    if (!items.length) { el.innerHTML = 'Bank is empty.'; return; }
    let html = `<div style="margin-bottom:6px"><strong style="color:var(--amber)">Bank (${items.length} items)</strong></div>`;
    html += `<div style="display:grid;grid-template-columns:1fr 60px 60px;gap:2px;font-size:11px">`;
    html += `<div style="font-weight:700;color:var(--amber)">Item</div><div style="font-weight:700;color:var(--amber)">Qty</div><div style="font-weight:700;color:var(--amber)">Action</div>`;
    for (const [id, qty] of items) {
      const name = GAME_DATA.items[id]?.name || id;
      html += `<div>${name}</div><div>${qty.toLocaleString()}</div><div><button class="btn btn-xs" style="padding:0 4px;font-size:9px" onclick="online.adminRemovePlayerItem('${uid}','${id}',${qty})">Del</button></div>`;
    }
    html += `</div>`;
    el.innerHTML = html;
  };

  UI.prototype._admLoadPlayerSkills = async function(uid) {
    const el = document.getElementById('adm-rp-save-display');
    if (!el) return;
    el.innerHTML = '<span style="color:var(--amber)">Loading skills...</span>';
    const save = await online.adminGetPlayerSave(uid);
    if (!save || !save.skills) { el.innerHTML = 'No save found.'; return; }
    let html = `<div style="margin-bottom:6px"><strong style="color:var(--amber)">Skills</strong></div>`;
    html += `<div style="display:grid;grid-template-columns:1fr 40px 80px 80px;gap:2px;font-size:11px">`;
    html += `<div style="font-weight:700;color:var(--amber)">Skill</div><div style="font-weight:700;color:var(--amber)">Lv</div><div style="font-weight:700;color:var(--amber)">XP</div><div style="font-weight:700;color:var(--amber)">Action</div>`;
    for (const [id, sk] of Object.entries(save.skills)) {
      html += `<div>${id}</div><div>${sk.level}</div><div>${(sk.xp||0).toLocaleString()}</div><div><button class="btn btn-xs" style="padding:0 4px;font-size:9px" onclick="online.adminSetPlayerLevel('${uid}','${id}',99)">→99</button></div>`;
    }
    html += `</div>`;
    el.innerHTML = html;
  };

  UI.prototype._admLoadPlayerEquip = async function(uid) {
    const el = document.getElementById('adm-rp-save-display');
    if (!el) return;
    el.innerHTML = '<span style="color:var(--amber)">Loading equipment...</span>';
    const save = await online.adminGetPlayerSave(uid);
    if (!save) { el.innerHTML = 'No save found.'; return; }
    const eq = save.equipment || {};
    let html = `<div style="margin-bottom:6px"><strong style="color:var(--amber)">Equipment</strong></div>`;
    const slots = ['weapon','head','body','legs','boots','gloves','shield','cape','ring','amulet','ammo'];
    for (const slot of slots) {
      const itemId = eq[slot];
      const name = itemId ? (GAME_DATA.items[itemId]?.name || itemId) : '<empty>';
      html += `<div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid rgba(255,255,255,0.05)"><span style="color:var(--amber)">${slot}:</span><span>${name}</span>${itemId?`<button class="btn btn-xs" style="padding:0 4px;font-size:9px" onclick="online.adminSetPlayerEquipment('${uid}','${slot}',null)">Unequip</button>`:''}</div>`;
    }
    el.innerHTML = html;
  };

  UI.prototype._admLoadPlayerStats = async function(uid) {
    const el = document.getElementById('adm-rp-save-display');
    if (!el) return;
    el.innerHTML = '<span style="color:var(--amber)">Loading stats...</span>';
    const save = await online.adminGetPlayerSave(uid);
    if (!save) { el.innerHTML = 'No save found.'; return; }
    const stats = save.stats || {};
    let html = `<div style="margin-bottom:6px"><strong style="color:var(--amber)">Stats</strong></div>`;
    for (const [key, val] of Object.entries(stats).sort((a,b)=>a[0].localeCompare(b[0]))) {
      const display = typeof val === 'object' ? JSON.stringify(val) : val;
      html += `<div style="display:flex;justify-content:space-between;padding:2px 0;border-bottom:1px solid rgba(255,255,255,0.05);font-size:11px"><span>${key}</span><span style="color:var(--text-dim)">${typeof display==='string'&&display.length>50?display.substring(0,50)+'...':display}</span></div>`;
    }
    el.innerHTML = html;
  };

  UI.prototype._admLoadRawSave = async function(uid) {
    const el = document.getElementById('adm-rp-raw-json');
    if (!el) return;
    el.value = 'Loading...';
    const save = await online.adminGetPlayerSave(uid);
    if (!save) { el.value = 'No save found.'; return; }
    el.value = JSON.stringify(save, null, 2);
  };

  UI.prototype._admSaveRawJson = async function(uid) {
    const el = document.getElementById('adm-rp-raw-json');
    if (!el) return;
    try {
      const save = JSON.parse(el.value);
      const ok = await online.adminSetPlayerSave(uid, save);
      if (ok) { ui.toast({type:'success',text:'Raw save written successfully'}); }
      else { ui.toast({type:'warn',text:'Failed to write save'}); }
    } catch(e) { ui.toast({type:'danger',text:'Invalid JSON: '+e.message}); }
  };

  // Live push specific settings
  UI.prototype._admPushLive = async function(key,val){
    const ok = await online.pushLiveUpdate(key, val);
    if (ok) this.renderPage('admin');
  };

  // Online Players
  UI.prototype._admLoadOnline = async function(){
    const el = document.getElementById('adm-online-list');
    if (!el || !online?.db) return;
    el.innerHTML = '<div class="adm-stat">Loading...</div>';
    try {
      const snap = await online.db.ref('presence').orderByChild('online').equalTo(true).once('value');
      const players = [];
      snap.forEach(c => { const d = c.val(); if (d.online) players.push(d); });
      if (players.length === 0) { el.innerHTML = '<div class="adm-stat">No players online.</div>'; return; }
      el.innerHTML = `<div class="adm-stat" style="margin-bottom:6px"><strong>${players.length}</strong> player(s) online</div>` +
        '<div class="adm-player-table"><div class="adm-pt-header"><span>Name</span><span>UID</span><span>Cb Lv</span><span>Zone</span><span>Monster</span></div>' +
        players.map(p => `<div class="adm-pt-row">
          <span class="adm-item-name">${p.name||'?'}</span>
          <span class="adm-item-id">${(p.uid||'').substring(0,10)}…</span>
          <span>${p.combatLevel||'?'}</span>
          <span>${p.zone||'—'}</span>
          <span>${p.monster||'—'}</span>
        </div>`).join('') + '</div>';
    } catch(e) { el.innerHTML = `<div class="adm-stat">Error: ${e.message}</div>`; }
  };

  // Guild Admin
  UI.prototype._admLoadGuilds = async function(){
    const el = document.getElementById('adm-guilds-list');
    if (!el) return;
    el.innerHTML = '<div class="adm-stat">Loading...</div>';
    try {
      const snap = await online.firestore.collection('guilds').limit(50).get();
      const guilds = [];
      snap.forEach(doc => guilds.push({ id:doc.id, ...doc.data() }));
      this._admGuildsList = guilds;
      if (guilds.length === 0) { el.innerHTML = '<div class="adm-stat">No guilds found.</div>'; return; }
      el.innerHTML = '<div class="adm-player-table"><div class="adm-pt-header"><span>Guild</span><span>Tag</span><span>Leader</span><span>Members</span><span>Bank</span><span>Actions</span></div>' +
        guilds.map(g => `<div class="adm-pt-row">
          <span class="adm-item-name">${g.name||'?'}</span>
          <span>[${g.tag||'?'}]</span>
          <span>${g.leaderName||'?'}</span>
          <span>${g.memberCount||g.members?.length||0}</span>
          <span>${g.bank||0}g</span>
          <span><button class="btn btn-xs" onclick='ui._admGuildEdit=${JSON.stringify(g).replace(/'/g,"\\'")}; ui.renderPage("admin")'>Edit</button></span>
        </div>`).join('') + '</div>';
    } catch(e) { el.innerHTML = `<div class="adm-stat">Error: ${e.message}</div>`; }
  };
  UI.prototype._admDeleteGuild = async function(guildId, name){
    if (!confirm(`Delete guild "${name}"? This is permanent.`)) return;
    try {
      await online.firestore.collection('guilds').doc(guildId).delete();
      await online.adminLog('delete_guild', { guildId, name });
      this.toast({type:'success',text:`Guild "${name}" deleted.`});
      this._admGuildEdit = null;
      this.renderPage('admin');
    } catch(e) { this.toast({type:'warn',text:'Failed: '+e.message}); }
  };
  UI.prototype._admSetGuildGold = async function(guildId){
    const amount = parseInt(prompt('Set guild bank gold to:','0'));
    if (isNaN(amount)) return;
    try {
      await online.firestore.collection('guilds').doc(guildId).update({ bank: amount });
      await online.adminLog('set_guild_gold', { guildId, amount });
      this.toast({type:'success',text:`Guild bank set to ${amount}g`});
      this._admGuildEdit = null;
      this.renderPage('admin');
    } catch(e) { this.toast({type:'warn',text:'Failed: '+e.message}); }
  };

  // Economy Overview
  UI.prototype._admLoadEconomy = async function(){
    const el = document.getElementById('adm-economy-data');
    if (!el) return;
    el.innerHTML = '<div class="adm-stat">Scanning...</div>';
    try {
      const snap = await online.firestore.collection('players').limit(200).get();
      let totalGold = 0, totalKills = 0, playerCount = 0, topGold = [], topLevel = [];
      snap.forEach(doc => {
        const p = doc.data();
        playerCount++;
        totalGold += p.gold || 0;
        totalKills += p.kills || 0;
        topGold.push({ name: p.displayName, gold: p.gold||0 });
        topLevel.push({ name: p.displayName, level: p.totalLevel||0 });
      });
      topGold.sort((a,b) => b.gold - a.gold);
      topLevel.sort((a,b) => b.level - a.level);
      el.innerHTML = `
        <div class="adm-dashboard-grid">
          <div class="adm-kpi"><div class="adm-kpi-val">${playerCount}</div><div class="adm-kpi-lbl">Total Players</div></div>
          <div class="adm-kpi"><div class="adm-kpi-val">${(totalGold/1000000).toFixed(1)}M</div><div class="adm-kpi-lbl">Gold in Circulation</div></div>
          <div class="adm-kpi"><div class="adm-kpi-val">${(totalGold/Math.max(1,playerCount)/1000).toFixed(1)}K</div><div class="adm-kpi-lbl">Avg Gold/Player</div></div>
          <div class="adm-kpi"><div class="adm-kpi-val">${(totalKills/1000).toFixed(1)}K</div><div class="adm-kpi-lbl">Total Kills</div></div>
        </div>
        <div class="adm-dash-row" style="margin-top:10px">
          <div class="adm-section adm-dash-half"><h4>Richest Players</h4>${topGold.slice(0,10).map((p,i)=>`<div class="adm-stat">${i+1}. ${p.name}: <strong>${(p.gold/1000).toFixed(1)}K</strong></div>`).join('')}</div>
          <div class="adm-section adm-dash-half"><h4>Highest Level</h4>${topLevel.slice(0,10).map((p,i)=>`<div class="adm-stat">${i+1}. ${p.name}: <strong>TL ${p.level}</strong></div>`).join('')}</div>
        </div>`;
    } catch(e) { el.innerHTML = `<div class="adm-stat">Error: ${e.message}</div>`; }
  };
  UI.prototype._admLoadBazaar = async function(){
    const el = document.getElementById('adm-bazaar-data');
    if (!el) return;
    el.innerHTML = '<div class="adm-stat">Loading...</div>';
    try {
      const listings = await online.getBazaarListings();
      if (listings.length === 0) { el.innerHTML = '<div class="adm-stat">No active listings.</div>'; return; }
      el.innerHTML = `<div class="adm-stat" style="margin-bottom:6px">${listings.length} active listing(s)</div>` +
        '<div class="adm-player-table"><div class="adm-pt-header"><span>Item</span><span>Qty</span><span>Price</span><span>Seller</span><span>Actions</span></div>' +
        listings.map(l => `<div class="adm-pt-row">
          <span class="adm-item-name">${l.itemName||l.item}</span>
          <span>${l.qty}</span>
          <span>${l.priceEach}g ea</span>
          <span>${l.sellerName||'?'}</span>
          <span><button class="btn btn-xs btn-danger" onclick="online.firestore.collection('bazaar').doc('${l.id}').update({status:'cancelled'}).then(()=>{ui.toast({type:'info',text:'Cancelled'});ui._admLoadBazaar()})">Cancel</button></span>
        </div>`).join('') + '</div>';
    } catch(e) { el.innerHTML = `<div class="adm-stat">Error: ${e.message}</div>`; }
  };

  // Logs
  UI.prototype._admLoadLogs = async function(){this.toast({type:'info',text:'Loading logs…'});this._admLogs=await online.getAdminLog(100);this.renderPage('admin');};

  // State
  UI.prototype._admInspectState = function(){const path=document.getElementById('adm-state-path')?.value?.trim();if(!path)return;this._admStatePath=path;try{let val=game.state;for(const p of path.split('.'))val=val?.[p];this._admStateResult=typeof val==='object'?JSON.stringify(val,null,2):String(val);}catch(e){this._admStateResult='Error: '+e.message;}this.renderPage('admin');};
  UI.prototype._admSetStateVal = function(){const path=document.getElementById('adm-state-path')?.value?.trim(),raw=document.getElementById('adm-state-set-val')?.value?.trim();if(!path||!raw)return;try{const parts=path.split('.'),key=parts.pop();let obj=game.state;for(const p of parts)obj=obj[p];obj[key]=JSON.parse(raw);online?.adminLog?.('state_edit',{path,value:raw});this.toast({type:'success',text:`Set ${path}`});this._admInspectState();}catch(e){this.toast({type:'warn',text:'Error: '+e.message});}};

  // General
  UI.prototype._admGiveGold = function(){const a=parseInt(prompt('Gold amount:','100000'))||0;if(!a)return;game.state.gold+=a;this.toast({type:'success',text:`+${this.fmt(a)} gold`});this.renderPage('admin');};
  UI.prototype._admMaxAll = function(){for(const sk of Object.keys(game.state.skills)){game.state.skills[sk].level=99;game.state.skills[sk].xp=13034431;}online?.adminLog?.('max_skills',{});this.toast({type:'success',text:'All skills maxed'});this.renderSidebar();this.renderPage('admin');};
  UI.prototype._admFullHeal = function(){game.state.combat.playerHp=game.getMaxHp();this.toast({type:'success',text:'Healed'});this.renderPage('admin');};
  UI.prototype._admGiveAllItems = function(){let c=0;for(const id of Object.keys(GAME_DATA.items)){if(!game.state.bank[id]){game.addItem(id,10);c++;}}this.toast({type:'success',text:`Given ${c} item types`});this.renderPage('admin');};
  UI.prototype._admClearBank = function(){if(!confirm('Clear entire bank?'))return;game.state.bank={};this.toast({type:'success',text:'Bank cleared'});this.renderPage('admin');};
  UI.prototype._admCompleteQuests = function(){if(!GAME_DATA.quests)return;for(const q of GAME_DATA.quests)if(!game.state.quests.completed.includes(q.id))game.state.quests.completed.push(q.id);game.state.quests.active=[];this.toast({type:'success',text:`${GAME_DATA.quests.length} quests done`});this.renderPage('admin');};
  UI.prototype._admResetFightCave = function(){Object.assign(game.state.stats,{fightCaveAttempts:0,fightCaveCompletions:0,fightCaveDeaths:0,fightCaveBestWave:0,jadKills:0,jadDeaths:0});this.toast({type:'success',text:'FC stats reset'});this.renderPage('admin');};

  console.log(`[Ashfall] Admin panel v${ADMIN_VERSION} loaded.`);
}

// Engine helpers
if (typeof GameEngine !== 'undefined') {
  GameEngine.prototype.unlockAllSpellbooks = function(){if(!this.state.unlockedSpellbooks)this.state.unlockedSpellbooks={};for(const id of Object.keys(GAME_DATA.spellbooks))this.state.unlockedSpellbooks[id]=true;if(typeof ui!=='undefined'){ui.toast({type:'success',text:'All spellbooks unlocked'});ui.renderPage('admin');}};
}

applyAdminPanel();
window.loadCustomMonsterImages = loadCustomMonsterImages;

  // ── CREATE METHODS ──────────────────────────────────────
  UI.prototype._admCreateItem = function(giveOne=false) {
    const g = (id) => document.getElementById(id)?.value?.trim();
    const gn = (id) => parseFloat(document.getElementById(id)?.value) || 0;
    const itemId = g('ci-id');
    if (!itemId) { this.toast({type:'warn',text:'Item ID required'}); return; }
    if (GAME_DATA.items[itemId]) { this.toast({type:'warn',text:'Item ID already exists — use a unique ID'}); return; }
    const stats = {};
    if (gn('ci-atk')) stats.attackBonus = gn('ci-atk');
    if (gn('ci-str')) stats.strengthBonus = gn('ci-str');
    if (gn('ci-def')) stats.defenceBonus = gn('ci-def');
    if (gn('ci-rng')) stats.rangedBonus = gn('ci-rng');
    if (gn('ci-mag')) stats.magicBonus = gn('ci-mag');
    if (gn('ci-dr'))  stats.damageReduction = gn('ci-dr');
    const levelReq = {};
    if (gn('ci-req-atk')) levelReq.attack = gn('ci-req-atk');
    if (gn('ci-req-def')) levelReq.defence = gn('ci-req-def');
    if (gn('ci-req-rng')) levelReq.ranged = gn('ci-req-rng');
    if (gn('ci-req-mag')) levelReq.magic = gn('ci-req-mag');
    const slot = g('ci-slot');
    const style = g('ci-style');
    const heals = gn('ci-heals');
    const newItem = {
      id: itemId,
      name: g('ci-name') || itemId,
      desc: g('ci-desc') || '',
      type: g('ci-type') || 'resource',
      rarity: g('ci-rarity') || 'common',
      sellPrice: gn('ci-price'),
      ...(slot ? { slot } : {}),
      ...(style ? { style } : {}),
      ...(Object.keys(stats).length ? { stats } : {}),
      ...(Object.keys(levelReq).length ? { levelReq } : {}),
      ...(heals > 0 ? { heals } : {}),
      ...(gn('ci-speed') !== 2.4 ? { attackSpeed: gn('ci-speed') } : {}),
      sprite: slot === 'weapon' ? `sword-${g('ci-rarity')||'iron'}` : slot ? `${slot}-steel` : 'misc-gear',
    };
    GAME_DATA.items[itemId] = newItem;
    const shopCat = g('ci-shop');
    if (shopCat) GAME_DATA.shop.push({ item: itemId, price: gn('ci-shop-price') || newItem.sellPrice*2, category: shopCat });
    if (giveOne) game.addItem(itemId, 1);
    online?.adminLog?.('create_item', { itemId, name: newItem.name });
    const result = document.getElementById('adm-create-result');
    if (result) result.textContent = `✅ Created: ${newItem.name} (${itemId})${giveOne?' — added to bank':''}`;
    this.toast({type:'success', text:`Item "${newItem.name}" created!`});
  };

  UI.prototype._admCreateMonster = function() {
    const g = (id) => document.getElementById(id)?.value?.trim();
    const gn = (id) => parseFloat(document.getElementById(id)?.value) || 0;
    const mId = g('cm-id');
    if (!mId) { this.toast({type:'warn',text:'Monster ID required'}); return; }
    if (GAME_DATA.monsters[mId]) { this.toast({type:'warn',text:'Monster ID already exists'}); return; }
    const parseDrops = (raw) => {
      if (!raw) return null;
      const parts = raw.split(':');
      if (parts.length < 2) return null;
      return { item: parts[0].trim(), qty: parseInt(parts[1])||1, chance: parseFloat(parts[2])||1.0 };
    };
    const drops = ['cm-drop1','cm-drop2','cm-drop3','cm-drop4','cm-drop5'].map(id=>parseDrops(g(id))).filter(Boolean);
    const monster = {
      id: mId,
      name: g('cm-name') || mId,
      hp: gn('cm-hp') || 100,
      maxHit: gn('cm-maxhit') || 10,
      combatLevel: gn('cm-cl') || 1,
      attackSpeed: gn('cm-spd') || 2.4,
      xp: gn('cm-xp') || 50,
      style: g('cm-style') || 'melee',
      alignment: g('cm-align') || 'true_neutral',
      gold: { min: gn('cm-gmin')||1, max: gn('cm-gmax')||10 },
      evasion: { melee: gn('cm-evmelee')||0, ranged: gn('cm-evranged')||0, magic: gn('cm-evmagic')||0 },
      drops: drops.length ? drops : [{ item:'bones', qty:1, chance:1.0 }],
    };
    GAME_DATA.monsters[mId] = monster;
    const areaId = g('cm-area');
    if (areaId) {
      const area = GAME_DATA.combatAreas.find(a=>a.id===areaId);
      if (area && !area.monsters.includes(mId)) area.monsters.push(mId);
    }
    online?.adminLog?.('create_monster', { mId, name: monster.name });
    const result = document.getElementById('adm-create-result');
    if (result) result.textContent = `✅ Created: ${monster.name} (${mId})${areaId?' added to '+areaId:''}`;
    this.toast({type:'success', text:`Monster "${monster.name}" created!`});
  };

  UI.prototype._admCreateRecipe = function() {
    const g = (id) => document.getElementById(id)?.value?.trim();
    const gn = (id) => parseFloat(document.getElementById(id)?.value) || 0;
    const rId = g('cr-id');
    const skill = g('cr-skill');
    if (!rId || !skill) { this.toast({type:'warn',text:'Recipe ID and skill required'}); return; }
    if (!GAME_DATA.recipes[skill]) GAME_DATA.recipes[skill] = [];
    if (GAME_DATA.recipes[skill].find(r=>r.id===rId)) { this.toast({type:'warn',text:'Recipe ID already exists'}); return; }
    const parseInput = (raw) => {
      if (!raw) return null;
      const parts = raw.split(':');
      if (parts.length < 1 || !parts[0].trim()) return null;
      return { item: parts[0].trim(), qty: parseInt(parts[1])||1 };
    };
    const inputs = ['cr-in1','cr-in2','cr-in3','cr-in4'].map(id=>parseInput(g(id))).filter(Boolean);
    const recipe = {
      id: rId,
      name: g('cr-name') || rId,
      level: gn('cr-level') || 1,
      xp: gn('cr-xp') || 50,
      time: gn('cr-time') || 3.0,
      input: inputs,
      output: { item: g('cr-out-id'), qty: gn('cr-out-qty') || 1 },
    };
    GAME_DATA.recipes[skill].push(recipe);
    online?.adminLog?.('create_recipe', { rId, skill, name: recipe.name });
    const result = document.getElementById('adm-create-result');
    if (result) result.textContent = `✅ Created recipe: ${recipe.name} in ${skill}`;
    this.toast({type:'success', text:`Recipe "${recipe.name}" added to ${skill}!`});
  };

  UI.prototype._admCreateArea = function() {
    const g = (id) => document.getElementById(id)?.value?.trim();
    const aId = g('ca-id');
    if (!aId) { this.toast({type:'warn',text:'Area ID required'}); return; }
    if (GAME_DATA.combatAreas.find(a=>a.id===aId)) { this.toast({type:'warn',text:'Area ID already exists'}); return; }
    const monsters = (g('ca-monsters')||'').split(',').map(m=>m.trim()).filter(Boolean);
    const area = {
      id: aId,
      name: g('ca-name') || aId,
      desc: g('ca-desc') || '',
      levelReq: parseInt(document.getElementById('ca-lvl')?.value)||1,
      monsters,
    };
    GAME_DATA.combatAreas.push(area);
    online?.adminLog?.('create_area', { aId, name: area.name });
    const result = document.getElementById('adm-create-result');
    if (result) result.textContent = `✅ Created area: ${area.name} with ${monsters.length} monster(s)`;
    this.toast({type:'success', text:`Area "${area.name}" created!`});
  };

  UI.prototype._admAddToShop = function() {
    const id = document.getElementById('sm-id')?.value?.trim();
    const price = parseInt(document.getElementById('sm-price')?.value)||100;
    const cat = document.getElementById('sm-cat-custom')?.value?.trim() || document.getElementById('sm-cat')?.value || 'equipment';
    if (!id) { this.toast({type:'warn',text:'Item ID required'}); return; }
    if (!GAME_DATA.items[id]) { this.toast({type:'warn',text:`Item "${id}" not found in game data`}); return; }
    if (GAME_DATA.shop.find(s=>s.item===id)) { this.toast({type:'warn',text:'Item already in shop — remove first or edit price'}); return; }
    GAME_DATA.shop.push({ item: id, price, category: cat });
    online?.adminLog?.('add_to_shop', { itemId: id, price, category: cat });
    this.toast({type:'success', text:`"${GAME_DATA.items[id].name}" added to shop for ${price}g`});
    this.renderPage('admin');
  };

// Load images after Firebase auth
(function waitForAuth(){if(typeof online!=='undefined'&&online.db){loadCustomMonsterImages();}else setTimeout(waitForAuth,1000);})();

// Event delegation (delete button + player edit)
document.addEventListener('click',function(e){
  const btn=e.target.closest('[data-adm-delete-uid]');
  if(btn&&typeof ui!=='undefined'){
    const uid=btn.getAttribute('data-adm-delete-uid'),name=btn.getAttribute('data-adm-delete-name')||'?';
    ui._admDeletePlayer(uid,name);
  }
});

// Hash + sidebar
window.addEventListener('hashchange',function(){if(location.hash==='#admin'&&typeof ui!=='undefined'&&_checkAdmin()){ui.currentPage='admin';ui.renderSidebar();ui.renderPage('admin');}});
window.addEventListener('DOMContentLoaded',function(){setTimeout(function(){if(location.hash==='#admin'&&typeof ui!=='undefined'&&_checkAdmin()){ui.currentPage='admin';ui.renderSidebar();ui.renderPage('admin');}},2000);});
(function(){let c=0;const iv=setInterval(function(){if(++c>30){clearInterval(iv);return;}if(_checkAdmin()&&typeof ui!=='undefined'){const sb=document.getElementById('sidebar');if(sb&&!sb.querySelector('[data-page="admin"]'))ui.renderSidebar();clearInterval(iv);}},1000);})();
window.openAdmin=function(){if(_checkAdmin()){ui.currentPage='admin';ui.renderSidebar();ui.renderPage('admin');}else console.warn('[Admin] Access denied.');};

// ── MIGRATE: push all RTDB admin_roles into Firestore /players/{uid}.adminRole
// Runs once on owner login so existing role assignments work without reassignment
async function _migrateRolesToFirestore() {
  if (!online?.db || !online?.firestore) return;
  if (!(typeof isAdmin === 'function' && isAdmin())) return; // owner only
  try {
    const snap = await online.db.ref('/admin_roles').once('value');
    const roles = snap.val();
    if (!roles) return;
    let migrated = 0;
    const batch = online.firestore.batch();
    for (const [uid, role] of Object.entries(roles)) {
      if (role && role !== 'VIEWER') {
        const ref = online.firestore.collection('players').doc(uid);
        batch.set(ref, { adminRole: role }, { merge: true });
        migrated++;
      }
    }
    if (migrated > 0) {
      await batch.commit();
      console.log(`[Admin] Migrated ${migrated} roles to Firestore.`);
    }
  } catch(e) {
    console.warn('[Admin] Role migration failed:', e);
  }
}
(function waitAndMigrate(){
  if(typeof online!=='undefined'&&online.db&&online.firestore&&typeof isAdmin==='function'&&isAdmin()){
    _migrateRolesToFirestore();
  } else if(typeof online==='undefined'||!online.db){
    setTimeout(waitAndMigrate,2000);
  }
})();

})();
