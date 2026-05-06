// ================================================================
// ASHFALL IDLE — Content Expansion v9.5
// Barrows, The Gauntlet, The Inferno, Slayer Bosses
// ================================================================

function _itCE(id, def) { if (!GAME_DATA.items[id]) GAME_DATA.items[id] = { id, ...def }; }

// ================================================================
// BARROWS — Six brothers, six sets, one chest
// ================================================================
const BARROWS_BROTHERS = {
  dharok: { id:'dharok', name:"Dharok the Wretched", hp:6000, maxHit:58, attackSpeed:2.8, combatLevel:115, style:'melee', evasion:{melee:55,ranged:50,magic:25}, xp:350, gold:{min:0,max:0}, alignment:'CE', drops:[], barrowsOnly:true, desc:"Dharok's axe hits harder the lower his HP gets. Protect from Melee." },
  ahrim: { id:'ahrim', name:"Ahrim the Blighted", hp:5000, maxHit:45, attackSpeed:2.0, combatLevel:100, style:'magic', evasion:{melee:30,ranged:35,magic:70}, xp:320, gold:{min:0,max:0}, alignment:'CE', drops:[], barrowsOnly:true, desc:"Ahrim casts powerful spells that drain your stats. Protect from Magic." },
  karil: { id:'karil', name:"Karil the Tainted", hp:4500, maxHit:42, attackSpeed:1.8, combatLevel:98, style:'ranged', evasion:{melee:40,ranged:65,magic:30}, xp:300, gold:{min:0,max:0}, alignment:'CE', drops:[], barrowsOnly:true, desc:"Karil's bolts lower your Agility. Protect from Ranged." },
  guthan: { id:'guthan', name:"Guthan the Infested", hp:5500, maxHit:48, attackSpeed:2.4, combatLevel:110, style:'melee', evasion:{melee:55,ranged:50,magic:25}, xp:340, gold:{min:0,max:0}, alignment:'CE', drops:[], barrowsOnly:true, healsOnHit:true, healPct:25, desc:"Guthan heals himself with every successful hit. Kill him fast." },
  torag: { id:'torag', name:"Torag the Corrupted", hp:7000, maxHit:35, attackSpeed:3.2, combatLevel:108, style:'melee', evasion:{melee:65,ranged:55,magic:25}, xp:330, gold:{min:0,max:0}, alignment:'CE', drops:[], barrowsOnly:true, desc:"Torag is the tankiest brother. Low damage but immense defence." },
  verac: { id:'verac', name:"Verac the Defiled", hp:5500, maxHit:52, attackSpeed:2.4, combatLevel:112, style:'melee', evasion:{melee:50,ranged:45,magic:30}, xp:350, gold:{min:0,max:0}, alignment:'CE', drops:[], barrowsOnly:true, ignoreDefPct:25, desc:"Verac's flail ignores 25% of your defence. Prayer helps but doesn't fully block." },
};
for (const [id, b] of Object.entries(BARROWS_BROTHERS)) { if (!GAME_DATA.monsters[id]) GAME_DATA.monsters[id] = { ...b }; }

// Barrows armor sets
const _barrowsSets = [
  { brother:'dharok', prefix:"Dharok's", style:'melee', stats:{head:{def:55,str:15},body:{def:105,str:25,dr:2},legs:{def:85,str:18,dr:1},weapon:{attackBonus:103,strengthBonus:138}}, weaponType:'weapon', weaponSpeed:3.4, weaponStyle:'melee', setBonus:'Deals more damage at lower HP' },
  { brother:'ahrim', prefix:"Ahrim's", style:'magic', stats:{head:{mag:25,def:20},body:{mag:50,def:42,dr:1},legs:{mag:38,def:32},weapon:{magicBonus:80,attackBonus:15}}, weaponType:'weapon', weaponSpeed:2.4, weaponStyle:'magic', setBonus:'+20% magic damage' },
  { brother:'karil', prefix:"Karil's", style:'ranged', stats:{head:{rng:20,def:25},body:{rng:40,def:50,dr:1},legs:{rng:30,def:38},weapon:{rangedBonus:85,attackBonus:10}}, weaponType:'weapon', weaponSpeed:1.8, weaponStyle:'ranged', setBonus:'+15% ranged accuracy' },
  { brother:'guthan', prefix:"Guthan's", style:'melee', stats:{head:{def:50,str:8},body:{def:98,str:18,dr:2},legs:{def:78,str:12,dr:1},weapon:{attackBonus:85,strengthBonus:95}}, weaponType:'weapon', weaponSpeed:2.4, weaponStyle:'melee', setBonus:'25% chance to heal on hit' },
  { brother:'torag', prefix:"Torag's", style:'melee', stats:{head:{def:60,str:5},body:{def:115,str:10,dr:3},legs:{def:92,str:8,dr:2},weapon:{attackBonus:72,strengthBonus:78}}, weaponType:'weapon', weaponSpeed:3.0, weaponStyle:'melee', setBonus:'+30% damage reduction' },
  { brother:'verac', prefix:"Verac's", style:'melee', stats:{head:{def:48,str:10,pr:3},body:{def:90,str:15,dr:1,pr:3},legs:{def:72,str:10,dr:1,pr:3},weapon:{attackBonus:78,strengthBonus:88}}, weaponType:'weapon', weaponSpeed:2.4, weaponStyle:'melee', setBonus:'25% chance to ignore defence' },
];
const _bSlotNames = {head:'Helm',body:'Platebody',legs:'Platelegs'};
const _bWeaponNames = {dharok:'Greataxe',ahrim:'Staff',karil:'Crossbow',guthan:'Warspear',torag:'Hammers',verac:'Flail'};

for (const set of _barrowsSets) {
  for (const [slot, stats] of Object.entries(set.stats)) {
    if (slot === 'weapon') {
      _itCE(`${set.brother}_weapon`, { name:`${set.prefix} ${_bWeaponNames[set.brother]}`, type:'weapon', slot:'weapon', style:set.weaponStyle, attackSpeed:set.weaponSpeed, stats, levelReq:{[set.weaponStyle==='magic'?'magic':set.weaponStyle==='ranged'?'ranged':'attack']:70}, rarity:'legendary', sellPrice:0, desc:`${set.prefix} weapon. Part of the ${set.prefix} set. ${set.setBonus}. Unsellable.` });
    } else {
      const st = {};
      if (stats.def) st.defenceBonus = stats.def;
      if (stats.str) st.strengthBonus = stats.str;
      if (stats.mag) st.magicBonus = stats.mag;
      if (stats.rng) st.rangedBonus = stats.rng;
      if (stats.dr) st.damageReduction = stats.dr;
      _itCE(`${set.brother}_${slot}`, { name:`${set.prefix} ${_bSlotNames[slot]}`, type:'armor', slot, stats:st, levelReq:{defence:70}, rarity:'legendary', sellPrice:0, desc:`${set.prefix} ${_bSlotNames[slot]}. Part of the set (${set.setBonus}). Unsellable.` });
    }
  }
}

// Barrows chest loot
GAME_DATA.barrows = {
  levelReq: 60,
  brothers: ['dharok','ahrim','karil','guthan','torag','verac'],
  chestLoot: [
    {item:'death_rune', qty:80, chance:0.80},
    {item:'blood_rune', qty:50, chance:0.70},
    {item:'bolt_rack', qty:30, chance:0.60},
    {item:'dragon_bones', qty:3, chance:0.40},
  ],
  // 1/24 for specific piece per brother killed
  pieceDrop: 1/24,
};
_itCE('bolt_rack', { name:'Bolt Rack', type:'ammo', rarity:'uncommon', sellPrice:20, desc:"Karil's bolt racks. Common Barrows chest drop." });

// Barrows engine
GameEngine.prototype.startBarrows = function() {
  if (this.getCombatLevel() < GAME_DATA.barrows.levelReq) { this.emit('notification',{type:'warn',text:`Barrows requires combat level ${GAME_DATA.barrows.levelReq}.`}); return; }
  this.stopSkill(); this.stopCombat();
  this.state.barrows = { active:true, brother:0, killed:[], chestOpen:false, loot:[] };
  this._startBarrowsBrother(0);
  this.emit('notification',{type:'achievement',text:'You descend into the Barrows crypts...'});
};

GameEngine.prototype._startBarrowsBrother = function(idx) {
  const b = this.state.barrows;
  const bId = GAME_DATA.barrows.brothers[idx];
  if (!bId) { this._barrowsChest(); return; }
  const boss = BARROWS_BROTHERS[bId];
  Object.assign(GAME_DATA.monsters[bId], boss);
  const c = this.state.combat;
  c.active = true; c.monster = bId; c.monsterHp = boss.hp;
  c.playerAttackTimer = 0; c.monsterAttackTimer = 0;
  c.statusEffects = { player:{}, monster:{} }; c._multiMobMode = false;
  b.brother = idx;
  this.emit('notification',{type:'info',text:`${boss.name} rises from the crypt!`});
  this.emit('combatStart', { barrows:true, brother:bId });
};

GameEngine.prototype._barrowsBrotherKilled = function() {
  const b = this.state.barrows;
  const bId = GAME_DATA.barrows.brothers[b.brother];
  b.killed.push(bId);
  this.addXp('hitpoints', 200);
  const style = this.state.combat.combatStyle;
  if (style==='melee') { this.addXp('attack',200); this.addXp('strength',200); this.addXp('defence',200); }
  else if (style==='ranged') { this.addXp('ranged',400); this.addXp('defence',150); }
  else { this.addXp('magic',400); this.addXp('defence',150); }
  const next = b.brother + 1;
  if (next >= GAME_DATA.barrows.brothers.length) {
    this._barrowsChest();
  } else {
    this.state.combat.active = false;
    b.between = true; b.betweenTimer = 2; b._nextBrother = next;
  }
};

GameEngine.prototype._barrowsChest = function() {
  const b = this.state.barrows;
  this.state.combat.active = false;
  const loot = [];
  // Base loot
  for (const drop of GAME_DATA.barrows.chestLoot) {
    if (Math.random() < drop.chance) { this.addItem(drop.item, drop.qty); loot.push({item:drop.item,qty:drop.qty,rarity:'common'}); }
  }
  // Armor rolls (1 roll per brother killed)
  const pieces = ['head','body','legs','weapon'];
  for (const bId of b.killed) {
    if (Math.random() < GAME_DATA.barrows.pieceDrop) {
      const slot = pieces[Math.floor(Math.random()*pieces.length)];
      const itemId = `${bId}_${slot}`;
      if (GAME_DATA.items[itemId]) { this.addItem(itemId, 1); loot.push({item:itemId,qty:1,rarity:'legendary'}); this.emit('notification',{type:'achievement',text:`BARROWS DROP: ${GAME_DATA.items[itemId].name}!`}); }
    }
  }
  b.loot = loot; b.chestOpen = true;
  if (!this.state.stats.barrowsCompletions) this.state.stats.barrowsCompletions = 0;
  this.state.stats.barrowsCompletions++;
  this.emit('notification',{type:'success',text:`Barrows complete! ${b.killed.length}/6 brothers killed. Chest opened.`});
};

GameEngine.prototype.leaveBarrows = function() {
  this.state.barrows = { active:false }; this.state.combat.active = false;
  this.emit('notification',{type:'info',text:'You leave the Barrows.'});
};

// Hook Barrows/Gauntlet/Inferno into monster death
const _origOnMonsterDeathCE = GameEngine.prototype.onMonsterDeath;
GameEngine.prototype.onMonsterDeath = function(monster, isWB) {
  const mId = this.state.combat.monster;
  // Barrows — skip normal death, advance to next brother
  if (this.state.barrows?.active && BARROWS_BROTHERS[mId]) {
    this._barrowsBrotherKilled();
    return;
  }
  // Gauntlet — boss killed = complete
  if (this.state.gauntlet?.active && (mId === 'crystalline_hunllef' || mId === 'corrupted_hunllef')) {
    this._gauntletComplete();
    return;
  }
  // Inferno — advance to next wave
  if (this.state.inferno?.active) {
    this._infernoWaveComplete();
    return;
  }
  if (_origOnMonsterDeathCE) _origOnMonsterDeathCE.call(this, monster, isWB);
};

// ================================================================
// THE GAUNTLET — Solo resource challenge + boss fight
// ================================================================
GAME_DATA.monsters.crystalline_hunllef = {
  id:'crystalline_hunllef', name:'Crystalline Hunllef', hp:25000, maxHit:70, attackSpeed:2.4, combatLevel:280, style:'magic',
  evasion:{melee:80,ranged:80,magic:80}, xp:0, gold:{min:0,max:0}, alignment:'CE', drops:[], gauntletOnly:true,
  desc:'The guardian of the Gauntlet. Switches attack styles. Crystal tornados chase you.',
};
GAME_DATA.monsters.corrupted_hunllef = {
  id:'corrupted_hunllef', name:'Corrupted Hunllef', hp:40000, maxHit:95, attackSpeed:2.0, combatLevel:350, style:'magic',
  evasion:{melee:90,ranged:90,magic:90}, xp:0, gold:{min:0,max:0}, alignment:'CE', drops:[], gauntletOnly:true,
  desc:'The corrupted guardian. Faster attacks, higher damage, more tornados. Extreme difficulty.',
};

_itCE('crystal_armor_seed', { name:'Crystal Armor Seed', type:'resource', rarity:'legendary', sellPrice:0, desc:'Used to create Crystal armor pieces at a singing bowl.' });
_itCE('crystal_weapon_seed', { name:'Crystal Weapon Seed', type:'resource', rarity:'legendary', sellPrice:0, desc:'Used to create Crystal weapons at a singing bowl.' });
_itCE('enhanced_crystal_weapon_seed', { name:'Enhanced Crystal Weapon Seed', type:'resource', rarity:'mythic', sellPrice:0, desc:'Creates a Blade of Saeldor or Bow of Faerdhinen.' });
_itCE('crystal_helm', { name:'Crystal Helm', type:'armor', slot:'head', rarity:'legendary', sellPrice:0, stats:{defenceBonus:65,rangedBonus:15,magicBonus:15,damageReduction:1}, levelReq:{defence:70}, desc:'Elven crystal helm. Hybrid stats. Unsellable.' });
_itCE('crystal_body', { name:'Crystal Body', type:'armor', slot:'body', rarity:'legendary', sellPrice:0, stats:{defenceBonus:125,rangedBonus:30,magicBonus:30,damageReduction:3}, levelReq:{defence:70}, desc:'Elven crystal body. Best hybrid body. Unsellable.' });
_itCE('crystal_legs', { name:'Crystal Legs', type:'armor', slot:'legs', rarity:'legendary', sellPrice:0, stats:{defenceBonus:95,rangedBonus:22,magicBonus:22,damageReduction:2}, levelReq:{defence:70}, desc:'Elven crystal legs. Hybrid stats. Unsellable.' });
_itCE('bow_of_faerdhinen', { name:'Bow of Faerdhinen', type:'weapon', slot:'weapon', style:'ranged', attackSpeed:2.0, stats:{rangedBonus:140,attackBonus:20}, levelReq:{ranged:80}, rarity:'mythic', sellPrice:0, desc:'An ancient elven bow. Requires no ammo. Unsellable.' });
_itCE('younglief', { name:'Youngllef', type:'pet_token', rarity:'mythic', sellPrice:0, desc:'A baby Hunllef. Gauntlet pet.' });

GAME_DATA.gauntlet = {
  levelReq: 80,
  normalRewards: [
    {item:'crystal_armor_seed',qty:1,chance:0.08},
    {item:'crystal_weapon_seed',qty:1,chance:0.06},
    {item:'death_rune',qty:100,chance:0.80},
    {item:'blood_rune',qty:60,chance:0.70},
    {item:'dragonite_bar',qty:3,chance:0.40},
  ],
  corruptedRewards: [
    {item:'crystal_armor_seed',qty:1,chance:0.15},
    {item:'crystal_weapon_seed',qty:1,chance:0.12},
    {item:'enhanced_crystal_weapon_seed',qty:1,chance:0.02},
    {item:'younglief',qty:1,chance:0.005},
    {item:'death_rune',qty:200,chance:1.0},
    {item:'blood_rune',qty:150,chance:1.0},
    {item:'dragonite_bar',qty:8,chance:0.80},
    {item:'celestial_fragment',qty:5,chance:0.50},
  ],
};

GameEngine.prototype.startGauntlet = function(corrupted) {
  if (this.getCombatLevel() < GAME_DATA.gauntlet.levelReq) { this.emit('notification',{type:'warn',text:`Gauntlet requires combat level ${GAME_DATA.gauntlet.levelReq}.`}); return; }
  this.stopSkill(); this.stopCombat();
  const bossId = corrupted ? 'corrupted_hunllef' : 'crystalline_hunllef';
  this.state.gauntlet = { active:true, corrupted:!!corrupted, startTime:Date.now(), prep:true, prepTimer:15, bossId };
  this.emit('notification',{type:'achievement',text:corrupted ? 'Entering the Corrupted Gauntlet...' : 'Entering the Gauntlet...'});
};

GameEngine.prototype._gauntletComplete = function() {
  const g = this.state.gauntlet;
  this.state.combat.active = false;
  const rewards = g.corrupted ? GAME_DATA.gauntlet.corruptedRewards : GAME_DATA.gauntlet.normalRewards;
  const loot = [];
  for (const drop of rewards) {
    if (Math.random() < drop.chance) { this.addItem(drop.item, drop.qty); loot.push({item:drop.item,qty:drop.qty}); }
  }
  g.loot = loot; g.complete = true;
  if (!this.state.stats.gauntletCompletions) this.state.stats.gauntletCompletions = 0;
  this.state.stats.gauntletCompletions++;
  const elapsed = Math.floor((Date.now() - g.startTime) / 1000);
  this.emit('notification',{type:'achievement',text:`${g.corrupted?'Corrupted ':''}Gauntlet complete in ${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')}!`});
  this.addXp('hitpoints', g.corrupted ? 3000 : 1500);
  this.addXp('tactics', g.corrupted ? 1000 : 500);
};
GameEngine.prototype.leaveGauntlet = function() { this.state.gauntlet = {active:false}; this.state.combat.active = false; };

// ================================================================
// THE INFERNO — 69 waves + TzKal-Zuk
// ================================================================
GAME_DATA.monsters.jal_nib = { id:'jal_nib', name:'Jal-Nib', hp:60, maxHit:5, attackSpeed:1.6, combatLevel:32, style:'melee', evasion:{melee:5,ranged:5,magic:5}, xp:20, gold:{min:0,max:0}, alignment:'CE', drops:[], infernoOnly:true, desc:'Nibblers. They attack the pillars. Kill them first.' };
GAME_DATA.monsters.jal_mejrah = { id:'jal_mejrah', name:'Jal-MejRah', hp:100, maxHit:10, attackSpeed:2.0, combatLevel:85, style:'magic', evasion:{melee:10,ranged:15,magic:30}, xp:40, gold:{min:0,max:0}, alignment:'CE', drops:[], infernoOnly:true, desc:'Bats. Weak but annoying. Magic attacks.' };
GAME_DATA.monsters.jal_ak = { id:'jal_ak', name:'Jal-Ak', hp:200, maxHit:18, attackSpeed:2.6, combatLevel:165, style:'melee', evasion:{melee:30,ranged:25,magic:15}, xp:60, gold:{min:0,max:0}, alignment:'CE', drops:[], infernoOnly:true, splitsOnDeath:true, splitInto:'jal_ak_small', splitCount:2, desc:'Blobs. Split on death into 2 smaller blobs.' };
GAME_DATA.monsters.jal_ak_small = { id:'jal_ak_small', name:'Jal-Ak (small)', hp:80, maxHit:10, attackSpeed:2.2, combatLevel:85, style:'melee', evasion:{melee:10,ranged:10,magic:5}, xp:25, gold:{min:0,max:0}, alignment:'CE', drops:[], infernoOnly:true, desc:'Small blob.' };
GAME_DATA.monsters.jal_imkot = { id:'jal_imkot', name:'Jal-ImKot', hp:600, maxHit:40, attackSpeed:2.8, combatLevel:240, style:'melee', evasion:{melee:55,ranged:50,magic:35}, xp:120, gold:{min:0,max:0}, alignment:'CE', drops:[], infernoOnly:true, desc:'Melee bruiser. Extremely high defence and damage.' };
GAME_DATA.monsters.jal_xil = { id:'jal_xil', name:'Jal-Xil', hp:500, maxHit:50, attackSpeed:2.0, combatLevel:370, style:'ranged', evasion:{melee:40,ranged:60,magic:30}, xp:150, gold:{min:0,max:0}, alignment:'CE', drops:[], infernoOnly:true, desc:'Ranger. Protect from Ranged or take massive hits.' };
GAME_DATA.monsters.jal_zek = { id:'jal_zek', name:'Jal-Zek', hp:900, maxHit:80, attackSpeed:2.4, combatLevel:490, style:'magic', evasion:{melee:60,ranged:55,magic:80}, xp:250, gold:{min:0,max:0}, alignment:'CE', drops:[], infernoOnly:true, desc:'Mager. Protect from Magic. Can heal other monsters.' };
GAME_DATA.monsters.jaltok_jad = { id:'jaltok_jad', name:'JalTok-Jad', hp:6000, maxHit:120, attackSpeed:3.0, combatLevel:600, style:'magic', evasion:{melee:70,ranged:65,magic:80}, xp:500, gold:{min:0,max:0}, alignment:'CE', drops:[], infernoOnly:true, desc:'Triple Jad. Three of them at once. Prayer flick or die.' };
GAME_DATA.monsters.tzkal_zuk = { id:'tzkal_zuk', name:'TzKal-Zuk', hp:20000, maxHit:250, attackSpeed:3.5, combatLevel:1400, style:'magic', evasion:{melee:95,ranged:90,magic:100}, xp:50000, gold:{min:0,max:0}, alignment:'CE', drops:[], infernoOnly:true, desc:'The final boss. The hardest fight in the game. One-shot potential.' };

_itCE('infernal_cape_v2', { name:'Infernal Cape', type:'armor', slot:'cape', rarity:'mythic', sellPrice:0, stats:{attackBonus:8,strengthBonus:12,rangedBonus:8,magicBonus:8,defenceBonus:15,damageReduction:2}, levelReq:{}, desc:'Best-in-slot melee cape. Earned from the Inferno. Unsellable.' });
_itCE('jal_nib_rek', { name:'Jal-Nib-Rek', type:'pet_token', rarity:'mythic', sellPrice:0, desc:'A tiny Zuk. Inferno pet. Extremely rare.' });

GAME_DATA.inferno = {
  levelReq: 100,
  waveCount: 69,
  rewards: {
    cape: 'infernal_cape_v2',
    pet: { item:'jal_nib_rek', chance:0.005 },
    xp: 50000,
  },
};

// Simplified wave generator for the Inferno
GameEngine.prototype.startInferno = function() {
  if (this.getCombatLevel() < GAME_DATA.inferno.levelReq) { this.emit('notification',{type:'warn',text:`The Inferno requires combat level ${GAME_DATA.inferno.levelReq}.`}); return; }
  this.stopSkill(); this.stopCombat();
  this.state.inferno = { active:true, wave:0, deaths:0, startTime:Date.now(), complete:false, loot:[] };
  this._startInfernoWave(0);
  this.emit('notification',{type:'achievement',text:'You enter the Inferno. 69 waves. No mercy.'});
};
GameEngine.prototype._getInfernoMonster = function(wave) {
  if (wave < 10) return ['jal_nib','jal_mejrah'][wave % 2];
  if (wave < 20) return ['jal_mejrah','jal_ak'][wave % 2];
  if (wave < 35) return ['jal_ak','jal_imkot'][wave % 2];
  if (wave < 50) return ['jal_imkot','jal_xil'][wave % 2];
  if (wave < 62) return ['jal_xil','jal_zek'][wave % 2];
  if (wave < 66) return 'jal_zek';
  if (wave < 69) return 'jaltok_jad';
  return 'tzkal_zuk';
};
GameEngine.prototype._startInfernoWave = function(wave) {
  const mId = this._getInfernoMonster(wave);
  const mon = GAME_DATA.monsters[mId];
  if (!mon) { this.emit('notification',{type:'warn',text:'Inferno error.'}); this.leaveInferno(); return; }
  const c = this.state.combat;
  c.active = true; c.monster = mId; c.monsterHp = mon.hp;
  c.playerAttackTimer = 0; c.monsterAttackTimer = 0; c.statusEffects = {player:{},monster:{}};
  this.state.inferno.wave = wave;
  this.emit('notification',{type:'info',text:`Wave ${wave+1}/69: ${mon.name}`});
  this.emit('combatStart',{inferno:true, wave});
};
GameEngine.prototype._infernoWaveComplete = function() {
  const inf = this.state.inferno;
  const next = inf.wave + 1;
  if (next >= GAME_DATA.inferno.waveCount) {
    this._infernoComplete();
  } else {
    this.state.combat.active = false;
    inf.between = true; inf.betweenTimer = 1.5; inf._nextWave = next;
  }
};
GameEngine.prototype._infernoComplete = function() {
  const inf = this.state.inferno;
  this.state.combat.active = false;
  inf.complete = true;
  this.addItem('infernal_cape_v2', 1);
  inf.loot.push({item:'infernal_cape_v2',qty:1,rarity:'mythic'});
  if (Math.random() < GAME_DATA.inferno.rewards.pet.chance) {
    this.addItem('jal_nib_rek', 1);
    inf.loot.push({item:'jal_nib_rek',qty:1,rarity:'mythic'});
    this.emit('notification',{type:'achievement',text:'PET DROP: Jal-Nib-Rek!'});
  }
  this.addXp('hitpoints', GAME_DATA.inferno.rewards.xp);
  if (!this.state.stats.infernoCompletions) this.state.stats.infernoCompletions = 0;
  this.state.stats.infernoCompletions++;
  const elapsed = Math.floor((Date.now() - inf.startTime)/1000);
  this.emit('notification',{type:'achievement',text:`THE INFERNO IS COMPLETE! ${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')} — Infernal Cape earned!`});
};
GameEngine.prototype.leaveInferno = function() { this.state.inferno = {active:false}; this.state.combat.active = false; };

// ── UNIFIED TICK HOOK for Barrows / Gauntlet / Inferno ──────────
const _origEmitCE = GameEngine.prototype.emit;
GameEngine.prototype.emit = function(event, data) {
  _origEmitCE.call(this, event, data);
  if (event !== 'tick') return;
  const dt = 0.6; // approximate tick interval

  // Barrows between-brother timer
  const b = this.state.barrows;
  if (b?.active && b.between) {
    b.betweenTimer -= dt;
    if (b.betweenTimer <= 0) {
      b.between = false;
      this._startBarrowsBrother(b._nextBrother);
    }
  }

  // Gauntlet prep timer
  const g = this.state.gauntlet;
  if (g?.active && g.prep) {
    g.prepTimer -= dt;
    if (g.prepTimer <= 0) {
      g.prep = false;
      const boss = GAME_DATA.monsters[g.bossId];
      const c = this.state.combat;
      c.active = true; c.monster = g.bossId; c.monsterHp = boss.hp;
      c.playerAttackTimer = 0; c.monsterAttackTimer = 0;
      c.statusEffects = { player:{}, monster:{} };
      this.emit('notification',{type:'danger',text:`${boss.name} appears!`});
      this.emit('combatStart', { gauntlet:true, bossId:g.bossId });
    }
  }

  // Inferno between-wave timer
  const inf = this.state.inferno;
  if (inf?.active && inf.between) {
    inf.betweenTimer -= dt;
    if (inf.betweenTimer <= 0) {
      inf.between = false;
      this._startInfernoWave(inf._nextWave);
    }
  }
};

// ── SLAYER BOSS FIGHT CHECK ─────────────────────────────────────
const _origStartCombatCE = GameEngine.prototype.startCombat;
GameEngine.prototype.startCombat = function(monsterId) {
  const mon = GAME_DATA.monsters[monsterId];
  if (mon?.slayerReq) {
    const slayerLvl = this.state.skills?.slayer?.level || 1;
    if (slayerLvl < mon.slayerReq) {
      this.emit('notification',{type:'warn',text:`Requires Slayer level ${mon.slayerReq}. You are level ${slayerLvl}.`});
      return;
    }
  }
  if (_origStartCombatCE) return _origStartCombatCE.call(this, monsterId);
};

// ── KILL COUNT TRACKER ──────────────────────────────────────────
// Track boss kills for statistics
GameEngine.prototype._trackBossKill = function(bossId) {
  if (!this.state.stats.bossKills) this.state.stats.bossKills = {};
  this.state.stats.bossKills[bossId] = (this.state.stats.bossKills[bossId] || 0) + 1;
};

// ================================================================
// SLAYER BOSSES — Boss variants of slayer creatures
// ================================================================
GAME_DATA.monsters.cerberus = { id:'cerberus', name:'Cerberus', hp:6000, maxHit:55, attackSpeed:2.4, combatLevel:318, style:'magic', evasion:{melee:70,ranged:65,magic:75}, xp:700, gold:{min:100,max:500}, alignment:'CE', drops:[{item:'dragon_bones',qty:3,chance:1.0},{item:'primordial_crystal',qty:1,chance:0.01},{item:'pegasian_crystal',qty:1,chance:0.01},{item:'eternal_crystal',qty:1,chance:0.01}], desc:'Three-headed hellhound boss. Slayer level 91 required.', slayerReq:91 };
GAME_DATA.monsters.kraken = { id:'kraken', name:'Kraken', hp:5000, maxHit:45, attackSpeed:2.0, combatLevel:291, style:'magic', evasion:{melee:50,ranged:55,magic:85}, xp:600, gold:{min:80,max:400}, alignment:'CE', drops:[{item:'dragon_bones',qty:2,chance:0.80},{item:'kraken_tentacle',qty:1,chance:0.008},{item:'trident_piece',qty:1,chance:0.01}], desc:'Massive sea creature. Magic only. Slayer level 87 required.', slayerReq:87 };
GAME_DATA.monsters.smoke_devil_boss = { id:'smoke_devil_boss', name:'Thermonuclear Smoke Devil', hp:4000, maxHit:40, attackSpeed:2.2, combatLevel:301, style:'magic', evasion:{melee:55,ranged:60,magic:70}, xp:550, gold:{min:60,max:300}, alignment:'CE', drops:[{item:'dragon_bones',qty:2,chance:0.80},{item:'smoke_battlestaff',qty:1,chance:0.01},{item:'occult_necklace',qty:1,chance:0.005}], desc:'The thermonuclear variant. Slayer level 93 required.', slayerReq:93 };
GAME_DATA.monsters.abyssal_sire = { id:'abyssal_sire', name:'Abyssal Sire', hp:8000, maxHit:62, attackSpeed:2.6, combatLevel:350, style:'melee', evasion:{melee:75,ranged:70,magic:55}, xp:900, gold:{min:120,max:600}, alignment:'CE', drops:[{item:'dragon_bones',qty:3,chance:1.0},{item:'abyssal_whip',qty:1,chance:0.02},{item:'abyssal_bludgeon_piece',qty:1,chance:0.008}], desc:'Mother of Abyssal Demons. Multi-phase fight. Slayer level 85 required.', slayerReq:85 };
GAME_DATA.monsters.grotesque_guardians = { id:'grotesque_guardians', name:'Grotesque Guardians', hp:9000, maxHit:70, attackSpeed:2.8, combatLevel:328, style:'melee', evasion:{melee:80,ranged:75,magic:60}, xp:1100, gold:{min:150,max:700}, alignment:'CE', drops:[{item:'dragon_bones',qty:4,chance:1.0},{item:'granite_maul',qty:1,chance:0.01},{item:'guardian_boots',qty:1,chance:0.005}], desc:'Dusk and Dawn. Two gargoyle bosses. Slayer level 75 required.', slayerReq:75 };

// Slayer boss items
_itCE('primordial_crystal', { name:'Primordial Crystal', type:'resource', rarity:'legendary', sellPrice:5000, desc:'Cerberus drop. Used to upgrade dragon boots.' });
_itCE('pegasian_crystal', { name:'Pegasian Crystal', type:'resource', rarity:'legendary', sellPrice:5000, desc:'Cerberus drop. Used to upgrade ranged boots.' });
_itCE('eternal_crystal', { name:'Eternal Crystal', type:'resource', rarity:'legendary', sellPrice:5000, desc:'Cerberus drop. Used to upgrade magic boots.' });
_itCE('kraken_tentacle', { name:'Kraken Tentacle', type:'resource', rarity:'legendary', sellPrice:8000, desc:'Used to create the Tentacle Whip.' });
_itCE('trident_piece', { name:'Trident of the Seas (full)', type:'weapon', slot:'weapon', style:'magic', attackSpeed:2.4, stats:{magicBonus:95,attackBonus:15}, levelReq:{magic:75}, rarity:'legendary', sellPrice:20000, desc:'Powered staff. Strong magic weapon.' });
_itCE('smoke_battlestaff', { name:'Smoke Battlestaff', type:'weapon', slot:'weapon', style:'magic', attackSpeed:2.4, stats:{magicBonus:85,attackBonus:12}, levelReq:{magic:70}, rarity:'legendary', sellPrice:12000, desc:'Provides unlimited fire and air runes.' });
_itCE('abyssal_bludgeon_piece', { name:'Abyssal Bludgeon Piece', type:'resource', rarity:'legendary', sellPrice:3000, desc:'Collect 3 to assemble the Abyssal Bludgeon.' });
_itCE('granite_maul', { name:'Granite Maul', type:'weapon', slot:'weapon', style:'melee', attackSpeed:2.8, stats:{attackBonus:72,strengthBonus:95}, levelReq:{attack:50,strength:50}, rarity:'rare', sellPrice:8000, specCost:50, specEffect:{type:'instant_smash',mult:1.0,instant:true}, desc:'A massive maul. Spec: instant attack (no delay). 50% spec.' });
_itCE('guardian_boots', { name:'Guardian Boots', type:'armor', slot:'boots', rarity:'legendary', sellPrice:0, stats:{defenceBonus:35,strengthBonus:5,damageReduction:1}, levelReq:{defence:75}, desc:'Best defensive boots in the game. Unsellable.' });

GAME_DATA.slayerBosses = [
  { id:'cerberus', name:'Cerberus', slayerReq:91, desc:'Three-headed hellhound. Drops Primordial, Pegasian, Eternal crystals.', combatLevel:318 },
  { id:'kraken', name:'Kraken', slayerReq:87, desc:'Giant sea creature. Drops Tentacle and Trident.', combatLevel:291 },
  { id:'smoke_devil_boss', name:'Thermonuclear Smoke Devil', slayerReq:93, desc:'Drops Smoke Battlestaff and Occult Necklace.', combatLevel:301 },
  { id:'abyssal_sire', name:'Abyssal Sire', slayerReq:85, desc:'Drops Abyssal Whip and Bludgeon pieces.', combatLevel:350 },
  { id:'grotesque_guardians', name:'Grotesque Guardians', slayerReq:75, desc:'Drops Granite Maul and Guardian Boots.', combatLevel:328 },
];

// ================================================================
// ALL SVG ART
// ================================================================
if (!GAME_DATA.monsterArt) GAME_DATA.monsterArt = {};
Object.assign(GAME_DATA.monsterArt, {

  // ── BARROWS BROTHERS ──────────────────────────────────────────
  dharok: `<svg viewBox="0 0 80 80"><rect x="20" y="30" width="40" height="32" rx="4" fill="#1a0808" stroke="#5a2020" stroke-width="2"/><rect x="24" y="56" width="12" height="18" rx="3" fill="#140606" stroke="#4a1818" stroke-width="1"/><rect x="44" y="56" width="12" height="18" rx="3" fill="#140606" stroke="#4a1818" stroke-width="1"/><rect x="16" y="12" width="48" height="22" rx="6" fill="#1a0808" stroke="#5a2020" stroke-width="2"/><rect x="24" y="18" width="10" height="6" rx="1" fill="#080202"/><rect x="26" y="20" width="6" height="2" fill="#c44040" opacity="0.8"/><rect x="46" y="18" width="10" height="6" rx="1" fill="#080202"/><rect x="48" y="20" width="6" height="2" fill="#c44040" opacity="0.8"/><rect x="8" y="32" width="14" height="26" rx="6" fill="#140606" stroke="#4a1818" stroke-width="1"/><rect x="58" y="32" width="14" height="26" rx="6" fill="#140606" stroke="#4a1818" stroke-width="1"/><path d="M6 58 L2 74" stroke="#5a5a6a" stroke-width="3" stroke-linecap="round"/><rect x="-4" y="68" width="16" height="10" rx="2" fill="#3a3a4a" stroke="#5a5a6a" stroke-width="1.5"/></svg>`,

  ahrim: `<svg viewBox="0 0 80 80"><path d="M24 30 Q40 24 56 30 L60 74 Q40 80 20 74Z" fill="#0a0618" stroke="#4a2080" stroke-width="1.5"/><path d="M26 38 Q40 34 54 38" stroke="#3a1860" stroke-width="0.8" fill="none" opacity="0.5"/><path d="M22 55 Q40 50 58 55" stroke="#3a1860" stroke-width="0.8" fill="none" opacity="0.5"/><circle cx="40" cy="18" r="10" fill="#0a0618" stroke="#6a30a0" stroke-width="2"/><circle cx="36" cy="16" r="2.5" fill="#040208"/><circle cx="36" cy="16" r="1.2" fill="#9b30d0" opacity="0.9"/><circle cx="44" cy="16" r="2.5" fill="#040208"/><circle cx="44" cy="16" r="1.2" fill="#9b30d0" opacity="0.9"/><path d="M20 34 Q12 40 8 52" stroke="#0a0618" stroke-width="6" fill="none"/><path d="M60 34 Q68 40 72 52" stroke="#0a0618" stroke-width="6" fill="none"/><path d="M8 52 L4 74" stroke="#4a2a1a" stroke-width="2.5" stroke-linecap="round"/><circle cx="4" cy="6" r="5" fill="#9b30d0" opacity="0.5"/><circle cx="4" cy="6" r="3" fill="#e0a0ff"/><path d="M4 11 L4 74" stroke="#4a2a1a" stroke-width="2.5"/></svg>`,

  karil: `<svg viewBox="0 0 80 80"><path d="M26 30 Q40 26 54 30 L56 65 Q40 70 24 65Z" fill="#0a0c08" stroke="#3a5030" stroke-width="1.5"/><rect x="28" y="60" width="10" height="14" rx="3" fill="#080a06" stroke="#2a3a20" stroke-width="1"/><rect x="42" y="60" width="10" height="14" rx="3" fill="#080a06" stroke="#2a3a20" stroke-width="1"/><circle cx="40" cy="18" r="10" fill="#0a0c08" stroke="#4a6a38" stroke-width="2"/><path d="M30 14 Q34 10 40 12 Q46 10 50 14" fill="#0a0c08" stroke="#3a5030" stroke-width="1"/><circle cx="36" cy="16" r="2.5" fill="#040602"/><circle cx="36" cy="16" r="1.2" fill="#4aaa20" opacity="0.9"/><circle cx="44" cy="16" r="2.5" fill="#040602"/><circle cx="44" cy="16" r="1.2" fill="#4aaa20" opacity="0.9"/><rect x="14" y="34" width="12" height="22" rx="5" fill="#080a06" stroke="#2a3a20" stroke-width="1"/><rect x="54" y="34" width="12" height="22" rx="5" fill="#080a06" stroke="#2a3a20" stroke-width="1"/><path d="M66 44 Q74 34 66 24" stroke="#4a3a1a" stroke-width="2" fill="none"/><path d="M66 26 L66 42" stroke="#6a6a6a" stroke-width="0.8"/></svg>`,

  guthan: `<svg viewBox="0 0 80 80"><rect x="20" y="30" width="40" height="32" rx="4" fill="#0c0a08" stroke="#4a3a28" stroke-width="2"/><rect x="24" y="56" width="12" height="18" rx="3" fill="#0a0806" stroke="#3a2a18" stroke-width="1"/><rect x="44" y="56" width="12" height="18" rx="3" fill="#0a0806" stroke="#3a2a18" stroke-width="1"/><circle cx="40" cy="44" r="6" fill="#060402" stroke="#4a8a20" stroke-width="1.5"/><circle cx="40" cy="44" r="3" fill="#4a8a20" opacity="0.6"/><rect x="14" y="10" width="52" height="22" rx="8" fill="#0c0a08" stroke="#4a3a28" stroke-width="2"/><path d="M30 10 L26 2 M40 8 L40 0 M50 10 L54 2" stroke="#4a3a28" stroke-width="2" stroke-linecap="round"/><rect x="24" y="16" width="10" height="6" rx="1" fill="#060402"/><rect x="26" y="18" width="6" height="2" fill="#4a8a20" opacity="0.8"/><rect x="46" y="16" width="10" height="6" rx="1" fill="#060402"/><rect x="48" y="18" width="6" height="2" fill="#4a8a20" opacity="0.8"/><rect x="6" y="32" width="14" height="28" rx="6" fill="#0a0806" stroke="#3a2a18" stroke-width="1"/><rect x="60" y="32" width="14" height="28" rx="6" fill="#0a0806" stroke="#3a2a18" stroke-width="1"/><path d="M4 60 L2 76" stroke="#5a4a3a" stroke-width="2.5" stroke-linecap="round"/><circle cx="2" cy="76" r="3" fill="#4a3a28"/></svg>`,

  torag: `<svg viewBox="0 0 80 80"><rect x="16" y="28" width="48" height="36" rx="5" fill="#0e0c0a" stroke="#4a4038" stroke-width="2.5"/><rect x="22" y="58" width="14" height="18" rx="3" fill="#0a0808" stroke="#3a3430" stroke-width="1.5"/><rect x="44" y="58" width="14" height="18" rx="3" fill="#0a0808" stroke="#3a3430" stroke-width="1.5"/><path d="M16 40 L64 40 M16 52 L64 52" stroke="#3a3430" stroke-width="0.8" opacity="0.4"/><ellipse cx="12" cy="34" rx="8" ry="6" fill="#0a0808" stroke="#4a4038" stroke-width="1.5"/><ellipse cx="68" cy="34" rx="8" ry="6" fill="#0a0808" stroke="#4a4038" stroke-width="1.5"/><rect x="4" y="34" width="14" height="28" rx="6" fill="#0a0808" stroke="#3a3430" stroke-width="1"/><rect x="62" y="34" width="14" height="28" rx="6" fill="#0a0808" stroke="#3a3430" stroke-width="1"/><rect x="14" y="8" width="52" height="24" rx="8" fill="#0e0c0a" stroke="#4a4038" stroke-width="2.5"/><rect x="22" y="16" width="12" height="6" rx="1" fill="#060404"/><rect x="24" y="18" width="8" height="2" fill="#8a4020" opacity="0.8"/><rect x="46" y="16" width="12" height="6" rx="1" fill="#060404"/><rect x="48" y="18" width="8" height="2" fill="#8a4020" opacity="0.8"/></svg>`,

  verac: `<svg viewBox="0 0 80 80"><path d="M24 30 Q40 26 56 30 L58 65 Q40 70 22 65Z" fill="#0c080a" stroke="#4a3040" stroke-width="1.5"/><rect x="28" y="58" width="10" height="16" rx="3" fill="#0a060a" stroke="#3a2030" stroke-width="1"/><rect x="42" y="58" width="10" height="16" rx="3" fill="#0a060a" stroke="#3a2030" stroke-width="1"/><circle cx="40" cy="48" r="5" fill="#060408" stroke="#8a4070" stroke-width="1.5"/><polygon points="40,44 44,48 40,52 36,48" fill="#8a4070" opacity="0.5"/><rect x="14" y="8" width="52" height="24" rx="6" fill="#0c080a" stroke="#6a4060" stroke-width="2"/><rect x="24" y="14" width="10" height="6" rx="1" fill="#060408"/><rect x="26" y="16" width="6" height="2" fill="#8a4070" opacity="0.8"/><rect x="46" y="14" width="10" height="6" rx="1" fill="#060408"/><rect x="48" y="16" width="6" height="2" fill="#8a4070" opacity="0.8"/><path d="M30 8 L28 2 M50 8 L52 2" stroke="#6a4060" stroke-width="2" stroke-linecap="round"/><rect x="8" y="32" width="14" height="26" rx="6" fill="#0a060a" stroke="#3a2030" stroke-width="1"/><rect x="58" y="32" width="14" height="26" rx="6" fill="#0a060a" stroke="#3a2030" stroke-width="1"/><path d="M6 58 L2 72" stroke="#5a4a5a" stroke-width="2.5"/><circle cx="2" cy="72" r="4" fill="#5a4a5a"/><path d="M-2 72 L2 72 L6 72" stroke="#8a4070" stroke-width="1.5"/></svg>`,

  // ── GAUNTLET BOSSES ───────────────────────────────────────────
  crystalline_hunllef: `<svg viewBox="0 0 80 80"><defs><radialGradient id="ch-g" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#88ccff" stop-opacity="0.15"/><stop offset="100%" stop-color="#88ccff" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="45" rx="35" ry="35" fill="url(#ch-g)"/><polygon points="40,8 58,24 54,48 26,48 22,24" fill="#041828" stroke="#88ccff" stroke-width="2"/><polygon points="40,14 52,26 48,44 32,44 28,26" fill="#082030" stroke="#6aaaee" stroke-width="1" opacity="0.5"/><circle cx="34" cy="28" r="4" fill="#041020"/><circle cx="34" cy="28" r="2.5" fill="#88ccff" opacity="0.9"/><circle cx="34" cy="27" r="1" fill="#fff" opacity="0.7"/><circle cx="46" cy="28" r="4" fill="#041020"/><circle cx="46" cy="28" r="2.5" fill="#88ccff" opacity="0.9"/><circle cx="46" cy="27" r="1" fill="#fff" opacity="0.7"/><path d="M22 48 Q16 56 20 66 Q26 72 32 68" stroke="#041828" stroke-width="5" fill="none"/><path d="M58 48 Q64 56 60 66 Q54 72 48 68" stroke="#041828" stroke-width="5" fill="none"/><path d="M26 48 L22 58 L18 68" stroke="#88ccff" stroke-width="1.5" fill="none" opacity="0.4"/><path d="M54 48 L58 58 L62 68" stroke="#88ccff" stroke-width="1.5" fill="none" opacity="0.4"/><polygon points="10,20 16,12 18,22" fill="#88ccff" opacity="0.4"/><polygon points="70,18 62,10 62,22" fill="#88ccff" opacity="0.4"/><polygon points="14,58 18,50 20,58" fill="#6aaaee" opacity="0.3"/><polygon points="66,56 62,48 60,56" fill="#6aaaee" opacity="0.3"/></svg>`,

  corrupted_hunllef: `<svg viewBox="0 0 80 80"><defs><radialGradient id="crh-g" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#cc3030" stop-opacity="0.15"/><stop offset="100%" stop-color="#cc3030" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="45" rx="35" ry="35" fill="url(#crh-g)"/><polygon points="40,8 58,24 54,48 26,48 22,24" fill="#280408" stroke="#cc3030" stroke-width="2"/><polygon points="40,14 52,26 48,44 32,44 28,26" fill="#300810" stroke="#aa2020" stroke-width="1" opacity="0.5"/><circle cx="34" cy="28" r="4" fill="#200404"/><circle cx="34" cy="28" r="2.5" fill="#cc3030" opacity="0.9"/><circle cx="34" cy="27" r="1" fill="#ff8080" opacity="0.7"/><circle cx="46" cy="28" r="4" fill="#200404"/><circle cx="46" cy="28" r="2.5" fill="#cc3030" opacity="0.9"/><circle cx="46" cy="27" r="1" fill="#ff8080" opacity="0.7"/><path d="M22 48 Q16 56 20 66 Q26 72 32 68" stroke="#280408" stroke-width="5" fill="none"/><path d="M58 48 Q64 56 60 66 Q54 72 48 68" stroke="#280408" stroke-width="5" fill="none"/><polygon points="10,20 16,12 18,22" fill="#cc3030" opacity="0.4"/><polygon points="70,18 62,10 62,22" fill="#cc3030" opacity="0.4"/></svg>`,

  // ── INFERNO MONSTERS ──────────────────────────────────────────
  jal_nib: `<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="12" fill="#4a2208" stroke="#8a4410" stroke-width="1.5"/><circle cx="36" cy="38" r="2" fill="#0a0402"/><circle cx="36" cy="38" r="1" fill="#e8cc20"/><circle cx="44" cy="38" r="2" fill="#0a0402"/><circle cx="44" cy="38" r="1" fill="#e8cc20"/><path d="M36 46 L38 44 L40 46 L42 44 L44 46" stroke="#e8d0a0" stroke-width="1" fill="none"/><path d="M28 42 L22 50" stroke="#4a2208" stroke-width="3"/><path d="M52 42 L58 50" stroke="#4a2208" stroke-width="3"/><path d="M34 52 L32 60" stroke="#4a2208" stroke-width="2.5"/><path d="M46 52 L48 60" stroke="#4a2208" stroke-width="2.5"/></svg>`,

  jal_mejrah: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="38" rx="14" ry="10" fill="#5a2a08" stroke="#8a4a10" stroke-width="1"/><circle cx="36" cy="36" r="2.5" fill="#0a0402"/><circle cx="36" cy="36" r="1.2" fill="#e8cc20"/><circle cx="44" cy="36" r="2.5" fill="#0a0402"/><circle cx="44" cy="36" r="1.2" fill="#e8cc20"/><path d="M26 32 Q12 20 8 34 Q12 42 26 40" fill="#4a1a06" stroke="#6a3a0a" stroke-width="1" opacity="0.8"/><path d="M54 32 Q68 20 72 34 Q68 42 54 40" fill="#4a1a06" stroke="#6a3a0a" stroke-width="1" opacity="0.8"/><path d="M36 48 L34 56 M44 48 L46 56" stroke="#5a2a08" stroke-width="2"/></svg>`,

  jal_ak: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="45" rx="22" ry="18" fill="#5a3008" stroke="#8a5010" stroke-width="1.5"/><ellipse cx="40" cy="45" rx="15" ry="12" fill="#6a3a0a" opacity="0.5"/><circle cx="34" cy="38" r="4" fill="#0a0402"/><circle cx="34" cy="38" r="2" fill="#e8cc20" opacity="0.9"/><circle cx="46" cy="38" r="4" fill="#0a0402"/><circle cx="46" cy="38" r="2" fill="#e8cc20" opacity="0.9"/><circle cx="30" cy="50" r="3" fill="#8a5010" opacity="0.4"/><circle cx="50" cy="48" r="3.5" fill="#8a5010" opacity="0.4"/></svg>`,

  jal_ak_small: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="48" rx="14" ry="10" fill="#5a3008" stroke="#8a5010" stroke-width="1"/><circle cx="36" cy="44" r="2.5" fill="#0a0402"/><circle cx="36" cy="44" r="1.2" fill="#e8cc20"/><circle cx="44" cy="44" r="2.5" fill="#0a0402"/><circle cx="44" cy="44" r="1.2" fill="#e8cc20"/></svg>`,

  jal_imkot: `<svg viewBox="0 0 80 80"><rect x="18" y="30" width="44" height="34" rx="6" fill="#3a1a08" stroke="#6a3a10" stroke-width="2"/><rect x="22" y="58" width="14" height="18" rx="4" fill="#2a1206" stroke="#5a2a0a" stroke-width="1.5"/><rect x="44" y="58" width="14" height="18" rx="4" fill="#2a1206" stroke="#5a2a0a" stroke-width="1.5"/><rect x="6" y="32" width="16" height="28" rx="7" fill="#2a1206" stroke="#5a2a0a" stroke-width="1.5"/><rect x="58" y="32" width="16" height="28" rx="7" fill="#2a1206" stroke="#5a2a0a" stroke-width="1.5"/><rect x="16" y="10" width="48" height="24" rx="8" fill="#3a1a08" stroke="#6a3a10" stroke-width="2"/><rect x="24" y="16" width="10" height="6" fill="#0a0402"/><rect x="26" y="18" width="6" height="2" fill="#e8cc20" opacity="0.8"/><rect x="46" y="16" width="10" height="6" fill="#0a0402"/><rect x="48" y="18" width="6" height="2" fill="#e8cc20" opacity="0.8"/></svg>`,

  jal_xil: `<svg viewBox="0 0 80 80"><path d="M26 28 Q40 22 54 28 L56 62 Q40 68 24 62Z" fill="#3a1a08" stroke="#8a4a10" stroke-width="1.5"/><rect x="28" y="56" width="10" height="16" rx="3" fill="#2a1206" stroke="#5a2a0a" stroke-width="1"/><rect x="42" y="56" width="10" height="16" rx="3" fill="#2a1206" stroke="#5a2a0a" stroke-width="1"/><circle cx="40" cy="16" r="10" fill="#3a1a08" stroke="#8a4a10" stroke-width="1.5"/><circle cx="36" cy="14" r="2.5" fill="#0a0402"/><circle cx="36" cy="14" r="1.2" fill="#e8cc20" opacity="0.9"/><circle cx="44" cy="14" r="2.5" fill="#0a0402"/><circle cx="44" cy="14" r="1.2" fill="#e8cc20" opacity="0.9"/><rect x="12" y="30" width="12" height="24" rx="5" fill="#2a1206" stroke="#5a2a0a" stroke-width="1"/><rect x="56" y="30" width="12" height="24" rx="5" fill="#2a1206" stroke="#5a2a0a" stroke-width="1"/><path d="M66 42 Q74 32 66 22" stroke="#5a3a1a" stroke-width="2" fill="none"/></svg>`,

  jal_zek: `<svg viewBox="0 0 80 80"><path d="M24 28 Q40 20 56 28 L60 66 Q40 74 20 66Z" fill="#2a0a08" stroke="#c44020" stroke-width="1.5"/><circle cx="40" cy="50" r="6" fill="#0a0204" stroke="#c44020" stroke-width="1.5"/><circle cx="40" cy="50" r="3" fill="#c44020" opacity="0.7"/><circle cx="40" cy="50" r="1.5" fill="#e8cc20"/><circle cx="40" cy="16" r="12" fill="#2a0a08" stroke="#c44020" stroke-width="2"/><circle cx="35" cy="14" r="3" fill="#0a0204"/><circle cx="35" cy="14" r="1.5" fill="#e88030" opacity="0.9"/><circle cx="45" cy="14" r="3" fill="#0a0204"/><circle cx="45" cy="14" r="1.5" fill="#e88030" opacity="0.9"/><path d="M28 6 L24 -2 M40 4 L40 -4 M52 6 L56 -2" stroke="#c44020" stroke-width="2" stroke-linecap="round"/><path d="M18 32 Q8 38 6 50" stroke="#2a0a08" stroke-width="7" fill="none"/><path d="M62 32 Q72 38 74 50" stroke="#2a0a08" stroke-width="7" fill="none"/></svg>`,

  jaltok_jad: `<svg viewBox="0 0 80 80"><defs><radialGradient id="jj-g" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#c44020" stop-opacity="0.2"/><stop offset="100%" stop-color="#c44020" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="45" rx="35" ry="35" fill="url(#jj-g)"/><ellipse cx="40" cy="50" rx="26" ry="18" fill="#3a1208" stroke="#8a3a10" stroke-width="2"/><circle cx="30" cy="28" r="10" fill="#3a1208" stroke="#8a3a10" stroke-width="1.5"/><circle cx="28" cy="26" r="3" fill="#0a0402"/><circle cx="28" cy="26" r="1.5" fill="#e8cc20"/><circle cx="50" cy="28" r="10" fill="#3a1208" stroke="#8a3a10" stroke-width="1.5"/><circle cx="48" cy="26" r="3" fill="#0a0402"/><circle cx="48" cy="26" r="1.5" fill="#e8cc20"/><circle cx="40" cy="22" r="8" fill="#3a1208" stroke="#c44020" stroke-width="2"/><circle cx="38" cy="20" r="2.5" fill="#0a0402"/><circle cx="38" cy="20" r="1.2" fill="#e88030"/><circle cx="42" cy="20" r="2.5" fill="#0a0402"/><circle cx="42" cy="20" r="1.2" fill="#e88030"/><path d="M18 56 L14 70" stroke="#3a1208" stroke-width="5"/><path d="M34 62 L32 74" stroke="#3a1208" stroke-width="4"/><path d="M46 62 L48 74" stroke="#3a1208" stroke-width="4"/><path d="M62 56 L66 70" stroke="#3a1208" stroke-width="5"/></svg>`,

  tzkal_zuk: `<svg viewBox="0 0 80 80"><defs><radialGradient id="zk-g" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="#c44020" stop-opacity="0.3"/><stop offset="100%" stop-color="#c44020" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="42" rx="38" ry="38" fill="url(#zk-g)"/><rect x="8" y="20" width="64" height="48" rx="8" fill="#2a0a04" stroke="#c44020" stroke-width="2.5"/><path d="M8 38 L72 38 M8 52 L72 52" stroke="#6a2010" stroke-width="1" opacity="0.4"/><circle cx="40" cy="44" r="12" fill="#0a0204" stroke="#e88030" stroke-width="2.5"/><circle cx="40" cy="44" r="8" fill="#c44020" opacity="0.8"/><circle cx="40" cy="44" r="4.5" fill="#e8cc20"/><circle cx="40" cy="43" r="2" fill="#fff" opacity="0.8"/><rect x="0" y="24" width="14" height="36" rx="6" fill="#2a0a04" stroke="#8a3010" stroke-width="1.5"/><rect x="66" y="24" width="14" height="36" rx="6" fill="#2a0a04" stroke="#8a3010" stroke-width="1.5"/><path d="M-2 58 L-6 68 M4 60 L2 70 M10 58 L10 68" stroke="#c44020" stroke-width="2.5" stroke-linecap="round"/><path d="M82 58 L86 68 M76 60 L78 70 M70 58 L70 68" stroke="#c44020" stroke-width="2.5" stroke-linecap="round"/><rect x="14" y="4" width="52" height="20" rx="6" fill="#2a0a04" stroke="#c44020" stroke-width="2.5"/><rect x="22" y="10" width="14" height="6" rx="1" fill="#0a0204"/><rect x="24" y="12" width="10" height="2" fill="#e88030" opacity="0.9"/><rect x="44" y="10" width="14" height="6" rx="1" fill="#0a0204"/><rect x="46" y="12" width="10" height="2" fill="#e88030" opacity="0.9"/><path d="M20 4 L16 -4 M30 2 L28 -6 M40 0 L40 -8 M50 2 L52 -6 M60 4 L64 -4" stroke="#c44020" stroke-width="2.5" stroke-linecap="round"/></svg>`,

  // ── SLAYER BOSSES ─────────────────────────────────────────────
  cerberus: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="52" rx="24" ry="14" fill="#2a0808" stroke="#5a1818" stroke-width="1.5"/><circle cx="24" cy="32" r="10" fill="#2a0808" stroke="#5a1818" stroke-width="1.5"/><circle cx="22" cy="30" r="2.5" fill="#0a0202"/><circle cx="22" cy="30" r="1.2" fill="#e8cc20"/><circle cx="27" cy="30" r="2.5" fill="#0a0202"/><circle cx="27" cy="30" r="1.2" fill="#e8cc20"/><circle cx="40" cy="26" r="12" fill="#2a0808" stroke="#8a2828" stroke-width="2"/><circle cx="36" cy="24" r="3" fill="#0a0202"/><circle cx="36" cy="24" r="1.5" fill="#c44040" opacity="0.9"/><circle cx="44" cy="24" r="3" fill="#0a0202"/><circle cx="44" cy="24" r="1.5" fill="#c44040" opacity="0.9"/><circle cx="56" cy="32" r="10" fill="#2a0808" stroke="#5a1818" stroke-width="1.5"/><circle cx="53" cy="30" r="2.5" fill="#0a0202"/><circle cx="53" cy="30" r="1.2" fill="#e8cc20"/><circle cx="58" cy="30" r="2.5" fill="#0a0202"/><circle cx="58" cy="30" r="1.2" fill="#e8cc20"/><path d="M22 62 L18 74" stroke="#2a0808" stroke-width="4"/><path d="M36 64 L34 76" stroke="#2a0808" stroke-width="3.5"/><path d="M46 64 L48 76" stroke="#2a0808" stroke-width="3.5"/><path d="M58 62 L62 74" stroke="#2a0808" stroke-width="4"/><path d="M14 50 Q6 46 8 56" fill="#2a0808"/></svg>`,

  kraken: `<svg viewBox="0 0 80 80"><defs><radialGradient id="kr-g" cx="50%" cy="40%" r="55%"><stop offset="0%" stop-color="#2060a0" stop-opacity="0.2"/><stop offset="100%" stop-color="#2060a0" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="40" rx="30" ry="28" fill="url(#kr-g)"/><ellipse cx="40" cy="35" rx="22" ry="18" fill="#0a1828" stroke="#2060a0" stroke-width="2"/><circle cx="32" cy="30" r="5" fill="#041020"/><circle cx="32" cy="30" r="3" fill="#4a8acc" opacity="0.9"/><circle cx="32" cy="29" r="1.2" fill="#ccf0ff"/><circle cx="48" cy="30" r="5" fill="#041020"/><circle cx="48" cy="30" r="3" fill="#4a8acc" opacity="0.9"/><circle cx="48" cy="29" r="1.2" fill="#ccf0ff"/><path d="M20 50 Q14 58 10 68 Q8 74 14 72" stroke="#0a1828" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M30 52 Q26 60 24 70" stroke="#0a1828" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M50 52 Q54 60 56 70" stroke="#0a1828" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M60 50 Q66 58 70 68 Q72 74 66 72" stroke="#0a1828" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M36 52 Q34 58 36 64" stroke="#0a1828" stroke-width="3" fill="none"/><path d="M44 52 Q46 58 44 64" stroke="#0a1828" stroke-width="3" fill="none"/></svg>`,

  smoke_devil_boss: `<svg viewBox="0 0 80 80"><defs><radialGradient id="sd-g" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#6a8a4a" stop-opacity="0.2"/><stop offset="100%" stop-color="#6a8a4a" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="45" rx="30" ry="30" fill="url(#sd-g)"/><ellipse cx="40" cy="45" rx="24" ry="20" fill="#0a1408" stroke="#4a6a2a" stroke-width="2"/><circle cx="32" cy="38" r="5" fill="#040a02"/><circle cx="32" cy="38" r="3" fill="#8aaa3a" opacity="0.9"/><circle cx="32" cy="37" r="1.2" fill="#ccee60"/><circle cx="48" cy="38" r="5" fill="#040a02"/><circle cx="48" cy="38" r="3" fill="#8aaa3a" opacity="0.9"/><circle cx="48" cy="37" r="1.2" fill="#ccee60"/><path d="M18 48 Q8 52 12 62 Q16 68 22 64" stroke="#0a1408" stroke-width="4" fill="none"/><path d="M62 48 Q72 52 68 62 Q64 68 58 64" stroke="#0a1408" stroke-width="4" fill="none"/><circle cx="14" cy="34" r="3" fill="#4a6a2a" opacity="0.3"/><circle cx="66" cy="32" r="3.5" fill="#4a6a2a" opacity="0.3"/><circle cx="40" cy="30" r="2.5" fill="#8aaa3a" opacity="0.2"/></svg>`,

  abyssal_sire: `<svg viewBox="0 0 80 80"><defs><radialGradient id="as-g" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#5a0a5a" stop-opacity="0.2"/><stop offset="100%" stop-color="#5a0a5a" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="45" rx="32" ry="28" fill="url(#as-g)"/><ellipse cx="40" cy="48" rx="24" ry="16" fill="#1a0a1a" stroke="#5a2060" stroke-width="2"/><circle cx="40" cy="30" r="14" fill="#1a0a1a" stroke="#8a30a0" stroke-width="2"/><circle cx="34" cy="28" r="4" fill="#080408"/><circle cx="34" cy="28" r="2.5" fill="#9b30d0" opacity="0.9"/><circle cx="34" cy="27" r="1" fill="#e0a0ff"/><circle cx="46" cy="28" r="4" fill="#080408"/><circle cx="46" cy="28" r="2.5" fill="#9b30d0" opacity="0.9"/><circle cx="46" cy="27" r="1" fill="#e0a0ff"/><path d="M26 20 Q20 12 14 10" stroke="#5a2060" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M54 20 Q60 12 66 10" stroke="#5a2060" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M18 52 Q8 58 6 68" stroke="#1a0a1a" stroke-width="5" fill="none"/><path d="M62 52 Q72 58 74 68" stroke="#1a0a1a" stroke-width="5" fill="none"/><path d="M30 62 Q26 70 28 76" stroke="#1a0a1a" stroke-width="3" fill="none"/><path d="M50 62 Q54 70 52 76" stroke="#1a0a1a" stroke-width="3" fill="none"/></svg>`,

  grotesque_guardians: `<svg viewBox="0 0 80 80"><rect x="6" y="28" width="30" height="32" rx="4" fill="#2a2828" stroke="#5a5858" stroke-width="1.5"/><rect x="10" y="54" width="10" height="14" rx="3" fill="#222020"/><rect x="22" y="54" width="10" height="14" rx="3" fill="#222020"/><rect x="8" y="12" width="26" height="18" rx="5" fill="#2a2828" stroke="#5a5858" stroke-width="1.5"/><circle cx="16" cy="20" r="3" fill="#0a0808"/><circle cx="16" cy="20" r="1.5" fill="#c9873e" opacity="0.9"/><circle cx="28" cy="20" r="3" fill="#0a0808"/><circle cx="28" cy="20" r="1.5" fill="#c9873e" opacity="0.9"/><path d="M10 12 L8 6 M20 10 L20 4 M30 12 L32 6" stroke="#5a5858" stroke-width="1.5"/><rect x="44" y="24" width="32" height="36" rx="5" fill="#282a28" stroke="#585a58" stroke-width="1.5"/><rect x="48" y="54" width="12" height="16" rx="3" fill="#202220"/><rect x="60" y="54" width="12" height="16" rx="3" fill="#202220"/><rect x="46" y="8" width="28" height="20" rx="5" fill="#282a28" stroke="#585a58" stroke-width="1.5"/><circle cx="54" cy="16" r="3" fill="#080808"/><circle cx="54" cy="16" r="1.5" fill="#4a88cc" opacity="0.9"/><circle cx="66" cy="16" r="3" fill="#080808"/><circle cx="66" cy="16" r="1.5" fill="#4a88cc" opacity="0.9"/><path d="M48 8 L46 2 M60 6 L60 0 M72 8 L74 2" stroke="#585a58" stroke-width="1.5"/></svg>`,

});

console.log('[Ashfall] Content Expansion v9.5 loaded:');
console.log('  Barrows brothers:', Object.keys(BARROWS_BROTHERS).length);
console.log('  Inferno monsters:', ['jal_nib','jal_mejrah','jal_ak','jal_ak_small','jal_imkot','jal_xil','jal_zek','jaltok_jad','tzkal_zuk'].filter(id=>GAME_DATA.monsters[id]).length);
console.log('  Slayer bosses:', GAME_DATA.slayerBosses.length);
console.log('  New art registered:', ['dharok','ahrim','karil','guthan','torag','verac','crystalline_hunllef','corrupted_hunllef','cerberus','kraken','smoke_devil_boss','abyssal_sire','grotesque_guardians','jal_nib','jal_mejrah','jal_ak','jal_imkot','jal_xil','jal_zek','jaltok_jad','tzkal_zuk'].filter(id=>GAME_DATA.monsterArt[id]).length);

// ================================================================
// UI RENDERING — Barrows, Gauntlet, Inferno, Slayer Bosses
// ================================================================

UI.prototype.renderBarrowsPage = function(el) {
  const s = this.engine.state;
  const b = s.barrows;
  const locked = this.engine.getCombatLevel() < GAME_DATA.barrows.levelReq;
  let html = this.header('Barrows','skull','Six brothers. Six crypts. One chest.', null);
  if (locked) { html += `<div class="toa-locked"><div class="toa-lock-title">Requires combat level ${GAME_DATA.barrows.levelReq}</div></div>`; el.innerHTML = html; return; }
  if (b?.active && b.between) {
    // Between brothers — rest state
    const nextBId = GAME_DATA.barrows.brothers[b._nextBrother];
    const nextBoss = BARROWS_BROTHERS[nextBId];
    html += `<div class="toa-raid-screen"><div class="toa-between-overlay"><div class="toa-between-title">Approaching the next crypt...</div><div class="toa-between-boss">${nextBoss?.name||'Unknown'}</div><div class="toa-between-timer">${Math.ceil(b.betweenTimer)}s</div><div class="toa-death-count">Brothers killed: ${b.killed.length}/6</div></div></div>`;
  } else if (b?.active && !b.chestOpen) {
    const bId = GAME_DATA.barrows.brothers[b.brother];
    const boss = BARROWS_BROTHERS[bId];
    const c = s.combat;
    const bossHpPct = Math.max(0, c.monsterHp / boss.hp * 100);
    const playerHpPct = Math.max(0, c.playerHp / this.engine.getMaxHp() * 100);
    html += `<div class="toa-raid-screen">
      <div class="toa-boss-display">
        <div class="toa-boss-art">${GAME_DATA.monsterArt[bId]||''}</div>
        <div class="toa-boss-info-raid">
          <div class="toa-boss-name-raid">${boss.name}</div>
          <div class="toa-boss-hp-bar"><div class="toa-boss-hp-fill" style="width:${bossHpPct}%"></div></div>
          <div class="toa-boss-hp-text">${Math.max(0,c.monsterHp).toLocaleString()} / ${boss.hp.toLocaleString()}</div>
        </div>
      </div>
      <p style="color:#aaa;text-align:center;margin:0.5rem 0;font-size:0.85rem">${boss.desc}</p>
      <div class="toa-player-status">
        <div class="toa-player-hp"><span>HP</span>
          <div class="toa-player-hp-bar"><div class="toa-player-hp-fill" style="width:${playerHpPct}%"></div></div>
          <span>${c.playerHp}/${this.engine.getMaxHp()}</span>
        </div>
      </div>
      <div class="toa-death-count">Brothers killed: ${b.killed.length}/6</div>
      <button class="btn btn-sm btn-danger" onclick="game.leaveBarrows()">Flee</button>
    </div>`;
  } else if (b?.chestOpen) {
    html += `<div class="toa-chest-screen"><div class="toa-chest-title" style="color:#cd7f32">BARROWS CHEST</div><div class="toa-chest-stats"><span>Brothers: ${b.killed.length}/6</span><span>Completions: ${s.stats?.barrowsCompletions||0}</span></div><div class="toa-loot-grid">${b.loot.map(l=>{const it=GAME_DATA.items[l.item];return`<div class="toa-loot-item toa-rarity-${l.rarity}"><div class="toa-loot-icon">${window.renderItemSprite?window.renderItemSprite(l.item,28):'?'}</div><div class="toa-loot-name">${it?.name||l.item}</div><div class="toa-loot-qty">x${l.qty}</div></div>`;}).join('')}</div><button class="btn btn-sm" onclick="game.leaveBarrows()">Leave</button></div>`;
  } else {
    const completions = s.stats?.barrowsCompletions || 0;
    let brotherList = GAME_DATA.barrows.brothers.map(bId => {
      const boss = BARROWS_BROTHERS[bId];
      const kc = s.stats?.bossKills?.[bId] || 0;
      return `<div class="toa-room-preview">
        <span class="toa-room-num" style="text-align:center;padding:4px 0">${GAME_DATA.monsterArt[bId] ? `<div style="width:40px;height:40px;display:inline-block">${GAME_DATA.monsterArt[bId]}</div>` : ''}</span>
        <span class="toa-boss-name">${boss.name}</span>
        <span class="toa-boss-info">Lv${boss.combatLevel} · ${boss.hp.toLocaleString()}HP · ${boss.style}</span>
        <span class="toa-boss-mechanic" style="color:var(--text-dim);font-size:11px">${boss.desc}</span>
      </div>`;
    }).join('');
    html += `<div class="toa-entry-screen">
      <div class="toa-entry-stats">
        <div class="toa-stat"><span class="toa-stat-n">${completions}</span><span class="toa-stat-l">Completions</span></div>
        <div class="toa-stat"><span class="toa-stat-n">6</span><span class="toa-stat-l">Brothers</span></div>
        <div class="toa-stat"><span class="toa-stat-n">Lv60+</span><span class="toa-stat-l">Requirement</span></div>
      </div>
      <div class="toa-rooms-list">${brotherList}</div>
      <div class="toa-unique-preview">
        <div class="toa-unique-title">Barrows Armor Sets</div>
        <p style="color:#aaa;font-size:0.85rem;margin:0.5rem 0">Each brother can drop their helm, platebody, platelegs, and weapon. Kill all 6 for maximum loot rolls.</p>
      </div>
      <div class="toa-entry-warning">Kill all 6 brothers then loot the chest. Each brother adds a 1/24 roll for their set pieces.</div>
      <button class="btn btn-lg toa-enter-btn" onclick="game.startBarrows()">Enter the Barrows</button>
    </div>`;
  }
  el.innerHTML = html;
};

UI.prototype.renderGauntletPage = function(el) {
  const s = this.engine.state;
  const g = s.gauntlet;
  const locked = this.engine.getCombatLevel() < GAME_DATA.gauntlet.levelReq;
  let html = this.header('The Gauntlet','dungeon','Solo challenge. Gather resources. Slay the Hunllef.',null);
  if (locked) { html += `<div class="toa-locked"><div class="toa-lock-title">Requires combat level ${GAME_DATA.gauntlet.levelReq}</div></div>`; el.innerHTML = html; return; }
  if (g?.active && g.prep) {
    html += `<div class="toa-between-overlay">
      <div class="toa-between-title">Gathering Resources...</div>
      <div class="toa-between-timer">${Math.ceil(g.prepTimer)}s</div>
      <div class="toa-between-hint">Crafting weapons and armor from crystalline materials...</div>
      <button class="btn btn-sm btn-danger" style="margin-top:1rem" onclick="game.leaveGauntlet()">Abandon</button>
    </div>`;
  } else if (g?.active && !g.complete) {
    const c = s.combat; const bossId = g.bossId; const boss = GAME_DATA.monsters[bossId];
    const bossHpPct = Math.max(0, c.monsterHp / boss.hp * 100);
    const playerHpPct = Math.max(0, c.playerHp / this.engine.getMaxHp() * 100);
    html += `<div class="toa-raid-screen">
      <div class="toa-boss-display">
        <div class="toa-boss-art">${GAME_DATA.monsterArt[bossId]||''}</div>
        <div class="toa-boss-info-raid">
          <div class="toa-boss-name-raid">${boss.name}</div>
          <div class="toa-boss-hp-bar"><div class="toa-boss-hp-fill" style="width:${bossHpPct}%"></div></div>
          <div class="toa-boss-hp-text">${Math.max(0,c.monsterHp).toLocaleString()} / ${boss.hp.toLocaleString()}</div>
        </div>
      </div>
      <div class="toa-player-status">
        <div class="toa-player-hp"><span>HP</span>
          <div class="toa-player-hp-bar"><div class="toa-player-hp-fill" style="width:${playerHpPct}%"></div></div>
          <span>${c.playerHp}/${this.engine.getMaxHp()}</span>
        </div>
      </div>
      <div class="toa-style-hint">${boss.desc}</div>
      <button class="btn btn-sm btn-danger" onclick="game.leaveGauntlet()">Flee</button>
    </div>`;
  } else if (g?.complete) {
    html += `<div class="toa-chest-screen">
      <div class="toa-chest-title" style="color:#88ccff">${g.corrupted?'CORRUPTED ':''}GAUNTLET COMPLETE</div>
      <div class="toa-loot-grid">${(g.loot||[]).map(l=>{const it=GAME_DATA.items[l.item];return`<div class="toa-loot-item"><div class="toa-loot-icon">${window.renderItemSprite?window.renderItemSprite(l.item,28):'?'}</div><div class="toa-loot-name">${it?.name||l.item}</div><div class="toa-loot-qty">x${l.qty}</div></div>`;}).join('')}</div>
      <button class="btn btn-sm" onclick="game.leaveGauntlet()">Leave</button>
    </div>`;
  } else {
    const completions = s.stats?.gauntletCompletions || 0;
    html += `<div class="toa-entry-screen">
      <div class="toa-entry-stats">
        <div class="toa-stat"><span class="toa-stat-n">${completions}</span><span class="toa-stat-l">Completions</span></div>
        <div class="toa-stat"><span class="toa-stat-n">Lv80+</span><span class="toa-stat-l">Requirement</span></div>
      </div>
      <div class="toa-rooms-list">
        <div class="toa-room-preview">
          <span class="toa-room-num" style="text-align:center">${GAME_DATA.monsterArt.crystalline_hunllef ? `<div style="width:40px;height:40px;display:inline-block">${GAME_DATA.monsterArt.crystalline_hunllef}</div>` : ''}</span>
          <span class="toa-boss-name">Crystalline Hunllef</span>
          <span class="toa-boss-info">25,000 HP · Style-switching boss</span>
        </div>
        <div class="toa-room-preview">
          <span class="toa-room-num" style="text-align:center">${GAME_DATA.monsterArt.corrupted_hunllef ? `<div style="width:40px;height:40px;display:inline-block">${GAME_DATA.monsterArt.corrupted_hunllef}</div>` : ''}</span>
          <span class="toa-boss-name" style="color:#cc3030">Corrupted Hunllef</span>
          <span class="toa-boss-info">40,000 HP · Extreme difficulty · Better loot</span>
        </div>
      </div>
      <div class="toa-unique-preview">
        <div class="toa-unique-title">Unique Drops</div>
        <div class="toa-unique-grid">
          ${['crystal_helm','crystal_body','crystal_legs','bow_of_faerdhinen','enhanced_crystal_weapon_seed','younglief'].map(id => {
            const item = GAME_DATA.items[id]; if (!item) return '';
            return `<div class="toa-unique-item" title="${item.desc||''}"><div class="toa-ui-name">${item.name}</div></div>`;
          }).join('')}
        </div>
      </div>
      <div class="toa-entry-warning">Solo challenge. 15-second prep phase, then fight the Hunllef. Corrupted mode has enhanced rewards.</div>
      <div style="display:flex;gap:8px;justify-content:center;margin-top:1rem">
        <button class="btn btn-lg toa-enter-btn" onclick="game.startGauntlet(false)">Normal Gauntlet</button>
        <button class="btn btn-lg toa-enter-btn" style="border-color:#cc3030" onclick="game.startGauntlet(true)">Corrupted</button>
      </div>
    </div>`;
  }
  el.innerHTML = html;
};

UI.prototype.renderInfernoPage = function(el) {
  const s = this.engine.state;
  const inf = s.inferno;
  const locked = this.engine.getCombatLevel() < GAME_DATA.inferno.levelReq;
  let html = this.header('The Inferno','combat','69 waves. TzKal-Zuk awaits. Earn the Infernal Cape.',null);
  if (locked) { html += `<div class="toa-locked"><div class="toa-lock-title">Requires combat level ${GAME_DATA.inferno.levelReq}</div></div>`; el.innerHTML = html; return; }
  if (inf?.active && !inf.complete) {
    const c = s.combat; const mon = GAME_DATA.monsters[c.monster];
    html += `<div class="toa-raid-screen"><div class="toa-raid-header"><div class="toa-death-count">Wave ${(inf.wave||0)+1}/69</div></div><div class="toa-boss-display"><div class="toa-boss-art">${GAME_DATA.monsterArt[c.monster]||''}</div><div class="toa-boss-info-raid"><div class="toa-boss-name-raid">${mon?.name||'???'}</div><div class="toa-boss-hp-bar"><div class="toa-boss-hp-fill" style="width:${Math.max(0,c.monsterHp/(mon?.hp||1)*100)}%"></div></div><div class="toa-boss-hp-text">${Math.max(0,c.monsterHp).toLocaleString()} / ${(mon?.hp||0).toLocaleString()}</div></div></div><div class="toa-player-status"><div class="toa-player-hp"><span>HP</span><div class="toa-player-hp-bar"><div class="toa-player-hp-fill" style="width:${Math.max(0,c.playerHp/this.engine.getMaxHp()*100)}%"></div></div><span>${c.playerHp}/${this.engine.getMaxHp()}</span></div></div><button class="btn btn-sm btn-danger" onclick="game.leaveInferno()">Flee</button></div>`;
  } else if (inf?.complete) {
    html += `<div class="toa-chest-screen"><div class="toa-chest-title" style="color:#ff6030">INFERNO COMPLETE</div><div class="toa-loot-grid">${(inf.loot||[]).map(l=>{const it=GAME_DATA.items[l.item];return`<div class="toa-loot-item toa-rarity-mythic"><div class="toa-loot-icon">${window.renderItemSprite?window.renderItemSprite(l.item,28):'?'}</div><div class="toa-loot-name">${it?.name||l.item}</div></div>`;}).join('')}</div><button class="btn btn-sm" onclick="game.leaveInferno()">Leave</button></div>`;
  } else {
    html += `<div class="toa-entry-screen"><div class="toa-entry-stats"><div class="toa-stat"><span class="toa-stat-n">${s.stats?.infernoCompletions||0}</span><span class="toa-stat-l">Completions</span></div><div class="toa-stat"><span class="toa-stat-n">69</span><span class="toa-stat-l">Waves</span></div></div><div class="toa-rooms-list"><div class="toa-room-preview"><span class="toa-boss-name">Waves 1–9: Nibblers + Bats</span></div><div class="toa-room-preview"><span class="toa-boss-name">Waves 10–19: Bats + Blobs</span></div><div class="toa-room-preview"><span class="toa-boss-name">Waves 20–34: Blobs + Melee Brutes</span></div><div class="toa-room-preview"><span class="toa-boss-name">Waves 35–49: Brutes + Rangers</span></div><div class="toa-room-preview"><span class="toa-boss-name">Waves 50–61: Rangers + Magers</span></div><div class="toa-room-preview"><span class="toa-boss-name">Waves 62–65: Magers</span></div><div class="toa-room-preview"><span class="toa-boss-name">Waves 66–68: Triple Jad</span></div><div class="toa-room-preview"><span class="toa-boss-name" style="color:#c44020">Wave 69: TzKal-Zuk (20,000 HP)</span></div></div><div class="toa-entry-warning">The hardest PvE content in the game. Reward: Infernal Cape (best-in-slot melee cape).</div><button class="btn btn-lg toa-enter-btn" style="border-color:#c44020" onclick="game.startInferno()">Enter the Inferno</button></div>`;
  }
  el.innerHTML = html;
};

UI.prototype.renderSlayerBossesPage = function(el) {
  const s = this.engine.state;
  const slayerLvl = s.skills.slayer?.level || 1;
  let html = this.header('Slayer Bosses','skull','Boss variants of slayer creatures. Unique drops. Slayer level required.',null);
  html += '<div class="actions-grid">';
  for (const sb of GAME_DATA.slayerBosses) {
    const locked = slayerLvl < sb.slayerReq;
    const mon = GAME_DATA.monsters[sb.id];
    const kc = s.stats?.bossKills?.[sb.id] || 0;
    const drops = mon?.drops?.filter(d => GAME_DATA.items[d.item]).map(d => GAME_DATA.items[d.item].name).join(', ') || '';
    html += `<div class="action-card ${locked?'locked':''}">
      <div class="ac-header"><span class="ac-name">${sb.name}</span><span class="ac-level">Slay Lv ${sb.slayerReq}</span></div>
      <div style="text-align:center;padding:8px 0">${GAME_DATA.monsterArt[sb.id] ? `<div style="width:64px;height:64px;margin:0 auto">${GAME_DATA.monsterArt[sb.id]}</div>` : ''}</div>
      <p class="area-desc">${sb.desc}</p>
      <div class="ac-footer"><span>HP: ${mon?.hp?.toLocaleString()}</span><span>Max Hit: ${mon?.maxHit}</span><span>KC: ${kc}</span></div>
      ${drops ? `<div class="dungeon-rewards" style="font-size:11px;color:var(--text-dim);margin-top:4px">Drops: ${drops}</div>` : ''}
      <button class="btn btn-sm" ${locked?'disabled':''} onclick="game.startCombat('${sb.id}')">Fight</button>
      ${locked?`<div class="locked-overlay">Slayer Lv ${sb.slayerReq}</div>`:''}
    </div>`;
  }
  html += '</div>';
  el.innerHTML = html;
};
