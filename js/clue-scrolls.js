// ================================================================
// ASHFALL IDLE — clue-scrolls.js
// Complete Clue Scroll system: Easy / Medium / Hard / Elite tiers
// Collected from: thieving (lockpick drops), fishing, hunting,
// monster kills. Each scroll has 3-5 riddle steps. Completing
// all steps lets you open the reward casket.
// ================================================================

// ── CLUE SCROLL ITEMS ────────────────────────────────────────────
const _clueItems = {
  clue_scroll_easy:   { id:'clue_scroll_easy',   name:'Clue Scroll (Easy)',   type:'quest', rarity:'uncommon', sellPrice:0, sprite:'misc-scroll', desc:'A mysterious scroll. Solve the riddles for treasure. Easy tier.' },
  clue_scroll_medium: { id:'clue_scroll_medium',  name:'Clue Scroll (Medium)', type:'quest', rarity:'rare',     sellPrice:0, sprite:'misc-scroll', desc:'A clue scroll with harder riddles. Medium tier.' },
  clue_scroll_hard:   { id:'clue_scroll_hard',    name:'Clue Scroll (Hard)',   type:'quest', rarity:'epic',     sellPrice:0, sprite:'misc-scroll', desc:'A complex clue scroll. Hard tier — substantial rewards.' },
  clue_scroll_elite:  { id:'clue_scroll_elite',   name:'Clue Scroll (Elite)',  type:'quest', rarity:'mythic',   sellPrice:0, sprite:'misc-scroll', desc:'The rarest clue. Elite tier — legendary rewards possible.' },
  casket_easy:        { id:'casket_easy',          name:'Reward Casket (Easy)',   type:'special', rarity:'uncommon', sellPrice:100,  sprite:'misc-coin',  desc:'A reward casket from a completed easy clue. Open for loot!' },
  casket_medium:      { id:'casket_medium',        name:'Reward Casket (Medium)', type:'special', rarity:'rare',     sellPrice:300,  sprite:'misc-coin',  desc:'A reward casket from a completed medium clue.' },
  casket_hard:        { id:'casket_hard',          name:'Reward Casket (Hard)',   type:'special', rarity:'epic',     sellPrice:700,  sprite:'misc-coin',  desc:'A reward casket from a hard clue.' },
  casket_elite:       { id:'casket_elite',         name:'Reward Casket (Elite)',  type:'special', rarity:'mythic',   sellPrice:2000, sprite:'misc-coin',  desc:'A reward casket from an elite clue. Extremely rare loot inside.' },
};
for (const [id, def] of Object.entries(_clueItems)) {
  if (!GAME_DATA.items[id]) GAME_DATA.items[id] = { id, ...def };
}

// ── CLUE SCROLL DEFINITIONS ──────────────────────────────────────
GAME_DATA.clueScrolls = {
  easy: {
    id: 'easy',
    label: 'Easy',
    color: '#d4a83a',
    steps: 3,
    casket: 'casket_easy',
    // Clue types: kill (slay N of monster), skill (reach level), gather (get item), craft (make item)
    cluePool: [
      { id:'e_kill_goblin',   type:'kill',   monster:'goblin',           qty:10,  desc:'The small green menace lurks in the ruins. Slay 10 Goblins.' },
      { id:'e_kill_bandit',   type:'kill',   monster:'bandit',           qty:5,   desc:'Outlaws prey on the weak. Defeat 5 Bandits.' },
      { id:'e_gather_oak',    type:'gather', item:'oak_log',             qty:20,  desc:'The old woodcutter spoke of oak groves to the north. Bring 20 Oak Logs.' },
      { id:'e_gather_coal',   type:'gather', item:'coal_ore',            qty:15,  desc:'The furnace hungers. Gather 15 Coal Ore.' },
      { id:'e_gather_shrimp', type:'gather', item:'raw_shrimp',          qty:25,  desc:'A fisherman left this clue. Catch 25 Shrimp.' },
      { id:'e_craft_bronze',  type:'craft',  item:'bronze_sword',        qty:1,   desc:'The armourer left notes. Forge a Bronze Sword.' },
      { id:'e_skill_atk',     type:'skill',  skill:'attack',             level:10, desc:'The warrior\'s path demands discipline. Reach Attack level 10.' },
      { id:'e_skill_mining',  type:'skill',  skill:'mining',             level:10, desc:'The miners guild keeps secrets. Reach Mining level 10.' },
      { id:'e_gather_herb',   type:'gather', item:'guam_leaf',           qty:5,   desc:'The herbalist left a trail of green. Find 5 Guam Leaves.' },
      { id:'e_kill_rat',      type:'kill',   monster:'rat',              qty:15,  desc:'Pest control pays. Slay 15 Rats.' },
      { id:'e_gather_copper', type:'gather', item:'copper_ore',          qty:20,  desc:'The old mine holds copper. Mine 20 Copper Ore.' },
      { id:'e_gather_bones',  type:'gather', item:'bones',               qty:10,  desc:'The altar demands sacrifice. Bring 10 Bones.' },
    ],
    rewards: [
      { item:'coins',         qty:500,  weight:40 },
      { item:'coins',         qty:1000, weight:20 },
      { item:'iron_ore',      qty:50,   weight:15 },
      { item:'steel_bar',     qty:10,   weight:10 },
      { item:'mithril_ore',   qty:20,   weight:8 },
      { item:'iron_sword',    qty:1,    weight:5 },
      { item:'clue_scroll_medium', qty:1, weight:2 },
    ],
  },
  medium: {
    id: 'medium',
    label: 'Medium',
    color: '#4a90d4',
    steps: 4,
    casket: 'casket_medium',
    cluePool: [
      { id:'m_kill_warrior',  type:'kill',   monster:'warrior',          qty:20,  desc:'The warriors defend the pass. Defeat 20 Warriors.' },
      { id:'m_kill_dragon',   type:'kill',   monster:'dragon',           qty:3,   desc:'Dragon-fire scorches the eastern peaks. Slay 3 Dragons.' },
      { id:'m_gather_willow', type:'gather', item:'willow_log',          qty:50,  desc:'Follow the river bend. Bring 50 Willow Logs.' },
      { id:'m_gather_gold',   type:'gather', item:'gold_ore',            qty:20,  desc:'The goldsmith knows the value of patience. Mine 20 Gold Ore.' },
      { id:'m_craft_mithril', type:'craft',  item:'mithril_sword',       qty:1,   desc:'Only true smiths may carry the mithril blade. Forge one.' },
      { id:'m_skill_thieving',type:'skill',  skill:'thieving',           level:30, desc:'The guild of shadows demands proof. Reach Thieving 30.' },
      { id:'m_skill_crafting',type:'skill',  skill:'crafting',           level:20, desc:'The jeweler left a trail. Reach Crafting 20.' },
      { id:'m_gather_flax',   type:'gather', item:'flax',                qty:40,  desc:'The bowyer needs materials. Bring 40 Flax.' },
      { id:'m_kill_hollow',   type:'kill',   monster:'hollow_soldier',   qty:10,  desc:'The undead march. Put down 10 Hollow Soldiers.' },
      { id:'m_craft_bow',     type:'craft',  item:'willow_shortbow',     qty:1,   desc:'String the supple wood. Craft a Willow Shortbow.' },
      { id:'m_gather_tuna',   type:'gather', item:'raw_tuna',            qty:30,  desc:'Deep waters hold secrets. Catch 30 Tuna.' },
      { id:'m_kill_guard',    type:'kill',   monster:'guard',            qty:5,   desc:'The city guards patrol at dusk. Evade — or eliminate — 5.' },
    ],
    rewards: [
      { item:'coins',              qty:3000,  weight:30 },
      { item:'mithril_bar',        qty:10,    weight:20 },
      { item:'adamant_bar',        qty:5,     weight:15 },
      { item:'ranging_potion',     qty:3,     weight:10 },
      { item:'mithril_sword',      qty:1,     weight:8 },
      { item:'dragon_bones',       qty:10,    weight:5 },
      { item:'sapphire_ring',      qty:1,     weight:5 },
      { item:'clue_scroll_hard',   qty:1,     weight:7 },
    ],
  },
  hard: {
    id: 'hard',
    label: 'Hard',
    color: '#c44040',
    steps: 5,
    casket: 'casket_hard',
    cluePool: [
      { id:'h_kill_dragon',   type:'kill',   monster:'dragon',          qty:10,  desc:'The ancient wyrm has drawn blood. Slay 10 Dragons.' },
      { id:'h_kill_abyssal',  type:'kill',   monster:'abyssal_demon',   qty:5,   desc:'The void bleeds through. Close it by killing 5 Abyssal Demons.' },
      { id:'h_gather_yew',    type:'gather', item:'yew_log',            qty:100, desc:'Yew trees grow at the edge of the world. Bring 100 logs.' },
      { id:'h_gather_runite', type:'gather', item:'runite_ore',         qty:10,  desc:'Runite is the rarest of metals. Mine 10 Runite Ore.' },
      { id:'h_craft_admnt',   type:'craft',  item:'adamant_platebody',  qty:1,   desc:'The master smith challenges you. Forge an Adamant Platebody.' },
      { id:'h_skill_slayer',  type:'skill',  skill:'slayer',            level:50, desc:'The Slayer Master watches. Reach Slayer level 50.' },
      { id:'h_skill_magic',   type:'skill',  skill:'magic',             level:55, desc:'The arcane proves elusive. Reach Magic level 55.' },
      { id:'h_craft_diamond', type:'craft',  item:'diamond_ring',       qty:1,   desc:'Cut the perfect stone. Craft a Diamond Ring.' },
      { id:'h_kill_wyvern',   type:'kill',   monster:'wyvern',          qty:3,   desc:'The wyvern reigns from the crags. Ground 3 of them.' },
      { id:'h_gather_shark',  type:'gather', item:'raw_shark',          qty:20,  desc:'Shark waters are treacherous. Haul in 20 Raw Sharks.' },
      { id:'h_kill_hollow_k', type:'kill',   monster:'hollow_knight',   qty:15,  desc:'The Hollow Order must fall. Destroy 15 Hollow Knights.' },
      { id:'h_craft_yew_bow', type:'craft',  item:'yew_longbow',        qty:1,   desc:'The master fletcher demands proof. Craft a Yew Longbow.' },
    ],
    rewards: [
      { item:'coins',              qty:15000,  weight:25 },
      { item:'adamant_bar',        qty:20,     weight:20 },
      { item:'runite_bar',         qty:5,      weight:15 },
      { item:'super_strength',     qty:4,      weight:10 },
      { item:'dragon_bones',       qty:30,     weight:8 },
      { item:'ruby_ring',          qty:1,      weight:8 },
      { item:'mithril_arrows',     qty:150,    weight:6 },
      { item:'dragon_arrows',      qty:50,     weight:4 },
      { item:'clue_scroll_elite',  qty:1,      weight:4 },
    ],
  },
  elite: {
    id: 'elite',
    label: 'Elite',
    color: '#b585e0',
    steps: 5,
    casket: 'casket_elite',
    cluePool: [
      { id:'el_kill_void_emp', type:'kill',   monster:'void_emperor',   qty:1,   desc:'Only the strongest dare face the Void Emperor. Slay it once.' },
      { id:'el_kill_ash_ovrl', type:'kill',   monster:'ashen_overlord', qty:1,   desc:'The Ashen Overlord must fall. Prove your worth.' },
      { id:'el_gather_elder',  type:'gather', item:'elder_log',         qty:150, desc:'Elder trees grow where the ash fell first. Bring 150 Elder Logs.' },
      { id:'el_gather_ashore', type:'gather', item:'ashsteel_ore',      qty:30,  desc:'Only the deep ash veins yield this ore. Mine 30 Ashsteel Ore.' },
      { id:'el_craft_cannon',  type:'craft',  item:'dwarf_cannon',      qty:1,   desc:'The dwarven engineer left a challenge. Assemble a Dwarf Cannon.' },
      { id:'el_skill_all_50',  type:'total_level', level:1000,               desc:'Mastery over all skills. Reach total level 1000.' },
      { id:'el_skill_slayer70',type:'skill',  skill:'slayer',           level:70, desc:'The Master taskmasters only work with the best. Reach Slayer 70.' },
      { id:'el_craft_ashsteel',type:'craft',  item:'ashsteel_sword',    qty:1,   desc:'The Ashfall demands a blade of its own metal. Forge an Ashsteel Sword.' },
      { id:'el_kill_storm_rev',type:'kill',   monster:'storm_reaver',   qty:1,   desc:'Lightning has a name. Fell the Storm Reaver.' },
      { id:'el_gather_merm',   type:'gather', item:'mermaid_tear',      qty:3,   desc:'The sea gives up its secrets reluctantly. Bring 3 Mermaid\'s Tears.' },
    ],
    rewards: [
      { item:'coins',              qty:75000,  weight:20 },
      { item:'ashsteel_bar',       qty:15,     weight:15 },
      { item:'dragon_arrows',      qty:200,    weight:12 },
      { item:'super_attack',       qty:5,      weight:10 },
      { item:'diamond_amulet',     qty:1,      weight:8 },
      { item:'onyx',               qty:2,      weight:6 },
      { item:'elder_shortbow',     qty:1,      weight:5 },
      { item:'ashfire_arrows',     qty:100,    weight:5 },
      { item:'ring_of_wealth',     qty:1,      weight:5 },
      { item:'dwarf_cannon',       qty:1,      weight:2 },  // ultra-rare
      { item:'elder_longbow',      qty:1,      weight:7 },
    ],
  },
};

// ── ENGINE METHODS ────────────────────────────────────────────────
GameEngine.prototype.startClueScroll = function(tier) {
  const scroll = GAME_DATA.clueScrolls[tier];
  if (!scroll) return;
  const scrollId = `clue_scroll_${tier}`;
  if (!this.state.bank[scrollId] || this.state.bank[scrollId] <= 0) {
    this.emit('notification', { type:'warn', text:`You don't have a ${scroll.label} Clue Scroll.` });
    return;
  }
  if (this.state.clueScroll?.active) {
    this.emit('notification', { type:'warn', text:'You already have an active clue scroll. Complete or abandon it first.' });
    return;
  }
  // Remove scroll from bank
  this.state.bank[scrollId]--;
  if (this.state.bank[scrollId] <= 0) delete this.state.bank[scrollId];

  // Pick random clues from the pool (unique, no repeats)
  const pool = [...scroll.cluePool];
  const picked = [];
  for (let i = 0; i < scroll.steps && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push({ ...pool[idx], progress: 0, complete: false });
    pool.splice(idx, 1);
  }

  this.state.clueScroll = {
    active: true,
    tier,
    steps: picked,
    currentStep: 0,
    startedAt: Date.now(),
  };
  this.emit('notification', { type:'success', text:`Clue Scroll started! Step 1/${picked.length}: ${picked[0].desc}` });
  this.emit('clueScrollUpdated');
  this.save();
};

GameEngine.prototype.checkClueStep = function() {
  const cs = this.state.clueScroll;
  if (!cs?.active) return;
  const step = cs.steps[cs.currentStep];
  if (!step || step.complete) return;

  let met = false;
  switch (step.type) {
    case 'kill':
      met = (this.state.stats[`kills_${step.monster}`] || this.state.stats.monstersKilled_by_type?.[step.monster] || 0) >= step.qty;
      break;
    case 'gather':
      met = (this.state.clueScroll._gatherProgress?.[step.id] || 0) >= step.qty;
      break;
    case 'craft':
      met = (this.state.clueScroll._craftProgress?.[step.id] || 0) >= step.qty;
      break;
    case 'skill':
      met = (this.state.skills[step.skill]?.level || 1) >= step.level;
      break;
    case 'total_level':
      met = this.getTotalLevel() >= step.level;
      break;
  }

  if (met) {
    step.complete = true;
    const next = cs.currentStep + 1;
    if (next >= cs.steps.length) {
      // All steps done — award casket
      this.completeClueScroll();
    } else {
      cs.currentStep = next;
      this.emit('notification', { type:'success', text:`Clue step done! Step ${next+1}/${cs.steps.length}: ${cs.steps[next].desc}` });
      this.emit('clueScrollUpdated');
    }
  }
};

GameEngine.prototype.trackClueProgress = function(type, data) {
  const cs = this.state.clueScroll;
  if (!cs?.active) return;
  const step = cs.steps[cs.currentStep];
  if (!step || step.complete) return;
  if (step.type !== type) return;

  if (type === 'gather' && step.item === data.item) {
    if (!cs._gatherProgress) cs._gatherProgress = {};
    cs._gatherProgress[step.id] = (cs._gatherProgress[step.id]||0) + data.qty;
    this.checkClueStep();
  } else if (type === 'craft' && step.item === data.item) {
    if (!cs._craftProgress) cs._craftProgress = {};
    cs._craftProgress[step.id] = (cs._craftProgress[step.id]||0) + data.qty;
    this.checkClueStep();
  } else if (type === 'kill' && step.monster === data.monster) {
    if (!cs._killProgress) cs._killProgress = {};
    cs._killProgress[step.id] = (cs._killProgress[step.id]||0) + 1;
    // Override check to use local tracking
    const step2 = cs.steps[cs.currentStep];
    if ((cs._killProgress[step2.id]||0) >= step2.qty) {
      step.complete = true;
      const next = cs.currentStep + 1;
      if (next >= cs.steps.length) {
        this.completeClueScroll();
      } else {
        cs.currentStep = next;
        this.emit('notification', { type:'success', text:`Clue step done! Step ${next+1}/${cs.steps.length}: ${cs.steps[next].desc}` });
        this.emit('clueScrollUpdated');
      }
    }
  } else if (type === 'skill') {
    this.checkClueStep();
  }
};

GameEngine.prototype.completeClueScroll = function() {
  const cs = this.state.clueScroll;
  if (!cs) return;
  const scrollDef = GAME_DATA.clueScrolls[cs.tier];
  this.addItem(scrollDef.casket, 1);
  this.state.clueScroll = { active: false };
  if (!this.state.stats.clueScrollsCompleted) this.state.stats.clueScrollsCompleted = {};
  this.state.stats.clueScrollsCompleted[cs.tier] = (this.state.stats.clueScrollsCompleted[cs.tier]||0) + 1;
  this.emit('notification', { type:'achievement', text:`🎁 Clue complete! Reward casket added to bank.` });
  this.emit('clueScrollUpdated');
  this.save();
};

GameEngine.prototype.abandonClueScroll = function() {
  this.state.clueScroll = { active: false };
  this.emit('notification', { type:'warn', text:'Clue scroll abandoned.' });
  this.emit('clueScrollUpdated');
};

GameEngine.prototype.openCasket = function(casketId) {
  if (!this.state.bank[casketId] || this.state.bank[casketId] <= 0) return;
  const tier = casketId.replace('casket_','');
  const scrollDef = GAME_DATA.clueScrolls[tier];
  if (!scrollDef) return;

  this.state.bank[casketId]--;
  if (this.state.bank[casketId] <= 0) delete this.state.bank[casketId];

  // Weighted random reward selection — pick 2-4 items
  const rewards = scrollDef.rewards;
  const totalWeight = rewards.reduce((s,r)=>s+r.weight, 0);
  const numDrops = tier === 'elite' ? 3 : tier === 'hard' ? 3 : tier === 'medium' ? 2 : 2;
  const dropped = [];
  for (let d = 0; d < numDrops; d++) {
    let roll = Math.random() * totalWeight;
    for (const r of rewards) {
      roll -= r.weight;
      if (roll <= 0) {
        if (r.item === 'coins') {
          this.state.gold += r.qty;
          this.state.stats.goldEarned += r.qty;
          dropped.push(`${r.qty.toLocaleString()}g`);
        } else if (GAME_DATA.items[r.item]) {
          this.addItem(r.item, r.qty);
          dropped.push(`${r.qty > 1 ? r.qty+'× ' : ''}${GAME_DATA.items[r.item].name}`);
        }
        break;
      }
    }
  }
  this.emit('notification', { type:'rare', text:`🎁 Casket opened! Received: ${dropped.join(', ')}` });
  this.emit('bankChanged');
  if (!this.state.stats.casketsOpened) this.state.stats.casketsOpened = 0;
  this.state.stats.casketsOpened++;
};

// ── HOOK INTO EXISTING ENGINE EVENTS ─────────────────────────────
// Patch trackQuestProgress to also track clue progress
const _origTrackQuest = GameEngine.prototype.trackQuestProgress;
GameEngine.prototype.trackQuestProgress = function(type, data) {
  _origTrackQuest.call(this, type, data);
  // Also track for active clue scroll
  if (type === 'gather') this.trackClueProgress('gather', data);
  if (type === 'craft')  this.trackClueProgress('craft',  data);
};

// Patch onMonsterDeath to track clue kills
const _origOnDeath = GameEngine.prototype.onMonsterDeath;
GameEngine.prototype.onMonsterDeath = function(monster, isWB) {
  _origOnDeath.call(this, monster, isWB);
  if (monster?.id) this.trackClueProgress('kill', { monster: monster.id });
  // Check skill objectives on any kill (level might have just been gained)
  this.trackClueProgress('skill', {});
};

// Patch addXp to check skill-based clue steps
const _origAddXp = GameEngine.prototype.addXp;
GameEngine.prototype.addXp = function(skillId, amount) {
  _origAddXp.call(this, skillId, amount);
  if (this.state.clueScroll?.active) this.trackClueProgress('skill', { skill: skillId });
};

// ── CASKET: ADD OPEN BUTTON TO BANK ITEMS ────────────────────────
// Added via ui.js bank render check for subtype 'casket'
GAME_DATA.items.casket_easy.subtype   = 'casket';
GAME_DATA.items.casket_medium.subtype = 'casket';
GAME_DATA.items.casket_hard.subtype   = 'casket';
GAME_DATA.items.casket_elite.subtype  = 'casket';

// ── CLUE SCROLL DROPS: wire into existing drop sources ───────────
// Add easy clue to pickpocket_rogue and steal_gem stall loot
const _rogueTarget = GAME_DATA.thievingTargets?.find(t => t.id === 'pickpocket_rogue');
if (_rogueTarget && !_rogueTarget.loot.find(l => l.item === 'clue_scroll_easy')) {
  _rogueTarget.loot.push({ item:'clue_scroll_easy', qty:1, chance:0.03 });
}
const _gemStall = GAME_DATA.thievingTargets?.find(t => t.id === 'steal_gem');
if (_gemStall && !_gemStall.loot.find(l => l.item === 'clue_scroll_medium')) {
  _gemStall.loot.push({ item:'clue_scroll_medium', qty:1, chance:0.05 });
}
// Medium from dragon hunt, hard from world bosses
const _dragonHunt = GAME_DATA.gatheringActions?.hunting?.find(a => a.id === 'hunt_dragon');
if (_dragonHunt && !_dragonHunt.loot.find(l => l.item === 'clue_scroll_medium')) {
  _dragonHunt.loot.push({ item:'clue_scroll_medium', qty:1, chance:0.05 });
}
// Elite from bosses (add to ashen_overlord and void_emperor drops)
for (const bossId of ['ashen_overlord','void_emperor','storm_reaver']) {
  const boss = GAME_DATA.worldBosses?.find(b => b.id === bossId);
  if (boss && boss.drops && !boss.drops.find(d => d.item === 'clue_scroll_elite')) {
    boss.drops.push({ item:'clue_scroll_elite', qty:1, chance:0.05 });
  }
}

console.log('[Ashfall] Clue Scroll system loaded:', Object.keys(GAME_DATA.clueScrolls).length, 'tiers');
