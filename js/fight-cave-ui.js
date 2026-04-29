// ============================================================
// ASHFALL IDLE — FIGHT CAVE UI
// Renders the Fight Cave page, wave tracker, Jad boss panel
// ============================================================

function applyFightCaveUI() {
  if (typeof UI === 'undefined') {
    setTimeout(applyFightCaveUI, 100);
    return;
  }

  // ── RENDER FIGHT CAVE PAGE ────────────────────────────────
  UI.prototype.renderFightCavePage = function(el) {
    const s = this.engine.state;
    const fc = s.fightCave;

    if (fc && fc.active) {
      this._renderFightCaveActive(el, fc, s);
      return;
    }

    // ── ENTRY SCREEN ──────────────────────────────────────
    const combatLv = this.engine.getCombatLevel();
    const prayerLv = s.skills.prayer?.level || 1;
    const meetsReqs = combatLv >= GAME_DATA.fightCave.levelReq && prayerLv >= GAME_DATA.fightCave.prayerReq;
    const fireCape = GAME_DATA.items.fire_cape;

    let html = `<div class="fight-cave-page">`;
    html += `<div class="fc-header">
      <h1 class="fc-title">${ICONS.combat || ''} The Fight Cave</h1>
      <p class="fc-subtitle">${GAME_DATA.fightCave.desc}</p>
    </div>`;

    // Requirements
    html += `<div class="fc-requirements">
      <h2 class="section-title">Requirements</h2>
      <div class="fc-req-row">
        <span class="${combatLv >= GAME_DATA.fightCave.levelReq ? 'fc-req-met' : 'fc-req-unmet'}">
          Combat Level ${GAME_DATA.fightCave.levelReq} ${combatLv >= GAME_DATA.fightCave.levelReq ? '✓' : '✗'} (You: ${combatLv})
        </span>
      </div>
      <div class="fc-req-row">
        <span class="${prayerLv >= GAME_DATA.fightCave.prayerReq ? 'fc-req-met' : 'fc-req-unmet'}">
          Prayer Level ${GAME_DATA.fightCave.prayerReq} ${prayerLv >= GAME_DATA.fightCave.prayerReq ? '✓' : '✗'} (You: ${prayerLv})
        </span>
      </div>
      <div class="fc-req-row">
        <span class="${(s.foodBag && s.foodBag.length > 0) ? 'fc-req-met' : 'fc-req-unmet'}">
          Food Equipped ${(s.foodBag && s.foodBag.length > 0) ? '✓' : '✗'}
        </span>
      </div>
    </div>`;

    // Fire Cape reward
    html += `<div class="fc-reward-card">
      <h2 class="section-title">Reward: Fire Cape</h2>
      <div class="fc-reward-stats">
        Atk: +${fireCape?.stats?.attackBonus || 8} | Str: +${fireCape?.stats?.strengthBonus || 8} | Def: +${fireCape?.stats?.defenceBonus || 14} | DR: +${fireCape?.stats?.damageReduction || 5}%
      </div>
      <p class="fc-reward-desc">Best-in-slot melee cape. Untradeable. Earned, never given.</p>
    </div>`;

    // Wave phases overview
    html += `<div class="fc-phases">
      <h2 class="section-title">63 Waves — Phase Breakdown</h2>`;
    for (const phase of GAME_DATA.fightCave.phases) {
      html += `<div class="fc-phase-row">
        <span class="fc-phase-waves">W${phase.startWave}-${phase.endWave}</span>
        <span class="fc-phase-name">${phase.name}</span>
        <span class="fc-phase-tip">${phase.tip}</span>
      </div>`;
    }
    html += `</div>`;

    // Monster bestiary
    html += `<div class="fc-bestiary">
      <h2 class="section-title">Monsters</h2>
      <div class="fc-monster-grid">`;
    const fcMonsters = ['cinder_bat','magma_blob','obsidian_ranger','molten_brute','volcanic_mage','tztok_jad','yt_hurkot'];
    for (const mId of fcMonsters) {
      const m = GAME_DATA.monsters[mId];
      if (!m) continue;
      const styleColors = { melee:'#e74c3c', ranged:'#27ae60', magic:'#3498db' };
      html += `<div class="fc-monster-card">
        <div class="fc-mon-art">${GAME_DATA.monsterArt[mId] || ''}</div>
        <div class="fc-mon-header">
          <span class="fc-mon-name">${m.name}</span>
          <span class="fc-mon-level" style="color:${styleColors[m.style]||'#aaa'}">Lv ${m.combatLevel} (${m.style})</span>
        </div>
        <div class="fc-mon-stats">HP: ${m.hp} | Max Hit: ${m.maxHit}</div>
        <p class="fc-mon-desc">${m.desc}</p>
      </div>`;
    }
    html += `</div></div>`;

    // Stats
    html += `<div class="fc-stats">
      <h2 class="section-title">Your Fight Cave Stats</h2>
      <div class="fc-stat-row">Attempts: ${s.stats.fightCaveAttempts || 0}</div>
      <div class="fc-stat-row">Completions: ${s.stats.fightCaveCompletions || 0}</div>
      <div class="fc-stat-row">Deaths: ${s.stats.fightCaveDeaths || 0}</div>
      <div class="fc-stat-row">Best Wave: ${s.stats.fightCaveBestWave || 0}/63</div>
      <div class="fc-stat-row">Jad Kills: ${s.stats.jadKills || 0}</div>
      <div class="fc-stat-row">Jad Deaths: ${s.stats.jadDeaths || 0}</div>
    </div>`;

    // Warning + Enter button
    html += `<div class="fc-warning">
      <p>Death resets all progress. Supplies consumed during the run are lost forever.</p>
      <p>This is a safe death — no XP or equipment loss.</p>
      <p>Equip your best gear, fill your food bag, and stock prayer potions before entering.</p>
    </div>`;

    html += `<div class="fc-enter">
      <button class="btn btn-lg ${meetsReqs ? 'btn-danger' : ''}" ${meetsReqs ? '' : 'disabled'}
        data-fc-action="start">
        ${meetsReqs ? 'Enter the Fight Cave' : 'Requirements Not Met'}
      </button>
    </div>`;

    html += `</div>`;
    el.innerHTML = html;
  };


  // ── RENDER ACTIVE FIGHT CAVE ──────────────────────────────
  UI.prototype._renderFightCaveActive = function(el, fc, s) {
    const c = s.combat;
    const monster = GAME_DATA.monsters[c.monster];
    const waveNum = fc.currentWave + 1;
    const isJad = monster && monster.isJad;
    const maxHp = this.engine.getMaxHp();

    let html = `<div class="fight-cave-active">`;

    // ── WAVE PROGRESS BAR ─────────────────────────────────
    const progress = ((fc.currentWave) / 63) * 100;
    html += `<div class="fc-wave-bar">
      <div class="fc-wave-label">Wave ${waveNum} / 63</div>
      <div class="fc-progress-track"><div class="fc-progress-fill" style="width:${progress}%"></div></div>
    </div>`;

    // ── PHASE INDICATOR ───────────────────────────────────
    const phase = GAME_DATA.fightCave.phases.find(p => waveNum >= p.startWave && waveNum <= p.endWave);
    if (phase) {
      html += `<div class="fc-phase-indicator">
        <span class="fc-phase-badge">${phase.name}</span>
        <span class="fc-phase-advice">${phase.tip}</span>
      </div>`;
    }

    // ── BETWEEN WAVES ─────────────────────────────────────
    if (fc.betweenWaves) {
      html += `<div class="fc-between-waves">
        <h2>Wave ${fc.currentWave} Cleared</h2>
        <p id="fc-between-timer">Next wave in ${Math.ceil(fc.betweenWaveTimer)}s...</p>
        <p class="fc-between-tip">Eat food and drink potions now!</p>
        <div class="fc-manual-actions">
          <button class="btn btn-sm" data-fc-action="eat">Eat Food</button>
          <button class="btn btn-sm" data-fc-action="potion" data-fc-param="0">Potion 1</button>
          <button class="btn btn-sm" data-fc-action="potion" data-fc-param="1">Potion 2</button>
          <button class="btn btn-sm" data-fc-action="potion" data-fc-param="2">Potion 3</button>
          <button class="btn btn-sm" data-fc-action="potion" data-fc-param="3">Potion 4</button>
        </div>
      </div>`;
      html += `</div>`;
      el.innerHTML = html;
      return;
    }

    // ── PLAYER STATUS ─────────────────────────────────────
    const hpPct = Math.max(0, (c.playerHp / maxHp) * 100);
    const ppMax = 99;
    const ppPct = Math.max(0, (s.prayerPoints / ppMax) * 100);
    html += `<div class="fc-player-status">
      <div class="fc-stat-bar">
        <span class="fc-bar-label" id="fc-hp-label">HP: ${c.playerHp}/${maxHp}</span>
        <div class="fc-bar-track fc-hp-track"><div class="fc-bar-fill fc-hp-fill" id="fc-hp-fill" style="width:${hpPct}%"></div></div>
      </div>
      <div class="fc-stat-bar">
        <span class="fc-bar-label" id="fc-pp-label">Prayer: ${s.prayerPoints}/${ppMax}</span>
        <div class="fc-bar-track fc-pp-track"><div class="fc-bar-fill fc-pp-fill" id="fc-pp-fill" style="width:${ppPct}%"></div></div>
      </div>
      <div class="fc-active-prayers">
        ${s.activePrayers.map(id => {
          const p = GAME_DATA.prayers.find(x => x.id === id);
          return p ? `<span class="fc-prayer-active">${p.name}</span>` : '';
        }).join('')}
        ${s.activePrayers.length === 0 ? '<span class="fc-no-prayer">No prayers active</span>' : ''}
      </div>
    </div>`;

    // ── FOOD / POTION QUICK BAR ───────────────────────────
    html += `<div class="fc-supply-bar">
      <div class="fc-supply-section">
        <span class="fc-supply-label">Food:</span>
        ${(s.foodBag || []).map(f => {
          const item = GAME_DATA.items[f.id];
          return `<span class="fc-supply-item" title="${item?.name}">${item?.name || f.id} x${f.qty}</span>`;
        }).join('')}
        <button class="btn btn-xs" data-fc-action="eat">Eat</button>
      </div>
      <div class="fc-supply-section">
        <span class="fc-supply-label">Potions:</span>
        ${(s.potionBelt || []).map((p, i) => {
          if (!p.id) return `<span class="fc-supply-empty">Empty</span>`;
          const item = GAME_DATA.items[p.id];
          return `<span class="fc-supply-item fc-potion-btn" data-fc-action="potion" data-fc-param="${i}" title="Click to drink">${item?.name || p.id} x${p.qty}</span>`;
        }).join('')}
      </div>
    </div>`;

    // ── MONSTER DISPLAY ───────────────────────────────────
    if (monster) {
      const mHpPct = Math.max(0, (c.monsterHp / monster.hp) * 100);
      const styleColors = { melee:'#e74c3c', ranged:'#27ae60', magic:'#3498db' };

      html += `<div class="fc-monster-display ${isJad ? 'fc-jad-display' : ''}">
        ${GAME_DATA.monsterArt?.[c.monster] ? `<div class="fc-combat-art">${GAME_DATA.monsterArt[c.monster]}</div>` : ''}
        <div class="fc-mon-current-header">
          <span class="fc-mon-current-name">${monster.name}</span>
          <span class="fc-mon-current-style" style="color:${styleColors[monster.style]}">${monster.style.toUpperCase()}</span>
          <span class="fc-mon-current-level">Lv ${monster.combatLevel}</span>
        </div>
        <div class="fc-mon-hp-bar">
          <span class="fc-bar-label" id="fc-mhp-label">${c.monsterHp}/${monster.hp}</span>
          <div class="fc-bar-track fc-monster-track"><div class="fc-bar-fill fc-monster-fill" id="fc-mhp-fill" style="width:${mHpPct}%"></div></div>
        </div>
      </div>`;
    }

    // ── WAVE QUEUE ────────────────────────────────────────
    if (!isJad) {
      const remaining = fc.monsterQueue.slice(fc.currentMonsterIdx);
      html += `<div class="fc-wave-queue">
        <span class="fc-queue-label">Wave Monsters:</span>
        <div class="fc-queue-list">`;
      for (let i = 0; i < remaining.length; i++) {
        const mId = remaining[i];
        const m = GAME_DATA.monsters[mId];
        const isCurrent = i === 0;
        const styleColors = { melee:'#e74c3c', ranged:'#27ae60', magic:'#3498db' };
        html += `<span class="fc-queue-monster ${isCurrent ? 'fc-queue-current' : ''}" style="border-color:${styleColors[m?.style]||'#666'}">
          ${m?.name || mId}${isCurrent ? ' (fighting)' : ''}
        </span>`;
      }
      html += `</div></div>`;

      // Kill priority selector — prayer management hint
      const hasRanger = remaining.some(id => id === 'obsidian_ranger');
      const hasMage = remaining.some(id => id === 'volcanic_mage');
      if (hasRanger || hasMage) {
        html += `<div class="fc-prayer-hint">`;
        if (hasMage) {
          html += `<div class="fc-hint-danger">Volcanic Mage active — Protect from Magic!</div>`;
        } else if (hasRanger) {
          html += `<div class="fc-hint-warn">Obsidian Ranger active — Protect from Ranged!</div>`;
        }
        html += `</div>`;
      }

      // Prayer toggle buttons for non-Jad waves
      html += `<div class="fc-prayer-toggles">
        <span class="fc-prayer-label">Protection Prayers:</span>
        <button class="btn btn-sm ${s.activePrayers.includes('protect_melee') ? 'btn-active-prayer' : ''}"
          data-fc-action="pray-melee">Protect Melee</button>
        <button class="btn btn-sm ${s.activePrayers.includes('protect_ranged') ? 'btn-active-prayer' : ''}"
          data-fc-action="pray-ranged">Protect Ranged</button>
        <button class="btn btn-sm ${s.activePrayers.includes('protect_magic') ? 'btn-active-prayer' : ''}"
          data-fc-action="pray-magic">Protect Magic</button>
      </div>`;
    }

    // ── JAD BOSS PANEL ────────────────────────────────────
    if (isJad) {
      html += this._renderJadPanel(fc, s);
    }

    // ── FLEE BUTTON ───────────────────────────────────────
    html += `<div class="fc-flee">
      <button class="btn btn-sm btn-danger" data-fc-action="flee">
        Flee (Lose All Progress)
      </button>
    </div>`;

    html += `</div>`;
    el.innerHTML = html;
  };


  // ── JAD BOSS PANEL ──────────────────────────────────────
  UI.prototype._renderJadPanel = function(fc, s) {
    let html = `<div class="fc-jad-panel">`;

    // ── ATTACK TELEGRAPH ──────────────────────────────────
    html += `<div class="fc-jad-telegraph">`;

    if (fc.jadPhase === 'charging') {
      const chargePct = (fc.jadChargeTimer / 2.0) * 100;
      html += `<div class="fc-jad-charging">
        <div class="fc-jad-charge-label">Jad is preparing an attack...</div>
        <div class="fc-bar-track fc-jad-charge-track">
          <div class="fc-bar-fill fc-jad-charge-fill" id="fc-jad-charge-fill" style="width:${chargePct}%"></div>
        </div>
      </div>`;
    }

    else if (fc.jadPhase === 'telegraph' || fc.jadPhase === 'awaiting_input') {
      const style = fc.jadAttackStyle;
      const telegraphIcons = {
        melee:  { symbol: '&#9994;', label: 'MELEE', desc: 'Jad lunges forward!', color: '#e74c3c', bg: 'rgba(231,76,60,0.15)' },
        ranged: { symbol: '&#11015;', label: 'RANGED', desc: 'Jad slams his feet to the ground!', color: '#e67e22', bg: 'rgba(230,126,34,0.15)' },
        magic:  { symbol: '&#128293;', label: 'MAGIC', desc: 'Jad rears up — fireball incoming!', color: '#3498db', bg: 'rgba(52,152,219,0.15)' },
      };
      const t = telegraphIcons[style] || telegraphIcons.magic;

      html += `<div class="fc-jad-telegraph-alert" style="background:${t.bg};border-color:${t.color}">
        <div class="fc-jad-telegraph-icon" style="color:${t.color}">${t.symbol}</div>
        <div class="fc-jad-telegraph-style" style="color:${t.color}">${t.label} ATTACK</div>
        <div class="fc-jad-telegraph-desc">${t.desc}</div>
      </div>`;

      if (fc.jadPhase === 'awaiting_input') {
        const timeLeft = Math.max(0, 2.5 - fc.jadInputTimer);
        const timePct = (timeLeft / 2.5) * 100;

        html += `<div class="fc-jad-input-window">
          <div class="fc-jad-timer-label" id="fc-jad-timer-label">PRAY NOW! ${timeLeft.toFixed(1)}s</div>
          <div class="fc-bar-track fc-jad-timer-track">
            <div class="fc-bar-fill fc-jad-timer-fill" id="fc-jad-timer-fill" style="width:${timePct}%"></div>
          </div>
        </div>`;

        // Big prayer flick buttons — data attributes for event delegation
        html += `<div class="fc-jad-prayer-buttons">
          <button class="fc-jad-pray-btn fc-pray-melee" data-fc-action="jad-flick" data-fc-param="melee">
            <span class="fc-pray-icon">&#9994;</span>
            <span class="fc-pray-text">Protect Melee</span>
          </button>
          <button class="fc-jad-pray-btn fc-pray-ranged" data-fc-action="jad-flick" data-fc-param="ranged">
            <span class="fc-pray-icon">&#11015;</span>
            <span class="fc-pray-text">Protect Ranged</span>
          </button>
          <button class="fc-jad-pray-btn fc-pray-magic" data-fc-action="jad-flick" data-fc-param="magic">
            <span class="fc-pray-icon">&#128293;</span>
            <span class="fc-pray-text">Protect Magic</span>
          </button>
        </div>`;
      }
    }

    else if (fc.jadPhase === 'resolving') {
      html += `<div class="fc-jad-resolving">
        <div class="fc-jad-resolve-text">Attack resolved. Next attack charging...</div>
      </div>`;
    }

    html += `</div>`; // end telegraph

    // ── JAD HEALERS ───────────────────────────────────────
    if (fc.jadHealers && fc.jadHealers.length > 0) {
      html += `<div class="fc-jad-healers">
        <h3 class="fc-healer-title">Yt-HurKot Healers — Tag them to stop healing!</h3>
        <div class="fc-healer-grid">`;
      for (let i = 0; i < fc.jadHealers.length; i++) {
        const h = fc.jadHealers[i];
        const hpPct = (h.hp / h.maxHp) * 100;
        html += `<div class="fc-healer-card ${h.tagged ? 'fc-healer-tagged' : 'fc-healer-healing'}">
          <div class="fc-healer-label">Healer ${i + 1}</div>
          <div class="fc-healer-status">${h.tagged ? 'TAGGED (attacking you)' : 'HEALING JAD'}</div>
          <div class="fc-bar-track fc-healer-hp-track">
            <div class="fc-bar-fill fc-healer-hp-fill" style="width:${hpPct}%"></div>
          </div>
          <div class="fc-healer-hp">${h.hp}/${h.maxHp}</div>
          ${!h.tagged && h.hp > 0 ? `<button class="btn btn-xs btn-danger" data-fc-action="tag-healer" data-fc-param="${i}">TAG</button>` : ''}
        </div>`;
      }
      html += `</div></div>`;
    }

    html += `</div>`; // end jad panel
    return html;
  };


  // ── HOOK INTO RENDER CYCLE ──────────────────────────────
  // Directly attach event listeners to the existing game/ui instances
  // since these scripts load after ui.js has already instantiated everything

  function attachFightCaveListeners() {
    if (typeof game === 'undefined' || typeof ui === 'undefined') {
      setTimeout(attachFightCaveListeners, 100);
      return;
    }

    let _fcLastPhase = null;
    let _fcLastWave = -1;
    let _fcLastBetween = false;

    // Use event delegation on document for fight cave buttons
    // This way buttons work even when DOM is rebuilt
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
        case 'pray-melee': game.activatePrayer('protect_melee'); break;
        case 'pray-ranged': game.activatePrayer('protect_ranged'); break;
        case 'pray-magic': game.activatePrayer('protect_magic'); break;
        case 'jad-flick':
          game.jadPrayerFlick(param);
          break;
        case 'tag-healer': game.tagJadHealer(parseInt(param)); break;
      }
    });

    // Targeted DOM updates instead of full re-renders
    game.on('tick', () => {
      if (ui.currentPage !== 'fight_cave') return;
      const fc = game.state.fightCave;
      if (!fc || !fc.active) return;

      const phaseChanged = fc.jadPhase !== _fcLastPhase;
      const waveChanged = fc.currentWave !== _fcLastWave;
      const betweenChanged = fc.betweenWaves !== _fcLastBetween;

      _fcLastPhase = fc.jadPhase;
      _fcLastWave = fc.currentWave;
      _fcLastBetween = fc.betweenWaves;

      // Full re-render only when state changes significantly
      if (phaseChanged || waveChanged || betweenChanged) {
        ui.renderPage('fight_cave');
        return;
      }

      // Otherwise do targeted updates to bars/timers only
      const c = game.state.combat;
      const maxHp = game.getMaxHp();

      // Update player HP bar
      const hpFill = document.getElementById('fc-hp-fill');
      const hpLabel = document.getElementById('fc-hp-label');
      if (hpFill) hpFill.style.width = Math.max(0, (c.playerHp / maxHp) * 100) + '%';
      if (hpLabel) hpLabel.textContent = `HP: ${c.playerHp}/${maxHp}`;

      // Update prayer bar
      const ppFill = document.getElementById('fc-pp-fill');
      const ppLabel = document.getElementById('fc-pp-label');
      if (ppFill) ppFill.style.width = Math.max(0, (game.state.prayerPoints / 99) * 100) + '%';
      if (ppLabel) ppLabel.textContent = `Prayer: ${game.state.prayerPoints}/99`;

      // Update monster HP bar
      const monster = GAME_DATA.monsters[c.monster];
      if (monster) {
        const mhpFill = document.getElementById('fc-mhp-fill');
        const mhpLabel = document.getElementById('fc-mhp-label');
        if (mhpFill) mhpFill.style.width = Math.max(0, (c.monsterHp / monster.hp) * 100) + '%';
        if (mhpLabel) mhpLabel.textContent = `${c.monsterHp}/${monster.hp}`;
      }

      // Update Jad charge/timer bars (targeted, no re-render)
      if (fc.jadPhase === 'charging') {
        const chargeFill = document.getElementById('fc-jad-charge-fill');
        if (chargeFill) chargeFill.style.width = ((fc.jadChargeTimer / 2.0) * 100) + '%';
      }
      if (fc.jadPhase === 'awaiting_input') {
        const timerFill = document.getElementById('fc-jad-timer-fill');
        const timerLabel = document.getElementById('fc-jad-timer-label');
        const timeLeft = Math.max(0, 2.5 - fc.jadInputTimer);
        if (timerFill) timerFill.style.width = ((timeLeft / 2.5) * 100) + '%';
        if (timerLabel) timerLabel.textContent = `PRAY NOW! ${timeLeft.toFixed(1)}s`;
      }

      // Update between-wave timer
      if (fc.betweenWaves) {
        const bwTimer = document.getElementById('fc-between-timer');
        if (bwTimer) bwTimer.textContent = `Next wave in ${Math.ceil(fc.betweenWaveTimer)}s...`;
      }
    });

    // Navigate to fight cave page on start
    game.on('fightCaveStart', () => {
      _fcLastPhase = null;
      _fcLastWave = -1;
      _fcLastBetween = false;
      ui.currentPage = 'fight_cave';
      ui.renderSidebar();
      ui.renderPage('fight_cave');
    });

    // Refresh on fight cave end
    game.on('fightCaveEnd', () => {
      _fcLastPhase = null;
      _fcLastWave = -1;
      _fcLastBetween = false;
      ui.renderPage('fight_cave');
    });

    // Navigate to fight cave combat on combatStart if in fight cave
    game.on('combatStart', (data) => {
      if (data && data.fightCave) {
        ui.currentPage = 'fight_cave';
        ui.renderSidebar();
        ui.renderPage('fight_cave');
      }
    });

    console.log('[Ashfall] Fight Cave UI listeners attached.');
  }

  attachFightCaveListeners();

  console.log('[Ashfall] Fight Cave UI loaded.');
}

// Apply patches IMMEDIATELY at script parse time.
// UI class is defined by now (ui.js loaded before this).
applyFightCaveUI();
