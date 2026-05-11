// ============================================================
// ASHFALL IDLE — UNDO/REDO SYSTEM v1.0
// Track last 20 changes, revert edits
// ============================================================

class UndoRedoSystem {
  constructor() {
    this.history = [];
    this.redoStack = [];
    this.maxHistory = 20;
  }

  recordChange(action, before, after, metadata = {}) {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action,
      before,
      after,
      metadata,
      user: online?.displayName || 'unknown',
      uid: online?.user?.uid || 'unknown'
    };

    this.history.push(entry);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    this.redoStack = []; // Clear redo stack on new action

    adminRoles.logAudit('EDIT_' + action, metadata);
    return entry.id;
  }

  undo() {
    if (this.history.length === 0) return false;

    const entry = this.history.pop();
    this.redoStack.push(entry);

    this.applyChange(entry.before, entry.action);
    
    if (typeof ui !== 'undefined') {
      ui.toast({ type: 'info', text: `↶ Undo: ${entry.action}` });
    }

    return true;
  }

  redo() {
    if (this.redoStack.length === 0) return false;

    const entry = this.redoStack.pop();
    this.history.push(entry);

    this.applyChange(entry.after, entry.action);
    
    if (typeof ui !== 'undefined') {
      ui.toast({ type: 'info', text: `↷ Redo: ${entry.action}` });
    }

    return true;
  }

  applyChange(data, actionType) {
    if (actionType.includes('ITEM')) {
      const { itemId, itemData } = data;
      GAME_DATA.items[itemId] = itemData;
    } else if (actionType.includes('MONSTER')) {
      const { monsterId, monsterData } = data;
      GAME_DATA.monsters[monsterId] = monsterData;
    } else if (actionType.includes('BRANDING')) {
      const { brandingData } = data;
      Object.assign(brandingEditor.config, brandingData);
      brandingEditor.apply();
    }

    if (typeof ui !== 'undefined') {
      ui.renderPage('admin');
    }
  }

  getHistory() {
    return this.history.slice().reverse();
  }

  getRedoStack() {
    return this.redoStack.slice().reverse();
  }

  renderHistoryPanel() {
    const hist = this.getHistory();
    
    return `
      <div class="adm-section">
        <h3>↶ Edit History (${hist.length}/${this.maxHistory})</h3>
        
        <div style="display:flex; gap:8px; margin-bottom:12px">
          <button class="btn btn-sm" onclick="undoRedo.undo()" ${hist.length === 0 ? 'disabled' : ''}>↶ Undo</button>
          <button class="btn btn-sm" onclick="undoRedo.redo()" ${this.redoStack.length === 0 ? 'disabled' : ''}>↷ Redo</button>
          <button class="btn btn-sm btn-danger" onclick="if(confirm('Clear all history?')) undoRedo.clear()">🗑 Clear</button>
        </div>

        <div style="max-height:300px; overflow-y:auto; background:rgba(0,0,0,0.2); border-radius:6px; padding:10px">
          ${hist.length > 0 ? hist.map((entry, idx) => `
            <div style="background:rgba(201,135,62,0.1); padding:8px; border-radius:4px; margin-bottom:6px; border-left:3px solid #c9873e">
              <div style="display:flex; justify-content:space-between; align-items:start; gap:8px">
                <div>
                  <div style="font-weight:bold; color:#c9873e; font-size:12px">${entry.action}</div>
                  <div style="font-size:11px; color:var(--text-dim)">${entry.user}</div>
                </div>
                <div style="font-size:10px; color:#aaa">${new Date(entry.timestamp).toLocaleTimeString()}</div>
              </div>
              ${entry.metadata.itemId ? `<div style="font-size:11px; color:#aaa; margin-top:4px">Item: ${entry.metadata.itemId}</div>` : ''}
              ${entry.metadata.monsterId ? `<div style="font-size:11px; color:#aaa; margin-top:4px">Monster: ${entry.metadata.monsterId}</div>` : ''}
            </div>
          `).join('') : '<div style="color:var(--text-dim)">No changes yet</div>'}
        </div>
      </div>
    `;
  }

  clear() {
    this.history = [];
    this.redoStack = [];
    if (typeof ui !== 'undefined') {
      ui.toast({ type: 'info', text: 'History cleared' });
    }
  }
}

const undoRedo = new UndoRedoSystem();

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undoRedo.undo();
    }
    if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
      e.preventDefault();
      undoRedo.redo();
    }
  }
});
