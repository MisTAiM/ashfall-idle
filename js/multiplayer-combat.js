// ================================================================
// ASHFALL IDLE — Multiplayer Combat System
// Party combat panel, combat broadcasting, spectator mode
// ================================================================

// ── COMBAT PARTY PANEL ──────────────────────────────────────────
// Injected into the combat page when a party raid is active
(function() {
  const _origRenderCombat = UI.prototype.renderCombatPage;
  UI.prototype.renderCombatPage = function(el) {
    // Render normal combat page first
    _origRenderCombat.call(this, el);

    // If party raid is active, inject party panel
    const p = this.engine.state.party;
    if (!p?.raidActive || !p.raidStarted) return;

    const panel = document.createElement('div');
    panel.className = 'combat-party-panel';
    panel.innerHTML = this._buildPartyPanel();

    // Insert after the combat arena
    const arena = el.querySelector('.combat-arena, .combat-container, .combat-page');
    if (arena) { arena.after(panel); }
    else { el.appendChild(panel); }
  };

  UI.prototype._buildPartyPanel = function() {
    const p = this.engine.state.party;
    if (!p?.raidActive) return '';

    const totalSize = p.members.length + p.npcMembers.length;
    const bonus = this.engine.getPartyBonus();
    let html = `<div class="cpp-header">
      <span class="cpp-title">Party (${totalSize})</span>
      <span class="cpp-bonus">DMG +${Math.round((bonus.dmgMult-1)*100)}% · HP ×${bonus.hpMult.toFixed(2)}</span>
    </div>`;

    // Real players
    for (const m of p.members) {
      const isSelf = m.id === (typeof online !== 'undefined' ? online?.user?.uid : 'self');
      html += `<div class="cpp-member ${isSelf?'cpp-self':''}">
        <span class="cpp-name">${m.name}${isSelf?' (You)':''}</span>
        <span class="cpp-role">${m.role==='leader'?'Leader':'Member'}</span>
      </div>`;
    }

    // NPC companions with live HP bars
    for (const n of p.npcMembers) {
      const ms = p.memberStatus[n.id];
      if (!ms) continue;
      const hpPct = Math.max(0, ms.hp / ms.maxHp * 100);
      html += `<div class="cpp-member ${ms.alive?'':'cpp-dead'}">
        <div class="cpp-npc-row">
          <span class="cpp-name">${ms.name}</span>
          <span class="cpp-npc-info">${ms.style}${ms.heals?' · Healer':''} · ${ms.alive?ms.dps+' DPS':'Dead'}</span>
        </div>
        <div class="cpp-hp-bar"><div class="cpp-hp-fill" style="width:${hpPct}%"></div></div>
        <div class="cpp-npc-stats">
          <span>${ms.alive?`${ms.hp}/${ms.maxHp}`:''}</span>
          <span>${ms.totalDmg.toLocaleString()} dmg</span>
        </div>
      </div>`;
    }

    // Total party damage
    if (p.totalPartyDmg > 0) {
      html += `<div class="cpp-total">Party Damage: ${p.totalPartyDmg.toLocaleString()}</div>`;
    }

    return html;
  };
})();

// ── COMBAT BROADCAST (RTDB) ─────────────────────────────────────
// Write combat progress to RTDB so party members can spectate
GameEngine.prototype._broadcastCombatState = function() {
  const p = this.state.party;
  const c = this.state.combat;
  if (!p?.raidActive || !c?.active || typeof online === 'undefined' || !online?.db || !online?.user) return;

  const mon = GAME_DATA.monsters[c.monster];
  const data = {
    uid: online.user.uid,
    name: this.state.playerName || online.displayName || 'Player',
    monster: mon?.name || c.monster,
    monsterHp: c.monsterHp,
    monsterMaxHp: mon?.hp || 1,
    playerHp: c.playerHp,
    playerMaxHp: this.getMaxHp(),
    partyDmg: p.totalPartyDmg || 0,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    alive: c.playerHp > 0,
  };

  try {
    online.db.ref(`party_state/${p.id}/combat_${online.user.uid}`).set(data);
  } catch(e) { /* silent */ }
};

// Broadcast every ~3 seconds during party raids
(function() {
  let _broadcastCounter = 0;
  const _origEmitMP = GameEngine.prototype.emit;
  GameEngine.prototype.emit = function(event, data) {
    _origEmitMP.call(this, event, data);
    if (event === 'tick' && this.state.party?.raidActive && this.state.combat?.active) {
      _broadcastCounter++;
      if (_broadcastCounter >= 5) { // ~3 seconds at 0.6s tick
        _broadcastCounter = 0;
        this._broadcastCombatState();
      }
    }
  };
})();

// ── SPECTATOR MODE ──────────────────────────────────────────────
// Party members can see each other's combat progress on the party page
GameEngine.prototype.startSpectating = function() {
  const p = this.state.party;
  if (!p?.active || !p.id || typeof online === 'undefined' || !online?.db) return;

  this.stopSpectating();
  this._spectateRef = online.db.ref(`party_state/${p.id}`);
  this._spectateListener = this._spectateRef.on('value', snap => {
    const data = snap.val();
    if (!data) return;
    this.state._spectateData = data;
    this.emit('spectateUpdate', data);
  });
};

GameEngine.prototype.stopSpectating = function() {
  if (this._spectateRef && this._spectateListener) {
    this._spectateRef.off('value', this._spectateListener);
    this._spectateRef = null;
    this._spectateListener = null;
  }
  if (this.state._spectateData) delete this.state._spectateData;
};

// ── SPECTATOR UI (on party page during raids) ───────────────────
// Add spectator view to the party page when raid is active
(function() {
  const _origRenderParty = UI.prototype.renderPartyPage;
  UI.prototype.renderPartyPage = function(el) {
    _origRenderParty.call(this, el);

    const p = this.engine.state.party;
    if (!p?.raidActive || !p.raidStarted) return;

    // Start spectating if not already
    if (!this.engine._spectateRef) this.engine.startSpectating();

    // Add spectator panel
    const specData = this.engine.state._spectateData;
    if (!specData) return;

    let specHtml = '<div class="cpp-spectator"><div class="ce-section-title">Live Combat — Party Members</div>';
    for (const [key, cd] of Object.entries(specData)) {
      if (!cd || !cd.name || !cd.monster) continue;
      const bossHpPct = Math.max(0, (cd.monsterHp / cd.monsterMaxHp) * 100);
      const playerHpPct = Math.max(0, (cd.playerHp / cd.playerMaxHp) * 100);
      const age = cd.timestamp ? Math.floor((Date.now() - cd.timestamp) / 1000) : 999;
      const stale = age > 10;
      specHtml += `<div class="cpp-spec-member ${stale?'cpp-stale':''}">
        <div class="cpp-spec-name">${cd.name} ${cd.alive?'':'<span style="color:#cc4444">Dead</span>'} ${stale?'<span style="color:var(--text-dim)">(stale)</span>':''}</div>
        <div class="cpp-spec-info">vs ${cd.monster}</div>
        <div class="cpp-spec-bars">
          <div class="cpp-spec-bar"><span>Boss</span><div class="toa-boss-hp-bar" style="height:6px"><div class="toa-boss-hp-fill" style="width:${bossHpPct}%"></div></div><span style="font-size:10px">${Math.round(bossHpPct)}%</span></div>
          <div class="cpp-spec-bar"><span>HP</span><div class="toa-player-hp-bar" style="height:6px"><div class="toa-player-hp-fill" style="width:${playerHpPct}%"></div></div><span style="font-size:10px">${cd.playerHp}/${cd.playerMaxHp}</span></div>
        </div>
        ${cd.partyDmg > 0 ? `<div class="cpp-spec-dmg">NPC Damage: ${cd.partyDmg.toLocaleString()}</div>` : ''}
      </div>`;
    }
    specHtml += '</div>';

    // Insert after the active party section
    const activeSection = el.querySelector('.party-active-section');
    if (activeSection) {
      const specDiv = document.createElement('div');
      specDiv.innerHTML = specHtml;
      activeSection.appendChild(specDiv);
    }
  };
})();

// ── CLEANUP SPECTATING ON RAID END ──────────────────────────────
(function() {
  const _origLeaveParty = GameEngine.prototype.leaveParty;
  GameEngine.prototype.leaveParty = function() {
    this.stopSpectating();
    // Clean up party_state in RTDB
    const p = this.state.party;
    if (p?.id && typeof online !== 'undefined' && online?.db && online?.user) {
      try { online.db.ref(`party_state/${p.id}/combat_${online.user.uid}`).remove(); } catch(e) {}
    }
    _origLeaveParty.call(this);
  };
})();

// ── END PARTY RAID ON COMBAT STOP ───────────────────────────────
(function() {
  const _origStopCombat = GameEngine.prototype.stopCombat;
  GameEngine.prototype.stopCombat = function() {
    // If party raid was active, mark it as ended
    const p = this.state.party;
    if (p?.raidActive && p.raidStarted) {
      p.raidActive = false;
      p.raidStarted = false;
      if (p.totalPartyDmg > 0) {
        const msg = `Raid ended. NPC companions dealt ${p.totalPartyDmg.toLocaleString()} total damage.`;
        p.chat.push({sender:'System', text:msg, time:Date.now()});
        if (typeof online !== 'undefined' && online?.db && p.id) {
          online.sendPartyChat?.(p.id, msg);
        }
      }
      this.stopSpectating();
    }
    if (_origStopCombat) _origStopCombat.call(this);
  };
})();

// ── CSS FOR COMBAT PARTY PANEL ──────────────────────────────────
(function() {
  const style = document.createElement('style');
  style.textContent = `
    .combat-party-panel {
      background: rgba(0,0,0,0.4);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px;
      margin-top: 12px;
    }
    .cpp-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      padding-bottom: 6px;
      border-bottom: 1px solid rgba(201,135,62,0.2);
    }
    .cpp-title { font-family: 'Cinzel', serif; font-size: 13px; color: var(--amber); }
    .cpp-bonus { font-size: 11px; color: var(--text-dim); }
    .cpp-member {
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--border);
      border-radius: 5px;
      padding: 6px 8px;
      margin-bottom: 4px;
    }
    .cpp-self { border-color: rgba(201,135,62,0.3); }
    .cpp-dead { opacity: 0.5; border-color: rgba(204,68,68,0.3); }
    .cpp-name { font-size: 12px; color: var(--text); font-weight: 600; }
    .cpp-role { font-size: 10px; color: var(--text-dim); margin-left: 6px; }
    .cpp-npc-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
    .cpp-npc-info { font-size: 10px; color: var(--text-dim); }
    .cpp-hp-bar { height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; margin-bottom: 2px; }
    .cpp-hp-fill { height: 100%; background: linear-gradient(90deg, #4aaa50, #2a8a30); border-radius: 2px; transition: width 0.3s; }
    .cpp-npc-stats { display: flex; justify-content: space-between; font-size: 10px; color: var(--text-dim); }
    .cpp-total {
      text-align: center;
      font-size: 11px;
      color: var(--amber);
      margin-top: 6px;
      padding-top: 6px;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    .cpp-spectator { margin-top: 12px; }
    .cpp-spec-member {
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--border);
      border-radius: 5px;
      padding: 8px;
      margin-bottom: 6px;
    }
    .cpp-stale { opacity: 0.5; }
    .cpp-spec-name { font-size: 12px; color: var(--text); font-weight: 600; margin-bottom: 2px; }
    .cpp-spec-info { font-size: 11px; color: var(--text-dim); margin-bottom: 4px; }
    .cpp-spec-bars { display: flex; flex-direction: column; gap: 3px; }
    .cpp-spec-bar { display: flex; align-items: center; gap: 6px; font-size: 10px; color: var(--text-dim); }
    .cpp-spec-bar > div { flex: 1; }
    .cpp-spec-dmg { font-size: 10px; color: var(--amber); margin-top: 4px; }
  `;
  document.head.appendChild(style);
})();

console.log('[Ashfall] Multiplayer Combat System loaded');
