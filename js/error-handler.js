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
