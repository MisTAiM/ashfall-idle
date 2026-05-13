// ================================================================
// ASHFALL IDLE — data/combat.js
// Abilities, prayers, spells, combat formulas, special attacks.
// Merges: combat-data.js
// ================================================================
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
    id:'power_strike', name:'Power Strike', icon:'⚡', tacticsReq:10, cooldown:30, manaCost:10,
    desc:'Your next melee hit deals 175% damage.',
    effect:{ type:'buff', stat:'damageMult', value:1.75, hits:1 },
  },
  {
    id:'rapid_shot', name:'Rapid Shot', icon:'🏹', tacticsReq:15, cooldown:25, manaCost:15,
    desc:'Fire 3 ranged shots simultaneously for 80% damage each.',
    effect:{ type:'multi', shots:3, mult:0.80, style:'ranged' },
  },
  {
    id:'arcane_burst', name:'Arcane Burst', icon:'🔮', tacticsReq:20, cooldown:35, manaCost:40,
    desc:'Cast a burst spell for 200% magic damage ignoring defence.',
    effect:{ type:'spell_burst', mult:2.0, ignoreDefence:true },
  },
  {
    id:'shield_wall', name:'Shield Wall', icon:'🛡', tacticsReq:25, cooldown:45, manaCost:20,
    desc:'Reduce all incoming damage by 60% for 10 seconds.',
    effect:{ type:'defence_buff', reducePct:60, duration:10 },
  },
  {
    id:'battle_cry', name:'Battle Cry', icon:'⚔', tacticsReq:35, cooldown:60, manaCost:25,
    desc:'+20% damage and +20% attack speed for 15 seconds.',
    effect:{ type:'combat_buff', dmgBonus:20, speedBonus:20, duration:15 },
  },
  {
    id:'void_step', name:'Void Step', icon:'🌑', tacticsReq:50, cooldown:90, manaCost:35,
    desc:'Dodge the next 3 monster attacks entirely.',
    effect:{ type:'dodge_buff', dodges:3, duration:20 },
  },
  {
    id:'blood_frenzy', name:'Blood Frenzy', icon:'🩸', tacticsReq:65, cooldown:120, manaCost:50,
    desc:'Each kill in the next 20s restores 15% of your max HP.',
    effect:{ type:'on_kill_heal', healPct:15, duration:20 },
  },
  {
    id:'ash_nova', name:'Ash Nova', icon:'💥', tacticsReq:80, cooldown:180, manaCost:80,
    desc:'Deal 300% magic damage and apply 5 burn stacks. Ultimate ability.',
    effect:{ type:'nuke', mult:3.0, burnStacks:5 },
  },

// ── NEW ABILITIES ─────────────────────────────────────
  {
    id:'soul_drain', name:'Soul Drain', icon:'💀', tacticsReq:30, cooldown:40, manaCost:30,
    desc:'Drain 25% of the monster current HP as magic damage and heal for half.',
    effect:{ type:'lifesteal_spell', mult:0.25, stealPct:50, fromCurrentHp:true },
  },
  {
    id:'rune_burst', name:'Rune Burst', icon:'🔵', tacticsReq:25, cooldown:30, manaCost:25,
    desc:'Expend all current mana in a single burst. Damage scales with mana spent.',
    effect:{ type:'mana_burst', dmgPerMana:0.8 },
  },
  {
    id:'ice_barrage', name:'Ice Barrage', icon:'❄', tacticsReq:45, cooldown:50, manaCost:45,
    desc:'Freeze the enemy for 5s and deal 180% magic damage.',
    effect:{ type:'debuff', freeze:5, directMagicMult:1.8 },
  },
  {
    id:'vengeance', name:'Vengeance', icon:'🔄', tacticsReq:40, cooldown:60, manaCost:20,
    desc:'Reflect the next incoming hit at 150% back to the enemy.',
    effect:{ type:'vengeance', reflectMult:1.5 },
  },
  {
    id:'war_cry', name:'War Cry', icon:'📣', tacticsReq:30, cooldown:45, manaCost:22,
    desc:'+25 Strength bonus for 20 seconds.',
    effect:{ type:'combat_buff', dmgBonus:25, duration:20 },
  },
  {
    id:'expose_weakness', name:'Expose Weakness', icon:'🎯', tacticsReq:20, cooldown:35, manaCost:15,
    desc:'+30 Attack bonus vs this enemy for 30 seconds.',
    effect:{ type:'expose', bonus:30, duration:30 },
  },
  {
    id:'death_mark', name:'Death Mark', icon:'☠', tacticsReq:60, cooldown:90, manaCost:55,
    desc:'All attacks deal +30% damage for 20 seconds.',
    effect:{ type:'mark_of_death', dmgBonus:30, duration:20 },
  },
  {
    id:'void_rupture', name:'Void Rupture', icon:'🌀', tacticsReq:70, cooldown:120, manaCost:65,
    desc:'Magic burst dealing 200% damage, ignores 50% of enemy evasion.',
    effect:{ type:'void_rupture', mult:2.0 },
  },
  {
    id:'cleave', name:'Cleave', icon:'🗡', tacticsReq:15, cooldown:20, manaCost:12,
    desc:'Three wide melee swings, each dealing 70% max hit.',
    effect:{ type:'cleave', hits:3, mult:0.7 },
  },
  {
    id:'barrage', name:'Barrage', icon:'🏹', tacticsReq:40, cooldown:55, manaCost:30,
    desc:'Fire 5 rapid bolts for 65% ranged damage each.',
    effect:{ type:'barrage', hits:5, mult:0.65 },
  },
  {
    id:'prayer_surge', name:'Prayer Surge', icon:'✨', tacticsReq:35, cooldown:70, manaCost:18,
    desc:'Restore 40 prayer points and gain +8 to all combat stats for 20s.',
    effect:{ type:'prayer_surge', ppRestore:40, statBoost:8, duration:20 },
  },
  {
    id:'execution', name:'Execution', icon:'💢', tacticsReq:55, cooldown:80, manaCost:40,
    desc:'Instant kill if target below 30% HP. Otherwise deals 3x damage.',
    effect:{ type:'execute', threshold:0.30, mult:3.0 },
  },
];
for (const ab of _abilities) {
  if (!GAME_DATA.abilities.find(a => a.id === ab.id)) GAME_DATA.abilities.push(ab);
}

if(window._ASHFALL_DEBUG) console.log('[Ashfall] combat-data.js loaded. Abilities:', GAME_DATA.abilities.length,
  '| Multi-mob:', GAME_DATA.multiMobEncounters.length);
