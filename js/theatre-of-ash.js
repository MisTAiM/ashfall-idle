// ================================================================
// ASHFALL IDLE — Theatre of Ash (Raid System)
// 6 rooms. 6 bosses. One chest. Prove yourself.
// ================================================================

// ── BOSS DEFINITIONS ─────────────────────────────────────────────
const TOA_BOSSES = {
  ashen_maiden: {
    id:'ashen_maiden', name:'The Ashen Maiden', hp:15000, maxHit:35,
    attackSpeed:2.4, combatLevel:180, style:'melee',
    evasion:{melee:60,ranged:50,magic:40}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], theatreOnly:true,
    mechanic:{ id:'blood_spawn', name:'Blood Spawns', interval:30, windowSecs:12,
      handleDesc:'Destroy the spawns before they reach her',
      missedPenalty:'heal', healAmt:1200, missedDmg:0 },
    phases:1, styleHints:'Protect from Melee',
    desc:'She feeds on blood. Spawns must be destroyed or she heals.',
  },
  plague_golem: {
    id:'plague_golem', name:'The Plague Golem', hp:28000, maxHit:52,
    attackSpeed:3.6, combatLevel:220, style:'melee',
    evasion:{melee:80,ranged:70,magic:50}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], theatreOnly:true,
    mechanic:{ id:'stomp', name:'Stomp', interval:22, windowSecs:6,
      handleDesc:'Step aside — dodge the stomp',
      missedPenalty:'damage', missedDmg:55, healAmt:0 },
    phases:1, styleHints:'Protect from Melee — step away on stomp',
    desc:'Slow but devastating. Stomps kill the careless.',
  },
  ashling_queen: {
    id:'ashling_queen', name:'Ashling Queen', hp:22000, maxHit:40,
    attackSpeed:2.0, combatLevel:190, style:'magic',
    evasion:{melee:50,ranged:55,magic:80}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], theatreOnly:true,
    mechanic:{ id:'style_switch', name:'Style Switch', interval:18, windowSecs:8,
      handleDesc:'Switch your protection prayer to match her new style',
      missedPenalty:'damage', missedDmg:45, healAmt:0 },
    phases:1, styleHints:'Watch her style — she switches without warning',
    desc:'Commands the Ashling swarm. Her attack style changes unpredictably.',
  },
  hollowed_titan: {
    id:'hollowed_titan', name:'The Hollowed Titan', hp:38000, maxHit:58,
    attackSpeed:3.0, combatLevel:260, style:'melee',
    evasion:{melee:90,ranged:80,magic:60}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], theatreOnly:true,
    mechanic:{ id:'shadow_orb', name:'Shadow Orb', interval:20, windowSecs:7,
      handleDesc:'Sidestep the shadow orb before it detonates',
      missedPenalty:'damage', missedDmg:60, healAmt:0 },
    phases:2,
    phaseBreak:0.50, // switches at 50% HP
    phase2Style:'magic', phase2MaxHit:50,
    styleHints:'Phase 1: Protect Melee. Phase 2: Protect Magic',
    desc:'A corrupted titan. Shatters walls in phase 2 revealing void energy.',
  },
  void_remnant: {
    id:'void_remnant', name:'The Void Remnant', hp:32000, maxHit:50,
    attackSpeed:2.2, combatLevel:240, style:'ranged',
    evasion:{melee:60,ranged:85,magic:70}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], theatreOnly:true,
    mechanic:{ id:'void_beam', name:'Void Beam', interval:25, windowSecs:8,
      handleDesc:'Stand behind a pillar to block the void beam',
      missedPenalty:'damage', missedDmg:65, healAmt:0 },
    phases:2,
    phaseBreak:0.40,
    phase2Style:'magic', phase2MaxHit:55,
    styleHints:'Phase 1: Protect Ranged. Phase 2: Protect Magic. NEVER miss the beam.',
    desc:'A fragment of the Void Emperor himself. Void beams can one-hit.',
  },
  lady_veriax: {
    id:'lady_veriax', name:'Lady Veriax', hp:55000, maxHit:68,
    attackSpeed:2.4, combatLevel:310, style:'melee',
    evasion:{melee:100,ranged:95,magic:85}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], theatreOnly:true,
    mechanic:{ id:'tornado', name:'Tornados', interval:15, windowSecs:6,
      handleDesc:'Avoid the tornados — click move',
      missedPenalty:'damage', missedDmg:70, healAmt:0 },
    phases:3,
    phaseBreaks:[0.667, 0.333], // phase changes
    phase2Style:'ranged', phase2MaxHit:58,
    phase3Style:'magic', phase3MaxHit:62,
    styleHints:'P1: Melee. P2: Ranged + crabs. P3: Magic + webs (stun).',
    desc:'The ruler of the Theatre. Three phases. Each deadlier than the last.',
    isFinalBoss: true,
  },
};

// Register boss monsters
for (const [id, boss] of Object.entries(TOA_BOSSES)) {
  if (!GAME_DATA.monsters[id]) GAME_DATA.monsters[id] = { ...boss };
}

// ── THEATRE DATA ──────────────────────────────────────────────────
GAME_DATA.theatreOfAsh = {
  levelReq: 100, // combat level

  rooms: [
    { id:'maiden',  name:'Maiden\'s Chamber',   bossId:'ashen_maiden',   order:1 },
    { id:'bloat',   name:'Plague Den',           bossId:'plague_golem',   order:2 },
    { id:'ashling', name:'Ashling Sanctum',      bossId:'ashling_queen',  order:3 },
    { id:'titan',   name:'Titan\'s Hall',        bossId:'hollowed_titan', order:4 },
    { id:'remnant', name:'Void Antechamber',     bossId:'void_remnant',   order:5 },
    { id:'veriax',  name:'Veriax\'s Throne',    bossId:'lady_veriax',    order:6 },
  ],

  // ── LOOT TABLES ──
  lootTables: {
    bronze: [
      {item:'death_rune',    qty:50,  chance:0.70, rarity:'common'},
      {item:'blood_rune',    qty:30,  chance:0.60, rarity:'common'},
      {item:'runite_bar',    qty:3,   chance:0.50, rarity:'common'},
      {item:'shark',         qty:8,   chance:0.60, rarity:'common'},
      {item:'diamond',       qty:3,   chance:0.35, rarity:'uncommon'},
      {item:'dragonfruit',   qty:2,   chance:0.25, rarity:'uncommon'},
      {item:'dragonite_bar', qty:2,   chance:0.20, rarity:'rare'},
    ],
    silver: [
      {item:'death_rune',    qty:100, chance:0.80, rarity:'common'},
      {item:'blood_rune',    qty:60,  chance:0.80, rarity:'common'},
      {item:'dragonite_bar', qty:4,   chance:0.60, rarity:'rare'},
      {item:'torstol',       qty:5,   chance:0.45, rarity:'uncommon'},
      {item:'celestial_fragment',qty:2,chance:0.35,rarity:'epic'},
      {item:'amulet_of_torture', qty:1,chance:0.08,rarity:'legendary'},
      {item:'infernal_cape', qty:1,   chance:0.05, rarity:'legendary'},
    ],
    gold: [
      {item:'death_rune',    qty:200, chance:0.90, rarity:'common'},
      {item:'blood_rune',    qty:120, chance:0.90, rarity:'common'},
      {item:'dragonite_bar', qty:8,   chance:0.80, rarity:'rare'},
      {item:'celestial_fragment',qty:5,chance:0.70,rarity:'epic'},
      {item:'amulet_of_torture', qty:1,chance:0.20,rarity:'legendary'},
      {item:'infernal_cape', qty:1,   chance:0.15, rarity:'legendary'},
      {item:'void_tear',     qty:1,   chance:0.10, rarity:'legendary'},
      {item:'veriax_eye',    qty:1,   chance:0.08, rarity:'legendary'},
    ],
    purple: [
      {item:'death_rune',    qty:300, chance:1.0,  rarity:'common'},
      {item:'blood_rune',    qty:200, chance:1.0,  rarity:'common'},
      {item:'dragonite_bar', qty:12,  chance:1.0,  rarity:'rare'},
      {item:'celestial_fragment',qty:10,chance:1.0,rarity:'epic'},
      {item:'amulet_of_torture', qty:1,chance:0.50,rarity:'legendary'},
      {item:'infernal_cape', qty:1,   chance:0.40, rarity:'legendary'},
      {item:'void_tear',     qty:1,   chance:0.30, rarity:'legendary'},
      {item:'veriax_eye',    qty:1,   chance:0.25, rarity:'legendary'},
      // Unique item roll (one of the Theatre exclusives)
      {item:'_unique_roll',  qty:1,   chance:1.0,  rarity:'unique'},
    ],
    // Unique item pool — one random item from this list on purple chest
    unique: [
      {item:'veriax_scythe', chance:0.15},
      {item:'bloodfire_staff',chance:0.15},
      {item:'ashen_rapier',  chance:0.20},
      {item:'judicator_helm',chance:0.15},
      {item:'judicator_plate',chance:0.12},
      {item:'judicator_legs',chance:0.12},
      {item:'hollow_ward',   chance:0.08},
      {item:'lil_veriax',    chance:0.03},
    ],
  },

  // Tier thresholds
  tiers: {
    purple: { maxDeaths:0, maxTimeMins:15 },
    gold:   { maxDeaths:0, maxTimeMins:30 },
    silver: { maxDeaths:1, maxTimeMins:60 },
    bronze: { maxDeaths:99, maxTimeMins:999 },
  },
};

// ── THEATRE ENGINE ────────────────────────────────────────────────
GameEngine.prototype.startTheatreOfAsh = function() {
  if (this.getCombatLevel() < GAME_DATA.theatreOfAsh.levelReq) {
    this.emit('notification',{type:'warn',text:`Theatre of Ash requires combat level ${GAME_DATA.theatreOfAsh.levelReq}.`});
    return;
  }
  if (this.state.theatre?.active) {
    this.emit('notification',{type:'warn',text:'Already in the Theatre.'});
    return;
  }
  this.stopSkill();
  this.stopCombat();

  this.state.theatre = {
    active:true, room:0, phase:0,
    between:true, betweenTimer:5, // 5s intro
    mechanic:null, mechanicTimer:0,
    performance:{ deaths:0, damageReceived:0, startTime:Date.now(), elapsedSecs:0 },
    roomsCleared:[], chestOpen:false, loot:[], tier:null, uniqueItem:null,
  };

  this.emit('notification',{type:'achievement',text:'Entering the Theatre of Ash...'});
  this.emit('theatreStart');
};

GameEngine.prototype.tickTheatre = function(dt) {
  const t = this.state.theatre;
  if (!t?.active) return;
  const c = this.state.combat;

  t.performance.elapsedSecs += dt;

  // ── BETWEEN ROOMS ────────────────────────────────────────────
  if (t.between) {
    t.betweenTimer -= dt;
    if (t.betweenTimer <= 0) {
      t.between = false;
      this._startTheatreRoom(t.room);
    }
    this.emit('theatreTick', t);
    return;
  }

  // ── CHEST PHASE ──────────────────────────────────────────────
  if (t.room >= GAME_DATA.theatreOfAsh.rooms.length) {
    this.emit('theatreTick', t);
    return;
  }

  // ── MECHANIC TIMER ───────────────────────────────────────────
  if (t.mechanic && !t.mechanic.handled) {
    t.mechanicTimer -= dt;
    if (t.mechanicTimer <= 0) {
      // Mechanic missed — apply penalty
      const m = t.mechanic;
      if (m.missedPenalty === 'damage') {
        c.playerHp -= m.missedDmg;
        this.emit('combatHit',{who:'monster', dmg:m.missedDmg, mechanic:true});
        this.emit('notification',{type:'danger',text:`Missed: ${m.name}! ${m.missedDmg} damage!`});
      } else if (m.missedPenalty === 'heal') {
        c.monsterHp = Math.min(c.monsterHp + m.healAmt, this._getTheatreBossMaxHp());
        this.emit('notification',{type:'warn',text:`Missed: ${m.name}! Boss healed ${m.healAmt} HP!`});
      }
      t.mechanic = null;
      t.mechanicTimer = 0;
    }
  }

  // ── MECHANIC SPAWN ───────────────────────────────────────────
  const roomDef = GAME_DATA.theatreOfAsh.rooms[t.room];
  const boss = TOA_BOSSES[roomDef.bossId];
  if (!t.mechanic) {
    t._mechCooldown = (t._mechCooldown || 0) + dt;
    if (t._mechCooldown >= boss.mechanic.interval) {
      t._mechCooldown = 0;
      t.mechanic = {
        id: boss.mechanic.id,
        name: boss.mechanic.name,
        handleDesc: boss.mechanic.handleDesc,
        missedPenalty: boss.mechanic.missedPenalty,
        missedDmg: boss.mechanic.missedDmg,
        healAmt: boss.mechanic.healAmt,
        handled: false,
      };
      t.mechanicTimer = boss.mechanic.windowSecs;
      this.emit('theatreMechanic', t.mechanic);
    }
  }

  // ── PHASE TRANSITIONS ────────────────────────────────────────
  const bossHpPct = c.monsterHp / this._getTheatreBossMaxHp();
  if (boss.phases >= 2 && t.phase === 0 && bossHpPct <= boss.phaseBreak) {
    t.phase = 1;
    const bossMonster = GAME_DATA.monsters[roomDef.bossId];
    if (boss.phase2Style) bossMonster.style = boss.phase2Style;
    if (boss.phase2MaxHit) bossMonster.maxHit = boss.phase2MaxHit;
    this.emit('notification',{type:'warn',text:`${boss.name} — Phase 2!`});
    this.emit('theatrePhase', {phase:2, room:t.room});
  }
  if (boss.phases >= 3 && t.phase === 1 && bossHpPct <= boss.phaseBreaks[1]) {
    t.phase = 2;
    const bossMonster = GAME_DATA.monsters[roomDef.bossId];
    if (boss.phase3Style) bossMonster.style = boss.phase3Style;
    if (boss.phase3MaxHit) bossMonster.maxHit = boss.phase3MaxHit;
    this.emit('notification',{type:'danger',text:`${boss.name} — FINAL PHASE!`});
    this.emit('theatrePhase', {phase:3, room:t.room});
    c.playerHp = Math.min(c.playerHp + Math.floor(this.getMaxHp()*0.10), this.getMaxHp()); // 10% heal on final phase
  }

  // ── NORMAL COMBAT TICK (player + boss) ───────────────────────
  this._tickStatusEffects(c.statusEffects.monster, dt, 'monster');
  this._tickStatusEffects(c.statusEffects.player, dt, 'player');

  const playerSpeed = this.getPlayerAttackSpeed();
  c.playerAttackTimer += dt;
  if (c.playerAttackTimer >= playerSpeed) {
    c.playerAttackTimer -= playerSpeed;
    try { this.playerAttack(GAME_DATA.monsters[roomDef.bossId]); } catch(e) {}
    this.drainPrayerPoints();
    this.doPetCombatAction(GAME_DATA.monsters[roomDef.bossId]);
  }

  const monsterSpeed = GAME_DATA.monsters[roomDef.bossId].attackSpeed * 0.7;
  c.monsterAttackTimer += dt;
  if (c.monsterAttackTimer >= monsterSpeed) {
    c.monsterAttackTimer -= monsterSpeed;
    this.monsterAttack(GAME_DATA.monsters[roomDef.bossId]);
    t.performance.damageReceived += (this.getMaxHp() - c.playerHp);
  }

  // Auto-eat
  if (c.autoEat && c.playerHp < this.getMaxHp() * 0.4) this.eatFood();

  // ── PLAYER DEATH ─────────────────────────────────────────────
  if (c.playerHp <= 0) {
    t.performance.deaths++;
    c.playerHp = Math.floor(this.getMaxHp() * 0.3); // partial HP restore on death
    this.emit('notification',{type:'danger',text:`You died in the Theatre! Death ${t.performance.deaths}.`});
    this.emit('theatreDeath', {deaths:t.performance.deaths, room:t.room});
    t.mechanic = null; t.mechanicTimer = 0; t._mechCooldown = 0;
    // Optional: quit if too many deaths
    if (t.performance.deaths >= 5) { this._endTheatre(false); return; }
  }

  // ── BOSS DEATH ───────────────────────────────────────────────
  if (c.monsterHp <= 0) {
    this._clearTheatreRoom(t.room);
  }

  this.emit('theatreTick', t);
};

GameEngine.prototype._getTheatreBossMaxHp = function() {
  const t = this.state.theatre;
  const roomDef = GAME_DATA.theatreOfAsh.rooms[t.room];
  return roomDef ? TOA_BOSSES[roomDef.bossId].hp : 1;
};

GameEngine.prototype._startTheatreRoom = function(roomIdx) {
  const t = this.state.theatre;
  const roomDef = GAME_DATA.theatreOfAsh.rooms[roomIdx];
  if (!roomDef) { this._completeTheatre(); return; }

  const boss = TOA_BOSSES[roomDef.bossId];
  // Restore boss stats for this fight
  Object.assign(GAME_DATA.monsters[roomDef.bossId], boss);

  const c = this.state.combat;
  c.active = true;
  c.monster = roomDef.bossId;
  c.monsterHp = boss.hp;
  c.playerAttackTimer = 0;
  c.monsterAttackTimer = 0;
  c.statusEffects = { player:{}, monster:{} };
  c._multiMobMode = false;

  t.phase = 0;
  t.mechanic = null;
  t.mechanicTimer = 0;
  t._mechCooldown = 0;

  this.emit('notification',{type:'info',text:`Room ${roomIdx+1}: ${boss.name}`});
  this.emit('theatreRoom', { room:roomIdx, boss:boss.name });
  this.emit('combatStart', { theatre:true, room:roomIdx, bossId:roomDef.bossId });
};

GameEngine.prototype._clearTheatreRoom = function(roomIdx) {
  const t = this.state.theatre;
  const roomDef = GAME_DATA.theatreOfAsh.rooms[roomIdx];
  const boss = TOA_BOSSES[roomDef.bossId];

  t.roomsCleared.push(roomDef.id);
  this.addXp('hitpoints', Math.floor(boss.hp * 0.05));
  const style = this.state.combat.combatStyle;
  if (style==='melee')  { this.addXp('attack',300); this.addXp('strength',300); this.addXp('defence',300); }
  else if (style==='ranged') { this.addXp('ranged',600); this.addXp('defence',200); }
  else { this.addXp('magic',600); this.addXp('defence',200); }
  this.addXp('tactics', 500);

  const nextRoom = roomIdx + 1;
  const isLast = nextRoom >= GAME_DATA.theatreOfAsh.rooms.length;

  this.emit('notification',{
    type:'success',
    text: isLast ? `Lady Veriax defeated! The Theatre is complete!` : `Room ${roomIdx+1} cleared! Rest before the next room.`
  });

  if (isLast) {
    this._completeTheatre();
  } else {
    t.room = nextRoom;
    t.between = true;
    t.betweenTimer = 8; // 8 second rest between rooms
    this.state.combat.active = false;
    this.emit('theatreBetweenRooms', { nextRoom, nextBoss: TOA_BOSSES[GAME_DATA.theatreOfAsh.rooms[nextRoom].bossId].name });
  }
};

GameEngine.prototype._completeTheatre = function() {
  const t = this.state.theatre;
  t.room = GAME_DATA.theatreOfAsh.rooms.length; // past last room
  t.between = false;
  this.state.combat.active = false;

  // Calculate tier
  const elapsedMins = t.performance.elapsedSecs / 60;
  const deaths = t.performance.deaths;
  const tiers = GAME_DATA.theatreOfAsh.tiers;
  let tier = 'bronze';
  if (deaths <= tiers.purple.maxDeaths && elapsedMins <= tiers.purple.maxTimeMins) tier = 'purple';
  else if (deaths <= tiers.gold.maxDeaths && elapsedMins <= tiers.gold.maxTimeMins) tier = 'gold';
  else if (deaths <= tiers.silver.maxDeaths && elapsedMins <= tiers.silver.maxTimeMins) tier = 'silver';
  t.tier = tier;

  // Update stats
  if (!this.state.stats.theatreCompletions) this.state.stats.theatreCompletions = 0;
  if (!this.state.stats.theatreBestTier) this.state.stats.theatreBestTier = 'bronze';
  this.state.stats.theatreCompletions++;
  const tierOrder = ['bronze','silver','gold','purple'];
  if (tierOrder.indexOf(tier) > tierOrder.indexOf(this.state.stats.theatreBestTier)) {
    this.state.stats.theatreBestTier = tier;
  }

  this.emit('theatreComplete', { tier, deaths, elapsedMins: Math.floor(elapsedMins) });
  this.emit('notification',{
    type:'achievement',
    text:`Theatre of Ash complete! ${tier.toUpperCase()} chest! ${deaths} deaths, ${Math.floor(elapsedMins)}m`
  });
};

GameEngine.prototype.openTheatreChest = function() {
  const t = this.state.theatre;
  if (!t || t.chestOpen || t.room < GAME_DATA.theatreOfAsh.rooms.length) return;

  const table = GAME_DATA.theatreOfAsh.lootTables[t.tier];
  const loot = [];

  for (const drop of table) {
    if (drop.item === '_unique_roll') {
      // Roll unique
      const unique = this._rollTheatreUnique();
      if (unique) {
        this.addItem(unique.item, 1);
        loot.push({ item:unique.item, qty:1, rarity:'unique' });
        t.uniqueItem = unique.item;
        this.emit('notification',{type:'achievement',text:`UNIQUE DROP: ${GAME_DATA.items[unique.item]?.name}!`});
      }
      continue;
    }
    if (Math.random() < drop.chance) {
      this.addItem(drop.item, drop.qty);
      loot.push({ item:drop.item, qty:drop.qty, rarity:drop.rarity });
    }
  }

  t.loot = loot;
  t.chestOpen = true;
  this.emit('theatreChestOpen', { tier:t.tier, loot, unique:t.uniqueItem });
};

GameEngine.prototype._rollTheatreUnique = function() {
  const pool = GAME_DATA.theatreOfAsh.lootTables.unique;
  const roll = Math.random();
  let cumulative = 0;
  for (const item of pool) {
    cumulative += item.chance;
    if (roll <= cumulative) return item;
  }
  return pool[Math.floor(Math.random() * pool.length)];
};

GameEngine.prototype.handleTheatreMechanic = function() {
  const t = this.state.theatre;
  if (!t?.mechanic || t.mechanic.handled) return;
  t.mechanic.handled = true;
  t.mechanicTimer = 0;
  this.emit('notification',{type:'success',text:`Mechanic handled!`});
  this.addXp('tactics', 50);
};

GameEngine.prototype.leaveTheatre = function() {
  this._endTheatre(false);
};

GameEngine.prototype._endTheatre = function(completed) {
  if (!this.state.theatre) return;
  if (!completed) this.emit('notification',{type:'warn',text:'You flee the Theatre of Ash.'});
  this.state.theatre = { active:false };
  this.state.combat.active = false;
  this.emit('theatreEnd');
};

// ── HOOK INTO MAIN TICK ───────────────────────────────────────────
const _origTick = GameEngine.prototype.tick;
GameEngine.prototype.tick = function() {
  _origTick.call(this);
  if (this.state.theatre?.active && !this.state.theatre.chestOpen) {
    // tick is already called — we hook into emit('tick') below
  }
};

// Override emit to intercept 'tick' and run theatre tick
const _origEmit = GameEngine.prototype.emit;
GameEngine.prototype.emit = function(event, data) {
  _origEmit.call(this, event, data);
  if (event === 'tick' && this.state.theatre?.active && !this.state.theatre.chestOpen) {
    // tickCombat already ran; run theatre on top (only if combat not active OR if theatre owns combat)
    const dt = Math.min((Date.now() - (this._lastTheatreTick||Date.now())) / 1000, 1.0);
    this._lastTheatreTick = Date.now();
    if (dt > 0.05) this.tickTheatre(dt);
  }
};

console.log('[Ashfall] Theatre of Ash loaded. Bosses:', Object.keys(TOA_BOSSES).length, '| Rooms:', GAME_DATA.theatreOfAsh.rooms.length);

// ── REGISTER BOSS ART IN GAME_DATA.monsterArt ─────────────────────
// Run after DOM ready so GAME_DATA.monsterArt is fully initialized
(function registerToaBossArt() {
  if (!GAME_DATA.monsterArt) GAME_DATA.monsterArt = {};

  GAME_DATA.monsterArt.ashen_maiden = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="am-aura" cx="50%" cy="70%" r="60%">
        <stop offset="0%" stop-color="#8a0a3a" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#8a0a3a" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- Aura -->
    <ellipse cx="60" cy="110" rx="55" ry="35" fill="url(#am-aura)"/>
    <!-- Flowing gown -->
    <path d="M35 62 Q60 55 85 62 L95 130 Q60 145 25 130Z" fill="#1a040c" stroke="#7a0a2a" stroke-width="1.5"/>
    <path d="M35 62 Q60 57 85 62 L88 80 Q60 75 32 80Z" fill="#2a0816" opacity="0.7"/>
    <path d="M38 90 Q60 86 82 90 M34 108 Q60 104 86 108" stroke="#5a0a1a" stroke-width="0.8" fill="none" opacity="0.5"/>
    <!-- Torso / bodice -->
    <path d="M38 40 Q60 34 82 40 L85 65 Q60 70 35 65Z" fill="#1a040c" stroke="#aa1a4a" stroke-width="1.5"/>
    <path d="M50 42 Q60 39 70 42 L72 58 Q60 62 48 58Z" fill="#2a0816"/>
    <!-- Arms with flowing sleeves -->
    <path d="M35 45 Q20 55 15 70 Q12 80 20 85" stroke="#1a040c" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M85 45 Q100 55 105 70 Q108 80 100 85" stroke="#1a040c" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M14 72 Q8 80 12 88" stroke="#7a0a2a" stroke-width="1.5" fill="none"/>
    <path d="M106 72 Q112 80 108 88" stroke="#7a0a2a" stroke-width="1.5" fill="none"/>
    <!-- Blood orbs in hands -->
    <circle cx="12" cy="88" r="7" fill="#0a0004" stroke="#c44040" stroke-width="1.5"/>
    <circle cx="12" cy="88" r="4" fill="#c44040" opacity="0.8"/>
    <circle cx="12" cy="88" r="2" fill="#ff8080"/>
    <circle cx="108" cy="88" r="7" fill="#0a0004" stroke="#c44040" stroke-width="1.5"/>
    <circle cx="108" cy="88" r="4" fill="#c44040" opacity="0.8"/>
    <circle cx="108" cy="88" r="2" fill="#ff8080"/>
    <!-- Head -->
    <ellipse cx="60" cy="22" rx="20" ry="22" fill="#1a040c" stroke="#aa1a4a" stroke-width="2"/>
    <!-- Hair tendrils -->
    <path d="M42 14 Q35 4 28 2" stroke="#5a0a1a" stroke-width="2.5" fill="none"/>
    <path d="M50 8  Q46 -2 42 -4" stroke="#5a0a1a" stroke-width="2" fill="none"/>
    <path d="M78 14 Q85 4 92 2" stroke="#5a0a1a" stroke-width="2.5" fill="none"/>
    <path d="M70 8  Q74 -2 78 -4" stroke="#5a0a1a" stroke-width="2" fill="none"/>
    <!-- Eyes — glowing red -->
    <ellipse cx="51" cy="20" rx="5" ry="5.5" fill="#050002"/>
    <ellipse cx="69" cy="20" rx="5" ry="5.5" fill="#050002"/>
    <circle cx="51" cy="20" r="3.5" fill="#c44040" opacity="0.95"/>
    <circle cx="69" cy="20" r="3.5" fill="#c44040" opacity="0.95"/>
    <circle cx="51" cy="20" r="1.5" fill="#ff8080"/>
    <circle cx="69" cy="20" r="1.5" fill="#ff8080"/>
    <!-- Crown of thorns -->
    <path d="M40 10 Q43 2 46 4 Q49 -2 52 2 Q56 -4 60 0 Q64 -4 68 2 Q71 -2 74 4 Q77 2 80 10" stroke="#aa1a4a" stroke-width="2" fill="none"/>
    <!-- Blood drips from gown hem -->
    <path d="M35 132 Q36 138 35 144" stroke="#c44040" stroke-width="1.5" fill="none" opacity="0.6"/>
    <path d="M55 135 Q56 142 54 148" stroke="#8a0a0a" stroke-width="1.2" fill="none" opacity="0.5"/>
    <path d="M80 133 Q81 140 80 146" stroke="#c44040" stroke-width="1.5" fill="none" opacity="0.6"/>
    <!-- Blood pool -->
    <ellipse cx="60" cy="148" rx="35" ry="6" fill="#5a0a0a" opacity="0.5"/>
  </svg>`;

  GAME_DATA.monsterArt.plague_golem = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="pg-aura" cx="50%" cy="80%" r="50%">
        <stop offset="0%" stop-color="#2a4a0a" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#2a4a0a" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="130" rx="50" ry="18" fill="url(#pg-aura)"/>
    <!-- Massive legs -->
    <rect x="20" y="105" width="28" height="40" rx="6" fill="#141208" stroke="#3a5a0a" stroke-width="1.5"/>
    <rect x="72" y="105" width="28" height="40" rx="6" fill="#141208" stroke="#3a5a0a" stroke-width="1.5"/>
    <!-- Body torso — huge, rounded -->
    <rect x="12" y="45" width="96" height="68" rx="16" fill="#1a1a08" stroke="#4a6a1a" stroke-width="2.5"/>
    <!-- Plague pustules -->
    <circle cx="30" cy="65" r="8" fill="#2a3a04" stroke="#4a6a0a" stroke-width="1"/>
    <circle cx="30" cy="65" r="4" fill="#6a8a10" opacity="0.7"/>
    <circle cx="54" cy="80" r="10" fill="#1e2c04" stroke="#4a6a0a" stroke-width="1.5"/>
    <circle cx="54" cy="80" r="5" fill="#7a9a14" opacity="0.7"/>
    <circle cx="80" cy="58" r="7" fill="#2a3a04" stroke="#4a6a0a" stroke-width="1"/>
    <circle cx="80" cy="58" r="3.5" fill="#6a8a10" opacity="0.7"/>
    <circle cx="95" cy="85" r="9" fill="#1e2c04" stroke="#3a5a0a" stroke-width="1"/>
    <circle cx="95" cy="85" r="4.5" fill="#6a8a10" opacity="0.6"/>
    <circle cx="40" cy="98" r="6" fill="#2a3a04" stroke="#4a6a0a" stroke-width="1"/>
    <circle cx="74" cy="100" r="7" fill="#1e2c04" stroke="#3a5a0a" stroke-width="1"/>
    <!-- Arms — thick, hanging -->
    <rect x="-4" y="50" width="22" height="55" rx="10" fill="#141208" stroke="#3a5a0a" stroke-width="1.5"/>
    <rect x="102" y="50" width="22" height="55" rx="10" fill="#141208" stroke="#3a5a0a" stroke-width="1.5"/>
    <!-- Claws -->
    <path d="M0 103 Q-6 110 -2 116 M8 105 Q4 113 6 120 M16 104 Q14 112 16 119" stroke="#3a5a0a" stroke-width="2" fill="none"/>
    <path d="M120 103 Q126 110 122 116 M112 105 Q116 113 114 120 M104 104 Q106 112 104 119" stroke="#3a5a0a" stroke-width="2" fill="none"/>
    <!-- Head — wide, menacing -->
    <rect x="22" y="18" width="76" height="32" rx="12" fill="#1a1a08" stroke="#4a6a1a" stroke-width="2"/>
    <!-- Eyes — yellow-green sick glow -->
    <ellipse cx="41" cy="34" rx="9" ry="9" fill="#0a0c02"/>
    <ellipse cx="79" cy="34" rx="9" ry="9" fill="#0a0c02"/>
    <circle cx="41" cy="34" r="6" fill="#8aaa1a" opacity="0.9"/>
    <circle cx="79" cy="34" r="6" fill="#8aaa1a" opacity="0.9"/>
    <circle cx="41" cy="34" r="3" fill="#aada2a"/>
    <circle cx="79" cy="34" r="3" fill="#aada2a"/>
    <!-- Teeth / mouth grill -->
    <path d="M35 44 L40 50 L46 44 L52 50 L58 44 L64 50 L70 44 L76 50 L82 44 L87 50" stroke="#2a3a04" stroke-width="2" fill="none"/>
    <!-- Flies orbiting -->
    <circle cx="8" cy="40" r="2.5" fill="#1a1a04" stroke="#2a2a04" stroke-width="0.5"/>
    <circle cx="112" cy="60" r="2" fill="#1a1a04"/>
    <circle cx="15" cy="75" r="2.5" fill="#1a1a04"/>
    <circle cx="105" cy="30" r="2" fill="#1a1a04"/>
    <!-- Ground poison puddle -->
    <ellipse cx="60" cy="146" rx="42" ry="8" fill="#1a2a04" opacity="0.6"/>
  </svg>`;

  GAME_DATA.monsterArt.ashling_queen = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="aq-glow" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#c9873e" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#c9873e" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="120" rx="50" ry="25" fill="url(#aq-glow)"/>
    <!-- Wing membrane left -->
    <path d="M28 50 Q5 20 2 55 Q5 75 28 68" fill="#1a1208" stroke="#c9873e" stroke-width="1.5" opacity="0.85"/>
    <path d="M28 50 Q10 35 8 50 Q10 62 28 60" fill="#241a08" opacity="0.5"/>
    <!-- Wing membrane right -->
    <path d="M92 50 Q115 20 118 55 Q115 75 92 68" fill="#1a1208" stroke="#c9873e" stroke-width="1.5" opacity="0.85"/>
    <path d="M92 50 Q110 35 112 50 Q110 62 92 60" fill="#241a08" opacity="0.5"/>
    <!-- Wing veins -->
    <path d="M28 55 Q18 42 10 38" stroke="#c9873e" stroke-width="0.8" fill="none" opacity="0.4"/>
    <path d="M28 60 Q14 55 8 58" stroke="#c9873e" stroke-width="0.8" fill="none" opacity="0.4"/>
    <path d="M92 55 Q102 42 110 38" stroke="#c9873e" stroke-width="0.8" fill="none" opacity="0.4"/>
    <path d="M92 60 Q106 55 112 58" stroke="#c9873e" stroke-width="0.8" fill="none" opacity="0.4"/>
    <!-- Gown flowing -->
    <path d="M34 68 Q60 62 86 68 L90 130 Q60 142 30 130Z" fill="#0e1006" stroke="#6a5a08" stroke-width="1"/>
    <path d="M36 85 Q60 80 84 85 M32 105 Q60 100 88 105" stroke="#4a4008" stroke-width="0.8" fill="none" opacity="0.4"/>
    <!-- Insect-like abdomen / torso -->
    <path d="M38 46 Q60 40 82 46 L85 70 Q60 76 35 70Z" fill="#0e1006" stroke="#c9873e" stroke-width="1.5"/>
    <!-- Segmented chitin markings -->
    <path d="M40 52 Q60 48 80 52" stroke="#c9873e" stroke-width="1" fill="none" opacity="0.4"/>
    <path d="M42 60 Q60 56 78 60" stroke="#c9873e" stroke-width="0.8" fill="none" opacity="0.3"/>
    <!-- Mantis arms -->
    <path d="M36 52 Q22 58 18 68 Q14 76 20 80" stroke="#0e1006" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M84 52 Q98 58 102 68 Q106 76 100 80" stroke="#0e1006" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M20 78 Q12 84 14 92" stroke="#c9873e" stroke-width="2" fill="none"/>
    <path d="M100 78 Q108 84 106 92" stroke="#c9873e" stroke-width="2" fill="none"/>
    <!-- Head — insectoid -->
    <ellipse cx="60" cy="24" rx="22" ry="20" fill="#0e1006" stroke="#c9873e" stroke-width="2"/>
    <!-- Compound eyes -->
    <ellipse cx="46" cy="20" rx="8" ry="8" fill="#060802"/>
    <ellipse cx="74" cy="20" rx="8" ry="8" fill="#060802"/>
    <circle cx="43" cy="18" r="3" fill="#c9873e" opacity="0.9"/>
    <circle cx="47" cy="22" r="2.5" fill="#d4a83a" opacity="0.8"/>
    <circle cx="71" cy="18" r="3" fill="#c9873e" opacity="0.9"/>
    <circle cx="75" cy="22" r="2.5" fill="#d4a83a" opacity="0.8"/>
    <!-- Antennae -->
    <path d="M50 8 Q44 0 36 -4" stroke="#c9873e" stroke-width="1.5" fill="none"/>
    <path d="M70 8 Q76 0 84 -4" stroke="#c9873e" stroke-width="1.5" fill="none"/>
    <circle cx="36" cy="-4" r="2.5" fill="#c9873e"/>
    <circle cx="84" cy="-4" r="2.5" fill="#c9873e"/>
    <!-- Crown of chitin spines -->
    <path d="M42 8 L40 0 M52 5 L50 -3 M60 4 L60 -4 M68 5 L70 -3 M78 8 L80 0" stroke="#c9873e" stroke-width="1.5" stroke-linecap="round"/>
    <!-- Swarm dots orbiting -->
    <circle cx="5"  cy="50" r="3" fill="#c9873e" opacity="0.5"/>
    <circle cx="115" cy="45" r="3" fill="#c9873e" opacity="0.5"/>
    <circle cx="3"  cy="80" r="2" fill="#c9873e" opacity="0.4"/>
    <circle cx="117" cy="75" r="2" fill="#c9873e" opacity="0.4"/>
    <circle cx="10" cy="100" r="2.5" fill="#c9873e" opacity="0.3"/>
    <!-- Ground shadow -->
    <ellipse cx="60" cy="147" rx="38" ry="7" fill="#1a1500" opacity="0.5"/>
  </svg>`;

  GAME_DATA.monsterArt.hollowed_titan = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ht-glow" cx="50%" cy="60%" r="55%">
        <stop offset="0%" stop-color="#4a5264" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#4a5264" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="138" rx="52" ry="14" fill="url(#ht-glow)"/>
    <!-- Massive armored legs -->
    <rect x="14" y="108" width="34" height="38" rx="5" fill="#101018" stroke="#3a4254" stroke-width="2"/>
    <rect x="72" y="108" width="34" height="38" rx="5" fill="#101018" stroke="#3a4254" stroke-width="2"/>
    <!-- Knee plates -->
    <ellipse cx="31" cy="110" rx="14" ry="7" fill="#1a1a2a" stroke="#4a5264" stroke-width="1.5"/>
    <ellipse cx="89" cy="110" rx="14" ry="7" fill="#1a1a2a" stroke="#4a5264" stroke-width="1.5"/>
    <!-- Torso — imposing plate armor -->
    <rect x="8" y="42" width="104" height="72" rx="10" fill="#101018" stroke="#4a5264" stroke-width="2.5"/>
    <!-- Armor plate lines -->
    <path d="M8 70 L112 70 M8 90 L112 90" stroke="#3a4254" stroke-width="1" opacity="0.5"/>
    <path d="M60 42 L60 114" stroke="#3a4254" stroke-width="0.8" opacity="0.4"/>
    <!-- Void rune on chest -->
    <circle cx="60" cy="78" r="14" fill="#060610" stroke="#8a3ab0" stroke-width="2"/>
    <circle cx="60" cy="78" r="10" fill="none" stroke="#6a1a8a" stroke-width="1" stroke-dasharray="3 2"/>
    <circle cx="60" cy="78" r="5" fill="#8a3ab0" opacity="0.7"/>
    <circle cx="60" cy="78" r="2.5" fill="#e0a0ff"/>
    <!-- Battle damage cracks -->
    <path d="M18 50 L28 65 L22 75" stroke="#4a5264" stroke-width="1.5" fill="none" opacity="0.6"/>
    <path d="M100 55 L92 70 L98 80" stroke="#4a5264" stroke-width="1.2" fill="none" opacity="0.5"/>
    <!-- Shoulders — massive pauldrons -->
    <path d="M8 50 Q0 42 2 56 Q4 68 8 64" fill="#0c0c1a" stroke="#4a5264" stroke-width="1.5"/>
    <path d="M112 50 Q120 42 118 56 Q116 68 112 64" fill="#0c0c1a" stroke="#4a5264" stroke-width="1.5"/>
    <!-- Arms — armored, holding greatweapon -->
    <rect x="-2" y="52" width="18" height="55" rx="8" fill="#101018" stroke="#3a4254" stroke-width="1.5"/>
    <rect x="104" y="52" width="18" height="55" rx="8" fill="#101018" stroke="#3a4254" stroke-width="1.5"/>
    <!-- Gauntlet spikes -->
    <path d="M2 104 L-2 112 M8 106 L6 114 M14 105 L14 113" stroke="#4a5264" stroke-width="2" stroke-linecap="round"/>
    <path d="M118 104 L122 112 M112 106 L114 114 M106 105 L106 113" stroke="#4a5264" stroke-width="2" stroke-linecap="round"/>
    <!-- Head — angular great helm -->
    <rect x="26" y="14" width="68" height="32" rx="8" fill="#101018" stroke="#4a5264" stroke-width="2.5"/>
    <!-- Helm visor — glowing void eyes -->
    <rect x="32" y="20" width="22" height="12" rx="3" fill="#060610"/>
    <rect x="66" y="20" width="22" height="12" rx="3" fill="#060610"/>
    <rect x="34" y="22" width="18" height="8" rx="2" fill="#8a3ab0" opacity="0.8"/>
    <rect x="68" y="22" width="18" height="8" rx="2" fill="#8a3ab0" opacity="0.8"/>
    <rect x="36" y="23" width="14" height="6" rx="1" fill="#d080ff"/>
    <rect x="70" y="23" width="14" height="6" rx="1" fill="#d080ff"/>
    <!-- Helm crest -->
    <path d="M30 14 L28 8 M60 12 L60 5 M90 14 L92 8" stroke="#4a5264" stroke-width="2" stroke-linecap="round"/>
    <!-- Vertical void crack down armor -->
    <path d="M58 42 Q56 60 58 78 Q60 95 58 114" stroke="#8a3ab0" stroke-width="1" fill="none" opacity="0.4"/>
  </svg>`;

  GAME_DATA.monsterArt.void_remnant = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="vr-core" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#9b30d0" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#050010" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="vr-outer" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#9b30d0" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#9b30d0" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- Outer void aura -->
    <ellipse cx="60" cy="65" rx="55" ry="60" fill="url(#vr-outer)"/>
    <!-- Main void sphere body -->
    <circle cx="60" cy="60" r="48" fill="#040008" stroke="#8a3ab0" stroke-width="2.5"/>
    <circle cx="60" cy="60" r="42" fill="#060010" stroke="#5a0a9a" stroke-width="1" stroke-dasharray="4 3"/>
    <circle cx="60" cy="60" r="32" fill="url(#vr-core)"/>
    <!-- Void crack patterns -->
    <path d="M30 30 Q40 45 35 60 Q30 75 40 85" stroke="#6a0aaa" stroke-width="1.5" fill="none" opacity="0.6"/>
    <path d="M90 30 Q80 45 85 60 Q90 75 80 85" stroke="#6a0aaa" stroke-width="1.5" fill="none" opacity="0.6"/>
    <path d="M25 60 Q40 55 55 60" stroke="#9b30d0" stroke-width="1" fill="none" opacity="0.4"/>
    <path d="M65 60 Q80 55 95 60" stroke="#9b30d0" stroke-width="1" fill="none" opacity="0.4"/>
    <!-- Three void eyes cluster -->
    <circle cx="60" cy="42" r="10" fill="#020004"/><circle cx="60" cy="42" r="7" fill="#9b30d0" opacity="0.9"/><circle cx="60" cy="42" r="4" fill="#c060f0"/><circle cx="60" cy="42" r="2" fill="#fff" opacity="0.9"/>
    <circle cx="44" cy="62" r="8" fill="#020004"/><circle cx="44" cy="62" r="5.5" fill="#7020b0" opacity="0.9"/><circle cx="44" cy="62" r="3" fill="#b050e0"/><circle cx="44" cy="62" r="1.5" fill="#fff" opacity="0.8"/>
    <circle cx="76" cy="62" r="8" fill="#020004"/><circle cx="76" cy="62" r="5.5" fill="#7020b0" opacity="0.9"/><circle cx="76" cy="62" r="3" fill="#b050e0"/><circle cx="76" cy="62" r="1.5" fill="#fff" opacity="0.8"/>
    <!-- Void tendrils extending downward -->
    <path d="M35 95 Q28 110 30 125 Q32 135 38 140" stroke="#6a0aaa" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M50 100 Q45 115 46 130" stroke="#8a3ab0" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M70 100 Q75 115 74 130" stroke="#8a3ab0" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M85 95 Q92 110 90 125 Q88 135 82 140" stroke="#6a0aaa" stroke-width="3" fill="none" stroke-linecap="round"/>
    <!-- Tendril tips -->
    <circle cx="38" cy="140" r="4" fill="#9b30d0" opacity="0.7"/>
    <circle cx="46" cy="130" r="3" fill="#8a3ab0" opacity="0.6"/>
    <circle cx="74" cy="130" r="3" fill="#8a3ab0" opacity="0.6"/>
    <circle cx="82" cy="140" r="4" fill="#9b30d0" opacity="0.7"/>
    <!-- Orbiting void fragments -->
    <ellipse cx="10" cy="45" rx="5" ry="8" fill="#1a0030" stroke="#8a3ab0" stroke-width="1" transform="rotate(-20 10 45)"/>
    <ellipse cx="110" cy="40" rx="4" ry="7" fill="#1a0030" stroke="#8a3ab0" stroke-width="1" transform="rotate(15 110 40)"/>
    <ellipse cx="8" cy="80" rx="3" ry="5" fill="#1a0028" stroke="#6a0a8a" stroke-width="0.8" transform="rotate(30 8 80)"/>
    <ellipse cx="112" cy="75" rx="3" ry="5" fill="#1a0028" stroke="#6a0a8a" stroke-width="0.8" transform="rotate(-25 112 75)"/>
  </svg>`;

  GAME_DATA.monsterArt.lady_veriax = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="lv-aura" cx="50%" cy="60%" r="70%">
        <stop offset="0%" stop-color="#9b30d0" stop-opacity="0.25"/>
        <stop offset="60%" stop-color="#d4a83a" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#9b30d0" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="lv-crown" cx="50%" cy="0%" r="100%">
        <stop offset="0%" stop-color="#d4a83a" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#d4a83a" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- Grand aura -->
    <ellipse cx="60" cy="80" rx="58" ry="65" fill="url(#lv-aura)"/>
    <!-- Outer rune circles -->
    <circle cx="60" cy="80" r="56" fill="none" stroke="#5a0a9a" stroke-width="0.8" stroke-dasharray="3 4" opacity="0.3"/>
    <circle cx="60" cy="80" r="48" fill="none" stroke="#8a6020" stroke-width="0.5" stroke-dasharray="2 5" opacity="0.2"/>
    <!-- Flowing dark gown — elaborate -->
    <path d="M30 70 Q60 62 90 70 L100 140 Q60 152 20 140Z" fill="#140020" stroke="#9b30d0" stroke-width="1.5"/>
    <!-- Gown layers -->
    <path d="M32 85  Q60 78  88 85"  fill="none" stroke="#7020a0" stroke-width="1" opacity="0.5"/>
    <path d="M28 100 Q60 94  92 100" fill="none" stroke="#5a0a80" stroke-width="0.8" opacity="0.4"/>
    <path d="M24 115 Q60 110 96 115" fill="none" stroke="#3a0060" stroke-width="0.6" opacity="0.3"/>
    <!-- Void orbs on gown -->
    <circle cx="40" cy="95"  r="4" fill="#0a0012" stroke="#9b30d0" stroke-width="1"/><circle cx="40" cy="95"  r="2" fill="#9b30d0" opacity="0.8"/>
    <circle cx="80" cy="95"  r="4" fill="#0a0012" stroke="#9b30d0" stroke-width="1"/><circle cx="80" cy="95"  r="2" fill="#9b30d0" opacity="0.8"/>
    <circle cx="50" cy="118" r="3" fill="#0a0012" stroke="#8a3ab0" stroke-width="0.8"/><circle cx="50" cy="118" r="1.5" fill="#8a3ab0" opacity="0.7"/>
    <circle cx="70" cy="118" r="3" fill="#0a0012" stroke="#8a3ab0" stroke-width="0.8"/><circle cx="70" cy="118" r="1.5" fill="#8a3ab0" opacity="0.7"/>
    <!-- Torso / bodice — ornate -->
    <path d="M34 46 Q60 38 86 46 L90 72 Q60 78 30 72Z" fill="#1a0028" stroke="#9b30d0" stroke-width="2"/>
    <!-- Chest void eye -->
    <circle cx="60" cy="60" r="8" fill="#060010" stroke="#9b30d0" stroke-width="1.5"/>
    <circle cx="60" cy="60" r="5.5" fill="#9b30d0" opacity="0.8"/>
    <circle cx="60" cy="60" r="3" fill="#e0a0ff"/>
    <circle cx="60" cy="60" r="1.2" fill="#fff" opacity="0.9"/>
    <!-- Arms — long, elegant with orb weapons -->
    <path d="M32 52 Q16 62 10 78 Q6 88 12 95" stroke="#1a0028" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M88 52 Q104 62 110 78 Q114 88 108 95" stroke="#1a0028" stroke-width="10" fill="none" stroke-linecap="round"/>
    <!-- Arm veins -->
    <path d="M22 68 Q16 74 14 82" stroke="#9b30d0" stroke-width="1.2" fill="none" opacity="0.4"/>
    <path d="M98 68 Q104 74 106 82" stroke="#9b30d0" stroke-width="1.2" fill="none" opacity="0.4"/>
    <!-- Orb weapons in hands -->
    <circle cx="12" cy="97" r="10" fill="#040008" stroke="#9b30d0" stroke-width="2"/>
    <circle cx="12" cy="97" r="7" fill="#6a0aaa" opacity="0.8"/>
    <circle cx="12" cy="97" r="4" fill="#c060f0"/>
    <circle cx="12" cy="97" r="1.5" fill="#fff" opacity="0.9"/>
    <circle cx="108" cy="97" r="10" fill="#040008" stroke="#d4a83a" stroke-width="2"/>
    <circle cx="108" cy="97" r="7" fill="#8a6020" opacity="0.8"/>
    <circle cx="108" cy="97" r="4" fill="#d4a83a"/>
    <circle cx="108" cy="97" r="1.5" fill="#fff" opacity="0.9"/>
    <!-- Head — royal, imperious -->
    <ellipse cx="60" cy="24" rx="22" ry="20" fill="#140020" stroke="#9b30d0" stroke-width="2"/>
    <!-- Face structure -->
    <path d="M46 24 Q60 20 74 24" fill="#1a0030" opacity="0.5"/>
    <!-- Elaborate crown -->
    <path d="M38 12 L40 4 M46 8  L48 0 M54 6 L56 -2 M60 5 L60 -3 M66 6 L64 -2 M72 8 L74 0 M82 12 L80 4" stroke="#d4a83a" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Crown gems -->
    <circle cx="40" cy="4"  r="2.5" fill="#d4a83a"/>
    <circle cx="48" cy="0"  r="2"   fill="#9b30d0"/>
    <circle cx="60" cy="-3" r="3"   fill="#d4a83a"/>
    <circle cx="72" cy="0"  r="2"   fill="#9b30d0"/>
    <circle cx="80" cy="4"  r="2.5" fill="#d4a83a"/>
    <!-- Crown glow -->
    <ellipse cx="60" cy="4" rx="30" ry="8" fill="url(#lv-crown)"/>
    <!-- Eyes — golden divine -->
    <ellipse cx="49" cy="22" rx="6" ry="6.5" fill="#060008"/>
    <ellipse cx="71" cy="22" rx="6" ry="6.5" fill="#060008"/>
    <circle cx="49" cy="22" r="4.5" fill="#d4a83a" opacity="0.95"/>
    <circle cx="71" cy="22" r="4.5" fill="#d4a83a" opacity="0.95"/>
    <circle cx="49" cy="22" r="2.5" fill="#ffe080"/>
    <circle cx="71" cy="22" r="2.5" fill="#ffe080"/>
    <circle cx="48" cy="20" r="1" fill="#fff" opacity="0.8"/>
    <circle cx="70" cy="20" r="1" fill="#fff" opacity="0.8"/>
    <!-- Hair tendrils with void energy -->
    <path d="M40 12 Q28 4 22 8"  stroke="#3a0050" stroke-width="3" fill="none"/>
    <path d="M80 12 Q92 4 98 8"  stroke="#3a0050" stroke-width="3" fill="none"/>
    <path d="M38 18 Q26 14 20 20" stroke="#3a0050" stroke-width="2" fill="none"/>
    <path d="M82 18 Q94 14 100 20" stroke="#3a0050" stroke-width="2" fill="none"/>
    <!-- Floating void shards around her -->
    <polygon points="2,30 6,20 10,30" fill="#9b30d0" opacity="0.3"/>
    <polygon points="110,28 114,18 118,28" fill="#d4a83a" opacity="0.3"/>
    <polygon points="5,110 9,100 13,110" fill="#9b30d0" opacity="0.2"/>
    <polygon points="107,108 111,98 115,108" fill="#d4a83a" opacity="0.2"/>
  </svg>`;

  console.log('[Ashfall] Theatre boss art registered:', 
    ['ashen_maiden','plague_golem','ashling_queen','hollowed_titan','void_remnant','lady_veriax']
    .filter(id => GAME_DATA.monsterArt[id]).length, '/ 6');
})();
