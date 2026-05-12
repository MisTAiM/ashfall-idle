// ================================================================
// ASHFALL IDLE — MAGIC SYSTEM TESTING CHECKLIST
// Run through these steps in-game to verify balance
// ================================================================

/**
 * PRE-FLIGHT CHECKLIST
 * [ ] Verify all files loaded (check console for errors)
 * [ ] Check browser console has no red errors
 * [ ] Mana bar renders on combat page
 * [ ] RuneSpellbook component shows
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PHASE 1: ESSENCE DROP TESTING (15 minutes)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TEST_PHASE_1 = `
OBJECTIVE: Verify essence drops are reasonable and accessible

STEP 1: Check Rat Drops
├─ Kill 20 rats (track time: ___ min)
├─ Count essence_of_mind drops: ___ (expect ~3)
├─ Other drops: bones, leather ___
├─ Feeling: ⬜ Too rare | ✓ Good | ⬜ Too common
└─ VERDICT: ___

STEP 2: Check Goblin Drops
├─ Kill 20 goblins (track time: ___ min)
├─ Count essence_of_air drops: ___ (expect ~3-4)
├─ Note any differences from rats
├─ Feeling: ⬜ Too rare | ✓ Good | ⬜ Too common
└─ VERDICT: ___

STEP 3: Check Drop Rarity by Monster
├─ Essences per 10 kills:
│  ├─ Rat: ___ (expect 1-2)
│  ├─ Goblin: ___ (expect 2)
│  ├─ Skeleton: ___ (expect 2)
│  └─ Wolf: ___ (expect 2-3)
└─ VERDICT: Drops feel ⬜ Too grindy | ✓ Balanced | ⬜ Too easy

PASS/FAIL: ✓ PASS if essence flow feels natural and not grindy
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PHASE 2: RUNE CRAFTING TESTING (10 minutes)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TEST_PHASE_2 = `
OBJECTIVE: Verify rune crafting is accessible and intuitive

STEP 1: Craft Mind Rune
├─ Collect 5 essence_of_mind (time: ___ min)
├─ Open Magic skill page
├─ Find "Craft Rune" option
├─ Craft Mind Rune (time cost: ___ sec)
├─ Check inventory: rune_mind count = ___
├─ XP gained: ___ magic XP
└─ VERDICT: Smooth? ⬜ No | ✓ Yes

STEP 2: Craft Air Rune
├─ Collect 5 essence_of_air
├─ Craft rune (repeat step 1)
├─ Check inventory: rune_air count = ___
└─ VERDICT: Same UX? ✓ Yes | ⬜ Confusing

STEP 3: Try Crafting Without Essences
├─ Go to craft rune UI
├─ Try crafting with 0 essences
├─ Error message clear? ✓ Yes | ⬜ Confusing
├─ Message: "_______________"
└─ VERDICT: Good feedback? ✓ Yes | ⬜ No

PASS/FAIL: ✓ PASS if crafting feels natural and error messages help
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PHASE 3: SPELL CASTING & DAMAGE TESTING (20 minutes)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TEST_PHASE_3 = `
OBJECTIVE: Verify spells cast, consume mana/runes, and deal damage

STEP 1: Cast First Spell (Spark)
├─ Have: rune_mind x1, mana ≥8
├─ Go to combat page
├─ Select Magic combat style
├─ Open RuneSpellbook
├─ See Spark spell in list? ✓ Yes | ⬜ No
├─ Click "Cast Spark"
├─ Check inventory: rune_mind now = ___ (expect -1)
├─ Check mana bar: was ___ now ___ (expect -8)
├─ Check enemy HP: before ___ after ___ (expect damage taken)
├─ Damage dealt: ___ (expect 3-8)
├─ Magic XP gained: ___ (expect +15)
└─ VERDICT: ✓ PASS | ⬜ FAIL (issue: _______)

STEP 2: Cast Second Spell (Fireball)
├─ Get 3 runes: rune_mind (1), rune_fire (2)
├─ Have mana ≥16
├─ Cast Fireball
├─ Check results:
│  ├─ Runes consumed: mind -1, fire -2? ✓ Yes
│  ├─ Mana consumed: -16? ✓ Yes
│  ├─ Damage dealt: 5-15? ✓ Yes (actual: ___)
│  └─ XP gained: +40? ✓ Yes
└─ VERDICT: ✓ PASS | ⬜ FAIL (issue: _______)

STEP 3: Test Mana Regeneration
├─ Cast spell until mana depleted
├─ Wait 10 seconds (watching mana bar)
├─ Mana regenerates? ✓ Yes (rate: +___ per sec)
├─ Can cast again? ✓ Yes
└─ VERDICT: Regen feels: ⬜ Too slow | ✓ Good | ⬜ Too fast

STEP 4: Test Out-of-Mana Error
├─ Drain all mana
├─ Try to cast (need 8 mana, have 0)
├─ Error message shows? ✓ Yes | ⬜ No
├─ Message: "_______________"
├─ Spell doesn't cast? ✓ Correct | ⬜ FAIL
└─ VERDICT: Error handling good? ✓ Yes

PASS/FAIL: ✓ PASS if all 4 substeps pass
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PHASE 4: DAMAGE BALANCE TESTING (15 minutes)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TEST_PHASE_4 = `
OBJECTIVE: Verify spell damage is balanced vs melee and feels useful

STEP 1: Damage Comparison
├─ Kill enemy with melee (no spells)
│  ├─ Time to kill: ___ sec
│  ├─ Avg damage per hit: ___
│  └─ Total damage dealt: ___
├─ Kill same enemy with Spark spam
│  ├─ Casts needed: ___
│  ├─ Time to kill: ___ sec
│  ├─ Mana spent: ___
│  └─ Total damage dealt: ___
├─ Comparison:
│  ├─ Spell DPS vs Melee DPS: ___
│  └─ Feel: ⬜ Spells weak | ✓ Balanced | ⬜ Spells OP
└─ VERDICT: ✓ Good | ⬜ Needs buff | ⬜ Needs nerf

STEP 2: Healing Spell Test
├─ Take damage in combat
├─ Get HP down to 50%
├─ Cast Heal spell
├─ HP restored by: ___ (expect 1-20)
├─ Feel useful? ✓ Yes | ⬜ Too weak | ⬜ Too strong
└─ VERDICT: Healing balance okay? ✓ Yes

STEP 3: Stun Effect Test (Ice Bolt)
├─ Craft rune_water x2, rune_mind x1
├─ Cast Ice Bolt at enemy
├─ Enemy stops attacking? ✓ Yes | ⬜ No
├─ Duration feels right? ✓ Yes | ⬜ Too long | ⬜ Too short
└─ VERDICT: CC mechanic working? ✓ Yes

PASS/FAIL: ✓ PASS if damage feels useful and not overpowered
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PHASE 5: PROGRESSION TESTING (30 minutes)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TEST_PHASE_5 = `
OBJECTIVE: Verify progression feels natural (not grindy or too easy)

STEP 1: Time to First Spell
├─ Fresh account simulation
├─ Kill rats until: rune_mind x1, mana ≥8
├─ Time elapsed: ___ min
├─ Feeling: ⬜ Too long | ✓ Good (10-15 min) | ⬜ Too fast
└─ VERDICT: Entry barrier okay? ✓ Yes

STEP 2: Time to Second Spell
├─ Get runes for Fireball (rune_mind x1, rune_fire x2)
├─ From your current essences, time to craft: ___ min
├─ Feeling: ⬜ Too long | ✓ Good | ⬜ Too fast
└─ VERDICT: ✓ PASS

STEP 3: Multiple Spell Access
├─ At current magic level (___ XP), available spells:
│  └─ List: ________________
├─ Count: ___ spells accessible
├─ Feeling: ⬜ Not enough choice | ✓ Good variety | ⬜ Overwhelming
└─ VERDICT: ✓ PASS

STEP 4: Essence Variety Check
├─ Kill 50 random monsters over 20 minutes
├─ Essence types collected:
│  ├─ essence_of_mind: ___
│  ├─ essence_of_air: ___
│  ├─ essence_of_water: ___
│  ├─ essence_of_fire: ___
│  └─ Others: ________
├─ Variety feels: ⬜ Boring (same drop) | ✓ Good | ⬜ Confusing
└─ VERDICT: ✓ PASS if 3+ essence types

PASS/FAIL: ✓ PASS if progression feels smooth without long walls
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FINAL VERDICT FORM
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FINAL_VERDICT = `
════════════════════════════════════════════════════════════════════
MAGIC SYSTEM TESTING COMPLETE
════════════════════════════════════════════════════════════════════

PHASE RESULTS:
  Phase 1 (Essences):           ⬜ FAIL | ✓ PASS
  Phase 2 (Rune Crafting):      ⬜ FAIL | ✓ PASS
  Phase 3 (Spell Casting):      ⬜ FAIL | ✓ PASS
  Phase 4 (Damage Balance):     ⬜ FAIL | ✓ PASS
  Phase 5 (Progression):        ⬜ FAIL | ✓ PASS

OVERALL RESULT:
  ⬜ NOT READY - Needs fixes: _________________
  ⬜ READY WITH CHANGES - Changes: _________________
  ✓ READY - System balanced and working

NOTES & FEEDBACK:
  ________________________________________________________________________
  ________________________________________________________________________
  ________________________________________________________________________

TESTER: ________________  DATE: ________________
════════════════════════════════════════════════════════════════════
`;

console.log(TEST_PHASE_1);
console.log(TEST_PHASE_2);
console.log(TEST_PHASE_3);
console.log(TEST_PHASE_4);
console.log(TEST_PHASE_5);
console.log(FINAL_VERDICT);
