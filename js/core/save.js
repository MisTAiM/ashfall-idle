// ================================================================
// ASHFALL IDLE — core/save.js
// All save/load logic in one place. One migrateSave chain.
// Extracted from: engine.js
// ================================================================

// These methods are added to GameEngine.prototype after engine.js loads.
// Loads AFTER core/engine.js.

(function() {
  const E = GameEngine.prototype;

  // Expose newGame using the canonical state blueprint
  E.newGame = function() {
    return _ashfallDefaultState();
  };

  const _origSave = E.save;
  E.save = function() {
    this.state.lastSave = Date.now();
    try {
      const payload = JSON.stringify(this.state);
      if (!payload || payload.length < 50) { console.error('[Ashfall] Save aborted: payload too small'); return; }
      localStorage.setItem('ashfall_save_backup', localStorage.getItem('ashfall_save') || '');
      localStorage.setItem('ashfall_save', payload);
    } catch(e) {
      console.error('[Ashfall] Save failed:', e.message);
      this.emit('notification', { type:'danger', text:'Save failed — storage may be full.' });
    }
  };

  E.loadSave = function() {
    try {
      const raw = localStorage.getItem('ashfall_save');
      if (raw) return JSON.parse(raw);
    } catch(e) {
      console.error('[Ashfall] Main save corrupted, trying backup...');
      try {
        const backup = localStorage.getItem('ashfall_save_backup');
        if (backup) {
          const data = JSON.parse(backup);
          this.emit('notification', { type:'warn', text:'Loaded from backup save.' });
          return data;
        }
      } catch(e2) {}
    }
    return null;
  };

  E.deleteSave = function() {
    localStorage.removeItem('ashfall_save');
    localStorage.removeItem('ashfall_save_backup');
    this.state = this.newGame();
    this.emit('init', this.state);
  };

  E.exportSave = function() { return btoa(JSON.stringify(this.state)); };

  E.importSave = function(str) {
    try {
      const d = JSON.parse(atob(str));
      if (!d || !d.skills || !d.bank || !d.combat) {
        this.emit('notification', { type:'danger', text:'Invalid save data.' });
        return false;
      }
      this.state = d;
      this.migrateSave();
      this.save();
      this.emit('init', this.state);
      return true;
    } catch(e) {
      this.emit('notification', { type:'danger', text:'Import failed: corrupted data.' });
      return false;
    }
  };

  console.log('[Ashfall] core/save.js loaded — save/load system active.');
})();
