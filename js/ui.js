// ============================================================
// ASHFALL IDLE - UI v2
// ============================================================

const ICONS = {
  axe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 12l-8.5 8.5a2.12 2.12 0 01-3-3L11 9"/><path d="M15 13L9.6 7.6a2 2 0 010-2.83l.7-.7a2 2 0 012.83 0L18 9.7"/><path d="M15.5 3.5l5 5"/></svg>',
  pickaxe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2.5l5 5-8 8-5-5z"/><path d="M3 21l6-6"/></svg>',
  fish:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.5 12c1-4 4-7 8-7 2 0 4 1 5.5 3-1.5 2-3.5 3-5.5 3 4 0 5.5 1 5.5 3-1.5 2-3.5 3-5.5 3-4 0-7-3-8-7z"/><circle cx="15" cy="10" r="1"/></svg>',
  herb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22V10"/><path d="M6 8c0-4 6-4 6 0"/><path d="M18 8c0-4-6-4-6 0"/></svg>',
  paw:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="9" r="2"/><circle cx="10" cy="5" r="2"/><circle cx="14" cy="5" r="2"/><circle cx="18" cy="9" r="2"/><path d="M8 14c0-3 4-4 4-4s4 1 4 4-2 6-4 6-4-3-4-6z"/></svg>',
  cauldron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="10" rx="8" ry="4"/><path d="M4 10v4c0 2.21 3.58 4 8 4s8-1.79 8-4v-4"/><path d="M8 3v4"/><path d="M12 2v4"/><path d="M16 3v4"/></svg>',
  anvil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 18h16"/><path d="M4 18V14a4 4 0 014-4h12v8"/><path d="M8 10V6a2 2 0 012-2h2"/></svg>',
  bow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 4c0 8-4 14-14 14"/><line x1="18" y1="4" x2="4" y2="18"/><line x1="18" y1="4" x2="22" y2="2"/></svg>',
  ring:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="14" r="6"/><path d="M12 8V2"/><path d="M9 5l3-3 3 3"/></svg>',
  potion:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2h4v4l4 10a4 4 0 01-4 4h-4a4 4 0 01-4-4L10 6V2z"/></svg>',
  sparkle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg>',
  gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 00-.5-2.6l2-1.5-2-3.4-2.4 1a7 7 0 00-4.5-2.6L11 1H9l-.6 1.9A7 7 0 003.9 5.5l-2.4-1-2 3.4 2 1.5A7 7 0 001 12c0 .9.2 1.8.5 2.6l-2 1.5 2 3.4 2.4-1A7 7 0 008.4 21l.6 2h2l.6-2c1.7-.4 3.2-1.3 4.5-2.6l2.4 1 2-3.4-2-1.5c.3-.8.5-1.7.5-2.5z"/></svg>',
  map:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v16"/><path d="M15 6v16"/></svg>',
  sword:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 3.5L21 10l-7 7-7-7z"/><path d="M3 21l4-4"/></svg>',
  fist:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 11V7a2 2 0 014 0v2m0 0V6a2 2 0 014 0v3m0 0V8a2 2 0 014 0v6a8 8 0 01-8 8H9a6 6 0 01-6-6v-2a2 2 0 014 0"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>',
  target:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  wand:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 4l-1 1 4 4 1-1a2.83 2.83 0 00-4-4z"/><path d="M14 5L3 16l4 4 11-11z"/></svg>',
  banner:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3v18l3-3 3 3 3-3 3 3 3-3V3"/><line x1="5" y1="9" x2="20" y2="9"/></svg>',
  seedling:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22v-8"/><path d="M6 10c0-4.4 6-4.4 6 0"/><path d="M18 10c0-4.4-6-4.4-6 0"/></svg>',
  mask:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10c0-6 16-6 16 0l-2 8H6z"/><circle cx="9" cy="11" r="1.5"/><circle cx="15" cy="11" r="1.5"/></svg>',
  scale:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18"/><path d="M3 9l3-6 3 6"/><path d="M15 9l3-6 3 6"/><path d="M3 9c0 2 1.5 3 3 3s3-1 3-3"/><path d="M15 9c0 2 1.5 3 3 3s3-1 3-3"/></svg>',
  crown:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18h18"/><path d="M3 9l4 5 5-7 5 7 4-5v9H3z"/></svg>',
  scroll:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5c0-1 1-2 2-2h11c1 0 2 1 2 2v14c0 1 1 2 2 2H7c-1 0-2-1-2-2"/><line x1="8" y1="8" x2="15" y2="8"/><line x1="8" y1="12" x2="15" y2="12"/></svg>',
  coin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M8 10h8"/><path d="M8 14h8"/></svg>',
  bank:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a4 4 0 00-8 0v2"/></svg>',
  shop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M3 9l1.5-5h15L21 9"/></svg>',
  combat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20L14 10l6 6"/><path d="M14 4l6 6"/><path d="M18 2l4 4"/></svg>',
  dungeon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20h20"/><rect x="4" y="8" width="6" height="12"/><rect x="14" y="8" width="6" height="12"/><path d="M7 4l5-2 5 2"/></svg>',
  trophy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H3V6a2 2 0 012-2h1"/><path d="M18 9h3V6a2 2 0 00-2-2h-1"/><path d="M6 4h12v8a6 6 0 01-12 0V4z"/><path d="M12 18v4"/><path d="M8 22h8"/></svg>',
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
  settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  stats:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>',
  skull:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="10" r="8"/><circle cx="9" cy="9" r="1.5" fill="currentColor"/><circle cx="15" cy="9" r="1.5" fill="currentColor"/><path d="M9 16h6"/><path d="M10 16v4"/><path d="M14 16v4"/></svg>',
  npc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 22c0-4.4 3.6-8 8-8s8 3.6 8 8"/></svg>',
  faction:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 3v18"/><path d="M5 4h12l-2 4 2 4H5"/></svg>',
  worldboss:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3 6 6 1-4.5 4.5 1.5 6.5-6-3-6 3 1.5-6.5L3 9l6-1z"/></svg>',
  alignment:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M2 12h20"/></svg>',
};

function icon(name, size=18) { return `<span class="icon" style="width:${size}px;height:${size}px">${ICONS[name] || ICONS.sparkle}</span>`; }

const NAV = [
  { header:'Online', items:[
    {id:'account',label:'Account',icon:'npc'},
    {id:'character',label:'Character',icon:'shield'},
    {id:'guilds',label:'Guilds',icon:'faction'},
    {id:'friends',label:'Friends',icon:'npc'},
    {id:'inbox',label:'Inbox',icon:'scroll'},
    {id:'chat',label:'Global Chat',icon:'scroll'},
    {id:'pvp_arena',label:'PvP Arena',icon:'combat'},
    {id:'bounty_board',label:'Bounty Board',icon:'coin'},
    {id:'leaderboard',label:'Leaderboard',icon:'trophy'},
  ]},
  { header:'Inventory', items:[
    {id:'bank',label:'Bank',icon:'bank'},
    {id:'shop',label:'Shop',icon:'shop'},
    {id:'bazaar',label:'Ashen Bazaar',icon:'coin'},
    {id:'equipment',label:'Equipment',icon:'shield'},
    {id:'gear_sets',label:'Gear Sets',icon:'shield'},
    {id:'statistics',label:'Statistics',icon:'stats'},
    {id:'settings_page',label:'Settings',icon:'settings'},
  ]},
  { header:'Combat', items:[
    {id:'combat',label:'Combat',icon:'combat'},
    {id:'wilderness',label:'Wilderness',icon:'combat'},
    {id:'dungeons',label:'Dungeons',icon:'dungeon'},
    {id:'world_bosses',label:'World Bosses',icon:'worldboss'},
    {id:'abilities',label:'Abilities',icon:'banner'},
    {id:'prayer',label:'Prayer',icon:'sparkle'},
    {id:'slayer',label:'Slayer',icon:'target'},
    {id:'summoning',label:'Summoning',icon:'sparkle'},
    {id:'spellbooks',label:'Spellbooks',icon:'wand'},
    {id:'necromancy',label:'Necromancy',icon:'skull'},
  ]},
  { header:'Skills', items:[
    {id:'woodcutting',label:'Woodcutting',icon:'axe'},
    {id:'mining',label:'Mining',icon:'pickaxe'},
    {id:'fishing',label:'Fishing',icon:'fish'},
    {id:'foraging',label:'Foraging',icon:'herb'},
    {id:'hunting',label:'Hunting',icon:'paw'},
    {id:'cooking',label:'Cooking',icon:'cauldron'},
    {id:'smithing',label:'Smithing',icon:'anvil'},
    {id:'fletching',label:'Fletching',icon:'bow'},
    {id:'crafting',label:'Crafting',icon:'ring'},
    {id:'alchemy',label:'Alchemy',icon:'potion'},
    {id:'enchanting',label:'Enchanting',icon:'sparkle'},
    {id:'incantation',label:'Incantation',icon:'wand'},
    {id:'farming',label:'Farming',icon:'seedling'},
    {id:'thieving',label:'Thieving',icon:'mask'},
  ]},
  { header:'World', items:[
    {id:'npcs',label:'NPCs',icon:'npc'},
    {id:'quests',label:'Quests',icon:'scroll'},
    {id:'storyline',label:'Storyline',icon:'book'},
    {id:'factions',label:'Factions',icon:'faction'},
    {id:'alignment',label:'Alignment',icon:'alignment'},
    {id:'pets',label:'Pets',icon:'paw'},
    {id:'achievements',label:'Achievements',icon:'trophy'},
    {id:'wiki',label:'Wiki',icon:'book'},
  ]},
];

class UI {
  constructor(engine) { this.engine = engine; this.currentPage = 'woodcutting'; }

  init() {
    this.renderSidebar();
    this.renderTrainingBar();
    this.renderPage(this.currentPage);
    this.bindEvents();
    this.engine.on('tick', () => this.onTick());
    this.engine.on('notification', (n) => this.toast(n));
    this.engine.on('levelup', () => { this.renderSidebar(); this.renderPage(this.currentPage); });
    this.engine.on('skillStart', () => { this.renderTrainingBar(); this.renderPage(this.currentPage); });
    this.engine.on('skillStop', () => { this.renderTrainingBar(); this.renderPage(this.currentPage); });
    this.engine.on('combatStart', () => { this.currentPage = 'combat'; this.renderTrainingBar(); this.renderSidebar(); this.renderPage('combat'); });
    this.engine.on('combatStop', () => { this.renderTrainingBar(); this.renderPage(this.currentPage); });
    this.engine.on('combatHit', (d) => this.showHitSplat(d));
    this.engine.on('xpGain', (d) => this.showXpGain(d));
    this.engine.on('randomEvent', (d) => this.showRandomEvent(d));
    this.engine.on('equipmentChanged', () => { if (this.currentPage === 'equipment' || this.currentPage === 'bank') this.renderPage(this.currentPage); });
    this.engine.on('farmingChanged', () => { if (this.currentPage === 'farming') this.renderPage(this.currentPage); });
    this.engine.on('foodChanged', () => {});
    this.engine.on('questsChanged', () => { if (['quests','npcs'].includes(this.currentPage)) this.renderPage(this.currentPage); });
    this.engine.on('abilitiesChanged', () => { if (this.currentPage === 'abilities') this.renderPage('abilities'); });
    this.engine.on('slayerChanged', () => { if (this.currentPage === 'slayer') this.renderPage('slayer'); });
    this.engine.on('petFound', () => { if (this.currentPage === 'pets') this.renderPage('pets'); });
    this.engine.on('init', () => { this.renderSidebar(); this.renderTrainingBar(); this.renderPage(this.currentPage); });
    // Online events
    if (typeof online !== 'undefined') {
      online.on('notification', (n) => this.toast(n));
      online.on('authChanged', () => { this.renderSidebar(); if (this.currentPage === 'account') this.renderPage('account'); });
      online.on('status', (s) => { if (!s.online) console.log('Offline:', s.reason); });
      online.init();
    }
  }

  renderSidebar() {
    const sb = document.getElementById('sidebar');
    const s = this.engine.state;
    const align = GAME_DATA.alignments[s.alignment];
    const _prof = s.profile || {};
    const _seed = _prof.avatarSeed || (typeof online !== 'undefined' ? online?.displayName : '') || 'Survivor';
    const _avUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(_seed)}&hair=${_prof.hair||'short04'}&skinColor=${_prof.skinColor||'c68642'}&size=32`;
    let html = `<div class="sidebar-header">
      <div class="logo-text">ASHFALL</div>
      <div class="logo-sub">IDLE</div>
    </div>
    <div class="player-info">
      <div class="pi-row"><img src="${_avUrl}" class="player-avatar-mini" alt=""><span style="font-family:Cinzel,serif;color:var(--accent)">${typeof online !== 'undefined' && online.displayName ? online.displayName : 'Survivor'}</span></div>
      <div class="pi-row"><span>Combat Lvl</span><span class="pi-val">${this.engine.getCombatLevel()}</span></div>
      <div class="pi-row"><span>Total Lvl</span><span class="pi-val">${this.engine.getTotalLevel()}</span></div>
      <div class="pi-row"><span>${icon('coin',12)} Gold</span><span class="pi-val gold-val">${this.fmt(s.gold)}</span></div>
      <div class="pi-row"><span>Alignment</span><span class="pi-val align-val">${align.axis}</span></div>
      ${typeof online !== 'undefined' && online.isOnline ? `<div class="pi-row"><span class="online-dot">Online</span><span class="pi-val" style="font-size:11px">${online.displayName || 'Survivor'}</span></div>` : '<div class="pi-row"><span class="offline-dot">Offline</span><span class="pi-val" style="font-size:11px;color:var(--text-dim)">Local Only</span></div>'}
    </div>
    <div class="level-tracker" id="level-tracker">`;
    // Compact skill level grid
    const skillOrder = ['attack','strength','defence','hitpoints','ranged','magic','prayer','slayer','necromancy','woodcutting','mining','fishing','foraging','hunting','cooking','smithing','fletching','crafting','alchemy','enchanting','incantation','farming','thieving','tactics','trading','leadership','diplomacy','summoning'];
    for (const sId of skillOrder) {
      const sk = s.skills[sId];
      if (!sk) continue;
      const data = GAME_DATA.skills[sId];
      if (!data) continue;
      const abbr = data.name.substring(0, 3);
      html += `<div class="lt-skill" id="lt-${sId}" title="${data.name}: Level ${sk.level}"><span class="lt-abbr">${abbr}</span><span class="lt-lvl">${sk.level}</span></div>`;
    }
    html += '</div>';
    for (const sec of NAV) {
      html += `<div class="nav-section"><div class="nav-header">${sec.header}</div>`;
      for (const item of sec.items) {
        const active = this.currentPage === item.id ? ' active' : '';
        let badge = '';
        if (s.skills[item.id]) badge = `<span class="nav-level">${s.skills[item.id].level}</span>`;
        if (item.id === 'quests' && s.quests.active.length > 0) badge = `<span class="nav-level nav-active-count">${s.quests.active.length}</span>`;
        html += `<div class="nav-item${active}" data-page="${item.id}">${icon(item.icon, 16)}<span class="nav-label">${item.label}</span>${badge}</div>`;
      }
      html += '</div>';
    }
    sb.innerHTML = html;
    sb.querySelectorAll('.nav-item').forEach(el => {
      el.addEventListener('click', () => {
        this.currentPage = el.dataset.page;
        this.renderSidebar();
        this.renderPage(this.currentPage);
      });
    });
  }

  // PERSISTENT TRAINING INDICATOR — shows what's training across ALL pages so the user always knows
  renderTrainingBar() {
    const bar = document.getElementById('training-bar');
    if (!bar) return;
    const s = this.engine.state;
    if (s.combat.active && s.combat.monster) {
      const mon = GAME_DATA.monsters[s.combat.monster] || GAME_DATA.worldBosses.find(b=>b.id===s.combat.monster);
      bar.innerHTML = `<div class="tb-content">
        <span class="tb-label">${icon('combat',14)} Fighting: <strong>${mon?.name||'Monster'}</strong></span>
        <button class="btn btn-sm btn-danger" onclick="game.stopCombat()">Flee</button>
      </div>`;
      bar.style.display = 'block';
      return;
    }
    if (s.activeSkill && s.activeAction) {
      const skill = GAME_DATA.skills[s.activeSkill];
      const action = this.engine._findAction(s.activeSkill, s.activeAction);
      if (skill && action) {
        bar.innerHTML = `<div class="tb-content">
          <span class="tb-label">${icon(skill.icon,14)} Training: <strong>${skill.name}</strong> &mdash; ${action.name}</span>
          <div class="tb-progress"><div class="tb-fill" style="width:0%"></div></div>
          <button class="btn btn-sm btn-danger" onclick="ui.stopAction()">Stop</button>
        </div>`;
        bar.style.display = 'block';
        return;
      }
    }
    bar.innerHTML = `<div class="tb-content tb-idle"><span class="tb-label">${icon('settings',14)} Idle &mdash; choose a skill or fight</span></div>`;
    bar.style.display = 'block';
  }

  renderPage(pageId) {
    // Clean up previous page listeners
    if (typeof online !== 'undefined' && this._lastPage === 'chat' && pageId !== 'chat') {
      online.stopChatListener();
    }
    this._lastPage = pageId;
    const main = document.getElementById('main-content');
    const skill = GAME_DATA.skills[pageId];
    if (skill && (skill.type === 'gathering' || skill.type === 'artisan')) this.renderSkillPage(main, pageId, skill);
    else if (pageId === 'thieving') this.renderThievingPage(main);
    else if (pageId === 'combat') this.renderCombatPage(main);
    else if (pageId === 'wilderness') this.renderWildernessPage(main);
    else if (pageId === 'dungeons') this.renderDungeonsPage(main);
    else if (pageId === 'world_bosses') this.renderWorldBossesPage(main);
    else if (pageId === 'abilities') this.renderAbilitiesPage(main);
    else if (pageId === 'farming') this.renderFarmingPage(main);
    else if (pageId === 'bank') this.renderBankPage(main);
    else if (pageId === 'shop') this.renderShopPage(main);
    else if (pageId === 'equipment') this.renderEquipmentPage(main);
    else if (pageId === 'bazaar') this.renderBazaarPage(main);
    else if (pageId === 'gear_sets') this.renderGearSetsPage(main);
    else if (pageId === 'achievements') this.renderAchievementsPage(main);
    else if (pageId === 'wiki') this.renderWikiPage(main);
    else if (pageId === 'statistics') this.renderStatsPage(main);
    else if (pageId === 'settings_page') this.renderSettingsPage(main);
    else if (pageId === 'npcs') this.renderNPCsPage(main);
    else if (pageId === 'quests') this.renderQuestsPage(main);
    else if (pageId === 'storyline') this.renderStorylinePage(main);
    else if (pageId === 'factions') this.renderFactionsPage(main);
    else if (pageId === 'alignment') this.renderAlignmentPage(main);
    else if (pageId === 'prayer') this.renderPrayerPage(main);
    else if (pageId === 'slayer') this.renderSlayerPage(main);
    else if (pageId === 'pets') this.renderPetsPage(main);
    else if (pageId === 'spellbooks') this.renderSpellbooksPage(main);
    else if (pageId === 'necromancy') this.renderNecromancyPage(main);
    else if (pageId === 'summoning') this.renderSummoningPage(main);
    else if (pageId === 'account') this.renderAccountPage(main);
    else if (pageId === 'character') this.renderCharacterPage(main);
    else if (pageId === 'guilds') this.renderGuildsPage(main);
    else if (pageId === 'friends') this.renderFriendsPage(main);
    else if (pageId === 'inbox') this.renderInboxPage(main);
    else if (pageId === 'chat') this.renderChatPage(main);
    else if (pageId === 'pvp_arena') this.renderPvPPage(main);
    else if (pageId === 'bounty_board') this.renderBountyPage(main);
    else if (pageId === 'leaderboard') this.renderLeaderboardPage(main);
    else main.innerHTML = '<div class="page-empty">Select a page from the sidebar.</div>';
  }

  header(title, ic, desc, sId) {
    const s = this.engine.state;
    let bar = '';
    if (sId && s.skills[sId]) {
      const sk = s.skills[sId];
      const p = this.engine.getXpProgress(sId);
      const next = sk.level >= 99 ? 'MAX' : this.fmt(this.engine.getXpForLevel(sk.level + 1) - sk.xp);
      const toolPct = this.engine.getToolSpeedBonus(sId);
      bar = `<div class="skill-header-bar">
        <div class="sh-level">Level ${sk.level}</div>
        <div class="sh-xp-bar"><div class="sh-xp-fill" style="width:${(p*100).toFixed(1)}%"></div></div>
        <div class="sh-xp-text">${this.fmt(sk.xp)} XP ${sk.level<99?`(${next} to next)`:''}</div>
        ${toolPct > 0 ? `<div class="sh-tool-bonus">Equipped tool: -${toolPct}% time</div>` : ''}
      </div>`;
    }
    // Decorative divider SVG
    const divider = `<svg class="header-divider" viewBox="0 0 400 8" preserveAspectRatio="none"><path d="M0 4 Q100 0 200 4 Q300 8 400 4" stroke="rgba(201,135,62,0.3)" stroke-width="1" fill="none"/></svg>`;
    return `<div class="page-header skill-header"><div class="ph-icon">${icon(ic,32)}</div><div class="ph-info"><h1>${title}</h1><p>${desc}</p></div></div>${bar}${divider}`;
  }

  renderSkillPage(el, sId, skill) {
    const s = this.engine.state;
    const actions = skill.type === 'gathering' ? (GAME_DATA.gatheringActions[sId]||[]) : (GAME_DATA.recipes[sId]||[]);
    let html = this.header(skill.name, skill.icon, skill.desc, sId);
    if (s.activeSkill === sId && s.activeAction) {
      const action = actions.find(a => a.id === s.activeAction);
      if (action) {
        const masteryRed = 1 + (this.engine.getMasteryLevel(sId, action.masteryId||action.id) * 0.005);
        const toolRed = 1 + (this.engine.getToolSpeedBonus(sId) / 100);
        const t = action.time / masteryRed / toolRed;
        const p = Math.min(1, s.actionProgress / t);
        const toolPct = this.engine.getToolSpeedBonus(sId);
        html += `<div class="active-action-bar">
          <div class="aa-label">Training: ${action.name} ${toolPct>0?`<span class="tool-bonus">(-${toolPct}% tool)</span>`:''}</div>
          <div class="aa-progress"><div class="aa-fill" style="width:${(p*100).toFixed(0)}%"></div></div>
          <button class="btn btn-danger btn-sm" onclick="ui.stopAction()">Stop</button>
        </div>`;
      }
    }
    // Determine categories
    const categories = [];
    const catMap = {};
    for (const action of actions) {
      const cat = action.category || 'All';
      if (!catMap[cat]) { catMap[cat] = []; categories.push(cat); }
      catMap[cat].push(action);
    }
    const hasCategories = categories.length > 1;

    // Category filter tabs
    if (hasCategories) {
      html += `<div class="skill-cat-tabs" id="skill-tabs">
        <button class="cat-tab cat-active" onclick="ui.filterSkillCat('all',this)">All (${actions.length})</button>`;
      for (const cat of categories) {
        html += `<button class="cat-tab" onclick="ui.filterSkillCat('${cat.replace(/'/g,"\\'")}',this)">${cat} (${catMap[cat].length})</button>`;
      }
      html += '</div>';
    }

    const toolPct = this.engine.getToolSpeedBonus(sId);

    // Render by category
    for (const cat of categories) {
      if (hasCategories) {
        html += `<div class="skill-cat-section" data-cat="${cat}"><h3 class="cat-header">${cat}</h3><div class="actions-grid">`;
      } else {
        html += '<div class="actions-grid">';
      }
      for (const action of catMap[cat]) {
        const locked = s.skills[sId].level < action.level;
        const isActive = s.activeSkill === sId && s.activeAction === action.id;
        const m = this.engine.getMasteryLevel(sId, action.masteryId||action.id);
        let inputHtml = '';
        if (action.input) {
          inputHtml = '<div class="recipe-inputs">' + action.input.map(inp => {
            const it = GAME_DATA.items[inp.item];
            const have = s.bank[inp.item] || 0;
            return `<span class="recipe-mat ${have>=inp.qty?'':'mat-missing'}" data-mat="${inp.item}" data-need="${inp.qty}">${it?.name||inp.item} x${inp.qty} <small data-item-qty="${inp.item}">(${have})</small></span>`;
          }).join('') + '</div>';
        }
        let outputHtml = '';
        if (action.output) {
          const o = GAME_DATA.items[action.output.item];
          outputHtml = `<div class="recipe-output">${o?.name||action.output.item}${action.output.qty>1?' x'+action.output.qty:''} <small data-item-qty="${action.output.item}">(${s.bank[action.output.item]||0})</small></div>`;
        }
        if (action.loot) {
          outputHtml = `<div class="recipe-output">${action.loot.map(l=>{const i=GAME_DATA.items[l.item]; return `${(i?.name||l.item)}${l.qty>1?' x'+l.qty:''} <small data-item-qty="${l.item}">(${s.bank[l.item]||0})</small>`;}).join(', ')}</div>`;
        }
        html += `<div class="action-card ${locked?'locked':''} ${isActive?'active':''}" ${locked?'':`onclick="ui.startAction('${sId}','${action.id}')"`}>
          <div class="ac-header"><span class="ac-name">${action.name}</span><span class="ac-level">Lv ${action.level}</span></div>
          ${action.altarName ? `<div class="altar-info"><span class="altar-name">${action.altarName}</span>${action.altarDesc ? `<span class="altar-desc">${action.altarDesc}</span>`:''}</div>` : ''}
          ${inputHtml}${outputHtml}
          <div class="ac-footer">
            <span class="ac-xp">+${action.xp} XP</span>
            <span class="ac-time">${toolPct>0?(action.time*(1-toolPct/100)).toFixed(1)+'s':action.time+'s'}</span>
            ${m>0?`<span class="ac-mastery">M:${m}</span>`:''}
          </div>
          ${locked?`<div class="locked-overlay">Requires Level ${action.level}</div>`:''}
        </div>`;
      }
      html += '</div>';
      if (hasCategories) html += '</div>';
    }

    // Fishing Zones (zone-based random catch pools)
    if (sId === 'fishing' && GAME_DATA.fishingZones) {
      html += '<h2 class="section-title">Fishing Zones</h2><p style="font-size:12px;color:var(--text-dim);margin-bottom:10px">Each zone has a pool of fish. You catch different fish each time based on weighted rarity. XP varies per catch.</p><div class="actions-grid">';
      for (const zone of GAME_DATA.fishingZones) {
        const locked = s.skills.fishing.level < zone.level;
        const isActive = s.activeSkill === 'fishing' && s.activeAction === 'zone_' + zone.id;
        html += `<div class="action-card ${locked?'locked':''} ${isActive?'active':''}" ${locked?'':`onclick="ui.startAction('fishing','zone_${zone.id}')"`}>
          <div class="ac-header"><span class="ac-name">${zone.name}</span><span class="ac-level">Lv ${zone.level}</span></div>
          <p class="area-desc">${zone.desc}</p>
          <div class="fz-pool">`;
        const totalW = zone.fish.reduce((s,x)=>s+x.weight,0);
        for (const f of zone.fish) {
          const pct = (f.weight / totalW * 100).toFixed(0);
          const item = GAME_DATA.items[f.item];
          html += `<span class="fz-fish" title="${pct}% chance, ${f.xp} XP">${item?.name||f.item} <small>${pct}% ${f.xp}xp</small></span>`;
        }
        html += `</div>
          <div class="ac-footer"><span class="ac-time">${zone.time}s</span></div>
          ${locked?`<div class="locked-overlay">Level ${zone.level}</div>`:''}
        </div>`;
      }
      html += '</div>';
    }

    el.innerHTML = html;
  }

  renderThievingPage(el) {
    const s = this.engine.state;
    let html = this.header('Thieving','mask','Pickpocket NPCs and steal from market stalls for gold, items, and XP.','thieving');
    if (s.activeSkill === 'thieving' && s.activeAction) {
      const a = GAME_DATA.thievingTargets.find(x=>x.id===s.activeAction);
      if (a) {
        const p = Math.min(1, Math.max(0, s.actionProgress / a.time));
        html += `<div class="active-action-bar">
          <div class="aa-label">${a.isStall?'Stealing from':'Pickpocketing'}: ${a.name}</div>
          <div class="aa-progress"><div class="aa-fill" style="width:${(p*100).toFixed(0)}%"></div></div>
          <button class="btn btn-danger btn-sm" onclick="ui.stopAction()">Stop</button>
        </div>`;
      }
    }
    // Split into pickpockets and stalls
    const pickpockets = GAME_DATA.thievingTargets.filter(t => !t.isStall);
    const stalls = GAME_DATA.thievingTargets.filter(t => t.isStall);

    html += '<h2 class="section-title">Pickpocket Targets</h2><div class="actions-grid">';
    for (const t of pickpockets) {
      const locked = s.skills.thieving.level < t.level;
      const isActive = s.activeSkill === 'thieving' && s.activeAction === t.id;
      html += `<div class="action-card ${locked?'locked':''} ${isActive?'active':''}" ${locked?'':`onclick="ui.startAction('thieving','${t.id}')"`}>
        <div class="ac-header"><span class="ac-name">${t.name}</span><span class="ac-level">Lv ${t.level}</span></div>
        <div class="thiev-stats">
          <span>Gold: ${t.gold.min}-${t.gold.max}</span>
          <span>Stun: ${(t.stunChance*100).toFixed(0)}% (${t.stunTime}s)</span>
        </div>
        <div class="thiev-loot">`;
      for (const l of (t.loot||[])) {
        const item = GAME_DATA.items[l.item];
        html += `<span class="thiev-drop" title="${(l.chance*100).toFixed(1)}% chance">${item?.name||l.item} x${l.qty} <small>(${(l.chance*100).toFixed(0)}%)</small></span>`;
      }
      html += `</div>
        <div class="ac-footer"><span class="ac-xp">+${t.xp} XP</span><span class="ac-time">${t.time}s</span></div>
        ${locked?`<div class="locked-overlay">Level ${t.level}</div>`:''}
      </div>`;
    }
    html += '</div>';

    html += '<h2 class="section-title">Market Stalls</h2><div class="actions-grid">';
    for (const t of stalls) {
      const locked = s.skills.thieving.level < t.level;
      const isActive = s.activeSkill === 'thieving' && s.activeAction === t.id;
      html += `<div class="action-card ${locked?'locked':''} ${isActive?'active':''}" ${locked?'':`onclick="ui.startAction('thieving','${t.id}')"`}>
        <div class="ac-header"><span class="ac-name">${t.name}</span><span class="ac-level">Lv ${t.level}</span></div>
        <div class="thiev-loot">`;
      for (const l of (t.loot||[])) {
        const item = GAME_DATA.items[l.item];
        html += `<span class="thiev-drop">${item?.name||l.item} x${l.qty} <small>(${(l.chance*100).toFixed(0)}%)</small></span>`;
      }
      html += `</div>
        <div class="ac-footer"><span class="ac-xp">+${t.xp} XP</span><span class="ac-time">${t.time}s</span><span>Stun: ${(t.stunChance*100).toFixed(0)}%</span></div>
        ${locked?`<div class="locked-overlay">Level ${t.level}</div>`:''}
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  renderCombatPage(el) {
    const s = this.engine.state, c = s.combat;
    const xpMode = c.xpMode || 'controlled';
    // Determine which skills get XP based on style + mode
    let xpSkills = {};
    if (c.combatStyle === 'melee') {
      if (xpMode==='accurate')   xpSkills = {attack:90,defence:10};
      else if (xpMode==='aggressive') xpSkills = {strength:90,defence:10};
      else if (xpMode==='defensive')  xpSkills = {defence:90,attack:10};
      else xpSkills = {attack:33,strength:33,defence:34};
    } else if (c.combatStyle === 'ranged') {
      if (xpMode==='accurate')   xpSkills = {ranged:90,defence:10};
      else if (xpMode==='rapid') xpSkills = {ranged:100};
      else xpSkills = {ranged:50,defence:50};
    } else xpSkills = {magic:80,defence:20};
    xpSkills.hitpoints = 33; // always

    let html = `<div class="combat-page">`;
    // ── XP TRACKER with highlighted active skills ──
    html += '<div class="combat-xp-panel" id="combat-xp-panel">';
    const _cSkills = ['attack','strength','defence','hitpoints','ranged','magic','prayer','slayer'];
    for (const _sId of _cSkills) {
      const _sk = s.skills[_sId]; if (!_sk) continue;
      const _p = this.engine.getXpProgress(_sId);
      const _name = GAME_DATA.skills[_sId]?.name || _sId;
      const isGaining = xpSkills[_sId] > 0;
      const pct = xpSkills[_sId] || 0;
      html += `<div class="cxp-row ${isGaining?'cxp-active':''}" title="${_name}: Level ${_sk.level} | ${this.fmt(_sk.xp)} XP${isGaining?' | Getting '+pct+'% XP':''}">
        <span class="cxp-icon">${icon(GAME_DATA.skills[_sId]?.icon||'sparkle',14)}</span>
        <span class="cxp-name">${_name}</span>
        <span class="cxp-level" id="cxp-lv-${_sId}">${_sk.level}</span>
        <div class="cxp-bar"><div class="cxp-fill ${isGaining?'cxp-fill-active':''}" id="cxp-fill-${_sId}" style="width:${(_p*100).toFixed(1)}%"></div></div>
        <span class="cxp-xp" id="cxp-xp-${_sId}">${this.fmt(_sk.xp)}</span>
        <span class="cxp-pct">${isGaining?pct+'%':''}</span>
      </div>`;
    }
    html += '</div>';

    // ── CONTROLS ROW ──
    html += '<div class="combat-controls">';
    // Style
    html += '<div class="cc-group"><div class="cc-label">Combat Style</div><div class="cc-btns">';
    for (const [id,label,ic] of [['melee','Melee','sword'],['ranged','Ranged','target'],['magic','Magic','wand']]) {
      html += `<button class="cc-btn ${c.combatStyle===id?'cc-btn-active':''}" onclick="ui.setStyle('${id}')">${icon(ic,14)} ${label}</button>`;
    }
    html += '</div></div>';
    // XP Mode
    html += '<div class="cc-group"><div class="cc-label">XP Mode</div><div class="cc-btns">';
    if (c.combatStyle === 'melee') {
      for (const [id,label,desc] of [['accurate','Attack','90% Atk XP'],['aggressive','Strength','90% Str XP'],['defensive','Defence','90% Def XP'],['controlled','Shared','Equal split']]) {
        html += `<button class="cc-btn ${xpMode===id?'cc-btn-active':''}" onclick="ui.setXpMode('${id}')" title="${desc}">${label}</button>`;
      }
    } else if (c.combatStyle === 'ranged') {
      for (const [id,label,desc] of [['accurate','Accurate','90% Rng + Def'],['rapid','Rapid','100% Ranged'],['longrange','Longrange','50/50 Rng+Def']]) {
        html += `<button class="cc-btn ${xpMode===id?'cc-btn-active':''}" onclick="ui.setXpMode('${id}')" title="${desc}">${label}</button>`;
      }
    } else {
      html += '<span class="cc-info">80% Magic / 20% Defence</span>';
    }
    html += '</div></div>';
    html += '</div>';

    // ── SPELL SELECT (magic only) ──
    if (c.combatStyle === 'magic') {
      const bookName = GAME_DATA.spellbooks[s.activeSpellbook||'standard']?.name || 'Standard';
      html += `<div class="combat-section"><div class="cs-header">${icon('wand',14)} ${bookName} Spellbook</div><div class="spell-grid">`;
      const spells = this.engine.getSpellsForActiveBook();
      for (const sp of spells) {
        const locked = s.skills.magic.level < sp.level;
        const active = c.selectedSpell === sp.id;
        html += `<button class="spell-card ${active?'spell-active':''} ${locked?'locked':''}" ${locked?'disabled':''} onclick="ui.selectSpell('${sp.id}')" title="${sp.desc}">
          <div class="sc-name">${sp.name}</div>
          <div class="sc-info">Lv${sp.level} | Hit: ${sp.maxHit}</div>
        </button>`;
      }
      html += '</div></div>';
    }

    // ── PRAYER BAR ──
    html += `<div class="combat-section prayer-section"><div class="cs-header">${icon('sparkle',14)} Prayers <span class="prayer-pts" id="pp-live">${s.prayerPoints} pts</span> <span class="prayer-slots">${s.activePrayers.length}/2</span></div><div class="prayer-grid">`;
    for (const p of GAME_DATA.prayers) {
      if (s.skills.prayer.level < p.level) continue;
      const active = s.activePrayers.includes(p.id);
      html += `<button class="prayer-btn ${active?'prayer-active':''}" onclick="game.activatePrayer('${p.id}');ui.renderPage('combat')" title="${p.desc} (${p.pointCost} pts/atk)">
        <div class="pc-name">${p.name}</div>
        <div class="pc-cost">${p.pointCost}pp</div>
      </button>`;
    }
    if (s.skills.prayer.level < 1) html += '<div class="cc-info">Train Prayer to unlock</div>';
    html += '</div></div>';

    // ── RUNE POUCH ──
    const runeTypes = ['air_rune','water_rune','earth_rune','fire_rune','mind_rune','body_rune','chaos_rune','cosmic_rune','nature_rune','law_rune','astral_rune','death_rune','blood_rune','soul_rune','wrath_rune'];
    const ownedRunes = runeTypes.filter(r => (s.bank[r]||0) > 0);
    if (ownedRunes.length > 0 || s.combat.combatStyle === 'magic') {
      html += `<div class="combat-section rune-pouch-section"><div class="cs-header">${icon('wand',14)} Rune Pouch</div><div class="rune-pouch-grid">`;
      for (const rId of runeTypes) {
        const qty = s.bank[rId] || 0;
        if (qty <= 0) continue;
        const item = GAME_DATA.items[rId];
        const color = rId.includes('fire') ? '#d63a1a' : rId.includes('water') ? '#4a7ec4' : rId.includes('earth') ? '#8a6a3a' : rId.includes('air') ? '#c8cad4' : rId.includes('mind') ? '#5ac4c4' : rId.includes('body') ? '#4a7ec4' : rId.includes('chaos') ? '#8a5ec4' : rId.includes('death') ? '#3a3a4a' : rId.includes('blood') ? '#c44040' : rId.includes('soul') ? '#b585e0' : rId.includes('wrath') ? '#ff4040' : rId.includes('cosmic') ? '#8a5ec4' : rId.includes('nature') ? '#3a9e5c' : rId.includes('law') ? '#e8eaf2' : rId.includes('astral') ? '#5ac4c4' : 'var(--text)';
        html += `<div class="rp-rune" title="${item?.name}: ${qty}">
          <svg class="rp-icon" viewBox="0 0 20 20"><polygon points="10,2 18,8 15,18 5,18 2,8" fill="${color}" opacity="0.8"/><text x="10" y="13" text-anchor="middle" fill="#fff" font-size="6" font-weight="bold">${rId[0].toUpperCase()}</text></svg>
          <span class="rp-qty" data-item-qty="${rId}">(${qty})</span>
        </div>`;
      }
      html += '</div></div>';
    }

    // ── FOOD + POTION BELT + EQUIPMENT STATS ──
    html += `<div class="combat-loadout">
      <div class="cl-food">
        <div class="cs-header">${icon('heart',14)} Food Bag</div>
        <div class="food-bag" id="food-bag">`;
    const foodBag = s.foodBag || [];
    if (foodBag.length > 0) {
      for (let i = 0; i < foodBag.length; i++) {
        const slot = foodBag[i];
        const item = GAME_DATA.items[slot.id];
        if (!item) continue;
        html += `<div class="fb-slot" title="${item.name}: Heals ${item.heals||0} HP">
          <span class="fb-name">${item.name}</span>
          <span class="fb-qty" id="fb-qty-${i}">x${slot.qty}</span>
          <span class="fb-heals">+${item.heals||0}hp</span>
        </div>`;
      }
    } else {
      html += '<div class="cc-info">No food. Equip from Bank.</div>';
    }
    html += `</div>
        <div class="cl-food-btns">
          <button class="btn btn-xs" onclick="game.eatFood()">Eat Best</button>
          <label class="auto-eat-label"><input type="checkbox" ${c.autoEat?'checked':''} onchange="ui.toggleAutoEat()"> Auto @ 40%</label>
        </div>
      </div>
      <div class="cl-potions">
        <div class="cs-header">${icon('potion',14)} Potion Belt</div>
        <div class="potion-belt" id="potion-belt">`;
    for (let i = 0; i < 4; i++) {
      const slot = s.potionBelt[i];
      const pot = slot?.id ? GAME_DATA.items[slot.id] : null;
      if (pot) {
        html += `<button class="pb-slot pb-filled" onclick="game.drinkPotionBelt(${i})" title="${pot.name} - Click to drink">
          <span class="pb-name">${pot.name.replace(' Potion','').replace('Super ','S.')}</span>
          <span class="pb-qty" id="pb-qty-${i}">${slot.qty}</span>
        </button>`;
      } else {
        html += `<div class="pb-slot pb-empty">${i+1}</div>`;
      }
    }
    html += `</div></div>
      <div class="cl-stats">
        <div class="cs-header">${icon('shield',14)} Equipment Bonuses</div>
        <div class="cl-stat-chips">`;
    for (const [stat,label] of [['attackBonus','Atk'],['strengthBonus','Str'],['defenceBonus','Def'],['rangedBonus','Rng'],['magicBonus','Mag'],['damageReduction','DR']]) {
      const v = this.engine.getStatTotal(stat);
      html += `<span class="stat-chip ${v>0?'':'stat-zero'}">+${v} ${label}</span>`;
    }
    html += `<span class="stat-chip stat-speed">${this.engine.getPlayerAttackSpeed().toFixed(1)}s spd</span>`;
    html += '</div></div></div>';

    // ── ACTIVE BUFFS DISPLAY ──
    if (c.activeBuffs.length > 0) {
      html += '<div class="active-buffs-bar" id="active-buffs">';
      for (const buff of c.activeBuffs) {
        const label = buff.stat === 'damageMult' ? 'Dmg x'+buff.value.toFixed(1) : buff.stat.replace('Bonus','') + ' +' + buff.value;
        html += `<span class="buff-chip">${label} <small>${Math.ceil(buff.remaining)}s</small></span>`;
      }
      html += '</div>';
    }

    // ── ACTIVE COMBAT ──
    if (c.active && c.monster) {
      const mon = GAME_DATA.monsters[c.monster] || GAME_DATA.worldBosses.find(b=>b.id===c.monster);
      const max = this.engine.getMaxHp();
      const pHpPct = Math.max(0, c.playerHp / max * 100);
      const mHpPct = Math.max(0, c.monsterHp / mon.hp * 100);
      const pHpColor = pHpPct > 50 ? '#4a8a3e' : pHpPct > 25 ? '#c4a83a' : '#c44040';
      const mHpColor = mHpPct > 50 ? '#8a3a3a' : mHpPct > 25 ? '#c4a83a' : '#4a8a3e';

      html += `<div class="combat-arena-v2">
        <div class="ca-side ca-player">
          <div class="ca-name">${typeof online!=='undefined'&&online.displayName?online.displayName:'You'}</div>
          <div class="ca-level">Combat Lv ${this.engine.getCombatLevel()}</div>
          <div class="ca-hp-container">
            <div class="ca-hp-bar"><div class="ca-hp-fill" id="php-bar" style="width:${pHpPct.toFixed(1)}%;background:${pHpColor}"></div></div>
            <div class="ca-hp-text" id="php-text">${Math.max(0,Math.floor(c.playerHp))} / ${max}</div>
          </div>
          <div class="splat-area" id="player-splats"></div>
          ${this.renderStatusEffects(c.statusEffects.player)}
        </div>
        <div class="ca-center">
          <div class="ca-vs-badge">VS</div>
          <div class="ca-kills">Kills: <span id="kill-count">${s.stats.monstersKilled}</span></div>
        </div>
        <div class="ca-side ca-monster">
          ${GAME_DATA.monsterArt?.[c.monster] ? `<div class="monster-art">${GAME_DATA.monsterArt[c.monster]}</div>` : `<div class="monster-art-placeholder">${icon('combat',48)}</div>`}
          <div class="ca-name">${mon.name}</div>
          <div class="ca-level">Level ${mon.combatLevel} | ${mon.style}</div>
          <div class="ca-hp-container">
            <div class="ca-hp-bar ca-hp-monster"><div class="ca-hp-fill" id="mhp-bar" style="width:${mHpPct.toFixed(1)}%;background:${mHpColor}"></div></div>
            <div class="ca-hp-text" id="mhp-text">${Math.max(0,Math.ceil(c.monsterHp))} / ${mon.hp}</div>
          </div>
          <div class="splat-area" id="monster-splats"></div>
          ${this.renderStatusEffects(c.statusEffects.monster)}
        </div>
      </div>`;

      // ── ABILITY BAR ──
      html += '<div class="ability-bar-v2">';
      for (let i = 0; i < 4; i++) {
        const aid = s.equippedAbilities[i];
        const ab = aid ? GAME_DATA.abilities.find(a=>a.id===aid) : null;
        const cd = ab ? (c.abilityCooldowns[aid] || 0) : 0;
        if (ab) {
          const cdPct = cd > 0 ? Math.min(100, (cd / ab.cooldown) * 100) : 0;
          html += `<button class="ab-slot-v2 ${cd>0?'ab-cd':''}" onclick="game.useAbility(${i})" title="${ab.desc}">
            <div class="ab-cd-overlay" style="height:${cdPct}%"></div>
            <div class="ab-content"><div class="ab-name">${ab.name}</div>
            <div class="ab-timer">${cd>0?Math.ceil(cd)+'s':'Ready'}</div></div>
          </button>`;
        } else {
          html += `<div class="ab-slot-v2 ab-empty"><div class="ab-content">Slot ${i+1}</div></div>`;
        }
      }
      html += '</div>';

      if (c.dungeon) {
        const d = GAME_DATA.dungeons.find(x=>x.id===c.dungeon);
        html += `<div class="dungeon-progress-v2"><span>Dungeon: ${d.name}</span><span>Wave ${c.dungeonWave+1} / ${d.waves.length}</span></div>`;
      }
      // Slayer task progress
      if (s.slayerTask && s.slayerTask.monster === c.monster) {
        const pct = Math.min(100, (s.slayerTask.killed / s.slayerTask.amount) * 100);
        html += `<div class="slayer-combat-bar"><span>${icon('target',14)} Slayer: ${s.slayerTask.killed}/${s.slayerTask.amount}</span><div class="cxp-bar" style="flex:1"><div class="cxp-fill cxp-fill-active" style="width:${pct}%"></div></div></div>`;
      }
      html += `<button class="btn btn-danger btn-flee" onclick="game.stopCombat()">${icon('combat',16)} Flee Combat</button>`;
      // Wilderness-specific buttons
      if (c._isWilderness) {
        const fleeChance = Math.min(80, 40 + Math.floor(s.skills.defence.level * 0.3) + Math.floor(s.skills.hitpoints.level * 0.2));
        html += `<div class="wild-combat-btns">
          <button class="btn" onclick="game.attemptFlee()">Flee (${fleeChance}%)</button>
          <button class="btn" onclick="game.castTeleHome()">TeleHome (3 Fire + 5 Air)</button>
        </div>`;
      }

      // ── SPEC BAR ──
      const weapon = GAME_DATA.items[s.equipment.weapon];
      const hasSpec = weapon?.specCost && weapon?.specEffect;
      const specE = s.specEnergy || 0;
      html += `<div class="spec-bar-section">
        <div class="spec-bar-label">Special Attack <span id="spec-pct">${specE}%</span></div>
        <div class="spec-bar">
          <div class="spec-fill" id="spec-fill" style="width:${specE}%"></div>
          <div class="spec-segments">
            <div class="spec-seg" style="left:25%"></div>
            <div class="spec-seg" style="left:50%"></div>
            <div class="spec-seg" style="left:75%"></div>
          </div>
        </div>
        ${hasSpec ? `<button class="btn spec-btn ${specE >= weapon.specCost ? '' : 'btn-disabled'}" onclick="game.useSpecialAttack()" ${specE >= weapon.specCost ? '' : 'disabled'}>
          ${weapon.specEffect.type === 'doubleHit' ? 'Double Hit' : weapon.specEffect.type === 'armorPierce' ? 'Armor Pierce' : weapon.specEffect.type === 'execute' ? 'Execute' : weapon.specEffect.type === 'burnStrike' ? 'Burn Strike' : weapon.specEffect.type === 'doubleShot' ? 'Double Shot' : weapon.specEffect.type === 'energyDrain' ? 'Energy Drain' : weapon.specEffect.type === 'magicShield' ? 'Magic Shield' : weapon.specEffect.type === 'runeRecovery' ? 'Rune Recovery' : 'Special'} (${weapon.specCost}%)
        </button>` : '<div class="spec-no-weapon">No spec weapon equipped</div>'}
      </div>`;
      // Active familiar in combat
      if (s.familiar?.active) {
        const mins = Math.floor(s.familiar.timeLeft / 60);
        html += `<div class="familiar-combat"><span class="fc-name">${s.familiar.name}</span><span class="fc-timer" id="fam-timer">${mins}m</span>`;
        if (s.familiar.buff) {
          for (const [stat,val] of Object.entries(s.familiar.buff)) {
            if (stat === 'healOverTime') html += `<span class="fa-buff">+${val} heal/atk</span>`;
            else if (stat === 'damageMult') html += `<span class="fa-buff">+${((val-1)*100).toFixed(0)}% dmg</span>`;
            else html += `<span class="fa-buff">+${val} ${stat.replace('Bonus','')}</span>`;
          }
        }
        html += '</div>';
      }
    } else {
      // ── AREA SELECT ──
      html += '<h2 class="section-title">Combat Areas</h2><div class="area-grid">';
      for (const area of GAME_DATA.combatAreas) {
        const locked = this.engine.getCombatLevel() < area.levelReq;
        html += `<div class="area-card-v2 ${locked?'area-locked':''}">
          <div class="area-header"><span class="area-name">${area.name}</span><span class="area-req">Cb ${area.levelReq}+</span></div>
          <div class="area-desc">${area.desc}</div>
          <div class="area-monsters-v2">`;
        for (const mId of area.monsters) {
          const m = GAME_DATA.monsters[mId];
          html += `<button class="monster-btn-v2" ${locked?'disabled':''} onclick="game.startCombat('${area.id}','${mId}')">
            ${GAME_DATA.monsterArt?.[mId] ? `<span class="mb-art">${GAME_DATA.monsterArt[mId]}</span>` : ''}
            <span class="mb-name">${m.name}</span>
            <span class="mb-info">Lv${m.combatLevel} | ${m.hp}hp | ${m.style}</span>
          </button>`;
        }
        html += '</div>';
        // Multi-mob encounters for this area
        const multiMobs = (GAME_DATA.multiMobEncounters||[]).filter(e => e.levelReq >= area.levelReq - 10 && e.levelReq <= area.levelReq + 15);
        if (multiMobs.length > 0 && !locked) {
          html += '<div class="multi-mob-section"><div class="mm-label">Multi-Mob Encounters</div>';
          for (const enc of multiMobs) {
            const encLocked = this.engine.getCombatLevel() < enc.levelReq;
            html += `<button class="monster-btn-v2 mm-btn ${encLocked?'locked':''}" ${encLocked?'disabled':''} onclick="game.startMultiMobCombat(${JSON.stringify(enc.mobs).replace(/"/g,'&quot;')})">
              <span class="mb-name mm-name">${enc.name} <small>(${enc.mobs.length} mobs)</small></span>
              <span class="mb-info">${enc.desc}</span>
            </button>`;
          }
          html += '</div>';
        }
        html += '</div>';
      }
      html += '</div>';
    }
    html += '</div>';
    el.innerHTML = html;
  }

  renderStatusEffects(effects) {
    const entries = Object.entries(effects);
    if (entries.length === 0) return '';
    return '<div class="status-bar">' + entries.map(([k,fx]) => {
      const def = GAME_DATA.statusEffects[k];
      return `<span class="status-tag" style="background:${def.color}22;color:${def.color}" title="${def.desc}">${def.name} x${fx.stacks} (${Math.ceil(fx.duration)}s)</span>`;
    }).join('') + '</div>';
  }

  // ── WILDERNESS PAGE ─────────────────────────────────────
  renderWildernessPage(el) {
    const s = this.engine.state;
    const c = s.combat;
    const al = GAME_DATA.alignments[s.alignment];
    const pvpKills = s.stats.pvpKills || 0;
    const pvpDeaths = s.stats.pvpDeaths || 0;
    const pvpStreak = s.stats.pvpStreak || 0;

    let html = `<div class="wild-page">`;
    html += `<div class="wild-header">
      <div class="wild-title">${icon('combat',24)} THE WILDERNESS</div>
      <div class="wild-sub">Dangerous PvP-enabled zones. Other players may attack you at any time.</div>
    </div>`;

    // PvP stats
    html += `<div class="wild-stats">
      <div class="ws-stat"><span class="ws-label">PvP Kills</span><span class="ws-val">${pvpKills}</span></div>
      <div class="ws-stat"><span class="ws-label">PvP Deaths</span><span class="ws-val">${pvpDeaths}</span></div>
      <div class="ws-stat"><span class="ws-label">Streak</span><span class="ws-val ws-streak">${pvpStreak}</span></div>
      <div class="ws-stat"><span class="ws-label">K/D Ratio</span><span class="ws-val">${pvpDeaths>0?(pvpKills/pvpDeaths).toFixed(2):'--'}</span></div>
      <div class="ws-stat"><span class="ws-label">Alignment</span><span class="ws-val">${al.name}</span></div>
    </div>`;

    // Warnings
    html += `<div class="wild-warnings">
      <div class="ww-item ww-danger">PvP kills shift your alignment toward Evil & Chaotic. Evil alignment raises shop prices and reduces quest rewards.</div>
      <div class="ww-item ww-info">Equip a <strong>Ring of Life</strong> or <strong>Phoenix Necklace</strong> to survive death at the cost of 2% total XP.</div>
      <div class="ww-item ww-info">Cast <strong>TeleHome</strong> (3 Fire + 5 Air runes) to escape. Enemies may <strong>TeleBlock</strong> you (35% chance, blocks 10 rounds).</div>
      <div class="ww-item ww-info">In <strong>Duels</strong>, flee is disabled. In <strong>Wilderness</strong>, flee chance is based on your Defence + HP levels.</div>
    </div>`;

    // Active wilderness combat
    if (c.active && c._isWilderness) {
      const mon = GAME_DATA.monsters[c.monster];
      if (mon) {
        html += `<div class="wild-combat-active">
          <div class="wca-title">WILDERNESS COMBAT</div>
          <div class="wca-vs">${mon.name} (Lv ${mon.combatLevel})</div>
          <div class="wca-btns">
            <button class="btn btn-danger" onclick="game.attemptFlee()">Flee (${Math.min(80,40+Math.floor(s.skills.defence.level*0.3))}%)</button>
            <button class="btn" onclick="game.castTeleHome()">TeleHome</button>
            <button class="btn btn-sm" onclick="game.stopCombat()">Surrender</button>
          </div>
        </div>`;
      }
    }

    // Wilderness zones
    html += '<h2 class="section-title">Wilderness Zones</h2><div class="area-grid">';
    for (const zone of (GAME_DATA.wildernessLevels || [])) {
      const cb = this.engine.getCombatLevel();
      const locked = cb < zone.minCb;
      html += `<div class="area-card-v2 wild-zone ${locked?'area-locked':''}">
        <div class="area-header">
          <span class="area-name">${zone.name}</span>
          <span class="area-req wild-pvp-badge">PvP ${(zone.pvpChance*100).toFixed(0)}%</span>
        </div>
        <div class="area-desc">Combat Level ${zone.minCb}-${zone.maxCb}. Higher PvP encounter rate in deeper zones.</div>
        <div class="area-monsters-v2">`;
      for (const mId of zone.monsters) {
        const m = GAME_DATA.monsters[mId];
        if (!m) continue;
        html += `<button class="monster-btn-v2" ${locked?'disabled':''} onclick="game.startWildernessCombat('${zone.id}','${mId}')">
          ${GAME_DATA.monsterArt?.[mId] ? `<span class="mb-art">${GAME_DATA.monsterArt[mId]}</span>` : ''}
          <span class="mb-name">${m.name}</span>
          <span class="mb-info">Lv${m.combatLevel} | ${m.hp}hp</span>
        </button>`;
      }
      html += '</div></div>';
    }
    html += '</div></div>';
    el.innerHTML = html;
  }

  renderDungeonsPage(el) {
    let html = this.header('Dungeons','dungeon','Multi-wave gauntlets with unique rewards.', null);
    html += '<div class="actions-grid">';
    for (const d of GAME_DATA.dungeons) {
      const locked = this.engine.getCombatLevel() < d.levelReq;
      html += `<div class="action-card ${locked?'locked':''}">
        <div class="ac-header"><span class="ac-name">${d.name}</span><span class="ac-level">Cb Lv ${d.levelReq}</span></div>
        <p class="area-desc">${d.desc}</p>
        <div class="ac-footer"><span>${d.waves.length} waves</span></div>
        <div class="dungeon-rewards">Rewards: ${d.rewards.map(r=>GAME_DATA.items[r.item]?.name||r.item).join(', ')}</div>
        <button class="btn btn-sm" ${locked?'disabled':''} onclick="game.startDungeon('${d.id}')">Enter</button>
        ${locked?`<div class="locked-overlay">Combat Lv ${d.levelReq}</div>`:''}
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  renderWorldBossesPage(el) {
    const s = this.engine.state;
    let html = this.header('World Bosses','worldboss','Massive cooperative-style encounters with unique loot. Long respawn timers.', null);
    html += '<div class="actions-grid">';
    for (const b of GAME_DATA.worldBosses) {
      const last = s.worldBossRespawns[b.id] || 0;
      const left = Math.max(0, (last + b.respawn * 1000) - Date.now());
      const ready = left <= 0;
      const cantFight = this.engine.getCombatLevel() < b.combatLevel - 20;
      html += `<div class="action-card ${cantFight?'locked':''}">
        <div class="ac-header"><span class="ac-name">${b.name}</span><span class="ac-level">Cb Lv ${b.combatLevel}</span></div>
        <p class="area-desc">${b.desc}</p>
        <div class="ac-footer"><span>HP: ${b.hp}</span><span>Max Hit: ${b.maxHit}</span></div>
        <div class="dungeon-rewards">Rewards: ${b.rewards.map(r=>GAME_DATA.items[r.item]?.name||r.item).join(', ')}</div>
        ${ready ? `<button class="btn btn-sm" ${cantFight?'disabled':''} onclick="game.startWorldBoss('${b.id}')">Engage</button>` : `<div class="boss-respawn">Respawns in ${this.fmtTime(Math.ceil(left/1000))}</div>`}
        ${cantFight?`<div class="locked-overlay">Recommended Cb Lv ${b.combatLevel-20}+</div>`:''}
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  renderAbilitiesPage(el) {
    const s = this.engine.state;
    let html = this.header('Abilities','banner','Equip up to 4 active abilities. Train Tactics to unlock more.','tactics');
    html += '<div class="ability-slots-equip">';
    for (let i = 0; i < 4; i++) {
      const aid = s.equippedAbilities[i];
      const ab = aid ? GAME_DATA.abilities.find(a=>a.id===aid) : null;
      html += `<div class="ability-slot-card">
        <div class="es-label">Slot ${i+1}</div>
        ${ab ? `<div class="es-name">${ab.name}</div><button class="btn btn-xs btn-danger" onclick="game.equipAbility(${i},null)">Unequip</button>` : '<div class="es-none">Empty</div>'}
      </div>`;
    }
    html += '</div>';
    html += '<h2 class="section-title">Available Abilities</h2><div class="actions-grid">';
    for (const ab of GAME_DATA.abilities) {
      const locked = s.skills.tactics.level < ab.tacticsReq;
      const equippedSlot = s.equippedAbilities.indexOf(ab.id);
      html += `<div class="action-card ${locked?'locked':''}">
        <div class="ac-header"><span class="ac-name">${ab.name}</span><span class="ac-level">Tac Lv ${ab.tacticsReq}</span></div>
        <p class="area-desc">${ab.desc}</p>
        <div class="ac-footer"><span>CD: ${ab.cooldown}s</span><span>Style: ${ab.style}</span></div>
        ${!locked ? `<div class="shop-btns">
          ${equippedSlot >= 0 ? `<span class="ac-mastery">Equipped slot ${equippedSlot+1}</span>` : ''}
          <button class="btn btn-xs" onclick="game.equipAbility(0,'${ab.id}')">Slot 1</button>
          <button class="btn btn-xs" onclick="game.equipAbility(1,'${ab.id}')">Slot 2</button>
          <button class="btn btn-xs" onclick="game.equipAbility(2,'${ab.id}')">Slot 3</button>
          <button class="btn btn-xs" onclick="game.equipAbility(3,'${ab.id}')">Slot 4</button>
        </div>` : ''}
        ${locked?`<div class="locked-overlay">Requires Tactics ${ab.tacticsReq}</div>`:''}
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  renderFarmingPage(el) {
    const s = this.engine.state;
    let html = this.header('Farming','seedling',GAME_DATA.skills.farming.desc,'farming');
    html += '<div class="farm-plots">';
    for (let i = 0; i < s.farming.plots.length; i++) {
      const plot = s.farming.plots[i];
      let content = '';
      if (plot.seed) {
        const seed = GAME_DATA.items[plot.seed];
        if (plot.ready) content = `<div class="plot-ready">${seed.name.replace(' Seed','')} - READY</div><button class="btn btn-sm btn-success" onclick="game.harvestPlot(${i})">Harvest</button>`;
        else {
          const elapsed = Date.now() - plot.plantedAt;
          const pct = Math.min(100, elapsed / plot.growTime * 100);
          const left = Math.max(0, Math.ceil((plot.growTime - elapsed)/1000));
          content = `<div class="plot-growing">${seed.name.replace(' Seed','')}</div><div class="sh-xp-bar"><div class="sh-xp-fill growing-fill" style="width:${pct.toFixed(1)}%"></div></div><div class="plot-timer">${this.fmtTime(left)}</div>`;
        }
      } else content = `<div class="plot-empty">Empty Plot</div>`;
      html += `<div class="farm-plot">${content}</div>`;
    }
    html += '</div>';
    html += '<h2 class="section-title">Available Seeds</h2><div class="actions-grid">';
    const seeds = Object.entries(GAME_DATA.items).filter(([,v]) => v.type === 'seed');
    for (const [id, seed] of seeds) {
      const qty = s.bank[id] || 0;
      const empty = s.farming.plots.findIndex(p => !p.seed);
      html += `<div class="action-card ${qty<=0?'locked':''}">
        <div class="ac-header"><span class="ac-name">${seed.name}</span><span class="ac-level">x${qty}</span></div>
        <div class="recipe-output">Grows: ${GAME_DATA.items[seed.yield]?.name || seed.yield}</div>
        <div class="ac-footer"><span class="ac-time">${this.fmtTime(seed.growTime)}</span></div>
        <button class="btn btn-sm" ${qty<=0||empty<0?'disabled':''} onclick="game.plantSeed(${empty},'${id}')">Plant</button>
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  renderBankPage(el) {
    const s = this.engine.state;
    const entries = Object.entries(s.bank).filter(([,q])=>q>0).sort((a,b)=>a[0].localeCompare(b[0]));
    let html = this.header('Bank','bank',`${entries.length} unique items stored.`,null);
    html += `<div class="bank-gold" id="bank-gold">${icon('coin',20)} <span id="bank-gold-val">${this.fmt(s.gold)}</span> Gold</div>`;

    // Bank tabs
    const tab = this._bankTab || 'all';
    const tabs = [
      {id:'all',label:'All'},
      {id:'equipment',label:'Equipment'},
      {id:'resources',label:'Resources'},
      {id:'food',label:'Food/Potions'},
      {id:'runes',label:'Runes'},
      {id:'misc',label:'Misc'},
    ];
    html += '<div class="bank-tabs">';
    for (const t of tabs) {
      html += `<button class="bank-tab ${tab===t.id?'active':''}" onclick="ui.setBankTab('${t.id}')">${t.label}</button>`;
    }
    html += '</div>';

    // Filter items by tab
    const filtered = entries.filter(([id]) => {
      const item = GAME_DATA.items[id]; if (!item) return false;
      if (tab === 'all') return true;
      if (tab === 'equipment') return item.type === 'weapon' || item.type === 'armor' || item.type === 'ammo';
      if (tab === 'resources') return item.type === 'resource';
      if (tab === 'food') return item.type === 'food' || item.type === 'potion';
      if (tab === 'runes') return item.subtype === 'rune';
      if (tab === 'misc') return item.type === 'seed' || (item.subtype === 'misc' && item.subtype !== 'rune');
      return true;
    });

    html += '<div class="bank-grid">';
    for (const [id, q] of filtered) {
      const item = GAME_DATA.items[id]; if (!item) continue;
      // Build stat string for tooltips
      let statStr = '';
      if (item.stats) {
        const parts = [];
        for (const [k,v] of Object.entries(item.stats)) {
          if (v) parts.push(`+${v} ${k.replace('Bonus','').replace(/([A-Z])/g,' $1').trim()}`);
        }
        statStr = parts.join(', ');
      }
      if (item.heals) statStr += (statStr?', ':'') + `Heals ${item.heals}`;
      if (item.rangedBonus && item.type === 'ammo') statStr += (statStr?', ':'') + `+${item.rangedBonus} ranged`;
      if (item.levelReq) {
        const reqs = Object.entries(item.levelReq).map(([k,v])=>`${k} ${v}`).join(', ');
        statStr += (statStr?' | ':'') + `Req: ${reqs}`;
      }

      html += `<div class="bank-item" data-rarity="${item.rarity||'common'}" title="${item.desc}${statStr?'\n'+statStr:''}">
        <div class="bi-icon">${window.renderItemSprite ? window.renderItemSprite(id, 32) : ''}</div>
        <div class="bi-name" style="${this.getRarityColor(id)?'color:'+this.getRarityColor(id):''}">${item.name} ${this.getRarityTag(id)}</div>
        ${statStr ? `<div class="bi-stats">${statStr}</div>` : ''}
        <div class="bi-qty" data-bank-qty="${id}">x${this.fmt(q)}</div>
        <div class="bi-actions">
          ${item.slot ? `<button class="btn btn-xs" onclick="game.equipItem('${id}')">Equip</button>` : ''}
          ${item.type==='food'||item.type==='potion' ? `<button class="btn btn-xs" onclick="game.equipFood('${id}')">Eat/Use</button>` : ''}
          ${GAME_DATA.boneValues && GAME_DATA.boneValues[id] ? `<button class="btn btn-xs" onclick="game.buryBones('${id}',${q})">Bury All</button>` : ''}
          ${item.sellPrice>0 ? `<div class="bi-sell-row">
            <button class="btn btn-xs btn-sell" onclick="game.sellItem('${id}',1)">1</button>
            <button class="btn btn-xs btn-sell" onclick="game.sellItem('${id}',5)">5</button>
            <button class="btn btn-xs btn-sell" onclick="game.sellItem('${id}',${Math.min(q,50)})">50</button>
            <button class="btn btn-xs btn-sell" onclick="game.sellItem('${id}',${q})">All</button>
            <input type="number" class="qty-input" min="1" max="${q}" value="1" id="sell-qty-${id}" style="width:45px">
            <button class="btn btn-xs btn-sell" onclick="game.sellItem('${id}',parseInt(document.getElementById('sell-qty-${id}').value)||1)">Sell</button>
            <small class="sell-price">${item.sellPrice}g ea</small>
          </div>` : ''}
        </div>
      </div>`;
    }
    if (filtered.length === 0) html += `<div class="bank-empty">${tab==='all'?'Your bank is empty. Start gathering!':'No items in this category.'}</div>`;
    html += '</div>';
    el.innerHTML = html;
  }

  setBankTab(tab) { this._bankTab = tab; this.renderPage('bank'); }

  renderShopPage(el) {
    const s = this.engine.state;
    let html = this.header('Shop','shop','Buy supplies and equipment.',null);
    html += `<div class="bank-gold">${icon('coin',20)} <span id="shop-gold">${this.fmt(s.gold)}</span> Gold</div>`;
    const cats = [...new Set(GAME_DATA.shop.map(i=>i.category))];
    for (const cat of cats) {
      html += `<h2 class="section-title">${cat[0].toUpperCase()+cat.slice(1)}</h2><div class="actions-grid">`;
      for (let i = 0; i < GAME_DATA.shop.length; i++) {
        const si = GAME_DATA.shop[i]; if (si.category !== cat) continue;
        const item = GAME_DATA.items[si.item]; if (!item) continue;
        const al = GAME_DATA.alignments[s.alignment];
        const discount = al?.bonus?.shopDiscount || 0;
        const price = Math.floor(si.price * (1 - discount/100));
        const can = s.gold >= price;
        const rarCol = this.getRarityColor(si.item);
        html += `<div class="action-card shop-card ${can?'':'locked'}">
          <div class="ac-header"><span class="ac-name" style="${rarCol?'color:'+rarCol:''}">${item.name}</span><span class="ac-level">${price}g${discount>0?' <small>(-'+discount+'%)</small>':''}</span></div>
          ${this.getRarityTag(si.item)}
          <p class="area-desc">${item.desc}</p>
          <div class="shop-btns">
            <button class="btn btn-xs" ${can?'':'disabled'} onclick="game.buyItem(${i},1)">1</button>
            <button class="btn btn-xs" ${s.gold>=price*5?'':'disabled'} onclick="game.buyItem(${i},5)">5</button>
            <button class="btn btn-xs" ${s.gold>=price*10?'':'disabled'} onclick="game.buyItem(${i},10)">10</button>
            <input type="number" class="qty-input" min="1" value="1" id="shop-qty-${i}" style="width:50px">
            <button class="btn btn-xs" onclick="game.buyItem(${i},parseInt(document.getElementById('shop-qty-${i}').value)||1)">Buy</button>
          </div>
        </div>`;
      }
      html += '</div>';
    }
    el.innerHTML = html;
  }

  renderEquipmentPage(el) {
    const s = this.engine.state;
    let html = this.header('Equipment','shield','Manage your gear.',null);
    html += '<div class="equip-grid">';
    for (const slot of GAME_DATA.equipmentSlots) {
      const id = s.equipment[slot];
      const item = id ? GAME_DATA.items[id] : null;
      html += `<div class="equip-slot"><div class="es-label">${slot[0].toUpperCase()+slot.slice(1)}</div><div class="es-item ${item?'':'es-empty'}">
        ${item?`<div class="es-icon">${window.renderItemSprite ? window.renderItemSprite(id, 40) : ''}</div><span class="es-name" style="${this.getRarityColor(id)?'color:'+this.getRarityColor(id):''}">${item.name}</span><button class="btn btn-xs btn-danger" onclick="game.unequipItem('${slot}')">X</button>`:'<span class="es-none">Empty</span>'}
      </div></div>`;
    }
    html += '</div>';
    html += '<h2 class="section-title">Total Stats</h2><div class="stat-summary">';
    for (const stat of ['attackBonus','strengthBonus','defenceBonus','rangedBonus','magicBonus','damageReduction']) {
      const v = this.engine.getStatTotal(stat);
      if (v > 0) html += `<div class="stat-row"><span>${stat.replace('Bonus','').replace(/([A-Z])/g,' $1').trim()}</span><span>+${v}</span></div>`;
    }
    html += '</div>';
    html += '<h2 class="section-title">Food Bag (4 slots)</h2><div class="fb-manage">';
    const foodBag = s.foodBag || [];
    for (let i = 0; i < 4; i++) {
      const slot = foodBag[i];
      const item = slot ? GAME_DATA.items[slot.id] : null;
      html += `<div class="fb-manage-slot">
        ${item ? `<div class="fb-current"><span class="fb-name">${item.name}</span> <span>x${slot.qty}</span> <small>(+${item.heals||0}hp)</small>
          <button class="btn btn-xs btn-danger" onclick="game.removeFromFoodBag(${i});ui.renderPage('equipment')">Remove</button>
        </div>` : '<div class="fb-empty">Empty slot</div>'}
      </div>`;
    }
    html += '</div><p style="font-size:11px;color:var(--text-dim);margin-bottom:14px">Equip food from your Bank. Up to 4 different types, 28 each. Auto-eat uses highest healing food first.</p>';

    // Potion Belt management
    html += '<h2 class="section-title">Potion Belt</h2><div class="pb-manage">';
    for (let i = 0; i < 4; i++) {
      const slot = s.potionBelt[i];
      const pot = slot?.id ? GAME_DATA.items[slot.id] : null;
      html += `<div class="pb-manage-slot">
        <div class="pb-label">Slot ${i+1}</div>
        ${pot ? `<div class="pb-current">${pot.name} x${slot.qty} <button class="btn btn-xs btn-danger" onclick="game.clearPotionBelt(${i});ui.renderPage('equipment')">X</button></div>` : '<div class="pb-current pb-empty-text">Empty</div>'}
        <select class="chat-input-v2 pb-select" onchange="if(this.value)game.equipPotionBelt(${i},this.value);ui.renderPage('equipment')">
          <option value="">-- Load Potion --</option>`;
      for (const [id, qty] of Object.entries(s.bank)) {
        if (qty > 0 && GAME_DATA.items[id]?.type === 'potion') {
          html += `<option value="${id}">${GAME_DATA.items[id].name} (x${qty})</option>`;
        }
      }
      html += '</select></div>';
    }
    html += '</div>';
    el.innerHTML = html;
  }

  // ── ASHEN BAZAAR ───────────────────────────────────────
  renderBazaarPage(el) {
    const isOnline = typeof online !== 'undefined' && online.isOnline;
    let html = this.header('Ashen Bazaar','coin','Trade items with other players. List items for sale, buy from others.',null);

    if (!isOnline || !online.user || online.user.isAnonymous) {
      html += '<div class="bank-empty">Create an account to access the Bazaar. Anonymous users cannot trade.</div>';
      el.innerHTML = html; return;
    }

    // Gold + pending
    html += `<div class="bazaar-header">
      <span class="bz-gold">${icon('coin',16)} <span data-bank-gold>${this.fmt(game.state.gold)}</span> Gold</span>
      <button class="btn btn-sm" onclick="online.collectBazaarGold().then(()=>ui.renderPage('bazaar'))">Collect Pending Sales</button>
    </div>`;

    // Post listing form
    html += `<div class="bazaar-post">
      <h3 class="section-title">Sell an Item</h3>
      <div class="bp-form">
        <select id="bz-item" class="chat-input-v2 bz-select">
          <option value="">-- Select Item --</option>`;
    const bankItems = Object.entries(game.state.bank).filter(([id,q]) => q > 0 && GAME_DATA.items[id]).sort((a,b) => (GAME_DATA.items[a[0]]?.name||'').localeCompare(GAME_DATA.items[b[0]]?.name||''));
    for (const [id, qty] of bankItems) {
      const item = GAME_DATA.items[id];
      const rarCol = this.getRarityColor(id);
      html += `<option value="${id}" style="${rarCol?'color:'+rarCol:''}">${item.name} (x${qty})</option>`;
    }
    html += `</select>
        <input type="number" id="bz-qty" class="qty-input" min="1" value="1" placeholder="Qty" style="width:60px">
        <input type="number" id="bz-price" class="qty-input" min="1" value="100" placeholder="Price/ea" style="width:80px">
        <button class="btn" onclick="ui.postBazaarListing()">List for Sale</button>
      </div>
    </div>`;

    // Search
    html += `<div class="bazaar-search">
      <h3 class="section-title">Browse Listings</h3>
      <div style="display:flex;gap:6px;margin-bottom:10px">
        <input type="text" id="bz-search" class="chat-input-v2" placeholder="Search by item name..." style="flex:1">
        <button class="btn btn-sm" onclick="ui.searchBazaar()">Search</button>
        <button class="btn btn-sm" onclick="ui.loadBazaarAll()">All</button>
        <button class="btn btn-sm" onclick="ui.loadBazaarMine()">My Listings</button>
      </div>
    </div>`;

    html += '<div id="bazaar-listings"><div class="bank-empty">Loading listings...</div></div>';
    el.innerHTML = html;
    // Auto-load all listings on page visit
    this.loadBazaarAll();
  }

  async postBazaarListing() {
    const itemId = document.getElementById('bz-item')?.value;
    const qty = parseInt(document.getElementById('bz-qty')?.value) || 1;
    const price = parseInt(document.getElementById('bz-price')?.value) || 100;
    if (!itemId) { this.toast({type:'warn',text:'Select an item to sell.'}); return; }
    if (qty <= 0) { this.toast({type:'warn',text:'Quantity must be at least 1.'}); return; }
    if (price <= 0) { this.toast({type:'warn',text:'Price must be at least 1.'}); return; }
    const have = game.state.bank[itemId] || 0;
    if (have < qty) { this.toast({type:'warn',text:`You only have ${have}. Cannot list ${qty}.`}); return; }
    await online.postListing(itemId, qty, price);
    this.renderPage('bazaar');
  }

  async loadBazaarAll() {
    const container = document.getElementById('bazaar-listings');
    if (!container) return;
    container.innerHTML = '<div class="bank-empty">Loading...</div>';
    const listings = await online.getBazaarListings();
    this.renderBazaarListings(container, listings);
  }

  async loadBazaarMine() {
    const container = document.getElementById('bazaar-listings');
    if (!container) return;
    container.innerHTML = '<div class="bank-empty">Loading your listings...</div>';
    const all = await online.getBazaarListings();
    const mine = all.filter(l => online.user && l.seller === online.user.uid);
    this.renderBazaarListings(container, mine);
  }

  async searchBazaar() {
    const search = document.getElementById('bz-search')?.value?.trim().toLowerCase();
    if (!search) { this.loadBazaarAll(); return; }
    const container = document.getElementById('bazaar-listings');
    if (!container) return;
    container.innerHTML = '<div class="bank-empty">Searching...</div>';
    const all = await online.getBazaarListings();
    const filtered = all.filter(l => (l.itemName||'').toLowerCase().includes(search) || (l.item||'').toLowerCase().includes(search));
    this.renderBazaarListings(container, filtered);
  }

  renderBazaarListings(container, listings) {
    if (listings.length === 0) {
      container.innerHTML = '<div class="bank-empty">No listings found. Be the first to sell something!</div>';
      return;
    }
    let html = `<div class="bz-table">
      <div class="bz-header"><span>Item</span><span>Qty</span><span>Price/ea</span><span>Total</span><span>Seller</span><span></span></div>`;
    for (const l of listings) {
      const isMe = online.user && l.seller === online.user.uid;
      const item = GAME_DATA.items[l.item];
      const rarCol = item ? (GAME_DATA.rarities?.[item.rarity]?.color || '') : '';
      html += `<div class="bz-row ${isMe?'bz-mine':''}">
        <span class="bz-item" style="${rarCol?'color:'+rarCol:''}">${l.itemName || l.item}${item?.rarity && item.rarity !== 'common' ? ` <small class="rarity-tag" style="color:${rarCol}">${GAME_DATA.rarities[item.rarity]?.name}</small>` : ''}</span>
        <span class="bz-qty">${l.qty}</span>
        <span class="bz-price">${this.fmt(l.priceEach)}g</span>
        <span class="bz-total">${this.fmt(l.totalPrice)}g</span>
        <span class="bz-seller">${this.escHtml(l.sellerName||'Unknown')}</span>
        <span>${isMe ? `<button class="btn btn-xs btn-danger" onclick="online.cancelListing('${l.id}').then(()=>ui.renderPage('bazaar'))">Cancel</button>` : `<button class="btn btn-xs" ${game.state.gold>=l.totalPrice?'':'disabled'} onclick="online.buyListing('${l.id}').then(()=>ui.renderPage('bazaar'))">Buy</button>`}</span>
      </div>`;
    }
    html += '</div>';
    container.innerHTML = html;
  }

  // ── GEAR SETS ──────────────────────────────────────────
  renderGearSetsPage(el) {
    const s = this.engine.state;
    let html = this.header('Gear Sets','shield','Save and swap between equipment presets instantly.',null);

    // Save new set
    html += `<div class="gs-save">
      <input type="text" id="gs-name" class="chat-input-v2" placeholder="Set name (e.g. Melee Boss)" maxlength="20" style="width:200px">
      <button class="btn btn-sm" onclick="game.saveGearSet(document.getElementById('gs-name').value);ui.renderPage('gear_sets')">Save Current Gear</button>
    </div>`;

    // Current gear preview
    html += '<h3 class="section-title">Current Equipment</h3><div class="gs-current">';
    for (const slot of GAME_DATA.equipmentSlots) {
      const id = s.equipment[slot];
      const item = id ? GAME_DATA.items[id] : null;
      html += `<span class="gs-slot ${item?'':'gs-empty'}">${slot}: ${item?item.name:'--'}</span>`;
    }
    html += '</div>';

    // Saved sets
    html += '<h3 class="section-title">Saved Sets</h3>';
    const sets = Object.keys(s.gearSets);
    if (sets.length === 0) {
      html += '<div class="bank-empty">No saved gear sets. Equip your gear and save a set above.</div>';
    } else {
      html += '<div class="gs-list">';
      for (const name of sets) {
        const set = s.gearSets[name];
        const items = Object.entries(set).filter(([_,v])=>v).map(([slot,id])=>{
          const item = GAME_DATA.items[id];
          return item ? `<span class="gs-item">${item.name}</span>` : '';
        }).join('');
        html += `<div class="gs-card">
          <div class="gs-card-header">
            <span class="gs-card-name">${this.escHtml(name)}</span>
            <div class="gs-card-btns">
              <button class="btn btn-xs" onclick="game.loadGearSet('${this.escHtml(name)}');ui.renderPage('gear_sets')">Equip</button>
              <button class="btn btn-xs btn-danger" onclick="game.deleteGearSet('${this.escHtml(name)}');ui.renderPage('gear_sets')">Delete</button>
            </div>
          </div>
          <div class="gs-items">${items || '<span class="gs-empty">Empty set</span>'}</div>
        </div>`;
      }
      html += '</div>';
    }
    el.innerHTML = html;
  }

  renderNPCsPage(el) {
    const s = this.engine.state;
    let html = this.header('NPCs','npc','Visit NPCs to accept quests and earn faction reputation.',null);
    html += '<div class="actions-grid">';
    for (const npc of GAME_DATA.npcs) {
      const fac = npc.faction ? GAME_DATA.factions[npc.faction] : null;
      const tier = fac ? this.engine.getFactionTier(npc.faction) : null;
      const available = GAME_DATA.quests.filter(q => q.npc === npc.id && !s.quests.completed.includes(q.id) && !s.quests.active.includes(q.id) && (!q.prereq || s.quests.completed.includes(q.prereq)));
      const active = GAME_DATA.quests.filter(q => q.npc === npc.id && s.quests.active.includes(q.id));
      const completed = GAME_DATA.quests.filter(q => q.npc === npc.id && s.quests.completed.includes(q.id));
      html += `<div class="npc-card">
        <div class="npc-header">
          <div class="npc-avatar">${GAME_DATA.npcArt?.[npc.id] || icon('npc',32)}</div>
          <div class="npc-info">
            <div class="npc-name">${npc.name}</div>
            <div class="npc-title">${npc.title}</div>
            ${fac?`<div class="npc-faction">${fac.name}${tier?` &mdash; ${tier.title}`:''}</div>`:''}
            <div class="npc-location">${npc.location}</div>
          </div>
        </div>
        <p class="npc-desc">${npc.desc}</p>
        <div class="npc-quests">
          ${available.length>0 ? `<div class="quest-section-label">Available (${available.length})</div>` : ''}
          ${available.map(q => `<div class="quest-mini">
            <div class="qm-name">${q.name}</div>
            <div class="qm-desc">${q.desc}</div>
            <button class="btn btn-xs" onclick="game.acceptQuest('${q.id}')">Accept</button>
          </div>`).join('')}
          ${active.length>0 ? `<div class="quest-section-label">In Progress (${active.length})</div>` : ''}
          ${active.map(q => `<div class="quest-mini in-progress"><div class="qm-name">${q.name}</div><div class="qm-desc">In progress</div></div>`).join('')}
          ${completed.length>0 ? `<div class="quest-section-label">Completed: ${completed.length} of ${GAME_DATA.quests.filter(q=>q.npc===npc.id).length}</div>` : ''}
        </div>
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  // ── STORYLINE PAGE ──────────────────────────────────────
  renderStorylinePage(el) {
    const s = this.engine.state;
    const al = GAME_DATA.alignments[s.alignment];
    const ap = s.alignmentPoints || { moral:0, order:0 };
    let html = this.header('Storyline','book','Follow branching quest chains that shape your destiny and alignment.',null);

    // Alignment display
    html += `<div class="story-alignment">
      <div class="sa-title">Current Alignment: <strong>${al.name}</strong> (${al.axis})</div>
      <div class="sa-desc">${al.desc}</div>
      <div class="sa-meters">
        <div class="sa-meter"><span class="sa-label">Moral</span><div class="sa-bar"><div class="sa-fill-good" style="width:${Math.min(100,Math.max(0,(ap.moral+50)))}%"></div></div><span class="sa-val">${ap.moral > 0 ? '+'+ap.moral+' Good' : ap.moral < 0 ? ap.moral+' Evil' : 'Neutral'}</span></div>
        <div class="sa-meter"><span class="sa-label">Order</span><div class="sa-bar"><div class="sa-fill-order" style="width:${Math.min(100,Math.max(0,(ap.order+50)))}%"></div></div><span class="sa-val">${ap.order > 0 ? '+'+ap.order+' Lawful' : ap.order < 0 ? ap.order+' Chaotic' : 'Neutral'}</span></div>
      </div>
      <div class="sa-hint">Your alignment shifts based on your actions. Killing evil creatures shifts you toward Good. Killing innocents shifts toward Evil. Quest choices also affect alignment.</div>
    </div>`;

    // Storyline chains
    for (const story of (GAME_DATA.storylines || [])) {
      const prog = this.engine.getStoryProgress(story.id);
      const cur = this.engine.getCurrentStoryStep(story.id);
      const canComplete = cur ? this.engine.checkStoryObjective(story.id) : false;

      html += `<div class="story-chain ${prog.completed?'story-done':''}">
        <div class="sc-header">
          <span class="sc-name">${story.name}</span>
          ${prog.completed ? '<span class="sc-badge sc-complete">COMPLETED</span>' : cur ? `<span class="sc-badge sc-active">Chapter ${prog.chapter+1}</span>` : ''}
        </div>
        <div class="sc-desc">${story.desc}</div>`;

      // Show chapters
      for (let ci = 0; ci < story.chapters.length; ci++) {
        const ch = story.chapters[ci];
        const isCurrentChapter = !prog.completed && prog.chapter === ci;
        const isPast = ci < prog.chapter;
        const isFuture = ci > prog.chapter && !prog.completed;

        html += `<div class="sc-chapter ${isPast?'ch-done':''} ${isCurrentChapter?'ch-active':''} ${isFuture?'ch-locked':''}">
          <div class="ch-title">${isPast?'&#x2714; ':''}${ch.name}${isFuture?' (Locked)':''}</div>`;

        if (isCurrentChapter || isPast) {
          for (let si = 0; si < ch.steps.length; si++) {
            const step = ch.steps[si];
            const isCurrentStep = isCurrentChapter && prog.step === si;
            const isPastStep = isPast || (isCurrentChapter && si < prog.step);
            const isFutureStep = isCurrentChapter && si > prog.step;

            if (isFutureStep) continue; // Don't show future steps

            html += `<div class="ch-step ${isPastStep?'step-done':''} ${isCurrentStep?'step-active':''}">
              <div class="step-text">${isPastStep?'<s>':''}${step.text}${isPastStep?'</s>':''}</div>`;

            if (isCurrentStep) {
              const obj = step.objective;
              let objText = '';
              let progress = '';
              if (obj.type === 'kill') {
                const kills = s.stats.uniqueKills?.[obj.monster] || 0;
                objText = `Kill ${obj.qty} ${GAME_DATA.monsters[obj.monster]?.name || obj.monster}`;
                progress = `${Math.min(kills, obj.qty)} / ${obj.qty}`;
              } else if (obj.type === 'collect') {
                const have = s.bank[obj.item] || 0;
                objText = `Collect ${obj.qty} ${GAME_DATA.items[obj.item]?.name || obj.item}`;
                progress = `${Math.min(have, obj.qty)} / ${obj.qty}`;
              } else if (obj.type === 'gold') {
                objText = `Have ${obj.amount} gold`;
                progress = `${Math.min(s.gold, obj.amount)} / ${obj.amount}`;
              } else if (obj.type === 'skill') {
                const lvl = s.skills[obj.skill]?.level || 1;
                objText = `Reach ${GAME_DATA.skills[obj.skill]?.name || obj.skill} level ${obj.level}`;
                progress = `${lvl} / ${obj.level}`;
              }
              html += `<div class="step-objective">
                <span class="so-text">${objText}</span>
                <span class="so-progress">${progress}</span>
              </div>`;
              // Rewards preview
              const rew = step.reward;
              html += '<div class="step-rewards">';
              if (rew.gold) html += `<span class="sr-chip sr-gold">+${rew.gold}g</span>`;
              if (rew.xp) for (const [k,v] of Object.entries(rew.xp)) html += `<span class="sr-chip">+${v} ${k}</span>`;
              if (rew.items) for (const it of rew.items) html += `<span class="sr-chip sr-item">${it.qty}x ${GAME_DATA.items[it.item]?.name||it.item}</span>`;
              if (step.alignShift) html += `<span class="sr-chip sr-align">${step.alignShift.direction} +${step.alignShift.amount}</span>`;
              html += '</div>';

              if (canComplete) {
                html += `<button class="btn" onclick="game.completeStoryStep('${story.id}');ui.renderPage('storyline')">Complete Step</button>`;
              }
            }
            html += '</div>';
          }
        }
        html += '</div>';
      }
      html += '</div>';
    }
    el.innerHTML = html;
  }

  // ── QUESTS PAGE ───────────────────────────────────────
  renderQuestsPage(el) {
    const s = this.engine.state;
    let html = this.header('Quests','scroll',`${s.quests.active.length} active &mdash; ${s.quests.completed.length} completed`,null);
    if (s.quests.active.length === 0) {
      html += '<div class="bank-empty">No active quests. Visit NPCs to find quests.</div>';
    } else {
      html += '<h2 class="section-title">Active Quests</h2><div class="actions-grid">';
      for (const qId of s.quests.active) {
        const q = GAME_DATA.quests.find(x=>x.id===qId); if (!q) continue;
        const npc = GAME_DATA.npcs.find(n=>n.id===q.npc);
        const prog = s.quests.progress[qId] || [];
        html += `<div class="action-card quest-card">
          <div class="ac-header"><span class="ac-name">${q.name}</span><span class="ac-level">${npc?.name||''}</span></div>
          <p class="area-desc">${q.desc}</p>
          <div class="quest-objectives">
            ${q.objectives.map((obj, i) => {
              const done = prog[i] || 0;
              const pct = Math.min(100, done / obj.qty * 100);
              let label = '';
              if (obj.type === 'kill') label = `Kill ${GAME_DATA.monsters[obj.monster]?.name||obj.monster}: ${done}/${obj.qty}`;
              else if (obj.type === 'gather') label = `Gather ${GAME_DATA.items[obj.item]?.name||obj.item}: ${done}/${obj.qty}`;
              else if (obj.type === 'craft') label = `Craft ${GAME_DATA.items[obj.item]?.name||obj.item}: ${done}/${obj.qty}`;
              else if (obj.type === 'thieve') label = `Pickpocket: ${done}/${obj.qty}`;
              else if (obj.type === 'gold') label = `Hold ${this.fmt(obj.qty)} gold: ${this.fmt(Math.min(s.gold,obj.qty))}/${this.fmt(obj.qty)}`;
              return `<div class="qo-row"><div class="qo-label">${label}</div><div class="sh-xp-bar"><div class="sh-xp-fill" style="width:${pct}%"></div></div></div>`;
            }).join('')}
          </div>
          <div class="quest-rewards">
            Rewards: ${q.rewards.gold?`${q.rewards.gold} gold`:''}${q.rewards.items?', '+q.rewards.items.map(i=>GAME_DATA.items[i.item]?.name).join(', '):''}
          </div>
          <button class="btn btn-xs btn-danger" onclick="game.abandonQuest('${qId}')">Abandon</button>
        </div>`;
      }
      html += '</div>';
    }
    if (s.quests.completed.length > 0) {
      html += '<h2 class="section-title">Completed</h2><div class="stats-grid">';
      for (const qId of s.quests.completed) {
        const q = GAME_DATA.quests.find(x=>x.id===qId); if (!q) continue;
        html += `<div class="stat-card"><div class="stat-label">${q.name}</div><div class="stat-value" style="font-size:11px">Completed</div></div>`;
      }
      html += '</div>';
    }
    el.innerHTML = html;
  }

  renderFactionsPage(el) {
    const s = this.engine.state;
    let html = this.header('Factions','faction','Earn reputation with factions to unlock perks and exclusive items.',null);
    html += '<div class="actions-grid">';
    for (const fac of Object.values(GAME_DATA.factions)) {
      const rep = s.reputation[fac.id] || 0;
      const tier = this.engine.getFactionTier(fac.id);
      const idx = fac.tiers.indexOf(tier);
      const next = fac.tiers[idx + 1];
      const pct = next ? Math.min(100, ((rep - tier.rep) / (next.rep - tier.rep)) * 100) : 100;
      html += `<div class="action-card">
        <div class="ac-header"><span class="ac-name">${fac.name}</span><span class="ac-level">${tier.title}</span></div>
        <p class="area-desc">${fac.desc}</p>
        <div class="rep-bar"><div class="rep-fill" style="width:${pct}%"></div></div>
        <div class="ac-footer"><span>Rep: ${this.fmt(rep)}</span>${next?`<span>Next: ${this.fmt(next.rep)}</span>`:'<span>MAX</span>'}</div>
        <div class="faction-perk">Current Perk: ${tier.perk}</div>
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  renderAlignmentPage(el) {
    const s = this.engine.state;
    const align = GAME_DATA.alignments[s.alignment];
    let html = this.header('Alignment','alignment','Your moral compass shifts based on your actions and grants unique bonuses.',null);
    html += `<div class="alignment-display">
      <div class="al-current">Current: <strong>${align.name}</strong> (${align.axis})</div>
      <div class="al-desc">${align.desc}</div>
      <div class="al-points">
        <div>Good ${s.alignmentPoints.good.toFixed(0)} &middot; Evil ${s.alignmentPoints.evil.toFixed(0)}</div>
        <div>Lawful ${s.alignmentPoints.lawful.toFixed(0)} &middot; Chaotic ${s.alignmentPoints.chaotic.toFixed(0)}</div>
      </div>
    </div>`;
    html += '<h2 class="section-title">Alignment Grid</h2><div class="alignment-grid">';
    const grid = [['lawful_good','neutral_good','chaotic_good'],['lawful_neutral','true_neutral','chaotic_neutral'],['lawful_evil','neutral_evil','chaotic_evil']];
    for (const row of grid) {
      for (const id of row) {
        const a = GAME_DATA.alignments[id];
        const cur = s.alignment === id;
        html += `<div class="align-cell ${cur?'current':''}">
          <div class="al-axis">${a.axis}</div>
          <div class="al-name">${a.name}</div>
          <div class="al-bonus">${a.desc}</div>
        </div>`;
      }
    }
    html += '</div>';
    html += '<p class="muted">Killing evil creatures shifts you toward Good. Killing innocents shifts you toward Evil. Lawful and Chaotic are influenced by your actions over time.</p>';
    el.innerHTML = html;
  }

  renderAchievementsPage(el) {
    const s = this.engine.state;
    let html = this.header('Achievements','trophy',`${s.achievements.length} / ${GAME_DATA.achievements.length} completed.`,null);
    html += '<div class="actions-grid">';
    for (const a of GAME_DATA.achievements) {
      const done = s.achievements.includes(a.id);
      html += `<div class="action-card achievement-card ${done?'ach-done':''}">
        <div class="ac-header"><span class="ac-name">${a.name}</span>${done?'<span class="ach-check">Done</span>':''}</div>
        <p class="area-desc">${a.desc}</p>
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  renderWikiPage(el) {
    let html = this.header('Wiki','book','Complete encyclopedia of Ashfall Idle.',null);
    html += '<p style="margin-bottom:16px">For the full standalone wiki, visit <a href="wiki.html" style="color:var(--accent)">wiki.html</a>.</p>';
    html += '<h2 class="section-title">Skills (' + Object.keys(GAME_DATA.skills).length + ')</h2><div class="wiki-section">';
    for (const sk of Object.values(GAME_DATA.skills)) html += `<div class="wiki-entry"><strong>${sk.name}</strong> <em>(${sk.type})</em> &mdash; ${sk.desc}</div>`;
    html += '</div>';
    html += '<h2 class="section-title">Monsters</h2><div class="wiki-section">';
    for (const m of Object.values(GAME_DATA.monsters)) html += `<div class="wiki-entry"><strong>${m.name}</strong> (Cb Lv ${m.combatLevel}) &mdash; HP: ${m.hp}, Max Hit: ${m.maxHit}, Style: ${m.style}.</div>`;
    html += '</div>';
    html += '<h2 class="section-title">Game Mechanics</h2><div class="wiki-section">';
    html += `<div class="wiki-entry"><strong>Single-Skill Training</strong> &mdash; Only ONE skill can be active at a time. Starting a new action stops the previous one. Watch the persistent training bar at the top to always know what you\'re doing.</div>`;
    html += `<div class="wiki-entry"><strong>Mastery</strong> &mdash; Each action has its own mastery level. Higher mastery reduces action time and failure rates.</div>`;
    html += `<div class="wiki-entry"><strong>Offline Progression</strong> &mdash; Active skill continues for up to 24 hours. Combat does not run offline.</div>`;
    html += `<div class="wiki-entry"><strong>Alignment</strong> &mdash; Your actions shift your moral axis (Good/Evil, Lawful/Chaotic). Each of 9 alignments grants unique bonuses.</div>`;
    html += `<div class="wiki-entry"><strong>Factions</strong> &mdash; Earn reputation with factions for tier-based perks and exclusive items.</div>`;
    html += `<div class="wiki-entry"><strong>Status Effects</strong> &mdash; Burn (multiplicative DoT), Poison (explodes at 7 stacks), Freeze (3x damage on next hit), Bleed (DoT from crits).</div>`;
    html += `<div class="wiki-entry"><strong>Abilities</strong> &mdash; Equip up to 4 active abilities (unlocked via Tactics) for tactical combat.</div>`;
    html += '</div>';
    el.innerHTML = html;
  }

  renderStatsPage(el) {
    const s = this.engine.state;
    let html = this.header('Statistics','stats','Your lifetime statistics and records.',null);

    // Overview section
    html += '<h2 class="section-title">Overview</h2><div class="stats-grid">';
    const al = GAME_DATA.alignments[s.alignment];
    const totalXp = Object.values(s.skills).reduce((a,sk)=>a+sk.xp,0);
    const overview = [
      ['Total Level', this.engine.getTotalLevel()],
      ['Combat Level', this.engine.getCombatLevel()],
      ['Total XP', this.fmt(totalXp)],
      ['Gold', this.fmt(s.gold)],
      ['Alignment', `${al.name} (${al.axis})`],
      ['Play Time', this.fmtTime(Math.floor(s.stats.totalPlayTime))],
    ];
    for (const [l, v] of overview) html += `<div class="stat-card"><div class="stat-label">${l}</div><div class="stat-value">${v}</div></div>`;
    html += '</div>';

    // Combat stats
    html += '<h2 class="section-title">Combat</h2><div class="stats-grid">';
    const combat = [
      ['Monsters Killed', this.fmt(s.stats.monstersKilled)],
      ['Deaths', s.stats.deaths || 0],
      ['Dungeons Cleared', s.stats.dungeonsCompleted || 0],
      ['World Boss Kills', s.stats.worldBossKills || 0],
      ['Food Eaten', s.stats.foodEaten || 0],
      ['Highest Hit', s.stats.highestHit || 0],
    ];
    for (const [l, v] of combat) html += `<div class="stat-card"><div class="stat-label">${l}</div><div class="stat-value">${v}</div></div>`;
    html += '</div>';

    // PvP stats
    html += '<h2 class="section-title">PvP</h2><div class="stats-grid">';
    const pvp = [
      ['PvP Kills', s.stats.pvpKills || 0],
      ['PvP Deaths', s.stats.pvpDeaths || 0],
      ['K/D Ratio', (s.stats.pvpDeaths||0) > 0 ? ((s.stats.pvpKills||0)/(s.stats.pvpDeaths)).toFixed(2) : '--'],
      ['Current Streak', s.stats.pvpStreak || 0],
      ['Best Streak', s.stats.pvpBestStreak || 0],
      ['Arena Wins', s.stats.pvpWins || 0],
    ];
    for (const [l, v] of pvp) html += `<div class="stat-card"><div class="stat-label">${l}</div><div class="stat-value">${v}</div></div>`;
    html += '</div>';

    // Economy stats
    html += '<h2 class="section-title">Economy</h2><div class="stats-grid">';
    const econ = [
      ['Gold Earned', this.fmt(s.stats.goldEarned)],
      ['Gold Spent', this.fmt(s.stats.goldSpent || 0)],
      ['Items Crafted', this.fmt(s.stats.itemsCrafted || 0)],
      ['Quests Done', `${s.quests?.completed?.length || 0} / ${GAME_DATA.quests.length}`],
      ['Achievements', `${s.achievements?.length || 0} / ${GAME_DATA.achievements.length}`],
      ['Bank Items', Object.keys(s.bank).filter(k=>s.bank[k]>0).length],
    ];
    for (const [l, v] of econ) html += `<div class="stat-card"><div class="stat-label">${l}</div><div class="stat-value">${v}</div></div>`;
    html += '</div>';

    // Per-skill XP table
    html += '<h2 class="section-title">Skill Breakdown</h2><div class="stats-skills">';
    for (const [sId, data] of Object.entries(GAME_DATA.skills)) {
      const sk = s.skills[sId];
      if (!sk) continue;
      const p = this.engine.getXpProgress(sId);
      const actions = s.stats.totalActions[sId] || 0;
      html += `<div class="ss-row">
        <span class="ss-name">${data.name}</span>
        <span class="ss-level">${sk.level}</span>
        <div class="ss-bar"><div class="ss-fill" style="width:${(p*100).toFixed(0)}%"></div></div>
        <span class="ss-xp">${this.fmt(sk.xp)} XP</span>
        <span class="ss-actions">${this.fmt(actions)} acts</span>
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  renderSettingsPage(el) {
    let html = this.header('Settings','settings','Manage your game.',null);
    html += `<div class="settings-section">
      <h3>Save Management</h3>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
        <button class="btn" onclick="game.save(); ui.toast({type:'success',text:'Game saved!'})">Save Game</button>
        <button class="btn" onclick="ui.exportSave()">Export Save</button>
        <button class="btn" onclick="ui.importSavePrompt()">Import Save</button>
        ${typeof online !== 'undefined' && online.isOnline ? '<button class="btn" onclick="online.saveToCloud()">Save to Cloud</button><button class="btn" onclick="online.loadFromCloud().then(d=>{if(d){game.state=d;game.save();location.reload();}})">Load from Cloud</button>' : ''}
      </div>
      <button class="btn btn-danger" onclick="if(confirm('Delete ALL progress? This cannot be undone.')){game.deleteSave(); location.reload();}">Delete Save</button>
    </div>
    <div class="settings-section">
      <h3>About Ashfall Idle</h3>
      <p>A dark fantasy idle RPG. ${Object.keys(GAME_DATA.items).length} items, ${Object.keys(GAME_DATA.skills).length} skills, ${Object.keys(GAME_DATA.monsters).length} monsters.</p>
      <p>Version 5.7 &mdash; Summoning + Wilderness PvP</p>
    </div>`;
    el.innerHTML = html;
  }

  // ── SUMMONING PAGE ──────────────────────────────────────
  renderSummoningPage(el) {
    const s = this.engine.state;
    let html = this.header('Summoning','sparkle','Create combat familiars from charms. Familiars provide passive buffs in combat.','summoning');

    // Active familiar display
    const fam = s.familiar;
    if (fam?.active) {
      const famData = GAME_DATA.familiars?.find(f=>f.id===fam.active);
      const mins = Math.floor(fam.timeLeft / 60);
      const secs = Math.floor(fam.timeLeft % 60);
      html += `<div class="familiar-active">
        <div class="fa-header">Active Familiar: <strong>${fam.name}</strong></div>
        <div class="fa-timer">${mins}m ${secs}s remaining</div>
        <div class="fa-buffs">`;
      if (fam.buff) {
        for (const [stat,val] of Object.entries(fam.buff)) {
          const label = stat === 'healOverTime' ? 'Heal/atk' : stat === 'damageMult' ? 'Dmg Mult' : stat.replace('Bonus','').replace(/([A-Z])/g,' $1');
          html += `<span class="fa-buff">+${stat==='damageMult'?((val-1)*100).toFixed(0)+'%':val} ${label}</span>`;
        }
      }
      html += `</div><button class="btn btn-xs btn-danger" onclick="game.dismissFamiliar();ui.renderPage('summoning')">Dismiss</button>
      </div>`;
    } else {
      html += '<div class="familiar-none">No familiar active. Create and use a pouch below.</div>';
    }

    // Charm inventory
    html += '<h2 class="section-title">Your Charms</h2><div class="charm-inv">';
    for (const cId of ['gold_charm','green_charm','crimson_charm','blue_charm']) {
      const qty = s.bank[cId] || 0;
      const item = GAME_DATA.items[cId];
      html += `<div class="charm-slot"><span class="charm-name">${item?.name||cId}</span><span class="charm-qty" id="charm-${cId}">${qty}</span></div>`;
    }
    html += `<div class="charm-slot"><span class="charm-name">Spirit Shards</span><span class="charm-qty" id="charm-spirit_shards">${s.bank.spirit_shards||0}</span></div>`;
    html += '</div>';

    // Pouches in bank (activate buttons)
    const pouches = Object.entries(s.bank).filter(([id,q]) => q > 0 && GAME_DATA.items[id]?.type === 'pouch');
    if (pouches.length > 0) {
      html += '<h2 class="section-title">Your Pouches</h2><div class="actions-grid">';
      for (const [pId, qty] of pouches) {
        const pouch = GAME_DATA.items[pId];
        const famData = GAME_DATA.familiars?.find(f=>f.id===pouch.familiar);
        const locked = s.skills.summoning.level < (famData?.level||1);
        html += `<div class="action-card ${locked?'locked':''}">
          <div class="ac-header"><span class="ac-name" style="color:${this.getRarityColor(pId)||''}">${pouch.name}</span><span class="ac-level">x${qty}</span></div>
          <p class="area-desc">${pouch.desc}</p>
          <div class="fa-buffs">`;
        if (pouch.buff) {
          for (const [stat,val] of Object.entries(pouch.buff)) {
            const label = stat === 'healOverTime' ? 'Heal/atk' : stat === 'damageMult' ? 'Dmg' : stat.replace('Bonus','');
            html += `<span class="fa-buff">+${stat==='damageMult'?((val-1)*100).toFixed(0)+'%':val} ${label}</span>`;
          }
        }
        html += `</div>
          <div class="ac-footer"><span>Lv ${famData?.level||'?'}</span><span>${Math.floor((pouch.duration||600)/60)} min</span></div>
          <button class="btn btn-xs" ${locked?'disabled':''} onclick="game.activateFamiliar('${pId}');ui.renderPage('summoning')">Summon</button>
        </div>`;
      }
      html += '</div>';
    }

    // Crafting recipes
    html += '<h2 class="section-title">Create Pouches</h2>';
    if (s.activeSkill === 'summoning' && s.activeAction) {
      const a = GAME_DATA.recipes.summoning?.find(r=>r.id===s.activeAction);
      if (a) {
        const p = Math.min(1, s.actionProgress / a.time);
        html += `<div class="active-action-bar"><div class="aa-label">Creating: ${a.name}</div><div class="aa-progress"><div class="aa-fill" style="width:${(p*100).toFixed(0)}%"></div></div><button class="btn btn-danger btn-sm" onclick="ui.stopAction()">Stop</button></div>`;
      }
    }
    html += '<div class="actions-grid">';
    for (const r of (GAME_DATA.recipes.summoning || [])) {
      const locked = s.skills.summoning.level < r.level;
      const isActive = s.activeSkill === 'summoning' && s.activeAction === r.id;
      const hasAll = r.input.every(inp => (s.bank[inp.item]||0) >= inp.qty);
      html += `<div class="action-card ${locked?'locked':''} ${isActive?'active':''}" ${locked||!hasAll?'':`onclick="ui.startAction('summoning','${r.id}')"`}>
        <div class="ac-header"><span class="ac-name">${r.name}</span><span class="ac-level">Lv ${r.level}</span></div>
        <div class="recipe-inputs">${r.input.map(inp => {
          const it = GAME_DATA.items[inp.item];
          const have = s.bank[inp.item]||0;
          return `<span class="recipe-mat ${have>=inp.qty?'':'mat-missing'}" data-mat="${inp.item}" data-need="${inp.qty}">${it?.name||inp.item} x${inp.qty} <small data-item-qty="${inp.item}">(${have})</small></span>`;
        }).join('')}</div>
        <div class="ac-footer"><span class="ac-xp">+${r.xp} XP</span><span class="ac-time">${r.time}s</span></div>
        ${locked?`<div class="locked-overlay">Level ${r.level}</div>`:''}
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  // ── NECROMANCY PAGE ─────────────────────────────────────
  renderNecromancyPage(el) {
    const s = this.engine.state;
    let html = this.header('Necromancy','skull','Dark combat magic. Drain life, raise undead, curse enemies. Switch to the Necromancy spellbook in combat.','necromancy');
    html += `<div class="alignment-display" style="border-color:#5a2a5a">
      <div class="al-current" style="color:#b585e0">The Dark Arts</div>
      <div class="al-desc">Necromancy is trained by dealing damage with Necromancy spells in combat. Switch to the Necromancy spellbook on the Spellbooks page, then fight monsters using magic combat style.</div>
      <button class="btn btn-sm" style="margin-top:8px" onclick="game.switchSpellbook('necromancy');ui.currentPage='spellbooks';ui.renderSidebar();ui.renderPage('spellbooks')">Switch to Necromancy Spellbook</button>
    </div>`;
    html += '<h2 class="section-title">Necromancy Spells</h2><div class="actions-grid">';
    for (const sp of (GAME_DATA.necromancySpells || [])) {
      const locked = s.skills.magic.level < sp.level;
      html += `<div class="action-card ${locked?'locked':''}" style="border-left:3px solid #5a2a5a">
        <div class="ac-header"><span class="ac-name">${sp.name}</span><span class="ac-level">Lv ${sp.level}</span></div>
        <p class="area-desc">${sp.desc}</p>
        <div class="ac-footer"><span>Max Hit: ${sp.maxHit}</span><span>${sp.runes.map(r=>(GAME_DATA.items[r.item]?.name||r.item)+' x'+r.qty).join(', ')}</span></div>
        ${sp.lifesteal?`<div class="faction-perk">Lifesteal: ${(sp.lifesteal*100).toFixed(0)}%</div>`:''}
        ${locked?`<div class="locked-overlay">Magic ${sp.level}</div>`:''}
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  // ── PRAYER PAGE ─────────────────────────────────────────
  renderPrayerPage(el) {
    const s = this.engine.state;
    let html = this.header('Prayer','sparkle','Bury bones for prayer points. Activate up to 2 prayers for combat buffs.','prayer');
    html += `<div class="prayer-info">
      <div class="stat-row"><span>Prayer Points</span><span class="pi-val gold-val">${this.fmt(s.prayerPoints)}</span></div>
      <div class="stat-row"><span>Active Prayers</span><span class="pi-val">${s.activePrayers.length}/2</span></div>
      <div class="stat-row"><span>Bones Buried</span><span class="pi-val">${this.fmt(s.stats.bonesBuried||0)}</span></div>
    </div>`;

    // Bury bones section
    html += '<h2 class="section-title">Bury Bones</h2><div class="actions-grid">';
    const boneItems = Object.entries(GAME_DATA.boneValues);
    for (const [boneId, boneData] of boneItems) {
      const item = GAME_DATA.items[boneId];
      if (!item) continue;
      const qty = s.bank[boneId] || 0;
      html += `<div class="action-card ${qty<=0?'locked':''}">
        <div class="ac-header"><span class="ac-name">${item.name}</span><span class="ac-level">x${qty}</span></div>
        <div class="recipe-output">+${boneData.points} points, +${boneData.xp} XP each</div>
        <div class="shop-btns">
          <button class="btn btn-xs" ${qty<=0?'disabled':''} onclick="game.buryBones('${boneId}',1)">Bury 1</button>
          <button class="btn btn-xs" ${qty<10?'disabled':''} onclick="game.buryBones('${boneId}',10)">Bury 10</button>
          <button class="btn btn-xs" ${qty<=0?'disabled':''} onclick="game.buryBones('${boneId}',${qty})">Bury All</button>
        </div>
      </div>`;
    }
    html += '</div>';

    // Prayer list
    html += '<h2 class="section-title">Prayers</h2><div class="actions-grid">';
    for (const prayer of GAME_DATA.prayers) {
      const locked = s.skills.prayer.level < prayer.level;
      const active = s.activePrayers.includes(prayer.id);
      html += `<div class="action-card ${locked?'locked':''} ${active?'active':''}" ${locked?'':`onclick="game.activatePrayer('${prayer.id}')"`}>
        <div class="ac-header"><span class="ac-name">${prayer.name}</span><span class="ac-level">Lv ${prayer.level}</span></div>
        <p class="area-desc">${prayer.desc}</p>
        <div class="ac-footer"><span>Cost: ${prayer.pointCost} pts/atk</span>${active?'<span class="ach-check">Active</span>':''}</div>
        ${locked?`<div class="locked-overlay">Requires Level ${prayer.level}</div>`:''}
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  // ── SLAYER PAGE ────────────────────────────────────────
  renderSlayerPage(el) {
    const s = this.engine.state;
    let html = this.header('Slayer','target','Complete assigned kill tasks for Slayer XP and Slayer Coins.','slayer');
    html += `<div class="prayer-info">
      <div class="stat-row"><span>Slayer Coins</span><span class="pi-val gold-val">${this.fmt(s.slayerCoins)}</span></div>
      <div class="stat-row"><span>Tasks Completed</span><span class="pi-val">${s.stats.slayerTasksCompleted||0}</span></div>
      <div class="stat-row"><span>Auto-Slayer</span><span class="pi-val">${s.slayerAutoEnabled?'Enabled':'Disabled'}</span></div>
    </div>`;

    // Current task
    if (s.slayerTask) {
      const m = GAME_DATA.monsters[s.slayerTask.monster];
      const pct = Math.min(100, (s.slayerTask.killed / s.slayerTask.amount) * 100);
      html += `<div class="active-action-bar" style="margin:16px 0">
        <div class="aa-label">Task: Kill ${s.slayerTask.amount}x ${m?.name||s.slayerTask.monster} (${s.slayerTask.tier})</div>
        <div class="aa-progress"><div class="aa-fill" style="width:${pct.toFixed(0)}%"></div></div>
        <span style="font-family:'JetBrains Mono',monospace;font-size:12px">${s.slayerTask.killed}/${s.slayerTask.amount}</span>
        <button class="btn btn-xs btn-danger" onclick="game.skipSlayerTask()">Skip (30 SC)</button>
      </div>`;
    } else {
      html += '<div class="bank-empty" style="margin:12px 0">No active slayer task. Choose a tier below.</div>';
    }

    // Task tiers
    html += '<h2 class="section-title">Get Task</h2><div class="actions-grid">';
    for (const [tier, data] of Object.entries(GAME_DATA.slayerTasks)) {
      const locked = s.skills.slayer.level < data.slayerReq || this.engine.getCombatLevel() < data.combatReq;
      html += `<div class="action-card ${locked?'locked':''}">
        <div class="ac-header"><span class="ac-name">${data.name}</span><span class="ac-level">Slayer ${data.slayerReq}+</span></div>
        <div class="recipe-output">Kills: ${data.killRange[0]}-${data.killRange[1]} | Coins: ${data.coinReward}/kill</div>
        <div class="ac-footer"><span>Combat Lv ${data.combatReq}+</span></div>
        <button class="btn btn-sm" ${locked||s.slayerTask?'disabled':''} onclick="game.getSlayerTask('${tier}')">Assign</button>
        ${locked?`<div class="locked-overlay">Slayer ${data.slayerReq} / Combat ${data.combatReq}</div>`:''}
      </div>`;
    }
    html += '</div>';

    // Slayer shop
    html += '<h2 class="section-title">Slayer Shop</h2><div class="actions-grid">';
    for (let i = 0; i < GAME_DATA.slayerShop.length; i++) {
      const item = GAME_DATA.slayerShop[i];
      const canAfford = s.slayerCoins >= item.cost;
      const owned = item.id === 'auto_slayer' && s.slayerAutoEnabled;
      html += `<div class="action-card ${canAfford?'':'locked'}">
        <div class="ac-header"><span class="ac-name">${item.name}</span><span class="ac-level">${item.cost} SC</span></div>
        <p class="area-desc">${item.desc}</p>
        <button class="btn btn-sm" ${canAfford&&!owned?'':'disabled'} onclick="game.buySlayerItem(${i})">${owned?'Owned':'Buy'}</button>
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  // ── PETS PAGE ──────────────────────────────────────────
  renderPetsPage(el) {
    const s = this.engine.state;
    const allPets = GAME_DATA.pets || [];
    const owned = s.pets || [];
    let html = this.header('Pets','paw',`${owned.length}/${allPets.length} pets collected. Equip one for a passive bonus.`,null);

    if (s.activePet) {
      const pet = allPets.find(p => p.id === s.activePet);
      if (pet) {
        html += `<div class="alignment-display">
          <div class="al-current">Active Pet: <strong>${pet.name}</strong></div>
          <div class="al-desc">${pet.desc}</div>
          <button class="btn btn-xs btn-danger" onclick="game.equipPet('${pet.id}')">Unequip</button>
        </div>`;
      }
    }

    html += '<h2 class="section-title">Collection</h2><div class="actions-grid">';
    for (const pet of allPets) {
      const have = owned.includes(pet.id);
      const isActive = s.activePet === pet.id;
      const sourceLabel = GAME_DATA.monsters[pet.source]?.name || GAME_DATA.skills[pet.source]?.name || pet.source;
      html += `<div class="action-card ${have?'':'locked'} ${isActive?'active':''}">
        <div class="ac-header"><span class="ac-name">${have?pet.name:'???'}</span>${isActive?'<span class="ach-check">Active</span>':''}</div>
        <p class="area-desc">${have?pet.desc:'Unknown pet. Keep training to discover.'}</p>
        <div class="ac-footer"><span>Source: ${sourceLabel}</span><span>1/${Math.floor(1/pet.dropRate)}</span></div>
        ${have&&!isActive?`<button class="btn btn-xs" onclick="game.equipPet('${pet.id}')">Equip</button>`:''}
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  // ── SPELLBOOKS PAGE ────────────────────────────────────
  renderSpellbooksPage(el) {
    const s = this.engine.state;
    let html = this.header('Spellbooks','wand','Switch between spellbooks to access different spell schools.',null);
    const activeBook = s.activeSpellbook || 'standard';

    html += '<h2 class="section-title">Available Spellbooks</h2><div class="actions-grid">';
    for (const [id, book] of Object.entries(GAME_DATA.spellbooks)) {
      const locked = book.unlockReq && Object.entries(book.unlockReq).some(([sk,lv]) => s.skills[sk]?.level < lv);
      const active = activeBook === id;
      const reqStr = book.unlockReq ? Object.entries(book.unlockReq).map(([sk,lv])=>`${GAME_DATA.skills[sk]?.name} ${lv}`).join(', ') : 'None';
      html += `<div class="action-card ${locked?'locked':''} ${active?'active':''}" style="${book.color?'border-left:3px solid '+book.color:''}">
        <div class="ac-header"><span class="ac-name">${book.name}</span>${active?'<span class="ach-check">Active</span>':''}</div>
        <p class="area-desc">${book.desc}</p>
        <div class="ac-footer"><span>Requires: ${reqStr}</span></div>
        ${!locked&&!active?`<button class="btn btn-sm" onclick="game.switchSpellbook('${id}')">Activate</button>`:''}
        ${locked?`<div class="locked-overlay">Requires ${reqStr}</div>`:''}
      </div>`;
    }
    html += '</div>';

    // Show spells for active book
    const spells = this.engine.getSpellsForActiveBook();
    const bookData = GAME_DATA.spellbooks[activeBook];
    html += `<h2 class="section-title">${bookData?.name||'Standard'} Spells</h2><div class="actions-grid">`;
    for (const sp of spells) {
      const locked = s.skills.magic.level < sp.level;
      const selected = s.combat.selectedSpell === sp.id;
      html += `<div class="action-card ${locked?'locked':''} ${selected?'active':''}" ${locked?'':`onclick="ui.selectSpell('${sp.id}')"`}>
        <div class="ac-header"><span class="ac-name">${sp.name}</span><span class="ac-level">Lv ${sp.level}</span></div>
        <p class="area-desc">${sp.desc}</p>
        <div class="ac-footer"><span>Max Hit: ${sp.maxHit}</span><span>Runes: ${sp.runes.map(r=>(GAME_DATA.items[r.item]?.name||r.item)+' x'+r.qty).join(', ')}</span></div>
        ${locked?`<div class="locked-overlay">Magic ${sp.level}</div>`:''}
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  // ── CHARACTER CREATOR ───────────────────────────────────
  renderCharacterPage(el) {
    const s = this.engine.state;
    if (!s.profile) s.profile = { avatarSeed:'', hair:'short04', skinColor:'c68642', hairColor:'2c1b18', accessory:'', mouth:'happy01', eyes:'variant04', clothing:'variant04', clothingColor:'4a90d4', bio:'' };
    const p = s.profile;
    const seed = p.avatarSeed || (typeof online !== 'undefined' ? online.displayName : 'Survivor') || 'Survivor';
    const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(seed)}&hair=${p.hair}&skinColor=${p.skinColor}&hairColor=${p.hairColor}&mouth=${p.mouth}&eyes=${p.eyes}&clothing=${p.clothing}&clothingColor=${p.clothingColor}${p.accessory?'&accessories='+p.accessory:''}`;
    const align = GAME_DATA.alignments[s.alignment];

    let html = this.header('Character','shield','Customize your avatar and set up your profile.',null);

    // Profile card
    html += `<div class="char-profile-card">
      <div class="char-avatar"><img src="${avatarUrl}" alt="Avatar" width="128" height="128" id="char-avatar-img"></div>
      <div class="char-info">
        <div class="char-name">${typeof online !== 'undefined' ? online.displayName || 'Survivor' : 'Survivor'}</div>
        <div class="char-title">${align.name} (${align.axis})</div>
        <div class="char-stats">
          <span>Combat: ${this.engine.getCombatLevel()}</span>
          <span>Total: ${this.engine.getTotalLevel()}</span>
          <span>Gold: ${this.fmt(s.gold)}</span>
          <span>Kills: ${this.fmt(s.stats.monstersKilled)}</span>
        </div>
        ${p.bio ? `<div class="char-bio">${this.escHtml(p.bio)}</div>` : ''}
      </div>
    </div>`;

    // Avatar customizer
    html += '<h2 class="section-title">Customize Avatar</h2><div class="char-customizer">';
    const options = {
      'Avatar Seed': {key:'avatarSeed', type:'text', placeholder:'Type a name or word'},
      'Hair Style': {key:'hair', type:'select', opts:['short01','short02','short03','short04','short05','long01','long02','long03','long04','long05','long06','long07','long08','long09','long10','long11','long12','long13','long14','long15']},
      'Hair Color': {key:'hairColor', type:'color', opts:['2c1b18','d4a83a','c44040','1a1a1f','7a4a2a','e8e0d4','5a2a8a','3a8a5e']},
      'Skin': {key:'skinColor', type:'color', opts:['f8d9c0','e8b88a','c68642','8d5524','5a3a1a','f0d0b0']},
      'Eyes': {key:'eyes', type:'select', opts:['variant01','variant02','variant03','variant04','variant05','variant06','variant07','variant08','variant09','variant10','variant11','variant12']},
      'Mouth': {key:'mouth', type:'select', opts:['happy01','happy02','happy03','happy04','happy05','happy06','happy07','happy08','happy09','happy10','happy11','happy12','sad01','sad02','sad03','sad04','sad05','sad06','sad07','sad08','surprised01','surprised02']},
      'Clothing': {key:'clothing', type:'select', opts:['variant01','variant02','variant03','variant04','variant05','variant06','variant07','variant08','variant09','variant10','variant11','variant12','variant13','variant14','variant15','variant16','variant17','variant18','variant19','variant20','variant21','variant22','variant23','variant24','variant25']},
      'Clothing Color': {key:'clothingColor', type:'color', opts:['4a90d4','c44040','5a8a3e','d4a83a','8a5ec4','1a1a1f','e8e0d4','c47a3a']},
      'Accessory': {key:'accessory', type:'select', opts:['','variant01','variant02','variant03','variant04']},
    };
    for (const [label, cfg] of Object.entries(options)) {
      html += `<div class="cc-row"><label class="cc-label">${label}</label>`;
      if (cfg.type === 'text') {
        html += `<input type="text" class="chat-input" value="${this.escHtml(p[cfg.key]||'')}" placeholder="${cfg.placeholder}" onchange="ui.setCharOpt('${cfg.key}',this.value)">`;
      } else if (cfg.type === 'select') {
        html += '<div class="cc-opts">';
        for (const opt of cfg.opts) {
          const active = p[cfg.key] === opt;
          const display = opt ? opt.replace('variant','V').replace('short','S').replace('long','L').replace('happy','H').replace('sad','Sd').replace('surprised','!') : 'None';
          html += `<button class="btn btn-xs ${active?'btn-active':''}" onclick="ui.setCharOpt('${cfg.key}','${opt}')">${display}</button>`;
        }
        html += '</div>';
      } else if (cfg.type === 'color') {
        html += '<div class="cc-colors">';
        for (const c of cfg.opts) {
          const active = p[cfg.key] === c;
          html += `<button class="cc-swatch ${active?'cc-swatch-active':''}" style="background:#${c}" onclick="ui.setCharOpt('${cfg.key}','${c}')"></button>`;
        }
        html += '</div>';
      }
      html += '</div>';
    }
    html += '</div>';

    // Bio + Save
    html += `<h2 class="section-title">Bio</h2>
      <div style="display:flex;gap:8px"><textarea id="bio-input" class="chat-input" rows="3" placeholder="Write about your character..." style="flex:1;resize:vertical">${this.escHtml(p.bio||'')}</textarea></div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="btn" onclick="ui.saveCharacter()">Save & Update Profile</button>
        ${typeof online !== 'undefined' && online.isOnline ? '<button class="btn btn-sm" onclick="online.saveToCloud();online.syncProfile()">Sync to Cloud</button>' : ''}
      </div>`;

    // Equipment requirements quick reference
    html += '<h2 class="section-title">Equipment Level Guide</h2><div class="equip-guide">';
    const tiers = [
      {name:'Bronze', level:1, color:'#a06a3c'},
      {name:'Iron', level:10, color:'#7a8294'},
      {name:'Steel', level:20, color:'#9da4b4'},
      {name:'Mithril', level:30, color:'#7ab8c8'},
      {name:'Adamant', level:40, color:'#4a8a5e'},
      {name:'Obsidian', level:50, color:'#5a3060'},
      {name:'Dragon', level:55, color:'#5a8a3e'},
      {name:'Ashfire', level:60, color:'#d63a1a'},
    ];
    for (const t of tiers) {
      html += `<div class="eg-tier"><span class="eg-dot" style="background:${t.color}"></span><span class="eg-name">${t.name}</span><span class="eg-level">Lv ${t.level}+</span></div>`;
    }
    html += `<div class="eg-note">Melee weapons require Attack level. Ranged weapons require Ranged. Magic weapons require Magic. Armor requires Defence. Hybrid gear has multiple requirements.</div></div>`;

    el.innerHTML = html;
  }

  setCharOpt(key, value) {
    if (!game.state.profile) game.state.profile = {};
    game.state.profile[key] = value;
    this.renderPage('character');
  }

  saveCharacter() {
    const bio = document.getElementById('bio-input')?.value || '';
    game.state.profile.bio = bio;
    game.save();
    if (typeof online !== 'undefined' && online.isOnline) {
      online.syncProfile();
      online.saveToCloud();
    }
    this.renderSidebar();
    this.toast({ type:'success', text:'Character saved and synced.' });
  }

  // ── GUILDS PAGE ────────────────────────────────────────
  renderGuildsPage(el) {
    const s = this.engine.state;
    const isOnline = typeof online !== 'undefined' && online.isOnline;
    let html = this.header('Guilds','faction','Create or join a guild. Ally with others, compete for dominance.',null);

    if (!isOnline) {
      html += '<div class="bank-empty">Online features required. Configure Firebase to enable guilds.</div>';
      el.innerHTML = html; return;
    }

    if (s.guild) {
      html += `<div class="alignment-display">
        <div class="al-current">Your Guild: <strong>${this.escHtml(s.guild.name)}</strong></div>
        <div class="al-desc">Role: ${s.guild.role || 'Member'}</div>
        <button class="btn btn-xs btn-danger" style="margin-top:8px" onclick="online.leaveGuild().then(()=>ui.renderPage('guilds'))">Leave Guild</button>
      </div>`;
    } else {
      html += `<div class="settings-section">
        <h3>Create a Guild</h3>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <input type="text" id="guild-name" class="chat-input" placeholder="Guild name" maxlength="30">
          <input type="text" id="guild-tag" class="chat-input" placeholder="Tag (3-5 chars)" maxlength="5" style="width:100px">
          <button class="btn btn-sm" onclick="ui.createGuild()">Create (1000g)</button>
        </div>
      </div>`;
      html += `<div class="settings-section">
        <h3>Join a Guild</h3>
        <div style="display:flex;gap:8px">
          <input type="text" id="guild-join" class="chat-input" placeholder="Guild name to join">
          <button class="btn btn-sm" onclick="ui.joinGuild()">Join</button>
        </div>
      </div>`;
    }

    html += '<h2 class="section-title">Guild Benefits</h2><div class="actions-grid">';
    const benefits = [
      {name:'Shared XP Bonus', desc:'+2% XP for all members when 3+ online.'},
      {name:'Guild Bank', desc:'Shared gold pool for group purchases.'},
      {name:'Alliances', desc:'Ally with other guilds for faction wars.'},
      {name:'Wilderness', desc:'Guild territory control in PvP zones.'},
      {name:'Guild Chat', desc:'Private communication channel.'},
      {name:'Guild Quests', desc:'Cooperative quests with group rewards.'},
    ];
    for (const b of benefits) {
      html += `<div class="action-card"><div class="ac-header"><span class="ac-name">${b.name}</span></div><p class="area-desc">${b.desc}</p></div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  async createGuild() {
    const name = document.getElementById('guild-name')?.value?.trim();
    const tag = document.getElementById('guild-tag')?.value?.trim()?.toUpperCase();
    if (!name || name.length < 3) { this.toast({type:'warn',text:'Guild name must be 3+ characters.'}); return; }
    if (!tag || tag.length < 2 || tag.length > 5) { this.toast({type:'warn',text:'Tag must be 2-5 characters.'}); return; }
    if (game.state.gold < 1000) { this.toast({type:'warn',text:'Need 1000 gold to create a guild.'}); return; }
    game.state.gold -= 1000;
    await online.createGuild(name, tag);
    this.renderPage('guilds');
  }

  async joinGuild() {
    const name = document.getElementById('guild-join')?.value?.trim();
    if (!name) return;
    await online.joinGuild(name);
    this.renderPage('guilds');
  }

  // ── ACCOUNT PAGE ────────────────────────────────────────
  renderFriendsPage(el) {
    const isOnline = typeof online !== 'undefined' && online.isOnline;
    let html = this.header('Friends','npc','Manage your friends list. Send requests, chat privately.',null);
    if (!isOnline || !online.user || online.user.isAnonymous) {
      html += '<div class="bank-empty">Create an account to use friends.</div>';
      el.innerHTML = html; return;
    }
    // Send request
    html += `<div class="settings-section">
      <h3>Send Friend Request</h3>
      <div style="display:flex;gap:8px">
        <input type="text" id="friend-name" class="chat-input-v2" placeholder="Player name..." style="flex:1">
        <button class="btn btn-sm" onclick="online.sendFriendRequest(document.getElementById('friend-name').value.trim()).then(()=>ui.renderPage('friends'))">Send Request</button>
      </div>
    </div>`;
    // Pending requests
    html += '<h2 class="section-title">Pending Requests</h2><div id="friend-requests"><div class="bank-empty">Loading...</div></div>';
    // Friends list
    html += '<h2 class="section-title">Your Friends</h2><div id="friends-list"><div class="bank-empty">Loading...</div></div>';
    el.innerHTML = html;
    this._loadFriendsData();
  }

  async _loadFriendsData() {
    // Load pending requests
    const reqContainer = document.getElementById('friend-requests');
    if (reqContainer) {
      const requests = await online.getFriendRequests();
      if (requests.length === 0) {
        reqContainer.innerHTML = '<div class="bank-empty">No pending requests.</div>';
      } else {
        reqContainer.innerHTML = requests.map(r => `<div class="bz-row">
          <span class="bz-item">${this.escHtml(r.fromName)}</span>
          <span><button class="btn btn-xs" onclick="online.acceptFriendRequest('${r.id}','${r.from}','${this.escHtml(r.fromName)}').then(()=>ui.renderPage('friends'))">Accept</button>
          <button class="btn btn-xs btn-danger" onclick="online.rejectFriendRequest('${r.id}').then(()=>ui.renderPage('friends'))">Reject</button></span>
        </div>`).join('');
      }
    }
    // Load friends
    const listContainer = document.getElementById('friends-list');
    if (listContainer) {
      const friends = await online.getFriends();
      if (friends.length === 0) {
        listContainer.innerHTML = '<div class="bank-empty">No friends yet. Send a request above.</div>';
      } else {
        listContainer.innerHTML = '<div class="friends-grid">' + friends.map(f => `<div class="friend-card">
          <span class="fc-name">${this.escHtml(f.name)}</span>
          <div class="fc-btns">
            <button class="btn btn-xs" onclick="ui.openDM('${f.uid}','${this.escHtml(f.name)}')">Message</button>
            <button class="btn btn-xs btn-danger" onclick="online.removeFriend('${f.uid}').then(()=>ui.renderPage('friends'))">Remove</button>
          </div>
        </div>`).join('') + '</div>';
      }
    }
  }

  openDM(uid, name) {
    this._dmTarget = { uid, name };
    this.renderPage('inbox');
  }

  renderInboxPage(el) {
    const isOnline = typeof online !== 'undefined' && online.isOnline;
    let html = this.header('Inbox','scroll','Private messages and notifications.',null);
    if (!isOnline || !online.user || online.user.isAnonymous) {
      html += '<div class="bank-empty">Create an account to use inbox.</div>';
      el.innerHTML = html; return;
    }
    // Active DM conversation
    if (this._dmTarget) {
      const t = this._dmTarget;
      html += `<div class="dm-section">
        <div class="dm-header">
          <span>Conversation with <strong>${this.escHtml(t.name)}</strong></span>
          <button class="btn btn-xs" onclick="ui._dmTarget=null;ui.renderPage('inbox')">Back to Inbox</button>
        </div>
        <div class="dm-messages" id="dm-messages"><div class="bank-empty">Loading...</div></div>
        <div class="dm-input">
          <input type="text" id="dm-text" class="chat-input-v2" placeholder="Type a message..." maxlength="500" style="flex:1" onkeydown="if(event.key==='Enter')ui.sendDM()">
          <button class="btn btn-sm" onclick="ui.sendDM()">Send</button>
        </div>
      </div>`;
      el.innerHTML = html;
      this._loadDMMessages(t.uid);
      return;
    }
    // Inbox tools
    html += `<div style="display:flex;gap:8px;margin-bottom:12px">
      <button class="btn btn-sm btn-danger" onclick="online.clearInbox().then(()=>ui.renderPage('inbox'))">Clear All</button>
    </div>`;
    // Conversations
    html += '<h2 class="section-title">Recent Conversations</h2><div id="inbox-convos"><div class="bank-empty">Loading...</div></div>';
    // Notifications
    html += '<h2 class="section-title">Notifications</h2><div id="inbox-notifs"><div class="bank-empty">Loading...</div></div>';
    el.innerHTML = html;
    this._loadInboxData();
  }

  async _loadInboxData() {
    // Load conversations
    const convoContainer = document.getElementById('inbox-convos');
    if (convoContainer) {
      const convos = await online.getConversationList();
      if (convos.length === 0) {
        convoContainer.innerHTML = '<div class="bank-empty">No conversations. Message a friend to start.</div>';
      } else {
        convoContainer.innerHTML = convos.map(c => {
          const otherUid = c.participants.find(p => p !== online.user.uid);
          const otherName = c.participantNames?.[otherUid] || 'Unknown';
          return `<div class="inbox-convo" onclick="ui.openDM('${otherUid}','${this.escHtml(otherName)}')">
            <span class="ic-name">${this.escHtml(otherName)}</span>
            <span class="ic-preview">${this.escHtml(c.lastMessage||'')}</span>
            <span class="ic-arrow">&rarr;</span>
          </div>`;
        }).join('');
      }
    }
    // Load notifications
    const notifContainer = document.getElementById('inbox-notifs');
    if (notifContainer) {
      const items = await online.getInbox();
      const notifs = items.filter(i => i.type !== 'message');
      if (notifs.length === 0) {
        notifContainer.innerHTML = '<div class="bank-empty">No notifications.</div>';
      } else {
        notifContainer.innerHTML = notifs.map(n => `<div class="inbox-notif ${n.read?'':'inbox-unread'}">
          <span>${this.escHtml(n.fromName||'System')}: ${this.escHtml(n.preview||n.type)}</span>
          ${!n.read?`<button class="btn btn-xs" onclick="online.markInboxRead('${n.id}').then(()=>ui.renderPage('inbox'))">Mark Read</button>`:''}
        </div>`).join('');
      }
    }
  }

  async _loadDMMessages(targetUid) {
    const container = document.getElementById('dm-messages');
    if (!container) return;
    const msgs = await online.getConversation(targetUid);
    if (msgs.length === 0) {
      container.innerHTML = '<div class="bank-empty">No messages yet. Say hello!</div>';
    } else {
      container.innerHTML = msgs.map(m => {
        const isMe = m.sender === online.user?.uid;
        return `<div class="dm-msg ${isMe?'dm-mine':'dm-theirs'}">
          <span class="dm-sender">${isMe?'You':this.escHtml(m.senderName)}</span>
          <span class="dm-text">${this.escHtml(m.text)}</span>
        </div>`;
      }).join('');
      container.scrollTop = container.scrollHeight;
    }
  }

  async sendDM() {
    if (!this._dmTarget) return;
    const input = document.getElementById('dm-text');
    if (!input || !input.value.trim()) return;
    await online.sendPrivateMessage(this._dmTarget.uid, this._dmTarget.name, input.value.trim());
    input.value = '';
    this._loadDMMessages(this._dmTarget.uid);
  }

  renderAccountPage(el) {
    const isOnline = typeof online !== 'undefined' && online.isOnline;
    const user = isOnline ? online.user : null;
    const isAnon = user?.isAnonymous;
    let html = this.header('Account','npc','Manage your online account, cloud saves, and display name.',null);

    if (!isOnline) {
      html += `<div class="alignment-display">
        <div class="al-current">Offline Mode</div>
        <div class="al-desc">Firebase is not configured. Online features are disabled. To enable them, edit <code>js/firebase-config.js</code> with your Firebase project credentials. See the file for full setup instructions.</div>
      </div>`;
    } else if (user && !isAnon) {
      const isAdmin = typeof ADMIN_UIDS !== 'undefined' && ADMIN_UIDS.includes(user.uid);
      html += `<div class="alignment-display">
        <div class="al-current">Signed in as <strong>${online.displayName}</strong>${isAdmin?' <span class="admin-badge">OWNER / ADMIN</span>':''}</div>
        <div class="al-desc">Email: ${user.email}</div>
        <div class="al-points">UID: ${user.uid}</div>
        <div class="shop-btns" style="margin-top:12px">
          <button class="btn btn-sm" onclick="online.saveToCloud()">Save to Cloud</button>
          <button class="btn btn-sm" onclick="ui.cloudLoad()">Load from Cloud</button>
          <button class="btn btn-sm btn-danger" onclick="online.signOut()">Sign Out</button>
        </div>
      </div>`;
      html += `<div class="settings-section" style="margin-top:16px">
        <h3>Change Display Name</h3>
        <div style="display:flex;gap:8px"><input type="text" id="name-input" class="chat-input" placeholder="New display name" value="${online.displayName||''}"><button class="btn btn-sm" onclick="online.setDisplayName(document.getElementById('name-input').value)">Update</button></div>
      </div>`;
    } else if (user && isAnon) {
      html += `<div class="alignment-display">
        <div class="al-current">Anonymous Session</div>
        <div class="al-desc">Create an account to save progress to the cloud, appear on leaderboards, and keep your data across devices.</div>
      </div>`;
      html += `<div class="settings-section" style="margin-top:16px">
        <h3>Create Account</h3>
        <div style="display:flex;flex-direction:column;gap:8px;max-width:340px">
          <input type="text" id="reg-name" class="chat-input" placeholder="Display Name">
          <input type="email" id="reg-email" class="chat-input" placeholder="Email">
          <input type="password" id="reg-pass" class="chat-input" placeholder="Password (6+ chars)">
          <button class="btn" onclick="online.createAccount(document.getElementById('reg-email').value, document.getElementById('reg-pass').value, document.getElementById('reg-name').value)">Create Account</button>
        </div>
        <h3 style="margin-top:16px">Or Sign In</h3>
        <div style="display:flex;flex-direction:column;gap:8px;max-width:340px">
          <input type="email" id="login-email" class="chat-input" placeholder="Email">
          <input type="password" id="login-pass" class="chat-input" placeholder="Password">
          <button class="btn" onclick="online.signIn(document.getElementById('login-email').value, document.getElementById('login-pass').value)">Sign In</button>
        </div>
      </div>`;
      html += `<div class="settings-section" style="margin-top:16px">
        <h3>Set Display Name</h3>
        <div style="display:flex;gap:8px"><input type="text" id="name-input" class="chat-input" placeholder="Display name" value="${online.displayName||''}"><button class="btn btn-sm" onclick="online.setDisplayName(document.getElementById('name-input').value)">Set Name</button></div>
      </div>`;
    }
    el.innerHTML = html;
  }

  async cloudLoad() {
    if (typeof online === 'undefined' || !online.isOnline) return;
    const save = await online.loadFromCloud();
    if (save) {
      if (confirm('Load cloud save? This will overwrite your local progress.')) {
        game.state = save;
        game.migrateSave();
        game.save();
        this.renderSidebar();
        this.renderPage(this.currentPage);
      }
    } else {
      this.toast({ type:'warn', text:'No cloud save found.' });
    }
  }

  // ── CHAT PAGE ──────────────────────────────────────────
  renderChatPage(el) {
    const isOnline = typeof online !== 'undefined' && online.isOnline;
    let html = this.header('Global Chat','scroll','Talk to other survivors. Admins have special commands.',null);

    if (!isOnline) {
      html += '<div class="bank-empty">Sign in to use chat.</div>';
      el.innerHTML = html; return;
    }

    const isAdmin = typeof ADMIN_UIDS !== 'undefined' && ADMIN_UIDS.includes(online.user?.uid);

    html += `<div class="chat-container-v2">
      <div class="chat-header">
        <span class="ch-title">Global Chat</span>
        <span class="ch-online">${online.displayName} [Cb${game.getCombatLevel()}]</span>
      </div>
      <div id="chat-messages" class="chat-messages-v2"></div>
      <div class="chat-input-bar-v2">
        <input type="text" id="chat-input" class="chat-input-v2" placeholder="${isAdmin?'Type /help for admin commands...':'Type a message...'}" maxlength="300" onkeydown="if(event.key==='Enter')ui.sendChat()">
        <button class="btn btn-sm" onclick="ui.sendChat()">Send</button>
      </div>
      ${isAdmin ? '<div class="chat-admin-hint">Admin: /give /xp /announce /clear /mute /stats /broadcast</div>' : ''}
    </div>`;
    el.innerHTML = html;

    online.listenToChat((msgs) => {
      const container = document.getElementById('chat-messages');
      if (!container) return;
      container.innerHTML = msgs.map(m => {
        const isMe = online.user && m.uid === online.user.uid;
        const isAdminMsg = typeof ADMIN_UIDS !== 'undefined' && ADMIN_UIDS.includes(m.uid);
        const time = m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : '';
        const isSys = m.system;
        if (isSys) {
          return `<div class="chat-msg chat-system"><span class="chat-sys-text">${this.escHtml(m.text)}</span><span class="chat-time">${time}</span></div>`;
        }
        return `<div class="chat-msg ${isMe?'chat-mine':''} ${isAdminMsg?'chat-admin-msg':''}">
          <span class="chat-time">${time}</span>
          ${isAdminMsg?'<span class="chat-badge">ADMIN</span>':''}
          <span class="chat-name" style="${isMe?'color:var(--accent)':isAdminMsg?'color:#d4a83a':''}">${this.escHtml(m.name)}</span>
          <span class="chat-level">[${m.totalLevel||'?'}]</span>
          <span class="chat-text">${this.escHtml(m.text)}</span>
        </div>`;
      }).join('');
      container.scrollTop = container.scrollHeight;
    });
  }

  sendChat() {
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    input.value = '';

    // Admin commands
    const isAdmin = typeof ADMIN_UIDS !== 'undefined' && ADMIN_UIDS.includes(online.user?.uid);
    if (isAdmin && text.startsWith('/')) {
      this.handleAdminCommand(text);
      return;
    }

    online.sendMessage(text);
  }

  handleAdminCommand(text) {
    const parts = text.split(' ');
    const cmd = parts[0].toLowerCase();

    switch(cmd) {
      case '/help':
        this.toast({type:'info', text:'Commands: /give [item] [qty], /xp [skill] [amount], /gold [amount], /announce [msg], /stats, /heal, /maxall, /broadcast [msg]'});
        break;

      case '/give': {
        const itemId = parts[1];
        const qty = parseInt(parts[2]) || 1;
        if (!itemId || !GAME_DATA.items[itemId]) { this.toast({type:'warn',text:'Item not found. Use item IDs like iron_sword, dragon_bones, etc.'}); return; }
        game.addItem(itemId, qty);
        this.toast({type:'success', text:`Admin: Given ${qty}x ${GAME_DATA.items[itemId].name}`});
        break;
      }

      case '/xp': {
        const skill = parts[1];
        const amount = parseInt(parts[2]) || 1000;
        if (!skill || !game.state.skills[skill]) { this.toast({type:'warn',text:'Invalid skill. Use: attack, strength, mining, etc.'}); return; }
        game.addXp(skill, amount);
        this.toast({type:'success', text:`Admin: +${amount} ${skill} XP`});
        break;
      }

      case '/gold': {
        const amount = parseInt(parts[1]) || 10000;
        game.state.gold += amount;
        this.toast({type:'success', text:`Admin: +${amount} gold`});
        break;
      }

      case '/heal':
        game.state.combat.playerHp = game.getMaxHp();
        game.state.prayerPoints = 99;
        this.toast({type:'success', text:'Admin: Full HP + Prayer restored'});
        break;

      case '/maxall':
        for (const sId of Object.keys(game.state.skills)) {
          game.state.skills[sId].level = 99;
          game.state.skills[sId].xp = 13034431;
        }
        this.toast({type:'success', text:'Admin: All skills set to 99'});
        this.renderSidebar();
        break;

      case '/announce':
      case '/broadcast': {
        const msg = parts.slice(1).join(' ');
        if (!msg) { this.toast({type:'warn',text:'Usage: /announce Your message here'}); return; }
        online.sendSystemMessage('[ADMIN] ' + msg);
        this.toast({type:'success', text:'Broadcast sent'});
        break;
      }

      case '/stats':
        this.toast({type:'info', text:`Gold:${game.state.gold} Kills:${game.state.stats.monstersKilled} TotalLv:${game.getTotalLevel()} CombatLv:${game.getCombatLevel()}`});
        break;

      default:
        this.toast({type:'warn', text:'Unknown command. Type /help'});
    }
  }

  escHtml(str) { const div = document.createElement('div'); div.textContent = str; return div.innerHTML; }

  filterSkillCat(cat, btn) {
    // Toggle category filter
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('cat-active'));
    btn.classList.add('cat-active');
    document.querySelectorAll('.skill-cat-section').forEach(sec => {
      if (cat === 'all' || sec.getAttribute('data-cat') === cat) {
        sec.style.display = '';
      } else {
        sec.style.display = 'none';
      }
    });
  }

  getRarityColor(itemId) {
    const item = GAME_DATA.items[itemId];
    if (!item?.rarity || !GAME_DATA.rarities) return '';
    return GAME_DATA.rarities[item.rarity]?.color || '';
  }

  getRarityTag(itemId) {
    const item = GAME_DATA.items[itemId];
    if (!item?.rarity || item.rarity === 'common' || !GAME_DATA.rarities) return '';
    const r = GAME_DATA.rarities[item.rarity];
    return `<span class="rarity-tag" style="color:${r.color}">${r.name}</span>`;
  }

  // ── PVP ARENA PAGE ─────────────────────────────────────
  renderPvPPage(el) {
    const isOnline = typeof online !== 'undefined' && online.isOnline;
    const s = this.engine.state;
    let html = this.header('PvP Arena','combat','Submit your build and fight other players for gold, loot, and glory.',null);

    if (!isOnline) {
      html += '<div class="bank-empty">Online features not available. Configure Firebase to enable PvP.</div>';
      el.innerHTML = html;
      return;
    }

    html += `<div class="prayer-info">
      <div class="stat-row"><span>PvP Rating</span><span class="pi-val gold-val">${online.pvpRating}</span></div>
      <div class="stat-row"><span>Combat Level</span><span class="pi-val">${this.engine.getCombatLevel()}</span></div>
      <div class="stat-row"><span>Style</span><span class="pi-val">${s.combat.combatStyle}</span></div>
    </div>`;

    html += `<div class="alignment-display">
      <div class="al-current">How PvP Works</div>
      <div class="al-desc">Submit your current build (equipment + stats + combat style). The system matches you against a similar-level opponent. Combat resolves automatically using the game's formulas. Winners earn gold, rating, and loot from the PvP loot table. Losers lose some rating.</div>
      <button class="btn" style="margin-top:12px" onclick="ui.startPvP()" id="pvp-fight-btn">Fight</button>
    </div>`;

    // PvP result display area
    html += '<div id="pvp-result"></div>';

    // History
    html += '<h2 class="section-title">Recent Fights</h2><div id="pvp-history"><div class="bank-empty">Loading...</div></div>';
    el.innerHTML = html;
    this.loadPvPHistory();
  }

  async startPvP() {
    const btn = document.getElementById('pvp-fight-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Searching...'; }
    const result = await online.submitPvPChallenge();
    if (btn) { btn.disabled = false; btn.textContent = 'Fight'; }
    // Combat started via engine - combatStart event auto-navigates to combat page
    // Results handled by onMonsterDeath/onPlayerDeath with _pvpArena flag
  }

  async loadPvPHistory() {
    const container = document.getElementById('pvp-history');
    if (!container) return;
    const history = await online.getPvPHistory();
    if (history.length === 0) {
      container.innerHTML = '<div class="bank-empty">No fights yet. Click Fight to start.</div>';
      return;
    }
    container.innerHTML = '<div class="stats-grid">' + history.map(h => {
      const isWinner = online.user && h.winner === online.user.uid;
      return `<div class="stat-card" style="border-left:3px solid ${isWinner?'#4a8a3e':'#8a3a3a'}">
        <div class="stat-label">${isWinner?'Won':'Lost'} vs ${isWinner?h.loserName:h.winnerName}</div>
        <div class="stat-value" style="font-size:12px">${h.turns} turns | Rating ${h.ratingChange>0?'+':''}${h.ratingChange}</div>
      </div>`;
    }).join('') + '</div>';
  }

  // ── BOUNTY BOARD PAGE ──────────────────────────────────
  renderBountyPage(el) {
    const isOnline = typeof online !== 'undefined' && online.isOnline;
    let html = this.header('Bounty Board','coin','Place bounties on players. Defeat them in PvP to claim the reward.',null);

    if (!isOnline) {
      html += '<div class="bank-empty">Online features not available. Configure Firebase to enable bounties.</div>';
      el.innerHTML = html;
      return;
    }

    html += `<div class="settings-section">
      <h3>Place a Bounty</h3>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <input type="text" id="bounty-target" class="chat-input" placeholder="Target player name">
        <input type="number" id="bounty-amount" class="chat-input" placeholder="Gold amount (min 100)" min="100" style="width:160px">
        <button class="btn btn-sm" onclick="ui.placeBounty()">Place Bounty</button>
      </div>
    </div>`;

    html += '<h2 class="section-title">Active Bounties</h2><div id="bounty-list"><div class="bank-empty">Loading...</div></div>';
    el.innerHTML = html;
    this.loadBounties();
  }

  async placeBounty() {
    const target = document.getElementById('bounty-target')?.value;
    const amount = parseInt(document.getElementById('bounty-amount')?.value || 0);
    if (!target || amount < 100) { this.toast({ type:'warn', text:'Enter a player name and at least 100 gold.' }); return; }
    await online.placeBounty(target, amount);
    this.loadBounties();
  }

  async loadBounties() {
    const container = document.getElementById('bounty-list');
    if (!container) return;
    const bounties = await online.getActiveBounties();
    if (bounties.length === 0) {
      container.innerHTML = '<div class="bank-empty">No active bounties. Be the first to place one.</div>';
      return;
    }
    container.innerHTML = '<div class="actions-grid">' + bounties.map(b => {
      const expired = b.expiresAt && b.expiresAt.toDate && b.expiresAt.toDate() < new Date();
      return `<div class="action-card ${expired?'locked':''}">
        <div class="ac-header"><span class="ac-name">Target: ${this.escHtml(b.targetName)}</span><span class="ac-level">${this.fmt(b.amount)} gold</span></div>
        <div class="ac-footer"><span>Placed by: ${this.escHtml(b.placedByName)}</span></div>
        ${!expired?`<button class="btn btn-xs" onclick="online.claimBounty('${b.id}').then(()=>ui.loadBounties())">Claim (after PvP win)</button>`:'<div class="locked-overlay">Expired</div>'}
      </div>`;
    }).join('') + '</div>';
  }

  // ── LEADERBOARD PAGE ───────────────────────────────────
  renderLeaderboardPage(el) {
    const isOnline = typeof online !== 'undefined' && online.isOnline;
    let html = this.header('Leaderboard','trophy','See who dominates the Ashfall. Sync your stats to appear.',null);

    if (!isOnline) {
      html += '<div class="bank-empty">Sign in to view and appear on leaderboards.</div>';
      el.innerHTML = html;
      return;
    }

    // Sync button
    html += `<div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap">
      <button class="btn btn-sm" onclick="online.syncProfile().then(()=>ui.toast({type:'success',text:'Stats synced to leaderboard!'}))">Sync My Stats</button>
    </div>`;

    // Category tabs
    const cats = [
      {id:'totalLevel',label:'Total Level'},
      {id:'combatLevel',label:'Combat'},
      {id:'totalXp',label:'Total XP'},
      {id:'kills',label:'Kills'},
      {id:'goldEarned',label:'Gold'},
      {id:'pvpRating',label:'PvP'},
      {id:'questsCompleted',label:'Quests'},
      {id:'playTime',label:'Play Time'},
    ];
    const skillCats = [
      {id:'skills.attack',label:'Atk'},{id:'skills.strength',label:'Str'},{id:'skills.defence',label:'Def'},
      {id:'skills.hitpoints',label:'HP'},{id:'skills.ranged',label:'Rng'},{id:'skills.magic',label:'Mag'},
      {id:'skills.prayer',label:'Pray'},{id:'skills.slayer',label:'Slay'},{id:'skills.necromancy',label:'Necro'},
      {id:'skills.mining',label:'Mine'},{id:'skills.woodcutting',label:'WC'},{id:'skills.fishing',label:'Fish'},
      {id:'skills.cooking',label:'Cook'},{id:'skills.smithing',label:'Smith'},{id:'skills.fletching',label:'Fletch'},
      {id:'skills.crafting',label:'Craft'},{id:'skills.alchemy',label:'Alch'},{id:'skills.enchanting',label:'Ench'},{id:'skills.incantation',label:'Incan'},
      {id:'skills.farming',label:'Farm'},{id:'skills.thieving',label:'Thiev'},
    ];

    const activeCat = this._lbCategory || 'totalLevel';
    html += '<div class="lb-tabs"><div class="lb-tab-section"><div class="lb-tab-label">Stats</div><div class="lb-tab-btns">';
    for (const cat of cats) {
      html += `<button class="lb-tab ${activeCat===cat.id?'lb-tab-active':''}" onclick="ui.loadLeaderboardCategory('${cat.id}')">${cat.label}</button>`;
    }
    html += '</div></div><div class="lb-tab-section"><div class="lb-tab-label">Skills</div><div class="lb-tab-btns">';
    for (const cat of skillCats) {
      html += `<button class="lb-tab ${activeCat===cat.id?'lb-tab-active':''}" onclick="ui.loadLeaderboardCategory('${cat.id}')">${cat.label}</button>`;
    }
    html += '</div></div></div>';

    html += '<div id="leaderboard-list"><div class="bank-empty">Loading...</div></div>';
    el.innerHTML = html;
    this.loadLeaderboardCategory(activeCat);
  }

  async loadLeaderboardCategory(category) {
    this._lbCategory = category;
    const container = document.getElementById('leaderboard-list');
    if (!container) return;
    container.innerHTML = '<div class="bank-empty">Loading...</div>';

    // Update active tab visually
    document.querySelectorAll('.lb-tab').forEach(t => {
      t.classList.remove('lb-tab-active');
      if (t.getAttribute('onclick')?.includes("'"+category+"'")) t.classList.add('lb-tab-active');
    });

    const board = await online.getLeaderboard(category, 50);
    if (board.length === 0) {
      container.innerHTML = '<div class="bank-empty">No players yet. Click "Sync My Stats" to appear!</div>';
      return;
    }

    const isSkill = category.startsWith('skills.');
    const skillKey = isSkill ? category.split('.')[1] : null;
    const catLabel = category === 'totalLevel' ? 'Total Lv' : category === 'combatLevel' ? 'Cb Lv' : category === 'totalXp' ? 'Total XP' : category === 'kills' ? 'Kills' : category === 'goldEarned' ? 'Gold' : category === 'pvpRating' ? 'Rating' : category === 'questsCompleted' ? 'Quests' : category === 'playTime' ? 'Time' : skillKey ? (GAME_DATA.skills[skillKey]?.name||skillKey)+' Lv' : category;

    let html = `<div class="leaderboard-table">
      <div class="lb-header"><span class="lb-rank">#</span><span class="lb-name">Player</span><span class="lb-val">${catLabel}</span><span class="lb-total">Total Lv</span><span class="lb-cb">Cb Lv</span></div>`;

    board.forEach((p, i) => {
      const isMe = online.user && p.uid === online.user.uid;
      let val;
      if (isSkill) val = p.skills?.[skillKey] || 1;
      else val = p[category] || 0;

      let displayVal;
      if (category === 'playTime') {
        const hrs = Math.floor(val / 3600);
        const mins = Math.floor((val % 3600) / 60);
        displayVal = `${hrs}h ${mins}m`;
      } else if (category === 'totalXp' || category === 'goldEarned') {
        displayVal = val >= 1000000 ? (val/1000000).toFixed(1)+'M' : this.fmt(val);
      } else {
        displayVal = this.fmt(val);
      }

      const medal = i === 0 ? 'lb-gold' : i === 1 ? 'lb-silver' : i === 2 ? 'lb-bronze' : '';
      html += `<div class="lb-row ${isMe?'lb-me':''} ${medal}">
        <span class="lb-rank">${i === 0 ? '&#x1F947;' : i === 1 ? '&#x1F948;' : i === 2 ? '&#x1F949;' : i+1}</span>
        <span class="lb-name">${this.escHtml(p.displayName||'Unknown')}</span>
        <span class="lb-val">${displayVal}</span>
        <span class="lb-total">${p.totalLevel||'?'}</span>
        <span class="lb-cb">${p.combatLevel||'?'}</span>
      </div>`;
    });
    html += '</div>';
    container.innerHTML = html;
  }

  // ── ACTIONS ────────────────────────────────────────────
  startAction(sId, aId) { this.engine.startSkill(sId, aId); }
  stopAction() { this.engine.stopSkill(); this.renderPage(this.currentPage); }
  setStyle(s) { this.engine.state.combat.combatStyle = s; this.engine.state.combat.xpMode = s==='melee'?'controlled':s==='ranged'?'accurate':'standard'; this.renderPage('combat'); }
  setXpMode(m) { this.engine.state.combat.xpMode = m; this.renderPage('combat'); }
  selectSpell(id) { this.engine.state.combat.selectedSpell = id; this.renderPage('combat'); }
  toggleAutoEat() { this.engine.state.combat.autoEat = !this.engine.state.combat.autoEat; }

  exportSave() {
    const d = this.engine.exportSave();
    navigator.clipboard.writeText(d).then(() => this.toast({type:'success',text:'Save copied to clipboard!'})).catch(() => {
      const t = document.createElement('textarea'); t.value = d; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t);
      this.toast({type:'success',text:'Save copied!'});
    });
  }
  importSavePrompt() {
    const d = prompt('Paste your save data:');
    if (d && this.engine.importSave(d)) { this.toast({type:'success',text:'Save imported!'}); location.reload(); }
    else if (d) this.toast({type:'danger',text:'Invalid save data.'});
  }

  toast(n) {
    let c = document.getElementById('notif-container');
    if (!c) {
      c = document.createElement('div');
      c.id = 'notif-container';
      c.className = 'notif-container';
      document.body.appendChild(c);
    }
    const t = document.createElement('div');
    t.className = `notif notif-${n.type||'info'}`;
    t.textContent = n.text;
    c.appendChild(t);
    const duration = n.type === 'achievement' || n.type === 'levelup' ? 5000 : n.type === 'rare' ? 4500 : 3000;
    setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateX(100%)'; t.style.transition='all 0.3s'; setTimeout(()=>t.remove(), 300); }, duration);
    // Keep max 5 notifications
    while (c.children.length > 5) c.removeChild(c.firstChild);
  }

  showHitSplat(d) {
    const area = d.who === 'player' ? document.getElementById('monster-splats') : document.getElementById('player-splats');
    if (!area) return;
    const splat = document.createElement('div');
    splat.className = `hit-splat ${d.miss ? 'splat-miss' : d.crit ? 'splat-crit' : d.dmg > 20 ? 'splat-big' : 'splat-hit'}`;
    splat.textContent = d.miss ? 'Miss' : d.dmg;
    splat.style.left = (20 + Math.random() * 60) + '%';
    area.appendChild(splat);
    setTimeout(() => splat.remove(), 900);

    // Attack animation overlay
    const combatArena = document.querySelector('.combat-arena');
    if (!combatArena) return;
    const anim = document.createElement('div');
    if (d.who === 'player') {
      // Player attacks monster
      const style = this.engine.state.combat.combatStyle;
      if (style === 'melee') {
        anim.className = 'atk-anim atk-slash';
        anim.innerHTML = `<svg viewBox="0 0 80 80"><path d="M10 70 Q40 20 70 10" stroke="${d.crit?'#d4a83a':'#c8cad4'}" stroke-width="${d.crit?4:2.5}" fill="none" stroke-linecap="round" opacity="0.8"><animate attributeName="stroke-dasharray" from="0 200" to="200 0" dur="0.3s" fill="freeze"/></path>${d.crit?'<circle cx="40" cy="40" r="0" fill="none" stroke="#d4a83a" stroke-width="2" opacity="0.6"><animate attributeName="r" from="5" to="35" dur="0.4s" fill="freeze"/><animate attributeName="opacity" from="0.8" to="0" dur="0.4s" fill="freeze"/></circle>':''}</svg>`;
      } else if (style === 'ranged') {
        anim.className = 'atk-anim atk-arrow';
        anim.innerHTML = `<svg viewBox="0 0 80 40"><line x1="0" y1="20" x2="80" y2="20" stroke="#8a6a3a" stroke-width="2"><animate attributeName="x1" from="-20" to="80" dur="0.25s" fill="freeze"/></line><polygon points="75,15 85,20 75,25" fill="#8a6a3a"><animate attributeName="opacity" from="1" to="0" dur="0.3s" begin="0.2s" fill="freeze"/></polygon></svg>`;
      } else {
        anim.className = 'atk-anim atk-spell';
        anim.innerHTML = `<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="3" fill="#6a8ae8" opacity="0.9"><animate attributeName="r" from="3" to="25" dur="0.35s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" dur="0.35s" fill="freeze"/></circle><circle cx="40" cy="40" r="1" fill="#a0c0ff"><animate attributeName="r" from="1" to="15" dur="0.25s" fill="freeze"/><animate attributeName="opacity" from="1" to="0" dur="0.3s" fill="freeze"/></circle></svg>`;
      }
    } else {
      // Monster attacks player
      anim.className = 'atk-anim atk-claw';
      anim.innerHTML = `<svg viewBox="0 0 60 60"><path d="M10 50 L30 20 L15 45" stroke="#c44040" stroke-width="2" fill="none" opacity="0.8"><animate attributeName="stroke-dasharray" from="0 100" to="100 0" dur="0.2s" fill="freeze"/></path><path d="M25 50 L40 15 L30 45" stroke="#c44040" stroke-width="2" fill="none" opacity="0.7"><animate attributeName="stroke-dasharray" from="0 100" to="100 0" dur="0.2s" begin="0.05s" fill="freeze"/></path><path d="M40 50 L50 20 L45 45" stroke="#c44040" stroke-width="2" fill="none" opacity="0.6"><animate attributeName="stroke-dasharray" from="0 100" to="100 0" dur="0.2s" begin="0.1s" fill="freeze"/></path></svg>`;
    }
    combatArena.appendChild(anim);
    setTimeout(() => anim.remove(), 600);

    // Shake/flash the target
    if (d.who === 'player' && !d.miss) {
      const monArt = document.querySelector('.monster-art');
      if (monArt) { monArt.classList.add('hit-shake'); setTimeout(()=>monArt.classList.remove('hit-shake'), 200); }
    } else if (d.who === 'monster' && !d.miss) {
      const pSide = document.querySelector('.player-side');
      if (pSide) { pSide.classList.add('hit-flash'); setTimeout(()=>pSide.classList.remove('hit-flash'), 300); }
    }
  }

  showXpGain(d) {
    const panel = document.getElementById('combat-xp-panel');
    if (!panel) return;
    const popup = document.createElement('div');
    popup.className = 'xp-gain-popup';
    popup.textContent = d.text;
    panel.style.position = 'relative';
    panel.appendChild(popup);
    setTimeout(() => popup.remove(), 1500);
  }

  showRandomEvent(d) {
    const overlay = document.createElement('div');
    overlay.className = 'random-event-overlay';
    const icons = { genie:'sparkle', treasure:'coin', merchant:'shop', stranger:'npc', afk_check:'shield' };
    overlay.innerHTML = `<div class="re-modal">
      <div class="re-icon">${icon(icons[d.type]||'sparkle', 48)}</div>
      <div class="re-title">Random Event!</div>
      <div class="re-text">${d.text}</div>
      <button class="btn re-btn" onclick="this.closest('.random-event-overlay').remove();${d.type==='afk_check'?'game.dismissAfkCheck();':''}">
        ${d.type === 'afk_check' ? 'I am here!' : 'Continue'}
      </button>
    </div>`;
    document.body.appendChild(overlay);
    // Auto-dismiss non-afk events after 8 seconds
    if (d.type !== 'afk_check') setTimeout(() => overlay.remove(), 8000);
  }

  onTick() {
    const s = this.engine.state;

    // ── TRAINING BAR (always visible) ──
    const tbFill = document.querySelector('.tb-fill');
    if (tbFill && s.activeSkill && s.activeAction) {
      const action = this.engine._findAction(s.activeSkill, s.activeAction);
      if (action) {
        const mRed = 1 + (this.engine.getMasteryLevel(s.activeSkill, action.masteryId||action.id) * 0.005);
        const tRed = 1 + (this.engine.getToolSpeedBonus(s.activeSkill) / 100);
        tbFill.style.width = (Math.min(1, Math.max(0, s.actionProgress / (action.time / mRed / tRed))) * 100).toFixed(0) + '%';
      }
    }

    // ── INLINE ACTION BAR on skill pages ──
    const aaFill = document.querySelector('.aa-fill');
    if (aaFill && s.activeSkill && s.activeAction) {
      const action = this.engine._findAction(s.activeSkill, s.activeAction);
      if (action) {
        const mRed = 1 + (this.engine.getMasteryLevel(s.activeSkill, action.masteryId||action.id) * 0.005);
        const tRed = 1 + (this.engine.getToolSpeedBonus(s.activeSkill) / 100);
        aaFill.style.width = (Math.min(1, Math.max(0, s.actionProgress / (action.time / mRed / tRed))) * 100).toFixed(0) + '%';
      }
    }

    // ── SIDEBAR gold (always visible) ──
    const gv = document.querySelector('.gold-val');
    if (gv) gv.textContent = this.fmt(s.gold);

    // ── XP BAR on skill pages ──
    const xpFill = document.querySelector('.sh-xp-fill:not(.growing-fill):not(.rep-fill)');
    if (xpFill && this.currentPage) {
      const sk = GAME_DATA.skills[this.currentPage];
      if (sk && s.skills[this.currentPage]) {
        const p = this.engine.getXpProgress(this.currentPage);
        xpFill.style.width = (p * 100).toFixed(1) + '%';
      }
    }
    // Update XP text on skill pages
    const xpText = document.querySelector('.sh-xp-text');
    if (xpText && s.skills[this.currentPage]) {
      const sk = s.skills[this.currentPage];
      const next = sk.level >= 99 ? 'MAX' : this.fmt(this.engine.getXpForLevel(sk.level + 1) - sk.xp);
      xpText.textContent = `${this.fmt(sk.xp)} XP ${sk.level<99?`(${next} to next)`:''}`;
    }
    // Update level display
    const lvDisp = document.querySelector('.sh-level');
    if (lvDisp && s.skills[this.currentPage]) lvDisp.textContent = `Level ${s.skills[this.currentPage].level}`;

    // ── COMBAT PAGE live updates ──
    if (s.combat.active && s.combat.monster) {
      const mon = GAME_DATA.monsters[s.combat.monster] || GAME_DATA.worldBosses.find(b=>b.id===s.combat.monster);
      if (mon) {
        const max = this.engine.getMaxHp();
        // HP bars
        const phpBar = document.getElementById('php-bar');
        const mhpBar = document.getElementById('mhp-bar');
        const phpText = document.getElementById('php-text');
        const mhpText = document.getElementById('mhp-text');
        if (phpBar) phpBar.style.width = Math.max(0, s.combat.playerHp / max * 100).toFixed(1) + '%';
        if (mhpBar) mhpBar.style.width = Math.max(0, s.combat.monsterHp / mon.hp * 100).toFixed(1) + '%';
        if (phpText) phpText.textContent = `${Math.max(0,Math.floor(s.combat.playerHp))} / ${max}`;
        if (mhpText) mhpText.textContent = `${Math.max(0,Math.ceil(s.combat.monsterHp))} / ${mon.hp}`;
        // Prayer points
        const ppEl = document.getElementById('pp-live');
        if (ppEl) ppEl.textContent = s.prayerPoints;
        // Food bag quantities
        for (let i = 0; i < (s.foodBag||[]).length; i++) {
          const el = document.getElementById('fb-qty-' + i);
          if (el && s.foodBag[i]) el.textContent = 'x' + s.foodBag[i].qty;
        }
        // Combat XP bars (live updating)
        for (const sId of ['attack','strength','defence','hitpoints','ranged','magic','prayer','slayer']) {
          const sk = s.skills[sId]; if (!sk) continue;
          const lvEl = document.getElementById('cxp-lv-' + sId);
          const fillEl = document.getElementById('cxp-fill-' + sId);
          const xpEl = document.getElementById('cxp-xp-' + sId);
          if (lvEl) {
            if (lvEl.textContent !== String(sk.level)) { lvEl.textContent = sk.level; lvEl.classList.add('cxp-flash'); setTimeout(()=>lvEl.classList.remove('cxp-flash'), 800); }
          }
          if (fillEl) fillEl.style.width = (this.engine.getXpProgress(sId) * 100).toFixed(1) + '%';
          if (xpEl) xpEl.textContent = this.fmt(sk.xp);
        }
        // Kill counter
        const killEl = document.getElementById('kill-count');
        if (killEl) killEl.textContent = s.stats.monstersKilled;
        // Spec bar
        const specFill = document.getElementById('spec-fill');
        const specPct = document.getElementById('spec-pct');
        if (specFill) specFill.style.width = (s.specEnergy||0) + '%';
        if (specPct) specPct.textContent = (s.specEnergy||0) + '%';
        // Ability cooldown overlays (real-time)
        for (let i = 0; i < 4; i++) {
          const aid = s.equippedAbilities[i];
          if (!aid) continue;
          const ab = GAME_DATA.abilities.find(a=>a.id===aid);
          if (!ab) continue;
          const cd = s.combat.abilityCooldowns[aid] || 0;
          const slotEl = document.querySelectorAll('.ab-slot-v2')[i];
          if (slotEl) {
            const overlay = slotEl.querySelector('.ab-cd-overlay');
            const timer = slotEl.querySelector('.ab-timer');
            if (overlay) overlay.style.height = (cd > 0 ? Math.min(100, (cd / ab.cooldown) * 100) : 0) + '%';
            if (timer) timer.textContent = cd > 0 ? Math.ceil(cd) + 's' : 'Ready';
            if (cd > 0) slotEl.classList.add('ab-cd'); else slotEl.classList.remove('ab-cd');
          }
        }
      }
    }

    // ── FAMILIAR TIMER (live) ──
    const famTimer = document.getElementById('fam-timer');
    if (famTimer && s.familiar?.active) {
      famTimer.textContent = Math.floor(s.familiar.timeLeft / 60) + 'm';
    }

    // ── POTION BELT QTY (live) ──
    for (let i = 0; i < 4; i++) {
      const el = document.getElementById('pb-qty-' + i);
      if (el && s.potionBelt[i]) el.textContent = s.potionBelt[i].qty;
    }

    // ── ACTIVE BUFFS (live) ──
    const buffsEl = document.getElementById('active-buffs');
    if (buffsEl && s.combat.activeBuffs) {
      buffsEl.innerHTML = s.combat.activeBuffs.map(buff => {
        const label = buff.stat === 'damageMult' ? 'Dmg x'+buff.value.toFixed(1) : buff.stat.replace('Bonus','') + ' +' + buff.value;
        return `<span class="buff-chip">${label} <small>${Math.ceil(buff.remaining)}s</small></span>`;
      }).join('');
    }

    // ── LEVEL TRACKER in sidebar (live) ──
    for (const sId of Object.keys(GAME_DATA.skills)) {
      const el = document.getElementById('lt-' + sId);
      if (el && s.skills[sId]) {
        const lvl = el.querySelector('.lt-lvl');
        if (lvl && lvl.textContent !== String(s.skills[sId].level)) {
          lvl.textContent = s.skills[sId].level;
          el.classList.add('level-up-flash');
          setTimeout(() => el.classList.remove('level-up-flash'), 800);
        }
      }
    }

    // ── FARM TIMERS ──
    document.querySelectorAll('.plot-timer').forEach((el, i) => {
      const plot = s.farming.plots[i];
      if (plot && plot.plantedAt && !plot.ready) {
        const left = Math.max(0, Math.ceil((plot.growTime - (Date.now()-plot.plantedAt))/1000));
        el.textContent = this.fmtTime(left);
      }
    });
    // Farm progress bars
    document.querySelectorAll('.growing-fill').forEach((el, i) => {
      const plot = s.farming.plots[i];
      if (plot && plot.plantedAt && !plot.ready) {
        const pct = Math.min(100, (Date.now() - plot.plantedAt) / plot.growTime * 100);
        el.style.width = pct.toFixed(1) + '%';
      }
    });

    // ── LIVE ITEM QUANTITIES (skill pages, bank, recipes) ──
    // Update all elements with data-item-qty attribute
    document.querySelectorAll('[data-item-qty]').forEach(el => {
      const itemId = el.getAttribute('data-item-qty');
      const qty = s.bank[itemId] || 0;
      const newText = '(' + qty + ')';
      if (el.textContent !== newText) el.textContent = newText;
    });
    // Update material missing/available status
    document.querySelectorAll('[data-mat]').forEach(el => {
      const itemId = el.getAttribute('data-mat');
      const need = parseInt(el.getAttribute('data-need')) || 1;
      const have = s.bank[itemId] || 0;
      if (have >= need) el.classList.remove('mat-missing');
      else el.classList.add('mat-missing');
    });
    // Bank page quantities
    document.querySelectorAll('[data-bank-qty]').forEach(el => {
      const itemId = el.getAttribute('data-bank-qty');
      const qty = s.bank[itemId] || 0;
      if (el.textContent !== 'x' + this.fmt(qty)) el.textContent = 'x' + this.fmt(qty);
    });
    // Charm counts on summoning page
    for (const cId of ['gold_charm','green_charm','crimson_charm','blue_charm','spirit_shards']) {
      const el = document.getElementById('charm-' + cId);
      if (el) el.textContent = s.bank[cId] || 0;
    }
  }

  fmt(n) {
    if (n >= 1e9) return (n/1e9).toFixed(1)+'B';
    if (n >= 1e6) return (n/1e6).toFixed(1)+'M';
    if (n >= 1e4) return (n/1e3).toFixed(1)+'K';
    return Math.floor(n).toLocaleString();
  }
  fmtTime(s) {
    if (s < 60) return `${s}s`;
    if (s < 3600) return `${Math.floor(s/60)}m ${s%60}s`;
    return `${Math.floor(s/3600)}h ${Math.floor((s%3600)/60)}m`;
  }

  bindEvents() {
    const t = document.getElementById('sidebar-toggle');
    if (t) t.addEventListener('click', () => document.getElementById('sidebar').classList.toggle('open'));
    document.addEventListener('click', (e) => {
      if (e.target.closest('.nav-item')) document.getElementById('sidebar').classList.remove('open');
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.ui = new UI(game);
  game.init();
  ui.init();
});
