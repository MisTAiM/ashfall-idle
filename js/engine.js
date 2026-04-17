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
    this.processOffline();
    this.startTick();
    this.autoSaveInterval = setInterval(() => this.save(), 30000);
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
      alignmentPoints: { good:0, evil:0, lawful:0, chaotic:0 },
      reputation: {},
      quests: { active:[], completed:[], progress:{} },
      equippedAbilities: [null, null, null, null],
      worldBossRespawns: {},
      stats: {
        totalActions:{}, monstersKilled:0, dungeonsCompleted:0, uniqueKills:{},
        totalXpGained:0, itemsCrafted:0, foodEaten:0, goldEarned:0, goldSpent:0,
        totalPlayTime:0, deaths:0, worldBossKills:0, questsCompleted:0,
      },
      achievements: [], settings: { notifications:true, autoLoot:true },
    };
  }

  migrateSave() {
    const s = this.state; if (!s) return;
    for (const id of Object.keys(GAME_DATA.skills)) {
      if (!s.skills[id]) s.skills[id] = { level:1, xp:0 };
    }
    if (!s.alignment) s.alignment = 'true_neutral';
    if (!s.alignmentPoints) s.alignmentPoints = { good:0, evil:0, lawful:0, chaotic:0 };
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
    if (!s.stats.bonesBuried) s.stats.bonesBuried = 0;
    if (!s.stats.slayerTasksCompleted) s.stats.slayerTasksCompleted = 0;
    if (!s.stats.slayerKillsOnTask) s.stats.slayerKillsOnTask = 0;
    if (!s.stats.petsFound) s.stats.petsFound = 0;
    if (!s.stats.magicKills) s.stats.magicKills = 0;
    if (!s.stats.dungeonCompletions) s.stats.dungeonCompletions = {};
    // Character profile
    if (!s.profile) s.profile = { avatarSeed:'', hair:'short04', skinColor:'c68642', hairColor:'2c1b18', accessory:'', mouth:'happy01', eyes:'variant04', clothing:'variant04', clothingColor:'4a90d4', bio:'' };
    if (!s.guild) s.guild = null;
    s.version = 2;
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

    this.tickFarming(now);
    this.tickBuffs(safeDt);
    this.tickAbilityCooldowns(safeDt);
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
    if (skill.type === 'artisan' && action.input && !this.hasItems(action.input)) {
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
    if (skill.type === 'gathering') return GAME_DATA.gatheringActions[skillId]?.find(a => a.id === actionId);
    if (skill.type === 'artisan')   return GAME_DATA.recipes[skillId]?.find(a => a.id === actionId);
    if (skillId === 'thieving')     return GAME_DATA.thievingTargets.find(a => a.id === actionId);
    return null;
  }

  tickSkill(dt) {
    const sId = this.state.activeSkill, aId = this.state.activeAction;
    if (!sId || !aId) return;
    const action = this._findAction(sId, aId);
    if (!action) { this.stopSkill(); return; }
    const reduction = 1 + (this.getMasteryLevel(sId, action.masteryId||action.id) * 0.005);
    const actionTime = action.time / reduction;
    this.state.actionProgress += dt;
    if (this.state.actionProgress >= actionTime) {
      this.state.actionProgress -= actionTime;
      this.completeAction(sId, action);
    }
  }

  completeAction(skillId, action) {
    const skill = GAME_DATA.skills[skillId];
    if (skill.type === 'gathering') {
      for (const drop of action.loot) {
        this.addItem(drop.item, drop.qty);
        this.trackQuestProgress('gather', { item:drop.item, qty:drop.qty });
      }
      if (action.gemChance && Math.random() < action.gemChance) {
        const gem = this.weightedRandom(['topaz','sapphire','ruby','emerald','diamond','onyx'], [40,25,15,10,8,2]);
        this.addItem(gem, 1);
        this.trackQuestProgress('gather', { item:gem, qty:1 });
        this.emit('notification', { type:'rare', text:`Found a ${GAME_DATA.items[gem].name}!` });
      }
    } else if (skill.type === 'artisan') {
      if (action.input && !this.hasItems(action.input)) { this.stopSkill(); this.emit('notification', { type:'warn', text:'Out of materials.' }); return; }
      if (action.input) this.removeItems(action.input);
      if (action.burnChance) {
        const reduction = this.getMasteryLevel(skillId, action.id) * 0.005;
        if (Math.random() < Math.max(0.01, action.burnChance - reduction)) {
          this.addXp(skillId, Math.floor(action.xp * 0.2));
          this.emit('notification', { type:'warn', text:`Burned the ${action.name.replace('Cook ','')}!` });
          this.incrementStat(skillId); return;
        }
      }
      this.addItem(action.output.item, action.output.qty);
      this.state.stats.itemsCrafted++;
      this.trackQuestProgress('craft', { item:action.output.item, qty:action.output.qty });
    } else if (skillId === 'thieving') {
      const reduction = this.getMasteryLevel(skillId, action.id) * 0.003;
      if (Math.random() < Math.max(0.05, action.stunChance - reduction)) {
        this.state.actionProgress = -action.stunTime;
        this.emit('notification', { type:'warn', text:`Stunned by the ${action.name}!` }); return;
      }
      const gold = this.randInt(action.gold.min, action.gold.max);
      this.state.gold += gold; this.state.stats.goldEarned += gold;
      for (const drop of (action.loot || [])) {
        if (Math.random() < drop.chance) this.addItem(drop.item, drop.qty);
      }
      this.trackQuestProgress('thieve', { target:action.id, qty:1 });
    }
    this.addXp(skillId, action.xp);
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
    const area = GAME_DATA.combatAreas.find(a => a.id === areaId);
    if (!area || !area.monsters.includes(monsterId)) return;
    if (this.getCombatLevel() < area.levelReq) { this.emit('notification', { type:'warn', text:`Requires combat level ${area.levelReq}.` }); return; }
    const monster = GAME_DATA.monsters[monsterId]; if (!monster) return;
    this._setupCombat(monster, monsterId);
    this.state.combat.area = areaId;
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
  }

  stopCombat() {
    const c = this.state.combat;
    c.active = false; c.area = null; c.monster = null; c.dungeon = null; c.worldBoss = null;
    c.statusEffects = { player:{}, monster:{} };
    c.playerHp = this.getMaxHp();
    this.emit('combatStop');
  }

  tickCombat(dt) {
    const c = this.state.combat;
    if (!c.active || !c.monster) return;
    const isWB = !!c.worldBoss;
    const monster = isWB ? GAME_DATA.worldBosses.find(b=>b.id===c.monster) : GAME_DATA.monsters[c.monster];
    if (!monster) return;
    if (c.autoEat && c.playerHp < this.getMaxHp() * 0.4) this.eatFood();
    this._tickStatusEffects(c.statusEffects.monster, dt, 'monster');
    this._tickStatusEffects(c.statusEffects.player, dt, 'player');
    const playerSpeed = this.getPlayerAttackSpeed();
    c.playerAttackTimer += dt;
    if (c.playerAttackTimer >= playerSpeed) { c.playerAttackTimer -= playerSpeed; this.playerAttack(monster); this.drainPrayerPoints(); }
    c.monsterAttackTimer += dt;
    const monsterSpeed = monster.attackSpeed * 0.7;
    if (c.monsterAttackTimer >= monsterSpeed) { c.monsterAttackTimer -= monsterSpeed; this.monsterAttack(monster); }
    if (c.monsterHp <= 0) this.onMonsterDeath(monster, isWB);
    if (c.playerHp <= 0) this.onPlayerDeath();
  }

  _tickStatusEffects(effects, dt, target) {
    for (const [key, fx] of Object.entries(effects)) {
      fx.elapsed = (fx.elapsed || 0) + dt;
      const def = GAME_DATA.statusEffects[key]; if (!def) { delete effects[key]; continue; }
      if (fx.elapsed >= def.tick) {
        fx.elapsed = 0;
        let dmg = def.baseDmg * fx.stacks;
        if (key === 'burn') dmg = def.baseDmg * Math.pow(1.3, fx.stacks - 1);
        dmg = Math.floor(dmg);
        if (target === 'monster') this.state.combat.monsterHp -= dmg;
        else this.state.combat.playerHp -= dmg;
        if (key === 'poison' && fx.stacks >= def.explodeStacks) {
          if (target === 'monster') this.state.combat.monsterHp -= def.explodeDmg;
          else this.state.combat.playerHp -= def.explodeDmg;
          delete effects[key]; continue;
        }
        fx.duration -= def.tick;
        if (fx.duration <= 0) delete effects[key];
      }
    }
  }

  applyStatus(target, type, stacks, duration = 8) {
    const e = target === 'monster' ? this.state.combat.statusEffects.monster : this.state.combat.statusEffects.player;
    if (!e[type]) e[type] = { stacks:0, duration:0, elapsed:0 };
    e[type].stacks = Math.min((e[type].stacks||0) + stacks, 10);
    e[type].duration = Math.max(e[type].duration, duration);
  }

  playerAttack(monster) {
    const style = this.state.combat.combatStyle;
    let accuracy, maxHit;
    // Prayer percentage bonuses
    const pAtkB = this.getPrayerBonus('attackBonus');
    const pStrB = this.getPrayerBonus('strengthBonus');
    const pDefB = this.getPrayerBonus('defenceBonus');
    const pRngB = this.getPrayerBonus('rangedBonus');
    const pMagB = this.getPrayerBonus('magicBonus');

    if (style === 'melee') {
      const aL = Math.floor(this.state.skills.attack.level * (1 + pAtkB/100));
      const sL = Math.floor(this.state.skills.strength.level * (1 + pStrB/100));
      const aB = this.getStatTotal('attackBonus'), sB = this.getStatTotal('strengthBonus');
      accuracy = (aL + 8) * (aB + 64);
      maxHit = Math.floor(0.5 + sL * (sB + 64) / 640);
    } else if (style === 'ranged') {
      const rL = Math.floor(this.state.skills.ranged.level * (1 + pRngB/100));
      const rB = this.getStatTotal('rangedBonus') + this.getAmmoBonus();
      accuracy = (rL + 8) * (rB + 64);
      maxHit = Math.floor(0.5 + rL * (rB + 64) / 640);
      this.consumeAmmo();
    } else {
      const mL = Math.floor(this.state.skills.magic.level * (1 + pMagB/100));
      const mB = this.getStatTotal('magicBonus');
      const spell = this.getActiveSpell();
      accuracy = (mL + 8) * (mB + 64);
      maxHit = spell ? spell.maxHit + Math.floor(mB * 0.5) : Math.floor(mL * 0.3);
      if (spell && !this.consumeRunes(spell)) { this.emit('notification', { type:'warn', text:'Out of runes!' }); this.stopCombat(); return; }
    }
    maxHit = Math.max(maxHit, 1);
    const align = GAME_DATA.alignments[this.state.alignment];
    if (align?.bonus?.globalDmg) maxHit = Math.floor(maxHit * (1 + align.bonus.globalDmg/100));
    if (align?.bonus?.strengthDmg && style === 'melee') maxHit = Math.floor(maxHit * (1 + align.bonus.strengthDmg/100));
    for (const buff of this.state.combat.activeBuffs) {
      if (buff.stat === 'damageMult') maxHit = Math.floor(maxHit * buff.value);
    }
    const evasion = monster.evasion?.[style] || 0;
    const defence = (1 + 8) * (evasion + 64);
    const hitChance = Math.min(0.95, Math.max(0.05, accuracy / (accuracy + defence)));
    if (Math.random() < hitChance) {
      let dmg = this.randInt(1, maxHit);
      const fz = this.state.combat.statusEffects.monster.freeze;
      if (fz) { dmg *= 3; delete this.state.combat.statusEffects.monster.freeze; }
      this.state.combat.monsterHp -= dmg;
      if (style === 'magic') {
        const sp = this.getActiveSpell();
        if (sp?.statusChance) {
          for (const [fx, ch] of Object.entries(sp.statusChance)) {
            if (Math.random() < ch) this.applyStatus('monster', fx, 1, 8);
          }
        }
      }
      this.emit('combatHit', { who:'player', dmg });
    } else {
      this.emit('combatHit', { who:'player', dmg:0, miss:true });
    }
  }

  monsterAttack(monster) {
    const dL = Math.floor(this.state.skills.defence.level * (1 + this.getPrayerBonus('defenceBonus')/100));
    const dB = this.getStatTotal('defenceBonus');
    const dr = this.getStatTotal('damageReduction');
    const ev = (dL + 8) * (dB + 64);
    const ac = (monster.combatLevel + 8) * 64;
    const ch = Math.min(0.95, Math.max(0.05, ac / (ac + ev)));
    if (Math.random() < ch) {
      let dmg = this.randInt(1, monster.maxHit);
      dmg = Math.max(1, Math.floor(dmg * (100 - dr) / 100));
      // Prayer protection
      const protMelee = this.getPrayerBonus('protectMelee');
      const protRanged = this.getPrayerBonus('protectRanged');
      const protMagic = this.getPrayerBonus('protectMagic');
      if (monster.style === 'melee' && protMelee) dmg = Math.max(1, Math.floor(dmg * (100 - protMelee) / 100));
      if (monster.style === 'ranged' && protRanged) dmg = Math.max(1, Math.floor(dmg * (100 - protRanged) / 100));
      if (monster.style === 'magic' && protMagic) dmg = Math.max(1, Math.floor(dmg * (100 - protMagic) / 100));
      this.state.combat.playerHp -= dmg;
      this.emit('combatHit', { who:'monster', dmg });
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
    // Emit XP gain notification so player can SEE what they got
    const xpParts = [];
    if (style === 'melee') {
      if (xpMode === 'accurate')        xpParts.push(`+${Math.floor(xp*0.9)} Atk`);
      else if (xpMode === 'aggressive') xpParts.push(`+${Math.floor(xp*0.9)} Str`);
      else if (xpMode === 'defensive')  xpParts.push(`+${Math.floor(xp*0.9)} Def`);
      else { xpParts.push(`+${Math.floor(xp*0.33)} Atk`); xpParts.push(`+${Math.floor(xp*0.33)} Str`); xpParts.push(`+${Math.floor(xp*0.34)} Def`); }
    } else if (style === 'ranged') {
      xpParts.push(`+${Math.floor(xp*0.8)} Rng`);
    } else {
      xpParts.push(`+${Math.floor(xp*0.8)} Mag`);
    }
    xpParts.push(`+${Math.floor(xp*0.33)} HP`);
    this.emit('xpGain', { text: xpParts.join(', '), total: xp });

    if (monster.gold) {
      let g = this.randInt(monster.gold.min, monster.gold.max);
      const al = GAME_DATA.alignments[this.state.alignment];
      if (al?.bonus?.goldDrop) g = Math.floor(g * (1 + al.bonus.goldDrop/100));
      this.state.gold += g; this.state.stats.goldEarned += g;
    }

    const lootBonus = GAME_DATA.alignments[this.state.alignment]?.bonus?.lootQty || 0;
    const petLootBonus = this.getPetBonus('lootQty');
    const drops = monster.drops || monster.rewards || [];
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
        if (drop.chance < 0.05) this.emit('notification', { type:'rare', text:`Rare drop: ${GAME_DATA.items[drop.item]?.name || drop.item}!` });
        else if (drop.chance < 0.10) this.emit('notification', { type:'rare', text:`Uncommon: ${GAME_DATA.items[drop.item]?.name || drop.item}!` });
      }
    }
    // Universal Rare Drop Table (1/200 chance per kill, better monsters = better table)
    if (Math.random() < 0.005 * (1 + monster.combatLevel / 100)) {
      const rdt = this._rollRareDropTable(monster.combatLevel);
      if (rdt) {
        this.addItem(rdt.item, rdt.qty);
        this.emit('notification', { type:'achievement', text:`RARE DROP TABLE: ${GAME_DATA.items[rdt.item]?.name}!` });
      }
    }

    if (monster.alignment) this.shiftAlignment(monster.alignment);
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
        this.state.combat.monster = nextId;
        this.state.combat.monsterHp = next.hp;
        this.state.combat.monsterAttackTimer = 0;
        this.state.combat.statusEffects.monster = {};
      }
    } else {
      this.state.combat.monsterHp = monster.hp;
      this.state.combat.monsterAttackTimer = 0;
      this.state.combat.statusEffects.monster = {};
    }
    this.state.combat.playerAttackTimer = 0;
  }

  onPlayerDeath() {
    this.state.stats.deaths++;
    this.emit('notification', { type:'danger', text:'You have been defeated!' });
    this.stopCombat();
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

  getPlayerAttackSpeed() {
    const w = this.getEquippedItem('weapon');
    let speed = w ? w.attackSpeed : 2.4;
    // Global speed boost - 40% faster combat
    speed *= 0.6;
    for (const buff of this.state.combat.activeBuffs) if (buff.stat === 'speedBonus') speed *= (1 - buff.value/100);
    return Math.max(0.4, speed);
  }

  getStatTotal(stat) {
    let total = 0;
    for (const slot of GAME_DATA.equipmentSlots) {
      const item = this.getEquippedItem(slot);
      if (item?.stats?.[stat]) total += item.stats[stat];
    }
    for (const buff of this.state.combat.activeBuffs) if (buff.stat === stat) total += buff.value;
    return total;
  }

  getEquippedItem(slot) { return this.state.equipment[slot] ? GAME_DATA.items[this.state.equipment[slot]] : null; }
  getAmmoBonus() { return this.getEquippedItem('ammo')?.rangedBonus || 0; }

  consumeAmmo() {
    const id = this.state.equipment.ammo;
    if (id && this.state.bank[id] > 0) {
      this.state.bank[id]--;
      if (this.state.bank[id] <= 0) { this.state.equipment.ammo = null; this.emit('notification', { type:'warn', text:'Out of ammo!' }); }
    }
  }

  consumeRunes(spell) { if (!this.hasItems(spell.runes)) return false; this.removeItems(spell.runes); return true; }

  // ── ABILITIES ──────────────────────────────────────────
  useAbility(slotIdx) {
    const c = this.state.combat;
    if (!c.active) return;
    const id = this.state.equippedAbilities[slotIdx]; if (!id) return;
    const ab = GAME_DATA.abilities.find(a => a.id === id); if (!ab) return;
    if ((c.abilityCooldowns[id] || 0) > 0) { this.emit('notification', { type:'warn', text:'On cooldown.' }); return; }
    if (this.state.skills.tactics.level < ab.tacticsReq) return;
    c.abilityCooldowns[id] = ab.cooldown;
    const eff = ab.effect;
    let totalDmg = 0;

    // Status effects on monster
    if (eff.burn)   this.applyStatus('monster', 'burn',   eff.burn,   10);
    if (eff.poison) this.applyStatus('monster', 'poison', eff.poison, 12);
    if (eff.freeze) this.applyStatus('monster', 'freeze', eff.freeze, 8);

    // Direct damage (fireball, shadow step, soul drain)
    if (eff.directDmg) {
      const baseDmg = eff.directDmg + Math.floor(this.state.skills.magic.level * 0.5);
      totalDmg += baseDmg;
    }

    // Instant physical damage (quick shot, double shot)
    if (eff.instantDmg) {
      const style = c.combatStyle;
      let maxHit;
      if (style === 'ranged') {
        const rL = this.state.skills.ranged.level;
        const rB = this.getStatTotal('rangedBonus') + this.getAmmoBonus();
        maxHit = Math.max(1, Math.floor(0.5 + rL * (rB + 64) / 640));
      } else {
        const sL = this.state.skills.strength.level;
        const sB = this.getStatTotal('strengthBonus');
        maxHit = Math.max(1, Math.floor(0.5 + sL * (sB + 64) / 640));
      }
      const mult = eff.dmgMult || 1;
      const hits = eff.hits || 1;
      for (let i = 0; i < hits; i++) {
        totalDmg += Math.floor(this.randInt(1, maxHit) * mult);
      }
    }

    // Execute - multiplied damage if target below threshold
    if (eff.execute) {
      const m = GAME_DATA.monsters[c.monster] || GAME_DATA.worldBosses.find(b=>b.id===c.monster);
      if (m && c.monsterHp <= m.hp * 0.30) {
        totalDmg += Math.floor(this.state.skills.strength.level * eff.execute);
      } else {
        this.emit('notification', { type:'warn', text:'Target above 30% HP.' });
      }
    }

    // Apply total damage to monster
    if (totalDmg > 0) {
      c.monsterHp -= totalDmg;
      this.emit('combatHit', { who:'player', dmg: totalDmg });
      // Lifesteal
      if (eff.lifesteal) {
        const healed = Math.floor(totalDmg * eff.lifesteal);
        c.playerHp = Math.min(this.getMaxHp(), c.playerHp + healed);
      }
    }

    // Heal ability
    if (eff.heal) c.playerHp = Math.min(this.getMaxHp(), c.playerHp + Math.floor(this.getMaxHp() * eff.heal));

    // Buff ability (war cry, power strike, rallying cry)
    if (eff.buff) c.activeBuffs.push({ ...eff.buff, remaining: eff.buff.duration });

    this.emit('notification', { type:'info', text:`Used ${ab.name}${totalDmg>0?' ('+totalDmg+' dmg)':''}!` });
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
    if (this.state.food.equipped === itemId) {
      const amt = Math.min(this.state.bank[itemId], 28 - this.state.food.qty);
      this.state.bank[itemId] -= amt; this.state.food.qty += amt;
    } else {
      if (this.state.food.equipped && this.state.food.qty > 0) this.addItem(this.state.food.equipped, this.state.food.qty);
      const amt = Math.min(this.state.bank[itemId], 28);
      this.state.bank[itemId] -= amt;
      this.state.food.equipped = itemId;
      this.state.food.qty = amt;
    }
    this.emit('foodChanged');
  }

  eatFood() {
    if (!this.state.food.equipped || this.state.food.qty <= 0) return;
    const item = GAME_DATA.items[this.state.food.equipped]; if (!item) return;
    const max = this.getMaxHp();
    if (this.state.combat.playerHp >= max) return;
    this.state.combat.playerHp = Math.min(max, this.state.combat.playerHp + (item.heals || 0));
    this.state.food.qty--;
    this.state.stats.foodEaten++;
    if (this.state.food.qty <= 0) this.state.food.equipped = null;
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
    this.addItem(id, 1);
    this.state.equipment[slot] = null;
    this.emit('equipmentChanged');
  }

  // ── BANK ───────────────────────────────────────────────
  addItem(id, qty) {
    if (!this.state.bank[id]) this.state.bank[id] = 0;
    this.state.bank[id] += qty;
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
  }

  // ── FARMING ────────────────────────────────────────────
  plantSeed(idx, seedId) {
    if (idx < 0 || idx >= this.state.farming.plots.length) return;
    const plot = this.state.farming.plots[idx];
    if (plot.seed) return;
    const seed = GAME_DATA.items[seedId];
    if (!seed || seed.type !== 'seed') return;
    if (!this.state.bank[seedId] || this.state.bank[seedId] <= 0) return;
    this.removeItem(seedId, 1);
    plot.seed = seedId;
    plot.plantedAt = Date.now();
    plot.growTime = seed.growTime * 1000;
    plot.ready = false;
    this.emit('farmingChanged');
  }

  harvestPlot(idx) {
    if (idx < 0 || idx >= this.state.farming.plots.length) return;
    const plot = this.state.farming.plots[idx];
    if (!plot.seed || !plot.ready) return;
    const seed = GAME_DATA.items[plot.seed];
    const yId = seed.yield;
    const qty = this.randInt(3, 8);
    this.addItem(yId, qty);
    this.addXp('farming', Math.floor(qty * 10));
    if (Math.random() < 0.40) this.addItem(plot.seed, 1);
    this.trackQuestProgress('gather', { item:yId, qty });
    plot.seed = null; plot.plantedAt = null; plot.growTime = 0; plot.ready = false;
    this.emit('farmingChanged');
    this.emit('notification', { type:'success', text:`Harvested ${qty}x ${GAME_DATA.items[yId].name}!` });
  }

  tickFarming(now) {
    for (const plot of this.state.farming.plots) {
      if (plot.seed && plot.plantedAt && !plot.ready) {
        if (now - plot.plantedAt >= plot.growTime) plot.ready = true;
      }
    }
  }

  // ── ALIGNMENT ──────────────────────────────────────────
  shiftAlignment(monsterAxis) {
    // Killing evil creatures shifts you toward good, etc.
    const ap = this.state.alignmentPoints;
    if (monsterAxis.includes('E')) ap.good += 1;
    if (monsterAxis.includes('G')) ap.evil += 1;
    if (monsterAxis.includes('C')) ap.lawful += 0.3;
    if (monsterAxis.includes('L')) ap.chaotic += 0.3;
    this.recomputeAlignment();
  }

  recomputeAlignment() {
    const ap = this.state.alignmentPoints;
    const mAxis = ap.lawful >= ap.chaotic + 50 ? 'L' : ap.chaotic >= ap.lawful + 50 ? 'C' : 'N';
    const eAxis = ap.good >= ap.evil + 50 ? 'G' : ap.evil >= ap.good + 50 ? 'E' : 'N';
    const map = {'LG':'lawful_good','NG':'neutral_good','CG':'chaotic_good','LN':'lawful_neutral','NN':'true_neutral','CN':'chaotic_neutral','LE':'lawful_evil','NE':'neutral_evil','CE':'chaotic_evil'};
    const next = map[mAxis + eAxis] || 'true_neutral';
    if (next !== this.state.alignment) {
      this.state.alignment = next;
      this.emit('notification', { type:'info', text:`Your alignment has shifted to ${GAME_DATA.alignments[next].name}.` });
    }
  }

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
    if (this.state.quests.completed.includes(questId)) return;
    if (this.state.quests.active.includes(questId)) return;
    if (q.prereq && !this.state.quests.completed.includes(q.prereq)) {
      this.emit('notification', { type:'warn', text:'Complete prior quest first.' }); return;
    }
    this.state.quests.active.push(questId);
    this.state.quests.progress[questId] = q.objectives.map(() => 0);
    this.emit('notification', { type:'info', text:`Accepted: ${q.name}` });
    this.emit('questsChanged');
  }

  abandonQuest(questId) {
    const i = this.state.quests.active.indexOf(questId);
    if (i >= 0) { this.state.quests.active.splice(i, 1); delete this.state.quests.progress[questId]; this.emit('questsChanged'); }
  }

  trackQuestProgress(type, data) {
    for (const qId of this.state.quests.active) {
      const q = GAME_DATA.quests.find(x => x.id === qId); if (!q) continue;
      const prog = this.state.quests.progress[qId] || [];
      let updated = false;
      q.objectives.forEach((obj, i) => {
        if (obj.type !== type) return;
        if (type === 'kill' && obj.monster === data.monster) { prog[i] = Math.min(obj.qty, (prog[i]||0) + data.qty); updated = true; }
        if (type === 'gather' && obj.item === data.item) { prog[i] = Math.min(obj.qty, (prog[i]||0) + data.qty); updated = true; }
        if (type === 'craft' && obj.item === data.item) { prog[i] = Math.min(obj.qty, (prog[i]||0) + data.qty); updated = true; }
        if (type === 'thieve' && obj.target === data.target) { prog[i] = Math.min(obj.qty, (prog[i]||0) + data.qty); updated = true; }
        // v3 quest types
        if (type === 'bury_bones' && obj.type === 'bury_bones') { prog[i] = Math.min(obj.qty, (prog[i]||0) + (data.qty||0)); updated = true; }
        if (type === 'bury_big_bones' && obj.type === 'bury_big_bones') { prog[i] = Math.min(obj.qty, (prog[i]||0) + (data.qty||0)); updated = true; }
        if (type === 'bury_dragon_bones' && obj.type === 'bury_dragon_bones') { prog[i] = Math.min(obj.qty, (prog[i]||0) + (data.qty||0)); updated = true; }
        if (type === 'slayer_tasks' && obj.type === 'slayer_tasks') { prog[i] = Math.min(obj.qty, (this.state.stats.slayerTasksCompleted||0)); updated = true; }
        if (type === 'slayer_kills' && obj.type === 'slayer_kills') { prog[i] = Math.min(obj.qty, (this.state.stats.slayerKillsOnTask||0)); updated = true; }
        if (type === 'magic_kills' && obj.type === 'magic_kills') { prog[i] = Math.min(obj.qty, (this.state.stats.magicKills||0)); updated = true; }
        if (type === 'skill_level' && obj.type === 'skill_level' && data.skill === obj.skill) { prog[i] = data.level >= obj.level ? obj.qty : 0; updated = true; }
        if (type === 'dungeon' && obj.type === 'dungeon' && data.dungeon === obj.dungeon) { prog[i] = Math.min(obj.qty, (prog[i]||0) + 1); updated = true; }
      });
      // Gold quest type — checked on tick
      q.objectives.forEach((obj, i) => {
        if (obj.type === 'gold') { prog[i] = Math.min(obj.qty, this.state.gold); updated = true; }
      });
      if (updated) this.state.quests.progress[qId] = prog;
      // Check completion
      if (q.objectives.every((obj, i) => (prog[i] || 0) >= obj.qty)) this.completeQuest(qId);
    }
  }

  completeQuest(questId) {
    const q = GAME_DATA.quests.find(x => x.id === questId); if (!q) return;
    const i = this.state.quests.active.indexOf(questId);
    if (i < 0) return;
    this.state.quests.active.splice(i, 1);
    this.state.quests.completed.push(questId);
    delete this.state.quests.progress[questId];
    if (q.rewards.gold) { this.state.gold += q.rewards.gold; this.state.stats.goldEarned += q.rewards.gold; }
    if (q.rewards.xp) for (const [sk, amt] of Object.entries(q.rewards.xp)) this.addXp(sk, amt);
    if (q.rewards.rep) for (const [fac, amt] of Object.entries(q.rewards.rep)) this.addReputation(fac, amt);
    if (q.rewards.items) for (const it of q.rewards.items) this.addItem(it.item, it.qty);
    this.state.stats.questsCompleted++;
    this.emit('notification', { type:'achievement', text:`Quest complete: ${q.name}!` });
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
    // Max 2 active prayers
    if (this.state.activePrayers.includes(prayerId)) {
      this.state.activePrayers = this.state.activePrayers.filter(id => id !== prayerId);
      this.emit('notification', { type:'info', text:`Deactivated ${prayer.name}.` });
      return;
    }
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
    if (!GAME_DATA.pets) return;
    for (const pet of GAME_DATA.pets) {
      if (pet.source === sourceId && !this.state.pets.includes(pet.id)) {
        if (Math.random() < pet.dropRate) {
          this.state.pets.push(pet.id);
          this.state.stats.petsFound = (this.state.stats.petsFound || 0) + 1;
          this.emit('notification', { type:'achievement', text:`PET DROP: ${pet.name}! ${pet.desc}` });
          this.emit('petFound', pet);
        }
      }
    }
  }

  equipPet(petId) {
    if (!this.state.pets.includes(petId)) return;
    this.state.activePet = this.state.activePet === petId ? null : petId;
    const pet = GAME_DATA.pets.find(p => p.id === petId);
    this.emit('notification', { type:'info', text: this.state.activePet ? `Equipped ${pet.name}.` : `Unequipped pet.` });
  }

  getPetBonus(type) {
    if (!this.state.activePet) return 0;
    const pet = GAME_DATA.pets.find(p => p.id === this.state.activePet);
    if (pet?.bonus?.type === type) return pet.bonus.value || 0;
    return 0;
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
    if (book.unlockReq) {
      for (const [sk, lv] of Object.entries(book.unlockReq)) {
        if (this.state.skills[sk]?.level < lv) {
          this.emit('notification', { type:'warn', text:`Requires ${GAME_DATA.skills[sk]?.name} level ${lv}.` }); return;
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
