// ================================================================
// ASHFALL IDLE — npcs-data.js
// NPC definitions: dialogue, shops, quest givers, lore entries.
// Add all NPC content here going forward.
// ================================================================

if (!GAME_DATA.npcs) GAME_DATA.npcs = {};

function _npc(id, def) { GAME_DATA.npcs[id] = { id, ...def }; }

// ── NPC STRUCTURE ─────────────────────────────────────────────────
// { id, name, portrait (SVG key), location, role, dialogue:{greeting,idle[],lore[]},
//   shop:[ {item, price} ] (optional), questGiver:[questId] (optional) }

_npc('elder_vex', {
  name: 'Elder Vex', portrait: 'vex', location: 'ashfall_village',
  role: 'Town Elder & Quest Giver',
  dialogue: {
    greeting: "Survivor. Good. The ash claims more every day — we need those who refuse to fall. What can I do for you?",
    idle: [
      "The old kingdoms crumbled when the first eruption came. What we build now, we build to last.",
      "Train hard. The Hollow do not tire. They do not eat. They only hunt.",
      "The Ashen Overlord stirs to the east. When he fully wakes... pray you\'re ready.",
    ],
    lore: [
      "The Ashfall began forty years ago. No one knows why. The scholars are dead.",
      "The Hollow were soldiers once — loyal to a king who made a terrible bargain. Now they serve only the ash.",
      "The Void Emperor is older than the Ashfall. Some say he caused it.",
    ]
  },
  questGiver: ['ashen_beginnings', 'into_the_wastes', 'hollow_awakening'],
});

_npc('captain_lyra', {
  name: 'Captain Lyra', portrait: 'lyra', location: 'silver_order_keep',
  role: 'Silver Order Captain',
  dialogue: {
    greeting: "The Silver Order stands firm. We protect the living — all of them. Prove your worth and we\'ll fight alongside you.",
    idle: [
      "Keep your gear maintained. A blunt blade is a dead warrior.",
      "The Hollow come in waves. Wait for the gaps, strike fast, withdraw.",
      "Piety is your shield as much as steel. Prayer carries real power in the Ashfall.",
    ],
    lore: [
      "The Silver Order was founded in the first year of the Ashfall. We\'ve never broken a line.",
      "The Hollow Lord was once our greatest general. His name is stricken from our records.",
      "We guard three holy shrines. If any falls, the Hollow surge through the gap. That cannot happen.",
    ]
  },
  questGiver: ['hollow_awakening'],
});

_npc('greybeard_tormund', {
  name: 'Tormund Greybeard', portrait: 'tormund', location: 'ashen_forge',
  role: 'Master Blacksmith',
  dialogue: {
    greeting: "Aye, I can work anything you bring me — ore, bones, whatever survives in this hellscape. What\'re you smelting?",
    idle: [
      "Dragonite is the finest metal I\'ve ever worked. Hot as the sun, hard as spite.",
      "A weapon is only as good as the smith. Buy me a drink and I\'ll make sure yours is better.",
      "The Ashsteel vein runs under the eastern ridge. Don\'t mine there without backup.",
    ],
  },
  shop: [
    { item:'steel_scimitar',    price:500  },
    { item:'mithril_scimitar',  price:1500 },
    { item:'adamant_scimitar',  price:4000 },
    { item:'runite_scimitar',   price:12000 },
    { item:'watering_can',      price:150  },
    { item:'spade',             price:80   },
    { item:'rake',              price:100  },
  ],
});

_npc('shadow_morrigan', {
  name: 'Morrigan', portrait: 'morrigan', location: 'bloodfang_den',
  role: 'Bloodfang Fence',
  dialogue: {
    greeting: "Eyes forward, money up front, no questions. The Bloodfang Clan respects three things: skill, silence, and gold.",
    idle: [
      "The guards are getting suspicious. Keep your anger low or you\'ll be fighting your way out.",
      "Best pickpocket I ever saw could lift a ring off a sleeping dragon. She\'s dead now. Lesson learned.",
      "Lockpicks go blunt. Buy fresh ones from me — don\'t cheap out.",
    ],
    lore: [
      "The Bloodfang Clan have been here since before the ash. We\'ll be here after.",
      "Every city has a shadow economy. Ours is just better organized.",
    ]
  },
  shop: [
    { item:'lockpick',          price:50   },
    { item:'poison_vial',       price:90   },
    { item:'obsidian_cape',     price:15000 },
  ],
  questGiver: ['thief_of_ashfall'],
});

_npc('herbalist_elena', {
  name: 'Elena', portrait: 'elena', location: 'nature_grove',
  role: 'Herbalist & Potion Maker',
  dialogue: {
    greeting: "Life finds a way, even in the ash. These seeds, these herbs — they\'re more valuable than gold right now.",
    idle: [
      "Ultracompost takes more work but the yield difference is enormous. Don\'t skimp.",
      "Watch your herb patches for disease. One sick plant can spread if left too long.",
      "The Ranarr Weed that grows near the Ashen Crypts is especially potent.",
    ],
  },
  shop: [
    { item:'compost_bin',       price:30   },
    { item:'supercompost',      price:90   },
    { item:'ultracompost',      price:250  },
    { item:'prayer_potion',     price:400  },
    { item:'super_attack_potion', price:800 },
    { item:'super_strength_potion', price:900 },
    { item:'super_defence_potion', price:750 },
    { item:'herb_seed',         price:30   },
    { item:'ranarr_seed',       price:200  },
  ],
  questGiver: ['seeds_of_hope'],
});

_npc('slayer_master_dorn', {
  name: 'Dorn', portrait: 'dorn', location: 'slayer_tower',
  role: 'Slayer Master',
  dialogue: {
    greeting: "Need a task? I assign only the best targets. Waste my time and I\'ll assign you something unpleasant.",
    idle: [
      "Slayer tasks pay well for a reason. These things fight back.",
      "Wear the right gear. Fighting a spider without poison protection is just asking for it.",
      "Kill count matters. The more you kill of a type, the better your odds for rare drops.",
    ],
    lore: [
      "The Slayer Tower was built to train those brave — or foolish — enough to hunt what others flee.",
      "My best student took on Jad with 12 HP left. I thought she was dead. She wasn\'t.",
    ]
  },
});

// ── NPC LORE DATABASE ─────────────────────────────────────────────
if (!GAME_DATA.loreEntries) GAME_DATA.loreEntries = [];

function _lore(id, title, content, category) {
  if (!GAME_DATA.loreEntries.find(l => l.id === id)) {
    GAME_DATA.loreEntries.push({ id, title, content, category });
  }
}

_lore('hollow_origin', 'The Hollow — Origin',
  'The Hollow were once the Silver Order\'s finest: an elite cohort sworn to protect the old king. When the Ashfall began, the king made a bargain with a being from the Void — eternal life for his soldiers in exchange for their purpose. They got the life. They lost the purpose. Now they wander, hollow, hunting anything that breathes.',
  'lore');

_lore('ashfall_cause', 'The Ashfall — Theories',
  'Three theories exist. First: geological — a chain of volcanos triggered each other in cascade. Second: magical — an arcane experiment in the capital went catastrophically wrong. Third: intentional — the Void Emperor engineered it to weaken the surface world before his emergence. No one who investigated officially survived to report back.',
  'lore');

_lore('void_emperor', 'The Void Emperor',
  'Ancient texts refer to him only as "the Emptiness that Wears a Crown." He predates the Ashfall by centuries. Some scholars believe he exists in a state between dimensions — always present, never fully here. His void walkers are fragments of his consciousness given form. Every one you kill is a small piece of him you excise.',
  'lore');

_lore('ashen_overlord', 'The Ashen Overlord — History',
  'Before the Ashfall, the Ashen Overlord was a king — the last king of the eastern territories. When the ash came, he refused to evacuate his people. They died. He didn\'t. The volcanic energy transformed him into something neither living nor Hollow. He rules the Infernal Forge now, surrounded by the ash-preserved corpses of his subjects.',
  'lore');

console.log('[Ashfall] npcs-data.js loaded. NPCs:', Object.keys(GAME_DATA.npcs).length,
  '| Lore entries:', GAME_DATA.loreEntries.length, '| Quests from NPCs:', 
  Object.values(GAME_DATA.npcs).filter(n => n.questGiver?.length).length);
