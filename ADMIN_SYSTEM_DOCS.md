# 🎛️ ASHFALL IDLE — PRODUCTION ADMIN SYSTEM v5.0

**Complete Game Control & Management Platform**

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Access & Authentication](#access--authentication)
3. [Feature Breakdown](#feature-breakdown)
4. [Tab Reference](#tab-reference)
5. [API & Integration](#api--integration)
6. [Firebase Persistence](#firebase-persistence)
7. [Best Practices](#best-practices)

---

## Overview

The Production Admin System is a **comprehensive game management platform** with **50+ features** for complete control over:
- Player management & moderation
- Economy & multipliers
- Content creation & management
- Item imaging & metadata
- Event scheduling
- Analytics & reporting

**Location:** `js/prod-admin-system.js` (831 lines)  
**Instance:** Global `prodAdminSystem` object  
**UI:** 12-tab floating panel (800px, right side)

---

## Access & Authentication

### Who Can Access?

1. **UID Match**: Matches `ndLiweJRdGbaqWIbPgIj0Izigez2` (hardcoded admin)
2. **Session Storage**: `sessionStorage.getItem('admin_verified') === 'true'`

### Enable Admin Mode

```javascript
// In browser console:
sessionStorage.setItem('admin_verified', 'true');
location.reload();
```

### Opening the Panel

1. Load **ashfall-idle.vercel.app**
2. Look for **👑 ADMIN SYSTEM** button in sidebar
3. Click to open 800px floating panel
4. Use tab buttons to navigate

---

## Feature Breakdown

### 🎛️ Tab 1: Dashboard
**System Status & Quick Actions**

| Feature | Action | Effect |
|---------|--------|--------|
| Multiplier Display | View current | Shows XP/Drop/Gold rates |
| Active Bans Count | Monitor | Real-time ban count |
| Active Restrictions | Monitor | Restriction status |
| Full Save | Button | `game.save()` + Firebase sync |
| Database Backup | Button | Snapshot current state |
| Reload Config | Button | `location.reload()` |
| Clear Cache | Button | `localStorage.clear()` |
| Server Status | Monitor | Game health check |

---

### 👥 Tab 2: Players
**Player Management & Bulk Operations**

**Search System:**
- Search by player name or UID
- Results show in dropdown
- Click to select player

**Individual Actions:**
- Reset all skills to level 1
- Wipe entire inventory
- Reset prestige rank to 0
- Grant rank/title
- Revoke rank/title

**Bulk Operations:**
- Give gold to multiple players (comma-separated UIDs)
- Give items to multiple players
- Reset multiple players at once

**Tracked Stats:**
- Playtime calculation (milliseconds → hours)
- Prestige rank display
- Total level sum
- Bank item count

---

### 🚫 Tab 3: Bans
**Ban & Restriction Management**

**Ban System:**
```
Ban UI:
├─ Player UID input
├─ Reason input
├─ Duration selector (1h / 1d / 7d / 30d / Permanent)
├─ BAN button → adds to this.bans[uid]
└─ Ban list with dates & reasons
```

**Stored Ban Data:**
```javascript
this.bans = {
  'uid123': { reason: 'RMT activity', date: '5/10/2026 14:32:18' },
  'uid456': { reason: 'Offensive language', date: '5/10/2026 12:00:00' }
}
```

**Restriction Types:**
- **Trading Restriction**: Can't trade with bazaar
- **PvP Restriction**: Can't enter PvP arena
- **Chat Mute**: Can't send messages
- **Bazaar Ban**: Can't use shop/market

**Active Ban Display:**
- Shows UID, reason, and date
- Red theme (rgba(255,107,107,0.1))
- Max height 300px (scrollable)

---

### 💰 Tab 4: Economy
**Financial & Multiplier Control**

**Real-Time Multipliers:**
```
XP Multiplier:
  Range: 0.1x - 10x
  Default: 1x
  Slider: smooth adjustment
  Effect: LIVE on all XP gains

Gold Multiplier:
  Range: 0.1x - 10x
  Default: 1x
  Slider: smooth adjustment
  Effect: LIVE on all gold drops

Drop Multiplier:
  Range: 0.1x - 10x
  Default: 1x
  Slider: smooth adjustment
  Effect: LIVE on all item drops
```

**Item Pricing System:**
- Select item from dropdown (first 50 items)
- Enter custom gold price
- Click "Set" → adds to `this.itemPrices[itemId]`
- Stored in Firebase for persistence

**Transaction Log:**
- Displays last 10 transactions
- Format: `[PRICE] item_name set to 500g`
- Persists up to 100 entries
- Auto-sync to Firebase every 5 minutes

**Economy Actions:**
- **Gold Sink**: Remove gold from top players (prevent inflation)
- **Inflation Adjust**: Global price multiplier
- Both trigger transaction log entry

---

### 📦 Tab 5: Content
**Monster, Quest, and Item Management**

**Content Statistics:**
```
Display Grid:
├─ Total Items: n
├─ Total Monsters: n
└─ Total Quests: n
```

**Monster Difficulty Per Player:**
- Select monster from dropdown (30 shown)
- Enter player UID
- Set difficulty slider (0.1x - 5x)
- Click "Set" → stored in `this.monsterDifficulty[uid][monsterId]`

**Drop Rate Per Rarity:**
```
Sliders (0.1 - 3x):
├─ Common multiplier
├─ Rare multiplier
├─ Epic multiplier
├─ Legendary multiplier
├─ Mythic multiplier
└─ Special multiplier
```

**Application Logic:**
When player kills monster with rarity filter:
```javascript
const rarityMult = this.dropRates[rarity] || 1;
const finalChance = baseChance * rarityMult;
```

---

### 🖼️ Tab 6: Images
**Item Image Upload & Management**

**Upload Features:**
1. **File Selection**:
   - Drag & drop zone
   - Click to browse
   - Accepts any image format

2. **Item Association**:
   - Dropdown selects target item (100 shown)
   - Links image to item ID

3. **Size Handling**:
   - Max Width input (default 256px)
   - Max Height input (default 256px)
   - Canvas-based auto-resize
   - PNG compression (88% quality)

**Upload Process:**
```javascript
1. User selects file
2. FileReader reads as DataURL
3. resizeImage() called with max dimensions
4. Canvas resizes maintaining aspect ratio
5. Stored in this.uploadedImages[itemId]
6. Displayed in item UI on load
```

**Image Storage:**
```javascript
this.uploadedImages = {
  'item_sword': 'data:image/png;base64,iVBORw0KGgo...',
  'item_shield': 'data:image/png;base64,iVBORw0KGgo...',
}
```

**Management:**
- View all uploaded images (scrollable list)
- Delete button for each image
- Shows item ID and delete confirmation
- Persists to Firebase

---

### 📜 Tab 7: Quests
**Quest Unlock, Completion, & Rewards**

**Quest Selection:**
- Dropdown with quest names (50 shown)
- Shows quest ID and name

**Toggle Availability:**
- **Enable**: Makes quest available to all players
- **Disable**: Hides quest from quest log
- **Reset**: Clears quest completion for all players

**Quest Reward Multipliers:**
```
XP Reward Multiplier:
  Range: 0.1x - 5x
  Shows: Real-time value display
  Effect: Multiplies quest XP reward

Gold Reward Multiplier:
  Range: 0.1x - 5x
  Shows: Real-time value display
  Effect: Multiplies quest gold reward
```

**Bulk Quest Operations:**
- **Unlock All**: All quests enabled
- **Complete All**: All quests marked complete
- **Reset All**: All quests reverted to start

**Quest Tracking:**
```javascript
this.questStates = {
  'quest_tutorial': { enabled: true, rewarded: false },
  'quest_slayer': { enabled: true, rewarded: true },
}
```

---

### ⚔️ Tab 8: Skills
**Skill Management & XP Curve Adjustments**

**XP Curve System:**
- Select skill from dropdown (all 28+ skills)
- Adjust curve multiplier (0.1x - 3.0x)
- Multiplier affects: base XP → required XP per level
- Example: 2.0x doubles XP needed to level up

**Storage:**
```javascript
this.skillCurves = {
  'combat': 0.8,    // Easier combat leveling
  'magic': 1.5,     // Harder magic leveling
  'gathering': 1.0  // Normal gathering
}
```

**Individual Skill Actions:**
- **Reset Specific Skill**: Level → 1, XP → 0
- **Max Skill**: Level → 99, XP → maxXp
- **Unlock Skill**: Enable for player
- **Refund XP**: Return skill points to player

**Bulk Skill Operations:**
- **Reset All Skills**: All skills level 1
- **Max All Skills**: All skills level 99
- **Unlock All**: All skills enabled
- **Refund All**: All players get XP back

---

### 💀 Tab 9: Monsters
**Monster Stats & Difficulty Editing**

**Monster Editor:**
1. Select monster (50 shown)
2. Adjust multipliers:
   - HP Multiplier (0.1x - 5x)
   - Damage Multiplier (0.1x - 5x)
   - Gold Drop (0.1x - 5x)
   - Loot Multiplier (0.1x - 5x)
3. Click "Save Changes"

**Storage:**
```javascript
this.monsterDifficulty = {
  'player_uid': {
    'monster_dragon': 2.0,    // 2x harder
    'monster_goblin': 0.5     // 1/2 harder
  }
}
```

**Actions:**
- **Disable Monster**: Remove from spawn pool
- **Enable All Monsters**: Reset disabled list
- **Reset Stats**: Revert multipliers to 1x
- **Create Custom Boss**: Launch boss editor

---

### 🎉 Tab 10: Events
**Event Creation & Scheduling**

**Custom Event Creation:**
```
Inputs:
├─ Event Name (text)
├─ Description (textarea)
├─ Duration (datetime picker)
└─ CREATE button
```

**Quick Events (Pre-Built):**
- **2x XP Event**: `multipliers.xp = 2`
- **2x Drops Event**: `multipliers.drops = 2`
- **Weekend Bonus**: 2x gold + rare drops
- **Seasonal Event**: Custom multipliers

**Event Data:**
```javascript
{
  name: 'Double XP Weekend',
  description: 'All XP gains doubled!',
  startTime: 2026-05-10T00:00:00,
  endTime: 2026-05-12T23:59:59,
  active: true,
  multipliers: { xp: 2, drops: 1, gold: 1 }
}
```

**Broadcast:**
- When event created, sends to Firebase
- All players see notification
- Multipliers apply globally

---

### 🔨 Tab 11: Moderation
**Chat, Player Safety, & Reports**

**Report Management:**
- Dropdown filters (Active / Resolved / Complaints / Bugs)
- Shows report list (scrollable)
- Reports include: player, reason, date, status

**Moderation Actions:**
- **Mute Player**: Chat restriction (stores in `restrictions[uid]`)
- **Unmute Player**: Lifts chat restriction
- **Kick Player**: Remove from game immediately
- **Warn Player**: Formal warning (3 warnings = auto-ban)

**Auto-Moderation Settings:**
```javascript
autoMod = {
  offensive: true,      // Auto-mute curse words
  goldSellers: true,    // Detect & ban RMT
  rmtDetection: true,   // Monitor for real-money trades
  spamDetection: true   // Rate-limit messages
}
```

**How It Works:**
```
Player sends message
  ↓
Check for offensive words
  ↓
Check for gold-selling patterns
  ↓
Check message rate (>10 msgs/min)
  ↓
If violation → auto-mute + log + notify admin
```

---

### 📊 Tab 12: Analytics
**Detailed Reports & Data Export**

**Player Metrics:**
```
Display Grid (3 columns):
├─ Total Level (sum of all skills)
├─ Total Kills (monstersKilled stat)
└─ Playtime in Hours (milliseconds conversion)
```

**Economy Metrics:**
| Metric | Source | Formula |
|--------|--------|---------|
| Gold Earned | `state.stats.goldEarned` | Sum of all drops |
| Gold Spent | `state.stats.goldSpent` | Sum of purchases |
| Net Gold | Earned - Spent | Current balance indicator |
| Items Crafted | `state.stats.itemsCrafted` | Total crafted |

**Achievement Progress:**
- Quests Completed
- Items Crafted
- Food Eaten
- Gold Earned

**Export Options:**
- **CSV Export**: Comma-separated values (Excel compatible)
- **JSON Export**: Full state object backup

---

## Tab Reference

| Tab | Icon | Features | Actions |
|-----|------|----------|---------|
| Dashboard | 📊 | System status, multipliers, quick actions | Save, backup, reload, clear |
| Players | 👥 | Search, give items/gold, set levels, reset | Bulk operations, rewards |
| Bans | 🚫 | Ban system, restrictions, expiry | Add ban, remove ban, restrict |
| Economy | 💰 | Multipliers, pricing, transactions | Adjust rates, set prices |
| Content | 📦 | Monster difficulty, drop rates, stats | Edit per-player difficulty |
| Images | 🖼️ | Item uploads, resize, compress | Upload, delete, manage |
| Quests | 📜 | Enable/disable, rewards, completion | Reset, complete, bulk unlock |
| Skills | ⚔️ | XP curves, reset, max, unlock | Adjust difficulty, bulk reset |
| Monsters | 💀 | Stats, multipliers, disable | Edit difficulty, create boss |
| Events | 🎉 | Create, schedule, quick events | Activate event multipliers |
| Moderation | 🔨 | Reports, mute, kick, warn | Handle violations |
| Analytics | 📈 | Metrics, achievements, exports | Generate reports, download |

---

## API & Integration

### Global Instance

```javascript
// Access anywhere:
prodAdminSystem.multipliers.xp        // Current XP multiplier
prodAdminSystem.bans                  // Ban object
prodAdminSystem.transactionLog        // Last 100 transactions
prodAdminSystem.uploadedImages        // Item images
prodAdminSystem.setTab(tabName)       // Switch tabs
prodAdminSystem.action(actionName)    // Execute action
prodAdminSystem.open()                // Open panel
prodAdminSystem.close()               // Close panel
```

### Action List

```javascript
// Core
prodAdminSystem.action('full_save')
prodAdminSystem.action('database_backup')
prodAdminSystem.action('reload_config')
prodAdminSystem.action('clear_cache')

// Players
prodAdminSystem.action('reset_skills')
prodAdminSystem.action('wipe_inventory')
prodAdminSystem.action('reset_prestige')
prodAdminSystem.action('grant_rank')
prodAdminSystem.action('revoke_rank')

// Quests
prodAdminSystem.action('unlock_all_quests')
prodAdminSystem.action('complete_all_quests')
prodAdminSystem.action('reset_all_quests')

// Skills
prodAdminSystem.action('reset_all_skills')
prodAdminSystem.action('max_all_skills')
prodAdminSystem.action('unlock_all_skills')
prodAdminSystem.action('refund_skill_xp')

// Monsters
prodAdminSystem.action('disable_monster')
prodAdminSystem.action('enable_all_monsters')
prodAdminSystem.action('reset_monster_stats')
prodAdminSystem.action('spawn_custom_boss')

// Events
prodAdminSystem.action('event_double_xp')
prodAdminSystem.action('event_double_drops')
prodAdminSystem.action('event_weekend')
prodAdminSystem.action('event_seasonal')

// Moderation
prodAdminSystem.action('mute_player')
prodAdminSystem.action('unmute_player')
prodAdminSystem.action('kick_player')
prodAdminSystem.action('warn_player')

// Export
prodAdminSystem.action('export_csv')
prodAdminSystem.action('export_json')
```

---

## Firebase Persistence

### Auto-Save Data

The following is automatically synced to Firebase `/admin_data`:

```javascript
{
  bans: { ... },
  itemPrices: { ... },
  transactionLog: [ ... ]  // Last 100 only
}
```

### Enable Firebase Sync

1. Ensure Firebase is initialized (`firebase-config.js`)
2. Admin system auto-detects `online.db` reference
3. Calls `loadFromFirebase()` on init
4. Calls `saveToFirebase()` on close

### Manual Sync

```javascript
// Load from Firebase
prodAdminSystem.loadFromFirebase();

// Save to Firebase
prodAdminSystem.saveToFirebase();
```

---

## Best Practices

### ✅ DO:
- Use multipliers for temporary events (disable after event ends)
- Log all ban reasons in transaction log
- Test settings on test account before applying to live
- Back up database before major changes
- Use restrictions before bans (give players chance to comply)
- Export analytics weekly for trending analysis
- Check for RMT activity daily

### ❌ DON'T:
- Set multipliers above 5x without reason (economy breaks)
- Ban players without warning first
- Delete images without backup
- Change drop rates more than 2x per day
- Share admin access credentials
- Test multipliers during peak hours
- Leave events running indefinitely

### 🔐 Security:
- Only 1 admin UID hardcoded (changeable in code)
- Session storage verification on each action
- Firebase rules restrict admin data access
- All actions logged with timestamps
- No API key exposed in client code

### 📊 Monitoring:
```javascript
// Check health every 5 minutes:
setInterval(() => {
  console.log('Bans:', Object.keys(prodAdminSystem.bans).length);
  console.log('Transactions:', prodAdminSystem.transactionLog.length);
  console.log('Images:', Object.keys(prodAdminSystem.uploadedImages).length);
}, 300000);
```

---

## Keyboard Shortcuts (Planned)

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+A` | Toggle admin panel |
| `Esc` | Close admin panel |
| `Tab` | Next tab |
| `Shift+Tab` | Previous tab |

---

## Troubleshooting

**Admin button not showing?**
- Verify UID matches: `ndLiweJRdGbaqWIbPgIj0Izigez2`
- Check `sessionStorage.getItem('admin_verified')`
- Refresh page: `location.reload()`

**Changes not saving to Firebase?**
- Verify Firebase is connected
- Check console for Firebase errors
- Manually call `prodAdminSystem.saveToFirebase()`

**Images not uploading?**
- Check file size (should be <5MB before compression)
- Verify CORS settings
- Try different image format (PNG/JPG)

**Multipliers not taking effect?**
- Ensure game engine is reading from `realAdminPanel.multipliers`
- Check engine.js lines 672, 1528, 1589
- Kill & restart combat to apply changes

---

## Version History

**v5.0** (Current)
- 50+ features implemented
- Image upload with resize
- Complete moderation system
- Firebase persistence
- 12 fully functional tabs

**v4.1**
- Added Monsters, Items, Analytics tabs
- Multiplier integration verified
- Admin button fix

**v4.0**
- Initial admin panel release
- 6 core tabs
- Multiplier sliders

---

## Roadmap

- [ ] Player session history tracking
- [ ] Advanced economy graphs
- [ ] Item duplication prevention
- [ ] Patch notes system
- [ ] Server message broadcast
- [ ] Performance profiler
- [ ] Achievement editor
- [ ] Pet customization admin
- [ ] Ability marketplace
- [ ] Seasonal content manager

---

## Support & Contact

**Issues?** Check the console logs first.  
**Questions?** Review this documentation.  
**Bugs?** Report with screenshot + action taken.

---

**Last Updated:** May 10, 2026  
**Status:** ✅ Production Ready  
**Access Level:** Admin Only
