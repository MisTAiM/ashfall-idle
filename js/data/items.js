// ================================================================
// ASHFALL IDLE — data/items.js
// All 700+ items. One file. One schema.
// Merges: data.js (items section) + items-new.js + items-expand.js
//         + items-combat.js + items-mega.js + items-world.js
// ================================================================
// ================================================================
// ASHFALL IDLE — items-new.js
// NEW items: weapons, armor, accessories, consumables, quest items.
// Add all new items HERE. Never patch data.js for new content.
// Loaded after items-mega.js, before sprites.js.
// ================================================================

// ── ITEM ADD HELPER ───────────────────────────────────────────────
function _item(id, def) {
  if (!GAME_DATA.items[id]) GAME_DATA.items[id] = { id, ...def };
}
function _shopAdd(item, price, category) {
  if (!GAME_DATA.shop.find(s => s.item === item)) {
    GAME_DATA.shop.push({ item, price, category });
  }
}

// ================================================================
// QUEST ITEMS & KEYS
// ================================================================
_item('ancient_key',    { name:'Ancient Key',     type:'quest', rarity:'rare',    sellPrice:0,   desc:'Opens the vault in the Ashen Crypts.' });
_item('void_shard',     { name:'Void Shard',       type:'quest', rarity:'epic',    sellPrice:0,   desc:'A crystallised fragment of void energy. Required for advanced void crafting.' });
_item('ashfall_crown',  { name:'Ashfall Crown',    type:'quest', rarity:'mythic',  sellPrice:0,   desc:'The crown of the Ashen Overlord. Proof of your conquest.' });
_item('hollow_sigil',   { name:'Hollow Sigil',     type:'quest', rarity:'epic',    sellPrice:0,   desc:'The Hollow Lord\'s seal. Opens the Shadow Sanctum.' });
_item('storm_core',     { name:'Storm Core',        type:'quest', rarity:'epic',    sellPrice:0,   desc:'The heart of the Storm Reaver. Used in endgame crafting.' });

// ================================================================
// CONSUMABLES — Potions, scrolls, food
// ================================================================
_item('super_attack_potion',  { name:'Super Attack Potion',  type:'potion', heals:0, boost:{attack:5},  sellPrice:800,  desc:'+5 Attack for 3 minutes.' });
_item('super_strength_potion',{ name:'Super Strength Potion',type:'potion', heals:0, boost:{strength:5},sellPrice:900,  desc:'+5 Strength for 3 minutes.' });
_item('super_defence_potion', { name:'Super Defence Potion', type:'potion', heals:0, boost:{defence:5}, sellPrice:750,  desc:'+5 Defence for 3 minutes.' });
_item('super_ranging_potion', { name:'Super Ranging Potion', type:'potion', heals:0, boost:{ranged:5},  sellPrice:850,  desc:'+5 Ranged for 3 minutes.' });
_item('super_magic_potion',   { name:'Super Magic Potion',   type:'potion', heals:0, boost:{magic:5},   sellPrice:950,  desc:'+5 Magic for 3 minutes.' });
_item('prayer_potion',        { name:'Prayer Potion',         type:'potion', heals:0, prayerRestore:30,  sellPrice:400,  desc:'Restores 30 Prayer points.' });
_item('super_prayer_potion',  { name:'Super Prayer Potion',   type:'potion', heals:0, prayerRestore:65,  sellPrice:800,  desc:'Restores 65 Prayer points.' });
_item('overload_potion',      { name:'Overload',              type:'potion', heals:0, boost:{attack:8,strength:8,defence:8,ranged:8,magic:8}, sellPrice:8000, rarity:'epic', desc:'+8 all combat stats for 5 minutes. POWERFUL.' });
_item('sanfew_serum',         { name:'Sanfew Serum',          type:'potion', heals:0, clearNegative:true, sellPrice:1200, desc:'Cures all status effects and restores Prayer.' });

// Food items
_item('shark',    { name:'Shark',     type:'food', heals:20, sellPrice:300, desc:'A large cooked shark. Heals 20 HP.' });
_item('anglerfish',{ name:'Anglerfish',type:'food', heals:22, sellPrice:400, desc:'A rare anglerfish. Heals 22 HP and can overheal.' });
_item('dark_crab', { name:'Dark Crab', type:'food', heals:22, sellPrice:350, desc:'A dark crab from the deep. Heals 22 HP.' });
_item('manta_ray', { name:'Manta Ray', type:'food', heals:22, sellPrice:380, desc:'An exotic manta ray. Heals 22 HP.' });
_item('cooked_karambwan',{ name:'Karambwan', type:'food', heals:18, sellPrice:250, fast:true, desc:'Fast-eat food. Heals 18 HP. Can be eaten immediately after another food.' });

// ================================================================
// CRAFTING MATERIALS
// ================================================================
_item('void_crystal',   { name:'Void Crystal',    type:'resource', rarity:'epic',    sellPrice:600,  desc:'Crystallised void energy. Used in advanced crafting.' });
_item('dragon_heart',   { name:'Dragon Heart',    type:'resource', rarity:'legendary',sellPrice:2000, desc:'The heart of a dragon. Required for Dragon Rider armor.' });
_item('celestial_ore',  { name:'Celestial Ore',   type:'resource', rarity:'legendary',sellPrice:1500, desc:'Ore from celestial fragments. Required for mythic-tier crafting.' });
_item('shadow_essence', { name:'Shadow Essence',  type:'resource', rarity:'epic',    sellPrice:800,  desc:'Distilled shadow. Required for Shadowscale crafting.' });
_item('frost_crystal',  { name:'Frost Crystal',   type:'resource', rarity:'rare',    sellPrice:300,  desc:'A frozen crystal from the Frozen Spire. Used in ice magic crafting.' });

// ================================================================
// ENDGAME WEAPONS — goes here, not in items-combat.js
// ================================================================
_item('blade_of_saeldor', {
  name:"Blade of Saeldor", type:'weapon', slot:'weapon', style:'melee',
  attackSpeed:2.0, stats:{attackBonus:125, strengthBonus:145}, levelReq:{attack:80},
  rarity:'mythic', sellPrice:80000,
  specCost:35, specEffect:{type:'armorPierce', mult:1.25, ignoreDefPct:100},
  desc:'An ancient elven blade. Spec: 125% damage ignoring ALL defence. 35% spec.'
});
_item('scythe_of_vitur', {
  name:"Scythe of Vitur", type:'weapon', slot:'weapon', style:'melee',
  attackSpeed:2.0, stats:{attackBonus:110, strengthBonus:140}, levelReq:{attack:75, strength:75},
  rarity:'mythic', sellPrice:120000,
  specCost:100, specEffect:{type:'triple_hit', mult:0.80, hits:3},
  desc:'Hits up to 3 times per attack. Spec: 3 hits at 80% each. 100% spec.'
});
_item('tumeken_shadow', {
  name:"Tumeken's Shadow", type:'weapon', slot:'weapon', style:'magic',
  attackSpeed:2.4, stats:{magicBonus:145, attackBonus:35}, levelReq:{magic:85},
  rarity:'mythic', sellPrice:200000, providesAllRunes:true,
  specCost:50, specEffect:{type:'shadow_surge', mult:2.5, ignoreDefPct:100},
  desc:'The most powerful magic weapon. All runes free. Spec: 250% ignoring all defence. 50% spec.'
});
_item('dharoks_greataxe', {
  name:"Maldrak's Greataxe", type:'weapon', slot:'weapon', style:'melee',
  attackSpeed:3.4, stats:{attackBonus:103, strengthBonus:138}, levelReq:{attack:70, strength:70},
  rarity:'legendary', sellPrice:60000,
  passiveEffect:{ type:'maldrak', desc:"Deals more damage the lower your HP. At 1HP: triple max hit." },
  desc:"Maldrak's Greataxe. Passive: the lower your HP, the higher your max hit."
});

// Add to shop
_shopAdd('prayer_potion',         400,  'potions');
_shopAdd('super_attack_potion',   800,  'potions');
_shopAdd('super_strength_potion', 900,  'potions');
_shopAdd('super_defence_potion',  750,  'potions');
_shopAdd('super_ranging_potion',  850,  'potions');
_shopAdd('super_magic_potion',    950,  'potions');
_shopAdd('shark',                 800,  'food');
_shopAdd('anglerfish',           1100,  'food');
_shopAdd('dark_crab',             950,  'food');

// console.log('[Ashfall] items-new.js loaded. New items added:', ['blade_of_saeldor','scythe_of_vitur','tumeken_shadow','dharoks_greataxe','prayer_potion','shark','anglerfish'].filter(id=>GAME_DATA.items[id]).length);

// ================================================================
// THEATRE OF ASH — Exclusive Items
// ================================================================

// ── WEAPONS ──────────────────────────────────────────────────────
_item('veriax_scythe', {
  name:"Veriax's Scythe", type:'weapon', slot:'weapon', style:'melee',
  attackSpeed:2.0, stats:{attackBonus:135, strengthBonus:155}, levelReq:{attack:85, strength:85},
  rarity:'mythic', sellPrice:0,
  passiveEffect:{ type:'triple_hit', desc:'Hits 3 times per attack (100%/50%/25% damage).' },
  specCost:50, specEffect:{type:'void_reap', mult:1.0, hits:3, healPct:20},
  desc:"Lady Veriax's scythe. Passive: hits 3 targets. Spec: 3-hit with 20% lifesteal. Unsellable.",
});
_item('bloodfire_staff', {
  name:'Bloodfire Staff', type:'weapon', slot:'weapon', style:'magic',
  attackSpeed:2.2, stats:{magicBonus:148, attackBonus:30}, levelReq:{magic:85},
  rarity:'mythic', sellPrice:0, providesAllRunes:true,
  specCost:50, specEffect:{type:'blood_torrent', mult:1.80, healPct:50, drain:true},
  desc:'Staff of blood and fire. Unlimited all runes. Spec: 180% damage + heal 50% dealt. Unsellable.',
});
_item('ashen_rapier', {
  name:'Ashen Rapier', type:'weapon', slot:'weapon', style:'melee',
  attackSpeed:1.6, stats:{attackBonus:138, strengthBonus:130}, levelReq:{attack:80},
  rarity:'mythic', sellPrice:0,
  specCost:25, specEffect:{type:'quadStab', mult:0.90, hits:4},
  desc:'A needle-thin rapier of concentrated ash. Spec: 4 rapid stabs at 90% each. 25% spec. Unsellable.',
});

// ── ARMOUR — Judicator Set ────────────────────────────────────────
_item('judicator_helm', {
  name:'Judicator Helm', type:'armor', slot:'head', rarity:'mythic', sellPrice:0,
  stats:{defenceBonus:110, strengthBonus:15, damageReduction:3},
  levelReq:{defence:85},
  desc:'Helm of the Theatre Judicator. +110 Def, +15 Str, DR3. Unsellable.',
});
_item('judicator_plate', {
  name:'Judicator Plate', type:'armor', slot:'body', rarity:'mythic', sellPrice:0,
  stats:{defenceBonus:220, strengthBonus:25, damageReduction:6},
  levelReq:{defence:85},
  desc:'Body of the Theatre Judicator. +220 Def, +25 Str, DR6 — highest defence in the game. Unsellable.',
});
_item('judicator_legs', {
  name:'Judicator Legs', type:'armor', slot:'legs', rarity:'mythic', sellPrice:0,
  stats:{defenceBonus:175, strengthBonus:20, damageReduction:4},
  levelReq:{defence:85},
  desc:'Legs of the Theatre Judicator. +175 Def, +20 Str, DR4. Unsellable.',
});

// ── ACCESSORIES ───────────────────────────────────────────────────
_item('hollow_ward', {
  name:'Hollow Ward', type:'armor', slot:'shield', rarity:'mythic', sellPrice:0,
  stats:{defenceBonus:80, strengthBonus:8, magicBonus:8, rangedBonus:8, damageReduction:4},
  levelReq:{defence:75},
  desc:'A shield infused with hollow energy. Best-in-slot shield. Unsellable.',
});
_item('void_tear', {
  name:'Void Tear', type:'armor', slot:'ring', rarity:'legendary', sellPrice:0,
  stats:{attackBonus:6, strengthBonus:6, rangedBonus:6, magicBonus:6},
  levelReq:{},
  desc:'A ring shaped like a tear in reality. All-style bonus. Unsellable.',
});
_item('veriax_eye', {
  name:"Veriax's Eye", type:'armor', slot:'amulet', rarity:'mythic', sellPrice:0,
  stats:{attackBonus:15, strengthBonus:20, rangedBonus:15, magicBonus:20, defenceBonus:10},
  levelReq:{},
  desc:"The amulet form of Lady Veriax's true eye. Best-in-slot amulet. Unsellable.",
});

// ── PET ───────────────────────────────────────────────────────────
_item('lil_veriax', {
  name:"Lil' Veriax", type:'pet_token', rarity:'mythic', sellPrice:0,
  desc:"A miniature Lady Veriax. Equip to bring her into battle as your companion. Rarest Theatre drop.",
});

// Register as combat pet
if (!GAME_DATA.combatPets) GAME_DATA.combatPets = [];
if (!GAME_DATA.combatPets.find(p => p.id === 'lil_veriax')) {
  GAME_DATA.combatPets.push({
    id:'lil_veriax', name:"Lil' Veriax", itemId:'lil_veriax',
    source:'theatre_of_ash', dropRate:'Theatre exclusive (purple chest)',
    passiveBonus:'All combat damage +8%',
    action:{ every:3, type:'void_strike', damage:0.25, desc:'Casts a void bolt for 25% of your max hit' },
    stats:{ damageMult:1.08 },
  });
}

// console.log('[Ashfall] Theatre of Ash items registered:', 
//   ['veriax_scythe','bloodfire_staff','ashen_rapier','judicator_helm','judicator_plate',
//    'judicator_legs','hollow_ward','void_tear','veriax_eye','lil_veriax'].filter(id=>GAME_DATA.items[id]).length);

// ── MISSING QUEST/UTILITY ITEMS ─────────────────────────────────
if (!GAME_DATA.items.herb_sack)
  GAME_DATA.items.herb_sack = { id:'herb_sack', name:'Herb Sack', type:'tool', subtype:'gathering', rarity:'rare', sellPrice:0, desc:'Automatically collects herbs while gathering. Holds up to 30 herbs.', unique:true };

if (!GAME_DATA.items.ring_of_wealth)
  GAME_DATA.items.ring_of_wealth = { id:'ring_of_wealth', name:'Ring of Wealth', type:'armor', slot:'ring', stats:{}, rarity:'rare', sellPrice:2000, sprite:'ring-gold', desc:'Improves rare drop rates by 5%.', bonus:{ dropRate:5 } };

// Bronze/iron arrows in shop
if (!GAME_DATA.shop.find(s=>s.item==='bronze_arrows'))
  GAME_DATA.shop.push({item:'bronze_arrows', price:3,  category:'equipment', desc:'Bronze arrows x1'});
if (!GAME_DATA.shop.find(s=>s.item==='iron_arrows'))
  GAME_DATA.shop.push({item:'iron_arrows',   price:6,  category:'equipment', desc:'Iron arrows x1'});
if (!GAME_DATA.shop.find(s=>s.item==='steel_arrows'))
  GAME_DATA.shop.push({item:'steel_arrows',  price:12, category:'equipment', desc:'Steel arrows x1'});

// ── FISHING RARE CATCHES & SKILL DEPTH ITEMS ────────────────────
if (!GAME_DATA.items.mermaid_tear)
  GAME_DATA.items.mermaid_tear   = { id:'mermaid_tear',   name:"Mermaid's Tear",  type:'resource', rarity:'rare',      sellPrice:500,  sprite:'gem-blue',   desc:'A crystallised drop from the deep. Sell to fishermen for rewards.' };
if (!GAME_DATA.items.fishing_trophy)
  GAME_DATA.items.fishing_trophy = { id:'fishing_trophy', name:'Fishing Trophy',  type:'resource', rarity:'uncommon',  sellPrice:200,  sprite:'misc-coin',  desc:'An ornate trophy for exceptional catches.' };
if (!GAME_DATA.items.leviathan_scale)
  GAME_DATA.items.leviathan_scale= { id:'leviathan_scale',name:'Leviathan Scale', type:'resource', rarity:'epic',      sellPrice:1500, sprite:'misc-scale', desc:'A massive scale from a legendary leviathan. Prized by crafters.' };
if (!GAME_DATA.items.clue_scroll_easy)
  GAME_DATA.items.clue_scroll_easy={ id:'clue_scroll_easy',name:'Clue Scroll (Easy)',type:'quest', rarity:'uncommon', sellPrice:0,    sprite:'misc-scroll', desc:'A mysterious scroll. Solve the clues for treasure!' };

// ── BIRD NEST DROPS ─────────────────────────────────────────────
if (!GAME_DATA.items.gold_ring)
  GAME_DATA.items.gold_ring = { id:'gold_ring', name:'Gold Ring', type:'armor', slot:'ring', stats:{}, rarity:'common', sellPrice:100, sprite:'ring-gold', desc:'A plain gold ring.' };
if (!GAME_DATA.items.sapphire_ring)
  GAME_DATA.items.sapphire_ring = { id:'sapphire_ring', name:'Sapphire Ring', type:'armor', slot:'ring', stats:{}, rarity:'uncommon', sellPrice:350, sprite:'ring-blue', desc:'A ring set with sapphire.' };
if (!GAME_DATA.items.ruby_ring)
  GAME_DATA.items.ruby_ring = { id:'ruby_ring', name:'Ruby Ring', type:'armor', slot:'ring', stats:{}, rarity:'rare', sellPrice:800, sprite:'ring-red', desc:'A ring set with ruby.' };
if (!GAME_DATA.items.diamond_ring)
  GAME_DATA.items.diamond_ring = { id:'diamond_ring', name:'Diamond Ring', type:'armor', slot:'ring', stats:{}, rarity:'rare', sellPrice:1500, sprite:'ring-pale', desc:'A ring set with diamond.' };
if (!GAME_DATA.items.ranarr_seed)
  GAME_DATA.items.ranarr_seed = { id:'ranarr_seed', name:'Ranarr Seed', type:'seed', growTime:2400, yield:'ranarr_weed', rarity:'rare', sellPrice:80, sprite:'misc-seed', desc:'A seed for a Ranarr herb. 40-min grow time.' };
if (!GAME_DATA.items.ranarr_weed)
  GAME_DATA.items.ranarr_weed = { id:'ranarr_weed', name:'Ranarr Weed', type:'resource', subtype:'herb', rarity:'rare', sellPrice:200, sprite:'herb-green', desc:'A potent herb used in prayer potions.' };

// ================================================================
// ASHFALL IDLE - Items Expansion (Tools, Arrows, Quiver)
// Loaded AFTER data.js, BEFORE engine.js
// ================================================================

// ── PICKAXES ─────────────────────────────────────────────
// Each pickaxe reduces mining time by a percentage
const _pickaxes = [
  {id:'bronze_pickaxe', name:'Bronze Pickaxe',  level:1,  speed:2,  atk:4,  cost:500,    bars:'bronze_bar', barQty:10, rarity:'common',    desc:'A basic bronze pickaxe. Reduces mining time by 2%.'},
  {id:'iron_pickaxe',   name:'Iron Pickaxe',    level:10, speed:5,  atk:8,  cost:2000,   bars:'iron_bar',   barQty:10, rarity:'common',    desc:'A sturdy iron pickaxe. Reduces mining time by 5%.'},
  {id:'steel_pickaxe',  name:'Steel Pickaxe',   level:20, speed:8,  atk:12, cost:5000,   bars:'steel_bar',  barQty:12, rarity:'uncommon',  desc:'A sharp steel pickaxe. Reduces mining time by 8%.'},
  {id:'mithril_pickaxe',name:'Mithril Pickaxe', level:30, speed:12, atk:16, cost:15000,  bars:'mithril_bar',barQty:14, rarity:'uncommon',  desc:'A lightweight mithril pickaxe. Reduces mining time by 12%.'},
  {id:'adamant_pickaxe',name:'Adamant Pickaxe', level:40, speed:16, atk:22, cost:40000,  bars:'adamant_bar',barQty:16, rarity:'rare',      desc:'An incredibly hard adamant pickaxe. Reduces mining time by 16%.'},
  {id:'runite_pickaxe', name:'Runite Pickaxe',  level:50, speed:20, atk:28, cost:100000, bars:'runite_bar', barQty:18, rarity:'rare',      desc:'Forged from runite. Reduces mining time by 20%.'},
  {id:'obsidian_pickaxe',name:'Obsidian Pickaxe',level:60,speed:25, atk:35, cost:250000, bars:'obsidian_bar',barQty:20,rarity:'epic',      desc:'Volcanic glass edge. Reduces mining time by 25%.'},
  {id:'ashsteel_pickaxe',name:'Ashsteel Pickaxe',level:75,speed:30, atk:42, cost:500000, bars:'ashsteel_bar',barQty:22,rarity:'legendary', desc:'The ultimate pickaxe. Reduces mining time by 30%.'},
];

// ── HATCHETS ─────────────────────────────────────────────
const _hatchets = [
  {id:'bronze_hatchet', name:'Bronze Hatchet',  level:1,  speed:2,  atk:4,  cost:500,    bars:'bronze_bar', barQty:8,  rarity:'common',    desc:'A basic bronze hatchet. Reduces woodcutting time by 2%.'},
  {id:'iron_hatchet',   name:'Iron Hatchet',    level:10, speed:5,  atk:8,  cost:2000,   bars:'iron_bar',   barQty:8,  rarity:'common',    desc:'A solid iron hatchet. Reduces woodcutting time by 5%.'},
  {id:'steel_hatchet',  name:'Steel Hatchet',   level:20, speed:8,  atk:12, cost:5000,   bars:'steel_bar',  barQty:10, rarity:'uncommon',  desc:'A keen steel hatchet. Reduces woodcutting time by 8%.'},
  {id:'mithril_hatchet',name:'Mithril Hatchet', level:30, speed:12, atk:16, cost:15000,  bars:'mithril_bar',barQty:12, rarity:'uncommon',  desc:'Lightweight and sharp. Reduces woodcutting time by 12%.'},
  {id:'adamant_hatchet',name:'Adamant Hatchet', level:40, speed:16, atk:22, cost:40000,  bars:'adamant_bar',barQty:14, rarity:'rare',      desc:'Cuts through anything. Reduces woodcutting time by 16%.'},
  {id:'runite_hatchet', name:'Runite Hatchet',  level:50, speed:20, atk:28, cost:100000, bars:'runite_bar', barQty:16, rarity:'rare',      desc:'Enchanted runite edge. Reduces woodcutting time by 20%.'},
  {id:'obsidian_hatchet',name:'Obsidian Hatchet',level:60,speed:25, atk:35, cost:250000, bars:'obsidian_bar',barQty:18,rarity:'epic',      desc:'Volcanic glass blade. Reduces woodcutting time by 25%.'},
  {id:'ashsteel_hatchet',name:'Ashsteel Hatchet',level:75,speed:30, atk:42, cost:500000, bars:'ashsteel_bar',barQty:20,rarity:'legendary', desc:'The ultimate hatchet. Reduces woodcutting time by 30%.'},
];

// ── FISHING RODS ─────────────────────────────────────────
const _fishingRods = [
  {id:'wooden_rod',     name:'Wooden Rod',       level:1,  speed:2,  cost:300,    rarity:'common',   desc:'A simple wooden rod. Reduces fishing time by 2%.'},
  {id:'oak_rod',        name:'Oak Rod',          level:15, speed:6,  cost:3000,   rarity:'common',   desc:'An oak fishing rod. Reduces fishing time by 6%.'},
  {id:'willow_rod',     name:'Willow Rod',       level:30, speed:10, cost:12000,  rarity:'uncommon', desc:'A flexible willow rod. Reduces fishing time by 10%.'},
  {id:'maple_rod',      name:'Maple Rod',        level:45, speed:15, cost:35000,  rarity:'uncommon', desc:'A strong maple rod. Reduces fishing time by 15%.'},
  {id:'yew_rod',        name:'Yew Rod',          level:60, speed:20, cost:100000, rarity:'rare',     desc:'An ancient yew rod. Reduces fishing time by 20%.'},
  {id:'elder_rod',      name:'Elder Rod',        level:75, speed:25, cost:300000, rarity:'epic',     desc:'Carved from elder wood. Reduces fishing time by 25%.'},
  {id:'crystal_rod',    name:'Crystal Rod',      level:85, speed:30, cost:600000, rarity:'legendary',desc:'A crystalline rod. Reduces fishing time by 30%.'},
];

// Register tool items
for (const t of _pickaxes) {
  GAME_DATA.items[t.id] = {
    id:t.id, name:t.name, type:'tool', subtype:'pickaxe', slot:'weapon',
    stats:{attackBonus:t.atk}, levelReq:{mining:t.level, attack:Math.max(1,Math.floor(t.level*0.8))},
    toolSpeed:{mining:t.speed}, sellPrice:Math.floor(t.cost*0.3),
    sprite:'tool-pickaxe', rarity:t.rarity, desc:t.desc,
  };
}
for (const t of _hatchets) {
  GAME_DATA.items[t.id] = {
    id:t.id, name:t.name, type:'tool', subtype:'hatchet', slot:'weapon',
    stats:{attackBonus:t.atk}, levelReq:{woodcutting:t.level, attack:Math.max(1,Math.floor(t.level*0.8))},
    toolSpeed:{woodcutting:t.speed}, sellPrice:Math.floor(t.cost*0.3),
    sprite:'tool-hatchet', rarity:t.rarity, desc:t.desc,
  };
}
for (const t of _fishingRods) {
  GAME_DATA.items[t.id] = {
    id:t.id, name:t.name, type:'tool', subtype:'fishing_rod', slot:'weapon',
    stats:{attackBonus:0}, levelReq:{fishing:t.level},
    toolSpeed:{fishing:t.speed}, sellPrice:Math.floor(t.cost*0.3),
    sprite:'tool-rod', rarity:t.rarity, desc:t.desc,
  };
}

// Tool crafting recipes (smithing)
for (const t of _pickaxes) {
  GAME_DATA.recipes.smithing.push({
    id:'smith_'+t.id, name:t.name, level:Math.max(1,t.level),
    xp:t.barQty*10, time:6.0,
    input:[{item:t.bars,qty:t.barQty}], output:{item:t.id,qty:1},
  });
}
for (const t of _hatchets) {
  GAME_DATA.recipes.smithing.push({
    id:'smith_'+t.id, name:t.name, level:Math.max(1,t.level),
    xp:t.barQty*10, time:6.0,
    input:[{item:t.bars,qty:t.barQty}], output:{item:t.id,qty:1},
  });
}

// Fishing rod crafting (fletching)
for (const t of _fishingRods) {
  const wood = t.level < 15 ? 'oak_log' : t.level < 30 ? 'oak_log' : t.level < 45 ? 'willow_log' : t.level < 60 ? 'maple_log' : t.level < 75 ? 'yew_log' : 'elder_log';
  GAME_DATA.recipes.fletching.push({
    id:'fletch_'+t.id, name:t.name, level:t.level,
    xp:t.speed*8, time:5.0,
    input:[{item:wood,qty:5},{item:'feather',qty:10}], output:{item:t.id,qty:1},
  });
}

// Add tools to shop
for (const t of _pickaxes) GAME_DATA.shop.push({item:t.id, price:t.cost, category:'tools'});
for (const t of _hatchets) GAME_DATA.shop.push({item:t.id, price:t.cost, category:'tools'});
for (const t of _fishingRods) GAME_DATA.shop.push({item:t.id, price:t.cost, category:'tools'});

// ── ARROW TYPES ──────────────────────────────────────────
const _arrows = [
  {id:'bronze_arrows',  name:'Bronze Arrows',   level:1,  rng:2,  cost:5,    rarity:'common',   bars:'bronze_bar', desc:'+2 Ranged bonus per arrow.'},
  {id:'iron_arrows',    name:'Iron Arrows',     level:10, rng:5,  cost:15,   rarity:'common',   bars:'iron_bar',   desc:'+5 Ranged bonus per arrow.'},
  {id:'steel_arrows',   name:'Steel Arrows',    level:20, rng:8,  cost:40,   rarity:'uncommon', bars:'steel_bar',  desc:'+8 Ranged bonus per arrow.'},
  {id:'mithril_arrows', name:'Mithril Arrows',  level:30, rng:12, cost:100,  rarity:'uncommon', bars:'mithril_bar',desc:'+12 Ranged bonus per arrow.'},
  {id:'adamant_arrows', name:'Adamant Arrows',  level:40, rng:18, cost:250,  rarity:'rare',     bars:'adamant_bar',desc:'+18 Ranged bonus per arrow.'},
  {id:'runite_arrows',  name:'Runite Arrows',   level:50, rng:24, cost:600,  rarity:'rare',     bars:'runite_bar', desc:'+24 Ranged bonus per arrow.'},
  {id:'dragon_arrows',  name:'Dragon Arrows',   level:60, rng:32, cost:1500, rarity:'epic',     bars:'obsidian_bar',desc:'+32 Ranged bonus per arrow.'},
  {id:'ashsteel_arrows',name:'Ashsteel Arrows', level:75, rng:40, cost:3000, rarity:'legendary',bars:'ashsteel_bar',desc:'+40 Ranged bonus per arrow.'},
];

for (const a of _arrows) {
  if (!GAME_DATA.items[a.id]) {
    GAME_DATA.items[a.id] = {
      id:a.id, name:a.name, type:'ammo', subtype:'arrow', slot:'ammo',
      rangedBonus:a.rng, levelReq:{ranged:a.level},
      sellPrice:Math.floor(a.cost*0.3), sprite:'ammo-arrow',
      rarity:a.rarity, desc:a.desc,
    };
  }
}

// Arrow fletching recipes (15 arrows per craft)
for (const a of _arrows) {
  if (!GAME_DATA.recipes.fletching.find(r=>r.output?.item===a.id)) {
    GAME_DATA.recipes.fletching.push({
      id:'fletch_'+a.id, name:a.name+' (15)', level:a.level,
      xp:a.rng*3, time:4.0,
      input:[{item:a.bars,qty:1},{item:'feather',qty:15}],
      output:{item:a.id,qty:15},
    });
  }
}

// Add arrows to shop
for (const a of _arrows) {
  if (!GAME_DATA.shop.find(s=>s.item===a.id)) {
    GAME_DATA.shop.push({item:a.id, price:a.cost, category:'ammunition'});
  }
}

// ── QUIVER SYSTEM ────────────────────────────────────────
// Quiver holds arrows. Player equips arrows in 'ammo' slot.
// Engine already supports ammo slot and getAmmoBonus().
// Just need to make sure arrows are properly equippable.

// ── TOOL SPEED SYSTEM ────────────────────────────────────
// getToolSpeedBonus(skillId) - returns percentage time reduction
// from equipped weapon if it has toolSpeed for that skill.
// This is called in the engine's tickSkill.

// ── FRIEND SYSTEM DATA ───────────────────────────────────
// Friends list stored in Firestore per-user
// /friends/{userId}/list -> array of friend UIDs
// /friend_requests/{userId}/pending -> incoming requests
// /messages/{conversationId}/messages -> private messages

console.log('[Ashfall] Items Expansion loaded');
console.log('  Pickaxes:', _pickaxes.length);
console.log('  Hatchets:', _hatchets.length);
console.log('  Fishing Rods:', _fishingRods.length);
console.log('  Arrow types:', _arrows.length);
console.log('  Total items:', Object.keys(GAME_DATA.items).length);
console.log('  Total recipes:', Object.values(GAME_DATA.recipes).reduce((a,r)=>a+r.length,0));

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

// ================================================================
// ASHFALL IDLE - Mega Expansion v8.5
// 200+ new items, complete weapon/armor tiers, 15+ monsters
// ================================================================

const TIERS = [
  {t:'bronze',  n:'Bronze',  lv:1,  sm:1,  bar:'bronze_bar',  r:'common',   bc:2, atk:4,  str:3,  def:3},
  {t:'iron',    n:'Iron',    lv:10, sm:10, bar:'iron_bar',    r:'common',   bc:3, atk:8,  str:7,  def:6},
  {t:'steel',   n:'Steel',   lv:20, sm:20, bar:'steel_bar',   r:'uncommon', bc:3, atk:14, str:12, def:10},
  {t:'mithril', n:'Mithril', lv:30, sm:30, bar:'mithril_bar', r:'uncommon', bc:4, atk:20, str:18, def:15},
  {t:'adamant', n:'Adamant', lv:40, sm:40, bar:'adamant_bar', r:'rare',     bc:4, atk:28, str:26, def:22},
  {t:'runite',  n:'Runite',  lv:50, sm:55, bar:'runite_bar',  r:'rare',     bc:5, atk:38, str:36, def:30},
  {t:'obsidian',n:'Obsidian',lv:60, sm:65, bar:'obsidian_bar',r:'epic',     bc:5, atk:50, str:48, def:38},
  {t:'ashsteel',n:'Ashsteel',lv:75, sm:80, bar:'ashsteel_bar',r:'legendary',bc:6, atk:64, str:62, def:48},
];

// ── GENERATE WEAPON TYPES PER TIER ───────────────────────
const WEAPON_TYPES = [
  {s:'dagger',     n:'Dagger',     atkM:0.55, strM:0.45, spd:1.2, bars:2},
  {s:'mace',       n:'Mace',       atkM:0.60, strM:0.70, spd:2.4, bars:3},
  {s:'longsword',  n:'Longsword',  atkM:0.85, strM:0.80, spd:2.2, bars:3},
  {s:'battleaxe',  n:'Battleaxe',  atkM:0.70, strM:1.10, spd:3.0, bars:4},
  {s:'warhammer',  n:'Warhammer',  atkM:0.65, strM:1.20, spd:3.2, bars:5},
  {s:'2h_sword',   n:'Two-Hand Sword', atkM:0.90, strM:1.00, spd:3.4, bars:5},
  {s:'spear',      n:'Spear',      atkM:0.75, strM:0.65, spd:2.0, bars:3},
  {s:'claws',      n:'Claws',      atkM:0.80, strM:0.50, spd:1.4, bars:3},
];

let _newItems = 0, _newRecipes = 0;

for (const tier of TIERS) {
  for (const wt of WEAPON_TYPES) {
    const id = `${tier.t}_${wt.s}`;
    if (GAME_DATA.items[id]) continue;
    const atk = Math.floor(tier.atk * wt.atkM);
    const str = Math.floor(tier.str * wt.strM);
    GAME_DATA.items[id] = {
      id, name:`${tier.n} ${wt.n}`, type:'weapon', slot:'weapon',
      stats:{attackBonus:atk, strengthBonus:str}, attackSpeed:wt.spd, style:'melee',
      levelReq:{attack:tier.lv}, sellPrice:wt.bars*40*(tier.lv+1),
      rarity:tier.r, desc:`${tier.n} ${wt.n.toLowerCase()}. +${atk} Attack, +${str} Strength.`,
    };
    _newItems++;
    if (!GAME_DATA.recipes.smithing.find(r=>r.id==='smith_'+id)) {
      GAME_DATA.recipes.smithing.push({
        id:'smith_'+id, name:`${tier.n} ${wt.n}`, level:tier.sm,
        xp:wt.bars*12, time:6.0,
        input:[{item:tier.bar,qty:wt.bars}], output:{item:id,qty:1},
        category: wt.s === 'dagger' ? 'Daggers' : wt.s === 'mace' ? 'Maces' : wt.s === 'longsword' ? 'Longswords' : wt.s === 'battleaxe' ? 'Battleaxes' : wt.s === 'warhammer' ? 'Warhammers' : wt.s === '2h_sword' ? '2H Swords' : wt.s === 'spear' ? 'Spears' : wt.s === 'claws' ? 'Claws' : 'Weapons',
      });
      _newRecipes++;
    }
  }
}

// ── RINGS WITH COMBAT STATS ──────────────────────────────
const _combatRings = [
  {id:'warriors_ring',    name:'Warrior\'s Ring',    lv:20, slot:'ring', stats:{strengthBonus:8,attackBonus:4}, r:'uncommon', desc:'+8 Strength, +4 Attack.', price:5000},
  {id:'archers_ring',     name:'Archer\'s Ring',     lv:20, slot:'ring', stats:{rangedBonus:10}, r:'uncommon', desc:'+10 Ranged bonus.', price:5000},
  {id:'seers_ring',       name:'Seer\'s Ring',       lv:20, slot:'ring', stats:{magicBonus:10}, r:'uncommon', desc:'+10 Magic bonus.', price:5000},
  {id:'berserker_ring',   name:'Berserker Ring',     lv:40, slot:'ring', stats:{strengthBonus:16,attackBonus:8}, r:'rare', desc:'+16 Strength, +8 Attack.', price:25000},
  {id:'treasonous_ring',  name:'Treasonous Ring',    lv:50, slot:'ring', stats:{attackBonus:20,strengthBonus:12}, r:'rare', desc:'+20 Attack, +12 Strength.', price:50000},
  {id:'ring_of_wealth',   name:'Ring of Wealth',     lv:30, slot:'ring', stats:{}, r:'rare', desc:'Increases rare drop chance by 5%.', price:20000},
  {id:'ring_of_the_gods', name:'Ring of the Gods',   lv:70, slot:'ring', stats:{defenceBonus:12,magicBonus:8}, r:'epic', desc:'+12 Defence, +8 Magic. Prayer drain -10%.', price:100000},
  {id:'ring_of_suffering',name:'Ring of Suffering',   lv:75, slot:'ring', stats:{defenceBonus:20}, r:'epic', desc:'+20 Defence. Absorbs recoil damage.', price:150000},
];
for (const r of _combatRings) {
  if (!GAME_DATA.items[r.id]) {
    GAME_DATA.items[r.id] = {id:r.id,name:r.name,type:'armor',slot:r.slot,stats:r.stats,levelReq:{defence:r.lv},sellPrice:Math.floor(r.price*0.3),rarity:r.r,desc:r.desc};
    _newItems++;
    GAME_DATA.shop.push({item:r.id,price:r.price,category:'jewelry'});
  }
}

// ── AMULETS WITH COMBAT STATS ────────────────────────────
const _combatAmulets = [
  {id:'amulet_of_strength',name:'Amulet of Strength', lv:20, stats:{strengthBonus:12}, r:'uncommon', price:8000},
  {id:'amulet_of_power',  name:'Amulet of Power',    lv:30, stats:{attackBonus:8,strengthBonus:8,defenceBonus:8}, r:'uncommon', price:15000},
  {id:'amulet_of_glory',  name:'Amulet of Glory',    lv:40, stats:{attackBonus:12,strengthBonus:12,defenceBonus:6,rangedBonus:6,magicBonus:6}, r:'rare', price:30000},
  {id:'amulet_of_fury',   name:'Amulet of Fury',     lv:60, stats:{attackBonus:18,strengthBonus:16,defenceBonus:12,rangedBonus:10,magicBonus:10}, r:'epic', price:80000},
  {id:'amulet_of_torture',name:'Amulet of Torture',   lv:75, stats:{attackBonus:25,strengthBonus:22}, r:'legendary', price:200000},
  {id:'necklace_of_anguish',name:'Necklace of Anguish',lv:75,stats:{rangedBonus:25}, r:'legendary', price:200000},
  {id:'occult_necklace',  name:'Occult Necklace',     lv:70, stats:{magicBonus:22}, r:'epic', price:150000},
  {id:'zenyte_amulet',    name:'Zenyte Amulet',       lv:80, stats:{attackBonus:20,strengthBonus:20,defenceBonus:15,rangedBonus:15,magicBonus:15}, r:'mythic', price:500000},
];
for (const a of _combatAmulets) {
  if (!GAME_DATA.items[a.id]) {
    GAME_DATA.items[a.id] = {id:a.id,name:a.name,type:'armor',slot:'amulet',stats:a.stats,levelReq:{defence:a.lv},sellPrice:Math.floor(a.price*0.3),rarity:a.r,desc:Object.entries(a.stats).map(([k,v])=>'+'+v+' '+k.replace('Bonus','')).join(', ')+'.'};
    _newItems++;
    GAME_DATA.shop.push({item:a.id,price:a.price,category:'jewelry'});
  }
}

// ── CAPES WITH STATS ─────────────────────────────────────
const _capes = [
  {id:'ember_cape',     name:'Ember Cape',      lv:60, stats:{strengthBonus:10,defenceBonus:12}, r:'epic', desc:'Forged in fire. +10 Str, +12 Def.', price:100000},
  {id:'infernal_cape', name:'Infernal Cape',   lv:80, stats:{strengthBonus:18,defenceBonus:16,attackBonus:8}, r:'legendary', desc:'Infernal power. +18 Str, +16 Def, +8 Atk.', price:300000},
  {id:'avas_accumulator',name:'Ava\'s Accumulator',lv:40,stats:{rangedBonus:12}, r:'rare', desc:'+12 Ranged. Recovers ammo.', price:30000},
  {id:'avas_assembler', name:'Ava\'s Assembler', lv:70, stats:{rangedBonus:20,defenceBonus:4}, r:'epic', desc:'+20 Ranged, +4 Def. Better ammo recovery.', price:100000},
  {id:'god_cape',       name:'God Cape',        lv:60, stats:{magicBonus:16}, r:'epic', desc:'+16 Magic bonus.', price:80000},
  {id:'max_cape',       name:'Max Cape',        lv:99, stats:{attackBonus:10,strengthBonus:10,defenceBonus:10,rangedBonus:10,magicBonus:10}, r:'mythic', desc:'Requires 99 in all skills. +10 all stats.', price:999999},
];
for (const c of _capes) {
  if (!GAME_DATA.items[c.id]) {
    GAME_DATA.items[c.id] = {id:c.id,name:c.name,type:'armor',slot:'cape',stats:c.stats,levelReq:{defence:c.lv},sellPrice:Math.floor(c.price*0.3),rarity:c.r,desc:c.desc};
    _newItems++;
    GAME_DATA.shop.push({item:c.id,price:c.price,category:'capes'});
  }
}

// ── MORE MONSTERS (15) WITH SVG ART ──────────────────────
const _moreMonsters = {
  imp:        {id:'imp', name:'Imp', hp:20, maxHit:3, attackSpeed:2.2, combatLevel:2, style:'magic', evasion:{melee:4,ranged:4,magic:8}, xp:18, gold:{min:1,max:5}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'mind_rune',qty:2,chance:0.30},{item:'egg',qty:1,chance:0.15}]},
  zombie:     {id:'zombie', name:'Zombie', hp:70, maxHit:8, attackSpeed:3.0, combatLevel:8, style:'melee', evasion:{melee:6,ranged:6,magic:4}, xp:55, gold:{min:3,max:10}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'iron_bar',qty:1,chance:0.10},{item:'raw_beef',qty:1,chance:0.20}]},
  giant_bat:  {id:'giant_bat', name:'Giant Bat', hp:50, maxHit:6, attackSpeed:2.0, combatLevel:6, style:'melee', evasion:{melee:12,ranged:8,magic:10}, xp:42, gold:{min:2,max:8}, alignment:'CN',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'feather',qty:3,chance:0.40}]},
  hill_giant: {id:'hill_giant', name:'Hill Giant', hp:150, maxHit:15, attackSpeed:2.8, combatLevel:22, style:'melee', evasion:{melee:22,ranged:18,magic:14}, xp:110, gold:{min:15,max:45}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'iron_bar',qty:2,chance:0.12},{item:'steel_bar',qty:1,chance:0.08},{item:'cowhide',qty:2,chance:0.30}]},
  earth_warrior:{id:'earth_warrior', name:'Earth Warrior', hp:180, maxHit:16, attackSpeed:2.4, combatLevel:26, style:'melee', evasion:{melee:28,ranged:24,magic:18}, xp:130, gold:{min:20,max:55}, alignment:'NE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'earth_rune',qty:5,chance:0.25},{item:'mithril_bar',qty:1,chance:0.06}]},
  chaos_dwarf:{id:'chaos_dwarf', name:'Chaos Dwarf', hp:160, maxHit:18, attackSpeed:2.0, combatLevel:32, style:'ranged', evasion:{melee:30,ranged:35,magic:20}, xp:145, gold:{min:25,max:70}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'chaos_rune',qty:5,chance:0.20},{item:'steel_bar',qty:2,chance:0.10},{item:'adamant_arrows',qty:5,chance:0.12}]},
  bloodveld:  {id:'bloodveld', name:'Bloodveld', hp:280, maxHit:22, attackSpeed:2.4, combatLevel:38, style:'magic', evasion:{melee:35,ranged:32,magic:40}, xp:200, gold:{min:35,max:100}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'blood_rune',qty:3,chance:0.15},{item:'death_rune',qty:2,chance:0.12},{item:'raw_beef',qty:3,chance:0.25}]},
  gargoyle:   {id:'gargoyle', name:'Gargoyle', hp:350, maxHit:26, attackSpeed:2.6, combatLevel:48, style:'melee', evasion:{melee:55,ranged:48,magic:35}, xp:280, gold:{min:50,max:160}, alignment:'NE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'runite_bar',qty:1,chance:0.05},{item:'gold_ore',qty:3,chance:0.15},{item:'diamond',qty:1,chance:0.04}]},
  nechryael:  {id:'nechryael', name:'Nechryael', hp:400, maxHit:28, attackSpeed:2.2, combatLevel:52, style:'magic', evasion:{melee:50,ranged:48,magic:55}, xp:350, gold:{min:60,max:200}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'death_rune',qty:5,chance:0.18},{item:'soul_rune',qty:2,chance:0.10},{item:'ruby',qty:1,chance:0.08}]},
  abyssal_demon:{id:'abyssal_demon', name:'Abyssal Demon', hp:450, maxHit:32, attackSpeed:2.0, combatLevel:62, style:'melee', evasion:{melee:60,ranged:55,magic:45}, xp:420, gold:{min:80,max:250}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'abyssal_whip',qty:1,chance:0.005},{item:'death_rune',qty:8,chance:0.20},{item:'blood_rune',qty:4,chance:0.15},{item:'obsidian_bar',qty:1,chance:0.04}]},
  dark_beast: {id:'dark_beast', name:'Dark Beast', hp:550, maxHit:36, attackSpeed:2.4, combatLevel:72, style:'melee', evasion:{melee:72,ranged:68,magic:55}, xp:550, gold:{min:100,max:350}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'dark_bow',qty:1,chance:0.008},{item:'death_rune',qty:10,chance:0.25},{item:'ashsteel_bar',qty:1,chance:0.02}]},
  cerberus:   {id:'cerberus', name:'Cerberus', hp:700, maxHit:40, attackSpeed:2.2, combatLevel:80, style:'melee', evasion:{melee:80,ranged:75,magic:60}, xp:700, gold:{min:150,max:500}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'fire_rune',qty:20,chance:0.30},{item:'obsidian_bar',qty:2,chance:0.08},{item:'ashsteel_bar',qty:1,chance:0.05}]},
  kraken:     {id:'kraken', name:'Kraken', hp:600, maxHit:35, attackSpeed:2.6, combatLevel:75, style:'magic', evasion:{melee:65,ranged:60,magic:80}, xp:650, gold:{min:120,max:400}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'water_rune',qty:20,chance:0.30},{item:'wrath_rune',qty:3,chance:0.08},{item:'diamond',qty:2,chance:0.06}]},
  hydra:      {id:'hydra', name:'Alchemical Hydra', hp:900, maxHit:45, attackSpeed:2.4, combatLevel:90, style:'melee', evasion:{melee:90,ranged:85,magic:70}, xp:900, gold:{min:200,max:600}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'ashsteel_bar',qty:3,chance:0.10},{item:'wrath_rune',qty:5,chance:0.12},{item:'diamond',qty:3,chance:0.08}]},
  corporeal_beast:{id:'corporeal_beast', name:'Corporeal Beast', hp:1200, maxHit:50, attackSpeed:2.8, combatLevel:100, style:'magic', evasion:{melee:100,ranged:95,magic:100}, xp:1200, gold:{min:300,max:800}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'ashsteel_bar',qty:5,chance:0.15},{item:'soul_rune',qty:10,chance:0.20},{item:'wrath_rune',qty:8,chance:0.15}]},
};

for (const [id, m] of Object.entries(_moreMonsters)) {
  if (!GAME_DATA.monsters[id]) { GAME_DATA.monsters[id] = m; }
}

// Add to combat areas
const _newAreas = [
  {id:'graveyard', name:'Haunted Graveyard', monsters:['imp','zombie','giant_bat'], levelReq:3, desc:'A fog-covered graveyard.'},
  {id:'giant_plateau', name:'Giant Plateau', monsters:['hill_giant','earth_warrior'], levelReq:18, desc:'Where giants roam.'},
  {id:'chaos_tunnels', name:'Chaos Tunnels', monsters:['chaos_dwarf','bloodveld'], levelReq:28, desc:'Twisted underground passages.'},
  {id:'gargoyle_tower', name:'Gargoyle Tower', monsters:['gargoyle','nechryael'], levelReq:42, desc:'A tower of stone guardians.'},
  {id:'abyssal_rift', name:'Abyssal Rift', monsters:['abyssal_demon','dark_beast'], levelReq:58, desc:'A portal to the abyss.'},
  {id:'infernal_pit', name:'Infernal Pit', monsters:['cerberus','hydra'], levelReq:75, desc:'The deepest depths of fire.'},
  {id:'spirit_realm', name:'Spirit Realm', monsters:['kraken','corporeal_beast'], levelReq:70, desc:'Where spectral horrors dwell.'},
];
for (const a of _newAreas) {
  if (!GAME_DATA.combatAreas.find(x=>x.id===a.id)) GAME_DATA.combatAreas.push(a);
}

// ── SVG ART FOR ALL NEW MONSTERS ─────────────────────────
const _arts = {
imp:`<svg viewBox="0 0 64 64"><circle cx="32" cy="28" r="10" fill="#c44040"/><circle cx="28" cy="26" r="2" fill="#ff0"/><circle cx="36" cy="26" r="2" fill="#ff0"/><path d="M22 20 L18 10 L24 18" fill="#c44040"/><path d="M42 20 L46 10 L40 18" fill="#c44040"/><ellipse cx="32" cy="42" rx="8" ry="6" fill="#a03030"/><rect x="26" y="46" width="3" height="8" rx="1" fill="#a03030"/><rect x="35" y="46" width="3" height="8" rx="1" fill="#a03030"/><path d="M14 30 Q8 26 10 34 Q12 30 16 32" fill="#a03030"/><path d="M50 30 Q56 26 54 34 Q52 30 48 32" fill="#a03030"/><path d="M40 42 Q44 48 40 56 Q38 50 42 46" fill="#a03030"/></svg>`,
zombie:`<svg viewBox="0 0 64 64"><rect x="24" y="26" width="16" height="22" rx="2" fill="#5a6a4a"/><circle cx="32" cy="20" r="9" fill="#7a8a5a"/><circle cx="28" cy="18" r="2" fill="#333"/><circle cx="36" cy="18" r="2" fill="#333"/><path d="M27 24 Q32 26 37 24" stroke="#333" stroke-width="1.5" fill="none"/><rect x="18" y="28" width="6" height="16" rx="2" fill="#5a6a4a"/><rect x="40" y="28" width="6" height="16" rx="2" fill="#5a6a4a"/><rect x="44" y="28" width="5" height="3" rx="1" fill="#7a8a5a"/><rect x="15" y="28" width="5" height="3" rx="1" fill="#7a8a5a"/><rect x="26" y="48" width="4" height="8" rx="1" fill="#4a5a3a"/><rect x="34" y="48" width="4" height="8" rx="1" fill="#4a5a3a"/><path d="M28 30 L34 32 L30 34" stroke="#3a4a2a" stroke-width="1" fill="none"/></svg>`,
giant_bat:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="34" rx="8" ry="6" fill="#3a2a2a"/><circle cx="32" cy="28" r="6" fill="#4a3a3a"/><circle cx="29" cy="27" r="1.5" fill="#c44040"/><circle cx="35" cy="27" r="1.5" fill="#c44040"/><path d="M28 32 L30 33 L28 31" fill="#fff"/><path d="M36 32 L34 33 L36 31" fill="#fff"/><path d="M24 30 Q12 20 4 28 Q10 26 16 30 Q12 32 8 38 Q14 34 20 34" fill="#3a2a2a"/><path d="M40 30 Q52 20 60 28 Q54 26 48 30 Q52 32 56 38 Q50 34 44 34" fill="#3a2a2a"/></svg>`,
hill_giant:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="38" rx="20" ry="16" fill="#8a7a5a"/><circle cx="32" cy="18" r="13" fill="#9a8a6a"/><circle cx="26" cy="16" r="3" fill="#222"/><circle cx="38" cy="16" r="3" fill="#222"/><path d="M26 24 Q32 28 38 24" stroke="#5a4a3a" stroke-width="2" fill="none"/><rect x="12" y="24" width="12" height="24" rx="5" fill="#8a7a5a"/><rect x="40" y="24" width="12" height="24" rx="5" fill="#8a7a5a"/><rect x="8" y="24" width="6" height="28" fill="#6a5a3a"/><polygon points="6,22 14,22 10,12" fill="#7a6a4a"/><rect x="22" y="50" width="8" height="10" rx="3" fill="#7a6a4a"/><rect x="34" y="50" width="8" height="10" rx="3" fill="#7a6a4a"/></svg>`,
earth_warrior:`<svg viewBox="0 0 64 64"><rect x="24" y="26" width="16" height="22" rx="2" fill="#6a5a3a"/><circle cx="32" cy="20" r="9" fill="#7a6a4a"/><rect x="24" y="14" width="16" height="5" rx="1" fill="#5a4a2a"/><circle cx="29" cy="19" r="2" fill="#8a6a00"/><circle cx="35" cy="19" r="2" fill="#8a6a00"/><rect x="16" y="28" width="8" height="16" rx="3" fill="#6a5a3a"/><rect x="40" y="28" width="8" height="16" rx="3" fill="#6a5a3a"/><rect x="26" y="48" width="5" height="8" rx="1" fill="#5a4a2a"/><rect x="33" y="48" width="5" height="8" rx="1" fill="#5a4a2a"/><circle cx="20" cy="36" r="3" fill="#8a7a4a" opacity="0.4"/><circle cx="44" cy="32" r="2" fill="#8a7a4a" opacity="0.4"/></svg>`,
chaos_dwarf:`<svg viewBox="0 0 64 64"><rect x="26" y="32" width="12" height="16" rx="2" fill="#4a2a2a"/><circle cx="32" cy="28" r="8" fill="#5a3a2a"/><rect x="24" y="22" width="16" height="4" rx="1" fill="#6a3a1a"/><circle cx="29" cy="27" r="1.5" fill="#ff4040"/><circle cx="35" cy="27" r="1.5" fill="#ff4040"/><rect x="20" y="34" width="6" height="12" rx="2" fill="#4a2a2a"/><rect x="38" y="34" width="6" height="12" rx="2" fill="#4a2a2a"/><rect x="40" y="30" width="3" height="18" fill="#666"/><polygon points="39,28 46,28 43,22" fill="#888"/><rect x="28" y="48" width="4" height="6" rx="1" fill="#3a1a1a"/><rect x="32" y="48" width="4" height="6" rx="1" fill="#3a1a1a"/></svg>`,
bloodveld:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="36" rx="16" ry="14" fill="#8a2030"/><circle cx="32" cy="24" r="10" fill="#a03040"/><circle cx="28" cy="22" r="2.5" fill="#ff6070"/><circle cx="36" cy="22" r="2.5" fill="#ff6070"/><path d="M26 28 Q32 34 38 28" stroke="#5a1020" stroke-width="2" fill="none"/><path d="M16 30 Q8 26 6 34 Q10 30 14 34" fill="#8a2030"/><path d="M48 30 Q56 26 58 34 Q54 30 50 34" fill="#8a2030"/><ellipse cx="24" cy="44" rx="4" ry="2" fill="#6a1020"/><ellipse cx="40" cy="44" rx="4" ry="2" fill="#6a1020"/></svg>`,
gargoyle:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="38" rx="16" ry="14" fill="#708090"/><circle cx="32" cy="22" r="11" fill="#7a8a9a"/><circle cx="27" cy="20" r="2.5" fill="#ff8000"/><circle cx="37" cy="20" r="2.5" fill="#ff8000"/><path d="M20 14 L14 6 L18 14" fill="#7a8a9a"/><path d="M44 14 L50 6 L46 14" fill="#7a8a9a"/><path d="M26 28 Q32 32 38 28" stroke="#505a60" stroke-width="2" fill="none"/><path d="M14 28 Q6 22 4 30 Q8 26 12 30 Q8 34 6 40 Q10 36 14 36" fill="#607080"/><path d="M50 28 Q58 22 60 30 Q56 26 52 30 Q56 34 58 40 Q54 36 50 36" fill="#607080"/><rect x="24" y="50" width="6" height="8" rx="2" fill="#607080"/><rect x="34" y="50" width="6" height="8" rx="2" fill="#607080"/></svg>`,
nechryael:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="38" rx="14" ry="12" fill="#4a2a5a"/><circle cx="32" cy="24" r="10" fill="#5a3a6a"/><circle cx="28" cy="22" r="2.5" fill="#ff40ff"/><circle cx="36" cy="22" r="2.5" fill="#ff40ff"/><path d="M20 16 Q16 8 20 14" stroke="#5a3a6a" stroke-width="3" fill="none"/><path d="M44 16 Q48 8 44 14" stroke="#5a3a6a" stroke-width="3" fill="none"/><path d="M14 32 Q6 28 8 38 Q10 34 14 36" fill="#3a1a4a"/><path d="M50 32 Q58 28 56 38 Q54 34 50 36" fill="#3a1a4a"/><circle cx="20" cy="40" r="4" fill="#3a1a4a"/><circle cx="44" cy="40" r="4" fill="#3a1a4a"/><circle cx="20" cy="40" r="1.5" fill="#ff40ff"/><circle cx="44" cy="40" r="1.5" fill="#ff40ff"/></svg>`,
abyssal_demon:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="36" rx="16" ry="14" fill="#2a1a2a"/><circle cx="32" cy="22" r="11" fill="#3a2a3a"/><circle cx="27" cy="20" r="3" fill="#c040c0"/><circle cx="37" cy="20" r="3" fill="#c040c0"/><circle cx="27" cy="20" r="1.5" fill="#fff"/><circle cx="37" cy="20" r="1.5" fill="#fff"/><path d="M18 14 L12 4 L16 12" fill="#3a2a3a"/><path d="M46 14 L52 4 L48 12" fill="#3a2a3a"/><path d="M12 30 Q4 24 2 34 Q6 28 10 32 Q6 36 4 42 Q8 38 12 38" fill="#2a1a2a"/><path d="M52 30 Q60 24 62 34 Q58 28 54 32 Q58 36 60 42 Q56 38 52 38" fill="#2a1a2a"/><path d="M38 48 Q44 52 40 58 Q38 54 42 50" fill="#2a1a2a"/><rect x="24" y="48" width="5" height="8" rx="2" fill="#1a0a1a"/><rect x="35" y="48" width="5" height="8" rx="2" fill="#1a0a1a"/></svg>`,
dark_beast:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="38" rx="18" ry="14" fill="#1a1a2a"/><circle cx="28" cy="24" r="10" fill="#2a2a3a"/><circle cx="24" cy="22" r="3" fill="#4040ff"/><circle cx="32" cy="22" r="3" fill="#4040ff"/><circle cx="24" cy="22" r="1" fill="#fff"/><circle cx="32" cy="22" r="1" fill="#fff"/><path d="M18 16 L10 6 L16 14" fill="#2a2a3a"/><path d="M38 16 L46 6 L40 14" fill="#2a2a3a"/><path d="M46 34 Q54 38 50 48 Q48 42 44 38" fill="#1a1a2a"/><rect x="20" y="48" width="6" height="10" rx="2" fill="#0a0a1a"/><rect x="30" y="48" width="6" height="10" rx="2" fill="#0a0a1a"/><rect x="40" y="48" width="6" height="10" rx="2" fill="#0a0a1a"/></svg>`,
cerberus:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="40" rx="18" ry="12" fill="#3a1a0a"/><circle cx="20" cy="24" r="8" fill="#4a2a10"/><circle cx="32" cy="20" r="9" fill="#4a2a10"/><circle cx="44" cy="24" r="8" fill="#4a2a10"/><circle cx="18" cy="22" r="2" fill="#ff4000"/><circle cx="22" cy="22" r="2" fill="#ff4000"/><circle cx="30" cy="18" r="2" fill="#ff4000"/><circle cx="34" cy="18" r="2" fill="#ff4000"/><circle cx="42" cy="22" r="2" fill="#ff4000"/><circle cx="46" cy="22" r="2" fill="#ff4000"/><path d="M16 28 Q20 32 24 28" stroke="#2a0a00" stroke-width="1.5" fill="none"/><path d="M28 24 Q32 28 36 24" stroke="#2a0a00" stroke-width="1.5" fill="none"/><path d="M40 28 Q44 32 48 28" stroke="#2a0a00" stroke-width="1.5" fill="none"/><rect x="20" y="48" width="5" height="8" rx="2" fill="#3a1a0a"/><rect x="28" y="48" width="5" height="8" rx="2" fill="#3a1a0a"/><rect x="36" y="48" width="5" height="8" rx="2" fill="#3a1a0a"/></svg>`,
kraken:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="32" rx="16" ry="14" fill="#2a4a6a"/><circle cx="28" cy="28" r="4" fill="#80c0e0"/><circle cx="36" cy="28" r="4" fill="#80c0e0"/><circle cx="28" cy="28" r="2" fill="#1a2a3a"/><circle cx="36" cy="28" r="2" fill="#1a2a3a"/><path d="M10 40 Q6 48 10 56 Q8 50 12 46 Q8 52 12 58" stroke="#2a4a6a" stroke-width="3" fill="none"/><path d="M18 44 Q14 52 18 58" stroke="#2a4a6a" stroke-width="3" fill="none"/><path d="M54 40 Q58 48 54 56 Q56 50 52 46 Q56 52 52 58" stroke="#2a4a6a" stroke-width="3" fill="none"/><path d="M46 44 Q50 52 46 58" stroke="#2a4a6a" stroke-width="3" fill="none"/><path d="M28 44 Q24 52 28 58" stroke="#2a4a6a" stroke-width="2" fill="none"/><path d="M36 44 Q40 52 36 58" stroke="#2a4a6a" stroke-width="2" fill="none"/></svg>`,
hydra:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="42" rx="16" ry="12" fill="#2a5a3a"/><circle cx="20" cy="22" r="7" fill="#3a6a4a"/><circle cx="32" cy="18" r="8" fill="#3a6a4a"/><circle cx="44" cy="22" r="7" fill="#3a6a4a"/><circle cx="18" cy="20" r="2" fill="#ff0"/><circle cx="22" cy="20" r="2" fill="#ff0"/><circle cx="30" cy="16" r="2" fill="#ff0"/><circle cx="34" cy="16" r="2" fill="#ff0"/><circle cx="42" cy="20" r="2" fill="#ff0"/><circle cx="46" cy="20" r="2" fill="#ff0"/><path d="M16 26 Q20 30 24 26" stroke="#1a3a2a" stroke-width="1.5" fill="none"/><path d="M28 22 Q32 26 36 22" stroke="#1a3a2a" stroke-width="1.5" fill="none"/><path d="M40 26 Q44 30 48 26" stroke="#1a3a2a" stroke-width="1.5" fill="none"/><path d="M20 28 Q20 36 24 36" stroke="#2a5a3a" stroke-width="3" fill="none"/><path d="M44 28 Q44 36 40 36" stroke="#2a5a3a" stroke-width="3" fill="none"/><rect x="24" y="50" width="5" height="8" rx="2" fill="#1a4a2a"/><rect x="35" y="50" width="5" height="8" rx="2" fill="#1a4a2a"/></svg>`,
corporeal_beast:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="36" rx="20" ry="16" fill="#1a3a1a"/><circle cx="32" cy="20" r="12" fill="#2a4a2a"/><circle cx="26" cy="18" r="3.5" fill="#40ff40"/><circle cx="38" cy="18" r="3.5" fill="#40ff40"/><circle cx="26" cy="18" r="1.5" fill="#0a1a0a"/><circle cx="38" cy="18" r="1.5" fill="#0a1a0a"/><path d="M26 26 Q32 32 38 26" stroke="#0a2a0a" stroke-width="3" fill="none"/><path d="M10 28 Q4 22 2 32 Q6 26 10 30 Q6 34 4 42 Q8 38 12 38" fill="#1a3a1a"/><path d="M54 28 Q60 22 62 32 Q58 26 54 30 Q58 34 60 42 Q56 38 52 38" fill="#1a3a1a"/><circle cx="16" cy="42" r="3" fill="#2a4a2a" opacity="0.6"/><circle cx="48" cy="42" r="3" fill="#2a4a2a" opacity="0.6"/><rect x="22" y="50" width="7" height="10" rx="3" fill="#0a2a0a"/><rect x="35" y="50" width="7" height="10" rx="3" fill="#0a2a0a"/></svg>`,
};

for (const [id, svg] of Object.entries(_arts)) {
  if (!GAME_DATA.monsterArt[id]) GAME_DATA.monsterArt[id] = svg;
}

// ── ADD CHARMS TO DROP TABLES ────────────────────────────
if (!GAME_DATA.dropTables) GAME_DATA.dropTables = {};
GAME_DATA.dropTables.charms = [
  {item:'gold_charm',qty:1,weight:10},{item:'green_charm',qty:1,weight:7},
  {item:'crimson_charm',qty:1,weight:4},{item:'blue_charm',qty:1,weight:2},
  {item:'spirit_shards',qty:5,weight:8},
];
// All monsters Lv10+ roll charm table
(function addCharmDrops() {
  for (const [id,m] of Object.entries(GAME_DATA.monsters)) {
    if (!m.rollTables) m.rollTables = [];
    if (m.rollTables.find(r=>r.table==='charms')) continue;
    if ((m.combatLevel||0) >= 5) {
      const chance = Math.min(0.50, 0.15 + (m.combatLevel||0) * 0.003);
      m.rollTables.push({table:'charms', chance});
    }
  }
})();

// ── CATEGORIZE NEW SMITHING RECIPES ──────────────────────
(function categorizeNew() {
  for (const r of GAME_DATA.recipes.smithing) {
    if (r.category) continue;
    const id = r.id.toLowerCase();
    if (id.includes('dagger'))     r.category = 'Daggers';
    else if (id.includes('mace')) r.category = 'Maces';
    else if (id.includes('longsword')) r.category = 'Longswords';
    else if (id.includes('battleaxe')) r.category = 'Battleaxes';
    else if (id.includes('warhammer')) r.category = 'Warhammers';
    else if (id.includes('2h_sword')) r.category = '2H Swords';
    else if (id.includes('spear'))  r.category = 'Spears';
    else if (id.includes('claws')) r.category = 'Claws';
    else r.category = 'Other';
  }
})();

console.log('[Ashfall] Mega Expansion loaded');
console.log('  New items generated:', _newItems);
console.log('  New recipes generated:', _newRecipes);
console.log('  Total items:', Object.keys(GAME_DATA.items).length);
console.log('  Total monsters:', Object.keys(GAME_DATA.monsters).length);
console.log('  Total monster arts:', Object.keys(GAME_DATA.monsterArt).length);
console.log('  Total recipes:', Object.values(GAME_DATA.recipes).reduce((a,r)=>a+r.length,0));
console.log('  Total shop:', GAME_DATA.shop.length);
console.log('  Combat areas:', GAME_DATA.combatAreas.length);

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
    {id:'forage_mushroom', name:'Gather Mushrooms', level:5,  xp:18, time:4.0, loot:[{item:'mushroom',qty:1}]},
    {id:'forage_wheat',    name:'Harvest Wheat',    level:8,  xp:22, time:5.0, loot:[{item:'wheat',qty:2}]},
    {id:'forage_egg',      name:'Collect Eggs',     level:3,  xp:12, time:3.0, loot:[{item:'egg',qty:1}]},
    {id:'forage_corn',     name:'Pick Corn',        level:12, xp:25, time:5.0, loot:[{item:'corn',qty:1}]},
    {id:'forage_cabbage',  name:'Pick Cabbage',     level:6,  xp:15, time:3.5, loot:[{item:'cabbage',qty:1}]},
    {id:'forage_tomato',   name:'Pick Tomatoes',    level:10, xp:20, time:4.0, loot:[{item:'tomato',qty:1}]},
    {id:'forage_potato',   name:'Dig Potatoes',     level:1,  xp:10, time:3.0, loot:[{item:'potato',qty:1}]},
    {id:'forage_onion',    name:'Pull Onions',      level:2,  xp:11, time:3.0, loot:[{item:'onion',qty:1}]},
    {id:'forage_strawberry',name:'Pick Berries',    level:15, xp:28, time:4.5, loot:[{item:'strawberry',qty:1}]},
  );
}

// ── EXPANDED CHICKEN DROPS ───────────────────────────────
if (GAME_DATA.monsters.chicken) {
  const ch = GAME_DATA.monsters.chicken;
  if (!ch.drops.find(d=>d.item==='raw_chicken')) ch.drops.push({item:'raw_chicken',qty:1,chance:0.80});
  if (!ch.drops.find(d=>d.item==='egg'))         ch.drops.push({item:'egg',qty:1,chance:0.40});
}

// ── EGGS FROM HUNTING ─────────────────────────────────────
if (GAME_DATA.gatheringActions.hunting) {
  const rabbit = GAME_DATA.gatheringActions.hunting.find(a=>a.id==='hunt_rabbit');
  if (rabbit && !rabbit.loot.find(d=>d.item==='egg')) {
    rabbit.loot.push({item:'egg',qty:1,chance:0.30}); // chance handled by completeAction
  }
}

// ── EGG COOKING RECIPES — ensure all exist ─────────────────
const _eggRecipes = [
  {id:'cook_fried_egg', name:'Fried Egg',      level:1,  xp:20,  time:2.0, input:[{item:'egg',qty:1}],                                           output:{item:'fried_egg',qty:1},    burnChance:0.15},
  {id:'cook_boiled_egg',name:'Boiled Egg',     level:3,  xp:22,  time:2.5, input:[{item:'egg',qty:1}],                                           output:{item:'boiled_egg',qty:1},   burnChance:0.05},
];
for (const r of _eggRecipes) {
  if (!GAME_DATA.recipes.cooking.find(x=>x.id===r.id)) GAME_DATA.recipes.cooking.push(r);
}

// ── EGG FOOD ITEMS ─────────────────────────────────────────
if (!GAME_DATA.items.fried_egg)  GAME_DATA.items.fried_egg  = {id:'fried_egg', name:'Fried Egg',  type:'food',heals:60, sellPrice:12,sprite:'food-basic',desc:'+60 HP. Simple fried egg.'};
if (!GAME_DATA.items.boiled_egg) GAME_DATA.items.boiled_egg = {id:'boiled_egg',name:'Boiled Egg', type:'food',heals:55, sellPrice:10,sprite:'food-basic',desc:'+55 HP. Lightly boiled.'};

// ── FARMING SEED: HEN PLOT (passive egg generation) ────────
// Egg seed (chicken coop) — plants a "hen" that lays eggs passively
if (!GAME_DATA.items.hen_seed) {
  GAME_DATA.items.hen_seed = {id:'hen_seed',name:'Hen (Coop)',type:'seed',seedType:'allotment',growTime:7200,yield:'egg',baseYield:8,levelReq:5,xp:18,sellPrice:30,sprite:'misc-seed',desc:'Plant a hen in a coop plot. Produces 8 eggs every 2 hours.'};
  if (!GAME_DATA.shop.find(x=>x.item==='hen_seed')) GAME_DATA.shop.push({item:'hen_seed',price:80,category:'seeds'});
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
