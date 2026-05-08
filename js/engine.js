// ============================================================
// ASHFALL IDLE - Engine v2 (ForgeIdle expansion)
// ============================================================

class GameEngine {
  constructor() {
    this.tickRate = 100;
    this.tickInterval = null;
    this.lastTick = Date.now();
    this.state = null;
    this.listeners = {};
    this.autoSaveInterval = null;
    // Anti-cheat
    this._sessionId = Math.random().toString(36).substring(2);
    this._actionTimestamps = [];
    this._maxActionsPerSec = 15;
    this._tabHidden = false;
    this._suspicionScore = 0;
  }

  init() {
    this.state = this.loadSave() || this.newGame();
    this.migrateSave();
    // Reset stale combat (monster from previous session may not exist)
    if (this.state.combat.active && this.state.combat.monster) {
      const mon = GAME_DATA.monsters[this.state.combat.monster] || (GAME_DATA.worldBosses||[]).find(b=>b.id===this.state.combat.monster);
      if (!mon) {
        console.log('[Ashfall] Resetting stale combat: monster', this.state.combat.monster, 'not found');
        this.state.combat.active = false;
        this.state.combat.monster = null;
        this.state.combat.area = null;
        this.state.combat.playerHp = this.getMaxHp();
      }
    }
    this.processOffline();
    this.startTick();
    this.autoSaveInterval = setInterval(() => {
      this.save();
      // Sync stats to leaderboard every auto-save
      if (typeof online !== 'undefined' && online.isOnline) online.syncProfile();
    }, 30000);
    this.emit('init', this.state);
    this.emit('notification', { type:'info', text:'Welcome to Ashfall.' });
    // Anti-cheat: tab visibility
    document.addEventListener('visibilitychange', () => {
      this._tabHidden = document.hidden;
    });
    // Anti-cheat: multi-session detection
    const existingSession = localStorage.getItem('ashfall_session');
    if (existingSession && existingSession !== this._sessionId) {
      const lastPing = parseInt(localStorage.getItem('ashfall_session_ping') || '0');
      if (Date.now() - lastPing < 5000) {
        this._suspicionScore += 50;
        this.emit('notification', { type:'danger', text:'Multiple sessions detected. Progress may not save.' });
      }
    }
    localStorage.setItem('ashfall_session', this._sessionId);
    this._sessionPingInterval = setInterval(() => {
      localStorage.setItem('ashfall_session_ping', String(Date.now()));
      // Check if another session overwrote our ID
      if (localStorage.getItem('ashfall_session') !== this._sessionId) {
        this._suspicionScore += 10;
        localStorage.setItem('ashfall_session', this._sessionId);
      }
    }, 3000);
  }

  newGame() {
    const skills = {};
    for (const id of Object.keys(GAME_DATA.skills)) {
      skills[id] = { level: id==='hitpoints'?10:1, xp: id==='hitpoints'?1154:0 };
    }
    return {
      version: 2, created: Date.now(), lastSave: Date.now(), gold: 25,
      skills,
      bank: { oak_log:0, copper_ore:0, tin_ore:0, raw_shrimp:0 },
      equipment: { weapon:null,shield:null,head:null,body:null,legs:null,boots:null,gloves:null,ring:null,amulet:null,cape:null,ammo:null },
      food: { equipped:null, qty:0 },
      activeSkill: null, activeAction: null, actionProgress: 0,
      combat: {
        active:false, area:null, monster:null, dungeon:null, dungeonWave:0, worldBoss:null,
        playerHp: this.getMaxHp(skills), monsterHp:0,
        playerAttackTimer:0, monsterAttackTimer:0,
        selectedSpell:null, combatStyle:'melee', autoEat:true,
        statusEffects:{player:{}, monster:{}}, abilityCooldowns:{}, activeBuffs:[],
        xpMode:'controlled', // melee: accurate/aggressive/defensive/controlled | ranged: accurate/rapid/longrange | magic: standard
      },
      farming: { plots:[{seed:null,plantedAt:null,growTime:0,ready:false},{seed:null,plantedAt:null,growTime:0,ready:false},{seed:null,plantedAt:null,growTime:0,ready:false}] },
      mastery: {},
      alignment: 'true_neutral',
      alignmentPoints: { moral:0, order:0 },
      reputation: {},
      quests: { active:[], completed:[], progress:{} },
      equippedAbilities: [null, null, null, null],
      worldBossRespawns: {},
      stats: {
        totalActions:{}, monstersKilled:0, dungeonsCompleted:0, uniqueKills:{},
        totalXpGained:0, itemsCrafted:0, foodEaten:0, goldEarned:0, goldSpent:0,
        totalPlayTime:0, deaths:0, worldBossKills:0, questsCompleted:0,
      },
      achievements: [], collectionLog: {}, settings: { notifications:true, autoLoot:true },
    };
  }

  migrateSave(saveData) {
    if (saveData) { this.state = saveData; }
    const s = this.state; if (!s) return s;
    for (const id of Object.keys(GAME_DATA.skills)) {
      if (!s.skills[id]) s.skills[id] = { level:1, xp:0 };
    }
    if (!s.alignment) s.alignment = 'true_neutral';
    // alignmentPoints: migrate old {good,evil,lawful,chaotic} to new {moral,order}
    if (!s.alignmentPoints) s.alignmentPoints = { moral:0, order:0 };
    if (s.alignmentPoints.moral === undefined) {
      // Convert old format to new
      const old = s.alignmentPoints;
      s.alignmentPoints = {
        moral: (old.good || 0) - (old.evil || 0),
        order: (old.lawful || 0) - (old.chaotic || 0),
      };
    }
    if (!s.reputation) s.reputation = {};
    if (!s.quests) s.quests = { active:[], completed:[], progress:{} };
    if (!s.quests.progress) s.quests.progress = {};
    if (!s.equippedAbilities) s.equippedAbilities = [null,null,null,null];
    if (!s.worldBossRespawns) s.worldBossRespawns = {};
    if (!s.combat.statusEffects) s.combat.statusEffects = { player:{}, monster:{} };
    if (!s.combat.abilityCooldowns) s.combat.abilityCooldowns = {};
    if (!s.combat.activeBuffs) s.combat.activeBuffs = [];
    if (!s.combat.xpMode) s.combat.xpMode = 'controlled';
    if (s.stats.worldBossKills === undefined) s.stats.worldBossKills = 0;
    if (s.stats.questsCompleted === undefined) s.stats.questsCompleted = 0;
    // v3 fields
    if (s.prayerPoints === undefined) s.prayerPoints = 0;
    if (!s.activePrayers) s.activePrayers = [];
    if (!s.pets) s.pets = [];
    if (s.activePet === undefined) s.activePet = null;
    if (s.slayerCoins === undefined) s.slayerCoins = 0;
    if (!s.slayerTask) s.slayerTask = null;
    if (s.slayerAutoEnabled === undefined) s.slayerAutoEnabled = false;
    if (s.activeSpellbook === undefined) s.activeSpellbook = 'standard';
    if (!s.unlockedSpellbooks) s.unlockedSpellbooks = {};
    if (!s.stats.bonesBuried) s.stats.bonesBuried = 0;
    if (!s.stats.slayerTasksCompleted) s.stats.slayerTasksCompleted = 0;
    if (!s.stats.slayerKillsOnTask) s.stats.slayerKillsOnTask = 0;
    if (!s.stats.petsFound) s.stats.petsFound = 0;
    if (!s.stats.magicKills) s.stats.magicKills = 0;
    if (!s.stats.dungeonCompletions) s.stats.dungeonCompletions = {};
    // Character profile
    if (!s.profile) s.profile = { avatarSeed:'', hair:'short04', skinColor:'c68642', hairColor:'2c1b18', accessory:'', mouth:'happy01', eyes:'variant04', clothing:'variant04', clothingColor:'4a90d4', bio:'' };
    if (!s.guild) s.guild = null;
    if (!s.storyline) s.storyline = {};
    if (!s.gearSets) s.gearSets = {};
    if (!s.collectionLog) s.collectionLog = {};
    // Retroactive collection log scan — log items already in bank/equipment
    if (Object.keys(s.collectionLog).length === 0 && s.bank) {
      for (const id of Object.keys(s.bank)) { if (s.bank[id] > 0 && GAME_DATA.items[id]) s.collectionLog[id] = Date.now(); }
      for (const slot of Object.keys(s.equipment || {})) { if (s.equipment[slot] && GAME_DATA.items[s.equipment[slot]]) s.collectionLog[s.equipment[slot]] = Date.now(); }
    }
    if (!s.equipment.ring) s.equipment.ring = null;
    if (!s.equipment.amulet) s.equipment.amulet = null;
    if (!s.equipment.cape) s.equipment.cape = null;
    if (!s.equipment.gloves) s.equipment.gloves = null;
    // Farming v2 migration
    if (!s.farming) s.farming = {};
    if (!s.farming.canUses) s.farming.canUses = {};
    // Upgrade old flat plot array to typed patch system
    if (Array.isArray(s.farming.plots)) {
      for (const p of s.farming.plots) {
        if (!p.type) p.type = 'allotment';
        if (p.watered === undefined) p.watered = false;
        if (p.waterBonus === undefined) p.waterBonus = 0;
        if (p.compostTier === undefined) p.compostTier = 0;
        if (p.compostBonus === undefined) p.compostBonus = 0;
        if (p.diseaseReduction === undefined) p.diseaseReduction = 0;
        if (p.hasWeeds === undefined) p.hasWeeds = false;
        if (p.dead === undefined) p.dead = false;
        if (p._diseaseChecked === undefined) p._diseaseChecked = false;
        if (p._diseaseChance === undefined) p._diseaseChance = 0;
      }
    }
    // Pet combat counter
    if (!s.combat._petAttackCounter) s.combat._petAttackCounter = 0;
    // Theatre of Ash — always reset active raid state on load
    if (!s.theatre) s.theatre = { active:false };
    if (s.theatre.active) s.theatre = { active:false }; // never load mid-raid
    // Chambers of the Ashen King — always reset active raid state on load
    if (!s.chambers) s.chambers = { active:false };
    if (s.chambers.active) s.chambers = { active:false }; // never load mid-raid
    if (!s.stats.chambersCompletions) s.stats.chambersCompletions = 0;
    if (!s.stats.chambersBestTier) s.stats.chambersBestTier = '';
    // Party system
    if (!s.party) s.party = { active:false, id:null, name:null, leader:null, members:[], npcMembers:[], raidTarget:null, readyCheck:false, allReady:false, raidActive:false, raidStarted:false, chat:[], memberStatus:{}, totalPartyDmg:0 };
    // Patch old saves missing new party fields
    if (!s.party.npcMembers) s.party.npcMembers = [];
    if (s.party.raidTarget === undefined) s.party.raidTarget = null;
    if (!s.party.memberStatus) s.party.memberStatus = {};
    if (s.party.totalPartyDmg === undefined) s.party.totalPartyDmg = 0;
    if (s.party.readyCheck === undefined) s.party.readyCheck = false;
    if (s.party.allReady === undefined) s.party.allReady = false;
    if (s.party.raidStarted === undefined) s.party.raidStarted = false;
    // Barrows
    if (!s.barrows) s.barrows = { active:false };
    if (s.barrows.active) s.barrows = { active:false };
    if (!s.stats.barrowsCompletions) s.stats.barrowsCompletions = 0;
    // Gauntlet
    if (!s.gauntlet) s.gauntlet = { active:false };
    if (s.gauntlet.active) s.gauntlet = { active:false };
    if (!s.stats.gauntletCompletions) s.stats.gauntletCompletions = 0;
    // Inferno
    if (!s.inferno) s.inferno = { active:false };
    if (s.inferno.active) s.inferno = { active:false };
    if (!s.stats.infernoCompletions) s.stats.infernoCompletions = 0;
    if (s.multiMob) s.multiMob = null;
    s.combat._permDebuffs = s.combat._permDebuffs || {};
    // Thieving v2
    if (s.thievingHp === undefined) s.thievingHp = null; // null = full HP (init lazily)
    if (!s.thievingAnger) s.thievingAnger = {};
    if (!s.familiar) s.familiar = { active:null, timeLeft:0 };
    if (!s.potionBelt) s.potionBelt = [{id:null,qty:0},{id:null,qty:0},{id:null,qty:0},{id:null,qty:0}];
    if (s.specEnergy === undefined) s.specEnergy = 100;
    if (!Array.isArray(s.foodBag)) {
      s.foodBag = [];
      if (s.food?.equipped && s.food.qty > 0) {
        s.foodBag.push({ id: s.food.equipped, qty: s.food.qty });
      }
    }
    // Ore Bag system
    if (!s.oreBag) s.oreBag = { capacity:100, contents:{}, upgrades:[] };
    if (!s.miningStats) s.miningStats = { luck:0, security:0, danger:0, totalMined:0, eventsTriggered:0 };
    s.version = 2;
    return s;
  }

  // ── TICK ───────────────────────────────────────────────
  startTick() { this.tickInterval = setInterval(() => this.tick(), this.tickRate); }

  tick() {
    const now = Date.now();
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;
    // Anti-cheat: cap dt to prevent time manipulation
    const safeDt = Math.min(dt, 1.0); // max 1 second per tick
    this.state.stats.totalPlayTime += safeDt;
    // Anti-cheat: detect speed hacks (ticks coming way too fast)
    if (dt < 0.01 && !this._tabHidden) { this._suspicionScore += 1; }
    if (this._suspicionScore > 100) {
      this.emit('notification', { type:'danger', text:'Suspicious activity detected. Progress may be reverted.' });
      this._suspicionScore = 50; // reset but keep elevated
    }

    if (this.state.combat.active) this.tickCombat(safeDt);
    else if (this.state.activeSkill && this.state.activeAction) this.tickSkill(safeDt);

    // Smithing heat decay (only when not smithing)
    if (this.state._smithingHeat > 0 && GAME_DATA.smeltingHeat?.enabled) {
      const decay = (GAME_DATA.smeltingHeat.decayPerSecond || 8) * safeDt;
      this.state._smithingHeat = Math.max(0, (this.state._smithingHeat||0) - decay);
    }

    // Auto-bank overflow check
    if (this.state._autoBankConfig?.enabled) this._autoBankTick();

    this.tickFarming(now);
    this.initDailyQuests();
    this.tickBuffs(safeDt);
    this.tickAbilityCooldowns(safeDt);
    this.tickFamiliar(safeDt);
    this.checkAchievements();
    // Random events (check every ~30 seconds of play)
    if (!this._lastEventCheck) this._lastEventCheck = now;
    if (now - this._lastEventCheck > 30000 && (this.state.activeSkill || this.state.combat.active)) {
      this._lastEventCheck = now;
      this.rollRandomEvent();
    }
    this.emit('tick', this.state);
  }

  // ── SKILL (single-skill enforced) ──────────────────────
  startSkill(skillId, actionId) {
    if (this.state.combat.active) {
      this.emit('notification', { type:'warn', text:'Cannot train skills during combat.' });
      return false;
    }
    const skill = GAME_DATA.skills[skillId];
    if (!skill) return false;
    const action = this._findAction(skillId, actionId);
    if (!action) return false;
    if (this.state.skills[skillId].level < action.level) {
      this.emit('notification', { type:'warn', text:`Requires ${skill.name} level ${action.level}.` });
      return false;
    }
    if ((skill.type === 'artisan' || skillId === 'summoning') && action.input && !this.hasItems(action.input)) {
      this.emit('notification', { type:'warn', text:'Missing required materials.' });
      return false;
    }
    // EXPLICIT single-skill enforcement: hard stop any active skill first
    const wasActive = this.state.activeSkill;
    this.state.activeSkill = null;
    this.state.activeAction = null;
    this.state.actionProgress = 0;
    // Then set new
    this.state.activeSkill = skillId;
    this.state.activeAction = actionId;
    this.state.actionProgress = 0;
    if (wasActive && wasActive !== skillId) {
      this.emit('notification', { type:'info', text:`Stopped ${GAME_DATA.skills[wasActive]?.name}, started ${skill.name}.` });
    }
    this.emit('skillStart', { skill:skillId, action:actionId });
    return true;
  }

  stopSkill() {
    this.state.activeSkill = null;
    this.state.activeAction = null;
    this.state.actionProgress = 0;
    this.emit('skillStop');
  }

  _findAction(skillId, actionId) {
    const skill = GAME_DATA.skills[skillId]; if (!skill) return null;
    if (skill.type === 'gathering' || skill.type === 'agility') {
      // Check fishing zones first
      if (skillId === 'fishing' && actionId.startsWith('zone_')) {
        const zone = GAME_DATA.fishingZones?.find(z => z.id === actionId.replace('zone_',''));
        if (zone) return { id:actionId, name:zone.name, level:zone.level, time:zone.time, xp:0, loot:[], _fishZone:zone, masteryId:zone.id };
      }
      return GAME_DATA.gatheringActions[skillId]?.find(a => a.id === actionId);
    }
    if (skill.type === 'artisan')   return GAME_DATA.recipes[skillId]?.find(a => a.id === actionId);
    if (skillId === 'summoning')    return GAME_DATA.recipes.summoning?.find(a => a.id === actionId);
    if (skillId === 'thieving')     return GAME_DATA.thievingTargets.find(a => a.id === actionId);
    return null;
  }

  tickSkill(dt) {
    const sId = this.state.activeSkill, aId = this.state.activeAction;
    if (!sId || !aId) return;
    const action = this._findAction(sId, aId);
    if (!action) { this.stopSkill(); return; }
    const masteryRed = 1 + (this.getMasteryLevel(sId, action.masteryId||action.id) * 0.005);
    const toolRed = 1 + (this.getToolSpeedBonus(sId) / 100);
    const actionTime = action.time / masteryRed / toolRed;
    this.state.actionProgress += dt;
    if (this.state.actionProgress >= actionTime) {
      this.state.actionProgress -= actionTime;
      this.completeAction(sId, action);
    }
  }

  completeAction(skillId, action) {
    const skill = GAME_DATA.skills[skillId];
    if (skill.type === 'gathering' || skill.type === 'agility') {
      // Zone-based fishing
      if (action._fishZone) {
        const zone = action._fishZone;
        const totalWeight = zone.fish.reduce((s,f)=>s+f.weight, 0);
        let roll = Math.random() * totalWeight;
        let caught = zone.fish[0];
        for (const f of zone.fish) {
          roll -= f.weight;
          if (roll <= 0) { caught = f; break; }
        }
        this.addItem(caught.item, 1);
        this.addXp(skillId, caught.xp);
        this.trackQuestProgress('gather', { item:caught.item, qty:1 });
        this.incrementStat(skillId);
        this.addMasteryXp(skillId, zone.id, caught.xp * 0.5);
        return; // skip normal XP add below
      }
      for (const drop of (action.loot || (action.output ? [{item:action.output.item,qty:action.output.qty||1}] : []))) {
        if (drop.chance !== undefined && Math.random() > drop.chance) continue; // optional probability
        const isOre = GAME_DATA.items[drop.item]?.type === 'ore' || GAME_DATA.oreBagConfig?.oreTypes?.includes(drop.item);
        if (isOre && this.state.oreBag) {
          // Route to ore bag
          const ob = this.state.oreBag;
          const totalInBag = Object.values(ob.contents).reduce((s,e) => s + e.qty, 0);
          if (totalInBag + drop.qty <= ob.capacity) {
            if (!ob.contents[drop.item]) ob.contents[drop.item] = {qty:0};
            ob.contents[drop.item].qty += drop.qty;
          } else {
            this.addItem(drop.item, drop.qty); // overflow to bank
          }
          this.state.miningStats.totalMined += drop.qty;
        } else {
          this.addItem(drop.item, drop.qty);
        }
        this.trackQuestProgress('gather', { item:drop.item, qty:drop.qty });
      }
      // Mining random events
      if (skillId === 'mining' && GAME_DATA.miningEvents) {
        this._rollMiningEvent();
      }
      if (action.gemChance && Math.random() < action.gemChance) {
        const gem = this.weightedRandom(['topaz','sapphire','ruby','emerald','diamond','onyx'], [40,25,15,10,8,2]);
        this.addItem(gem, 1);
        this.trackQuestProgress('gather', { item:gem, qty:1 });
        this.emit('notification', { type:'rare', text:`✦ Gem found — ${GAME_DATA.items[gem]?.name || gem}!` });
      }

      // ── WOODCUTTING DEPTH ──────────────────────────────────────
      if (skillId === 'woodcutting') {
        const mastLv = this.getMasteryLevel('woodcutting', action.masteryId || action.id);
        // Double log chance: 5% base + 0.5% per mastery level (max ~55%)
        const doubleChance = 0.05 + mastLv * 0.005;
        if (Math.random() < doubleChance) {
          const extraLog = action.loot[0]?.item;
          if (extraLog) {
            this.addItem(extraLog, 1);
            this.emit('notification', { type:'info', text:`Double log! Mastery bonus.` });
          }
        }
        // Bird nest: 0.4% base chance (OSRS-style)
        if (Math.random() < 0.004) {
          const nestContents = this.weightedRandom(
            ['nest_seeds','nest_ring','nest_empty'],
            [60, 15, 25]
          );
          const nestItem = nestContents === 'nest_ring' ? this.weightedRandom(
            ['gold_ring','sapphire_ring','ruby_ring','diamond_ring'],
            [50,25,15,10]
          ) : nestContents === 'nest_seeds' ? this.weightedRandom(
            ['herb_seed','ranarr_seed','blood_seed','moon_seed'],
            [40,20,20,20]
          ) : null;
          if (nestItem && GAME_DATA.items[nestItem]) {
            this.addItem(nestItem, 1);
            this.emit('notification', { type:'rare', text:`🪺 Bird's nest! Contains: ${GAME_DATA.items[nestItem].name}` });
          } else {
            this.emit('notification', { type:'info', text:`🪺 Empty bird's nest fell from the tree.` });
          }
        }
      }

      // ── FISHING DEPTH ──────────────────────────────────────────
      if (skillId === 'fishing') {
        const fishingLv = this.state.skills.fishing.level;
        // Rare catch: 1.5% chance at high level spots for bonus XP + special item
        if (Math.random() < 0.015 && fishingLv >= 50) {
          const rareCatch = this.weightedRandom(
            ['mermaid_tear','clue_scroll_easy','fishing_trophy','leviathan_scale'],
            [40, 30, 20, 10]
          );
          if (rareCatch === 'mermaid_tear' || rareCatch === 'fishing_trophy' || rareCatch === 'leviathan_scale') {
            if (GAME_DATA.items[rareCatch]) {
              this.addItem(rareCatch, 1);
              this.emit('notification', { type:'rare', text:`🐟 Rare catch! ${GAME_DATA.items[rareCatch].name}` });
            }
          } else if (rareCatch === 'clue_scroll_easy') {
            if (GAME_DATA.items['clue_scroll_easy']) {
              this.addItem('clue_scroll_easy', 1);
              this.emit('notification', { type:'rare', text:`📜 Clue scroll found while fishing!` });
            }
          }
        }
        // Big fish bonus XP (5% chance)
        if (Math.random() < 0.05) {
          const bonusXp = Math.floor(action.xp * 0.5);
          this.addXp(skillId, bonusXp);
          this.emit('xpGain', { skill: skillId, amount: bonusXp, source: 'bigFish' });
          this.emit('notification', { type:'info', text:`🎣 Big catch! +${bonusXp} bonus XP` });
        }
      }

      // ── FORAGING DEPTH ─────────────────────────────────────────
      if (skillId === 'foraging') {
        const mastLv = this.getMasteryLevel('foraging', action.masteryId || action.id);
        // Multi-herb: 3% base + 0.4% per mastery level chance for extra herb
        const multiChance = 0.03 + mastLv * 0.004;
        if (Math.random() < multiChance) {
          const herb = action.loot[0]?.item;
          if (herb) {
            this.addItem(herb, 1);
            this.emit('notification', { type:'info', text:`Double herb! Mastery bonus.` });
          }
        }
      }

      // ── HUNTING DEPTH ──────────────────────────────────────────
      if (skillId === 'hunting' && action.level >= 55) {
        // Clue scroll chance from high-level hunts (1%)
        if (Math.random() < 0.01 && GAME_DATA.items['clue_scroll_easy']) {
          this.addItem('clue_scroll_easy', 1);
          this.emit('notification', { type:'rare', text:`📜 Clue scroll! Found on the hunt.` });
        }
      }

      // ── AGILITY LAP BONUS ──────────────────────────────────────
      if (skillId === 'agility') {
        const lapBonus = action.lapBonus || 0;
        if (lapBonus > 0) {
          const mastLv = this.getMasteryLevel('agility', action.masteryId || action.id);
          const bonusMult = 1 + mastLv * 0.01;
          const bonusXp = Math.floor(lapBonus * bonusMult);
          this.addXp('agility', bonusXp);
          this.emit('notification', { type:'info', text:`Lap complete! +${bonusXp} bonus Agility XP` });
        }
      }
    } else if (skill.type === 'artisan' || skillId === 'summoning') {
      if (action.input && !this.hasItems(action.input)) { this.stopSkill(); this.emit('notification', { type:'warn', text:'Out of materials.' }); return; }
      if (action.input) this.removeItems(action.input);
      if (action.burnChance) {
        const masteryReduce = this.getMasteryLevel(skillId, action.id) * 0.005;
        const levelReduce   = Math.max(0, (this.state.skills[skillId]?.level || 1) - (action.level || 1)) * 0.004;
        const petReduce     = (this.getPetBonus('burnReduction') || 0) / 100;
        const finalChance   = Math.max(0, action.burnChance - masteryReduce - levelReduce - petReduce);
        if (Math.random() < finalChance) {
          this.addXp(skillId, Math.floor(action.xp * 0.2));
          this.emit('notification', { type:'warn', text:`Burned the ${action.name.replace('Cook ','')}!` });
          this.incrementStat(skillId); return;
        }
      }
      this.addItem(action.output.item, action.output.qty);
      // Incantation Crafting rune multiplier
      if (skillId === 'incantation' && action.altar && GAME_DATA.runeMultipliers) {
        const altar = GAME_DATA.altars?.find(a => a.id === action.altar);
        if (altar) {
          const lvAbove = this.state.skills.incantation.level - altar.level;
          let mult = 1;
          for (const t of GAME_DATA.runeMultipliers) { if (lvAbove >= t.levelsAbove) mult = t.mult; }
          if (mult > 1) {
            const bonus = action.output.qty * (mult - 1);
            this.addItem(action.output.item, bonus);
          }
        }
      }
      this.state.stats.itemsCrafted++;
      this.trackQuestProgress('craft', { item:action.output.item, qty:action.output.qty });
    } else if (skillId === 'thieving') {
      const thievLv   = this.state.skills.thieving.level;
      const mastReduce = this.getMasteryLevel(skillId, action.id) * 0.003;
      const stunRoll   = Math.random();
      const stunChance = Math.max(0.03, action.stunChance - mastReduce - (thievLv * 0.001));

      if (stunRoll < stunChance) {
        // ── STUN: set negative progress (pause)
        this.state.actionProgress = -action.stunTime;

        // ── BLOW DAMAGE: stun hit deals HP damage
        // Formula: base 1–8 + target_level/10, scales with target anger level
        const angerMult = this._getThievingAnger(action.id);
        const baseDmg   = Math.max(1, Math.floor(Math.random() * 8 + action.level/10));
        const damage    = Math.floor(baseDmg * (1 + angerMult * 0.5));
        if (!this.state.thievingHp) this.state.thievingHp = this.getMaxHp();
        this.state.thievingHp = Math.max(0, this.state.thievingHp - damage);

        // Auto-eat from food bag if HP falls below 40%
        if (this.state.thievingHp < this.getMaxHp() * 0.40) {
          this._thievingAutoEat();
        }

        this.emit('thievingStun', { action, damage, angerMult, hp: this.state.thievingHp, maxHp: this.getMaxHp() });
        this.emit('notification', { type:'warn', text:`Stunned! ${action.name} hits you for ${damage} damage.` });

        // ── ANGER: accumulate anger on this target
        if (!this.state.thievingAnger) this.state.thievingAnger = {};
        this.state.thievingAnger[action.id] = Math.min(1.0, (this.state.thievingAnger[action.id] || 0) + 0.15);

        // ── DEATH CHECK
        if (this.state.thievingHp <= 0) {
          this.state.thievingHp = 1;
          this._thievingDeath();
          return;
        }

        // ── FIGHT TRIGGER: angry target may pull you into combat
        const fightChance = this._calcThievingFightChance(action);
        if (Math.random() < fightChance && !this.state.combat.active) {
          this._triggerThievingFight(action);
          return;
        }
        return;
      }

      // Successful pickpocket — reduce anger
      if (this.state.thievingAnger?.[action.id]) {
        this.state.thievingAnger[action.id] = Math.max(0, this.state.thievingAnger[action.id] - 0.03);
      }

      const gold = this.randInt(action.gold.min, action.gold.max);
      this.state.gold += gold; this.state.stats.goldEarned += gold;
      for (const drop of (action.loot || [])) {
        if (Math.random() < drop.chance) {
          this.addItem(drop.item, drop.qty);
          // Track loot drops as 'gather' so quest objectives like "collect 10 lockpicks" register
          this.trackQuestProgress('gather', { item: drop.item, qty: drop.qty });
        }
      }
      this.trackQuestProgress('thieve', { target:action.id, qty:1 });
      this.emit('thievingSuccess', { action, gold, hp: this.state.thievingHp || this.getMaxHp() });
    }
    this.addXp(skillId, action.xp);
    // ── SMITHING HEAT BONUS ──────────────────────────────────
    if (skillId === 'smithing' && GAME_DATA.smeltingHeat?.enabled) {
      const cfg = GAME_DATA.smeltingHeat;
      const heat = this.state._smithingHeat || 0;
      if (heat >= (cfg.bonusThreshold || 60)) {
        const bonus = Math.floor(action.xp * (cfg.bonusXpPct || 25) / 100);
        this.addXp('smithing', bonus);
        this.emit('xpGain', { skill:'smithing', amount:bonus, source:'heat' });
      }
      // Replenish heat on each completed action
      this.state._smithingHeat = Math.min(100, (this.state._smithingHeat || 0) + (cfg.heatPerAction || 80));
    }
    this.addMasteryXp(skillId, action.masteryId||action.id, action.xp);
    this.incrementStat(skillId);
    // v3: roll pet from skilling
    this.rollPetDrop(skillId);
  }

  // ── XP ─────────────────────────────────────────────────
  addXp(skillId, amount) {
    if (!this.state.skills[skillId]) return;
    amount = Math.floor(amount);
    const skill = GAME_DATA.skills[skillId];
    const align = GAME_DATA.alignments[this.state.alignment];
    if (align?.bonus) {
      if (align.bonus.gatherXp && skill?.type === 'gathering') amount = Math.floor(amount * (1 + align.bonus.gatherXp/100));
      if (align.bonus.diplomacyXp && skillId === 'diplomacy') amount = Math.floor(amount * (1 + align.bonus.diplomacyXp/100));
    }
    // Live server XP multiplier (admin-controlled)
    const xpMult = this._liveFlags?.xp_multiplier || 1;
    if (xpMult !== 1) amount = Math.floor(amount * xpMult);
    // 5% XP reduction for levels 10+ (slows mid-late game progression)
    if (this.state.skills[skillId].level >= 10) amount = Math.floor(amount * 0.95);
    // ── PRESTIGE XP BONUS ──────────────────────────────────
    const prestigeRank = this.state._prestigeRank || 0;
    if (prestigeRank > 0 && GAME_DATA.prestige?.ranks?.[prestigeRank - 1]) {
      const pBonus = GAME_DATA.prestige.ranks[prestigeRank - 1].bonuses.xpMult || 0;
      amount = Math.floor(amount * (1 + pBonus));
    }
    const before = this.state.skills[skillId].level;
    this.state.skills[skillId].xp += amount;
    this.state.stats.totalXpGained += amount;
    const table = GAME_DATA.xpTable;
    while (this.state.skills[skillId].level < 99 && this.state.skills[skillId].xp >= table[this.state.skills[skillId].level + 1]) {
      this.state.skills[skillId].level++;
    }
    if (this.state.skills[skillId].level > before) {
      this.emit('notification', { type:'levelup', text:`${GAME_DATA.skills[skillId].name} leveled up to ${this.state.skills[skillId].level}!` });
      this.emit('levelup', { skill:skillId, level:this.state.skills[skillId].level });
    }
  }

  getXpForLevel(level) { return GAME_DATA.xpTable[level] || 0; }

  getXpProgress(skillId) {
    const s = this.state.skills[skillId];
    if (!s || s.level >= 99) return 1;
    const cur = s.xp - this.getXpForLevel(s.level);
    const need = this.getXpForLevel(s.level + 1) - this.getXpForLevel(s.level);
    return Math.min(1, cur / need);
  }

  addMasteryXp(skillId, masteryId, baseXp) {
    if (!this.state.mastery[skillId]) this.state.mastery[skillId] = {};
    if (!this.state.mastery[skillId][masteryId]) this.state.mastery[skillId][masteryId] = { level:1, xp:0 };
    const m = this.state.mastery[skillId][masteryId];
    m.xp += Math.floor(baseXp * 0.5);
    const t = GAME_DATA.xpTable;
    while (m.level < 99 && m.xp >= t[m.level + 1]) m.level++;
  }

  getMasteryLevel(sId, mId) { return this.state.mastery[sId]?.[mId]?.level || 0; }

  // ── COMBAT ─────────────────────────────────────────────
  startCombat(areaId, monsterId) {
    this.stopSkill();
    if (areaId) {
      const area = GAME_DATA.combatAreas.find(a => a.id === areaId);
      if (!area) { this.emit('notification',{type:'warn',text:'Area not found.'}); return; }
      if (!area.monsters.includes(monsterId)) { this.emit('notification',{type:'warn',text:'Monster not in this area.'}); return; }
      if (this.getCombatLevel() < area.levelReq) { this.emit('notification', { type:'warn', text:`Requires combat level ${area.levelReq}.` }); return; }
    }
    const monster = GAME_DATA.monsters[monsterId];
    if (!monster) { this.emit('notification',{type:'warn',text:`Monster "${monsterId}" not found in game data.`}); return; }
    this._setupCombat(monster, monsterId);
    this.state.combat.area = areaId;
    this.state.combat._sessionLoot = {};
    this.state.combat._sessionKills = 0;
    this.state.combat._sessionDmg = { melee:0, ranged:0, magic:0, ability:0, burn:0, poison:0, bleed:0, total:0, taken:0, hits:0, misses:0, crits:0 };
    this.state.combat._sessionStartTime = Date.now();
    this.emit('combatStart', { area:areaId, monster:monsterId });
  }

  startDungeon(dungeonId) {
    this.stopSkill();
    const d = GAME_DATA.dungeons.find(x => x.id === dungeonId); if (!d) return;
    if (this.getCombatLevel() < d.levelReq) { this.emit('notification', { type:'warn', text:`Requires combat level ${d.levelReq}.` }); return; }
    const m = GAME_DATA.monsters[d.waves[0]];
    this._setupCombat(m, d.waves[0]);
    this.state.combat.dungeon = dungeonId;
    this.state.combat.dungeonWave = 0;
    this.emit('combatStart', { dungeon:dungeonId });
  }

  startWorldBoss(bossId) {
    this.stopSkill();
    const boss = GAME_DATA.worldBosses.find(b => b.id === bossId); if (!boss) return;
    const last = this.state.worldBossRespawns[bossId] || 0;
    const left = Math.max(0, (last + boss.respawn * 1000) - Date.now());
    if (left > 0) { this.emit('notification', { type:'warn', text:`World Boss respawns in ${Math.ceil(left/60000)} min.` }); return; }
    if (this.getCombatLevel() < boss.combatLevel - 20) { this.emit('notification', { type:'warn', text:`Combat level ${boss.combatLevel-20}+ recommended.` }); return; }
    this._setupCombat(boss, bossId);
    this.state.combat.worldBoss = bossId;
    this.emit('combatStart', { worldBoss:bossId });
  }

  _setupCombat(monster, monsterId) {
    const c = this.state.combat;
    c.active = true; c.area = null; c.dungeon = null; c.worldBoss = null;
    c.monster = monsterId; c.monsterHp = monster.hp;
    c.playerHp = this.getMaxHp();
    c.playerAttackTimer = 0; c.monsterAttackTimer = 0;
    c.statusEffects = { player:{}, monster:{} };
    c._multiMobMode = false;
    c._petAttackCounter = 0;
    c._permDebuffs = {};
    c._bossPhase = 0; c._enrageTimer = 0; c._enrageBonus = 0; // reset phase state
    if (this.state.multiMob) this.state.multiMob = null;
  }

  stopCombat() {
    const c = this.state.combat;
    c.active = false; c.area = null; c.monster = null; c.dungeon = null; c.worldBoss = null;
    c._isWilderness = false; c._pvpTriggered = false; c._isDuel = false; c._teleBlocked = 0;
    c._multiMob = false; c._requiresPrayer = false; c._pvpRealPlayer = null;
    c._multiMobMode = false;
    if (this.state.multiMob) this.state.multiMob = null;
    c._pvpArena = false; c._pvpOpponent = null;
    c.statusEffects = { player:{}, monster:{} };
    c.playerHp = this.getMaxHp();
    // Clear session loot so it doesn't persist into next session
    c._sessionLoot = {};
    c._sessionKills = 0;
    c._sessionDmg = { melee:0, ranged:0, magic:0, ability:0, burn:0, poison:0, bleed:0, total:0, taken:0, hits:0, misses:0, crits:0 };
    // Clear wilderness presence
    if (typeof online !== 'undefined' && online.isOnline) online.clearWildernessPresence();
    this.emit('combatStop');
  }

  tickCombat(dt) {
    const c = this.state.combat;
    if (!c.active || !c.monster) return;

    // ── MULTI-MOB MODE: delegate to dedicated tick ──────────
    if (c._multiMobMode && this.state.multiMob?.active) {
      this._tickStatusEffects(c.statusEffects.monster, dt, 'monster');
      this._tickStatusEffects(c.statusEffects.player,  dt, 'player');
      this.tickMultiMob(dt);
      return;
    }

    const isWB = !!c.worldBoss;
    const monster = isWB ? (GAME_DATA.worldBosses||[]).find(b=>b.id===c.monster) : GAME_DATA.monsters[c.monster];
    if (!monster) { this.stopCombat(); this.emit('notification',{type:'warn',text:'Combat ended: monster data unavailable.'}); return; }

    // ── BOSS PHASE SYSTEM ─────────────────────────────────────────
    if (isWB && GAME_DATA.bossPhases?.[c.monster]) {
      const phaseData = GAME_DATA.bossPhases[c.monster];
      const hpPct = c.monsterHp / monster.hp;
      if (!c._bossPhase) c._bossPhase = 0;
      if (!c._enrageTimer) c._enrageTimer = 0;
      // Check for phase trigger (check in descending threshold order)
      const phases = phaseData.phases || [];
      for (let i = phases.length - 1; i >= 0; i--) {
        const ph = phases[i];
        if (hpPct <= ph.hpThreshold && c._bossPhase <= i) {
          c._bossPhase = i + 1;
          this.emit('notification', { type: ph.enrage ? 'danger' : 'warn', text: ph.notify });
          if (ph.dot) this.applyStatus('player', ph.dot.type, ph.dot.stacks, ph.dot.duration);
          this.emit('bossPhase', { phase: i + 1, name: ph.name, boss: c.monster });
        }
      }
      // Enrage: boost max hit over time once past final phase threshold
      const finalPhase = phases[phases.length - 1];
      if (finalPhase && hpPct <= finalPhase.hpThreshold) {
        c._enrageTimer += dt;
        // +0.5% maxHit per second of enrage (capped at +50% extra)
        const enrageBonus = Math.min(0.50, c._enrageTimer * (phaseData.enrageDmgPerSec || 0.5) / 100);
        c._enrageBonus = enrageBonus;
      }
    }
    if (c.autoEat && c.playerHp < this.getMaxHp() * 0.4) this.eatFood();
    this._tickStatusEffects(c.statusEffects.monster, dt, 'monster');
    this._tickStatusEffects(c.statusEffects.player, dt, 'player');
    const playerSpeed = this.getPlayerAttackSpeed();
    c.playerAttackTimer += dt;
    if (c.playerAttackTimer >= playerSpeed) {
      c.playerAttackTimer -= playerSpeed;
      try {
        this.playerAttack(monster);
      } catch(err) {
        console.error('[Combat] playerAttack crashed:', err.message, err.stack?.split('\n')[1]);
        this.emit('notification', { type:'danger', text:'Combat error: ' + err.message.slice(0,60) });
      }
      this.drainPrayerPoints();
      this.doPetCombatAction(monster);
    }
    c.monsterAttackTimer += dt;
    let monsterSpeed = monster.attackSpeed * 0.7;
    // Freeze slows monster attack speed
    const mFreeze = c.statusEffects?.monster?.freeze;
    if (mFreeze && mFreeze.stacks > 0) monsterSpeed *= (1 + 0.10 * mFreeze.stacks);
    // Pet slow effect
    const mSlow = c.statusEffects?.monster?.slow;
    if (mSlow && mSlow.timer > 0) monsterSpeed *= (1 + (mSlow.amount||0.20));
    // Shock stun on monster
    const mShock = c.statusEffects?.monster?.shock;
    let monsterStunned = !!(c.statusEffects?.monster?.stun?.timer > 0);
    if (!monsterStunned && mShock && mShock.stacks > 0 && Math.random() < 0.05 * mShock.stacks) monsterStunned = true;
    if (c.monsterAttackTimer >= monsterSpeed && !monsterStunned) { c.monsterAttackTimer -= monsterSpeed; this.monsterAttack(monster); }
    // Auto-eat AFTER monster attack (critical - eat before death check)
    if (c.autoEat && c.playerHp > 0 && c.playerHp < this.getMaxHp() * 0.4) this.eatFood();

    // ── CANNON TICK ───────────────────────────────────────────────
    if (!c.cannon) c.cannon = { active:false, timer:0 };
    if (c.cannon.active) {
      c.cannon.timer += dt;
      const CANNON_SPEED = 3.0; // fires every 3 seconds
      if (c.cannon.timer >= CANNON_SPEED) {
        c.cannon.timer -= CANNON_SPEED;
        this.fireCannon(monster);
      }
    }

    if (c.monsterHp <= 0) this.onMonsterDeath(monster, isWB);
    if (c.playerHp <= 0) this.onPlayerDeath();
  }

  _tickStatusEffects(effects, dt, target) {
    for (const [key, fx] of Object.entries(effects)) {
      const def = GAME_DATA.statusEffects[key];
      if (!def) { delete effects[key]; continue; }

      // Decrement duration (used by stun, slow, shock — no damage)
      if (fx.timer !== undefined) {
        fx.timer -= dt;
        if (fx.timer <= 0) { delete effects[key]; }
        continue;
      }

      // Tick-based damage effects (burn, poison, bleed)
      fx.elapsed = (fx.elapsed || 0) + dt;
      if (fx.elapsed >= def.tick) {
        fx.elapsed = 0;
        if (def.baseDmg > 0) {
          let dmg = def.baseDmg * fx.stacks;
          if (key === 'burn') dmg = def.baseDmg * Math.pow(1.3, fx.stacks - 1);
          dmg = Math.floor(dmg);
          if (dmg > 0) {
            if (target === 'monster') {
              this.state.combat.monsterHp -= dmg;
              this.emit('combatHit', { who:'player', dmg, style:key, dot:true });
              // Track DoT damage in session + lifetime
              const sd = this.state.combat._sessionDmg;
              if (sd) { sd.total = (sd.total||0)+dmg; sd[key] = (sd[key]||0)+dmg; }
              if (!this.state.stats.dmg) this.state.stats.dmg = {};
              this.state.stats.dmg.total = (this.state.stats.dmg.total||0)+dmg;
              this.state.stats.dmg[key]  = (this.state.stats.dmg[key]||0)+dmg;
            } else {
              this.state.combat.playerHp -= dmg;
              this.emit('combatHit', { who:'monster', dmg, style:key, dot:true });
              const sd = this.state.combat._sessionDmg;
              if (sd) sd.taken = (sd.taken||0)+dmg;
              if (!this.state.stats.dmg) this.state.stats.dmg = {};
              this.state.stats.dmg.taken = (this.state.stats.dmg.taken||0)+dmg;
            }
          }
          if (key === 'poison' && fx.stacks >= def.explodeStacks) {
            const exDmg = def.explodeDmg;
            if (target === 'monster') {
              this.state.combat.monsterHp -= exDmg;
              this.emit('combatHit', { who:'player', dmg:exDmg, style:'poison', dot:true, crit:true });
              const sd = this.state.combat._sessionDmg;
              if (sd) { sd.total=(sd.total||0)+exDmg; sd.poison=(sd.poison||0)+exDmg; }
            } else {
              this.state.combat.playerHp -= exDmg;
              this.emit('combatHit', { who:'monster', dmg:exDmg, style:'poison', dot:true, crit:true });
              const sd = this.state.combat._sessionDmg;
              if (sd) sd.taken=(sd.taken||0)+exDmg;
            }
            delete effects[key]; continue;
          }
        }
        fx.duration -= def.tick;
        if (fx.duration <= 0) { delete effects[key]; }
      }
    }
  }

  applyStatus(target, type, stacks, duration = 8) {
    const e = target === 'monster' ? this.state.combat.statusEffects.monster : this.state.combat.statusEffects.player;
    const wasEmpty = !e[type] || e[type].stacks <= 0;
    if (!e[type]) e[type] = { stacks:0, duration:0, elapsed:0 };
    const def = GAME_DATA.statusEffectDefs?.[type] || GAME_DATA.statusEffects?.[type];
    const maxStacks = def?.maxStacks || 10;
    const prevStacks = e[type].stacks || 0;
    e[type].stacks = Math.min(prevStacks + stacks, maxStacks);
    e[type].duration = Math.max(e[type].duration, duration);
    // Only notify when: first application, or significant stack increase (every 2+)
    const added = e[type].stacks - prevStacks;
    if (added > 0 && (wasEmpty || added >= 2)) {
      const who = target === 'player' ? 'You' : 'Enemy';
      const name = def?.name || type;
      this.emit('notification', { type: target === 'player' ? 'danger' : 'info', text: `${who}: ${name} x${e[type].stacks}` });
    }
  }

  playerAttack(monster) {
    const style = this.state.combat.combatStyle;
    let accuracy, maxHit;
    const pAtkB = this.getPrayerBonus('attackBonus');
    const pStrB = this.getPrayerBonus('strengthBonus');
    const pRngB = this.getPrayerBonus('rangedBonus');
    const pMagB = this.getPrayerBonus('magicBonus');

    if (style === 'melee') {
      const aL = Math.floor(this.state.skills.attack.level * (1 + pAtkB/100));
      const sL = Math.floor(this.state.skills.strength.level * (1 + pStrB/100));
      const aB = this.getStatTotal('attackBonus'), sB = this.getStatTotal('strengthBonus');
      // Accuracy: effective level * (bonus + 64) - determines hit chance
      accuracy = (aL + 8) * (aB + 64);
      // Max hit: base (1 + str/10) + weapon bonus scaling
      // At lv99 str, +90 bonus = 10.9 * (1 + 90/80) = 10.9 * 2.125 = ~23, then * 4 = 92
      maxHit = Math.floor((1 + sL / 10) * (1 + sB / 80) * 4);
    } else if (style === 'ranged') {
      const rL = Math.floor(this.state.skills.ranged.level * (1 + pRngB/100));
      const rB = this.getStatTotal('rangedBonus') + this.getAmmoBonus();
      // Validate: must have ammo equipped for bow-style ranged
      const weapon = this.getEquippedItem('weapon');
      const ammoId = this.state.equipment.ammo;
      const ammoItem = ammoId ? GAME_DATA.items[ammoId] : null;
      if (weapon && weapon.ammoType === 'arrow' && (!ammoItem || ammoItem.ammoType !== 'arrow')) {
        this.emit('notification', { type:'warn', text:'You need arrows to use this bow! Equip arrows in the Ammo slot.' });
        this.stopCombat();
        return;
      }
      accuracy = (rL + 8) * (rB + 64);
      maxHit = Math.floor((1 + rL / 10) * (1 + rB / 80) * 4);
      this.consumeAmmo();
    } else {
      const mL = Math.floor(this.state.skills.magic.level * (1 + pMagB/100));
      const mB = this.getStatTotal('magicBonus');
      const spell = this.getActiveSpell();
      accuracy = (mL + 8) * (mB + 64);
      // Magic: spell base + scaling from magic bonus + level
      maxHit = spell ? Math.floor(spell.maxHit * (1 + mB / 100) + mL * 0.3) : Math.floor(mL * 0.5 + mB * 0.3);
      if (spell && !this.consumeRunes(spell)) { this.emit('notification', { type:'warn', text:'Out of runes!' }); this.stopCombat(); return; }
    }
    maxHit = Math.max(maxHit, 1);

    // Alignment bonuses
    const align = GAME_DATA.alignments[this.state.alignment];
    if (align?.bonus?.globalDmg) maxHit = Math.floor(maxHit * (1 + align.bonus.globalDmg/100));
    if (align?.bonus?.strengthDmg && style === 'melee') maxHit = Math.floor(maxHit * (1 + align.bonus.strengthDmg/100));
    // Pet stat bonuses (accuracyMult, damageMult)
    const petAccMult = this.getPetBonus('accuracyMult');
    if (petAccMult > 1) accuracy = Math.floor(accuracy * petAccMult);
    const petDmgMult = this.getPetBonus('damageMult');
    if (petDmgMult > 1) maxHit = Math.floor(maxHit * petDmgMult);
    const petCombatDmg = this.getPetBonus('combatDmg');
    if (petCombatDmg > 0) maxHit = Math.floor(maxHit * (1 + petCombatDmg/100));
    const petMagicDmg = this.getPetBonus('magicDmg');
    if (petMagicDmg > 0 && style === 'magic') maxHit = Math.floor(maxHit * (1 + petMagicDmg/100));
    // Active buffs (War Cry, Power Strike, etc)
    for (const buff of this.state.combat.activeBuffs) {
      if (buff.stat === 'damageMult') maxHit = Math.floor(maxHit * buff.value);
    }

    // ── WEAPON AFFIX BONUSES ──
    const weapon = this.getEquippedItem('weapon');
    const affixData = this.state._affixedItems?.[this.state.equipment?.weapon];
    let affixFlatDmg = 0, affixDmgBonus = 0, affixCritBonus = 0, affixAtkSpeed = 0, affixLifesteal = 0;
    if (affixData?.effects) {
      const fx = affixData.effects;
      if (fx.flatDmg) affixFlatDmg = fx.flatDmg;
      if (fx.dmgBonus) affixDmgBonus = fx.dmgBonus;
      if (fx.critDmgBonus) affixCritBonus = fx.critDmgBonus;
      if (fx.lifesteal) affixLifesteal = fx.lifesteal;
      if (fx.bossDmgBonus && (monster.tags?.includes('boss') || this.state.combat.worldBoss)) {
        maxHit = Math.floor(maxHit * (1 + fx.bossDmgBonus));
      }
    }
    maxHit = Math.floor((maxHit + affixFlatDmg) * (1 + affixDmgBonus));

    // ── MONSTER WEAKNESS BONUS ────────────────────────────────────
    const weakness = GAME_DATA.monsterWeaknesses?.[this.state.combat.monster];
    if (weakness && weakness.weak === style) {
      maxHit = Math.floor(maxHit * (1 + weakness.bonus / 100));
    }

    // Hit chance calculation
    const evasion = monster.evasion?.[style] || 0;
    const defence = (monster.combatLevel + 8) * (evasion + 64);
    const hitChance = Math.min(0.95, Math.max(0.05, accuracy / (accuracy + defence)));

    if (Math.random() < hitChance) {
      let dmg = this.randInt(Math.floor(maxHit * 0.1), maxHit); // min 10% of max, not 1

      // Critical hit: 5% base + 1% per 10 levels above monster
      const levelAdv = Math.max(0, this.getCombatLevel() - monster.combatLevel);
      const critChance = Math.min(0.30, 0.05 + levelAdv * 0.01);
      let isCrit = false;
      if (Math.random() < critChance) {
        const critMult = 1.5 + affixCritBonus;
        dmg = Math.floor(dmg * critMult);
        isCrit = true;
      }

      // Radiant buff: +50% next hit
      const radiant = this.state.combat.statusEffects?.player?.radiant;
      if (radiant && radiant.stacks > 0) {
        dmg = Math.floor(dmg * 1.5);
        delete this.state.combat.statusEffects.player.radiant;
      }

      // Freeze bonus (shatter)
      const fz = this.state.combat.statusEffects.monster.freeze;
      if (fz) { dmg = Math.floor(dmg * 2.5); delete this.state.combat.statusEffects.monster.freeze; }

      this.state.combat.monsterHp -= dmg;

      // Magic spell effects (status + lifesteal)
      if (style === 'magic') {
        const sp = this.getActiveSpell();
        if (sp?.statusChance) {
          for (const [fx, ch] of Object.entries(sp.statusChance)) {
            if (Math.random() < ch) this.applyStatus('monster', fx, 1, 8);
          }
        }
        if (sp?.lifesteal) {
          const healed = Math.floor(dmg * sp.lifesteal);
          this.state.combat.playerHp = Math.min(this.getMaxHp(), this.state.combat.playerHp + healed);
        }
      }

      // ── WEAPON AFFIX STATUS EFFECTS ──
      if (affixData?.effects) {
        const fx = affixData.effects;
        if (fx.status && Math.random() < (fx.chance || 0.15)) {
          this.applyStatus('monster', fx.status, fx.stacks || 1, 6);
        }
        // Lifesteal from affix
        if (fx.lifesteal && fx.lifesteal > 0) {
          const healed = Math.floor(dmg * fx.lifesteal);
          this.state.combat.playerHp = Math.min(this.getMaxHp(), this.state.combat.playerHp + healed);
        }
        // Gold bonus from affix
        if (fx.goldBonus) {
          const bonusGold = Math.floor(Math.random() * (monster.gold?.max || 10) * fx.goldBonus);
          if (bonusGold > 0) { this.state.gold += bonusGold; this.state.stats.goldEarned += bonusGold; }
        }
      }

      // Track last hit for bleed calculations
      this.state.combat._lastPlayerHit = dmg;

      // ── SESSION + LIFETIME DAMAGE TRACKING ──
      const sd = this.state.combat._sessionDmg || (this.state.combat._sessionDmg = { melee:0, ranged:0, magic:0, ability:0, burn:0, poison:0, bleed:0, total:0, taken:0, hits:0, misses:0, crits:0 });
      sd[style] = (sd[style] || 0) + dmg;
      sd.total  = (sd.total  || 0) + dmg;
      sd.hits   = (sd.hits   || 0) + 1;
      if (isCrit) sd.crits = (sd.crits || 0) + 1;
      // Lifetime
      if (!this.state.stats.dmg) this.state.stats.dmg = { melee:0, ranged:0, magic:0, ability:0, total:0, taken:0 };
      this.state.stats.dmg[style] = (this.state.stats.dmg[style] || 0) + dmg;
      this.state.stats.dmg.total  = (this.state.stats.dmg.total  || 0) + dmg;

      this.emit('combatHit', { who:'player', dmg, crit:isCrit, style });
      // Track highest hit
      if (!this.state.stats.highestHit || dmg > this.state.stats.highestHit) this.state.stats.highestHit = dmg;
    } else {
      const sd2 = this.state.combat._sessionDmg || (this.state.combat._sessionDmg = { melee:0, ranged:0, magic:0, ability:0, burn:0, poison:0, bleed:0, total:0, taken:0, hits:0, misses:0, crits:0 });
      sd2.misses = (sd2.misses || 0) + 1;
      this.emit('combatHit', { who:'player', dmg:0, miss:true, style });
    }
    // Familiar heal-over-time
    const famHeal = this.getFamiliarBonus('healOverTime');
    if (famHeal > 0) {
      this.state.combat.playerHp = Math.min(this.getMaxHp(), this.state.combat.playerHp + famHeal);
    }
    // Familiar damageMult applied in maxHit calc via activeBuffs already
    // Regen spec energy (10% per attack)
    if (this.state.specEnergy < 100) {
      this.state.specEnergy = Math.min(100, (this.state.specEnergy||0) + (GAME_DATA.specRegenRate || 10));
    }
  }

  // ── SPECIAL ATTACK ─────────────────────────────────────
  useSpecialAttack() {
    const c = this.state.combat;
    if (!c.active || !c.monster) return;
    const weapon = this.getEquippedItem('weapon');
    if (!weapon?.specCost || !weapon.specEffect) {
      this.emit('notification',{type:'warn',text:'Your weapon has no special attack.'}); return;
    }
    if ((this.state.specEnergy||0) < weapon.specCost) {
      this.emit('notification',{type:'warn',text:`Need ${weapon.specCost}% spec energy. Have ${this.state.specEnergy||0}%.`}); return;
    }
    // Consume spec energy
    this.state.specEnergy -= weapon.specCost;

    const monster = GAME_DATA.monsters[c.monster] || GAME_DATA.worldBosses.find(b=>b.id===c.monster);
    if (!monster) return;
    const spec = weapon.specEffect;
    const style = c.combatStyle;

    // Calculate base max hit
    const sL = this.state.skills.strength.level;
    const sB = this.getStatTotal('strengthBonus');
    let baseMaxHit = Math.floor((1 + sL / 10) * (1 + sB / 80) * 4);

    // Apply spec multiplier
    const specMaxHit = Math.floor(baseMaxHit * (spec.mult || 1.0));

    // Execute spec based on type
    if (spec.type === 'doubleHit') {
      // Two rapid hits
      for (let i = 0; i < 2; i++) {
        let dmg = this.randInt(Math.floor(specMaxHit * 0.1), specMaxHit);
        c.monsterHp -= dmg;
        this.emit('combatHit', { who:'player', dmg, crit:true }); // show as crit-style
      }
      if (spec.poisonChance && Math.random() < spec.poisonChance) {
        this.applyStatus('monster', 'poison', 2, 10);
      }
    } else if (spec.type === 'doubleShot') {
      const rB = this.getStatTotal('rangedBonus') + this.getAmmoBonus();
      const rMaxHit = Math.floor((1 + this.state.skills.ranged.level / 10) * (1 + rB / 80) * 4 * spec.mult);
      for (let i = 0; i < 2; i++) {
        let dmg = this.randInt(Math.floor(rMaxHit * 0.2), rMaxHit);
        c.monsterHp -= dmg;
        this.emit('combatHit', { who:'player', dmg, crit:true });
      }
      this.consumeAmmo(); this.consumeAmmo();
    } else if (spec.type === 'armorPierce' || spec.type === 'piercing') {
      // Ignore defence percentage
      let dmg = this.randInt(Math.floor(specMaxHit * 0.3), specMaxHit);
      c.monsterHp -= dmg;
      this.emit('combatHit', { who:'player', dmg, crit:true });
    } else if (spec.type === 'burnStrike') {
      let dmg = this.randInt(Math.floor(specMaxHit * 0.2), specMaxHit);
      c.monsterHp -= dmg;
      this.emit('combatHit', { who:'player', dmg, crit:true });
      this.applyStatus('monster', 'burn', spec.burnStacks || 2, 12);
    } else if (spec.type === 'energyDrain') {
      let dmg = this.randInt(Math.floor(specMaxHit * 0.3), specMaxHit);
      const drain = Math.floor(c.monsterHp * (spec.drainPct || 10) / 100);
      dmg += drain;
      c.monsterHp -= dmg;
      this.emit('combatHit', { who:'player', dmg, crit:true });
    } else if (spec.type === 'execute') {
      let dmg = this.randInt(Math.floor(specMaxHit * 0.5), specMaxHit);
      c.monsterHp -= dmg;
      // Heal percentage of damage
      const heal = Math.floor(dmg * (spec.healPct || 50) / 100);
      c.playerHp = Math.min(this.getMaxHp(), c.playerHp + heal);
      this.emit('combatHit', { who:'player', dmg, crit:true });
      this.emit('notification',{type:'info',text:`Healed ${heal} HP from Voidreaper!`});
    } else if (spec.type === 'instaSmash') {
      // Granite Maul - ignore partial def
      let dmg = this.randInt(Math.floor(specMaxHit * 0.3), specMaxHit);
      c.monsterHp -= dmg;
      this.emit('combatHit', { who:'player', dmg, crit:true });
      this.emit('notification',{type:'info',text:`Granite Maul smashes! ${dmg} damage.`});
    } else if (spec.type === 'holyStrike') {
      // Saradomin Sword - hit + heal
      let dmg = this.randInt(Math.floor(specMaxHit * 0.2), specMaxHit);
      c.monsterHp -= dmg;
      const heal = Math.floor(dmg * (spec.healPct||20) / 100);
      c.playerHp = Math.min(this.getMaxHp(), c.playerHp + heal);
      this.emit('combatHit', { who:'player', dmg, crit:true });
      this.emit('notification',{type:'info',text:`Holy Strike! ${dmg} dmg, healed ${heal} HP.`});
    } else if (spec.type === 'warcry') {
      // Bandos Godsword - hit + permanent defence reduction
      let dmg = this.randInt(Math.floor(specMaxHit * 0.2), specMaxHit);
      c.monsterHp -= dmg;
      if (!c._permDebuffs) c._permDebuffs = {};
      c._permDebuffs.defenceReduction = (c._permDebuffs.defenceReduction||0) + (spec.defReduce||10);
      this.emit('combatHit', { who:'player', dmg, crit:true });
      this.emit('notification',{type:'info',text:`War Cry! ${dmg} dmg. Target defence -${c._permDebuffs.defenceReduction} total.`});
    } else if (spec.type === 'dragonFury') {
      // Dragonite Greataxe - big hit + many burns + pierce
      let dmg = this.randInt(Math.floor(specMaxHit * 0.3), specMaxHit);
      c.monsterHp -= dmg;
      this.applyStatus('monster', 'burn', spec.burnStacks||5, 20);
      this.emit('combatHit', { who:'player', dmg, crit:true });
      this.emit('notification',{type:'achievement',text:`Dragon Fury! ${dmg} damage + ${spec.burnStacks||5} burn stacks!`});
    } else if (spec.type === 'infernoSlam') {
      // Overlord's Greatblade
      let dmg = this.randInt(Math.floor(specMaxHit * 0.3), specMaxHit);
      c.monsterHp -= dmg;
      this.applyStatus('monster', 'burn', spec.burnStacks||8, 25);
      this.emit('combatHit', { who:'player', dmg, crit:true });
      this.emit('notification',{type:'achievement',text:`Inferno Slam! ${dmg} damage + ${spec.burnStacks||8} burn stacks!`});
    } else if (spec.type === 'rapidFire') {
      // Magic Shortbow - 3 rapid shots
      const rB = this.getStatTotal('rangedBonus') + this.getAmmoBonus();
      const rMaxHit = Math.floor((1 + this.state.skills.ranged.level / 10) * (1 + rB / 80) * 4);
      for (let i = 0; i < 3; i++) {
        let dmg = this.randInt(Math.floor(rMaxHit * 0.15), rMaxHit);
        c.monsterHp -= dmg;
        this.emit('combatHit', { who:'player', dmg, crit:i===0 });
        this.consumeAmmo();
      }
      this.emit('notification',{type:'info',text:'Rapid Fire — 3 arrows!'});
    } else if (spec.type === 'voidShot') {
      // Zaryte Crossbow
      const rB = this.getStatTotal('rangedBonus') + this.getAmmoBonus();
      const rMaxHit = Math.floor((1 + this.state.skills.ranged.level / 10) * (1 + rB / 80) * 4 * (spec.mult||1.5));
      let dmg = this.randInt(Math.floor(rMaxHit * 0.3), rMaxHit);
      c.monsterHp -= dmg;
      if (Math.random() < (spec.poisonChance||0.8)) this.applyStatus('monster','poison',3,12);
      this.emit('combatHit', { who:'player', dmg, crit:true });
      this.consumeAmmo();
    } else if (spec.type === 'manaFlood') {
      // Master Wand
      const mB = this.getStatTotal('magicBonus');
      const mMaxHit = Math.floor((this.state.skills.magic.level * 0.3 + mB * 0.5) * (spec.mult||1.3));
      let dmg = this.randInt(Math.floor(mMaxHit * 0.2), mMaxHit);
      c.monsterHp -= dmg;
      this.emit('combatHit', { who:'player', dmg, crit:true });
    } else if (spec.type === 'venomCoat') {
      // Toxic Trident - guaranteed heavy poison
      this.applyStatus('monster', 'poison', spec.poisonStacks||4, 20);
      this.emit('notification',{type:'info',text:`Toxic Trident: ${spec.poisonStacks||4}-stack venom applied!`});
    } else if (spec.type === 'bloodSurge') {
      // Sanguinesti
      const mB = this.getStatTotal('magicBonus');
      const mMaxHit = Math.floor((this.state.skills.magic.level * 0.3 + mB * 0.5) * (spec.mult||1.4));
      let dmg = this.randInt(Math.floor(mMaxHit * 0.3), mMaxHit);
      c.monsterHp -= dmg;
      const heal = Math.floor(dmg * (spec.healPct||30)/100);
      c.playerHp = Math.min(this.getMaxHp(), c.playerHp + heal);
      this.emit('combatHit', { who:'player', dmg, crit:true });
      this.emit('notification',{type:'info',text:`Blood Surge: ${dmg} dmg, healed ${heal} HP!`});
    } else if (spec.type === 'realityRend') {
      // Void Emperor's Staff - full spec ignores all defence
      const mB = this.getStatTotal('magicBonus');
      const mMaxHit = Math.floor((this.state.skills.magic.level * 0.3 + mB * 0.5) * 3.0);
      let dmg = this.randInt(Math.floor(mMaxHit * 0.5), mMaxHit);
      c.monsterHp -= dmg;
      this.emit('combatHit', { who:'player', dmg, crit:true });
      this.emit('notification',{type:'achievement',text:`Reality Rend — ${dmg} void damage, all defence ignored!`});
    } else if (spec.type === 'magicShield') {
      c.activeBuffs.push({ stat:'damageReduction', value:spec.reduceDmg, remaining:spec.duration*2 });
      this.emit('notification',{type:'success',text:`Magic shield active! -${spec.reduceDmg}% damage for ${spec.duration} attacks.`});
    } else if (spec.type === 'runeRecovery') {
      c.activeBuffs.push({ stat:'runeRecovery', value:spec.chance, remaining:30 });
      this.emit('notification',{type:'success',text:`Rune recovery active! ${(spec.chance*100).toFixed(0)}% chance to save runes.`});
    }

    this.emit('notification',{type:'achievement',text:`SPECIAL ATTACK! (${this.state.specEnergy}% energy left)`});
  }

  monsterAttack(monster) {
    const dL = Math.floor(this.state.skills.defence.level * (1 + this.getPrayerBonus('defenceBonus')/100));
    let dB = this.getStatTotal('defenceBonus');
    const dr = this.getStatTotal('damageReduction');

    // Curse reduces defence
    const curseFx = this.state.combat.statusEffects?.player?.curse;
    if (curseFx && curseFx.stacks > 0) {
      dB = Math.floor(dB * (1 - 0.05 * curseFx.stacks));
    }

    // Shadow Step dodge charges (consume before dodge chance calc)
    const dodgeBuff = this.state.combat.activeBuffs.find(b => b.stat === 'dodgeCharges');
    if (dodgeBuff && dodgeBuff.value > 0) {
      dodgeBuff.value--;
      if (dodgeBuff.value <= 0) this.state.combat.activeBuffs = this.state.combat.activeBuffs.filter(b => b !== dodgeBuff);
      this.emit('combatHit', { who:'monster', dmg:0, miss:true, dodge:true });
      this.emit('notification', { type:'info', text:'Shadow Step — attack dodged!' });
      return;
    }

    // Dodge chance (passive agility — level provides passive bonus)
    const agilLv = this.state.skills.agility?.level || 0;
    const agilPassive = agilLv > 0 ? agilLv * 0.001 : 0; // 0.1% per agility level, up to 9.9% at 99
    const dodgeChance = (GAME_DATA.combatFormulas?.dodgeChance
      ? GAME_DATA.combatFormulas.dodgeChance(dL, this.getStatTotal('agilityBonus') || 0)
      : 0) + agilPassive;
    if (Math.random() < dodgeChance) {
      this.emit('combatHit', { who:'monster', dmg:0, miss:true, dodge:true });
      return;
    }

    const ev = (dL + 8) * (dB + 64);
    const ac = (monster.combatLevel + 8) * 64;
    const ch = Math.min(0.95, Math.max(0.05, ac / (ac + ev)));
    if (Math.random() < ch) {
      let dmg = this.randInt(1, monster.maxHit);
      // Boss enrage multiplier
      const enrageBonus = this.state.combat._enrageBonus || 0;
      if (enrageBonus > 0) dmg = Math.floor(dmg * (1 + enrageBonus));
      // Boss phase attack multiplier
      if (this.state.combat._bossPhase > 0 && GAME_DATA.bossPhases?.[this.state.combat.monster]) {
        const phases = GAME_DATA.bossPhases[this.state.combat.monster].phases;
        const phase = phases[this.state.combat._bossPhase - 1];
        if (phase) dmg = Math.floor(dmg * (phase.attackMult || 1));
      }
      dmg = Math.max(1, Math.floor(dmg * (100 - dr) / 100));
      // Prayer protection
      const protMelee = this.getPrayerBonus('protectMelee');
      const protRanged = this.getPrayerBonus('protectRanged');
      const protMagic = this.getPrayerBonus('protectMagic');
      if (monster.style === 'melee' && protMelee) dmg = Math.max(1, Math.floor(dmg * (100 - protMelee) / 100));
      if (monster.style === 'ranged' && protRanged) dmg = Math.max(1, Math.floor(dmg * (100 - protRanged) / 100));
      if (monster.style === 'magic' && protMagic) dmg = Math.max(1, Math.floor(dmg * (100 - protMagic) / 100));
      // Multi-mob penalty: +50% damage if 3+ mobs and NO prayer active
      if (this.state.combat._requiresPrayer && (!this.state.activePrayers || this.state.activePrayers.length === 0)) {
        dmg = Math.floor(dmg * 1.5);
      }
      // Multi-mob: each mob attacks (simulate multiple hits)
      if (monster._multiMob && monster._mobCount > 1) {
        // Additional hits from extra mobs (reduced damage)
        for (let i = 1; i < monster._mobCount; i++) {
          const extraDmg = Math.max(1, Math.floor(this.randInt(1, Math.floor(monster.maxHit * 0.6)) * (100 - dr) / 100));
          this.state.combat.playerHp -= extraDmg;
          this.emit('combatHit', { who:'monster', dmg:extraDmg });
        }
      }
      this.state.combat.playerHp -= dmg;
      this.emit('combatHit', { who:'monster', dmg });

      // Track damage taken
      const sdT = this.state.combat._sessionDmg || (this.state.combat._sessionDmg = { melee:0, ranged:0, magic:0, ability:0, burn:0, poison:0, bleed:0, total:0, taken:0, hits:0, misses:0, crits:0 });
      sdT.taken = (sdT.taken || 0) + dmg;
      if (!this.state.stats.dmg) this.state.stats.dmg = { melee:0, ranged:0, magic:0, ability:0, total:0, taken:0 };
      this.state.stats.dmg.taken = (this.state.stats.dmg.taken || 0) + dmg;

      // Vengeance: reflect damage back at monster
      const vengeBuff = this.state.combat.activeBuffs.find(b => b.stat === 'vengeance');
      if (vengeBuff) {
        const reflectDmg = Math.floor(dmg * vengeBuff.value);
        this.state.combat.monsterHp -= reflectDmg;
        this.state.combat.activeBuffs = this.state.combat.activeBuffs.filter(b => b !== vengeBuff);
        this.emit('combatHit', { who:'player', dmg:reflectDmg });
        this.emit('notification', { type:'success', text:`Vengeance! Reflected ${reflectDmg} damage!` });
      }

      // Monster special attacks - apply status effects based on monster type
      const mName = (monster.name || '').toLowerCase();
      if (mName.includes('dragon') || mName.includes('fire') || mName.includes('ember') || mName.includes('cerberus') || mName.includes('magma') || mName.includes('pyrelord')) {
        if (Math.random() < 0.25) this.applyStatus('player', 'burn', 1 + Math.floor(monster.combatLevel/30), 5);
      }
      if (mName.includes('spider') || mName.includes('scorpion') || mName.includes('venom')) {
        if (Math.random() < 0.30) this.applyStatus('player', 'poison', 1, 8);
      }
      if (mName.includes('ice') || mName.includes('frost') || mName.includes('frozen') || mName.includes('crystal')) {
        if (Math.random() < 0.20) this.applyStatus('player', 'freeze', 1, 4);
      }
      if (mName.includes('wolf') || mName.includes('hellhound') || mName.includes('bloodfang') || mName.includes('beast')) {
        if (Math.random() < 0.20) {
          this.applyStatus('player', 'bleed', 1, 3);
          this.state.combat._lastMonsterHit = dmg;
        }
      }
      if (mName.includes('mage') || mName.includes('wizard') || mName.includes('nechryael') || mName.includes('abyssal') || mName.includes('shadow') || mName.includes('horror')) {
        if (Math.random() < 0.15) this.applyStatus('player', 'curse', 1, 6);
      }
      if (mName.includes('kraken') || mName.includes('hydra') || mName.includes('corporeal')) {
        if (Math.random() < 0.20) this.applyStatus('player', 'shock', 1, 2);
      }
    } else {
      this.emit('combatHit', { who:'monster', dmg:0, miss:true });
    }
  }

  onMonsterDeath(monster, isWB) {
    const mId = this.state.combat.monster;
    this.state.stats.monstersKilled++;
    if (!this.state.stats.uniqueKills) this.state.stats.uniqueKills = {};
    this.state.stats.uniqueKills[mId] = (this.state.stats.uniqueKills[mId] || 0) + 1;

    const style = this.state.combat.combatStyle;
    const xpMode = this.state.combat.xpMode || 'controlled';
    const evilBonus = (GAME_DATA.alignments[this.state.alignment]?.bonus?.combatXpEvil && monster.alignment && monster.alignment.includes('E')) ? 1.15 : 1;
    const xp = Math.floor(monster.xp * evilBonus);
    // Distribute combat XP based on selected mode
    if (style === 'melee') {
      if (xpMode === 'accurate')        { this.addXp('attack', Math.floor(xp * 0.9)); this.addXp('defence', Math.floor(xp * 0.1)); }
      else if (xpMode === 'aggressive') { this.addXp('strength', Math.floor(xp * 0.9)); this.addXp('defence', Math.floor(xp * 0.1)); }
      else if (xpMode === 'defensive')  { this.addXp('defence', Math.floor(xp * 0.9)); this.addXp('attack', Math.floor(xp * 0.1)); }
      else /* controlled */             { this.addXp('attack', Math.floor(xp * 0.33)); this.addXp('strength', Math.floor(xp * 0.33)); this.addXp('defence', Math.floor(xp * 0.34)); }
    } else if (style === 'ranged') {
      if (xpMode === 'accurate')        { this.addXp('ranged', Math.floor(xp * 0.9)); this.addXp('defence', Math.floor(xp * 0.1)); }
      else if (xpMode === 'rapid')      { this.addXp('ranged', xp); }
      else /* longrange */              { this.addXp('ranged', Math.floor(xp * 0.5)); this.addXp('defence', Math.floor(xp * 0.5)); }
    } else {
      this.addXp('magic', Math.floor(xp * 0.8));
      this.addXp('defence', Math.floor(xp * 0.2));
    }
    this.addXp('hitpoints', Math.floor(xp * 0.33));
    // Passive Tactics XP from combat (small amount per kill, scaled by monster level)
    const tacticsXpFromKill = Math.max(1, Math.floor(xp * 0.05));
    this.addXp('tactics', tacticsXpFromKill);
    // Emit XP gain notification so player can SEE what they got
    const xpParts = [];
    if (style === 'melee') {
      if (xpMode === 'accurate')        xpParts.push(`+${Math.floor(xp*0.9)} Atk`);
      else if (xpMode === 'aggressive') xpParts.push(`+${Math.floor(xp*0.9)} Str`);
      else if (xpMode === 'defensive')  xpParts.push(`+${Math.floor(xp*0.9)} Def`);
      else { xpParts.push(`+${Math.floor(xp*0.33)} Atk`); xpParts.push(`+${Math.floor(xp*0.33)} Str`); xpParts.push(`+${Math.floor(xp*0.34)} Def`); }
    } else if (style === 'ranged') {
      if (xpMode === 'accurate')   xpParts.push(`+${Math.floor(xp*0.9)} Rng`, `+${Math.floor(xp*0.1)} Def`);
      else if (xpMode === 'rapid') xpParts.push(`+${xp} Rng`);
      else                         xpParts.push(`+${Math.floor(xp*0.5)} Rng`, `+${Math.floor(xp*0.5)} Def`);
    } else {
      xpParts.push(`+${Math.floor(xp*0.8)} Mag`);
    }
    xpParts.push(`+${Math.floor(xp*0.33)} HP`);
    this.emit('xpGain', { text: xpParts.join(', '), total: xp });

    // Alignment shifts from kills
    const mAlign = monster.alignment || 'NN';
    if (mAlign.includes('E')) this.shiftAlignment('good', 1);
    else if (mAlign.includes('G')) this.shiftAlignment('evil', 2);
    else if (mAlign === 'NN') this.shiftAlignment('chaotic', 1);

    // Wilderness PvP kill rewards
    if (this.state.combat._isWilderness && mId === 'pvp_opponent') {
      this.state.stats.pvpKills = (this.state.stats.pvpKills || 0) + 1;
      this.state.stats.pvpStreak = (this.state.stats.pvpStreak || 0) + 1;
      const streak = this.state.stats.pvpStreak;
      if (!this.state.stats.pvpBestStreak || streak > this.state.stats.pvpBestStreak) this.state.stats.pvpBestStreak = streak;
      this.shiftAlignment('evil', 5);
      this.shiftAlignment('chaotic', 3);
      if (streak >= 3) this.emit('notification',{type:'achievement',text:`PvP Streak: ${streak} kills!`});
      const killedName = this.state.combat._pvpRealPlayer || null;
      this.emit('pvpKill', { targetName: killedName, streak });
      if (typeof online !== 'undefined' && online.isOnline) {
        online.sendSystemMessage(`[PVP] ${online.displayName} killed a player in the Wilderness! (Streak: ${streak})`);
        if (killedName) online.checkBountiesOnKill(killedName);
      }
    }

    // PvP Arena victory
    if (this.state.combat._pvpArena && mId === 'pvp_arena_opponent') {
      const opp = this.state.combat._pvpOpponent;
      if (opp && typeof online !== 'undefined') {
        const goldReward = Math.floor(50 + (opp.combatLevel || 10) * 10);
        const ratingChange = Math.floor(15 + Math.max(0, (opp.pvpRating || 1000) - online.pvpRating) * 0.1);
        this.state.gold += goldReward;
        this.state.stats.goldEarned += goldReward;
        this.state.stats.pvpWins = (this.state.stats.pvpWins || 0) + 1;
        online.pvpRating = Math.max(0, online.pvpRating + ratingChange);
        this.emit('notification', { type:'achievement', text:`ARENA VICTORY vs ${opp.name}! +${goldReward}g, +${ratingChange} rating` });
        // Store result
        online.storePvPResult({ won:true, ratingChange, goldReward, opponentName:opp.name, opponentLevel:opp.combatLevel, opponentRating:opp.pvpRating }, opp);
        // Announce
        online.sendSystemMessage(`[ARENA] ${online.displayName} defeated ${opp.name} in the PvP Arena!`);
      }
    }

    let _goldEarned = 0;
    if (monster.gold) {
      let g = this.randInt(monster.gold.min, monster.gold.max);
      const al = GAME_DATA.alignments[this.state.alignment];
      if (al?.bonus?.goldDrop) g = Math.floor(g * (1 + al.bonus.goldDrop/100));
      this.state.gold += g; this.state.stats.goldEarned += g;
      _goldEarned = g;
    }

    const lootBonus = GAME_DATA.alignments[this.state.alignment]?.bonus?.lootQty || 0;
    const petLootBonus = this.getPetBonus('lootQty');
    const drops = monster.drops || monster.rewards || [];
    const _lootBag = []; // Track drops for loot bag display
    for (const drop of drops) {
      // Improved drop formula: base chance * (1 + loot bonuses) * luck scaling
      let ch = drop.chance * (1 + (lootBonus + petLootBonus) / 100);
      // Mastery/kill count luck: each 100 kills of this monster adds 0.5% to rare drops
      const killCount = (this.state.stats.uniqueKills?.[mId]) || 0;
      if (drop.chance < 0.10) ch *= (1 + Math.min(0.5, killCount * 0.005));
      // Slayer task bonus: +15% drop chance when on task
      if (this.state.slayerTask?.monster === mId) ch *= 1.15;
      // Slayer helm bonus
      if (this.state.equipment.head === 'slayer_helm' && this.state.slayerTask?.monster === mId) ch *= 1.10;

      if (Math.random() < ch) {
        let qty = drop.qty;
        // Quantity scaling for stackable resources
        if (qty > 1 && GAME_DATA.items[drop.item]?.type === 'resource') {
          qty = Math.floor(qty * (1 + lootBonus/100));
        }
        this.addItem(drop.item, qty);
        const _dItem = GAME_DATA.items[drop.item];
        const _dRarity = _dItem?.rarity || 'common';
        _lootBag.push({item:drop.item, qty, rarity:_dRarity});
        const _dRarityName = GAME_DATA.rarities?.[_dRarity]?.name || '';
        // Generate weapon affixes on drop
        if (_dItem?.slot === 'weapon' && typeof generateAffixedWeapon === 'function') {
          const affixed = generateAffixedWeapon(drop.item);
          if (affixed) {
            this.emit('notification', { type:'achievement', text:`Affixed Drop: ${affixed.name}!` });
            // Store affix data on player's copy
            if (!this.state._affixedItems) this.state._affixedItems = {};
            this.state._affixedItems[drop.item] = affixed;
          }
        }
        if (_dRarity === 'mythic' || _dRarity === 'legendary') {
          this.emit('notification', { type:'achievement', text:`${_dRarityName} DROP: ${_dItem?.name}!` });
        } else if (_dRarity === 'epic' || drop.chance < 0.03) {
          this.emit('notification', { type:'rare', text:`${_dRarityName} drop: ${_dItem?.name}!` });
        } else if (_dRarity === 'rare' || drop.chance < 0.08) {
          this.emit('notification', { type:'rare', text:`${_dRarityName}: ${_dItem?.name}!` });
        }
      }
    }
    // Universal Rare Drop Table (1/200 chance per kill, better monsters = better table)

    // ── MULTI-ROLL DROP TABLES ──
    // Each monster has rollTables: [{table:'gems', chance:0.10}, ...]
    // Each table is rolled independently per kill
    if (monster.rollTables && GAME_DATA.dropTables) {
      for (const roll of monster.rollTables) {
        if (Math.random() > roll.chance) continue;
        const table = GAME_DATA.dropTables[roll.table];
        if (!table || table.length === 0) continue;
        // Weighted random selection from table
        const totalWeight = table.reduce((s, e) => s + (e.weight || 1), 0);
        let rand = Math.random() * totalWeight;
        for (const entry of table) {
          rand -= entry.weight || 1;
          if (rand <= 0) {
            if (GAME_DATA.items[entry.item]) {
              const qty = entry.qty || 1;
              this.addItem(entry.item, qty);
              _lootBag.push({item:entry.item, qty, rarity:GAME_DATA.items[entry.item]?.rarity||'common'});
              const _it = GAME_DATA.items[entry.item];
              if (_it.rarity === 'rare' || _it.rarity === 'epic' || _it.rarity === 'legendary') {
                this.emit('notification', { type:'rare', text:`Drop table: ${_it.name} x${qty}!` });
              }
            }
            break;
          }
        }
      }
    }

    // Universal Rare Drop Table cont. (1/200 chance per kill, better monsters = better table)
    if (Math.random() < 0.005 * (1 + monster.combatLevel / 100)) {
      const rdt = this._rollRareDropTable(monster.combatLevel);
      if (rdt) {
        this.addItem(rdt.item, rdt.qty);
        this.emit('notification', { type:'achievement', text:`RARE DROP TABLE: ${GAME_DATA.items[rdt.item]?.name}!` });
      }
    }

    this.trackQuestProgress('kill', { monster:mId, qty:1 });
    // v3: Slayer, Pets, Magic kills
    this.trackSlayerKill(mId);
    this.rollPetDrop(mId);
    if (style === 'magic') this.state.stats.magicKills = (this.state.stats.magicKills || 0) + 1;
    this.trackQuestProgress('magic_kills', { qty: style === 'magic' ? 1 : 0 });
    // Skill level quest checks
    for (const sId of Object.keys(GAME_DATA.skills)) {
      this.trackQuestProgress('skill_level', { skill:sId, level:this.state.skills[sId]?.level||1 });
    }

    if (isWB) {
      const boss = GAME_DATA.worldBosses.find(b => b.id === mId);
      if (boss) {
        this.state.worldBossRespawns[mId] = Date.now();
        this.state.stats.worldBossKills++;
        this.emit('notification', { type:'success', text:`Defeated ${boss.name}! Respawns in ${boss.respawn/60} min.` });
        this.stopCombat(); return;
      }
    }

    // Emit loot bag for UI display
    if (_lootBag.length > 0) {
      this.state._lastLootBag = _lootBag;
      // Cumulative session loot tracker
      if (!this.state.combat._sessionLoot) this.state.combat._sessionLoot = {};
      if (!this.state.combat._sessionKills) this.state.combat._sessionKills = 0;
      this.state.combat._sessionKills++;
      // Contract bounty progress
      if (typeof online !== 'undefined' && online.isOnline) online.tickContractProgress('monster', mId, 1);
      for (const drop of _lootBag) {
        if (!this.state.combat._sessionLoot[drop.item]) {
          this.state.combat._sessionLoot[drop.item] = { qty:0, rarity:drop.rarity };
        }
        this.state.combat._sessionLoot[drop.item].qty += drop.qty;
      }
      // Add gold to session tracking
      if (_goldEarned > 0) {
        if (!this.state.combat._sessionLoot['_gold']) this.state.combat._sessionLoot['_gold'] = {qty:0, rarity:'common'};
        this.state.combat._sessionLoot['_gold'].qty += _goldEarned;
      }
      this.emit('lootDrop', { bag:_lootBag, monster:monster?.name || mId, sessionLoot:this.state.combat._sessionLoot, kills:this.state.combat._sessionKills });
    }

    if (this.state.combat.dungeon) {
      const d = GAME_DATA.dungeons.find(x => x.id === this.state.combat.dungeon);
      this.state.combat.dungeonWave++;
      if (this.state.combat.dungeonWave >= d.waves.length) {
        this.state.stats.dungeonsCompleted++;
        for (const r of d.rewards) {
          if (Math.random() < r.chance) {
            this.addItem(r.item, r.qty);
            this.emit('notification', { type:'rare', text:`Dungeon reward: ${GAME_DATA.items[r.item]?.name}!` });
          }
        }
        this.emit('notification', { type:'success', text:`Completed ${d.name}!` });
        this.trackQuestProgress('dungeon', { dungeon:d.id });
        this.stopCombat(); return;
      } else {
        const nextId = d.waves[this.state.combat.dungeonWave];
        const next = GAME_DATA.monsters[nextId];
        if (!next) { this.emit('notification',{type:'warn',text:'Dungeon error: missing monster data.'}); this.stopCombat(); return; }
        this.state.combat.monster = nextId;
        this.state.combat.monsterHp = next.hp;
        this.state.combat.monsterAttackTimer = 0;
        this.state.combat.statusEffects.monster = {};
        this.emit('notification',{type:'info',text:`Wave ${this.state.combat.dungeonWave+1}/${d.waves.length}: ${next.name}!`});
        this.emit('combatStart', { dungeon:this.state.combat.dungeon, wave:this.state.combat.dungeonWave });
      }
    } else {
      this.state.combat.monsterHp = monster.hp;
      this.state.combat.monsterAttackTimer = 0;
      this.state.combat.statusEffects.monster = {};
    }
    this.state.combat.playerAttackTimer = 0;
  }

  onPlayerDeath() {
    // Check for death-saving jewelry first
    for (const slot of ['ring','amulet']) {
      const itemId = this.state.equipment[slot];
      if (!itemId) continue;
      const item = GAME_DATA.items[itemId];
      if (item?.deathSave) {
        let totalXp = 0;
        for (const sk of Object.values(this.state.skills)) totalXp += sk.xp;
        const penalty = Math.floor(totalXp * 0.02);
        for (const [sId, sk] of Object.entries(this.state.skills)) {
          const share = totalXp > 0 ? sk.xp / totalXp : 0;
          sk.xp = Math.max(0, sk.xp - Math.floor(penalty * share));
          sk.level = Math.max(1, this.getLevelForXp(sk.xp));
        }
        this.state.equipment[slot] = null; // consumed
        this.state.combat.playerHp = itemId === 'phoenix_necklace' ? Math.floor(this.getMaxHp() * 0.3) : Math.floor(this.getMaxHp() * 0.1);
        this.emit('notification', { type:'danger', text:`${item.name} saved you! Lost 2% total XP (${penalty} XP). Item destroyed.` });
        return; // don't die
      }
    }

    this.state.stats.deaths = (this.state.stats.deaths || 0) + 1;

    // Wilderness PvP death
    if (this.state.combat._isWilderness) {
      this.state.stats.pvpDeaths = (this.state.stats.pvpDeaths || 0) + 1;
      this.state.stats.pvpStreak = 0;
      const lostGold = Math.floor(this.state.gold * 0.05);
      this.state.gold = Math.max(0, this.state.gold - lostGold);
      this.emit('notification', { type:'danger', text:`Killed in the Wilderness! Lost ${lostGold} gold.` });
      if (typeof online !== 'undefined' && online.isOnline) {
        online.sendSystemMessage(`[PVP] ${online.displayName} was slain in the Wilderness!`);
      }
    } else if (this.state.combat._pvpArena) {
      // PvP Arena defeat
      const opp = this.state.combat._pvpOpponent;
      if (opp && typeof online !== 'undefined') {
        const ratingChange = -10;
        online.pvpRating = Math.max(0, online.pvpRating + ratingChange);
        this.state.stats.pvpDeaths = (this.state.stats.pvpDeaths || 0) + 1;
        this.emit('notification', { type:'danger', text:`ARENA DEFEAT vs ${opp.name}. ${ratingChange} rating.` });
        online.storePvPResult({ won:false, ratingChange, goldReward:0, opponentName:opp.name, opponentLevel:opp.combatLevel, opponentRating:opp.pvpRating }, opp);
      }
    } else {
      this.emit('notification', { type:'danger', text:'You have been defeated!' });
    }
    this.stopCombat();
  }

  getLevelForXp(xp) {
    for (let l = 98; l >= 1; l--) {
      if (xp >= this.getXpForLevel(l)) return l;
    }
    return 1;
  }

  // Wilderness PvP - flee attempt (weighted by agility/defence)
  attemptFlee() {
    const c = this.state.combat;
    if (!c.active) return;
    if (c._isDuel) { this.emit('notification',{type:'warn',text:'Cannot flee from a duel!'}); return; }
    // Base 40% + defence/2 + agility bonus, capped at 80%
    const fleeChance = Math.min(0.80, 0.40 + this.state.skills.defence.level * 0.003 + (this.state.skills.hitpoints.level * 0.002));
    if (Math.random() < fleeChance) {
      this.emit('notification',{type:'success',text:'You escaped!'});
      this.stopCombat();
    } else {
      this.emit('notification',{type:'warn',text:`Failed to flee! (${(fleeChance*100).toFixed(0)}% chance)`});
    }
  }

  // TeleHome spell
  castTeleHome() {
    const c = this.state.combat;
    if (!c.active) return;
    if (c._isDuel) { this.emit('notification',{type:'warn',text:'Cannot teleport from a duel!'}); return; }
    if (c._teleBlocked > 0) { this.emit('notification',{type:'danger',text:`TeleBlocked! ${c._teleBlocked} rounds remaining.`}); return; }
    // Check runes
    if ((this.state.bank.fire_rune||0) < 3 || (this.state.bank.air_rune||0) < 5) {
      this.emit('notification',{type:'warn',text:'Need 3 Fire + 5 Air runes to TeleHome.'}); return;
    }
    this.state.bank.fire_rune -= 3;
    this.state.bank.air_rune -= 5;
    this.emit('notification',{type:'success',text:'TeleHome! You vanish in a flash of light.'});
    this.stopCombat();
  }

  // Start wilderness combat with real PvP presence checking
  async startWildernessCombat(zoneId, monsterId) {
    const zone = GAME_DATA.wildernessLevels.find(z=>z.id===zoneId);
    if (!zone) { this.emit('notification',{type:'warn',text:'Zone not found.'}); return; }
    const cb = this.getCombatLevel();
    if (cb < zone.minCb) { this.emit('notification',{type:'warn',text:`Need combat level ${zone.minCb}+`}); return; }

    // Set our presence in this zone (non-blocking)
    try {
      if (typeof online !== 'undefined' && online.isOnline) {
        online.setWildernessPresence(zoneId, monsterId);

        // Check for REAL players in the same zone fighting the same monster
        const others = await online.getPlayersInZone(zoneId);
        const sameMonster = others.filter(p => p.monster === monsterId);

        if (sameMonster.length > 0 && Math.random() < zone.pvpChance * 2) {
          const opponent = sameMonster[Math.floor(Math.random() * sameMonster.length)];
          this.emit('notification',{type:'danger',text:`${opponent.name} (Cb ${opponent.combatLevel}) attacks you in the Wilderness!`});
          const fakeMonster = {
            id:'pvp_opponent', name:opponent.name, hp: Math.floor(this.getMaxHp() * (0.7 + Math.random() * 0.5)),
            maxHit: Math.floor(opponent.combatLevel * 0.8 + 10),
            attackSpeed: 1.8 + Math.random() * 0.6, combatLevel: opponent.combatLevel,
            style: ['melee','ranged','magic'][Math.floor(Math.random()*3)],
            evasion:{melee:opponent.combatLevel,ranged:opponent.combatLevel,magic:opponent.combatLevel},
            xp: opponent.combatLevel * 50, gold:{min:50,max:opponent.combatLevel*10}, alignment:'CE',
            drops:[{item:'bones',qty:1,chance:1.0}]
          };
          GAME_DATA.monsters.pvp_opponent = fakeMonster;
          this.startCombat(null, 'pvp_opponent');
          this.state.combat._isWilderness = true;
          this.state.combat._pvpRealPlayer = opponent.name;
          return;
        }
      }
    } catch(e) { console.error('Wilderness online check failed:', e); }

    // Normal PvP chance (simulated opponent)
    if (Math.random() < zone.pvpChance) {
      this.emit('notification',{type:'danger',text:'A hostile player attacks you in the Wilderness!'});
      const fakeMonster = {
        id:'pvp_opponent', name:'Wilderness PKer', hp: Math.floor(this.getMaxHp() * 0.9),
        maxHit: Math.floor(this.state.skills.strength.level * 0.8),
        attackSpeed: 2.0, combatLevel: cb + Math.floor(Math.random()*10) - 5,
        style: ['melee','ranged','magic'][Math.floor(Math.random()*3)],
        evasion:{melee:cb,ranged:cb,magic:cb},
        xp: cb * 50, gold:{min:50,max:cb*10}, alignment:'CE',
        drops:[{item:'bones',qty:1,chance:1.0}]
      };
      GAME_DATA.monsters.pvp_opponent = fakeMonster;
      this.startCombat(null, 'pvp_opponent');
      this.state.combat._isWilderness = true;
      return;
    }

    this.startCombat(null, monsterId);
    this.state.combat._isWilderness = true;
  }

  // ── MULTI-MOB ENCOUNTERS ───────────────────────────────
  // Some areas/dungeons throw multiple mobs at you simultaneously
  // ── MULTI-MOB ENCOUNTER SYSTEM ─────────────────────────
  // Each mob has its own HP bar. Player targets one at a time.
  // ALL living mobs attack simultaneously each tick.
  // Inspired by Fight Cave — sequential targeting with full state tracking.
  startMultiMobCombat(mobIds) {
    this.stopSkill();
    if (!mobIds || mobIds.length === 0) return;
    if (this.state.combat.active) this.stopCombat();

    // Build encounter state
    const mmState = {
      active:    true,
      mobs:      [],       // full monster data per mob
      hp:        [],       // current HP per mob
      alive:     [],       // bool per mob
      targetIdx: 0,        // which mob player is currently hitting
      attackTimers: [],    // each mob's independent attack timer
      totalXp:   0,
      totalGold: 0,
    };

    const names = [];
    for (const mId of mobIds) {
      const m = GAME_DATA.monsters[mId];
      if (!m) continue;
      mmState.mobs.push({ ...m, _srcId: mId });
      mmState.hp.push(m.hp);
      mmState.alive.push(true);
      mmState.attackTimers.push(0);
      mmState.totalXp += m.xp || 0;
      const g = m.gold || {min:0,max:0};
      mmState.totalGold += this.randInt(g.min, g.max);
      names.push(m.name);
    }

    if (mmState.mobs.length === 0) return;

    // Store on state
    this.state.multiMob = mmState;

    // Set combat active with a proxy "lead" monster for the base combat loop
    // The lead monster is the current target
    const lead = mmState.mobs[0];
    this.stopSkill();
    this.state.combat.active   = true;
    this.state.combat.area     = null;
    this.state.combat.monster  = lead._srcId;
    this.state.combat.monsterHp= mmState.hp[0];
    this.state.combat.playerHp = this.state.combat.playerHp || this.getMaxHp();
    this.state.combat.playerAttackTimer  = 0;
    this.state.combat.monsterAttackTimer = 0;
    this.state.combat._multiMobMode = true;
    this.state.combat.statusEffects = { player:{}, monster:{} };

    const count = mmState.mobs.length;
    const req = count >= 3 ? 'PRAYERS REQUIRED.' : '';
    this.emit('notification', {type:'danger', text:`${count} enemies attack simultaneously! ${req}`});
    this.emit('combatStart', { monster: lead._srcId, multiMob: true });
    this.emit('multiMobStart', { mobs: mmState.mobs, names });
  }

  // Switch player attack target during multi-mob
  multiMobSetTarget(idx) {
    const mm = this.state.multiMob;
    if (!mm?.active || !mm.alive[idx]) return;
    mm.targetIdx = idx;
    const m = mm.mobs[idx];
    this.state.combat.monster   = m._srcId;
    this.state.combat.monsterHp = mm.hp[idx];
    this.state.combat.statusEffects.monster = {};
    this.emit('notification', {type:'info', text:`Now targeting ${m.name}.`});
    this.emit('multiMobChanged');
  }

  // Called every tickCombat in multi-mob mode
  tickMultiMob(dt) {
    const mm = this.state.multiMob;
    const c  = this.state.combat;
    if (!mm?.active) return;

    // ── PLAYER ATTACKS CURRENT TARGET ──────────────────────
    const playerSpeed = this.getPlayerAttackSpeed();
    c.playerAttackTimer += dt;
    if (c.playerAttackTimer >= playerSpeed) {
      c.playerAttackTimer -= playerSpeed;
      const tgt = mm.mobs[mm.targetIdx];
      if (tgt && mm.alive[mm.targetIdx]) {
        c.monsterHp = mm.hp[mm.targetIdx]; // sync IN
        this.playerAttack(tgt);
        this.drainPrayerPoints();
        this.doPetCombatAction(tgt);
        mm.hp[mm.targetIdx] = c.monsterHp; // sync OUT
      }
    }

    // ── ALL ALIVE MOBS ATTACK PLAYER SIMULTANEOUSLY ─────────
    for (let i = 0; i < mm.mobs.length; i++) {
      if (!mm.alive[i]) continue;
      const mob = mm.mobs[i];
      mm.attackTimers[i] += dt;
      const mobSpeed = (mob.attackSpeed || 3) * 0.7;
      if (mm.attackTimers[i] >= mobSpeed) {
        mm.attackTimers[i] -= mobSpeed;
        this.monsterAttack(mob); // reduces c.playerHp
        if (c.autoEat && c.playerHp < this.getMaxHp() * 0.4) this.eatFood();
      }
    }

    // ── CHECK MOB DEATHS ─────────────────────────────────────
    for (let i = 0; i < mm.mobs.length; i++) {
      if (!mm.alive[i] || mm.hp[i] > 0) continue;
      mm.alive[i] = false;
      mm.hp[i] = 0;
      const dead = mm.mobs[i];

      // XP reward (same distribution as onMonsterDeath)
      const style   = c.combatStyle || 'melee';
      const xpMode  = c.xpMode || 'controlled';
      const xp      = dead.xp || 0;
      this.addXp('hitpoints', Math.floor(xp * 0.33));
      if (style === 'melee') {
        if (xpMode === 'accurate')        { this.addXp('attack',   Math.floor(xp*0.9)); this.addXp('defence', Math.floor(xp*0.1)); }
        else if (xpMode === 'aggressive') { this.addXp('strength', Math.floor(xp*0.9)); this.addXp('defence', Math.floor(xp*0.1)); }
        else if (xpMode === 'defensive')  { this.addXp('defence',  Math.floor(xp*0.9)); this.addXp('attack',  Math.floor(xp*0.1)); }
        else { this.addXp('attack', Math.floor(xp*0.33)); this.addXp('strength', Math.floor(xp*0.33)); this.addXp('defence', Math.floor(xp*0.34)); }
      } else if (style === 'ranged') {
        this.addXp('ranged', Math.floor(xp * 0.9)); this.addXp('defence', Math.floor(xp * 0.1));
      } else {
        this.addXp('magic', Math.floor(xp * 0.8)); this.addXp('defence', Math.floor(xp * 0.2));
      }
      this.addXp('tactics', Math.max(1, Math.floor(xp * 0.05)));
      this.state.stats.monstersKilled = (this.state.stats.monstersKilled||0)+1;
      if (!this.state.stats.uniqueKills) this.state.stats.uniqueKills = {};
      this.state.stats.uniqueKills[dead._srcId] = (this.state.stats.uniqueKills[dead._srcId]||0)+1;

      // Gold
      const g = dead.gold || {min:0,max:0};
      const gold = this.randInt(g.min, g.max);
      this.state.gold += gold;
      this.state.stats.goldEarned += gold;

      // Loot
      if (!c._sessionLoot) c._sessionLoot = {};
      if (!c._sessionKills) c._sessionKills = 0;
      c._sessionKills++;
      const loot = [];
      for (const drop of (dead.drops||[])) {
        if (Math.random() < drop.chance) {
          this.addItem(drop.item, drop.qty);
          const rarity = GAME_DATA.items[drop.item]?.rarity || 'common';
          loot.push({ item:drop.item, qty:drop.qty, rarity });
          if (!c._sessionLoot[drop.item]) c._sessionLoot[drop.item] = { qty:0, rarity };
          c._sessionLoot[drop.item].qty += drop.qty;
        }
      }
      if (gold > 0) {
        if (!c._sessionLoot['_gold']) c._sessionLoot['_gold'] = { qty:0 };
        c._sessionLoot['_gold'].qty += gold;
      }

      this.trackSlayerKill(dead._srcId);
      this.rollPetDrop(dead._srcId);
      this.emit('notification', {type:'success', text:`${dead.name} defeated!`});
      if (loot.length > 0) this.emit('lootDrop', { bag:loot, monster:dead.name, sessionLoot:c._sessionLoot, kills:c._sessionKills });
      this.emit('multiMobChanged');

      // Auto-switch target if current mob just died
      if (mm.targetIdx === i) {
        const next = mm.alive.findIndex((a,j) => a && j !== i);
        if (next >= 0) {
          mm.targetIdx = next;
          c.monster   = mm.mobs[next]._srcId;
          c.monsterHp = mm.hp[next];
          c.statusEffects.monster = {};
          this.emit('notification', {type:'info', text:`Targeting ${mm.mobs[next].name}.`});
        }
      }
    }

    // ── ALL MOBS DEAD → VICTORY ──────────────────────────────
    if (!mm.alive.some(Boolean)) {
      this._endMultiMobEncounter();
      return;
    }

    // ── PLAYER DEATH ─────────────────────────────────────────
    if (c.playerHp <= 0) {
      this._playerDeathInMultiMob();
      return;
    }

    // Keep combat state in sync with current target
    c.monsterHp = mm.hp[mm.targetIdx] || 0;
    c.monster   = mm.mobs[mm.targetIdx]?._srcId || c.monster;
  }

  _endMultiMobEncounter() {
    const mm = this.state.multiMob;
    this.emit('notification', {type:'achievement', text:`Multi-mob encounter cleared! All enemies defeated.`});
    this.state.multiMob = null;
    this.stopCombat();
    this.emit('multiMobEnd', { victory: true });
  }

  _playerDeathInMultiMob() {
    this.state.stats.deaths = (this.state.stats.deaths||0)+1;
    this.emit('notification', {type:'danger', text:'You were overwhelmed and killed...'});
    this.state.multiMob = null;
    this.stopCombat();
    this.emit('multiMobEnd', { victory: false });
    // Soft death: keep items, respawn at 10% HP
    this.state.combat.playerHp = Math.floor(this.getMaxHp() * 0.1);
  }

  // ── HELPERS ────────────────────────────────────────────
  getCombatLevel() {
    const s = this.state.skills;
    const base = 0.25 * (s.defence.level + s.hitpoints.level);
    const m = 0.325 * (s.attack.level + s.strength.level);
    const r = 0.325 * (s.ranged.level * 1.5);
    const mg = 0.325 * (s.magic.level * 1.5);
    return Math.floor(base + Math.max(m, r, mg));
  }

  getMaxHp(skills) { const s = skills || this.state.skills; return Math.floor(s.hitpoints.level * 10 + 10); }

  // ── THIEVING HELPERS ───────────────────────────────────
  _getThievingAnger(targetId) {
    return this.state.thievingAnger?.[targetId] || 0;
  }

  _calcThievingFightChance(action) {
    // Formula: base chance (2% to 20%) × anger multiplier × target level factor
    // High-level targets are more likely to fight back when angry
    const anger      = this._getThievingAnger(action.id);
    const lvFactor   = (action.level || 1) / 90;       // 0–1 based on level
    const baseChance = 0.02 + lvFactor * 0.08;         // 2%–10% base
    return Math.min(0.75, baseChance + anger * 0.40);  // anger adds up to 40%
  }

  _triggerThievingFight(action) {
    // Convert pickpocket target into a temporary combat monster
    const monsterId = action.combatTarget || this._pickThievingMonster(action);
    if (!monsterId || !GAME_DATA.monsters[monsterId]) {
      this.emit('notification', { type:'danger', text:`${action.name} attacks you! Run!` });
      this.state.thievingAnger[action.id] = 0;
      this.stopSkill();
      return;
    }
    this.stopSkill();
    this.emit('notification', { type:'danger', text:`${action.name} is furious and attacks you!` });
    // Reset anger after fight trigger
    if (this.state.thievingAnger) this.state.thievingAnger[action.id] = 0;
    // Sync combat HP to thieving HP
    this.state.combat.playerHp = this.state.thievingHp || this.getMaxHp();
    this.startCombat(null, monsterId);
  }

  _pickThievingMonster(action) {
    // Map pickpocket target to appropriate combat monster
    const map = {
      pickpocket_man:      'goblin',
      pickpocket_farmer:   'bandit',
      pickpocket_warrior:  'hollow_soldier',
      pickpocket_rogue:    'shadow_archer',
      pickpocket_guard:    'guard',
      pickpocket_merchant: 'bandit',
      pickpocket_paladin:  'black_knight',
      pickpocket_knight:   'hollow_knight',
      pickpocket_king:     'hollow_lord',
      steal_cake:          'rat',
      steal_silk:          'guard',
      steal_gem:           'black_knight',
      steal_magic:         'dark_mage',
    };
    return map[action.id] || 'bandit';
  }

  _thievingAutoEat() {
    if (!Array.isArray(this.state.foodBag) || this.state.foodBag.length === 0) return;
    const maxHp = this.getMaxHp();
    // Find best food
    let best = null, bestHeal = 0, bestIdx = -1;
    for (let i = 0; i < this.state.foodBag.length; i++) {
      const slot = this.state.foodBag[i];
      if (slot.qty <= 0) continue;
      const item = GAME_DATA.items[slot.id];
      if (item?.heals > bestHeal) { bestHeal = item.heals; best = slot; bestIdx = i; }
    }
    if (!best || bestHeal === 0) return;
    const healed = Math.min(bestHeal, maxHp - this.state.thievingHp);
    this.state.thievingHp = Math.min(maxHp, this.state.thievingHp + bestHeal);
    best.qty--;
    if (best.qty <= 0) this.state.foodBag.splice(bestIdx, 1);
    this.emit('notification', { type:'success', text:`Auto-ate food. Healed ${bestHeal} HP.` });
    this.emit('thievingHpChanged', { hp: this.state.thievingHp, maxHp });
  }

  _thievingDeath() {
    this.stopSkill();
    this.state.thievingHp = this.getMaxHp(); // Restore HP on death (soft death)
    this.state.stats.deaths = (this.state.stats.deaths||0) + 1;
    this.emit('notification', { type:'danger', text:'You were beaten unconscious and lost half your gold!' });
    this.state.gold = Math.floor(this.state.gold * 0.50);
  }

  calcThievingFightChancePublic(action) { return this._calcThievingFightChance(action); }

  resetThievingAnger(targetId) {
    if (!this.state.thievingAnger) this.state.thievingAnger = {};
    if (targetId) this.state.thievingAnger[targetId] = 0;
    else this.state.thievingAnger = {};
  }

  thievingEatFood(itemId) {
    // Manual eat during thieving
    const maxHp = this.getMaxHp();
    if ((this.state.thievingHp||maxHp) >= maxHp) { this.emit('notification',{type:'info',text:'Already at full HP.'}); return; }
    const slot = this.state.foodBag?.find(f => f.id === itemId && f.qty > 0);
    if (!slot) { this.emit('notification',{type:'warn',text:'No food of that type in bag.'}); return; }
    const item = GAME_DATA.items[itemId];
    if (!item?.heals) return;
    if (!this.state.thievingHp) this.state.thievingHp = maxHp;
    this.state.thievingHp = Math.min(maxHp, this.state.thievingHp + item.heals);
    slot.qty--;
    if (slot.qty <= 0) this.state.foodBag.splice(this.state.foodBag.indexOf(slot), 1);
    this.emit('thievingHpChanged', { hp: this.state.thievingHp, maxHp });
  }

  getPlayerAttackSpeed() {
    const w = this.getEquippedItem('weapon');
    let speed = w ? w.attackSpeed : 2.4;
    // Global speed boost - 40% faster combat
    speed *= 0.6;
    for (const buff of this.state.combat.activeBuffs) if (buff.stat === 'speedBonus') speed *= (1 - buff.value/100);
    // Weapon affix speed bonus
    const affixData = this.state._affixedItems?.[this.state.equipment?.weapon];
    if (affixData?.effects?.atkSpeedBonus) speed += affixData.effects.atkSpeedBonus;
    // Freeze debuff slows attack speed
    const freezeFx = this.state.combat.statusEffects?.player?.freeze;
    if (freezeFx && freezeFx.stacks > 0) {
      speed *= (1 + 0.10 * freezeFx.stacks); // 10% slower per stack
    }
    // Shock stun check
    const shockFx = this.state.combat.statusEffects?.player?.shock;
    if (shockFx && shockFx.stacks > 0 && Math.random() < 0.05 * shockFx.stacks) {
      return speed * 3; // Stunned - triple attack time this tick
    }
    return Math.max(0.4, speed);
  }

  getStatTotal(stat) {
    let total = 0;
    for (const slot of GAME_DATA.equipmentSlots) {
      const item = this.getEquippedItem(slot);
      if (item?.stats?.[stat]) total += item.stats[stat];
    }
    for (const buff of this.state.combat.activeBuffs) if (buff.stat === stat) total += buff.value;
    // Familiar bonus
    total += this.getFamiliarBonus(stat);
    return total;
  }

  getEquippedItem(slot) { return this.state.equipment[slot] ? GAME_DATA.items[this.state.equipment[slot]] : null; }
  getAmmoBonus() { return this.getEquippedItem('ammo')?.rangedBonus || 0; }

  // ── DWARF CANNON SYSTEM ─────────────────────────────────────────
  hasCannon() {
    return !!(this.state.bank['dwarf_cannon'] > 0 || this.state.equipment?.cannon === 'dwarf_cannon');
  }

  isCannonQuestComplete() {
    return this.state.quests?.completed?.includes('artillerists_calling');
  }

  toggleCannon() {
    if (!this.isCannonQuestComplete()) {
      this.emit('notification', { type:'warn', text:'Quest required: Artillerist\'s Calling. Speak to the Dwarven Engineer.' });
      return;
    }
    if (!this.hasCannon()) {
      this.emit('notification', { type:'warn', text:'You need a Dwarf Cannon. Smith one from 4 cannon parts (Smithing 42).' });
      return;
    }
    if (!this.state.combat.active) {
      this.emit('notification', { type:'warn', text:'Cannon can only be deployed during combat.' });
      return;
    }
    if (!this.state.combat.cannon) this.state.combat.cannon = { active:false, timer:0 };
    const newActive = !this.state.combat.cannon.active;
    if (newActive) {
      const cballs = this.state.bank['cannonball'] || 0;
      if (cballs <= 0) { this.emit('notification', { type:'warn', text:'Load cannonballs first! Equip cannonballs in the Ammo slot.' }); return; }
      this.state.combat.cannon.active = true;
      this.state.combat.cannon.timer = 0;
      this.emit('notification', { type:'info', text:`Cannon deployed! ${cballs.toLocaleString()} cannonballs loaded.` });
    } else {
      this.state.combat.cannon.active = false;
      this.emit('notification', { type:'info', text:'Cannon packed up.' });
    }
    this.emit('cannonToggled', { active: this.state.combat.cannon.active });
  }

  fireCannon(monster) {
    // Consume cannonball from bank
    const cballs = this.state.bank['cannonball'] || 0;
    if (cballs <= 0) {
      this.state.combat.cannon.active = false;
      this.emit('notification', { type:'warn', text:'Cannon: out of cannonballs!' });
      this.emit('cannonToggled', { active:false });
      return;
    }
    this.state.bank['cannonball']--;
    if (this.state.bank['cannonball'] <= 0) delete this.state.bank['cannonball'];

    const rL = this.state.skills.ranged.level;
    // Cannon max hit: scales with ranged level, caps at ~45 at level 99
    const cannonMaxHit = Math.floor(8 + rL * 0.37);

    // Multi-target: cannon hits 1–4 times per rotation (OSRS style splash)
    const numHits = Math.floor(Math.random() * 4) + 1;
    let totalDmg = 0;
    const hits = [];

    for (let i = 0; i < numHits; i++) {
      // 80% accuracy for cannon (doesn't use defence evasion like player attacks)
      if (Math.random() > 0.80) { hits.push(0); continue; }
      const dmg = Math.floor(Math.random() * (cannonMaxHit + 1));
      hits.push(dmg);
      if (dmg > 0) {
        this.state.combat.monsterHp -= dmg;
        totalDmg += dmg;
      }
    }

    // Emit each hit separately for animation
    for (let i = 0; i < hits.length; i++) {
      if (hits[i] >= 0) this.emit('combatHit', { who:'player', dmg:hits[i], style:'ranged', cannon:true, hitIndex:i });
    }

    // XP: 2 ranged xp per damage, 0.67 hp xp per damage (like OSRS cannon)
    if (totalDmg > 0) {
      this.addXp('ranged', Math.floor(totalDmg * 2));
      this.addXp('hitpoints', Math.floor(totalDmg * 0.67));
      // Session/lifetime dmg tracking
      const sd = this.state.combat._sessionDmg;
      if (sd) { sd.ranged = (sd.ranged||0)+totalDmg; sd.total = (sd.total||0)+totalDmg; }
      if (!this.state.stats.dmg) this.state.stats.dmg = {};
      this.state.stats.dmg.total = (this.state.stats.dmg.total||0)+totalDmg;
      this.state.stats.dmg.ranged = (this.state.stats.dmg.ranged||0)+totalDmg;
    }

    this.emit('cannonFire', { hits, totalDmg, cannonballs: this.state.bank['cannonball'] || 0 });
  }

  // ── MINING RANDOM EVENTS ────────────────────────────────
  _rollMiningEvent() {
    const ms = this.state.miningStats;
    const mLevel = this.state.skills.mining.level;
    const sec = ms.security || 0;
    const danger = ms.danger || 0;
    const luck = ms.luck || 0;

    const roll = Math.random();
    const events = GAME_DATA.miningEvents;

    const theftChance = events.theft.baseChance * (1 - sec * 0.01);
    const monsterChance = events.monsterEncounter.baseChance * (1 + danger * 0.05);
    const bonusChance = events.bonusFind.baseChance * (1 + luck * 0.03);
    const gemChance = events.gemFind.baseChance * (1 + luck * 0.02);

    if (roll < theftChance) {
      // Theft event
      const ob = this.state.oreBag;
      const totalOres = Object.values(ob.contents).reduce((s,e) => s + e.qty, 0);
      if (totalOres > 0) {
        const lossPct = 0.02 + Math.random() * 0.08;
        let toLose = Math.max(1, Math.floor(totalOres * lossPct));
        for (const [oreId, entry] of Object.entries(ob.contents)) {
          if (toLose <= 0) break;
          const take = Math.min(entry.qty, toLose);
          entry.qty -= take;
          toLose -= take;
          if (entry.qty <= 0) delete ob.contents[oreId];
        }
        ms.eventsTriggered++;
        this.emit('miningEvent', { type:'theft', art:GAME_DATA.miningEventArt?.theft });
        this.emit('notification', { type:'danger', text:`A goblin stole some of your ores!` });
      }
    } else if (roll < theftChance + monsterChance) {
      // Monster encounter - auto-fight based on mining level
      const tiers = Object.keys(events.monsterEncounter.monsters).map(Number).sort((a,b)=>a-b);
      let tier = tiers[0];
      for (const t of tiers) { if (mLevel >= t) tier = t; }
      const mon = events.monsterEncounter.monsters[tier];
      // Simple auto-resolve: player wins if combat level > monster tier * 1.5
      const cb = this.getCombatLevel();
      if (cb >= tier) {
        this.addXp('mining', mon.xp);
        this.state.gold += mon.gold;
        ms.eventsTriggered++;
        this.emit('miningEvent', { type:'monster', name:mon.name, art:GAME_DATA.miningEventArt?.monsterEncounter });
        this.emit('notification', { type:'success', text:`Defeated ${mon.name}! +${mon.xp} XP, +${mon.gold}g` });
      } else {
        ms.eventsTriggered++;
        this.emit('notification', { type:'danger', text:`${mon.name} attacks! You flee losing time.` });
        this.state.actionProgress = -2; // lose 2 seconds
      }
    } else if (roll < theftChance + monsterChance + bonusChance) {
      // Bonus find
      const mult = 5 + Math.floor(Math.random() * 16);
      const action = this._findAction('mining', this.state.activeAction);
      if (action?.loot?.[0]) {
        const oreId = action.loot[0].item;
        const bonusQty = action.loot[0].qty * mult;
        this.addItem(oreId, bonusQty);
        ms.eventsTriggered++;
        this.emit('miningEvent', { type:'bonus', art:GAME_DATA.miningEventArt?.bonusFind });
        this.emit('notification', { type:'achievement', text:`Rich Vein! +${bonusQty} ${GAME_DATA.items[oreId]?.name}!` });
      }
    } else if (roll < theftChance + monsterChance + bonusChance + gemChance) {
      // Gem discovery
      const gems = events.gemFind.gems;
      const totalW = gems.reduce((s,g) => s + g.weight, 0);
      let r = Math.random() * totalW;
      let gem = gems[0].item;
      for (const g of gems) { r -= g.weight; if (r <= 0) { gem = g.item; break; } }
      this.addItem(gem, 1);
      ms.eventsTriggered++;
      this.emit('miningEvent', { type:'gem', art:GAME_DATA.miningEventArt?.gemFind });
      this.emit('notification', { type:'rare', text:`Gem Discovery! Found a ${GAME_DATA.items[gem]?.name}!` });
    }
  }

  // ── ORE BAG MANAGEMENT ──────────────────────────────────
  collectOreBag() {
    const ob = this.state.oreBag;
    if (!ob) return;
    let total = 0;
    for (const [oreId, entry] of Object.entries(ob.contents)) {
      if (entry.qty > 0) {
        this.addItem(oreId, entry.qty);
        total += entry.qty;
      }
    }
    ob.contents = {};
    if (total > 0) this.emit('notification', { type:'success', text:`Collected ${total} ores from bag.` });
  }

  upgradeOreBag(upgradeId) {
    const item = GAME_DATA.items[upgradeId];
    if (!item || item.subtype !== 'ore_bag') return;
    if (this.state.oreBag.upgrades.includes(upgradeId)) { this.emit('notification',{type:'warn',text:'Already purchased.'}); return; }
    if (!this.state.bank[upgradeId] || this.state.bank[upgradeId] <= 0) { this.emit('notification',{type:'warn',text:'Buy this upgrade from the shop first.'}); return; }
    this.state.bank[upgradeId]--;
    this.state.oreBag.upgrades.push(upgradeId);
    // Apply capacity bonuses
    const capMatch = item.desc?.match(/\+(\d+) ore bag capacity/);
    if (capMatch) this.state.oreBag.capacity += parseInt(capMatch[1]);
    this.emit('notification',{type:'success',text:`Ore bag upgraded! ${item.name}`});
  }

  // Returns percentage speed bonus from equipped tool for a given skill
  getToolSpeedBonus(skillId) {
    const weapon = this.getEquippedItem('weapon');
    let bonus = weapon?.toolSpeed?.[skillId] || 0;
    // Agility passive: +0.2% gathering speed per 5 agility levels
    const agilLv = this.state.skills.agility?.level || 0;
    if (agilLv >= 5 && (GAME_DATA.skills[skillId]?.type === 'gathering' || GAME_DATA.skills[skillId]?.type === 'agility')) {
      bonus += Math.floor(agilLv / 5) * 0.2;
    }
    // Graceful set bonus: wearing full graceful = +3% all gathering
    const graceSlots = ['graceful_hood','graceful_top','graceful_legs','graceful_gloves','graceful_boots','graceful_cape'];
    const equip = this.state.equipment || {};
    const wearingFull = graceSlots.every(id => Object.values(equip).includes(id));
    if (wearingFull && GAME_DATA.skills[skillId]?.type === 'gathering') bonus += 3;
    return bonus;
  }

  consumeAmmo() {
    const id = this.state.equipment.ammo;
    if (!id) return;
    if (this.state.bank[id] > 0) {
      this.state.bank[id]--;
      if (this.state.bank[id] <= 0) {
        delete this.state.bank[id];
        this.state.equipment.ammo = null;
        this.emit('notification', { type:'warn', text:'Out of ammo!' });
        this.emit('equipmentChanged');
      }
    } else {
      this.state.equipment.ammo = null;
      this.emit('notification', { type:'warn', text:'Out of ammo!' });
      this.emit('equipmentChanged');
    }
  }

  consumeRunes(spell) {
    if (!spell.runes || spell.runes.length === 0) return true;
    // Check equipped staff for infinite rune provision
    const weapon = this.state.equipment?.weapon;
    const weaponData = weapon ? GAME_DATA.items[weapon] : null;

    // Elder staff / any staff with providesAllRunes → free cast
    if (weaponData?.providesAllRunes) return true;

    // Build a Set of rune IDs this staff provides (supports string or array)
    const raw = weaponData?.providesRune;
    const freeRunes = raw
      ? new Set(Array.isArray(raw) ? raw : [raw])
      : new Set();

    // Filter out runes provided by staff
    const runesNeeded = spell.runes.filter(r => !freeRunes.has(r.item));
    if (runesNeeded.length === 0) return true; // Staff covers all runes
    if (!this.hasItems(runesNeeded)) return false;
    this.removeItems(runesNeeded);
    return true;
  }

  // ── ABILITIES ──────────────────────────────────────────
  useAbility(abilityId) {
    const c = this.state.combat;
    if (!c.active) return;
    // Accept ability ID directly (UI passes ID string)
    const ab = GAME_DATA.abilities.find(a => a.id === abilityId);
    if (!ab) return;
    if ((c.abilityCooldowns[abilityId] || 0) > 0) { this.emit('notification', { type:'warn', text:`${ab.name} is on cooldown.` }); return; }
    if (this.state.skills.tactics.level < (ab.tacticsReq || 1)) {
      this.emit('notification', { type:'warn', text:`Requires Tactics level ${ab.tacticsReq}.` }); return;
    }
    c.abilityCooldowns[abilityId] = ab.cooldown;
    const eff = ab.effect;
    let totalDmg = 0;
    let noteSuffix = '';

    const _physMaxHit = (style) => {
      if (style === 'ranged') {
        const rL = this.state.skills.ranged.level;
        const rB = this.getStatTotal('rangedBonus') + this.getAmmoBonus();
        return Math.max(1, Math.floor(0.5 + rL * (rB + 64) / 640));
      }
      const sL = this.state.skills.strength.level;
      const sB = this.getStatTotal('strengthBonus');
      return Math.max(1, Math.floor(0.5 + sL * (sB + 64) / 640));
    };

    const _magicMaxHit = () => {
      const mL = this.state.skills.magic.level;
      const mB = this.getStatTotal('magicBonus');
      return Math.max(5, Math.floor(0.5 + mL * (mB + 64) / 640));
    };

    switch (eff.type) {
      // ── POWER STRIKE: buff next hit ──────────────────────
      case 'buff':
        c.activeBuffs = c.activeBuffs.filter(b => b.stat !== 'damageMult');
        c.activeBuffs.push({ stat:'damageMult', value: eff.value || 2, remaining: 20 });
        noteSuffix = ` (+${Math.round((eff.value||2)*100-100)}% next hit)`;
        break;

      // ── MULTI SHOT: quick_shot / double_shot ─────────────
      case 'multi': {
        const style = eff.style || c.combatStyle;
        const mh = _physMaxHit(style);
        const shots = eff.shots || 1;
        const mult  = eff.mult  || 1;
        for (let i = 0; i < shots; i++) totalDmg += Math.floor(this.randInt(1, mh) * mult);
        break;
      }

      // ── NUKE: fireball – magic damage + burn ─────────────
      case 'nuke': {
        const mh = _magicMaxHit();
        totalDmg = Math.floor(this.randInt(Math.floor(mh * 0.5), mh) * (eff.mult || 1.5));
        const stacks = eff.burnStacks || 1;
        for (let i = 0; i < stacks; i++) this.applyStatus('monster', 'burn', 1, 10);
        break;
      }

      // ── COMBAT BUFF: war_cry – +% damage for duration ────
      case 'combat_buff':
        c.activeBuffs = c.activeBuffs.filter(b => b.stat !== 'strengthBonus' || !b._ability);
        c.activeBuffs.push({ stat:'strengthBonus', value: eff.dmgBonus || 25, remaining: eff.duration || 15, _ability:true });
        noteSuffix = ` (+${eff.dmgBonus||25} Str for ${eff.duration||15}s)`;
        break;

      // ── DEBUFF: ice_blast / venom_strike ─────────────────
      case 'debuff':
        if (eff.freeze) this.applyStatus('monster', 'freeze', eff.freeze, 8);
        if (eff.poison) this.applyStatus('monster', 'poison', eff.poison, 12);
        if (eff.burn)   this.applyStatus('monster', 'burn',   eff.burn,   10);
        noteSuffix = eff.freeze ? ' (Frozen!)' : eff.poison ? ' (Poisoned!)' : '';
        break;

      // ── EXECUTE: 3× damage if target below threshold ─────
      case 'execute': {
        const m = GAME_DATA.monsters[c.monster] || (GAME_DATA.worldBosses||[]).find(b=>b.id===c.monster);
        const thresh = eff.threshold || 0.30;
        if (m && c.monsterHp <= m.hp * thresh) {
          const mh = _physMaxHit(c.combatStyle);
          totalDmg = Math.floor(mh * (eff.mult || 3));
        } else {
          this.emit('notification', { type:'warn', text:`Target above ${Math.round((eff.threshold||0.3)*100)}% HP.` });
          c.abilityCooldowns[abilityId] = 0;
          return;
        }
        break;
      }

      // ── HEAL ─────────────────────────────────────────────
      case 'heal': {
        const maxHp = this.getMaxHp();
        const amt = Math.floor(maxHp * (eff.pct || 0.30));
        c.playerHp = Math.min(maxHp, c.playerHp + amt);
        noteSuffix = ` (+${amt} HP)`;
        break;
      }

      // ── SHADOW STEP: dodge buff + strike ─────────────────
      case 'dodge_strike': {
        // Grant dodge charges (consumed in monsterAttack)
        c.activeBuffs = c.activeBuffs.filter(b => b.stat !== 'dodgeCharges');
        c.activeBuffs.push({ stat:'dodgeCharges', value: eff.dodges || 1, remaining: eff.duration || 8 });
        // Also deal physical damage
        const mh = _physMaxHit(c.combatStyle);
        totalDmg = Math.floor(this.randInt(Math.floor(mh*0.6), mh) * 1.5);
        noteSuffix = ' (dodge ready)';
        break;
      }

      // ── SOUL DRAIN: magic damage + lifesteal ─────────────
      case 'lifesteal_spell': {
        const mh = _magicMaxHit();
        totalDmg = Math.floor(this.randInt(Math.floor(mh*0.5), mh) * (eff.mult || 1.2));
        if (totalDmg > 0) {
          const healed = Math.floor(totalDmg * ((eff.stealPct || 50) / 100));
          c.playerHp = Math.min(this.getMaxHp(), c.playerHp + healed);
          noteSuffix = ` (+${healed} HP)`;
        }
        break;
      }

      // ── RALLYING CRY: +% damage reduction ────────────────
      case 'defence_buff':
        c.activeBuffs = c.activeBuffs.filter(b => b.stat !== 'damageReduction' || !b._ability);
        c.activeBuffs.push({ stat:'damageReduction', value: eff.reducePct || 15, remaining: eff.duration || 20, _ability:true });
        noteSuffix = ` (DR +${eff.reducePct||15}% for ${eff.duration||20}s)`;
        break;

      // ── BLOOD PACT: sacrifice HP for nuclear damage ───────
      case 'blood_sacrifice': {
        const sacAmt = Math.floor(this.getMaxHp() * (eff.hpCost || 0.20));
        if (c.playerHp <= sacAmt + 1) {
          this.emit('notification', { type:'warn', text:'Not enough HP to sacrifice.' });
          c.abilityCooldowns[abilityId] = 0; return;
        }
        c.playerHp -= sacAmt;
        const mh = _physMaxHit(c.combatStyle);
        totalDmg = Math.floor(mh * (eff.mult || 4)) + sacAmt;
        noteSuffix = ` (−${sacAmt} HP)`;
        break;
      }

      // ── EXPOSE WEAKNESS: boost accuracy vs target ─────────
      case 'expose':
        c.activeBuffs = c.activeBuffs.filter(b => b.stat !== 'attackBonus' || !b._ability);
        c.activeBuffs.push({ stat:'attackBonus', value: eff.bonus || 30, remaining: eff.duration || 30, _ability:true });
        noteSuffix = ` (+${eff.bonus||30} Atk for ${eff.duration||30}s)`;
        break;

      // ── BARRAGE: multi-hit ranged burst ──────────────────
      case 'barrage': {
        const mh = _physMaxHit('ranged');
        const hits = eff.hits || 5;
        for (let i = 0; i < hits; i++) totalDmg += Math.floor(this.randInt(1, mh) * (eff.mult || 0.65));
        break;
      }

      // ── VENGEANCE: reflect next incoming hit ──────────────
      case 'vengeance':
        c.activeBuffs = c.activeBuffs.filter(b => b.stat !== 'vengeance');
        c.activeBuffs.push({ stat:'vengeance', value: eff.reflectMult || 1.5, remaining: 20 });
        noteSuffix = ' (next hit reflected)';
        break;

      // ── CLEAVE: 3 wide melee swings ──────────────────────
      case 'cleave': {
        const mh = _physMaxHit('melee');
        const hits = eff.hits || 3;
        for (let i = 0; i < hits; i++) totalDmg += Math.floor(this.randInt(1, mh) * (eff.mult || 0.7));
        break;
      }

      // ── MARK OF DEATH: all attacks +% damage ─────────────
      case 'mark_of_death':
        c.activeBuffs = c.activeBuffs.filter(b => b.stat !== 'damageMult' || !b._ability);
        c.activeBuffs.push({ stat:'damageMult', value: 1 + (eff.dmgBonus||30)/100, remaining: eff.duration || 20, _ability:true });
        noteSuffix = ` (+${eff.dmgBonus||30}% dmg for ${eff.duration||20}s)`;
        break;

      // ── VOID RUPTURE: magic, partial evasion ignore ───────
      case 'void_rupture': {
        const mh = _magicMaxHit();
        totalDmg = Math.floor(this.randInt(Math.floor(mh*0.7), mh) * (eff.mult || 2.0));
        // Apply void debuff on monster (accuracy buff for us)
        c.activeBuffs.push({ stat:'attackBonus', value: 50, remaining: 5, _ability:true });
        break;
      }

      // ── PRAYER SURGE: restore prayer + combat boost ───────
      case 'prayer_surge':
        if (!this.state.prayerPoints) this.state.prayerPoints = 0;
        this.state.prayerPoints = Math.min(
          this.state.skills.prayer?.level * 10 || 10,
          (this.state.prayerPoints || 0) + (eff.ppRestore || 40)
        );
        c.activeBuffs.push({ stat:'strengthBonus', value: eff.statBoost||8, remaining: eff.duration||20, _ability:true });
        c.activeBuffs.push({ stat:'defenceBonus',  value: eff.statBoost||8, remaining: eff.duration||20, _ability:true });
        noteSuffix = ` (+${eff.ppRestore||40} PP restored)`;
        break;

      default:
        // Fallback: try legacy field checks
        if (eff.burn)      this.applyStatus('monster', 'burn',   eff.burn,   10);
        if (eff.poison)    this.applyStatus('monster', 'poison', eff.poison, 12);
        if (eff.freeze)    this.applyStatus('monster', 'freeze', eff.freeze,  8);
        if (eff.directDmg) totalDmg += eff.directDmg + Math.floor(this.state.skills.magic.level * 0.5);
        if (eff.heal)      c.playerHp = Math.min(this.getMaxHp(), c.playerHp + Math.floor(this.getMaxHp() * eff.heal));
        break;
    }

    // Apply total damage
    if (totalDmg > 0) {
      c.monsterHp -= totalDmg;
      // Track ability damage
      const sdA = c._sessionDmg || (c._sessionDmg = { melee:0, ranged:0, magic:0, ability:0, burn:0, poison:0, bleed:0, total:0, taken:0, hits:0, misses:0, crits:0 });
      sdA.ability = (sdA.ability || 0) + totalDmg;
      sdA.total   = (sdA.total   || 0) + totalDmg;
      sdA.hits    = (sdA.hits    || 0) + 1;
      if (!this.state.stats.dmg) this.state.stats.dmg = { melee:0, ranged:0, magic:0, ability:0, total:0, taken:0 };
      this.state.stats.dmg.ability = (this.state.stats.dmg.ability || 0) + totalDmg;
      this.state.stats.dmg.total   = (this.state.stats.dmg.total   || 0) + totalDmg;
      this.emit('combatHit', { who:'player', dmg: totalDmg, ability:true, style:'ability' });
    }

    this.emit('notification', { type:'success', text:`${ab.name}${totalDmg>0?' — '+totalDmg+' damage':''}${noteSuffix}!` });
    const tacticsXp = Math.floor(ab.cooldown * 3 + (ab.tacticsReq || 1) * 5);
    this.addXp('tactics', tacticsXp);
  }

  tickBuffs(dt) {
    for (let i = this.state.combat.activeBuffs.length - 1; i >= 0; i--) {
      this.state.combat.activeBuffs[i].remaining -= dt;
      if (this.state.combat.activeBuffs[i].remaining <= 0) this.state.combat.activeBuffs.splice(i, 1);
    }
  }

  tickAbilityCooldowns(dt) {
    for (const id in this.state.combat.abilityCooldowns) {
      this.state.combat.abilityCooldowns[id] = Math.max(0, this.state.combat.abilityCooldowns[id] - dt);
    }
  }

  equipAbility(slotIdx, abilityId) {
    if (slotIdx < 0 || slotIdx >= 4) return;
    if (!abilityId) { this.state.equippedAbilities[slotIdx] = null; this.emit('abilitiesChanged'); return; }
    const ab = GAME_DATA.abilities.find(a => a.id === abilityId); if (!ab) return;
    if (this.state.skills.tactics.level < ab.tacticsReq) { this.emit('notification', { type:'warn', text:`Requires Tactics ${ab.tacticsReq}.` }); return; }
    this.state.equippedAbilities[slotIdx] = abilityId;
    this.emit('abilitiesChanged');
  }

  // ── FOOD ───────────────────────────────────────────────
  equipFood(itemId) {
    if (!this.state.bank[itemId] || this.state.bank[itemId] <= 0) return;
    const item = GAME_DATA.items[itemId];
    if (!item || (item.type !== 'food' && item.type !== 'potion')) return;
    // Migrate old format
    if (!Array.isArray(this.state.foodBag)) {
      this.state.foodBag = [];
      if (this.state.food?.equipped && this.state.food.qty > 0) {
        this.state.foodBag.push({ id: this.state.food.equipped, qty: this.state.food.qty });
      }
    }
    // Check if already in bag
    const existing = this.state.foodBag.find(f => f.id === itemId);
    if (existing) {
      const add = Math.min(this.state.bank[itemId], 28 - existing.qty);
      if (add <= 0) { this.emit('notification',{type:'warn',text:'Food bag full for this type (28 max).'}); return; }
      this.state.bank[itemId] -= add;
      existing.qty += add;
    } else {
      if (this.state.foodBag.length >= 4) { this.emit('notification',{type:'warn',text:'Food bag full (4 types max). Remove one first.'}); return; }
      const add = Math.min(this.state.bank[itemId], 28);
      this.state.bank[itemId] -= add;
      if (this.state.bank[itemId] <= 0) delete this.state.bank[itemId];
      this.state.foodBag.push({ id: itemId, qty: add });
    }
    // Keep legacy food field in sync for backward compat
    this.state.food.equipped = this.state.foodBag[0]?.id || null;
    this.state.food.qty = this.state.foodBag.reduce((s,f) => s + f.qty, 0);
    this.emit('foodChanged');
    this.emit('bankChanged');
  }

  removeFromFoodBag(index) {
    if (!Array.isArray(this.state.foodBag)) return;
    const slot = this.state.foodBag[index];
    if (!slot) return;
    this.addItem(slot.id, slot.qty);
    this.state.foodBag.splice(index, 1);
    this.state.food.equipped = this.state.foodBag[0]?.id || null;
    this.state.food.qty = this.state.foodBag.reduce((s,f) => s + f.qty, 0);
    this.emit('foodChanged');
    this.emit('bankChanged');
  }

  eatFood() {
    if (!Array.isArray(this.state.foodBag)) {
      // Migrate old format
      this.state.foodBag = [];
      if (this.state.food?.equipped && this.state.food.qty > 0) {
        this.state.foodBag.push({ id: this.state.food.equipped, qty: this.state.food.qty });
      }
    }
    if (this.state.foodBag.length === 0) return;
    // Pick best food: highest heals first
    let bestIdx = 0, bestHeals = 0;
    for (let i = 0; i < this.state.foodBag.length; i++) {
      const slot = this.state.foodBag[i];
      if (slot.qty <= 0) continue;
      const item = GAME_DATA.items[slot.id];
      const heals = item?.heals || 0;
      if (heals > bestHeals) { bestHeals = heals; bestIdx = i; }
    }
    const slot = this.state.foodBag[bestIdx];
    if (!slot || slot.qty <= 0) return;
    const item = GAME_DATA.items[slot.id]; if (!item) return;
    const max = this.getMaxHp();
    if (item.type === 'food') {
      if (this.state.combat.playerHp >= max) return;
      this.state.combat.playerHp = Math.min(max, this.state.combat.playerHp + (item.heals || 0));
    }
    if (item.buff) {
      const existing = this.state.combat.activeBuffs.find(b => b.stat === item.buff.stat);
      if (existing) { existing.remaining = item.buff.duration || 120; existing.value = Math.max(existing.value, item.buff.value); }
      else { this.state.combat.activeBuffs.push({ ...item.buff, remaining: item.buff.duration || 120 }); }
    }
    if (item.prayerRestore) {
      this.state.prayerPoints = Math.min(99, this.state.prayerPoints + item.prayerRestore);
    }
    if (item.heals && item.type === 'potion') {
      this.state.combat.playerHp = Math.min(max, this.state.combat.playerHp + item.heals);
    }
    slot.qty--;
    this.state.stats.foodEaten = (this.state.stats.foodEaten || 0) + 1;
    this.emit('notification',{type:'info',text:`Ate ${item.name} (+${item.heals||0} HP)`});
    // Remove empty slots
    this.state.foodBag = this.state.foodBag.filter(f => f.qty > 0);
    // Sync legacy
    this.state.food.equipped = this.state.foodBag[0]?.id || null;
    this.state.food.qty = this.state.foodBag.reduce((s,f) => s + f.qty, 0);
    this.emit('foodChanged');
  }

  // Eat a specific food slot by index (manual selection)
  eatFoodSlot(slotIdx) {
    if (!Array.isArray(this.state.foodBag)) return;
    const slot = this.state.foodBag[slotIdx];
    if (!slot || slot.qty <= 0) return;
    const item = GAME_DATA.items[slot.id]; if (!item) return;
    const max = this.getMaxHp();
    if (this.state.combat.playerHp >= max) return;
    if (item.type === 'food') {
      this.state.combat.playerHp = Math.min(max, this.state.combat.playerHp + (item.heals || 0));
    }
    if (item.buff) {
      const existing = this.state.combat.activeBuffs.find(b => b.stat === item.buff.stat);
      if (existing) { existing.remaining = item.buff.duration || 120; existing.value = Math.max(existing.value, item.buff.value); }
      else { this.state.combat.activeBuffs.push({ ...item.buff, remaining: item.buff.duration || 120 }); }
    }
    if (item.prayerRestore) {
      this.state.prayerPoints = Math.min(99, this.state.prayerPoints + item.prayerRestore);
    }
    if (item.heals && item.type === 'potion') {
      this.state.combat.playerHp = Math.min(max, this.state.combat.playerHp + item.heals);
    }
    slot.qty--;
    this.state.stats.foodEaten = (this.state.stats.foodEaten || 0) + 1;
    this.emit('notification',{type:'info',text:`Ate ${item.name} (+${item.heals||0} HP)`});
    this.state.foodBag = this.state.foodBag.filter(f => f.qty > 0);
    this.state.food.equipped = this.state.foodBag[0]?.id || null;
    this.state.food.qty = this.state.foodBag.reduce((s,f) => s + f.qty, 0);
    this.emit('foodChanged');
  }

  // ── POTION BELT ────────────────────────────────────────
  equipPotionBelt(slotIdx, itemId) {
    if (slotIdx < 0 || slotIdx >= 4) return;
    const item = GAME_DATA.items[itemId];
    if (!item || item.type !== 'potion') { this.emit('notification',{type:'warn',text:'Only potions can go in the belt.'}); return; }
    const have = this.state.bank[itemId] || 0;
    if (have <= 0) return;
    const slot = this.state.potionBelt[slotIdx];
    // Return existing potion to bank
    if (slot.id && slot.qty > 0) this.addItem(slot.id, slot.qty);
    // Fill belt slot (max 5)
    const amt = Math.min(have, 5);
    this.state.bank[itemId] -= amt;
    if (this.state.bank[itemId] <= 0) delete this.state.bank[itemId];
    this.state.potionBelt[slotIdx] = { id:itemId, qty:amt };
    this.emit('notification',{type:'success',text:`${item.name} x${amt} loaded into belt slot ${slotIdx+1}.`});
    this.emit('bankChanged');
  }

  drinkPotionBelt(slotIdx) {
    if (slotIdx < 0 || slotIdx >= 4) return;
    const slot = this.state.potionBelt[slotIdx];
    if (!slot.id || slot.qty <= 0) { this.emit('notification',{type:'warn',text:'Empty potion slot.'}); return; }
    const item = GAME_DATA.items[slot.id]; if (!item) return;
    // Apply buff
    if (item.buff) {
      // Check if already have this buff - refresh instead of stack
      const existing = this.state.combat.activeBuffs.find(b => b.stat === item.buff.stat);
      if (existing) {
        existing.remaining = item.buff.duration || 120;
        existing.value = Math.max(existing.value, item.buff.value);
      } else {
        this.state.combat.activeBuffs.push({ ...item.buff, remaining: item.buff.duration || 120 });
      }
      this.emit('notification', { type:'info', text:`${item.name}: +${item.buff.value} ${item.buff.stat.replace('Bonus','')} for ${item.buff.duration||120}s` });
    }
    if (item.prayerRestore) {
      this.state.prayerPoints = Math.min(99, this.state.prayerPoints + item.prayerRestore);
    }
    if (item.heals) {
      this.state.combat.playerHp = Math.min(this.getMaxHp(), this.state.combat.playerHp + item.heals);
    }
    slot.qty--;
    this.state.stats.foodEaten = (this.state.stats.foodEaten || 0) + 1;
    if (slot.qty <= 0) { slot.id = null; slot.qty = 0; }
  }

  clearPotionBelt(slotIdx) {
    if (slotIdx < 0 || slotIdx >= 4) return;
    const slot = this.state.potionBelt[slotIdx];
    if (slot.id && slot.qty > 0) this.addItem(slot.id, slot.qty);
    this.state.potionBelt[slotIdx] = { id:null, qty:0 };
  }

  // ── EQUIPMENT ──────────────────────────────────────────
  equipItem(itemId) {
    if (!this.state.bank[itemId] || this.state.bank[itemId] <= 0) return;
    const item = GAME_DATA.items[itemId];
    if (!item || !item.slot) return;
    if (item.levelReq) {
      for (const [sk, lv] of Object.entries(item.levelReq)) {
        if (this.state.skills[sk]?.level < lv) { this.emit('notification', { type:'warn', text:`Requires ${GAME_DATA.skills[sk]?.name} level ${lv}.` }); return; }
      }
    }
    // Ammo slot: bank IS the quiver stack — just set the slot, never remove from bank
    if (item.slot === 'ammo') {
      // Validate ammo/weapon compatibility
      const weapon = this.getEquippedItem('weapon');
      if (item.ammoType === 'cannonball') {
        // Cannonballs: only valid if player has a dwarf_cannon
        const hasCannon = (this.state.bank['dwarf_cannon'] > 0);
        if (!hasCannon) { this.emit('notification', { type:'warn', text:'You need a Dwarf Cannon to use cannonballs.' }); return; }
      } else if (item.ammoType === 'arrow' && weapon && weapon.ammoType && weapon.ammoType !== 'arrow') {
        this.emit('notification', { type:'warn', text:`${item.name} requires a bow, not a crossbow.` }); return;
      }
      this.state.equipment.ammo = itemId;
      this.emit('equipmentChanged');
      this.emit('notification', { type:'info', text:`${item.name} equipped (${this.state.bank[itemId].toLocaleString()} in quiver).` });
      return;
    }
    const cur = this.state.equipment[item.slot];
    if (cur) this.addItem(cur, 1);
    this.state.bank[itemId]--;
    if (this.state.bank[itemId] <= 0) delete this.state.bank[itemId];
    this.state.equipment[item.slot] = itemId;
    if (item.slot === 'weapon' && item.style) this.state.combat.combatStyle = item.style;
    this.emit('equipmentChanged');
  }

  unequipItem(slot) {
    const id = this.state.equipment[slot]; if (!id) return;
    // Ammo: bank IS the quiver — just clear the slot, no item to return
    if (slot !== 'ammo') this.addItem(id, 1);
    this.state.equipment[slot] = null;
    this.emit('equipmentChanged');
  }

  // ── BANK ───────────────────────────────────────────────
  addItem(id, qty) {
    if (!this.state.bank[id]) this.state.bank[id] = 0;
    this.state.bank[id] += qty;
    // Collection Log: track first discovery
    if (!this.state.collectionLog[id] && GAME_DATA.items[id]) {
      this.state.collectionLog[id] = Date.now();
      this.emit('collectionLogNew', { item: id });
    }
    // Gather contract progress
    if (typeof online !== 'undefined' && online.isOnline && this.state.activeSkill) {
      online.tickContractProgress('gather', id, qty);
    }
  }

  removeItem(id, qty) {
    if (!this.state.bank[id] || this.state.bank[id] < qty) return false;
    this.state.bank[id] -= qty;
    if (this.state.bank[id] <= 0) delete this.state.bank[id];
    return true;
  }

  hasItems(items) { for (const r of items) if (!this.state.bank[r.item] || this.state.bank[r.item] < r.qty) return false; return true; }

  removeItems(items) { for (const r of items) this.removeItem(r.item, r.qty); }

  sellItem(id, qty) {
    const item = GAME_DATA.items[id];
    if (!item || !this.state.bank[id]) return;
    qty = Math.min(qty, this.state.bank[id]);
    let gold = item.sellPrice * qty;
    // Trading skill bonus + alignment
    const tLvl = this.state.skills.trading.level;
    gold = Math.floor(gold * (1 + tLvl * 0.005));
    const al = GAME_DATA.alignments[this.state.alignment];
    if (al?.bonus?.sellBonus) gold = Math.floor(gold * (1 + al.bonus.sellBonus/100));
    this.removeItem(id, qty);
    this.state.gold += gold;
    this.state.stats.goldEarned += gold;
    this.addXp('trading', Math.floor(gold * 0.05));
    this.emit('notification', { type:'info', text:`Sold ${qty}x ${item.name} for ${gold} gold.` });
    this.emit('bankChanged');
  }

  buyItem(idx, qty) {
    const si = GAME_DATA.shop[idx]; if (!si) return;
    let price = si.price;
    const al = GAME_DATA.alignments[this.state.alignment];
    if (al?.bonus?.shopDiscount) price = Math.floor(price * (1 - al.bonus.shopDiscount/100));
    const tLvl = this.state.skills.trading.level;
    price = Math.floor(price * (1 - tLvl * 0.003));
    const total = price * qty;
    if (this.state.gold < total) { this.emit('notification', { type:'warn', text:'Not enough gold.' }); return; }
    this.state.gold -= total;
    this.state.stats.goldSpent += total;
    this.addItem(si.item, qty);
    this.emit('notification', { type:'info', text:`Bought ${qty}x ${GAME_DATA.items[si.item].name}.` });
    this.emit('bankChanged');
  }

  // ── FARMING ────────────────────────────────────────────
  // ── FARMING v2 ─────────────────────────────────────────
  _makePlot(type) {
    return { seed:null, plantedAt:null, growTime:0, ready:false, dead:false,
             type:type||'allotment', watered:false, waterBonus:0,
             compostTier:0, compostBonus:0, diseaseReduction:0,
             hasWeeds:false, _diseaseChecked:false, _diseaseChance:0 };
  }

  _ensureFarmingState() {
    const s = this.state;
    if (!s.farming) s.farming = {};
    if (!Array.isArray(s.farming.plots)) s.farming.plots = [];
    // Count existing typed plots
    const have = {};
    for (const p of s.farming.plots) {
      const t = p.type || 'allotment';
      have[t] = (have[t]||0)+1;
    }
    // Add missing plots for each type
    const need = { allotment:3, herb:4, tree:1, special:1 };
    for (const [type, count] of Object.entries(need)) {
      while ((have[type]||0) < count) {
        s.farming.plots.push(this._makePlot(type));
        have[type] = (have[type]||0)+1;
      }
    }
    if (!s.farming.canUses) s.farming.canUses = {};
  }

  plantSeed(idx, seedId) {
    this._ensureFarmingState();
    const s = this.state;
    if (idx < 0 || idx >= s.farming.plots.length) return;
    const plot = s.farming.plots[idx];
    if (plot.seed || plot.dead) { this.emit('notification',{type:'warn',text: plot.dead ? 'Clear the dead crop first (use spade).' : 'Plot already occupied.'}); return; }
    const seed = GAME_DATA.items[seedId];
    if (!seed || seed.type !== 'seed') return;
    if ((s.bank[seedId]||0) <= 0) { this.emit('notification',{type:'warn',text:'No seeds in bank.'}); return; }
    if (seed.levelReq && s.skills.farming.level < seed.levelReq) {
      this.emit('notification',{type:'warn',text:`Farming level ${seed.levelReq} required.`}); return;
    }
    // Plot type matching
    const st = seed.seedType || 'allotment';
    if (plot.type !== 'allotment' && plot.type !== st) {
      const names = {herb:'Herb Patch',tree:'Tree Patch',special:'Special Patch'};
      this.emit('notification',{type:'warn',text:`${names[plot.type]||plot.type} requires ${st} seeds.`}); return;
    }
    this.removeItem(seedId, 1);
    plot.seed = seedId;
    plot.plantedAt = Date.now();
    plot.growTime = seed.growTime * 1000;
    plot.ready = false;
    plot.dead = false;
    plot.watered = false;
    plot.waterBonus = 0;
    plot.hasWeeds = false;
    plot._diseaseChecked = false;
    const diseaseBase = st === 'tree' ? 0.04 : st === 'herb' ? 0.07 : 0.10;
    plot._diseaseChance = Math.max(0, diseaseBase - (plot.diseaseReduction||0));
    this.addXp('farming', Math.ceil((seed.xp||8) * 0.1));
    this.emit('farmingChanged');
    this.emit('notification',{type:'success',text:`Planted ${seed.name}.`});
  }

  waterPlot(idx) {
    this._ensureFarmingState();
    const s = this.state;
    if (idx < 0 || idx >= s.farming.plots.length) return;
    const plot = s.farming.plots[idx];
    if (!plot.seed || plot.ready || plot.dead) { this.emit('notification',{type:'warn',text:'Nothing to water.'}); return; }
    // Find best watering can
    const cans = [{id:'watering_can_mith',bonus:0.60},{id:'watering_can_iron',bonus:0.40},{id:'watering_can',bonus:0.25}];
    let can = null;
    for (const c of cans) {
      if ((s.bank[c.id]||0) > 0) { can = c; break; }
    }
    if (!can) { this.emit('notification',{type:'warn',text:'You need a watering can. Buy one from the shop.'}); return; }
    const item = GAME_DATA.items[can.id];
    if (!s.farming.canUses[can.id]) s.farming.canUses[can.id] = item.maxUses || 30;
    s.farming.canUses[can.id]--;
    if (s.farming.canUses[can.id] <= 0) {
      this.removeItem(can.id, 1);
      delete s.farming.canUses[can.id];
    }
    if (plot.watered) { this.emit('notification',{type:'info',text:'Plot already watered.'}); return; }
    plot.watered = true;
    plot.waterBonus = can.bonus;
    const elapsed = Date.now() - plot.plantedAt;
    const remaining = plot.growTime - elapsed;
    if (remaining > 0) plot.growTime = elapsed + Math.floor(remaining * (1 - can.bonus));
    this.emit('farmingChanged');
    this.emit('notification',{type:'success',text:`Watered! Growth speed +${Math.round(can.bonus*100)}%.`});
  }

  compostPlot(idx) {
    this._ensureFarmingState();
    const s = this.state;
    if (idx < 0 || idx >= s.farming.plots.length) return;
    const plot = s.farming.plots[idx];
    if (plot.seed && !plot.dead) { this.emit('notification',{type:'warn',text:'Apply compost before planting.'}); return; }
    const composts = ['ultracompost','supercompost','compost_bin'];
    let chosen = null;
    for (const c of composts) if ((s.bank[c]||0) > 0) { chosen = c; break; }
    if (!chosen) { this.emit('notification',{type:'warn',text:'No compost in bank. Buy some from the shop.'}); return; }
    const ci = GAME_DATA.items[chosen];
    this.removeItem(chosen, 1);
    plot.compostTier = ci.compostTier||1;
    plot.compostBonus = ci.growBonus||0.10;
    plot.diseaseReduction = ci.diseaseReduct||0.05;
    this.emit('farmingChanged');
    this.emit('notification',{type:'success',text:`Applied ${ci.name}. Yield +${Math.round((ci.growBonus||0.10)*100)}%.`});
  }

  clearPlot(idx) {
    this._ensureFarmingState();
    const s = this.state;
    if (idx < 0 || idx >= s.farming.plots.length) return;
    const plot = s.farming.plots[idx];
    if (!plot.seed && !plot.dead) { this.emit('notification',{type:'info',text:'Plot is already empty.'}); return; }
    if (plot.seed && !plot.dead && !plot.ready && !(s.bank['spade']||0)) {
      this.emit('notification',{type:'warn',text:'You need a spade to clear a growing crop.'}); return;
    }
    const type = plot.type||'allotment';
    const compostTier = plot.compostTier, compostBonus = plot.compostBonus, diseaseReduction = plot.diseaseReduction;
    Object.assign(plot, this._makePlot(type));
    // Preserve compost if it wasn't used yet (dead crop case)
    if (plot.dead || true) { plot.compostTier = compostTier; plot.compostBonus = compostBonus; plot.diseaseReduction = diseaseReduction; }
    this.emit('farmingChanged');
    this.emit('notification',{type:'info',text:'Plot cleared.'});
  }

  removeWeeds(idx) {
    this._ensureFarmingState();
    const s = this.state;
    if (idx < 0 || idx >= s.farming.plots.length) return;
    const plot = s.farming.plots[idx];
    if (!plot.hasWeeds) { this.emit('notification',{type:'info',text:'No weeds here.'}); return; }
    if (!(s.bank['rake']||0)) { this.emit('notification',{type:'warn',text:'You need a rake to remove weeds.'}); return; }
    plot.hasWeeds = false;
    const elapsed = Date.now() - plot.plantedAt;
    if (plot.growTime > elapsed + 5000) plot.growTime = elapsed + Math.floor((plot.growTime-elapsed)*0.85);
    this.emit('farmingChanged');
    this.emit('notification',{type:'success',text:'Weeds removed.'});
  }

  harvestPlot(idx) {
    this._ensureFarmingState();
    const s = this.state;
    if (idx < 0 || idx >= s.farming.plots.length) return;
    const plot = s.farming.plots[idx];
    if (!plot.seed || !plot.ready || plot.dead) return;
    const seed = GAME_DATA.items[plot.seed];
    if (!seed) return;
    const base = seed.baseYield || 3;
    const compostMult = 1 + (plot.compostBonus||0);
    const ultraExtra = plot.compostTier >= 3 ? 2 : 0;
    const farmLv = s.skills.farming?.level || 1;
    const lvMult = 1 + farmLv/200;
    const secateurs = (s.bank['secateurs_magic']||0) > 0 ? 0.10 : 0;
    const petYield = this.getPetBonus('farmYield')||0;
    let qty = Math.round(base * compostMult * lvMult) + ultraExtra;
    if (seed.seedType === 'herb' && Math.random() < 0.15 + secateurs) qty++;
    if (petYield > 0) qty = Math.floor(qty * (1+petYield/100));
    qty = Math.max(1, qty);
    this.addItem(seed.yield, qty);
    const xpGain = Math.floor((seed.xp||10) * qty);
    this.addXp('farming', xpGain);
    if (Math.random() < 0.35 + (plot.compostTier||0)*0.05) this.addItem(plot.seed, 1);
    this.trackQuestProgress('gather',  { item:seed.yield, qty });
    this.trackQuestProgress('harvest', { item:seed.yield, qty });
    const type = plot.type||'allotment';
    const compostTier = plot.compostTier, compostBonus = plot.compostBonus, diseaseReduction = plot.diseaseReduction;
    Object.assign(plot, this._makePlot(type));
    this.emit('farmingChanged');
    this.emit('notification',{type:'success',text:`Harvested ${qty}x ${GAME_DATA.items[seed.yield]?.name||seed.yield}!`});
  }

  tickFarming(now) {
    this._ensureFarmingState();
    for (const plot of this.state.farming.plots) {
      if (!plot.seed || plot.ready || plot.dead) continue;
      const elapsed = now - plot.plantedAt;
      if (!plot._diseaseChecked && elapsed > plot.growTime * 0.5) {
        plot._diseaseChecked = true;
        if ((plot._diseaseChance||0) > 0 && Math.random() < plot._diseaseChance) {
          plot.dead = true;
          this.emit('farmingChanged');
          const name = GAME_DATA.items[plot.seed]?.name||'crop';
          this.emit('notification',{type:'warn',text:`${name} died of disease! Use compost to prevent this.`});
          continue;
        }
      }
      if (elapsed >= plot.growTime) {
        plot.ready = true;
        const name = (GAME_DATA.items[plot.seed]?.name||'crop').replace(' Seed','');
        this.emit('farmingChanged');
        this.emit('notification',{type:'success',text:`Your ${name} is ready to harvest!`});
      }
    }
  }

  // ── ALIGNMENT ──────────────────────────────────────────
  // (Active shiftAlignment is below, near storyline code)

  // ── REPUTATION ─────────────────────────────────────────
  addReputation(factionId, amount) {
    if (!this.state.reputation[factionId]) this.state.reputation[factionId] = 0;
    const dipBonus = 1 + (this.state.skills.diplomacy?.level || 1) * 0.005;
    this.state.reputation[factionId] += Math.floor(amount * dipBonus);
    this.addXp('diplomacy', Math.floor(amount * 0.1));
  }

  getFactionTier(factionId) {
    const fac = GAME_DATA.factions[factionId]; if (!fac) return null;
    const rep = this.state.reputation[factionId] || 0;
    let tier = fac.tiers[0];
    for (const t of fac.tiers) if (rep >= t.rep) tier = t;
    return tier;
  }

  // ── QUESTS ─────────────────────────────────────────────
  acceptQuest(questId) {
    const q = GAME_DATA.quests.find(x => x.id === questId); if (!q) return;
    if (this.state.quests.completed.includes(questId)) { this.emit('notification',{type:'warn',text:'Quest already completed.'}); return; }
    if (this.state.quests.active.includes(questId)) { this.emit('notification',{type:'warn',text:'Quest already active.'}); return; }
    // Check prereqs (support both prereqs[] array and single prereq string)
    const prereqs = q.prereqs || (q.prereq ? [q.prereq] : []);
    for (const pre of prereqs) {
      if (!this.state.quests.completed.includes(pre)) {
        const preQ = GAME_DATA.quests.find(x=>x.id===pre);
        this.emit('notification',{type:'warn',text:`Complete "${preQ?.name||pre}" first.`}); return;
      }
    }
    // Check level requirements
    if (q.levelReqs) {
      for (const [sk, lv] of Object.entries(q.levelReqs)) {
        if ((this.state.skills[sk]?.level||1) < lv) {
          this.emit('notification',{type:'warn',text:`Requires ${GAME_DATA.skills[sk]?.name||sk} level ${lv}.`}); return;
        }
      }
    }
    this.state.quests.active.push(questId);
    this.state.quests.progress[questId] = (q.objectives||[]).map(() => 0);
    this.emit('notification',{type:'success',text:`Quest accepted: ${q.name}`});
    this.emit('questsChanged');
  }

  abandonQuest(questId) {
    const i = this.state.quests.active.indexOf(questId);
    if (i >= 0) { this.state.quests.active.splice(i,1); delete this.state.quests.progress[questId]; this.emit('questsChanged'); }
  }

  _trackAllQuests(type, data) {
    // Track both main quests and dailies
    const allActive = [
      ...this.state.quests.active.map(id=>({id,list:GAME_DATA.quests,prog:this.state.quests.progress,isDaily:false})),
      ...((this.state.dailyQuests?.active)||[]).map(id=>({id,list:GAME_DATA.dailyQuests||[],prog:this.state.dailyQuests?.progress||{},isDaily:true})),
    ];
    for (const {id:qId, list, prog, isDaily} of allActive) {
      const q = list.find(x=>x.id===qId); if (!q) continue;
      const p = prog[qId] || [];
      let updated = false;
      (q.objectives||[]).forEach((obj,i) => {
        const cur = p[i]||0;
        if (cur >= obj.qty) return; // already done
        let add = 0;
        switch(obj.type) {
          case 'kill':         if (type==='kill'    && obj.monster===data.monster)  add=data.qty; break;
          case 'kill_any':     if (type==='kill')                                    add=data.qty; break;
          case 'gather':       if (type==='gather'  && obj.item===data.item)        add=data.qty; break;
          case 'gather_any':   if (type==='gather')                                  add=data.qty; break;
          case 'harvest':      if (type==='harvest' && obj.item===data.item)        add=data.qty; break;
          case 'craft':        if (type==='craft'   && obj.item===data.item)        add=data.qty; break;
          case 'craft_any':    if (type==='craft')                                   add=data.qty; break;
          case 'craft_cooking':if (type==='craft'   && GAME_DATA.items[data.item]?.type==='food') add=data.qty; break;
          case 'thieve':       if (type==='thieve'  && obj.target===data.target)    add=data.qty; break;
          case 'thieve_any':   if (type==='thieve')                                  add=data.qty; break;
          case 'dungeon':      if (type==='dungeon' && obj.dungeon===data.dungeon)  add=1; break;
          case 'dungeon_any':  if (type==='dungeon')                                 add=1; break;
          case 'slayer_tasks': if (type==='slayer_tasks') { p[i]=Math.min(obj.qty,this.state.stats.slayerTasksCompleted||0); updated=true; return; }
          case 'skill_level':  if (type==='skill_level' && obj.skill===data.skill) { p[i]=(this.state.skills[obj.skill]?.level||1)>=obj.level?obj.qty:0; updated=true; return; }
          case 'gold':         { p[i]=Math.min(obj.qty,this.state.gold); updated=true; return; }
          case 'pets':         { p[i]=Math.min(obj.qty,(this.state.pets||[]).length); updated=true; return; }
          case 'bury_bones': case 'bury_big_bones': case 'bury_dragon_bones':
            if (type===obj.type) add=data.qty||1; break;
        }
        if (add>0) { p[i]=Math.min(obj.qty,cur+add); updated=true; }
      });
      if (updated) prog[qId]=p;
      if ((q.objectives||[]).every((_,i)=>(p[i]||0)>=q.objectives[i].qty)) {
        isDaily ? this._completeDailyQuest(qId) : this.completeQuest(qId);
      }
    }
  }

  trackQuestProgress(type, data) { this._trackAllQuests(type, data); }

  completeQuest(questId) {
    const q = GAME_DATA.quests.find(x=>x.id===questId); if (!q) return;
    const i = this.state.quests.active.indexOf(questId);
    if (i<0) return;
    this.state.quests.active.splice(i,1);
    this.state.quests.completed.push(questId);
    delete this.state.quests.progress[questId];
    if (q.rewards.gold)  { this.state.gold += q.rewards.gold; this.state.stats.goldEarned += q.rewards.gold; }
    if (q.rewards.xp)    for (const [sk,amt] of Object.entries(q.rewards.xp)) this.addXp(sk,amt);
    if (q.rewards.items) for (const it of q.rewards.items) this.addItem(it.id||it.item, it.qty);
    if (q.rewards.qp)    { this.state.questPoints = (this.state.questPoints||0) + q.rewards.qp; }
    this.state.stats.questsCompleted++;
    this.emit('questComplete', { quest:q });
    this.emit('notification',{type:'achievement',text:`⚔ Quest complete: ${q.name}! +${q.rewards.qp||0} QP`});
    this.emit('questsChanged');
  }

  // ── DAILY QUESTS ────────────────────────────────────────
  initDailyQuests() {
    if (!this.state.dailyQuests) this.state.dailyQuests = { active:[], progress:{}, lastRefresh:0, completed:[] };
    const now = Date.now();
    const msPerDay = 86400000;
    const todayStart = Math.floor(now / msPerDay) * msPerDay;
    if ((this.state.dailyQuests.lastRefresh||0) < todayStart) {
      // New day — refresh all dailies
      this.state.dailyQuests.active = (GAME_DATA.dailyQuests||[]).map(q=>q.id);
      this.state.dailyQuests.progress = {};
      this.state.dailyQuests.completed = [];
      for (const q of GAME_DATA.dailyQuests||[]) this.state.dailyQuests.progress[q.id]=(q.objectives||[]).map(()=>0);
      this.state.dailyQuests.lastRefresh = todayStart;
      if (now-todayStart < 5000) this.emit('notification',{type:'info',text:'Daily quests refreshed! Check your quest log.'});
    }
  }

  _completeDailyQuest(questId) {
    const q = (GAME_DATA.dailyQuests||[]).find(x=>x.id===questId); if(!q) return;
    if ((this.state.dailyQuests?.completed||[]).includes(questId)) return;
    const i = (this.state.dailyQuests?.active||[]).indexOf(questId);
    if (i>=0) this.state.dailyQuests.active.splice(i,1);
    if (!this.state.dailyQuests.completed) this.state.dailyQuests.completed=[];
    this.state.dailyQuests.completed.push(questId);
    if (q.rewards.gold)  { this.state.gold += q.rewards.gold; this.state.stats.goldEarned += q.rewards.gold; }
    if (q.rewards.xp)    for (const [sk,amt] of Object.entries(q.rewards.xp)) this.addXp(sk,amt);
    if (q.rewards.items) for (const it of (q.rewards.items||[])) this.addItem(it.id||it.item,it.qty);
    this.emit('notification',{type:'achievement',text:`✓ Daily complete: ${q.name}! +${q.rewards.gold||0}g`});
    this.emit('questsChanged');
  }

  // ── ACHIEVEMENTS ───────────────────────────────────────
  checkAchievements() {
    for (const ach of GAME_DATA.achievements) {
      if (this.state.achievements.includes(ach.id)) continue;
      try {
        if (ach.check(this.state)) {
          this.state.achievements.push(ach.id);
          this.emit('notification', { type:'achievement', text:`Achievement: ${ach.name}!` });
        }
      } catch(e) {}
    }
  }

  // ── SAVE / LOAD ────────────────────────────────────────
  save() {
    this.state.lastSave = Date.now();
    try { localStorage.setItem('ashfall_save', JSON.stringify(this.state)); } catch(e) {}
  }

  loadSave() {
    try { const raw = localStorage.getItem('ashfall_save'); if (raw) return JSON.parse(raw); } catch(e) {}
    return null;
  }

  deleteSave() {
    localStorage.removeItem('ashfall_save');
    this.state = this.newGame();
    this.emit('init', this.state);
  }

  exportSave() { return btoa(JSON.stringify(this.state)); }

  importSave(str) {
    try {
      const d = JSON.parse(atob(str));
      this.state = d;
      this.migrateSave();
      this.save();
      this.emit('init', this.state);
      return true;
    } catch(e) { return false; }
  }

  // ── OFFLINE ────────────────────────────────────────────
  processOffline() {
    if (!this.state.lastSave) return;
    const offlineMs = Date.now() - this.state.lastSave;
    const offlineSec = Math.min(offlineMs / 1000, 86400);
    if (offlineSec < 10) return;
    const minutes = Math.floor(offlineSec / 60);
    let report = [];
    if (this.state.activeSkill && !this.state.combat.active) {
      const sId = this.state.activeSkill, aId = this.state.activeAction;
      const skill = GAME_DATA.skills[sId];
      if (skill) {
        const action = this._findAction(sId, aId);
        if (action) {
          const num = Math.floor(offlineSec / action.time);
          let done = 0;
          for (let i = 0; i < num; i++) {
            if (skill.type === 'artisan' && action.input && !this.hasItems(action.input)) break;
            if (skill.type === 'artisan' && action.input) this.removeItems(action.input);
            if (skill.type === 'gathering') {
              for (const drop of action.loot) this.addItem(drop.item, drop.qty);
            } else if (action.output) {
              if (action.burnChance && Math.random() < action.burnChance) { this.addXp(sId, Math.floor(action.xp * 0.2)); continue; }
              this.addItem(action.output.item, action.output.qty);
            }
            this.addXp(sId, action.xp);
            done++;
          }
          if (done > 0) report.push(`${GAME_DATA.skills[sId].name}: ${done} actions`);
        }
      }
    }
    this.tickFarming(Date.now());
    if (report.length > 0 || minutes > 0) this.emit('notification', { type:'info', text:`Offline ${minutes} min. ${report.join(', ')}` });
  }

  // ── UTIL ───────────────────────────────────────────────
  randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
  weightedRandom(items, weights) {
    const t = weights.reduce((a,b)=>a+b, 0); let r = Math.random() * t;
    for (let i = 0; i < items.length; i++) { r -= weights[i]; if (r <= 0) return items[i]; }
    return items[items.length - 1];
  }
  incrementStat(sId) {
    if (!this.state.stats.totalActions[sId]) this.state.stats.totalActions[sId] = 0;
    this.state.stats.totalActions[sId]++;
  }

  // ── RANDOM EVENTS ───────────────────────────────────────
  rollRandomEvent() {
    const roll = Math.random();
    if (roll < 0.08) {
      // Genie Lamp - grants XP in active skill
      const activeSkill = this.state.activeSkill || (this.state.combat.active ? this.state.combat.combatStyle === 'melee' ? 'attack' : this.state.combat.combatStyle : null);
      if (activeSkill && this.state.skills[activeSkill]) {
        const bonus = Math.floor(50 + this.state.skills[activeSkill].level * 15);
        this.addXp(activeSkill, bonus);
        this.emit('randomEvent', { type:'genie', text:`A mystical Genie appears! Granted ${bonus} ${GAME_DATA.skills[activeSkill]?.name} XP!` });
      }
    } else if (roll < 0.14) {
      // Treasure Goblin - bonus gold
      const gold = Math.floor(100 + this.getTotalLevel() * 5);
      this.state.gold += gold;
      this.state.stats.goldEarned += gold;
      this.emit('randomEvent', { type:'treasure', text:`A Treasure Goblin drops ${gold} gold and vanishes!` });
    } else if (roll < 0.18) {
      // Wandering Merchant - free item
      const items = ['potion_healing_ii','potion_strength','potion_defence','enchant_scroll','diamond','chaos_rune'];
      const item = items[Math.floor(Math.random() * items.length)];
      const qty = item.includes('rune') ? 10 : item.includes('potion') ? 3 : 1;
      this.addItem(item, qty);
      this.emit('randomEvent', { type:'merchant', text:`A Wandering Merchant gifts you ${qty}x ${GAME_DATA.items[item]?.name}!` });
    } else if (roll < 0.22) {
      // Mysterious Stranger - bonus XP to random skill
      const skills = Object.keys(this.state.skills);
      const skill = skills[Math.floor(Math.random() * skills.length)];
      const bonus = Math.floor(30 + this.state.skills[skill].level * 10);
      this.addXp(skill, bonus);
      this.emit('randomEvent', { type:'stranger', text:`A Mysterious Stranger whispers ancient knowledge: +${bonus} ${GAME_DATA.skills[skill]?.name} XP!` });
    } else if (roll < 0.25) {
      // AFK Check - stops your current activity until dismissed
      if (this.state.activeSkill) {
        this.emit('randomEvent', { type:'afk_check', text:'An Ancient Guardian questions your presence! Click to confirm you are here, or your training will stop.' });
        // Stop skill after 30 seconds if not dismissed
        this._afkTimeout = setTimeout(() => {
          if (this.state.activeSkill) {
            this.stopSkill();
            this.emit('notification', { type:'danger', text:'Ancient Guardian stopped your training - you were away too long!' });
          }
        }, 30000);
      }
    }
  }

  dismissAfkCheck() {
    if (this._afkTimeout) {
      clearTimeout(this._afkTimeout);
      this._afkTimeout = null;
      this.emit('notification', { type:'success', text:'Guardian dismissed. Training continues.' });
    }
  }

  // ── SUMMONING / FAMILIARS ────────────────────────────────
  activateFamiliar(pouchId) {
    const pouch = GAME_DATA.items[pouchId];
    if (!pouch || pouch.type !== 'pouch') return;
    if ((this.state.bank[pouchId] || 0) <= 0) { this.emit('notification',{type:'warn',text:'No pouches in bank.'}); return; }
    const fam = GAME_DATA.familiars?.find(f => f.id === pouch.familiar);
    if (!fam) return;
    if (this.state.skills.summoning.level < fam.level) { this.emit('notification',{type:'warn',text:`Requires Summoning level ${fam.level}.`}); return; }
    // Consume pouch
    this.state.bank[pouchId]--;
    if (this.state.bank[pouchId] <= 0) delete this.state.bank[pouchId];
    // Activate familiar
    this.state.familiar = { active:fam.id, timeLeft:fam.duration, buff:fam.buff, name:fam.name };
    this.emit('notification',{type:'success',text:`Summoned ${fam.name}! Active for ${Math.floor(fam.duration/60)} minutes.`});
  }

  dismissFamiliar() {
    this.state.familiar = { active:null, timeLeft:0 };
    this.emit('notification',{type:'info',text:'Familiar dismissed.'});
  }

  tickFamiliar(dt) {
    if (!this.state.familiar?.active) return;
    this.state.familiar.timeLeft -= dt;
    if (this.state.familiar.timeLeft <= 0) {
      this.emit('notification',{type:'info',text:`${this.state.familiar.name} has departed.`});
      this.state.familiar = { active:null, timeLeft:0 };
    }
  }

  getFamiliarBonus(stat) {
    if (!this.state.familiar?.active || !this.state.familiar.buff) return 0;
    return this.state.familiar.buff[stat] || 0;
  }

  // ── GEAR SETS ───────────────────────────────────────────
  saveGearSet(name) {
    if (!name || name.length > 20) return;
    this.state.gearSets[name] = { ...this.state.equipment };
    this.emit('notification', { type:'success', text:`Gear set "${name}" saved.` });
  }

  loadGearSet(name) {
    const set = this.state.gearSets[name];
    if (!set) return;
    // Unequip current gear back to bank
    for (const [slot, item] of Object.entries(this.state.equipment)) {
      if (item) { this.addItem(item, 1); this.state.equipment[slot] = null; }
    }
    // Equip saved gear (if in bank)
    for (const [slot, item] of Object.entries(set)) {
      if (item && this.state.bank[item] > 0) {
        this.state.bank[item]--;
        if (this.state.bank[item] <= 0) delete this.state.bank[item];
        this.state.equipment[slot] = item;
      }
    }
    this.emit('notification', { type:'success', text:`Loaded gear set "${name}".` });
  }

  deleteGearSet(name) {
    delete this.state.gearSets[name];
    this.emit('notification', { type:'info', text:`Deleted gear set "${name}".` });
  }

  // ── STORYLINE QUESTS ─────────────────────────────────────
  getStoryProgress(storyId) {
    if (!this.state.storyline[storyId]) this.state.storyline[storyId] = { chapter:0, step:0, completed:false };
    return this.state.storyline[storyId];
  }

  getCurrentStoryStep(storyId) {
    const story = (GAME_DATA.storylines||[]).find(s=>s.id===storyId);
    if (!story) return null;
    const prog = this.getStoryProgress(storyId);
    if (prog.completed) return null;
    const chapter = story.chapters[prog.chapter];
    if (!chapter) return null;
    const step = chapter.steps[prog.step];
    if (!step) return null;
    return { story, chapter, step, chapterIdx:prog.chapter, stepIdx:prog.step };
  }

  checkStoryObjective(storyId) {
    const cur = this.getCurrentStoryStep(storyId);
    if (!cur) return false;
    const obj = cur.step.objective;
    const s = this.state;
    if (obj.type === 'kill') return (s.stats.uniqueKills?.[obj.monster]||0) >= obj.qty;
    if (obj.type === 'collect') return (s.bank[obj.item]||0) >= obj.qty;
    if (obj.type === 'gold') return s.gold >= obj.amount;
    if (obj.type === 'skill') return s.skills[obj.skill]?.level >= obj.level;
    if (obj.type === 'choice') return false; // Requires manual selection
    return false;
  }

  completeStoryStep(storyId, choiceIdx) {
    const cur = this.getCurrentStoryStep(storyId);
    if (!cur) return;
    const step = cur.step;
    const rew = step.reward;

    // Grant rewards
    if (rew.gold) { this.state.gold += rew.gold; this.state.stats.goldEarned += rew.gold; }
    if (rew.xp) { for (const [skill,amt] of Object.entries(rew.xp)) this.addXp(skill, amt); }
    if (rew.items) { for (const it of rew.items) this.addItem(it.item, it.qty); }
    if (rew.rep) {
      for (const [fac,amt] of Object.entries(rew.rep)) {
        if (!this.state.factionRep) this.state.factionRep = {};
        this.state.factionRep[fac] = (this.state.factionRep[fac]||0) + amt;
      }
    }

    // Alignment shift
    if (step.alignShift) this.shiftAlignment(step.alignShift.direction, step.alignShift.amount);

    // Advance progress
    const prog = this.getStoryProgress(storyId);
    const story = cur.story;
    prog.step++;
    if (prog.step >= story.chapters[prog.chapter].steps.length) {
      prog.step = 0;
      prog.chapter++;
      if (prog.chapter >= story.chapters.length) {
        prog.completed = true;
        this.emit('notification', { type:'achievement', text:`Storyline Complete: ${story.name}!` });
      } else {
        this.emit('notification', { type:'levelup', text:`Chapter Complete: ${story.chapters[prog.chapter-1].name}` });
      }
    }
    this.emit('notification', { type:'success', text:`Quest step complete! ${rew.gold?'+'+rew.gold+'g ':''} ${rew.xp?Object.entries(rew.xp).map(([k,v])=>'+'+v+' '+k+' XP').join(', '):''}` });
  }

  // ── ALIGNMENT SYSTEM ────────────────────────────────────
  shiftAlignment(direction, amount) {
    // direction: 'good','evil','lawful','chaotic'
    // Accumulates moral/order points, shifts alignment when threshold reached
    if (!this.state.alignmentPoints) this.state.alignmentPoints = { moral:0, order:0 };
    const ap = this.state.alignmentPoints;
    if (direction === 'good') ap.moral += amount;
    else if (direction === 'evil') ap.moral -= amount;
    else if (direction === 'lawful') ap.order += amount;
    else if (direction === 'chaotic') ap.order -= amount;

    // Determine alignment from accumulated points
    const m = ap.moral > 25 ? 'G' : ap.moral < -25 ? 'E' : 'N';
    const o = ap.order > 25 ? 'L' : ap.order < -25 ? 'C' : 'N';
    const map = {
      'LG':'lawful_good','NG':'neutral_good','CG':'chaotic_good',
      'LN':'lawful_neutral','NN':'true_neutral','CN':'chaotic_neutral',
      'LE':'lawful_evil','NE':'neutral_evil','CE':'chaotic_evil',
    };
    const newAlign = map[o+m] || 'true_neutral';
    if (newAlign !== this.state.alignment) {
      const old = GAME_DATA.alignments[this.state.alignment]?.name || this.state.alignment;
      this.state.alignment = newAlign;
      const al = GAME_DATA.alignments[newAlign];
      this.emit('notification', { type:'achievement', text:`Alignment shifted to ${al.name} (${al.axis})! ${al.desc}` });
    }
  }

  _rollRareDropTable(combatLevel) {
    // Universal rare drops scaled by combat level
    const table = [
      { item:'topaz',         qty:1, weight:30, minLevel:1  },
      { item:'sapphire',      qty:1, weight:20, minLevel:10 },
      { item:'ruby',          qty:1, weight:15, minLevel:20 },
      { item:'emerald',       qty:1, weight:10, minLevel:30 },
      { item:'diamond',       qty:1, weight:5,  minLevel:45 },
      { item:'onyx',          qty:1, weight:2,  minLevel:70 },
      { item:'potion_healing_ii', qty:3, weight:15, minLevel:1 },
      { item:'potion_healing_iii',qty:2, weight:8,  minLevel:30 },
      { item:'potion_strength',   qty:2, weight:10, minLevel:10 },
      { item:'potion_speed',      qty:1, weight:5,  minLevel:40 },
      { item:'death_rune',    qty:10, weight:8,  minLevel:25 },
      { item:'chaos_rune',    qty:15, weight:10, minLevel:15 },
      { item:'enchant_scroll',qty:1,  weight:3,  minLevel:35 },
      { item:'dragon_bones',  qty:2,  weight:4,  minLevel:50 },
      { item:'obsidian_ore',  qty:3,  weight:3,  minLevel:55 },
      { item:'void_bones',    qty:1,  weight:2,  minLevel:65 },
      { item:'ancient_ring',  qty:1,  weight:1,  minLevel:80 },
    ];
    const eligible = table.filter(e => combatLevel >= e.minLevel);
    if (eligible.length === 0) return null;
    const totalWeight = eligible.reduce((s, e) => s + e.weight, 0);
    let roll = Math.random() * totalWeight;
    for (const entry of eligible) {
      roll -= entry.weight;
      if (roll <= 0) return { item: entry.item, qty: entry.qty };
    }
    return eligible[eligible.length - 1];
  }
  on(event, fn) { if (!this.listeners[event]) this.listeners[event] = []; this.listeners[event].push(fn); }
  emit(event, data) { if (this.listeners[event]) for (const fn of this.listeners[event]) fn(data); }
  getTotalLevel() { return Object.values(this.state.skills).reduce((sum, s) => sum + s.level, 0); }

  // ── PRESTIGE SYSTEM ─────────────────────────────────────
  canPrestige() {
    const cfg = GAME_DATA.prestige;
    if (!cfg?.enabled) return { ok:false, reason:'Prestige not enabled.' };
    const tl = this.getTotalLevel();
    const minTl = cfg.minTotalLevel || 2000;
    if (tl < minTl) return { ok:false, reason:`Total level ${tl}/${minTl} required.` };
    const allMax = Object.values(this.state.skills).every(s => s.level >= (cfg.skillFloor || 99));
    if (!allMax) {
      const missing = Object.entries(this.state.skills).filter(([,s])=>s.level < (cfg.skillFloor||99)).map(([id])=>GAME_DATA.skills[id]?.name||id).slice(0,3);
      return { ok:false, reason:`All skills must be 99. Missing: ${missing.join(', ')}...` };
    }
    const currentRank = this.state._prestigeRank || 0;
    if (currentRank >= (cfg.ranks?.length||5)) return { ok:false, reason:'Maximum prestige rank reached!' };
    return { ok:true };
  }

  performPrestige() {
    const check = this.canPrestige();
    if (!check.ok) { this.emit('notification', { type:'warn', text:check.reason }); return false; }
    const cfg = GAME_DATA.prestige;
    const newRank = (this.state._prestigeRank || 0) + 1;
    const rankData = cfg.ranks[newRank - 1];
    const startLevel = rankData?.bonuses?.startLevel || 1;
    const keepItems = new Set(cfg.keepItems || []);

    // Wipe bank except kept items
    const newBank = {};
    for (const [id, qty] of Object.entries(this.state.bank)) {
      if (keepItems.has(id)) newBank[id] = qty;
    }

    // Keep equipment that's in keepItems, unequip rest
    const newEquip = {};
    for (const [slot, id] of Object.entries(this.state.equipment)) {
      newEquip[slot] = id && keepItems.has(id) ? id : null;
    }

    // Reset skills to startLevel
    const newSkills = {};
    for (const [sk, data] of Object.entries(this.state.skills)) {
      newSkills[sk] = { level: startLevel, xp: GAME_DATA.xpTable?.[startLevel] || 0 };
    }

    // Apply prestige
    this.state._prestigeRank = newRank;
    this.state._prestigeHistory = [...(this.state._prestigeHistory||[]), { rank:newRank, at:Date.now(), totalLevel:this.getTotalLevel() }];
    this.state.skills = newSkills;
    this.state.bank = newBank;
    this.state.equipment = newEquip;
    this.state.gold = 0;
    this.state.questPoints = 0;
    this.state.quests = { completed:[], active:[], progress:{} };
    this.state.combat = { active:false, area:null, monster:null, combatStyle:'melee', xpMode:'controlled', autoEat:true };
    this.state.actionProgress = 0;
    this.state.activeSkill = null;
    this.state.activeAction = null;
    this.state.specEnergy = 100;
    this.state.prayerPoints = 1;
    this.state.activePrayers = [];

    this.emit('notification', { type:'achievement', text:`⭐ PRESTIGE ${newRank}: ${rankData.name}! ${rankData.desc}` });
    this.emit('prestige', { rank:newRank, rankData });
    this.emit('init');
    this.save();
    return true;
  }

  getPrestigeBonuses() {
    const rank = this.state._prestigeRank || 0;
    if (!rank || !GAME_DATA.prestige?.ranks?.[rank-1]) return {};
    return GAME_DATA.prestige.ranks[rank - 1].bonuses || {};
  }

  // ── AUTO-BANK ────────────────────────────────────────────
  _autoBankTick() {
    const cfg = this.state._autoBankConfig;
    if (!cfg?.enabled || !this.state.activeSkill) return;
    if (!this._lastAutoBank) this._lastAutoBank = Date.now();
    const elapsed = (Date.now() - this._lastAutoBank) / 1000;
    if (elapsed < (cfg.intervalSeconds || 300)) return;
    this._lastAutoBank = Date.now();
    // Nothing to do — items go directly to bank in this architecture
    // Auto-bank in our system means: sell overflow items above a qty threshold
    const overflowSell = cfg.overflow || {};
    for (const [itemId, maxQty] of Object.entries(overflowSell)) {
      const have = this.state.bank[itemId] || 0;
      const excess = have - maxQty;
      if (excess > 0) {
        this.sellItem(itemId, excess);
        this.emit('notification', { type:'info', text:`Auto-sold ${excess}x ${GAME_DATA.items[itemId]?.name || itemId}` });
      }
    }
    this.emit('notification', { type:'info', text:'Auto-bank check complete.' });
  }

  // ── PRAYER SYSTEM ──────────────────────────────────────
  buryBones(boneId, qty) {
    const boneData = GAME_DATA.boneValues[boneId];
    if (!boneData) { this.emit('notification', { type:'warn', text:'Cannot bury that.' }); return; }
    if (!this.state.bank[boneId] || this.state.bank[boneId] < qty) {
      qty = this.state.bank[boneId] || 0;
    }
    if (qty <= 0) return;
    this.removeItem(boneId, qty);
    const points = Math.floor(boneData.points * qty);
    const xp = Math.floor(boneData.xp * qty);
    this.state.prayerPoints += points;
    this.addXp('prayer', xp);
    this.state.stats.bonesBuried = (this.state.stats.bonesBuried || 0) + qty;
    // Quest tracking for bury objectives
    if (boneId === 'bones') this.trackQuestProgress('bury_bones', { qty });
    if (boneId === 'big_bones') this.trackQuestProgress('bury_big_bones', { qty });
    if (boneId === 'dragon_bones') this.trackQuestProgress('bury_dragon_bones', { qty });
    this.emit('notification', { type:'info', text:`Buried ${qty}x ${GAME_DATA.items[boneId].name}: +${points} prayer points, +${xp} XP.` });
    this.emit('bankChanged');
  }

  activatePrayer(prayerId) {
    const prayer = GAME_DATA.prayers.find(p => p.id === prayerId);
    if (!prayer) return;
    if (this.state.skills.prayer.level < prayer.level) {
      this.emit('notification', { type:'warn', text:`Requires Prayer level ${prayer.level}.` }); return;
    }
    if (this.state.prayerPoints <= 0) {
      this.emit('notification', { type:'warn', text:'No prayer points. Bury bones to gain points.' }); return;
    }
    // Toggle off if already active
    if (this.state.activePrayers.includes(prayerId)) {
      this.state.activePrayers = this.state.activePrayers.filter(id => id !== prayerId);
      this.emit('notification', { type:'info', text:`Deactivated ${prayer.name}.` });
      return;
    }

    // Protection prayers are mutually exclusive — only one at a time
    const protectionPrayers = ['protect_melee', 'protect_ranged', 'protect_magic'];
    const isProtection = protectionPrayers.includes(prayerId);
    if (isProtection) {
      // Remove any other active protection prayer
      this.state.activePrayers = this.state.activePrayers.filter(id => !protectionPrayers.includes(id));
    }

    // Max 2 active prayers total
    if (this.state.activePrayers.length >= 2) {
      this.state.activePrayers.shift(); // remove oldest
    }
    this.state.activePrayers.push(prayerId);
    this.emit('notification', { type:'info', text:`Activated ${prayer.name}.` });
  }

  deactivatePrayer(prayerId) {
    this.state.activePrayers = this.state.activePrayers.filter(id => id !== prayerId);
  }

  drainPrayerPoints() {
    if (this.state.activePrayers.length === 0) return;
    let totalCost = 0;
    for (const id of this.state.activePrayers) {
      const p = GAME_DATA.prayers.find(x => x.id === id);
      if (p) totalCost += p.pointCost;
    }
    this.state.prayerPoints -= totalCost;
    if (this.state.prayerPoints <= 0) {
      this.state.prayerPoints = 0;
      this.state.activePrayers = [];
      this.emit('notification', { type:'warn', text:'Ran out of prayer points!' });
    }
  }

  getPrayerBonus(stat) {
    let total = 0;
    for (const id of this.state.activePrayers) {
      const p = GAME_DATA.prayers.find(x => x.id === id);
      if (p?.bonus?.[stat]) total += p.bonus[stat];
    }
    return total;
  }

  // ── PET SYSTEM ─────────────────────────────────────────
  rollPetDrop(sourceId) {
    const pets = GAME_DATA.combatPets || GAME_DATA.pets || [];
    for (const pet of pets) {
      if (pet.source === sourceId && !this.state.pets.includes(pet.id)) {
        if (Math.random() < pet.dropRate) {
          this.state.pets.push(pet.id);
          this.state.stats.petsFound = (this.state.stats.petsFound || 0) + 1;
          this.emit('notification', { type:'achievement', text:`🐾 PET DROP: ${pet.name}! ${pet.desc}` });
          this.emit('petFound', pet);
        }
      }
    }
  }

  equipPet(petId) {
    if (!this.state.pets.includes(petId)) return;
    this.state.activePet = this.state.activePet === petId ? null : petId;
    if (!this.state.combat._petAttackCounter) this.state.combat._petAttackCounter = 0;
    const pets = GAME_DATA.combatPets || GAME_DATA.pets || [];
    const pet = pets.find(p => p.id === petId);
    this.emit('notification', { type:'info', text: this.state.activePet ? `${pet?.name} is now following you into battle!` : 'Pet unequipped.' });
    this.emit('petChanged');
  }

  getPetBonus(type) {
    if (!this.state.activePet) return 0;
    const pets = GAME_DATA.combatPets || GAME_DATA.pets || [];
    const pet = pets.find(p => p.id === this.state.activePet);
    if (!pet) return 0;
    // Check pet.passive object
    if (pet.passive && pet.passive[type] !== undefined) return pet.passive[type];
    // Check pet.stats object (accuracyMult, damageMult, etc.)
    if (pet.stats && pet.stats[type] !== undefined) return pet.stats[type];
    // Legacy format
    if (pet.bonus?.type === type) return pet.bonus.value || 0;
    return 0;
  }

  // ── COMBAT PET ATTACK ──────────────────────────────────
  // Called from playerAttack() after each player hit
  doPetCombatAction(monster) {
    if (!this.state.activePet || !this.state.combat.active) return;
    const pets = GAME_DATA.combatPets || GAME_DATA.pets || [];
    const pet = pets.find(p => p.id === this.state.activePet);
    if (!pet?.action) return;

    const c = this.state.combat;
    if (!c._petAttackCounter) c._petAttackCounter = 0;
    c._petAttackCounter++;
    if (c._petAttackCounter < pet.action.every) return;
    c._petAttackCounter = 0;

    const action = pet.action;
    const magicLv = this.state.skills.magic?.level || 1;
    const strLv   = this.state.skills.strength?.level || 1;

    switch (action.type) {
      case 'damage': {
        const base = action.baseDmg || 5;
        const scale = action.scaling === 'magic' ? magicLv/10 : strLv/10;
        const dmg = Math.max(1, Math.floor(base + scale + Math.random() * base));
        c.monsterHp = Math.max(0, (c.monsterHp||0) - dmg);
        this.emit('petAction', { pet, action:action.desc||'attacks', dmg, type:'damage' });
        // Apply status
        if (action.statusChance) {
          for (const [effect, chance] of Object.entries(action.statusChance)) {
            if (Math.random() < chance) {
              this._applyStatusEffect('monster', effect, { stacks: action.stacksApplied||1 });
            }
          }
        }
        break;
      }
      case 'heal': {
        const maxHp = this.getMaxHp();
        const healAmt = action.scaling === 'hp'
          ? Math.floor(maxHp * (action.amount/100))
          : action.amount || 5;
        c.playerHp = Math.min(maxHp, (c.playerHp||0) + healAmt);
        this.emit('petAction', { pet, action:action.desc||'heals', heal:healAmt, type:'heal' });
        break;
      }
      case 'status': {
        if (action.statusChance) {
          for (const [effect, chance] of Object.entries(action.statusChance)) {
            if (Math.random() < chance) {
              this._applyStatusEffect('monster', effect, { stacks: action.stacksApplied||1 });
              this.emit('petAction', { pet, action:action.desc||'applies '+effect, type:'status', effect });
            }
          }
        }
        break;
      }
      case 'debuff': {
        if (!c.statusEffects.monster._petDebuff) c.statusEffects.monster._petDebuff = {};
        c.statusEffects.monster._petDebuff[action.stat] = {
          amount: action.amount||10, timer: (action.duration||2)*1000
        };
        this.emit('petAction', { pet, action:action.desc||'debuffs', type:'debuff' });
        break;
      }
      case 'pierce': {
        const base = action.baseDmg || 8;
        const defIgnore = action.defIgnore || 0.50;
        const dmg = Math.floor(base + Math.random()*base);
        c.monsterHp = Math.max(0, (c.monsterHp||0) - dmg);
        this.emit('petAction', { pet, action:action.desc||'pierces', dmg, type:'pierce' });
        break;
      }
      case 'stun': {
        if (Math.random() < (action.stunChance||0.50)) {
          c.statusEffects.monster.stun = { stacks:1, timer:(action.stunDuration||1.5), duration:999 };
          this.emit('petAction', { pet, action:action.desc||'stuns', type:'stun' });
        }
        break;
      }
      case 'slow': {
        c.statusEffects.monster.slow = { amount:action.amount||0.20, timer:(action.duration||2.5), stacks:1, duration:999 };
        this.emit('petAction', { pet, action:action.desc||'slows', type:'slow' });
        break;
      }
      default: {
        // Handle custom pet types (olm_beam, void_strike, etc.)
        // These use action.damage as a percentage of max hit
        if (action.damage) {
          const maxHp = this.getMaxHp();
          const maxHit = this.getStatTotal('strengthBonus') + this.getStatTotal('magicBonus') + this.getStatTotal('rangedBonus');
          const dmg = Math.max(1, Math.floor((maxHit > 0 ? maxHit : maxHp * 0.1) * action.damage + Math.random() * 5));
          c.monsterHp = Math.max(0, (c.monsterHp||0) - dmg);
          this.emit('petAction', { pet, action:action.desc||action.type, dmg, type:'damage' });
        } else if (action.baseDmg) {
          // Fallback flat damage
          const dmg = Math.max(1, Math.floor(action.baseDmg + Math.random() * action.baseDmg));
          c.monsterHp = Math.max(0, (c.monsterHp||0) - dmg);
          this.emit('petAction', { pet, action:action.desc||action.type, dmg, type:'damage' });
        }
        break;
      }
    }
  }

  // ── SLAYER SYSTEM ──────────────────────────────────────
  getSlayerTask(tier) {
    const tierData = GAME_DATA.slayerTasks[tier];
    if (!tierData) return;
    if (this.state.skills.slayer.level < tierData.slayerReq) {
      this.emit('notification', { type:'warn', text:`Requires Slayer level ${tierData.slayerReq}.` }); return;
    }
    if (this.getCombatLevel() < tierData.combatReq) {
      this.emit('notification', { type:'warn', text:`Requires Combat level ${tierData.combatReq}.` }); return;
    }
    const monster = tierData.monsters[Math.floor(Math.random() * tierData.monsters.length)];
    const amount = this.randInt(tierData.killRange[0], tierData.killRange[1]);
    this.state.slayerTask = {
      tier, monster, amount, killed: 0, coins: tierData.coinReward,
    };
    const m = GAME_DATA.monsters[monster];
    this.emit('notification', { type:'info', text:`Slayer Task: Kill ${amount}x ${m?.name || monster}.` });
    this.emit('slayerChanged');
  }

  skipSlayerTask() {
    if (!this.state.slayerTask) return;
    if (this.state.slayerCoins < 30) { this.emit('notification', { type:'warn', text:'Need 30 Slayer Coins.' }); return; }
    this.state.slayerCoins -= 30;
    this.state.slayerTask = null;
    this.emit('notification', { type:'info', text:'Task skipped.' });
    this.emit('slayerChanged');
  }

  trackSlayerKill(monsterId) {
    if (!this.state.slayerTask || this.state.slayerTask.monster !== monsterId) return;
    this.state.slayerTask.killed++;
    this.state.stats.slayerKillsOnTask = (this.state.stats.slayerKillsOnTask || 0) + 1;
    // Slayer XP = 10% of monster HP
    const m = GAME_DATA.monsters[monsterId];
    if (m) {
      let slayerXp = Math.floor(m.hp * 0.10);
      // Slayer ring bonus
      if (this.state.equipment.ring === 'slayer_ring') slayerXp = Math.floor(slayerXp * 1.05);
      this.addXp('slayer', slayerXp);
    }
    if (this.state.slayerTask.killed >= this.state.slayerTask.amount) {
      this.completeSlayerTask();
    }
  }

  completeSlayerTask() {
    const task = this.state.slayerTask;
    if (!task) return;
    const coins = task.coins * task.amount;
    this.state.slayerCoins += coins;
    this.state.stats.slayerTasksCompleted = (this.state.stats.slayerTasksCompleted || 0) + 1;
    this.trackQuestProgress('slayer_tasks', { qty:1 });
    this.emit('notification', { type:'success', text:`Slayer task complete! +${coins} Slayer Coins.` });
    this.state.slayerTask = null;
    // Auto-slayer
    if (this.state.slayerAutoEnabled) {
      this.getSlayerTask(task.tier);
    }
    this.emit('slayerChanged');
  }

  buySlayerItem(shopIdx) {
    const item = GAME_DATA.slayerShop[shopIdx];
    if (!item) return;
    if (this.state.slayerCoins < item.cost) { this.emit('notification', { type:'warn', text:'Not enough Slayer Coins.' }); return; }
    this.state.slayerCoins -= item.cost;
    if (item.type === 'equipment' || item.type === 'item') {
      this.addItem(item.itemId, item.type === 'item' ? 100 : 1);
      this.emit('notification', { type:'success', text:`Purchased ${item.name}.` });
    } else if (item.type === 'upgrade' && item.id === 'auto_slayer') {
      this.state.slayerAutoEnabled = true;
      this.emit('notification', { type:'success', text:'Auto-Slayer unlocked!' });
    } else if (item.id === 'task_skip') {
      this.skipSlayerTask();
    }
    this.emit('slayerChanged');
  }

  // ── SPELLBOOK SWITCHING ────────────────────────────────
  switchSpellbook(bookId) {
    const book = GAME_DATA.spellbooks[bookId];
    if (!book) return;

    // Standard spellbook is always available
    if (bookId !== 'standard') {
      // Check skill requirements
      if (book.unlockReq) {
        for (const [sk, lv] of Object.entries(book.unlockReq)) {
          if ((this.state.skills[sk]?.level || 0) < lv) {
            this.emit('notification', { type:'warn', text:`Requires ${GAME_DATA.skills[sk]?.name||sk} level ${lv}.` }); return;
          }
        }
      }
      // Check unlock item: must have consumed the tome (tracked in unlockedSpellbooks)
      if (book.unlockItem) {
        if (!this.state.unlockedSpellbooks) this.state.unlockedSpellbooks = {};
        const alreadyUnlocked = this.state.unlockedSpellbooks[bookId];
        const hasTome = (this.state.bank[book.unlockItem] || 0) > 0;
        if (!alreadyUnlocked && !hasTome) {
          const tomeName = GAME_DATA.items[book.unlockItem]?.name || book.unlockItem;
          this.emit('notification', { type:'warn', text:`Requires ${tomeName} to unlock.` }); return;
        }
        // Auto-consume the tome and mark unlocked
        if (!alreadyUnlocked && hasTome) {
          this.removeItem(book.unlockItem, 1);
          this.state.unlockedSpellbooks[bookId] = true;
          this.emit('notification', { type:'success', text:`${book.name} spellbook unlocked!` });
        }
      }
    }

    this.state.activeSpellbook = bookId;
    this.state.combat.selectedSpell = null; // reset spell selection
    this.emit('notification', { type:'info', text:`Switched to ${book.name} spellbook.` });
  }

  getSpellsForActiveBook() {
    const book = this.state.activeSpellbook || 'standard';
    if (book === 'standard') return GAME_DATA.spells;
    const map = {
      pyromancy: GAME_DATA.pyromancySpells,
      cryomancy: GAME_DATA.cryomancySpells,
      blood_magic: GAME_DATA.bloodMagicSpells,
      void_magic: GAME_DATA.voidMagicSpells,
      necromancy: GAME_DATA.necromancySpells,
    };
    return map[book] || GAME_DATA.spells;
  }

  getActiveSpell() {
    const spells = this.getSpellsForActiveBook();
    return spells.find(s => s.id === this.state.combat.selectedSpell) || spells[0];
  }

}

const game = new GameEngine();
// Convenience aliases
game.startSkillAction   = (skill, action) => game.startSkill(skill, action);
game._calcThievingFightChance = (action) => game.calcThievingFightChancePublic(action);
