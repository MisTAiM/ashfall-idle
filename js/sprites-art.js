// ================================================================
// ASHFALL IDLE — sprites-art.js
// Complete SVG asset library: NPCs, world bosses, item sprites
//
// DESIGN STANDARD
// ───────────────
// Monsters   80×80 viewBox  dark fantasy palette  glowing eyes
//            readable silhouette at 48px display size
//            world bosses get extra geometry complexity
// NPCs       60×60 viewBox  character-first design
//            class/role readable at a glance
//            consistent with the five existing portraits
// Items      32×32 viewBox  iconic minimal shapes
//            rarity expressed through color saturation & detail
//            readable at 20px (bank grid) and 32px (equip slots)
// Palette    bg-deep #0a0b0f  accent amber #c9873e
//            melee warm earth   ranged cool grey-blue
//            magic deep purple  rare items carry inner glow
// ================================================================

// ── NPC PORTRAITS ────────────────────────────────────────────────
// All seven missing NPCs, matched to the five existing portrait styles

Object.assign(GAME_DATA.npcArt, {

  // Greybeard — Hermit Sage, Ashfall Monastery
  // Ancient, bald, enormous grey beard, prayer robes, staff
  greybeard: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="20" r="13" fill="#c4a87a"/>
    <circle cx="27" cy="18" r="2" fill="#4a3a2a"/>
    <circle cx="33" cy="18" r="2" fill="#4a3a2a"/>
    <path d="M25 24 Q30 27 35 24" fill="none" stroke="#7a5a3a" stroke-width="1.5"/>
    <!-- bald top with age lines -->
    <path d="M18 14 Q20 8 30 10 Q40 8 42 14" fill="#b09870" stroke="none"/>
    <path d="M22 11 Q26 9 30 10" stroke="#9a7850" stroke-width="0.8" fill="none" opacity="0.6"/>
    <!-- giant beard -->
    <path d="M18 26 Q14 32 16 42 Q20 50 30 52 Q40 50 44 42 Q46 32 42 26" fill="#c8c8c8"/>
    <path d="M22 28 Q18 36 20 44 Q24 50 30 50" fill="#d8d8d8" opacity="0.5"/>
    <path d="M24 52 L24 58" stroke="#b8b8b8" stroke-width="1.5"/>
    <path d="M30 53 L30 59" stroke="#b8b8b8" stroke-width="1.5"/>
    <path d="M36 52 L36 58" stroke="#b8b8b8" stroke-width="1.5"/>
    <!-- robes -->
    <rect x="22" y="30" width="16" height="18" rx="3" fill="#5a4a3a"/>
    <!-- prayer beads -->
    <circle cx="22" cy="35" r="1.5" fill="#c4a83a"/>
    <circle cx="22" cy="39" r="1.5" fill="#c4a83a"/>
    <circle cx="22" cy="43" r="1.5" fill="#c4a83a"/>
    <!-- walking staff -->
    <path d="M42 32 L50 58" stroke="#5a3a1a" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="42" cy="30" r="3" fill="#7a5a3a"/>
  </svg>`,

  // Vex the Tracker — Slayer Master, The Hunting Grounds
  // Lean, scarred, dark leather hood, glowing red slayer-mark eyes
  vex: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="22" r="11" fill="#a08060"/>
    <!-- slayer-red eyes -->
    <circle cx="27" cy="20" r="2" fill="#c44040"/>
    <circle cx="33" cy="20" r="2" fill="#c44040"/>
    <circle cx="27" cy="20" r="0.8" fill="#ff8080"/>
    <circle cx="33" cy="20" r="0.8" fill="#ff8080"/>
    <!-- scar across face -->
    <path d="M24 17 L34 25" stroke="#7a4a3a" stroke-width="1.2" fill="none" opacity="0.7"/>
    <!-- dark hood -->
    <path d="M16 14 Q18 4 30 6 Q42 4 44 14 Q46 22 42 28" fill="#2a2a3a" stroke="none"/>
    <path d="M16 14 Q14 22 18 28" fill="#2a2a3a"/>
    <!-- leather armor body -->
    <rect x="23" y="31" width="14" height="20" rx="3" fill="#3a2a1a"/>
    <rect x="25" y="33" width="10" height="6" rx="1" fill="#4a3a2a"/>
    <!-- shoulder pad -->
    <rect x="17" y="33" width="8" height="5" rx="2" fill="#3a2a1a"/>
    <!-- slayer gem on chest -->
    <polygon points="30,37 33,42 30,47 27,42" fill="#c44040" opacity="0.8"/>
    <!-- weapon arm: short blade -->
    <line x1="37" y1="35" x2="46" y2="28" stroke="#7a8294" stroke-width="2.5"/>
    <polygon points="46,28 50,24 48,32" fill="#9da4b4"/>
  </svg>`,

  // Lyra Frostweaver — Cryomancer, Frozen Spire
  // Ice-blue robes, frost crystals, pale skin, ice staff
  lyra: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="20" r="11" fill="#d4c8e8"/>
    <!-- ice-blue eyes -->
    <circle cx="27" cy="18" r="1.8" fill="#4a9ed4"/>
    <circle cx="33" cy="18" r="1.8" fill="#4a9ed4"/>
    <circle cx="27" cy="18" r="0.7" fill="#c8e8f8"/>
    <circle cx="33" cy="18" r="0.7" fill="#c8e8f8"/>
    <!-- slight smile -->
    <path d="M27 24 Q30 26 33 24" fill="none" stroke="#9a80c0" stroke-width="1"/>
    <!-- ice-blue hair, flowing -->
    <path d="M18 14 Q16 8 22 10 Q28 4 30 8 Q32 4 38 10 Q44 8 42 14" fill="#7ac4e8"/>
    <path d="M42 14 Q46 20 44 28" fill="#7ac4e8"/>
    <path d="M18 14 Q14 20 16 28" fill="#7ac4e8"/>
    <!-- frost robes -->
    <rect x="23" y="29" width="14" height="22" rx="3" fill="#3a5a8a"/>
    <path d="M23 29 L18 52" stroke="#4a6a9a" stroke-width="2.5"/>
    <path d="M37 29 L42 52" stroke="#4a6a9a" stroke-width="2.5"/>
    <!-- frost crystal details on robe -->
    <polygon points="30,35 32,40 30,45 28,40" fill="#c8e8f8" opacity="0.5"/>
    <!-- ice staff -->
    <line x1="14" y1="32" x2="12" y2="58" stroke="#7ac4e8" stroke-width="2.5" stroke-linecap="round"/>
    <polygon points="12,30 9,26 15,26" fill="#c8e8f8"/>
    <polygon points="12,30 8,28 10,34" fill="#c8e8f8" opacity="0.6"/>
    <polygon points="12,30 16,28 14,34" fill="#c8e8f8" opacity="0.6"/>
    <!-- frost sparkles -->
    <circle cx="20" cy="38" r="1" fill="#c8e8f8" opacity="0.5"/>
    <circle cx="44" cy="42" r="1" fill="#c8e8f8" opacity="0.4"/>
  </svg>`,

  // Tormund Ashborn — Ashborn Scholar, Ashen Wastes Camp
  // Ash-dusted robes, spectacles, notebook, weathered explorer
  tormund: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="22" r="12" fill="#c4a87a"/>
    <!-- round spectacles -->
    <circle cx="26" cy="21" r="3.5" fill="none" stroke="#5a3a1a" stroke-width="1.5"/>
    <circle cx="34" cy="21" r="3.5" fill="none" stroke="#5a3a1a" stroke-width="1.5"/>
    <line x1="29.5" y1="21" x2="30.5" y2="21" stroke="#5a3a1a" stroke-width="1.5"/>
    <line x1="22.5" y1="21" x2="18" y2="20" stroke="#5a3a1a" stroke-width="1.5"/>
    <line x1="37.5" y1="21" x2="42" y2="20" stroke="#5a3a1a" stroke-width="1.5"/>
    <!-- eyes behind glasses -->
    <circle cx="26" cy="21" r="1.5" fill="#3a2a1a"/>
    <circle cx="34" cy="21" r="1.5" fill="#3a2a1a"/>
    <!-- thoughtful expression -->
    <path d="M27 27 Q30 29 33 27" fill="none" stroke="#7a5a3a" stroke-width="1"/>
    <!-- tousled brown hair -->
    <path d="M18 16 Q20 8 30 10 Q40 8 42 16" fill="#7a5a2a"/>
    <path d="M18 16 Q16 20 18 24" fill="#7a5a2a"/>
    <!-- ash-dusted scholar robes -->
    <rect x="22" y="32" width="16" height="20" rx="3" fill="#6a5a4a"/>
    <path d="M22 32 L18 52" stroke="#5a4a3a" stroke-width="2.5"/>
    <path d="M38 32 L42 52" stroke="#5a4a3a" stroke-width="2.5"/>
    <!-- ash dust marks -->
    <circle cx="25" cy="38" r="1.5" fill="#3a3a3a" opacity="0.3"/>
    <circle cx="36" cy="42" r="1" fill="#3a3a3a" opacity="0.25"/>
    <!-- notebook in hand -->
    <rect x="40" y="34" width="10" height="14" rx="1" fill="#e8d4a8"/>
    <line x1="42" y1="38" x2="48" y2="38" stroke="#7a5a3a" stroke-width="0.8" opacity="0.5"/>
    <line x1="42" y1="41" x2="48" y2="41" stroke="#7a5a3a" stroke-width="0.8" opacity="0.5"/>
    <line x1="42" y1="44" x2="48" y2="44" stroke="#7a5a3a" stroke-width="0.8" opacity="0.5"/>
  </svg>`,

  // Elena Brightshield — Knight Captain, Hollow Watch
  // Full plate, silver order plume, shield + sword, commanding
  elena: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="20" r="11" fill="#d4b89a"/>
    <!-- blue determined eyes -->
    <circle cx="27" cy="18" r="1.8" fill="#3a5a8a"/>
    <circle cx="33" cy="18" r="1.8" fill="#3a5a8a"/>
    <path d="M27 24 Q30 26 33 24" fill="none" stroke="#7a5a3a" stroke-width="1"/>
    <!-- silver knight helmet - visor up -->
    <path d="M17 14 Q19 4 30 6 Q41 4 43 14" fill="#9da4b4" stroke="#6a7284" stroke-width="1"/>
    <rect x="17" y="12" width="26" height="5" rx="1" fill="#7a8294"/>
    <!-- gold captain plume -->
    <path d="M30 5 Q28 1 24 3 Q20 5 22 9" fill="#c4a83a"/>
    <path d="M30 5 Q32 1 36 3 Q40 5 38 9" fill="#d4b84a"/>
    <!-- plate armor body, silver order colors -->
    <rect x="22" y="30" width="16" height="22" rx="2" fill="#7a8294"/>
    <rect x="24" y="32" width="12" height="8" rx="1" fill="#9da4b4"/>
    <!-- silver order emblem: cross -->
    <rect x="28" y="33" width="4" height="6" rx="0.5" fill="#d4d8e0"/>
    <rect x="26" y="35" width="8" height="2" rx="0.5" fill="#d4d8e0"/>
    <!-- sword arm -->
    <line x1="38" y1="32" x2="50" y2="20" stroke="#9da4b4" stroke-width="3" stroke-linecap="round"/>
    <polygon points="50,20 54,16 52,24" fill="#c4c8d4"/>
    <rect x="36" y="30" width="6" height="2" rx="0.5" fill="#c4a83a"/>
    <!-- shield held left -->
    <path d="M16 30 L10 34 L10 44 Q13 50 16 48 L16 30Z" fill="#7a8294" stroke="#5a6274" stroke-width="1"/>
    <path d="M12 34 L13 46" stroke="#9da4b4" stroke-width="1" opacity="0.5"/>
  </svg>`,

  // Morrigan — Blood Mage, The Crimson Library
  // Dark, pale, crimson robes, blood magic aura, severe features
  morrigan: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="20" r="11" fill="#d0b8b8"/>
    <!-- blood-red eyes -->
    <circle cx="27" cy="18" r="2" fill="#c44040"/>
    <circle cx="33" cy="18" r="2" fill="#c44040"/>
    <circle cx="27" cy="18" r="0.8" fill="#ff8080"/>
    <circle cx="33" cy="18" r="0.8" fill="#ff8080"/>
    <!-- thin lips, unsettling smile -->
    <path d="M27 25 Q30 23 33 25" fill="none" stroke="#a03030" stroke-width="1.2"/>
    <!-- jet black hair, straight -->
    <rect x="17" y="10" width="26" height="14" rx="3" fill="#1a1a2a"/>
    <path d="M17 12 L13 30" stroke="#1a1a2a" stroke-width="4" stroke-linecap="round"/>
    <path d="M43 12 L47 30" stroke="#1a1a2a" stroke-width="4" stroke-linecap="round"/>
    <!-- crimson robes with rune-pattern collar -->
    <rect x="22" y="29" width="16" height="22" rx="3" fill="#6a1a2a"/>
    <path d="M22 29 L16 52" stroke="#5a1020" stroke-width="3"/>
    <path d="M38 29 L44 52" stroke="#5a1020" stroke-width="3"/>
    <!-- blood rune patterns on robe -->
    <circle cx="30" cy="38" r="3" fill="none" stroke="#c44040" stroke-width="1" opacity="0.6"/>
    <line x1="30" y1="33" x2="30" y2="35" stroke="#c44040" stroke-width="1" opacity="0.5"/>
    <line x1="28" y1="41" x2="32" y2="41" stroke="#c44040" stroke-width="1" opacity="0.5"/>
    <!-- glowing blood orb in hand -->
    <circle cx="44" cy="34" r="5" fill="#c44040" opacity="0.25"/>
    <circle cx="44" cy="34" r="3" fill="#c44040" opacity="0.5"/>
    <circle cx="44" cy="34" r="1.5" fill="#ff8080"/>
    <!-- dripping blood effect -->
    <path d="M44 39 Q44 43 43 45" stroke="#c44040" stroke-width="1.5" opacity="0.6" fill="none"/>
    <circle cx="43" cy="46" r="1" fill="#c44040" opacity="0.5"/>
  </svg>`,

  // Dorn Ironfist — Blacksmith Elder, The Great Forge
  // Massive, muscular, leather apron, braided beard with metal rings, hammer
  dorn: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="20" r="13" fill="#9a7050"/>
    <!-- deep set dark eyes -->
    <circle cx="26" cy="18" r="2.5" fill="#3a2a1a"/>
    <circle cx="34" cy="18" r="2.5" fill="#3a2a1a"/>
    <circle cx="26" cy="17.5" r="0.8" fill="#6a5a4a"/>
    <circle cx="34" cy="17.5" r="0.8" fill="#6a5a4a"/>
    <!-- bushy brows -->
    <rect x="23" y="13" width="7" height="2" rx="1" fill="#5a3a2a"/>
    <rect x="30" y="13" width="7" height="2" rx="1" fill="#5a3a2a"/>
    <!-- wide flat nose, grimace -->
    <ellipse cx="30" cy="22" rx="3" ry="2" fill="#8a6040"/>
    <path d="M26 27 Q30 25 34 27" fill="none" stroke="#5a3a2a" stroke-width="1.5"/>
    <!-- large bald head, short beard band -->
    <path d="M17 14 Q20 6 30 8 Q40 6 43 14" fill="#7a5030" stroke="none"/>
    <!-- massive braided beard -->
    <path d="M17 26 Q14 34 16 44 Q20 52 30 54 Q40 52 44 44 Q46 34 43 26" fill="#8a6a4a"/>
    <!-- braid texture -->
    <path d="M22 28 Q20 36 22 44" stroke="#6a4a2a" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M38 28 Q40 36 38 44" stroke="#6a4a2a" stroke-width="1.5" fill="none" opacity="0.5"/>
    <!-- metal rings in beard -->
    <circle cx="24" cy="38" r="2" fill="none" stroke="#c4a83a" stroke-width="1.5"/>
    <circle cx="36" cy="42" r="2" fill="none" stroke="#7a8294" stroke-width="1.5"/>
    <circle cx="30" cy="50" r="2" fill="none" stroke="#c4a83a" stroke-width="1.5"/>
    <!-- leather apron / massive torso -->
    <rect x="18" y="30" width="24" height="22" rx="4" fill="#3a2a1a"/>
    <rect x="22" y="32" width="16" height="18" rx="2" fill="#5a3a1a"/>
    <!-- forge glow on apron -->
    <rect x="24" y="38" width="12" height="6" rx="1" fill="#d67338" opacity="0.2"/>
    <!-- soot marks -->
    <circle cx="26" cy="36" r="1.5" fill="#1a0a0a" opacity="0.4"/>
    <circle cx="36" cy="40" r="1" fill="#1a0a0a" opacity="0.3"/>
    <!-- hammer - dominant right hand -->
    <line x1="40" y1="28" x2="54" y2="14" stroke="#5a3a1a" stroke-width="3" stroke-linecap="round"/>
    <rect x="48" y="8" width="8" height="12" rx="2" fill="#7a8294" transform="rotate(-45 52 14)"/>
    <!-- forge-lit forearm -->
    <ellipse cx="44" cy="32" rx="5" ry="7" fill="#8a6040"/>
  </svg>`,

});

// ── WORLD BOSS MONSTER ART ───────────────────────────────────────
// Four world bosses, each with distinctive silhouette and feel

Object.assign(GAME_DATA.monsterArt, {

  // Blight Warden — plague-ridden titan, melee, CL:80
  // Hulking figure, rotting armor, toxic green pustules, spiked club
  blight_warden: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <!-- massive frame -->
    <ellipse cx="40" cy="52" rx="22" ry="18" fill="#3a4a2a"/>
    <!-- left arm with club -->
    <rect x="6" y="28" width="10" height="24" rx="4" fill="#3a4a2a"/>
    <rect x="2" y="20" width="14" height="12" rx="3" fill="#5a5a3a"/>
    <!-- spikes on club -->
    <polygon points="2,20 0,14 6,18" fill="#7a8a3a"/>
    <polygon points="10,20 12,14 16,18" fill="#7a8a3a"/>
    <polygon points="2,26 0,22 4,24" fill="#7a8a3a"/>
    <!-- right arm -->
    <rect x="64" y="32" width="10" height="20" rx="4" fill="#3a4a2a"/>
    <!-- torso, rotting plate -->
    <rect x="24" y="28" width="32" height="34" rx="6" fill="#4a4a3a"/>
    <!-- rotting texture cracks -->
    <path d="M28 32 L34 40 L28 44" stroke="#2a2a1a" stroke-width="1.5" fill="none" opacity="0.6"/>
    <path d="M50 36 L46 44" stroke="#2a2a1a" stroke-width="1.5" fill="none" opacity="0.5"/>
    <!-- plague pustules -->
    <circle cx="32" cy="38" r="4" fill="#6aaa2a" opacity="0.8"/>
    <circle cx="32" cy="38" r="2" fill="#8acc2a"/>
    <circle cx="48" cy="44" r="3" fill="#6aaa2a" opacity="0.7"/>
    <circle cx="48" cy="44" r="1.5" fill="#8acc2a"/>
    <circle cx="38" cy="56" r="3" fill="#6aaa2a" opacity="0.6"/>
    <!-- dripping poison -->
    <path d="M32 42 Q32 48 31 52" stroke="#4a8a0a" stroke-width="2" fill="none" opacity="0.6"/>
    <circle cx="31" cy="54" r="1.5" fill="#4a8a0a" opacity="0.7"/>
    <!-- head - plague-masked skull shape -->
    <circle cx="40" cy="20" r="13" fill="#4a4a3a"/>
    <!-- hollow eye sockets glowing sickly green -->
    <circle cx="35" cy="18" r="4" fill="#1a2a0a"/>
    <circle cx="45" cy="18" r="4" fill="#1a2a0a"/>
    <circle cx="35" cy="18" r="2.5" fill="#6aaa2a" opacity="0.9"/>
    <circle cx="45" cy="18" r="2.5" fill="#6aaa2a" opacity="0.9"/>
    <circle cx="35" cy="18" r="1" fill="#aae82a"/>
    <circle cx="45" cy="18" r="1" fill="#aae82a"/>
    <!-- blight crown: corroded spikes -->
    <polygon points="40,8 38,2 42,6" fill="#5a5a3a"/>
    <polygon points="34,10 31,4 36,8" fill="#4a4a2a"/>
    <polygon points="46,10 49,4 44,8" fill="#4a4a2a"/>
    <!-- rotting mouth grin -->
    <path d="M33 26 Q40 30 47 26" stroke="#2a2a0a" stroke-width="2" fill="none"/>
    <rect x="36" y="25" width="2" height="3" fill="#e8e0d4"/>
    <rect x="40" y="25" width="2" height="3" fill="#e8e0d4"/>
    <!-- legs -->
    <rect x="28" y="60" width="8" height="14" rx="3" fill="#3a3a2a"/>
    <rect x="44" y="60" width="8" height="14" rx="3" fill="#3a3a2a"/>
    <!-- blight aura ground glow -->
    <ellipse cx="40" cy="76" rx="22" ry="4" fill="#4a8a0a" opacity="0.2"/>
  </svg>`,

  // Storm Reaver — lightning-wreathed horror, magic, CL:90
  // Dark elemental figure crackling with electricity, storm crown
  storm_reaver: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <!-- storm aura outer -->
    <ellipse cx="40" cy="44" rx="30" ry="28" fill="#1a2a3a" opacity="0.4"/>
    <!-- body — crackling dark form -->
    <ellipse cx="40" cy="50" rx="18" ry="16" fill="#1a2a4a"/>
    <!-- arms raised, lightning crackling -->
    <path d="M22 40 Q10 30 4 18" stroke="#4a6a9a" stroke-width="4" stroke-linecap="round"/>
    <path d="M58 40 Q70 30 76 18" stroke="#4a6a9a" stroke-width="4" stroke-linecap="round"/>
    <!-- lightning bolts from hands -->
    <polyline points="4,18 0,12 6,15 2,8 10,14 6,8" stroke="#80c0ff" stroke-width="2" fill="none"/>
    <polyline points="76,18 80,12 74,15 78,8 70,14 74,8" stroke="#80c0ff" stroke-width="2" fill="none"/>
    <!-- lightning across chest -->
    <polyline points="24,44 30,40 26,48 34,44 30,52" stroke="#4090d0" stroke-width="1.5" fill="none" opacity="0.7"/>
    <polyline points="56,44 50,40 54,48 46,44 50,52" stroke="#4090d0" stroke-width="1.5" fill="none" opacity="0.7"/>
    <!-- head: storm crown -->
    <circle cx="40" cy="28" r="13" fill="#1a2a4a"/>
    <!-- storm crown spikes -->
    <polygon points="40,16 37,8 43,14" fill="#4a7aaa"/>
    <polygon points="33,18 28,12 34,16" fill="#3a6a9a"/>
    <polygon points="47,18 52,12 46,16" fill="#3a6a9a"/>
    <polygon points="28,24 22,20 28,20" fill="#2a5a8a"/>
    <polygon points="52,24 58,20 52,20" fill="#2a5a8a"/>
    <!-- eyes: electric white-blue -->
    <circle cx="35" cy="26" r="4" fill="#0a1a2a"/>
    <circle cx="45" cy="26" r="4" fill="#0a1a2a"/>
    <circle cx="35" cy="26" r="2.5" fill="#60c0ff"/>
    <circle cx="45" cy="26" r="2.5" fill="#60c0ff"/>
    <circle cx="35" cy="26" r="1" fill="#ffffff"/>
    <circle cx="45" cy="26" r="1" fill="#ffffff"/>
    <!-- lightning arc between eyes -->
    <polyline points="37,26 39,23 41,27 43,24 45,26" stroke="#80d0ff" stroke-width="1.2" fill="none" opacity="0.8"/>
    <!-- grim mouth with lightning -->
    <path d="M33 34 Q40 38 47 34" stroke="#2a4a7a" stroke-width="2" fill="none"/>
    <polyline points="36,33 38,35 40,33 42,35 44,33" stroke="#60c0ff" stroke-width="1" fill="none" opacity="0.6"/>
    <!-- legs into storm cloud base -->
    <path d="M28 64 Q24 72 22 78" stroke="#1a2a4a" stroke-width="7" stroke-linecap="round"/>
    <path d="M52 64 Q56 72 58 78" stroke="#1a2a4a" stroke-width="7" stroke-linecap="round"/>
    <!-- storm ground effect -->
    <ellipse cx="40" cy="78" rx="26" ry="4" fill="#3060a0" opacity="0.25"/>
    <!-- floating lightning wisps -->
    <circle cx="16" cy="36" r="3" fill="#60c0ff" opacity="0.3"/>
    <circle cx="64" cy="42" r="2" fill="#60c0ff" opacity="0.25"/>
    <circle cx="24" cy="58" r="2" fill="#4090d0" opacity="0.2"/>
    <circle cx="58" cy="56" r="1.5" fill="#4090d0" opacity="0.2"/>
  </svg>`,

  // Ashen Overlord — burnt king of the first age, melee, CL:110
  // Lava-cracked obsidian plate, ashfire crown, two-handed burning greatsword
  ashen_overlord: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <!-- heat haze base -->
    <ellipse cx="40" cy="76" rx="26" ry="5" fill="#d63a1a" opacity="0.2"/>
    <!-- lava cracks glow under body -->
    <ellipse cx="40" cy="54" rx="24" ry="20" fill="#2a1a0a"/>
    <!-- legs - massive obsidian -->
    <rect x="24" y="58" width="10" height="16" rx="3" fill="#2a1a0a"/>
    <rect x="46" y="58" width="10" height="16" rx="3" fill="#2a1a0a"/>
    <!-- lava cracks on legs -->
    <path d="M26 60 L30 66 L26 70" stroke="#d67338" stroke-width="1.5" fill="none" opacity="0.7"/>
    <path d="M54 62 L50 68" stroke="#d67338" stroke-width="1.5" fill="none" opacity="0.6"/>
    <!-- torso: massive cracked plate -->
    <rect x="20" y="28" width="40" height="34" rx="6" fill="#1a1a2a"/>
    <!-- lava fissures across torso -->
    <path d="M24 34 L32 42 L28 50" stroke="#d63a1a" stroke-width="2.5" fill="none" opacity="0.8"/>
    <path d="M48 36 L54 44 L48 52" stroke="#d63a1a" stroke-width="2" fill="none" opacity="0.7"/>
    <path d="M34 28 L36 38 L42 44 L40 56" stroke="#ff6020" stroke-width="1.5" fill="none" opacity="0.6"/>
    <!-- shoulder pauldrons: jagged obsidian spikes -->
    <polygon points="18,32 10,26 14,34 8,32 16,38" fill="#1a1a2a"/>
    <polygon points="62,32 70,26 66,34 72,32 64,38" fill="#1a1a2a"/>
    <!-- pauldron lava glow -->
    <path d="M10,28 L14,32" stroke="#d63a1a" stroke-width="1.5" opacity="0.6"/>
    <path d="M70,28 L66,32" stroke="#d63a1a" stroke-width="1.5" opacity="0.6"/>
    <!-- arms -->
    <rect x="8" y="32" width="12" height="22" rx="4" fill="#1a1a2a"/>
    <rect x="60" y="32" width="12" height="22" rx="4" fill="#1a1a2a"/>
    <!-- greatsword — raised right, enormous -->
    <line x1="62" y1="30" x2="78" y2="2" stroke="#3a2a1a" stroke-width="5" stroke-linecap="round"/>
    <!-- blade -->
    <polygon points="78,2 76,-2 80,-2 82,4" fill="#2a2a3a"/>
    <polygon points="70,14 74,10 78,2" fill="#3a3a4a"/>
    <!-- blade is burning -->
    <path d="M72,12 Q76,8 78,2" stroke="#d63a1a" stroke-width="3" fill="none" opacity="0.8"/>
    <path d="M74,10 Q78,6 80,0" stroke="#ff8040" stroke-width="1.5" fill="none" opacity="0.6"/>
    <!-- crossguard -->
    <rect x="58" y="28" width="8" height="3" rx="1" fill="#c9873e"/>
    <!-- head: burnt king -->
    <circle cx="40" cy="18" r="14" fill="#1a1a2a"/>
    <!-- ashfire crown - dominant, royal -->
    <path d="M26 10 Q28 2 34 6 Q38 0 40 4 Q42 0 46 6 Q52 2 54 10" fill="#c9873e"/>
    <!-- crown gems: embers -->
    <circle cx="34" cy="6" r="2" fill="#d63a1a"/>
    <circle cx="40" cy="4" r="2" fill="#ff6020"/>
    <circle cx="46" cy="6" r="2" fill="#d63a1a"/>
    <!-- face: kings should be imposing -->
    <circle cx="35" cy="17" r="4.5" fill="#0a0808"/>
    <circle cx="45" cy="17" r="4.5" fill="#0a0808"/>
    <!-- eyes: burning ember orange -->
    <circle cx="35" cy="17" r="3" fill="#d63a1a"/>
    <circle cx="45" cy="17" r="3" fill="#d63a1a"/>
    <circle cx="35" cy="17" r="1.5" fill="#ff8040"/>
    <circle cx="45" cy="17" r="1.5" fill="#ff8040"/>
    <circle cx="35" cy="17" r="0.5" fill="#ffd080"/>
    <circle cx="45" cy="17" r="0.5" fill="#ffd080"/>
    <!-- nose ridge -->
    <path d="M38 20 L42 20" stroke="#0a0808" stroke-width="1" opacity="0.5"/>
    <!-- burning grimace -->
    <path d="M32 26 Q40 30 48 26" stroke="#5a2a0a" stroke-width="2.5" fill="none"/>
    <!-- teeth -->
    <rect x="35" y="25" width="2.5" height="3" fill="#c4c0b0" opacity="0.7"/>
    <rect x="39" y="25" width="2.5" height="3" fill="#c4c0b0" opacity="0.7"/>
    <rect x="43" y="25" width="2" height="2.5" fill="#c4c0b0" opacity="0.5"/>
    <!-- heat distortion around crown -->
    <path d="M30 8 Q28 4 32 6" stroke="#ff6020" stroke-width="1.5" fill="none" opacity="0.4"/>
    <path d="M50 8 Q52 4 48 6" stroke="#ff6020" stroke-width="1.5" fill="none" opacity="0.4"/>
  </svg>`,

  // Void Emperor — ruler of the void between worlds, magic, CL:120
  // Most terrifying. Reality-warping figure, multiple void eyes, purple-black
  void_emperor: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <!-- outer void aura — reality distortion -->
    <ellipse cx="40" cy="44" rx="36" ry="34" fill="#1a0a2a" opacity="0.5"/>
    <ellipse cx="40" cy="44" rx="30" ry="28" fill="#0a0014" opacity="0.4"/>
    <!-- void tendrils radiating out -->
    <path d="M40 44 Q10 20 4 4" stroke="#5a1a8a" stroke-width="3" fill="none" opacity="0.5"/>
    <path d="M40 44 Q70 20 76 4" stroke="#5a1a8a" stroke-width="3" fill="none" opacity="0.5"/>
    <path d="M40 44 Q4 50 0 68" stroke="#3a0a6a" stroke-width="2.5" fill="none" opacity="0.4"/>
    <path d="M40 44 Q76 50 80 68" stroke="#3a0a6a" stroke-width="2.5" fill="none" opacity="0.4"/>
    <path d="M40 44 Q20 70 14 80" stroke="#2a0a5a" stroke-width="2" fill="none" opacity="0.4"/>
    <path d="M40 44 Q60 70 66 80" stroke="#2a0a5a" stroke-width="2" fill="none" opacity="0.4"/>
    <!-- lesser floating void eyes: reality wrong -->
    <circle cx="12" cy="28" r="5" fill="#1a0a2a"/>
    <circle cx="12" cy="28" r="3" fill="#8a2ab0"/>
    <circle cx="12" cy="28" r="1.5" fill="#d080ff"/>
    <circle cx="68" cy="20" r="4" fill="#1a0a2a"/>
    <circle cx="68" cy="20" r="2.5" fill="#8a2ab0"/>
    <circle cx="68" cy="20" r="1" fill="#d080ff"/>
    <circle cx="8" cy="54" r="3" fill="#1a0a2a"/>
    <circle cx="8" cy="54" r="2" fill="#6a1a9a"/>
    <circle cx="74" cy="48" r="3.5" fill="#1a0a2a"/>
    <circle cx="74" cy="48" r="2" fill="#6a1a9a"/>
    <circle cx="22" cy="14" r="2" fill="#5a0a8a" opacity="0.6"/>
    <circle cx="62" cy="62" r="2" fill="#5a0a8a" opacity="0.5"/>
    <!-- main body: dark void form, slightly translucent -->
    <ellipse cx="40" cy="54" rx="20" ry="18" fill="#0a0a1a" opacity="0.9"/>
    <!-- void robe with reality-tear details -->
    <path d="M22 50 Q14 60 16 72" stroke="#1a0a2a" stroke-width="8" stroke-linecap="round"/>
    <path d="M58 50 Q66 60 64 72" stroke="#1a0a2a" stroke-width="8" stroke-linecap="round"/>
    <!-- void tears on robe (slashes of purple) -->
    <path d="M28 52 L32 60" stroke="#6a0aaa" stroke-width="2" opacity="0.7"/>
    <path d="M48 56 L52 64" stroke="#6a0aaa" stroke-width="1.5" opacity="0.6"/>
    <path d="M36 48 L38 56 L36 60" stroke="#5a0a9a" stroke-width="1.5" opacity="0.5"/>
    <!-- head: crown of void -->
    <circle cx="40" cy="28" r="15" fill="#0a0a1a"/>
    <!-- void crown — angular, impossible geometry -->
    <polygon points="40,14 37,6 43,10" fill="#3a0a5a"/>
    <polygon points="32,16 27,8 34,12" fill="#2a0a4a"/>
    <polygon points="48,16 53,8 46,12" fill="#2a0a4a"/>
    <polygon points="26,22 18,16 26,18" fill="#1a0a3a"/>
    <polygon points="54,22 62,16 54,18" fill="#1a0a3a"/>
    <!-- crown gems: void crystals -->
    <polygon points="40,8 39,6 41,6 42,9 38,9" fill="#b070ff"/>
    <polygon points="32,10 31,8 33,8 34,11 30,11" fill="#8050d0" opacity="0.8"/>
    <polygon points="48,10 47,8 49,8 50,11 46,11" fill="#8050d0" opacity="0.8"/>
    <!-- primary MAIN eyes: three, vertically arranged, unhuman -->
    <circle cx="40" cy="23" r="3" fill="#0a0014"/>
    <circle cx="40" cy="23" r="2" fill="#9030d0"/>
    <circle cx="40" cy="23" r="0.8" fill="#ffffff"/>
    <!-- two flanking main eyes -->
    <ellipse cx="34" cy="27" rx="4" ry="3" fill="#0a0014"/>
    <ellipse cx="34" cy="27" rx="2.5" ry="2" fill="#7020b0"/>
    <ellipse cx="34" cy="27" rx="1" ry="0.8" fill="#d080ff"/>
    <ellipse cx="46" cy="27" rx="4" ry="3" fill="#0a0014"/>
    <ellipse cx="46" cy="27" rx="2.5" ry="2" fill="#7020b0"/>
    <ellipse cx="46" cy="27" rx="1" ry="0.8" fill="#d080ff"/>
    <!-- tiny eye cluster, wrong -->
    <circle cx="30" cy="22" r="1.5" fill="#5a0a9a" opacity="0.7"/>
    <circle cx="50" cy="22" r="1.5" fill="#5a0a9a" opacity="0.7"/>
    <!-- void mouth: screaming void geometry -->
    <path d="M30 36 Q40 44 50 36" fill="#2a0a4a" stroke="none"/>
    <!-- inside the mouth: pure void -->
    <path d="M32 36 Q40 42 48 36 Q40 38 32 36Z" fill="#0a0014"/>
    <!-- reality cracks emanating from mouth -->
    <path d="M30 36 Q24 40 22 46" stroke="#6a0aaa" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M50 36 Q56 40 58 46" stroke="#6a0aaa" stroke-width="1.5" fill="none" opacity="0.5"/>
    <!-- void light: faint ground glow -->
    <ellipse cx="40" cy="78" rx="28" ry="5" fill="#5a0aaa" opacity="0.15"/>
  </svg>`,

});

// ── SPRITE SYSTEM EXTENSIONS ────────────────────────────────────
// Add missing sprite type handlers to the spriteFor() function
// Extends sprites.js without modifying it
//
// CRITICAL: must capture original via window.spriteFor (not the bare name)
// BEFORE assigning the new version. Using a function declaration would hoist
// and overwrite window.spriteFor before the capture line executes.

(function() {
  // Capture the original spriteFor from sprites.js (loaded before this file)
  const _orig = window.spriteFor || null;

  function _defaultSprite() {
    return `<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="10" fill="#7a8294" stroke="#4a5264" stroke-width="1"/><text x="16" y="21" text-anchor="middle" fill="#fff" font-size="14">?</text></svg>`;
  }

  // Assign as expression — not hoisted, so _orig is captured correctly above
  window.spriteFor = function(spriteId) {
    if (!spriteId) return _orig ? _orig(spriteId) : _defaultSprite();
    const [type, variant] = spriteId.split('-');

    switch(type) {
      // ── TOOLS ──────────────────────────────────────────────────
      case 'tool': {
        const c = variant === 'pickaxe' ? '#9da4b4' : variant === 'hatchet' ? '#7a6a4a' : '#6a5a3a';
        if (variant === 'pickaxe') return `<svg viewBox="0 0 32 32"><line x1="6" y1="26" x2="20" y2="12" stroke="#5a3a1a" stroke-width="2"/><path d="M20 12 Q28 4 28 8 Q28 12 24 12 Q26 16 22 16 Q20 12 20 12Z" fill="${c}" stroke="#1a1a1f" stroke-width="1"/></svg>`;
        if (variant === 'hatchet') return `<svg viewBox="0 0 32 32"><line x1="8" y1="28" x2="18" y2="18" stroke="#5a3a1a" stroke-width="2"/><path d="M18 18 Q14 8 20 6 Q28 6 26 12 Q24 18 18 18Z" fill="${c}" stroke="#1a1a1f" stroke-width="1"/></svg>`;
        if (variant === 'rod') return `<svg viewBox="0 0 32 32"><line x1="4" y1="28" x2="28" y2="4" stroke="#7a5a2a" stroke-width="2"/><circle cx="28" cy="4" r="2" fill="${c}"/><path d="M4 28 Q8 20 16 12" stroke="#7a8294" stroke-width="0.8" fill="none" stroke-dasharray="2,2"/><circle cx="16" cy="24" r="2" fill="#4a7ec4" opacity="0.7"/></svg>`;
        return _orig ? _orig(spriteId) : _defaultSprite();
      }

      // ── AMMO ───────────────────────────────────────────────────
      case 'ammo': {
        const c = '#9da4b4';
        return `<svg viewBox="0 0 32 32"><line x1="5" y1="27" x2="23" y2="9" stroke="#7a4a2a" stroke-width="1.5"/><polygon points="23,9 27,5 29,7 25,11" fill="${c}" stroke="#1a1a1f" stroke-width="0.5"/><polygon points="5,27 3,31 7,29" fill="#3a4a3a"/><line x1="9" y1="23" x2="13" y2="19" stroke="#3a4a3a" stroke-width="1.5"/></svg>`;
      }

      // ── BOOKS / TOMES / GRIMOIRES ──────────────────────────────
      case 'item': {
        if (variant === 'book') return `<svg viewBox="0 0 32 32"><rect x="6" y="4" width="20" height="24" rx="2" fill="#7a5a3a" stroke="#1a1a1f" stroke-width="1"/><rect x="6" y="4" width="4" height="24" rx="1" fill="#5a3a1a"/><rect x="10" y="7" width="13" height="1.5" rx="0.5" fill="#c4a87a" opacity="0.5"/><rect x="10" y="11" width="13" height="1.5" rx="0.5" fill="#c4a87a" opacity="0.5"/><rect x="10" y="15" width="10" height="1.5" rx="0.5" fill="#c4a87a" opacity="0.5"/><circle cx="17" cy="22" r="3" fill="#c4a83a" opacity="0.4"/></svg>`;
        return _orig ? _orig(spriteId) : _defaultSprite();
      }

      // ── MISC EXTRAS (extend original misc handling) ────────────
      case 'misc': {
        if (variant === 'pouch') return `<svg viewBox="0 0 32 32"><path d="M10 14 Q8 22 10 26 Q14 30 16 30 Q18 30 22 26 Q24 22 22 14 Q20 8 16 8 Q12 8 10 14Z" fill="#7a5a3a" stroke="#1a1a1f" stroke-width="1"/><path d="M12 14 Q16 12 20 14" stroke="#5a3a1a" stroke-width="2" fill="none"/><path d="M13 14 Q14 8 16 6 Q18 8 19 14" fill="#5a3a1a"/></svg>`;
        if (variant === 'shard') return `<svg viewBox="0 0 32 32"><polygon points="16,4 22,12 20,20 16,24 12,20 10,12" fill="#c8e8f8" stroke="#4a8aa8" stroke-width="1"/><polygon points="16,4 20,12 16,16" fill="#e8f8ff" opacity="0.6"/></svg>`;
        return _orig ? _orig(spriteId) : _defaultSprite();
      }

      // Pass everything else to the original spriteFor from sprites.js
      default:
        return _orig ? _orig(spriteId) : _defaultSprite();
    }
  };
})();

// ── ITEM-SPECIFIC CUSTOM SPRITES ────────────────────────────────
// Override specific items that need unique shapes beyond the generic handler

(function assignCustomItemSprites() {
  const customs = {
    // Spellbook tomes — each with distinct color for its school
    tome_of_pyromancy: `<svg viewBox="0 0 32 32"><rect x="6" y="4" width="20" height="24" rx="2" fill="#5a1a0a" stroke="#1a1a1f" stroke-width="1"/><rect x="6" y="4" width="4" height="24" rx="1" fill="#3a0a00"/><rect x="10" y="7" width="13" height="1" rx="0.5" fill="#d67338" opacity="0.5"/><rect x="10" y="11" width="11" height="1" rx="0.5" fill="#d67338" opacity="0.4"/><rect x="10" y="15" width="9" height="1" rx="0.5" fill="#d67338" opacity="0.4"/><circle cx="17" cy="22" r="3" fill="#d63a1a" opacity="0.5"/><text x="17" y="24" text-anchor="middle" fill="#d63a1a" font-size="5" font-weight="bold">🔥</text></svg>`,
    tome_of_cryomancy: `<svg viewBox="0 0 32 32"><rect x="6" y="4" width="20" height="24" rx="2" fill="#0a2a4a" stroke="#1a1a1f" stroke-width="1"/><rect x="6" y="4" width="4" height="24" rx="1" fill="#051a2a"/><rect x="10" y="7" width="13" height="1" rx="0.5" fill="#4a9ed4" opacity="0.5"/><rect x="10" y="11" width="11" height="1" rx="0.5" fill="#4a9ed4" opacity="0.4"/><rect x="10" y="15" width="9" height="1" rx="0.5" fill="#4a9ed4" opacity="0.4"/><circle cx="17" cy="22" r="3" fill="#4a9ed4" opacity="0.4"/><line x1="17" y1="19" x2="17" y2="25" stroke="#7ac4e8" stroke-width="1.5"/><line x1="14" y1="22" x2="20" y2="22" stroke="#7ac4e8" stroke-width="1.5"/></svg>`,
    grimoire_of_blood: `<svg viewBox="0 0 32 32"><rect x="6" y="4" width="20" height="24" rx="2" fill="#2a0a0a" stroke="#1a1a1f" stroke-width="1"/><rect x="6" y="4" width="4" height="24" rx="1" fill="#1a0505"/><rect x="10" y="7" width="13" height="1" rx="0.5" fill="#c44040" opacity="0.5"/><rect x="10" y="11" width="11" height="1" rx="0.5" fill="#c44040" opacity="0.4"/><rect x="10" y="15" width="9" height="1" rx="0.5" fill="#c44040" opacity="0.4"/><circle cx="17" cy="22" r="3" fill="#c44040" opacity="0.4"/><path d="M17 19 Q19 22 17 25 Q15 22 17 19Z" fill="#c44040" opacity="0.8"/></svg>`,
    codex_of_the_void:  `<svg viewBox="0 0 32 32"><rect x="6" y="4" width="20" height="24" rx="2" fill="#1a0a2a" stroke="#1a1a1f" stroke-width="1"/><rect x="6" y="4" width="4" height="24" rx="1" fill="#100518"/><rect x="10" y="7" width="13" height="1" rx="0.5" fill="#8a3ab0" opacity="0.5"/><rect x="10" y="11" width="11" height="1" rx="0.5" fill="#8a3ab0" opacity="0.4"/><rect x="10" y="15" width="9" height="1" rx="0.5" fill="#8a3ab0" opacity="0.4"/><circle cx="17" cy="22" r="3" fill="#8a3ab0" opacity="0.4"/><circle cx="17" cy="22" r="1" fill="#d080ff" opacity="0.7"/></svg>`,
    necromantic_tome:   `<svg viewBox="0 0 32 32"><rect x="6" y="4" width="20" height="24" rx="2" fill="#1a1a2a" stroke="#1a1a1f" stroke-width="1"/><rect x="6" y="4" width="4" height="24" rx="1" fill="#0a0a15"/><rect x="10" y="7" width="13" height="1" rx="0.5" fill="#7a8294" opacity="0.4"/><rect x="10" y="11" width="11" height="1" rx="0.5" fill="#7a8294" opacity="0.35"/><rect x="10" y="15" width="9" height="1" rx="0.5" fill="#7a8294" opacity="0.35"/><circle cx="14" cy="22" r="2" fill="#3a3a4a"/><circle cx="20" cy="22" r="2" fill="#3a3a4a"/><line x1="14" y1="22" x2="20" y2="22" stroke="#7a8294" stroke-width="0.8" opacity="0.4"/></svg>`,

    // Special weapons
    ashfire_blade: `<svg viewBox="0 0 32 32"><polygon points="16,2 19,5 19,22 13,22 13,5" fill="#d63a1a" stroke="#1a1a1f" stroke-width="1"/><path d="M13 5 Q16 2 19 5" fill="#ff6020" opacity="0.5"/><line x1="16" y1="2" x2="16" y2="22" stroke="#ff8040" stroke-width="1" opacity="0.7"/><rect x="9" y="22" width="14" height="2" fill="#c9873e"/><rect x="14" y="24" width="4" height="6" fill="#3a2a1a"/></svg>`,
    silver_champion_sword: `<svg viewBox="0 0 32 32"><polygon points="16,2 19,5 19,22 13,22 13,5" fill="#d4d8e0" stroke="#1a1a1f" stroke-width="1"/><line x1="16" y1="2" x2="16" y2="22" stroke="#ffffff" stroke-width="1" opacity="0.8"/><polygon points="16,6 17,9 16,12 15,9" fill="#c4a83a" opacity="0.6"/><rect x="9" y="22" width="14" height="2" fill="#c4a83a"/><rect x="14" y="24" width="4" height="6" fill="#5a4a3a"/></svg>`,
    bloodfang_cleaver: `<svg viewBox="0 0 32 32"><polygon points="14,4 22,8 22,22 14,22" fill="#8a2020" stroke="#1a1a1f" stroke-width="1"/><path d="M14 4 Q22 6 22 8" fill="#c44040" opacity="0.4"/><line x1="18" y1="4" x2="18" y2="22" stroke="#c44040" stroke-width="0.8" opacity="0.5"/><rect x="10" y="22" width="12" height="2" fill="#5a3a2a"/><rect x="13" y="24" width="4" height="5" fill="#3a2a1a"/></svg>`,
    voidseer_staff: `<svg viewBox="0 0 32 32"><line x1="16" y1="8" x2="16" y2="30" stroke="#3a1a5a" stroke-width="2"/><circle cx="16" cy="6" r="5" fill="#1a0a2a" stroke="#8a3ab0" stroke-width="1.5"/><circle cx="16" cy="6" r="2.5" fill="#8a3ab0" opacity="0.8"/><circle cx="16" cy="6" r="1" fill="#d080ff"/><circle cx="13" cy="4" r="1" fill="#6a0aaa" opacity="0.5"/><circle cx="19" cy="4" r="1" fill="#6a0aaa" opacity="0.5"/></svg>`,

    // Ashsteel set items
    ashsteel_ore:   `<svg viewBox="0 0 32 32"><polygon points="6,22 10,8 18,6 26,12 24,24 14,26" fill="#d67338" stroke="#1a1a1f" stroke-width="1"/><polygon points="10,18 14,12 20,16 18,22" fill="#ff8040" opacity="0.6"/><circle cx="14" cy="14" r="2" fill="#ffa060" opacity="0.4"/></svg>`,
    ashsteel_bar:   `<svg viewBox="0 0 32 32"><rect x="4" y="12" width="24" height="8" fill="#d67338" stroke="#1a1a1f" stroke-width="1" rx="1"/><rect x="4" y="12" width="24" height="3" fill="#ff8040" opacity="0.5"/><rect x="6" y="15" width="4" height="2" fill="#c9873e" opacity="0.4"/></svg>`,

    // Gear — empty-variant fallbacks (body-  helm-  legs-)
  };

  // Assign custom SVG directly onto items as _customSprite
  for (const [itemId, svg] of Object.entries(customs)) {
    if (GAME_DATA.items[itemId]) GAME_DATA.items[itemId]._customSprite = svg;
  }
})();

// ── RENDER HELPER UPGRADE ────────────────────────────────────────
// Patch renderItemSprite to use _customSprite if present
window.renderItemSprite = function(itemId, size = 32) {
  const item = GAME_DATA.items[itemId];
  if (!item) return '';
  const svg = item._customImage
    ? `<img src="${item._customImage}" style="width:${size}px;height:${size}px;object-fit:contain">`
    : item._customSprite || spriteFor(item.sprite);
  return `<span class="item-sprite" style="width:${size}px;height:${size}px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0">${svg}</span>`;
};

console.log('[Ashfall] sprites-art.js loaded');
console.log('  NPC portraits total:', Object.keys(GAME_DATA.npcArt).length);
console.log('  Monster art total:', Object.keys(GAME_DATA.monsterArt).length);
