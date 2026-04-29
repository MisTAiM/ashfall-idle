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
    const fireCape = GAME_DATA.items.fire_cape;

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
      <h2 class="section-title">Reward: Fire Cape</h2>
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
