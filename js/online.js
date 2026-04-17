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

      this.auth.onAuthStateChanged((user) => {
        this.user = user;
        if (user) {
          this.displayName = user.displayName || localStorage.getItem('ashfall_displayName') || ('Survivor_' + user.uid.substring(0, 6));
          this.loadProfile();
          this.emit('authChanged', { user, displayName:this.displayName });
        } else {
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
      this.emit('authChanged', { user:this.user, displayName });
      this.emit('notification', { type:'success', text:'Account created!' });
      return true;
    } catch(e) {
      this.emit('notification', { type:'danger', text:e.message });
      return false;
    }
  }

  async signIn(email, password) {
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
      this.emit('notification', { type:'success', text:'Signed in!' });
      return true;
    } catch(e) {
      this.emit('notification', { type:'danger', text:e.message });
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
    if (text.length === 0 || text.length > 200) return;
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

  // ── CLOUD SAVES ────────────────────────────────────────
  async saveToCloud() {
    if (!this.isOnline || !this.user || !game) return;
    try {
      const save = JSON.parse(JSON.stringify(game.state));
      save._cloudSaveTime = Date.now();
      await this.firestore.collection('players').doc(this.user.uid).set({
        save,
        displayName: this.displayName,
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
      this.emit('notification', { type:'success', text:'Saved to cloud.' });
    } catch(e) {
      this.emit('notification', { type:'danger', text:'Cloud save failed: ' + e.message });
    }
  }

  async loadFromCloud() {
    if (!this.isOnline || !this.user) return null;
    try {
      const doc = await this.firestore.collection('players').doc(this.user.uid).get();
      if (doc.exists && doc.data().save) {
        this.emit('notification', { type:'success', text:'Loaded from cloud.' });
        return doc.data().save;
      }
    } catch(e) { console.error('Cloud load error:', e); }
    return null;
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
        this.emit('notification', { type:'warn', text:'No opponents found near your level. Try again later.' });
        return null;
      }

      const result = this.resolvePvPCombat(game.state, opponent);
      await this.storePvPResult(result, opponent);
      return result;
    } catch(e) {
      console.error('Match error:', e);
      return null;
    }
  }

  resolvePvPCombat(playerState, opponent) {
    const pSkills = playerState.skills;
    const oSkills = opponent.skills;

    // Calculate effective stats
    const pAtk = pSkills.attack.level + this.getEquipStat(playerState.equipment, 'attackBonus');
    const pStr = pSkills.strength.level + this.getEquipStat(playerState.equipment, 'strengthBonus');
    const pDef = pSkills.defence.level + this.getEquipStat(playerState.equipment, 'defenceBonus');
    const pHp = pSkills.hitpoints.level * 10 + 10;
    const pMaxHit = Math.max(1, Math.floor(0.5 + pStr * 64 / 640));

    const oAtk = oSkills.attack + this.getEquipStat(opponent.equipment, 'attackBonus');
    const oStr = oSkills.strength + this.getEquipStat(opponent.equipment, 'strengthBonus');
    const oDef = oSkills.defence + this.getEquipStat(opponent.equipment, 'defenceBonus');
    const oHp = oSkills.hitpoints * 10 + 10;
    const oMaxHit = Math.max(1, Math.floor(0.5 + oStr * 64 / 640));

    // Simulate 50 turns max
    let pHealth = pHp, oHealth = oHp;
    let turns = 0;
    const log = [];

    while (pHealth > 0 && oHealth > 0 && turns < 50) {
      turns++;
      // Player attacks
      const pAccuracy = (pAtk + 8) * 64;
      const oEvasion = (oDef + 8) * 64;
      const pHitChance = Math.min(0.95, Math.max(0.05, pAccuracy / (pAccuracy + oEvasion)));
      if (Math.random() < pHitChance) {
        const dmg = Math.floor(Math.random() * pMaxHit) + 1;
        oHealth -= dmg;
        log.push({ turn:turns, who:'player', dmg });
      } else {
        log.push({ turn:turns, who:'player', dmg:0, miss:true });
      }

      if (oHealth <= 0) break;

      // Opponent attacks
      const oAccuracy = (oAtk + 8) * 64;
      const pEvasion = (pDef + 8) * 64;
      const oHitChance = Math.min(0.95, Math.max(0.05, oAccuracy / (oAccuracy + pEvasion)));
      if (Math.random() < oHitChance) {
        const dmg = Math.floor(Math.random() * oMaxHit) + 1;
        pHealth -= dmg;
        log.push({ turn:turns, who:'opponent', dmg });
      } else {
        log.push({ turn:turns, who:'opponent', dmg:0, miss:true });
      }
    }

    const won = oHealth <= 0 || (pHealth > oHealth);
    const goldReward = won ? Math.floor(50 + opponent.combatLevel * 10) : 0;
    const ratingChange = won ? Math.floor(15 + Math.max(0, opponent.pvpRating - this.pvpRating) * 0.1) : -Math.floor(10);

    return {
      won,
      turns,
      playerHpLeft: Math.max(0, pHealth),
      opponentHpLeft: Math.max(0, oHealth),
      playerMaxHp: pHp,
      opponentMaxHp: oHp,
      opponentName: opponent.name,
      opponentLevel: opponent.combatLevel,
      opponentRating: opponent.pvpRating || 1000,
      goldReward,
      ratingChange,
      log,
    };
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
      // Update rating
      this.pvpRating = Math.max(0, this.pvpRating + result.ratingChange);

      // Award gold + loot
      if (result.won && game) {
        game.state.gold += result.goldReward;
        game.state.stats.goldEarned += result.goldReward;
        // Roll PvP loot
        const loot = this.rollPvPLoot(opponent.combatLevel);
        for (const l of loot) {
          game.addItem(l.item, l.qty);
          this.emit('notification', { type:'rare', text:`PvP Loot: ${GAME_DATA.items[l.item]?.name || l.item}!` });
        }
      }

      // Store result
      await this.firestore.collection('pvp_results').add({
        winner: result.won ? this.user.uid : opponent.uid,
        loser: result.won ? opponent.uid : this.user.uid,
        winnerName: result.won ? this.displayName : opponent.name,
        loserName: result.won ? opponent.name : this.displayName,
        turns: result.turns,
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

      // Sync profile
      this.syncProfile();

      // Remove from queue
      await this.firestore.collection('pvp_queue').doc(this.user.uid).delete();

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

  // ── EVENTS ─────────────────────────────────────────────
  on(event, fn) { if (!this.listeners[event]) this.listeners[event] = []; this.listeners[event].push(fn); }
  emit(event, data) { if (this.listeners[event]) for (const fn of this.listeners[event]) fn(data); }
}

const online = new OnlineManager();
