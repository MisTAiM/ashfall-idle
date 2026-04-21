// ================================================================
// ASHFALL IDLE - World Expansion v8.0
// New monsters, food system, multi-roll drops, ingredients
// Loaded AFTER items-combat.js, BEFORE engine.js
// ================================================================

// ── NEW RESOURCE ITEMS ───────────────────────────────────
const _resources = [
  // Leather & hides
  {id:'cowhide',      name:'Cowhide',         type:'resource', rarity:'common',  desc:'Raw cowhide. Craft into leather.', sellPrice:5},
  {id:'raw_beef',     name:'Raw Beef',        type:'food',     rarity:'common',  desc:'Raw beef. Cook it for food.', heals:0, sellPrice:4},
  {id:'raw_chicken',  name:'Raw Chicken',     type:'food',     rarity:'common',  desc:'Raw chicken. Cook it for food.', heals:0, sellPrice:3},
  // Grain & produce
  {id:'wheat',        name:'Wheat',           type:'resource', rarity:'common',  desc:'A bundle of wheat. Mill into flour.', sellPrice:3},
  {id:'flour',        name:'Flour',           type:'resource', rarity:'common',  desc:'Ground wheat flour. Used in baking.', sellPrice:5},
  {id:'egg',          name:'Egg',             type:'resource', rarity:'common',  desc:'A fresh egg. Used in cooking.', sellPrice:4},
  {id:'milk',         name:'Milk',            type:'resource', rarity:'common',  desc:'Fresh milk. Used in cooking and baking.', sellPrice:5},
  {id:'cheese',       name:'Cheese',          type:'resource', rarity:'common',  desc:'Aged cheese. Used in cooking.', sellPrice:8},
  {id:'butter',       name:'Butter',          type:'resource', rarity:'common',  desc:'Creamy butter. Used in cooking.', sellPrice:6},
  {id:'tomato',       name:'Tomato',          type:'resource', rarity:'common',  desc:'A ripe tomato. Used in cooking.', sellPrice:4},
  {id:'cabbage',      name:'Cabbage',         type:'resource', rarity:'common',  desc:'A head of cabbage. Used in cooking.', sellPrice:3},
  {id:'corn',         name:'Corn',            type:'resource', rarity:'common',  desc:'Sweet corn. Cook or use in recipes.', sellPrice:4},
  {id:'sugar',        name:'Sugar',           type:'resource', rarity:'common',  desc:'Refined sugar for baking.', sellPrice:5},
  {id:'chocolate',    name:'Chocolate',       type:'resource', rarity:'uncommon',desc:'Rich chocolate. Used in desserts.', sellPrice:15},
  {id:'pie_shell',    name:'Pie Shell',       type:'resource', rarity:'common',  desc:'An empty pastry shell.', sellPrice:8},
  {id:'pizza_base',   name:'Pizza Base',      type:'resource', rarity:'common',  desc:'Flat dough ready for toppings.', sellPrice:10},
  {id:'cake_tin',     name:'Cake Tin',        type:'resource', rarity:'common',  desc:'A tin for baking cakes. Reusable.', sellPrice:20},
  // Cooked meats (non-fish)
  {id:'cooked_beef',  name:'Cooked Beef',     type:'food', heals:40,  rarity:'common', desc:'Cooked beef. Heals 40 HP.', sellPrice:12},
  {id:'cooked_chicken',name:'Cooked Chicken', type:'food', heals:35,  rarity:'common', desc:'Cooked chicken. Heals 35 HP.', sellPrice:10},
  {id:'cooked_corn',  name:'Cooked Corn',     type:'food', heals:25,  rarity:'common', desc:'Buttered corn. Heals 25 HP.', sellPrice:8},
  // Baked goods
  {id:'meat_pie',     name:'Meat Pie',        type:'food', heals:80,  rarity:'common',  desc:'A savory meat pie. Heals 80 HP.', sellPrice:30},
  {id:'fish_pie',     name:'Fish Pie',        type:'food', heals:120, rarity:'uncommon',desc:'A rich fish pie. Heals 120 HP.', sellPrice:50},
  {id:'pizza_plain',  name:'Plain Pizza',     type:'food', heals:70,  rarity:'common',  desc:'Cheese and tomato pizza. Heals 70 HP.', sellPrice:25},
  {id:'pizza_meat',   name:'Meat Pizza',      type:'food', heals:130, rarity:'uncommon',desc:'Loaded meat pizza. Heals 130 HP.', sellPrice:60},
  {id:'pizza_supreme',name:'Supreme Pizza',   type:'food', heals:200, rarity:'rare',    desc:'The ultimate pizza. Heals 200 HP.', sellPrice:100},
  {id:'cake',         name:'Cake',            type:'food', heals:100, rarity:'common',  desc:'A delicious cake. Heals 100 HP.', sellPrice:40},
  {id:'chocolate_cake',name:'Chocolate Cake', type:'food', heals:180, rarity:'uncommon',desc:'Rich chocolate cake. Heals 180 HP.', sellPrice:80},
  {id:'stew',         name:'Stew',            type:'food', heals:90,  rarity:'common',  desc:'A hearty stew. Heals 90 HP.', sellPrice:35},
  {id:'curry',        name:'Curry',           type:'food', heals:150, rarity:'uncommon',desc:'Spicy curry. Heals 150 HP.', sellPrice:65},
  {id:'garden_pie',   name:'Garden Pie',      type:'food', heals:100, rarity:'common',  desc:'Vegetable pie. Heals 100 HP.', sellPrice:40},
  {id:'mushroom_soup',name:'Mushroom Soup',   type:'food', heals:60,  rarity:'common',  desc:'Creamy mushroom soup. Heals 60 HP.', sellPrice:20},
  {id:'scrambled_eggs',name:'Scrambled Eggs',  type:'food', heals:45, rarity:'common',  desc:'Fluffy scrambled eggs. Heals 45 HP.', sellPrice:15},
  {id:'omelette',     name:'Omelette',        type:'food', heals:110, rarity:'uncommon',desc:'A stuffed omelette. Heals 110 HP.', sellPrice:45},
  {id:'feast',        name:'Feast',           type:'food', heals:350, rarity:'rare',    desc:'A magnificent feast. Heals 350 HP.', sellPrice:200},
  {id:'elders_meal',  name:'Elder\'s Meal',   type:'food', heals:500, rarity:'epic',    desc:'An ancient recipe. Heals 500 HP.', sellPrice:400},
  // Mushrooms (foraging)
  {id:'mushroom',     name:'Mushroom',        type:'resource', rarity:'common', desc:'A common mushroom.', sellPrice:5},
];

for (const r of _resources) {
  if (!GAME_DATA.items[r.id]) {
    GAME_DATA.items[r.id] = { id:r.id, name:r.name, type:r.type, rarity:r.rarity, desc:r.desc, sellPrice:r.sellPrice };
    if (r.heals !== undefined) GAME_DATA.items[r.id].heals = r.heals;
    if (r.type === 'food' && r.heals > 0) GAME_DATA.items[r.id].slot = 'food';
  }
}

// Add ingredients to shop
const _shopIngredients = [
  {item:'wheat',price:10},{item:'flour',price:20},{item:'egg',price:15},{item:'milk',price:15},
  {item:'cheese',price:25},{item:'butter',price:20},{item:'sugar',price:15},{item:'tomato',price:12},
  {item:'cabbage',price:10},{item:'corn',price:12},{item:'chocolate',price:50},
  {item:'pie_shell',price:30},{item:'pizza_base',price:35},{item:'cake_tin',price:100},
];
for (const si of _shopIngredients) {
  if (!GAME_DATA.shop.find(s=>s.item===si.item)) GAME_DATA.shop.push({...si, category:'ingredients'});
}

// ── NEW MONSTERS ─────────────────────────────────────────
const _newMonsters = {
  cow: {id:'cow', name:'Cow', hp:30, maxHit:2, attackSpeed:3.0, combatLevel:2, style:'melee',
    evasion:{melee:3,ranged:3,magic:3}, xp:25, gold:{min:0,max:3}, alignment:'NN',
    drops:[
      {item:'cowhide',qty:1,chance:1.0},
      {item:'raw_beef',qty:1,chance:1.0},
      {item:'bones',qty:1,chance:1.0},
    ]},
  spider: {id:'spider', name:'Giant Spider', hp:55, maxHit:7, attackSpeed:2.4, combatLevel:4, style:'melee',
    evasion:{melee:10,ranged:8,magic:6}, xp:40, gold:{min:2,max:8}, alignment:'CN',
    drops:[
      {item:'bones',qty:1,chance:1.0},
      {item:'feather',qty:2,chance:0.20},
    ]},
  guard: {id:'guard', name:'Rogue Guard', hp:120, maxHit:14, attackSpeed:2.2, combatLevel:18, style:'melee',
    evasion:{melee:25,ranged:20,magic:18}, xp:100, gold:{min:15,max:40}, alignment:'LE',
    drops:[
      {item:'bones',qty:1,chance:1.0},
      {item:'iron_sword',qty:1,chance:0.08},
      {item:'iron_helm',qty:1,chance:0.06},
      {item:'iron_plate',qty:1,chance:0.04},
      {item:'iron_scimitar',qty:1,chance:0.05},
    ]},
  bear: {id:'bear', name:'Black Bear', hp:90, maxHit:12, attackSpeed:2.6, combatLevel:12, style:'melee',
    evasion:{melee:18,ranged:15,magic:10}, xp:75, gold:{min:5,max:20}, alignment:'NN',
    drops:[
      {item:'bones',qty:1,chance:1.0},
      {item:'raw_beef',qty:2,chance:0.60},
      {item:'cowhide',qty:1,chance:0.40},
    ]},
  moss_giant: {id:'moss_giant', name:'Moss Giant', hp:180, maxHit:18, attackSpeed:2.8, combatLevel:28, style:'melee',
    evasion:{melee:30,ranged:25,magic:20}, xp:140, gold:{min:20,max:60}, alignment:'CN',
    drops:[
      {item:'bones',qty:1,chance:1.0},
      {item:'mithril_bar',qty:1,chance:0.08},
      {item:'nature_rune',qty:3,chance:0.15},
      {item:'mushroom',qty:2,chance:0.25},
    ]},
  ice_warrior: {id:'ice_warrior', name:'Ice Warrior', hp:200, maxHit:20, attackSpeed:2.2, combatLevel:35, style:'melee',
    evasion:{melee:35,ranged:30,magic:25}, xp:160, gold:{min:30,max:80}, alignment:'NE',
    drops:[
      {item:'bones',qty:1,chance:1.0},
      {item:'adamant_bar',qty:1,chance:0.06},
      {item:'water_rune',qty:5,chance:0.20},
      {item:'sapphire',qty:1,chance:0.08},
    ]},
  fire_giant: {id:'fire_giant', name:'Fire Giant', hp:300, maxHit:25, attackSpeed:2.6, combatLevel:45, style:'melee',
    evasion:{melee:45,ranged:40,magic:30}, xp:250, gold:{min:50,max:150}, alignment:'CE',
    drops:[
      {item:'bones',qty:1,chance:1.0},
      {item:'runite_bar',qty:1,chance:0.04},
      {item:'fire_rune',qty:10,chance:0.25},
      {item:'ruby',qty:1,chance:0.06},
      {item:'steel_plate',qty:1,chance:0.10},
    ]},
  black_knight: {id:'black_knight', name:'Black Knight', hp:250, maxHit:22, attackSpeed:2.0, combatLevel:40, style:'melee',
    evasion:{melee:42,ranged:38,magic:28}, xp:200, gold:{min:40,max:120}, alignment:'LE',
    drops:[
      {item:'bones',qty:1,chance:1.0},
      {item:'adamant_helm',qty:1,chance:0.06},
      {item:'adamant_plate',qty:1,chance:0.03},
      {item:'adamant_scimitar',qty:1,chance:0.04},
      {item:'death_rune',qty:3,chance:0.12},
    ]},
  hellhound: {id:'hellhound', name:'Hellhound', hp:350, maxHit:28, attackSpeed:2.0, combatLevel:55, style:'melee',
    evasion:{melee:55,ranged:50,magic:35}, xp:320, gold:{min:60,max:180}, alignment:'CE',
    drops:[
      {item:'bones',qty:1,chance:1.0},
      {item:'fire_rune',qty:8,chance:0.20},
      {item:'blood_rune',qty:2,chance:0.10},
      {item:'obsidian_bar',qty:1,chance:0.03},
    ]},
  steel_dragon: {id:'steel_dragon', name:'Steel Dragon', hp:500, maxHit:35, attackSpeed:2.8, combatLevel:70, style:'magic',
    evasion:{melee:70,ranged:65,magic:50}, xp:500, gold:{min:100,max:300}, alignment:'CE',
    drops:[
      {item:'bones',qty:1,chance:1.0},
      {item:'runite_bar',qty:2,chance:0.08},
      {item:'obsidian_bar',qty:1,chance:0.06},
      {item:'dragon_arrows',qty:10,chance:0.10},
      {item:'death_rune',qty:5,chance:0.15},
      {item:'diamond',qty:1,chance:0.04},
    ]},
};

for (const [id, m] of Object.entries(_newMonsters)) {
  if (!GAME_DATA.monsters[id]) GAME_DATA.monsters[id] = m;
}

// Add cow and spider to Farmlands area
const farm = GAME_DATA.combatAreas.find(a=>a.id==='farm');
if (farm) {
  if (!farm.monsters.includes('cow')) farm.monsters.push('cow');
  if (!farm.monsters.includes('spider')) farm.monsters.push('spider');
}
// Add bear to forest
const forest = GAME_DATA.combatAreas.find(a=>a.id==='forest');
if (forest && !forest.monsters.includes('bear')) forest.monsters.push('bear');
// Add moss_giant and guard
const banditCamp = GAME_DATA.combatAreas.find(a=>a.id==='bandit_camp');
if (banditCamp && !banditCamp.monsters.includes('guard')) banditCamp.monsters.push('guard');
const mountain = GAME_DATA.combatAreas.find(a=>a.id==='mountain');
if (mountain && !mountain.monsters.includes('moss_giant')) mountain.monsters.push('moss_giant');
// Add ice_warrior + black_knight + fire_giant
const darkTower = GAME_DATA.combatAreas.find(a=>a.id==='dark_tower');
if (darkTower) {
  if (!darkTower.monsters.includes('black_knight')) darkTower.monsters.push('black_knight');
}
// New combat areas
if (!GAME_DATA.combatAreas.find(a=>a.id==='ice_caves')) {
  GAME_DATA.combatAreas.push(
    {id:'ice_caves', name:'Ice Caverns', monsters:['ice_warrior'], levelReq:30, desc:'Frozen underground tunnels.'},
    {id:'fire_pit', name:'Fire Giant Pit', monsters:['fire_giant','hellhound'], levelReq:40, desc:'A volcanic pit with scorching enemies.'},
    {id:'dragon_den', name:'Dragon Den', monsters:['steel_dragon'], levelReq:65, desc:'Lair of metal dragons.'},
  );
}

// ── MULTI-ROLL DROP TABLE SYSTEM ─────────────────────────
// Each monster now has a dropTable with multiple rolls
// Each roll is independent: {table:'common'|'uncommon'|'rare'|'gems'|'runes'|'equipment', chance:0.XX}
// The engine rolls EACH table independently per kill

GAME_DATA.dropTables = {
  common_resources: [
    {item:'feather',qty:3,weight:10}, {item:'leather',qty:1,weight:8},
    {item:'bones',qty:1,weight:15}, {item:'cowhide',qty:1,weight:5},
    {item:'mushroom',qty:1,weight:5}, {item:'wheat',qty:2,weight:4},
    {item:'egg',qty:1,weight:3},
  ],
  uncommon_resources: [
    {item:'coal_ore',qty:2,weight:10}, {item:'iron_ore',qty:3,weight:8},
    {item:'gold_ore',qty:1,weight:5}, {item:'mithril_ore',qty:1,weight:4},
    {item:'hard_leather',qty:1,weight:6}, {item:'raw_beef',qty:2,weight:7},
  ],
  gems: [
    {item:'sapphire',qty:1,weight:10}, {item:'emerald',qty:1,weight:8},
    {item:'ruby',qty:1,weight:6}, {item:'diamond',qty:1,weight:3},
  ],
  runes: [
    {item:'air_rune',qty:10,weight:10}, {item:'fire_rune',qty:8,weight:9},
    {item:'water_rune',qty:8,weight:9}, {item:'earth_rune',qty:8,weight:9},
    {item:'mind_rune',qty:5,weight:7}, {item:'chaos_rune',qty:3,weight:5},
    {item:'death_rune',qty:2,weight:3}, {item:'blood_rune',qty:1,weight:2},
    {item:'nature_rune',qty:3,weight:6}, {item:'law_rune',qty:2,weight:4},
  ],
  low_equipment: [
    {item:'bronze_sword',qty:1,weight:8}, {item:'bronze_helm',qty:1,weight:8},
    {item:'bronze_shield',qty:1,weight:6}, {item:'iron_sword',qty:1,weight:5},
    {item:'iron_helm',qty:1,weight:5}, {item:'iron_scimitar',qty:1,weight:4},
    {item:'steel_sword',qty:1,weight:3}, {item:'steel_helm',qty:1,weight:3},
  ],
  mid_equipment: [
    {item:'steel_scimitar',qty:1,weight:8}, {item:'steel_plate',qty:1,weight:5},
    {item:'mithril_helm',qty:1,weight:6}, {item:'mithril_scimitar',qty:1,weight:4},
    {item:'adamant_helm',qty:1,weight:3}, {item:'adamant_scimitar',qty:1,weight:2},
  ],
  high_equipment: [
    {item:'runite_helm',qty:1,weight:5}, {item:'runite_scimitar',qty:1,weight:3},
    {item:'obsidian_helm',qty:1,weight:2}, {item:'dragon_dagger',qty:1,weight:1},
    {item:'abyssal_whip',qty:1,weight:1},
  ],
  herbs: [
    {item:'herb_seed',qty:1,weight:10}, {item:'mushroom',qty:2,weight:8},
    {item:'celestial_herb',qty:1,weight:1}, {item:'feather',qty:5,weight:6},
    {item:'egg',qty:2,weight:5}, {item:'wheat',qty:3,weight:7},
    {item:'tomato',qty:2,weight:5}, {item:'cabbage',qty:2,weight:4},
  ],
  food_drops: [
    {item:'cooked_beef',qty:1,weight:8}, {item:'cooked_chicken',qty:1,weight:8},
    {item:'bread',qty:1,weight:6}, {item:'trout',qty:1,weight:5},
    {item:'salmon',qty:1,weight:4}, {item:'lobster',qty:1,weight:2},
  ],
};

// Assign multi-roll drop tables to ALL monsters
(function assignDropTables() {
  for (const [id, mon] of Object.entries(GAME_DATA.monsters)) {
    if (mon._dropTablesAssigned) continue;
    mon._dropTablesAssigned = true;
    const cb = mon.combatLevel || 1;

    // Every monster gets their existing drops PLUS roll tables
    if (!mon.rollTables) mon.rollTables = [];

    if (cb <= 10) {
      mon.rollTables.push({table:'common_resources', chance:0.30});
      mon.rollTables.push({table:'food_drops', chance:0.10});
    } else if (cb <= 25) {
      mon.rollTables.push({table:'common_resources', chance:0.35});
      mon.rollTables.push({table:'uncommon_resources', chance:0.15});
      mon.rollTables.push({table:'gems', chance:0.05});
      mon.rollTables.push({table:'herbs', chance:0.15});
      mon.rollTables.push({table:'low_equipment', chance:0.08});
      mon.rollTables.push({table:'food_drops', chance:0.15});
    } else if (cb <= 45) {
      mon.rollTables.push({table:'common_resources', chance:0.30});
      mon.rollTables.push({table:'uncommon_resources', chance:0.25});
      mon.rollTables.push({table:'gems', chance:0.10});
      mon.rollTables.push({table:'runes', chance:0.20});
      mon.rollTables.push({table:'herbs', chance:0.20});
      mon.rollTables.push({table:'mid_equipment', chance:0.06});
      mon.rollTables.push({table:'food_drops', chance:0.20});
    } else if (cb <= 70) {
      mon.rollTables.push({table:'uncommon_resources', chance:0.30});
      mon.rollTables.push({table:'gems', chance:0.15});
      mon.rollTables.push({table:'runes', chance:0.30});
      mon.rollTables.push({table:'herbs', chance:0.25});
      mon.rollTables.push({table:'mid_equipment', chance:0.10});
      mon.rollTables.push({table:'high_equipment', chance:0.03});
      mon.rollTables.push({table:'food_drops', chance:0.25});
    } else {
      mon.rollTables.push({table:'uncommon_resources', chance:0.35});
      mon.rollTables.push({table:'gems', chance:0.20});
      mon.rollTables.push({table:'runes', chance:0.35});
      mon.rollTables.push({table:'herbs', chance:0.30});
      mon.rollTables.push({table:'high_equipment', chance:0.08});
      mon.rollTables.push({table:'food_drops', chance:0.30});
    }
  }
  console.log('[Ashfall] Drop tables assigned to', Object.keys(GAME_DATA.monsters).length, 'monsters');
})();

// ── NEW COOKING RECIPES ──────────────────────────────────
const _newCookingRecipes = [
  // Basic meats
  {id:'cook_beef',     name:'Cooked Beef',      level:1,  xp:30,  time:3.0, input:[{item:'raw_beef',qty:1}],     output:{item:'cooked_beef',qty:1}, category:'Meat'},
  {id:'cook_chicken',  name:'Cooked Chicken',   level:1,  xp:25,  time:3.0, input:[{item:'raw_chicken',qty:1}],  output:{item:'cooked_chicken',qty:1}, category:'Meat'},
  {id:'cook_corn',     name:'Cooked Corn',      level:5,  xp:20,  time:2.5, input:[{item:'corn',qty:1},{item:'butter',qty:1}], output:{item:'cooked_corn',qty:1}, category:'Meat'},
  {id:'cook_eggs',     name:'Scrambled Eggs',   level:5,  xp:25,  time:2.5, input:[{item:'egg',qty:2},{item:'butter',qty:1}],  output:{item:'scrambled_eggs',qty:1}, category:'Meat'},
  // Baking
  {id:'make_flour',    name:'Grind Flour',      level:1,  xp:10,  time:2.0, input:[{item:'wheat',qty:2}],         output:{item:'flour',qty:1}, category:'Baking'},
  {id:'make_bread',    name:'Bread',            level:5,  xp:35,  time:4.0, input:[{item:'flour',qty:1},{item:'egg',qty:1}],    output:{item:'bread',qty:1}, category:'Baking'},
  {id:'make_pie_shell',name:'Pie Shell',        level:15, xp:30,  time:3.0, input:[{item:'flour',qty:2},{item:'butter',qty:1}], output:{item:'pie_shell',qty:1}, category:'Baking'},
  {id:'make_pizza_base',name:'Pizza Base',      level:20, xp:35,  time:3.5, input:[{item:'flour',qty:2},{item:'egg',qty:1}],    output:{item:'pizza_base',qty:1}, category:'Baking'},
  {id:'make_cake',     name:'Cake',             level:30, xp:80,  time:5.0, input:[{item:'flour',qty:2},{item:'egg',qty:2},{item:'sugar',qty:1},{item:'milk',qty:1}], output:{item:'cake',qty:1}, category:'Baking'},
  {id:'make_choc_cake',name:'Chocolate Cake',   level:45, xp:120, time:6.0, input:[{item:'flour',qty:2},{item:'egg',qty:2},{item:'sugar',qty:1},{item:'chocolate',qty:1},{item:'milk',qty:1}], output:{item:'chocolate_cake',qty:1}, category:'Baking'},
  // Pies
  {id:'make_meat_pie', name:'Meat Pie',         level:20, xp:60,  time:5.0, input:[{item:'pie_shell',qty:1},{item:'cooked_beef',qty:1}], output:{item:'meat_pie',qty:1}, category:'Pies'},
  {id:'make_fish_pie', name:'Fish Pie',         level:35, xp:90,  time:6.0, input:[{item:'pie_shell',qty:1},{item:'salmon',qty:1},{item:'potato',qty:1}], output:{item:'fish_pie',qty:1}, category:'Pies'},
  {id:'make_garden_pie',name:'Garden Pie',      level:25, xp:70,  time:5.0, input:[{item:'pie_shell',qty:1},{item:'tomato',qty:1},{item:'cabbage',qty:1}], output:{item:'garden_pie',qty:1}, category:'Pies'},
  // Pizza
  {id:'make_pizza',    name:'Plain Pizza',      level:25, xp:65,  time:5.0, input:[{item:'pizza_base',qty:1},{item:'cheese',qty:1},{item:'tomato',qty:1}], output:{item:'pizza_plain',qty:1}, category:'Pizza'},
  {id:'make_meat_pizza',name:'Meat Pizza',      level:40, xp:100, time:6.0, input:[{item:'pizza_base',qty:1},{item:'cheese',qty:1},{item:'tomato',qty:1},{item:'cooked_beef',qty:1}], output:{item:'pizza_meat',qty:1}, category:'Pizza'},
  {id:'make_supreme',  name:'Supreme Pizza',    level:55, xp:150, time:7.0, input:[{item:'pizza_base',qty:1},{item:'cheese',qty:1},{item:'tomato',qty:1},{item:'cooked_beef',qty:1},{item:'cooked_chicken',qty:1},{item:'corn',qty:1}], output:{item:'pizza_supreme',qty:1}, category:'Pizza'},
  // Soups & stews
  {id:'make_soup',     name:'Mushroom Soup',    level:10, xp:40,  time:4.0, input:[{item:'mushroom',qty:3},{item:'milk',qty:1}], output:{item:'mushroom_soup',qty:1}, category:'Soups'},
  {id:'make_stew',     name:'Stew',             level:20, xp:60,  time:5.0, input:[{item:'cooked_beef',qty:1},{item:'potato',qty:1},{item:'onion',qty:1}], output:{item:'stew',qty:1}, category:'Soups'},
  {id:'make_curry',    name:'Curry',            level:40, xp:100, time:6.0, input:[{item:'cooked_chicken',qty:1},{item:'tomato',qty:1},{item:'potato',qty:1},{item:'onion',qty:1}], output:{item:'curry',qty:1}, category:'Soups'},
  // Advanced
  {id:'make_omelette', name:'Omelette',         level:30, xp:70,  time:4.0, input:[{item:'egg',qty:3},{item:'cheese',qty:1},{item:'tomato',qty:1}], output:{item:'omelette',qty:1}, category:'Advanced'},
  {id:'make_feast',    name:'Feast',            level:65, xp:250, time:10.0,input:[{item:'cooked_beef',qty:2},{item:'lobster',qty:1},{item:'cake',qty:1},{item:'bread',qty:2}], output:{item:'feast',qty:1}, category:'Advanced'},
  {id:'make_elders_meal',name:'Elder\'s Meal',  level:80, xp:400, time:12.0,input:[{item:'shark',qty:1},{item:'cooked_beef',qty:1},{item:'chocolate_cake',qty:1},{item:'stew',qty:1}], output:{item:'elders_meal',qty:1}, category:'Advanced'},
];

for (const r of _newCookingRecipes) {
  if (!GAME_DATA.recipes.cooking.find(x=>x.id===r.id)) {
    GAME_DATA.recipes.cooking.push(r);
  }
}

// ── CRAFTING: LEATHER FROM COWHIDE ───────────────────────
if (!GAME_DATA.recipes.crafting.find(r=>r.id==='craft_leather')) {
  GAME_DATA.recipes.crafting.push(
    {id:'craft_leather', name:'Tan Leather', level:1, xp:15, time:3.0,
     input:[{item:'cowhide',qty:1}], output:{item:'leather',qty:1}, category:'Materials'},
    {id:'craft_hard_leather', name:'Tan Hard Leather', level:20, xp:35, time:4.0,
     input:[{item:'cowhide',qty:3}], output:{item:'hard_leather',qty:1}, category:'Materials'},
  );
}

// ── FORAGING: ADD MUSHROOM, WHEAT, EGG, HERB GATHERING ──
if (!GAME_DATA.gatheringActions.foraging.find(a=>a.id==='forage_mushroom')) {
  GAME_DATA.gatheringActions.foraging.push(
    {id:'forage_mushroom', name:'Gather Mushrooms', level:5, xp:18, time:4.0, output:{item:'mushroom',qty:1}},
    {id:'forage_wheat',    name:'Harvest Wheat',    level:8, xp:22, time:5.0, output:{item:'wheat',qty:2}},
    {id:'forage_egg',      name:'Collect Eggs',     level:3, xp:12, time:3.0, output:{item:'egg',qty:1}},
    {id:'forage_corn',     name:'Pick Corn',        level:12,xp:25, time:5.0, output:{item:'corn',qty:1}},
    {id:'forage_cabbage',  name:'Pick Cabbage',     level:6, xp:15, time:3.5, output:{item:'cabbage',qty:1}},
    {id:'forage_tomato',   name:'Pick Tomatoes',    level:10,xp:20, time:4.0, output:{item:'tomato',qty:1}},
  );
}

// ── EXPANDED CHICKEN DROPS ───────────────────────────────
if (GAME_DATA.monsters.chicken) {
  const ch = GAME_DATA.monsters.chicken;
  if (!ch.drops.find(d=>d.item==='raw_chicken')) ch.drops.push({item:'raw_chicken',qty:1,chance:0.80});
  if (!ch.drops.find(d=>d.item==='egg'))         ch.drops.push({item:'egg',qty:1,chance:0.25});
}

// ── MONSTER ART FOR NEW MONSTERS ─────────────────────────
if (!GAME_DATA.monsterArt) GAME_DATA.monsterArt = {};

GAME_DATA.monsterArt.cow = `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="38" rx="18" ry="14" fill="#d4c4a0"/><ellipse cx="32" cy="38" rx="16" ry="12" fill="#f0e8d0"/><circle cx="32" cy="26" r="10" fill="#d4c4a0"/><circle cx="28" cy="24" r="2" fill="#222"/><circle cx="36" cy="24" r="2" fill="#222"/><ellipse cx="32" cy="29" rx="4" ry="2.5" fill="#e8a0a0"/><path d="M24 18 Q20 12 22 16" stroke="#888" stroke-width="2" fill="none"/><path d="M40 18 Q44 12 42 16" stroke="#888" stroke-width="2" fill="none"/><rect x="24" y="48" width="4" height="8" rx="1" fill="#d4c4a0"/><rect x="36" y="48" width="4" height="8" rx="1" fill="#d4c4a0"/><ellipse cx="44" cy="36" rx="3" ry="2" fill="#d4c4a0"/></svg>`;

GAME_DATA.monsterArt.spider = `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="36" rx="12" ry="10" fill="#3a2a1a"/><circle cx="32" cy="26" r="8" fill="#4a3a2a"/><circle cx="29" cy="24" r="2.5" fill="#c44040"/><circle cx="35" cy="24" r="2.5" fill="#c44040"/><circle cx="29" cy="24" r="1" fill="#fff"/><circle cx="35" cy="24" r="1" fill="#fff"/><path d="M20 28 Q12 20 8 16" stroke="#3a2a1a" stroke-width="2" fill="none"/><path d="M22 34 Q14 32 6 28" stroke="#3a2a1a" stroke-width="2" fill="none"/><path d="M22 40 Q14 44 6 46" stroke="#3a2a1a" stroke-width="2" fill="none"/><path d="M24 44 Q16 50 10 56" stroke="#3a2a1a" stroke-width="2" fill="none"/><path d="M44 28 Q52 20 56 16" stroke="#3a2a1a" stroke-width="2" fill="none"/><path d="M42 34 Q50 32 58 28" stroke="#3a2a1a" stroke-width="2" fill="none"/><path d="M42 40 Q50 44 58 46" stroke="#3a2a1a" stroke-width="2" fill="none"/><path d="M40 44 Q48 50 54 56" stroke="#3a2a1a" stroke-width="2" fill="none"/></svg>`;

GAME_DATA.monsterArt.bear = `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="40" rx="16" ry="14" fill="#4a3020"/><circle cx="32" cy="24" r="12" fill="#5a3828"/><circle cx="24" cy="16" r="5" fill="#5a3828"/><circle cx="40" cy="16" r="5" fill="#5a3828"/><circle cx="24" cy="16" r="3" fill="#3a2018"/><circle cx="40" cy="16" r="3" fill="#3a2018"/><circle cx="28" cy="22" r="2" fill="#222"/><circle cx="36" cy="22" r="2" fill="#222"/><ellipse cx="32" cy="27" rx="3" ry="2" fill="#222"/><path d="M29 30 Q32 33 35 30" stroke="#222" stroke-width="1.5" fill="none"/><rect x="22" y="50" width="5" height="8" rx="2" fill="#4a3020"/><rect x="37" y="50" width="5" height="8" rx="2" fill="#4a3020"/></svg>`;

GAME_DATA.monsterArt.guard = `<svg viewBox="0 0 64 64"><rect x="24" y="26" width="16" height="22" rx="2" fill="#555"/><circle cx="32" cy="20" r="8" fill="#c8a880"/><rect x="22" y="12" width="20" height="6" rx="1" fill="#666"/><rect x="26" y="8" width="12" height="6" rx="1" fill="#777"/><circle cx="29" cy="19" r="1.5" fill="#222"/><circle cx="35" cy="19" r="1.5" fill="#222"/><rect x="18" y="28" width="6" height="18" rx="2" fill="#555"/><rect x="40" y="28" width="6" height="18" rx="2" fill="#555"/><rect x="42" y="18" width="3" height="30" fill="#888"/><rect x="40" y="16" width="7" height="3" rx="1" fill="#aaa"/><rect x="26" y="48" width="5" height="8" rx="1" fill="#444"/><rect x="33" y="48" width="5" height="8" rx="1" fill="#444"/></svg>`;

GAME_DATA.monsterArt.moss_giant = `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="38" rx="18" ry="16" fill="#3a5a2a"/><circle cx="32" cy="20" r="11" fill="#4a6a3a"/><circle cx="27" cy="18" r="3" fill="#8a0"/><circle cx="37" cy="18" r="3" fill="#8a0"/><circle cx="27" cy="18" r="1.5" fill="#222"/><circle cx="37" cy="18" r="1.5" fill="#222"/><path d="M28 25 Q32 28 36 25" stroke="#2a3a1a" stroke-width="2" fill="none"/><rect x="14" y="26" width="10" height="22" rx="4" fill="#3a5a2a"/><rect x="40" y="26" width="10" height="22" rx="4" fill="#3a5a2a"/><rect x="24" y="50" width="7" height="10" rx="3" fill="#3a5a2a"/><rect x="33" y="50" width="7" height="10" rx="3" fill="#3a5a2a"/><circle cx="20" cy="32" r="2" fill="#5a8a4a"/><circle cx="44" cy="36" r="2" fill="#5a8a4a"/><circle cx="36" cy="42" r="1.5" fill="#5a8a4a"/></svg>`;

GAME_DATA.monsterArt.ice_warrior = `<svg viewBox="0 0 64 64"><rect x="24" y="26" width="16" height="22" rx="2" fill="#a0c8e8"/><circle cx="32" cy="20" r="8" fill="#c0daf0"/><rect x="24" y="14" width="16" height="4" rx="1" fill="#80b0d0"/><polygon points="28,14 32,6 36,14" fill="#60a0c8"/><circle cx="29" cy="19" r="1.5" fill="#4080b0"/><circle cx="35" cy="19" r="1.5" fill="#4080b0"/><rect x="16" y="28" width="8" height="16" rx="3" fill="#a0c8e8"/><rect x="40" y="28" width="8" height="16" rx="3" fill="#a0c8e8"/><rect x="12" y="20" width="4" height="26" fill="#b0d8f0"/><polygon points="10,18 16,18 14,10" fill="#c0e8ff"/><rect x="26" y="48" width="5" height="8" rx="1" fill="#80b0d0"/><rect x="33" y="48" width="5" height="8" rx="1" fill="#80b0d0"/></svg>`;

GAME_DATA.monsterArt.fire_giant = `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="38" rx="18" ry="16" fill="#8a3a1a"/><circle cx="32" cy="20" r="12" fill="#a04a2a"/><circle cx="27" cy="18" r="3" fill="#ff6a00"/><circle cx="37" cy="18" r="3" fill="#ff6a00"/><circle cx="27" cy="18" r="1.5" fill="#fff"/><circle cx="37" cy="18" r="1.5" fill="#fff"/><path d="M26 25 Q32 30 38 25" stroke="#5a1a0a" stroke-width="2" fill="none"/><rect x="14" y="26" width="10" height="22" rx="4" fill="#8a3a1a"/><rect x="40" y="26" width="10" height="22" rx="4" fill="#8a3a1a"/><rect x="24" y="50" width="7" height="10" rx="3" fill="#8a3a1a"/><rect x="33" y="50" width="7" height="10" rx="3" fill="#8a3a1a"/><path d="M22 8 Q26 2 28 10 Q30 4 32 12 Q34 6 36 10 Q38 2 42 8" stroke="#ff6a00" stroke-width="2" fill="#ff4a00" opacity="0.7"/></svg>`;

GAME_DATA.monsterArt.black_knight = `<svg viewBox="0 0 64 64"><rect x="24" y="26" width="16" height="22" rx="2" fill="#2a2a2a"/><circle cx="32" cy="20" r="8" fill="#333"/><rect x="24" y="12" width="16" height="8" rx="1" fill="#222"/><rect x="24" y="18" width="16" height="2" fill="#444"/><rect x="28" y="18" width="8" height="4" rx="1" fill="none" stroke="#555" stroke-width="0.5"/><circle cx="29" cy="17" r="1.5" fill="#c44040"/><circle cx="35" cy="17" r="1.5" fill="#c44040"/><rect x="18" y="28" width="6" height="18" rx="2" fill="#2a2a2a"/><rect x="40" y="28" width="6" height="18" rx="2" fill="#2a2a2a"/><rect x="40" y="16" width="4" height="34" fill="#444"/><polygon points="40,14 48,14 44,6" fill="#555"/><rect x="28" y="30" width="8" height="2" rx="1" fill="#c44040"/><rect x="26" y="48" width="5" height="8" rx="1" fill="#222"/><rect x="33" y="48" width="5" height="8" rx="1" fill="#222"/></svg>`;

GAME_DATA.monsterArt.hellhound = `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="38" rx="16" ry="12" fill="#4a1a0a"/><circle cx="26" cy="26" r="9" fill="#5a2a10"/><path d="M20 20 L16 12 L22 18" fill="#5a2a10"/><path d="M32 20 L36 12 L30 18" fill="#5a2a10"/><circle cx="23" cy="24" r="2.5" fill="#ff4a00"/><circle cx="29" cy="24" r="2.5" fill="#ff4a00"/><circle cx="23" cy="24" r="1" fill="#fff"/><circle cx="29" cy="24" r="1" fill="#fff"/><path d="M22 30 Q26 33 30 30" stroke="#8a1a0a" stroke-width="1.5" fill="none"/><path d="M22 30 L20 31 L22 29" fill="#fff"/><path d="M30 30 L32 31 L30 29" fill="#fff"/><rect x="20" y="46" width="4" height="8" rx="1" fill="#4a1a0a"/><rect x="28" y="46" width="4" height="8" rx="1" fill="#4a1a0a"/><rect x="36" y="46" width="4" height="8" rx="1" fill="#4a1a0a"/><rect x="44" y="46" width="4" height="8" rx="1" fill="#4a1a0a"/><path d="M44 34 Q52 30 56 36 Q52 38 48 36" fill="#4a1a0a"/><path d="M44 34 Q50 26 54 32" stroke="#ff4a00" stroke-width="1" fill="none" opacity="0.5"/></svg>`;

GAME_DATA.monsterArt.steel_dragon = `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="40" rx="18" ry="14" fill="#708090"/><circle cx="28" cy="24" r="10" fill="#8090a0"/><path d="M18 18 L10 8 L16 16" fill="#8090a0"/><path d="M38 18 L46 8 L40 16" fill="#8090a0"/><circle cx="24" cy="22" r="2.5" fill="#ff6a00"/><circle cx="32" cy="22" r="2.5" fill="#ff6a00"/><path d="M22 28 Q28 32 34 28" stroke="#505a60" stroke-width="2" fill="none"/><path d="M22 28 L20 29 L22 27" fill="#ddd"/><path d="M34 28 L36 29 L34 27" fill="#ddd"/><path d="M14 32 Q4 26 2 34 Q8 30 12 34" fill="#8090a0"/><path d="M50 32 Q60 26 62 34 Q56 30 52 34" fill="#8090a0"/><path d="M46 38 Q54 42 50 50 Q48 44 44 40" fill="#708090"/><path d="M20 10 Q24 4 28 10" stroke="#8090a0" stroke-width="2" fill="none"/><rect x="24" y="50" width="5" height="8" rx="2" fill="#606a70"/><rect x="35" y="50" width="5" height="8" rx="2" fill="#606a70"/></svg>`;

// ── COOKING CATEGORIES ───────────────────────────────────
(function categorizeCooking() {
  for (const r of GAME_DATA.recipes.cooking) {
    if (r.category) continue;
    const id = r.id.toLowerCase();
    if (id.includes('cook_') && !id.includes('pie') && !id.includes('pizza')) r.category = 'Meat';
    else r.category = 'Fish';
  }
})();

console.log('[Ashfall] World Expansion v8.0 loaded');
console.log('  New monsters:', Object.keys(_newMonsters).length);
console.log('  New food items:', _resources.filter(r=>r.type==='food').length);
console.log('  New ingredients:', _resources.filter(r=>r.type==='resource').length);
console.log('  New cooking recipes:', _newCookingRecipes.length);
console.log('  Drop tables:', Object.keys(GAME_DATA.dropTables).length);
console.log('  Total items:', Object.keys(GAME_DATA.items).length);
console.log('  Total monsters:', Object.keys(GAME_DATA.monsters).length);
console.log('  Total recipes:', Object.values(GAME_DATA.recipes).reduce((a,r)=>a+r.length,0));
