// ================================================================
// ASHFALL IDLE — content/world-tier-2.js
// Massive content expansion:
//   150+ new items: full melee/ranged/magic gear progression
//   10 new quests with full stages and rewards
//   The Void Gauntlet — 100-wave endgame challenge
// ================================================================

(function() {
'use strict';

const _add = (id, data) => { if (!GAME_DATA.items[id]) GAME_DATA.items[id] = Object.assign({id}, data); };
const _recipe = (cat, rec) => { if (!GAME_DATA.recipes[cat]) GAME_DATA.recipes[cat] = []; if (!GAME_DATA.recipes[cat].find(r=>r.id===rec.id)) GAME_DATA.recipes[cat].push(rec); };

// ── MELEE WEAPONS ────────────────────────────────────────────

// Dragon tier
_add('dragon_dagger',    {name:'Dragon Dagger',    type:'weapon',slot:'weapon',style:'melee',attackSpeed:1.8,stats:{attackBonus:40,strengthBonus:38},levelReq:{attack:60},sellPrice:10000,desc:'Rapid poisoned strikes.'});
_add('dragon_longsword', {name:'Dragon Longsword', type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.4,stats:{attackBonus:60,strengthBonus:58},levelReq:{attack:60},sellPrice:25000,desc:'Balanced power and reach.'});
_add('dragon_scimitar',  {name:'Dragon Scimitar',  type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.2,stats:{attackBonus:67,strengthBonus:66},levelReq:{attack:60},sellPrice:55000,desc:'The iconic dragon weapon.'});
_add('dragon_battleaxe', {name:'Dragon Battleaxe', type:'weapon',slot:'weapon',style:'melee',attackSpeed:3.0,stats:{attackBonus:72,strengthBonus:110},levelReq:{attack:60},sellPrice:40000,desc:'Devastating strength bonus.'});
_add('dragon_warhammer', {name:'Dragon Warhammer', type:'weapon',slot:'weapon',style:'melee',attackSpeed:3.2,stats:{attackBonus:55,strengthBonus:120},levelReq:{attack:60},sellPrice:45000,desc:'Crushes armour on hit.'});
_add('dragon_2h',        {name:'Dragon 2H Sword',  type:'weapon',slot:'weapon',style:'melee',attackSpeed:3.2,stats:{attackBonus:90,strengthBonus:108},levelReq:{attack:60},sellPrice:60000,desc:'Two-handed. Maximum reach.'});
_add('dragon_claws',     {name:'Dragon Claws',     type:'weapon',slot:'weapon',style:'melee',attackSpeed:1.8,stats:{attackBonus:41,strengthBonus:56}, levelReq:{attack:60},sellPrice:80000,desc:'Four rapid slashes per cycle.'});
_add('dragon_hasta',     {name:'Dragon Hasta',     type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.4,stats:{attackBonus:85,strengthBonus:85}, levelReq:{attack:60},sellPrice:35000,desc:'Spear-like. Usable with shield.'});

// Shadow tier (level 75)
_add('shadow_blade',     {name:'Shadow Blade',     type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.2,stats:{attackBonus:115,strengthBonus:112},levelReq:{attack:75},sellPrice:0,desc:'Ignores 10% of enemy defence.'});
_add('shadow_scythe',    {name:'Shadow Scythe',    type:'weapon',slot:'weapon',style:'melee',attackSpeed:3.4,stats:{attackBonus:130,strengthBonus:135},levelReq:{attack:75},sellPrice:0,desc:'+25% damage vs undead.'});
_add('shadow_fang',      {name:'Shadow Fang',      type:'weapon',slot:'weapon',style:'melee',attackSpeed:1.6,stats:{attackBonus:70,strengthBonus:95},  levelReq:{attack:75},sellPrice:0,desc:'Guaranteed poison on every hit.'});
_add('shadow_katana',    {name:'Shadow Katana',    type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.0,stats:{attackBonus:105,strengthBonus:98}, levelReq:{attack:75},sellPrice:0,desc:'Precise cuts that never miss.'});

// Celestial tier (level 85)
_add('celestial_blade',  {name:'Celestial Blade',  type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.4,stats:{attackBonus:150,strengthBonus:148},levelReq:{attack:85},sellPrice:0,desc:'Undead take 50% more damage.'});
_add('celestial_lance',  {name:'Celestial Lance',  type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.8,stats:{attackBonus:160,strengthBonus:155},levelReq:{attack:85},sellPrice:0,desc:'Pierces all forms of armour.'});
_add('celestial_halberd',{name:'Celestial Halberd',type:'weapon',slot:'weapon',style:'melee',attackSpeed:3.0,stats:{attackBonus:155,strengthBonus:162},levelReq:{attack:85},sellPrice:0,desc:'Cleaves through multiple targets.'});

// Void-touched (level 80, from Void Gauntlet)
_add('void_sword',       {name:"Void Knight's Sword",type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.2,stats:{attackBonus:108,strengthBonus:105},levelReq:{attack:80},sellPrice:0,desc:'Restores 10 mana per hit.'});
_add('void_maul',        {name:'Void Maul',          type:'weapon',slot:'weapon',style:'melee',attackSpeed:3.0,stats:{attackBonus:100,strengthBonus:140},levelReq:{attack:80},sellPrice:0,desc:'Ignores 30% of enemy defence.'});

// ── MELEE ARMOUR ─────────────────────────────────────────────

// Dragon
_add('dragon_helm',       {name:'Dragon Helm',       type:'armor',slot:'head',  stats:{defenceBonus:33,attackBonus:3,strengthBonus:3},  levelReq:{defence:60},sellPrice:30000});
_add('dragon_platebody',  {name:'Dragon Platebody',  type:'armor',slot:'body',  stats:{defenceBonus:72,attackBonus:8,strengthBonus:8},  levelReq:{defence:60},sellPrice:150000});
_add('dragon_platelegs',  {name:'Dragon Platelegs',  type:'armor',slot:'legs',  stats:{defenceBonus:58,attackBonus:5,strengthBonus:5},  levelReq:{defence:60},sellPrice:100000});
_add('dragon_gloves',     {name:'Dragon Gloves',     type:'armor',slot:'gloves',stats:{defenceBonus:12,attackBonus:9,strengthBonus:9},  levelReq:{defence:60},sellPrice:20000});
_add('dragon_boots',      {name:'Dragon Boots',      type:'armor',slot:'boots', stats:{defenceBonus:16,strengthBonus:4},                levelReq:{defence:60},sellPrice:15000});
_add('dragon_shield',     {name:'Dragon Shield',     type:'armor',slot:'shield',stats:{defenceBonus:48,magicBonus:-5},                 levelReq:{defence:60},sellPrice:45000});

// Shadow
_add('shadow_helm',       {name:'Shadow Helm',       type:'armor',slot:'head',  stats:{defenceBonus:40,magicBonus:5,damageReduction:2}, levelReq:{defence:70},sellPrice:0});
_add('shadow_platebody',  {name:'Shadow Platebody',  type:'armor',slot:'body',  stats:{defenceBonus:88,magicBonus:10,damageReduction:5},levelReq:{defence:70},sellPrice:0});
_add('shadow_platelegs',  {name:'Shadow Platelegs',  type:'armor',slot:'legs',  stats:{defenceBonus:70,magicBonus:7,damageReduction:3}, levelReq:{defence:70},sellPrice:0});
_add('shadow_gloves',     {name:'Shadow Gloves',     type:'armor',slot:'gloves',stats:{defenceBonus:15,attackBonus:12,strengthBonus:12},levelReq:{defence:70},sellPrice:0});
_add('shadow_boots',      {name:'Shadow Boots',      type:'armor',slot:'boots', stats:{defenceBonus:20,attackBonus:5},                 levelReq:{defence:70},sellPrice:0});
_add('shadow_shield',     {name:'Shadow Shield',     type:'armor',slot:'shield',stats:{defenceBonus:60,magicBonus:5,damageReduction:3},levelReq:{defence:70},sellPrice:0});

// Celestial
_add('celestial_helm',    {name:'Celestial Helm',    type:'armor',slot:'head',  stats:{defenceBonus:52,magicBonus:8,strengthBonus:6,damageReduction:3},  levelReq:{defence:80},sellPrice:0,desc:'Prayer drain -20%.'});
_add('celestial_body',    {name:'Celestial Body',    type:'armor',slot:'body',  stats:{defenceBonus:115,magicBonus:15,strengthBonus:12,damageReduction:9},levelReq:{defence:80},sellPrice:0});
_add('celestial_legs',    {name:'Celestial Legs',    type:'armor',slot:'legs',  stats:{defenceBonus:90,magicBonus:12,strengthBonus:10,damageReduction:7}, levelReq:{defence:80},sellPrice:0});
_add('celestial_gloves',  {name:'Celestial Gloves',  type:'armor',slot:'gloves',stats:{defenceBonus:20,attackBonus:15,strengthBonus:15,rangedBonus:15,magicBonus:15},levelReq:{defence:80},sellPrice:0,desc:'Boost all combat styles.'});
_add('celestial_boots',   {name:'Celestial Boots',   type:'armor',slot:'boots', stats:{defenceBonus:25,strengthBonus:8},                                 levelReq:{defence:80},sellPrice:0});

// ── RANGED WEAPONS ────────────────────────────────────────────

// Shortbows
_add('shortbow',          {name:'Shortbow',          type:'weapon',slot:'weapon',style:'ranged',attackSpeed:1.8,stats:{rangedBonus:8},  levelReq:{ranged:1}, sellPrice:50});
_add('oak_shortbow',      {name:'Oak Shortbow',      type:'weapon',slot:'weapon',style:'ranged',attackSpeed:1.8,stats:{rangedBonus:14}, levelReq:{ranged:5}, sellPrice:200});
_add('willow_shortbow',   {name:'Willow Shortbow',   type:'weapon',slot:'weapon',style:'ranged',attackSpeed:1.8,stats:{rangedBonus:20}, levelReq:{ranged:20},sellPrice:800});
_add('maple_shortbow',    {name:'Maple Shortbow',    type:'weapon',slot:'weapon',style:'ranged',attackSpeed:1.8,stats:{rangedBonus:29}, levelReq:{ranged:30},sellPrice:2000});
_add('yew_shortbow',      {name:'Yew Shortbow',      type:'weapon',slot:'weapon',style:'ranged',attackSpeed:1.8,stats:{rangedBonus:40}, levelReq:{ranged:40},sellPrice:8000});
_add('magic_shortbow',    {name:'Magic Shortbow',    type:'weapon',slot:'weapon',style:'ranged',attackSpeed:1.6,stats:{rangedBonus:55}, levelReq:{ranged:50},sellPrice:25000});
_add('elder_bow',         {name:'Elder Bow',         type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.2,stats:{rangedBonus:75}, levelReq:{ranged:60},sellPrice:80000});

// Longbows
_add('longbow',           {name:'Longbow',           type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.4,stats:{rangedBonus:12}, levelReq:{ranged:1}, sellPrice:80});
_add('oak_longbow',       {name:'Oak Longbow',       type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.4,stats:{rangedBonus:19}, levelReq:{ranged:5}, sellPrice:350});
_add('willow_longbow',    {name:'Willow Longbow',    type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.4,stats:{rangedBonus:28}, levelReq:{ranged:20},sellPrice:1200});
_add('maple_longbow',     {name:'Maple Longbow',     type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.4,stats:{rangedBonus:38}, levelReq:{ranged:30},sellPrice:3500});
_add('yew_longbow',       {name:'Yew Longbow',       type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.4,stats:{rangedBonus:50}, levelReq:{ranged:40},sellPrice:12000});
_add('magic_longbow',     {name:'Magic Longbow',     type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.4,stats:{rangedBonus:65}, levelReq:{ranged:50},sellPrice:35000});

// Crossbows
_add('bronze_crossbow',   {name:'Bronze Crossbow',   type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.8,stats:{rangedBonus:10}, levelReq:{ranged:1}, sellPrice:150});
_add('iron_crossbow',     {name:'Iron Crossbow',     type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.8,stats:{rangedBonus:18}, levelReq:{ranged:10},sellPrice:500});
_add('steel_crossbow',    {name:'Steel Crossbow',    type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.8,stats:{rangedBonus:28}, levelReq:{ranged:20},sellPrice:1500});
_add('mithril_crossbow',  {name:'Mithril Crossbow',  type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.8,stats:{rangedBonus:40}, levelReq:{ranged:30},sellPrice:5000});
_add('adamant_crossbow',  {name:'Adamant Crossbow',  type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.8,stats:{rangedBonus:55}, levelReq:{ranged:40},sellPrice:15000});
_add('rune_crossbow',     {name:'Rune Crossbow',     type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.8,stats:{rangedBonus:70}, levelReq:{ranged:50},sellPrice:40000});
_add('dragon_crossbow',   {name:'Dragon Crossbow',   type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.6,stats:{rangedBonus:90}, levelReq:{ranged:60},sellPrice:120000});
_add('void_crossbow',     {name:'Void Crossbow',     type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.4,stats:{rangedBonus:110},levelReq:{ranged:70},sellPrice:0,desc:'Ignores 15% of defence.'});
_add('twisted_bow',       {name:'Twisted Bow',       type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.4,stats:{rangedBonus:140},levelReq:{ranged:75},sellPrice:0,desc:'Damage scales with enemy magic level.'});
_add('echo_bow',          {name:'Echo Bow',          type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.0,stats:{rangedBonus:125},levelReq:{ranged:80},sellPrice:0,desc:'Each arrow echoes, hitting twice at 60%.'});

// Ammunition
const _ammo = [
  ['bronze_dart',1,1,2],['iron_dart',3,10,5],['steel_dart',5,20,12],['mithril_dart',8,30,25],
  ['adamant_dart',11,40,50],['rune_dart',14,50,100],['dragon_dart',20,60,300],
  ['bronze_bolt',2,1,3],['iron_bolt',4,10,8],['steel_bolt',7,20,18],['mithril_bolt',10,30,35],
  ['adamant_bolt',14,40,65],['rune_bolt',18,50,130],['dragon_bolt',25,60,400],
  ['onyx_bolt',30,70,1200],['void_bolt',35,80,2500],
];
for (const [id,rb,lr,sell] of _ammo) {
  const name = id.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
  _add(id, {name, type:'ammo', stackable:true, stats:{rangedBonus:rb}, levelReq:{ranged:lr}, sellPrice:sell});
}

// ── RANGED ARMOUR ─────────────────────────────────────────────

_add('studded_coif',      {name:'Studded Coif',      type:'armor',slot:'head',  stats:{rangedBonus:12,defenceBonus:12},levelReq:{ranged:20,defence:20},sellPrice:500});
_add('studded_body',      {name:'Studded Leather',   type:'armor',slot:'body',  stats:{rangedBonus:20,defenceBonus:22},levelReq:{ranged:20,defence:20},sellPrice:1500});
_add('studded_chaps',     {name:'Studded Chaps',     type:'armor',slot:'legs',  stats:{rangedBonus:15,defenceBonus:16},levelReq:{ranged:20,defence:20},sellPrice:1000});

// Dragonhide sets
for (const [pre,nm,lvl,sell,rb,db] of [
  ['green_d','Green Dragonhide',40,8000,26,28],
  ['blue_d','Blue Dragonhide',50,18000,34,40],
  ['red_d','Red Dragonhide',60,40000,45,55],
  ['black_d','Black Dragonhide',70,80000,55,72],
]) {
  _add(pre+'_coif',   {name:nm+' Coif',  type:'armor',slot:'head',  stats:{rangedBonus:rb-10,defenceBonus:db-10,magicBonus:-5}, levelReq:{ranged:lvl,defence:lvl},sellPrice:Math.floor(sell*0.2)});
  _add(pre+'_body',   {name:nm+' Body',  type:'armor',slot:'body',  stats:{rangedBonus:rb,   defenceBonus:db,   magicBonus:-10},levelReq:{ranged:lvl,defence:lvl},sellPrice:sell});
  _add(pre+'_chaps',  {name:nm+' Chaps', type:'armor',slot:'legs',  stats:{rangedBonus:rb-5, defenceBonus:db-8, magicBonus:-7}, levelReq:{ranged:lvl,defence:lvl},sellPrice:Math.floor(sell*0.7)});
  _add(pre+'_gloves', {name:nm+' Gloves',type:'armor',slot:'gloves',stats:{rangedBonus:rb-15,defenceBonus:db-18,magicBonus:-3},levelReq:{ranged:lvl,defence:lvl},sellPrice:Math.floor(sell*0.15)});
  _add(pre+'_boots',  {name:nm+' Boots', type:'armor',slot:'boots', stats:{rangedBonus:rb-14,defenceBonus:db-15},               levelReq:{ranged:lvl,defence:lvl},sellPrice:Math.floor(sell*0.12)});
}

// Armadyl
_add('armadyl_helm',      {name:'Armadyl Helm',          type:'armor',slot:'head',  stats:{rangedBonus:10,defenceBonus:8,magicBonus:8},    levelReq:{ranged:70,defence:70},sellPrice:0});
_add('armadyl_body',      {name:'Armadyl Chestplate',    type:'armor',slot:'body',  stats:{rangedBonus:33,defenceBonus:65,magicBonus:15},   levelReq:{ranged:70,defence:70},sellPrice:0});
_add('armadyl_legs',      {name:'Armadyl Chainskirt',    type:'armor',slot:'legs',  stats:{rangedBonus:20,defenceBonus:50,magicBonus:12},   levelReq:{ranged:70,defence:70},sellPrice:0});

// Shadow ranger
_add('shadow_ranger_helm',{name:'Shadow Ranger Helm',    type:'armor',slot:'head',  stats:{rangedBonus:18,defenceBonus:14,magicBonus:6},    levelReq:{ranged:80},sellPrice:0});
_add('shadow_ranger_body',{name:'Shadow Ranger Leather', type:'armor',slot:'body',  stats:{rangedBonus:45,defenceBonus:40,magicBonus:12},   levelReq:{ranged:80},sellPrice:0});
_add('shadow_ranger_legs',{name:'Shadow Ranger Chaps',   type:'armor',slot:'legs',  stats:{rangedBonus:32,defenceBonus:30,magicBonus:8},    levelReq:{ranged:80},sellPrice:0});

// ── MAGIC WEAPONS ─────────────────────────────────────────────

for (const [id,nm,lvl,mgb,sell,desc] of [
  ['air_staff',   'Staff of Air',     1,  10, 200,   'Infinite air runes.'],
  ['water_staff', 'Staff of Water',   5,  12, 400,   'Infinite water runes.'],
  ['earth_staff', 'Staff of Earth',   15, 16, 800,   'Infinite earth runes.'],
  ['fire_staff',  'Staff of Fire',    25, 22, 2000,  'Infinite fire runes.'],
  ['ice_staff',   'Staff of Ice',     35, 30, 6000,  'Freezes enemies on hit (10% chance).'],
  ['smoke_staff', 'Smoke Staff',      45, 40, 15000, 'Poisons on hit. Air+Fire runes.'],
  ['lava_staff',  'Lava Staff',       55, 52, 30000, 'Burns on hit. Earth+Fire runes.'],
  ['shadow_staff','Shadow Staff',     65, 65, 0,     'Drains enemy magic each hit.'],
  ['steam_staff', 'Steam Battlestaff',50, 45, 20000, 'Water+Fire runes. Versatile.'],
  ['celestial_staff','Celestial Staff',80,95, 0,     '+20% to all spell damage.'],
]) {
  _add(id, {name:nm, type:'weapon',slot:'weapon',style:'magic',attackSpeed:2.4,stats:{magicBonus:mgb},levelReq:{magic:lvl},sellPrice:sell,desc});
}

_add('wand_standard',     {name:'Standard Wand',    type:'weapon',slot:'weapon',style:'magic',attackSpeed:2.0,stats:{magicBonus:20},levelReq:{magic:20},sellPrice:3000});
_add('wand_master',       {name:'Master Wand',      type:'weapon',slot:'weapon',style:'magic',attackSpeed:2.0,stats:{magicBonus:42},levelReq:{magic:50},sellPrice:35000});
_add('wand_elder',        {name:'Elder Wand',       type:'weapon',slot:'weapon',style:'magic',attackSpeed:2.0,stats:{magicBonus:68},levelReq:{magic:65},sellPrice:0});
_add('void_wand',         {name:'Void Wand',        type:'weapon',slot:'weapon',style:'magic',attackSpeed:1.8,stats:{magicBonus:85},levelReq:{magic:75},sellPrice:0,desc:'Each hit restores 5 mana.'});
_add('trident_swamp',     {name:'Trident of the Swamp',type:'weapon',slot:'weapon',style:'magic',attackSpeed:2.2,stats:{magicBonus:78},levelReq:{magic:75},sellPrice:0,desc:'Auto-casts Slime Burst. Poisons on hit.'});
_add('nightmare_staff',   {name:'Nightmare Staff',  type:'weapon',slot:'weapon',style:'magic',attackSpeed:2.4,stats:{magicBonus:88},levelReq:{magic:72},sellPrice:0,desc:'Three powerful specs. Drains enemy stats.'});

// ── MAGIC ARMOUR ──────────────────────────────────────────────

// Wizard
_add('wizard_hat',        {name:'Wizard Hat',          type:'armor',slot:'head', stats:{magicBonus:8, defenceBonus:0},levelReq:{magic:1}, sellPrice:80});
_add('wizard_robe',       {name:'Wizard Robe',         type:'armor',slot:'body', stats:{magicBonus:15,defenceBonus:0},levelReq:{magic:1}, sellPrice:250});
_add('wizard_robe_skirt', {name:'Wizard Robe Skirt',   type:'armor',slot:'legs', stats:{magicBonus:10,defenceBonus:0},levelReq:{magic:1}, sellPrice:180});
_add('wizard_boots',      {name:'Wizard Boots',        type:'armor',slot:'boots',stats:{magicBonus:4, defenceBonus:0},levelReq:{magic:1}, sellPrice:100});

// Mystic
_add('mystic_hat',        {name:'Mystic Hat',          type:'armor',slot:'head', stats:{magicBonus:14,defenceBonus:8}, levelReq:{magic:25},sellPrice:2500});
_add('mystic_robe',       {name:'Mystic Robe Top',     type:'armor',slot:'body', stats:{magicBonus:28,defenceBonus:18},levelReq:{magic:25},sellPrice:8000});
_add('mystic_robe_bot',   {name:'Mystic Robe Bottom',  type:'armor',slot:'legs', stats:{magicBonus:20,defenceBonus:14},levelReq:{magic:25},sellPrice:5000});
_add('mystic_gloves',     {name:'Mystic Gloves',       type:'armor',slot:'gloves',stats:{magicBonus:10,defenceBonus:8},levelReq:{magic:25},sellPrice:2000});
_add('mystic_boots',      {name:'Mystic Boots',        type:'armor',slot:'boots',stats:{magicBonus:8, defenceBonus:6},levelReq:{magic:25},sellPrice:1500});

// Archmage (level 60)
_add('archmage_hat',      {name:'Archmage Hat',        type:'armor',slot:'head', stats:{magicBonus:22,defenceBonus:14},levelReq:{magic:60},sellPrice:25000});
_add('archmage_robe',     {name:'Archmage Robe',       type:'armor',slot:'body', stats:{magicBonus:45,defenceBonus:28},levelReq:{magic:60},sellPrice:80000});
_add('archmage_legs',     {name:'Archmage Legwear',    type:'armor',slot:'legs', stats:{magicBonus:32,defenceBonus:20},levelReq:{magic:60},sellPrice:55000});

// Shadow mage (level 75)
_add('shadow_hood',       {name:'Shadow Hood',         type:'armor',slot:'head', stats:{magicBonus:30,defenceBonus:18,damageReduction:2},levelReq:{magic:75},sellPrice:0});
_add('shadow_robe_top',   {name:'Shadow Robe Top',     type:'armor',slot:'body', stats:{magicBonus:60,defenceBonus:35,damageReduction:5},levelReq:{magic:75},sellPrice:0});
_add('shadow_robe_bot',   {name:'Shadow Robe Bottom',  type:'armor',slot:'legs', stats:{magicBonus:45,defenceBonus:28,damageReduction:3},levelReq:{magic:75},sellPrice:0});
_add('shadow_mage_gloves',{name:'Shadow Mage Gloves',  type:'armor',slot:'gloves',stats:{magicBonus:20,defenceBonus:12},levelReq:{magic:75},sellPrice:0});
_add('shadow_mage_boots', {name:'Shadow Mage Boots',   type:'armor',slot:'boots',stats:{magicBonus:14,defenceBonus:10},levelReq:{magic:75},sellPrice:0});

// Celestial mage (level 85)
_add('celestial_hood',    {name:'Celestial Hood',      type:'armor',slot:'head', stats:{magicBonus:38,defenceBonus:24,damageReduction:3},levelReq:{magic:85},sellPrice:0});
_add('celestial_robe',    {name:'Celestial Robe',      type:'armor',slot:'body', stats:{magicBonus:78,defenceBonus:50,damageReduction:8},levelReq:{magic:85},sellPrice:0});
_add('celestial_skirt',   {name:'Celestial Skirt',     type:'armor',slot:'legs', stats:{magicBonus:58,defenceBonus:38,damageReduction:6},levelReq:{magic:85},sellPrice:0});

// Ancestral (level 90 — best magic)
_add('ancestral_hat',     {name:'Ancestral Hat',       type:'armor',slot:'head', stats:{magicBonus:42,defenceBonus:26,damageReduction:4},levelReq:{magic:90,defence:70},sellPrice:0,desc:'+2% spell damage per piece.'});
_add('ancestral_robe',    {name:'Ancestral Robe Top',  type:'armor',slot:'body', stats:{magicBonus:88,defenceBonus:55,damageReduction:9},levelReq:{magic:90,defence:70},sellPrice:0});
_add('ancestral_legs',    {name:'Ancestral Robe Bot',  type:'armor',slot:'legs', stats:{magicBonus:65,defenceBonus:42,damageReduction:7},levelReq:{magic:90,defence:70},sellPrice:0});

// ── ACCESSORIES ───────────────────────────────────────────────

_add('berserker_ring',    {name:'Berserker Ring',      type:'armor',slot:'ring', stats:{strengthBonus:8},                           levelReq:{},sellPrice:0,desc:'Best melee ring.'});
_add('archers_ring',      {name:"Archer's Ring",       type:'armor',slot:'ring', stats:{rangedBonus:8},                            levelReq:{},sellPrice:0,desc:'Best ranged ring.'});
_add('seers_ring',        {name:"Seer's Ring",         type:'armor',slot:'ring', stats:{magicBonus:8},                             levelReq:{},sellPrice:0,desc:'Best magic ring.'});
_add('ring_of_death',     {name:'Ring of Death',       type:'armor',slot:'ring', stats:{attackBonus:5,strengthBonus:5,defenceBonus:5},levelReq:{},sellPrice:0,desc:'On death: saved once. Then crumbles.'});
_add('void_ring',         {name:'Void Ring',           type:'armor',slot:'ring', stats:{attackBonus:6,rangedBonus:6,magicBonus:6},  levelReq:{},sellPrice:0,desc:'All combat styles boosted.'});
_add('amulet_of_torture', {name:'Amulet of Torture',  type:'armor',slot:'amulet',stats:{attackBonus:10,strengthBonus:10},          levelReq:{},sellPrice:0,desc:'Best melee amulet.'});
_add('amulet_of_anguish', {name:'Amulet of Anguish',  type:'armor',slot:'amulet',stats:{rangedBonus:10,attackBonus:5},             levelReq:{},sellPrice:0,desc:'Best ranged amulet.'});
_add('amulet_of_fury',    {name:'Amulet of Fury',     type:'armor',slot:'amulet',stats:{attackBonus:8,strengthBonus:8,defenceBonus:8,magicBonus:8},levelReq:{},sellPrice:0,desc:'All-round excellent.'});
_add('occult_necklace',   {name:'Occult Necklace',    type:'armor',slot:'amulet',stats:{magicBonus:12},                           levelReq:{},sellPrice:0,desc:'+10% spell damage. Best magic amulet.'});
_add('ava_device',        {name:"Ava's Device",       type:'armor',slot:'cape', stats:{rangedBonus:8,defenceBonus:2},              levelReq:{},sellPrice:0,desc:'Attracts ammunition back.'});

// ── CRAFTING MATERIALS ────────────────────────────────────────

_add('shadow_ore',        {name:'Shadow Ore',         type:'resource',subtype:'ore', sellPrice:3000,desc:'Ore from the shadow realm.'});
_add('shadow_bar',        {name:'Shadow Bar',         type:'resource',subtype:'bar', sellPrice:5000,desc:'Absorbs light.'});
_add('celestial_ingot',   {name:'Celestial Ingot',    type:'resource',subtype:'bar', sellPrice:8000,desc:'Blessed metal. Glows faintly.'});
_add('dragon_hide',       {name:'Dragon Hide',        type:'resource',subtype:'hide',sellPrice:800, desc:'Tough dragon hide.'});
_add('dragon_leather',    {name:'Dragon Leather',     type:'resource',subtype:'hide',sellPrice:2000,desc:'Treated dragonhide for armour.'});
_add('void_essence',      {name:'Void Essence',       type:'resource',subtype:'misc',sellPrice:5000,desc:'Pure void energy. Elite crafting.'});
_add('hard_leather',      {name:'Hard Leather',       type:'resource',subtype:'hide',sellPrice:150, desc:'Toughened leather.'});
_add('enchant_dust',      {name:'Enchant Dust',       type:'resource',subtype:'misc',sellPrice:200, desc:'Required for many elite recipes.'});

// ── 10 NEW QUESTS ─────────────────────────────────────────────

if (!Array.isArray(GAME_DATA.quests)) GAME_DATA.quests = [];

const _newQ = [
  {
    id:'void_contract', name:'The Void Contract', type:'chain', npcId:'grey', qp:3, difficulty:'Elite',
    prereqs:['lost_city'],
    desc:'A void sage warns of a fracture in reality. Investigate before it is too late.',
    objectives:[
      {type:'kill',monster:'void_walker',qty:20,desc:'Slay 20 Void Walkers'},
      {type:'kill',monster:'void_titan',qty:5,desc:'Defeat 5 Void Titans'},
      {type:'gather',item:'void_crystal',qty:3,desc:'Collect 3 Void Crystals'},
    ],
    rewards:{xp:{magic:15000,attack:10000},items:[{item:'void_crystal',qty:5},{item:'wrath_rune',qty:50}],qp:3},
  },
  {
    id:'blood_moon_rising', name:'Blood Moon Rising', type:'chain', npcId:'dorn', qp:2, difficulty:'Hard',
    prereqs:[],
    desc:'On the night of the blood moon, demons surge through in greater numbers. Help seal the rift.',
    objectives:[
      {type:'kill',monster:'lesser_demon',qty:30,desc:'Slay 30 Lesser Demons'},
      {type:'kill',monster:'demon',qty:15,desc:'Slay 15 Demons'},
      {type:'kill',monster:'demon_lord',qty:1,desc:'Defeat the Demon Lord'},
    ],
    rewards:{xp:{attack:12000,strength:12000,defence:8000},items:[{item:'infernal_bar',qty:5},{item:'dragon_longsword',qty:1}],qp:2},
  },
  {
    id:'ashen_chronicle', name:'The Ashen Chronicle', type:'chain', npcId:'vex', qp:2, difficulty:'Medium',
    prereqs:['lost_expedition'],
    desc:'Collect ancient lore tablets to unlock the Chronicle of the First Ash.',
    objectives:[
      {type:'gather',item:'ash_rune',qty:50,desc:'Collect 50 Ash Runes'},
      {type:'kill',monster:'ash_golem',qty:20,desc:'Destroy 20 Ash Golems'},
      {type:'kill',monster:'elder_ash_golem',qty:3,desc:'Destroy 3 Elder Ash Golems'},
    ],
    rewards:{xp:{mining:8000,magic:10000,runecrafting:5000},items:[{item:'ash_rune',qty:200},{item:'elder_core',qty:1}],qp:2},
  },
  {
    id:'titans_trial', name:"Titan's Trial", type:'chain', npcId:'dorn', qp:4, difficulty:'Master',
    prereqs:['void_contract'],
    desc:"The Ash Titans have awoken. Defeat three and claim the Titan's Mark.",
    objectives:[
      {type:'kill',monster:'ash_titan',qty:3,desc:'Defeat 3 Ash Titans'},
      {type:'gather',item:'titan_shard',qty:3,desc:'Collect 3 Titan Shards'},
    ],
    rewards:{xp:{attack:25000,strength:25000,hitpoints:15000},items:[{item:'titan_shard',qty:5},{item:'celestial_ingot',qty:1}],qp:4},
  },
  {
    id:'frozen_in_time', name:'Frozen in Time', type:'chain', npcId:'grey', qp:2, difficulty:'Hard',
    prereqs:[],
    desc:'A ranger has been frozen in magical ice for decades. Find a way to free them.',
    objectives:[
      {type:'kill',monster:'frost_wraith',qty:20,desc:'Clear 20 Frost Wraiths'},
      {type:'gather',item:'wrath_rune',qty:10,desc:'Collect 10 Wrath Runes for the dispel'},
      {type:'kill',monster:'frost_drake',qty:5,desc:'Defeat 5 Frost Drakes'},
    ],
    rewards:{xp:{magic:12000,ranged:10000},items:[{item:'twisted_bow',qty:1}],qp:2},
  },
  {
    id:'lost_legion', name:'The Lost Legion', type:'chain', npcId:'dorn', qp:2, difficulty:'Medium',
    prereqs:['goblin_problem'],
    desc:"An entire legion vanished in the Shadow Realm. Their spirits are restless.",
    objectives:[
      {type:'kill',monster:'shadow_beast',qty:25,desc:'Destroy 25 Shadow Beasts'},
      {type:'kill',monster:'shadow_archer',qty:15,desc:'Destroy 15 Shadow Archers'},
    ],
    rewards:{xp:{attack:8000,strength:8000,defence:8000},items:[{item:'shadow_blade',qty:1}],qp:2},
  },
  {
    id:'champions_gauntlet', name:"Champion's Gauntlet", type:'chain', npcId:'vex', qp:3, difficulty:'Elite',
    prereqs:['blood_moon_rising','frozen_in_time'],
    desc:'Prove mastery of all three combat styles before the Grand Tournament.',
    objectives:[
      {type:'skill_level',skill:'attack',level:70,qty:1,desc:'Reach level 70 Attack'},
      {type:'skill_level',skill:'ranged',level:70,qty:1,desc:'Reach level 70 Ranged'},
      {type:'skill_level',skill:'magic',level:70,qty:1,desc:'Reach level 70 Magic'},
    ],
    rewards:{xp:{attack:20000,ranged:20000,magic:20000},items:[{item:'void_ring',qty:1},{item:'celestial_helm',qty:1}],qp:3},
  },
  {
    id:'merchant_secret', name:"The Merchant's Secret", type:'chain', npcId:'grey', qp:1, difficulty:'Easy',
    prereqs:[],
    desc:'A merchant vanished on the road. Their cargo of rare materials could be dangerous.',
    objectives:[
      {type:'kill',monster:'bandit',qty:10,desc:'Clear 10 bandits from the road'},
      {type:'gather',item:'gold_bar',qty:5,desc:'Pay the toll to open the crate'},
    ],
    rewards:{xp:{thieving:3000,attack:2000},items:[{item:'enchant_dust',qty:20},{item:'void_essence',qty:1}],qp:1},
  },
  {
    id:'void_emperors_warning', name:"Void Emperor's Warning", type:'chain', npcId:'vex', qp:4, difficulty:'Master',
    prereqs:['titans_trial','ashen_chronicle'],
    desc:'The Void Emperor sends a fragment of themselves as a warning. Prepare for the final battle.',
    objectives:[
      {type:'kill',monster:'void_emperor_spawn',qty:10,desc:"Destroy 10 Void Emperor's Spawns"},
      {type:'gather',item:'void_crystal',qty:10,desc:'Collect 10 Void Crystals for the ward ritual'},
      {type:'skill_level',skill:'magic',level:80,qty:1,desc:'Reach level 80 Magic'},
    ],
    rewards:{xp:{magic:30000,defence:20000,hitpoints:15000},items:[{item:'celestial_robe',qty:1},{item:'void_essence',qty:5}],qp:4},
  },
  {
    id:'celestial_accord', name:'The Celestial Accord', type:'chain', npcId:'dorn', qp:5, difficulty:'Grandmaster',
    prereqs:['void_emperors_warning','champions_gauntlet'],
    desc:'Forge the Celestial Accord — the only weapon that can stop the Void Emperor.',
    objectives:[
      {type:'kill',monster:'ash_titan',qty:5,desc:'Defeat 5 Ash Titans for their essence'},
      {type:'kill',monster:'demon_lord',qty:3,desc:'Defeat 3 Demon Lords'},
      {type:'kill',monster:'void_emperor_spawn',qty:20,desc:"Destroy 20 Void Emperor's Spawns"},
      {type:'gather',item:'celestial_ingot',qty:5,desc:'Forge 5 Celestial Ingots'},
    ],
    rewards:{xp:{attack:50000,strength:50000,magic:50000,smithing:30000},items:[{item:'celestial_blade',qty:1},{item:'celestial_body',qty:1},{item:'celestial_legs',qty:1}],qp:5},
  },
];
for (const q of _newQ) {
  if (!GAME_DATA.quests.find(x=>x.id===q.id)) GAME_DATA.quests.push(q);
}

// ── THE VOID GAUNTLET ─────────────────────────────────────────

GAME_DATA.voidGauntlet = {
  name:'The Void Gauntlet',
  desc:'100 waves of void enemies. Final boss: The Void Emperor. The ultimate challenge.',
  unlockReq:{questCompleted:'void_emperors_warning', combatLevel:100},
  waves:(function(){
    const w=[]; const bosses={10:'void_titan',20:'elder_ash_golem',30:'demon_lord',40:'ash_titan',50:'void_emperor_spawn',60:'void_titan',70:'elder_ash_golem',80:'demon_lord',90:'ash_titan'};
    for(let i=1;i<=100;i++){
      if(i===100){w.push({wave:100,monsters:[{id:'void_emperor',qty:1}],isFinal:true});}
      else if(i%10===0){w.push({wave:i,monsters:[{id:bosses[i],qty:1}],isBoss:true});}
      else{
        const pool=i<20?['void_walker']:i<40?['void_walker','abyssal_horror']:i<60?['abyssal_horror','void_titan']:i<80?['void_titan','void_emperor_spawn']:['void_emperor_spawn','void_titan'];
        w.push({wave:i,monsters:[{id:pool[(i-1)%pool.length],qty:Math.min(5,Math.floor(i/20)+1),hpMult:1+(i-1)*0.08}]});
      }
    }
    return w;
  })(),
};

if(!GAME_DATA.monsters.void_emperor){
  GAME_DATA.monsters.void_emperor={
    id:'void_emperor',name:'Void Emperor',hp:50000,maxHit:350,attackSpeed:2.0,
    combatLevel:250,style:'magic',evasion:{melee:80,ranged:80,magic:95},
    xp:100000,gold:{min:5000,max:20000},alignment:'CE',
    drops:[{item:'void_emperor_cape',qty:1,chance:1.0},{item:'void_crystal',qty:20,chance:1.0},{item:'wrath_rune',qty:200,chance:1.0},{item:'celestial_ingot',qty:5,chance:0.5}],
    desc:'The ruler of the void.',
    phases:[
      {threshold:0.75,name:'Fracture',    maxHit:350,style:'magic', desc:'Void cracks appear around you'},
      {threshold:0.50,name:'Collapse',    maxHit:400,style:'melee', desc:'The Emperor charges into melee'},
      {threshold:0.25,name:'Annihilation',maxHit:450,style:'magic', enrage:true,desc:'Everything unleashed'},
    ],
    slayerReq:95,
  };
}

_add('void_emperor_cape',{
  name:"Void Emperor's Cape",type:'armor',slot:'cape',
  stats:{attackBonus:20,strengthBonus:20,defenceBonus:20,rangedBonus:20,magicBonus:20,damageReduction:10},
  levelReq:{attack:80,defence:80,magic:80},sellPrice:0,
  desc:'The ultimate achievement. All combat stats +20, -10% all damage taken.',
});

// ── ENGINE METHODS ────────────────────────────────────────────

GameEngine.prototype.startVoidGauntlet = function() {
  if(!GAME_DATA.voidGauntlet){this.emit('notification',{type:'danger',text:'Void Gauntlet data missing.'});return;}
  const req=GAME_DATA.voidGauntlet.unlockReq;
  if(req.questCompleted&&!this.state.quests.completed.includes(req.questCompleted)){
    this.emit('notification',{type:'warn',text:'Complete "Void Emperor\'s Warning" first.'});return;
  }
  if(this.getCombatLevel()<req.combatLevel){
    this.emit('notification',{type:'warn',text:'Combat Level '+req.combatLevel+' required.'});return;
  }
  this.state.voidGauntlet={active:true,wave:1,startTime:Date.now(),completed:false};
  const first=GAME_DATA.voidGauntlet.waves[0];
  const mon=GAME_DATA.monsters[first.monsters[0].id];
  if(!mon){this.emit('notification',{type:'danger',text:'Wave monster missing.'});return;}
  this.state.combat.active=true;
  this.state.combat.area='void_gauntlet';
  this.state.combat.monster=first.monsters[0].id;
  this.state.combat.monsterHp=Math.floor(mon.hp*(first.monsters[0].hpMult||1));
  this.state.combat.playerHp=this.getMaxHp();
  this.emit('notification',{type:'info',text:'Void Gauntlet begun — Wave 1 of 100.'});
  this.emit('combatStart',{});
};

GameEngine.prototype.voidGauntletNextWave = function() {
  const vg=this.state.voidGauntlet; if(!vg||!vg.active)return;
  vg.wave++;
  if(vg.wave>100){
    vg.active=false;vg.completed=true;
    this.emit('notification',{type:'success',text:'VOID GAUNTLET COMPLETE! You defeated the Void Emperor!'});
    const loot=GAME_DATA.monsters.void_emperor?.drops||[];
    for(const d of loot)this.addItem(d.item,d.qty);
    return;
  }
  const wd=GAME_DATA.voidGauntlet.waves[vg.wave-1];
  const mid=wd.monsters[0].id; const mon=GAME_DATA.monsters[mid]; if(!mon)return;
  this.state.combat.monster=mid;
  this.state.combat.monsterHp=Math.floor(mon.hp*(wd.monsters[0].hpMult||1));
  this.emit('notification',{type:'info',text:(wd.isFinal?'FINAL BOSS':wd.isBoss?'BOSS WAVE':'Wave '+vg.wave)+': '+mon.name});
};

// ── UI PAGE ───────────────────────────────────────────────────

UI.prototype.renderVoidGauntletPage = function(el) {
  const s=this.engine.state; const vg=GAME_DATA.voidGauntlet; const cur=s.voidGauntlet;
  const unlocked=s.quests.completed.includes('void_emperors_warning');
  let html=this.header('Void Gauntlet','skull','100 waves. Final boss: The Void Emperor.',null);
  html+='<div class="vg-container">';
  if(!unlocked){
    html+='<div class="vg-locked"><div class="vg-lock-icon">🔒</div><div class="vg-lock-title">Locked</div><div class="vg-lock-desc">Complete "Void Emperor\'s Warning" and reach Combat Level 100.</div></div>';
  } else {
    html+='<div class="vg-header"><div class="vg-title">THE VOID GAUNTLET</div><div class="vg-subtitle">100 Waves. Final Boss: The Void Emperor.</div></div>';
    if(cur?.active){
      const wd=vg.waves[(cur.wave||1)-1];
      html+='<div class="vg-active"><div class="vg-wave-badge '+(wd?.isBoss?'vg-boss':'')+'">'+(wd?.isFinal?'FINAL BOSS':wd?.isBoss?'BOSS WAVE':'WAVE '+(cur.wave||1))+'</div>';
      html+='<div class="vg-progress-track"><div class="vg-progress-fill" style="width:'+((cur.wave||1)*100/100).toFixed(1)+'%"></div></div>';
      html+='<div class="vg-wave-text">'+(cur.wave||1)+' / 100</div></div>';
    } else {
      html+='<div class="vg-wave-grid">';
      for(let w=1;w<=100;w++){
        const wd=vg.waves[w-1];
        html+='<div class="vg-wave-cell '+(wd.isFinal?'vg-wc-final':wd.isBoss?'vg-wc-boss':'vg-wc-normal')+'" title="Wave '+w+'">'+w+'</div>';
      }
      html+='</div>';
      html+='<div class="vg-rewards"><div class="vg-reward-title">Completion Reward</div><div class="vg-reward-item">Void Emperor\'s Cape — All stats +20, -10% all damage taken</div><div class="vg-reward-item">200x Wrath Runes, 20x Void Crystals, 5x Celestial Ingots</div></div>';
      const cb=this.engine.getCombatLevel(); const ok=cb>=100;
      html+='<button class="btn btn-danger btn-lg vg-start-btn" onclick="game.startVoidGauntlet()" '+(ok?'':'disabled')+'>'+(ok?'ENTER THE VOID GAUNTLET':'Combat Level 100+ Required (Current: '+cb+')')+'</button>';
    }
  }
  html+='</div>';
  el.innerHTML=html;
};

// Route
const _r0=UI.prototype.renderPage;
UI.prototype.renderPage=function(pageId){
  if(pageId==='void_gauntlet'){const m=document.getElementById('main-content');if(m)this.renderVoidGauntletPage(m);return;}
  return _r0.call(this,pageId);
};

// Styles
const _style=document.createElement('style');
_style.textContent=`
.vg-container{max-width:720px;margin:0 auto;padding:0 0 60px}
.vg-locked{text-align:center;padding:60px 20px}
.vg-lock-icon{font-size:64px;margin-bottom:16px;opacity:0.4}
.vg-lock-title{font-family:'Cinzel',serif;font-size:24px;color:var(--text-dim);margin-bottom:8px}
.vg-header{text-align:center;padding:32px 0 20px}
.vg-title{font-family:'Cinzel',serif;font-size:28px;color:#c9873e;letter-spacing:2px;text-shadow:0 0 20px rgba(201,135,62,0.4)}
.vg-subtitle{color:var(--text-dim);margin-top:8px;font-size:13px}
.vg-active{text-align:center;padding:24px;background:var(--bg-mid);border-radius:12px;border:1px solid var(--border);margin-bottom:20px}
.vg-wave-badge{font-family:'Cinzel',serif;font-size:20px;color:#c9873e;margin-bottom:12px}
.vg-wave-badge.vg-boss{color:#c44040;text-shadow:0 0 12px rgba(196,64,64,0.5)}
.vg-progress-track{height:12px;background:var(--bg-deep);border-radius:6px;overflow:hidden;margin:8px 0}
.vg-progress-fill{height:100%;background:linear-gradient(90deg,#8a3a3a,#c9873e);border-radius:6px;transition:width 0.5s}
.vg-wave-text{font-family:'JetBrains Mono',monospace;font-size:14px;color:var(--text-dim)}
.vg-wave-grid{display:grid;grid-template-columns:repeat(10,1fr);gap:3px;margin:16px 0}
.vg-wave-cell{aspect-ratio:1;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;font-family:'JetBrains Mono',monospace}
.vg-wc-normal{background:rgba(255,255,255,0.06);color:var(--text-dim)}
.vg-wc-boss{background:rgba(196,64,64,0.3);color:#c44040;font-weight:bold}
.vg-wc-final{background:rgba(201,135,62,0.5);color:#c9873e;font-weight:bold;font-size:9px}
.vg-rewards{background:var(--bg-mid);border-radius:8px;padding:16px;margin:16px 0;border:1px solid rgba(201,135,62,0.3)}
.vg-reward-title{font-family:'Cinzel',serif;font-size:13px;color:#c9873e;margin-bottom:8px}
.vg-reward-item{color:var(--text);font-size:13px;padding:4px 0;border-bottom:1px solid var(--border)}
.vg-reward-item:last-child{border:none}
.vg-start-btn{width:100%;margin-top:20px;font-family:'Cinzel',serif;letter-spacing:2px;font-size:15px;padding:16px}
.vg-start-btn:disabled{opacity:0.4;cursor:not-allowed}
`;
document.head.appendChild(_style);

// ── SMITHING RECIPES ──────────────────────────────────────────
if(GAME_DATA.recipes?.smithing){
  GAME_DATA.recipes.smithing.push(
    {id:'smith_shadow_bar',    name:'Shadow Bar',       level:75,xp:280, time:8.0, input:[{item:'shadow_ore',qty:2}],                output:{item:'shadow_bar',qty:1},   category:'Bars'},
    {id:'smith_shadow_blade',  name:'Shadow Blade',     level:77,xp:550, time:18.0,input:[{item:'shadow_bar',qty:4}],               output:{item:'shadow_blade',qty:1}, category:'Shadow'},
    {id:'smith_shadow_body',   name:'Shadow Platebody', level:78,xp:650, time:20.0,input:[{item:'shadow_bar',qty:5}],               output:{item:'shadow_platebody',qty:1},category:'Shadow'},
    {id:'smith_shadow_helm',   name:'Shadow Helm',      level:76,xp:420, time:14.0,input:[{item:'shadow_bar',qty:2}],               output:{item:'shadow_helm',qty:1},  category:'Shadow'},
    {id:'smith_celestial_ingot',name:'Celestial Ingot', level:85,xp:1000,time:30.0,input:[{item:'ashsteel_bar',qty:2},{item:'void_crystal',qty:1},{item:'enchant_dust',qty:10}],output:{item:'celestial_ingot',qty:1},category:'Celestial'},
    {id:'smith_celestial_blade',name:'Celestial Blade', level:88,xp:1500,time:40.0,input:[{item:'celestial_ingot',qty:5}],         output:{item:'celestial_blade',qty:1},category:'Celestial'},
    {id:'smith_celestial_body', name:'Celestial Body',  level:86,xp:1800,time:45.0,input:[{item:'celestial_ingot',qty:6}],         output:{item:'celestial_body',qty:1},category:'Celestial'},
  );
}

console.log('[Ashfall] World Tier 2 loaded:',Object.keys(GAME_DATA.items).length,'total items |',GAME_DATA.quests.length,'total quests | Void Gauntlet: 100 waves');

})();
