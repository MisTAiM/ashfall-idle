// ================================================================
// ASHFALL IDLE — upgrades.js v1.1
// Combat Log, XP/hr Tracker, Item Comparison, Keyboard Shortcuts,
// Notification History, Settings Expansion
// Loads AFTER all other scripts.
// CRITICAL: game.init() and window.ui are created inside ui.js's
// DOMContentLoaded listener. This file MUST also defer to
// DOMContentLoaded so game.state exists and ui methods are patchable.
// ================================================================

window.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ── Guard: both game + ui must be ready ──
  if (typeof game === 'undefined' || !window.ui) {
    console.error('[Upgrades] game or ui not initialised. Aborting.');
    return;
  }
  if (!game.state) {
    console.error('[Upgrades] game.state is null — init not called. Aborting.');
    return;
  }

  const ui = window.ui;

  // ══════════════════════════════════════════════════════════
  // 1. COMBAT LOG — DISABLED (consolidated into main combat page)
  // ══════════════════════════════════════════════════════════
  // The unified combat log is now on the main combat page in ui.js
  // This system remains here for reference but is not rendered.

  function logEntry(type, text, color) {
    const now = new Date();
    const ts = String(now.getHours()).padStart(2, '0') + ':' +
               String(now.getMinutes()).padStart(2, '0') + ':' +
               String(now.getSeconds()).padStart(2, '0');
    combatLog.push({ type, text, color, ts });
    if (combatLog.length > MAX_LOG) combatLog.shift();
    _renderCombatLogLive();
  }

  function _renderCombatLogLive() {
    const el = document.getElementById('combat-log-entries');
    if (!el || combatLogCollapsed) return;
    let html = '';
    const start = Math.max(0, combatLog.length - 40);
    for (let i = start; i < combatLog.length; i++) {
      const e = combatLog[i];
      html += '<div class="clog-entry clog-' + e.type + '"><span class="clog-ts">' + e.ts + '</span><span class="clog-text" style="color:' + e.color + '">' + e.text + '</span></div>';
    }
    el.innerHTML = html;
    el.scrollTop = el.scrollHeight;
  }

  function _buildCombatLogHTML() {
    const vis = combatLogCollapsed ? 'none' : 'block';
    const arrow = combatLogCollapsed ? '&#9654;' : '&#9660;';
    let html = '<div class="combat-log-panel" id="combat-log-panel">';
    html += '<div class="clog-header" onclick="window._toggleCombatLog()">';
    html += '<span class="clog-arrow">' + arrow + '</span>';
    html += '<span class="clog-title">Combat Log</span>';
    html += '<button class="clog-clear-btn" onclick="event.stopPropagation();window._clearCombatLog()">Clear</button>';
    html += '</div>';
    html += '<div class="clog-body" id="combat-log-entries" style="display:' + vis + '">';
    const start = Math.max(0, combatLog.length - 40);
    for (let i = start; i < combatLog.length; i++) {
      const e = combatLog[i];
      html += '<div class="clog-entry clog-' + e.type + '"><span class="clog-ts">' + e.ts + '</span><span class="clog-text" style="color:' + e.color + '">' + e.text + '</span></div>';
    }
    html += '</div></div>';
    return html;
  }

  window._toggleCombatLog = function() {
    combatLogCollapsed = !combatLogCollapsed;
    var body = document.getElementById('combat-log-entries');
    if (body) body.style.display = combatLogCollapsed ? 'none' : 'block';
    var arrow = document.querySelector('.clog-arrow');
    if (arrow) arrow.innerHTML = combatLogCollapsed ? '&#9654;' : '&#9660;';
  };
  window._clearCombatLog = function() { combatLog.length = 0; _renderCombatLogLive(); };

  // ── Engine event listeners for combat log ──
  game.on('combatHit', function(d) {
    if (d.who === 'player') {
      if (d.miss) {
        logEntry('miss', 'You miss.', '#666');
      } else {
        var tag = d.crit ? ' (CRIT)' : '';
        logEntry('hit', 'You hit ' + d.dmg + tag, d.crit ? '#ffd700' : '#4a8a3e');
      }
    } else {
      if (d.miss || d.dodge) {
        logEntry('dodge', d.dodge ? 'You dodge the attack.' : 'Monster misses.', '#60c0e0');
      } else {
        logEntry('hit', 'Monster hits you for ' + d.dmg, '#c44040');
      }
    }
  });

  game.on('lootDrop', function(d) {
    if (!d.bag) return;
    for (var idx = 0; idx < d.bag.length; idx++) {
      var drop = d.bag[idx];
      var item = GAME_DATA.items[drop.item];
      var rc = (drop.rarity === 'legendary' || drop.rarity === 'mythic') ? '#ffd700'
        : drop.rarity === 'epic' ? '#a855f7' : drop.rarity === 'rare' ? '#60c0e0' : '#aaa';
      logEntry('loot', 'Loot: ' + (item ? item.name : drop.item) + ' x' + drop.qty, rc);
    }
  });

  game.on('levelup', function(d) {
    var sk = GAME_DATA.skills[d.skill];
    logEntry('levelup', (sk ? sk.name : d.skill) + ' leveled up to ' + d.level + '!', '#ffd700');
  });

  game.on('notification', function(n) {
    if (n.type === 'danger' && n.text && n.text.indexOf('defeated') !== -1) {
      logEntry('death', n.text, '#ff4040');
    }
  });

  game.on('combatStart', function() {
    combatLog.length = 0;
    logEntry('system', 'Combat started.', '#c9873e');
  });

  // ══════════════════════════════════════════════════════════
  // 2. XP/HR & DPS TRACKER
  // ══════════════════════════════════════════════════════════
  var tracker = {
    startTime: Date.now(),
    startXp: {},
    dmgDealt: 0,
    dmgTaken: 0,
    kills: 0,
  };

  function snapshotXp() {
    if (!game.state || !game.state.skills) return;
    var keys = Object.keys(game.state.skills);
    for (var i = 0; i < keys.length; i++) {
      tracker.startXp[keys[i]] = game.state.skills[keys[i]].xp;
    }
  }
  snapshotXp();

  game.on('combatHit', function(d) {
    if (d.who === 'player' && !d.miss) tracker.dmgDealt += (d.dmg || 0);
    if (d.who === 'monster' && !d.miss && !d.dodge) tracker.dmgTaken += (d.dmg || 0);
  });

  game.on('lootDrop', function() { tracker.kills++; });

  function sessionSecs() { return Math.max(1, (Date.now() - tracker.startTime) / 1000); }

  function xpPerHour(sId) {
    var sk = game.state.skills[sId]; if (!sk) return 0;
    var gained = sk.xp - (tracker.startXp[sId] || 0);
    if (gained <= 0) return 0;
    return Math.floor(gained / (sessionSecs() / 3600));
  }

  function getDps() { return (tracker.dmgDealt / sessionSecs()).toFixed(1); }

  function getKph() {
    var h = sessionSecs() / 3600;
    return h > 0 ? Math.floor(tracker.kills / h) : 0;
  }

  function _buildTrackerHTML() {
    var secs = sessionSecs();
    var m = Math.floor(secs / 60);
    var h = Math.floor(m / 60);
    var tStr = h > 0 ? h + 'h ' + (m % 60) + 'm' : m + 'm';

    var html = '<div class="tracker-panel" id="tracker-panel">';
    html += '<div class="tracker-header">';
    html += '<span class="tracker-title">Session Tracker</span>';
    html += '<span class="tracker-time">' + tStr + '</span>';
    html += '<button class="clog-clear-btn" onclick="window._resetTracker()">Reset</button>';
    html += '</div>';
    html += '<div class="tracker-stats">';
    html += '<div class="tracker-stat"><span class="ts-label">DPS</span><span class="ts-val">' + getDps() + '</span></div>';
    html += '<div class="tracker-stat"><span class="ts-label">Kills/hr</span><span class="ts-val">' + ui.fmt(getKph()) + '</span></div>';
    html += '<div class="tracker-stat"><span class="ts-label">Dmg Dealt</span><span class="ts-val">' + ui.fmt(tracker.dmgDealt) + '</span></div>';
    html += '<div class="tracker-stat"><span class="ts-label">Dmg Taken</span><span class="ts-val">' + ui.fmt(tracker.dmgTaken) + '</span></div>';
    html += '</div>';

    // XP/hr rows
    var skills = ['attack','strength','defence','hitpoints','ranged','magic','prayer','slayer'];
    var rows = '';
    for (var i = 0; i < skills.length; i++) {
      var r = xpPerHour(skills[i]);
      if (r > 0) {
        var name = GAME_DATA.skills[skills[i]] ? GAME_DATA.skills[skills[i]].name : skills[i];
        rows += '<div class="tracker-xp-row"><span class="txr-name">' + name + '</span><span class="txr-rate">' + ui.fmt(r) + ' xp/hr</span></div>';
      }
    }
    if (rows) html += '<div class="tracker-xp">' + rows + '</div>';
    html += '</div>';
    return html;
  }

  window._resetTracker = function() {
    tracker.startTime = Date.now();
    tracker.dmgDealt = 0;
    tracker.dmgTaken = 0;
    tracker.kills = 0;
    snapshotXp();
    if (ui.currentPage === 'combat') ui.renderPage('combat');
  };

  // ══════════════════════════════════════════════════════════
  // 3. ITEM COMPARISON
  // ══════════════════════════════════════════════════════════
  function _buildComparisonBadge(itemId) {
    var item = GAME_DATA.items[itemId];
    if (!item || !item.slot || !item.stats) return '';
    var eqId = game.state.equipment[item.slot];
    var eqItem = eqId ? GAME_DATA.items[eqId] : null;
    var eqStats = (eqItem && eqItem.stats) ? eqItem.stats : {};
    var eqName = eqItem ? eqItem.name : 'Nothing';
    var allKeys = {};
    var k;
    for (k in item.stats) allKeys[k] = true;
    for (k in eqStats) allKeys[k] = true;
    var parts = [];
    for (k in allKeys) {
      var diff = (item.stats[k] || 0) - (eqStats[k] || 0);
      if (diff === 0) continue;
      var label = k.replace('Bonus', '').replace(/([A-Z])/g, ' $1').trim();
      var color = diff > 0 ? '#4a8a3e' : '#c44040';
      var sign = diff > 0 ? '+' : '';
      parts.push('<span style="color:' + color + '">' + sign + diff + ' ' + label + '</span>');
    }
    if (parts.length === 0) return '';
    return '<div class="bi-compare"><span class="bi-compare-vs">vs ' + eqName + ':</span>' + parts.join(' ') + '</div>';
  }

  // ══════════════════════════════════════════════════════════
  // 4. KEYBOARD SHORTCUTS
  // ══════════════════════════════════════════════════════════
  document.addEventListener('keydown', function(e) {
    var tag = (e.target.tagName || '').toUpperCase();
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (!game.state.combat.active) return;

    switch (e.key) {
      case '1': e.preventDefault(); game.useAbility(0); break;
      case '2': e.preventDefault(); game.useAbility(1); break;
      case '3': e.preventDefault(); game.useAbility(2); break;
      case '4': e.preventDefault(); game.useAbility(3); break;
      case 'f': case 'F':
        e.preventDefault();
        if (game.state.foodBag && game.state.foodBag.length > 0) game.eatFoodSlot(0);
        break;
      case 's': case 'S':
        e.preventDefault(); game.useSpecialAttack(); break;
      case 'Escape':
        e.preventDefault(); game.stopCombat(); ui.renderPage('combat'); break;
    }
  });

  // ══════════════════════════════════════════════════════════
  // 5. NOTIFICATION HISTORY
  // ══════════════════════════════════════════════════════════
  var MAX_HISTORY = 60;
  var notifHistory = [];
  var notifPanelOpen = false;

  var _origToast = ui.toast.bind(ui);
  ui.toast = function(n) {
    _origToast(n);
    var now = new Date();
    var ts = String(now.getHours()).padStart(2, '0') + ':' +
             String(now.getMinutes()).padStart(2, '0') + ':' +
             String(now.getSeconds()).padStart(2, '0');
    notifHistory.unshift({ type: n.type || 'info', text: n.text || '', ts: ts });
    if (notifHistory.length > MAX_HISTORY) notifHistory.pop();
    var badge = document.getElementById('notif-history-badge');
    if (badge && !notifPanelOpen) badge.style.display = 'block';
  };

  window._toggleNotifHistory = function() {
    notifPanelOpen = !notifPanelOpen;
    var panel = document.getElementById('notif-history-panel');
    if (notifPanelOpen) {
      if (!panel) {
        panel = document.createElement('div');
        panel.id = 'notif-history-panel';
        panel.className = 'notif-history-panel';
        document.body.appendChild(panel);
      }
      var html = '<div class="nh-header"><span>Activity Log</span><button class="clog-clear-btn" onclick="window._toggleNotifHistory()">Close</button></div><div class="nh-entries">';
      if (notifHistory.length === 0) {
        html += '<div class="nh-empty">No activity yet.</div>';
      } else {
        for (var i = 0; i < notifHistory.length; i++) {
          var n = notifHistory[i];
          html += '<div class="nh-entry nh-' + n.type + '"><span class="nh-ts">' + n.ts + '</span><span class="nh-text">' + n.text + '</span></div>';
        }
      }
      html += '</div>';
      panel.innerHTML = html;
      panel.style.display = 'block';
      var badge = document.getElementById('notif-history-badge');
      if (badge) badge.style.display = 'none';
    } else {
      if (panel) panel.style.display = 'none';
    }
  };

  // ══════════════════════════════════════════════════════════
  // 6. XP/HR BADGE ON SKILL PAGES
  // ══════════════════════════════════════════════════════════
  function _updateSkillXpRate() {
    var page = ui.currentPage;
    if (!page || !GAME_DATA.skills[page] || !game.state.skills[page]) return;
    var rate = xpPerHour(page);
    var el = document.getElementById('xphr-display');
    if (!el) {
      var xpText = document.querySelector('.sh-xp-text');
      if (!xpText || !xpText.parentElement) return;
      el = document.createElement('span');
      el.id = 'xphr-display';
      el.className = 'xphr-badge';
      xpText.parentElement.appendChild(el);
    }
    el.textContent = rate > 0 ? ui.fmt(rate) + ' xp/hr' : '';
  }

  // ══════════════════════════════════════════════════════════
  // 7. PATCH: renderCombatPage — append tracker + log
  // ══════════════════════════════════════════════════════════
  var _origRenderCombat = ui.renderCombatPage.bind(ui);
  ui.renderCombatPage = function(el) {
    _origRenderCombat(el);
    if (!game.state.combat.active || !game.state.combat.monster) return;
    var container = el.querySelector('.combat-page') || el;
    // Tracker
    var tDiv = document.createElement('div');
    tDiv.innerHTML = _buildTrackerHTML();
    if (tDiv.firstElementChild) container.appendChild(tDiv.firstElementChild);
    // Combat log — DISABLED (using unified log from main combat page instead)
    // var lDiv = document.createElement('div');
    // lDiv.innerHTML = _buildCombatLogHTML();
    // if (lDiv.firstElementChild) container.appendChild(lDiv.firstElementChild);
    // Auto-scroll
    // var logBody = document.getElementById('combat-log-entries');
    // if (logBody) logBody.scrollTop = logBody.scrollHeight;
  };

  // ══════════════════════════════════════════════════════════
  // 8. PATCH: renderBankPage — inject item comparison
  // ══════════════════════════════════════════════════════════
  var _origRenderBank = ui.renderBankPage.bind(ui);
  ui.renderBankPage = function(el) {
    _origRenderBank(el);
    var items = el.querySelectorAll('.bank-item');
    for (var j = 0; j < items.length; j++) {
      var itemEl = items[j];
      var btn = itemEl.querySelector('button[onclick*="equipItem"]');
      if (!btn) continue;
      var onclick = btn.getAttribute('onclick') || '';
      var m = onclick.match(/equipItem\('([^']+)'\)/);
      if (!m) continue;
      var badge = _buildComparisonBadge(m[1]);
      if (!badge) continue;
      var anchor = itemEl.querySelector('.bi-stats') || itemEl.querySelector('.bi-qty');
      if (anchor && anchor.parentElement) {
        var wrap = document.createElement('div');
        wrap.innerHTML = badge;
        if (wrap.firstElementChild) anchor.parentElement.insertBefore(wrap.firstElementChild, anchor);
      }
    }
  };

  // ══════════════════════════════════════════════════════════
  // 9. PATCH: renderSettingsPage — expand + fix version
  // ══════════════════════════════════════════════════════════
  var _origRenderSettings = ui.renderSettingsPage.bind(ui);
  ui.renderSettingsPage = function(el) {
    _origRenderSettings(el);
    el.innerHTML = el.innerHTML.replace('Version 5.7', 'Version 9.4');

    var s = game.state.settings;
    var extra = document.createElement('div');
    extra.innerHTML = '<div class="settings-section">' +
      '<h3>Gameplay</h3>' +
      '<label class="setting-toggle"><input type="checkbox" ' + (s.notifications !== false ? 'checked' : '') + ' onchange="game.state.settings.notifications=this.checked"><span>Show Notifications</span></label>' +
      '<label class="setting-toggle"><input type="checkbox" ' + (s.autoLoot !== false ? 'checked' : '') + ' onchange="game.state.settings.autoLoot=this.checked"><span>Auto-Loot Drops</span></label>' +
      '<label class="setting-toggle"><input type="checkbox" ' + (s.confirmFlee ? 'checked' : '') + ' onchange="game.state.settings.confirmFlee=this.checked"><span>Confirm Before Fleeing</span></label>' +
      '</div>' +
      '<div class="settings-section">' +
      '<h3>Keyboard Shortcuts</h3>' +
      '<div class="kb-shortcuts-grid">' +
      '<div class="kb-row"><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd><kbd>4</kbd> &mdash; Abilities</div>' +
      '<div class="kb-row"><kbd>F</kbd> &mdash; Eat Food</div>' +
      '<div class="kb-row"><kbd>S</kbd> &mdash; Special Attack</div>' +
      '<div class="kb-row"><kbd>Esc</kbd> &mdash; Flee Combat</div>' +
      '</div></div>' +
      '<div class="settings-section">' +
      '<h3>Session Stats</h3>' +
      '<div class="session-overview">' +
      '<div class="so-stat"><span>Session Time</span><span>' + Math.floor(sessionSecs() / 60) + ' min</span></div>' +
      '<div class="so-stat"><span>Total Damage Dealt</span><span>' + ui.fmt(tracker.dmgDealt) + '</span></div>' +
      '<div class="so-stat"><span>Total Kills (session)</span><span>' + ui.fmt(tracker.kills) + '</span></div>' +
      '<div class="so-stat"><span>Average DPS</span><span>' + getDps() + '</span></div>' +
      '</div></div>';
    el.appendChild(extra);
  };

  // ══════════════════════════════════════════════════════════
  // 10. ACTIVITY LOG BUTTON IN SIDEBAR
  // ══════════════════════════════════════════════════════════
  function _injectActivityBtn() {
    var sb = document.getElementById('sidebar');
    if (!sb || document.getElementById('notif-history-btn')) return;
    var btn = document.createElement('div');
    btn.id = 'notif-history-btn';
    btn.className = 'activity-log-btn';
    btn.setAttribute('onclick', 'window._toggleNotifHistory()');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>' +
      '<span>Activity Log</span>' +
      '<span class="nh-badge" id="notif-history-badge" style="display:none"></span>';
    var lt = sb.querySelector('#level-tracker');
    if (lt && lt.nextSibling) {
      lt.parentElement.insertBefore(btn, lt.nextSibling);
    } else {
      sb.appendChild(btn);
    }
  }

  // ══════════════════════════════════════════════════════════
  // 11. TICK HOOK — live updates
  // ══════════════════════════════════════════════════════════
  var _origTick = ui.onTick.bind(ui);
  var _tc = 0;
  ui.onTick = function() {
    _origTick();
    _tc++;
    if (_tc % 20 === 0) _updateSkillXpRate();
    if (_tc % 50 === 0) _injectActivityBtn();
    if (_tc % 30 === 0 && ui.currentPage === 'combat' && game.state.combat.active) {
      var tp = document.getElementById('tracker-panel');
      if (tp) {
        var tmp = document.createElement('div');
        tmp.innerHTML = _buildTrackerHTML();
        if (tmp.firstElementChild) tp.replaceWith(tmp.firstElementChild);
      }
    }
  };

  // Re-inject button when sidebar re-renders
  var _origSidebar = ui.renderSidebar.bind(ui);
  ui.renderSidebar = function() {
    _origSidebar();
    setTimeout(_injectActivityBtn, 20);
  };

  // ══════════════════════════════════════════════════════════
  // 12. CONFIRM FLEE PATCH
  // ══════════════════════════════════════════════════════════
  var _origStop = game.stopCombat.bind(game);
  game.stopCombat = function() {
    if (game.state.settings.confirmFlee && game.state.combat.active) {
      if (!confirm('Flee combat? You will lose current fight progress.')) return;
    }
    _origStop();
  };

  // ══════════════════════════════════════════════════════════
  // INIT
  // ══════════════════════════════════════════════════════════
  if (game.state.settings.confirmFlee === undefined) game.state.settings.confirmFlee = false;
  setTimeout(_injectActivityBtn, 300);

  console.log('[Ashfall] Upgrades v1.1 loaded — combat log, tracker, comparison, shortcuts, history, settings');
});
