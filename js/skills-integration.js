// ================================================================
// ASHFALL IDLE — Skills Integration Layer
// Connect skill overhaul systems to game engine
// Handles mana, spell casting, weapon types, ammo, quality items
// ================================================================

// ── MANA SYSTEM INTEGRATION ────────────────────────────────────
GameEngine.prototype.initManaSystem = function() {
  if (!this.state.combat.mana) {
    this.state.combat.mana = {
      current: MANA_SYSTEM.maxManaBase,
      max: MANA_SYSTEM.maxManaBase,
      regenRate: MANA_SYSTEM.manaRegenPerSecond,
      lastRegenTime: Date.now()
    };
  }
};

GameEngine.prototype.tickMana = function(dt) {
  if (!this.state.combat.mana) return;
  
  const mana = this.state.combat.mana;
  mana.current = Math.min(
    mana.max,
    mana.current + (mana.regenRate * dt / 1000)
  );
};

GameEngine.prototype.getManaPercent = function() {
  if (!this.state.combat.mana) return 100;
  return (this.state.combat.mana.current / this.state.combat.mana.max) * 100;
};

GameEngine.prototype.canCastSpell = function(spellId, schoolId) {
  const school = MANA_SYSTEM.spellSchools[schoolId];
  if (!school) {
    errorHandler.handleError(new AshfallError(
      'SPELL_SCHOOL_NOT_FOUND',
      'Spell school does not exist',
      { schoolId },
      'warn'
    ));
    return false;
  }
  
  const spell = school.spells.find(s => s.id === spellId);
  if (!spell) {
    errorHandler.handleError(new AshfallError(
      'SPELL_NOT_FOUND',
      'Spell not found in school',
      { spellId, schoolId },
      'warn'
    ));
    return false;
  }
  
  const magicLevel = this.getSkillLevel('magic');
  if (magicLevel < spell.level) {
    errorHandler.handleError(new AshfallError(
      'SPELL_LEVEL_INSUFFICIENT',
      `Magic level ${spell.level} required for ${spell.name}`,
      { spell: spellId, required: spell.level, current: magicLevel },
      'warn'
    ));
    return false;
  }
  
  if (this.state.combat.mana.current < spell.manaCost) {
    errorHandler.handleError(new AshfallError(
      'INSUFFICIENT_MANA',
      `${spell.manaCost} mana required, only have ${Math.floor(this.state.combat.mana.current)}`,
      { spell: spellId, required: spell.manaCost, current: Math.floor(this.state.combat.mana.current) },
      'warn'
    ));
    return false;
  }
  
  return true;
};

GameEngine.prototype.castSpell = function(spellId, schoolId, target = null) {
  return tryOperation(() => {
    if (!this.canCastSpell(spellId, schoolId)) return false;
    
    const school = MANA_SYSTEM.spellSchools[schoolId];
    const spell = school.spells.find(s => s.id === spellId);
    
    // Consume mana
    this.state.combat.mana.current -= spell.manaCost;
    
    // Apply spell effect
    if (spell.damage) {
      const damage = this._calculateSpellDamage(spell, this.getSkillLevel('magic'));
      this.dealDamage(target, damage);
      this.addXp('magic', spell.level * 2);
    } else if (spell.healing) {
      const healing = spell.healing + (this.getSkillLevel('magic') / 10);
      this.state.hitpoints = Math.min(this.getHitpointsCap(), this.state.hitpoints + healing);
      this.addXp('magic', spell.level);
    } else if (spell.effect) {
      this._applySpellEffect(spell, target);
    }
    
    this.emit('spellCast', { spell: spellId, school: schoolId, manaUsed: spell.manaCost });
    return true;
  }, 'SPELL_CAST_FAILED', { spellId, schoolId });
};

GameEngine.prototype._calculateSpellDamage = function(spell, magicLevel) {
  const baseBonus = 1 + (magicLevel / 100);
  return spell.damage * baseBonus;
};

// ── WEAPON SYSTEM INTEGRATION ──────────────────────────────────
GameEngine.prototype.setWeaponType = function(weaponTypeId) {
  const weaponType = WEAPON_TYPES[weaponTypeId];
  if (!weaponType) {
    errorHandler.handleError(new AshfallError(
      'INVALID_WEAPON_TYPE',
      'Weapon type does not exist',
      { weaponTypeId },
      'warn'
    ));
    return false;
  }
  
  this.state.combat.weaponType = weaponTypeId;
  this.emit('weaponChanged', weaponType);
  return true;
};

GameEngine.prototype.getWeaponBonus = function(stat) {
  const weaponType = WEAPON_TYPES[this.state.combat.weaponType];
  if (!weaponType) return 1.0;
  
  const bonuses = {
    damage: weaponType.damage || 1.0,
    speed: weaponType.speed || 1.0,
    accuracy: weaponType.accuracy || 1.0,
    spellDamage: weaponType.spellDamage || 1.0,
  };
  
  return bonuses[stat] || 1.0;
};

// ── AMMO SYSTEM INTEGRATION ────────────────────────────────────
GameEngine.prototype.getAmmoCount = function(ammoId) {
  const count = this.state.inventory[ammoId];
  return count ? count.qty : 0;
};

GameEngine.prototype.consumeAmmo = function(ammoTypeId, count = 1) {
  if (!this.state.inventory[ammoTypeId] || this.state.inventory[ammoTypeId].qty < count) {
    errorHandler.handleError(new AshfallError(
      'INSUFFICIENT_AMMO',
      `Not enough ${ammoTypeId}`,
      { ammoType: ammoTypeId, needed: count, have: this.getAmmoCount(ammoTypeId) },
      'warn'
    ));
    return false;
  }
  
  this.state.inventory[ammoTypeId].qty -= count;
  if (this.state.inventory[ammoTypeId].qty <= 0) {
    delete this.state.inventory[ammoTypeId];
  }
  this.emit('ammoConsumed', { ammoType: ammoTypeId, count });
  return true;
};

GameEngine.prototype.checkAmmoRequirement = function(weaponTypeId) {
  const weaponType = WEAPON_TYPES[weaponTypeId];
  if (!weaponType || !weaponType.ammoType) return true; // Not a ranged weapon
  
  const ammoCount = this.getAmmoCount(weaponType.ammoType);
  if (ammoCount <= 0) {
    errorHandler.handleError(new AshfallError(
      'OUT_OF_AMMO',
      `Out of ${weaponType.ammoType}. Equip a melee weapon or get more ammo.`,
      { weaponType: weaponTypeId, ammoType: weaponType.ammoType },
      'warn'
    ));
    return false;
  }
  
  return true;
};

// ── QUALITY SYSTEM FOR CRAFTING ────────────────────────────────
GameEngine.prototype.craftWithQuality = function(recipeId, skillId) {
  return tryOperation(() => {
    const skill = GAME_DATA.skills[skillId];
    if (!skill) throw new AshfallError('SKILL_NOT_FOUND', 'Skill does not exist', { skillId }, 'warn');
    
    const skillLevel = this.getSkillLevel(skillId);
    const qualityChances = SKILL_SYSTEMS.getQualityTierChance(skillLevel);
    
    // Determine quality tier
    let quality = 'normal';
    const roll = Math.random();
    let cumulative = 0;
    
    for (const [tier, chance] of Object.entries(qualityChances)) {
      cumulative += chance;
      if (roll < cumulative) {
        quality = tier;
        break;
      }
    }
    
    const qualityBonus = QUALITY_TIERS[quality].bonus;
    
    this.emit('craftQuality', {
      recipe: recipeId,
      quality: quality,
      bonus: qualityBonus,
      skill: skillId
    });
    
    return {
      quality: quality,
      bonus: qualityBonus,
      name: QUALITY_TIERS[quality].name
    };
  }, 'CRAFT_WITH_QUALITY_FAILED', { recipeId, skillId });
};

// ── COOKING SYSTEM ENHANCEMENTS ────────────────────────────────
GameEngine.prototype.cookMeal = function(itemId, skillLevel) {
  const qualityResult = this.craftWithQuality(itemId, 'cooking');
  if (!qualityResult) return null;
  
  const cookedFood = {
    id: itemId,
    quality: qualityResult.quality,
    freshness: 1.0,
    cookedAt: Date.now(),
    degradationStage: 0
  };
  
  return cookedFood;
};

GameEngine.prototype.tickFoodDegradation = function() {
  try {
    if (typeof COOKING_IMPROVEMENTS === 'undefined' || !COOKING_IMPROVEMENTS.foodDegradation) return;
    
    const timePerStage = COOKING_IMPROVEMENTS.degradationTimeMinutes * 60 * 1000;
  const now = Date.now();
  
  for (const [itemId, item] of Object.entries(this.state.inventory)) {
    if (item.cookedAt && GAME_DATA.items[itemId]?.type === 'food') {
      const timeElapsed = now - item.cookedAt;
      const stage = Math.floor(timeElapsed / timePerStage);
      
      if (stage >= 4) {
        // Food is completely spoiled
        delete this.state.inventory[itemId];
      } else if (stage !== item.degradationStage) {
        item.degradationStage = stage;
        this.emit('foodDegraded', { item: itemId, stage });
      }
    }
  }
  } catch (e) {
    // Silently fail if COOKING_IMPROVEMENTS not ready
  }
};

// ── HERBLORE QUALITY & FAILURE ────────────────────────────────
GameEngine.prototype.brewPotion = function(recipeId, herbloreLevel) {
  return tryOperation(() => {
    const failureChance = HERBLORE_IMPROVEMENTS.getFailureChance(herbloreLevel);
    
    if (Math.random() < failureChance) {
      this.emit('potionBrewed', {
        recipe: recipeId,
        quality: 'failed',
        effect: 0.5 // Failed potion = 50% effect
      });
      return { quality: 'failed', effectiveness: 0.5 };
    }
    
    const qualityChances = HERBLORE_IMPROVEMENTS.qualityChances(herbloreLevel);
    let quality = 'normal';
    let effectiveness = 1.0;
    
    const roll = Math.random();
    if (roll < qualityChances.perfect) {
      quality = 'perfect';
      effectiveness = 2.0;
    } else if (roll < qualityChances.perfect + qualityChances.enhanced) {
      quality = 'enhanced';
      effectiveness = 1.5;
    }
    
    this.emit('potionBrewed', {
      recipe: recipeId,
      quality: quality,
      effect: effectiveness
    });
    
    return { quality, effectiveness };
  }, 'POTION_BREWING_FAILED', { recipeId, herbloreLevel });
};

// ── FARMING IMPROVEMENTS ───────────────────────────────────────
GameEngine.prototype.plantCrop = function(plotId, cropId, farmingLevel) {
  const crop = FARMING_IMPROVEMENTS.cropVarieties.find(c => c.id === cropId);
  if (!crop) {
    errorHandler.handleError(new AshfallError(
      'CROP_NOT_FOUND',
      'Crop type does not exist',
      { cropId },
      'warn'
    ));
    return false;
  }
  
  if (farmingLevel < crop.level) {
    errorHandler.handleError(new AshfallError(
      'CROP_LEVEL_INSUFFICIENT',
      `Farming level ${crop.level} required`,
      { crop: cropId, required: crop.level, current: farmingLevel },
      'warn'
    ));
    return false;
  }
  
  this.state.farming.plots[plotId] = {
    cropId: cropId,
    plantedAt: Date.now(),
    growthTime: crop.growTime * 60 * 1000, // Convert minutes to ms
    diseased: false,
    yield: crop.yield
  };
  
  this.emit('cropPlanted', { plot: plotId, crop: cropId });
  return true;
};

GameEngine.prototype.checkCropDisease = function(plotId) {
  if (!FARMING_IMPROVEMENTS.diseaseSystem.enabled) return false;
  
  const plot = this.state.farming.plots[plotId];
  if (!plot) return false;
  
  if (Math.random() < FARMING_IMPROVEMENTS.diseaseSystem.diseaseChance) {
    plot.diseased = true;
    this.emit('cropDiseased', { plot: plotId });
    return true;
  }
  
  return false;
};

// ── SUMMONING FAMILIAR SYSTEM ──────────────────────────────────
GameEngine.prototype.summonFamiliar = function(familiarId, summoningLevel) {
  const familiar = SUMMONING_IMPROVEMENTS.familiarTypes.find(f => f.id === familiarId);
  if (!familiar) {
    errorHandler.handleError(new AshfallError(
      'FAMILIAR_NOT_FOUND',
      'Familiar type does not exist',
      { familiarId },
      'warn'
    ));
    return false;
  }
  
  if (summoningLevel < familiar.level) {
    errorHandler.handleError(new AshfallError(
      'SUMMONING_LEVEL_INSUFFICIENT',
      `Summoning level ${familiar.level} required`,
      { familiar: familiarId, required: familiar.level, current: summoningLevel },
      'warn'
    ));
    return false;
  }
  
  this.state.combat.familiar = {
    id: familiarId,
    name: familiar.name,
    hp: familiar.level * 3,
    maxHp: familiar.level * 3,
    combatStyle: familiar.combat,
    special: familiar.special,
    summonedAt: Date.now()
  };
  
  this.emit('familiarSummoned', { familiar: familiarId });
  return true;
};

// ── TICK INTEGRATION ───────────────────────────────────────────
// Hook into main engine tick
const originalEngineTick = GameEngine.prototype.tick;
GameEngine.prototype.tick = function(now, prevNow) {
  const result = originalEngineTick.call(this, now, prevNow);
  
  // New systems tick
  this.tickMana(now - prevNow);
  this.tickFoodDegradation();
  
  return result;
};

// ── LOGGING ────────────────────────────────────────────────────
if (window._ASHFALL_DEBUG) {
  console.log('[Ashfall] Skills Integration Layer loaded');
  console.log('  Mana system integrated: ✓');
  console.log('  Weapon system integrated: ✓');
  console.log('  Ammo system integrated: ✓');
  console.log('  Quality crafting integrated: ✓');
  console.log('  Spell casting ready: ✓');
  console.log('  Familiar summoning ready: ✓');
}
