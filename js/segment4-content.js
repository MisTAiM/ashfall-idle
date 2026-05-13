// ================================================================
// ASHFALL IDLE — segment4-content.js
// Prestige system, item comparison data, auto-bank config,
// buy orders schema, trading system data, sound definitions
// ================================================================

// ── PRESTIGE SYSTEM ──────────────────────────────────────────────
// Each prestige reset: all skills → 1, permanent % bonus unlocked
// Requires: all skills at 99, minimum total level 2750
GAME_DATA.prestige = {
  enabled: true,
  minTotalLevel: 2000,  // total level needed before first prestige
  skillFloor: 99,       // all skills must hit this to prestige

  // Permanent bonuses per prestige rank
  ranks: [
    { rank:1, name:'Ashen Initiate',   icon:'🔥', color:'#c9873e',
      bonuses:{ xpMult:0.10, goldMult:0.05 },
      desc:'+10% XP, +5% Gold. The ash has remade you.' },
    { rank:2, name:'Ashen Adept',      icon:'💀', color:'#8a5ec4',
      bonuses:{ xpMult:0.20, goldMult:0.10, dropMult:0.05 },
      desc:'+20% XP, +10% Gold, +5% Drops.' },
    { rank:3, name:'Ashen Veteran',    icon:'⚔️', color:'#4a9ed4',
      bonuses:{ xpMult:0.30, goldMult:0.15, dropMult:0.10, dmgMult:0.05 },
      desc:'+30% XP, +15% Gold, +10% Drops, +5% Damage.' },
    { rank:4, name:'Ashen Master',     icon:'🌟', color:'#d4a83a',
      bonuses:{ xpMult:0.45, goldMult:0.20, dropMult:0.15, dmgMult:0.10 },
      desc:'+45% XP, +20% Gold, +15% Drops, +10% Damage.' },
    { rank:5, name:'Lord of Ashfall',  icon:'👑', color:'#ff6020',
      bonuses:{ xpMult:0.60, goldMult:0.30, dropMult:0.25, dmgMult:0.20, startLevel:10 },
      desc:'+60% XP, +30% Gold, +25% Drops, +20% Dmg, skills start at 10.' },
  ],

  // Kept items on prestige (these don't get wiped)
  keepItems: [
    'ashforge_cannon','graceful_hood','graceful_top','graceful_legs',
    'graceful_gloves','graceful_boots','graceful_cape','ember_cape',
    'berserker_ring','archers_ring','seers_ring','fury_amulet',
    'occult_necklace','crypts_gloves','ava_accumulator','slayer_helm',
  ],
};

// ── ITEM COMPARISON ──────────────────────────────────────────────
// Stats shown in comparison (in order of display)
GAME_DATA.compareStats = [
  'attackBonus','strengthBonus','defenceBonus','rangedBonus','magicBonus',
  'damageReduction','healPerTick','attackSpeed',
];

// ── AUTO-BANK CONFIG ─────────────────────────────────────────────
GAME_DATA.autoBankConfig = {
  enabled: false,
  intervalSeconds: 300,   // auto-bank every 5 minutes by default
  keepQty: { },           // items to keep in inventory, not bank
};

// ── DIRECT TRADE SCHEMA ──────────────────────────────────────────
// Trades are initiated in-game, stored in Firebase /trades/{tradeId}
// Schema: { from, to, fromItems:[{item,qty}], toItems:[{item,qty}], status, createdAt }
if (!GAME_DATA.tradeConfig) {
  GAME_DATA.tradeConfig = {
    maxSlotsPerSide: 8,    // max unique item types each side can offer
    timeout: 300000,       // trade expires after 5 minutes
    enabled: true,
  };
}

// ── SOUND DEFINITIONS ────────────────────────────────────────────
// Web Audio API generated sounds — no file downloads needed
GAME_DATA.sounds = {
  enabled: false, // user opt-in
  volume: 0.3,
  defs: {
    levelup:    { type:'melody',  freqs:[440,550,660,880], dur:0.12, vol:0.4 },
    click:      { type:'click',   freq:800,                dur:0.04, vol:0.15 },
    hit:        { type:'thud',    freq:180,                dur:0.08, vol:0.2 },
    crit:       { type:'crack',   freq:[300,600],          dur:0.10, vol:0.3 },
    miss:       { type:'whoosh',  freq:200,                dur:0.06, vol:0.1 },
    loot:       { type:'chime',   freq:660,                dur:0.15, vol:0.25 },
    death:      { type:'boom',    freq:80,                 dur:0.25, vol:0.35 },
    rare:       { type:'fanfare', freqs:[523,659,784,1047],dur:0.15, vol:0.35 },
    cannon:     { type:'boom',    freq:120,                dur:0.20, vol:0.30 },
    prestige:   { type:'fanfare', freqs:[440,550,660,880,1100], dur:0.18, vol:0.5 },
  }
};

console.log('[Ashfall] Segment 4 content loaded: Prestige, comparison, auto-bank, trade, sounds');
