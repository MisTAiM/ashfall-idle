// ============================================================
// ASHFALL IDLE — ADMIN ACTIVITY FEED v1.0
// Real-time log of all admin actions
// ============================================================

class AdminActivityFeed {
  constructor() {
    this.feed = [];
    this.maxFeedSize = 100;
    this.loadFeed();
  }

  addActivity(action, user, details = {}) {
    const activity = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action,
      user: user || (online?.displayName || 'unknown'),
      uid: online?.user?.uid || 'unknown',
      details,
      userRole: adminRoles.currentUserRole
    };

    this.feed.unshift(activity);
    if (this.feed.length > this.maxFeedSize) {
      this.feed.pop();
    }

    // Save to Firebase
    if (online?.db) {
      online.db.ref(`/admin_activity/${Date.now()}`).set(activity).catch(e => {
        console.error('[ActivityFeed] Save failed:', e);
      });
    }
  }

  loadFeed() {
    // Load from localStorage as fallback
    try {
      const saved = localStorage.getItem('admin_activity_feed');
      if (saved) {
        this.feed = JSON.parse(saved);
      }
    } catch (e) {
      console.warn('[ActivityFeed] Load failed');
    }
  }

  saveFeed() {
    try {
      localStorage.setItem('admin_activity_feed', JSON.stringify(this.feed));
    } catch (e) {
      console.warn('[ActivityFeed] Save failed');
    }
  }

  getRecentActivity(limit = 50) {
    return this.feed.slice(0, limit);
  }

  renderActivityFeed() {
    const activities = this.getRecentActivity(50);

    return `
      <div class="adm-section">
        <h3>📋 Admin Activity Feed</h3>
        
        <div style="max-height:400px; overflow-y:auto">
          ${activities.length > 0 ? activities.map(act => `
            <div style="background:rgba(0,0,0,0.2); padding:10px; border-radius:4px; margin-bottom:6px; border-left:3px solid ${this._getActionColor(act.action)}">
              <div style="display:flex; justify-content:space-between; align-items:start; gap:8px">
                <div style="flex:1">
                  <div style="font-weight:bold; color:${this._getActionColor(act.action)}; font-size:12px">${this._formatAction(act.action)}</div>
                  <div style="font-size:11px; color:var(--text-dim); margin-top:2px">
                    <span style="display:inline-block; background:${this._getRoleColor(act.userRole)}22; color:${this._getRoleColor(act.userRole)}; padding:2px 6px; border-radius:3px; margin-right:6px">${act.userRole}</span>
                    ${act.user}
                  </div>
                </div>
                <div style="font-size:10px; color:var(--text-dim); white-space:nowrap">${this._formatTime(act.timestamp)}</div>
              </div>
              ${act.details.itemId ? `<div style="font-size:10px; color:#aaa; margin-top:4px">Item: ${act.details.itemId}</div>` : ''}
              ${act.details.monsterId ? `<div style="font-size:10px; color:#aaa; margin-top:4px">Monster: ${act.details.monsterId}</div>` : ''}
            </div>
          `).join('') : '<div style="color:var(--text-dim)">No activity yet</div>'}
        </div>

        <div style="margin-top:10px; display:flex; gap:6px">
          <button class="btn btn-xs" onclick="adminActivityFeed.feed = []; localStorage.removeItem('admin_activity_feed'); ui.renderPage('admin')">Clear Feed</button>
        </div>
      </div>
    `;
  }

  _formatAction(action) {
    const actionMap = {
      'EDIT_ITEM': '✏️ Item Edited',
      'CREATE_ITEM': '✨ Item Created',
      'DELETE_ITEM': '🗑️ Item Deleted',
      'EDIT_MONSTER': '✏️ Monster Edited',
      'CREATE_MONSTER': '✨ Monster Created',
      'DELETE_MONSTER': '🗑️ Monster Deleted',
      'ROLE_CHANGE': '👤 Role Changed',
      'BRANDING_UPDATE': '🎨 Branding Updated',
      'BULK_PRICE_UPDATE': '💰 Bulk Price Update',
      'BULK_RARITY_UPDATE': '🔷 Bulk Rarity Update',
      'IMAGE_UPLOAD': '📤 Image Uploaded',
      'IMAGE_DELETE': '🗑️ Image Deleted',
      'MONSTER_DROPS_UPDATE': '💀 Drops Updated',
      'ADMIN_SESSION_END': '🚪 Session Ended'
    };

    return actionMap[action] || action;
  }

  _formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'now';
    if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
    
    return date.toLocaleDateString();
  }

  _getActionColor(action) {
    if (action.includes('DELETE')) return '#ff6b6b';
    if (action.includes('CREATE')) return '#7dcc44';
    if (action.includes('EDIT')) return '#ffd700';
    return '#c9873e';
  }

  _getRoleColor(role) {
    const colors = {
      'ADMIN': '#ff4444',
      'MOD': '#ff8800',
      'CONTENT_CREATOR': '#44ff44',
      'ART_CREATOR': '#ff44ff',
      'ECONOMY_MANAGER': '#ffff44'
    };
    return colors[role] || '#c9873e';
  }
}

const adminActivityFeed = new AdminActivityFeed();

// Hook into admin actions to log them
const originalAddActivity = adminActivityFeed.addActivity.bind(adminActivityFeed);
