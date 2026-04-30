// ============================================================
// ASHFALL IDLE — ADMIN PANEL  v3.0
// ============================================================

(function() {

const ADMIN_VERSION = '3.0';

function _checkAdmin() { return typeof isAdmin === 'function' ? isAdmin() : false; }

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
      { id:'dashboard',  label:'Dashboard',  icon:'⚡' },
      { id:'players',    label:'Players',    icon:'👤' },
      { id:'items',      label:'Items',      icon:'⚔' },
      { id:'monsters',   label:'Monsters',   icon:'💀' },
      { id:'skills',     label:'Skills',     icon:'📊' },
      { id:'gold',       label:'Gold',       icon:'💰' },
      { id:'leaderboard',label:'Leaderboard',icon:'🏆' },
      { id:'content',    label:'Content',    icon:'📢' },
      { id:'settings',   label:'Settings',  icon:'🔧' },
      { id:'logs',       label:'Logs',       icon:'📋' },
      { id:'combat',     label:'Combat',     icon:'⚔' },
      { id:'quests',     label:'Quests',     icon:'📜' },
      { id:'state',      label:'State',      icon:'🔍' },
      { id:'tools',      label:'Tools',      icon:'🛠' },
    ];

    let html = `<div class="admin-panel">
      <div class="admin-header-bar">
        <div class="ahb-title">⚙ Ashfall Admin <span class="ahb-ver">v${ADMIN_VERSION}</span></div>
        <div class="ahb-sub">${online?.displayName||'Admin'} • ${new Date().toLocaleTimeString()}</div>
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
      </div>

      <div class="adm-dash-row">
        <div class="adm-section adm-dash-half">
          <h3>Quick Actions</h3>
          <div class="adm-btn-grid">
            <button class="btn btn-sm" onclick="ui._admMaxAll()">Max All Skills</button>
            <button class="btn btn-sm" onclick="game.state.gold+=1000000;ui.toast({type:'success',text:'+1M gold'});ui.renderPage('admin')">+1M Gold</button>
            <button class="btn btn-sm" onclick="ui._admFullHeal()">Full Heal</button>
            <button class="btn btn-sm" onclick="game.state.prayerPoints=99;ui.renderPage('admin')">Fill Prayer</button>
            <button class="btn btn-sm" onclick="ui._admGiveAllItems()">Give All Items</button>
            <button class="btn btn-sm" onclick="ui._admCompleteQuests()">Complete All Quests</button>
            <button class="btn btn-sm" onclick="game.state.specEnergy=100;ui.renderPage('admin')">Fill Spec</button>
            <button class="btn btn-sm" onclick="game.saveGame();ui.toast({type:'success',text:'Saved'})">Force Save</button>
          </div>
        </div>
        <div class="adm-section adm-dash-half">
          <h3>Broadcast Message</h3>
          <div class="adm-col-flex">
            <select id="adm-bc-type" class="bank-search-input" style="width:120px">
              <option value="info">Info</option><option value="success">Success</option><option value="warn">Warning</option><option value="danger">Danger</option>
            </select>
            <input type="text" id="adm-broadcast" class="bank-search-input" placeholder="System message for global chat..." style="flex:1">
            <button class="btn btn-sm" onclick="ui._admBroadcast()">Send</button>
          </div>
          <h3 style="margin-top:12px">Active Announcement</h3>
          <div id="adm-announce-status" style="font-size:12px;color:var(--text-dim)">Loading…</div>
          <div class="adm-btn-grid" style="margin-top:6px">
            <button class="btn btn-xs" onclick="ui._admTab='content';ui.renderPage('admin')">Manage Announcements →</button>
          </div>
        </div>
      </div>

      <div class="adm-section">
        <h3>Data Summary</h3>
        <div class="adm-grid">
          <div class="adm-stat">Items in GAME_DATA: <strong>${Object.keys(GAME_DATA.items).length}</strong></div>
          <div class="adm-stat">Monsters: <strong>${Object.keys(GAME_DATA.monsters||{}).length}</strong></div>
          <div class="adm-stat">Spells (all books): <strong>${(GAME_DATA.spells||[]).length + (GAME_DATA.pyromancySpells||[]).length + (GAME_DATA.cryomancySpells||[]).length + (GAME_DATA.bloodMagicSpells||[]).length + (GAME_DATA.voidMagicSpells||[]).length + (GAME_DATA.necromancySpells||[]).length}</strong></div>
          <div class="adm-stat">Quests: <strong>${GAME_DATA.quests?.length||0}</strong></div>
          <div class="adm-stat">Crafting Recipes: <strong>${Object.values(GAME_DATA.recipes||{}).reduce((a,v)=>a+(Array.isArray(v)?v.length:0),0)}</strong></div>
          <div class="adm-stat">Combat Areas: <strong>${GAME_DATA.combatAreas?.length||0}</strong></div>
          <div class="adm-stat">Skills: <strong>${Object.keys(s.skills).length}</strong></div>
          <div class="adm-stat">Active Spellbook: <strong>${s.activeSpellbook||'standard'}</strong></div>
        </div>
      </div>`;

      // Load current announcement async
      html += `<script>setTimeout(async()=>{const anns=await online.getAnnouncements?.();const el=document.getElementById('adm-announce-status');if(!el)return;if(anns?.length){const a=anns[0];el.innerHTML='<strong>'+a.title+'</strong> — '+a.body;}else{el.textContent='No active announcements.';}},300);<\/script>`;
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
        html += `<div class="adm-section">
          <h3>Editing: <span style="color:var(--accent)">${p.displayName||p.uid}</span></h3>
          <button class="btn btn-xs" onclick="ui._admPlayerEdit=null;ui.renderPage('admin')" style="margin-bottom:10px">← Back</button>
          <div class="adm-grid" style="margin-bottom:10px">
            <div class="adm-stat">UID: <code style="font-size:10px">${p.uid}</code></div>
            <div class="adm-stat">TL: ${p.totalLevel||'?'} | CL: ${p.combatLevel||'?'}</div>
            <div class="adm-stat">Kills: ${p.kills||0} | Quests: ${p.questsCompleted||0}</div>
            <div class="adm-stat">Last seen: ${p.lastSeen?.toDate?.()?.toLocaleDateString?.() || 'unknown'}</div>
          </div>
          <div class="adm-btn-grid">
            <button class="btn btn-sm btn-danger" onclick="ui._admDeletePlayer('${p.uid}','${(p.displayName||'?').replace(/'/g,"\\'")}')">🗑 Delete Player</button>
            <button class="btn btn-sm" onclick="ui._admBanPlayer('${p.uid}','${(p.displayName||'?').replace(/'/g,"\\'")}')">🚫 Ban Player</button>
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
              <button class="btn btn-xs" onclick="ui._admPlayerEdit=${JSON.stringify(p).replace(/"/g,'&quot;').replace(/'/g,"\\'")};;ui.renderPage('admin')" onclick2="ui._admShowPlayer('${p.uid}')">View</button>
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

    // ── ITEMS ─────────────────────────────────────────────
    if (tab === 'items') {
      const editId = this._admItemEdit;
      const editItem = editId ? GAME_DATA.items[editId] : null;

      if (editItem) {
        const hasImg = !!editItem._customImage;
        html += `<div class="adm-section">
          <h3>Edit Item — <span style="color:${GAME_DATA.rarities?.[editItem.rarity]?.color||'var(--accent)'}">${editItem.name}</span></h3>
          <button class="btn btn-xs" onclick="ui._admItemEdit=null;ui.renderPage('admin')" style="margin-bottom:10px">← Back to Items</button>

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
          <button class="btn btn-xs" onclick="ui._admMonEdit=null;ui.renderPage('admin')" style="margin-bottom:10px">← Back</button>
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
      const knownFlags = [
        {key:'double_xp',       label:'Double XP',           desc:'2x XP for all skills'},
        {key:'double_drops',    label:'Double Drops',         desc:'2x drop rates for all monsters'},
        {key:'safe_wilderness', label:'Safe Wilderness',      desc:'Disable PvP in wilderness'},
        {key:'bazaar_disabled', label:'Disable Bazaar',       desc:'Take bazaar offline for maintenance'},
        {key:'xp_multiplier',   label:'XP Multiplier',        desc:'Float: 1.0 = normal, 2.0 = double'},
        {key:'maintenance',     label:'Maintenance Mode',     desc:'Warn players game is under maintenance'},
        {key:'event_active',    label:'Event Active',         desc:'Trigger in-game event banner'},
        {key:'event_name',      label:'Event Name',           desc:'Name of the active event'},
      ];
      html+=`<script>setTimeout(async()=>{const el=document.getElementById('adm-settings-area');if(!el)return;const settings=await online.getGameSettings?.();let h='<div class="adm-flags-grid">';for(const f of ${JSON.stringify(knownFlags)}){const v=settings[f.key];h+='<div class="adm-flag-row"><div><div class="adm-flag-name">'+f.label+'</div><div class="adm-flag-desc">'+f.desc+'</div></div><div class="adm-flag-val">'+JSON.stringify(v??null)+'</div><div class="adm-flag-actions"><button class="btn btn-xs" onclick="online.setGameSetting(\\''+f.key+'\\',true).then(()=>ui.renderPage(\\'admin\\'))">On</button><button class="btn btn-xs" onclick="online.setGameSetting(\\''+f.key+'\\',false).then(()=>ui.renderPage(\\'admin\\'))">Off</button><button class="btn btn-xs btn-danger" onclick="online.setGameSetting(\\''+f.key+'\\',null).then(()=>ui.renderPage(\\'admin\\'))">Clear</button></div></div>';}h+='</div>';el.innerHTML=h;},300);<\/script>`;
    }

    // ── LOGS ─────────────────────────────────────────────
    if (tab === 'logs') {
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
    if (tab === 'tools') {
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

})();
