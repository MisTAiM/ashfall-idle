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
    stats:{head:{def:3},body:{def:6},legs:{def:5},boots:{def:2},gloves:{def:1},shield:{def:4}},
    barCost:{head:3,body:5,legs:4,boots:2,gloves:2,shield:3} },
  { tier:'iron', name:'Iron', level:10, smith:10, bar:'iron_bar', rarity:'common',
    stats:{head:{def:6},body:{def:12},legs:{def:10},boots:{def:4},gloves:{def:3},shield:{def:8}},
    barCost:{head:3,body:5,legs:4,boots:2,gloves:2,shield:3} },
  { tier:'steel', name:'Steel', level:20, smith:20, bar:'steel_bar', rarity:'uncommon',
    stats:{head:{def:10},body:{def:20},legs:{def:16},boots:{def:7},gloves:{def:5},shield:{def:14}},
    barCost:{head:4,body:6,legs:5,boots:3,gloves:2,shield:4} },
  { tier:'mithril', name:'Mithril', level:30, smith:30, bar:'mithril_bar', rarity:'uncommon',
    stats:{head:{def:15},body:{def:30},legs:{def:24},boots:{def:10},gloves:{def:8},shield:{def:20}},
    barCost:{head:4,body:6,legs:5,boots:3,gloves:3,shield:4} },
  { tier:'adamant', name:'Adamant', level:40, smith:40, bar:'adamant_bar', rarity:'rare',
    stats:{head:{def:22},body:{def:42},legs:{def:34},boots:{def:14},gloves:{def:12},shield:{def:28}},
    barCost:{head:5,body:7,legs:6,boots:3,gloves:3,shield:5} },
  { tier:'runite', name:'Runite', level:50, smith:55, bar:'runite_bar', rarity:'rare',
    stats:{head:{def:30},body:{def:56},legs:{def:46},boots:{def:20},gloves:{def:16},shield:{def:38}},
    barCost:{head:5,body:8,legs:6,boots:4,gloves:3,shield:5} },
  { tier:'obsidian', name:'Obsidian', level:60, smith:65, bar:'obsidian_bar', rarity:'epic',
    stats:{head:{def:38},body:{def:70},legs:{def:58},boots:{def:26},gloves:{def:22},shield:{def:48,dr:2}},
    barCost:{head:6,body:9,legs:7,boots:4,gloves:4,shield:6} },
  { tier:'ashsteel', name:'Ashsteel', level:75, smith:80, bar:'ashsteel_bar', rarity:'legendary',
    stats:{head:{def:48,dr:1},body:{def:88,dr:2},legs:{def:72,dr:1},boots:{def:34,dr:1},gloves:{def:28},shield:{def:60,dr:3}},
    barCost:{head:7,body:10,legs:8,boots:5,gloves:4,shield:7} },
];

const slotNames = {head:'Helm',body:'Platebody',legs:'Platelegs',boots:'Boots',gloves:'Gauntlets',shield:'Shield'};

for (const set of _armorSets) {
  for (const [slot, slotLabel] of Object.entries(slotNames)) {
    const id = `${set.tier}_${slot === 'body' ? 'plate' : slot === 'legs' ? 'legs' : slot === 'head' ? 'helm' : slot}`;
    const statBlock = {};
    if (set.stats[slot].def) statBlock.defenceBonus = set.stats[slot].def;
    if (set.stats[slot].dr) statBlock.damageReduction = set.stats[slot].dr;
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
    stats:{head:{rng:3,def:1},body:{rng:6,def:3},legs:{rng:4,def:2},boots:{rng:2,def:1},gloves:{rng:2,def:1}},
    matCost:{head:3,body:6,legs:5,boots:2,gloves:2} },
  { tier:'hard_leather', name:'Hard Leather', level:20, rarity:'uncommon', mat:'hard_leather',
    stats:{head:{rng:8,def:4},body:{rng:16,def:8},legs:{rng:12,def:6},boots:{rng:5,def:3},gloves:{rng:5,def:3}},
    matCost:{head:4,body:7,legs:5,boots:3,gloves:3} },
  { tier:'dragonhide', name:'Dragonhide', level:50, rarity:'rare', mat:'hard_leather',
    stats:{head:{rng:16,def:10},body:{rng:32,def:18},legs:{rng:24,def:14},boots:{rng:12,def:6},gloves:{rng:10,def:5}},
    matCost:{head:5,body:8,legs:6,boots:3,gloves:3} },
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
    stats:{head:{mag:8,def:3},body:{mag:16,def:6},legs:{mag:12,def:4}}, craft:20 },
  { tier:'adept', name:'Adept', level:40, rarity:'rare',
    stats:{head:{mag:16,def:8},body:{mag:30,def:14},legs:{mag:24,def:10}}, craft:40 },
  { tier:'archmage', name:'Archmage', level:65, rarity:'epic',
    stats:{head:{mag:28,def:14},body:{mag:50,def:24},legs:{mag:40,def:18}}, craft:60 },
  { tier:'elder', name:'Elder', level:80, rarity:'legendary',
    stats:{head:{mag:38,def:20,dr:1},body:{mag:66,def:32,dr:2},legs:{mag:54,def:26,dr:1}}, craft:75 },
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
  // Melee
  { id:'bronze_scimitar', name:'Bronze Scimitar', level:1, smith:1, bar:'bronze_bar', barQty:3,
    stats:{attackBonus:6,strengthBonus:5}, speed:2.2, style:'melee', rarity:'common',
    desc:'A curved bronze blade.' },
  { id:'iron_scimitar', name:'Iron Scimitar', level:10, smith:10, bar:'iron_bar', barQty:3,
    stats:{attackBonus:12,strengthBonus:10}, speed:2.2, style:'melee', rarity:'common',
    desc:'A reliable iron scimitar.' },
  { id:'steel_scimitar', name:'Steel Scimitar', level:20, smith:20, bar:'steel_bar', barQty:3,
    stats:{attackBonus:20,strengthBonus:16}, speed:2.0, style:'melee', rarity:'uncommon',
    desc:'A keen steel scimitar.' },
  { id:'mithril_scimitar', name:'Mithril Scimitar', level:30, smith:30, bar:'mithril_bar', barQty:4,
    stats:{attackBonus:28,strengthBonus:24}, speed:2.0, style:'melee', rarity:'uncommon',
    desc:'A light mithril scimitar.' },
  { id:'adamant_scimitar', name:'Adamant Scimitar', level:40, smith:40, bar:'adamant_bar', barQty:4,
    stats:{attackBonus:38,strengthBonus:34}, speed:1.8, style:'melee', rarity:'rare',
    desc:'An adamant scimitar with brutal edge.' },
  { id:'runite_scimitar', name:'Rune Scimitar', level:50, smith:55, bar:'runite_bar', barQty:4,
    stats:{attackBonus:48,strengthBonus:44}, speed:1.8, style:'melee', rarity:'rare',
    desc:'A rune scimitar. The standard of melee combat.' },

  // Special attack weapons
  { id:'dragon_dagger', name:'Dragon Dagger (p++)', level:60, rarity:'epic',
    stats:{attackBonus:42,strengthBonus:40}, speed:1.4, style:'melee',
    specCost:25, specEffect:{type:'doubleHit',mult:1.15,poisonChance:0.50},
    desc:'Dragon dagger with super poison. Spec: 2 rapid hits at 115% damage, 50% poison. 25% spec.' },
  { id:'abyssal_whip', name:'Abyssal Whip', level:70, rarity:'epic',
    stats:{attackBonus:58,strengthBonus:52}, speed:1.6, style:'melee',
    specCost:50, specEffect:{type:'energyDrain',mult:1.25,drainPct:10},
    desc:'A whip made from abyssal tentacles. Spec: 125% hit + drains 10% enemy HP. 50% spec.' },
  { id:'armadyl_godsword', name:'Armadyl Godsword', level:75, rarity:'legendary',
    stats:{attackBonus:72,strengthBonus:80}, speed:2.8, style:'melee',
    specCost:50, specEffect:{type:'armorPierce',mult:1.50,ignoreDefPct:50},
    desc:'The Armadyl Godsword. Spec: 150% damage ignoring 50% defence. 50% spec.' },
  { id:'ashfire_blade', name:'Ashfire Blade', level:80, rarity:'legendary',
    stats:{attackBonus:82,strengthBonus:88}, speed:2.4, style:'melee',
    specCost:50, specEffect:{type:'burnStrike',mult:1.40,burnStacks:3},
    desc:'Forged in the Ashfall. Spec: 140% + 3 burn stacks guaranteed. 50% spec.' },
  { id:'voidreaper', name:'Voidreaper', level:90, rarity:'mythic',
    stats:{attackBonus:95,strengthBonus:100}, speed:2.6, style:'melee',
    specCost:100, specEffect:{type:'execute',mult:2.0,healPct:50},
    desc:'The Voidreaper. Spec: 200% damage + heal 50% of damage dealt. 100% spec.' },

  // Ranged spec weapons
  { id:'dark_bow', name:'Dark Bow', level:60, rarity:'epic',
    stats:{rangedBonus:50,attackBonus:0}, speed:3.0, style:'ranged',
    specCost:50, specEffect:{type:'doubleShot',mult:1.30},
    desc:'Fires two shots. Spec: 2 hits at 130% each. 50% spec.' },
  { id:'armadyl_crossbow', name:'Armadyl Crossbow', level:75, rarity:'legendary',
    stats:{rangedBonus:72,attackBonus:0}, speed:2.4, style:'ranged',
    specCost:25, specEffect:{type:'piercing',mult:1.20,ignoreDefPct:100},
    desc:'Holy crossbow. Spec: 120% damage ignoring ALL defence. 25% spec.' },

  // Magic spec weapons
  { id:'staff_of_the_dead', name:'Staff of the Dead', level:65, rarity:'epic',
    stats:{magicBonus:50,attackBonus:20}, speed:2.4, style:'magic',
    specCost:50, specEffect:{type:'magicShield',reduceDmg:50,duration:10},
    desc:'Undead staff. Spec: Reduce incoming damage 50% for 10 attacks. 50% spec.' },
  { id:'kodai_wand', name:'Kodai Wand', level:80, rarity:'legendary',
    stats:{magicBonus:70,attackBonus:10}, speed:2.0, style:'magic',
    specCost:25, specEffect:{type:'runeRecovery',chance:0.30},
    desc:'Ancient wand. Spec: 30% chance to not consume runes for 15 casts. 25% spec.' },
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
  {id:'staff_of_air',  name:'Staff of Air',   level:1,  mag:5,  atk:3,  rarity:'common',  desc:'Basic air staff. Unlimited air runes.'},
  {id:'staff_of_fire', name:'Staff of Fire',  level:10, mag:10, atk:6,  rarity:'common',  desc:'Basic fire staff. Unlimited fire runes.'},
  {id:'staff_of_water',name:'Staff of Water', level:10, mag:10, atk:6,  rarity:'common',  desc:'Basic water staff. Unlimited water runes.'},
  {id:'staff_of_earth',name:'Staff of Earth', level:10, mag:10, atk:6,  rarity:'common',  desc:'Basic earth staff. Unlimited earth runes.'},
  {id:'mystic_staff',  name:'Mystic Staff',   level:30, mag:20, atk:12, rarity:'uncommon', desc:'A mystic staff with moderate power.'},
  {id:'void_staff',    name:'Void Staff',     level:55, mag:38, atk:20, rarity:'rare',     desc:'Channels void energy.'},
  {id:'elder_staff',   name:'Elder Staff',    level:75, mag:55, atk:28, rarity:'epic',     desc:'Ancient elder staff of immense power.'},
];
for (const st of _staves) {
  if (!GAME_DATA.items[st.id]) {
    GAME_DATA.items[st.id] = {
      id:st.id, name:st.name, type:'weapon', slot:'weapon',
      stats:{magicBonus:st.mag, attackBonus:st.atk}, attackSpeed:2.4, style:'magic',
      levelReq:{magic:st.level}, sellPrice:500*(st.level+1),
      rarity:st.rarity, desc:st.desc,
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
