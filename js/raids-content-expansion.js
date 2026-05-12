// ================================================================
// ASHFALL IDLE — Raids Content Expansion v10.0
// Complete drop tables for Chambers of Ash + Theatre upgrades
// New raid-exclusive items + improved potion system
// Blaze tier Firebase enables full multiplayer raid infrastructure
// ================================================================

// ── CHAMBERS OF ASH — COMPLETE DROP TABLES ────────────────────
// Every boss now has signature drops + shared raid loot
const COA_BOSS_DROPS = {
  shambling_mound: [
    // Unique to this boss
    {item:'verdant_staff',      qty:1, chance:0.15, rarity:'epic'},
    {item:'woven_gloves',       qty:1, chance:0.18, rarity:'rare'},
    {item:'shambling_seeds',    qty:3, chance:0.40, rarity:'uncommon'},
    // Shared raid materials
    {item:'runite_bar',         qty:6, chance:0.60, rarity:'common'},
    {item:'death_rune',         qty:80, chance:0.70, rarity:'common'},
    {item:'dragonite_bar',      qty:2, chance:0.35, rarity:'rare'},
    {item:'ragshard',           qty:2, chance:0.25, rarity:'uncommon'},
    {item:'ancient_essence',    qty:1, chance:0.12, rarity:'epic'},
  ],
  ash_vanguard: [
    // Unique drops
    {item:'vanguard_helm',      qty:1, chance:0.20, rarity:'epic'},
    {item:'vanguard_chestplate',qty:1, chance:0.15, rarity:'epic'},
    {item:'vanguard_legs',      qty:1, chance:0.15, rarity:'epic'},
    {item:'warrior_blood',      qty:2, chance:0.30, rarity:'uncommon'},
    // Shared materials
    {item:'blood_rune',         qty:100, chance:0.75, rarity:'common'},
    {item:'dragonite_bar',      qty:3, chance:0.50, rarity:'rare'},
    {item:'celestial_fragment', qty:1, chance:0.20, rarity:'epic'},
    {item:'ancient_essence',    qty:2, chance:0.15, rarity:'epic'},
  ],
  tekton_forgeborn: [
    // Unique drops — smithing/crafting focus
    {item:'forgemaster_hammer', qty:1, chance:0.12, rarity:'legendary'},
    {item:'mythril_bar',        qty:4, chance:0.40, rarity:'rare'},
    {item:'orichalcum_ore',     qty:8, chance:0.50, rarity:'uncommon'},
    {item:'forge_dust',         qty:5, chance:0.60, rarity:'common'},
    {item:'inferno_core',       qty:1, chance:0.08, rarity:'epic'},
    // Shared materials
    {item:'runite_bar',         qty:8, chance:0.65, rarity:'common'},
    {item:'dragonite_bar',      qty:4, chance:0.55, rarity:'rare'},
    {item:'ancient_essence',    qty:2, chance:0.18, rarity:'epic'},
  ],
  ice_weaver: [
    // Unique drops — magic/ranged focus
    {item:'shard_of_frostbind', qty:1, chance:0.18, rarity:'epic'},
    {item:'frozen_sceptre',     qty:1, chance:0.10, rarity:'legendary'},
    {item:'frosted_robes',      qty:1, chance:0.15, rarity:'epic'},
    {item:'crystalline_shard',  qty:4, chance:0.45, rarity:'uncommon'},
    {item:'eternal_snowflake',  qty:1, chance:0.08, rarity:'epic'},
    // Shared materials
    {item:'death_rune',         qty:120, chance:0.80, rarity:'common'},
    {item:'celestial_fragment', qty:2, chance:0.25, rarity:'epic'},
    {item:'ancient_essence',    qty:3, chance:0.22, rarity:'epic'},
  ],
  great_olm: [
    // Final boss — highest tier drops
    {item:'olm_eye',            qty:1, chance:1.0, rarity:'unique'},
    {item:'primordial_staff',   qty:1, chance:0.20, rarity:'legendary'},
    {item:'the_inquisitors_mace',qty:1, chance:0.15, rarity:'legendary'},
    {item:'ancestral_robe',     qty:1, chance:0.12, rarity:'legendary'},
    {item:'dragon_crossbow',    qty:1, chance:0.10, rarity:'legendary'},
    // Unique drops only from Olm
    {item:'olm_heart',          qty:1, chance:0.08, rarity:'unique'},
    {item:'twisted_bow',        qty:1, chance:0.05, rarity:'legendary'},
    // Guaranteed materials
    {item:'death_rune',         qty:200, chance:1.0, rarity:'common'},
    {item:'blood_rune',         qty:150, chance:1.0, rarity:'common'},
    {item:'dragonite_bar',      qty:6, chance:1.0, rarity:'rare'},
    {item:'celestial_fragment', qty:5, chance:1.0, rarity:'epic'},
    {item:'ancient_essence',    qty:4, chance:0.95, rarity:'epic'},
  ],
};

// Register Chambers bosses with drops
if (typeof COA_BOSSES !== 'undefined') {
  for (const [bossId, drops] of Object.entries(COA_BOSS_DROPS)) {
    if (COA_BOSSES[bossId]) {
      COA_BOSSES[bossId].drops = drops;
      if (GAME_DATA.monsters[bossId]) {
        GAME_DATA.monsters[bossId].drops = drops;
      }
    }
  }
}

// ── THEATRE OF ASH — ENHANCED DROPS ────────────────────────────
// Add unique boss drops to Theatre loot tables
if (GAME_DATA.theatreOfAsh && GAME_DATA.theatreOfAsh.lootTables) {
  // Enhanced Bronze tier (added items)
  GAME_DATA.theatreOfAsh.lootTables.bronze.push(
    {item:'elder_rune',         qty:5,   chance:0.15, rarity:'rare'},
    {item:'philosopher_stone',  qty:1,   chance:0.08, rarity:'epic'}
  );
  
  // Enhanced Silver tier
  GAME_DATA.theatreOfAsh.lootTables.silver.push(
    {item:'champion_scroll',    qty:1,   chance:0.12, rarity:'epic'},
    {item:'twisted_essence',    qty:2,   chance:0.25, rarity:'uncommon'},
    {item:'ancient_artifact',   qty:1,   chance:0.06, rarity:'legendary'}
  );
  
  // Enhanced Gold tier
  GAME_DATA.theatreOfAsh.lootTables.gold.push(
    {item:'hydra_tail',         qty:1,   chance:0.18, rarity:'epic'},
    {item:'primordial_shard',   qty:1,   chance:0.12, rarity:'epic'},
    {item:'mythic_token',       qty:1,   chance:0.08, rarity:'legendary'}
  );
  
  // Purple tier — add more unique chances
  GAME_DATA.theatreOfAsh.lootTables.purple.push(
    {item:'eternal_core',       qty:1,   chance:0.40, rarity:'epic'}
  );
  
  // Expand unique pool
  GAME_DATA.theatreOfAsh.lootTables.unique.push(
    {item:'sanguine_ornament',  chance:0.08},
    {item:'twisted_acorn',      chance:0.05},
    {item:'ancient_lamp',       chance:0.06}
  );
}

// ── RAID EXCLUSIVE ITEMS ──────────────────────────────────────
// New items only obtainable from raids
const RAID_ITEMS = {
  // Chambers exclusives
  verdant_staff: {
    id:'verdant_staff', name:'Verdant Staff', desc:'A twisted staff sprouting with poisonous vines.',
    type:'staff', rarity:'epic', slot:'2h',
    stats: {magicBonus:48, magicDefence:35, magicLevelReq:60},
    requires:{magic:60}, affinity:'jungle', onEquip(){} 
  },
  woven_gloves: {
    id:'woven_gloves', name:'Woven Gloves', desc:'Gloves woven from shambling mound fibers.',
    type:'gloves', rarity:'rare', slot:'hands',
    stats: {defenceBonus:22, magicDefence:18}, affinity:'nature'
  },
  vanguard_helm: {
    id:'vanguard_helm', name:'Vanguard Helm', desc:'Helm of an elite Vanguard warrior.',
    type:'helmet', rarity:'epic', slot:'head',
    stats: {defenceBonus:45, attackBonus:15, meleeLevelReq:65},
    requires:{melee:65}, affinity:'warrior'
  },
  forgemaster_hammer: {
    id:'forgemaster_hammer', name:'Forgemaster\'s Hammer', desc:'A legendary smithing hammer from Tekton\'s forge.',
    type:'weapon', rarity:'legendary', slot:'2h',
    stats: {attackBonus:82, strengthBonus:45, craftingBonus:30},
    requires:{crafting:75, melee:70}, affinity:'fire', onEquip(){}
  },
  frozen_sceptre: {
    id:'frozen_sceptre', name:'Frozen Sceptre', desc:'A sceptre forged from eternal ice.',
    type:'staff', rarity:'legendary', slot:'2h',
    stats: {magicBonus:75, magicDefence:55, magicLevelReq:75},
    requires:{magic:75}, affinity:'ice', onEquip(){}
  },
  primordial_staff: {
    id:'primordial_staff', name:'Primordial Staff', desc:'The ancient staff of the Great Olm itself.',
    type:'staff', rarity:'legendary', slot:'2h',
    stats: {magicBonus:95, magicDefence:65, spellDamage:0.15},
    requires:{magic:80}, affinity:'ancient', onEquip(){}
  },
  // Materials for raid crafting
  shambling_seeds: {
    id:'shambling_seeds', name:'Shambling Seeds', desc:'Seeds that twitch with unwilling life.',
    type:'resource', rarity:'uncommon', stackable:true
  },
  warrior_blood: {
    id:'warrior_blood', name:'Warrior Blood', desc:'Essence of fallen vanguards.',
    type:'resource', rarity:'uncommon', stackable:true
  },
  forge_dust: {
    id:'forge_dust', name:'Forge Dust', desc:'Metallic dust from Tekton\'s forging.',
    type:'resource', rarity:'common', stackable:true
  },
  crystalline_shard: {
    id:'crystalline_shard', name:'Crystalline Shard', desc:'A shard of eternal ice.',
    type:'resource', rarity:'uncommon', stackable:true
  },
  ancient_essence: {
    id:'ancient_essence', name:'Ancient Essence', desc:'Pure essence of the ancient world.',
    type:'resource', rarity:'epic', stackable:true
  },
  ragshard: {
    id:'ragshard', name:'Ragshard', desc:'Fragment of raid armor.',
    type:'resource', rarity:'uncommon', stackable:true
  },
  olm_eye: {
    id:'olm_eye', name:'Olm\'s Eye', desc:'The all-seeing eye of the Great Olm.',
    type:'resource', rarity:'unique', stackable:false
  },
  olm_heart: {
    id:'olm_heart', name:'Olm\'s Heart', desc:'The still-beating heart of the ancient guardian.',
    type:'resource', rarity:'unique', stackable:false
  },
};

// Register raid items if they don't exist
for (const [id, item] of Object.entries(RAID_ITEMS)) {
  if (!GAME_DATA.items[id]) {
    GAME_DATA.items[id] = { ...item };
  }
}

// ── IMPROVED POTION SYSTEM ────────────────────────────────────
// New high-tier potions with better buffs
const RAID_POTIONS = {
  supreme_strength: {
    id:'supreme_strength', name:'Supreme Strength Potion', desc:'Grants extreme strength.',
    type:'potion', rarity:'epic', craftLevel:85, craftXp:150,
    ingredients:{
      herblore_catalyst:1, strength_herb:3, dragon_tooth:2,
    },
    buff:{stat:'strengthBonus', value:20, duration:180},
    healAmount:0,
  },
  divine_magic: {
    id:'divine_magic', name:'Divine Magic Potion', desc:'Enhances magical power.',
    type:'potion', rarity:'epic', craftLevel:87, craftXp:160,
    ingredients:{
      herblore_catalyst:1, magic_herb:3, celestial_fragment:1,
    },
    buff:{stat:'magicBonus', value:25, duration:180},
    healAmount:0,
  },
  bastion_brew: {
    id:'bastion_brew', name:'Bastion Brew', desc:'Reduces incoming damage.',
    type:'potion', rarity:'epic', craftLevel:89, craftXp:170,
    ingredients:{
      herblore_catalyst:1, defence_herb:3, ragshard:2,
    },
    buff:{stat:'damageReduction', value:0.20, duration:150},
    healAmount:5,
  },
  twilight_elixir: {
    id:'twilight_elixir', name:'Twilight Elixir', desc:'Grants evasion and grace.',
    type:'potion', rarity:'epic', craftLevel:88, craftXp:165,
    ingredients:{
      herblore_catalyst:1, evasion_herb:3, crystalline_shard:2,
    },
    buff:{stat:'evasionBonus', value:15, duration:160},
    healAmount:3,
  },
  ancient_vigor: {
    id:'ancient_vigor', name:'Ancient Vigor Potion', desc:'Restores all vitality.',
    type:'potion', rarity:'legendary', craftLevel:92, craftXp:200,
    ingredients:{
      herblore_catalyst:2, ancient_essence:1, torstol:5,
    },
    buff:{stat:'lifeRestore', value:0.25, duration:120},
    healAmount:25,
  },
};

// Register potions
for (const [id, potion] of Object.entries(RAID_POTIONS)) {
  if (!GAME_DATA.items[id]) {
    GAME_DATA.items[id] = { ...potion };
  }
  // Add to herblore recipes
  if (!GAME_DATA.recipes.herblore) GAME_DATA.recipes.herblore = [];
  if (!GAME_DATA.recipes.herblore.find(r => r.result === id)) {
    GAME_DATA.recipes.herblore.push({
      result:id, qty:1, level:potion.craftLevel,
      xp:potion.craftXp, ingredients:potion.ingredients
    });
  }
}

// ── ENHANCED POTION BUFF SYSTEM ───────────────────────────────
// Fix: Ensure buff _maxDuration is set correctly and doesn't flash
GameEngine.prototype._applyPotionBuff = function(item) {
  if (!item.buff) return;
  
  // Check if buff already exists (refresh it instead of stacking)
  const existing = this.state.combat.activeBuffs.find(b => 
    b.stat === item.buff.stat
  );
  
  if (existing) {
    // Refresh duration instead of stacking
    existing.remaining = item.buff.duration || 120;
    existing._maxDuration = item.buff.duration || 120;
    existing.value = Math.max(existing.value, item.buff.value);
  } else {
    // Add new buff with proper max duration set
    const buff = {
      stat: item.buff.stat,
      value: item.buff.value,
      remaining: item.buff.duration || 120,
      _maxDuration: item.buff.duration || 120,  // ← FIX: Always set max
      type: 'time'
    };
    this.state.combat.activeBuffs.push(buff);
  }
  
  this.emit('buffApplied', {stat: item.buff.stat, duration: item.buff.duration});
};

// ── RAID RECIPE ADDITIONS ─────────────────────────────────────
// New crafting recipes using raid materials
const RAID_RECIPES = {
  crafting: [
    {
      result:'vanguard_shield', qty:1, level:72,
      ingredients:{adamantite_bar:2, ragshard:3, leather:4}, xp:180
    },
    {
      result:'verdant_boots', qty:1, level:68,
      ingredients:{shambling_seeds:2, cloth:3, leather:2}, xp:150
    },
  ],
  smithing: [
    {
      result:'dragonite_helmet', qty:1, level:80,
      ingredients:{dragonite_bar:3, runite_bar:2}, xp:220
    },
    {
      result:'orichalcum_plate', qty:1, level:85,
      ingredients:{orichalcum_ore:6, mythril_bar:2, forge_dust:4}, xp:280
    },
  ],
};

// Register raid recipes
for (const [skill, recipes] of Object.entries(RAID_RECIPES)) {
  if (!GAME_DATA.recipes[skill]) GAME_DATA.recipes[skill] = [];
  for (const recipe of recipes) {
    if (!GAME_DATA.recipes[skill].find(r => r.result === recipe.result)) {
      GAME_DATA.recipes[skill].push(recipe);
    }
  }
}

// ── RAID ACHIEVEMENTS ─────────────────────────────────────────
const RAID_ACHIEVEMENTS = [
  {
    id:'chambers_bronze', name:'Ashvault Explorer', desc:'Complete Chambers of Ash on Bronze difficulty.',
    category:'raids', icon:'⛓', reward:'500 QP', points:10
  },
  {
    id:'chambers_gold', name:'Ashvault Conqueror', desc:'Complete Chambers of Ash on Gold difficulty.',
    category:'raids', icon:'⛓', reward:'2000 QP', points:30
  },
  {
    id:'olm_slayer', name:'Olm\'s Bane', desc:'Defeat the Great Olm.',
    category:'raids', icon:'⚔', reward:'5000 QP', points:50
  },
  {
    id:'theatre_purple', name:'Theatre Master', desc:'Complete Theatre of Ash on Purple difficulty.',
    category:'raids', icon:'🎭', reward:'3000 QP', points:40
  },
];

// Register achievements
if (!GAME_DATA.achievements) GAME_DATA.achievements = [];
for (const ach of RAID_ACHIEVEMENTS) {
  if (!GAME_DATA.achievements.find(a => a.id === ach.id)) {
    GAME_DATA.achievements.push(ach);
  }
}

// ── LOGGING ────────────────────────────────────────
if (window._ASHFALL_DEBUG) {
  console.log('[Ashfall] Raids Content Expansion v10.0 loaded');
  console.log('  Chambers bosses: 5 with complete drop tables');
  console.log('  New raid items: ' + Object.keys(RAID_ITEMS).length);
  console.log('  New raid potions: ' + Object.keys(RAID_POTIONS).length);
  console.log('  New raid recipes: ' + Object.values(RAID_RECIPES).reduce((a,b)=>a+b.length,0));
  console.log('  New achievements: ' + RAID_ACHIEVEMENTS.length);
}
