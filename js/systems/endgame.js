// ================================================================
// ASHFALL IDLE — systems/endgame.js
// Fight Cave (63 waves), Theatre of Ash, Chambers of Ash,
// Raids, Ashen Crypts (formerly Barrows), Gauntlet.
// Merges: fight-cave.js + theatre-of-ash.js + chambers-of-ash.js
//         + content-expansion.js + raids-content-expansion.js
// ================================================================
// ============================================================
// ASHFALL IDLE — THE FIGHT CAVE (TzHaar Fight Cave Adaptation)
// 63 waves. No shortcuts. Earn the Ember Cape.
// ============================================================

// ── FIGHT CAVE MONSTERS ────────────────────────────────────
// Faithful to RS: Tz-Kih, Tz-Kek, Tok-Xil, Yt-MejKot, Ket-Zek, TzTok-Jad, Yt-HurKot

GAME_DATA.monsters.cinder_bat = {
  id:'cinder_bat', name:'Cinder Bat', hp:50, maxHit:8, attackSpeed:1.8,
  combatLevel:22, style:'melee',
  evasion:{melee:10, ranged:10, magic:5},
  xp:40, gold:{min:0,max:2}, alignment:'CE',
  prayerDrain: 2, // Drains 2 prayer points per successful hit
  drops:[{item:'bones',qty:1,chance:1.0}],
  desc:'A fiery bat. Drains prayer on hit. Kill these FIRST.',
  fightCaveOnly: true
};

GAME_DATA.monsters.magma_blob = {
  id:'magma_blob', name:'Magma Blob', hp:120, maxHit:14, attackSpeed:2.6,
  combatLevel:45, style:'melee',
  evasion:{melee:20, ranged:15, magic:10},
  xp:60, gold:{min:0,max:5}, alignment:'CN',
  meleeRecoil: 1, // Deals 1 damage back when hit with melee
  splitsOnDeath: true, splitInto: 'magma_blob_small', splitCount: 2,
  drops:[{item:'bones',qty:1,chance:1.0}],
  desc:'A magma creature. Splits into two smaller blobs on death.',
  fightCaveOnly: true
};

GAME_DATA.monsters.magma_blob_small = {
  id:'magma_blob_small', name:'Magma Blob (Small)', hp:50, maxHit:8, attackSpeed:2.6,
  combatLevel:22, style:'melee',
  evasion:{melee:8, ranged:8, magic:5},
  xp:25, gold:{min:0,max:1}, alignment:'CN',
  drops:[],
  desc:'A smaller magma blob from a split.',
  fightCaveOnly: true
};

GAME_DATA.monsters.obsidian_ranger = {
  id:'obsidian_ranger', name:'Obsidian Ranger', hp:250, maxHit:26, attackSpeed:2.2,
  combatLevel:90, style:'ranged',
  evasion:{melee:40, ranged:50, magic:30},
  xp:120, gold:{min:5,max:20}, alignment:'CN',
  drops:[{item:'obsidian_ore',qty:1,chance:0.30},{item:'big_bones',qty:1,chance:1.0}],
  desc:'Ranged attacker. Protect from Ranged or take heavy damage.',
  fightCaveOnly: true
};

GAME_DATA.monsters.molten_brute = {
  id:'molten_brute', name:'Molten Brute', hp:500, maxHit:50, attackSpeed:2.8,
  combatLevel:180, style:'melee',
  evasion:{melee:55, ranged:50, magic:35},
  xp:250, gold:{min:10,max:50}, alignment:'CN',
  healsAllies: true, // Heals itself and allies below 50% HP
  healAmount: 50,    // Heals 50 HP every healInterval attacks
  healInterval: 4,
  drops:[{item:'big_bones',qty:2,chance:1.0},{item:'obsidian_bar',qty:1,chance:0.15}],
  desc:'Melee tank. Heals itself and other monsters. Low kill priority.',
  fightCaveOnly: true
};

GAME_DATA.monsters.volcanic_mage = {
  id:'volcanic_mage', name:'Volcanic Mage', hp:800, maxHit:108, attackSpeed:2.4,
  combatLevel:360, style:'magic',
  evasion:{melee:60, ranged:55, magic:75},
  xp:500, gold:{min:20,max:80}, alignment:'CE',
  drops:[{item:'dragon_bones',qty:2,chance:1.0},{item:'death_rune',qty:10,chance:0.30},{item:'fire_rune',qty:15,chance:0.25}],
  desc:'Devastating magic attacks. Protect from Magic or die. Max hit: 108.',
  fightCaveOnly: true
};

GAME_DATA.monsters.tztok_jad = {
  id:'tztok_jad', name:'TzTok-Jad', hp:8000, maxHit:160, attackSpeed:3.5,
  combatLevel:702, style:'magic', // Default style, overridden per attack
  evasion:{melee:80, ranged:75, magic:85},
  xp:25250, gold:{min:0,max:0}, alignment:'CE',
  drops:[{item:'dragon_bones',qty:5,chance:1.0}],
  desc:'The final boss. Max hit: 160. Prayer flick or die.',
  fightCaveOnly: true,
  isJad: true
};

GAME_DATA.monsters.yt_hurkot = {
  id:'yt_hurkot', name:'Yt-HurKot', hp:300, maxHit:28, attackSpeed:2.4,
  combatLevel:108, style:'melee',
  evasion:{melee:30, ranged:25, magic:20},
  xp:60, gold:{min:0,max:0}, alignment:'CN',
  drops:[],
  desc:'Jad healer. Tag it to pull aggro and stop it healing Jad.',
  fightCaveOnly: true,
  isJadHealer: true
};


// ── WAVE GENERATION (Skew Binary Number System) ────────────
// RS authentic: monster weights are 1, 3, 7, 15, 31, 63
// Wave N = decomposition into these weights, only weight-1 can appear twice

GAME_DATA.fightCave = {
  id: 'fight_cave',
  name: 'The Fight Cave',
  levelReq: 45,
  prayerReq: 43,
  desc: 'A volcanic arena of 63 waves. Death resets all progress. Only those who conquer TzTok-Jad earn the Ember Cape.',
  reward: 'ember_cape',
  totalWaves: 63,
  // Kill priority guide (authentic RS order)
  killPriority: ['cinder_bat', 'obsidian_ranger', 'volcanic_mage', 'molten_brute', 'magma_blob', 'magma_blob_small'],
  // Phase descriptions
  phases: [
    { startWave:1,  endWave:6,  name:'Bats & Blobs',      prayer:null,           tip:'No prayer needed. Conserve supplies.' },
    { startWave:7,  endWave:14, name:'Rangers Appear',     prayer:'protect_ranged',tip:'Protect from Ranged when ranger is alive. Kill bats first.' },
    { startWave:15, endWave:30, name:'Brutes Join',        prayer:'protect_ranged',tip:'Kill bats > rangers > everything else. Brutes heal allies.' },
    { startWave:31, endWave:62, name:'Mages Arrive',       prayer:'protect_magic', tip:'Protect from Magic is mandatory. Kill bats > rangers > mage > brute > blobs.' },
    { startWave:63, endWave:63, name:'TzTok-Jad',          prayer:null,            tip:'Prayer flick between Ranged and Magic. Tag healers at 50% HP.' },
  ],
};

/**
 * Generate all 63 waves using the Skew Binary Number System.
 * Faithful to the RS Fight Cave wave generation.
 */
function generateFightCaveWaves() {
  const tiers = [
    { weight: 63, monster: 'tztok_jad' },
    { weight: 31, monster: 'volcanic_mage' },
    { weight: 15, monster: 'molten_brute' },
    { weight: 7,  monster: 'obsidian_ranger' },
    { weight: 3,  monster: 'magma_blob' },
    { weight: 1,  monster: 'cinder_bat' },
  ];

  const waves = [];
  for (let waveNum = 1; waveNum <= 63; waveNum++) {
    let remaining = waveNum;
    const monsters = [];

    for (const tier of tiers) {
      while (remaining >= tier.weight) {
        // Count how many of this monster we already have
        const count = monsters.filter(m => m === tier.monster).length;

        // In skew binary, only the lowest-present weight can appear twice
        if (count >= 1) {
          // Check if this is the lowest weight monster currently in the wave
          const currentMonsters = [...monsters, tier.monster];
          const lowestWeight = Math.min(...currentMonsters.map(m => {
            const t = tiers.find(t => t.monster === m);
            return t ? t.weight : Infinity;
          }));
          const thisWeight = tier.weight;

          if (thisWeight !== lowestWeight || count >= 2) break;
        }

        monsters.push(tier.monster);
        remaining -= tier.weight;
      }
    }

    // Sort by combat level descending (highest threat first for display)
    const combatOrder = {
      'tztok_jad': 702, 'volcanic_mage': 360, 'molten_brute': 180,
      'obsidian_ranger': 90, 'magma_blob': 45, 'cinder_bat': 22
    };
    monsters.sort((a, b) => (combatOrder[b] || 0) - (combatOrder[a] || 0));

    waves.push(monsters);
  }

  return waves;
}

GAME_DATA.fightCave.generateWaves = generateFightCaveWaves;


// ── FIGHT CAVE PET ─────────────────────────────────────────
GAME_DATA.pets.push({
  id:'tzrek_jad', name:'TzRek-Jad', source:'tztok_jad', dropRate:0.005,
  bonus:{type:'damageReduction', value:3},
  desc:'A miniature Jad. Proof of mastery. +3% damage reduction.'
});


// ── FIGHT CAVE ACHIEVEMENTS ────────────────────────────────
GAME_DATA.achievements.push(
  {id:'fc_enter',   name:'The Caves Await',      desc:'Enter the Fight Cave.',                         check:(g) => (g.stats.fightCaveAttempts||0) >= 1},
  {id:'fc_fail',    name:'Learning Experience',   desc:'Die in the Fight Cave.',                        check:(g) => (g.stats.fightCaveDeaths||0) >= 1},
  {id:'fc_complete',name:'Ember Cape',             desc:'Complete the Fight Cave and earn the Ember Cape.',check:(g) => (g.stats.fightCaveCompletions||0) >= 1},
  {id:'fc_jad_10',  name:'Jad Hunter',            desc:'Complete the Fight Cave 10 times.',             check:(g) => (g.stats.fightCaveCompletions||0) >= 10}
);


// ── REMOVE FIRE CAPE FROM PHOENIX DROPS ────────────────────
// The Ember Cape should ONLY come from the Fight Cave
(function() {
  const phoenix = GAME_DATA.monsters.phoenix;
  if (phoenix && phoenix.drops) {
    phoenix.drops = phoenix.drops.filter(d => d.item !== 'ember_cape');
  }
})();


// ── FIGHT CAVE ENGINE MIXIN ────────────────────────────────
// These methods get added to the GameEngine prototype after engine.js loads.
// The init is called in the DOMContentLoaded or after engine is instantiated.

const FightCaveMixin = {

  // ── STATE INIT ──────────────────────────────────────────
  initFightCaveState() {
    const s = this.state;
    if (!s.fightCave) {
      s.fightCave = {
        active: false,
        currentWave: 0,       // 0-indexed into wavesData
        wavesData: [],         // generated wave arrays
        monsterQueue: [],      // monsters left in current wave (including splits)
        currentMonsterIdx: 0,  // which monster in queue we're fighting
        waveMonsterHp: {},     // {idx: currentHp} — tracks HP of all alive monsters in wave
        waveMonsterAlive: {},  // {idx: true/false} — tracks which monsters are alive
        startTime: null,
        jadPhase: null,        // null | 'idle' | 'charging' | 'telegraph' | 'awaiting_input' | 'resolving'
        jadAttackStyle: null,  // 'melee' | 'ranged' | 'magic'
        jadChargeTimer: 0,
        jadTelegraphTimer: 0,
        jadInputTimer: 0,
        jadHealersSpawned: false,
        jadHealers: [],        // [{id, hp, maxHp, tagged, healing}]
        jadHealerTimer: 0,
        playerChosenPrayer: null,
        bruteHealCounters: {},  // monsterId -> attack count
        waveComplete: false,
        betweenWaves: false,
        betweenWaveTimer: 0,
        totalKills: 0,
      };
    }
    if (!s.stats.fightCaveAttempts) s.stats.fightCaveAttempts = 0;
    if (!s.stats.fightCaveDeaths) s.stats.fightCaveDeaths = 0;
    if (!s.stats.fightCaveCompletions) s.stats.fightCaveCompletions = 0;
    if (!s.stats.fightCaveBestWave) s.stats.fightCaveBestWave = 0;
    if (!s.stats.jadKills) s.stats.jadKills = 0;
    if (!s.stats.jadDeaths) s.stats.jadDeaths = 0;
  },

  // ── START FIGHT CAVE ────────────────────────────────────
  startFightCave() {
    this.stopSkill();
    if (this.state.combat.active) {
      this.emit('notification', {type:'warn', text:'Stop current combat first.'});
      return;
    }

    const combatLv = this.getCombatLevel();
    const prayerLv = this.state.skills.prayer?.level || 1;

    if (combatLv < GAME_DATA.fightCave.levelReq) {
      this.emit('notification', {type:'warn', text:`Requires combat level ${GAME_DATA.fightCave.levelReq}. You have ${combatLv}.`});
      return;
    }
    if (prayerLv < GAME_DATA.fightCave.prayerReq) {
      this.emit('notification', {type:'warn', text:`Requires Prayer level ${GAME_DATA.fightCave.prayerReq} (protection prayers). You have ${prayerLv}.`});
      return;
    }

    // Check they have food
    if (!this.state.foodBag || this.state.foodBag.length === 0) {
      this.emit('notification', {type:'warn', text:'You need food in your food bag to attempt the Fight Cave.'});
      return;
    }

    // Generate waves
    const fc = this.state.fightCave;
    fc.active = true;
    fc.currentWave = 0;
    fc.wavesData = generateFightCaveWaves();
    fc.monsterQueue = [...fc.wavesData[0]];
    fc.currentMonsterIdx = 0;
    fc.startTime = Date.now();
    fc.jadPhase = null;
    fc.jadAttackStyle = null;
    fc.jadChargeTimer = 0;
    fc.jadTelegraphTimer = 0;
    fc.jadInputTimer = 0;
    fc.jadHealersSpawned = false;
    fc.jadHealers = [];
    fc.jadHealerTimer = 0;
    fc.playerChosenPrayer = null;
    fc.bruteHealCounters = {};
    fc.waveComplete = false;
    fc.betweenWaves = false;
    fc.betweenWaveTimer = 0;
    fc.totalKills = 0;

    // Initialize HP tracker for first wave
    this._initWaveMonsterHp(fc);

    this.state.stats.fightCaveAttempts++;

    // Start combat with first monster
    const firstMonster = fc.monsterQueue[0];
    const m = GAME_DATA.monsters[firstMonster];
    this._setupCombat(m, firstMonster);
    this.state.combat.area = null;
    this.state.combat.dungeon = null;

    this.emit('notification', {type:'info', text:'The Fight Cave begins. 63 waves stand between you and the Ember Cape.'});
    this.emit('notification', {type:'info', text:`Wave 1/${GAME_DATA.fightCave.totalWaves}: ${m.name}!`});
    this.emit('fightCaveStart');
    this.emit('combatStart', { fightCave: true, wave: 1 });
  },

  // ── STOP / FLEE FIGHT CAVE ──────────────────────────────
  fleeFightCave() {
    const fc = this.state.fightCave;
    const wave = (fc.currentWave || 0) + 1;
    this.emit('notification', {type:'danger', text:`You fled the Fight Cave on wave ${wave}. All progress lost.`});
    this._resetFightCave();
    this.stopCombat();
    this.emit('fightCaveEnd', { result: 'fled', wave });
  },

  // ── FIGHT CAVE MONSTER DEATH ────────────────────────────
  onFightCaveMonsterDeath(monster) {
    const fc = this.state.fightCave;
    if (!fc.active) return;

    fc.totalKills++;
    const deadIdx = fc.currentMonsterIdx;

    // Mark this monster dead in tracker
    fc.waveMonsterAlive[deadIdx] = false;
    delete fc.waveMonsterHp[deadIdx];

    // Handle magma blob split — add new alive monsters to the wave
    if (monster.splitsOnDeath && monster.splitInto) {
      const splitCount = monster.splitCount || 2;
      for (let i = 0; i < splitCount; i++) {
        const newIdx = fc.monsterQueue.length;
        fc.monsterQueue.push(monster.splitInto);
        const splitMonster = GAME_DATA.monsters[monster.splitInto];
        fc.waveMonsterHp[newIdx] = splitMonster ? splitMonster.hp : 50;
        fc.waveMonsterAlive[newIdx] = true;
      }
      this.emit('notification', {type:'info', text:`${monster.name} splits into ${splitCount} smaller blobs!`});
    }

    // Check if all monsters in wave are dead
    const anyAlive = Object.values(fc.waveMonsterAlive).some(v => v === true);

    if (!anyAlive) {
      // Wave complete
      fc.currentWave++;

      // Update best wave stat
      if (fc.currentWave > this.state.stats.fightCaveBestWave) {
        this.state.stats.fightCaveBestWave = fc.currentWave;
      }

      // Check if we completed all 63 waves (Jad is dead)
      if (fc.currentWave >= 63) {
        this._completeFightCave();
        return;
      }

      // Between-wave pause
      fc.betweenWaves = true;
      fc.betweenWaveTimer = 3.0;
      fc.waveComplete = true;

      const nextWaveNum = fc.currentWave + 1;
      const nextMonsters = fc.wavesData[fc.currentWave];
      const monsterNames = nextMonsters.map(id => GAME_DATA.monsters[id]?.name || id);
      const unique = [...new Set(monsterNames)];
      this.emit('notification', {type:'info', text:`Wave ${fc.currentWave}/63 cleared! Next: Wave ${nextWaveNum} — ${unique.join(', ')}`});

      const phase = GAME_DATA.fightCave.phases.find(p => nextWaveNum >= p.startWave && nextWaveNum <= p.endWave);
      if (phase && nextWaveNum === phase.startWave) {
        this.emit('notification', {type:'warn', text:`Phase: ${phase.name} — ${phase.tip}`});
      }

      this.emit('fightCaveWaveComplete', { wave: fc.currentWave, nextWave: nextWaveNum });
      return;
    }

    // Auto-switch to next alive target using kill priority
    this._autoTargetNextMonster();
  },

  // ── FIGHT CAVE PLAYER DEATH ─────────────────────────────
  onFightCavePlayerDeath() {
    const fc = this.state.fightCave;
    const wave = (fc.currentWave || 0) + 1;
    const monster = this.state.combat.monster;
    const wasJad = GAME_DATA.monsters[monster]?.isJad;

    this.state.stats.fightCaveDeaths++;
    if (wasJad) this.state.stats.jadDeaths = (this.state.stats.jadDeaths || 0) + 1;

    let deathMsg = `You died on wave ${wave} of the Fight Cave.`;
    if (wasJad) deathMsg = `TzTok-Jad has killed you on wave 63. So close...`;
    deathMsg += ' All progress lost. Supplies consumed are gone.';

    this.emit('notification', {type:'danger', text: deathMsg});

    // Safe death — no XP loss, no equipment loss
    this._resetFightCave();
    this.state.combat.playerHp = this.getMaxHp();
    this.stopCombat();
    this.emit('fightCaveEnd', { result: 'death', wave, wasJad });
  },

  // ── COMPLETE FIGHT CAVE ─────────────────────────────────
  _completeFightCave() {
    const fc = this.state.fightCave;
    this.state.stats.fightCaveCompletions++;
    this.state.stats.jadKills = (this.state.stats.jadKills || 0) + 1;

    // Award Ember Cape
    this.addItem('ember_cape', 1);
    this.emit('notification', {type:'achievement', text:'FIGHT CAVE COMPLETE! You earned the Ember Cape!'});

    // Roll for TzRek-Jad pet
    this.rollPetDrop('tztok_jad');

    // Give XP for Jad kill
    const style = this.state.combat.combatStyle;
    this.addXp('hitpoints', Math.floor(25250 * 0.33));
    if (style === 'melee') {
      this.addXp('attack', Math.floor(25250 * 0.33));
      this.addXp('strength', Math.floor(25250 * 0.33));
    } else if (style === 'ranged') {
      this.addXp('ranged', Math.floor(25250 * 0.66));
    } else {
      this.addXp('magic', Math.floor(25250 * 0.66));
    }

    // Slayer XP if on a Jad slayer task
    if (this.state.slayerTask && this.state.slayerTask.monster === 'tztok_jad') {
      this.addXp('slayer', 25250);
      this.emit('notification', {type:'info', text:'Slayer task: +25,250 Slayer XP for TzTok-Jad!'});
    }

    const elapsed = Date.now() - (fc.startTime || Date.now());
    const minutes = Math.floor(elapsed / 60000);
    this.emit('notification', {type:'info', text:`Completion time: ${minutes} minutes. Total kills: ${fc.totalKills}.`});

    this._resetFightCave();
    this.stopCombat();
    this.emit('fightCaveEnd', { result: 'victory', time: elapsed, kills: fc.totalKills });
  },

  // ── RESET FIGHT CAVE STATE ──────────────────────────────
  _resetFightCave() {
    const fc = this.state.fightCave;
    fc.active = false;
    fc.currentWave = 0;
    fc.wavesData = [];
    fc.monsterQueue = [];
    fc.currentMonsterIdx = 0;
    fc.waveMonsterHp = {};
    fc.waveMonsterAlive = {};
    fc.startTime = null;
    fc.jadPhase = null;
    fc.jadAttackStyle = null;
    fc.jadChargeTimer = 0;
    fc.jadTelegraphTimer = 0;
    fc.jadInputTimer = 0;
    fc.jadHealersSpawned = false;
    fc.jadHealers = [];
    fc.jadHealerTimer = 0;
    fc.playerChosenPrayer = null;
    fc.bruteHealCounters = {};
    fc.waveComplete = false;
    fc.betweenWaves = false;
    fc.betweenWaveTimer = 0;
    fc.totalKills = 0;
    fc._otherMonsterTimers = {};
  },

  // ── INIT WAVE MONSTER HP TRACKER ────────────────────────
  _initWaveMonsterHp(fc) {
    fc.waveMonsterHp = {};
    fc.waveMonsterAlive = {};
    for (let i = 0; i < fc.monsterQueue.length; i++) {
      const m = GAME_DATA.monsters[fc.monsterQueue[i]];
      fc.waveMonsterHp[i] = m ? m.hp : 100;
      fc.waveMonsterAlive[i] = true;
    }
  },

  // ── AUTO-TARGET NEXT ALIVE MONSTER (by kill priority) ───
  _autoTargetNextMonster() {
    const fc = this.state.fightCave;
    const priority = GAME_DATA.fightCave.killPriority;

    // Find next alive monster, preferring kill priority order
    let bestIdx = -1;
    let bestPriority = 999;
    for (let i = 0; i < fc.monsterQueue.length; i++) {
      if (!fc.waveMonsterAlive[i]) continue;
      const mId = fc.monsterQueue[i];
      const pri = priority.indexOf(mId);
      const p = pri >= 0 ? pri : 999;
      if (p < bestPriority || (p === bestPriority && bestIdx === -1)) {
        bestPriority = p;
        bestIdx = i;
      }
    }

    if (bestIdx === -1) return; // No alive monsters (shouldn't happen)

    this._loadFightCaveTarget(bestIdx);
  },

  // ── SWITCH FIGHT CAVE TARGET (called by UI) ─────────────
  switchFightCaveTarget(targetIdx) {
    const fc = this.state.fightCave;
    if (!fc.active) return;
    if (targetIdx === fc.currentMonsterIdx) return; // Already targeting
    if (!fc.waveMonsterAlive[targetIdx]) return; // Dead monster

    // Save current monster's HP before switching
    fc.waveMonsterHp[fc.currentMonsterIdx] = this.state.combat.monsterHp;

    // Load new target
    this._loadFightCaveTarget(targetIdx);
    this.emit('notification', {type:'info', text:`Switched target to ${GAME_DATA.monsters[fc.monsterQueue[targetIdx]]?.name || 'monster'}.`});
  },

  // ── LOAD A FIGHT CAVE TARGET BY INDEX ───────────────────
  _loadFightCaveTarget(idx) {
    const fc = this.state.fightCave;
    const mId = fc.monsterQueue[idx];
    const m = GAME_DATA.monsters[mId];
    if (!m) return;

    fc.currentMonsterIdx = idx;
    this.state.combat.monster = mId;
    this.state.combat.monsterHp = fc.waveMonsterHp[idx] || m.hp;
    this.state.combat.monsterAttackTimer = 0;
    this.state.combat.statusEffects.monster = {};

    // Jad setup
    if (m.isJad && !fc.jadPhase) {
      fc.jadPhase = 'charging';
      fc.jadChargeTimer = 0;
      fc.jadHealersSpawned = false;
      fc.jadHealers = [];
      this.emit('notification', {type:'danger', text:'TzTok-Jad has arrived. Watch the attack telegraphs. Prayer flick or die.'});
      this.emit('jadSpawn');
    }
  },

  // ── ADVANCE BETWEEN WAVES ───────────────────────────────
  _advanceFightCaveWave() {
    const fc = this.state.fightCave;
    fc.betweenWaves = false;
    fc.waveComplete = false;
    fc.betweenWaveTimer = 0;

    // Load next wave
    fc.monsterQueue = [...fc.wavesData[fc.currentWave]];
    fc.currentMonsterIdx = 0;
    fc.bruteHealCounters = {};
    fc._otherMonsterTimers = {};

    // Initialize HP tracking for new wave
    this._initWaveMonsterHp(fc);

    const firstId = fc.monsterQueue[0];
    const m = GAME_DATA.monsters[firstId];
    if (!m) {
      this.emit('notification', {type:'warn', text:'Fight Cave error: missing monster.'});
      this.fleeFightCave();
      return;
    }

    this.state.combat.monster = firstId;
    this.state.combat.monsterHp = m.hp;
    this.state.combat.monsterAttackTimer = 0;
    this.state.combat.playerAttackTimer = 0;
    this.state.combat.statusEffects.monster = {};

    // Setup Jad phase
    if (m.isJad) {
      fc.jadPhase = 'charging';
      fc.jadChargeTimer = 0;
      fc.jadHealersSpawned = false;
      fc.jadHealers = [];
      this.emit('notification', {type:'danger', text:'TzTok-Jad has arrived. Watch the attack telegraphs. Prayer flick or die.'});
      this.emit('jadSpawn');
    }

    const waveNum = fc.currentWave + 1;
    this.emit('notification', {type:'info', text:`Wave ${waveNum}/${GAME_DATA.fightCave.totalWaves} begins!`});
    this.emit('combatStart', { fightCave: true, wave: waveNum });
  },

  // ── TICK FIGHT CAVE ─────────────────────────────────────
  // Called from tickCombat when fightCave.active
  tickFightCave(dt) {
    const fc = this.state.fightCave;
    if (!fc.active) return;

    // Between-wave pause
    if (fc.betweenWaves) {
      fc.betweenWaveTimer -= dt;
      if (fc.betweenWaveTimer <= 0) {
        this._advanceFightCaveWave();
      }
      return;
    }

    const monster = GAME_DATA.monsters[this.state.combat.monster];
    if (!monster) return;

    // ── JAD SPECIAL COMBAT ──────────────────────────────
    if (monster.isJad) {
      this._tickJadCombat(dt, monster);
      return;
    }

    // ── NORMAL FIGHT CAVE COMBAT ────────────────────────
    // Player auto-eat
    const c = this.state.combat;
    if (c.autoEat && c.playerHp < this.getMaxHp() * 0.4) this.eatFood();

    // Tick status effects
    this._tickStatusEffects(c.statusEffects.monster, dt, 'monster');
    this._tickStatusEffects(c.statusEffects.player, dt, 'player');

    // Player attacks targeted monster
    const playerSpeed = this.getPlayerAttackSpeed();
    c.playerAttackTimer += dt;
    if (c.playerAttackTimer >= playerSpeed) {
      c.playerAttackTimer -= playerSpeed;
      this.playerAttack(monster);
      this.drainPrayerPoints();
      // Sync HP back to tracker after player hit
      fc.waveMonsterHp[fc.currentMonsterIdx] = c.monsterHp;
    }

    // Current target attacks player
    let monsterSpeed = monster.attackSpeed * 0.7;
    c.monsterAttackTimer += dt;
    if (c.monsterAttackTimer >= monsterSpeed) {
      c.monsterAttackTimer -= monsterSpeed;
      this._fightCaveMonsterAttack(monster);
    }

    // Other alive monsters also attack (they're all in the room)
    if (!fc._otherMonsterTimers) fc._otherMonsterTimers = {};
    for (let i = 0; i < fc.monsterQueue.length; i++) {
      if (i === fc.currentMonsterIdx) continue; // Skip current target
      if (!fc.waveMonsterAlive[i]) continue; // Skip dead
      const otherId = fc.monsterQueue[i];
      const other = GAME_DATA.monsters[otherId];
      if (!other) continue;
      if (!fc._otherMonsterTimers[i]) fc._otherMonsterTimers[i] = 0;
      fc._otherMonsterTimers[i] += dt;
      const otherSpeed = other.attackSpeed * 0.7;
      if (fc._otherMonsterTimers[i] >= otherSpeed) {
        fc._otherMonsterTimers[i] -= otherSpeed;
        this._fightCaveMonsterAttack(other);
      }
    }

    // Auto-eat after monster attack
    if (c.autoEat && c.playerHp > 0 && c.playerHp < this.getMaxHp() * 0.4) this.eatFood();

    // Check deaths
    if (c.monsterHp <= 0) {
      fc.waveMonsterHp[fc.currentMonsterIdx] = 0;
      this._awardFightCaveCombatXp(monster);
      this.onFightCaveMonsterDeath(monster);
    }
    if (c.playerHp <= 0) {
      this.onFightCavePlayerDeath();
    }
  },

  // ── FIGHT CAVE MONSTER ATTACK (with prayer drain + brute heal) ──
  _fightCaveMonsterAttack(monster) {
    const c = this.state.combat;
    const dL = Math.floor(this.state.skills.defence.level * (1 + this.getPrayerBonus('defenceBonus')/100));
    let dB = this.getStatTotal('defenceBonus');
    const dr = this.getStatTotal('damageReduction');

    // Evasion / accuracy
    const ev = (dL + 8) * (dB + 64);
    const ac = (monster.combatLevel + 8) * 64;
    const ch = Math.min(0.95, Math.max(0.05, ac / (ac + ev)));

    if (Math.random() < ch) {
      let dmg = this.randInt(1, monster.maxHit);
      dmg = Math.max(1, Math.floor(dmg * (100 - dr) / 100));

      // Protection prayer reduction
      const protMelee = this.getPrayerBonus('protectMelee');
      const protRanged = this.getPrayerBonus('protectRanged');
      const protMagic = this.getPrayerBonus('protectMagic');

      if (monster.style === 'melee' && protMelee) dmg = Math.max(1, Math.floor(dmg * (100 - protMelee) / 100));
      if (monster.style === 'ranged' && protRanged) dmg = Math.max(1, Math.floor(dmg * (100 - protRanged) / 100));
      if (monster.style === 'magic' && protMagic) dmg = Math.max(1, Math.floor(dmg * (100 - protMagic) / 100));

      c.playerHp -= dmg;
      this.emit('combatHit', { who:'monster', dmg });

      // Prayer drain on hit (Cinder Bat mechanic)
      if (monster.prayerDrain) {
        this.state.prayerPoints = Math.max(0, this.state.prayerPoints - monster.prayerDrain);
        if (this.state.prayerPoints <= 0 && this.state.activePrayers.length > 0) {
          this.state.activePrayers = [];
          this.emit('notification', {type:'warn', text:'Ran out of prayer points! Prayers deactivated.'});
        }
      }

      // Status effects based on monster type
      if (monster.style === 'magic' && Math.random() < 0.25) {
        this.applyStatus('player', 'burn', 1, 5);
      }
    } else {
      this.emit('combatHit', { who:'monster', dmg:0, miss:true });
    }

    // Molten Brute healing mechanic — heals itself AND other alive monsters
    if (monster.healsAllies) {
      const mId = this.state.combat.monster;
      if (!this.state.fightCave.bruteHealCounters[mId]) this.state.fightCave.bruteHealCounters[mId] = 0;
      this.state.fightCave.bruteHealCounters[mId]++;

      if (this.state.fightCave.bruteHealCounters[mId] >= (monster.healInterval || 4)) {
        this.state.fightCave.bruteHealCounters[mId] = 0;
        const healAmt = monster.healAmount || 50;
        const fc = this.state.fightCave;

        // Heal itself
        c.monsterHp = Math.min(monster.hp, c.monsterHp + healAmt);
        fc.waveMonsterHp[fc.currentMonsterIdx] = c.monsterHp;

        // Heal all other alive monsters in the wave that are below 50% HP
        let alliesHealed = 0;
        for (let i = 0; i < fc.monsterQueue.length; i++) {
          if (i === fc.currentMonsterIdx) continue; // skip self (already healed above)
          if (!fc.waveMonsterAlive[i]) continue;
          const allyId = fc.monsterQueue[i];
          const allyData = GAME_DATA.monsters[allyId];
          if (!allyData) continue;
          const allyHp = fc.waveMonsterHp[i] || 0;
          if (allyHp < allyData.hp * 0.5) {
            fc.waveMonsterHp[i] = Math.min(allyData.hp, allyHp + healAmt);
            alliesHealed++;
          }
        }

        if (alliesHealed > 0) {
          this.emit('notification', {type:'warn', text:`${monster.name} heals itself and ${alliesHealed} allies for ${healAmt} HP each!`});
        } else {
          this.emit('notification', {type:'warn', text:`${monster.name} heals itself for ${healAmt} HP!`});
        }
      }
    }
  },

  // ── JAD COMBAT TICK ─────────────────────────────────────
  _tickJadCombat(dt, monster) {
    const fc = this.state.fightCave;
    const c = this.state.combat;

    // Auto-eat still works
    if (c.autoEat && c.playerHp < this.getMaxHp() * 0.4) this.eatFood();

    // Tick status effects
    this._tickStatusEffects(c.statusEffects.monster, dt, 'monster');
    this._tickStatusEffects(c.statusEffects.player, dt, 'player');

    // Player still auto-attacks Jad
    const playerSpeed = this.getPlayerAttackSpeed();
    c.playerAttackTimer += dt;
    if (c.playerAttackTimer >= playerSpeed) {
      c.playerAttackTimer -= playerSpeed;
      this.playerAttack(monster);
      this.drainPrayerPoints();
    }

    // Check if healers need to spawn (Jad at 50% HP)
    if (!fc.jadHealersSpawned && c.monsterHp <= monster.hp / 2) {
      fc.jadHealersSpawned = true;
      fc.jadHealers = [];
      for (let i = 0; i < 4; i++) {
        const healer = GAME_DATA.monsters.yt_hurkot;
        fc.jadHealers.push({
          id: `healer_${i}`,
          hp: healer.hp,
          maxHp: healer.hp,
          tagged: false,
          healing: true,
        });
      }
      this.emit('notification', {type:'danger', text:'Yt-HurKot healers have spawned! Tag them to stop them healing Jad!'});
      this.emit('jadHealersSpawn');
    }

    // Tick healers
    if (fc.jadHealers.length > 0) {
      fc.jadHealerTimer += dt;
      if (fc.jadHealerTimer >= 3.0) { // Heal every 3 seconds
        fc.jadHealerTimer = 0;
        let totalHeal = 0;
        for (const h of fc.jadHealers) {
          if (h.healing && !h.tagged && h.hp > 0) {
            totalHeal += 50; // Each untagged healer restores 50 HP to Jad
          }
          // Tagged healers attack player instead
          if (h.tagged && h.hp > 0) {
            const healer = GAME_DATA.monsters.yt_hurkot;
            const hDmg = this.randInt(1, healer.maxHit);
            c.playerHp -= hDmg;
            this.emit('combatHit', { who:'monster', dmg: hDmg, source: 'healer' });
          }
        }
        if (totalHeal > 0) {
          c.monsterHp = Math.min(monster.hp, c.monsterHp + totalHeal);
          this.emit('notification', {type:'warn', text:`Healers restore ${totalHeal} HP to Jad! (${c.monsterHp}/${monster.hp})`});

          // If Jad is fully healed, reset healers for next 50% drop
          if (c.monsterHp >= monster.hp) {
            fc.jadHealersSpawned = false;
            fc.jadHealers = [];
            this.emit('notification', {type:'danger', text:'Jad is fully healed! Healers will return at 50% HP again.'});
          }
        }
      }
    }

    // ── JAD ATTACK PHASES ───────────────────────────────
    // Phase: charging -> telegraph -> awaiting_input -> resolving -> charging
    switch (fc.jadPhase) {
      case 'charging':
        fc.jadChargeTimer += dt;
        // Jad winds up for ~3.5 seconds total, telegraph appears at ~2.0s
        if (fc.jadChargeTimer >= 2.0) {
          // Pick random attack style (ranged or magic, faithful to RS where melee is avoided at range)
          fc.jadAttackStyle = Math.random() < 0.5 ? 'ranged' : 'magic';
          fc.jadPhase = 'telegraph';
          fc.jadTelegraphTimer = 0;
          this.emit('jadTelegraph', { style: fc.jadAttackStyle });
        }
        break;

      case 'telegraph':
        fc.jadTelegraphTimer += dt;
        // Show telegraph for 0.8s before input window
        if (fc.jadTelegraphTimer >= 0.8) {
          fc.jadPhase = 'awaiting_input';
          fc.jadInputTimer = 0;
          this.emit('jadAwaitInput', { style: fc.jadAttackStyle, windowMs: 2500 });
        }
        break;

      case 'awaiting_input':
        fc.jadInputTimer += dt;
        // Player has 2.5 seconds to click the correct prayer
        if (fc.jadInputTimer >= 2.5) {
          // Time's up — resolve with whatever prayer is active (or none)
          this._resolveJadAttack();
        }
        break;

      case 'resolving':
        // Brief pause after attack, then back to charging
        fc.jadChargeTimer += dt;
        if (fc.jadChargeTimer >= 0.5) {
          fc.jadPhase = 'charging';
          fc.jadChargeTimer = 0;
          fc.jadAttackStyle = null;
          fc.playerChosenPrayer = null;
        }
        break;
    }

    // Auto-eat after potential Jad hit
    if (c.autoEat && c.playerHp > 0 && c.playerHp < this.getMaxHp() * 0.4) this.eatFood();

    // Check deaths
    if (c.monsterHp <= 0) {
      this._awardFightCaveCombatXp(monster);
      this.onFightCaveMonsterDeath(monster);
    }
    if (c.playerHp <= 0) {
      this.onFightCavePlayerDeath();
    }
  },

  // ── JAD PRAYER FLICK (called by UI) ─────────────────────
  jadPrayerFlick(prayerType) {
    const fc = this.state.fightCave;
    if (!fc.active || fc.jadPhase !== 'awaiting_input') return;

    fc.playerChosenPrayer = prayerType; // 'melee', 'ranged', or 'magic'
    this._resolveJadAttack();
  },

  // ── RESOLVE JAD ATTACK ──────────────────────────────────
  _resolveJadAttack() {
    const fc = this.state.fightCave;
    const c = this.state.combat;
    const monster = GAME_DATA.monsters.tztok_jad;

    const attackStyle = fc.jadAttackStyle;
    const chosenPrayer = fc.playerChosenPrayer;

    // Determine if correct prayer was active
    let correctPrayer = false;
    if (attackStyle === 'melee' && chosenPrayer === 'melee') correctPrayer = true;
    if (attackStyle === 'ranged' && chosenPrayer === 'ranged') correctPrayer = true;
    if (attackStyle === 'magic' && chosenPrayer === 'magic') correctPrayer = true;

    // Also check if they already had the right prayer active via the normal system
    if (!correctPrayer) {
      if (attackStyle === 'melee' && this.getPrayerBonus('protectMelee') > 0) correctPrayer = true;
      if (attackStyle === 'ranged' && this.getPrayerBonus('protectRanged') > 0) correctPrayer = true;
      if (attackStyle === 'magic' && this.getPrayerBonus('protectMagic') > 0) correctPrayer = true;
    }

    // Calculate damage
    let dmg = this.randInt(1, monster.maxHit);
    const dr = this.getStatTotal('damageReduction');
    dmg = Math.max(1, Math.floor(dmg * (100 - dr) / 100));

    if (correctPrayer) {
      dmg = Math.max(1, Math.floor(dmg * 0.6)); // 40% reduction
      this.emit('jadAttackResult', { style: attackStyle, result: 'protected', dmg });
    } else {
      this.emit('jadAttackResult', { style: attackStyle, result: 'full_hit', dmg });
    }

    c.playerHp -= dmg;
    this.emit('combatHit', { who:'monster', dmg, jadAttack: true, protected: correctPrayer });

    // Drain prayer (Jad attacks cost prayer due to protection being active)
    this.drainPrayerPoints();

    // Move to resolving phase
    fc.jadPhase = 'resolving';
    fc.jadChargeTimer = 0;
  },

  // ── TAG JAD HEALER (called by UI) ───────────────────────
  tagJadHealer(healerIdx) {
    const fc = this.state.fightCave;
    if (!fc.active || !fc.jadHealers[healerIdx]) return;

    const healer = fc.jadHealers[healerIdx];
    if (healer.tagged) return; // Already tagged

    healer.tagged = true;
    healer.healing = false;

    // Deal a small hit to aggro
    const dmg = this.randInt(1, 15);
    healer.hp = Math.max(0, healer.hp - dmg);

    this.emit('notification', {type:'info', text:`Tagged healer ${healerIdx + 1}! It will now attack you instead of healing Jad.`});
    this.emit('jadHealerTagged', { idx: healerIdx });
  },

  // ── AWARD COMBAT XP FOR FIGHT CAVE KILLS ────────────────
  _awardFightCaveCombatXp(monster) {
    const xp = monster.xp || 0;
    if (xp <= 0) return;

    const style = this.state.combat.combatStyle;
    if (style === 'melee') {
      const mode = this.state.combat.xpMode || 'controlled';
      if (mode === 'accurate') this.addXp('attack', Math.floor(xp * 0.8));
      else if (mode === 'aggressive') this.addXp('strength', Math.floor(xp * 0.8));
      else if (mode === 'defensive') this.addXp('defence', Math.floor(xp * 0.8));
      else {
        this.addXp('attack', Math.floor(xp * 0.27));
        this.addXp('strength', Math.floor(xp * 0.27));
        this.addXp('defence', Math.floor(xp * 0.26));
      }
    } else if (style === 'ranged') {
      this.addXp('ranged', Math.floor(xp * 0.8));
    } else {
      this.addXp('magic', Math.floor(xp * 0.8));
    }
    this.addXp('hitpoints', Math.floor(xp * 0.33));

    // Slayer XP if on task
    if (this.state.slayerTask) {
      this.addXp('slayer', Math.floor(xp * 0.5));
    }
  },

  // ── SET FIGHT CAVE KILL PRIORITY (called by UI) ─────────
  setFightCaveKillPriority(orderedMonsters) {
    const fc = this.state.fightCave;
    if (!fc.active) return;

    // Reorder the remaining monsters in the current wave queue
    // based on priority (kill priority = first in queue)
    const remaining = fc.monsterQueue.slice(fc.currentMonsterIdx + 1);
    const priorityMap = {};
    orderedMonsters.forEach((m, i) => { priorityMap[m] = i; });

    remaining.sort((a, b) => {
      const pa = priorityMap[a] !== undefined ? priorityMap[a] : 999;
      const pb = priorityMap[b] !== undefined ? priorityMap[b] : 999;
      return pa - pb;
    });

    fc.monsterQueue = [
      ...fc.monsterQueue.slice(0, fc.currentMonsterIdx + 1),
      ...remaining
    ];
  },
};


// ── APPLY MIXIN TO ENGINE ──────────────────────────────────
// This runs after engine.js is loaded. We patch the prototype.
function applyFightCaveMixin() {
  if (typeof GameEngine === 'undefined') {
    console.warn('[FightCave] GameEngine not found. Retrying...');
    setTimeout(applyFightCaveMixin, 100);
    return;
  }

  // Add all mixin methods to the engine prototype
  for (const [name, fn] of Object.entries(FightCaveMixin)) {
    GameEngine.prototype[name] = fn;
  }

  // Patch migrateSave to init fight cave state
  const origMigrate = GameEngine.prototype.migrateSave;
  GameEngine.prototype.migrateSave = function(saveData) {
    const result = origMigrate.call(this, saveData);
    this.initFightCaveState();
    return result;
  };

  // Patch tickCombat to route to fight cave
  const origTickCombat = GameEngine.prototype.tickCombat;
  GameEngine.prototype.tickCombat = function(dt) {
    if (this.state.fightCave && this.state.fightCave.active) {
      this.tickFightCave(dt);
      return;
    }
    origTickCombat.call(this, dt);
  };

  // Patch onMonsterDeath to check fight cave
  const origOnMonsterDeath = GameEngine.prototype.onMonsterDeath;
  GameEngine.prototype.onMonsterDeath = function(monster, isWB) {
    if (this.state.fightCave && this.state.fightCave.active) {
      // Fight cave handles its own monster death — don't run normal logic
      return;
    }
    origOnMonsterDeath.call(this, monster, isWB);
  };

  // Patch onPlayerDeath to check fight cave
  const origOnPlayerDeath = GameEngine.prototype.onPlayerDeath;
  GameEngine.prototype.onPlayerDeath = function() {
    if (this.state.fightCave && this.state.fightCave.active) {
      this.onFightCavePlayerDeath();
      return;
    }
    origOnPlayerDeath.call(this);
  };

  // Patch stopCombat to also stop fight cave
  const origStopCombat = GameEngine.prototype.stopCombat;
  GameEngine.prototype.stopCombat = function() {
    // If fight cave is active, fleeing
    if (this.state.fightCave && this.state.fightCave.active) {
      this.fleeFightCave();
      return;
    }
    origStopCombat.call(this);
  };

  console.log('[Ashfall] Fight Cave system loaded — 7 monsters, 63 waves, 1 cape.');
}

// ── FIGHT CAVE MONSTER ART (Original SVGs) ─────────────────
// These are original procedural SVGs matching Ashfall's dark fantasy aesthetic.
if (!GAME_DATA.monsterArt) GAME_DATA.monsterArt = {};

Object.assign(GAME_DATA.monsterArt, {
  cinder_bat: `<svg viewBox="0 0 64 64"><path d="M4 28 Q12 16 20 22 L28 18 L32 22 L36 18 L44 22 Q52 16 60 28 Q54 36 44 32 L36 36 L32 40 L28 36 L20 32 Q10 36 4 28Z" fill="#8a3020" stroke="#4a1a10" stroke-width="1"/><circle cx="28" cy="26" r="2" fill="#ff6030"/><circle cx="36" cy="26" r="2" fill="#ff6030"/><circle cx="28" cy="26" r="1" fill="#ffcc00"/><circle cx="36" cy="26" r="1" fill="#ffcc00"/><path d="M30 30 Q32 32 34 30" stroke="#4a1a10" stroke-width="1" fill="none"/><path d="M14 22 Q8 18 6 24" stroke="#6a2018" stroke-width="1.5" fill="none"/><path d="M50 22 Q56 18 58 24" stroke="#6a2018" stroke-width="1.5" fill="none"/><ellipse cx="32" cy="44" rx="3" ry="1.5" fill="rgba(255,80,30,0.3)"/></svg>`,

  magma_blob: `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="40" rx="20" ry="16" fill="#c04020"/><ellipse cx="32" cy="38" rx="18" ry="14" fill="#d05830"/><ellipse cx="32" cy="36" rx="14" ry="10" fill="#e07040"/><ellipse cx="28" cy="32" rx="3" ry="3" fill="#ff9050"/><ellipse cx="38" cy="34" rx="2" ry="2" fill="#ff9050"/><ellipse cx="32" cy="28" rx="4" ry="3" fill="#ffb070"/><circle cx="26" cy="32" r="3" fill="#2a0a04"/><circle cx="38" cy="32" r="3" fill="#2a0a04"/><circle cx="26" cy="31" r="1.5" fill="#ff6030"/><circle cx="38" cy="31" r="1.5" fill="#ff6030"/><path d="M30 38 Q32 40 34 38" stroke="#2a0a04" stroke-width="1.5" fill="none"/><path d="M18 42 Q14 38 16 46" stroke="#a03018" stroke-width="2" fill="none"/><path d="M46 42 Q50 38 48 46" stroke="#a03018" stroke-width="2" fill="none"/></svg>`,

  magma_blob_small: `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="42" rx="12" ry="10" fill="#c04020"/><ellipse cx="32" cy="40" rx="10" ry="8" fill="#d06040"/><ellipse cx="32" cy="38" rx="6" ry="5" fill="#e08050"/><circle cx="28" cy="38" r="2" fill="#2a0a04"/><circle cx="36" cy="38" r="2" fill="#2a0a04"/><circle cx="28" cy="37.5" r="1" fill="#ff6030"/><circle cx="36" cy="37.5" r="1" fill="#ff6030"/></svg>`,

  obsidian_ranger: `<svg viewBox="0 0 64 64"><rect x="24" y="24" width="16" height="24" rx="2" fill="#3a3040"/><circle cx="32" cy="18" r="8" fill="#6a5a4a"/><rect x="22" y="10" width="20" height="6" rx="1" fill="#2a2030"/><rect x="26" y="6" width="12" height="6" rx="1" fill="#3a3040"/><circle cx="29" cy="17" r="2" fill="#ff4020"/><circle cx="35" cy="17" r="2" fill="#ff4020"/><circle cx="29" cy="17" r="1" fill="#ffcc00"/><circle cx="35" cy="17" r="1" fill="#ffcc00"/><rect x="16" y="26" width="8" height="16" rx="2" fill="#3a3040"/><rect x="40" y="26" width="8" height="16" rx="2" fill="#3a3040"/><path d="M46 30 L58 22 M58 22 L60 20 M58 22 L60 24" stroke="#5a4a3a" stroke-width="2" fill="none"/><line x1="46" y1="32" x2="58" y2="24" stroke="#c0a080" stroke-width="1"/><rect x="26" y="48" width="5" height="8" rx="1" fill="#2a2030"/><rect x="33" y="48" width="5" height="8" rx="1" fill="#2a2030"/><path d="M26 30 L22 30 L22 38 L26 38" stroke="#6a4020" stroke-width="1.5" fill="#4a3020"/></svg>`,

  molten_brute: `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="38" rx="20" ry="18" fill="#5a3828"/><circle cx="32" cy="20" r="12" fill="#6a4430"/><circle cx="26" cy="18" r="2.5" fill="#ff4020"/><circle cx="38" cy="18" r="2.5" fill="#ff4020"/><circle cx="26" cy="18" r="1.2" fill="#ffcc00"/><circle cx="38" cy="18" r="1.2" fill="#ffcc00"/><path d="M28 24 Q32 27 36 24" stroke="#3a1a10" stroke-width="2" fill="none"/><rect x="10" y="24" width="10" height="22" rx="4" fill="#5a3828"/><rect x="44" y="24" width="10" height="22" rx="4" fill="#5a3828"/><circle cx="15" cy="46" r="4" fill="#5a3828"/><circle cx="49" cy="46" r="4" fill="#5a3828"/><rect x="22" y="52" width="7" height="10" rx="2" fill="#5a3828"/><rect x="35" y="52" width="7" height="10" rx="2" fill="#5a3828"/><path d="M22 34 Q18 30 20 38" stroke="#ff6030" stroke-width="1.5" fill="none" opacity="0.6"/><path d="M42 34 Q46 30 44 38" stroke="#ff6030" stroke-width="1.5" fill="none" opacity="0.6"/><ellipse cx="32" cy="36" rx="6" ry="3" fill="#ff8040" opacity="0.3"/></svg>`,

  volcanic_mage: `<svg viewBox="0 0 64 64"><path d="M20 14 L32 4 L44 14 L44 26 L20 26Z" fill="#4a2030"/><rect x="22" y="26" width="20" height="24" rx="2" fill="#3a1828"/><circle cx="28" cy="18" r="3" fill="#8030ff"/><circle cx="36" cy="18" r="3" fill="#8030ff"/><circle cx="28" cy="18" r="1.5" fill="#cc80ff"/><circle cx="36" cy="18" r="1.5" fill="#cc80ff"/><path d="M30 22 Q32 24 34 22" stroke="#6020a0" stroke-width="1" fill="none"/><rect x="14" y="28" width="8" height="18" rx="2" fill="#3a1828"/><rect x="42" y="28" width="8" height="18" rx="2" fill="#3a1828"/><circle cx="12" cy="34" r="4" fill="#ff4020" opacity="0.7"/><circle cx="12" cy="34" r="2" fill="#ffcc00" opacity="0.7"/><circle cx="52" cy="34" r="4" fill="#ff4020" opacity="0.7"/><circle cx="52" cy="34" r="2" fill="#ffcc00" opacity="0.7"/><rect x="24" y="50" width="6" height="8" rx="1" fill="#2a1020"/><rect x="34" y="50" width="6" height="8" rx="1" fill="#2a1020"/><path d="M20 14 L12 18 M44 14 L52 18" stroke="#5a2838" stroke-width="1.5" fill="none"/></svg>`,

  tztok_jad: `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="40" rx="24" ry="18" fill="#8a2010"/><circle cx="32" cy="22" r="14" fill="#a03018"/><polygon points="20,14 16,4 24,10" fill="#6a1a0a"/><polygon points="44,14 48,4 40,10" fill="#6a1a0a"/><circle cx="26" cy="20" r="4" fill="#ff2000"/><circle cx="38" cy="20" r="4" fill="#ff2000"/><circle cx="26" cy="20" r="2" fill="#ffcc00"/><circle cx="38" cy="20" r="2" fill="#ffcc00"/><path d="M28 28 L30 26 L32 28 L34 26 L36 28" stroke="#4a0a04" stroke-width="2" fill="none"/><rect x="6" y="28" width="12" height="20" rx="4" fill="#8a2010"/><rect x="46" y="28" width="12" height="20" rx="4" fill="#8a2010"/><path d="M6 44 Q2 42 4 48" stroke="#6a1a0a" stroke-width="2" fill="none"/><path d="M58 44 Q62 42 60 48" stroke="#6a1a0a" stroke-width="2" fill="none"/><rect x="18" y="54" width="8" height="10" rx="3" fill="#8a2010"/><rect x="38" y="54" width="8" height="10" rx="3" fill="#8a2010"/><path d="M24 36 Q28 34 26 40" stroke="#ff6030" stroke-width="1" fill="none" opacity="0.7"/><path d="M40 36 Q36 34 38 40" stroke="#ff6030" stroke-width="1" fill="none" opacity="0.7"/><ellipse cx="32" cy="38" rx="8" ry="4" fill="#ff4020" opacity="0.25"/><ellipse cx="32" cy="38" rx="4" ry="2" fill="#ffcc00" opacity="0.2"/></svg>`,

  yt_hurkot: `<svg viewBox="0 0 64 64"><ellipse cx="32" cy="40" rx="14" ry="12" fill="#7a6050"/><circle cx="32" cy="26" r="10" fill="#8a7060"/><circle cx="28" cy="24" r="2.5" fill="#40c040"/><circle cx="36" cy="24" r="2.5" fill="#40c040"/><circle cx="28" cy="24" r="1.2" fill="#80ff80"/><circle cx="36" cy="24" r="1.2" fill="#80ff80"/><path d="M30 30 Q32 32 34 30" stroke="#4a3020" stroke-width="1.5" fill="none"/><rect x="16" y="30" width="8" height="14" rx="3" fill="#7a6050"/><rect x="40" y="30" width="8" height="14" rx="3" fill="#7a6050"/><circle cx="18" cy="40" r="3" fill="#40c040" opacity="0.5"/><circle cx="46" cy="40" r="3" fill="#40c040" opacity="0.5"/><rect x="24" y="50" width="5" height="8" rx="2" fill="#6a5040"/><rect x="35" y="50" width="5" height="8" rx="2" fill="#6a5040"/></svg>`,
});

// Ember Cape animated sprite reference for equipment display
GAME_DATA.monsterArt.ember_cape_item = `<svg viewBox="0 0 64 64"><defs><linearGradient id="fcg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff4020"/><stop offset="50%" stop-color="#ff8030"/><stop offset="100%" stop-color="#ffcc40"/></linearGradient></defs><path d="M18 8 L46 8 L50 52 L32 60 L14 52Z" fill="url(#fcg)" stroke="#8a2010" stroke-width="1.5"/><path d="M32 8 L32 60" stroke="#ffcc40" stroke-width="1" opacity="0.5"/><path d="M22 20 Q28 24 26 32 Q24 36 28 40" stroke="#ffee80" stroke-width="1.5" fill="none" opacity="0.6"/><path d="M38 16 Q42 22 38 28 Q36 34 40 38" stroke="#ffee80" stroke-width="1.5" fill="none" opacity="0.6"/><ellipse cx="32" cy="12" rx="4" ry="2" fill="#ffcc40" opacity="0.4"/></svg>`;


// ── GLOBAL CHAT ANNOUNCEMENTS ──────────────────────────────
// Broadcast Fight Cave events to global chat

function fcBroadcast(text) {
  if (typeof online !== 'undefined' && online.isOnline && online.user) {
    try {
      online.sendSystemMessage(text);
    } catch(e) { console.warn('[FightCave] Broadcast error:', e); }
  }
}

function fcGetPlayerName() {
  if (typeof online !== 'undefined' && online.displayName) return online.displayName;
  return 'A brave adventurer';
}

// Patch the Fight Cave methods to add broadcasts + death tracking
function patchFightCaveBroadcasts() {
  if (typeof GameEngine === 'undefined') {
    setTimeout(patchFightCaveBroadcasts, 200);
    return;
  }

  // Patch startFightCave to broadcast entry
  const origStart = GameEngine.prototype.startFightCave;
  GameEngine.prototype.startFightCave = function() {
    origStart.call(this);
    if (this.state.fightCave && this.state.fightCave.active) {
      const name = fcGetPlayerName();
      const attempts = this.state.stats.fightCaveAttempts || 1;
      const deaths = this.state.stats.fightCaveDeaths || 0;
      let msg = `${name} has entered the Fight Cave! (Attempt #${attempts}`;
      if (deaths > 0) msg += ` | ${deaths} death${deaths > 1 ? 's' : ''} so far`;
      msg += ')';
      fcBroadcast(msg);
    }
  };

  // Patch onFightCavePlayerDeath to broadcast death with counter
  const origDeath = GameEngine.prototype.onFightCavePlayerDeath;
  GameEngine.prototype.onFightCavePlayerDeath = function() {
    const fc = this.state.fightCave;
    const wave = (fc.currentWave || 0) + 1;
    const monster = this.state.combat.monster;
    const wasJad = GAME_DATA.monsters[monster]?.isJad;

    origDeath.call(this);

    const name = fcGetPlayerName();
    const totalDeaths = this.state.stats.fightCaveDeaths || 1;
    let msg;
    if (wasJad) {
      msg = `${name} was slain by TzTok-Jad on wave 63! (Death #${totalDeaths})`;
    } else {
      const monName = GAME_DATA.monsters[monster]?.name || 'unknown';
      msg = `${name} fell on wave ${wave} to ${monName}. (Death #${totalDeaths})`;
    }
    fcBroadcast(msg);
  };

  // Patch _completeFightCave to broadcast victory
  const origComplete = GameEngine.prototype._completeFightCave;
  GameEngine.prototype._completeFightCave = function() {
    const fc = this.state.fightCave;
    const elapsed = Date.now() - (fc.startTime || Date.now());
    const minutes = Math.floor(elapsed / 60000);

    origComplete.call(this);

    const name = fcGetPlayerName();
    const completions = this.state.stats.fightCaveCompletions || 1;
    const deaths = this.state.stats.fightCaveDeaths || 0;
    let msg = `${name} has conquered the Fight Cave and earned the Ember Cape! (Clear #${completions} | ${minutes}min`;
    if (deaths > 0) msg += ` | ${deaths} death${deaths > 1 ? 's' : ''} total`;
    msg += ')';
    fcBroadcast(msg);
  };

  // Patch fleeFightCave to broadcast surrender
  const origFlee = GameEngine.prototype.fleeFightCave;
  GameEngine.prototype.fleeFightCave = function() {
    const fc = this.state.fightCave;
    const wave = (fc.currentWave || 0) + 1;
    origFlee.call(this);
    const name = fcGetPlayerName();
    fcBroadcast(`${name} surrendered the Fight Cave on wave ${wave}. The Ember Cape remains unclaimed.`);
  };

  console.log('[Ashfall] Fight Cave broadcasts enabled.');
}

// Apply patches IMMEDIATELY at script parse time.
// These scripts load AFTER engine.js (GameEngine exists) but BEFORE
// DOMContentLoaded fires (which is when game.init() runs).
// So we patch the prototype now, and init() will use the patched version.
applyFightCaveMixin();
patchFightCaveBroadcasts();

// ================================================================
// ASHFALL IDLE — Theatre of Ash (Raid System)
// 6 rooms. 6 bosses. One chest. Prove yourself.
// ================================================================

// ── BOSS DEFINITIONS ─────────────────────────────────────────────
const TOA_BOSSES = {
  ashen_maiden: {
    id:'ashen_maiden', name:'The Ashen Maiden', hp:15000, maxHit:35,
    attackSpeed:2.4, combatLevel:180, style:'melee',
    evasion:{melee:60,ranged:50,magic:40}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], theatreOnly:true,
    mechanic:{ id:'blood_spawn', name:'Blood Spawns', interval:30, windowSecs:12,
      handleDesc:'Destroy the spawns before they reach her',
      missedPenalty:'heal', healAmt:1200, missedDmg:0 },
    phases:1, styleHints:'Protect from Melee',
    desc:'She feeds on blood. Spawns must be destroyed or she heals.',
  },
  plague_golem: {
    id:'plague_golem', name:'The Plague Golem', hp:28000, maxHit:52,
    attackSpeed:3.6, combatLevel:220, style:'melee',
    evasion:{melee:80,ranged:70,magic:50}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], theatreOnly:true,
    mechanic:{ id:'stomp', name:'Stomp', interval:22, windowSecs:6,
      handleDesc:'Step aside — dodge the stomp',
      missedPenalty:'damage', missedDmg:55, healAmt:0 },
    phases:1, styleHints:'Protect from Melee — step away on stomp',
    desc:'Slow but devastating. Stomps kill the careless.',
  },
  ashling_queen: {
    id:'ashling_queen', name:'Ashling Queen', hp:22000, maxHit:40,
    attackSpeed:2.0, combatLevel:190, style:'magic',
    evasion:{melee:50,ranged:55,magic:80}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], theatreOnly:true,
    mechanic:{ id:'style_switch', name:'Style Switch', interval:18, windowSecs:8,
      handleDesc:'Switch your protection prayer to match her new style',
      missedPenalty:'damage', missedDmg:45, healAmt:0 },
    phases:1, styleHints:'Watch her style — she switches without warning',
    desc:'Commands the Ashling swarm. Her attack style changes unpredictably.',
  },
  hollowed_titan: {
    id:'hollowed_titan', name:'The Hollowed Titan', hp:38000, maxHit:58,
    attackSpeed:3.0, combatLevel:260, style:'melee',
    evasion:{melee:90,ranged:80,magic:60}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], theatreOnly:true,
    mechanic:{ id:'shadow_orb', name:'Shadow Orb', interval:20, windowSecs:7,
      handleDesc:'Sidestep the shadow orb before it detonates',
      missedPenalty:'damage', missedDmg:60, healAmt:0 },
    phases:2,
    phaseBreak:0.50, // switches at 50% HP
    phase2Style:'magic', phase2MaxHit:50,
    styleHints:'Phase 1: Protect Melee. Phase 2: Protect Magic',
    desc:'A corrupted titan. Shatters walls in phase 2 revealing void energy.',
  },
  void_remnant: {
    id:'void_remnant', name:'The Void Remnant', hp:32000, maxHit:50,
    attackSpeed:2.2, combatLevel:240, style:'ranged',
    evasion:{melee:60,ranged:85,magic:70}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], theatreOnly:true,
    mechanic:{ id:'void_beam', name:'Void Beam', interval:25, windowSecs:8,
      handleDesc:'Stand behind a pillar to block the void beam',
      missedPenalty:'damage', missedDmg:65, healAmt:0 },
    phases:2,
    phaseBreak:0.40,
    phase2Style:'magic', phase2MaxHit:55,
    styleHints:'Phase 1: Protect Ranged. Phase 2: Protect Magic. NEVER miss the beam.',
    desc:'A fragment of the Void Emperor himself. Void beams can one-hit.',
  },
  lady_veriax: {
    id:'lady_veriax', name:'Lady Veriax', hp:55000, maxHit:68,
    attackSpeed:2.4, combatLevel:310, style:'melee',
    evasion:{melee:100,ranged:95,magic:85}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], theatreOnly:true,
    mechanic:{ id:'tornado', name:'Tornados', interval:15, windowSecs:6,
      handleDesc:'Avoid the tornados — click move',
      missedPenalty:'damage', missedDmg:70, healAmt:0 },
    phases:3,
    phaseBreaks:[0.667, 0.333], // phase changes
    phase2Style:'ranged', phase2MaxHit:58,
    phase3Style:'magic', phase3MaxHit:62,
    styleHints:'P1: Melee. P2: Ranged + crabs. P3: Magic + webs (stun).',
    desc:'The ruler of the Theatre. Three phases. Each deadlier than the last.',
    isFinalBoss: true,
  },
};

// Register boss monsters
for (const [id, boss] of Object.entries(TOA_BOSSES)) {
  if (!GAME_DATA.monsters[id]) GAME_DATA.monsters[id] = { ...boss };
}

// ── THEATRE DATA ──────────────────────────────────────────────────
GAME_DATA.theatreOfAsh = {
  levelReq: 100, // combat level

  rooms: [
    { id:'maiden',  name:'Maiden\'s Chamber',   bossId:'ashen_maiden',   order:1 },
    { id:'bloat',   name:'Plague Den',           bossId:'plague_golem',   order:2 },
    { id:'ashling', name:'Ashling Sanctum',      bossId:'ashling_queen',  order:3 },
    { id:'titan',   name:'Titan\'s Hall',        bossId:'hollowed_titan', order:4 },
    { id:'remnant', name:'Void Antechamber',     bossId:'void_remnant',   order:5 },
    { id:'veriax',  name:'Veriax\'s Throne',    bossId:'lady_veriax',    order:6 },
  ],

  // ── LOOT TABLES ──
  lootTables: {
    bronze: [
      {item:'death_rune',    qty:50,  chance:0.70, rarity:'common'},
      {item:'blood_rune',    qty:30,  chance:0.60, rarity:'common'},
      {item:'runite_bar',    qty:3,   chance:0.50, rarity:'common'},
      {item:'shark',         qty:8,   chance:0.60, rarity:'common'},
      {item:'diamond',       qty:3,   chance:0.35, rarity:'uncommon'},
      {item:'dragonfruit',   qty:2,   chance:0.25, rarity:'uncommon'},
      {item:'dragonite_bar', qty:2,   chance:0.20, rarity:'rare'},
    ],
    silver: [
      {item:'death_rune',    qty:100, chance:0.80, rarity:'common'},
      {item:'blood_rune',    qty:60,  chance:0.80, rarity:'common'},
      {item:'dragonite_bar', qty:4,   chance:0.60, rarity:'rare'},
      {item:'torstol',       qty:5,   chance:0.45, rarity:'uncommon'},
      {item:'celestial_fragment',qty:2,chance:0.35,rarity:'epic'},
      {item:'amulet_of_torture', qty:1,chance:0.08,rarity:'legendary'},
      {item:'infernal_cape', qty:1,   chance:0.05, rarity:'legendary'},
    ],
    gold: [
      {item:'death_rune',    qty:200, chance:0.90, rarity:'common'},
      {item:'blood_rune',    qty:120, chance:0.90, rarity:'common'},
      {item:'dragonite_bar', qty:8,   chance:0.80, rarity:'rare'},
      {item:'celestial_fragment',qty:5,chance:0.70,rarity:'epic'},
      {item:'amulet_of_torture', qty:1,chance:0.20,rarity:'legendary'},
      {item:'infernal_cape', qty:1,   chance:0.15, rarity:'legendary'},
      {item:'void_tear',     qty:1,   chance:0.10, rarity:'legendary'},
      {item:'veriax_eye',    qty:1,   chance:0.08, rarity:'legendary'},
    ],
    purple: [
      {item:'death_rune',    qty:300, chance:1.0,  rarity:'common'},
      {item:'blood_rune',    qty:200, chance:1.0,  rarity:'common'},
      {item:'dragonite_bar', qty:12,  chance:1.0,  rarity:'rare'},
      {item:'celestial_fragment',qty:10,chance:1.0,rarity:'epic'},
      {item:'amulet_of_torture', qty:1,chance:0.50,rarity:'legendary'},
      {item:'infernal_cape', qty:1,   chance:0.40, rarity:'legendary'},
      {item:'void_tear',     qty:1,   chance:0.30, rarity:'legendary'},
      {item:'veriax_eye',    qty:1,   chance:0.25, rarity:'legendary'},
      // Unique item roll (one of the Theatre exclusives)
      {item:'_unique_roll',  qty:1,   chance:1.0,  rarity:'unique'},
    ],
    // Unique item pool — one random item from this list on purple chest
    unique: [
      {item:'veriax_scythe', chance:0.15},
      {item:'bloodfire_staff',chance:0.15},
      {item:'ashen_rapier',  chance:0.20},
      {item:'judicator_helm',chance:0.15},
      {item:'judicator_plate',chance:0.12},
      {item:'judicator_legs',chance:0.12},
      {item:'hollow_ward',   chance:0.08},
      {item:'lil_veriax',    chance:0.03},
    ],
  },

  // Tier thresholds
  tiers: {
    purple: { maxDeaths:0, maxTimeMins:15 },
    gold:   { maxDeaths:0, maxTimeMins:30 },
    silver: { maxDeaths:1, maxTimeMins:60 },
    bronze: { maxDeaths:99, maxTimeMins:999 },
  },
};

// ── THEATRE ENGINE ────────────────────────────────────────────────
GameEngine.prototype.startTheatreOfAsh = function() {
  if (this.getCombatLevel() < GAME_DATA.theatreOfAsh.levelReq) {
    this.emit('notification',{type:'warn',text:`Theatre of Ash requires combat level ${GAME_DATA.theatreOfAsh.levelReq}.`});
    return;
  }
  if (this.state.theatre?.active) {
    this.emit('notification',{type:'warn',text:'Already in the Theatre.'});
    return;
  }
  this.stopSkill();
  this.stopCombat();

  this.state.theatre = {
    active:true, room:0, phase:0,
    between:true, betweenTimer:5, // 5s intro
    mechanic:null, mechanicTimer:0,
    performance:{ deaths:0, damageReceived:0, startTime:Date.now(), elapsedSecs:0 },
    roomsCleared:[], chestOpen:false, loot:[], tier:null, uniqueItem:null,
  };

  this.emit('notification',{type:'achievement',text:'Entering the Theatre of Ash...'});
  this.emit('theatreStart');
};

GameEngine.prototype.tickTheatre = function(dt) {
  const t = this.state.theatre;
  if (!t?.active) return;
  const c = this.state.combat;

  t.performance.elapsedSecs += dt;

  // ── BETWEEN ROOMS ────────────────────────────────────────────
  if (t.between) {
    t.betweenTimer -= dt;
    if (t.betweenTimer <= 0) {
      t.between = false;
      this._startTheatreRoom(t.room);
    }
    this.emit('theatreTick', t);
    return;
  }

  // ── CHEST PHASE ──────────────────────────────────────────────
  if (t.room >= GAME_DATA.theatreOfAsh.rooms.length) {
    this.emit('theatreTick', t);
    return;
  }

  // ── MECHANIC TIMER ───────────────────────────────────────────
  if (t.mechanic && !t.mechanic.handled) {
    t.mechanicTimer -= dt;
    if (t.mechanicTimer <= 0) {
      // Mechanic missed — apply penalty
      const m = t.mechanic;
      if (m.missedPenalty === 'damage') {
        c.playerHp -= m.missedDmg;
        this.emit('combatHit',{who:'monster', dmg:m.missedDmg, mechanic:true});
        this.emit('notification',{type:'danger',text:`Missed: ${m.name}! ${m.missedDmg} damage!`});
      } else if (m.missedPenalty === 'heal') {
        c.monsterHp = Math.min(c.monsterHp + m.healAmt, this._getTheatreBossMaxHp());
        this.emit('notification',{type:'warn',text:`Missed: ${m.name}! Boss healed ${m.healAmt} HP!`});
      }
      t.mechanic = null;
      t.mechanicTimer = 0;
    }
  }

  // ── MECHANIC SPAWN ───────────────────────────────────────────
  const roomDef = GAME_DATA.theatreOfAsh.rooms[t.room];
  const boss = TOA_BOSSES[roomDef.bossId];
  if (!t.mechanic) {
    t._mechCooldown = (t._mechCooldown || 0) + dt;
    if (t._mechCooldown >= boss.mechanic.interval) {
      t._mechCooldown = 0;
      t.mechanic = {
        id: boss.mechanic.id,
        name: boss.mechanic.name,
        handleDesc: boss.mechanic.handleDesc,
        missedPenalty: boss.mechanic.missedPenalty,
        missedDmg: boss.mechanic.missedDmg,
        healAmt: boss.mechanic.healAmt,
        handled: false,
      };
      t.mechanicTimer = boss.mechanic.windowSecs;
      this.emit('theatreMechanic', t.mechanic);
    }
  }

  // ── PHASE TRANSITIONS ────────────────────────────────────────
  const bossHpPct = c.monsterHp / this._getTheatreBossMaxHp();
  if (boss.phases >= 2 && t.phase === 0 && bossHpPct <= boss.phaseBreak) {
    t.phase = 1;
    const bossMonster = GAME_DATA.monsters[roomDef.bossId];
    if (boss.phase2Style) bossMonster.style = boss.phase2Style;
    if (boss.phase2MaxHit) bossMonster.maxHit = boss.phase2MaxHit;
    this.emit('notification',{type:'warn',text:`${boss.name} — Phase 2!`});
    this.emit('theatrePhase', {phase:2, room:t.room});
  }
  if (boss.phases >= 3 && t.phase === 1 && bossHpPct <= boss.phaseBreaks[1]) {
    t.phase = 2;
    const bossMonster = GAME_DATA.monsters[roomDef.bossId];
    if (boss.phase3Style) bossMonster.style = boss.phase3Style;
    if (boss.phase3MaxHit) bossMonster.maxHit = boss.phase3MaxHit;
    this.emit('notification',{type:'danger',text:`${boss.name} — FINAL PHASE!`});
    this.emit('theatrePhase', {phase:3, room:t.room});
    c.playerHp = Math.min(c.playerHp + Math.floor(this.getMaxHp()*0.10), this.getMaxHp()); // 10% heal on final phase
  }

  // ── NORMAL COMBAT TICK (player + boss) ───────────────────────
  this._tickStatusEffects(c.statusEffects.monster, dt, 'monster');
  this._tickStatusEffects(c.statusEffects.player, dt, 'player');

  const playerSpeed = this.getPlayerAttackSpeed();
  c.playerAttackTimer += dt;
  if (c.playerAttackTimer >= playerSpeed) {
    c.playerAttackTimer -= playerSpeed;
    try { this.playerAttack(GAME_DATA.monsters[roomDef.bossId]); } catch(e) {}
    this.drainPrayerPoints();
    this.doPetCombatAction(GAME_DATA.monsters[roomDef.bossId]);
  }

  const monsterSpeed = GAME_DATA.monsters[roomDef.bossId].attackSpeed * 0.7;
  c.monsterAttackTimer += dt;
  if (c.monsterAttackTimer >= monsterSpeed) {
    c.monsterAttackTimer -= monsterSpeed;
    this.monsterAttack(GAME_DATA.monsters[roomDef.bossId]);
    t.performance.damageReceived += (this.getMaxHp() - c.playerHp);
  }

  // Auto-eat
  if (c.autoEat && c.playerHp < this.getMaxHp() * 0.4) this.eatFood();

  // ── PLAYER DEATH ─────────────────────────────────────────────
  if (c.playerHp <= 0) {
    t.performance.deaths++;
    c.playerHp = Math.floor(this.getMaxHp() * 0.3); // partial HP restore on death
    this.emit('notification',{type:'danger',text:`You died in the Theatre! Death ${t.performance.deaths}.`});
    this.emit('theatreDeath', {deaths:t.performance.deaths, room:t.room});
    t.mechanic = null; t.mechanicTimer = 0; t._mechCooldown = 0;
    // Optional: quit if too many deaths
    if (t.performance.deaths >= 5) { this._endTheatre(false); return; }
  }

  // ── BOSS DEATH ───────────────────────────────────────────────
  if (c.monsterHp <= 0) {
    this._clearTheatreRoom(t.room);
  }

  this.emit('theatreTick', t);
};

GameEngine.prototype._getTheatreBossMaxHp = function() {
  const t = this.state.theatre;
  const roomDef = GAME_DATA.theatreOfAsh.rooms[t.room];
  return roomDef ? TOA_BOSSES[roomDef.bossId].hp : 1;
};

GameEngine.prototype._startTheatreRoom = function(roomIdx) {
  const t = this.state.theatre;
  const roomDef = GAME_DATA.theatreOfAsh.rooms[roomIdx];
  if (!roomDef) { this._completeTheatre(); return; }

  const boss = TOA_BOSSES[roomDef.bossId];
  // Restore boss stats for this fight
  Object.assign(GAME_DATA.monsters[roomDef.bossId], boss);

  const c = this.state.combat;
  c.active = true;
  c.monster = roomDef.bossId;
  c.monsterHp = boss.hp;
  c.playerAttackTimer = 0;
  c.monsterAttackTimer = 0;
  c.statusEffects = { player:{}, monster:{} };
  c._multiMobMode = false;
  c._bossPhase = 0; c._enrageTimer = 0; c._enrageBonus = 0;
  if (!c.cannon) c.cannon = { active:false, timer:0 };
  else c.cannon.timer = 0; // reset fire timer but keep active state

  t.phase = 0;
  t.mechanic = null;
  t.mechanicTimer = 0;
  t._mechCooldown = 0;

  this.emit('notification',{type:'info',text:`Room ${roomIdx+1}: ${boss.name}`});
  this.emit('theatreRoom', { room:roomIdx, boss:boss.name });
  this.emit('combatStart', { theatre:true, room:roomIdx, bossId:roomDef.bossId });
};

GameEngine.prototype._clearTheatreRoom = function(roomIdx) {
  const t = this.state.theatre;
  const roomDef = GAME_DATA.theatreOfAsh.rooms[roomIdx];
  const boss = TOA_BOSSES[roomDef.bossId];

  t.roomsCleared.push(roomDef.id);
  this.addXp('hitpoints', Math.floor(boss.hp * 0.05));
  const style = this.state.combat.combatStyle;
  if (style==='melee')  { this.addXp('attack',300); this.addXp('strength',300); this.addXp('defence',300); }
  else if (style==='ranged') { this.addXp('ranged',600); this.addXp('defence',200); }
  else { this.addXp('magic',600); this.addXp('defence',200); }
  this.addXp('tactics', 500);

  const nextRoom = roomIdx + 1;
  const isLast = nextRoom >= GAME_DATA.theatreOfAsh.rooms.length;

  this.emit('notification',{
    type:'success',
    text: isLast ? `Lady Veriax defeated! The Theatre is complete!` : `Room ${roomIdx+1} cleared! Rest before the next room.`
  });

  if (isLast) {
    this._completeTheatre();
  } else {
    t.room = nextRoom;
    t.between = true;
    t.betweenTimer = 8; // 8 second rest between rooms
    this.state.combat.active = false;
    this.emit('theatreBetweenRooms', { nextRoom, nextBoss: TOA_BOSSES[GAME_DATA.theatreOfAsh.rooms[nextRoom].bossId].name });
  }
};

GameEngine.prototype._completeTheatre = function() {
  const t = this.state.theatre;
  t.room = GAME_DATA.theatreOfAsh.rooms.length; // past last room
  t.between = false;
  this.state.combat.active = false;

  // Calculate tier
  const elapsedMins = t.performance.elapsedSecs / 60;
  const deaths = t.performance.deaths;
  const tiers = GAME_DATA.theatreOfAsh.tiers;
  let tier = 'bronze';
  if (deaths <= tiers.purple.maxDeaths && elapsedMins <= tiers.purple.maxTimeMins) tier = 'purple';
  else if (deaths <= tiers.gold.maxDeaths && elapsedMins <= tiers.gold.maxTimeMins) tier = 'gold';
  else if (deaths <= tiers.silver.maxDeaths && elapsedMins <= tiers.silver.maxTimeMins) tier = 'silver';
  t.tier = tier;

  // Update stats
  if (!this.state.stats.theatreCompletions) this.state.stats.theatreCompletions = 0;
  if (!this.state.stats.theatreBestTier) this.state.stats.theatreBestTier = 'bronze';
  this.state.stats.theatreCompletions++;
  const tierOrder = ['bronze','silver','gold','purple'];
  if (tierOrder.indexOf(tier) > tierOrder.indexOf(this.state.stats.theatreBestTier)) {
    this.state.stats.theatreBestTier = tier;
  }

  this.emit('theatreComplete', { tier, deaths, elapsedMins: Math.floor(elapsedMins) });
  this.emit('notification',{
    type:'achievement',
    text:`Theatre of Ash complete! ${tier.toUpperCase()} chest! ${deaths} deaths, ${Math.floor(elapsedMins)}m`
  });
};

GameEngine.prototype.openTheatreChest = function() {
  const t = this.state.theatre;
  if (!t || t.chestOpen || t.room < GAME_DATA.theatreOfAsh.rooms.length) return;

  const table = GAME_DATA.theatreOfAsh.lootTables[t.tier];
  const loot = [];

  for (const drop of table) {
    if (drop.item === '_unique_roll') {
      // Roll unique
      const unique = this._rollTheatreUnique();
      if (unique) {
        this.addItem(unique.item, 1);
        loot.push({ item:unique.item, qty:1, rarity:'unique' });
        t.uniqueItem = unique.item;
        this.emit('notification',{type:'achievement',text:`UNIQUE DROP: ${GAME_DATA.items[unique.item]?.name}!`});
      }
      continue;
    }
    if (Math.random() < drop.chance) {
      this.addItem(drop.item, drop.qty);
      loot.push({ item:drop.item, qty:drop.qty, rarity:drop.rarity });
    }
  }

  t.loot = loot;
  t.chestOpen = true;
  this.emit('theatreChestOpen', { tier:t.tier, loot, unique:t.uniqueItem });
};

GameEngine.prototype._rollTheatreUnique = function() {
  const pool = GAME_DATA.theatreOfAsh.lootTables.unique;
  const roll = Math.random();
  let cumulative = 0;
  for (const item of pool) {
    cumulative += item.chance;
    if (roll <= cumulative) return item;
  }
  return pool[Math.floor(Math.random() * pool.length)];
};

GameEngine.prototype.handleTheatreMechanic = function() {
  const t = this.state.theatre;
  if (!t?.mechanic || t.mechanic.handled) return;
  t.mechanic.handled = true;
  t.mechanicTimer = 0;
  this.emit('notification',{type:'success',text:`Mechanic handled!`});
  this.addXp('tactics', 50);
};

GameEngine.prototype.leaveTheatre = function() {
  this._endTheatre(false);
};

GameEngine.prototype._endTheatre = function(completed) {
  if (!this.state.theatre) return;
  if (!completed) this.emit('notification',{type:'warn',text:'You flee the Theatre of Ash.'});
  this.state.theatre = { active:false };
  this.state.combat.active = false;
  this.emit('theatreEnd');
};

// ── HOOK INTO MAIN TICK ───────────────────────────────────────────
const _origTick = GameEngine.prototype.tick;
GameEngine.prototype.tick = function() {
  _origTick.call(this);
  if (this.state.theatre?.active && !this.state.theatre.chestOpen) {
    // tick is already called — we hook into emit('tick') below
  }
};

// Override emit to intercept 'tick' and run theatre tick
const _origEmit = GameEngine.prototype.emit;
GameEngine.prototype.emit = function(event, data) {
  _origEmit.call(this, event, data);
  if (event === 'tick' && this.state.theatre?.active && !this.state.theatre.chestOpen) {
    // tickCombat already ran; run theatre on top (only if combat not active OR if theatre owns combat)
    const dt = Math.min((Date.now() - (this._lastTheatreTick||Date.now())) / 1000, 1.0);
    this._lastTheatreTick = Date.now();
    if (dt > 0.05) this.tickTheatre(dt);
  }
};

console.log('[Ashfall] Theatre of Ash loaded. Bosses:', Object.keys(TOA_BOSSES).length, '| Rooms:', GAME_DATA.theatreOfAsh.rooms.length);

// ── REGISTER BOSS ART IN GAME_DATA.monsterArt ─────────────────────
// Run after DOM ready so GAME_DATA.monsterArt is fully initialized
(function registerToaBossArt() {
  if (!GAME_DATA.monsterArt) GAME_DATA.monsterArt = {};

  GAME_DATA.monsterArt.ashen_maiden = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="am-aura" cx="50%" cy="70%" r="60%">
        <stop offset="0%" stop-color="#8a0a3a" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#8a0a3a" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- Aura -->
    <ellipse cx="60" cy="110" rx="55" ry="35" fill="url(#am-aura)"/>
    <!-- Flowing gown -->
    <path d="M35 62 Q60 55 85 62 L95 130 Q60 145 25 130Z" fill="#1a040c" stroke="#7a0a2a" stroke-width="1.5"/>
    <path d="M35 62 Q60 57 85 62 L88 80 Q60 75 32 80Z" fill="#2a0816" opacity="0.7"/>
    <path d="M38 90 Q60 86 82 90 M34 108 Q60 104 86 108" stroke="#5a0a1a" stroke-width="0.8" fill="none" opacity="0.5"/>
    <!-- Torso / bodice -->
    <path d="M38 40 Q60 34 82 40 L85 65 Q60 70 35 65Z" fill="#1a040c" stroke="#aa1a4a" stroke-width="1.5"/>
    <path d="M50 42 Q60 39 70 42 L72 58 Q60 62 48 58Z" fill="#2a0816"/>
    <!-- Arms with flowing sleeves -->
    <path d="M35 45 Q20 55 15 70 Q12 80 20 85" stroke="#1a040c" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M85 45 Q100 55 105 70 Q108 80 100 85" stroke="#1a040c" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M14 72 Q8 80 12 88" stroke="#7a0a2a" stroke-width="1.5" fill="none"/>
    <path d="M106 72 Q112 80 108 88" stroke="#7a0a2a" stroke-width="1.5" fill="none"/>
    <!-- Blood orbs in hands -->
    <circle cx="12" cy="88" r="7" fill="#0a0004" stroke="#c44040" stroke-width="1.5"/>
    <circle cx="12" cy="88" r="4" fill="#c44040" opacity="0.8"/>
    <circle cx="12" cy="88" r="2" fill="#ff8080"/>
    <circle cx="108" cy="88" r="7" fill="#0a0004" stroke="#c44040" stroke-width="1.5"/>
    <circle cx="108" cy="88" r="4" fill="#c44040" opacity="0.8"/>
    <circle cx="108" cy="88" r="2" fill="#ff8080"/>
    <!-- Head -->
    <ellipse cx="60" cy="22" rx="20" ry="22" fill="#1a040c" stroke="#aa1a4a" stroke-width="2"/>
    <!-- Hair tendrils -->
    <path d="M42 14 Q35 4 28 2" stroke="#5a0a1a" stroke-width="2.5" fill="none"/>
    <path d="M50 8  Q46 -2 42 -4" stroke="#5a0a1a" stroke-width="2" fill="none"/>
    <path d="M78 14 Q85 4 92 2" stroke="#5a0a1a" stroke-width="2.5" fill="none"/>
    <path d="M70 8  Q74 -2 78 -4" stroke="#5a0a1a" stroke-width="2" fill="none"/>
    <!-- Eyes — glowing red -->
    <ellipse cx="51" cy="20" rx="5" ry="5.5" fill="#050002"/>
    <ellipse cx="69" cy="20" rx="5" ry="5.5" fill="#050002"/>
    <circle cx="51" cy="20" r="3.5" fill="#c44040" opacity="0.95"/>
    <circle cx="69" cy="20" r="3.5" fill="#c44040" opacity="0.95"/>
    <circle cx="51" cy="20" r="1.5" fill="#ff8080"/>
    <circle cx="69" cy="20" r="1.5" fill="#ff8080"/>
    <!-- Crown of thorns -->
    <path d="M40 10 Q43 2 46 4 Q49 -2 52 2 Q56 -4 60 0 Q64 -4 68 2 Q71 -2 74 4 Q77 2 80 10" stroke="#aa1a4a" stroke-width="2" fill="none"/>
    <!-- Blood drips from gown hem -->
    <path d="M35 132 Q36 138 35 144" stroke="#c44040" stroke-width="1.5" fill="none" opacity="0.6"/>
    <path d="M55 135 Q56 142 54 148" stroke="#8a0a0a" stroke-width="1.2" fill="none" opacity="0.5"/>
    <path d="M80 133 Q81 140 80 146" stroke="#c44040" stroke-width="1.5" fill="none" opacity="0.6"/>
    <!-- Blood pool -->
    <ellipse cx="60" cy="148" rx="35" ry="6" fill="#5a0a0a" opacity="0.5"/>
  </svg>`;

  GAME_DATA.monsterArt.plague_golem = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="pg-aura" cx="50%" cy="80%" r="50%">
        <stop offset="0%" stop-color="#2a4a0a" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#2a4a0a" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="130" rx="50" ry="18" fill="url(#pg-aura)"/>
    <!-- Massive legs -->
    <rect x="20" y="105" width="28" height="40" rx="6" fill="#141208" stroke="#3a5a0a" stroke-width="1.5"/>
    <rect x="72" y="105" width="28" height="40" rx="6" fill="#141208" stroke="#3a5a0a" stroke-width="1.5"/>
    <!-- Body torso — huge, rounded -->
    <rect x="12" y="45" width="96" height="68" rx="16" fill="#1a1a08" stroke="#4a6a1a" stroke-width="2.5"/>
    <!-- Plague pustules -->
    <circle cx="30" cy="65" r="8" fill="#2a3a04" stroke="#4a6a0a" stroke-width="1"/>
    <circle cx="30" cy="65" r="4" fill="#6a8a10" opacity="0.7"/>
    <circle cx="54" cy="80" r="10" fill="#1e2c04" stroke="#4a6a0a" stroke-width="1.5"/>
    <circle cx="54" cy="80" r="5" fill="#7a9a14" opacity="0.7"/>
    <circle cx="80" cy="58" r="7" fill="#2a3a04" stroke="#4a6a0a" stroke-width="1"/>
    <circle cx="80" cy="58" r="3.5" fill="#6a8a10" opacity="0.7"/>
    <circle cx="95" cy="85" r="9" fill="#1e2c04" stroke="#3a5a0a" stroke-width="1"/>
    <circle cx="95" cy="85" r="4.5" fill="#6a8a10" opacity="0.6"/>
    <circle cx="40" cy="98" r="6" fill="#2a3a04" stroke="#4a6a0a" stroke-width="1"/>
    <circle cx="74" cy="100" r="7" fill="#1e2c04" stroke="#3a5a0a" stroke-width="1"/>
    <!-- Arms — thick, hanging -->
    <rect x="-4" y="50" width="22" height="55" rx="10" fill="#141208" stroke="#3a5a0a" stroke-width="1.5"/>
    <rect x="102" y="50" width="22" height="55" rx="10" fill="#141208" stroke="#3a5a0a" stroke-width="1.5"/>
    <!-- Claws -->
    <path d="M0 103 Q-6 110 -2 116 M8 105 Q4 113 6 120 M16 104 Q14 112 16 119" stroke="#3a5a0a" stroke-width="2" fill="none"/>
    <path d="M120 103 Q126 110 122 116 M112 105 Q116 113 114 120 M104 104 Q106 112 104 119" stroke="#3a5a0a" stroke-width="2" fill="none"/>
    <!-- Head — wide, menacing -->
    <rect x="22" y="18" width="76" height="32" rx="12" fill="#1a1a08" stroke="#4a6a1a" stroke-width="2"/>
    <!-- Eyes — yellow-green sick glow -->
    <ellipse cx="41" cy="34" rx="9" ry="9" fill="#0a0c02"/>
    <ellipse cx="79" cy="34" rx="9" ry="9" fill="#0a0c02"/>
    <circle cx="41" cy="34" r="6" fill="#8aaa1a" opacity="0.9"/>
    <circle cx="79" cy="34" r="6" fill="#8aaa1a" opacity="0.9"/>
    <circle cx="41" cy="34" r="3" fill="#aada2a"/>
    <circle cx="79" cy="34" r="3" fill="#aada2a"/>
    <!-- Teeth / mouth grill -->
    <path d="M35 44 L40 50 L46 44 L52 50 L58 44 L64 50 L70 44 L76 50 L82 44 L87 50" stroke="#2a3a04" stroke-width="2" fill="none"/>
    <!-- Flies orbiting -->
    <circle cx="8" cy="40" r="2.5" fill="#1a1a04" stroke="#2a2a04" stroke-width="0.5"/>
    <circle cx="112" cy="60" r="2" fill="#1a1a04"/>
    <circle cx="15" cy="75" r="2.5" fill="#1a1a04"/>
    <circle cx="105" cy="30" r="2" fill="#1a1a04"/>
    <!-- Ground poison puddle -->
    <ellipse cx="60" cy="146" rx="42" ry="8" fill="#1a2a04" opacity="0.6"/>
  </svg>`;

  GAME_DATA.monsterArt.ashling_queen = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="aq-glow" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#c9873e" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#c9873e" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="120" rx="50" ry="25" fill="url(#aq-glow)"/>
    <!-- Wing membrane left -->
    <path d="M28 50 Q5 20 2 55 Q5 75 28 68" fill="#1a1208" stroke="#c9873e" stroke-width="1.5" opacity="0.85"/>
    <path d="M28 50 Q10 35 8 50 Q10 62 28 60" fill="#241a08" opacity="0.5"/>
    <!-- Wing membrane right -->
    <path d="M92 50 Q115 20 118 55 Q115 75 92 68" fill="#1a1208" stroke="#c9873e" stroke-width="1.5" opacity="0.85"/>
    <path d="M92 50 Q110 35 112 50 Q110 62 92 60" fill="#241a08" opacity="0.5"/>
    <!-- Wing veins -->
    <path d="M28 55 Q18 42 10 38" stroke="#c9873e" stroke-width="0.8" fill="none" opacity="0.4"/>
    <path d="M28 60 Q14 55 8 58" stroke="#c9873e" stroke-width="0.8" fill="none" opacity="0.4"/>
    <path d="M92 55 Q102 42 110 38" stroke="#c9873e" stroke-width="0.8" fill="none" opacity="0.4"/>
    <path d="M92 60 Q106 55 112 58" stroke="#c9873e" stroke-width="0.8" fill="none" opacity="0.4"/>
    <!-- Gown flowing -->
    <path d="M34 68 Q60 62 86 68 L90 130 Q60 142 30 130Z" fill="#0e1006" stroke="#6a5a08" stroke-width="1"/>
    <path d="M36 85 Q60 80 84 85 M32 105 Q60 100 88 105" stroke="#4a4008" stroke-width="0.8" fill="none" opacity="0.4"/>
    <!-- Insect-like abdomen / torso -->
    <path d="M38 46 Q60 40 82 46 L85 70 Q60 76 35 70Z" fill="#0e1006" stroke="#c9873e" stroke-width="1.5"/>
    <!-- Segmented chitin markings -->
    <path d="M40 52 Q60 48 80 52" stroke="#c9873e" stroke-width="1" fill="none" opacity="0.4"/>
    <path d="M42 60 Q60 56 78 60" stroke="#c9873e" stroke-width="0.8" fill="none" opacity="0.3"/>
    <!-- Mantis arms -->
    <path d="M36 52 Q22 58 18 68 Q14 76 20 80" stroke="#0e1006" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M84 52 Q98 58 102 68 Q106 76 100 80" stroke="#0e1006" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M20 78 Q12 84 14 92" stroke="#c9873e" stroke-width="2" fill="none"/>
    <path d="M100 78 Q108 84 106 92" stroke="#c9873e" stroke-width="2" fill="none"/>
    <!-- Head — insectoid -->
    <ellipse cx="60" cy="24" rx="22" ry="20" fill="#0e1006" stroke="#c9873e" stroke-width="2"/>
    <!-- Compound eyes -->
    <ellipse cx="46" cy="20" rx="8" ry="8" fill="#060802"/>
    <ellipse cx="74" cy="20" rx="8" ry="8" fill="#060802"/>
    <circle cx="43" cy="18" r="3" fill="#c9873e" opacity="0.9"/>
    <circle cx="47" cy="22" r="2.5" fill="#d4a83a" opacity="0.8"/>
    <circle cx="71" cy="18" r="3" fill="#c9873e" opacity="0.9"/>
    <circle cx="75" cy="22" r="2.5" fill="#d4a83a" opacity="0.8"/>
    <!-- Antennae -->
    <path d="M50 8 Q44 0 36 -4" stroke="#c9873e" stroke-width="1.5" fill="none"/>
    <path d="M70 8 Q76 0 84 -4" stroke="#c9873e" stroke-width="1.5" fill="none"/>
    <circle cx="36" cy="-4" r="2.5" fill="#c9873e"/>
    <circle cx="84" cy="-4" r="2.5" fill="#c9873e"/>
    <!-- Crown of chitin spines -->
    <path d="M42 8 L40 0 M52 5 L50 -3 M60 4 L60 -4 M68 5 L70 -3 M78 8 L80 0" stroke="#c9873e" stroke-width="1.5" stroke-linecap="round"/>
    <!-- Swarm dots orbiting -->
    <circle cx="5"  cy="50" r="3" fill="#c9873e" opacity="0.5"/>
    <circle cx="115" cy="45" r="3" fill="#c9873e" opacity="0.5"/>
    <circle cx="3"  cy="80" r="2" fill="#c9873e" opacity="0.4"/>
    <circle cx="117" cy="75" r="2" fill="#c9873e" opacity="0.4"/>
    <circle cx="10" cy="100" r="2.5" fill="#c9873e" opacity="0.3"/>
    <!-- Ground shadow -->
    <ellipse cx="60" cy="147" rx="38" ry="7" fill="#1a1500" opacity="0.5"/>
  </svg>`;

  GAME_DATA.monsterArt.hollowed_titan = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ht-glow" cx="50%" cy="60%" r="55%">
        <stop offset="0%" stop-color="#4a5264" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#4a5264" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="138" rx="52" ry="14" fill="url(#ht-glow)"/>
    <!-- Massive armored legs -->
    <rect x="14" y="108" width="34" height="38" rx="5" fill="#101018" stroke="#3a4254" stroke-width="2"/>
    <rect x="72" y="108" width="34" height="38" rx="5" fill="#101018" stroke="#3a4254" stroke-width="2"/>
    <!-- Knee plates -->
    <ellipse cx="31" cy="110" rx="14" ry="7" fill="#1a1a2a" stroke="#4a5264" stroke-width="1.5"/>
    <ellipse cx="89" cy="110" rx="14" ry="7" fill="#1a1a2a" stroke="#4a5264" stroke-width="1.5"/>
    <!-- Torso — imposing plate armor -->
    <rect x="8" y="42" width="104" height="72" rx="10" fill="#101018" stroke="#4a5264" stroke-width="2.5"/>
    <!-- Armor plate lines -->
    <path d="M8 70 L112 70 M8 90 L112 90" stroke="#3a4254" stroke-width="1" opacity="0.5"/>
    <path d="M60 42 L60 114" stroke="#3a4254" stroke-width="0.8" opacity="0.4"/>
    <!-- Void rune on chest -->
    <circle cx="60" cy="78" r="14" fill="#060610" stroke="#8a3ab0" stroke-width="2"/>
    <circle cx="60" cy="78" r="10" fill="none" stroke="#6a1a8a" stroke-width="1" stroke-dasharray="3 2"/>
    <circle cx="60" cy="78" r="5" fill="#8a3ab0" opacity="0.7"/>
    <circle cx="60" cy="78" r="2.5" fill="#e0a0ff"/>
    <!-- Battle damage cracks -->
    <path d="M18 50 L28 65 L22 75" stroke="#4a5264" stroke-width="1.5" fill="none" opacity="0.6"/>
    <path d="M100 55 L92 70 L98 80" stroke="#4a5264" stroke-width="1.2" fill="none" opacity="0.5"/>
    <!-- Shoulders — massive pauldrons -->
    <path d="M8 50 Q0 42 2 56 Q4 68 8 64" fill="#0c0c1a" stroke="#4a5264" stroke-width="1.5"/>
    <path d="M112 50 Q120 42 118 56 Q116 68 112 64" fill="#0c0c1a" stroke="#4a5264" stroke-width="1.5"/>
    <!-- Arms — armored, holding greatweapon -->
    <rect x="-2" y="52" width="18" height="55" rx="8" fill="#101018" stroke="#3a4254" stroke-width="1.5"/>
    <rect x="104" y="52" width="18" height="55" rx="8" fill="#101018" stroke="#3a4254" stroke-width="1.5"/>
    <!-- Gauntlet spikes -->
    <path d="M2 104 L-2 112 M8 106 L6 114 M14 105 L14 113" stroke="#4a5264" stroke-width="2" stroke-linecap="round"/>
    <path d="M118 104 L122 112 M112 106 L114 114 M106 105 L106 113" stroke="#4a5264" stroke-width="2" stroke-linecap="round"/>
    <!-- Head — angular great helm -->
    <rect x="26" y="14" width="68" height="32" rx="8" fill="#101018" stroke="#4a5264" stroke-width="2.5"/>
    <!-- Helm visor — glowing void eyes -->
    <rect x="32" y="20" width="22" height="12" rx="3" fill="#060610"/>
    <rect x="66" y="20" width="22" height="12" rx="3" fill="#060610"/>
    <rect x="34" y="22" width="18" height="8" rx="2" fill="#8a3ab0" opacity="0.8"/>
    <rect x="68" y="22" width="18" height="8" rx="2" fill="#8a3ab0" opacity="0.8"/>
    <rect x="36" y="23" width="14" height="6" rx="1" fill="#d080ff"/>
    <rect x="70" y="23" width="14" height="6" rx="1" fill="#d080ff"/>
    <!-- Helm crest -->
    <path d="M30 14 L28 8 M60 12 L60 5 M90 14 L92 8" stroke="#4a5264" stroke-width="2" stroke-linecap="round"/>
    <!-- Vertical void crack down armor -->
    <path d="M58 42 Q56 60 58 78 Q60 95 58 114" stroke="#8a3ab0" stroke-width="1" fill="none" opacity="0.4"/>
  </svg>`;

  GAME_DATA.monsterArt.void_remnant = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="vr-core" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#9b30d0" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#050010" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="vr-outer" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#9b30d0" stop-opacity="0.1"/>
        <stop offset="100%" stop-color="#9b30d0" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- Outer void aura -->
    <ellipse cx="60" cy="65" rx="55" ry="60" fill="url(#vr-outer)"/>
    <!-- Main void sphere body -->
    <circle cx="60" cy="60" r="48" fill="#040008" stroke="#8a3ab0" stroke-width="2.5"/>
    <circle cx="60" cy="60" r="42" fill="#060010" stroke="#5a0a9a" stroke-width="1" stroke-dasharray="4 3"/>
    <circle cx="60" cy="60" r="32" fill="url(#vr-core)"/>
    <!-- Void crack patterns -->
    <path d="M30 30 Q40 45 35 60 Q30 75 40 85" stroke="#6a0aaa" stroke-width="1.5" fill="none" opacity="0.6"/>
    <path d="M90 30 Q80 45 85 60 Q90 75 80 85" stroke="#6a0aaa" stroke-width="1.5" fill="none" opacity="0.6"/>
    <path d="M25 60 Q40 55 55 60" stroke="#9b30d0" stroke-width="1" fill="none" opacity="0.4"/>
    <path d="M65 60 Q80 55 95 60" stroke="#9b30d0" stroke-width="1" fill="none" opacity="0.4"/>
    <!-- Three void eyes cluster -->
    <circle cx="60" cy="42" r="10" fill="#020004"/><circle cx="60" cy="42" r="7" fill="#9b30d0" opacity="0.9"/><circle cx="60" cy="42" r="4" fill="#c060f0"/><circle cx="60" cy="42" r="2" fill="#fff" opacity="0.9"/>
    <circle cx="44" cy="62" r="8" fill="#020004"/><circle cx="44" cy="62" r="5.5" fill="#7020b0" opacity="0.9"/><circle cx="44" cy="62" r="3" fill="#b050e0"/><circle cx="44" cy="62" r="1.5" fill="#fff" opacity="0.8"/>
    <circle cx="76" cy="62" r="8" fill="#020004"/><circle cx="76" cy="62" r="5.5" fill="#7020b0" opacity="0.9"/><circle cx="76" cy="62" r="3" fill="#b050e0"/><circle cx="76" cy="62" r="1.5" fill="#fff" opacity="0.8"/>
    <!-- Void tendrils extending downward -->
    <path d="M35 95 Q28 110 30 125 Q32 135 38 140" stroke="#6a0aaa" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M50 100 Q45 115 46 130" stroke="#8a3ab0" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M70 100 Q75 115 74 130" stroke="#8a3ab0" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M85 95 Q92 110 90 125 Q88 135 82 140" stroke="#6a0aaa" stroke-width="3" fill="none" stroke-linecap="round"/>
    <!-- Tendril tips -->
    <circle cx="38" cy="140" r="4" fill="#9b30d0" opacity="0.7"/>
    <circle cx="46" cy="130" r="3" fill="#8a3ab0" opacity="0.6"/>
    <circle cx="74" cy="130" r="3" fill="#8a3ab0" opacity="0.6"/>
    <circle cx="82" cy="140" r="4" fill="#9b30d0" opacity="0.7"/>
    <!-- Orbiting void fragments -->
    <ellipse cx="10" cy="45" rx="5" ry="8" fill="#1a0030" stroke="#8a3ab0" stroke-width="1" transform="rotate(-20 10 45)"/>
    <ellipse cx="110" cy="40" rx="4" ry="7" fill="#1a0030" stroke="#8a3ab0" stroke-width="1" transform="rotate(15 110 40)"/>
    <ellipse cx="8" cy="80" rx="3" ry="5" fill="#1a0028" stroke="#6a0a8a" stroke-width="0.8" transform="rotate(30 8 80)"/>
    <ellipse cx="112" cy="75" rx="3" ry="5" fill="#1a0028" stroke="#6a0a8a" stroke-width="0.8" transform="rotate(-25 112 75)"/>
  </svg>`;

  GAME_DATA.monsterArt.lady_veriax = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="lv-aura" cx="50%" cy="60%" r="70%">
        <stop offset="0%" stop-color="#9b30d0" stop-opacity="0.25"/>
        <stop offset="60%" stop-color="#d4a83a" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#9b30d0" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="lv-crown" cx="50%" cy="0%" r="100%">
        <stop offset="0%" stop-color="#d4a83a" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#d4a83a" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- Grand aura -->
    <ellipse cx="60" cy="80" rx="58" ry="65" fill="url(#lv-aura)"/>
    <!-- Outer rune circles -->
    <circle cx="60" cy="80" r="56" fill="none" stroke="#5a0a9a" stroke-width="0.8" stroke-dasharray="3 4" opacity="0.3"/>
    <circle cx="60" cy="80" r="48" fill="none" stroke="#8a6020" stroke-width="0.5" stroke-dasharray="2 5" opacity="0.2"/>
    <!-- Flowing dark gown — elaborate -->
    <path d="M30 70 Q60 62 90 70 L100 140 Q60 152 20 140Z" fill="#140020" stroke="#9b30d0" stroke-width="1.5"/>
    <!-- Gown layers -->
    <path d="M32 85  Q60 78  88 85"  fill="none" stroke="#7020a0" stroke-width="1" opacity="0.5"/>
    <path d="M28 100 Q60 94  92 100" fill="none" stroke="#5a0a80" stroke-width="0.8" opacity="0.4"/>
    <path d="M24 115 Q60 110 96 115" fill="none" stroke="#3a0060" stroke-width="0.6" opacity="0.3"/>
    <!-- Void orbs on gown -->
    <circle cx="40" cy="95"  r="4" fill="#0a0012" stroke="#9b30d0" stroke-width="1"/><circle cx="40" cy="95"  r="2" fill="#9b30d0" opacity="0.8"/>
    <circle cx="80" cy="95"  r="4" fill="#0a0012" stroke="#9b30d0" stroke-width="1"/><circle cx="80" cy="95"  r="2" fill="#9b30d0" opacity="0.8"/>
    <circle cx="50" cy="118" r="3" fill="#0a0012" stroke="#8a3ab0" stroke-width="0.8"/><circle cx="50" cy="118" r="1.5" fill="#8a3ab0" opacity="0.7"/>
    <circle cx="70" cy="118" r="3" fill="#0a0012" stroke="#8a3ab0" stroke-width="0.8"/><circle cx="70" cy="118" r="1.5" fill="#8a3ab0" opacity="0.7"/>
    <!-- Torso / bodice — ornate -->
    <path d="M34 46 Q60 38 86 46 L90 72 Q60 78 30 72Z" fill="#1a0028" stroke="#9b30d0" stroke-width="2"/>
    <!-- Chest void eye -->
    <circle cx="60" cy="60" r="8" fill="#060010" stroke="#9b30d0" stroke-width="1.5"/>
    <circle cx="60" cy="60" r="5.5" fill="#9b30d0" opacity="0.8"/>
    <circle cx="60" cy="60" r="3" fill="#e0a0ff"/>
    <circle cx="60" cy="60" r="1.2" fill="#fff" opacity="0.9"/>
    <!-- Arms — long, elegant with orb weapons -->
    <path d="M32 52 Q16 62 10 78 Q6 88 12 95" stroke="#1a0028" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M88 52 Q104 62 110 78 Q114 88 108 95" stroke="#1a0028" stroke-width="10" fill="none" stroke-linecap="round"/>
    <!-- Arm veins -->
    <path d="M22 68 Q16 74 14 82" stroke="#9b30d0" stroke-width="1.2" fill="none" opacity="0.4"/>
    <path d="M98 68 Q104 74 106 82" stroke="#9b30d0" stroke-width="1.2" fill="none" opacity="0.4"/>
    <!-- Orb weapons in hands -->
    <circle cx="12" cy="97" r="10" fill="#040008" stroke="#9b30d0" stroke-width="2"/>
    <circle cx="12" cy="97" r="7" fill="#6a0aaa" opacity="0.8"/>
    <circle cx="12" cy="97" r="4" fill="#c060f0"/>
    <circle cx="12" cy="97" r="1.5" fill="#fff" opacity="0.9"/>
    <circle cx="108" cy="97" r="10" fill="#040008" stroke="#d4a83a" stroke-width="2"/>
    <circle cx="108" cy="97" r="7" fill="#8a6020" opacity="0.8"/>
    <circle cx="108" cy="97" r="4" fill="#d4a83a"/>
    <circle cx="108" cy="97" r="1.5" fill="#fff" opacity="0.9"/>
    <!-- Head — royal, imperious -->
    <ellipse cx="60" cy="24" rx="22" ry="20" fill="#140020" stroke="#9b30d0" stroke-width="2"/>
    <!-- Face structure -->
    <path d="M46 24 Q60 20 74 24" fill="#1a0030" opacity="0.5"/>
    <!-- Elaborate crown -->
    <path d="M38 12 L40 4 M46 8  L48 0 M54 6 L56 -2 M60 5 L60 -3 M66 6 L64 -2 M72 8 L74 0 M82 12 L80 4" stroke="#d4a83a" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Crown gems -->
    <circle cx="40" cy="4"  r="2.5" fill="#d4a83a"/>
    <circle cx="48" cy="0"  r="2"   fill="#9b30d0"/>
    <circle cx="60" cy="-3" r="3"   fill="#d4a83a"/>
    <circle cx="72" cy="0"  r="2"   fill="#9b30d0"/>
    <circle cx="80" cy="4"  r="2.5" fill="#d4a83a"/>
    <!-- Crown glow -->
    <ellipse cx="60" cy="4" rx="30" ry="8" fill="url(#lv-crown)"/>
    <!-- Eyes — golden divine -->
    <ellipse cx="49" cy="22" rx="6" ry="6.5" fill="#060008"/>
    <ellipse cx="71" cy="22" rx="6" ry="6.5" fill="#060008"/>
    <circle cx="49" cy="22" r="4.5" fill="#d4a83a" opacity="0.95"/>
    <circle cx="71" cy="22" r="4.5" fill="#d4a83a" opacity="0.95"/>
    <circle cx="49" cy="22" r="2.5" fill="#ffe080"/>
    <circle cx="71" cy="22" r="2.5" fill="#ffe080"/>
    <circle cx="48" cy="20" r="1" fill="#fff" opacity="0.8"/>
    <circle cx="70" cy="20" r="1" fill="#fff" opacity="0.8"/>
    <!-- Hair tendrils with void energy -->
    <path d="M40 12 Q28 4 22 8"  stroke="#3a0050" stroke-width="3" fill="none"/>
    <path d="M80 12 Q92 4 98 8"  stroke="#3a0050" stroke-width="3" fill="none"/>
    <path d="M38 18 Q26 14 20 20" stroke="#3a0050" stroke-width="2" fill="none"/>
    <path d="M82 18 Q94 14 100 20" stroke="#3a0050" stroke-width="2" fill="none"/>
    <!-- Floating void shards around her -->
    <polygon points="2,30 6,20 10,30" fill="#9b30d0" opacity="0.3"/>
    <polygon points="110,28 114,18 118,28" fill="#d4a83a" opacity="0.3"/>
    <polygon points="5,110 9,100 13,110" fill="#9b30d0" opacity="0.2"/>
    <polygon points="107,108 111,98 115,108" fill="#d4a83a" opacity="0.2"/>
  </svg>`;

  console.log('[Ashfall] Theatre boss art registered:', 
    ['ashen_maiden','plague_golem','ashling_queen','hollowed_titan','void_remnant','lady_veriax']
    .filter(id => GAME_DATA.monsterArt[id]).length, '/ 6');
})();

// ================================================================
// ASHFALL IDLE — Chambers of the Ashen King (Raid II)
// 5 challenge rooms. Supply management. The King awaits.
// Inspired by OSRS Chambers of Xeric — adapted for Ashfall.
// ================================================================

// ── CHAMBER BOSS DEFINITIONS ────────────────────────────────────
const COA_BOSSES = {
  shambling_mound: {
    id:'shambling_mound', name:'The Shambling Mound', hp:20000, maxHit:38,
    attackSpeed:2.8, combatLevel:200, style:'melee',
    evasion:{melee:50,ranged:60,magic:30}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], chamberOnly:true,
    mechanic:{ id:'poison_vines', name:'Poison Vines', interval:24, windowSecs:10,
      handleDesc:'Slash the vines before they constrict you',
      missedPenalty:'damage', healAmt:0, missedDmg:45 },
    phases:1,
    styleHints:'Protect from Melee — use slash weapons for bonus damage',
    desc:'A massive corrupted treant. Poisonous vines lash out periodically.',
  },
  ash_vanguard: {
    id:'ash_vanguard', name:'Vanguard Triad', hp:36000, maxHit:42,
    attackSpeed:2.2, combatLevel:250, style:'melee',
    evasion:{melee:70,ranged:65,magic:70}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], chamberOnly:true,
    mechanic:{ id:'style_rotate', name:'Triad Rotation', interval:16, windowSecs:7,
      handleDesc:'Switch protection prayer to match the active vanguard',
      missedPenalty:'damage', healAmt:0, missedDmg:52 },
    phases:1,
    styleHints:'Three attack styles rotate. Match your prayer or take massive damage.',
    desc:'Three warriors sharing one body. Melee, ranged, and magic cycle unpredictably.',
  },
  tekton_forgeborn: {
    id:'tekton_forgeborn', name:'Tekton the Forgeborn', hp:45000, maxHit:65,
    attackSpeed:3.2, combatLevel:280, style:'melee',
    evasion:{melee:95,ranged:85,magic:55}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], chamberOnly:true,
    mechanic:{ id:'anvil_heal', name:'Forge Repair', interval:28, windowSecs:8,
      handleDesc:'Interrupt his repair — attack during the forge window',
      missedPenalty:'heal', healAmt:2500, missedDmg:0 },
    phases:2,
    phaseBreak:0.50,
    phase2Style:'melee', phase2MaxHit:78,
    styleHints:'Phase 1: Hit hard and fast. Phase 2: Enraged, higher max hit, faster attacks.',
    desc:'A titanic golem forged in ash and steel. Returns to his anvil to repair.',
  },
  ice_weaver: {
    id:'ice_weaver', name:'The Ice Weaver', hp:30000, maxHit:48,
    attackSpeed:2.0, combatLevel:260, style:'magic',
    evasion:{melee:55,ranged:50,magic:90}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], chamberOnly:true,
    mechanic:{ id:'ice_prison', name:'Ice Prison', interval:20, windowSecs:6,
      handleDesc:'Break free before the prison shatters and deals massive damage',
      missedPenalty:'damage', healAmt:0, missedDmg:70 },
    phases:2,
    phaseBreak:0.45,
    phase2Style:'ranged', phase2MaxHit:55,
    styleHints:'Phase 1: Protect Magic. Phase 2: Switches to ranged icicle barrage.',
    desc:'An ancient cryomancer woven into ice itself. Freezes intruders solid.',
  },
  great_olm: {
    id:'great_olm', name:'The Great Olm', hp:80000, maxHit:72,
    attackSpeed:2.6, combatLevel:350, style:'magic',
    evasion:{melee:90,ranged:85,magic:100}, xp:0, gold:{min:0,max:0},
    alignment:'CE', drops:[], chamberOnly:true,
    mechanic:{ id:'crystal_bomb', name:'Crystal Bombs', interval:14, windowSecs:5,
      handleDesc:'Move away from the crystal bomb before detonation',
      missedPenalty:'damage', healAmt:0, missedDmg:80 },
    phases:3,
    phaseBreaks:[0.667, 0.333],
    phase2Style:'ranged', phase2MaxHit:60,
    phase3Style:'melee', phase3MaxHit:85,
    styleHints:'P1: Magic + fire walls. P2: Ranged + acid pools. P3: Melee + all mechanics.',
    desc:'The ancient guardian of the Chambers. Three phases of escalating horror.',
    isFinalBoss: true,
  },
};

// Register boss monsters
for (const [id, boss] of Object.entries(COA_BOSSES)) {
  if (!GAME_DATA.monsters[id]) GAME_DATA.monsters[id] = { ...boss };
}

// ── CHAMBERS DATA ───────────────────────────────────────────────
GAME_DATA.chambersOfAsh = {
  levelReq: 90,

  rooms: [
    { id:'mound',    name:'The Overgrowth',      bossId:'shambling_mound',  order:1 },
    { id:'vanguard', name:'Vanguard Arena',       bossId:'ash_vanguard',     order:2 },
    { id:'tekton',   name:'Tekton\'s Foundry',    bossId:'tekton_forgeborn', order:3 },
    { id:'weaver',   name:'The Frost Sanctum',    bossId:'ice_weaver',       order:4 },
    { id:'olm',      name:'Olm\'s Lair',          bossId:'great_olm',        order:5 },
  ],

  // Supply system — gather supplies between rooms
  supplies: {
    potionBrew: { name:'Raid Brew', heals:15, prayerRestore:10, brewTime:3 },
    enhancedBrew: { name:'Enhanced Brew', heals:22, prayerRestore:20, brewTime:5 },
    maxSupplies: 20,
  },

  // ── LOOT TABLES ──
  lootTables: {
    bronze: [
      {item:'death_rune',    qty:80,  chance:0.70, rarity:'common'},
      {item:'blood_rune',    qty:50,  chance:0.65, rarity:'common'},
      {item:'dragonite_bar', qty:4,   chance:0.45, rarity:'rare'},
      {item:'anglerfish',    qty:10,  chance:0.60, rarity:'common'},
      {item:'diamond',       qty:5,   chance:0.35, rarity:'uncommon'},
      {item:'celestial_fragment',qty:2,chance:0.20,rarity:'epic'},
    ],
    silver: [
      {item:'death_rune',    qty:150, chance:0.85, rarity:'common'},
      {item:'blood_rune',    qty:100, chance:0.80, rarity:'common'},
      {item:'dragonite_bar', qty:8,   chance:0.65, rarity:'rare'},
      {item:'celestial_fragment',qty:4,chance:0.45,rarity:'epic'},
      {item:'dexterous_scroll',qty:1, chance:0.06, rarity:'legendary'},
      {item:'arcane_scroll',  qty:1,  chance:0.06, rarity:'legendary'},
    ],
    gold: [
      {item:'death_rune',    qty:250, chance:0.95, rarity:'common'},
      {item:'blood_rune',    qty:180, chance:0.90, rarity:'common'},
      {item:'dragonite_bar', qty:12,  chance:0.80, rarity:'rare'},
      {item:'celestial_fragment',qty:8,chance:0.70,rarity:'epic'},
      {item:'dexterous_scroll',qty:1, chance:0.15, rarity:'legendary'},
      {item:'arcane_scroll',  qty:1,  chance:0.15, rarity:'legendary'},
      {item:'dragon_claws',   qty:1,  chance:0.10, rarity:'legendary'},
    ],
    purple: [
      {item:'death_rune',    qty:400, chance:1.0,  rarity:'common'},
      {item:'blood_rune',    qty:300, chance:1.0,  rarity:'common'},
      {item:'dragonite_bar', qty:16,  chance:1.0,  rarity:'rare'},
      {item:'celestial_fragment',qty:12,chance:1.0,rarity:'epic'},
      {item:'dexterous_scroll',qty:1, chance:0.35, rarity:'legendary'},
      {item:'arcane_scroll',  qty:1,  chance:0.35, rarity:'legendary'},
      {item:'dragon_claws',   qty:1,  chance:0.25, rarity:'legendary'},
      {item:'_unique_roll',   qty:1,  chance:1.0,  rarity:'unique'},
    ],
    unique: [
      {item:'twisted_bow',     chance:0.08},
      {item:'elder_maul',      chance:0.12},
      {item:'kodai_wand',      chance:0.12},
      {item:'ancestral_hat',   chance:0.14},
      {item:'ancestral_robe_top', chance:0.12},
      {item:'ancestral_robe_bottom', chance:0.12},
      {item:'dragon_claws',    chance:0.15},
      {item:'olmlet',          chance:0.03},
      {item:'dinhs_bulwark',   chance:0.12},
    ],
  },

  tiers: {
    purple: { maxDeaths:0, maxTimeMins:12 },
    gold:   { maxDeaths:0, maxTimeMins:25 },
    silver: { maxDeaths:1, maxTimeMins:45 },
    bronze: { maxDeaths:99, maxTimeMins:999 },
  },
};

// ── CHAMBERS ENGINE ─────────────────────────────────────────────
GameEngine.prototype.startChambersOfAsh = function() {
  if (this.getCombatLevel() < GAME_DATA.chambersOfAsh.levelReq) {
    this.emit('notification',{type:'warn',text:`Chambers requires combat level ${GAME_DATA.chambersOfAsh.levelReq}.`});
    return;
  }
  if (this.state.chambers?.active) {
    this.emit('notification',{type:'warn',text:'Already in the Chambers.'});
    return;
  }
  if (this.state.theatre?.active) {
    this.emit('notification',{type:'warn',text:'Cannot enter while in Theatre of Ash.'});
    return;
  }
  this.stopSkill();
  this.stopCombat();

  this.state.chambers = {
    active:true, room:0, phase:0,
    between:true, betweenTimer:5,
    mechanic:null, mechanicTimer:0,
    supplies:{ brews:5, enhancedBrews:0 },
    performance:{ deaths:0, damageReceived:0, startTime:Date.now(), elapsedSecs:0,
                  mechanicsHandled:0, mechanicsMissed:0, suppliesUsed:0 },
    roomsCleared:[], chestOpen:false, loot:[], tier:null, uniqueItem:null,
  };

  this.emit('notification',{type:'achievement',text:'Descending into the Chambers of the Ashen King...'});
  this.emit('chambersStart');
};

GameEngine.prototype.tickChambers = function(dt) {
  const ch = this.state.chambers;
  if (!ch?.active) return;
  const c = this.state.combat;

  ch.performance.elapsedSecs += dt;

  // Between rooms
  if (ch.between) {
    ch.betweenTimer -= dt;
    if (ch.betweenTimer <= 0) {
      ch.between = false;
      this._startChamberRoom(ch.room);
    }
    this.emit('chambersTick', ch);
    return;
  }

  // Chest phase
  if (ch.room >= GAME_DATA.chambersOfAsh.rooms.length) {
    this.emit('chambersTick', ch);
    return;
  }

  // Mechanic timer
  if (ch.mechanic && !ch.mechanic.handled) {
    ch.mechanicTimer -= dt;
    if (ch.mechanicTimer <= 0) {
      const m = ch.mechanic;
      ch.performance.mechanicsMissed++;
      if (m.missedPenalty === 'damage') {
        c.playerHp -= m.missedDmg;
        this.emit('combatHit',{who:'monster', dmg:m.missedDmg, mechanic:true});
        this.emit('notification',{type:'danger',text:`Missed: ${m.name}! ${m.missedDmg} damage!`});
      } else if (m.missedPenalty === 'heal') {
        c.monsterHp = Math.min(c.monsterHp + m.healAmt, this._getChamberBossMaxHp());
        this.emit('notification',{type:'warn',text:`Missed: ${m.name}! Boss healed ${m.healAmt} HP!`});
      }
      ch.mechanic = null;
      ch.mechanicTimer = 0;
    }
  }

  // Mechanic spawn
  const roomDef = GAME_DATA.chambersOfAsh.rooms[ch.room];
  const boss = COA_BOSSES[roomDef.bossId];
  if (!ch.mechanic) {
    ch._mechCooldown = (ch._mechCooldown || 0) + dt;
    if (ch._mechCooldown >= boss.mechanic.interval) {
      ch._mechCooldown = 0;
      ch.mechanic = {
        id: boss.mechanic.id, name: boss.mechanic.name,
        handleDesc: boss.mechanic.handleDesc,
        missedPenalty: boss.mechanic.missedPenalty,
        missedDmg: boss.mechanic.missedDmg,
        healAmt: boss.mechanic.healAmt,
        handled: false,
      };
      ch.mechanicTimer = boss.mechanic.windowSecs;
      this.emit('chambersMechanic', ch.mechanic);
    }
  }

  // Phase transitions
  const bossHpPct = c.monsterHp / this._getChamberBossMaxHp();
  if (boss.phases >= 2 && ch.phase === 0 && bossHpPct <= (boss.phaseBreak || boss.phaseBreaks?.[0])) {
    ch.phase = 1;
    const bm = GAME_DATA.monsters[roomDef.bossId];
    if (boss.phase2Style) bm.style = boss.phase2Style;
    if (boss.phase2MaxHit) bm.maxHit = boss.phase2MaxHit;
    this.emit('notification',{type:'warn',text:`${boss.name} — Phase 2!`});
    this.emit('chambersPhase', {phase:2, room:ch.room});
  }
  if (boss.phases >= 3 && ch.phase === 1 && bossHpPct <= boss.phaseBreaks[1]) {
    ch.phase = 2;
    const bm = GAME_DATA.monsters[roomDef.bossId];
    if (boss.phase3Style) bm.style = boss.phase3Style;
    if (boss.phase3MaxHit) bm.maxHit = boss.phase3MaxHit;
    this.emit('notification',{type:'danger',text:`${boss.name} — FINAL PHASE!`});
    this.emit('chambersPhase', {phase:3, room:ch.room});
    c.playerHp = Math.min(c.playerHp + Math.floor(this.getMaxHp()*0.08), this.getMaxHp());
  }

  // Combat tick
  this._tickStatusEffects(c.statusEffects.monster, dt, 'monster');
  this._tickStatusEffects(c.statusEffects.player, dt, 'player');

  const playerSpeed = this.getPlayerAttackSpeed();
  c.playerAttackTimer += dt;
  if (c.playerAttackTimer >= playerSpeed) {
    c.playerAttackTimer -= playerSpeed;
    try { this.playerAttack(GAME_DATA.monsters[roomDef.bossId]); } catch(e) {}
    this.drainPrayerPoints();
    this.doPetCombatAction(GAME_DATA.monsters[roomDef.bossId]);
  }

  const monsterSpeed = GAME_DATA.monsters[roomDef.bossId].attackSpeed * 0.7;
  c.monsterAttackTimer += dt;
  if (c.monsterAttackTimer >= monsterSpeed) {
    c.monsterAttackTimer -= monsterSpeed;
    this.monsterAttack(GAME_DATA.monsters[roomDef.bossId]);
    ch.performance.damageReceived += (this.getMaxHp() - c.playerHp);
  }

  // Auto-eat
  if (c.autoEat && c.playerHp < this.getMaxHp() * 0.4) this.eatFood();

  // Player death
  if (c.playerHp <= 0) {
    ch.performance.deaths++;
    c.playerHp = Math.floor(this.getMaxHp() * 0.25);
    this.emit('notification',{type:'danger',text:`You died in the Chambers! Death ${ch.performance.deaths}.`});
    this.emit('chambersDeath', {deaths:ch.performance.deaths, room:ch.room});
    ch.mechanic = null; ch.mechanicTimer = 0; ch._mechCooldown = 0;
    if (ch.performance.deaths >= 5) { this._endChambers(false); return; }
  }

  // Boss death
  if (c.monsterHp <= 0) {
    this._clearChamberRoom(ch.room);
  }

  this.emit('chambersTick', ch);
};

GameEngine.prototype._getChamberBossMaxHp = function() {
  const ch = this.state.chambers;
  const roomDef = GAME_DATA.chambersOfAsh.rooms[ch.room];
  return roomDef ? COA_BOSSES[roomDef.bossId].hp : 1;
};

GameEngine.prototype._startChamberRoom = function(roomIdx) {
  const ch = this.state.chambers;
  const roomDef = GAME_DATA.chambersOfAsh.rooms[roomIdx];
  if (!roomDef) { this._completeChambers(); return; }

  const boss = COA_BOSSES[roomDef.bossId];
  Object.assign(GAME_DATA.monsters[roomDef.bossId], boss);

  const c = this.state.combat;
  c.active = true;
  c.monster = roomDef.bossId;
  c.monsterHp = boss.hp;
  c.playerAttackTimer = 0;
  c.monsterAttackTimer = 0;
  c.statusEffects = { player:{}, monster:{} };
  c._multiMobMode = false;

  ch.phase = 0;
  ch.mechanic = null;
  ch.mechanicTimer = 0;
  ch._mechCooldown = 0;

  this.emit('notification',{type:'info',text:`Chamber ${roomIdx+1}: ${boss.name}`});
  this.emit('chambersRoom', { room:roomIdx, boss:boss.name });
  this.emit('combatStart', { chambers:true, room:roomIdx, bossId:roomDef.bossId });
};

GameEngine.prototype._clearChamberRoom = function(roomIdx) {
  const ch = this.state.chambers;
  const roomDef = GAME_DATA.chambersOfAsh.rooms[roomIdx];
  const boss = COA_BOSSES[roomDef.bossId];

  ch.roomsCleared.push(roomDef.id);
  this.addXp('hitpoints', Math.floor(boss.hp * 0.04));
  const style = this.state.combat.combatStyle;
  if (style==='melee')  { this.addXp('attack',400); this.addXp('strength',400); this.addXp('defence',400); }
  else if (style==='ranged') { this.addXp('ranged',800); this.addXp('defence',300); }
  else { this.addXp('magic',800); this.addXp('defence',300); }
  this.addXp('tactics', 600);

  // Grant supply brew between rooms
  if (ch.supplies.brews < GAME_DATA.chambersOfAsh.supplies.maxSupplies) {
    ch.supplies.brews = Math.min(ch.supplies.brews + 2, GAME_DATA.chambersOfAsh.supplies.maxSupplies);
    this.emit('notification',{type:'info',text:'+2 Raid Brews gathered from the room.'});
  }

  const nextRoom = roomIdx + 1;
  const isLast = nextRoom >= GAME_DATA.chambersOfAsh.rooms.length;

  this.emit('notification',{
    type:'success',
    text: isLast ? `The Great Olm falls! The Chambers are conquered!` : `Chamber ${roomIdx+1} cleared! Rest before the next room.`
  });

  if (isLast) {
    this._completeChambers();
  } else {
    ch.room = nextRoom;
    ch.between = true;
    ch.betweenTimer = 8;
    this.state.combat.active = false;
    this.emit('chambersBetweenRooms', { nextRoom, nextBoss: COA_BOSSES[GAME_DATA.chambersOfAsh.rooms[nextRoom].bossId].name });
  }
};

GameEngine.prototype._completeChambers = function() {
  const ch = this.state.chambers;
  ch.room = GAME_DATA.chambersOfAsh.rooms.length;
  ch.between = false;
  this.state.combat.active = false;

  const elapsedMins = ch.performance.elapsedSecs / 60;
  const deaths = ch.performance.deaths;
  const tiers = GAME_DATA.chambersOfAsh.tiers;
  let tier = 'bronze';
  if (deaths <= tiers.purple.maxDeaths && elapsedMins <= tiers.purple.maxTimeMins) tier = 'purple';
  else if (deaths <= tiers.gold.maxDeaths && elapsedMins <= tiers.gold.maxTimeMins) tier = 'gold';
  else if (deaths <= tiers.silver.maxDeaths && elapsedMins <= tiers.silver.maxTimeMins) tier = 'silver';
  ch.tier = tier;

  if (!this.state.stats.chambersCompletions) this.state.stats.chambersCompletions = 0;
  if (!this.state.stats.chambersBestTier) this.state.stats.chambersBestTier = 'bronze';
  this.state.stats.chambersCompletions++;
  const tierOrder = ['bronze','silver','gold','purple'];
  if (tierOrder.indexOf(tier) > tierOrder.indexOf(this.state.stats.chambersBestTier)) {
    this.state.stats.chambersBestTier = tier;
  }

  this.emit('chambersComplete', { tier, deaths, elapsedMins: Math.floor(elapsedMins) });
  this.emit('notification',{
    type:'achievement',
    text:`Chambers complete! ${tier.toUpperCase()} chest! ${deaths} deaths, ${Math.floor(elapsedMins)}m`
  });
};

GameEngine.prototype.openChambersChest = function() {
  const ch = this.state.chambers;
  if (!ch || ch.chestOpen || ch.room < GAME_DATA.chambersOfAsh.rooms.length) return;

  const table = GAME_DATA.chambersOfAsh.lootTables[ch.tier];
  const loot = [];

  for (const drop of table) {
    if (drop.item === '_unique_roll') {
      const unique = this._rollChambersUnique();
      if (unique) {
        this.addItem(unique.item, 1);
        loot.push({ item:unique.item, qty:1, rarity:'unique' });
        ch.uniqueItem = unique.item;
        this.emit('notification',{type:'achievement',text:`UNIQUE DROP: ${GAME_DATA.items[unique.item]?.name}!`});
      }
      continue;
    }
    if (Math.random() < drop.chance) {
      this.addItem(drop.item, drop.qty);
      loot.push({ item:drop.item, qty:drop.qty, rarity:drop.rarity });
    }
  }

  ch.loot = loot;
  ch.chestOpen = true;
  this.emit('chambersChestOpen', { tier:ch.tier, loot, unique:ch.uniqueItem });
};

GameEngine.prototype._rollChambersUnique = function() {
  const pool = GAME_DATA.chambersOfAsh.lootTables.unique;
  const roll = Math.random();
  let cumulative = 0;
  for (const item of pool) {
    cumulative += item.chance;
    if (roll <= cumulative) return item;
  }
  return pool[Math.floor(Math.random() * pool.length)];
};

GameEngine.prototype.handleChambersMechanic = function() {
  const ch = this.state.chambers;
  if (!ch?.mechanic || ch.mechanic.handled) return;
  ch.mechanic.handled = true;
  ch.mechanicTimer = 0;
  ch.performance.mechanicsHandled++;
  this.emit('notification',{type:'success',text:`Mechanic handled!`});
  this.addXp('tactics', 60);
};

GameEngine.prototype.useChamberBrew = function(type) {
  const ch = this.state.chambers;
  if (!ch?.active) return;
  const c = this.state.combat;
  if (type === 'enhanced' && ch.supplies.enhancedBrews > 0) {
    ch.supplies.enhancedBrews--;
    c.playerHp = Math.min(c.playerHp + 22, this.getMaxHp());
    this.state.prayerPoints = Math.min((this.state.prayerPoints||0) + 20, this.state.maxPrayerPoints||99);
    ch.performance.suppliesUsed++;
    this.emit('notification',{type:'success',text:'Enhanced Brew: +22 HP, +20 Prayer'});
  } else if (ch.supplies.brews > 0) {
    ch.supplies.brews--;
    c.playerHp = Math.min(c.playerHp + 15, this.getMaxHp());
    this.state.prayerPoints = Math.min((this.state.prayerPoints||0) + 10, this.state.maxPrayerPoints||99);
    ch.performance.suppliesUsed++;
    this.emit('notification',{type:'info',text:'Raid Brew: +15 HP, +10 Prayer'});
  } else {
    this.emit('notification',{type:'warn',text:'No brews left!'});
  }
};

GameEngine.prototype.leaveChambers = function() {
  this._endChambers(false);
};

GameEngine.prototype._endChambers = function(completed) {
  if (!this.state.chambers) return;
  if (!completed) this.emit('notification',{type:'warn',text:'You flee the Chambers of the Ashen King.'});
  this.state.chambers = { active:false };
  this.state.combat.active = false;
  this.emit('chambersEnd');
};

// ── HOOK INTO MAIN TICK ─────────────────────────────────────────
const _origEmitCOA = GameEngine.prototype.emit;
GameEngine.prototype.emit = function(event, data) {
  _origEmitCOA.call(this, event, data);
  if (event === 'tick' && this.state.chambers?.active && !this.state.chambers.chestOpen) {
    const dt = Math.min((Date.now() - (this._lastChambersTick||Date.now())) / 1000, 1.0);
    this._lastChambersTick = Date.now();
    if (dt > 0.05) this.tickChambers(dt);
  }
};

if(window._ASHFALL_DEBUG) console.log('[Ashfall] Chambers of the Ashen King loaded. Bosses:', Object.keys(COA_BOSSES).length);

// ── CHAMBERS UNIQUE ITEMS ───────────────────────────────────────
function _itCOA(id, def) {
  if (!GAME_DATA.items[id]) GAME_DATA.items[id] = { id, ...def };
}

// Weapons
_itCOA('twisted_bow', {
  name:'Twisted Bow', type:'weapon', slot:'weapon', style:'ranged',
  attackSpeed:2.4, stats:{rangedBonus:145, attackBonus:20}, levelReq:{ranged:85},
  rarity:'mythic', sellPrice:0,
  passiveEffect:{ type:'magic_scaling', desc:'Damage scales with target\'s magic level. Stronger vs high-magic monsters.' },
  specCost:60, specEffect:{type:'twisted_shot', mult:2.0, magicScale:true},
  desc:'An ancient bow twisted by void energy. Passive: damage scales with target\'s magic. Spec: 200% with magic scaling. Unsellable.',
});
_itCOA('elder_maul', {
  name:'Elder Maul', type:'weapon', slot:'weapon', style:'melee',
  attackSpeed:3.6, stats:{attackBonus:95, strengthBonus:180}, levelReq:{attack:80, strength:80},
  rarity:'mythic', sellPrice:0,
  specCost:50, specEffect:{type:'crushing_blow', mult:1.80, defReduction:30},
  desc:'A massive maul of elder stone. Highest strength bonus in the game. Spec: 180% + reduce defence. Unsellable.',
});
_itCOA('kodai_wand', {
  name:'Kodai Wand', type:'weapon', slot:'weapon', style:'magic',
  attackSpeed:2.2, stats:{magicBonus:130, attackBonus:28}, levelReq:{magic:80},
  rarity:'mythic', sellPrice:0, providesAllRunes:true,
  passiveEffect:{ type:'autocast_save', desc:'15% chance to not consume runes (stacks with staff).' },
  specCost:50, specEffect:{type:'kodai_barrage', mult:1.60, freezePct:100},
  desc:'An ancient wand of Kodai. Unlimited water runes. Spec: 160% + guaranteed freeze. Unsellable.',
});
_itCOA('dragon_claws', {
  name:'Dragon Claws', type:'weapon', slot:'weapon', style:'melee',
  attackSpeed:1.8, stats:{attackBonus:115, strengthBonus:110}, levelReq:{attack:75},
  rarity:'legendary', sellPrice:0,
  specCost:50, specEffect:{type:'claw_rush', mult:0.60, hits:4, guaranteed:true},
  desc:'Razor-sharp dragon claws. Spec: 4 guaranteed hits (60/30/15/15%). 50% spec. Unsellable.',
});
_itCOA('dinhs_bulwark', {
  name:"Dinh's Bulwark", type:'armor', slot:'shield', rarity:'mythic', sellPrice:0,
  stats:{defenceBonus:130, strengthBonus:5, damageReduction:8},
  levelReq:{defence:80},
  passiveEffect:{ type:'bulwark_tank', desc:'Reduce all incoming damage by 15% while equipped.' },
  desc:"A massive shield forged by Dinh. Best defensive shield. DR8 + 15% damage reduction passive. Unsellable.",
});

// Ancestral Mage Robes
_itCOA('ancestral_hat', {
  name:'Ancestral Hat', type:'armor', slot:'head', rarity:'mythic', sellPrice:0,
  stats:{magicBonus:35, defenceBonus:18, damageReduction:1},
  levelReq:{magic:82, defence:65},
  desc:'Hat of the Ancestral mage set. Best-in-slot magic head. Unsellable.',
});
_itCOA('ancestral_robe_top', {
  name:'Ancestral Robe Top', type:'armor', slot:'body', rarity:'mythic', sellPrice:0,
  stats:{magicBonus:65, defenceBonus:40, damageReduction:2},
  levelReq:{magic:82, defence:65},
  desc:'Top of the Ancestral mage set. Best-in-slot magic body. Unsellable.',
});
_itCOA('ancestral_robe_bottom', {
  name:'Ancestral Robe Bottom', type:'armor', slot:'legs', rarity:'mythic', sellPrice:0,
  stats:{magicBonus:50, defenceBonus:30, damageReduction:2},
  levelReq:{magic:82, defence:65},
  desc:'Bottom of the Ancestral mage set. Best-in-slot magic legs. Unsellable.',
});

// Prayer Scrolls
_itCOA('dexterous_scroll', {
  name:'Dexterous Prayer Scroll', type:'resource', rarity:'legendary', sellPrice:0,
  desc:'Teaches the Rigour prayer. +20% Ranged Accuracy, +23% Ranged Strength, +25% Defence.',
});
_itCOA('arcane_scroll', {
  name:'Arcane Prayer Scroll', type:'resource', rarity:'legendary', sellPrice:0,
  desc:'Teaches the Augury prayer. +25% Magic Accuracy, +25% Magic Defence, +25% Defence.',
});

// Pet
_itCOA('olmlet', {
  name:'Olmlet', type:'pet_token', rarity:'mythic', sellPrice:0,
  desc:'A tiny Great Olm. Follows you everywhere. Rarest Chambers drop.',
});

if (!GAME_DATA.combatPets) GAME_DATA.combatPets = [];
if (!GAME_DATA.combatPets.find(p => p.id === 'olmlet')) {
  GAME_DATA.combatPets.push({
    id:'olmlet', name:'Olmlet', itemId:'olmlet',
    source:'chambers_of_ash', dropRate:'Chambers exclusive (purple chest)',
    passiveBonus:'All combat accuracy +10%',
    action:{ every:4, type:'olm_beam', damage:0.30, desc:'Fires an Olm beam for 30% of your max hit' },
    stats:{ accuracyMult:1.10 },
  });
}

if(window._ASHFALL_DEBUG) console.log('[Ashfall] Chambers items registered:',
  ['twisted_bow','elder_maul','kodai_wand','dragon_claws','dinhs_bulwark',
   'ancestral_hat','ancestral_robe_top','ancestral_robe_bottom',
   'dexterous_scroll','arcane_scroll','olmlet'].filter(id=>GAME_DATA.items[id]).length);

// ── BOSS SVG ART ────────────────────────────────────────────────
(function registerCoaBossArt() {
  if (!GAME_DATA.monsterArt) GAME_DATA.monsterArt = {};

  // Shambling Mound — corrupted treant with vines and fungal growths
  GAME_DATA.monsterArt.shambling_mound = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="sm-aura" cx="50%" cy="80%" r="50%">
        <stop offset="0%" stop-color="#1a4a0a" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#1a4a0a" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="140" rx="50" ry="12" fill="url(#sm-aura)"/>
    <!-- Root legs -->
    <path d="M30 120 Q20 130 15 145 Q12 150 18 150" stroke="#2a1a08" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M45 118 Q38 132 32 148" stroke="#2a1a08" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M75 118 Q82 132 88 148" stroke="#2a1a08" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M90 120 Q100 130 105 145 Q108 150 102 150" stroke="#2a1a08" stroke-width="8" fill="none" stroke-linecap="round"/>
    <!-- Main trunk body -->
    <path d="M28 45 Q20 80 25 120 L95 120 Q100 80 92 45Z" fill="#1e1608" stroke="#3a2a10" stroke-width="2"/>
    <!-- Bark texture lines -->
    <path d="M35 55 Q40 70 38 85 Q36 100 40 115" stroke="#3a2a10" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M60 48 Q58 72 62 95 Q64 110 60 120" stroke="#3a2a10" stroke-width="1" fill="none" opacity="0.4"/>
    <path d="M82 55 Q78 70 80 85 Q82 100 78 115" stroke="#3a2a10" stroke-width="1.5" fill="none" opacity="0.5"/>
    <!-- Fungal growths -->
    <ellipse cx="35" cy="70" rx="10" ry="5" fill="#4a7a20" opacity="0.8"/>
    <ellipse cx="38" cy="68" rx="6" ry="3" fill="#6aaa30" opacity="0.6"/>
    <ellipse cx="78" cy="85" rx="12" ry="6" fill="#3a6a15" opacity="0.8"/>
    <ellipse cx="82" cy="83" rx="7" ry="3.5" fill="#5a9a28" opacity="0.6"/>
    <circle cx="50" cy="100" r="6" fill="#2a5a08" stroke="#4a8a20" stroke-width="1"/>
    <circle cx="50" cy="100" r="3" fill="#6aaa30" opacity="0.7"/>
    <!-- Branch arms -->
    <path d="M28 55 Q10 45 5 30 Q2 22 8 18" stroke="#2a1a08" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M8 18 L2 10 M8 18 L14 12 M8 18 L6 8" stroke="#3a2a10" stroke-width="3" fill="none"/>
    <path d="M92 55 Q110 45 115 30 Q118 22 112 18" stroke="#2a1a08" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M112 18 L118 10 M112 18 L106 12 M112 18 L114 8" stroke="#3a2a10" stroke-width="3" fill="none"/>
    <!-- Vine tendrils (poison) -->
    <path d="M5 30 Q-5 42 2 55 Q8 65 0 75" stroke="#2a8a10" stroke-width="2" fill="none" opacity="0.7"/>
    <path d="M115 30 Q125 42 118 55 Q112 65 120 75" stroke="#2a8a10" stroke-width="2" fill="none" opacity="0.7"/>
    <path d="M30 115 Q15 120 10 130" stroke="#2a8a10" stroke-width="2" fill="none" opacity="0.6"/>
    <path d="M90 115 Q105 120 110 130" stroke="#2a8a10" stroke-width="2" fill="none" opacity="0.6"/>
    <!-- Head — gnarled crown -->
    <path d="M32 48 Q30 25 35 15 Q50 5 60 8 Q70 5 85 15 Q90 25 88 48" fill="#1e1608" stroke="#3a2a10" stroke-width="2"/>
    <!-- Glowing eyes in knotholes -->
    <circle cx="44" cy="30" r="7" fill="#080a02"/>
    <circle cx="44" cy="30" r="5" fill="#4aaa10" opacity="0.9"/>
    <circle cx="44" cy="30" r="2.5" fill="#80dd30"/>
    <circle cx="44" cy="29" r="1" fill="#fff" opacity="0.7"/>
    <circle cx="72" cy="30" r="7" fill="#080a02"/>
    <circle cx="72" cy="30" r="5" fill="#4aaa10" opacity="0.9"/>
    <circle cx="72" cy="30" r="2.5" fill="#80dd30"/>
    <circle cx="72" cy="29" r="1" fill="#fff" opacity="0.7"/>
    <!-- Mouth — jagged bark -->
    <path d="M42 42 L48 38 L54 42 L58 37 L62 42 L68 38 L74 42" stroke="#2a1a08" stroke-width="2" fill="none"/>
    <!-- Spore particles -->
    <circle cx="18" cy="55" r="2" fill="#6aaa30" opacity="0.4"/>
    <circle cx="102" cy="50" r="2.5" fill="#5a9a28" opacity="0.3"/>
    <circle cx="25" cy="95" r="1.5" fill="#4a8a20" opacity="0.4"/>
    <circle cx="95" cy="100" r="2" fill="#6aaa30" opacity="0.3"/>
  </svg>`;

  // Ash Vanguard — three-faced warrior in heavy ash armor
  GAME_DATA.monsterArt.ash_vanguard = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="av-aura" cx="50%" cy="60%" r="55%">
        <stop offset="0%" stop-color="#c9873e" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#c9873e" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="138" rx="48" ry="12" fill="url(#av-aura)"/>
    <!-- Heavy boots -->
    <rect x="22" y="122" width="24" height="22" rx="5" fill="#1a1410" stroke="#4a3820" stroke-width="1.5"/>
    <rect x="74" y="122" width="24" height="22" rx="5" fill="#1a1410" stroke="#4a3820" stroke-width="1.5"/>
    <!-- Leg plates -->
    <rect x="24" y="95" width="20" height="30" rx="4" fill="#1e180e" stroke="#5a4a28" stroke-width="1.5"/>
    <rect x="76" y="95" width="20" height="30" rx="4" fill="#1e180e" stroke="#5a4a28" stroke-width="1.5"/>
    <!-- Body — three-section torso -->
    <path d="M18 50 Q60 42 102 50 L108 100 Q60 108 12 100Z" fill="#1a1410" stroke="#c9873e" stroke-width="2"/>
    <!-- Three chest emblems — melee, ranged, magic -->
    <circle cx="36" cy="72" r="10" fill="#100a04" stroke="#c44040" stroke-width="1.5"/>
    <path d="M30 72 L36 64 L42 72 L36 80Z" fill="#c44040" opacity="0.7"/>
    <circle cx="60" cy="68" r="10" fill="#100a04" stroke="#4a88cc" stroke-width="1.5"/>
    <circle cx="60" cy="68" r="5" fill="#4a88cc" opacity="0.6"/>
    <circle cx="60" cy="68" r="2" fill="#88bbee"/>
    <circle cx="84" cy="72" r="10" fill="#100a04" stroke="#9b30d0" stroke-width="1.5"/>
    <path d="M78 72 L84 64 L90 72 L84 80Z" fill="#9b30d0" opacity="0.7" transform="rotate(45 84 72)"/>
    <!-- Shoulder pauldrons -->
    <ellipse cx="14" cy="55" rx="12" ry="10" fill="#1e180e" stroke="#c9873e" stroke-width="2"/>
    <ellipse cx="106" cy="55" rx="12" ry="10" fill="#1e180e" stroke="#c9873e" stroke-width="2"/>
    <!-- Pauldron spikes -->
    <path d="M6 48 L4 38 M14 44 L14 34" stroke="#c9873e" stroke-width="2" stroke-linecap="round"/>
    <path d="M114 48 L116 38 M106 44 L106 34" stroke="#c9873e" stroke-width="2" stroke-linecap="round"/>
    <!-- Arms holding weapons -->
    <rect x="2" y="56" width="16" height="48" rx="7" fill="#1a1410" stroke="#4a3820" stroke-width="1"/>
    <rect x="102" y="56" width="16" height="48" rx="7" fill="#1a1410" stroke="#4a3820" stroke-width="1"/>
    <!-- Sword in right hand -->
    <path d="M8 104 L6 130 M4 130 L8 130" stroke="#8a8a9a" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Bow in left hand -->
    <path d="M110 104 Q118 115 110 130" stroke="#5a3a1a" stroke-width="2" fill="none"/>
    <path d="M110 106 L110 128" stroke="#8a8a8a" stroke-width="0.8"/>
    <!-- Three-faced helm -->
    <rect x="26" y="12" width="68" height="38" rx="10" fill="#1a1410" stroke="#c9873e" stroke-width="2.5"/>
    <!-- Center face — main (red melee) -->
    <rect x="44" y="20" width="12" height="8" rx="2" fill="#060402"/>
    <rect x="64" y="20" width="12" height="8" rx="2" fill="#060402"/>
    <rect x="46" y="22" width="8" height="4" fill="#c9873e" opacity="0.9"/>
    <rect x="66" y="22" width="8" height="4" fill="#c9873e" opacity="0.9"/>
    <!-- Side faces (faint, ghostly) -->
    <circle cx="30" cy="28" r="4" fill="#060402" opacity="0.6"/>
    <circle cx="30" cy="28" r="2" fill="#c44040" opacity="0.5"/>
    <circle cx="90" cy="28" r="4" fill="#060402" opacity="0.6"/>
    <circle cx="90" cy="28" r="2" fill="#9b30d0" opacity="0.5"/>
    <!-- Helm crest -->
    <path d="M40 12 L38 4 M50 10 L48 2 M60 8 L60 0 M70 10 L72 2 M80 12 L82 4" stroke="#c9873e" stroke-width="2" stroke-linecap="round"/>
    <!-- Cape flowing behind -->
    <path d="M30 50 Q60 46 90 50 L95 140 Q60 148 25 140Z" fill="#1a0808" stroke="#5a2020" stroke-width="1" opacity="0.4"/>
  </svg>`;

  // Tekton the Forgeborn — massive golem with forge hammer
  GAME_DATA.monsterArt.tekton_forgeborn = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="tk-glow" cx="50%" cy="70%" r="50%">
        <stop offset="0%" stop-color="#c44020" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#c44020" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="142" rx="52" ry="12" fill="url(#tk-glow)"/>
    <!-- Massive legs -->
    <rect x="16" y="108" width="32" height="38" rx="6" fill="#1a1208" stroke="#5a3a18" stroke-width="2"/>
    <rect x="72" y="108" width="32" height="38" rx="6" fill="#1a1208" stroke="#5a3a18" stroke-width="2"/>
    <!-- Leg cracks with glow -->
    <path d="M28 112 L32 125 L26 135" stroke="#c44020" stroke-width="1.5" fill="none" opacity="0.6"/>
    <path d="M88 115 L84 128 L90 138" stroke="#c44020" stroke-width="1.5" fill="none" opacity="0.6"/>
    <!-- Body — enormous rock/metal -->
    <rect x="6" y="38" width="108" height="74" rx="14" fill="#1a1208" stroke="#5a3a18" stroke-width="3"/>
    <!-- Magma veins across body -->
    <path d="M20 50 Q30 65 25 80 Q20 92 28 105" stroke="#c44020" stroke-width="2" fill="none" opacity="0.5"/>
    <path d="M55 42 Q52 58 58 75 Q62 88 56 108" stroke="#c44020" stroke-width="1.5" fill="none" opacity="0.4"/>
    <path d="M95 48 Q88 62 92 78 Q96 90 90 104" stroke="#c44020" stroke-width="2" fill="none" opacity="0.5"/>
    <!-- Forge core in chest -->
    <circle cx="60" cy="72" r="16" fill="#0a0604" stroke="#c44020" stroke-width="2.5"/>
    <circle cx="60" cy="72" r="11" fill="#c44020" opacity="0.7"/>
    <circle cx="60" cy="72" r="7" fill="#e8802a"/>
    <circle cx="60" cy="72" r="3.5" fill="#ffcc60"/>
    <!-- Arms — tree-trunk thick -->
    <rect x="-6" y="42" width="22" height="60" rx="10" fill="#1a1208" stroke="#5a3a18" stroke-width="2"/>
    <rect x="104" y="42" width="22" height="60" rx="10" fill="#1a1208" stroke="#5a3a18" stroke-width="2"/>
    <!-- FORGE HAMMER in right hand -->
    <path d="M-2 102 L-8 135" stroke="#4a4a5a" stroke-width="4" stroke-linecap="round"/>
    <rect x="-18" y="128" width="24" height="14" rx="3" fill="#3a3a4a" stroke="#6a6a8a" stroke-width="1.5"/>
    <path d="M-14 132 L-14 138 M-6 132 L-6 138 M2 132 L2 138" stroke="#8a4a20" stroke-width="1" opacity="0.6"/>
    <!-- Gauntlet spikes -->
    <path d="M118 100 L124 108 M112 102 L116 112 M108 100 L108 110" stroke="#5a3a18" stroke-width="2" stroke-linecap="round"/>
    <!-- Head — angular, glowing visor -->
    <rect x="22" y="10" width="76" height="34" rx="10" fill="#1a1208" stroke="#5a3a18" stroke-width="2.5"/>
    <!-- Visor -->
    <rect x="30" y="18" width="24" height="10" rx="3" fill="#0a0402"/>
    <rect x="66" y="18" width="24" height="10" rx="3" fill="#0a0402"/>
    <rect x="32" y="20" width="20" height="6" fill="#c44020" opacity="0.9"/>
    <rect x="68" y="20" width="20" height="6" fill="#c44020" opacity="0.9"/>
    <!-- Brow ridge -->
    <path d="M28 16 Q40 10 52 16 M68 16 Q80 10 92 16" stroke="#5a3a18" stroke-width="2" fill="none"/>
    <!-- Heat shimmer particles -->
    <circle cx="20" cy="30" r="2" fill="#c44020" opacity="0.3"/>
    <circle cx="100" cy="25" r="2.5" fill="#e8802a" opacity="0.3"/>
    <circle cx="40" cy="6" r="1.5" fill="#ffcc60" opacity="0.3"/>
    <circle cx="80" cy="4" r="2" fill="#c44020" opacity="0.3"/>
  </svg>`;

  // Ice Weaver — ethereal ice mage wrapped in frozen cloth
  GAME_DATA.monsterArt.ice_weaver = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="iw-aura" cx="50%" cy="60%" r="60%">
        <stop offset="0%" stop-color="#4a8acc" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#4a8acc" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="60" cy="140" rx="45" ry="10" fill="url(#iw-aura)"/>
    <!-- Flowing frozen robes -->
    <path d="M30 55 Q60 48 90 55 L100 142 Q60 155 20 142Z" fill="#0a1420" stroke="#4a8acc" stroke-width="1.5"/>
    <!-- Frost patterns on robe -->
    <path d="M35 70 Q40 68 45 72 Q50 76 55 72" stroke="#6aaaee" stroke-width="0.8" fill="none" opacity="0.5"/>
    <path d="M65 75 Q70 72 75 76 Q80 80 85 76" stroke="#6aaaee" stroke-width="0.8" fill="none" opacity="0.5"/>
    <path d="M40 95 Q50 92 55 97" stroke="#4a8acc" stroke-width="0.6" fill="none" opacity="0.4"/>
    <path d="M70 100 Q75 96 82 100" stroke="#4a8acc" stroke-width="0.6" fill="none" opacity="0.4"/>
    <!-- Ice crystals on robe hem -->
    <polygon points="28,138 32,128 36,138" fill="#6aaaee" opacity="0.6"/>
    <polygon points="50,142 54,130 58,142" fill="#88ccff" opacity="0.5"/>
    <polygon points="72,140 76,128 80,140" fill="#6aaaee" opacity="0.6"/>
    <polygon points="90,136 94,126 98,136" fill="#88ccff" opacity="0.5"/>
    <!-- Upper body -->
    <path d="M34 38 Q60 32 86 38 L90 58 Q60 62 30 58Z" fill="#0a1420" stroke="#6aaaee" stroke-width="1.5"/>
    <!-- Frost gem on chest -->
    <circle cx="60" cy="48" r="8" fill="#041028" stroke="#88ccff" stroke-width="2"/>
    <polygon points="60,42 64,48 60,54 56,48" fill="#88ccff" opacity="0.9"/>
    <circle cx="60" cy="48" r="2.5" fill="#ccf0ff"/>
    <!-- Arms — wraith-like, trailing frost -->
    <path d="M30 42 Q14 52 8 65 Q4 74 10 80" stroke="#0a1420" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M90 42 Q106 52 112 65 Q116 74 110 80" stroke="#0a1420" stroke-width="8" fill="none" stroke-linecap="round"/>
    <!-- Frost trails from hands -->
    <path d="M10 78 Q4 85 8 92 Q12 98 6 105" stroke="#6aaaee" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M110 78 Q116 85 112 92 Q108 98 114 105" stroke="#6aaaee" stroke-width="1.5" fill="none" opacity="0.5"/>
    <!-- Ice orbs in hands -->
    <circle cx="10" cy="82" r="8" fill="#041028" stroke="#88ccff" stroke-width="2"/>
    <circle cx="10" cy="82" r="5" fill="#4a8acc" opacity="0.8"/>
    <circle cx="10" cy="82" r="2.5" fill="#ccf0ff"/>
    <circle cx="110" cy="82" r="8" fill="#041028" stroke="#88ccff" stroke-width="2"/>
    <circle cx="110" cy="82" r="5" fill="#4a8acc" opacity="0.8"/>
    <circle cx="110" cy="82" r="2.5" fill="#ccf0ff"/>
    <!-- Head — hooded, frozen -->
    <path d="M32 40 Q30 20 40 10 Q50 4 60 6 Q70 4 80 10 Q90 20 88 40" fill="#0a1420" stroke="#4a8acc" stroke-width="2"/>
    <!-- Face — icy glow from within hood -->
    <ellipse cx="48" cy="24" rx="6" ry="7" fill="#041028"/>
    <circle cx="48" cy="24" r="4.5" fill="#4a8acc" opacity="0.9"/>
    <circle cx="48" cy="24" r="2.5" fill="#ccf0ff"/>
    <circle cx="48" cy="23" r="1" fill="#fff" opacity="0.8"/>
    <ellipse cx="72" cy="24" rx="6" ry="7" fill="#041028"/>
    <circle cx="72" cy="24" r="4.5" fill="#4a8acc" opacity="0.9"/>
    <circle cx="72" cy="24" r="2.5" fill="#ccf0ff"/>
    <circle cx="72" cy="23" r="1" fill="#fff" opacity="0.8"/>
    <!-- Snowflake particles -->
    <circle cx="5" cy="40" r="2" fill="#88ccff" opacity="0.4"/>
    <circle cx="115" cy="45" r="2.5" fill="#6aaaee" opacity="0.3"/>
    <circle cx="20" cy="105" r="2" fill="#88ccff" opacity="0.3"/>
    <circle cx="100" cy="110" r="1.5" fill="#ccf0ff" opacity="0.4"/>
    <circle cx="55" cy="5" r="2" fill="#88ccff" opacity="0.3"/>
  </svg>`;

  // Great Olm — massive serpentine dragon in crystal cave
  GAME_DATA.monsterArt.great_olm = `<svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="olm-aura" cx="50%" cy="50%" r="65%">
        <stop offset="0%" stop-color="#c9873e" stop-opacity="0.2"/>
        <stop offset="60%" stop-color="#4aaa50" stop-opacity="0.08"/>
        <stop offset="100%" stop-color="#c9873e" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- Grand aura -->
    <ellipse cx="60" cy="80" rx="58" ry="70" fill="url(#olm-aura)"/>
    <!-- Body coils -->
    <path d="M20 130 Q10 110 18 95 Q28 80 22 65 Q16 50 30 42" stroke="#2a3a18" stroke-width="18" fill="none" stroke-linecap="round" opacity="0.8"/>
    <path d="M100 130 Q110 110 102 95 Q92 80 98 65 Q104 50 90 42" stroke="#2a3a18" stroke-width="18" fill="none" stroke-linecap="round" opacity="0.8"/>
    <!-- Scale texture on coils -->
    <path d="M14 100 Q18 98 22 100 Q26 102 30 100" stroke="#4a5a28" stroke-width="1" fill="none" opacity="0.4"/>
    <path d="M94 100 Q98 98 102 100 Q106 102 110 100" stroke="#4a5a28" stroke-width="1" fill="none" opacity="0.4"/>
    <!-- Main head — large, draconic -->
    <ellipse cx="60" cy="28" rx="32" ry="28" fill="#1e2a10" stroke="#4a5a28" stroke-width="2.5"/>
    <!-- Scale plates on head -->
    <path d="M32 18 Q38 14 44 18" stroke="#5a7a30" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M48 10 Q54 6 60 10" stroke="#5a7a30" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M76 18 Q82 14 88 18" stroke="#5a7a30" stroke-width="1.5" fill="none" opacity="0.5"/>
    <!-- Massive eyes — crystal glow -->
    <ellipse cx="42" cy="22" rx="10" ry="11" fill="#060a04"/>
    <circle cx="42" cy="22" r="7.5" fill="#c9873e" opacity="0.95"/>
    <circle cx="42" cy="22" r="4.5" fill="#e8c060"/>
    <circle cx="41" cy="20" r="2" fill="#fff" opacity="0.8"/>
    <ellipse cx="78" cy="22" rx="10" ry="11" fill="#060a04"/>
    <circle cx="78" cy="22" r="7.5" fill="#c9873e" opacity="0.95"/>
    <circle cx="78" cy="22" r="4.5" fill="#e8c060"/>
    <circle cx="77" cy="20" r="2" fill="#fff" opacity="0.8"/>
    <!-- Third eye (center, smaller) -->
    <circle cx="60" cy="12" r="6" fill="#060a04" stroke="#c9873e" stroke-width="1"/>
    <circle cx="60" cy="12" r="4" fill="#c9873e" opacity="0.8"/>
    <circle cx="60" cy="12" r="2" fill="#ffe080"/>
    <!-- Mouth — massive jaw -->
    <path d="M34 42 Q60 50 86 42" stroke="#1e2a10" stroke-width="2.5" fill="none"/>
    <!-- Teeth -->
    <path d="M38 42 L42 50 L46 42 L50 50 L54 42 L58 50 L62 42 L66 50 L70 42 L74 50 L78 42 L82 50" stroke="#e8e0d0" stroke-width="1.5" fill="none"/>
    <!-- Crystal horns -->
    <path d="M30 10 Q24 -2 20 -8" stroke="#c9873e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M90 10 Q96 -2 100 -8" stroke="#c9873e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="20" cy="-8" r="4" fill="#c9873e" opacity="0.7"/>
    <circle cx="100" cy="-8" r="4" fill="#c9873e" opacity="0.7"/>
    <!-- Left hand (claw) -->
    <path d="M4 65 Q-4 72 2 80 Q8 88 0 95" stroke="#2a3a18" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M-2 90 L-8 100 M2 94 L0 104 M6 92 L8 102" stroke="#4a5a28" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Right hand (claw) -->
    <path d="M116 65 Q124 72 118 80 Q112 88 120 95" stroke="#2a3a18" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M122 90 L128 100 M118 94 L120 104 M114 92 L112 102" stroke="#4a5a28" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Crystal formations around lair -->
    <polygon points="8,140 12,125 16,140" fill="#c9873e" opacity="0.5"/>
    <polygon points="100,138 105,120 110,138" fill="#c9873e" opacity="0.5"/>
    <polygon points="52,145 56,132 60,145" fill="#e8c060" opacity="0.3"/>
    <!-- Drool / acid drips -->
    <path d="M48 50 Q50 58 48 64" stroke="#4aaa50" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M70 50 Q72 58 70 64" stroke="#4aaa50" stroke-width="1.5" fill="none" opacity="0.5"/>
  </svg>`;

  // console.log('[Ashfall] Chambers boss art registered:',
  //   ['shambling_mound','ash_vanguard','tekton_forgeborn','ice_weaver','great_olm']
  //   .filter(id => GAME_DATA.monsterArt[id]).length, '/ 5');
})();

// ================================================================
// ASHFALL IDLE — Content Expansion v9.5
// Ashen Crypts, The Gauntlet, The Inferno, Slayer Bosses
// ================================================================

function _itCE(id, def) { if (!GAME_DATA.items[id]) GAME_DATA.items[id] = { id, ...def }; }

// ================================================================
// BARROWS — Six brothers, six sets, one chest
// ================================================================
const CRYPTS_WARLORDS = {
  maldrak: { id:'maldrak', name:"Maldrak the Consumed", hp:6000, maxHit:58, attackSpeed:2.8, combatLevel:115, style:'melee', evasion:{melee:55,ranged:50,magic:25}, xp:350, gold:{min:0,max:0}, alignment:'CE', drops:[], cryptsOnly:true, desc:"Maldrak's axe hits harder the lower his HP gets. Protect from Melee." },
  serath: { id:'serath', name:"Serath the Pale", hp:5000, maxHit:45, attackSpeed:2.0, combatLevel:100, style:'magic', evasion:{melee:30,ranged:35,magic:70}, xp:320, gold:{min:0,max:0}, alignment:'CE', drops:[], cryptsOnly:true, desc:"Serath casts powerful spells that drain your stats. Protect from Magic." },
  veyra: { id:'veyra', name:"Veyra the Scorned", hp:4500, maxHit:42, attackSpeed:1.8, combatLevel:98, style:'ranged', evasion:{melee:40,ranged:65,magic:30}, xp:300, gold:{min:0,max:0}, alignment:'CE', drops:[], cryptsOnly:true, desc:"Veyra's bolts lower your Agility. Protect from Ranged." },
  grothak: { id:'grothak', name:"Grothak the Undying", hp:5500, maxHit:48, attackSpeed:2.4, combatLevel:110, style:'melee', evasion:{melee:55,ranged:50,magic:25}, xp:340, gold:{min:0,max:0}, alignment:'CE', drops:[], cryptsOnly:true, healsOnHit:true, healPct:25, desc:"Grothak heals himself with every successful hit. Kill him fast." },
  thorne: { id:'thorne', name:"Thorne the Immovable", hp:7000, maxHit:35, attackSpeed:3.2, combatLevel:108, style:'melee', evasion:{melee:65,ranged:55,magic:25}, xp:330, gold:{min:0,max:0}, alignment:'CE', drops:[], cryptsOnly:true, desc:"Thorne is the tankiest brother. Low damage but immense defence." },
  aluric: { id:'aluric', name:"Aluric the Faithless", hp:5500, maxHit:52, attackSpeed:2.4, combatLevel:112, style:'melee', evasion:{melee:50,ranged:45,magic:30}, xp:350, gold:{min:0,max:0}, alignment:'CE', drops:[], cryptsOnly:true, ignoreDefPct:25, desc:"Aluric's flail ignores 25% of your defence. Prayer helps but doesn't fully block." },
};
for (const [id, b] of Object.entries(CRYPTS_WARLORDS)) { if (!GAME_DATA.monsters[id]) GAME_DATA.monsters[id] = { ...b }; }

// Ashen Crypts armor sets
const _barrowsSets = [
  { brother:'maldrak', prefix:"Maldrak's", style:'melee', stats:{head:{def:55,str:15},body:{def:105,str:25,dr:2},legs:{def:85,str:18,dr:1},weapon:{attackBonus:103,strengthBonus:138}}, weaponType:'weapon', weaponSpeed:3.4, weaponStyle:'melee', setBonus:'Deals more damage at lower HP' },
  { brother:'serath', prefix:"Serath's", style:'magic', stats:{head:{mag:25,def:20},body:{mag:50,def:42,dr:1},legs:{mag:38,def:32},weapon:{magicBonus:80,attackBonus:15}}, weaponType:'weapon', weaponSpeed:2.4, weaponStyle:'magic', setBonus:'+20% magic damage' },
  { brother:'veyra', prefix:"Veyra's", style:'ranged', stats:{head:{rng:20,def:25},body:{rng:40,def:50,dr:1},legs:{rng:30,def:38},weapon:{rangedBonus:85,attackBonus:10}}, weaponType:'weapon', weaponSpeed:1.8, weaponStyle:'ranged', setBonus:'+15% ranged accuracy' },
  { brother:'grothak', prefix:"Grothak's", style:'melee', stats:{head:{def:50,str:8},body:{def:98,str:18,dr:2},legs:{def:78,str:12,dr:1},weapon:{attackBonus:85,strengthBonus:95}}, weaponType:'weapon', weaponSpeed:2.4, weaponStyle:'melee', setBonus:'25% chance to heal on hit' },
  { brother:'thorne', prefix:"Thorne's", style:'melee', stats:{head:{def:60,str:5},body:{def:115,str:10,dr:3},legs:{def:92,str:8,dr:2},weapon:{attackBonus:72,strengthBonus:78}}, weaponType:'weapon', weaponSpeed:3.0, weaponStyle:'melee', setBonus:'+30% damage reduction' },
  { brother:'aluric', prefix:"Aluric's", style:'melee', stats:{head:{def:48,str:10,pr:3},body:{def:90,str:15,dr:1,pr:3},legs:{def:72,str:10,dr:1,pr:3},weapon:{attackBonus:78,strengthBonus:88}}, weaponType:'weapon', weaponSpeed:2.4, weaponStyle:'melee', setBonus:'25% chance to ignore defence' },
];
const _bSlotNames = {head:'Helm',body:'Platebody',legs:'Platelegs'};
const _bWeaponNames = {maldrak:'Greataxe',serath:'Staff',veyra:'Crossbow',grothak:'Warspear',thorne:'Hammers',aluric:'Flail'};

for (const set of _barrowsSets) {
  for (const [slot, stats] of Object.entries(set.stats)) {
    if (slot === 'weapon') {
      _itCE(`${set.brother}_weapon`, { name:`${set.prefix} ${_bWeaponNames[set.brother]}`, type:'weapon', slot:'weapon', style:set.weaponStyle, attackSpeed:set.weaponSpeed, stats, levelReq:{[set.weaponStyle==='magic'?'magic':set.weaponStyle==='ranged'?'ranged':'attack']:70}, rarity:'legendary', sellPrice:0, desc:`${set.prefix} weapon. Part of the ${set.prefix} set. ${set.setBonus}. Unsellable.` });
    } else {
      const st = {};
      if (stats.def) st.defenceBonus = stats.def;
      if (stats.str) st.strengthBonus = stats.str;
      if (stats.mag) st.magicBonus = stats.mag;
      if (stats.rng) st.rangedBonus = stats.rng;
      if (stats.dr) st.damageReduction = stats.dr;
      _itCE(`${set.brother}_${slot}`, { name:`${set.prefix} ${_bSlotNames[slot]}`, type:'armor', slot, stats:st, levelReq:{defence:70}, rarity:'legendary', sellPrice:0, desc:`${set.prefix} ${_bSlotNames[slot]}. Part of the set (${set.setBonus}). Unsellable.` });
    }
  }
}

// Crypts chest loot
GAME_DATA.ashen_crypts = {
  levelReq: 60,
  brothers: ['maldrak','serath','veyra','grothak','thorne','aluric'],
  chestLoot: [
    {item:'death_rune', qty:80, chance:0.80},
    {item:'blood_rune', qty:50, chance:0.70},
    {item:'void_bolt', qty:30, chance:0.60},
    {item:'dragon_bones', qty:3, chance:0.40},
  ],
  // 1/24 for specific piece per brother killed
  pieceDrop: 1/24,
};
_itCE('void_bolt', { name:'Void Bolt', type:'ammo', rarity:'uncommon', sellPrice:20, desc:"Veyra's bolt racks. Common Crypts chest drop." });

// Ashen Crypts engine
GameEngine.prototype.startAshenCrypts = function() {
  if (this.getCombatLevel() < GAME_DATA.ashen_crypts.levelReq) { this.emit('notification',{type:'warn',text:`Ashen Crypts requires combat level ${GAME_DATA.ashen_crypts.levelReq}.`}); return; }
  this.stopSkill(); this.stopCombat();
  this.state.ashen_crypts = { active:true, brother:0, killed:[], chestOpen:false, loot:[] };
  this._startAshenCryptsBrother(0);
  this.emit('notification',{type:'achievement',text:'You descend into the Ashen Crypts...'});
};

GameEngine.prototype._startAshenCryptsBrother = function(idx) {
  const b = this.state.ashen_crypts;
  const bId = GAME_DATA.ashen_crypts.brothers[idx];
  if (!bId) { this._cryptsChest(); return; }
  const boss = CRYPTS_WARLORDS[bId];
  Object.assign(GAME_DATA.monsters[bId], boss);
  const c = this.state.combat;
  c.active = true; c.monster = bId; c.monsterHp = boss.hp;
  c.playerAttackTimer = 0; c.monsterAttackTimer = 0;
  c.statusEffects = { player:{}, monster:{} }; c._multiMobMode = false;
  b.brother = idx;
  this.emit('notification',{type:'info',text:`${boss.name} rises from the crypt!`});
  this.emit('combatStart', { crypts:true, brother:bId });
};

GameEngine.prototype._cryptsWarlordKilled = function() {
  const b = this.state.ashen_crypts;
  const bId = GAME_DATA.ashen_crypts.brothers[b.brother];
  b.killed.push(bId);
  this.addXp('hitpoints', 200);
  const style = this.state.combat.combatStyle;
  if (style==='melee') { this.addXp('attack',200); this.addXp('strength',200); this.addXp('defence',200); }
  else if (style==='ranged') { this.addXp('ranged',400); this.addXp('defence',150); }
  else { this.addXp('magic',400); this.addXp('defence',150); }
  const next = b.brother + 1;
  if (next >= GAME_DATA.ashen_crypts.brothers.length) {
    this._cryptsChest();
  } else {
    this.state.combat.active = false;
    b.between = true; b.betweenTimer = 2; b._nextBrother = next;
  }
};

GameEngine.prototype._cryptsChest = function() {
  const b = this.state.ashen_crypts;
  this.state.combat.active = false;
  const loot = [];
  // Base loot
  for (const drop of GAME_DATA.ashen_crypts.chestLoot) {
    if (Math.random() < drop.chance) { this.addItem(drop.item, drop.qty); loot.push({item:drop.item,qty:drop.qty,rarity:'common'}); }
  }
  // Armor rolls (1 roll per brother killed)
  const pieces = ['head','body','legs','weapon'];
  for (const bId of b.killed) {
    if (Math.random() < GAME_DATA.ashen_crypts.pieceDrop) {
      const slot = pieces[Math.floor(Math.random()*pieces.length)];
      const itemId = `${bId}_${slot}`;
      if (GAME_DATA.items[itemId]) { this.addItem(itemId, 1); loot.push({item:itemId,qty:1,rarity:'legendary'}); this.emit('notification',{type:'achievement',text:`BARROWS DROP: ${GAME_DATA.items[itemId].name}!`}); }
    }
  }
  b.loot = loot; b.chestOpen = true;
  if (!this.state.stats.ashen_cryptsCompletions) this.state.stats.ashen_cryptsCompletions = 0;
  this.state.stats.ashen_cryptsCompletions++;
  this.emit('notification',{type:'success',text:`Ashen Crypts complete! ${b.killed.length}/6 brothers killed. Chest opened.`});
};

GameEngine.prototype.leaveAshenCrypts = function() {
  this.state.ashen_crypts = { active:false }; this.state.combat.active = false;
  this.emit('notification',{type:'info',text:'You leave the Ashen Crypts.'});
};

// Hook Ashen Crypts/Gauntlet/Inferno into monster death
const _origOnMonsterDeathCE = GameEngine.prototype.onMonsterDeath;
GameEngine.prototype.onMonsterDeath = function(monster, isWB) {
  const mId = this.state.combat.monster;
  // Ashen Crypts — skip normal death, advance to next brother
  if (this.state.ashen_crypts?.active && CRYPTS_WARLORDS[mId]) {
    this._cryptsWarlordKilled();
    return;
  }
  // Gauntlet — boss killed = complete
  if (this.state.gauntlet?.active && (mId === 'crystalline_hunllef' || mId === 'corrupted_hunllef')) {
    this._gauntletComplete();
    return;
  }
  // Inferno — advance to next wave
  if (this.state.inferno?.active) {
    this._infernoWaveComplete();
    return;
  }
  if (_origOnMonsterDeathCE) _origOnMonsterDeathCE.call(this, monster, isWB);
};

// ================================================================
// THE GAUNTLET — Solo resource challenge + boss fight
// ================================================================
GAME_DATA.monsters.crystalline_hunllef = {
  id:'crystalline_hunllef', name:'Crystalline Hunllef', hp:25000, maxHit:70, attackSpeed:2.4, combatLevel:280, style:'magic',
  evasion:{melee:80,ranged:80,magic:80}, xp:0, gold:{min:0,max:0}, alignment:'CE', drops:[], gauntletOnly:true,
  desc:'The guardian of the Gauntlet. Switches attack styles. Crystal tornados chase you.',
};
GAME_DATA.monsters.corrupted_hunllef = {
  id:'corrupted_hunllef', name:'Corrupted Hunllef', hp:40000, maxHit:95, attackSpeed:2.0, combatLevel:350, style:'magic',
  evasion:{melee:90,ranged:90,magic:90}, xp:0, gold:{min:0,max:0}, alignment:'CE', drops:[], gauntletOnly:true,
  desc:'The corrupted guardian. Faster attacks, higher damage, more tornados. Extreme difficulty.',
};

_itCE('crystal_armor_seed', { name:'Crystal Armor Seed', type:'resource', rarity:'legendary', sellPrice:0, desc:'Used to create Crystal armor pieces at a singing bowl.' });
_itCE('crystal_weapon_seed', { name:'Crystal Weapon Seed', type:'resource', rarity:'legendary', sellPrice:0, desc:'Used to create Crystal weapons at a singing bowl.' });
_itCE('enhanced_crystal_weapon_seed', { name:'Enhanced Crystal Weapon Seed', type:'resource', rarity:'mythic', sellPrice:0, desc:'Creates a Blade of Saeldor or Bow of Faerdhinen.' });
_itCE('crystal_helm', { name:'Crystal Helm', type:'armor', slot:'head', rarity:'legendary', sellPrice:0, stats:{defenceBonus:65,rangedBonus:15,magicBonus:15,damageReduction:1}, levelReq:{defence:70}, desc:'Elven crystal helm. Hybrid stats. Unsellable.' });
_itCE('crystal_body', { name:'Crystal Body', type:'armor', slot:'body', rarity:'legendary', sellPrice:0, stats:{defenceBonus:125,rangedBonus:30,magicBonus:30,damageReduction:3}, levelReq:{defence:70}, desc:'Elven crystal body. Best hybrid body. Unsellable.' });
_itCE('crystal_legs', { name:'Crystal Legs', type:'armor', slot:'legs', rarity:'legendary', sellPrice:0, stats:{defenceBonus:95,rangedBonus:22,magicBonus:22,damageReduction:2}, levelReq:{defence:70}, desc:'Elven crystal legs. Hybrid stats. Unsellable.' });
_itCE('bow_of_faerdhinen', { name:'Bow of Faerdhinen', type:'weapon', slot:'weapon', style:'ranged', attackSpeed:2.0, stats:{rangedBonus:140,attackBonus:20}, levelReq:{ranged:80}, rarity:'mythic', sellPrice:0, desc:'An ancient elven bow. Requires no ammo. Unsellable.' });
_itCE('younglief', { name:'Youngllef', type:'pet_token', rarity:'mythic', sellPrice:0, desc:'A baby Hunllef. Gauntlet pet.' });

GAME_DATA.gauntlet = {
  levelReq: 80,
  normalRewards: [
    {item:'crystal_armor_seed',qty:1,chance:0.08},
    {item:'crystal_weapon_seed',qty:1,chance:0.06},
    {item:'death_rune',qty:100,chance:0.80},
    {item:'blood_rune',qty:60,chance:0.70},
    {item:'dragonite_bar',qty:3,chance:0.40},
  ],
  corruptedRewards: [
    {item:'crystal_armor_seed',qty:1,chance:0.15},
    {item:'crystal_weapon_seed',qty:1,chance:0.12},
    {item:'enhanced_crystal_weapon_seed',qty:1,chance:0.02},
    {item:'younglief',qty:1,chance:0.005},
    {item:'death_rune',qty:200,chance:1.0},
    {item:'blood_rune',qty:150,chance:1.0},
    {item:'dragonite_bar',qty:8,chance:0.80},
    {item:'celestial_fragment',qty:5,chance:0.50},
  ],
};

GameEngine.prototype.startGauntlet = function(corrupted) {
  if (this.getCombatLevel() < GAME_DATA.gauntlet.levelReq) { this.emit('notification',{type:'warn',text:`Gauntlet requires combat level ${GAME_DATA.gauntlet.levelReq}.`}); return; }
  this.stopSkill(); this.stopCombat();
  const bossId = corrupted ? 'corrupted_hunllef' : 'crystalline_hunllef';
  this.state.gauntlet = { active:true, corrupted:!!corrupted, startTime:Date.now(), prep:true, prepTimer:15, bossId };
  this.emit('notification',{type:'achievement',text:corrupted ? 'Entering the Corrupted Gauntlet...' : 'Entering the Gauntlet...'});
};

GameEngine.prototype._gauntletComplete = function() {
  const g = this.state.gauntlet;
  this.state.combat.active = false;
  const rewards = g.corrupted ? GAME_DATA.gauntlet.corruptedRewards : GAME_DATA.gauntlet.normalRewards;
  const loot = [];
  for (const drop of rewards) {
    if (Math.random() < drop.chance) { this.addItem(drop.item, drop.qty); loot.push({item:drop.item,qty:drop.qty}); }
  }
  g.loot = loot; g.complete = true;
  if (!this.state.stats.gauntletCompletions) this.state.stats.gauntletCompletions = 0;
  this.state.stats.gauntletCompletions++;
  const elapsed = Math.floor((Date.now() - g.startTime) / 1000);
  this.emit('notification',{type:'achievement',text:`${g.corrupted?'Corrupted ':''}Gauntlet complete in ${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')}!`});
  this.addXp('hitpoints', g.corrupted ? 3000 : 1500);
  this.addXp('tactics', g.corrupted ? 1000 : 500);
};
GameEngine.prototype.leaveGauntlet = function() { this.state.gauntlet = {active:false}; this.state.combat.active = false; };

// ================================================================
// THE INFERNO — 69 waves + TzKal-Zuk
// ================================================================
GAME_DATA.monsters.jal_nib = { id:'jal_nib', name:'Jal-Nib', hp:60, maxHit:5, attackSpeed:1.6, combatLevel:32, style:'melee', evasion:{melee:5,ranged:5,magic:5}, xp:20, gold:{min:0,max:0}, alignment:'CE', drops:[], fightCaveOnly:true, desc:'Nibblers. They attack the pillars. Kill them first.' };
GAME_DATA.monsters.jal_mejrah = { id:'jal_mejrah', name:'Jal-MejRah', hp:100, maxHit:10, attackSpeed:2.0, combatLevel:85, style:'magic', evasion:{melee:10,ranged:15,magic:30}, xp:40, gold:{min:0,max:0}, alignment:'CE', drops:[], fightCaveOnly:true, desc:'Bats. Weak but annoying. Magic attacks.' };
GAME_DATA.monsters.jal_ak = { id:'jal_ak', name:'Jal-Ak', hp:200, maxHit:18, attackSpeed:2.6, combatLevel:165, style:'melee', evasion:{melee:30,ranged:25,magic:15}, xp:60, gold:{min:0,max:0}, alignment:'CE', drops:[], fightCaveOnly:true, splitsOnDeath:true, splitInto:'jal_ak_small', splitCount:2, desc:'Blobs. Split on death into 2 smaller blobs.' };
GAME_DATA.monsters.jal_ak_small = { id:'jal_ak_small', name:'Jal-Ak (small)', hp:80, maxHit:10, attackSpeed:2.2, combatLevel:85, style:'melee', evasion:{melee:10,ranged:10,magic:5}, xp:25, gold:{min:0,max:0}, alignment:'CE', drops:[], fightCaveOnly:true, desc:'Small blob.' };
GAME_DATA.monsters.jal_imkot = { id:'jal_imkot', name:'Jal-ImKot', hp:600, maxHit:40, attackSpeed:2.8, combatLevel:240, style:'melee', evasion:{melee:55,ranged:50,magic:35}, xp:120, gold:{min:0,max:0}, alignment:'CE', drops:[], fightCaveOnly:true, desc:'Melee bruiser. Extremely high defence and damage.' };
GAME_DATA.monsters.jal_xil = { id:'jal_xil', name:'Jal-Xil', hp:500, maxHit:50, attackSpeed:2.0, combatLevel:370, style:'ranged', evasion:{melee:40,ranged:60,magic:30}, xp:150, gold:{min:0,max:0}, alignment:'CE', drops:[], fightCaveOnly:true, desc:'Ranger. Protect from Ranged or take massive hits.' };
GAME_DATA.monsters.jal_zek = { id:'jal_zek', name:'Jal-Zek', hp:900, maxHit:80, attackSpeed:2.4, combatLevel:490, style:'magic', evasion:{melee:60,ranged:55,magic:80}, xp:250, gold:{min:0,max:0}, alignment:'CE', drops:[], fightCaveOnly:true, desc:'Mager. Protect from Magic. Can heal other monsters.' };
GAME_DATA.monsters.ember_titan = { id:'ember_titan', name:'Ember Titan', hp:6000, maxHit:120, attackSpeed:3.0, combatLevel:600, style:'magic', evasion:{melee:70,ranged:65,magic:80}, xp:500, gold:{min:0,max:0}, alignment:'CE', drops:[], fightCaveOnly:true, desc:'The Ember Titan. Switches between Magic and Melee. Prayer flick or die.' };
GAME_DATA.monsters.tzkal_zuk = { id:'tzkal_zuk', name:'TzKal-Zuk', hp:20000, maxHit:250, attackSpeed:3.5, combatLevel:1400, style:'magic', evasion:{melee:95,ranged:90,magic:100}, xp:50000, gold:{min:0,max:0}, alignment:'CE', drops:[], fightCaveOnly:true, desc:'The final boss. The hardest fight in the game. One-shot potential.' };

_itCE('infernal_cape_v2', { name:'Infernal Cape', type:'armor', slot:'cape', rarity:'mythic', sellPrice:0, stats:{attackBonus:8,strengthBonus:12,rangedBonus:8,magicBonus:8,defenceBonus:15,damageReduction:2}, levelReq:{}, desc:'Best-in-slot melee cape. Earned from the Inferno. Unsellable.' });
_itCE('jal_nib_rek', { name:'Jal-Nib-Rek', type:'pet_token', rarity:'mythic', sellPrice:0, desc:'A tiny Zuk. Inferno pet. Extremely rare.' });

GAME_DATA.inferno = {
  levelReq: 100,
  waveCount: 69,
  rewards: {
    cape: 'infernal_cape_v2',
    pet: { item:'jal_nib_rek', chance:0.005 },
    xp: 50000,
  },
};

// Simplified wave generator for the Inferno
GameEngine.prototype.startInferno = function() {
  if (this.getCombatLevel() < GAME_DATA.inferno.levelReq) { this.emit('notification',{type:'warn',text:`The Inferno requires combat level ${GAME_DATA.inferno.levelReq}.`}); return; }
  this.stopSkill(); this.stopCombat();
  this.state.inferno = { active:true, wave:0, deaths:0, startTime:Date.now(), complete:false, loot:[] };
  this._startInfernoWave(0);
  this.emit('notification',{type:'achievement',text:'You enter the Inferno. 69 waves. No mercy.'});
};
GameEngine.prototype._getInfernoMonster = function(wave) {
  if (wave < 10) return ['jal_nib','jal_mejrah'][wave % 2];
  if (wave < 20) return ['jal_mejrah','jal_ak'][wave % 2];
  if (wave < 35) return ['jal_ak','jal_imkot'][wave % 2];
  if (wave < 50) return ['jal_imkot','jal_xil'][wave % 2];
  if (wave < 62) return ['jal_xil','jal_zek'][wave % 2];
  if (wave < 66) return 'jal_zek';
  if (wave < 69) return 'ember_titan';
  return 'tzkal_zuk';
};
GameEngine.prototype._startInfernoWave = function(wave) {
  const mId = this._getInfernoMonster(wave);
  const mon = GAME_DATA.monsters[mId];
  if (!mon) { this.emit('notification',{type:'warn',text:'Inferno error.'}); this.leaveInferno(); return; }
  const c = this.state.combat;
  c.active = true; c.monster = mId; c.monsterHp = mon.hp;
  c.playerAttackTimer = 0; c.monsterAttackTimer = 0; c.statusEffects = {player:{},monster:{}};
  this.state.inferno.wave = wave;
  this.emit('notification',{type:'info',text:`Wave ${wave+1}/69: ${mon.name}`});
  this.emit('combatStart',{inferno:true, wave});
};
GameEngine.prototype._infernoWaveComplete = function() {
  const inf = this.state.inferno;
  const next = inf.wave + 1;
  if (next >= GAME_DATA.inferno.waveCount) {
    this._infernoComplete();
  } else {
    this.state.combat.active = false;
    inf.between = true; inf.betweenTimer = 1.5; inf._nextWave = next;
  }
};
GameEngine.prototype._infernoComplete = function() {
  const inf = this.state.inferno;
  this.state.combat.active = false;
  inf.complete = true;
  this.addItem('infernal_cape_v2', 1);
  inf.loot.push({item:'infernal_cape_v2',qty:1,rarity:'mythic'});
  if (Math.random() < GAME_DATA.inferno.rewards.pet.chance) {
    this.addItem('jal_nib_rek', 1);
    inf.loot.push({item:'jal_nib_rek',qty:1,rarity:'mythic'});
    this.emit('notification',{type:'achievement',text:'PET DROP: Jal-Nib-Rek!'});
  }
  this.addXp('hitpoints', GAME_DATA.inferno.rewards.xp);
  if (!this.state.stats.infernoCompletions) this.state.stats.infernoCompletions = 0;
  this.state.stats.infernoCompletions++;
  const elapsed = Math.floor((Date.now() - inf.startTime)/1000);
  this.emit('notification',{type:'achievement',text:`THE INFERNO IS COMPLETE! ${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')} — Infernal Cape earned!`});
};
GameEngine.prototype.leaveInferno = function() { this.state.inferno = {active:false}; this.state.combat.active = false; };

// ── UNIFIED TICK HOOK for Ashen Crypts / Gauntlet / Inferno ──────────
const _origEmitCE = GameEngine.prototype.emit;
GameEngine.prototype.emit = function(event, data) {
  _origEmitCE.call(this, event, data);
  if (event !== 'tick') return;
  const dt = 0.6; // approximate tick interval

  // Ashen Crypts between-warlord timer
  const b = this.state.ashen_crypts;
  if (b?.active && b.between) {
    b.betweenTimer -= dt;
    if (b.betweenTimer <= 0) {
      b.between = false;
      this._startAshenCryptsBrother(b._nextBrother);
    }
  }

  // Gauntlet prep timer
  const g = this.state.gauntlet;
  if (g?.active && g.prep) {
    g.prepTimer -= dt;
    if (g.prepTimer <= 0) {
      g.prep = false;
      const boss = GAME_DATA.monsters[g.bossId];
      const c = this.state.combat;
      c.active = true; c.monster = g.bossId; c.monsterHp = boss.hp;
      c.playerAttackTimer = 0; c.monsterAttackTimer = 0;
      c.statusEffects = { player:{}, monster:{} };
      this.emit('notification',{type:'danger',text:`${boss.name} appears!`});
      this.emit('combatStart', { gauntlet:true, bossId:g.bossId });
    }
  }

  // Inferno between-wave timer
  const inf = this.state.inferno;
  if (inf?.active && inf.between) {
    inf.betweenTimer -= dt;
    if (inf.betweenTimer <= 0) {
      inf.between = false;
      this._startInfernoWave(inf._nextWave);
    }
  }
};

// ── SLAYER BOSS FIGHT CHECK ─────────────────────────────────────
const _origStartCombatCE = GameEngine.prototype.startCombat;
GameEngine.prototype.startCombat = function(areaId, monsterId) {
  // Handle direct boss fight: startCombat(null, 'cerberus')
  const checkId = monsterId || areaId;
  const mon = GAME_DATA.monsters[checkId];
  if (mon?.slayerReq) {
    const slayerLvl = this.state.skills?.slayer?.level || 1;
    if (slayerLvl < mon.slayerReq) {
      this.emit('notification',{type:'warn',text:`Requires Slayer level ${mon.slayerReq}. You are level ${slayerLvl}.`});
      return;
    }
  }
  if (_origStartCombatCE) return _origStartCombatCE.call(this, areaId, monsterId);
};

// ── KILL COUNT TRACKER ──────────────────────────────────────────
// Track boss kills for statistics
GameEngine.prototype._trackBossKill = function(bossId) {
  if (!this.state.stats.bossKills) this.state.stats.bossKills = {};
  this.state.stats.bossKills[bossId] = (this.state.stats.bossKills[bossId] || 0) + 1;
};

// ================================================================
// SLAYER BOSSES — Boss variants of slayer creatures
// ================================================================
GAME_DATA.monsters.cerberus = { id:'cerberus', name:'Cerberus', hp:6000, maxHit:55, attackSpeed:2.4, combatLevel:318, style:'magic', evasion:{melee:70,ranged:65,magic:75}, xp:700, gold:{min:100,max:500}, alignment:'CE', drops:[{item:'dragon_bones',qty:3,chance:1.0},{item:'primordial_crystal',qty:1,chance:0.01},{item:'pegasian_crystal',qty:1,chance:0.01},{item:'eternal_crystal',qty:1,chance:0.01}], desc:'Three-headed hellhound boss. Slayer level 91 required.', slayerReq:91 };
GAME_DATA.monsters.kraken = { id:'kraken', name:'Kraken', hp:5000, maxHit:45, attackSpeed:2.0, combatLevel:291, style:'magic', evasion:{melee:50,ranged:55,magic:85}, xp:600, gold:{min:80,max:400}, alignment:'CE', drops:[{item:'dragon_bones',qty:2,chance:0.80},{item:'kraken_tentacle',qty:1,chance:0.008},{item:'trident_piece',qty:1,chance:0.01}], desc:'Massive sea creature. Magic only. Slayer level 87 required.', slayerReq:87 };
GAME_DATA.monsters.smoke_devil_boss = { id:'smoke_devil_boss', name:'Thermonuclear Smoke Devil', hp:4000, maxHit:40, attackSpeed:2.2, combatLevel:301, style:'magic', evasion:{melee:55,ranged:60,magic:70}, xp:550, gold:{min:60,max:300}, alignment:'CE', drops:[{item:'dragon_bones',qty:2,chance:0.80},{item:'smoke_battlestaff',qty:1,chance:0.01},{item:'occult_necklace',qty:1,chance:0.005}], desc:'The thermonuclear variant. Slayer level 93 required.', slayerReq:93 };
GAME_DATA.monsters.void_mother = { id:'void_mother', name:'Void Mother', hp:8000, maxHit:62, attackSpeed:2.6, combatLevel:350, style:'melee', evasion:{melee:75,ranged:70,magic:55}, xp:900, gold:{min:120,max:600}, alignment:'CE', drops:[{item:'dragon_bones',qty:3,chance:1.0},{item:'abyssal_whip',qty:1,chance:0.02},{item:'void_crusher_piece',qty:1,chance:0.008}], desc:'Mother of Abyssal Demons. Multi-phase fight. Slayer level 85 required.', slayerReq:85 };
GAME_DATA.monsters.grotesque_guardians = { id:'grotesque_guardians', name:'Grotesque Guardians', hp:9000, maxHit:70, attackSpeed:2.8, combatLevel:328, style:'melee', evasion:{melee:80,ranged:75,magic:60}, xp:1100, gold:{min:150,max:700}, alignment:'CE', drops:[{item:'dragon_bones',qty:4,chance:1.0},{item:'granite_maul',qty:1,chance:0.01},{item:'guardian_boots',qty:1,chance:0.005}], desc:'Dusk and Dawn. Two gargoyle bosses. Slayer level 75 required.', slayerReq:75 };

// Slayer boss items
_itCE('primordial_crystal', { name:'Primordial Crystal', type:'resource', rarity:'legendary', sellPrice:5000, desc:'Cerberus drop. Used to upgrade dragon boots.' });
_itCE('pegasian_crystal', { name:'Pegasian Crystal', type:'resource', rarity:'legendary', sellPrice:5000, desc:'Cerberus drop. Used to upgrade ranged boots.' });
_itCE('eternal_crystal', { name:'Eternal Crystal', type:'resource', rarity:'legendary', sellPrice:5000, desc:'Cerberus drop. Used to upgrade magic boots.' });
_itCE('kraken_tentacle', { name:'Kraken Tentacle', type:'resource', rarity:'legendary', sellPrice:8000, desc:'Used to create the Tentacle Whip.' });
_itCE('trident_piece', { name:'Trident of the Seas (full)', type:'weapon', slot:'weapon', style:'magic', attackSpeed:2.4, stats:{magicBonus:95,attackBonus:15}, levelReq:{magic:75}, rarity:'legendary', sellPrice:20000, desc:'Powered staff. Strong magic weapon.' });
_itCE('smoke_battlestaff', { name:'Smoke Battlestaff', type:'weapon', slot:'weapon', style:'magic', attackSpeed:2.4, stats:{magicBonus:85,attackBonus:12}, levelReq:{magic:70}, rarity:'legendary', sellPrice:12000, desc:'Provides unlimited fire and air runes.' });
_itCE('void_crusher_piece', { name:'Void Crusher Piece', type:'resource', rarity:'legendary', sellPrice:3000, desc:'Collect 3 to assemble the Void Crusher.' });
_itCE('granite_maul', { name:'Granite Maul', type:'weapon', slot:'weapon', style:'melee', attackSpeed:2.8, stats:{attackBonus:72,strengthBonus:95}, levelReq:{attack:50,strength:50}, rarity:'rare', sellPrice:8000, specCost:50, specEffect:{type:'instant_smash',mult:1.0,instant:true}, desc:'A massive maul. Spec: instant attack (no delay). 50% spec.' });
_itCE('guardian_boots', { name:'Guardian Boots', type:'armor', slot:'boots', rarity:'legendary', sellPrice:0, stats:{defenceBonus:35,strengthBonus:5,damageReduction:1}, levelReq:{defence:75}, desc:'Best defensive boots in the game. Unsellable.' });

GAME_DATA.slayerBosses = [
  { id:'cerberus', name:'Cerberus', slayerReq:91, desc:'Three-headed hellhound. Drops Primordial, Pegasian, Eternal crystals.', combatLevel:318 },
  { id:'kraken', name:'Kraken', slayerReq:87, desc:'Giant sea creature. Drops Tentacle and Trident.', combatLevel:291 },
  { id:'smoke_devil_boss', name:'Thermonuclear Smoke Devil', slayerReq:93, desc:'Drops Smoke Battlestaff and Occult Necklace.', combatLevel:301 },
  { id:'void_mother', name:'Void Mother', slayerReq:85, desc:'Drops Void Lash and Void Crusher pieces.', combatLevel:350 },
  { id:'grotesque_guardians', name:'Grotesque Guardians', slayerReq:75, desc:'Drops Granite Maul and Guardian Boots.', combatLevel:328 },
];

// ================================================================
// ALL SVG ART
// ================================================================
if (!GAME_DATA.monsterArt) GAME_DATA.monsterArt = {};
Object.assign(GAME_DATA.monsterArt, {

  // ── BARROWS BROTHERS ──────────────────────────────────────────
  maldrak: `<svg viewBox="0 0 80 80"><rect x="20" y="30" width="40" height="32" rx="4" fill="#1a0808" stroke="#5a2020" stroke-width="2"/><rect x="24" y="56" width="12" height="18" rx="3" fill="#140606" stroke="#4a1818" stroke-width="1"/><rect x="44" y="56" width="12" height="18" rx="3" fill="#140606" stroke="#4a1818" stroke-width="1"/><rect x="16" y="12" width="48" height="22" rx="6" fill="#1a0808" stroke="#5a2020" stroke-width="2"/><rect x="24" y="18" width="10" height="6" rx="1" fill="#080202"/><rect x="26" y="20" width="6" height="2" fill="#c44040" opacity="0.8"/><rect x="46" y="18" width="10" height="6" rx="1" fill="#080202"/><rect x="48" y="20" width="6" height="2" fill="#c44040" opacity="0.8"/><rect x="8" y="32" width="14" height="26" rx="6" fill="#140606" stroke="#4a1818" stroke-width="1"/><rect x="58" y="32" width="14" height="26" rx="6" fill="#140606" stroke="#4a1818" stroke-width="1"/><path d="M6 58 L2 74" stroke="#5a5a6a" stroke-width="3" stroke-linecap="round"/><rect x="-4" y="68" width="16" height="10" rx="2" fill="#3a3a4a" stroke="#5a5a6a" stroke-width="1.5"/></svg>`,

  serath: `<svg viewBox="0 0 80 80"><path d="M24 30 Q40 24 56 30 L60 74 Q40 80 20 74Z" fill="#0a0618" stroke="#4a2080" stroke-width="1.5"/><path d="M26 38 Q40 34 54 38" stroke="#3a1860" stroke-width="0.8" fill="none" opacity="0.5"/><path d="M22 55 Q40 50 58 55" stroke="#3a1860" stroke-width="0.8" fill="none" opacity="0.5"/><circle cx="40" cy="18" r="10" fill="#0a0618" stroke="#6a30a0" stroke-width="2"/><circle cx="36" cy="16" r="2.5" fill="#040208"/><circle cx="36" cy="16" r="1.2" fill="#9b30d0" opacity="0.9"/><circle cx="44" cy="16" r="2.5" fill="#040208"/><circle cx="44" cy="16" r="1.2" fill="#9b30d0" opacity="0.9"/><path d="M20 34 Q12 40 8 52" stroke="#0a0618" stroke-width="6" fill="none"/><path d="M60 34 Q68 40 72 52" stroke="#0a0618" stroke-width="6" fill="none"/><path d="M8 52 L4 74" stroke="#4a2a1a" stroke-width="2.5" stroke-linecap="round"/><circle cx="4" cy="6" r="5" fill="#9b30d0" opacity="0.5"/><circle cx="4" cy="6" r="3" fill="#e0a0ff"/><path d="M4 11 L4 74" stroke="#4a2a1a" stroke-width="2.5"/></svg>`,

  veyra: `<svg viewBox="0 0 80 80"><path d="M26 30 Q40 26 54 30 L56 65 Q40 70 24 65Z" fill="#0a0c08" stroke="#3a5030" stroke-width="1.5"/><rect x="28" y="60" width="10" height="14" rx="3" fill="#080a06" stroke="#2a3a20" stroke-width="1"/><rect x="42" y="60" width="10" height="14" rx="3" fill="#080a06" stroke="#2a3a20" stroke-width="1"/><circle cx="40" cy="18" r="10" fill="#0a0c08" stroke="#4a6a38" stroke-width="2"/><path d="M30 14 Q34 10 40 12 Q46 10 50 14" fill="#0a0c08" stroke="#3a5030" stroke-width="1"/><circle cx="36" cy="16" r="2.5" fill="#040602"/><circle cx="36" cy="16" r="1.2" fill="#4aaa20" opacity="0.9"/><circle cx="44" cy="16" r="2.5" fill="#040602"/><circle cx="44" cy="16" r="1.2" fill="#4aaa20" opacity="0.9"/><rect x="14" y="34" width="12" height="22" rx="5" fill="#080a06" stroke="#2a3a20" stroke-width="1"/><rect x="54" y="34" width="12" height="22" rx="5" fill="#080a06" stroke="#2a3a20" stroke-width="1"/><path d="M66 44 Q74 34 66 24" stroke="#4a3a1a" stroke-width="2" fill="none"/><path d="M66 26 L66 42" stroke="#6a6a6a" stroke-width="0.8"/></svg>`,

  grothak: `<svg viewBox="0 0 80 80"><rect x="20" y="30" width="40" height="32" rx="4" fill="#0c0a08" stroke="#4a3a28" stroke-width="2"/><rect x="24" y="56" width="12" height="18" rx="3" fill="#0a0806" stroke="#3a2a18" stroke-width="1"/><rect x="44" y="56" width="12" height="18" rx="3" fill="#0a0806" stroke="#3a2a18" stroke-width="1"/><circle cx="40" cy="44" r="6" fill="#060402" stroke="#4a8a20" stroke-width="1.5"/><circle cx="40" cy="44" r="3" fill="#4a8a20" opacity="0.6"/><rect x="14" y="10" width="52" height="22" rx="8" fill="#0c0a08" stroke="#4a3a28" stroke-width="2"/><path d="M30 10 L26 2 M40 8 L40 0 M50 10 L54 2" stroke="#4a3a28" stroke-width="2" stroke-linecap="round"/><rect x="24" y="16" width="10" height="6" rx="1" fill="#060402"/><rect x="26" y="18" width="6" height="2" fill="#4a8a20" opacity="0.8"/><rect x="46" y="16" width="10" height="6" rx="1" fill="#060402"/><rect x="48" y="18" width="6" height="2" fill="#4a8a20" opacity="0.8"/><rect x="6" y="32" width="14" height="28" rx="6" fill="#0a0806" stroke="#3a2a18" stroke-width="1"/><rect x="60" y="32" width="14" height="28" rx="6" fill="#0a0806" stroke="#3a2a18" stroke-width="1"/><path d="M4 60 L2 76" stroke="#5a4a3a" stroke-width="2.5" stroke-linecap="round"/><circle cx="2" cy="76" r="3" fill="#4a3a28"/></svg>`,

  thorne: `<svg viewBox="0 0 80 80"><rect x="16" y="28" width="48" height="36" rx="5" fill="#0e0c0a" stroke="#4a4038" stroke-width="2.5"/><rect x="22" y="58" width="14" height="18" rx="3" fill="#0a0808" stroke="#3a3430" stroke-width="1.5"/><rect x="44" y="58" width="14" height="18" rx="3" fill="#0a0808" stroke="#3a3430" stroke-width="1.5"/><path d="M16 40 L64 40 M16 52 L64 52" stroke="#3a3430" stroke-width="0.8" opacity="0.4"/><ellipse cx="12" cy="34" rx="8" ry="6" fill="#0a0808" stroke="#4a4038" stroke-width="1.5"/><ellipse cx="68" cy="34" rx="8" ry="6" fill="#0a0808" stroke="#4a4038" stroke-width="1.5"/><rect x="4" y="34" width="14" height="28" rx="6" fill="#0a0808" stroke="#3a3430" stroke-width="1"/><rect x="62" y="34" width="14" height="28" rx="6" fill="#0a0808" stroke="#3a3430" stroke-width="1"/><rect x="14" y="8" width="52" height="24" rx="8" fill="#0e0c0a" stroke="#4a4038" stroke-width="2.5"/><rect x="22" y="16" width="12" height="6" rx="1" fill="#060404"/><rect x="24" y="18" width="8" height="2" fill="#8a4020" opacity="0.8"/><rect x="46" y="16" width="12" height="6" rx="1" fill="#060404"/><rect x="48" y="18" width="8" height="2" fill="#8a4020" opacity="0.8"/></svg>`,

  aluric: `<svg viewBox="0 0 80 80"><path d="M24 30 Q40 26 56 30 L58 65 Q40 70 22 65Z" fill="#0c080a" stroke="#4a3040" stroke-width="1.5"/><rect x="28" y="58" width="10" height="16" rx="3" fill="#0a060a" stroke="#3a2030" stroke-width="1"/><rect x="42" y="58" width="10" height="16" rx="3" fill="#0a060a" stroke="#3a2030" stroke-width="1"/><circle cx="40" cy="48" r="5" fill="#060408" stroke="#8a4070" stroke-width="1.5"/><polygon points="40,44 44,48 40,52 36,48" fill="#8a4070" opacity="0.5"/><rect x="14" y="8" width="52" height="24" rx="6" fill="#0c080a" stroke="#6a4060" stroke-width="2"/><rect x="24" y="14" width="10" height="6" rx="1" fill="#060408"/><rect x="26" y="16" width="6" height="2" fill="#8a4070" opacity="0.8"/><rect x="46" y="14" width="10" height="6" rx="1" fill="#060408"/><rect x="48" y="16" width="6" height="2" fill="#8a4070" opacity="0.8"/><path d="M30 8 L28 2 M50 8 L52 2" stroke="#6a4060" stroke-width="2" stroke-linecap="round"/><rect x="8" y="32" width="14" height="26" rx="6" fill="#0a060a" stroke="#3a2030" stroke-width="1"/><rect x="58" y="32" width="14" height="26" rx="6" fill="#0a060a" stroke="#3a2030" stroke-width="1"/><path d="M6 58 L2 72" stroke="#5a4a5a" stroke-width="2.5"/><circle cx="2" cy="72" r="4" fill="#5a4a5a"/><path d="M-2 72 L2 72 L6 72" stroke="#8a4070" stroke-width="1.5"/></svg>`,

  // ── GAUNTLET BOSSES ───────────────────────────────────────────
  crystalline_hunllef: `<svg viewBox="0 0 80 80"><defs><radialGradient id="ch-g" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#88ccff" stop-opacity="0.15"/><stop offset="100%" stop-color="#88ccff" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="45" rx="35" ry="35" fill="url(#ch-g)"/><polygon points="40,8 58,24 54,48 26,48 22,24" fill="#041828" stroke="#88ccff" stroke-width="2"/><polygon points="40,14 52,26 48,44 32,44 28,26" fill="#082030" stroke="#6aaaee" stroke-width="1" opacity="0.5"/><circle cx="34" cy="28" r="4" fill="#041020"/><circle cx="34" cy="28" r="2.5" fill="#88ccff" opacity="0.9"/><circle cx="34" cy="27" r="1" fill="#fff" opacity="0.7"/><circle cx="46" cy="28" r="4" fill="#041020"/><circle cx="46" cy="28" r="2.5" fill="#88ccff" opacity="0.9"/><circle cx="46" cy="27" r="1" fill="#fff" opacity="0.7"/><path d="M22 48 Q16 56 20 66 Q26 72 32 68" stroke="#041828" stroke-width="5" fill="none"/><path d="M58 48 Q64 56 60 66 Q54 72 48 68" stroke="#041828" stroke-width="5" fill="none"/><path d="M26 48 L22 58 L18 68" stroke="#88ccff" stroke-width="1.5" fill="none" opacity="0.4"/><path d="M54 48 L58 58 L62 68" stroke="#88ccff" stroke-width="1.5" fill="none" opacity="0.4"/><polygon points="10,20 16,12 18,22" fill="#88ccff" opacity="0.4"/><polygon points="70,18 62,10 62,22" fill="#88ccff" opacity="0.4"/><polygon points="14,58 18,50 20,58" fill="#6aaaee" opacity="0.3"/><polygon points="66,56 62,48 60,56" fill="#6aaaee" opacity="0.3"/></svg>`,

  corrupted_hunllef: `<svg viewBox="0 0 80 80"><defs><radialGradient id="crh-g" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#cc3030" stop-opacity="0.15"/><stop offset="100%" stop-color="#cc3030" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="45" rx="35" ry="35" fill="url(#crh-g)"/><polygon points="40,8 58,24 54,48 26,48 22,24" fill="#280408" stroke="#cc3030" stroke-width="2"/><polygon points="40,14 52,26 48,44 32,44 28,26" fill="#300810" stroke="#aa2020" stroke-width="1" opacity="0.5"/><circle cx="34" cy="28" r="4" fill="#200404"/><circle cx="34" cy="28" r="2.5" fill="#cc3030" opacity="0.9"/><circle cx="34" cy="27" r="1" fill="#ff8080" opacity="0.7"/><circle cx="46" cy="28" r="4" fill="#200404"/><circle cx="46" cy="28" r="2.5" fill="#cc3030" opacity="0.9"/><circle cx="46" cy="27" r="1" fill="#ff8080" opacity="0.7"/><path d="M22 48 Q16 56 20 66 Q26 72 32 68" stroke="#280408" stroke-width="5" fill="none"/><path d="M58 48 Q64 56 60 66 Q54 72 48 68" stroke="#280408" stroke-width="5" fill="none"/><polygon points="10,20 16,12 18,22" fill="#cc3030" opacity="0.4"/><polygon points="70,18 62,10 62,22" fill="#cc3030" opacity="0.4"/></svg>`,

  // ── INFERNO MONSTERS ──────────────────────────────────────────
  jal_nib: `<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="12" fill="#4a2208" stroke="#8a4410" stroke-width="1.5"/><circle cx="36" cy="38" r="2" fill="#0a0402"/><circle cx="36" cy="38" r="1" fill="#e8cc20"/><circle cx="44" cy="38" r="2" fill="#0a0402"/><circle cx="44" cy="38" r="1" fill="#e8cc20"/><path d="M36 46 L38 44 L40 46 L42 44 L44 46" stroke="#e8d0a0" stroke-width="1" fill="none"/><path d="M28 42 L22 50" stroke="#4a2208" stroke-width="3"/><path d="M52 42 L58 50" stroke="#4a2208" stroke-width="3"/><path d="M34 52 L32 60" stroke="#4a2208" stroke-width="2.5"/><path d="M46 52 L48 60" stroke="#4a2208" stroke-width="2.5"/></svg>`,

  jal_mejrah: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="38" rx="14" ry="10" fill="#5a2a08" stroke="#8a4a10" stroke-width="1"/><circle cx="36" cy="36" r="2.5" fill="#0a0402"/><circle cx="36" cy="36" r="1.2" fill="#e8cc20"/><circle cx="44" cy="36" r="2.5" fill="#0a0402"/><circle cx="44" cy="36" r="1.2" fill="#e8cc20"/><path d="M26 32 Q12 20 8 34 Q12 42 26 40" fill="#4a1a06" stroke="#6a3a0a" stroke-width="1" opacity="0.8"/><path d="M54 32 Q68 20 72 34 Q68 42 54 40" fill="#4a1a06" stroke="#6a3a0a" stroke-width="1" opacity="0.8"/><path d="M36 48 L34 56 M44 48 L46 56" stroke="#5a2a08" stroke-width="2"/></svg>`,

  jal_ak: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="45" rx="22" ry="18" fill="#5a3008" stroke="#8a5010" stroke-width="1.5"/><ellipse cx="40" cy="45" rx="15" ry="12" fill="#6a3a0a" opacity="0.5"/><circle cx="34" cy="38" r="4" fill="#0a0402"/><circle cx="34" cy="38" r="2" fill="#e8cc20" opacity="0.9"/><circle cx="46" cy="38" r="4" fill="#0a0402"/><circle cx="46" cy="38" r="2" fill="#e8cc20" opacity="0.9"/><circle cx="30" cy="50" r="3" fill="#8a5010" opacity="0.4"/><circle cx="50" cy="48" r="3.5" fill="#8a5010" opacity="0.4"/></svg>`,

  jal_ak_small: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="48" rx="14" ry="10" fill="#5a3008" stroke="#8a5010" stroke-width="1"/><circle cx="36" cy="44" r="2.5" fill="#0a0402"/><circle cx="36" cy="44" r="1.2" fill="#e8cc20"/><circle cx="44" cy="44" r="2.5" fill="#0a0402"/><circle cx="44" cy="44" r="1.2" fill="#e8cc20"/></svg>`,

  jal_imkot: `<svg viewBox="0 0 80 80"><rect x="18" y="30" width="44" height="34" rx="6" fill="#3a1a08" stroke="#6a3a10" stroke-width="2"/><rect x="22" y="58" width="14" height="18" rx="4" fill="#2a1206" stroke="#5a2a0a" stroke-width="1.5"/><rect x="44" y="58" width="14" height="18" rx="4" fill="#2a1206" stroke="#5a2a0a" stroke-width="1.5"/><rect x="6" y="32" width="16" height="28" rx="7" fill="#2a1206" stroke="#5a2a0a" stroke-width="1.5"/><rect x="58" y="32" width="16" height="28" rx="7" fill="#2a1206" stroke="#5a2a0a" stroke-width="1.5"/><rect x="16" y="10" width="48" height="24" rx="8" fill="#3a1a08" stroke="#6a3a10" stroke-width="2"/><rect x="24" y="16" width="10" height="6" fill="#0a0402"/><rect x="26" y="18" width="6" height="2" fill="#e8cc20" opacity="0.8"/><rect x="46" y="16" width="10" height="6" fill="#0a0402"/><rect x="48" y="18" width="6" height="2" fill="#e8cc20" opacity="0.8"/></svg>`,

  jal_xil: `<svg viewBox="0 0 80 80"><path d="M26 28 Q40 22 54 28 L56 62 Q40 68 24 62Z" fill="#3a1a08" stroke="#8a4a10" stroke-width="1.5"/><rect x="28" y="56" width="10" height="16" rx="3" fill="#2a1206" stroke="#5a2a0a" stroke-width="1"/><rect x="42" y="56" width="10" height="16" rx="3" fill="#2a1206" stroke="#5a2a0a" stroke-width="1"/><circle cx="40" cy="16" r="10" fill="#3a1a08" stroke="#8a4a10" stroke-width="1.5"/><circle cx="36" cy="14" r="2.5" fill="#0a0402"/><circle cx="36" cy="14" r="1.2" fill="#e8cc20" opacity="0.9"/><circle cx="44" cy="14" r="2.5" fill="#0a0402"/><circle cx="44" cy="14" r="1.2" fill="#e8cc20" opacity="0.9"/><rect x="12" y="30" width="12" height="24" rx="5" fill="#2a1206" stroke="#5a2a0a" stroke-width="1"/><rect x="56" y="30" width="12" height="24" rx="5" fill="#2a1206" stroke="#5a2a0a" stroke-width="1"/><path d="M66 42 Q74 32 66 22" stroke="#5a3a1a" stroke-width="2" fill="none"/></svg>`,

  jal_zek: `<svg viewBox="0 0 80 80"><path d="M24 28 Q40 20 56 28 L60 66 Q40 74 20 66Z" fill="#2a0a08" stroke="#c44020" stroke-width="1.5"/><circle cx="40" cy="50" r="6" fill="#0a0204" stroke="#c44020" stroke-width="1.5"/><circle cx="40" cy="50" r="3" fill="#c44020" opacity="0.7"/><circle cx="40" cy="50" r="1.5" fill="#e8cc20"/><circle cx="40" cy="16" r="12" fill="#2a0a08" stroke="#c44020" stroke-width="2"/><circle cx="35" cy="14" r="3" fill="#0a0204"/><circle cx="35" cy="14" r="1.5" fill="#e88030" opacity="0.9"/><circle cx="45" cy="14" r="3" fill="#0a0204"/><circle cx="45" cy="14" r="1.5" fill="#e88030" opacity="0.9"/><path d="M28 6 L24 -2 M40 4 L40 -4 M52 6 L56 -2" stroke="#c44020" stroke-width="2" stroke-linecap="round"/><path d="M18 32 Q8 38 6 50" stroke="#2a0a08" stroke-width="7" fill="none"/><path d="M62 32 Q72 38 74 50" stroke="#2a0a08" stroke-width="7" fill="none"/></svg>`,

  ember_titan: `<svg viewBox="0 0 80 80"><defs><radialGradient id="jj-g" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#c44020" stop-opacity="0.2"/><stop offset="100%" stop-color="#c44020" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="45" rx="35" ry="35" fill="url(#jj-g)"/><ellipse cx="40" cy="50" rx="26" ry="18" fill="#3a1208" stroke="#8a3a10" stroke-width="2"/><circle cx="30" cy="28" r="10" fill="#3a1208" stroke="#8a3a10" stroke-width="1.5"/><circle cx="28" cy="26" r="3" fill="#0a0402"/><circle cx="28" cy="26" r="1.5" fill="#e8cc20"/><circle cx="50" cy="28" r="10" fill="#3a1208" stroke="#8a3a10" stroke-width="1.5"/><circle cx="48" cy="26" r="3" fill="#0a0402"/><circle cx="48" cy="26" r="1.5" fill="#e8cc20"/><circle cx="40" cy="22" r="8" fill="#3a1208" stroke="#c44020" stroke-width="2"/><circle cx="38" cy="20" r="2.5" fill="#0a0402"/><circle cx="38" cy="20" r="1.2" fill="#e88030"/><circle cx="42" cy="20" r="2.5" fill="#0a0402"/><circle cx="42" cy="20" r="1.2" fill="#e88030"/><path d="M18 56 L14 70" stroke="#3a1208" stroke-width="5"/><path d="M34 62 L32 74" stroke="#3a1208" stroke-width="4"/><path d="M46 62 L48 74" stroke="#3a1208" stroke-width="4"/><path d="M62 56 L66 70" stroke="#3a1208" stroke-width="5"/></svg>`,

  tzkal_zuk: `<svg viewBox="0 0 80 80"><defs><radialGradient id="zk-g" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="#c44020" stop-opacity="0.3"/><stop offset="100%" stop-color="#c44020" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="42" rx="38" ry="38" fill="url(#zk-g)"/><rect x="8" y="20" width="64" height="48" rx="8" fill="#2a0a04" stroke="#c44020" stroke-width="2.5"/><path d="M8 38 L72 38 M8 52 L72 52" stroke="#6a2010" stroke-width="1" opacity="0.4"/><circle cx="40" cy="44" r="12" fill="#0a0204" stroke="#e88030" stroke-width="2.5"/><circle cx="40" cy="44" r="8" fill="#c44020" opacity="0.8"/><circle cx="40" cy="44" r="4.5" fill="#e8cc20"/><circle cx="40" cy="43" r="2" fill="#fff" opacity="0.8"/><rect x="0" y="24" width="14" height="36" rx="6" fill="#2a0a04" stroke="#8a3010" stroke-width="1.5"/><rect x="66" y="24" width="14" height="36" rx="6" fill="#2a0a04" stroke="#8a3010" stroke-width="1.5"/><path d="M-2 58 L-6 68 M4 60 L2 70 M10 58 L10 68" stroke="#c44020" stroke-width="2.5" stroke-linecap="round"/><path d="M82 58 L86 68 M76 60 L78 70 M70 58 L70 68" stroke="#c44020" stroke-width="2.5" stroke-linecap="round"/><rect x="14" y="4" width="52" height="20" rx="6" fill="#2a0a04" stroke="#c44020" stroke-width="2.5"/><rect x="22" y="10" width="14" height="6" rx="1" fill="#0a0204"/><rect x="24" y="12" width="10" height="2" fill="#e88030" opacity="0.9"/><rect x="44" y="10" width="14" height="6" rx="1" fill="#0a0204"/><rect x="46" y="12" width="10" height="2" fill="#e88030" opacity="0.9"/><path d="M20 4 L16 -4 M30 2 L28 -6 M40 0 L40 -8 M50 2 L52 -6 M60 4 L64 -4" stroke="#c44020" stroke-width="2.5" stroke-linecap="round"/></svg>`,

  // ── SLAYER BOSSES ─────────────────────────────────────────────
  cerberus: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="52" rx="24" ry="14" fill="#2a0808" stroke="#5a1818" stroke-width="1.5"/><circle cx="24" cy="32" r="10" fill="#2a0808" stroke="#5a1818" stroke-width="1.5"/><circle cx="22" cy="30" r="2.5" fill="#0a0202"/><circle cx="22" cy="30" r="1.2" fill="#e8cc20"/><circle cx="27" cy="30" r="2.5" fill="#0a0202"/><circle cx="27" cy="30" r="1.2" fill="#e8cc20"/><circle cx="40" cy="26" r="12" fill="#2a0808" stroke="#8a2828" stroke-width="2"/><circle cx="36" cy="24" r="3" fill="#0a0202"/><circle cx="36" cy="24" r="1.5" fill="#c44040" opacity="0.9"/><circle cx="44" cy="24" r="3" fill="#0a0202"/><circle cx="44" cy="24" r="1.5" fill="#c44040" opacity="0.9"/><circle cx="56" cy="32" r="10" fill="#2a0808" stroke="#5a1818" stroke-width="1.5"/><circle cx="53" cy="30" r="2.5" fill="#0a0202"/><circle cx="53" cy="30" r="1.2" fill="#e8cc20"/><circle cx="58" cy="30" r="2.5" fill="#0a0202"/><circle cx="58" cy="30" r="1.2" fill="#e8cc20"/><path d="M22 62 L18 74" stroke="#2a0808" stroke-width="4"/><path d="M36 64 L34 76" stroke="#2a0808" stroke-width="3.5"/><path d="M46 64 L48 76" stroke="#2a0808" stroke-width="3.5"/><path d="M58 62 L62 74" stroke="#2a0808" stroke-width="4"/><path d="M14 50 Q6 46 8 56" fill="#2a0808"/></svg>`,

  kraken: `<svg viewBox="0 0 80 80"><defs><radialGradient id="kr-g" cx="50%" cy="40%" r="55%"><stop offset="0%" stop-color="#2060a0" stop-opacity="0.2"/><stop offset="100%" stop-color="#2060a0" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="40" rx="30" ry="28" fill="url(#kr-g)"/><ellipse cx="40" cy="35" rx="22" ry="18" fill="#0a1828" stroke="#2060a0" stroke-width="2"/><circle cx="32" cy="30" r="5" fill="#041020"/><circle cx="32" cy="30" r="3" fill="#4a8acc" opacity="0.9"/><circle cx="32" cy="29" r="1.2" fill="#ccf0ff"/><circle cx="48" cy="30" r="5" fill="#041020"/><circle cx="48" cy="30" r="3" fill="#4a8acc" opacity="0.9"/><circle cx="48" cy="29" r="1.2" fill="#ccf0ff"/><path d="M20 50 Q14 58 10 68 Q8 74 14 72" stroke="#0a1828" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M30 52 Q26 60 24 70" stroke="#0a1828" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M50 52 Q54 60 56 70" stroke="#0a1828" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M60 50 Q66 58 70 68 Q72 74 66 72" stroke="#0a1828" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M36 52 Q34 58 36 64" stroke="#0a1828" stroke-width="3" fill="none"/><path d="M44 52 Q46 58 44 64" stroke="#0a1828" stroke-width="3" fill="none"/></svg>`,

  smoke_devil_boss: `<svg viewBox="0 0 80 80"><defs><radialGradient id="sd-g" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#6a8a4a" stop-opacity="0.2"/><stop offset="100%" stop-color="#6a8a4a" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="45" rx="30" ry="30" fill="url(#sd-g)"/><ellipse cx="40" cy="45" rx="24" ry="20" fill="#0a1408" stroke="#4a6a2a" stroke-width="2"/><circle cx="32" cy="38" r="5" fill="#040a02"/><circle cx="32" cy="38" r="3" fill="#8aaa3a" opacity="0.9"/><circle cx="32" cy="37" r="1.2" fill="#ccee60"/><circle cx="48" cy="38" r="5" fill="#040a02"/><circle cx="48" cy="38" r="3" fill="#8aaa3a" opacity="0.9"/><circle cx="48" cy="37" r="1.2" fill="#ccee60"/><path d="M18 48 Q8 52 12 62 Q16 68 22 64" stroke="#0a1408" stroke-width="4" fill="none"/><path d="M62 48 Q72 52 68 62 Q64 68 58 64" stroke="#0a1408" stroke-width="4" fill="none"/><circle cx="14" cy="34" r="3" fill="#4a6a2a" opacity="0.3"/><circle cx="66" cy="32" r="3.5" fill="#4a6a2a" opacity="0.3"/><circle cx="40" cy="30" r="2.5" fill="#8aaa3a" opacity="0.2"/></svg>`,

  void_mother: `<svg viewBox="0 0 80 80"><defs><radialGradient id="as-g" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#5a0a5a" stop-opacity="0.2"/><stop offset="100%" stop-color="#5a0a5a" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="45" rx="32" ry="28" fill="url(#as-g)"/><ellipse cx="40" cy="48" rx="24" ry="16" fill="#1a0a1a" stroke="#5a2060" stroke-width="2"/><circle cx="40" cy="30" r="14" fill="#1a0a1a" stroke="#8a30a0" stroke-width="2"/><circle cx="34" cy="28" r="4" fill="#080408"/><circle cx="34" cy="28" r="2.5" fill="#9b30d0" opacity="0.9"/><circle cx="34" cy="27" r="1" fill="#e0a0ff"/><circle cx="46" cy="28" r="4" fill="#080408"/><circle cx="46" cy="28" r="2.5" fill="#9b30d0" opacity="0.9"/><circle cx="46" cy="27" r="1" fill="#e0a0ff"/><path d="M26 20 Q20 12 14 10" stroke="#5a2060" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M54 20 Q60 12 66 10" stroke="#5a2060" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M18 52 Q8 58 6 68" stroke="#1a0a1a" stroke-width="5" fill="none"/><path d="M62 52 Q72 58 74 68" stroke="#1a0a1a" stroke-width="5" fill="none"/><path d="M30 62 Q26 70 28 76" stroke="#1a0a1a" stroke-width="3" fill="none"/><path d="M50 62 Q54 70 52 76" stroke="#1a0a1a" stroke-width="3" fill="none"/></svg>`,

  grotesque_guardians: `<svg viewBox="0 0 80 80"><rect x="6" y="28" width="30" height="32" rx="4" fill="#2a2828" stroke="#5a5858" stroke-width="1.5"/><rect x="10" y="54" width="10" height="14" rx="3" fill="#222020"/><rect x="22" y="54" width="10" height="14" rx="3" fill="#222020"/><rect x="8" y="12" width="26" height="18" rx="5" fill="#2a2828" stroke="#5a5858" stroke-width="1.5"/><circle cx="16" cy="20" r="3" fill="#0a0808"/><circle cx="16" cy="20" r="1.5" fill="#c9873e" opacity="0.9"/><circle cx="28" cy="20" r="3" fill="#0a0808"/><circle cx="28" cy="20" r="1.5" fill="#c9873e" opacity="0.9"/><path d="M10 12 L8 6 M20 10 L20 4 M30 12 L32 6" stroke="#5a5858" stroke-width="1.5"/><rect x="44" y="24" width="32" height="36" rx="5" fill="#282a28" stroke="#585a58" stroke-width="1.5"/><rect x="48" y="54" width="12" height="16" rx="3" fill="#202220"/><rect x="60" y="54" width="12" height="16" rx="3" fill="#202220"/><rect x="46" y="8" width="28" height="20" rx="5" fill="#282a28" stroke="#585a58" stroke-width="1.5"/><circle cx="54" cy="16" r="3" fill="#080808"/><circle cx="54" cy="16" r="1.5" fill="#4a88cc" opacity="0.9"/><circle cx="66" cy="16" r="3" fill="#080808"/><circle cx="66" cy="16" r="1.5" fill="#4a88cc" opacity="0.9"/><path d="M48 8 L46 2 M60 6 L60 0 M72 8 L74 2" stroke="#585a58" stroke-width="1.5"/></svg>`,

});

// console.log('[Ashfall] Content Expansion v9.5 loaded:');
// console.log('  Crypts warlords:', Object.keys(CRYPTS_WARLORDS).length);
// console.log('  Inferno monsters:', ['jal_nib','jal_mejrah','jal_ak','jal_ak_small','jal_imkot','jal_xil','jal_zek','ember_titan','tzkal_zuk'].filter(id=>GAME_DATA.monsters[id]).length);
// console.log('  Slayer bosses:', GAME_DATA.slayerBosses.length);
// console.log('  New art registered:', ['maldrak','serath','veyra','grothak','thorne','aluric','crystalline_hunllef','corrupted_hunllef','cerberus','kraken','smoke_devil_boss','void_mother','grotesque_guardians','jal_nib','jal_mejrah','jal_ak','jal_imkot','jal_xil','jal_zek','ember_titan','tzkal_zuk'].filter(id=>GAME_DATA.monsterArt[id]).length);

// ================================================================
// UI RENDERING — Ashen Crypts, Gauntlet, Inferno, Slayer Bosses
// ================================================================

// ── DROP TABLE HELPER ───────────────────────────────────────────
function _renderDrops(drops) {
  if (!drops || !drops.length) return '';
  let html = '<div class="ce-drops"><div class="ce-drops-title">Drop Table</div><div class="ce-drops-grid">';
  for (const d of drops) {
    const item = GAME_DATA.items[d.item];
    if (!item) continue;
    const pct = d.chance >= 1 ? '100%' : d.chance >= 0.1 ? Math.round(d.chance*100)+'%' : '1/'+Math.round(1/d.chance);
    const rarity = item.rarity || (d.chance >= 0.5 ? 'common' : d.chance >= 0.1 ? 'uncommon' : d.chance >= 0.01 ? 'rare' : 'legendary');
    html += `<div class="ce-drop-row ce-rarity-${rarity}"><span class="ce-drop-name">${item.name}</span><span class="ce-drop-qty">x${d.qty}</span><span class="ce-drop-rate">${pct}</span></div>`;
  }
  html += '</div></div>';
  return html;
}

// ── MONSTER STAT CARD ───────────────────────────────────────────
function _renderMonsterCard(mId) {
  const m = GAME_DATA.monsters[mId];
  if (!m) return '';
  const art = GAME_DATA.monsterArt[mId] ? `<div class="ce-mc-art">${GAME_DATA.monsterArt[mId]}</div>` : '';
  return `<div class="ce-monster-card">
    ${art}
    <div class="ce-mc-info">
      <div class="ce-mc-name">${m.name}</div>
      <div class="ce-mc-stats"><span>Lv ${m.combatLevel}</span><span>HP: ${m.hp?.toLocaleString()}</span><span>Max Hit: ${m.maxHit}</span><span>Style: ${m.style}</span><span>Speed: ${m.attackSpeed}s</span></div>
      <div class="ce-mc-desc">${m.desc || ''}</div>
      ${_renderDrops(m.drops)}
    </div>
  </div>`;
}

// ── BARROWS ─────────────────────────────────────────────────────
UI.prototype.renderAshenCryptsPage = function(el) {
  const s = this.engine.state, b = s.ashen_crypts;
  const locked = this.engine.getCombatLevel() < GAME_DATA.ashen_crypts.levelReq;
  let html = this.header('Ashen Crypts','skull','Six warlords. Six crypts. One chest.', null);
  if (locked) { html += `<div class="toa-locked"><div class="toa-lock-title">Ashen Crypts</div><div class="toa-lock-desc">Requires combat level ${GAME_DATA.ashen_crypts.levelReq}.</div></div>`; el.innerHTML = html; return; }

  if (b?.active && b.between) {
    const nxt = CRYPTS_WARLORDS[GAME_DATA.ashen_crypts.brothers[b._nextBrother]];
    html += `<div class="toa-raid-screen"><div class="toa-between-overlay"><div class="toa-between-title">Next crypt...</div><div class="toa-between-boss">${nxt?.name||''}</div><div class="toa-between-timer">${Math.ceil(b.betweenTimer)}s</div><div class="toa-between-hint">${nxt?.desc||''}</div><div class="toa-death-count">Brothers killed: ${b.killed.length}/6</div></div></div>`;
    el.innerHTML = html; return;
  }
  if (b?.active && !b.chestOpen) {
    const bId = GAME_DATA.ashen_crypts.brothers[b.brother], boss = CRYPTS_WARLORDS[bId], c = s.combat;
    html += `<div class="toa-raid-screen"><div class="toa-boss-display"><div class="toa-boss-art">${GAME_DATA.monsterArt[bId]||''}</div><div class="toa-boss-info-raid"><div class="toa-boss-name-raid">${boss.name}</div><div class="toa-boss-hp-bar"><div class="toa-boss-hp-fill" style="width:${Math.max(0,c.monsterHp/boss.hp*100)}%"></div></div><div class="toa-boss-hp-text">${Math.max(0,c.monsterHp).toLocaleString()} / ${boss.hp.toLocaleString()}</div></div></div><div class="ce-fight-info"><span>Style: ${boss.style}</span><span>Max Hit: ${boss.maxHit}</span><span>Brother ${b.brother+1}/6</span></div><p class="ce-boss-hint">${boss.desc}</p><div class="toa-player-status"><div class="toa-player-hp"><span>HP</span><div class="toa-player-hp-bar"><div class="toa-player-hp-fill" style="width:${Math.max(0,c.playerHp/this.engine.getMaxHp()*100)}%"></div></div><span>${c.playerHp}/${this.engine.getMaxHp()}</span></div></div><div class="toa-death-count">Brothers killed: ${b.killed.length}/6</div><button class="btn btn-sm btn-danger" onclick="game.leaveAshenCrypts()">Flee Crypts</button></div>`;
    el.innerHTML = html; return;
  }
  if (b?.chestOpen) {
    html += `<div class="toa-chest-screen"><div class="toa-chest-title" style="color:#cd7f32">CRYPTS CHEST</div><div class="toa-chest-stats"><span>Brothers: ${b.killed.length}/6</span><span>Completions: ${s.stats?.cryptsCompletions||0}</span></div><div class="toa-loot-grid">${b.loot.map(l=>{const it=GAME_DATA.items[l.item];return`<div class="toa-loot-item toa-rarity-${l.rarity}"><div class="toa-loot-name">${it?.name||l.item}</div><div class="toa-loot-qty">x${l.qty}</div></div>`;}).join('')}</div><button class="btn btn-sm" onclick="game.leaveAshenCrypts()">Leave Crypts</button></div>`;
    el.innerHTML = html; return;
  }
  // Entry
  const setInfo = {maldrak:'Low HP = more damage',serath:'+20% magic damage',veyra:'+15% ranged accuracy',grothak:'25% lifesteal on hit',thorne:'+30% damage reduction',aluric:'25% ignore defence'};
  html += `<div class="toa-entry-screen"><div class="toa-entry-stats"><div class="toa-stat"><span class="toa-stat-n">${s.stats?.cryptsCompletions||0}</span><span class="toa-stat-l">Completions</span></div><div class="toa-stat"><span class="toa-stat-n">6</span><span class="toa-stat-l">Brothers</span></div><div class="toa-stat"><span class="toa-stat-n">1/24</span><span class="toa-stat-l">Piece Rate</span></div></div><div class="ce-section-title">The Brothers</div>`;
  for (const bId of GAME_DATA.ashen_crypts.brothers) {
    const boss = CRYPTS_WARLORDS[bId];
    html += `<div class="ce-boss-card"><div class="ce-bc-art">${GAME_DATA.monsterArt[bId]?`<div style="width:56px;height:56px">${GAME_DATA.monsterArt[bId]}</div>`:''}</div><div class="ce-bc-info"><div class="ce-bc-name">${boss.name}</div><div class="ce-bc-stats">Lv${boss.combatLevel} · ${boss.hp.toLocaleString()} HP · ${boss.style} · Max hit ${boss.maxHit}</div><div class="ce-bc-desc">${boss.desc}</div><div class="ce-bc-set">Set bonus: <strong>${setInfo[bId]||''}</strong></div><div class="ce-bc-drops">Drops: Helm, Platebody, Platelegs, ${_bWeaponNames[bId]}</div></div></div>`;
  }
  html += `<div class="ce-section-title">Chest Loot</div><div class="ce-drops"><div class="ce-drops-grid"><div class="ce-drop-row ce-rarity-common"><span class="ce-drop-name">Death Rune</span><span class="ce-drop-qty">x80</span><span class="ce-drop-rate">80%</span></div><div class="ce-drop-row ce-rarity-common"><span class="ce-drop-name">Blood Rune</span><span class="ce-drop-qty">x50</span><span class="ce-drop-rate">70%</span></div><div class="ce-drop-row ce-rarity-uncommon"><span class="ce-drop-name">Void Bolt</span><span class="ce-drop-qty">x30</span><span class="ce-drop-rate">60%</span></div><div class="ce-drop-row ce-rarity-rare"><span class="ce-drop-name">Dragon Bones</span><span class="ce-drop-qty">x3</span><span class="ce-drop-rate">40%</span></div></div></div><div class="toa-entry-warning">Kill all 6 brothers then loot the chest. Each brother killed adds a 1/24 roll for their armor.</div><button class="btn btn-lg toa-enter-btn" onclick="game.startAshenCrypts()">Enter the Ashen Crypts</button></div>`;
  el.innerHTML = html;
};

// ── GAUNTLET ────────────────────────────────────────────────────
UI.prototype.renderGauntletPage = function(el) {
  const s = this.engine.state, g = s.gauntlet;
  const locked = this.engine.getCombatLevel() < GAME_DATA.gauntlet.levelReq;
  let html = this.header('The Gauntlet','dungeon','Solo challenge. Slay the Hunllef.',null);
  if (locked) { html += `<div class="toa-locked"><div class="toa-lock-title">Requires combat level ${GAME_DATA.gauntlet.levelReq}</div></div>`; el.innerHTML = html; return; }
  if (g?.active && g.prep) {
    html += `<div class="toa-between-overlay"><div class="toa-between-title">Gathering Resources...</div><div class="toa-between-timer">${Math.ceil(g.prepTimer)}s</div><div class="toa-between-hint">Crafting crystalline gear...</div><button class="btn btn-sm btn-danger" style="margin-top:1rem" onclick="game.leaveGauntlet()">Abandon</button></div>`;
    el.innerHTML = html; return;
  }
  if (g?.active && !g.complete) {
    const c = s.combat, boss = GAME_DATA.monsters[g.bossId];
    html += `<div class="toa-raid-screen"><div class="toa-boss-display"><div class="toa-boss-art">${GAME_DATA.monsterArt[g.bossId]||''}</div><div class="toa-boss-info-raid"><div class="toa-boss-name-raid">${boss.name}</div><div class="toa-boss-hp-bar"><div class="toa-boss-hp-fill" style="width:${Math.max(0,c.monsterHp/boss.hp*100)}%"></div></div><div class="toa-boss-hp-text">${Math.max(0,c.monsterHp).toLocaleString()} / ${boss.hp.toLocaleString()}</div></div></div><div class="ce-fight-info"><span>Style: ${boss.style}</span><span>Max Hit: ${boss.maxHit}</span><span>Speed: ${boss.attackSpeed}s</span></div><p class="ce-boss-hint">${boss.desc}</p><div class="toa-player-status"><div class="toa-player-hp"><span>HP</span><div class="toa-player-hp-bar"><div class="toa-player-hp-fill" style="width:${Math.max(0,c.playerHp/this.engine.getMaxHp()*100)}%"></div></div><span>${c.playerHp}/${this.engine.getMaxHp()}</span></div></div><button class="btn btn-sm btn-danger" onclick="game.leaveGauntlet()">Flee</button></div>`;
    el.innerHTML = html; return;
  }
  if (g?.complete) {
    html += `<div class="toa-chest-screen"><div class="toa-chest-title" style="color:${g.corrupted?'#cc3030':'#88ccff'}">${g.corrupted?'CORRUPTED ':''}GAUNTLET COMPLETE</div><div class="toa-loot-grid">${(g.loot||[]).map(l=>{const it=GAME_DATA.items[l.item];return`<div class="toa-loot-item"><div class="toa-loot-name">${it?.name||l.item}</div><div class="toa-loot-qty">x${l.qty}</div></div>`;}).join('')}</div><button class="btn btn-sm" onclick="game.leaveGauntlet()">Leave</button></div>`;
    el.innerHTML = html; return;
  }
  // Entry
  html += `<div class="toa-entry-screen"><div class="toa-entry-stats"><div class="toa-stat"><span class="toa-stat-n">${s.stats?.gauntletCompletions||0}</span><span class="toa-stat-l">Completions</span></div><div class="toa-stat"><span class="toa-stat-n">Lv80+</span><span class="toa-stat-l">Requirement</span></div></div>`;
  html += `<div class="ce-section-title">Bosses</div>${_renderMonsterCard('crystalline_hunllef')}${_renderMonsterCard('corrupted_hunllef')}`;
  html += `<div class="ce-section-title">Normal Mode Rewards</div><div class="ce-drops"><div class="ce-drops-grid">${GAME_DATA.gauntlet.normalRewards.map(d=>{const it=GAME_DATA.items[d.item];if(!it)return'';const pct=d.chance>=1?'100%':d.chance>=0.1?Math.round(d.chance*100)+'%':'1/'+Math.round(1/d.chance);return`<div class="ce-drop-row"><span class="ce-drop-name">${it.name}</span><span class="ce-drop-qty">x${d.qty}</span><span class="ce-drop-rate">${pct}</span></div>`;}).join('')}</div></div>`;
  html += `<div class="ce-section-title">Corrupted Mode Rewards</div><div class="ce-drops"><div class="ce-drops-grid">${GAME_DATA.gauntlet.corruptedRewards.map(d=>{const it=GAME_DATA.items[d.item];if(!it)return'';const pct=d.chance>=1?'100%':d.chance>=0.1?Math.round(d.chance*100)+'%':'1/'+Math.round(1/d.chance);return`<div class="ce-drop-row"><span class="ce-drop-name">${it.name}</span><span class="ce-drop-qty">x${d.qty}</span><span class="ce-drop-rate">${pct}</span></div>`;}).join('')}</div></div>`;
  html += `<div class="toa-entry-warning">Solo challenge. 15s prep phase then fight the Hunllef. The boss switches attack styles — pray accordingly.</div><div style="display:flex;gap:8px;justify-content:center;margin-top:1rem"><button class="btn btn-lg toa-enter-btn" onclick="game.startGauntlet(false)">Normal</button><button class="btn btn-lg toa-enter-btn" style="border-color:#cc3030" onclick="game.startGauntlet(true)">Corrupted</button></div></div>`;
  el.innerHTML = html;
};

// ── INFERNO ─────────────────────────────────────────────────────
UI.prototype.renderInfernoPage = function(el) {
  const s = this.engine.state, inf = s.inferno;
  const locked = this.engine.getCombatLevel() < GAME_DATA.inferno.levelReq;
  let html = this.header('The Inferno','combat','69 waves. TzKal-Zuk awaits. Earn the Infernal Cape.',null);
  if (locked) { html += `<div class="toa-locked"><div class="toa-lock-title">Requires combat level ${GAME_DATA.inferno.levelReq}</div></div>`; el.innerHTML = html; return; }

  if (inf?.active && inf.between) {
    html += `<div class="toa-between-overlay"><div class="toa-between-title">Next wave...</div><div class="toa-between-timer">${Math.ceil(inf.betweenTimer)}s</div><div class="toa-death-count">Wave ${(inf.wave||0)+1}/69</div></div>`;
    el.innerHTML = html; return;
  }
  if (inf?.active && !inf.complete) {
    const c = s.combat, mon = GAME_DATA.monsters[c.monster];
    const elapsed = Math.floor((Date.now() - inf.startTime)/1000);
    html += `<div class="toa-raid-screen"><div class="toa-raid-header"><div class="toa-death-count">Wave ${(inf.wave||0)+1}/69</div><div class="toa-raid-timer">${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')}</div></div><div class="toa-boss-display"><div class="toa-boss-art">${GAME_DATA.monsterArt[c.monster]||''}</div><div class="toa-boss-info-raid"><div class="toa-boss-name-raid">${mon?.name||'???'}</div><div class="toa-boss-hp-bar"><div class="toa-boss-hp-fill" style="width:${Math.max(0,c.monsterHp/(mon?.hp||1)*100)}%"></div></div><div class="toa-boss-hp-text">${Math.max(0,c.monsterHp).toLocaleString()} / ${(mon?.hp||0).toLocaleString()}</div></div></div><div class="ce-fight-info"><span>Style: ${mon?.style||'?'}</span><span>Max Hit: ${mon?.maxHit||'?'}</span><span>Cb Lv: ${mon?.combatLevel||'?'}</span></div><p class="ce-boss-hint">${mon?.desc||''}</p><div class="toa-player-status"><div class="toa-player-hp"><span>HP</span><div class="toa-player-hp-bar"><div class="toa-player-hp-fill" style="width:${Math.max(0,c.playerHp/this.engine.getMaxHp()*100)}%"></div></div><span>${c.playerHp}/${this.engine.getMaxHp()}</span></div></div><button class="btn btn-sm btn-danger" onclick="game.leaveInferno()">Flee</button></div>`;
    el.innerHTML = html; return;
  }
  if (inf?.complete) {
    html += `<div class="toa-chest-screen"><div class="toa-chest-title" style="color:#ff6030">THE INFERNO IS COMPLETE</div><div class="toa-loot-grid">${(inf.loot||[]).map(l=>{const it=GAME_DATA.items[l.item];return`<div class="toa-loot-item toa-rarity-mythic"><div class="toa-loot-name">${it?.name||l.item}</div></div>`;}).join('')}</div><button class="btn btn-sm" onclick="game.leaveInferno()">Leave</button></div>`;
    el.innerHTML = html; return;
  }
  // Entry — wave breakdown with full monster details
  const waveGroups = [
    { label:'Waves 1–9', monsters:['jal_nib','jal_mejrah'], desc:'Nibblers attack pillars — kill first. Bats use magic.' },
    { label:'Waves 10–19', monsters:['jal_mejrah','jal_ak'], desc:'Bats and Blobs. Blobs split into 2 smaller blobs on death.' },
    { label:'Waves 20–34', monsters:['jal_ak','jal_imkot'], desc:'Blobs and Melee Brutes. Brutes hit extremely hard.' },
    { label:'Waves 35–49', monsters:['jal_imkot','jal_xil'], desc:'Brutes and Rangers. Protect from Ranged against Rangers.' },
    { label:'Waves 50–61', monsters:['jal_xil','jal_zek'], desc:'Rangers and Magers. Protect from Magic. Magers heal allies.' },
    { label:'Waves 62–65', monsters:['jal_zek'], desc:'Pure Mager waves. Devastating magic damage.' },
    { label:'Waves 66–68', monsters:['ember_titan'], desc:'Ember Titan assault. Multiple titans attacking simultaneously. Prayer flick all three.' },
    { label:'Wave 69: FINAL', monsters:['tzkal_zuk'], desc:'TzKal-Zuk. 20,000 HP. Max hit 250. The hardest boss in the game.' },
  ];
  html += `<div class="toa-entry-screen"><div class="toa-entry-stats"><div class="toa-stat"><span class="toa-stat-n">${s.stats?.infernoCompletions||0}</span><span class="toa-stat-l">Completions</span></div><div class="toa-stat"><span class="toa-stat-n">69</span><span class="toa-stat-l">Waves</span></div><div class="toa-stat"><span class="toa-stat-n">Lv100+</span><span class="toa-stat-l">Required</span></div></div><div class="ce-section-title">Wave Breakdown</div>`;
  for (const wg of waveGroups) {
    const isZuk = wg.monsters.includes('tzkal_zuk');
    html += `<div class="ce-boss-card ${isZuk?'ce-boss-final':''}"><div class="ce-bc-art">${GAME_DATA.monsterArt[wg.monsters[0]]?`<div style="width:48px;height:48px">${GAME_DATA.monsterArt[wg.monsters[0]]}</div>`:''}</div><div class="ce-bc-info"><div class="ce-bc-name">${wg.label}</div><div class="ce-bc-stats">${wg.monsters.map(mId=>{const m=GAME_DATA.monsters[mId];return m?`${m.name} (Lv${m.combatLevel}, ${m.hp}HP, ${m.style}, max hit ${m.maxHit})`:mId;}).join(' · ')}</div><div class="ce-bc-desc">${wg.desc}</div></div></div>`;
  }
  html += `<div class="ce-section-title">Rewards</div><div class="ce-drops"><div class="ce-drops-grid"><div class="ce-drop-row ce-rarity-mythic"><span class="ce-drop-name">Infernal Cape (best melee cape)</span><span class="ce-drop-qty">x1</span><span class="ce-drop-rate">100%</span></div><div class="ce-drop-row ce-rarity-mythic"><span class="ce-drop-name">Jal-Nib-Rek (pet)</span><span class="ce-drop-qty">x1</span><span class="ce-drop-rate">1/200</span></div></div></div><div class="toa-entry-warning">The hardest PvE content in Ashfall. Bring your best gear, full prayer, and plenty of food.</div><button class="btn btn-lg toa-enter-btn" style="border-color:#c44020" onclick="game.startInferno()">Enter the Inferno</button></div>`;
  el.innerHTML = html;
};

// ── SLAYER BOSSES ───────────────────────────────────────────────
UI.prototype.renderSlayerBossesPage = function(el) {
  const s = this.engine.state;
  const slayerLvl = s.skills.slayer?.level || 1;
  let html = this.header('Slayer Bosses','skull','Boss variants of slayer creatures. Slayer level required.',null);
  for (const sb of GAME_DATA.slayerBosses) {
    const locked = slayerLvl < sb.slayerReq;
    const mon = GAME_DATA.monsters[sb.id];
    const kc = s.stats?.bossKills?.[sb.id] || 0;
    html += `<div class="ce-boss-card ${locked?'locked':''}">
      <div class="ce-bc-art">${GAME_DATA.monsterArt[sb.id]?`<div style="width:64px;height:64px">${GAME_DATA.monsterArt[sb.id]}</div>`:''}</div>
      <div class="ce-bc-info">
        <div class="ce-bc-name">${sb.name} <span style="color:var(--text-dim);font-size:11px;font-family:Crimson Text,serif">KC: ${kc}</span></div>
        <div class="ce-bc-stats">Lv${mon?.combatLevel} · ${mon?.hp?.toLocaleString()} HP · ${mon?.style} · Max Hit ${mon?.maxHit} · Speed ${mon?.attackSpeed}s</div>
        <div class="ce-bc-desc">${sb.desc}</div>
        <div class="ce-bc-set">Slayer Requirement: <strong>Level ${sb.slayerReq}</strong> ${locked?`<span style="color:#cc6666">(You: ${slayerLvl})</span>`:` <span style="color:#7dcc44">(Met)</span>`}</div>
        ${_renderDrops(mon?.drops)}
        <div style="margin-top:8px"><button class="btn btn-sm" ${locked?'disabled':''} onclick="game.startCombat(null,'${sb.id}')">Fight</button></div>
      </div>
      ${locked?`<div class="locked-overlay">Slayer Lv ${sb.slayerReq}</div>`:''}
    </div>`;
  }
  el.innerHTML = html;
};

// ================================================================
// ASHFALL IDLE — Raids Content Expansion v10.0
// Complete drop tables for Chambers of Ash + Theatre upgrades
// New raid-exclusive items + improved potion system
// Blaze tier Firebase enables full multiplayer raid infrastructure
// ================================================================

// ── CHAMBERS OF ASH — COMPLETE DROP TABLES ────────────────────
// Every boss now has signature drops + shared raid loot
const COA_BOSS_DROPS = {
  shambling_mound: [
    // Unique to this boss
    {item:'verdant_staff',      qty:1, chance:0.15, rarity:'epic'},
    {item:'woven_gloves',       qty:1, chance:0.18, rarity:'rare'},
    {item:'shambling_seeds',    qty:3, chance:0.40, rarity:'uncommon'},
    // Shared raid materials
    {item:'runite_bar',         qty:6, chance:0.60, rarity:'common'},
    {item:'death_rune',         qty:80, chance:0.70, rarity:'common'},
    {item:'dragonite_bar',      qty:2, chance:0.35, rarity:'rare'},
    {item:'ragshard',           qty:2, chance:0.25, rarity:'uncommon'},
    {item:'ancient_essence',    qty:1, chance:0.12, rarity:'epic'},
  ],
  ash_vanguard: [
    // Unique drops
    {item:'vanguard_helm',      qty:1, chance:0.20, rarity:'epic'},
    {item:'vanguard_chestplate',qty:1, chance:0.15, rarity:'epic'},
    {item:'vanguard_legs',      qty:1, chance:0.15, rarity:'epic'},
    {item:'warrior_blood',      qty:2, chance:0.30, rarity:'uncommon'},
    // Shared materials
    {item:'blood_rune',         qty:100, chance:0.75, rarity:'common'},
    {item:'dragonite_bar',      qty:3, chance:0.50, rarity:'rare'},
    {item:'celestial_fragment', qty:1, chance:0.20, rarity:'epic'},
    {item:'ancient_essence',    qty:2, chance:0.15, rarity:'epic'},
  ],
  tekton_forgeborn: [
    // Unique drops — smithing/crafting focus
    {item:'forgemaster_hammer', qty:1, chance:0.12, rarity:'legendary'},
    {item:'mythril_bar',        qty:4, chance:0.40, rarity:'rare'},
    {item:'orichalcum_ore',     qty:8, chance:0.50, rarity:'uncommon'},
    {item:'forge_dust',         qty:5, chance:0.60, rarity:'common'},
    {item:'inferno_core',       qty:1, chance:0.08, rarity:'epic'},
    // Shared materials
    {item:'runite_bar',         qty:8, chance:0.65, rarity:'common'},
    {item:'dragonite_bar',      qty:4, chance:0.55, rarity:'rare'},
    {item:'ancient_essence',    qty:2, chance:0.18, rarity:'epic'},
  ],
  ice_weaver: [
    // Unique drops — magic/ranged focus
    {item:'shard_of_frostbind', qty:1, chance:0.18, rarity:'epic'},
    {item:'frozen_sceptre',     qty:1, chance:0.10, rarity:'legendary'},
    {item:'frosted_robes',      qty:1, chance:0.15, rarity:'epic'},
    {item:'crystalline_shard',  qty:4, chance:0.45, rarity:'uncommon'},
    {item:'eternal_snowflake',  qty:1, chance:0.08, rarity:'epic'},
    // Shared materials
    {item:'death_rune',         qty:120, chance:0.80, rarity:'common'},
    {item:'celestial_fragment', qty:2, chance:0.25, rarity:'epic'},
    {item:'ancient_essence',    qty:3, chance:0.22, rarity:'epic'},
  ],
  great_olm: [
    // Final boss — highest tier drops
    {item:'olm_eye',            qty:1, chance:1.0, rarity:'unique'},
    {item:'primordial_staff',   qty:1, chance:0.20, rarity:'legendary'},
    {item:'the_inquisitors_mace',qty:1, chance:0.15, rarity:'legendary'},
    {item:'ancestral_robe',     qty:1, chance:0.12, rarity:'legendary'},
    {item:'dragon_crossbow',    qty:1, chance:0.10, rarity:'legendary'},
    // Unique drops only from Olm
    {item:'olm_heart',          qty:1, chance:0.08, rarity:'unique'},
    {item:'twisted_bow',        qty:1, chance:0.05, rarity:'legendary'},
    // Guaranteed materials
    {item:'death_rune',         qty:200, chance:1.0, rarity:'common'},
    {item:'blood_rune',         qty:150, chance:1.0, rarity:'common'},
    {item:'dragonite_bar',      qty:6, chance:1.0, rarity:'rare'},
    {item:'celestial_fragment', qty:5, chance:1.0, rarity:'epic'},
    {item:'ancient_essence',    qty:4, chance:0.95, rarity:'epic'},
  ],
};

// Register Chambers bosses with drops
if (typeof COA_BOSSES !== 'undefined') {
  for (const [bossId, drops] of Object.entries(COA_BOSS_DROPS)) {
    if (COA_BOSSES[bossId]) {
      COA_BOSSES[bossId].drops = drops;
      if (GAME_DATA.monsters[bossId]) {
        GAME_DATA.monsters[bossId].drops = drops;
      }
    }
  }
}

// ── THEATRE OF ASH — ENHANCED DROPS ────────────────────────────
// Add unique boss drops to Theatre loot tables
if (GAME_DATA.theatreOfAsh && GAME_DATA.theatreOfAsh.lootTables) {
  // Enhanced Bronze tier (added items)
  GAME_DATA.theatreOfAsh.lootTables.bronze.push(
    {item:'elder_rune',         qty:5,   chance:0.15, rarity:'rare'},
    {item:'philosopher_stone',  qty:1,   chance:0.08, rarity:'epic'}
  );
  
  // Enhanced Silver tier
  GAME_DATA.theatreOfAsh.lootTables.silver.push(
    {item:'champion_scroll',    qty:1,   chance:0.12, rarity:'epic'},
    {item:'twisted_essence',    qty:2,   chance:0.25, rarity:'uncommon'},
    {item:'ancient_artifact',   qty:1,   chance:0.06, rarity:'legendary'}
  );
  
  // Enhanced Gold tier
  GAME_DATA.theatreOfAsh.lootTables.gold.push(
    {item:'hydra_tail',         qty:1,   chance:0.18, rarity:'epic'},
    {item:'primordial_shard',   qty:1,   chance:0.12, rarity:'epic'},
    {item:'mythic_token',       qty:1,   chance:0.08, rarity:'legendary'}
  );
  
  // Purple tier — add more unique chances
  GAME_DATA.theatreOfAsh.lootTables.purple.push(
    {item:'eternal_core',       qty:1,   chance:0.40, rarity:'epic'}
  );
  
  // Expand unique pool
  GAME_DATA.theatreOfAsh.lootTables.unique.push(
    {item:'sanguine_ornament',  chance:0.08},
    {item:'twisted_acorn',      chance:0.05},
    {item:'ancient_lamp',       chance:0.06}
  );
}

// ── RAID EXCLUSIVE ITEMS ──────────────────────────────────────
// New items only obtainable from raids
const RAID_ITEMS = {
  // Chambers exclusives
  verdant_staff: {
    id:'verdant_staff', name:'Verdant Staff', desc:'A twisted staff sprouting with poisonous vines.',
    type:'staff', rarity:'epic', slot:'2h',
    stats: {magicBonus:48, magicDefence:35, magicLevelReq:60},
    requires:{magic:60}, affinity:'jungle', onEquip(){} 
  },
  woven_gloves: {
    id:'woven_gloves', name:'Woven Gloves', desc:'Gloves woven from shambling mound fibers.',
    type:'gloves', rarity:'rare', slot:'hands',
    stats: {defenceBonus:22, magicDefence:18}, affinity:'nature'
  },
  vanguard_helm: {
    id:'vanguard_helm', name:'Vanguard Helm', desc:'Helm of an elite Vanguard warrior.',
    type:'helmet', rarity:'epic', slot:'head',
    stats: {defenceBonus:45, attackBonus:15, meleeLevelReq:65},
    requires:{melee:65}, affinity:'warrior'
  },
  forgemaster_hammer: {
    id:'forgemaster_hammer', name:'Forgemaster\'s Hammer', desc:'A legendary smithing hammer from Tekton\'s forge.',
    type:'weapon', rarity:'legendary', slot:'2h',
    stats: {attackBonus:82, strengthBonus:45, craftingBonus:30},
    requires:{crafting:75, melee:70}, affinity:'fire', onEquip(){}
  },
  frozen_sceptre: {
    id:'frozen_sceptre', name:'Frozen Sceptre', desc:'A sceptre forged from eternal ice.',
    type:'staff', rarity:'legendary', slot:'2h',
    stats: {magicBonus:75, magicDefence:55, magicLevelReq:75},
    requires:{magic:75}, affinity:'ice', onEquip(){}
  },
  primordial_staff: {
    id:'primordial_staff', name:'Primordial Staff', desc:'The ancient staff of the Great Olm itself.',
    type:'staff', rarity:'legendary', slot:'2h',
    stats: {magicBonus:95, magicDefence:65, spellDamage:0.15},
    requires:{magic:80}, affinity:'ancient', onEquip(){}
  },
  // Materials for raid crafting
  shambling_seeds: {
    id:'shambling_seeds', name:'Shambling Seeds', desc:'Seeds that twitch with unwilling life.',
    type:'resource', rarity:'uncommon', stackable:true
  },
  warrior_blood: {
    id:'warrior_blood', name:'Warrior Blood', desc:'Essence of fallen vanguards.',
    type:'resource', rarity:'uncommon', stackable:true
  },
  forge_dust: {
    id:'forge_dust', name:'Forge Dust', desc:'Metallic dust from Tekton\'s forging.',
    type:'resource', rarity:'common', stackable:true
  },
  crystalline_shard: {
    id:'crystalline_shard', name:'Crystalline Shard', desc:'A shard of eternal ice.',
    type:'resource', rarity:'uncommon', stackable:true
  },
  ancient_essence: {
    id:'ancient_essence', name:'Ancient Essence', desc:'Pure essence of the ancient world.',
    type:'resource', rarity:'epic', stackable:true
  },
  ragshard: {
    id:'ragshard', name:'Ragshard', desc:'Fragment of raid armor.',
    type:'resource', rarity:'uncommon', stackable:true
  },
  olm_eye: {
    id:'olm_eye', name:'Olm\'s Eye', desc:'The all-seeing eye of the Great Olm.',
    type:'resource', rarity:'unique', stackable:false
  },
  olm_heart: {
    id:'olm_heart', name:'Olm\'s Heart', desc:'The still-beating heart of the ancient guardian.',
    type:'resource', rarity:'unique', stackable:false
  },
};

// Register raid items if they don't exist
for (const [id, item] of Object.entries(RAID_ITEMS)) {
  if (!GAME_DATA.items[id]) {
    GAME_DATA.items[id] = { ...item };
  }
}

// ── IMPROVED POTION SYSTEM ────────────────────────────────────
// New high-tier potions with better buffs
const RAID_POTIONS = {
  supreme_strength: {
    id:'supreme_strength', name:'Supreme Strength Potion', desc:'Grants extreme strength.',
    type:'potion', rarity:'epic', craftLevel:85, craftXp:150,
    ingredients:{
      herblore_catalyst:1, strength_herb:3, dragon_tooth:2,
    },
    buff:{stat:'strengthBonus', value:20, duration:180},
    healAmount:0,
  },
  divine_magic: {
    id:'divine_magic', name:'Divine Magic Potion', desc:'Enhances magical power.',
    type:'potion', rarity:'epic', craftLevel:87, craftXp:160,
    ingredients:{
      herblore_catalyst:1, magic_herb:3, celestial_fragment:1,
    },
    buff:{stat:'magicBonus', value:25, duration:180},
    healAmount:0,
  },
  bastion_brew: {
    id:'bastion_brew', name:'Bastion Brew', desc:'Reduces incoming damage.',
    type:'potion', rarity:'epic', craftLevel:89, craftXp:170,
    ingredients:{
      herblore_catalyst:1, defence_herb:3, ragshard:2,
    },
    buff:{stat:'damageReduction', value:0.20, duration:150},
    healAmount:5,
  },
  twilight_elixir: {
    id:'twilight_elixir', name:'Twilight Elixir', desc:'Grants evasion and grace.',
    type:'potion', rarity:'epic', craftLevel:88, craftXp:165,
    ingredients:{
      herblore_catalyst:1, evasion_herb:3, crystalline_shard:2,
    },
    buff:{stat:'evasionBonus', value:15, duration:160},
    healAmount:3,
  },
  ancient_vigor: {
    id:'ancient_vigor', name:'Ancient Vigor Potion', desc:'Restores all vitality.',
    type:'potion', rarity:'legendary', craftLevel:92, craftXp:200,
    ingredients:{
      herblore_catalyst:2, ancient_essence:1, torstol:5,
    },
    buff:{stat:'lifeRestore', value:0.25, duration:120},
    healAmount:25,
  },
};

// Register potions
for (const [id, potion] of Object.entries(RAID_POTIONS)) {
  if (!GAME_DATA.items[id]) {
    GAME_DATA.items[id] = { ...potion };
  }
  // Add to herblore recipes
  if (!GAME_DATA.recipes.herblore) GAME_DATA.recipes.herblore = [];
  if (!GAME_DATA.recipes.herblore.find(r => r.result === id)) {
    GAME_DATA.recipes.herblore.push({
      result:id, qty:1, level:potion.craftLevel,
      xp:potion.craftXp, ingredients:potion.ingredients
    });
  }
}

// ── ENHANCED POTION BUFF SYSTEM ───────────────────────────────
// Fix: Ensure buff _maxDuration is set correctly and doesn't flash
GameEngine.prototype._applyPotionBuff = function(item) {
  if (!item.buff) return;
  
  // Check if buff already exists (refresh it instead of stacking)
  const existing = this.state.combat.activeBuffs.find(b => 
    b.stat === item.buff.stat
  );
  
  if (existing) {
    // Refresh duration instead of stacking
    existing.remaining = item.buff.duration || 120;
    existing._maxDuration = item.buff.duration || 120;
    existing.value = Math.max(existing.value, item.buff.value);
  } else {
    // Add new buff with proper max duration set
    const buff = {
      stat: item.buff.stat,
      value: item.buff.value,
      remaining: item.buff.duration || 120,
      _maxDuration: item.buff.duration || 120,  // ← FIX: Always set max
      type: 'time'
    };
    this.state.combat.activeBuffs.push(buff);
  }
  
  this.emit('buffApplied', {stat: item.buff.stat, duration: item.buff.duration});
};

// ── RAID RECIPE ADDITIONS ─────────────────────────────────────
// New crafting recipes using raid materials
const RAID_RECIPES = {
  crafting: [
    {
      result:'vanguard_shield', qty:1, level:72,
      ingredients:{adamantite_bar:2, ragshard:3, leather:4}, xp:180
    },
    {
      result:'verdant_boots', qty:1, level:68,
      ingredients:{shambling_seeds:2, cloth:3, leather:2}, xp:150
    },
  ],
  smithing: [
    {
      result:'dragonite_helmet', qty:1, level:80,
      ingredients:{dragonite_bar:3, runite_bar:2}, xp:220
    },
    {
      result:'orichalcum_plate', qty:1, level:85,
      ingredients:{orichalcum_ore:6, mythril_bar:2, forge_dust:4}, xp:280
    },
  ],
};

// Register raid recipes
for (const [skill, recipes] of Object.entries(RAID_RECIPES)) {
  if (!GAME_DATA.recipes[skill]) GAME_DATA.recipes[skill] = [];
  for (const recipe of recipes) {
    if (!GAME_DATA.recipes[skill].find(r => r.result === recipe.result)) {
      GAME_DATA.recipes[skill].push(recipe);
    }
  }
}

// ── RAID ACHIEVEMENTS ─────────────────────────────────────────
const RAID_ACHIEVEMENTS = [
  {
    id:'chambers_bronze', name:'Ashvault Explorer', desc:'Complete Chambers of Ash on Bronze difficulty.',
    category:'raids', icon:'⛓', reward:'500 QP', points:10
  },
  {
    id:'chambers_gold', name:'Ashvault Conqueror', desc:'Complete Chambers of Ash on Gold difficulty.',
    category:'raids', icon:'⛓', reward:'2000 QP', points:30
  },
  {
    id:'olm_slayer', name:'Olm\'s Bane', desc:'Defeat the Great Olm.',
    category:'raids', icon:'⚔', reward:'5000 QP', points:50
  },
  {
    id:'theatre_purple', name:'Theatre Master', desc:'Complete Theatre of Ash on Purple difficulty.',
    category:'raids', icon:'🎭', reward:'3000 QP', points:40
  },
];

// Register achievements
if (!GAME_DATA.achievements) GAME_DATA.achievements = [];
for (const ach of RAID_ACHIEVEMENTS) {
  if (!GAME_DATA.achievements.find(a => a.id === ach.id)) {
    GAME_DATA.achievements.push(ach);
  }
}

// ── LOGGING ────────────────────────────────────────
if (window._ASHFALL_DEBUG) {
  console.log('[Ashfall] Raids Content Expansion v10.0 loaded');
  console.log('  Chambers bosses: 5 with complete drop tables');
  console.log('  New raid items: ' + Object.keys(RAID_ITEMS).length);
  console.log('  New raid potions: ' + Object.keys(RAID_POTIONS).length);
  console.log('  New raid recipes: ' + Object.values(RAID_RECIPES).reduce((a,b)=>a+b.length,0));
  console.log('  New achievements: ' + RAID_ACHIEVEMENTS.length);
}
