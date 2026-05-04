// ================================================================
// ASHFALL IDLE — combat-data.js
// All combat-specific data: monsters, areas, dungeons, world bosses,
// abilities, multi-mob encounters, combat formulas.
// Loaded AFTER data.js, BEFORE engine.js.
// Extend GAME_DATA — do NOT redefine it.
// ================================================================

// ── MONSTER PATCH HELPER ──────────────────────────────────────────
// Use this to add/patch monsters without touching data.js or items-mega.js
function _addMonster(id, def) {
  if (!GAME_DATA.monsters[id]) GAME_DATA.monsters[id] = { id, ...def };
  else Object.assign(GAME_DATA.monsters[id], def);
}
function _patchMonsterDrops(id, drops) {
  const m = GAME_DATA.monsters[id]; if (!m) return;
  if (!m.drops) m.drops = [];
  for (const drop of drops) {
    if (!m.drops.find(d => d.item === drop.item)) m.drops.push(drop);
  }
}

// ── COMBAT AREA HELPER ────────────────────────────────────────────
function _addArea(def) {
  if (!GAME_DATA.combatAreas.find(a => a.id === def.id)) GAME_DATA.combatAreas.push(def);
}

// ── MULTI-MOB ENCOUNTER HELPER ────────────────────────────────────
function _addEncounter(def) {
  if (!GAME_DATA.multiMobEncounters) GAME_DATA.multiMobEncounters = [];
  if (!GAME_DATA.multiMobEncounters.find(e => e.name === def.name)) {
    GAME_DATA.multiMobEncounters.push(def);
  }
}

// ── ABILITY HELPER ────────────────────────────────────────────────
function _addAbility(def) {
  if (!GAME_DATA.abilities.find(a => a.id === def.id)) GAME_DATA.abilities.push(def);
}

// ================================================================
// NEW MONSTERS — add here, never in data.js or items-mega.js
// ================================================================
// Format: _addMonster('id', { name, hp, maxHit, attackSpeed, combatLevel, style,
//   evasion:{melee,ranged,magic}, xp, gold:{min,max}, drops:[...], alignment })

// Example: placeholder for future monsters
// _addMonster('void_spawn', { name:'Void Spawn', hp:500, maxHit:45, attackSpeed:2.4,
//   combatLevel:55, style:'magic', evasion:{melee:25,ranged:30,magic:55}, xp:800,
//   gold:{min:30,max:100}, alignment:'CE',
//   drops:[{item:'death_rune',qty:5,chance:0.4},{item:'void_dust',qty:2,chance:0.25}] });

// ================================================================
// COMBAT AREAS — add new areas here
// ================================================================
// Areas already defined in data.js / items-mega.js stay there.
// New ones go here.

// ================================================================
// MULTI-MOB ENCOUNTERS
// ================================================================
// These get matched to areas by levelReq proximity.
// Add encounters for different difficulty tiers.

// Ensure multiMobEncounters is initialized
if (!GAME_DATA.multiMobEncounters) GAME_DATA.multiMobEncounters = [];

// Assign multi-mob encounters to areas during load
setTimeout(() => {
  for (const area of (GAME_DATA.combatAreas || [])) {
    area.multiMobs = GAME_DATA.multiMobEncounters.filter(
      e => e.levelReq <= area.levelReq + 10 && e.levelReq >= area.levelReq - 10
    );
  }
}, 0);

// ================================================================
// ABILITIES — Tactics skill actives
// ================================================================
const _abilities = [
  {
    id:'power_strike', name:'Power Strike', icon:'⚡', tacticsReq:10, cooldown:30,
    desc:'Your next melee hit deals 175% damage.',
    effect:{ type:'buff', stat:'damageMult', value:1.75, hits:1 },
  },
  {
    id:'rapid_shot', name:'Rapid Shot', icon:'🏹', tacticsReq:15, cooldown:25,
    desc:'Fire 3 ranged shots simultaneously for 80% damage each.',
    effect:{ type:'multi', shots:3, mult:0.80, style:'ranged' },
  },
  {
    id:'arcane_burst', name:'Arcane Burst', icon:'🔮', tacticsReq:20, cooldown:35,
    desc:'Cast a burst spell for 200% magic damage ignoring defence.',
    effect:{ type:'spell_burst', mult:2.0, ignoreDefence:true },
  },
  {
    id:'shield_wall', name:'Shield Wall', icon:'🛡', tacticsReq:25, cooldown:45,
    desc:'Reduce all incoming damage by 60% for 10 seconds.',
    effect:{ type:'defence_buff', reducePct:60, duration:10 },
  },
  {
    id:'battle_cry', name:'Battle Cry', icon:'⚔', tacticsReq:35, cooldown:60,
    desc:'+20% damage and +20% attack speed for 15 seconds.',
    effect:{ type:'combat_buff', dmgBonus:20, speedBonus:20, duration:15 },
  },
  {
    id:'void_step', name:'Void Step', icon:'🌑', tacticsReq:50, cooldown:90,
    desc:'Dodge the next 3 monster attacks entirely.',
    effect:{ type:'dodge_buff', dodges:3, duration:20 },
  },
  {
    id:'blood_frenzy', name:'Blood Frenzy', icon:'🩸', tacticsReq:65, cooldown:120,
    desc:'Each kill in the next 20s restores 15% of your max HP.',
    effect:{ type:'on_kill_heal', healPct:15, duration:20 },
  },
  {
    id:'ash_nova', name:'Ash Nova', icon:'💥', tacticsReq:80, cooldown:180,
    desc:'Deal 300% magic damage and apply 5 burn stacks. Ultimate ability.',
    effect:{ type:'nuke', mult:3.0, burnStacks:5 },
  },
];
for (const ab of _abilities) {
  if (!GAME_DATA.abilities.find(a => a.id === ab.id)) GAME_DATA.abilities.push(ab);
}

console.log('[Ashfall] combat-data.js loaded. Abilities:', GAME_DATA.abilities.length,
  '| Multi-mob:', GAME_DATA.multiMobEncounters.length);
