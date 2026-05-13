// ================================================================
// ASHFALL IDLE — ui/endgame.js
// Fight Cave UI, Theatre of Ash UI, Chambers of Ash UI.
// Merges: fight-cave-ui.js + theatre-of-ash-ui.js + chambers-of-ash-ui.js
// ================================================================
// ============================================================
// ASHFALL IDLE — FIGHT CAVE UI
// Entry page only. Active combat renders in the main combat page.
// ============================================================

function applyFightCaveUI() {
  if (typeof UI === 'undefined') {
    setTimeout(applyFightCaveUI, 100);
    return;
  }

  // ── RENDER FIGHT CAVE ENTRY PAGE ──────────────────────────
  UI.prototype.renderFightCavePage = function(el) {
    const s = this.engine.state;
    const fc = s.fightCave;

    // If Fight Cave is active, redirect to combat page
    if (fc && fc.active) {
      this.currentPage = 'combat';
      this.renderPage('combat');
      return;
    }

    const combatLv = this.engine.getCombatLevel();
    const prayerLv = s.skills.prayer?.level || 1;
    const meetsReqs = combatLv >= GAME_DATA.fightCave.levelReq && prayerLv >= GAME_DATA.fightCave.prayerReq;
    const fireCape = GAME_DATA.items.ember_cape;

    let html = `<div class="fight-cave-page">`;
    html += `<div class="fc-header">
      <h1 class="fc-title">${ICONS.combat || ''} The Fight Cave</h1>
      <p class="fc-subtitle">${GAME_DATA.fightCave.desc}</p>
    </div>`;

    html += `<div class="fc-requirements">
      <h2 class="section-title">Requirements</h2>
      <div class="fc-req-row"><span class="${combatLv >= GAME_DATA.fightCave.levelReq ? 'fc-req-met' : 'fc-req-unmet'}">Combat Level ${GAME_DATA.fightCave.levelReq} ${combatLv >= GAME_DATA.fightCave.levelReq ? '✓' : '✗'} (You: ${combatLv})</span></div>
      <div class="fc-req-row"><span class="${prayerLv >= GAME_DATA.fightCave.prayerReq ? 'fc-req-met' : 'fc-req-unmet'}">Prayer Level ${GAME_DATA.fightCave.prayerReq} ${prayerLv >= GAME_DATA.fightCave.prayerReq ? '✓' : '✗'} (You: ${prayerLv})</span></div>
      <div class="fc-req-row"><span class="${(s.foodBag && s.foodBag.length > 0) ? 'fc-req-met' : 'fc-req-unmet'}">Food Equipped ${(s.foodBag && s.foodBag.length > 0) ? '✓' : '✗'}</span></div>
    </div>`;

    html += `<div class="fc-reward-card">
      <h2 class="section-title">Reward: Ember Cape</h2>
      <div class="fc-reward-stats">Atk: +${fireCape?.stats?.attackBonus || 8} | Str: +${fireCape?.stats?.strengthBonus || 8} | Def: +${fireCape?.stats?.defenceBonus || 14} | DR: +${fireCape?.stats?.damageReduction || 5}%</div>
      <p class="fc-reward-desc">Best-in-slot melee cape. Untradeable. Earned, never given.</p>
    </div>`;

    html += `<div class="fc-phases"><h2 class="section-title">63 Waves — Phase Breakdown</h2>`;
    for (const phase of GAME_DATA.fightCave.phases) {
      html += `<div class="fc-phase-row">
        <span class="fc-phase-waves">W${phase.startWave}-${phase.endWave}</span>
        <span class="fc-phase-name">${phase.name}</span>
        <span class="fc-phase-tip">${phase.tip}</span>
      </div>`;
    }
    html += `</div>`;

    html += `<div class="fc-bestiary"><h2 class="section-title">Monsters</h2><div class="fc-monster-grid">`;
    const fcMonsters = ['cinder_bat','magma_blob','obsidian_ranger','molten_brute','volcanic_mage','tztok_jad','yt_hurkot'];
    for (const mId of fcMonsters) {
      const m = GAME_DATA.monsters[mId];
      if (!m) continue;
      const styleColors = { melee:'#e74c3c', ranged:'#27ae60', magic:'#3498db' };
      html += `<div class="fc-monster-card">
        <div class="fc-mon-art">${GAME_DATA.monsterArt?.[mId] || ''}</div>
        <div class="fc-mon-header">
          <span class="fc-mon-name">${m.name}</span>
          <span class="fc-mon-level" style="color:${styleColors[m.style]||'#aaa'}">Lv ${m.combatLevel} (${m.style})</span>
        </div>
        <div class="fc-mon-stats">HP: ${m.hp} | Max Hit: ${m.maxHit} | XP: ${m.xp||0}</div>
        <p class="fc-mon-desc">${m.desc}</p>
      </div>`;
    }
    html += `</div></div>`;

    html += `<div class="fc-stats"><h2 class="section-title">Your Fight Cave Stats</h2>
      <div class="fc-stat-row">Attempts: ${s.stats.fightCaveAttempts || 0}</div>
      <div class="fc-stat-row">Completions: ${s.stats.fightCaveCompletions || 0}</div>
      <div class="fc-stat-row">Deaths: ${s.stats.fightCaveDeaths || 0}</div>
      <div class="fc-stat-row">Best Wave: ${s.stats.fightCaveBestWave || 0}/63</div>
      <div class="fc-stat-row">Jad Kills: ${s.stats.jadKills || 0}</div>
      <div class="fc-stat-row">Jad Deaths: ${s.stats.jadDeaths || 0}</div>
    </div>`;

    html += `<div class="fc-warning">
      <p>Death resets all progress. Supplies consumed during the run are lost forever.</p>
      <p>This is a safe death — no XP or equipment loss.</p>
      <p>Equip your best gear, fill your food bag, and stock prayer potions before entering.</p>
    </div>`;

    html += `<div class="fc-enter">
      <button class="btn btn-lg ${meetsReqs ? 'btn-danger' : ''}" ${meetsReqs ? '' : 'disabled'} data-fc-action="start">
        ${meetsReqs ? 'Enter the Fight Cave' : 'Requirements Not Met'}
      </button>
    </div></div>`;
    el.innerHTML = html;
  };

  console.log('[Ashfall] Fight Cave UI loaded (entry page only).');
}

applyFightCaveUI();

// ── EVENT DELEGATION + LISTENERS ────────────────────────────
(function() {
  function attachFightCaveListeners() {
    if (typeof game === 'undefined' || typeof ui === 'undefined') {
      setTimeout(attachFightCaveListeners, 100);
      return;
    }

    // Single document listener for all Fight Cave data-fc-action buttons
    document.addEventListener('click', function(e) {
      const btn = e.target.closest('[data-fc-action]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      const action = btn.getAttribute('data-fc-action');
      const param = btn.getAttribute('data-fc-param');
      switch (action) {
        case 'start': game.startFightCave(); break;
        case 'flee': if (confirm('Flee the Fight Cave? All progress will be lost!')) game.fleeFightCave(); break;
        case 'eat': game.eatFood(); break;
        case 'potion': game.drinkPotionBelt(parseInt(param)); break;
        case 'jad-flick': game.jadPrayerFlick(param); break;
        case 'tag-healer': game.tagJadHealer(parseInt(param)); break;
        case 'switch-target': game.switchFightCaveTarget(parseInt(param)); break;
      }
    });

    // Fight Cave starts → navigate to main combat page
    game.on('fightCaveStart', () => {
      ui.currentPage = 'combat';
      ui.renderSidebar();
      ui.renderPage('combat');
    });

    // Fight Cave ends → back to entry page
    game.on('fightCaveEnd', () => {
      ui.currentPage = 'fight_cave';
      ui.renderSidebar();
      ui.renderPage('fight_cave');
    });

    // Re-render combat page during active Fight Cave on state changes
    let _last = {};
    game.on('tick', () => {
      const fc = game.state.fightCave;
      if (!fc || !fc.active || ui.currentPage !== 'combat') return;

      const alive = fc.waveMonsterAlive ? Object.values(fc.waveMonsterAlive).filter(v => v).length : 0;
      const now = { p: fc.jadPhase, w: fc.currentWave, t: fc.currentMonsterIdx, b: fc.betweenWaves, a: alive };

      if (now.p !== _last.p || now.w !== _last.w || now.t !== _last.t || now.b !== _last.b || now.a !== _last.a) {
        _last = now;
        ui.renderPage('combat');
        return;
      }
      _last = now;

      // Targeted bar updates only (no re-render)
      if (fc.jadPhase === 'charging') {
        const f = document.getElementById('fc-jad-charge-fill');
        if (f) f.style.width = ((fc.jadChargeTimer / 2.0) * 100) + '%';
      }
      if (fc.jadPhase === 'awaiting_input') {
        const tLeft = Math.max(0, 2.5 - fc.jadInputTimer);
        const f = document.getElementById('fc-jad-timer-fill');
        const l = document.getElementById('fc-jad-timer-label');
        if (f) f.style.width = ((tLeft / 2.5) * 100) + '%';
        if (l) l.textContent = `PRAY NOW! ${tLeft.toFixed(1)}s`;
      }
      if (fc.betweenWaves) {
        const b = document.getElementById('fc-between-timer');
        if (b) b.textContent = `Next wave in ${Math.ceil(fc.betweenWaveTimer)}s...`;
      }
    });

    console.log('[Ashfall] Fight Cave listeners attached (routes to combat page).');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachFightCaveListeners);
  } else {
    attachFightCaveListeners();
  }
})();

// ================================================================
// ASHFALL IDLE — Theatre of Ash UI
// ================================================================

UI.prototype.renderTheatreOfAshPage = function(el) {
  const s = this.engine.state;
  const t = s.theatre;
  const toa = GAME_DATA.theatreOfAsh;
  const cl = this.engine.getCombatLevel();
  const locked = cl < toa.levelReq;

  let html = this.header('Theatre of Ash', 'combat', 'Six rooms. Six bosses. One chest. Prove yourself.', null);

  // ── LOCKED ───────────────────────────────────────────────────
  if (locked) {
    html += `<div class="toa-locked">
      <div class="toa-lock-icon">🔒</div>
      <div class="toa-lock-title">Theatre of Ash</div>
      <div class="toa-lock-desc">Requires combat level ${toa.levelReq}. You are level ${cl}.</div>
      <div class="toa-lock-tip">Master combat in the Fight Cave and fight world bosses to prepare yourself.</div>
    </div>`;
    el.innerHTML = html + '</div>';
    return;
  }

  // ── ENTRY SCREEN ─────────────────────────────────────────────
  if (!t?.active && !t?.chestOpen) {
    html += this._renderToaEntry();
    el.innerHTML = html;
    return;
  }

  // ── CHEST SCREEN ─────────────────────────────────────────────
  if (t.room >= toa.rooms.length || t.chestOpen) {
    html += this._renderToaChest(t);
    el.innerHTML = html;
    return;
  }

  // ── ACTIVE RAID ───────────────────────────────────────────────
  html += this._renderToaRaid(t, s);
  el.innerHTML = html;
  this._attachToaListeners();
};

UI.prototype._renderToaEntry = function() {
  const toa = GAME_DATA.theatreOfAsh;
  const s = this.engine.state;
  const completions = s.stats?.theatreCompletions || 0;
  const bestTier = s.stats?.theatreBestTier || '—';

  let roomList = '';
  toa.rooms.forEach((r, i) => {
    const boss = TOA_BOSSES[r.bossId];
    roomList += `<div class="toa-room-preview">
      <span class="toa-room-num">${i+1}</span>
      <span class="toa-room-name">${r.name}</span>
      <span class="toa-boss-name">${boss.name}</span>
      <span class="toa-boss-info">Lv${boss.combatLevel} · ${boss.hp.toLocaleString()}HP · ${boss.style}</span>
      <span class="toa-boss-mechanic">${boss.mechanic.name}: ${boss.mechanic.handleDesc}</span>
    </div>`;
  });

  const tierBadge = bestTier !== '—' ? `<span class="toa-tier-badge toa-tier-${bestTier}">${bestTier.toUpperCase()}</span>` : '';

  return `<div class="toa-entry-screen">
    <div class="toa-header-art">${this._getToaSvg()}</div>
    <div class="toa-entry-stats">
      <div class="toa-stat"><span class="toa-stat-n">${completions}</span><span class="toa-stat-l">Completions</span></div>
      <div class="toa-stat"><span class="toa-stat-n">${tierBadge || '—'}</span><span class="toa-stat-l">Best Tier</span></div>
      <div class="toa-stat"><span class="toa-stat-n">6</span><span class="toa-stat-l">Rooms</span></div>
      <div class="toa-stat"><span class="toa-stat-n">Lv100+</span><span class="toa-stat-l">Requirement</span></div>
    </div>

    <div class="toa-tier-table">
      <div class="toa-tier-row"><span class="toa-tier-badge toa-tier-purple">PURPLE</span><span>0 deaths · under 15 min → Unique item chance</span></div>
      <div class="toa-tier-row"><span class="toa-tier-badge toa-tier-gold">GOLD</span><span>0 deaths · under 30 min → Legendary loot guaranteed</span></div>
      <div class="toa-tier-row"><span class="toa-tier-badge toa-tier-silver">SILVER</span><span>0–1 deaths → Better loot + celestial fragments</span></div>
      <div class="toa-tier-row"><span class="toa-tier-badge toa-tier-bronze">BRONZE</span><span>Cleared — base loot, runes, bars</span></div>
    </div>

    <div class="toa-rooms-list">${roomList}</div>

    <div class="toa-unique-preview">
      <div class="toa-unique-title">Theatre Exclusive Items</div>
      <div class="toa-unique-grid">
        ${['veriax_scythe','bloodfire_staff','ashen_rapier','judicator_plate','hollow_ward','void_tear','veriax_eye','lil_veriax'].map(id => {
          const item = GAME_DATA.items[id];
          if (!item) return '';
          return `<div class="toa-unique-item" title="${item.desc||''}">
            <div class="toa-ui-icon">${window.renderItemSprite ? window.renderItemSprite(id,32) : '?'}</div>
            <div class="toa-ui-name">${item.name}</div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <div class="toa-entry-warning">
      ⚠ Bring food, potions, and your best gear. You cannot freely leave once inside.
    </div>
    <button class="btn btn-lg toa-enter-btn" onclick="game.startTheatreOfAsh(); ui.renderPage('theatre')">
      Enter the Theatre of Ash
    </button>
  </div>`;
};

UI.prototype._renderToaRaid = function(t, s) {
  const c = s.combat;
  const toa = GAME_DATA.theatreOfAsh;
  const roomDef = toa.rooms[t.room] || toa.rooms[toa.rooms.length - 1];
  const boss = TOA_BOSSES[roomDef?.bossId] || {};

  // Room progress map
  let progressMap = '<div class="toa-progress-map">';
  toa.rooms.forEach((r, i) => {
    const cleared = t.roomsCleared.includes(r.id);
    const current = i === t.room && !t.between;
    const next = i === t.room && t.between;
    progressMap += `<div class="toa-prog-room ${cleared?'toa-prog-cleared':''} ${current?'toa-prog-current':''} ${next?'toa-prog-next':''}">
      <span class="toa-prog-num">${i+1}</span>
      <span class="toa-prog-name">${r.name}</span>
      <span class="toa-prog-status">${cleared?'✓':current?'⚔':next?'…':'·'}</span>
    </div>`;
  });
  progressMap += '</div>';

  // Performance bar
  const mins = Math.floor(t.performance.elapsedSecs / 60);
  const secs = Math.floor(t.performance.elapsedSecs % 60);
  const perfBar = `<div class="toa-perf-bar">
    <span class="toa-perf-item"><span class="toa-perf-label">Time</span><span class="toa-perf-val" id="toa-time">${mins}:${String(secs).padStart(2,'0')}</span></span>
    <span class="toa-perf-item"><span class="toa-perf-label">Deaths</span><span class="toa-perf-val ${t.performance.deaths>0?'toa-deaths-bad':''}">${t.performance.deaths}</span></span>
    <span class="toa-perf-item"><span class="toa-perf-label">Room</span><span class="toa-perf-val">${t.room+1}/6</span></span>
    <span class="toa-perf-item"><span class="toa-perf-label">Phase</span><span class="toa-perf-val">${t.phase+1}/${boss.phases||1}</span></span>
    <button class="btn btn-danger btn-xs toa-flee-btn" onclick="if(confirm('Abandon the Theatre? All progress lost.'))game.leaveTheatre()">Flee</button>
  </div>`;

  // Between rooms
  if (t.between) {
    const maxHp = this.engine.getMaxHp();
    const pHp = Math.max(0, c.playerHp || 0);
    return `${progressMap}${perfBar}
    <div class="toa-between-rooms">
      <div class="toa-between-title">Between Rooms</div>
      <div class="toa-between-next">Next: <strong>${TOA_BOSSES[toa.rooms[t.room]?.bossId]?.name || '...'}</strong></div>
      <div class="toa-between-timer">Entering in <span id="toa-between-timer">${Math.ceil(t.betweenTimer)}</span>s...</div>
      <div class="toa-between-hp">
        <div class="toa-hp-bar"><div class="toa-hp-fill" id="toa-php-fill" style="width:${(pHp/maxHp*100).toFixed(0)}%"></div></div>
        <div class="toa-hp-text">${Math.floor(pHp)} / ${maxHp} HP</div>
      </div>
      <div class="toa-food-strip">${this._renderToaFoodStrip(s)}</div>
    </div>`;
  }

  // Active boss fight
  const maxHp = this.engine.getMaxHp();
  const pHp = Math.max(0, c.playerHp || 0);
  const pPct = (pHp / maxHp * 100).toFixed(1);
  const pCol = pPct > 50 ? '#4a8a3e' : pPct > 25 ? '#c4a83a' : '#c44040';
  const mHp = Math.max(0, c.monsterHp || 0);
  const mPct = (mHp / boss.hp * 100).toFixed(1);
  const mCol = mPct > 50 ? '#8a3a3a' : mPct > 25 ? '#c4a83a' : '#4a8a3e';

  const mechHtml = t.mechanic && !t.mechanic.handled ? `
    <div class="toa-mechanic-alert">
      <div class="toa-mech-name">⚡ ${t.mechanic.name}</div>
      <div class="toa-mech-desc">${t.mechanic.handleDesc}</div>
      <div class="toa-mech-timer-bar"><div class="toa-mech-fill" id="toa-mech-fill"></div></div>
      <button class="btn toa-handle-btn" onclick="game.handleTheatreMechanic()">Handle Mechanic</button>
    </div>` : `<div class="toa-no-mechanic">Ready — handle the next mechanic when it appears</div>`;

  return `${progressMap}${perfBar}
  <div class="toa-boss-arena">
    <div class="toa-boss-info-bar">
      <div class="toa-boss-art">${GAME_DATA.monsterArt?.[roomDef.bossId] || this._getToaBossArt(roomDef.bossId)}</div>
      <div class="toa-boss-center">
        <div class="toa-boss-name-big">${boss.name}</div>
        <div class="toa-boss-phase">Phase ${t.phase+1} of ${boss.phases} · ${boss.styleHints}</div>
        <div class="toa-boss-hp-wrap">
          <div class="toa-hp-bar toa-boss-hp-bar"><div class="toa-hp-fill toa-boss-hp-fill" id="toa-mhp-fill" style="width:${mPct}%;background:${mCol}"></div></div>
          <div class="toa-hp-text" id="toa-mhp-text">${Math.ceil(mHp).toLocaleString()} / ${boss.hp.toLocaleString()}</div>
        </div>
      </div>
      <div class="toa-player-hp-col">
        <div class="toa-boss-phase">Your HP</div>
        <div class="toa-hp-bar"><div class="toa-hp-fill" id="toa-php-fill" style="width:${pPct}%;background:${pCol}"></div></div>
        <div class="toa-hp-text" id="toa-php-text">${Math.floor(pHp)} / ${maxHp}</div>
        <div class="toa-food-strip">${this._renderToaFoodStrip(s)}</div>
      </div>
    </div>
    <div class="toa-mechanic-zone">${mechHtml}</div>
    <div class="toa-ability-bar">${this._renderToaAbilityBar(s, c)}</div>
    <div class="toa-splat-row">
      <div class="splat-area" id="toa-player-splats"></div>
      <div class="splat-area" id="toa-monster-splats"></div>
    </div>
  </div>`;
};

UI.prototype._renderToaAbilityBar = function(s, c) {
  if (!s.equippedAbilities?.length) return '<div class="toa-no-abilities">No abilities equipped — set them up on the Abilities page.</div>';
  let html = '';
  for (let i = 0; i < 4; i++) {
    const aid = s.equippedAbilities[i];
    const ab = aid ? (GAME_DATA.abilities||[]).find(a => a.id === aid) : null;
    const cd = ab ? (c.abilityCooldowns?.[aid] || 0) : 0;
    if (ab) {
      const cdPct = cd > 0 ? Math.min(100, (cd / ab.cooldown) * 100) : 0;
      html += `<button class="ab-slot-v2 toa-ab-slot ${cd>0?'ab-cd':''}" onclick="game.useAbility('${aid}')" title="${ab.desc}">
        <div class="ab-cd-overlay" style="height:${cdPct}%"></div>
        <div class="ab-content">
          <div class="ab-name">${ab.name}</div>
          <div class="ab-timer">${cd>0?Math.ceil(cd)+'s':'Ready'}</div>
        </div>
      </button>`;
    } else {
      html += `<div class="ab-slot-v2 ab-empty toa-ab-slot"><div class="ab-content">Slot ${i+1}</div></div>`;
    }
  }
  return html;
};

UI.prototype._renderToaFoodStrip = function(s) {
  if (!s.foodBag?.length) return '<div class="toa-no-food">No food</div>';
  return s.foodBag.slice(0,4).map((f,i) => {
    if (!f?.id || !f.qty) return '';
    const item = GAME_DATA.items[f.id];
    return `<button class="toa-food-btn" onclick="game.eatFood()" title="${item?.name} (+${item?.heals||0}HP)">${item?.name?.split(' ')[0]} ×${f.qty}</button>`;
  }).join('');
};

UI.prototype._renderToaChest = function(t) {
  if (!t) return '';
  const tierColors = { bronze:'#cd7f32', silver:'#c0c0c0', gold:'#d4a83a', purple:'#9b30d0' };
  const col = tierColors[t.tier] || '#888';
  const mins = Math.floor(t.performance.elapsedSecs / 60);

  if (!t.chestOpen) {
    return `<div class="toa-chest-screen">
      <div class="toa-complete-banner" style="border-color:${col}">
        <div class="toa-complete-title" style="color:${col}">Theatre of Ash — Complete!</div>
        <div class="toa-complete-tier">
          <span class="toa-tier-badge toa-tier-${t.tier}">${t.tier.toUpperCase()} CHEST</span>
        </div>
        <div class="toa-complete-stats">
          <span>Cleared in ${mins}m</span>
          <span>${t.performance.deaths} deaths</span>
          <span>${t.roomsCleared.length}/6 rooms</span>
        </div>
      </div>
      <div class="toa-chest-container" onclick="game.openTheatreChest(); ui.renderPage('theatre')">
        <div class="toa-chest-art toa-chest-closed toa-chest-${t.tier}">${this._getChestSvg(t.tier, false)}</div>
        <div class="toa-chest-prompt">Click to open your ${t.tier.toUpperCase()} chest</div>
      </div>
      <button class="btn btn-danger" onclick="game.leaveTheatre(); ui.renderPage('theatre')" style="margin-top:16px">Leave Theatre</button>
    </div>`;
  }

  // Chest opened — show loot
  let lootHtml = '';
  for (const drop of t.loot) {
    const item = GAME_DATA.items[drop.item];
    if (!item) continue;
    const rc = drop.rarity === 'unique' ? '#d4a83a' : drop.rarity === 'legendary' ? '#c44040' :
               drop.rarity === 'epic' ? '#8a5ec4' : drop.rarity === 'rare' ? '#4a7ec4' : '#888';
    lootHtml += `<div class="toa-loot-item" style="border-color:${rc}">
      <div class="toa-li-icon">${window.renderItemSprite ? window.renderItemSprite(drop.item, 40) : ''}</div>
      <div class="toa-li-name" style="color:${rc}">${item.name}</div>
      <div class="toa-li-qty">×${drop.qty}</div>
    </div>`;
  }

  const uniqueHtml = t.uniqueItem ? `
    <div class="toa-unique-drop-banner">
      <div class="toa-unique-glow"></div>
      <div class="toa-unique-text">UNIQUE DROP</div>
      <div class="toa-unique-item-name">${GAME_DATA.items[t.uniqueItem]?.name}</div>
      <div class="toa-unique-icon">${window.renderItemSprite ? window.renderItemSprite(t.uniqueItem, 64) : ''}</div>
    </div>` : '';

  return `<div class="toa-chest-screen">
    ${uniqueHtml}
    <div class="toa-chest-open toa-chest-${t.tier}">${this._getChestSvg(t.tier, true)}</div>
    <div class="toa-loot-grid">${lootHtml || '<div class="toa-no-loot">Nothing notable this time.</div>'}</div>
    <div class="toa-complete-stats" style="margin:12px 0">
      <span>Cleared in ${mins}m</span>
      <span>${t.performance.deaths} deaths</span>
      <span class="toa-tier-badge toa-tier-${t.tier}">${t.tier.toUpperCase()}</span>
    </div>
    <button class="btn btn-primary" onclick="game.leaveTheatre(); ui.renderPage('theatre')" style="margin-top:8px">Leave Theatre</button>
  </div>`;
};

UI.prototype._attachToaListeners = function() {
  // Mechanic timer fill — update every 200ms without re-rendering
  this._toaMechInterval = this._toaMechInterval || setInterval(() => {
    if (!this.engine.state.theatre?.active) return;
    const t = this.engine.state.theatre;
    const c = this.engine.state.combat;
    const toa = GAME_DATA.theatreOfAsh;

    // Boss HP
    const mFill = document.getElementById('toa-mhp-fill');
    const mText = document.getElementById('toa-mhp-text');
    if (mFill && !t.between && t.room < toa.rooms.length) {
      const boss = TOA_BOSSES[toa.rooms[t.room]?.bossId];
      if (boss) {
        const pct = Math.max(0, Math.min(100, (c.monsterHp / boss.hp) * 100));
        const col = pct > 50 ? '#8a3a3a' : pct > 25 ? '#c4a83a' : '#4a8a3e';
        mFill.style.width = pct.toFixed(1) + '%';
        mFill.style.background = col;
        if (mText) mText.textContent = Math.max(0, Math.ceil(c.monsterHp)).toLocaleString() + ' / ' + boss.hp.toLocaleString();
      }
    }

    // Player HP
    const pFill = document.getElementById('toa-php-fill');
    const pText = document.getElementById('toa-php-text');
    const maxHp = this.engine.getMaxHp();
    const pHp = Math.max(0, c.playerHp || 0);
    if (pFill) {
      const pct = (pHp / maxHp * 100).toFixed(1);
      const col = pct > 50 ? '#4a8a3e' : pct > 25 ? '#c4a83a' : '#c44040';
      pFill.style.width = pct + '%';
      pFill.style.background = col;
      if (pText) pText.textContent = Math.floor(pHp) + ' / ' + maxHp;
    }

    // Mechanic timer
    const mechFill = document.getElementById('toa-mech-fill');
    if (mechFill && t.mechanic && !t.mechanic.handled) {
      const boss = TOA_BOSSES[toa.rooms[t.room]?.bossId];
      const maxWindow = boss?.mechanic.windowSecs || 10;
      const pct = Math.max(0, (t.mechanicTimer / maxWindow) * 100);
      mechFill.style.width = pct.toFixed(0) + '%';
      mechFill.style.background = pct > 50 ? '#c4a83a' : '#c44040';
    }

    // Between timer
    const betweenTimer = document.getElementById('toa-between-timer');
    if (betweenTimer && t.between) betweenTimer.textContent = Math.ceil(t.betweenTimer);

    // Time display
    const timeEl = document.getElementById('toa-time');
    if (timeEl) {
      const m = Math.floor(t.performance.elapsedSecs / 60);
      const s2 = Math.floor(t.performance.elapsedSecs % 60);
      timeEl.textContent = m + ':' + String(s2).padStart(2, '0');
    }

    // If between rooms just ended, re-render full page
    if (t._needsRerender) { t._needsRerender = false; this.renderPage('theatre'); }
  }, 200);
};

UI.prototype._getToaSvg = function() {
  return `<svg viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" style="width:200px;height:120px">
    <defs>
      <radialGradient id="toa-bg" cx="50%" cy="80%" r="60%">
        <stop offset="0%" stop-color="#3a0a0a" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#0a0508" stop-opacity="1"/>
      </radialGradient>
    </defs>
    <rect width="200" height="120" fill="url(#toa-bg)"/>
    <!-- Theatre pillars -->
    <rect x="10" y="20" width="12" height="90" fill="#1a0a0a" stroke="#6a1a1a" stroke-width="1"/>
    <rect x="178" y="20" width="12" height="90" fill="#1a0a0a" stroke="#6a1a1a" stroke-width="1"/>
    <rect x="40" y="35" width="8" height="75" fill="#150808" stroke="#5a1515" stroke-width="0.5"/>
    <rect x="152" y="35" width="8" height="75" fill="#150808" stroke="#5a1515" stroke-width="0.5"/>
    <!-- Throne platform -->
    <rect x="70" y="80" width="60" height="30" fill="#2a0a0a" stroke="#8a1a1a" stroke-width="1"/>
    <rect x="80" y="65" width="40" height="20" fill="#3a0a0a" stroke="#aa2a2a" stroke-width="1"/>
    <!-- Veriax silhouette on throne -->
    <ellipse cx="100" cy="55" rx="12" ry="12" fill="#0a0005" stroke="#9b30d0" stroke-width="1.5"/>
    <path d="M88 67 Q100 60 112 67 L115 90 L85 90Z" fill="#0a0005" stroke="#9b30d0" stroke-width="1"/>
    <!-- Crown -->
    <path d="M90 45 L93 38 L97 43 L100 36 L103 43 L107 38 L110 45" stroke="#d4a83a" stroke-width="1.5" fill="none"/>
    <!-- Glow effects -->
    <circle cx="100" cy="55" r="20" fill="#9b30d0" opacity="0.08"/>
    <circle cx="100" cy="55" r="30" fill="#c44040" opacity="0.05"/>
    <!-- Rune circles -->
    <circle cx="100" cy="100" r="25" fill="none" stroke="#4a0a0a" stroke-width="1" stroke-dasharray="3 3"/>
    <circle cx="100" cy="100" r="35" fill="none" stroke="#3a0a0a" stroke-width="0.5" stroke-dasharray="2 4"/>
    <!-- Blood drips -->
    <path d="M20 20 Q22 30 20 40" stroke="#6a1a1a" stroke-width="1.5" fill="none"/>
    <path d="M180 20 Q178 28 180 38" stroke="#6a1a1a" stroke-width="1.5" fill="none"/>
    <path d="M50 10 L50 22 Q51 28 50 34" stroke="#5a1010" stroke-width="1" fill="none"/>
  </svg>`;
};

UI.prototype._getToaBossArt = function(bossId) {
  // Fallback procedural SVGs per boss
  const arts = {
    ashen_maiden:`<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="25" rx="16" ry="18" fill="#1a0a1a" stroke="#c44040" stroke-width="1.5"/>
      <path d="M30 20 Q28 10 24 8" stroke="#c44040" stroke-width="2" fill="none"/>
      <path d="M50 20 Q52 10 56 8" stroke="#c44040" stroke-width="2" fill="none"/>
      <path d="M24 43 Q40 38 56 43 L60 85 Q40 95 20 85Z" fill="#2a0a1a" stroke="#8a1a3a" stroke-width="1"/>
      <path d="M20 43 Q10 55 14 70 Q18 75 24 65" fill="#1a0a14" stroke="#8a1a3a"/>
      <path d="M60 43 Q70 55 66 70 Q62 75 56 65" fill="#1a0a14" stroke="#8a1a3a"/>
      <ellipse cx="33" cy="22" rx="3" ry="3.5" fill="#0a0008"/>
      <ellipse cx="47" cy="22" rx="3" ry="3.5" fill="#0a0008"/>
      <circle cx="33" cy="22" r="1.5" fill="#c44040" opacity="0.9"/>
      <circle cx="47" cy="22" r="1.5" fill="#c44040" opacity="0.9"/>
      <!-- Blood pool -->
      <ellipse cx="40" cy="98" rx="22" ry="5" fill="#5a0a0a" opacity="0.6"/>
    </svg>`,
    plague_golem:`<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="30" width="50" height="55" rx="4" fill="#1a1a0a" stroke="#4a6a1a" stroke-width="2"/>
      <rect x="10" y="40" width="14" height="35" rx="3" fill="#141408" stroke="#3a5a14"/>
      <rect x="56" y="40" width="14" height="35" rx="3" fill="#141408" stroke="#3a5a14"/>
      <rect x="22" y="85" width="10" height="15" rx="2" fill="#141408" stroke="#3a5a14"/>
      <rect x="48" y="85" width="10" height="15" rx="2" fill="#141408" stroke="#3a5a14"/>
      <rect x="18" y="18" width="44" height="16" rx="4" fill="#1a1a0a" stroke="#4a6a1a" stroke-width="1.5"/>
      <circle cx="30" cy="26" r="5" fill="#0a0a04"/><circle cx="30" cy="26" r="3" fill="#6a8a1a" opacity="0.8"/>
      <circle cx="50" cy="26" r="5" fill="#0a0a04"/><circle cx="50" cy="26" r="3" fill="#6a8a1a" opacity="0.8"/>
      <circle cx="22" cy="50" r="3" fill="#4a6a0a" opacity="0.5"/>
      <circle cx="34" cy="58" r="4" fill="#3a5a0a" opacity="0.4"/>
      <circle cx="50" cy="52" r="3" fill="#4a6a0a" opacity="0.5"/>
      <circle cx="58" cy="62" r="4" fill="#3a5a0a" opacity="0.4"/>
      <path d="M25 75 Q40 80 55 75" fill="#2a4a0a" opacity="0.4"/>
    </svg>`,
    ashling_queen:`<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="40" cy="28" rx="14" ry="16" fill="#0a1a0a" stroke="#c9873e" stroke-width="1.5"/>
      <path d="M30 44 Q40 40 50 44 L54 78 Q40 88 26 78Z" fill="#0a1608" stroke="#c9873e" stroke-width="1"/>
      <path d="M22 50 Q14 60 18 72" stroke="#6a4a00" stroke-width="1.5" fill="none"/>
      <path d="M58 50 Q66 60 62 72" stroke="#6a4a00" stroke-width="1.5" fill="none"/>
      <path d="M26 20 Q20 8 14 4" stroke="#c9873e" stroke-width="2" fill="none"/>
      <path d="M54 20 Q60 8 66 4" stroke="#c9873e" stroke-width="2" fill="none"/>
      <path d="M40 14 Q40 2 40 -2" stroke="#c9873e" stroke-width="2" fill="none"/>
      <circle cx="33" cy="25" r="3.5" fill="#080c04"/><circle cx="33" cy="25" r="2" fill="#c9873e" opacity="0.9"/>
      <circle cx="47" cy="25" r="3.5" fill="#080c04"/><circle cx="47" cy="25" r="2" fill="#c9873e" opacity="0.9"/>
      <!-- Swarm dots -->
      <circle cx="10" cy="45" r="2" fill="#c9873e" opacity="0.5"/>
      <circle cx="68" cy="48" r="2" fill="#c9873e" opacity="0.5"/>
      <circle cx="6" cy="62" r="1.5" fill="#c9873e" opacity="0.4"/>
      <circle cx="74" cy="60" r="1.5" fill="#c9873e" opacity="0.4"/>
      <ellipse cx="40" cy="98" rx="20" ry="4" fill="#2a1800" opacity="0.4"/>
    </svg>`,
    hollowed_titan:`<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="35" width="40" height="55" rx="3" fill="#1a1a2a" stroke="#4a5264" stroke-width="2"/>
      <rect x="8" y="38" width="16" height="40" rx="3" fill="#14141c" stroke="#3a4254" stroke-width="1"/>
      <rect x="56" y="38" width="16" height="40" rx="3" fill="#14141c" stroke="#3a4254" stroke-width="1"/>
      <rect x="25" y="90" width="10" height="12" rx="2" fill="#14141c"/>
      <rect x="45" y="90" width="10" height="12" rx="2" fill="#14141c"/>
      <rect x="22" y="20" width="36" height="18" rx="5" fill="#1a1a2a" stroke="#4a5264" stroke-width="2"/>
      <ellipse cx="33" cy="29" rx="4" ry="4.5" fill="#0a0a14"/>
      <ellipse cx="47" cy="29" rx="4" ry="4.5" fill="#0a0a14"/>
      <circle cx="33" cy="29" r="2.5" fill="#8a3ab0" opacity="0.8"/>
      <circle cx="47" cy="29" r="2.5" fill="#8a3ab0" opacity="0.8"/>
      <path d="M22 22 L15 14 M58 22 L65 14" stroke="#4a5264" stroke-width="2"/>
      <path d="M22 54 Q30 50 38 54 M42 54 Q50 50 58 54" stroke="#3a4254" stroke-width="1" fill="none" opacity="0.5"/>
      <path d="M8 60 Q4 65 6 72 L8 78" stroke="#4a5264" stroke-width="1.5" fill="none"/>
      <path d="M72 60 Q76 65 74 72 L72 78" stroke="#4a5264" stroke-width="1.5" fill="none"/>
    </svg>`,
    void_remnant:`<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="42" r="28" fill="#050010" stroke="#8a3ab0" stroke-width="2"/>
      <circle cx="40" cy="42" r="22" fill="#080015" stroke="#6a1a8a" stroke-width="1" stroke-dasharray="4 2"/>
      <circle cx="40" cy="42" r="14" fill="#0a001c" opacity="0.8"/>
      <circle cx="33" cy="36" r="6" fill="#050010"/>
      <circle cx="33" cy="36" r="4" fill="#9b30d0" opacity="0.9"/>
      <circle cx="33" cy="36" r="2" fill="#e0a0ff"/>
      <circle cx="47" cy="36" r="6" fill="#050010"/>
      <circle cx="47" cy="36" r="4" fill="#9b30d0" opacity="0.9"/>
      <circle cx="47" cy="36" r="2" fill="#e0a0ff"/>
      <path d="M34 50 Q40 54 46 50" stroke="#6a1a8a" stroke-width="1.5" fill="none"/>
      <!-- Void tendrils -->
      <path d="M14 22 Q8 30 12 38" stroke="#8a3ab0" stroke-width="1.5" fill="none" opacity="0.6"/>
      <path d="M66 22 Q72 30 68 38" stroke="#8a3ab0" stroke-width="1.5" fill="none" opacity="0.6"/>
      <path d="M40 14 Q30 8 28 14" stroke="#8a3ab0" stroke-width="1" fill="none" opacity="0.5"/>
      <path d="M40 14 Q50 8 52 14" stroke="#8a3ab0" stroke-width="1" fill="none" opacity="0.5"/>
      <path d="M20 62 Q10 70 12 78 Q20 82 24 76" stroke="#6a1a8a" stroke-width="1.5" fill="none"/>
      <path d="M60 62 Q70 70 68 78 Q60 82 56 76" stroke="#6a1a8a" stroke-width="1.5" fill="none"/>
      <ellipse cx="40" cy="98" rx="20" ry="5" fill="#1a0030" opacity="0.5"/>
    </svg>`,
    lady_veriax:`<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
      <!-- Gown -->
      <path d="M26 45 Q40 40 54 45 L62 100 Q40 108 18 100Z" fill="#1a0028" stroke="#9b30d0" stroke-width="1.5"/>
      <path d="M28 58 Q40 54 52 58" stroke="#7020a0" stroke-width="1" fill="none" opacity="0.5"/>
      <path d="M24 72 Q40 68 56 72" stroke="#7020a0" stroke-width="1" fill="none" opacity="0.4"/>
      <!-- Body -->
      <ellipse cx="40" cy="32" rx="14" ry="16" fill="#140020" stroke="#9b30d0" stroke-width="1.5"/>
      <!-- Arms -->
      <path d="M27 45 Q18 52 14 62 Q12 70 18 74" stroke="#200038" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M53 45 Q62 52 66 62 Q68 70 62 74" stroke="#200038" stroke-width="3" fill="none" stroke-linecap="round"/>
      <!-- Hands with orbs -->
      <circle cx="17" cy="76" r="5" fill="#050010" stroke="#9b30d0" stroke-width="1"/>
      <circle cx="17" cy="76" r="3" fill="#9b30d0" opacity="0.7"/>
      <circle cx="63" cy="76" r="5" fill="#050010" stroke="#9b30d0" stroke-width="1"/>
      <circle cx="63" cy="76" r="3" fill="#9b30d0" opacity="0.7"/>
      <!-- Crown + head -->
      <path d="M27 20 L30 12 L34 18 L37 8 L40 16 L43 8 L46 18 L50 12 L53 20" stroke="#d4a83a" stroke-width="2" fill="none"/>
      <circle cx="37" cy="8" r="2" fill="#d4a83a"/>
      <circle cx="43" cy="8" r="2" fill="#d4a83a"/>
      <!-- Face -->
      <ellipse cx="34" cy="28" rx="4" ry="4.5" fill="#0a0010"/>
      <ellipse cx="46" cy="28" rx="4" ry="4.5" fill="#0a0010"/>
      <circle cx="34" cy="28" r="2.5" fill="#d4a83a" opacity="0.95"/>
      <circle cx="46" cy="28" r="2.5" fill="#d4a83a" opacity="0.95"/>
      <circle cx="34" cy="28" r="1" fill="#fff" opacity="0.8"/>
      <circle cx="46" cy="28" r="1" fill="#fff" opacity="0.8"/>
      <!-- Aura -->
      <circle cx="40" cy="50" r="38" fill="none" stroke="#9b30d0" stroke-width="0.5" opacity="0.3"/>
      <circle cx="40" cy="50" r="44" fill="none" stroke="#d4a83a" stroke-width="0.5" opacity="0.2"/>
    </svg>`,
  };
  return arts[bossId] || `<div class="monster-art-placeholder">?</div>`;
};

UI.prototype._getChestSvg = function(tier, opened) {
  const cols = { bronze:['#cd7f32','#8a5520'], silver:['#c0c0c0','#808080'], gold:['#d4a83a','#8a6a20'], purple:['#9b30d0','#5a0a80'] };
  const [c1,c2] = cols[tier] || cols.bronze;
  if (!opened) return `<svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg" style="width:120px;height:96px">
    <rect x="5" y="35" width="90" height="40" rx="4" fill="#1a1008" stroke="${c1}" stroke-width="2"/>
    <rect x="5" y="20" width="90" height="20" rx="4" fill="#221408" stroke="${c1}" stroke-width="2"/>
    <rect x="35" y="30" width="30" height="14" rx="3" fill="#0a0804" stroke="${c1}" stroke-width="1.5"/>
    <circle cx="50" cy="37" r="5" fill="#0a0804" stroke="${c1}" stroke-width="1.5"/>
    <circle cx="50" cy="37" r="2.5" fill="${c1}" opacity="0.8"/>
    <line x1="5" y1="35" x2="95" y2="35" stroke="${c1}" stroke-width="1.5"/>
    <rect x="8" y="23" width="84" height="4" fill="${c1}" opacity="0.1"/>
    <rect x="8" y="38" width="84" height="4" fill="${c1}" opacity="0.1"/>
  </svg>`;
  return `<svg viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg" style="width:120px;height:108px">
    <rect x="5" y="45" width="90" height="40" rx="4" fill="#1a1008" stroke="${c1}" stroke-width="2"/>
    <path d="M5 45 L5 35 Q5 22 12 16 L88 16 Q95 22 95 35 L95 45Z" fill="#221408" stroke="${c1}" stroke-width="2"/>
    <line x1="5" y1="45" x2="95" y2="45" stroke="${c1}" stroke-width="1.5"/>
    <!-- Glow -->
    <ellipse cx="50" cy="50" rx="35" ry="25" fill="${c1}" opacity="0.08"/>
    <!-- Loot sparkles -->
    <circle cx="30" cy="30" r="3" fill="${c1}" opacity="0.8"/>
    <circle cx="70" cy="28" r="2.5" fill="${c1}" opacity="0.7"/>
    <circle cx="50" cy="20" r="4" fill="${c1}" opacity="0.9"/>
    <path d="M50 5 L52 15 L60 10 L52 17" stroke="${c1}" stroke-width="1.5" fill="none" opacity="0.6"/>
    <circle cx="50" cy="65" r="5" fill="#0a0804" stroke="${c1}" stroke-width="1.5"/>
    <circle cx="50" cy="65" r="2.5" fill="${c1}" opacity="0.8"/>
  </svg>`;
};

// ── HOOK LISTENERS ─────────────────────────────────────────────
UI.prototype._initTheatreListeners = function() {
  this.engine.on('theatreTick',    () => { if (this.currentPage === 'theatre') {} }); // HP bars updated by interval
  this.engine.on('theatreStart',   () => { this.currentPage = 'theatre'; this.renderPage('theatre'); });
  this.engine.on('theatreRoom',    () => { if (this.currentPage === 'theatre') this.renderPage('theatre'); });
  this.engine.on('theatreComplete',() => { if (this.currentPage === 'theatre') this.renderPage('theatre'); });
  this.engine.on('theatreEnd',     () => {
    if (this._toaMechInterval) { clearInterval(this._toaMechInterval); this._toaMechInterval = null; }
    if (this.currentPage === 'theatre') this.renderPage('theatre');
  });
  this.engine.on('theatreBetweenRooms', () => {
    if (this.currentPage === 'theatre') { this.renderPage('theatre'); }
  });
  this.engine.on('theatreMechanic', () => {
    if (this.currentPage === 'theatre') this.renderPage('theatre');
  });
  this.engine.on('theatrePhase', () => {
    if (this.currentPage === 'theatre') this.renderPage('theatre');
  });
  this.engine.on('combatHit', (d) => {
    if (this.currentPage !== 'theatre') return;
    const area = d.who === 'monster' ? document.getElementById('toa-player-splats') : document.getElementById('toa-monster-splats');
    if (!area) return;
    const splat = document.createElement('div');
    splat.className = `hit-splat ${d.mechanic?'splat-big':d.crit?'splat-crit':d.miss?'splat-miss':'splat-hit'}`;
    splat.textContent = d.miss ? 'Miss' : d.dmg;
    splat.style.left = (20 + Math.random() * 60) + '%';
    area.appendChild(splat);
    setTimeout(() => splat.remove(), 900);
  });
};

console.log('[Ashfall] Theatre of Ash UI loaded.');

// ================================================================
// ASHFALL IDLE — Chambers of the Ashen King UI
// ================================================================

UI.prototype.renderChambersOfAshPage = function(el) {
  const s = this.engine.state;
  const ch = s.chambers;
  const coa = GAME_DATA.chambersOfAsh;
  const cl = this.engine.getCombatLevel();
  const locked = cl < coa.levelReq;

  let html = this.header('Chambers of the Ashen King', 'combat', 'Five chambers. Ancient horrors. The King waits below.', null);

  if (locked) {
    html += `<div class="toa-locked">
      <div class="toa-lock-icon">⛏</div>
      <div class="toa-lock-title">Chambers of the Ashen King</div>
      <div class="toa-lock-desc">Requires combat level ${coa.levelReq}. You are level ${cl}.</div>
      <div class="toa-lock-tip">Conquer dungeons and the Fight Cave to prepare yourself.</div>
    </div>`;
    el.innerHTML = html + '</div>';
    return;
  }

  if (!ch?.active && !ch?.chestOpen) {
    html += this._renderCoaEntry();
    el.innerHTML = html;
    return;
  }

  if (ch.room >= coa.rooms.length || ch.chestOpen) {
    html += this._renderCoaChest(ch);
    el.innerHTML = html;
    return;
  }

  html += this._renderCoaRaid(ch, s);
  el.innerHTML = html;
  this._attachCoaListeners();
};

UI.prototype._renderCoaEntry = function() {
  const coa = GAME_DATA.chambersOfAsh;
  const s = this.engine.state;
  const completions = s.stats?.chambersCompletions || 0;
  const bestTier = s.stats?.chambersBestTier || '—';

  let roomList = '';
  coa.rooms.forEach((r, i) => {
    const boss = COA_BOSSES[r.bossId];
    roomList += `<div class="toa-room-preview">
      <span class="toa-room-num">${i+1}</span>
      <span class="toa-room-name">${r.name}</span>
      <span class="toa-boss-name">${boss.name}</span>
      <span class="toa-boss-info">Lv${boss.combatLevel} · ${boss.hp.toLocaleString()}HP · ${boss.style}</span>
      <span class="toa-boss-mechanic">${boss.mechanic.name}: ${boss.mechanic.handleDesc}</span>
    </div>`;
  });

  const tierBadge = bestTier !== '—' ? `<span class="toa-tier-badge toa-tier-${bestTier}">${bestTier.toUpperCase()}</span>` : '';

  return `<div class="toa-entry-screen">
    <div class="toa-header-art">${this._getCoaSvg()}</div>
    <div class="toa-entry-stats">
      <div class="toa-stat"><span class="toa-stat-n">${completions}</span><span class="toa-stat-l">Completions</span></div>
      <div class="toa-stat"><span class="toa-stat-n">${tierBadge || '—'}</span><span class="toa-stat-l">Best Tier</span></div>
      <div class="toa-stat"><span class="toa-stat-n">5</span><span class="toa-stat-l">Chambers</span></div>
      <div class="toa-stat"><span class="toa-stat-n">Lv90+</span><span class="toa-stat-l">Requirement</span></div>
    </div>

    <div class="toa-tier-table">
      <div class="toa-tier-row"><span class="toa-tier-badge toa-tier-purple">PURPLE</span><span>0 deaths · under 12 min → Unique item chance</span></div>
      <div class="toa-tier-row"><span class="toa-tier-badge toa-tier-gold">GOLD</span><span>0 deaths · under 25 min → Legendary loot guaranteed</span></div>
      <div class="toa-tier-row"><span class="toa-tier-badge toa-tier-silver">SILVER</span><span>0–1 deaths → Better loot + prayer scrolls</span></div>
      <div class="toa-tier-row"><span class="toa-tier-badge toa-tier-bronze">BRONZE</span><span>Cleared — base loot, runes, bars</span></div>
    </div>

    <div class="toa-rooms-list">${roomList}</div>

    <div class="toa-unique-preview">
      <div class="toa-unique-title">Chambers Exclusive Items</div>
      <div class="toa-unique-grid">
        ${['twisted_bow','elder_maul','kodai_wand','dragon_claws','dinhs_bulwark','ancestral_hat','ancestral_robe_top','ancestral_robe_bottom','dexterous_scroll','arcane_scroll','olmlet'].map(id => {
          const item = GAME_DATA.items[id];
          if (!item) return '';
          return `<div class="toa-unique-item" title="${item.desc||''}">
            <div class="toa-ui-icon">${window.renderItemSprite ? window.renderItemSprite(id,32) : '?'}</div>
            <div class="toa-ui-name">${item.name}</div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <div class="coa-supply-info">
      <div class="toa-unique-title">Supply System</div>
      <p style="color:#aaa;font-size:0.85rem;margin:0.5rem 0;">You start with 5 Raid Brews. Clearing rooms grants +2 more. Brews heal HP and restore Prayer mid-fight.</p>
    </div>

    <div class="toa-entry-warning">
      ⚠ Bring food, potions, and your best gear. 5 deaths = forced ejection.
    </div>

    <button class="btn btn-lg toa-enter-btn" onclick="game.startChambersOfAsh()">Enter the Chambers</button>
  </div>`;
};

UI.prototype._renderCoaRaid = function(ch, s) {
  const coa = GAME_DATA.chambersOfAsh;
  const c = s.combat;
  const roomDef = coa.rooms[ch.room];
  const boss = COA_BOSSES[roomDef.bossId];
  const bossHp = c.monsterHp;
  const bossMaxHp = boss.hp;
  const bossHpPct = Math.max(0, (bossHp / bossMaxHp) * 100);
  const playerHpPct = Math.max(0, (c.playerHp / this.engine.getMaxHp()) * 100);
  const elapsed = ch.performance.elapsedSecs;
  const elapsedStr = `${Math.floor(elapsed/60)}:${String(Math.floor(elapsed%60)).padStart(2,'0')}`;

  let phaseLabel = '';
  if (boss.phases >= 2) {
    phaseLabel = `Phase ${ch.phase + 1}/${boss.phases}`;
  }

  // Between rooms overlay
  if (ch.between) {
    const nextBoss = COA_BOSSES[coa.rooms[ch.room]?.bossId];
    return `<div class="toa-raid-screen">
      <div class="toa-between-overlay">
        <div class="toa-between-title">Preparing for Chamber ${ch.room + 1}</div>
        <div class="toa-between-boss">${nextBoss?.name || 'Unknown'}</div>
        <div class="toa-between-timer">${Math.ceil(ch.betweenTimer)}s</div>
        <div class="toa-between-hint">${nextBoss?.styleHints || ''}</div>
        <div class="coa-supply-display">
          <span class="coa-brew-count">Brews: ${ch.supplies.brews}</span>
          <span class="coa-brew-count">Enhanced: ${ch.supplies.enhancedBrews}</span>
        </div>
      </div>
    </div>`;
  }

  // Active room fight
  const monsterArt = GAME_DATA.monsterArt[roomDef.bossId] || '';
  const mechanicHtml = ch.mechanic && !ch.mechanic.handled
    ? `<div class="toa-mechanic-alert coa-mechanic-alert">
        <div class="toa-mech-name">${ch.mechanic.name}</div>
        <div class="toa-mech-desc">${ch.mechanic.handleDesc}</div>
        <div class="toa-mech-timer" style="width:${Math.max(0,(ch.mechanicTimer / (boss.mechanic?.windowSecs||8))*100)}%"></div>
        <button class="btn btn-sm toa-mech-btn coa-handle-btn" id="coaMechBtn">HANDLE IT</button>
      </div>`
    : '';

  const roomProgress = coa.rooms.map((r, i) => {
    const cleared = ch.roomsCleared.includes(r.id);
    const current = i === ch.room;
    return `<div class="toa-room-pip ${cleared?'cleared':''} ${current?'current':''}">${i+1}</div>`;
  }).join('');

  return `<div class="toa-raid-screen">
    <div class="toa-raid-header">
      <div class="toa-room-pips">${roomProgress}</div>
      <div class="toa-raid-timer">${elapsedStr}</div>
      <div class="toa-death-count">Deaths: ${ch.performance.deaths}/5</div>
    </div>

    <div class="toa-boss-display">
      <div class="toa-boss-art">${monsterArt}</div>
      <div class="toa-boss-info-raid">
        <div class="toa-boss-name-raid">${boss.name} ${phaseLabel ? `<span class="toa-phase-badge">${phaseLabel}</span>` : ''}</div>
        <div class="toa-boss-hp-bar"><div class="toa-boss-hp-fill" style="width:${bossHpPct}%"></div></div>
        <div class="toa-boss-hp-text">${Math.max(0,bossHp).toLocaleString()} / ${bossMaxHp.toLocaleString()}</div>
      </div>
    </div>

    ${mechanicHtml}

    <div class="toa-player-status">
      <div class="toa-player-hp">
        <span>HP</span>
        <div class="toa-player-hp-bar"><div class="toa-player-hp-fill" style="width:${playerHpPct}%"></div></div>
        <span>${c.playerHp}/${this.engine.getMaxHp()}</span>
      </div>
      <div class="coa-supply-btns">
        <button class="btn btn-xs coa-brew-btn" onclick="game.useChamberBrew('normal')">Brew (${ch.supplies.brews})</button>
        <button class="btn btn-xs coa-brew-btn" onclick="game.useChamberBrew('enhanced')">Enhanced (${ch.supplies.enhancedBrews})</button>
      </div>
    </div>

    <div class="toa-style-hint">${boss.styleHints}</div>

    <div class="toa-raid-actions">
      <button class="btn btn-sm btn-danger" onclick="game.leaveChambers()">Flee Chambers</button>
    </div>
  </div>`;
};

UI.prototype._renderCoaChest = function(ch) {
  const tierColors = {bronze:'#cd7f32',silver:'#c0c0c0',gold:'#ffd700',purple:'#9b30d0'};
  const tierColor = tierColors[ch.tier] || '#888';
  const elapsed = ch.performance.elapsedSecs;
  const elapsedStr = `${Math.floor(elapsed/60)}:${String(Math.floor(elapsed%60)).padStart(2,'0')}`;

  let lootHtml = '';
  if (ch.chestOpen && ch.loot.length) {
    lootHtml = '<div class="toa-loot-grid">';
    for (const l of ch.loot) {
      const item = GAME_DATA.items[l.item];
      lootHtml += `<div class="toa-loot-item toa-rarity-${l.rarity}">
        <div class="toa-loot-icon">${window.renderItemSprite ? window.renderItemSprite(l.item,28) : '?'}</div>
        <div class="toa-loot-name">${item?.name||l.item}</div>
        <div class="toa-loot-qty">x${l.qty}</div>
      </div>`;
    }
    lootHtml += '</div>';
  }

  return `<div class="toa-chest-screen">
    <div class="toa-chest-title" style="color:${tierColor}">${ch.tier?.toUpperCase()} CHEST</div>
    <div class="toa-chest-art">${this._getCoaChestSvg(ch.tier)}</div>
    <div class="toa-chest-stats">
      <span>Time: ${elapsedStr}</span>
      <span>Deaths: ${ch.performance.deaths}</span>
      <span>Mechanics: ${ch.performance.mechanicsHandled}/${ch.performance.mechanicsHandled + ch.performance.mechanicsMissed}</span>
    </div>
    ${!ch.chestOpen
      ? `<button class="btn btn-lg toa-open-chest-btn" style="border-color:${tierColor}" onclick="game.openChambersChest()">Open Chest</button>`
      : lootHtml}
    ${ch.uniqueItem ? `<div class="toa-unique-drop">UNIQUE: ${GAME_DATA.items[ch.uniqueItem]?.name}</div>` : ''}
    ${ch.chestOpen ? `<button class="btn btn-sm" onclick="game.leaveChambers()">Leave Chambers</button>` : ''}
  </div>`;
};

UI.prototype._attachCoaListeners = function() {
  const btn = document.getElementById('coaMechBtn');
  if (btn) btn.addEventListener('click', () => { this.engine.handleChambersMechanic(); });
};

UI.prototype._getCoaSvg = function() {
  return `<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
    <!-- Chamber entrance arch -->
    <path d="M20 75 L20 25 Q100 -5 180 25 L180 75" fill="none" stroke="#c9873e" stroke-width="3"/>
    <path d="M30 75 L30 30 Q100 5 170 30 L170 75" fill="#0a0b0f" stroke="#5a4020" stroke-width="1.5"/>
    <!-- Rune carvings on arch -->
    <circle cx="50" cy="35" r="5" fill="none" stroke="#c9873e" stroke-width="1" opacity="0.5"/>
    <circle cx="100" cy="15" r="6" fill="none" stroke="#c9873e" stroke-width="1.5" opacity="0.6"/>
    <circle cx="150" cy="35" r="5" fill="none" stroke="#c9873e" stroke-width="1" opacity="0.5"/>
    <!-- Steps leading down -->
    <rect x="60" y="55" width="80" height="5" fill="#1a1410" stroke="#3a2a10" stroke-width="0.5"/>
    <rect x="55" y="60" width="90" height="5" fill="#141008" stroke="#3a2a10" stroke-width="0.5"/>
    <rect x="50" y="65" width="100" height="5" fill="#0e0a06" stroke="#3a2a10" stroke-width="0.5"/>
    <rect x="45" y="70" width="110" height="5" fill="#080604" stroke="#3a2a10" stroke-width="0.5"/>
    <!-- Glow from below -->
    <ellipse cx="100" cy="72" rx="30" ry="8" fill="#c9873e" opacity="0.15"/>
    <!-- Olm eye glint deep inside -->
    <circle cx="95" cy="50" r="3" fill="#c9873e" opacity="0.6"/>
    <circle cx="105" cy="50" r="3" fill="#c9873e" opacity="0.6"/>
  </svg>`;
};

UI.prototype._getCoaChestSvg = function(tier) {
  const colors = {bronze:'#cd7f32',silver:'#c0c0c0',gold:'#ffd700',purple:'#9b30d0'};
  const c = colors[tier] || '#888';
  return `<svg viewBox="0 0 100 70" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="25" width="80" height="40" rx="4" fill="#1a1410" stroke="${c}" stroke-width="2.5"/>
    <path d="M10 25 Q50 10 90 25" fill="#241c10" stroke="${c}" stroke-width="2"/>
    <rect x="42" y="35" width="16" height="12" rx="3" fill="#0a0804" stroke="${c}" stroke-width="1.5"/>
    <circle cx="50" cy="41" r="3" fill="${c}" opacity="0.8"/>
    <path d="M25 30 Q30 28 35 30" stroke="${c}" stroke-width="0.8" fill="none" opacity="0.4"/>
    <path d="M65 30 Q70 28 75 30" stroke="${c}" stroke-width="0.8" fill="none" opacity="0.4"/>
  </svg>`;
};

if(window._ASHFALL_DEBUG) console.log('[Ashfall] Chambers of the Ashen King UI loaded.');
