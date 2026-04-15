// ============================================================
// ASHFALL IDLE - UI Layer
// ============================================================

const ICONS = {
  axe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 12l-8.5 8.5a2.12 2.12 0 01-3-3L11 9"/><path d="M15 13L9.6 7.6a2 2 0 010-2.83l.7-.7a2 2 0 012.83 0L18 9.7"/><path d="M15.5 3.5l5 5"/></svg>',
  pickaxe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2.5l5 5-8 8-5-5z"/><path d="M3 21l6-6"/></svg>',
  fish:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.5 12c1-4 4-7 8-7 2 0 4 1 5.5 3-1.5 2-3.5 3-5.5 3 4 0 5.5 1 5.5 3-1.5 2-3.5 3-5.5 3-4 0-7-3-8-7z"/><circle cx="15" cy="10" r="1"/><path d="M2 12s2-2 4.5-2c0 0-2.5 2-2.5 2s2.5 2 2.5 2c-2.5 0-4.5-2-4.5-2z"/></svg>',
  herb:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22V10"/><path d="M6 8c0-4 6-4 6 0"/><path d="M18 8c0-4-6-4-6 0"/><path d="M4 14c0-4 8-4 8 0"/><path d="M20 14c0-4-8-4-8 0"/></svg>',
  cauldron:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="10" rx="8" ry="4"/><path d="M4 10v4c0 2.21 3.58 4 8 4s8-1.79 8-4v-4"/><path d="M8 3v4"/><path d="M12 2v4"/><path d="M16 3v4"/></svg>',
  anvil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 18h16"/><path d="M4 18V14a4 4 0 014-4h12v8"/><path d="M8 10V6a2 2 0 012-2h2"/></svg>',
  bow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 4c0 8-4 14-14 14"/><line x1="18" y1="4" x2="4" y2="18"/><line x1="18" y1="4" x2="22" y2="2"/></svg>',
  ring:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="14" r="6"/><path d="M12 8V2"/><path d="M9 5l3-3 3 3"/></svg>',
  potion:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2h4v4l4 10a4 4 0 01-4 4h-4a4 4 0 01-4-4L10 6V2z"/><line x1="10" y1="2" x2="14" y2="2"/></svg>',
  sparkle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/></svg>',
  sword:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 3.5L21 10l-7 7-7-7z"/><path d="M3 21l4-4"/><path d="M7 17l-2 2"/></svg>',
  fist:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 11V7a2 2 0 014 0v2m0 0V6a2 2 0 014 0v3m0 0V8a2 2 0 014 0v6a8 8 0 01-8 8H9a6 6 0 01-6-6v-2a2 2 0 014 0"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/></svg>',
  target:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>',
  wand:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 4l-1 1 4 4 1-1a2.83 2.83 0 00-4-4z"/><path d="M14 5L3 16l4 4 11-11z"/></svg>',
  seedling:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22v-8"/><path d="M6 10c0-4.4 6-4.4 6 0"/><path d="M18 10c0-4.4-6-4.4-6 0"/><path d="M12 14c-4 0-8-2-8-6 0 0 4 2 8 2s8-2 8-2c0 4-4 6-8 6z"/></svg>',
  mask:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10c0-6 16-6 16 0l-2 8H6z"/><circle cx="9" cy="11" r="1.5"/><circle cx="15" cy="11" r="1.5"/></svg>',
  coin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M8 10h8"/><path d="M8 14h8"/></svg>',
  bank:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a4 4 0 00-8 0v2"/></svg>',
  shop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9h18v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M3 9l1.5-5h15L21 9"/><path d="M12 14v3"/></svg>',
  combat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20L14 10l6 6"/><path d="M14 4l6 6"/><path d="M18 2l4 4"/></svg>',
  dungeon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 20h20"/><rect x="4" y="8" width="6" height="12"/><rect x="14" y="8" width="6" height="12"/><path d="M7 4l5-2 5 2"/></svg>',
  trophy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H3V6a2 2 0 012-2h1"/><path d="M18 9h3V6a2 2 0 00-2-2h-1"/><path d="M6 4h12v8a6 6 0 01-12 0V4z"/><path d="M12 18v4"/><path d="M8 22h8"/></svg>',
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
  settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  stats:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>',
};

function getIcon(name, size = 18) {
  return `<span class="icon" style="width:${size}px;height:${size}px">${ICONS[name] || ICONS.sparkle}</span>`;
}

// ── NAV ITEMS ────────────────────────────────────────────
const NAV_SECTIONS = [
  { header: 'Gathering', items: [
    { id:'woodcutting', label:'Woodcutting', icon:'axe' },
    { id:'mining',      label:'Mining',      icon:'pickaxe' },
    { id:'fishing',     label:'Fishing',     icon:'fish' },
    { id:'foraging',    label:'Foraging',    icon:'herb' },
  ]},
  { header: 'Artisan', items: [
    { id:'cooking',   label:'Cooking',    icon:'cauldron' },
    { id:'smithing',  label:'Smithing',   icon:'anvil' },
    { id:'fletching', label:'Fletching',  icon:'bow' },
    { id:'crafting',  label:'Crafting',   icon:'ring' },
    { id:'alchemy',   label:'Alchemy',    icon:'potion' },
    { id:'enchanting',label:'Enchanting', icon:'sparkle' },
  ]},
  { header: 'Combat', items: [
    { id:'combat',   label:'Combat',   icon:'combat' },
    { id:'dungeons', label:'Dungeons', icon:'dungeon' },
  ]},
  { header: 'Support', items: [
    { id:'farming',  label:'Farming',  icon:'seedling' },
    { id:'thieving', label:'Thieving', icon:'mask' },
  ]},
  { header: 'General', items: [
    { id:'bank',        label:'Bank',         icon:'bank' },
    { id:'shop',        label:'Shop',         icon:'shop' },
    { id:'equipment',   label:'Equipment',    icon:'shield' },
    { id:'achievements',label:'Achievements', icon:'trophy' },
    { id:'wiki',        label:'Wiki',         icon:'book' },
    { id:'statistics',  label:'Statistics',   icon:'stats' },
    { id:'settings_page',label:'Settings',    icon:'settings' },
  ]},
];

class UI {
  constructor(engine) {
    this.engine = engine;
    this.currentPage = 'woodcutting';
    this.toasts = [];
  }

  init() {
    this.renderSidebar();
    this.renderPage(this.currentPage);
    this.bindEvents();

    this.engine.on('tick', () => this.onTick());
    this.engine.on('notification', (n) => this.showToast(n));
    this.engine.on('levelup', () => { this.renderSidebar(); this.renderPage(this.currentPage); });
    this.engine.on('skillStart', () => this.renderPage(this.currentPage));
    this.engine.on('skillStop', () => this.renderPage(this.currentPage));
    this.engine.on('combatStart', () => { this.currentPage = 'combat'; this.renderPage('combat'); });
    this.engine.on('combatStop', () => this.renderPage(this.currentPage));
    this.engine.on('equipmentChanged', () => { if (this.currentPage === 'equipment') this.renderPage('equipment'); });
    this.engine.on('farmingChanged', () => { if (this.currentPage === 'farming') this.renderPage('farming'); });
    this.engine.on('foodChanged', () => {});
    this.engine.on('init', () => { this.renderSidebar(); this.renderPage(this.currentPage); });
  }

  // ── SIDEBAR ────────────────────────────────────────────
  renderSidebar() {
    const sb = document.getElementById('sidebar');
    const s = this.engine.state;
    let html = `<div class="sidebar-header">
      <div class="logo-text">ASHFALL</div>
      <div class="logo-sub">IDLE</div>
    </div>
    <div class="player-info">
      <div class="pi-row"><span>Combat Lvl</span><span class="pi-val">${this.engine.getCombatLevel()}</span></div>
      <div class="pi-row"><span>Total Lvl</span><span class="pi-val">${this.engine.getTotalLevel()}</span></div>
      <div class="pi-row"><span>${getIcon('coin',14)} Gold</span><span class="pi-val gold-val">${this.formatNum(s.gold)}</span></div>
    </div>`;

    for (const section of NAV_SECTIONS) {
      html += `<div class="nav-section"><div class="nav-header">${section.header}</div>`;
      for (const item of section.items) {
        const active = this.currentPage === item.id ? ' active' : '';
        let levelBadge = '';
        if (s.skills[item.id]) {
          levelBadge = `<span class="nav-level">${s.skills[item.id].level}</span>`;
        }
        html += `<div class="nav-item${active}" data-page="${item.id}">
          ${getIcon(item.icon, 16)}
          <span class="nav-label">${item.label}</span>
          ${levelBadge}
        </div>`;
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

  // ── MAIN CONTENT ───────────────────────────────────────
  renderPage(pageId) {
    const main = document.getElementById('main-content');
    const skill = GAME_DATA.skills[pageId];

    if (skill && (skill.type === 'gathering' || skill.type === 'artisan')) {
      this.renderSkillPage(main, pageId, skill);
    } else if (pageId === 'thieving') {
      this.renderThievingPage(main);
    } else if (pageId === 'combat') {
      this.renderCombatPage(main);
    } else if (pageId === 'dungeons') {
      this.renderDungeonsPage(main);
    } else if (pageId === 'farming') {
      this.renderFarmingPage(main);
    } else if (pageId === 'bank') {
      this.renderBankPage(main);
    } else if (pageId === 'shop') {
      this.renderShopPage(main);
    } else if (pageId === 'equipment') {
      this.renderEquipmentPage(main);
    } else if (pageId === 'achievements') {
      this.renderAchievementsPage(main);
    } else if (pageId === 'wiki') {
      this.renderWikiPage(main);
    } else if (pageId === 'statistics') {
      this.renderStatsPage(main);
    } else if (pageId === 'settings_page') {
      this.renderSettingsPage(main);
    } else if (pageId === 'enchanting') {
      main.innerHTML = this.pageHeader('Enchanting', 'sparkle', 'Enchanting will be available in a future update. Train other skills to prepare.', 'enchanting');
    } else {
      main.innerHTML = `<div class="page-empty">Select a skill or page from the sidebar.</div>`;
    }
  }

  pageHeader(title, icon, desc, skillId) {
    const s = this.engine.state;
    let skillBar = '';
    if (skillId && s.skills[skillId]) {
      const sk = s.skills[skillId];
      const progress = this.engine.getXpProgress(skillId);
      const nextXp = sk.level >= 99 ? 'MAX' : this.formatNum(this.engine.getXpForLevel(sk.level + 1) - sk.xp);
      skillBar = `<div class="skill-header-bar">
        <div class="sh-level">Level ${sk.level}</div>
        <div class="sh-xp-bar"><div class="sh-xp-fill" style="width:${(progress*100).toFixed(1)}%"></div></div>
        <div class="sh-xp-text">${this.formatNum(sk.xp)} XP ${sk.level < 99 ? `(${nextXp} to next)` : ''}</div>
      </div>`;
    }
    return `<div class="page-header">
      <div class="ph-icon">${getIcon(icon, 32)}</div>
      <div class="ph-info"><h1>${title}</h1><p>${desc}</p></div>
    </div>${skillBar}`;
  }

  // ── SKILL PAGES ────────────────────────────────────────
  renderSkillPage(el, skillId, skill) {
    const s = this.engine.state;
    let actions = [];
    if (skill.type === 'gathering') {
      actions = GAME_DATA.gatheringActions[skillId] || [];
    } else {
      actions = GAME_DATA.recipes[skillId] || [];
    }

    let html = this.pageHeader(skill.name, skill.icon, skill.desc, skillId);

    // Active action indicator
    if (s.activeSkill === skillId && s.activeAction) {
      const action = actions.find(a => a.id === s.activeAction);
      if (action) {
        const timeReduction = 1 + (this.engine.getMasteryLevel(skillId, action.masteryId || action.id) * 0.005);
        const actionTime = action.time / timeReduction;
        const progress = Math.min(1, s.actionProgress / actionTime);
        html += `<div class="active-action-bar">
          <div class="aa-label">Training: ${action.name}</div>
          <div class="aa-progress"><div class="aa-fill" style="width:${(progress*100).toFixed(0)}%"></div></div>
          <button class="btn btn-danger btn-sm aa-stop" onclick="ui.stopAction()">Stop</button>
        </div>`;
      }
    }

    html += '<div class="actions-grid">';
    for (const action of actions) {
      const locked = s.skills[skillId].level < action.level;
      const isActive = s.activeSkill === skillId && s.activeAction === action.id;
      const mastery = this.engine.getMasteryLevel(skillId, action.masteryId || action.id);

      let inputHtml = '';
      if (action.input) {
        inputHtml = '<div class="recipe-inputs">';
        for (const inp of action.input) {
          const item = GAME_DATA.items[inp.item];
          const have = s.bank[inp.item] || 0;
          const enough = have >= inp.qty;
          inputHtml += `<span class="recipe-mat ${enough ? '' : 'mat-missing'}">${item?.name || inp.item} x${inp.qty} <small>(${have})</small></span>`;
        }
        inputHtml += '</div>';
      }

      let outputHtml = '';
      if (action.output) {
        const outItem = GAME_DATA.items[action.output.item];
        outputHtml = `<div class="recipe-output">${outItem?.name || action.output.item}${action.output.qty > 1 ? ' x' + action.output.qty : ''}</div>`;
      }
      if (action.loot) {
        outputHtml = `<div class="recipe-output">${action.loot.map(l => {
          const item = GAME_DATA.items[l.item];
          return (item?.name || l.item) + (l.qty > 1 ? ' x' + l.qty : '');
        }).join(', ')}</div>`;
      }

      html += `<div class="action-card ${locked ? 'locked' : ''} ${isActive ? 'active' : ''}" ${locked ? '' : `onclick="ui.startAction('${skillId}','${action.id}')"`}>
        <div class="ac-header">
          <span class="ac-name">${action.name}</span>
          <span class="ac-level">Lv ${action.level}</span>
        </div>
        ${inputHtml}
        ${outputHtml}
        <div class="ac-footer">
          <span class="ac-xp">+${action.xp} XP</span>
          <span class="ac-time">${action.time}s</span>
          ${mastery > 0 ? `<span class="ac-mastery">M:${mastery}</span>` : ''}
        </div>
        ${locked ? `<div class="locked-overlay">Requires Level ${action.level}</div>` : ''}
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  // ── THIEVING ───────────────────────────────────────────
  renderThievingPage(el) {
    const s = this.engine.state;
    let html = this.pageHeader('Thieving', 'mask', GAME_DATA.skills.thieving.desc, 'thieving');

    if (s.activeSkill === 'thieving' && s.activeAction) {
      const action = GAME_DATA.thievingTargets.find(a => a.id === s.activeAction);
      if (action) {
        const progress = Math.min(1, Math.max(0, s.actionProgress / action.time));
        html += `<div class="active-action-bar">
          <div class="aa-label">Pickpocketing: ${action.name}</div>
          <div class="aa-progress"><div class="aa-fill" style="width:${(progress*100).toFixed(0)}%"></div></div>
          <button class="btn btn-danger btn-sm aa-stop" onclick="ui.stopAction()">Stop</button>
        </div>`;
      }
    }

    html += '<div class="actions-grid">';
    for (const target of GAME_DATA.thievingTargets) {
      const locked = s.skills.thieving.level < target.level;
      const isActive = s.activeSkill === 'thieving' && s.activeAction === target.id;
      html += `<div class="action-card ${locked ? 'locked' : ''} ${isActive ? 'active' : ''}" ${locked ? '' : `onclick="ui.startAction('thieving','${target.id}')"`}>
        <div class="ac-header"><span class="ac-name">${target.name}</span><span class="ac-level">Lv ${target.level}</span></div>
        <div class="recipe-output">Gold: ${target.gold.min}-${target.gold.max}</div>
        <div class="ac-footer">
          <span class="ac-xp">+${target.xp} XP</span>
          <span class="ac-time">${target.time}s</span>
          <span class="ac-mastery">Stun: ${(target.stunChance*100).toFixed(0)}%</span>
        </div>
        ${locked ? `<div class="locked-overlay">Requires Level ${target.level}</div>` : ''}
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  // ── COMBAT ─────────────────────────────────────────────
  renderCombatPage(el) {
    const s = this.engine.state;
    const c = s.combat;

    let html = this.pageHeader('Combat', 'combat', 'Fight monsters to earn XP, gold, and loot.', null);

    // Combat stats
    html += `<div class="combat-stats-bar">
      <span>Atk: ${s.skills.attack.level}</span>
      <span>Str: ${s.skills.strength.level}</span>
      <span>Def: ${s.skills.defence.level}</span>
      <span>HP: ${s.skills.hitpoints.level}</span>
      <span>Rng: ${s.skills.ranged.level}</span>
      <span>Mag: ${s.skills.magic.level}</span>
      <span>Style: ${c.combatStyle}</span>
    </div>`;

    // Combat style selector
    html += `<div class="combat-style-select">
      <button class="btn btn-sm ${c.combatStyle==='melee'?'btn-active':''}" onclick="ui.setCombatStyle('melee')">Melee</button>
      <button class="btn btn-sm ${c.combatStyle==='ranged'?'btn-active':''}" onclick="ui.setCombatStyle('ranged')">Ranged</button>
      <button class="btn btn-sm ${c.combatStyle==='magic'?'btn-active':''}" onclick="ui.setCombatStyle('magic')">Magic</button>
    </div>`;

    // Spell selector for magic
    if (c.combatStyle === 'magic') {
      html += '<div class="spell-select"><span class="spell-label">Spell:</span>';
      for (const spell of GAME_DATA.spells) {
        const locked = s.skills.magic.level < spell.level;
        const active = c.selectedSpell === spell.id;
        html += `<button class="btn btn-sm spell-btn ${active?'btn-active':''} ${locked?'locked':''}" ${locked?'disabled':''} onclick="ui.selectSpell('${spell.id}')" title="${spell.desc} (${spell.runes.map(r=>GAME_DATA.items[r.item].name+' x'+r.qty).join(', ')})">${spell.name}</button>`;
      }
      html += '</div>';
    }

    // Food display
    html += `<div class="food-bar">
      <span class="food-label">Food:</span>
      ${s.food.equipped ? `<span class="food-item">${GAME_DATA.items[s.food.equipped]?.name} x${s.food.qty}</span>` : '<span class="food-empty">None equipped</span>'}
      <button class="btn btn-sm" onclick="ui.eatManual()">Eat</button>
      <label class="auto-eat-label"><input type="checkbox" ${c.autoEat?'checked':''} onchange="ui.toggleAutoEat()"> Auto-Eat</label>
    </div>`;

    if (c.active && c.monster) {
      // Active combat view
      const monster = GAME_DATA.monsters[c.monster];
      const maxHp = this.engine.getMaxHp();
      const playerHpPct = Math.max(0, (c.playerHp / maxHp * 100));
      const monsterHpPct = Math.max(0, (c.monsterHp / monster.hp * 100));

      html += `<div class="combat-arena">
        <div class="combatant player-side">
          <div class="combatant-name">You</div>
          <div class="hp-bar"><div class="hp-fill player-hp" style="width:${playerHpPct.toFixed(1)}%"></div></div>
          <div class="hp-text">${Math.max(0,c.playerHp)} / ${maxHp}</div>
        </div>
        <div class="combat-vs">VS</div>
        <div class="combatant monster-side">
          <div class="combatant-name">${monster.name} <small>(Lv ${monster.combatLevel})</small></div>
          <div class="hp-bar"><div class="hp-fill monster-hp" style="width:${monsterHpPct.toFixed(1)}%"></div></div>
          <div class="hp-text">${Math.max(0,Math.ceil(c.monsterHp))} / ${monster.hp}</div>
        </div>
      </div>`;

      if (c.dungeon) {
        const dungeon = GAME_DATA.dungeons.find(d => d.id === c.dungeon);
        html += `<div class="dungeon-progress">Dungeon: ${dungeon.name} - Wave ${c.dungeonWave + 1}/${dungeon.waves.length}</div>`;
      }

      html += `<button class="btn btn-danger" onclick="game.stopCombat()">Flee</button>`;
    } else {
      // Area selection
      html += '<h2 class="section-title">Combat Areas</h2><div class="actions-grid">';
      for (const area of GAME_DATA.combatAreas) {
        const locked = this.engine.getCombatLevel() < area.levelReq;
        html += `<div class="action-card area-card ${locked ? 'locked' : ''}">
          <div class="ac-header"><span class="ac-name">${area.name}</span><span class="ac-level">Cb Lv ${area.levelReq}</span></div>
          <p class="area-desc">${area.desc}</p>
          <div class="area-monsters">`;
        for (const mId of area.monsters) {
          const m = GAME_DATA.monsters[mId];
          html += `<button class="btn btn-sm monster-btn" ${locked?'disabled':''} onclick="game.startCombat('${area.id}','${mId}')">${m.name} <small>(Lv ${m.combatLevel})</small></button>`;
        }
        html += `</div>${locked ? `<div class="locked-overlay">Combat Lv ${area.levelReq}</div>` : ''}</div>`;
      }
      html += '</div>';
    }
    el.innerHTML = html;
  }

  // ── DUNGEONS ───────────────────────────────────────────
  renderDungeonsPage(el) {
    let html = this.pageHeader('Dungeons', 'dungeon', 'Multi-wave combat gauntlets with unique rewards.', null);
    html += '<div class="actions-grid">';
    for (const dg of GAME_DATA.dungeons) {
      const locked = this.engine.getCombatLevel() < dg.levelReq;
      html += `<div class="action-card ${locked ? 'locked' : ''}">
        <div class="ac-header"><span class="ac-name">${dg.name}</span><span class="ac-level">Cb Lv ${dg.levelReq}</span></div>
        <p class="area-desc">${dg.desc}</p>
        <div class="ac-footer"><span>${dg.waves.length} waves</span></div>
        <div class="dungeon-rewards">Rewards: ${dg.rewards.map(r => GAME_DATA.items[r.item]?.name || r.item).join(', ')}</div>
        <button class="btn btn-sm" ${locked?'disabled':''} onclick="game.startDungeon('${dg.id}')">Enter Dungeon</button>
        ${locked ? `<div class="locked-overlay">Combat Lv ${dg.levelReq}</div>` : ''}
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  // ── FARMING ────────────────────────────────────────────
  renderFarmingPage(el) {
    const s = this.engine.state;
    let html = this.pageHeader('Farming', 'seedling', GAME_DATA.skills.farming.desc, 'farming');

    // Plots
    html += '<div class="farm-plots">';
    for (let i = 0; i < s.farming.plots.length; i++) {
      const plot = s.farming.plots[i];
      let plotContent = '';
      if (plot.seed) {
        const seed = GAME_DATA.items[plot.seed];
        if (plot.ready) {
          plotContent = `<div class="plot-ready">${seed.name.replace(' Seed','')} - READY</div>
            <button class="btn btn-sm btn-success" onclick="game.harvestPlot(${i})">Harvest</button>`;
        } else {
          const elapsed = Date.now() - plot.plantedAt;
          const pct = Math.min(100, (elapsed / plot.growTime * 100));
          const remaining = Math.max(0, Math.ceil((plot.growTime - elapsed) / 1000));
          plotContent = `<div class="plot-growing">${seed.name.replace(' Seed','')}</div>
            <div class="sh-xp-bar"><div class="sh-xp-fill growing-fill" style="width:${pct.toFixed(1)}%"></div></div>
            <div class="plot-timer">${this.formatTime(remaining)}</div>`;
        }
      } else {
        plotContent = `<div class="plot-empty">Empty Plot</div>`;
      }
      html += `<div class="farm-plot">${plotContent}</div>`;
    }
    html += '</div>';

    // Seed inventory
    html += '<h2 class="section-title">Available Seeds</h2><div class="actions-grid">';
    const seeds = Object.entries(GAME_DATA.items).filter(([,v]) => v.type === 'seed');
    for (const [id, seed] of seeds) {
      const qty = s.bank[id] || 0;
      const emptyPlot = s.farming.plots.findIndex(p => !p.seed);
      html += `<div class="action-card ${qty <= 0 ? 'locked' : ''}">
        <div class="ac-header"><span class="ac-name">${seed.name}</span><span class="ac-level">x${qty}</span></div>
        <div class="recipe-output">Grows: ${GAME_DATA.items[seed.yield]?.name || seed.yield}</div>
        <div class="ac-footer"><span class="ac-time">${this.formatTime(seed.growTime)}</span></div>
        <button class="btn btn-sm" ${qty <= 0 || emptyPlot < 0 ? 'disabled' : ''} onclick="game.plantSeed(${emptyPlot},'${id}')">Plant</button>
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  // ── BANK ───────────────────────────────────────────────
  renderBankPage(el) {
    const s = this.engine.state;
    const entries = Object.entries(s.bank).filter(([,qty]) => qty > 0).sort((a,b) => a[0].localeCompare(b[0]));
    let html = this.pageHeader('Bank', 'bank', `${entries.length} unique items stored.`, null);
    html += `<div class="bank-gold">${getIcon('coin',20)} ${this.formatNum(s.gold)} Gold</div>`;
    html += '<div class="bank-grid">';
    for (const [itemId, qty] of entries) {
      const item = GAME_DATA.items[itemId];
      if (!item) continue;
      const isEquippable = item.slot || item.type === 'food' || item.type === 'potion' || item.type === 'ammo';
      html += `<div class="bank-item" title="${item.desc}">
        <div class="bi-name">${item.name}</div>
        <div class="bi-qty">x${this.formatNum(qty)}</div>
        <div class="bi-actions">
          ${item.slot ? `<button class="btn btn-xs" onclick="game.equipItem('${itemId}')">Equip</button>` : ''}
          ${item.type === 'food' || item.type === 'potion' ? `<button class="btn btn-xs" onclick="game.equipFood('${itemId}')">Eat/Use</button>` : ''}
          ${item.type === 'ammo' ? `<button class="btn btn-xs" onclick="game.equipItem('${itemId}'); game.state.equipment.ammo='${itemId}';">Equip</button>` : ''}
          ${item.sellPrice > 0 ? `<button class="btn btn-xs btn-sell" onclick="game.sellItem('${itemId}',1)">Sell (${item.sellPrice}g)</button>` : ''}
          ${item.sellPrice > 0 && qty >= 10 ? `<button class="btn btn-xs btn-sell" onclick="game.sellItem('${itemId}',${qty})">Sell All</button>` : ''}
        </div>
      </div>`;
    }
    if (entries.length === 0) html += '<div class="bank-empty">Your bank is empty. Start gathering resources!</div>';
    html += '</div>';
    el.innerHTML = html;
  }

  // ── SHOP ───────────────────────────────────────────────
  renderShopPage(el) {
    const s = this.engine.state;
    let html = this.pageHeader('Shop', 'shop', 'Buy supplies and equipment.', null);
    html += `<div class="bank-gold">${getIcon('coin',20)} ${this.formatNum(s.gold)} Gold</div>`;

    const categories = [...new Set(GAME_DATA.shop.map(i => i.category))];
    for (const cat of categories) {
      html += `<h2 class="section-title">${cat.charAt(0).toUpperCase() + cat.slice(1)}</h2><div class="actions-grid">`;
      for (let i = 0; i < GAME_DATA.shop.length; i++) {
        const si = GAME_DATA.shop[i];
        if (si.category !== cat) continue;
        const item = GAME_DATA.items[si.item];
        if (!item) continue;
        const canAfford = s.gold >= si.price;
        html += `<div class="action-card shop-card ${canAfford ? '' : 'locked'}">
          <div class="ac-header"><span class="ac-name">${item.name}</span><span class="ac-level">${si.price}g</span></div>
          <p class="area-desc">${item.desc}</p>
          <div class="shop-btns">
            <button class="btn btn-sm" ${canAfford?'':'disabled'} onclick="game.buyItem(${i},1)">Buy 1</button>
            <button class="btn btn-sm" ${s.gold>=si.price*10?'':'disabled'} onclick="game.buyItem(${i},10)">Buy 10</button>
          </div>
        </div>`;
      }
      html += '</div>';
    }
    el.innerHTML = html;
  }

  // ── EQUIPMENT ──────────────────────────────────────────
  renderEquipmentPage(el) {
    const s = this.engine.state;
    let html = this.pageHeader('Equipment', 'shield', 'Manage your gear.', null);

    // Equipment slots
    html += '<div class="equip-grid">';
    for (const slot of GAME_DATA.equipmentSlots) {
      const itemId = s.equipment[slot];
      const item = itemId ? GAME_DATA.items[itemId] : null;
      html += `<div class="equip-slot">
        <div class="es-label">${slot.charAt(0).toUpperCase() + slot.slice(1)}</div>
        <div class="es-item ${item ? '' : 'es-empty'}">
          ${item ? `<span class="es-name">${item.name}</span>
            <button class="btn btn-xs btn-danger" onclick="game.unequipItem('${slot}')">X</button>` : '<span class="es-none">Empty</span>'}
        </div>
      </div>`;
    }
    html += '</div>';

    // Total stats
    html += '<h2 class="section-title">Total Stats</h2><div class="stat-summary">';
    const statNames = ['attackBonus','strengthBonus','defenceBonus','rangedBonus','magicBonus','damageReduction'];
    for (const stat of statNames) {
      const val = this.engine.getStatTotal(stat);
      if (val > 0) {
        html += `<div class="stat-row"><span>${stat.replace('Bonus','').replace(/([A-Z])/g,' $1').trim()}</span><span>+${val}</span></div>`;
      }
    }
    html += '</div>';

    // Food
    html += '<h2 class="section-title">Food</h2>';
    html += `<div class="food-display">
      ${s.food.equipped ? `${GAME_DATA.items[s.food.equipped]?.name} x${s.food.qty} (Heals ${GAME_DATA.items[s.food.equipped]?.heals || 0})` : 'No food equipped. Equip food from your Bank.'}
    </div>`;

    el.innerHTML = html;
  }

  // ── ACHIEVEMENTS ───────────────────────────────────────
  renderAchievementsPage(el) {
    const s = this.engine.state;
    let html = this.pageHeader('Achievements', 'trophy', `${s.achievements.length} / ${GAME_DATA.achievements.length} completed.`, null);
    html += '<div class="actions-grid">';
    for (const ach of GAME_DATA.achievements) {
      const done = s.achievements.includes(ach.id);
      html += `<div class="action-card achievement-card ${done ? 'ach-done' : ''}">
        <div class="ac-header"><span class="ac-name">${ach.name}</span>${done ? '<span class="ach-check">Done</span>' : ''}</div>
        <p class="area-desc">${ach.desc}</p>
      </div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  // ── WIKI ───────────────────────────────────────────────
  renderWikiPage(el) {
    let html = this.pageHeader('Wiki', 'book', 'Complete encyclopedia of Ashfall Idle.', null);

    // Skills
    html += '<h2 class="section-title">Skills</h2><div class="wiki-section">';
    for (const [id, skill] of Object.entries(GAME_DATA.skills)) {
      html += `<div class="wiki-entry"><strong>${skill.name}</strong> (${skill.type}) - ${skill.desc}</div>`;
    }
    html += '</div>';

    // Items summary
    html += '<h2 class="section-title">Items</h2><div class="wiki-section">';
    const itemTypes = {};
    for (const [id, item] of Object.entries(GAME_DATA.items)) {
      const t = item.type;
      if (!itemTypes[t]) itemTypes[t] = [];
      itemTypes[t].push(item);
    }
    for (const [type, items] of Object.entries(itemTypes)) {
      html += `<h3 class="wiki-subheader">${type.charAt(0).toUpperCase() + type.slice(1)} (${items.length})</h3>`;
      for (const item of items) {
        let extra = '';
        if (item.heals) extra += ` | Heals: ${item.heals}`;
        if (item.stats) extra += ` | Stats: ${Object.entries(item.stats).map(([k,v])=>`${k}:+${v}`).join(', ')}`;
        if (item.sellPrice) extra += ` | Sell: ${item.sellPrice}g`;
        html += `<div class="wiki-entry"><strong>${item.name}</strong> - ${item.desc}${extra}</div>`;
      }
    }
    html += '</div>';

    // Monsters
    html += '<h2 class="section-title">Monsters</h2><div class="wiki-section">';
    for (const [id, m] of Object.entries(GAME_DATA.monsters)) {
      html += `<div class="wiki-entry"><strong>${m.name}</strong> (Combat Lv ${m.combatLevel}) - HP: ${m.hp}, Max Hit: ${m.maxHit}, Style: ${m.style}. Drops: ${m.drops.map(d => `${GAME_DATA.items[d.item]?.name || d.item} (${(d.chance*100).toFixed(0)}%)`).join(', ')}</div>`;
    }
    html += '</div>';

    // Dungeons
    html += '<h2 class="section-title">Dungeons</h2><div class="wiki-section">';
    for (const dg of GAME_DATA.dungeons) {
      html += `<div class="wiki-entry"><strong>${dg.name}</strong> (Combat Lv ${dg.levelReq}) - ${dg.desc} | ${dg.waves.length} waves. Rewards: ${dg.rewards.map(r => GAME_DATA.items[r.item]?.name || r.item).join(', ')}</div>`;
    }
    html += '</div>';

    // Combat areas
    html += '<h2 class="section-title">Combat Areas</h2><div class="wiki-section">';
    for (const area of GAME_DATA.combatAreas) {
      html += `<div class="wiki-entry"><strong>${area.name}</strong> (Combat Lv ${area.levelReq}) - ${area.desc} | Monsters: ${area.monsters.map(m => GAME_DATA.monsters[m]?.name || m).join(', ')}</div>`;
    }
    html += '</div>';

    // Spells
    html += '<h2 class="section-title">Spells</h2><div class="wiki-section">';
    for (const spell of GAME_DATA.spells) {
      html += `<div class="wiki-entry"><strong>${spell.name}</strong> (Magic Lv ${spell.level}) - ${spell.desc} | Max Hit: ${spell.maxHit} | Runes: ${spell.runes.map(r => `${GAME_DATA.items[r.item]?.name} x${r.qty}`).join(', ')}</div>`;
    }
    html += '</div>';

    // Mechanics guide
    html += '<h2 class="section-title">Game Mechanics</h2><div class="wiki-section">';
    html += `<div class="wiki-entry"><strong>Combat Triangle</strong> - Melee beats Ranged, Ranged beats Magic, Magic beats Melee. Using the right style gives an accuracy advantage.</div>`;
    html += `<div class="wiki-entry"><strong>Mastery</strong> - Each action has its own mastery level that increases as you perform it. Higher mastery reduces action time by 0.5% per level and reduces burn/stun chances.</div>`;
    html += `<div class="wiki-entry"><strong>Offline Progression</strong> - When you close the game, your active skill continues to train for up to 24 hours. Combat does not run offline.</div>`;
    html += `<div class="wiki-entry"><strong>Food & Healing</strong> - Equip food from the Bank. During combat, food heals you. Auto-Eat triggers at 40% HP.</div>`;
    html += `<div class="wiki-entry"><strong>Farming</strong> - Plant seeds in plots. Crops grow in real time even while doing other activities. Harvest when ready.</div>`;
    html += `<div class="wiki-entry"><strong>Equipment Stats</strong> - Attack Bonus: melee accuracy. Strength Bonus: melee max hit. Defence Bonus: evasion. Damage Reduction: flat % damage reduction. Ranged/Magic Bonus: ranged/magic accuracy and damage.</div>`;
    html += '</div>';

    el.innerHTML = html;
  }

  // ── STATISTICS ─────────────────────────────────────────
  renderStatsPage(el) {
    const s = this.engine.state;
    let html = this.pageHeader('Statistics', 'stats', 'Your lifetime statistics.', null);
    html += '<div class="stats-grid">';
    const stats = [
      ['Total Play Time', this.formatTime(Math.floor(s.stats.totalPlayTime))],
      ['Total XP Gained', this.formatNum(s.stats.totalXpGained)],
      ['Monsters Killed', this.formatNum(s.stats.monstersKilled)],
      ['Dungeons Completed', s.stats.dungeonsCompleted],
      ['Items Crafted', this.formatNum(s.stats.itemsCrafted)],
      ['Food Eaten', s.stats.foodEaten],
      ['Gold Earned', this.formatNum(s.stats.goldEarned)],
      ['Gold Spent', this.formatNum(s.stats.goldSpent)],
      ['Deaths', s.stats.deaths],
      ['Achievements', `${s.achievements.length}/${GAME_DATA.achievements.length}`],
      ['Total Level', this.engine.getTotalLevel()],
      ['Combat Level', this.engine.getCombatLevel()],
    ];
    for (const [label, val] of stats) {
      html += `<div class="stat-card"><div class="stat-label">${label}</div><div class="stat-value">${val}</div></div>`;
    }
    html += '</div>';

    // Per-skill actions
    html += '<h2 class="section-title">Actions Per Skill</h2><div class="stats-grid">';
    for (const [skillId, data] of Object.entries(GAME_DATA.skills)) {
      const count = s.stats.totalActions[skillId] || 0;
      html += `<div class="stat-card"><div class="stat-label">${data.name}</div><div class="stat-value">${this.formatNum(count)}</div></div>`;
    }
    html += '</div>';
    el.innerHTML = html;
  }

  // ── SETTINGS ───────────────────────────────────────────
  renderSettingsPage(el) {
    let html = this.pageHeader('Settings', 'settings', 'Manage your game.', null);
    html += `<div class="settings-section">
      <button class="btn" onclick="game.save(); ui.showToast({type:'success',text:'Game saved!'})">Save Game</button>
      <button class="btn btn-danger" onclick="if(confirm('Delete ALL progress?')){game.deleteSave(); location.reload();}">Delete Save</button>
      <button class="btn" onclick="ui.exportSave()">Export Save</button>
      <button class="btn" onclick="ui.importSavePrompt()">Import Save</button>
    </div>
    <div class="settings-section">
      <h3>About Ashfall Idle</h3>
      <p>A dark fantasy idle RPG. Train skills, fight monsters, explore dungeons, and forge your legend.</p>
      <p>Version 1.0.0</p>
    </div>`;
    el.innerHTML = html;
  }

  // ── ACTIONS ────────────────────────────────────────────
  startAction(skillId, actionId) {
    this.engine.startSkill(skillId, actionId);
  }

  stopAction() {
    this.engine.stopSkill();
    this.renderPage(this.currentPage);
  }

  setCombatStyle(style) {
    this.engine.state.combat.combatStyle = style;
    this.renderPage('combat');
  }

  selectSpell(spellId) {
    this.engine.state.combat.selectedSpell = spellId;
    this.renderPage('combat');
  }

  eatManual() {
    this.engine.eatFood();
  }

  toggleAutoEat() {
    this.engine.state.combat.autoEat = !this.engine.state.combat.autoEat;
  }

  exportSave() {
    const data = this.engine.exportSave();
    navigator.clipboard.writeText(data).then(() => {
      this.showToast({ type: 'success', text: 'Save copied to clipboard!' });
    });
  }

  importSavePrompt() {
    const data = prompt('Paste your save data:');
    if (data && this.engine.importSave(data)) {
      this.showToast({ type: 'success', text: 'Save imported!' });
      location.reload();
    } else if (data) {
      this.showToast({ type: 'danger', text: 'Invalid save data.' });
    }
  }

  // ── TOAST NOTIFICATIONS ────────────────────────────────
  showToast(n) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${n.type || 'info'}`;
    toast.textContent = n.text;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('toast-show'), 10);
    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ── TICK UPDATE ────────────────────────────────────────
  onTick() {
    // Update progress bars and HP in real-time without full re-render
    const s = this.engine.state;

    // Update action progress bar
    const aaFill = document.querySelector('.aa-fill');
    if (aaFill && s.activeSkill && s.activeAction) {
      const skill = GAME_DATA.skills[s.activeSkill];
      let action = null;
      if (skill.type === 'gathering') action = GAME_DATA.gatheringActions[s.activeSkill]?.find(a => a.id === s.activeAction);
      else if (skill.type === 'artisan') action = GAME_DATA.recipes[s.activeSkill]?.find(a => a.id === s.activeAction);
      else if (s.activeSkill === 'thieving') action = GAME_DATA.thievingTargets.find(a => a.id === s.activeAction);
      if (action) {
        const timeReduction = 1 + (this.engine.getMasteryLevel(s.activeSkill, action.masteryId || action.id) * 0.005);
        const actionTime = action.time / timeReduction;
        const progress = Math.min(1, Math.max(0, s.actionProgress / actionTime));
        aaFill.style.width = (progress * 100).toFixed(0) + '%';
      }
    }

    // Update combat HP bars
    if (s.combat.active && s.combat.monster) {
      const monster = GAME_DATA.monsters[s.combat.monster];
      const maxHp = this.engine.getMaxHp();
      const playerHpEl = document.querySelector('.player-hp');
      const monsterHpEl = document.querySelector('.monster-hp');
      const playerHpText = document.querySelectorAll('.hp-text')[0];
      const monsterHpText = document.querySelectorAll('.hp-text')[1];

      if (playerHpEl) playerHpEl.style.width = Math.max(0, s.combat.playerHp / maxHp * 100).toFixed(1) + '%';
      if (monsterHpEl) monsterHpEl.style.width = Math.max(0, s.combat.monsterHp / monster.hp * 100).toFixed(1) + '%';
      if (playerHpText) playerHpText.textContent = `${Math.max(0, s.combat.playerHp)} / ${maxHp}`;
      if (monsterHpText) monsterHpText.textContent = `${Math.max(0, Math.ceil(s.combat.monsterHp))} / ${monster.hp}`;
    }

    // Update sidebar gold
    const goldEl = document.querySelector('.gold-val');
    if (goldEl) goldEl.textContent = this.formatNum(s.gold);

    // Update XP bar
    const xpFill = document.querySelector('.sh-xp-fill:not(.growing-fill)');
    const xpText = document.querySelector('.sh-xp-text');
    if (xpFill && s.activeSkill && s.skills[s.activeSkill]) {
      const progress = this.engine.getXpProgress(s.activeSkill);
      xpFill.style.width = (progress * 100).toFixed(1) + '%';
      if (xpText) {
        const sk = s.skills[s.activeSkill];
        const nextXp = sk.level >= 99 ? 'MAX' : this.formatNum(this.engine.getXpForLevel(sk.level + 1) - sk.xp);
        xpText.textContent = `${this.formatNum(sk.xp)} XP ${sk.level < 99 ? `(${nextXp} to next)` : ''}`;
      }
    }

    // Update farm timers
    document.querySelectorAll('.plot-timer').forEach((timerEl, i) => {
      const plot = s.farming.plots[i];
      if (plot && plot.plantedAt && !plot.ready) {
        const remaining = Math.max(0, Math.ceil((plot.growTime - (Date.now() - plot.plantedAt)) / 1000));
        timerEl.textContent = this.formatTime(remaining);
      }
    });
  }

  // ── UTILITIES ──────────────────────────────────────────
  formatNum(n) {
    if (n >= 1e9) return (n/1e9).toFixed(1) + 'B';
    if (n >= 1e6) return (n/1e6).toFixed(1) + 'M';
    if (n >= 1e4) return (n/1e3).toFixed(1) + 'K';
    return Math.floor(n).toLocaleString();
  }

  formatTime(seconds) {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds/60)}m ${seconds%60}s`;
    const h = Math.floor(seconds/3600);
    const m = Math.floor((seconds%3600)/60);
    return `${h}h ${m}m`;
  }

  bindEvents() {
    // Mobile sidebar toggle
    const toggle = document.getElementById('sidebar-toggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
      });
    }
    // Close sidebar on page select (mobile)
    document.addEventListener('click', (e) => {
      if (e.target.closest('.nav-item')) {
        document.getElementById('sidebar').classList.remove('open');
      }
    });
  }
}

// Boot
window.addEventListener('DOMContentLoaded', () => {
  window.ui = new UI(game);
  game.init();
  ui.init();
});
