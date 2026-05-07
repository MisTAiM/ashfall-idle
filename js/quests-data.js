// ================================================================
// ASHFALL IDLE — quests-data.js  v2 (fixed schema)
// Engine reads: q.objectives[], q.npcId, q.prereqs[], q.levelReqs{}
// ================================================================

if (!GAME_DATA.quests) GAME_DATA.quests = [];
if (!GAME_DATA.dailyQuests) GAME_DATA.dailyQuests = [];

function _quest(def) {
  if (!GAME_DATA.quests.find(q => q.id === def.id)) GAME_DATA.quests.push(def);
}
function _daily(def) {
  if (!GAME_DATA.dailyQuests.find(q => q.id === def.id)) GAME_DATA.dailyQuests.push(def);
}

// ── SERIES 1: The Ashen Path ──────────────────────────────────────
_quest({
  id:'ashen_beginnings', name:'Ashen Beginnings', series:'Ashen Path', qp:1,
  desc:'The world is buried in ash. Survive your first day in the Ashfall.',
  npcId:'elder_vex', levelReqs:{}, prereqs:[],
  objectives:[
    {type:'skill_level', skill:'woodcutting', level:5,  qty:1, desc:'Reach Woodcutting level 5'},
    {type:'skill_level', skill:'mining',      level:5,  qty:1, desc:'Reach Mining level 5'},
    {type:'kill',        monster:'chicken',   qty:10,        desc:'Kill 10 Chickens'},
    {type:'skill_level', skill:'cooking',     level:5,  qty:1, desc:'Reach Cooking level 5'},
  ],
  rewards:{ xp:{attack:500,woodcutting:500,mining:500}, gold:500, qp:1,
    items:[{id:'iron_sword',qty:1}], unlocks:'Unlocks: Goblin Wastes combat area.' },
});

_quest({
  id:'into_the_wastes', name:'Into the Wastes', series:'Ashen Path', qp:2,
  desc:'The goblin hordes grow bolder. Push them back from the outer settlements.',
  npcId:'elder_vex', levelReqs:{attack:10,defence:10}, prereqs:['ashen_beginnings'],
  objectives:[
    {type:'kill',        monster:'goblin',   qty:50,        desc:'Kill 50 Goblins'},
    {type:'kill',        monster:'bandit',   qty:20,        desc:'Kill 20 Bandits'},
    {type:'gather',      item:'iron_ore',    qty:100,       desc:'Mine 100 Iron Ore'},
    {type:'skill_level', skill:'smithing',   level:15, qty:1, desc:'Reach Smithing level 15'},
  ],
  rewards:{ xp:{attack:2000,strength:2000,mining:1000,smithing:1000}, gold:2000, qp:2,
    items:[{id:'steel_scimitar',qty:1},{id:'steel_plate',qty:1}] },
});

_quest({
  id:'hollow_awakening', name:'The Hollow Awakening', series:'Ashen Path', qp:4,
  desc:'The Hollow are not just monsters — they were soldiers once. Discover their origin.',
  npcId:'captain_lyra', levelReqs:{attack:30,defence:25,hitpoints:30}, prereqs:['into_the_wastes'],
  objectives:[
    {type:'kill', monster:'hollow_soldier', qty:100, desc:'Defeat 100 Hollow Soldiers'},
    {type:'kill', monster:'hollow_knight',  qty:25,  desc:'Defeat 25 Hollow Knights'},
    {type:'gather',item:'hollow_sigil',     qty:1,   desc:'Obtain the Hollow Sigil'},
  ],
  rewards:{ xp:{attack:8000,strength:8000,defence:8000,prayer:5000}, gold:10000, qp:4,
    items:[{id:'obsidian_cape',qty:1}],
    unlocks:'Unlocks: Shadow Sanctum dungeon.' },
});

// ── SERIES 2: The Burning Throne ──────────────────────────────────
_quest({
  id:'flames_of_ashfall', name:'Flames of Ashfall', series:'Burning Throne', qp:3,
  desc:'A dark mage channels volcanic energy into something terrible.',
  npcId:'shadow_morrigan', levelReqs:{magic:30,hitpoints:25}, prereqs:['ashen_beginnings'],
  objectives:[
    {type:'kill',        monster:'dark_mage',       qty:30,  desc:'Defeat 30 Dark Mages'},
    {type:'gather',      item:'chaos_rune',          qty:200, desc:'Gather 200 Chaos Runes'},
    {type:'skill_level', skill:'magic',              level:40, qty:1, desc:'Reach Magic level 40'},
  ],
  rewards:{ xp:{magic:10000,defence:3000}, gold:8000, qp:3,
    items:[{id:'mystic_robe',qty:1},{id:'fire_rune',qty:500}],
    unlocks:'Unlocks: Pyromancy Spellbook.' },
});

_quest({
  id:'the_void_rift', name:'The Void Rift', series:'Burning Throne', qp:6,
  desc:'A rift to the void has opened. The Void Emperor\'s influence bleeds through.',
  npcId:'shadow_morrigan', levelReqs:{magic:60,hitpoints:60,defence:50}, prereqs:['flames_of_ashfall'],
  objectives:[
    {type:'kill',        monster:'void_walker', qty:200, desc:'Kill 200 Void Walkers'},
    {type:'gather',      item:'void_dust',      qty:50,  desc:'Collect 50 Void Dust'},
    {type:'dungeon',     dungeon:'void_rift',   qty:1,   desc:'Complete the Void Rift dungeon'},
    {type:'skill_level', skill:'magic',         level:75, qty:1, desc:'Reach Magic level 75'},
  ],
  rewards:{ xp:{magic:50000,hitpoints:20000}, gold:50000, qp:6,
    items:[{id:'void_staff',qty:1}],
    unlocks:'Unlocks: Void Magic Spellbook. Access to Void Emperor world boss.' },
});

// ── SERIES 3: Bloodfang Legacy ────────────────────────────────────
_quest({
  id:'thief_of_ashfall', name:'Thief of Ashfall', series:'Bloodfang Legacy', qp:3,
  desc:'The Bloodfang Clan controls the black markets. Infiltrate them.',
  npcId:'shadow_morrigan', levelReqs:{thieving:20}, prereqs:[],
  objectives:[
    {type:'thieve',      target:'pickpocket_farmer',  qty:100, desc:'Pickpocket 100 Farmers'},
    {type:'thieve',      target:'pickpocket_warrior', qty:50,  desc:'Pickpocket 50 Warriors'},
    {type:'gather',      item:'lockpick',             qty:10,  desc:'Obtain 10 Lockpicks'},
    {type:'skill_level', skill:'thieving',            level:35, qty:1, desc:'Reach Thieving level 35'},
  ],
  rewards:{ xp:{thieving:15000}, gold:12000, qp:3,
    items:[{id:'ring_of_wealth',qty:1}],
    unlocks:'Unlocks: Rogue class title. Access to Bloodfang Den.' },
});

// ── SERIES 4: Nature's Call ───────────────────────────────────────
_quest({
  id:'seeds_of_hope', name:'Seeds of Hope', series:"Nature's Call", qp:2,
  desc:'Life persists even beneath the ash. Sustain the survivors through farming.',
  npcId:'herbalist_elena', levelReqs:{farming:15}, prereqs:[],
  objectives:[
    {type:'harvest', item:'potato',  qty:50, desc:'Harvest 50 Potatoes'},
    {type:'harvest', item:'onion',   qty:30, desc:'Harvest 30 Onions'},
    {type:'skill_level', skill:'farming', level:25, qty:1, desc:'Reach Farming level 25'},
  ],
  rewards:{ xp:{farming:5000}, gold:3000, qp:2,
    items:[{id:'ranarr_seed',qty:5},{id:'supercompost',qty:10}] },
});

_quest({
  id:'herbalists_trial', name:"The Herbalist's Trial", series:"Nature's Call", qp:3,
  desc:'Elena needs proof you can brew the potions that keep the militia alive.',
  npcId:'herbalist_elena', levelReqs:{alchemy:35,farming:30}, prereqs:['seeds_of_hope'],
  objectives:[
    {type:'craft', item:'super_strength',  qty:10, desc:'Brew 10 Super Strength potions'},
    {type:'craft', item:'prayer_potion',   qty:10, desc:'Brew 10 Prayer Potions'},
    {type:'gather',item:'voidbloom',       qty:20, desc:'Forage 20 Voidbloom'},
    {type:'skill_level', skill:'alchemy',  level:45, qty:1, desc:'Reach Alchemy level 45'},
  ],
  rewards:{ xp:{alchemy:12000,farming:5000}, gold:8000, qp:3,
    items:[{id:'herb_sack',qty:1}],
    unlocks:'Unlocks: Herb Sack — auto-collects herbs while skilling.' },
});

// ── SERIES 5: Pet Tamer ───────────────────────────────────────────
_quest({
  id:'friend_of_the_wild', name:'Friend of the Wild', series:'Pet Tamer', qp:5,
  desc:'Prove yourself as a tamer by bonding with companions across the Ashfall.',
  npcId:'elder_vex', levelReqs:{}, prereqs:[],
  objectives:[
    {type:'pets',  qty:1, desc:'Obtain your first combat pet'},
    {type:'kill',  monster:'dragon',  qty:100, desc:'Kill 100 Dragons'},
    {type:'pets',  qty:3, desc:'Collect 3 different pets'},
  ],
  rewards:{ xp:{hitpoints:10000}, gold:25000, qp:5,
    items:[{id:'secateurs_magic',qty:1}],
    unlocks:'Magic Secateurs — improves herb yield by 10%.' },
});

// ── SERIES 6: The Slayer's Way ────────────────────────────────────
_quest({
  id:'first_assignment', name:'First Assignment', series:"Slayer's Way", qp:1,
  desc:'Dorn the Slayer Master has work for those willing to hunt the dangerous.',
  npcId:'slayer_master_dorn', levelReqs:{slayer:1}, prereqs:[],
  objectives:[
    {type:'slayer_tasks', qty:1, desc:'Complete 1 Slayer task'},
    {type:'slayer_tasks', qty:3, desc:'Complete 3 Slayer tasks'},
    {type:'skill_level', skill:'slayer', level:10, qty:1, desc:'Reach Slayer level 10'},
  ],
  rewards:{ xp:{slayer:2000,attack:1000}, gold:1500, qp:1,
    items:[{id:'slayer_helm',qty:1}] },
});

_quest({
  id:'master_slayer', name:'Master Slayer', series:"Slayer's Way", qp:5,
  desc:'Prove your slaying mastery by completing difficult assignments.',
  npcId:'slayer_master_dorn', levelReqs:{slayer:50}, prereqs:['first_assignment'],
  objectives:[
    {type:'slayer_tasks',  qty:25,  desc:'Complete 25 Slayer tasks'},
    {type:'kill', monster:'abyssal_demon', qty:50, desc:'Slay 50 Abyssal Demons'},
    {type:'skill_level', skill:'slayer',   level:65, qty:1, desc:'Reach Slayer level 65'},
  ],
  rewards:{ xp:{slayer:40000,attack:15000,strength:15000}, gold:30000, qp:5,
    items:[{id:'abyssal_whip',qty:1}],
    unlocks:'Unlocks: Abyssal demons as permanent slayer assignment.' },
});

// ── DAILY QUESTS ─────────────────────────────────────────────────
_daily({ id:'daily_kills',     name:'Monster Hunter',      desc:'Kill 50 monsters of any type.',
  objectives:[{type:'kill_any',qty:50,desc:'Kill 50 monsters'}],
  rewards:{gold:500,xp:{hitpoints:1000}}, cooldown:86400000 });
_daily({ id:'daily_gather',    name:'Resource Run',        desc:'Gather 30 herbs or ore.',
  objectives:[{type:'gather_any',qty:30,desc:'Gather 30 resources'}],
  rewards:{gold:400,xp:{mining:800,foraging:800}}, cooldown:86400000 });
_daily({ id:'daily_cook',      name:'Feed the Camp',       desc:'Cook 20 items of any food.',
  objectives:[{type:'craft_cooking',qty:20,desc:'Cook 20 food items'}],
  rewards:{gold:350,xp:{cooking:600}}, cooldown:86400000 });
_daily({ id:'daily_smith',     name:'Arms Run',            desc:'Smith or craft 10 items.',
  objectives:[{type:'craft_any',qty:10,desc:'Smith or craft 10 items'}],
  rewards:{gold:600,xp:{smithing:1000,crafting:800}}, cooldown:86400000 });
_daily({ id:'daily_thieve',    name:'Silent Work',         desc:'Pickpocket 30 targets.',
  objectives:[{type:'thieve_any',qty:30,desc:'Pickpocket 30 targets'}],
  rewards:{gold:800,xp:{thieving:1500}}, cooldown:86400000 });
_daily({ id:'daily_slayer',    name:'Slayer Duty',         desc:'Complete a Slayer task.',
  objectives:[{type:'slayer_tasks',qty:1,desc:'Complete 1 Slayer task'}],
  rewards:{gold:700,xp:{slayer:2000}}, cooldown:86400000 });
_daily({ id:'daily_dungeon',   name:'Dungeon Delver',      desc:'Complete any dungeon.',
  objectives:[{type:'dungeon_any',qty:1,desc:'Complete any dungeon'}],
  rewards:{gold:1500,xp:{attack:2000,defence:2000}}, cooldown:86400000 });

// ── SERIES 7: The Artillerist's Path ──────────────────────────────
_quest({
  id:'artillerists_calling', name:"Artillerist's Calling", series:"Artillerist's Path", qp:4,
  desc:'A grizzled Dwarven Engineer has arrived in the Ashfall settlement. He speaks of a weapon capable of cutting down entire formations — the Dwarf Cannon. Prove your worth to earn the right to wield it.',
  npcId:'elder_vex', levelReqs:{smithing:35,ranged:40}, prereqs:['into_the_wastes'],
  objectives:[
    {type:'skill_level', skill:'smithing', level:40,  qty:1, desc:'Reach Smithing level 40'},
    {type:'skill_level', skill:'ranged',   level:40,  qty:1, desc:'Reach Ranged level 40'},
    {type:'craft',       item:'steel_bar', qty:50,         desc:'Smelt 50 Steel Bars (Smithing material)'},
    {type:'kill',        monster:'hollow_knight', qty:30,  desc:'Slay 30 Hollow Knights (field test)'},
    {type:'craft',       item:'cannon_base',       qty:1,  desc:'Smith a Cannon Base (Smithing 35)'},
    {type:'craft',       item:'cannon_stand',      qty:1,  desc:'Smith a Cannon Stand (Smithing 37)'},
    {type:'craft',       item:'cannon_barrels',    qty:1,  desc:'Smith Cannon Barrels (Smithing 40)'},
    {type:'craft',       item:'cannon_furnace',    qty:1,  desc:'Smith a Cannon Furnace (Smithing 40)'},
  ],
  rewards:{ xp:{smithing:8000,ranged:8000,defence:3000}, gold:12000, qp:4,
    items:[{id:'dwarf_cannon',qty:1},{id:'cannonball',qty:200}],
    unlocks:'Unlocks: Dwarf Cannon — deployable multi-target ranged weapon.' },
});

console.log('[Ashfall] quests-data.js v2 loaded. Quests:', GAME_DATA.quests.length, '| Dailies:', GAME_DATA.dailyQuests.length);
