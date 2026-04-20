# ASHFALL IDLE - Deep Audit Bug Report

## CRITICAL BUGS

### BUG 1: TWO shiftAlignment() methods - alignment system BROKEN
- Line 1297: `shiftAlignment(monsterAxis)` - OLD version, uses {good,evil,lawful,chaotic} 
- Line 1680: `shiftAlignment(direction, amount)` - NEW version, uses {moral,order}
- In JS classes, the SECOND definition OVERWRITES the first
- Line 715: `this.shiftAlignment(monster.alignment)` passes 'CE' to the NEW function
  which expects 'good'/'evil'/'lawful'/'chaotic' - DOES NOTHING
- recomputeAlignment() at line 1307 uses OLD format - DEAD CODE
- FIX: Remove old function (1297-1305), remove dead call (715), remove dead recomputeAlignment

### BUG 2: alignmentPoints migration conflict
- Line 101: `s.alignmentPoints = { good:0, evil:0, lawful:0, chaotic:0 }` (OLD format)
- Line 132: `s.alignmentPoints = { moral:0, order:0 }` (NEW format, never fires)
- The active shiftAlignment (1680) reads `ap.moral` and `ap.order`
- For ANY existing save, these keys DON'T EXIST → alignment shifts are ALL broken
- FIX: Migration must ensure {moral,order} exists, convert old format

### BUG 3: Auto-eat only at tick START
- Line 433: autoEat check runs BEFORE monster attack
- If monster brings you below 40%, you don't eat until next tick
- FIX: Also check after monster attack in tickCombat

### BUG 4: XP notification wrong for ranged modes
- Line 637: Hardcodes `xp*0.8` for ALL ranged notifications
- But actual XP varies: accurate=0.9 atk, rapid=1.0, longrange=0.5/0.5
- FIX: Match notification to actual distribution

### BUG 5: activePrayers may crash multi-mob
- Line 598: `this.state.activePrayers.length === 0` 
- If activePrayers is undefined/null → TypeError crash
- FIX: Add null check

### BUG 6: monsterAttack has no miss text
- playerAttack emits miss text, monsterAttack doesn't emit anything on miss
- Not critical but inconsistent
