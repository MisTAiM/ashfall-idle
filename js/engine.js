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
  }

  init() {
    this.state = this.loadSave() || this.newGame();
    this.migrateSave();
    this.processOffline();
    this.startTick();
    this.autoSaveInterval = setInterval(() => this.save(), 30000);
    this.emit('init', this.state);
    this.emit('notification', { type:'info', text:'Welcome to Ashfall.' });
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
    if (s.stats.worldBossKills === undefined) s.stats.worldBossKills = 0;
    if (s.stats.questsCompleted === undefined) s.stats.questsCompleted = 0;
    s.version = 2;
  }

  // ── TICK ───────────────────────────────────────────────
  startTick() { this.tickInterval = setInterval(() => this.tick(), this.tickRate); }

  tick() {
    const now = Date.now();
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;
    this.state.stats.totalPlayTime += dt;

    if (this.state.combat.active) this.tickCombat(dt);
    else if (this.state.activeSkill && this.state.activeAction) this.tickSkill(dt);

    this.tickFarming(now);
    this.tickBuffs(dt);
    this.tickAbilityCooldowns(dt);
    this.checkAchievements();
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
    if (c.playerAttackTimer >= playerSpeed) { c.playerAttackTimer -= playerSpeed; this.playerAttack(monster); }
    c.monsterAttackTimer += dt;
    if (c.monsterAttackTimer >= monster.attackSpeed) { c.monsterAttackTimer -= monster.attackSpeed; this.monsterAttack(monster); }
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
    if (style === 'melee') {
      const aL = this.state.skills.attack.level, sL = this.state.skills.strength.level;
      const aB = this.getStatTotal('attackBonus'), sB = this.getStatTotal('strengthBonus');
      accuracy = (aL + 8) * (aB + 64);
      maxHit = Math.floor(0.5 + sL * (sB + 64) / 640);
    } else if (style === 'ranged') {
      const rL = this.state.skills.ranged.level;
      const rB = this.getStatTotal('rangedBonus') + this.getAmmoBonus();
      accuracy = (rL + 8) * (rB + 64);
      maxHit = Math.floor(0.5 + rL * (rB + 64) / 640);
      this.consumeAmmo();
    } else {
      const mL = this.state.skills.magic.level, mB = this.getStatTotal('magicBonus');
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
    const dL = this.state.skills.defence.level;
    const dB = this.getStatTotal('defenceBonus');
    const dr = this.getStatTotal('damageReduction');
    const ev = (dL + 8) * (dB + 64);
    const ac = (monster.combatLevel + 8) * 64;
    const ch = Math.min(0.95, Math.max(0.05, ac / (ac + ev)));
    if (Math.random() < ch) {
      let dmg = this.randInt(1, monster.maxHit);
      dmg = Math.max(1, Math.floor(dmg * (100 - dr) / 100));
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
    const evilBonus = (GAME_DATA.alignments[this.state.alignment]?.bonus?.combatXpEvil && monster.alignment && monster.alignment.includes('E')) ? 1.15 : 1;
    const xp = Math.floor(monster.xp * evilBonus);
    if (style === 'melee') {
      this.addXp('attack', Math.floor(xp * 0.4));
      this.addXp('strength', Math.floor(xp * 0.4));
      this.addXp('defence', Math.floor(xp * 0.2));
    } else if (style === 'ranged') {
      this.addXp('ranged', Math.floor(xp * 0.8));
      this.addXp('defence', Math.floor(xp * 0.2));
    } else {
      this.addXp('magic', Math.floor(xp * 0.8));
      this.addXp('defence', Math.floor(xp * 0.2));
    }
    this.addXp('hitpoints', Math.floor(xp * 0.33));

    if (monster.gold) {
      let g = this.randInt(monster.gold.min, monster.gold.max);
      const al = GAME_DATA.alignments[this.state.alignment];
      if (al?.bonus?.goldDrop) g = Math.floor(g * (1 + al.bonus.goldDrop/100));
      this.state.gold += g; this.state.stats.goldEarned += g;
    }

    const lootBonus = GAME_DATA.alignments[this.state.alignment]?.bonus?.lootQty || 0;
    const drops = monster.drops || monster.rewards || [];
    for (const drop of drops) {
      const ch = drop.chance * (1 + lootBonus/100);
      if (Math.random() < ch) {
        this.addItem(drop.item, drop.qty);
        if (drop.chance < 0.1) this.emit('notification', { type:'rare', text:`Rare drop: ${GAME_DATA.items[drop.item]?.name || drop.item}!` });
      }
    }

    if (monster.alignment) this.shiftAlignment(monster.alignment);
    this.trackQuestProgress('kill', { monster:mId, qty:1 });

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
    for (const buff of this.state.combat.activeBuffs) if (buff.stat === 'speedBonus') speed *= (1 - buff.value/100);
    return speed;
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

  getActiveSpell() { return GAME_DATA.spells.find(s => s.id === this.state.combat.selectedSpell) || GAME_DATA.spells[0]; }

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
    if (eff.burn)   this.applyStatus('monster', 'burn',   eff.burn,   10);
    if (eff.poison) this.applyStatus('monster', 'poison', eff.poison, 12);
    if (eff.freeze) this.applyStatus('monster', 'freeze', eff.freeze, 8);
    if (eff.magicDmg) {
      const dmg = eff.magicDmg + Math.floor(this.state.skills.magic.level * 0.5);
      c.monsterHp -= dmg;
      this.emit('combatHit', { who:'player', dmg });
    }
    if (eff.heal) c.playerHp = Math.min(this.getMaxHp(), c.playerHp + Math.floor(this.getMaxHp() * eff.heal));
    if (eff.buff) c.activeBuffs.push({ ...eff.buff, remaining: eff.buff.duration });
    if (eff.execute) {
      const m = GAME_DATA.monsters[c.monster] || GAME_DATA.worldBosses.find(b=>b.id===c.monster);
      if (m && c.monsterHp <= m.hp * 0.30) {
        const dmg = this.state.skills.strength.level * eff.execute;
        c.monsterHp -= dmg;
        this.emit('combatHit', { who:'player', dmg });
      }
    }
    this.emit('notification', { type:'info', text:`Used ${ab.name}!` });
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
  on(event, fn) { if (!this.listeners[event]) this.listeners[event] = []; this.listeners[event].push(fn); }
  emit(event, data) { if (this.listeners[event]) for (const fn of this.listeners[event]) fn(data); }
  getTotalLevel() { return Object.values(this.state.skills).reduce((sum, s) => sum + s.level, 0); }
}

const game = new GameEngine();
