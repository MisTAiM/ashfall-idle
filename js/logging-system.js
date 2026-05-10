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
