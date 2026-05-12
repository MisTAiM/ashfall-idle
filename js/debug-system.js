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
