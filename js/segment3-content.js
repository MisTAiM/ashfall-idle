// ================================================================
// ASHFALL IDLE — segment3-content.js
// Boss phase transitions, monster weakness system, combat enrage,
// guild upgrades, poison/venom tiers, tutorial data
// ================================================================

// ── BOSS PHASE SYSTEM ────────────────────────────────────────────
// World bosses gain phases at 50% and 25% HP.
// Stored per-boss in worldBoss data.
GAME_DATA.bossPhases = {
  ashen_overlord: {
    phases: [
      { hpThreshold: 0.50, name: 'Burning Rage', attackMult: 1.20, styleLock: 'melee',
        notify: '⚠ The Ashen Overlord ignites — attack speed increases!', enrage: false },
      { hpThreshold: 0.25, name: 'Final Conflagration', attackMult: 1.45, styleLock: 'melee',
        notify: '🔥 ENRAGE! The Ashen Overlord becomes superheated — maximum power!', enrage: true,
        dot: { type:'burn', stacks:3, duration:12 } },
    ],
    enrageDmgPerSec: 0.5, // +0.5% maxHit per second after 25% HP
  },
  blight_warden: {
    phases: [
      { hpThreshold: 0.50, name: 'Blighted Frenzy', attackMult: 1.25, styleLock: null,
        notify: '☠ The Blight Warden spreads its corruption!', enrage: false,
        dot: { type:'poison', stacks:5, duration:20 } },
      { hpThreshold: 0.25, name: 'Death Bloom', attackMult: 1.50, styleLock: 'magic',
        notify: '💀 ENRAGE! Blight Warden switches to toxic arcane!', enrage: true },
    ],
    enrageDmgPerSec: 0.4,
  },
  storm_reaver: {
    phases: [
      { hpThreshold: 0.50, name: 'Eye of the Storm', attackMult: 1.30, styleLock: 'ranged',
        notify: '⚡ The Storm Reaver unleashes lightning volleys!', enrage: false },
      { hpThreshold: 0.25, name: 'Tempest', attackMult: 1.60, styleLock: 'ranged',
        notify: '🌩 ENRAGE! Storm Reaver enters the Tempest — cover yourself!', enrage: true },
    ],
    enrageDmgPerSec: 0.6,
  },
  void_emperor: {
    phases: [
      { hpThreshold: 0.60, name: 'Void Fracture', attackMult: 1.20, styleLock: 'magic',
        notify: '🌀 The Void Emperor tears the fabric of space!', enrage: false },
      { hpThreshold: 0.35, name: 'Reality Unbound', attackMult: 1.40, styleLock: null,
        notify: '⚠ Reality Unbound — The Void Emperor switches attacks rapidly!', enrage: false },
      { hpThreshold: 0.15, name: 'Omega Collapse', attackMult: 1.75, styleLock: 'magic',
        notify: '💀 OMEGA PHASE — The Void Emperor collapses into himself. Maximum danger!', enrage: true,
        dot: { type:'freeze', stacks:2, duration:8 } },
    ],
    enrageDmgPerSec: 0.8,
  },
};

// ── MONSTER WEAKNESS SYSTEM ──────────────────────────────────────
// Weakness: { element, dmgBonus (%) }
// Player attacks with matching weapon flag get bonus damage
if (!GAME_DATA.monsterWeaknesses) {
  GAME_DATA.monsterWeaknesses = {
    // Fire-weak (weak to ice/water, strong vs fire)
    frost_giant:   { weak:'ranged',  bonus:20 },
    ice_troll:     { weak:'magic',   bonus:25 },
    wyvern:        { weak:'magic',   bonus:20 },
    // Undead — weak to holy (prayer bonus helps)
    skeleton:      { weak:'melee',   bonus:15, tag:'undead' },
    zombie:        { weak:'melee',   bonus:15, tag:'undead' },
    hollow_soldier:{ weak:'melee',   bonus:20, tag:'undead' },
    hollow_knight: { weak:'melee',   bonus:20, tag:'undead' },
    hollow_lord:   { weak:'ranged',  bonus:25, tag:'undead' },
    // Magic-weak (light armour)
    goblin:        { weak:'ranged',  bonus:10 },
    bandit:        { weak:'magic',   bonus:10 },
    dark_mage:     { weak:'ranged',  bonus:25 },
    // Ranged-weak (heavy armour)
    black_knight:  { weak:'magic',   bonus:20 },
    iron_dragon:   { weak:'magic',   bonus:15 },
    steel_dragon:  { weak:'magic',   bonus:20 },
    dragon:        { weak:'ranged',  bonus:15 },
    // World bosses
    ashen_overlord:{ weak:'ranged',  bonus:15, tag:'boss' },
    blight_warden: { weak:'magic',   bonus:15, tag:'boss' },
    storm_reaver:  { weak:'melee',   bonus:15, tag:'boss' },
    void_emperor:  { weak:'magic',   bonus:20, tag:'boss' },
    // Shadow creatures
    shadow_archer: { weak:'melee',   bonus:15 },
    abyssal_demon: { weak:'magic',   bonus:20 },
    abyssal_horror:{ weak:'ranged',  bonus:15 },
  };
}

// ── VENOM TIER SYSTEM ────────────────────────────────────────────
// Stronger poison effects beyond basic 'poison'
if (!GAME_DATA.statusEffectDefs?.serpent_venom) {
  if (!GAME_DATA.statusEffectDefs) GAME_DATA.statusEffectDefs = {};
  Object.assign(GAME_DATA.statusEffectDefs, {
    serpent_venom: {
      name: 'Serpent Venom', tick: 2.0, dmgPerStack: 4,   maxStacks: 8,
      explodeStacks: 0, color: '#3aaa2a',
      desc: 'Potent venom from serpent creatures. Stacks to 8.',
    },
    wyvern_venom: {
      name: 'Wyvern Venom', tick: 1.5, dmgPerStack: 7,   maxStacks: 12,
      explodeStacks: 0, color: '#1a8a60',
      desc: 'Corrosive wyvern venom. Very fast ticking, high stacks.',
    },
    necrotic: {
      name: 'Necrotic', tick: 3.0, dmgPerStack: 12, maxStacks: 5,
      explodeStacks: 5, explodeDmg: 80, color: '#5a1a8a',
      desc: 'Void corruption. Explodes at 5 stacks for 80 damage.',
    },
  });
}

// ── GUILD UPGRADES SYSTEM ────────────────────────────────────────
GAME_DATA.guildUpgrades = [
  // Tier 1 – Foundation
  { id:'guild_xp_1',     name:'Scholar\'s Hall I',    tier:1, cost:5000,
    desc:'All members gain +5% XP from all skills.', bonus:{ xpBoost:5 }, icon:'📚' },
  { id:'guild_gold_1',   name:'Treasury I',           tier:1, cost:5000,
    desc:'Gold drops increased by +5% for all members.', bonus:{ goldBoost:5 }, icon:'💰' },
  { id:'guild_bank_1',   name:'Vault I',              tier:1, cost:8000,
    desc:'Guild bank capacity +100 items.', bonus:{ bankSlots:100 }, icon:'🏦' },
  { id:'guild_members_1',name:'Barracks I',           tier:1, cost:6000,
    desc:'Increase max guild members to 25.', bonus:{ memberCap:25 }, icon:'⚔️' },
  // Tier 2 – Advancement
  { id:'guild_xp_2',     name:'Scholar\'s Hall II',   tier:2, cost:25000, requires:'guild_xp_1',
    desc:'All members gain +12% XP from all skills.', bonus:{ xpBoost:12 }, icon:'📚' },
  { id:'guild_gold_2',   name:'Treasury II',          tier:2, cost:25000, requires:'guild_gold_1',
    desc:'Gold drops increased by +12% for all members.', bonus:{ goldBoost:12 }, icon:'💰' },
  { id:'guild_bank_2',   name:'Vault II',             tier:2, cost:40000, requires:'guild_bank_1',
    desc:'Guild bank capacity +300 items.', bonus:{ bankSlots:300 }, icon:'🏦' },
  { id:'guild_drops_1',  name:'Hunter\'s Lodge I',    tier:2, cost:30000,
    desc:'+5% drop rate for all members.', bonus:{ dropBoost:5 }, icon:'🎯' },
  // Tier 3 – Mastery
  { id:'guild_xp_3',     name:'Scholar\'s Hall III',  tier:3, cost:100000, requires:'guild_xp_2',
    desc:'All members gain +20% XP from all skills.', bonus:{ xpBoost:20 }, icon:'📚' },
  { id:'guild_combat_1', name:'War Hall I',           tier:3, cost:80000,
    desc:'+8% combat damage for all members.', bonus:{ dmgBoost:8 }, icon:'⚔️' },
  { id:'guild_drops_2',  name:'Hunter\'s Lodge II',   tier:3, cost:80000, requires:'guild_drops_1',
    desc:'+12% drop rate for all members.', bonus:{ dropBoost:12 }, icon:'🎯' },
  // Tier 4 – Elite
  { id:'guild_xp_4',     name:'Grand Academy',        tier:4, cost:500000, requires:'guild_xp_3',
    desc:'All members gain +30% XP from all skills.', bonus:{ xpBoost:30 }, icon:'🏛️' },
  { id:'guild_combat_2', name:'War Hall II',          tier:4, cost:400000, requires:'guild_combat_1',
    desc:'+18% combat damage for all members.', bonus:{ dmgBoost:18 }, icon:'⚔️' },
  { id:'guild_members_2',name:'Grand Barracks',       tier:4, cost:300000, requires:'guild_members_1',
    desc:'Increase max guild members to 50.', bonus:{ memberCap:50 }, icon:'🏰' },
];

// ── TUTORIAL STEPS ───────────────────────────────────────────────
GAME_DATA.tutorialSteps = [
  {
    id: 'gather', step: 1, title: 'Start Gathering',
    desc: 'Head to Woodcutting, Mining, or Fishing in the left sidebar. Click any action to start training — resources gather automatically!',
    highlight: 'woodcutting', icon: '🌲',
    action: 'Go to Woodcutting →'
  },
  {
    id: 'craft', step: 2, title: 'Craft Your First Items',
    desc: 'Use Smithing to forge weapons and armor from ore bars. The Crafting skill creates leather armor and jewelry.',
    highlight: 'smithing', icon: '⚒️',
    action: 'Go to Smithing →'
  },
  {
    id: 'equip', step: 3, title: 'Equip Your Gear',
    desc: 'Open your Bank, find a weapon or armor piece, and click Equip. Better gear = more damage and defence in combat.',
    highlight: 'bank', icon: '⚔️',
    action: 'Open Bank →'
  },
  {
    id: 'fight', step: 4, title: 'Enter Combat',
    desc: 'Go to Combat and pick an area. Defeat monsters for XP, gold, and rare drops. Auto-eat food to survive longer.',
    highlight: 'combat', icon: '⚡',
    action: 'Go to Combat →'
  },
  {
    id: 'quest', step: 5, title: 'Complete Quests',
    desc: 'Quests unlock new content, give big XP rewards, and tell the story of the Ashfall. Talk to NPCs to start quests.',
    highlight: 'quests', icon: '📜',
    action: 'View Quests →'
  },
];

console.log('[Ashfall] Segment 3 loaded: Boss phases, weakness system, venom tiers, guild upgrades, tutorial data');
