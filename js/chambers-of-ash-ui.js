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
