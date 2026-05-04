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
