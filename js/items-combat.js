// ================================================================
// ASHFALL IDLE - Combat Items Expansion
// Complete armor sets, special weapons, spec bar system
// Loaded AFTER items-expand.js, BEFORE engine.js
// ================================================================

// ── SPEC BAR SYSTEM ──────────────────────────────────────
// Special attack energy: 0-100%, regenerates 10% per attack
// Weapons define specCost (25/50/75/100) and specEffect
GAME_DATA.specBarMax = 100;
GAME_DATA.specRegenRate = 10; // % per player attack

// ── COMPLETE ARMOR SETS ──────────────────────────────────
// Each tier: helm, plate, legs, boots, gloves, shield
// Set bonus: wear 4+ pieces for extra stats

const _armorSets = [
  { tier:'bronze', name:'Bronze', level:1, smith:1, bar:'bronze_bar', rarity:'common',
    stats:{head:{def:4,str:1},body:{def:9,str:2},legs:{def:7},boots:{def:2},gloves:{def:2},shield:{def:5}},
    barCost:{head:3,body:5,legs:4,boots:2,gloves:2,shield:3} },
  { tier:'iron', name:'Iron', level:10, smith:10, bar:'iron_bar', rarity:'common',
    stats:{head:{def:8,str:2},body:{def:18,str:4},legs:{def:14,str:2},boots:{def:5},gloves:{def:4},shield:{def:10}},
    barCost:{head:3,body:5,legs:4,boots:2,gloves:2,shield:3} },
  { tier:'steel', name:'Steel', level:20, smith:20, bar:'steel_bar', rarity:'uncommon',
    stats:{head:{def:14,str:4},body:{def:28,str:8},legs:{def:22,str:5},boots:{def:9},gloves:{def:7},shield:{def:18}},
    barCost:{head:4,body:6,legs:5,boots:3,gloves:2,shield:4} },
  { tier:'mithril', name:'Mithril', level:30, smith:30, bar:'mithril_bar', rarity:'uncommon',
    stats:{head:{def:20,str:6},body:{def:42,str:12},legs:{def:34,str:8},boots:{def:14},gloves:{def:11},shield:{def:28}},
    barCost:{head:4,body:6,legs:5,boots:3,gloves:3,shield:4} },
  { tier:'adamant', name:'Adamant', level:40, smith:40, bar:'adamant_bar', rarity:'rare',
    stats:{head:{def:30,str:9},body:{def:60,str:18},legs:{def:48,str:11},boots:{def:20},gloves:{def:16},shield:{def:40,dr:1}},
    barCost:{head:5,body:7,legs:6,boots:3,gloves:3,shield:5} },
  { tier:'runite', name:'Runite', level:50, smith:55, bar:'runite_bar', rarity:'rare',
    stats:{head:{def:42,str:12},body:{def:82,str:24},legs:{def:64,str:15},boots:{def:28,str:4},gloves:{def:22,str:4},shield:{def:55,dr:2}},
    barCost:{head:5,body:8,legs:6,boots:4,gloves:3,shield:5} },
  { tier:'obsidian', name:'Obsidian', level:60, smith:65, bar:'obsidian_bar', rarity:'epic',
    stats:{head:{def:56,str:16,dr:1},body:{def:110,str:32,dr:2},legs:{def:86,str:20,dr:1},boots:{def:38,str:6},gloves:{def:30,str:6},shield:{def:74,dr:3}},
    barCost:{head:6,body:9,legs:7,boots:4,gloves:4,shield:6} },
  { tier:'ashsteel', name:'Ashsteel', level:75, smith:80, bar:'ashsteel_bar', rarity:'legendary',
    stats:{head:{def:72,str:22,dr:2},body:{def:140,str:44,dr:4},legs:{def:110,str:28,dr:2},boots:{def:50,str:8,dr:1},gloves:{def:40,str:8,dr:1},shield:{def:95,dr:5}},
    barCost:{head:7,body:10,legs:8,boots:5,gloves:4,shield:7} },
  // NEW: Dragonite endgame melee (level 85)
  { tier:'dragonite', name:'Dragonite', level:85, smith:90, bar:'dragonite_bar', rarity:'mythic',
    stats:{head:{def:90,str:30,dr:3},body:{def:175,str:60,dr:6},legs:{def:138,str:38,dr:3},boots:{def:65,str:12,dr:2},gloves:{def:52,str:12,dr:2},shield:{def:120,dr:8}},
    barCost:{head:6,body:10,legs:8,boots:4,gloves:4,shield:6} },
];

const slotNames = {head:'Helm',body:'Platebody',legs:'Platelegs',boots:'Boots',gloves:'Gauntlets',shield:'Shield'};

for (const set of _armorSets) {
  for (const [slot, slotLabel] of Object.entries(slotNames)) {
    const id = `${set.tier}_${slot === 'body' ? 'plate' : slot === 'legs' ? 'legs' : slot === 'head' ? 'helm' : slot}`;
    const statBlock = {};
    if (set.stats[slot].def) statBlock.defenceBonus = set.stats[slot].def;
    if (set.stats[slot].dr) statBlock.damageReduction = set.stats[slot].dr;
    if (set.stats[slot].str) statBlock.strengthBonus = set.stats[slot].str;
    if (!GAME_DATA.items[id]) {
      GAME_DATA.items[id] = {
        id, name:`${set.name} ${slotLabel}`, type:'armor', slot, stats:statBlock,
        levelReq:{defence:set.level}, sellPrice:set.barCost[slot] * 50 * (set.level+1),
        rarity:set.rarity, armorSet:set.tier,
        desc:`${set.name} ${slotLabel.toLowerCase()}. +${set.stats[slot].def} Defence${set.stats[slot].dr ? ', +'+set.stats[slot].dr+'% DR':''}. Part of the ${set.name} set.`,
      };
    }
    // Smithing recipe
    if (!GAME_DATA.recipes.smithing.find(r=>r.id==='smith_'+id)) {
      GAME_DATA.recipes.smithing.push({
        id:'smith_'+id, name:`${set.name} ${slotLabel}`, level:set.smith,
        xp:set.barCost[slot]*12, time:6.0,
        input:[{item:set.bar,qty:set.barCost[slot]}], output:{item:id,qty:1},
      });
    }
  }
}

// ── RANGED ARMOR SETS ────────────────────────────────────
const _rangedSets = [
  { tier:'leather', name:'Leather', level:1, rarity:'common', mat:'leather',
    stats:{head:{rng:4,def:2},body:{rng:10,def:5},legs:{rng:7,def:3},boots:{rng:3,def:1},gloves:{rng:3,def:1}},
    matCost:{head:3,body:6,legs:5,boots:2,gloves:2} },
  { tier:'hard_leather', name:'Hard Leather', level:20, rarity:'uncommon', mat:'hard_leather',
    stats:{head:{rng:12,def:6},body:{rng:26,def:12},legs:{rng:20,def:9},boots:{rng:8,def:4},gloves:{rng:8,def:4}},
    matCost:{head:4,body:7,legs:5,boots:3,gloves:3} },
  { tier:'dragonhide', name:'Dragonhide', level:40, rarity:'rare', mat:'hard_leather',
    stats:{head:{rng:24,def:14},body:{rng:50,def:26},legs:{rng:38,def:20},boots:{rng:18,def:9},gloves:{rng:16,def:8}},
    matCost:{head:5,body:8,legs:6,boots:3,gloves:3} },
  // NEW: Void Stalker ranged set level 60
  { tier:'void_stalker', name:'Void Stalker', level:60, rarity:'epic', mat:'hard_leather',
    stats:{head:{rng:38,def:22},body:{rng:78,def:40},legs:{rng:60,def:32},boots:{rng:28,def:14},gloves:{rng:26,def:12}},
    matCost:{head:6,body:10,legs:8,boots:4,gloves:4} },
  // NEW: Shadowscale endgame ranged set level 80
  { tier:'shadowscale', name:'Shadowscale', level:80, rarity:'legendary', mat:'hard_leather',
    stats:{head:{rng:54,def:32},body:{rng:108,def:58},legs:{rng:84,def:46},boots:{rng:40,def:20},gloves:{rng:36,def:18}},
    matCost:{head:8,body:12,legs:10,boots:5,gloves:5} },
];

for (const set of _rangedSets) {
  for (const [slot, slotLabel] of Object.entries({head:'Coif',body:'Body',legs:'Chaps',boots:'Boots',gloves:'Vambraces'})) {
    const id = `${set.tier}_${slot === 'body' ? 'body' : slot === 'legs' ? 'chaps' : slot === 'head' ? 'coif' : slot}`;
    const statBlock = {};
    if (set.stats[slot].rng) statBlock.rangedBonus = set.stats[slot].rng;
    if (set.stats[slot].def) statBlock.defenceBonus = set.stats[slot].def;
    if (!GAME_DATA.items[id]) {
      GAME_DATA.items[id] = {
        id, name:`${set.name} ${slotLabel}`, type:'armor', slot, stats:statBlock,
        levelReq:{ranged:set.level,defence:Math.max(1,set.level-5)},
        sellPrice:set.matCost[slot]*40*(set.level+1), rarity:set.rarity, armorSet:set.tier+'_ranged',
        desc:`${set.name} ${slotLabel.toLowerCase()}. +${set.stats[slot].rng} Ranged, +${set.stats[slot].def} Defence.`,
      };
    }
    if (!GAME_DATA.recipes.crafting.find(r=>r.id==='craft_'+id)) {
      GAME_DATA.recipes.crafting.push({
        id:'craft_'+id, name:`${set.name} ${slotLabel}`, level:set.level,
        xp:set.matCost[slot]*10, time:5.0,
        input:[{item:set.mat,qty:set.matCost[slot]}], output:{item:id,qty:1},
      });
    }
  }
}

// ── MAGIC ROBES ──────────────────────────────────────────
const _mageSets = [
  { tier:'mystic', name:'Mystic', level:20, rarity:'uncommon',
    stats:{head:{mag:12,def:5},body:{mag:26,def:10},legs:{mag:20,def:7}}, craft:20 },
  { tier:'adept', name:'Adept', level:40, rarity:'rare',
    stats:{head:{mag:22,def:12},body:{mag:46,def:22},legs:{mag:36,def:16}}, craft:40 },
  { tier:'archmage', name:'Archmage', level:65, rarity:'epic',
    stats:{head:{mag:38,def:22},body:{mag:78,def:40},legs:{mag:60,def:30}}, craft:60 },
  { tier:'elder', name:'Elder', level:80, rarity:'legendary',
    stats:{head:{mag:52,def:32,dr:2},body:{mag:106,def:58,dr:4},legs:{mag:82,def:44,dr:2}}, craft:75 },
  // NEW: Void Emperor set — endgame magic (level 90, dropped from Void Emperor)
  { tier:'void_emperor', name:'Void Emperor', level:90, rarity:'mythic',
    stats:{head:{mag:68,def:42,dr:3},body:{mag:138,def:76,dr:6},legs:{mag:108,def:58,dr:3}}, craft:99 },
];

for (const set of _mageSets) {
  for (const [slot, slotLabel] of Object.entries({head:'Hat',body:'Robe Top',legs:'Robe Bottom'})) {
    const id = `${set.tier}_${slot === 'body' ? 'robe' : slot === 'legs' ? 'robe_legs' : 'hat'}`;
    const statBlock = {};
    if (set.stats[slot].mag) statBlock.magicBonus = set.stats[slot].mag;
    if (set.stats[slot].def) statBlock.defenceBonus = set.stats[slot].def;
    if (set.stats[slot].dr) statBlock.damageReduction = set.stats[slot].dr;
    if (!GAME_DATA.items[id]) {
      GAME_DATA.items[id] = {
        id, name:`${set.name} ${slotLabel}`, type:'armor', slot, stats:statBlock,
        levelReq:{magic:set.level,defence:Math.max(1,set.level-10)},
        sellPrice:500*(set.level+1), rarity:set.rarity, armorSet:set.tier+'_mage',
        desc:`${set.name} ${slotLabel.toLowerCase()}. +${set.stats[slot].mag} Magic, +${set.stats[slot].def} Defence.`,
      };
    }
  }
}

// ── SPECIAL ATTACK WEAPONS ───────────────────────────────
// specCost: 25/50/75/100% of spec bar
// specEffect: {type, value, desc}

const _specWeapons = [
  // ── MELEE SCIMITARS (smithable, no spec) ─────────────────────────
  { id:'bronze_scimitar',  name:'Bronze Scimitar',  level:1,  smith:1,  bar:'bronze_bar',  barQty:3, stats:{attackBonus:8,strengthBonus:7},   speed:2.2, style:'melee', rarity:'common',   desc:'A curved bronze blade. Fast attacks.' },
  { id:'iron_scimitar',    name:'Iron Scimitar',    level:10, smith:10, bar:'iron_bar',    barQty:3, stats:{attackBonus:16,strengthBonus:14},  speed:2.2, style:'melee', rarity:'common',   desc:'A reliable iron scimitar.' },
  { id:'steel_scimitar',   name:'Steel Scimitar',   level:20, smith:20, bar:'steel_bar',   barQty:3, stats:{attackBonus:27,strengthBonus:23},  speed:2.0, style:'melee', rarity:'uncommon', desc:'A keen steel scimitar.' },
  { id:'mithril_scimitar', name:'Mithril Scimitar', level:30, smith:30, bar:'mithril_bar', barQty:4, stats:{attackBonus:40,strengthBonus:36},  speed:2.0, style:'melee', rarity:'uncommon', desc:'A light mithril scimitar.' },
  { id:'adamant_scimitar', name:'Adamant Scimitar', level:40, smith:40, bar:'adamant_bar', barQty:4, stats:{attackBonus:55,strengthBonus:50},  speed:1.8, style:'melee', rarity:'rare',     desc:'An adamant scimitar with brutal edge.' },
  { id:'runite_scimitar',  name:'Rune Scimitar',    level:50, smith:55, bar:'runite_bar',  barQty:4, stats:{attackBonus:70,strengthBonus:64},  speed:1.8, style:'melee', rarity:'rare',     desc:'A rune scimitar. Standard of melee combat.' },

  // ── MELEE LONGSWORDS (smithable, higher str, slower) ────────────
  { id:'steel_longsword',   name:'Steel Longsword',   level:20, smith:25, bar:'steel_bar',   barQty:4, stats:{attackBonus:24,strengthBonus:30},  speed:2.8, style:'melee', rarity:'uncommon', desc:'Slower but harder hitting than scimitars.' },
  { id:'mithril_longsword', name:'Mithril Longsword', level:30, smith:35, bar:'mithril_bar', barQty:5, stats:{attackBonus:36,strengthBonus:44},  speed:2.6, style:'melee', rarity:'uncommon', desc:'A heavy mithril longsword.' },
  { id:'adamant_longsword', name:'Adamant Longsword', level:40, smith:45, bar:'adamant_bar', barQty:5, stats:{attackBonus:50,strengthBonus:60},  speed:2.4, style:'melee', rarity:'rare',     desc:'Crushes through armour.' },
  { id:'runite_longsword',  name:'Rune Longsword',    level:50, smith:60, bar:'runite_bar',  barQty:5, stats:{attackBonus:65,strengthBonus:78},  speed:2.4, style:'melee', rarity:'rare',     desc:'The finest smithable longsword.' },

  // ── MELEE SPEC WEAPONS ────────────────────────────────────────────
  { id:'dragon_dagger',      name:'Dragon Dagger (p++)', level:60, rarity:'epic',
    stats:{attackBonus:62,strengthBonus:60},   speed:1.4, style:'melee',
    specCost:25, specEffect:{type:'doubleHit',mult:1.15,poisonChance:0.50},
    desc:'Spec: 2 rapid hits at 115% damage + 50% poison. 25% spec.' },
  { id:'granite_maul',       name:'Granite Maul',        level:50, rarity:'rare',
    stats:{attackBonus:55,strengthBonus:80},   speed:3.2, style:'melee',
    specCost:50, specEffect:{type:'instaSmash',mult:1.60,ignoreDefPct:25},
    desc:'A brutal granite maul. Spec: Instant 160% hit ignoring 25% def. 50% spec.' },
  { id:'abyssal_whip',       name:'Abyssal Whip',        level:70, rarity:'epic',
    stats:{attackBonus:82,strengthBonus:76},   speed:1.6, style:'melee',
    specCost:50, specEffect:{type:'energyDrain',mult:1.25,drainPct:10},
    desc:'Spec: 125% hit + drains 10% enemy HP as damage. 50% spec.' },
  { id:'saradomin_sword',    name:'Saradomin Sword',     level:65, rarity:'epic',
    stats:{attackBonus:72,strengthBonus:92},   speed:2.4, style:'melee',
    specCost:50, specEffect:{type:'holyStrike',mult:1.45,healPct:20},
    desc:'Holy blade. Spec: 145% damage, heal 20% of damage dealt. 50% spec.' },
  { id:'bandos_godsword',    name:'Bandos Godsword',     level:75, rarity:'legendary',
    stats:{attackBonus:88,strengthBonus:108},  speed:3.0, style:'melee',
    specCost:50, specEffect:{type:'warcry',mult:1.10,defReduce:10,duration:5},
    desc:'Spec: 110% damage, permanently reduces target defence by 10 per hit. 50% spec.' },
  { id:'armadyl_godsword',   name:'Armadyl Godsword',    level:75, rarity:'legendary',
    stats:{attackBonus:100,strengthBonus:115}, speed:2.8, style:'melee',
    specCost:50, specEffect:{type:'armorPierce',mult:1.50,ignoreDefPct:50},
    desc:'Spec: 150% damage ignoring 50% defence. 50% spec.' },
  { id:'ashfire_blade',      name:'Ashfire Blade',       level:80, rarity:'legendary',
    stats:{attackBonus:112,strengthBonus:122}, speed:2.4, style:'melee',
    specCost:50, specEffect:{type:'burnStrike',mult:1.40,burnStacks:3},
    desc:'Forged in the Ashfall. Spec: 140% + 3 guaranteed burn stacks. 50% spec.' },
  { id:'dragonite_greataxe', name:'Dragonite Greataxe',  level:85, rarity:'mythic',
    stats:{attackBonus:122,strengthBonus:140}, speed:3.4, style:'melee',
    specCost:75, specEffect:{type:'dragonFury',mult:2.0,burnStacks:5,ignoreDefPct:30},
    desc:'A dragonite war axe. Spec: 200% hit + 5 burn stacks + 30% def ignored. 75% spec.' },
  { id:'voidreaper',         name:'Voidreaper',           level:90, rarity:'mythic',
    stats:{attackBonus:132,strengthBonus:152}, speed:2.6, style:'melee',
    specCost:100, specEffect:{type:'execute',mult:2.0,healPct:50},
    desc:'The Voidreaper. Spec: 200% damage + heal 50% of damage dealt. 100% spec.' },
  { id:'ashen_overlord_blade',name:"Overlord's Greatblade",level:92, rarity:'mythic',
    stats:{attackBonus:140,strengthBonus:160}, speed:3.0, style:'melee',
    specCost:50, specEffect:{type:'infernoSlam',mult:1.80,burnStacks:8,aoe:true},
    desc:"The Ashen Overlord's personal weapon. Spec: 180% + 8 burn stacks. 50% spec." },

  // ── RANGED SPEC WEAPONS ───────────────────────────────────────────
  { id:'maple_shortbow',   name:'Maple Shortbow',   level:30, smith:30, bar:null, barQty:0, stats:{rangedBonus:30,attackBonus:0}, speed:2.4, style:'ranged', rarity:'uncommon', desc:'A light maple shortbow. Fast attack speed.' },
  { id:'yew_longbow',      name:'Yew Longbow',      level:45, smith:45, bar:null, barQty:0, stats:{rangedBonus:48,attackBonus:0}, speed:3.0, style:'ranged', rarity:'rare',     desc:'Heavy but hard-hitting yew longbow.' },
  { id:'magic_shortbow',   name:'Magic Shortbow',   level:55, smith:55, bar:null, barQty:0, stats:{rangedBonus:62,attackBonus:0}, speed:2.2, style:'ranged', rarity:'rare',
    specCost:50, specEffect:{type:'rapidFire',mult:1.0,shots:3},
    desc:'Fires magic-infused arrows. Spec: Fire 3 arrows simultaneously. 50% spec.' },
  { id:'dark_bow',         name:'Dark Bow',         level:60, rarity:'epic',
    stats:{rangedBonus:78,attackBonus:0},  speed:3.0, style:'ranged',
    specCost:50, specEffect:{type:'doubleShot',mult:1.30},
    desc:'Fires two arrows. Spec: 2 hits at 130% each. 50% spec.' },
  { id:'armadyl_crossbow', name:'Armadyl Crossbow', level:75, rarity:'legendary',
    stats:{rangedBonus:100,attackBonus:0}, speed:2.4, style:'ranged',
    specCost:25, specEffect:{type:'piercing',mult:1.20,ignoreDefPct:100},
    desc:'Spec: 120% damage ignoring ALL defence. 25% spec.' },
  { id:'twisted_bow',      name:'Twisted Bow',      level:85, rarity:'mythic',
    stats:{rangedBonus:122,attackBonus:0}, speed:2.4, style:'ranged',
    specCost:75, specEffect:{type:'magicLeech',mult:1.0,scaleMagic:true},
    desc:'Scales with target magic level — the more magic the harder it hits. Spec: 3 rapid shots at 80% each. 75% spec.' },
  { id:'zaryte_crossbow',  name:'Zaryte Crossbow',  level:90, rarity:'mythic',
    stats:{rangedBonus:140,attackBonus:0}, speed:2.0, style:'ranged',
    specCost:50, specEffect:{type:'voidShot',mult:1.50,ignoreDefPct:75,poisonChance:0.80},
    desc:'A crossbow forged from void metal. Spec: 150% + 75% def ignored + 80% poison. 50% spec.' },

  // ── MAGIC SPEC WEAPONS ────────────────────────────────────────────
  { id:'master_wand',       name:'Master Wand',         level:40, rarity:'rare',
    stats:{magicBonus:40,attackBonus:10},   speed:2.0, style:'magic',
    specCost:50, specEffect:{type:'manaFlood',mult:1.30,splashChance:0.40},
    desc:'Spec: 130% magic damage + 40% splash to nearby enemies. 50% spec.' },
  { id:'staff_of_the_dead', name:'Staff of the Dead',   level:65, rarity:'epic',
    stats:{magicBonus:72,attackBonus:28},   speed:2.4, style:'magic', providesRune:'death_rune',
    specCost:50, specEffect:{type:'magicShield',reduceDmg:50,duration:10},
    desc:'Unlimited death runes. Spec: Reduce incoming damage 50% for 10 attacks. 50% spec.' },
  { id:'toxic_staff',       name:'Toxic Trident',       level:70, rarity:'epic',
    stats:{magicBonus:80,attackBonus:15},   speed:2.2, style:'magic',
    specCost:25, specEffect:{type:'venomCoat',poisonStacks:4,poisonChance:1.0},
    desc:'Spec: Guaranteed 4-stack poison on target. 25% spec.' },
  { id:'kodai_wand',        name:'Kodai Wand',          level:80, rarity:'legendary',
    stats:{magicBonus:95,attackBonus:20},   speed:2.0, style:'magic', providesAllRunes:false,
    specCost:25, specEffect:{type:'runeRecovery',chance:0.35},
    desc:'30% passive rune save. Spec: 35% chance to fully restore runes used this cast. 25% spec.' },
  { id:'sanguinesti_staff', name:'Sanguinesti Staff',   level:82, rarity:'legendary',
    stats:{magicBonus:108,attackBonus:22},  speed:2.2, style:'magic',
    specCost:50, specEffect:{type:'bloodSurge',mult:1.40,healPct:30,drain:true},
    desc:'Blood magic staff. Spec: 140% magic damage + heal 30% as HP + drain stats. 50% spec.' },
  { id:'void_emperor_staff',name:"Void Emperor's Staff",level:90, rarity:'mythic',
    stats:{magicBonus:130,attackBonus:28},  speed:2.4, style:'magic', providesAllRunes:true,
    specCost:100, specEffect:{type:'realityRend',mult:3.0,ignoreDefPct:100,voidPierce:true},
    desc:'Unlimited all runes. Spec: 300% magic damage ignoring ALL defence. 100% spec.' },
];

for (const w of _specWeapons) {
  if (!GAME_DATA.items[w.id]) {
    GAME_DATA.items[w.id] = {
      id:w.id, name:w.name, type:'weapon', slot:'weapon', stats:w.stats,
      attackSpeed:w.speed, style:w.style, levelReq:{attack:w.level},
      sellPrice:w.barQty ? w.barQty*80*(w.level+1) : 5000*(w.level),
      rarity:w.rarity, desc:w.desc,
    };
    if (w.specCost) {
      GAME_DATA.items[w.id].specCost = w.specCost;
      GAME_DATA.items[w.id].specEffect = w.specEffect;
    }
  }
  // Smithing recipe for non-special scimitars
  if (w.bar && !GAME_DATA.recipes.smithing.find(r=>r.id==='smith_'+w.id)) {
    GAME_DATA.recipes.smithing.push({
      id:'smith_'+w.id, name:w.name, level:w.smith||w.level,
      xp:(w.barQty||3)*15, time:6.0,
      input:[{item:w.bar,qty:w.barQty||3}], output:{item:w.id,qty:1},
    });
  }
}

// ── BOWS ─────────────────────────────────────────────────
const _bows = [
  {id:'oak_shortbow',  name:'Oak Shortbow',   level:5,  rng:8,  speed:1.8, log:'oak_log',    logQty:2, fletch:5,  rarity:'common'},
  {id:'willow_shortbow',name:'Willow Shortbow',level:20, rng:16, speed:1.8, log:'willow_log', logQty:2, fletch:20, rarity:'uncommon'},
  {id:'maple_shortbow', name:'Maple Shortbow', level:35, rng:26, speed:1.6, log:'maple_log',  logQty:3, fletch:35, rarity:'uncommon'},
  {id:'yew_shortbow',   name:'Yew Shortbow',   level:50, rng:38, speed:1.6, log:'yew_log',    logQty:3, fletch:50, rarity:'rare'},
  {id:'elder_shortbow', name:'Elder Shortbow',  level:65, rng:50, speed:1.4, log:'elder_log',  logQty:4, fletch:65, rarity:'epic'},
  {id:'oak_longbow',    name:'Oak Longbow',     level:10, rng:12, speed:2.8, log:'oak_log',    logQty:3, fletch:10, rarity:'common'},
  {id:'yew_longbow',    name:'Yew Longbow',     level:55, rng:48, speed:2.8, log:'yew_log',    logQty:4, fletch:55, rarity:'rare'},
  {id:'elder_longbow',  name:'Elder Longbow',   level:70, rng:62, speed:3.0, log:'elder_log',  logQty:5, fletch:70, rarity:'epic'},
];
for (const b of _bows) {
  if (!GAME_DATA.items[b.id]) {
    GAME_DATA.items[b.id] = {
      id:b.id, name:b.name, type:'weapon', slot:'weapon',
      stats:{rangedBonus:b.rng}, attackSpeed:b.speed, style:'ranged',
      levelReq:{ranged:b.level}, sellPrice:b.logQty*30*(b.level+1),
      rarity:b.rarity, desc:`${b.name}. +${b.rng} Ranged bonus.`,
    };
  }
  if (!GAME_DATA.recipes.fletching.find(r=>r.id==='fletch_'+b.id)) {
    GAME_DATA.recipes.fletching.push({
      id:'fletch_'+b.id, name:b.name, level:b.fletch,
      xp:b.logQty*12, time:5.0,
      input:[{item:b.log,qty:b.logQty},{item:'feather',qty:3}], output:{item:b.id,qty:1},
    });
  }
}

// ── STAVES ───────────────────────────────────────────────
const _staves = [
  {id:'staff_of_air',  name:'Staff of Air',   level:1,  mag:5,  atk:3,  rarity:'common',  desc:'Basic air staff. Unlimited air runes.',                          providesRune:'air_rune'},
  {id:'staff_of_fire', name:'Staff of Fire',  level:10, mag:10, atk:6,  rarity:'common',  desc:'Basic fire staff. Unlimited fire runes.',                        providesRune:'fire_rune'},
  {id:'staff_of_water',name:'Staff of Water', level:10, mag:10, atk:6,  rarity:'common',  desc:'Basic water staff. Unlimited water runes.',                      providesRune:'water_rune'},
  {id:'staff_of_earth',name:'Staff of Earth', level:10, mag:10, atk:6,  rarity:'common',  desc:'Basic earth staff. Unlimited earth runes.',                      providesRune:'earth_rune'},
  {id:'mystic_staff',  name:'Mystic Staff',   level:30, mag:20, atk:12, rarity:'uncommon', desc:'A mystic staff. Unlimited chaos runes.',                         providesRune:'chaos_rune'},
  {id:'void_staff',    name:'Void Staff',     level:55, mag:38, atk:20, rarity:'rare',     desc:'Channels void energy. Unlimited death & chaos runes.',           providesRune:['death_rune','chaos_rune']},
  {id:'elder_staff',   name:'Elder Staff',    level:75, mag:55, atk:28, rarity:'epic',     desc:'Ancient elder staff. Unlimited all elemental & combat runes.',   providesAllRunes:true},
];
for (const st of _staves) {
  if (!GAME_DATA.items[st.id]) {
    GAME_DATA.items[st.id] = {
      id:st.id, name:st.name, type:'weapon', slot:'weapon',
      stats:{magicBonus:st.mag, attackBonus:st.atk}, attackSpeed:2.4, style:'magic',
      levelReq:{magic:st.level}, sellPrice:500*(st.level+1),
      rarity:st.rarity, desc:st.desc,
      ...(st.providesRune  ? {providesRune: st.providesRune}   : {}),
      ...(st.providesAllRunes ? {providesAllRunes: true}       : {}),
    };
  }
}

// Add spec weapons and bows to shop
for (const w of _specWeapons.filter(w=>!w.bar)) {
  GAME_DATA.shop.push({item:w.id, price:w.level*2000, category:'weapons'});
}
GAME_DATA.shop.push(
  {item:'staff_of_air',price:2000,category:'weapons'},
  {item:'staff_of_fire',price:3000,category:'weapons'},
  {item:'staff_of_water',price:3000,category:'weapons'},
  {item:'staff_of_earth',price:3000,category:'weapons'},
);

console.log('[Ashfall] Combat Items loaded');
console.log('  Armor sets:', _armorSets.length, 'melee +', _rangedSets.length, 'ranged +', _mageSets.length, 'mage');
console.log('  Spec weapons:', _specWeapons.filter(w=>w.specCost).length);
console.log('  Bows:', _bows.length, '| Staves:', _staves.length);
console.log('  Total items:', Object.keys(GAME_DATA.items).length);
console.log('  Total recipes:', Object.values(GAME_DATA.recipes).reduce((a,r)=>a+r.length,0));

// ── RECIPE CATEGORIES ────────────────────────────────────
// Assign categories to smithing recipes for organized display
(function categorizeSmithing() {
  for (const r of GAME_DATA.recipes.smithing) {
    if (r.category) continue; // already set
    const id = r.id.toLowerCase();
    if (id.startsWith('smelt_'))          r.category = 'Bars';
    else if (id.includes('_scimitar'))    r.category = 'Scimitars';
    else if (id.includes('_sword') || id.includes('_blade') || id.includes('_longsword')) r.category = 'Swords';
    else if (id.includes('_axe') || id.includes('_mace') || id.includes('_dagger')) r.category = 'Weapons';
    else if (id.includes('_helm'))        r.category = 'Helms';
    else if (id.includes('_plate'))       r.category = 'Platebodies';
    else if (id.includes('_legs'))        r.category = 'Platelegs';
    else if (id.includes('_boots'))       r.category = 'Boots';
    else if (id.includes('_gloves') || id.includes('_gauntlet')) r.category = 'Gauntlets';
    else if (id.includes('_shield'))      r.category = 'Shields';
    else if (id.includes('_pickaxe'))     r.category = 'Pickaxes';
    else if (id.includes('_hatchet'))     r.category = 'Hatchets';
    else r.category = 'Other';
  }
  // Categorize cooking
  for (const r of GAME_DATA.recipes.cooking) {
    if (r.category) continue;
    r.category = 'Cooking';
  }
  // Categorize fletching
  for (const r of GAME_DATA.recipes.fletching) {
    if (r.category) continue;
    const id = r.id.toLowerCase();
    if (id.includes('arrow'))        r.category = 'Arrows';
    else if (id.includes('bow'))     r.category = 'Bows';
    else if (id.includes('rod'))     r.category = 'Fishing Rods';
    else r.category = 'Other';
  }
  // Categorize crafting
  for (const r of GAME_DATA.recipes.crafting) {
    if (r.category) continue;
    const id = r.id.toLowerCase();
    if (id.includes('ring'))         r.category = 'Rings';
    else if (id.includes('amulet') || id.includes('necklace')) r.category = 'Amulets';
    else if (id.includes('coif') || id.includes('body') || id.includes('chaps') || id.includes('vamb') || id.includes('leather')) r.category = 'Ranged Armor';
    else if (id.includes('bracelet') || id.includes('cape') || id.includes('gloves')) r.category = 'Accessories';
    else r.category = 'Other';
  }
  // Categorize incantation
  for (const r of GAME_DATA.recipes.incantation) {
    if (r.category) continue;
    if (r.id.includes('_x10'))       r.category = 'Bulk Crafting';
    else r.category = 'Runes';
  }
  // Categorize enchanting
  for (const r of (GAME_DATA.recipes.enchanting||[])) {
    if (r.category) continue;
    const id = r.id.toLowerCase();
    if (id.includes('weapon') || id.includes('sword') || id.includes('staff') || id.includes('bow')) r.category = 'Enchant Weapons';
    else if (id.includes('helm') || id.includes('plate') || id.includes('legs') || id.includes('shield') || id.includes('robe')) r.category = 'Enchant Armor';
    else r.category = 'Enchant Other';
  }
  // Categorize alchemy
  for (const r of (GAME_DATA.recipes.alchemy||[])) {
    if (r.category) continue;
    const id = r.id.toLowerCase();
    if (id.includes('potion'))       r.category = 'Potions';
    else r.category = 'Transmutation';
  }
  console.log('[Ashfall] Recipe categories assigned');
})();

// ── FIX SHOP DUPLICATES ──────────────────────────────────
(function dedupeShop() {
  const seen = new Set();
  GAME_DATA.shop = GAME_DATA.shop.filter(si => {
    if (seen.has(si.item)) return false;
    seen.add(si.item);
    return true;
  });
  console.log('[Ashfall] Shop deduped:', GAME_DATA.shop.length, 'items');
})();
