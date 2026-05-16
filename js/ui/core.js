// ================================================================
// ASHFALL IDLE — ui/core.js
// Base UI class, router, all page renderers.
// TODO: Split into ui/combat.js, ui/skills.js, ui/quests.js etc.
// Source: _ui_legacy.js + skills-ui-integration.js + navigation-search.js
//         + smart-search.js + upgrades.js + codex.js
// ================================================================
// ============================================================
// ASHFALL IDLE - UI v2
// ============================================================

// Global HTML escape helper — prevents XSS in user-generated content
function escHtml(s) { if (!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

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
  { header:'Combat', icon:'⚔', items:[
    {id:'combat',       label:'Combat',        icon:'combat'},
    {id:'abilities',    label:'Abilities',     icon:'banner'},
    {id:'prayer',       label:'Prayer',        icon:'sparkle'},
    {id:'slayer',       label:'Slayer',        icon:'target'},
    {id:'slayer_bosses',label:'Slayer Bosses', icon:'skull'},
    {id:'wilderness',   label:'Wilderness',    icon:'combat'},
    {id:'world_bosses', label:'World Bosses',  icon:'worldboss'},
    {id:'dungeons',     label:'Dungeons',      icon:'dungeon'},
    {id:'fight_cave',   label:'Fight Cave',    icon:'combat'},
    {id:'theatre',      label:'Theatre of Ash',icon:'combat'},
    {id:'chambers',     label:'Chambers',      icon:'dungeon'},
    {id:'ashen_crypts', label:'Ashen Crypts',       icon:'skull'},
    {id:'unholy_prayers',label:'Unholy Prayers',  icon:'skull'},
    {id:'void_gauntlet', label:'Void Gauntlet',   icon:'skull'},
  ]},
  { header:'Magic', icon:'🔮', items:[
    {id:'spellbooks',   label:'Spellbooks',   icon:'wand'},
    {id:'necromancy',   label:'Necromancy',   icon:'skull'},
    {id:'summoning',    label:'Summoning',    icon:'sparkle'},
    {id:'incantation',  label:'Incantation',  icon:'wand'},
    {id:'enchanting',   label:'Enchanting',   icon:'sparkle'},
  ]},
  { header:'Gathering', icon:'🌲', items:[
    {id:'woodcutting',  label:'Woodcutting',  icon:'axe'},
    {id:'mining',       label:'Mining',       icon:'pickaxe'},
    {id:'fishing',      label:'Fishing',      icon:'fish'},
    {id:'foraging',     label:'Foraging',     icon:'herb'},
    {id:'hunting',      label:'Hunting',      icon:'paw'},
    {id:'agility',      label:'Agility',      icon:'run'},
    {id:'thieving',     label:'Thieving',     icon:'mask'},
    {id:'farming',      label:'Farming',      icon:'seedling'},
  ]},
  { header:'Artisan', icon:'⚒', items:[
    {id:'cooking',      label:'Cooking',      icon:'cauldron'},
    {id:'smithing',     label:'Smithing',     icon:'anvil'},
    {id:'fletching',    label:'Fletching',    icon:'bow'},
    {id:'crafting',     label:'Crafting',     icon:'ring'},
    {id:'alchemy',      label:'Alchemy',      icon:'potion'},
  ]},
  { header:'Inventory', icon:'🎒', items:[
    {id:'bank',         label:'Bank',         icon:'bank'},
    {id:'equipment',    label:'Equipment',    icon:'shield'},
    {id:'shop',         label:'Shop',         icon:'shop'},
    {id:'bazaar',       label:'Bazaar',       icon:'coin'},
    {id:'gear_sets',    label:'Gear Sets',    icon:'shield'},
  ]},
  { header:'World', icon:'🌍', items:[
    {id:'quests',       label:'Quests',       icon:'scroll'},
    {id:'clue_scrolls', label:'Clue Scrolls', icon:'scroll'},
    {id:'npcs',         label:'NPCs',         icon:'npc'},
    {id:'factions',     label:'Factions',     icon:'faction'},
    {id:'alignment',    label:'Alignment',    icon:'alignment'},
    {id:'achievement_diary', label:'Diaries',    icon:'target'},
    {id:'world_events', label:'World Events', icon:'globe'},
    {id:'storyline',    label:'Storyline',    icon:'book'},
    {id:'pets',         label:'Pets',         icon:'paw'},
    {id:'achievements', label:'Achievements', icon:'trophy'},
    {id:'codex',        label:'Codex',        icon:'book'},
    {id:'collection_log',label:'Collection', icon:'scroll'},
  ]},
  { header:'Social', icon:'👥', items:[
    {id:'account',      label:'Account',      icon:'npc'},
    {id:'character',    label:'Character',    icon:'shield'},
    {id:'prestige',     label:'Prestige',     icon:'sparkle'},
    {id:'guilds',       label:'Guilds',       icon:'faction'},
    {id:'friends',      label:'Friends',      icon:'npc'},
    {id:'inbox',        label:'Inbox',        icon:'scroll'},
    {id:'chat',         label:'Global Chat',  icon:'scroll'},
    {id:'leaderboard',  label:'Leaderboard',  icon:'trophy'},
    {id:'pvp_arena',    label:'PvP Arena',    icon:'combat'},
    {id:'bounty_board', label:'Bounties',     icon:'coin'},
    {id:'party',        label:'Party',        icon:'combat'},
  ]},
  { header:'System', icon:'⚙', items:[
    {id:'statistics',   label:'Statistics',   icon:'stats'},
    {id:'activity',     label:'Activity',     icon:'scroll'},
    {id:'upgrades',     label:'Upgrades',     icon:'sparkle'},
    {id:'settings_page',label:'Settings',     icon:'settings'},
    {id:'wiki',         label:'Wiki',         icon:'book'},
    {id:'admin',        label:'Admin',        icon:'settings'},
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
    this.engine.on('levelup', (d) => {
      this.renderSidebar();
      this.renderPage(this.currentPage);
      // Dramatic level-up banner
      this._showLevelUpBanner(d.skill, d.level);
    });
    this.engine.on('prestige', (d) => {
      this._showPrestigeBanner(d.rank, d.rankData);
      if (this.currentPage === 'prestige') this.renderPage('prestige');
    });
    this.engine.on('skillStart', () => { this.renderTrainingBar(); this.renderPage(this.currentPage); });
    this.engine.on('skillStop', () => { this.renderTrainingBar(); this.renderPage(this.currentPage); });
    this.engine.on('combatStart', () => { this.currentPage = 'combat'; this.renderTrainingBar(); this.renderSidebar(); this.renderPage('combat'); });
    this.engine.on('combatStop', () => { this.renderTrainingBar(); this.renderPage(this.currentPage); });
    this._initTheatreListeners();

    // ── ABILITY ANIMATIONS ──────────────────────────────────────
    this.engine.on('abilityUsed', (d) => {
      const ab = d.ability;
      const arena = document.querySelector('.combat-arena');
      if (!arena) return;

      // Flash the ability slot that was used
      const slots = document.querySelectorAll('.ab-slot-v2');
      const slotIdx = (this.engine.state.equippedAbilities||[]).indexOf(ab.id);
      if (slotIdx >= 0 && slots[slotIdx]) {
        slots[slotIdx].classList.add('ab-used-flash');
        setTimeout(() => slots[slotIdx]?.classList.remove('ab-used-flash'), 600);
      }

      // Create the ability animation overlay on the arena
      // Purge any stuck ability overlays first
      document.querySelectorAll('.ability-anim-overlay').forEach(el => el.remove());
      const overlay = document.createElement('div');
      overlay.className = 'ability-anim-overlay';
      overlay.innerHTML = this._getAbilityAnimSvg(ab.id, ab.effect?.type);
      // Force all SVG animations to use fill=remove (no freeze)
      overlay.querySelectorAll('animate, animateTransform, animateMotion').forEach(a => {
        a.setAttribute('fill', 'remove');
      });
      arena.appendChild(overlay);
      // Remove at exactly 900ms (matches abilityFadeOut CSS duration)
      setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 900);

      // Also shake/flash the monster art for damage abilities
      const damagingTypes = ['buff','combat_buff','spell_burst','nuke','multi'];
      if (damagingTypes.includes(ab.effect?.type)) {
        const monArt = document.querySelector('.monster-art');
        if (monArt) {
          monArt.classList.add('hit-shake');
          setTimeout(() => monArt?.classList.remove('hit-shake'), 300);
        }
      }

      // For defensive abilities, flash the player side
      const defTypes = ['defence_buff','dodge_buff'];
      if (defTypes.includes(ab.effect?.type)) {
        const pSide = document.querySelector('.player-side');
        if (pSide) {
          pSide.classList.add('ability-shield-flash');
          setTimeout(() => pSide?.classList.remove('ability-shield-flash'), 500);
        }
      }
    });
    this.engine.on('combatHit', (d) => {
      this.showHitSplat(d);
      if (this.engine.state.combat._multiMobMode) this._updateMultiMobUI();
      
      // Log to activity system
      try {
        if (typeof gameLogger !== 'undefined') {
          if (d.who === 'player') {
            gameLogger.logCombatAction('player', d.miss ? 'miss' : (d.ability ? 'ability' : 'hit'), d.dmg, this.engine.state.combat.monster, {
              crit: d.crit,
              ability: d.ability,
              abilityName: d.source
            });
          } else {
            gameLogger.logCombatAction('monster', d.dodge ? 'dodge' : (d.miss ? 'miss' : 'hit'), d.dmg, 'Player', {
              dodge: d.dodge,
              dot: d.dot
            });
          }
        }
      } catch(e) {
        console.warn('[Combat Logging] Error:', e.message);
      }
      
      // Combat log entry
      if (!this._combatLog) this._combatLog = [];
      const mon = this.engine.state.combat.monster;
      const monName = GAME_DATA.monsters[mon]?.name || GAME_DATA.worldBosses?.find(b=>b.id===mon)?.name || 'Enemy';
      if (d.cannon) {
        if (d.dmg > 0) this._combatLog.push({ type:'cannon', text:`Cannon: ${d.dmg} on ${monName}` });
      } else if (d.who === 'player') {
        if (d.miss) this._combatLog.push({ type:'miss', text:`Miss vs ${monName}` });
        else this._combatLog.push({ type:'hit', text:`${d.crit?'CRIT ':''}${d.dmg} ${d.style||''}→ ${monName}` });
      } else {
        if (d.miss || d.dodge) this._combatLog.push({ type:'miss', text:`${d.dodge?'Dodged':'Blocked'} ${monName} attack` });
        else this._combatLog.push({ type:'taken', text:`${monName} hits you for ${d.dmg}${d.dot?' (DoT)':''}` });
      }
      if (this._combatLog.length > 50) this._combatLog.splice(0, this._combatLog.length - 50);
      // Live update log if visible
      const logEl = document.getElementById('combat-log-entries');
      if (logEl && this._showCombatLog) {
        const last = this._combatLog.slice(-20).reverse();
        logEl.innerHTML = last.map(entry => {
          const cls = entry.type==='hit'?'cl-hit':entry.type==='taken'?'cl-taken':entry.type==='miss'?'cl-miss':entry.type==='kill'?'cl-kill':entry.type==='cannon'?'cl-cannon':'cl-dot';
          const ic = entry.type==='hit'?'⚔':entry.type==='taken'?'💥':entry.type==='miss'?'○':entry.type==='kill'?'💀':entry.type==='cannon'?'🔴':'⬡';
          return `<div class="cl-entry ${cls}">${ic} ${entry.text}</div>`;
        }).join('');
      }
    });
    this.engine.on('lootDrop', (d) => {
      this.showLootBag(d);
      if (!this._combatLog) this._combatLog = [];
      this._combatLog.push({ type:'kill', text:`${d.monster||d.monsterName||'Monster'} defeated!` });
      // Flash notification for item drops
      const notif = document.createElement('div');
      notif.style.cssText = 'position:fixed;top:20px;right:20px;background:#2a6a2a;color:#c9873e;padding:12px 16px;border:1px solid #c9873e;border-radius:4px;font-size:12px;z-index:10000;animation:slideIn 0.3s ease-out;';
      notif.textContent = '📦 Item Dropped!';
      document.body.appendChild(notif);
      setTimeout(() => notif.remove(), 3000);
    });
    this.engine.on('petAction', (d) => this.showPetAction(d));
    this.engine.on('petChanged', () => { if (this.currentPage === 'combat') this.renderPage('combat'); if (this.currentPage === 'pets') this.renderPage('pets'); });
    this.engine.on('thievingStun', (d) => { if (this.currentPage === 'thieving') this._updateThievingHpBar(d.hp, d.maxHp); });
    this.engine.on('thievingHpChanged', (d) => { if (this.currentPage === 'thieving') this._updateThievingHpBar(d.hp, d.maxHp); });
    this.engine.on('multiMobStart',   (d) => { if (this.currentPage === 'combat') this.renderPage('combat'); });
    this.engine.on('multiMobChanged', ()  => { if (this.currentPage === 'combat') this._updateMultiMobUI(); });
    this.engine.on('multiMobEnd',     ()  => { if (this.currentPage === 'combat') this.renderPage('combat'); });
    this.engine.on('xpGain', (d) => {
      this.showXpGain(d);
      // Log to activity system
      try {
        if (typeof gameLogger !== 'undefined' && this.engine.state.activeSkill) {
          gameLogger.logXpGain(this.engine.state.activeSkill, Math.floor(d.total || 0), d.source || 'activity');
        }
      } catch(e) {
        console.warn('[XP Logging] Error:', e.message);
      }
    });
    this.engine.on('randomEvent', (d) => this.showRandomEvent(d));
    this.engine.on('equipmentChanged', () => { if (['equipment','bank','combat'].includes(this.currentPage)) this.renderPage(this.currentPage); });
    this.engine.on('farmingChanged', () => { if (this.currentPage === 'farming') this.renderPage(this.currentPage); });
    this.engine.on('foodChanged', () => { if (this.currentPage === 'combat') this.renderPage('combat'); });
    this.engine.on('bankChanged', () => { if (['bank','shop'].includes(this.currentPage)) this.renderPage(this.currentPage); });
    this.engine.on('questsChanged', () => { if (['quests','npcs'].includes(this.currentPage)) this.renderPage(this.currentPage); });
    this.engine.on('abilitiesChanged', () => { if (this.currentPage === 'abilities') this.renderPage('abilities'); });
    this.engine.on('slayerChanged', () => { if (this.currentPage === 'slayer') this.renderPage('slayer'); });
    this.engine.on('petFound', () => { if (this.currentPage === 'pets') this.renderPage('pets'); });
    this.engine.on('collectionLogNew', (d) => { if (this.currentPage === 'codex') this.renderPage('codex'); });
    this.engine.on('init', () => {
      this.renderSidebar();
      this.renderTrainingBar();
      this.renderPage(this.currentPage);
      // Show tutorial for new players (total XP < 500 across all skills)
      const totalXp = Object.values(this.engine.state.skills||{}).reduce((s,sk)=>s+(sk.xp||0),0);
      if (totalXp < 500 && !this.engine.state._tutorialDismissed) {
        setTimeout(() => this.showTutorial(), 1500);
      }
    });
    // Cannon events
    this.engine.on('cannonFire', (d) => this.showCannonFire(d));
    this.engine.on('cannonToggled', () => { if (this.currentPage === 'combat') this.renderPage('combat'); });
    this.engine.on('clueScrollUpdated', () => { if (this.currentPage === 'clue_scrolls') this.renderPage('clue_scrolls'); });
    this.engine.on('bossPhase', (d) => {
      // Flash the combat arena with a phase transition effect
      const arena = document.querySelector('.combat-arena');
      if (arena) {
        arena.classList.add('phase-transition');
        setTimeout(() => arena.classList.remove('phase-transition'), 1000);
      }
      // Re-render to update phase badge
      if (this.currentPage === 'combat') this.renderPage('combat');
    });
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
    const align = GAME_DATA.alignments[s.alignment] || GAME_DATA.alignments['true_neutral'] || { axis:'NN', name:'Neutral' };
    const _prof = s.profile || {};
    const _seed = _prof.avatarSeed || (typeof online !== 'undefined' ? online?.displayName : '') || 'Survivor';
    const _avUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(_seed)}&hair=${_prof.hair||'short04'}&skinColor=${_prof.skinColor||'c68642'}&hairColor=${_prof.hairColor||'2c1b18'}&eyes=${_prof.eyes||'variant04'}&mouth=${_prof.mouth||'happy01'}&clothing=${_prof.clothing||'variant04'}&clothingColor=${_prof.clothingColor||'4a90d4'}${_prof.accessory?'&accessories='+_prof.accessory:''}&size=32`;
    let html = `<div class="sidebar-header">
      <img src="logo.png" alt="Ashfall Idle" class="sidebar-logo-img">
    </div>
    <div class="global-search-bar">
      <input type="text" id="global-search-input" class="gsi-input" placeholder="Search skills, items, monsters..." oninput="ui._handleSearch(this.value)" onkeydown="ui._handleSearchKeydown(event)">
      <div class="gsi-results" id="global-search-results" style="display:none"></div>
    </div>
    <div class="player-info">
      <div class="pi-row"><img src="${_avUrl}" class="player-avatar-mini" alt=""><span style="font-family:Cinzel,serif;color:var(--accent)">${typeof online !== 'undefined' && online.displayName ? escHtml(online.displayName) : 'Survivor'}</span></div>
      <div class="pi-row"><span>Combat Lvl</span><span class="pi-val">${this.engine.getCombatLevel()}</span></div>
      <div class="pi-row"><span>Total Lvl</span><span class="pi-val">${this.engine.getTotalLevel()}</span></div>
      <div class="pi-row"><span>${icon('coin',12)} Gold</span><span class="pi-val gold-val">${this.fmt(s.gold)}</span></div>
      <div class="pi-row"><span>Alignment</span><span class="pi-val align-val">${align.axis}</span></div>
      ${typeof online !== 'undefined' && online.isOnline ? `<div class="pi-row"><span class="online-dot">Online</span><span class="pi-val" style="font-size:11px">${escHtml(online.displayName) || 'Survivor'}</span></div>` : '<div class="pi-row"><span class="offline-dot">Offline</span><span class="pi-val" style="font-size:11px;color:var(--text-dim)">Local Only</span></div>'}
    </div>
    <div class="level-tracker" id="level-tracker">`;
    // Compact skill level grid
    const skillOrder = ['attack','strength','defence','hitpoints','ranged','magic','prayer','slayer','necromancy','woodcutting','mining','fishing','foraging','hunting','agility','cooking','smithing','fletching','crafting','alchemy','enchanting','incantation','farming','thieving','tactics','trading','diplomacy','summoning'];
    for (const sId of skillOrder) {
      const sk = s.skills[sId];
      if (!sk) continue;
      const data = GAME_DATA.skills[sId];
      if (!data) continue;
      const abbr = data.name.substring(0, 3);
      html += `<div class="lt-skill" id="lt-${sId}" title="${data.name}: Level ${sk.level}"><span class="lt-abbr">${abbr}</span><span class="lt-lvl">${sk.level}</span></div>`;
    }
    html += '</div>';
    // Collapsible nav — restore collapse state from localStorage
    const _navCollapsed = JSON.parse(localStorage.getItem('af_nav_collapsed') || '{}');
    for (const sec of NAV) {
      const key = sec.header;
      const isCollapsed = _navCollapsed[key] === true;
      // Auto-expand section containing active page
      const hasActive = sec.items.some(i => i.id === this.currentPage);
      const collapsed = isCollapsed && !hasActive;
      html += `<div class="nav-section ${collapsed?'nav-collapsed':''}">
        <div class="nav-header nav-header-toggle" onclick="ui._toggleNavSection('${key}')" title="Toggle ${key}">
          <span class="nav-section-icon">${sec.icon||''}</span>
          <span class="nav-section-label">${key}</span>
          <span class="nav-chevron">${collapsed?'›':'⌄'}</span>
        </div>
        <div class="nav-section-items">`;
      for (const item of sec.items) {
        const active = this.currentPage === item.id ? ' active' : '';
        let badge = '';
        if (s.skills[item.id]) badge = `<span class="nav-level">${s.skills[item.id].level}</span>`;
        if (item.id === 'quests' && (s.quests?.active?.length||0) > 0) badge = `<span class="nav-level nav-active-count">${s.quests.active.length}</span>`;
        if (item.id === 'inbox') { /* badge could show unread count */ }
        html += `<div class="nav-item${active}" data-page="${item.id}">${icon(item.icon, 15)}<span class="nav-label">${item.label}</span>${badge}</div>`;
      }
      html += `</div></div>`;
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
    if (this._lastPage === 'bounty_board' && pageId !== 'bounty_board') {
      this._stopBountyListener();
    }
    this._lastPage = pageId;
    const main = document.getElementById('main-content');
    // Named pages that override the generic skill renderer
    if (pageId === 'agility') { this.renderAgilityPage(main); return; }
    if (pageId === 'thieving') { this.renderThievingPage(main); return; }
    if (pageId === 'clue_scrolls') { this.renderClueScrollPage(main); return; }
    const skill = GAME_DATA.skills[pageId];
    if (skill && (skill.type === 'gathering' || skill.type === 'artisan')) this.renderSkillPage(main, pageId, skill);
    else if (pageId === 'combat') this.renderCombatPage(main);
    else if (pageId === 'wilderness') this.renderWildernessPage(main);
    else if (pageId === 'dungeons') this.renderDungeonsPage(main);
    else if (pageId === 'fight_cave') this.renderFightCavePage(main);
    else if (pageId === 'theatre')    this.renderTheatreOfAshPage(main);
    else if (pageId === 'chambers')   this.renderChambersOfAshPage(main);
    else if (pageId === 'ashen_crypts') this.renderAshenCryptsPage(main);
    else if (pageId === 'gauntlet')   this.renderGauntletPage(main);
    else if (pageId === 'inferno')    this.renderInfernoPage(main);
    else if (pageId === 'slayer_bosses') this.renderSlayerBossesPage(main);
    else if (pageId === 'world_bosses') this.renderWorldBossesPage(main);
    else if (pageId === 'login_rewards') this.renderLoginRewardsPage(main);
    else if (pageId === 'achievement_diary') this.renderDiaryPage(main);
    else if (pageId === 'world_events') this.renderWorldEventsPage(main);
    else if (pageId === 'unholy_prayers') this.renderUnholyPrayersPage(main);
    else if (pageId === 'abilities') this.renderAbilitiesPage(main);
    else if (pageId === 'farming') this.renderFarmingPage(main);
    else if (pageId === 'bank') this.renderBankPage(main);
    else if (pageId === 'shop') this.renderShopPage(main);
    else if (pageId === 'equipment') this.renderEquipmentPage(main);
    else if (pageId === 'bazaar') this.renderBazaarPage(main);
    else if (pageId === 'gear_sets') this.renderGearSetsPage(main);
    else if (pageId === 'achievements') this.renderAchievementsPage(main);
    else if (pageId === 'collection_log') this.renderCollectionLogPage(main);
    else if (pageId === 'codex') this.renderCodexPage(main);
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
    else if (pageId === 'upgrades') this.renderUpgradesPage(main);
    else if (pageId === 'activity') this.renderActivityPage(main);
    else if (pageId === 'character') this.renderCharacterPage(main);
    else if (pageId === 'prestige') this.renderPrestigePage(main);
    else if (pageId === 'guilds') this.renderGuildsPage(main);
    else if (pageId === 'party') this.renderPartyPage(main);
    else if (pageId === 'friends') this.renderFriendsPage(main);
    else if (pageId === 'inbox') this.renderInboxPage(main);
    else if (pageId === 'gift') this.renderGiftPage(main);
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
    let oreBagHtml = '';
    if (sId === 'mining') {
      const ob = this.engine.state.oreBag || {capacity:100,contents:{}};
      const totalInBag = Object.values(ob.contents).reduce((s,e) => s + (e.qty||0), 0);
      oreBagHtml = `<div class="ore-bag-section">
        <div class="ob-header">
          <span class="ob-title">${icon('pickaxe',14)} Ore Bag</span>
          <span class="ob-capacity">${totalInBag} / ${ob.capacity}</span>
          <button class="btn btn-xs" onclick="game.collectOreBag();ui.renderPage('mining')">Collect All</button>
        </div>
        <div class="ob-bar"><div class="ob-fill" style="width:${Math.min(100,totalInBag/ob.capacity*100).toFixed(0)}%"></div></div>
        <div class="ob-contents">`;
      for (const [oreId, entry] of Object.entries(ob.contents)) {
        if (entry.qty <= 0) continue;
        const ore = GAME_DATA.items[oreId];
        oreBagHtml += `<div class="ob-ore"><span class="ob-ore-name">${ore?.name||oreId}</span><span class="ob-ore-qty">x${entry.qty}</span></div>`;
      }
      if (totalInBag === 0) oreBagHtml += '<div class="ob-empty">Empty - mine ores to fill</div>';
      oreBagHtml += `</div>
        <div class="ob-stats">
          <span>Total Mined: ${this.fmt(this.engine.state.miningStats?.totalMined||0)}</span>
          <span>Events: ${this.engine.state.miningStats?.eventsTriggered||0}</span>
        </div>
      </div>`;
    }
    return `<div class="page-header skill-header"><div class="ph-icon">${icon(ic,32)}</div><div class="ph-info"><h1>${title}</h1><p>${desc}</p></div></div>${bar}${oreBagHtml}${divider}`;
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

        // ── SMITHING HEAT BAR ──────────────────────────────────
        if (sId === 'smithing' && GAME_DATA.smeltingHeat?.enabled) {
          const heat = s._smithingHeat || 0;
          const heatPct = Math.min(100, Math.round(heat));
          const isHot = heatPct >= (GAME_DATA.smeltingHeat.bonusThreshold || 60);
          const heatColor = heatPct > 80 ? '#ff4000' : heatPct > 60 ? '#ff8c00' : heatPct > 40 ? '#d4a83a' : '#5a6070';
          html += `<div class="heat-bar-wrap ${isHot?'heat-hot':''}">
            <div class="heat-bar-label">
              <span class="heat-icon">${isHot?'🔥':'❄️'}</span>
              <span>Forge Heat</span>
              <span class="heat-pct" style="color:${heatColor}">${heatPct}%</span>
              ${isHot ? `<span class="heat-bonus">+${GAME_DATA.smeltingHeat.bonusXpPct}% XP</span>` : ''}
            </div>
            <div class="heat-bar">
              <div class="heat-fill" style="width:${heatPct}%;background:${heatColor}"></div>
              <div class="heat-threshold-line" style="left:${GAME_DATA.smeltingHeat.bonusThreshold||60}%"></div>
            </div>
          </div>`;
        }
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
          const oDesc = o?.desc ? `<span class="ac-output-desc">${o.desc}</span>` : '';
          const oIcon = window.renderItemSprite ? renderItemSprite(action.output.item, 16) : '';
          outputHtml = `<div class="recipe-output">${oIcon}<span class="ac-output-name">${o?.name||action.output.item}${action.output.qty>1?' ×'+action.output.qty:''}</span><small class="ac-have" data-item-qty="${action.output.item}">(${s.bank[action.output.item]||0})</small>${oDesc}</div>`;
        }
        if (action.loot) {
          outputHtml = `<div class="recipe-output loot-output">${action.loot.slice(0,3).map(l=>{const i=GAME_DATA.items[l.item]; return `${window.renderItemSprite?renderItemSprite(l.item,14):''}<span>${(i?.name||l.item)}${l.qty>1?' ×'+l.qty:''}</span>`;}).join(' ')}</div>`;
        }
        // Show action description if present (desc field)
        const actionDescHtml = action.desc ? `<div class="ac-desc">${action.desc}</div>` : '';
        const artSvg = action._art && GAME_DATA.actionArt?.[action._art] ? `<div class="ac-art">${GAME_DATA.actionArt[action._art]}</div>` : '';
        html += `<div class="action-card ${locked?'locked':''} ${isActive?'active':''}" ${locked?'':`onclick="ui.startAction('${sId}','${action.id}')"`}>
          ${artSvg}
          <div class="ac-header"><span class="ac-name">${action.name}</span><span class="ac-level">Lv ${action.level}</span></div>
          <div class="ac-body">
            ${action.altarName ? `<div class="altar-info"><span class="altar-name">${action.altarName}</span>${action.altarDesc ? `<span class="altar-desc">${action.altarDesc}</span>`:''}</div>` : ''}
            ${inputHtml}${outputHtml}
            ${actionDescHtml}
          </div>
          <div class="ac-footer">
            <span class="ac-xp">+${action.xp} XP</span>
            <span class="ac-time">${toolPct>0?(action.time*(1-toolPct/100)).toFixed(1)+'s':action.time+'s'}</span>
            ${m>0?`<span class="ac-mastery">M:${m}</span>`:''}
          </div>
          ${locked?`<div class="locked-overlay">Requires Level ${action.level}</div>`:''}        </div>`;
      }
      html += '</div>';
      if (hasCategories) html += '</div>';
    }

    // Fishing Zones (zone-based random catch pools)

      // Fish SVG helper — inline SVGs for rods and fish
      const _fishSVG = (id, color='#4a8ec4') => {
        const c = color;
        const svgs = {
          rod: `<svg viewBox="0 0 24 24" width="18" height="18"><path d="M2 22 L20 4" stroke="#8a6a3a" stroke-width="2.5" stroke-linecap="round"/><circle cx="20" cy="4" r="2" fill="#c9873e"/><path d="M2 22 Q8 16 14 12" stroke="#c8a870" stroke-width="1" fill="none" stroke-dasharray="2,2"/><circle cx="2" cy="22" r="2" fill="#4a7ec4"/></svg>`,
          // Zone icons
          shore_pond:`<svg viewBox="0 0 32 24" width="32" height="24"><path d="M0 16 Q8 10 16 16 Q24 22 32 16 L32 24 L0 24Z" fill="#1a4a7a" opacity=".7"/><path d="M0 18 Q8 12 16 18 Q24 24 32 18" stroke="#4a9ac4" stroke-width="1.5" fill="none"/><circle cx="8" cy="12" r="1.5" fill="${c}" opacity=".7"/><circle cx="22" cy="14" r="1" fill="${c}" opacity=".5"/></svg>`,
          river_bend:`<svg viewBox="0 0 32 24" width="32" height="24"><path d="M0 12 Q8 6 16 14 Q24 22 32 12 L32 24 L0 24Z" fill="#1a5a4a" opacity=".7"/><path d="M2 12 Q10 4 18 14 Q26 24 32 14" stroke="#4ac4a4" stroke-width="1.5" fill="none"/><path d="M4 10 Q8 8 12 10" stroke="#8adcc4" stroke-width="1" fill="none"/></svg>`,
          lake_crossing:`<svg viewBox="0 0 32 24" width="32" height="24"><ellipse cx="16" cy="16" rx="14" ry="8" fill="#1a3a6a" opacity=".8"/><ellipse cx="16" cy="14" rx="14" ry="8" fill="none" stroke="#4a8ac4" stroke-width="1.5"/><path d="M8 14 Q16 10 24 14" stroke="#88ccff" stroke-width="1" fill="none"/></svg>`,
          coastal_reef:`<svg viewBox="0 0 32 24" width="32" height="24"><path d="M0 18 L32 18 L32 24 L0 24Z" fill="#1a3a5a" opacity=".7"/><path d="M4 18 L6 12 L8 18 M12 18 L14 10 L16 18 M20 18 L22 14 L24 18" stroke="#4a8ac4" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="8" r="3" fill="#c9873e" opacity=".6"/></svg>`,
          deep_ocean:`<svg viewBox="0 0 32 24" width="32" height="24"><rect x="0" y="0" width="32" height="24" fill="#0a1a3a" rx="3"/><path d="M0 8 Q8 4 16 8 Q24 12 32 8" stroke="#1a3a6a" stroke-width="3" fill="none"/><circle cx="24" cy="16" r="4" fill="none" stroke="#4a8ac4" stroke-width="1.5"/><path d="M6 16 L10 12 L14 16" fill="none" stroke="#4a8ac4" stroke-width="1.5"/></svg>`,
          sunken_cavern:`<svg viewBox="0 0 32 24" width="32" height="24"><path d="M0 0 L12 8 L20 4 L32 0 L32 24 L0 24Z" fill="#2a1a3a"/><path d="M6 8 L8 16 M16 6 L18 18 M24 4 L26 14" stroke="#6a4a8a" stroke-width="1.5" stroke-linecap="round"/><circle cx="16" cy="16" r="5" fill="#1a0a2a" stroke="#8a5ac4" stroke-width="1"/></svg>`,
          frozen_trawl:`<svg viewBox="0 0 32 24" width="32" height="24"><rect x="0" y="0" width="32" height="24" fill="#1a2a4a" rx="3"/><path d="M0 10 Q8 6 16 10 Q24 14 32 10" stroke="#8ac4ff" stroke-width="2" fill="none"/><path d="M4 6 L6 4 L8 6 M14 4 L16 2 L18 4" stroke="#c8e8ff" stroke-width="1.5" stroke-linecap="round"/></svg>`,
          volcanic_pools:`<svg viewBox="0 0 32 24" width="32" height="24"><rect x="0" y="0" width="32" height="24" fill="#2a0a0a" rx="3"/><circle cx="10" cy="14" r="6" fill="#8a2a00" opacity=".8"/><circle cx="22" cy="12" r="5" fill="#aa3a00" opacity=".7"/><path d="M8 12 Q10 8 12 12" stroke="#ff6020" stroke-width="1.5" fill="none"/><path d="M20 10 Q22 6 24 10" stroke="#ff8040" stroke-width="1.5" fill="none"/></svg>`,
          abyssal_depths:`<svg viewBox="0 0 32 24" width="32" height="24"><rect x="0" y="0" width="32" height="24" fill="#050510" rx="3"/><circle cx="16" cy="12" r="8" fill="none" stroke="#4a2a8a" stroke-width="1.5" stroke-dasharray="3,2"/><circle cx="16" cy="12" r="3" fill="#8a2ae0" opacity=".6"/><path d="M8 8 L12 10 M20 8 L16 10 M8 16 L12 14 M20 16 L16 14" stroke="#6a4ac4" stroke-width="1"/></svg>`,
          // Generic fish shape for unknowns
          default:`<svg viewBox="0 0 24 16" width="24" height="16"><path d="M18 8 L12 4 L2 8 L12 12Z" fill="${c}" opacity=".9"/><path d="M18 8 L22 4 L22 12Z" fill="${c}" opacity=".7"/><circle cx="5" cy="8" r="1.5" fill="rgba(255,255,255,0.8)"/></svg>`,
        };
        // Fish-specific overrides using hue shifts
        const fishColors = {raw_shrimp:'#e8a870',raw_sardine:'#8ab4d4',raw_salmon:'#e06040',raw_trout:'#4a8a5a',raw_lobster:'#d45030',raw_shark:'#5a7090',raw_tuna:'#4060a0',raw_swordfish:'#3050a0',raw_anglerfish:'#a06030',raw_void_fish:'#8a2ae0',raw_golden_tench:'#d4a83a',raw_lava_eel:'#c44020',raw_manta:'#304060'};
        if (fishColors[id]) { return svgs[id] || `<svg viewBox="0 0 24 16" width="22" height="14"><path d="M18 8 L12 4 L2 8 L12 12Z" fill="${fishColors[id]}"/><path d="M18 8 L22 4 L22 12Z" fill="${fishColors[id]}" opacity=".7"/><circle cx="5" cy="8" r="1.5" fill="rgba(255,255,255,0.7)"/></svg>`; }
        return svgs[id] || svgs.default.replace('${c}', c);
      };
    if (sId === 'fishing' && GAME_DATA.fishingZones) {
      // ── EQUIPPED ROD ─────────────────────────────────────────
      const _rodId = s.equipment?.weapon;
      const _rod = _rodId ? GAME_DATA.items[_rodId] : null;
      const _isRod = _rod?.subtype === 'fishing_rod';
      const _rodSpeed = _isRod ? (_rod.toolSpeed?.fishing || 0) : 0;
      const _bestRod = Object.values(GAME_DATA.items).filter(i=>i.subtype==='fishing_rod'&&(s.bank[i.id]||0)>0)
        .sort((a,b)=>(b.toolSpeed?.fishing||0)-(a.toolSpeed?.fishing||0))[0];

      html += `<div class="fish-rod-strip">`;
      if (_isRod) {
        html += `<div class="frs-equipped">
          <span class="frs-icon">${_fishSVG('rod')}</span>
          <div><div class="frs-name">${_rod.name}</div><div class="frs-bonus">-${_rodSpeed}% catch time</div></div>
        </div>`;
      } else if (_bestRod) {
        html += `<div class="frs-hint">⚠ Equip <strong>${_bestRod.name}</strong> from bank for -${_bestRod.toolSpeed?.fishing||0}% catch time</div>`;
      } else {
        html += `<div class="frs-hint">No fishing rod equipped or in bank. <button class="btn btn-xs" onclick="ui.renderPage('shop')">Buy Rod →</button></div>`;
      }
      html += `</div>`;

      // ── FISHING ZONES ─────────────────────────────────────────
      html += '<h2 class="section-title">Fishing Zones</h2><div class="fish-zones-grid">';
      for (const zone of GAME_DATA.fishingZones) {
        const fishLv = s.skills.fishing.level;
        const locked = fishLv < zone.level;
        const isActive = s.activeSkill === 'fishing' && s.activeAction === 'zone_' + zone.id;
        const totalW = zone.fish.reduce((sum,x)=>sum+x.weight, 0);
        const catchTime = _isRod ? (zone.time * (1 - _rodSpeed/100)).toFixed(1) : zone.time;
        const topFish = zone.fish.slice().sort((a,b)=>b.weight-a.weight)[0];
        const topItem = GAME_DATA.items[topFish?.item];

        html += `<div class="fish-zone-card ${locked?'fzc-locked':''} ${isActive?'fzc-active':''}"
          ${locked?'':`onclick="ui.startAction('fishing','zone_${zone.id}')"`}>
          <div class="fzc-header">
            <div class="fzc-art">${_fishSVG(zone.id)}</div>
            <div class="fzc-info">
              <div class="fzc-name">${zone.name}</div>
              <div class="fzc-desc">${zone.desc}</div>
            </div>
            <div class="fzc-level ${locked?'fzc-lv-locked':'fzc-lv-ok'}">Lv ${zone.level}</div>
          </div>
          <div class="fzc-fish-list">`;

        for (const f of zone.fish) {
          const item = GAME_DATA.items[f.item];
          const pct = (f.weight / totalW * 100).toFixed(0);
          const owned = s.bank[f.item] || 0;
          const cooked = s.bank[f.item?.replace('raw_','')]||0;
          const rarity = pct>=25?'common':pct>=10?'uncommon':pct>=5?'rare':'very-rare';
          const rarityColor = {common:'#888',uncommon:'#4abe6c',rare:'#4a8ec4','very-rare':'#c9873e'}[rarity];
          html += `<div class="fzc-fish-row" id="ffr-${f.item}">
            <div class="fzc-fr-left">
              <span class="fzc-fish-icon">${_fishSVG(f.item, rarityColor)}</span>
              <div>
                <div class="fzc-fish-name">${item?.name||f.item.replace('raw_','').replace(/_/g,' ')}</div>
                <div class="fzc-fish-meta">${f.xp} XP · ${pct}% chance</div>
              </div>
            </div>
            <div class="fzc-fr-right">
              <span class="fzc-fish-own" id="fown-${f.item}" style="color:${owned>0?'#4abe6c':'var(--text-dim)'}">x${owned}</span>
              ${cooked>0?`<span class="fzc-fish-cooked">(${cooked} cooked)</span>`:''}
            </div>
          </div>`;
        }

        const baseXpMin = Math.min(...zone.fish.map(f=>f.xp));
        const baseXpMax = Math.max(...zone.fish.map(f=>f.xp));
        html += `</div>
          <div class="fzc-footer">
            <span class="fzc-time">⏱ ${catchTime}s/cast</span>
            <span class="fzc-xp">${baseXpMin}–${baseXpMax} XP</span>
            ${isActive?'<span class="fzc-fishing-badge">🎣 FISHING HERE</span>':''}
          </div>
          ${locked?`<div class="locked-overlay">Fishing Lv ${zone.level}</div>`:''}
        </div>`;
      }
      html += '</div>';

      // ── FISH IN BANK ──────────────────────────────────────────
      const _allFish = GAME_DATA.fishingZones.flatMap(z=>z.fish).map(f=>f.item);
      const _ownedFish = [...new Set(_allFish)].filter(id=>(s.bank[id]||0)>0);
      if (_ownedFish.length > 0) {
        html += `<h2 class="section-title">Fish in Bank</h2><div class="fish-bank-grid">`;
        for (const id of _ownedFish) {
          const item = GAME_DATA.items[id];
          const cookedId = id.replace('raw_','');
          const cooked = s.bank[cookedId]||0;
          html += `<div class="fish-bank-card">
            <div class="fbc-art">${_fishSVG(id,'#c9873e')}</div>
            <div class="fbc-name">${item?.name||id.replace('raw_','').replace(/_/g,' ')}</div>
            <div class="fbc-qty" id="fbq-${id}">x${s.bank[id]||0} raw</div>
            ${cooked>0?`<div class="fbc-cooked" id="fbc-${cookedId}">x${cooked} cooked</div>`:''}
          </div>`;
        }
        html += '</div>';
      }
    }

    el.innerHTML = html;
  }

  renderClueScrollPage(el) {
    const s = this.engine.state;
    const cs = s.clueScroll || { active:false };
    const tiers = ['easy','medium','hard','elite'];
    const tierColors = { easy:'#d4a83a', medium:'#4a90d4', hard:'#c44040', elite:'#b585e0' };
    const completed = s.stats?.clueScrollsCompleted || {};
    let html = this.header('Clue Scrolls','scroll','Solve riddles, collect rewards. Found while skilling, thieving, and fighting.',null);

    // Active clue display
    if (cs.active) {
      const def = GAME_DATA.clueScrolls?.[cs.tier];
      const color = tierColors[cs.tier] || '#c9873e';
      const step = cs.steps?.[cs.currentStep];
      html += `<div class="clue-active-panel" style="border-color:${color}40;background:${color}08">
        <div class="cap-header">
          <span class="cap-tier" style="color:${color}">📜 ${def?.label||cs.tier} Clue</span>
          <span class="cap-progress">${(cs.currentStep||0)+1} / ${cs.steps?.length||1} steps</span>
        </div>
        <div class="cap-step-bar">
          ${cs.steps?.map((st, i) => `<div class="csb-step ${st.complete?'csb-done':i===cs.currentStep?'csb-current':''}">${i+1}</div>`).join('') || ''}
        </div>
        ${step ? `<div class="cap-step-desc">
          <span class="cap-step-num">Step ${(cs.currentStep||0)+1}:</span>
          <span class="cap-step-text">${step.desc}</span>
          ${step.type==='gather'||step.type==='kill'||step.type==='craft' ? `<div class="cap-step-progress">
            ${step.type==='kill' ? (() => { const prog = cs._killProgress?.[step.id]||0; return `<div class="cap-prog-bar"><div class="cap-prog-fill" style="width:${Math.min(100,prog/step.qty*100)}%;background:${color}"></div></div><span class="cap-prog-text">${prog}/${step.qty}</span>`; })() : ''}
            ${step.type==='gather' ? (() => { const prog = cs._gatherProgress?.[step.id]||0; return `<div class="cap-prog-bar"><div class="cap-prog-fill" style="width:${Math.min(100,prog/step.qty*100)}%;background:${color}"></div></div><span class="cap-prog-text">${prog}/${step.qty}</span>`; })() : ''}
            ${step.type==='craft' ? (() => { const prog = cs._craftProgress?.[step.id]||0; return `<div class="cap-prog-bar"><div class="cap-prog-fill" style="width:${Math.min(100,prog/step.qty*100)}%;background:${color}"></div></div><span class="cap-prog-text">${prog}/${step.qty}</span>`; })() : ''}
          </div>` : ''}
        </div>` : `<div class="cap-step-desc" style="color:#4aaa60">✅ All steps complete! Reward casket added to bank.</div>`}
        <div style="display:flex;gap:8px;margin-top:10px">
          <button class="btn btn-sm btn-danger" onclick="if(confirm('Abandon this clue scroll?'))game.abandonClueScroll();ui.renderPage('clue_scrolls')">Abandon</button>
        </div>
      </div>`;
    }

    // Owned scrolls
    html += '<h2 class="section-title">Your Clue Scrolls</h2><div class="clue-tier-grid">';
    let anyScrolls = false;
    for (const tier of tiers) {
      const scrollId = `clue_scroll_${tier}`;
      const casketId = `casket_${tier}`;
      const count = s.bank?.[scrollId] || 0;
      const caskets = s.bank?.[casketId] || 0;
      const def = GAME_DATA.clueScrolls?.[tier];
      const color = tierColors[tier];
      const done = completed[tier] || 0;
      if (count > 0 || caskets > 0) anyScrolls = true;
      html += `<div class="clue-tier-card" style="border-color:${color}30">
        <div class="ctc-header" style="color:${color}">${def?.label||tier}</div>
        <div class="ctc-row"><span>Scrolls:</span><span>${count}</span></div>
        <div class="ctc-row"><span>Caskets:</span><span>${caskets}</span></div>
        <div class="ctc-row ctc-done"><span>Completed:</span><span>${done}</span></div>
        <div class="ctc-steps">~${def?.steps||3} steps • ${def?.cluePool?.length||8} possible clues</div>
        <div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:8px">
          ${count > 0 && !cs.active ? `<button class="btn btn-xs" style="border-color:${color}60;color:${color}" onclick="game.startClueScroll('${tier}');ui.renderPage('clue_scrolls')">▶ Start</button>` : ''}
          ${caskets > 0 ? `<button class="btn btn-xs" style="background:rgba(201,135,62,0.15);border-color:rgba(201,135,62,0.4);color:var(--amber)" onclick="game.openCasket('${casketId}');ui.renderPage('clue_scrolls')">🎁 Open Casket</button>` : ''}
        </div>
      </div>`;
    }
    if (!anyScrolls) {
      html += `<div class="clue-empty">No clue scrolls yet.<br><span style="font-size:11px;color:var(--text-dim)">Earn them from: thieving (rogues, gem stalls), hunting (dragons), fishing (rare catch), and killing world bosses.</span></div>`;
    }
    html += '</div>';

    // How to get clues
    html += `<h2 class="section-title">How to Get Clue Scrolls</h2>
    <div class="clue-sources">
      <div class="cs-src"><span class="cs-tier easy-clr">Easy</span><span>Pickpocket Rogues (3%), fishing rare catch (1.5%), hunting level 55+ (1%)</span></div>
      <div class="cs-src"><span class="cs-tier med-clr">Medium</span><span>Gem stall theft (5%), hunting dragons (5%), monster kills 50+ level (rare)</span></div>
      <div class="cs-src"><span class="cs-tier hard-clr">Hard</span><span>Opening medium caskets (4% chance), slayer tasks 60+ (0.5%)</span></div>
      <div class="cs-src"><span class="cs-tier elite-clr">Elite</span><span>World bosses: Ashen Overlord, Void Emperor, Storm Reaver (5% each)</span></div>
    </div>

    <h2 class="section-title">Reward Examples</h2>
    <div class="clue-reward-preview">
      ${tiers.map(tier => {
        const def = GAME_DATA.clueScrolls?.[tier];
        const color = tierColors[tier];
        return `<div class="crp-tier">
          <div class="crp-label" style="color:${color}">${def?.label}</div>
          ${def?.rewards?.slice(0,4).map(r => `<div class="crp-item">${GAME_DATA.items[r.item]?.name||r.item}${r.qty>1?` ×${r.qty}`:''}</div>`).join('') || ''}
          <div class="crp-item crp-more">+${Math.max(0,(def?.rewards?.length||0)-4)} more…</div>
        </div>`;
      }).join('')}
    </div>`;

    el.innerHTML = html;
  }

  renderAgilityPage(el) {
    const s = this.engine.state;
    const agilLv  = s.skills.agility?.level  || 1;
    const agilXp  = s.skills.agility?.xp     || 0;
    const courses = GAME_DATA.gatheringActions?.agility || [];
    const active  = s.activeSkill === 'agility';
    const marks   = s.bank?.['mark_of_grace'] || 0;
    const curId   = s.activeAction;

    let html = this.header('Agility','run',`Level ${agilLv} · ${this.fmt(agilXp)} XP · ${marks} marks`,null);

    // XP bar
    const xpTable = [0,83,174,276,388,512,650,801,969,1154,1358,1584,1833,2107,2411,2746,3115,3523,3973,4470,5018,5624,6291,7028,7842,8740,9730,10824,12031,13363,14833,16456,18247,20224,22406,24815,27473,30408,33648,37224,41171,45529,50339,55649,61512,68000,75127,82904,91373,100678,110745,121535,133066,145418,158806,173255,188874,205751,224002,243822,265534,289096,314891,342546,373169,406206,441533,479905,521311,566085,614334,666862,723782,785483,851704,923048,999927,1083019,1172773,1269674,1374140,1485543,1605425,1734434,1873256,2023568,2187279,2364310,2556493,2765818,3000000,3256751,3538503,3848063,4187812,4560107,4969161,5415961,5909031];
    const lvl = agilLv; const nextXp = xpTable[lvl] || xpTable[98]; const prevXp = xpTable[lvl-1] || 0;
    const pct = Math.min(100, Math.floor(((agilXp - prevXp) / Math.max(1, nextXp - prevXp)) * 100));
    html += `<div class="skill-xp-bar-wrap"><div class="skill-xp-bar" style="width:${pct}%" title="${this.fmt(agilXp)}/${this.fmt(nextXp)} XP to level ${lvl+1}"></div><div class="skill-xp-label">${pct}% to Lv ${lvl+1}</div></div>`;

    // Grace shop
    html += `<div class="agil-grace-header"><span class="agil-marks-badge">🪙 ${marks} Marks of Grace</span><button class="btn btn-xs" onclick="ui._admTab='shop_mgr';ui.renderPage('admin')" style="font-size:10px">Exchange →</button></div>`;
    html += `<div class="agil-grace-shop"><h3>Graceful Outfit (Marks of Grace)</h3><div class="agil-grace-grid">`;
    const graceShop = GAME_DATA.graceShop || [];
    for (const si of graceShop) {
      const item = GAME_DATA.items[si.item]; if (!item) continue;
      const owned = (s.bank[si.item]||0) + (s.equipment ? (Object.values(s.equipment).includes(si.item)?1:0) : 0);
      const canBuy = marks >= si.price;
      html += `<div class="agil-grace-item ${owned?'agil-owned':''}">
        <div class="agi-icon">${window.renderItemSprite ? window.renderItemSprite(si.item, 28) : ''}</div>
        <div class="agi-name">${item.name}</div>
        <div class="agi-price">${si.price} marks</div>
        ${owned ? `<div class="agi-owned-badge">✓ Owned</div>` : `<button class="btn btn-xs ${canBuy?'':'btn-disabled'}" ${canBuy?'':'disabled'} onclick="ui._buyGrace('${si.item}',${si.price})">Buy</button>`}
      </div>`;
    }
    html += `</div></div>`;

    // Courses
    html += `<h2 class="section-title">Agility Courses</h2><div class="agil-courses">`;
    for (const c of courses) {
      const locked = agilLv < c.level;
      const isCur  = active && curId === c.id;
      html += `<div class="agil-course-card ${locked?'agil-locked':''} ${isCur?'agil-active':''}">
        <div class="agil-course-header">
          <span class="agil-course-name">${c.name}</span>
          <span class="agil-req ${locked?'req-locked':'req-met'}">Lv ${c.level}</span>
        </div>
        <div class="agil-course-meta">
          <span class="agil-xp">+${c.xp} XP/lap</span>
          <span class="agil-time">${c.time}s/lap</span>
          <span class="agil-mark-chance">${Math.floor((c.loot?.[0]?.chance||0)*100)}% mark</span>
        </div>
        <div class="agil-obstacles">
          ${(c.obstacles||[]).map(o=>`<span class="agil-obstacle">${o}</span>`).join('')}
        </div>
        <div class="agil-desc">${c.desc||''}</div>
        ${locked
          ? `<button class="btn btn-sm btn-disabled" disabled>Requires Agility ${c.level}</button>`
          : isCur
            ? `<button class="btn btn-sm btn-danger" onclick="game.stopSkill();ui.renderPage('agility')">■ Stop</button>`
            : `<button class="btn btn-sm" onclick="game.startSkill('agility','${c.id}');ui.renderPage('agility')">▶ Run Course</button>`
        }
      </div>`;
    }
    html += `</div>`;

    // Passive agility bonuses
    const agilBonus = Math.floor(agilLv / 10);
    html += `<div class="agil-bonuses"><h3>Passive Bonuses (Lv ${agilLv})</h3>
      <div class="agil-bonus-row">✦ +${agilBonus}% dodge chance in combat</div>
      <div class="agil-bonus-row">✦ +${Math.floor(agilLv/5)}% skill speed bonus (gathering)</div>
      <div class="agil-bonus-row">✦ Graceful outfit: reduces weight, restores energy faster</div>
    </div>`;

    el.innerHTML = html;
  }

  _buyGrace(itemId, cost) {
    const s = this.engine.state;
    if ((s.bank['mark_of_grace']||0) < cost) { this.toast({type:'warn',text:'Not enough Marks of Grace'}); return; }
    s.bank['mark_of_grace'] -= cost;
    if (s.bank['mark_of_grace'] <= 0) delete s.bank['mark_of_grace'];
    this.engine.addItem(itemId, 1);
    this.toast({type:'success', text:`${GAME_DATA.items[itemId]?.name} purchased!`});
    this.renderPage('agility');
  }

  _toggleNavSection(key) {
    const stored = JSON.parse(localStorage.getItem('af_nav_collapsed') || '{}');
    stored[key] = !stored[key];
    localStorage.setItem('af_nav_collapsed', JSON.stringify(stored));
    this.renderSidebar();
  }

  _handleSearch(query) {
    if (typeof smartSearch === 'undefined') return;
    
    const resultsEl = document.getElementById('global-search-results');
    if (!resultsEl) return;

    if (!query || query.length < 1) {
      resultsEl.style.display = 'none';
      return;
    }

    const results = smartSearch.search(query);
    if (results.length === 0) {
      resultsEl.innerHTML = '<div class="gsr-empty">No results found</div>';
      resultsEl.style.display = 'block';
      return;
    }

    let html = '<div class="gsr-list">';
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const typeColor = {
        skill: '#7dcc44',
        item: '#60c0e0',
        monster: '#ff6b6b',
        quest: '#d4a574',
        page: '#c9873e',
        npc: '#9d6fe8'
      }[result.type] || '#999';

      html += `<div class="gsr-item" data-index="${i}" onclick="ui._selectSearchResult(${i})">
        <span class="gsr-icon" style="color:${typeColor}">${result.icon}</span>
        <div class="gsr-info">
          <div class="gsr-name">${this.escHtml(result.name)}</div>
          <div class="gsr-category">${result.category} • ${result.description}</div>
        </div>
      </div>`;
    }
    html += '</div>';
    
    resultsEl.innerHTML = html;
    resultsEl.style.display = 'block';
    
    // Store results for Enter key
    this._lastSearchResults = results;
  }

  _selectSearchResult(index) {
    const results = this._lastSearchResults || [];
    
    if (results[index]) {
      const result = results[index];
      smartSearch.addToHistory(result);
      
      try {
        result.action();
      } catch(e) {
        console.error('[Search] Action error:', e);
      }
      
      // Clear search
      document.getElementById('global-search-input').value = '';
      document.getElementById('global-search-results').style.display = 'none';
      this._lastSearchResults = [];
      
      // Close sidebar on mobile
      const sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.classList.remove('open');
    }
  }

  _handleSearchKeydown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const results = this._lastSearchResults || [];
      if (results.length > 0) {
        this._selectSearchResult(0); // Select first result
      }
    } else if (e.key === 'Escape') {
      document.getElementById('global-search-results').style.display = 'none';
      document.getElementById('global-search-input').value = '';
    }
  }

  renderThievingPage(el) {
    const s = this.engine.state;
    const thievLv = s.skills.thieving?.level || 1;
    const maxHp   = this.engine.getMaxHp();
    const thievHp = (s.thievingHp !== null && s.thievingHp !== undefined) ? s.thievingHp : maxHp;
    const hpPct   = Math.round((thievHp / maxHp) * 100);
    const hpColor = hpPct > 60 ? '#4abe6c' : hpPct > 30 ? '#d4a83a' : '#c44040';

    let html = this.header('Thieving','mask','Pickpocket NPCs and steal from stalls. Getting caught deals damage. Anger your target enough and they will fight back.','thieving');

    // ── HP + FOOD BAR ──────────────────────────────────────────────
    const foodBag = s.foodBag || [];
    let foodHtml = foodBag.length > 0
      ? foodBag.map(function(f) {
          var it = GAME_DATA.items[f.id];
          var nm = it ? it.name : f.id;
          var hl = it ? it.heals : 0;
          return '<button class="thiev-food-btn" onclick="game.thievingEatFood(\'' + f.id + '\');ui.renderPage(\'thieving\')" title="Eat ' + nm + ' (+ ' + hl + ' HP)">' + nm + ' x' + f.qty + '</button>';
        }).join('')
      : '<span class="thiev-no-food">No food — add from Bank (auto-eat at 40% HP)</span>';

    html += '<div class="thiev-status-bar">'
      + '<div class="thiev-hp-wrap">'
      + '<span class="thiev-hp-label">HP</span>'
      + '<div class="thiev-hp-track"><div class="thiev-hp-fill" id="thiev-hp-fill" style="width:' + hpPct + '%;background:' + hpColor + '"></div></div>'
      + '<span class="thiev-hp-val" id="thiev-hp-val">' + thievHp + '/' + maxHp + '</span>'
      + '</div>'
      + '<div class="thiev-food-strip">' + foodHtml + '</div>'
      + '</div>';

    // ── ACTIVE ACTION ──────────────────────────────────────────────
    if (s.activeSkill === 'thieving' && s.activeAction) {
      const a = GAME_DATA.thievingTargets.find(function(x) { return x.id === s.activeAction; });
      if (a) {
        const p = Math.min(1, Math.max(0, s.actionProgress / a.time));
        const anger    = s.thievingAnger ? (s.thievingAnger[a.id] || 0) : 0;
        const angerPct = Math.round(anger * 100);
        const lvFactor = (a.level || 1) / 90;
        const baseChance = 0.02 + lvFactor * 0.08;
        const fightChancePct = Math.round(Math.min(75, (baseChance + anger * 0.40) * 100));
        html += '<div class="thiev-active-bar">'
          + '<div class="tab-title">' + (a.portrait||'🗡️') + ' ' + (a.isStall ? 'Stealing from' : 'Pickpocketing') + ': <strong>' + a.name + '</strong></div>'
          + '<div class="thiev-prog-row"><span class="thiev-prog-label">Progress</span><div class="thiev-prog-track"><div class="thiev-prog-fill" style="width:' + Math.round(p*100) + '%"></div></div></div>'
          + '<div class="thiev-anger-row"><span class="thiev-anger-label">Anger ' + angerPct + '%</span><div class="thiev-anger-track"><div class="thiev-anger-fill" style="width:' + angerPct + '%"></div></div>'
          + '<span class="thiev-fight-chance" title="Chance target attacks you">Fight: ' + fightChancePct + '%</span></div>'
          + '<div style="display:flex;gap:6px;margin-top:6px">'
          + '<button class="btn btn-danger btn-sm" onclick="ui.stopAction();ui.renderPage(\'thieving\')">Stop</button>'
          + (angerPct > 30 ? '<button class="btn btn-xs" onclick="game.resetThievingAnger(\'' + a.id + '\');ui.renderPage(\'thieving\')">Calm Down</button>' : '')
          + '</div></div>';
      }
    }

    // ── TARGET CARDS HELPER ────────────────────────────────────────
    function renderTargetCard(t, isActive, thievLv, s) {
      var locked = thievLv < t.level;
      var anger  = s.thievingAnger ? (s.thievingAnger[t.id] || 0) : 0;
      var angerPct = Math.round(anger * 100);
      var lvFactor  = (t.level || 1) / 90;
      var baseChance= 0.02 + lvFactor * 0.08;
      var fightPct  = Math.round(Math.min(75, (baseChance + anger * 0.40) * 100));
      var fightCol  = fightPct > 30 ? '#c44040' : fightPct > 15 ? '#d4a83a' : 'var(--text-dim)';
      var mastery   = 0; // simplified since getMasteryLevel needs engine context
      var effStunPct= Math.round(Math.max(3, t.stunChance * 100 - mastery * 0.3));
      var stunDmgMax= (t.stunDmgBase||1) + Math.ceil((t.level||1)/10);

      var lootHtml = (t.loot||[]).map(function(l) {
        var it = GAME_DATA.items[l.item];
        return '<span class="thiev-drop-sm" title="' + (l.chance*100).toFixed(1) + '%">' + (it ? it.name : l.item) + '</span>';
      }).join('');

      var angerBar = angerPct > 0
        ? '<div class="thiev-anger-mini"><span>😡</span>'
          + '<div class="thiev-anger-track-sm"><div class="thiev-anger-fill-sm" style="width:' + angerPct + '%;background:' + (angerPct > 60 ? '#c44040' : angerPct > 30 ? '#d4a83a' : '#c9873e') + '"></div></div>'
          + '<span>' + angerPct + '%</span></div>'
        : '';

      var actionBtnHtml = '';
      if (!locked) {
        if (isActive) {
          actionBtnHtml = '<button class="btn btn-sm btn-danger" onclick="ui.stopAction();ui.renderPage(\'thieving\')">Stop</button>';
        } else {
          actionBtnHtml = '<button class="btn btn-sm" onclick="ui.startAction(\'thieving\',\'' + t.id + '\')">&#x1F575; ' + (t.isStall ? 'Steal' : 'Pickpocket') + '</button>';
        }
      }

      return '<div class="thiev-card ' + (locked ? 'locked' : '') + ' ' + (isActive ? 'thiev-active' : '') + '" data-anger-id="' + t.id + '">'
        + '<div class="thiev-card-header">'
        + '<span class="thiev-portrait">' + (t.portrait||'👤') + '</span>'
        + '<div class="thiev-card-info"><div class="thiev-card-name">' + t.name + '</div>'
        + '<div class="thiev-card-desc">' + (t.desc||'') + '</div></div>'
        + '<span class="thiev-lv-badge">Lv ' + t.level + '</span>'
        + '</div>'
        + (locked ? '<div class="locked-overlay">Thieving ' + t.level + '</div>' :
          '<div class="thiev-stats-row">'
          + '<span>💰 ' + t.gold.min + '–' + t.gold.max + 'gp</span>'
          + '<span>⚡ ' + t.xp + 'xp</span>'
          + '<span>⏱ ' + t.time + 's</span>'
          + '</div>'
          + '<div class="thiev-danger-row">'
          + '<span title="Stun chance (mastery reduces)">😵 ' + effStunPct + '%</span>'
          + '<span title="Damage on stun">💔 ' + (t.stunDmgBase||1) + '–' + stunDmgMax + '</span>'
          + '<span style="color:' + fightCol + '" title="Chance to trigger a fight when stunned">⚔ Fight ' + fightPct + '%</span>'
          + '</div>'
          + angerBar
          + '<div class="thiev-loot-row">' + lootHtml + '</div>'
          + actionBtnHtml)
        + '</div>';
    }

    // ── PICKPOCKET SECTION ─────────────────────────────────────────
    const pickpockets = GAME_DATA.thievingTargets.filter(function(t) { return !t.isStall; });
    html += '<h2 class="section-title">Pickpocket Targets</h2><div class="thiev-target-grid">';
    for (const t of pickpockets) {
      const isActive = s.activeSkill === 'thieving' && s.activeAction === t.id;
      html += renderTargetCard(t, isActive, thievLv, s);
    }
    html += '</div>';

    // ── STALLS SECTION ─────────────────────────────────────────────
    const stalls = GAME_DATA.thievingTargets.filter(function(t) { return t.isStall; });
    html += '<h2 class="section-title">Market Stalls</h2><div class="thiev-target-grid">';
    for (const t of stalls) {
      const isActive = s.activeSkill === 'thieving' && s.activeAction === t.id;
      html += renderTargetCard(t, isActive, thievLv, s);
    }
    html += '</div>';

    // ── HOW IT WORKS ───────────────────────────────────────────────
    html += '<div class="thiev-mechanics-note">'
      + '<h4>⚠ How Thieving Works</h4>'
      + '<p><strong>Stun:</strong> Getting caught pauses your action and deals damage. Stun damage scales with target level.</p>'
      + '<p><strong>Anger:</strong> Each stun increases target anger. High anger raises fight chance significantly.</p>'
      + '<p><strong>Fight Chance formula:</strong> (2%–10% base by level) + anger×40%. A very angry Knight → 30%+ fight chance per stun.</p>'
      + '<p><strong>Auto-eat:</strong> Fires at 40% HP. Add food from the Bank page. You can also eat manually above.</p>'
      + '<p><strong>Death:</strong> HP reaches 0 — you lose 50% gold, HP restores, action stops.</p>'
      + '<p><strong>Mastery:</strong> Each mastery level on a target reduces stun chance by 0.3%.</p>'
      + '</div>';

    el.innerHTML = html;
  }
  renderCombatPage(el) {
    try {
    const s = this.engine.state, c = s.combat;
    if (!c) { el.innerHTML = '<div class="bank-empty">Combat state error. Refresh the page.</div>'; return; }

    // ── LAYOUT CONFIG ────────────────────────────────────────────
    let _layout = null;
    try { const _r = localStorage.getItem('ashfall_combat_layout'); if(_r) _layout = JSON.parse(_r); } catch(e){}
    const combatStyle = c.combatStyle || 'melee';
    const _panelOn = () => true; // all panels on by default
    const xpMode      = c.xpMode || 'controlled';
    const mon  = c.active && c.monster ? (GAME_DATA.monsters[c.monster] || (GAME_DATA.worldBosses||[]).find(b=>b.id===c.monster)) : null;
    const max  = this.engine.getMaxHp ? this.engine.getMaxHp() : 100;

    // HP / mana colours
    const pHpPct   = Math.min(100, Math.max(0, ((c.playerHp||0)/max)*100));
    const mHpPct   = mon ? Math.min(100, Math.max(0, ((c.monsterHp||0)/(mon.hp||1))*100)) : 0;
    const pHpColor = pHpPct > 60 ? '#4abe6c' : pHpPct > 30 ? '#d4a83a' : '#c44040';
    const mHpColor = mHpPct > 60 ? '#c44040' : mHpPct > 30 ? '#d4a83a' : '#4abe6c';

    // Prayer
    const _pp    = s.prayerPoints || 0;
    const _maxPp = (s.skills.prayer?.level||1) * 10;

    // Mana
    const _mana  = c.mana || {current:100, max:100};

    // Phase / weakness / protect prayer
    let currentPhase = null, bossPhaseIdx = 0;
    if (mon?.phases) {
      for (let i = 0; i < mon.phases.length; i++) {
        if (mHpPct/100 <= mon.phases[i].threshold) { currentPhase = mon.phases[i]; bossPhaseIdx = i+1; break; }
      }
    }
    const weakness = mon ? (GAME_DATA.monsterWeaknesses?.[c.monster]) : null;
    const protPrayer = (s.activePrayers||[]).find(pid=>['protect_melee','protect_ranged','protect_magic'].includes(pid));
    const overheadIcon = {protect_melee:'⚔',protect_ranged:'🏹',protect_magic:'🔮'};

    // Player avatar
    const _pName   = (typeof online!=='undefined'&&online.displayName) ? online.displayName : 'You';
    const _styleIcon = {melee:'⚔',ranged:'🏹',magic:'🔮'}[combatStyle]||'⚔';
    let _playerAvatar = 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Morpheus&backgroundColor=0a0b0f';
    if (s.profile) {
      try {
        const getAvatarUrl = window.getAvatarUrl;
        if (typeof getAvatarUrl === 'function') _playerAvatar = getAvatarUrl(s.profile);
      } catch(e){}
    }

    // Session loot
    const sl   = c._sessionLoot || {};
    const _sk2 = c._sessionKills || 0;
    const _sd  = c._sessionDmg || {};
    const _elapsed = c._sessionStartTime ? (Date.now()-c._sessionStartTime)/1000 : 0;
    const _dps  = _elapsed>0 ? (_sd.total||0)/_elapsed : 0;
    const _sdMisses = _sd.misses||0; const _acc = (_sd.hits||0)+_sdMisses>0 ? Math.round((_sd.hits||0)/((_sd.hits||0)+_sdMisses)*100) : 0;
    const _crit = _sd.hits>0 ? Math.round((_sd.crits||0)/_sd.hits*100) : 0;

    // ── OPEN TWO-COLUMN GRID ──────────────────────────────────────
    const _isMobile = typeof window !== 'undefined' && (window.innerWidth || 768) <= 768;
    let html = `<div class="combat-page cv3-page"><div class="cv3-main">`;

    // ══════════════════════════════════════════════════════════════
    // ARENA — always first
    // ══════════════════════════════════════════════════════════════
    if (c.active && mon) {

      // ── Fight Cave wave bar ──────────────────────────────────────
      const _fc = s.fightCave; const _fcActive = _fc && _fc.active;
      if (_fcActive && !_fc.betweenWaves) {
        const _fwNum = _fc.currentWave + 1;
        const _fwPct = Math.round(_fwNum / 63 * 100);
        html += `<div class="fc-wave-bar">
          <div class="fc-wave-fill" style="width:${_fwPct}%"></div>
          <span class="fc-wave-label">Wave ${_fwNum} / 63</span>
        </div>`;
      }

      // ── MAIN ARENA ───────────────────────────────────────────────
      html += `<div class="arena-v3 combat-arena">

        <div class="arena-main">
          <!-- PLAYER ─────────────────────────────────────────── -->
          <div class="arena-player">
            <div class="arena-player-top">
              ${protPrayer ? `<div class="arena-overhead-prayer" title="${protPrayer.replace(/_/g,' ')}">${overheadIcon[protPrayer]||'🛡'}</div>` : ''}
              <div class="arena-avatar-wrap">
                <img src="${_playerAvatar}" width="56" height="56" class="arena-avatar">
                <div class="arena-style-badge">${_styleIcon}</div>
              </div>
              <div class="arena-pname">${_pName}</div>
              <div class="arena-plevel">Combat Lv ${this.engine.getCombatLevel()}</div>
            </div>
            <div class="arena-bars">
              <div class="arena-bar-row">
                <span class="arena-bar-icon" style="color:#c44040">❤</span>
                <div class="arena-bar-track"><div class="arena-bar-fill" id="php-bar" style="width:${pHpPct.toFixed(1)}%;background:${pHpColor}"></div></div>
                <span class="arena-bar-text" id="php-text">${Math.max(0,Math.floor(c.playerHp||0))} / ${max}</span>
              </div>
              <div class="arena-bar-row">
                <span class="arena-bar-icon" style="color:#4a7ec4">✦</span>
                <div class="arena-bar-track"><div class="arena-bar-fill" id="mana-bar" style="width:${Math.min(100,(_mana.current/_mana.max||1)*100).toFixed(1)}%;background:linear-gradient(90deg,#1a4a8e,#3a7adc)"></div></div>
                <span class="arena-bar-text" id="mana-text">${Math.floor(_mana.current)} / ${_mana.max}</span>
              </div>
              <div class="arena-bar-row">
                <span class="arena-bar-icon" style="color:#d4a83a">✶</span>
                <div class="arena-bar-track"><div class="arena-bar-fill" id="pp-bar" style="width:${Math.round(_pp/Math.max(1,_maxPp)*100)}%;background:linear-gradient(90deg,#9b6c10,#d4a83a)"></div></div>
                <span class="arena-bar-text arena-bar-text-wide" id="pp-live">${_pp}/${_maxPp}</span>
              </div>
            </div>
            ${(c.activeBuffs||[]).length ? `<div class="arena-buff-row">${(c.activeBuffs||[]).slice(0,4).map(b=>{
              const dur = b.type==='time'?Math.ceil(b.remaining)+'s':b.type==='hits'?b.remaining+'x':'';
              const col = b.stat==='damageMult'?'#c44040':b.stat==='damageReduction'?'#4a7ec4':b.stat==='onKillHeal'?'#4abe6c':'#c9873e';
              const lbl = b.stat==='damageMult'?'DMG↑':b.stat==='damageReduction'?'DR↑':b.stat==='strengthBonus'?'STR+':b.stat==='attackBonus'?'ATK+':b.stat==='onKillHeal'?'HEAL':b.stat==='dodgeCharges'?'DODGE':b.stat==='vengeance'?'VENG':'BUFF';
              return `<div class="arena-mini-buff" style="border-color:${col}40;color:${col}"><span>${lbl}</span><span>${dur}</span></div>`;
            }).join('')}</div>` : ''}
            <div class="arena-status" id="player-status-live"></div>
            <div class="splat-area" id="player-splats"></div>
          </div>

          <!-- CENTER ───────────────────────────────────────────── -->
          <div class="arena-center">
            <div class="arena-vs">VS</div>
            <div class="arena-center-stats">
              <div class="arena-stat-line"><span class="arena-stat-label">Kills</span><span class="arena-stat-val" id="kill-count">${_sk2}</span></div>
              <div class="arena-stat-line"><span class="arena-stat-label">Dealt</span><span class="arena-stat-val">${this.fmt(_sd.total||0)}</span></div>
              <div class="arena-stat-line"><span class="arena-stat-label">DPS</span><span class="arena-stat-val">${_dps>0?_dps.toFixed(1):'—'}</span></div>
            </div>
            ${weakness ? `<div class="arena-weakness">⚠ Weak: ${weakness.weak} +${weakness.bonus}%</div>` : ''}
            ${mon.desc ? `<div class="arena-mon-desc">${mon.desc}</div>` : ''}
            <button class="arena-flee-btn" onclick="game.stopCombat()">Flee</button>
            ${s.combat._isWilderness ? `<div class="arena-wild-controls">
              ${s.combat._teleBlocked > 0
                ? `<button class="btn btn-xs arena-tele-btn arena-tele-blocked" disabled title="TeleBlocked for ${s.combat._teleBlocked} more rounds">🔒 TeleBlocked (${s.combat._teleBlocked})</button>`
                : `<button class="btn btn-xs arena-tele-btn" onclick="game.castTeleHome()" title="Escape wilderness (3 Fire + 5 Air runes)">🌀 TeleHome</button>`
              }
              ${(s._wildSkull && s._wildSkull.expiresAt > Date.now()) ? `<div class="arena-skull-badge">💀 SKULLED</div>` : ''}
            </div>` : ''}
          </div>

          <!-- MONSTER ──────────────────────────────────────────── -->
          <div class="arena-monster">
            <div class="arena-mon-name">${mon.name}</div>
            <div class="arena-mon-level">Lv ${mon.combatLevel||0} · ${(mon.style||'melee').toUpperCase()}${mon.slayerReq?` · Slay ${mon.slayerReq}+`:''}</div>
            <!-- Enemy HP bar — lives in monster column, right side -->
            <div class="mon-hp-bar-wrap">
              <div class="mon-hp-bar-track">
                <div class="mon-hp-bar-fill" id="mhp-bar" style="width:${mHpPct.toFixed(1)}%;background:${mHpColor}"></div>
              </div>
              <div class="mon-hp-bar-text">
                <span id="mhp-text">${Math.max(0,Math.ceil(c.monsterHp||0))} / ${mon.hp||0}</span>
                <span id="mhp-pct" style="color:${mHpColor};font-weight:700">${mHpPct.toFixed(0)}%</span>
              </div>
              ${currentPhase ? `<div class="atb-phase ${currentPhase.enrage?'atb-enrage':''}">${currentPhase.enrage?'🔥':''} ${currentPhase.name}</div>` : ''}
            </div>
            <div class="arena-monster-art ${currentPhase?.enrage?'enrage-shake':''}">
              ${GAME_DATA.monsterArt?.[c.monster] || `<div class="arena-mon-placeholder"><svg viewBox="0 0 80 80"><circle cx="40" cy="35" r="20" fill="rgba(255,255,255,0.06)"/><path d="M20 70 Q40 45 60 70" fill="rgba(255,255,255,0.06)"/></svg></div>`}
            </div>
            <div class="arena-status arena-status-right" id="monster-status-live"></div>
            <div class="splat-area" id="monster-splats"></div>
          </div>
        </div>
      </div>`;

      // ── ABILITY BAR ──────────────────────────────────────────────
      if (_panelOn('abilities')) {
        const _equipped = (s.equippedAbilities||[]).map(aid=>aid?GAME_DATA.abilities.find(a=>a.id===aid):null).filter(Boolean);
        html += `<div class="ability-bar-v3">
          <div class="ab3-section-label">Special Attacks</div>
          <div class="ab3-specials">`;
        for (const ab of _equipped) {
          const cd = (c.abilityCooldowns||{})[ab.id] || 0;
          const cdPct = cd > 0 ? Math.min(100,(cd/ab.cooldown)*100) : 0;
          const noMana = (ab.manaCost||0) > 0 && (_mana.current||0) < (ab.manaCost||0);
          const ready  = cd <= 0 && !noMana;
          html += `<button class="ab3-btn ${cd>0?'ab3-cd':''} ${noMana?'ab3-no-mana':''}" data-abid="${ab.id}"
            onclick="game.useAbility('${ab.id}')"
            title="${ab.desc}${ab.manaCost?' | '+ab.manaCost+' mana':''}">
            <div class="ab3-cd-sweep" style="--sweep:${cdPct}%"></div>
            <div class="ab3-icon">${(ab.svgIcon||GAME_DATA.abilityIcons?.[ab.id]) ? `<div class="ab3-svg-icon">${ab.svgIcon||GAME_DATA.abilityIcons[ab.id]}</div>` : (ab.icon||'⚔')}</div>
            <div class="ab3-name">${ab.name}</div>
            <div class="ab3-status ${ready?'ab3-ready':cd>0?'ab3-cooling':'ab3-nomana'}">
              ${cd>0?Math.ceil(cd)+'s':noMana?'No mana':'Ready'}
            </div>
            ${ab.manaCost?`<div class="ab3-mana">${ab.manaCost}mp</div>`:''}
          </button>`;
        }
        if (_equipped.length === 0) html += `<div class="ab3-empty">No abilities equipped — visit the Abilities tab to equip up to 4.</div>`;
        html += `</div>`;

        // Active buff chips
        if ((c.activeBuffs||[]).length) {
          html += `<div class="ab3-buffs">`;
          for (const b of (c.activeBuffs||[])) {
            const pct = b._maxDuration > 0 ? Math.min(100, b.remaining / b._maxDuration * 100) : 100;
            const lbl = b.stat==='damageMult'?`×${b.value.toFixed(2)} DMG`:
                        b.stat==='damageReduction'?`-${b.value}% DR`:
                        b.stat==='dodgeCharges'?`${b.value} Dodge`:
                        b.stat==='onKillHeal'?`Heal on Kill`:
                        b.stat==='vengeance'?'Vengeance':
                        (b.stat||'Buff').replace(/Bonus/,'').replace(/([A-Z])/,' $1').trim();
            html += `<div class="ab3-buff-chip" title="${lbl} — ${Math.ceil(b.remaining)}s">
              <span class="ab3-bc-label">${lbl}</span>
              <div class="ab3-bc-bar"><div class="ab3-bc-fill" style="width:${pct}%"></div></div>
            </div>`;
          }
          html += `</div>`;
        }
        html += `</div>`;
      }

    } else {
      // ── AREA SELECT ──────────────────────────────────────────────
      html += '<div class="combat-controls">';
      html += '<div class="cc-group"><div class="cc-label">Combat Style</div><div class="cc-btns">';
      for (const [id,label,ic] of [['melee','⚔ Melee','sword'],['ranged','🏹 Ranged','target'],['magic','🔮 Magic','wand']]) {
        html += `<button class="cc-btn ${combatStyle===id?'cc-btn-active':''}" onclick="ui.setStyle('${id}')">${label}</button>`;
      }
      html += '</div></div></div>';

      // XP Stats grid
      const _cSkills = ['attack','strength','defence','hitpoints','ranged','magic','prayer','slayer','tactics'];
      html += '<div class="combat-xp-panel">';
      for (const sk of _cSkills) {
        const skill = s.skills[sk]; if (!skill) continue;
        const _p = this.engine.getXpProgress ? this.engine.getXpProgress(sk) : 0;
        const _name = GAME_DATA.skills[sk]?.name || sk;
        html += `<div class="cxp-row" title="${_name} — Level ${skill.level}">
          <span class="cxp-icon">${icon(GAME_DATA.skills[sk]?.icon||'sparkle',14)}</span>
          <span class="cxp-name">${_name}</span>
          <span class="cxp-level">${skill.level}</span>
          <div class="cxp-bar"><div class="cxp-fill" style="width:${(_p*100).toFixed(1)}%"></div></div>
          <span class="cxp-xp">${this.fmt(skill.xp)}</span>
        </div>`;
      }
      html += '</div>';

      // Area grid — grouped by tier
      const _cb = this.engine.getCombatLevel();
      const _areaTiers = [
        {label:'Beginner', min:1,  max:29,  icon:'🌿'},
        {label:'Intermediate', min:30, max:59, icon:'⚔'},
        {label:'Advanced', min:60, max:84, icon:'🔥'},
        {label:'Elite',    min:85, max:999, icon:'💀'},
      ];
      for (const tier of _areaTiers) {
        const tierAreas = GAME_DATA.combatAreas.filter(a=>!a.isGauntlet&&a.levelReq>=tier.min&&a.levelReq<=tier.max);
        if (!tierAreas.length) continue;
        html += `<h2 class="section-title">${tier.icon} ${tier.label} Areas</h2><div class="area-grid">`;
        for (const area of tierAreas) {
          const locked = _cb < area.levelReq;
          const validMons = (area.monsters||[]).filter(mid=>GAME_DATA.monsters[mid]);
          // Pick a representative monster for area card art
          const _repMon = validMons.find(mid=>GAME_DATA.monsterArt?.[mid]) || validMons[0];
          const _repArt  = _repMon ? GAME_DATA.monsterArt?.[_repMon] : '';
          html += `<div class="area-card-v2 ${locked?'area-locked':''}">
            <div class="area-header">
              <span class="area-name">${area.name}</span>
              <span class="area-req">Cb ${area.levelReq}+</span>
            </div>
            ${_repArt ? `<div class="area-card-art">${_repArt}</div>` : ''}
            <div class="area-desc">${area.desc||''}</div>
            ${area.wilderness?'<div class="area-wild-badge">⚠ Wilderness — PvP risk</div>':''}
            ${area.slayerArea?'<div class="area-slayer-badge">⚔ Slayer area</div>':''}
          `;
          if (!locked && validMons.length) {
            html += '<div class="area-monster-list">';
            for (const mid of validMons) {
              const m = GAME_DATA.monsters[mid]; if (!m) continue;
              const styleIcon = {melee:'⚔',ranged:'🏹',magic:'🔮'}[m.style||'melee']||'⚔';
              const diffColor = m.combatLevel<30?'#4abe6c':m.combatLevel<80?'#d4a83a':m.combatLevel<150?'#c9873e':'#c44040';
              html += `<button class="area-monster-btn" onclick="game.startCombat('${area.id}','${mid}')" title="${m.desc||m.name}">
                <span class="amb-icon">${styleIcon}</span>
                <span class="amb-name">${m.name}</span>
                <span class="amb-level" style="color:${diffColor}">Lv ${m.combatLevel}</span>
                ${m.slayerReq?`<span class="amb-slayer">Slay ${m.slayerReq}+</span>`:''}
              </button>`;
            }
            html += '</div>';
            html += `<button class="btn btn-xs area-random-btn" onclick="game.startCombat('${area.id}')">⚡ Random</button>`;
          } else if (!locked) {
            html += `<button class="btn btn-sm area-start-btn" onclick="game.startCombat('${area.id}')">Fight Here</button>`;
          }
          html += `${locked?`<div class="locked-overlay">Combat Lv ${area.levelReq}</div>`:''}
          </div>`;
        }
        html += '</div>';
      }
    }

    // ══════════════════════════════════════════════════════════════
    // ALWAYS-VISIBLE SECTIONS (prayers, runes, food, gear)
    // Only when in combat
    // ══════════════════════════════════════════════════════════════
    if (c.active && mon) {

      // ── PRAYERS ─────────────────────────────────────────────────
      {
        const _activePrayers = s.activePrayers || [];
        const _pIconMap = {
          thick_skin:'🛡',rock_skin:'🛡',steel_skin:'🛡',steel_skin_t3:'🛡',
          superhuman_strength:'💪',ultimate_strength:'💪',burst_of_strength:'💪',
          clarity_of_thought:'⚔',incredible_reflexes:'⚔',improved_reflexes:'⚔',
          sharp_eye:'🏹',hawk_eye:'🏹',
          mystic_will:'🔮',mystic_lore:'🔮',
          protect_melee:'⚔',protect_ranged:'🏹',protect_magic:'🔮',
          chivalry:'⚜',piety:'⚜',rigour:'🏹',augury:'🔮',
          soul_split:'✦',turmoil:'💢',
        };
        html += `<div class="prayer-v3">
          <div class="pv3-header">
            <div class="pv3-title">Prayers</div>
            <div class="pv3-pp-wrap">
              <div class="pv3-pp-bar"><div class="pv3-pp-fill" id="prayer-fill-bar" style="width:${Math.round(_pp/Math.max(1,_maxPp)*100)}%"></div></div>
              <span class="pv3-pp-text" id="pp-live2">${_pp}/${_maxPp} pp</span>
            </div>
            <span class="pv3-slots">${_activePrayers.length}/2 active</span>
          </div>
          <div class="pv3-grid">`;
        for (const p of GAME_DATA.prayers) {
          if ((s.skills.prayer?.level||1) < p.level) continue;
          if (p.book === 'unholy' && !(s.quests?.completed||[]).includes('unholy_path')) continue;
          const active = _activePrayers.includes(p.id);
          const _svgIcon = p.svgIcon || (GAME_DATA.prayerIcons?.[p.id] || null);
          const _fallbackIcon = _pIconMap[p.id] || (p.book==='unholy'?'☠':'✦');
          const _tier = p.level<=30?'T1':p.level<=60?'T2':p.level<=75?'T3':'T4';
          const _isUnholy = p.book==='unholy';
          html += `<button class="pv3-btn ${active?'pv3-active':''} ${_isUnholy?'pv3-unholy':''}"
            onclick="game.activatePrayer('${p.id}');ui.renderPage('combat')"
            title="${p.desc||p.name} — ${p.pointCost}pp/atk${_isUnholy?' | UNHOLY':''}"
            style="${_isUnholy&&active?'border-color:#8a2ae0;background:rgba(138,42,224,0.15);':''}">
            <div class="pv3-btn-icon">${_svgIcon ? `<div class="pv3-svg-icon">${_svgIcon}</div>` : _fallbackIcon}</div>
            <div class="pv3-btn-name">${p.name}</div>
            <div class="pv3-btn-meta">
              <span class="pv3-tier" style="${_isUnholy?'color:#8a2ae0;border-color:#8a2ae060;':''}">${_tier}</span>
              <span class="pv3-cost">${p.pointCost}pp</span>
            </div>
            ${active?'<div class="pv3-active-glow"></div>':''}
          </button>`;
        }
        html += `</div></div>`;
      }

      // ── RUNE POUCH (magic only) ─────────────────────────────────
      if (combatStyle === 'magic' || (s.bank && Object.keys(s.bank).some(k=>k.endsWith('_rune')&&s.bank[k]>0))) {
        const runeTypes = ['air_rune','water_rune','earth_rune','fire_rune','mind_rune','chaos_rune','nature_rune','law_rune','cosmic_rune','death_rune','blood_rune','soul_rune','wrath_rune','ash_rune'];
        const ownedRunes = runeTypes.filter(r => (s.bank[r]||0) > 0);
        if (ownedRunes.length) {
          const runeColors = {fire_rune:'#d63a1a',water_rune:'#4a7ec4',earth_rune:'#8a6a3a',air_rune:'#c8cad4',chaos_rune:'#8a5ec4',death_rune:'#4a4a5a',blood_rune:'#c44040',soul_rune:'#b585e0',wrath_rune:'#ff6040',nature_rune:'#3a9e5c',law_rune:'#dde4f0',cosmic_rune:'#7a5ec4',mind_rune:'#5ac4c4',ash_rune:'#d67338'};
          html += `<div class="combat-section rune-pouch-section"><div class="cs-header">Rune Pouch</div><div class="rune-pouch-grid">`;
          for (const rId of ownedRunes) {
            const qty = s.bank[rId]||0;
            const item = GAME_DATA.items[rId];
            const color = runeColors[rId] || '#888';
            const abbr = (item?.name||rId).replace(' Rune','').slice(0,3).toUpperCase();
            const qtyFmt = qty>=1000?`${Math.round(qty/100)/10}k`:qty;
            html += `<div class="rp3-rune" title="${item?.name||rId}: ${qty.toLocaleString()}">
              <svg class="rp3-icon" viewBox="0 0 22 22">
                <polygon points="11,2 19,7 19,15 11,20 3,15 3,7" fill="${color}" opacity="0.85"/>
                <polygon points="11,4 17,8 17,14 11,18 5,14 5,8" fill="${color}" opacity="0.35"/>
                <text x="11" y="14" text-anchor="middle" fill="#fff" font-size="6" font-weight="bold">${abbr}</text>
              </svg>
              <span class="rp3-qty">${qtyFmt}</span>
            </div>`;
          }
          html += `</div></div>`;
        }
      }

      // ── FOOD + POTIONS + EQ BONUSES ─────────────────────────────
      html += `<div class="combat-loadout">
        <div class="cl-food">
          <div class="cs-header">Food</div>
          <div class="food-bag" id="food-bag">`;
      const foodBag = s.foodBag || [];
      if (foodBag.length > 0) {
        for (let i = 0; i < foodBag.length; i++) {
          const slot = foodBag[i];
          const item = GAME_DATA.items[slot.id];
          if (!item) continue;
          html += `<div class="fb-slot fb-clickable" onclick="game.eatFoodSlot(${i})" title="${item.name}: Heals ${item.heals||0} HP">
            <span class="fb-name">${item.name}</span>
            <span class="fb-qty" id="fb-qty-${i}">x${slot.qty}</span>
            <span class="fb-heals">+${item.heals||0}</span>
          </div>`;
        }
      } else {
        html += `<div class="cc-info">No food. Equip from Bank.</div>`;
      }
      html += `</div>
          <div class="cl-food-btns">
            <button class="btn btn-xs" onclick="game.eatFood()">Eat Best</button>
            <label class="auto-eat-label"><input type="checkbox" ${c.autoEat?'checked':''} onchange="ui.toggleAutoEat()"> Auto @ 40%</label>
          </div>
        </div>
        <div class="cl-potions">
          <div class="cs-header">Potions <span class="cs-header-sub">tap to drink</span></div>
          <div class="potion-belt" id="potion-belt">`;
      for (let i = 0; i < 4; i++) {
        const slot = s.potionBelt[i];
        const pot  = slot?.id ? GAME_DATA.items[slot.id] : null;
        if (pot) {
          const shortName = pot.name.replace(' Potion','').replace('Super ','S.');
          let effectStr = pot.desc||'';
          if (pot.buff) { const sL=(pot.buff.stat||'').replace('Bonus','').replace(/([A-Z])/,' $1').trim(); effectStr=`+${pot.buff.value} ${sL} ${pot.buff.duration||120}s`; }
          html += `<button class="pb-slot pb-filled" onclick="game.drinkPotionBelt(${i})" title="${pot.name}\n${slot.qty} left">
            <div class="pb-icon-wrap">${window.renderItemSprite?renderItemSprite(slot.id,18):'🧪'}</div>
            <span class="pb-name">${shortName}</span>
            <span class="pb-qty" id="pb-qty-${i}">${slot.qty}</span>
          </button>`;
        } else {
          html += `<div class="pb-slot pb-empty"><span class="pb-empty-num">${i+1}</span></div>`;
        }
      }
      html += `</div>
          <button class="btn btn-xs pb-manage-btn" onclick="ui.renderPage('equipment')">⚙ Belt</button>
        </div>
        <div class="cl-stats">
          <div class="cs-header">Equipment Bonuses</div>
          <div class="cl-stat-chips">`;
      for (const [stat,label] of [['attackBonus','ATK'],['strengthBonus','STR'],['defenceBonus','DEF'],['rangedBonus','RNG'],['magicBonus','MAG'],['damageReduction','DR']]) {
        const v = this.engine.getStatTotal ? Math.round(this.engine.getStatTotal(stat)) : 0;
        html += `<span class="stat-chip ${v>0?'':'stat-zero'}">${v>0?'+':''}${v} ${label}</span>`;
      }
      html += `<span class="stat-chip stat-speed">${this.engine.getPlayerAttackSpeed?.().toFixed(1)||'—'}s</span>`;
      html += `</div></div></div>`;

      // ── GEAR STRIP ───────────────────────────────────────────────
      {
        const _gSlots = [['weapon','Weapon'],['shield','Shield'],['head','Helm'],['body','Body'],['legs','Legs'],['cape','Cape'],['gloves','Gloves'],['boots','Boots'],['ring','Ring'],['amulet','Amulet'],['ammo','Ammo']];
        const _bStats = [['attackBonus','ATK','#e0a060'],['strengthBonus','STR','#c44040'],['defenceBonus','DEF','#4a7ec4'],['rangedBonus','RNG','#4a8a3e'],['magicBonus','MAG','#8a5ec4']];
        html += `<div class="gear-strip-v3">
          <div class="gs3-header">
            <span class="gs3-title">Equipped Gear</span>
            <div class="gs3-bonuses">${_bStats.map(([sk,lb,cl])=>{
              const v=this.engine.getStatTotal?Math.round(this.engine.getStatTotal(sk)):0;
              return `<span class="gs3-bonus" style="color:${cl}">${v>0?'+':''}${v} ${lb}</span>`;
            }).join('')}</div>
          </div>
          <div class="gs3-slots">`;
        for (const [slot,lbl] of _gSlots) {
          const eid=s.equipment[slot], ei=eid?GAME_DATA.items[eid]:null;
          const isAmmo=slot==='ammo', aq=isAmmo&&eid?(s.bank[eid]||0):null;
          const rc=ei&&this.getRarityColor?this.getRarityColor(eid):'';
          const tip=ei?(ei.name+(ei.stats?' — '+Object.entries(ei.stats).map(([k,v])=>'+'+v+' '+k.replace('Bonus','')).join(', '):'')):'Empty '+lbl;
          html += `<div class="gs3-slot ${ei?'gs3-filled':'gs3-empty'}" title="${tip}">
            <div class="gs3-slot-label">${lbl}</div>
            <div class="gs3-slot-icon">${ei&&window.renderItemSprite?renderItemSprite(eid,20):''}</div>
            <div class="gs3-slot-name" style="${rc?'color:'+rc:''}">${ei?ei.name.split(' ').slice(-1)[0]:'—'}</div>
            ${isAmmo&&aq!==null?`<div class="gs3-ammo-qty">${aq>=1000?Math.round(aq/100)/10+'k':aq}</div>`:''}
          </div>`;
        }
        html += `</div>
          <div class="gs3-actions">
            <button class="btn btn-xs" onclick="ui.renderPage('equipment')">⚙ Equipment</button>
            <button class="btn btn-xs" onclick="ui.renderPage('bank')">Bank</button>
            <button class="btn btn-xs" onclick="ui.renderPage('gear_sets')">Gear Sets</button>
          </div>
        </div>`;
      }

      // ── SPEC BAR ─────────────────────────────────────────────────
      // ── SPECIAL ATTACK BAR — always show when weapon has spec ──────
      const specData = this.engine._getSpecWeapon ? this.engine._getSpecWeapon() : null;
      // Fallback: check equipped weapon directly if _getSpecWeapon not ready
      const _specWeapon = specData || (() => {
        const wId = s.equipment?.weapon;
        const w = wId ? GAME_DATA.items[wId] : null;
        return w?.specCost ? {name:w.name,desc:w.desc||'',specCost:w.specCost} : null;
      })();
      {
        const specPct  = Math.min(100, s.specEnergy || 0);
        const specCost = _specWeapon?.specCost || 50;
        const canUse   = specPct >= specCost;
        html += `<div class="spec-bar-v2">
          <div class="spec-bar-label">
            <span>⚡ ${_specWeapon ? `Special — ${_specWeapon.name}` : 'Special Attack'}</span>
            <span class="spec-pct" id="spec-pct">${specPct}%</span>
          </div>
          <div class="spec-bar-track">
            <div class="spec-bar-fill" id="spec-fill" style="width:${specPct}%"></div>
            ${_specWeapon ? `<div class="spec-cost-line" style="left:${specCost}%" title="${specCost}% cost"></div>` : ''}
          </div>
          ${_specWeapon ? `<div class="spec-desc">${_specWeapon.desc}</div>` : '<div class="spec-desc" style="color:var(--text-dim)">Equip a weapon with a special attack</div>'}
          <button class="btn btn-sm spec-use-btn ${canUse?'spec-ready':'spec-not-ready'}"
            onclick="game.useSpecial()"
            ${!canUse?`disabled title="Need ${specCost}% energy"`:''}>
            ${canUse ? `⚡ USE SPECIAL (${specCost}% energy)` : `Charging… ${specPct}/${specCost}%`}
          </button>
        </div>`;
      }

      // ── CANNON PANEL ─────────────────────────────────────────────
      const _hasCannon = this.engine.hasCannon?.() || false;
      const _cannonActive = c.cannon?.active || false;
      const _cannonBalls = s.bank['cannonball'] || 0;
      const _cannonQuestDone = this.engine.isCannonQuestComplete?.() || false;
      if (_hasCannon && c.active) {
        html += `<div class="cannon-panel ${_cannonActive?'cannon-active':''}" id="cannon-panel">
          <div class="cannon-panel-header">
            <div class="cannon-panel-title">🔴 Ashforge Cannon</div>
            <div class="cannon-status">${_cannonActive?'FIRING':'Standby'}</div>
          </div>
          <div class="cannon-panel-body">
            <div class="cannon-balls-row">
              <span class="cannon-balls-label">Cannonballs</span>
              <span class="cannon-balls" id="cannon-balls">${_cannonBalls.toLocaleString()}</span>
            </div>
            <button class="btn ${_cannonActive?'btn-danger':'btn-primary'} btn-sm cannon-toggle-btn"
              onclick="game.toggleCannon()">
              ${_cannonActive?'Pack Up':'Deploy Cannon'}
            </button>
          </div>
        </div>`;
      } else if (_cannonQuestDone && !_hasCannon && c.active) {
        html += `<div class="cannon-panel cannon-missing">
          <div class="cannon-panel-header"><div class="cannon-panel-title">🔴 Cannon</div></div>
          <div style="font-size:11px;color:var(--text-dim);padding:6px">Smith an Ashforge Cannon (Smithing 42) to deploy it.</div>
        </div>`;
      }

      // ── SLAYER TASK ───────────────────────────────────────────────
      if (s.slayerTask) {
        const _st = s.slayerTask;
        const _stMon = GAME_DATA.monsters[_st.monster];
        const _stAmt = _st.amount || _st.qty || 1; // field is `amount` not `qty`
        const _stKilled = _st.killed || 0;
        const _stPct = Math.min(100, Math.round(_stKilled / _stAmt * 100));
        const _stLeft = Math.max(0, _stAmt - _stKilled);
        const _stColor = _stPct>=75?'#4abe6c':_stPct>=40?'#d4a83a':'#c9873e';
        const _stArt = GAME_DATA.monsterArt?.[_st.monster] || '';
        const _isOnTask = c.active && c.monster === _st.monster;
        html += `<div class="slayer-task-card ${_isOnTask?'stc-active':''}">
          <div class="stc-top">
            <div class="stc-icon-wrap">
              <svg class="stc-sword" viewBox="0 0 24 24" width="20" height="20">
                <path d="M14.5 2L22 9.5 10 21.5 2.5 22 2 14.5Z" fill="none" stroke="#c9873e" stroke-width="1.5" stroke-linejoin="round"/>
                <path d="M14 3L20.5 9.5" stroke="#e4a840" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M2 22L6 18" stroke="#c9873e" stroke-width="2" stroke-linecap="round"/>
                <path d="M9 5L5 9" stroke="#c9873e" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              ${_isOnTask ? '<div class="stc-active-dot"></div>' : ''}
            </div>
            <div class="stc-info">
              <div class="stc-label">Slayer Task</div>
              <div class="stc-monster">${_stMon?.name||_st.monster}</div>
            </div>
            ${_stArt ? `<div class="stc-art">${_stArt}</div>` : ''}
          </div>
          <div class="stc-bar-row">
            <div class="stc-bar-track">
              <div class="stc-bar-fill" id="sts-fill" style="width:${_stPct}%;background:${_stColor}">
                <div class="stc-bar-shine"></div>
              </div>
              <div class="stc-bar-segments">${Array.from({length:9},(_,i)=>`<div class="stc-seg"></div>`).join('')}</div>
            </div>
            <div class="stc-counts">
              <span class="stc-killed" id="sts-killed" style="color:${_stColor}">${_stKilled}</span>
              <span class="stc-sep">/</span>
              <span class="stc-total">${_stAmt}</span>
            </div>
          </div>
          <div class="stc-bottom">
            <span class="stc-pct" id="sts-pct" style="color:${_stColor}">${_stPct}%</span>
            <span class="stc-left" id="sts-left">${_stLeft} remaining</span>
            <span class="stc-tier">${_st.tier||''}</span>
          </div>
        </div>`;
      }

      // ── FAMILIAR STRIP ────────────────────────────────────────────
      if (s.familiar?.active) {
        const _fam = GAME_DATA.familiars?.find(f=>f.id===s.familiar.active);
        const _famTimeLeft = Math.ceil((s.familiar.timeLeft||0)/60);
        if (_fam) html += `<div class="familiar-strip">
          <span class="familiar-name">🐾 ${_fam.name}</span>
          <span class="familiar-buff">${_fam.buff?.desc||''}</span>
          <span class="familiar-timer" id="familiar-timer">${_famTimeLeft}m left</span>
        </div>`;
      }

      // ── PET COMBAT STRIP ─────────────────────────────────────────
      if (s.activePet) {
        const _pets = GAME_DATA.combatPets||GAME_DATA.pets||[];
        const _pet  = _pets.find(p=>p.id===s.activePet);
        if (_pet) {
          const _petArt = GAME_DATA.petArt?.[s.activePet]||'';
          html += `<div class="pet-combat-strip" onclick="ui.renderPage('pets')" title="Pet — click to manage">
            <div class="pcs-art">${_petArt||`<div style="width:28px;height:28px;border-radius:50%;background:rgba(201,135,62,0.2);display:flex;align-items:center;justify-content:center;font-size:14px">🐾</div>`}</div>
            <div><div class="pcs-name">${_pet.name}</div><div class="pcs-ability">${_pet.action?.desc||''} every ${_pet.action?.every||3} attacks</div></div>
          </div>`;
        }
      } else {
        html += `<div class="pet-combat-strip" onclick="ui.renderPage('pets')" style="opacity:0.5" title="No pet — click to equip">
          <div class="pcs-art"><svg viewBox="0 0 28 28"><circle cx="14" cy="14" r="10" fill="none" stroke="var(--border)" stroke-width="1.5" stroke-dasharray="3,2"/><text x="14" y="18" text-anchor="middle" fill="var(--text-dim)" font-size="10">?</text></svg></div>
          <div><div class="pcs-name" style="color:var(--text-dim)">No pet equipped</div><div class="pcs-ability">Visit Pets to equip one</div></div>
        </div>`;
      }

      // ── COMBAT LOG ───────────────────────────────────────────────
      const showLog = this._showCombatLog || false;
      html += `<div class="combat-log-section">
        <div class="combat-log-header" onclick="ui._showCombatLog=!ui._showCombatLog;const l=document.getElementById('combat-log-body');if(l)l.style.display=ui._showCombatLog?'block':'none'">
          <span>📋 Combat Log</span>
          <span>${showLog?'▲':'▼'}</span>
          <button class="clog-clear-btn" onclick="event.stopPropagation();ui._combatLog=[];this.closest('.combat-log-section').querySelector('#combat-log-entries').innerHTML='<div class=cl-entry cl-miss>Cleared.</div>'">Clear</button>
        </div>
        <div id="combat-log-body" style="display:${showLog?'block':'none'}">
          <div class="combat-log-entries" id="combat-log-entries">
            ${(this._combatLog||[]).slice(-30).reverse().map(entry=>{
              const cls=entry.type==='hit'?'cl-hit':entry.type==='taken'?'cl-taken':entry.type==='miss'?'cl-miss':entry.type==='kill'?'cl-kill':'cl-dot';
              const ico=entry.type==='hit'?'⚔':entry.type==='taken'?'💥':entry.type==='miss'?'○':entry.type==='kill'?'💀':'⬡';
              return `<div class="cl-entry ${cls}">${ico} ${entry.text}</div>`;
            }).join('') || '<div class="cl-entry cl-miss">No combat yet.</div>'}
          </div>
        </div>
      </div>`;
    }

    // ══════════════════════════════════════════════════════════════
    // RIGHT SIDEBAR
    // ══════════════════════════════════════════════════════════════
    const _sd2 = c._sessionDmg || {};
    const _sk2b= c._sessionKills || 0;
    const _elapsed2 = c._sessionStartTime ? (Date.now()-c._sessionStartTime)/1000 : 0;
    const _dps2 = _elapsed2>0 ? ((_sd2.total||0)/_elapsed2).toFixed(1) : '—';
    const _killsHr = _elapsed2>0 ? Math.round(_sk2b/(_elapsed2/3600)) : 0;
    const _totalXp = c._xpBySkill ? Object.values(c._xpBySkill).reduce((a,b)=>a+b,0) : 0;
    const _xpHr = _elapsed2>3 ? Math.round(_totalXp/(_elapsed2/3600)) : 0;
    const _hits2 = (_sd2.hits||0)+(_sd2.misses||0);
    const _acc2 = _hits2>0 ? Math.round((_sd2.hits||0)/_hits2*100) : 0;
    const _crit2 = _sd2.hits>0 ? Math.round((_sd2.crits||0)/_sd2.hits*100) : 0;
    const _dmgRows = [
      {label:'Melee',  id:'sd-melee',  val:_sd2.melee||0,  col:'#c44040'},
      {label:'Ranged', id:'sd-ranged', val:_sd2.ranged||0, col:'#4a8a3e'},
      {label:'Magic',  id:'sd-magic',  val:_sd2.magic||0,  col:'#5a4ab0'},
      {label:'Ability',id:'sd-ability',val:_sd2.ability||0,col:'#c9873e'},
      {label:'Poison', id:'sd-poison', val:_sd2.poison||0, col:'#4abe6c'},
      {label:'Bleed',  id:'sd-bleed',  val:_sd2.bleed||0,  col:'#8a3a3a'},
    ];
    const _dmgMax = Math.max(1, ..._dmgRows.map(r=>r.val));
    const _curArea = GAME_DATA.combatAreas?.find(a=>a.id===c.area);
    const _xpRateRows = c._xpBySkill && _elapsed2>3
      ? Object.entries(c._xpBySkill).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([sk,xp])=>{
          const nm = GAME_DATA.skills[sk]?.name||sk;
          return `<div class="cv3s-xr-row"><span>${nm}</span><span class="cv3s-xr-val">${this.fmt(Math.round(xp/(_elapsed2/3600)))}/hr</span></div>`;
        }).join('')
      : '<div class="cv3s-xr-empty">Fight to see XP rates</div>';

    html += `</div><div class="cv3-sidebar">`;

    // XP Mode
    html += `<div class="cv3s-card"><div class="cv3s-title">XP Mode</div><div class="cv3s-xpmode">`;
    if (combatStyle==='melee') {
      for (const [id,lbl] of [['accurate','Attack'],['aggressive','Strength'],['defensive','Defence'],['controlled','Shared']]) {
        html += `<button class="cv3s-mode-btn ${xpMode===id?'cv3s-mode-active':''}" onclick="ui.setXpMode('${id}')">${lbl}</button>`;
      }
    } else if (combatStyle==='ranged') {
      for (const [id,lbl] of [['accurate','Accurate'],['rapid','Rapid'],['longrange','Long']]) {
        html += `<button class="cv3s-mode-btn ${xpMode===id?'cv3s-mode-active':''}" onclick="ui.setXpMode('${id}')">${lbl}</button>`;
      }
    } else {
      html += `<span class="cv3s-mode-info">80% Magic / 20% Defence</span>`;
    }
    html += `</div></div>`;

    // Session Loot
    html += `<div class="cv3s-card cv3s-loot" id="session-loot">
      <div class="cv3s-loot-header">
        <div class="cv3s-title">Session Loot</div>
        <span class="cv3s-kills-badge" id="cv3-kills">${_sk2b} Kills</span>
      </div>
      <div class="cv3s-loot-items" id="cv3-loot-items">`;
    if (Object.keys(sl).length === 0) {
      html += `<div class="cv3s-loot-empty">No loot yet</div>`;
    } else {
      if (sl._gold?.qty > 0) html += `<div class="cv3s-loot-row cv3s-gold"><span class="cv3s-li-name">🪙 Gold</span><span class="cv3s-li-qty">${this.fmt(sl._gold.qty)}</span></div>`;
      const _rarO = {mythic:0,legendary:1,epic:2,rare:3,uncommon:4,common:5};
      const _srt = Object.entries(sl).filter(([k])=>k!=='_gold').sort((a,b)=>(_rarO[a[1].rarity]||5)-(_rarO[b[1].rarity]||5)).slice(0,8);
      for (const [iid,dat] of _srt) {
        const _it = GAME_DATA.items[iid];
        const _rc = dat.rarity==='legendary'||dat.rarity==='mythic'?'cv3s-legendary':dat.rarity==='epic'?'cv3s-epic':dat.rarity==='rare'?'cv3s-rare':'';
        html += `<div class="cv3s-loot-row ${_rc}"><span class="cv3s-li-name">${_it?.name||iid}</span><span class="cv3s-li-qty">x${dat.qty}</span></div>`;
      }
      if (Object.keys(sl).length > 9) html += `<button class="cv3s-view-more" onclick="ui.renderPage('bank')">View All</button>`;
    }
    html += `</div></div>`;

    // Damage Tracker
    html += `<div class="cv3s-card" id="dmg-tracker">
      <div class="cv3s-dt-header">
        <div class="cv3s-title">Damage Tracker</div>
        <button class="cv3s-reset-btn" onclick="game.state.combat._sessionLoot={};game.state.combat._sessionKills=0;game.state.combat._sessionDmg={melee:0,ranged:0,magic:0,ability:0,burn:0,poison:0,bleed:0,total:0,taken:0,hits:0,misses:0,crits:0};game.state.combat._xpBySkill={};game.state.combat._sessionStartTime=Date.now();ui.renderPage('combat')">Reset</button>
      </div>
      <div class="cv3s-dt-rows">`;
    for (const row of _dmgRows) {
      const _pct = Math.round(row.val/_dmgMax*100);
      html += `<div class="cv3s-dt-row">
        <span class="cv3s-dt-label">${row.label}</span>
        <div class="cv3s-dt-bar-wrap"><div class="cv3s-dt-bar" id="${row.id}-bar" style="width:${_pct}%;background:${row.col}"></div></div>
        <span class="cv3s-dt-val" id="${row.id}">${this.fmt(row.val)}</span>
      </div>`;
    }
    html += `<div class="cv3s-dt-total"><span>Total</span><span id="sd-total">${this.fmt(_sd2.total||0)}</span></div>
        <div class="cv3s-dt-total cv3s-dt-taken"><span>Taken</span><span id="sd-taken">${this.fmt(_sd2.taken||0)}</span></div>
      </div>
      <div class="cv3s-dt-meta">
        <div class="cv3s-meta-chip"><span class="cv3s-meta-lbl">DPS</span><span id="sd-dps">${_dps2}</span></div>
        <div class="cv3s-meta-chip"><span class="cv3s-meta-lbl">ACC</span><span id="sd-acc">${_acc2}%</span></div>
        <div class="cv3s-meta-chip"><span class="cv3s-meta-lbl">CRIT</span><span id="sd-crit">${_crit2}%</span></div>
        <div class="cv3s-meta-chip"><span class="cv3s-meta-lbl">KILLS</span><span id="sd-kills">${_sk2b}</span></div>
      </div>
    </div>`;

    // Session Stats
    html += `<div class="cv3s-card" id="xp-rate-panel">
      <div class="cv3s-ss-header">
        <div class="cv3s-title">Session Stats <span class="cv3s-timer" id="session-time">${_elapsed2>0?Math.floor(_elapsed2/60)+'m '+Math.floor(_elapsed2%60)+'s':'—'}</span></div>
      </div>
      <div class="cv3s-ss-grid">
        <div class="cv3s-ss-box"><div class="cv3s-ss-val" id="cv3-xpgain">${_xpHr>0?this.fmt(_xpHr)+'/hr':this.fmt(_totalXp)}</div><div class="cv3s-ss-lbl">XP Gain</div></div>
        <div class="cv3s-ss-box"><div class="cv3s-ss-val" id="cv3-khr">${_killsHr>0?this.fmt(_killsHr):'—'}</div><div class="cv3s-ss-lbl">Kills/hr</div></div>
        <div class="cv3s-ss-box"><div class="cv3s-ss-val" id="cv3-dmgdealt">${this.fmt(_sd2.total||0)}</div><div class="cv3s-ss-lbl">Dmg Dealt</div></div>
        <div class="cv3s-ss-box"><div class="cv3s-ss-val" id="cv3-dmgtaken">${this.fmt(_sd2.taken||0)}</div><div class="cv3s-ss-lbl">Dmg Taken</div></div>
      </div>
      <div class="cv3s-xr-rows" id="xp-rate-grid">${_xpRateRows}</div>
    </div>`;

    // Area card
    if (_curArea) {
      html += `<div class="cv3s-area-card">
        <div class="cv3s-area-name">${_curArea.name}</div>
        <div class="cv3s-area-level">Level ${_curArea.levelReq}+${_curArea.wilderness?' · ⚠ Wilderness':''}</div>
        <div class="cv3s-area-desc">${_curArea.desc||''}</div>
        <button class="btn btn-sm cv3s-area-btn" onclick="game.stopCombat();ui.renderPage('combat')">Change Area</button>
      </div>`;
    }

    html += `</div></div>`;
    el.innerHTML = html;

    } catch(err) {
      console.error('[Combat] Render error:', err.message, err.stack);
      el.innerHTML = `<div class="bank-empty">Combat render error: ${err.message}.<br><button class="btn" onclick="game.stopCombat();ui.renderPage('combat')">Reset</button></div>`;
    }
  }


    renderDungeonsPage(el) {
    const s = this.engine.state;
    const cb = this.engine.getCombatLevel();
    // Separate dungeons into categories
    const raids = (GAME_DATA.dungeons||[]).filter(d=>d.isRaid);
    const colosseums = (GAME_DATA.dungeons||[]).filter(d=>d.isWave&&!d.isRaid);
    const trials = (GAME_DATA.dungeons||[]).filter(d=>d.noSupplies);
    const regular = (GAME_DATA.dungeons||[]).filter(d=>!d.isRaid&&!d.isWave&&!d.noSupplies);

    let html = this.header('Dungeons & Raids','dungeon','Multi-wave challenges, raids, and arenas with unique rewards.', null);

    const _renderDungeons = (list, label, icon) => {
      if (!list.length) return '';
      let h = `<h2 class="section-title">${icon} ${label}</h2><div class="actions-grid">`;
      for (const d of list) {
        const locked = cb < (d.levelReq||1);
        const waveCount = d.waves?.length || d.maxWaves || '?';
        const typeLabel = d.isRaid?'Raid':d.isWave?'Survival':d.noSupplies?'Trial':'Dungeon';
        const typeBadge = `<span style="background:${d.isRaid?'rgba(201,135,62,0.2)':d.noSupplies?'rgba(196,64,64,0.2)':'rgba(74,126,196,0.2)'}; padding:1px 6px; border-radius:4px; font-size:10px; color:${d.isRaid?'#c9873e':d.noSupplies?'#c44040':'#4a7ec4'}">${typeLabel}</span>`;
        const partyInfo = d.partySize?` · ${d.partySize.min}-${d.partySize.max} players`:'';
        const rewardsItems = (d.rewards?.items||[]).slice(0,3).map(r=>GAME_DATA.items[r.item]?.name||r.item).join(', ');
        const rewardGold = d.rewards?.gold?`${this.fmt(d.rewards.gold.max)} gold`:'';
        h += `<div class="action-card ${locked?'locked':''}">
          <div class="ac-header">
            <span class="ac-name">${d.name}</span>
            <span class="ac-level">Cb Lv ${d.levelReq}+</span>
          </div>
          ${typeBadge}
          <p class="area-desc" style="margin:6px 0">${d.desc}</p>
          <div class="ac-footer">
            <span>${waveCount} waves${partyInfo}</span>
            ${d.hardMode?'<span style="color:#c44040">HARD MODE</span>':''}
            ${d.noSupplies?'<span style="color:#c9873e">No supplies</span>':''}
          </div>
          ${rewardsItems?`<div style="font-size:11px;color:var(--text-dim);margin:4px 0">Loot: ${rewardsItems}${rewardGold?', '+rewardGold:''}</div>`:''}
          <button class="btn btn-sm" ${locked?'disabled':''} onclick="game.startDungeon('${d.id}')">
            ${d.isRaid?'Enter Raid':d.isWave?'Enter Arena':'Start Dungeon'}
          </button>
          ${locked?`<div class="locked-overlay">Combat Lv ${d.levelReq}</div>`:''}
        </div>`;
      }
      h += '</div>';
      return h;
    };

    html += _renderDungeons(regular, 'Dungeons', '⚔');
    html += _renderDungeons(colosseums, 'Arenas & Colosseums', '🏟');
    html += _renderDungeons(trials, 'Trials', '🎯');
    html += _renderDungeons(raids, 'Raids', '⚡');

    el.innerHTML = html;
  }

  renderLoginRewardsPage(el) {
    const s = this.engine.state;
    const streak = s.loginStreak || {count:0, lastClaim:0};
    const rewards = GAME_DATA.loginRewards || [];
    const dayMs = 86400000;
    const timeSinceLast = Date.now() - (streak.lastClaim||0);
    const canClaim = timeSinceLast >= dayMs;
    const timeLeft = canClaim ? 0 : Math.ceil((dayMs - timeSinceLast)/3600000);
    let html = this.header('Daily Login','sparkle','Log in every day for escalating rewards. 7-day and 30-day rewards are legendary.',null);
    html += `<div class="lr-header">
      <div class="lr-streak"><div class="lr-streak-num">${streak.count||0}</div><div class="lr-streak-lbl">Day Streak</div></div>
      <div class="lr-claim">
        ${canClaim
          ? `<button class="btn btn-primary lr-claim-btn" onclick="game.claimLoginReward();ui.renderPage('login_rewards')">🎁 Claim Day ${(streak.count||0)+1} Reward</button>`
          : `<div class="lr-timer">Next reward in ${timeLeft} hours</div>`}
      </div>
    </div>`;
    html += '<div class="lr-grid">';
    for (const r of rewards) {
      const done = (streak.count||0) >= r.day;
      const isCurrent = r.day === Math.min(...rewards.map(x=>x.day).filter(d=>d>(streak.count||0)));
      html += `<div class="lr-card ${done?'lr-done':''} ${isCurrent?'lr-current':''}">
        <div class="lr-day-label">${r.label}</div>
        ${r.gold?`<div class="lr-gold">💰 ${this.fmt(r.gold)} gold</div>`:''}
        ${(r.items||[]).map(it=>{const item=GAME_DATA.items[it.item];return `<div class="lr-item">${item?.name||it.item} ×${it.qty}</div>`;}).join('')}
        ${r.xpBonus?`<div class="lr-xp-bonus">+${r.xpBonus.pct}% XP (${Math.round(r.xpBonus.dur/60)}min)</div>`:''}
        ${done?'<div class="lr-check">✓</div>':''}
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  renderDiaryPage(el) {
    const s = this.engine.state;
    const dp = s.diaryProgress || {};
    let html = this.header('Achievement Diary','target','Complete tasks to earn exclusive rewards. Diary tiers: Easy → Medium → Hard → Elite.',null);
    for (const [id, diary] of Object.entries(GAME_DATA.achievementDiaries||{})) {
      html += `<div class="diary-region"><div class="diary-region-name">${diary.name}</div><div class="diary-tiers">`;
      for (const [tier, data] of Object.entries(diary.tiers||{})) {
        const complete = dp[id+'_'+tier+'_complete'];
        const done = (data.tasks||[]).filter(t=>dp[t.id]).length;
        const total = (data.tasks||[]).length;
        html += `<div class="diary-tier ${complete?'diary-tier-done':''}">
          <div class="diary-tier-header">
            <span class="diary-tier-name">${data.name}</span>
            <span class="diary-tier-progress">${done}/${total}</span>
            ${complete?'<span class="diary-complete-badge">✓ Complete</span>':''}
          </div>
          <div class="diary-tasks">`;
        for (const task of (data.tasks||[])) {
          const done2 = !!dp[task.id];
          html += `<div class="diary-task ${done2?'diary-task-done':''}"><span class="diary-check">${done2?'✓':'○'}</span>${task.desc}</div>`;
        }
        html += `</div>
          ${!complete&&data.reward?`<div class="diary-reward">Reward: ${GAME_DATA.items[data.reward.item]?.name||data.reward.item}</div>`:''}
        </div>`;
      }
      html += '</div></div>';
    }
    el.innerHTML = html;
  }

  renderWorldEventsPage(el) {
    const s = this.engine.state;
    const we = s.worldEvents || {};
    const active = we.active;
    const events = GAME_DATA.worldEvents || [];
    let html = this.header('World Events','globe','Random bonus events fire throughout the day. Check back often.',null);
    if (active) {
      const msLeft = Math.max(0, (we.activeUntil||0) - Date.now());
      const minLeft = Math.ceil(msLeft/60000);
      html += `<div class="we-active-banner">
        <div class="we-active-label">ACTIVE EVENT</div>
        <div class="we-active-name">${active.name}</div>
        <div class="we-active-desc">${active.desc}</div>
        <div class="we-active-time">${minLeft} minutes remaining</div>
      </div>`;
    } else {
      html += '<div class="we-none">No active world event. Check back in a few minutes!</div>';
    }
    html += '<h2 class="section-title">All World Events</h2><div class="we-grid">';
    for (const ev of events) {
      const rarColor = ev.rarity==='rare'?'#c9873e':ev.rarity==='uncommon'?'#9b59b6':'#4a8a3e';
      html += `<div class="we-card ${active?.id===ev.id?'we-card-active':''}">
        <div class="we-card-header">
          <span class="we-card-name">${ev.name}</span>
          <span class="we-card-rarity" style="color:${rarColor}">${ev.rarity}</span>
        </div>
        <p class="we-card-desc">${ev.desc}</p>
        <div class="we-card-dur">${Math.round(ev.duration/60)} minutes</div>
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  renderUnholyPrayersPage(el) {
    const s = this.engine.state;
    const unlocked = (s.quests.completed||[]).includes('unholy_path');
    const unholyPrayers = (GAME_DATA.prayers||[]).filter(p=>p.book==='unholy');
    let html = this.header('Unholy Prayers','skull','Dark prayers for aggressive builds. High risk, devastating power. Requires completing The Unholy Path quest.',null);
    if (!unlocked) {
      html += '<div class="bank-empty"><p>🔒 Complete quest "The Unholy Path" to unlock the Unholy Prayer Book.</p></div>';
    } else {
      const pp = s.prayerPoints||0;
      const maxPP = (s.skills.prayer?.level||1)*10;
      html += `<div class="prayer-dash">
        <div class="prayer-kpi"><div class="prayer-kpi-val" style="color:#8a2ae0">${pp}</div><div class="prayer-kpi-lbl">Prayer Pts</div></div>
        <div class="prayer-kpi"><div class="prayer-kpi-val">${(s.activePrayers||[]).filter(id=>unholyPrayers.find(p=>p.id===id)).length}/2</div><div class="prayer-kpi-lbl">Unholy Active</div></div>
      </div>`;
      const tiers = ['T1','T2','T3','T4'];
      for (const tier of tiers) {
        const tierPrayers = unholyPrayers.filter(p=>p.tier===tier);
        if (!tierPrayers.length) continue;
        html += `<h2 class="section-title" style="color:#8a2ae0">${tier === 'T4' ? '⚡ Forbidden' : tier} — ${tier==='T1'?'Novice':tier==='T2'?'Adept':tier==='T3'?'Expert':'Forbidden'}</h2>`;
        html += '<div class="prayer-grid">';
        for (const p of tierPrayers) {
          const locked = (s.skills.prayer?.level||1) < p.level;
          const active2 = (s.activePrayers||[]).includes(p.id);
          html += `<div class="prayer-card ${locked?'prayer-locked':''} ${active2?'prayer-active-card':''}" style="${active2?'border-color:#8a2ae0;background:rgba(138,42,224,0.1);':''}">
            <div class="prayer-card-header">
              <span class="prayer-card-icon" style="font-size:22px">${p.icon||'☠'}</span>
              <span class="prayer-card-name">${p.name}</span>
              <span class="prayer-card-level">Lv ${p.level}</span>
            </div>
            <p class="prayer-card-desc" style="color:#b060ff">${p.desc}</p>
            <div class="prayer-card-cost" style="color:#6a1ab0">-${p.pointCost} pp/atk</div>
            ${p.penalty?`<div style="color:#c44040;font-size:11px;margin:4px 0">⚠ ${JSON.stringify(p.penalty).replace(/[{}"]/g,' ').trim()}</div>`:''}
            ${!locked
              ? `<button class="btn btn-xs" style="border-color:#8a2ae0;color:${active2?'#c44040':'#8a2ae0'}" onclick="game.activatePrayer('${p.id}');ui.renderPage('unholy_prayers')">
                  ${active2?'Deactivate':'Activate'}
                </button>`
              : `<div class="prayer-locked-text">Requires Prayer ${p.level}</div>`}
          </div>`;
        }
        html += '</div>';
      }
    }
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
    // Style filter
    const _abStyle = ui._abFilter || 'all';
    html += `<div style="display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap">
      <span style="font-size:12px;color:var(--text-dim);align-self:center">Filter:</span>
      ${['all','melee','ranged','magic','any'].map(st=>`<button class="btn btn-xs ${_abStyle===st?'cc-btn-active':''}" onclick="ui._abFilter='${st}';ui.renderPage('abilities')">${st.charAt(0).toUpperCase()+st.slice(1)}</button>`).join('')}
    </div>`;
    const _visAbs = _abStyle==='all' ? GAME_DATA.abilities : GAME_DATA.abilities.filter(a=>a.style===_abStyle||a.style==='any');
    html += '<h2 class="section-title">Available Abilities</h2><div class="actions-grid">';
    for (const ab of _visAbs) {
      const locked = (s.skills.tactics?.level||1) < (ab.tacticsReq||1);
      const equippedSlot = s.equippedAbilities.indexOf(ab.id);
      html += `<div class="action-card ${locked?'locked':''}">
        <div class="ac-header"><span class="ac-name">${ab.name}</span><span class="ac-level">Tac Lv ${ab.tacticsReq}</span></div>
        <p class="area-desc">${ab.desc}</p>
        <div class="ac-footer">
          <span>CD: ${ab.cooldown}s</span>
          ${ab.manaCost?`<span style="color:#4a7ec4">${ab.manaCost}mp</span>`:''}
          <span>Style: ${ab.style||'any'}</span>
        </div>
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

    // ── UNHOLY PRAYERS ─────────────────────────────────────────────
    const unholyPrayers = GAME_DATA.prayers.filter(p=>p.book==='unholy');
    if (unholyPrayers.length) {
      const hasUnlocked = (s.quests.completed||[]).includes('unholy_path');
      html += `<h2 class="section-title" style="color:#8a2ae0">Unholy Prayers ${!hasUnlocked?'<span style="font-size:11px;color:var(--text-dim)">(Complete "The Unholy Path" quest to unlock)</span>':''}</h2>`;
      html += '<div class="prayer-grid">';
      for (const p of unholyPrayers) {
        const locked = (s.skills.prayer?.level||1) < p.level || !hasUnlocked;
        const active = (s.activePrayers||[]).includes(p.id);
        html += `<div class="prayer-card ${locked?'prayer-locked':''} ${active?'prayer-active-card':''}">
          <div class="prayer-card-header">
            <span class="prayer-card-icon" style="font-size:20px">${p.icon||'☠'}</span>
            <span class="prayer-card-name">${p.name}</span>
            <span class="prayer-card-level">Lv ${p.level}</span>
          </div>
          <p class="prayer-card-desc" style="color:#b060ff">${p.desc}</p>
          <div class="prayer-card-cost" style="color:#8a2ae0">-${p.pointCost} pp/atk · ${p.tier||'T1'}</div>
          ${!locked?`<button class="btn btn-xs ${active?'btn-danger':''}" style="border-color:#8a2ae0;color:#8a2ae0" onclick="game.activatePrayer('${p.id}');ui.renderPage('prayer')">
            ${active?'Deactivate':'Activate'}
          </button>`:`<div class="prayer-locked-text">Level ${p.level} Prayer required</div>`}
        </div>`;
      }
      html += '</div>';
    }

    el.innerHTML = html;
  }

  renderFarmingPage(el) {
    const s = this.engine.state;
    game._ensureFarmingState && game._ensureFarmingState();
    const plots = s.farming?.plots || [];
    const farmLv = s.skills.farming?.level || 1;
    const farmXp = s.skills.farming?.xp || 0;
    const farmProg = this.engine.getXpProgress?.('farming') || 0;

    let html = this.header('Farming','seedling','Plant seeds and herbs, water and compost your crops, and harvest yields for cooking, herblore, and gold.','farming');

    // ── SKILL BAR ─────────────────────────────────────────────
    const xpToNext = this.engine.getXpToNextLevel?.('farming') || 0;
    html += `<div class="farm-skill-header">
      <div class="fsh-left">
        <div class="fsh-level">${farmLv}</div>
        <div class="fsh-label">Farm<br>Level</div>
      </div>
      <div class="fsh-center">
        <div class="fsh-xp-bar"><div class="fsh-xp-fill" style="width:${(farmProg*100).toFixed(1)}%"></div></div>
        <div class="fsh-xp-text">${this.fmt(farmXp)} XP · ${xpToNext>0?this.fmt(xpToNext)+' to next level':'MAX'}</div>
      </div>
      <div class="fsh-stats">
        <div class="fsh-stat"><span class="fsh-stat-val" style="color:#4abe6c">${plots.filter(p=>p.ready).length}</span><span class="fsh-stat-lbl">Ready</span></div>
        <div class="fsh-stat"><span class="fsh-stat-val" style="color:#4a7ec4">${plots.filter(p=>p.seed&&!p.ready&&!p.dead).length}</span><span class="fsh-stat-lbl">Growing</span></div>
        <div class="fsh-stat"><span class="fsh-stat-val" style="color:#c44040">${plots.filter(p=>p.dead).length}</span><span class="fsh-stat-lbl">Dead</span></div>
        <div class="fsh-stat"><span class="fsh-stat-val">${plots.filter(p=>!p.seed&&!p.dead).length}</span><span class="fsh-stat-lbl">Empty</span></div>
      </div>
    </div>`;

    // ── TOOLS & COMPOST STRIP ─────────────────────────────────
    const has = id => (s.bank[id]||0) > 0;
    const qty = id => s.bank[id]||0;
    const bestCan = has('watering_can_mith')?'🪣 Mith Can':has('watering_can_iron')?'🪣 Iron Can':has('watering_can')?'🪣 Can':'—';
    const bestCompost = has('ultracompost')?`🟣 Ultra x${qty('ultracompost')}`:has('supercompost')?`🟢 Super x${qty('supercompost')}`:has('compost_bin')?`🟤 Compost x${qty('compost_bin')}`:'None';
    html += `<div class="farm-tools-row">
      <div class="farm-tool-chip ${has('watering_can')||has('watering_can_iron')||has('watering_can_mith')?'tool-have':'tool-miss'}">${bestCan}</div>
      <div class="farm-tool-chip ${has('spade')?'tool-have':'tool-miss'}">${has('spade')?'⛏ Spade':'⛏ No Spade'}</div>
      <div class="farm-tool-chip ${has('rake')?'tool-have':'tool-miss'}">${has('rake')?'🌾 Rake':'🌾 No Rake'}</div>
      <div class="farm-tool-chip ${has('ultracompost')||has('supercompost')||has('compost_bin')?'tool-have':'tool-miss'}">🌱 ${bestCompost}</div>
      ${has('secateurs_magic')?'<div class="farm-tool-chip tool-have">✂ Magic Secateurs</div>':''}
      <button class="btn btn-xs" onclick="ui.renderPage('shop')">Buy Seeds & Tools →</button>
    </div>`;

    // ── QUICK ACTIONS ─────────────────────────────────────────
    const readyPlots = plots.map((p,i)=>({...p,i})).filter(p=>p.ready);
    const emptyPlots = plots.map((p,i)=>({...p,i})).filter(p=>!p.seed&&!p.dead);
    if (readyPlots.length > 0) {
      html += `<div class="farm-quick-bar farm-ready-bar">
        <span>🌾 ${readyPlots.length} crop${readyPlots.length>1?'s':''} ready to harvest!</span>
        <button class="btn btn-sm" onclick="${readyPlots.map(p=>`game.harvestPlot(${p.i})`).join(';')};ui.renderPage('farming')">Harvest All</button>
      </div>`;
    }

    // ── PATCH SECTIONS ────────────────────────────────────────
    const patchTypes = [
      {type:'allotment', label:'Allotment Patches', icon:'🌽', desc:'Vegetables and fruits. Provide food and cooking ingredients.'},
      {type:'herb',      label:'Herb Patches',      icon:'🌿', desc:'Magical herbs for Herblore. High XP, valuable yields.'},
      {type:'tree',      label:'Tree Patch',         icon:'🌳', desc:'Slow-growing trees. Massive XP when chopped.'},
      {type:'special',   label:'Special Patch',      icon:'✨', desc:'Rare and exotic crops. Unique rewards.'},
    ];

    for (const patch of patchTypes) {
      const patchPlots = plots.map((p,i)=>({...p,idx:i})).filter(p=>(p.type||'allotment')===patch.type);
      if (!patchPlots.length) continue;
      const allSeeds = Object.values(GAME_DATA.items).filter(it => it.type==='seed' && (it.seedType===patch.type||(patch.type==='allotment'&&!it.seedType))).sort((a,b)=>(a.levelReq||0)-(b.levelReq||0));
      const inBank = allSeeds.filter(sd=>(s.bank[sd.id]||0)>0 && farmLv>=(sd.levelReq||1));

      html += `<div class="farm-section">
        <div class="farm-section-header">
          <span class="farm-section-icon">${patch.icon}</span>
          <div>
            <div class="farm-section-title">${patch.label}</div>
            <div class="farm-section-desc">${patch.desc}</div>
          </div>
        </div>
        <div class="farm-patch-grid">`;

      for (const plot of patchPlots) {
        const i = plot.idx;
        const seed = plot.seed ? GAME_DATA.items[plot.seed] : null;
        const compostTierLabel = ['','🟤','🟢','🟣'][plot.compostTier||0];
        const compostBonusText = plot.compostBonus > 0 ? `+${Math.round(plot.compostBonus*100)}% yield` : '';
        const canApplyCompost = !plot.seed && !plot.dead && !plot.compostTier && (has('ultracompost')||has('supercompost')||has('compost_bin'));

        // Plant buttons: show available seeds inline
        const plantBtns = inBank.length > 0
          ? inBank.slice(0,4).map(sd => {
              const yName = GAME_DATA.items[sd.yield]?.name || sd.yield;
              const tStr = this.fmtTime ? this.fmtTime(sd.growTime) : Math.round(sd.growTime/60)+'m';
              return `<button class="btn btn-xs farm-seed-btn" onclick="game.plantSeed(${i},'${sd.id}');ui.renderPage('farming')" title="Grows in ${tStr} → ${yName}">
                <span class="fsb-name">${sd.name.replace(' Seed','').replace(' Sapling','')}</span>
                <span class="fsb-qty">x${s.bank[sd.id]}</span>
                <span class="fsb-time">${tStr}</span>
              </button>`;
            }).join('')
          : `<div class="fp-no-seeds">No seeds. <button class="btn btn-xs" onclick="ui.renderPage('shop')">Shop →</button></div>`;

        let cardClass = 'farm-plot-card';
        let cardBody = '';

        if (plot.dead) {
          cardClass += ' fpc-dead';
          cardBody = `
            <div class="fp-crop-art fp-art-dead">💀</div>
            <div class="fp-crop-name" style="color:#c44040">☠ ${seed?.name?.replace(' Seed','') || 'Dead crop'}</div>
            <div class="fp-crop-note">Disease killed this crop.</div>
            <button class="btn btn-sm btn-danger" onclick="game.clearPlot(${i});ui.renderPage('farming')">⛏ Clear with Spade</button>`;
        } else if (plot.ready) {
          const yieldItem = GAME_DATA.items[seed?.yield];
          const estYield = seed?.baseYield || 3;
          cardClass += ' fpc-ready';
          cardBody = `
            <div class="fp-crop-art fp-art-ready">🌟</div>
            <div class="fp-crop-name">${seed?.name?.replace(' Seed','') || 'Crop'}</div>
            <div class="fp-ready-label">Ready to harvest!</div>
            <div class="fp-yield-hint">~${estYield}+ ${yieldItem?.name||seed?.yield||'items'} · ${seed?.xp||10} XP each</div>
            ${compostTierLabel?`<div class="fp-badge fp-compost">${compostTierLabel} ${compostBonusText}</div>`:''}
            <button class="btn btn-sm farm-harvest-btn" onclick="game.harvestPlot(${i});ui.renderPage('farming')">🌾 Harvest</button>`;
        } else if (plot.seed) {
          const elapsed = Date.now() - (plot.plantedAt||Date.now());
          const pct = Math.min(100, (elapsed / plot.growTime) * 100);
          const left = Math.max(0, Math.ceil((plot.growTime - elapsed)/1000));
          const timeStr = this.fmtTime ? this.fmtTime(left) : (Math.floor(left/60)+'m '+left%60+'s');
          const growStage = pct < 33 ? '🌱' : pct < 66 ? '🪴' : '🌿';
          cardClass += ' fpc-growing';
          cardBody = `
            <div class="fp-crop-art">${growStage}</div>
            <div class="fp-crop-name">${seed?.name?.replace(' Seed','') || 'Growing'}</div>
            <div class="fp-grow-bar-wrap">
              <div class="fp-grow-bar-track"><div class="fp-grow-bar-fill" id="fpb-${i}" style="width:${pct.toFixed(1)}%;"></div></div>
              <span class="fp-timer" id="fpt-${i}">${timeStr}</span>
            </div>
            <div class="fp-badges-row">
              ${plot.watered?`<span class="fp-badge fp-watered">💧 +${Math.round((plot.waterBonus||0)*100)}%</span>`:''}
              ${compostTierLabel?`<span class="fp-badge fp-compost">${compostTierLabel} ${compostBonusText}</span>`:''}
              ${plot.hasWeeds?`<span class="fp-badge fp-weeds">🌿 Weeds!</span>`:''}
            </div>
            <div class="fp-actions-row">
              ${!plot.watered?`<button class="btn btn-xs" onclick="game.waterPlot(${i});ui.renderPage('farming')">💧 Water</button>`:''}
              ${plot.hasWeeds?`<button class="btn btn-xs" onclick="game.removeWeeds(${i});ui.renderPage('farming')">🌾 Rake</button>`:''}
              <button class="btn btn-xs btn-danger" onclick="game.clearPlot(${i});ui.renderPage('farming')">✕</button>
            </div>`;
        } else {
          // Empty plot
          cardClass += ' fpc-empty';
          cardBody = `
            <div class="fp-crop-art fp-art-empty">🪣</div>
            <div class="fp-crop-name">Empty Plot</div>
            ${compostTierLabel?`<div class="fp-badge fp-compost">${compostTierLabel} ${compostBonusText}</div>`:''}
            ${canApplyCompost?`<button class="btn btn-xs fp-compost-btn" onclick="game.compostPlot(${i});ui.renderPage('farming')" title="Apply best compost from bank">🌱 Compost</button>`:''}
            <div class="fp-seed-picker">${plantBtns}</div>`;
        }

        html += `<div class="${cardClass}">
          <div class="fp-card-header">
            <span class="fp-plot-label">Plot ${i+1}</span>
            ${plot.compostTier&&plot.seed?`<span class="fp-badge fp-compost" style="font-size:10px">${compostTierLabel}</span>`:''}
          </div>
          ${cardBody}
        </div>`;
      }
      html += '</div></div>';
    }

    // ── ALL SEEDS REFERENCE ───────────────────────────────────
    html += `<h2 class="section-title">Seed Reference</h2>`;
    const allSeedTypes = [
      {label:'Allotment',type:null,color:'#4abe6c'},
      {label:'Herbs',type:'herb',color:'#8acc6a'},
      {label:'Trees',type:'tree',color:'#6a9a4a'},
      {label:'Special',type:'special',color:'#c9873e'},
    ];
    for (const st of allSeedTypes) {
      const seeds = Object.values(GAME_DATA.items)
        .filter(it => it.type==='seed' && (st.type ? it.seedType===st.type : !it.seedType||it.seedType==='allotment'))
        .sort((a,b)=>(a.levelReq||0)-(b.levelReq||0));
      if (!seeds.length) continue;
      html += `<div class="farm-seed-table">
        <div class="fst-header" style="color:${st.color}">${st.label} Seeds</div>
        <div class="fst-grid">`;
      for (const seed of seeds) {
        const owned = s.bank[seed.id]||0;
        const locked = farmLv < (seed.levelReq||1);
        const yieldName = GAME_DATA.items[seed.yield]?.name || seed.yield;
        const tStr = this.fmtTime ? this.fmtTime(seed.growTime) : Math.round(seed.growTime/60)+'m';
        html += `<div class="fst-row ${locked?'fst-locked':''} ${owned>0?'fst-owned':''}">
          <span class="fst-name">${seed.name.replace(' Seed','')}</span>
          <span class="fst-level" style="color:${st.color}">Lv ${seed.levelReq||1}</span>
          <span class="fst-yield">→ ${yieldName}</span>
          <span class="fst-time">${tStr}</span>
          <span class="fst-xp">${seed.xp||10} XP</span>
          <span class="fst-owned ${owned>0?'':'fst-none'}">${owned>0?'x'+owned:'—'}</span>
        </div>`;
      }
      html += '</div></div>';
    }

    el.innerHTML = html;

    // ── LIVE GROW TIMER tick ──────────────────────────────────
    clearInterval(window._farmTimerInterval);
    window._farmTimerInterval = setInterval(() => {
      plots.forEach((plot, i) => {
        if (!plot.seed || plot.ready || plot.dead) return;
        const elapsed = Date.now() - (plot.plantedAt||Date.now());
        const pct = Math.min(100, (elapsed / plot.growTime) * 100);
        const left = Math.max(0, Math.ceil((plot.growTime - elapsed)/1000));
        const barEl = document.getElementById('fpb-'+i);
        const timerEl = document.getElementById('fpt-'+i);
        if (barEl) barEl.style.width = pct.toFixed(1)+'%';
        if (timerEl) {
          const m = Math.floor(left/60), sc = left%60;
          timerEl.textContent = m>0 ? m+'m '+sc+'s' : sc+'s';
        }
        if (pct >= 100 && !plot.ready) ui.renderPage('farming');
      });
    }, 1000);
  }


  renderBankPage(el) {
    const s = this.engine.state;
    const entries = Object.entries(s.bank).filter(([,q])=>q>0).sort((a,b)=>a[0].localeCompare(b[0]));
    let html = this.header('Bank','bank',`${entries.length} unique items stored.`,null);
    html += `<div class="bank-gold" id="bank-gold">${icon('coin',20)} <span id="bank-gold-val">${this.fmt(s.gold)}</span> Gold</div>`;

    // Search bar
    const searchVal = this._bankSearch || '';
    html += `<div class="bank-search-bar">
      <input type="text" class="bank-search-input" id="bank-search" placeholder="Search items..." value="${this.escHtml(searchVal)}" oninput="ui.setBankSearch(this.value)">
      ${searchVal ? `<button class="btn btn-xs bank-search-clear" onclick="ui.setBankSearch('')">✕</button>` : ''}
    </div>`;

    // Item categorization function
    const _catItem = (id) => {
      const item = GAME_DATA.items[id]; if (!item) return 'misc';
      if (item.subtype === 'rune' || item.type === 'rune') return 'runes';
      if (item.type === 'weapon' || item.type === 'armor' || item.type === 'ammo' || item.type === 'arrow' || item.type === 'tool' || item.type === 'pickaxe' || item.type === 'hatchet' || item.type === 'fishing_rod') return 'equipment';
      if (item.type === 'food') return 'food';
      if (item.type === 'potion' || item.type === 'consumable') return 'potions';
      if (item.type === 'resource' || item.type === 'ore' || item.type === 'bar' || item.type === 'log' || item.type === 'gem' || item.type === 'herb' || item.type === 'fish') return 'resources';
      if (item.type === 'seed') return 'seeds';
      if (item.type === 'summoning' || item.type === 'pouch') return 'summoning';
      return 'misc';
    };

    // Count items per tab
    const tabCounts = {};
    for (const [id] of entries) { const cat = _catItem(id); tabCounts[cat] = (tabCounts[cat]||0) + 1; }

    // Bank tabs with counts
    const tab = this._bankTab || 'all';
    const tabs = [
      {id:'all',       label:'All',       count:entries.length},
      {id:'equipment', label:'Equipment', count:tabCounts.equipment||0},
      {id:'resources', label:'Resources', count:tabCounts.resources||0},
      {id:'food',      label:'Food',      count:tabCounts.food||0},
      {id:'potions',   label:'Potions',   count:tabCounts.potions||0},
      {id:'runes',     label:'Runes',     count:tabCounts.runes||0},
      {id:'seeds',     label:'Seeds',     count:tabCounts.seeds||0},
      {id:'summoning', label:'Summoning', count:tabCounts.summoning||0},
      {id:'misc',      label:'Misc',      count:tabCounts.misc||0},
    ];
    html += '<div class="bank-tabs">';
    for (const t of tabs) {
      if (t.count === 0 && t.id !== 'all') continue;
      html += `<button class="bank-tab ${tab===t.id?'active':''}" onclick="ui.setBankTab('${t.id}')">${t.label} <span class="bank-tab-count">${t.count}</span></button>`;
    }
    html += '</div>';

    // Filter items by tab + search
    const searchLower = searchVal.toLowerCase();
    const filtered = entries.filter(([id]) => {
      const item = GAME_DATA.items[id]; if (!item) return false;
      if (tab !== 'all' && _catItem(id) !== tab) return false;
      if (searchLower) {
        const name = (item.name || id).toLowerCase();
        const desc = (item.desc || '').toLowerCase();
        if (!name.includes(searchLower) && !desc.includes(searchLower) && !id.includes(searchLower)) return false;
      }
      return true;
    });

    html += '<div class="bank-grid">';
    for (const [id, q] of filtered) {
      const item = GAME_DATA.items[id]; if (!item) continue;
      let statStr = '';
      if (item.stats) {
        const parts = [];
        for (const [k,v] of Object.entries(item.stats)) {
          if (v) parts.push(`+${v} ${k.replace('Bonus','').replace(/([A-Z])/g,' $1').trim()}`);
        }
        statStr = parts.join(', ');
      }
      if (item.heals) statStr += (statStr?', ':'') + `Heals ${item.heals}`;
      if (item.prayerRestore) statStr += (statStr?', ':'') + `+${item.prayerRestore} prayer`;
      if (item.rangedBonus && item.type === 'ammo') statStr += (statStr?', ':'') + `+${item.rangedBonus} ranged`;
      if (item.providesAllRunes) statStr += (statStr?', ':'') + 'Unlimited All Runes';
      else if (item.providesRune) {
        const runes = Array.isArray(item.providesRune) ? item.providesRune : [item.providesRune];
        statStr += (statStr?', ':'') + 'Free ' + runes.map(r=>GAME_DATA.items[r]?.name||r).join(' & ');
      }
      if (item.levelReq) {
        const reqs = Object.entries(item.levelReq).map(([k,v])=>`${k} ${v}`).join(', ');
        statStr += (statStr?' | ':'') + `Req: ${reqs}`;
      }

      let _tooltipHtml = '';
      try {
        const _stats = item.stats && typeof item.stats === 'object' && !Array.isArray(item.stats) ? item.stats : {};
        const _statRows = Object.entries(_stats).filter(([,v])=>v&&typeof v==='number').map(([k,v])=>`<div class="bi-tooltip-stat"><span>${k.replace('Bonus','').replace(/([A-Z])/g,' $1').trim()}</span><span>+${v}</span></div>`).join('');
        const _lreq = item.levelReq && typeof item.levelReq === 'object' ? Object.entries(item.levelReq).map(([k,v])=>`${k} ${v}`).join(', ') : '';
        _tooltipHtml = `<div class="bi-tooltip">
          <div class="bi-tooltip-name" style="${this.getRarityColor(id)?'color:'+this.getRarityColor(id):''}">${item.name}</div>
          ${_statRows}
          ${item.heals ? `<div class="bi-tooltip-stat"><span>Heals</span><span>+${item.heals} HP</span></div>` : ''}
          ${item.rangedBonus && item.type==='ammo' ? `<div class="bi-tooltip-stat"><span>Ranged Bonus</span><span>+${item.rangedBonus}</span></div>` : ''}
          ${item.prayerRestore ? `<div class="bi-tooltip-stat"><span>Prayer Restore</span><span>+${item.prayerRestore}</span></div>` : ''}
          ${item.attackSpeed ? `<div class="bi-tooltip-stat"><span>Attack Speed</span><span>${item.attackSpeed}s</span></div>` : ''}
          ${item.agilBonus ? `<div class="bi-tooltip-stat"><span>Agility Bonus</span><span>-${item.agilBonus} weight</span></div>` : ''}
          ${_lreq ? `<div class="bi-tooltip-req">Req: ${_lreq}</div>` : ''}
          ${item.providesAllRunes ? `<div class="bi-tooltip-stat"><span>Provides</span><span>All runes ∞</span></div>` : ''}
          <div class="bi-tooltip-desc">${item.desc||''}</div>
          ${item.sellPrice ? `<div class="bi-tooltip-stat" style="margin-top:4px;border-top:1px solid var(--border);padding-top:4px"><span>Sell</span><span>${item.sellPrice}g ea</span></div>` : ''}
        </div>`;
      } catch(_e) { _tooltipHtml = ''; }
      html += `<div class="bank-item" data-rarity="${item.rarity||'common'}">
        ${_tooltipHtml}
        <div class="bi-icon">${window.renderItemSprite ? window.renderItemSprite(id, 32) : ''}</div>
        <div class="bi-name" style="${this.getRarityColor(id)?'color:'+this.getRarityColor(id):''}">${item.name} ${this.getRarityTag(id)}</div>
        ${statStr ? `<div class="bi-stats">${statStr}</div>` : ''}
        <div class="bi-qty" data-bank-qty="${id}">x${this.fmt(q)}</div>
        <div class="bi-actions">
          ${item.slot ? `<button class="btn btn-xs" onclick="game.equipItem('${id}')">Equip</button>` : ''}
          ${item.slot ? `<button class="btn btn-xs" onclick="ui.showItemCompare('${id}')">Compare</button>` : ''}
          ${item.subtype === 'casket' ? `<button class="btn btn-xs" style="background:rgba(201,135,62,0.2);border-color:rgba(201,135,62,0.5);color:var(--amber)" onclick="game.openCasket('${id}');ui.renderPage('bank')">🎁 Open</button>` : ''}
          ${item.type==='food' ? `<button class="btn btn-xs" onclick="game.equipFood('${id}')">Add to Bag</button>` : ''}
          ${item.type==='potion' ? `<button class="btn btn-xs" onclick="ui.showPotionBeltSelect('${id}')">Belt</button>` : ''}
          ${item.subtype==='ore_bag' ? `<button class="btn btn-xs" onclick="game.upgradeOreBag('${id}');ui.renderPage('bank')">Apply</button>` : ''}
          ${item.type==='compost' ? `<button class="btn btn-xs" onclick="game.compostPlot(0);ui.renderPage('bank')">Apply</button>` : ''}
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
    if (filtered.length === 0) {
      html += searchVal
        ? `<div class="bank-empty">No items matching "${this.escHtml(searchVal)}".</div>`
        : `<div class="bank-empty">${tab==='all'?'Your bank is empty. Start gathering!':'No items in this category.'}</div>`;
    }
    html += '</div>';
    el.innerHTML = html;
    // Restore search focus
    if (searchVal) { const inp = document.getElementById('bank-search'); if (inp) { inp.focus(); inp.setSelectionRange(searchVal.length, searchVal.length); } }
  }

  setBankTab(tab) { this._bankTab = tab; this.renderPage('bank'); }
  setBankSearch(val) { this._bankSearch = val; this.renderPage('bank'); }

  showPotionBeltSelect(itemId) {
    const item = GAME_DATA.items[itemId]; if (!item) return;
    const slots = this.engine.state.potionBelt;
    let msg = `Load ${item.name} into which belt slot?\n`;
    for (let i = 0; i < 4; i++) {
      const s = slots[i];
      const existing = s?.id ? GAME_DATA.items[s.id] : null;
      msg += `${i+1}: ${existing ? existing.name + ' x' + s.qty : 'Empty'}\n`;
    }
    const choice = prompt(msg, '1');
    if (choice) {
      const slot = parseInt(choice) - 1;
      if (slot >= 0 && slot < 4) { this.engine.equipPotionBelt(slot, itemId); this.renderPage('bank'); }
    }
  }

  renderShopPage(el) {
    const s = this.engine.state;
    let html = this.header('Shop','shop','Buy supplies and equipment.',null);
    html += `<div class="bank-gold">${icon('coin',20)} <span id="shop-gold">${this.fmt(s.gold)}</span> Gold</div>`;
    const cats = [...new Set(GAME_DATA.shop.map(i=>i.category).filter(Boolean))];
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
      // Ammo slot: show count from bank (bank IS the quiver)
      const isAmmoSlot = slot === 'ammo';
      const ammoQty = isAmmoSlot && id ? (s.bank?.[id] || 0) : null;
      const bowTypeBadge = item?.bowType ? `<span class="bow-type-badge ${item.bowType}">${item.bowType === 'shortbow' ? 'SB' : 'LB'}</span>` : '';
      html += `<div class="equip-slot"><div class="es-label">${slot[0].toUpperCase()+slot.slice(1)}</div><div class="es-item ${item?'':'es-empty'}">
        ${item ? `
          <div class="bi-tooltip">
            <div class="bi-tooltip-name" style="${this.getRarityColor(id)?'color:'+this.getRarityColor(id):''}">${item.name}</div>
            ${(item.stats&&typeof item.stats==='object'&&!Array.isArray(item.stats)) ? Object.entries(item.stats).filter(([,v])=>v&&typeof v==='number').map(([k,v])=>`<div class="bi-tooltip-stat"><span>${k.replace('Bonus','').replace(/([A-Z])/g,' $1').trim()}</span><span>+${v}</span></div>`).join('') : ''}
            ${item.attackSpeed ? `<div class="bi-tooltip-stat"><span>Speed</span><span>${item.attackSpeed}s</span></div>` : ''}
            ${(item.levelReq&&typeof item.levelReq==='object') ? `<div class="bi-tooltip-req">Req: ${Object.entries(item.levelReq).map(([k,v])=>`${k} ${v}`).join(', ')}</div>` : ''}
            <div class="bi-tooltip-desc">${item.desc||''}</div>
          </div>
          <div class="es-icon">${window.renderItemSprite ? window.renderItemSprite(id, 40) : ''}</div>
          <span class="es-name" style="${this.getRarityColor(id)?'color:'+this.getRarityColor(id):''}">
            ${item.name}${bowTypeBadge}${isAmmoSlot ? `<span class="ammo-slot-qty"> x${ammoQty?.toLocaleString()??0}</span>` : ''}
          </span>
          <div class="es-actions">
            ${item.slot ? `<button class="btn btn-xs" onclick="ui.showItemCompare('${id}')">⇌</button>` : ''}
            <button class="btn btn-xs btn-danger" onclick="game.unequipItem('${slot}')">X</button>
          </div>` : '<span class="es-none">Empty</span>'}
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
    let html = this.header('Ashen Bazaar','coin','Trade items with other players. List items for sale or post buy orders.',null);

    if (!isOnline || !online.user || online.user.isAnonymous) {
      html += '<div class="bank-empty">Create an account to access the Bazaar. Go to Online &gt; Account to register.</div>';
      el.innerHTML = html; return;
    }

    // Tabs: Sell / Buy Orders / My Listings
    const bzTab = this._bzTab || 'browse';
    html += `<div class="bazaar-header">
      <span class="bz-gold">${icon('coin',16)} <span data-bank-gold>${this.fmt(game.state.gold)}</span> Gold</span>
      <button class="btn btn-sm" onclick="online.collectBazaarGold().then(()=>ui.renderPage('bazaar'))">Collect Sales</button>
    </div>
    <div class="bz-tabs">
      <button class="bz-tab ${bzTab==='browse'?'bz-tab-active':''}" onclick="ui._bzTab='browse';ui.renderPage('bazaar')">Browse Listings</button>
      <button class="bz-tab ${bzTab==='sell'?'bz-tab-active':''}" onclick="ui._bzTab='sell';ui.renderPage('bazaar')">Sell Item</button>
      <button class="bz-tab ${bzTab==='buy'?'bz-tab-active':''}" onclick="ui._bzTab='buy';ui.renderPage('bazaar')">Buy Orders</button>
      <button class="bz-tab ${bzTab==='mine'?'bz-tab-active':''}" onclick="ui._bzTab='mine';ui.renderPage('bazaar')">My Listings</button>
    </div>`;

    if (bzTab === 'sell') {
      html += `<div class="bazaar-post">
        <h3 class="section-title">List Item for Sale</h3>
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
    }

    if (bzTab === 'buy') {
      html += `<div class="bazaar-post">
        <h3 class="section-title">Post a Buy Order</h3>
        <p style="font-size:11px;color:var(--text-dim);margin:0 0 10px">Tell sellers what you want. They can fulfil your order and you'll receive the items automatically.</p>
        <div class="bp-form">
          <input type="text" id="bz-buy-item" class="chat-input-v2" placeholder="Item ID (e.g. dragon_bones)" style="flex:1">
          <input type="number" id="bz-buy-qty" class="qty-input" min="1" value="100" placeholder="Qty wanted" style="width:70px">
          <input type="number" id="bz-buy-price" class="qty-input" min="1" value="500" placeholder="Pay/ea" style="width:80px">
          <button class="btn" onclick="ui._postBuyOrder()">Post Buy Order</button>
        </div>
        <p style="font-size:10px;color:var(--text-dim);margin:8px 0 0">Gold is locked until order is filled or cancelled. You have <strong>${this.fmt(game.state.gold)}g</strong>.</p>
      </div>`;
      html += '<div id="bazaar-listings"><div class="bank-empty">Loading buy orders...</div></div>';
      el.innerHTML = html;
      this._loadBuyOrders();
      return;
    }

    // Search bar
    html += `<div class="bazaar-search">
      <div style="display:flex;gap:6px;margin-bottom:10px">
        <input type="text" id="bz-search" class="chat-input-v2" placeholder="Search by item name..." style="flex:1">
        <button class="btn btn-sm" onclick="ui.searchBazaar()">Search</button>
        <button class="btn btn-sm" onclick="ui.loadBazaarAll()">All</button>
        ${bzTab==='mine' ? '' : ''}
      </div>
    </div>`;

    html += '<div id="bazaar-listings"><div class="bank-empty">Loading listings...</div></div>';
    el.innerHTML = html;
    if (bzTab === 'mine') this.loadBazaarMine();
    else this.loadBazaarAll();
  }

  async _postBuyOrder() {
    const itemId = document.getElementById('bz-buy-item')?.value?.trim();
    const qty = parseInt(document.getElementById('bz-buy-qty')?.value) || 1;
    const priceEa = parseInt(document.getElementById('bz-buy-price')?.value) || 1;
    if (!itemId) { this.toast({type:'warn',text:'Enter an item ID.'}); return; }
    if (!GAME_DATA.items[itemId]) { this.toast({type:'warn',text:`Unknown item: "${itemId}"`}); return; }
    const totalCost = qty * priceEa;
    if (game.state.gold < totalCost) { this.toast({type:'warn',text:`Need ${this.fmt(totalCost)}g to post this order.`}); return; }
    // Deduct gold immediately (locked in escrow)
    game.state.gold -= totalCost;
    // Immediately update gold display
    const goldEl = document.getElementById('bank-gold-val') || document.getElementById('shop-gold');
    if (goldEl) goldEl.textContent = ui.fmt(game.state.gold);
    if (typeof online !== 'undefined') {
      await online.db?.ref('buy_orders').push({
        buyer: online.user.uid,
        buyerName: online.displayName || 'Unknown',
        item: itemId,
        itemName: GAME_DATA.items[itemId]?.name || itemId,
        qty, priceEa, totalCost,
        filled: 0,
        createdAt: Date.now(),
        status: 'open',
      });
    }
    this.toast({type:'success', text:`Buy order posted: ${qty}x ${GAME_DATA.items[itemId]?.name} @ ${priceEa}g ea`});
    this._bzTab = 'buy';
    this.renderPage('bazaar');
  }

  async _loadBuyOrders() {
    const container = document.getElementById('bazaar-listings');
    if (!container) return;
    container.innerHTML = '<div class="bank-empty">Loading buy orders...</div>';
    try {
      const snap = await online?.db?.ref('buy_orders').orderByChild('status').equalTo('open').limitToLast(50).once('value');
      const orders = [];
      snap?.forEach(child => orders.push({id:child.key, ...child.val()}));
      if (!orders.length) { container.innerHTML = '<div class="bank-empty">No buy orders. Post the first one!</div>'; return; }
      let html = '<div class="buy-orders-list">';
      for (const o of orders.reverse()) {
        const item = GAME_DATA.items[o.item];
        const myUid = online?.user?.uid;
        const isMine = o.buyer === myUid;
        const canFulfil = !isMine && (game.state.bank[o.item]||0) >= 1;
        html += `<div class="buy-order-card">
          <div class="bo-item">${item?.name||o.itemName||o.item}</div>
          <div class="bo-info">Wants <strong>${o.qty - (o.filled||0)}</strong> remaining @ <strong>${this.fmt(o.priceEa)}g</strong> ea</div>
          <div class="bo-buyer">By: ${o.buyerName||'Unknown'}</div>
          ${isMine ? `<button class="btn btn-xs btn-danger" onclick="ui._cancelBuyOrder('${o.id}',${o.totalCost - (o.filled||0)*o.priceEa})">Cancel Order</button>` : ''}
          ${canFulfil ? `<div class="bo-sell-row">
            <input type="number" min="1" max="${Math.min(o.qty-(o.filled||0),game.state.bank[o.item]||0)}" value="1" id="bo-qty-${o.id}" style="width:55px;padding:2px 4px;background:var(--bg-deep);border:1px solid var(--border);color:var(--text);border-radius:3px">
            <button class="btn btn-xs" onclick="ui._fulfilBuyOrder('${o.id}','${o.item}',${o.priceEa})">Sell to Order</button>
          </div>` : ''}
        </div>`;
      }
      html += '</div>';
      container.innerHTML = html;
    } catch(e) {
      container.innerHTML = `<div class="bank-empty">Failed to load buy orders: ${e.message}</div>`;
    }
  }

  async _cancelBuyOrder(orderId, refundAmount) {
    if (!confirm('Cancel this buy order and get your gold back?')) return;
    await online?.db?.ref(`buy_orders/${orderId}`).update({ status:'cancelled' });
    game.state.gold += Math.floor(refundAmount);
    this.toast({type:'success', text:`Order cancelled. ${this.fmt(refundAmount)}g refunded.`});
    this.renderPage('bazaar');
  }

  async _fulfilBuyOrder(orderId, itemId, priceEa) {
    const qtyEl = document.getElementById(`bo-qty-${orderId}`);
    const qty = parseInt(qtyEl?.value) || 1;
    const have = game.state.bank[itemId] || 0;
    if (have < qty) { this.toast({type:'warn',text:'Not enough items.'}); return; }
    // Remove items from seller, give gold
    game.state.bank[itemId] -= qty;
    if (game.state.bank[itemId] <= 0) delete game.state.bank[itemId];
    const earned = qty * priceEa;
    game.state.gold += earned;
    // Update order in Firebase
    await online?.db?.ref(`buy_orders/${orderId}`).transaction(order => {
      if (!order) return order;
      order.filled = (order.filled || 0) + qty;
      if (order.filled >= order.qty) order.status = 'complete';
      return order;
    });
    this.toast({type:'success', text:`Sold ${qty}x ${GAME_DATA.items[itemId]?.name} for ${this.fmt(earned)}g!`});
    this.renderPage('bazaar');
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
    let html = this.header('NPCs','npc','Visit NPCs to accept quests, buy goods, and learn lore.',null);
    const npcs = typeof GAME_DATA.npcs === 'object' && !Array.isArray(GAME_DATA.npcs)
      ? Object.values(GAME_DATA.npcs)
      : (GAME_DATA.npcs || []);
    html += '<div class="actions-grid">';
    for (const npc of npcs) {
      // Quests linked by npcId (new schema), npc (legacy schema), OR questGiver on NPC
      const npcQuests = GAME_DATA.quests.filter(q => q.npcId === npc.id || q.npc === npc.id || (npc.questGiver||[]).includes(q.id));
      const available = npcQuests.filter(q => {
        if (s.quests.completed.includes(q.id)||s.quests.active.includes(q.id)) return false;
        const prereqs = q.prereqs||(q.prereq?[q.prereq]:[]);
        return prereqs.every(p=>s.quests.completed.includes(p));
      });
      const active    = npcQuests.filter(q => s.quests.active.includes(q.id));
      const completed = npcQuests.filter(q => s.quests.completed.includes(q.id));
      const hasNew = available.length > 0;

      html += `<div class="npc-card">
        <div class="npc-header">
          <div class="npc-avatar">${GAME_DATA.npcArt?.[npc.id] || this.icon('npc',32)}</div>
          <div class="npc-info">
            <div class="npc-name">${npc.name}${hasNew?' <span class="npc-quest-badge">!</span>':''}</div>
            <div class="npc-title">${npc.title||npc.role||''}</div>
            <div class="npc-location">${npc.location||''}</div>
          </div>
        </div>
        <p class="npc-desc">${npc.desc||npc.dialogue?.greeting||''}</p>`;

      // Quest list
      if (available.length) {
        html += `<div class="quest-section-label">Available Quests (${available.length})</div>`;
        for (const q of available) {
          const lreqs = q.levelReqs||{};
          const meets = Object.entries(lreqs).every(([sk,lv])=>(s.skills[sk]?.level||1)>=lv);
          html += `<div class="quest-mini ${meets?'':'quest-mini-locked'}">
            <div class="qm-name">${q.name} <span class="qm-qp">+${q.qp||0} QP</span></div>
            <div class="qm-desc">${q.desc}</div>
            <button class="btn btn-xs" onclick="game.acceptQuest('${q.id}')" ${meets?'':'disabled'}>${meets?'Accept':'Level too low'}</button>
          </div>`;
        }
      }
      if (active.length)    html += `<div class="quest-section-label">In Progress: ${active.map(q=>q.name).join(', ')}</div>`;
      if (completed.length) html += `<div class="quest-section-label" style="color:#7dcc44">✓ Completed: ${completed.map(q=>q.name).join(', ')}</div>`;

      // Shop preview
      if (npc.shop?.length) {
        html += `<div class="npc-shop-preview"><div class="quest-section-label">Shop</div>`;
        for (const entry of npc.shop.slice(0,4)) {
          const it = GAME_DATA.items[entry.item];
          if (!it) continue;
          html += `<div class="npc-shop-item"><span>${it.name}</span><span>${this.fmt(entry.price)}g</span></div>`;
        }
        if (npc.shop.length>4) html += `<div class="npc-shop-more">+${npc.shop.length-4} more items...</div>`;
        html += '</div>';
      }
      html += '</div>';
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
    // Calculate QP dynamically from completed quests (never trust saved questPoints value)
    const qp = GAME_DATA.quests.reduce((sum,q) => sum + ((s.quests.completed||[]).includes(q.id) ? (q.qp||0) : 0), 0);
    const totalQP = GAME_DATA.quests.reduce((sum,q)=>sum+(q.qp||0),0);
    const dailies = GAME_DATA.dailyQuests || [];
    const dState = s.dailyQuests || { active:[], completed:[], progress:{} };
    const msLeft = 86400000 - (Date.now() % 86400000);
    const hLeft = Math.floor(msLeft/3600000), mLeft = Math.floor((msLeft%3600000)/60000);
    const completedCount = s.quests.completed.length;
    const totalQuests = GAME_DATA.quests.length;

    let html = this.header('Quest Log','scroll',`${completedCount}/${totalQuests} quests complete`,null);

    // Quest Points banner — prominent
    html += `<div class="qp-banner">
      <div class="qp-crown">👑</div>
      <div class="qp-center">
        <div class="qp-num">${qp} <span class="qp-of">/ ${totalQP}</span></div>
        <div class="qp-label">Quest Points</div>
        <div class="qp-bar-wrap"><div class="qp-bar"><div class="qp-fill" style="width:${Math.min(100,qp/Math.max(1,totalQP)*100).toFixed(1)}%"></div></div></div>
      </div>
      <div class="qp-progress-tag">${completedCount}/${totalQuests} done</div>
    </div>`;

    // Daily quests
    html += `<div class="quest-section">
      <div class="qs-header"><span class="qs-title">Daily Quests</span><span class="qs-timer">⏱ Resets ${hLeft}h ${mLeft}m</span></div>
      <div class="daily-grid">`;
    for (const dq of dailies) {
      const done = (dState.completed||[]).includes(dq.id);
      const prog = (dState.progress||{})[dq.id]||(dq.objectives||[]).map(()=>0);
      const pct = (dq.objectives||[]).reduce((acc,obj,i)=>acc+(prog[i]||0)/Math.max(1,obj.qty),0)/Math.max(1,(dq.objectives||[]).length)*100;
      const rewardStr = [
        dq.rewards.gold ? `${this.fmt(dq.rewards.gold)}g` : '',
        ...Object.entries(dq.rewards.xp||{}).map(([sk,xp])=>`+${this.fmt(xp)} ${GAME_DATA.skills[sk]?.name||sk}`)
      ].filter(Boolean).join(' · ');
      html += `<div class="daily-card ${done?'daily-done':''}">
        <div class="dc-header">
          <span class="dc-name">${done?'✓ ':''} ${dq.name}</span>
          ${done?'<span class="dc-done-badge">Complete</span>':''}
        </div>
        <div class="dc-desc">${dq.desc}</div>
        <div class="dc-prog-bar"><div class="dc-prog-fill" style="width:${done?100:pct.toFixed(0)}%"></div></div>
        <div class="dc-reward">${rewardStr}</div>
      </div>`;
    }
    html += '</div></div>';

    // Active quests
    if (s.quests.active.length > 0) {
      html += `<div class="quest-section"><div class="qs-header"><span class="qs-title">Active (${s.quests.active.length})</span></div>`;
      for (const qId of s.quests.active) {
        const q = GAME_DATA.quests.find(x=>x.id===qId); if (!q) continue;
        const prog = s.quests.progress[qId]||[];
        const allDone = (q.objectives||[]).every((_,i)=>(prog[i]||0)>=(q.objectives[i]?.qty||1));
        html += `<div class="quest-card-full">
          <div class="qcf-header">
            <div>
              <div class="qcf-name">${q.name}</div>
              <div class="qcf-series">${q.series||''}</div>
            </div>
            <div class="qcf-qp-badge">+${q.qp||0} QP</div>
          </div>
          <div class="qcf-desc">${q.desc}</div>
          <div class="qcf-objectives">
            ${(q.objectives||[]).map((obj,i)=>{
              const done=prog[i]||0; const pct=Math.min(100,done/Math.max(1,obj.qty)*100);
              const complete=done>=obj.qty;
              return `<div class="qo-row ${complete?'qo-done':''}" data-qid="${qId}-${i}">
                <span class="qo-check">${complete?'✓':''}</span>
                <div class="qo-label">${obj.desc}</div>
                <span class="qo-count">${this.fmt(Math.min(done,obj.qty))}/${this.fmt(obj.qty)}</span>
                <div class="qo-bar"><div class="qo-fill" style="width:${pct.toFixed(0)}%"></div></div>
              </div>`;
            }).join('')}
          </div>
          <div class="qcf-rewards-block">
            <div class="qcf-rewards-label">Rewards:</div>
            <div class="qcf-rewards-row">
              ${q.rewards.gold ? `<span class="qcf-gold">🪙 ${this.fmt(q.rewards.gold)}g</span>` : ''}
              ${q.rewards.qp  ? `<span class="qcf-qp-reward">👑 +${q.rewards.qp} QP</span>` : ''}
              ${Object.entries(q.rewards.xp||{}).map(([sk,xp])=>`<span class="qcf-xp">+${this.fmt(xp)} ${GAME_DATA.skills[sk]?.name||sk} XP</span>`).join('')}
              ${(q.rewards.items||[]).map(it=>`<span class="qcf-item">📦 ${GAME_DATA.items[it.id||it.item]?.name||it.id||it.item} x${it.qty}</span>`).join('')}
            </div>
            ${q.rewards.unlocks ? `<div class="qcf-unlocks">🔓 ${q.rewards.unlocks}</div>` : ''}
          </div>
          <div style="display:flex;gap:8px;margin-top:8px">
            ${allDone ? `<div class="qcf-ready">All objectives met! Talk to an NPC to complete.</div>` : ''}
            <button class="btn btn-xs btn-danger" onclick="if(confirm('Abandon quest?'))game.abandonQuest('${qId}')">Abandon</button>
          </div>
        </div>`;
      }
      html += '</div>';
    }

    // Available quests (grouped by series)
    const available = GAME_DATA.quests.filter(q => {
      if (s.quests.completed.includes(q.id)||s.quests.active.includes(q.id)) return false;
      const prereqs=q.prereqs||(q.prereq?[q.prereq]:[]);
      return prereqs.every(p=>s.quests.completed.includes(p));
    });
    if (available.length > 0) {
      html += `<div class="quest-section"><div class="qs-header"><span class="qs-title">Available (${available.length})</span></div>`;
      const series = {};
      for (const q of available) { const s2=q.series||'Other'; if(!series[s2])series[s2]=[]; series[s2].push(q); }
      for (const [ser, quests] of Object.entries(series)) {
        html += `<div class="quest-series-group"><div class="qsg-label">${ser}</div>`;
        for (const q of quests) {
          const lreqs = q.levelReqs||{};
          const meetsLevel = Object.entries(lreqs).every(([sk,lv])=>(s.skills[sk]?.level||1)>=lv);
          const lacking = Object.entries(lreqs).filter(([sk,lv])=>(s.skills[sk]?.level||1)<lv).map(([sk,lv])=>`${GAME_DATA.skills[sk]?.name||sk} ${lv}`);
          html += `<div class="quest-available-card ${meetsLevel?'':'qa-locked'}">
            <div class="qa-header">
              <div>
                <div class="qa-name">${q.name}</div>
                <div class="qa-series">${q.series||''}</div>
              </div>
              <span class="qa-qp">+${q.qp||0} QP</span>
            </div>
            <div class="qa-desc">${q.desc}</div>
            ${lacking.length ? `<div class="qa-reqs">⚠ Requires: ${lacking.join(', ')}</div>` : ''}
            <div class="qa-preview-rewards">
              ${q.rewards.gold?`<span>🪙 ${this.fmt(q.rewards.gold)}g</span>`:''}
              ${q.rewards.qp?`<span>👑 +${q.rewards.qp} QP</span>`:''}
              ${q.rewards.unlocks?`<span>🔓 ${q.rewards.unlocks.split('.')[0]}</span>`:''}
            </div>
            <button class="btn btn-xs" onclick="game.acceptQuest('${q.id}')" ${meetsLevel?'':'disabled'}>Accept Quest</button>
          </div>`;
        }
        html += '</div>';
      }
      html += '</div>';
    }

    // Locked quests (prereqs not met — show but locked)
    const locked = GAME_DATA.quests.filter(q => {
      if (s.quests.completed.includes(q.id)||s.quests.active.includes(q.id)) return false;
      if (available.includes(q)) return false;
      const prereqs=q.prereqs||(q.prereq?[q.prereq]:[]);
      return !prereqs.every(p=>s.quests.completed.includes(p));
    });
    if (locked.length > 0) {
      html += `<div class="quest-section"><div class="qs-header"><span class="qs-title">Locked (${locked.length})</span></div><div class="locked-quest-grid">`;
      for (const q of locked) {
        const prereqs=q.prereqs||(q.prereq?[q.prereq]:[]);
        const missing=prereqs.filter(p=>!s.quests.completed.includes(p)).map(p=>GAME_DATA.quests.find(x=>x.id===p)?.name||p);
        html += `<div class="locked-quest-card">
          <div class="lqc-name">🔒 ${q.name}</div>
          <div class="lqc-req">Complete: ${missing.join(', ')}</div>
          <span class="lqc-qp">+${q.qp||0} QP</span>
        </div>`;
      }
      html += '</div></div>';
    }

    // Completed
    if (s.quests.completed.length > 0) {
      html += `<div class="quest-section"><div class="qs-header"><span class="qs-title">Completed (${s.quests.completed.length})</span></div><div class="completed-grid">`;
      for (const qId of s.quests.completed) {
        const q = GAME_DATA.quests.find(x=>x.id===qId); if(!q) continue;
        html += `<div class="completed-quest"><span class="cq-check">✓</span><span class="cq-name">${q.name}</span><span class="cq-qp">+${q.qp||0} QP</span></div>`;
      }
      html += '</div></div>';
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
      ['Alignment', al ? `${al.name} (${al.axis})` : s.alignment||'Unknown'],
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

    // Damage breakdown
    const dmg = s.stats.dmg || {};
    const totalDmgDone = dmg.total || 0;
    html += '<h2 class="section-title">Damage Breakdown</h2><div class="stats-grid">';
    const dmgStats = [
      ['Total Dealt',   this.fmt(totalDmgDone)],
      ['Melee',         this.fmt(dmg.melee || 0)],
      ['Ranged',        this.fmt(dmg.ranged || 0)],
      ['Magic',         this.fmt(dmg.magic || 0)],
      ['Ability',       this.fmt(dmg.ability || 0)],
      ['Total Taken',   this.fmt(dmg.taken || 0)],
      ['Dmg/Kill',      s.stats.monstersKilled > 0 ? Math.round(totalDmgDone / s.stats.monstersKilled) : '—'],
      ['Ratio (D/T)',   dmg.taken > 0 ? (totalDmgDone / dmg.taken).toFixed(2) + 'x' : '—'],
    ];
    const dmgColors = { 'Melee':'#e07a3a', 'Ranged':'#4aaa5a', 'Magic':'#5a8aee', 'Ability':'#c9873e', 'Total Dealt':'#ddd', 'Total Taken':'#cc4444' };
    for (const [l, v] of dmgStats) {
      const col = dmgColors[l] ? `style="color:${dmgColors[l]}"` : '';
      html += `<div class="stat-card"><div class="stat-label">${l}</div><div class="stat-value" ${col}>${v}</div></div>`;
    }
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
    const s = this.engine.state;
    const prefs = s._prefs || {};
    let html = this.header('Settings','settings','Customise your game experience.',null);

    // Save Management
    html += `<div class="settings-section">
      <h3>💾 Save Management</h3>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
        <button class="btn" onclick="game.save(); ui.toast({type:'success',text:'Game saved!'})">Save Now</button>
        <button class="btn" onclick="ui.exportSave()">Export Save</button>
        <button class="btn" onclick="ui.importSavePrompt()">Import Save</button>
        ${typeof online !== 'undefined' && online.isOnline ? '<button class="btn" onclick="online.saveToCloud()">Save to Cloud</button><button class="btn" onclick="online.loadFromCloud().then(d=>{if(d){game.migrateSave(d);game.save();location.reload();}})">Load from Cloud</button>' : ''}
      </div>
      <button class="btn btn-danger" onclick="if(confirm('Delete ALL progress? This cannot be undone.')){game.deleteSave(); location.reload();}">Delete Save</button>
    </div>`;

    // Display Preferences
    html += `<div class="settings-section">
      <h3>🖥 Display Preferences</h3>
      <div class="settings-grid">
        <label class="settings-row">
          <span>Show XP Gains in Combat</span>
          <input type="checkbox" ${prefs.showCombatXp!==false?'checked':''} onchange="ui._setPref('showCombatXp',this.checked)">
        </label>
        <label class="settings-row">
          <span>Show Floating Damage Numbers</span>
          <input type="checkbox" ${prefs.showSplats!==false?'checked':''} onchange="ui._setPref('showSplats',this.checked)">
        </label>
        <label class="settings-row">
          <span>Show Combat Log (auto-open)</span>
          <input type="checkbox" ${prefs.autoCombatLog?'checked':''} onchange="ui._setPref('autoCombatLog',this.checked);ui._showCombatLog=this.checked">
        </label>
        <label class="settings-row">
          <span>Compact Bank (smaller items)</span>
          <input type="checkbox" ${prefs.compactBank?'checked':''} onchange="ui._setPref('compactBank',this.checked);ui.renderPage('bank')">
        </label>
        <label class="settings-row">
          <span>Show Skill XP Bar in Sidebar</span>
          <input type="checkbox" ${prefs.sidebarXp!==false?'checked':''} onchange="ui._setPref('sidebarXp',this.checked);ui.renderSidebar()">
        </label>
        <label class="settings-row">
          <span>Performance Mode (reduce animations)</span>
          <input type="checkbox" ${prefs.perfMode?'checked':''} onchange="ui._setPref('perfMode',this.checked);document.body.classList.toggle('perf-mode',this.checked)">
        </label>
      </div>
    </div>`;

    // Bank Presets
    const presets = s._bankPresets || [];
    html += `<div class="settings-section">
      <h3>⚔ Equipment Presets</h3>
      <p style="font-size:11px;color:var(--text-dim);margin:0 0 10px">Save your current equipment loadout to quickly re-equip.</p>
      <div class="preset-grid">
        ${[0,1,2,3].map(i => {
          const p = presets[i];
          return `<div class="preset-slot ${p?'preset-filled':''}">
            <div class="preset-name">${p ? (p.name||`Preset ${i+1}`) : `Preset ${i+1}`}</div>
            ${p ? `<div class="preset-items">${Object.entries(p.equip||{}).filter(([,v])=>v).map(([k,v])=>`<span class="preset-item" title="${k}">${GAME_DATA.items[v]?.name?.split(' ').pop()||v}</span>`).join('')}</div>` : '<div class="preset-empty">Empty</div>'}
            <div class="preset-btns">
              <button class="btn btn-xs" onclick="ui._savePreset(${i})">Save</button>
              ${p ? `<button class="btn btn-xs" onclick="ui._loadPreset(${i})">Load</button>` : ''}
              ${p ? `<button class="btn btn-xs btn-danger" onclick="ui._clearPreset(${i})">✕</button>` : ''}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;

    // Tutorial
    html += `<div class="settings-section">
      <h3>📖 Tutorial</h3>
      <button class="btn btn-sm" onclick="game.state._tutorialDismissed=false;ui.showTutorial(0)">Restart Tutorial</button>
    </div>`;

    // About
    html += `<div class="settings-section">
      <h3>ℹ About Ashfall Idle</h3>
      <div class="settings-about-grid">
        <div class="sa-stat"><span>${Object.keys(GAME_DATA.items).length.toLocaleString()}</span>Items</div>
        <div class="sa-stat"><span>${Object.keys(GAME_DATA.skills).length}</span>Skills</div>
        <div class="sa-stat"><span>${Object.keys(GAME_DATA.monsters).length}</span>Monsters</div>
        <div class="sa-stat"><span>${(GAME_DATA.quests||[]).length}</span>Quests</div>
        <div class="sa-stat"><span>${Object.values(GAME_DATA.recipes||{}).reduce((a,r)=>a+r.length,0)}</span>Recipes</div>
        <div class="sa-stat"><span>${(GAME_DATA.combatAreas||[]).length}</span>Areas</div>
      </div>
      <p style="font-size:11px;color:var(--text-dim);margin:10px 0 0">Ashfall Idle v9.5 — Dark Fantasy Idle RPG</p>
    </div>`;

    el.innerHTML = html;
    // Apply perf mode class
    document.body.classList.toggle('perf-mode', !!(s._prefs?.perfMode));
  }

  _setPref(key, value) {
    if (!this.engine.state._prefs) this.engine.state._prefs = {};
    this.engine.state._prefs[key] = value;
    this.engine.save?.();
  }

  _savePreset(idx) {
    const s = this.engine.state;
    if (!s._bankPresets) s._bankPresets = [];
    const name = prompt(`Name for Preset ${idx+1}:`, `Preset ${idx+1}`);
    if (name === null) return;
    s._bankPresets[idx] = { name, equip: { ...s.equipment } };
    this.toast({type:'success', text:`Preset ${idx+1} saved!`});
    this.renderPage('settings_page');
  }

  _loadPreset(idx) {
    const s = this.engine.state;
    const preset = s._bankPresets?.[idx];
    if (!preset) return;
    // Return current equipped to bank, then equip preset
    for (const [slot, id] of Object.entries(s.equipment)) {
      if (id && slot !== 'ammo') { this.engine.addItem(id, 1); s.equipment[slot] = null; }
    }
    for (const [slot, id] of Object.entries(preset.equip || {})) {
      if (id && s.bank[id] > 0) {
        s.bank[id]--;
        if (s.bank[id] <= 0) delete s.bank[id];
        s.equipment[slot] = id;
      }
    }
    this.engine.emit('equipmentChanged');
    this.toast({type:'success', text:`Preset "${preset.name}" loaded!`});
    this.renderPage('settings_page');
  }

  _clearPreset(idx) {
    if (!this.engine.state._bankPresets) return;
    this.engine.state._bankPresets[idx] = null;
    this.renderPage('settings_page');
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
        if (famData?.buff) {
          for (const [stat,val] of Object.entries(famData.buff)) {
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
    const maxPP = (s.skills.prayer?.level||1)*10, pp = s.prayerPoints || 0;
    const ppPct = Math.round((pp / maxPP) * 100);
    const active = s.activePrayers || [];
    const drainPerAtk = active.reduce((sum, id) => {
      const p = GAME_DATA.prayers.find(pr => pr.id === id);
      return sum + (p?.pointCost || 0);
    }, 0);

    let html = this.header('Prayer','sparkle','Bury bones for prayer points. Activate up to 2 prayers for combat buffs.','prayer');

    html += `<div class="prayer-dash">
      <div class="prayer-kpi"><div class="prayer-kpi-val">${pp}</div><div class="prayer-kpi-lbl">Prayer Points</div></div>
      <div class="prayer-kpi"><div class="prayer-kpi-val">${active.length}/2</div><div class="prayer-kpi-lbl">Active</div></div>
      <div class="prayer-kpi"><div class="prayer-kpi-val">${drainPerAtk > 0 ? '-'+drainPerAtk : '—'}</div><div class="prayer-kpi-lbl">Drain/Atk</div></div>
    </div>
    <div class="prayer-pts-bar-wrap">
      <div class="prayer-pts-bar-label"><span>Prayer Points</span><span>${pp} / ${maxPP}</span></div>
      <div class="prayer-pts-bar-track"><div class="prayer-pts-bar-fill" style="width:${ppPct}%"></div></div>
    </div>`;

    // Bone SVG icons per type
    const boneIcon = (id) => {
      const icons = {
        bones:       `<svg viewBox="0 0 28 28"><circle cx="7" cy="7" r="3.5" fill="#e8e0d4"/><circle cx="21" cy="21" r="3.5" fill="#e8e0d4"/><rect x="5.5" y="5.5" width="17" height="4" fill="#e8e0d4" transform="rotate(45 14 14)"/></svg>`,
        big_bones:   `<svg viewBox="0 0 28 28"><circle cx="6" cy="6" r="4" fill="#d4c8b8"/><circle cx="22" cy="22" r="4" fill="#d4c8b8"/><rect x="4" y="4" width="20" height="5" fill="#d4c8b8" transform="rotate(45 14 14)"/></svg>`,
        dragon_bones:`<svg viewBox="0 0 28 28"><circle cx="6" cy="6" r="4" fill="#4a8a3e"/><circle cx="22" cy="22" r="4" fill="#4a8a3e"/><rect x="4" y="4" width="20" height="5" fill="#4a8a3e" transform="rotate(45 14 14)"/><path d="M10 10 L18 18" stroke="#6acc5e" stroke-width="1.5" opacity="0.6"/></svg>`,
        frost_bones: `<svg viewBox="0 0 28 28"><circle cx="6" cy="6" r="4" fill="#7ac4e8"/><circle cx="22" cy="22" r="4" fill="#7ac4e8"/><rect x="4" y="4" width="20" height="5" fill="#7ac4e8" transform="rotate(45 14 14)"/></svg>`,
        ash_bones:   `<svg viewBox="0 0 28 28"><circle cx="6" cy="6" r="4" fill="#d67338"/><circle cx="22" cy="22" r="4" fill="#d67338"/><rect x="4" y="4" width="20" height="5" fill="#d67338" transform="rotate(45 14 14)"/></svg>`,
        void_bones:  `<svg viewBox="0 0 28 28"><circle cx="6" cy="6" r="4" fill="#6a3a9a"/><circle cx="22" cy="22" r="4" fill="#6a3a9a"/><rect x="4" y="4" width="20" height="5" fill="#6a3a9a" transform="rotate(45 14 14)"/></svg>`,
      };
      return icons[id] || icons.bones;
    };

    html += '<h2 class="section-title">Bury Bones</h2><div class="bone-grid">';
    for (const [boneId, boneData] of Object.entries(GAME_DATA.boneValues)) {
      const item = GAME_DATA.items[boneId]; if (!item) continue;
      const qty = s.bank[boneId] || 0;
      html += `<div class="bone-card ${qty>0?'bone-have':''}">
        <div class="bone-card-header">
          <span class="bone-icon" style="width:24px;height:24px;display:inline-flex">${boneIcon(boneId)}</span>
          <span class="bone-name">${item.name}</span>
          ${qty>0?`<span class="bone-qty-badge">x${qty}</span>`:''}
        </div>
        <div class="bone-stats">+${boneData.points} pts · +${boneData.xp} XP</div>
        <div class="bone-btns">
          <button class="btn btn-xs" ${!qty?'disabled':''} onclick="game.buryBones('${boneId}',1)">1</button>
          <button class="btn btn-xs" ${qty<5?'disabled':''} onclick="game.buryBones('${boneId}',5)">5</button>
          <button class="btn btn-xs" ${qty<10?'disabled':''} onclick="game.buryBones('${boneId}',10)">10</button>
          <button class="btn btn-xs" ${!qty?'disabled':''} onclick="game.buryBones('${boneId}',${qty})">All</button>
        </div>
      </div>`;
    }
    html += '</div>';

    // Prayer icon SVGs
    const prayerIcon = (id) => {
      const m = {
        thick_skin:`<svg viewBox="0 0 28 28"><polygon points="14,3 22,7 24,16 20,23 8,23 4,16 6,7" fill="#4a9ed4" opacity="0.2" stroke="#4a9ed4" stroke-width="1.5"/></svg>`,
        burst_of_str:`<svg viewBox="0 0 28 28"><path d="M14 4 L17 10 L24 10 L18 15 L21 22 L14 18 L7 22 L10 15 L4 10 L11 10Z" fill="#d4a83a" opacity="0.7"/></svg>`,
        clarity_of_thought:`<svg viewBox="0 0 28 28"><circle cx="14" cy="12" r="6" fill="none" stroke="#c8cad4" stroke-width="1.5"/><line x1="14" y1="4" x2="14" y2="8" stroke="#c8cad4" stroke-width="1.5"/><path d="M10 22 Q14 18 18 22" fill="none" stroke="#c8cad4" stroke-width="1.5"/></svg>`,
        sharp_eye:`<svg viewBox="0 0 28 28"><ellipse cx="14" cy="14" rx="10" ry="6" fill="none" stroke="#4a8a3e" stroke-width="1.5"/><circle cx="14" cy="14" r="3" fill="#4a8a3e" opacity="0.8"/></svg>`,
        mystic_will:`<svg viewBox="0 0 28 28"><circle cx="14" cy="14" r="8" fill="none" stroke="#8a5ec4" stroke-width="1.5" stroke-dasharray="3,2"/><circle cx="14" cy="14" r="3.5" fill="#8a5ec4" opacity="0.5"/></svg>`,
        rock_skin:`<svg viewBox="0 0 28 28"><polygon points="14,3 22,7 24,16 20,23 8,23 4,16 6,7" fill="#4a9ed4" opacity="0.3" stroke="#4a9ed4" stroke-width="2"/></svg>`,
        superhuman_str:`<svg viewBox="0 0 28 28"><path d="M14 4 L17 10 L24 10 L18 15 L21 22 L14 18 L7 22 L10 15 L4 10 L11 10Z" fill="#d4a83a"/></svg>`,
        improved_reflexes:`<svg viewBox="0 0 28 28"><circle cx="14" cy="12" r="6" fill="none" stroke="#c8cad4" stroke-width="2"/><line x1="14" y1="4" x2="14" y2="7" stroke="#c8cad4" stroke-width="2"/><line x1="14" y1="18" x2="14" y2="24" stroke="#c8cad4" stroke-width="1.5"/></svg>`,
        hawk_eye:`<svg viewBox="0 0 28 28"><ellipse cx="14" cy="14" rx="10" ry="6" fill="none" stroke="#5aaa4e" stroke-width="2"/><circle cx="14" cy="14" r="4" fill="#4a8a3e" opacity="0.9"/></svg>`,
        mystic_lore:`<svg viewBox="0 0 28 28"><circle cx="14" cy="14" r="8" fill="none" stroke="#9a6ed4" stroke-width="2" stroke-dasharray="4,2"/><circle cx="14" cy="14" r="4" fill="#8a5ec4" opacity="0.7"/></svg>`,
        steel_skin:`<svg viewBox="0 0 28 28"><polygon points="14,3 22,7 24,16 20,23 8,23 4,16 6,7" fill="#4a9ed4" opacity="0.5" stroke="#4a9ed4" stroke-width="2.5"/></svg>`,
        ultimate_str:`<svg viewBox="0 0 28 28"><path d="M14 3 L17.5 9.5 L25 9.5 L19 14.5 L22 22 L14 17.5 L6 22 L9 14.5 L3 9.5 L10.5 9.5Z" fill="#d4a83a" stroke="#c9873e" stroke-width="0.5"/></svg>`,
        incredible_reflexes:`<svg viewBox="0 0 28 28"><circle cx="14" cy="12" r="7" fill="none" stroke="#d4d8e0" stroke-width="2.5"/><line x1="14" y1="3" x2="14" y2="7" stroke="#d4d8e0" stroke-width="2.5"/><circle cx="14" cy="12" r="3" fill="#d4d8e0" opacity="0.4"/></svg>`,
        eagle_eye:`<svg viewBox="0 0 28 28"><ellipse cx="14" cy="14" rx="10" ry="6" fill="none" stroke="#6acc5e" stroke-width="2.5"/><circle cx="14" cy="14" r="4.5" fill="#5aaa4e" opacity="0.9"/></svg>`,
        mystic_might:`<svg viewBox="0 0 28 28"><circle cx="14" cy="14" r="9" fill="none" stroke="#aa7ef4" stroke-width="2.5" stroke-dasharray="5,2"/><circle cx="14" cy="14" r="5" fill="#9a6ed4" opacity="0.8"/></svg>`,
        piety:`<svg viewBox="0 0 28 28"><polygon points="14,3 22,7 24,16 20,23 8,23 4,16 6,7" fill="none" stroke="#d4a83a" stroke-width="2"/><rect x="12" y="8" width="4" height="12" fill="#d4a83a" opacity="0.8"/><rect x="9" y="12" width="10" height="3" fill="#d4a83a" opacity="0.8"/></svg>`,
        rigour:`<svg viewBox="0 0 28 28"><polygon points="14,3 22,7 24,16 20,23 8,23 4,16 6,7" fill="none" stroke="#5aaa4e" stroke-width="2"/><ellipse cx="14" cy="14" rx="5" ry="3" fill="#4a8a3e" opacity="0.8"/></svg>`,
        augury:`<svg viewBox="0 0 28 28"><polygon points="14,3 22,7 24,16 20,23 8,23 4,16 6,7" fill="none" stroke="#aa7ef4" stroke-width="2"/><circle cx="14" cy="14" r="5" fill="#8a5ec4" opacity="0.5" stroke="#aa7ef4" stroke-width="1.5" stroke-dasharray="3,2"/></svg>`,
        protect_melee:`<svg viewBox="0 0 28 28"><path d="M14 4 L22 8 L22 18 Q22 24 14 26 Q6 24 6 18 L6 8Z" fill="rgba(196,64,64,0.15)" stroke="#c44040" stroke-width="2"/><path d="M10 13 L13 16 L18 10" stroke="#c44040" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
        protect_ranged:`<svg viewBox="0 0 28 28"><path d="M14 4 L22 8 L22 18 Q22 24 14 26 Q6 24 6 18 L6 8Z" fill="rgba(90,170,78,0.15)" stroke="#5aaa4e" stroke-width="2"/><path d="M10 13 L13 16 L18 10" stroke="#5aaa4e" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
        protect_magic:`<svg viewBox="0 0 28 28"><path d="M14 4 L22 8 L22 18 Q22 24 14 26 Q6 24 6 18 L6 8Z" fill="rgba(138,94,196,0.15)" stroke="#8a5ec4" stroke-width="2"/><path d="M10 13 L13 16 L18 10" stroke="#8a5ec4" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>`,
      };
      return m[id] || `<svg viewBox="0 0 28 28"><circle cx="14" cy="14" r="9" fill="none" stroke="var(--accent)" stroke-width="1.5"/></svg>`;
    };

    const categories = [
      { label:'Protection', ids:['protect_melee','protect_ranged','protect_magic'] },
      { label:'Defence', ids:['thick_skin','rock_skin','steel_skin'] },
      { label:'Strength', ids:['burst_of_str','superhuman_str','ultimate_str'] },
      { label:'Attack', ids:['clarity_of_thought','improved_reflexes','incredible_reflexes'] },
      { label:'Ranged', ids:['sharp_eye','hawk_eye','eagle_eye'] },
      { label:'Magic', ids:['mystic_will','mystic_lore','mystic_might'] },
      { label:'Elite', ids:['piety','rigour','augury'] },
    ];

    html += '<h2 class="section-title">Prayers</h2>';
    for (const cat of categories) {
      const prayers = cat.ids.map(id => GAME_DATA.prayers.find(p => p.id === id)).filter(Boolean);
      if (!prayers.length) continue;
      html += `<div class="prayer-category"><div class="prayer-category-header">${cat.label}</div><div class="prayer-grid-v2">`;
      for (const p of prayers) {
        const locked = s.skills.prayer.level < p.level;
        const isActive = active.includes(p.id);
        const cls = locked ? 'prayer-locked-v2' : isActive ? 'prayer-active-v2' : '';
        const ponclick = locked ? '' : `onclick="game.activatePrayer('${p.id}');ui.renderPage('prayer')"`;
        html += `<div class="prayer-card ${cls}" ${ponclick}>
          <div class="prayer-card-icon">${prayerIcon(p.id)}</div>
          <div class="prayer-card-name">${p.name}</div>
          <div class="prayer-card-stats">${p.desc}</div>
          <div class="prayer-card-cost">${p.pointCost} pts/atk</div>
          <div class="prayer-card-lv">Lv ${p.level}</div>
          ${isActive ? '<div class="prayer-active-badge">ACTIVE</div>' : ''}
          ${locked ? `<div class="locked-overlay" style="font-size:10px">Lv ${p.level}</div>` : ''}
        </div>`;
      }
      html += '</div></div>';
    }
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
        <span style="font-family:'JetBrains Mono',monospace;font-size:12px"><span id="slayer-page-killed">${s.slayerTask.killed}</span>/<span id="slayer-page-amount">${s.slayerTask.amount}</span></span>
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
    const allPets = GAME_DATA.combatPets || GAME_DATA.pets || [];
    const owned   = s.pets || [];
    const active  = s.activePet;

    let html = this.header('Pets','paw',`${owned.length}/${allPets.length} pets collected. Combat pets fight alongside you — each has a unique ability.`,null);

    // Active pet display
    if (active) {
      const pet = allPets.find(p => p.id === active);
      if (pet) {
        html += `<div class="active-pet-banner">
          <div class="apb-art">${GAME_DATA.petArt?.[pet.id]||this._defaultPetSvg(pet)}</div>
          <div class="apb-info">
            <div class="apb-name">${pet.name} <span class="apb-active-badge">ACTIVE</span></div>
            <div class="apb-desc">${pet.desc}</div>
            <div class="apb-action">⚔ <strong>${pet.action?.desc||'Combat ability'}</strong> — every ${pet.action?.every||3} player attacks</div>
            ${pet.passive ? `<div class="apb-passive">📿 Passive: ${Object.entries(pet.passive).map(([k,v])=>k+' +'+v).join(', ')}</div>` : ''}
          </div>
          <button class="btn btn-sm btn-danger" onclick="game.equipPet('${pet.id}');ui.renderPage('pets')">Unequip</button>
        </div>`;
      }
    }

    // Pet categories
    const categories = [
      { label:'Combat Pets', types:['damage','debuff','pierce','bleed','stun','slow','poison'] },
      { label:'Support Pets', types:['support'] },
      { label:'Skilling Pets', types:[''] },
    ];

    // Group pets: owned first sorted by combat type
    const sorted = [...allPets].sort((a,b) => {
      const ao = owned.includes(a.id)?0:1, bo = owned.includes(b.id)?0:1;
      return ao-bo;
    });

    html += '<h2 class="section-title">Pet Collection</h2><div class="pet-grid">';
    for (const pet of sorted) {
      const have    = owned.includes(pet.id);
      const isActive = active === pet.id;
      const src      = GAME_DATA.monsters[pet.source]?.name || GAME_DATA.skills[pet.source]?.name || pet.source;
      const rarity   = 1/pet.dropRate >= 200 ? 'rare' : 1/pet.dropRate >= 100 ? 'uncommon' : 'common';
      const typeColors = { damage:'#d67338', debuff:'#d4a83a', support:'#4abe6c', pierce:'#7ac4e8', stun:'#d4a83a', slow:'#4a9ed4', poison:'#7ab030', bleed:'#c44040' };
      const typeColor = typeColors[pet.combatType||''] || 'var(--accent)';

      html += `<div class="pet-card ${have?'pet-owned':'pet-locked'} ${isActive?'pet-active-card':''}">
        <div class="pet-art-wrap">${have ? (GAME_DATA.petArt?.[pet.id]||this._defaultPetSvg(pet)) : '<div class="pet-unknown-art">?</div>'}</div>
        <div class="pet-info">
          <div class="pet-name">${have?pet.name:'???'}</div>
          ${have ? `<div class="pet-type-badge" style="background:${typeColor}22;color:${typeColor};border-color:${typeColor}50">${pet.combatType||'skilling'}</div>` : ''}
          <div class="pet-desc">${have?pet.desc:'Unknown pet. Keep fighting to discover.'}</div>
          ${have && pet.action ? `<div class="pet-ability">⚔ ${pet.action.desc||'ability'} every ${pet.action.every} attacks</div>` : ''}
          <div class="pet-source">Source: ${src} <span style="color:var(--text-dim)">(1/${Math.floor(1/pet.dropRate).toLocaleString()})</span></div>
        </div>
        <div class="pet-card-btns">
          ${have && !isActive ? `<button class="btn btn-sm" onclick="game.equipPet('${pet.id}');ui.renderPage('pets')">Equip</button>` : ''}
          ${isActive ? '<div class="pet-equipped-label">Equipped</div>' : ''}
        </div>
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  _defaultPetSvg(pet) {
    // Generate a simple colored SVG for pets without art
    const colors = { damage:'#d67338', support:'#4abe6c', debuff:'#d4a83a', pierce:'#7ac4e8', stun:'#d4a83a', slow:'#4a9ed4', poison:'#7ab030', bleed:'#c44040' };
    const col = colors[pet.combatType||''] || '#c9873e';
    return `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="16" fill="${col}22" stroke="${col}" stroke-width="1.5"/>
      <circle cx="20" cy="17" r="7" fill="${col}" opacity="0.8"/>
      <ellipse cx="20" cy="32" rx="10" ry="6" fill="${col}" opacity="0.6"/>
      <circle cx="16" cy="15" r="1.5" fill="white" opacity="0.9"/>
      <circle cx="24" cy="15" r="1.5" fill="white" opacity="0.9"/>
    </svg>`;
  }
  // ── SPELLBOOKS PAGE ────────────────────────────────────
  renderSpellbooksPage(el) {
    const s = this.engine.state;
    let html = this.header('Spellbooks','wand','Switch between spellbooks to access different spell schools. Advanced books require a physical tome to unlock.',null);
    const activeBook = s.activeSpellbook || 'standard';

    // Staff context for free rune display
    const wpnId = s.equipment?.weapon;
    const wpnData = wpnId ? GAME_DATA.items[wpnId] : null;
    const allRunesFree = wpnData?.providesAllRunes || false;
    const rawFree = wpnData?.providesRune;
    const freeRuneSet = allRunesFree ? null : (rawFree ? new Set(Array.isArray(rawFree) ? rawFree : [rawFree]) : new Set());
    if (wpnData?.providesRune || wpnData?.providesAllRunes) {
      const freeLabel = allRunesFree ? 'all runes' : (Array.isArray(rawFree) ? rawFree.map(r=>GAME_DATA.items[r]?.name||r).join(' & ') : (GAME_DATA.items[rawFree]?.name||rawFree));
      html += `<div class="info-banner">${icon('wand',14)} ${wpnData.name} provides <strong>unlimited ${freeLabel}</strong>. These runes are marked <span class="rune-free">∞ FREE</span> in spell listings below.</div>`;
    }

    html += '<h2 class="section-title">Available Spellbooks</h2><div class="actions-grid">';
    for (const [id, book] of Object.entries(GAME_DATA.spellbooks)) {
      const active = activeBook === id;
      const skillLocked = book.unlockReq && Object.entries(book.unlockReq).some(([sk,lv]) => (s.skills[sk]?.level||0) < lv);
      const alreadyUnlocked = !book.unlockItem || id === 'standard' || (s.unlockedSpellbooks?.[id]);
      const hasTome = book.unlockItem && (s.bank?.[book.unlockItem]||0) > 0;
      const itemLocked = book.unlockItem && !alreadyUnlocked && !hasTome;
      const locked = skillLocked || itemLocked;

      const reqParts = [];
      if (book.unlockReq) reqParts.push(...Object.entries(book.unlockReq).map(([sk,lv])=>`${GAME_DATA.skills[sk]?.name||sk} ${lv}`));
      if (book.unlockItem) {
        const tomeName = GAME_DATA.items[book.unlockItem]?.name || book.unlockItem;
        if (alreadyUnlocked) reqParts.push(`<span style="color:var(--success)">${tomeName} ✓</span>`);
        else if (hasTome) reqParts.push(`<span style="color:var(--amber)">${tomeName} (in bank — will be consumed)</span>`);
        else reqParts.push(`<span style="color:var(--danger)">${tomeName} needed</span>`);
      }
      const reqStr = reqParts.length ? reqParts.join(', ') : 'None';
      const bookColor = book.color || 'var(--amber)';

      html += `<div class="action-card ${locked?'locked':''} ${active?'active':''}" style="${book.color?'border-left:3px solid '+book.color:''}">
        <div class="ac-header"><span class="ac-name" style="color:${bookColor}">${book.name}</span>${active?'<span class="ach-check">Active</span>':''}</div>
        <p class="area-desc">${book.desc}</p>
        <div class="ac-footer"><span>Requires: ${reqStr}</span></div>
        ${!locked&&!active?`<button class="btn btn-sm" onclick="game.switchSpellbook('${id}');ui.renderPage('spellbooks')">Activate</button>`:''}
        ${locked?`<div class="locked-overlay">${skillLocked?'Skill level too low':itemLocked?'Tome required':''}</div>`:''}
      </div>`;
    }
    html += '</div>';

    // Show spells for active book
    const spells = this.engine.getSpellsForActiveBook();
    const bookData = GAME_DATA.spellbooks[activeBook];
    const bookColor = bookData?.color || 'var(--amber)';
    html += `<h2 class="section-title" style="color:${bookColor}">${bookData?.name||'Standard'} Spells</h2><div class="actions-grid">`;
    for (const sp of spells) {
      const locked = s.skills.magic.level < sp.level;
      const selected = s.combat.selectedSpell === sp.id;
      const runeLabel = sp.runes.map(r => {
        const isFree = allRunesFree || (freeRuneSet && freeRuneSet.has(r.item));
        const name = GAME_DATA.items[r.item]?.name || r.item;
        return isFree
          ? `<span class="rune-free">${name} ∞</span>`
          : `${name} x${r.qty}`;
      }).join(' + ');

      const tags = [];
      if (sp.statusChance) Object.keys(sp.statusChance).forEach(s2=>tags.push(s2));
      if (sp.lifesteal) tags.push(`Heal ${Math.round(sp.lifesteal*100)}%`);
      if (sp.defIgnore) tags.push(`Ignore ${Math.round(sp.defIgnore*100)}% def`);
      const tagHtml = tags.length ? `<div class="spell-tags">${tags.map(t=>`<span class="spell-tag">${t}</span>`).join('')}</div>` : '';

      html += `<div class="action-card ${locked?'locked':''} ${selected?'active':''}" ${locked?'':`onclick="ui.selectSpell('${sp.id}');ui.renderPage('spellbooks')"`}>
        <div class="ac-header"><span class="ac-name">${sp.name}</span><span class="ac-level">Lv ${sp.level}</span></div>
        <p class="area-desc">${sp.desc}</p>
        ${tagHtml}
        <div class="ac-footer"><span>Max Hit: ${sp.maxHit}</span><span>${runeLabel || 'No runes'}</span></div>
        ${locked?`<div class="locked-overlay">Magic ${sp.level}</div>`:''}
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  // ── CHARACTER CREATOR ───────────────────────────────────
  renderPrestigePage(el) {
    const s = this.engine.state;
    const cfg = GAME_DATA.prestige;
    const currentRank = s._prestigeRank || 0;
    const rankData = cfg?.ranks?.[currentRank - 1];
    const nextRankData = cfg?.ranks?.[currentRank];
    const check = this.engine.canPrestige();
    const tl = this.engine.getTotalLevel();
    const maxTl = Object.keys(s.skills).length * 99;

    let html = this.header('Prestige','sparkle',`Rank ${currentRank} — Sacrifice everything to transcend.`,null);

    // Current rank badge
    if (currentRank > 0 && rankData) {
      html += `<div class="prestige-rank-badge" style="border-color:${rankData.color};box-shadow:0 0 20px ${rankData.color}33">
        <div class="prb-icon">${rankData.icon}</div>
        <div class="prb-name" style="color:${rankData.color}">${rankData.name}</div>
        <div class="prb-rank">Prestige Rank ${currentRank}</div>
        <div class="prb-bonuses">
          ${Object.entries(rankData.bonuses).map(([k,v]) => {
            const labels = {xpMult:'XP', goldMult:'Gold', dropMult:'Drops', dmgMult:'Damage', startLevel:'Skill Start Lv'};
            return `<span class="prb-bonus">+${typeof v==='number'&&v<1?(v*100).toFixed(0)+'%':v} ${labels[k]||k}</span>`;
          }).join('')}
        </div>
      </div>`;
    } else {
      html += `<div class="prestige-intro">
        <div class="pi-icon">⭐</div>
        <div class="pi-title">Prestige System</div>
        <div class="pi-desc">When all skills reach 99, you may Prestige — resetting your skills in exchange for permanent bonuses that carry across all future lives. Each prestige rank makes you stronger forever.</div>
      </div>`;
    }

    // Prestige check panel
    html += `<div class="prestige-check-panel ${check.ok?'check-ready':'check-not-ready'}">
      <div class="pcp-header">${check.ok ? '✅ Ready to Prestige!' : '⏳ Requirements'}</div>
      <div class="pcp-row ${tl >= (cfg?.minTotalLevel||2000)?'req-met':'req-locked'}">
        Total Level ${tl} / ${cfg?.minTotalLevel||2000}
      </div>
      <div class="pcp-row ${check.ok?'req-met':'req-locked'}">
        All skills level 99
      </div>
      ${check.ok ? '' : `<div class="pcp-reason">${check.reason}</div>`}
    </div>`;

    // TL progress bar
    const tlPct = Math.min(100, (tl / maxTl) * 100);
    html += `<div class="prestige-tl-bar">
      <div class="ptlb-label"><span>Total Level</span><span>${tl.toLocaleString()} / ${maxTl}</span></div>
      <div class="ptlb-track"><div class="ptlb-fill" style="width:${tlPct.toFixed(1)}%"></div></div>
    </div>`;

    // Prestige button
    if (check.ok) {
      html += `<div class="prestige-action">
        <div class="pa-warning">⚠ All skills reset to ${nextRankData?.bonuses?.startLevel||1}. Most bank items wiped. This cannot be undone.</div>
        <button class="btn prestige-btn" onclick="if(confirm('PRESTIGE? Skills and most items will be reset. Permanent bonuses unlocked. Are you SURE?'))game.performPrestige()">
          ${nextRankData?.icon||'⭐'} Prestige → ${nextRankData?.name||'Next Rank'}
        </button>
      </div>`;
    }

    // All ranks overview
    html += '<h2 class="section-title">Prestige Ranks</h2><div class="prestige-ranks-grid">';
    for (let i = 0; i < (cfg?.ranks?.length||5); i++) {
      const r = cfg.ranks[i];
      const unlocked = currentRank > i;
      const isCurrent = currentRank === i + 1;
      html += `<div class="prestige-rank-card ${unlocked?'rank-unlocked':''} ${isCurrent?'rank-current':''}">
        <div class="prc-icon">${r.icon}</div>
        <div class="prc-name" style="${unlocked?'color:'+r.color:''}">${r.name}</div>
        <div class="prc-rank">Rank ${i+1}</div>
        <div class="prc-bonuses">
          ${Object.entries(r.bonuses).map(([k,v])=>{
            const labels={xpMult:'XP',goldMult:'Gold',dropMult:'Drops',dmgMult:'Dmg',startLevel:'Start Lv'};
            return `<span>${labels[k]||k}: ${typeof v==='number'&&v<1?(v*100).toFixed(0)+'%':v}</span>`;
          }).join('<br>')}
        </div>
        ${unlocked ? '<div class="prc-owned">✓ Achieved</div>' : ''}
      </div>`;
    }
    html += '</div>';

    // Prestige history
    if ((s._prestigeHistory||[]).length > 0) {
      html += '<h2 class="section-title">Your History</h2>';
      for (const h of [...(s._prestigeHistory||[])].reverse()) {
        html += `<div class="prestige-hist-row">
          <span>${cfg.ranks[h.rank-1]?.icon||'⭐'} Rank ${h.rank}</span>
          <span>TL ${h.totalLevel} when reset</span>
          <span>${new Date(h.at).toLocaleDateString()}</span>
        </div>`;
      }
    }

    el.innerHTML = html;
  }

  renderCharacterPage(el) {
    const s = this.engine.state;
    if (!s.profile) s.profile = {};
    const p = s.profile;
    const isOnline = typeof online !== 'undefined' && online.isOnline;
    const displayName = (isOnline && online.displayName) ? online.displayName : (p.displayName || 'Survivor');
    const align = GAME_DATA.alignments[s.alignment] || GAME_DATA.alignments['true_neutral'] || { name:'Neutral', axis:'NN' };
    const pRank = s._prestigeRank || 0;
    const prestigeData = pRank > 0 ? GAME_DATA.prestige?.ranks?.[pRank - 1] : null;
    const qpTotal = GAME_DATA.quests?.reduce((a,q)=>a+(q.qp||0),0) || 0;
    // Calculate current QP dynamically from completed quests
    const currentQP = GAME_DATA.quests?.reduce((sum,q) => sum + ((s.quests?.completed||[]).includes(q.id) ? (q.qp||0) : 0), 0) || 0;

    // Build avatar URL from profile
    const seed = p.avatarSeed || displayName || 'Survivor';
    const hair = p.hair || 'short04';
    const skinColor = p.skinColor || 'c68642';
    const hairColor = p.hairColor || '2c1b18';
    const eyes = p.eyes || 'variant04';
    const mouth = p.mouth || 'happy01';
    const clothing = p.clothing || 'variant04';
    const clothingColor = p.clothingColor || '4a90d4';
    const accessories = p.accessory ? `&accessories=${p.accessory}` : '';
    const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(seed)}&hair=${hair}&skinColor=${skinColor}&hairColor=${hairColor}&mouth=${mouth}&eyes=${eyes}&clothing=${clothing}&clothingColor=${clothingColor}${accessories}&size=160`;

    // Rank title based on total level + prestige
    const tl = this.engine.getTotalLevel();
    const cl = this.engine.getCombatLevel();
    let rankTitle = tl < 500 ? 'Ashen Wanderer' : tl < 1000 ? 'Ember Scout' : tl < 1500 ? 'Ashland Veteran' : tl < 2000 ? 'Cinder Knight' : 'Lord of the Ashlands';
    if (prestigeData) rankTitle = prestigeData.name;

    let html = `<div class="char-page-wrap">`;

    // ── TOP HERO CARD ─────────────────────────────────────
    html += `<div class="char-hero-card">
      <div class="char-avatar-zone">
        <div class="char-avatar-frame">
          <img src="${avatarUrl}" alt="Avatar" id="char-avatar-img" width="160" height="160">
          ${pRank > 0 ? `<div class="char-prestige-ring" style="border-color:${prestigeData?.color||'#c9873e'}" title="Prestige ${pRank}">
            <span class="char-prestige-icon">${prestigeData?.icon||'⭐'}</span>
          </div>` : ''}
        </div>
        <div class="char-online-dot ${isOnline?'dot-online':'dot-offline'}" title="${isOnline?'Online':'Offline'}"></div>
      </div>
      <div class="char-hero-info">
        <div class="char-hero-name">
          <span id="char-name-display">${this.escHtml(displayName)}</span>
          ${pRank > 0 ? `<span class="char-prestige-badge" style="color:${prestigeData?.color||'#c9873e'}">${prestigeData?.icon} ${prestigeData?.name}</span>` : ''}
        </div>
        <div class="char-hero-title">${rankTitle}</div>
        <div class="char-hero-align">
          <span class="char-align-chip">${align.name}</span>
          <span class="char-align-axis">${align.axis}</span>
        </div>
        ${p.bio ? `<div class="char-bio-display">${this.escHtml(p.bio)}</div>` : `<div class="char-bio-display char-bio-empty">No bio set. Add one below.</div>`}
        <div class="char-kpi-row">
          <div class="char-kpi"><div class="char-kpi-val">${cl}</div><div class="char-kpi-lbl">Combat</div></div>
          <div class="char-kpi"><div class="char-kpi-val">${tl.toLocaleString()}</div><div class="char-kpi-lbl">Total Lv</div></div>
          <div class="char-kpi"><div class="char-kpi-val">${currentQP}<span class="char-kpi-of">/${qpTotal}</span></div><div class="char-kpi-lbl">QP</div></div>
          <div class="char-kpi"><div class="char-kpi-val">${s.quests?.completed?.length||0}</div><div class="char-kpi-lbl">Quests</div></div>
          <div class="char-kpi"><div class="char-kpi-val">${this.fmt(s.stats?.monstersKilled||0)}</div><div class="char-kpi-lbl">Kills</div></div>
          <div class="char-kpi"><div class="char-kpi-val">${this.fmt(s.gold||0)}</div><div class="char-kpi-lbl">Gold</div></div>
        </div>
      </div>
    </div>`;

    // ── CUSTOMIZER ────────────────────────────────────────
    html += `<div class="char-section">
      <div class="char-section-header">
        <span class="char-section-title">⚔ Customize Avatar</span>
        <span class="char-section-sub">Changes preview instantly</span>
      </div>
      <div class="char-customizer-layout">
        <div class="char-preview-panel">
          <img src="${avatarUrl}" alt="Preview" id="char-preview-img" width="120" height="120" class="char-preview-img">
          <div class="char-preview-name">${this.escHtml(displayName)}</div>
          <div class="char-preview-rank">${rankTitle}</div>
        </div>
        <div class="char-options-panel">
          <div class="char-opt-row">
            <label class="char-opt-label">Name / Seed</label>
            <input type="text" class="char-input" id="co-seed" value="${this.escHtml(p.avatarSeed||displayName||'')}" placeholder="${this.escHtml(displayName)}" oninput="ui._previewChar('avatarSeed',this.value)">
          </div>
          <div class="char-opt-row">
            <label class="char-opt-label">Skin Tone</label>
            <div class="char-swatches">
              ${['ffdbb4','e8b88a','c68642','8d5524','5a3a1a','f0d0b0','d4a080','a06040','dfc094','b07840'].map(c =>
                `<button class="char-swatch ${skinColor===c?'swatch-active':''}" style="background:#${c}" data-charkey="skinColor" data-charval="${c}" onclick="ui._previewChar('skinColor','${c}')" title="#${c}"></button>`
              ).join('')}
            </div>
          </div>
          <div class="char-opt-row">
            <label class="char-opt-label">Hair Style</label>
            <div class="char-select-grid">
              ${['short01','short02','short03','short04','short05','long01','long02','long03','long04','long05','long06','long07','long08','long09','long10'].map((h,i) =>
                `<button class="char-opt-btn ${hair===h?'opt-active':''}" data-charkey="hair" data-charval="${h}" onclick="ui._previewChar('hair','${h}')">${h.replace('short','S').replace('long','L')}</button>`
              ).join('')}
            </div>
          </div>
          <div class="char-opt-row">
            <label class="char-opt-label">Hair Color</label>
            <div class="char-swatches">
              ${['2c1b18','d4a83a','c44040','1a1a1f','7a4a2a','e8e0d4','5a2a8a','3a8a5e','c4843a','4a6a9e','ff6b6b','6bcfff','ff9f43','a29bfe','fd79a8','00b894'].map(c =>
                `<button class="char-swatch ${hairColor===c?'swatch-active':''}" style="background:#${c}" data-charkey="hairColor" data-charval="${c}" onclick="ui._previewChar('hairColor','${c}')" title="#${c}"></button>`
              ).join('')}
            </div>
          </div>
          <div class="char-opt-row">
            <label class="char-opt-label">Eyes</label>
            <div class="char-select-grid">
              ${['variant01','variant02','variant03','variant04','variant05','variant06','variant07','variant08','variant09','variant10','variant11','variant12'].map((e,i) =>
                `<button class="char-opt-btn ${eyes===e?'opt-active':''}" data-charkey="eyes" data-charval="${e}" onclick="ui._previewChar('eyes','${e}')">${i+1}</button>`
              ).join('')}
            </div>
          </div>
          <div class="char-opt-row">
            <label class="char-opt-label">Mouth</label>
            <div class="char-select-grid">
              ${['happy01','happy02','happy03','happy04','happy05','happy06','happy07','happy08','happy09','happy10','happy11','happy12','sad01','sad02','sad03','sad04','sad05','sad06','surprised01','surprised02'].map((m,i) =>
                `<button class="char-opt-btn ${mouth===m?'opt-active':''}" data-charkey="mouth" data-charval="${m}" onclick="ui._previewChar('mouth','${m}')">${i+1}</button>`
              ).join('')}
            </div>
          </div>
          <div class="char-opt-row">
            <label class="char-opt-label">Clothing</label>
            <div class="char-select-grid">
              ${Array.from({length:25},(_,i)=>'variant'+(i+1).toString().padStart(2,'0')).map((v,i) =>
                `<button class="char-opt-btn ${clothing===v?'opt-active':''}" data-charkey="clothing" data-charval="${v}" onclick="ui._previewChar('clothing','${v}')">${i+1}</button>`
              ).join('')}
            </div>
          </div>
          <div class="char-opt-row">
            <label class="char-opt-label">Shirt Color</label>
            <div class="char-swatches">
              ${['4a90d4','c44040','5a8a3e','d4a83a','8a5ec4','1a1a1f','e8e0d4','c47a3a','0a7a7a','9a3a6a','ff6b6b','2980b9','27ae60','f39c12','8e44ad','e74c3c','1abc9c','d35400','2c3e50','f1c40f'].map(c =>
                `<button class="char-swatch ${clothingColor===c?'swatch-active':''}" style="background:#${c}" data-charkey="clothingColor" data-charval="${c}" onclick="ui._previewChar('clothingColor','${c}')" title="#${c}"></button>`
              ).join('')}
            </div>
          </div>
          <div class="char-opt-row">
            <label class="char-opt-label">Accessory</label>
            <div class="char-select-grid">
              ${[{v:'',l:'None'},{v:'variant01',l:'A1'},{v:'variant02',l:'A2'},{v:'variant03',l:'A3'},{v:'variant04',l:'A4'}].map(({v,l}) =>
                `<button class="char-opt-btn ${(p.accessory||'')===v?'opt-active':''}" data-charkey="accessory" data-charval="${v}" onclick="ui._previewChar('accessory','${v}')">${l}</button>`
              ).join('')}
            </div>
          </div>
          <div class="char-opt-row">
            <label class="char-opt-label">Background</label>
            <div class="char-swatches">
              ${['0a0b0f','1a1c2a','2a1a0a','0a1a2a','1a0a2a','2a2a1a','transparent','b7c9d3','c9a084','a8d5a2'].map(c =>
                `<button class="char-swatch ${(p.bgColor||'0a0b0f')===c?'swatch-active':''}" style="background:${c==='transparent'?'repeating-conic-gradient(#555 0% 25%, #222 0% 50%) 0 0/8px 8px':'#'+c}" data-charkey="bgColor" data-charval="${c}" onclick="ui._previewChar('bgColor','${c}')" title="${c}"></button>`
              ).join('')}
            </div>
          </div>
          <div class="char-opt-row">
            <label class="char-opt-label">Title</label>
            <div class="char-select-grid">
              ${ui._getUnlockedTitles(s).map(t =>
                `<button class="char-opt-btn ${(p.title||'')===t.id?'opt-active':''}" data-charkey="title" data-charval="${t.id}" onclick="ui._previewChar('title','${t.id}')" title="${t.desc}">${t.name}</button>`
              ).join('')}
            </div>
          </div>
          <div class="char-opt-row">
            <label class="char-opt-label">Bio</label>
            <textarea class="char-input char-bio-input" id="co-bio" placeholder="Describe your character, your goals, your legend..." rows="3">${this.escHtml(p.bio||'')}</textarea>
          </div>
        </div>
      </div>
      <div class="char-save-row">
        <button class="btn char-save-btn" onclick="ui.saveCharacter()">💾 Save Character</button>
        ${isOnline ? `<button class="btn btn-sm char-sync-btn" onclick="ui.saveCharacter(true)">☁ Save & Sync to Cloud</button>` : ''}
        <span id="char-save-status" class="char-save-status"></span>
      </div>
    </div>`;

    // ── COMBAT STATISTICS ─────────────────────────────────
    const dmg = s.stats?.dmg || {};
    const totalDmg = dmg.total || 0;
    const totalTaken = dmg.taken || 0;
    const kills = s.stats?.monstersKilled || 0;
    const playTimeMins = Math.floor((s.stats?.totalPlayTime||0) / 60);
    const playTimeHrs = Math.floor(playTimeMins / 60);
    const dps = playTimeMins > 0 ? Math.floor(totalDmg / (playTimeMins * 60)) : 0;
    const allSkillXp = Object.values(s.skills).reduce((a,sk)=>a+(sk.xp||0),0);
    const xpPerHour = playTimeHrs > 0 ? Math.floor(allSkillXp / Math.max(1, (s.stats?.totalPlayTime||0) / 3600)) : 0;

    html += `<div class="char-section">
      <div class="char-section-header"><span class="char-section-title">📊 Lifetime Statistics</span></div>
      <div class="char-stats-grid">
        <div class="csg-card csg-combat">
          <div class="csg-icon">⚔</div>
          <div class="csg-title">Combat</div>
          <div class="csg-row"><span>Monsters Killed</span><span class="csg-val">${this.fmt(kills)}</span></div>
          <div class="csg-row"><span>Total Damage</span><span class="csg-val">${this.fmt(totalDmg)}</span></div>
          <div class="csg-row"><span>Damage Taken</span><span class="csg-val" style="color:#e06040">${this.fmt(totalTaken)}</span></div>
          <div class="csg-row"><span>Damage Ratio</span><span class="csg-val">${totalTaken>0?(totalDmg/totalTaken).toFixed(2)+'x':'—'}</span></div>
          <div class="csg-row"><span>Highest Hit</span><span class="csg-val">${this.fmt(s.stats?.highestHit||0)}</span></div>
          <div class="csg-row"><span>Boss Kills</span><span class="csg-val">${this.fmt(s.stats?.worldBossKills||0)}</span></div>
          <div class="csg-row"><span>Deaths</span><span class="csg-val" style="color:#e06040">${s.stats?.deaths||0}</span></div>
        </div>
        <div class="csg-card csg-skills">
          <div class="csg-icon">📚</div>
          <div class="csg-title">Skills</div>
          <div class="csg-row"><span>Total XP</span><span class="csg-val">${this.fmt(allSkillXp)}</span></div>
          <div class="csg-row"><span>XP / Hour</span><span class="csg-val">${this.fmt(xpPerHour)}</span></div>
          <div class="csg-row"><span>Play Time</span><span class="csg-val">${playTimeHrs}h ${playTimeMins%60}m</span></div>
          <div class="csg-row"><span>Items Crafted</span><span class="csg-val">${this.fmt(s.stats?.itemsCrafted||0)}</span></div>
          <div class="csg-row"><span>Dungeons</span><span class="csg-val">${s.stats?.dungeonsCompleted||0}</span></div>
          <div class="csg-row"><span>Caskets Opened</span><span class="csg-val">${s.stats?.casketsOpened||0}</span></div>
          <div class="csg-row"><span>Gold Earned</span><span class="csg-val">${this.fmt(s.stats?.goldEarned||0)}</span></div>
        </div>
      </div>

      <!-- Damage breakdown bar -->
      ${totalDmg > 0 ? `<div class="char-dmg-bar-wrap">
        <div class="char-dmg-title">Damage Style Breakdown</div>
        <div class="char-dmg-bar">
          ${['melee','ranged','magic','ability'].map(type => {
            const val = dmg[type]||0; const pct = Math.round(val/totalDmg*100);
            const colors = {melee:'#c44040',ranged:'#4aaa60',magic:'#5a8aee',ability:'#c9873e'};
            return pct>0?`<div class="char-dmg-seg" style="width:${pct}%;background:${colors[type]}" title="${type}: ${this.fmt(val)} (${pct}%)"></div>`:'';
          }).join('')}
        </div>
        <div class="char-dmg-legend">
          ${['melee','ranged','magic','ability'].map(type => {
            const val = dmg[type]||0; const pct = Math.round(val/totalDmg*100);
            const colors = {melee:'#c44040',ranged:'#4aaa60',magic:'#5a8aee',ability:'#c9873e'};
            return pct>0?`<span class="char-dmg-lbl"><span class="char-dmg-dot" style="background:${colors[type]}"></span>${type} ${pct}%</span>`:'';
          }).join('')}
        </div>
      </div>` : ''}
    </div>`;

    // ── SKILL MASTERY OVERVIEW ────────────────────────────
    html += `<div class="char-section">
      <div class="char-section-header"><span class="char-section-title">⚡ Skill Levels</span></div>
      <div class="char-skill-grid">`;
    const skillGroups = [
      { label:'Combat', icon:'⚔', skills:['attack','strength','defence','hitpoints','ranged','magic','prayer','slayer','necromancy'] },
      { label:'Gathering', icon:'🌲', skills:['woodcutting','mining','fishing','foraging','hunting','agility','thieving','farming'] },
      { label:'Artisan', icon:'⚒', skills:['cooking','smithing','fletching','crafting','alchemy','enchanting','incantation','summoning'] },
    ];
    for (const group of skillGroups) {
      html += `<div class="cskill-group"><div class="cskill-group-label">${group.icon} ${group.label}</div>`;
      for (const sId of group.skills) {
        const sk = s.skills[sId]; if (!sk) continue;
        const skData = GAME_DATA.skills[sId]; if (!skData) continue;
        const lv = sk.level;
        const isMax = lv >= 99;
        html += `<div class="cskill-row ${isMax?'cskill-max':lv>=70?'cskill-high':lv>=40?'cskill-mid':''}">
          <span class="cskill-name">${skData.name.substring(0,8)}</span>
          <div class="cskill-bar-outer">
            <div class="cskill-bar-fill" style="width:${(lv/99*100).toFixed(0)}%"></div>
          </div>
          <span class="cskill-lv ${isMax?'cskill-lv-max':''}">${lv}</span>
        </div>`;
      }
      html += '</div>';
    }
    html += '</div></div>';

    // ── TOP MONSTERS KILLED ───────────────────────────────
    const monsterKillLog = s.stats?.monsterKills || {};
    const topMonsters = Object.entries(monsterKillLog).sort(([,a],[,b])=>b-a).slice(0,8);
    if (topMonsters.length > 0) {
      html += `<div class="char-section">
        <div class="char-section-header"><span class="char-section-title">💀 Most Slain</span></div>
        <div class="char-monster-list">
          ${topMonsters.map(([id, count]) => {
            const mon = GAME_DATA.monsters[id];
            return `<div class="cml-row">
              <span class="cml-name">${mon?.name||id}</span>
              <div class="cml-bar-outer"><div class="cml-bar-fill" style="width:${Math.min(100,(count/topMonsters[0][1])*100).toFixed(0)}%"></div></div>
              <span class="cml-count">${this.fmt(count)}</span>
            </div>`;
          }).join('')}
        </div>
      </div>`;
    }

    html += '</div>'; // char-page-wrap
    el.innerHTML = html;
  }

  getAvatarUrl(size = 80) {
    const p = game.state.profile || {};
    const displayName = (typeof online !== 'undefined' && online.displayName) || p.displayName || 'Survivor';
    const seed = p.avatarSeed || displayName;
    const bg = p.bgColor && p.bgColor !== 'transparent' ? `&backgroundColor=${p.bgColor}` : '&backgroundColor=0a0b0f';
    return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(seed)}&hair=${p.hair||'short04'}&skinColor=${p.skinColor||'c68642'}&hairColor=${p.hairColor||'2c1b18'}&eyes=${p.eyes||'variant04'}&mouth=${p.mouth||'happy01'}&clothing=${p.clothing||'variant04'}&clothingColor=${p.clothingColor||'4a90d4'}${p.accessory?'&accessories='+p.accessory:''}${bg}&size=${size}`;
  }

  _getUnlockedTitles(s) {
    const all = [
      { id:'',              name:'None',         desc:'No title', req: true },
      { id:'wanderer',      name:'Wanderer',      desc:'Default title', req: true },
      { id:'ashling',       name:'Ashling',       desc:'Complete 5 quests', req: (s.quests?.completed?.length||0) >= 5 },
      { id:'hunter',        name:'Hunter',        desc:'Kill 1,000 monsters', req: (s.stats?.monstersKilled||0) >= 1000 },
      { id:'veteran',       name:'Veteran',       desc:'Kill 10,000 monsters', req: (s.stats?.monstersKilled||0) >= 10000 },
      { id:'slayer',        name:'Slayer',        desc:'Complete 10 slayer tasks', req: (s.stats?.slayerTasksCompleted||0) >= 10 },
      { id:'master_smith',  name:'Master Smith',  desc:'Smithing level 80+', req: (s.skills?.smithing?.level||0) >= 80 },
      { id:'archmage',      name:'Archmage',      desc:'Magic level 80+', req: (s.skills?.magic?.level||0) >= 80 },
      { id:'ranger',        name:'Ranger',        desc:'Ranged level 80+', req: (s.skills?.ranged?.level||0) >= 80 },
      { id:'druid',         name:'Druid',         desc:'Farming + Foraging 70+', req: (s.skills?.farming?.level||0) >= 70 && (s.skills?.foraging?.level||0) >= 70 },
      { id:'questmaster',   name:'Questmaster',   desc:'Complete 20 quests', req: (s.quests?.completed?.length||0) >= 20 },
      { id:'max_combat',    name:'Lord of War',   desc:'Combat level 126', req: this.engine.getCombatLevel() >= 126 },
      { id:'total_master',  name:'Total Master',  desc:'Total level 2000+', req: this.engine.getTotalLevel() >= 2000 },
      { id:'boss_slayer',   name:'Boss Slayer',   desc:'Kill 10 world bosses', req: (s.stats?.worldBossKills||0) >= 10 },
      { id:'prestige1',     name:'The Reborn',    desc:'Prestige once', req: (s._prestigeRank||0) >= 1 },
      { id:'prestige3',     name:'Ascendant',     desc:'Prestige 3 times', req: (s._prestigeRank||0) >= 3 },
      { id:'millionaire',   name:'Millionaire',   desc:'Earn 1,000,000 gold', req: (s.stats?.goldEarned||0) >= 1000000 },
    ];
    return all.filter(t => t.req);
  }

  _previewChar(key, value) {
    if (!game.state.profile) game.state.profile = {};
    game.state.profile[key] = value;
    const url160 = this.getAvatarUrl(160);
    const url32  = this.getAvatarUrl(32);
    // Update ALL avatar images on page immediately
    ['char-avatar-img','char-preview-img'].forEach(id => {
      const el = document.getElementById(id); if (el) el.src = url160;
    });
    // Update sidebar mini-avatar immediately (no re-render needed)
    document.querySelectorAll('.player-avatar-mini').forEach(img => img.src = url32);
    // Update active states on buttons
    document.querySelectorAll(`[data-charkey="${key}"]`).forEach(btn => {
      btn.classList.toggle('swatch-active', btn.dataset.charval === value);
      btn.classList.toggle('opt-active',    btn.dataset.charval === value);
    });
  }

  saveCharacter(sync = false) {
    const s = game.state;
    if (!s.profile) s.profile = {};
    const seedInput = document.getElementById('co-seed');
    const bioInput  = document.getElementById('co-bio');
    if (seedInput) s.profile.avatarSeed = seedInput.value.trim();
    if (bioInput)  s.profile.bio = bioInput.value.trim();
    game.save();
    // Force update ALL avatar instances site-wide
    const url32  = this.getAvatarUrl(32);
    const url160 = this.getAvatarUrl(160);
    document.querySelectorAll('.player-avatar-mini').forEach(img => img.src = url32);
    document.querySelectorAll('#char-avatar-img,#char-preview-img').forEach(img => img.src = url160);
    // Re-render sidebar to rebuild the HTML with saved values
    this.renderSidebar();
    if (sync && typeof online !== 'undefined' && online.isOnline) {
      online.syncProfileFull().then(() => {
        const el = document.getElementById('char-save-status');
        if (el) { el.textContent = '☁ Synced!'; el.style.color='#4aaa60'; setTimeout(()=>{ if(el) el.textContent=''; }, 3000); }
      });
    } else {
      const el = document.getElementById('char-save-status');
      if (el) { el.textContent = '✓ Saved!'; el.style.color='#4aaa60'; setTimeout(()=>{ if(el) el.textContent=''; }, 2000); }
    }
    this.toast({ type:'success', text: sync ? 'Character saved and synced!' : 'Character saved!' });
  }

  setCharOpt(key, value) { this._previewChar(key, value); }

  // ── GUILDS PAGE ────────────────────────────────────────
  renderGuildsPage(el) {
    const s = this.engine.state;
    const isOnline = typeof online !== 'undefined' && online.isOnline;
    let html = this.header('Guilds','faction','Forge alliances, share resources, and dominate the Ashlands.',null);

    if (!isOnline) {
      html += '<div class="bank-empty">Online features required. Configure Firebase to enable guilds.</div>';
      el.innerHTML = html; return;
    }
    if (!online.user || online.user.isAnonymous) {
      html += '<div class="bank-empty">Create an account to access guilds.</div>';
      el.innerHTML = html; return;
    }

    // If in a guild, sync role from Firestore FIRST before rendering
    if (s.guild && !this._guildRoleSynced) {
      el.innerHTML = html + '<div class="bank-empty">Loading guild...</div>';
      online.syncGuildRole().then(() => {
        this._guildRoleSynced = true;
        this.renderGuildsPage(el);
      });
      return;
    }
    this._guildRoleSynced = false; // reset for next render

    // Guild invitations banner
    html += '<div id="guild-invites-banner"></div>';

    if (s.guild) {
      // ── TABBED GUILD INTERFACE ──
      const tab = this._guildTab || 'overview';
      const tabs = [
        { id:'overview',  label:'Overview',  icon:'&#9733;' },
        { id:'members',   label:'Members',   icon:'&#9878;' },
        { id:'upgrades',  label:'Upgrades',  icon:'&#9650;' },
        { id:'bank',      label:'Bank',      icon:'&#9733;' },
        { id:'chat',      label:'Chat',      icon:'&#9993;' },
        { id:'log',       label:'Log',       icon:'&#9776;' },
        { id:'settings',  label:'Settings',  icon:'&#9881;' },
      ];
      html += `<div class="guild-header-panel">
        <div class="guild-banner">
          <div class="guild-name-main">[${this.escHtml(s.guild.tag||'')}] ${this.escHtml(s.guild.name)}</div>
          <div class="guild-role-badge" style="color:${OnlineManager.RANK_COLORS[s.guild.role]||'#7a7e94'}">${s.guild.role || 'Member'}</div>
        </div>
        <div class="guild-tabs">
          ${tabs.map(t => `<button class="guild-tab ${tab===t.id?'guild-tab-active':''}" onclick="ui._guildTab='${t.id}';ui.renderPage('guilds')"><span class="gt-icon">${t.icon}</span> ${t.label}</button>`).join('')}
        </div>
      </div>`;

      html += '<div class="guild-tab-content" id="guild-tab-content"><div class="bank-empty">Loading...</div></div>';
      el.innerHTML = html;
      this._loadGuildTab(tab);
    } else {
      // ── NO GUILD - CREATE / JOIN / BROWSE ──
      html += `<div class="guild-join-section">
        <div class="guild-join-panel">
          <h3 class="guild-join-title">Create a Guild</h3>
          <p class="guild-join-desc">Establish your own guild and recruit members. Costs 1,000 gold.</p>
          <div class="guild-join-form">
            <input type="text" id="guild-name" class="guild-input" placeholder="Guild name (3-30 chars)" maxlength="30">
            <input type="text" id="guild-tag" class="guild-input guild-tag-input" placeholder="TAG" maxlength="5">
            <button class="btn btn-sm" onclick="ui.createGuild()">Create</button>
          </div>
        </div>
        <div class="guild-join-panel">
          <h3 class="guild-join-title">Join by Name</h3>
          <p class="guild-join-desc">Enter the exact name of a guild to join directly.</p>
          <div class="guild-join-form">
            <input type="text" id="guild-join" class="guild-input" placeholder="Guild name" style="flex:1">
            <button class="btn btn-sm" onclick="ui.joinGuild()">Join</button>
          </div>
        </div>
      </div>`;

      // Browse guilds
      html += `<div class="guild-browse-section">
        <h2 class="section-title">Browse Guilds</h2>
        <div class="guild-search-row">
          <input type="text" id="guild-search" class="guild-input" placeholder="Search guilds..." oninput="ui._searchGuilds(this.value)">
        </div>
        <div id="guild-browse-list"><div class="bank-empty">Loading guilds...</div></div>
      </div>`;

      el.innerHTML = html;
      this._searchGuilds('');
      this._loadGuildInvites();
    }
  }

  async _loadGuildInvites() {
    const banner = document.getElementById('guild-invites-banner');
    if (!banner) return;
    const invites = await online.getGuildInvites();
    if (invites.length === 0) { banner.innerHTML = ''; return; }
    banner.innerHTML = invites.map(inv => `<div class="guild-invite-card">
      <div class="gi-info">
        <span class="gi-tag">[${this.escHtml(inv.guildTag||'')}]</span>
        <span class="gi-name">${this.escHtml(inv.guildName)}</span>
        <span class="gi-from">invited by ${this.escHtml(inv.fromName)}</span>
      </div>
      <div class="gi-btns">
        <button class="btn btn-xs" onclick="online.acceptGuildInvite('${inv.id}').then(()=>ui.renderPage('guilds'))">Accept</button>
        <button class="btn btn-xs btn-danger" onclick="online.declineGuildInvite('${inv.id}').then(()=>ui._loadGuildInvites())">Decline</button>
      </div>
    </div>`).join('');
  }

  async _searchGuilds(query) {
    const container = document.getElementById('guild-browse-list');
    if (!container) return;
    const guilds = await online.searchGuilds(query);
    if (guilds.length === 0) {
      container.innerHTML = '<div class="bank-empty">No guilds found.</div>'; return;
    }
    container.innerHTML = '<div class="guild-browse-grid">' + guilds.map(g => `<div class="guild-browse-card">
      <div class="gbc-top">
        <span class="gbc-tag">[${this.escHtml(g.tag)}]</span>
        <span class="gbc-name">${this.escHtml(g.name)}</span>
      </div>
      <div class="gbc-info">
        <span>Leader: ${this.escHtml(g.leaderName||'Unknown')}</span>
        <span>${g.memberCount}/50 members</span>
        <span class="gbc-type ${g.joinType==='invite'?'gbc-invite':''}">${g.joinType==='invite'?'Invite Only':'Open'}</span>
      </div>
      ${g.joinType==='open'?`<button class="btn btn-xs" onclick="online.joinGuild('${this.escHtml(g.name)}').then(()=>ui.renderPage('guilds'))">Join</button>`:''}
    </div>`).join('') + '</div>';
  }

  async _loadGuildTab(tab) {
    const container = document.getElementById('guild-tab-content');
    if (!container) return;

    // Sync role before rendering anything
    await online.syncGuildRole();
    const s = this.engine.state;
    const myRank = s.guild?.role || 'Recruit';
    const myIdx = OnlineManager.RANK_ORDER.indexOf(myRank);
    const rankOrder = OnlineManager.RANK_ORDER;
    const rankColors = OnlineManager.RANK_COLORS;

    if (tab === 'overview') {
      const info = await online.getGuildInfo();
      if (!info) { container.innerHTML = '<div class="bank-empty">Could not load guild.</div>'; return; }
      const onlineCount = (info.members||[]).filter(m => m.lastSeen && (Date.now() - m.lastSeen < 600000)).length;
      container.innerHTML = `
        <div class="guild-overview">
          <div class="guild-motd-panel">
            <div class="guild-motd-label">Message of the Day</div>
            <div class="guild-motd-text">${this.escHtml(info.motd || 'No MOTD set.')}</div>
          </div>
          <div class="guild-stats-row">
            <div class="guild-stat"><span class="gs-val">${info.memberCount || info.members?.length || 0}</span><span class="gs-label">Members</span></div>
            <div class="guild-stat"><span class="gs-val">${onlineCount}</span><span class="gs-label">Online</span></div>
            <div class="guild-stat"><span class="gs-val">${this.fmt(info.bank||0)}g</span><span class="gs-label">Bank</span></div>
            <div class="guild-stat"><span class="gs-val">${info.settings?.joinType||'open'}</span><span class="gs-label">Join Type</span></div>
          </div>
          ${info.description ? `<div class="guild-desc-panel"><div class="guild-desc-label">Description</div><div class="guild-desc-text">${this.escHtml(info.description)}</div></div>` : ''}
          <div class="guild-leave-row">
            <button class="btn btn-xs btn-danger" onclick="if(confirm('Leave this guild?'))online.leaveGuild().then(()=>{ui._guildTab='overview';ui.renderPage('guilds')})">Leave Guild</button>
          </div>
        </div>`;
    }

    else if (tab === 'members') {
      const members = await online.getGuildMembers();
      const canManage = myIdx <= 2;
      const canRank = myIdx <= 1;
      const canInvite = myIdx <= 2;
      let mHtml = '';
      if (canInvite) {
        mHtml += `<div class="guild-invite-row">
          <input type="text" id="guild-invite-name" class="guild-input" placeholder="Player name to invite..." style="flex:1">
          <button class="btn btn-sm" onclick="ui._guildInvitePlayer()">Invite</button>
        </div>`;
      }
      if (members.length === 0) {
        mHtml += '<div class="bank-empty">No members found.</div>';
      } else {
        // Sort by rank
        members.sort((a,b) => rankOrder.indexOf(a.rank||'Recruit') - rankOrder.indexOf(b.rank||'Recruit'));
        mHtml += '<div class="guild-members-grid">' + members.map(m => {
          const rank = m.rank || 'Recruit';
          const theirIdx = rankOrder.indexOf(rank);
          const isMe = m.uid === online.user?.uid;
          const canKickThis = canManage && !isMe && theirIdx > myIdx;
          const canRankThis = canRank && !isMe && theirIdx > myIdx;
          const isOnlineNow = m.lastSeen && (Date.now() - m.lastSeen < 600000);
          let rankSelect = '';
          if (canRankThis) {
            rankSelect = `<select class="rank-select" onchange="online.setMemberRank('${m.uid}',this.value).then(()=>{ui._guildTab='members';ui.renderPage('guilds')})">`;
            for (const r of rankOrder) {
              if (rankOrder.indexOf(r) <= myIdx) continue;
              rankSelect += `<option value="${r}" ${r===rank?'selected':''}>${r}</option>`;
            }
            rankSelect += '</select>';
          }
          const joinDate = m.joined ? new Date(m.joined).toLocaleDateString() : '?';
          return `<div class="guild-member-card ${isMe?'guild-member-me':''}">
            <div class="gmc-left">
              <span class="gmc-online-dot ${isOnlineNow?'gmc-dot-on':'gmc-dot-off'}"></span>
              <div class="gmc-info">
                <span class="gmc-name">${this.escHtml(m.name)} ${isMe?'<small style="color:var(--text-dim)">(You)</small>':''}</span>
                <span class="guild-rank" style="color:${rankColors[rank]||'#7a7e94'}">${rank}</span>
              </div>
            </div>
            <div class="gmc-meta">Joined ${joinDate}</div>
            <div class="gmc-actions">
              ${rankSelect}
              ${!isMe?`<button class="btn btn-xs" onclick="ui.openDM('${m.uid}','${this.escHtml(m.name)}')">Msg</button>`:''}
              ${canKickThis?`<button class="btn btn-xs btn-danger" onclick="if(confirm('Kick ${this.escHtml(m.name)}?'))online.kickMember('${m.uid}').then(()=>{ui._guildTab='members';ui.renderPage('guilds')})">Kick</button>`:''}
            </div>
          </div>`;
        }).join('') + '</div>';
      }
      container.innerHTML = mHtml;
    }

    else if (tab === 'bank') {
      const info = await online.getGuildInfo();
      const bank = info?.bank || 0;
      const bankItems = info?.bankItems || {};
      const withdrawRank = info?.settings?.withdrawRank || 'General';
      const canWithdraw = myIdx <= OnlineManager.RANK_ORDER.indexOf(withdrawRank);
      const log = await online.getGuildLog(30);
      const bankLog = log.filter(l => ['deposit','withdraw','item_deposit','item_withdraw'].includes(l.action));
      const itemEntries = Object.entries(bankItems).filter(([id,q]) => q > 0 && GAME_DATA.items[id]);

      container.innerHTML = `
        <div class="guild-bank-section">
          <div class="guild-bank-balance">
            <span class="gbb-amount">${this.fmt(bank)}</span>
            <span class="gbb-label">Gold in Treasury</span>
          </div>
          <div class="guild-bank-info">Withdraw requires: <strong>${withdrawRank}</strong> rank or higher</div>
          <div class="guild-bank-controls">
            <input type="number" id="guild-gold" class="guild-input" min="1" value="100" style="width:120px">
            <button class="btn btn-sm" onclick="online.depositGuildGold(parseInt(document.getElementById('guild-gold').value)||0).then(()=>{ui._guildTab='bank';ui.renderPage('guilds')})">Deposit Gold</button>
            ${canWithdraw?`<button class="btn btn-sm btn-withdraw" onclick="online.withdrawGuildGold(parseInt(document.getElementById('guild-gold').value)||0).then(()=>{ui._guildTab='bank';ui.renderPage('guilds')})">Withdraw Gold</button>`:`<button class="btn btn-sm" disabled title="Insufficient rank">Withdraw</button>`}
          </div>
          <div class="guild-bank-your-gold">Your Gold: ${this.fmt(game.state.gold)}</div>
        </div>

        <h3 class="guild-sub-title">Item Vault</h3>
        <div class="guild-item-bank-controls">
          <select id="guild-item-select" class="rank-select" style="font-size:13px;padding:6px;flex:1;max-width:220px">
            <option value="">-- Select item --</option>
            ${Object.entries(game.state.bank).filter(([id,q])=>q>0 && GAME_DATA.items[id] && !online.isUntradeable(id)).sort((a,b)=>(GAME_DATA.items[a[0]]?.name||'').localeCompare(GAME_DATA.items[b[0]]?.name||'')).map(([id,q])=>
              `<option value="${id}">${GAME_DATA.items[id].name} (${q})</option>`
            ).join('')}
          </select>
          <input type="number" id="guild-item-qty" class="guild-input" min="1" value="1" style="width:70px">
          <button class="btn btn-xs" onclick="ui._guildDepositItem()">Deposit</button>
        </div>
        ${itemEntries.length > 0 ? `<div class="guild-item-bank-grid">${itemEntries.map(([id,q]) => {
          const item = GAME_DATA.items[id];
          const rColor = this.getRarityColor(id);
          return `<div class="guild-bank-item">
            <span class="gbi-name" style="${rColor?'color:'+rColor:''}">${item.name}</span>
            <span class="gbi-qty">x${q}</span>
            ${canWithdraw?`<button class="btn btn-xs" onclick="online.withdrawGuildItem('${id}',1).then(()=>{ui._guildTab='bank';ui.renderPage('guilds')})">Take 1</button>`:''}
          </div>`;
        }).join('')}</div>` : '<div class="bank-empty">No items in vault.</div>'}

        <h3 class="guild-sub-title">Treasury History</h3>
        <div class="guild-log-list">${bankLog.length === 0 ? '<div class="bank-empty">No transactions yet.</div>' : bankLog.map(l => {
          const d = l.details || {};
          const time = l.timestamp?.toDate ? l.timestamp.toDate().toLocaleString() : '';
          const isDeposit = l.action === 'deposit' || l.action === 'item_deposit';
          const label = l.action === 'item_deposit' ? `deposited ${d.qty||1}x ${d.item||d.itemId}`
            : l.action === 'item_withdraw' ? `withdrew ${d.qty||1}x ${d.item||d.itemId}`
            : l.action === 'deposit' ? `deposited <strong>${this.fmt(d.amount||0)}g</strong>`
            : `withdrew <strong>${this.fmt(d.amount||0)}g</strong>`;
          return `<div class="guild-log-entry ${isDeposit?'gle-deposit':'gle-withdraw'}">
            <span class="gle-icon">${isDeposit?'&#9650;':'&#9660;'}</span>
            <span class="gle-text">${this.escHtml(d.player||'?')} ${label}</span>
            <span class="gle-time">${time}</span>
          </div>`;
        }).join('')}</div>`;
    }

    else if (tab === 'chat') {
      container.innerHTML = `
        <div class="guild-chat-container">
          <div id="guild-chat-messages" class="gchat-messages" style="height:400px"></div>
          <div class="gchat-input-area">
            <div class="gchat-input-row">
              <input type="text" id="guild-chat-input" class="gchat-input" placeholder="Message your guild..." maxlength="300" onkeydown="if(event.key==='Enter')ui._sendGuildChat()" autocomplete="off">
              <button class="gchat-send" onclick="ui._sendGuildChat()">
                <svg viewBox="0 0 24 24" width="20" height="20"><path d="M2 21L23 12 2 3 2 10 17 12 2 14z" fill="var(--accent)"/></svg>
              </button>
            </div>
          </div>
        </div>`;
      online.listenGuildChat(msgs => {
        const c = document.getElementById('guild-chat-messages');
        if (!c) return;
        c.innerHTML = msgs.map(m => {
          const isMe = online.user && m.uid === online.user.uid;
          const time = m.timestamp ? new Date(m.timestamp).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : '';
          const rColor = rankColors[m.rank] || '#7a7e94';
          return `<div class="gchat-msg ${isMe?'gchat-mine':''}">
            <div class="gchat-avatar" style="border-color:${rColor}">${m.name?m.name[0].toUpperCase():'?'}</div>
            <div class="gchat-body">
              <div class="gchat-meta">
                <span class="guild-rank" style="color:${rColor}">${m.rank||''}</span>
                <span class="gchat-name ${isMe?'gchat-name-me':''}">${this.escHtml(m.name)}</span>
                <span class="gchat-time">${time}</span>
              </div>
              <div class="gchat-text">${this.escHtml(m.text)}</div>
            </div>
          </div>`;
        }).join('');
        c.scrollTop = c.scrollHeight;
      });
    }

    else if (tab === 'upgrades') {
      const info = await online.getGuildInfo?.() || {};
      const guildGold = info.gold || 0;
      const ownedUpgrades = new Set(info.upgrades || []);
      const myRankIdx = OnlineManager.RANK_ORDER.indexOf(s.guild.role || 'Member');
      const canUpgrade = myRankIdx <= 1; // Leader or General+
      const upgrades = GAME_DATA.guildUpgrades || [];
      const tiers = [1,2,3,4];

      container.innerHTML = `<div class="guild-upgrades-wrap">
        <div class="guild-gold-bar">🏦 Guild Bank: <strong>${guildGold.toLocaleString()}g</strong></div>
        ${!canUpgrade ? '<div class="guild-upgrade-note">General rank or higher required to purchase upgrades.</div>' : ''}
        ${tiers.map(tier => {
          const tierUpgrades = upgrades.filter(u => u.tier === tier);
          return `<div class="guild-upgrade-tier">
            <div class="guild-tier-header">Tier ${tier}</div>
            <div class="guild-upgrade-grid">
              ${tierUpgrades.map(u => {
                const owned = ownedUpgrades.has(u.id);
                const reqOwned = !u.requires || ownedUpgrades.has(u.requires);
                const canBuy = canUpgrade && !owned && reqOwned && guildGold >= u.cost;
                const locked = !reqOwned;
                return `<div class="guild-upgrade-card ${owned?'upgrade-owned':''} ${locked?'upgrade-locked':''}">
                  <div class="gu-icon">${u.icon||'⚡'}</div>
                  <div class="gu-name">${u.name}</div>
                  <div class="gu-desc">${u.desc}</div>
                  <div class="gu-cost">${owned ? '✓ Purchased' : locked ? `Requires previous tier` : `${u.cost.toLocaleString()}g`}</div>
                  ${!owned && !locked && canUpgrade ? `<button class="btn btn-xs ${canBuy?'':'btn-disabled'}" ${canBuy?'':'disabled'} 
                    onclick="ui._buyGuildUpgrade('${u.id}',${u.cost})">
                    ${canBuy ? 'Purchase' : 'Insufficient gold'}
                  </button>` : ''}
                </div>`;
              }).join('')}
            </div>
          </div>`;
        }).join('')}
      </div>`;
    }
    else if (tab === 'log') {
      const log = await online.getGuildLog(50);
      if (log.length === 0) {
        container.innerHTML = '<div class="bank-empty">No activity recorded yet.</div>';
      } else {
        const actionLabels = {
          created:'Guild Created', joined:'Joined', joined_invite:'Joined via Invite', left:'Left',
          kicked:'Kicked', rank_change:'Rank Changed', deposit:'Deposited Gold', withdraw:'Withdrew Gold',
          motd_changed:'MOTD Updated', settings_changed:'Settings Changed'
        };
        const actionIcons = {
          created:'&#9733;', joined:'&#10010;', joined_invite:'&#10010;', left:'&#10008;',
          kicked:'&#10006;', rank_change:'&#8693;', deposit:'&#9650;', withdraw:'&#9660;',
          motd_changed:'&#9998;', settings_changed:'&#9881;'
        };
        container.innerHTML = '<div class="guild-log-list">' + log.map(l => {
          const d = l.details || {};
          const time = l.timestamp?.toDate ? l.timestamp.toDate().toLocaleString() : '';
          let detail = '';
          if (l.action === 'rank_change') detail = `${d.player}: ${d.from} &rarr; ${d.to} (by ${d.by})`;
          else if (l.action === 'kicked') detail = `${d.player} (by ${d.by})`;
          else if (l.action === 'deposit' || l.action === 'withdraw') detail = `${d.player}: ${this.fmt(d.amount||0)}g`;
          else if (d.player) detail = d.player;
          else if (d.by) detail = d.by;
          return `<div class="guild-log-entry">
            <span class="gle-icon">${actionIcons[l.action]||'&#8226;'}</span>
            <span class="gle-text"><strong>${actionLabels[l.action]||l.action}</strong> ${detail ? '— '+detail : ''}</span>
            <span class="gle-time">${time}</span>
          </div>`;
        }).join('') + '</div>';
      }
    }

    else if (tab === 'settings') {
      const info = await online.getGuildInfo();
      if (!info) { container.innerHTML = '<div class="bank-empty">Failed to load.</div>'; return; }
      const isLeader = myRank === 'Leader';
      const isOfficer = myIdx <= 1;
      container.innerHTML = `
        <div class="guild-settings-grid">
          ${isOfficer ? `<div class="guild-setting-card">
            <h4>Message of the Day</h4>
            <textarea id="guild-motd-input" class="guild-textarea" rows="3" maxlength="300" placeholder="MOTD shown to all members...">${this.escHtml(info.motd||'')}</textarea>
            <button class="btn btn-sm" onclick="online.setGuildMotd(document.getElementById('guild-motd-input').value).then(()=>{ui._guildTab='settings';ui.renderPage('guilds')})">Save MOTD</button>
          </div>` : ''}
          ${isOfficer ? `<div class="guild-setting-card">
            <h4>Guild Description</h4>
            <textarea id="guild-desc-input" class="guild-textarea" rows="3" maxlength="500" placeholder="Describe your guild...">${this.escHtml(info.description||'')}</textarea>
            <button class="btn btn-sm" onclick="online.setGuildDescription(document.getElementById('guild-desc-input').value).then(()=>{ui._guildTab='settings';ui.renderPage('guilds')})">Save Description</button>
          </div>` : ''}
          ${isLeader ? `<div class="guild-setting-card">
            <h4>Join Policy</h4>
            <select id="guild-join-type" class="rank-select" style="font-size:13px;padding:6px 10px">
              <option value="open" ${(info.settings?.joinType||'open')==='open'?'selected':''}>Open — Anyone can join</option>
              <option value="invite" ${info.settings?.joinType==='invite'?'selected':''}>Invite Only — Requires invitation</option>
            </select>
          </div>
          <div class="guild-setting-card">
            <h4>Minimum Withdraw Rank</h4>
            <select id="guild-withdraw-rank" class="rank-select" style="font-size:13px;padding:6px 10px">
              ${OnlineManager.RANK_ORDER.map(r => `<option value="${r}" ${(info.settings?.withdrawRank||'General')===r?'selected':''}>${r}</option>`).join('')}
            </select>
          </div>
          <div class="guild-setting-card">
            <button class="btn btn-sm" onclick="ui._saveGuildSettings()">Save All Settings</button>
          </div>` : '<div class="bank-empty">Only the Guild Leader can change settings.</div>'}
        </div>`;
    }
  }

  async _saveGuildSettings() {
    const joinType = document.getElementById('guild-join-type')?.value || 'open';
    const withdrawRank = document.getElementById('guild-withdraw-rank')?.value || 'General';
    await online.setGuildSettings({ joinType, withdrawRank });
    this._guildTab = 'settings';
    this.renderPage('guilds');
  }

  async _buyGuildUpgrade(upgradeId, cost) {
    const info = await online.getGuildInfo?.();
    if (!info) { this.toast({type:'warn',text:'Could not load guild data.'}); return; }
    if ((info.gold||0) < cost) { this.toast({type:'warn',text:`Insufficient guild gold. Need ${cost.toLocaleString()}g.`}); return; }
    const owned = new Set(info.upgrades||[]);
    if (owned.has(upgradeId)) { this.toast({type:'warn',text:'Already purchased.'}); return; }
    // Deduct gold and add upgrade
    await online.db?.ref(`guilds/${this.engine.state.guild.id}`).transaction(guild => {
      if (!guild) return guild;
      guild.gold = (guild.gold||0) - cost;
      if (!guild.upgrades) guild.upgrades = [];
      if (!guild.upgrades.includes(upgradeId)) guild.upgrades.push(upgradeId);
      return guild;
    });
    this.toast({type:'success', text:`Upgrade purchased!`});
    this._guildTab = 'upgrades';
    this.renderPage('guilds');
  }

  async _guildInvitePlayer() {
    const name = document.getElementById('guild-invite-name')?.value?.trim();
    if (!name) { this.toast({type:'warn',text:'Enter a player name.'}); return; }
    const results = await online.searchPlayers(name);
    const target = results.find(r => r.name.toLowerCase() === name.toLowerCase()) || results[0];
    if (!target) { this.toast({type:'warn',text:`Player "${name}" not found.`}); return; }
    await online.inviteToGuild(target.uid, target.name);
  }

  _sendGuildChat() {
    const input = document.getElementById('guild-chat-input');
    if (!input || !input.value.trim()) return;
    online.sendGuildChat(input.value.trim());
    input.value = '';
  }

  async _guildDepositItem() {
    const itemId = document.getElementById('guild-item-select')?.value;
    const qty = parseInt(document.getElementById('guild-item-qty')?.value) || 1;
    if (!itemId) { this.toast({type:'warn',text:'Select an item.'}); return; }
    await online.depositGuildItem(itemId, qty);
    this._guildTab = 'bank';
    this.renderPage('guilds');
  }

  // ── GIFT UI ────────────────────────────────────────────
  openGiftDialog(targetUid, targetName) {
    this._giftTarget = { uid: targetUid, name: targetName };
    this._giftMode = 'item';
    this.renderPage('gift');
  }

  renderGiftPage(el) {
    if (!this._giftTarget) { this.renderPage('inbox'); return; }
    const t = this._giftTarget;
    const mode = this._giftMode || 'item';
    let html = this.header('Send Gift','scroll',`Sending to ${t.name}`,null);

    html += `<div class="guild-join-section">
      <div class="guild-join-panel" style="flex:1">
        <div style="display:flex;gap:4px;margin-bottom:12px">
          <button class="btn btn-xs ${mode==='item'?'':'btn-dim'}" onclick="ui._giftMode='item';ui.renderPage('gift')">Send Items</button>
          <button class="btn btn-xs ${mode==='gold'?'':'btn-dim'}" onclick="ui._giftMode='gold';ui.renderPage('gift')">Send Gold</button>
        </div>
        ${mode === 'item' ? `
          <select id="gift-item" class="rank-select" style="font-size:13px;padding:6px;width:100%;margin-bottom:8px">
            <option value="">-- Select item --</option>
            ${Object.entries(game.state.bank).filter(([id,q])=>q>0 && GAME_DATA.items[id] && !online.isUntradeable(id)).sort((a,b)=>(GAME_DATA.items[a[0]]?.name||'').localeCompare(GAME_DATA.items[b[0]]?.name||'')).map(([id,q])=>
              `<option value="${id}">${GAME_DATA.items[id].name} (${q})</option>`
            ).join('')}
          </select>
          <div style="display:flex;gap:8px;align-items:center">
            <span style="font-size:12px;color:var(--text-dim)">Qty:</span>
            <input type="number" id="gift-qty" class="guild-input" min="1" value="1" style="width:80px">
            <button class="btn btn-sm" onclick="ui._sendItemGift()">Send Gift</button>
          </div>
        ` : `
          <div style="display:flex;gap:8px;align-items:center">
            <span style="font-size:12px;color:var(--text-dim)">Amount:</span>
            <input type="number" id="gift-gold" class="guild-input" min="1" value="100" style="width:120px">
            <button class="btn btn-sm" onclick="ui._sendGoldGift()">Send Gold</button>
          </div>
          <div style="font-size:12px;color:var(--text-dim);margin-top:6px">Your gold: ${this.fmt(game.state.gold)}</div>
        `}
        <button class="btn btn-xs" style="margin-top:12px" onclick="ui._giftTarget=null;ui.renderPage('inbox')">&larr; Back</button>
      </div>
    </div>`;

    // Pending gifts
    html += '<h2 class="section-title">Pending Gifts</h2><div id="pending-gifts"><div class="bank-empty">Loading...</div></div>';
    el.innerHTML = html;
    this._loadPendingGifts();
  }

  async _loadPendingGifts() {
    const container = document.getElementById('pending-gifts');
    if (!container) return;
    const gifts = await online.getPendingGifts();
    if (gifts.length === 0) { container.innerHTML = '<div class="bank-empty">No pending gifts.</div>'; return; }
    container.innerHTML = gifts.map(g => {
      const label = g.type === 'item' ? `${g.qty}x ${g.itemName||g.itemId}` : `${g.amount}g`;
      return `<div class="guild-browse-card">
        <div class="gbc-top">
          <span class="gbc-name">${this.escHtml(g.fromName)}</span>
        </div>
        <div class="gbc-info"><span>Sent: ${label}</span></div>
        <button class="btn btn-xs" onclick="online.claimGift('${g.id}').then(()=>ui._loadPendingGifts())">Claim</button>
      </div>`;
    }).join('');
  }

  async _sendItemGift() {
    const t = this._giftTarget;
    if (!t) return;
    const itemId = document.getElementById('gift-item')?.value;
    const qty = parseInt(document.getElementById('gift-qty')?.value) || 1;
    if (!itemId) { this.toast({type:'warn',text:'Select an item.'}); return; }
    await online.sendGift(t.uid, t.name, itemId, qty);
    this.renderPage('gift');
  }

  async _sendGoldGift() {
    const t = this._giftTarget;
    if (!t) return;
    const amount = parseInt(document.getElementById('gift-gold')?.value) || 0;
    if (amount <= 0) { this.toast({type:'warn',text:'Enter an amount.'}); return; }
    await online.sendGoldGift(t.uid, t.name, amount);
    this.renderPage('gift');
  }

  async _loadGuildData() {
    // Legacy compat - redirects to tab load
    this._loadGuildTab(this._guildTab || 'overview');
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
    // Send request with search
    html += `<div class="settings-section">
      <h3>Find Players</h3>
      <div style="display:flex;gap:8px">
        <input type="text" id="friend-search" class="chat-input-v2" placeholder="Search player name..." style="flex:1" oninput="ui._searchPlayers(this.value)">
      </div>
      <div id="player-search-results" style="margin-top:8px"></div>
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
        listContainer.innerHTML = '<div class="bank-empty">No friends yet. Search for players above.</div>';
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

  async _searchPlayers(query) {
    const container = document.getElementById('player-search-results');
    if (!container) return;
    if (!query || query.length < 2) { container.innerHTML = ''; return; }
    // Debounce
    clearTimeout(this._searchTimeout);
    this._searchTimeout = setTimeout(async () => {
      container.innerHTML = '<div class="bank-empty">Searching...</div>';
      const results = await online.searchPlayers(query);
      if (results.length === 0) {
        container.innerHTML = '<div class="bank-empty">No players found.</div>';
      } else {
        container.innerHTML = '<div class="friends-grid">' + results.map(p => `<div class="friend-card">
          <span class="fc-name">${this.escHtml(p.name)} <small style="color:var(--text-dim)">Cb${p.combatLevel} | Total ${p.totalLevel}</small></span>
          <div class="fc-btns">
            <button class="btn btn-xs" onclick="online.sendFriendRequest('${this.escHtml(p.name)}').then(()=>ui.renderPage('friends'))">Add Friend</button>
            <button class="btn btn-xs" onclick="ui.openDM('${p.uid}','${this.escHtml(p.name)}')">Message</button>
          </div>
        </div>`).join('') + '</div>';
      }
    }, 400);
  }

  openDM(uid, name) {
    this._dmTarget = { uid, name };
    this.renderPage('inbox');
  }

  renderInboxPage(el) {
    const isOnline = typeof online !== 'undefined' && online.isOnline;
    let html = this.header('Inbox','scroll','Private messages, guild invites, and notifications.',null);
    if (!isOnline || !online.user || online.user.isAnonymous) {
      html += '<div class="bank-empty">Create an account to use inbox and messaging.</div>';
      el.innerHTML = html; return;
    }

    // Active DM conversation
    if (this._dmTarget) {
      const t = this._dmTarget;
      html += `<div class="dm-section">
        <div class="dm-header">
          <div class="dm-header-left">
            <button class="btn btn-xs" onclick="ui._dmTarget=null;ui.renderPage('inbox')">&larr; Back</button>
            <span class="dm-partner-name">${this.escHtml(t.name)}</span>
          </div>
          <div class="dm-header-actions">
            <button class="btn btn-xs" onclick="ui.openGiftDialog('${t.uid}','${this.escHtml(t.name)}')" title="Send gift">Gift</button>
            <button class="btn btn-xs" onclick="ui._blockFromDM('${t.uid}','${this.escHtml(t.name)}')" title="Block player">Block</button>
          </div>
        </div>
        <div class="dm-messages" id="dm-messages"><div class="bank-empty">Loading...</div></div>
        <div class="dm-input">
          <input type="text" id="dm-text" class="gchat-input" placeholder="Type a message..." maxlength="500" onkeydown="if(event.key==='Enter')ui.sendDM()" autocomplete="off">
          <button class="gchat-send" onclick="ui.sendDM()">
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M2 21L23 12 2 3 2 10 17 12 2 14z" fill="var(--accent)"/></svg>
          </button>
        </div>
      </div>`;
      el.innerHTML = html;
      this._loadDMMessages(t.uid);
      return;
    }

    // Compose new message
    html += `<div class="inbox-compose">
      <h3 class="inbox-compose-title">New Message</h3>
      <div class="inbox-compose-row">
        <div class="inbox-compose-field">
          <span class="icf-label">To:</span>
          <input type="text" id="msg-to" class="guild-input" placeholder="Player name..." style="flex:1">
        </div>
        <div class="inbox-compose-field" style="flex:2">
          <span class="icf-label">Message:</span>
          <input type="text" id="msg-text" class="guild-input" placeholder="Type your message..." style="flex:1" maxlength="500" onkeydown="if(event.key==='Enter')ui.sendMessageToPlayer()">
        </div>
        <button class="btn btn-sm" onclick="ui.sendMessageToPlayer()">Send</button>
      </div>
    </div>`;

    // Inbox tabs
    const inboxTab = this._inboxTab || 'conversations';
    html += `<div class="inbox-tabs">
      <button class="inbox-tab ${inboxTab==='conversations'?'inbox-tab-active':''}" onclick="ui._inboxTab='conversations';ui.renderPage('inbox')">Conversations</button>
      <button class="inbox-tab ${inboxTab==='gifts'?'inbox-tab-active':''}" onclick="ui._inboxTab='gifts';ui.renderPage('inbox')">Gifts</button>
      <button class="inbox-tab ${inboxTab==='notifications'?'inbox-tab-active':''}" onclick="ui._inboxTab='notifications';ui.renderPage('inbox')">Notifications</button>
      <button class="inbox-tab ${inboxTab==='blocked'?'inbox-tab-active':''}" onclick="ui._inboxTab='blocked';ui.renderPage('inbox')">Blocked</button>
    </div>`;

    html += '<div id="inbox-tab-content"><div class="bank-empty">Loading...</div></div>';

    // Toolbar
    html += `<div class="inbox-toolbar">
      <button class="btn btn-xs" onclick="ui.renderPage('inbox')">Refresh</button>
      ${inboxTab==='notifications'?`<button class="btn btn-xs btn-danger" onclick="online.clearInbox().then(()=>ui.renderPage('inbox'))">Clear All</button>`:''}
    </div>`;

    el.innerHTML = html;
    this._loadInboxTab(inboxTab);
  }

  async _loadInboxTab(tab) {
    const container = document.getElementById('inbox-tab-content');
    if (!container) return;

    if (tab === 'conversations') {
      const convos = await online.getConversationList();
      if (convos.length === 0) {
        container.innerHTML = '<div class="bank-empty">No conversations yet. Send a message to start one.</div>';
      } else {
        container.innerHTML = '<div class="inbox-convo-list">' + convos.map(c => {
          const time = c.timestamp?.seconds ? new Date(c.timestamp.seconds * 1000).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'}) : '';
          return `<div class="inbox-convo-v2" onclick="ui.openDM('${c.otherUid}','${this.escHtml(c.otherName||'Unknown')}')">
            <div class="icv2-avatar">${(c.otherName||'?')[0].toUpperCase()}</div>
            <div class="icv2-body">
              <div class="icv2-top">
                <span class="icv2-name">${this.escHtml(c.otherName||'Unknown')}</span>
                <span class="icv2-time">${time}</span>
              </div>
              <div class="icv2-preview">${this.escHtml(c.lastMessage||'')}</div>
            </div>
            <span class="icv2-arrow">&rsaquo;</span>
          </div>`;
        }).join('') + '</div>';
      }
    }

    else if (tab === 'notifications') {
      const items = await online.getInbox();
      const notifs = items.filter(i => i.type !== 'message');
      if (notifs.length === 0) {
        container.innerHTML = '<div class="bank-empty">No notifications.</div>';
      } else {
        const typeIcons = { friend_request:'&#9829;', guild_invite:'&#9878;', system:'&#9733;', trade:'&#9733;', pvp:'&#9876;', gift:'&#127873;', party_invite:'&#9876;' };
        container.innerHTML = '<div class="inbox-notif-list">' + notifs.map(n => {
          const time = n.timestamp?.seconds ? new Date(n.timestamp.seconds * 1000).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'}) : '';
          let actionBtn = '';
          if (!n.read) actionBtn = `<button class="btn btn-xs" onclick="event.stopPropagation();online.markInboxRead('${n.id}').then(()=>ui.renderPage('inbox'))">Read</button>`;
          // Special action buttons
          if (n.type === 'gift') {
            actionBtn = `<button class="btn btn-xs" style="background:rgba(74,170,80,0.2);border-color:rgba(74,170,80,0.4)" onclick="event.stopPropagation();ui._inboxTab='gifts';ui.renderPage('inbox')">View Gifts</button>`;
          } else if (n.type === 'party_invite' && n.partyId) {
            actionBtn = `<button class="btn btn-xs" style="background:rgba(201,135,62,0.2);border-color:rgba(201,135,62,0.4)" onclick="event.stopPropagation();game.joinParty('${n.partyId}');online.markInboxRead('${n.id}')">Join Party</button>`;
          } else if (n.type === 'friend_request' && n.from) {
            actionBtn += ` <button class="btn btn-xs" style="background:rgba(74,170,80,0.2);border-color:rgba(74,170,80,0.4)" onclick="event.stopPropagation();online.acceptFriendRequest?.('${n.id}','${n.from}').then(()=>ui.renderPage('inbox'))">Accept</button>`;
          }
          return `<div class="inbox-notif-v2 ${n.read?'':'inbox-notif-unread'}">
            <span class="inot-icon">${typeIcons[n.type]||'&#8226;'}</span>
            <div class="inot-body">
              <span class="inot-from">${this.escHtml(n.fromName||'System')}</span>
              <span class="inot-text">${this.escHtml(n.preview||n.type)}</span>
              <span class="inot-time">${time}</span>
            </div>
            ${actionBtn}
          </div>`;
        }).join('') + '</div>';
      }
    }

    else if (tab === 'gifts') {
      // Load pending gifts
      const gifts = await online.getPendingGifts();
      if (gifts.length === 0) {
        container.innerHTML = '<div class="bank-empty">No pending gifts. Friends can send you items and gold!</div>';
      } else {
        container.innerHTML = '<div class="inbox-gifts-list">' + gifts.map(g => {
          const label = g.type === 'item' ? `${g.qty}x ${g.itemName||g.itemId}` : `${(g.amount||0).toLocaleString()} gold`;
          const time = g.timestamp?.seconds ? new Date(g.timestamp.seconds * 1000).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'}) : '';
          return `<div class="inbox-gift-card">
            <div class="igc-info">
              <div class="igc-from">From: <strong>${this.escHtml(g.fromName||'Unknown')}</strong></div>
              <div class="igc-item">${label}</div>
              <div class="igc-time">${time}</div>
            </div>
            <button class="btn btn-sm" style="background:rgba(74,170,80,0.2);border-color:rgba(74,170,80,0.4);color:#8ad88a" onclick="online.claimGift('${g.id}').then(ok=>{if(ok){ui.toast({type:'success',text:'Gift claimed!'});online.saveToCloud?.();ui.renderPage('inbox')}})">Claim</button>
          </div>`;
        }).join('') + '</div>';
      }
    }

    else if (tab === 'blocked') {
      const blocked = await online.getBlockedPlayers();
      if (blocked.length === 0) {
        container.innerHTML = '<div class="bank-empty">No blocked players.</div>';
      } else {
        container.innerHTML = '<div class="inbox-blocked-list">' + blocked.map(b => `<div class="inbox-blocked-card">
          <span>${this.escHtml(b.name)}</span>
          <button class="btn btn-xs" onclick="online.unblockPlayer('${b.uid}').then(()=>ui.renderPage('inbox'))">Unblock</button>
        </div>`).join('') + '</div>';
      }
    }
  }

  async _blockFromDM(uid, name) {
    if (confirm(`Block ${name}? You won't see their messages.`)) {
      await online.blockPlayer(uid, name);
      this._dmTarget = null;
      this.renderPage('inbox');
    }
  }

  async sendMessageToPlayer() {
    const toName = document.getElementById('msg-to')?.value?.trim();
    const text = document.getElementById('msg-text')?.value?.trim();
    if (!toName) { this.toast({type:'warn',text:'Enter a player name.'}); return; }
    if (!text) { this.toast({type:'warn',text:'Enter a message.'}); return; }
    try {
      const results = await online.searchPlayers(toName);
      const exact = results.find(r => r.name.toLowerCase() === toName.toLowerCase()) || results[0];
      if (!exact) { this.toast({type:'warn',text:`Player "${toName}" not found.`}); return; }
      if (exact.uid === online.user.uid) { this.toast({type:'warn',text:"Can't message yourself."}); return; }
      // Check blocked
      const blocked = await online.getBlockedPlayers();
      if (blocked.some(b => b.uid === exact.uid)) { this.toast({type:'warn',text:'This player is blocked.'}); return; }
      await online.sendPrivateMessage(exact.uid, exact.name, text);
      document.getElementById('msg-text').value = '';
      this._dmTarget = { uid:exact.uid, name:exact.name };
      this.renderPage('inbox');
    } catch(e) { this.toast({type:'danger',text:'Failed: ' + e.message}); }
  }

  async _loadInboxData() {
    // Legacy compat
    this._loadInboxTab(this._inboxTab || 'conversations');
  }

  async _loadDMMessages(targetUid) {
    const container = document.getElementById('dm-messages');
    if (!container) return;
    const msgs = await online.getConversation(targetUid);
    const blocked = await online.getBlockedPlayers();
    const blockedUids = blocked.map(b => b.uid);
    const filtered = msgs.filter(m => !blockedUids.includes(m.sender));
    if (filtered.length === 0) {
      container.innerHTML = '<div class="bank-empty">No messages yet. Say hello!</div>';
    } else {
      container.innerHTML = filtered.map(m => {
        const isMe = m.sender === online.user?.uid;
        const time = m.timestamp?.seconds ? new Date(m.timestamp.seconds * 1000).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}) : '';
        const date = m.timestamp?.seconds ? new Date(m.timestamp.seconds * 1000).toLocaleDateString([],{month:'short',day:'numeric'}) : '';
        return `<div class="dm-msg-v2 ${isMe?'dm-mine-v2':'dm-theirs-v2'}">
          <div class="dmv2-bubble">
            <div class="dmv2-text">${this.escHtml(m.text)}</div>
            <div class="dmv2-meta">
              <span class="dmv2-time">${date} ${time}</span>
              ${isMe?`<button class="dmv2-delete" onclick="event.stopPropagation();online.deleteMessage('${m.id}').then(()=>ui._loadDMMessages('${targetUid}'))" title="Delete">&times;</button>`:''}
            </div>
          </div>
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
        <div class="al-points">UID: ${user.uid.substring(0,4)}${'•'.repeat(user.uid.length - 8)}${user.uid.substring(user.uid.length - 4)}</div>
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
          <button class="btn google-btn" onclick="online.signInWithGoogle()"><svg viewBox="0 0 24 24" width="18" height="18" style="margin-right:8px;vertical-align:middle"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>Sign in with Google</button>
          <div class="divider-or"><span>or create with email</span></div>
          <input type="text" id="reg-name" class="chat-input" placeholder="Display Name">
          <input type="email" id="reg-email" class="chat-input" placeholder="Email">
          <input type="password" id="reg-pass" class="chat-input" placeholder="Password (6+ chars)">
          <button class="btn" onclick="online.createAccount(document.getElementById('reg-email').value, document.getElementById('reg-pass').value, document.getElementById('reg-name').value)">Create Account</button>
        </div>
        <h3 style="margin-top:16px">Or Sign In</h3>
        <div style="display:flex;flex-direction:column;gap:8px;max-width:340px">
          <button class="btn google-btn" onclick="online.signInWithGoogle()"><svg viewBox="0 0 24 24" width="18" height="18" style="margin-right:8px;vertical-align:middle"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>Sign in with Google</button>
          <div class="divider-or"><span>or with email</span></div>
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

  renderUpgradesPage(el) {
    const s = this.engine.state;
    const pRank = s._prestigeRank || 0;
    const prestigeCfg = GAME_DATA.prestige;
    const nextRank = pRank + 1;
    const nextRankData = prestigeCfg?.ranks?.[pRank];
    const can = this.engine.canPrestige();
    const tl = this.engine.getTotalLevel();
    const maxTl = Object.keys(s.skills).length * 99;

    let html = this.header('Upgrades','sparkle','Character progression and permanent bonuses.',null);

    // Prestige section
    html += `<div class="prestige-quick-panel">
      <div class="pqp-header">
        <span>${pRank > 0 ? `Prestige Rank ${pRank}` : 'Prestige — Unlock Rank 1'}</span>
        ${pRank > 0 && nextRankData ? `<span class="pqp-next">Next: ${nextRankData.name}</span>` : ''}
      </div>
      <div class="pqp-bar-row">
        <div class="pqp-label">Total Level</div>
        <div class="pqp-bar"><div class="pqp-fill" style="width:${(tl/maxTl*100).toFixed(1)}%"></div></div>
        <div class="pqp-val">${tl} / ${maxTl}</div>
      </div>`;

    if (can.ok) {
      html += `<div class="pqp-ready" style="margin-top:12px;padding:8px;background:rgba(42,106,42,0.3);border:1px solid #4a8a3e;border-radius:4px;color:#4a8a3e">
        ✅ Ready to Prestige! Click below to unlock permanent bonuses.
      </div>
      <button class="btn prestige-btn" style="margin-top:12px;width:100%" onclick="ui.currentPage='prestige';ui.renderPage('prestige')">
        ${nextRankData?.icon||'⭐'} Unlock ${nextRankData?.name || 'Next Rank'}
      </button>`;
    } else {
      html += `<div class="pqp-locked" style="margin-top:12px;padding:8px;background:rgba(196,64,64,0.2);border:1px solid #c44040;border-radius:4px;color:#c44040;font-size:12px">
        ${can.reason}
      </div>`;
    }

    html += `</div>`;

    // Permanent bonuses display
    if (pRank > 0) {
      const currentBonuses = [];
      for (let i = 0; i < pRank; i++) {
        const r = prestigeCfg.ranks[i];
        if (r && r.bonuses) {
          for (const [k,v] of Object.entries(r.bonuses)) {
            currentBonuses.push({ type:k, value:v, rank:i+1 });
          }
        }
      }

      html += `<h2 class="section-title">Active Bonuses</h2>`;
      html += `<div class="upgrades-bonuses-grid">`;
      for (const b of currentBonuses) {
        const labels = {
          xpMult:'XP Multiplier',
          goldMult:'Gold Multiplier',
          dropMult:'Loot Multiplier',
          dmgMult:'Damage Multiplier',
          startLevel:'Starting Skill Level'
        };
        const label = labels[b.type] || b.type;
        const display = typeof b.value === 'number' && b.value < 1 ? `+${(b.value*100).toFixed(0)}%` : `+${b.value}`;
        html += `<div class="upgrade-bonus-card">
          <div class="ubc-label">${label}</div>
          <div class="ubc-value">${display}</div>
          <div class="ubc-source">Rank ${b.rank}</div>
        </div>`;
      }
      html += `</div>`;
    }

    // Upcoming ranks preview
    html += `<h2 class="section-title">Prestige Ranks</h2>`;
    html += `<div class="prestige-ranks-preview">`;
    for (let i = 0; i < (prestigeCfg?.ranks?.length || 5); i++) {
      const r = prestigeCfg.ranks[i];
      const unlocked = pRank > i;
      html += `<div class="prp-card ${unlocked?'prp-unlocked':''}">
        <div class="prp-icon">${r.icon}</div>
        <div class="prp-name">${r.name}</div>
        <div class="prp-bonus">${Object.entries(r.bonuses).map(([k,v])=>`${k}: ${typeof v==='number'&&v<1?(v*100).toFixed(0)+'%':v}`).join(' | ')}</div>
        ${unlocked?'<div class="prp-check">✓</div>':''}
      </div>`;
    }
    html += `</div>`;

    el.innerHTML = html;
  }

  renderActivityPage(el) {
    const s = this.engine.state;
    
    // Check if logging system is available
    const hasLogger = typeof gameLogger !== 'undefined' && gameLogger.events;
    
    let html = this.header('Activity Log','scroll','Real-time tracking of all game events.',null);
    
    // Session stats
    const sessionTime = Math.floor((Date.now() - (this.sessionStart || Date.now())) / 1000);
    const hours = Math.floor(sessionTime / 3600);
    const mins = Math.floor((sessionTime % 3600) / 60);

    html += `<div class="activity-summary">
      <div class="as-row"><span>Session Time</span><span>${hours}h ${mins}m</span></div>
      <div class="as-row"><span>Total Events</span><span>${hasLogger ? gameLogger.events.length : '?'}</span></div>
      <div class="as-row"><span>Total Kills</span><span>${this.fmt(s.stats?.monstersKilled || 0)}</span></div>
      <div class="as-row"><span>Total Gold</span><span>${this.fmt(s.stats?.goldEarned || 0)}</span></div>
    </div>`;

    // Recent events from logger (if available)
    if (hasLogger && gameLogger.events.length > 0) {
      const recentEvents = gameLogger.getEvents({ limit: 20 });
      
      html += `<h2 class="section-title">Recent Events</h2>`;
      html += `<div class="activity-events-list" id="activity-events-live">`;
      
      for (const evt of recentEvents) {
        const timeAgo = this._getTimeAgo(evt.timestamp);
        const skillTag = evt.data && evt.data.skill ? `<span class="ae-skill">${evt.data.skill}</span>` : '';
        html += `<div class="activity-event-row ae-${evt.category}">
          <span class="ae-icon">${evt.icon || '•'}</span>
          <span class="ae-message">${evt.message}${skillTag}</span>
          <span class="ae-time">${timeAgo}</span>
        </div>`;
      }
      
      html += `</div>`;
    }

    // Skill activity breakdown
    html += `<h2 class="section-title">Skill Progress</h2>`;
    html += `<div class="activity-skills">`;
    
    const skillOrder = ['attack','strength','defence','hitpoints','ranged','magic','prayer','slayer','necromancy','woodcutting','mining','fishing','foraging','hunting','agility','cooking','smithing','fletching','crafting','alchemy','enchanting','incantation','farming','thieving','tactics','trading','diplomacy','summoning'];
    
    for (const sId of skillOrder) {
      const sk = s.skills[sId];
      if (!sk || sk.level === 1) continue;
      const skillDef = GAME_DATA.skills[sId];
      const xpProg = this.engine.getXpProgress(sId);
      
      html += `<div class="as-skill-row">
        <div class="as-skill-name">${icon(skillDef?.icon || 'sparkle', 14)} ${skillDef?.name || sId}</div>
        <div class="as-skill-level">${sk.level}</div>
        <div class="as-skill-bar"><div class="as-skill-fill" style="width:${(xpProg*100).toFixed(1)}%"></div></div>
        <div class="as-skill-xp">${this.fmt(sk.xp)}</div>
      </div>`;
    }
    
    html += `</div>`;

    el.innerHTML = html;
    
    // Set up real-time updates if logger available
    if (hasLogger && gameLogger.on) {
      gameLogger.on('eventLogged', () => {
        if (this.currentPage === 'activity') {
          this._updateActivityLog();
        }
      });
    }
  }

  setActivitySearch(term) {
    this._activitySearch = term;
    this.renderPage('activity');
  }

  _updateActivityLog() {
    const logEl = document.getElementById('activity-events-live');
    if (!logEl || typeof gameLogger === 'undefined') return;

    const events = gameLogger.getEvents({ limit: 20 });
    if (events.length === 0) {
      logEl.innerHTML = `<div class="bank-empty">No events yet. Start playing!</div>`;
      return;
    }

    logEl.innerHTML = events.map(evt => {
      const timeAgo = this._getTimeAgo(evt.timestamp);
      const skillTag = evt.data && evt.data.skill ? `<span class="ae-skill">${evt.data.skill}</span>` : '';
      return `<div class="activity-event-row ae-${evt.category}">
        <span class="ae-icon">${evt.icon || '•'}</span>
        <span class="ae-message">${evt.message}${skillTag}</span>
        <span class="ae-time">${timeAgo}</span>
      </div>`;
    }).join('');
  }

  _getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) return 'now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours/24)}d ago`;
  }

  async cloudLoad() {
    if (typeof online === 'undefined' || !online.isOnline) return;
    const save = await online.loadFromCloud();
    if (save) {
      if (confirm('Load cloud save? This will overwrite your local progress.')) {
        game.migrateSave(save); // sets game.state and migrates
        game.save(); // persist to localStorage
        this.toast({ type:'success', text:'Cloud save loaded!' });
        this.renderSidebar();
        this.renderPage(this.currentPage);
      }
    } else {
      this.toast({ type:'warn', text:'No cloud save found. Save to cloud first.' });
    }
  }

  // ── CHAT PAGE ──────────────────────────────────────────
  renderChatPage(el) {
    const isOnline = typeof online !== 'undefined' && online.isOnline;
    let html = '';

    if (!isOnline) {
      html = this.header('Global Chat','scroll','Talk to other survivors.',null);
      html += '<div class="bank-empty">Sign in to use chat.</div>';
      el.innerHTML = html; return;
    }

    const isAdmin = typeof ADMIN_UIDS !== 'undefined' && ADMIN_UIDS.includes(online.user?.uid);
    const cb = this.engine.getCombatLevel();
    const channel = this._chatChannel || 'general';
    const channels = [
      { id:'general', label:'General', desc:'Open discussion' },
      { id:'trade', label:'Trade', desc:'Buy, sell, barter' },
      { id:'lfg', label:'LFG', desc:'Looking for group' },
      { id:'pvp', label:'PvP', desc:'Arena & wilderness' },
    ];

    html += `<div class="gchat-container">
      <div class="gchat-header">
        <div class="gchat-title">
          <svg viewBox="0 0 20 20" width="18" height="18" style="vertical-align:middle;margin-right:6px"><circle cx="10" cy="10" r="8" fill="none" stroke="var(--accent)" stroke-width="1.5"/><circle cx="10" cy="10" r="3" fill="var(--accent)"/><path d="M10 2 V4 M10 16 V18 M2 10 H4 M16 10 H18" stroke="var(--accent)" stroke-width="1" opacity="0.5"/></svg>
          Global Chat
        </div>
        <div class="gchat-user">
          <span class="gchat-dot"></span>
          <span class="gchat-uname">${online.displayName}</span>
          <span class="gchat-ulevel">Cb${cb}</span>
        </div>
      </div>
      <div class="gchat-channels">
        ${channels.map(c => `<button class="gchat-ch-tab ${channel===c.id?'gchat-ch-active':''}" onclick="ui._switchChatChannel('${c.id}')" title="${c.desc}">${c.label}</button>`).join('')}
      </div>
      <div id="chat-messages" class="gchat-messages"></div>
      <div class="gchat-input-area">
        ${isAdmin ? '<div class="gchat-admin-bar"><span class="gchat-admin-tag">ADMIN</span> /give /xp /announce /clear /mute /broadcast</div>' : ''}
        <div class="gchat-hint">Commands: /me [action], /roll [max]</div>
        <div class="gchat-input-row">
          <input type="text" id="chat-input" class="gchat-input" placeholder="${isAdmin?'Admin commands: /help':`Chat in #${channel}...`}" maxlength="300" onkeydown="if(event.key==='Enter')ui.sendChat()" autocomplete="off">
          <button class="gchat-send" onclick="ui.sendChat()">
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M2 21L23 12 2 3 2 10 17 12 2 14z" fill="var(--accent)"/></svg>
          </button>
        </div>
      </div>
    </div>`;

    // Player action popup (hidden by default)
    html += `<div id="gchat-player-popup" class="gchat-player-popup" style="display:none">
      <div class="gpp-name" id="gpp-name"></div>
      <div class="gpp-level" id="gpp-level"></div>
      <div class="gpp-btns">
        <button class="btn btn-xs" onclick="ui._chatAction('dm')">Message</button>
        <button class="btn btn-xs" onclick="ui._chatAction('gift')">Gift</button>
        <button class="btn btn-xs" onclick="ui._chatAction('friend')">Add Friend</button>
        <button class="btn btn-xs btn-danger" onclick="ui._chatAction('block')">Block</button>
      </div>
      <button class="gpp-close" onclick="document.getElementById('gchat-player-popup').style.display='none'">&times;</button>
    </div>`;

    el.innerHTML = html;
    this._startChatChannel(channel);
  }

  _switchChatChannel(channel) {
    this._chatChannel = channel;
    online.stopChatListener();
    this._startChatChannel(channel);
    const input = document.getElementById('chat-input');
    if (input) input.placeholder = `Chat in #${channel}...`;
    // Update active tab
    document.querySelectorAll('.gchat-ch-tab').forEach(t => t.classList.remove('gchat-ch-active'));
    document.querySelector(`.gchat-ch-tab[onclick*="${channel}"]`)?.classList.add('gchat-ch-active');
  }

  _startChatChannel(channel) {
    online.listenToChatChannel(channel, (msgs) => {
      const container = document.getElementById('chat-messages');
      if (!container) return;
      container.innerHTML = msgs.map(m => {
        const isMe = online.user && m.uid === online.user.uid;
        const isAdminMsg = typeof ADMIN_UIDS !== 'undefined' && ADMIN_UIDS.includes(m.uid);
        const time = m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : '';
        const isSys = m.system;
        const isEmote = m.emote;

        if (isSys) {
          return `<div class="gchat-sys"><span class="gchat-sys-icon">&#9733;</span> ${this.escHtml(m.text)} <span class="gchat-time">${time}</span></div>`;
        }
        if (isEmote) {
          return `<div class="gchat-emote"><span class="gchat-emote-name">${this.escHtml(m.name)}</span> ${this.escHtml(m.text)} <span class="gchat-time">${time}</span></div>`;
        }
        return `<div class="gchat-msg ${isMe?'gchat-mine':''} ${isAdminMsg?'gchat-admin':''}">
          <div class="gchat-avatar">${m.name?m.name[0].toUpperCase():'?'}</div>
          <div class="gchat-body">
            <div class="gchat-meta">
              ${isAdminMsg?'<span class="gchat-badge">ADMIN</span>':''}
              <span class="gchat-name ${isMe?'gchat-name-me':''}" onclick="ui._showPlayerPopup(event,'${m.uid}','${this.escHtml(m.name)}','${m.totalLevel||'?'}')" style="cursor:pointer">${this.escHtml(m.name)}</span>
              <span class="gchat-lvl">[${m.totalLevel||'?'}]</span>
              <span class="gchat-time">${time}</span>
            </div>
            <div class="gchat-text">${this._formatChatText(m.text)}</div>
          </div>
        </div>`;
      }).join('');
      container.scrollTop = container.scrollHeight;
    });
  }

  _formatChatText(text) {
    // Item links: [item_id] becomes clickable
    let safe = this.escHtml(text);
    safe = safe.replace(/\[([a-z_]+)\]/g, (match, itemId) => {
      const item = GAME_DATA.items[itemId];
      if (!item) return match;
      const rColor = this.getRarityColor(itemId);
      return `<span class="gchat-item-link" style="${rColor?'color:'+rColor:''}" title="${item.name}">[${item.name}]</span>`;
    });
    return safe;
  }

  _showPlayerPopup(event, uid, name, level) {
    if (uid === online.user?.uid) return;
    const popup = document.getElementById('gchat-player-popup');
    if (!popup) return;
    this._chatPopupTarget = { uid, name };
    document.getElementById('gpp-name').textContent = name;
    document.getElementById('gpp-level').textContent = `Total Level: ${level}`;
    popup.style.display = 'flex';
    // Position near click
    const rect = event.target.getBoundingClientRect();
    popup.style.top = (rect.bottom + 4) + 'px';
    popup.style.left = Math.min(rect.left, window.innerWidth - 200) + 'px';
  }

  async _chatAction(action) {
    const target = this._chatPopupTarget;
    if (!target) return;
    document.getElementById('gchat-player-popup').style.display = 'none';
    if (action === 'dm') { this.openDM(target.uid, target.name); }
    else if (action === 'gift') { this.openGiftDialog(target.uid, target.name); }
    else if (action === 'friend') { await online.sendFriendRequest(target.name); }
    else if (action === 'block') { await online.blockPlayer(target.uid, target.name); }
  }

  sendChat() {
    const input = document.getElementById('chat-input');
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    input.value = '';

    // Admin commands
    const isAdmin = typeof ADMIN_UIDS !== 'undefined' && ADMIN_UIDS.includes(online.user?.uid);
    if (isAdmin && text.startsWith('/') && !text.startsWith('/me') && !text.startsWith('/roll')) {
      this.handleAdminCommand(text);
      return;
    }

    online.sendChatMessage(text, this._chatChannel || 'general');
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
  renderWildernessPage(el) {
    const s = this.engine.state;
    const cb = this.engine.getCombatLevel();
    const skull = s._wildSkull || null;
    const skullTimeLeft = skull && skull.expiresAt > Date.now() ? Math.max(0, Math.ceil((skull.expiresAt - Date.now())/1000)) : 0;
    const isInWild = s.combat.active && s.combat._isWilderness;
    const isSkullied = skullTimeLeft > 0;

    let html = this.header('Wilderness','skull','The lawless zone north of the settlement. High risk, high reward. Real players hunt here.','wilderness');

    // ── SKULL STATUS BANNER ───────────────────────────────────
    if (isSkullied) {
      const m = Math.floor(skullTimeLeft/60), sc = skullTimeLeft%60;
      html += `<div class="wild-skull-banner">
        <span class="wsb-icon">💀</span>
        <div>
          <div class="wsb-title">YOU ARE SKULLED</div>
          <div class="wsb-desc">If you die, you lose all items. ${m}m ${sc}s remaining.</div>
        </div>
        <div class="wsb-timer" id="skull-timer">${m}m ${sc}s</div>
      </div>`;
    }

    // ── WILDERNESS RULES ──────────────────────────────────────
    html += `<div class="wild-rules-strip">
      <div class="wrs-rule"><span class="wrs-icon">⚔</span><div><strong>PvP Risk</strong><div class="wrs-desc">Other players can attack you in wilderness zones. Combat level bracket limits who can attack you (±15 cb).</div></div></div>
      <div class="wrs-rule"><span class="wrs-icon">💀</span><div><strong>Death Penalty</strong><div class="wrs-desc">Unskulled: keep 3 most valuable items. Skulled: lose everything. Your killer loots what you drop.</div></div></div>
      <div class="wrs-rule"><span class="wrs-icon">📦</span><div><strong>High Rewards</strong><div class="wrs-desc">Wilderness monsters drop rare loot and more gold. The deeper you go, the better the rewards.</div></div></div>
      <div class="wrs-rule"><span class="wrs-icon">🏃</span><div><strong>Escape Options</strong><div class="wrs-desc">TeleHome spell (3 Fire + 5 Air runes) or run to safety. PKers can cast TeleBlock to stop you.</div></div></div>
    </div>`;

    // ── WHAT I KEEP ON DEATH ──────────────────────────────────
    if (!isSkullied) {
      // Calculate 3 most valuable items player keeps
      const allItems = [];
      // Equipped items
      for (const [slot, id] of Object.entries(s.equipment || {})) {
        if (id) { const it = GAME_DATA.items[id]; if (it) allItems.push({id, name:it.name, val:it.sellPrice||0, slot}); }
      }
      // Bank items (top by value)
      for (const [id, qty] of Object.entries(s.bank || {})) {
        if (qty > 0) { const it = GAME_DATA.items[id]; if (it && it.sellPrice > 100) allItems.push({id, name:it.name, val:(it.sellPrice||0)*qty, slot:'bank', qty}); }
      }
      allItems.sort((a,b) => b.val - a.val);
      const keeping = allItems.slice(0,3);
      if (keeping.length > 0) {
        html += `<div class="wild-keep-strip">
          <div class="wks-title">If you die (unskulled) you keep:</div>
          <div class="wks-items">${keeping.map(it=>`<span class="wks-item">${it.name}${it.qty>1?' x'+it.qty:''}</span>`).join('')}</div>
        </div>`;
      }
    }

    // ── SUPPLIES CHECK ────────────────────────────────────────
    const runes = { fire: s.bank.fire_rune||0, air: s.bank.air_rune||0 };
    const canTeleHome = runes.fire >= 3 && runes.air >= 5;
    html += `<div class="wild-supplies-strip">
      <div class="wss-item ${canTeleHome?'wss-ok':'wss-warn'}">
        ${canTeleHome?'✓':'⚠'} TeleHome: ${runes.fire} Fire + ${runes.air} Air runes ${canTeleHome?'(Ready)':'(Need 3 Fire + 5 Air)'}
      </div>
      <div class="wss-item ${(s.bank.antipoison||0)>0?'wss-ok':'wss-dim'}">
        ${(s.bank.antipoison||0)>0?'✓':'—'} Antipoison: x${s.bank.antipoison||0}
      </div>
      <div class="wss-item ${(s.bank.cooked_shark||0)>0||(s.bank.cooked_lobster||0)>0?'wss-ok':'wss-dim'}">
        ${(s.bank.cooked_shark||0)+(s.bank.cooked_lobster||0)>0?'✓':'—'} Food: ${(s.bank.cooked_shark||0)+(s.bank.cooked_lobster||0)} pieces
      </div>
      <div class="wss-item ${(s.bank.prayer_potion||0)>0?'wss-ok':'wss-dim'}">
        ${(s.bank.prayer_potion||0)>0?'✓':'—'} Prayer pots: x${s.bank.prayer_potion||0}
      </div>
    </div>`;

    // ── WILDERNESS ZONES ──────────────────────────────────────
    html += `<h2 class="section-title">Wilderness Zones</h2>`;
    html += `<div class="wild-zones-grid">`;

    const zoneData = [
      { id:'wild_1', name:'The Wastes', level:'1-10', subtitle:'Scorched grasslands north of the settlement wall.',
        monsters:[{id:'bandit',name:'Bandit',cb:12},{id:'wolf',name:'Dire Wolf',cb:18},{id:'skeleton',name:'Skeleton Warrior',cb:14}],
        drops:'Bones, basic potions, steel gear', pvpRisk:'Low (5%)', color:'#4a8a3e', icon:'🌾',
        rewards:'150-400 gp/kill', minCb:1 },
      { id:'wild_2', name:'Ashfall Corridor', level:'10-25', subtitle:'A cracked road through toxic ashfall debris.',
        monsters:[{id:'dark_wizard',name:'Dark Wizard',cb:22},{id:'hill_giant',name:'Hill Giant',cb:28},{id:'moss_giant',name:'Moss Giant',cb:42}],
        drops:'Death runes, mithril bars, gems', pvpRisk:'Medium (8%)', color:'#d4a83a', icon:'🌋',
        rewards:'400-900 gp/kill', minCb:10 },
      { id:'wild_3', name:'The Demon Roads', level:'25-45', subtitle:'Ancient trade routes now patrolled by demon scouts.',
        monsters:[{id:'lesser_demon',name:'Lesser Demon',cb:48},{id:'hellhound',name:'Hellhound',cb:62},{id:'gargoyle',name:'Gargoyle',cb:75}],
        drops:'Adamant bars, dragon bones, rune items', pvpRisk:'High (10%)', color:'#c44040', icon:'🔥',
        rewards:'800-2000 gp/kill', minCb:25 },
      { id:'wild_4', name:'The Void Breach', level:'45-65', subtitle:'Where the Ashfall first cracked the world open. The void bleeds through here.',
        monsters:[{id:'gargoyle',name:'Gargoyle',cb:75},{id:'steel_dragon',name:'Steel Dragon',cb:95},{id:'void_titan',name:'Void Titan',cb:100}],
        drops:'Rune items, void crystals, draconic visage', pvpRisk:'Very High (12%)', color:'#8a2ae0', icon:'⚡',
        rewards:'1500-5000 gp/kill', minCb:45 },
      { id:'wild_5', name:'Deep Wilderness', level:'65+', subtitle:'No one comes back from here the same. Most never return.',
        monsters:[{id:'demon_lord',name:'Demon Lord',cb:120},{id:'ash_titan',name:'Ash Titan',cb:135},{id:'void_emperor_spawn',name:'Void Emperor Spawn',cb:160}],
        drops:'Elder cores, titan shards, void emperor gear', pvpRisk:'Extreme (15%)', color:'#ff2a2a', icon:'💀',
        rewards:'3000-12000 gp/kill', minCb:65 },
    ];

    for (const zone of zoneData) {
      const locked = cb < zone.minCb;
      const monsterBtns = zone.monsters.map(m => {
        if (locked) return '';
        return `<button class="wild-mon-btn" onclick="game.startWildernessCombat('${zone.id}','${m.id}')" title="Combat Level ${m.cb}">
          <span>${m.name}</span><span class="wmb-cb">Cb ${m.cb}</span>
        </button>`;
      }).join('');

      html += `<div class="wild-zone-card ${locked?'wzc-locked':''}" style="--zone-color:${zone.color}">
        <div class="wzc-header">
          <div class="wzc-icon">${zone.icon}</div>
          <div class="wzc-info">
            <div class="wzc-name">${zone.name}</div>
            <div class="wzc-sub">${zone.subtitle}</div>
          </div>
          <div class="wzc-level">Lv ${zone.level}</div>
        </div>
        <div class="wzc-stats">
          <div class="wzc-stat"><span class="wzcs-label">PvP Risk</span><span class="wzcs-val" style="color:${zone.color}">${zone.pvpRisk}</span></div>
          <div class="wzc-stat"><span class="wzcs-label">Rewards</span><span class="wzcs-val" style="color:#c9873e">${zone.rewards}</span></div>
          <div class="wzc-stat"><span class="wzcs-label">Drops</span><span class="wzcs-val">${zone.drops}</span></div>
        </div>
        ${!locked ? `<div class="wzc-monsters">${monsterBtns}</div>` : `<div class="wzc-lock">Combat ${zone.minCb}+ required</div>`}
      </div>`;
    }
    html += '</div>';

    // ── PvP KILLS LEADERBOARD ─────────────────────────────────
    html += `<div class="wild-two-col">`;

    // My stats
    html += `<div class="wild-stat-box">
      <div class="wsb-header">Your Wilderness Record</div>
      <div class="wsb-row"><span>PvP Kills</span><span style="color:#c44040;font-weight:700">${s.stats.pvpKills||0}</span></div>
      <div class="wsb-row"><span>Deaths</span><span>${s.stats.pvpDeaths||0}</span></div>
      <div class="wsb-row"><span>K/D Ratio</span><span>${(s.stats.pvpDeaths||0)>0?((s.stats.pvpKills||0)/(s.stats.pvpDeaths)).toFixed(2):'—'}</span></div>
      <div class="wsb-row"><span>Kill Streak</span><span style="color:#c9873e">${s.stats.pvpStreak||0}</span></div>
      <div class="wsb-row"><span>Best Streak</span><span>${s.stats.pvpBestStreak||0}</span></div>
      <div class="wsb-row"><span>Gold Looted</span><span style="color:#d4a83a">${this.fmt(s.stats.pvpGoldLooted||0)}</span></div>
    </div>`;

    // Loot table
    html += `<div class="wild-stat-box">
      <div class="wsb-header">PvP Loot Table (on kill)</div>
      ${(GAME_DATA.pvpLoot||[]).map(entry => {
        const it = GAME_DATA.items[entry.item];
        return `<div class="wsb-row">
          <span>${it?.name||entry.item} x${entry.qty}</span>
          <span style="color:#c9873e">${(entry.chance*100).toFixed(0)}%</span>
        </div>`;
      }).join('')}
    </div>`;
    html += '</div>';

    // ── ACTIVE PLAYERS IN WILDERNESS ──────────────────────────
    html += `<h2 class="section-title">Players Online in Wilderness</h2>
      <div id="wild-players-list"><div class="bank-empty">Scanning wilderness...</div></div>`;

    el.innerHTML = html;

    // Load active players async
    if (typeof online !== 'undefined' && online.isOnline) {
      Promise.all(zoneData.map(z => online.getPlayersInZone(z.id))).then(results => {
        const all = results.flat();
        const container = document.getElementById('wild-players-list');
        if (!container) return;
        if (all.length === 0) {
          container.innerHTML = '<div class="bank-empty">No players currently in the wilderness.</div>';
          return;
        }
        container.innerHTML = `<div class="wild-players-grid">${all.map(p =>
          `<div class="wild-player-chip">
            <span class="wpc-name">${this.escHtml(p.name||'Unknown')}</span>
            <span class="wpc-cb">Cb ${p.combatLevel||'?'}</span>
            <span class="wpc-zone">${zoneData.find(z=>z.id===p.zone)?.name||p.zone||'Unknown zone'}</span>
          </div>`
        ).join('')}</div>`;
      });
    } else {
      const c = document.getElementById('wild-players-list');
      if (c) c.innerHTML = '<div class="bank-empty">Sign in to see other players in the wilderness.</div>';
    }

    // Skull countdown
    if (isSkullied) {
      const _skullInterval = setInterval(() => {
        const left = Math.max(0, Math.ceil(((s.combat._skull?.expiresAt||0) - Date.now())/1000));
        const el2 = document.getElementById('skull-timer');
        if (el2) el2.textContent = Math.floor(left/60)+'m '+left%60+'s';
        if (left <= 0) { clearInterval(_skullInterval); ui.renderPage('wilderness'); }
      }, 1000);
    }
  }

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
    let html = this.header('Bounty Board','coin','Place contracts on players or monsters. Complete them to earn gold.',null);

    if (!isOnline) {
      html += '<div class="bank-empty">Sign in to use the Bounty Board.</div>';
      el.innerHTML = html; return;
    }

    const tab = this._bountyTab || 'all';
    const s = this.engine.state;

    html += `<div class="bounty-tabs">
      <button class="bounty-tab ${tab==='all'?'active':''}" onclick="ui._bountyTab='all';ui._bountyRefresh()">All</button>
      <button class="bounty-tab ${tab==='pvp'?'active':''}" onclick="ui._bountyTab='pvp';ui._bountyRefresh()">⚔ PvP</button>
      <button class="bounty-tab ${tab==='monster'?'active':''}" onclick="ui._bountyTab='monster';ui._bountyRefresh()">💀 Monster</button>
      <button class="bounty-tab ${tab==='gather'?'active':''}" onclick="ui._bountyTab='gather';ui._bountyRefresh()">🌿 Gather</button>
      <button class="bounty-tab ${tab==='mine'?'active':''}" onclick="ui._bountyTab='mine';ui._bountyRefresh()">📜 Mine</button>
    </div>`;

    // ── POST PANEL (no script tag — uses onclick bound to ui methods) ─────
    html += `<div class="bounty-post-panel" id="bb-panel">
      <div class="bounty-post-header" onclick="document.getElementById('bb-panel').classList.toggle('open')">
        <span>+ Post a Bounty</span>
        <span class="bp-gold">Balance: ${this.fmt(s.gold)}g</span>
      </div>
      <div class="bounty-post-body">
        <div class="bp-type-row">
          <label>Type:</label>
          <select id="bb-type" class="chat-input" onchange="ui.bbTypeChange()" style="flex:1">
            <option value="pvp">⚔ PvP Bounty — Kill a specific player</option>
            <option value="monster">💀 Monster Contract — Kill N monsters</option>
            <option value="gather">🌿 Gather Contract — Gather N items</option>
          </select>
        </div>

        <div id="bb-pvp-fields">
          <div class="bp-row">
            <label>Target Player:</label>
            <div style="flex:1;position:relative">
              <input type="text" id="bb-target-name" class="chat-input" placeholder="Search player name..." oninput="ui.bbSearchPlayers(this.value)" autocomplete="off" style="width:100%">
              <div id="bb-player-results" class="bb-player-dropdown" style="display:none"></div>
            </div>
          </div>
        </div>

        <div id="bb-monster-fields" style="display:none">
          <div class="bp-row">
            <label>Monster:</label>
            <select id="bb-monster-id" class="chat-input" style="flex:1">
              ${Object.entries(GAME_DATA.monsters).filter(([,m])=>m.name&&m.combatLevel).sort((a,b)=>(a[1].combatLevel||0)-(b[1].combatLevel||0)).map(([id,m])=>`<option value="${id}">Cb${m.combatLevel} ${this.escHtml(m.name)}</option>`).join('')}
            </select>
          </div>
          <div class="bp-row">
            <label>Kill Count:</label>
            <input type="number" id="bb-monster-qty" class="chat-input" min="1" max="1000" value="25" style="width:120px">
          </div>
        </div>

        <div id="bb-gather-fields" style="display:none">
          <div class="bp-row">
            <label>Item:</label>
            <select id="bb-item-id" class="chat-input" style="flex:1">
              ${Object.entries(GAME_DATA.items).filter(([,it])=>it&&(it.type==='resource'||it.type==='ore'||it.type==='log'||it.subtype==='herb')).sort((a,b)=>(a[1].name||'').localeCompare(b[1].name||'')).map(([id,it])=>`<option value="${id}">${this.escHtml(it.name)}</option>`).join('')}
            </select>
          </div>
          <div class="bp-row">
            <label>Gather Amount:</label>
            <input type="number" id="bb-gather-qty" class="chat-input" min="1" max="5000" value="100" style="width:120px">
          </div>
        </div>

        <div class="bp-row">
          <label>Reward (g):</label>
          <input type="number" id="bb-amount" class="chat-input" placeholder="Min 500g" min="500" style="width:130px">
          <div class="bp-quick-btns">
            <button class="btn btn-xs" onclick="document.getElementById('bb-amount').value=1000">1k</button>
            <button class="btn btn-xs" onclick="document.getElementById('bb-amount').value=5000">5k</button>
            <button class="btn btn-xs" onclick="document.getElementById('bb-amount').value=25000">25k</button>
            <button class="btn btn-xs" onclick="document.getElementById('bb-amount').value=100000">100k</button>
          </div>
        </div>

        <div class="bp-row">
          <label>Duration:</label>
          <select id="bb-duration" class="chat-input" style="width:160px">
            <option value="3600000">1 hour</option>
            <option value="21600000">6 hours</option>
            <option value="86400000" selected>24 hours</option>
            <option value="259200000">3 days</option>
            <option value="604800000">7 days</option>
          </select>
        </div>

        <button class="btn btn-primary" onclick="ui.submitBounty()">Post Bounty</button>
      </div>
    </div>`;

    html += `<div class="bounty-list-section">
      <div class="bounty-list-header">
        <span class="section-title">${tab==='mine'?'My Bounties':'Active Bounties'}</span>
        <span class="bounty-live-badge">● LIVE</span>
      </div>
      <div id="bounty-list"><div class="bank-empty">Loading...</div></div>
    </div>`;

    el.innerHTML = html;
    this._startBountyListener();
  }

  bbTypeChange() {
    const t = document.getElementById('bb-type')?.value;
    if (!t) return;
    document.getElementById('bb-pvp-fields').style.display     = t==='pvp'     ? '' : 'none';
    document.getElementById('bb-monster-fields').style.display = t==='monster' ? '' : 'none';
    document.getElementById('bb-gather-fields').style.display  = t==='gather'  ? '' : 'none';
  }

  async bbSearchPlayers(query) {
    const dropdown = document.getElementById('bb-player-results');
    if (!dropdown) return;
    if (!query || query.length < 2) { dropdown.style.display = 'none'; return; }
    const results = await online.searchPlayers(query);
    if (!results.length) { dropdown.style.display = 'none'; return; }
    dropdown.innerHTML = results.map(p =>
      `<div class="bb-player-option" onclick="ui.bbSelectPlayer('${this.escHtml(p.name)}')">
        <span class="bb-player-name">${this.escHtml(p.name)}</span>
        <span class="bb-player-stats">Cb ${p.combatLevel} | Lv ${p.totalLevel}</span>
      </div>`
    ).join('');
    dropdown.style.display = 'block';
  }

  bbSelectPlayer(name) {
    const inp = document.getElementById('bb-target-name');
    if (inp) inp.value = name;
    const drop = document.getElementById('bb-player-results');
    if (drop) drop.style.display = 'none';
  }

  async submitBounty() {
    const type     = document.getElementById('bb-type')?.value;
    const amount   = parseInt(document.getElementById('bb-amount')?.value || 0);
    const duration = parseInt(document.getElementById('bb-duration')?.value || 86400000);
    const opts = { type, amount, duration };
    if (type === 'pvp')     { opts.targetName = document.getElementById('bb-target-name')?.value?.trim(); }
    if (type === 'monster') { opts.monsterId  = document.getElementById('bb-monster-id')?.value; opts.qty = parseInt(document.getElementById('bb-monster-qty')?.value || 0); }
    if (type === 'gather')  { opts.itemId     = document.getElementById('bb-item-id')?.value;    opts.qty = parseInt(document.getElementById('bb-gather-qty')?.value || 0); }
    await online.placeBounty(opts);
    // Listener will auto-refresh; collapse panel
    document.getElementById('bb-panel')?.classList.remove('open');
  }

  _bountyRefresh() {
    // Stop old listener, re-render page which starts fresh listener
    this._stopBountyListener();
    this.renderPage('bounty_board');
  }

  _stopBountyListener() {
    if (this._bountyUnsub) { try { this._bountyUnsub(); } catch(e){} this._bountyUnsub = null; }
  }

  _startBountyListener() {
    this._stopBountyListener();
    if (typeof online === 'undefined' || !online.isOnline || !online.firestore) return;
    const tab = this._bountyTab || 'all';

    const renderCards = (docs) => {
      const container = document.getElementById('bounty-list');
      if (!container) { this._stopBountyListener(); return; }
      const now = new Date();
      let bounties = docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Client-side filter (avoids Firestore composite index requirement)
      if (tab !== 'mine') {
        bounties = bounties.filter(b => {
          if (b.claimed || b.cancelled) return false;
          const exp = b.expiresAt?.toDate ? b.expiresAt.toDate() : (b.expiresAt ? new Date(b.expiresAt) : null);
          if (exp && exp < now) return false;
          if (tab !== 'all' && b.type !== tab) return false;
          return true;
        });
      }
      bounties.sort((a, b) => (b.amount || 0) - (a.amount || 0));

      if (!bounties.length) {
        container.innerHTML = `<div class="bank-empty">${tab==='mine'?'No bounties posted yet.':'No active bounties — be the first!'}</div>`;
        return;
      }
      container.innerHTML = '<div class="bounty-cards">' + bounties.map(b => this._bountyCard(b)).join('') + '</div>';
    };

    try {
      let q;
      if (tab === 'mine') {
        q = online.firestore.collection('bounties')
          .where('placedBy', '==', online.user.uid)
          .limit(30);
      } else {
        q = online.firestore.collection('bounties')
          .where('claimed', '==', false)
          .limit(100);
      }
      this._bountyUnsub = q.onSnapshot(
        snap => renderCards(snap.docs),
        err  => {
          console.error('Bounty listener err:', err);
          const c = document.getElementById('bounty-list');
          if (c) c.innerHTML = '<div class="bank-empty">Failed to load bounties. Check console.</div>';
        }
      );
    } catch(e) {
      console.error('Failed to start bounty listener:', e);
    }
  }

  _bountyCard(b) {
    const now = new Date();
    const exp = b.expiresAt?.toDate ? b.expiresAt.toDate() : (b.expiresAt ? new Date(b.expiresAt) : null);
    const expired = exp && exp < now;
    const timeLeft = exp && !expired ? this._bountyTimeLeft(exp - now) : null;
    const isMine = typeof online !== 'undefined' && online.user?.uid === b.placedBy;
    const myProgress = (b.progress || {})[(typeof online !== 'undefined' && online.user?.uid) || ''] || 0;
    const progressPct = b.targetQty ? Math.min(100, Math.round(myProgress / b.targetQty * 100)) : 0;

    let typeIcon = '⚔', typeLabel = '', targetLabel = '', progressHtml = '', actionBtn = '';

    if (b.type === 'pvp' || !b.type) {
      typeIcon = '⚔'; typeLabel = 'PvP Bounty';
      targetLabel = `Target: <strong>${this.escHtml(b.targetName||'?')}</strong>`;
      const killed = (typeof online !== 'undefined' && online._sessionBountyKills)||[];
      const canClaim = killed.includes(b.targetName);
      actionBtn = canClaim
        ? `<button class="btn btn-sm bounty-claim" onclick="ui._claimBounty('${b.id}')">⚡ Claim Reward</button>`
        : `<div class="bounty-action-hint">Kill ${this.escHtml(b.targetName||'?')} in Wilderness to claim</div>`;
    } else if (b.type === 'monster') {
      typeIcon = '💀'; typeLabel = 'Monster Contract';
      const mName = GAME_DATA.monsters[b.monsterId]?.name || b.monsterId;
      targetLabel = `Kill <strong>${b.targetQty}x ${this.escHtml(mName)}</strong>`;
      progressHtml = `<div class="bounty-progress-row">
        <div class="bounty-prog-bar"><div class="bounty-prog-fill" style="width:${progressPct}%"></div></div>
        <span class="bounty-prog-text">${myProgress}/${b.targetQty} (${progressPct}%)</span>
      </div>`;
      actionBtn = myProgress >= b.targetQty
        ? `<button class="btn btn-sm bounty-claim" onclick="ui._claimBounty('${b.id}')">⚡ Claim ${this.fmt(b.amount)}g</button>`
        : `<div class="bounty-action-hint">Progress updates as you fight</div>`;
    } else if (b.type === 'gather') {
      typeIcon = '🌿'; typeLabel = 'Gather Contract';
      const itName = GAME_DATA.items[b.itemId]?.name || b.itemId;
      targetLabel = `Gather <strong>${b.targetQty}x ${this.escHtml(itName)}</strong>`;
      progressHtml = `<div class="bounty-progress-row">
        <div class="bounty-prog-bar"><div class="bounty-prog-fill" style="width:${progressPct}%"></div></div>
        <span class="bounty-prog-text">${myProgress}/${b.targetQty} (${progressPct}%)</span>
      </div>`;
      actionBtn = myProgress >= b.targetQty
        ? `<button class="btn btn-sm bounty-claim" onclick="ui._claimBounty('${b.id}')">⚡ Claim ${this.fmt(b.amount)}g</button>`
        : `<div class="bounty-action-hint">Gather ${b.itemId} to make progress</div>`;
    }

    const statusBadge = b.claimed ? '<span class="bounty-badge bounty-badge-claimed">Claimed</span>'
      : b.cancelled ? '<span class="bounty-badge bounty-badge-cancelled">Cancelled</span>'
      : expired ? '<span class="bounty-badge bounty-badge-expired">Expired</span>'
      : '<span class="bounty-badge bounty-badge-active">Active</span>';

    return `<div class="bounty-card ${b.claimed||b.cancelled||expired?'bounty-card-done':''}">
      <div class="bounty-card-top">
        <span class="bounty-type-icon">${typeIcon}</span>
        <div class="bounty-card-info">
          <div class="bounty-card-label">${typeLabel} ${statusBadge}</div>
          <div class="bounty-card-target">${targetLabel}</div>
          <div class="bounty-card-meta">
            <span class="bounty-poster">By ${this.escHtml(b.placedByName||'?')}</span>
            ${timeLeft ? `<span class="bounty-timer">⏱ ${timeLeft}</span>` : ''}
            ${b.claimedByName ? `<span class="bounty-claimer">Claimed by ${this.escHtml(b.claimedByName)}</span>` : ''}
          </div>
        </div>
        <div class="bounty-reward">${this.fmt(b.amount)}<span class="bounty-gold-label">g</span></div>
      </div>
      ${progressHtml}
      ${!b.claimed && !b.cancelled && !expired ? `<div class="bounty-card-actions">
        ${actionBtn}
        ${isMine ? `<button class="btn btn-xs bounty-cancel" onclick="ui._cancelBounty('${b.id}')">Cancel (75% refund)</button>` : ''}
      </div>` : ''}
    </div>`;
  }

  _bountyTimeLeft(ms) {
    if (ms <= 0) return 'Expired';
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    if (h > 24) return `${Math.floor(h/24)}d ${h%24}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }

  async loadBounties() {
    // Backward compat — now just restarts the real-time listener
    this._startBountyListener();
  }

  async _claimBounty(id) {
    const ok = await online.claimBounty(id);
    // listener auto-refreshes
  }

  async _cancelBounty(id) {
    await online.cancelBounty(id);
    // listener auto-refreshes
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

  showLootBag(d) {
    // ── PER-KILL FLASH ─────────────────────────────────────
    const existing = document.getElementById('loot-flash');
    if (existing) existing.remove();
    const arena = document.querySelector('.combat-arena');
    if (arena && d.bag && d.bag.length > 0) {
      const flash = document.createElement('div');
      flash.id = 'loot-flash';
      flash.className = 'loot-flash';

      // Header
      const header = document.createElement('div');
      header.className = 'loot-flash-header';
      header.textContent = d.monster ? `${d.monster} dropped` : 'Loot';
      flash.appendChild(header);

      // Items row
      const row = document.createElement('div');
      row.className = 'loot-flash-items';
      const rarityClass = { rare:'lf-rare', epic:'lf-epic', legendary:'lf-legendary', mythic:'lf-legendary' };
      const showItems = d.bag.slice(0, 6);
      for (const l of showItems) {
        const it = GAME_DATA.items[l.item];
        const rc = rarityClass[l.rarity] || '';
        const iconSvg = window.renderItemSprite ? window.renderItemSprite(l.item, 16) : '';
        const div = document.createElement('div');
        div.className = `lf-item ${rc}`;
        div.innerHTML = `<span class="lf-icon">${iconSvg}</span><span class="lf-qty">+${l.qty}</span><span class="lf-name">${it?.name||l.item}</span>`;
        row.appendChild(div);
      }
      // Gold
      if (d.sessionLoot?._gold) {
        const lastGold = this._lastSessionGold || 0;
        const thisGold = (d.sessionLoot._gold.qty || 0) - lastGold;
        this._lastSessionGold = d.sessionLoot._gold.qty || 0;
        if (thisGold > 0) {
          const gdiv = document.createElement('div');
          gdiv.className = 'lf-item lf-gold';
          gdiv.innerHTML = `<span class="lf-qty">+${this.fmt(thisGold)}</span><span class="lf-name">gp</span>`;
          row.appendChild(gdiv);
        }
      }
      flash.appendChild(row);
      arena.appendChild(flash);
      setTimeout(() => { if (flash.parentNode) flash.remove(); }, 3200);
    }

    // ── LIVE SESSION LOOT UPDATE ───────────────────────────
    const panel = document.getElementById('session-loot');
    if (panel && d.sessionLoot) {
      this._renderSessionLootPanel(panel, d.sessionLoot, d.kills || 0);
    }
  }

  _renderEqBonuses(s) {
    const G = this.engine.getStatTotal ? this.engine.getStatTotal.bind(this.engine) : () => 0;
    const bonuses = [
      {k:'attackBonus', label:'ATT', col:'#e0a060'},
      {k:'strengthBonus', label:'STR', col:'#e06060'},
      {k:'defenceBonus', label:'DEF', col:'#60a0e0'},
      {k:'rangedBonus', label:'RNG', col:'#60c060'},
      {k:'magicBonus', label:'MAG', col:'#a060e0'},
      {k:'damageReduction', label:'DR%', col:'#c0c060'},
    ];
    return bonuses.map(b => {
      const v = Math.round(G(b.k) || 0);
      return `<div class="eq-bonus-chip" style="color:${b.col}"><span class="eq-bonus-label">${b.label}</span><span class="eq-bonus-val">${v>0?'+':''}${v}</span></div>`;
    }).join('');
  }

  _renderXpRates(s, c) {
    if (!c._xpBySkill || !c._sessionStartTime) return '<div class="xr-empty">Fight to see XP rates</div>';
    const elapsed = (Date.now() - c._sessionStartTime) / 1000;
    if (elapsed < 5) return '<div class="xr-empty">Calculating...</div>';
    const skills = Object.entries(c._xpBySkill)
      .filter(([,xp]) => xp > 0)
      .sort((a,b) => b[1]-a[1]);
    return skills.map(([sk, xp]) => {
      const perHr = Math.round(xp / elapsed * 3600);
      const name = GAME_DATA.skills[sk]?.name || sk;
      return `<div class="xr-row"><span class="xr-skill">${name}</span><span class="xr-val" id="xr-${sk}">${this.fmt(perHr)}/hr</span></div>`;
    }).join('');
  }

  _renderSessionLootPanel(panel, sessionLoot, kills) {
    const rarOrder = { mythic:0, legendary:1, epic:2, rare:3, uncommon:4, common:5 };
    let html = `<div class="sl-header">
      <span class="sl-title">⚔ Session Loot</span>
      <span class="sl-kills">${kills} kills</span>
      <button class="sl-reset-btn" onclick="game.state.combat._sessionLoot={};game.state.combat._sessionKills=0;ui._lastSessionGold=0;ui.renderPage('combat')" title="Reset session loot">Reset</button>
    </div><div class="sl-items">`;
    // Gold first
    if (sessionLoot._gold?.qty > 0) {
      html += `<div class="sl-item sl-gold"><span class="sl-icon">🪙</span><span class="sl-name">Gold</span><span class="sl-qty">${this.fmt(sessionLoot._gold.qty)}</span></div>`;
    }
    const sorted = Object.entries(sessionLoot)
      .filter(([k]) => k !== '_gold')
      .sort((a,b) => (rarOrder[a[1].rarity]||5) - (rarOrder[b[1].rarity]||5));
    for (const [itemId, data] of sorted) {
      const it = GAME_DATA.items[itemId];
      const rc = data.rarity === 'legendary' || data.rarity === 'mythic' ? 'sl-legendary'
               : data.rarity === 'epic' ? 'sl-epic'
               : data.rarity === 'rare' ? 'sl-rare' : '';
      const iconSvg = window.renderItemSprite ? window.renderItemSprite(itemId, 14) : '';
      html += `<div class="sl-item ${rc}"><span class="sl-icon">${iconSvg}</span><span class="sl-name">${it?.name||itemId}</span><span class="sl-qty">x${data.qty}</span></div>`;
    }
    html += '</div>';
    panel.innerHTML = html;
  }

  _updateThievingHpBar(hp, maxHp) {
    const track = document.querySelector('.thiev-hp-fill');
    const val   = document.querySelector('.thiev-hp-val');
    if (!track || !val) return;
    const pct = Math.round((hp/maxHp)*100);
    const col = pct > 60 ? '#4abe6c' : pct > 30 ? '#d4a83a' : '#c44040';
    track.style.width  = pct + '%';
    track.style.background = col;
    val.textContent = `${hp}/${maxHp}`;
  }



  _updateMultiMobUI() {
    const mm = this.engine.state.multiMob;
    const c  = this.engine.state.combat;
    if (!mm?.active) return;

    // Main arena monster HP bar (normal combat bar, shows current target)
    const tgt  = mm.mobs[mm.targetIdx];
    if (tgt) {
      const mHp  = mm.hp[mm.targetIdx] || 0;
      const mMax = tgt.hp || 1;
      const mPct = Math.max(0, Math.min(100, (mHp/mMax)*100));
      const mCol = mPct > 50 ? '#8a3a3a' : mPct > 25 ? '#c4a83a' : '#4a8a3e';
      const mBar = document.getElementById('mhp-bar');
      const mTxt = document.getElementById('mhp-text');
      if (mBar) { mBar.style.width = mPct.toFixed(1)+'%'; mBar.style.background = mCol; }
      if (mTxt) mTxt.textContent = Math.max(0,Math.ceil(mHp)) + ' / ' + mMax;
    }

    // Player HP bar
    const maxHp = this.engine.getMaxHp();
    const pHp   = Math.max(0, c.playerHp || 0);
    const pPct  = Math.min(100, (pHp/maxHp)*100);
    const pCol  = pPct > 50 ? '#4a8a3e' : pPct > 25 ? '#c4a83a' : '#c44040';
    const pBar  = document.getElementById('php-bar');
    const pTxt  = document.getElementById('php-text');
    if (pBar) { pBar.style.width = pPct.toFixed(1)+'%'; pBar.style.background = pCol; }
    if (pTxt) pTxt.textContent = Math.floor(pHp) + ' / ' + maxHp;

    // Per-mob target cards
    for (let i = 0; i < mm.mobs.length; i++) {
      const hp    = mm.hp[i];
      const maxH  = mm.mobs[i].hp;
      const alive = mm.alive[i];
      const hPct  = alive ? Math.max(0, Math.min(100, (hp/maxH)*100)) : 0;
      const fill  = document.getElementById('mm-mhp-fill-'+i);
      const val   = document.getElementById('mm-mhp-val-'+i);
      if (fill) { fill.style.width = hPct.toFixed(1)+'%'; fill.style.opacity = alive ? '1' : '0.3'; }
      if (val)  val.textContent = alive ? Math.ceil(hp)+'/'+maxH : 'DEAD';
    }
  }

  showCannonFire(d) {
    // Show cannon hits as ranged splats with cannon indicator
    const area = document.getElementById('monster-splats');
    if (!area) return;
    const { hits, totalDmg, cannonballs } = d;
    // Show each hit
    hits.forEach((dmg, i) => {
      setTimeout(() => {
        const splat = document.createElement('div');
        if (dmg === 0) {
          splat.className = 'hit-splat splat-miss cannon-hit-flash';
          splat.textContent = 'MISS';
        } else {
          splat.className = `hit-splat splat-ranged cannon-hit-flash ${dmg >= 30 ? 'splat-big' : ''}`;
          splat.textContent = `⦿${dmg}`;
        }
        splat.style.left = (10 + Math.random() * 75) + '%';
        splat.style.top  = (5 + Math.random() * 40) + '%';
        area.appendChild(splat);
        setTimeout(() => { if (splat.parentNode) splat.remove(); }, 1200);
      }, i * 120);
    });
    // Update cannonball count in panel without full re-render
    const ballsEl = document.querySelector('.cannon-balls');
    if (ballsEl) ballsEl.textContent = `${(cannonballs||0).toLocaleString()} balls`;
    // Flash cannon panel
    const panel = document.querySelector('.cannon-panel');
    if (panel) {
      panel.style.borderColor = 'rgba(201,135,62,0.9)';
      setTimeout(() => { panel.style.borderColor = ''; }, 300);
    }
  }

  showPetAction(d) {
    // Attach to monster splats area so it floats over the monster, not the center
    const target = document.getElementById('monster-splats') || document.querySelector('.combat-arena');
    if (!target) return;
    const existing = document.getElementById('pet-action-flash');
    if (existing) existing.remove();
    const flash = document.createElement('div');
    flash.id = 'pet-action-flash';
    flash.className = 'pet-action-flash';
    const typeColor = { damage:'#d67338', heal:'#4abe6c', status:'#b585e0', debuff:'#d4a83a', pierce:'#7ac4e8', stun:'#d4a83a', slow:'#4a9ed4' };
    const color = typeColor[d.type] || '#c9873e';
    let text = `${d.pet?.name||'Pet'}: ${d.action||'attacks'}`;
    if (d.dmg)  text += ` ▶ ${d.dmg}`;
    if (d.heal) text += ` +${d.heal}hp`;
    flash.innerHTML = `<span class="pa-pet-name" style="color:${color}">${text}</span>`;
    flash.style.cssText += `;border-color:${color}50;`;
    target.appendChild(flash);
    setTimeout(() => { if (flash.parentNode) flash.remove(); }, 2000);
  }

  showHitSplat(d) {
    // Find the right splat area — also check theatre and fight cave pages
    let area;
    if (d.who === 'player') {
      area = document.getElementById('monster-splats') || document.getElementById('toa-monster-splats');
    } else {
      area = document.getElementById('player-splats') || document.getElementById('toa-player-splats');
    }
    if (!area) return;

    const splat = document.createElement('div');

    if (d.dodge || (d.miss && d.dodge)) {
      splat.className = 'hit-splat splat-dodge';
      splat.textContent = 'DODGE!';
    } else if (d.miss) {
      splat.className = 'hit-splat splat-miss';
      splat.textContent = 'MISS';
    } else if (d.who === 'monster') {
      // Damage taken — always red
      splat.className = `hit-splat splat-taken ${d.dmg >= 50 ? 'splat-big' : ''}`;
      splat.textContent = `-${d.dmg}`;
    } else {
      // Player dealt damage — color by type
      const style = d.style || this.engine.state.combat.combatStyle;
      let typeClass = '';
      let prefix = '';
      if (d.ability) {
        typeClass = 'splat-ability';
        prefix = '✦ ';
      } else if (style === 'burn') {
        typeClass = 'splat-burn';
        prefix = '🔥';
      } else if (style === 'poison') {
        typeClass = 'splat-poison';
        prefix = '☠';
      } else if (style === 'bleed') {
        typeClass = 'splat-bleed';
        prefix = '🩸';
      } else if (style === 'magic') {
        typeClass = 'splat-magic';
      } else if (style === 'ranged') {
        typeClass = 'splat-ranged';
      } else {
        typeClass = 'splat-melee';
      }
      const isBig  = d.dmg >= 50;
      const isGiant = d.dmg >= 150;
      splat.className = `hit-splat ${typeClass} ${d.crit ? 'splat-crit' : ''} ${isGiant ? 'splat-giant' : isBig ? 'splat-big' : ''}`;
      splat.textContent = prefix + d.dmg + (d.crit ? '!' : '');
    }

    splat.style.left = (15 + Math.random() * 70) + '%';
    splat.style.top  = (10 + Math.random() * 30) + '%';
    area.appendChild(splat);
    setTimeout(() => { if (splat.parentNode) splat.remove(); }, 1100);

    // Attack animation overlay — SKIP for ability/spec hits (they have their own anim)
    const combatArena = document.querySelector('.combat-arena');
    if (!combatArena || d.source === 'ability' || d.source === 'spec') return;
    const anim = document.createElement('div');
    if (d.who === 'player') {
      // ── WEAPON-SPECIFIC PLAYER ATTACK ANIMATIONS ─────────────
      const style    = this.engine.state.combat.combatStyle;
      const weaponId = this.engine.state.equipment?.weapon || '';
      const crit     = d.crit;
      const cc       = crit ? '#d4a83a' : '#c8cad4';
      const cd       = crit ? 4 : 2.5;

      // Map weapon ID → animation type
      const weapAnim = {
        // Scimitars — fast curved slash
        bronze_scimitar:'slash_fast', iron_scimitar:'slash_fast', steel_scimitar:'slash_fast',
        mithril_scimitar:'slash_fast', adamant_scimitar:'slash_fast', runite_scimitar:'slash_fast',
        // Longswords — wide overhead swing
        steel_longsword:'slash_wide', mithril_longsword:'slash_wide',
        adamant_longsword:'slash_wide', runite_longsword:'slash_wide',
        // Godswords — massive slow arc
        armadyl_godsword:'slash_god', bandos_godsword:'slash_god',
        saradomin_sword:'slash_holy',
        // Dagger — double stab
        dragon_dagger:'stab_double',
        // Whip — whip lash arc
        abyssal_whip:'whip',
        // Maul — crush downward
        granite_maul:'crush',
        // Greataxe — wide cleave
        dragonite_greataxe:'cleave',
        // Void/dark blades
        voidreaper:'void_slash', ashen_overlord_blade:'fire_slash',
        ashfire_blade:'fire_slash',
        // Ranged
        dark_bow:'arrow_heavy', armadyl_crossbow:'bolt', zaryte_crossbow:'bolt_void',
        maple_shortbow:'arrow', yew_longbow:'arrow', magic_shortbow:'arrow_rapid',
        twisted_bow:'arrow_golden',
        // Magic
        master_wand:'spell_gold', kodai_wand:'spell_void', toxic_staff:'spell_poison',
        sanguinesti_staff:'spell_blood', staff_of_the_dead:'spell_dark',
        void_emperor_staff:'spell_reality',
      };

      const wType = weapAnim[weaponId] || (style === 'melee' ? 'slash_fast' : style === 'ranged' ? 'arrow' : 'spell_blue');

      const PLAYER_ANIMS = {
        slash_fast: `<svg viewBox="0 0 80 80"><path d="M15 65 Q40 30 65 15" stroke="${cc}" stroke-width="${cd}" fill="none" stroke-linecap="round" opacity="0.85"><animate attributeName="stroke-dasharray" from="0 120" to="120 0" dur="0.22s" fill="remove"/></path>${crit?`<path d="M18 62 Q38 40 62 18" stroke="#d4a83a" stroke-width="1.5" fill="none" opacity="0.4"><animate attributeName="stroke-dasharray" from="0 120" to="120 0" dur="0.26s" fill="remove"/></path>`:''}</svg>`,
        slash_wide: `<svg viewBox="0 0 90 80"><path d="M5 70 Q30 20 85 10" stroke="${cc}" stroke-width="${cd+0.5}" fill="none" stroke-linecap="round" opacity="0.85"><animate attributeName="stroke-dasharray" from="0 150" to="150 0" dur="0.30s" fill="remove"/></path><path d="M5 72 Q28 30 82 14" stroke="${cc}" stroke-width="1" fill="none" opacity="0.3"><animate attributeName="stroke-dasharray" from="0 150" to="150 0" dur="0.35s" fill="remove"/></path></svg>`,
        slash_god:  `<svg viewBox="0 0 90 90"><path d="M5 80 Q45 25 85 5" stroke="${crit?'#d4a83a':'#b0b8c4'}" stroke-width="${cd+1}" fill="none" stroke-linecap="round" opacity="0.9"><animate attributeName="stroke-dasharray" from="0 160" to="160 0" dur="0.35s" fill="remove"/></path><path d="M10 78 Q42 30 82 8" stroke="#d4a83a" stroke-width="1" fill="none" opacity="0.3"><animate attributeName="stroke-dasharray" from="0 155" to="155 0" dur="0.4s" fill="remove"/></path>${crit?`<circle cx="45" cy="44" r="0" fill="none" stroke="#d4a83a" stroke-width="2"><animate attributeName="r" from="5" to="40" dur="0.4s" fill="remove"/><animate attributeName="opacity" from="0.7" to="0" dur="0.4s" fill="remove"/></circle>`:''}</svg>`,
        slash_holy: `<svg viewBox="0 0 80 80"><path d="M10 70 Q40 30 70 10" stroke="#c4d4e8" stroke-width="${cd+0.5}" fill="none" stroke-linecap="round" opacity="0.85"><animate attributeName="stroke-dasharray" from="0 130" to="130 0" dur="0.28s" fill="remove"/></path><circle cx="40" cy="40" r="0" fill="none" stroke="#c4d4ff" stroke-width="1.5"><animate attributeName="r" from="4" to="30" dur="0.38s" fill="remove"/><animate attributeName="opacity" from="0.5" to="0" dur="0.38s" fill="remove"/></circle></svg>`,
        stab_double:`<svg viewBox="0 0 80 60"><line x1="0" y1="20" x2="70" y2="30" stroke="${cc}" stroke-width="2" stroke-linecap="round"><animate attributeName="x1" from="-30" to="0" dur="0.12s" fill="remove"/><animate attributeName="x1" values="0;60;0" dur="0.22s" fill="remove" begin="0.05s"/><animate attributeName="opacity" from="1" to="0" dur="0.08s" begin="0.27s" fill="remove"/></line><line x1="0" y1="38" x2="65" y2="30" stroke="${cc}" stroke-width="2" stroke-linecap="round"><animate attributeName="x1" from="-30" to="0" dur="0.12s" begin="0.08s" fill="remove"/><animate attributeName="x1" values="0;55;0" dur="0.22s" fill="remove" begin="0.13s"/><animate attributeName="opacity" from="1" to="0" dur="0.08s" begin="0.35s" fill="remove"/></line><polygon points="68,28 78,30 68,32" fill="${cc}" opacity="0.7"><animate attributeName="opacity" from="0" to="0.7" dur="0.1s" fill="remove"/><animate attributeName="opacity" from="0.7" to="0" dur="0.1s" begin="0.22s" fill="remove"/></polygon></svg>`,
        whip:       `<svg viewBox="0 0 90 80"><path d="M5 20 Q30 5 55 35 Q70 55 80 70" stroke="${cc}" stroke-width="2" fill="none" stroke-linecap="round"><animate attributeName="stroke-dasharray" from="0 160" to="160 0" dur="0.28s" fill="remove"/></path><path d="M8 22 Q32 8 56 36 Q70 54 78 68" stroke="${cc}" stroke-width="0.8" fill="none" opacity="0.3"><animate attributeName="stroke-dasharray" from="0 155" to="155 0" dur="0.30s" fill="remove"/></path></svg>`,
        crush:      `<svg viewBox="0 0 80 80"><rect x="30" y="5" width="20" height="12" rx="3" fill="${cc}" opacity="0.8"><animate attributeName="y" from="5" to="55" dur="0.18s" fill="remove"/><animate attributeName="opacity" from="0.8" to="0" dur="0.15s" begin="0.18s" fill="remove"/></rect><circle cx="40" cy="60" r="0" fill="none" stroke="${cc}" stroke-width="2"><animate attributeName="r" from="5" to="28" dur="0.22s" begin="0.17s" fill="remove"/><animate attributeName="opacity" from="0.7" to="0" dur="0.22s" begin="0.17s" fill="remove"/></circle></svg>`,
        cleave:     `<svg viewBox="0 0 90 80"><path d="M5 10 Q50 50 85 75" stroke="#d67338" stroke-width="${cd+1}" fill="none" stroke-linecap="round" opacity="0.9"><animate attributeName="stroke-dasharray" from="0 150" to="150 0" dur="0.32s" fill="remove"/></path><path d="M8 12 Q52 48 82 72" stroke="#ff8040" stroke-width="1" fill="none" opacity="0.4"><animate attributeName="stroke-dasharray" from="0 148" to="148 0" dur="0.36s" fill="remove"/></path>${crit?`<circle cx="45" cy="42" r="0" fill="#d67338" opacity="0.4"><animate attributeName="r" from="5" to="35" dur="0.35s" fill="remove"/><animate attributeName="opacity" from="0.4" to="0" dur="0.35s" fill="remove"/></circle>`:''}</svg>`,
        void_slash: `<svg viewBox="0 0 80 80"><path d="M10 70 Q40 35 70 10" stroke="#8a2ae0" stroke-width="${cd+0.5}" fill="none" stroke-linecap="round" opacity="0.9"><animate attributeName="stroke-dasharray" from="0 130" to="130 0" dur="0.25s" fill="remove"/></path><path d="M12 68 Q38 38 68 12" stroke="#d080ff" stroke-width="1" fill="none" opacity="0.5"><animate attributeName="stroke-dasharray" from="0 125" to="125 0" dur="0.28s" fill="remove"/></path><circle cx="40" cy="40" r="0" fill="none" stroke="#6010c0" stroke-width="1.5"><animate attributeName="r" from="5" to="35" dur="0.38s" fill="remove"/><animate attributeName="opacity" from="0.5" to="0" dur="0.38s" fill="remove"/></circle></svg>`,
        fire_slash: `<svg viewBox="0 0 80 80"><path d="M10 70 Q40 35 70 10" stroke="#d63a1a" stroke-width="${cd+1}" fill="none" stroke-linecap="round" opacity="0.9"><animate attributeName="stroke-dasharray" from="0 130" to="130 0" dur="0.26s" fill="remove"/></path><path d="M12 68 Q38 38 68 12" stroke="#ff6020" stroke-width="1.5" fill="none" opacity="0.5"><animate attributeName="stroke-dasharray" from="0 125" to="125 0" dur="0.30s" fill="remove"/></path><circle cx="42" cy="42" r="1" fill="#ff8040"><animate attributeName="r" from="1" to="4" dur="0.1s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.2s" begin="0.2s" fill="remove"/></circle></svg>`,
        arrow:      `<svg viewBox="0 0 80 40" style="overflow:hidden"><line x1="5" y1="20" x2="70" y2="20" stroke="#9a7a4a" stroke-width="2" stroke-linecap="round" opacity="1"><animate attributeName="x2" from="5" to="75" dur="0.18s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.08s" begin="0.18s" fill="remove"/></line><polygon points="70,16 80,20 70,24" fill="#9a7a4a"><animate attributeName="opacity" from="1" to="0" dur="0.08s" begin="0.18s" fill="remove"/></polygon></svg>`,
        arrow_rapid:`<svg viewBox="0 0 80 50"><line x1="5" y1="12" x2="68" y2="15" stroke="#4a9ed4" stroke-width="1.5"><animate attributeName="x1" from="5" to="72" dur="0.16s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.08s" begin="0.16s" fill="remove"/></line><line x1="5" y1="25" x2="68" y2="25" stroke="#4a9ed4" stroke-width="1.5"><animate attributeName="x1" from="5" to="72" dur="0.16s" begin="0.05s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.08s" begin="0.22s" fill="remove"/></line><line x1="5" y1="38" x2="68" y2="35" stroke="#4a9ed4" stroke-width="1.5"><animate attributeName="x1" from="5" to="72" dur="0.16s" begin="0.10s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.08s" begin="0.26s" fill="remove"/></line></svg>`,
        arrow_heavy:`<svg viewBox="0 0 80 50"><line x1="5" y1="15" x2="68" y2="18" stroke="#8a5a1a" stroke-width="2.5"><animate attributeName="x1" from="5" to="72" dur="0.28s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.1s" begin="0.28s" fill="remove"/></line><line x1="5" y1="35" x2="68" y2="32" stroke="#8a5a1a" stroke-width="2.5"><animate attributeName="x1" from="5" to="72" dur="0.28s" begin="0.04s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.1s" begin="0.32s" fill="remove"/></line><polygon points="68,13 78,16 68,19" fill="#8a5a1a"><animate attributeName="opacity" from="1" to="0" dur="0.1s" begin="0.28s" fill="remove"/></polygon><polygon points="68,30 78,33 68,36" fill="#8a5a1a"><animate attributeName="opacity" from="1" to="0" dur="0.1s" begin="0.32s" fill="remove"/></polygon></svg>`,
        arrow_golden:`<svg viewBox="0 0 80 40"><line x1="5" y1="20" x2="68" y2="20" stroke="#d4a83a" stroke-width="2.5"><animate attributeName="x1" from="5" to="72" dur="0.24s" fill="remove"/></line><polygon points="68,16 80,20 68,24" fill="#d4a83a"/><path d="M10 18 Q20 12 30 18 Q40 24 50 18" stroke="#d4a83a" stroke-width="0.8" fill="none" opacity="0.4"><animate attributeName="opacity" from="0.4" to="0" dur="0.3s" begin="0.2s" fill="remove"/></path></svg>`,
        bolt:       `<svg viewBox="0 0 80 40"><rect x="5" y="18" width="64" height="4" rx="2" fill="#c4a83a"><animate attributeName="x" from="5" to="74" dur="0.18s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.1s" begin="0.16s" fill="remove"/></rect><circle cx="70" cy="20" r="0" fill="#d4a83a"><animate attributeName="r" from="2" to="10" dur="0.12s" begin="0.16s" fill="remove"/><animate attributeName="opacity" from="0.8" to="0" dur="0.12s" begin="0.16s" fill="remove"/></circle></svg>`,
        bolt_void:  `<svg viewBox="0 0 80 40"><rect x="5" y="18" width="64" height="4" rx="2" fill="#8a3ab0"><animate attributeName="x" from="5" to="74" dur="0.18s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.1s" begin="0.16s" fill="remove"/></rect><circle cx="70" cy="20" r="0" fill="#d080ff"><animate attributeName="r" from="2" to="14" dur="0.15s" begin="0.14s" fill="remove"/><animate attributeName="opacity" from="0.9" to="0" dur="0.15s" begin="0.14s" fill="remove"/></circle></svg>`,
        spell_blue: `<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="3" fill="#6a8ae8" opacity="0.9"><animate attributeName="r" from="3" to="28" dur="0.35s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.35s" fill="remove"/></circle></svg>`,
        spell_gold: `<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="4" fill="#c4a83a"><animate attributeName="r" from="4" to="26" dur="0.3s" fill="remove"/><animate attributeName="opacity" from="0.9" to="0" dur="0.3s" fill="remove"/></circle><circle cx="40" cy="40" r="1" fill="#ffd080"><animate attributeName="r" from="1" to="14" dur="0.22s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.25s" fill="remove"/></circle></svg>`,
        spell_void: `<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="4" fill="#6010c0"><animate attributeName="r" from="4" to="28" dur="0.32s" fill="remove"/><animate attributeName="opacity" from="0.9" to="0" dur="0.32s" fill="remove"/></circle><circle cx="40" cy="40" r="2" fill="#d080ff"><animate attributeName="r" from="2" to="14" dur="0.24s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.28s" fill="remove"/></circle></svg>`,
        spell_poison:`<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="4" fill="#2a7a1a"><animate attributeName="r" from="4" to="26" dur="0.32s" fill="remove"/><animate attributeName="opacity" from="0.8" to="0" dur="0.32s" fill="remove"/></circle><circle cx="40" cy="40" r="2" fill="#6acc2a"><animate attributeName="r" from="2" to="12" dur="0.24s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.28s" fill="remove"/></circle></svg>`,
        spell_blood:`<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="4" fill="#8a0a0a"><animate attributeName="r" from="4" to="26" dur="0.32s" fill="remove"/><animate attributeName="opacity" from="0.9" to="0" dur="0.32s" fill="remove"/></circle><circle cx="40" cy="40" r="2" fill="#ff4040"><animate attributeName="r" from="2" to="14" dur="0.24s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.28s" fill="remove"/></circle></svg>`,
        spell_dark: `<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="4" fill="#1a1a1a"><animate attributeName="r" from="4" to="28" dur="0.32s" fill="remove"/><animate attributeName="opacity" from="0.85" to="0" dur="0.32s" fill="remove"/></circle><circle cx="40" cy="40" r="2" fill="#a0a0a0"><animate attributeName="r" from="2" to="12" dur="0.24s" fill="remove"/><animate attributeName="opacity" from="0.9" to="0" dur="0.28s" fill="remove"/></circle></svg>`,
        spell_reality:`<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="6" fill="#3a0a6a"><animate attributeName="r" from="6" to="38" dur="0.38s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.38s" fill="remove"/></circle><circle cx="40" cy="40" r="3" fill="#9030d0"><animate attributeName="r" from="3" to="20" dur="0.28s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.32s" fill="remove"/></circle><circle cx="40" cy="40" r="1" fill="#e0a0ff"><animate attributeName="r" from="1" to="8" dur="0.18s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.22s" fill="remove"/></circle></svg>`,
      };

      anim.className = 'atk-anim atk-player';
      anim.innerHTML = PLAYER_ANIMS[wType] || PLAYER_ANIMS.slash_fast;
      anim.style.width = '90px'; anim.style.height = '90px';

    } else {
      // Monster attacks player - pick animation based on monster type
      const mId = this.engine.state.combat.monster;
      const mon = GAME_DATA.monsters[mId];
      const mStyle = mon?.style || 'melee';
      const mName = (mon?.name || '').toLowerCase();
      
      // Determine attack type from monster name/style
      let atkType = 'claw'; // default
      if (mName.includes('dragon') || mName.includes('drake') || mName.includes('hydra') || mName.includes('pyrelord') || mName.includes('fire') || mName.includes('cerberus') || mName.includes('ember') || mName.includes('magma')) atkType = 'fireball';
      else if (mName.includes('ice') || mName.includes('frost') || mName.includes('frozen') || mName.includes('crystal')) atkType = 'iceblast';
      else if (mName.includes('spider') || mName.includes('scorpion') || mName.includes('venom') || mName.includes('poison')) atkType = 'poison';
      else if (mName.includes('mage') || mName.includes('wizard') || mName.includes('nechryael') || mName.includes('abyssal') || mName.includes('demon') || mName.includes('horror') || mName.includes('void') || mName.includes('dark') || mName.includes('shadow') || mName.includes('corporeal')) atkType = 'darkbolt';
      else if (mName.includes('bat') || mName.includes('wolf') || mName.includes('hellhound') || mName.includes('bloodfang')) atkType = 'bite';
      else if (mName.includes('giant') || mName.includes('titan') || mName.includes('golem') || mName.includes('ogre') || mName.includes('troll')) atkType = 'slam';
      else if (mName.includes('archer') || mName.includes('dwarf') || mName.includes('chaos')) atkType = 'volley';
      else if (mName.includes('kraken') || mName.includes('blood') || mName.includes('leech')) atkType = 'tentacle';
      else if (mName.includes('skeleton') || mName.includes('zombie') || mName.includes('undead') || mName.includes('hollow')) atkType = 'bonestrike';
      else if (mName.includes('guard') || mName.includes('knight') || mName.includes('warrior') || mName.includes('gargoyle')) atkType = 'swordstrike';
      else if (mStyle === 'magic') atkType = 'darkbolt';
      else if (mStyle === 'ranged') atkType = 'volley';

      const ANIMS = {
        claw: `<svg viewBox="0 0 60 60"><path d="M10 50 L30 20 L15 45" stroke="#c44040" stroke-width="2.5" fill="none" opacity="0.8"><animate attributeName="stroke-dasharray" from="0 100" to="100 0" dur="0.2s" fill="remove"/></path><path d="M25 50 L40 15 L30 45" stroke="#c44040" stroke-width="2.5" fill="none" opacity="0.7"><animate attributeName="stroke-dasharray" from="0 100" to="100 0" dur="0.2s" begin="0.05s" fill="remove"/></path><path d="M40 50 L50 20 L45 45" stroke="#c44040" stroke-width="2.5" fill="none" opacity="0.6"><animate attributeName="stroke-dasharray" from="0 100" to="100 0" dur="0.2s" begin="0.1s" fill="remove"/></path></svg>`,
        fireball: `<svg viewBox="0 0 80 80"><circle cx="60" cy="40" r="3" fill="#ff4000"><animate attributeName="cx" from="0" to="60" dur="0.3s" fill="remove"/><animate attributeName="r" from="3" to="14" dur="0.3s" fill="remove"/></circle><circle cx="60" cy="40" r="1" fill="#ff8040" opacity="0.7"><animate attributeName="cx" from="0" to="60" dur="0.3s" fill="remove"/><animate attributeName="r" from="1" to="10" dur="0.3s" fill="remove"/></circle><circle cx="60" cy="40" r="0" fill="#ffc040" opacity="0.5"><animate attributeName="cx" from="60" to="60" dur="0.1s" begin="0.25s" fill="remove"/><animate attributeName="r" from="14" to="25" dur="0.2s" begin="0.25s" fill="remove"/><animate attributeName="opacity" from="0.6" to="0" dur="0.2s" begin="0.25s" fill="remove"/></circle><path d="M5 38 Q15 30 10 40 Q20 35 15 42" stroke="#ff6020" stroke-width="1.5" fill="none" opacity="0.5"><animate attributeName="opacity" from="0.5" to="0" dur="0.3s" fill="remove"/></path></svg>`,
        iceblast: `<svg viewBox="0 0 80 80"><polygon points="40,15 50,35 45,35 55,55 35,40 40,40 30,25" fill="#80d0f0" opacity="0.8"><animate attributeName="opacity" from="0" to="0.8" dur="0.15s" fill="remove"/></polygon><polygon points="35,20 42,32 38,32 48,50 32,38 36,38 28,28" fill="#a0e0ff" opacity="0.5"><animate attributeName="opacity" from="0" to="0.5" dur="0.2s" fill="remove"/></polygon><circle cx="40" cy="40" r="0" fill="none" stroke="#60c0e0" stroke-width="1.5"><animate attributeName="r" from="5" to="30" dur="0.4s" fill="remove"/><animate attributeName="opacity" from="0.8" to="0" dur="0.4s" fill="remove"/></circle></svg>`,
        poison: `<svg viewBox="0 0 70 70"><circle cx="35" cy="30" r="3" fill="#4abe6c" opacity="0.8"><animate attributeName="cy" from="10" to="30" dur="0.2s" fill="remove"/></circle><circle cx="25" cy="40" r="2.5" fill="#3a9e5c" opacity="0.7"><animate attributeName="cy" from="15" to="40" dur="0.25s" fill="remove"/></circle><circle cx="45" cy="35" r="2" fill="#5ace7c" opacity="0.6"><animate attributeName="cy" from="12" to="35" dur="0.22s" fill="remove"/></circle><circle cx="35" cy="30" r="0" fill="none" stroke="#4abe6c" stroke-width="1"><animate attributeName="r" from="3" to="18" dur="0.3s" begin="0.2s" fill="remove"/><animate attributeName="opacity" from="0.6" to="0" dur="0.3s" begin="0.2s" fill="remove"/></circle></svg>`,
        darkbolt: `<svg viewBox="0 0 80 80"><circle cx="55" cy="40" r="4" fill="#8a2ae0"><animate attributeName="cx" from="10" to="55" dur="0.25s" fill="remove"/></circle><circle cx="55" cy="40" r="2" fill="#b060ff"><animate attributeName="cx" from="10" to="55" dur="0.25s" fill="remove"/></circle><circle cx="55" cy="40" r="0" fill="none" stroke="#6020b0" stroke-width="2"><animate attributeName="r" from="4" to="22" dur="0.3s" begin="0.2s" fill="remove"/><animate attributeName="opacity" from="0.8" to="0" dur="0.3s" begin="0.2s" fill="remove"/></circle><path d="M10 38 Q20 30 15 42 Q25 35 20 44" stroke="#8a3ae0" stroke-width="1" fill="none" opacity="0.4"><animate attributeName="opacity" from="0.4" to="0" dur="0.3s" fill="remove"/></path></svg>`,
        bite: `<svg viewBox="0 0 60 60"><path d="M15 25 L30 35 L15 45" stroke="#c44040" stroke-width="2" fill="none"><animate attributeName="stroke-dasharray" from="0 80" to="80 0" dur="0.15s" fill="remove"/></path><path d="M45 25 L30 35 L45 45" stroke="#c44040" stroke-width="2" fill="none"><animate attributeName="stroke-dasharray" from="0 80" to="80 0" dur="0.15s" fill="remove"/></path><circle cx="22" cy="30" r="1.5" fill="#fff"/><circle cx="38" cy="30" r="1.5" fill="#fff"/><circle cx="22" cy="40" r="1.5" fill="#fff"/><circle cx="38" cy="40" r="1.5" fill="#fff"/></svg>`,
        slam: `<svg viewBox="0 0 80 80"><rect x="30" y="10" width="20" height="10" rx="3" fill="#8a7a5a" opacity="0.8"><animate attributeName="y" from="10" to="50" dur="0.2s" fill="remove"/><animate attributeName="opacity" from="0.8" to="0" dur="0.06s" begin="0.2s" fill="remove"/></rect><line x1="15" y1="60" x2="65" y2="60" stroke="#8a7a5a" stroke-width="3" opacity="0"><animate attributeName="opacity" from="0" to="0.8" dur="0.1s" begin="0.2s" fill="remove"/><animate attributeName="opacity" from="0.8" to="0" dur="0.15s" begin="0.3s" fill="remove"/></line><circle cx="40" cy="60" r="0" fill="none" stroke="#c4a83a" stroke-width="1.5"><animate attributeName="r" from="5" to="25" dur="0.3s" begin="0.2s" fill="remove"/><animate attributeName="opacity" from="0.6" to="0" dur="0.3s" begin="0.2s" fill="remove"/></circle><path d="M20 58 L15 50 M60 58 L65 50 M30 58 L28 48 M50 58 L52 48" stroke="#8a7a5a" stroke-width="1" opacity="0"><animate attributeName="opacity" from="0" to="0.5" dur="0.1s" begin="0.2s" fill="remove"/></path></svg>`,
        volley: `<svg viewBox="0 0 80 60"><line x1="80" y1="15" x2="10" y2="25" stroke="#8a6a3a" stroke-width="1.5"><animate attributeName="x1" from="80" to="10" dur="0.2s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.08s" begin="0.2s" fill="remove"/></line><line x1="80" y1="30" x2="10" y2="30" stroke="#8a6a3a" stroke-width="1.5"><animate attributeName="x1" from="80" to="10" dur="0.22s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.08s" begin="0.22s" fill="remove"/></line><line x1="80" y1="45" x2="10" y2="35" stroke="#8a6a3a" stroke-width="1.5"><animate attributeName="x1" from="80" to="10" dur="0.24s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.08s" begin="0.24s" fill="remove"/></line><polygon points="8,23 2,25 8,27" fill="#8a6a3a"><animate attributeName="opacity" from="0" to="1" dur="0.1s" begin="0.18s" fill="remove"/></polygon><polygon points="8,28 2,30 8,32" fill="#8a6a3a"><animate attributeName="opacity" from="0" to="1" dur="0.1s" begin="0.2s" fill="remove"/></polygon></svg>`,
        tentacle: `<svg viewBox="0 0 70 70"><path d="M60 50 Q45 30 30 35 Q20 38 15 30" stroke="#2a6a8a" stroke-width="3" fill="none" stroke-linecap="round"><animate attributeName="stroke-dasharray" from="0 120" to="120 0" dur="0.3s" fill="remove"/></path><path d="M55 55 Q40 40 25 42 Q15 44 10 38" stroke="#2a5a7a" stroke-width="2.5" fill="none" stroke-linecap="round"><animate attributeName="stroke-dasharray" from="0 120" to="120 0" dur="0.35s" fill="remove"/></path><circle cx="15" cy="30" r="0" fill="#4a9aba" opacity="0.5"><animate attributeName="r" from="2" to="10" dur="0.2s" begin="0.25s" fill="remove"/><animate attributeName="opacity" from="0.5" to="0" dur="0.2s" begin="0.25s" fill="remove"/></circle></svg>`,
        bonestrike: `<svg viewBox="0 0 60 60"><rect x="25" y="5" width="4" height="35" rx="2" fill="#d4d0c0" transform="rotate(15 27 22)"><animate attributeName="y" from="5" to="20" dur="0.15s" fill="remove"/></rect><circle cx="27" cy="8" r="4" fill="#d4d0c0"><animate attributeName="cy" from="8" to="23" dur="0.15s" fill="remove"/></circle><circle cx="27" cy="40" r="4" fill="#d4d0c0"><animate attributeName="cy" from="40" to="55" dur="0.15s" fill="remove"/></circle><circle cx="30" cy="45" r="0" fill="none" stroke="#a09880" stroke-width="1"><animate attributeName="r" from="3" to="15" dur="0.2s" begin="0.15s" fill="remove"/><animate attributeName="opacity" from="0.5" to="0" dur="0.2s" begin="0.15s" fill="remove"/></circle></svg>`,
        swordstrike: `<svg viewBox="0 0 70 70"><rect x="45" y="5" width="4" height="40" rx="1" fill="#aaa" transform="rotate(-40 47 25)"><animate attributeName="transform" from="rotate(-40 47 25)" to="rotate(30 47 25)" dur="0.2s" fill="remove"/></rect><rect x="44" y="42" width="6" height="8" rx="1" fill="#666" transform="rotate(-40 47 25)"><animate attributeName="transform" from="rotate(-40 47 25)" to="rotate(30 47 25)" dur="0.2s" fill="remove"/></rect><path d="M20 40 Q30 30 40 45" stroke="#ccc" stroke-width="1" fill="none" opacity="0"><animate attributeName="opacity" from="0" to="0.6" dur="0.1s" begin="0.15s" fill="remove"/><animate attributeName="opacity" from="0.6" to="0" dur="0.15s" begin="0.25s" fill="remove"/></path></svg>`,
      };

      anim.className = `atk-anim atk-monster atk-${atkType}`;
      anim.innerHTML = ANIMS[atkType] || ANIMS.claw;
    }
    // Purge any stuck animations before adding new one
    document.querySelectorAll('.atk-anim').forEach(el => el.remove());
    // Force all SVG animate elements to NOT freeze (use remove instead)
    anim.querySelectorAll('animate, animateTransform, animateMotion').forEach(a => { a.setAttribute('fill','remove'); });
    combatArena.appendChild(anim);
    anim.style.animation = 'atkFade 0.5s ease-out forwards';
    const _animEl = anim;
    // Multiple timeouts for safety
    setTimeout(() => { if (_animEl.parentNode) _animEl.remove(); }, 500);
    setTimeout(() => { if (_animEl.parentNode) _animEl.remove(); }, 600);

    // Shake/flash the target
    if (d.who === 'player' && !d.miss) {
      const monArt = document.querySelector('.monster-art');
      if (monArt) { monArt.classList.add('hit-shake'); setTimeout(()=>monArt.classList.remove('hit-shake'), 200); }
    } else if (d.who === 'monster' && !d.miss) {
      const pSide = document.querySelector('.player-side');
      if (pSide) { pSide.classList.add('hit-flash'); setTimeout(()=>pSide.classList.remove('hit-flash'), 300); }
    }
  }

  _showLevelUpBanner(skillId, level) {
    const skill = GAME_DATA.skills[skillId];
    if (!skill) return;
    // Remove existing banner
    const existing = document.getElementById('levelup-banner');
    if (existing) existing.remove();
    const banner = document.createElement('div');
    banner.id = 'levelup-banner';
    banner.className = 'levelup-banner';
    const milestones = [10,20,30,40,50,60,70,80,90,99];
    const isMilestone = milestones.includes(level);
    banner.innerHTML = `
      <div class="lub-icon">${isMilestone ? '🌟' : '⬆'}</div>
      <div class="lub-text">
        <div class="lub-skill">${skill.name}</div>
        <div class="lub-level ${isMilestone?'lub-milestone':''}">Level ${level}${level===99?' — MAXED!':''}</div>
      </div>
    `;
    if (isMilestone) banner.classList.add('lub-big');
    document.body.appendChild(banner);
    this._playSound(level === 99 ? 'rare' : 'levelup');
    setTimeout(() => { banner.classList.add('lub-fade'); setTimeout(() => banner?.remove(), 600); }, level === 99 ? 4000 : 2500);
  }

  _showPrestigeBanner(rank, rankData) {
    const existing = document.getElementById('prestige-banner');
    if (existing) existing.remove();
    const banner = document.createElement('div');
    banner.id = 'prestige-banner';
    banner.className = 'prestige-banner-full';
    banner.innerHTML = `
      <div class="pb-bg"></div>
      <div class="pb-content">
        <div class="pb-stars">⭐⭐⭐</div>
        <div class="pb-title">PRESTIGE ${rank}</div>
        <div class="pb-name" style="color:${rankData?.color||'#c9873e'}">${rankData?.icon||'⭐'} ${rankData?.name||'Prestige'}</div>
        <div class="pb-desc">${rankData?.desc||'You have transcended.'}</div>
        <button class="btn pb-close" onclick="document.getElementById('prestige-banner').remove()">Continue →</button>
      </div>
    `;
    document.body.appendChild(banner);
    this._playSound('prestige');
  }

  // ── SOUND ENGINE (Web Audio API, no file downloads) ─────
  _initAudio() {
    if (this._audioCtx) return;
    try { this._audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
  }

  _playSound(type) {
    const prefs = this.engine.state?._prefs;
    if (!prefs?.sounds || prefs?.muteAll) return;
    this._initAudio();
    if (!this._audioCtx) return;
    const cfg = GAME_DATA.sounds?.defs?.[type];
    if (!cfg) return;
    try {
      const vol = (GAME_DATA.sounds?.volume || 0.3) * (prefs?.volume || 1);
      const ctx = this._audioCtx;
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(vol * (cfg.vol||0.2), ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (cfg.dur||0.1) * 3);
      gainNode.connect(ctx.destination);
      const freqs = Array.isArray(cfg.freqs) ? cfg.freqs : [cfg.freq || 440];
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = cfg.type === 'thud' || cfg.type === 'boom' ? 'sine' : cfg.type === 'crack' ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * (cfg.dur||0.1));
        osc.connect(gainNode);
        osc.start(ctx.currentTime + i * (cfg.dur||0.1) * 0.8);
        osc.stop(ctx.currentTime + (cfg.dur||0.1) * (freqs.length + 2));
      });
    } catch(e) {}
  }

  // ── ITEM COMPARISON ──────────────────────────────────────
  showItemCompare(itemId) {
    if (!this._compareItem1) {
      this._compareItem1 = itemId;
      this.toast({ type:'info', text:`Comparing: ${GAME_DATA.items[itemId]?.name}. Click another item to compare.` });
      return;
    }
    if (this._compareItem1 === itemId) { this._compareItem1 = null; return; }
    this._showCompareModal(this._compareItem1, itemId);
    this._compareItem1 = null;
  }

  _showCompareModal(id1, id2) {
    const item1 = GAME_DATA.items[id1];
    const item2 = GAME_DATA.items[id2];
    if (!item1 || !item2) return;
    const existing = document.getElementById('compare-modal');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.id = 'compare-modal';
    modal.className = 'compare-modal';
    const stats = GAME_DATA.compareStats || ['attackBonus','strengthBonus','defenceBonus','rangedBonus','magicBonus','damageReduction'];
    const statsRows = stats.map(stat => {
      const v1 = item1.stats?.[stat] || item1[stat] || 0;
      const v2 = item2.stats?.[stat] || item2[stat] || 0;
      if (v1 === 0 && v2 === 0) return '';
      const better1 = v1 > v2, better2 = v2 > v1;
      const label = stat.replace('Bonus','').replace(/([A-Z])/g,' $1').trim();
      return `<div class="cmp-row">
        <span class="cmp-v1 ${better1?'cmp-better':better2?'cmp-worse':''}">${v1>0?'+':''}${v1}</span>
        <span class="cmp-stat">${label}</span>
        <span class="cmp-v2 ${better2?'cmp-better':better1?'cmp-worse':''}">${v2>0?'+':''}${v2}</span>
      </div>`;
    }).filter(Boolean).join('');

    modal.innerHTML = `
      <div class="compare-backdrop" onclick="document.getElementById('compare-modal').remove()"></div>
      <div class="compare-card">
        <button class="compare-close" onclick="document.getElementById('compare-modal').remove()">✕</button>
        <div class="compare-header">
          <div class="cmp-item">
            <div class="cmp-icon">${window.renderItemSprite?window.renderItemSprite(id1,32):''}</div>
            <div class="cmp-name" style="${this.getRarityColor(id1)?'color:'+this.getRarityColor(id1):''}">${item1.name}</div>
          </div>
          <div class="cmp-vs">VS</div>
          <div class="cmp-item">
            <div class="cmp-icon">${window.renderItemSprite?window.renderItemSprite(id2,32):''}</div>
            <div class="cmp-name" style="${this.getRarityColor(id2)?'color:'+this.getRarityColor(id2):''}">${item2.name}</div>
          </div>
        </div>
        <div class="compare-stats">${statsRows || '<div class="cmp-no-stats">No comparable stats.</div>'}</div>
        <div class="compare-desc">
          <div class="cmp-desc-col">${item1.desc||''}</div>
          <div class="cmp-desc-col">${item2.desc||''}</div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  showTutorial(step = 0) {
    const steps = GAME_DATA.tutorialSteps || [];
    if (step >= steps.length) {
      // Done
      this.engine.state._tutorialDismissed = true;
      const overlay = document.getElementById('tutorial-overlay');
      if (overlay) overlay.remove();
      return;
    }
    const s = steps[step];
    let overlay = document.getElementById('tutorial-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'tutorial-overlay';
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = `
      <div class="tutorial-backdrop"></div>
      <div class="tutorial-card">
        <div class="tutorial-step-indicator">${steps.map((_,i) => `<span class="tutorial-dot ${i===step?'tut-active':i<step?'tut-done':''}"></span>`).join('')}</div>
        <div class="tutorial-icon">${s.icon}</div>
        <div class="tutorial-title">Step ${s.step}: ${s.title}</div>
        <div class="tutorial-desc">${s.desc}</div>
        <div class="tutorial-actions">
          ${step > 0 ? `<button class="btn btn-sm" onclick="ui.showTutorial(${step-1})">← Back</button>` : ''}
          <button class="btn btn-sm" onclick="ui.currentPage='${s.highlight}';ui.renderSidebar();ui.renderPage('${s.highlight}');ui.showTutorial(${step+1})">${s.action}</button>
          <button class="btn btn-sm" onclick="ui.showTutorial(${step+1})">${step < steps.length-1 ? 'Skip →' : 'Finish'}</button>
        </div>
        <button class="tutorial-dismiss" onclick="game.state._tutorialDismissed=true;document.getElementById('tutorial-overlay').remove()" title="Dismiss tutorial">✕</button>
      </div>`;
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

    // ── FISHING — live fish count updates ──────────────────
    if (s.activeSkill === 'fishing' && GAME_DATA.fishingZones) {
      GAME_DATA.fishingZones.forEach(zone => {
        zone.fish.forEach(f => {
          const ownEl = document.getElementById('fown-' + f.item);
          const bankEl = document.getElementById('fbq-' + f.item);
          const qty = s.bank[f.item] || 0;
          if (ownEl) {
            ownEl.textContent = 'x' + qty;
            ownEl.style.color = qty > 0 ? '#4abe6c' : 'var(--text-dim)';
          }
          if (bankEl) bankEl.textContent = 'x' + qty + ' raw';
        });
      });
    }

    // ── FORGE HEAT BAR (smithing page) ──────────────────────────
    if (s.activeSkill === 'smithing' && GAME_DATA.smeltingHeat?.enabled) {
      const _heatFill = document.querySelector('.heat-fill');
      const _heatPctEl = document.querySelector('.heat-pct');
      const _heatWrap = document.querySelector('.heat-bar-wrap');
      const _heat = Math.min(100, Math.round(s._smithingHeat || 0));
      const _threshold = GAME_DATA.smeltingHeat.bonusThreshold || 60;
      const _isHot = _heat >= _threshold;
      const _heatColor = _heat>80?'#ff4000':_heat>60?'#ff8c00':_heat>40?'#d4a83a':'#5a6070';
      if (_heatFill) { _heatFill.style.width = _heat+'%'; _heatFill.style.background = _heatColor; }
      if (_heatPctEl) { _heatPctEl.textContent = _heat+'%'; _heatPctEl.style.color = _heatColor; }
      if (_heatWrap) { _heatWrap.classList.toggle('heat-hot', _isHot); }
    }

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

    // ── COMBAT PAGE LIVE UPDATES ── (every tick, not just on hit)
    if (s.combat.active && s.combat.monster) {
      const isMM = s.combat._multiMobMode && this.engine.state.multiMob?.active;
      if (isMM) {
        this._updateMultiMobUI();
      } else {
        const mon = GAME_DATA.monsters[s.combat.monster] || (GAME_DATA.worldBosses||[]).find(b=>b.id===s.combat.monster);
        if (mon) {
          const max = this.engine.getMaxHp();
          // Player HP
          const phpBar = document.getElementById('php-bar');
          const phpText = document.getElementById('php-text');
          const pHp = Math.max(0, s.combat.playerHp || 0);
          if (phpBar)  phpBar.style.width  = (pHp / max * 100).toFixed(1) + '%';
          if (phpText) phpText.textContent = Math.floor(pHp) + ' / ' + max;
          // Monster HP
          const mhpBar = document.getElementById('mhp-bar');
          const mhpText = document.getElementById('mhp-text');
          const mHp = Math.max(0, s.combat.monsterHp || 0);
          const _mhpPct = (mHp / (mon.hp||1) * 100);
          if (mhpBar)  { mhpBar.style.width = _mhpPct.toFixed(1) + '%'; }
          if (mhpText) mhpText.textContent = Math.ceil(mHp) + ' / ' + (mon.hp||0);
          const _mhpPctEl = document.getElementById('mhp-pct');
          if (_mhpPctEl) _mhpPctEl.textContent = _mhpPct.toFixed(0) + '%';
          // HP bar colors live
          if (phpBar) {
            const pPct = pHp / max * 100;
            phpBar.style.background = pPct > 50 ? '#4a8a3e' : pPct > 25 ? '#c4a83a' : '#c44040';
          }
          if (mhpBar) {
            const mPct = mHp / (mon.hp||1) * 100;
            mhpBar.style.background = mPct > 50 ? '#8a3a3a' : mPct > 25 ? '#c4a83a' : '#4a8a3e';
          }
          // Prayer points
          const ppEl = document.getElementById('pp-live');
          if (ppEl) ppEl.textContent = s.prayerPoints;
          const ppEl2 = document.getElementById('pp-live2');
          if (ppEl2) { const _maxPp2=(s.skills.prayer?.level||1)*10; ppEl2.textContent=s.prayerPoints+'/'+_maxPp2+' pp'; }
          const ppFillBar = document.getElementById('prayer-fill-bar');
          if (ppFillBar) ppFillBar.style.width=Math.round((s.prayerPoints/((s.skills.prayer?.level||1)*10))*100)+'%';
          // Mini buff row update
          const _killBadge = document.getElementById('cv3-kills');
          if (_killBadge) _killBadge.textContent = (s.combat._sessionKills||0)+' Kills';
          // Cannon balls live update
          const _cbEl = document.getElementById('cannon-balls');
          if (_cbEl) _cbEl.textContent = (s.bank['cannonball']||0).toLocaleString();
          // Slayer task progress — live update (uses `amount` not `qty`)
          if (s.slayerTask) {
            const _stAmt    = s.slayerTask.amount || s.slayerTask.qty || 1;
            const _stKilled = s.slayerTask.killed || 0;
            const _stPct    = Math.min(100, Math.round(_stKilled / _stAmt * 100));
            const _stLeft   = Math.max(0, _stAmt - _stKilled);
            const _stColor  = _stPct>=75?'#4abe6c':_stPct>=40?'#d4a83a':'#c9873e';
            const fillEl    = document.getElementById('sts-fill');
            const killedEl  = document.getElementById('sts-killed');
            const pctEl     = document.getElementById('sts-pct');
            const leftEl    = document.getElementById('sts-left');
            if (fillEl)   { fillEl.style.width = _stPct+'%'; fillEl.style.background = _stColor; }
            if (killedEl) { killedEl.textContent = _stKilled; killedEl.style.color = _stColor; }
            if (pctEl)    { pctEl.textContent = _stPct+'%'; pctEl.style.color = _stColor; }
            if (leftEl)   { leftEl.textContent = _stLeft+' remaining'; }
          }
          // Mana live update
          const mBarEl = document.getElementById('mana-bar');
          const mTxtEl = document.getElementById('mana-text');
          if (mBarEl && s.combat.mana) {
            const mp = Math.min(100, (s.combat.mana.current / (s.combat.mana.max || 100)) * 100);
            mBarEl.style.width = mp.toFixed(1) + '%';
            if (mTxtEl) mTxtEl.textContent = Math.floor(s.combat.mana.current) + ' / ' + s.combat.mana.max + ' mana';
          }
          // Food bag quantities
          for (let i = 0; i < (s.foodBag||[]).length; i++) {
            const el = document.getElementById('fb-qty-' + i);
            if (el && s.foodBag[i]) el.textContent = 'x' + s.foodBag[i].qty;
          }
          // Combat XP bars
          for (const sId of ['attack','strength','defence','hitpoints','ranged','magic','prayer','slayer']) {
            const sk = s.skills[sId]; if (!sk) continue;
            const lvEl   = document.getElementById('cxp-lv-' + sId);
            const fillEl = document.getElementById('cxp-fill-' + sId);
            const xpEl   = document.getElementById('cxp-xp-' + sId);
            if (lvEl && lvEl.textContent !== String(sk.level)) {
              lvEl.textContent = sk.level;
              lvEl.classList.add('cxp-flash');
              setTimeout(()=>lvEl.classList.remove('cxp-flash'), 800);
            }
            if (fillEl) fillEl.style.width = (this.engine.getXpProgress(sId)*100).toFixed(1)+'%';
            if (xpEl)   xpEl.textContent   = this.fmt(sk.xp);
          }
          const killEl = document.getElementById('kill-count');
          if (killEl) killEl.textContent = s.stats.monstersKilled;
          // Slayer task counter (combat page)
          const slayerKilledEl = document.getElementById('slayer-killed');
          if (slayerKilledEl && s.slayerTask) slayerKilledEl.textContent = s.slayerTask.killed;
          const slayerFillEl = document.getElementById('slayer-fill');
          if (slayerFillEl && s.slayerTask) {
            const pct = Math.min(100, (s.slayerTask.killed / s.slayerTask.amount) * 100);
            slayerFillEl.style.width = pct + '%';
          }
          // Slayer task counter (slayer page)
          const slayerPageKilledEl = document.getElementById('slayer-page-killed');
          if (slayerPageKilledEl && s.slayerTask) slayerPageKilledEl.textContent = s.slayerTask.killed;
          // Spec bar
          const specFill = document.getElementById('spec-fill');
          const specPct  = document.getElementById('spec-pct');
          if (specFill) specFill.style.width = (s.specEnergy||0)+'%';
          if (specPct)  specPct.textContent  = (s.specEnergy||0)+'%';
          // Update spec button disabled state based on current energy
          const specBtn = document.querySelector('.spec-btn');
          if (specBtn) {
            const weapon = GAME_DATA.items[s.equipment?.weapon];
            const canUse = weapon?.specCost && (s.specEnergy||0) >= weapon.specCost;
            if (canUse) {
              specBtn.classList.remove('btn-disabled');
              specBtn.disabled = false;
            } else {
              specBtn.classList.add('btn-disabled');
              specBtn.disabled = true;
            }
          }
          // Status effects
          const playerFx = document.getElementById('player-status-live');
          if (playerFx) {
            const pe = s.combat.statusEffects?.player || {};
            const peArr = Object.entries(pe).filter(([,v])=>(v.stacks||0)>0);
            playerFx.innerHTML = peArr.map(([k,fx])=>{
              const def = GAME_DATA.statusEffects?.[k];
              return `<span class="pse-chip pse-${k}" style="${def?.color?'color:'+def.color:''}">${def?.name||k} x${fx.stacks}</span>`;
            }).join('');
          }
          const monsterFx = document.getElementById('monster-status-live');
          if (monsterFx) {
            const me = s.combat.statusEffects?.monster || {};
            const meArr = Object.entries(me).filter(([,v])=>(v.stacks||0)>0||(v.timer||0)>0);
            monsterFx.innerHTML = meArr.map(([k,fx])=>{
              const def = GAME_DATA.statusEffects?.[k];
              return `<span class="pse-chip pse-${k}" style="${def?.color?'color:'+def.color:''}">${def?.name||k}${fx.stacks>1?' x'+fx.stacks:''}</span>`;
            }).join('');
          }
          // Ability cooldowns — update ab3-btn elements by data-id
          const _cds = s.combat.abilityCooldowns || {};
          document.querySelectorAll('.ab3-btn[data-abid]').forEach(btn => {
            const aid = btn.dataset.abid;
            const ab  = GAME_DATA.abilities.find(a => a.id === aid);
            if (!ab) return;
            const cd  = _cds[aid] || 0;
            const pct = cd > 0 ? Math.min(100, (cd / ab.cooldown) * 100) : 0;
            const sweep = btn.querySelector('.ab3-cd-sweep');
            const status = btn.querySelector('.ab3-status');
            const mana = s.combat.mana || {};
            const noMana = (ab.manaCost||0) > 0 && (mana.current||0) < (ab.manaCost||0);
            if (sweep) sweep.style.setProperty('--sweep', pct.toFixed(1) + '%');
            if (status) {
              if (cd > 0)      { status.textContent = Math.ceil(cd) + 's'; status.className = 'ab3-status ab3-cooling'; }
              else if (noMana) { status.textContent = 'No mana';           status.className = 'ab3-status ab3-nomana'; }
              else             { status.textContent = 'Ready';             status.className = 'ab3-status ab3-ready'; }
            }
            if (cd > 0 || noMana) { btn.classList.add('ab3-cd'); }
            else                   { btn.classList.remove('ab3-cd'); }
          });

          // ── DAMAGE TRACKER live update ──
          const _sd = s.combat._sessionDmg || {};
          const _total = _sd.total || 0;
          const _set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
          const _setBar = (id, val, max) => { const el = document.getElementById(id+'-bar'); if (el) el.style.width = Math.round(val/Math.max(1,max)*100)+'%'; };
          const _dmgMax2 = Math.max(1,_sd.melee||0,_sd.ranged||0,_sd.magic||0,_sd.ability||0,_sd.poison||0,_sd.bleed||0);
          _set('sd-melee',  this.fmt(_sd.melee  || 0)); _setBar('sd-melee',  _sd.melee||0,  _dmgMax2);
          _set('sd-ranged', this.fmt(_sd.ranged || 0)); _setBar('sd-ranged', _sd.ranged||0, _dmgMax2);
          _set('sd-magic',  this.fmt(_sd.magic  || 0)); _setBar('sd-magic',  _sd.magic||0,  _dmgMax2);
          _set('sd-ability',this.fmt(_sd.ability|| 0)); _setBar('sd-ability',_sd.ability||0,_dmgMax2);
          _set('sd-burn',   this.fmt(_sd.burn   || 0));
          _set('sd-poison', this.fmt(_sd.poison || 0)); _setBar('sd-poison', _sd.poison||0, _dmgMax2);
          _set('sd-bleed',  this.fmt(_sd.bleed  || 0)); _setBar('sd-bleed',  _sd.bleed||0,  _dmgMax2);
          _set('sd-total',  this.fmt(_total));
          _set('sd-taken',  this.fmt(_sd.taken  || 0));
          _set('sd-kills',  s.combat._sessionKills || 0);
          // Sidebar session boxes
          _set('cv3-kills',  (s.combat._sessionKills||0)+' Kills');
          _set('cv3-dmgdealt', this.fmt(_total));
          _set('cv3-dmgtaken', this.fmt(_sd.taken||0));
          // Session timer
          const _stEl = document.getElementById('session-time');
          if (_stEl && s.combat._sessionStartTime) {
            const _se = Math.floor((Date.now() - s.combat._sessionStartTime) / 1000);
            const _sm = Math.floor(_se/60), _ss = _se%60;
            _stEl.textContent = _sm+'m '+_ss+'s';
          }
          // XP rate updates
          const _xbEl = document.getElementById('xp-rate-grid');
          if (_xbEl && s.combat._xpBySkill && s.combat._sessionStartTime) {
            const _xe = (Date.now() - s.combat._sessionStartTime) / 1000;
            if (_xe > 3) {
              let _xHtml = '';
              const _xEntries = Object.entries(s.combat._xpBySkill).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
              for (const [_sk, _xp] of _xEntries) {
                const _phr = Math.round(_xp / _xe * 3600);
                const _nm = GAME_DATA.skills[_sk]?.name || _sk;
                _xHtml += '<div class="xr-row"><span class="xr-skill">'+_nm+'</span><span class="xr-val">'+this.fmt(_phr)+'/hr</span></div>';
              }
              _xbEl.innerHTML = _xHtml || '<div class="xr-empty">No XP yet</div>';
            }
          }
          if (_total > 0 && s.combat._sessionStartTime) {
            const elapsed = (Date.now() - s.combat._sessionStartTime) / 1000;
            _set('sd-dps', (_total / elapsed).toFixed(1));
          }
          const _hits = (_sd.hits||0) + (_sd.misses||0);
          if (_hits > 0) _set('sd-acc', Math.round((_sd.hits||0) / _hits * 100) + '%');
          if (_sd.hits > 0) _set('sd-crit', Math.round((_sd.crits||0) / _sd.hits * 100) + '%');
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
      if (s.combat.activeBuffs.length === 0) {
        buffsEl.innerHTML = '';
      } else {
        buffsEl.innerHTML = s.combat.activeBuffs.map(buff => {
          const isTime = buff.type === 'time';
          const isHits = buff.type === 'hits';
          let label = '', ic = '', color = '';
          if (buff.stat === 'damageMult')      { label = `Dmg ×${buff.value.toFixed(2)}`; ic = '⚔'; color = '#c44040'; }
          else if (buff.stat === 'damageReduction') { label = `-${buff.value}% Dmg Taken`; ic = '🛡'; color = '#4a7ec4'; }
          else if (buff.stat === 'attackBonus')    { label = `+${buff.value} Atk`; ic = '⚡'; color = '#d4a83a'; }
          else if (buff.stat === 'strengthBonus')  { label = `+${buff.value} Str`; ic = '💪'; color = '#c44040'; }
          else if (buff.stat === 'defenceBonus')   { label = `+${buff.value} Def`; ic = '🛡'; color = '#4a7ec4'; }
          else if (buff.stat === 'rangedBonus')    { label = `+${buff.value} Rng`; ic = '🏹'; color = '#4a8a3e'; }
          else if (buff.stat === 'magicBonus')     { label = `+${buff.value} Mag`; ic = '🔮'; color = '#8a5ec4'; }
          else if (buff.stat === 'speedBonus')     { label = `+${buff.value}% Spd`; ic = '⚡'; color = '#c9873e'; }
          else if (buff.stat === 'dodgeCharges')   { label = `${buff._dodges||buff.value} Dodge${(buff._dodges||buff.value)!==1?'s':''}`; ic = '✦'; color = '#9b30d0'; }
          else if (buff.stat === 'vengeance')      { label = `Vengeance ×${buff.value}`; ic = '🔁'; color = '#c44040'; }
          else if (buff.stat === 'onKillHeal')     { label = `Heal ${buff.value}% on kill`; ic = '💉'; color = '#4abe6c'; }
          else if (buff.stat === 'runeRecovery')   { label = `Rune Save ${Math.round(buff.value*100)}%`; ic = '♦'; color = '#8a5ec4'; }
          else { label = (buff.stat||'Buff').replace(/([A-Z])/g,' $1').replace('Bonus','').trim() + ' +' + buff.value; ic = '✦'; color = '#c9873e'; }
          const durText = isTime ? `${Math.ceil(buff.remaining)}s` : isHits ? `${buff.remaining} hit${buff.remaining!==1?'s':''}` : '';
          const pct = isTime && buff._maxDuration ? Math.max(0, (buff.remaining / buff._maxDuration) * 100) : 100;
          return `<div class="buff-chip-v2" style="border-color:${color}20;background:${color}10">
            <span class="buff-chip-icon" style="color:${color}">${ic}</span>
            <div class="buff-chip-body">
              <span class="buff-chip-label" style="color:${color}">${label}</span>
              <span class="buff-chip-dur">${durText}</span>
            </div>
            ${isTime && buff._maxDuration ? `<div class="buff-chip-bar"><div class="buff-chip-fill" style="width:${pct.toFixed(0)}%;background:${color}"></div></div>` : ''}
          </div>`;
        }).join('');
      }
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

    // ── THIEVING LIVE UPDATES ──
    if (this.currentPage === 'thieving' && s.activeSkill === 'thieving') {
      // Progress bar
      const tAction = GAME_DATA.thievingTargets?.find(t => t.id === s.activeAction);
      const tProg = document.querySelector('.thiev-prog-fill');
      if (tProg && tAction) {
        const pct = Math.min(100, Math.max(0, (s.actionProgress / tAction.time) * 100));
        tProg.style.width = pct.toFixed(0) + '%';
      }
      // HP bar (updates from thievingHp state)
      const maxHpT = this.engine.getMaxHp();
      const curHpT = (s.thievingHp !== null && s.thievingHp !== undefined) ? s.thievingHp : maxHpT;
      const hFill = document.getElementById('thiev-hp-fill');
      const hVal  = document.getElementById('thiev-hp-val');
      if (hFill) {
        const pct = Math.round(curHpT / maxHpT * 100);
        hFill.style.width = pct + '%';
        hFill.style.background = pct > 60 ? '#4abe6c' : pct > 30 ? '#d4a83a' : '#c44040';
      }
      if (hVal) hVal.textContent = curHpT + '/' + maxHpT;
      // Anger bars — update each target card's anger bar in DOM
      if (s.thievingAnger) {
        for (const [targetId, anger] of Object.entries(s.thievingAnger)) {
          const pct = Math.round(anger * 100);
          // anger track in active bar
          const angerFill = document.querySelector('.thiev-anger-fill');
          if (angerFill && s.activeAction === targetId) {
            angerFill.style.width = pct + '%';
          }
          // anger in mini bars per card
          const miniBar = document.querySelector(`[data-anger-id="${targetId}"] .thiev-anger-fill-sm`);
          if (miniBar) miniBar.style.width = pct + '%';
          const miniVal = document.querySelector(`[data-anger-id="${targetId}"] .thiev-anger-pct`);
          if (miniVal) miniVal.textContent = pct + '%';
        }
      }
    }

    // ── ORE BAG LIVE UPDATE ──
    const obSection = document.querySelector('.ore-bag-section');
    if (obSection && s.oreBag) {
      const ob = s.oreBag;
      const totalInBag = Object.values(ob.contents).reduce((sum,e) => sum + (e.qty||0), 0);
      const capEl = obSection.querySelector('.ob-capacity');
      if (capEl) capEl.textContent = `${totalInBag} / ${ob.capacity}`;
      const fillEl = obSection.querySelector('.ob-fill');
      if (fillEl) fillEl.style.width = Math.min(100, totalInBag / ob.capacity * 100).toFixed(0) + '%';
      const contentsEl = obSection.querySelector('.ob-contents');
      if (contentsEl) {
        let html = '';
        for (const [oreId, entry] of Object.entries(ob.contents)) {
          if (entry.qty <= 0) continue;
          const ore = GAME_DATA.items[oreId];
          html += `<div class="ob-ore"><span class="ob-ore-name">${ore?.name||oreId}</span><span class="ob-ore-qty">x${entry.qty}</span></div>`;
        }
        if (!html) html = '<div class="ob-empty">Empty - mine ores to fill</div>';
        contentsEl.innerHTML = html;
      }
      const statsEl = obSection.querySelector('.ob-stats');
      if (statsEl) statsEl.innerHTML = `<span>Total Mined: ${this.fmt(s.miningStats?.totalMined||0)}</span><span>Events: ${s.miningStats?.eventsTriggered||0}</span>`;
    }

    // ── DAILY QUEST LIVE UPDATES ──
    if (this.currentPage === 'quests') {
      const dState = s.dailyQuests || { active:[], completed:[], progress:{} };
      const dailies = GAME_DATA.dailyQuests || [];
      const cards = document.querySelectorAll('.daily-card');
      if (cards.length > 0) {
        dailies.forEach((dq, idx) => {
          const card = cards[idx]; if (!card) return;
          const done = (dState.completed||[]).includes(dq.id);
          const prog = (dState.progress||{})[dq.id]||(dq.objectives||[]).map(()=>0);
          const pct = (dq.objectives||[]).reduce((acc,obj,i)=>acc+(prog[i]||0)/Math.max(1,obj.qty),0)/Math.max(1,(dq.objectives||[]).length)*100;
          const fill = card.querySelector('.dc-prog-fill');
          if (fill) fill.style.width = (done ? 100 : pct.toFixed(0)) + '%';
          if (done && !card.classList.contains('daily-done')) {
            card.classList.add('daily-done');
            const badge = card.querySelector('.dc-done-badge');
            if (!badge) {
              const hdr = card.querySelector('.dc-header');
              if (hdr) { const b = document.createElement('span'); b.className='dc-done-badge'; b.textContent='Complete'; hdr.appendChild(b); }
            }
          }
        });
      }
      // Also update active quest objective counts live
      const qoRows = document.querySelectorAll('.qo-row');
      if (qoRows.length > 0) {
        for (const qId of s.quests.active) {
          const q = GAME_DATA.quests.find(x=>x.id===qId); if (!q) continue;
          const prog = s.quests.progress[qId]||[];
          // Use stage objectives if multi-stage quest
          let objectives = q.objectives || [];
          if (q.stages && s.quests.stages?.[qId]) {
            const stage = q.stages.find(st => st.id === s.quests.stages[qId].currentStageId);
            if (stage?.objectives) objectives = stage.objectives;
          }
          objectives.forEach((obj, i) => {
            const count = Math.min(prog[i]||0, obj.qty);
            const row = document.querySelector(`.qo-row[data-qid="${qId}-${i}"]`);
            if (row) {
              const countEl = row.querySelector('.qo-count');
              if (countEl) countEl.textContent = `${this.fmt(count)}/${this.fmt(obj.qty)}`;
              const fillEl = row.querySelector('.qo-fill');
              if (fillEl) fillEl.style.width = Math.min(100, count/Math.max(1,obj.qty)*100).toFixed(0) + '%';
              if (count >= obj.qty && !row.classList.contains('qo-done')) {
                row.classList.add('qo-done');
                const chk = row.querySelector('.qo-check');
                if (chk) chk.textContent = '✓';
              }
            }
          });
        }
      }
    }
  }

  _getAbilityAnimSvg(abilityId, effectType) {
    // Per-ability unique animations
    const ABILITY_ANIMS = {
      power_strike: `<svg viewBox="0 0 160 160" class="ab-anim-svg"><defs><radialGradient id="ps-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#d4a83a" stop-opacity="0.9"/><stop offset="100%" stop-color="#d4a83a" stop-opacity="0"/></radialGradient></defs>
        <!-- Golden shockwave rings -->
        <circle cx="80" cy="80" r="0" fill="none" stroke="#d4a83a" stroke-width="4"><animate attributeName="r" from="0" to="70" dur="0.5s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.5s" fill="remove"/></circle>
        <circle cx="80" cy="80" r="0" fill="none" stroke="#ffd080" stroke-width="2"><animate attributeName="r" from="0" to="50" dur="0.35s" fill="remove"/><animate attributeName="opacity" from="0.8" to="0" dur="0.35s" fill="remove"/></circle>
        <!-- Power slash lines -->
        <path d="M20 140 L80 80 L140 20" stroke="#d4a83a" stroke-width="4" stroke-linecap="round" fill="none"><animate attributeName="stroke-dasharray" from="0 200" to="200 0" dur="0.3s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.4s" begin="0.2s" fill="remove"/></path>
        <path d="M30 120 L80 80 L130 30" stroke="#ffd080" stroke-width="2" fill="none"><animate attributeName="stroke-dasharray" from="0 180" to="180 0" dur="0.28s" fill="remove"/><animate attributeName="opacity" from="0.7" to="0" dur="0.35s" begin="0.25s" fill="remove"/></path>
        <!-- Impact center -->
        <circle cx="80" cy="80" r="0" fill="url(#ps-g)"><animate attributeName="r" from="0" to="30" dur="0.2s" fill="remove"/><animate attributeName="opacity" from="0.8" to="0" dur="0.3s" begin="0.1s" fill="remove"/></circle>
      </svg>`,

      rapid_shot: `<svg viewBox="0 0 160 80" class="ab-anim-svg ab-anim-wide"><g>
        <!-- 3 arrows rapid fire — opacity fades prevent static line after animation -->
        <line x1="0" y1="15" x2="150" y2="20" stroke="#4a9ed4" stroke-width="2.5"><animate attributeName="x1" from="-30" to="155" dur="0.22s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.06s" begin="0.22s" fill="remove"/></line>
        <polygon points="148,16 158,20 148,24" fill="#4a9ed4"><animate attributeName="opacity" from="1" to="0" dur="0.1s" begin="0.2s" fill="remove"/></polygon>

        <line x1="0" y1="40" x2="150" y2="40" stroke="#6ab4e8" stroke-width="2.5"><animate attributeName="x1" from="-30" to="155" dur="0.22s" begin="0.08s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.06s" begin="0.30s" fill="remove"/></line>
        <polygon points="148,36 158,40 148,44" fill="#6ab4e8"><animate attributeName="opacity" from="1" to="0" dur="0.1s" begin="0.28s" fill="remove"/></polygon>

        <line x1="0" y1="65" x2="150" y2="60" stroke="#4a9ed4" stroke-width="2.5"><animate attributeName="x1" from="-30" to="155" dur="0.22s" begin="0.16s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.06s" begin="0.38s" fill="remove"/></line>
        <polygon points="148,56 158,60 148,64" fill="#4a9ed4"><animate attributeName="opacity" from="1" to="0" dur="0.1s" begin="0.36s" fill="remove"/></polygon>

        <!-- Impact burst at target -->
        <circle cx="155" cy="40" r="0" fill="none" stroke="#4a9ed4" stroke-width="2"><animate attributeName="r" from="2" to="20" dur="0.25s" begin="0.2s" fill="remove"/><animate attributeName="opacity" from="0.8" to="0" dur="0.25s" begin="0.2s" fill="remove"/></circle>
      </g></svg>`,

      arcane_burst: `<svg viewBox="0 0 160 160" class="ab-anim-svg"><defs><radialGradient id="ab-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#9b30d0" stop-opacity="0.7"/><stop offset="100%" stop-color="#9b30d0" stop-opacity="0"/></radialGradient></defs>
        <!-- Purple void rings expanding -->
        <circle cx="80" cy="80" r="0" fill="none" stroke="#9b30d0" stroke-width="5"><animate attributeName="r" from="0" to="75" dur="0.6s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.6s" fill="remove"/></circle>
        <circle cx="80" cy="80" r="0" fill="none" stroke="#c050f0" stroke-width="3"><animate attributeName="r" from="0" to="55" dur="0.45s" fill="remove"/><animate attributeName="opacity" from="0.9" to="0" dur="0.45s" fill="remove"/></circle>
        <circle cx="80" cy="80" r="0" fill="none" stroke="#e090ff" stroke-width="2"><animate attributeName="r" from="0" to="35" dur="0.3s" fill="remove"/><animate attributeName="opacity" from="0.8" to="0" dur="0.3s" fill="remove"/></circle>
        <!-- Void core fill -->
        <circle cx="80" cy="80" r="0" fill="url(#ab-g)"><animate attributeName="r" from="0" to="40" dur="0.35s" fill="remove"/><animate attributeName="opacity" from="0.7" to="0" dur="0.4s" begin="0.1s" fill="remove"/></circle>
        <!-- Rune sparks -->
        <circle cx="80" cy="20" r="0" fill="#c050f0"><animate attributeName="r" from="0" to="5" dur="0.15s" fill="remove"/><animate attributeName="cy" from="20" to="10" dur="0.3s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.35s" fill="remove"/></circle>
        <circle cx="140" cy="80" r="0" fill="#9b30d0"><animate attributeName="r" from="0" to="4" dur="0.15s" fill="remove"/><animate attributeName="cx" from="140" to="155" dur="0.3s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.35s" fill="remove"/></circle>
        <circle cx="80" cy="140" r="0" fill="#c050f0"><animate attributeName="r" from="0" to="5" dur="0.15s" fill="remove"/><animate attributeName="cy" from="140" to="155" dur="0.3s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.35s" fill="remove"/></circle>
        <circle cx="20" cy="80" r="0" fill="#9b30d0"><animate attributeName="r" from="0" to="4" dur="0.15s" fill="remove"/><animate attributeName="cx" from="20" to="5" dur="0.3s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.35s" fill="remove"/></circle>
      </svg>`,

      shield_wall: `<svg viewBox="0 0 160 160" class="ab-anim-svg"><defs><radialGradient id="sw-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#4a7ec4" stop-opacity="0.4"/><stop offset="100%" stop-color="#4a7ec4" stop-opacity="0"/></radialGradient></defs>
        <!-- Shield shimmer fill -->
        <circle cx="80" cy="80" r="0" fill="url(#sw-g)"><animate attributeName="r" from="0" to="75" dur="0.4s" fill="remove"/><animate attributeName="opacity" from="0.8" to="0" dur="0.6s" begin="0.2s" fill="remove"/></circle>
        <!-- Hex shield pattern -->
        <path d="M80 20 L130 50 L130 110 L80 140 L30 110 L30 50Z" fill="none" stroke="#4a7ec4" stroke-width="3"><animate attributeName="opacity" from="0" to="0.8" dur="0.2s" fill="remove"/><animate attributeName="opacity" from="0.8" to="0" dur="0.5s" begin="0.3s" fill="remove"/></path>
        <path d="M80 35 L115 55 L115 105 L80 125 L45 105 L45 55Z" fill="none" stroke="#6a9ee4" stroke-width="1.5"><animate attributeName="opacity" from="0" to="0.6" dur="0.2s" fill="remove"/><animate attributeName="opacity" from="0.6" to="0" dur="0.5s" begin="0.3s" fill="remove"/></path>
        <!-- Blue shimmer lines -->
        <line x1="30" y1="80" x2="130" y2="80" stroke="#4a7ec4" stroke-width="1"><animate attributeName="opacity" from="0" to="0.5" dur="0.15s" fill="remove"/><animate attributeName="opacity" from="0.5" to="0" dur="0.4s" begin="0.25s" fill="remove"/></line>
        <line x1="80" y1="20" x2="80" y2="140" stroke="#4a7ec4" stroke-width="1"><animate attributeName="opacity" from="0" to="0.5" dur="0.15s" fill="remove"/><animate attributeName="opacity" from="0.5" to="0" dur="0.4s" begin="0.25s" fill="remove"/></line>
      </svg>`,

      battle_cry: `<svg viewBox="0 0 160 160" class="ab-anim-svg"><defs><radialGradient id="bc-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#c44040" stop-opacity="0.6"/><stop offset="100%" stop-color="#c44040" stop-opacity="0"/></radialGradient></defs>
        <!-- Red explosion rings -->
        <circle cx="80" cy="80" r="0" fill="url(#bc-g)"><animate attributeName="r" from="0" to="80" dur="0.4s" fill="remove"/><animate attributeName="opacity" from="0.7" to="0" dur="0.5s" fill="remove"/></circle>
        <circle cx="80" cy="80" r="0" fill="none" stroke="#c44040" stroke-width="5"><animate attributeName="r" from="0" to="75" dur="0.45s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.45s" fill="remove"/></circle>
        <circle cx="80" cy="80" r="0" fill="none" stroke="#ff6040" stroke-width="3"><animate attributeName="r" from="0" to="55" dur="0.32s" fill="remove"/><animate attributeName="opacity" from="0.8" to="0" dur="0.32s" fill="remove"/></circle>
        <!-- Burst lines outward -->
        <line x1="80" y1="80" x2="80" y2="10"><animate attributeName="y2" from="80" to="8" dur="0.3s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.35s" fill="remove"/> stroke="#c44040" stroke-width="2.5"/></line>
        <line x1="80" y1="80" x2="150" y2="80" stroke="#c44040" stroke-width="2.5"><animate attributeName="x2" from="80" to="152" dur="0.3s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.35s" fill="remove"/></line>
        <line x1="80" y1="80" x2="80" y2="150" stroke="#c44040" stroke-width="2.5"><animate attributeName="y2" from="80" to="152" dur="0.3s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.35s" fill="remove"/></line>
        <line x1="80" y1="80" x2="10" y2="80" stroke="#c44040" stroke-width="2.5"><animate attributeName="x2" from="80" to="8" dur="0.3s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.35s" fill="remove"/></line>
      </svg>`,

      void_step: `<svg viewBox="0 0 160 160" class="ab-anim-svg"><defs><radialGradient id="vs-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#1a0a2a" stop-opacity="0.9"/><stop offset="60%" stop-color="#5a0a9a" stop-opacity="0.4"/><stop offset="100%" stop-color="#9b30d0" stop-opacity="0"/></radialGradient></defs>
        <!-- Void collapse inward -->
        <circle cx="80" cy="80" r="75" fill="none" stroke="#9b30d0" stroke-width="3"><animate attributeName="r" from="75" to="5" dur="0.35s" fill="remove"/><animate attributeName="opacity" from="0.8" to="0" dur="0.4s" fill="remove"/></circle>
        <circle cx="80" cy="80" r="60" fill="none" stroke="#6a0aaa" stroke-width="2"><animate attributeName="r" from="60" to="3" dur="0.28s" fill="remove"/><animate attributeName="opacity" from="0.6" to="0" dur="0.32s" fill="remove"/></circle>
        <!-- Void center flash -->
        <circle cx="80" cy="80" r="0" fill="url(#vs-g)"><animate attributeName="r" from="0" to="60" dur="0.2s" begin="0.3s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.3s" begin="0.3s" fill="remove"/></circle>
        <!-- Afterimage lines -->
        <path d="M30 40 L80 80 L130 120" stroke="#9b30d0" stroke-width="1.5" stroke-dasharray="4 4" fill="none"><animate attributeName="opacity" from="0.6" to="0" dur="0.5s" fill="remove"/></path>
        <path d="M130 40 L80 80 L30 120" stroke="#9b30d0" stroke-width="1.5" stroke-dasharray="4 4" fill="none"><animate attributeName="opacity" from="0.6" to="0" dur="0.5s" fill="remove"/></path>
      </svg>`,

      blood_frenzy: `<svg viewBox="0 0 160 160" class="ab-anim-svg"><defs><radialGradient id="bf-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#8a0a0a" stop-opacity="0.6"/><stop offset="100%" stop-color="#c44040" stop-opacity="0"/></radialGradient></defs>
        <!-- Blood splatter -->
        <circle cx="80" cy="80" r="0" fill="url(#bf-g)"><animate attributeName="r" from="0" to="70" dur="0.3s" fill="remove"/><animate attributeName="opacity" from="0.8" to="0" dur="0.5s" begin="0.1s" fill="remove"/></circle>
        <!-- Drip lines -->
        <path d="M80 80 L60 30"><animate attributeName="d" from="M80 80 L80 80" to="M80 80 L60 20" dur="0.3s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.4s" fill="remove"/> stroke="#c44040" stroke-width="2"/></path>
        <path d="M80 80 L120 50" stroke="#c44040" stroke-width="2"><animate attributeName="d" from="M80 80 L80 80" to="M80 80 L130 40" dur="0.28s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.4s" fill="remove"/></path>
        <path d="M80 80 L40 110" stroke="#8a0a0a" stroke-width="2"><animate attributeName="d" from="M80 80 L80 80" to="M80 80 L30 120" dur="0.32s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.4s" fill="remove"/></path>
        <path d="M80 80 L110 130" stroke="#c44040" stroke-width="2"><animate attributeName="d" from="M80 80 L80 80" to="M80 80 L120 145" dur="0.25s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.4s" fill="remove"/></path>
        <!-- Blood drops -->
        <circle cx="80" cy="80" r="6" fill="#c44040"><animate attributeName="r" from="6" to="2" dur="0.2s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.3s" begin="0.15s" fill="remove"/></circle>
      </svg>`,

      ash_nova: `<svg viewBox="0 0 160 160" class="ab-anim-svg"><defs>
        <radialGradient id="an-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ff4000" stop-opacity="0.8"/><stop offset="60%" stop-color="#c9873e" stop-opacity="0.4"/><stop offset="100%" stop-color="#c9873e" stop-opacity="0"/></radialGradient>
      </defs>
        <!-- Massive nova explosion -->
        <circle cx="80" cy="80" r="0" fill="url(#an-g)"><animate attributeName="r" from="0" to="80" dur="0.5s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.6s" begin="0.1s" fill="remove"/></circle>
        <!-- Multiple rings -->
        <circle cx="80" cy="80" r="0" fill="none" stroke="#ff6020" stroke-width="6"><animate attributeName="r" from="0" to="78" dur="0.55s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.55s" fill="remove"/></circle>
        <circle cx="80" cy="80" r="0" fill="none" stroke="#c9873e" stroke-width="4"><animate attributeName="r" from="0" to="60" dur="0.42s" fill="remove"/><animate attributeName="opacity" from="0.9" to="0" dur="0.42s" fill="remove"/></circle>
        <circle cx="80" cy="80" r="0" fill="none" stroke="#ffd080" stroke-width="2"><animate attributeName="r" from="0" to="40" dur="0.28s" fill="remove"/><animate attributeName="opacity" from="0.8" to="0" dur="0.28s" fill="remove"/></circle>
        <!-- Ember sparks burst outward -->
        <circle cx="80" cy="80" r="3" fill="#ffd080"><animate attributeName="cy" from="80" to="10" dur="0.45s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.5s" fill="remove"/></circle>
        <circle cx="80" cy="80" r="3" fill="#ff6020"><animate attributeName="cx" from="80" to="150" dur="0.42s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.5s" fill="remove"/></circle>
        <circle cx="80" cy="80" r="3" fill="#ffd080"><animate attributeName="cy" from="80" to="150" dur="0.45s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.5s" fill="remove"/></circle>
        <circle cx="80" cy="80" r="3" fill="#ff6020"><animate attributeName="cx" from="80" to="10" dur="0.42s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.5s" fill="remove"/></circle>
        <circle cx="80" cy="80" r="2" fill="#c9873e"><animate attributeName="cx" from="80" to="145" dur="0.38s" fill="remove"/><animate attributeName="cy" from="80" to="15" dur="0.38s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.4s" fill="remove"/></circle>
        <circle cx="80" cy="80" r="2" fill="#c9873e"><animate attributeName="cx" from="80" to="15" dur="0.38s" fill="remove"/><animate attributeName="cy" from="80" to="145" dur="0.38s" fill="remove"/><animate attributeName="opacity" from="1" to="0" dur="0.4s" fill="remove"/></circle>
      </svg>`,
    };

    // Fallback by effect type
    const FALLBACKS = {
      buff: ABILITY_ANIMS.power_strike,
      defence_buff: ABILITY_ANIMS.shield_wall,
      dodge_buff: ABILITY_ANIMS.void_step,
      combat_buff: ABILITY_ANIMS.battle_cry,
      spell_burst: ABILITY_ANIMS.arcane_burst,
      nuke: ABILITY_ANIMS.ash_nova,
      multi: ABILITY_ANIMS.rapid_shot,
      on_kill_heal: ABILITY_ANIMS.blood_frenzy,
    };

    return ABILITY_ANIMS[abilityId] || FALLBACKS[effectType] || ABILITY_ANIMS.power_strike;
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
  try {
    console.log('[Init] Creating UI...');
    window.ui = new UI(game);
    console.log('[Init] Initializing game engine...');
    game.init();
    console.log('[Init] Initializing UI...');
    ui.init();
    console.log('[Init] Game ready!');
  } catch(e) {
    console.error('[Init] CRITICAL ERROR:', e);
    console.error('[Init] Stack:', e.stack);
    const main = document.getElementById('main-content');
    if (main) {
      main.innerHTML = `<div style="padding: 20px; color: #ff6b6b; font-family: monospace; white-space: pre-wrap;">
ERROR LOADING GAME:
${e.message}

${e.stack}
      </div>`;
    }
  }
});

// ============================================================
// ASHFALL IDLE — NAVIGATION SEARCH SYSTEM v1.0
// Find and navigate to skills, pages, items, and game systems
// ============================================================

class NavigationSearcher {
  constructor() {
    this.index = [];
    this.built = false;
  }

  buildIndex() {
    if (this.built) return; // Only build once
    this.built = true;
    this.index = [];

    // Skills
    if (typeof GAME_DATA !== 'undefined' && GAME_DATA.skills) {
      for (const [id, skill] of Object.entries(GAME_DATA.skills)) {
        this.index.push({
          id,
          name: skill.name,
          type: 'skill',
          pageId: id,
          icon: skill.icon || 'sparkle',
          category: 'Skills',
        });
      }
    }

    // Pages/Systems
    const pages = [
      { id: 'combat', name: 'Combat', category: 'Systems', icon: 'sword' },
      { id: 'bank', name: 'Bank', category: 'Systems', icon: 'bag' },
      { id: 'equipment', name: 'Equipment', category: 'Systems', icon: 'armor' },
      { id: 'quests', name: 'Quests', category: 'Systems', icon: 'scroll' },
      { id: 'slayer', name: 'Slayer', category: 'Systems', icon: 'target' },
      { id: 'character', name: 'Character', category: 'Systems', icon: 'person' },
      { id: 'achievements', name: 'Achievements', category: 'Systems', icon: 'trophy' },
      { id: 'prestige', name: 'Prestige', category: 'Systems', icon: 'sparkle' },
      { id: 'activity', name: 'Activity Log', category: 'Systems', icon: 'scroll' },
      { id: 'collection_log', name: 'Collection Log', category: 'Systems', icon: 'book' },
      { id: 'pets', name: 'Pets', category: 'Systems', icon: 'pet' },
      { id: 'wilderness', name: 'Wilderness', category: 'Areas', icon: 'map' },
      { id: 'dungeons', name: 'Dungeons', category: 'Areas', icon: 'cave' },
      { id: 'fight_cave', name: 'Fight Cave', category: 'Areas', icon: 'cave' },
      { id: 'bazaar', name: 'Bazaar', category: 'Trading', icon: 'shop' },
      { id: 'chat', name: 'Chat', category: 'Social', icon: 'chat' },
      { id: 'leaderboards', name: 'Leaderboards', category: 'Social', icon: 'ranking' },
    ];
    
    for (const page of pages) {
      this.index.push({
        id: page.id,
        name: page.name,
        type: 'page',
        pageId: page.id,
        icon: page.icon,
        category: page.category,
      });
    }

    // Items (popular ones, limit to keep search fast)
    if (typeof GAME_DATA !== 'undefined' && GAME_DATA.items) {
      const popular = ['oak_logs', 'copper_ore', 'bread', 'iron_pickaxe', 'bronze_sword',
                       'gold_bar', 'diamond_amulet', 'rune_essence', 'air_rune', 'oak_plank'];
      for (const itemId of popular) {
        const item = GAME_DATA.items[itemId];
        if (item) {
          this.index.push({
            id: itemId,
            name: item.name,
            type: 'item',
            icon: 'package',
            category: 'Items',
          });
        }
      }
    }

    // NPCs (sample)
    if (typeof GAME_DATA !== 'undefined' && GAME_DATA.npcs) {
      for (const [id, npc] of Object.entries(GAME_DATA.npcs).slice(0, 20)) {
        this.index.push({
          id,
          name: npc.name,
          type: 'npc',
          icon: 'person',
          category: 'NPCs',
        });
      }
    }
  }

  search(query) {
    if (!this.built) this.buildIndex();
    if (!query || query.length < 1) return [];

    const term = query.toLowerCase();
    const results = this.index.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(term);
      const idMatch = item.id.toLowerCase().includes(term);
      return nameMatch || idMatch;
    });

    // Sort by relevance (exact match first, then starts with, then contains)
    return results.sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      
      // Exact match
      if (aName === term) return -1;
      if (bName === term) return 1;
      
      // Starts with
      if (aName.startsWith(term) && !bName.startsWith(term)) return -1;
      if (bName.startsWith(term) && !aName.startsWith(term)) return 1;
      
      // Length (shorter is more relevant)
      return aName.length - bName.length;
    }).slice(0, 15); // Limit results
  }

  navigate(pageId) {
    if (typeof ui !== 'undefined') {
      ui.currentPage = pageId;
      ui.renderSidebar();
      ui.renderPage(pageId);
    }
  }
}

const navigationSearcher = new NavigationSearcher();

// ============================================================
// ASHFALL IDLE — SMART GLOBAL SEARCH SYSTEM v2.0
// Unified search for everything: skills, items, monsters, NPCs, quests, etc
// ============================================================

class SmartSearchEngine {
  constructor() {
    this.index = [];
    this.searchHistory = [];
    this.maxHistory = 20;
    this.built = false;
    this.debounceTimer = null;
  }

  buildIndex() {
    if (this.built && Object.keys(GAME_DATA).length > 0) return;
    
    this.index = [];

    // === SKILLS ===
    if (GAME_DATA.skills) {
      for (const [id, skill] of Object.entries(GAME_DATA.skills)) {
        this.index.push({
          type: 'skill',
          id,
          name: skill.name,
          icon: skill.icon || 'sparkle',
          category: 'Skills',
          description: skill.description || '',
          action: () => ui.renderPage(id),
        });
      }
    }

    // === ITEMS ===
    if (GAME_DATA.items) {
      for (const [id, item] of Object.entries(GAME_DATA.items)) {
        if (!item.name) continue;
        this.index.push({
          type: 'item',
          id,
          name: item.name,
          icon: 'package',
          category: 'Items',
          description: `${item.type || 'item'}${item.stats ? ' • ' + Object.keys(item.stats).join(', ') : ''}`,
          rarity: item.rarity,
          action: () => {
            ui.currentPage = 'bank';
            ui.renderSidebar();
            ui.renderPage('bank');
            // Try to highlight the item
            setTimeout(() => {
              const itemEl = document.querySelector(`[data-item-id="${id}"]`);
              if (itemEl) itemEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 200);
          },
        });
      }
    }

    // === MONSTERS ===
    if (GAME_DATA.monsters) {
      for (const [id, monster] of Object.entries(GAME_DATA.monsters)) {
        this.index.push({
          type: 'monster',
          id,
          name: monster.name,
          icon: 'skull',
          category: 'Monsters',
          description: `Level ${monster.combatLevel} • ${monster.hitpoints} HP`,
          action: () => {
            ui.engine.startCombat(id, false);
            ui.currentPage = 'combat';
            ui.renderSidebar();
            ui.renderPage('combat');
          },
        });
      }
    }

    // === QUESTS ===
    if (GAME_DATA.quests) {
      for (const quest of GAME_DATA.quests) {
        this.index.push({
          type: 'quest',
          id: quest.id,
          name: quest.name,
          icon: 'scroll',
          category: 'Quests',
          description: quest.series ? `${quest.series} • Difficulty: ${quest.difficulty || 'Medium'}` : `Difficulty: ${quest.difficulty || 'Medium'}`,
          action: () => {
            ui.currentPage = 'quests';
            ui.renderSidebar();
            ui.renderPage('quests');
            setTimeout(() => {
              const questEl = document.querySelector(`[data-quest-id="${quest.id}"]`);
              if (questEl) questEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 200);
          },
        });
      }
    }

    // === NPCs ===
    if (GAME_DATA.npcs) {
      for (const [id, npc] of Object.entries(GAME_DATA.npcs)) {
        this.index.push({
          type: 'npc',
          id,
          name: npc.name,
          icon: 'person',
          category: 'NPCs',
          description: npc.title || 'NPC',
          action: () => {
            ui.currentPage = 'quests';
            ui.renderSidebar();
            ui.renderPage('quests');
          },
        });
      }
    }

    // === LOCATIONS / PAGES ===
    const pages = [
      { id: 'combat', name: 'Combat', category: 'Pages', icon: 'sword', desc: 'Fight monsters' },
      { id: 'bank', name: 'Bank', category: 'Pages', icon: 'bag', desc: 'Manage items' },
      { id: 'equipment', name: 'Equipment', category: 'Pages', icon: 'armor', desc: 'Equip items' },
      { id: 'quests', name: 'Quests', category: 'Pages', icon: 'scroll', desc: 'Quest log' },
      { id: 'slayer', name: 'Slayer', category: 'Pages', icon: 'target', desc: 'Slayer tasks' },
      { id: 'character', name: 'Character', category: 'Pages', icon: 'person', desc: 'Stats & info' },
      { id: 'achievements', name: 'Achievements', category: 'Pages', icon: 'trophy', desc: 'Milestones' },
      { id: 'prestige', name: 'Prestige', category: 'Pages', icon: 'sparkle', desc: 'Reset & rebirth' },
      { id: 'activity', name: 'Activity Log', category: 'Pages', icon: 'scroll', desc: 'Event history' },
      { id: 'collection_log', name: 'Collection Log', category: 'Pages', icon: 'book', desc: 'Loot tracker' },
      { id: 'pets', name: 'Pets', category: 'Pages', icon: 'pet', desc: 'Pet companions' },
      { id: 'wilderness', name: 'Wilderness', category: 'Areas', icon: 'map', desc: 'PvP zone' },
      { id: 'dungeons', name: 'Dungeons', category: 'Areas', icon: 'cave', desc: 'Dungeon raids' },
      { id: 'fight_cave', name: 'Fight Cave', category: 'Areas', icon: 'cave', desc: '63-wave gauntlet' },
      { id: 'bazaar', name: 'Bazaar', category: 'Trading', icon: 'shop', desc: 'Trading post' },
      { id: 'chat', name: 'Chat', category: 'Social', icon: 'chat', desc: 'Global chat' },
      { id: 'leaderboards', name: 'Leaderboards', category: 'Social', icon: 'ranking', desc: 'Rankings' },
    ];

    for (const page of pages) {
      this.index.push({
        type: 'page',
        id: page.id,
        name: page.name,
        icon: page.icon,
        category: page.category,
        description: page.desc,
        action: () => {
          ui.currentPage = page.id;
          ui.renderSidebar();
          ui.renderPage(page.id);
        },
      });
    }

    this.built = true;
  }

  search(query) {
    if (!this.built) this.buildIndex();
    if (!query || query.length < 1) return [];

    const term = query.toLowerCase();
    let results = this.index.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(term);
      const descMatch = item.description.toLowerCase().includes(term);
      const idMatch = item.id.toLowerCase().includes(term);
      return nameMatch || descMatch || idMatch;
    });

    // Score and sort by relevance
    results = results.map(item => {
      const name = item.name.toLowerCase();
      const term_lower = term;
      
      let score = 0;
      if (name === term_lower) score += 100; // Exact match
      else if (name.startsWith(term_lower)) score += 50; // Starts with
      else if (name.includes(' ' + term_lower)) score += 40; // Word boundary
      else score += 10; // Contains

      // Boost by type popularity
      const typeBoost = { skill: 5, item: 3, monster: 3, page: 4, quest: 3, npc: 2 };
      score += (typeBoost[item.type] || 0);

      return { ...item, score };
    }).sort((a, b) => b.score - a.score).slice(0, 20);

    return results;
  }

  addToHistory(result) {
    this.searchHistory = this.searchHistory.filter(r => r.id !== result.id);
    this.searchHistory.unshift(result);
    if (this.searchHistory.length > this.maxHistory) {
      this.searchHistory.pop();
    }
  }

  getHistory() {
    return this.searchHistory;
  }

  clearHistory() {
    this.searchHistory = [];
  }
}

const smartSearch = new SmartSearchEngine();
