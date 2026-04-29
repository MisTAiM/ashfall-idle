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
// These methods get added to the AshfallEngine prototype after engine.js loads.
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

    // Handle magma blob split
    if (monster.splitsOnDeath && monster.splitInto) {
      const splitCount = monster.splitCount || 2;
      const insertIdx = fc.currentMonsterIdx + 1;
      for (let i = 0; i < splitCount; i++) {
        fc.monsterQueue.splice(insertIdx, 0, monster.splitInto);
      }
      this.emit('notification', {type:'info', text:`${monster.name} splits into ${splitCount} smaller blobs!`});
    }

    // Move to next monster in queue
    fc.currentMonsterIdx++;

    if (fc.currentMonsterIdx >= fc.monsterQueue.length) {
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
      fc.betweenWaveTimer = 3.0; // 3 second pause between waves
      fc.waveComplete = true;

      const nextWaveNum = fc.currentWave + 1;
      const nextMonsters = fc.wavesData[fc.currentWave];
      const monsterNames = nextMonsters.map(id => GAME_DATA.monsters[id]?.name || id);
      const unique = [...new Set(monsterNames)];
      this.emit('notification', {type:'info', text:`Wave ${fc.currentWave}/63 cleared! Next: Wave ${nextWaveNum} — ${unique.join(', ')}`});

      // Determine phase tip
      const phase = GAME_DATA.fightCave.phases.find(p => nextWaveNum >= p.startWave && nextWaveNum <= p.endWave);
      if (phase && nextWaveNum === phase.startWave) {
        this.emit('notification', {type:'warn', text:`Phase: ${phase.name} — ${phase.tip}`});
      }

      this.emit('fightCaveWaveComplete', { wave: fc.currentWave, nextWave: nextWaveNum });
      return;
    }

    // Load next monster in current wave
    const nextId = fc.monsterQueue[fc.currentMonsterIdx];
    const next = GAME_DATA.monsters[nextId];
    if (!next) {
      this.emit('notification', {type:'warn', text:'Fight Cave error: missing monster data.'});
      this.fleeFightCave();
      return;
    }

    this.state.combat.monster = nextId;
    this.state.combat.monsterHp = next.hp;
    this.state.combat.monsterAttackTimer = 0;
    this.state.combat.statusEffects.monster = {};

    // Reset Jad phase if switching to Jad
    if (next.isJad) {
      fc.jadPhase = 'charging';
      fc.jadChargeTimer = 0;
      fc.jadHealersSpawned = false;
      fc.jadHealers = [];
      this.emit('notification', {type:'danger', text:'TzTok-Jad has arrived. Watch the attack telegraphs. Prayer flick or die.'});
      this.emit('jadSpawn');
    }

    this.emit('combatStart', { fightCave: true, wave: fc.currentWave + 1 });
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

    // Player attacks
    const playerSpeed = this.getPlayerAttackSpeed();
    c.playerAttackTimer += dt;
    if (c.playerAttackTimer >= playerSpeed) {
      c.playerAttackTimer -= playerSpeed;
      this.playerAttack(monster);
      this.drainPrayerPoints();
    }

    // Monster attacks
    let monsterSpeed = monster.attackSpeed * 0.7;
    c.monsterAttackTimer += dt;
    if (c.monsterAttackTimer >= monsterSpeed) {
      c.monsterAttackTimer -= monsterSpeed;
      this._fightCaveMonsterAttack(monster);
    }

    // Auto-eat after monster attack
    if (c.autoEat && c.playerHp > 0 && c.playerHp < this.getMaxHp() * 0.4) this.eatFood();

    // Check deaths
    if (c.monsterHp <= 0) {
      // Give combat XP
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

    // Molten Brute healing mechanic
    if (monster.healsAllies) {
      const mId = this.state.combat.monster;
      if (!this.state.fightCave.bruteHealCounters[mId]) this.state.fightCave.bruteHealCounters[mId] = 0;
      this.state.fightCave.bruteHealCounters[mId]++;

      if (this.state.fightCave.bruteHealCounters[mId] >= (monster.healInterval || 4)) {
        this.state.fightCave.bruteHealCounters[mId] = 0;
        const healAmt = monster.healAmount || 50;
        // Heal itself
        c.monsterHp = Math.min(monster.hp, c.monsterHp + healAmt);
        this.emit('notification', {type:'warn', text:`${monster.name} heals itself for ${healAmt} HP!`});
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
  if (typeof AshfallEngine === 'undefined') {
    console.warn('[FightCave] AshfallEngine not found. Retrying...');
    setTimeout(applyFightCaveMixin, 100);
    return;
  }

  // Add all mixin methods to the engine prototype
  for (const [name, fn] of Object.entries(FightCaveMixin)) {
    AshfallEngine.prototype[name] = fn;
  }

  // Patch migrateSave to init fight cave state
  const origMigrate = AshfallEngine.prototype.migrateSave;
  AshfallEngine.prototype.migrateSave = function(saveData) {
    const result = origMigrate.call(this, saveData);
    this.initFightCaveState();
    return result;
  };

  // Patch tickCombat to route to fight cave
  const origTickCombat = AshfallEngine.prototype.tickCombat;
  AshfallEngine.prototype.tickCombat = function(dt) {
    if (this.state.fightCave && this.state.fightCave.active) {
      this.tickFightCave(dt);
      return;
    }
    origTickCombat.call(this, dt);
  };

  // Patch onMonsterDeath to check fight cave
  const origOnMonsterDeath = AshfallEngine.prototype.onMonsterDeath;
  AshfallEngine.prototype.onMonsterDeath = function(monster, isWB) {
    if (this.state.fightCave && this.state.fightCave.active) {
      // Fight cave handles its own monster death — don't run normal logic
      return;
    }
    origOnMonsterDeath.call(this, monster, isWB);
  };

  // Patch onPlayerDeath to check fight cave
  const origOnPlayerDeath = AshfallEngine.prototype.onPlayerDeath;
  AshfallEngine.prototype.onPlayerDeath = function() {
    if (this.state.fightCave && this.state.fightCave.active) {
      this.onFightCavePlayerDeath();
      return;
    }
    origOnPlayerDeath.call(this);
  };

  // Patch stopCombat to also stop fight cave
  const origStopCombat = AshfallEngine.prototype.stopCombat;
  AshfallEngine.prototype.stopCombat = function() {
    // If fight cave is active, fleeing
    if (this.state.fightCave && this.state.fightCave.active) {
      this.fleeFightCave();
      return;
    }
    origStopCombat.call(this);
  };

  console.log('[Ashfall] Fight Cave system loaded — 7 monsters, 63 waves, 1 cape.');
}

// Auto-apply when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyFightCaveMixin);
} else {
  applyFightCaveMixin();
}
