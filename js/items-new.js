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
  name:"Dharok's Greataxe", type:'weapon', slot:'weapon', style:'melee',
  attackSpeed:3.4, stats:{attackBonus:103, strengthBonus:138}, levelReq:{attack:70, strength:70},
  rarity:'legendary', sellPrice:60000,
  passiveEffect:{ type:'dharok', desc:"Deals more damage the lower your HP. At 1HP: triple max hit." },
  desc:"Dharok's Greataxe. Passive: the lower your HP, the higher your max hit."
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

console.log('[Ashfall] items-new.js loaded. New items added:', ['blade_of_saeldor','scythe_of_vitur','tumeken_shadow','dharoks_greataxe','prayer_potion','shark','anglerfish'].filter(id=>GAME_DATA.items[id]).length);
