// ============================================================
// ASHFALL IDLE — ADMIN TOOLS v1.0
// Notes, keyboard shortcuts, difficulty calculator, favorites
// ============================================================

class AdminTools {
  constructor() {
    this.notes = {};
    this.favorites = {
      items: [],
      monsters: []
    };
    this.loadNotes();
    this.loadFavorites();
  }

  // Admin Notes System
  saveNote(itemId, noteText) {
    this.notes[itemId] = {
      text: noteText,
      timestamp: new Date().toISOString(),
      user: online?.displayName || 'unknown'
    };

    localStorage.setItem('admin_notes_' + itemId, JSON.stringify(this.notes[itemId]));
  }

  getNote(itemId) {
    return this.notes[itemId] || null;
  }

  loadNotes() {
    // Load from localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('admin_notes_')) {
        const itemId = key.replace('admin_notes_', '');
        try {
          this.notes[itemId] = JSON.parse(localStorage.getItem(key));
        } catch (e) {
          console.warn('Load note failed');
        }
      }
    });
  }

  // Favorites System
  addFavorite(type, id) {
    const arr = this.favorites[type];
    if (!arr.includes(id)) {
      arr.push(id);
      this.saveFavorites();
    }
  }

  removeFavorite(type, id) {
    const arr = this.favorites[type];
    this.favorites[type] = arr.filter(i => i !== id);
    this.saveFavorites();
  }

  isFavorite(type, id) {
    return this.favorites[type].includes(id);
  }

  saveFavorites() {
    localStorage.setItem('admin_favorites', JSON.stringify(this.favorites));
  }

  loadFavorites() {
    try {
      const saved = localStorage.getItem('admin_favorites');
      if (saved) {
        this.favorites = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Load favorites failed');
    }
  }

  // Difficulty Calculator
  calculateMonsterDifficulty(monsterId) {
    const monster = GAME_DATA.monsters[monsterId];
    if (!monster) return null;

    const hp = monster.hp || 50;
    const damage = monster.maxHit || 10;
    const level = monster.combatLevel || 1;

    // Difficulty score (0-100)
    const hpScore = Math.min(100, (hp / level) * 2);
    const damageScore = Math.min(100, (damage / level) * 2);
    const levelScore = Math.min(100, level);

    const difficulty = Math.round((hpScore + damageScore + levelScore) / 3);

    return {
      score: difficulty,
      rating: difficulty < 20 ? '🟢 Easy' : difficulty < 40 ? '🟡 Normal' : difficulty < 60 ? '🟠 Hard' : '🔴 Very Hard',
      hpScore: Math.round(hpScore),
      damageScore: Math.round(damageScore),
      levelScore: Math.round(levelScore)
    };
  }

  renderKeyboardShortcuts() {
    const shortcuts = [
      { keys: 'Ctrl+K', action: 'Global Search' },
      { keys: 'Ctrl+Z', action: 'Undo' },
      { keys: 'Ctrl+Shift+Z', action: 'Redo' },
      { keys: 'ESC', action: 'Close Modals' },
      { keys: 'Ctrl+S', action: 'Save (on forms)' },
      { keys: 'Tab', action: 'Navigate Forms' }
    ];

    return `
      <div class="adm-section">
        <h3>⌨️ Keyboard Shortcuts</h3>
        <div style="background:rgba(0,0,0,0.2); padding:10px; border-radius:6px">
          ${shortcuts.map(sc => `
            <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid rgba(201,135,62,0.1)">
              <div style="font-family:monospace; color:#c9873e; font-weight:bold">${sc.keys}</div>
              <div style="color:var(--text-dim)">${sc.action}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderDifficultyWidget(monsterId) {
    const difficulty = this.calculateMonsterDifficulty(monsterId);
    if (!difficulty) return '';

    return `
      <div style="background:rgba(0,0,0,0.2); padding:12px; border-radius:6px; margin-bottom:12px">
        <h4 style="margin-top:0; color:#c9873e">⚔️ Difficulty Analysis</h4>
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:10px">
          <div>
            <div style="font-size:11px; color:var(--text-dim)">Overall</div>
            <div style="font-size:18px; font-weight:bold">${difficulty.rating}</div>
            <div style="font-size:12px; color:#aaa">${difficulty.score}/100</div>
          </div>
          <div>
            <div style="font-size:11px; color:var(--text-dim)">HP Factor</div>
            <div style="font-size:16px; font-weight:bold; color:#7dcc44">${difficulty.hpScore}</div>
          </div>
          <div>
            <div style="font-size:11px; color:var(--text-dim)">Damage Factor</div>
            <div style="font-size:16px; font-weight:bold; color:#ff6b6b">${difficulty.damageScore}</div>
          </div>
        </div>
        
        <div style="width:100%; height:6px; background:rgba(0,0,0,0.3); border-radius:3px; overflow:hidden">
          <div style="width:${difficulty.score}%; height:100%; background:${
            difficulty.score < 20 ? '#7dcc44' : 
            difficulty.score < 40 ? '#ffd700' :
            difficulty.score < 60 ? '#ff8800' : '#ff6b6b'
          }"></div>
        </div>
      </div>
    `;
  }

  renderNotesUI(itemId) {
    const note = this.getNote(itemId);

    return `
      <div style="background:rgba(0,0,0,0.2); padding:10px; border-radius:6px; margin-bottom:10px">
        <h4 style="margin-top:0; color:#c9873e">📝 Admin Notes</h4>
        <textarea id="admin-note-${itemId}" class="bank-search-input" style="width:100%; height:80px; margin-bottom:8px" placeholder="Add notes about this item...">${note?.text || ''}</textarea>
        <button class="btn btn-xs" onclick="adminTools.saveNote('${itemId}', document.getElementById('admin-note-${itemId}').value); ui.toast({type:'success', text:'Note saved'})">💾 Save Note</button>
        ${note ? `<div style="font-size:10px; color:var(--text-dim); margin-top:6px">Last updated: ${new Date(note.timestamp).toLocaleString()}</div>` : ''}
      </div>
    `;
  }
}

const adminTools = new AdminTools();
