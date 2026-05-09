// ================================================================
// ASHFALL IDLE — Chambers of the Ashen King (Raid II)
// 5 challenge rooms. Supply management. The King awaits.
// Inspired by OSRS Chambers of Xeric — adapted for Ashfall.
// ================================================================

// ── CHAMBER BOSS DEFINITIONS ────────────────────────────────────
const COA_BOSSES = {
  shambling_mound: {
    id:'shambling_mound', name:'The Shambling Mound', hp:20000, maxHit:38,
    attackSpeed:2.8, combatLevel:200, style:'melee',
    evasion:{melee:50,ranged:60,magic:30}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], chamberOnly:true,
    mechanic:{ id:'poison_vines', name:'Poison Vines', interval:24, windowSecs:10,
      handleDesc:'Slash the vines before they constrict you',
      missedPenalty:'damage', healAmt:0, missedDmg:45 },
    phases:1,
    styleHints:'Protect from Melee — use slash weapons for bonus damage',
    desc:'A massive corrupted treant. Poisonous vines lash out periodically.',
  },
  ash_vanguard: {
    id:'ash_vanguard', name:'Vanguard Triad', hp:36000, maxHit:42,
    attackSpeed:2.2, combatLevel:250, style:'melee',
    evasion:{melee:70,ranged:65,magic:70}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], chamberOnly:true,
    mechanic:{ id:'style_rotate', name:'Triad Rotation', interval:16, windowSecs:7,
      handleDesc:'Switch protection prayer to match the active vanguard',
      missedPenalty:'damage', healAmt:0, missedDmg:52 },
    phases:1,
    styleHints:'Three attack styles rotate. Match your prayer or take massive damage.',
    desc:'Three warriors sharing one body. Melee, ranged, and magic cycle unpredictably.',
  },
  tekton_forgeborn: {
    id:'tekton_forgeborn', name:'Tekton the Forgeborn', hp:45000, maxHit:65,
    attackSpeed:3.2, combatLevel:280, style:'melee',
    evasion:{melee:95,ranged:85,magic:55}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], chamberOnly:true,
    mechanic:{ id:'anvil_heal', name:'Forge Repair', interval:28, windowSecs:8,
      handleDesc:'Interrupt his repair — attack during the forge window',
      missedPenalty:'heal', healAmt:2500, missedDmg:0 },
    phases:2,
    phaseBreak:0.50,
    phase2Style:'melee', phase2MaxHit:78,
    styleHints:'Phase 1: Hit hard and fast. Phase 2: Enraged, higher max hit, faster attacks.',
    desc:'A titanic golem forged in ash and steel. Returns to his anvil to repair.',
  },
  ice_weaver: {
    id:'ice_weaver', name:'The Ice Weaver', hp:30000, maxHit:48,
    attackSpeed:2.0, combatLevel:260, style:'magic',
    evasion:{melee:55,ranged:50,magic:90}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], chamberOnly:true,
    mechanic:{ id:'ice_prison', name:'Ice Prison', interval:20, windowSecs:6,
      handleDesc:'Break free before the prison shatters and deals massive damage',
      missedPenalty:'damage', healAmt:0, missedDmg:70 },
    phases:2,
    phaseBreak:0.45,
    phase2Style:'ranged', phase2MaxHit:55,
    styleHints:'Phase 1: Protect Magic. Phase 2: Switches to ranged icicle barrage.',
    desc:'An ancient cryomancer woven into ice itself. Freezes intruders solid.',
  },
  great_olm: {
    id:'great_olm', name:'The Great Olm', hp:80000, maxHit:72,
    attackSpeed:2.6, combatLevel:350, style:'magic',
    evasion:{melee:90,ranged:85,magic:100}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], chamberOnly:true,
    mechanic:{ id:'crystal_bomb', name:'Crystal Bombs', interval:14, windowSecs:5,
      handleDesc:'Move away from the crystal bomb before detonation',
      missedPenalty:'damage', healAmt:0, missedDmg:80 },
    phases:3,
    phaseBreaks:[0.667, 0.333],
    phase2Style:'ranged', phase2MaxHit:60,
    phase3Style:'melee', phase3MaxHit:85,
    styleHints:'P1: Magic + fire walls. P2: Ranged + acid pools. P3: Melee + all mechanics.',
    desc:'The ancient guardian of the Chambers. Three phases of escalating horror.',
    isFinalBoss: true,
  },
};

// Register boss monsters
for (const [id, boss] of Object.entries(COA_BOSSES)) {
  if (!GAME_DATA.monsters[id]) GAME_DATA.monsters[id] = { ...boss };
}

// ── CHAMBERS DATA ───────────────────────────────────────────────
GAME_DATA.chambersOfAsh = {
  levelReq: 90,

  rooms: [
    { id:'mound',    name:'The Overgrowth',      bossId:'shambling_mound',  order:1 },
    { id:'vanguard', name:'Vanguard Arena',       bossId:'ash_vanguard',     order:2 },
    { id:'tekton',   name:'Tekton\'s Foundry',    bossId:'tekton_forgeborn', order:3 },
    { id:'weaver',   name:'The Frost Sanctum',    bossId:'ice_weaver',       order:4 },
    { id:'olm',      name:'Olm\'s Lair',          bossId:'great_olm',        order:5 },
  ],

  // Supply system — gather supplies between rooms
  supplies: {
    potionBrew: { name:'Raid Brew', heals:15, prayerRestore:10, brewTime:3 },
    enhancedBrew: { name:'Enhanced Brew', heals:22, prayerRestore:20, brewTime:5 },
    maxSupplies: 20,
  },

  // ── LOOT TABLES ──
  lootTables: {
    bronze: [
      {item:'death_rune',    qty:80,  chance:0.70, rarity:'common'},
      {item:'blood_rune',    qty:50,  chance:0.65, rarity:'common'},
      {item:'dragonite_bar', qty:4,   chance:0.45, rarity:'rare'},
      {item:'anglerfish',    qty:10,  chance:0.60, rarity:'common'},
      {item:'diamond',       qty:5,   chance:0.35, rarity:'uncommon'},
      {item:'celestial_fragment',qty:2,chance:0.20,rarity:'epic'},
    ],
    silver: [
      {item:'death_rune',    qty:150, chance:0.85, rarity:'common'},
      {item:'blood_rune',    qty:100, chance:0.80, rarity:'common'},
      {item:'dragonite_bar', qty:8,   chance:0.65, rarity:'rare'},
      {item:'celestial_fragment',qty:4,chance:0.45,rarity:'epic'},
      {item:'dexterous_scroll',qty:1, chance:0.06, rarity:'legendary'},
      {item:'arcane_scroll',  qty:1,  chance:0.06, rarity:'legendary'},
    ],
    gold: [
      {item:'death_rune',    qty:250, chance:0.95, rarity:'common'},
      {item:'blood_rune',    qty:180, chance:0.90, rarity:'common'},
      {item:'dragonite_bar', qty:12,  chance:0.80, rarity:'rare'},
      {item:'celestial_fragment',qty:8,chance:0.70,rarity:'epic'},
      {item:'dexterous_scroll',qty:1, chance:0.15, rarity:'legendary'},
      {item:'arcane_scroll',  qty:1,  chance:0.15, rarity:'legendary'},
      {item:'dragon_claws',   qty:1,  chance:0.10, rarity:'legendary'},
    ],
    purple: [
      {item:'death_rune',    qty:400, chance:1.0,  rarity:'common'},
      {item:'blood_rune',    qty:300, chance:1.0,  rarity:'common'},
      {item:'dragonite_bar', qty:16,  chance:1.0,  rarity:'rare'},
      {item:'celestial_fragment',qty:12,chance:1.0,rarity:'epic'},
      {item:'dexterous_scroll',qty:1, chance:0.35, rarity:'legendary'},
      {item:'arcane_scroll',  qty:1,  chance:0.35, rarity:'legendary'},
      {item:'dragon_claws',   qty:1,  chance:0.25, rarity:'legendary'},
      {item:'_unique_roll',   qty:1,  chance:1.0,  rarity:'unique'},
    ],
    unique: [
      {item:'twisted_bow',     chance:0.08},
      {item:'elder_maul',      chance:0.12},
      {item:'kodai_wand',      chance:0.12},
      {item:'ancestral_hat',   chance:0.14},
      {item:'ancestral_robe_top', chance:0.12},
      {item:'ancestral_robe_bottom', chance:0.12},
      {item:'dragon_claws',    chance:0.15},
      {item:'olmlet',          chance:0.03},
      {item:'dinhs_bulwark',   chance:0.12},
    ],
  },

  tiers: {
    purple: { maxDeaths:0, maxTimeMins:12 },
    gold:   { maxDeaths:0, maxTimeMins:25 },
    silver: { maxDeaths:1, maxTimeMins:45 },
    bronze: { maxDeaths:99, maxTimeMins:999 },
  },
};

// ── CHAMBERS ENGINE ─────────────────────────────────────────────
GameEngine.prototype.startChambersOfAsh = function() {
  if (this.getCombatLevel() < GAME_DATA.chambersOfAsh.levelReq) {
    this.emit('notification',{type:'warn',text:`Chambers requires combat level ${GAME_DATA.chambersOfAsh.levelReq}.`});
    return;
  }
  if (this.state.chambers?.active) {
    this.emit('notification',{type:'warn',text:'Already in the Chambers.'});
    return;
  }
  if (this.state.theatre?.active) {
    this.emit('notification',{type:'warn',text:'Cannot enter while in Theatre of Ash.'});
    return;
  }
  this.stopSkill();
  this.stopCombat();

  this.state.chambers = {
    active:true, room:0, phase:0,
    between:true, betweenTimer:5,
    mechanic:null, mechanicTimer:0,
    supplies:{ brews:5, enhancedBrews:0 },
    performance:{ deaths:0, damageReceived:0, startTime:Date.now(), elapsedSecs:0,
                  mechanicsHandled:0, mechanicsMissed:0, suppliesUsed:0 },
    roomsCleared:[], chestOpen:false, loot:[], tier:null, uniqueItem:null,
  };

  this.emit('notification',{type:'achievement',text:'Descending into the Chambers of the Ashen King...'});
  this.emit('chambersStart');
};

GameEngine.prototype.tickChambers = function(dt) {
  const ch = this.state.chambers;
  if (!ch?.active) return;
  const c = this.state.combat;

  ch.performance.elapsedSecs += dt;

  // Between rooms
  if (ch.between) {
    ch.betweenTimer -= dt;
    if (ch.betweenTimer <= 0) {
      ch.between = false;
      this._startChamberRoom(ch.room);
    }
    this.emit('chambersTick', ch);
    return;
  }

  // Chest phase
  if (ch.room >= GAME_DATA.chambersOfAsh.rooms.length) {
    this.emit('chambersTick', ch);
    return;
  }

  // Mechanic timer
  if (ch.mechanic && !ch.mechanic.handled) {
    ch.mechanicTimer -= dt;
    if (ch.mechanicTimer <= 0) {
      const m = ch.mechanic;
      ch.performance.mechanicsMissed++;
      if (m.missedPenalty === 'damage') {
        c.playerHp -= m.missedDmg;
        this.emit('combatHit',{who:'monster', dmg:m.missedDmg, mechanic:true});
        this.emit('notification',{type:'danger',text:`Missed: ${m.name}! ${m.missedDmg} damage!`});
      } else if (m.missedPenalty === 'heal') {
        c.monsterHp = Math.min(c.monsterHp + m.healAmt, this._getChamberBossMaxHp());
        this.emit('notification',{type:'warn',text:`Missed: ${m.name}! Boss healed ${m.healAmt} HP!`});
      }
      ch.mechanic = null;
      ch.mechanicTimer = 0;
    }
  }

  // Mechanic spawn
  const roomDef = GAME_DATA.chambersOfAsh.rooms[ch.room];
  const boss = COA_BOSSES[roomDef.bossId];
  if (!ch.mechanic) {
    ch._mechCooldown = (ch._mechCooldown || 0) + dt;
    if (ch._mechCooldown >= boss.mechanic.interval) {
      ch._mechCooldown = 0;
      ch.mechanic = {
        id: boss.mechanic.id, name: boss.mechanic.name,
        handleDesc: boss.mechanic.handleDesc,
        missedPenalty: boss.mechanic.missedPenalty,
        missedDmg: boss.mechanic.missedDmg,
        healAmt: boss.mechanic.healAmt,
        handled: false,
      };
      ch.mechanicTimer = boss.mechanic.windowSecs;
      this.emit('chambersMechanic', ch.mechanic);
    }
  }

  // Phase transitions
  const bossHpPct = c.monsterHp / this._getChamberBossMaxHp();
  if (boss.phases >= 2 && ch.phase === 0 && bossHpPct <= (boss.phaseBreak || boss.phaseBreaks?.[0])) {
    ch.phase = 1;
    const bm = GAME_DATA.monsters[roomDef.bossId];
    if (boss.phase2Style) bm.style = boss.phase2Style;
    if (boss.phase2MaxHit) bm.maxHit = boss.phase2MaxHit;
    this.emit('notification',{type:'warn',text:`${boss.name} — Phase 2!`});
    this.emit('chambersPhase', {phase:2, room:ch.room});
  }
  if (boss.phases >= 3 && ch.phase === 1 && bossHpPct <= boss.phaseBreaks[1]) {
    ch.phase = 2;
    const bm = GAME_DATA.monsters[roomDef.bossId];
    if (boss.phase3Style) bm.style = boss.phase3Style;
    if (boss.phase3MaxHit) bm.maxHit = boss.phase3MaxHit;
    this.emit('notification',{type:'danger',text:`${boss.name} — FINAL PHASE!`});
    this.emit('chambersPhase', {phase:3, room:ch.room});
    c.playerHp = Math.min(c.playerHp + Math.floor(this.getMaxHp()*0.08), this.getMaxHp());
  }

  // Combat tick
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
    ch.performance.damageReceived += (this.getMaxHp() - c.playerHp);
  }

  // Auto-eat
  if (c.autoEat && c.playerHp < this.getMaxHp() * 0.4) this.eatFood();

  // Player death
  if (c.playerHp <= 0) {
    ch.performance.deaths++;
    c.playerHp = Math.floor(this.getMaxHp() * 0.25);
    this.emit('notification',{type:'danger',text:`You died in the Chambers! Death ${ch.performance.deaths}.`});
    this.emit('chambersDeath', {deaths:ch.performance.deaths, room:ch.room});
    ch.mechanic = null; ch.mechanicTimer = 0; ch._mechCooldown = 0;
    if (ch.performance.deaths >= 5) { this._endChambers(false); return; }
  }

  // Boss death
  if (c.monsterHp <= 0) {
    this._clearChamberRoom(ch.room);
  }

  this.emit('chambersTick', ch);
};

GameEngine.prototype._getChamberBossMaxHp = function() {
  const ch = this.state.chambers;
  const roomDef = GAME_DATA.chambersOfAsh.rooms[ch.room];
  return roomDef ? COA_BOSSES[roomDef.bossId].hp : 1;
};

GameEngine.prototype._startChamberRoom = function(roomIdx) {
  const ch = this.state.chambers;
  const roomDef = GAME_DATA.chambersOfAsh.rooms[roomIdx];
  if (!roomDef) { this._completeChambers(); return; }

  const boss = COA_BOSSES[roomDef.bossId];
  Object.assign(GAME_DATA.monsters[roomDef.bossId], boss);

  const c = this.state.combat;
  c.active = true;
  c.monster = roomDef.bossId;
  c.monsterHp = boss.hp;
  c.playerAttackTimer = 0;
  c.monsterAttackTimer = 0;
  c.statusEffects = { player:{}, monster:{} };
  c._multiMobMode = false;

  ch.phase = 0;
  ch.mechanic = null;
  ch.mechanicTimer = 0;
  ch._mechCooldown = 0;

  this.emit('notification',{type:'info',text:`Chamber ${roomIdx+1}: ${boss.name}`});
  this.emit('chambersRoom', { room:roomIdx, boss:boss.name });
  this.emit('combatStart', { chambers:true, room:roomIdx, bossId:roomDef.bossId });
};

GameEngine.prototype._clearChamberRoom = function(roomIdx) {
  const ch = this.state.chambers;
  const roomDef = GAME_DATA.chambersOfAsh.rooms[roomIdx];
  const boss = COA_BOSSES[roomDef.bossId];

  ch.roomsCleared.push(roomDef.id);
  this.addXp('hitpoints', Math.floor(boss.hp * 0.04));
  const style = this.state.combat.combatStyle;
  if (style==='melee')  { this.addXp('attack',400); this.addXp('strength',400); this.addXp('defence',400); }
  else if (style==='ranged') { this.addXp('ranged',800); this.addXp('defence',300); }
  else { this.addXp('magic',800); this.addXp('defence',300); }
  this.addXp('tactics', 600);

  // Grant supply brew between rooms
  if (ch.supplies.brews < GAME_DATA.chambersOfAsh.supplies.maxSupplies) {
    ch.supplies.brews = Math.min(ch.supplies.brews + 2, GAME_DATA.chambersOfAsh.supplies.maxSupplies);
    this.emit('notification',{type:'info',text:'+2 Raid Brews gathered from the room.'});
  }

  const nextRoom = roomIdx + 1;
  const isLast = nextRoom >= GAME_DATA.chambersOfAsh.rooms.length;

  this.emit('notification',{
    type:'success',
    text: isLast ? `The Great Olm falls! The Chambers are conquered!` : `Chamber ${roomIdx+1} cleared! Rest before the next room.`
  });

  if (isLast) {
    this._completeChambers();
  } else {
    ch.room = nextRoom;
    ch.between = true;
    ch.betweenTimer = 8;
    this.state.combat.active = false;
    this.emit('chambersBetweenRooms', { nextRoom, nextBoss: COA_BOSSES[GAME_DATA.chambersOfAsh.rooms[nextRoom].bossId].name });
  }
};

GameEngine.prototype._completeChambers = function() {
  const ch = this.state.chambers;
  ch.room = GAME_DATA.chambersOfAsh.rooms.length;
  ch.between = false;
  this.state.combat.active = false;

  const elapsedMins = ch.performance.elapsedSecs / 60;
  const deaths = ch.performance.deaths;
  const tiers = GAME_DATA.chambersOfAsh.tiers;
  let tier = 'bronze';
  if (deaths <= tiers.purple.maxDeaths && elapsedMins <= tiers.purple.maxTimeMins) tier = 'purple';
  else if (deaths <= tiers.gold.maxDeaths && elapsedMins <= tiers.gold.maxTimeMins) tier = 'gold';
  else if (deaths <= tiers.silver.maxDeaths && elapsedMins <= tiers.silver.maxTimeMins) tier = 'silver';
  ch.tier = tier;

  if (!this.state.stats.chambersCompletions) this.state.stats.chambersCompletions = 0;
  if (!this.state.stats.chambersBestTier) this.state.stats.chambersBestTier = 'bronze';
  this.state.stats.chambersCompletions++;
  const tierOrder = ['bronze','silver','gold','purple'];
  if (tierOrder.indexOf(tier) > tierOrder.indexOf(this.state.stats.chambersBestTier)) {
    this.state.stats.chambersBestTier = tier;
  }

  this.emit('chambersComplete', { tier, deaths, elapsedMins: Math.floor(elapsedMins) });
  this.emit('notification',{
    type:'achievement',
    text:`Chambers complete! ${tier.toUpperCase()} chest! ${deaths} deaths, ${Math.floor(elapsedMins)}m`
  });
};

GameEngine.prototype.openChambersChest = function() {
  const ch = this.state.chambers;
  if (!ch || ch.chestOpen || ch.room < GAME_DATA.chambersOfAsh.rooms.length) return;

  const table = GAME_DATA.chambersOfAsh.lootTables[ch.tier];
  const loot = [];

  for (const drop of table) {
    if (drop.item === '_unique_roll') {
      const unique = this._rollChambersUnique();
      if (unique) {
        this.addItem(unique.item, 1);
        loot.push({ item:unique.item, qty:1, rarity:'unique' });
        ch.uniqueItem = unique.item;
        this.emit('notification',{type:'achievement',text:`UNIQUE DROP: ${GAME_DATA.items[unique.item]?.name}!`});
      }
      continue;
    }
    if (Math.random() < drop.chance) {
      this.addItem(drop.item, drop.qty);
      loot.push({ item:drop.item, qty:drop.qty, rarity:drop.rarity });
    }
  }

  ch.loot = loot;
  ch.chestOpen = true;
  this.emit('chambersChestOpen', { tier:ch.tier, loot, unique:ch.uniqueItem });
};

GameEngine.prototype._rollChambersUnique = function() {
  const pool = GAME_DATA.chambersOfAsh.lootTables.unique;
  const roll = Math.random();
  let cumulative = 0;
  for (const item of pool) {
    cumulative += item.chance;
    if (roll <= cumulative) return item;
  }
  return pool[Math.floor(Math.random() * pool.length)];
};

GameEngine.prototype.handleChambersMechanic = function() {
  const ch = this.state.chambers;
  if (!ch?.mechanic || ch.mechanic.handled) return;
  ch.mechanic.handled = true;
  ch.mechanicTimer = 0;
  ch.performance.mechanicsHandled++;
  this.emit('notification',{type:'success',text:`Mechanic handled!`});
  this.addXp('tactics', 60);
};

GameEngine.prototype.useChamberBrew = function(type) {
  const ch = this.state.chambers;
  if (!ch?.active) return;
  const c = this.state.combat;
  if (type === 'enhanced' && ch.supplies.enhancedBrews > 0) {
    ch.supplies.enhancedBrews--;
    c.playerHp = Math.min(c.playerHp + 22, this.getMaxHp());
    this.state.prayerPoints = Math.min((this.state.prayerPoints||0) + 20, this.state.maxPrayerPoints||99);
    ch.performance.suppliesUsed++;
    this.emit('notification',{type:'success',text:'Enhanced Brew: +22 HP, +20 Prayer'});
  } else if (ch.supplies.brews > 0) {
    ch.supplies.brews--;
    c.playerHp = Math.min(c.playerHp + 15, this.getMaxHp());
    this.state.prayerPoints = Math.min((this.state.prayerPoints||0) + 10, this.state.maxPrayerPoints||99);
    ch.performance.suppliesUsed++;
    this.emit('notification',{type:'info',text:'Raid Brew: +15 HP, +10 Prayer'});
  } else {
    this.emit('notification',{type:'warn',text:'No brews left!'});
  }
};

GameEngine.prototype.leaveChambers = function() {
  this._endChambers(false);
};

GameEngine.prototype._endChambers = function(completed) {
  if (!this.state.chambers) return;
  if (!completed) this.emit('notification',{type:'warn',text:'You flee the Chambers of the Ashen King.'});
  this.state.chambers = { active:false };
  this.state.combat.active = false;
  this.emit('chambersEnd');
};

// ── HOOK INTO MAIN TICK ─────────────────────────────────────────
const _origEmitCOA = GameEngine.prototype.emit;
GameEngine.prototype.emit = function(event, data) {
  _origEmitCOA.call(this, event, data);
  if (event === 'tick' && this.state.chambers?.active && !this.state.chambers.chestOpen) {
    const dt = Math.min((Date.now() - (this._lastChambersTick||Date.now())) / 1000, 1.0);
    this._lastChambersTick = Date.now();
    if (dt > 0.05) this.tickChambers(dt);
  }
};

if(window._ASHFALL_DEBUG) console.log('[Ashfall] Chambers of the Ashen King loaded. Bosses:', Object.keys(COA_BOSSES).length);

// ── CHAMBERS UNIQUE ITEMS ───────────────────────────────────────
function _itCOA(id, def) {
  if (!GAME_DATA.items[id]) GAME_DATA.items[id] = { id, ...def };
}

// Weapons
_itCOA('twisted_bow', {
  name:'Twisted Bow', type:'weapon', slot:'weapon', style:'ranged',
  attackSpeed:2.4, stats:{rangedBonus:145, attackBonus:20}, levelReq:{ranged:85},
  rarity:'mythic', sellPrice:0,
  passiveEffect:{ type:'magic_scaling', desc:'Damage scales with target\'s magic level. Stronger vs high-magic monsters.' },
  specCost:60, specEffect:{type:'twisted_shot', mult:2.0, magicScale:true},
  desc:'An ancient bow twisted by void energy. Passive: damage scales with target\'s magic. Spec: 200% with magic scaling. Unsellable.',
});
_itCOA('elder_maul', {
  name:'Elder Maul', type:'weapon', slot:'weapon', style:'melee',
  attackSpeed:3.6, stats:{attackBonus:95, strengthBonus:180}, levelReq:{attack:80, strength:80},
  rarity:'mythic', sellPrice:0,
  specCost:50, specEffect:{type:'crushing_blow', mult:1.80, defReduction:30},
  desc:'A massive maul of elder stone. Highest strength bonus in the game. Spec: 180% + reduce defence. Unsellable.',
});
_itCOA('kodai_wand', {
  name:'Kodai Wand', type:'weapon', slot:'weapon', style:'magic',
  attackSpeed:2.2, stats:{magicBonus:130, attackBonus:28}, levelReq:{magic:80},
  rarity:'mythic', sellPrice:0, providesAllRunes:true,
  passiveEffect:{ type:'autocast_save', desc:'15% chance to not consume runes (stacks with staff).' },
  specCost:50, specEffect:{type:'kodai_barrage', mult:1.60, freezePct:100},
  desc:'An ancient wand of Kodai. Unlimited water runes. Spec: 160% + guaranteed freeze. Unsellable.',
});
_itCOA('dragon_claws', {
  name:'Dragon Claws', type:'weapon', slot:'weapon', style:'melee',
  attackSpeed:1.8, stats:{attackBonus:115, strengthBonus:110}, levelReq:{attack:75},
  rarity:'legendary', sellPrice:0,
  specCost:50, specEffect:{type:'claw_rush', mult:0.60, hits:4, guaranteed:true},
  desc:'Razor-sharp dragon claws. Spec: 4 guaranteed hits (60/30/15/15%). 50% spec. Unsellable.',
});
_itCOA('dinhs_bulwark', {
  name:"Dinh's Bulwark", type:'armor', slot:'shield', rarity:'mythic', sellPrice:0,
  stats:{defenceBonus:130, strengthBonus:5, damageReduction:8},
  levelReq:{defence:80},
  passiveEffect:{ type:'bulwark_tank', desc:'Reduce all incoming damage by 15% while equipped.' },
  desc:"A massive shield forged by Dinh. Best defensive shield. DR8 + 15% damage reduction passive. Unsellable.",
});

// Ancestral Mage Robes
_itCOA('ancestral_hat', {
  name:'Ancestral Hat', type:'armor', slot:'head', rarity:'mythic', sellPrice:0,
  stats:{magicBonus:35, defenceBonus:18, damageReduction:1},
  levelReq:{magic:82, defence:65},
  desc:'Hat of the Ancestral mage set. Best-in-slot magic head. Unsellable.',
});
_itCOA('ancestral_robe_top', {
  name:'Ancestral Robe Top', type:'armor', slot:'body', rarity:'mythic', sellPrice:0,
  stats:{magicBonus:65, defenceBonus:40, damageReduction:2},
  levelReq:{magic:82, defence:65},
  desc:'Top of the Ancestral mage set. Best-in-slot magic body. Unsellable.',
});
_itCOA('ancestral_robe_bottom', {
  name:'Ancestral Robe Bottom', type:'armor', slot:'legs', rarity:'mythic', sellPrice:0,
  stats:{magicBonus:50, defenceBonus:30, damageReduction:2},
  levelReq:{magic:82, defence:65},
  desc:'Bottom of the Ancestral mage set. Best-in-slot magic legs. Unsellable.',
});

// Prayer Scrolls
_itCOA('dexterous_scroll', {
  name:'Dexterous Prayer Scroll', type:'resource', rarity:'legendary', sellPrice:0,
  desc:'Teaches the Rigour prayer. +20% Ranged Accuracy, +23% Ranged Strength, +25% Defence.',
});
_itCOA('arcane_scroll', {
  name:'Arcane Prayer Scroll', type:'resource', rarity:'legendary', sellPrice:0,
  desc:'Teaches the Augury prayer. +25% Magic Accuracy, +25% Magic Defence, +25% Defence.',
});

// Pet
_itCOA('olmlet', {
  name:'Olmlet', type:'pet_token', rarity:'mythic', sellPrice:0,
  desc:'A tiny Great Olm. Follows you everywhere. Rarest Chambers drop.',
});

if (!GAME_DATA.combatPets) GAME_DATA.combatPets = [];
if (!GAME_DATA.combatPets.find(p => p.id === 'olmlet')) {
  GAME_DATA.combatPets.push({
    id:'olmlet', name:'Olmlet', itemId:'olmlet',
    source:'chambers_of_ash', dropRate:'Chambers exclusive (purple chest)',
    passiveBonus:'All combat accuracy +10%',
    action:{ every:4, type:'olm_beam', damage:0.30, desc:'Fires an Olm beam for 30% of your max hit' },
    stats:{ accuracyMult:1.10 },
  });
}

if(window._ASHFALL_DEBUG) console.log('[Ashfall] Chambers items registered:',
  ['twisted_bow','elder_maul','kodai_wand','dragon_claws','dinhs_bulwark',
   'ancestral_hat','ancestral_robe_top','ancestral_robe_bottom',
   'dexterous_scroll','arcane_scroll','olmlet'].filter(id=>GAME_DATA.items[id]).length);

// ── BOSS SVG ART ────────────────────────────────────────────────
(function registerCoaBossArt() {
  if (!GAME_DATA.monsterArt) GAME_DATA.monsterArt = {};

  // Shambling Mound — corrupted treant with vines and fungal growths
  GAME_DATA.monsterArt.shambling_mound = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="sm-aura" cx="50%" cy="80%" r="50%">
        <stop offset="0%" stop-color="#1a4a0a" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#1a4a0a" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="140" rx="50" ry="12" fill="url(#sm-aura)"/>
    <!-- Root legs -->
    <path d="M30 120 Q20 130 15 145 Q12 150 18 150" stroke="#2a1a08" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M45 118 Q38 132 32 148" stroke="#2a1a08" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M75 118 Q82 132 88 148" stroke="#2a1a08" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M90 120 Q100 130 105 145 Q108 150 102 150" stroke="#2a1a08" stroke-width="8" fill="none" stroke-linecap="round"/>
    <!-- Main trunk body -->
    <path d="M28 45 Q20 80 25 120 L95 120 Q100 80 92 45Z" fill="#1e1608" stroke="#3a2a10" stroke-width="2"/>
    <!-- Bark texture lines -->
    <path d="M35 55 Q40 70 38 85 Q36 100 40 115" stroke="#3a2a10" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M60 48 Q58 72 62 95 Q64 110 60 120" stroke="#3a2a10" stroke-width="1" fill="none" opacity="0.4"/>
    <path d="M82 55 Q78 70 80 85 Q82 100 78 115" stroke="#3a2a10" stroke-width="1.5" fill="none" opacity="0.5"/>
    <!-- Fungal growths -->
    <ellipse cx="35" cy="70" rx="10" ry="5" fill="#4a7a20" opacity="0.8"/>
    <ellipse cx="38" cy="68" rx="6" ry="3" fill="#6aaa30" opacity="0.6"/>
    <ellipse cx="78" cy="85" rx="12" ry="6" fill="#3a6a15" opacity="0.8"/>
    <ellipse cx="82" cy="83" rx="7" ry="3.5" fill="#5a9a28" opacity="0.6"/>
    <circle cx="50" cy="100" r="6" fill="#2a5a08" stroke="#4a8a20" stroke-width="1"/>
    <circle cx="50" cy="100" r="3" fill="#6aaa30" opacity="0.7"/>
    <!-- Branch arms -->
    <path d="M28 55 Q10 45 5 30 Q2 22 8 18" stroke="#2a1a08" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M8 18 L2 10 M8 18 L14 12 M8 18 L6 8" stroke="#3a2a10" stroke-width="3" fill="none"/>
    <path d="M92 55 Q110 45 115 30 Q118 22 112 18" stroke="#2a1a08" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M112 18 L118 10 M112 18 L106 12 M112 18 L114 8" stroke="#3a2a10" stroke-width="3" fill="none"/>
    <!-- Vine tendrils (poison) -->
    <path d="M5 30 Q-5 42 2 55 Q8 65 0 75" stroke="#2a8a10" stroke-width="2" fill="none" opacity="0.7"/>
    <path d="M115 30 Q125 42 118 55 Q112 65 120 75" stroke="#2a8a10" stroke-width="2" fill="none" opacity="0.7"/>
    <path d="M30 115 Q15 120 10 130" stroke="#2a8a10" stroke-width="2" fill="none" opacity="0.6"/>
    <path d="M90 115 Q105 120 110 130" stroke="#2a8a10" stroke-width="2" fill="none" opacity="0.6"/>
    <!-- Head — gnarled crown -->
    <path d="M32 48 Q30 25 35 15 Q50 5 60 8 Q70 5 85 15 Q90 25 88 48" fill="#1e1608" stroke="#3a2a10" stroke-width="2"/>
    <!-- Glowing eyes in knotholes -->
    <circle cx="44" cy="30" r="7" fill="#080a02"/>
    <circle cx="44" cy="30" r="5" fill="#4aaa10" opacity="0.9"/>
    <circle cx="44" cy="30" r="2.5" fill="#80dd30"/>
    <circle cx="44" cy="29" r="1" fill="#fff" opacity="0.7"/>
    <circle cx="72" cy="30" r="7" fill="#080a02"/>
    <circle cx="72" cy="30" r="5" fill="#4aaa10" opacity="0.9"/>
    <circle cx="72" cy="30" r="2.5" fill="#80dd30"/>
    <circle cx="72" cy="29" r="1" fill="#fff" opacity="0.7"/>
    <!-- Mouth — jagged bark -->
    <path d="M42 42 L48 38 L54 42 L58 37 L62 42 L68 38 L74 42" stroke="#2a1a08" stroke-width="2" fill="none"/>
    <!-- Spore particles -->
    <circle cx="18" cy="55" r="2" fill="#6aaa30" opacity="0.4"/>
    <circle cx="102" cy="50" r="2.5" fill="#5a9a28" opacity="0.3"/>
    <circle cx="25" cy="95" r="1.5" fill="#4a8a20" opacity="0.4"/>
    <circle cx="95" cy="100" r="2" fill="#6aaa30" opacity="0.3"/>
  </svg>`;

  // Ash Vanguard — three-faced warrior in heavy ash armor
  GAME_DATA.monsterArt.ash_vanguard = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="av-aura" cx="50%" cy="60%" r="55%">
        <stop offset="0%" stop-color="#c9873e" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#c9873e" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="138" rx="48" ry="12" fill="url(#av-aura)"/>
    <!-- Heavy boots -->
    <rect x="22" y="122" width="24" height="22" rx="5" fill="#1a1410" stroke="#4a3820" stroke-width="1.5"/>
    <rect x="74" y="122" width="24" height="22" rx="5" fill="#1a1410" stroke="#4a3820" stroke-width="1.5"/>
    <!-- Leg plates -->
    <rect x="24" y="95" width="20" height="30" rx="4" fill="#1e180e" stroke="#5a4a28" stroke-width="1.5"/>
    <rect x="76" y="95" width="20" height="30" rx="4" fill="#1e180e" stroke="#5a4a28" stroke-width="1.5"/>
    <!-- Body — three-section torso -->
    <path d="M18 50 Q60 42 102 50 L108 100 Q60 108 12 100Z" fill="#1a1410" stroke="#c9873e" stroke-width="2"/>
    <!-- Three chest emblems — melee, ranged, magic -->
    <circle cx="36" cy="72" r="10" fill="#100a04" stroke="#c44040" stroke-width="1.5"/>
    <path d="M30 72 L36 64 L42 72 L36 80Z" fill="#c44040" opacity="0.7"/>
    <circle cx="60" cy="68" r="10" fill="#100a04" stroke="#4a88cc" stroke-width="1.5"/>
    <circle cx="60" cy="68" r="5" fill="#4a88cc" opacity="0.6"/>
    <circle cx="60" cy="68" r="2" fill="#88bbee"/>
    <circle cx="84" cy="72" r="10" fill="#100a04" stroke="#9b30d0" stroke-width="1.5"/>
    <path d="M78 72 L84 64 L90 72 L84 80Z" fill="#9b30d0" opacity="0.7" transform="rotate(45 84 72)"/>
    <!-- Shoulder pauldrons -->
    <ellipse cx="14" cy="55" rx="12" ry="10" fill="#1e180e" stroke="#c9873e" stroke-width="2"/>
    <ellipse cx="106" cy="55" rx="12" ry="10" fill="#1e180e" stroke="#c9873e" stroke-width="2"/>
    <!-- Pauldron spikes -->
    <path d="M6 48 L4 38 M14 44 L14 34" stroke="#c9873e" stroke-width="2" stroke-linecap="round"/>
    <path d="M114 48 L116 38 M106 44 L106 34" stroke="#c9873e" stroke-width="2" stroke-linecap="round"/>
    <!-- Arms holding weapons -->
    <rect x="2" y="56" width="16" height="48" rx="7" fill="#1a1410" stroke="#4a3820" stroke-width="1"/>
    <rect x="102" y="56" width="16" height="48" rx="7" fill="#1a1410" stroke="#4a3820" stroke-width="1"/>
    <!-- Sword in right hand -->
    <path d="M8 104 L6 130 M4 130 L8 130" stroke="#8a8a9a" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Bow in left hand -->
    <path d="M110 104 Q118 115 110 130" stroke="#5a3a1a" stroke-width="2" fill="none"/>
    <path d="M110 106 L110 128" stroke="#8a8a8a" stroke-width="0.8"/>
    <!-- Three-faced helm -->
    <rect x="26" y="12" width="68" height="38" rx="10" fill="#1a1410" stroke="#c9873e" stroke-width="2.5"/>
    <!-- Center face — main (red melee) -->
    <rect x="44" y="20" width="12" height="8" rx="2" fill="#060402"/>
    <rect x="64" y="20" width="12" height="8" rx="2" fill="#060402"/>
    <rect x="46" y="22" width="8" height="4" fill="#c9873e" opacity="0.9"/>
    <rect x="66" y="22" width="8" height="4" fill="#c9873e" opacity="0.9"/>
    <!-- Side faces (faint, ghostly) -->
    <circle cx="30" cy="28" r="4" fill="#060402" opacity="0.6"/>
    <circle cx="30" cy="28" r="2" fill="#c44040" opacity="0.5"/>
    <circle cx="90" cy="28" r="4" fill="#060402" opacity="0.6"/>
    <circle cx="90" cy="28" r="2" fill="#9b30d0" opacity="0.5"/>
    <!-- Helm crest -->
    <path d="M40 12 L38 4 M50 10 L48 2 M60 8 L60 0 M70 10 L72 2 M80 12 L82 4" stroke="#c9873e" stroke-width="2" stroke-linecap="round"/>
    <!-- Cape flowing behind -->
    <path d="M30 50 Q60 46 90 50 L95 140 Q60 148 25 140Z" fill="#1a0808" stroke="#5a2020" stroke-width="1" opacity="0.4"/>
  </svg>`;

  // Tekton the Forgeborn — massive golem with forge hammer
  GAME_DATA.monsterArt.tekton_forgeborn = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="tk-glow" cx="50%" cy="70%" r="50%">
        <stop offset="0%" stop-color="#c44020" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#c44020" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="142" rx="52" ry="12" fill="url(#tk-glow)"/>
    <!-- Massive legs -->
    <rect x="16" y="108" width="32" height="38" rx="6" fill="#1a1208" stroke="#5a3a18" stroke-width="2"/>
    <rect x="72" y="108" width="32" height="38" rx="6" fill="#1a1208" stroke="#5a3a18" stroke-width="2"/>
    <!-- Leg cracks with glow -->
    <path d="M28 112 L32 125 L26 135" stroke="#c44020" stroke-width="1.5" fill="none" opacity="0.6"/>
    <path d="M88 115 L84 128 L90 138" stroke="#c44020" stroke-width="1.5" fill="none" opacity="0.6"/>
    <!-- Body — enormous rock/metal -->
    <rect x="6" y="38" width="108" height="74" rx="14" fill="#1a1208" stroke="#5a3a18" stroke-width="3"/>
    <!-- Magma veins across body -->
    <path d="M20 50 Q30 65 25 80 Q20 92 28 105" stroke="#c44020" stroke-width="2" fill="none" opacity="0.5"/>
    <path d="M55 42 Q52 58 58 75 Q62 88 56 108" stroke="#c44020" stroke-width="1.5" fill="none" opacity="0.4"/>
    <path d="M95 48 Q88 62 92 78 Q96 90 90 104" stroke="#c44020" stroke-width="2" fill="none" opacity="0.5"/>
    <!-- Forge core in chest -->
    <circle cx="60" cy="72" r="16" fill="#0a0604" stroke="#c44020" stroke-width="2.5"/>
    <circle cx="60" cy="72" r="11" fill="#c44020" opacity="0.7"/>
    <circle cx="60" cy="72" r="7" fill="#e8802a"/>
    <circle cx="60" cy="72" r="3.5" fill="#ffcc60"/>
    <!-- Arms — tree-trunk thick -->
    <rect x="-6" y="42" width="22" height="60" rx="10" fill="#1a1208" stroke="#5a3a18" stroke-width="2"/>
    <rect x="104" y="42" width="22" height="60" rx="10" fill="#1a1208" stroke="#5a3a18" stroke-width="2"/>
    <!-- FORGE HAMMER in right hand -->
    <path d="M-2 102 L-8 135" stroke="#4a4a5a" stroke-width="4" stroke-linecap="round"/>
    <rect x="-18" y="128" width="24" height="14" rx="3" fill="#3a3a4a" stroke="#6a6a8a" stroke-width="1.5"/>
    <path d="M-14 132 L-14 138 M-6 132 L-6 138 M2 132 L2 138" stroke="#8a4a20" stroke-width="1" opacity="0.6"/>
    <!-- Gauntlet spikes -->
    <path d="M118 100 L124 108 M112 102 L116 112 M108 100 L108 110" stroke="#5a3a18" stroke-width="2" stroke-linecap="round"/>
    <!-- Head — angular, glowing visor -->
    <rect x="22" y="10" width="76" height="34" rx="10" fill="#1a1208" stroke="#5a3a18" stroke-width="2.5"/>
    <!-- Visor -->
    <rect x="30" y="18" width="24" height="10" rx="3" fill="#0a0402"/>
    <rect x="66" y="18" width="24" height="10" rx="3" fill="#0a0402"/>
    <rect x="32" y="20" width="20" height="6" fill="#c44020" opacity="0.9"/>
    <rect x="68" y="20" width="20" height="6" fill="#c44020" opacity="0.9"/>
    <!-- Brow ridge -->
    <path d="M28 16 Q40 10 52 16 M68 16 Q80 10 92 16" stroke="#5a3a18" stroke-width="2" fill="none"/>
    <!-- Heat shimmer particles -->
    <circle cx="20" cy="30" r="2" fill="#c44020" opacity="0.3"/>
    <circle cx="100" cy="25" r="2.5" fill="#e8802a" opacity="0.3"/>
    <circle cx="40" cy="6" r="1.5" fill="#ffcc60" opacity="0.3"/>
    <circle cx="80" cy="4" r="2" fill="#c44020" opacity="0.3"/>
  </svg>`;

  // Ice Weaver — ethereal ice mage wrapped in frozen cloth
  GAME_DATA.monsterArt.ice_weaver = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="iw-aura" cx="50%" cy="60%" r="60%">
        <stop offset="0%" stop-color="#4a8acc" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#4a8acc" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="140" rx="45" ry="10" fill="url(#iw-aura)"/>
    <!-- Flowing frozen robes -->
    <path d="M30 55 Q60 48 90 55 L100 142 Q60 155 20 142Z" fill="#0a1420" stroke="#4a8acc" stroke-width="1.5"/>
    <!-- Frost patterns on robe -->
    <path d="M35 70 Q40 68 45 72 Q50 76 55 72" stroke="#6aaaee" stroke-width="0.8" fill="none" opacity="0.5"/>
    <path d="M65 75 Q70 72 75 76 Q80 80 85 76" stroke="#6aaaee" stroke-width="0.8" fill="none" opacity="0.5"/>
    <path d="M40 95 Q50 92 55 97" stroke="#4a8acc" stroke-width="0.6" fill="none" opacity="0.4"/>
    <path d="M70 100 Q75 96 82 100" stroke="#4a8acc" stroke-width="0.6" fill="none" opacity="0.4"/>
    <!-- Ice crystals on robe hem -->
    <polygon points="28,138 32,128 36,138" fill="#6aaaee" opacity="0.6"/>
    <polygon points="50,142 54,130 58,142" fill="#88ccff" opacity="0.5"/>
    <polygon points="72,140 76,128 80,140" fill="#6aaaee" opacity="0.6"/>
    <polygon points="90,136 94,126 98,136" fill="#88ccff" opacity="0.5"/>
    <!-- Upper body -->
    <path d="M34 38 Q60 32 86 38 L90 58 Q60 62 30 58Z" fill="#0a1420" stroke="#6aaaee" stroke-width="1.5"/>
    <!-- Frost gem on chest -->
    <circle cx="60" cy="48" r="8" fill="#041028" stroke="#88ccff" stroke-width="2"/>
    <polygon points="60,42 64,48 60,54 56,48" fill="#88ccff" opacity="0.9"/>
    <circle cx="60" cy="48" r="2.5" fill="#ccf0ff"/>
    <!-- Arms — wraith-like, trailing frost -->
    <path d="M30 42 Q14 52 8 65 Q4 74 10 80" stroke="#0a1420" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M90 42 Q106 52 112 65 Q116 74 110 80" stroke="#0a1420" stroke-width="8" fill="none" stroke-linecap="round"/>
    <!-- Frost trails from hands -->
    <path d="M10 78 Q4 85 8 92 Q12 98 6 105" stroke="#6aaaee" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M110 78 Q116 85 112 92 Q108 98 114 105" stroke="#6aaaee" stroke-width="1.5" fill="none" opacity="0.5"/>
    <!-- Ice orbs in hands -->
    <circle cx="10" cy="82" r="8" fill="#041028" stroke="#88ccff" stroke-width="2"/>
    <circle cx="10" cy="82" r="5" fill="#4a8acc" opacity="0.8"/>
    <circle cx="10" cy="82" r="2.5" fill="#ccf0ff"/>
    <circle cx="110" cy="82" r="8" fill="#041028" stroke="#88ccff" stroke-width="2"/>
    <circle cx="110" cy="82" r="5" fill="#4a8acc" opacity="0.8"/>
    <circle cx="110" cy="82" r="2.5" fill="#ccf0ff"/>
    <!-- Head — hooded, frozen -->
    <path d="M32 40 Q30 20 40 10 Q50 4 60 6 Q70 4 80 10 Q90 20 88 40" fill="#0a1420" stroke="#4a8acc" stroke-width="2"/>
    <!-- Face — icy glow from within hood -->
    <ellipse cx="48" cy="24" rx="6" ry="7" fill="#041028"/>
    <circle cx="48" cy="24" r="4.5" fill="#4a8acc" opacity="0.9"/>
    <circle cx="48" cy="24" r="2.5" fill="#ccf0ff"/>
    <circle cx="48" cy="23" r="1" fill="#fff" opacity="0.8"/>
    <ellipse cx="72" cy="24" rx="6" ry="7" fill="#041028"/>
    <circle cx="72" cy="24" r="4.5" fill="#4a8acc" opacity="0.9"/>
    <circle cx="72" cy="24" r="2.5" fill="#ccf0ff"/>
    <circle cx="72" cy="23" r="1" fill="#fff" opacity="0.8"/>
    <!-- Snowflake particles -->
    <circle cx="5" cy="40" r="2" fill="#88ccff" opacity="0.4"/>
    <circle cx="115" cy="45" r="2.5" fill="#6aaaee" opacity="0.3"/>
    <circle cx="20" cy="105" r="2" fill="#88ccff" opacity="0.3"/>
    <circle cx="100" cy="110" r="1.5" fill="#ccf0ff" opacity="0.4"/>
    <circle cx="55" cy="5" r="2" fill="#88ccff" opacity="0.3"/>
  </svg>`;

  // Great Olm — massive serpentine dragon in crystal cave
  GAME_DATA.monsterArt.great_olm = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="olm-aura" cx="50%" cy="50%" r="65%">
        <stop offset="0%" stop-color="#c9873e" stop-opacity="0.2"/>
        <stop offset="60%" stop-color="#4aaa50" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#c9873e" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- Grand aura -->
    <ellipse cx="60" cy="80" rx="58" ry="70" fill="url(#olm-aura)"/>
    <!-- Body coils -->
    <path d="M20 130 Q10 110 18 95 Q28 80 22 65 Q16 50 30 42" stroke="#2a3a18" stroke-width="18" fill="none" stroke-linecap="round" opacity="0.8"/>
    <path d="M100 130 Q110 110 102 95 Q92 80 98 65 Q104 50 90 42" stroke="#2a3a18" stroke-width="18" fill="none" stroke-linecap="round" opacity="0.8"/>
    <!-- Scale texture on coils -->
    <path d="M14 100 Q18 98 22 100 Q26 102 30 100" stroke="#4a5a28" stroke-width="1" fill="none" opacity="0.4"/>
    <path d="M94 100 Q98 98 102 100 Q106 102 110 100" stroke="#4a5a28" stroke-width="1" fill="none" opacity="0.4"/>
    <!-- Main head — large, draconic -->
    <ellipse cx="60" cy="28" rx="32" ry="28" fill="#1e2a10" stroke="#4a5a28" stroke-width="2.5"/>
    <!-- Scale plates on head -->
    <path d="M32 18 Q38 14 44 18" stroke="#5a7a30" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M48 10 Q54 6 60 10" stroke="#5a7a30" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M76 18 Q82 14 88 18" stroke="#5a7a30" stroke-width="1.5" fill="none" opacity="0.5"/>
    <!-- Massive eyes — crystal glow -->
    <ellipse cx="42" cy="22" rx="10" ry="11" fill="#060a04"/>
    <circle cx="42" cy="22" r="7.5" fill="#c9873e" opacity="0.95"/>
    <circle cx="42" cy="22" r="4.5" fill="#e8c060"/>
    <circle cx="41" cy="20" r="2" fill="#fff" opacity="0.8"/>
    <ellipse cx="78" cy="22" rx="10" ry="11" fill="#060a04"/>
    <circle cx="78" cy="22" r="7.5" fill="#c9873e" opacity="0.95"/>
    <circle cx="78" cy="22" r="4.5" fill="#e8c060"/>
    <circle cx="77" cy="20" r="2" fill="#fff" opacity="0.8"/>
    <!-- Third eye (center, smaller) -->
    <circle cx="60" cy="12" r="6" fill="#060a04" stroke="#c9873e" stroke-width="1"/>
    <circle cx="60" cy="12" r="4" fill="#c9873e" opacity="0.8"/>
    <circle cx="60" cy="12" r="2" fill="#ffe080"/>
    <!-- Mouth — massive jaw -->
    <path d="M34 42 Q60 50 86 42" stroke="#1e2a10" stroke-width="2.5" fill="none"/>
    <!-- Teeth -->
    <path d="M38 42 L42 50 L46 42 L50 50 L54 42 L58 50 L62 42 L66 50 L70 42 L74 50 L78 42 L82 50" stroke="#e8e0d0" stroke-width="1.5" fill="none"/>
    <!-- Crystal horns -->
    <path d="M30 10 Q24 -2 20 -8" stroke="#c9873e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M90 10 Q96 -2 100 -8" stroke="#c9873e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="20" cy="-8" r="4" fill="#c9873e" opacity="0.7"/>
    <circle cx="100" cy="-8" r="4" fill="#c9873e" opacity="0.7"/>
    <!-- Left hand (claw) -->
    <path d="M4 65 Q-4 72 2 80 Q8 88 0 95" stroke="#2a3a18" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M-2 90 L-8 100 M2 94 L0 104 M6 92 L8 102" stroke="#4a5a28" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Right hand (claw) -->
    <path d="M116 65 Q124 72 118 80 Q112 88 120 95" stroke="#2a3a18" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M122 90 L128 100 M118 94 L120 104 M114 92 L112 102" stroke="#4a5a28" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Crystal formations around lair -->
    <polygon points="8,140 12,125 16,140" fill="#c9873e" opacity="0.5"/>
    <polygon points="100,138 105,120 110,138" fill="#c9873e" opacity="0.5"/>
    <polygon points="52,145 56,132 60,145" fill="#e8c060" opacity="0.3"/>
    <!-- Drool / acid drips -->
    <path d="M48 50 Q50 58 48 64" stroke="#4aaa50" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M70 50 Q72 58 70 64" stroke="#4aaa50" stroke-width="1.5" fill="none" opacity="0.5"/>
  </svg>`;

  // console.log('[Ashfall] Chambers boss art registered:',
  //   ['shambling_mound','ash_vanguard','tekton_forgeborn','ice_weaver','great_olm']
  //   .filter(id => GAME_DATA.monsterArt[id]).length, '/ 5');
})();
