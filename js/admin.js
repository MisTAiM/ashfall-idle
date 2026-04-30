// ============================================================
// ASHFALL IDLE — ADMIN PANEL  v2.0
// Full editing: items, skills, monsters, gold, state, tools
// Monster image upload via Firebase RTDB (base64)
// ============================================================

(function() {

function _checkAdmin() {
  return typeof isAdmin === 'function' ? isAdmin() : false;
}

// ── LOAD CUSTOM MONSTER IMAGES FROM FIREBASE ─────────────
async function loadCustomMonsterImages() {
  if (typeof online === 'undefined' || !online.db) return;
  try {
    const snap = await online.db.ref('/monster_images').once('value');
    const data = snap.val();
    if (!data) return;
    if (!GAME_DATA.monsterArt) GAME_DATA.monsterArt = {};
    let count = 0;
    for (const [mId, imgData] of Object.entries(data)) {
      if (imgData) { GAME_DATA.monsterArt[mId] = `<img src="${imgData}" class="monster-art-img" alt="${mId}">`; count++; }
    }
    console.log(`[Admin] Loaded ${count} custom monster images`);
    if (count > 0 && typeof ui !== 'undefined' && ui.currentPage === 'combat') ui.renderPage('combat');
  } catch(e) { console.warn('[Admin] Could not load monster images:', e); }
}

async function saveMonsterImage(monsterId, base64DataUrl) {
  if (typeof online === 'undefined' || !online.db) throw new Error('Not online');
  await online.db.ref(`/monster_images/${monsterId}`).set(base64DataUrl);
  if (!GAME_DATA.monsterArt) GAME_DATA.monsterArt = {};
  GAME_DATA.monsterArt[monsterId] = `<img src="${base64DataUrl}" class="monster-art-img" alt="${monsterId}">`;
}

async function deleteMonsterImage(monsterId) {
  if (typeof online === 'undefined' || !online.db) throw new Error('Not online');
  await online.db.ref(`/monster_images/${monsterId}`).remove();
  if (GAME_DATA.monsterArt?.[monsterId]?.startsWith?.('<img')) delete GAME_DATA.monsterArt[monsterId];
}

// ── APPLY ADMIN PANEL ─────────────────────────────────────
function applyAdminPanel() {
  if (typeof UI === 'undefined' || typeof GameEngine === 'undefined') { setTimeout(applyAdminPanel, 200); return; }

  const origRenderPage = UI.prototype.renderPage;
  UI.prototype.renderPage = function(pageId) {
    if (pageId === 'admin') { const main = document.getElementById('main-content'); if (main) this.renderAdminPanel(main); return; }
    origRenderPage.call(this, pageId);
  };

  const origRenderSidebar = UI.prototype.renderSidebar;
  UI.prototype.renderSidebar = function() {
    origRenderSidebar.call(this);
    if (!_checkAdmin()) return;
    const sidebar = document.getElementById('sidebar'); if (!sidebar) return;
    const nav = sidebar.querySelector('.sidebar-nav'); if (!nav || nav.querySelector('[data-page="admin"]')) return;
    const section = document.createElement('div');
    section.className = 'nav-section';
    section.innerHTML = `<div class="nav-header">Admin</div><div class="nav-item ${this.currentPage==='admin'?'active':''}" data-page="admin"><span class="nav-icon">${typeof icon==='function'?icon('settings',16):''}</span><span class="nav-label">Admin Panel</span></div>`;
    nav.appendChild(section);
  };

  UI.prototype.renderAdminPanel = function(el) {
    if (!_checkAdmin()) { el.innerHTML = '<div class="bank-empty">Access denied.</div>'; return; }
    const s = game.state;
    const tab = this._admTab || 'overview';
    const tabs = [{id:'overview',label:'Overview'},{id:'players',label:'Players'},{id:'items',label:'Items'},{id:'skills',label:'Skills'},{id:'gold',label:'Gold'},{id:'combat',label:'Combat'},{id:'monsters',label:'Monsters'},{id:'quests',label:'Quests'},{id:'state',label:'State'},{id:'tools',label:'Tools'}];
    let html = `<div class="admin-panel"><div class="admin-header-bar"><div class="ahb-title">⚙ Admin Panel</div><div class="ahb-sub">UID: ${online?.user?.uid||'?'} | ${online?.displayName||'Admin'}</div></div><div class="admin-tabs">${tabs.map(t=>`<button class="admin-tab ${tab===t.id?'active':''}" onclick="ui._admTab='${t.id}';ui.renderPage('admin')">${t.label}</button>`).join('')}</div><div class="admin-body">`;

    // ── OVERVIEW ─────────────────────────────────────────
    if (tab === 'overview') {
      const totalItems = Object.keys(s.bank).filter(k=>s.bank[k]>0).length;
      const totalLevel = Object.values(s.skills).reduce((a,sk)=>a+(sk.level||1),0);
      html += `<div class="adm-section"><h3>Game State</h3><div class="adm-grid">
        <div class="adm-stat">Gold: <strong>${this.fmt(s.gold)}</strong></div>
        <div class="adm-stat">Total Level: <strong>${totalLevel}</strong></div>
        <div class="adm-stat">Combat Level: <strong>${game.getCombatLevel()}</strong></div>
        <div class="adm-stat">Bank Items: <strong>${totalItems}</strong></div>
        <div class="adm-stat">Monsters Killed: <strong>${this.fmt(s.stats.monstersKilled||0)}</strong></div>
        <div class="adm-stat">Quests Done: <strong>${s.quests?.completed?.length||0}/${GAME_DATA.quests?.length||0}</strong></div>
        <div class="adm-stat">FC Clears: <strong>${s.stats.fightCaveCompletions||0}</strong></div>
        <div class="adm-stat">Prayer Points: <strong>${s.prayerPoints||0}</strong></div>
        <div class="adm-stat">Spellbook: <strong>${s.activeSpellbook||'standard'}</strong></div>
      </div></div>
      <div class="adm-section"><h3>Quick Actions</h3><div class="adm-btn-grid">
        <button class="btn btn-sm" onclick="ui._admGiveGold()">Give Gold</button>
        <button class="btn btn-sm" onclick="ui._admMaxAll()">Max All Skills</button>
        <button class="btn btn-sm" onclick="ui._admFullHeal()">Full Heal</button>
        <button class="btn btn-sm" onclick="ui._admFillPrayer()">Fill Prayer</button>
        <button class="btn btn-sm" onclick="ui._admGiveAllItems()">Give All Items</button>
        <button class="btn btn-sm" onclick="ui._admClearBank()">Clear Bank</button>
        <button class="btn btn-sm" onclick="ui._admCompleteQuests()">Complete All Quests</button>
        <button class="btn btn-sm" onclick="ui._admResetFightCave()">Reset FC Stats</button>
      </div></div>
      <div class="adm-section"><h3>Broadcast</h3><div class="adm-row-flex">
        <input type="text" id="adm-broadcast" class="bank-search-input" placeholder="System message...">
        <button class="btn btn-sm" onclick="ui._admBroadcast()">Send</button>
      </div></div>`;
    }

    // ── PLAYERS ──────────────────────────────────────────
    if (tab === 'players') {
      html += `<div class="adm-section"><h3>Player Management</h3><div class="adm-btn-grid" style="margin-bottom:8px">
        <button class="btn btn-sm" onclick="ui._admLoadPlayers()">Load All Players</button>
        <button class="btn btn-sm btn-danger" onclick="ui._admDeleteGhosts()">Delete Ghost Accounts</button>
      </div></div>`;
      if (this._admPlayerList?.length > 0) {
        html += `<div class="adm-section"><h3>Players (${this._admPlayerList.length})</h3><input type="text" class="bank-search-input" placeholder="Filter players..." oninput="ui._admPlayerFilter=this.value;ui.renderPage('admin')" value="${this._admPlayerFilter||''}" style="margin-bottom:8px">`;
        const pf = (this._admPlayerFilter||'').toLowerCase();
        const fp = pf ? this._admPlayerList.filter(p=>(p.displayName||'').toLowerCase().includes(pf)||p.uid.toLowerCase().includes(pf)) : this._admPlayerList;
        for (const p of fp) {
          const isMe = p.uid === online?.user?.uid;
          const safe = (p.displayName||'?').replace(/[<>"&]/g,'');
          html += `<div class="adm-item-row" style="${isMe?'border-left:3px solid var(--accent);padding-left:6px':''}"><span class="adm-item-name">${safe}${isMe?' (YOU)':''}</span><span class="adm-item-id">${p.uid.substring(0,8)}…</span><span class="adm-item-qty">TL:${p.totalLevel||'?'} CL:${p.combatLevel||'?'}</span>${!isMe?`<button class="btn btn-xs btn-danger" data-adm-delete-uid="${p.uid}" data-adm-delete-name="${safe}">Delete</button>`:''}</div>`;
        }
        html += `</div>`;
      }
    }

    // ── ITEMS ─────────────────────────────────────────────
    if (tab === 'items') {
      const editId = this._admItemEdit;
      const editItem = editId ? GAME_DATA.items[editId] : null;
      if (editItem) {
        html += `<div class="adm-section"><h3>Edit Item — <span style="color:var(--accent)">${editItem.name}</span> <small style="color:var(--text-dim)">(${editItem.id})</small></h3>
          <button class="btn btn-xs" onclick="ui._admItemEdit=null;ui.renderPage('admin')" style="margin-bottom:10px">← Back to Items</button>
          <div class="adm-edit-grid">
            <label>Name</label><input type="text" id="ei-name" class="bank-search-input" value="${(editItem.name||'').replace(/"/g,'&quot;')}">
            <label>Description</label><input type="text" id="ei-desc" class="bank-search-input" value="${(editItem.desc||'').replace(/"/g,'&quot;')}">
            <label>Sell Price</label><input type="number" id="ei-price" class="bank-search-input" value="${editItem.sellPrice||0}">
            <label>Rarity</label><select id="ei-rarity" class="bank-search-input">${['common','uncommon','rare','epic','legendary','mythic'].map(r=>`<option value="${r}" ${editItem.rarity===r?'selected':''}>${r}</option>`).join('')}</select>
            ${editItem.stats?`<label>Attack Bonus</label><input type="number" id="ei-atk" class="bank-search-input" value="${editItem.stats.attackBonus||0}"><label>Strength Bonus</label><input type="number" id="ei-str" class="bank-search-input" value="${editItem.stats.strengthBonus||0}"><label>Magic Bonus</label><input type="number" id="ei-mag" class="bank-search-input" value="${editItem.stats.magicBonus||0}"><label>Ranged Bonus</label><input type="number" id="ei-rng" class="bank-search-input" value="${editItem.stats.rangedBonus||0}"><label>Defence Bonus</label><input type="number" id="ei-def" class="bank-search-input" value="${editItem.stats.defenceBonus||0}">`:''}
          </div>
          <div class="adm-btn-grid" style="margin-top:10px">
            <button class="btn btn-sm" onclick="ui._admSaveItemEdit('${editId}')">Save Changes</button>
            <button class="btn btn-xs" onclick="ui._admItemEdit=null;ui.renderPage('admin')">Cancel</button>
          </div>
        </div>
        <div class="adm-section"><h3>Give / Take — ${editItem.name}</h3>
          <div class="adm-row-flex">
            <input type="number" id="ei-qty" class="bank-search-input" value="1" style="width:80px" min="1">
            <button class="btn btn-sm" onclick="ui._admGiveItemQty('${editId}')">Give</button>
            <button class="btn btn-sm btn-danger" onclick="ui._admTakeItemQty('${editId}')">Take</button>
            <button class="btn btn-sm btn-danger" onclick="game.state.bank['${editId}']=0;ui.toast({type:'info',text:'Removed all'});ui.renderPage('admin')">Remove All</button>
          </div>
          <div style="margin-top:6px;color:var(--text-dim);font-size:12px">In bank: <strong>${s.bank[editId]||0}</strong></div>
        </div>`;
      } else {
        html += `<div class="adm-section"><h3>Items (${Object.keys(GAME_DATA.items).length} total)</h3>
          <div class="adm-row-flex" style="margin-bottom:8px">
            <input type="text" id="adm-item-search" class="bank-search-input" placeholder="Search by ID or name…" oninput="ui._admItemSearch=this.value;ui.renderPage('admin')" value="${this._admItemSearch||''}">
            <select class="bank-search-input" style="width:130px" onchange="ui._admItemType=this.value;ui.renderPage('admin')">
              <option value="">All Types</option>
              ${[...new Set(Object.values(GAME_DATA.items).map(i=>i.type).filter(Boolean))].sort().map(t=>`<option value="${t}" ${this._admItemType===t?'selected':''}>${t}</option>`).join('')}
            </select>
          </div>
          <div class="adm-item-list">`;
        const iSearch=(this._admItemSearch||'').toLowerCase(), iType=this._admItemType||'';
        const allI = Object.values(GAME_DATA.items).filter(i=>(!iSearch||i.id.includes(iSearch)||(i.name||'').toLowerCase().includes(iSearch))&&(!iType||i.type===iType)).slice(0,50);
        for (const item of allI) {
          const qty=s.bank[item.id]||0, col=item.rarity?(GAME_DATA.rarities?.[item.rarity]?.color||''):'';
          html += `<div class="adm-item-row"><span class="adm-item-name" style="${col?'color:'+col:''}">${item.name}</span><span class="adm-item-id">${item.id}</span><span class="adm-item-qty">x${qty}</span><button class="btn btn-xs" onclick="ui._admGiveItem('${item.id}',1)">+1</button><button class="btn btn-xs" onclick="ui._admGiveItem('${item.id}',10)">+10</button><button class="btn btn-xs" onclick="ui._admGiveItem('${item.id}',100)">+100</button><button class="btn btn-xs btn-danger" onclick="ui._admTakeItem('${item.id}',1)">-1</button><button class="btn btn-xs btn-danger" onclick="ui._admTakeItem('${item.id}',10)">-10</button><button class="btn btn-xs" onclick="ui._admItemEdit='${item.id}';ui.renderPage('admin')">Edit</button></div>`;
        }
        html += `</div></div>
        <div class="adm-section"><h3>Give / Take Custom</h3><div class="adm-row-flex">
          <input type="text" id="adm-give-id" class="bank-search-input" placeholder="Item ID">
          <input type="number" id="adm-give-qty" class="bank-search-input" placeholder="Qty" value="1" style="width:80px">
          <button class="btn btn-sm" onclick="ui._admGiveCustom()">Give</button>
          <button class="btn btn-sm btn-danger" onclick="ui._admTakeCustom()">Take</button>
        </div></div>`;
      }
    }

    // ── SKILLS ────────────────────────────────────────────
    if (tab === 'skills') {
      html += `<div class="adm-section"><h3>Skills</h3>
        <div class="adm-btn-grid" style="margin-bottom:10px">
          <button class="btn btn-sm" onclick="ui._admMaxAll()">Max All (99)</button>
          <button class="btn btn-sm btn-danger" onclick="if(confirm('Reset ALL skills to 1?')){for(const sk of Object.keys(game.state.skills)){game.state.skills[sk].level=1;game.state.skills[sk].xp=0;}ui.toast({type:'success',text:'All skills reset'});ui.renderPage('admin')}">Reset All to 1</button>
        </div>
        <div class="adm-skill-grid">`;
      for (const [id, sk] of Object.entries(s.skills)) {
        const name = GAME_DATA.skills[id]?.name||id;
        html += `<div class="adm-skill-row"><span class="adm-sk-name">${name}</span><span class="adm-sk-level">Lv <input type="number" class="adm-lvl-input" value="${sk.level}" min="1" max="99" onchange="ui._admSetSkillLevel('${id}',parseInt(this.value))" style="width:38px;padding:2px 4px;background:var(--bg-deep);border:1px solid var(--border);color:var(--text);border-radius:3px;font-size:11px"></span><span class="adm-sk-xp">${this.fmt(sk.xp)} xp</span><button class="btn btn-xs" onclick="game.addXp('${id}',1000);ui.renderPage('admin')">+1K</button><button class="btn btn-xs" onclick="game.addXp('${id}',10000);ui.renderPage('admin')">+10K</button><button class="btn btn-xs" onclick="game.addXp('${id}',100000);ui.renderPage('admin')">+100K</button><button class="btn btn-xs btn-danger" onclick="ui._admTakeXp('${id}',10000)">-10K</button><button class="btn btn-xs" onclick="ui._admSetSkillLevel('${id}',99)">Max</button><button class="btn btn-xs btn-danger" onclick="if(confirm('Reset ${name} to 1?')){game.state.skills['${id}'].level=1;game.state.skills['${id}'].xp=0;ui.renderPage('admin')}">Reset</button></div>`;
      }
      html += `</div></div>
      <div class="adm-section"><h3>Custom XP</h3><div class="adm-row-flex">
        <select id="adm-xp-skill" class="bank-search-input" style="width:140px">${Object.keys(s.skills).map(sk=>`<option value="${sk}">${GAME_DATA.skills[sk]?.name||sk}</option>`).join('')}</select>
        <input type="number" id="adm-xp-amt" class="bank-search-input" placeholder="Amount" value="10000" style="width:100px">
        <button class="btn btn-sm" onclick="ui._admGiveCustomXp()">Give XP</button>
        <button class="btn btn-sm btn-danger" onclick="ui._admTakeCustomXp()">Take XP</button>
      </div></div>`;
    }

    // ── GOLD ──────────────────────────────────────────────
    if (tab === 'gold') {
      html += `<div class="adm-section"><h3>Gold — Current: <span style="color:var(--accent)">${this.fmt(s.gold)}</span></h3>
        <div class="adm-btn-grid" style="margin-bottom:12px">
          <button class="btn btn-sm" onclick="game.state.gold+=1000;ui.toast({type:'success',text:'+1K gold'});ui.renderPage('admin')">+1K</button>
          <button class="btn btn-sm" onclick="game.state.gold+=10000;ui.toast({type:'success',text:'+10K gold'});ui.renderPage('admin')">+10K</button>
          <button class="btn btn-sm" onclick="game.state.gold+=100000;ui.toast({type:'success',text:'+100K gold'});ui.renderPage('admin')">+100K</button>
          <button class="btn btn-sm" onclick="game.state.gold+=1000000;ui.toast({type:'success',text:'+1M gold'});ui.renderPage('admin')">+1M</button>
          <button class="btn btn-sm btn-danger" onclick="game.state.gold=Math.max(0,game.state.gold-1000);ui.renderPage('admin')">-1K</button>
          <button class="btn btn-sm btn-danger" onclick="game.state.gold=Math.max(0,game.state.gold-10000);ui.renderPage('admin')">-10K</button>
          <button class="btn btn-sm btn-danger" onclick="game.state.gold=Math.max(0,game.state.gold-100000);ui.renderPage('admin')">-100K</button>
          <button class="btn btn-sm btn-danger" onclick="if(confirm('Set gold to 0?')){game.state.gold=0;ui.renderPage('admin')}">Set 0</button>
        </div>
        <div class="adm-row-flex">
          <input type="number" id="adm-gold-amt" class="bank-search-input" placeholder="Custom amount" value="100000" style="width:150px">
          <button class="btn btn-sm" onclick="const a=parseInt(document.getElementById('adm-gold-amt').value)||0;game.state.gold+=a;ui.toast({type:'success',text:'+'+a+' gold'});ui.renderPage('admin')">Add</button>
          <button class="btn btn-sm btn-danger" onclick="const a=parseInt(document.getElementById('adm-gold-amt').value)||0;game.state.gold=Math.max(0,game.state.gold-a);ui.toast({type:'info',text:'-'+a+' gold'});ui.renderPage('admin')">Take</button>
          <button class="btn btn-sm" onclick="const a=parseInt(document.getElementById('adm-gold-amt').value)||0;game.state.gold=a;ui.toast({type:'info',text:'Gold set to '+a});ui.renderPage('admin')">Set Exact</button>
        </div>
      </div>`;
    }

    // ── COMBAT ────────────────────────────────────────────
    if (tab === 'combat') {
      const c = s.combat;
      html += `<div class="adm-section"><h3>Combat State</h3><div class="adm-grid">
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
        <button class="btn btn-sm" onclick="if(game.state.fightCave?.active){game.state.fightCave.currentWave=61;game.state.fightCave.betweenWaves=true;game.state.fightCave.betweenWaveTimer=1;}ui.renderPage('admin')">Skip to Wave 62</button>
      </div></div>`;
    }

    // ── MONSTERS ──────────────────────────────────────────
    if (tab === 'monsters') {
      const editMon = this._admMonEdit ? GAME_DATA.monsters[this._admMonEdit] : null;
      if (editMon) {
        const mId = editMon.id;
        const hasCustom = GAME_DATA.monsterArt?.[mId]?.startsWith?.('<img');
        const hasSvg    = GAME_DATA.monsterArt?.[mId] && !hasCustom;
        html += `<div class="adm-section">
          <h3>Edit Monster — <span style="color:var(--accent)">${editMon.name}</span></h3>
          <button class="btn btn-xs" onclick="ui._admMonEdit=null;ui.renderPage('admin')" style="margin-bottom:10px">← Back</button>
          <div class="adm-mon-preview-large">${GAME_DATA.monsterArt?.[mId]||'<div class="adm-mon-no-art-lg">No Art</div>'}</div>

          <div class="adm-section" style="margin-top:10px"><h4>Monster Image</h4>
            <input type="file" id="mon-img-upload" accept="image/png,image/jpeg,image/gif,image/webp" style="display:none" onchange="ui._admUploadMonsterImage('${mId}',this)">
            <div class="adm-btn-grid">
              <button class="btn btn-sm" onclick="document.getElementById('mon-img-upload').click()">📷 Upload Image</button>
              ${hasCustom?`<button class="btn btn-sm btn-danger" onclick="ui._admDeleteMonsterImage('${mId}')">🗑 Remove Custom Image</button>`:''}
              ${hasSvg?'<span class="adm-img-note">Has SVG (upload to override)</span>':''}
            </div>
            <div id="adm-img-status" class="adm-img-status"></div>
            <div class="adm-img-hint">PNG/JPG/GIF/WebP. Auto-resized to 256px. Stored in Firebase RTDB, live for all players.</div>
          </div>

          <div class="adm-section" style="margin-top:10px"><h4>Stats</h4>
          <div class="adm-edit-grid">
            <label>Name</label><input type="text" id="em-name" class="bank-search-input" value="${(editMon.name||'').replace(/"/g,'&quot;')}">
            <label>HP</label><input type="number" id="em-hp" class="bank-search-input" value="${editMon.hp||100}">
            <label>Max Hit</label><input type="number" id="em-maxhit" class="bank-search-input" value="${editMon.maxHit||10}">
            <label>Combat Level</label><input type="number" id="em-cl" class="bank-search-input" value="${editMon.combatLevel||1}">
            <label>Attack Speed (s)</label><input type="number" id="em-spd" class="bank-search-input" value="${editMon.attackSpeed||3}" step="0.1">
            <label>XP per kill</label><input type="number" id="em-xp" class="bank-search-input" value="${editMon.xp||100}">
            <label>Gold Min</label><input type="number" id="em-goldmin" class="bank-search-input" value="${editMon.gold?.min||0}">
            <label>Gold Max</label><input type="number" id="em-goldmax" class="bank-search-input" value="${editMon.gold?.max||0}">
            <label>Style</label><select id="em-style" class="bank-search-input">${['melee','ranged','magic'].map(st=>`<option value="${st}" ${editMon.style===st?'selected':''}>${st}</option>`).join('')}</select>
            <label>Melee Evasion</label><input type="number" id="em-evm" class="bank-search-input" value="${editMon.evasion?.melee||0}">
            <label>Ranged Evasion</label><input type="number" id="em-evr" class="bank-search-input" value="${editMon.evasion?.ranged||0}">
            <label>Magic Evasion</label><input type="number" id="em-evmg" class="bank-search-input" value="${editMon.evasion?.magic||0}">
          </div>
          <div class="adm-btn-grid" style="margin-top:10px">
            <button class="btn btn-sm" onclick="ui._admSaveMonsterEdit('${mId}')">Save Stats</button>
            <button class="btn btn-sm" onclick="game.startCombat(null,'${mId}')">Fight Now</button>
          </div></div>

          <div class="adm-section" style="margin-top:10px"><h4>Drops (${(editMon.drops||[]).length})</h4>
          <div class="adm-drop-list">`;
        for (let i=0;i<(editMon.drops||[]).length;i++) {
          const d=editMon.drops[i];
          html+=`<div class="adm-drop-row"><span class="adm-item-id" style="min-width:140px">${d.item}</span><span>x${d.qty}</span><span>${(d.chance*100).toFixed(2)}%</span><button class="btn btn-xs" onclick="ui._admEditDrop('${mId}',${i})">Edit</button><button class="btn btn-xs btn-danger" onclick="if(confirm('Remove?')){GAME_DATA.monsters['${mId}'].drops.splice(${i},1);ui.renderPage('admin')}">✕</button></div>`;
        }
        html+=`</div><h4 style="margin-top:10px">Add Drop</h4>
          <div class="adm-row-flex">
            <input type="text" id="drop-item-id" class="bank-search-input" placeholder="Item ID">
            <input type="number" id="drop-qty" class="bank-search-input" placeholder="Qty" value="1" style="width:60px">
            <input type="number" id="drop-chance" class="bank-search-input" placeholder="Chance 0-1" value="0.05" step="0.005" style="width:100px">
            <button class="btn btn-sm" onclick="ui._admAddDrop('${mId}')">Add</button>
          </div></div>`;
        if (this._admEditDropIdx != null) {
          const di=this._admEditDropIdx, dd=editMon.drops?.[di];
          if (dd) html+=`<div class="adm-modal-overlay"><div class="adm-modal"><h4>Edit Drop #${di} on ${editMon.name}</h4><div class="adm-edit-grid"><label>Item ID</label><input type="text" id="dmod-item" class="bank-search-input" value="${dd.item}"><label>Qty</label><input type="number" id="dmod-qty" class="bank-search-input" value="${dd.qty}"><label>Chance (0-1)</label><input type="number" id="dmod-chance" class="bank-search-input" value="${dd.chance}" step="0.001"></div><div class="adm-btn-grid" style="margin-top:10px"><button class="btn btn-sm" onclick="ui._admSaveDrop('${mId}',${di})">Save</button><button class="btn btn-xs" onclick="ui._admEditDropIdx=null;ui.renderPage('admin')">Cancel</button></div></div></div>`;
        }
      } else {
        html+=`<div class="adm-section"><h3>Monsters (${Object.keys(GAME_DATA.monsters).length})</h3>
          <input type="text" class="bank-search-input" placeholder="Search monsters…" oninput="ui._admMonSearch=this.value;ui.renderPage('admin')" value="${this._admMonSearch||''}" style="margin-bottom:8px">
          <div class="adm-mon-grid">`;
        const ms=(this._admMonSearch||'').toLowerCase();
        for (const m of Object.values(GAME_DATA.monsters).filter(m=>!ms||m.name.toLowerCase().includes(ms)||m.id.toLowerCase().includes(ms))) {
          const hasC=GAME_DATA.monsterArt?.[m.id]?.startsWith?.('<img'), hasS=GAME_DATA.monsterArt?.[m.id]&&!hasC;
          html+=`<div class="adm-mon-card"><div class="adm-mon-thumb">${GAME_DATA.monsterArt?.[m.id]||'<div class="adm-mon-no-art">?</div>'}</div><div class="adm-mon-info"><div class="adm-mon-name">${m.name} <small>${m.id}</small>${hasC?' <span class="adm-badge-img">IMG</span>':hasS?' <span class="adm-badge-svg">SVG</span>':''}</div><div class="adm-mon-stats">HP:${m.hp} Hit:${m.maxHit} Lv:${m.combatLevel} ${m.style}</div></div><div class="adm-mon-actions"><button class="btn btn-xs" onclick="ui._admMonEdit='${m.id}';ui._admEditDropIdx=null;ui.renderPage('admin')">Edit</button><button class="btn btn-xs" onclick="game.startCombat(null,'${m.id}')">Fight</button></div></div>`;
        }
        html+=`</div></div>`;
      }
    }

    // ── QUESTS ────────────────────────────────────────────
    if (tab === 'quests') {
      html+=`<div class="adm-section"><h3>Quests</h3><div class="adm-btn-grid" style="margin-bottom:8px">
        <button class="btn btn-sm" onclick="ui._admCompleteQuests()">Complete All</button>
        <button class="btn btn-sm btn-danger" onclick="if(confirm('Reset all quests?')){game.state.quests={completed:[],active:[]};ui.renderPage('admin')}">Reset All</button>
      </div>`;
      if (GAME_DATA.quests) for (const q of GAME_DATA.quests) {
        const done=s.quests?.completed?.includes(q.id), active=s.quests?.active?.find(a=>a.id===q.id);
        html+=`<div class="adm-quest-row ${done?'adm-q-done':active?'adm-q-active':''}"><span class="adm-q-status">${done?'✓':active?'▶':'○'}</span><span class="adm-q-name">${q.name}</span><span class="adm-q-id">${q.id}</span>${!done?`<button class="btn btn-xs" onclick="if(!game.state.quests.completed.includes('${q.id}'))game.state.quests.completed.push('${q.id}');game.state.quests.active=game.state.quests.active.filter(a=>a.id!=='${q.id}');ui.renderPage('admin')">Complete</button>`:''} ${done?`<button class="btn btn-xs btn-danger" onclick="game.state.quests.completed=game.state.quests.completed.filter(id=>id!=='${q.id}');ui.renderPage('admin')">Uncomplete</button>`:''}</div>`;
      }
      html+=`</div>`;
    }

    // ── STATE ─────────────────────────────────────────────
    if (tab === 'state') {
      html+=`<div class="adm-section"><h3>Inspect / Edit State</h3>
        <div class="adm-row-flex">
          <input type="text" id="adm-state-path" class="bank-search-input" placeholder="Path e.g. skills.attack or combat.playerHp" value="${this._admStatePath||''}">
          <button class="btn btn-sm" onclick="ui._admInspectState()">Inspect</button>
        </div>
        <pre class="adm-state-output" id="adm-state-output">${this._admStateResult||'Enter a path to inspect'}</pre>
        <div class="adm-row-flex" style="margin-top:6px">
          <input type="text" id="adm-state-set-val" class="bank-search-input" placeholder="New value (JSON, e.g. 99 or &quot;string&quot; or true)">
          <button class="btn btn-sm" onclick="ui._admSetStateVal()">Set Value</button>
        </div>
      </div>
      <div class="adm-section"><h3>Save / Export / Reset</h3><div class="adm-btn-grid">
        <button class="btn btn-sm" onclick="game.saveGame();ui.toast({type:'success',text:'Game saved'})">Force Save</button>
        <button class="btn btn-sm" onclick="navigator.clipboard.writeText(JSON.stringify(game.state)).then(()=>ui.toast({type:'success',text:'Save copied to clipboard'}))">Export Save</button>
        <button class="btn btn-sm btn-danger" onclick="if(confirm('RESET ALL PROGRESS?')){localStorage.removeItem('ashfall_save');location.reload()}">Hard Reset</button>
      </div></div>`;
    }

    // ── TOOLS ─────────────────────────────────────────────
    if (tab === 'tools') {
      html+=`<div class="adm-section"><h3>Testing Tools</h3><div class="adm-btn-grid">
        <button class="btn btn-sm" onclick="game.startFightCave()">Start Fight Cave</button>
        <button class="btn btn-sm" onclick="if(game.state.fightCave){game.state.fightCave.currentWave=62;game.state.fightCave.betweenWaves=true;game.state.fightCave.betweenWaveTimer=1;}">Skip to Jad</button>
        <button class="btn btn-sm" onclick="ui._admGiveItem('fire_cape',1)">Give Fire Cape</button>
        <button class="btn btn-sm" onclick="ui._admGiveItem('prayer_potion',20)">20x Prayer Pots</button>
        <button class="btn btn-sm" onclick="ui._admGiveItem('shark',100)">100x Sharks</button>
        <button class="btn btn-sm" onclick="game.state.specEnergy=100">Fill Spec</button>
        <button class="btn btn-sm" onclick="game.unlockAllSpellbooks&&game.unlockAllSpellbooks()">Unlock All Spellbooks</button>
        <button class="btn btn-sm" onclick="loadCustomMonsterImages&&loadCustomMonsterImages().then(()=>ui.toast({type:'success',text:'Monster images refreshed'}))">Refresh Monster Images</button>
      </div></div>
      <div class="adm-section"><h3>Give / Take Custom</h3><div class="adm-row-flex">
        <input type="text" id="adm-give-id" class="bank-search-input" placeholder="Item ID">
        <input type="number" id="adm-give-qty" class="bank-search-input" placeholder="Qty" value="1" style="width:80px">
        <button class="btn btn-sm" onclick="ui._admGiveCustom()">Give</button>
        <button class="btn btn-sm btn-danger" onclick="ui._admTakeCustom()">Take</button>
      </div></div>
      <div class="adm-section"><h3>Custom XP</h3><div class="adm-row-flex">
        <select id="adm-xp-skill" class="bank-search-input" style="width:140px">${Object.keys(s.skills).map(sk=>`<option value="${sk}">${GAME_DATA.skills[sk]?.name||sk}</option>`).join('')}</select>
        <input type="number" id="adm-xp-amt" class="bank-search-input" placeholder="Amount" value="10000" style="width:100px">
        <button class="btn btn-sm" onclick="ui._admGiveCustomXp()">Give XP</button>
        <button class="btn btn-sm btn-danger" onclick="ui._admTakeCustomXp()">Take XP</button>
      </div></div>`;
    }

    html += '</div></div>';
    el.innerHTML = html;
  };

  // ── ITEM METHODS ──────────────────────────────────────
  UI.prototype._admGiveItem    = function(id,qty){game.addItem(id,qty);this.toast({type:'success',text:`+${qty}x ${GAME_DATA.items[id]?.name||id}`});this.renderPage('admin');};
  UI.prototype._admTakeItem    = function(id,qty){const t=Math.min(qty,game.state.bank[id]||0);if(!t){this.toast({type:'warn',text:'None to take'});return;}game.removeItem(id,t);this.toast({type:'info',text:`-${t}x ${GAME_DATA.items[id]?.name||id}`});this.renderPage('admin');};
  UI.prototype._admGiveItemQty = function(id){const q=parseInt(document.getElementById('ei-qty')?.value)||1;this._admGiveItem(id,q);};
  UI.prototype._admTakeItemQty = function(id){const q=parseInt(document.getElementById('ei-qty')?.value)||1;this._admTakeItem(id,q);};
  UI.prototype._admFilterItems = function(val){this._admItemSearch=val;this.renderPage('admin');};
  UI.prototype._admGiveCustom  = function(){const id=document.getElementById('adm-give-id')?.value?.trim(),qty=parseInt(document.getElementById('adm-give-qty')?.value)||1;if(!id)return;if(!GAME_DATA.items[id]){this.toast({type:'warn',text:`"${id}" not found`});return;}this._admGiveItem(id,qty);};
  UI.prototype._admTakeCustom  = function(){const id=document.getElementById('adm-give-id')?.value?.trim(),qty=parseInt(document.getElementById('adm-give-qty')?.value)||1;if(!id)return;if(!GAME_DATA.items[id]){this.toast({type:'warn',text:`"${id}" not found`});return;}this._admTakeItem(id,qty);};
  UI.prototype._admSaveItemEdit = function(id){const item=GAME_DATA.items[id];if(!item)return;const n=document.getElementById('ei-name')?.value?.trim();if(n)item.name=n;const d=document.getElementById('ei-desc')?.value?.trim();if(d)item.desc=d;item.sellPrice=parseInt(document.getElementById('ei-price')?.value)||0;const r=document.getElementById('ei-rarity')?.value;if(r)item.rarity=r;if(item.stats){item.stats.attackBonus=parseInt(document.getElementById('ei-atk')?.value)||0;item.stats.strengthBonus=parseInt(document.getElementById('ei-str')?.value)||0;item.stats.magicBonus=parseInt(document.getElementById('ei-mag')?.value)||0;item.stats.rangedBonus=parseInt(document.getElementById('ei-rng')?.value)||0;item.stats.defenceBonus=parseInt(document.getElementById('ei-def')?.value)||0;}this.toast({type:'success',text:`${item.name} saved (runtime only)`});this.renderPage('admin');};

  // ── SKILL METHODS ─────────────────────────────────────
  UI.prototype._admSetSkillLevel = function(skillId,level){const lv=Math.max(1,Math.min(99,level||1));let xp=0;for(let i=1;i<lv;i++)xp+=Math.floor(i+300*Math.pow(2,i/7));xp=Math.floor(xp/4);game.state.skills[skillId].level=lv;game.state.skills[skillId].xp=xp;this.toast({type:'success',text:`${GAME_DATA.skills[skillId]?.name||skillId} → ${lv}`});this.renderPage('admin');};
  UI.prototype._admTakeXp = function(skillId,amt){const sk=game.state.skills[skillId];if(!sk)return;sk.xp=Math.max(0,sk.xp-amt);let lv=1;for(let i=1;i<=99;i++){let needed=0;for(let j=1;j<i;j++)needed+=Math.floor(j+300*Math.pow(2,j/7));if(sk.xp>=Math.floor(needed/4))lv=i;else break;}sk.level=lv;this.toast({type:'info',text:`-${amt} ${GAME_DATA.skills[skillId]?.name||skillId} XP`});this.renderPage('admin');};
  UI.prototype._admGiveCustomXp = function(){const sk=document.getElementById('adm-xp-skill')?.value,amt=parseInt(document.getElementById('adm-xp-amt')?.value)||0;if(!sk||!amt)return;game.addXp(sk,amt);this.toast({type:'success',text:`+${amt} ${GAME_DATA.skills[sk]?.name||sk} XP`});this.renderPage('admin');};
  UI.prototype._admTakeCustomXp = function(){const sk=document.getElementById('adm-xp-skill')?.value,amt=parseInt(document.getElementById('adm-xp-amt')?.value)||0;if(!sk||!amt)return;this._admTakeXp(sk,amt);};

  // ── MONSTER METHODS ───────────────────────────────────
  UI.prototype._admSaveMonsterEdit = function(mId){const m=GAME_DATA.monsters[mId];if(!m)return;m.name=document.getElementById('em-name')?.value?.trim()||m.name;m.hp=parseInt(document.getElementById('em-hp')?.value)||m.hp;m.maxHit=parseInt(document.getElementById('em-maxhit')?.value)||m.maxHit;m.combatLevel=parseInt(document.getElementById('em-cl')?.value)||m.combatLevel;m.attackSpeed=parseFloat(document.getElementById('em-spd')?.value)||m.attackSpeed;m.xp=parseInt(document.getElementById('em-xp')?.value)||m.xp;m.gold={min:parseInt(document.getElementById('em-goldmin')?.value)||0,max:parseInt(document.getElementById('em-goldmax')?.value)||0};m.style=document.getElementById('em-style')?.value||m.style;m.evasion={melee:parseInt(document.getElementById('em-evm')?.value)||0,ranged:parseInt(document.getElementById('em-evr')?.value)||0,magic:parseInt(document.getElementById('em-evmg')?.value)||0};this.toast({type:'success',text:`${m.name} saved (runtime only)`});this.renderPage('admin');};
  UI.prototype._admAddDrop = function(mId){const m=GAME_DATA.monsters[mId];if(!m)return;const item=document.getElementById('drop-item-id')?.value?.trim(),qty=parseInt(document.getElementById('drop-qty')?.value)||1,chance=parseFloat(document.getElementById('drop-chance')?.value)||0.05;if(!item){this.toast({type:'warn',text:'Enter item ID'});return;}if(!GAME_DATA.items[item]){this.toast({type:'warn',text:`"${item}" not found`});return;}if(!m.drops)m.drops=[];m.drops.push({item,qty,chance:Math.min(1,Math.max(0,chance))});this.toast({type:'success',text:`Added ${item} to ${m.name}`});this.renderPage('admin');};
  UI.prototype._admEditDrop = function(mId,idx){this._admEditDropIdx=idx;this.renderPage('admin');};
  UI.prototype._admSaveDrop = function(mId,idx){const m=GAME_DATA.monsters[mId];if(!m?.drops?.[idx])return;const item=document.getElementById('dmod-item')?.value?.trim(),qty=parseInt(document.getElementById('dmod-qty')?.value)||1,chance=parseFloat(document.getElementById('dmod-chance')?.value)||0;if(!GAME_DATA.items[item]){this.toast({type:'warn',text:`"${item}" not found`});return;}m.drops[idx]={item,qty,chance:Math.min(1,Math.max(0,chance))};this._admEditDropIdx=null;this.toast({type:'success',text:'Drop updated'});this.renderPage('admin');};
  UI.prototype._admUploadMonsterImage = async function(mId,input){const file=input.files?.[0];if(!file)return;const status=document.getElementById('adm-img-status');if(status)status.textContent='Uploading…';const reader=new FileReader();reader.onload=async(e)=>{let dataUrl=e.target.result;if(file.size>200*1024)dataUrl=await this._admResizeImage(dataUrl,256,256);try{await saveMonsterImage(mId,dataUrl);if(status)status.textContent='✓ Uploaded successfully';this.toast({type:'success',text:`${mId} image saved`});setTimeout(()=>this.renderPage('admin'),400);}catch(err){if(status)status.textContent='✗ '+err.message;this.toast({type:'warn',text:'Upload failed: '+err.message});}};reader.readAsDataURL(file);};
  UI.prototype._admResizeImage = function(dataUrl,maxW,maxH){return new Promise(resolve=>{const img=new Image();img.onload=()=>{const canvas=document.createElement('canvas');let w=img.width,h=img.height;if(w>maxW||h>maxH){const s=Math.min(maxW/w,maxH/h);w=Math.floor(w*s);h=Math.floor(h*s);}canvas.width=w;canvas.height=h;canvas.getContext('2d').drawImage(img,0,0,w,h);resolve(canvas.toDataURL('image/png',0.85));};img.src=dataUrl;});};
  UI.prototype._admDeleteMonsterImage = async function(mId){if(!confirm(`Remove custom image for ${mId}?`))return;try{await deleteMonsterImage(mId);this.toast({type:'success',text:'Image removed'});this.renderPage('admin');}catch(e){this.toast({type:'warn',text:'Failed: '+e.message});}};

  // ── GENERAL METHODS ───────────────────────────────────
  UI.prototype._admGiveGold      = function(){const a=parseInt(prompt('Gold amount:','100000'))||0;if(!a)return;game.state.gold+=a;this.toast({type:'success',text:`+${this.fmt(a)} gold`});this.renderPage('admin');};
  UI.prototype._admMaxAll        = function(){for(const sk of Object.keys(game.state.skills)){game.state.skills[sk].level=99;game.state.skills[sk].xp=13034431;}this.toast({type:'success',text:'All skills maxed'});this.renderSidebar();this.renderPage('admin');};
  UI.prototype._admFullHeal      = function(){game.state.combat.playerHp=game.getMaxHp();this.toast({type:'success',text:'Healed'});this.renderPage('admin');};
  UI.prototype._admFillPrayer    = function(){game.state.prayerPoints=99;this.toast({type:'success',text:'Prayer filled'});this.renderPage('admin');};
  UI.prototype._admGiveAllItems  = function(){let c=0;for(const id of Object.keys(GAME_DATA.items)){if(!game.state.bank[id]){game.addItem(id,10);c++;}}this.toast({type:'success',text:`Given ${c} item types`});this.renderPage('admin');};
  UI.prototype._admClearBank     = function(){if(!confirm('Clear entire bank?'))return;game.state.bank={};this.toast({type:'success',text:'Bank cleared'});this.renderPage('admin');};
  UI.prototype._admCompleteQuests= function(){if(!GAME_DATA.quests)return;for(const q of GAME_DATA.quests)if(!game.state.quests.completed.includes(q.id))game.state.quests.completed.push(q.id);game.state.quests.active=[];this.toast({type:'success',text:`${GAME_DATA.quests.length} quests completed`});this.renderPage('admin');};
  UI.prototype._admResetFightCave= function(){Object.assign(game.state.stats,{fightCaveAttempts:0,fightCaveCompletions:0,fightCaveDeaths:0,fightCaveBestWave:0,jadKills:0,jadDeaths:0});this.toast({type:'success',text:'FC stats reset'});this.renderPage('admin');};
  UI.prototype._admBroadcast     = function(){const input=document.getElementById('adm-broadcast'),text=input?.value?.trim();if(!text)return;if(typeof online!=='undefined'&&online.isOnline){online.sendSystemMessage?.(text);this.toast({type:'success',text:'Broadcast sent'});input.value='';}else this.toast({type:'warn',text:'Not online'});};
  UI.prototype._admInspectState  = function(){const path=document.getElementById('adm-state-path')?.value?.trim();if(!path)return;this._admStatePath=path;try{let val=game.state;for(const p of path.split('.'))val=val?.[p];this._admStateResult=typeof val==='object'?JSON.stringify(val,null,2):String(val);}catch(e){this._admStateResult='Error: '+e.message;}this.renderPage('admin');};
  UI.prototype._admSetStateVal   = function(){const path=document.getElementById('adm-state-path')?.value?.trim(),raw=document.getElementById('adm-state-set-val')?.value?.trim();if(!path||!raw)return;try{const parts=path.split('.'),key=parts.pop();let obj=game.state;for(const p of parts)obj=obj[p];obj[key]=JSON.parse(raw);this.toast({type:'success',text:`Set ${path}`});this._admInspectState();}catch(e){this.toast({type:'warn',text:'Error: '+e.message});}};
  UI.prototype._admLoadPlayers   = async function(){if(!online?.isOnline){this.toast({type:'warn',text:'Not online'});return;}try{const snap=await online.firestore.collection('players').orderBy('totalLevel','desc').limit(100).get();this._admPlayerList=[];snap.forEach(doc=>this._admPlayerList.push({uid:doc.id,...doc.data()}));this.toast({type:'success',text:`Loaded ${this._admPlayerList.length} players`});this.renderPage('admin');}catch(e){this.toast({type:'warn',text:'Error: '+e.message});}};
  UI.prototype._admDeletePlayer  = async function(uid,name){if(!confirm(`Delete "${name}"?`))return;const ok=await online.deletePlayerFromLeaderboard?.(uid);if(ok){this.toast({type:'success',text:`Deleted ${name}`});if(this._admPlayerList)this._admPlayerList=this._admPlayerList.filter(p=>p.uid!==uid);this.renderPage('admin');}else this.toast({type:'warn',text:'Failed'});};
  UI.prototype._admDeleteGhosts  = async function(){if(!this._admPlayerList){this.toast({type:'warn',text:'Load players first'});return;}const myUid=online?.user?.uid,myTL=game.getTotalLevel?.()||0;const ghosts=this._admPlayerList.filter(p=>p.uid!==myUid&&p.totalLevel===myTL);if(!ghosts.length){this.toast({type:'info',text:'No ghosts found'});return;}if(!confirm(`Delete ${ghosts.length} ghost(s)?`))return;let del=0;for(const g of ghosts)if(await online.deletePlayerFromLeaderboard?.(g.uid))del++;this._admPlayerList=this._admPlayerList.filter(p=>!ghosts.find(g=>g.uid===p.uid));this.toast({type:'success',text:`Deleted ${del}/${ghosts.length} ghosts`});this.renderPage('admin');};

  console.log('[Ashfall] Admin panel v2.0 loaded.');
}

// Engine helper
if (typeof GameEngine !== 'undefined') {
  GameEngine.prototype.unlockAllSpellbooks = function(){if(!this.state.unlockedSpellbooks)this.state.unlockedSpellbooks={};for(const id of Object.keys(GAME_DATA.spellbooks))this.state.unlockedSpellbooks[id]=true;if(typeof ui!=='undefined'){ui.toast({type:'success',text:'All spellbooks unlocked'});ui.renderPage('admin');}};
}

applyAdminPanel();
window.loadCustomMonsterImages = loadCustomMonsterImages;

// Load custom images after auth
(function waitForAuth(){if(typeof online!=='undefined'&&online.db){loadCustomMonsterImages();}else setTimeout(waitForAuth,1000);})();

// Event delegation
document.addEventListener('click',function(e){const btn=e.target.closest('[data-adm-delete-uid]');if(btn&&typeof ui!=='undefined')ui._admDeletePlayer(btn.getAttribute('data-adm-delete-uid'),btn.getAttribute('data-adm-delete-name')||'?');});

// Hash routing
window.addEventListener('hashchange',function(){if(location.hash==='#admin'&&typeof ui!=='undefined'&&typeof isAdmin==='function'&&isAdmin()){ui.currentPage='admin';ui.renderSidebar();ui.renderPage('admin');}});
window.addEventListener('DOMContentLoaded',function(){setTimeout(function(){if(location.hash==='#admin'&&typeof ui!=='undefined'&&typeof isAdmin==='function'&&isAdmin()){ui.currentPage='admin';ui.renderSidebar();ui.renderPage('admin');}},2000);});

// Sidebar check
(function(){let c=0;const iv=setInterval(function(){if(++c>30){clearInterval(iv);return;}if(typeof isAdmin==='function'&&isAdmin()&&typeof ui!=='undefined'){const sb=document.getElementById('sidebar');if(sb&&!sb.querySelector('[data-page="admin"]'))ui.renderSidebar();clearInterval(iv);}},1000);})();

window.openAdmin=function(){if(typeof isAdmin==='function'&&isAdmin()){ui.currentPage='admin';ui.renderSidebar();ui.renderPage('admin');}else console.warn('[Admin] Access denied.');};

})();
