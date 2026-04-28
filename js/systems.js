// ================================================================
// ASHFALL IDLE - Systems Expansion v9.0
// Ore Bag, Mining Events, Weapon Affixes, Enhanced Status Effects
// Loaded AFTER all items, BEFORE engine.js
// ================================================================

// ══════════════════════════════════════════════════════════
// 1. ORE BAG SYSTEM
// ══════════════════════════════════════════════════════════
GAME_DATA.oreBagConfig = {
  baseCapacity: 100,
  upgradeMultiplier: 1.5, // each upgrade multiplies capacity
  maxUpgrades: 10,
  autoCompressUnlockLevel: 40,
  autoRefineUnlockLevel: 60,
  oreTypes: [
    'copper_ore','tin_ore','iron_ore','coal_ore','gold_ore',
    'mithril_ore','adamant_ore','runite_ore','obsidian_ore','ashsteel_ore',
  ],
};

// ══════════════════════════════════════════════════════════
// 2. MINING RANDOM EVENTS
// ══════════════════════════════════════════════════════════
GAME_DATA.miningEvents = {
  theft: {
    name: 'Goblin Thief',
    description: 'A goblin snatches some of your ores!',
    baseChance: 0.005, // 0.5% per tick, reduced by security
    lossRange: [0.02, 0.10], // 2-10% of current ores lost
  },
  monsterEncounter: {
    name: 'Cave Monster',
    description: 'A monster emerges from the rock!',
    baseChance: 0.01, // 1% per tick, scaled by danger
    monsters: {
      1:  {name:'Cave Spider',    hp:40,  maxHit:5,  xp:30,  gold:5},
      10: {name:'Rock Golem',     hp:120, maxHit:12, xp:80,  gold:25},
      20: {name:'Crystal Elemental',hp:200,maxHit:18,xp:150, gold:50},
      30: {name:'Lava Wurm',      hp:350, maxHit:25, xp:250, gold:100},
      40: {name:'Deep Dweller',   hp:500, maxHit:32, xp:400, gold:200},
      50: {name:'Ore Guardian',   hp:700, maxHit:40, xp:600, gold:350},
      60: {name:'Gem Construct',  hp:900, maxHit:48, xp:800, gold:500},
      70: {name:'Magma Titan',    hp:1200,maxHit:55, xp:1100,gold:700},
    },
  },
  bonusFind: {
    name: 'Rich Vein',
    description: 'You strike a rich ore vein!',
    baseChance: 0.003, // 0.3% per tick, boosted by luck
    multiplierRange: [5, 20], // 5-20x base yield
  },
  gemFind: {
    name: 'Gem Discovery',
    description: 'A precious gem glints in the rock!',
    baseChance: 0.008,
    gems: [
      {item:'sapphire',weight:10}, {item:'emerald',weight:7},
      {item:'ruby',weight:5}, {item:'diamond',weight:2},
    ],
  },
  caveIn: {
    name: 'Cave-In',
    description: 'The tunnel collapses! Mining interrupted.',
    baseChance: 0.002,
    stunDuration: 3, // seconds lost
  },
  ancientDeposit: {
    name: 'Ancient Deposit',
    description: 'You uncover an ancient ore deposit!',
    baseChance: 0.001, // very rare
    // Gives ore 2 tiers above current
  },
};

// Mining event SVG art
GAME_DATA.miningEventArt = {
  theft: `<svg viewBox="0 0 48 48"><circle cx="24" cy="20" r="8" fill="#5a8a3a"/><circle cx="21" cy="18" r="2" fill="#ff0"/><circle cx="27" cy="18" r="2" fill="#ff0"/><path d="M18 12 L14 6" stroke="#5a8a3a" stroke-width="2"/><path d="M30 12 L34 6" stroke="#5a8a3a" stroke-width="2"/><rect x="20" y="28" width="8" height="10" rx="2" fill="#5a8a3a"/><ellipse cx="24" cy="40" rx="10" ry="4" fill="#3a2a1a" opacity="0.3"/><rect x="30" y="24" width="8" height="6" rx="2" fill="#8a6a3a"/><circle cx="34" cy="27" r="2" fill="#d4a83a"/></svg>`,
  monsterEncounter: `<svg viewBox="0 0 48 48"><path d="M10 40 L24 6 L38 40 Z" fill="#555"/><circle cx="24" cy="22" r="8" fill="#8a4a2a"/><circle cx="21" cy="20" r="2.5" fill="#ff4040"/><circle cx="27" cy="20" r="2.5" fill="#ff4040"/><path d="M20 26 Q24 30 28 26" stroke="#5a2a1a" stroke-width="2" fill="none"/><path d="M20 26 L18 27" fill="#fff"/><path d="M28 26 L30 27" fill="#fff"/></svg>`,
  bonusFind: `<svg viewBox="0 0 48 48"><path d="M8 40 L24 8 L40 40 Z" fill="#555"/><path d="M14 34 L24 14 L34 34 Z" fill="#666"/><circle cx="20" cy="26" r="4" fill="#d4a83a"/><circle cx="28" cy="30" r="3" fill="#d4a83a"/><circle cx="24" cy="22" r="3" fill="#e4c84a"/><path d="M18 24 L22 20" stroke="#ffd700" stroke-width="1" opacity="0.6"/><path d="M26 28 L30 24" stroke="#ffd700" stroke-width="1" opacity="0.6"/><circle cx="16" cy="30" r="2" fill="#d4a83a" opacity="0.5"/></svg>`,
  gemFind: `<svg viewBox="0 0 48 48"><polygon points="24,8 32,18 28,32 20,32 16,18" fill="#4a90d0" stroke="#6ab4e8" stroke-width="1"/><polygon points="24,12 28,18 26,28 22,28 20,18" fill="#6ab4e8" opacity="0.5"/><line x1="20" y1="18" x2="28" y2="18" stroke="#8ac4f0" stroke-width="0.5"/><path d="M12 20 L8 18 M36 20 L40 18 M14 30 L10 32 M34 30 L38 32" stroke="#6ab4e8" stroke-width="1" opacity="0.4"/><ellipse cx="24" cy="38" rx="12" ry="4" fill="#2a2a4a" opacity="0.3"/></svg>`,
};

// ══════════════════════════════════════════════════════════
// 3. WEAPON AFFIX SYSTEM
// ══════════════════════════════════════════════════════════
GAME_DATA.weaponPrefixes = {
  offensive: [
    {id:'flaming',   name:'Flaming',   effect:{status:'burn',chance:0.20,stacks:1},  desc:'20% chance to apply burn'},
    {id:'venomous',  name:'Venomous',  effect:{status:'poison',chance:0.25,stacks:1},desc:'25% chance to poison'},
    {id:'brutal',    name:'Brutal',    effect:{critDmgBonus:0.25},                   desc:'+25% crit damage'},
    {id:'sharp',     name:'Sharp',     effect:{flatDmg:5},                           desc:'+5 flat damage'},
    {id:'swift',     name:'Swift',     effect:{atkSpeedBonus:-0.2},                  desc:'-0.2s attack speed'},
    {id:'shocking',  name:'Shocking',  effect:{status:'shock',chance:0.15,stacks:1}, desc:'15% chance to shock (stun)'},
    {id:'ruthless',  name:'Ruthless',  effect:{flatDmg:3,critDmgBonus:0.15},         desc:'+3 dmg, +15% crit dmg'},
    {id:'raging',    name:'Raging',    effect:{dmgBonus:0.10},                       desc:'+10% damage'},
    {id:'heavy',     name:'Heavy',     effect:{flatDmg:8,atkSpeedBonus:0.3},         desc:'+8 dmg, +0.3s slower'},
  ],
  defensive: [
    {id:'guarded',    name:'Guarded',    effect:{defBonus:10},       desc:'+10 defence bonus'},
    {id:'reinforced', name:'Reinforced', effect:{hpBonus:15},        desc:'+15 max HP'},
    {id:'balanced',   name:'Balanced',   effect:{dodgeBonus:0.03},   desc:'+3% dodge chance'},
    {id:'resilient',  name:'Resilient',  effect:{defBonus:5,hpBonus:8}, desc:'+5 def, +8 HP'},
    {id:'warding',    name:'Warding',    effect:{magicDefBonus:12},  desc:'+12 magic defence'},
  ],
};

GAME_DATA.weaponSuffixes = {
  elemental: [
    {id:'of_frost',   name:'of Frost',   effect:{status:'freeze',chance:0.10,stacks:1},  desc:'10% chance to freeze'},
    {id:'of_ruin',    name:'of Ruin',    effect:{bossDmgBonus:0.20},                     desc:'+20% damage to bosses'},
    {id:'of_decay',   name:'of Decay',   effect:{status:'bleed',chance:0.20,stacks:1},   desc:'20% chance to bleed'},
    {id:'of_shadows', name:'of Shadows', effect:{status:'curse',chance:0.15,stacks:1},   desc:'15% chance to curse (-def)'},
    {id:'of_storms',  name:'of Storms',  effect:{status:'shock',chance:0.20,stacks:2},   desc:'20% chance shock x2'},
    {id:'of_flames',  name:'of Flames',  effect:{status:'burn',chance:0.30,stacks:2},    desc:'30% chance burn x2'},
  ],
  utility: [
    {id:'of_theft',     name:'of Theft',     effect:{stealOres:0.05},     desc:'5% chance to steal ores from monster'},
    {id:'of_greed',     name:'of Greed',     effect:{goldBonus:0.25},     desc:'+25% gold from kills'},
    {id:'of_swiftness', name:'of Swiftness', effect:{atkSpeedBonus:-0.15},desc:'-0.15s attack speed'},
    {id:'of_fortune',   name:'of Fortune',   effect:{luckBonus:0.10},     desc:'+10% rare drop chance'},
    {id:'of_vampirism', name:'of Vampirism', effect:{lifesteal:0.08},     desc:'Heal 8% of damage dealt'},
    {id:'of_fury',      name:'of Fury',      effect:{dmgBonus:0.05,critDmgBonus:0.10}, desc:'+5% dmg, +10% crit dmg'},
  ],
};

// ══════════════════════════════════════════════════════════
// 4. ENHANCED STATUS EFFECTS
// ══════════════════════════════════════════════════════════
GAME_DATA.statusEffectDefs = {
  burn: {
    name:'Burn', color:'#ff4040', icon:'fire',
    dps: (stacks, maxHp) => maxHp * (0.01 + 0.01 * stacks),
    duration: 5, maxStacks: 99, type:'dot',
    desc:'Burns for % of max HP per second. Stacks infinitely.',
  },
  poison: {
    name:'Poison', color:'#4abe6c', icon:'skull',
    dps: (stacks, maxHp, atk) => (atk * 0.25) * stacks,
    duration: 8, maxStacks: 99, type:'dot',
    desc:'Deals attack-scaled damage. Stacks infinitely.',
  },
  bleed: {
    name:'Bleed', color:'#c47070', icon:'droplet',
    dps: (stacks, maxHp, atk, lastHit) => lastHit * (0.15 + 0.05 * stacks),
    duration: 3, maxStacks: 99, type:'dot',
    desc:'Bleeds based on last hit. Stacks infinitely.',
  },
  freeze: {
    name:'Freeze', color:'#60c0e0', icon:'snowflake',
    effect: 'atkSpeedReduction', reductionPerStack: 0.10,
    duration: 4, maxStacks: 5, type:'debuff',
    desc:'Slows attack speed 10% per stack. Max 5.',
  },
  shock: {
    name:'Shock', color:'#e0e040', icon:'lightning',
    effect: 'stunChance', chancePerStack: 0.05,
    duration: 2, maxStacks: 3, type:'debuff',
    desc:'5% stun chance per stack. Max 3.',
  },
  curse: {
    name:'Curse', color:'#8a5ec4', icon:'eye',
    effect: 'defReduction', reductionPerStack: 0.05,
    duration: 6, maxStacks: 99, type:'debuff',
    desc:'Reduces defence 5% per stack. Stacks infinitely.',
  },
  radiant: {
    name:'Radiant', color:'#ffd700', icon:'star',
    effect: 'dmgBonus', bonusPerStack: 0.50,
    duration: 3, maxStacks: 1, type:'buff',
    desc:'Next hit deals +50% damage.',
  },
};

// ══════════════════════════════════════════════════════════
// 5. WEAPON SPECIAL ABILITIES (expanded)
// ══════════════════════════════════════════════════════════
GAME_DATA.weaponSpecials = {
  cleave: {
    name:'Cleave', desc:'Hit all enemies for 60% damage.',
    cost:25, type:'aoe', mult:0.60,
  },
  execute: {
    name:'Execute', desc:'Deal 200% damage to enemies below 25% HP.',
    cost:50, type:'execute', mult:2.0, threshold:0.25,
  },
  chain_lightning: {
    name:'Chain Lightning', desc:'Hit up to 3 targets for decreasing damage.',
    cost:50, type:'chain', hits:3, decayMult:0.70,
  },
  soul_drain: {
    name:'Soul Drain', desc:'Deal 120% damage and heal 40% of damage dealt.',
    cost:50, type:'lifesteal', mult:1.20, healPct:0.40,
  },
  overcharge: {
    name:'Overcharge', desc:'Next 5 attacks deal +30% damage.',
    cost:75, type:'buff', buffDuration:5, dmgBonus:0.30,
  },
  whirlwind: {
    name:'Whirlwind', desc:'3 rapid hits at 80% damage each.',
    cost:50, type:'multi', hits:3, mult:0.80,
  },
  shield_bash: {
    name:'Shield Bash', desc:'Stun target for 2 attacks and deal 90% damage.',
    cost:25, type:'stun', stunDuration:2, mult:0.90,
  },
  berserker_rage: {
    name:'Berserker Rage', desc:'+50% damage, -25% defence for 10 attacks.',
    cost:100, type:'stance', duration:10, dmgBonus:0.50, defPenalty:0.25,
  },
};

// ══════════════════════════════════════════════════════════
// 6. AFFIX GENERATION FOR DROPS
// ══════════════════════════════════════════════════════════
// When a weapon drops from a monster, it can roll affixes
// Chance scales with monster combat level and item rarity

GAME_DATA.affixChances = {
  common:    { prefix:0.00, suffix:0.00 },
  uncommon:  { prefix:0.15, suffix:0.10 },
  rare:      { prefix:0.40, suffix:0.30 },
  epic:      { prefix:0.70, suffix:0.60 },
  legendary: { prefix:0.90, suffix:0.85 },
  mythic:    { prefix:1.00, suffix:1.00 },
};

// Function to generate an affixed weapon name
function generateAffixedWeapon(baseItemId) {
  const item = GAME_DATA.items[baseItemId];
  if (!item || item.slot !== 'weapon') return null;
  const rarity = item.rarity || 'common';
  const chances = GAME_DATA.affixChances[rarity] || {prefix:0, suffix:0};

  let prefix = null, suffix = null;

  if (Math.random() < chances.prefix) {
    const pool = Math.random() < 0.7 ? GAME_DATA.weaponPrefixes.offensive : GAME_DATA.weaponPrefixes.defensive;
    prefix = pool[Math.floor(Math.random() * pool.length)];
  }
  if (Math.random() < chances.suffix) {
    const pool = Math.random() < 0.6 ? GAME_DATA.weaponSuffixes.elemental : GAME_DATA.weaponSuffixes.utility;
    suffix = pool[Math.floor(Math.random() * pool.length)];
  }

  if (!prefix && !suffix) return null; // No affixes rolled

  return {
    baseItem: baseItemId,
    prefix: prefix?.id || null,
    suffix: suffix?.id || null,
    name: `${prefix ? prefix.name + ' ' : ''}${item.name}${suffix ? ' ' + suffix.name : ''}`,
    effects: { ...(prefix?.effect || {}), ...(suffix?.effect || {}) },
  };
}

// Make it globally available
if (typeof window !== 'undefined') window.generateAffixedWeapon = generateAffixedWeapon;

// ══════════════════════════════════════════════════════════
// 7. ORE BAG ITEMS & UPGRADES
// ══════════════════════════════════════════════════════════
const _oreBagUpgrades = [
  {id:'ore_bag_upgrade_1', name:'Ore Bag Expansion I',   level:10, cost:5000,   capacity:50,  desc:'+50 ore bag capacity.'},
  {id:'ore_bag_upgrade_2', name:'Ore Bag Expansion II',  level:20, cost:15000,  capacity:100, desc:'+100 ore bag capacity.'},
  {id:'ore_bag_upgrade_3', name:'Ore Bag Expansion III', level:30, cost:40000,  capacity:150, desc:'+150 ore bag capacity.'},
  {id:'ore_bag_upgrade_4', name:'Ore Bag Expansion IV',  level:40, cost:100000, capacity:200, desc:'+200 ore bag capacity.'},
  {id:'ore_bag_upgrade_5', name:'Ore Bag Expansion V',   level:50, cost:250000, capacity:300, desc:'+300 ore bag capacity.'},
  {id:'ore_bag_autocompress',name:'Auto-Compress Module',level:40, cost:150000, desc:'Auto-compress 5 ores into 1 bar when bag is full.'},
  {id:'ore_bag_autosell',    name:'Auto-Sell Module',    level:30, cost:80000,  desc:'Auto-sell lowest tier ores when bag is full.'},
];
for (const u of _oreBagUpgrades) {
  if (!GAME_DATA.items[u.id]) {
    GAME_DATA.items[u.id] = { id:u.id, name:u.name, type:'upgrade', subtype:'ore_bag',
      levelReq:{mining:u.level}, sellPrice:Math.floor(u.cost*0.1), rarity:'uncommon', desc:u.desc };
    GAME_DATA.shop.push({item:u.id, price:u.cost, category:'upgrades'});
  }
}

// ══════════════════════════════════════════════════════════
// 8. COMBAT STAT ENHANCEMENTS (dodge, endurance)
// ══════════════════════════════════════════════════════════
// These formulas are applied via engine patches

GAME_DATA.combatFormulas = {
  // Dodge: based on agility (defence level) + gear
  dodgeChance: (defLevel, agilityBonus) => {
    return Math.min(0.25, 0.01 + defLevel * 0.001 + agilityBonus * 0.001);
  },
  // Crit: base 5% + weapon crit + agility scaling
  critChance: (combatLevel, monsterLevel, weaponCrit) => {
    const levelAdv = Math.max(0, combatLevel - monsterLevel);
    return Math.min(0.30, 0.05 + levelAdv * 0.01 + (weaponCrit || 0));
  },
  // Crit damage: base 1.5x + gear bonuses
  critMultiplier: (baseCritPower) => {
    return 1.5 + (baseCritPower || 0);
  },
  // HP scaling
  maxHP: (hpLevel, enduranceBonus) => {
    return Math.floor((10 + hpLevel) * (1 + (enduranceBonus || 0) / 100));
  },
  // Status effect damage per tick
  statusDPS: (effectId, stacks, maxHp, atk, lastHit) => {
    const def = GAME_DATA.statusEffectDefs[effectId];
    if (!def || !def.dps) return 0;
    return def.dps(stacks, maxHp, atk, lastHit);
  },
};

// ══════════════════════════════════════════════════════════
// 9. ADDITIONAL ORE TYPES
// ══════════════════════════════════════════════════════════
const _extraOres = [
  {id:'obsidian_ore', name:'Obsidian Ore', level:60, xp:120, time:8.0, rarity:'epic',     desc:'Volcanic glass ore. Very rare.'},
  {id:'ashsteel_ore', name:'Ashsteel Ore', level:75, xp:180, time:10.0, rarity:'legendary',desc:'The rarest ore in the Ashfall.'},
];
for (const o of _extraOres) {
  if (!GAME_DATA.items[o.id]) {
    GAME_DATA.items[o.id] = { id:o.id, name:o.name, type:'ore', rarity:o.rarity, desc:o.desc, sellPrice:o.xp*2 };
  }
}

// Add obsidian/ashsteel mining actions if missing
if (GAME_DATA.gatheringActions?.mining) {
  const mActions = GAME_DATA.gatheringActions.mining;
  if (!mActions.find(a=>a.id==='mine_obsidian')) {
    mActions.push(
      {id:'mine_obsidian', name:'Mine Obsidian', level:60, xp:120, time:8.0, loot:[{item:'obsidian_ore',qty:1,chance:1.0}]},
      {id:'mine_ashsteel', name:'Mine Ashsteel', level:75, xp:180, time:10.0, loot:[{item:'ashsteel_ore',qty:1,chance:1.0}]},
    );
  }
}

// Obsidian/Ashsteel smelting
if (!GAME_DATA.recipes.smithing.find(r=>r.id==='smelt_obsidian')) {
  GAME_DATA.recipes.smithing.push(
    {id:'smelt_obsidian', name:'Obsidian Bar', level:60, xp:100, time:5.0,
     input:[{item:'obsidian_ore',qty:2},{item:'coal_ore',qty:4}], output:{item:'obsidian_bar',qty:1}, category:'Bars'},
    {id:'smelt_ashsteel', name:'Ashsteel Bar', level:75, xp:160, time:6.0,
     input:[{item:'ashsteel_ore',qty:2},{item:'obsidian_bar',qty:1},{item:'coal_ore',qty:6}], output:{item:'ashsteel_bar',qty:1}, category:'Bars'},
  );
}

// Mining SVG art for new ores
if (GAME_DATA.actionArt) {
  GAME_DATA.actionArt.mine_obsidian = `<svg viewBox="0 0 48 48"><path d="M6 42 L24 6 L42 42 Z" fill="#222"/><path d="M12 36 L24 12 L36 36 Z" fill="#333"/><circle cx="20" cy="28" r="4" fill="#4a1a4a"/><circle cx="30" cy="30" r="3" fill="#5a2a5a"/><circle cx="24" cy="22" r="3" fill="#3a0a3a"/><path d="M18 32 L22 28" stroke="#8a4a8a" stroke-width="0.5" opacity="0.5"/></svg>`;
  GAME_DATA.actionArt.mine_ashsteel = `<svg viewBox="0 0 48 48"><path d="M6 42 L24 6 L42 42 Z" fill="#2a1a0a"/><path d="M12 36 L24 12 L36 36 Z" fill="#3a2a1a"/><circle cx="20" cy="28" r="4" fill="#c9873e"/><circle cx="30" cy="30" r="3" fill="#b07730"/><circle cx="24" cy="22" r="3" fill="#d4a83a"/><path d="M18 26 L22 22" stroke="#ffd700" stroke-width="0.5" opacity="0.6"/><circle cx="26" cy="32" r="2" fill="#c9873e" opacity="0.6"/></svg>`;
}

console.log('[Ashfall] Systems Expansion v9.0 loaded');
console.log('  Mining events:', Object.keys(GAME_DATA.miningEvents).length);
console.log('  Weapon prefixes:', GAME_DATA.weaponPrefixes.offensive.length + GAME_DATA.weaponPrefixes.defensive.length);
console.log('  Weapon suffixes:', GAME_DATA.weaponSuffixes.elemental.length + GAME_DATA.weaponSuffixes.utility.length);
console.log('  Status effect defs:', Object.keys(GAME_DATA.statusEffectDefs).length);
console.log('  Weapon specials:', Object.keys(GAME_DATA.weaponSpecials).length);
console.log('  Ore bag upgrades:', _oreBagUpgrades.length);
console.log('  Combat formulas:', Object.keys(GAME_DATA.combatFormulas).length);
console.log('  Total items:', Object.keys(GAME_DATA.items).length);
