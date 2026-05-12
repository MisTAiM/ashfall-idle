// ================================================================
// ASHFALL IDLE — UNIFIED MAGIC SYSTEM v1.0
// Rune-based spellcasting + Rune crafting progression
// Materials → Runes → Spells
// ================================================================

// ── RUNE SYSTEM ────────────────────────────────────────────────
// 8 rune types, each trained from different materials
const RUNE_SYSTEM = {
  runes: {
    mind: {
      id: 'mind',
      name: 'Mind Rune',
      color: '#7b68ee',
      material: 'essence_of_mind',
      materialName: 'Mind Essence',
      xpPerCraft: 15,
      baseTime: 2000, // 2 seconds
      levelRequired: 1
    },
    air: {
      id: 'air',
      name: 'Air Rune',
      color: '#87ceeb',
      material: 'essence_of_air',
      materialName: 'Air Essence',
      xpPerCraft: 18,
      baseTime: 2500,
      levelRequired: 5
    },
    water: {
      id: 'water',
      name: 'Water Rune',
      color: '#4169e1',
      material: 'essence_of_water',
      materialName: 'Water Essence',
      xpPerCraft: 20,
      baseTime: 2800,
      levelRequired: 10
    },
    earth: {
      id: 'earth',
      name: 'Earth Rune',
      color: '#8b4513',
      material: 'essence_of_earth',
      materialName: 'Earth Essence',
      xpPerCraft: 22,
      baseTime: 3000,
      levelRequired: 15
    },
    fire: {
      id: 'fire',
      name: 'Fire Rune',
      color: '#ff4500',
      material: 'essence_of_fire',
      materialName: 'Fire Essence',
      xpPerCraft: 25,
      baseTime: 3200,
      levelRequired: 20
    },
    body: {
      id: 'body',
      name: 'Body Rune',
      color: '#daa520',
      material: 'essence_of_body',
      materialName: 'Body Essence',
      xpPerCraft: 28,
      baseTime: 3500,
      levelRequired: 30
    },
    chaos: {
      id: 'chaos',
      name: 'Chaos Rune',
      color: '#dc143c',
      material: 'essence_of_chaos',
      materialName: 'Chaos Essence',
      xpPerCraft: 35,
      baseTime: 4000,
      levelRequired: 50
    },
    ancient: {
      id: 'ancient',
      name: 'Ancient Rune',
      color: '#4b0082',
      material: 'essence_of_ancient',
      materialName: 'Ancient Essence',
      xpPerCraft: 50,
      baseTime: 5000,
      levelRequired: 75
    }
  },

  getRuneById: function(runeId) {
    return this.runes[runeId];
  }
};

// ── SPELL RECIPES ──────────────────────────────────────────────
// Spell = combination of runes + mana cost
const SPELL_RECIPES = {
  // DETECTION SCHOOL (Level 1-25)
  detect_magic: {
    id: 'detect_magic',
    name: 'Detect Magic',
    school: 'detection',
    levelRequired: 1,
    manaCost: 5,
    runes: { mind: 1 },
    xpGain: 10,
    effect: 'Reveal hidden magic in the area',
    cooldown: 0
  },

  // COMBAT SCHOOL (Level 1-99)
  spark: {
    id: 'spark',
    name: 'Spark',
    school: 'combat',
    levelRequired: 1,
    manaCost: 8,
    runes: { mind: 1 },
    xpGain: 15,
    damage: [3, 8],
    effect: 'Small burst of fire'
  },

  fireball: {
    id: 'fireball',
    name: 'Fireball',
    school: 'combat',
    levelRequired: 20,
    manaCost: 16,
    runes: { mind: 1, fire: 2 },
    xpGain: 40,
    damage: [5, 15],
    effect: 'Medium AoE fire attack',
    areaOfEffect: 3
  },

  ice_bolt: {
    id: 'ice_bolt',
    name: 'Ice Bolt',
    school: 'combat',
    levelRequired: 25,
    manaCost: 15,
    runes: { mind: 1, water: 2 },
    xpGain: 35,
    damage: [4, 12],
    effect: 'Freezes target for 3 seconds',
    stun: 3000
  },

  meteor_strike: {
    id: 'meteor_strike',
    name: 'Meteor Strike',
    school: 'combat',
    levelRequired: 60,
    manaCost: 35,
    runes: { mind: 1, fire: 2, chaos: 1 },
    xpGain: 80,
    damage: [8, 20],
    effect: 'Massive fire impact',
    areaOfEffect: 5
  },

  // HEALING SCHOOL (Level 10-80)
  heal: {
    id: 'heal',
    name: 'Heal',
    school: 'healing',
    levelRequired: 10,
    manaCost: 15,
    runes: { mind: 1, water: 1, body: 1 },
    xpGain: 25,
    heals: [1, 20], // 1d20
    effect: 'Restore HP to self or ally'
  },

  restoration: {
    id: 'restoration',
    name: 'Restoration',
    school: 'healing',
    levelRequired: 40,
    manaCost: 30,
    runes: { mind: 2, water: 2, body: 1 },
    xpGain: 60,
    heals: [3, 20],
    effect: 'Massive HP recovery',
    cureFocus: true // removes status effects
  },

  // SUPPORT SCHOOL (Level 15-85)
  strength_boost: {
    id: 'strength_boost',
    name: 'Strength Boost',
    school: 'support',
    levelRequired: 15,
    manaCost: 12,
    runes: { mind: 1, body: 1, earth: 1 },
    xpGain: 20,
    effect: '+25% damage for 60 seconds',
    buffDuration: 60000,
    buffStat: 'strength',
    buffMultiplier: 1.25
  },

  protection: {
    id: 'protection',
    name: 'Protection',
    school: 'support',
    levelRequired: 25,
    manaCost: 20,
    runes: { mind: 2, earth: 1, body: 1 },
    xpGain: 35,
    effect: '-20% damage taken for 45 seconds',
    buffDuration: 45000,
    buffStat: 'defence',
    buffReduction: 0.2
  },

  haste: {
    id: 'haste',
    name: 'Haste',
    school: 'support',
    levelRequired: 50,
    manaCost: 35,
    runes: { mind: 2, air: 2 },
    xpGain: 70,
    effect: '+40% attack speed for 30 seconds',
    buffDuration: 30000,
    buffStat: 'speed',
    buffMultiplier: 1.4
  },

  // UTILITY SCHOOL (Level 5-99)
  light: {
    id: 'light',
    name: 'Light',
    school: 'utility',
    levelRequired: 5,
    manaCost: 5,
    runes: { air: 1 },
    xpGain: 8,
    effect: 'Illuminate dark areas'
  },

  teleport: {
    id: 'teleport',
    name: 'Teleport',
    school: 'utility',
    levelRequired: 45,
    manaCost: 25,
    runes: { mind: 1, air: 2, ancient: 1 },
    xpGain: 65,
    effect: 'Instantly escape from combat',
    canUseInCombat: false
  }
};

// ── SPELL SCHOOLS ─────────────────────────────────────────────
const SPELL_SCHOOLS = {
  detection: {
    id: 'detection',
    name: 'Detection',
    icon: '👁',
    color: '#7b68ee',
    description: 'Reveal hidden magic and objects'
  },
  combat: {
    id: 'combat',
    name: 'Combat',
    icon: '⚡',
    color: '#ff4500',
    description: 'Offensive spells for battle'
  },
  healing: {
    id: 'healing',
    name: 'Healing',
    icon: '✨',
    color: '#00ff7f',
    description: 'Restore health and cure ailments'
  },
  support: {
    id: 'support',
    name: 'Support',
    icon: '🛡',
    color: '#4169e1',
    description: 'Buffs and protection'
  },
  utility: {
    id: 'utility',
    name: 'Utility',
    icon: '🌟',
    color: '#daa520',
    description: 'Practical magic outside combat'
  }
};

// ── RUNE CRAFTING RECIPES ──────────────────────────────────────
// Materials needed to craft each rune
const RUNE_CRAFTING_RECIPES = {
  mind: {
    runeId: 'mind',
    level: 1,
    materials: { ethereal_dust: 2 },
    time: 2000,
    xp: 15
  },
  air: {
    runeId: 'air',
    level: 5,
    materials: { ethereal_dust: 3, wind_shard: 1 },
    time: 2500,
    xp: 18
  },
  water: {
    runeId: 'water',
    level: 10,
    materials: { ethereal_dust: 3, water_shard: 1 },
    time: 2800,
    xp: 20
  },
  earth: {
    runeId: 'earth',
    level: 15,
    materials: { ethereal_dust: 4, earth_shard: 1 },
    time: 3000,
    xp: 22
  },
  fire: {
    runeId: 'fire',
    level: 20,
    materials: { ethereal_dust: 4, fire_shard: 2 },
    time: 3200,
    xp: 25
  },
  body: {
    runeId: 'body',
    level: 30,
    materials: { ethereal_dust: 5, soul_fragment: 1 },
    time: 3500,
    xp: 28
  },
  chaos: {
    runeId: 'chaos',
    level: 50,
    materials: { ethereal_dust: 6, chaos_shard: 2 },
    time: 4000,
    xp: 35
  },
  ancient: {
    runeId: 'ancient',
    level: 75,
    materials: { ethereal_dust: 8, ancient_shard: 3 },
    time: 5000,
    xp: 50
  }
};

// ── ENGINE METHODS ────────────────────────────────────────────
// Rune crafting
GameEngine.prototype.craftRune = function(runeId, level) {
  return tryOperation(() => {
    const recipe = RUNE_CRAFTING_RECIPES[runeId];
    if (!recipe) throw new Error(`Unknown rune: ${runeId}`);
    
    // Check level
    if (level < recipe.level) {
      throw new Error(`Need Magic level ${recipe.level} to craft ${runeId}`);
    }

    // Check materials
    for (const [matId, count] of Object.entries(recipe.materials)) {
      if (!this.state.inventory[matId] || this.state.inventory[matId].count < count) {
        throw new Error(`Need ${count}x ${matId}`);
      }
    }

    // Consume materials
    for (const [matId, count] of Object.entries(recipe.materials)) {
      this.state.inventory[matId].count -= count;
      if (this.state.inventory[matId].count <= 0) {
        delete this.state.inventory[matId];
      }
    }

    // Gain rune
    const runeItem = `rune_${runeId}`;
    if (!this.state.inventory[runeItem]) {
      this.state.inventory[runeItem] = { id: runeItem, count: 0, type: 'rune' };
    }
    this.state.inventory[runeItem].count += 1;

    // Gain XP
    this.addXP('magic', recipe.xp);

    this.emit('runeCrafted', { rune: runeId, xp: recipe.xp });
    return { rune: runeId, xp: recipe.xp };
  });
};

// Cast spell (consume runes + mana)
GameEngine.prototype.castSpell = function(spellId, targetId) {
  return tryOperation(() => {
    const spell = SPELL_RECIPES[spellId];
    if (!spell) throw new Error(`Unknown spell: ${spellId}`);

    const magicLevel = this.state.skills.magic.level;
    
    console.log('[Magic] Casting ' + spellId);
    console.log('[Magic]   Level required: ' + spell.levelRequired + ', Have: ' + magicLevel);
    console.log('[Magic]   Mana cost: ' + spell.manaCost + ', Have: ' + (this.state.combat.mana?.current || 0));
    
    // Check requirements
    if (magicLevel < spell.levelRequired) {
      throw new Error(`Need Magic ${spell.levelRequired} (have ${magicLevel})`);
    }

    // Check mana
    if (!this.state.combat.mana || this.state.combat.mana.current < spell.manaCost) {
      throw new Error(`Need ${spell.manaCost} mana (have ${this.state.combat.mana?.current || 0})`);
    }

    // Check runes
    for (const [runeId, count] of Object.entries(spell.runes)) {
      const runeItem = `rune_${runeId}`;
      if (!this.state.inventory[runeItem] || this.state.inventory[runeItem].count < count) {
        throw new Error(`Need ${count}x ${runeId} rune`);
      }
    }

    // Consume mana
    const manaBefore = this.state.combat.mana.current;
    this.state.combat.mana.current -= spell.manaCost;
    console.log('[Magic]   Mana CONSUMED: ' + manaBefore + ' -> ' + this.state.combat.mana.current);

    // Consume runes
    for (const [runeId, count] of Object.entries(spell.runes)) {
      const runeItem = `rune_${runeId}`;
      this.state.inventory[runeItem].count -= count;
      console.log('[Magic]   Rune consumed: ' + runeId + ' (' + count + ')');
      if (this.state.inventory[runeItem].count <= 0) {
        delete this.state.inventory[runeItem];
      }
    }

    // Gain XP
    this.addXP('magic', spell.xpGain);
    console.log('[Magic]   XP gained: ' + spell.xpGain);

    this.emit('spellCast', { 
      spell: spellId,
      target: targetId,
      xp: spell.xpGain,
      damage: spell.damage,
      heals: spell.heals
    });

    return { spell: spellId, xp: spell.xpGain };
  });
};

// Get available spells for current level
GameEngine.prototype.getAvailableSpells = function() {
  const magicLevel = this.state.skills.magic.level;
  return Object.values(SPELL_RECIPES).filter(s => s.levelRequired <= magicLevel);
};

// Get spell by school
GameEngine.prototype.getSpellsBySchool = function(schoolId) {
  const magicLevel = this.state.skills.magic.level;
  return Object.values(SPELL_RECIPES).filter(
    s => s.school === schoolId && s.levelRequired <= magicLevel
  );
};

// ── LOGGING ────────────────────────────────────────────────────
if (window._ASHFALL_DEBUG) {
  console.log('[Ashfall] Unified Magic System loaded');
  console.log('  Runes: ' + Object.keys(RUNE_SYSTEM.runes).length);
  console.log('  Spells: ' + Object.keys(SPELL_RECIPES).length);
  console.log('  Schools: ' + Object.keys(SPELL_SCHOOLS).length);
  console.log('  Rune recipes: ' + Object.keys(RUNE_CRAFTING_RECIPES).length);
}

// Export
window.MAGIC_SYSTEM = {
  RUNE_SYSTEM,
  SPELL_RECIPES,
  SPELL_SCHOOLS,
  RUNE_CRAFTING_RECIPES
};
