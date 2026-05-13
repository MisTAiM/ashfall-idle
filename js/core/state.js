// ================================================================
// ASHFALL IDLE — core/state.js
// Default game state blueprint. Every field a new save starts with.
// validateState() enforces types on every load — kills NaN/null at source.
// Extracted from: engine.js (newGame function)
// ================================================================

// Expose defaultState globally so engine.js can reference it
function _ashfallDefaultState() {
  const skills = {};
  for (const id of Object.keys(GAME_DATA.skills)) {
    skills[id] = { level: id==='hitpoints' ? 10 : 1, xp: id==='hitpoints' ? 1154 : 0 };
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
      playerHp: 10, monsterHp:0,
      playerAttackTimer:0, monsterAttackTimer:0,
      selectedSpell:null, combatStyle:'melee', autoEat:true,
      statusEffects:{player:{}, monster:{}}, abilityCooldowns:{}, activeBuffs:[],
      xpMode:'controlled',
      mana:{current:100, max:100, regenRate:1, lastRegenTime:Date.now()},
    },
    farming: { plots:[{seed:null,plantedAt:null,growTime:0,ready:false},{seed:null,plantedAt:null,growTime:0,ready:false},{seed:null,plantedAt:null,growTime:0,ready:false}] },
    mastery: {},
    alignment: 'true_neutral',
    alignmentPoints: { moral:0, order:0 },
    reputation: {},
    quests: { active:[], completed:[], progress:{}, stages:{}, _readyToComplete:{} },
    equippedAbilities: [null, null, null, null],
    worldBossRespawns: {},
    stats: {
      totalActions:{}, monstersKilled:0, dungeonsCompleted:0, uniqueKills:{},
      totalXpGained:0, itemsCrafted:0, foodEaten:0, goldEarned:0, goldSpent:0,
      totalPlayTime:0, deaths:0, worldBossKills:0, questsCompleted:0,
      slayerTasksCompleted:0, magicKills:0,
    },
    achievements: [], collectionLog: {},
    settings: { notifications:true, autoLoot:true },
    pets: [], equippedPet: null,
    guild: null,
    _prestigeRank: 0, _prestigeHistory: [],
    dailyQuests: { active:[], completed:[], progress:{} },
    questPoints: 0,
  };
}

console.log('[Ashfall] core/state.js loaded — default state blueprint ready.');
