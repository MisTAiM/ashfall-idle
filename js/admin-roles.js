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
          'edit:item', 'create:item', 'view:item',
          'edit:monster', 'create:monster', 'view:monster',
          'edit:quest', 'create:quest', 'view:quest',
          'edit:recipe', 'create:recipe', 'view:recipe',
          'edit:economy', 'view:economy',
          'edit:settings', 'view:logs'
        ]
      },
      COMMUNITY_MANAGER: {
        name: 'Community Manager',
        color: '#4da6ff',
        icon: '📢',
        description: 'Announcements, broadcasts, events',
        permissions: [
          'broadcast:message', 'edit:announcements',
          'view:players', 'view:logs',
          'view:item', 'view:monster'
        ]
      },
      MODERATOR: {
        name: 'Moderator',
        color: '#ff8800',
        icon: '⚔',
        description: 'Player management, economy, safety',
        permissions: [
          'view:players', 'edit:players', 'delete:players',
          'view:economy', 'edit:economy',
          'broadcast:message', 'view:logs',
          'view:item', 'view:monster'
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
          'view:image', 'upload:image'
        ]
      },
      ART_LEAD: {
        name: 'Art Lead',
        color: '#ff44ff',
        icon: '🎨',
        description: 'All image and SVG management, art direction',
        permissions: [
          'upload:image', 'edit:image', 'delete:image',
          'view:image', 'view:item', 'view:monster'
        ]
      },
      ARTIST: {
        name: 'Artist',
        color: '#ff99ff',
        icon: '🖌',
        description: 'Upload and edit images, SVGs',
        permissions: [
          'upload:image', 'edit:image',
          'view:image', 'view:item', 'view:monster'
        ]
      },
      TESTER: {
        name: 'QA Tester',
        color: '#ffcc00',
        icon: '🧪',
        description: 'Test content, report bugs, view data',
        permissions: [
          'view:item', 'view:monster', 'view:quest',
          'view:recipe', 'view:logs', 'view:economy', 'view:players'
        ]
      },
      VIEWER: {
        name: 'Viewer',
        color: '#4488ff',
        icon: '👁',
        description: 'Read-only access to all data',
        permissions: [
          'view:players', 'view:item', 'view:monster',
          'view:quest', 'view:recipe', 'view:logs', 'view:economy'
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
        // Read from Firestore /players/{uid} — publicly readable, no permission issue
        let role = 'VIEWER';
        try {
          if (online.firestore) {
            const doc = await online.firestore.collection('players').doc(uid).get();
            if (doc.exists && doc.data().adminRole) role = doc.data().adminRole;
          }
        } catch(e2) {
          // Fallback to RTDB (only works if user is already OWNER/ADMIN)
          try {
            const snap = await online.db.ref(`/admin_roles/${uid}`).once('value');
            if (snap.val()) role = snap.val();
          } catch(e3) {}
        }
        this.currentUserRole = role;
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
      // Write to RTDB (admin reference)
      await online.db.ref(`/admin_roles/${uid}`).set(role);
      // Write to Firestore /players/{uid} — user can read this themselves
      if (online.firestore) {
        await online.firestore.collection('players').doc(uid).set(
          { adminRole: role === 'VIEWER' ? null : role },
          { merge: true }
        );
      }
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
    // Owner/Admin bypass all tab checks
    const userRole = this.getRoleForUser();
    if (userRole === 'OWNER' || userRole === 'ADMIN') return true;

    const tabPermissions = {
      'dashboard':   ['view:item', 'view:monster', 'view:players', 'view:economy', 'view:logs'],
      'players':     ['view:players'],
      'online':      ['view:players'],
      'guilds_adm':  ['view:players'],
      'economy':     ['view:economy'],
      'items':       ['view:item'],
      'monsters':    ['view:monster'],
      'create':      ['create:item', 'create:monster', 'create:recipe', 'create:quest'],
      'shop_mgr':    ['edit:item', 'edit:economy'],
      'recipes':     ['view:recipe'],
      'npcs':        ['view:quest'],
      'skills':      ['edit:item'],
      'theatre':     ['edit:monster'],
      'abilities':   ['edit:item'],
      'quests':      ['view:quest'],
      'worldboss':   ['edit:monster'],
      'combat':      ['edit:monster'],
      'economy':     ['view:economy'],
      'gold':        ['edit:economy'],
      'leaderboard': ['view:players'],
      'content':     ['broadcast:message', 'edit:announcements'],
      'settings':    ['edit:settings'],
      'logs':        ['view:logs'],
      'images':      ['upload:image', 'view:image'],
      'state':       ['edit:*'],
      'tools':       ['view:logs'],
    };

    const required = tabPermissions[tab];
    if (!required) return false; // unknown tab — deny
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
