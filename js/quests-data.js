// ================================================================
// ASHFALL IDLE — quests-data.js
// All quest definitions. Add new quests here exclusively.
// Quest engine code stays in engine.js.
// ================================================================

if (!GAME_DATA.quests) GAME_DATA.quests = [];

function _quest(def) {
  if (!GAME_DATA.quests.find(q => q.id === def.id)) GAME_DATA.quests.push(def);
}

// ── QUEST STRUCTURE ───────────────────────────────────────────────
// { id, name, series, desc, levelReqs:{skill:level}, prereqs:[questId],
//   steps:[{type, target, qty, desc}], rewards:{xp:{skill:amt}, items:[{id,qty}], gold, unlocks} }

// SERIES 1: The Ashen Path (tutorial/story)
_quest({
  id: 'ashen_beginnings', name: 'Ashen Beginnings', series: 'Ashen Path',
  desc: 'The world is buried in ash. Survive your first day in the Ashfall.',
  levelReqs: {}, prereqs: [],
  steps: [
    { type:'skill', skill:'woodcutting', level:5, desc:'Reach Woodcutting level 5' },
    { type:'skill', skill:'mining',      level:5, desc:'Reach Mining level 5' },
    { type:'kill',  target:'chicken',    qty:10,  desc:'Kill 10 Chickens' },
    { type:'skill', skill:'cooking',     level:5, desc:'Reach Cooking level 5' },
  ],
  rewards: { xp:{ attack:500, woodcutting:500, mining:500 }, gold:500, items:[{id:'iron_sword',qty:1}],
    unlocks:'Unlocks: The Goblin Wastes combat area.' },
});

_quest({
  id: 'into_the_wastes', name: 'Into the Wastes', series: 'Ashen Path',
  desc: 'The goblin hordes grow bolder. Push them back from the outer settlements.',
  levelReqs: { attack:10, defence:10 }, prereqs: ['ashen_beginnings'],
  steps: [
    { type:'kill', target:'goblin', qty:50,    desc:'Kill 50 Goblins' },
    { type:'kill', target:'bandit', qty:20,    desc:'Kill 20 Bandits' },
    { type:'item', item:'iron_ore', qty:100,   desc:'Mine 100 Iron Ore' },
    { type:'skill', skill:'smithing', level:15, desc:'Reach Smithing level 15' },
  ],
  rewards: { xp:{ attack:2000, strength:2000, mining:1000, smithing:1000 }, gold:2000,
    items:[{id:'steel_scimitar',qty:1},{id:'steel_plate',qty:1}] },
});

_quest({
  id: 'hollow_awakening', name: 'The Hollow Awakening', series: 'Ashen Path',
  desc: 'The Hollow are not just monsters — they are fallen soldiers of the old world. Discover their origin.',
  levelReqs: { attack:30, defence:25, hitpoints:30 }, prereqs: ['into_the_wastes'],
  steps: [
    { type:'kill', target:'hollow_soldier', qty:100, desc:'Defeat 100 Hollow Soldiers' },
    { type:'kill', target:'hollow_knight',  qty:25,  desc:'Defeat 25 Hollow Knights' },
    { type:'item', item:'hollow_sigil',     qty:1,   desc:'Obtain the Hollow Sigil from the Hollow Lord' },
  ],
  rewards: { xp:{ attack:8000, strength:8000, defence:8000, prayer:5000 }, gold:10000,
    items:[{id:'obsidian_cape',qty:1}],
    unlocks:'Unlocks: Shadow Sanctum dungeon. Lore: The Hollow were once the Silver Order elite guard.' },
});

// SERIES 2: The Burning Throne (magic questline)
_quest({
  id: 'flames_of_ashfall', name: 'Flames of Ashfall', series: 'Burning Throne',
  desc: 'A dark mage is channeling the volcanic energy of the Ashfall into something terrible.',
  levelReqs: { magic:30, hitpoints:25 }, prereqs: ['ashen_beginnings'],
  steps: [
    { type:'kill',  target:'dark_mage', qty:30,      desc:'Defeat 30 Dark Mages' },
    { type:'item',  item:'chaos_rune',  qty:200,     desc:'Gather 200 Chaos Runes' },
    { type:'skill', skill:'magic',      level:40,    desc:'Reach Magic level 40' },
    { type:'item',  item:'tome_of_pyromancy', qty:1, desc:'Obtain the Tome of Pyromancy' },
  ],
  rewards: { xp:{ magic:10000, defence:3000 }, gold:8000,
    items:[{id:'mystic_robe',qty:1},{id:'fire_rune',qty:500}],
    unlocks:'Unlocks: Pyromancy Spellbook.' },
});

_quest({
  id: 'the_void_rift', name: 'The Void Rift', series: 'Burning Throne',
  desc: 'A rift to the void has opened. The Void Emperor\'s influence bleeds through.',
  levelReqs: { magic:60, hitpoints:60, defence:50 }, prereqs: ['flames_of_ashfall'],
  steps: [
    { type:'kill',  target:'void_walker', qty:200,   desc:'Kill 200 Void Walkers' },
    { type:'item',  item:'void_dust',     qty:50,    desc:'Collect 50 Void Dust' },
    { type:'dungeon', dungeon:'void_rift', qty:1,    desc:'Complete the Void Rift dungeon' },
    { type:'skill', skill:'magic',        level:75,  desc:'Reach Magic level 75' },
  ],
  rewards: { xp:{ magic:50000, hitpoints:20000 }, gold:50000,
    items:[{id:'void_staff',qty:1}],
    unlocks:'Unlocks: Void Magic Spellbook. Access to Void Emperor world boss.' },
});

// SERIES 3: The Bloodfang Legacy (thieving/combat)
_quest({
  id: 'thief_of_ashfall', name: 'Thief of Ashfall', series: 'Bloodfang Legacy',
  desc: 'The Bloodfang Clan controls the black markets. Prove you\'re skilled enough to infiltrate them.',
  levelReqs: { thieving:20 }, prereqs: [],
  steps: [
    { type:'thieve', target:'pickpocket_farmer',  qty:100, desc:'Pickpocket 100 Farmers' },
    { type:'thieve', target:'pickpocket_warrior', qty:50,  desc:'Pickpocket 50 Warriors' },
    { type:'item',   item:'lockpick',             qty:10,  desc:'Obtain 10 Lockpicks' },
    { type:'skill',  skill:'thieving',            level:35, desc:'Reach Thieving level 35' },
  ],
  rewards: { xp:{ thieving:15000 }, gold:12000,
    items:[{id:'ring_of_wealth',qty:1}],
    unlocks:'Unlocks: Rogue class title. Access to Bloodfang Den dungeon.' },
});

// SERIES 4: Farming & Nature
_quest({
  id: 'seeds_of_hope', name: 'Seeds of Hope', series: 'Nature\'s Call',
  desc: 'Life persists even beneath the ash. Prove you can sustain the survivors.',
  levelReqs: { farming:15 }, prereqs: [],
  steps: [
    { type:'harvest', item:'potato',  qty:50,  desc:'Harvest 50 Potatoes' },
    { type:'harvest', item:'onion',   qty:30,  desc:'Harvest 30 Onions' },
    { type:'skill',   skill:'farming', level:25, desc:'Reach Farming level 25' },
  ],
  rewards: { xp:{ farming:5000 }, gold:3000,
    items:[{id:'ranarr_seed',qty:5},{id:'supercompost',qty:10}] },
});

// SERIES 5: Pet Collector
_quest({
  id: 'friend_of_the_wild', name: 'Friend of the Wild', series: 'Pet Tamer',
  desc: 'Prove yourself as a tamer by collecting companions from across the Ashfall.',
  levelReqs: {}, prereqs: [],
  steps: [
    { type:'pet', qty:3,  desc:'Collect 3 different combat pets' },
    { type:'pet', qty:5,  desc:'Collect 5 different combat pets' },
    { type:'kill', target:'dragon', qty:100, desc:'Kill 100 Dragons (for Baby Dragon chance)' },
  ],
  rewards: { xp:{ hitpoints:10000 }, gold:25000,
    items:[{id:'secateurs_magic',qty:1}],
    unlocks:'Magic Secateurs — improves herb yield by 10%.' },
});

console.log('[Ashfall] quests-data.js loaded. Quests defined:', GAME_DATA.quests.length);
