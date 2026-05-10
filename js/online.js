// ============================================================
// ASHFALL IDLE - Online Manager v1.0
// Auth, Chat, Cloud Saves, PvP, Bounties, Leaderboard
// ============================================================

class OnlineManager {
  constructor() {
    this.auth = null;
    this.db = null;
    this.firestore = null;
    this.user = null;
    this.displayName = null;
    this.chatRef = null;
    this.chatListener = null;
    this.listeners = {};
    this.isOnline = false;
    this.pvpRating = 1000;
  }

  init() {
    console.log('[Online] Initializing with FIREBASE_ENABLED:', typeof FIREBASE_ENABLED !== 'undefined' ? FIREBASE_ENABLED : 'undefined');
    console.log('[Online] FIREBASE_CONFIG:', typeof FIREBASE_CONFIG !== 'undefined' ? FIREBASE_CONFIG.projectId : 'undefined');
    
    if (!FIREBASE_ENABLED) {
      console.log('Firebase not configured. Online features disabled.');
      this.emit('status', { online:false, reason:'Firebase not configured. See js/firebase-config.js for setup instructions.' });
      return;
    }
    try {
      // Check if already initialized
      if (firebase.apps && firebase.apps.length > 0) {
        console.log('[Online] Firebase already initialized');
        this.auth = firebase.auth();
        this.db = firebase.database();
        this.firestore = firebase.firestore();
      } else {
        firebase.initializeApp(FIREBASE_CONFIG);
        this.auth = firebase.auth();
        this.db = firebase.database();
        this.firestore = firebase.firestore();
      }
      this.isOnline = true;

      this.auth.onAuthStateChanged(async (user) => {
        this.user = user;
        if (user) {
          // Verify admin status (hashed check, async)
          if (typeof verifyAdmin === 'function') {
            const isAdm = await verifyAdmin(user.uid);
            // Re-render sidebar immediately so admin entry appears
            if (isAdm && typeof ui !== 'undefined') {
              ui.renderSidebar();
            }
          }
          this.displayName = user.displayName || localStorage.getItem('ashfall_displayName') || ('Survivor_' + user.uid.substring(0, 6));
          this.loadProfile();
          // Auto cloud sync for non-anonymous users
          if (!user.isAnonymous && game && game.state) {
            try {
              const cloudSave = await this.loadFromCloud(true);
              if (cloudSave && cloudSave._cloudSaveTime) {
                const localTime = game.state.lastSave || 0;
                if (cloudSave._cloudSaveTime > localTime) {
                  // Cloud is newer - load it
                  game.migrateSave(cloudSave); // sets game.state internally + migrates
                  game.save(); // persist to localStorage
                  this.emit('notification', { type:'success', text:'Cloud save loaded (newer than local).' });
                  // Re-render UI with new state
                  if (typeof ui !== 'undefined') { ui.renderSidebar(); ui.renderPage(ui.currentPage); }
                } else {
                  // Local is newer - push to cloud
                  this.saveToCloud(true);
                }
              } else {
                // No cloud save exists yet - push local to cloud
                this.saveToCloud(true);
              }
            } catch(e) { console.error('Auto-sync error:', e.message); }
          }
          // Start periodic auto-save (every 60s)
          if (!user.isAnonymous) {
            if (this._autoSaveInterval) clearInterval(this._autoSaveInterval);
            this._autoSaveInterval = setInterval(() => {
              if (game && game.state) {
                this.saveToCloud(true);
                this.syncProfile();
              }
            }, 60000);
          }
          // Set wilderness presence
          this._updatePresence();
          // Start inbox real-time listener
          if (!user.isAnonymous) this.startInboxListener();
          // Load custom item images from RTDB (all users)
          this.loadAllItemImages();
          this.emit('authChanged', { user, displayName:this.displayName });
        } else {
          if (this._autoSaveInterval) clearInterval(this._autoSaveInterval);
          this.signInAnonymously();
        }
      });
      this.emit('status', { online:true });
    } catch(e) {
      console.error('Firebase init error:', e);
      this.isOnline = false;
      this.emit('status', { online:false, reason:e.message });
    }
  }

  // ── AUTH ────────────────────────────────────────────────
  async signInAnonymously() {
    try { await this.auth.signInAnonymously(); } catch(e) { console.error('Anon auth error:', e); }
  }

  async createAccount(email, password, displayName) {
    try {
      if (this.user && this.user.isAnonymous) {
        const cred = firebase.auth.EmailAuthProvider.credential(email, password);
        await this.user.linkWithCredential(cred);
        await this.user.updateProfile({ displayName });
      } else {
        const result = await this.auth.createUserWithEmailAndPassword(email, password);
        await result.user.updateProfile({ displayName });
      }
      this.displayName = displayName;
      localStorage.setItem('ashfall_displayName', displayName);
      // Immediately save to cloud now that we have a real account
      this.saveToCloud(false);
      this.syncProfile();
      this.startInboxListener();
      // Start periodic auto-save (linking doesn't re-trigger onAuthStateChanged)
      if (!this._autoSaveInterval) {
        this._autoSaveInterval = setInterval(() => {
          if (game && game.state) { this.saveToCloud(true); this.syncProfile(); }
        }, 60000);
      }
      this.emit('authChanged', { user:this.user, displayName });
      this.emit('notification', { type:'success', text:'Account created! Your progress is now saved to the cloud.' });
      return true;
    } catch(e) {
      let msg = e.message;
      if (e.code === 'auth/email-already-in-use') msg = 'Email already in use. Try signing in instead.';
      else if (e.code === 'auth/weak-password') msg = 'Password too weak (min 6 characters).';
      else if (e.code === 'auth/invalid-email') msg = 'Invalid email address.';
      else if (e.code === 'auth/operation-not-allowed') msg = 'Email auth not enabled. Use Google Sign-In.';
      this.emit('notification', { type:'danger', text:msg });
      return false;
    }
  }

  async signIn(email, password) {
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
      // onAuthStateChanged will handle cloud sync
      this.emit('notification', { type:'success', text:'Signed in! Syncing cloud save...' });
      return true;
    } catch(e) {
      let msg = e.message;
      if (e.code === 'auth/user-not-found') msg = 'Email not found. Create an account first.';
      else if (e.code === 'auth/wrong-password') msg = 'Wrong password.';
      else if (e.code === 'auth/invalid-email') msg = 'Invalid email address.';
      else if (e.code === 'auth/user-disabled') msg = 'Account has been disabled.';
      this.emit('notification', { type:'danger', text:msg });
      return false;
    }
  }

  async signInWithGoogle() {
    try {
      if (!this.auth) {
        this.emit('notification', { type:'danger', text:'Firebase not initialized. Please refresh the page.' });
        return false;
      }

      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ 'hd': '' }); // Allow all Google accounts
      
      if (this.user && this.user.isAnonymous) {
        // Link anonymous account to Google
        try {
          const result = await this.user.linkWithPopup(provider);
          this.user = result.user;
        } catch(e) {
          // If linking fails, sign out anon and do fresh sign-in instead
          if (e.code === 'auth/popup-closed-by-user') {
            this.emit('notification', { type:'warn', text:'Sign-in was cancelled.' });
            return false;
          }
          console.warn('[Online] Linking failed, attempting fresh sign-in:', e.code);
          await this.auth.signOut();
          const result = await this.auth.signInWithPopup(provider);
          this.user = result.user;
        }
        this.displayName = this.user.displayName || this.user.email?.split('@')[0] || 'Survivor';
        localStorage.setItem('ashfall_displayName', this.displayName);
        // Immediate cloud save + sync
        this.saveToCloud(false);
        this.syncProfile();
        this.startInboxListener();
        if (!this._autoSaveInterval) {
          this._autoSaveInterval = setInterval(() => {
            if (game && game.state) { this.saveToCloud(true); this.syncProfile(); }
          }, 60000);
        }
        this.emit('notification', { type:'success', text:`Welcome, ${this.displayName}! Cloud sync enabled.` });
        return true;
      } else {
        // Fresh sign-in (no anonymous account to link)
        const result = await this.auth.signInWithPopup(provider);
        this.user = result.user;
        this.displayName = this.user.displayName || this.user.email?.split('@')[0] || 'Survivor';
        localStorage.setItem('ashfall_displayName', this.displayName);
        this.emit('notification', { type:'success', text:`Welcome back, ${this.displayName}!` });
        return true;
      }
    } catch(e) {
      let msg = e.message;
      if (e.code === 'auth/popup-blocked') msg = 'Sign-in popup was blocked. Please allow popups and try again.';
      else if (e.code === 'auth/popup-closed-by-user') msg = 'Sign-in was cancelled.';
      else if (e.code === 'auth/account-exists-with-different-credential') msg = 'Email already in use with different provider.';
      this.emit('notification', { type:'danger', text:msg });
      console.error('[Online] Google sign-in error:', e);
      return false;
    }
  }
        this.emit('authChanged', { user:this.user, displayName:this.displayName });
        this.emit('notification', { type:'success', text:`Linked to Google as ${this.displayName}! Cloud save active.` });
      } else {
        // Fresh Google sign-in
        await this.auth.signInWithPopup(provider);
        // onAuthStateChanged handles the rest
        this.emit('notification', { type:'success', text:'Signed in with Google! Syncing...' });
      }
      return true;
    } catch(e) {
      if (e.code === 'auth/credential-already-in-use') {
        // Google account already linked to another user - sign in directly
        try {
          await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
          this.emit('notification', { type:'success', text:'Signed in with existing Google account.' });
          return true;
        } catch(e2) { 
          console.error('Google fallback error:', e2);
          this.emit('notification',{type:'danger',text:'Google Sign-in error: '+e2.message}); 
          return false; 
        }
      }
      if (e.code === 'auth/popup-closed-by-user') {
        this.emit('notification', { type:'info', text:'Google sign-in popup closed. Try again.' });
        return false;
      }
      if (e.code === 'auth/operation-not-allowed') {
        this.emit('notification', { type:'danger', text:'Google Sign-in not configured. Please enable it in Firebase Console.' });
        console.error('ERROR: Enable Google Sign-In in Firebase Console > Authentication > Sign-in method');
        return false;
      }
      if (e.code === 'auth/network-request-failed') {
        this.emit('notification', { type:'danger', text:'Network error. Check your internet connection.' });
        return false;
      }
      console.error('Google sign-in error:', e);
      this.emit('notification', { type:'danger', text:'Google sign-in failed: ' + e.message });
      return false;
    }
  }

  async signOut() {
    // Save to cloud before signing out so data isn't lost
    if (this.user && !this.user.isAnonymous && game && game.state) {
      try { await this.saveToCloud(true); } catch(e) {}
    }
    // Clear localStorage to prevent ghost accounts on next anonymous sign-in
    localStorage.removeItem('ashfall_save');
    try { await this.auth.signOut(); } catch(e) { console.error(e); }
    // Reset admin flag
    if (typeof _isAdminVerified !== 'undefined') _isAdminVerified = false;
  }

  // ── ADMIN: DELETE PLAYER ───────────────────────────────
  // Removes player from players, leaderboard, saves, bazaar,
  // pvp_queue, and records a ban entry + admin log
  async deletePlayer(uid, displayName) {
    if (!this.isOnline || !this.user) return { ok: false, error: 'Not online' };
    if (typeof isAdmin !== 'function' || !isAdmin()) return { ok: false, error: 'Not admin' };
    const errors = [];
    const deleted = [];
    const collections = ['players', 'leaderboard', 'saves'];
    for (const col of collections) {
      try {
        await this.firestore.collection(col).doc(uid).delete();
        deleted.push(col);
      } catch(e) { errors.push(`${col}: ${e.code || e.message}`); }
    }
    // Remove bazaar listings
    try {
      const bSnap = await this.firestore.collection('bazaar').where('sellerId','==',uid).get();
      const batch = this.firestore.batch();
      bSnap.forEach(doc => batch.delete(doc.ref));
      if (!bSnap.empty) { await batch.commit(); deleted.push('bazaar'); }
    } catch(e) { errors.push(`bazaar: ${e.code||e.message}`); }
    // Remove from PVP queue
    try {
      await this.firestore.collection('pvp_queue').doc(uid).delete();
      deleted.push('pvp_queue');
    } catch(e) {}
    // Record ban in RTDB (prevents re-registration)
    try {
      await this.db.ref(`/admin_bans/${uid}`).set({
        banned: true, by: this.user.uid, at: Date.now(), name: displayName || uid
      });
      deleted.push('admin_bans(rtdb)');
    } catch(e) { errors.push(`bans(rtdb): ${e.message}`); }
    // Admin action log
    await this.adminLog('delete_player', { targetUid: uid, targetName: displayName, deleted, errors });
    return { ok: deleted.length > 0, deleted, errors };
  }

  // Legacy alias for compatibility
  async deletePlayerFromLeaderboard(uid) {
    const result = await this.deletePlayer(uid, uid);
    return result.ok;
  }

  // ── ADMIN: ACTION LOG ─────────────────────────────────
  async adminLog(action, data) {
    if (!this.isOnline || !this.user || typeof isAdmin !== 'function' || !isAdmin()) return;
    try {
      await this.db.ref('/admin_log').push({
        action, by: this.user.uid, byName: this.displayName || 'Admin',
        at: Date.now(), data: JSON.stringify(data)
      });
    } catch(e) {} // Non-fatal
  }

  // ── ADMIN: GAME SETTINGS / FEATURE FLAGS ──────────────
  async getGameSettings() {
    if (!this.isOnline) return {};
    try {
      const snap = await this.db.ref('/game_settings').once('value');
      return snap.val() || {};
    } catch(e) { return {}; }
  }
  async setGameSetting(key, value) {
    if (!this.isOnline || typeof isAdmin !== 'function' || !isAdmin()) return false;
    try {
      await this.db.ref(`/game_settings/${key}`).set(value);
      await this.adminLog('set_setting', { key, value });
      return true;
    } catch(e) { console.error('Set setting error:', e); return false; }
  }

  // ── ADMIN: ANNOUNCEMENTS ──────────────────────────────
  async postAnnouncement(title, body, type) {
    if (!this.isOnline || typeof isAdmin !== 'function' || !isAdmin()) return false;
    try {
      await this.db.ref('/announcements').push({ title, body, type: type||'info', at: Date.now(), by: this.displayName||'Admin' });
      await this.adminLog('announcement', { title, body, type });
      return true;
    } catch(e) { return false; }
  }
  async getAnnouncements() {
    if (!this.isOnline) return [];
    try {
      const snap = await this.db.ref('/announcements').orderByChild('at').limitToLast(20).once('value');
      const items = [];
      snap.forEach(c => items.unshift({ id: c.key, ...c.val() }));
      return items;
    } catch(e) { return []; }
  }
  async deleteAnnouncement(id) {
    if (!this.isOnline || typeof isAdmin !== 'function' || !isAdmin()) return false;
    try { await this.db.ref(`/announcements/${id}`).remove(); return true; } catch(e) { return false; }
  }

  // ── ADMIN: ITEM IMAGES (SVG/PNG) ─────────────────────
  async saveItemImage(itemId, dataUrl) {
    if (!this.isOnline || typeof isAdmin !== 'function' || !isAdmin()) throw new Error('Not authorized');
    await this.db.ref(`/item_images/${itemId}`).set(dataUrl);
    await this.adminLog('item_image_upload', { itemId });
  }
  async deleteItemImage(itemId) {
    if (!this.isOnline || typeof isAdmin !== 'function' || !isAdmin()) throw new Error('Not authorized');
    await this.db.ref(`/item_images/${itemId}`).remove();
    await this.adminLog('item_image_delete', { itemId });
  }
  async loadAllItemImages() {
    if (!this.isOnline) return;
    try {
      const snap = await this.db.ref('/item_images').once('value');
      const data = snap.val(); if (!data) return;
      let count = 0;
      for (const [itemId, imgData] of Object.entries(data)) {
        if (GAME_DATA.items[itemId] && imgData) { GAME_DATA.items[itemId]._customImage = imgData; count++; }
      }
      console.log(`[Admin] Loaded ${count} custom item images`);
    } catch(e) { console.warn('[Admin] Could not load item images:', e); }
  }

  // ── ADMIN: READ ACTION LOG ─────────────────────────────
  async getAdminLog(limit) {
    if (!this.isOnline || typeof isAdmin !== 'function' || !isAdmin()) return [];
    try {
      const snap = await this.db.ref('/admin_log').orderByChild('at').limitToLast(limit||50).once('value');
      const items = [];
      snap.forEach(c => items.unshift({ id: c.key, ...c.val() }));
      return items;
    } catch(e) { return []; }
  }

  // ── ADMIN: LEADERBOARD RESET ──────────────────────────
  async resetLeaderboard() {
    if (!this.isOnline || typeof isAdmin !== 'function' || !isAdmin()) return false;
    try {
      const snap = await this.firestore.collection('leaderboard').get();
      const batch = this.firestore.batch();
      snap.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      await this.adminLog('reset_leaderboard', { count: snap.size });
      return true;
    } catch(e) { console.error('Reset leaderboard error:', e); return false; }
  }

  async setDisplayName(name) {
    name = (name||'').trim().replace(/[<>"'&]/g,'').substring(0, 20);
    if (!name || name.length < 1) { this.emit('notification', { type:'warn', text:'Name must be 1-20 characters.' }); return; }
    this.displayName = name;
    localStorage.setItem('ashfall_displayName', name);
    if (this.user && !this.user.isAnonymous) {
      try { await this.user.updateProfile({ displayName: name }); } catch(e) {}
    }
    this.syncProfile();
  }

  // ── CHAT ───────────────────────────────────────────────
  listenToChat(callback) {
    // Legacy wrapper - uses general channel
    this.listenToChatChannel('general', callback);
  }

  stopChatListener() {
    if (this.chatRef && this.chatListener) {
      this.chatRef.off('value', this.chatListener);
      this.chatListener = null;
    }
  }

  async sendMessage(text) {
    // Legacy wrapper - sends to general
    return this.sendChatMessage(text, 'general');
  }

  async sendSystemMessage(text) {
    if (!this.isOnline || !this.user) return;
    try {
      await this.db.ref('chat').push({
        uid: 'system',
        name: 'System',
        text,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        system: true,
      });
    } catch(e) { console.error('System msg error:', e); }
  }

  // ── ASHFALL BAZAAR (Grand Exchange) ──────────────────────
  async postListing(itemId, qty, priceEach) {
    if (!this.isOnline || !this.user || !game) { this.emit('notification',{type:'warn',text:'Not connected.'}); return null; }
    if (this.user.isAnonymous) { this.emit('notification',{type:'warn',text:'Create an account to use the Bazaar.'}); return null; }
    if (!GAME_DATA.items[itemId]) { this.emit('notification',{type:'warn',text:'Invalid item.'}); return null; }
    if (qty <= 0 || priceEach <= 0) { this.emit('notification',{type:'warn',text:'Invalid quantity or price.'}); return null; }
    if ((game.state.bank[itemId] || 0) < qty) { this.emit('notification',{type:'warn',text:'Not enough items in bank.'}); return null; }
    // Remove items from bank
    game.state.bank[itemId] -= qty;
    if (game.state.bank[itemId] <= 0) delete game.state.bank[itemId];
    try {
      const ref = await this.firestore.collection('bazaar').add({
        seller: this.user.uid,
        sellerName: this.displayName,
        item: itemId,
        itemName: GAME_DATA.items[itemId].name,
        qty,
        priceEach,
        totalPrice: qty * priceEach,
        posted: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'active',
      });
      this.emit('notification',{type:'success',text:`Listed ${qty}x ${GAME_DATA.items[itemId].name} for ${priceEach}g each!`});
      return ref.id;
    } catch(e) {
      console.error('Bazaar post error:', e);
      // Return items on failure
      game.addItem(itemId, qty);
      this.emit('notification',{type:'danger',text:'Bazaar error: ' + e.message});
      return null;
    }
  }

  async getBazaarListings(searchItem) {
    if (!this.isOnline) return [];
    try {
      let q;
      if (searchItem) {
        q = this.firestore.collection('bazaar').where('status','==','active').where('item','==',searchItem).limit(50);
      } else {
        q = this.firestore.collection('bazaar').where('status','==','active').limit(50);
      }
      const snap = await q.get();
      const list = [];
      snap.forEach(doc => list.push({ id:doc.id, ...doc.data() }));
      // Sort client-side (avoids index requirement)
      list.sort((a,b) => (b.posted?.seconds||0) - (a.posted?.seconds||0));
      return list;
    } catch(e) {
      console.error('Bazaar fetch error:', e);
      this.emit('notification',{type:'danger',text:'Bazaar load failed. Check Firebase indexes.'});
      return [];
    }
  }

  async buyListing(listingId) {
    if (!this.isOnline || !this.user || !game) { this.emit('notification',{type:'warn',text:'Not connected.'}); return false; }
    if (this.user.isAnonymous) { this.emit('notification',{type:'warn',text:'Create an account to buy items.'}); return false; }
    try {
      const ref = this.firestore.collection('bazaar').doc(listingId);
      const doc = await ref.get();
      if (!doc.exists || doc.data().status !== 'active') { this.emit('notification',{type:'warn',text:'Listing no longer available.'}); return false; }
      const listing = doc.data();
      if (listing.seller === this.user.uid) { this.emit('notification',{type:'warn',text:'Cannot buy your own listing.'}); return false; }
      if (game.state.gold < listing.totalPrice) { this.emit('notification',{type:'warn',text:`Need ${listing.totalPrice}g. You have ${game.state.gold}g.`}); return false; }
      // Execute trade
      game.state.gold -= listing.totalPrice;
      game.addItem(listing.item, listing.qty);
      await ref.update({ status:'sold', buyer:this.user.uid, buyerName:this.displayName, soldAt:firebase.firestore.FieldValue.serverTimestamp() });
      // Credit seller (store pending gold)
      await this.firestore.collection('bazaar_gold').doc(listing.seller).set({
        pending: firebase.firestore.FieldValue.increment(listing.totalPrice),
      }, { merge: true });
      this.emit('notification',{type:'success',text:`Bought ${listing.qty}x ${listing.itemName} for ${listing.totalPrice}g!`});
      return true;
    } catch(e) { console.error('Bazaar buy error:',e); return false; }
  }

  async cancelListing(listingId) {
    if (!this.isOnline || !this.user) return;
    try {
      const ref = this.firestore.collection('bazaar').doc(listingId);
      const doc = await ref.get();
      if (!doc.exists || doc.data().seller !== this.user.uid) return;
      const data = doc.data();
      await ref.update({ status:'cancelled' });
      game.addItem(data.item, data.qty);
      this.emit('notification',{type:'info',text:`Cancelled listing. ${data.qty}x ${data.itemName} returned.`});
    } catch(e) { console.error('Cancel error:',e); }
  }

  async collectBazaarGold() {
    if (!this.isOnline || !this.user) return;
    try {
      const ref = this.firestore.collection('bazaar_gold').doc(this.user.uid);
      const doc = await ref.get();
      if (doc.exists && doc.data().pending > 0) {
        const gold = doc.data().pending;
        game.state.gold += gold;
        game.state.stats.goldEarned += gold;
        await ref.set({ pending: 0 });
        this.emit('notification',{type:'success',text:`Collected ${gold}g from sales!`});
      } else {
        this.emit('notification',{type:'info',text:'No pending gold.'});
      }
    } catch(e) { console.error('Collect gold error:',e); }
  }

  // ── CLOUD SAVES ────────────────────────────────────────
  async saveToCloud(silent) {
    if (!this.isOnline || !this.user || !game || this.user.isAnonymous) return;
    try {
      const save = JSON.parse(JSON.stringify(game.state));
      save._cloudSaveTime = Date.now();
      save.lastSave = Date.now();
      await this.firestore.collection('saves').doc(this.user.uid).set({
        save,
        uid: this.user.uid,
        displayName: this.displayName,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      });
      // Also update player profile
      this.syncProfile();
      if (!silent) this.emit('notification', { type:'success', text:'Saved to cloud.' });
    } catch(e) {
      if (!silent) this.emit('notification', { type:'danger', text:'Cloud save failed: ' + e.message });
    }
  }

  async loadFromCloud(silent) {
    if (!this.isOnline || !this.user) return null;
    try {
      const doc = await this.firestore.collection('saves').doc(this.user.uid).get();
      if (doc.exists && doc.data().save) {
        if (!silent) this.emit('notification', { type:'success', text:'Loaded from cloud.' });
        return doc.data().save;
      }
    } catch(e) { console.error('Cloud load error:', e); }
    return null;
  }

  // ── WILDERNESS PRESENCE ────────────────────────────────
  // Track which zone+monster each player is fighting in real-time
  async _updatePresence() {
    if (!this.isOnline || !this.user || this.user.isAnonymous) return;
    // Use Realtime Database for presence (faster than Firestore)
    this._presenceRef = this.db.ref('presence/' + this.user.uid);
    this._presenceRef.onDisconnect().remove();
    this._presenceRef.set({
      uid: this.user.uid,
      name: this.displayName,
      combatLevel: game ? game.getCombatLevel() : 1,
      online: true,
      zone: null,
      monster: null,
      lastUpdate: firebase.database.ServerValue.TIMESTAMP,
    });
  }

  async setWildernessPresence(zoneId, monsterId) {
    if (!this._presenceRef) return;
    await this._presenceRef.update({
      zone: zoneId,
      monster: monsterId,
      combatLevel: game ? game.getCombatLevel() : 1,
      lastUpdate: firebase.database.ServerValue.TIMESTAMP,
    });
  }

  async clearWildernessPresence() {
    if (!this._presenceRef) return;
    await this._presenceRef.update({ zone: null, monster: null });
  }

  async getPlayersInZone(zoneId) {
    if (!this.isOnline) return [];
    try {
      const snap = await this.db.ref('presence').orderByChild('zone').equalTo(zoneId).once('value');
      const players = [];
      snap.forEach(child => {
        const d = child.val();
        if (d.uid !== this.user?.uid && d.online) {
          players.push(d);
        }
      });
      return players;
    } catch(e) { return []; }
  }

  async syncProfile() {
    if (!this.isOnline || !this.user || !game) return;
    if (this.user.isAnonymous) return;
    return this.syncProfileFull();
  }

  async syncProfileFull() {
    if (!this.isOnline || !this.user || !game) return;
    if (this.user.isAnonymous) return;
    try {
      const s = game.state;
      const p = s.profile || {};
      const skillLevels = {}, skillXp = {};
      let totalXp = 0;
      for (const [id, sk] of Object.entries(s.skills)) {
        skillLevels[id] = sk.level; skillXp[id] = sk.xp; totalXp += sk.xp;
      }
      const seed = p.avatarSeed || this.displayName || 'Survivor';
      const avatarUrl = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(seed)}&hair=${p.hair||'short04'}&skinColor=${p.skinColor||'c68642'}&hairColor=${p.hairColor||'2c1b18'}&mouth=${p.mouth||'happy01'}&eyes=${p.eyes||'variant04'}&clothing=${p.clothing||'variant04'}&clothingColor=${p.clothingColor||'4a90d4'}${p.accessory?'&accessories='+p.accessory:''}&size=80`;
      await this.firestore.collection('players').doc(this.user.uid).set({
        displayName: this.displayName,
        uid: this.user.uid,
        combatLevel: game.getCombatLevel(),
        totalLevel: game.getTotalLevel(),
        totalXp, skills: skillLevels, skillsXp: skillXp,
        pvpRating: this.pvpRating,
        alignment: s.alignment,
        kills: s.stats?.monstersKilled || 0,
        gold: s.gold,
        goldEarned: s.stats?.goldEarned || 0,
        questsCompleted: s.quests?.completed?.length || 0,
        questPoints: s.questPoints || 0,
        dungeonClears: s.stats?.dungeonsCompleted || 0,
        playTime: Math.floor(s.stats?.totalPlayTime || 0),
        pvpWins: s.stats?.pvpWins || 0,
        pvpLosses: s.stats?.pvpLosses || 0,
        prestigeRank: s._prestigeRank || 0,
        // Avatar & profile data
        profile: {
          avatarSeed: p.avatarSeed || this.displayName || 'Survivor',
          hair: p.hair || 'short04',
          skinColor: p.skinColor || 'c68642',
          hairColor: p.hairColor || '2c1b18',
          eyes: p.eyes || 'variant04',
          mouth: p.mouth || 'happy01',
          clothing: p.clothing || 'variant04',
          clothingColor: p.clothingColor || '4a90d4',
          accessory: p.accessory || '',
          bio: p.bio || '',
        },
        avatarUrl,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    } catch(e) { console.error('Sync profile error:', e); }
  }

  async getLeaderboard(sortField, limit) {
    if (!this.isOnline) return [];
    try {
      const snap = await this.firestore.collection('players')
        .orderBy(sortField || 'totalLevel', 'desc')
        .limit(limit || 25)
        .get();
      const board = [];
      snap.forEach(doc => board.push({ uid:doc.id, ...doc.data() }));
      return board;
    } catch(e) { console.error('Leaderboard error:', e); return []; }
  }

  async loadProfile() {
    if (!this.isOnline || !this.user) return;
    try {
      const doc = await this.firestore.collection('players').doc(this.user.uid).get();
      if (doc.exists) {
        const data = doc.data();
        if (data.pvpRating) this.pvpRating = data.pvpRating;
        if (data.displayName) this.displayName = data.displayName;
      }
    } catch(e) {}
  }

  // ── PVP SYSTEM (Async) ────────────────────────────────
  async submitPvPChallenge() {
    if (!this.isOnline || !this.user || !game) return;
    const s = game.state;
    const build = {
      uid: this.user.uid,
      name: this.displayName,
      combatLevel: game.getCombatLevel(),
      pvpRating: this.pvpRating,
      skills: {
        attack: s.skills.attack.level,
        strength: s.skills.strength.level,
        defence: s.skills.defence.level,
        hitpoints: s.skills.hitpoints.level,
        ranged: s.skills.ranged.level,
        magic: s.skills.magic.level,
      },
      equipment: { ...s.equipment },
      combatStyle: s.combat.combatStyle,
      selectedSpell: s.combat.selectedSpell,
      alignment: s.alignment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };
    try {
      await this.firestore.collection('pvp_queue').doc(this.user.uid).set(build);
      this.emit('notification', { type:'info', text:'Build submitted. Searching for opponent...' });
      return await this.findMatch();
    } catch(e) {
      this.emit('notification', { type:'danger', text:'PvP error: ' + e.message });
      return null;
    }
  }

  async findMatch() {
    if (!this.isOnline || !this.user) return null;
    try {
      const myLevel = game.getCombatLevel();
      const snap = await this.firestore.collection('pvp_queue')
        .where('combatLevel', '>=', Math.max(1, myLevel - 15))
        .where('combatLevel', '<=', myLevel + 15)
        .limit(10)
        .get();

      let opponent = null;
      snap.forEach(doc => {
        if (doc.id !== this.user.uid && !opponent) opponent = doc.data();
      });

      if (!opponent) {
        // No real opponent found - create a scaled AI opponent from player stats
        opponent = {
          uid: 'ai_' + Date.now(),
          name: 'Arena Champion',
          combatLevel: myLevel + Math.floor(Math.random() * 6) - 3,
          pvpRating: this.pvpRating + Math.floor(Math.random() * 200) - 100,
          skills: {
            attack: game.state.skills.attack.level + Math.floor(Math.random() * 10) - 5,
            strength: game.state.skills.strength.level + Math.floor(Math.random() * 10) - 5,
            defence: game.state.skills.defence.level + Math.floor(Math.random() * 10) - 5,
            hitpoints: game.state.skills.hitpoints.level + Math.floor(Math.random() * 5) - 2,
            ranged: game.state.skills.ranged.level,
            magic: game.state.skills.magic.level,
          },
          equipment: { ...game.state.equipment }, // mirror player gear roughly
          combatStyle: game.state.combat.combatStyle,
        };
        // Clamp skill levels
        for (const k of Object.keys(opponent.skills)) {
          opponent.skills[k] = Math.max(1, Math.min(99, opponent.skills[k]));
        }
        this.emit('notification', { type:'info', text:'No players online. Fighting an Arena Champion.' });
      } else {
        this.emit('notification', { type:'danger', text:`Matched against ${opponent.name} (Cb ${opponent.combatLevel})!` });
      }

      // Start LIVE combat (navigates to combat page)
      const status = this.resolvePvPCombat(game.state, opponent);
      // Clean up queue
      try { await this.firestore.collection('pvp_queue').doc(this.user.uid).delete(); } catch(e) {}
      return status;
    } catch(e) {
      console.error('Match error:', e);
      return null;
    }
  }

  resolvePvPCombat(playerState, opponent) {
    // Instead of instant simulation, create a real monster from opponent stats
    // and start actual engine combat so the player SEES the fight
    const oSkills = opponent.skills;
    const oHp = oSkills.hitpoints * 10 + 10;
    const oAtk = oSkills.attack + this.getEquipStat(opponent.equipment, 'attackBonus');
    const oStr = oSkills.strength + this.getEquipStat(opponent.equipment, 'strengthBonus');
    const oDef = oSkills.defence + this.getEquipStat(opponent.equipment, 'defenceBonus');
    const oRng = (oSkills.ranged || 1) + this.getEquipStat(opponent.equipment, 'rangedBonus');
    const oMag = (oSkills.magic || 1) + this.getEquipStat(opponent.equipment, 'magicBonus');
    // Use the proper damage formula: (1 + level/10) * (1 + bonus/80) * 4
    const oMaxHit = Math.max(4, Math.floor((1 + oStr / 10) * (1 + this.getEquipStat(opponent.equipment, 'strengthBonus') / 80) * 4));
    const oDR = this.getEquipStat(opponent.equipment, 'damageReduction');
    const oStyle = opponent.combatStyle || 'melee';

    // Create opponent as a monster in the engine
    const pvpMonster = {
      id: 'pvp_arena_opponent',
      name: opponent.name || 'Arena Challenger',
      hp: oHp,
      maxHit: oMaxHit,
      attackSpeed: 2.0,
      combatLevel: opponent.combatLevel || 10,
      style: oStyle,
      evasion: { melee: oDef, ranged: oDef, magic: oDef },
      xp: opponent.combatLevel * 30,
      gold: { min: 50 + opponent.combatLevel * 5, max: 100 + opponent.combatLevel * 15 },
      alignment: 'NN',
      drops: [{ item: 'bones', qty: 1, chance: 1.0 }],
    };
    GAME_DATA.monsters.pvp_arena_opponent = pvpMonster;

    // Start REAL combat via the engine
    game.startCombat(null, 'pvp_arena_opponent');
    game.state.combat._isDuel = true; // no flee
    game.state.combat._pvpArena = true;
    game.state.combat._pvpOpponent = {
      uid: opponent.uid,
      name: opponent.name,
      combatLevel: opponent.combatLevel,
      pvpRating: opponent.pvpRating,
    };

    // Return null - results will come from onMonsterDeath/onPlayerDeath
    return 'STARTED';
  }

  getEquipStat(equipment, stat) {
    if (!equipment) return 0;
    let total = 0;
    for (const slot of Object.keys(equipment)) {
      const itemId = equipment[slot];
      if (itemId && GAME_DATA.items[itemId]?.stats?.[stat]) {
        total += GAME_DATA.items[itemId].stats[stat];
      }
    }
    return total;
  }

  async storePvPResult(result, opponent) {
    if (!this.isOnline || !this.user) return;
    try {
      // Roll PvP loot on win
      if (result.won && game) {
        const loot = this.rollPvPLoot(opponent.combatLevel || 10);
        for (const l of loot) {
          game.addItem(l.item, l.qty);
          this.emit('notification', { type:'rare', text:`PvP Loot: ${GAME_DATA.items[l.item]?.name || l.item}!` });
        }
      }

      // Store result in Firestore
      await this.firestore.collection('pvp_results').add({
        winner: result.won ? this.user.uid : (opponent.uid || 'ai'),
        loser: result.won ? (opponent.uid || 'ai') : this.user.uid,
        winnerName: result.won ? this.displayName : (result.opponentName || opponent.name),
        loserName: result.won ? (result.opponentName || opponent.name) : this.displayName,
        ratingChange: result.ratingChange,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // Update leaderboard
      await this.firestore.collection('leaderboard').doc(this.user.uid).set({
        name: this.displayName,
        rating: this.pvpRating,
        combatLevel: game.getCombatLevel(),
        wins: firebase.firestore.FieldValue.increment(result.won ? 1 : 0),
        losses: firebase.firestore.FieldValue.increment(result.won ? 0 : 1),
        lastFight: firebase.firestore.FieldValue.serverTimestamp(),
      }, { merge:true });

      this.syncProfile();
    } catch(e) { console.error('Store PvP result error:', e); }
  }

  rollPvPLoot(opponentLevel) {
    const loot = [];
    const table = GAME_DATA.pvpLoot || [];
    for (const entry of table) {
      if (opponentLevel >= (entry.minLevel || 0) && Math.random() < entry.chance) {
        loot.push({ item:entry.item, qty:entry.qty || 1 });
      }
    }
    return loot;
  }

  async getPvPHistory() {
    if (!this.isOnline || !this.user) return [];
    try {
      const snap = await this.firestore.collection('pvp_results')
        .orderBy('timestamp', 'desc')
        .limit(20)
        .get();
      const results = [];
      snap.forEach(doc => results.push({ id:doc.id, ...doc.data() }));
      return results;
    } catch(e) { return []; }
  }

  // ── BOUNTY SYSTEM ──────────────────────────────────────
  // Three types: pvp (kill player), monster (contract: kill N of monster), gather (contract: gather N of item)

  async placeBounty(opts) {
    // opts: { type:'pvp'|'monster'|'gather', targetName?, monsterId?, itemId?, qty?, amount, duration }
    if (!this.isOnline || !this.user || !game) return null;
    const { type, targetName, monsterId, itemId, qty, amount, duration=86400000 } = opts;
    if (!amount || amount < 500) {
      this.emit('notification', { type:'warn', text:'Minimum bounty is 500 gold.' }); return null;
    }
    if (game.state.gold < amount) {
      this.emit('notification', { type:'warn', text:'Not enough gold.' }); return null;
    }
    if (type === 'pvp' && !targetName) {
      this.emit('notification', { type:'warn', text:'Specify a target player name.' }); return null;
    }
    if (type === 'monster' && (!monsterId || !qty || qty < 1)) {
      this.emit('notification', { type:'warn', text:'Specify a monster and kill count.' }); return null;
    }
    if (type === 'gather' && (!itemId || !qty || qty < 1)) {
      this.emit('notification', { type:'warn', text:'Specify an item and gather amount.' }); return null;
    }

    game.state.gold -= amount;
    game.state.stats.goldSpent = (game.state.stats.goldSpent || 0) + amount;
    try {
      const doc = {
        type,
        placedBy: this.user.uid,
        placedByName: this.displayName,
        amount,
        claimed: false,
        claimedBy: null,
        claimedByName: null,
        cancelled: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        expiresAt: new Date(Date.now() + duration),
      };
      if (type === 'pvp')     { doc.targetName = targetName; }
      if (type === 'monster') { doc.monsterId = monsterId; doc.targetQty = qty; doc.progress = {}; }
      if (type === 'gather')  { doc.itemId = itemId; doc.targetQty = qty; doc.progress = {}; }

      const ref = await this.firestore.collection('bounties').add(doc);
      const label = type === 'pvp' ? `on ${targetName}`
        : type === 'monster' ? `Kill ${qty}x ${GAME_DATA.monsters[monsterId]?.name||monsterId}`
        : `Gather ${qty}x ${GAME_DATA.items[itemId]?.name||itemId}`;
      this.emit('notification', { type:'success', text:`Bounty placed: ${label} — ${amount}g reward!` });
      return ref.id;
    } catch(e) {
      game.state.gold += amount; // refund
      this.emit('notification', { type:'danger', text:'Bounty error: ' + e.message });
      return null;
    }
  }

  async cancelBounty(bountyId) {
    if (!this.isOnline || !this.user || !game) return;
    try {
      const doc = await this.firestore.collection('bounties').doc(bountyId).get();
      if (!doc.exists) return;
      const data = doc.data();
      if (data.placedBy !== this.user.uid) {
        this.emit('notification', { type:'warn', text:'You can only cancel your own bounties.' }); return;
      }
      if (data.claimed || data.cancelled) {
        this.emit('notification', { type:'warn', text:'Bounty already resolved.' }); return;
      }
      // Refund 75% of amount
      const refund = Math.floor(data.amount * 0.75);
      await this.firestore.collection('bounties').doc(bountyId).update({ cancelled: true, cancelledAt: new Date() });
      game.state.gold += refund;
      this.emit('notification', { type:'info', text:`Bounty cancelled. Refunded ${refund}g (75%).` });
    } catch(e) { this.emit('notification', { type:'danger', text:'Cancel error: ' + e.message }); }
  }

  async getActiveBounties(filter='all') {
    if (!this.isOnline) return [];
    try {
      // Single where clause only — avoids composite index requirement
      const snap = await this.firestore.collection('bounties')
        .where('claimed', '==', false)
        .limit(100)
        .get();
      const now = new Date();
      const bounties = [];
      snap.forEach(doc => {
        const d = { id:doc.id, ...doc.data() };
        if (d.cancelled) return;
        const exp = d.expiresAt?.toDate ? d.expiresAt.toDate() : (d.expiresAt ? new Date(d.expiresAt) : null);
        if (exp && exp < now) return;
        if (filter !== 'all' && d.type !== filter) return;
        bounties.push(d);
      });
      return bounties.sort((a,b) => (b.amount||0) - (a.amount||0));
    } catch(e) { console.error('getActiveBounties error:', e); return []; }
  }

  async getMyBounties() {
    if (!this.isOnline || !this.user) return [];
    try {
      const snap = await this.firestore.collection('bounties')
        .where('placedBy', '==', this.user.uid)
        .limit(30)
        .get();
      return snap.docs.map(doc => ({ id:doc.id, ...doc.data() }))
        .sort((a,b) => (b.timestamp?.toMillis?.() || 0) - (a.timestamp?.toMillis?.() || 0));
    } catch(e) { return []; }
  }

  async getBountiesOnMe() {
    if (!this.isOnline || !this.user) return [];
    try {
      const name = this.displayName;
      const snap = await this.firestore.collection('bounties')
        .where('targetName', '==', name)
        .where('claimed', '==', false)
        .where('cancelled', '==', false)
        .limit(10)
        .get();
      return snap.docs.map(doc => ({ id:doc.id, ...doc.data() }));
    } catch(e) { return []; }
  }

  async claimBounty(bountyId) {
    if (!this.isOnline || !this.user || !game) return false;
    try {
      const doc = await this.firestore.collection('bounties').doc(bountyId).get();
      if (!doc.exists) { this.emit('notification', { type:'warn', text:'Bounty not found.' }); return false; }
      const bounty = doc.data();
      if (bounty.claimed || bounty.cancelled) {
        this.emit('notification', { type:'warn', text:'Bounty already resolved.' }); return false;
      }
      if (bounty.type === 'pvp') {
        // Verify via this session's kill list
        const killed = this._sessionBountyKills || [];
        if (!killed.includes(bounty.targetName)) {
          this.emit('notification', { type:'warn', text:`You must defeat ${bounty.targetName} in the Wilderness first.` }); return false;
        }
      }
      if (bounty.type === 'monster' || bounty.type === 'gather') {
        const myProg = (bounty.progress || {})[this.user.uid] || 0;
        if (myProg < bounty.targetQty) {
          const left = bounty.targetQty - myProg;
          const label = bounty.type === 'monster'
            ? `${left} more ${GAME_DATA.monsters[bounty.monsterId]?.name||bounty.monsterId} to kill`
            : `${left} more ${GAME_DATA.items[bounty.itemId]?.name||bounty.itemId} to gather`;
          this.emit('notification', { type:'warn', text:`Contract incomplete: ${label}.` }); return false;
        }
      }
      await this.firestore.collection('bounties').doc(bountyId).update({
        claimed: true,
        claimedBy: this.user.uid,
        claimedByName: this.displayName,
        claimedAt: new Date(),
      });
      game.state.gold += bounty.amount;
      game.state.stats.goldEarned = (game.state.stats.goldEarned || 0) + bounty.amount;
      const label = bounty.type === 'pvp' ? `PvP bounty on ${bounty.targetName}`
        : bounty.type === 'monster' ? `monster contract`
        : `gathering contract`;
      this.emit('notification', { type:'achievement', text:`Bounty claimed! +${bounty.amount}g (${label})` });
      if (bounty.type === 'pvp') this._sessionBountyKills = (this._sessionBountyKills||[]).filter(n=>n!==bounty.targetName);
      return true;
    } catch(e) { this.emit('notification', { type:'danger', text:'Claim error: ' + e.message }); return false; }
  }

  // Called when player kills a real player in wilderness
  async checkBountiesOnKill(killedName) {
    if (!killedName || !this.isOnline) return;
    if (!this._sessionBountyKills) this._sessionBountyKills = [];
    this._sessionBountyKills.push(killedName);
    // Check if any PvP bounties exist on this target
    try {
      const snap = await this.firestore.collection('bounties')
        .where('type', '==', 'pvp')
        .where('targetName', '==', killedName)
        .where('claimed', '==', false)
        .where('cancelled', '==', false)
        .limit(5)
        .get();
      if (!snap.empty) {
        let total = 0;
        snap.forEach(doc => { total += doc.data().amount; });
        this.emit('notification', { type:'achievement', text:`${killedName} has ${snap.size} active bounty/ies (${total}g total)! Go to Bounty Board to claim.` });
      }
    } catch(e) {}
  }

  // Called on every monster kill + gather to update contract progress
  async tickContractProgress(type, targetId, qty) {
    if (!this.isOnline || !this.user) return;
    try {
      // Find matching active contracts
      const field = type === 'monster' ? 'monsterId' : 'itemId';
      const snap = await this.firestore.collection('bounties')
        .where('type', '==', type)
        .where(field, '==', targetId)
        .where('claimed', '==', false)
        .where('cancelled', '==', false)
        .limit(10)
        .get();
      if (snap.empty) return;
      for (const doc of snap.docs) {
        const data = doc.data();
        const progKey = `progress.${this.user.uid}`;
        const cur = (data.progress || {})[this.user.uid] || 0;
        const newVal = cur + qty;
        await doc.ref.update({ [progKey]: newVal });
        if (newVal >= data.targetQty && cur < data.targetQty) {
          // Just completed!
          const label = type === 'monster'
            ? `Kill ${data.targetQty}x ${GAME_DATA.monsters[targetId]?.name||targetId}`
            : `Gather ${data.targetQty}x ${GAME_DATA.items[targetId]?.name||targetId}`;
          this.emit('notification', { type:'achievement', text:`Contract complete: ${label}! Claim ${data.amount}g on the Bounty Board!` });
        }
      }
    } catch(e) {} // fire and forget, non-critical
  }

  // ── GUILDS ─────────────────────────────────────────────
  static RANK_ORDER = ['Leader','General','Captain','Lieutenant','Sergeant','Member','Recruit'];
  static RANK_COLORS = {Leader:'#c9873e',General:'#c44040',Captain:'#4a7ec4',Lieutenant:'#8a5ec4',Sergeant:'#3a9e5c',Member:'#c8cad4',Recruit:'#7a7e94'};

  _rankIdx(rank) { return OnlineManager.RANK_ORDER.indexOf(rank || 'Recruit'); }

  async createGuild(name, tag) {
    if (!this.isOnline || !this.user) return false;
    if (this.user.isAnonymous) { this.emit('notification',{type:'warn',text:'Create an account first.'}); return false; }
    try {
      const ref = await this.firestore.collection('guilds').add({
        name, tag: tag.toUpperCase(), leader: this.user.uid, leaderName: this.displayName,
        members: [{ uid:this.user.uid, name:this.displayName, rank:'Leader', joined:Date.now(), lastSeen:Date.now() }],
        ranks: OnlineManager.RANK_ORDER,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        memberCount: 1, bank: 0,
        motd: 'Welcome to the guild!',
        description: '',
        settings: { joinType: 'open', withdrawRank: 'General' },
      });
      game.state.guild = { id:ref.id, name, tag:tag.toUpperCase(), role:'Leader' };
      await this._logGuildAction(ref.id, 'created', { by: this.displayName });
      this.emit('notification',{type:'success',text:`Guild "${name}" [${tag}] created!`});
      return true;
    } catch(e) { this.emit('notification',{type:'danger',text:'Guild error: '+e.message}); return false; }
  }

  async getGuildInfo(guildId) {
    if (!this.isOnline) return null;
    try {
      const doc = await this.firestore.collection('guilds').doc(guildId || game.state.guild?.id).get();
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    } catch(e) { return null; }
  }

  async joinGuild(guildName) {
    if (!this.isOnline || !this.user) return false;
    if (this.user.isAnonymous) { this.emit('notification',{type:'warn',text:'Create an account first.'}); return false; }
    try {
      const snap = await this.firestore.collection('guilds').where('name','==',guildName).limit(1).get();
      if (snap.empty) { this.emit('notification',{type:'warn',text:'Guild not found.'}); return false; }
      const doc = snap.docs[0];
      const data = doc.data();
      if ((data.settings?.joinType || 'open') === 'invite') { this.emit('notification',{type:'warn',text:'Guild is invite-only.'}); return false; }
      if (data.members.length >= 50) { this.emit('notification',{type:'warn',text:'Guild is full (50 max).'}); return false; }
      if (data.members.some(m => m.uid === this.user.uid)) { this.emit('notification',{type:'warn',text:'Already in this guild.'}); return false; }
      data.members.push({ uid:this.user.uid, name:this.displayName, rank:'Recruit', joined:Date.now(), lastSeen:Date.now() });
      await doc.ref.update({ members:data.members, memberCount:data.members.length });
      game.state.guild = { id:doc.id, name:data.name, tag:data.tag, role:'Recruit' };
      await this._logGuildAction(doc.id, 'joined', { player: this.displayName });
      this.emit('notification',{type:'success',text:`Joined guild "${data.name}"!`});
      return true;
    } catch(e) { this.emit('notification',{type:'danger',text:'Join error: '+e.message}); return false; }
  }

  async leaveGuild() {
    if (!this.isOnline || !this.user || !game.state.guild) return;
    try {
      const gid = game.state.guild.id;
      const ref = this.firestore.collection('guilds').doc(gid);
      const doc = await ref.get();
      if (doc.exists) {
        const data = doc.data();
        data.members = data.members.filter(m => m.uid !== this.user.uid);
        if (data.members.length === 0) { await ref.delete(); }
        else {
          // If leader leaves, promote highest-ranked remaining member
          if (data.leader === this.user.uid && data.members.length > 0) {
            data.members.sort((a,b) => this._rankIdx(a.rank) - this._rankIdx(b.rank));
            data.members[0].rank = 'Leader';
            data.leader = data.members[0].uid;
            data.leaderName = data.members[0].name;
          }
          await ref.update({ members:data.members, memberCount:data.members.length, leader:data.leader, leaderName:data.leaderName });
        }
        await this._logGuildAction(gid, 'left', { player: this.displayName });
      }
      this.stopGuildChatListener();
      const guildName = game.state.guild.name;
      game.state.guild = null;
      this.emit('notification',{type:'info',text:`Left guild "${guildName}".`});
    } catch(e) { console.error('Leave guild error:', e); }
  }

  async kickMember(memberUid) {
    if (!this.isOnline || !this.user || !game.state.guild) return;
    const myIdx = this._rankIdx(game.state.guild.role);
    if (myIdx > 2) { this.emit('notification',{type:'warn',text:'Only Leader, General, or Captain can kick.'}); return; }
    try {
      const ref = this.firestore.collection('guilds').doc(game.state.guild.id);
      const doc = await ref.get();
      if (!doc.exists) return;
      const data = doc.data();
      const member = data.members.find(m => m.uid === memberUid);
      if (!member) { this.emit('notification',{type:'warn',text:'Member not found.'}); return; }
      if (this._rankIdx(member.rank) <= myIdx) { this.emit('notification',{type:'warn',text:'Cannot kick equal or higher rank.'}); return; }
      data.members = data.members.filter(m => m.uid !== memberUid);
      await ref.update({ members:data.members, memberCount:data.members.length });
      await this._logGuildAction(game.state.guild.id, 'kicked', { player: member.name, by: this.displayName });
      this.emit('notification',{type:'success',text:`Kicked ${member.name}.`});
    } catch(e) { this.emit('notification',{type:'danger',text:'Kick failed: '+e.message}); }
  }

  async getGuildMembers() {
    if (!this.isOnline || !this.user || !game.state.guild) return [];
    try {
      const doc = await this.firestore.collection('guilds').doc(game.state.guild.id).get();
      if (!doc.exists) return [];
      const members = doc.data().members || [];
      // Normalize: ensure every member has 'rank' (migrate from old 'role' field)
      for (const m of members) {
        if (!m.rank) m.rank = m.role || 'Recruit';
      }
      // Update my lastSeen
      const me = members.find(m => m.uid === this.user.uid);
      if (me) { me.lastSeen = Date.now(); await doc.ref.update({ members }); }
      return members;
    } catch(e) { return []; }
  }

  async depositGuildGold(amount) {
    if (!this.isOnline || !this.user || !game.state.guild) return;
    if (amount <= 0 || game.state.gold < amount) { this.emit('notification',{type:'warn',text:'Not enough gold.'}); return; }
    try {
      game.state.gold -= amount;
      const ref = this.firestore.collection('guilds').doc(game.state.guild.id);
      await ref.update({ bank: firebase.firestore.FieldValue.increment(amount) });
      await this._logGuildAction(game.state.guild.id, 'deposit', { player: this.displayName, amount });
      this.emit('notification',{type:'success',text:`Deposited ${amount}g to guild bank.`});
    } catch(e) { game.state.gold += amount; this.emit('notification',{type:'danger',text:'Deposit failed: '+e.message}); }
  }

  async getGuildBank() {
    if (!this.isOnline || !this.user || !game.state.guild) return 0;
    try {
      const doc = await this.firestore.collection('guilds').doc(game.state.guild.id).get();
      return doc.exists ? (doc.data().bank || 0) : 0;
    } catch(e) { return 0; }
  }

  async withdrawGuildGold(amount) {
    if (!this.isOnline || !this.user || !game.state.guild) return;
    // Sync role from Firestore first to avoid stale local role
    await this.syncGuildRole();
    const myRank = game.state.guild.role;
    try {
      const ref = this.firestore.collection('guilds').doc(game.state.guild.id);
      const doc = await ref.get();
      if (!doc.exists) return;
      const data = doc.data();
      const withdrawRank = data.settings?.withdrawRank || 'General';
      const myIdx = this._rankIdx(myRank);
      const withdrawIdx = this._rankIdx(withdrawRank);
      if (myIdx > withdrawIdx) {
        this.emit('notification',{type:'warn',text:`Only ${withdrawRank} and above can withdraw.`}); return;
      }
      const bank = data.bank || 0;
      if (amount > bank) { this.emit('notification',{type:'warn',text:`Guild bank only has ${bank}g.`}); return; }
      if (amount <= 0) { this.emit('notification',{type:'warn',text:'Invalid amount.'}); return; }
      await ref.update({ bank: firebase.firestore.FieldValue.increment(-amount) });
      game.state.gold += amount;
      await this._logGuildAction(game.state.guild.id, 'withdraw', { player: this.displayName, amount });
      this.emit('notification',{type:'success',text:`Withdrew ${amount}g from guild bank.`});
    } catch(e) { this.emit('notification',{type:'danger',text:'Withdraw failed: '+e.message}); }
  }

  // Sync guild role from Firestore (fixes stale local role after rank changes)
  // Also migrates old 'role' field to 'rank' if needed
  async syncGuildRole() {
    if (!this.isOnline || !this.user || !game.state.guild) return;
    try {
      const doc = await this.firestore.collection('guilds').doc(game.state.guild.id).get();
      if (!doc.exists) { game.state.guild = null; return; }
      const data = doc.data();
      const me = data.members.find(m => m.uid === this.user.uid);
      if (!me) { game.state.guild = null; return; }
      // Support both old 'role' field and new 'rank' field
      const actualRank = me.rank || me.role || 'Recruit';
      game.state.guild.role = actualRank;
      game.state.guild.name = data.name;
      game.state.guild.tag = data.tag;
      // Auto-migrate: if member has 'role' but not 'rank', write 'rank' field
      let needsMigration = false;
      for (const m of data.members) {
        if (m.role && !m.rank) {
          m.rank = m.role;
          needsMigration = true;
        }
        if (!m.rank && !m.role) {
          m.rank = 'Recruit';
          needsMigration = true;
        }
      }
      if (needsMigration) {
        try { await doc.ref.update({ members: data.members }); } catch(e) {}
      }
      // Also ensure settings exist
      if (!data.settings || Object.keys(data.settings).length === 0) {
        try { await doc.ref.update({ settings: { joinType: 'open', withdrawRank: 'General' } }); } catch(e) {}
      }
    } catch(e) { console.error('syncGuildRole error:', e); }
  }

  async setMemberRank(memberUid, newRank) {
    if (!this.isOnline || !this.user || !game.state.guild) return;
    await this.syncGuildRole();
    const myRank = game.state.guild.role;
    const myIdx = this._rankIdx(myRank);
    const targetIdx = this._rankIdx(newRank);
    if (myIdx < 0 || targetIdx <= myIdx) { this.emit('notification',{type:'warn',text:'Cannot assign a rank equal to or above your own.'}); return; }
    try {
      const ref = this.firestore.collection('guilds').doc(game.state.guild.id);
      const doc = await ref.get();
      if (!doc.exists) return;
      const data = doc.data();
      const member = data.members.find(m => m.uid === memberUid);
      if (!member) { this.emit('notification',{type:'warn',text:'Member not found.'}); return; }
      const theirIdx = this._rankIdx(member.rank);
      if (theirIdx <= myIdx && myRank !== 'Leader') { this.emit('notification',{type:'warn',text:'Cannot change rank of equal or higher rank.'}); return; }
      const oldRank = member.rank;
      member.rank = newRank;
      await ref.update({ members: data.members });
      await this._logGuildAction(game.state.guild.id, 'rank_change', { player: member.name, from: oldRank, to: newRank, by: this.displayName });
      this.emit('notification',{type:'success',text:`${member.name} is now ${newRank}.`});
    } catch(e) { this.emit('notification',{type:'danger',text:'Rank change failed: '+e.message}); }
  }

  // ── GUILD MOTD / DESCRIPTION / SETTINGS ─────────────────
  async setGuildMotd(motd) {
    if (!this.isOnline || !game.state.guild) return;
    await this.syncGuildRole();
    if (this._rankIdx(game.state.guild.role) > 1) { this.emit('notification',{type:'warn',text:'Only Leader and Generals can set MOTD.'}); return; }
    try {
      await this.firestore.collection('guilds').doc(game.state.guild.id).update({ motd: (motd||'').substring(0,300) });
      await this._logGuildAction(game.state.guild.id, 'motd_changed', { by: this.displayName });
      this.emit('notification',{type:'success',text:'MOTD updated.'});
    } catch(e) { this.emit('notification',{type:'danger',text:e.message}); }
  }

  async setGuildDescription(desc) {
    if (!this.isOnline || !game.state.guild) return;
    await this.syncGuildRole();
    if (this._rankIdx(game.state.guild.role) > 1) { this.emit('notification',{type:'warn',text:'Only Leader and Generals can set description.'}); return; }
    try {
      await this.firestore.collection('guilds').doc(game.state.guild.id).update({ description: (desc||'').substring(0,500) });
      this.emit('notification',{type:'success',text:'Description updated.'});
    } catch(e) { this.emit('notification',{type:'danger',text:e.message}); }
  }

  async setGuildSettings(settings) {
    if (!this.isOnline || !game.state.guild) return;
    await this.syncGuildRole();
    if (game.state.guild.role !== 'Leader') { this.emit('notification',{type:'warn',text:'Only the Leader can change settings.'}); return; }
    try {
      await this.firestore.collection('guilds').doc(game.state.guild.id).update({ settings });
      await this._logGuildAction(game.state.guild.id, 'settings_changed', { by: this.displayName, settings });
      this.emit('notification',{type:'success',text:'Guild settings updated.'});
    } catch(e) { this.emit('notification',{type:'danger',text:e.message}); }
  }

  // ── GUILD ACTIVITY LOG ──────────────────────────────────
  async _logGuildAction(guildId, action, details) {
    try {
      await this.firestore.collection('guild_log').add({
        guildId, action, details, timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch(e) {} // non-critical
  }

  async getGuildLog(limit) {
    if (!this.isOnline || !game.state.guild) return [];
    try {
      const snap = await this.firestore.collection('guild_log')
        .where('guildId','==',game.state.guild.id)
        .limit(limit || 50).get();
      const items = [];
      snap.forEach(doc => items.push({ id:doc.id, ...doc.data() }));
      items.sort((a,b) => (b.timestamp?.seconds||0) - (a.timestamp?.seconds||0));
      return items;
    } catch(e) { return []; }
  }

  // ── GUILD CHAT (RTDB for real-time) ─────────────────────
  listenGuildChat(callback) {
    if (!this.isOnline || !this.db || !game.state.guild) return;
    this.stopGuildChatListener();
    const gid = game.state.guild.id;
    this._guildChatRef = this.db.ref(`guild_chat/${gid}`);
    this._guildChatListener = this._guildChatRef.orderByChild('timestamp').limitToLast(100).on('value', snap => {
      const msgs = [];
      snap.forEach(child => msgs.push({ id:child.key, ...child.val() }));
      callback(msgs);
    });
  }

  stopGuildChatListener() {
    if (this._guildChatRef && this._guildChatListener) {
      this._guildChatRef.off('value', this._guildChatListener);
      this._guildChatListener = null;
    }
  }

  async sendGuildChat(text) {
    if (!this.isOnline || !this.user || !game.state.guild) return;
    text = (text||'').trim();
    if (!text || text.length > 300) return;
    try {
      const gid = game.state.guild.id;
      await this.db.ref(`guild_chat/${gid}`).push({
        uid: this.user.uid,
        name: this.displayName || 'Survivor',
        text,
        rank: game.state.guild.role || 'Recruit',
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      });
    } catch(e) { console.error('Guild chat error:', e); }
  }

  // ── GUILD SEARCH ────────────────────────────────────────
  async searchGuilds(query) {
    if (!this.isOnline) return [];
    try {
      const snap = await this.firestore.collection('guilds').limit(100).get();
      const results = [];
      const q = (query||'').toLowerCase();
      snap.forEach(doc => {
        const d = doc.data();
        if (!q || d.name?.toLowerCase().includes(q) || d.tag?.toLowerCase().includes(q)) {
          results.push({ id:doc.id, name:d.name, tag:d.tag, memberCount:d.memberCount||d.members?.length||0, leaderName:d.leaderName, joinType:d.settings?.joinType||'open' });
        }
      });
      return results.slice(0,20);
    } catch(e) { return []; }
  }

  // ── GUILD INVITATIONS ───────────────────────────────────
  async inviteToGuild(targetUid, targetName) {
    if (!this.isOnline || !this.user || !game.state.guild) return;
    await this.syncGuildRole();
    if (this._rankIdx(game.state.guild.role) > 2) { this.emit('notification',{type:'warn',text:'Captains and above can invite.'}); return; }
    try {
      await this.firestore.collection('guild_invites').add({
        guildId: game.state.guild.id, guildName: game.state.guild.name, guildTag: game.state.guild.tag,
        from: this.user.uid, fromName: this.displayName,
        to: targetUid, toName: targetName,
        status: 'pending',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      // Also send an inbox notification
      await this.firestore.collection('inbox').add({
        to: targetUid, type: 'guild_invite', fromName: this.displayName,
        preview: `${this.displayName} invited you to [${game.state.guild.tag}] ${game.state.guild.name}`,
        read: false, timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        data: { guildId: game.state.guild.id, guildName: game.state.guild.name }
      });
      this.emit('notification',{type:'success',text:`Invited ${targetName} to the guild.`});
    } catch(e) { this.emit('notification',{type:'danger',text:'Invite failed: '+e.message}); }
  }

  async getGuildInvites() {
    if (!this.isOnline || !this.user) return [];
    try {
      const snap = await this.firestore.collection('guild_invites')
        .where('to','==',this.user.uid)
        .where('status','==','pending')
        .limit(20).get();
      const items = [];
      snap.forEach(doc => items.push({ id:doc.id, ...doc.data() }));
      return items;
    } catch(e) { return []; }
  }

  async acceptGuildInvite(inviteId) {
    if (!this.isOnline || !this.user) return false;
    if (game.state.guild) { this.emit('notification',{type:'warn',text:'Leave your current guild first.'}); return false; }
    try {
      const invDoc = await this.firestore.collection('guild_invites').doc(inviteId).get();
      if (!invDoc.exists) return false;
      const inv = invDoc.data();
      const gRef = this.firestore.collection('guilds').doc(inv.guildId);
      const gDoc = await gRef.get();
      if (!gDoc.exists) { this.emit('notification',{type:'warn',text:'Guild no longer exists.'}); return false; }
      const data = gDoc.data();
      if (data.members.length >= 50) { this.emit('notification',{type:'warn',text:'Guild is full.'}); return false; }
      if (data.members.some(m => m.uid === this.user.uid)) { this.emit('notification',{type:'warn',text:'Already in this guild.'}); return false; }
      data.members.push({ uid:this.user.uid, name:this.displayName, rank:'Recruit', joined:Date.now(), lastSeen:Date.now() });
      await gRef.update({ members:data.members, memberCount:data.members.length });
      await invDoc.ref.update({ status:'accepted' });
      game.state.guild = { id:inv.guildId, name:data.name, tag:data.tag, role:'Recruit' };
      await this._logGuildAction(inv.guildId, 'joined_invite', { player: this.displayName, invitedBy: inv.fromName });
      this.emit('notification',{type:'success',text:`Joined guild "${data.name}"!`});
      return true;
    } catch(e) { this.emit('notification',{type:'danger',text:e.message}); return false; }
  }

  async declineGuildInvite(inviteId) {
    if (!this.isOnline) return;
    try { await this.firestore.collection('guild_invites').doc(inviteId).update({ status:'declined' }); } catch(e) {}
  }

  // ── CHAT CHANNELS (RTDB) ───────────────────────────────
  listenToChatChannel(channel, callback) {
    if (!this.isOnline || !this.db) return;
    this.stopChatListener();
    const refPath = channel === 'general' ? 'chat' : `chat_${channel}`;
    this.chatRef = this.db.ref(refPath);
    this.chatListener = this.chatRef.orderByChild('timestamp').limitToLast(100).on('value', (snap) => {
      const msgs = [];
      snap.forEach(child => { msgs.push({ id:child.key, ...child.val() }); });
      callback(msgs);
    });
  }

  async sendChatMessage(text, channel) {
    if (!this.isOnline || !this.user) return;
    text = (text||'').trim();
    if (!text || text.length > 300) return;
    // Rate limit: max 1 message per 1.5 seconds
    const now = Date.now();
    if (this._lastChatSend && now - this._lastChatSend < 1500) {
      this.emit('notification', { type:'warn', text:'Sending too fast, slow down.' }); return;
    }
    this._lastChatSend = now;
    // Sanitize HTML entities to prevent XSS
    text = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const validChannels = ['general','trade','lfg','pvp'];
    const refPath = (!channel || channel === 'general') ? 'chat' : `chat_${channel}`;
    if (channel && channel !== 'general' && !validChannels.includes(channel)) return;
    try {
      const msgData = {
        uid: this.user.uid,
        name: this.displayName || 'Survivor',
        text,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        combatLevel: game ? game.getCombatLevel() : 1,
        totalLevel: game ? game.getTotalLevel() : 25,
      };
      // /me emote
      if (text.startsWith('/me ')) {
        msgData.emote = true;
        msgData.text = text.substring(4);
      }
      // /roll command
      if (text === '/roll' || text.startsWith('/roll ')) {
        const max = parseInt(text.split(' ')[1]) || 100;
        const result = Math.floor(Math.random() * max) + 1;
        msgData.system = true;
        msgData.text = `${this.displayName} rolled ${result} (1-${max})`;
      }
      await this.db.ref(refPath).push(msgData);
    } catch(e) { console.error('Chat error:', e); }
  }

  // ── BLOCK / UNBLOCK PLAYERS ────────────────────────────
  async blockPlayer(uid, name) {
    if (!this.isOnline || !this.user) return;
    try {
      const ref = this.firestore.collection('blocked').doc(this.user.uid);
      const doc = await ref.get();
      const list = doc.exists ? (doc.data().list || []) : [];
      if (list.some(b => b.uid === uid)) { this.emit('notification',{type:'info',text:'Already blocked.'}); return; }
      list.push({ uid, name, at: Date.now() });
      await ref.set({ list });
      this.emit('notification',{type:'info',text:`Blocked ${name}.`});
    } catch(e) { this.emit('notification',{type:'danger',text:e.message}); }
  }

  async unblockPlayer(uid) {
    if (!this.isOnline || !this.user) return;
    try {
      const ref = this.firestore.collection('blocked').doc(this.user.uid);
      const doc = await ref.get();
      if (!doc.exists) return;
      const list = (doc.data().list || []).filter(b => b.uid !== uid);
      await ref.set({ list });
      this.emit('notification',{type:'info',text:'Player unblocked.'});
    } catch(e) { this.emit('notification',{type:'danger',text:e.message}); }
  }

  async getBlockedPlayers() {
    if (!this.isOnline || !this.user) return [];
    try {
      const doc = await this.firestore.collection('blocked').doc(this.user.uid).get();
      return doc.exists ? (doc.data().list || []) : [];
    } catch(e) { return []; }
  }

  // ── DELETE MESSAGE ─────────────────────────────────────
  async deleteMessage(msgId) {
    if (!this.isOnline || !this.user) return;
    try {
      const doc = await this.firestore.collection('messages').doc(msgId).get();
      if (!doc.exists) return;
      const d = doc.data();
      if (d.sender !== this.user.uid && d.recipient !== this.user.uid) return;
      await doc.ref.delete();
      this.emit('notification',{type:'info',text:'Message deleted.'});
    } catch(e) { console.error(e); }
  }

  // ── UNTRADEABLE ITEMS ──────────────────────────────────
  static UNTRADEABLE = ['fire_cape','barrows_gloves','void_crystal','ava_accumulator','mage_cape'];

  isUntradeable(itemId) {
    return OnlineManager.UNTRADEABLE.includes(itemId);
  }

  // ── GIFT / TRADE SYSTEM ────────────────────────────────
  async sendGift(targetUid, targetName, itemId, qty) {
    if (!this.isOnline || !this.user || !game) return false;
    if (this.user.isAnonymous) { this.emit('notification',{type:'warn',text:'Create an account first.'}); return false; }
    if (targetUid === this.user.uid) { this.emit('notification',{type:'warn',text:"Can't gift yourself."}); return false; }
    if (this.isUntradeable(itemId)) { this.emit('notification',{type:'warn',text:`${GAME_DATA.items[itemId]?.name||itemId} is untradeable.`}); return false; }
    if (!GAME_DATA.items[itemId]) { this.emit('notification',{type:'warn',text:'Invalid item.'}); return false; }
    qty = Math.floor(qty);
    if (qty <= 0 || !isFinite(qty) || (game.state.bank[itemId]||0) < qty) { this.emit('notification',{type:'warn',text:'Not enough items.'}); return false; }
    try {
      // Remove from sender bank safely
      if (!game.removeItem(itemId, qty)) { this.emit('notification',{type:'warn',text:'Not enough items.'}); return false; }
      // Create gift in Firestore
      await this.firestore.collection('gifts').add({
        from: this.user.uid, fromName: this.displayName,
        to: targetUid, toName: targetName,
        type: 'item', itemId, qty,
        itemName: GAME_DATA.items[itemId].name,
        claimed: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      // Inbox notification
      await this.firestore.collection('inbox').add({
        to: targetUid, type: 'gift', fromName: this.displayName,
        preview: `${this.displayName} sent you ${qty}x ${GAME_DATA.items[itemId].name}`,
        read: false, timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      this.emit('notification',{type:'success',text:`Sent ${qty}x ${GAME_DATA.items[itemId].name} to ${targetName}!`});
      return true;
    } catch(e) {
      // Refund on failure
      game.state.bank[itemId] = (game.state.bank[itemId]||0) + qty;
      this.emit('notification',{type:'danger',text:'Gift failed: '+e.message});
      return false;
    }
  }

  async sendGoldGift(targetUid, targetName, amount) {
    if (!this.isOnline || !this.user || !game) return false;
    if (this.user.isAnonymous) { this.emit('notification',{type:'warn',text:'Create an account first.'}); return false; }
    if (targetUid === this.user.uid) { this.emit('notification',{type:'warn',text:"Can't gift yourself."}); return false; }
    amount = Math.floor(amount);
    if (amount <= 0 || !isFinite(amount) || game.state.gold < amount) { this.emit('notification',{type:'warn',text:'Not enough gold.'}); return false; }
    try {
      game.state.gold = Math.max(0, game.state.gold - amount);
      await this.firestore.collection('gifts').add({
        from: this.user.uid, fromName: this.displayName,
        to: targetUid, toName: targetName,
        type: 'gold', amount,
        claimed: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      await this.firestore.collection('inbox').add({
        to: targetUid, type: 'gift', fromName: this.displayName,
        preview: `${this.displayName} sent you ${amount} gold`,
        read: false, timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      this.emit('notification',{type:'success',text:`Sent ${amount}g to ${targetName}!`});
      return true;
    } catch(e) {
      game.state.gold += amount;
      this.emit('notification',{type:'danger',text:'Gift failed: '+e.message});
      return false;
    }
  }

  async getPendingGifts() {
    if (!this.isOnline || !this.user) return [];
    try {
      const snap = await this.firestore.collection('gifts')
        .where('to','==',this.user.uid)
        .where('claimed','==',false)
        .limit(50).get();
      const gifts = [];
      snap.forEach(doc => gifts.push({ id:doc.id, ...doc.data() }));
      gifts.sort((a,b) => (b.timestamp?.seconds||0) - (a.timestamp?.seconds||0));
      return gifts;
    } catch(e) { return []; }
  }

  async claimGift(giftId) {
    if (!this.isOnline || !this.user || !game) return false;
    try {
      const doc = await this.firestore.collection('gifts').doc(giftId).get();
      if (!doc.exists) return false;
      const g = doc.data();
      if (g.to !== this.user.uid || g.claimed) return false;
      if (g.type === 'item') {
        game.addItem(g.itemId, g.qty);
        this.emit('notification',{type:'success',text:`Claimed ${g.qty}x ${g.itemName||g.itemId}!`});
      } else if (g.type === 'gold') {
        game.state.gold += g.amount;
        this.emit('notification',{type:'success',text:`Claimed ${(g.amount||0).toLocaleString()}g!`});
      }
      await doc.ref.update({ claimed:true, claimedAt:firebase.firestore.FieldValue.serverTimestamp() });
      // Auto-save so claimed items persist
      game.save();
      this.saveToCloud(true);
      return true;
    } catch(e) { this.emit('notification',{type:'danger',text:e.message}); return false; }
  }

  // ── GUILD ITEM BANK ────────────────────────────────────
  async depositGuildItem(itemId, qty) {
    if (!this.isOnline || !this.user || !game.state.guild) return;
    if (this.isUntradeable(itemId)) { this.emit('notification',{type:'warn',text:'That item is untradeable.'}); return; }
    if (!GAME_DATA.items[itemId]) { this.emit('notification',{type:'warn',text:'Invalid item.'}); return; }
    if (qty <= 0 || (game.state.bank[itemId]||0) < qty) { this.emit('notification',{type:'warn',text:'Not enough items.'}); return; }
    try {
      game.state.bank[itemId] -= qty;
      if (game.state.bank[itemId] <= 0) delete game.state.bank[itemId];
      const ref = this.firestore.collection('guilds').doc(game.state.guild.id);
      const key = `bankItems.${itemId}`;
      await ref.update({ [key]: firebase.firestore.FieldValue.increment(qty) });
      await this._logGuildAction(game.state.guild.id, 'item_deposit', { player:this.displayName, item:GAME_DATA.items[itemId].name, itemId, qty });
      this.emit('notification',{type:'success',text:`Deposited ${qty}x ${GAME_DATA.items[itemId].name} to guild bank.`});
    } catch(e) {
      game.state.bank[itemId] = (game.state.bank[itemId]||0) + qty;
      this.emit('notification',{type:'danger',text:'Deposit failed: '+e.message});
    }
  }

  async withdrawGuildItem(itemId, qty) {
    if (!this.isOnline || !this.user || !game.state.guild) return;
    await this.syncGuildRole();
    const info = await this.getGuildInfo();
    if (!info) return;
    const withdrawRank = info.settings?.withdrawRank || 'General';
    if (this._rankIdx(game.state.guild.role) > this._rankIdx(withdrawRank)) {
      this.emit('notification',{type:'warn',text:`Only ${withdrawRank} and above can withdraw.`}); return;
    }
    const bankQty = (info.bankItems||{})[itemId] || 0;
    if (qty <= 0 || qty > bankQty) { this.emit('notification',{type:'warn',text:`Guild bank only has ${bankQty}x.`}); return; }
    try {
      const ref = this.firestore.collection('guilds').doc(game.state.guild.id);
      const key = `bankItems.${itemId}`;
      await ref.update({ [key]: firebase.firestore.FieldValue.increment(-qty) });
      game.addItem(itemId, qty);
      await this._logGuildAction(game.state.guild.id, 'item_withdraw', { player:this.displayName, item:GAME_DATA.items[itemId]?.name, itemId, qty });
      this.emit('notification',{type:'success',text:`Withdrew ${qty}x ${GAME_DATA.items[itemId]?.name}.`});
    } catch(e) { this.emit('notification',{type:'danger',text:'Withdraw failed: '+e.message}); }
  }

  async getGuildBankItems() {
    if (!this.isOnline || !game.state.guild) return {};
    try {
      const doc = await this.firestore.collection('guilds').doc(game.state.guild.id).get();
      return doc.exists ? (doc.data().bankItems || {}) : {};
    } catch(e) { return {}; }
  }

  // ── ADMIN: REMOTE PLAYER MODIFICATION ──────────────────
  async adminGetPlayerSave(uid) {
    if (!this.isOnline || typeof isAdmin !== 'function' || !isAdmin()) return null;
    try {
      const doc = await this.firestore.collection('saves').doc(uid).get();
      return doc.exists ? doc.data().save : null;
    } catch(e) { return null; }
  }

  async adminSetPlayerSave(uid, save) {
    if (!this.isOnline || typeof isAdmin !== 'function' || !isAdmin()) return false;
    try {
      save._cloudSaveTime = Date.now();
      save.lastSave = Date.now();
      await this.firestore.collection('saves').doc(uid).set({
        save, uid, lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      await this.adminLog('remote_save_edit', { targetUid: uid });
      return true;
    } catch(e) { this.emit('notification',{type:'danger',text:e.message}); return false; }
  }

  async adminGivePlayerGold(uid, amount) {
    if (!this.isOnline || typeof isAdmin !== 'function' || !isAdmin()) return false;
    try {
      const save = await this.adminGetPlayerSave(uid);
      if (!save) { this.emit('notification',{type:'warn',text:'Save not found.'}); return false; }
      save.gold = (save.gold || 0) + amount;
      const ok = await this.adminSetPlayerSave(uid, save);
      if (ok) {
        this.emit('notification',{type:'success',text:`Gave ${amount}g to ${uid.substring(0,8)}...`});
        await this.adminLog('give_gold_remote', { targetUid: uid, amount });
      }
      return ok;
    } catch(e) { this.emit('notification',{type:'danger',text:e.message}); return false; }
  }

  async adminGivePlayerItem(uid, itemId, qty) {
    if (!this.isOnline || typeof isAdmin !== 'function' || !isAdmin()) return false;
    try {
      const save = await this.adminGetPlayerSave(uid);
      if (!save) { this.emit('notification',{type:'warn',text:'Save not found.'}); return false; }
      if (!save.bank) save.bank = {};
      save.bank[itemId] = (save.bank[itemId] || 0) + qty;
      const ok = await this.adminSetPlayerSave(uid, save);
      if (ok) {
        this.emit('notification',{type:'success',text:`Gave ${qty}x ${GAME_DATA.items[itemId]?.name||itemId} to ${uid.substring(0,8)}...`});
        await this.adminLog('give_item_remote', { targetUid: uid, itemId, qty });
      }
      return ok;
    } catch(e) { this.emit('notification',{type:'danger',text:e.message}); return false; }
  }

  async adminGivePlayerXp(uid, skill, amount) {
    if (!this.isOnline || typeof isAdmin !== 'function' || !isAdmin()) return false;
    try {
      const save = await this.adminGetPlayerSave(uid);
      if (!save || !save.skills?.[skill]) { this.emit('notification',{type:'warn',text:'Save/skill not found.'}); return false; }
      save.skills[skill].xp = (save.skills[skill].xp || 0) + amount;
      // Recalc level
      const xpTable = [0,83,174,276,388,512,650,801,969,1154,1358,1584,1833,2107,2411,2746,3115,3523,3973,4470,5018,5624,6291,7028,7842,8740,9730,10824,12031,13363,14833,16456,18247,20224,22406,24815,27473,30408,33648,37224,41171,45529,50339,55649,61512,67983,75127,83014,91721,101333,111945,123660,136594,150872,166636,184040,203254,224466,247886,273742,302288,333804,368599,407015,449428,496254,547953,605032,668051,737627,814445,899257,992895,1096278,1210421,1336443,1475581,1629200,1798808,1986068,2192818,2421087,2673114,2951373,3258594,3597792,3972294,4385776,4842295,5346332,5902831,6517253,7195629,7944614,8771558,9684577,10692629,11805606,13034431];
      const newXp = save.skills[skill].xp;
      let lv = 1;
      for (let i = 1; i < xpTable.length; i++) { if (newXp >= xpTable[i]) lv = i + 1; else break; }
      save.skills[skill].level = Math.min(99, lv);
      const ok = await this.adminSetPlayerSave(uid, save);
      if (ok) {
        this.emit('notification',{type:'success',text:`Gave ${amount} ${skill} XP to ${uid.substring(0,8)}...`});
        await this.adminLog('give_xp_remote', { targetUid: uid, skill, amount });
      }
      return ok;
    } catch(e) { this.emit('notification',{type:'danger',text:e.message}); return false; }
  }

  // ── FULL ADMIN PLAYER CONTROL ─────────────────────────────────
  async adminSetPlayerLevel(uid, skill, level) {
    if (!this.isOnline || typeof isAdmin !== 'function' || !isAdmin()) return false;
    try {
      const save = await this.adminGetPlayerSave(uid);
      if (!save || !save.skills?.[skill]) { this.emit('notification',{type:'warn',text:'Save/skill not found.'}); return false; }
      const xpTable = [0,83,174,276,388,512,650,801,969,1154,1358,1584,1833,2107,2411,2746,3115,3523,3973,4470,5018,5624,6291,7028,7842,8740,9730,10824,12031,13363,14833,16456,18247,20224,22406,24815,27473,30408,33648,37224,41171,45529,50339,55649,61512,67983,75127,83014,91721,101333,111945,123660,136594,150872,166636,184040,203254,224466,247886,273742,302288,333804,368599,407015,449428,496254,547953,605032,668051,737627,814445,899257,992895,1096278,1210421,1336443,1475581,1629200,1798808,1986068,2192818,2421087,2673114,2951373,3258594,3597792,3972294,4385776,4842295,5346332,5902831,6517253,7195629,7944614,8771558,9684577,10692629,11805606,13034431];
      level = Math.max(1, Math.min(99, level));
      save.skills[skill].level = level;
      save.skills[skill].xp = xpTable[level - 1] || 0;
      const ok = await this.adminSetPlayerSave(uid, save);
      if (ok) { this.emit('notification',{type:'success',text:`Set ${skill} to level ${level}`}); await this.adminLog('set_level_remote', { targetUid:uid, skill, level }); }
      return ok;
    } catch(e) { this.emit('notification',{type:'danger',text:e.message}); return false; }
  }

  async adminSetPlayerGold(uid, amount) {
    if (!this.isOnline || typeof isAdmin !== 'function' || !isAdmin()) return false;
    try {
      const save = await this.adminGetPlayerSave(uid);
      if (!save) { this.emit('notification',{type:'warn',text:'Save not found.'}); return false; }
      save.gold = Math.max(0, amount);
      const ok = await this.adminSetPlayerSave(uid, save);
      if (ok) { this.emit('notification',{type:'success',text:`Set gold to ${amount}`}); await this.adminLog('set_gold_remote', { targetUid:uid, amount }); }
      return ok;
    } catch(e) { this.emit('notification',{type:'danger',text:e.message}); return false; }
  }

  async adminRemovePlayerItem(uid, itemId, qty) {
    if (!this.isOnline || typeof isAdmin !== 'function' || !isAdmin()) return false;
    try {
      const save = await this.adminGetPlayerSave(uid);
      if (!save) { this.emit('notification',{type:'warn',text:'Save not found.'}); return false; }
      if (!save.bank) save.bank = {};
      save.bank[itemId] = Math.max(0, (save.bank[itemId] || 0) - qty);
      if (save.bank[itemId] <= 0) delete save.bank[itemId];
      const ok = await this.adminSetPlayerSave(uid, save);
      if (ok) { this.emit('notification',{type:'success',text:`Removed ${qty}x ${GAME_DATA.items[itemId]?.name||itemId}`}); await this.adminLog('remove_item_remote', { targetUid:uid, itemId, qty }); }
      return ok;
    } catch(e) { this.emit('notification',{type:'danger',text:e.message}); return false; }
  }

  async adminSetPlayerStat(uid, path, value) {
    if (!this.isOnline || typeof isAdmin !== 'function' || !isAdmin()) return false;
    try {
      const save = await this.adminGetPlayerSave(uid);
      if (!save) { this.emit('notification',{type:'warn',text:'Save not found.'}); return false; }
      // Navigate to path and set value: e.g. "stats.monstersKilled" => save.stats.monstersKilled = value
      const parts = path.split('.');
      let obj = save;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!obj[parts[i]]) obj[parts[i]] = {};
        obj = obj[parts[i]];
      }
      obj[parts[parts.length - 1]] = value;
      const ok = await this.adminSetPlayerSave(uid, save);
      if (ok) { this.emit('notification',{type:'success',text:`Set ${path} = ${JSON.stringify(value)}`}); await this.adminLog('set_stat_remote', { targetUid:uid, path, value }); }
      return ok;
    } catch(e) { this.emit('notification',{type:'danger',text:e.message}); return false; }
  }

  async adminResetPlayerSkills(uid) {
    if (!this.isOnline || typeof isAdmin !== 'function' || !isAdmin()) return false;
    try {
      const save = await this.adminGetPlayerSave(uid);
      if (!save || !save.skills) { this.emit('notification',{type:'warn',text:'Save not found.'}); return false; }
      for (const sk of Object.keys(save.skills)) { save.skills[sk].level = 1; save.skills[sk].xp = 0; }
      const ok = await this.adminSetPlayerSave(uid, save);
      if (ok) { this.emit('notification',{type:'success',text:'All skills reset to 1'}); await this.adminLog('reset_skills_remote', { targetUid:uid }); }
      return ok;
    } catch(e) { this.emit('notification',{type:'danger',text:e.message}); return false; }
  }

  async adminClearPlayerBank(uid) {
    if (!this.isOnline || typeof isAdmin !== 'function' || !isAdmin()) return false;
    try {
      const save = await this.adminGetPlayerSave(uid);
      if (!save) return false;
      save.bank = {};
      const ok = await this.adminSetPlayerSave(uid, save);
      if (ok) { this.emit('notification',{type:'success',text:'Bank cleared'}); await this.adminLog('clear_bank_remote', { targetUid:uid }); }
      return ok;
    } catch(e) { this.emit('notification',{type:'danger',text:e.message}); return false; }
  }

  async adminSetPlayerEquipment(uid, slot, itemId) {
    if (!this.isOnline || typeof isAdmin !== 'function' || !isAdmin()) return false;
    try {
      const save = await this.adminGetPlayerSave(uid);
      if (!save) return false;
      if (!save.equipment) save.equipment = {};
      if (itemId) { save.equipment[slot] = itemId; } else { delete save.equipment[slot]; }
      const ok = await this.adminSetPlayerSave(uid, save);
      if (ok) { this.emit('notification',{type:'success',text:`Set ${slot} = ${itemId||'empty'}`}); await this.adminLog('set_equip_remote', { targetUid:uid, slot, itemId }); }
      return ok;
    } catch(e) { this.emit('notification',{type:'danger',text:e.message}); return false; }
  }

  async adminMaxPlayerSkills(uid) {
    if (!this.isOnline || typeof isAdmin !== 'function' || !isAdmin()) return false;
    try {
      const save = await this.adminGetPlayerSave(uid);
      if (!save || !save.skills) return false;
      for (const sk of Object.keys(save.skills)) { save.skills[sk].level = 99; save.skills[sk].xp = 13034431; }
      const ok = await this.adminSetPlayerSave(uid, save);
      if (ok) { this.emit('notification',{type:'success',text:'All skills maxed to 99'}); await this.adminLog('max_skills_remote', { targetUid:uid }); }
      return ok;
    } catch(e) { this.emit('notification',{type:'danger',text:e.message}); return false; }
  }

  // ── ADMIN: PUSH LIVE GAME SETTINGS ─────────────────────
  // These are read by clients on init and polled periodically
  async pushLiveUpdate(key, value) {
    if (!this.isOnline || typeof isAdmin !== 'function' || !isAdmin()) return false;
    try {
      await this.db.ref(`/game_settings/${key}`).set(value);
      await this.db.ref('/game_settings/_lastUpdate').set(Date.now());
      await this.adminLog('push_live_update', { key, value });
      this.emit('notification',{type:'success',text:`Live update pushed: ${key}`});
      return true;
    } catch(e) { return false; }
  }

  // Search for players by partial name
  async searchPlayers(query) {
    if (!this.isOnline || !query || query.length < 2) return [];
    try {
      const snap = await this.firestore.collection('players').limit(200).get();
      const results = [];
      const q = query.toLowerCase();
      snap.forEach(doc => {
        const d = doc.data();
        if (d.displayName?.toLowerCase().includes(q)) {
          results.push({ uid:doc.id, name:d.displayName, combatLevel:d.combatLevel||1, totalLevel:d.totalLevel||1 });
        }
      });
      return results.slice(0, 20);
    } catch(e) { return []; }
  }

  // ── FRIENDS ────────────────────────────────────────────
  async sendFriendRequest(targetName) {
    if (!this.isOnline || !this.user) { this.emit('notification',{type:'warn',text:'Not connected.'}); return; }
    if (this.user.isAnonymous) { this.emit('notification',{type:'warn',text:'Create an account first to add friends.'}); return; }
    if (!targetName || targetName.trim().length < 1) { this.emit('notification',{type:'warn',text:'Enter a player name.'}); return; }
    try {
      // Find target player
      const results = await this.searchPlayers(targetName.trim());
      const exact = results.find(r => r.name.toLowerCase() === targetName.trim().toLowerCase()) || results[0];
      if (!exact) { this.emit('notification',{type:'warn',text:`Player "${targetName}" not found.`}); return; }
      const targetUid = exact.uid;
      if (targetUid === this.user.uid) { this.emit('notification',{type:'warn',text:"Can't add yourself."}); return; }
      // Check not already friends
      const myFriends = await this.getFriends();
      if (myFriends.some(f => f.uid === targetUid)) { this.emit('notification',{type:'warn',text:'Already friends.'}); return; }
      // Write to flat collection: /friend_requests/{autoId}
      await this.firestore.collection('friend_requests').add({
        from: this.user.uid,
        fromName: this.displayName,
        to: targetUid,
        toName: exact.name,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        status: 'pending',
      });
      this.emit('notification',{type:'success',text:`Friend request sent to ${exact.name}!`});
    } catch(e) {
      console.error('Friend request error:', e);
      this.emit('notification',{type:'danger',text:'Friend request failed: ' + e.message});
    }
  }

  async getFriendRequests() {
    if (!this.isOnline || !this.user) return [];
    try {
      // Read from flat collection where to == my uid
      const snap = await this.firestore.collection('friend_requests')
        .where('to','==',this.user.uid)
        .where('status','==','pending')
        .limit(20).get();
      const requests = [];
      snap.forEach(doc => requests.push({ id:doc.id, ...doc.data() }));
      return requests;
    } catch(e) { console.error('Get friend requests error:', e); return []; }
  }

  async acceptFriendRequest(requestId, fromUid, fromName) {
    if (!this.isOnline || !this.user) return;
    try {
      // Add to my friends list
      const myRef = this.firestore.collection('friends').doc(this.user.uid);
      const myDoc = await myRef.get();
      const myFriends = myDoc.exists ? (myDoc.data().list || []) : [];
      if (!myFriends.some(f => f.uid === fromUid)) {
        myFriends.push({ uid:fromUid, name:fromName, since:Date.now() });
        await myRef.set({ list:myFriends });
      }
      // Add me to their friends list
      const theirRef = this.firestore.collection('friends').doc(fromUid);
      const theirDoc = await theirRef.get();
      const theirFriends = theirDoc.exists ? (theirDoc.data().list || []) : [];
      if (!theirFriends.some(f => f.uid === this.user.uid)) {
        theirFriends.push({ uid:this.user.uid, name:this.displayName, since:Date.now() });
        await theirRef.set({ list:theirFriends });
      }
      // Mark request as accepted
      await this.firestore.collection('friend_requests').doc(requestId).update({ status:'accepted' });
      this.emit('notification',{type:'success',text:`${fromName} added as friend!`});
    } catch(e) { this.emit('notification',{type:'danger',text:'Accept failed: '+e.message}); }
  }

  async rejectFriendRequest(requestId) {
    if (!this.isOnline || !this.user) return;
    try {
      await this.firestore.collection('friend_requests').doc(requestId).update({ status:'rejected' });
      this.emit('notification',{type:'info',text:'Friend request rejected.'});
    } catch(e) { console.error(e); }
  }

  async removeFriend(friendUid) {
    if (!this.isOnline || !this.user) return;
    try {
      // Remove from my list
      const myRef = this.firestore.collection('friends').doc(this.user.uid);
      const myDoc = await myRef.get();
      if (myDoc.exists) {
        const list = (myDoc.data().list||[]).filter(f => f.uid !== friendUid);
        await myRef.set({ list });
      }
      // Remove me from their list
      const theirRef = this.firestore.collection('friends').doc(friendUid);
      const theirDoc = await theirRef.get();
      if (theirDoc.exists) {
        const list = (theirDoc.data().list||[]).filter(f => f.uid !== this.user.uid);
        await theirRef.set({ list });
      }
      this.emit('notification',{type:'info',text:'Friend removed.'});
    } catch(e) { console.error(e); }
  }

  async getFriends() {
    if (!this.isOnline || !this.user) return [];
    try {
      const doc = await this.firestore.collection('friends').doc(this.user.uid).get();
      return doc.exists ? (doc.data().list || []) : [];
    } catch(e) { return []; }
  }

  // ── PRIVATE MESSAGES ───────────────────────────────────
  _getConvoId(uid1, uid2) {
    return [uid1, uid2].sort().join('_');
  }

  async sendPrivateMessage(targetUid, targetName, text) {
    if (!this.isOnline || !this.user || !text.trim()) { this.emit('notification',{type:'warn',text:'Cannot send empty message.'}); return; }
    if (this.user.isAnonymous) { this.emit('notification',{type:'warn',text:'Create an account to send messages.'}); return; }
    const convoId = this._getConvoId(this.user.uid, targetUid);
    try {
      // Write message to flat /messages collection
      await this.firestore.collection('messages').add({
        convoId,
        sender: this.user.uid,
        senderName: this.displayName,
        recipient: targetUid,
        recipientName: targetName,
        text: text.trim().substring(0, 500),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        read: false,
      });
      this.emit('notification',{type:'info',text:`Message sent to ${targetName}.`});
    } catch(e) { this.emit('notification',{type:'danger',text:'Message failed: '+e.message}); }
  }

  async getConversation(targetUid) {
    if (!this.isOnline || !this.user) return [];
    const convoId = this._getConvoId(this.user.uid, targetUid);
    try {
      const snap = await this.firestore.collection('messages')
        .where('convoId','==',convoId).limit(100).get();
      const msgs = [];
      snap.forEach(doc => msgs.push({ id:doc.id, ...doc.data() }));
      msgs.sort((a,b) => (a.timestamp?.seconds||0) - (b.timestamp?.seconds||0));
      return msgs;
    } catch(e) { console.error('Conversation error:', e); return []; }
  }

  async getConversationList() {
    if (!this.isOnline || !this.user) return [];
    try {
      // Get recent messages involving me
      const snap = await this.firestore.collection('messages')
        .where('sender','==',this.user.uid).limit(50).get();
      const snap2 = await this.firestore.collection('messages')
        .where('recipient','==',this.user.uid).limit(50).get();
      // Group by convoId
      const convos = {};
      const process = (doc) => {
        const d = doc.data();
        if (!convos[d.convoId] || (d.timestamp?.seconds||0) > (convos[d.convoId].timestamp?.seconds||0)) {
          const otherUid = d.sender === this.user.uid ? d.recipient : d.sender;
          const otherName = d.sender === this.user.uid ? d.recipientName : d.senderName;
          convos[d.convoId] = { id:d.convoId, otherUid, otherName, lastMessage:d.text, timestamp:d.timestamp, participants:[d.sender,d.recipient] };
        }
      };
      snap.forEach(process);
      snap2.forEach(process);
      return Object.values(convos).sort((a,b) => (b.timestamp?.seconds||0) - (a.timestamp?.seconds||0));
    } catch(e) { console.error('Conversations error:', e); return []; }
  }

  // ── INBOX / NOTIFICATIONS ──────────────────────────────
  async getInbox() {
    if (!this.isOnline || !this.user) return [];
    try {
      const snap = await this.firestore.collection('inbox')
        .where('to','==',this.user.uid).limit(50).get();
      const items = [];
      snap.forEach(doc => items.push({ id:doc.id, ...doc.data() }));
      items.sort((a,b) => (b.timestamp?.seconds||0) - (a.timestamp?.seconds||0));
      return items;
    } catch(e) { console.error('Inbox error:', e); return []; }
  }

  async getUnreadCount() {
    if (!this.isOnline || !this.user) return 0;
    try {
      const snap = await this.firestore.collection('inbox')
        .where('to','==',this.user.uid)
        .where('read','==',false).limit(50).get();
      return snap.size;
    } catch(e) { return 0; }
  }

  async markInboxRead(itemId) {
    if (!this.isOnline || !this.user) return;
    try {
      await this.firestore.collection('inbox').doc(itemId).update({ read:true });
    } catch(e) { console.error(e); }
  }

  async clearInbox() {
    if (!this.isOnline || !this.user) return;
    try {
      const snap = await this.firestore.collection('inbox')
        .where('to','==',this.user.uid).limit(50).get();
      const batch = this.firestore.batch();
      snap.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
    } catch(e) { console.error(e); }
  }

  // Start listening for real-time inbox updates
  startInboxListener() {
    if (!this.isOnline || !this.user || this._inboxUnsub) return;
    this._inboxUnsub = this.firestore.collection('inbox')
      .where('to','==',this.user.uid)
      .where('read','==',false)
      .onSnapshot(snap => {
        const count = snap.size;
        this.emit('inboxUpdate', { unreadCount:count });
        snap.docChanges().forEach(change => {
          if (change.type === 'added') {
            const d = change.doc.data();
            if (d.type === 'message') {
              this.emit('notification',{type:'info',text:`Message from ${d.fromName}: ${d.preview}`});
            } else if (d.type === 'friend_request') {
              this.emit('notification',{type:'info',text:`Friend request from ${d.fromName}`});
            } else if (d.type === 'gift') {
              this.emit('notification',{type:'success',text:`🎁 ${d.fromName} sent you a gift! Check your Inbox → Gifts tab to claim.`});
              // Auto-navigate to inbox if on another page
              if (window.ui && window.ui.currentPage !== 'inbox') {
                // Just notify, don't force navigate
              }
            } else if (d.type === 'party_invite') {
              this.emit('notification',{type:'info',text:`⚔️ ${d.fromName} invited you to party "${d.partyName||''}". Check your Inbox!`});
            }
          }
        });
      }, err => { console.error('Inbox listener error:', err); });
  }

  // ── PARTY REAL-TIME ─────────────────────────────────────────
  // Real-time Firestore listener on party doc
  startPartyListener(partyId, callback) {
    this.stopPartyListener();
    if (!this.isOnline || !this.firestore || !partyId) return;
    this._partyUnsub = this.firestore.collection('parties').doc(partyId)
      .onSnapshot(snap => {
        if (snap.exists) callback(snap.data());
      }, err => { console.error('[Party] Listener error:', err); });
  }
  stopPartyListener() {
    if (this._partyUnsub) { this._partyUnsub(); this._partyUnsub = null; }
  }

  // Real-time RTDB listener for party chat
  startPartyChatListener(partyId, callback) {
    this.stopPartyChatListener();
    if (!this.isOnline || !this.db || !partyId) return;
    this._partyChatRef = this.db.ref(`party_chat/${partyId}`);
    this._partyChatListener = this._partyChatRef.orderByChild('timestamp').limitToLast(50).on('value', snap => {
      const msgs = [];
      snap.forEach(child => { msgs.push({ id:child.key, ...child.val() }); });
      callback(msgs);
    });
  }
  stopPartyChatListener() {
    if (this._partyChatRef && this._partyChatListener) {
      this._partyChatRef.off('value', this._partyChatListener);
      this._partyChatRef = null; this._partyChatListener = null;
    }
  }

  // Send party chat via RTDB
  async sendPartyChat(partyId, text) {
    if (!this.isOnline || !this.db || !this.user || !partyId) return;
    text = (text||'').trim();
    if (!text || text.length > 300) return;
    try {
      await this.db.ref(`party_chat/${partyId}`).push({
        uid: this.user.uid,
        name: this.displayName || 'Survivor',
        text,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      });
    } catch(e) { console.error('[Party] Chat send failed:', e); }
  }

  // Sync party state to Firestore
  async syncPartyState(partyId, data) {
    if (!this.isOnline || !this.firestore || !partyId) return;
    try {
      await this.firestore.collection('parties').doc(partyId).set(data, {merge:true});
    } catch(e) { console.error('[Party] State sync failed:', e); }
  }

  // Search players with partial match + online status
  async searchPlayersForParty(query) {
    if (!this.isOnline || !query || query.length < 2) return [];
    try {
      const snap = await this.firestore.collection('players').limit(200).get();
      const results = [];
      const q = query.toLowerCase();
      // Try to get presence data, but don't fail if it errors
      let presenceData = {};
      try {
        const presenceSnap = await this.db.ref('presence').once('value');
        presenceData = presenceSnap.val() || {};
      } catch(e) { console.warn('[Party] Presence query failed, showing without online status'); }
      snap.forEach(doc => {
        const d = doc.data();
        if (d.displayName?.toLowerCase().includes(q) && doc.id !== this.user?.uid) {
          const pres = presenceData[doc.id];
          const isOnline = pres && pres.online && (Date.now() - (pres.lastSeen||0)) < 300000;
          results.push({
            uid: doc.id,
            name: d.displayName,
            combatLevel: d.combatLevel || 1,
            totalLevel: d.totalLevel || 1,
            online: isOnline,
            zone: pres?.zone || null,
            lastSeen: pres?.lastSeen || null,
          });
        }
      });
      // Sort: online first, then by combat level
      results.sort((a,b) => (b.online?1:0) - (a.online?1:0) || b.combatLevel - a.combatLevel);
      return results.slice(0, 20);
    } catch(e) { console.error('[Party] Search failed:', e); return []; }
  }

  // Find open parties from Firestore
  async findOpenParties() {
    if (!this.isOnline || !this.firestore) return [];
    try {
      const snap = await this.firestore.collection('parties').where('status','==','open').limit(20).get();
      const groups = [];
      snap.forEach(doc => {
        const d = doc.data();
        groups.push({ id:doc.id, name:d.name, leader:d.leaderName, members:d.members?.length||1, raidTarget:d.raidTarget, maxSize:4 });
      });
      return groups;
    } catch(e) { return []; }
  }

  // ── EVENTS ─────────────────────────────────────────────
  on(event, fn) { if (!this.listeners[event]) this.listeners[event] = []; this.listeners[event].push(fn); }
  emit(event, data) { if (this.listeners[event]) for (const fn of this.listeners[event]) fn(data); }
}

const online = new OnlineManager();
