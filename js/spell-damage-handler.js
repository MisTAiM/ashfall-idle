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

  // Initialize spell damage listener — poll for engine (game) with hard cap
  let _spellDmgRetries = 0;
  const MAX_RETRIES = 50; // 5 seconds max
  function initSpellDamageListener() {
    // Engine is exposed as 'game' (const game = new GameEngine() in engine.js)
    const eng = window.game;
    if (!eng) {
      if (++_spellDmgRetries > MAX_RETRIES) {
        console.warn('[Spell Damage] Engine never became ready — giving up.');
        return;
      }
      setTimeout(initSpellDamageListener, 100);
      return;
    }

    console.log('[Spell Damage] Handler initialized - listening for spellCast events');

    // Listen for spell cast events
    eng.on('spellCast', function handleSpellCast(event) {
        try {
          console.log('[Spell Damage] Spell cast event received:', event.spell);

          // Get current enemy being fought
          const currentEnemy = eng.state.currentEnemy;
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
            eng.emit('damageDealt', {
              source: 'spell',
              spellId: spellId,
              damage: actualDamage,
              target: currentEnemy.id
            });

            // Check if enemy died
            if (currentEnemy.hp <= 0) {
              console.log('[Spell Damage] Enemy defeated by spell!');
              eng.emit('enemyDefeated', {
                enemy: currentEnemy,
                killedBy: 'spell',
                spell: spellId
              });
            }
          }

          // ━━━ HEALING SPELLS ━━━
          if (spell.heals) {
            const healingRolled = rollDamage(spell.heals);
            const playerMaxHp = eng.state.stats.hitpoints?.current || eng.state.stats.hitpoints || 100;
            const playerCurrentHp = eng.state.hp || playerMaxHp;

            const actualHealing = Math.min(healingRolled, playerMaxHp - playerCurrentHp);
            console.log('[Spell Damage] ' + spell.name + ' healed for ' + actualHealing + ' HP');

            eng.state.hp = (playerCurrentHp || 0) + actualHealing;

            eng.emit('playerHealed', {
              spellId: spellId,
              healing: actualHealing
            });
          }

          // ━━━ BUFF SPELLS ━━━
          if (spell.buffStat && spell.buffDuration) {
            console.log('[Spell Damage] ' + spell.name + ' applied buff: ' + spell.buffStat);

            // Create buff
            const buffId = 'spell_' + spellId + '_' + Date.now();
            if (!eng.state.buffs) eng.state.buffs = [];

            eng.state.buffs.push({
              id: buffId,
              spell: spellId,
              name: spell.name,
              stat: spell.buffStat,
              multiplier: spell.buffMultiplier,
              reduction: spell.buffReduction,
              duration: spell.buffDuration,
              startTime: Date.now()
            });

            eng.emit('buffApplied', {
              spell: spellId,
              buffStat: spell.buffStat
            });
          }

          // ━━━ STUN/CC SPELLS ━━━
          if (spell.stun) {
            console.log('[Spell Damage] ' + spell.name + ' stunned enemy for ' + spell.stun + 'ms');
            currentEnemy.stunned = true;
            currentEnemy.stunEnd = Date.now() + spell.stun;

            eng.emit('enemyStunned', {
              enemy: currentEnemy.id,
              duration: spell.stun
            });
          }

        } catch (error) {
          console.error('[Spell Damage] Error handling spell cast:', error);
        }
      });

  }
  setTimeout(initSpellDamageListener, 200);

  console.log('[Spell Damage Handler] Script loaded');

})();
