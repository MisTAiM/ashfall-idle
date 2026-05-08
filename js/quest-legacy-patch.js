// ================================================================
// ASHFALL IDLE — quest-legacy-patch.js
// Patches all legacy flat quests from data.js with QP, difficulty,
// series, length, and combat level so they display properly in the
// new quest journal. Loads AFTER data.js, BEFORE quests-data.js.
// ================================================================

(function(){
'use strict';

// Mapping: questId -> { qp, difficulty, length, series, combatLevel }
const patches = {
  // ── Pete's Village Chain (Novice) ─────────────────────
  pete_1:   { qp:1, difficulty:'novice',       length:'short',  series:'Village Tales',  combatLevel:0  },
  pete_2:   { qp:1, difficulty:'novice',       length:'short',  series:'Village Tales',  combatLevel:3  },
  pete_3:   { qp:1, difficulty:'novice',       length:'short',  series:'Village Tales',  combatLevel:0  },
  pete_4:   { qp:2, difficulty:'novice',       length:'short',  series:'Village Tales',  combatLevel:5  },

  // ── Elara's Silver Order Chain (Novice→Intermediate) ──
  elara_1:  { qp:1, difficulty:'novice',       length:'short',  series:'Silver Order',   combatLevel:10 },
  elara_2:  { qp:2, difficulty:'novice',       length:'short',  series:'Silver Order',   combatLevel:15 },
  elara_3:  { qp:2, difficulty:'intermediate', length:'medium', series:'Silver Order',   combatLevel:28 },
  elara_4:  { qp:3, difficulty:'intermediate', length:'long',   series:'Silver Order',   combatLevel:75 },

  // ── Garrick's Trade Chain (Novice→Intermediate) ───────
  garrick_1:{ qp:1, difficulty:'novice',       length:'short',  series:'Merchant Guild',  combatLevel:0  },
  garrick_2:{ qp:1, difficulty:'novice',       length:'short',  series:'Merchant Guild',  combatLevel:0  },
  garrick_3:{ qp:2, difficulty:'intermediate', length:'medium', series:'Merchant Guild',  combatLevel:0  },
  garrick_4:{ qp:3, difficulty:'intermediate', length:'long',   series:'Merchant Guild',  combatLevel:0  },

  // ── Krolgar's Bloodfang Chain (Novice→Intermediate) ───
  krolgar_1:{ qp:1, difficulty:'novice',       length:'short',  series:'Bloodfang Trials', combatLevel:1  },
  krolgar_2:{ qp:1, difficulty:'novice',       length:'short',  series:'Bloodfang Trials', combatLevel:0  },
  krolgar_3:{ qp:2, difficulty:'intermediate', length:'medium', series:'Bloodfang Trials', combatLevel:40 },
  krolgar_4:{ qp:3, difficulty:'intermediate', length:'medium', series:'Bloodfang Trials', combatLevel:60 },

  // ── Ilyana's Veiled Circle Chain (Novice→Intermediate) ─
  ilyana_1: { qp:1, difficulty:'novice',       length:'short',  series:'Veiled Circle',   combatLevel:0  },
  ilyana_2: { qp:1, difficulty:'novice',       length:'short',  series:'Veiled Circle',   combatLevel:0  },
  ilyana_3: { qp:2, difficulty:'intermediate', length:'short',  series:'Veiled Circle',   combatLevel:0  },
  ilyana_4: { qp:3, difficulty:'intermediate', length:'medium', series:'Veiled Circle',   combatLevel:85 },

  // ── Greybeard's Prayer Chain (Novice→Intermediate) ────
  grey_1:   { qp:1, difficulty:'novice',       length:'short',  series:'Path of Prayer',  combatLevel:0  },
  grey_2:   { qp:1, difficulty:'novice',       length:'short',  series:'Path of Prayer',  combatLevel:0  },
  grey_3:   { qp:2, difficulty:'intermediate', length:'medium', series:'Path of Prayer',  combatLevel:0  },
  grey_4:   { qp:3, difficulty:'intermediate', length:'medium', series:'Path of Prayer',  combatLevel:0  },

  // ── Vex's Slayer Chain (Novice→Experienced) ───────────
  vex_1:    { qp:1, difficulty:'novice',       length:'short',  series:'Slayer Ranks',    combatLevel:10 },
  vex_2:    { qp:2, difficulty:'intermediate', length:'medium', series:'Slayer Ranks',    combatLevel:15 },
  vex_3:    { qp:2, difficulty:'intermediate', length:'long',   series:'Slayer Ranks',    combatLevel:25 },
  vex_4:    { qp:3, difficulty:'experienced',  length:'long',   series:'Slayer Ranks',    combatLevel:40 },

  // ── Lyra's Cryomancy Chain (Intermediate→Experienced) ─
  lyra_1:   { qp:1, difficulty:'intermediate', length:'short',  series:'Frost Studies',   combatLevel:20 },
  lyra_2:   { qp:1, difficulty:'intermediate', length:'short',  series:'Frost Studies',   combatLevel:0  },
  lyra_3:   { qp:2, difficulty:'experienced',  length:'medium', series:'Frost Studies',   combatLevel:35 },
  lyra_4:   { qp:3, difficulty:'experienced',  length:'medium', series:'Frost Studies',   combatLevel:55 },

  // ── Tormund's Ashborn Chain (Intermediate→Experienced) ─
  tor_1:    { qp:1, difficulty:'intermediate', length:'short',  series:'Ashborn Research', combatLevel:15 },
  tor_2:    { qp:1, difficulty:'intermediate', length:'short',  series:'Ashborn Research', combatLevel:25 },
  tor_3:    { qp:2, difficulty:'experienced',  length:'medium', series:'Ashborn Research', combatLevel:40 },
  tor_4:    { qp:3, difficulty:'experienced',  length:'long',   series:'Ashborn Research', combatLevel:50 },

  // ── Elena's Hollow Chain (Intermediate→Experienced) ───
  elena_1:  { qp:1, difficulty:'intermediate', length:'short',  series:'Hollow Campaign',  combatLevel:20 },
  elena_2:  { qp:2, difficulty:'intermediate', length:'medium', series:'Hollow Campaign',  combatLevel:30 },
  elena_3:  { qp:2, difficulty:'experienced',  length:'medium', series:'Hollow Campaign',  combatLevel:50 },
  elena_4:  { qp:3, difficulty:'experienced',  length:'long',   series:'Hollow Campaign',  combatLevel:60 },

  // ── Morrigan's Blood Magic Chain (Intermediate→Experienced)
  morr_1:   { qp:1, difficulty:'intermediate', length:'short',  series:'Blood Rituals',    combatLevel:0  },
  morr_2:   { qp:1, difficulty:'intermediate', length:'medium', series:'Blood Rituals',    combatLevel:20 },
  morr_3:   { qp:2, difficulty:'experienced',  length:'medium', series:'Blood Rituals',    combatLevel:0  },
  morr_4:   { qp:3, difficulty:'experienced',  length:'medium', series:'Blood Rituals',    combatLevel:60 },

  // ── Dorn's Smithing Chain (Intermediate→Experienced) ──
  dorn_1:   { qp:1, difficulty:'intermediate', length:'short',  series:'Forge Mastery',    combatLevel:0  },
  dorn_2:   { qp:1, difficulty:'intermediate', length:'medium', series:'Forge Mastery',    combatLevel:0  },
  dorn_3:   { qp:2, difficulty:'experienced',  length:'medium', series:'Forge Mastery',    combatLevel:0  },
  dorn_4:   { qp:3, difficulty:'experienced',  length:'long',   series:'Forge Mastery',    combatLevel:0  },
};

let patched = 0;
for (const q of GAME_DATA.quests) {
  const p = patches[q.id];
  if (p) {
    q.qp          = p.qp;
    q.difficulty   = p.difficulty;
    q.length       = p.length;
    q.series       = p.series;
    q.combatLevel  = p.combatLevel;
    q.qpRequired   = q.qpRequired || 0;
    q.prereqs      = q.prereqs || (q.prereq ? [q.prereq] : []);
    q.levelReqs    = q.levelReqs || {};
    q.stages       = q.stages || [];
    q.questDrops   = q.questDrops || [];
    patched++;
  }
}

console.log(`[Ashfall] quest-legacy-patch.js patched ${patched} legacy quests with QP, difficulty, series.`);

})();
