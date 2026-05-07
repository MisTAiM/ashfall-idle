# Ashfall Idle — Master Development TODO
> Last updated: v9.4 | Track progress by segment

## LEGEND
- ✅ Done  🔴 Critical Bug  🟡 Important  🟢 Nice-to-have  🔵 Admin  ⚔️ Combat  🌲 Skills

---

## SEGMENT 1 — Bugs, Admin Power, Skill Depth [IN PROGRESS]

### 🔴 CRITICAL BUGS
- ✅ Arrows missing slot:'ammo' — couldn't equip any ranged ammo
- ✅ equipItem removes 1 arrow on equip (bank IS the quiver)
- ✅ consumeAmmo didn't clear equipment slot on empty
- ✅ Ranged attack didn't validate ammo before firing
- [x] `elder_bow` item no longer exists but fletching recipe still points to it → crash on craft
- [x] `ench_elder_bow` enchanting recipe references dead `elder_bow` item
- [x] `willow_shortbow` in items-combat.js _bows conflicts with data.js definition (ammoType missing from items-combat fallback)
- [x] Admin panel "Create Item" — missing entirely (can only edit existing)
- [x] Admin panel "Create Monster" — missing entirely
- [x] Admin panel "Create Recipe" — missing entirely
- [x] Skills tab in admin can't SET xp directly, only give/take
- [x] Quest tab in admin can't create new quests or edit existing ones
- [x] Shop tab missing from admin — can't add items to shop without code

### 🔵 ADMIN PANEL — Phase 1 (No-Code Create/Edit Everything)
- [x] ADD Create Item form (name, type, slot, stats, rarity, level req, sell price)
- [x] ADD Create Monster form (name, hp, maxHit, style, drops, xp, gold)
- [x] ADD Create Recipe form (skill, inputs, output, level, xp, time)
- [x] ADD Shop Manager tab (add/remove items, set prices, set categories)
- [x] ADD Combat Areas manager (add monsters to areas, set level req)
- [x] IMPROVE Item edit — add levelReq editing, ammoType, bowType
- [x] IMPROVE Monster edit — add drop table editing (item, qty, chance per drop)
- [x] ADD Quest creator (objectives, rewards, prereqs, level reqs)
- [x] ADD Spawn World Boss instantly button
- [x] ADD Reset World Boss respawn timers

### 🌲 NON-COMBAT SKILL DEPTH — Phase 1
- [x] Woodcutting: Bird nests (random event, 0.5% chance, contains seeds/ring)
- [x] Woodcutting: Bonus log rolls at mastery levels (get 2 logs sometimes)
- [x] Woodcutting: Log variety per tree (oak gives oak ONLY, but rare chance of maple at elder)
- [x] Mining: Gem veins (visual, current gemChance data field not wired to drop table properly)
- [x] Mining: Double ore chance at high mastery
- [x] Mining: Coal bag — gather coal without stopping action (like ore bag)
- [x] Fishing: Rare catch system (big fish for bonus XP, ring/treasure at small chance)
- [x] Fishing: Fishing spot depletion (spot moves after 50-100 catches, flavor)
- [x] Foraging: Multi-herb chance (sometimes get 2-3 from one forage)
- [x] Hunting: Clue scroll drops from high-level hunts
- [x] Cooking: Burn mechanic actually logs and shows burn count
- [x] Cooking: Rannar weed / spice system for stat-boosting food
- [x] Smithing: Heat bar UI — forging requires striking while "hot" for bonus XP
- [x] Fletching: Stringing phase UI (craft unstrung bow first, then string it)
- [x] Crafting: Leather crafting (use hides to make ranged armor sets)
- [x] Crafting: Gem cutting (cut raw gems into cut gems for jewelry)
- [x] Alchemy: Secondary ingredient hints in UI
- [x] Incantation: Runecrafting altars UI

### ⚔️ COMBAT ANIMATION POLISH — Phase 1
- [x] Fix ability animations — many are stubs or empty
- [x] Add arrow flight arc animation for bows
- [x] Add magic spell particle burst
- [x] Add cannon blast visual (smoke + projectile)
- [x] Death shake animation for monster
- [x] Critical hit screen flash
- [x] Add more monster death animations (explode, fade, crumble by monster type)

---

## SEGMENT 2 — Skill Systems Deep Dive [UPCOMING]

### 🌲 Woodcutting
- [ ] Chopping interruption mechanic (depleted tree needs to regrow — 5-30s timer)
- [ ] Axe upgrades actually affect speed (bronze/iron/steel/mith/addy/rune axes as tools)
- [ ] Woodcutting pet: Beaver (5% chance double logs)
- [ ] Special logs: Spirit logs (rare, used for summoning), Bloodwood logs (crafting)

### 🌲 Mining
- [ ] Motherlode mine zone (passive ore accumulation like ore bag)
- [ ] Prospecting: survey a rock before mining to know ore type
- [ ] Rock golem pet: 5% chance double ores
- [ ] Mining Cape perk: never deplete gems

### 🌲 Fishing
- [ ] Tackle box: crafted lures that boost catch rate/XP
- [ ] Fishing trawler mini-game (every 30min: board the trawler, catch bonus fish)
- [ ] Mermaid's tear (rare collectible, sold to Mermaid NPC for rewards)
- [ ] Heron pet

### 🌲 Agility
- [ ] Agility courses system (3 courses: Ashfall Ruins lv1, Sanctum lv40, Spire lv70)
- [ ] Mark of Grace drops (currency for graceful outfit)
- [ ] Graceful outfit: reduces weight, faster run restore
- [ ] Agility affects stamina/skip speed for all skills (passive bonus)

### 🌲 Thieving
- [ ] Stall thieving (market stalls: baker, armoury, gem stall, silk stall)
- [ ] Chest cracking mechanic (multi-step: pick → crack → open)
- [ ] Rogue equipment from Rogue's Den
- [ ] Smoke screen ability (avoid stun for 30s)

### 🌲 Summoning  
- [ ] Summoning obelisk: charge pouches here
- [ ] More familiars (7 total: Minotaur, Steel Titan, etc.)
- [ ] Familiar scroll abilities (2nd effect per familiar)
- [ ] Boggart pet

### 🌲 Runecrafting / Incantation
- [ ] Proper altar UI (travel to altar, craft runes from essence)
- [ ] Talisman system (equip talisman to access altar)
- [ ] Daeyalt essence (double XP variant)
- [ ] Blood altar, death altar, wrath altar

### 🌲 Farming
- [ ] Disease mechanic (compost prevents, cure-all potion fixes)
- [ ] Compost variants (regular → supercompost → ultracompost)
- [ ] Tree patches (plant tree seeds, 2hr grow, cut the tree for high XP)
- [ ] Herb patch mastery unlock: auto-protect

---

## SEGMENT 3 — Combat Depth [UPCOMING]

### ⚔️ Combat Systems
- [ ] Prayer flicking (manual prayer toggle timing for efficiency)
- [ ] Overhead prayer visual on player character
- [ ] Poison/venom tiers (snake venom, greater venom, wyvern breath)
- [ ] Bleed stacking: each hit adds a bleed stack (up to 5)
- [ ] Monster weakness system (ice monsters weak to fire, etc.)
- [ ] Damage type modifiers per monster armor class

### ⚔️ Spec Attacks
- [ ] Add missing spec animations for all specced weapons
- [ ] Spec drain on hit (some specs drain enemy prayer/spec)
- [ ] Ring of recoil: returns 10% damage on hit

### ⚔️ Boss Mechanics
- [ ] World bosses: phase transitions (change attack style at 50% HP)
- [ ] Boss enrage mechanic (damage boost over fight duration)
- [ ] Unique boss mechanics per boss (e.g., Ashen Overlord summons adds)

### ⚔️ Dungeons
- [ ] Dungeon modifiers (speed, elite, cursed variants)
- [ ] Dungeon reward scaling with modifier difficulty
- [ ] Checkpoint system for long dungeons

---

## SEGMENT 4 — Social & Economy [UPCOMING]

- [ ] Player-to-player trading (direct trade window)
- [ ] Bazaar: buy orders (not just sell orders)
- [ ] Clan/Guild upgrades (unlock skill boosts, shared storage)
- [ ] Leaderboard: skill-specific rankings
- [ ] Prestige system: reset skills for permanent % bonus
- [ ] Player shop (set own prices, broadcast to bazaar)

---

## SEGMENT 5 — UI Polish & QoL [UPCOMING]

- [ ] Bank filters: show only equippable, only food, only ammo, only tradeable
- [ ] Item tooltip on hover (full stat block, all bonuses)
- [ ] Combat log panel (last 20 hits with damage type, timestamp)
- [ ] Skill progress rings (circular progress instead of bar)
- [ ] Achievement popup animation (full-screen banner for major unlocks)
- [ ] Sound system (click sounds, level-up jingle, combat hit sounds)
- [ ] Mobile: larger tap targets, swipe between tabs
- [ ] Dark/Light mode toggle
- [ ] Tutorial overlay for new players (5 steps: gather, smith, equip, fight, quest)
- [ ] Item comparison (tap two items to compare stats side by side)
- [ ] Bank presets (save/load equipment loadouts)
- [ ] Auto-bank while training (configurable gather → bank timer)

---

## KNOWN DATA ISSUES
- [ ] elder_bow item dead — recipe fixed, enchant recipe still points to it
- [ ] Some monster drops reference non-existent items (void_dust, hollow_sigil not added as items)
- [ ] `fletch_elder_bow` recipe output is `elder_bow` (dead) → fixed to `elder_shortbow`
- [ ] Arrows missing from shop at base tier (bronze/iron arrows not purchasable)
- [ ] Crafting skill has almost no recipes
- [ ] Incantation skill has no recipes or actions
- [ ] Leadership/Diplomacy/Trading skills have no leveling actions

---

## COMPLETED
- ✅ v9.0: Core combat loop
- ✅ v9.1: Firebase social (friends, guild, bazaar, chat)
- ✅ v9.2: Dungeon system, fight cave, world bosses
- ✅ v9.3: Spec attacks, status effects, ore bag, mining events
- ✅ v9.4: Range fix (arrows equip), cannon system, full bow tiers, cannon UI
