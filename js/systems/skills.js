// ================================================================
// ASHFALL IDLE — systems/skills.js
// All skilling logic: actions, mastery, mana system definitions.
// Source: skills-overhaul.js
// ================================================================
// ================================================================
// ASHFALL IDLE — Skill System Overhaul v2.0
// Mana system, weapon types, ammo tracking, spell schools,
// quality levels, failure rates, advanced skill mechanics
// ================================================================

// ── MANA SYSTEM ───────────────────────────────────────────────
// For magic-based skills (magic, necromancy, incantation)
const MANA_SYSTEM = {
  enabled: true,
  maxManaBase: 100,
  manaRegenPerSecond: 1,
  spellCastTime: 1.5, // seconds
  
  // Spell schools (5 schools with 5-8 spells each)
  spellSchools: {
    combat: {
      id: 'combat',
      name: 'Combat Magic',
      color: '#c44040',
      levelReq: 1,
      spells: [
        { id: 'spark', name: 'Spark', manaCost: 10, level: 1, damage: 8, range: 10 },
        { id: 'fireball', name: 'Fireball', manaCost: 20, level: 20, damage: 25, range: 15 },
        { id: 'inferno', name: 'Inferno', manaCost: 50, level: 50, damage: 80, range: 20 },
      ]
    },
    healing: {
      id: 'healing',
      name: 'Healing Magic',
      color: '#4abe6c',
      levelReq: 10,
      spells: [
        { id: 'heal_minor', name: 'Minor Heal', manaCost: 15, level: 10, healing: 25 },
        { id: 'heal_normal', name: 'Heal', manaCost: 25, level: 30, healing: 60 },
        { id: 'heal_large', name: 'Greater Heal', manaCost: 45, level: 60, healing: 150 },
      ]
    },
    support: {
      id: 'support',
      name: 'Support Magic',
      color: '#8a5ec4',
      levelReq: 15,
      spells: [
        { id: 'shield', name: 'Shield Spell', manaCost: 20, level: 15, effect: 'damageReduction', value: 0.20, duration: 30 },
        { id: 'haste', name: 'Haste', manaCost: 30, level: 35, effect: 'speedBonus', value: 30, duration: 45 },
        { id: 'clarity', name: 'Clarity', manaCost: 25, level: 25, effect: 'accuracyBonus', value: 20, duration: 40 },
      ]
    },
    curse: {
      id: 'curse',
      name: 'Curse Magic',
      color: '#663399',
      levelReq: 35,
      spells: [
        { id: 'weak', name: 'Weaken', manaCost: 25, level: 35, effect: 'damageReduction', target: 'enemy', value: 0.15 },
        { id: 'curse_def', name: 'Curse Defence', manaCost: 35, level: 45, effect: 'defenceReduction', target: 'enemy', value: 0.25 },
        { id: 'doom', name: 'Doom', manaCost: 60, level: 75, effect: 'damageMultiplier', target: 'enemy', value: 1.5, duration: 20 },
      ]
    },
    ancient: {
      id: 'ancient',
      name: 'Ancient Magic',
      color: '#c9873e',
      levelReq: 70,
      spells: [
        { id: 'time_warp', name: 'Time Warp', manaCost: 80, level: 70, effect: 'speedMultiplier', value: 2.0, duration: 15 },
        { id: 'meteor', name: 'Meteor Storm', manaCost: 100, level: 80, damage: 200, range: 25 },
        { id: 'transcend', name: 'Transcendence', manaCost: 150, level: 99, effect: 'powerOverload', value: 3.0, duration: 10 },
      ]
    }
  }
};

// Register spell schools in GAME_DATA if not present
if (!GAME_DATA.spellSchools) GAME_DATA.spellSchools = MANA_SYSTEM.spellSchools;

// ── WEAPON TYPE SYSTEM ─────────────────────────────────────────
// Different weapon types give different bonuses/mechanics
const SKILL_WEAPON_TYPES = {
  // Melee weapons
  sword: { id: 'sword', name: 'Sword', damage: 1.0, speed: 1.0, accuracy: 1.0 },
  scimitar: { id: 'scimitar', name: 'Scimitar', damage: 0.95, speed: 1.1, accuracy: 1.05, bleed: 0.1 },
  spear: { id: 'spear', name: 'Spear', damage: 0.90, speed: 0.95, accuracy: 1.0, range: 2, pierce: true },
  axe: { id: 'axe', name: 'Axe', damage: 1.15, speed: 0.9, accuracy: 0.95, crush: true },
  mace: { id: 'mace', name: 'Mace', damage: 1.20, speed: 0.85, accuracy: 0.90, stun: 0.15 },
  dagger: { id: 'dagger', name: 'Dagger', damage: 0.60, speed: 1.3, accuracy: 1.1, bleed: 0.15 },
  halberd: { id: 'halberd', name: 'Halberd', damage: 1.25, speed: 0.80, accuracy: 0.95, aoe: true },
  claws: { id: 'claws', name: 'Claws', damage: 0.85, speed: 1.25, accuracy: 1.15, multiHit: 2 },
  
  // Ranged weapons
  bow: { id: 'bow', name: 'Bow', damage: 1.0, speed: 1.0, accuracy: 1.0, ammoType: 'arrow', range: 30 },
  crossbow: { id: 'crossbow', name: 'Crossbow', damage: 1.15, speed: 0.85, accuracy: 1.1, ammoType: 'bolt', range: 40, piercing: true },
  blowpipe: { id: 'blowpipe', name: 'Blowpipe', damage: 0.70, speed: 1.4, accuracy: 0.95, ammoType: 'dart', range: 20 },
  
  // Magic weapons
  staff: { id: 'staff', name: 'Staff', damage: 1.0, speed: 1.0, spellDamage: 1.0, manaCostReduction: 0.05 },
  wand: { id: 'wand', name: 'Wand', damage: 0.60, speed: 1.1, spellDamage: 0.95, manaCostReduction: 0.10 },
  sceptre: { id: 'sceptre', name: 'Sceptre', damage: 0.80, speed: 0.95, spellDamage: 1.2, manaCostReduction: 0.15 },
};

if (!GAME_DATA.weaponTypes) GAME_DATA.weaponTypes = WEAPON_TYPES;

// ── AMMO SYSTEM ───────────────────────────────────────────────
// Ranged weapons consume ammo
const AMMO_TYPES = {
  arrow: {
    id: 'arrow', name: 'Arrow', type: 'ammo',
    variants: [
      { id: 'bronze_arrow', name: 'Bronze Arrow', damage: 1.0, level: 1 },
      { id: 'iron_arrow', name: 'Iron Arrow', damage: 1.2, level: 10 },
      { id: 'steel_arrow', name: 'Steel Arrow', damage: 1.4, level: 20 },
      { id: 'mithril_arrow', name: 'Mithril Arrow', damage: 1.6, level: 40 },
      { id: 'dragonite_arrow', name: 'Dragonite Arrow', damage: 1.9, level: 70 },
    ]
  },
  bolt: {
    id: 'bolt', name: 'Bolt', type: 'ammo',
    variants: [
      { id: 'bronze_bolt', name: 'Bronze Bolt', damage: 1.1, level: 1 },
      { id: 'iron_bolt', name: 'Iron Bolt', damage: 1.3, level: 15 },
      { id: 'steel_bolt', name: 'Steel Bolt', damage: 1.5, level: 25 },
      { id: 'mithril_bolt', name: 'Mithril Bolt', damage: 1.7, level: 45 },
      { id: 'dragonite_bolt', name: 'Dragonite Bolt', damage: 2.0, level: 75 },
    ]
  },
  dart: {
    id: 'dart', name: 'Dart', type: 'ammo',
    variants: [
      { id: 'bronze_dart', name: 'Bronze Dart', damage: 0.8, level: 1, poison: 0.05 },
      { id: 'iron_dart', name: 'Iron Dart', damage: 1.0, level: 20, poison: 0.10 },
      { id: 'steel_dart', name: 'Steel Dart', damage: 1.2, level: 35, poison: 0.15 },
      { id: 'mithril_dart', name: 'Mithril Dart', damage: 1.4, level: 55, poison: 0.20 },
    ]
  }
};

if (!GAME_DATA.ammoTypes) GAME_DATA.ammoTypes = AMMO_TYPES;

// ── QUALITY SYSTEM FOR CRAFTED ITEMS ──────────────────────────
// Items can be normal, uncommon, rare, epic quality with better stats
const QUALITY_TIERS = {
  normal: { id: 'normal', name: 'Normal', bonus: 1.0, color: '#ffffff', rarity: 'common' },
  uncommon: { id: 'uncommon', name: 'Uncommon', bonus: 1.15, color: '#00aa00', rarity: 'uncommon' },
  rare: { id: 'rare', name: 'Rare', bonus: 1.30, color: '#0066ff', rarity: 'rare' },
  epic: { id: 'epic', name: 'Epic', bonus: 1.50, color: '#aa00ff', rarity: 'epic' },
  masterwork: { id: 'masterwork', name: 'Masterwork', bonus: 1.75, color: '#ffaa00', rarity: 'legendary' },
};

// Quality chance based on skill level
function getQualityTierChance(skillLevel) {
  return {
    normal: Math.max(0.50, 1.0 - (skillLevel / 99) * 0.50),
    uncommon: Math.min(0.30, (skillLevel / 50) * 0.30),
    rare: Math.min(0.15, (skillLevel / 70) * 0.15),
    epic: Math.min(0.04, (skillLevel / 90) * 0.04),
    masterwork: Math.min(0.01, (skillLevel / 99) * 0.01),
  };
}

// ── COOKING SYSTEM IMPROVEMENTS ────────────────────────────────
// Food degrades over time, recipes have combinations
const COOKING_IMPROVEMENTS = {
  foodDegradation: true,
  degradationTimeMinutes: 60, // Food gets worse after 1 hour
  
  degradationStages: [
    { stage: 0, name: 'Fresh', healing: 1.0, color: '#4abe6c' },
    { stage: 1, name: 'Good', healing: 0.90, color: '#7ec444' },
    { stage: 2, name: 'Stale', healing: 0.70, color: '#c9873e' },
    { stage: 3, name: 'Spoiled', healing: 0.30, color: '#cc5500' },
  ],
  
  // Food combinations that stack buffs
  mealCombos: [
    {
      name: 'Basic Meal',
      items: ['cooked_meat', 'cooked_fish', 'bread'],
      healing: 30,
      buffs: { strengthBonus: 3 }
    },
    {
      name: 'Warrior\'s Feast',
      items: ['cooked_meat', 'shark', 'mashed_potatoes', 'bread'],
      healing: 50,
      buffs: { strengthBonus: 8, defenceBonus: 5 }
    },
    {
      name: 'Mage\'s Repast',
      items: ['cooked_fish', 'torstol', 'mushroom_pie', 'bread'],
      healing: 35,
      buffs: { magicBonus: 10, manaRestore: 20 }
    },
  ]
};

// ── HERBLORE IMPROVEMENTS ──────────────────────────────────────
// Potion failure chance, quality levels, new recipes
const HERBLORE_IMPROVEMENTS = {
  failureSystem: true,
  qualityLevels: true,
  
  // Potion failure chance based on level
  // 99 herblore = 1% failure, 50 herblore = 10% failure, 1 herblore = 20% failure
  getFailureChance: function(skillLevel) {
    return Math.max(0.01, 0.20 - (skillLevel / 99) * 0.19);
  },
  
  // Failed potions create lesser potions (half effect)
  // Perfect potions (rare) have double effect
  qualityChances: function(skillLevel) {
    return {
      failed: this.getFailureChance(skillLevel),
      normal: 0.60,
      enhanced: Math.min(0.30, (skillLevel / 80) * 0.30),
      perfect: Math.min(0.10, (skillLevel / 99) * 0.10),
    };
  },
  
  // New advanced recipes (higher levels)
  advancedRecipes: [
    { id: 'super_energy', name: 'Super Energy Potion', level: 52, healing: 30, effect: 'energyRestore', value: 30 },
    { id: 'antidote_plus', name: 'Antidote++', level: 69, effect: 'poisonImmunity', duration: 60 },
    { id: 'ultimate_elixir', name: 'Ultimate Elixir', level: 85, healing: 60, effect: 'statBoosts', duration: 45 },
  ]
};

// ── CRAFTING IMPROVEMENTS ──────────────────────────────────────
// Recipe chains, masterwork crafting, crafting perks
const CRAFTING_IMPROVEMENTS = {
  recipeChains: [
    {
      name: 'Leather Armor Chain',
      recipes: [
        { id: 'leather_gloves', level: 1 },
        { id: 'leather_boots', level: 5 },
        { id: 'leather_chestplate', level: 10 },
      ],
      reward: 'Leather Armor Set bonus: +5% crafting speed'
    },
    {
      name: 'Gold Jewelry Chain',
      recipes: [
        { id: 'gold_ring', level: 20 },
        { id: 'gold_amulet', level: 25 },
        { id: 'gold_bracelet', level: 30 },
      ],
      reward: 'Golden Set bonus: +10% sell value'
    }
  ],
  
  masterworkSystem: {
    enabled: true,
    chance: function(skillLevel) {
      return Math.min(0.25, (skillLevel / 99) * 0.25);
    },
    bonus: 1.75, // Stats 75% better than normal
  }
};

// ── SMITHING IMPROVEMENTS ──────────────────────────────────────
// Weapon/armor quality, ore smelting efficiency, alloy combinations
const SMITHING_IMPROVEMENTS = {
  qualitySystem: true,
  alloySystem: {
    enabled: true,
    alloys: [
      { id: 'bronze', ore: 'copper_ore', material: 'tin_ore', ratio: '1:1', strength: 1.2 },
      { id: 'steel', ore: 'iron_ore', material: 'coal', ratio: '1:2', strength: 1.5 },
      { id: 'mithril', ore: 'mithril_ore', material: 'enchanting_dust', ratio: '3:1', strength: 2.0 },
    ]
  },
  
  // Smelting efficiency improves with level
  smeltingEfficiency: function(skillLevel) {
    return Math.min(0.95, 0.50 + (skillLevel / 99) * 0.45);
  }
};

// ── FARMING IMPROVEMENTS ───────────────────────────────────────
// Crop varieties, growth cycles, disease/pest management
const FARMING_IMPROVEMENTS = {
  cropVarieties: [
    { id: 'wheat', name: 'Wheat', growTime: 10, yield: 3, level: 1 },
    { id: 'barley', name: 'Barley', growTime: 15, yield: 4, level: 10 },
    { id: 'hops', name: 'Hops', growTime: 20, yield: 5, level: 20 },
    { id: 'herbs', name: 'Magical Herbs', growTime: 25, yield: 2, level: 40 },
    { id: 'mushroom', name: 'Shadow Mushrooms', growTime: 30, yield: 3, level: 60 },
  ],
  
  diseaseSystem: {
    enabled: true,
    diseaseChance: 0.1, // 10% chance per crop cycle
    cureItems: ['plant_cure', 'blessed_water'],
  }
};

// ── THIEVING IMPROVEMENTS ──────────────────────────────────────
// More NPCs, detection risk, valuable items
const THIEVING_IMPROVEMENTS = {
  npcTargets: 25, // More than current, expandable
  detectionRisk: function(skillLevel, npcLevel) {
    // Higher thieving level reduces detection chance
    return Math.max(0.05, (npcLevel * 2) - (skillLevel * 1.5)) / 100;
  },
  
  consequencesOnDetection: {
    damageDealt: 15,
    stunDuration: 3,
    reputationLoss: -50,
  }
};

// ── NECROMANCY IMPROVEMENTS ────────────────────────────────────
// Undead summons, drain spells, curse effects
const NECROMANCY_IMPROVEMENTS = {
  undeadSummons: [
    { id: 'skeleton_minion', level: 1, hp: 50, damage: 10 },
    { id: 'zombie', level: 20, hp: 100, damage: 20 },
    { id: 'ghoul', level: 50, hp: 200, damage: 40 },
    { id: 'wraith', level: 80, hp: 300, damage: 70 },
  ],
  
  drainSpells: [
    { id: 'drain_life', manaCost: 20, damage: 15, healing: 8, level: 10 },
    { id: 'drain_mana', manaCost: 25, manaSteal: 30, level: 30 },
    { id: 'life_drain', manaCost: 50, damage: 80, healing: 40, level: 70 },
  ],
  
  curseSpells: [
    { id: 'weakness', effect: 'damageReduction', level: 15 },
    { id: 'curse_strike', effect: 'accuracyReduction', level: 35 },
    { id: 'death_mark', effect: 'damageMultiplier', level: 80 },
  ]
};

// ── SUMMONING IMPROVEMENTS ─────────────────────────────────────
// More familiars, combat behaviors, synergies
const SUMMONING_IMPROVEMENTS = {
  familiarTypes: [
    { id: 'imp', name: 'Imp', level: 1, combat: 'ranged', special: 'fireball' },
    { id: 'spirit_wolf', name: 'Spirit Wolf', level: 20, combat: 'melee', special: 'pack_attack' },
    { id: 'spectral_knight', name: 'Spectral Knight', level: 50, combat: 'melee', special: 'riposte' },
    { id: 'demon_lord', name: 'Demon Lord', level: 99, combat: 'magic', special: 'chaos_strike' },
  ],
  
  familiarSynergies: [
    { familiars: ['imp', 'spirit_wolf'], bonus: 'Double familiars can combo attack' },
    { familiars: ['spectral_knight', 'spirit_wolf'], bonus: 'Flanking: +25% damage' },
  ]
};

// ── LOGGING & INTEGRATION ──────────────────────────────────────
if (window._ASHFALL_DEBUG) {
  console.log('[Ashfall] Skill System Overhaul v2.0 loaded');
  console.log('  Mana system enabled: ' + MANA_SYSTEM.enabled);
  console.log('  Spell schools: ' + Object.keys(MANA_SYSTEM.spellSchools).length);
  console.log('  Weapon types: ' + Object.keys(SKILL_WEAPON_TYPES).length);
  console.log('  Ammo types: ' + Object.keys(AMMO_TYPES).length);
  console.log('  Quality tiers: ' + Object.keys(QUALITY_TIERS).length);
  console.log('  Cooking combos: ' + COOKING_IMPROVEMENTS.mealCombos.length);
  console.log('  Crafting chains: ' + CRAFTING_IMPROVEMENTS.recipeChains.length);
  console.log('  Familiar types: ' + SUMMONING_IMPROVEMENTS.familiarTypes.length);
}

// ── EXPORT FOR USE ────────────────────────────────────────────
window.SKILL_SYSTEMS = {
  MANA_SYSTEM,
  SKILL_WEAPON_TYPES,
  AMMO_TYPES,
  QUALITY_TIERS,
  COOKING_IMPROVEMENTS,
  HERBLORE_IMPROVEMENTS,
  CRAFTING_IMPROVEMENTS,
  SMITHING_IMPROVEMENTS,
  FARMING_IMPROVEMENTS,
  THIEVING_IMPROVEMENTS,
  NECROMANCY_IMPROVEMENTS,
  SUMMONING_IMPROVEMENTS,
  getQualityTierChance,
};
