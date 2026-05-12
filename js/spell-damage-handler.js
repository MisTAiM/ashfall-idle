// ================================================================
// ASHFALL IDLE — SPELL DAMAGE HANDLER
// Listens to spellCast event and applies damage to current enemy
// ================================================================

(function() {
  'use strict';

  // Helper: roll dice damage [min, max]
  function rollDamage(minDmg, maxDmg) {
    if (Array.isArray(minDmg)) {
      return Math.floor(Math.random() * (minDmg[1] - minDmg[0] + 1)) + minDmg[0];
    }
    return minDmg;
  }

  // Initialize spell damage listener when engine is ready
  window.addEventListener('DOMContentLoaded', function initSpellDamageListener() {
    // Wait for engine to be created (small delay)
    setTimeout(() => {
      if (!window.engine) {
        console.warn('[Spell Damage] Engine not ready, retrying...');
        initSpellDamageListener();
        return;
      }

      console.log('[Spell Damage] Handler initialized - listening for spellCast events');

      // Listen for spell cast events
      engine.on('spellCast', function handleSpellCast(event) {
        try {
          console.log('[Spell Damage] Spell cast event received:', event.spell);

          // Get current enemy being fought
          const currentEnemy = engine.state.currentEnemy;
          if (!currentEnemy) {
            console.log('[Spell Damage] No current enemy - spell has no effect');
            return;
          }

          // Get spell definition
          const spellId = event.spell;
          const SPELL_RECIPES = window.SPELL_RECIPES || {};
          const spell = SPELL_RECIPES[spellId];

          if (!spell) {
            console.warn('[Spell Damage] Spell not found:', spellId);
            return;
          }

          // ━━━ DAMAGE SPELLS ━━━
          if (spell.damage) {
            const damageRolled = rollDamage(spell.damage);
            const actualDamage = Math.max(1, damageRolled); // minimum 1 damage

            console.log('[Spell Damage] ' + spell.name + ' hit for ' + actualDamage + ' damage');
            console.log('[Spell Damage] Enemy HP before:', currentEnemy.hp);

            // Apply damage to enemy
            currentEnemy.hp -= actualDamage;
            console.log('[Spell Damage] Enemy HP after:', currentEnemy.hp);

            // Emit damage event for UI updates
            engine.emit('damageDealt', {
              source: 'spell',
              spellId: spellId,
              damage: actualDamage,
              target: currentEnemy.id
            });

            // Check if enemy died
            if (currentEnemy.hp <= 0) {
              console.log('[Spell Damage] Enemy defeated by spell!');
              engine.emit('enemyDefeated', {
                enemy: currentEnemy,
                killedBy: 'spell',
                spell: spellId
              });
            }
          }

          // ━━━ HEALING SPELLS ━━━
          if (spell.heals) {
            const healingRolled = rollDamage(spell.heals);
            const playerMaxHp = engine.state.stats.hitpoints?.current || engine.state.stats.hitpoints || 100;
            const playerCurrentHp = engine.state.hp || playerMaxHp;

            const actualHealing = Math.min(healingRolled, playerMaxHp - playerCurrentHp);
            console.log('[Spell Damage] ' + spell.name + ' healed for ' + actualHealing + ' HP');

            engine.state.hp = (playerCurrentHp || 0) + actualHealing;

            engine.emit('playerHealed', {
              spellId: spellId,
              healing: actualHealing
            });
          }

          // ━━━ BUFF SPELLS ━━━
          if (spell.buffStat && spell.buffDuration) {
            console.log('[Spell Damage] ' + spell.name + ' applied buff: ' + spell.buffStat);

            // Create buff
            const buffId = 'spell_' + spellId + '_' + Date.now();
            if (!engine.state.buffs) engine.state.buffs = [];

            engine.state.buffs.push({
              id: buffId,
              spell: spellId,
              name: spell.name,
              stat: spell.buffStat,
              multiplier: spell.buffMultiplier,
              reduction: spell.buffReduction,
              duration: spell.buffDuration,
              startTime: Date.now()
            });

            engine.emit('buffApplied', {
              spell: spellId,
              buffStat: spell.buffStat
            });
          }

          // ━━━ STUN/CC SPELLS ━━━
          if (spell.stun) {
            console.log('[Spell Damage] ' + spell.name + ' stunned enemy for ' + spell.stun + 'ms');
            currentEnemy.stunned = true;
            currentEnemy.stunEnd = Date.now() + spell.stun;

            engine.emit('enemyStunned', {
              enemy: currentEnemy.id,
              duration: spell.stun
            });
          }

        } catch (error) {
          console.error('[Spell Damage] Error handling spell cast:', error);
        }
      });

    }, 100);
  });

  console.log('[Spell Damage Handler] Script loaded');

})();
