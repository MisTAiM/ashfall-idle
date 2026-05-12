# Ashfall Idle — Raids Content Expansion v10.0

**Release Date:** May 12, 2026  
**Firebase Tier:** Blaze (Multiplayer Infrastructure Ready)  
**Total New Content:** 20+ items, 5 raid potions, new recipes & achievements

---

## ✅ WHAT'S NEW

### 🏛️ CHAMBERS OF ASH — COMPLETE DROP TABLES

All 5 bosses now have signature drops + shared raid loot. Farm for specific items or collect materials.

| Boss | Unique Drop | Signature Item | Best For |
|------|-------------|---|----------|
| **Shambling Mound** | shambling_seeds | Verdant Staff (epic staff) | Magic training, herb items |
| **Ash Vanguard** | warrior_blood | Vanguard Armor Set (epic) | Melee armor, warrior builds |
| **Tekton Forgeborn** | forge_dust | Forgemaster's Hammer (LEGENDARY) | Smithing/crafting boost |
| **Ice Weaver** | crystalline_shard | Frozen Sceptre (LEGENDARY staff) | Magic damage, ice affinity |
| **Great Olm** | olm_eye, olm_heart | Primordial Staff (LEGENDARY) | Endgame magic, ancient affinity |

#### Drop Table Example (Shambling Mound):
```
Common Drops: 80x Death Rune, 6x Runite Bar
Uncommon: 3x Shambling Seeds, 2x Ragshard
Rare: 2x Dragonite Bar
Epic: Verdant Staff (15% chance), Woven Gloves (18%), Ancient Essence (12%)
```

#### Great Olm (Final Boss):
- **GUARANTEED:** 200x Death Rune, 150x Blood Rune, 6x Dragonite Bar, 5x Celestial Fragment
- **UNIQUE:** Olm's Eye, Olm's Heart (only drops here)
- **Legendary:** Primordial Staff, Twisted Bow, Ancestral Robe, Dragon Crossbow

---

### 🎭 THEATRE OF ASH ENHANCEMENTS

Theatre loot tables expanded:
- **Bronze:** Added Elder Rune, Philosopher Stone
- **Silver:** Added Champion Scroll, Twisted Essence, Ancient Artifact
- **Gold:** Added Hydra Tail, Primordial Shard, Mythic Token
- **Purple:** Enhanced legendary drop chances, added Eternal Core
- **Unique Pool:** New items - Sanguine Ornament, Twisted Acorn, Ancient Lamp

---

### 🧪 IMPROVED POTION SYSTEM

#### NEW High-Tier Raid Potions

| Potion | Level | Effect | Duration | Ingredients |
|--------|-------|--------|----------|-------------|
| **Supreme Strength** | 85 | +20 Strength | 180s | Herblore Catalyst, 3x Strength Herb, 2x Dragon Tooth |
| **Divine Magic** | 87 | +25 Magic Bonus | 180s | Herblore Catalyst, 3x Magic Herb, 1x Celestial Fragment |
| **Bastion Brew** | 89 | -20% Damage Taken | 150s | Herblore Catalyst, 3x Defence Herb, 2x Ragshard |
| **Twilight Elixir** | 88 | +15 Evasion | 160s | Herblore Catalyst, 3x Evasion Herb, 2x Crystalline Shard |
| **Ancient Vigor** | 92 | Restore 25% HP | 120s | 2x Herblore Catalyst, 1x Ancient Essence, 5x Torstol |

#### FIXED Buff Flashing Issue
- Buffs now properly initialize with `_maxDuration`
- Progress bars display smoothly without visual glitches
- Buff duration countdown is stable and accurate

---

### 📦 NEW RAID ITEMS (20+)

#### Weapons
- `verdant_staff` (Epic) — +48 Magic Bonus, nature affinity
- `frozen_sceptre` (LEGENDARY) — +75 Magic Bonus, ice affinity
- `primordial_staff` (LEGENDARY) — +95 Magic Bonus, ancient affinity
- `forgemaster_hammer` (LEGENDARY) — +82 Attack, +45 Strength, +30 Crafting Bonus
- `twisted_bow` (LEGENDARY) — From Great Olm

#### Armor
- `vanguard_helm`, `vanguard_chestplate`, `vanguard_legs` — Epic warrior set
- `frosted_robes` — Epic magic armor from Ice Weaver
- `ancestral_robe` — Legendary from Great Olm
- `dragon_crossbow` — Legendary from Great Olm

#### Materials
- `ancient_essence` (Epic) — Universal raid crafting material
- `ragshard` (Uncommon) — Armor fragment
- `crystalline_shard` (Uncommon) — Ice element material
- `forge_dust` (Common) — Smithing material from Tekton
- `warrior_blood` (Uncommon) — From Vanguard
- `shambling_seeds` (Uncommon) — From Shambling Mound

#### Unique Drops
- `olm_eye` — UNIQUE, only from Great Olm
- `olm_heart` — UNIQUE, only from Great Olm
- `philosopher_stone` — From Theatre Bronze
- `champion_scroll` — From Theatre Silver

---

### 🛠️ NEW RAID RECIPES

#### Crafting (new)
```
Vanguard Shield
  Materials: 2x Adamantite Bar, 3x Ragshard, 4x Leather
  Skill: 72 Crafting | XP: 180

Verdant Boots
  Materials: 2x Shambling Seeds, 3x Cloth, 2x Leather
  Skill: 68 Crafting | XP: 150
```

#### Smithing (new)
```
Dragonite Helmet
  Materials: 3x Dragonite Bar, 2x Runite Bar
  Skill: 80 Smithing | XP: 220

Orichalcum Plate
  Materials: 6x Orichalcum Ore, 2x Mythril Bar, 4x Forge Dust
  Skill: 85 Smithing | XP: 280
```

---

### 🏆 NEW ACHIEVEMENTS

| Achievement | Requirement | Reward |
|-------------|-------------|--------|
| Ashvault Explorer | Complete Chambers Bronze | 500 QP |
| Ashvault Conqueror | Complete Chambers Gold | 2000 QP |
| Olm's Bane | Defeat Great Olm | 5000 QP |
| Theatre Master | Complete Theatre Purple | 3000 QP |

---

## 🐛 BUGS FIXED

### ✅ Data URL Logo Cache Busting
- **Problem:** Uploading custom logos created invalid URLs like `data:image/png;base64...?v=123`
- **Solution:** Detect data URLs and skip query param appending (data URLs are memory-resident, need no cache busting)
- **Result:** Custom logos now upload and apply cleanly

### ✅ Potion Buff Flashing
- **Problem:** Buff display re-rendered on every tick, causing visual flashing
- **Solution:** Ensure `_maxDuration` is always set when buff is created, add data-buff attributes for partial updates
- **Result:** Buff progress bars smooth, duration countdown stable

### ✅ Logo 404 Errors  
- **Problem:** `logo.png` not in Vercel deployment root
- **Solution:** Verified static file is properly served from repo root
- **Result:** Landing logo + all branding updates work instantly

---

## 🚀 NEXT STEPS & OPPORTUNITIES

### High Priority (Ready to Build)
1. **Multiplayer Raid Scaling** — Chambers/Theatre now support multiple players (Blaze tier)
   - Adjust boss HP/mechanics for 2-4 player parties
   - Add shared loot pools for group raids
   - Implement raid statistics tracking

2. **Raid Economy System** — Leaderboards + cosmetics
   - Fastest clear times (bronze/silver/gold/purple)
   - Most loot collected (seasonal)
   - Cosmetic raid capes/titles (from achievements)

3. **New Raid Content** — Third raid boss/dungeon
   - 5-6 new bosses similar to Chambers/Theatre structure
   - Unique drop tables + boss mechanics
   - Can leverage new item pool

4. **Potion Belt Expansion**
   - Increase potion slots (currently 4)
   - New "Super Potions" that stack effects
   - Potion duration research upgrades

### Medium Priority
5. **Raid Diary/Quest Line** — Ritual master NPC
   - Tutorial quest for each raid tier
   - Weekly challenges (kill X boss Y times)
   - Unlock special cosmetics

6. **Boss Mechanics Enhancement**
   - Add new attack patterns for variety
   - Raid-specific environmental hazards
   - Boss phase mechanics (Olm already has 3 phases)

7. **Raid Insurance/Supply System**
   - Pay gp to enter with guaranteed supplies
   - Herblore XP for brewing raid potions
   - Supply crates scattered in rooms

### Long Term
8. **Nightmare Raids** — Hard mode with modifiers
   - Boss health +50-100%
   - Exclusive drop table (rare cosmetics)
   - Speed run cosmetics

9. **Social Features** (Firebase enabled)
   - Clan halls (guild-only raid rooms)
   - Raid matchmaking (auto-group players)
   - Shared loot trading post

10. **Mobile Optimization** — Raid UI for small screens
    - Swipe gestures for mechanics
    - Touch-optimized buff bars
    - Mobile potion belt controls

---

## 📊 CONTENT STATISTICS

**Code Added:**
- `raids-content-expansion.js` — 382 lines
- Modified: `admin-branding.js`, `ui.js`, `index.html`

**New Items Registered:** 20+  
**New Recipes:** 6  
**New Potions:** 5  
**New Achievements:** 4  
**Drop Tables Defined:** 5 bosses × 8-15 drops each = 60+ drop variations  

**Total Work:** ~1 hour of comprehensive content design + integration

---

## 🔧 ADMIN TOOLS

All new content is admin-editable via the Admin Panel:

1. **Item Editor** — Modify drop rates, stats, requirements
2. **Boss Editor** — Adjust HP, mechanics, rewards (Monster Tools)
3. **Potion Editor** — Change buff values, durations, ingredients
4. **Recipe Editor** — Add/remove ingredients, change XP rewards
5. **Achievement Editor** — Create new raid achievements

---

## 📝 NOTES FOR DEVELOPERS

- **No Breaking Changes** — All content is additive
- **Firebase Blaze Ready** — Data structure supports multiplayer raids
- **Raid Scaling Ready** — Boss HP/mechanics can be adjusted per player count
- **Item Stat System** — All new items use standard stat blocks (no custom code)
- **Potion Buff Integration** — Follows existing buff system exactly

---

**Questions?** Check the `js/raids-content-expansion.js` source for detailed comments and structure. All drops, recipes, and potions are fully configurable.
