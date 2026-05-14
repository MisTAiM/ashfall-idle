// ================================================================
// ASHFALL IDLE — content/dungeons-tier2.js
// 10 new dungeons and raids — unique mechanics, scaling rewards.
// ================================================================
(function() {
'use strict';

if (!GAME_DATA.dungeons) GAME_DATA.dungeons = [];
const _d = (d) => { if (!GAME_DATA.dungeons.find(x=>x.id===d.id)) GAME_DATA.dungeons.push(d); };

// ── BEGINNER DUNGEONS ─────────────────────────────────────────
_d({
  id:'goblin_warren', name:"Goblin Warren", levelReq:5, desc:'A network of goblin tunnels beneath the village. Clear every room.',
  waves:[
    {enemies:[{id:'goblin',qty:5}]},
    {enemies:[{id:'goblin',qty:8}]},
    {enemies:[{id:'goblin',qty:5},{id:'barbarian',qty:2}],boss:true,bossName:'Goblin Warchief'},
  ],
  rewards:{xp:{attack:500,strength:500},gold:{min:200,max:500},items:[{item:'iron_scimitar',qty:1,chance:0.5}]},
  completionMsg:"The warren is cleared. Goblins scatter."
});

_d({
  id:'dark_wizard_tower', name:"Dark Wizard's Tower", levelReq:15, desc:'A crumbling tower inhabited by dark wizards and their experiments.',
  waves:[
    {enemies:[{id:'dark_wizard',qty:4}]},
    {enemies:[{id:'dark_wizard',qty:6},{id:'ankou',qty:1}]},
    {enemies:[{id:'dark_wizard',qty:4},{id:'ankou',qty:2}],boss:true,bossName:'Grand Dark Wizard'},
  ],
  rewards:{xp:{magic:3000,attack:1500},gold:{min:500,max:1500},items:[{item:'chaos_rune',qty:20,chance:0.8},{item:'air_staff',qty:1,chance:0.3}]},
  completionMsg:"The tower falls silent. The experiments are ended."
});

// ── MID-TIER DUNGEONS ─────────────────────────────────────────
_d({
  id:'giant_cave_system', name:'Giant Cave System', levelReq:30, desc:'A massive cavern housing increasingly large giants.',
  waves:[
    {enemies:[{id:'hill_giant',qty:4}]},
    {enemies:[{id:'hill_giant',qty:3},{id:'moss_giant',qty:2}]},
    {enemies:[{id:'moss_giant',qty:4}]},
    {enemies:[{id:'fire_giant',qty:2},{id:'moss_giant',qty:2}],boss:true,bossName:'Ancient Fire Giant'},
  ],
  rewards:{xp:{attack:12000,strength:10000,slayer:5000},gold:{min:3000,max:8000},items:[{item:'rune_battleaxe',qty:1,chance:0.3},{item:'big_bones',qty:5,chance:1}]},
  completionMsg:"The giants' hierarchy is shattered."
});

_d({
  id:'demon_abyss', name:'Demon Abyss', levelReq:55, desc:'A rift leading directly into the demon planes. Only the strong survive.',
  waves:[
    {enemies:[{id:'lesser_demon',qty:5}]},
    {enemies:[{id:'lesser_demon',qty:4},{id:'ankou',qty:3}]},
    {enemies:[{id:'lesser_demon',qty:8}]},
    {enemies:[{id:'lesser_demon',qty:5},{id:'hellhound',qty:2}]},
    {enemies:[{id:'demon',qty:3},{id:'hellhound',qty:3}],boss:true,bossName:'Arch Demon'},
  ],
  rewards:{xp:{attack:20000,strength:15000,magic:10000},gold:{min:5000,max:15000},items:[{item:'rune_scimitar',qty:1,chance:0.5},{item:'death_rune',qty:50,chance:0.8},{item:'abyssal_whip',qty:1,chance:0.02}]},
  completionMsg:"The Arch Demon falls. The abyss trembles."
});

_d({
  id:'slayer_dungeon_advanced', name:'Advanced Slayer Dungeon', levelReq:70, desc:'Deep slayer dungeon. High XP, high risk. Bring supplies.',
  waves:[
    {enemies:[{id:'gargoyle',qty:4}]},
    {enemies:[{id:'aberrant_spectre',qty:3},{id:'banshee',qty:3}]},
    {enemies:[{id:'gargoyle',qty:3},{id:'dark_beast',qty:2}]},
    {enemies:[{id:'dark_beast',qty:3},{id:'hellhound',qty:3}]},
    {enemies:[{id:'dark_beast',qty:5}],boss:true,bossName:'Ancient Dark Beast'},
  ],
  rewards:{xp:{slayer:50000,attack:25000,defence:20000},gold:{min:10000,max:30000},items:[{item:'abyssal_bludgeon',qty:1,chance:0.03},{item:'hydra_leather',qty:1,chance:0.1}]},
  completionMsg:"The slayer dungeon is cleared. Dorn would be impressed."
});

// ── HIGH-TIER RAIDS ───────────────────────────────────────────
_d({
  id:'chambers_of_shadow', name:'Chambers of Shadow', levelReq:80, desc:'A raid. Three challenge rooms. Rare rewards scale with performance.',
  isRaid:true, partySize:{min:1,max:4},
  waves:[
    {room:'puzzle_room', enemies:[{id:'shadow_beast',qty:6}], mechanic:'phase_switch', desc:'Switch attack style when Shadow Beast phases.'},
    {room:'gauntlet_room',enemies:[{id:'hellhound',qty:4},{id:'gargoyle',qty:4}], mechanic:'kill_order', desc:'Kill gargoyles first or hellhounds enrage.'},
    {room:'final_chamber',enemies:[{id:'shadow_warden',qty:1}],boss:true,bossName:'Shadow Warden',mechanic:'overhead_switch',desc:'Switch prayers as the Warden cycles attack styles.'},
  ],
  rewards:{xp:{attack:60000,strength:50000,magic:40000,ranged:40000},gold:{min:20000,max:60000},items:[{item:'twisted_bow',qty:1,chance:0.003},{item:'shadow_blade',qty:1,chance:0.01},{item:'masori_body',qty:1,chance:0.005}]},
  completionMsg:"The Chambers of Shadow are conquered."
});

_d({
  id:'theatre_of_blood_advanced', name:'Theatre of Blood: Advanced', levelReq:90, desc:'Hard mode Theatre. Tighter timers, harder mechanics, better loot.',
  isRaid:true, hardMode:true, partySize:{min:1,max:5},
  waves:[
    {room:'maiden',enemies:[{id:'the_maiden',qty:1}],boss:true,bossName:'The Maiden (HM)',mechanic:'blood_spawns'},
    {room:'bloat',enemies:[{id:'the_bloat',qty:1}],boss:true,bossName:'The Bloat (HM)',mechanic:'stomp_pattern'},
    {room:'nylocas',enemies:[{id:'nylocas_vasilias',qty:1}],boss:true,bossName:'Nylocas Vasilias (HM)',mechanic:'color_change'},
    {room:'sotetseg',enemies:[{id:'sotetseg',qty:1}],boss:true,bossName:'Sotetseg (HM)',mechanic:'maze_dodge'},
    {room:'xarpus',enemies:[{id:'xarpus',qty:1}],boss:true,bossName:'Xarpus (HM)',mechanic:'poison_puddles'},
    {room:'verzik',enemies:[{id:'verzik_vitur',qty:1}],boss:true,bossName:'Verzik Vitur (HM)',mechanic:'web_slam',finale:true},
  ],
  rewards:{xp:{attack:80000,strength:70000,hitpoints:50000,magic:50000,ranged:50000},gold:{min:30000,max:100000},items:[{item:'sanguinesti_staff',qty:1,chance:0.004},{item:'scythe_of_vitur',qty:1,chance:0.002},{item:'justiciar_chestguard',qty:1,chance:0.008}]},
  completionMsg:"Theatre of Blood Advanced complete. You are among the elite."
});

_d({
  id:'void_sanctum', name:'Void Sanctum', levelReq:95, desc:'The inner sanctum of the void realm. 7 bosses. Legendary rewards.',
  isRaid:true, partySize:{min:1,max:8},
  waves:[
    {room:'entry',     enemies:[{id:'void_titan',qty:3}],                    boss:false},
    {room:'gate',      enemies:[{id:'void_emperor_spawn',qty:2}],             boss:false},
    {room:'shrine',    enemies:[{id:'void_warden',qty:1}],                    boss:true, bossName:'Void Warden'},
    {room:'corridor',  enemies:[{id:'void_titan',qty:5}],                    boss:false},
    {room:'chamber',   enemies:[{id:'elder_ash_golem',qty:2},{id:'void_titan',qty:2}],boss:false},
    {room:'throne',    enemies:[{id:'demon_lord',qty:2}],                    boss:false},
    {room:'sanctum',   enemies:[{id:'void_emperor_spawn',qty:1}],             boss:true, bossName:'Void Sanctum Guardian',finale:true},
  ],
  rewards:{xp:{attack:100000,strength:100000,magic:100000,hitpoints:50000},gold:{min:50000,max:200000},items:[{item:'void_emperor_cape',qty:1,chance:0.05},{item:'zaryte_crossbow',qty:1,chance:0.02},{item:'celestial_blade',qty:1,chance:0.03}]},
  completionMsg:"The Void Sanctum falls. The path to the Void Emperor is clear."
});

_d({
  id:'ash_colosseum', name:'Ash Colosseum', levelReq:75, desc:'A gladiatorial arena. Survive 12 rounds of increasing difficulty.',
  isWave:true, maxWaves:12,
  waves: Array.from({length:12},(_,i)=>({
    wave:i+1,
    enemies:i<3?[{id:'barbarian',qty:3+i}]:
             i<6?[{id:'lesser_demon',qty:2},{id:'hellhound',qty:1+Math.floor(i/2)}]:
             i<9?[{id:'gargoyle',qty:2},{id:'dark_beast',qty:1},{id:'fire_giant',qty:1}]:
                 [{id:'demon_lord',qty:1},{id:'void_titan',qty:Math.floor(i/3)}],
    hpMult:1+(i*0.15), dmgMult:1+(i*0.10),
  })),
  rewards:{xp:{attack:50000,strength:40000,defence:30000},gold:{min:15000,max:50000},items:[{item:'amulet_of_fury',qty:1,chance:0.05},{item:'berserker_ring',qty:1,chance:0.05}]},
  completionMsg:"The Colosseum roars. You are its undisputed champion."
});

_d({
  id:'soul_trials', name:'Soul Trials', levelReq:85, desc:'Three trials of pure combat mastery. No supplies allowed inside.',
  noSupplies:true,
  waves:[
    {trial:'melee',   enemies:[{id:'steel_dragon',qty:2},{id:'adamant_dragon',qty:1}], mechanic:'melee_only',   desc:'Melee only. Ranged and magic deal 75% reduced damage.'},
    {trial:'ranged',  enemies:[{id:'smoke_devil',qty:3},{id:'cave_kraken',qty:2}],     mechanic:'ranged_only',  desc:'Ranged only. Melee and magic deal 75% reduced damage.'},
    {trial:'magic',   enemies:[{id:'cerberus',qty:1}],                                mechanic:'magic_only',   desc:'Magic only. The ultimate magic challenge.'},
  ],
  rewards:{xp:{attack:60000,ranged:60000,magic:60000},gold:{min:25000,max:75000},items:[{item:'ferocious_gloves',qty:1,chance:0.05},{item:'pegasian_boots',qty:1,chance:0.05},{item:'eternal_boots',qty:1,chance:0.05}]},
  completionMsg:"Three trials conquered. You have mastered all paths of combat."
});

console.log('[Ashfall] Dungeons Tier 2 loaded:', GAME_DATA.dungeons.length, 'total dungeons/raids');
})();
