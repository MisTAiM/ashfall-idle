// ============================================================
// ASHFALL IDLE — ADMIN ROLE SYSTEM v1.0
// Role-based permissions, access control, audit logging
// ============================================================

class AdminRoleSystem {
  constructor() {
    this.currentUserRole = 'VIEWER';
    this.roles = {
      ADMIN: {
        name: 'Admin',
        color: '#ff4444',
        icon: '👑',
        description: 'Full access to everything',
        permissions: ['*'] // * = all
      },
      MOD: {
        name: 'Moderator',
        color: '#ff8800',
        icon: '⚔',
        description: 'Player management, economy, logs, broadcasts',
        permissions: [
          'view:players', 'edit:players', 'delete:players',
          'view:economy', 'edit:economy',
          'view:logs', 'broadcast:message',
          'view:items', 'view:monsters'
        ]
      },
      CONTENT_CREATOR: {
        name: 'Content Creator',
        color: '#44ff44',
        icon: '🎨',
        description: 'Create and edit items, monsters, recipes, quests',
        permissions: [
          'create:item', 'edit:item', 'view:item',
          'create:monster', 'edit:monster', 'view:monster',
          'create:recipe', 'edit:recipe', 'view:recipe',
          'create:quest', 'edit:quest', 'view:quest',
          'view:images'
        ]
      },
      ART_CREATOR: {
        name: 'Art Creator',
        color: '#ff44ff',
        icon: '🎭',
        description: 'Upload and edit images, SVGs for items and monsters',
        permissions: [
          'upload:image', 'edit:image', 'delete:image',
          'upload:svg', 'edit:svg',
          'view:items', 'view:monsters',
          'edit:item_image', 'edit:monster_image',
          'view:images'
        ]
      },
      ECONOMY_MANAGER: {
        name: 'Economy Manager',
        color: '#ffff44',
        icon: '💰',
        description: 'Adjust prices, multipliers, shop management',
        permissions: [
          'view:economy', 'edit:economy',
          'edit:shop', 'view:items',
          'view:gold', 'edit:prices'
        ]
      },
      VIEWER: {
        name: 'Viewer',
        color: '#4488ff',
        icon: '👁',
        description: 'Read-only access to all data',
        permissions: [
          'view:players', 'view:items', 'view:monsters',
          'view:quests', 'view:recipes', 'view:logs',
          'view:economy', 'view:images'
        ]
      }
    };
    
    this.auditLog = [];
    this.maxAuditEntries = 500;
    
    this.init();
  }

  async init() {
    // Load user's role from Firebase
    if (typeof online !== 'undefined' && online.user?.uid) {
      const role = await this.getUserRole(online.user.uid);
      this.currentUserRole = role || 'VIEWER';
    }
    
    // Listen for role changes in real-time
    if (typeof online !== 'undefined' && online.db) {
      online.db.ref(`/admin_roles/${online.user?.uid}`).on('value', snap => {
        const role = snap.val();
        if (role) {
          this.currentUserRole = role;
          if (typeof ui !== 'undefined') {
            ui.toast({ type: 'info', text: `Role changed to ${this.roles[role]?.name || role}` });
          }
        }
      });
    }
  }

  async getUserRole(uid) {
    if (!online?.db) return 'VIEWER';
    try {
      const snap = await online.db.ref(`/admin_roles/${uid}`).once('value');
      return snap.val() || 'VIEWER';
    } catch (e) {
      console.error('[AdminRoles] Load failed:', e);
      return 'VIEWER';
    }
  }

  async setUserRole(uid, role) {
    if (!this.hasPermission('manage:roles')) {
      console.warn(`[AdminRoles] No permission to manage roles`);
      return false;
    }
    
    if (!this.roles[role]) {
      console.error(`[AdminRoles] Invalid role: ${role}`);
      return false;
    }

    try {
      await online.db.ref(`/admin_roles/${uid}`).set(role);
      this.logAudit('ROLE_CHANGE', { uid, newRole: role });
      return true;
    } catch (e) {
      console.error('[AdminRoles] Set role failed:', e);
      return false;
    }
  }

  hasPermission(action) {
    const role = this.roles[this.currentUserRole];
    if (!role) return false;
    
    // Admin has all permissions
    if (role.permissions.includes('*')) return true;
    
    // Check exact permission
    if (role.permissions.includes(action)) return true;
    
    // Check wildcard (e.g., 'view:*' allows 'view:items')
    const [category] = action.split(':');
    if (role.permissions.includes(`${category}:*`)) return true;
    
    return false;
  }

  canAccess(tab) {
    const tabPermissions = {
      'dashboard': ['view:*'],
      'players': ['view:players', 'edit:players'],
      'items': ['view:item', 'edit:item', 'create:item'],
      'monsters': ['view:monster', 'edit:monster', 'create:monster'],
      'create': ['create:item', 'create:monster', 'create:recipe', 'create:quest'],
      'images': ['upload:image', 'view:images'],
      'economy': ['view:economy', 'edit:economy'],
      'shop_mgr': ['edit:shop'],
      'logs': ['view:logs'],
      'broadcast': ['broadcast:message'],
      'settings': ['edit:settings'],
      'recipes': ['view:recipe', 'edit:recipe', 'create:recipe'],
      'quests': ['view:quest', 'edit:quest', 'create:quest']
    };

    const required = tabPermissions[tab] || ['*'];
    return required.some(perm => this.hasPermission(perm));
  }

  logAudit(action, data = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      action,
      user: online?.displayName || 'unknown',
      uid: online?.user?.uid || 'unknown',
      data
    };
    
    this.auditLog.push(entry);
    if (this.auditLog.length > this.maxAuditEntries) {
      this.auditLog.shift();
    }

    // Save to Firebase
    if (online?.db) {
      online.db.ref(`/audit_logs/${Date.now()}`).set(entry).catch(e => {
        console.error('[AdminRoles] Audit log failed:', e);
      });
    }
  }

  getAuditLog(limit = 50) {
    return this.auditLog.slice(-limit).reverse();
  }

  // UI Helper: Show access denied message
  showAccessDenied(action) {
    if (typeof ui !== 'undefined') {
      ui.toast({
        type: 'danger',
        text: `Access denied: You don't have permission to ${action}`
      });
    }
  }

  // Render role selector UI
  renderRoleSelector(uid, currentRole) {
    return `
      <select class="bank-search-input" style="width:180px" onchange="adminRoles.setUserRole('${uid}', this.value)">
        ${Object.entries(this.roles).map(([key, role]) => `
          <option value="${key}" ${currentRole === key ? 'selected' : ''}>
            ${role.icon} ${role.name}
          </option>
        `).join('')}
      </select>
    `;
  }

  // Get current user info
  getCurrentUserInfo() {
    const role = this.roles[this.currentUserRole];
    return {
      role: this.currentUserRole,
      name: role?.name || 'Unknown',
      color: role?.color || '#aaa',
      icon: role?.icon || '?',
      description: role?.description || '',
      permissions: role?.permissions || []
    };
  }
}

// Global instance
const adminRoles = new AdminRoleSystem();
