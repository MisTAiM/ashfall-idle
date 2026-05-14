// ================================================================
// ASHFALL IDLE — content/quest-chapter-2.js
// 50 new quests across all difficulties.
// Complete story arcs with choices, lore, and meaningful rewards.
// ================================================================
(function() {
'use strict';

if (!Array.isArray(GAME_DATA.quests)) GAME_DATA.quests = [];
const _q = (d) => { if (!GAME_DATA.quests.find(q=>q.id===d.id)) GAME_DATA.quests.push(d); };

// ═══ NOVICE QUESTS (Level 1-20) ══════════════════════════════

_q({id:'first_steps', name:'First Steps', type:'chain', npcId:'old_pete', questPoints:1, difficulty:'Novice',prereqs:[],
  desc:"Old Pete needs help getting his life back in order after the last Ashfall surge. A good introduction to the village.",
  objectives:[{type:'kill',target:'goblin',qty:5,desc:'Slay 5 goblins threatening the village'},{type:'item',item:'oak_log',qty:10,desc:'Bring 10 oak logs for the fire'}],
  rewards:{xp:{attack:300,woodcutting:200},gold:200,items:[{item:'iron_sword',qty:1}],questPoints:1}});

_q({id:'the_farmers_plea', name:"The Farmer's Plea", type:'chain', npcId:'old_pete', questPoints:1, difficulty:'Novice',prereqs:['first_steps'],
  desc:"Crops are failing. Investigate whether the cursed soil or something worse is to blame.",
  objectives:[{type:'item',item:'wheat',qty:20,desc:'Collect 20 wheat'},{type:'kill',target:'moss_snake',qty:5,desc:'Clear snake infestation from the fields'}],
  rewards:{xp:{farming:500,attack:200},gold:300,questPoints:1}});

_q({id:'a_taste_of_danger', name:'A Taste of Danger', type:'chain', npcId:'old_pete', questPoints:2, difficulty:'Easy',prereqs:['the_farmers_plea'],
  desc:"Strange sounds from the cave east of the village. Time to investigate.",
  objectives:[{type:'kill',target:'barbarian',qty:10,desc:'Defeat the barbarians camping near the cave'},{type:'kill',target:'dark_wizard',qty:3,desc:'Banish the dark wizards'}],
  rewards:{xp:{attack:800,magic:400},gold:500,items:[{item:'steel_scimitar',qty:1}],questPoints:2}});

_q({id:'miners_troubles', name:"Miner's Troubles", type:'chain', npcId:'garrick', questPoints:1, difficulty:'Novice',prereqs:[],
  desc:"The mine collapsed. Help recover valuable ore before it's too late.",
  objectives:[{type:'item',item:'iron_ore',qty:30,desc:'Recover 30 iron ore'},{type:'item',item:'coal',qty:20,desc:'Retrieve 20 coal'}],
  rewards:{xp:{mining:600},gold:400,questPoints:1}});

_q({id:'the_apprentice', name:'The Apprentice', type:'chain', npcId:'ilyana', questPoints:1, difficulty:'Novice',prereqs:[],
  desc:"Ilyana needs an apprentice to collect reagents for her spellwork. Learn the basics of magic.",
  objectives:[{type:'item',item:'air_rune',qty:50,desc:'Gather 50 air runes'},{type:'item',item:'fire_rune',qty:30,desc:'Gather 30 fire runes'},{type:'stat',stat:'magic',qty:5,desc:'Reach level 5 Magic'}],
  rewards:{xp:{magic:800},gold:300,items:[{item:'air_staff',qty:1}],questPoints:1}});

_q({id:'lost_hatchet', name:'The Lost Hatchet', type:'chain', npcId:'old_pete', questPoints:1, difficulty:'Novice',prereqs:[],
  desc:"Pete's favourite hatchet was stolen by wolves. Track it down.",
  objectives:[{type:'kill',target:'wolf',qty:5,desc:'Slay the wolves and search for the hatchet'},{type:'item',item:'bones',qty:10,desc:'Bury 10 bones as offering to the forest spirits'}],
  rewards:{xp:{woodcutting:400,prayer:200},gold:250,questPoints:1}});

// ═══ EASY QUESTS (Level 20-40) ════════════════════════════════

_q({id:'the_dark_mine', name:'The Dark Mine', type:'chain', npcId:'garrick', questPoints:2, difficulty:'Easy',prereqs:['miners_troubles'],
  desc:"Something darker than goblins now inhabits the mine's lower levels. Investigate before workers return.",
  objectives:[{type:'kill',target:'dark_wizard',qty:8,desc:'Banish 8 dark wizards from the mine'},{type:'kill',target:'ankou',qty:3,desc:'Destroy the Ankous guarding the deepest level'}],
  rewards:{xp:{attack:2000,mining:1500},gold:1500,items:[{item:'mithril_scimitar',qty:1}],questPoints:2}});

_q({id:'smiths_secret', name:"The Smith's Secret", type:'chain', npcId:'garrick', questPoints:2, difficulty:'Easy',prereqs:['the_dark_mine'],
  desc:"Garrick reveals he knows the formula for runite alloy. But he needs rare components.",
  objectives:[{type:'item',item:'mithril_bar',qty:5,desc:'Smelt 5 mithril bars'},{type:'item',item:'gold_bar',qty:3,desc:'Bring 3 gold bars'},{type:'stat',stat:'smithing',qty:30,desc:'Reach level 30 Smithing'}],
  rewards:{xp:{smithing:3000},gold:2000,items:[{item:'rune_scimitar',qty:1}],questPoints:2}});

_q({id:'sea_shanty', name:'Sea Shanty', type:'chain', npcId:'old_pete', questPoints:2, difficulty:'Easy',prereqs:['a_taste_of_danger'],
  desc:"Fishermen are going missing near the coast. Something lurks beneath.",
  objectives:[{type:'item',item:'raw_shark',qty:5,desc:'Fish 5 sharks from the danger zone'},{type:'kill',target:'cave_kraken',qty:1,desc:'Destroy the cave kraken causing disappearances'}],
  rewards:{xp:{fishing:3000,attack:2500},gold:3000,items:[{item:'trident_swamp',qty:1}],questPoints:2}});

_q({id:'thieve_guild_initiation', name:'Thieves Guild Initiation', type:'chain', npcId:'krolgar', questPoints:2, difficulty:'Easy',prereqs:[],
  desc:"Prove yourself to the guild by completing three contracts without getting caught.",
  objectives:[{type:'stat',stat:'thieving',qty:15,desc:'Reach Thieving level 15'},{type:'item',item:'gold_bar',qty:5,desc:'Steal 5 gold bars from the market district'}],
  rewards:{xp:{thieving:2000},gold:2500,items:[{item:'rogue_top',qty:1}],questPoints:2}});

_q({id:'prayer_of_the_forgotten', name:'Prayer of the Forgotten', type:'chain', npcId:'old_pete', questPoints:2, difficulty:'Easy',prereqs:[],
  desc:"Ancient burial grounds have been disturbed. Help consecrate them before the undead become a plague.",
  objectives:[{type:'item',item:'dragon_bones',qty:5,desc:'Offer 5 dragon bones at the altar'},{type:'kill',target:'ankou',qty:10,desc:'Destroy the restless Ankous'},{type:'stat',stat:'prayer',qty:20,desc:'Reach Prayer level 20'}],
  rewards:{xp:{prayer:5000},gold:2000,items:[{item:'prayer_potion',qty:5}],questPoints:2}});

_q({id:'enchanted_armour', name:'The Enchanted Armour', type:'chain', npcId:'ilyana', questPoints:2, difficulty:'Easy',prereqs:['the_apprentice'],
  desc:"Ilyana wants to enchant a set of armour but needs you to gather the components and defeat the golem she created.",
  objectives:[{type:'item',item:'sapphire',qty:3,desc:'Bring 3 sapphires for the enchantment matrix'},{type:'kill',target:'ash_golem',qty:5,desc:'Test the enchantment on 5 ash golems'}],
  rewards:{xp:{magic:3000,crafting:2000},gold:2500,questPoints:2}});

// ═══ MEDIUM QUESTS (Level 40-60) ══════════════════════════════

_q({id:'giant_slayer', name:'Giant Slayer', type:'chain', npcId:'dorn', questPoints:3, difficulty:'Medium',prereqs:['the_dark_mine'],
  desc:"A clan of giants has declared war on the northern settlements. End their warlord.",
  objectives:[{type:'kill',target:'hill_giant',qty:30,desc:'Slay 30 Hill Giants'},{type:'kill',target:'moss_giant',qty:15,desc:'Slay 15 Moss Giants'},{type:'kill',target:'fire_giant',qty:5,desc:'Slay 5 Fire Giants as a statement'}],
  rewards:{xp:{attack:8000,strength:8000,slayer:5000},gold:8000,items:[{item:'rune_battleaxe',qty:1}],questPoints:3}});

_q({id:'demon_realm_incursion', name:'Demon Realm Incursion', type:'chain', npcId:'dorn', questPoints:3, difficulty:'Medium',prereqs:['blood_moon_rising'],
  desc:"A permanent rift to the demon realm has opened in the mountains. Seal it.",
  objectives:[{type:'kill',target:'lesser_demon',qty:50,desc:'Slay 50 Lesser Demons'},{type:'item',item:'death_rune',qty:100,desc:'Collect 100 Death Runes for the sealing ritual'},{type:'stat',stat:'magic',qty:55,desc:'Reach Magic level 55'}],
  rewards:{xp:{magic:12000,attack:8000},gold:12000,items:[{item:'occult_necklace',qty:1}],questPoints:3}});

_q({id:'masters_of_craft', name:'Masters of Craft', type:'chain', npcId:'garrick', questPoints:3, difficulty:'Medium',prereqs:['smiths_secret'],
  desc:"Garrick challenges you to master multiple crafting disciplines. A true artisan knows all trades.",
  objectives:[{type:'stat',stat:'smithing',qty:50,desc:'Reach Smithing 50'},{type:'stat',stat:'crafting',qty:40,desc:'Reach Crafting 40'},{type:'stat',stat:'fletching',qty:35,desc:'Reach Fletching 35'},{type:'item',item:'dragon_bones',qty:10,desc:'Bring 10 dragon bones for the masterwork project'}],
  rewards:{xp:{smithing:10000,crafting:8000,fletching:6000},gold:15000,items:[{item:'amulet_of_glory',qty:1}],questPoints:3}});

_q({id:'forbidden_spellbook', name:'The Forbidden Spellbook', type:'chain', npcId:'ilyana', questPoints:3, difficulty:'Medium',prereqs:['enchanted_armour'],
  desc:"A dark spellbook has surfaced. Study it, master its contents, and keep it from the wrong hands.",
  objectives:[{type:'stat',stat:'magic',qty:60,desc:'Reach Magic level 60'},{type:'kill',target:'dark_wizard',qty:20,desc:'Slay 20 dark wizards testing the spells'},{type:'item',item:'soul_rune',qty:20,desc:'Obtain 20 soul runes'}],
  rewards:{xp:{magic:15000},gold:12000,items:[{item:'ancient_staff',qty:1}],questPoints:3}});

_q({id:'swamp_stalker', name:'Swamp Stalker', type:'chain', npcId:'grey', questPoints:3, difficulty:'Medium',prereqs:[],
  desc:"Grey's contact was last seen heading into the toxic swamps. Find them — alive or otherwise.",
  objectives:[{type:'kill',target:'moss_snake',qty:30,desc:'Clear the path through the swamp'},{type:'kill',target:'moss_giant',qty:10,desc:'Deal with the giant guarding the deep swamp'},{type:'item',item:'antipoison',qty:5,desc:'Bring antipoison for the journey'}],
  rewards:{xp:{attack:8000,ranged:5000},gold:10000,items:[{item:'blowpipe',qty:1}],questPoints:3}});

_q({id:'the_banshee_cry', name:'The Banshee Cry', type:'chain', npcId:'grey', questPoints:2, difficulty:'Medium',prereqs:['prayer_of_the_forgotten'],
  desc:"Banshee wails are driving the nearby village mad. Find their source and silence it.",
  objectives:[{type:'kill',target:'banshee',qty:25,desc:'Slay 25 Banshees'},{type:'kill',target:'aberrant_spectre',qty:5,desc:'Destroy the Aberrant Spectres commanding them'},{type:'stat',stat:'slayer',qty:15,desc:'Reach Slayer level 15'}],
  rewards:{xp:{slayer:8000,prayer:5000},gold:10000,items:[{item:'slayer_helm',qty:1}],questPoints:2}});

_q({id:'rangers_secret', name:"Ranger's Secret", type:'chain', npcId:'grey', questPoints:3, difficulty:'Medium',prereqs:['frozen_in_time'],
  desc:"Grey's sister teaches you the art of advanced archery — techniques lost for decades.",
  objectives:[{type:'stat',stat:'ranged',qty:50,desc:'Reach Ranged level 50'},{type:'kill',target:'steel_dragon',qty:1,desc:'Slay a Steel Dragon using only ranged'},{type:'item',item:'rune_bolt',qty:500,desc:'Purchase 500 rune bolts'}],
  rewards:{xp:{ranged:15000},gold:12000,items:[{item:'armadyl_crossbow_weapon',qty:1}],questPoints:3}});

_q({id:'nightmare_beast', name:'The Nightmare Beast', type:'chain', npcId:'vex', questPoints:3, difficulty:'Medium',prereqs:[],
  desc:"A dream-devouring entity has been fragmenting people's sleep across the region. Enter the dreamscape and destroy it.",
  objectives:[{type:'kill',target:'ankou',qty:20,desc:'Slay 20 Ankous to weaken the dream barrier'},{type:'kill',target:'aberrant_spectre',qty:10,desc:'Destroy 10 Aberrant Spectres'},{type:'item',item:'blood_rune',qty:50,desc:'Bring 50 blood runes for the dream portal'}],
  rewards:{xp:{magic:12000,hitpoints:5000},gold:12000,items:[{item:'nightmare_staff',qty:1}],questPoints:3}});

// ═══ HARD QUESTS (Level 60-80) ════════════════════════════════

_q({id:'slayer_master', name:'Path of the Slayer Master', type:'chain', npcId:'dorn', questPoints:4, difficulty:'Hard',prereqs:['giant_slayer','the_banshee_cry'],
  desc:"Dorn grants you the title of Slayer Master. But first, prove yourself against the hardest tasks.",
  objectives:[{type:'stat',stat:'slayer',qty:70,desc:'Reach Slayer level 70'},{type:'kill',target:'hellhound',qty:20,desc:'Slay 20 Hellhounds'},{type:'kill',target:'gargoyle',qty:15,desc:'Slay 15 Gargoyles'},{type:'kill',target:'dark_beast',qty:5,desc:'Slay 5 Dark Beasts'}],
  rewards:{xp:{slayer:30000,attack:15000},gold:25000,items:[{item:'slayer_helm_i',qty:1}],questPoints:4}});

_q({id:'dragonkin_blood', name:'Dragonkin Blood', type:'chain', npcId:'dorn', questPoints:4, difficulty:'Hard',prereqs:['giant_slayer','demon_realm_incursion'],
  desc:"Ancient dragonkin blood can craft legendary armour. Hunt the highest tier dragons.",
  objectives:[{type:'kill',target:'steel_dragon',qty:10,desc:'Slay 10 Steel Dragons'},{type:'kill',target:'mithril_dragon',qty:5,desc:'Slay 5 Mithril Dragons'},{type:'kill',target:'adamant_dragon',qty:2,desc:'Slay 2 Adamant Dragons'},{type:'item',item:'super_antifire',qty:5,desc:'Bring 5 super antifire potions'}],
  rewards:{xp:{attack:25000,defence:20000,slayer:15000},gold:35000,items:[{item:'dragon_hunter_lance',qty:1}],questPoints:4}});

_q({id:'hydra_hunt', name:'Hydra Hunt', type:'chain', npcId:'dorn', questPoints:4, difficulty:'Hard',prereqs:['slayer_master'],
  desc:"The Alchemical Hydra is a unique challenge — it shifts elements mid-battle. Learn its patterns.",
  objectives:[{type:'stat',stat:'slayer',qty:95,desc:'Reach Slayer level 95'},{type:'kill',target:'alchemical_hydra',qty:1,desc:'Defeat the Alchemical Hydra'},{type:'item',item:'antidote_pp',qty:3,desc:'Bring 3 Antidote++ potions'}],
  rewards:{xp:{slayer:50000,ranged:30000},gold:50000,items:[{item:'dragon_hunter_crossbow',qty:1}],questPoints:4}});

_q({id:'smoke_lord', name:'Smoke Lord', type:'chain', npcId:'dorn', questPoints:3, difficulty:'Hard',prereqs:['slayer_master'],
  desc:"The Thermonuclear Smoke Devil has terrorised the smoke dungeon for centuries. End it.",
  objectives:[{type:'stat',stat:'slayer',qty:93,desc:'Reach Slayer level 93'},{type:'kill',target:'smoke_devil',qty:20,desc:'Slay 20 Smoke Devils'},{type:'kill',target:'thermonuclear_smoke_devil',qty:1,desc:'Defeat the Thermonuclear Smoke Devil'}],
  rewards:{xp:{slayer:40000,magic:20000},gold:40000,items:[{item:'occult_necklace',qty:1}],questPoints:3}});

_q({id:'cerberus_slaying', name:'The Three Heads', type:'chain', npcId:'dorn', questPoints:4, difficulty:'Hard',prereqs:['hydra_hunt'],
  desc:"Cerberus — the three-headed guardian of the underworld. Few survive this encounter.",
  objectives:[{type:'stat',stat:'slayer',qty:91,desc:'Reach Slayer level 91'},{type:'kill',target:'hellhound',qty:30,desc:'Slay 30 hellhounds to weaken the barrier'},{type:'kill',target:'cerberus',qty:1,desc:'Defeat Cerberus'}],
  rewards:{xp:{slayer:60000,defence:30000},gold:60000,items:[{item:'primordial_boots',qty:1}],questPoints:4}});

_q({id:'arcane_summit', name:'Arcane Summit', type:'chain', npcId:'ilyana', questPoints:4, difficulty:'Hard',prereqs:['forbidden_spellbook'],
  desc:"The final test of magical mastery. Prove you can wield the most dangerous spells.",
  objectives:[{type:'stat',stat:'magic',qty:75,desc:'Reach Magic level 75'},{type:'kill',target:'cave_kraken',qty:5,desc:'Slay 5 Cave Krakens using magic'},{type:'item',item:'soul_rune',qty:100,desc:'Obtain 100 soul runes'},{type:'item',item:'blood_rune',qty:100,desc:'Obtain 100 blood runes'}],
  rewards:{xp:{magic:40000},gold:40000,items:[{item:'harmonised_nightmare',qty:1}],questPoints:4}});

_q({id:'wilderness_warrior', name:'Wilderness Warrior', type:'chain', npcId:'dorn', questPoints:4, difficulty:'Hard',prereqs:['wild_surge'],
  desc:"Dorn knows the Wilderness holds the strongest monsters. Prove dominance there.",
  objectives:[{type:'kill',target:'scorpia',qty:1,desc:"Defeat Scorpia"},{type:'kill',target:'callisto',qty:1,desc:'Defeat Callisto'},{type:'kill',target:'venenatis',qty:1,desc:'Defeat Venenatis'}],
  rewards:{xp:{attack:30000,strength:30000,defence:20000},gold:80000,items:[{item:'berserker_ring_i',qty:1}],questPoints:4}});

_q({id:'unholy_path', name:'The Unholy Path', type:'chain', npcId:'vex', questPoints:3, difficulty:'Hard',prereqs:['forbidden_spellbook','prayer_of_the_forgotten'],
  desc:"Vex reveals an ancient and dangerous prayer book. Study it, but know the risks.",
  objectives:[{type:'stat',stat:'prayer',qty:55,desc:'Reach Prayer level 55'},{type:'item',item:'ash_infused_bones',qty:10,desc:'Offer 10 Ash-Infused Bones at the dark altar'},{type:'kill',target:'ankou',qty:30,desc:'Commune with 30 Ankous in the death realm'}],
  rewards:{xp:{prayer:30000},gold:25000,items:[{item:'salve_amulet',qty:1}],questPoints:3,unlocks:'Unholy Prayer Book — access to dark prayers'}});

_q({id:'master_of_shadows', name:'Master of Shadows', type:'chain', npcId:'krolgar', questPoints:4, difficulty:'Hard',prereqs:['thieve_guild_initiation'],
  desc:"The guild's most prestigious contract. Shadow the most heavily guarded vaults in the Ashfall.",
  objectives:[{type:'stat',stat:'thieving',qty:70,desc:'Reach Thieving level 70'},{type:'item',item:'gold_bar',qty:50,desc:'Steal 50 gold bars in total'},{type:'kill',target:'guard',qty:20,desc:'Neutralise 20 guards who spotted you'}],
  rewards:{xp:{thieving:30000},gold:50000,items:[{item:'ring_of_visibility',qty:1}],questPoints:4}});

// ═══ ELITE QUESTS (Level 80-99) ═══════════════════════════════

_q({id:'master_slayer', name:'Master of All Slayers', type:'chain', npcId:'dorn', questPoints:5, difficulty:'Elite',prereqs:['slayer_master','cerberus_slaying','hydra_hunt'],
  desc:"The ultimate Slayer title. Every monster on the task list must be mastered.",
  objectives:[{type:'stat',stat:'slayer',qty:95,desc:'Reach Slayer level 95'},{type:'kill',target:'cerberus',qty:3,desc:'Slay Cerberus 3 times'},{type:'kill',target:'alchemical_hydra',qty:3,desc:'Slay Alchemical Hydra 3 times'},{type:'kill',target:'thermonuclear_smoke_devil',qty:3,desc:'Slay Thermonuclear Smoke Devil 3 times'}],
  rewards:{xp:{slayer:100000,attack:50000},gold:100000,items:[{item:'infernal_cape',qty:1}],questPoints:5}});

_q({id:'maxed_warrior', name:'Road to Max', type:'chain', npcId:'dorn', questPoints:5, difficulty:'Grandmaster',prereqs:['champions_gauntlet','master_slayer'],
  desc:"The gods of the Ashfall challenge you to prove total mastery. Max every combat skill.",
  objectives:[{type:'stat',stat:'attack',qty:99,desc:'Reach 99 Attack'},{type:'stat',stat:'strength',qty:99,desc:'Reach 99 Strength'},{type:'stat',stat:'defence',qty:99,desc:'Reach 99 Defence'},{type:'stat',stat:'hitpoints',qty:99,desc:'Reach 99 Hitpoints'}],
  rewards:{xp:{attack:100000,strength:100000,defence:100000},gold:500000,items:[{item:'infernal_cape',qty:1},{item:'ferocious_gloves',qty:1},{item:'primordial_boots',qty:1}],questPoints:5,unlocks:'Max Combat Achievement — exclusive title and cosmetic'}});

_q({id:'arcane_mastery', name:'Arcane Mastery', type:'chain', npcId:'ilyana', questPoints:5, difficulty:'Elite',prereqs:['arcane_summit','archmage_tasks'],
  desc:"The final chapter of magical mastery. Ilyana reveals the secrets of the Ancestral Path.",
  objectives:[{type:'stat',stat:'magic',qty:90,desc:'Reach Magic level 90'},{type:'kill',target:'void_emperor_spawn',qty:5,desc:"Destroy 5 Void Emperor's Spawns using only magic"},{type:'item',item:'wrath_rune',qty:200,desc:'Obtain 200 wrath runes'}],
  rewards:{xp:{magic:100000},gold:100000,items:[{item:'ancestral_hat',qty:1},{item:'ancestral_robe',qty:1},{item:'ancestral_legs',qty:1}],questPoints:5}});

_q({id:'archmage_tasks', name:'The Archmage Tasks', type:'chain', npcId:'ilyana', questPoints:3, difficulty:'Hard',prereqs:['arcane_summit'],
  desc:"Ilyana sets you a series of escalating magical challenges to earn the title of Archmage.",
  objectives:[{type:'stat',stat:'magic',qty:80,desc:'Reach Magic level 80'},{type:'kill',target:'smoke_devil',qty:30,desc:'Slay 30 Smoke Devils with magic'},{type:'kill',target:'cerberus',qty:1,desc:'Defeat Cerberus using only magic spells'}],
  rewards:{xp:{magic:60000},gold:60000,items:[{item:'tormented_bracelet',qty:1}],questPoints:3}});

// ═══ SKILL QUESTS ═════════════════════════════════════════════

_q({id:'woodcutting_mastery', name:'The Ancient Woodsman', type:'chain', npcId:'old_pete', questPoints:2, difficulty:'Medium',prereqs:[],
  desc:"An ancient woodsman spirit will teach you lost techniques — if you prove worthy.",
  objectives:[{type:'stat',stat:'woodcutting',qty:60,desc:'Reach Woodcutting level 60'},{type:'item',item:'magic_log',qty:50,desc:'Chop 50 magic logs'},{type:'item',item:'yew_log',qty:100,desc:'Chop 100 yew logs'}],
  rewards:{xp:{woodcutting:20000},gold:8000,items:[{item:'dragon_axe',qty:1}],questPoints:2}});

_q({id:'master_miner', name:'Heart of the Mountain', type:'chain', npcId:'garrick', questPoints:2, difficulty:'Medium',prereqs:['miners_troubles'],
  desc:"Deep within the mountain lies a vein of legendary ore. Only a master miner can reach it.",
  objectives:[{type:'stat',stat:'mining',qty:70,desc:'Reach Mining level 70'},{type:'item',item:'runite_ore',qty:10,desc:'Mine 10 runite ores'},{type:'item',item:'dragon_ore',qty:5,desc:'Mine 5 legendary dragon ore veins'}],
  rewards:{xp:{mining:25000},gold:10000,items:[{item:'dragon_pickaxe',qty:1}],questPoints:2}});

_q({id:'grandmaster_chef', name:'The Grand Feast', type:'chain', npcId:'old_pete', questPoints:2, difficulty:'Medium',prereqs:[],
  desc:"The village needs a feast to lift morale. Cook the finest meal ever seen.",
  objectives:[{type:'stat',stat:'cooking',qty:70,desc:'Reach Cooking level 70'},{type:'item',item:'cooked_shark',qty:20,desc:'Cook 20 sharks'},{type:'item',item:'cooked_anglerfish',qty:10,desc:'Cook 10 anglerfish'}],
  rewards:{xp:{cooking:20000},gold:8000,items:[{item:'chef_hat',qty:1}],questPoints:2}});

_q({id:'farming_secrets', name:"Farmer's Almanac", type:'chain', npcId:'old_pete', questPoints:2, difficulty:'Medium',prereqs:['the_farmers_plea'],
  desc:"Ancient farming techniques are hidden in an old almanac. Recover and implement them.",
  objectives:[{type:'stat',stat:'farming',qty:50,desc:'Reach Farming level 50'},{type:'item',item:'torstol',qty:5,desc:'Grow 5 torstol herbs'},{type:'item',item:'ranarr',qty:10,desc:'Grow 10 ranarr herbs'}],
  rewards:{xp:{farming:20000},gold:8000,items:[{item:'magic_secateurs',qty:1}],questPoints:2}});

_q({id:'runecrafting_awakening', name:'The Rune Awakening', type:'chain', npcId:'ilyana', questPoints:3, difficulty:'Hard',prereqs:['the_apprentice'],
  desc:"The secrets of runecrafting were nearly lost in the Ashfall. Rediscover them.",
  objectives:[{type:'stat',stat:'incantation',qty:60,desc:'Reach Incantation Crafting level 60'},{type:'item',item:'death_rune',qty:200,desc:'Craft 200 death runes at the death altar'},{type:'item',item:'wrath_rune',qty:50,desc:'Craft 50 wrath runes'}],
  rewards:{xp:{incantation:30000},gold:15000,items:[{item:'runecrafting_tiara',qty:1}],questPoints:3}});

_q({id:'herblore_secrets', name:'Potion Master', type:'chain', npcId:'grey', questPoints:3, difficulty:'Hard',prereqs:[],
  desc:"Grey's medicinal knowledge runs deep. Learn everything about herblore to become a true master.",
  objectives:[{type:'stat',stat:'herblore',qty:65,desc:'Reach Herblore level 65'},{type:'item',item:'super_combat',qty:5,desc:'Brew 5 super combat potions'},{type:'item',item:'overload_potion',qty:2,desc:'Brew 2 overload potions'}],
  rewards:{xp:{herblore:25000},gold:20000,items:[{item:'bastion_potion',qty:10},{item:'battlemage_potion',qty:10}],questPoints:3}});

// ═══ LORE QUESTS (Story arcs) ════════════════════════════════

_q({id:'the_first_ashfall', name:'The First Ashfall', type:'chain', npcId:'vex', questPoints:4, difficulty:'Elite',prereqs:['ashen_chronicle'],
  desc:"The Chronicle reveals the first Ashfall was a weapon. Who built it — and can it be deactivated?",
  objectives:[{type:'item',item:'ancient_scroll',qty:5,desc:'Find 5 ancient scrolls in the Ashfall ruins'},{type:'kill',target:'elder_ash_golem',qty:5,desc:'Destroy 5 Elder Ash Golems who guard the truth'},{type:'kill',target:'ash_titan',qty:2,desc:'Defeat 2 Ash Titans protecting the central core'}],
  rewards:{xp:{magic:40000,attack:30000},gold:60000,items:[{item:'elder_core',qty:5},{item:'ancient_staff',qty:1}],questPoints:4,lore:"The Ashfall was a doomsday weapon — built by the Ancient Order to stop the Void Emperor. Its creator could not activate it. You may have to."}});

_q({id:'void_emperor_origins', name:"Void Emperor's Origins", type:'chain', npcId:'vex', questPoints:5, difficulty:'Grandmaster',prereqs:['the_first_ashfall','void_emperors_warning'],
  desc:"Everything Vex knows about the Void Emperor is wrong. The truth is more terrifying.",
  objectives:[{type:'kill',target:'void_emperor_spawn',qty:30,desc:"Destroy 30 Void Emperor's Spawns to weaken the barrier"},{type:'item',item:'void_essence',qty:15,desc:'Collect 15 void essence from the core'},{type:'stat',stat:'magic',qty:85,desc:'Reach Magic level 85'}],
  rewards:{xp:{magic:80000,hitpoints:40000},gold:150000,items:[{item:'void_wand',qty:1},{item:'zaryte_crossbow',qty:1}],questPoints:5,lore:'The Void Emperor was once a player — a warrior who sacrificed themselves to stop an even greater threat. They became what they fought.'}});

_q({id:'the_void_war', name:'The Void War', type:'chain', npcId:'dorn', questPoints:5, difficulty:'Grandmaster',prereqs:['void_emperor_origins','celestial_accord'],
  desc:"The final confrontation. The Void Emperor must be defeated before the second Ashfall destroys everything.",
  objectives:[{type:'kill',target:'void_titan',qty:20,desc:'Defeat 20 Void Titans in the advance'},{type:'kill',target:'demon_lord',qty:5,desc:'Break the demon flank'},{type:'kill',target:'void_emperor',qty:1,desc:'Defeat the Void Emperor'}],
  rewards:{xp:{attack:200000,strength:200000,magic:200000,defence:100000},gold:1000000,items:[{item:'void_emperor_cape',qty:1},{item:'celestial_blade',qty:1},{item:'ancestral_robe',qty:1}],questPoints:5,unlocks:'Void Conqueror title and access to post-game content'}});

console.log('[Ashfall] Quest Chapter 2 loaded:', GAME_DATA.quests.length, 'total quests');

})();
