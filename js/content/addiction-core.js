// ================================================================
// ASHFALL IDLE — content/addiction-core.js
// The addiction layer. Everything that makes you need to log in.
// • 200+ items spanning all tiers and styles
// • 35 new monsters across all level ranges
// • 15 new combat areas
// • Unholy prayer system (dark prayers for offensive builds)
// • 25 new abilities with resource costs
// • Daily login reward system
// • Achievement diary (Ashfall Diaries)
// • Skill mastery reward milestones
// • World events (random boss spawns, bonus XP windows)
// ================================================================
(function() {
'use strict';

const _i = (id, d) => { if (!GAME_DATA.items[id]) GAME_DATA.items[id] = Object.assign({id}, d); };
const _m = (id, d) => { if (!GAME_DATA.monsters[id]) GAME_DATA.monsters[id] = Object.assign({id}, d); };
const _ab = (d) => { if (!GAME_DATA.abilities.find(a=>a.id===d.id)) GAME_DATA.abilities.push(d); };
const _area = (d) => { if (!GAME_DATA.combatAreas.find(a=>a.id===d.id)) GAME_DATA.combatAreas.push(d); };

// ═══════════════════════════════════════════════════════════════
// SECTION 1 — ITEMS (200+)
// ═══════════════════════════════════════════════════════════════

// ── MELEE: Beginner (levels 1-20) ─────────────────────────────
_i('bronze_sword',{name:'Bronze Sword',type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.4,stats:{attackBonus:4,strengthBonus:6},levelReq:{attack:1},sellPrice:20,desc:'A basic bronze sword.'});
_i('iron_sword',{name:'Iron Sword',type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.4,stats:{attackBonus:10,strengthBonus:12},levelReq:{attack:10},sellPrice:80,desc:'Iron sword. Decent for early training.'});
_i('steel_sword',{name:'Steel Sword',type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.4,stats:{attackBonus:22,strengthBonus:24},levelReq:{attack:20},sellPrice:400,desc:'Steel construction. Reliable.'});
_i('black_sword',{name:'Black Sword',type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.4,stats:{attackBonus:26,strengthBonus:29},levelReq:{attack:25},sellPrice:800,desc:'Black metal sword. Non-smithable.'});
_i('mithril_sword',{name:'Mithril Sword',type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.4,stats:{attackBonus:32,strengthBonus:36},levelReq:{attack:30},sellPrice:1800,desc:'Lightweight mithril blade.'});
_i('adamant_sword',{name:'Adamant Sword',type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.4,stats:{attackBonus:45,strengthBonus:50},levelReq:{attack:40},sellPrice:5000,desc:'Hard adamantite sword.'});
_i('rune_sword',{name:'Rune Sword',type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.4,stats:{attackBonus:54,strengthBonus:60},levelReq:{attack:50},sellPrice:18000,desc:'A fine runite sword.'});

// ── MELEE: Scimitars (fast slash) ─────────────────────────────
_i('bronze_scimitar',{name:'Bronze Scimitar',type:'weapon',slot:'weapon',style:'melee',attackSpeed:1.8,stats:{attackBonus:6,strengthBonus:7},levelReq:{attack:1},sellPrice:30,desc:'Fast curved blade.'});
_i('iron_scimitar',{name:'Iron Scimitar',type:'weapon',slot:'weapon',style:'melee',attackSpeed:1.8,stats:{attackBonus:12,strengthBonus:14},levelReq:{attack:10},sellPrice:100,desc:'Iron scimitar.'});
_i('steel_scimitar',{name:'Steel Scimitar',type:'weapon',slot:'weapon',style:'melee',attackSpeed:1.8,stats:{attackBonus:24,strengthBonus:26},levelReq:{attack:20},sellPrice:500,desc:'Steel scimitar.'});
_i('mithril_scimitar',{name:'Mithril Scimitar',type:'weapon',slot:'weapon',style:'melee',attackSpeed:1.8,stats:{attackBonus:36,strengthBonus:38},levelReq:{attack:30},sellPrice:2000,desc:'Mithril scimitar. Popular training weapon.'});
_i('adamant_scimitar',{name:'Adamant Scimitar',type:'weapon',slot:'weapon',style:'melee',attackSpeed:1.8,stats:{attackBonus:50,strengthBonus:54},levelReq:{attack:40},sellPrice:7500,desc:'Adamant scimitar. Good mid-game.'});
_i('rune_scimitar',{name:'Rune Scimitar',type:'weapon',slot:'weapon',style:'melee',attackSpeed:1.8,stats:{attackBonus:60,strengthBonus:67},levelReq:{attack:50},sellPrice:35000,desc:'Best smithable scimitar. Beloved by all.'});

// ── MELEE: Axes (wood + combat) ────────────────────────────────
_i('iron_battleaxe',{name:'Iron Battleaxe',type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.8,stats:{attackBonus:15,strengthBonus:25},levelReq:{attack:10},sellPrice:150,desc:'Heavy iron battleaxe.'});
_i('steel_battleaxe',{name:'Steel Battleaxe',type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.8,stats:{attackBonus:26,strengthBonus:40},levelReq:{attack:20},sellPrice:600,desc:'Steel battleaxe.'});
_i('rune_battleaxe',{name:'Rune Battleaxe',type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.8,stats:{attackBonus:65,strengthBonus:95},levelReq:{attack:50},sellPrice:55000,desc:'Devastating rune battleaxe.'});

// ── MELEE: 2H Swords ──────────────────────────────────────────
_i('iron_2h',{name:'Iron 2H Sword',type:'weapon',slot:'weapon',style:'melee',attackSpeed:3.2,stats:{attackBonus:14,strengthBonus:22},levelReq:{attack:10},sellPrice:200,desc:'Slow but powerful.'});
_i('steel_2h',{name:'Steel 2H Sword',type:'weapon',slot:'weapon',style:'melee',attackSpeed:3.2,stats:{attackBonus:26,strengthBonus:40},levelReq:{attack:20},sellPrice:800,desc:'Steel 2-hander.'});
_i('mithril_2h',{name:'Mithril 2H Sword',type:'weapon',slot:'weapon',style:'melee',attackSpeed:3.2,stats:{attackBonus:38,strengthBonus:55},levelReq:{attack:30},sellPrice:3500,desc:'Mithril 2-hander.'});
_i('adamant_2h',{name:'Adamant 2H Sword',type:'weapon',slot:'weapon',style:'melee',attackSpeed:3.2,stats:{attackBonus:52,strengthBonus:75},levelReq:{attack:40},sellPrice:11000,desc:'Adamant 2-hander.'});
_i('rune_2h',{name:'Rune 2H Sword',type:'weapon',slot:'weapon',style:'melee',attackSpeed:3.2,stats:{attackBonus:69,strengthBonus:99},levelReq:{attack:50},sellPrice:80000,desc:'The strongest smithable 2-hander.'});

// ── MELEE: Spears & Halberds ──────────────────────────────────
_i('iron_spear',{name:'Iron Spear',type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.4,stats:{attackBonus:14,strengthBonus:14},levelReq:{attack:10},sellPrice:120,desc:'Iron spear. Use with a shield.'});
_i('steel_spear',{name:'Steel Spear',type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.4,stats:{attackBonus:25,strengthBonus:25},levelReq:{attack:20},sellPrice:600,desc:'Steel spear.'});
_i('mithril_halberd',{name:'Mithril Halberd',type:'weapon',slot:'weapon',style:'melee',attackSpeed:3.0,stats:{attackBonus:52,strengthBonus:68},levelReq:{attack:30},sellPrice:5000,desc:'Long reach. Hits multiple targets.'});
_i('rune_spear',{name:'Rune Spear',type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.4,stats:{attackBonus:55,strengthBonus:55},levelReq:{attack:50},sellPrice:22000,desc:'Rune spear. Versatile.'});

// ── ARMOUR: Full tier sets (bronze through dragon) ─────────────
const _armorTiers = [
  {p:'bronze', n:'Bronze',   lvl:1,  sell:25,    def:3,  str:0, atk:1},
  {p:'iron',   n:'Iron',     lvl:10, sell:120,   def:7,  str:1, atk:2},
  {p:'steel',  n:'Steel',    lvl:20, sell:700,   def:14, str:2, atk:4},
  {p:'black',  n:'Black',    lvl:25, sell:1500,  def:18, str:3, atk:5},
  {p:'mithril',n:'Mithril',  lvl:30, sell:3000,  def:22, str:4, atk:6},
  {p:'adamant',n:'Adamantite',lvl:40,sell:9000,  def:30, str:5, atk:8},
  {p:'rune',   n:'Runite',   lvl:50, sell:40000, def:42, str:7, atk:12},
];
for (const t of _armorTiers) {
  _i(`${t.p}_full_helm`,{name:`${t.n} Full Helm`,type:'armor',slot:'head',stats:{defenceBonus:t.def,strengthBonus:t.str},levelReq:{defence:t.lvl},sellPrice:Math.floor(t.sell*0.25)});
  _i(`${t.p}_platebody`,{name:`${t.n} Platebody`,type:'armor',slot:'body',stats:{defenceBonus:t.def*3,strengthBonus:t.str*2,attackBonus:-t.atk},levelReq:{defence:t.lvl},sellPrice:t.sell});
  _i(`${t.p}_platelegs`,{name:`${t.n} Platelegs`,type:'armor',slot:'legs',stats:{defenceBonus:t.def*2,strengthBonus:Math.floor(t.str*1.5)},levelReq:{defence:t.lvl},sellPrice:Math.floor(t.sell*0.65)});
  _i(`${t.p}_kiteshield`,{name:`${t.n} Kiteshield`,type:'armor',slot:'shield',stats:{defenceBonus:t.def*2,magicBonus:-Math.floor(t.atk*0.5)},levelReq:{defence:t.lvl},sellPrice:Math.floor(t.sell*0.4)});
  _i(`${t.p}_chainbody`,{name:`${t.n} Chainbody`,type:'armor',slot:'body',stats:{defenceBonus:Math.floor(t.def*2.5),strengthBonus:t.str,magicBonus:-Math.floor(t.atk*0.3)},levelReq:{defence:t.lvl},sellPrice:Math.floor(t.sell*0.6)});
  _i(`${t.p}_sq_shield`,{name:`${t.n} Sq Shield`,type:'armor',slot:'shield',stats:{defenceBonus:Math.floor(t.def*1.5)},levelReq:{defence:t.lvl},sellPrice:Math.floor(t.sell*0.3)});
  _i(`${t.p}_boots`,{name:`${t.n} Boots`,type:'armor',slot:'boots',stats:{defenceBonus:Math.floor(t.def*0.4),strengthBonus:Math.floor(t.str*0.5)},levelReq:{defence:t.lvl},sellPrice:Math.floor(t.sell*0.1)});
  _i(`${t.p}_gauntlets`,{name:`${t.n} Gauntlets`,type:'armor',slot:'gloves',stats:{defenceBonus:Math.floor(t.def*0.4),attackBonus:Math.floor(t.atk*0.3)},levelReq:{defence:t.lvl},sellPrice:Math.floor(t.sell*0.1)});
}

// ── SPECIAL / UNIQUE MELEE GEAR ───────────────────────────────
_i('bandos_chestplate',{name:'Bandos Chestplate',type:'armor',slot:'body',stats:{defenceBonus:95,strengthBonus:18,attackBonus:6},levelReq:{defence:65},sellPrice:0,desc:'Best non-degradable melee body. +18 Strength.'});
_i('bandos_tassets',{name:'Bandos Tassets',type:'armor',slot:'legs',stats:{defenceBonus:82,strengthBonus:14,attackBonus:4},levelReq:{defence:65},sellPrice:0,desc:'Bandos legguards. +14 Strength.'});
_i('bandos_boots',{name:'Bandos Boots',type:'armor',slot:'boots',stats:{defenceBonus:18,strengthBonus:6,attackBonus:4},levelReq:{defence:65},sellPrice:0,desc:'Best non-degradable melee boots.'});
_i('neitiznot_faceguard',{name:'Neitiznot Faceguard',type:'armor',slot:'head',stats:{defenceBonus:38,strengthBonus:12,attackBonus:6},levelReq:{defence:70,slayer:80},sellPrice:0,desc:'Best Slayer helm upgrade. Requires Slayer 80.'});
_i('avernic_defender',{name:'Avernic Defender',type:'armor',slot:'shield',stats:{defenceBonus:30,attackBonus:16,strengthBonus:8},levelReq:{attack:70,defence:70},sellPrice:0,desc:'Best melee offhand. Spec: reflect 15% damage.'});
_i('infernal_cape',{name:'Infernal Cape',type:'armor',slot:'cape',stats:{attackBonus:8,strengthBonus:8,defenceBonus:8,magicBonus:8,rangedBonus:8,damageReduction:2},levelReq:{},sellPrice:0,desc:'The ultimate melee cape. Defeats the Ember Titan.'});
_i('primordial_boots',{name:'Primordial Boots',type:'armor',slot:'boots',stats:{defenceBonus:22,strengthBonus:5,attackBonus:2},levelReq:{defence:75},sellPrice:0,desc:'Best melee boots. Huge defence bonus.'});
_i('ferocious_gloves',{name:'Ferocious Gloves',type:'armor',slot:'gloves',stats:{attackBonus:16,strengthBonus:14,defenceBonus:0,magicBonus:-4},levelReq:{attack:80,defence:80},sellPrice:0,desc:'Best melee gloves. Degrades in combat.'});

// ── RANGED: Leather armour full sets ──────────────────────────
const _leatherTiers = [
  {p:'leather',    n:'Leather',    lvl:1,  rb:5,  db:5,  sell:50},
  {p:'hard_leather_set',n:'Hard Leather',lvl:10,rb:10,db:10,sell:200},
];
for (const t of _leatherTiers) {
  _i(`${t.p}_cowl`,{name:`${t.n} Cowl`,type:'armor',slot:'head',stats:{rangedBonus:Math.floor(t.rb*0.7),defenceBonus:Math.floor(t.db*0.6)},levelReq:{ranged:t.lvl},sellPrice:Math.floor(t.sell*0.2)});
  _i(`${t.p}_body`,{name:`${t.n} Body`,type:'armor',slot:'body',stats:{rangedBonus:t.rb,defenceBonus:t.db},levelReq:{ranged:t.lvl},sellPrice:t.sell});
  _i(`${t.p}_chaps`,{name:`${t.n} Chaps`,type:'armor',slot:'legs',stats:{rangedBonus:Math.floor(t.rb*0.8),defenceBonus:Math.floor(t.db*0.7)},levelReq:{ranged:t.lvl},sellPrice:Math.floor(t.sell*0.7)});
}

// ── RANGED: Pegasian, Masori (elite) ─────────────────────────
_i('masori_mask',{name:'Masori Mask',type:'armor',slot:'head',stats:{rangedBonus:14,defenceBonus:10},levelReq:{ranged:80,defence:80},sellPrice:0,desc:'Ancient ranger mask. Best ranged head slot.'});
_i('masori_body',{name:'Masori Body',type:'armor',slot:'body',stats:{rangedBonus:40,defenceBonus:55},levelReq:{ranged:80,defence:80},sellPrice:0,desc:'Best non-degradable ranged body.'});
_i('masori_chaps',{name:'Masori Chaps',type:'armor',slot:'legs',stats:{rangedBonus:26,defenceBonus:45},levelReq:{ranged:80,defence:80},sellPrice:0,desc:'Masori chaps.'});
_i('pegasian_boots',{name:'Pegasian Boots',type:'armor',slot:'boots',stats:{rangedBonus:12,defenceBonus:5},levelReq:{ranged:75},sellPrice:0,desc:'Best ranged boots. Increases ranged accuracy.'});
_i('zaryte_crossbow',{name:'Zaryte Crossbow',type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.6,stats:{rangedBonus:110,defenceBonus:5},levelReq:{ranged:80},sellPrice:0,desc:'Imbued void crossbow. Best-in-slot ranged weapon.'});

// ── MAGIC: Eternal, Tormented (elite) ─────────────────────────
_i('eternal_boots',{name:'Eternal Boots',type:'armor',slot:'boots',stats:{magicBonus:16,defenceBonus:4},levelReq:{magic:75},sellPrice:0,desc:'Best magic boots. +16 Magic.'});
_i('tormented_bracelet',{name:'Tormented Bracelet',type:'armor',slot:'gloves',stats:{magicBonus:18,defenceBonus:8},levelReq:{magic:75},sellPrice:0,desc:'Best magic gloves. +2% spell damage.'});
_i('harmonised_nightmare',{name:'Harmonised Staff',type:'weapon',slot:'weapon',style:'magic',attackSpeed:2.4,stats:{magicBonus:95},levelReq:{magic:82},sellPrice:0,desc:'Auto-casts Normal spells. First cast each cycle fires instantly.'});
_i('sang_trident',{name:'Sang Trident',type:'weapon',slot:'weapon',style:'magic',attackSpeed:2.2,stats:{magicBonus:80},levelReq:{magic:78},sellPrice:0,desc:'Auto-cast blood spells. Heals on hit.'});

// ── SLAYER GEAR ────────────────────────────────────────────────
_i('slayer_helm',{name:'Slayer Helm',type:'armor',slot:'head',stats:{defenceBonus:10,attackBonus:5,strengthBonus:3},levelReq:{slayer:10,defence:10},sellPrice:0,desc:'+15% melee accuracy and damage on Slayer task.'});
_i('slayer_helm_i',{name:'Slayer Helm (i)',type:'armor',slot:'head',stats:{defenceBonus:12,attackBonus:8,strengthBonus:5,rangedBonus:8,magicBonus:8},levelReq:{slayer:10,defence:10},sellPrice:0,desc:'+15% accuracy and damage all styles on task.'});
_i('abyssal_bludgeon',{name:'Abyssal Bludgeon',type:'weapon',slot:'weapon',style:'melee',attackSpeed:3.0,stats:{attackBonus:85,strengthBonus:125},levelReq:{attack:70,slayer:85},sellPrice:0,desc:'Made from 3 abyssal orphans. Spec: +0.5% per missing prayer point.'});
_i('cerberus_crystal',{name:'Cerberus Crystal',type:'resource',subtype:'misc',sellPrice:5000,desc:'Drop from Cerberus. Used to make primordial/pegasian/eternal boots.'});
_i('hydra_leather',{name:'Hydra Leather',type:'resource',subtype:'misc',sellPrice:8000,desc:'Soft and shimmering leather from the Alchemical Hydra.'});
_i('hydra_claw',{name:'Hydra Claw',type:'resource',subtype:'misc',sellPrice:12000,desc:'A claw from the Alchemical Hydra. Creates the dragon hunter lance.'});
_i('dragon_hunter_lance',{name:'Dragon Hunter Lance',type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.4,stats:{attackBonus:85,strengthBonus:85},levelReq:{attack:78,slayer:90},sellPrice:0,desc:'+20% accuracy and damage vs draconic creatures.'});
_i('dragon_hunter_crossbow',{name:'Dragon Hunter Crossbow',type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.6,stats:{rangedBonus:95},levelReq:{ranged:65,slayer:80},sellPrice:0,desc:'+30% ranged accuracy vs draconic. Best spec crossbow.'});

// ── FOOD COMPLETE SET ──────────────────────────────────────────
const _foods = [
  ['shrimp','Raw Shrimp',1,3,4,10],['anchovy','Raw Anchovy',1,4,6,15],
  ['trout','Raw Trout',15,7,15,60],['salmon','Raw Salmon',25,9,20,90],
  ['tuna','Raw Tuna',35,10,25,150],['lobster','Raw Lobster',40,12,40,350],
  ['swordfish','Raw Swordfish',50,14,55,600],['monkfish','Raw Monkfish',62,16,70,900],
  ['shark','Raw Shark',76,20,110,1200],['anglerfish','Raw Anglerfish',82,22,120,2000],
];
for (const [id,raw,lvl,heal,cookXp,sell] of _foods) {
  _i(`raw_${id}`,{name:raw,type:'food',raw:true,cookLevel:lvl,cookXp,sellPrice:Math.floor(sell*0.4),desc:`Raw ${id}. Cook it first.`});
  _i(`cooked_${id}`,{name:raw.replace('Raw ','Cooked '),type:'food',heals:heal,sellPrice:sell,desc:`Heals ${heal} HP.`});
}

// ── POTIONS — full set ─────────────────────────────────────────
_i('attack_potion',{name:'Attack Potion',type:'potion',buff:{stat:'attackBonus',value:10,duration:180},sellPrice:400,desc:'+10 Attack for 3 minutes.'});
_i('strength_potion',{name:'Strength Potion',type:'potion',buff:{stat:'strengthBonus',value:10,duration:180},sellPrice:400,desc:'+10 Strength for 3 minutes.'});
_i('defence_potion',{name:'Defence Potion',type:'potion',buff:{stat:'defenceBonus',value:10,duration:180},sellPrice:400,desc:'+10 Defence for 3 minutes.'});
_i('magic_potion',{name:'Magic Potion',type:'potion',buff:{stat:'magicBonus',value:8,duration:180},sellPrice:350,desc:'+8 Magic for 3 minutes.'});
_i('antipoison',{name:'Antipoison',type:'potion',buff:{stat:'cure_poison',value:1,duration:1},sellPrice:200,desc:'Cures and prevents poison for 3 minutes.'});
_i('super_attack',{name:'Super Attack',type:'potion',buff:{stat:'attackBonus',value:15,duration:300},sellPrice:1500,desc:'+15 Attack for 5 minutes.'});
_i('super_strength',{name:'Super Strength',type:'potion',buff:{stat:'strengthBonus',value:15,duration:300},sellPrice:1500,desc:'+15 Strength for 5 minutes.'});
_i('super_defence',{name:'Super Defence',type:'potion',buff:{stat:'defenceBonus',value:15,duration:300},sellPrice:1500,desc:'+15 Defence for 5 minutes.'});
_i('prayer_potion',{name:'Prayer Potion',type:'potion',buff:{stat:'prayerRestore',value:32,duration:1},sellPrice:8000,desc:'Restores 32 prayer points.'});
_i('super_combat',{name:'Super Combat',type:'potion',buff:{stat:'allCombat',value:15,duration:300},sellPrice:8000,desc:'+15 to all melee stats for 5 minutes.'});
_i('antifire',{name:'Antifire Potion',type:'potion',buff:{stat:'antifire',value:50,duration:360},sellPrice:1200,desc:'Reduces dragonfire damage by 50% for 6 minutes.'});
_i('stamina_potion',{name:'Stamina Potion',type:'potion',buff:{stat:'energyRegen',value:20,duration:120},sellPrice:2000,desc:'Reduces agility drain by 80% for 2 minutes.'});
_i('antidote_pp',{name:'Antidote++',type:'potion',buff:{stat:'cure_poison',value:1,duration:720},sellPrice:3000,desc:'Cures poison and provides 12-minute immunity.'});
_i('extended_antifire',{name:'Extended Antifire',type:'potion',buff:{stat:'antifire',value:50,duration:720},sellPrice:2500,desc:'12 minutes of dragonfire protection.'});
_i('bastion_potion',{name:'Bastion Potion',type:'potion',buff:{stat:'rangedDefence',value:15,duration:300},sellPrice:2000,desc:'+15 Ranged and Defence for 5 minutes.'});
_i('battlemage_potion',{name:'Battlemage Potion',type:'potion',buff:{stat:'magicDefence',value:15,duration:300},sellPrice:2000,desc:'+15 Magic and Defence for 5 minutes.'});

// ── RUNES (complete set) ──────────────────────────────────────
const _runes = [
  ['air_rune','Air',3,'Light blue','Used in wind spells.'],
  ['water_rune','Water',4,'Blue','Used in water spells.'],
  ['earth_rune','Earth',5,'Brown','Used in earth spells.'],
  ['fire_rune','Fire',5,'Red','Used in fire spells.'],
  ['mind_rune','Mind',2,'Purple','Used in bolt spells.'],
  ['chaos_rune','Chaos',80,'Dark red','Used in combat spells.'],
  ['death_rune','Death',200,'Black','Required for powerful spells.'],
  ['nature_rune','Nature',250,'Green','Used in alchemy and entangle.'],
  ['law_rune','Law',150,'Blue','Used in teleportation.'],
  ['cosmic_rune','Cosmic',100,'Teal','Used in enchantments.'],
  ['soul_rune','Soul',300,'White','Used in the most powerful spells.'],
  ['blood_rune','Blood',400,'Crimson','Used in blood magic.'],
];
for (const [id,name,sell,color,desc] of _runes) {
  _i(id,{name:`${name} Rune`,type:'rune',stackable:true,sellPrice:sell,desc});
}

// ── HERBLORE MATERIALS ─────────────────────────────────────────
const _herbs = ['grimy_guam','guam','grimy_marrentill','marrentill','grimy_tarromin','tarromin',
  'grimy_harralander','harralander','grimy_ranarr','ranarr','grimy_toadflax','toadflax',
  'grimy_irit','irit','grimy_avantoe','avantoe','grimy_kwuarm','scorchleaf',
  'grimy_snapdragon','snapdragon','grimy_cadantine','cadantine','grimy_lantadyme','lantadyme',
  'grimy_torstol','torstol'];
_herbs.forEach((h,i)=>{ const clean=h.startsWith('grimy_'); _i(h,{name:h.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),type:'resource',subtype:'herb',sellPrice:clean?5:Math.floor(20+i*15),desc:clean?'A grimy herb. Clean it.':'A clean herb for potions.'}); });

// ── BONES / ASHES (prayer materials) ─────────────────────────
_i('small_bones',{name:'Small Bones',type:'bones',prayerXp:4.5,sellPrice:1,desc:'Tiny creature bones.'});
_i('wolf_bones',{name:'Wolf Bones',type:'bones',prayerXp:4.5,sellPrice:2,desc:'Bones from a wolf.'});
_i('big_bones',{name:'Big Bones',type:'bones',prayerXp:15,sellPrice:8,desc:'Large monster bones.'});
_i('babydragon_bones',{name:'Baby Dragon Bones',type:'bones',prayerXp:30,sellPrice:40,desc:'Prayer XP: 30.'});
_i('dragon_bones',{name:'Dragon Bones',type:'bones',prayerXp:72,sellPrice:200,desc:'Prayer XP: 72. Best common bone.'});
_i('wyvern_bones',{name:'Wyvern Bones',type:'bones',prayerXp:72,sellPrice:250,desc:'Prayer XP: 72.'});
_i('dagannoth_bones',{name:'Dagannoth Bones',type:'bones',prayerXp:125,sellPrice:1200,desc:'Prayer XP: 125. Very good XP.'});
_i('superior_dragon_bones',{name:'Superior Dragon Bones',type:'bones',prayerXp:150,sellPrice:2500,desc:'Prayer XP: 150. Best dragon bones.'});
_i('ourg_bones',{name:'Ourg Bones',type:'bones',prayerXp:140,sellPrice:2000,desc:'Prayer XP: 140. From ogre shamans.'});
_i('ash_infused_bones',{name:'Ash-Infused Bones',type:'bones',prayerXp:200,sellPrice:5000,desc:'Prayer XP: 200. Only found in the Ashfall.'});
_i('infernal_ashes',{name:'Infernal Ashes',type:'bones',prayerXp:110,sellPrice:1800,desc:'Prayer XP: 110. Ashes from demons.'});

// ── GEMS & CRAFTING ───────────────────────────────────────────
const _gems = [
  ['uncut_opal','Uncut Opal',50],['opal','Opal',80],
  ['uncut_jade','Uncut Jade',100],['jade','Jade',150],
  ['uncut_red_topaz','Uncut Red Topaz',200],['red_topaz','Red Topaz',280],
  ['uncut_sapphire','Uncut Sapphire',300],['sapphire','Sapphire',450],
  ['uncut_emerald','Uncut Emerald',500],['emerald','Emerald',700],
  ['uncut_ruby','Uncut Ruby',900],['ruby','Ruby',1200],
  ['uncut_diamond','Uncut Diamond',2000],['diamond','Diamond',2800],
  ['uncut_dragonstone','Uncut Dragonstone',7000],['dragonstone','Dragonstone',9000],
  ['uncut_onyx','Uncut Onyx',80000],['onyx','Onyx',100000],
  ['uncut_zenyte','Uncut Zenyte',350000],['zenyte','Zenyte','450000'],
];
_gems.forEach(([id,name,sell])=>{ _i(id,{name,type:'resource',subtype:'gem',sellPrice:Number(sell),desc:`${name.includes('Uncut')?'Uncut gem — cut it for crafting.':'A precious gem.'}`}); });

// ── RINGS (crafted) ────────────────────────────────────────────
const _rings=[['ring_of_dueling','Ring of Dueling',{attackBonus:0},0,0,'Teleports to minigame locations.'],
  ['ring_of_life','Ring of Life',{defenceBonus:3},30,2000,'Teleports you to safety when near death.'],
  ['ring_of_recoil_set','Ring of Recoil',{defenceBonus:0},0,1000,'Reflects 10% of melee damage.'],
  ['ring_of_forging','Ring of Forging',{strengthBonus:2},0,1200,'100% smelt success rate.'],
  ['ring_of_visibility','Ring of Visibility',{magicBonus:2},0,800,'See hidden things. Dark altar access.'],
  ['seers_ring_i','Seers Ring (i)',{magicBonus:12},85,0,'Imbued seers ring. Best magic ring.'],
  ['archers_ring_i',"Archer's Ring (i)",{rangedBonus:12},85,0,'Imbued archer ring. Best ranged ring.'],
  ['berserker_ring_i','Berserker Ring (i)',{strengthBonus:12},85,0,'Imbued berserker ring. Best melee ring.'],
];
_rings.forEach(([id,name,stats,lvl,sell,desc])=>{ _i(id,{name,type:'armor',slot:'ring',stats,levelReq:lvl?{attack:lvl}:{},sellPrice:sell,desc}); });

// ── AMULETS ───────────────────────────────────────────────────
_i('amulet_of_strength',{name:'Amulet of Strength',type:'armor',slot:'amulet',stats:{strengthBonus:10},levelReq:{},sellPrice:2500,desc:'+10 Strength. Classic training amulet.'});
_i('amulet_of_power',{name:'Amulet of Power',type:'armor',slot:'amulet',stats:{attackBonus:6,strengthBonus:6,defenceBonus:6,rangedBonus:6,magicBonus:6},levelReq:{},sellPrice:5000,desc:'All-around decent amulet.'});
_i('amulet_of_glory',{name:'Amulet of Glory',type:'armor',slot:'amulet',stats:{attackBonus:10,strengthBonus:10,defenceBonus:10,rangedBonus:10,magicBonus:10},levelReq:{},sellPrice:15000,desc:'Excellent all-around amulet. 4 teleport charges.'});
_i('amulet_of_zenyte',{name:'Amulet of Zenyte',type:'armor',slot:'amulet',stats:{attackBonus:12,strengthBonus:12,rangedBonus:12,magicBonus:12,defenceBonus:12},levelReq:{},sellPrice:0,desc:'Best in slot amulet. Made from zenyte and gold.'});
_i('salve_amulet',{name:'Salve Amulet',type:'armor',slot:'amulet',stats:{attackBonus:3,strengthBonus:3},levelReq:{},sellPrice:0,desc:'+16.7% attack and damage vs undead. Mineshaft reward.'});
_i('salve_amulet_e',{name:'Salve Amulet (e)',type:'armor',slot:'amulet',stats:{attackBonus:6,strengthBonus:6},levelReq:{},sellPrice:0,desc:'+20% attack and damage vs undead. Enchanted.'});
_i('salve_amulet_ei',{name:'Salve Amulet (ei)',type:'armor',slot:'amulet',stats:{attackBonus:8,strengthBonus:8,rangedBonus:8,magicBonus:8},levelReq:{},sellPrice:0,desc:'+20% all styles vs undead. Best undead amulet.'});

// ═══════════════════════════════════════════════════════════════
// SECTION 2 — MONSTERS (35 new, all level ranges)
// ═══════════════════════════════════════════════════════════════

// ── LOW LEVEL (1-30) ──────────────────────────────────────────
_m('cow',{name:'Cow',hp:15,maxHit:2,attackSpeed:2.4,combatLevel:2,style:'melee',evasion:{melee:0,ranged:0,magic:0},xp:15,gold:{min:0,max:5},drops:[{item:'cowhide',qty:1,chance:1},{item:'raw_beef',qty:1,chance:0.8},{item:'bones',qty:1,chance:1}],desc:'Peaceful bovine.'});
_m('goblin',{name:'Goblin',hp:10,maxHit:3,attackSpeed:2.0,combatLevel:2,style:'melee',evasion:{melee:0,ranged:0,magic:0},xp:13,gold:{min:0,max:8},drops:[{item:'bones',qty:1,chance:1},{item:'bronze_sword',qty:1,chance:0.05},{item:'iron_sword',qty:1,chance:0.01}],desc:'Weak but numerous.'});
_m('man',{name:'Man',hp:15,maxHit:4,attackSpeed:2.4,combatLevel:2,style:'melee',evasion:{melee:0,ranged:0,magic:0},xp:20,gold:{min:3,max:25},drops:[{item:'bones',qty:1,chance:1}],desc:'A common man.'});
_m('guard',{name:'Guard',hp:44,maxHit:6,attackSpeed:2.4,combatLevel:19,style:'melee',evasion:{melee:8,ranged:6,magic:2},xp:88,gold:{min:5,max:50},drops:[{item:'bones',qty:1,chance:1},{item:'steel_sword',qty:1,chance:0.03}],desc:'A town guard. Armed.'});
_m('barbarian',{name:'Barbarian',hp:30,maxHit:5,attackSpeed:2.4,combatLevel:10,style:'melee',evasion:{melee:3,ranged:2,magic:0},xp:60,gold:{min:0,max:30},drops:[{item:'big_bones',qty:1,chance:1},{item:'mithril_sword',qty:1,chance:0.02}],desc:'A fierce barbarian warrior.'});
_m('dark_wizard',{name:'Dark Wizard',hp:22,maxHit:8,attackSpeed:2.8,combatLevel:7,style:'magic',evasion:{melee:4,ranged:4,magic:10},xp:45,gold:{min:5,max:40},drops:[{item:'bones',qty:1,chance:1},{item:'chaos_rune',qty:2,chance:0.4},{item:'death_rune',qty:1,chance:0.1}],desc:'Practices forbidden magic.'});
_m('black_knight',{name:'Black Knight',hp:55,maxHit:9,attackSpeed:2.4,combatLevel:33,style:'melee',evasion:{melee:15,ranged:10,magic:5},xp:110,gold:{min:10,max:80},drops:[{item:'big_bones',qty:1,chance:1},{item:'mithril_battleaxe',qty:1,chance:0.05},{item:'black_platebody',qty:1,chance:0.02}],desc:'Dark knight of the fallen order.'});

// ── MID LEVEL (30-60) ─────────────────────────────────────────
_m('hill_giant',{name:'Hill Giant',hp:100,maxHit:12,attackSpeed:2.8,combatLevel:28,style:'melee',evasion:{melee:12,ranged:8,magic:5},xp:200,gold:{min:10,max:100},drops:[{item:'big_bones',qty:1,chance:1},{item:'giant_key',qty:1,chance:0.005},{item:'rune_sword',qty:1,chance:0.003}],desc:'Huge and slow. Good big bones.'});
_m('moss_giant',{name:'Moss Giant',hp:140,maxHit:15,attackSpeed:3.0,combatLevel:42,style:'melee',evasion:{melee:18,ranged:12,magic:6},xp:280,gold:{min:20,max:150},drops:[{item:'big_bones',qty:1,chance:1},{item:'nature_rune',qty:3,chance:0.4},{item:'rune_battleaxe',qty:1,chance:0.005}],desc:'Living earth giant.'});
_m('fire_giant',{name:'Fire Giant',hp:180,maxHit:20,attackSpeed:3.0,combatLevel:86,style:'melee',evasion:{melee:35,ranged:30,magic:10},xp:360,gold:{min:50,max:300},drops:[{item:'big_bones',qty:1,chance:1},{item:'rune_2h',qty:1,chance:0.005},{item:'fire_rune',qty:30,chance:0.5}],desc:'Blazing fire giant. High combat level.'});
_m('ogre',{name:'Ogre',hp:110,maxHit:14,attackSpeed:3.2,combatLevel:53,style:'melee',evasion:{melee:22,ranged:18,magic:5},xp:220,gold:{min:15,max:80},drops:[{item:'big_bones',qty:1,chance:1},{item:'ourg_bones',qty:1,chance:0.05},{item:'adamant_sword',qty:1,chance:0.04}],desc:'Brutish ogre with a club.'});
_m('lesser_demon',{name:'Lesser Demon',hp:200,maxHit:18,attackSpeed:2.6,combatLevel:82,style:'melee',evasion:{melee:30,ranged:25,magic:15},xp:400,gold:{min:100,max:500},drops:[{item:'big_bones',qty:1,chance:1},{item:'rune_scimitar',qty:1,chance:0.02},{item:'chaos_rune',qty:10,chance:0.5}],desc:'A lesser servant of the void.'});
_m('moss_snake',{name:'Moss Snake',hp:65,maxHit:10,attackSpeed:1.8,combatLevel:35,style:'melee',evasion:{melee:20,ranged:25,magic:15},xp:130,gold:{min:5,max:40},drops:[{item:'snake_scales',qty:3,chance:0.8},{item:'small_bones',qty:1,chance:1}],desc:'Fast venomous snake. High evasion.'});
_m('ankou',{name:'Ankou',hp:150,maxHit:18,attackSpeed:2.4,combatLevel:75,style:'magic',evasion:{melee:25,ranged:25,magic:30},xp:300,gold:{min:30,max:200},drops:[{item:'death_rune',qty:5,chance:0.8},{item:'blood_rune',qty:3,chance:0.4},{item:'dark_crab',qty:1,chance:0.05}],desc:'An Ankou. Guards death altars.'});
_m('hellhound',{name:'Hellhound',hp:260,maxHit:18,attackSpeed:1.8,combatLevel:122,style:'melee',evasion:{melee:45,ranged:40,magic:30},xp:520,gold:{min:100,max:400},drops:[{item:'big_bones',qty:1,chance:1},{item:'cerberus_crystal',qty:1,chance:0.002},{item:'rune_kiteshield',qty:1,chance:0.01}],desc:'Fiery hound from the infernal planes.',slayerReq:75});
_m('banshee',{name:'Banshee',hp:75,maxHit:12,attackSpeed:2.4,combatLevel:23,style:'magic',evasion:{melee:10,ranged:10,magic:20},xp:150,gold:{min:5,max:60},drops:[{item:'chaos_rune',qty:3,chance:0.4},{item:'nature_rune',qty:2,chance:0.3},{item:'gold_bar',qty:1,chance:0.2}],desc:'Its scream drains your senses. Use earplugs.',slayerReq:15});
_m('aberrant_spectre',{name:'Aberrant Spectre',hp:240,maxHit:20,attackSpeed:2.8,combatLevel:96,style:'magic',evasion:{melee:35,ranged:35,magic:40},xp:480,gold:{min:50,max:300},drops:[{item:'death_rune',qty:3,chance:0.5},{item:'blood_rune',qty:2,chance:0.3},{item:'snapdragon',qty:2,chance:0.2}],desc:'Requires nosepeg. Drains stats with scent.',slayerReq:60});

// ── HIGH LEVEL (60-99) ────────────────────────────────────────
_m('steel_dragon',{name:'Steel Dragon',hp:500,maxHit:50,attackSpeed:3.0,combatLevel:246,style:'melee',evasion:{melee:60,ranged:60,magic:90},xp:1000,gold:{min:500,max:2000},drops:[{item:'dragon_bones',qty:3,chance:1},{item:'dragon_platelegs',qty:1,chance:0.003},{item:'rune_kiteshield',qty:1,chance:0.04}],desc:'Dragonfire is devastating without antifire.',slayerReq:60});
_m('mithril_dragon',{name:'Mithril Dragon',hp:600,maxHit:80,attackSpeed:3.2,combatLevel:304,style:'melee',evasion:{melee:70,ranged:70,magic:85},xp:1200,gold:{min:800,max:3000},drops:[{item:'dragon_bones',qty:4,chance:1},{item:'draconic_visage',qty:1,chance:0.002},{item:'dragon_2h',qty:1,chance:0.005}],desc:'Ancient draconic power. Bring super antifire.',slayerReq:75});
_m('adamant_dragon',{name:'Adamant Dragon',hp:750,maxHit:100,attackSpeed:3.4,combatLevel:338,style:'melee',evasion:{melee:80,ranged:80,magic:90},xp:1500,gold:{min:1000,max:4000},drops:[{item:'dragon_bones',qty:5,chance:1},{item:'dragon_hunter_lance',qty:1,chance:0.001},{item:'draconic_visage',qty:1,chance:0.001}],desc:'Most powerful non-unique dragon.',slayerReq:80});
_m('brutal_black_dragon',{name:'Brutal Black Dragon',hp:600,maxHit:85,attackSpeed:3.0,combatLevel:318,style:'melee',evasion:{melee:75,ranged:75,magic:88},xp:1200,gold:{min:800,max:3000},drops:[{item:'superior_dragon_bones',qty:1,chance:1},{item:'dragon_platebody',qty:1,chance:0.002},{item:'draconic_visage',qty:1,chance:0.0015}],desc:'The most aggressive of the black dragons.',slayerReq:77});
_m('gargoyle',{name:'Gargoyle',hp:325,maxHit:22,attackSpeed:2.6,combatLevel:111,style:'melee',evasion:{melee:40,ranged:35,magic:30},xp:650,gold:{min:200,max:800},drops:[{item:'rune_platebody',qty:1,chance:0.01},{item:'granite_maul',qty:1,chance:0.05},{item:'gold_bar',qty:5,chance:0.5}],desc:'Stone creature. Must be finished with a rock hammer.',slayerReq:75});
_m('dark_beast',{name:'Dark Beast',hp:450,maxHit:30,attackSpeed:2.6,combatLevel:182,style:'melee',evasion:{melee:55,ranged:50,magic:40},xp:900,gold:{min:300,max:1200},drops:[{item:'death_rune',qty:20,chance:0.8},{item:'dragon_med_helm',qty:1,chance:0.05},{item:'dark_bow',qty:1,chance:0.002}],desc:'Ancient creature from the dark realm.',slayerReq:90});
_m('cerberus',{name:'Cerberus',hp:600,maxHit:35,attackSpeed:2.2,combatLevel:318,style:'melee',evasion:{melee:60,ranged:60,magic:55},xp:1200,gold:{min:1000,max:4000},drops:[{item:'super_restore',qty:3,chance:0.5},{item:'cerberus_crystal',qty:1,chance:0.04},{item:'primordial_boots',qty:1,chance:0.003}],desc:'Three-headed hound of the underworld.',slayerReq:91,boss:true});
_m('alchemical_hydra',{name:'Alchemical Hydra',hp:800,maxHit:40,attackSpeed:2.8,combatLevel:426,style:'magic',evasion:{melee:70,ranged:70,magic:80},xp:1600,gold:{min:2000,max:8000},drops:[{item:'superior_dragon_bones',qty:3,chance:1},{item:'hydra_leather',qty:1,chance:0.1},{item:'hydra_claw',qty:1,chance:0.03}],desc:'A hydra transformed by alchemy. Changes attack styles.',slayerReq:95,boss:true});
_m('cave_kraken',{name:'Cave Kraken',hp:350,maxHit:28,attackSpeed:2.6,combatLevel:127,style:'magic',evasion:{melee:50,ranged:55,magic:60},xp:700,gold:{min:300,max:1000},drops:[{item:'death_rune',qty:10,chance:0.5},{item:'trident_swamp',qty:1,chance:0.01}],desc:'Ancient ocean predator. Thrives in water-filled caves.',slayerReq:87});
_m('smoke_devil',{name:'Smoke Devil',hp:300,maxHit:26,attackSpeed:2.4,combatLevel:160,style:'magic',evasion:{melee:45,ranged:45,magic:50},xp:600,gold:{min:200,max:700},drops:[{item:'smoke_staff',qty:1,chance:0.01},{item:'occult_necklace',qty:1,chance:0.002},{item:'dragon_chainbody',qty:1,chance:0.003}],desc:'Whirling demon of smoke and ash.',slayerReq:93});
_m('callisto',{name:"Callisto",hp:700,maxHit:40,attackSpeed:2.6,combatLevel:470,style:'melee',evasion:{melee:65,ranged:60,magic:55},xp:1400,gold:{min:3000,max:10000},drops:[{item:'ourg_bones',qty:3,chance:1},{item:'berserker_ring',qty:1,chance:0.02},{item:'dragon_pickaxe',qty:1,chance:0.01}],desc:'A mighty grizzly bear corrupted by dark magic.',boss:true,slayerReq:0,wilderness:true});
_m('venenatis',{name:'Venenatis',hp:640,maxHit:45,attackSpeed:2.4,combatLevel:464,style:'magic',evasion:{melee:60,ranged:60,magic:70},xp:1280,gold:{min:3000,max:10000},drops:[{item:'ourg_bones',qty:3,chance:1},{item:'archers_ring',qty:1,chance:0.02},{item:'dragon_pickaxe',qty:1,chance:0.01}],desc:'A massive spider dripping with venom.',boss:true,slayerReq:0,wilderness:true});

// ── BOSSES ────────────────────────────────────────────────────
_m('the_mimic',{name:'The Mimic',hp:450,maxHit:22,attackSpeed:2.4,combatLevel:282,style:'melee',evasion:{melee:50,ranged:50,magic:50},xp:900,gold:{min:5000,max:20000},drops:[{item:'casket',qty:1,chance:1},{item:'ring_of_wealth',qty:1,chance:0.05}],desc:'A chest that came alive. Can be found as a rare encounter.',boss:true});
_m('scorpia',{name:'Scorpia',hp:450,maxHit:30,attackSpeed:2.0,combatLevel:225,style:'melee',evasion:{melee:55,ranged:55,magic:70},xp:900,gold:{min:2000,max:8000},drops:[{item:'big_bones',qty:1,chance:1},{item:'seers_ring',qty:1,chance:0.02},{item:'treasonous_ring',qty:1,chance:0.02}],desc:'Scorpion queen. Heals from magic. Bring melee.',boss:true,slayerReq:0,wilderness:true});
_m('thermonuclear_smoke_devil',{name:'Thermonuclear Smoke Devil',hp:600,maxHit:35,attackSpeed:2.4,combatLevel:301,style:'magic',evasion:{melee:55,ranged:55,magic:60},xp:1200,gold:{min:3000,max:10000},drops:[{item:'occult_necklace',qty:1,chance:0.05},{item:'smoke_staff',qty:1,chance:0.08},{item:'pet_smoke_devil',qty:1,chance:0.002}],desc:'The master of smoke. Required 93 Slayer.',boss:true,slayerReq:93});

// ═══════════════════════════════════════════════════════════════
// SECTION 3 — COMBAT AREAS (15 new)
// ═══════════════════════════════════════════════════════════════

_area({id:'lumbridge_fields', name:'Lumbridge Fields',levelReq:1,  desc:'Rolling fields around Lumbridge. Cows, goblins, and men roam here. Perfect for beginners.',monsters:['cow','goblin','man']});
_area({id:'barbarian_village',name:'Barbarian Village', levelReq:5,  desc:'A village of fierce warriors. Test your combat before heading to harder areas.',monsters:['barbarian','guard','dark_wizard']});
_area({id:'castle_wars',      name:'Castle Ruins',     levelReq:20, desc:'Ancient castle grounds haunted by black knights and dark wizards.',monsters:['black_knight','dark_wizard','guard']});
_area({id:'giant_stronghold', name:'Giant Stronghold', levelReq:30, desc:'Massive giants roam these caverns. Great big bones XP.',monsters:['hill_giant','moss_giant','ogre']});
_area({id:'lesser_abyss',     name:'The Lesser Abyss', levelReq:40, desc:'A rift into the demon plane. Lesser demons patrol this territory.',monsters:['lesser_demon','ankou','banshee']});
_area({id:'slayer_dungeons',  name:'Slayer Dungeons',  levelReq:50, desc:'Deep caverns filled with slayer monsters. Bring your Slayer helm.',monsters:['aberrant_spectre','banshee','gargoyle'],slayerArea:true});
_area({id:'demon_ruins',      name:'Demon Ruins',      levelReq:60, desc:'Ruined citadel where lesser and greater demons clash eternally.',monsters:['lesser_demon','fire_giant','hellhound']});
_area({id:'dragon_lair',      name:'Dragon Lair',      levelReq:70, desc:'Ancient dragons make their home here. Bring antifire potions.',monsters:['steel_dragon','mithril_dragon','brutal_black_dragon']});
_area({id:'slayer_tower',     name:'Slayer Tower',     levelReq:75, desc:'A towering structure filled with high-level Slayer monsters.',monsters:['gargoyle','aberrant_spectre','dark_beast'],slayerArea:true});
_area({id:'dagannoth_caves',  name:'Dagannoth Caves',  levelReq:80, desc:'Beneath the sea, dagannoth roam in vast numbers. Excellent prayer XP.',monsters:['gargoyle','hellhound','dark_beast']});
_area({id:'smoke_dungeon',    name:'Smoke Dungeon',    levelReq:93, desc:'A dungeon of smoke and ash. Smoke Devils reign here.',monsters:['smoke_devil','thermonuclear_smoke_devil','aberrant_spectre'],slayerArea:true});
_area({id:'cerberus_lair',    name:"Cerberus' Lair",  levelReq:91, desc:"The three-headed guardian's domain. Fantastic slayer XP and valuable drops.",monsters:['cerberus','hellhound'],slayerArea:true,boss:true});
_area({id:'hydra_cave',       name:'Hydra Cave',       levelReq:95, desc:'The Alchemical Hydra lurks within. Best slayer XP in the game.',monsters:['alchemical_hydra','cave_kraken'],slayerArea:true,boss:true});
_area({id:'wilderness_ruins', name:'Wilderness Ruins', levelReq:50, desc:'Danger zone. PKers and powerful monsters. High risk, high reward.',monsters:['callisto','venenatis','scorpia'],wilderness:true});
_area({id:'ash_graveyard',    name:'Ash Graveyard',    levelReq:65, desc:'Ancient burial ground of the first ashfall victims. Undead and anomalous horrors.',monsters:['ankou','aberrant_spectre','dark_beast']});

// ═══════════════════════════════════════════════════════════════
// SECTION 4 — UNHOLY PRAYERS (dark prayer book)
// ═══════════════════════════════════════════════════════════════

if (!GAME_DATA.unholy_prayers) GAME_DATA.unholy_prayers = [];
const _up = (d) => { if (!GAME_DATA.unholy_prayers.find(p=>p.id===d.id)) GAME_DATA.unholy_prayers.push(d); };

// Unholy = offensive, risk-based, powered by ashes/infernal energy
_up({id:'demonic_strength',  name:'Demonic Strength',  level:1,  pointCost:2, icon:'💀', tier:'T1', desc:'+20% melee strength. But you take +10% more damage.',bonus:{strengthMult:1.20},penalty:{dmgTaken:1.10}});
_up({id:'dark_rage',         name:'Dark Rage',         level:10, pointCost:3, icon:'🔥', tier:'T1', desc:'+15% attack speed (strikes land faster). -5% accuracy.',bonus:{speedMult:0.85},penalty:{accMult:0.95}});
_up({id:'bone_shield',       name:'Bone Shield',       level:20, pointCost:3, icon:'🦴', tier:'T2', desc:'30% chance to negate incoming hits. Costs extra prayer on block.',bonus:{dodgeChance:0.30}});
_up({id:'unholy_wrath',      name:'Unholy Wrath',      level:25, pointCost:4, icon:'☠', tier:'T2', desc:'After taking damage, next attack deals +50% bonus damage.',bonus:{vengeanceMult:1.50}});
_up({id:'siphon_vitality',   name:'Siphon Vitality',   level:30, pointCost:4, icon:'🩸', tier:'T2', desc:'Heal 8% of damage dealt. Works for all combat styles.',bonus:{healPct:0.08}});
_up({id:'void_attunement',   name:'Void Attunement',   level:40, pointCost:5, icon:'🌑', tier:'T3', desc:'+25% magic damage. -15% prayer duration.',bonus:{magicDmgMult:1.25},penalty:{prayerDrain:1.15}});
_up({id:'infernal_armour',   name:'Infernal Armour',   level:45, pointCost:5, icon:'🔴', tier:'T3', desc:'Reduce all incoming damage by 20%. Costs 3x prayer points.',bonus:{dmgReduce:0.20},penalty:{ppCostMult:3.0}});
_up({id:'death_mark',        name:'Death Mark',        level:50, pointCost:6, icon:'💢', tier:'T3', desc:'Enemies below 25% HP take +40% damage from you.',bonus:{execMult:1.40,threshold:0.25}});
_up({id:'soul_split',        name:'Soul Split',        level:55, pointCost:5, icon:'✦', tier:'T3', desc:'Heal 10% of all damage dealt. Overrides siphon.',bonus:{healPct:0.10,allStyles:true}});
_up({id:'piety_of_darkness', name:'Piety of Darkness', level:60, pointCost:6, icon:'🌀', tier:'T3', desc:'+20% melee accuracy, +20% strength, +15% defence. The dark equivalent of Piety.',bonus:{attackMult:1.20,strengthMult:1.20,defenceMult:1.15}});
_up({id:'rigour_of_void',    name:'Rigour of Void',    level:65, pointCost:6, icon:'🏹', tier:'T3', desc:'+20% ranged accuracy, +20% ranged strength, +25% ranged defence.',bonus:{rangedAccMult:1.20,rangedDmgMult:1.20,rangedDefMult:1.25}});
_up({id:'augury_of_ash',     name:'Augury of Ash',     level:70, pointCost:6, icon:'🔮', tier:'T3', desc:'+25% magic accuracy, +25% magic defence.',bonus:{magicAccMult:1.25,magicDefMult:1.25}});
_up({id:'wrath_of_the_fallen',name:"Wrath of the Fallen",level:77,pointCost:8,icon:'⚡',tier:'T4',desc:'Your attacks have a 15% chance to strike twice. Drains prayer quickly.',bonus:{doubleHitChance:0.15}});
_up({id:'abyssal_connection', name:'Abyssal Connection',level:85,pointCost:9, icon:'🌀', tier:'T4', desc:'Drain 5% of enemy current HP every hit as bonus void damage.',bonus:{drainPct:0.05}});
_up({id:'damnation',         name:'Damnation',         level:95, pointCost:12,icon:'👁', tier:'T4', desc:'The unholy pinnacle. +30% all damage, -15% defence. Requires 95 Prayer.',bonus:{allDmgMult:1.30},penalty:{defenceMult:0.85}});

// Register unholy prayers in the standard prayers array so they render
GAME_DATA.prayers = GAME_DATA.prayers || [];
GAME_DATA.unholy_prayers.forEach(p => {
  if (!GAME_DATA.prayers.find(x=>x.id===p.id)) {
    GAME_DATA.prayers.push(Object.assign({}, p, {book:'unholy', pointCost: p.pointCost}));
  }
});

// ═══════════════════════════════════════════════════════════════
// SECTION 5 — NEW ABILITIES (25)
// ═══════════════════════════════════════════════════════════════

const _abilities = [
  // MELEE
  {id:'lunge',           name:'Lunge',            icon:'🗡',  tacticsReq:5,  cooldown:15, manaCost:8,  desc:'Dash forward, dealing 120% melee damage. Ignores 20% defence.',       effect:{type:'dash_strike',mult:1.2,defIgnore:0.2}},
  {id:'whirlwind',       name:'Whirlwind',         icon:'🌀',  tacticsReq:20, cooldown:30, manaCost:18, desc:'Spin attack hitting all enemies for 90% damage each.',               effect:{type:'aoe_melee',mult:0.9,targets:'all'}},
  {id:'crushing_blow',   name:'Crushing Blow',     icon:'💥',  tacticsReq:30, cooldown:40, manaCost:22, desc:'150% crush damage. Reduces enemy defence by 10% for 10 seconds.',    effect:{type:'crush_spec',mult:1.5,debuff:{stat:'defenceBonus',pct:0.10,dur:10}}},
  {id:'bladestorm',      name:'Bladestorm',        icon:'⚔',   tacticsReq:45, cooldown:60, manaCost:35, desc:'Five rapid strikes at 80% each. Last hit always crits.',             effect:{type:'multi_hit',hits:5,mult:0.80,lastCrit:true}},
  {id:'titan_smash',     name:'Titan Smash',       icon:'🔨',  tacticsReq:70, cooldown:90, manaCost:60, desc:'200% damage single blow. Stuns enemy for 3 seconds.',               effect:{type:'heavy_slam',mult:2.0,stun:3}},
  {id:'flurry',          name:'Flurry',            icon:'💫',  tacticsReq:25, cooldown:25, manaCost:15, desc:'4 hits at 70% each. Each hit has a 10% poison chance.',             effect:{type:'multi_hit',hits:4,mult:0.70,poisonChance:0.10}},
  // RANGED
  {id:'eagle_eye_shot',  name:'Eagle Eye Shot',    icon:'🦅',  tacticsReq:15, cooldown:20, manaCost:12, desc:'Precise shot with 140% accuracy. Cannot miss.',                     effect:{type:'precise_shot',accMult:1.40,noMiss:true}},
  {id:'scatter_shot',    name:'Scatter Shot',      icon:'💨',  tacticsReq:25, cooldown:30, manaCost:18, desc:'Fires 6 small bolts, each dealing 55% ranged damage.',              effect:{type:'barrage',hits:6,mult:0.55}},
  {id:'piercing_arrow',  name:'Piercing Arrow',    icon:'🎯',  tacticsReq:35, cooldown:40, manaCost:25, desc:'Arrow pierces armour. Ignores 40% of enemy defence.',               effect:{type:'armour_pierce',mult:1.1,defIgnore:0.40}},
  {id:'snipe',           name:'Snipe',             icon:'🔭',  tacticsReq:50, cooldown:55, manaCost:35, desc:'170% ranged damage. +3 second channel time before firing.',          effect:{type:'channel_shot',mult:1.70,channel:3}},
  {id:'rapid_fire',      name:'Rapid Fire',        icon:'🌩',  tacticsReq:40, cooldown:45, manaCost:28, desc:'10 rapid bolts at 50% each over 3 seconds.',                        effect:{type:'rapid_barrage',hits:10,mult:0.50,duration:3}},
  {id:'arrow_rain',      name:'Arrow Rain',        icon:'☔',  tacticsReq:60, cooldown:70, manaCost:45, desc:'Rain of arrows — 8 hits at 65% each. 15% bleed per hit.',           effect:{type:'rain',hits:8,mult:0.65,bleedChance:0.15}},
  // MAGIC
  {id:'chain_lightning', name:'Chain Lightning',   icon:'⚡',  tacticsReq:20, cooldown:25, manaCost:20, desc:'Lightning bounces to 3 targets at 80%, 60%, 40%.',                  effect:{type:'chain_magic',chain:3,mults:[0.8,0.6,0.4]}},
  {id:'blizzard',        name:'Blizzard',          icon:'❄',   tacticsReq:40, cooldown:50, manaCost:40, desc:'Ice storm. 160% magic damage. Slows enemy attack speed 30% for 6s.', effect:{type:'blizzard',mult:1.6,slow:0.30,slowDur:6}},
  {id:'meteor',          name:'Meteor Strike',     icon:'☄',   tacticsReq:60, cooldown:90, manaCost:70, desc:'Summon a meteor. 250% magic damage + burns for 15 seconds.',        effect:{type:'meteor',mult:2.5,burn:15}},
  {id:'time_warp',       name:'Time Warp',         icon:'⏱',   tacticsReq:75, cooldown:120,manaCost:80, desc:'Reset all ability cooldowns. One use per fight.',                   effect:{type:'cooldown_reset',oncePerFight:true}},
  {id:'arcane_shield',   name:'Arcane Shield',     icon:'🛡',   tacticsReq:30, cooldown:35, manaCost:22, desc:'Absorb the next 3 hits. Converts absorbed damage to mana.',         effect:{type:'absorb_shield',absorbs:3,manaConvert:0.5}},
  {id:'life_drain',      name:'Life Drain',        icon:'💚',  tacticsReq:35, cooldown:40, manaCost:25, desc:'Magic damage equal to 20% of your max HP. Heals for full amount.',   effect:{type:'hp_drain',hpPct:0.20,healFull:true}},
  // DEFENSIVE
  {id:'second_wind',     name:'Second Wind',       icon:'💨',  tacticsReq:10, cooldown:90, manaCost:0,  desc:'Instantly heal 15% of your max HP. Cannot be used on full HP.',    effect:{type:'self_heal',pct:0.15,notFullHp:true}},
  {id:'adrenaline',      name:'Adrenaline',        icon:'⚡',  tacticsReq:20, cooldown:60, manaCost:0,  desc:'Next 3 attacks deal +30% damage. 5 second window.',               effect:{type:'combat_buff',dmgBonus:30,attacks:3,duration:5}},
  {id:'overpower',       name:'Overpower',         icon:'💪',  tacticsReq:50, cooldown:70, manaCost:40, desc:'Ignore all enemy defence for 5 seconds. 175% damage hit.',         effect:{type:'overpower',mult:1.75,ignoreDefence:5}},
  {id:'counter_attack',  name:'Counter Attack',    icon:'🔄',  tacticsReq:45, cooldown:60, manaCost:30, desc:'If enemy attacks in next 3s, instantly retaliate for 200% damage.', effect:{type:'counter',retaliateMult:2.0,window:3}},
  {id:'last_stand',      name:'Last Stand',        icon:'🔥',  tacticsReq:80, cooldown:180,manaCost:0,  desc:'When below 15% HP: +50% damage and immunity to damage for 5 seconds.',effect:{type:'last_stand',threshold:0.15,dmgBonus:50,immDur:5}},
  {id:'phoenix_rise',    name:'Phoenix Rise',      icon:'🦅',  tacticsReq:90, cooldown:300,manaCost:0,  desc:'If you would die, instead heal to 30% HP. 5-minute cooldown.',      effect:{type:'death_save',healPct:0.30}},
  {id:'ancient_curse',   name:'Ancient Curse',     icon:'🌙',  tacticsReq:55, cooldown:50, manaCost:35, desc:'Curse enemy: -20% accuracy, -15% damage for 30 seconds.',           effect:{type:'debuff_curse',accReduction:0.20,dmgReduction:0.15,dur:30}},
];
_abilities.forEach(_ab);

// ═══════════════════════════════════════════════════════════════
// SECTION 6 — DAILY LOGIN REWARD SYSTEM
// ═══════════════════════════════════════════════════════════════

GAME_DATA.loginRewards = [
  {day:1,  label:'Day 1',  items:[{item:'super_combat',qty:2},{item:'prayer_potion',qty:3}],gold:500,    xpBonus:{skill:'all',pct:5,dur:1800}},
  {day:2,  label:'Day 2',  items:[{item:'rune_scimitar',qty:1},{item:'shark',qty:5}],gold:1000},
  {day:3,  label:'Day 3',  items:[{item:'overload_potion',qty:1},{item:'death_rune',qty:50}],gold:2000,  xpBonus:{skill:'all',pct:10,dur:1800}},
  {day:4,  label:'Day 4',  items:[{item:'dragon_bones',qty:20},{item:'super_restore',qty:5}],gold:3000},
  {day:5,  label:'Day 5',  items:[{item:'amulet_of_glory',qty:1},{item:'overload_potion',qty:2}],gold:5000,xpBonus:{skill:'all',pct:15,dur:3600}},
  {day:6,  label:'Day 6',  items:[{item:'void_crystal',qty:2},{item:'blood_rune',qty:100}],gold:7500},
  {day:7,  label:'Day 7 — WEEKLY!',items:[{item:'ancestral_hat',qty:1},{item:'wrath_rune',qty:100},{item:'overload_potion',qty:5}],gold:20000,xpBonus:{skill:'all',pct:25,dur:7200}},
  {day:14, label:'Day 14 — BIWEEKLY!',items:[{item:'berserker_ring_i',qty:1},{item:'celestial_ingot',qty:2}],gold:50000,xpBonus:{skill:'all',pct:50,dur:7200}},
  {day:30, label:'Day 30 — MONTHLY!', items:[{item:'void_emperor_cape',qty:1},{item:'wrath_rune',qty:500}],gold:200000,xpBonus:{skill:'all',pct:100,dur:86400}},
];

// ═══════════════════════════════════════════════════════════════
// SECTION 7 — ACHIEVEMENT DIARY SYSTEM
// ═══════════════════════════════════════════════════════════════

GAME_DATA.achievementDiaries = {
  lumbridge: {
    name: 'Lumbridge & Draynor Diary',
    tiers: {
      easy: {
        name:'Easy', reward:{item:'explorers_ring_1',qty:1},
        tasks:[
          {id:'ls_e1', desc:'Travel to Lumbridge', check:(s)=>true},
          {id:'ls_e2', desc:'Mine 10 copper ore', check:(s)=>(s.stats.totalActions?.mining||0)>=10},
          {id:'ls_e3', desc:'Cook 10 shrimp', check:(s)=>(s.stats.itemsCrafted||0)>=10},
          {id:'ls_e4', desc:'Bury 5 bones', check:(s)=>(s.stats.bonesburied||0)>=5},
          {id:'ls_e5', desc:'Reach level 5 Woodcutting', check:(s)=>(s.skills.woodcutting?.level||1)>=5},
        ]
      },
      medium: {
        name:'Medium', reward:{item:'explorers_ring_2',qty:1},
        tasks:[
          {id:'ls_m1', desc:'Reach level 40 Woodcutting', check:(s)=>(s.skills.woodcutting?.level||1)>=40},
          {id:'ls_m2', desc:'Mine 100 iron ore', check:(s)=>(s.stats.totalActions?.mining||0)>=100},
          {id:'ls_m3', desc:'Smith a rune bar', check:(s)=>(s.skills.smithing?.level||1)>=85},
          {id:'ls_m4', desc:'Kill 100 goblins', check:(s)=>(s.stats.monsterKills?.goblin||0)>=100},
          {id:'ls_m5', desc:'Reach 500 total level', check:(s)=>Object.values(s.skills).reduce((a,sk)=>a+(sk.level||1),0)>=500},
        ]
      },
      hard: {
        name:'Hard', reward:{item:'explorers_ring_3',qty:1},
        tasks:[
          {id:'ls_h1', desc:'Reach level 70 in all combat skills', check:(s)=>['attack','strength','defence','ranged','magic','prayer','hitpoints'].every(sk=>(s.skills[sk]?.level||1)>=70)},
          {id:'ls_h2', desc:'Complete 10 quests', check:(s)=>(s.quests.completed?.length||0)>=10},
          {id:'ls_h3', desc:'Defeat the Steel Dragon', check:(s)=>(s.stats.monsterKills?.steel_dragon||0)>=1},
          {id:'ls_h4', desc:'Reach 1000 total level', check:(s)=>Object.values(s.skills).reduce((a,sk)=>a+(sk.level||1),0)>=1000},
          {id:'ls_h5', desc:'Slay 500 monsters', check:(s)=>(s.stats.monstersKilled||0)>=500},
        ]
      },
      elite: {
        name:'Elite', reward:{item:'explorers_ring_4',qty:1},
        tasks:[
          {id:'ls_x1', desc:'Max a skill to 99', check:(s)=>Object.values(s.skills).some(sk=>(sk.level||1)>=99)},
          {id:'ls_x2', desc:'Complete 25 quests', check:(s)=>(s.quests.completed?.length||0)>=25},
          {id:'ls_x3', desc:'Defeat Cerberus', check:(s)=>(s.stats.monsterKills?.cerberus||0)>=1},
          {id:'ls_x4', desc:'Reach 2000 total level', check:(s)=>Object.values(s.skills).reduce((a,sk)=>a+(sk.level||1),0)>=2000},
          {id:'ls_x5', desc:'Kill 5000 monsters', check:(s)=>(s.stats.monstersKilled||0)>=5000},
        ]
      }
    }
  },
  ashen_peaks: {
    name: 'Ashen Peaks Diary',
    tiers: {
      easy:   {name:'Easy',   reward:{item:'ash_cape_easy',qty:1},   tasks:[{id:'ap_e1',desc:'Enter a Combat Area above level 30',check:(s)=>(s.stats.monstersKilled||0)>=1}]},
      medium: {name:'Medium', reward:{item:'ash_cape_medium',qty:1}, tasks:[{id:'ap_m1',desc:'Kill a Fire Giant',check:(s)=>(s.stats.monsterKills?.fire_giant||0)>=1},{id:'ap_m2',desc:'Reach combat level 70',check:(s)=>typeof game!=='undefined'?game.getCombatLevel()>=70:false}]},
      hard:   {name:'Hard',   reward:{item:'ash_cape_hard',qty:1},   tasks:[{id:'ap_h1',desc:'Kill the Alchemical Hydra',check:(s)=>(s.stats.monsterKills?.alchemical_hydra||0)>=1},{id:'ap_h2',desc:'Complete the Ashen Crypts',check:(s)=>(s.quests.completed||[]).includes('ashen_chronicle')}]},
      elite:  {name:'Elite',  reward:{item:'ash_cape_elite',qty:1},  tasks:[{id:'ap_x1',desc:'Complete the Void Gauntlet',check:(s)=>s.voidGauntlet?.completed},{id:'ap_x2',desc:'Reach combat level 126',check:(s)=>typeof game!=='undefined'?game.getCombatLevel()>=126:false}]},
    }
  }
};

// Add diary reward items
_i('explorers_ring_1',{name:"Explorer's Ring 1",type:'armor',slot:'ring',stats:{},levelReq:{},sellPrice:0,desc:'Lumbridge Easy diary reward. 30 cabbage teleports/day.'});
_i('explorers_ring_2',{name:"Explorer's Ring 2",type:'armor',slot:'ring',stats:{defenceBonus:1},levelReq:{},sellPrice:0,desc:'Lumbridge Medium diary reward.'});
_i('explorers_ring_3',{name:"Explorer's Ring 3",type:'armor',slot:'ring',stats:{defenceBonus:2,strengthBonus:1},levelReq:{},sellPrice:0,desc:'Lumbridge Hard diary reward.'});
_i('explorers_ring_4',{name:"Explorer's Ring 4",type:'armor',slot:'ring',stats:{defenceBonus:3,strengthBonus:2,magicBonus:1},levelReq:{},sellPrice:0,desc:'Lumbridge Elite diary reward. Full alchemy x6/day.'});
_i('ash_cape_easy',   {name:'Ash Cape (Easy)',   type:'armor',slot:'cape',stats:{defenceBonus:2},levelReq:{},sellPrice:0,desc:'Ashen Peaks Easy diary cape.'});
_i('ash_cape_medium', {name:'Ash Cape (Medium)', type:'armor',slot:'cape',stats:{defenceBonus:4,strengthBonus:2},levelReq:{},sellPrice:0,desc:'Ashen Peaks Medium diary cape.'});
_i('ash_cape_hard',   {name:'Ash Cape (Hard)',   type:'armor',slot:'cape',stats:{defenceBonus:6,strengthBonus:4,rangedBonus:4},levelReq:{},sellPrice:0,desc:'Ashen Peaks Hard diary cape.'});
_i('ash_cape_elite',  {name:'Ash Cape (Elite)',  type:'armor',slot:'cape',stats:{defenceBonus:8,strengthBonus:6,rangedBonus:6,magicBonus:6,damageReduction:2},levelReq:{},sellPrice:0,desc:'Best diary cape. All stats boosted.'});

// ═══════════════════════════════════════════════════════════════
// SECTION 8 — WORLD EVENTS (random bonus windows)
// ═══════════════════════════════════════════════════════════════

GAME_DATA.worldEvents = [
  {id:'ashfall_surge',   name:'Ashfall Surge',    desc:'Volcanic energy surges through the Ashfall. +25% XP to all skills for 30 minutes.',duration:1800,bonus:{xpMult:1.25},rarity:'common'},
  {id:'blood_moon',      name:'Blood Moon',       desc:'The blood moon rises. Monsters drop double loot for 1 hour.',duration:3600,bonus:{dropMult:2.0},rarity:'uncommon'},
  {id:'void_rift',       name:'Void Rift Opening',desc:'A rift appears. Void monsters spawn with triple XP rewards for 45 minutes.',duration:2700,bonus:{xpMult:2.0,voidOnly:true},rarity:'uncommon'},
  {id:'guilds_bounty',   name:"Guild's Bounty",   desc:'Your guild offers bonus gold for all combat kills. +50% gold from monsters.',duration:2400,bonus:{goldMult:1.50},rarity:'common'},
  {id:'prayer_eclipse',  name:'Prayer Eclipse',   desc:'Dark eclipse. All prayer effects cost 50% less for 20 minutes.',duration:1200,bonus:{prayerCostMult:0.50},rarity:'rare'},
  {id:'ancient_power',   name:'Ancient Power',    desc:'Ancient forces stir. All abilities deal 30% more damage and have 40% shorter cooldowns.',duration:900,bonus:{abilityDmgMult:1.30,cooldownMult:0.60},rarity:'rare'},
  {id:'wild_surge',      name:'Wilderness Surge', desc:'The Wilderness is wild. PvP kills grant 5x rewards for 30 minutes.',duration:1800,bonus:{wildRewardMult:5.0,wildOnly:true},rarity:'uncommon'},
  {id:'master_craftsman',name:"Craftsman's Hour", desc:'A master craftsman inspires you. +50% XP to all artisan skills for 1 hour.',duration:3600,bonus:{artisanXpMult:1.50},rarity:'common'},
];

// Engine method for world event spawning
if (typeof GameEngine !== 'undefined') {
  GameEngine.prototype.tickWorldEvents = function() {
    if (!this.state.worldEvents) this.state.worldEvents = {active:null,nextSpawn:Date.now()+600000};
    const we = this.state.worldEvents;
    const now = Date.now();
    // End active event
    if (we.active && now > we.activeUntil) {
      this.emit('notification',{type:'info',text:`World event ended: ${we.active.name}`});
      we.active = null;
      we.nextSpawn = now + (Math.random()*1200000 + 600000); // 10-30 min
    }
    // Spawn new event (10% chance per check if past spawn time)
    if (!we.active && now > we.nextSpawn && Math.random() < 0.002) { // ~0.2% per tick
      const pool = GAME_DATA.worldEvents.filter(e=>e.rarity==='common');
      const rarRoll = Math.random();
      const candidates = rarRoll < 0.05 ? GAME_DATA.worldEvents.filter(e=>e.rarity==='rare') :
                         rarRoll < 0.25 ? GAME_DATA.worldEvents.filter(e=>e.rarity==='uncommon') : pool;
      const ev = candidates[Math.floor(Math.random()*candidates.length)];
      if (ev) {
        we.active = ev;
        we.activeUntil = now + ev.duration*1000;
        this.emit('worldEvent',{event:ev});
        this.emit('notification',{type:'achievement',text:`🌍 WORLD EVENT: ${ev.name} — ${ev.desc}`});
      }
    }
  };

  // Claim daily login reward
  GameEngine.prototype.claimLoginReward = function() {
    if (!this.state.loginStreak) this.state.loginStreak = {count:0, lastClaim:0};
    const streak = this.state.loginStreak;
    const now = Date.now();
    const dayMs = 86400000;
    const timeSinceLast = now - streak.lastClaim;
    if (timeSinceLast < dayMs) {
      const remaining = Math.ceil((dayMs - timeSinceLast)/3600000);
      this.emit('notification',{type:'warn',text:`Login reward already claimed. Next reward in ${remaining} hours.`});
      return false;
    }
    // Break streak if >48hrs since last
    if (timeSinceLast > dayMs*2 && streak.count>0) {
      streak.count = 0;
      this.emit('notification',{type:'warn',text:'Login streak broken! Starting over from Day 1.'});
    }
    streak.count = (streak.count||0) + 1;
    streak.lastClaim = now;
    // Find reward tier
    const dayKey = [30,14,7].find(d=>streak.count%30===0||(d===7&&streak.count%7===0)||(d===14&&streak.count%14===0)) || streak.count;
    const reward = GAME_DATA.loginRewards.find(r=>r.day===dayKey) || GAME_DATA.loginRewards[0];
    if (reward.items) reward.items.forEach(drop=>this.addToBank(drop.item, drop.qty));
    if (reward.gold) this.state.gold = (this.state.gold||0) + reward.gold;
    this.emit('notification',{type:'achievement',text:`🎁 Day ${streak.count} Login Reward claimed! Check your bank.`});
    this.emit('loginRewardClaimed',{streak:streak.count, reward});
    return true;
  };

  // Check achievement diaries
  GameEngine.prototype.checkDiaries = function() {
    if (!this.state.diaryProgress) this.state.diaryProgress = {};
    const dp = this.state.diaryProgress;
    for (const [diaryId, diary] of Object.entries(GAME_DATA.achievementDiaries||{})) {
      for (const [tier, data] of Object.entries(diary.tiers||{})) {
        const key = `${diaryId}_${tier}`;
        if (dp[key+'_complete']) continue;
        const allDone = (data.tasks||[]).every(task=>{
          if (dp[task.id]) return true;
          try {
            if (task.check(this.state)) {
              dp[task.id] = true;
              this.emit('notification',{type:'info',text:`Diary task complete: ${task.desc}`});
              return true;
            }
          } catch(e) {}
          return false;
        });
        if (allDone && !dp[key+'_complete']) {
          dp[key+'_complete'] = true;
          if (data.reward) this.addToBank(data.reward.item, data.reward.qty);
          this.emit('notification',{type:'achievement',text:`🏆 ${diary.name} ${data.name} complete! Reward added to bank.`});
        }
      }
    }
  };
}

console.log('[Ashfall] Addiction Core v1.0 loaded:',
  'Items:', Object.keys(GAME_DATA.items).length,
  '| Monsters:', Object.keys(GAME_DATA.monsters).length,
  '| Areas:', GAME_DATA.combatAreas.length,
  '| Prayers:', GAME_DATA.prayers.length,
  '| Abilities:', GAME_DATA.abilities.length
);

})();
