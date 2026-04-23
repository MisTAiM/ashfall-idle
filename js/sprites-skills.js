// ================================================================
// ASHFALL IDLE - Skill Art & Visual Polish
// SVG art for gathering/artisan actions, loot bag system
// ================================================================

// ── GATHERING ACTION ART ─────────────────────────────────
GAME_DATA.actionArt = {
  // Woodcutting trees
  chop_oak:     `<svg viewBox="0 0 48 48"><rect x="22" y="24" width="4" height="18" rx="1" fill="#6a4a2a"/><ellipse cx="24" cy="20" rx="14" ry="14" fill="#3a6a2a"/><ellipse cx="20" cy="16" rx="8" ry="8" fill="#4a8a3a"/><ellipse cx="30" cy="22" rx="7" ry="6" fill="#3a7a2a"/><circle cx="16" cy="14" r="3" fill="#5a9a4a" opacity="0.6"/></svg>`,
  chop_willow:  `<svg viewBox="0 0 48 48"><rect x="22" y="22" width="4" height="20" rx="1" fill="#5a3a1a"/><path d="M24 18 Q10 24 6 36" stroke="#4a8a3a" stroke-width="2" fill="none"/><path d="M24 16 Q38 22 42 34" stroke="#4a8a3a" stroke-width="2" fill="none"/><path d="M24 14 Q14 20 8 30" stroke="#5a9a4a" stroke-width="2" fill="none"/><path d="M24 14 Q34 18 40 28" stroke="#5a9a4a" stroke-width="2" fill="none"/><ellipse cx="24" cy="14" rx="8" ry="6" fill="#4a8a3a"/></svg>`,
  chop_maple:   `<svg viewBox="0 0 48 48"><rect x="22" y="26" width="4" height="16" rx="1" fill="#7a5a2a"/><ellipse cx="24" cy="20" rx="15" ry="13" fill="#c44040"/><ellipse cx="20" cy="17" rx="8" ry="7" fill="#d46040"/><ellipse cx="30" cy="22" rx="7" ry="5" fill="#b43030"/><circle cx="14" cy="16" r="3" fill="#e07050" opacity="0.7"/></svg>`,
  chop_yew:     `<svg viewBox="0 0 48 48"><rect x="21" y="20" width="6" height="22" rx="2" fill="#4a3020"/><ellipse cx="24" cy="16" rx="16" ry="14" fill="#1a4a1a"/><ellipse cx="18" cy="12" rx="8" ry="7" fill="#2a5a2a"/><ellipse cx="32" cy="18" rx="8" ry="6" fill="#1a4a1a"/><circle cx="12" cy="10" r="3" fill="#2a6a2a" opacity="0.5"/></svg>`,
  chop_elder:   `<svg viewBox="0 0 48 48"><rect x="20" y="18" width="8" height="24" rx="3" fill="#3a2a1a"/><path d="M22 18 Q18 10 14 6" stroke="#3a2a1a" stroke-width="3" fill="none"/><path d="M26 18 Q30 10 34 6" stroke="#3a2a1a" stroke-width="3" fill="none"/><ellipse cx="24" cy="14" rx="16" ry="12" fill="#5a3a6a"/><ellipse cx="18" cy="10" rx="7" ry="6" fill="#6a4a7a"/><ellipse cx="32" cy="14" rx="6" ry="5" fill="#4a2a5a"/><circle cx="14" cy="8" r="2" fill="#8a5aaa" opacity="0.5"/><circle cx="34" cy="10" r="2" fill="#8a5aaa" opacity="0.5"/></svg>`,
  // Mining ores
  mine_copper:  `<svg viewBox="0 0 48 48"><path d="M8 42 L24 8 L40 42 Z" fill="#666"/><path d="M14 34 L24 14 L34 34 Z" fill="#777"/><circle cx="20" cy="28" r="4" fill="#c87040"/><circle cx="28" cy="32" r="3" fill="#c87040"/><circle cx="24" cy="24" r="2" fill="#d88050"/></svg>`,
  mine_tin:     `<svg viewBox="0 0 48 48"><path d="M8 42 L24 8 L40 42 Z" fill="#666"/><path d="M14 34 L24 14 L34 34 Z" fill="#777"/><circle cx="20" cy="28" r="4" fill="#a0a0a0"/><circle cx="28" cy="32" r="3" fill="#b0b0b0"/><circle cx="24" cy="24" r="2" fill="#c0c0c0"/></svg>`,
  mine_iron:    `<svg viewBox="0 0 48 48"><path d="M6 42 L24 6 L42 42 Z" fill="#555"/><path d="M12 36 L24 12 L36 36 Z" fill="#666"/><circle cx="20" cy="30" r="4" fill="#8a5030"/><circle cx="30" cy="28" r="3" fill="#7a4020"/><circle cx="24" cy="22" r="3" fill="#9a6040"/></svg>`,
  mine_coal:    `<svg viewBox="0 0 48 48"><path d="M6 42 L24 6 L42 42 Z" fill="#444"/><path d="M12 36 L24 12 L36 36 Z" fill="#555"/><circle cx="18" cy="30" r="4" fill="#1a1a1a"/><circle cx="30" cy="28" r="4" fill="#222"/><circle cx="24" cy="22" r="3" fill="#111"/><circle cx="26" cy="34" r="2" fill="#1a1a1a"/></svg>`,
  mine_gold:    `<svg viewBox="0 0 48 48"><path d="M6 42 L24 6 L42 42 Z" fill="#555"/><path d="M12 36 L24 12 L36 36 Z" fill="#666"/><circle cx="20" cy="28" r="4" fill="#d4a83a"/><circle cx="30" cy="30" r="3" fill="#c49830"/><circle cx="24" cy="22" r="3" fill="#e4b84a"/><circle cx="22" cy="34" r="2" fill="#d4a83a" opacity="0.7"/></svg>`,
  mine_mithril: `<svg viewBox="0 0 48 48"><path d="M6 42 L24 6 L42 42 Z" fill="#445"/><path d="M12 36 L24 12 L36 36 Z" fill="#556"/><circle cx="20" cy="28" r="4" fill="#4060a0"/><circle cx="30" cy="30" r="3" fill="#5070b0"/><circle cx="24" cy="22" r="3" fill="#3050a0"/></svg>`,
  mine_adamant: `<svg viewBox="0 0 48 48"><path d="M6 42 L24 6 L42 42 Z" fill="#343"/><path d="M12 36 L24 12 L36 36 Z" fill="#454"/><circle cx="20" cy="28" r="4" fill="#2a6a2a"/><circle cx="30" cy="30" r="3" fill="#3a8a3a"/><circle cx="24" cy="22" r="3" fill="#1a5a1a"/></svg>`,
  mine_runite:  `<svg viewBox="0 0 48 48"><path d="M6 42 L24 6 L42 42 Z" fill="#335"/><path d="M12 36 L24 12 L36 36 Z" fill="#446"/><circle cx="20" cy="28" r="4" fill="#40a0c0"/><circle cx="30" cy="30" r="3" fill="#50b0d0"/><circle cx="24" cy="22" r="3" fill="#3090b0"/><circle cx="24" cy="28" r="1.5" fill="#60c0e0" opacity="0.6"/></svg>`,
  // Fishing
  fish_shrimp:  `<svg viewBox="0 0 48 48"><ellipse cx="24" cy="36" rx="20" ry="8" fill="#2050a0" opacity="0.3"/><path d="M12 24 Q16 18 24 20 Q32 22 36 28 Q32 32 24 30 Q16 28 12 24Z" fill="#e8a0a0"/><circle cx="14" cy="23" r="1.5" fill="#222"/><path d="M36 28 Q40 24 38 20" stroke="#e8a0a0" stroke-width="2" fill="none"/></svg>`,
  fish_trout:   `<svg viewBox="0 0 48 48"><ellipse cx="24" cy="38" rx="20" ry="6" fill="#2050a0" opacity="0.3"/><path d="M8 24 Q14 16 24 20 Q34 24 40 20 Q38 28 24 28 Q10 28 8 24Z" fill="#7a9a5a"/><circle cx="12" cy="23" r="1.5" fill="#222"/><path d="M40 20 Q44 16 42 12" stroke="#7a9a5a" stroke-width="2" fill="none"/></svg>`,
  fish_lobster: `<svg viewBox="0 0 48 48"><ellipse cx="24" cy="38" rx="18" ry="6" fill="#2050a0" opacity="0.3"/><ellipse cx="24" cy="24" rx="8" ry="10" fill="#c44040"/><path d="M16 18 Q10 12 8 16 Q6 20 10 22" stroke="#c44040" stroke-width="3" fill="none"/><path d="M32 18 Q38 12 40 16 Q42 20 38 22" stroke="#c44040" stroke-width="3" fill="none"/><circle cx="20" cy="18" r="2" fill="#222"/><circle cx="28" cy="18" r="2" fill="#222"/><path d="M22 16 Q18 8 16 10" stroke="#c44040" stroke-width="1.5" fill="none"/><path d="M26 16 Q30 8 32 10" stroke="#c44040" stroke-width="1.5" fill="none"/></svg>`,
  fish_shark:   `<svg viewBox="0 0 48 48"><ellipse cx="24" cy="38" rx="20" ry="6" fill="#2050a0" opacity="0.3"/><path d="M6 26 Q14 18 24 22 Q34 26 42 22 Q40 30 24 30 Q8 30 6 26Z" fill="#607080"/><circle cx="10" cy="25" r="1.5" fill="#222"/><polygon points="24,14 28,22 20,22" fill="#607080"/><path d="M42 22 Q46 18 44 14" stroke="#607080" stroke-width="2" fill="none"/><path d="M8 28 L12 30 L8 32" fill="#fff" opacity="0.5"/></svg>`,
  // Foraging
  forage_herb:  `<svg viewBox="0 0 48 48"><rect x="22" y="28" width="4" height="14" rx="1" fill="#3a5a1a"/><ellipse cx="24" cy="24" rx="10" ry="8" fill="#4a7a2a"/><ellipse cx="20" cy="20" rx="5" ry="4" fill="#5a8a3a"/><circle cx="28" cy="22" r="3" fill="#5a9a3a"/><circle cx="18" cy="26" r="2" fill="#6aaa4a" opacity="0.6"/></svg>`,
  forage_mushroom:`<svg viewBox="0 0 48 48"><rect x="22" y="28" width="4" height="12" rx="1" fill="#e0d8c0"/><ellipse cx="24" cy="26" rx="12" ry="8" fill="#c44040"/><circle cx="20" cy="24" r="2" fill="#e0d8c0"/><circle cx="28" cy="22" r="1.5" fill="#e0d8c0"/><circle cx="24" cy="26" r="1" fill="#e0d8c0"/></svg>`,
  forage_wheat: `<svg viewBox="0 0 48 48"><rect x="22" y="20" width="2" height="22" fill="#c4a83a"/><rect x="18" y="22" width="2" height="20" fill="#b4983a"/><rect x="26" y="24" width="2" height="18" fill="#b4983a"/><ellipse cx="23" cy="16" rx="3" ry="6" fill="#d4b83a"/><ellipse cx="19" cy="18" rx="2.5" ry="5" fill="#c4a83a"/><ellipse cx="27" cy="20" rx="2.5" ry="5" fill="#c4a83a"/></svg>`,
  forage_egg:   `<svg viewBox="0 0 48 48"><ellipse cx="24" cy="28" rx="10" ry="13" fill="#f0e8d0"/><ellipse cx="24" cy="26" rx="8" ry="10" fill="#f8f0e0"/><circle cx="24" cy="24" r="2" fill="#e8d8c0" opacity="0.5"/></svg>`,
  // Cooking
  cook_fire:    `<svg viewBox="0 0 48 48"><rect x="10" y="36" width="28" height="4" rx="1" fill="#5a3a1a"/><rect x="14" y="34" width="20" height="2" fill="#6a4a2a"/><path d="M18 34 Q20 24 24 20 Q28 24 30 34" fill="#ff6a00" opacity="0.8"/><path d="M20 34 Q22 26 24 22 Q26 26 28 34" fill="#ff4a00"/><path d="M22 34 Q24 28 24 24 Q24 28 26 34" fill="#ffa040" opacity="0.7"/><circle cx="24" cy="18" r="3" fill="#ff8040" opacity="0.4"/></svg>`,
  // Smithing
  smith_anvil:  `<svg viewBox="0 0 48 48"><rect x="14" y="28" width="20" height="6" rx="1" fill="#555"/><rect x="12" y="26" width="24" height="4" rx="2" fill="#666"/><rect x="18" y="10" width="4" height="16" fill="#888"/><rect x="16" y="8" width="8" height="4" rx="1" fill="#999"/><rect x="16" y="34" width="4" height="8" rx="1" fill="#444"/><rect x="28" y="34" width="4" height="8" rx="1" fill="#444"/></svg>`,
};

// Assign art to gathering actions by matching IDs
(function assignActionArt() {
  const artMap = {
    // Woodcutting - match by log type
    'chop_oak':'chop_oak','chop_willow':'chop_willow','chop_maple':'chop_maple',
    'chop_yew':'chop_yew','chop_elder':'chop_elder',
    // Mining - match by ore type
    'mine_copper':'mine_copper','mine_tin':'mine_tin','mine_iron':'mine_iron',
    'mine_coal':'mine_coal','mine_gold':'mine_gold','mine_mithril':'mine_mithril',
    'mine_adamant':'mine_adamant','mine_runite':'mine_runite',
    // Foraging
    'forage_herb':'forage_herb','forage_mushroom':'forage_mushroom',
    'forage_wheat':'forage_wheat','forage_egg':'forage_egg',
  };
  // Also auto-match by partial ID
  for (const skill of Object.keys(GAME_DATA.gatheringActions||{})) {
    for (const action of GAME_DATA.gatheringActions[skill]) {
      if (artMap[action.id]) action._art = artMap[action.id];
      else if (action.id.includes('oak')) action._art = 'chop_oak';
      else if (action.id.includes('willow')) action._art = 'chop_willow';
      else if (action.id.includes('maple')) action._art = 'chop_maple';
      else if (action.id.includes('yew')) action._art = 'chop_yew';
      else if (action.id.includes('elder')) action._art = 'chop_elder';
      else if (action.id.includes('copper')) action._art = 'mine_copper';
      else if (action.id.includes('tin')) action._art = 'mine_tin';
      else if (action.id.includes('iron')) action._art = 'mine_iron';
      else if (action.id.includes('coal')) action._art = 'mine_coal';
      else if (action.id.includes('gold')) action._art = 'mine_gold';
      else if (action.id.includes('mithril')) action._art = 'mine_mithril';
      else if (action.id.includes('adamant')) action._art = 'mine_adamant';
      else if (action.id.includes('runite')) action._art = 'mine_runite';
      else if (action.id.includes('shrimp') || action.id.includes('sardine')) action._art = 'fish_shrimp';
      else if (action.id.includes('trout') || action.id.includes('salmon') || action.id.includes('pike')) action._art = 'fish_trout';
      else if (action.id.includes('lobster') || action.id.includes('crab')) action._art = 'fish_lobster';
      else if (action.id.includes('shark') || action.id.includes('swordfish')) action._art = 'fish_shark';
      else if (action.id.includes('mushroom')) action._art = 'forage_mushroom';
      else if (action.id.includes('wheat') || action.id.includes('corn')) action._art = 'forage_wheat';
      else if (action.id.includes('egg')) action._art = 'forage_egg';
      else if (action.id.includes('herb') || action.id.includes('cabbage') || action.id.includes('tomato')) action._art = 'forage_herb';
    }
  }
  console.log('[Ashfall] Action art assigned');
})();

// ── LOOT BAG SYSTEM ──────────────────────────────────────
// Combat loot goes to a temporary bag shown after kills
// Player clicks to collect or auto-collects after 10s
// This is handled in UI - engine already adds to bank
// We just need to track recent drops for display

console.log('[Ashfall] Skill Art & Polish loaded');
console.log('  Action arts:', Object.keys(GAME_DATA.actionArt).length);
