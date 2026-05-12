// ================================================================
// ASHFALL IDLE — MAGIC SYSTEM QUICK START
// How to unlock and use spells
// ================================================================

/**
 * THE MAGIC LOOP (Simple)
 * 
 *   1. HUNT       →  2. COLLECT      →  3. CRAFT    →  4. CAST
 *   Kill monsters    Gather essences     Make runes     Use spells
 *        ↓                ↓                  ↓            ↓
 *    Rats drop       Mind Essence      Mind Rune      Spark spell
 *    (10-15 min)     (need 5)           (8 mana)       (3-8 damage)
 */

QUICK_START = `
════════════════════════════════════════════════════════════════════
YOUR FIRST SPELL (15 minutes to cast)
════════════════════════════════════════════════════════════════════

STEP 1: HUNT RATS (5-10 min)
  └─ Go to Combat → Fight Rats
  └─ Look for "essence_of_mind" drops
  └─ Need: 5 essences minimum
  └─ Tip: Kill 20 rats, get ~3-4 essences

STEP 2: CRAFT A RUNE (2-3 min)
  └─ Go to Magic skill page
  └─ Find "Craft Rune" button
  └─ Select "Mind Rune"
  └─ Requires: 5 essence_of_mind (✓ you have them!)
  └─ Click craft → wait 2 seconds
  └─ Now you own 1x Mind Rune

STEP 3: CAST YOUR FIRST SPELL (1 min)
  └─ Go back to Combat
  └─ Select "Magic" combat style (top of page)
  └─ Start fighting a new enemy
  └─ Look for "RuneSpellbook" panel
  └─ You should see "Spark" spell
  └─ Click [CAST SPARK]
  └─ BOOM! Enemy takes 3-8 damage!

CONGRATULATIONS! You cast your first spell!

════════════════════════════════════════════════════════════════════
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPELL PROGRESSION TREE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SPELL_TREE = `
MAGIC LEVEL 1 (START HERE)
  └─ SPARK (8 mana, 3-8 damage)
     └─ Rune: Mind Rune x1
     └─ Monster: Rats (easy to farm)
     └─ Damage: Low, but works!

MAGIC LEVEL 5-10
  ├─ AIR SPELLS (when you farm goblins)
  │  └─ Access to air essence drops
  └─ HEALING (when you get water essence)
     └─ HEAL spell (15 mana, restores 1-20 HP)

MAGIC LEVEL 15-20
  ├─ FIREBALL (16 mana, 5-15 damage) ⭐ POWER SPIKE
  │  └─ Rune: Mind + Fire x2
  │  └─ Much stronger than Spark!
  └─ BUFF SPELLS available

MAGIC LEVEL 25-35
  ├─ ICE BOLT (15 mana, 4-12 damage + STUN)
  │  └─ Not pure damage, but freezes enemies!
  └─ SUPPORT SPELLS (defense, strength buffs)

MAGIC LEVEL 40-60
  └─ METEOR STRIKE (35 mana, 8-20 damage) 🔥 ULTIMATE
     └─ Rune: Mind + Fire x2 + Chaos x1
     └─ Highest damage spell, rare materials

════════════════════════════════════════════════════════════════════
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ESSENCE FARMING GUIDE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FARMING_GUIDE = `
WANT ESSENCE_OF_MIND? Kill:
  ├─ Rat (10% drop) — easiest, fastest
  ├─ Chicken (10% drop) — very easy
  └─ Goblin (uncommon)

WANT ESSENCE_OF_AIR? Kill:
  ├─ Goblin (18% drop) — good source
  └─ Skeleton (uncommon)

WANT ESSENCE_OF_WATER? Kill:
  ├─ Skeleton (20% drop) — consistent source
  ├─ Bandit (uncommon)
  └─ Wolf (uncommon)

WANT ESSENCE_OF_FIRE? Kill:
  ├─ Wolf (25% drop) — best source
  ├─ Troll (uncommon)
  └─ Dark Mage (uncommon)

WANT ESSENCE_OF_BODY? Kill:
  ├─ Troll (28% drop) — primary source
  ├─ Ogre (uncommon)
  └─ Shadow Archer (uncommon)

WANT ESSENCE_OF_CHAOS? Kill:
  ├─ Dark Mage (30% drop) — main source
  └─ Troll (rare)

WANT ESSENCE_OF_ANCIENT? Kill:
  └─ Ogre (25% drop) — rarest, hardest to farm
  
════════════════════════════════════════════════════════════════════
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RESOURCE MANAGEMENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RESOURCE_MANAGEMENT = `
MANA
  ├─ Regenerates: 1 per second (in or out of combat)
  ├─ Max mana: 100
  ├─ Management: You need to WAIT between big spells
  └─ Pro tip: Cast small spells (Spark) while mana regenerates

RUNES
  ├─ Consumed: Each spell uses 1-4 runes (gone forever)
  ├─ Crafting cost: Essences (limited)
  ├─ Management: Farm essences, craft runes in batches
  └─ Pro tip: Keep emergency runes for healing spells

ESSENCES
  ├─ Limited: Drop from monsters only
  ├─ Never respawn: Use them or stockpile
  ├─ Management: Farm high-drop-rate monsters
  └─ Pro tip: Focus on 1-2 essence types per session

BALANCE RULE: Can't spam infinite spells
  └─ Essences ← Limited
  └─ Runes ← Limited (depend on essences)
  └─ Mana ← Limited (regenerates, but slowly)

════════════════════════════════════════════════════════════════════
`;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TROUBLESHOOTING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TROUBLESHOOTING = `
Q: "Why can't I see the RuneSpellbook?"
A: 1) Check you're in Magic combat style
   2) Check mana bar is visible (should be blue)
   3) Try switching styles off and on

Q: "Why doesn't Spark show up?"
A: You need 1x Mind Rune in inventory
   → Kill rats → collect essence_of_mind → craft rune

Q: "Spell did nothing to enemy!"
A: 1) Check mana bar: does it go down?
   2) Check runes: did they get consumed?
   3) Check enemy HP: did it decrease?
   → If all yes, it worked! Damage might be small (3-8)

Q: "Essences aren't dropping!"
A: Drop rates are 10-30% (not 100%)
   → Kill 20+ monsters, should see 2-6 drops

Q: "Can I cast infinitely?"
A: No! Limited by:
   1) Essences (farm monsters)
   2) Runes (craft from essences)
   3) Mana (regenerates slowly)
   → This is intentional balance!

Q: "Healing is useless, damage is too low!"
A: Spark does 3-8 damage per cast (8 mana)
   → That's ~0.5 damage per mana
   → Similar to melee damage per resource
   → Higher spells (Fireball) do much more

════════════════════════════════════════════════════════════════════
`;

console.log(QUICK_START);
console.log(SPELL_TREE);
console.log(FARMING_GUIDE);
console.log(RESOURCE_MANAGEMENT);
console.log(TROUBLESHOOTING);
