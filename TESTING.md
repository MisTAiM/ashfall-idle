# ASHFALL IDLE — PRE-DEPLOYMENT TESTING PROTOCOL

## Before Every Push

### 1. Syntax Validation
```bash
for f in js/*.js; do node --check "$f" && echo "$f OK" || echo "FAIL: $f"; done
```
All 15 JS files must pass. Zero tolerance.

### 2. Known Regression Checks
- [ ] `migrateSave()` returns `s` at the end (line ~170 engine.js)
- [ ] `stopCombat()` clears `_sessionLoot` and `_sessionKills`
- [ ] Protection prayers are mutually exclusive in `activatePrayer()`
- [ ] `consumeRunes()` checks `providesRune` on equipped weapon
- [ ] `eatFood()` emits `foodChanged`
- [ ] `sellItem()` emits `bankChanged`
- [ ] Fight Cave `stopCombat` intercept routes to `fleeFightCave()`
- [ ] Alignment uses `{moral, order}` format, not old `{good, evil, lawful, chaotic}`
- [ ] Auto-eat fires both before AND after monster attack in `tickCombat()`

### 3. Fight Cave Integrity
- [ ] Wave generation produces exactly 63 waves
- [ ] Wave 63 contains only `tztok_jad`
- [ ] Jad telegraph cycles: charging → telegraph → awaiting_input → resolving
- [ ] Healers spawn at 50% Jad HP
- [ ] Fire Cape removed from Phoenix drops
- [ ] Global chat broadcasts on enter/death/completion/surrender

### 4. Live Site Verification (after deploy)
```bash
# All files return 200
for f in data items-expand items-combat items-world items-mega sprites sprites-skills systems engine fight-cave fight-cave-ui admin firebase-config online ui; do
  curl -s -o /dev/null -w "${f}.js: %{http_code}\n" "https://ashfall-idle.vercel.app/js/${f}.js"
done

# No plain text admin UID
curl -s "https://ashfall-idle.vercel.app/js/firebase-config.js" | grep -c "ndLiweJR"
# Must be 0
```

### 5. Architecture Rules
- New features use mixin pattern (separate file, patch prototype)
- All combat renders through `renderCombatPage()` in ui.js
- Bank-modifying actions emit `bankChanged`
- Food-modifying actions emit `foodChanged`
- Equipment changes emit `equipmentChanged`
- No inline `onclick` for Fight Cave buttons — use `data-fc-action`
- Admin panel checks use hashed UID via `isAdmin()` global function

### 6. File Architecture
```
js/data.js          — Game data, monsters, skills, prayers, spells
js/items-*.js       — Item definitions (4 files, 558+ items)
js/sprites.js       — Monster SVG art
js/sprites-skills.js— Skill page SVG art
js/systems.js       — Crafting, enchanting subsystems
js/engine.js        — Core game engine (GameEngine class)
js/firebase-config.js— Firebase config + admin hash verification
js/online.js        — Auth, chat, cloud saves, social features
js/ui.js            — UI class, all page rendering
js/fight-cave.js    — Fight Cave engine mixin (monsters, waves, Jad)
js/fight-cave-ui.js — Fight Cave entry page + event delegation
js/admin.js         — Admin panel (sidebar injection, 8 tabs)
```

### 7. Critical Constants
- Admin hash: `9460f531720fa1addfb91877a949862bfa0c33fb87836d542c1c2853c40719fb`
- Vercel project: `prj_FFGTVpefrKu24zpcLWykMQYLykb2`
- GitHub repo ID: `1211322672`
- Firebase project: `ashfall-idle`
- Max prayers: 2 (only 1 protection prayer allowed)
- Food bag slots: 4 types, 28 per type
- Potion belt slots: 4, 5 per slot
- Fight Cave waves: 63 (skew binary generation)
