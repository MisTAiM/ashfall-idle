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
