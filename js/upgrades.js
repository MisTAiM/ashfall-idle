// ================================================================
// ASHFALL IDLE — upgrades.js v1.0
// Combat Log, XP/hr Tracker, Item Comparison, Keyboard Shortcuts,
// Notification History, Settings Expansion
// Loads AFTER all other scripts. Hooks into existing game/ui globals.
// ================================================================

(function () {
  'use strict';
  if (typeof game === 'undefined' || typeof ui === 'undefined') {
    console.error('[Upgrades] game or ui not found — load upgrades.js last.');
    return;
  }

  // ══════════════════════════════════════════════════════════
  // 1. COMBAT LOG
  // ══════════════════════════════════════════════════════════
  const MAX_LOG = 80;
  const combatLog = [];
  let combatLogCollapsed = false;

  function logEntry(type, text, color) {
    const now = new Date();
    const ts = String(now.getHours()).padStart(2, '0') + ':' +
               String(now.getMinutes()).padStart(2, '0') + ':' +
               String(now.getSeconds()).padStart(2, '0');
    combatLog.push({ type, text, color, ts });
    if (combatLog.length > MAX_LOG) combatLog.shift();
    renderCombatLogLive();
  }

  // Hook into engine events
  game.on('combatHit', (d) => {
    if (d.who === 'player') {
      if (d.miss) {
        logEntry('miss', 'You miss.', '#666');
      } else {
        const critTag = d.crit ? ' (CRIT)' : '';
        logEntry('hit', `You hit ${d.dmg}${critTag}`, d.crit ? '#ffd700' : '#4a8a3e');
      }
    } else {
      if (d.miss || d.dodge) {
        logEntry('dodge', d.dodge ? 'You dodge the attack.' : 'Monster misses.', '#60c0e0');
      } else {
        logEntry('hit', `Monster hits you for ${d.dmg}`, '#c44040');
      }
    }
  });

  game.on('lootDrop', (d) => {
    for (const drop of d.bag) {
      const item = GAME_DATA.items[drop.item];
      const rColor = drop.rarity === 'legendary' || drop.rarity === 'mythic' ? '#ffd700'
        : drop.rarity === 'epic' ? '#a855f7' : drop.rarity === 'rare' ? '#60c0e0' : '#aaa';
      logEntry('loot', `Loot: ${item?.name || drop.item} x${drop.qty}`, rColor);
    }
  });

  game.on('levelup', (d) => {
    const name = GAME_DATA.skills[d.skill]?.name || d.skill;
    logEntry('levelup', `${name} leveled up to ${d.level}!`, '#ffd700');
  });

  game.on('notification', (n) => {
    if (n.type === 'danger' && n.text.includes('defeated')) {
      logEntry('death', n.text, '#ff4040');
    }
  });

  // Clear log on new fight
  game.on('combatStart', () => {
    combatLog.length = 0;
    logEntry('system', 'Combat started.', '#c9873e');
  });

  function renderCombatLogLive() {
    const el = document.getElementById('combat-log-entries');
    if (!el) return;
    let html = '';
    const start = Math.max(0, combatLog.length - 40);
    for (let i = start; i < combatLog.length; i++) {
      const e = combatLog[i];
      html += `<div class="clog-entry clog-${e.type}"><span class="clog-ts">${e.ts}</span><span class="clog-text" style="color:${e.color}">${e.text}</span></div>`;
    }
    el.innerHTML = html;
    el.scrollTop = el.scrollHeight;
  }

  // Build combat log HTML
  function buildCombatLogHTML() {
    const vis = combatLogCollapsed ? 'none' : 'block';
    const arrow = combatLogCollapsed ? '&#9654;' : '&#9660;';
    let html = `<div class="combat-log-panel">
      <div class="clog-header" onclick="window._toggleCombatLog()">
        <span class="clog-arrow">${arrow}</span>
        <span class="clog-title">Combat Log</span>
        <button class="clog-clear-btn" onclick="event.stopPropagation();window._clearCombatLog()">Clear</button>
      </div>
      <div class="clog-body" id="combat-log-entries" style="display:${vis}">`;
    const start = Math.max(0, combatLog.length - 40);
    for (let i = start; i < combatLog.length; i++) {
      const e = combatLog[i];
      html += `<div class="clog-entry clog-${e.type}"><span class="clog-ts">${e.ts}</span><span class="clog-text" style="color:${e.color}">${e.text}</span></div>`;
    }
    html += '</div></div>';
    return html;
  }

  window._toggleCombatLog = () => {
    combatLogCollapsed = !combatLogCollapsed;
    const body = document.getElementById('combat-log-entries');
    if (body) body.style.display = combatLogCollapsed ? 'none' : 'block';
    const arrow = document.querySelector('.clog-arrow');
    if (arrow) arrow.innerHTML = combatLogCollapsed ? '&#9654;' : '&#9660;';
  };

  window._clearCombatLog = () => {
    combatLog.length = 0;
    renderCombatLogLive();
  };

  // ══════════════════════════════════════════════════════════
  // 2. XP/HR & DPS TRACKER
  // ══════════════════════════════════════════════════════════
  const sessionTracker = {
    startTime: Date.now(),
    startXp: {},       // { skillId: xpAtStart }
    totalDmgDealt: 0,
    totalDmgTaken: 0,
    killCount: 0,
  };

  // Capture starting XP for all skills
  function snapshotXp() {
    for (const [sId, sk] of Object.entries(game.state.skills)) {
      sessionTracker.startXp[sId] = sk.xp;
    }
  }
  snapshotXp();

  // Track damage
  game.on('combatHit', (d) => {
    if (d.who === 'player' && !d.miss) {
      sessionTracker.totalDmgDealt += d.dmg;
    } else if (d.who === 'monster' && !d.miss && !d.dodge) {
      sessionTracker.totalDmgTaken += d.dmg;
    }
  });

  // Track kills
  const _origOnMonsterKill = game.state.stats;
  game.on('lootDrop', () => { sessionTracker.killCount++; });

  function getSessionSeconds() {
    return Math.max(1, (Date.now() - sessionTracker.startTime) / 1000);
  }

  function getXpPerHour(skillId) {
    const sk = game.state.skills[skillId];
    if (!sk) return 0;
    const gained = sk.xp - (sessionTracker.startXp[skillId] || 0);
    if (gained <= 0) return 0;
    const hours = getSessionSeconds() / 3600;
    return Math.floor(gained / hours);
  }

  function getDPS() {
    const secs = getSessionSeconds();
    return (sessionTracker.totalDmgDealt / secs).toFixed(1);
  }

  function getKillsPerHour() {
    const hours = getSessionSeconds() / 3600;
    if (hours <= 0) return 0;
    return Math.floor(sessionTracker.killCount / hours);
  }

  function buildTrackerHTML() {
    const elapsed = getSessionSeconds();
    const mins = Math.floor(elapsed / 60);
    const hrs = Math.floor(mins / 60);
    const timeStr = hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins}m`;
    const dps = getDPS();
    const kph = getKillsPerHour();

    let html = `<div class="tracker-panel">
      <div class="tracker-header">
        <span class="tracker-title">Session Tracker</span>
        <span class="tracker-time">${timeStr}</span>
        <button class="clog-clear-btn" onclick="window._resetTracker()">Reset</button>
      </div>
      <div class="tracker-stats">
        <div class="tracker-stat"><span class="ts-label">DPS</span><span class="ts-val">${dps}</span></div>
        <div class="tracker-stat"><span class="ts-label">Kills/hr</span><span class="ts-val">${ui.fmt(kph)}</span></div>
        <div class="tracker-stat"><span class="ts-label">Dmg Dealt</span><span class="ts-val">${ui.fmt(sessionTracker.totalDmgDealt)}</span></div>
        <div class="tracker-stat"><span class="ts-label">Dmg Taken</span><span class="ts-val">${ui.fmt(sessionTracker.totalDmgTaken)}</span></div>
      </div>`;

    // XP rates for active combat skills
    const combatSkills = ['attack', 'strength', 'defence', 'hitpoints', 'ranged', 'magic', 'prayer', 'slayer'];
    let hasXpGain = false;
    let xpRows = '';
    for (const sId of combatSkills) {
      const rate = getXpPerHour(sId);
      if (rate > 0) {
        hasXpGain = true;
        const name = GAME_DATA.skills[sId]?.name || sId;
        xpRows += `<div class="tracker-xp-row"><span class="txr-name">${name}</span><span class="txr-rate">${ui.fmt(rate)} xp/hr</span></div>`;
      }
    }
    if (hasXpGain) {
      html += `<div class="tracker-xp">${xpRows}</div>`;
    }
    html += '</div>';
    return html;
  }

  window._resetTracker = () => {
    sessionTracker.startTime = Date.now();
    sessionTracker.totalDmgDealt = 0;
    sessionTracker.totalDmgTaken = 0;
    sessionTracker.killCount = 0;
    snapshotXp();
    ui.renderPage(ui.currentPage);
  };

  // ══════════════════════════════════════════════════════════
  // 3. ITEM COMPARISON (inject into bank rendering)
  // ══════════════════════════════════════════════════════════
  function getStatDelta(itemId) {
    const item = GAME_DATA.items[itemId];
    if (!item || !item.slot || !item.stats) return null;
    const equippedId = game.state.equipment[item.slot];
    const equipped = equippedId ? GAME_DATA.items[equippedId] : null;
    const eqStats = equipped?.stats || {};
    const deltas = {};
    const allKeys = new Set([...Object.keys(item.stats), ...Object.keys(eqStats)]);
    let hasDelta = false;
    for (const k of allKeys) {
      const newVal = item.stats[k] || 0;
      const oldVal = eqStats[k] || 0;
      const diff = newVal - oldVal;
      if (diff !== 0) {
        deltas[k] = diff;
        hasDelta = true;
      }
    }
    return hasDelta ? { deltas, equippedName: equipped?.name || 'Nothing' } : null;
  }

  function buildComparisonBadge(itemId) {
    const result = getStatDelta(itemId);
    if (!result) return '';
    let parts = [];
    for (const [k, v] of Object.entries(result.deltas)) {
      const label = k.replace('Bonus', '').replace(/([A-Z])/g, ' $1').trim();
      const color = v > 0 ? '#4a8a3e' : '#c44040';
      const sign = v > 0 ? '+' : '';
      parts.push(`<span style="color:${color}">${sign}${v} ${label}</span>`);
    }
    return `<div class="bi-compare"><span class="bi-compare-vs">vs ${result.equippedName}</span>${parts.join(' ')}</div>`;
  }

  // ══════════════════════════════════════════════════════════
  // 4. KEYBOARD SHORTCUTS
  // ══════════════════════════════════════════════════════════
  const shortcuts = {
    '1': () => { if (game.state.combat.active) game.useAbility(0); },
    '2': () => { if (game.state.combat.active) game.useAbility(1); },
    '3': () => { if (game.state.combat.active) game.useAbility(2); },
    '4': () => { if (game.state.combat.active) game.useAbility(3); },
    'Escape': () => {
      if (game.state.combat.active) {
        game.stopCombat();
        ui.renderPage('combat');
      }
    },
    'f': () => {
      if (game.state.combat.active && game.state.foodBag?.length > 0) {
        game.eatFoodSlot(0);
      }
    },
    's': () => {
      if (game.state.combat.active) {
        const weapon = GAME_DATA.items[game.state.equipment.weapon];
        if (weapon?.specCost && game.state.specEnergy >= weapon.specCost) {
          game.useSpecialAttack();
        }
      }
    },
  };

  document.addEventListener('keydown', (e) => {
    // Don't trigger when typing in inputs
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const fn = shortcuts[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  });

  // ══════════════════════════════════════════════════════════
  // 5. NOTIFICATION HISTORY
  // ══════════════════════════════════════════════════════════
  const MAX_HISTORY = 60;
  const notifHistory = [];
  let notifPanelOpen = false;

  // Wrap toast to also store history
  const _origToast = ui.toast.bind(ui);
  ui.toast = function (n) {
    _origToast(n);
    const now = new Date();
    const ts = String(now.getHours()).padStart(2, '0') + ':' +
               String(now.getMinutes()).padStart(2, '0') + ':' +
               String(now.getSeconds()).padStart(2, '0');
    notifHistory.unshift({ ...n, ts });
    if (notifHistory.length > MAX_HISTORY) notifHistory.pop();
    // Update badge
    const badge = document.getElementById('notif-history-badge');
    if (badge) badge.style.display = 'block';
  };

  window._toggleNotifHistory = () => {
    notifPanelOpen = !notifPanelOpen;
    let panel = document.getElementById('notif-history-panel');
    if (notifPanelOpen) {
      if (!panel) {
        panel = document.createElement('div');
        panel.id = 'notif-history-panel';
        panel.className = 'notif-history-panel';
        document.body.appendChild(panel);
      }
      let html = '<div class="nh-header"><span>Activity Log</span><button class="clog-clear-btn" onclick="window._toggleNotifHistory()">Close</button></div>';
      html += '<div class="nh-entries">';
      if (notifHistory.length === 0) {
        html += '<div class="nh-empty">No activity yet.</div>';
      } else {
        for (const n of notifHistory) {
          html += `<div class="nh-entry nh-${n.type || 'info'}"><span class="nh-ts">${n.ts}</span><span class="nh-text">${n.text}</span></div>`;
        }
      }
      html += '</div>';
      panel.innerHTML = html;
      panel.style.display = 'block';
      // Hide badge
      const badge = document.getElementById('notif-history-badge');
      if (badge) badge.style.display = 'none';
    } else {
      if (panel) panel.style.display = 'none';
    }
  };

  // ══════════════════════════════════════════════════════════
  // 6. XP/HR ON SKILL PAGES
  // ══════════════════════════════════════════════════════════
  // Show XP/hr next to XP text on skill pages (via tick update)
  function updateSkillXpRate() {
    const page = ui.currentPage;
    if (!page || !GAME_DATA.skills[page]) return;
    const rate = getXpPerHour(page);
    let el = document.getElementById('xphr-display');
    if (!el) {
      const xpText = document.querySelector('.sh-xp-text');
      if (!xpText) return;
      el = document.createElement('span');
      el.id = 'xphr-display';
      el.className = 'xphr-badge';
      xpText.parentElement.appendChild(el);
    }
    el.textContent = rate > 0 ? `${ui.fmt(rate)} xp/hr` : '';
  }

  // ══════════════════════════════════════════════════════════
  // 7. PATCH: Inject combat log + tracker into combat page
  // ══════════════════════════════════════════════════════════
  const _origRenderCombatPage = ui.renderCombatPage.bind(ui);
  ui.renderCombatPage = function (el) {
    _origRenderCombatPage(el);
    // Inject combat log and tracker after the combat page renders
    if (game.state.combat.active) {
      const container = el.querySelector('.combat-page') || el;
      // Add tracker
      const trackerDiv = document.createElement('div');
      trackerDiv.innerHTML = buildTrackerHTML();
      container.appendChild(trackerDiv.firstElementChild);
      // Add combat log
      const logDiv = document.createElement('div');
      logDiv.innerHTML = buildCombatLogHTML();
      container.appendChild(logDiv.firstElementChild);
      // Scroll log to bottom
      const logBody = document.getElementById('combat-log-entries');
      if (logBody) logBody.scrollTop = logBody.scrollHeight;
    }
  };

  // ══════════════════════════════════════════════════════════
  // 8. PATCH: Item comparison in bank
  // ══════════════════════════════════════════════════════════
  const _origRenderBankPage = ui.renderBankPage.bind(ui);
  ui.renderBankPage = function (el) {
    _origRenderBankPage(el);
    // After bank renders, inject comparison badges
    const items = el.querySelectorAll('.bank-item');
    items.forEach((itemEl) => {
      const equipBtn = itemEl.querySelector('button[onclick*="equipItem"]');
      if (!equipBtn) return;
      const match = equipBtn.getAttribute('onclick').match(/equipItem\('([^']+)'\)/);
      if (!match) return;
      const itemId = match[1];
      const badge = buildComparisonBadge(itemId);
      if (badge) {
        const statsEl = itemEl.querySelector('.bi-stats');
        const insertPoint = statsEl || itemEl.querySelector('.bi-qty');
        if (insertPoint) {
          const div = document.createElement('div');
          div.innerHTML = badge;
          insertPoint.parentElement.insertBefore(div.firstElementChild, insertPoint);
        }
      }
    });
  };

  // ══════════════════════════════════════════════════════════
  // 9. PATCH: Settings page expansion + version fix
  // ══════════════════════════════════════════════════════════
  const _origRenderSettingsPage = ui.renderSettingsPage.bind(ui);
  ui.renderSettingsPage = function (el) {
    _origRenderSettingsPage(el);
    // Fix version string and add extra settings
    const content = el.innerHTML;
    el.innerHTML = content.replace('Version 5.7', 'Version 9.3');

    // Append expanded settings
    const extra = document.createElement('div');
    const s = game.state.settings;
    extra.innerHTML = `
      <div class="settings-section">
        <h3>Gameplay</h3>
        <label class="setting-toggle">
          <input type="checkbox" ${s.notifications !== false ? 'checked' : ''} onchange="game.state.settings.notifications=this.checked">
          <span>Show Notifications</span>
        </label>
        <label class="setting-toggle">
          <input type="checkbox" ${s.autoLoot !== false ? 'checked' : ''} onchange="game.state.settings.autoLoot=this.checked">
          <span>Auto-Loot Drops</span>
        </label>
        <label class="setting-toggle">
          <input type="checkbox" ${s.combatLog !== false ? 'checked' : ''} onchange="game.state.settings.combatLog=this.checked">
          <span>Combat Log</span>
        </label>
        <label class="setting-toggle">
          <input type="checkbox" ${s.xpTracker !== false ? 'checked' : ''} onchange="game.state.settings.xpTracker=this.checked">
          <span>XP/hr Tracker</span>
        </label>
        <label class="setting-toggle">
          <input type="checkbox" ${s.confirmFlee !== true ? '' : 'checked'} onchange="game.state.settings.confirmFlee=this.checked">
          <span>Confirm Before Fleeing</span>
        </label>
      </div>
      <div class="settings-section">
        <h3>Keyboard Shortcuts</h3>
        <div class="kb-shortcuts-grid">
          <div class="kb-row"><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd><kbd>4</kbd> — Abilities</div>
          <div class="kb-row"><kbd>F</kbd> — Eat Food</div>
          <div class="kb-row"><kbd>S</kbd> — Special Attack</div>
          <div class="kb-row"><kbd>Esc</kbd> — Flee Combat</div>
        </div>
      </div>
      <div class="settings-section">
        <h3>Session Stats</h3>
        <div class="session-overview">
          <div class="so-stat"><span>Session Time</span><span>${Math.floor(getSessionSeconds() / 60)} min</span></div>
          <div class="so-stat"><span>Total Damage Dealt</span><span>${ui.fmt(sessionTracker.totalDmgDealt)}</span></div>
          <div class="so-stat"><span>Total Kills (session)</span><span>${ui.fmt(sessionTracker.killCount)}</span></div>
          <div class="so-stat"><span>Average DPS</span><span>${getDPS()}</span></div>
        </div>
      </div>
    `;
    el.appendChild(extra);
  };

  // ══════════════════════════════════════════════════════════
  // 10. ACTIVITY LOG BUTTON (injected into sidebar)
  // ══════════════════════════════════════════════════════════
  function injectActivityButton() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    if (document.getElementById('notif-history-btn')) return;
    const btn = document.createElement('div');
    btn.id = 'notif-history-btn';
    btn.className = 'activity-log-btn';
    btn.onclick = window._toggleNotifHistory;
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      <span>Activity Log</span>
      <span class="nh-badge" id="notif-history-badge" style="display:none"></span>`;
    // Insert after the level tracker
    const tracker = sidebar.querySelector('#level-tracker');
    if (tracker) {
      tracker.parentElement.insertBefore(btn, tracker.nextSibling);
    } else {
      sidebar.appendChild(btn);
    }
  }

  // ══════════════════════════════════════════════════════════
  // 11. TICK HOOK — update XP/hr display + re-inject button
  // ══════════════════════════════════════════════════════════
  const _origOnTick = ui.onTick.bind(ui);
  let _tickCounter = 0;
  ui.onTick = function () {
    _origOnTick();
    _tickCounter++;
    // Update XP/hr every ~2 seconds (20 ticks at 100ms)
    if (_tickCounter % 20 === 0) {
      updateSkillXpRate();
    }
    // Re-inject activity button if sidebar was re-rendered
    if (_tickCounter % 50 === 0) {
      injectActivityButton();
    }
    // Update tracker panel live if on combat page
    if (_tickCounter % 30 === 0 && ui.currentPage === 'combat' && game.state.combat.active) {
      const tracker = document.querySelector('.tracker-panel');
      if (tracker) {
        const tmp = document.createElement('div');
        tmp.innerHTML = buildTrackerHTML();
        tracker.replaceWith(tmp.firstElementChild);
      }
    }
  };

  // Also hook into renderSidebar to ensure button persists
  const _origRenderSidebar = ui.renderSidebar.bind(ui);
  ui.renderSidebar = function () {
    _origRenderSidebar();
    setTimeout(injectActivityButton, 10);
  };

  // ══════════════════════════════════════════════════════════
  // 12. CONFIRM FLEE PATCH
  // ══════════════════════════════════════════════════════════
  const _origStopCombat = game.stopCombat.bind(game);
  game.stopCombat = function () {
    if (game.state.settings.confirmFlee && game.state.combat.active) {
      if (!confirm('Flee combat? You will lose current fight progress.')) return;
    }
    _origStopCombat();
  };

  // ══════════════════════════════════════════════════════════
  // INIT
  // ══════════════════════════════════════════════════════════
  // Initialize settings defaults
  if (game.state.settings.combatLog === undefined) game.state.settings.combatLog = true;
  if (game.state.settings.xpTracker === undefined) game.state.settings.xpTracker = true;
  if (game.state.settings.confirmFlee === undefined) game.state.settings.confirmFlee = false;

  // Inject activity button on load
  setTimeout(injectActivityButton, 500);

  console.log('[Ashfall] Upgrades v1.0 loaded');
  console.log('  Combat Log: ON');
  console.log('  XP/hr Tracker: ON');
  console.log('  Item Comparison: ON');
  console.log('  Keyboard Shortcuts: 1-4, F, S, Esc');
  console.log('  Notification History: ON');
  console.log('  Settings Expansion: ON');
})();
