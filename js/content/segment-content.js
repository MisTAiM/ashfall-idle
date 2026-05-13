// ================================================================
// ASHFALL IDLE — content/segment-content.js
// Game content expansions: agility, crafting, fletching, boss phases,
// weakness system, venom tiers, guild upgrades, prestige, auto-bank.
// Merges: segment2-content.js + segment3-content.js + segment4-content.js
//         + mega-content.js
// ================================================================
// ================================================================
// ASHFALL IDLE — segment2-content.js
// Agility system, crafting depth, fletching phases, gem cutting,
// smithing heat mechanics, bowstring item
// ================================================================

// ── AGILITY SKILL ────────────────────────────────────────────────
if (!GAME_DATA.skills.agility) {
  GAME_DATA.skills.agility = {
    id:'agility', name:'Agility', type:'agility', icon:'run',
    desc:'Run obstacle courses for XP, marks of grace, and stamina bonuses.'
  };
}

// Agility courses as gathering actions
if (!GAME_DATA.gatheringActions.agility) {
  GAME_DATA.gatheringActions.agility = [
    {
      id:'course_ruins',   name:'Ashfall Ruins Course', level:1,  xp:180,  time:8.0,
      loot:[{item:'mark_of_grace',qty:1,chance:0.08},{item:'coins',qty:1,chance:0}],
      masteryId:'ruins',   desc:'Beginner agility course through crumbling ruins.',
      obstacles:['Cracked Wall','Balance Beam','Low Gap','Slope Dash','Rope Swing'],
      lapBonus:10
    },
    {
      id:'course_sanctum', name:'Sanctum Course',       level:40, xp:550,  time:12.0,
      loot:[{item:'mark_of_grace',qty:1,chance:0.12},{item:'stamina_shard',qty:1,chance:0.05}],
      masteryId:'sanctum', desc:'Intermediate course through the Shadow Sanctum.',
      obstacles:['Iron Bars','Floor Tiles','Sanctum Rope','Narrow Ledge','Vault Door'],
      lapBonus:25
    },
    {
      id:'course_spire',   name:'Ashen Spire Course',  level:70, xp:1200, time:18.0,
      loot:[{item:'mark_of_grace',qty:2,chance:0.18},{item:'stamina_shard',qty:1,chance:0.12}],
      masteryId:'spire',   desc:'Elite course scaling the Ashen Spire. Dangerous.',
      obstacles:['Crumbling Steps','Void Gap','Lava Beam','Ash Rope','Summit Leap'],
      lapBonus:60
    },
  ];
}

// Mark of Grace and graceful outfit items
const _agilItems = {
  mark_of_grace: { name:"Mark of Grace", type:'currency', subtype:'agility', rarity:'uncommon', sellPrice:0, sprite:'misc-coin', desc:'A mark earned on agility courses. Trade for graceful outfit.' },
  stamina_shard: { name:"Stamina Shard", type:'resource', subtype:'agility', rarity:'rare', sellPrice:120, sprite:'gem-green', desc:'A crystallised fragment of stamina energy. Used in crafting.' },
  // Graceful outfit (6 pieces — reduces weight, run restore bonus)
  graceful_hood:   { name:'Graceful Hood',   type:'armor', slot:'head',   stats:{defenceBonus:0}, rarity:'rare', sellPrice:0, sprite:'cowl-green',  agilBonus:3,  desc:'Graceful hood. -3 weight. Speeds stamina recovery.', unique:true },
  graceful_top:    { name:'Graceful Top',    type:'armor', slot:'body',   stats:{defenceBonus:0}, rarity:'rare', sellPrice:0, sprite:'body-green',  agilBonus:5,  desc:'Graceful top. -5 weight.', unique:true },
  graceful_legs:   { name:'Graceful Legs',   type:'armor', slot:'legs',   stats:{defenceBonus:0}, rarity:'rare', sellPrice:0, sprite:'legs-green',  agilBonus:5,  desc:'Graceful legs. -5 weight.', unique:true },
  graceful_gloves: { name:'Graceful Gloves', type:'armor', slot:'gloves', stats:{defenceBonus:0}, rarity:'rare', sellPrice:0, sprite:'gloves-green',agilBonus:3,  desc:'Graceful gloves. -3 weight.', unique:true },
  graceful_boots:  { name:'Graceful Boots',  type:'armor', slot:'boots',  stats:{defenceBonus:0}, rarity:'rare', sellPrice:0, sprite:'boots-green', agilBonus:3,  desc:'Graceful boots. -3 weight.', unique:true },
  graceful_cape:   { name:'Graceful Cape',   type:'armor', slot:'cape',   stats:{defenceBonus:0}, rarity:'rare', sellPrice:0, sprite:'cape-green',  agilBonus:4,  desc:'Graceful cape. -4 weight. Improves run regen.', unique:true },
};
for (const [id, def] of Object.entries(_agilItems)) {
  if (!GAME_DATA.items[id]) GAME_DATA.items[id] = { id, ...def };
}

// Graceful shop (grace exchange NPC — show as shop for now)
const _graceShop = [
  { item:'graceful_hood',   price:35,  category:'agility', currency:'mark_of_grace' },
  { item:'graceful_top',    price:55,  category:'agility', currency:'mark_of_grace' },
  { item:'graceful_legs',   price:55,  category:'agility', currency:'mark_of_grace' },
  { item:'graceful_gloves', price:30,  category:'agility', currency:'mark_of_grace' },
  { item:'graceful_boots',  price:30,  category:'agility', currency:'mark_of_grace' },
  { item:'graceful_cape',   price:40,  category:'agility', currency:'mark_of_grace' },
];
if (!GAME_DATA.graceShop) GAME_DATA.graceShop = _graceShop;

// ── FLETCHING PHASES — Bowstring System ─────────────────────────
// Bowstrings made from flax or sinew
GAME_DATA.items.flax          = GAME_DATA.items.flax          || { id:'flax',       name:'Flax',       type:'resource',subtype:'misc', sellPrice:3,  sprite:'herb-green', desc:'Raw flax. Can be spun into bowstrings.' };
GAME_DATA.items.bowstring      = GAME_DATA.items.bowstring      || { id:'bowstring',  name:'Bowstring',  type:'resource',subtype:'misc', sellPrice:10, sprite:'misc-feather',desc:'A bowstring made from spun flax.' };
GAME_DATA.items.sinew          = GAME_DATA.items.sinew          || { id:'sinew',      name:'Sinew',      type:'resource',subtype:'misc', sellPrice:6,  sprite:'misc-leather',desc:'Dried sinew. Can be used as a bowstring.' };

// Add flax gathering action (foraging-like, from farming or foraging)
if (!GAME_DATA.gatheringActions.foraging?.find(a=>a.id==='gather_flax')) {
  GAME_DATA.gatheringActions.foraging = GAME_DATA.gatheringActions.foraging || [];
  GAME_DATA.gatheringActions.foraging.push({
    id:'gather_flax', name:'Flax Field', level:1, xp:25, time:2.5,
    loot:[{item:'flax',qty:1}], masteryId:'flax', desc:'Pick flax for bowstrings.'
  });
}

// Crafting: spin flax into bowstring
if (!GAME_DATA.recipes.crafting) GAME_DATA.recipes.crafting = [];
const _craftRecipes = [
  // Bowstrings
  {id:'craft_bowstring',     name:'Spin Bowstring',     level:1,  xp:30,  time:2.0, input:[{item:'flax',qty:1}],                                        output:{item:'bowstring',qty:1}},
  // Gem cutting
  {id:'cut_sapphire',        name:'Cut Sapphire',        level:20, xp:100, time:3.0, input:[{item:'sapphire',qty:1}],                                    output:{item:'cut_sapphire',qty:1}},
  {id:'cut_ruby',            name:'Cut Ruby',            level:30, xp:150, time:3.0, input:[{item:'ruby',qty:1}],                                        output:{item:'cut_ruby',qty:1}},
  {id:'cut_emerald',         name:'Cut Emerald',         level:35, xp:180, time:3.5, input:[{item:'emerald',qty:1}],                                     output:{item:'cut_emerald',qty:1}},
  {id:'cut_diamond',         name:'Cut Diamond',         level:45, xp:280, time:4.0, input:[{item:'diamond',qty:1}],                                     output:{item:'cut_diamond',qty:1}},
  {id:'cut_onyx',            name:'Cut Onyx',            level:60, xp:500, time:5.0, input:[{item:'onyx',qty:1}],                                        output:{item:'cut_onyx',qty:1}},
  // Jewelry
  {id:'craft_sapphire_ring', name:'Sapphire Ring',       level:22, xp:200, time:4.0, input:[{item:'gold_ring',qty:1},{item:'cut_sapphire',qty:1}],       output:{item:'sapphire_ring',qty:1}},
  {id:'craft_ruby_ring',     name:'Ruby Ring',           level:32, xp:320, time:4.5, input:[{item:'gold_ring',qty:1},{item:'cut_ruby',qty:1}],           output:{item:'ruby_ring',qty:1}},
  {id:'craft_diamond_ring',  name:'Diamond Ring',        level:46, xp:600, time:5.0, input:[{item:'gold_ring',qty:1},{item:'cut_diamond',qty:1}],        output:{item:'diamond_ring',qty:1}},
  // Dragonhide armor
  {id:'craft_dragon_cowl',   name:'Dragonhide Cowl',     level:50, xp:400, time:5.0, input:[{item:'dragon_hide',qty:1}],                                output:{item:'dragon_cowl',qty:1}},
  {id:'craft_dragon_body',   name:'Dragonhide Body',     level:55, xp:800, time:6.0, input:[{item:'dragon_hide',qty:3}],                                output:{item:'dragon_body',qty:1}},
  {id:'craft_dragon_chaps',  name:'Dragonhide Chaps',    level:52, xp:600, time:5.5, input:[{item:'dragon_hide',qty:2}],                                output:{item:'dragon_chaps',qty:1}},
  // Amulets
  {id:'craft_ruby_amulet',   name:'Ruby Amulet',         level:35, xp:480, time:5.0, input:[{item:'cut_ruby',qty:1},{item:'gold_bar',qty:1}],           output:{item:'ruby_amulet',qty:1}},
  {id:'craft_diamond_amulet',name:'Diamond Amulet',      level:50, xp:800, time:6.0, input:[{item:'cut_diamond',qty:1},{item:'gold_bar',qty:1}],        output:{item:'diamond_amulet',qty:1}},
];
for (const r of _craftRecipes) {
  if (!GAME_DATA.recipes.crafting.find(x=>x.id===r.id)) GAME_DATA.recipes.crafting.push(r);
}

// Cut gem items
const _cutGems = {
  cut_sapphire: { name:'Cut Sapphire', type:'resource',subtype:'gem', rarity:'uncommon', sellPrice:100, sprite:'gem-blue',   desc:'A brilliantly cut sapphire. Used in jewelry.' },
  cut_ruby:     { name:'Cut Ruby',     type:'resource',subtype:'gem', rarity:'rare',     sellPrice:200, sprite:'gem-red',    desc:'A perfectly cut ruby.' },
  cut_emerald:  { name:'Cut Emerald',  type:'resource',subtype:'gem', rarity:'rare',     sellPrice:250, sprite:'gem-green',  desc:'A flawless cut emerald.' },
  cut_diamond:  { name:'Cut Diamond',  type:'resource',subtype:'gem', rarity:'epic',     sellPrice:500, sprite:'gem-pale',   desc:'A brilliant cut diamond.' },
  cut_onyx:     { name:'Cut Onyx',     type:'resource',subtype:'gem', rarity:'epic',     sellPrice:900, sprite:'gem-obsidian',desc:'A cut onyx gemstone.' },
};
for (const [id, def] of Object.entries(_cutGems)) {
  if (!GAME_DATA.items[id]) GAME_DATA.items[id] = { id, ...def };
}

// Dragonhide armor items
const _dragonArmor = {
  dragon_cowl:  { name:'Dragonhide Cowl', type:'armor',slot:'head',  stats:{defenceBonus:25,rangedBonus:30}, levelReq:{defence:40,ranged:40}, rarity:'rare', sellPrice:2000, sprite:'cowl-dragon', desc:'Cowl crafted from dragon hide.' },
  dragon_body:  { name:'Dragonhide Body', type:'armor',slot:'body',  stats:{defenceBonus:55,rangedBonus:55}, levelReq:{defence:40,ranged:40}, rarity:'rare', sellPrice:5500, sprite:'body-dragon',  desc:'Body crafted from dragon hide.' },
  dragon_chaps: { name:'Dragonhide Chaps',type:'armor',slot:'legs',  stats:{defenceBonus:40,rangedBonus:42}, levelReq:{defence:40,ranged:40}, rarity:'rare', sellPrice:3500, sprite:'chaps-dragon', desc:'Chaps crafted from dragon hide.' },
};
for (const [id, def] of Object.entries(_dragonArmor)) {
  if (!GAME_DATA.items[id]) GAME_DATA.items[id] = { id, ...def };
}

// Amulet items
const _amulets = {
  ruby_amulet:   { name:'Ruby Amulet',   type:'armor',slot:'amulet', stats:{strengthBonus:6,attackBonus:3},  rarity:'rare', sellPrice:600, sprite:'amulet-red',  desc:'An amulet of power. +6 strength.' },
  diamond_amulet:{ name:'Diamond Amulet',type:'armor',slot:'amulet', stats:{strengthBonus:10,defenceBonus:6},rarity:'epic', sellPrice:1500,sprite:'amulet-pale', desc:'A powerful diamond amulet.' },
  gold_bar: null, // already exists
};
for (const [id, def] of Object.entries(_amulets)) {
  if (def && !GAME_DATA.items[id]) GAME_DATA.items[id] = { id, ...def };
}

// Add gold_bar if missing (needed for jewelry crafting)
if (!GAME_DATA.items.gold_bar) {
  GAME_DATA.items.gold_bar = { id:'gold_bar', name:'Gold Bar', type:'resource',subtype:'bar', sellPrice:200, sprite:'bar-gold', desc:'A refined gold bar. Used in jewelry.' };
}
if (!GAME_DATA.items.gold_ore) {
  GAME_DATA.items.gold_ore = { id:'gold_ore', name:'Gold Ore', type:'resource',subtype:'ore', sellPrice:80, sprite:'ore-mithril', desc:'A nugget of gold ore. Smelt into gold bars.' };
}

// Gold ore mining and gold bar smelting
if (!GAME_DATA.gatheringActions.mining?.find(a=>a.id==='mine_gold')) {
  GAME_DATA.gatheringActions.mining.push({ id:'mine_gold', name:'Gold Rock', level:40, xp:240, time:5.0, loot:[{item:'gold_ore',qty:1}], masteryId:'gold', gemChance:0.03 });
}
if (!GAME_DATA.recipes.smithing?.find(r=>r.id==='smelt_gold')) {
  GAME_DATA.recipes.smithing.push({ id:'smelt_gold', name:'Smelt Gold Bar', level:40, xp:200, time:5.0, input:[{item:'gold_ore',qty:1}], output:{item:'gold_bar',qty:1} });
}

// ── FLETCHING — Unstrung Bows → Strung Bows ─────────────────────
// Unstrung bow items
const _unstrungBows = [
  {id:'oak_shortbow_u',    name:'Oak Shortbow (u)',   sprite:'bow-oak',    sellPrice:8},
  {id:'willow_shortbow_u', name:'Willow Shortbow (u)',sprite:'bow-willow', sellPrice:15},
  {id:'maple_shortbow_u',  name:'Maple Shortbow (u)', sprite:'bow-maple',  sellPrice:30},
  {id:'yew_shortbow_u',    name:'Yew Shortbow (u)',   sprite:'bow-yew',    sellPrice:60},
  {id:'oak_longbow_u',     name:'Oak Longbow (u)',    sprite:'bow-oak',    sellPrice:12},
  {id:'willow_longbow_u',  name:'Willow Longbow (u)', sprite:'bow-willow', sellPrice:25},
  {id:'maple_longbow_u',   name:'Maple Longbow (u)',  sprite:'bow-maple',  sellPrice:50},
  {id:'yew_longbow_u',     name:'Yew Longbow (u)',    sprite:'bow-yew',    sellPrice:100},
  {id:'elder_shortbow_u',  name:'Elder Shortbow (u)', sprite:'bow-elder',  sellPrice:200},
  {id:'elder_longbow_u',   name:'Elder Longbow (u)',  sprite:'bow-elder',  sellPrice:350},
];
for (const b of _unstrungBows) {
  if (!GAME_DATA.items[b.id]) GAME_DATA.items[b.id] = {
    id:b.id, name:b.name, type:'resource', subtype:'unstrung_bow',
    sellPrice:b.sellPrice, sprite:b.sprite, desc:`${b.name}. Add a bowstring to complete it.`
  };
}

// Update fletching recipes: carving gives unstrung, stringing gives final
const _fletchPhases = [
  // Carve phase (log → unstrung bow)
  {id:'carve_oak_sb',    name:'Carve Oak Shortbow',    category:'Carve Bows', skill:'fletching',level:5,  xp:30,  time:2.5,input:[{item:'oak_log',qty:2}],         output:{item:'oak_shortbow_u',qty:1}},
  {id:'carve_willow_sb', name:'Carve Willow Shortbow', category:'Carve Bows', skill:'fletching',level:20, xp:80,  time:3.0,input:[{item:'willow_log',qty:2}],      output:{item:'willow_shortbow_u',qty:1}},
  {id:'carve_maple_sb',  name:'Carve Maple Shortbow',  category:'Carve Bows', skill:'fletching',level:35, xp:160, time:3.5,input:[{item:'maple_log',qty:3}],       output:{item:'maple_shortbow_u',qty:1}},
  {id:'carve_yew_sb',    name:'Carve Yew Shortbow',    category:'Carve Bows', skill:'fletching',level:45, xp:240, time:4.0,input:[{item:'yew_log',qty:2}],         output:{item:'yew_shortbow_u',qty:1}},
  {id:'carve_oak_lb',    name:'Carve Oak Longbow',     category:'Carve Bows', skill:'fletching',level:10, xp:40,  time:3.0,input:[{item:'oak_log',qty:3}],         output:{item:'oak_longbow_u',qty:1}},
  {id:'carve_willow_lb', name:'Carve Willow Longbow',  category:'Carve Bows', skill:'fletching',level:25, xp:120, time:3.5,input:[{item:'willow_log',qty:3}],      output:{item:'willow_longbow_u',qty:1}},
  {id:'carve_maple_lb',  name:'Carve Maple Longbow',   category:'Carve Bows', skill:'fletching',level:40, xp:200, time:4.0,input:[{item:'maple_log',qty:4}],       output:{item:'maple_longbow_u',qty:1}},
  {id:'carve_yew_lb',    name:'Carve Yew Longbow',     category:'Carve Bows', skill:'fletching',level:50, xp:300, time:4.5,input:[{item:'yew_log',qty:4}],         output:{item:'yew_longbow_u',qty:1}},
  {id:'carve_elder_sb',  name:'Carve Elder Shortbow',  category:'Carve Bows', skill:'fletching',level:60, xp:450, time:5.0,input:[{item:'elder_log',qty:3}],       output:{item:'elder_shortbow_u',qty:1}},
  {id:'carve_elder_lb',  name:'Carve Elder Longbow',   category:'Carve Bows', skill:'fletching',level:65, xp:600, time:5.5,input:[{item:'elder_log',qty:5}],       output:{item:'elder_longbow_u',qty:1}},
  // String phase (unstrung + bowstring → strung bow)
  {id:'string_oak_sb',   name:'String Oak Shortbow',   category:'String Bows', skill:'fletching',level:5,  xp:30,  time:2.0,input:[{item:'oak_shortbow_u',qty:1},{item:'bowstring',qty:1}],    output:{item:'oak_shortbow',qty:1}},
  {id:'string_willow_sb',name:'String Willow Shortbow',category:'String Bows', skill:'fletching',level:20, xp:80,  time:2.5,input:[{item:'willow_shortbow_u',qty:1},{item:'bowstring',qty:1}], output:{item:'willow_shortbow',qty:1}},
  {id:'string_maple_sb', name:'String Maple Shortbow', category:'String Bows', skill:'fletching',level:35, xp:160, time:3.0,input:[{item:'maple_shortbow_u',qty:1},{item:'bowstring',qty:1}],  output:{item:'maple_shortbow',qty:1}},
  {id:'string_yew_sb',   name:'String Yew Shortbow',   category:'String Bows', skill:'fletching',level:45, xp:240, time:3.5,input:[{item:'yew_shortbow_u',qty:1},{item:'bowstring',qty:1}],   output:{item:'yew_shortbow',qty:1}},
  {id:'string_oak_lb',   name:'String Oak Longbow',    category:'String Bows', skill:'fletching',level:10, xp:40,  time:2.5,input:[{item:'oak_longbow_u',qty:1},{item:'bowstring',qty:1}],    output:{item:'oak_longbow',qty:1}},
  {id:'string_willow_lb',name:'String Willow Longbow', category:'String Bows', skill:'fletching',level:25, xp:120, time:3.0,input:[{item:'willow_longbow_u',qty:1},{item:'bowstring',qty:1}], output:{item:'willow_longbow',qty:1}},
  {id:'string_maple_lb', name:'String Maple Longbow',  category:'String Bows', skill:'fletching',level:40, xp:200, time:3.5,input:[{item:'maple_longbow_u',qty:1},{item:'bowstring',qty:1}],  output:{item:'maple_longbow',qty:1}},
  {id:'string_yew_lb',   name:'String Yew Longbow',    category:'String Bows', skill:'fletching',level:50, xp:300, time:4.0,input:[{item:'yew_longbow_u',qty:1},{item:'bowstring',qty:1}],   output:{item:'yew_longbow',qty:1}},
  {id:'string_elder_sb', name:'String Elder Shortbow', category:'String Bows', skill:'fletching',level:60, xp:450, time:4.5,input:[{item:'elder_shortbow_u',qty:1},{item:'bowstring',qty:1}], output:{item:'elder_shortbow',qty:1}},
  {id:'string_elder_lb', name:'String Elder Longbow',  category:'String Bows', skill:'fletching',level:65, xp:600, time:5.0,input:[{item:'elder_longbow_u',qty:1},{item:'bowstring',qty:1}],  output:{item:'elder_longbow',qty:1}},
];
for (const r of _fletchPhases) {
  if (!GAME_DATA.recipes.fletching) GAME_DATA.recipes.fletching = [];
  if (!GAME_DATA.recipes.fletching.find(x=>x.id===r.id)) GAME_DATA.recipes.fletching.push(r);
}

// ── SMITHING HEAT STATE ──────────────────────────────────────────
// The heat mechanic is tracked per-tick in engine and shown in UI
// When smithing, a forge "heat" value decays over time.
// Completing an action while heat > 70% gives +20% XP bonus.
if (!GAME_DATA.smeltingHeat) {
  GAME_DATA.smeltingHeat = {
    enabled: true,
    heatPerAction: 80,    // heat gained on starting a forge action
    decayPerSecond: 8,    // heat lost per second
    bonusThreshold: 60,   // heat % above which bonus XP applies
    bonusXpPct: 25,       // % bonus XP when striking hot
  };
}

// ── AGILITY SHOP (graceful outfit via marks) ─────────────────────
// Add flax to foraging shop
if (!GAME_DATA.shop.find(s=>s.item==='flax'))
  GAME_DATA.shop.push({ item:'flax', price:2, category:'resources', desc:'Raw flax for bowstrings.' });
if (!GAME_DATA.shop.find(s=>s.item==='bowstring'))
  GAME_DATA.shop.push({ item:'bowstring', price:8, category:'resources', desc:'Ready-to-use bowstring.' });

// Agility to nav
if (!GAME_DATA.navExtras) GAME_DATA.navExtras = [];
if (!GAME_DATA.navExtras.includes('agility')) GAME_DATA.navExtras.push('agility');

console.log('[Ashfall] Segment 2 content loaded: Agility, crafting depth, fletching phases, gem cutting');

// ================================================================
// ASHFALL IDLE — segment3-content.js
// Boss phase transitions, monster weakness system, combat enrage,
// guild upgrades, poison/venom tiers, tutorial data
// ================================================================

// ── BOSS PHASE SYSTEM ────────────────────────────────────────────
// World bosses gain phases at 50% and 25% HP.
// Stored per-boss in worldBoss data.
GAME_DATA.bossPhases = {
  ashen_overlord: {
    phases: [
      { hpThreshold: 0.50, name: 'Burning Rage', attackMult: 1.20, styleLock: 'melee',
        notify: '⚠ The Ashen Overlord ignites — attack speed increases!', enrage: false },
      { hpThreshold: 0.25, name: 'Final Conflagration', attackMult: 1.45, styleLock: 'melee',
        notify: '🔥 ENRAGE! The Ashen Overlord becomes superheated — maximum power!', enrage: true,
        dot: { type:'burn', stacks:3, duration:12 } },
    ],
    enrageDmgPerSec: 0.5, // +0.5% maxHit per second after 25% HP
  },
  blight_warden: {
    phases: [
      { hpThreshold: 0.50, name: 'Blighted Frenzy', attackMult: 1.25, styleLock: null,
        notify: '☠ The Blight Warden spreads its corruption!', enrage: false,
        dot: { type:'poison', stacks:5, duration:20 } },
      { hpThreshold: 0.25, name: 'Death Bloom', attackMult: 1.50, styleLock: 'magic',
        notify: '💀 ENRAGE! Blight Warden switches to toxic arcane!', enrage: true },
    ],
    enrageDmgPerSec: 0.4,
  },
  storm_reaver: {
    phases: [
      { hpThreshold: 0.50, name: 'Eye of the Storm', attackMult: 1.30, styleLock: 'ranged',
        notify: '⚡ The Storm Reaver unleashes lightning volleys!', enrage: false },
      { hpThreshold: 0.25, name: 'Tempest', attackMult: 1.60, styleLock: 'ranged',
        notify: '🌩 ENRAGE! Storm Reaver enters the Tempest — cover yourself!', enrage: true },
    ],
    enrageDmgPerSec: 0.6,
  },
  void_emperor: {
    phases: [
      { hpThreshold: 0.60, name: 'Void Fracture', attackMult: 1.20, styleLock: 'magic',
        notify: '🌀 The Void Emperor tears the fabric of space!', enrage: false },
      { hpThreshold: 0.35, name: 'Reality Unbound', attackMult: 1.40, styleLock: null,
        notify: '⚠ Reality Unbound — The Void Emperor switches attacks rapidly!', enrage: false },
      { hpThreshold: 0.15, name: 'Omega Collapse', attackMult: 1.75, styleLock: 'magic',
        notify: '💀 OMEGA PHASE — The Void Emperor collapses into himself. Maximum danger!', enrage: true,
        dot: { type:'freeze', stacks:2, duration:8 } },
    ],
    enrageDmgPerSec: 0.8,
  },
};

// ── MONSTER WEAKNESS SYSTEM ──────────────────────────────────────
// Weakness: { element, dmgBonus (%) }
// Player attacks with matching weapon flag get bonus damage
if (!GAME_DATA.monsterWeaknesses) {
  GAME_DATA.monsterWeaknesses = {
    // Fire-weak (weak to ice/water, strong vs fire)
    frost_giant:   { weak:'ranged',  bonus:20 },
    ice_troll:     { weak:'magic',   bonus:25 },
    wyvern:        { weak:'magic',   bonus:20 },
    // Undead — weak to holy (prayer bonus helps)
    skeleton:      { weak:'melee',   bonus:15, tag:'undead' },
    zombie:        { weak:'melee',   bonus:15, tag:'undead' },
    hollow_soldier:{ weak:'melee',   bonus:20, tag:'undead' },
    hollow_knight: { weak:'melee',   bonus:20, tag:'undead' },
    hollow_lord:   { weak:'ranged',  bonus:25, tag:'undead' },
    // Magic-weak (light armour)
    goblin:        { weak:'ranged',  bonus:10 },
    bandit:        { weak:'magic',   bonus:10 },
    dark_mage:     { weak:'ranged',  bonus:25 },
    // Ranged-weak (heavy armour)
    black_knight:  { weak:'magic',   bonus:20 },
    iron_dragon:   { weak:'magic',   bonus:15 },
    steel_dragon:  { weak:'magic',   bonus:20 },
    dragon:        { weak:'ranged',  bonus:15 },
    // World bosses
    ashen_overlord:{ weak:'ranged',  bonus:15, tag:'boss' },
    blight_warden: { weak:'magic',   bonus:15, tag:'boss' },
    storm_reaver:  { weak:'melee',   bonus:15, tag:'boss' },
    void_emperor:  { weak:'magic',   bonus:20, tag:'boss' },
    // Shadow creatures
    shadow_archer: { weak:'melee',   bonus:15 },
    abyssal_demon: { weak:'magic',   bonus:20 },
    abyssal_horror:{ weak:'ranged',  bonus:15 },
  };
}

// ── VENOM TIER SYSTEM ────────────────────────────────────────────
// Stronger poison effects beyond basic 'poison'
if (!GAME_DATA.statusEffectDefs?.serpent_venom) {
  if (!GAME_DATA.statusEffectDefs) GAME_DATA.statusEffectDefs = {};
  Object.assign(GAME_DATA.statusEffectDefs, {
    serpent_venom: {
      name: 'Serpent Venom', tick: 2.0, dmgPerStack: 4,   maxStacks: 8,
      explodeStacks: 0, color: '#3aaa2a',
      desc: 'Potent venom from serpent creatures. Stacks to 8.',
    },
    wyvern_venom: {
      name: 'Wyvern Venom', tick: 1.5, dmgPerStack: 7,   maxStacks: 12,
      explodeStacks: 0, color: '#1a8a60',
      desc: 'Corrosive wyvern venom. Very fast ticking, high stacks.',
    },
    necrotic: {
      name: 'Necrotic', tick: 3.0, dmgPerStack: 12, maxStacks: 5,
      explodeStacks: 5, explodeDmg: 80, color: '#5a1a8a',
      desc: 'Void corruption. Explodes at 5 stacks for 80 damage.',
    },
  });
}

// ── GUILD UPGRADES SYSTEM ────────────────────────────────────────
GAME_DATA.guildUpgrades = [
  // Tier 1 – Foundation
  { id:'guild_xp_1',     name:'Scholar\'s Hall I',    tier:1, cost:5000,
    desc:'All members gain +5% XP from all skills.', bonus:{ xpBoost:5 }, icon:'📚' },
  { id:'guild_gold_1',   name:'Treasury I',           tier:1, cost:5000,
    desc:'Gold drops increased by +5% for all members.', bonus:{ goldBoost:5 }, icon:'💰' },
  { id:'guild_bank_1',   name:'Vault I',              tier:1, cost:8000,
    desc:'Guild bank capacity +100 items.', bonus:{ bankSlots:100 }, icon:'🏦' },
  { id:'guild_members_1',name:'Barracks I',           tier:1, cost:6000,
    desc:'Increase max guild members to 25.', bonus:{ memberCap:25 }, icon:'⚔️' },
  // Tier 2 – Advancement
  { id:'guild_xp_2',     name:'Scholar\'s Hall II',   tier:2, cost:25000, requires:'guild_xp_1',
    desc:'All members gain +12% XP from all skills.', bonus:{ xpBoost:12 }, icon:'📚' },
  { id:'guild_gold_2',   name:'Treasury II',          tier:2, cost:25000, requires:'guild_gold_1',
    desc:'Gold drops increased by +12% for all members.', bonus:{ goldBoost:12 }, icon:'💰' },
  { id:'guild_bank_2',   name:'Vault II',             tier:2, cost:40000, requires:'guild_bank_1',
    desc:'Guild bank capacity +300 items.', bonus:{ bankSlots:300 }, icon:'🏦' },
  { id:'guild_drops_1',  name:'Hunter\'s Lodge I',    tier:2, cost:30000,
    desc:'+5% drop rate for all members.', bonus:{ dropBoost:5 }, icon:'🎯' },
  // Tier 3 – Mastery
  { id:'guild_xp_3',     name:'Scholar\'s Hall III',  tier:3, cost:100000, requires:'guild_xp_2',
    desc:'All members gain +20% XP from all skills.', bonus:{ xpBoost:20 }, icon:'📚' },
  { id:'guild_combat_1', name:'War Hall I',           tier:3, cost:80000,
    desc:'+8% combat damage for all members.', bonus:{ dmgBoost:8 }, icon:'⚔️' },
  { id:'guild_drops_2',  name:'Hunter\'s Lodge II',   tier:3, cost:80000, requires:'guild_drops_1',
    desc:'+12% drop rate for all members.', bonus:{ dropBoost:12 }, icon:'🎯' },
  // Tier 4 – Elite
  { id:'guild_xp_4',     name:'Grand Academy',        tier:4, cost:500000, requires:'guild_xp_3',
    desc:'All members gain +30% XP from all skills.', bonus:{ xpBoost:30 }, icon:'🏛️' },
  { id:'guild_combat_2', name:'War Hall II',          tier:4, cost:400000, requires:'guild_combat_1',
    desc:'+18% combat damage for all members.', bonus:{ dmgBoost:18 }, icon:'⚔️' },
  { id:'guild_members_2',name:'Grand Barracks',       tier:4, cost:300000, requires:'guild_members_1',
    desc:'Increase max guild members to 50.', bonus:{ memberCap:50 }, icon:'🏰' },
];

// ── TUTORIAL STEPS ───────────────────────────────────────────────
GAME_DATA.tutorialSteps = [
  {
    id: 'gather', step: 1, title: 'Start Gathering',
    desc: 'Head to Woodcutting, Mining, or Fishing in the left sidebar. Click any action to start training — resources gather automatically!',
    highlight: 'woodcutting', icon: '🌲',
    action: 'Go to Woodcutting →'
  },
  {
    id: 'craft', step: 2, title: 'Craft Your First Items',
    desc: 'Use Smithing to forge weapons and armor from ore bars. The Crafting skill creates leather armor and jewelry.',
    highlight: 'smithing', icon: '⚒️',
    action: 'Go to Smithing →'
  },
  {
    id: 'equip', step: 3, title: 'Equip Your Gear',
    desc: 'Open your Bank, find a weapon or armor piece, and click Equip. Better gear = more damage and defence in combat.',
    highlight: 'bank', icon: '⚔️',
    action: 'Open Bank →'
  },
  {
    id: 'fight', step: 4, title: 'Enter Combat',
    desc: 'Go to Combat and pick an area. Defeat monsters for XP, gold, and rare drops. Auto-eat food to survive longer.',
    highlight: 'combat', icon: '⚡',
    action: 'Go to Combat →'
  },
  {
    id: 'quest', step: 5, title: 'Complete Quests',
    desc: 'Quests unlock new content, give big XP rewards, and tell the story of the Ashfall. Talk to NPCs to start quests.',
    highlight: 'quests', icon: '📜',
    action: 'View Quests →'
  },
];

console.log('[Ashfall] Segment 3 loaded: Boss phases, weakness system, venom tiers, guild upgrades, tutorial data');

// ================================================================
// ASHFALL IDLE — segment4-content.js
// Prestige system, item comparison data, auto-bank config,
// buy orders schema, trading system data, sound definitions
// ================================================================

// ── PRESTIGE SYSTEM ──────────────────────────────────────────────
// Each prestige reset: all skills → 1, permanent % bonus unlocked
// Requires: all skills at 99, minimum total level 2750
GAME_DATA.prestige = {
  enabled: true,
  minTotalLevel: 2000,  // total level needed before first prestige
  skillFloor: 99,       // all skills must hit this to prestige

  // Permanent bonuses per prestige rank
  ranks: [
    { rank:1, name:'Ashen Initiate',   icon:'🔥', color:'#c9873e',
      bonuses:{ xpMult:0.10, goldMult:0.05 },
      desc:'+10% XP, +5% Gold. The ash has remade you.' },
    { rank:2, name:'Ashen Adept',      icon:'💀', color:'#8a5ec4',
      bonuses:{ xpMult:0.20, goldMult:0.10, dropMult:0.05 },
      desc:'+20% XP, +10% Gold, +5% Drops.' },
    { rank:3, name:'Ashen Veteran',    icon:'⚔️', color:'#4a9ed4',
      bonuses:{ xpMult:0.30, goldMult:0.15, dropMult:0.10, dmgMult:0.05 },
      desc:'+30% XP, +15% Gold, +10% Drops, +5% Damage.' },
    { rank:4, name:'Ashen Master',     icon:'🌟', color:'#d4a83a',
      bonuses:{ xpMult:0.45, goldMult:0.20, dropMult:0.15, dmgMult:0.10 },
      desc:'+45% XP, +20% Gold, +15% Drops, +10% Damage.' },
    { rank:5, name:'Lord of Ashfall',  icon:'👑', color:'#ff6020',
      bonuses:{ xpMult:0.60, goldMult:0.30, dropMult:0.25, dmgMult:0.20, startLevel:10 },
      desc:'+60% XP, +30% Gold, +25% Drops, +20% Dmg, skills start at 10.' },
  ],

  // Kept items on prestige (these don't get wiped)
  keepItems: [
    'ashforge_cannon','graceful_hood','graceful_top','graceful_legs',
    'graceful_gloves','graceful_boots','graceful_cape','ember_cape',
    'berserker_ring','archers_ring','seers_ring','fury_amulet',
    'occult_necklace','crypts_gloves','ava_accumulator','slayer_helm',
  ],
};

// ── ITEM COMPARISON ──────────────────────────────────────────────
// Stats shown in comparison (in order of display)
GAME_DATA.compareStats = [
  'attackBonus','strengthBonus','defenceBonus','rangedBonus','magicBonus',
  'damageReduction','healPerTick','attackSpeed',
];

// ── AUTO-BANK CONFIG ─────────────────────────────────────────────
GAME_DATA.autoBankConfig = {
  enabled: false,
  intervalSeconds: 300,   // auto-bank every 5 minutes by default
  keepQty: { },           // items to keep in inventory, not bank
};

// ── DIRECT TRADE SCHEMA ──────────────────────────────────────────
// Trades are initiated in-game, stored in Firebase /trades/{tradeId}
// Schema: { from, to, fromItems:[{item,qty}], toItems:[{item,qty}], status, createdAt }
if (!GAME_DATA.tradeConfig) {
  GAME_DATA.tradeConfig = {
    maxSlotsPerSide: 8,    // max unique item types each side can offer
    timeout: 300000,       // trade expires after 5 minutes
    enabled: true,
  };
}

// ── SOUND DEFINITIONS ────────────────────────────────────────────
// Web Audio API generated sounds — no file downloads needed
GAME_DATA.sounds = {
  enabled: false, // user opt-in
  volume: 0.3,
  defs: {
    levelup:    { type:'melody',  freqs:[440,550,660,880], dur:0.12, vol:0.4 },
    click:      { type:'click',   freq:800,                dur:0.04, vol:0.15 },
    hit:        { type:'thud',    freq:180,                dur:0.08, vol:0.2 },
    crit:       { type:'crack',   freq:[300,600],          dur:0.10, vol:0.3 },
    miss:       { type:'whoosh',  freq:200,                dur:0.06, vol:0.1 },
    loot:       { type:'chime',   freq:660,                dur:0.15, vol:0.25 },
    death:      { type:'boom',    freq:80,                 dur:0.25, vol:0.35 },
    rare:       { type:'fanfare', freqs:[523,659,784,1047],dur:0.15, vol:0.35 },
    cannon:     { type:'boom',    freq:120,                dur:0.20, vol:0.30 },
    prestige:   { type:'fanfare', freqs:[440,550,660,880,1100], dur:0.18, vol:0.5 },
  }
};

console.log('[Ashfall] Segment 4 content loaded: Prestige, comparison, auto-bank, trade, sounds');

// ================================================================
// ASHFALL IDLE — Mega Content Pack v9.6
// God Wars Dungeon, Wilderness Bosses, Nightmare, Corp Beast,
// Collection Log, Achievement Tracker
// ================================================================
function _i96(id, def) { if (!GAME_DATA.items[id]) GAME_DATA.items[id] = { id, ...def }; }
if (!GAME_DATA.monsterArt) GAME_DATA.monsterArt = {};

// ================================================================
// GOD WARS DUNGEON — 4 generals + minions + armor sets
// ================================================================

// ── GWD ITEMS ───────────────────────────────────────────────────
// Bandos (melee)
_i96('bandos_chestplate',{name:'Bandos Chestplate',type:'armor',slot:'body',rarity:'legendary',sellPrice:0,stats:{defenceBonus:115,strengthBonus:20,damageReduction:3},levelReq:{defence:70},desc:'Best non-raid melee body. High strength bonus. Unsellable.'});
_i96('bandos_tassets',{name:'Bandos Tassets',type:'armor',slot:'legs',rarity:'legendary',sellPrice:0,stats:{defenceBonus:90,strengthBonus:14,damageReduction:2},levelReq:{defence:70},desc:'Best non-raid melee legs. High strength bonus. Unsellable.'});
_i96('bandos_boots',{name:'Bandos Boots',type:'armor',slot:'boots',rarity:'legendary',sellPrice:0,stats:{defenceBonus:30,strengthBonus:8},levelReq:{defence:70},desc:'Solid melee boots. Unsellable.'});
_i96('bandos_godsword',{name:'Bandos Godsword',type:'weapon',slot:'weapon',style:'melee',attackSpeed:3.0,stats:{attackBonus:100,strengthBonus:142},levelReq:{attack:75},rarity:'legendary',sellPrice:0,specCost:50,specEffect:{type:'bgs_smash',mult:1.40,defReduce:40},desc:'Spec: 140% dmg + reduce target defence by 40. Unsellable.'});
_i96('bandos_hilt',{name:'Bandos Hilt',type:'resource',rarity:'legendary',sellPrice:10000,desc:'Combine with a godsword blade to create the Bandos Godsword.'});

// Armadyl (ranged)
_i96('armadyl_helmet',{name:'Armadyl Helmet',type:'armor',slot:'head',rarity:'legendary',sellPrice:0,stats:{rangedBonus:20,defenceBonus:35,damageReduction:1},levelReq:{defence:70,ranged:70},desc:'Best non-raid ranged head. Unsellable.'});
_i96('armadyl_chestplate',{name:'Armadyl Chestplate',type:'armor',slot:'body',rarity:'legendary',sellPrice:0,stats:{rangedBonus:42,defenceBonus:80,damageReduction:2},levelReq:{defence:70,ranged:70},desc:'Best non-raid ranged body. Unsellable.'});
_i96('armadyl_chainskirt',{name:'Armadyl Chainskirt',type:'armor',slot:'legs',rarity:'legendary',sellPrice:0,stats:{rangedBonus:32,defenceBonus:62,damageReduction:1},levelReq:{defence:70,ranged:70},desc:'Best non-raid ranged legs. Unsellable.'});
_i96('armadyl_godsword',{name:'Armadyl Godsword',type:'weapon',slot:'weapon',style:'melee',attackSpeed:3.0,stats:{attackBonus:100,strengthBonus:142},levelReq:{attack:75},rarity:'legendary',sellPrice:0,specCost:50,specEffect:{type:'ags_smite',mult:1.80},desc:'Spec: single 180% hit. The biggest single hit spec in the game. Unsellable.'});
_i96('armadyl_hilt',{name:'Armadyl Hilt',type:'resource',rarity:'legendary',sellPrice:15000,desc:'Combine with a godsword blade to create the Armadyl Godsword.'});

// Saradomin (hybrid)
_i96('saradomin_sword',{name:'Saradomin Sword',type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.4,stats:{attackBonus:82,strengthBonus:92},levelReq:{attack:70},rarity:'rare',sellPrice:5000,desc:'A blessed sword. Good mid-tier weapon.'});
_i96('saradomin_godsword',{name:'Saradomin Godsword',type:'weapon',slot:'weapon',style:'melee',attackSpeed:3.0,stats:{attackBonus:100,strengthBonus:142},levelReq:{attack:75},rarity:'legendary',sellPrice:0,specCost:50,specEffect:{type:'sgs_heal',mult:1.20,healPct:50,prayerRestore:25},desc:'Spec: 120% dmg. Heal 50% of damage dealt + restore 25% as prayer. Unsellable.'});
_i96('saradomin_hilt',{name:'Saradomin Hilt',type:'resource',rarity:'legendary',sellPrice:8000,desc:'Combine with a godsword blade to create the Saradomin Godsword.'});
_i96('armadyl_crossbow',{name:'Armadyl Crossbow',type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.4,stats:{rangedBonus:100,attackBonus:12},levelReq:{ranged:70},rarity:'legendary',sellPrice:0,specCost:40,specEffect:{type:'acb_shot',mult:1.30,accuracyBoost:100},desc:'Spec: 130% + massive accuracy boost. Unsellable.'});

// Zamorak (magic/melee)
_i96('staff_of_the_dead',{name:'Staff of the Dead',type:'weapon',slot:'weapon',style:'magic',attackSpeed:2.4,stats:{magicBonus:95,attackBonus:18,strengthBonus:72},levelReq:{magic:75,attack:75},rarity:'legendary',sellPrice:0,desc:'A powerful staff with both melee and magic stats. Unsellable.'});
_i96('zamorak_godsword',{name:'Zamorak Godsword',type:'weapon',slot:'weapon',style:'melee',attackSpeed:3.0,stats:{attackBonus:100,strengthBonus:142},levelReq:{attack:75},rarity:'legendary',sellPrice:0,specCost:50,specEffect:{type:'zgs_freeze',mult:1.30,freezeSecs:20},desc:'Spec: 130% + freeze for 20 seconds. Unsellable.'});
_i96('zamorak_hilt',{name:'Zamorak Hilt',type:'resource',rarity:'legendary',sellPrice:5000,desc:'Combine with a godsword blade to create the Zamorak Godsword.'});
_i96('godsword_blade',{name:'Godsword Blade',type:'resource',rarity:'rare',sellPrice:3000,desc:'A blank godsword blade. Combine with a hilt.'});

// ── GWD MONSTERS ────────────────────────────────────────────────
// Minions
GAME_DATA.monsters.goblin_guard={id:'goblin_guard',name:'Goblin Guard',hp:400,maxHit:18,attackSpeed:2.4,combatLevel:50,style:'melee',evasion:{melee:20,ranged:15,magic:10},xp:60,gold:{min:5,max:20},alignment:'CE',drops:[{item:'bones',qty:1,chance:1.0}],desc:'Bandos minion.'};
GAME_DATA.monsters.aviansie={id:'aviansie',name:'Aviansie',hp:500,maxHit:22,attackSpeed:2.0,combatLevel:65,style:'ranged',evasion:{melee:30,ranged:40,magic:20},xp:80,gold:{min:10,max:40},alignment:'LG',drops:[{item:'bones',qty:1,chance:1.0},{item:'adamant_bar',qty:1,chance:0.10}],desc:'Armadyl follower. Ranged attacks.'};
GAME_DATA.monsters.spiritual_mage={id:'spiritual_mage',name:'Spiritual Mage',hp:550,maxHit:28,attackSpeed:2.2,combatLevel:75,style:'magic',evasion:{melee:25,ranged:30,magic:50},xp:100,gold:{min:15,max:60},alignment:'CE',drops:[{item:'soul_rune',qty:3,chance:0.20},{item:'dragon_bones',qty:1,chance:0.05}],desc:'A possessed mage. Magic attacks.',slayerReq:83};
GAME_DATA.monsters.spiritual_warrior={id:'spiritual_warrior',name:'Spiritual Warrior',hp:600,maxHit:25,attackSpeed:2.6,combatLevel:68,style:'melee',evasion:{melee:35,ranged:30,magic:20},xp:90,gold:{min:10,max:50},alignment:'CE',drops:[{item:'big_bones',qty:1,chance:1.0}],desc:'A possessed warrior.',slayerReq:68};

// GWD Bosses
GAME_DATA.monsters.general_graardor={id:'general_graardor',name:'General Graardor',hp:5000,maxHit:60,attackSpeed:2.8,combatLevel:280,style:'melee',evasion:{melee:75,ranged:65,magic:40},xp:800,gold:{min:100,max:600},alignment:'CE',drops:[{item:'dragon_bones',qty:3,chance:1.0},{item:'bandos_chestplate',qty:1,chance:0.008},{item:'bandos_tassets',qty:1,chance:0.008},{item:'bandos_boots',qty:1,chance:0.015},{item:'bandos_hilt',qty:1,chance:0.005},{item:'godsword_blade',qty:1,chance:0.01}],desc:'The Bandos General. Massive melee attacks. Uses ranged AoE occasionally.'};
GAME_DATA.monsters.kreearra={id:'kreearra',name:"Kree'arra",hp:4500,maxHit:55,attackSpeed:2.2,combatLevel:260,style:'ranged',evasion:{melee:50,ranged:80,magic:55},xp:750,gold:{min:100,max:500},alignment:'LG',drops:[{item:'dragon_bones',qty:3,chance:1.0},{item:'armadyl_helmet',qty:1,chance:0.008},{item:'armadyl_chestplate',qty:1,chance:0.008},{item:'armadyl_chainskirt',qty:1,chance:0.008},{item:'armadyl_hilt',qty:1,chance:0.005},{item:'godsword_blade',qty:1,chance:0.01}],desc:'The Armadyl General. Fast ranged attacks. Protect from Ranged.'};
GAME_DATA.monsters.commander_zilyana={id:'commander_zilyana',name:'Commander Zilyana',hp:4000,maxHit:50,attackSpeed:1.8,combatLevel:250,style:'melee',evasion:{melee:60,ranged:55,magic:65},xp:700,gold:{min:100,max:500},alignment:'LG',drops:[{item:'dragon_bones',qty:3,chance:1.0},{item:'saradomin_sword',qty:1,chance:0.015},{item:'armadyl_crossbow',qty:1,chance:0.005},{item:'saradomin_hilt',qty:1,chance:0.005},{item:'godsword_blade',qty:1,chance:0.01}],desc:'The Saradomin General. Fastest boss in GWD. Very fast melee.'};
GAME_DATA.monsters.kril_tsutsaroth={id:'kril_tsutsaroth',name:"K'ril Tsutsaroth",hp:5500,maxHit:65,attackSpeed:2.6,combatLevel:290,style:'melee',evasion:{melee:70,ranged:60,magic:50},xp:850,gold:{min:120,max:700},alignment:'CE',drops:[{item:'dragon_bones',qty:3,chance:1.0},{item:'staff_of_the_dead',qty:1,chance:0.005},{item:'zamorak_hilt',qty:1,chance:0.005},{item:'godsword_blade',qty:1,chance:0.01}],desc:'The Zamorak General. Melee + magic. Drains prayer on hit.',prayerDrain:5};

// ── WILDERNESS BOSSES ───────────────────────────────────────────
GAME_DATA.monsters.callisto={id:'callisto',name:'Callisto',hp:5500,maxHit:60,attackSpeed:2.8,combatLevel:300,style:'melee',evasion:{melee:80,ranged:70,magic:50},xp:900,gold:{min:100,max:500},alignment:'CE',drops:[{item:'dragon_bones',qty:3,chance:1.0},{item:'dragon_pickaxe',qty:1,chance:0.01},{item:'tyrannical_ring',qty:1,chance:0.005}],desc:'Massive bear boss in deep Wilderness. Extremely high defence.'};
GAME_DATA.monsters.vetion={id:'vetion',name:"Vet'ion",hp:6000,maxHit:58,attackSpeed:3.0,combatLevel:320,style:'melee',evasion:{melee:85,ranged:80,magic:45},xp:1000,gold:{min:120,max:600},alignment:'CE',drops:[{item:'dragon_bones',qty:3,chance:1.0},{item:'dragon_pickaxe',qty:1,chance:0.01},{item:'ring_of_the_gods',qty:1,chance:0.005}],desc:'Undead skeleton boss. Two phases. Summons hellhounds.'};
GAME_DATA.monsters.venenatis={id:'venenatis',name:'Venenatis',hp:4500,maxHit:55,attackSpeed:2.4,combatLevel:280,style:'magic',evasion:{melee:55,ranged:60,magic:80},xp:800,gold:{min:100,max:500},alignment:'CE',drops:[{item:'dragon_bones',qty:3,chance:1.0},{item:'dragon_pickaxe',qty:1,chance:0.01},{item:'treasonous_ring',qty:1,chance:0.005}],desc:'Giant spider boss. Magic attacks. Can stun.'};
GAME_DATA.monsters.chaos_elemental={id:'chaos_elemental',name:'Chaos Elemental',hp:3000,maxHit:45,attackSpeed:2.0,combatLevel:240,style:'magic',evasion:{melee:50,ranged:50,magic:50},xp:650,gold:{min:80,max:400},alignment:'CN',drops:[{item:'dragon_bones',qty:2,chance:1.0},{item:'dragon_pickaxe',qty:1,chance:0.015},{item:'dragon_2h',qty:1,chance:0.005}],desc:'A warped entity of pure chaos. Attacks with all 3 styles randomly.'};
GAME_DATA.monsters.scorpia={id:'scorpia',name:'Scorpia',hp:3500,maxHit:40,attackSpeed:2.2,combatLevel:250,style:'melee',evasion:{melee:60,ranged:55,magic:45},xp:700,gold:{min:80,max:400},alignment:'CE',drops:[{item:'dragon_bones',qty:2,chance:1.0},{item:'odium_shard',qty:1,chance:0.02},{item:'malediction_shard',qty:1,chance:0.02}],desc:'Scorpion boss. Summons guardians. Poisonous.',poisonDmg:8};

// Wilderness items
_i96('dragon_pickaxe',{name:'Dragon Pickaxe',type:'tool',rarity:'legendary',sellPrice:0,stats:{miningBonus:15},desc:'Best pickaxe. +15% mining speed. Wilderness boss drop. Unsellable.'});
_i96('tyrannical_ring',{name:'Tyrannical Ring',type:'armor',slot:'ring',rarity:'legendary',sellPrice:0,stats:{attackBonus:12,strengthBonus:8},levelReq:{},desc:'Melee ring from Callisto. Unsellable.'});
_i96('ring_of_the_gods',{name:'Ring of the Gods',type:'armor',slot:'ring',rarity:'legendary',sellPrice:0,stats:{defenceBonus:8},passiveEffect:{type:'prayer_bonus',desc:'+4 prayer bonus'},levelReq:{},desc:"Prayer ring from Vet'ion. +4 prayer bonus. Unsellable."});
_i96('treasonous_ring',{name:'Treasonous Ring',type:'armor',slot:'ring',rarity:'legendary',sellPrice:0,stats:{rangedBonus:12},levelReq:{},desc:'Ranged ring from Venenatis. Unsellable.'});
_i96('dragon_2h',{name:'Dragon 2H Sword',type:'weapon',slot:'weapon',style:'melee',attackSpeed:3.6,stats:{attackBonus:65,strengthBonus:120},levelReq:{attack:60},rarity:'rare',sellPrice:8000,desc:'A massive two-handed dragon sword.'});
_i96('odium_shard',{name:'Odium Shard',type:'resource',rarity:'rare',sellPrice:2000,desc:'Combine 3 shards to create the Odium Ward.'});
_i96('malediction_shard',{name:'Malediction Shard',type:'resource',rarity:'rare',sellPrice:2000,desc:'Combine 3 shards to create the Malediction Ward.'});

// ── NIGHTMARE ───────────────────────────────────────────────────
GAME_DATA.monsters.the_nightmare={id:'the_nightmare',name:'The Nightmare',hp:15000,maxHit:80,attackSpeed:2.6,combatLevel:400,style:'magic',evasion:{melee:80,ranged:85,magic:95},xp:3000,gold:{min:200,max:1000},alignment:'CE',drops:[{item:'dragon_bones',qty:5,chance:1.0},{item:'nightmare_staff',qty:1,chance:0.005},{item:'inquisitors_helm',qty:1,chance:0.003},{item:'inquisitors_plate',qty:1,chance:0.003},{item:'inquisitors_legs',qty:1,chance:0.003},{item:'eldritch_orb',qty:1,chance:0.002},{item:'harmonised_orb',qty:1,chance:0.002},{item:'volatile_orb',qty:1,chance:0.002},{item:'lil_nightmare',qty:1,chance:0.001}],desc:'An ancient parasite feeding on dreams. Multi-phase fight with sleepwalker mechanics.'};

_i96('nightmare_staff',{name:'Nightmare Staff',type:'weapon',slot:'weapon',style:'magic',attackSpeed:2.4,stats:{magicBonus:110,attackBonus:20},levelReq:{magic:80},rarity:'mythic',sellPrice:0,desc:'Base staff. Attach an orb to enhance. Unsellable.'});
_i96('inquisitors_helm',{name:"Inquisitor's Helm",type:'armor',slot:'head',rarity:'mythic',sellPrice:0,stats:{defenceBonus:50,strengthBonus:14,attackBonus:8,damageReduction:1},levelReq:{defence:70,strength:70},desc:"Best crush-style melee helm. Unsellable."});
_i96('inquisitors_plate',{name:"Inquisitor's Hauberk",type:'armor',slot:'body',rarity:'mythic',sellPrice:0,stats:{defenceBonus:100,strengthBonus:24,attackBonus:12,damageReduction:2},levelReq:{defence:70,strength:70},desc:"Best crush-style melee body. Unsellable."});
_i96('inquisitors_legs',{name:"Inquisitor's Plateskirt",type:'armor',slot:'legs',rarity:'mythic',sellPrice:0,stats:{defenceBonus:75,strengthBonus:18,attackBonus:8,damageReduction:1},levelReq:{defence:70,strength:70},desc:"Best crush-style melee legs. Unsellable."});
_i96('eldritch_orb',{name:'Eldritch Orb',type:'resource',rarity:'mythic',sellPrice:0,desc:'Attach to Nightmare Staff. Special: restore prayer on cast.'});
_i96('harmonised_orb',{name:'Harmonised Orb',type:'resource',rarity:'mythic',sellPrice:0,desc:'Attach to Nightmare Staff. Special: cast without delay.'});
_i96('volatile_orb',{name:'Volatile Orb',type:'resource',rarity:'mythic',sellPrice:0,desc:'Attach to Nightmare Staff. Special: 50% spec for huge magic hit.'});
_i96('lil_nightmare',{name:"Li'l Nightmare",type:'pet_token',rarity:'mythic',sellPrice:0,desc:'A tiny Nightmare. Pet. Extremely rare.'});

// ── CORPOREAL BEAST ─────────────────────────────────────────────
GAME_DATA.monsters.corporeal_beast={id:'corporeal_beast',name:'Corporeal Beast',hp:20000,maxHit:95,attackSpeed:2.8,combatLevel:450,style:'magic',evasion:{melee:90,ranged:90,magic:90},xp:5000,gold:{min:300,max:1500},alignment:'CE',drops:[{item:'dragon_bones',qty:5,chance:1.0},{item:'spirit_shield',qty:1,chance:0.03},{item:'holy_elixir',qty:1,chance:0.01},{item:'spectral_sigil',qty:1,chance:0.003},{item:'arcane_sigil',qty:1,chance:0.003},{item:'elysian_sigil',qty:1,chance:0.001}],desc:'The most powerful non-raid boss. Halves non-spear damage. Use spears or halberds.'};

_i96('spirit_shield',{name:'Spirit Shield',type:'armor',slot:'shield',rarity:'rare',sellPrice:5000,stats:{defenceBonus:50,damageReduction:1},levelReq:{defence:60,prayer:55},desc:'Base spirit shield. Bless with holy elixir then attach a sigil.'});
_i96('holy_elixir',{name:'Holy Elixir',type:'resource',rarity:'rare',sellPrice:3000,desc:'Bless a spirit shield to create a Blessed Spirit Shield.'});
_i96('spectral_sigil',{name:'Spectral Sigil',type:'resource',rarity:'mythic',sellPrice:0,desc:'Attach to blessed spirit shield. 30% prayer drain reduction.'});
_i96('arcane_sigil',{name:'Arcane Sigil',type:'resource',rarity:'mythic',sellPrice:0,desc:'Attach to blessed spirit shield. Best magic shield. +20 magic bonus.'});
_i96('elysian_sigil',{name:'Elysian Sigil',type:'resource',rarity:'mythic',sellPrice:0,desc:'Attach to blessed spirit shield. 25% chance to reduce incoming damage by 25%. Rarest Corp drop.'});

// ── MORE MONSTERS ───────────────────────────────────────────────
GAME_DATA.monsters.dagannoth_rex={id:'dagannoth_rex',name:'Dagannoth Rex',hp:3000,maxHit:40,attackSpeed:2.8,combatLevel:220,style:'melee',evasion:{melee:70,ranged:55,magic:20},xp:500,gold:{min:80,max:300},alignment:'CE',drops:[{item:'dragon_bones',qty:2,chance:1.0},{item:'berserker_ring',qty:1,chance:0.008},{item:'warrior_ring',qty:1,chance:0.008},{item:'dragon_axe',qty:1,chance:0.01}],desc:'Dagannoth King — melee. Weak to magic. Drops Berserker Ring.'};
GAME_DATA.monsters.dagannoth_prime={id:'dagannoth_prime',name:'Dagannoth Prime',hp:3000,maxHit:48,attackSpeed:2.4,combatLevel:230,style:'magic',evasion:{melee:25,ranged:60,magic:80},xp:500,gold:{min:80,max:300},alignment:'CE',drops:[{item:'dragon_bones',qty:2,chance:1.0},{item:'seers_ring',qty:1,chance:0.008},{item:'dragon_axe',qty:1,chance:0.01}],desc:'Dagannoth King — magic. Weak to ranged. Drops Seers Ring.'};
GAME_DATA.monsters.dagannoth_supreme={id:'dagannoth_supreme',name:'Dagannoth Supreme',hp:3000,maxHit:44,attackSpeed:2.2,combatLevel:225,style:'ranged',evasion:{melee:55,ranged:70,magic:40},xp:500,gold:{min:80,max:300},alignment:'CE',drops:[{item:'dragon_bones',qty:2,chance:1.0},{item:'archers_ring',qty:1,chance:0.008},{item:'dragon_axe',qty:1,chance:0.01}],desc:'Dagannoth King — ranged. Weak to melee. Drops Archers Ring.'};
GAME_DATA.monsters.giant_mole={id:'giant_mole',name:'Giant Mole',hp:2000,maxHit:30,attackSpeed:2.4,combatLevel:180,style:'melee',evasion:{melee:40,ranged:35,magic:25},xp:350,gold:{min:40,max:200},alignment:'N',drops:[{item:'big_bones',qty:2,chance:1.0},{item:'mole_claw',qty:1,chance:0.50},{item:'mole_skin',qty:1,chance:0.50}],desc:'A massive mole beneath Falador. Digs away at low HP.'};
GAME_DATA.monsters.kalphite_queen={id:'kalphite_queen',name:'Kalphite Queen',hp:4000,maxHit:52,attackSpeed:2.6,combatLevel:260,style:'melee',evasion:{melee:65,ranged:60,magic:55},xp:650,gold:{min:80,max:400},alignment:'CE',drops:[{item:'dragon_bones',qty:2,chance:1.0},{item:'dragon_chainbody',qty:1,chance:0.008},{item:'kq_head',qty:1,chance:0.01}],desc:'Two phases. Phase 1: protect from ranged. Phase 2: protect from magic.'};
GAME_DATA.monsters.sarachnis={id:'sarachnis',name:'Sarachnis',hp:3000,maxHit:38,attackSpeed:2.4,combatLevel:200,style:'melee',evasion:{melee:55,ranged:50,magic:35},xp:450,gold:{min:60,max:250},alignment:'CE',drops:[{item:'big_bones',qty:2,chance:1.0},{item:'sarachnis_cudgel',qty:1,chance:0.01}],desc:'Spider boss. Drops the Sarachnis Cudgel.'};
GAME_DATA.monsters.zulrah={id:'zulrah',name:'Zulrah',hp:5000,maxHit:50,attackSpeed:2.0,combatLevel:310,style:'magic',evasion:{melee:60,ranged:65,magic:80},xp:900,gold:{min:150,max:700},alignment:'CE',drops:[{item:'dragon_bones',qty:3,chance:1.0},{item:'tanzanite_fang',qty:1,chance:0.005},{item:'magic_fang',qty:1,chance:0.005},{item:'serpentine_visage',qty:1,chance:0.005},{item:'zulrah_scales',qty:100,chance:1.0}],desc:'Solo boss serpent. Switches between 3 forms (magic, ranged, melee). Drops unique items.'};

// DKS + Boss items
_i96('berserker_ring',{name:'Berserker Ring',type:'armor',slot:'ring',rarity:'legendary',sellPrice:0,stats:{strengthBonus:12},levelReq:{},desc:'Best melee strength ring. Unsellable.'});
_i96('warrior_ring',{name:'Warrior Ring',type:'armor',slot:'ring',rarity:'rare',sellPrice:5000,stats:{attackBonus:12},desc:'Attack bonus ring.'});
_i96('seers_ring',{name:'Seers Ring',type:'armor',slot:'ring',rarity:'rare',sellPrice:5000,stats:{magicBonus:12},desc:'Magic bonus ring.'});
_i96('archers_ring',{name:'Archers Ring',type:'armor',slot:'ring',rarity:'rare',sellPrice:5000,stats:{rangedBonus:12},desc:'Ranged bonus ring.'});
_i96('dragon_axe',{name:'Dragon Axe',type:'tool',rarity:'rare',sellPrice:3000,stats:{woodcuttingBonus:10},desc:'Best axe. +10% woodcutting speed.'});
_i96('mole_claw',{name:'Mole Claw',type:'resource',rarity:'uncommon',sellPrice:500,desc:'Trade to Wyson for bird nests.'});
_i96('mole_skin',{name:'Mole Skin',type:'resource',rarity:'uncommon',sellPrice:500,desc:'Trade to Wyson for bird nests.'});
_i96('dragon_chainbody',{name:'Dragon Chainbody',type:'armor',slot:'body',rarity:'rare',sellPrice:15000,stats:{defenceBonus:80,strengthBonus:8,damageReduction:1},levelReq:{defence:60},desc:'A rare dragon chainbody.'});
_i96('kq_head',{name:'KQ Head',type:'resource',rarity:'rare',sellPrice:1000,desc:'Mount in your POH or use for a slayer helm recolor.'});
_i96('sarachnis_cudgel',{name:'Sarachnis Cudgel',type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.4,stats:{attackBonus:70,strengthBonus:78},levelReq:{attack:65},rarity:'rare',sellPrice:4000,desc:'A crush weapon. Good vs Kalphites and Guardians.'});
_i96('tanzanite_fang',{name:'Tanzanite Fang',type:'resource',rarity:'mythic',sellPrice:0,desc:'Create a Toxic Blowpipe.'});
_i96('magic_fang',{name:'Magic Fang',type:'resource',rarity:'mythic',sellPrice:0,desc:'Attach to Trident for Toxic Trident.'});
_i96('serpentine_visage',{name:'Serpentine Visage',type:'resource',rarity:'mythic',sellPrice:0,desc:'Create a Serpentine Helm.'});
_i96('zulrah_scales',{name:"Zulrah's Scales",type:'resource',rarity:'uncommon',sellPrice:10,desc:'Used to charge Zulrah weapons.'});

// ── GWD DUNGEON ─────────────────────────────────────────────────
GAME_DATA.dungeons.push(
  {
    id:'gwd_bandos', name:'GWD: Bandos Chamber', levelReq:80,
    waves:['goblin_guard','goblin_guard','spiritual_warrior','goblin_guard','spiritual_warrior','goblin_guard','spiritual_warrior','general_graardor'],
    rewards:[{item:'bandos_chestplate',qty:1,chance:0.008},{item:'bandos_tassets',qty:1,chance:0.008},{item:'bandos_boots',qty:1,chance:0.015},{item:'bandos_hilt',qty:1,chance:0.005},{item:'godsword_blade',qty:1,chance:0.01}],
    desc:'The Bandos stronghold. 8 waves — minions then General Graardor.'
  },
  {
    id:'gwd_armadyl', name:'GWD: Armadyl Eyrie', levelReq:80,
    waves:['aviansie','aviansie','aviansie','spiritual_mage','aviansie','spiritual_mage','aviansie','kreearra'],
    rewards:[{item:'armadyl_helmet',qty:1,chance:0.008},{item:'armadyl_chestplate',qty:1,chance:0.008},{item:'armadyl_chainskirt',qty:1,chance:0.008},{item:'armadyl_hilt',qty:1,chance:0.005},{item:'godsword_blade',qty:1,chance:0.01}],
    desc:"Kree'arra's domain. 8 waves of flying creatures."
  },
  {
    id:'gwd_saradomin', name:'GWD: Saradomin Encampment', levelReq:80,
    waves:['spiritual_warrior','spiritual_mage','spiritual_warrior','spiritual_mage','spiritual_warrior','spiritual_mage','spiritual_warrior','commander_zilyana'],
    rewards:[{item:'saradomin_sword',qty:1,chance:0.015},{item:'armadyl_crossbow',qty:1,chance:0.005},{item:'saradomin_hilt',qty:1,chance:0.005},{item:'godsword_blade',qty:1,chance:0.01}],
    desc:'Commander Zilyana guards this holy place. 8 waves.'
  },
  {
    id:'gwd_zamorak', name:"GWD: Zamorak's Fortress", levelReq:80,
    waves:['spiritual_mage','spiritual_warrior','spiritual_mage','spiritual_warrior','spiritual_mage','spiritual_warrior','spiritual_mage','kril_tsutsaroth'],
    rewards:[{item:'staff_of_the_dead',qty:1,chance:0.005},{item:'zamorak_hilt',qty:1,chance:0.005},{item:'godsword_blade',qty:1,chance:0.01}],
    desc:"K'ril Tsutsaroth's domain. 8 waves of Zamorakian forces."
  },
  {
    id:'dagannoth_lair', name:'Dagannoth Kings Lair', levelReq:85,
    waves:['dagannoth_rex','dagannoth_prime','dagannoth_supreme','dagannoth_rex','dagannoth_prime','dagannoth_supreme'],
    rewards:[{item:'berserker_ring',qty:1,chance:0.008},{item:'seers_ring',qty:1,chance:0.008},{item:'archers_ring',qty:1,chance:0.008},{item:'dragon_axe',qty:1,chance:0.01}],
    desc:'Three kings, three combat styles. 6 waves.'
  },
  {
    id:'corporeal_lair', name:'Corporeal Beast Lair', levelReq:95,
    waves:['corporeal_beast'],
    rewards:[{item:'spirit_shield',qty:1,chance:0.03},{item:'holy_elixir',qty:1,chance:0.01},{item:'spectral_sigil',qty:1,chance:0.003},{item:'arcane_sigil',qty:1,chance:0.003},{item:'elysian_sigil',qty:1,chance:0.001}],
    desc:'Single boss: the Corporeal Beast. 20,000 HP. Bring spears.'
  },
  {
    id:'nightmare_arena', name:'Nightmare Arena', levelReq:100,
    waves:['the_nightmare'],
    rewards:[{item:'nightmare_staff',qty:1,chance:0.005},{item:'inquisitors_helm',qty:1,chance:0.003},{item:'inquisitors_plate',qty:1,chance:0.003},{item:'inquisitors_legs',qty:1,chance:0.003},{item:'eldritch_orb',qty:1,chance:0.002},{item:'harmonised_orb',qty:1,chance:0.002},{item:'volatile_orb',qty:1,chance:0.002}],
    desc:'The Nightmare of Ashihama. Single boss, multi-phase. Extremely rare drops.'
  },
  {
    id:'zulrah_shrine', name:"Zulrah's Shrine", levelReq:75,
    waves:['zulrah'],
    rewards:[{item:'tanzanite_fang',qty:1,chance:0.005},{item:'magic_fang',qty:1,chance:0.005},{item:'serpentine_visage',qty:1,chance:0.005},{item:'zulrah_scales',qty:100,chance:1.0}],
    desc:'Solo boss. Zulrah rotates between 3 forms. Learn the rotations.'
  },
);

// ================================================================
// SVG ART — All new monsters
// ================================================================
Object.assign(GAME_DATA.monsterArt, {

  general_graardor: `<svg viewBox="0 0 80 80"><rect x="10" y="24" width="60" height="38" rx="6" fill="#2a1a08" stroke="#5a3a18" stroke-width="2.5"/><path d="M10 38 L70 38 M10 52 L70 52" stroke="#4a2a10" stroke-width="0.8" opacity="0.4"/><circle cx="40" cy="42" r="8" fill="#0a0604" stroke="#c9873e" stroke-width="2"/><circle cx="40" cy="42" r="4" fill="#c9873e" opacity="0.6"/><rect x="14" y="56" width="20" height="20" rx="5" fill="#1e1008" stroke="#4a2a10" stroke-width="1.5"/><rect x="46" y="56" width="20" height="20" rx="5" fill="#1e1008" stroke="#4a2a10" stroke-width="1.5"/><ellipse cx="6" cy="32" rx="10" ry="7" fill="#1e1008" stroke="#5a3a18" stroke-width="2"/><ellipse cx="74" cy="32" rx="10" ry="7" fill="#1e1008" stroke="#5a3a18" stroke-width="2"/><rect x="-2" y="30" width="14" height="30" rx="6" fill="#1e1008" stroke="#4a2a10" stroke-width="1"/><rect x="68" y="30" width="14" height="30" rx="6" fill="#1e1008" stroke="#4a2a10" stroke-width="1"/><rect x="12" y="4" width="56" height="24" rx="8" fill="#2a1a08" stroke="#5a3a18" stroke-width="2.5"/><rect x="20" y="10" width="14" height="8" rx="2" fill="#0a0604"/><rect x="22" y="12" width="10" height="4" fill="#c9873e" opacity="0.9"/><rect x="46" y="10" width="14" height="8" rx="2" fill="#0a0604"/><rect x="48" y="12" width="10" height="4" fill="#c9873e" opacity="0.9"/><path d="M18 4 L14 -4 M30 2 L28 -6 M50 2 L52 -6 M62 4 L66 -4" stroke="#5a3a18" stroke-width="2.5" stroke-linecap="round"/></svg>`,

  kreearra: `<svg viewBox="0 0 80 80"><defs><radialGradient id="ka-g" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#4a8acc" stop-opacity="0.15"/><stop offset="100%" stop-color="#4a8acc" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="42" rx="35" ry="35" fill="url(#ka-g)"/><ellipse cx="40" cy="42" rx="16" ry="12" fill="#1a2a3a" stroke="#4a8acc" stroke-width="1.5"/><path d="M24 36 Q8 20 4 34 Q6 48 24 44" fill="#0e1e2e" stroke="#3a6a9a" stroke-width="1.5"/><path d="M56 36 Q72 20 76 34 Q74 48 56 44" fill="#0e1e2e" stroke="#3a6a9a" stroke-width="1.5"/><circle cx="40" cy="26" r="10" fill="#1a2a3a" stroke="#4a8acc" stroke-width="2"/><circle cx="36" cy="24" r="2.5" fill="#040a14"/><circle cx="36" cy="24" r="1.2" fill="#88ccff" opacity="0.9"/><circle cx="44" cy="24" r="2.5" fill="#040a14"/><circle cx="44" cy="24" r="1.2" fill="#88ccff" opacity="0.9"/><path d="M36 32 L38 30 L40 32 L42 30 L44 32" stroke="#4a6a8a" stroke-width="1" fill="none"/><path d="M34 52 L30 66" stroke="#1a2a3a" stroke-width="3"/><path d="M46 52 L50 66" stroke="#1a2a3a" stroke-width="3"/><path d="M28 66 L34 66 M46 66 L52 66" stroke="#3a6a9a" stroke-width="1.5"/></svg>`,

  commander_zilyana: `<svg viewBox="0 0 80 80"><path d="M28 30 Q40 24 52 30 L54 62 Q40 68 26 62Z" fill="#e8e0d0" stroke="#c9873e" stroke-width="1.5"/><path d="M30 38 Q40 34 50 38" stroke="#c9873e" stroke-width="0.8" fill="none" opacity="0.4"/><circle cx="40" cy="50" r="5" fill="#f0f0f0" stroke="#c9873e" stroke-width="1.5"/><polygon points="40,46 44,50 40,54 36,50" fill="#c9873e" opacity="0.5"/><rect x="20" y="32" width="12" height="24" rx="5" fill="#e0d8c8" stroke="#c9873e" stroke-width="1"/><rect x="48" y="32" width="12" height="24" rx="5" fill="#e0d8c8" stroke="#c9873e" stroke-width="1"/><circle cx="40" cy="18" r="10" fill="#e8dcc0" stroke="#c9873e" stroke-width="2"/><circle cx="36" cy="16" r="2.5" fill="#1a1a2a"/><circle cx="36" cy="16" r="1" fill="#4a8acc" opacity="0.9"/><circle cx="44" cy="16" r="2.5" fill="#1a1a2a"/><circle cx="44" cy="16" r="1" fill="#4a8acc" opacity="0.9"/><path d="M32 10 Q36 4 40 6 Q44 4 48 10" fill="#e8dcc0" stroke="#c9873e" stroke-width="1"/><ellipse cx="40" cy="6" rx="12" ry="4" fill="none" stroke="#c9873e" stroke-width="1" opacity="0.5"/><path d="M18 56 L14 68" stroke="#c9873e" stroke-width="2.5" stroke-linecap="round"/><rect x="28" y="60" width="10" height="14" rx="3" fill="#d0c8b8" stroke="#c9873e" stroke-width="1"/><rect x="42" y="60" width="10" height="14" rx="3" fill="#d0c8b8" stroke="#c9873e" stroke-width="1"/></svg>`,

  kril_tsutsaroth: `<svg viewBox="0 0 80 80"><rect x="10" y="26" width="60" height="36" rx="5" fill="#1a0404" stroke="#6a1010" stroke-width="2.5"/><circle cx="40" cy="42" r="8" fill="#080202" stroke="#c44020" stroke-width="2"/><circle cx="40" cy="42" r="5" fill="#c44020" opacity="0.6"/><circle cx="40" cy="42" r="2.5" fill="#e8cc20"/><rect x="16" y="56" width="18" height="20" rx="4" fill="#140404" stroke="#4a0a0a" stroke-width="1.5"/><rect x="46" y="56" width="18" height="20" rx="4" fill="#140404" stroke="#4a0a0a" stroke-width="1.5"/><rect x="-2" y="28" width="16" height="32" rx="7" fill="#140404" stroke="#4a0a0a" stroke-width="1.5"/><rect x="66" y="28" width="16" height="32" rx="7" fill="#140404" stroke="#4a0a0a" stroke-width="1.5"/><rect x="12" y="4" width="56" height="26" rx="7" fill="#1a0404" stroke="#6a1010" stroke-width="2.5"/><rect x="20" y="10" width="14" height="8" rx="2" fill="#080202"/><rect x="22" y="12" width="10" height="4" fill="#c44020" opacity="0.9"/><rect x="46" y="10" width="14" height="8" rx="2" fill="#080202"/><rect x="48" y="12" width="10" height="4" fill="#c44020" opacity="0.9"/><path d="M16 4 L10 -6 M28 2 L24 -8 M52 2 L56 -8 M64 4 L70 -6" stroke="#6a1010" stroke-width="2.5" stroke-linecap="round"/></svg>`,

  callisto: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="48" rx="26" ry="18" fill="#2a1a08" stroke="#4a3018" stroke-width="2"/><circle cx="52" cy="34" r="12" fill="#2a1a08" stroke="#4a3018" stroke-width="2"/><circle cx="49" cy="32" r="3" fill="#0a0604"/><circle cx="49" cy="32" r="1.5" fill="#c44040" opacity="0.9"/><circle cx="56" cy="32" r="3" fill="#0a0604"/><circle cx="56" cy="32" r="1.5" fill="#c44040" opacity="0.9"/><path d="M55 40 Q58 38 56 42" stroke="#2a1a08" stroke-width="1.5" fill="none"/><polygon points="44,26 42,18 48,24" fill="#2a1a08"/><polygon points="56,26 60,18 54,24" fill="#2a1a08"/><path d="M16 46 Q6 42 10 52" fill="#2a1a08"/><path d="M20 60 L16 74" stroke="#1e1408" stroke-width="5"/><path d="M36 62 L34 76" stroke="#1e1408" stroke-width="4"/><path d="M48 62 L50 76" stroke="#1e1408" stroke-width="4"/><path d="M60 60 L64 74" stroke="#1e1408" stroke-width="5"/></svg>`,

  vetion: `<svg viewBox="0 0 80 80"><defs><radialGradient id="vt2-g" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#6a30a0" stop-opacity="0.15"/><stop offset="100%" stop-color="#6a30a0" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="45" rx="32" ry="32" fill="url(#vt2-g)"/><rect x="16" y="28" width="48" height="36" rx="5" fill="#0e0812" stroke="#6a30a0" stroke-width="2"/><rect x="20" y="58" width="14" height="18" rx="4" fill="#0a0610" stroke="#4a1880" stroke-width="1.5"/><rect x="46" y="58" width="14" height="18" rx="4" fill="#0a0610" stroke="#4a1880" stroke-width="1.5"/><rect x="4" y="30" width="14" height="28" rx="6" fill="#0a0610" stroke="#4a1880" stroke-width="1.5"/><rect x="62" y="30" width="14" height="28" rx="6" fill="#0a0610" stroke="#4a1880" stroke-width="1.5"/><rect x="14" y="8" width="52" height="24" rx="6" fill="#0e0812" stroke="#6a30a0" stroke-width="2.5"/><rect x="22" y="14" width="12" height="6" rx="1" fill="#060410"/><rect x="24" y="16" width="8" height="2" fill="#9b30d0" opacity="0.9"/><rect x="46" y="14" width="12" height="6" rx="1" fill="#060410"/><rect x="48" y="16" width="8" height="2" fill="#9b30d0" opacity="0.9"/><path d="M20 8 L16 0 M40 6 L40 -2 M60 8 L64 0" stroke="#6a30a0" stroke-width="2.5" stroke-linecap="round"/></svg>`,

  venenatis: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="48" rx="24" ry="16" fill="#1a0a08" stroke="#5a2020" stroke-width="1.5"/><circle cx="40" cy="32" r="12" fill="#1a0a08" stroke="#5a2020" stroke-width="2"/><circle cx="35" cy="28" r="3" fill="#060202"/><circle cx="35" cy="28" r="1.5" fill="#c44040" opacity="0.9"/><circle cx="39" cy="30" r="2" fill="#060202"/><circle cx="39" cy="30" r="1" fill="#c44040" opacity="0.8"/><circle cx="45" cy="28" r="3" fill="#060202"/><circle cx="45" cy="28" r="1.5" fill="#c44040" opacity="0.9"/><circle cx="42" cy="26" r="2" fill="#060202"/><circle cx="42" cy="26" r="1" fill="#c44040" opacity="0.8"/><path d="M16 44 Q4 36 2 48 Q4 56 16 52" stroke="#1a0a08" stroke-width="3" fill="none"/><path d="M64 44 Q76 36 78 48 Q76 56 64 52" stroke="#1a0a08" stroke-width="3" fill="none"/><path d="M22 56 Q16 62 12 70" stroke="#1a0a08" stroke-width="2.5" fill="none"/><path d="M30 58 Q26 66 24 72" stroke="#1a0a08" stroke-width="2.5" fill="none"/><path d="M50 58 Q54 66 56 72" stroke="#1a0a08" stroke-width="2.5" fill="none"/><path d="M58 56 Q64 62 68 70" stroke="#1a0a08" stroke-width="2.5" fill="none"/></svg>`,

  chaos_elemental: `<svg viewBox="0 0 80 80"><defs><radialGradient id="ce2-g" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="#cc3080" stop-opacity="0.2"/><stop offset="50%" stop-color="#30cccc" stop-opacity="0.1"/><stop offset="100%" stop-color="#cc3080" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="42" rx="30" ry="28" fill="url(#ce2-g)"/><ellipse cx="40" cy="42" rx="22" ry="18" fill="#080418" stroke="#cc3080" stroke-width="1.5"/><circle cx="32" cy="36" r="5" fill="#040210"/><circle cx="32" cy="36" r="3" fill="#cc3080" opacity="0.9"/><circle cx="32" cy="35" r="1.2" fill="#ff80c0"/><circle cx="48" cy="36" r="5" fill="#040210"/><circle cx="48" cy="36" r="3" fill="#30cccc" opacity="0.9"/><circle cx="48" cy="35" r="1.2" fill="#80ffff"/><path d="M18 50 Q10 58 14 68" stroke="#cc3080" stroke-width="3" fill="none" opacity="0.6"/><path d="M62 50 Q70 58 66 68" stroke="#30cccc" stroke-width="3" fill="none" opacity="0.6"/><path d="M32 58 Q28 66 32 72" stroke="#cc30cc" stroke-width="2" fill="none" opacity="0.5"/><path d="M48 58 Q52 66 48 72" stroke="#30cc80" stroke-width="2" fill="none" opacity="0.5"/><circle cx="12" cy="30" r="3" fill="#cc3080" opacity="0.3"/><circle cx="68" cy="28" r="3" fill="#30cccc" opacity="0.3"/></svg>`,

  scorpia: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="48" rx="22" ry="14" fill="#1a1a08" stroke="#5a5a20" stroke-width="1.5"/><circle cx="40" cy="36" r="10" fill="#1a1a08" stroke="#5a5a20" stroke-width="2"/><circle cx="36" cy="34" r="2.5" fill="#080802"/><circle cx="36" cy="34" r="1.2" fill="#aacc20"/><circle cx="44" cy="34" r="2.5" fill="#080802"/><circle cx="44" cy="34" r="1.2" fill="#aacc20"/><path d="M18 46 Q8 40 4 48 Q6 56 18 52" stroke="#1a1a08" stroke-width="3" fill="none"/><path d="M62 46 Q72 40 76 48 Q74 56 62 52" stroke="#1a1a08" stroke-width="3" fill="none"/><path d="M40 32 Q36 18 30 10 Q28 6 32 4" stroke="#1a1a08" stroke-width="3" fill="none"/><circle cx="32" cy="4" r="4" fill="#5a5a20" opacity="0.6"/><circle cx="32" cy="4" r="2" fill="#aacc20"/></svg>`,

  the_nightmare: `<svg viewBox="0 0 80 80"><defs><radialGradient id="nm-g" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="#5a0a5a" stop-opacity="0.25"/><stop offset="100%" stop-color="#5a0a5a" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="42" rx="35" ry="35" fill="url(#nm-g)"/><path d="M20 30 Q40 18 60 30 L64 68 Q40 76 16 68Z" fill="#0c040c" stroke="#8a30a0" stroke-width="2"/><circle cx="40" cy="48" r="8" fill="#060208" stroke="#9b30d0" stroke-width="2"/><circle cx="40" cy="48" r="5" fill="#9b30d0" opacity="0.7"/><circle cx="40" cy="48" r="2.5" fill="#e0a0ff"/><circle cx="40" cy="22" r="14" fill="#0c040c" stroke="#8a30a0" stroke-width="2.5"/><circle cx="34" cy="20" r="4" fill="#060208"/><circle cx="34" cy="20" r="2.5" fill="#9b30d0" opacity="0.9"/><circle cx="34" cy="19" r="1" fill="#e0a0ff"/><circle cx="46" cy="20" r="4" fill="#060208"/><circle cx="46" cy="20" r="2.5" fill="#9b30d0" opacity="0.9"/><circle cx="46" cy="19" r="1" fill="#e0a0ff"/><path d="M28 12 Q24 4 20 0" stroke="#8a30a0" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M52 12 Q56 4 60 0" stroke="#8a30a0" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M14 34 Q4 40 6 52" stroke="#0c040c" stroke-width="8" fill="none"/><path d="M66 34 Q76 40 74 52" stroke="#0c040c" stroke-width="8" fill="none"/></svg>`,

  corporeal_beast: `<svg viewBox="0 0 80 80"><defs><radialGradient id="cb-g" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#3a1a08" stop-opacity="0.2"/><stop offset="100%" stop-color="#3a1a08" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="45" rx="34" ry="30" fill="url(#cb-g)"/><ellipse cx="40" cy="46" rx="28" ry="22" fill="#1e0a04" stroke="#6a2a10" stroke-width="2"/><circle cx="40" cy="42" r="10" fill="#0a0402" stroke="#c44020" stroke-width="2"/><circle cx="40" cy="42" r="7" fill="#c44020" opacity="0.7"/><circle cx="40" cy="42" r="4" fill="#e8cc20"/><circle cx="40" cy="41" r="2" fill="#fff" opacity="0.7"/><circle cx="28" cy="32" r="6" fill="#0a0402"/><circle cx="28" cy="32" r="4" fill="#c44020" opacity="0.8"/><circle cx="28" cy="31" r="1.5" fill="#e8cc20"/><circle cx="52" cy="32" r="6" fill="#0a0402"/><circle cx="52" cy="32" r="4" fill="#c44020" opacity="0.8"/><circle cx="52" cy="31" r="1.5" fill="#e8cc20"/><path d="M14 50 Q4 55 6 66 Q10 72 18 68" stroke="#1e0a04" stroke-width="5" fill="none"/><path d="M66 50 Q76 55 74 66 Q70 72 62 68" stroke="#1e0a04" stroke-width="5" fill="none"/><path d="M28 64 Q24 72 28 78" stroke="#1e0a04" stroke-width="4" fill="none"/><path d="M52 64 Q56 72 52 78" stroke="#1e0a04" stroke-width="4" fill="none"/></svg>`,

  dagannoth_rex: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="50" rx="24" ry="16" fill="#1a2808" stroke="#3a5a18" stroke-width="1.5"/><circle cx="40" cy="34" r="12" fill="#1a2808" stroke="#3a5a18" stroke-width="2"/><circle cx="36" cy="32" r="3" fill="#080a02"/><circle cx="36" cy="32" r="1.5" fill="#c9873e" opacity="0.9"/><circle cx="44" cy="32" r="3" fill="#080a02"/><circle cx="44" cy="32" r="1.5" fill="#c9873e" opacity="0.9"/><path d="M32 24 L28 16 M48 24 L52 16" stroke="#3a5a18" stroke-width="2.5" stroke-linecap="round"/><path d="M20 56 L16 70" stroke="#1a2808" stroke-width="4"/><path d="M60 56 L64 70" stroke="#1a2808" stroke-width="4"/></svg>`,

  dagannoth_prime: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="50" rx="24" ry="16" fill="#081a2a" stroke="#185a8a" stroke-width="1.5"/><circle cx="40" cy="34" r="12" fill="#081a2a" stroke="#185a8a" stroke-width="2"/><circle cx="36" cy="32" r="3" fill="#020a14"/><circle cx="36" cy="32" r="1.5" fill="#4a8acc" opacity="0.9"/><circle cx="44" cy="32" r="3" fill="#020a14"/><circle cx="44" cy="32" r="1.5" fill="#4a8acc" opacity="0.9"/><path d="M32 24 L28 16 M48 24 L52 16" stroke="#185a8a" stroke-width="2.5" stroke-linecap="round"/><path d="M20 56 L16 70" stroke="#081a2a" stroke-width="4"/><path d="M60 56 L64 70" stroke="#081a2a" stroke-width="4"/></svg>`,

  dagannoth_supreme: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="50" rx="24" ry="16" fill="#2a0808" stroke="#8a2020" stroke-width="1.5"/><circle cx="40" cy="34" r="12" fill="#2a0808" stroke="#8a2020" stroke-width="2"/><circle cx="36" cy="32" r="3" fill="#140404"/><circle cx="36" cy="32" r="1.5" fill="#cc4040" opacity="0.9"/><circle cx="44" cy="32" r="3" fill="#140404"/><circle cx="44" cy="32" r="1.5" fill="#cc4040" opacity="0.9"/><path d="M32 24 L28 16 M48 24 L52 16" stroke="#8a2020" stroke-width="2.5" stroke-linecap="round"/><path d="M20 56 L16 70" stroke="#2a0808" stroke-width="4"/><path d="M60 56 L64 70" stroke="#2a0808" stroke-width="4"/></svg>`,

  giant_mole: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="48" rx="28" ry="16" fill="#3a2a18" stroke="#5a4a28" stroke-width="1.5"/><circle cx="55" cy="40" r="10" fill="#3a2a18" stroke="#5a4a28" stroke-width="1.5"/><circle cx="52" cy="38" r="2" fill="#0a0804"/><circle cx="52" cy="38" r="1" fill="#4a3a20"/><circle cx="58" cy="38" r="2" fill="#0a0804"/><circle cx="58" cy="38" r="1" fill="#4a3a20"/><path d="M60 44" stroke="#3a2a18" stroke-width="1.5"/><path d="M14 48 Q6 46 8 54" fill="#3a2a18"/><path d="M22 60 L18 72" stroke="#2a1a0a" stroke-width="4"/><path d="M58 58 L56 72" stroke="#2a1a0a" stroke-width="4"/></svg>`,

  kalphite_queen: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="50" rx="24" ry="16" fill="#2a3a08" stroke="#5a7a18" stroke-width="1.5"/><circle cx="40" cy="34" r="12" fill="#2a3a08" stroke="#5a7a18" stroke-width="2"/><circle cx="35" cy="32" r="3" fill="#080a02"/><circle cx="35" cy="32" r="1.5" fill="#c9873e" opacity="0.9"/><circle cx="45" cy="32" r="3" fill="#080a02"/><circle cx="45" cy="32" r="1.5" fill="#c9873e" opacity="0.9"/><path d="M34 24 L30 16 M46 24 L50 16" stroke="#5a7a18" stroke-width="2" stroke-linecap="round"/><path d="M30 16 L28 10 M50 16 L52 10" stroke="#c9873e" stroke-width="1.5" stroke-linecap="round"/><path d="M16 48 Q6 42 4 52 Q8 58 16 54" stroke="#2a3a08" stroke-width="3" fill="none"/><path d="M64 48 Q74 42 76 52 Q72 58 64 54" stroke="#2a3a08" stroke-width="3" fill="none"/><path d="M24 62 Q18 68 14 74" stroke="#2a3a08" stroke-width="2.5" fill="none"/><path d="M56 62 Q62 68 66 74" stroke="#2a3a08" stroke-width="2.5" fill="none"/></svg>`,

  zulrah: `<svg viewBox="0 0 80 80"><defs><radialGradient id="zr-g" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#2a8a4a" stop-opacity="0.2"/><stop offset="100%" stop-color="#2a8a4a" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="45" rx="30" ry="30" fill="url(#zr-g)"/><path d="M20 60 Q10 45 18 32 Q28 22 22 12" stroke="#1a4a2a" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M60 60 Q70 45 62 32 Q52 22 58 12" stroke="#1a4a2a" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="40" cy="20" r="12" fill="#1a4a2a" stroke="#3a8a4a" stroke-width="2"/><circle cx="36" cy="18" r="3" fill="#040a04"/><circle cx="36" cy="18" r="1.5" fill="#4acc4a" opacity="0.9"/><circle cx="44" cy="18" r="3" fill="#040a04"/><circle cx="44" cy="18" r="1.5" fill="#4acc4a" opacity="0.9"/><path d="M38 28 Q40 30 42 28" stroke="#3a8a4a" stroke-width="1.5" fill="none"/></svg>`,

  sarachnis: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="48" rx="22" ry="14" fill="#2a0808" stroke="#5a2020" stroke-width="1.5"/><circle cx="40" cy="34" r="10" fill="#2a0808" stroke="#5a2020" stroke-width="2"/><circle cx="36" cy="32" r="2" fill="#0a0202"/><circle cx="36" cy="32" r="1" fill="#c44040" opacity="0.9"/><circle cx="40" cy="30" r="1.5" fill="#0a0202"/><circle cx="40" cy="30" r="0.8" fill="#c44040"/><circle cx="44" cy="32" r="2" fill="#0a0202"/><circle cx="44" cy="32" r="1" fill="#c44040" opacity="0.9"/><path d="M18 46 Q8 38 6 48" stroke="#2a0808" stroke-width="2.5" fill="none"/><path d="M62 46 Q72 38 74 48" stroke="#2a0808" stroke-width="2.5" fill="none"/><path d="M22 58 Q16 64 12 72" stroke="#2a0808" stroke-width="2" fill="none"/><path d="M58 58 Q64 64 68 72" stroke="#2a0808" stroke-width="2" fill="none"/></svg>`,

  goblin_guard: `<svg viewBox="0 0 80 80"><path d="M28 35 Q40 30 52 35 L54 62 Q40 68 26 62Z" fill="#2a4a10" stroke="#4a6a20" stroke-width="1"/><circle cx="40" cy="24" r="10" fill="#4a6a20" stroke="#5a8a30" stroke-width="1.5"/><circle cx="36" cy="22" r="2" fill="#0a0a02"/><circle cx="36" cy="22" r="1" fill="#e8cc20"/><circle cx="44" cy="22" r="2" fill="#0a0a02"/><circle cx="44" cy="22" r="1" fill="#e8cc20"/><polygon points="34,16 32,8 38,14" fill="#4a6a20"/><polygon points="46,16 48,8 42,14" fill="#4a6a20"/><rect x="18" y="38" width="10" height="18" rx="4" fill="#2a4a10"/><rect x="52" y="38" width="10" height="18" rx="4" fill="#2a4a10"/></svg>`,

  aviansie: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="40" rx="14" ry="10" fill="#1a2a3a" stroke="#3a5a7a" stroke-width="1"/><circle cx="40" cy="28" r="8" fill="#1a2a3a" stroke="#3a5a7a" stroke-width="1.5"/><circle cx="37" cy="26" r="2" fill="#040810"/><circle cx="37" cy="26" r="1" fill="#88ccff"/><circle cx="43" cy="26" r="2" fill="#040810"/><circle cx="43" cy="26" r="1" fill="#88ccff"/><path d="M26 36 Q12 24 8 34 Q10 44 26 40" fill="#0e1e2e" stroke="#2a4a6a" stroke-width="1"/><path d="M54 36 Q68 24 72 34 Q70 44 54 40" fill="#0e1e2e" stroke="#2a4a6a" stroke-width="1"/><path d="M34 50 L32 60" stroke="#1a2a3a" stroke-width="2"/><path d="M46 50 L48 60" stroke="#1a2a3a" stroke-width="2"/></svg>`,

  spiritual_mage: `<svg viewBox="0 0 80 80"><path d="M28 32 Q40 26 52 32 L54 65 Q40 72 26 65Z" fill="#0a0818" stroke="#4a3880" stroke-width="1"/><circle cx="40" cy="20" r="8" fill="#0a0818" stroke="#4a3880" stroke-width="1.5"/><circle cx="37" cy="18" r="2" fill="#040208"/><circle cx="37" cy="18" r="1" fill="#9b30d0" opacity="0.8"/><circle cx="43" cy="18" r="2" fill="#040208"/><circle cx="43" cy="18" r="1" fill="#9b30d0" opacity="0.8"/><path d="M20 36 Q14 42 10 52" stroke="#0a0818" stroke-width="4" fill="none"/><circle cx="10" cy="8" r="4" fill="#9b30d0" opacity="0.4"/><path d="M10 12 L10 52" stroke="#3a2a1a" stroke-width="2"/></svg>`,

  spiritual_warrior: `<svg viewBox="0 0 80 80"><rect x="24" y="30" width="32" height="28" rx="4" fill="#1a1414" stroke="#4a3838" stroke-width="1.5"/><rect x="28" y="52" width="10" height="14" rx="3" fill="#141010"/><rect x="42" y="52" width="10" height="14" rx="3" fill="#141010"/><rect x="20" y="12" width="40" height="20" rx="5" fill="#1a1414" stroke="#4a3838" stroke-width="1.5"/><rect x="28" y="18" width="8" height="4" fill="#0a0808"/><rect x="30" y="20" width="4" height="1" fill="#c44040" opacity="0.7"/><rect x="44" y="18" width="8" height="4" fill="#0a0808"/><rect x="46" y="20" width="4" height="1" fill="#c44040" opacity="0.7"/><rect x="12" y="32" width="12" height="22" rx="5" fill="#141010"/><rect x="56" y="32" width="12" height="22" rx="5" fill="#141010"/></svg>`,

});

// ── COLLECTION LOG ──────────────────────────────────────────────
GAME_DATA.collectionLog = {
  'God Wars': ['bandos_chestplate','bandos_tassets','bandos_boots','bandos_godsword','armadyl_helmet','armadyl_chestplate','armadyl_chainskirt','armadyl_godsword','saradomin_sword','saradomin_godsword','armadyl_crossbow','staff_of_the_dead','zamorak_godsword'],
  'Wilderness': ['dragon_pickaxe','tyrannical_ring','ring_of_the_gods','treasonous_ring'],
  'Ashen Crypts': ['maldrak_head','maldrak_body','maldrak_legs','maldrak_weapon','serath_head','serath_body','serath_legs','serath_weapon','veyra_head','veyra_body','veyra_legs','veyra_weapon','grothak_head','grothak_body','grothak_legs','grothak_weapon','thorne_head','thorne_body','thorne_legs','thorne_weapon','aluric_head','aluric_body','aluric_legs','aluric_weapon'],
  'Chambers': ['twisted_bow','elder_maul','kodai_wand','dragon_claws','dinhs_bulwark','ancestral_hat','ancestral_robe_top','ancestral_robe_bottom','olmlet'],
  'Theatre': ['veriax_scythe','bloodfire_staff','ashen_rapier','judicator_helm','judicator_plate','judicator_legs','hollow_ward','veriax_eye'],
  'Nightmare': ['nightmare_staff','inquisitors_helm','inquisitors_plate','inquisitors_legs','eldritch_orb','harmonised_orb','volatile_orb','lil_nightmare'],
  'Corp Beast': ['spirit_shield','holy_elixir','spectral_sigil','arcane_sigil','elysian_sigil'],
  'Gauntlet': ['crystal_helm','crystal_body','crystal_legs','bow_of_faerdhinen','enhanced_crystal_weapon_seed','younglief'],
  'Slayer Bosses': ['primordial_crystal','pegasian_crystal','eternal_crystal','kraken_tentacle','trident_piece','abyssal_whip','granite_maul','guardian_boots'],
  'Rings': ['berserker_ring','warrior_ring','seers_ring','archers_ring','tyrannical_ring','ring_of_the_gods','treasonous_ring'],
  'DKS': ['berserker_ring','seers_ring','archers_ring','dragon_axe'],
  'Other Bosses': ['tanzanite_fang','magic_fang','serpentine_visage','dragon_chainbody','sarachnis_cudgel'],
};

// ── COLLECTION LOG UI — deferred ────────────────────────────────
(function registerCollectionLogUI() {
  if (typeof UI === 'undefined') { setTimeout(registerCollectionLogUI, 50); return; }
  UI.prototype.renderCollectionLogPage = function(el) {
  const s = this.engine.state;
  const inv = s.inventory || {};
  let html = this.header('Collection Log','scroll','Track every unique item you\'ve obtained.',null);
  for (const [cat, items] of Object.entries(GAME_DATA.collectionLog)) {
    const obtained = items.filter(id => (inv[id]||0) > 0 || s.bank?.[id] > 0).length;
    html += `<div class="ce-section-title">${cat} <span style="color:var(--text-dim);font-size:11px">(${obtained}/${items.length})</span></div>`;
    html += `<div class="ce-clog-grid">`;
    for (const id of items) {
      const item = GAME_DATA.items[id];
      if (!item) continue;
      const has = (inv[id]||0) > 0 || (s.bank?.[id]||0) > 0;
      html += `<div class="ce-clog-item ${has?'ce-clog-has':'ce-clog-miss'}" title="${item.desc||''}"><span class="ce-clog-name">${item.name}</span>${has?'<span class="ce-clog-check">✓</span>':''}</div>`;
    }
    html += `</div>`;
  }
    el.innerHTML = html;
  };
})();

// ── SAVE MIGRATION ──────────────────────────────────────────────
const _origMigrate96 = GameEngine.prototype.migrateSave;
GameEngine.prototype.migrateSave = function(s) {
  if (_origMigrate96) s = _origMigrate96.call(this, s);
  if (!s.stats.bossKills) s.stats.bossKills = {};
  return s;
};

// console.log('[Ashfall] Mega Content Pack v9.6 loaded:');
// console.log('  GWD bosses:', ['general_graardor','kreearra','commander_zilyana','kril_tsutsaroth'].filter(id=>GAME_DATA.monsters[id]).length);
// console.log('  Wilderness bosses:', ['callisto','vetion','venenatis','chaos_elemental','scorpia'].filter(id=>GAME_DATA.monsters[id]).length);
// console.log('  Other bosses:', ['the_nightmare','corporeal_beast','dagannoth_rex','dagannoth_prime','dagannoth_supreme','giant_mole','kalphite_queen','sarachnis','zulrah'].filter(id=>GAME_DATA.monsters[id]).length);
// console.log('  New art:', Object.keys(GAME_DATA.monsterArt).length, 'total');
// console.log('  Collection log categories:', Object.keys(GAME_DATA.collectionLog).length);
