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
    if (!FIREBASE_ENABLED) {
      console.log('Firebase not configured. Online features disabled.');
      this.emit('status', { online:false, reason:'Firebase not configured. See js/firebase-config.js for setup instructions.' });
      return;
    }
    try {
      firebase.initializeApp(FIREBASE_CONFIG);
      this.auth = firebase.auth();
      this.db = firebase.database();
      this.firestore = firebase.firestore();
      this.isOnline = true;

      this.auth.onAuthStateChanged(async (user) => {
        this.user = user;
        if (user) {
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
          // Start real-time listeners
          if (!user.isAnonymous) {
            this.startInboxListener();
            this.startFriendRequestListener();
          }
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
      this.emit('notification', { type:'danger', text:e.message });
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
      this.emit('notification', { type:'danger', text:e.message });
      return false;
    }
  }

  async signInWithGoogle() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      if (this.user && this.user.isAnonymous) {
        // Link anonymous account to Google
        await this.user.linkWithPopup(provider);
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
        } catch(e2) { this.emit('notification',{type:'danger',text:e2.message}); return false; }
      }
      if (e.code === 'auth/popup-closed-by-user') {
        this.emit('notification', { type:'info', text:'Google sign-in cancelled.' });
        return false;
      }
      console.error('Google sign-in error:', e);
      this.emit('notification', { type:'danger', text:'Google sign-in failed: ' + e.message });
      return false;
    }
  }

  async signOut() {
    try { await this.auth.signOut(); } catch(e) { console.error(e); }
  }

  async setDisplayName(name) {
    this.displayName = name;
    localStorage.setItem('ashfall_displayName', name);
    if (this.user && !this.user.isAnonymous) {
      try { await this.user.updateProfile({ displayName: name }); } catch(e) {}
    }
    this.syncProfile();
  }

  // ── CHAT ───────────────────────────────────────────────
  listenToChat(callback) {
    if (!this.isOnline || !this.db) return;
    this.chatRef = this.db.ref('chat');
    this.chatListener = this.chatRef.orderByChild('timestamp').limitToLast(100).on('value', (snap) => {
      const msgs = [];
      snap.forEach(child => { msgs.push({ id:child.key, ...child.val() }); });
      callback(msgs);
    });
  }

  stopChatListener() {
    if (this.chatRef && this.chatListener) {
      this.chatRef.off('value', this.chatListener);
      this.chatListener = null;
    }
  }

  async sendMessage(text) {
    if (!this.isOnline || !this.user) return;
    text = text.trim();
    if (text.length === 0 || text.length > 300) return;
    try {
      await this.db.ref('chat').push({
        uid: this.user.uid,
        name: this.displayName || 'Survivor',
        text,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        combatLevel: game ? game.getCombatLevel() : 1,
        totalLevel: game ? game.getTotalLevel() : 25,
      });
    } catch(e) { console.error('Chat error:', e); }
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
    try {
      const s = game.state;
      const skillLevels = {};
      const skillXp = {};
      let totalXp = 0;
      for (const [id, sk] of Object.entries(s.skills)) {
        skillLevels[id] = sk.level;
        skillXp[id] = sk.xp;
        totalXp += sk.xp;
      }
      await this.firestore.collection('players').doc(this.user.uid).set({
        displayName: this.displayName,
        uid: this.user.uid,
        combatLevel: game.getCombatLevel(),
        totalLevel: game.getTotalLevel(),
        totalXp: totalXp,
        pvpRating: this.pvpRating,
        alignment: s.alignment,
        kills: s.stats.monstersKilled || 0,
        gold: s.gold,
        goldEarned: s.stats.goldEarned || 0,
        questsCompleted: s.quests?.completed?.length || 0,
        dungeonClears: s.stats.dungeonsCompleted || 0,
        playTime: Math.floor(s.stats.totalPlayTime || 0),
        skills: skillLevels,
        skillsXp: skillXp,
        pvpWins: s.stats.pvpWins || 0,
        pvpLosses: s.stats.pvpLosses || 0,
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
  async placeBounty(targetName, amount) {
    if (!this.isOnline || !this.user || !game) return;
    if (game.state.gold < amount || amount < 100) {
      this.emit('notification', { type:'warn', text:'Minimum bounty is 100 gold.' }); return;
    }
    game.state.gold -= amount;
    game.state.stats.goldSpent += amount;
    try {
      await this.firestore.collection('bounties').add({
        placedBy: this.user.uid,
        placedByName: this.displayName,
        targetName,
        amount,
        claimed: false,
        claimedBy: null,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        expiresAt: new Date(Date.now() + 86400000), // 24 hours
      });
      this.emit('notification', { type:'success', text:`Bounty of ${amount} gold placed on ${targetName}!` });
    } catch(e) {
      game.state.gold += amount; // refund
      this.emit('notification', { type:'danger', text:'Bounty error: ' + e.message });
    }
  }

  async getActiveBounties() {
    if (!this.isOnline) return [];
    try {
      const snap = await this.firestore.collection('bounties')
        .where('claimed', '==', false)
        .orderBy('amount', 'desc')
        .limit(20)
        .get();
      const bounties = [];
      snap.forEach(doc => bounties.push({ id:doc.id, ...doc.data() }));
      return bounties;
    } catch(e) { return []; }
  }

  async claimBounty(bountyId) {
    if (!this.isOnline || !this.user || !game) return;
    try {
      const doc = await this.firestore.collection('bounties').doc(bountyId).get();
      if (!doc.exists || doc.data().claimed) {
        this.emit('notification', { type:'warn', text:'Bounty already claimed.' }); return;
      }
      const bounty = doc.data();
      await this.firestore.collection('bounties').doc(bountyId).update({
        claimed: true,
        claimedBy: this.user.uid,
        claimedByName: this.displayName,
      });
      game.state.gold += bounty.amount;
      game.state.stats.goldEarned += bounty.amount;
      this.emit('notification', { type:'achievement', text:`Claimed bounty on ${bounty.targetName} for ${bounty.amount} gold!` });
    } catch(e) { console.error('Claim bounty error:', e); }
  }

  // ── GUILDS ─────────────────────────────────────────────
  async createGuild(name, tag) {
    if (!this.isOnline || !this.user) return false;
    try {
      const ref = await this.firestore.collection('guilds').add({
        name, tag, leader: this.user.uid, leaderName: this.displayName,
        members: [{ uid:this.user.uid, name:this.displayName, rank:'Leader', joined:Date.now() }],
        ranks: ['Leader','General','Captain','Lieutenant','Sergeant','Member','Recruit'],
        created: firebase.firestore.FieldValue.serverTimestamp(),
        memberCount: 1, bank: 0,
      });
      game.state.guild = { id:ref.id, name, tag, role:'Leader' };
      this.emit('notification',{type:'success',text:`Guild "${name}" [${tag}] created!`});
      return true;
    } catch(e) { this.emit('notification',{type:'danger',text:'Guild error: '+e.message}); return false; }
  }

  async joinGuild(guildName) {
    if (!this.isOnline || !this.user) return false;
    try {
      const snap = await this.firestore.collection('guilds').where('name','==',guildName).limit(1).get();
      if (snap.empty) { this.emit('notification',{type:'warn',text:'Guild not found.'}); return false; }
      const doc = snap.docs[0];
      const data = doc.data();
      if (data.members.length >= 50) { this.emit('notification',{type:'warn',text:'Guild is full (50 max).'}); return false; }
      if (data.members.some(m => m.uid === this.user.uid)) { this.emit('notification',{type:'warn',text:'Already in this guild.'}); return false; }
      data.members.push({ uid:this.user.uid, name:this.displayName, rank:'Recruit', joined:Date.now() });
      await doc.ref.update({ members:data.members, memberCount:data.members.length });
      game.state.guild = { id:doc.id, name:data.name, tag:data.tag, role:'Recruit' };
      this.emit('notification',{type:'success',text:`Joined guild "${data.name}"!`});
      return true;
    } catch(e) { this.emit('notification',{type:'danger',text:'Join error: '+e.message}); return false; }
  }

  async leaveGuild() {
    if (!this.isOnline || !this.user || !game.state.guild) return;
    try {
      const ref = this.firestore.collection('guilds').doc(game.state.guild.id);
      const doc = await ref.get();
      if (doc.exists) {
        const data = doc.data();
        data.members = data.members.filter(m => m.uid !== this.user.uid);
        if (data.members.length === 0) { await ref.delete(); }
        else { await ref.update({ members:data.members, memberCount:data.members.length }); }
      }
      const guildName = game.state.guild.name;
      game.state.guild = null;
      this.emit('notification',{type:'info',text:`Left guild "${guildName}".`});
    } catch(e) { console.error('Leave guild error:', e); }
  }

  async kickMember(memberUid) {
    if (!this.isOnline || !this.user || !game.state.guild) return;
    const myRank = game.state.guild.role;
    const rankOrder = ['Leader','General','Captain','Lieutenant','Sergeant','Member','Recruit'];
    const myIdx = rankOrder.indexOf(myRank);
    if (myIdx > 2) { this.emit('notification',{type:'warn',text:'Only Leader, General, or Captain can kick members.'}); return; }
    try {
      const ref = this.firestore.collection('guilds').doc(game.state.guild.id);
      const doc = await ref.get();
      if (!doc.exists) return;
      const data = doc.data();
      const member = data.members.find(m => m.uid === memberUid);
      if (!member) { this.emit('notification',{type:'warn',text:'Member not found.'}); return; }
      const theirIdx = rankOrder.indexOf(member.rank || 'Recruit');
      if (theirIdx <= myIdx) { this.emit('notification',{type:'warn',text:'Cannot kick someone of equal or higher rank.'}); return; }
      data.members = data.members.filter(m => m.uid !== memberUid);
      await ref.update({ members:data.members, memberCount:data.members.length });
      this.emit('notification',{type:'success',text:`Kicked ${member.name} from the guild.`});
    } catch(e) { this.emit('notification',{type:'danger',text:'Kick failed: '+e.message}); }
  }

  async getGuildMembers() {
    if (!this.isOnline || !this.user || !game.state.guild) return [];
    try {
      const doc = await this.firestore.collection('guilds').doc(game.state.guild.id).get();
      return doc.exists ? (doc.data().members || []) : [];
    } catch(e) { return []; }
  }

  async depositGuildGold(amount) {
    if (!this.isOnline || !this.user || !game.state.guild) return;
    if (amount <= 0 || game.state.gold < amount) { this.emit('notification',{type:'warn',text:'Not enough gold.'}); return; }
    try {
      game.state.gold -= amount;
      const ref = this.firestore.collection('guilds').doc(game.state.guild.id);
      await ref.update({ bank: firebase.firestore.FieldValue.increment(amount) });
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
    const myRank = game.state.guild.role;
    if (myRank !== 'Leader' && myRank !== 'General') { this.emit('notification',{type:'warn',text:'Only Leader and Generals can withdraw.'}); return; }
    try {
      const ref = this.firestore.collection('guilds').doc(game.state.guild.id);
      const doc = await ref.get();
      const bank = doc.data()?.bank || 0;
      if (amount > bank) { this.emit('notification',{type:'warn',text:`Guild bank only has ${bank}g.`}); return; }
      await ref.update({ bank: firebase.firestore.FieldValue.increment(-amount) });
      game.state.gold += amount;
      this.emit('notification',{type:'success',text:`Withdrew ${amount}g from guild bank.`});
    } catch(e) { this.emit('notification',{type:'danger',text:'Withdraw failed: '+e.message}); }
  }

  async depositGuildItem(itemId, qty) {
    if (!this.isOnline || !this.user || !game.state.guild) return;
    try {
      const ref = this.firestore.collection('guilds').doc(game.state.guild.id);
      const doc = await ref.get();
      const data = doc.data() || {};
      const items = data.itemBank || [];
      const existing = items.find(i=>i.id===itemId);
      if (existing) existing.qty += qty;
      else items.push({id:itemId, qty, depositedBy:this.displayName});
      await ref.update({ itemBank: items });
      this.emit('notification',{type:'success',text:`Deposited ${qty}x item to guild bank.`});
    } catch(e) { this.emit('notification',{type:'danger',text:'Deposit failed: '+e.message}); throw e; }
  }

  async withdrawGuildItem(itemId, qty) {
    if (!this.isOnline || !this.user || !game.state.guild) return;
    const rankOrder = ['Leader','General','Captain','Lieutenant','Sergeant','Member','Recruit'];
    const myIdx = rankOrder.indexOf(game.state.guild.role||'Recruit');
    const wIdx = rankOrder.indexOf(game.state.guild.withdrawRank||'Captain');
    if (myIdx > wIdx) { this.emit('notification',{type:'warn',text:`Need ${game.state.guild.withdrawRank||'Captain'} rank to withdraw items.`}); return; }
    try {
      const ref = this.firestore.collection('guilds').doc(game.state.guild.id);
      const doc = await ref.get();
      const data = doc.data() || {};
      const items = data.itemBank || [];
      const existing = items.find(i=>i.id===itemId);
      if (!existing || existing.qty < qty) { this.emit('notification',{type:'warn',text:'Not enough in guild bank.'}); return; }
      existing.qty -= qty;
      const updated = items.filter(i=>i.qty>0);
      await ref.update({ itemBank: updated });
      this.emit('notification',{type:'success',text:`Withdrew ${qty}x item from guild bank.`});
    } catch(e) { this.emit('notification',{type:'danger',text:'Withdraw failed: '+e.message}); throw e; }
  }

  async getGuildItems() {
    if (!this.isOnline || !this.user || !game.state.guild) return [];
    try {
      const doc = await this.firestore.collection('guilds').doc(game.state.guild.id).get();
      return doc.exists ? (doc.data().itemBank || []) : [];
    } catch(e) { return []; }
  }

  async updateGuildSettings(settings) {
    if (!this.isOnline || !this.user || !game.state.guild) return;
    if (game.state.guild.role !== 'Leader') { this.emit('notification',{type:'warn',text:'Only Leaders can change guild settings.'}); return; }
    try {
      const ref = this.firestore.collection('guilds').doc(game.state.guild.id);
      await ref.update({
        name: settings.name,
        tag: settings.tag,
        description: settings.description||'',
        emblem: settings.emblem||'⚔',
        depositRank: settings.depositRank||'Member',
        withdrawRank: settings.withdrawRank||'Captain',
      });
      this.emit('notification',{type:'success',text:'Guild settings updated!'});
    } catch(e) { this.emit('notification',{type:'danger',text:'Update failed: '+e.message}); throw e; }
  }

  async setMemberRank(memberUid, newRank) {
    if (!this.isOnline || !this.user || !game.state.guild) return;
    const myRank = game.state.guild.role;
    const rankOrder = ['Leader','General','Captain','Lieutenant','Sergeant','Member','Recruit'];
    const myIdx = rankOrder.indexOf(myRank);
    const targetIdx = rankOrder.indexOf(newRank);
    // Can only set ranks below your own
    if (myIdx < 0 || targetIdx <= myIdx) { this.emit('notification',{type:'warn',text:'Cannot set a rank equal to or above your own.'}); return; }
    try {
      const ref = this.firestore.collection('guilds').doc(game.state.guild.id);
      const doc = await ref.get();
      if (!doc.exists) return;
      const data = doc.data();
      const member = data.members.find(m => m.uid === memberUid);
      if (!member) { this.emit('notification',{type:'warn',text:'Member not found.'}); return; }
      // Can't change someone of equal or higher rank
      const theirIdx = rankOrder.indexOf(member.rank || 'Recruit');
      if (theirIdx <= myIdx && myRank !== 'Leader') { this.emit('notification',{type:'warn',text:'Cannot change rank of someone at or above your rank.'}); return; }
      member.rank = newRank;
      await ref.update({ members:data.members });
      this.emit('notification',{type:'success',text:`${member.name} is now ${newRank}.`});
    } catch(e) { this.emit('notification',{type:'danger',text:'Rank change failed: '+e.message}); }
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
      const _msg = e.code==='permission-denied' ? 'Firestore rules not deployed. Firebase Console → Firestore → Rules → Publish.' : 'Friend request failed: '+e.message;
      this.emit('notification',{type:'danger',text:_msg});
    }
  }

  async getFriendRequests() {
    if (!this.isOnline || !this.user) return [];
    try {
      const snap = await this.firestore.collection('friend_requests')
        .where('to','==',this.user.uid)
        .where('status','==','pending')
        .limit(20).get();
      const requests = [];
      snap.forEach(doc => requests.push({ id:doc.id, ...doc.data() }));
      return requests;
    } catch(e) { console.error('Get friend requests error:', e); return []; }
  }

  async getSentFriendRequests() {
    if (!this.isOnline || !this.user) return [];
    try {
      const snap = await this.firestore.collection('friend_requests')
        .where('from','==',this.user.uid)
        .where('status','==','pending')
        .limit(20).get();
      const requests = [];
      snap.forEach(doc => requests.push({ id:doc.id, ...doc.data() }));
      return requests;
    } catch(e) { console.error('Get sent requests error:', e); return []; }
  }

  async cancelFriendRequest(requestId) {
    if (!this.isOnline || !this.user) return;
    try {
      await this.firestore.collection('friend_requests').doc(requestId).update({ status:'cancelled' });
      this.emit('notification',{type:'info',text:'Friend request cancelled.'});
    } catch(e) { this.emit('notification',{type:'danger',text:'Cancel failed: '+e.message}); }
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
  startFriendRequestListener() {
    if (!this.isOnline || !this.user || this._friendReqUnsub) return;
    this._friendReqUnsub = this.firestore.collection('friend_requests')
      .where('to', '==', this.user.uid)
      .where('status', '==', 'pending')
      .onSnapshot(snap => {
        const count = snap.size;
        this.emit('friendRequestUpdate', { count });
        snap.docChanges().forEach(change => {
          if (change.type === 'added') {
            const d = change.doc.data();
            // Only notify if not very old (within 60s of now)
            const ts = d.timestamp?.seconds;
            if (!ts || (Date.now()/1000 - ts) < 60) {
              this.emit('notification', { type:'info', text:`⚔ Friend request from ${d.fromName}!` });
            }
          }
        });
      }, err => console.error('Friend request listener error:', err));
  }

  async getOnlinePlayers() {
    if (!this.isOnline) return [];
    try {
      // Players who updated presence in last 5 minutes
      const cutoff = Date.now() - 5 * 60 * 1000;
      const snap = await this.firestore.collection('players')
        .orderBy('lastSeen', 'desc').limit(50).get();
      const players = [];
      snap.forEach(doc => {
        const d = doc.data();
        const lastSeen = d.lastSeen?.toMillis?.() || d.lastSeen || 0;
        if (lastSeen > cutoff) {
          players.push({
            uid: doc.id,
            name: d.displayName || 'Survivor',
            combatLevel: d.combatLevel || 1,
            totalLevel: d.totalLevel || 1,
            currentActivity: d.currentActivity || 'Idle',
            lastSeen,
          });
        }
      });
      return players;
    } catch(e) { console.error('getOnlinePlayers error:', e); return []; }
  }

  async updateActivity(activity) {
    if (!this.isOnline || !this.user || this.user.isAnonymous) return;
    try {
      await this.firestore.collection('players').doc(this.user.uid).set({
        displayName: this.displayName,
        combatLevel: (typeof game !== 'undefined') ? game.engine?.getCombatLevel?.() || 1 : 1,
        totalLevel: (typeof game !== 'undefined') ? game.engine?.getTotalLevel?.() || 1 : 1,
        currentActivity: activity,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    } catch(e) { /* silent */ }
  }

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
            }
          }
        });
      }, err => { console.error('Inbox listener error:', err); });
  }

  // ── EVENTS ─────────────────────────────────────────────
  on(event, fn) { if (!this.listeners[event]) this.listeners[event] = []; this.listeners[event].push(fn); }
  emit(event, data) { if (this.listeners[event]) for (const fn of this.listeners[event]) fn(data); }
}

const online = new OnlineManager();
