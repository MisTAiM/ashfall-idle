# 🎮 Ashfall Idle — Master Development Checklist v1.0

**Last Updated:** May 12, 2026  
**Codebase:** 59 JS files (2.4MB), 2 CSS files (340KB), 36,500+ lines of code  
**Firebase Tier:** Blaze (multiplayer ready)  
**Goal:** Production-grade dark fantasy idle RPG

---

## 📋 IMMEDIATE PRIORITIES (This Session)

### Critical Infrastructure
- [ ] **Error Handling Framework** — Centralized error logging with Firebase integration
  - [ ] Create `js/error-handler.js` with try-catch wrappers
  - [ ] Add error telemetry (track crashes, report to admin dashboard)
  - [ ] Implement user-friendly error messages instead of console dumps
  - [ ] Add recovery mechanisms (auto-save before risky operations)

- [ ] **Debugging System** — Enhanced logging for development
  - [ ] Create `js/debug-system.js` with level-based logging
  - [ ] Add performance profiler (track slow functions)
  - [ ] Memory leak detector (track object creation/cleanup)
  - [ ] Frame rate monitor (detect rendering bottlenecks)

- [ ] **Content Update Infrastructure**
  - [ ] Create `js/content-versions.js` — version tracking for patches
  - [ ] Implement hot-reload for data without page refresh
  - [ ] Add content changelog system (players see what changed)
  - [ ] Migration system for save game compatibility

### UI/UX Polish
- [ ] **Navigation Redesign** — Currently basic, needs visual hierarchy
  - [ ] Add icon-based category shortcuts
  - [ ] Implement breadcrumb navigation
  - [ ] Create persistent search bar with autocomplete
  - [ ] Add quick-access favorites/bookmarks

- [ ] **Skill Page Improvements**
  - [ ] Add experience progress visualization (not just numbers)
  - [ ] Show XP/hour rates in real-time
  - [ ] Implement skill timeline (when did I start this?)
  - [ ] Add next-milestone countdown

- [ ] **Combat UI Overhaul**
  - [ ] Replace emoji icons with proper SVG icons
  - [ ] Add health bar animations (smooth drain instead of jumps)
  - [ ] Implement damage number pop-ups (floating text)
  - [ ] Add combo counter visualization
  - [ ] Create attack speed indicator (visual feedback)

- [ ] **Equipment Screen**
  - [ ] 3D model viewer for equipment (CSS transforms or Three.js)
  - [ ] Stat comparison tools (show upgrade gain)
  - [ ] Equipment presets (save loadouts)
  - [ ] Price guides (market value of items)

### SVG & Graphics Overhaul
- [ ] **Icon Redesign** — Replace all emoji in-game with professional SVGs
  - [ ] Item category icons (20+ icons needed)
  - [ ] Skill icons (28 skills × 2 sizes = 56 icons)
  - [ ] Buff/debuff icons (replace ⚔⚡🛡 etc)
  - [ ] Monster icons (64 monsters from sprites-art.js)
  - [ ] UI control icons (buttons, toggles, tabs)

- [ ] **Monster Art Improvement**
  - [ ] Audit existing SVGs for quality (js/sprites-art.js has 64 monsters)
  - [ ] Identify low-quality art that needs redoing
  - [ ] Create consistent art style guide
  - [ ] Add animations to monster sprites (idle, attack, death)

- [ ] **Item Sprite Quality**
  - [ ] Review 734 items in GAME_DATA.items
  - [ ] Identify items without proper sprites
  - [ ] Create missing item icons
  - [ ] Ensure consistent sizing/style

### Content Gaps
- [ ] **Fill Empty Drop Tables**
  - [ ] Check all 100+ monsters for complete drops
  - [ ] Add loot variety (currently many have 3-4 items max)
  - [ ] Create rare drop chains (leads to quests)

- [ ] **Improve Quest System**
  - [ ] Add quest markers on map/skills page
  - [ ] Create quest tracker sidebar (shows active quests)
  - [ ] Implement quest journal (story progression)
  - [ ] Add optional side quests (exploration incentive)

---

## 🎯 PHASE 2: CORE SYSTEMS (Next Week)

### Performance & Optimization
- [ ] **Memory Management**
  - [ ] Profile memory usage (identify leaks)
  - [ ] Implement object pooling for game entities
  - [ ] Add garbage collection hooks
  - [ ] Optimize save file size

- [ ] **Rendering Optimization**
  - [ ] Implement request animation frame throttling
  - [ ] Add viewport culling (don't render off-screen)
  - [ ] CSS containment for complex layouts
  - [ ] Lazy load heavy UI components

- [ ] **Network Optimization** (Blaze tier ready)
  - [ ] Firebase connection pooling
  - [ ] Implement offline mode with sync queue
  - [ ] Add data compression for saves
  - [ ] Rate limiting protection

### Skill Improvements
- [ ] **Melee Training**
  - [ ] Add new weapon types (scimitars, spears, claws)
  - [ ] Implement weapon-specific damage bonuses
  - [ ] Create attack speed variations per weapon
  - [ ] Add special attack animations

- [ ] **Magic System**
  - [ ] Create spell schools (combat, utility, healing)
  - [ ] Add spell level requirements
  - [ ] Implement mana system (current: unlimited)
  - [ ] Add spell failure chance for balance

- [ ] **Ranged Combat**
  - [ ] Different arrow types with unique effects
  - [ ] Ammo tracking (don't auto-replenish)
  - [ ] Range-based damage falloff
  - [ ] New ranged weapon types

- [ ] **Cooking & Food**
  - [ ] Food degradation (get worse over time?)
  - [ ] Recipe complexity progression
  - [ ] Food preparation time (not instant)
  - [ ] Meal combinations (buffs stack)

- [ ] **Herblore Improvements**
  - [ ] Potion experience scaling
  - [ ] Failed potion batches (skill-based success rate)
  - [ ] Potion potency levels (tier 1-5)
  - [ ] Ingredient freshness system

- [ ] **Crafting Expansion**
  - [ ] Add more recipe chains
  - [ ] Implement quality levels on crafted items
  - [ ] Add crafting XP scaling
  - [ ] Create masterwork items (rare high-stat crafts)

---

## ✨ PHASE 3: FEATURES & CONTENT (Weeks 2-4)

### Cosmetics & Customization
- [ ] **Transmog System** — Change item appearance without stat loss
  - [ ] Cosmetic item unlocks (earned from achievements)
  - [ ] Color customization for gear
  - [ ] Dye system (color cosmetics from resources)
  - [ ] Cosmetic slots (fashion separate from stats)

- [ ] **Player Customization**
  - [ ] Hairstyles & facial features
  - [ ] Clothing colors
  - [ ] Character emotes/animations
  - [ ] Pet cosmetics

### Expanded Raids
- [ ] **Raid Difficulty Scaling**
  - [ ] Adjust Chambers boss HP for party size
  - [ ] Group loot distribution system
  - [ ] Raid-only exclusive drops
  - [ ] Raid weekly reset mechanics

- [ ] **New Raid: The Sunken Catacombs**
  - [ ] 5 new bosses (follow Chambers template)
  - [ ] Water/corruption themed mechanics
  - [ ] 20+ new items with unique drops
  - [ ] Boss-specific armor sets

- [ ] **Nightmare Mode Raids**
  - [ ] Hard mode with modifiers
  - [ ] 50-100% boss HP increase
  - [ ] Exclusive cosmetic drops
  - [ ] Leaderboard rankings

### Social & Multiplayer (Blaze Tier)
- [ ] **Clan System**
  - [ ] Clan creation & management
  - [ ] Clan wars (guild vs guild raids)
  - [ ] Clan hall (shared space)
  - [ ] Clan chat & announcements

- [ ] **Trading Post**
  - [ ] Player-to-player trading
  - [ ] Grand Exchange (price history)
  - [ ] Buy orders / Sell orders
  - [ ] Trade tax system (gold sink)

- [ ] **Party System**
  - [ ] Party chat
  - [ ] Party dungeon runs
  - [ ] Experience sharing options
  - [ ] Party leaderboards

- [ ] **Leaderboards**
  - [ ] Global XP rankings (all skills)
  - [ ] Raid speed runs
  - [ ] Wealth ranking
  - [ ] Combat level rankings
  - [ ] Seasonal/monthly resets

### Events & Seasons
- [ ] **Battle Pass System**
  - [ ] Free & premium tracks
  - [ ] Daily challenges
  - [ ] Weekly challenges
  - [ ] Seasonal cosmetics

- [ ] **Seasonal Events**
  - [ ] Holiday events (Easter eggs in code)
  - [ ] Limited-time bosses
  - [ ] Event-only items
  - [ ] Seasonal quest lines

- [ ] **Random Events**
  - [ ] Expand current random event system
  - [ ] Boss invasions (in middle of training)
  - [ ] Resource multiplier events
  - [ ] XP boost weekends

---

## 🎨 GRAPHICS & ANIMATIONS (Ongoing)

### SVG Modernization
**Priority List (Worst First):**
- [ ] **Monster Sprites** — Audit all 64 from sprites-art.js
  - [ ] Red-flag: Simple geometric shapes (circles, rectangles)
  - [ ] Red-flag: Inconsistent art style
  - [ ] Red-flag: No shading/depth
  - [ ] Create style guide document (proportions, colors, effects)

- [ ] **Buff Icons** — Replace all emoji
  - Current: ⚔⚡🛡🏹🔮💪💉✦
  - Create: Professional SVG equivalents (20+ icons)
  - Test: Icons at 24px, 32px, 48px sizes
  - Add: Animation on buff apply

- [ ] **Item Icons** — Review 734 items
  - [ ] Identify items without sprites (likely has fallback)
  - [ ] Create SVG icon pack (weapons, armor, consumables)
  - [ ] Add rarity indicators (glow/border colors)
  - [ ] Implement icon spritesheet (performance)

- [ ] **Skill Icons** — 28 skills need visual identity
  - [ ] Combat, Range, Magic, Defense
  - [ ] Mining, Smithing, Crafting, Construction
  - [ ] Cooking, Herblore, Farming, Fishing
  - [ ] Thieving, Agility, Summoning, Incantation
  - [ ] More...
  - [ ] Consistent style (all at 64px base)

- [ ] **UI Icons** — Buttons, controls
  - [ ] Settings gear, close X, back arrow
  - [ ] Dropdown arrows, radio buttons, checkboxes
  - [ ] Menu hamburger, search, filter
  - [ ] Plus/minus, maximize/minimize
  - [ ] Create 2-3 sizes for responsive design

### Animation Additions
- [ ] **Combat Animations**
  - [ ] Attack swing (player & monster)
  - [ ] Spell cast effect
  - [ ] Projectile travel
  - [ ] Damage number pop-ups (floating upward)
  - [ ] Critical hit flash/sparkle
  - [ ] Death/fade out animation

- [ ] **UI Animations**
  - [ ] Smooth page transitions (fade/slide)
  - [ ] Item acquisition pop-up (item appears in inventory with zoom)
  - [ ] XP gain notification (floating text)
  - [ ] Level up celebration (confetti, flash)
  - [ ] Buff apply pulse animation

- [ ] **Skill Animations**
  - [ ] Mining pickaxe swing
  - [ ] Fishing rod cast
  - [ ] Cooking fire effect
  - [ ] Herblore potion bubble animation
  - [ ] Crafting hammer strike

### Resources & Learning
**SVG Art Improvement Reading List:**
- [ ] Book: "SVG Essentials" — Tools and techniques
- [ ] Article: "Drawing Animals in SVG" — Proportions guide
- [ ] Article: "SVG Filters" — Shading, gradients, effects
- [ ] Tutorial: "Creating Isometric SVGs" — Game asset style
- [ ] Resource: "Font Awesome Icons" — Reference for consistency
- [ ] Channel: YouTube "SVG Animation" tutorials
- [ ] Practice: Redraw 1 existing monster per day until all improved

---

## 🛠️ CODE QUALITY & INFRASTRUCTURE

### Error Handling (Current: Scattered try-catch)
- [ ] Create centralized error handler
  - [ ] Custom error classes (GameError, NetworkError, ValidationError)
  - [ ] Error codes & messages
  - [ ] Error recovery strategies
  - [ ] Error tracking dashboard

- [ ] Add logging levels
  - [ ] DEBUG (very verbose)
  - [ ] INFO (important milestones)
  - [ ] WARN (potential issues)
  - [ ] ERROR (recoverable issues)
  - [ ] FATAL (game-breaking)

- [ ] Add per-module error guards
  - [ ] Skill system error handling
  - [ ] Combat system error handling
  - [ ] Firebase sync error handling
  - [ ] UI rendering error handling

### Testing Framework
- [ ] Unit tests for core systems
  - [ ] Damage calculation tests
  - [ ] XP formula tests
  - [ ] Inventory management tests
  - [ ] Quest progression tests

- [ ] Integration tests
  - [ ] Skill training workflow
  - [ ] Combat start-to-finish
  - [ ] Save/load cycle
  - [ ] Firebase sync

- [ ] Performance tests
  - [ ] Load time benchmarks
  - [ ] Rendering frame rate
  - [ ] Memory usage tracking
  - [ ] Network latency tests

### Code Organization
- [ ] Refactor monolithic files (engine.js is 4000+ lines)
  - [ ] Split into: engine-core.js, engine-skills.js, engine-raids.js
  - [ ] Better module boundaries
  - [ ] Reduce circular dependencies

- [ ] Create utility libraries
  - [ ] Math utilities (damage formulas)
  - [ ] String utilities (text formatting)
  - [ ] Array utilities (common operations)
  - [ ] Time utilities (duration formatting)

- [ ] Documentation
  - [ ] JSDoc comments for all functions
  - [ ] README for each module
  - [ ] Architecture diagrams
  - [ ] Data structure documentation

---

## 📊 MONITORING & ANALYTICS (Blaze Tier)

### Player Behavior
- [ ] Track which skills are most trained
- [ ] Monitor raid clear rates & times
- [ ] Identify players who quit early (analytics)
- [ ] Track most-used items
- [ ] Monitor boss difficulty feedback

### Performance Monitoring
- [ ] Page load time tracking
- [ ] Time-to-interactive metrics
- [ ] Crash rate monitoring
- [ ] Firebase latency tracking
- [ ] Browser compatibility matrix

### Debugging Tools
- [ ] Admin panel additions
  - [ ] Error log viewer
  - [ ] Performance profiler dashboard
  - [ ] Player state inspector
  - [ ] Save file editor
  - [ ] Item spawn tool (for testing)

---

## 🎯 CONTENT ROADMAP (Next 3 Months)

### Month 1: Systems Polish
- Week 1: Error handling + debugging framework
- Week 2: SVG icon redesign (50% complete)
- Week 3: Combat UI animation overhaul
- Week 4: Skill improvements (magic, ranged, cooking)

### Month 2: Content Expansion
- Week 5: New raid (Sunken Catacombs)
- Week 6: Clan system implementation
- Week 7: Trading post & Grand Exchange
- Week 8: Transmog/cosmetic system

### Month 3: Polish & Features
- Week 9: Leaderboards
- Week 10: Battle pass system
- Week 11: Mobile optimization
- Week 12: Seasonal event framework

---

## ✅ COMPLETED (Keep This Updated!)

- [x] Logo cache busting (data URL fix)
- [x] Potion buff flashing fix
- [x] Chambers of Ash drop tables (5 bosses)
- [x] Theatre of Ash drop enhancements
- [x] New raid potions (5 recipes)
- [x] New raid items (20+ items)
- [x] New raid achievements (4)
- [x] New raid recipes (6 crafting/smithing)
- [x] Master development checklist (THIS FILE)

---

## 📖 KNOWLEDGE BASE

### SVG Art Style Guide (To Create)
**Specifications for new SVG icons:**
- **Base Size:** 64px × 64px (scales to 32px, 48px, 96px)
- **Stroke Width:** 2px (base)
- **Color Palette:** Match game theme (#c9873e accent, dark backgrounds)
- **Style:** Semi-realistic with clear shapes (not cartoon, not pixel art)
- **Shading:** 1-2 gradient layers for depth
- **Effects:** Subtle shadows (not glows unless special effect)

### Code Style Standards
- Use camelCase for variables/functions
- Use UPPER_CASE for constants
- Comments for complex logic (not obvious code)
- Max 100 lines per function
- Descriptive variable names (not a, b, c)

### Performance Targets
- Page load: < 3 seconds
- Time to interactive: < 5 seconds
- Frame rate: 60 FPS in combat
- Save file: < 500KB
- Firebase sync: < 500ms

---

## 🔗 EXTERNAL RESOURCES

### SVG Learning
- Inkscape (free SVG editor): https://inkscape.org/
- Adobe XD (design tool): https://www.adobe.com/products/xd.html
- SVG Path Generator: https://www.blobmaker.app/
- Icon Design Tool: https://www.favicon-generator.org/
- SVG Optimization: https://www.svgo.com/ (SVGO tool)

### Game Dev Learning
- Game Design Patterns: https://gameprogrammingpatterns.com/
- Three.js (3D graphics): https://threejs.org/
- Babylon.js (3D alternative): https://www.babylonjs.com/
- Phaser (2D framework): https://phaser.io/

### Animation Resources
- Animate.css (ready-made animations): https://animate.style/
- SVG Animation Guide: https://www.smashingmagazine.com/
- CSS Animation Timing: https://easings.net/
- Lottie (JSON animations): https://airbnb.io/lottie/

---

## 📝 UPDATE LOG

**v1.0** — May 12, 2026
- Initial master checklist created
- 59 JS files audited
- 100+ action items defined
- 3-month roadmap created

---

**NEXT UPDATE AFTER EVERY PUSH:**
- [ ] Mark completed items
- [ ] Add new issues discovered
- [ ] Update progress percentages
- [ ] Commit checklist changes to GitHub

Keep this file at root of repo as: `DEVELOPMENT_CHECKLIST.md`
