// ================================================================
// ASHFALL IDLE — services/debug.js
// Debug system, error handler, and logging. Dev-only.
// Merges: debug-system.js + error-handler.js + logging-system.js
// ================================================================
// ================================================================
// ASHFALL IDLE — Error Handler & Recovery System v1.0
// Centralized error management with telemetry & user recovery
// Production-grade error handling, not console dumps
// ================================================================

class AshfallError extends Error {
  constructor(code, message, context = {}, severity = 'error') {
    super(message);
    this.name = 'AshfallError';
    this.code = code;
    this.context = context;
    this.severity = severity; // 'debug', 'info', 'warn', 'error', 'fatal'
    this.timestamp = new Date().toISOString();
    this.url = window.location.href;
    this.userAgent = navigator.userAgent;
    this.stack = new Error().stack;
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      severity: this.severity,
      timestamp: this.timestamp,
      context: this.context,
      url: this.url,
      userAgent: this.userAgent,
      stack: this.stack
    };
  }
}

// ── ERROR CODES REGISTRY ──────────────────────────────────────
const ERROR_CODES = {
  // Skill System
  SKILL_NOT_FOUND: { code: 'SKILL_001', msg: 'Skill not found in GAME_DATA' },
  SKILL_LEVEL_INSUFFICIENT: { code: 'SKILL_002', msg: 'Level requirement not met' },
  SKILL_ALREADY_ACTIVE: { code: 'SKILL_003', msg: 'Already training a skill' },
  
  // Combat System
  COMBAT_MONSTER_NOT_FOUND: { code: 'COMBAT_001', msg: 'Monster not found' },
  COMBAT_INVALID_ABILITY: { code: 'COMBAT_002', msg: 'Invalid combat ability' },
  COMBAT_INSUFFICIENT_RESOURCES: { code: 'COMBAT_003', msg: 'Insufficient combat resources' },
  
  // Inventory System
  INVENTORY_ITEM_NOT_FOUND: { code: 'INV_001', msg: 'Item not found in inventory' },
  INVENTORY_FULL: { code: 'INV_002', msg: 'Inventory is full' },
  INVENTORY_INSUFFICIENT_QUANTITY: { code: 'INV_003', msg: 'Not enough of this item' },
  INVENTORY_INVALID_SLOT: { code: 'INV_004', msg: 'Invalid inventory slot' },
  
  // Quest System
  QUEST_NOT_FOUND: { code: 'QUEST_001', msg: 'Quest not found' },
  QUEST_PREREQUISITE_NOT_MET: { code: 'QUEST_002', msg: 'Quest prerequisites not completed' },
  QUEST_ALREADY_COMPLETED: { code: 'QUEST_003', msg: 'Quest already completed' },
  
  // Firebase/Network
  FIREBASE_NOT_INITIALIZED: { code: 'FB_001', msg: 'Firebase not initialized' },
  FIREBASE_AUTH_FAILED: { code: 'FB_002', msg: 'Firebase authentication failed' },
  FIREBASE_SYNC_FAILED: { code: 'FB_003', msg: 'Failed to sync with Firebase' },
  NETWORK_TIMEOUT: { code: 'NET_001', msg: 'Network request timeout' },
  OFFLINE_MODE: { code: 'NET_002', msg: 'Currently offline, changes will sync when online' },
  
  // Validation
  INVALID_PARAMETER: { code: 'VAL_001', msg: 'Invalid parameter' },
  INVALID_STATE: { code: 'VAL_002', msg: 'Invalid game state' },
  DATA_CORRUPTION: { code: 'VAL_003', msg: 'Data integrity check failed' },
  
  // Performance
  MEMORY_WARNING: { code: 'PERF_001', msg: 'Memory usage critical' },
  FRAME_DROP: { code: 'PERF_002', msg: 'Frame rate dropped' },
  
  // Unknown
  UNKNOWN_ERROR: { code: 'ERR_999', msg: 'Unknown error occurred' }
};

// ── ERROR HANDLER CLASS ───────────────────────────────────────
class ErrorHandler {
  constructor() {
    this.errors = [];
    this.maxErrors = 100; // Keep last 100 errors
    this.listeners = [];
    this.recoveryStrategies = new Map();
    this.offline = false;
    this.syncQueue = [];
    
    this._setupGlobalHandlers();
    this._setupNetworkDetection();
  }

  _setupGlobalHandlers() {
    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(
        new AshfallError(
          'PROMISE_REJECTION',
          event.reason?.message || 'Unhandled promise rejection',
          { reason: event.reason },
          'error'
        )
      );
      event.preventDefault();
    });

    // Catch global errors
    window.addEventListener('error', (event) => {
      if (event.error instanceof AshfallError) {
        this.handleError(event.error);
      } else {
        this.handleError(
          new AshfallError(
            'GLOBAL_ERROR',
            event.message || 'Unknown error',
            { filename: event.filename, lineno: event.lineno },
            'error'
          )
        );
      }
    });
  }

  _setupNetworkDetection() {
    window.addEventListener('online', () => {
      this.offline = false;
      console.log('[ErrorHandler] Back online, syncing queued operations...');
      this._processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.offline = true;
      console.warn('[ErrorHandler] Offline mode activated');
      if (typeof ui !== 'undefined') {
        ui.toast({
          type: 'warn',
          text: 'You are offline. Changes will sync when you reconnect.',
          duration: 5000
        });
      }
    });
  }

  handleError(error) {
    // Ensure it's an AshfallError
    if (!(error instanceof AshfallError)) {
      error = new AshfallError(
        'GENERIC_ERROR',
        error.message || 'Unknown error',
        { original: error },
        'error'
      );
    }

    // Store error
    this.errors.push(error);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log based on severity
    const logLevel = this._getSeverityLevel(error.severity);
    console.log(`%c[${error.severity.toUpperCase()}] ${error.code}`, 
      `color: ${this._getSeverityColor(error.severity)}; font-weight: bold;`,
      error.message,
      error.context
    );

    // Notify listeners
    this.listeners.forEach(listener => listener(error));

    // Try recovery strategy
    if (this.recoveryStrategies.has(error.code)) {
      const strategy = this.recoveryStrategies.get(error.code);
      try {
        strategy(error);
      } catch (e) {
        console.error('[ErrorHandler] Recovery strategy failed:', e);
      }
    }

    // User-facing notification for non-debug errors
    if (error.severity !== 'debug' && typeof ui !== 'undefined') {
      const userMessage = this._getUserMessage(error);
      ui.toast({
        type: error.severity === 'fatal' ? 'danger' : 'warn',
        text: userMessage,
        duration: error.severity === 'fatal' ? 10000 : 5000
      });
    }

    // Send to telemetry if not debug
    if (error.severity !== 'debug' && this.online && typeof online !== 'undefined') {
      this._sendToTelemetry(error).catch(e => {
        console.error('[ErrorHandler] Telemetry failed:', e);
      });
    }

    return error;
  }

  _getSeverityLevel(severity) {
    const levels = {
      'debug': 0, 'info': 1, 'warn': 2, 'error': 3, 'fatal': 4
    };
    return levels[severity] || 3;
  }

  _getSeverityColor(severity) {
    const colors = {
      'debug': '#888888',
      'info': '#0066cc',
      'warn': '#ff9900',
      'error': '#cc0000',
      'fatal': '#990000'
    };
    return colors[severity] || '#cc0000';
  }

  _getUserMessage(error) {
    // Map error codes to user-friendly messages
    const messages = {
      'SKILL_001': 'That skill doesn\'t exist. Please try again.',
      'SKILL_002': 'You don\'t have the required level for that.',
      'COMBAT_001': 'That monster no longer exists.',
      'INV_002': 'Your inventory is full.',
      'FIREBASE_SYNC_FAILED': 'Failed to save your progress. It will retry automatically.',
      'OFFLINE_MODE': 'You\'re offline. Your progress is saved locally.',
    };
    return messages[error.code] || error.message;
  }

  async _sendToTelemetry(error) {
    if (!online?.db) return;
    
    try {
      const ref = online.db.ref('/telemetry/errors').push();
      await ref.set({
        ...error.toJSON(),
        playerId: engine?.state?.id || 'anonymous',
        timestamp: new Date().getTime()
      });
    } catch (e) {
      // Don't throw if telemetry fails
      console.warn('[ErrorHandler] Could not save error telemetry:', e);
    }
  }

  registerRecoveryStrategy(errorCode, strategy) {
    this.recoveryStrategies.set(errorCode, strategy);
  }

  registerListener(callback) {
    this.listeners.push(callback);
  }

  _processSyncQueue() {
    // Process any queued operations
    while (this.syncQueue.length > 0) {
      const operation = this.syncQueue.shift();
      try {
        operation();
      } catch (e) {
        this.handleError(new AshfallError(
          'SYNC_OPERATION_FAILED',
          'Failed to sync queued operation',
          { operation: operation.name },
          'error'
        ));
        // Re-queue failed operation
        this.syncQueue.unshift(operation);
        break;
      }
    }
  }

  queueSync(operation) {
    this.syncQueue.push(operation);
    if (!this.offline) {
      this._processSyncQueue();
    }
  }

  getErrorLog() {
    return this.errors.map(e => e.toJSON());
  }

  clearErrorLog() {
    this.errors = [];
  }
}

// ── RECOVERY STRATEGIES ───────────────────────────────────────
function registerDefaultStrategies(handler) {
  // Skill level insufficient — suggest next milestone
  handler.registerRecoveryStrategy('SKILL_LEVEL_INSUFFICIENT', (error) => {
    const skillId = error.context.skillId;
    const requiredLevel = error.context.requiredLevel;
    const skill = GAME_DATA?.skills?.[skillId];
    if (skill && typeof ui !== 'undefined') {
      ui.toast({
        type: 'info',
        text: `${skill.name} requires level ${requiredLevel}. You have ${error.context.currentLevel}. Keep training!`,
        duration: 6000
      });
    }
  });

  // Combat ability invalid — suggest alternatives
  handler.registerRecoveryStrategy('COMBAT_INVALID_ABILITY', (error) => {
    if (typeof engine !== 'undefined' && engine.state.combat.active) {
      // Auto-switch to basic attack instead of crashing
      const fallbackAbility = 'basic_attack';
      if (typeof ui !== 'undefined') {
        ui.toast({
          type: 'warn',
          text: 'Ability unavailable. Switched to basic attack.',
          duration: 3000
        });
      }
    }
  });

  // Inventory full — suggest banking
  handler.registerRecoveryStrategy('INVENTORY_FULL', (error) => {
    if (typeof ui !== 'undefined') {
      ui.toast({
        type: 'warn',
        text: 'Inventory full! Bank some items to continue.',
        duration: 5000
      });
    }
  });

  // Firebase sync failed — queue for later
  handler.registerRecoveryStrategy('FIREBASE_SYNC_FAILED', (error) => {
    if (typeof engine !== 'undefined') {
      handler.queueSync(() => {
        engine.saveToCloud();
      });
    }
  });
}

// ── SAFE OPERATION WRAPPERS ───────────────────────────────────
function tryOperation(operation, errorCode, context = {}) {
  try {
    return operation();
  } catch (e) {
    errorHandler.handleError(new AshfallError(
      errorCode,
      e.message || 'Operation failed',
      { ...context, error: e.message },
      'error'
    ));
    return null;
  }
}

async function tryAsyncOperation(operation, errorCode, context = {}) {
  try {
    return await operation();
  } catch (e) {
    errorHandler.handleError(new AshfallError(
      errorCode,
      e.message || 'Async operation failed',
      { ...context, error: e.message },
      'error'
    ));
    return null;
  }
}

// ── VALIDATION HELPERS ───────────────────────────────────────
function validateSkillId(skillId) {
  if (!skillId || !GAME_DATA?.skills?.[skillId]) {
    throw new AshfallError('SKILL_NOT_FOUND', 'Invalid skill ID', { skillId }, 'warn');
  }
  return true;
}

function validateItemId(itemId) {
  if (!itemId || !GAME_DATA?.items?.[itemId]) {
    throw new AshfallError('ITEM_NOT_FOUND', 'Invalid item ID', { itemId }, 'warn');
  }
  return true;
}

function validateMonster(monsterId) {
  if (!monsterId || !GAME_DATA?.monsters?.[monsterId]) {
    throw new AshfallError('COMBAT_MONSTER_NOT_FOUND', 'Monster not found', { monsterId }, 'warn');
  }
  return true;
}

function validateGameState(state) {
  if (!state || typeof state !== 'object') {
    throw new AshfallError('INVALID_STATE', 'Game state is invalid', { state }, 'error');
  }
  return true;
}

// ── INITIALIZATION ────────────────────────────────────────────
const errorHandler = new ErrorHandler();
registerDefaultStrategies(errorHandler);

// Expose for admin panel
window.errorHandler = errorHandler;
window.AshfallError = AshfallError;

if (window._ASHFALL_DEBUG) {
  console.log('[Ashfall] Error Handler v1.0 loaded');
  console.log('  Registered error codes: ' + Object.keys(ERROR_CODES).length);
  console.log('  Available recovery strategies: ' + errorHandler.recoveryStrategies.size);
}

// ============================================================
// ASHFALL IDLE — UNIFIED LOGGING SYSTEM v1.0
// Real-time activity tracking, combat logging, and event history
// ============================================================

class GameLogger {
  constructor() {
    this.events = []; // All events across the game session
    this.maxEvents = 500; // Keep last 500 events in memory
    this.eventListeners = {};
    this.skillActivity = {}; // Tracks activities per skill
    this.categories = ['combat', 'skill', 'item', 'quest', 'system', 'social', 'drop'];
    this.filters = new Set(['combat', 'skill', 'item', 'quest', 'system', 'social', 'drop']);
    this.sortOrder = 'newest'; // 'newest' or 'oldest'
  }

  // Core event logging
  log(category, message, data = {}) {
    if (!this.categories.includes(category)) {
      console.warn(`[Logger] Unknown category: ${category}`);
      return;
    }

    const event = {
      id: Date.now() + Math.random(),
      timestamp: Date.now(),
      category,
      message,
      data,
      skill: data.skill || null,
      icon: this._getIcon(category, data),
    };

    this.events.push(event);
    if (this.events.length > this.maxEvents) {
      this.events.shift();
    }

    // Track skill activity
    if (data.skill) {
      if (!this.skillActivity[data.skill]) {
        this.skillActivity[data.skill] = { xp: 0, actions: 0, drops: 0 };
      }
      if (data.xp) this.skillActivity[data.skill].xp += data.xp;
      if (data.action) this.skillActivity[data.skill].actions += 1;
      if (data.drop) this.skillActivity[data.skill].drops += 1;
    }

    // Emit to listeners
    this._emit('eventLogged', event);
    return event;
  }

  // Combat-specific logging
  logCombatAction(who, action, dmg = 0, target = '', meta = {}) {
    const data = { who, action, dmg, target, ...meta };
    let message = '';

    if (who === 'player') {
      if (action === 'hit') message = `${meta.crit ? 'CRIT ' : ''}${dmg} → ${target}`;
      else if (action === 'miss') message = `Missed vs ${target}`;
      else if (action === 'ability') message = `${meta.abilityName} on ${target}`;
    } else {
      if (action === 'hit') message = `${target} hit for ${dmg}${meta.dot ? ' (DoT)' : ''}`;
      else if (action === 'miss') message = `${target} ${meta.dodge ? 'dodged' : 'blocked'} attack`;
    }

    return this.log('combat', message, data);
  }

  logXpGain(skill, amount, source = '') {
    return this.log('skill', `+${amount} ${skill} XP${source ? ` (${source})` : ''}`, {
      skill,
      xp: amount,
      source,
      action: true,
    });
  }

  logItemDrop(itemName, itemId, qty, source = '') {
    return this.log('drop', `Received ${qty}x ${itemName}`, {
      item: itemId,
      qty,
      source,
      drop: true,
    });
  }

  logQuestProgress(questName, progress = '') {
    return this.log('quest', `${questName}${progress ? `: ${progress}` : ''}`, {
      quest: questName,
    });
  }

  logSkillAction(skill, action, qty = 1) {
    return this.log('skill', `${action} (${skill})`, {
      skill,
      action: qty,
    });
  }

  // Filtering and retrieval
  getEvents(options = {}) {
    const {
      limit = 50,
      category = null,
      skill = null,
      search = '',
      sort = this.sortOrder,
    } = options;

    let result = [...this.events];

    // Filter by category
    if (category && this.categories.includes(category)) {
      result = result.filter(e => e.category === category);
    }

    // Filter by skill
    if (skill) {
      result = result.filter(e => e.data.skill === skill);
    }

    // Filter by search term
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(e => e.message.toLowerCase().includes(term));
    }

    // Apply active filters
    result = result.filter(e => this.filters.has(e.category));

    // Sort
    if (sort === 'oldest') {
      result = result.sort((a, b) => a.timestamp - b.timestamp);
    } else {
      result = result.sort((a, b) => b.timestamp - a.timestamp);
    }

    // Limit
    return result.slice(0, limit);
  }

  // Skill-specific activity
  getSkillActivity(skill) {
    return this.skillActivity[skill] || { xp: 0, actions: 0, drops: 0 };
  }

  getAllSkillActivity() {
    return this.skillActivity;
  }

  // Filter management
  setFilter(category, enabled) {
    if (enabled) {
      this.filters.add(category);
    } else {
      this.filters.delete(category);
    }
    this._emit('filtersChanged');
  }

  toggleFilter(category) {
    this.filters.has(category) ? this.filters.delete(category) : this.filters.add(category);
    this._emit('filtersChanged');
  }

  getActiveFilters() {
    return Array.from(this.filters);
  }

  // Clear data
  clear() {
    this.events = [];
    this.skillActivity = {};
    this._emit('cleared');
  }

  // Event listeners
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  off(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    }
  }

  _emit(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(cb => cb(data));
    }
  }

  // Helper to get icon for category
  _getIcon(category, data) {
    const icons = {
      combat: '⚔',
      skill: '📈',
      item: '📦',
      quest: '📜',
      system: '⚙',
      social: '💬',
      drop: '✨',
    };
    return icons[category] || '•';
  }

  // Export session data (for backup/analysis)
  export() {
    return {
      timestamp: Date.now(),
      sessionStart: this.events[0]?.timestamp || 0,
      events: this.events,
      skillActivity: this.skillActivity,
      totalEvents: this.events.length,
    };
  }
}

// Global logger instance
const gameLogger = new GameLogger();

// ================================================================
// ASHFALL IDLE — Debug System v1.0
// Performance profiling, memory tracking, frame rate monitoring
// Development-only tools for optimization
// ================================================================

class DebugSystem {
  constructor() {
    this.enabled = window._ASHFALL_DEBUG || false;
    this.level = 0; // 0=off, 1=errors, 2=warnings, 3=info, 4=verbose
    
    // Performance tracking
    this.frames = [];
    this.currentFPS = 60;
    this.slowFrames = [];
    this.frameThreshold = 16.67; // 60 FPS = 16.67ms per frame
    
    // Memory tracking
    this.memorySnapshots = [];
    this.memoryThreshold = 100 * 1024 * 1024; // 100MB warning
    
    // Function profiling
    this.profiles = new Map();
    this.callCounts = new Map();
    this.totalTimes = new Map();
    
    // Network tracking
    this.networkCalls = [];
    this.networkStats = { calls: 0, totalTime: 0, avgTime: 0 };
    
    // Custom markers (for identifying hot spots)
    this.markers = new Map();
    
    this._setupConsoleUI();
    this._startMonitoring();
  }

  // ── PERFORMANCE PROFILING ─────────────────────────────────
  profile(name, fn) {
    if (!this.enabled) return fn();
    
    const startTime = performance.now();
    const startMem = performance.memory?.usedJSHeapSize || 0;
    
    let result;
    try {
      result = fn();
    } finally {
      const endTime = performance.now();
      const endMem = performance.memory?.usedJSHeapSize || 0;
      const duration = endTime - startTime;
      const memDelta = endMem - startMem;
      
      this._recordProfile(name, duration, memDelta);
    }
    
    return result;
  }

  async profileAsync(name, asyncFn) {
    if (!this.enabled) return asyncFn();
    
    const startTime = performance.now();
    const startMem = performance.memory?.usedJSHeapSize || 0;
    
    try {
      return await asyncFn();
    } finally {
      const endTime = performance.now();
      const endMem = performance.memory?.usedJSHeapSize || 0;
      const duration = endTime - startTime;
      const memDelta = endMem - startMem;
      
      this._recordProfile(name, duration, memDelta);
    }
  }

  _recordProfile(name, duration, memDelta) {
    if (!this.profiles.has(name)) {
      this.profiles.set(name, []);
      this.callCounts.set(name, 0);
      this.totalTimes.set(name, 0);
    }
    
    this.profiles.get(name).push({ duration, memDelta, time: Date.now() });
    this.callCounts.set(name, (this.callCounts.get(name) || 0) + 1);
    this.totalTimes.set(name, (this.totalTimes.get(name) || 0) + duration);
    
    if (duration > 50) { // Warn if took > 50ms
      this.warn(`⚠️ Slow operation: ${name} took ${duration.toFixed(2)}ms`);
    }
  }

  // ── FRAME RATE MONITORING ─────────────────────────────────
  startFrameMonitoring() {
    let lastTime = performance.now();
    
    const measureFrame = () => {
      const now = performance.now();
      const deltaTime = now - lastTime;
      lastTime = now;
      
      this.frames.push({
        time: now,
        deltaTime: deltaTime
      });
      
      // Keep last 300 frames (~5 seconds at 60 FPS)
      if (this.frames.length > 300) {
        this.frames.shift();
      }
      
      // Track slow frames
      if (deltaTime > this.frameThreshold) {
        this.slowFrames.push({ time: now, deltaTime });
        if (this.slowFrames.length > 50) {
          this.slowFrames.shift();
        }
      }
      
      // Calculate current FPS
      if (this.frames.length > 1) {
        const avgDeltaTime = this.frames.reduce((sum, f) => sum + f.deltaTime, 0) / this.frames.length;
        this.currentFPS = Math.round(1000 / avgDeltaTime);
      }
      
      requestAnimationFrame(measureFrame);
    };
    
    requestAnimationFrame(measureFrame);
    this.info('Frame monitoring started');
  }

  getFPSReport() {
    return {
      currentFPS: this.currentFPS,
      avgFPS: this.frames.length > 0 
        ? Math.round(1000 * this.frames.length / this.frames.reduce((sum, f) => sum + f.deltaTime, 0))
        : 0,
      slowFrameCount: this.slowFrames.length,
      slowestFrame: this.slowFrames.length > 0 
        ? Math.max(...this.slowFrames.map(f => f.deltaTime)).toFixed(2) + 'ms'
        : 'N/A'
    };
  }

  // ── MEMORY TRACKING ───────────────────────────────────────
  getMemoryReport() {
    if (!performance.memory) {
      return { note: 'Memory API not available (Chrome only)' };
    }
    
    const mem = performance.memory;
    const usedPercent = (mem.usedJSHeapSize / mem.jsHeapSizeLimit * 100).toFixed(1);
    
    this.memorySnapshots.push({
      timestamp: Date.now(),
      used: mem.usedJSHeapSize,
      limit: mem.jsHeapSizeLimit,
      total: mem.totalJSHeapSize
    });
    
    // Keep last 100 snapshots
    if (this.memorySnapshots.length > 100) {
      this.memorySnapshots.shift();
    }
    
    return {
      usedMB: (mem.usedJSHeapSize / 1024 / 1024).toFixed(2),
      limitMB: (mem.jsHeapSizeLimit / 1024 / 1024).toFixed(2),
      usedPercent: usedPercent,
      warning: parseFloat(usedPercent) > 80 ? '⚠️ HIGH MEMORY USAGE' : null
    };
  }

  // ── NETWORK TRACKING ──────────────────────────────────────
  trackNetworkCall(name, duration) {
    this.networkCalls.push({
      name,
      duration,
      timestamp: Date.now()
    });
    
    if (this.networkCalls.length > 100) {
      this.networkCalls.shift();
    }
    
    this.networkStats.calls++;
    this.networkStats.totalTime += duration;
    this.networkStats.avgTime = this.networkStats.totalTime / this.networkStats.calls;
    
    if (duration > 1000) {
      this.warn(`⚠️ Slow network call: ${name} took ${duration.toFixed(0)}ms`);
    }
  }

  getNetworkReport() {
    const recentCalls = this.networkCalls.slice(-20);
    return {
      totalCalls: this.networkStats.calls,
      averageTime: this.networkStats.avgTime.toFixed(2) + 'ms',
      recentCalls: recentCalls.map(c => `${c.name}: ${c.duration.toFixed(0)}ms`),
    };
  }

  // ── MARKERS (Custom Profiling Points) ──────────────────────
  mark(name) {
    this.markers.set(name, performance.now());
  }

  measure(name, startMark, endMark) {
    const startTime = this.markers.get(startMark);
    const endTime = this.markers.get(endMark);
    
    if (startTime && endTime) {
      const duration = endTime - startTime;
      this.info(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
      return duration;
    }
    return null;
  }

  // ── LOGGING WITH LEVELS ──────────────────────────────────
  debug(msg, data = {}) {
    if (this.level >= 4) {
      console.log(`%c[DEBUG]`, 'color: #888; font-weight: bold;', msg, data);
    }
  }

  info(msg, data = {}) {
    if (this.level >= 3) {
      console.log(`%c[INFO]`, 'color: #0066cc; font-weight: bold;', msg, data);
    }
  }

  warn(msg, data = {}) {
    if (this.level >= 2) {
      console.warn(`%c[WARN]`, 'color: #ff9900; font-weight: bold;', msg, data);
    }
  }

  error(msg, data = {}) {
    if (this.level >= 1) {
      console.error(`%c[ERROR]`, 'color: #cc0000; font-weight: bold;', msg, data);
    }
  }

  // ── STARTUP DIAGNOSTICS ──────────────────────────────────
  getDiagnostics() {
    return {
      performance: this.getFPSReport(),
      memory: this.getMemoryReport(),
      network: this.getNetworkReport(),
      profiles: Array.from(this.profiles.entries()).map(([name, samples]) => ({
        name,
        callCount: this.callCounts.get(name),
        totalTime: this.totalTimes.get(name).toFixed(2) + 'ms',
        avgTime: (this.totalTimes.get(name) / this.callCounts.get(name)).toFixed(2) + 'ms',
        maxTime: Math.max(...samples.map(s => s.duration)).toFixed(2) + 'ms',
        minTime: Math.min(...samples.map(s => s.duration)).toFixed(2) + 'ms'
      }))
    };
  }

  // ── CONSOLE UI ────────────────────────────────────────────
  _setupConsoleUI() {
    window.DEBUG = {
      report: () => {
        console.table(this.getDiagnostics());
      },
      fps: () => this.getFPSReport(),
      memory: () => this.getMemoryReport(),
      network: () => this.getNetworkReport(),
      profiles: () => Array.from(this.profiles.entries()),
      slowFrames: () => this.slowFrames,
      enable: () => { this.enabled = true; this.level = 4; console.log('Debug enabled'); },
      disable: () => { this.enabled = false; this.level = 0; console.log('Debug disabled'); },
      setLevel: (n) => { this.level = n; console.log(`Debug level set to ${n}`); },
    };
    
    if (this.enabled) {
      console.log('%c🐛 DEBUG MODE ACTIVE', 'color: #ff00ff; font-size: 16px; font-weight: bold;');
      console.log('Type DEBUG.report() for diagnostics');
      console.log('Type DEBUG.fps(), DEBUG.memory(), DEBUG.network() for specific data');
    }
  }

  _startMonitoring() {
    if (!this.enabled) return;
    
    this.startFrameMonitoring();
    
    // Log memory every 10 seconds
    setInterval(() => {
      const memReport = this.getMemoryReport();
      if (memReport.warning) {
        this.warn('Memory usage high: ' + memReport.usedPercent + '%');
      }
    }, 10000);
  }
}

// ── GLOBAL DEBUG INSTANCE ─────────────────────────────────────
const debugSystem = new DebugSystem();
debugSystem.level = window._ASHFALL_DEBUG ? 3 : 0;

// Expose to window
window.debugSystem = debugSystem;
window.DEBUG = window.DEBUG || {};

// ── INTEGRATION HOOKS ─────────────────────────────────────────
// Wrap engine tick for profiling
if (typeof GameEngine !== 'undefined') {
  const originalTick = GameEngine.prototype.tick;
  GameEngine.prototype.tick = function(now, prevNow) {
    return debugSystem.profile('engine.tick', () => {
      return originalTick.call(this, now, prevNow);
    });
  };
}

// Wrap Firebase operations
if (typeof online !== 'undefined') {
  const originalSync = online.saveProfile;
  if (originalSync) {
    online.saveProfile = async function(...args) {
      const start = performance.now();
      try {
        const result = await originalSync.apply(this, args);
        debugSystem.trackNetworkCall('Firebase.saveProfile', performance.now() - start);
        return result;
      } catch (e) {
        debugSystem.trackNetworkCall('Firebase.saveProfile (failed)', performance.now() - start);
        throw e;
      }
    };
  }
}

if (window._ASHFALL_DEBUG) {
  console.log('[Ashfall] Debug System v1.0 loaded');
  console.log('  Frame monitoring: active');
  console.log('  Memory tracking: active');
  console.log('  Profiling enabled');
  console.log('  Type DEBUG.report() for full diagnostics');
}
