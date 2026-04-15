// ============================================================
// ASHFALL IDLE - Game Engine
// ============================================================

class GameEngine {
  constructor() {
    this.tickRate = 100; // ms per tick
    this.tickInterval = null;
    this.lastTick = Date.now();
    this.state = null;
    this.listeners = {};
    this.notifications = [];
    this.autoSaveInterval = null;
  }

  // ── INITIALIZATION ──────────────────────────────────────
  init() {
    this.state = this.loadSave() || this.newGame();
    this.processOffline();
    this.startTick();
    this.autoSaveInterval = setInterval(() => this.save(), 30000);
    this.emit('init', this.state);
    this.emit('notification', { type: 'info', text: 'Welcome back to Ashfall.' });
  }

  newGame() {
    const skills = {};
    for (const [id, data] of Object.entries(GAME_DATA.skills)) {
      skills[id] = { level: id === 'hitpoints' ? 10 : 1, xp: id === 'hitpoints' ? 1154 : 0 };
    }
    return {
      version: 3,
      created: Date.now(),
      lastSave: Date.now(),
      gold: 25,
      skills,
      bank: { oak_log: 0, copper_ore: 0, tin_ore: 0, raw_shrimp: 0 },
      equipment: { weapon:null,shield:null,head:null,body:null,legs:null,boots:null,gloves:null,ring:null,amulet:null,cape:null,ammo:null },
      food: { equipped: null, qty: 0 },
      activeSkill: null,
      activeAction: null,
      actionProgress: 0,
      combat: {
        active: false,
        area: null,
        monster: null,
        dungeon: null,
        dungeonWave: 0,
        playerHp: this.getMaxHp(skills),
        monsterHp: 0,
        playerAttackTimer: 0,
        monsterAttackTimer: 0,
        selectedSpell: null,
        combatStyle: 'melee',
        loot: [],
        autoEat: true,
      },
      farming: {
        plots: [
          { seed: null, plantedAt: null, growTime: 0, ready: false },
          { seed: null, plantedAt: null, growTime: 0, ready: false },
          { seed: null, plantedAt: null, growTime: 0, ready: false },
        ],
      },
      mastery: {},
      stats: {
        totalActions: {},
        monstersKilled: 0,
        dungeonsCompleted: 0,
        uniqueKills: {},
        totalXpGained: 0,
        itemsCrafted: 0,
        foodEaten: 0,
        goldEarned: 0,
        goldSpent: 0,
        totalPlayTime: 0,
        deaths: 0,
      },
      achievements: [],
      settings: {
        notifications: true,
        autoLoot: true,
      },
    };
  }

  // ── TICK SYSTEM ─────────────────────────────────────────
  startTick() {
    this.tickInterval = setInterval(() => this.tick(), this.tickRate);
  }

  tick() {
    const now = Date.now();
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;
    this.state.stats.totalPlayTime += dt;

    if (this.state.combat.active) {
      this.tickCombat(dt);
    } else if (this.state.activeSkill && this.state.activeAction) {
      this.tickSkill(dt);
    }

    this.tickFarming(now);
    this.checkAchievements();
    this.emit('tick', this.state);
  }

  // ── SKILL PROCESSING ───────────────────────────────────
  startSkill(skillId, actionId) {
    if (this.state.combat.active) {
      this.emit('notification', { type: 'warn', text: 'Cannot train skills during combat.' });
      return;
    }
    const skill = GAME_DATA.skills[skillId];
    if (!skill) return;

    let action = null;
    if (skill.type === 'gathering') {
      action = GAME_DATA.gatheringActions[skillId]?.find(a => a.id === actionId);
    } else if (skill.type === 'artisan') {
      action = GAME_DATA.recipes[skillId]?.find(a => a.id === actionId);
    } else if (skillId === 'thieving') {
      action = GAME_DATA.thievingTargets.find(a => a.id === actionId);
    }
    if (!action) return;

    if (this.state.skills[skillId].level < action.level) {
      this.emit('notification', { type: 'warn', text: `Requires ${skill.name} level ${action.level}.` });
      return;
    }

    // Check materials for artisan skills
    if (skill.type === 'artisan' && action.input) {
      if (!this.hasItems(action.input)) {
        this.emit('notification', { type: 'warn', text: 'Missing required materials.' });
        return;
      }
    }

    this.state.activeSkill = skillId;
    this.state.activeAction = actionId;
    this.state.actionProgress = 0;
    this.emit('skillStart', { skill: skillId, action: actionId });
  }

  stopSkill() {
    this.state.activeSkill = null;
    this.state.activeAction = null;
    this.state.actionProgress = 0;
    this.emit('skillStop');
  }

  tickSkill(dt) {
    const skillId = this.state.activeSkill;
    const actionId = this.state.activeAction;
    const skill = GAME_DATA.skills[skillId];
    if (!skill) { this.stopSkill(); return; }

    let action = null;
    if (skill.type === 'gathering') {
      action = GAME_DATA.gatheringActions[skillId]?.find(a => a.id === actionId);
    } else if (skill.type === 'artisan') {
      action = GAME_DATA.recipes[skillId]?.find(a => a.id === actionId);
    } else if (skillId === 'thieving') {
      action = GAME_DATA.thievingTargets.find(a => a.id === actionId);
    }
    if (!action) { this.stopSkill(); return; }

    const timeReduction = 1 + (this.getMasteryLevel(skillId, action.masteryId || action.id) * 0.005);
    const actionTime = action.time / timeReduction;
    this.state.actionProgress += dt;

    if (this.state.actionProgress >= actionTime) {
      this.state.actionProgress -= actionTime;
      this.completeAction(skillId, action);
    }
  }

  completeAction(skillId, action) {
    const skill = GAME_DATA.skills[skillId];

    if (skill.type === 'gathering') {
      // Give loot
      for (const drop of action.loot) {
        this.addItem(drop.item, drop.qty);
      }
      // Gem chance for mining
      if (action.gemChance && Math.random() < action.gemChance) {
        const gems = ['topaz','sapphire','ruby','emerald','diamond','onyx'];
        const weights = [40,25,15,10,8,2];
        const gem = this.weightedRandom(gems, weights);
        this.addItem(gem, 1);
        this.emit('notification', { type: 'rare', text: `Found a ${GAME_DATA.items[gem].name}!` });
      }
    } else if (skill.type === 'artisan') {
      // Check and consume materials
      if (action.input && !this.hasItems(action.input)) {
        this.stopSkill();
        this.emit('notification', { type: 'warn', text: 'Ran out of materials.' });
        return;
      }
      if (action.input) this.removeItems(action.input);

      // Burn chance for cooking
      if (action.burnChance) {
        const masteryReduction = this.getMasteryLevel(skillId, action.id) * 0.005;
        if (Math.random() < Math.max(0.01, action.burnChance - masteryReduction)) {
          this.addXp(skillId, Math.floor(action.xp * 0.2));
          this.emit('notification', { type: 'warn', text: `Burned the ${action.name.replace('Cook ','')}!` });
          this.incrementStat(skillId);
          return;
        }
      }
      // Give output
      this.addItem(action.output.item, action.output.qty);
      this.state.stats.itemsCrafted++;
    } else if (skillId === 'thieving') {
      // Stun check
      const masteryReduction = this.getMasteryLevel(skillId, action.id) * 0.003;
      if (Math.random() < Math.max(0.05, action.stunChance - masteryReduction)) {
        this.state.actionProgress = -action.stunTime;
        this.emit('notification', { type: 'warn', text: `Stunned by the ${action.name}!` });
        return;
      }
      // Give gold
      const gold = this.randInt(action.gold.min, action.gold.max);
      this.state.gold += gold;
      this.state.stats.goldEarned += gold;
      // Loot drops
      for (const drop of (action.loot || [])) {
        if (Math.random() < drop.chance) {
          this.addItem(drop.item, drop.qty);
        }
      }
    }

    // Give XP
    this.addXp(skillId, action.xp);
    this.addMasteryXp(skillId, action.masteryId || action.id, action.xp);
    this.incrementStat(skillId);
  }

  // ── XP & LEVELING ──────────────────────────────────────
  addXp(skillId, amount) {
    if (!this.state.skills[skillId]) return;
    const before = this.state.skills[skillId].level;
    this.state.skills[skillId].xp += amount;
    this.state.stats.totalXpGained += amount;

    // Check level up
    const table = GAME_DATA.xpTable;
    while (this.state.skills[skillId].level < 99 && this.state.skills[skillId].xp >= table[this.state.skills[skillId].level + 1]) {
      this.state.skills[skillId].level++;
    }

    if (this.state.skills[skillId].level > before) {
      this.emit('notification', { type: 'levelup', text: `${GAME_DATA.skills[skillId].name} leveled up to ${this.state.skills[skillId].level}!` });
      this.emit('levelup', { skill: skillId, level: this.state.skills[skillId].level });
    }
  }

  getLevelForXp(xp) {
    const table = GAME_DATA.xpTable;
    for (let i = 1; i < table.length; i++) {
      if (xp < table[i]) return i - 1;
    }
    return 99;
  }

  getXpForLevel(level) {
    return GAME_DATA.xpTable[level] || 0;
  }

  getXpProgress(skillId) {
    const s = this.state.skills[skillId];
    if (!s || s.level >= 99) return 1;
    const cur = s.xp - this.getXpForLevel(s.level);
    const need = this.getXpForLevel(s.level + 1) - this.getXpForLevel(s.level);
    return Math.min(1, cur / need);
  }

  // ── MASTERY ────────────────────────────────────────────
  addMasteryXp(skillId, masteryId, baseXp) {
    if (!this.state.mastery[skillId]) this.state.mastery[skillId] = {};
    if (!this.state.mastery[skillId][masteryId]) this.state.mastery[skillId][masteryId] = { level: 1, xp: 0 };

    const m = this.state.mastery[skillId][masteryId];
    m.xp += Math.floor(baseXp * 0.5);

    const table = GAME_DATA.xpTable;
    while (m.level < 99 && m.xp >= table[m.level + 1]) {
      m.level++;
    }
  }

  getMasteryLevel(skillId, masteryId) {
    return this.state.mastery[skillId]?.[masteryId]?.level || 0;
  }

  // ── COMBAT ─────────────────────────────────────────────
  startCombat(areaId, monsterId) {
    this.stopSkill();
    const area = GAME_DATA.combatAreas.find(a => a.id === areaId);
    if (!area) return;
    if (!area.monsters.includes(monsterId)) return;

    const combatLevel = this.getCombatLevel();
    if (combatLevel < area.levelReq) {
      this.emit('notification', { type: 'warn', text: `Requires combat level ${area.levelReq}.` });
      return;
    }

    const monster = GAME_DATA.monsters[monsterId];
    if (!monster) return;

    this.state.combat.active = true;
    this.state.combat.area = areaId;
    this.state.combat.monster = monsterId;
    this.state.combat.dungeon = null;
    this.state.combat.monsterHp = monster.hp;
    this.state.combat.playerHp = this.getMaxHp();
    this.state.combat.playerAttackTimer = 0;
    this.state.combat.monsterAttackTimer = 0;
    this.state.combat.loot = [];
    this.emit('combatStart', { area: areaId, monster: monsterId });
  }

  startDungeon(dungeonId) {
    this.stopSkill();
    const dungeon = GAME_DATA.dungeons.find(d => d.id === dungeonId);
    if (!dungeon) return;

    const combatLevel = this.getCombatLevel();
    if (combatLevel < dungeon.levelReq) {
      this.emit('notification', { type: 'warn', text: `Requires combat level ${dungeon.levelReq}.` });
      return;
    }

    const firstMonster = GAME_DATA.monsters[dungeon.waves[0]];
    this.state.combat.active = true;
    this.state.combat.area = null;
    this.state.combat.dungeon = dungeonId;
    this.state.combat.dungeonWave = 0;
    this.state.combat.monster = dungeon.waves[0];
    this.state.combat.monsterHp = firstMonster.hp;
    this.state.combat.playerHp = this.getMaxHp();
    this.state.combat.playerAttackTimer = 0;
    this.state.combat.monsterAttackTimer = 0;
    this.state.combat.loot = [];
    this.emit('combatStart', { dungeon: dungeonId });
  }

  stopCombat() {
    this.state.combat.active = false;
    this.state.combat.area = null;
    this.state.combat.monster = null;
    this.state.combat.dungeon = null;
    this.state.combat.playerHp = this.getMaxHp();
    this.emit('combatStop');
  }

  tickCombat(dt) {
    const c = this.state.combat;
    if (!c.active || !c.monster) return;
    const monster = GAME_DATA.monsters[c.monster];
    if (!monster) return;

    // Auto-eat
    if (c.autoEat && c.playerHp < this.getMaxHp() * 0.4) {
      this.eatFood();
    }

    // Player attack
    const playerSpeed = this.getPlayerAttackSpeed();
    c.playerAttackTimer += dt;
    if (c.playerAttackTimer >= playerSpeed) {
      c.playerAttackTimer -= playerSpeed;
      this.playerAttack(monster);
    }

    // Monster attack
    c.monsterAttackTimer += dt;
    if (c.monsterAttackTimer >= monster.attackSpeed) {
      c.monsterAttackTimer -= monster.attackSpeed;
      this.monsterAttack(monster);
    }

    // Check deaths
    if (c.monsterHp <= 0) {
      this.onMonsterDeath(monster);
    }
    if (c.playerHp <= 0) {
      this.onPlayerDeath();
    }
  }

  playerAttack(monster) {
    const style = this.state.combat.combatStyle;
    let accuracy, maxHit;

    if (style === 'melee') {
      const atkLevel = this.state.skills.attack.level;
      const strLevel = this.state.skills.strength.level;
      const atkBonus = this.getStatTotal('attackBonus');
      const strBonus = this.getStatTotal('strengthBonus');
      accuracy = Math.floor((atkLevel + 8) * (atkBonus + 64));
      maxHit = Math.floor(0.5 + strLevel * (strBonus + 64) / 640);
      maxHit = Math.max(maxHit, 1);
    } else if (style === 'ranged') {
      const rngLevel = this.state.skills.ranged.level;
      const rngBonus = this.getStatTotal('rangedBonus');
      const ammoBonus = this.getAmmoBonus();
      accuracy = Math.floor((rngLevel + 8) * (rngBonus + 64));
      maxHit = Math.floor(0.5 + rngLevel * (rngBonus + ammoBonus + 64) / 640);
      maxHit = Math.max(maxHit, 1);
      this.consumeAmmo();
    } else if (style === 'magic') {
      const magLevel = this.state.skills.magic.level;
      const magBonus = this.getStatTotal('magicBonus');
      const spell = this.getActiveSpell();
      accuracy = Math.floor((magLevel + 8) * (magBonus + 64));
      maxHit = spell ? spell.maxHit + Math.floor(magBonus * 0.5) : Math.floor(magLevel * 0.3);
      if (spell && !this.consumeRunes(spell)) {
        this.emit('notification', { type: 'warn', text: 'Out of runes!' });
        this.stopCombat();
        return;
      }
    }

    const evasion = monster.evasion[style] || 0;
    const defence = Math.floor((1 + 8) * (evasion + 64));
    const hitChance = Math.min(0.95, Math.max(0.05, accuracy / (accuracy + defence)));

    if (Math.random() < hitChance) {
      const dmg = this.randInt(1, maxHit);
      this.state.combat.monsterHp -= dmg;
      this.emit('combatHit', { who: 'player', dmg, maxHit });
    } else {
      this.emit('combatHit', { who: 'player', dmg: 0, miss: true });
    }
  }

  monsterAttack(monster) {
    const defLevel = this.state.skills.defence.level;
    const defBonus = this.getStatTotal('defenceBonus');
    const dr = this.getStatTotal('damageReduction');
    const evasion = Math.floor((defLevel + 8) * (defBonus + 64));
    const monsterAccuracy = Math.floor((monster.combatLevel + 8) * 64);
    const hitChance = Math.min(0.95, Math.max(0.05, monsterAccuracy / (monsterAccuracy + evasion)));

    if (Math.random() < hitChance) {
      let dmg = this.randInt(1, monster.maxHit);
      dmg = Math.max(1, Math.floor(dmg * (100 - dr) / 100));
      this.state.combat.playerHp -= dmg;
      this.emit('combatHit', { who: 'monster', dmg });
    }
  }

  onMonsterDeath(monster) {
    const monsterId = this.state.combat.monster;
    this.state.stats.monstersKilled++;
    if (!this.state.stats.uniqueKills) this.state.stats.uniqueKills = {};
    this.state.stats.uniqueKills[monsterId] = (this.state.stats.uniqueKills[monsterId] || 0) + 1;

    // XP
    const style = this.state.combat.combatStyle;
    if (style === 'melee') {
      this.addXp('attack', Math.floor(monster.xp * 0.4));
      this.addXp('strength', Math.floor(monster.xp * 0.4));
      this.addXp('defence', Math.floor(monster.xp * 0.2));
    } else if (style === 'ranged') {
      this.addXp('ranged', Math.floor(monster.xp * 0.8));
      this.addXp('defence', Math.floor(monster.xp * 0.2));
    } else {
      this.addXp('magic', Math.floor(monster.xp * 0.8));
      this.addXp('defence', Math.floor(monster.xp * 0.2));
    }
    this.addXp('hitpoints', Math.floor(monster.xp * 0.33));

    // Gold
    if (monster.gold) {
      const g = this.randInt(monster.gold.min, monster.gold.max);
      this.state.gold += g;
      this.state.stats.goldEarned += g;
    }

    // Drops
    for (const drop of (monster.drops || [])) {
      if (Math.random() < drop.chance) {
        this.addItem(drop.item, drop.qty);
        const item = GAME_DATA.items[drop.item];
        if (drop.chance < 0.1) {
          this.emit('notification', { type: 'rare', text: `Rare drop: ${item?.name || drop.item}!` });
        }
      }
    }

    // Check dungeon progression
    if (this.state.combat.dungeon) {
      const dungeon = GAME_DATA.dungeons.find(d => d.id === this.state.combat.dungeon);
      this.state.combat.dungeonWave++;
      if (this.state.combat.dungeonWave >= dungeon.waves.length) {
        // Dungeon complete
        this.state.stats.dungeonsCompleted++;
        for (const reward of dungeon.rewards) {
          if (Math.random() < reward.chance) {
            this.addItem(reward.item, reward.qty);
            this.emit('notification', { type: 'rare', text: `Dungeon reward: ${GAME_DATA.items[reward.item]?.name}!` });
          }
        }
        this.emit('notification', { type: 'success', text: `Completed ${dungeon.name}!` });
        this.stopCombat();
        return;
      } else {
        // Next wave
        const nextMonsterId = dungeon.waves[this.state.combat.dungeonWave];
        const nextMonster = GAME_DATA.monsters[nextMonsterId];
        this.state.combat.monster = nextMonsterId;
        this.state.combat.monsterHp = nextMonster.hp;
        this.state.combat.monsterAttackTimer = 0;
      }
    } else {
      // Respawn same monster in area
      this.state.combat.monsterHp = monster.hp;
      this.state.combat.monsterAttackTimer = 0;
    }
    this.state.combat.playerAttackTimer = 0;
  }

  onPlayerDeath() {
    this.state.stats.deaths++;
    this.emit('notification', { type: 'danger', text: 'You have been defeated!' });
    this.stopCombat();
  }

  // ── COMBAT HELPERS ─────────────────────────────────────
  getCombatLevel() {
    const s = this.state.skills;
    const base = Math.floor(0.25 * (s.defence.level + s.hitpoints.level));
    const melee = 0.325 * (s.attack.level + s.strength.level);
    const ranged = 0.325 * (s.ranged.level * 1.5);
    const magic = 0.325 * (s.magic.level * 1.5);
    return Math.floor(base + Math.max(melee, ranged, magic));
  }

  getMaxHp(skills) {
    const s = skills || this.state.skills;
    return Math.floor(s.hitpoints.level * 10 + 10);
  }

  getPlayerAttackSpeed() {
    const wep = this.getEquippedItem('weapon');
    return wep ? wep.attackSpeed : 2.4;
  }

  getStatTotal(statName) {
    let total = 0;
    for (const slot of GAME_DATA.equipmentSlots) {
      const item = this.getEquippedItem(slot);
      if (item?.stats?.[statName]) total += item.stats[statName];
    }
    return total;
  }

  getEquippedItem(slot) {
    const itemId = this.state.equipment[slot];
    return itemId ? GAME_DATA.items[itemId] : null;
  }

  getAmmoBonus() {
    const ammo = this.getEquippedItem('ammo');
    return ammo?.rangedBonus || 0;
  }

  consumeAmmo() {
    const ammoId = this.state.equipment.ammo;
    if (ammoId && this.state.bank[ammoId] > 0) {
      this.state.bank[ammoId]--;
      if (this.state.bank[ammoId] <= 0) {
        this.state.equipment.ammo = null;
        this.emit('notification', { type: 'warn', text: 'Ran out of ammo!' });
      }
    }
  }

  getActiveSpell() {
    const spellId = this.state.combat.selectedSpell;
    return GAME_DATA.spells.find(s => s.id === spellId) || GAME_DATA.spells[0];
  }

  consumeRunes(spell) {
    if (!this.hasItems(spell.runes)) return false;
    this.removeItems(spell.runes);
    return true;
  }

  // ── FOOD ───────────────────────────────────────────────
  equipFood(itemId) {
    if (!this.state.bank[itemId] || this.state.bank[itemId] <= 0) return;
    const item = GAME_DATA.items[itemId];
    if (!item || (item.type !== 'food' && item.type !== 'potion')) return;

    if (this.state.food.equipped === itemId) {
      // Stack more
      const amount = Math.min(this.state.bank[itemId], 28 - this.state.food.qty);
      this.state.bank[itemId] -= amount;
      this.state.food.qty += amount;
    } else {
      // Unequip old food back to bank
      if (this.state.food.equipped && this.state.food.qty > 0) {
        this.addItem(this.state.food.equipped, this.state.food.qty);
      }
      const amount = Math.min(this.state.bank[itemId], 28);
      this.state.bank[itemId] -= amount;
      this.state.food.equipped = itemId;
      this.state.food.qty = amount;
    }
    this.emit('foodChanged');
  }

  eatFood() {
    if (!this.state.food.equipped || this.state.food.qty <= 0) return;
    const item = GAME_DATA.items[this.state.food.equipped];
    if (!item) return;
    const maxHp = this.getMaxHp();
    if (this.state.combat.playerHp >= maxHp) return;

    this.state.combat.playerHp = Math.min(maxHp, this.state.combat.playerHp + (item.heals || 0));
    this.state.food.qty--;
    this.state.stats.foodEaten++;
    if (this.state.food.qty <= 0) {
      this.state.food.equipped = null;
    }
  }

  // ── EQUIPMENT ──────────────────────────────────────────
  equipItem(itemId) {
    if (!this.state.bank[itemId] || this.state.bank[itemId] <= 0) return;
    const item = GAME_DATA.items[itemId];
    if (!item || !item.slot) return;

    // Check level requirements
    if (item.levelReq) {
      for (const [skill, lvl] of Object.entries(item.levelReq)) {
        if (this.state.skills[skill]?.level < lvl) {
          this.emit('notification', { type: 'warn', text: `Requires ${GAME_DATA.skills[skill]?.name} level ${lvl}.` });
          return;
        }
      }
    }

    // Unequip current
    const currentId = this.state.equipment[item.slot];
    if (currentId) {
      this.addItem(currentId, 1);
    }

    this.state.bank[itemId]--;
    if (this.state.bank[itemId] <= 0) delete this.state.bank[itemId];
    this.state.equipment[item.slot] = itemId;

    // Set combat style based on weapon
    if (item.slot === 'weapon' && item.style) {
      this.state.combat.combatStyle = item.style;
    }

    this.emit('equipmentChanged');
  }

  unequipItem(slot) {
    const itemId = this.state.equipment[slot];
    if (!itemId) return;
    this.addItem(itemId, 1);
    this.state.equipment[slot] = null;
    this.emit('equipmentChanged');
  }

  // ── BANK / INVENTORY ──────────────────────────────────
  addItem(itemId, qty) {
    if (!this.state.bank[itemId]) this.state.bank[itemId] = 0;
    this.state.bank[itemId] += qty;
  }

  removeItem(itemId, qty) {
    if (!this.state.bank[itemId]) return false;
    if (this.state.bank[itemId] < qty) return false;
    this.state.bank[itemId] -= qty;
    if (this.state.bank[itemId] <= 0) delete this.state.bank[itemId];
    return true;
  }

  hasItems(items) {
    for (const req of items) {
      if (!this.state.bank[req.item] || this.state.bank[req.item] < req.qty) return false;
    }
    return true;
  }

  removeItems(items) {
    for (const req of items) {
      this.removeItem(req.item, req.qty);
    }
  }

  sellItem(itemId, qty) {
    const item = GAME_DATA.items[itemId];
    if (!item || !this.state.bank[itemId]) return;
    qty = Math.min(qty, this.state.bank[itemId]);
    const gold = item.sellPrice * qty;
    this.removeItem(itemId, qty);
    this.state.gold += gold;
    this.state.stats.goldEarned += gold;
    this.emit('notification', { type: 'info', text: `Sold ${qty}x ${item.name} for ${gold} gold.` });
  }

  buyItem(shopIndex, qty) {
    const shopItem = GAME_DATA.shop[shopIndex];
    if (!shopItem) return;
    const totalCost = shopItem.price * qty;
    if (this.state.gold < totalCost) {
      this.emit('notification', { type: 'warn', text: 'Not enough gold.' });
      return;
    }
    this.state.gold -= totalCost;
    this.state.stats.goldSpent += totalCost;
    this.addItem(shopItem.item, qty);
    this.emit('notification', { type: 'info', text: `Bought ${qty}x ${GAME_DATA.items[shopItem.item].name}.` });
  }

  // ── FARMING ────────────────────────────────────────────
  plantSeed(plotIndex, seedId) {
    if (plotIndex < 0 || plotIndex >= this.state.farming.plots.length) return;
    const plot = this.state.farming.plots[plotIndex];
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

  harvestPlot(plotIndex) {
    if (plotIndex < 0 || plotIndex >= this.state.farming.plots.length) return;
    const plot = this.state.farming.plots[plotIndex];
    if (!plot.seed || !plot.ready) return;

    const seed = GAME_DATA.items[plot.seed];
    const yieldId = seed.yield;
    const qty = this.randInt(3, 8);
    this.addItem(yieldId, qty);
    this.addXp('farming', Math.floor(qty * 10));

    // Chance to get seed back
    if (Math.random() < 0.40) {
      this.addItem(plot.seed, 1);
    }

    plot.seed = null;
    plot.plantedAt = null;
    plot.growTime = 0;
    plot.ready = false;
    this.emit('farmingChanged');
    this.emit('notification', { type: 'success', text: `Harvested ${qty}x ${GAME_DATA.items[yieldId].name}!` });
  }

  tickFarming(now) {
    for (const plot of this.state.farming.plots) {
      if (plot.seed && plot.plantedAt && !plot.ready) {
        if (now - plot.plantedAt >= plot.growTime) {
          plot.ready = true;
        }
      }
    }
  }

  // ── ACHIEVEMENTS ───────────────────────────────────────
  checkAchievements() {
    for (const ach of GAME_DATA.achievements) {
      if (this.state.achievements.includes(ach.id)) continue;
      try {
        if (ach.check(this.state)) {
          this.state.achievements.push(ach.id);
          this.emit('notification', { type: 'achievement', text: `Achievement: ${ach.name}!` });
        }
      } catch(e) {}
    }
  }

  // ── SAVE / LOAD ────────────────────────────────────────
  save() {
    this.state.lastSave = Date.now();
    try {
      localStorage.setItem('ashfall_save', JSON.stringify(this.state));
    } catch(e) {}
  }

  loadSave() {
    try {
      const raw = localStorage.getItem('ashfall_save');
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return null;
  }

  deleteSave() {
    localStorage.removeItem('ashfall_save');
    this.state = this.newGame();
    this.emit('init', this.state);
  }

  exportSave() {
    return btoa(JSON.stringify(this.state));
  }

  importSave(str) {
    try {
      const data = JSON.parse(atob(str));
      this.state = data;
      this.save();
      this.emit('init', this.state);
      return true;
    } catch(e) { return false; }
  }

  // ── OFFLINE PROGRESSION ────────────────────────────────
  processOffline() {
    if (!this.state.lastSave) return;
    const offlineMs = Date.now() - this.state.lastSave;
    const offlineSec = Math.min(offlineMs / 1000, 86400); // Cap at 24h
    if (offlineSec < 10) return;

    const minutes = Math.floor(offlineSec / 60);
    let report = [];

    // Process non-combat skills offline
    if (this.state.activeSkill && !this.state.combat.active) {
      const skillId = this.state.activeSkill;
      const actionId = this.state.activeAction;
      const skill = GAME_DATA.skills[skillId];
      if (skill) {
        let action = null;
        if (skill.type === 'gathering') {
          action = GAME_DATA.gatheringActions[skillId]?.find(a => a.id === actionId);
        } else if (skill.type === 'artisan') {
          action = GAME_DATA.recipes[skillId]?.find(a => a.id === actionId);
        }
        if (action) {
          const numActions = Math.floor(offlineSec / action.time);
          let completed = 0;
          for (let i = 0; i < numActions; i++) {
            if (skill.type === 'artisan' && action.input && !this.hasItems(action.input)) break;
            if (skill.type === 'artisan' && action.input) this.removeItems(action.input);
            if (skill.type === 'gathering') {
              for (const drop of action.loot) this.addItem(drop.item, drop.qty);
            } else if (action.output) {
              if (action.burnChance && Math.random() < action.burnChance) {
                this.addXp(skillId, Math.floor(action.xp * 0.2));
                continue;
              }
              this.addItem(action.output.item, action.output.qty);
            }
            this.addXp(skillId, action.xp);
            completed++;
          }
          if (completed > 0) {
            report.push(`${GAME_DATA.skills[skillId].name}: ${completed} actions completed`);
          }
        }
      }
    }

    // Process farming
    this.tickFarming(Date.now());

    if (report.length > 0 || minutes > 0) {
      this.emit('notification', { type: 'info', text: `Offline for ${minutes} min. ${report.join('. ')}` });
    }
  }

  // ── UTILITIES ──────────────────────────────────────────
  randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  weightedRandom(items, weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < items.length; i++) {
      r -= weights[i];
      if (r <= 0) return items[i];
    }
    return items[items.length - 1];
  }

  incrementStat(skillId) {
    if (!this.state.stats.totalActions[skillId]) this.state.stats.totalActions[skillId] = 0;
    this.state.stats.totalActions[skillId]++;
  }

  // ── EVENTS ─────────────────────────────────────────────
  on(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      for (const fn of this.listeners[event]) fn(data);
    }
  }

  getTotalLevel() {
    return Object.values(this.state.skills).reduce((sum, s) => sum + s.level, 0);
  }
}

const game = new GameEngine();
