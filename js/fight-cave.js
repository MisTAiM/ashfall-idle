// ============================================================
// ASHFALL IDLE — THE FIGHT CAVE (TzHaar Fight Cave Adaptation)
// 63 waves. No shortcuts. Earn the Fire Cape.
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
  desc: 'A volcanic arena of 63 waves. Death resets all progress. Only those who conquer TzTok-Jad earn the Fire Cape.',
  reward: 'fire_cape',
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
  {id:'fc_complete',name:'Fire Cape',             desc:'Complete the Fight Cave and earn the Fire Cape.',check:(g) => (g.stats.fightCaveCompletions||0) >= 1},
  {id:'fc_jad_10',  name:'Jad Hunter',            desc:'Complete the Fight Cave 10 times.',             check:(g) => (g.stats.fightCaveCompletions||0) >= 10}
);


// ── REMOVE FIRE CAPE FROM PHOENIX DROPS ────────────────────
// The Fire Cape should ONLY come from the Fight Cave
(function() {
  const phoenix = GAME_DATA.monsters.phoenix;
  if (phoenix && phoenix.drops) {
    phoenix.drops = phoenix.drops.filter(d => d.item !== 'fire_cape');
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

    this.emit('notification', {type:'info', text:'The Fight Cave begins. 63 waves stand between you and the Fire Cape.'});
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

    // Award Fire Cape
    this.addItem('fire_cape', 1);
    this.emit('notification', {type:'achievement', text:'FIGHT CAVE COMPLETE! You earned the Fire Cape!'});

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

// Fire Cape animated sprite reference for equipment display
GAME_DATA.monsterArt.fire_cape_item = `<svg viewBox="0 0 64 64"><defs><linearGradient id="fcg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ff4020"/><stop offset="50%" stop-color="#ff8030"/><stop offset="100%" stop-color="#ffcc40"/></linearGradient></defs><path d="M18 8 L46 8 L50 52 L32 60 L14 52Z" fill="url(#fcg)" stroke="#8a2010" stroke-width="1.5"/><path d="M32 8 L32 60" stroke="#ffcc40" stroke-width="1" opacity="0.5"/><path d="M22 20 Q28 24 26 32 Q24 36 28 40" stroke="#ffee80" stroke-width="1.5" fill="none" opacity="0.6"/><path d="M38 16 Q42 22 38 28 Q36 34 40 38" stroke="#ffee80" stroke-width="1.5" fill="none" opacity="0.6"/><ellipse cx="32" cy="12" rx="4" ry="2" fill="#ffcc40" opacity="0.4"/></svg>`;


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
    let msg = `${name} has conquered the Fight Cave and earned the Fire Cape! (Clear #${completions} | ${minutes}min`;
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
    fcBroadcast(`${name} surrendered the Fight Cave on wave ${wave}. The Fire Cape remains unclaimed.`);
  };

  console.log('[Ashfall] Fight Cave broadcasts enabled.');
}

// Apply patches IMMEDIATELY at script parse time.
// These scripts load AFTER engine.js (GameEngine exists) but BEFORE
// DOMContentLoaded fires (which is when game.init() runs).
// So we patch the prototype now, and init() will use the patched version.
applyFightCaveMixin();
patchFightCaveBroadcasts();
