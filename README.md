# Ashfall Idle

[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://ashfall-idle.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-c9873e)](LICENSE)
[![Version](https://img.shields.io/badge/Version-3.0-c9873e)](https://github.com/MisTAiM/ashfall-idle)
[![Made With](https://img.shields.io/badge/Made%20With-Vanilla%20JS-f7df1e?logo=javascript&logoColor=black)]()

> **A dark fantasy idle RPG forged in ashfire.** Train 25 interlocking skills, align yourself with warring factions, wield status effects and active abilities, hunt world bosses, and shape your destiny across nine moral alignments. No framework. No bloat. Just deep, procedural idle systems in pure Vanilla JavaScript.

**Play Now → [ashfall-idle.vercel.app](https://ashfall-idle.vercel.app)**  &nbsp; · &nbsp;  **Wiki → [/wiki.html](https://ashfall-idle.vercel.app/wiki.html)**

---

## Contents

1. [The Pitch](#the-pitch)
2. [Feature Tour](#feature-tour)
3. [Getting Started](#getting-started)
4. [Gameplay Guide](#gameplay-guide)
5. [Game Systems Deep Dive](#game-systems-deep-dive)
6. [Tech Stack](#tech-stack)
7. [Architecture](#architecture)
8. [Project Structure](#project-structure)
9. [Development](#development)
10. [Deployment](#deployment)
11. [Roadmap](#roadmap)
12. [Credits](#credits)

---

## The Pitch

Ashfall Idle is what happens when you take the depth of *Old School RuneScape*, the polish of *Melvor Idle*, and the moral weight of *D&D* — and compress the whole thing into a single-tab web app that you can play on any device, online or offline.

You start as a level-1 nobody on the edge of a cataclysm-ravaged world. You end as a multi-classed demigod, swinging an Ashfire Blade through a Void Walker while your reputation with the Silver Order earns you a Grandmaster title and your alignment as a Chaotic Neutral Wanderer grants you +5% loot quantity on every kill.

No accounts. No microtransactions. No framework lock-in. Your save lives in your browser. Your progress is yours.

---

## Feature Tour

### Core Gameplay

- **25 Skills** across Gathering, Artisan, Combat, and Support archetypes, each with 99 levels and its own mastery subsystem
- **200+ unique items** — logs, ores, bars, gems, fish, food, herbs, potions, runes, seeds, produce, arrows, six weapon classes, four armor sets, jewelry, capes
- **27 monsters** across 4 monster families across 12 combat areas, plus 11 waved dungeons and 3 World Bosses
- **D&D Alignment System** — nine alignments (Lawful Good → Chaotic Evil) that shift based on your actions and grant permanent bonuses
- **4 Factions** with 5 reputation tiers each, unlocking exclusive weapons, perks, and discounts
- **5 NPCs** with 20 Arrowhead-style quest chains gated by prior completions
- **4 Status Effects** — Burn (multiplicative DoT), Poison (explodes at 7 stacks), Freeze (3× next hit), Bleed
- **8 Active Abilities** with cooldowns and 4 equippable slots, unlocked via the Tactics skill
- **Prayer System** -- 21 prayers (Thick Skin through Piety/Rigour/Augury), bury 6 bone types for prayer points, up to 2 active prayers for passive combat buffs
- **Pet System** -- 18 collectible pets from skilling and combat, each with a unique passive bonus, equip one at a time
- **Slayer System** -- 5 task tiers with assigned monster kills, Slayer Coins, Slayer Shop with exclusive gear, Auto-Slayer upgrade
- **5 Spellbooks** -- Standard, Pyromancy (Burn), Cryomancy (Freeze), Blood Magic (Lifesteal/Bleed), Void Magic (multi-status)
- **4 Monster Families** -- Ashborn, Hollowed, Frostwraith, Bloodfang with 12 new monsters and themed combat areas
- **3 Combat Styles** — Melee, Ranged (with ammunition), and Magic (8 spells with rune costs and status chances)
- **Offline Progression** — your active skill runs for up to 24 hours while you're away
- **Auto-Eat** and **Auto-Loot** — set it and forget it

### Polish

- **Persistent training bar** at the top of every page so you always know what you're doing
- **Procedural SVG sprites** for every item — 195 unique icons, no image assets, no CORS headaches
- **Dark fantasy aesthetic** — Cinzel headers, Crimson Text body, amber accents on deep black, zero emojis
- **Responsive layout** that collapses cleanly on mobile
- **Save import/export** via base64 so you can back up to a text file
- **Full standalone wiki** at `/wiki.html` with every item, monster, recipe, and drop table

---

## Getting Started

### Play in Browser

Just go to **[ashfall-idle.vercel.app](https://ashfall-idle.vercel.app)**. That's it. No install. No account. Your save auto-persists in `localStorage`.

### Run Locally

```bash
git clone https://github.com/MisTAiM/ashfall-idle.git
cd ashfall-idle
# any static server works:
python3 -m http.server 8000
# or:
npx serve .
```

Open `http://localhost:8000`.

There are no dependencies, no bundler, no build step. The files that ship are the files that run.

---

## Gameplay Guide

### First Steps (Level 1–10)

1. **Chop oak trees** in Woodcutting to collect logs
2. **Mine copper and tin** ore, then smelt Bronze Bars in Smithing
3. **Forge a Bronze Sword** and start clearing chickens in the Farmlands
4. **Catch and cook shrimp** to keep your HP topped up in combat
5. **Visit Old Pete** in the NPCs tab — he has a starter quest chain that rewards gold and XP

### The Mid-Game (Level 30–60)

- Unlock Mithril and Adamant gear
- Start the Silver Order quest chain with **Commander Elara** to push your combat rep
- Engage your first **Dungeon** (Goblin Den → Bandit Fortress → Troll Stronghold)
- Train **Tactics** to unlock **Active Abilities** and slot Power Strike, Fireball, or Ice Blast
- Start **Farming** herbs so **Alchemy** can supply you with Healing and Strength potions
- Shift your **Alignment** intentionally — killing evil creatures pushes you Good, killing innocents pushes you Evil

### The End-Game (Level 70–99)

- **Obsidian and Ashfire weapons** from the deepest dungeons
- **Void Walkers and the Ashfall Titan** for true endgame drops
- **World Bosses** — Blight Warden (1h respawn), Storm Reaver (2h), Ashen Overlord (4h)
- Chase Grandmaster rank in a faction for the best exclusive weapons
- Push all 25 skills to 99 for the hidden *Well-Rounded* achievement cluster

---

## Game Systems Deep Dive

### Skills (23 total)

| Category   | Skills                                                                           |
| ---------- | -------------------------------------------------------------------------------- |
| Gathering  | Woodcutting, Mining, Fishing, Foraging, Hunting                                  |
| Artisan    | Cooking, Smithing, Fletching, Crafting, Alchemy, Enchanting                      |
| Combat     | Attack, Strength, Defence, Hitpoints, Ranged, Magic, Tactics, Prayer, Slayer     |
| Support    | Farming, Thieving, Trading, Leadership, Diplomacy                                |

Each skill uses a RuneScape-compatible XP curve — Level 99 requires ~13M XP.

### Alignment (9 axes)

Your alignment shifts based on what you kill. Killing evil creatures (goblins, demons, void walkers) pushes you **Good**. Killing neutral or innocent creatures pushes you **Evil**. Each of the 9 alignments grants a unique passive:

| Axis | Name              | Bonus                                    |
| ---- | ----------------- | ---------------------------------------- |
| LG   | The Defender      | +10% sell value                          |
| NG   | The Benefactor    | +5% gathering XP                         |
| CG   | The Vigilante     | +15% combat XP vs evil                   |
| LN   | The Arbiter       | +10% Diplomacy XP                        |
| NN   | The Mercenary     | Balanced. All factions accessible.       |
| CN   | The Wanderer      | +5% loot quantity                        |
| LE   | The Hellknight    | +10% Strength damage                     |
| NE   | The Profiteer     | -20% shop prices, +10% gold drops        |
| CE   | The Destroyer     | +20% damage to all creatures             |

### Factions (4)

Each faction has 5 reputation tiers with progressively better perks. Quest rewards, alignment-gated content, and dungeon rare drops all feed your reputation:

- **The Silver Order** — Paladins. Culminates in the **Silver Champion Sword** at Grandmaster.
- **The Ashen Merchant Guild** — Neutral traders. -15% shop / +20% sell at Partner, Black Market at Guildmaster.
- **The Bloodfang Clan** — Raiders. **Bloodfang Cleaver** and Bloodforge weapons at top tier.
- **The Veiled Circle** — Wizards. **Voidseer Staff** and forbidden void magic at Voidseer.

### Status Effects

- **Burn** — Damage over time. Each stack multiplies damage by 1.3×. Great on magic spells.
- **Poison** — Linear DoT. At 7 stacks, it **explodes** for 80 burst damage.
- **Freeze** — Next attack deals 3× damage. One-shot setup for crit builds.
- **Bleed** — DoT from critical hits.

### Active Abilities

Equip up to 4 in your ability bar. Each has a cooldown (12s–60s). Unlocked by training **Tactics**:

| Ability       | Tactics Lv | Effect                                            |
| ------------- | ---------- | ------------------------------------------------- |
| Power Strike  | 1          | Next attack +100% damage                          |
| Quick Shot    | 1          | Instant ranged shot, +50% damage                  |
| Fireball      | 1          | Magic hit + Burn (3 stacks)                       |
| War Cry       | 10         | +25% damage for 15 seconds                        |
| Ice Blast     | 10         | Apply Freeze (5 stacks)                           |
| Venom Strike  | 15         | Apply Poison (2 stacks)                           |
| Heal          | 20         | Restore 30% of max HP                             |
| Execute       | 25         | Triple damage if target below 30% HP              |

### World Bosses

Server-wide cooldowns. Your personal respawn timer starts when you kill one:

- **The Blight Warden** — Combat Lv 80, 15,000 HP, 1-hour respawn
- **Storm Reaver** — Combat Lv 90, 22,000 HP, 2-hour respawn
- **The Ashen Overlord** — Combat Lv 110, 40,000 HP, 4-hour respawn. Drops **Ashfire Blade** and **Ashfall Amulet**.

---

## Tech Stack

| Layer     | Choice                                                                                                  |
| --------- | ------------------------------------------------------------------------------------------------------- |
| Language  | **Vanilla JavaScript** (no framework, no TypeScript, no build step)                                     |
| Rendering | Direct DOM manipulation through a lightweight `UI` class with event-driven re-renders                   |
| Graphics  | Procedural SVG sprites generated from palette+template pairs — zero image assets                        |
| Styling   | Hand-written CSS with CSS variables for theming, Cinzel + Crimson Text + JetBrains Mono via Google CDN  |
| State     | Plain JavaScript object, serialized to `localStorage` as `ashfall_save` every 30 seconds                |
| Hosting   | Vercel static hosting, auto-deploy from `main` branch via GitHub integration                            |
| Source    | [GitHub: MisTAiM/ashfall-idle](https://github.com/MisTAiM/ashfall-idle)                                 |

**Zero dependencies. Zero build artifacts. `index.html` loads four scripts and you're playing.**

---

## Architecture

The game splits cleanly into four layers, each in one file:

```
┌────────────────────────────────────────────────────────────────┐
│  data.js          Pure static content — items, monsters,       │
│                   skills, recipes, quests, NPCs, factions,     │
│                   alignments, abilities, achievements, shop.   │
│                   195 items, 15 monsters, 20 quests, etc.      │
├────────────────────────────────────────────────────────────────┤
│  sprites.js       Procedural SVG icon renderer. Takes a        │
│                   sprite ID (e.g. "sword-mithril") and         │
│                   returns inline SVG colored from palette.     │
├────────────────────────────────────────────────────────────────┤
│  engine.js        GameEngine class. All simulation logic.      │
│                   Tick loop, XP math, combat formulas, save/   │
│                   load, offline progression, status effects,   │
│                   alignment shifts, quest tracking. Emits      │
│                   events, never touches the DOM.               │
├────────────────────────────────────────────────────────────────┤
│  ui.js            UI class. Listens to engine events. Owns     │
│                   all DOM rendering. Sidebar navigation, page  │
│                   routing, persistent training bar, toasts.    │
└────────────────────────────────────────────────────────────────┘
```

### Event Flow

```
User Input  ─▶  UI.startAction()  ─▶  engine.startSkill()
                                        │
                                        ▼
                                    [single-skill enforcement]
                                        │
                                        ▼
                                    emit("skillStart")
                                        │
                                        ▼
                                    UI.renderTrainingBar() + UI.renderPage()

Tick Loop  ─▶  engine.tick()  ─▶  tickSkill/tickCombat  ─▶  emit("tick")
                                        │
                                        ▼
                                    UI.onTick() updates progress bars in-place
                                        (no full re-render — smooth 10 FPS)
```

### The "Single-Skill Bug" Fix

**Problem:** Players could appear to run multiple skills at once because the previous activeSkill wasn't explicitly cleared before the new one was set.

**Fix in engine.js `startSkill()`:**

```js
// EXPLICIT single-skill enforcement: hard stop any active skill first
const wasActive = this.state.activeSkill;
this.state.activeSkill = null;
this.state.activeAction = null;
this.state.actionProgress = 0;
// Then set new
this.state.activeSkill = skillId;
this.state.activeAction = actionId;
this.state.actionProgress = 0;
if (wasActive && wasActive !== skillId) {
  this.emit('notification', { text: `Stopped ${prevName}, started ${newName}.` });
}
```

**Plus a persistent training bar** at the top of every page that always shows exactly what skill is running (or "Idle" if none), so confusion is impossible.

---

## Project Structure

```
ashfall-idle/
├── index.html            # Entry point (27 lines)
├── wiki.html             # Standalone searchable wiki (every item, monster, recipe)
├── README.md             # This file
├── css/
│   └── style.css         # 1240 lines of hand-written CSS, no preprocessor
└── js/
    ├── data.js           # 201 items, 27 monsters, 48 quests, 21 prayers, 18 pets, etc.
    ├── sprites.js        # Procedural SVG generator (32 sprite types × palettes)
    ├── engine.js         # GameEngine class — all simulation logic
    └── ui.js             # UI class — all rendering and event wiring
```

---

## Development

### Making Changes

Ashfall Idle has no build step. Edit, refresh, done.

```bash
# edit a file
vim js/data.js

# validate it before committing (catches template literal issues early)
node --check js/data.js

# refresh the browser
```

### Save Compatibility

Changes to the save shape must go through `migrateSave()` in `engine.js`. The save format is versioned (`state.version`). The migration routine is idempotent and adds any missing fields with safe defaults, so existing players never lose progress.

### Adding a New Skill

1. Add entry to `GAME_DATA.skills` in `data.js`
2. Add actions to `GAME_DATA.gatheringActions[skillId]` or `GAME_DATA.recipes[skillId]`
3. Add the skill to the `NAV` structure in `ui.js`
4. Done — the generic `renderSkillPage` handles rendering

### Adding a New Item

One line in `data.js`:

```js
add('new_item_id', {
  name: 'Display Name',
  type: 'weapon',
  slot: 'weapon',
  style: 'melee',
  attackSpeed: 2.0,
  stats: { attackBonus: 100, strengthBonus: 85 },
  levelReq: { attack: 60 },
  sellPrice: 8000,
  sprite: 'sword-ashfire',
  desc: 'A legendary weapon.',
});
```

---

## Deployment

### Auto-Deploy (Current Setup)

The `main` branch of [MisTAiM/ashfall-idle](https://github.com/MisTAiM/ashfall-idle) is linked to a Vercel project (`prj_FFGTVpefrKu24zpcLWykMQYLykb2`). Every push to `main` triggers a production deployment, and `ashfall-idle.vercel.app` updates within about 20 seconds.

```bash
git add -A
git commit -m "feat: new content"
git push origin main
# ashfall-idle.vercel.app updates automatically
```

### Manual Deploy Trigger

If you need to trigger a deployment without a new commit:

```bash
curl -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"ashfall-idle",
    "project":"prj_FFGTVpefrKu24zpcLWykMQYLykb2",
    "gitSource":{
      "type":"github",
      "repo":"MisTAiM/ashfall-idle",
      "ref":"main",
      "repoId":1211322672
    },
    "target":"production"
  }'
```

### Hosting Elsewhere

The entire game is static files. Drop it on any static host:

- **GitHub Pages** — enable in repo settings, serve from `/` on `main`
- **Netlify** — drag-and-drop the folder
- **Cloudflare Pages** — connect the repo
- **Your own nginx** — `root /var/www/ashfall-idle;` and you're done

---

## Roadmap

### Planned

- [ ] **Enchanting skill** fully implemented — rune imbue system on equipment
- [ ] **Cartography / Engineering** — placeholder slots exist, systems TBD
- [ ] **Prayer system** to complement alignment
- [ ] **Pet drops** from rare loot tables
- [ ] **Daily quests** from NPCs
- [ ] **Leaderboards** (opt-in cloud sync for highscores)
- [ ] **Seasonal events** — Ashfall anniversary, Frostfall winter event
- [ ] **Crafting Mastery rewards** — unique perks at Mastery 99 per recipe

### Ideas

- Procedurally generated side-dungeons
- A *New Game Plus* ascension mechanic
- Multiplayer trade (via WebRTC peer-to-peer, no server)

---

## Credits

**Design & Development** — [Derick (MisTAiM)](https://github.com/MisTAiM)

**Inspired by:**
- *Melvor Idle* — for showing how deep a browser idle can go
- *Old School RuneScape* — for the skill progression skeleton
- *ForgeIdle Online* — design doc contributions for alignment, factions, status effects, abilities
- *Dungeons & Dragons* — alignment axis mathematics
- *Dark Souls / Elden Ring* — aesthetic tone

**Fonts** (via Google Fonts CDN):
- **Cinzel** — display / headings
- **Crimson Text** — body copy
- **JetBrains Mono** — numeric displays, code

**License** — MIT. Do whatever you want with the code.

---

*"In the Ashfall's wake, only the forged survive."*

— **Play now at [ashfall-idle.vercel.app](https://ashfall-idle.vercel.app)** —
