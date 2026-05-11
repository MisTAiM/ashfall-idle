// ============================================================
// ASHFALL IDLE — ADMIN ROLE SYSTEM v1.0
// Role-based permissions, access control, audit logging
// ============================================================

class AdminRoleSystem {
  constructor() {
    this.currentUserRole = 'VIEWER';
    this.roles = {
      OWNER: {
        name: 'Owner',
        color: '#ffff00',
        icon: '👑',
        description: 'Derick - Full unlimited access',
        permissions: ['*']
      },
      ADMIN: {
        name: 'Admin',
        color: '#ff4444',
        icon: '⚔',
        description: 'Full access to all features',
        permissions: ['*']
      },
      LEAD_DEV: {
        name: 'Lead Developer',
        color: '#ff6b9d',
        icon: '🔧',
        description: 'Code, systems, infrastructure',
        permissions: ['edit:*', 'create:*', 'delete:*', 'upload:*', 'manage:roles']
      },
      GAME_DESIGNER: {
        name: 'Game Designer',
        color: '#6bcf7f',
        icon: '🎮',
        description: 'Balance, content, quests, items, monsters',
        permissions: [
          'edit:item', 'create:item', 'edit:monster', 'create:monster',
          'edit:quest', 'create:quest', 'edit:recipe', 'create:recipe',
          'edit:economy', 'view:logs', 'edit:settings'
        ]
      },
      COMMUNITY_MANAGER: {
        name: 'Community Manager',
        color: '#4da6ff',
        icon: '📢',
        description: 'Announcements, broadcasts, events',
        permissions: [
          'broadcast:message', 'edit:announcements', 'view:players',
          'view:logs', 'view:items', 'view:monsters'
        ]
      },
      MODERATOR: {
        name: 'Moderator',
        color: '#ff8800',
        icon: '⚔',
        description: 'Player management, economy, safety',
        permissions: [
          'view:players', 'edit:players', 'delete:players',
          'view:economy', 'edit:economy', 'view:logs',
          'broadcast:message', 'view:items', 'view:monsters'
        ]
      },
      CONTENT_CREATOR: {
        name: 'Content Creator',
        color: '#44ff44',
        icon: '📚',
        description: 'Create items, monsters, recipes, quests',
        permissions: [
          'create:item', 'edit:item', 'view:item',
          'create:monster', 'edit:monster', 'view:monster',
          'create:recipe', 'edit:recipe', 'view:recipe',
          'create:quest', 'edit:quest', 'view:quest',
          'view:images', 'upload:image'
        ]
      },
      ART_LEAD: {
        name: 'Art Lead',
        color: '#ff44ff',
        icon: '🎨',
        description: 'All image and SVG management, art direction',
        permissions: [
          'upload:image', 'edit:image', 'delete:image',
          'upload:svg', 'edit:svg', 'edit:item_image', 'edit:monster_image',
          'view:items', 'view:monsters'
        ]
      },
      ARTIST: {
        name: 'Artist',
        color: '#ff99ff',
        icon: '🖌',
        description: 'Upload and edit images, SVGs',
        permissions: [
          'upload:image', 'edit:image',
          'upload:svg', 'edit:svg',
          'view:items', 'view:monsters'
        ]
      },
      TESTER: {
        name: 'QA Tester',
        color: '#ffcc00',
        icon: '🧪',
        description: 'Test content, report bugs, view data',
        permissions: [
          'view:items', 'view:monsters', 'view:quests',
          'view:recipes', 'view:logs', 'view:economy'
        ]
      },
      VIEWER: {
        name: 'Viewer',
        color: '#4488ff',
        icon: '👁',
        description: 'Read-only access to all data',
        permissions: [
          'view:players', 'view:items', 'view:monsters',
          'view:quests', 'view:recipes', 'view:logs', 'view:economy'
        ]
      }
    };
    
    this.auditLog = [];
    this.maxAuditEntries = 500;
    
    this.init();
  }

  async init() {
    // Load current user role from RTDB and cache it
    await this.refreshCurrentUserRole();
  }

  async refreshCurrentUserRole() {
    if (!online?.db || !online?.user?.uid) {
      // Retry until auth is ready
      setTimeout(() => this.refreshCurrentUserRole(), 500);
      return;
    }
    try {
      const uid = online.user.uid;
      // Owner always gets OWNER role
      if (typeof isAdmin === 'function' && isAdmin()) {
        this.currentUserRole = 'OWNER';
      } else {
        const snap = await online.db.ref(`/admin_roles/${uid}`).once('value');
        const role = snap.val();
        this.currentUserRole = role || 'VIEWER';
      }
      console.log(`[AdminRoles] Role loaded: ${this.currentUserRole}`);
      // If user has any admin role, show the admin panel in sidebar
      const adminRoles = ['OWNER','ADMIN','LEAD_DEV','GAME_DESIGNER','COMMUNITY_MANAGER',
                          'MODERATOR','CONTENT_CREATOR','ART_LEAD','ARTIST','TESTER'];
      if (adminRoles.includes(this.currentUserRole) && typeof ui !== 'undefined') {
        ui.renderSidebar();
      }
    } catch(e) {
      console.error('[AdminRoles] Role load failed:', e);
    }
  }

  getRoleForUser() {
    // Always check isAdmin() first (this is called every time we need the role)
    if (typeof isAdmin === 'function' && isAdmin()) {
      return 'OWNER';
    }
    
    // Otherwise return stored role or VIEWER
    return this.currentUserRole || 'VIEWER';
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
    // Always check if user is admin first
    const userRole = this.getRoleForUser();
    
    // OWNER and ADMIN always have full permission
    if (userRole === 'OWNER' || userRole === 'ADMIN') {
      return true;
    }

    const role = this.roles[userRole];
    if (!role) return false;
    
    // Check for wildcard permissions (all permissions)
    if (role.permissions.includes('*')) return true;
    
    // Check exact permission
    if (role.permissions.includes(action)) return true;
    
    // Check wildcard category (e.g., 'view:*' allows 'view:items')
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
    const userRole = this.getRoleForUser();
    const role = this.roles[userRole];
    return {
      role: userRole,
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
