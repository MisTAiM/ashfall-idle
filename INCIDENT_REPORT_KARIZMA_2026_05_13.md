# INCIDENT REPORT — Karizma Account Recovery

**Date:** May 13, 2026 02:45 UTC  
**Incident Type:** Accidental Stat Reset (All Skills → 99)  
**Status:** ✅ RESOLVED  
**Player UID:** `XZJGg6lDaUZej0aIgs63xEMg83h2`  
**Player Name:** Karizma  

---

## INCIDENT SUMMARY

Karizma's account was affected by an accidental administration command that reset all skill levels to 99 (max). The command `_admMaxAll()` in `admin.js` was invoked, likely by accident through the admin panel.

**Impact:**
- 29 skills reset to Level 99
- Correct progression lost
- Account restored within 12 hours

---

## ROOT CAUSE

The admin panel includes a **"Max All Skills"** button (line 1732 in `js/admin.js`) which executes:

```javascript
UI.prototype._admMaxAll = function(){
  for(const sk of Object.keys(game.state.skills)){
    game.state.skills[sk].level=99;
    game.state.skills[sk].xp=13034431;
  }
  online?.adminLog?.('max_skills',{});
  this.toast({type:'success',text:'All skills maxed'});
  this.renderSidebar();
  this.renderPage('admin');
};
```

**No confirmation dialog exists** before executing this irreversible action.

---

## RESTORATION

### Correct Account State (Restored)

| Skill        | Level | XP          |
|--------------|-------|-------------|
| Fishing      | 99    | 13,034,431  |
| Thieving     | 91    | 5,902,831   |
| Woodcutting  | 82    | 2,421,087   |
| Cooking      | 81    | 2,192,818   |
| Hunting      | 80    | 1,986,068   |
| Agility      | 77    | 1,475,581   |
| Defence      | 75    | 1,210,421   |
| Attack       | 73    | 992,895     |
| Strength     | 72    | 899,257     |
| Hitpoints    | 68    | 605,032     |
| Prayer       | 67    | 547,953     |
| Incantation  | 27    | 9,730       |
| Fletching    | 19    | 3,973       |
| Slayer       | 17    | 3,115       |
| Foraging     | 23    | 6,291       |
| Farming      | 4     | 276         |
| Crafting     | 9     | 969         |
| Summoning    | 2     | 83          |
| Necromancy   | 2     | 83          |
| Enchanting   | 0     | 0           |
| Alchemy      | 0     | 0           |
| Mining       | 1     | 0           |
| Smithing     | 1     | 0           |
| Ranged       | 1     | 0           |
| Magic        | 1     | 0           |
| Trading      | 1     | 0           |
| Leadership   | 1     | 0           |
| Tactics      | 1     | 0           |
| Diplomacy    | 1     | 0           |

**Total XP Restored:** 31,292,894  
**Average Level:** 34  
**Highest Skill:** Fishing (99)

### Recovery Method

1. **Data Source:** Player-provided backup of correct skill levels
2. **Firestore Collections Updated:**
   - `players/{uid}` — skill data corrected
   - `saves/{uid}` — cloud save updated with correct state
3. **Audit Trail:** Restoration logged in `admin_actions` collection with:
   - Action: `restore_player_stats`
   - Reason: Incident recovery
   - Timestamp: 2026-05-13T02:45:51.968Z
   - Skills restored: 29
   - Total XP restored: 31,292,894

### Verification

✅ Live verification completed — all skills now show correct levels in Firebase  
✅ Player can reload game and see restored stats immediately  
✅ Cloud save synchronized with restored state  

---

## PREVENTIVE MEASURES

### Immediate Actions (Next Commit)

1. **Add confirmation dialog to `_admMaxAll()`:**
   ```javascript
   UI.prototype._admMaxAll = function(){
     if(!confirm('⚠️ MAX ALL SKILLS TO 99?\n\nThis cannot be undone!\n\nType "CONFIRM" in the next dialog to proceed.')){
       return;
     }
     const response = prompt('Type CONFIRM to proceed:');
     if(response !== 'CONFIRM') return;
     
     // ... rest of function
   };
   ```

2. **Hide "Max All" button behind additional permission gate:**
   - Only show if user is explicitly on "dangerous_actions" whitelist
   - Log every single invocation with user details

3. **Implement backup versioning:**
   - Store 3 hourly snapshots of player save data
   - Enable point-in-time recovery for all accounts
   - Retain 7-day rolling backup window

### Long-Term Solutions

4. **Add admin action history to game UI:**
   - Players can see all actions taken on their account
   - Includes timestamp, admin name, action details

5. **Require two-factor approval for dangerous actions:**
   - Max skills, delete items, ban players
   - Requires second admin to confirm

6. **Implement account rollback feature:**
   - Players can request rollback within 24 hours
   - Automatic approval if no progress since rollback point

---

## TIMELINE

| Time (UTC)      | Event |
|-----------------|-------|
| ~2026-05-12 00:00 | Karizma at correct skill levels |
| 2026-05-13 02:34 | Incident: `_admMaxAll()` invoked — all skills set to 99 |
| 2026-05-13 02:34 | Account synced to Firebase with max stats |
| 2026-05-13 02:45 | Incident reported by user |
| 2026-05-13 02:45 | Restoration script executed |
| 2026-05-13 02:45 | ✅ Account successfully restored |

---

## LESSONS LEARNED

1. **Admin tools require careful UX design** — buttons that can't be undone need multi-step confirmation
2. **Backups must be automated** — relying on manual backups doesn't work in production
3. **Permission system must distinguish between read/write/dangerous** — not all admins should have access to account reset functions
4. **All admin actions must be logged with who/what/when** — helps trace incidents

---

## SIGN-OFF

**Incident Status:** ✅ CLOSED  
**Restoration Verified:** Yes  
**Follow-up Tickets Created:** See preventive measures above  

---

**Next Steps:**
- [ ] Implement confirmation dialogs for dangerous admin actions
- [ ] Deploy backup versioning system
- [ ] Add admin action history UI
- [ ] Review other dangerous admin functions for similar issues
