// ============================================================
// ASHFALL ADMIN — ROLE MANAGER
// Search players by name, assign/remove roles
// ============================================================

class AdminRoleManager {
  constructor() {
    this.selectedPlayer = null;
    this.selectedPlayerForRemove = null;
  }

  async searchPlayers(query) {
    if (!query || query.length < 2) {
      document.getElementById('admin-player-list')?.style && (document.getElementById('admin-player-list').style.display = 'none');
      return;
    }

    const list = document.getElementById('admin-player-list');
    if (!list) return;

    list.innerHTML = '<div style="padding:8px; color:var(--text-dim)">Searching...</div>';
    list.style.display = 'block';

    try {
      // Search Firestore /players collection
      const db = firebase.firestore();
      const snapshot = await db.collection('players')
        .where('name', '>=', query)
        .where('name', '<=', query + '\uf8ff')
        .limit(20)
        .get();

      const matches = [];
      snapshot.forEach(doc => {
        matches.push([doc.id, doc.data()]);
      });

      if (matches.length === 0) {
        list.innerHTML = '<div style="padding:8px; color:var(--text-dim)">No players found</div>';
        return;
      }

      list.innerHTML = matches.map(([uid, user]) => `
        <div style="padding:8px; border-bottom:1px solid rgba(201,135,62,0.1); cursor:pointer; hover:background:rgba(201,135,62,0.1)" onclick="adminRoleManager.selectPlayer('${uid}', '${this.escHtml(user.name || 'Unknown')}')">
          <strong>${this.escHtml(user.name || 'Unknown')}</strong> <span style="color:var(--text-dim); font-size:10px">Lvl ${user.combatLevel || 1}</span>
        </div>
      `).join('');
    } catch (e) {
      console.error('[RoleManager] Search failed:', e);
      list.innerHTML = '<div style="padding:8px; color:#ff6b6b">Error: ' + e.message + '</div>';
    }
  }

  selectPlayer(uid, name) {
    this.selectedPlayer = { uid, name };
    document.getElementById('admin-player-search').value = name;
    document.getElementById('admin-player-list').style.display = 'none';
    document.getElementById('admin-selected-name').textContent = name;
    document.getElementById('admin-player-selected').style.display = 'block';
  }

  async assignRole() {
    if (!this.selectedPlayer) {
      ui.toast({ type: 'danger', text: 'Select a player first' });
      return;
    }

    const role = document.getElementById('admin-assign-role')?.value;
    if (!role) {
      ui.toast({ type: 'danger', text: 'Select a role' });
      return;
    }

    if (!confirm(`Assign ${role} to ${this.selectedPlayer.name}?`)) return;

    try {
      await adminRoles.setUserRole(this.selectedPlayer.uid, role);
      ui.toast({ type: 'success', text: role + ' assigned to ' + this.selectedPlayer.name });
      
      // Clear form
      document.getElementById('admin-assign-role').value = '';
      document.getElementById('admin-player-search').value = '';
      document.getElementById('admin-player-selected').style.display = 'none';
      this.selectedPlayer = null;
      
      ui.renderPage('admin');
    } catch (e) {
      console.error('[RoleManager] Assign failed:', e);
      ui.toast({ type: 'danger', text: 'Failed: ' + e.message });
    }
  }

  async searchPlayersForRemove(query) {
    if (!query || query.length < 2) {
      document.getElementById('admin-remove-player-list')?.style && (document.getElementById('admin-remove-player-list').style.display = 'none');
      return;
    }

    const list = document.getElementById('admin-remove-player-list');
    if (!list) return;

    list.innerHTML = '<div style="padding:8px; color:var(--text-dim)">Searching...</div>';
    list.style.display = 'block';

    try {
      // Search Firestore /players collection
      const db = firebase.firestore();
      const snapshot = await db.collection('players')
        .where('name', '>=', query)
        .where('name', '<=', query + '\uf8ff')
        .limit(20)
        .get();

      const matches = [];
      snapshot.forEach(doc => {
        matches.push([doc.id, doc.data()]);
      });

      if (matches.length === 0) {
        list.innerHTML = '<div style="padding:8px; color:var(--text-dim)">No players found</div>';
        return;
      }

      list.innerHTML = matches.map(([uid, user]) => `
        <div style="padding:8px; border-bottom:1px solid rgba(255,107,107,0.1); cursor:pointer" onclick="adminRoleManager.selectPlayerForRemove('${uid}', '${this.escHtml(user.name || 'Unknown')}')">
          <strong>${this.escHtml(user.name || 'Unknown')}</strong> <span style="color:var(--text-dim); font-size:10px">Lvl ${user.combatLevel || 1}</span>
        </div>
      `).join('');
    } catch (e) {
      console.error('[RoleManager] Search failed:', e);
      list.innerHTML = '<div style="padding:8px; color:#ff6b6b">Error: ' + e.message + '</div>';
    }
  }

  selectPlayerForRemove(uid, name) {
    this.selectedPlayerForRemove = { uid, name };
    document.getElementById('admin-remove-player-search').value = name;
    document.getElementById('admin-remove-player-list').style.display = 'none';
    document.getElementById('admin-remove-name').textContent = name;
    document.getElementById('admin-remove-selected').style.display = 'block';
  }

  async removeRole() {
    if (!this.selectedPlayerForRemove) {
      ui.toast({ type: 'danger', text: 'Select a player first' });
      return;
    }

    if (!confirm(`Reset ${this.selectedPlayerForRemove.name} to VIEWER?`)) return;

    try {
      await adminRoles.setUserRole(this.selectedPlayerForRemove.uid, 'VIEWER');
      ui.toast({ type: 'success', text: this.selectedPlayerForRemove.name + ' role removed' });
      
      // Clear form
      document.getElementById('admin-remove-player-search').value = '';
      document.getElementById('admin-remove-selected').style.display = 'none';
      this.selectedPlayerForRemove = null;
      
      ui.renderPage('admin');
    } catch (e) {
      console.error('[RoleManager] Remove failed:', e);
      ui.toast({ type: 'danger', text: 'Failed: ' + e.message });
    }
  }

  escHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

const adminRoleManager = new AdminRoleManager();
