// ================================================================
// ASHFALL IDLE — codex.js v1.0
// Collection Log + Bestiary — "The Codex"
// Loads AFTER ui.js. Patches AshfallUI with renderCodexPage.
// ================================================================

window.addEventListener('DOMContentLoaded', () => {
  'use strict';
  if (!window.ui) { console.error('[Codex] ui not ready'); return; }

  const ui = window.ui;
  const engine = ui.engine;

  // ── COLLECTION LOG CATEGORIES ──────────────────────────────
  const LOG_CATEGORIES = [
    { id:'equipment',  name:'Equipment',   icon:'shield',  filter: i => ['weapon','armor','ammo','arrow'].includes(i.type) || i.slot },
    { id:'resources',  name:'Resources',   icon:'pickaxe', filter: i => ['resource','ore','bar','log','fish','herb','gem','leather','rune','bone','seed'].includes(i.type) },
    { id:'consumables',name:'Consumables', icon:'potion',  filter: i => ['food','potion','consumable'].includes(i.type) },
    { id:'tools',      name:'Tools',       icon:'axe',     filter: i => i.type === 'tool' },
    { id:'misc',       name:'Miscellaneous',icon:'scroll', filter: i => !['weapon','armor','ammo','arrow','resource','ore','bar','log','fish','herb','gem','leather','rune','bone','seed','food','potion','consumable','tool'].includes(i.type) && !i.slot },
  ];

  // ── MILESTONE REWARDS ──────────────────────────────────────
  const MILESTONES = [
    { pct:10,  title:'Novice Archivist',     reward:'You have begun to chart the darkness.' },
    { pct:25,  title:'Scholar of Ash',       reward:'The codex grows. Knowledge is power.' },
    { pct:50,  title:'Lorekeeper',           reward:'Half the world lies open before you.' },
    { pct:75,  title:'Master Chronicler',    reward:'Few corners of Ashfall remain uncharted.' },
    { pct:90,  title:'Grand Archivist',      reward:'The codex nears completion. Legendary.' },
    { pct:100, title:'Omniscient',            reward:'Every secret uncovered. You are Ashfall.' },
  ];

  // ── HELPERS ────────────────────────────────────────────────
  function getAllItems() {
    return Object.values(GAME_DATA.items).filter(i => i && i.id && i.name);
  }

  function getAllMonsters() {
    return Object.values(GAME_DATA.monsters).filter(m => m && m.id && m.name);
  }

  function getLogStats() {
    const log = engine.state.collectionLog || {};
    const allItems = getAllItems();
    const discovered = Object.keys(log).filter(id => GAME_DATA.items[id]);
    const total = allItems.length;
    const pct = total > 0 ? Math.floor((discovered.length / total) * 100) : 0;

    const catStats = {};
    for (const cat of LOG_CATEGORIES) {
      const catItems = allItems.filter(cat.filter);
      const catFound = catItems.filter(i => log[i.id]);
      catStats[cat.id] = { total: catItems.length, found: catFound.length, pct: catItems.length > 0 ? Math.floor((catFound.length / catItems.length) * 100) : 0 };
    }

    const monsters = getAllMonsters();
    const kills = engine.state.stats.uniqueKills || {};
    const monstersDiscovered = monsters.filter(m => kills[m.id] > 0).length;

    return { total, discovered: discovered.length, pct, catStats, monstersTotal: monsters.length, monstersDiscovered, monstersPct: monsters.length > 0 ? Math.floor((monstersDiscovered / monsters.length) * 100) : 0 };
  }

  function getRarityColor(rarity) {
    return GAME_DATA.rarities?.[rarity]?.color || '#a0a0a0';
  }

  function getRarityName(rarity) {
    return GAME_DATA.rarities?.[rarity]?.name || 'Common';
  }

  function getItemIcon(item) {
    if (typeof getItemSvg === 'function') return getItemSvg(item.id);
    if (typeof icon === 'function') return icon(item.icon || 'scroll', 24);
    return '';
  }

  function escHtml(s) { return ui.escHtml ? ui.escHtml(s) : String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]); }

  // Track which tab is active
  let _codexTab = 'overview';
  let _bestiaryFilter = 'all';
  let _collectionCat = 'equipment';
  let _bestiaryExpanded = null;

  // ── RENDER CODEX PAGE ──────────────────────────────────────
  ui.renderCodexPage = function(el) {
    const stats = getLogStats();
    let html = this.header('The Codex', 'book', 'Your chronicle of every creature slain and treasure found in Ashfall.', null);

    // Tab nav
    html += `<div class="codex-tabs">
      <button class="codex-tab ${_codexTab==='overview'?'codex-tab-active':''}" onclick="window._codexSetTab('overview')">Overview</button>
      <button class="codex-tab ${_codexTab==='bestiary'?'codex-tab-active':''}" onclick="window._codexSetTab('bestiary')">Bestiary</button>
      <button class="codex-tab ${_codexTab==='collection'?'codex-tab-active':''}" onclick="window._codexSetTab('collection')">Collection Log</button>
    </div>`;

    if (_codexTab === 'overview') html += renderOverview(stats);
    else if (_codexTab === 'bestiary') html += renderBestiary(stats);
    else if (_codexTab === 'collection') html += renderCollectionLog(stats);

    el.innerHTML = html;
  };

  window._codexSetTab = function(tab) { _codexTab = tab; _bestiaryExpanded = null; ui.renderPage('codex'); };
  window._codexBestiaryFilter = function(f) { _bestiaryFilter = f; _bestiaryExpanded = null; ui.renderPage('codex'); };
  window._codexCollectionCat = function(c) { _collectionCat = c; ui.renderPage('codex'); };
  window._codexExpandMonster = function(id) { _bestiaryExpanded = _bestiaryExpanded === id ? null : id; ui.renderPage('codex'); };

  // ── OVERVIEW TAB ───────────────────────────────────────────
  function renderOverview(stats) {
    let html = '';

    // Big completion ring
    const overallPct = Math.floor((stats.discovered + stats.monstersDiscovered) / Math.max(1, stats.total + stats.monstersTotal) * 100);
    html += `<div class="codex-overview">
      <div class="codex-ring-wrap">
        <svg class="codex-ring" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#1a1b22" stroke-width="10"/>
          <circle cx="60" cy="60" r="52" fill="none" stroke="#c9873e" stroke-width="10"
            stroke-dasharray="${52*2*Math.PI}" stroke-dashoffset="${52*2*Math.PI*(1-overallPct/100)}"
            stroke-linecap="round" transform="rotate(-90 60 60)" class="codex-ring-fill"/>
        </svg>
        <div class="codex-ring-label">
          <span class="codex-ring-pct">${overallPct}%</span>
          <span class="codex-ring-sub">Complete</span>
        </div>
      </div>
      <div class="codex-summary">
        <div class="codex-stat-row"><span class="codex-stat-label">Items Discovered</span><span class="codex-stat-val">${stats.discovered} / ${stats.total}</span></div>
        <div class="codex-stat-row"><span class="codex-stat-label">Monsters Encountered</span><span class="codex-stat-val">${stats.monstersDiscovered} / ${stats.monstersTotal}</span></div>
        <div class="codex-stat-row"><span class="codex-stat-label">Total Monsters Killed</span><span class="codex-stat-val">${ui.fmt(engine.state.stats.monstersKilled)}</span></div>
        <div class="codex-stat-row"><span class="codex-stat-label">Dungeons Completed</span><span class="codex-stat-val">${ui.fmt(engine.state.stats.dungeonsCompleted)}</span></div>
      </div>
    </div>`;

    // Category bars
    html += `<h2 class="section-title">Collection Progress</h2><div class="codex-cat-bars">`;
    // Items
    for (const cat of LOG_CATEGORIES) {
      const cs = stats.catStats[cat.id];
      html += `<div class="codex-cat-bar">
        <div class="ccb-header"><span class="ccb-name">${cat.name}</span><span class="ccb-count">${cs.found}/${cs.total}</span></div>
        <div class="ccb-track"><div class="ccb-fill" style="width:${cs.pct}%"></div></div>
      </div>`;
    }
    // Bestiary bar
    html += `<div class="codex-cat-bar">
      <div class="ccb-header"><span class="ccb-name">Bestiary</span><span class="ccb-count">${stats.monstersDiscovered}/${stats.monstersTotal}</span></div>
      <div class="ccb-track"><div class="ccb-fill ccb-fill-red" style="width:${stats.monstersPct}%"></div></div>
    </div>`;
    html += `</div>`;

    // Milestones
    html += `<h2 class="section-title">Milestones</h2><div class="codex-milestones">`;
    for (const ms of MILESTONES) {
      const earned = overallPct >= ms.pct;
      html += `<div class="codex-milestone ${earned ? 'cm-earned' : 'cm-locked'}">
        <div class="cm-icon">${earned ? '&#x2726;' : '&#x2727;'}</div>
        <div class="cm-info">
          <div class="cm-title">${ms.title}</div>
          <div class="cm-desc">${earned ? ms.reward : `Reach ${ms.pct}% completion`}</div>
        </div>
        <div class="cm-pct">${ms.pct}%</div>
      </div>`;
    }
    html += `</div>`;

    // Recent discoveries
    const log = engine.state.collectionLog || {};
    const recent = Object.entries(log)
      .filter(([id]) => GAME_DATA.items[id])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);

    if (recent.length > 0) {
      html += `<h2 class="section-title">Recent Discoveries</h2><div class="codex-recent-grid">`;
      for (const [itemId, ts] of recent) {
        const item = GAME_DATA.items[itemId];
        const rc = getRarityColor(item.rarity);
        html += `<div class="codex-recent-card" style="border-color:${rc}">
          <div class="crc-name" style="color:${rc}">${escHtml(item.name)}</div>
          <div class="crc-type">${item.type || '?'}</div>
        </div>`;
      }
      html += `</div>`;
    }

    return html;
  }

  // ── BESTIARY TAB ───────────────────────────────────────────
  function renderBestiary(stats) {
    const monsters = getAllMonsters().sort((a, b) => a.combatLevel - b.combatLevel);
    const kills = engine.state.stats.uniqueKills || {};
    const log = engine.state.collectionLog || {};

    // Area filter
    const areas = GAME_DATA.combatAreas || [];
    let html = `<div class="codex-filter-bar">
      <button class="codex-filter ${_bestiaryFilter==='all'?'cf-active':''}" onclick="window._codexBestiaryFilter('all')">All (${monsters.length})</button>`;
    for (const area of areas) {
      const count = (area.monsters || []).length;
      html += `<button class="codex-filter ${_bestiaryFilter===area.id?'cf-active':''}" onclick="window._codexBestiaryFilter('${area.id}')">${escHtml(area.name)} (${count})</button>`;
    }
    html += `</div>`;

    // Filter monsters
    let filtered = monsters;
    if (_bestiaryFilter !== 'all') {
      const area = areas.find(a => a.id === _bestiaryFilter);
      if (area) filtered = monsters.filter(m => (area.monsters || []).includes(m.id));
    }

    html += `<div class="codex-bestiary-grid">`;
    for (const mon of filtered) {
      const kc = kills[mon.id] || 0;
      const discovered = kc > 0;
      const expanded = _bestiaryExpanded === mon.id;
      const artSvg = GAME_DATA.monsterArt?.[mon.id];

      html += `<div class="codex-monster-card ${discovered ? 'cmc-discovered' : 'cmc-undiscovered'} ${expanded ? 'cmc-expanded' : ''}" onclick="window._codexExpandMonster('${mon.id}')">
        <div class="cmc-top">
          <div class="cmc-art ${discovered ? '' : 'cmc-art-hidden'}">
            ${discovered && artSvg ? artSvg : `<div class="cmc-silhouette">?</div>`}
          </div>
          <div class="cmc-info">
            <div class="cmc-name">${discovered ? escHtml(mon.name) : '???'}</div>
            <div class="cmc-level">Cb Lv ${mon.combatLevel}</div>
            <div class="cmc-kills">${discovered ? ui.fmt(kc) + ' kills' : 'Unencountered'}</div>
          </div>
        </div>`;

      // Expanded details
      if (expanded && discovered) {
        html += `<div class="cmc-details">
          <div class="cmc-stats-grid">
            <div class="cmc-stat"><span class="cmc-sl">HP</span><span class="cmc-sv">${ui.fmt(mon.hp)}</span></div>
            <div class="cmc-stat"><span class="cmc-sl">Max Hit</span><span class="cmc-sv">${mon.maxHit}</span></div>
            <div class="cmc-stat"><span class="cmc-sl">Speed</span><span class="cmc-sv">${mon.attackSpeed}s</span></div>
            <div class="cmc-stat"><span class="cmc-sl">Style</span><span class="cmc-sv">${mon.style}</span></div>
            <div class="cmc-stat"><span class="cmc-sl">XP</span><span class="cmc-sv">${ui.fmt(mon.xp)}</span></div>
            <div class="cmc-stat"><span class="cmc-sl">Gold</span><span class="cmc-sv">${mon.gold?.min||0}-${mon.gold?.max||0}</span></div>
          </div>
          ${mon.evasion ? `<div class="cmc-evasion">
            <span>Evasion: Melee ${mon.evasion.melee} | Ranged ${mon.evasion.ranged} | Magic ${mon.evasion.magic}</span>
          </div>` : ''}
          <div class="cmc-drops-title">Drop Table</div>
          <div class="cmc-drops">`;

        const drops = mon.drops || mon.rewards || [];
        for (const drop of drops) {
          const item = GAME_DATA.items[drop.item];
          if (!item) continue;
          const found = !!log[drop.item];
          const rc = getRarityColor(item.rarity);
          const chancePct = drop.chance >= 1 ? '100%' : drop.chance >= 0.01 ? (drop.chance * 100).toFixed(1) + '%' : '1/' + Math.round(1 / drop.chance);
          html += `<div class="cmc-drop ${found ? 'cmc-drop-found' : 'cmc-drop-missing'}">
            <span class="cmc-drop-name" style="color:${found ? rc : '#444'}">${found ? escHtml(item.name) : '???'}</span>
            <span class="cmc-drop-chance">${chancePct}</span>
            <span class="cmc-drop-qty">x${drop.qty}</span>
          </div>`;
        }

        // Roll tables
        if (mon.rollTables && GAME_DATA.dropTables) {
          for (const roll of mon.rollTables) {
            const table = GAME_DATA.dropTables[roll.table];
            if (!table) continue;
            html += `<div class="cmc-drop-table-name">${escHtml(roll.table)} table (${(roll.chance*100).toFixed(0)}%)</div>`;
            for (const entry of table) {
              const item = GAME_DATA.items[entry.item];
              if (!item) continue;
              const found = !!log[entry.item];
              const rc = getRarityColor(item.rarity);
              html += `<div class="cmc-drop ${found ? 'cmc-drop-found' : 'cmc-drop-missing'}">
                <span class="cmc-drop-name" style="color:${found ? rc : '#444'}">${found ? escHtml(item.name) : '???'}</span>
                <span class="cmc-drop-chance">wt ${entry.weight||1}</span>
                <span class="cmc-drop-qty">x${entry.qty||1}</span>
              </div>`;
            }
          }
        }
        html += `</div></div>`;
      }

      html += `</div>`;
    }
    html += `</div>`;
    return html;
  }

  // ── COLLECTION LOG TAB ─────────────────────────────────────
  function renderCollectionLog(stats) {
    const log = engine.state.collectionLog || {};
    const allItems = getAllItems();

    // Category sub-tabs
    let html = `<div class="codex-filter-bar">`;
    for (const cat of LOG_CATEGORIES) {
      const cs = stats.catStats[cat.id];
      html += `<button class="codex-filter ${_collectionCat===cat.id?'cf-active':''}" onclick="window._codexCollectionCat('${cat.id}')">${cat.name} <span class="cf-count">${cs.found}/${cs.total}</span></button>`;
    }
    html += `</div>`;

    // Get items for current category
    const cat = LOG_CATEGORIES.find(c => c.id === _collectionCat);
    if (!cat) return html;
    const catItems = allItems.filter(cat.filter).sort((a, b) => {
      // Sort by rarity (mythic first), then name
      const rarityOrder = { mythic:0, legendary:1, epic:2, rare:3, uncommon:4, common:5 };
      const ra = rarityOrder[a.rarity] ?? 5;
      const rb = rarityOrder[b.rarity] ?? 5;
      if (ra !== rb) return ra - rb;
      return (a.name || '').localeCompare(b.name || '');
    });

    html += `<div class="codex-collection-grid">`;
    for (const item of catItems) {
      const found = !!log[item.id];
      const rc = getRarityColor(item.rarity);
      const rn = getRarityName(item.rarity);

      html += `<div class="codex-item-card ${found ? 'cic-found' : 'cic-missing'}" title="${found ? escHtml(item.name) + ' (' + rn + ')' + (item.desc ? '\n' + item.desc : '') : 'Not yet discovered'}">
        <div class="cic-dot" style="background:${found ? rc : '#222'}"></div>
        <div class="cic-name" style="color:${found ? rc : '#333'}">${found ? escHtml(item.name) : '???'}</div>`;

      if (found) {
        // Show stats for equipment
        if (item.slot) {
          const statParts = [];
          if (item.attackBonus) statParts.push('Atk+' + item.attackBonus);
          if (item.strengthBonus) statParts.push('Str+' + item.strengthBonus);
          if (item.defenceBonus) statParts.push('Def+' + item.defenceBonus);
          if (item.rangedBonus) statParts.push('Rng+' + item.rangedBonus);
          if (item.magicBonus) statParts.push('Mag+' + item.magicBonus);
          if (item.healAmount) statParts.push('Heal ' + item.healAmount);
          if (statParts.length > 0) {
            html += `<div class="cic-stats">${statParts.join(' | ')}</div>`;
          }
        }
        if (item.healAmount && !item.slot) {
          html += `<div class="cic-stats">Heals ${item.healAmount}</div>`;
        }
      }

      html += `</div>`;
    }
    html += `</div>`;

    return html;
  }

  console.log('[Ashfall] Codex v1.0 loaded — Collection Log + Bestiary');
});
