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

// ── COMBAT PET ART ────────────────────────────────────────────────
if (!GAME_DATA.petArt) GAME_DATA.petArt = {};

Object.assign(GAME_DATA.petArt, {

  baby_dragon: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="24" cy="30" rx="12" ry="10" fill="#8a3a2a"/>
    <ellipse cx="24" cy="28" rx="9" ry="8" fill="#c44a30"/>
    <!-- wings -->
    <path d="M14 26 Q6 18 8 26 Q12 30 14 28Z" fill="#7a2a1a" opacity="0.8"/>
    <path d="M34 26 Q42 18 40 26 Q36 30 34 28Z" fill="#7a2a1a" opacity="0.8"/>
    <!-- head -->
    <circle cx="24" cy="18" r="9" fill="#c44a30"/>
    <!-- snout -->
    <ellipse cx="24" cy="22" rx="5" ry="3" fill="#a03820"/>
    <!-- eyes glowing -->
    <circle cx="20" cy="16" r="3" fill="#1a0a0a"/><circle cx="20" cy="16" r="1.8" fill="#ff6a20"/><circle cx="20.5" cy="15.5" r="0.6" fill="#ffd080"/>
    <circle cx="28" cy="16" r="3" fill="#1a0a0a"/><circle cx="28" cy="16" r="1.8" fill="#ff6a20"/><circle cx="28.5" cy="15.5" r="0.6" fill="#ffd080"/>
    <!-- tiny horns -->
    <polygon points="20,10 18,6 22,9" fill="#7a2a1a"/>
    <polygon points="28,10 26,6 30,9" fill="#7a2a1a"/>
    <!-- fire breath -->
    <path d="M26 24 Q30 22 34 26 Q30 28 26 26Z" fill="#d67338" opacity="0.7"/>
    <!-- tail -->
    <path d="M32 34 Q40 38 38 44 Q34 42 32 36Z" fill="#8a3a2a"/>
    <!-- legs -->
    <ellipse cx="18" cy="38" rx="4" ry="3" fill="#a03820"/>
    <ellipse cx="30" cy="38" rx="4" ry="3" fill="#a03820"/>
  </svg>`,

  shadow_imp: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="24" cy="32" rx="10" ry="8" fill="#2a1a3a"/>
    <!-- ears -->
    <polygon points="14,18 10,8 18,16" fill="#3a1a4a"/>
    <polygon points="34,18 38,8 30,16" fill="#3a1a4a"/>
    <!-- head -->
    <circle cx="24" cy="20" r="11" fill="#3a1a4a"/>
    <!-- eyes: glowing red -->
    <circle cx="20" cy="18" r="3" fill="#0a0010"/><circle cx="20" cy="18" r="2" fill="#c44040"/><circle cx="20.5" cy="17.5" r="0.7" fill="#ff8080"/>
    <circle cx="28" cy="18" r="3" fill="#0a0010"/><circle cx="28" cy="18" r="2" fill="#c44040"/><circle cx="28.5" cy="17.5" r="0.7" fill="#ff8080"/>
    <!-- grin -->
    <path d="M19 25 Q24 29 29 25" fill="none" stroke="#c44040" stroke-width="1.5"/>
    <rect x="21" y="24" width="2" height="3" fill="#e8d4d4" opacity="0.7"/>
    <rect x="25" y="24" width="2" height="3" fill="#e8d4d4" opacity="0.7"/>
    <!-- shadow hands -->
    <ellipse cx="14" cy="30" rx="4" ry="3" fill="#2a1a3a"/>
    <ellipse cx="34" cy="30" rx="4" ry="3" fill="#2a1a3a"/>
    <!-- tail -->
    <path d="M30 36 Q38 40 36 44" stroke="#3a1a4a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <polygon points="36,44 34,48 38,47" fill="#c44040"/>
    <!-- shadow aura -->
    <circle cx="24" cy="20" r="13" fill="none" stroke="#5a1a7a" stroke-width="1" opacity="0.4" stroke-dasharray="3,3"/>
  </svg>`,

  void_wisp: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <!-- void aura layers -->
    <circle cx="24" cy="24" r="20" fill="#0a0014" opacity="0.3"/>
    <circle cx="24" cy="24" r="15" fill="#1a0a2a" opacity="0.5"/>
    <!-- main body -->
    <circle cx="24" cy="24" r="10" fill="#2a0a4a"/>
    <!-- void eye clusters -->
    <circle cx="20" cy="20" r="4" fill="#0a0014"/><circle cx="20" cy="20" r="2.5" fill="#8a30c0"/><circle cx="20.5" cy="19.5" r="1" fill="#d080ff"/>
    <circle cx="28" cy="22" r="3" fill="#0a0014"/><circle cx="28" cy="22" r="2" fill="#6a20a0"/><circle cx="28.5" cy="21.5" r="0.7" fill="#c060f0"/>
    <circle cx="22" cy="28" r="2.5" fill="#0a0014"/><circle cx="22" cy="28" r="1.5" fill="#5a109a"/><circle cx="22.5" cy="27.5" r="0.5" fill="#b050e0"/>
    <!-- void tendrils -->
    <path d="M24 34 Q20 40 16 44" stroke="#3a0a6a" stroke-width="2" fill="none" opacity="0.7"/>
    <path d="M24 34 Q28 40 32 44" stroke="#3a0a6a" stroke-width="2" fill="none" opacity="0.7"/>
    <path d="M14 20 Q8 18 4 22" stroke="#2a0a5a" stroke-width="1.5" fill="none" opacity="0.5"/>
    <path d="M34 20 Q40 18 44 22" stroke="#2a0a5a" stroke-width="1.5" fill="none" opacity="0.5"/>
    <!-- floating particles -->
    <circle cx="10" cy="14" r="1.5" fill="#6a20a0" opacity="0.5"/>
    <circle cx="38" cy="16" r="1" fill="#6a20a0" opacity="0.4"/>
    <circle cx="14" cy="36" r="1" fill="#5a10a0" opacity="0.4"/>
    <circle cx="38" cy="36" r="1.5" fill="#5a10a0" opacity="0.3"/>
  </svg>`,

  ash_sprite: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <!-- glow -->
    <circle cx="24" cy="24" r="18" fill="#d67338" opacity="0.15"/>
    <!-- body: ember shape -->
    <ellipse cx="24" cy="28" rx="8" ry="7" fill="#d67338"/>
    <!-- wings: heat shimmer -->
    <path d="M16 24 Q8 16 12 24 Q14 28 16 26Z" fill="#c9873e" opacity="0.7"/>
    <path d="M32 24 Q40 16 36 24 Q34 28 32 26Z" fill="#c9873e" opacity="0.7"/>
    <!-- head: bright ember -->
    <circle cx="24" cy="20" r="8" fill="#ff8040"/>
    <!-- amber eyes -->
    <circle cx="21" cy="18" r="2.5" fill="#1a0a00"/><circle cx="21" cy="18" r="1.5" fill="#ffd080"/><circle cx="21.5" cy="17.5" r="0.5" fill="#ffffff"/>
    <circle cx="27" cy="18" r="2.5" fill="#1a0a00"/><circle cx="27" cy="18" r="1.5" fill="#ffd080"/><circle cx="27.5" cy="17.5" r="0.5" fill="#ffffff"/>
    <!-- warm smile -->
    <path d="M21 23 Q24 26 27 23" fill="none" stroke="#c9873e" stroke-width="1.2"/>
    <!-- ash particles floating -->
    <circle cx="16" cy="14" r="1" fill="#888" opacity="0.5"/>
    <circle cx="30" cy="12" r="1.5" fill="#888" opacity="0.4"/>
    <circle cx="34" cy="20" r="1" fill="#aaa" opacity="0.35"/>
    <circle cx="14" cy="28" r="1" fill="#999" opacity="0.3"/>
    <!-- flame tuft on head -->
    <path d="M24 12 Q22 8 24 6 Q26 8 24 12Z" fill="#ff6020"/>
    <path d="M20 14 Q18 10 20 8 Q22 10 20 14Z" fill="#ff8040" opacity="0.7"/>
    <path d="M28 14 Q30 10 28 8 Q26 10 28 14Z" fill="#ff8040" opacity="0.7"/>
    <!-- legs -->
    <ellipse cx="20" cy="34" rx="3" ry="2" fill="#c9873e"/>
    <ellipse cx="28" cy="34" rx="3" ry="2" fill="#c9873e"/>
  </svg>`,

  blight_pup: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="24" cy="32" rx="13" ry="9" fill="#3a4a2a"/>
    <!-- legs -->
    <rect x="14" y="36" width="5" height="8" rx="2" fill="#2a3a1a"/>
    <rect x="20" y="38" width="5" height="6" rx="2" fill="#2a3a1a"/>
    <rect x="27" y="38" width="5" height="6" rx="2" fill="#2a3a1a"/>
    <rect x="33" y="36" width="5" height="8" rx="2" fill="#2a3a1a"/>
    <!-- body -->
    <ellipse cx="24" cy="30" rx="12" ry="8" fill="#4a5a2a"/>
    <!-- blight pustules -->
    <circle cx="18" cy="28" r="2.5" fill="#6aaa2a" opacity="0.8"/><circle cx="18" cy="28" r="1.2" fill="#8acc2a"/>
    <circle cx="30" cy="30" r="2" fill="#6aaa2a" opacity="0.7"/><circle cx="30" cy="30" r="1" fill="#8acc2a"/>
    <!-- head -->
    <circle cx="24" cy="20" r="10" fill="#4a5a2a"/>
    <!-- ears -->
    <ellipse cx="16" cy="14" rx="4" ry="6" fill="#3a4a1a" transform="rotate(-15 16 14)"/>
    <ellipse cx="32" cy="14" rx="4" ry="6" fill="#3a4a1a" transform="rotate(15 32 14)"/>
    <!-- sickly eyes -->
    <circle cx="20" cy="19" r="3" fill="#0a1a0a"/><circle cx="20" cy="19" r="2" fill="#6aaa2a"/><circle cx="20.5" cy="18.5" r="0.7" fill="#aae82a"/>
    <circle cx="28" cy="19" r="3" fill="#0a1a0a"/><circle cx="28" cy="19" r="2" fill="#6aaa2a"/><circle cx="28.5" cy="18.5" r="0.7" fill="#aae82a"/>
    <!-- nose + grin -->
    <ellipse cx="24" cy="23" rx="2.5" ry="1.5" fill="#2a3a1a"/>
    <path d="M20 26 Q24 29 28 26" fill="none" stroke="#4a6a1a" stroke-width="1.5"/>
    <!-- dripping blight -->
    <path d="M22 30 Q22 36 21 38" stroke="#4a8a0a" stroke-width="1.5" fill="none" opacity="0.7"/>
    <circle cx="21" cy="39" r="1.2" fill="#4a8a0a" opacity="0.8"/>
    <!-- tail -->
    <path d="M34 30 Q42 28 40 36" stroke="#3a4a1a" stroke-width="3" fill="none" stroke-linecap="round"/>
  </svg>`,

  storm_cub: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <!-- electric aura -->
    <circle cx="24" cy="24" r="20" fill="#1a2a4a" opacity="0.3"/>
    <ellipse cx="24" cy="30" rx="13" ry="9" fill="#1a2a4a"/>
    <!-- legs -->
    <rect x="14" y="36" width="5" height="8" rx="2" fill="#12203a"/>
    <rect x="20" y="38" width="5" height="6" rx="2" fill="#12203a"/>
    <rect x="27" y="38" width="5" height="6" rx="2" fill="#12203a"/>
    <rect x="33" y="36" width="5" height="8" rx="2" fill="#12203a"/>
    <!-- body -->
    <ellipse cx="24" cy="28" rx="12" ry="8" fill="#2a3a5a"/>
    <!-- lightning marks on body -->
    <polyline points="18,24 20,28 17,30 19,34" stroke="#60c0ff" stroke-width="1.5" fill="none" opacity="0.7"/>
    <!-- head -->
    <circle cx="24" cy="18" r="10" fill="#2a3a5a"/>
    <!-- fluffy ears -->
    <circle cx="16" cy="12" r="5" fill="#1a2a4a"/>
    <circle cx="32" cy="12" r="5" fill="#1a2a4a"/>
    <circle cx="16" cy="12" r="3" fill="#2a3a5a"/>
    <circle cx="32" cy="12" r="3" fill="#2a3a5a"/>
    <!-- electric eyes -->
    <circle cx="20" cy="17" r="3.5" fill="#0a1020"/><circle cx="20" cy="17" r="2" fill="#60c0ff"/><circle cx="20.5" cy="16.5" r="0.8" fill="#ffffff"/>
    <circle cx="28" cy="17" r="3.5" fill="#0a1020"/><circle cx="28" cy="17" r="2" fill="#60c0ff"/><circle cx="28.5" cy="16.5" r="0.8" fill="#ffffff"/>
    <!-- lightning arc between eyes -->
    <polyline points="22,17 24,14 26,17" stroke="#80d0ff" stroke-width="1" fill="none" opacity="0.8"/>
    <!-- nose -->
    <ellipse cx="24" cy="22" rx="2" ry="1.5" fill="#12203a"/>
    <!-- tail with lightning -->
    <path d="M34 30 Q42 26 40 34" stroke="#1a2a4a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <polyline points="34,30 36,26 38,30 40,26" stroke="#60c0ff" stroke-width="1.2" fill="none" opacity="0.6"/>
  </svg>`,

  blood_pup: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="24" cy="30" rx="13" ry="9" fill="#5a2a2a"/>
    <rect x="14" y="36" width="5" height="9" rx="2" fill="#4a1a1a"/>
    <rect x="20" y="38" width="5" height="7" rx="2" fill="#4a1a1a"/>
    <rect x="27" y="38" width="5" height="7" rx="2" fill="#4a1a1a"/>
    <rect x="33" y="36" width="5" height="9" rx="2" fill="#4a1a1a"/>
    <ellipse cx="24" cy="28" rx="12" ry="8" fill="#6a3a3a"/>
    <circle cx="24" cy="18" r="10" fill="#6a3a3a"/>
    <!-- large bloodfang ears - pointed -->
    <polygon points="14,16 10,4 20,14" fill="#5a2a2a"/>
    <polygon points="34,16 38,4 28,14" fill="#5a2a2a"/>
    <!-- fierce red eyes -->
    <circle cx="20" cy="17" r="3.5" fill="#0a0000"/><circle cx="20" cy="17" r="2.2" fill="#c44040"/><circle cx="20.5" cy="16.5" r="0.8" fill="#ff8080"/>
    <circle cx="28" cy="17" r="3.5" fill="#0a0000"/><circle cx="28" cy="17" r="2.2" fill="#c44040"/><circle cx="28.5" cy="16.5" r="0.8" fill="#ff8080"/>
    <!-- snarl with fangs -->
    <path d="M19 24 Q24 28 29 24" fill="#3a1a1a" stroke="#c44040" stroke-width="1"/>
    <polygon points="21,23 20,27 22,27" fill="#e8e0d4"/>
    <polygon points="27,23 26,27 28,27" fill="#e8e0d4"/>
    <!-- blood drips -->
    <path d="M21 27 Q21 32 20 34" stroke="#c44040" stroke-width="1.5" opacity="0.7"/>
    <circle cx="20" cy="35" r="1" fill="#c44040" opacity="0.8"/>
    <!-- tail -->
    <path d="M35 30 Q44 28 42 36" stroke="#5a2a2a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <!-- claws -->
    <line x1="13" y1="44" x2="11" y2="46" stroke="#8a4a4a" stroke-width="1.5"/>
    <line x1="16" y1="44" x2="15" y2="46" stroke="#8a4a4a" stroke-width="1.5"/>
    <line x1="36" y1="44" x2="37" y2="46" stroke="#8a4a4a" stroke-width="1.5"/>
    <line x1="38" y1="44" x2="40" y2="46" stroke="#8a4a4a" stroke-width="1.5"/>
  </svg>`,

  beaver: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="24" cy="32" rx="14" ry="10" fill="#7a5a2a"/>
    <rect x="14" y="38" width="6" height="7" rx="2" fill="#5a3a1a"/>
    <rect x="30" y="38" width="6" height="7" rx="2" fill="#5a3a1a"/>
    <ellipse cx="24" cy="28" rx="12" ry="8" fill="#9a7a4a"/>
    <circle cx="24" cy="18" r="10" fill="#9a7a4a"/>
    <!-- big round ears -->
    <circle cx="15" cy="12" r="5" fill="#7a5a2a"/>
    <circle cx="33" cy="12" r="5" fill="#7a5a2a"/>
    <!-- shiny eyes -->
    <circle cx="20" cy="17" r="3" fill="#1a0a00"/><circle cx="20" cy="17" r="1.8" fill="#3a2a10"/><circle cx="20.5" cy="16.5" r="0.7" fill="#fff" opacity="0.8"/>
    <circle cx="28" cy="17" r="3" fill="#1a0a00"/><circle cx="28" cy="17" r="1.8" fill="#3a2a10"/><circle cx="28.5" cy="16.5" r="0.7" fill="#fff" opacity="0.8"/>
    <!-- big flat nose -->
    <ellipse cx="24" cy="22" rx="3" ry="2" fill="#5a3a1a"/>
    <!-- buckteeth -->
    <rect x="21" y="24" width="3" height="4" rx="1" fill="#e8e0d0"/>
    <rect x="25" y="24" width="3" height="4" rx="1" fill="#e8e0d0"/>
    <!-- flat paddle tail -->
    <ellipse cx="36" cy="36" rx="8" ry="4" fill="#5a3a1a" transform="rotate(-20 36 36)"/>
    <!-- tiny log it carries -->
    <rect x="6" y="28" width="10" height="4" rx="2" fill="#7a5a2a" transform="rotate(-30 11 30)"/>
    <line x1="6" y1="30" x2="16" y2="26" stroke="#9a7a4a" stroke-width="0.8" opacity="0.5"/>
  </svg>`,

  golem: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <!-- stone body: blocky -->
    <rect x="14" y="24" width="20" height="18" rx="3" fill="#6a6a5a"/>
    <rect x="10" y="28" width="8" height="12" rx="2" fill="#5a5a4a"/>
    <rect x="30" y="28" width="8" height="12" rx="2" fill="#5a5a4a"/>
    <rect x="16" y="38" width="7" height="8" rx="2" fill="#5a5a4a"/>
    <rect x="25" y="38" width="7" height="8" rx="2" fill="#5a5a4a"/>
    <!-- stone cracks -->
    <path d="M18 28 L22 34" stroke="#3a3a2a" stroke-width="1.5" opacity="0.5"/>
    <path d="M30 32 L26 38" stroke="#3a3a2a" stroke-width="1" opacity="0.4"/>
    <!-- head: rough stone cube -->
    <rect x="14" y="10" width="20" height="16" rx="3" fill="#7a7a6a"/>
    <!-- glowing mineral eyes -->
    <rect x="18" y="14" width="5" height="4" rx="1" fill="#1a1a10"/>
    <rect x="25" y="14" width="5" height="4" rx="1" fill="#1a1a10"/>
    <rect x="19" y="15" width="3" height="2" rx="0.5" fill="#c9873e"/>
    <rect x="26" y="15" width="3" height="2" rx="0.5" fill="#c9873e"/>
    <!-- stone mouth -->
    <rect x="19" y="21" width="10" height="2" rx="1" fill="#3a3a2a"/>
    <!-- carrying a rock -->
    <circle cx="38" cy="22" r="5" fill="#5a5a4a" stroke="#4a4a3a" stroke-width="1"/>
    <circle cx="38" cy="22" r="3" fill="#4a4a3a" opacity="0.5"/>
  </svg>`,

  ashling_pet: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <!-- flame body -->
    <path d="M24 44 Q12 38 10 28 Q10 18 24 14 Q38 18 38 28 Q36 38 24 44Z" fill="#d67338" opacity="0.9"/>
    <path d="M24 40 Q16 36 14 28 Q14 20 24 18 Q34 20 34 28 Q32 36 24 40Z" fill="#ff8040"/>
    <!-- core face -->
    <ellipse cx="24" cy="26" rx="8" ry="9" fill="#ff6020"/>
    <!-- amber eyes -->
    <circle cx="21" cy="23" r="3" fill="#1a0800"/><circle cx="21" cy="23" r="2" fill="#ffd080"/><circle cx="21.5" cy="22.5" r="0.7" fill="#fff" opacity="0.8"/>
    <circle cx="27" cy="23" r="3" fill="#1a0800"/><circle cx="27" cy="23" r="2" fill="#ffd080"/><circle cx="27.5" cy="22.5" r="0.7" fill="#fff" opacity="0.8"/>
    <!-- happy smile -->
    <path d="M20 30 Q24 34 28 30" fill="none" stroke="#d67338" stroke-width="1.5"/>
    <!-- flame tips -->
    <path d="M24 14 Q22 8 24 4 Q26 8 24 14Z" fill="#ff6020" opacity="0.9"/>
    <path d="M18 16 Q15 10 18 7 Q20 11 18 16Z" fill="#d67338" opacity="0.7"/>
    <path d="M30 16 Q33 10 30 7 Q28 11 30 16Z" fill="#d67338" opacity="0.7"/>
  </svg>`,

  frost_sprite: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <!-- frost aura -->
    <circle cx="24" cy="24" r="20" fill="#7ac4e8" opacity="0.1"/>
    <!-- ice crystal body -->
    <polygon points="24,8 30,20 24,40 18,20" fill="#c8e8f8" opacity="0.8"/>
    <polygon points="10,20 24,14 38,20 24,26" fill="#a8d8f8" opacity="0.7"/>
    <!-- core -->
    <circle cx="24" cy="22" r="8" fill="#7ac4e8" opacity="0.9"/>
    <!-- ice-blue eyes -->
    <circle cx="21" cy="20" r="2.5" fill="#0a2030"/><circle cx="21" cy="20" r="1.5" fill="#4a9ed4"/><circle cx="21.5" cy="19.5" r="0.5" fill="#c8f0ff"/>
    <circle cx="27" cy="20" r="2.5" fill="#0a2030"/><circle cx="27" cy="20" r="1.5" fill="#4a9ed4"/><circle cx="27.5" cy="19.5" r="0.5" fill="#c8f0ff"/>
    <!-- snowflake face detail -->
    <line x1="24" y1="24" x2="24" y2="27" stroke="#7ac4e8" stroke-width="1" opacity="0.6"/>
    <line x1="22" y1="25" x2="26" y2="25" stroke="#7ac4e8" stroke-width="1" opacity="0.6"/>
    <!-- ice crystal wings -->
    <path d="M14 20 Q8 14 12 20 Q14 24 14 22Z" fill="#c8e8f8" opacity="0.7"/>
    <path d="M34 20 Q40 14 36 20 Q34 24 34 22Z" fill="#c8e8f8" opacity="0.7"/>
    <!-- frost sparkles -->
    <circle cx="10" cy="16" r="1" fill="#c8e8f8" opacity="0.6"/>
    <circle cx="38" cy="18" r="1.5" fill="#7ac4e8" opacity="0.5"/>
    <circle cx="14" cy="34" r="1" fill="#c8e8f8" opacity="0.4"/>
    <circle cx="36" cy="32" r="1" fill="#7ac4e8" opacity="0.4"/>
  </svg>`,

  ashen_shade: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <!-- shadow form — translucent, crackling with embers -->
    <ellipse cx="24" cy="38" rx="16" ry="8" fill="#1a0a00" opacity="0.5"/>
    <!-- body trails off into smoke -->
    <path d="M14 40 Q10 32 12 20 Q14 8 24 6 Q34 8 36 20 Q38 32 34 40Z" fill="#1a0a00" opacity="0.7"/>
    <path d="M16 38 Q14 30 16 20 Q18 10 24 8 Q30 10 32 20 Q34 30 32 38Z" fill="#2a1000" opacity="0.8"/>
    <!-- ember cracks in body -->
    <path d="M18 22 L22 28 L18 32" stroke="#d63a1a" stroke-width="1.5" fill="none" opacity="0.7"/>
    <path d="M28 26 L32 30" stroke="#d63a1a" stroke-width="1" fill="none" opacity="0.6"/>
    <path d="M22 16 L24 22 L22 26" stroke="#ff6020" stroke-width="1" fill="none" opacity="0.5"/>
    <!-- burning ember eyes -->
    <circle cx="20" cy="18" r="4" fill="#0a0000"/><circle cx="20" cy="18" r="2.5" fill="#d63a1a"/><circle cx="20" cy="18" r="1.2" fill="#ff8040"/><circle cx="20.5" cy="17.5" r="0.5" fill="#ffd080"/>
    <circle cx="28" cy="18" r="4" fill="#0a0000"/><circle cx="28" cy="18" r="2.5" fill="#d63a1a"/><circle cx="28" cy="18" r="1.2" fill="#ff8040"/><circle cx="28.5" cy="17.5" r="0.5" fill="#ffd080"/>
    <!-- ash smoke rising -->
    <circle cx="18" cy="6" r="2" fill="#3a3030" opacity="0.4"/>
    <circle cx="24" cy="4" r="3" fill="#2a2020" opacity="0.3"/>
    <circle cx="30" cy="5" r="2" fill="#3a3030" opacity="0.35"/>
    <!-- shadow tendrils -->
    <path d="M16 38 Q10 42 8 46" stroke="#1a0a00" stroke-width="3" opacity="0.6" stroke-linecap="round"/>
    <path d="M32 38 Q38 42 40 46" stroke="#1a0a00" stroke-width="3" opacity="0.6" stroke-linecap="round"/>
  </svg>`,
});
console.log('[Ashfall] Pet art loaded:', Object.keys(GAME_DATA.petArt).length, 'pets');

// ── EXPANSION PET ART ──────────────────────────────────────────────
Object.assign(GAME_DATA.petArt, {

  pet_void_hatchling: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="18" fill="#0a0014" opacity="0.5"/>
    <ellipse cx="24" cy="32" rx="10" ry="7" fill="#1a0a2a"/>
    <path d="M14 30 Q8 26 10 34 Q14 36 14 32Z" fill="#0a0014"/>
    <path d="M34 30 Q40 26 38 34 Q34 36 34 32Z" fill="#0a0014"/>
    <circle cx="24" cy="22" r="9" fill="#2a0a4a"/>
    <circle cx="20" cy="19" r="4" fill="#0a0014"/><circle cx="20" cy="19" r="2.5" fill="#9030d0"/><circle cx="20.5" cy="18.5" r="1" fill="#e0a0ff"/>
    <circle cx="28" cy="19" r="4" fill="#0a0014"/><circle cx="28" cy="19" r="2.5" fill="#9030d0"/><circle cx="28.5" cy="18.5" r="1" fill="#e0a0ff"/>
    <circle cx="24" cy="14" r="2" fill="#6a10aa" opacity="0.7"/>
    <path d="M20 27 Q24 30 28 27" fill="none" stroke="#6a10aa" stroke-width="1.5"/>
    <path d="M24 38 Q18 44 14 48" stroke="#1a0a2a" stroke-width="2.5" fill="none" opacity="0.7"/>
    <path d="M24 38 Q30 44 34 48" stroke="#1a0a2a" stroke-width="2.5" fill="none" opacity="0.7"/>
    <circle cx="10" cy="18" r="2" fill="#5a0a9a" opacity="0.5"/>
    <circle cx="38" cy="22" r="1.5" fill="#5a0a9a" opacity="0.4"/>
  </svg>`,

  pet_storm_chick: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="16" fill="#1a2a4a" opacity="0.3"/>
    <ellipse cx="24" cy="32" rx="11" ry="8" fill="#2a3a5a"/>
    <circle cx="24" cy="22" r="10" fill="#3a4a6a"/>
    <ellipse cx="17" cy="17" rx="4" ry="5" fill="#2a3a5a" transform="rotate(-20 17 17)"/>
    <ellipse cx="31" cy="17" rx="4" ry="5" fill="#2a3a5a" transform="rotate(20 31 17)"/>
    <!-- fluffy lightning-streaked body -->
    <path d="M18 28 L22 22 L19 26 L23 20" stroke="#60c0ff" stroke-width="1" fill="none" opacity="0.6"/>
    <circle cx="20" cy="20" r="3" fill="#0a1020"/><circle cx="20" cy="20" r="2" fill="#60c0ff"/><circle cx="20.5" cy="19.5" r="0.7" fill="#fff"/>
    <circle cx="28" cy="20" r="3" fill="#0a1020"/><circle cx="28" cy="20" r="2" fill="#60c0ff"/><circle cx="28.5" cy="19.5" r="0.7" fill="#fff"/>
    <!-- tiny beak -->
    <polygon points="24,24 22,27 26,27" fill="#d4a83a"/>
    <!-- stubby wings -->
    <path d="M14 26 Q8 22 10 30 Q14 32 14 28Z" fill="#2a3a5a"/>
    <path d="M34 26 Q40 22 38 30 Q34 32 34 28Z" fill="#2a3a5a"/>
    <!-- spark on head -->
    <polyline points="24,12 22,8 26,9 24,5" stroke="#80d0ff" stroke-width="1.5" fill="none"/>
  </svg>`,

  pet_dungeon_rat: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="24" cy="32" rx="13" ry="9" fill="#4a4030"/>
    <ellipse cx="18" cy="38" rx="4" ry="3" fill="#3a3020"/><ellipse cx="30" cy="38" rx="4" ry="3" fill="#3a3020"/>
    <ellipse cx="24" cy="28" rx="11" ry="7" fill="#5a5040"/>
    <circle cx="24" cy="20" r="9" fill="#5a5040"/>
    <ellipse cx="17" cy="14" rx="3.5" ry="5" fill="#4a4030" transform="rotate(-10 17 14)"/>
    <ellipse cx="31" cy="14" rx="3.5" ry="5" fill="#4a4030" transform="rotate(10 31 14)"/>
    <circle cx="17" cy="14" r="2" fill="#3a3020"/>
    <circle cx="31" cy="14" r="2" fill="#3a3020"/>
    <!-- red beady eyes -->
    <circle cx="20" cy="19" r="2.5" fill="#0a0000"/><circle cx="20" cy="19" r="1.5" fill="#c44040"/><circle cx="20.5" cy="18.5" r="0.5" fill="#ff8080"/>
    <circle cx="28" cy="19" r="2.5" fill="#0a0000"/><circle cx="28" cy="19" r="1.5" fill="#c44040"/><circle cx="28.5" cy="18.5" r="0.5" fill="#ff8080"/>
    <ellipse cx="24" cy="23" rx="2" ry="1.5" fill="#3a3020"/>
    <path d="M21 25 Q24 28 27 25" fill="none" stroke="#3a3020" stroke-width="1.5"/>
    <!-- whiskers -->
    <line x1="20" y1="22" x2="10" y2="20" stroke="#7a6a50" stroke-width="0.8" opacity="0.7"/>
    <line x1="20" y1="23" x2="10" y2="24" stroke="#7a6a50" stroke-width="0.8" opacity="0.7"/>
    <line x1="28" y1="22" x2="38" y2="20" stroke="#7a6a50" stroke-width="0.8" opacity="0.7"/>
    <line x1="28" y1="23" x2="38" y2="24" stroke="#7a6a50" stroke-width="0.8" opacity="0.7"/>
    <!-- long scaly tail -->
    <path d="M34 32 Q44 30 46 38 Q44 44 40 46" stroke="#3a3020" stroke-width="3" fill="none" stroke-linecap="round"/>
  </svg>`,

  pet_spider_hatchling: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <!-- legs -->
    <line x1="20" y1="24" x2="6" y2="16" stroke="#2a1a3a" stroke-width="2"/>
    <line x1="20" y1="26" x2="6" y2="26" stroke="#2a1a3a" stroke-width="2"/>
    <line x1="20" y1="28" x2="8" y2="36" stroke="#2a1a3a" stroke-width="2"/>
    <line x1="28" y1="24" x2="42" y2="16" stroke="#2a1a3a" stroke-width="2"/>
    <line x1="28" y1="26" x2="42" y2="26" stroke="#2a1a3a" stroke-width="2"/>
    <line x1="28" y1="28" x2="40" y2="36" stroke="#2a1a3a" stroke-width="2"/>
    <!-- abdomen -->
    <ellipse cx="24" cy="32" rx="9" ry="8" fill="#3a1a4a"/>
    <!-- hourglass marking -->
    <polygon points="24,28 26,31 24,34 22,31" fill="#c44040" opacity="0.8"/>
    <!-- cephalothorax -->
    <circle cx="24" cy="22" r="7" fill="#4a2a5a"/>
    <!-- 8 eyes -->
    <circle cx="20" cy="19" r="1.5" fill="#0a0000"/><circle cx="20" cy="19" r="0.9" fill="#60c060"/>
    <circle cx="24" cy="18" r="1.5" fill="#0a0000"/><circle cx="24" cy="18" r="0.9" fill="#60c060"/>
    <circle cx="28" cy="19" r="1.5" fill="#0a0000"/><circle cx="28" cy="19" r="0.9" fill="#60c060"/>
    <circle cx="21" cy="22" r="1" fill="#0a0000"/><circle cx="27" cy="22" r="1" fill="#0a0000"/>
    <!-- fangs -->
    <line x1="22" y1="25" x2="20" y2="28" stroke="#2a1a3a" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="26" y1="25" x2="28" y2="28" stroke="#2a1a3a" stroke-width="1.5" stroke-linecap="round"/>
    <!-- silk thread -->
    <line x1="24" y1="40" x2="24" y2="48" stroke="#a0a0c0" stroke-width="0.8" opacity="0.5"/>
  </svg>`,

  pet_magma_mite: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <!-- glow -->
    <circle cx="24" cy="28" r="16" fill="#d63a1a" opacity="0.2"/>
    <!-- lava pool body -->
    <ellipse cx="24" cy="32" rx="14" ry="9" fill="#2a0a00"/>
    <!-- lava cracks -->
    <path d="M14 30 L20 26 L18 32" stroke="#d63a1a" stroke-width="2" fill="none" opacity="0.8"/>
    <path d="M28 28 L34 32 L30 36" stroke="#ff6020" stroke-width="1.5" fill="none" opacity="0.7"/>
    <!-- small round body floating in lava -->
    <circle cx="24" cy="24" r="10" fill="#1a0800"/>
    <!-- lava cracks on body -->
    <path d="M18 22 L22 26" stroke="#d63a1a" stroke-width="2" opacity="0.8"/>
    <path d="M28 20 L26 26" stroke="#ff6020" stroke-width="1.5" opacity="0.7"/>
    <!-- magma eyes -->
    <circle cx="20" cy="20" r="3.5" fill="#0a0000"/><circle cx="20" cy="20" r="2.2" fill="#d63a1a"/><circle cx="20" cy="20" r="1" fill="#ff8040"/><circle cx="20.5" cy="19.5" r="0.4" fill="#ffd080"/>
    <circle cx="28" cy="20" r="3.5" fill="#0a0000"/><circle cx="28" cy="20" r="2.2" fill="#d63a1a"/><circle cx="28" cy="20" r="1" fill="#ff8040"/><circle cx="28.5" cy="19.5" r="0.4" fill="#ffd080"/>
    <!-- tiny stubby limbs of lava -->
    <ellipse cx="14" cy="28" rx="4" ry="2.5" fill="#1a0800"/>
    <ellipse cx="34" cy="28" rx="4" ry="2.5" fill="#1a0800"/>
    <!-- magma drips -->
    <path d="M20 34 Q20 40 19 42" stroke="#d63a1a" stroke-width="1.5" opacity="0.6"/>
    <circle cx="19" cy="43" r="1.5" fill="#d63a1a" opacity="0.7"/>
  </svg>`,

  pet_ice_familiar: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <!-- ice aura -->
    <circle cx="24" cy="24" r="20" fill="#7ac4e8" opacity="0.1"/>
    <!-- snowflake body structure -->
    <line x1="24" y1="8" x2="24" y2="40" stroke="#7ac4e8" stroke-width="2" opacity="0.5"/>
    <line x1="10" y1="24" x2="38" y2="24" stroke="#7ac4e8" stroke-width="2" opacity="0.5"/>
    <line x1="14" y1="14" x2="34" y2="34" stroke="#7ac4e8" stroke-width="2" opacity="0.4"/>
    <line x1="34" y1="14" x2="14" y2="34" stroke="#7ac4e8" stroke-width="2" opacity="0.4"/>
    <!-- core ice crystal -->
    <polygon points="24,12 28,20 24,28 20,20" fill="#c8e8f8" opacity="0.9"/>
    <polygon points="20,16 24,12 28,16 24,20" fill="#a8d8f8" opacity="0.7"/>
    <!-- tiny face at center -->
    <circle cx="22" cy="19" r="1.5" fill="#0a2030" opacity="0.8"/>
    <circle cx="26" cy="19" r="1.5" fill="#0a2030" opacity="0.8"/>
    <path d="M22 22 Q24 24 26 22" fill="none" stroke="#4a9ed4" stroke-width="1"/>
    <!-- snowflake tips -->
    <circle cx="24" cy="8" r="2" fill="#c8e8f8"/>
    <circle cx="24" cy="40" r="2" fill="#c8e8f8"/>
    <circle cx="10" cy="24" r="2" fill="#c8e8f8"/>
    <circle cx="38" cy="24" r="2" fill="#c8e8f8"/>
    <circle cx="14" cy="14" r="1.5" fill="#a8d8f8"/>
    <circle cx="34" cy="34" r="1.5" fill="#a8d8f8"/>
    <circle cx="34" cy="14" r="1.5" fill="#a8d8f8"/>
    <circle cx="14" cy="34" r="1.5" fill="#a8d8f8"/>
    <!-- sparkle particles -->
    <circle cx="18" cy="30" r="1" fill="#c8e8f8" opacity="0.5"/>
    <circle cx="32" cy="18" r="1" fill="#7ac4e8" opacity="0.5"/>
  </svg>`,

  pet_fishing_spirit: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <!-- water aura -->
    <circle cx="24" cy="26" r="18" fill="#4a9ed4" opacity="0.12"/>
    <!-- wispy water body -->
    <path d="M14 38 Q12 28 16 20 Q20 12 24 10 Q28 12 32 20 Q36 28 34 38Z" fill="#1a4a7a" opacity="0.8"/>
    <path d="M17 36 Q15 28 18 22 Q21 15 24 13 Q27 15 30 22 Q33 28 31 36Z" fill="#2a6a9a" opacity="0.7"/>
    <!-- water ripple body details -->
    <path d="M18 30 Q24 26 30 30" fill="none" stroke="#4a9ed4" stroke-width="1.2" opacity="0.6"/>
    <path d="M17 34 Q24 30 31 34" fill="none" stroke="#4a9ed4" stroke-width="1" opacity="0.4"/>
    <!-- glowing blue eyes -->
    <circle cx="20" cy="20" r="3.5" fill="#0a1a2a"/><circle cx="20" cy="20" r="2.2" fill="#4a9ed4"/><circle cx="20" cy="20" r="1" fill="#c8e8f8"/><circle cx="20.5" cy="19.5" r="0.4" fill="#fff"/>
    <circle cx="28" cy="20" r="3.5" fill="#0a1a2a"/><circle cx="28" cy="20" r="2.2" fill="#4a9ed4"/><circle cx="28" cy="20" r="1" fill="#c8e8f8"/><circle cx="28.5" cy="19.5" r="0.4" fill="#fff"/>
    <!-- serene smile -->
    <path d="M21 25 Q24 28 27 25" fill="none" stroke="#4a9ed4" stroke-width="1.2"/>
    <!-- water-flow tail -->
    <path d="M24 38 Q18 42 14 48" stroke="#1a4a7a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M24 38 Q30 42 34 48" stroke="#1a4a7a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <!-- bubbles -->
    <circle cx="12" cy="24" r="2" fill="none" stroke="#4a9ed4" stroke-width="1" opacity="0.4"/>
    <circle cx="38" cy="28" r="1.5" fill="none" stroke="#4a9ed4" stroke-width="0.8" opacity="0.3"/>
    <circle cx="14" cy="32" r="1" fill="none" stroke="#7ac4e8" stroke-width="0.8" opacity="0.3"/>
  </svg>`,

  pet_phoenix_chick: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <!-- golden flame aura -->
    <circle cx="24" cy="26" r="18" fill="#d4a83a" opacity="0.15"/>
    <!-- tail feathers: long ornate -->
    <path d="M24 36 Q16 42 12 48" stroke="#d4a83a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M24 36 Q24 44 22 48" stroke="#c9873e" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M24 36 Q32 42 36 48" stroke="#d4a83a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M24 36 Q20 44 17 48" stroke="#d67338" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>
    <path d="M24 36 Q28 44 31 48" stroke="#d67338" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>
    <!-- body -->
    <ellipse cx="24" cy="28" rx="11" ry="9" fill="#c9873e"/>
    <ellipse cx="24" cy="26" rx="9" ry="7" fill="#d4a83a"/>
    <!-- golden wings, slightly open -->
    <path d="M14 24 Q6 16 8 24 Q10 28 14 26Z" fill="#c9873e"/>
    <path d="M34 24 Q42 16 40 24 Q38 28 34 26Z" fill="#c9873e"/>
    <!-- head -->
    <circle cx="24" cy="18" r="8" fill="#d4a83a"/>
    <!-- crest feathers: red-gold -->
    <path d="M20 11 Q18 5 22 8Z" fill="#d63a1a"/>
    <path d="M24 10 Q24 4 26 7Z" fill="#d4a83a"/>
    <path d="M28 11 Q30 5 26 8Z" fill="#d63a1a"/>
    <!-- amber eyes -->
    <circle cx="20" cy="17" r="3" fill="#1a0800"/><circle cx="20" cy="17" r="2" fill="#d4a83a"/><circle cx="20.5" cy="16.5" r="0.7" fill="#fff" opacity="0.9"/>
    <circle cx="28" cy="17" r="3" fill="#1a0800"/><circle cx="28" cy="17" r="2" fill="#d4a83a"/><circle cx="28.5" cy="16.5" r="0.7" fill="#fff" opacity="0.9"/>
    <!-- small golden beak -->
    <polygon points="24,21 22,24 26,24" fill="#d4a83a"/>
    <!-- flame sparks around wings -->
    <circle cx="9" cy="20" r="1" fill="#d63a1a" opacity="0.5"/>
    <circle cx="39" cy="20" r="1.5" fill="#d4a83a" opacity="0.5"/>
    <circle cx="12" cy="28" r="1" fill="#ff8040" opacity="0.4"/>
  </svg>`,

});
console.log('[Ashfall] Total pet art entries:', Object.keys(GAME_DATA.petArt).length);

// ══════════════════════════════════════════════════════════════════
// ITEM SPRITES — New weapons, armor sets, accessories
// All 32×32 viewBox. Each has a distinct silhouette readable at 20px.
// ══════════════════════════════════════════════════════════════════

(function assignNewItemSprites() {
  const S = {}; // sprite map

  // ── MELEE WEAPONS ──────────────────────────────────────────────

  // Longswords — longer blade, crossguard, pommel
  const longswordSVG = (blade, guard, hilt) => `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <polygon points="16,2 18,5 18,22 14,22 14,5" fill="${blade}" stroke="#1a1a1f" stroke-width="0.8"/>
    <line x1="16" y1="2" x2="16" y2="22" stroke="#ffffff" stroke-width="0.5" opacity="0.3"/>
    <rect x="10" y="22" width="12" height="2.5" rx="1" fill="${guard}"/>
    <rect x="14.5" y="24.5" width="3" height="6" rx="1" fill="${hilt}"/>
    <circle cx="16" cy="30" r="1.5" fill="${guard}"/>
  </svg>`;
  S['steel_longsword']   = longswordSVG('#c8cad4','#7a8294','#5a3a1a');
  S['mithril_longsword'] = longswordSVG('#7ab4c8','#5a8aa8','#4a3a2a');
  S['adamant_longsword'] = longswordSVG('#4a8a5a','#3a6a4a','#5a3a1a');
  S['runite_longsword']  = longswordSVG('#4a6a9a','#3a5a8a','#c4a83a');

  // Granite Maul — squat, massive hammerhead
  S['granite_maul'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="24" height="14" rx="3" fill="#9a9080" stroke="#1a1a1f" stroke-width="1"/>
    <rect x="8" y="8" width="16" height="4" rx="1" fill="#b4a898" opacity="0.5"/>
    <path d="M6 10 L8 12 L6 14" stroke="#6a6050" stroke-width="1.5" fill="none" opacity="0.6"/>
    <path d="M26 10 L24 12 L26 14" stroke="#6a6050" stroke-width="1.5" fill="none" opacity="0.6"/>
    <rect x="14" y="20" width="4" height="11" rx="1.5" fill="#7a5a2a" stroke="#1a1a1f" stroke-width="0.8"/>
    <rect x="14" y="20" width="4" height="3" fill="#9a7a4a"/>
  </svg>`;

  // Saradomin Sword — holy cross-blade style
  S['saradomin_sword'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <polygon points="16,1 18.5,5 18.5,21 13.5,21 13.5,5" fill="#d4d8e0" stroke="#1a1a1f" stroke-width="0.8"/>
    <line x1="16" y1="1" x2="16" y2="21" stroke="#c4a83a" stroke-width="0.8" opacity="0.6"/>
    <polygon points="14,10 18,10 20,8 18,6 14,6 12,8" fill="#c4a83a" opacity="0.6"/>
    <rect x="9" y="21" width="14" height="2.5" rx="1" fill="#c4a83a" stroke="#a08820" stroke-width="0.5"/>
    <rect x="14.5" y="23.5" width="3" height="7" rx="1" fill="#c4a83a"/>
    <circle cx="16" cy="30" r="1.8" fill="#d4d8e0"/>
    <circle cx="16" cy="30" r="0.8" fill="#c4a83a"/>
  </svg>`;

  // Bandos Godsword — huge two-handed, war-god aesthetic
  S['bandos_godsword'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <polygon points="16,1 20,4 20,23 12,23 12,4" fill="#8a6a3a" stroke="#1a1a1f" stroke-width="1"/>
    <path d="M12 4 Q16 1 20 4" fill="#c4a83a" opacity="0.5"/>
    <line x1="16" y1="2" x2="16" y2="22" stroke="#d4a83a" stroke-width="1" opacity="0.4"/>
    <rect x="7" y="22" width="18" height="3" rx="1.5" fill="#c4a83a" stroke="#8a6a20" stroke-width="0.8"/>
    <polygon points="7,22 4,19 7,25" fill="#c4a83a"/>
    <polygon points="25,22 28,19 25,25" fill="#c4a83a"/>
    <rect x="14" y="25" width="4" height="6" rx="1.5" fill="#5a3a1a"/>
    <circle cx="16" cy="31" r="1.5" fill="#c4a83a"/>
  </svg>`;

  // Dragonite Greataxe — massive axe head with dragon-scale texture
  S['dragonite_greataxe'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6 Q28 4 28 14 Q28 22 18 22 L16 14Z" fill="#d67338" stroke="#1a1a1f" stroke-width="1"/>
    <path d="M18 6 Q24 8 24 14 Q24 20 18 22" fill="#ff8040" opacity="0.4"/>
    <path d="M19 9 L23 11" stroke="#c9873e" stroke-width="1" opacity="0.5"/>
    <path d="M19 13 L25 13" stroke="#c9873e" stroke-width="1" opacity="0.5"/>
    <path d="M19 17 L23 19" stroke="#c9873e" stroke-width="1" opacity="0.5"/>
    <rect x="10" y="5" width="4" height="22" rx="2" fill="#5a3a1a" stroke="#1a1a1f" stroke-width="0.8"/>
    <circle cx="12" cy="28" r="2" fill="#d67338"/>
  </svg>`;

  // Voidreaper — dark blade with void cracks
  S['voidreaper'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <polygon points="16,1 19,4 19,22 13,22 13,4" fill="#1a0a2a" stroke="#8a3ab0" stroke-width="1"/>
    <path d="M13 4 L16 1 L19 4 L17 8 L19 14 L15 18 L13 14 L15 8Z" fill="#3a0a6a" opacity="0.7"/>
    <line x1="16" y1="1" x2="14" y2="12" stroke="#8a3ab0" stroke-width="1.5" opacity="0.8"/>
    <line x1="14" y1="12" x2="18" y2="18" stroke="#6a0aaa" stroke-width="1" opacity="0.7"/>
    <circle cx="16" cy="8" r="1.5" fill="#d080ff" opacity="0.8"/>
    <rect x="10" y="22" width="12" height="2.5" rx="1" fill="#3a0a5a" stroke="#8a3ab0" stroke-width="0.8"/>
    <rect x="14.5" y="24.5" width="3" height="6" rx="1" fill="#2a0a4a"/>
    <circle cx="16" cy="30" r="1.5" fill="#8a3ab0"/>
  </svg>`;

  // Ashen Overlord's Greatblade
  S['ashen_overlord_blade'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <polygon points="16,1 21,4 21,23 11,23 11,4" fill="#1a1a2a" stroke="#d63a1a" stroke-width="1"/>
    <path d="M13 6 L14 12 L16 15 L18 12 L19 6" fill="#d63a1a" opacity="0.4"/>
    <line x1="16" y1="1" x2="16" y2="22" stroke="#d63a1a" stroke-width="1.5" opacity="0.7"/>
    <path d="M11 10 L14 12" stroke="#ff6020" stroke-width="1.2" opacity="0.6"/>
    <path d="M21 10 L18 12" stroke="#ff6020" stroke-width="1.2" opacity="0.6"/>
    <rect x="7" y="23" width="18" height="3" rx="1.5" fill="#2a1000" stroke="#d63a1a" stroke-width="0.8"/>
    <polygon points="7,23 4,20 7,26" fill="#d63a1a" opacity="0.6"/>
    <polygon points="25,23 28,20 25,26" fill="#d63a1a" opacity="0.6"/>
    <rect x="14" y="26" width="4" height="5" rx="1" fill="#1a0a00"/>
    <circle cx="16" cy="31" r="1.5" fill="#d63a1a"/>
  </svg>`;

  // ── RANGED WEAPONS ─────────────────────────────────────────────

  // Maple Shortbow
  S['maple_shortbow'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4 Q22 4 22 16 Q22 28 10 28" fill="none" stroke="#9a7a4a" stroke-width="2.5"/>
    <line x1="10" y1="4" x2="10" y2="28" stroke="#d4b080" stroke-width="1.2"/>
    <line x1="16" y1="14" x2="18" y2="18" stroke="#d4b080" stroke-width="1" opacity="0.5"/>
  </svg>`;

  // Yew Longbow
  S['yew_longbow'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2 Q24 6 24 16 Q24 26 12 30" fill="none" stroke="#7a5a2a" stroke-width="3"/>
    <line x1="12" y1="2" x2="12" y2="30" stroke="#b08040" stroke-width="1.5"/>
    <path d="M18 14 L20 12 L22 16 L20 20 L18 18" fill="#9a7a3a" opacity="0.4"/>
  </svg>`;

  // Magic Shortbow — glowing blue
  S['magic_shortbow'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4 Q22 4 22 16 Q22 28 10 28" fill="none" stroke="#4a9ed4" stroke-width="2.5"/>
    <path d="M10 4 Q20 6 20 16 Q20 26 10 28" fill="none" stroke="#7ac4e8" stroke-width="1" opacity="0.5"/>
    <line x1="10" y1="4" x2="10" y2="28" stroke="#c8e8f8" stroke-width="1.2"/>
    <circle cx="16" cy="16" r="2" fill="#4a9ed4" opacity="0.5"/>
  </svg>`;

  // Twisted Bow — ornate, multiple curves
  S['twisted_bow'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4 Q22 4 22 16 Q22 28 10 28" fill="none" stroke="#c4a83a" stroke-width="2.5"/>
    <path d="M12 6 Q20 8 20 16 Q20 24 12 26" fill="none" stroke="#d4b84a" stroke-width="1.5"/>
    <path d="M14 8 Q18 12 18 16 Q18 20 14 24" fill="none" stroke="#e4c850" stroke-width="1" opacity="0.5"/>
    <line x1="10" y1="4" x2="10" y2="28" stroke="#d4b84a" stroke-width="1.2"/>
    <circle cx="10" cy="4" r="2" fill="#c4a83a"/>
    <circle cx="10" cy="28" r="2" fill="#c4a83a"/>
  </svg>`;

  // Zaryte Crossbow — mechanical, heavy
  S['zaryte_crossbow'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="13" y="8" width="6" height="18" rx="2" fill="#2a0a4a" stroke="#1a1a1f" stroke-width="0.8"/>
    <path d="M8 12 Q10 10 13 12" fill="none" stroke="#8a3ab0" stroke-width="2.5"/>
    <path d="M19 12 Q22 10 24 12" fill="none" stroke="#8a3ab0" stroke-width="2.5"/>
    <line x1="10" y1="11" x2="22" y2="11" stroke="#d080ff" stroke-width="1"/>
    <rect x="12" y="11" width="8" height="3" rx="1" fill="#1a0a2a"/>
    <circle cx="16" cy="12" r="1" fill="#d080ff"/>
    <line x1="15" y1="15" x2="17" y2="21" stroke="#8a3ab0" stroke-width="1" opacity="0.6"/>
    <circle cx="16" cy="8" r="2.5" fill="#3a0a5a" stroke="#8a3ab0" stroke-width="1"/>
    <circle cx="16" cy="8" r="1" fill="#d080ff"/>
  </svg>`;

  // ── MAGIC WEAPONS ──────────────────────────────────────────────

  const wandSVG = (shaft, orb, orbGlow) => `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <line x1="22" y1="10" x2="8" y2="26" stroke="${shaft}" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="23" cy="8" r="5" fill="#1a1a2a" stroke="${orb}" stroke-width="1.5"/>
    <circle cx="23" cy="8" r="3" fill="${orb}" opacity="0.7"/>
    <circle cx="23" cy="8" r="1.5" fill="${orbGlow}"/>
  </svg>`;

  S['master_wand']        = wandSVG('#7a5a2a','#c4a83a','#ffd080');
  S['kodai_wand']         = wandSVG('#3a2a4a','#8a3ab0','#d080ff');
  S['toxic_staff']        = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <line x1="16" y1="8" x2="16" y2="30" stroke="#3a5a1a" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="16" cy="6" r="6" fill="#1a2a0a" stroke="#4a8a1a" stroke-width="1.5"/>
    <circle cx="16" cy="6" r="3.5" fill="#4a8a1a" opacity="0.7"/>
    <circle cx="16" cy="6" r="1.5" fill="#8acc2a"/>
    <path d="M14 18 Q16 14 18 18" stroke="#4a8a1a" stroke-width="1.2" fill="none" opacity="0.6"/>
    <circle cx="16" cy="14" r="1" fill="#6aaa2a" opacity="0.5"/>
  </svg>`;
  S['sanguinesti_staff']  = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <line x1="16" y1="8" x2="16" y2="30" stroke="#3a0a0a" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="16" cy="6" r="6" fill="#1a0000" stroke="#c44040" stroke-width="1.5"/>
    <circle cx="16" cy="6" r="3.5" fill="#c44040" opacity="0.7"/>
    <circle cx="16" cy="6" r="1.5" fill="#ff8080"/>
    <path d="M16 12 Q16 18 15 20" stroke="#c44040" stroke-width="1.5" fill="none" opacity="0.6"/>
    <circle cx="15" cy="21" r="1.5" fill="#c44040" opacity="0.8"/>
  </svg>`;
  S['staff_of_the_dead']  = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <line x1="16" y1="8" x2="16" y2="30" stroke="#2a2a3a" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="16" cy="6" r="6" fill="#1a1a2a" stroke="#7a8294" stroke-width="1.5"/>
    <circle cx="16" cy="4" r="1.5" fill="#c8cad4"/>
    <circle cx="13" cy="7" r="1" fill="#c8cad4" opacity="0.7"/>
    <circle cx="19" cy="7" r="1" fill="#c8cad4" opacity="0.7"/>
    <path d="M13 9 Q16 10 19 9" fill="none" stroke="#7a8294" stroke-width="0.8"/>
  </svg>`;
  S['void_emperor_staff'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <line x1="16" y1="8" x2="16" y2="30" stroke="#1a0a2a" stroke-width="3" stroke-linecap="round"/>
    <circle cx="16" cy="14" r="2" fill="#5a0a9a" opacity="0.4"/>
    <circle cx="16" cy="20" r="1.5" fill="#5a0a9a" opacity="0.3"/>
    <circle cx="16" cy="6" r="7" fill="#0a0014" stroke="#8a3ab0" stroke-width="2"/>
    <circle cx="16" cy="3" r="2" fill="#0a0014"/><circle cx="16" cy="3" r="1.2" fill="#9030d0"/><circle cx="16" cy="3" r="0.5" fill="#fff" opacity="0.8"/>
    <circle cx="13" cy="7" r="1.5" fill="#0a0014"/><circle cx="13" cy="7" r="0.9" fill="#7020b0"/><circle cx="13" cy="7" r="0.4" fill="#e0a0ff"/>
    <circle cx="19" cy="7" r="1.5" fill="#0a0014"/><circle cx="19" cy="7" r="0.9" fill="#7020b0"/><circle cx="19" cy="7" r="0.4" fill="#e0a0ff"/>
  </svg>`;

  // ── ARMOR SETS ─────────────────────────────────────────────────

  // Dragonite — orange-amber scale pattern
  const dragoniteColor = '#d67338';
  S['dragonite_helm']  = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M8 18 Q8 8 16 6 Q24 8 24 18 L22 22 L10 22Z" fill="${dragoniteColor}" stroke="#1a1a1f" stroke-width="1"/><path d="M10 14 Q12 10 16 10 Q20 10 22 14" fill="none" stroke="#ff8040" stroke-width="1" opacity="0.5"/><path d="M9 15 L8 10 L11 12" fill="#c9873e"/><path d="M23 15 L24 10 L21 12" fill="#c9873e"/><rect x="12" y="18" width="8" height="4" rx="1" fill="#1a0a00" opacity="0.4"/></svg>`;
  S['dragonite_plate'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="6" width="16" height="22" rx="4" fill="${dragoniteColor}" stroke="#1a1a1f" stroke-width="1"/><path d="M10 10 Q12 8 16 8 Q20 8 22 10" fill="none" stroke="#ff8040" stroke-width="1" opacity="0.4"/><line x1="16" y1="8" x2="16" y2="26" stroke="#c9873e" stroke-width="1" opacity="0.4"/><path d="M10 14 L14 16" stroke="#ff8040" stroke-width="1" opacity="0.3"/><path d="M18 14 L22 16" stroke="#ff8040" stroke-width="1" opacity="0.3"/></svg>`;

  // Void Stalker — dark teal ranger set
  const vsColor = '#2a5a5a';
  S['void_stalker_coif']   = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M8 18 Q8 8 16 6 Q24 8 24 18 L22 22 L10 22Z" fill="${vsColor}" stroke="#1a1a1f" stroke-width="1"/><circle cx="13" cy="14" r="2" fill="#0a1a1a"/><circle cx="19" cy="14" r="2" fill="#0a1a1a"/><circle cx="13" cy="14" r="1" fill="#4a9a9a" opacity="0.8"/><circle cx="19" cy="14" r="1" fill="#4a9a9a" opacity="0.8"/></svg>`;
  S['void_stalker_body']   = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="6" width="16" height="22" rx="4" fill="${vsColor}" stroke="#1a1a1f" stroke-width="1"/><rect x="10" y="8" width="4" height="10" rx="2" fill="#1a3a3a" opacity="0.6"/><rect x="18" y="8" width="4" height="10" rx="2" fill="#1a3a3a" opacity="0.6"/><path d="M10 14 Q16 18 22 14" fill="none" stroke="#4a9a9a" stroke-width="1" opacity="0.4"/></svg>`;

  // Shadowscale — near-black with silver scale sheen
  const ssColor = '#1a1a2a';
  S['shadowscale_coif'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M8 18 Q8 8 16 6 Q24 8 24 18 L22 22 L10 22Z" fill="${ssColor}" stroke="#4a5264" stroke-width="1"/><path d="M10 12 Q12 10 14 12 Q12 14 10 12Z" fill="#4a5264" opacity="0.5"/><path d="M14 10 Q16 8 18 10 Q16 12 14 10Z" fill="#4a5264" opacity="0.5"/><path d="M18 12 Q20 10 22 12 Q20 14 18 12Z" fill="#4a5264" opacity="0.5"/></svg>`;
  S['shadowscale_body'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="6" width="16" height="22" rx="4" fill="${ssColor}" stroke="#4a5264" stroke-width="1"/><path d="M10 10 Q12 8 14 10 Q12 12 10 10Z" fill="#4a5264" opacity="0.4"/><path d="M14 8 Q16 6 18 8 Q16 10 14 8Z" fill="#4a5264" opacity="0.4"/><path d="M18 10 Q20 8 22 10 Q20 12 18 10Z" fill="#4a5264" opacity="0.4"/><path d="M10 16 Q12 14 14 16 Q12 18 10 16Z" fill="#4a5264" opacity="0.3"/><path d="M18 16 Q20 14 22 16 Q20 18 18 16Z" fill="#4a5264" opacity="0.3"/></svg>`;

  // Void Emperor magic set — deep purple with void eye motifs
  S['void_emperor_hat']       = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M8 18 Q8 8 16 5 Q24 8 24 18 L22 22 L10 22Z" fill="#1a0a2a" stroke="#8a3ab0" stroke-width="1"/><circle cx="16" cy="10" r="3" fill="#0a0014"/><circle cx="16" cy="10" r="2" fill="#9030d0" opacity="0.8"/><circle cx="16" cy="10" r="0.8" fill="#e0a0ff"/><polygon points="16,5 14,2 18,2" fill="#3a0a5a" opacity="0.8"/></svg>`;
  S['void_emperor_robe']      = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="6" width="16" height="22" rx="4" fill="#1a0a2a" stroke="#8a3ab0" stroke-width="1"/><circle cx="16" cy="14" r="3.5" fill="#0a0014"/><circle cx="16" cy="14" r="2.5" fill="#9030d0" opacity="0.7"/><circle cx="16" cy="14" r="1" fill="#e0a0ff"/><path d="M10 8 L12 12" stroke="#5a0a9a" stroke-width="1.2" opacity="0.5"/><path d="M22 8 L20 12" stroke="#5a0a9a" stroke-width="1.2" opacity="0.5"/></svg>`;
  S['void_emperor_robe_legs'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M8 6 L24 6 L26 28 L18 28 L16 22 L14 28 L6 28Z" fill="#1a0a2a" stroke="#8a3ab0" stroke-width="1"/><circle cx="12" cy="14" r="2" fill="#0a0014"/><circle cx="12" cy="14" r="1.2" fill="#7020b0" opacity="0.7"/><circle cx="20" cy="14" r="2" fill="#0a0014"/><circle cx="20" cy="14" r="1.2" fill="#7020b0" opacity="0.7"/></svg>`;

  // ── ACCESSORIES ────────────────────────────────────────────────

  // Amulets — distinct shapes per tier
  S['amulet_of_strength']  = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M6 6 Q16 4 26 6" fill="none" stroke="#c8cad4" stroke-width="1.5"/><polygon points="16,12 22,18 16,28 10,18" fill="#d4a83a" stroke="#1a1a1f" stroke-width="1"/><circle cx="16" cy="18" r="2" fill="#ffd080"/></svg>`;
  S['amulet_of_fury']      = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M6 5 Q16 3 26 5" fill="none" stroke="#c4a83a" stroke-width="1.5"/><polygon points="16,10 23,17 16,29 9,17" fill="#d63a1a" stroke="#1a1a1f" stroke-width="1"/><polygon points="16,10 21,17 16,24 11,17" fill="#ff6020" opacity="0.5"/><circle cx="16" cy="17" r="2.5" fill="#ffd080"/><circle cx="16" cy="17" r="1" fill="#ffffff" opacity="0.8"/></svg>`;
  S['amulet_of_torture']   = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M6 5 Q16 2 26 5" fill="none" stroke="#d4a83a" stroke-width="2"/><polygon points="16,9 24,16 16,29 8,16" fill="#c4a83a" stroke="#1a1a1f" stroke-width="1"/><polygon points="16,9 22,16 16,26 10,16" fill="#ffd080" opacity="0.5"/><circle cx="16" cy="16" r="3" fill="#d4a83a"/><circle cx="16" cy="16" r="1.5" fill="#ffffff" opacity="0.9"/><path d="M16 9 L16 12" stroke="#ffd080" stroke-width="1.5"/></svg>`;
  S['occult_necklace']     = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M6 5 Q16 3 26 5" fill="none" stroke="#8a3ab0" stroke-width="1.5"/><circle cx="16" cy="19" r="9" fill="#1a0a2a" stroke="#8a3ab0" stroke-width="1.5"/><circle cx="16" cy="16" r="2.5" fill="#0a0014"/><circle cx="16" cy="16" r="1.5" fill="#9030d0" opacity="0.8"/><circle cx="16" cy="16" r="0.6" fill="#e0a0ff"/><circle cx="13" cy="21" r="1" fill="#5a0a9a" opacity="0.6"/><circle cx="19" cy="21" r="1" fill="#5a0a9a" opacity="0.6"/></svg>`;
  S['necklace_of_anguish'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M6 5 Q16 2 26 5" fill="none" stroke="#6ab4e8" stroke-width="2"/><polygon points="16,10 22,17 20,26 12,26 10,17" fill="#4a9ed4" stroke="#1a1a1f" stroke-width="1"/><line x1="16" y1="10" x2="16" y2="26" stroke="#7ac4e8" stroke-width="1" opacity="0.5"/><circle cx="16" cy="16" r="2" fill="#c8e8f8"/></svg>`;

  // Rings — distinct gem shapes
  S['ring_of_wealth']    = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="18" r="8" fill="none" stroke="#c4a83a" stroke-width="2.5"/><polygon points="16,8 18,11 16,14 14,11" fill="#c4a83a" stroke="#1a1a1f" stroke-width="0.8"/><circle cx="16" cy="11" r="1.5" fill="#ffd080"/></svg>`;
  S['berserker_ring']    = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="18" r="8" fill="none" stroke="#c44040" stroke-width="2.5"/><polygon points="16,8 18,11 16,15 14,11" fill="#c44040" stroke="#1a1a1f" stroke-width="0.8"/><circle cx="16" cy="11" r="1.5" fill="#ff8080"/></svg>`;
  S['archers_ring']      = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="18" r="8" fill="none" stroke="#4a8a3e" stroke-width="2.5"/><polygon points="16,8 18,11 16,15 14,11" fill="#4a8a3e" stroke="#1a1a1f" stroke-width="0.8"/><circle cx="16" cy="11" r="1.5" fill="#a0e080"/></svg>`;
  S['seers_ring']        = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="18" r="8" fill="none" stroke="#4a7ec4" stroke-width="2.5"/><polygon points="16,8 18,11 16,15 14,11" fill="#4a7ec4" stroke="#1a1a1f" stroke-width="0.8"/><circle cx="16" cy="11" r="1.5" fill="#90c0ff"/></svg>`;

  // Capes — silhouette + motif
  S['obsidian_cape'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M10 4 L22 4 L26 28 L6 28Z" fill="#2a2a3a" stroke="#4a4a5a" stroke-width="1"/><line x1="16" y1="4" x2="16" y2="28" stroke="#4a4a5a" stroke-width="1" opacity="0.5"/><path d="M10 14 Q16 18 22 14" fill="none" stroke="#7a8294" stroke-width="1" opacity="0.4"/></svg>`;
  S['fire_cape']     = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M10 4 L22 4 L26 28 L6 28Z" fill="#d63a1a" stroke="#1a1a1f" stroke-width="1"/><path d="M12 28 Q11 22 14 18 Q12 24 16 20 Q14 26 18 22 Q16 27 20 24 Q18 28 21 28" fill="#ff8040" opacity="0.5"/><line x1="16" y1="4" x2="16" y2="28" stroke="#ff6020" stroke-width="1" opacity="0.4"/></svg>`;
  S['infernal_cape'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M10 4 L22 4 L26 28 L6 28Z" fill="#1a0a00" stroke="#d63a1a" stroke-width="1.5"/><path d="M10 24 Q9 18 12 14 Q10 20 14 16 Q12 22 17 17 Q15 23 20 18 Q18 24 22 22 Q20 27 22 28" fill="#d63a1a" opacity="0.6"/><line x1="16" y1="4" x2="16" y2="28" stroke="#d63a1a" stroke-width="1.5" opacity="0.5"/><path d="M13 8 Q16 4 19 8" fill="#ff6020" opacity="0.4"/></svg>`;

  // ── ASSIGN ALL ──────────────────────────────────────────────────
  for (const [itemId, svg] of Object.entries(S)) {
    if (GAME_DATA.items[itemId]) {
      GAME_DATA.items[itemId]._customSprite = svg;
    }
  }

  // Also set sprite type strings for the generic renderer fallback
  const spriteTypes = {
    // longswords
    steel_longsword:'sword', mithril_longsword:'sword', adamant_longsword:'sword', runite_longsword:'sword',
    // new weapons
    granite_maul:'mace', saradomin_sword:'sword', bandos_godsword:'sword',
    dragonite_greataxe:'axe', voidreaper:'sword', ashen_overlord_blade:'sword',
    maple_shortbow:'bow', yew_longbow:'bow', magic_shortbow:'bow',
    twisted_bow:'bow', zaryte_crossbow:'bow',
    master_wand:'wand', toxic_staff:'staff', sanguinesti_staff:'staff',
    staff_of_the_dead:'staff', void_emperor_staff:'staff',
    // armor
    dragonite_helm:'helm', dragonite_plate:'body', dragonite_legs:'legs',
    dragonite_boots:'boots', dragonite_gloves:'gloves', dragonite_shield:'shield',
    void_stalker_coif:'cowl', void_stalker_body:'body', void_stalker_chaps:'chaps',
    shadowscale_coif:'cowl', shadowscale_body:'body', shadowscale_chaps:'chaps',
    void_emperor_hat:'hat', void_emperor_robe:'robe', void_emperor_robe_legs:'skirt',
    // accessories
    amulet_of_strength:'amulet', amulet_of_fury:'amulet',
    amulet_of_torture:'amulet', occult_necklace:'amulet', necklace_of_anguish:'amulet',
    ring_of_wealth:'ring', berserker_ring:'ring', archers_ring:'ring', seers_ring:'ring',
    team_cape:'cape', obsidian_cape:'cape', fire_cape:'cape', infernal_cape:'cape',
  };
  for (const [itemId, sprite] of Object.entries(spriteTypes)) {
    if (GAME_DATA.items[itemId] && !GAME_DATA.items[itemId].sprite) {
      GAME_DATA.items[itemId].sprite = sprite;
    }
  }

  console.log('[Ashfall] Item sprites assigned:', Object.keys(S).length, 'custom SVGs');
})();

// ================================================================
// THEATRE OF ASH — Item Sprites
// ================================================================
(function assignToaSprites() {
  const T = {};

  // ── WEAPONS ──────────────────────────────────────────────────
  T['veriax_scythe'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <!-- Pole -->
    <rect x="14" y="4" width="3" height="24" rx="1.5" fill="#1a0028" stroke="#9b30d0" stroke-width="0.8"/>
    <!-- Blade - sweeping curve -->
    <path d="M17 4 Q28 2 30 10 Q28 18 16 16 Q20 10 17 4Z" fill="#9b30d0" stroke="#6a0a8a" stroke-width="0.8"/>
    <path d="M17 4 Q24 4 26 10 Q24 14 18 14 Q20 9 17 4Z" fill="#c050f0" opacity="0.5"/>
    <!-- Counter-blade small -->
    <path d="M16 16 Q8 20 6 16 Q10 14 16 16Z" fill="#7020b0" stroke="#9b30d0" stroke-width="0.5"/>
    <!-- Orb at base -->
    <circle cx="15.5" cy="28" r="2.5" fill="#050010" stroke="#9b30d0" stroke-width="1"/>
    <circle cx="15.5" cy="28" r="1.2" fill="#9b30d0"/>
    <!-- Glow hint -->
    <circle cx="23" cy="8" r="2" fill="#d080ff" opacity="0.3"/>
  </svg>`;

  T['bloodfire_staff'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <!-- Shaft -->
    <line x1="16" y1="8" x2="16" y2="30" stroke="#2a0a08" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Orb -->
    <circle cx="16" cy="6" r="7" fill="#0a0000" stroke="#c44040" stroke-width="1.5"/>
    <circle cx="16" cy="6" r="5" fill="#8a0a0a" opacity="0.8"/>
    <circle cx="16" cy="6" r="3" fill="#c44040" opacity="0.9"/>
    <circle cx="16" cy="6" r="1.5" fill="#ff8080"/>
    <!-- Fire wisps -->
    <path d="M12 14 Q10 18 12 22 Q14 18 12 14Z" fill="#c44040" opacity="0.4"/>
    <path d="M20 14 Q22 18 20 22 Q18 18 20 14Z" fill="#c44040" opacity="0.4"/>
    <!-- Blood drops -->
    <circle cx="14" cy="24" r="1.5" fill="#8a0a0a" opacity="0.7"/>
    <circle cx="18" cy="27" r="1" fill="#8a0a0a" opacity="0.6"/>
    <!-- Purple void mixing -->
    <circle cx="19" cy="3" r="2" fill="#5a0a9a" opacity="0.4"/>
  </svg>`;

  T['ashen_rapier'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <!-- Blade — very thin, long -->
    <polygon points="16,1 17,2 17,24 15,24 15,2" fill="#c8cad4" stroke="#8a8a9a" stroke-width="0.5"/>
    <line x1="16" y1="1" x2="16" y2="24" stroke="#e8eaf0" stroke-width="0.5" opacity="0.6"/>
    <!-- Crossguard — ornate -->
    <path d="M8 24 Q12 22 16 24 Q20 22 24 24 Q20 26 16 24 Q12 26 8 24Z" fill="#c9873e" stroke="#8a6020" stroke-width="0.5"/>
    <circle cx="8" cy="24" r="1.5" fill="#d4a83a"/>
    <circle cx="24" cy="24" r="1.5" fill="#d4a83a"/>
    <!-- Grip -->
    <rect x="14.5" y="24" width="3" height="6" rx="1.5" fill="#1a0a00" stroke="#6a4010" stroke-width="0.5"/>
    <circle cx="16" cy="30" r="1.8" fill="#c9873e"/>
    <!-- Ash particles -->
    <circle cx="12" cy="10" r="0.8" fill="#888" opacity="0.4"/>
    <circle cx="20" cy="16" r="0.6" fill="#888" opacity="0.3"/>
  </svg>`;

  // ── JUDICATOR ARMOR ───────────────────────────────────────────
  T['judicator_helm'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 20 Q6 8 16 6 Q26 8 26 20 L24 24 L8 24Z" fill="#0a1a2a" stroke="#9b30d0" stroke-width="1.5"/>
    <path d="M8 16 Q10 10 16 10 Q22 10 24 16" fill="none" stroke="#d4a83a" stroke-width="1" opacity="0.6"/>
    <!-- Void eye visor -->
    <path d="M10 17 Q16 14 22 17 Q22 20 16 22 Q10 20 10 17Z" fill="#050010" stroke="#9b30d0" stroke-width="1"/>
    <circle cx="16" cy="18" r="3" fill="#9b30d0" opacity="0.8"/>
    <circle cx="16" cy="18" r="1.5" fill="#e0a0ff"/>
    <!-- Crown spikes -->
    <path d="M10 8 L9 4 M16 6 L16 2 M22 8 L23 4" stroke="#d4a83a" stroke-width="1.5" stroke-linecap="round"/>
    <!-- Sigil on brow -->
    <path d="M13 13 L16 11 L19 13 L16 15Z" fill="#d4a83a" opacity="0.4"/>
  </svg>`;

  T['judicator_plate'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="20" height="24" rx="5" fill="#0a1a2a" stroke="#9b30d0" stroke-width="1.5"/>
    <!-- Center void eye -->
    <circle cx="16" cy="15" r="5" fill="#050010" stroke="#9b30d0" stroke-width="1"/>
    <circle cx="16" cy="15" r="3.5" fill="#9b30d0" opacity="0.8"/>
    <circle cx="16" cy="15" r="1.5" fill="#e0a0ff"/>
    <circle cx="16" cy="15" r="0.6" fill="#fff" opacity="0.8"/>
    <!-- Gold trim lines -->
    <path d="M8 10 Q16 8 24 10" fill="none" stroke="#d4a83a" stroke-width="0.8" opacity="0.5"/>
    <path d="M8 20 L10 24" stroke="#6a10a0" stroke-width="1" opacity="0.4"/>
    <path d="M24 20 L22 24" stroke="#6a10a0" stroke-width="1" opacity="0.4"/>
    <!-- Shoulder wings -->
    <path d="M6 10 Q2 12 3 16 Q5 12 6 14" fill="#0a0818" stroke="#9b30d0" stroke-width="0.8"/>
    <path d="M26 10 Q30 12 29 16 Q27 12 26 14" fill="#0a0818" stroke="#9b30d0" stroke-width="0.8"/>
  </svg>`;

  T['judicator_legs'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 6 L26 6 L28 20 L20 28 L16 22 L12 28 L4 20Z" fill="#0a1a2a" stroke="#9b30d0" stroke-width="1.5"/>
    <!-- Knee void eyes -->
    <circle cx="12" cy="16" r="3" fill="#050010" stroke="#9b30d0" stroke-width="0.8"/>
    <circle cx="12" cy="16" r="1.8" fill="#9b30d0" opacity="0.7"/>
    <circle cx="20" cy="16" r="3" fill="#050010" stroke="#9b30d0" stroke-width="0.8"/>
    <circle cx="20" cy="16" r="1.8" fill="#9b30d0" opacity="0.7"/>
    <path d="M8 10 Q16 8 24 10" fill="none" stroke="#d4a83a" stroke-width="0.8" opacity="0.5"/>
  </svg>`;

  // ── ACCESSORIES ───────────────────────────────────────────────
  T['hollow_ward'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <!-- Shield shape -->
    <path d="M6 6 L26 6 L28 20 Q28 28 16 30 Q4 28 4 20Z" fill="#0a1a2a" stroke="#9b30d0" stroke-width="1.5"/>
    <!-- Hollow sigil -->
    <circle cx="16" cy="17" r="7" fill="#050010" stroke="#8a3ab0" stroke-width="1"/>
    <circle cx="16" cy="17" r="5" fill="none" stroke="#9b30d0" stroke-width="1" stroke-dasharray="2 2"/>
    <circle cx="16" cy="17" r="2.5" fill="#9b30d0" opacity="0.8"/>
    <circle cx="16" cy="17" r="1" fill="#e0a0ff"/>
    <!-- Rim detail -->
    <path d="M6 10 Q16 7 26 10" fill="none" stroke="#d4a83a" stroke-width="0.8" opacity="0.5"/>
    <path d="M8 22 Q16 25 24 22" fill="none" stroke="#6a10a0" stroke-width="0.6" opacity="0.4"/>
  </svg>`;

  T['void_tear'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="19" r="8" fill="none" stroke="#9b30d0" stroke-width="2.5"/>
    <!-- Teardrop gem -->
    <path d="M16 9 Q20 14 20 18 Q20 22 16 24 Q12 22 12 18 Q12 14 16 9Z" fill="#050010" stroke="#9b30d0" stroke-width="1"/>
    <path d="M16 10 Q18 14 18 18 Q18 21 16 22" fill="#6a10a0" opacity="0.6"/>
    <circle cx="16" cy="16" r="2" fill="#9b30d0" opacity="0.9"/>
    <circle cx="16" cy="16" r="0.8" fill="#e0a0ff"/>
  </svg>`;

  T['veriax_eye'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 5 Q16 3 26 5" fill="none" stroke="#d4a83a" stroke-width="2"/>
    <!-- Eye gem -->
    <path d="M8 12 Q16 8 24 12 Q24 20 16 26 Q8 20 8 12Z" fill="#050010" stroke="#9b30d0" stroke-width="1.5"/>
    <!-- Iris -->
    <ellipse cx="16" cy="16" rx="5" ry="6" fill="#3a0050" stroke="#8a3ab0" stroke-width="0.8"/>
    <ellipse cx="16" cy="16" rx="3" ry="4" fill="#9b30d0" opacity="0.9"/>
    <ellipse cx="16" cy="16" rx="1.5" ry="2" fill="#e0a0ff"/>
    <circle cx="14" cy="14" r="0.8" fill="#fff" opacity="0.7"/>
    <!-- Gold chain -->
    <path d="M8 12 Q6 8 8 5 M24 12 Q26 8 24 5" stroke="#d4a83a" stroke-width="0.8" fill="none"/>
  </svg>`;

  T['lil_veriax'] = `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <!-- Mini gown -->
    <path d="M11 18 Q16 16 21 18 L23 30 Q16 32 9 30Z" fill="#1a0028" stroke="#9b30d0" stroke-width="1"/>
    <!-- Mini body -->
    <ellipse cx="16" cy="12" rx="6" ry="7" fill="#140020" stroke="#9b30d0" stroke-width="1"/>
    <!-- Crown -->
    <path d="M11 7 L12 4 L14 6 L16 3 L18 6 L20 4 L21 7" stroke="#d4a83a" stroke-width="1.2" fill="none"/>
    <!-- Tiny eyes -->
    <circle cx="14" cy="11" r="2" fill="#050010"/>
    <circle cx="14" cy="11" r="1.2" fill="#d4a83a" opacity="0.9"/>
    <circle cx="14" cy="11" r="0.5" fill="#fff" opacity="0.8"/>
    <circle cx="18" cy="11" r="2" fill="#050010"/>
    <circle cx="18" cy="11" r="1.2" fill="#d4a83a" opacity="0.9"/>
    <circle cx="18" cy="11" r="0.5" fill="#fff" opacity="0.8"/>
    <!-- Orb hands -->
    <circle cx="8" cy="20" r="2.5" fill="#050010" stroke="#9b30d0" stroke-width="0.8"/>
    <circle cx="8" cy="20" r="1.2" fill="#9b30d0" opacity="0.8"/>
    <circle cx="24" cy="20" r="2.5" fill="#050010" stroke="#9b30d0" stroke-width="0.8"/>
    <circle cx="24" cy="20" r="1.2" fill="#9b30d0" opacity="0.8"/>
  </svg>`;

  // Assign all
  for (const [id, svg] of Object.entries(T)) {
    if (GAME_DATA.items[id]) GAME_DATA.items[id]._customSprite = svg;
  }
  console.log('[Ashfall] Theatre SVGs assigned:', Object.keys(T).length);
})();
