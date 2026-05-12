# 🛠️ Ashfall Idle — Developer Guide

## Error Handling & Debug Systems

### Quick Start

**Enable Debug Mode:**
```javascript
window._ASHFALL_DEBUG = true;
// Then reload page
```

**Check Diagnostics:**
```javascript
DEBUG.report();  // Full report in console table
DEBUG.fps();     // Frame rate info
DEBUG.memory();  // Memory usage
DEBUG.network(); // Network calls
```

---

## Error Handler Usage

### Throwing Errors (Preferred Way)

```javascript
// Throw validation error
if (!skillId || !GAME_DATA.skills[skillId]) {
  throw new AshfallError(
    'SKILL_NOT_FOUND',
    `Skill ${skillId} does not exist`,
    { skillId },
    'warn'  // severity: 'debug', 'info', 'warn', 'error', 'fatal'
  );
}
```

### Safe Operation Wrappers

```javascript
// Wrap risky operations
const result = tryOperation(
  () => engine.startSkill('mining', 'bronze_ore'),
  'SKILL_START_FAILED',
  { skillId: 'mining', actionId: 'bronze_ore' }
);

// Async operations
const data = await tryAsyncOperation(
  () => online.db.ref('/users/' + userId).once('value'),
  'FIREBASE_READ_FAILED',
  { path: '/users/' + userId }
);
```

### Handling Errors with Recovery

```javascript
try {
  // Risky code
  validateSkillId(skillId);
  validateMonster(monsterId);
  
} catch (error) {
  if (error instanceof AshfallError) {
    // Already handled by errorHandler
  } else {
    // Unexpected error
    errorHandler.handleError(new AshfallError(
      'UNEXPECTED_ERROR',
      error.message,
      { stack: error.stack },
      'error'
    ));
  }
}
```

### Custom Recovery Strategies

```javascript
// Register custom recovery for specific error
errorHandler.registerRecoveryStrategy('MY_CUSTOM_ERROR', (error) => {
  console.log('Recovering from custom error:', error);
  // Do recovery logic here
  engine.stopCombat();
  engine.save();
});

// Then throw that error type
if (someCondition) {
  throw new AshfallError(
    'MY_CUSTOM_ERROR',
    'Something went wrong',
    { context: 'data' },
    'error'
  );
}
```

---

## Debug System Usage

### Performance Profiling

```javascript
// Profile synchronous function
debugSystem.profile('calculateDamage', () => {
  return engine.calculateDamage(attacker, defender);
});

// Profile async operation
await debugSystem.profileAsync('saveToCloud', async () => {
  await online.saveProfile();
});
```

### Frame Rate Monitoring

```javascript
// Frame monitoring starts automatically in debug mode
const fps = debugSystem.getFPSReport();
console.log(`FPS: ${fps.currentFPS}, Slow frames: ${fps.slowFrameCount}`);
```

### Memory Tracking

```javascript
const mem = debugSystem.getMemoryReport();
console.log(`Memory: ${mem.usedPercent}% of ${mem.limitMB}MB`);
```

### Custom Markers

```javascript
// Mark start of operation
debugSystem.mark('startSkill');

// Do work...

// Mark end
debugSystem.mark('endSkill');

// Measure
debugSystem.measure('Total skill start time', 'startSkill', 'endSkill');
```

### Network Call Tracking

```javascript
const start = performance.now();
const result = await firebase.ref('/data').once('value');
debugSystem.trackNetworkCall('firebase.getData', performance.now() - start);
```

---

## Integration Best Practices

### In Skill System
```javascript
startSkill(skillId, actionId) {
  return tryOperation(() => {
    validateSkillId(skillId);
    const action = GAME_DATA.skills[skillId].actions[actionId];
    if (!action) {
      throw new AshfallError('ACTION_NOT_FOUND', 'Invalid action', { skillId, actionId }, 'warn');
    }
    
    // Real code here
    this.state.activeSkill = skillId;
    this.emit('skillStart', skillId);
  }, 'SKILL_START_FAILED', { skillId, actionId });
}
```

### In Combat System
```javascript
startCombat(monsterId) {
  return tryOperation(() => {
    validateMonster(monsterId);
    const monster = GAME_DATA.monsters[monsterId];
    
    if (this.state.combat.active) {
      throw new AshfallError(
        'COMBAT_ALREADY_ACTIVE',
        'Cannot start combat while already fighting',
        { currentMonster: this.state.combat.monster?.id },
        'warn'
      );
    }
    
    this.state.combat.monster = monster;
    this.state.combat.active = true;
    this.emit('combatStart', monsterId);
  }, 'COMBAT_START_FAILED', { monsterId });
}
```

### In Firebase Sync
```javascript
async saveToCloud() {
  return await tryAsyncOperation(
    async () => {
      validateGameState(this.state);
      const ref = online.db.ref('/players/' + this.state.id);
      await ref.set(this.compressState());
    },
    'FIREBASE_SAVE_FAILED',
    { playerId: this.state.id }
  );
}
```

---

## Error Codes Reference

### Skill System
- `SKILL_NOT_FOUND` — Skill doesn't exist
- `SKILL_LEVEL_INSUFFICIENT` — Player level too low
- `SKILL_ALREADY_ACTIVE` — Already training another skill

### Combat System
- `COMBAT_MONSTER_NOT_FOUND` — Monster data invalid
- `COMBAT_INVALID_ABILITY` — Ability doesn't exist
- `COMBAT_INSUFFICIENT_RESOURCES` — Not enough mana/resources

### Inventory
- `INVENTORY_ITEM_NOT_FOUND` — Item not in inventory
- `INVENTORY_FULL` — No space for more items
- `INVENTORY_INSUFFICIENT_QUANTITY` — Not enough of item

### Firebase
- `FIREBASE_NOT_INITIALIZED` — Firebase not ready
- `FIREBASE_SYNC_FAILED` — Sync operation failed
- `NETWORK_TIMEOUT` — Request took too long
- `OFFLINE_MODE` — Currently offline

### Validation
- `INVALID_PARAMETER` — Bad parameter passed
- `INVALID_STATE` — Game in invalid state
- `DATA_CORRUPTION` — Save file damaged

---

## Admin Panel Integration

### View Error Log

```javascript
// Access error history
console.log(errorHandler.getErrorLog());

// Shows last 100 errors with full context:
// [{
//   code: 'SKILL_002',
//   message: 'Level requirement not met',
//   severity: 'warn',
//   timestamp: '2026-05-12T...',
//   context: { skillId: 'magic', required: 50, current: 30 }
// }, ...]
```

### Clear Errors

```javascript
errorHandler.clearErrorLog();
```

### Listen for Errors (e.g., for admin dashboard)

```javascript
errorHandler.registerListener((error) => {
  // Update admin dashboard
  if (error.severity === 'fatal') {
    adminPanel.showAlert(`Fatal Error: ${error.code}`);
  }
});
```

---

## Console Commands (Debug Mode)

```javascript
// Frame rate
DEBUG.fps()
// Returns: { currentFPS: 60, avgFPS: 58, slowFrameCount: 0, slowestFrame: '18.2ms' }

// Memory usage
DEBUG.memory()
// Returns: { usedMB: '45.23', limitMB: '2048', usedPercent: '2.2', warning: null }

// Network stats
DEBUG.network()
// Returns: { totalCalls: 23, averageTime: '145.67ms', recentCalls: [...] }

// Full diagnostics table
DEBUG.report()

// Enable/disable
DEBUG.enable()
DEBUG.disable()
DEBUG.setLevel(4)  // 0=off, 1=errors, 2=warnings, 3=info, 4=verbose
```

---

## Performance Targets

- Page load: < 3 seconds
- Time to interactive: < 5 seconds
- Combat frame rate: 60 FPS
- Memory usage: < 100MB
- Firebase sync: < 500ms
- Slow frame threshold: > 16.67ms

---

## Common Error Scenarios & Solutions

### Scenario: "Slow operation" warning

**Problem:** Operation took > 50ms

**Solution:**
1. Check what operation: `debugSystem.profiles`
2. Profile that specific code: `debugSystem.profile('name', () => { ... })`
3. Identify bottleneck (heavy loop? Firebase call?)
4. Optimize: split work, add caching, async loading

### Scenario: Memory growing over time

**Problem:** `DEBUG.memory()` shows increasing percentage

**Solution:**
1. Check memory snapshots: `debugSystem.memorySnapshots`
2. Look for object creation without cleanup
3. Add debug logging around suspected leaks
4. Use Chrome DevTools Memory Profiler for deep analysis

### Scenario: Frame rate drops during raids

**Problem:** `DEBUG.fps()` shows slowFrameCount increasing

**Solution:**
1. Check `slowFrames` array for timing
2. Profile engine.tick during raid
3. Check if rendering 100+ elements
4. Optimize: CSS containment, viewport culling, requestAnimationFrame throttling

### Scenario: Firebase sync taking > 1000ms

**Problem:** Network calls slow

**Solution:**
1. Check compressed state size
2. Implement delta sync (only changed fields)
3. Batch multiple operations
4. Add offline queue with retry

---

## Next Steps

1. **Integrate error handling into all major systems**
   - Skill trainer (engine.js)
   - Combat system (engine-combat.js)
   - Quest system (quest-system.js)
   - Firebase sync (online.js)

2. **Add telemetry dashboard to admin panel**
   - Show error frequency
   - Track slow operations
   - Monitor memory usage
   - Network performance metrics

3. **Create performance benchmark suite**
   - Baseline metrics on first run
   - Track regression between updates
   - Alert if FPS drops below 50

4. **Implement auto-recovery**
   - Save state before risky operations
   - Auto-rollback on fatal errors
   - Sync queue for offline operations

---

**Questions?** Check error console or admin panel error log.

**Contributing?** Always wrap risky code in `try/catch` or `tryOperation()`.

**Testing?** Enable debug mode to see detailed operation logs.
