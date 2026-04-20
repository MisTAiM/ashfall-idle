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
