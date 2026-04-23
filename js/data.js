// ============================================================
// ASHFALL IDLE - Game Data v2 (ForgeIdle expansion)
// ============================================================

const GAME_DATA = {
  version: 2,

  xpTable: (() => {
    const t = [0];
    for (let i = 1; i <= 120; i++) t[i] = Math.floor(t[i-1] + Math.floor(i + 300 * Math.pow(2, i/7)) / 4);
    return t;
  })(),

  skills: {
    woodcutting:{id:'woodcutting',name:'Woodcutting',type:'gathering',icon:'axe',desc:'Chop trees for logs.'},
    mining:{id:'mining',name:'Mining',type:'gathering',icon:'pickaxe',desc:'Mine rocks for ores and gems.'},
    fishing:{id:'fishing',name:'Fishing',type:'gathering',icon:'fish',desc:'Catch fish for cooking.'},
    foraging:{id:'foraging',name:'Foraging',type:'gathering',icon:'herb',desc:'Gather herbs and rare plants.'},
    hunting:{id:'hunting',name:'Hunting',type:'gathering',icon:'paw',desc:'Track and hunt beasts for hides.'},
    cooking:{id:'cooking',name:'Cooking',type:'artisan',icon:'cauldron',desc:'Cook raw food for combat healing.'},
    smithing:{id:'smithing',name:'Smithing',type:'artisan',icon:'anvil',desc:'Smelt ores and forge weapons/armor.'},
    fletching:{id:'fletching',name:'Fletching',type:'artisan',icon:'bow',desc:'Craft bows and arrows.'},
    crafting:{id:'crafting',name:'Crafting',type:'artisan',icon:'ring',desc:'Create jewelry, leather armor, and robes.'},
    alchemy:{id:'alchemy',name:'Alchemy',type:'artisan',icon:'potion',desc:'Brew potions from herbs.'},
    enchanting:{id:'enchanting',name:'Enchanting',type:'artisan',icon:'sparkle',desc:'Imbue equipment with magic.'},
    attack:{id:'attack',name:'Attack',type:'combat',icon:'sword',desc:'Melee accuracy.'},
    strength:{id:'strength',name:'Strength',type:'combat',icon:'fist',desc:'Melee max hit.'},
    defence:{id:'defence',name:'Defence',type:'combat',icon:'shield',desc:'Damage reduction and evasion.'},
    hitpoints:{id:'hitpoints',name:'Hitpoints',type:'combat',icon:'heart',desc:'Your health pool.'},
    ranged:{id:'ranged',name:'Ranged',type:'combat',icon:'target',desc:'Ranged accuracy and damage.'},
    magic:{id:'magic',name:'Magic',type:'combat',icon:'wand',desc:'Spell accuracy and damage.'},
    tactics:{id:'tactics',name:'Tactics',type:'combat',icon:'banner',desc:'Unlocks ability slots and status potency.'},
    farming:{id:'farming',name:'Farming',type:'support',icon:'seedling',desc:'Grow crops passively.'},
    thieving:{id:'thieving',name:'Thieving',type:'support',icon:'mask',desc:'Pickpocket NPCs.'},
    trading:{id:'trading',name:'Trading',type:'support',icon:'scale',desc:'Reduces shop prices, boosts sell values.'},
    leadership:{id:'leadership',name:'Leadership',type:'support',icon:'crown',desc:'Unlocks War Cry buffs.'},
    diplomacy:{id:'diplomacy',name:'Diplomacy',type:'support',icon:'scroll',desc:'Boosts reputation gain.'},
    prayer:{id:'prayer',name:'Prayer',type:'combat',icon:'sparkle',desc:'Bury bones for prayer points. Activate prayers for combat buffs.'},
    slayer:{id:'slayer',name:'Slayer',type:'combat',icon:'target',desc:'Complete assigned kill tasks for Slayer XP and Slayer Coins.'},
    necromancy:{id:'necromancy',name:'Necromancy',type:'combat',icon:'skull',desc:'Dark combat magic. Raise undead, drain life, curse enemies.'},
    summoning:{id:'summoning',name:'Summoning',type:'support',icon:'sparkle',desc:'Create combat familiars from collected charms.'},
    incantation:{id:'incantation',name:'Incantation Crafting',type:'artisan',icon:'wand',desc:'Craft runes from essence at magical altars. The foundation of all magic.'},
  },

  alignments: {
    lawful_good:{id:'lawful_good',name:'The Defender',axis:'LG',desc:'+10% sell value.',bonus:{sellBonus:10}},
    neutral_good:{id:'neutral_good',name:'The Benefactor',axis:'NG',desc:'+5% gathering XP.',bonus:{gatherXp:5}},
    chaotic_good:{id:'chaotic_good',name:'The Vigilante',axis:'CG',desc:'+15% combat XP vs evil.',bonus:{combatXpEvil:15}},
    lawful_neutral:{id:'lawful_neutral',name:'The Arbiter',axis:'LN',desc:'+10% Diplomacy XP.',bonus:{diplomacyXp:10}},
    true_neutral:{id:'true_neutral',name:'The Mercenary',axis:'NN',desc:'Balanced. All factions accessible.',bonus:{}},
    chaotic_neutral:{id:'chaotic_neutral',name:'The Wanderer',axis:'CN',desc:'+5% loot quantity.',bonus:{lootQty:5}},
    lawful_evil:{id:'lawful_evil',name:'The Hellknight',axis:'LE',desc:'+10% Strength damage.',bonus:{strengthDmg:10}},
    neutral_evil:{id:'neutral_evil',name:'The Profiteer',axis:'NE',desc:'-20% shop prices, +10% gold.',bonus:{shopDiscount:20,goldDrop:10}},
    chaotic_evil:{id:'chaotic_evil',name:'The Destroyer',axis:'CE',desc:'+20% damage to all creatures.',bonus:{globalDmg:20}},
  },

  factions: {
    silver_order:{id:'silver_order',name:'The Silver Order',desc:'A holy order of paladins.',tiers:[{rep:0,title:'Stranger',perk:'None'},{rep:500,title:'Squire',perk:'+2% melee accuracy'},{rep:2000,title:'Knight',perk:'+5% melee accuracy'},{rep:10000,title:'Paladin',perk:'+10% accuracy, +5% dmg vs evil'},{rep:50000,title:'Grandmaster',perk:'Silver Champion access'}]},
    ashen_guild:{id:'ashen_guild',name:'The Ashen Merchant Guild',desc:'Neutral traders.',tiers:[{rep:0,title:'Wanderer',perk:'None'},{rep:500,title:'Customer',perk:'-5% shop prices'},{rep:2000,title:'Associate',perk:'-10% shop, +10% sell'},{rep:10000,title:'Partner',perk:'-15% shop, +20% sell'},{rep:50000,title:'Guildmaster',perk:'Black market access'}]},
    bloodfang_clan:{id:'bloodfang_clan',name:'The Bloodfang Clan',desc:'Bandits and raiders.',tiers:[{rep:0,title:'Outsider',perk:'None'},{rep:500,title:'Initiate',perk:'+5% loot from humanoids'},{rep:2000,title:'Raider',perk:'+10% loot'},{rep:10000,title:'Warchief',perk:'+15% loot, Bloodfang armor'},{rep:50000,title:'Bloodlord',perk:'Bloodforge weapons'}]},
    veiled_circle:{id:'veiled_circle',name:'The Veiled Circle',desc:'A cabal of wizards.',tiers:[{rep:0,title:'Apprentice',perk:'None'},{rep:500,title:'Acolyte',perk:'+5% magic XP'},{rep:2000,title:'Adept',perk:'+10% magic XP'},{rep:10000,title:'Archmage',perk:'+15% magic XP'},{rep:50000,title:'Voidseer',perk:'Forbidden void magic'}]},
  },

  npcs: [
    {id:'old_pete',name:'Old Pete',faction:null,title:'Village Elder',desc:'A kind old man with simple requests.',location:'Mill Village'},
    {id:'elara',name:'Commander Elara',faction:'silver_order',title:'Silver Knight',desc:'Stern commander seeking heroes.',location:'Silverhold Keep'},
    {id:'garrick',name:'Merchant Garrick',faction:'ashen_guild',title:'Guild Agent',desc:'Shrewd trader of the guild.',location:'Ashmarket Square'},
    {id:'krolgar',name:'Krolgar the Butcher',faction:'bloodfang_clan',title:'Bloodfang Raider',desc:'A hulking brute who respects strength.',location:'Bloodfang Hideout'},
    {id:'ilyana',name:'Archivist Ilyana',faction:'veiled_circle',title:'Circle Mage',desc:'Reclusive scholar of forbidden lore.',location:'The Hidden Spire'},
  ],

  quests: [
    {id:'pete_1',npc:'old_pete',name:'A Helping Hand',desc:'Bring 10 oak logs for the fireplace.',objectives:[{type:'gather',item:'oak_log',qty:10}],rewards:{gold:50,xp:{woodcutting:100}},prereq:null,reqLevels:{},reqQuests:[]},
    {id:'pete_2',npc:'old_pete',name:'Rat Trouble',desc:'Kill 5 giant rats.',objectives:[{type:'kill',monster:'rat',qty:5}],rewards:{gold:100,xp:{attack:150,strength:150}},prereq:'pete_1',reqLevels:{attack:1},reqQuests:['pete_1']},
    {id:'pete_3',npc:'old_pete',name:'A Warm Meal',desc:'Cook 10 shrimp for the children.',objectives:[{type:'craft',item:'shrimp',qty:10}],rewards:{gold:75,xp:{cooking:200}},prereq:'pete_2',reqLevels:{cooking:1},reqQuests:['pete_2']},
    {id:'pete_4',npc:'old_pete',name:'Goblin Menace',desc:'Slay 10 goblins.',objectives:[{type:'kill',monster:'goblin',qty:10}],rewards:{gold:200,xp:{attack:300,strength:300}},prereq:'pete_3'},
    {id:'elara_1',npc:'elara',name:'The First Test',desc:'Slay 20 skeletons.',objectives:[{type:'kill',monster:'skeleton',qty:20}],rewards:{gold:300,xp:{attack:500,strength:500,defence:500},rep:{silver_order:300}},prereq:null,reqLevels:{attack:10,defence:5},reqQuests:[],faction:'silver_order'},
    {id:'elara_2',npc:'elara',name:'Banditry Must End',desc:'Kill 10 bandits.',objectives:[{type:'kill',monster:'bandit',qty:10}],rewards:{gold:500,xp:{attack:750,strength:750},rep:{silver_order:400}},prereq:'elara_1',reqLevels:{attack:20,strength:15},reqQuests:['elara_1']},
    {id:'elara_3',npc:'elara',name:'Trolls of Ironpeak',desc:'Hunt 5 trolls.',objectives:[{type:'kill',monster:'troll',qty:5}],rewards:{gold:1000,xp:{attack:1500,strength:1500,defence:800},rep:{silver_order:600}},prereq:'elara_2',reqLevels:{attack:30,strength:25,defence:20},reqQuests:['elara_2']},
    {id:'elara_4',npc:'elara',name:'Dragonslayer',desc:'Slay a Dragon.',objectives:[{type:'kill',monster:'dragon',qty:1}],rewards:{gold:5000,xp:{attack:5000,strength:5000,defence:3000},rep:{silver_order:2000},items:[{item:'silver_champion_sword',qty:1}]},prereq:'elara_3',reqLevels:{attack:50,strength:45,defence:40},reqQuests:['elara_3']},
    {id:'garrick_1',npc:'garrick',name:'Bulk Order: Iron',desc:'Deliver 50 iron ore.',objectives:[{type:'gather',item:'iron_ore',qty:50}],rewards:{gold:500,xp:{mining:300},rep:{ashen_guild:200}},prereq:null,reqLevels:{mining:15},reqQuests:[],faction:'ashen_guild'},
    {id:'garrick_2',npc:'garrick',name:'Finished Goods',desc:'Smith 20 steel bars.',objectives:[{type:'craft',item:'steel_bar',qty:20}],rewards:{gold:1000,xp:{smithing:500},rep:{ashen_guild:300}},prereq:'garrick_1',reqLevels:{smithing:30,mining:20},reqQuests:['garrick_1']},
    {id:'garrick_3',npc:'garrick',name:'Exotic Imports',desc:'Source 10 rubies.',objectives:[{type:'gather',item:'ruby',qty:10}],rewards:{gold:2000,xp:{mining:800},rep:{ashen_guild:500}},prereq:'garrick_2',reqLevels:{mining:40},reqQuests:['garrick_2']},
    {id:'garrick_4',npc:'garrick',name:'Merchant Prince',desc:'Accumulate 100,000 gold.',objectives:[{type:'gold',qty:100000}],rewards:{gold:10000,xp:{trading:5000},rep:{ashen_guild:1500}},prereq:'garrick_3'},
    {id:'krolgar_1',npc:'krolgar',name:'Crush the Weak',desc:'Kill 20 chickens.',objectives:[{type:'kill',monster:'chicken',qty:20}],rewards:{gold:100,xp:{strength:300},rep:{bloodfang_clan:200}},prereq:null,faction:'bloodfang_clan'},
    {id:'krolgar_2',npc:'krolgar',name:'Rob the Nobles',desc:'Pickpocket 10 nobles.',objectives:[{type:'thieve',target:'pickpocket_noble',qty:10}],rewards:{gold:500,xp:{thieving:500},rep:{bloodfang_clan:400}},prereq:'krolgar_1'},
    {id:'krolgar_3',npc:'krolgar',name:'The Ogre Hunt',desc:'Slay 3 ogres.',objectives:[{type:'kill',monster:'ogre',qty:3}],rewards:{gold:1500,xp:{strength:2000},rep:{bloodfang_clan:800}},prereq:'krolgar_2'},
    {id:'krolgar_4',npc:'krolgar',name:'Blood and Fire',desc:'Slay a demon.',objectives:[{type:'kill',monster:'demon',qty:1}],rewards:{gold:3000,xp:{strength:3500,attack:1000},rep:{bloodfang_clan:1500},items:[{item:'bloodfang_cleaver',qty:1}]},prereq:'krolgar_3'},
    {id:'ilyana_1',npc:'ilyana',name:'Essence Gathering',desc:'Bring 100 rune essence.',objectives:[{type:'gather',item:'rune_essence',qty:100}],rewards:{gold:200,xp:{magic:500},rep:{veiled_circle:300}},prereq:null,reqLevels:{magic:1,mining:1},reqQuests:[],faction:'veiled_circle'},
    {id:'ilyana_2',npc:'ilyana',name:'Forbidden Herbs',desc:'Procure 20 voidblooms.',objectives:[{type:'gather',item:'voidbloom',qty:20}],rewards:{gold:800,xp:{foraging:1000,magic:500},rep:{veiled_circle:500}},prereq:'ilyana_1'},
    {id:'ilyana_3',npc:'ilyana',name:'Dark Magic Study',desc:'Bring 30 death runes.',objectives:[{type:'gather',item:'death_rune',qty:30}],rewards:{gold:1500,xp:{magic:2000},rep:{veiled_circle:800}},prereq:'ilyana_2',reqLevels:{magic:40,runecrafting:30},reqQuests:['ilyana_2']},
    {id:'ilyana_4',npc:'ilyana',name:'Void Pact',desc:'Slay a Void Walker.',objectives:[{type:'kill',monster:'void_walker',qty:1}],rewards:{gold:5000,xp:{magic:5000},rep:{veiled_circle:2000},items:[{item:'voidseer_staff',qty:1}]},prereq:'ilyana_3'},
  ],

  items: (() => {
    const items = {};
    const add = (id, data) => { items[id] = Object.assign({id}, data); };

    // LOGS / ORES / BARS / GEMS / FISH / HERBS / MISC / RUNES / SEEDS / PRODUCE
    add('oak_log',      {name:'Oak Log',      type:'resource',subtype:'log', sellPrice:2,   sprite:'log-brown', desc:'A sturdy oak log.'});
    add('willow_log',   {name:'Willow Log',   type:'resource',subtype:'log', sellPrice:5,   sprite:'log-pale',  desc:'A flexible willow log.'});
    add('maple_log',    {name:'Maple Log',    type:'resource',subtype:'log', sellPrice:15,  sprite:'log-red',   desc:'A dense maple log.'});
    add('yew_log',      {name:'Yew Log',      type:'resource',subtype:'log', sellPrice:40,  sprite:'log-dark',  desc:'A prized yew log.'});
    add('elder_log',    {name:'Elder Log',    type:'resource',subtype:'log', sellPrice:100, sprite:'log-gold',  desc:'An ancient elder log.'});
    add('ash_log',      {name:'Ashwood Log',  type:'resource',subtype:'log', sellPrice:250, sprite:'log-black', desc:'Charred ashwood.'});
    add('copper_ore',   {name:'Copper Ore',   type:'resource',subtype:'ore', sellPrice:3,   sprite:'ore-copper', desc:'A chunk of copper ore.'});
    add('tin_ore',      {name:'Tin Ore',      type:'resource',subtype:'ore', sellPrice:3,   sprite:'ore-tin',    desc:'A chunk of tin ore.'});
    add('iron_ore',     {name:'Iron Ore',     type:'resource',subtype:'ore', sellPrice:10,  sprite:'ore-iron',   desc:'A lump of iron ore.'});
    add('coal_ore',     {name:'Coal',         type:'resource',subtype:'ore', sellPrice:15,  sprite:'ore-coal',   desc:'Black coal fuel.'});
    add('mithril_ore',  {name:'Mithril Ore',  type:'resource',subtype:'ore', sellPrice:50,  sprite:'ore-mithril',desc:'A gleaming mithril ore.'});
    add('adamant_ore',  {name:'Adamant Ore',  type:'resource',subtype:'ore', sellPrice:120, sprite:'ore-adamant',desc:'A dark green dense ore.'});
    add('obsidian_ore', {name:'Obsidian Ore', type:'resource',subtype:'ore', sellPrice:300, sprite:'ore-obsidian',desc:'Volcanic glass ore.'});
    add('bronze_bar',   {name:'Bronze Bar',   type:'resource',subtype:'bar', sellPrice:8,   sprite:'bar-bronze', desc:'Copper + tin alloy.'});
    add('iron_bar',     {name:'Iron Bar',     type:'resource',subtype:'bar', sellPrice:25,  sprite:'bar-iron',   desc:'A refined iron ingot.'});
    add('steel_bar',    {name:'Steel Bar',    type:'resource',subtype:'bar', sellPrice:50,  sprite:'bar-steel',  desc:'Hardened steel bar.'});
    add('mithril_bar',  {name:'Mithril Bar',  type:'resource',subtype:'bar', sellPrice:150, sprite:'bar-mithril',desc:'A mithril bar.'});
    add('adamant_bar',  {name:'Adamant Bar',  type:'resource',subtype:'bar', sellPrice:350, sprite:'bar-adamant',desc:'An adamant bar.'});
    add('obsidian_bar', {name:'Obsidian Bar', type:'resource',subtype:'bar', sellPrice:800, sprite:'bar-obsidian',desc:'An obsidian bar.'});
    add('topaz',        {name:'Topaz',        type:'resource',subtype:'gem', sellPrice:50,   sprite:'gem-yellow',desc:'A warm amber gemstone.'});
    add('sapphire',     {name:'Sapphire',     type:'resource',subtype:'gem', sellPrice:100,  sprite:'gem-blue',  desc:'A brilliant blue gem.'});
    add('ruby',         {name:'Ruby',         type:'resource',subtype:'gem', sellPrice:200,  sprite:'gem-red',   desc:'A fiery red ruby.'});
    add('emerald',      {name:'Emerald',      type:'resource',subtype:'gem', sellPrice:300,  sprite:'gem-green', desc:'A vibrant green emerald.'});
    add('diamond',      {name:'Diamond',      type:'resource',subtype:'gem', sellPrice:500,  sprite:'gem-white', desc:'A flawless diamond.'});
    add('onyx',         {name:'Onyx',         type:'resource',subtype:'gem', sellPrice:1500, sprite:'gem-black', desc:'A jet-black onyx.'});
    add('raw_shrimp',    {name:'Raw Shrimp',    type:'resource',subtype:'fish',sellPrice:1,   sprite:'fish-small',desc:'A tiny shrimp.'});
    add('raw_trout',     {name:'Raw Trout',     type:'resource',subtype:'fish',sellPrice:5,   sprite:'fish-small',desc:'A fresh trout.'});
    add('raw_salmon',    {name:'Raw Salmon',    type:'resource',subtype:'fish',sellPrice:12,  sprite:'fish-med',  desc:'A glistening salmon.'});
    add('raw_lobster',   {name:'Raw Lobster',   type:'resource',subtype:'fish',sellPrice:30,  sprite:'fish-crab', desc:'A large lobster.'});
    add('raw_swordfish', {name:'Raw Swordfish', type:'resource',subtype:'fish',sellPrice:65,  sprite:'fish-big',  desc:'A mighty swordfish.'});
    add('raw_anglerfish',{name:'Raw Anglerfish',type:'resource',subtype:'fish',sellPrice:150, sprite:'fish-deep', desc:'A deep-sea anglerfish.'});
    add('raw_leviathan', {name:'Raw Leviathan', type:'resource',subtype:'fish',sellPrice:400, sprite:'fish-boss', desc:'A primordial fish.'});
    add('shrimp',         {name:'Shrimp',         type:'food',heals:20,  sellPrice:3,   sprite:'food-meal',desc:'Cooked shrimp. +20 HP.'});
    add('trout',          {name:'Trout',          type:'food',heals:50,  sellPrice:12,  sprite:'food-meal',desc:'Cooked trout. +50 HP.'});
    add('salmon',         {name:'Salmon',         type:'food',heals:90,  sellPrice:25,  sprite:'food-meal',desc:'Cooked salmon. +90 HP.'});
    add('lobster',        {name:'Lobster',        type:'food',heals:160, sellPrice:60,  sprite:'food-meal',desc:'Cooked lobster. +160 HP.'});
    add('swordfish',      {name:'Swordfish',      type:'food',heals:250, sellPrice:120, sprite:'food-meal',desc:'Cooked swordfish. +250 HP.'});
    add('anglerfish',     {name:'Anglerfish',     type:'food',heals:400, sellPrice:300, sprite:'food-meal',desc:'Cooked anglerfish. +400 HP.'});
    add('leviathan_steak',{name:'Leviathan Steak',type:'food',heals:650, sellPrice:800, sprite:'food-meal',desc:'Seared leviathan. +650 HP.'});
    add('silverleaf', {name:'Silverleaf', type:'resource',subtype:'herb',sellPrice:5,  sprite:'herb-silver',desc:'A common silver herb.'});
    add('bloodroot',  {name:'Bloodroot',  type:'resource',subtype:'herb',sellPrice:15, sprite:'herb-red',   desc:'A red healing root.'});
    add('moonpetal',  {name:'Moonpetal',  type:'resource',subtype:'herb',sellPrice:40, sprite:'herb-pale',  desc:'A pale night flower.'});
    add('voidbloom',  {name:'Voidbloom',  type:'resource',subtype:'herb',sellPrice:100,sprite:'herb-purple',desc:'A dark purple bloom.'});
    add('ashblossom', {name:'Ashblossom', type:'resource',subtype:'herb',sellPrice:250,sprite:'herb-black', desc:'A volcanic flower.'});
    add('potion_healing_i',   {name:'Healing Potion I',   type:'potion',heals:100, sellPrice:20,  sprite:'potion-red',   desc:'+100 HP.'});
    add('potion_healing_ii',  {name:'Healing Potion II',  type:'potion',heals:300, sellPrice:80,  sprite:'potion-red',   desc:'+300 HP.'});
    add('potion_healing_iii', {name:'Healing Potion III', type:'potion',heals:600, sellPrice:200, sprite:'potion-red',   desc:'+600 HP.'});
    add('potion_strength',    {name:'Strength Potion',    type:'potion',buff:{stat:'strengthBonus',value:10,duration:120},sellPrice:50, sprite:'potion-orange',desc:'+10 Str 120s.'});
    add('potion_defence',     {name:'Defence Potion',     type:'potion',buff:{stat:'defenceBonus',value:10,duration:120}, sellPrice:50, sprite:'potion-blue',  desc:'+10 Def 120s.'});
    add('potion_accuracy',    {name:'Accuracy Potion',    type:'potion',buff:{stat:'accuracyBonus',value:15,duration:120},sellPrice:60, sprite:'potion-green', desc:'+15% Acc 120s.'});
    add('potion_speed',       {name:'Haste Potion',       type:'potion',buff:{stat:'speedBonus',value:20,duration:60},    sellPrice:150,sprite:'potion-yellow',desc:'+20% ASpd 60s.'});
    add('feather',     {name:'Feather',      type:'resource',subtype:'misc',sellPrice:1,  sprite:'misc-feather',desc:'A light feather.'});
    add('leather',     {name:'Leather',      type:'resource',subtype:'misc',sellPrice:8,  sprite:'misc-leather',desc:'Tanned hide.'});
    add('hard_leather',{name:'Hardened Leather',type:'resource',subtype:'misc',sellPrice:30, sprite:'misc-leather',desc:'Tough leather.'});
    add('dragon_hide', {name:'Dragon Hide',  type:'resource',subtype:'misc',sellPrice:250,sprite:'misc-leather',desc:'Dragon-hide.'});
    add('bones',       {name:'Bones',        type:'resource',subtype:'misc',sellPrice:5,  sprite:'misc-bone',   desc:'Monster bones.'});
    add('big_bones',   {name:'Big Bones',    type:'resource',subtype:'misc',sellPrice:20, sprite:'misc-bone',   desc:'Large monster bones.'});
    add('dragon_bones',{name:'Dragon Bones', type:'resource',subtype:'misc',sellPrice:100,sprite:'misc-bone',   desc:'Dragon bones.'});
    add('wolf_pelt',   {name:'Wolf Pelt',    type:'resource',subtype:'misc',sellPrice:25, sprite:'misc-pelt',   desc:'A thick wolf pelt.'});
    add('bear_pelt',   {name:'Bear Pelt',    type:'resource',subtype:'misc',sellPrice:60, sprite:'misc-pelt',   desc:'A heavy bear pelt.'});
    add('wyvern_scale',{name:'Wyvern Scale', type:'resource',subtype:'misc',sellPrice:120,sprite:'misc-scale',  desc:'A wyvern scale.'});
    add('rune_essence',{name:'Rune Essence', type:'resource',subtype:'misc',sellPrice:2,  sprite:'misc-essence',desc:'Blank magical essence.'});
    add('enchant_scroll',{name:'Enchant Scroll',type:'resource',subtype:'misc',sellPrice:200,sprite:'misc-scroll',desc:'An enchanting scroll.'});
    add('fire_rune', {name:'Fire Rune', type:'resource',subtype:'rune',sellPrice:5, sprite:'rune-red',  desc:'Fire magic rune.'});
    add('water_rune',{name:'Water Rune',type:'resource',subtype:'rune',sellPrice:5, sprite:'rune-blue', desc:'Water magic rune.'});
    add('earth_rune',{name:'Earth Rune',type:'resource',subtype:'rune',sellPrice:5, sprite:'rune-brown',desc:'Earth magic rune.'});
    add('air_rune',  {name:'Air Rune',  type:'resource',subtype:'rune',sellPrice:5, sprite:'rune-white',desc:'Air magic rune.'});
    add('chaos_rune',{name:'Chaos Rune',type:'resource',subtype:'rune',sellPrice:25,sprite:'rune-purple',desc:'Chaos magic rune.'});
    add('death_rune',{name:'Death Rune',type:'resource',subtype:'rune',sellPrice:60,sprite:'rune-black',desc:'Death magic rune.'});
    add('potato_seed',{name:'Potato Seed', type:'seed',growTime:300, yield:'potato',    sellPrice:1, sprite:'misc-seed',desc:'5 min grow time.'});
    add('onion_seed', {name:'Onion Seed',  type:'seed',growTime:600, yield:'onion',     sellPrice:3, sprite:'misc-seed',desc:'10 min grow time.'});
    add('herb_seed',  {name:'Herb Seed',   type:'seed',growTime:900, yield:'silverleaf',sellPrice:8, sprite:'misc-seed',desc:'15 min grow time.'});
    add('blood_seed', {name:'Bloodroot Seed',type:'seed',growTime:1800,yield:'bloodroot',sellPrice:20,sprite:'misc-seed',desc:'30 min grow time.'});
    add('moon_seed',  {name:'Moonpetal Seed',type:'seed',growTime:3600,yield:'moonpetal',sellPrice:50,sprite:'misc-seed',desc:'60 min grow time.'});
    add('potato', {name:'Potato',type:'food',heals:10,sellPrice:3,sprite:'food-veg',desc:'Raw potato. +10 HP.'});
    add('onion',  {name:'Onion', type:'food',heals:15,sellPrice:5,sprite:'food-veg',desc:'Raw onion. +15 HP.'});
    add('bronze_arrows', {name:'Bronze Arrows', type:'ammo',subtype:'arrow',ammoType:'arrow',rangedBonus:2,  sellPrice:1, sprite:'arrow-bronze',desc:'Bronze-tipped arrows.'});
    add('iron_arrows',   {name:'Iron Arrows',   type:'ammo',subtype:'arrow',ammoType:'arrow',rangedBonus:5,  sellPrice:3, sprite:'arrow-iron',  desc:'Iron arrows.'});
    add('steel_arrows',  {name:'Steel Arrows',  type:'ammo',subtype:'arrow',ammoType:'arrow',rangedBonus:10, sellPrice:8, sprite:'arrow-steel', desc:'Steel arrows.'});
    add('mithril_arrows',{name:'Mithril Arrows',type:'ammo',subtype:'arrow',ammoType:'arrow',rangedBonus:18, sellPrice:20,sprite:'arrow-mithril',desc:'Mithril arrows.'});
    add('adamant_arrows',{name:'Adamant Arrows',type:'ammo',subtype:'arrow',ammoType:'arrow',rangedBonus:28, sellPrice:45,sprite:'arrow-adamant',desc:'Adamant arrows.'});

    // SWORDS (tier progression)
    add('bronze_sword',    {name:'Bronze Sword',    type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.4,stats:{attackBonus:5,strengthBonus:4},   levelReq:{attack:1}, sellPrice:15,   sprite:'sword-bronze', desc:'A basic bronze blade.'});
    add('iron_sword',      {name:'Iron Sword',      type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.4,stats:{attackBonus:12,strengthBonus:10}, levelReq:{attack:10},sellPrice:50,   sprite:'sword-iron',   desc:'Reliable iron sword.'});
    add('steel_sword',     {name:'Steel Sword',     type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.4,stats:{attackBonus:22,strengthBonus:18}, levelReq:{attack:20},sellPrice:150,  sprite:'sword-steel',  desc:'Well-forged steel blade.'});
    add('mithril_sword',   {name:'Mithril Sword',   type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.2,stats:{attackBonus:35,strengthBonus:28}, levelReq:{attack:30},sellPrice:400,  sprite:'sword-mithril',desc:'A gleaming mithril longsword.'});
    add('adamant_sword',   {name:'Adamant Sword',   type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.2,stats:{attackBonus:50,strengthBonus:42}, levelReq:{attack:40},sellPrice:1000, sprite:'sword-adamant',desc:'A dark green adamantite blade.'});
    add('obsidian_sword',  {name:'Obsidian Blade',  type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.0,stats:{attackBonus:72,strengthBonus:60}, levelReq:{attack:50},sellPrice:3000, sprite:'sword-obsidian',desc:'A razor-sharp obsidian blade.'});
    add('ashfire_blade',   {name:'Ashfire Blade',   type:'weapon',slot:'weapon',style:'melee',attackSpeed:1.8,stats:{attackBonus:95,strengthBonus:80}, levelReq:{attack:60},sellPrice:10000,sprite:'sword-ashfire',desc:'Legendary blade forged in ashfire.',unique:true});
    add('dragon_scimitar', {name:'Dragon Scimitar', type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.0,stats:{attackBonus:85,strengthBonus:70}, levelReq:{attack:55},sellPrice:8000, sprite:'sword-dragon', desc:'Curved blade of dragon scale.',unique:true});
    add('silver_champion_sword',{name:'Silver Champion Sword',type:'weapon',slot:'weapon',style:'melee',attackSpeed:1.8,stats:{attackBonus:100,strengthBonus:75,defenceBonus:20},levelReq:{attack:55,defence:40},sellPrice:12000,sprite:'sword-silver',desc:'Blessed by the Silver Order.',unique:true,faction:'silver_order'});
    add('bloodfang_cleaver',{name:'Bloodfang Cleaver',type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.2,stats:{attackBonus:85,strengthBonus:110},levelReq:{attack:55,strength:55},sellPrice:10000,sprite:'axe-blood',desc:'Savage Bloodfang cleaver.',unique:true,faction:'bloodfang_clan'});

    // AXES
    add('iron_battleaxe',    {name:'Iron Battleaxe',    type:'weapon',slot:'weapon',style:'melee',attackSpeed:3.0,stats:{attackBonus:10,strengthBonus:18},levelReq:{attack:12,strength:12},sellPrice:80,  sprite:'axe-iron',   desc:'Heavy iron axe.'});
    add('steel_battleaxe',   {name:'Steel Battleaxe',   type:'weapon',slot:'weapon',style:'melee',attackSpeed:3.0,stats:{attackBonus:18,strengthBonus:32},levelReq:{attack:22,strength:22},sellPrice:240, sprite:'axe-steel',  desc:'Heavy steel axe.'});
    add('mithril_battleaxe', {name:'Mithril Battleaxe', type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.8,stats:{attackBonus:30,strengthBonus:48},levelReq:{attack:32,strength:32},sellPrice:650, sprite:'axe-mithril',desc:'Lightweight mithril axe.'});
    add('adamant_battleaxe', {name:'Adamant Battleaxe', type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.8,stats:{attackBonus:42,strengthBonus:68},levelReq:{attack:42,strength:42},sellPrice:1600,sprite:'axe-adamant',desc:'A massive adamant axe.'});

    // MACES
    add('iron_mace',    {name:'Iron Mace',    type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.6,stats:{attackBonus:9,strengthBonus:14}, levelReq:{attack:10,strength:5},sellPrice:60,  sprite:'mace-iron',   desc:'A spiked iron mace.'});
    add('steel_mace',   {name:'Steel Mace',   type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.6,stats:{attackBonus:18,strengthBonus:25},levelReq:{attack:20,strength:15},sellPrice:170, sprite:'mace-steel',  desc:'A crushing steel mace.'});
    add('mithril_mace', {name:'Mithril Mace', type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.4,stats:{attackBonus:30,strengthBonus:38},levelReq:{attack:30,strength:25},sellPrice:450, sprite:'mace-mithril',desc:'A heavy mithril mace.'});
    add('adamant_mace', {name:'Adamant Mace', type:'weapon',slot:'weapon',style:'melee',attackSpeed:2.4,stats:{attackBonus:44,strengthBonus:55},levelReq:{attack:40,strength:35},sellPrice:1100,sprite:'mace-adamant',desc:'A brutal adamant mace.'});

    // DAGGERS
    add('iron_dagger',   {name:'Iron Dagger',   type:'weapon',slot:'weapon',style:'melee',attackSpeed:1.8,stats:{attackBonus:8,strengthBonus:5},  levelReq:{attack:5}, sellPrice:35, sprite:'dagger-iron',   desc:'A quick iron dagger.'});
    add('steel_dagger',  {name:'Steel Dagger',  type:'weapon',slot:'weapon',style:'melee',attackSpeed:1.8,stats:{attackBonus:16,strengthBonus:11},levelReq:{attack:15},sellPrice:110,sprite:'dagger-steel',  desc:'A precise steel dagger.'});
    add('mithril_dagger',{name:'Mithril Dagger',type:'weapon',slot:'weapon',style:'melee',attackSpeed:1.6,stats:{attackBonus:28,strengthBonus:19},levelReq:{attack:25},sellPrice:320,sprite:'dagger-mithril',desc:'A razor mithril dagger.'});
    add('adamant_dagger',{name:'Adamant Dagger',type:'weapon',slot:'weapon',style:'melee',attackSpeed:1.6,stats:{attackBonus:42,strengthBonus:30},levelReq:{attack:35},sellPrice:800,sprite:'dagger-adamant',desc:'A deadly adamant dagger.'});

    // BOWS
    add('oak_shortbow',   {name:'Oak Shortbow',   type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.4,stats:{rangedBonus:8}, levelReq:{ranged:1}, sellPrice:20,   sprite:'bow-oak',    ammoType:'arrow',desc:'A simple oak bow.'});
    add('willow_shortbow',{name:'Willow Shortbow',type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.2,stats:{rangedBonus:16},levelReq:{ranged:15},sellPrice:60,   sprite:'bow-willow', ammoType:'arrow',desc:'A supple willow bow.'});
    add('maple_shortbow', {name:'Maple Shortbow', type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.2,stats:{rangedBonus:28},levelReq:{ranged:30},sellPrice:200,  sprite:'bow-maple',  ammoType:'arrow',desc:'A sturdy maple bow.'});
    add('yew_longbow',    {name:'Yew Longbow',    type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.6,stats:{rangedBonus:45},levelReq:{ranged:40},sellPrice:600,  sprite:'bow-yew',    ammoType:'arrow',desc:'A powerful yew longbow.'});
    add('elder_bow',      {name:'Elder Bow',      type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.0,stats:{rangedBonus:65},levelReq:{ranged:55},sellPrice:3000, sprite:'bow-elder',  ammoType:'arrow',desc:'An elder wood bow.'});
    add('ashwood_bow',    {name:'Ashwood Bow',    type:'weapon',slot:'weapon',style:'ranged',attackSpeed:1.8,stats:{rangedBonus:90},levelReq:{ranged:70},sellPrice:12000,sprite:'bow-ashwood',ammoType:'arrow',desc:'A charred ashwood bow.',unique:true});

    // MAGIC WEAPONS
    add('apprentice_wand',{name:'Apprentice Wand',type:'weapon',slot:'weapon',style:'magic',attackSpeed:2.4,stats:{magicBonus:5}, levelReq:{magic:1}, sellPrice:25,   sprite:'wand-wood',   desc:'A novice mage wand.'});
    add('adept_wand',     {name:'Adept Wand',     type:'weapon',slot:'weapon',style:'magic',attackSpeed:2.4,stats:{magicBonus:12},levelReq:{magic:15},sellPrice:100,  sprite:'wand-crystal',desc:'A glowing crystal wand.'});
    add('mystic_staff',   {name:'Mystic Staff',   type:'weapon',slot:'weapon',style:'magic',attackSpeed:2.6,stats:{magicBonus:20},levelReq:{magic:20},sellPrice:200,  sprite:'staff-mystic',desc:'A mystic staff.'});
    add('void_staff',     {name:'Void Staff',     type:'weapon',slot:'weapon',style:'magic',attackSpeed:2.2,stats:{magicBonus:45},levelReq:{magic:40},sellPrice:1200, sprite:'staff-void',  desc:'A void-powered staff.'});
    add('elder_staff',    {name:'Elder Staff',    type:'weapon',slot:'weapon',style:'magic',attackSpeed:2.0,stats:{magicBonus:70},levelReq:{magic:55},sellPrice:5000, sprite:'staff-elder', desc:'An elder staff.'});
    add('voidseer_staff', {name:'Voidseer Staff', type:'weapon',slot:'weapon',style:'magic',attackSpeed:1.8,stats:{magicBonus:95},levelReq:{magic:65},sellPrice:15000,sprite:'staff-voidseer',desc:'Staff of the Voidseer.',unique:true,faction:'veiled_circle'});

    // SHIELDS
    add('bronze_shield', {name:'Bronze Shield', type:'armor',slot:'shield',stats:{defenceBonus:3,damageReduction:1},  levelReq:{defence:1}, sellPrice:10,  sprite:'shield-bronze', desc:'A basic bronze shield.'});
    add('iron_shield',   {name:'Iron Shield',   type:'armor',slot:'shield',stats:{defenceBonus:8,damageReduction:2},  levelReq:{defence:10},sellPrice:40,  sprite:'shield-iron',   desc:'A sturdy iron shield.'});
    add('steel_shield',  {name:'Steel Shield',  type:'armor',slot:'shield',stats:{defenceBonus:15,damageReduction:4}, levelReq:{defence:20},sellPrice:120, sprite:'shield-steel',  desc:'A reinforced steel shield.'});
    add('mithril_shield',{name:'Mithril Shield',type:'armor',slot:'shield',stats:{defenceBonus:25,damageReduction:6}, levelReq:{defence:30},sellPrice:350, sprite:'shield-mithril',desc:'A lightweight mithril shield.'});
    add('adamant_shield',{name:'Adamant Shield',type:'armor',slot:'shield',stats:{defenceBonus:38,damageReduction:8}, levelReq:{defence:40},sellPrice:900, sprite:'shield-adamant',desc:'An adamant shield.'});
    add('obsidian_shield',{name:'Obsidian Shield',type:'armor',slot:'shield',stats:{defenceBonus:55,damageReduction:12},levelReq:{defence:50},sellPrice:2500,sprite:'shield-obsidian',desc:'An obsidian shield.'});

    // HELMS (plate)
    const plateHelms = [['bronze_helm','Bronze Helm',1,8,{defenceBonus:2,damageReduction:0}],['iron_helm','Iron Helm',10,30,{defenceBonus:5,damageReduction:1}],['steel_helm','Steel Helm',20,90,{defenceBonus:10,damageReduction:2}],['mithril_helm','Mithril Helm',30,250,{defenceBonus:16,damageReduction:3}],['adamant_helm','Adamant Helm',40,600,{defenceBonus:24,damageReduction:5}],['obsidian_helm','Obsidian Helm',50,1800,{defenceBonus:36,damageReduction:7}]];
    plateHelms.forEach(([id,name,lv,sp,stats]) => add(id,{name,type:'armor',slot:'head',stats,levelReq:{defence:lv},sellPrice:sp,sprite:'helm-'+id.split('_')[0],desc:name}));

    // BODIES (plate)
    const plateBodies = [['bronze_plate','Bronze Platebody',1,20,{defenceBonus:5,damageReduction:1}],['iron_plate','Iron Platebody',10,80,{defenceBonus:12,damageReduction:2}],['steel_plate','Steel Platebody',20,250,{defenceBonus:22,damageReduction:4}],['mithril_plate','Mithril Platebody',30,700,{defenceBonus:35,damageReduction:6}],['adamant_plate','Adamant Platebody',40,2000,{defenceBonus:50,damageReduction:9}],['obsidian_plate','Obsidian Platebody',50,6000,{defenceBonus:70,damageReduction:12}]];
    plateBodies.forEach(([id,name,lv,sp,stats]) => add(id,{name,type:'armor',slot:'body',stats,levelReq:{defence:lv},sellPrice:sp,sprite:'body-'+id.split('_')[0],desc:name}));

    // LEGS (plate)
    const plateLegs = [['bronze_legs','Bronze Platelegs',1,12,{defenceBonus:3,damageReduction:0}],['iron_legs','Iron Platelegs',10,50,{defenceBonus:8,damageReduction:1}],['steel_legs','Steel Platelegs',20,160,{defenceBonus:15,damageReduction:3}],['mithril_legs','Mithril Platelegs',30,450,{defenceBonus:24,damageReduction:4}],['adamant_legs','Adamant Platelegs',40,1200,{defenceBonus:36,damageReduction:7}],['obsidian_legs','Obsidian Platelegs',50,3800,{defenceBonus:52,damageReduction:10}]];
    plateLegs.forEach(([id,name,lv,sp,stats]) => add(id,{name,type:'armor',slot:'legs',stats,levelReq:{defence:lv},sellPrice:sp,sprite:'legs-'+id.split('_')[0],desc:name}));

    // LEATHER (RANGER) SETS
    add('leather_cowl',     {name:'Leather Cowl',      type:'armor',slot:'head',stats:{defenceBonus:2,rangedBonus:3}, levelReq:{defence:1,ranged:1},  sellPrice:20,  sprite:'cowl-leather', desc:'A hooded leather cowl.'});
    add('studded_cowl',     {name:'Studded Cowl',      type:'armor',slot:'head',stats:{defenceBonus:5,rangedBonus:8}, levelReq:{defence:10,ranged:15},sellPrice:80,  sprite:'cowl-studded', desc:'A studded cowl.'});
    add('hard_leather_cowl',{name:'Hard Leather Cowl', type:'armor',slot:'head',stats:{defenceBonus:10,rangedBonus:14},levelReq:{defence:20,ranged:30},sellPrice:220, sprite:'cowl-hard',    desc:'Hardened leather cowl.'});
    add('dragon_cowl',      {name:'Dragonhide Cowl',   type:'armor',slot:'head',stats:{defenceBonus:18,rangedBonus:22},levelReq:{defence:30,ranged:45},sellPrice:750, sprite:'cowl-dragon',  desc:'Cowl of dragon hide.'});
    add('leather_body',     {name:'Leather Body',      type:'armor',slot:'body',stats:{defenceBonus:4,rangedBonus:6}, levelReq:{defence:1,ranged:1},  sellPrice:35,  sprite:'body-leather', desc:'Leather chestplate.'});
    add('studded_body',     {name:'Studded Body',      type:'armor',slot:'body',stats:{defenceBonus:10,rangedBonus:15},levelReq:{defence:10,ranged:15},sellPrice:140, sprite:'body-studded', desc:'Studded leather body.'});
    add('hard_leather_body',{name:'Hard Leather Body', type:'armor',slot:'body',stats:{defenceBonus:18,rangedBonus:28},levelReq:{defence:20,ranged:30},sellPrice:400, sprite:'body-hard',    desc:'Hardened leather body.'});
    add('dragon_body',      {name:'Dragonhide Body',   type:'armor',slot:'body',stats:{defenceBonus:30,rangedBonus:45},levelReq:{defence:30,ranged:45},sellPrice:1500,sprite:'body-dragon',  desc:'Dragon hide body.'});
    add('leather_chaps',    {name:'Leather Chaps',     type:'armor',slot:'legs',stats:{defenceBonus:3,rangedBonus:4}, levelReq:{defence:1,ranged:1},  sellPrice:25,  sprite:'chaps-leather',desc:'Leather chaps.'});
    add('studded_chaps',    {name:'Studded Chaps',     type:'armor',slot:'legs',stats:{defenceBonus:7,rangedBonus:10},levelReq:{defence:10,ranged:15},sellPrice:95,  sprite:'chaps-studded',desc:'Studded chaps.'});
    add('hard_leather_chaps',{name:'Hard Leather Chaps',type:'armor',slot:'legs',stats:{defenceBonus:13,rangedBonus:20},levelReq:{defence:20,ranged:30},sellPrice:280,sprite:'chaps-hard',   desc:'Hard leather chaps.'});
    add('dragon_chaps',     {name:'Dragonhide Chaps',  type:'armor',slot:'legs',stats:{defenceBonus:22,rangedBonus:32},levelReq:{defence:30,ranged:45},sellPrice:950, sprite:'chaps-dragon', desc:'Dragon chaps.'});

    // ROBE (MAGE) SETS
    add('apprentice_hat',   {name:'Apprentice Hat',   type:'armor',slot:'head',stats:{defenceBonus:1,magicBonus:4},  levelReq:{magic:1},  sellPrice:30,  sprite:'hat-app',     desc:'Simple apprentice hat.'});
    add('mystic_hat',       {name:'Mystic Hat',       type:'armor',slot:'head',stats:{defenceBonus:3,magicBonus:10}, levelReq:{magic:20}, sellPrice:150, sprite:'hat-mystic',  desc:'Mystic mage hat.'});
    add('adept_hat',        {name:'Adept Hat',        type:'armor',slot:'head',stats:{defenceBonus:6,magicBonus:18}, levelReq:{magic:35}, sellPrice:450, sprite:'hat-adept',   desc:'Veiled Circle adept hat.',faction:'veiled_circle'});
    add('archmage_hat',     {name:'Archmage Hat',     type:'armor',slot:'head',stats:{defenceBonus:10,magicBonus:30},levelReq:{magic:55}, sellPrice:1800,sprite:'hat-archmage',desc:'Archmage hat.',faction:'veiled_circle'});
    add('apprentice_robe',  {name:'Apprentice Robe',  type:'armor',slot:'body',stats:{defenceBonus:2,magicBonus:8},  levelReq:{magic:1},  sellPrice:60,  sprite:'robe-app',     desc:'Simple apprentice robe.'});
    add('mystic_robe',      {name:'Mystic Robe',      type:'armor',slot:'body',stats:{defenceBonus:6,magicBonus:20}, levelReq:{magic:20}, sellPrice:300, sprite:'robe-mystic',  desc:'Mystic robe.'});
    add('adept_robe',       {name:'Adept Robe',       type:'armor',slot:'body',stats:{defenceBonus:12,magicBonus:35},levelReq:{magic:35}, sellPrice:900, sprite:'robe-adept',   desc:'Adept robe.',faction:'veiled_circle'});
    add('archmage_robe',    {name:'Archmage Robe',    type:'armor',slot:'body',stats:{defenceBonus:20,magicBonus:55},levelReq:{magic:55}, sellPrice:3500,sprite:'robe-archmage',desc:'Archmage robe.',faction:'veiled_circle'});
    add('apprentice_skirt', {name:'Apprentice Skirt', type:'armor',slot:'legs',stats:{defenceBonus:1,magicBonus:5},  levelReq:{magic:1},  sellPrice:40,  sprite:'skirt-app',     desc:'Apprentice skirt.'});
    add('mystic_skirt',     {name:'Mystic Skirt',     type:'armor',slot:'legs',stats:{defenceBonus:4,magicBonus:14}, levelReq:{magic:20}, sellPrice:200, sprite:'skirt-mystic',  desc:'Mystic skirt.'});
    add('adept_skirt',      {name:'Adept Skirt',      type:'armor',slot:'legs',stats:{defenceBonus:8,magicBonus:24}, levelReq:{magic:35}, sellPrice:600, sprite:'skirt-adept',   desc:'Adept skirt.',faction:'veiled_circle'});
    add('archmage_skirt',   {name:'Archmage Skirt',   type:'armor',slot:'legs',stats:{defenceBonus:14,magicBonus:40},levelReq:{magic:55}, sellPrice:2400,sprite:'skirt-archmage',desc:'Archmage skirt.',faction:'veiled_circle'});

    // BOOTS / GLOVES / CAPES
    add('leather_boots', {name:'Leather Boots', type:'armor',slot:'boots',stats:{defenceBonus:1},                    levelReq:{defence:1}, sellPrice:5,  sprite:'boots-leather',desc:'Leather boots.'});
    add('iron_boots',    {name:'Iron Boots',    type:'armor',slot:'boots',stats:{defenceBonus:4},                    levelReq:{defence:10},sellPrice:25, sprite:'boots-iron',   desc:'Iron boots.'});
    add('steel_boots',   {name:'Steel Boots',   type:'armor',slot:'boots',stats:{defenceBonus:8},                    levelReq:{defence:20},sellPrice:75, sprite:'boots-steel',  desc:'Steel boots.'});
    add('mithril_boots', {name:'Mithril Boots', type:'armor',slot:'boots',stats:{defenceBonus:14},                   levelReq:{defence:30},sellPrice:220,sprite:'boots-mithril',desc:'Mithril boots.'});
    add('adamant_boots', {name:'Adamant Boots', type:'armor',slot:'boots',stats:{defenceBonus:22},                   levelReq:{defence:40},sellPrice:600,sprite:'boots-adamant',desc:'Adamant boots.'});
    add('ranger_boots',  {name:'Ranger Boots',  type:'armor',slot:'boots',stats:{defenceBonus:5,rangedBonus:4},     levelReq:{ranged:15}, sellPrice:150,sprite:'boots-ranger', desc:'Soft-soled hunting boots.'});
    add('mystic_boots',  {name:'Mystic Boots',  type:'armor',slot:'boots',stats:{defenceBonus:4,magicBonus:6},      levelReq:{magic:20},  sellPrice:180,sprite:'boots-mystic', desc:'Rune-stitched boots.'});
    add('leather_gloves',  {name:'Leather Gloves',  type:'armor',slot:'gloves',stats:{attackBonus:1},                 levelReq:{defence:1}, sellPrice:5,  sprite:'gloves-leather',desc:'Leather gloves.'});
    add('iron_gauntlets',  {name:'Iron Gauntlets',  type:'armor',slot:'gloves',stats:{attackBonus:3,strengthBonus:2}, levelReq:{defence:10},sellPrice:30, sprite:'gloves-iron',   desc:'Iron gauntlets.'});
    add('steel_gauntlets', {name:'Steel Gauntlets', type:'armor',slot:'gloves',stats:{attackBonus:5,strengthBonus:4}, levelReq:{defence:20},sellPrice:90, sprite:'gloves-steel',  desc:'Steel gauntlets.'});
    add('mithril_gauntlets',{name:'Mithril Gauntlets',type:'armor',slot:'gloves',stats:{attackBonus:8,strengthBonus:7},levelReq:{defence:30},sellPrice:280,sprite:'gloves-mithril',desc:'Mithril gauntlets.'});
    add('ranger_gloves',   {name:'Ranger Gloves',   type:'armor',slot:'gloves',stats:{rangedBonus:6,defenceBonus:2}, levelReq:{ranged:15}, sellPrice:170,sprite:'gloves-ranger', desc:'Fingerless ranger gloves.'});
    add('mystic_gloves',   {name:'Mystic Gloves',   type:'armor',slot:'gloves',stats:{magicBonus:8,defenceBonus:2},  levelReq:{magic:20},  sellPrice:220,sprite:'gloves-mystic', desc:'Silken mage gloves.'});
    add('leather_cape',{name:'Leather Cape',type:'armor',slot:'cape',stats:{defenceBonus:2},                          sellPrice:20,  sprite:'cape-brown', desc:'A travel-worn cape.'});
    add('ranger_cape', {name:'Ranger Cape', type:'armor',slot:'cape',stats:{defenceBonus:4,rangedBonus:6},           sellPrice:400, sprite:'cape-green', desc:'A ranger\'s cape.',levelReq:{ranged:30}});
    add('mage_cape',   {name:'Mage Cape',   type:'armor',slot:'cape',stats:{defenceBonus:3,magicBonus:8},            sellPrice:450, sprite:'cape-purple',desc:'A flowing mage cape.',levelReq:{magic:30}});
    add('warrior_cape',{name:'Warrior Cape',type:'armor',slot:'cape',stats:{defenceBonus:6,strengthBonus:5},         sellPrice:500, sprite:'cape-red',   desc:'A warrior\'s cape.',levelReq:{attack:30}});
    add('void_cape',   {name:'Void Cape',   type:'armor',slot:'cape',stats:{defenceBonus:10,damageReduction:3,magicBonus:15},sellPrice:8000,sprite:'cape-void',desc:'Woven from void energy.',levelReq:{magic:50},unique:true});

    // JEWELRY
    add('topaz_ring',     {name:'Topaz Ring',     type:'armor',slot:'ring',  stats:{attackBonus:2,strengthBonus:1},                    sellPrice:100, sprite:'ring-topaz',    desc:'A topaz ring.'});
    add('sapphire_ring',  {name:'Sapphire Ring',  type:'armor',slot:'ring',  stats:{defenceBonus:3,damageReduction:1},                 sellPrice:200, sprite:'ring-sapphire', desc:'A sapphire ring.'});
    add('ruby_ring',      {name:'Ruby Ring',      type:'armor',slot:'ring',  stats:{strengthBonus:5},                                  sellPrice:400, sprite:'ring-ruby',     desc:'A ruby ring.'});
    add('emerald_ring',   {name:'Emerald Ring',   type:'armor',slot:'ring',  stats:{rangedBonus:5},                                    sellPrice:600, sprite:'ring-emerald',  desc:'An emerald ring.'});
    add('diamond_ring',   {name:'Diamond Ring',   type:'armor',slot:'ring',  stats:{attackBonus:5,strengthBonus:5,defenceBonus:5},     sellPrice:1000,sprite:'ring-diamond',  desc:'A diamond ring.'});
    add('onyx_ring',      {name:'Onyx Ring',      type:'armor',slot:'ring',  stats:{magicBonus:10,attackBonus:3},                      sellPrice:3000,sprite:'ring-onyx',     desc:'A dark onyx ring.'});
    add('topaz_amulet',   {name:'Topaz Amulet',   type:'armor',slot:'amulet',stats:{attackBonus:3},                                    sellPrice:120, sprite:'amulet-topaz',   desc:'A topaz amulet.'});
    add('sapphire_amulet',{name:'Sapphire Amulet',type:'armor',slot:'amulet',stats:{defenceBonus:5},                                   sellPrice:250, sprite:'amulet-sapphire',desc:'A sapphire amulet.'});
    add('ruby_amulet',    {name:'Ruby Amulet',    type:'armor',slot:'amulet',stats:{strengthBonus:8},                                  sellPrice:500, sprite:'amulet-ruby',    desc:'A ruby amulet.'});
    add('emerald_amulet', {name:'Emerald Amulet', type:'armor',slot:'amulet',stats:{rangedBonus:8},                                    sellPrice:700, sprite:'amulet-emerald', desc:'An emerald amulet.'});
    add('diamond_amulet', {name:'Diamond Amulet', type:'armor',slot:'amulet',stats:{attackBonus:6,strengthBonus:6,defenceBonus:6},     sellPrice:1500,sprite:'amulet-diamond', desc:'A diamond amulet.'});
    add('onyx_amulet',    {name:'Onyx Amulet',    type:'armor',slot:'amulet',stats:{magicBonus:12},                                    sellPrice:3500,sprite:'amulet-onyx',    desc:'An onyx amulet.'});
    add('ancient_ring',   {name:'Ancient Ring',   type:'armor',slot:'ring',  stats:{attackBonus:8,strengthBonus:8,defenceBonus:8,magicBonus:8,rangedBonus:8}, sellPrice:5000, sprite:'ring-ancient', desc:'An ancient ring humming with power.',unique:true});
    add('ashfall_amulet', {name:'Ashfall Amulet', type:'armor',slot:'amulet',stats:{attackBonus:12,strengthBonus:10,damageReduction:5},sellPrice:15000,sprite:'amulet-ashfall',desc:'The legendary Ashfall Amulet.',unique:true});

    return items;
  })(),

  gatheringActions: {
    woodcutting: [
      {id:'chop_oak',    name:'Oak Tree',    level:1, xp:40, time:3.0, loot:[{item:'oak_log',qty:1}],    masteryId:'oak'},
      {id:'chop_willow', name:'Willow Tree', level:15,xp:100, time:3.5, loot:[{item:'willow_log',qty:1}], masteryId:'willow'},
      {id:'chop_maple',  name:'Maple Tree',  level:30,xp:220, time:4.0, loot:[{item:'maple_log',qty:1}],  masteryId:'maple'},
      {id:'chop_yew',    name:'Yew Tree',    level:45,xp:400,time:5.0, loot:[{item:'yew_log',qty:1}],    masteryId:'yew'},
      {id:'chop_elder',  name:'Elder Tree',  level:60,xp:720,time:6.0, loot:[{item:'elder_log',qty:1}],  masteryId:'elder'},
      {id:'chop_ashwood',name:'Ashwood Tree',level:75,xp:1200,time:7.0, loot:[{item:'ash_log',qty:1}],    masteryId:'ashwood'},
    ],
    mining: [
      {id:'mine_copper', name:'Copper Rock', level:1, xp:32,  time:3.0,loot:[{item:'copper_ore',qty:1}], masteryId:'copper',gemChance:0.01},
      {id:'mine_tin',    name:'Tin Rock',    level:1, xp:32,  time:3.0,loot:[{item:'tin_ore',qty:1}],    masteryId:'tin',   gemChance:0.01},
      {id:'mine_iron',   name:'Iron Rock',   level:15,xp:88, time:4.0,loot:[{item:'iron_ore',qty:1}],   masteryId:'iron',  gemChance:0.02},
      {id:'mine_coal',   name:'Coal Rock',   level:25,xp:140, time:4.5,loot:[{item:'coal_ore',qty:1}],   masteryId:'coal',  gemChance:0.02},
      {id:'mine_mithril',name:'Mithril Rock',level:40,xp:280, time:5.5,loot:[{item:'mithril_ore',qty:1}],masteryId:'mithril',gemChance:0.03},
      {id:'mine_adamant',name:'Adamant Rock',level:55,xp:520,time:7.0,loot:[{item:'adamant_ore',qty:1}],masteryId:'adamant',gemChance:0.04},
      {id:'mine_obsidian',name:'Obsidian Vein',level:70,xp:880,time:8.0,loot:[{item:'obsidian_ore',qty:1}],masteryId:'obsidian',gemChance:0.05},
      {id:'mine_essence',name:'Rune Essence', level:1, xp:20,  time:2.0,loot:[{item:'rune_essence',qty:1}],masteryId:'essence',gemChance:0},
    ],
    fishing: [
      {id:'fish_shrimp',   name:'Shrimp Spot',     level:1, xp:20,  time:3.0,loot:[{item:'raw_shrimp',qty:1}],    masteryId:'shrimp'},
      {id:'fish_trout',    name:'Trout Spot',      level:10,xp:60, time:3.5,loot:[{item:'raw_trout',qty:1}],     masteryId:'trout'},
      {id:'fish_salmon',   name:'Salmon Spot',     level:25,xp:140, time:4.0,loot:[{item:'raw_salmon',qty:1}],    masteryId:'salmon'},
      {id:'fish_lobster',  name:'Lobster Spot',    level:35,xp:260, time:4.5,loot:[{item:'raw_lobster',qty:1}],   masteryId:'lobster'},
      {id:'fish_swordfish',name:'Swordfish Spot',  level:50,xp:480,time:5.5,loot:[{item:'raw_swordfish',qty:1}], masteryId:'swordfish'},
      {id:'fish_angler',   name:'Anglerfish Spot', level:65,xp:800,time:7.0,loot:[{item:'raw_anglerfish',qty:1}],masteryId:'angler'},
      {id:'fish_leviathan',name:'Leviathan Depths',level:80,xp:1400,time:9.0,loot:[{item:'raw_leviathan',qty:1}], masteryId:'leviathan'},
    ],
    foraging: [
      {id:'forage_silver',name:'Silverleaf Patch', level:1, xp:32,  time:3.0,loot:[{item:'silverleaf',qty:1}],masteryId:'silverleaf'},
      {id:'forage_blood', name:'Bloodroot Thicket',level:20,xp:100, time:4.0,loot:[{item:'bloodroot',qty:1}], masteryId:'bloodroot'},
      {id:'forage_moon',  name:'Moonpetal Grove',  level:40,xp:240, time:5.5,loot:[{item:'moonpetal',qty:1}], masteryId:'moonpetal'},
      {id:'forage_void',  name:'Voidbloom Rift',   level:60,xp:520,time:7.0,loot:[{item:'voidbloom',qty:1}], masteryId:'voidbloom'},
      {id:'forage_ash',   name:'Ashblossom Fields',level:75,xp:1000,time:8.5,loot:[{item:'ashblossom',qty:1}],masteryId:'ashblossom'},
    ],
    hunting: [
      {id:'hunt_rabbit',name:'Rabbit Snare', level:1, xp:32,  time:4.0, loot:[{item:'leather',qty:1},{item:'bones',qty:1}], masteryId:'rabbit'},
      {id:'hunt_wolf',  name:'Wolf Tracking',level:15,xp:100, time:5.0, loot:[{item:'wolf_pelt',qty:1},{item:'bones',qty:1}],masteryId:'wolf'},
      {id:'hunt_bear',  name:'Bear Tracking',level:35,xp:240, time:6.5, loot:[{item:'bear_pelt',qty:1},{item:'hard_leather',qty:1},{item:'big_bones',qty:1}],masteryId:'bear'},
      {id:'hunt_wyvern',name:'Wyvern Hunt',  level:55,xp:600,time:8.0, loot:[{item:'wyvern_scale',qty:1},{item:'hard_leather',qty:1}],masteryId:'wyvern'},
      {id:'hunt_dragon',name:'Young Dragon', level:75,xp:1280,time:10.0,loot:[{item:'dragon_hide',qty:1},{item:'dragon_bones',qty:1}],masteryId:'dragon'},
    ],
  },

  recipes: {
    cooking: [
      {id:'cook_shrimp',   name:'Cook Shrimp',    level:1, xp:40, time:2.0,input:[{item:'raw_shrimp',qty:1}],    output:{item:'shrimp',qty:1},         burnChance:0.30},
      {id:'cook_trout',    name:'Cook Trout',     level:10,xp:100, time:2.5,input:[{item:'raw_trout',qty:1}],     output:{item:'trout',qty:1},          burnChance:0.25},
      {id:'cook_salmon',   name:'Cook Salmon',    level:25,xp:200, time:3.0,input:[{item:'raw_salmon',qty:1}],    output:{item:'salmon',qty:1},         burnChance:0.20},
      {id:'cook_lobster',  name:'Cook Lobster',   level:35,xp:320, time:3.0,input:[{item:'raw_lobster',qty:1}],   output:{item:'lobster',qty:1},        burnChance:0.18},
      {id:'cook_swordfish',name:'Cook Swordfish', level:50,xp:560,time:3.5,input:[{item:'raw_swordfish',qty:1}], output:{item:'swordfish',qty:1},      burnChance:0.15},
      {id:'cook_angler',   name:'Cook Anglerfish',level:65,xp:880,time:4.0,input:[{item:'raw_anglerfish',qty:1}],output:{item:'anglerfish',qty:1},     burnChance:0.12},
      {id:'cook_leviathan',name:'Cook Leviathan', level:80,xp:1600,time:5.0,input:[{item:'raw_leviathan',qty:1}], output:{item:'leviathan_steak',qty:1},burnChance:0.10},
    ],
    smithing: [
      {id:'smelt_bronze',  name:'Smelt Bronze Bar',  level:1, xp:32,  time:3.0,input:[{item:'copper_ore',qty:1},{item:'tin_ore',qty:1}], output:{item:'bronze_bar',qty:1}},
      {id:'smelt_iron',    name:'Smelt Iron Bar',    level:15,xp:80, time:4.0,input:[{item:'iron_ore',qty:1}],                          output:{item:'iron_bar',qty:1}},
      {id:'smelt_steel',   name:'Smelt Steel Bar',   level:25,xp:160, time:5.0,input:[{item:'iron_ore',qty:1},{item:'coal_ore',qty:2}],  output:{item:'steel_bar',qty:1}},
      {id:'smelt_mithril', name:'Smelt Mithril Bar', level:40,xp:320, time:6.0,input:[{item:'mithril_ore',qty:1},{item:'coal_ore',qty:4}],output:{item:'mithril_bar',qty:1}},
      {id:'smelt_adamant', name:'Smelt Adamant Bar', level:55,xp:600,time:7.0,input:[{item:'adamant_ore',qty:1},{item:'coal_ore',qty:6}],output:{item:'adamant_bar',qty:1}},
      {id:'smelt_obsidian',name:'Smelt Obsidian Bar',level:70,xp:1120,time:8.0,input:[{item:'obsidian_ore',qty:1},{item:'coal_ore',qty:8}],output:{item:'obsidian_bar',qty:1}},
      {id:'smith_bronze_sword',name:'Bronze Sword',   level:1, xp:60, time:4.0,input:[{item:'bronze_bar',qty:2}], output:{item:'bronze_sword',qty:1}},
      {id:'smith_iron_sword',  name:'Iron Sword',     level:15,xp:140, time:5.0,input:[{item:'iron_bar',qty:2}],   output:{item:'iron_sword',qty:1}},
      {id:'smith_steel_sword', name:'Steel Sword',    level:25,xp:280, time:5.0,input:[{item:'steel_bar',qty:2}],  output:{item:'steel_sword',qty:1}},
      {id:'smith_mithril_sword',name:'Mithril Sword', level:40,xp:560,time:6.0,input:[{item:'mithril_bar',qty:3}],output:{item:'mithril_sword',qty:1}},
      {id:'smith_adamant_sword',name:'Adamant Sword', level:55,xp:1040,time:7.0,input:[{item:'adamant_bar',qty:3}],output:{item:'adamant_sword',qty:1}},
      {id:'smith_obsidian_sword',name:'Obsidian Blade',level:70,xp:2000,time:9.0,input:[{item:'obsidian_bar',qty:4}],output:{item:'obsidian_sword',qty:1}},
      {id:'smith_iron_axe',    name:'Iron Battleaxe',  level:18,xp:160, time:5.5,input:[{item:'iron_bar',qty:3}],   output:{item:'iron_battleaxe',qty:1}},
      {id:'smith_steel_axe',   name:'Steel Battleaxe', level:28,xp:340, time:6.0,input:[{item:'steel_bar',qty:3}],  output:{item:'steel_battleaxe',qty:1}},
      {id:'smith_mithril_axe', name:'Mithril Battleaxe',level:43,xp:680,time:7.0,input:[{item:'mithril_bar',qty:4}],output:{item:'mithril_battleaxe',qty:1}},
      {id:'smith_iron_mace',   name:'Iron Mace',       level:13,xp:112, time:4.5,input:[{item:'iron_bar',qty:1}],   output:{item:'iron_mace',qty:1}},
      {id:'smith_steel_mace',  name:'Steel Mace',      level:23,xp:240, time:5.0,input:[{item:'steel_bar',qty:2}],  output:{item:'steel_mace',qty:1}},
      {id:'smith_iron_dagger', name:'Iron Dagger',     level:8, xp:72, time:3.0,input:[{item:'iron_bar',qty:1}],   output:{item:'iron_dagger',qty:1}},
      {id:'smith_steel_dagger',name:'Steel Dagger',    level:18,xp:152, time:3.5,input:[{item:'steel_bar',qty:1}],  output:{item:'steel_dagger',qty:1}},
      {id:'smith_bronze_shield',name:'Bronze Shield',  level:1, xp:48, time:3.5,input:[{item:'bronze_bar',qty:2}], output:{item:'bronze_shield',qty:1}},
      {id:'smith_iron_shield', name:'Iron Shield',     level:15,xp:120, time:4.5,input:[{item:'iron_bar',qty:2}],   output:{item:'iron_shield',qty:1}},
      {id:'smith_steel_shield',name:'Steel Shield',    level:25,xp:240, time:5.0,input:[{item:'steel_bar',qty:3}],  output:{item:'steel_shield',qty:1}},
      {id:'smith_mithril_shield',name:'Mithril Shield',level:40,xp:520,time:6.0,input:[{item:'mithril_bar',qty:4}],output:{item:'mithril_shield',qty:1}},
      {id:'smith_bronze_helm', name:'Bronze Helm',     level:1, xp:40, time:3.0,input:[{item:'bronze_bar',qty:1}], output:{item:'bronze_helm',qty:1}},
      {id:'smith_iron_helm',   name:'Iron Helm',       level:10,xp:88, time:4.0,input:[{item:'iron_bar',qty:1}],   output:{item:'iron_helm',qty:1}},
      {id:'smith_steel_helm',  name:'Steel Helm',      level:20,xp:180, time:4.5,input:[{item:'steel_bar',qty:2}],  output:{item:'steel_helm',qty:1}},
      {id:'smith_mithril_helm',name:'Mithril Helm',    level:35,xp:400,time:5.0,input:[{item:'mithril_bar',qty:2}],output:{item:'mithril_helm',qty:1}},
      {id:'smith_adamant_helm',name:'Adamant Helm',    level:50,xp:800,time:6.0,input:[{item:'adamant_bar',qty:3}],output:{item:'adamant_helm',qty:1}},
      {id:'smith_bronze_plate',name:'Bronze Platebody',level:5, xp:100, time:5.0,input:[{item:'bronze_bar',qty:3}], output:{item:'bronze_plate',qty:1}},
      {id:'smith_iron_plate',  name:'Iron Platebody',  level:15,xp:200, time:6.0,input:[{item:'iron_bar',qty:3}],   output:{item:'iron_plate',qty:1}},
      {id:'smith_steel_plate', name:'Steel Platebody', level:30,xp:400,time:7.0,input:[{item:'steel_bar',qty:5}],  output:{item:'steel_plate',qty:1}},
      {id:'smith_mithril_plate',name:'Mithril Platebody',level:45,xp:800,time:8.0,input:[{item:'mithril_bar',qty:5}],output:{item:'mithril_plate',qty:1}},
      {id:'smith_adamant_plate',name:'Adamant Platebody',level:60,xp:1600,time:9.0,input:[{item:'adamant_bar',qty:5}],output:{item:'adamant_plate',qty:1}},
      {id:'smith_bronze_legs', name:'Bronze Platelegs',level:3, xp:72, time:4.0,input:[{item:'bronze_bar',qty:2}], output:{item:'bronze_legs',qty:1}},
      {id:'smith_iron_legs',   name:'Iron Platelegs',  level:12,xp:140, time:5.0,input:[{item:'iron_bar',qty:2}],   output:{item:'iron_legs',qty:1}},
      {id:'smith_steel_legs',  name:'Steel Platelegs', level:25,xp:280, time:5.5,input:[{item:'steel_bar',qty:3}],  output:{item:'steel_legs',qty:1}},
      {id:'smith_mithril_legs',name:'Mithril Platelegs',level:40,xp:600,time:6.5,input:[{item:'mithril_bar',qty:3}],output:{item:'mithril_legs',qty:1}},
      {id:'smith_adamant_legs',name:'Adamant Platelegs',level:55,xp:1200,time:7.5,input:[{item:'adamant_bar',qty:4}],output:{item:'adamant_legs',qty:1}},
      {id:'smith_iron_boots',  name:'Iron Boots',     level:12,xp:100, time:4.0,input:[{item:'iron_bar',qty:1}],   output:{item:'iron_boots',qty:1}},
      {id:'smith_steel_boots', name:'Steel Boots',    level:22,xp:200, time:4.5,input:[{item:'steel_bar',qty:2}],  output:{item:'steel_boots',qty:1}},
      {id:'smith_mithril_boots',name:'Mithril Boots', level:37,xp:480,time:5.5,input:[{item:'mithril_bar',qty:2}],output:{item:'mithril_boots',qty:1}},
      {id:'smith_iron_gauntlets',name:'Iron Gauntlets',level:11,xp:92,time:4.0,input:[{item:'iron_bar',qty:1}],   output:{item:'iron_gauntlets',qty:1}},
      {id:'smith_steel_gauntlets',name:'Steel Gauntlets',level:21,xp:192,time:4.5,input:[{item:'steel_bar',qty:2}],output:{item:'steel_gauntlets',qty:1}},
      {id:'smith_mithril_gauntlets',name:'Mithril Gauntlets',level:36,xp:460,time:5.5,input:[{item:'mithril_bar',qty:2}],output:{item:'mithril_gauntlets',qty:1}},
    ],
    fletching: [
      {id:'fletch_bronze_arrows',name:'Bronze Arrows (15)', level:1, xp:40, time:2.0,input:[{item:'oak_log',qty:1},{item:'bronze_bar',qty:1}], output:{item:'bronze_arrows',qty:15}},
      {id:'fletch_iron_arrows',  name:'Iron Arrows (15)',   level:15,xp:100, time:2.5,input:[{item:'oak_log',qty:1},{item:'iron_bar',qty:1}],   output:{item:'iron_arrows',qty:15}},
      {id:'fletch_steel_arrows', name:'Steel Arrows (15)',  level:30,xp:200, time:3.0,input:[{item:'willow_log',qty:1},{item:'steel_bar',qty:1}],output:{item:'steel_arrows',qty:15}},
      {id:'fletch_mithril_arrows',name:'Mithril Arrows (15)',level:45,xp:360,time:3.0,input:[{item:'maple_log',qty:1},{item:'mithril_bar',qty:1}],output:{item:'mithril_arrows',qty:15}},
      {id:'fletch_adamant_arrows',name:'Adamant Arrows (15)',level:60,xp:640,time:3.5,input:[{item:'yew_log',qty:1},{item:'adamant_bar',qty:1}],output:{item:'adamant_arrows',qty:15}},
      {id:'fletch_oak_shortbow', name:'Oak Shortbow',       level:5, xp:60, time:3.5,input:[{item:'oak_log',qty:2}],    output:{item:'oak_shortbow',qty:1}},
      {id:'fletch_willow_bow',   name:'Willow Shortbow',    level:20,xp:160, time:4.0,input:[{item:'willow_log',qty:2}], output:{item:'willow_shortbow',qty:1}},
      {id:'fletch_maple_bow',    name:'Maple Shortbow',     level:35,xp:320, time:4.5,input:[{item:'maple_log',qty:3}],  output:{item:'maple_shortbow',qty:1}},
      {id:'fletch_yew_bow',      name:'Yew Longbow',        level:50,xp:600,time:5.0,input:[{item:'yew_log',qty:3}],    output:{item:'yew_longbow',qty:1}},
      {id:'fletch_elder_bow',    name:'Elder Bow',          level:65,xp:1120,time:6.0,input:[{item:'elder_log',qty:4}],   output:{item:'elder_bow',qty:1}},
      {id:'fletch_ashwood_bow',  name:'Ashwood Bow',        level:78,xp:1800,time:7.0,input:[{item:'ash_log',qty:5}],    output:{item:'ashwood_bow',qty:1}},
    ],
    crafting: [
      {id:'craft_leather',       name:'Tan Leather',       level:1, xp:32, time:2.0,input:[{item:'bones',qty:2}],                             output:{item:'leather',qty:1}},
      {id:'craft_hard_leather',  name:'Tan Hard Leather',  level:25,xp:100,time:3.0,input:[{item:'big_bones',qty:2},{item:'leather',qty:2}],   output:{item:'hard_leather',qty:1}},
      {id:'craft_leather_boots', name:'Leather Boots',     level:5, xp:60,time:3.0,input:[{item:'leather',qty:2}],     output:{item:'leather_boots',qty:1}},
      {id:'craft_leather_gloves',name:'Leather Gloves',    level:8, xp:72,time:3.0,input:[{item:'leather',qty:2}],     output:{item:'leather_gloves',qty:1}},
      {id:'craft_leather_cape',  name:'Leather Cape',      level:10,xp:88,time:3.5,input:[{item:'leather',qty:3}],     output:{item:'leather_cape',qty:1}},
      {id:'craft_leather_cowl',  name:'Leather Cowl',      level:7, xp:72,time:3.0,input:[{item:'leather',qty:2}],     output:{item:'leather_cowl',qty:1}},
      {id:'craft_leather_body',  name:'Leather Body',      level:10,xp:120,time:4.0,input:[{item:'leather',qty:4}],     output:{item:'leather_body',qty:1}},
      {id:'craft_leather_chaps', name:'Leather Chaps',     level:9, xp:100,time:3.5,input:[{item:'leather',qty:3}],     output:{item:'leather_chaps',qty:1}},
      {id:'craft_studded_cowl',  name:'Studded Cowl',      level:20,xp:160,time:3.5,input:[{item:'leather',qty:2},{item:'iron_bar',qty:1}],output:{item:'studded_cowl',qty:1}},
      {id:'craft_studded_body',  name:'Studded Body',      level:25,xp:240,time:4.0,input:[{item:'leather',qty:4},{item:'iron_bar',qty:2}],output:{item:'studded_body',qty:1}},
      {id:'craft_studded_chaps', name:'Studded Chaps',     level:22,xp:192,time:3.5,input:[{item:'leather',qty:3},{item:'iron_bar',qty:1}],output:{item:'studded_chaps',qty:1}},
      {id:'craft_hard_cowl',     name:'Hard Leather Cowl', level:30,xp:280, time:4.0,input:[{item:'hard_leather',qty:2}],output:{item:'hard_leather_cowl',qty:1}},
      {id:'craft_hard_body',     name:'Hard Leather Body', level:35,xp:440,time:5.0,input:[{item:'hard_leather',qty:4}],output:{item:'hard_leather_body',qty:1}},
      {id:'craft_hard_chaps',    name:'Hard Leather Chaps',level:32,xp:340, time:4.5,input:[{item:'hard_leather',qty:3}],output:{item:'hard_leather_chaps',qty:1}},
      {id:'craft_dragon_cowl',   name:'Dragonhide Cowl',   level:45,xp:720,time:5.0,input:[{item:'dragon_hide',qty:2}], output:{item:'dragon_cowl',qty:1}},
      {id:'craft_dragon_body',   name:'Dragonhide Body',   level:55,xp:1120,time:6.0,input:[{item:'dragon_hide',qty:4}], output:{item:'dragon_body',qty:1}},
      {id:'craft_dragon_chaps',  name:'Dragonhide Chaps',  level:50,xp:880,time:5.5,input:[{item:'dragon_hide',qty:3}], output:{item:'dragon_chaps',qty:1}},
      {id:'craft_ranger_boots',  name:'Ranger Boots',      level:20,xp:160,time:3.5,input:[{item:'leather',qty:3}],     output:{item:'ranger_boots',qty:1}},
      {id:'craft_ranger_gloves', name:'Ranger Gloves',     level:18,xp:152,time:3.5,input:[{item:'leather',qty:2}],     output:{item:'ranger_gloves',qty:1}},
      {id:'craft_ranger_cape',   name:'Ranger Cape',       level:35,xp:360,time:4.0,input:[{item:'hard_leather',qty:3}],output:{item:'ranger_cape',qty:1}},
      {id:'craft_warrior_cape',  name:'Warrior Cape',      level:35,xp:360,time:4.0,input:[{item:'hard_leather',qty:3},{item:'iron_bar',qty:2}],output:{item:'warrior_cape',qty:1}},
      {id:'craft_app_hat',       name:'Apprentice Hat',    level:5, xp:72,time:3.0,input:[{item:'silverleaf',qty:2},{item:'leather',qty:1}],output:{item:'apprentice_hat',qty:1}},
      {id:'craft_app_robe',      name:'Apprentice Robe',   level:8, xp:100,time:3.5,input:[{item:'silverleaf',qty:3},{item:'leather',qty:2}],output:{item:'apprentice_robe',qty:1}},
      {id:'craft_app_skirt',     name:'Apprentice Skirt',  level:6, xp:80,time:3.0,input:[{item:'silverleaf',qty:2},{item:'leather',qty:1}],output:{item:'apprentice_skirt',qty:1}},
      {id:'craft_mystic_hat',    name:'Mystic Hat',        level:25,xp:220,time:4.0,input:[{item:'moonpetal',qty:2},{item:'leather',qty:2}], output:{item:'mystic_hat',qty:1}},
      {id:'craft_mystic_robe',   name:'Mystic Robe',       level:28,xp:300,time:4.5,input:[{item:'moonpetal',qty:3},{item:'leather',qty:3}], output:{item:'mystic_robe',qty:1}},
      {id:'craft_mystic_skirt',  name:'Mystic Skirt',      level:26,xp:248,time:4.0,input:[{item:'moonpetal',qty:2},{item:'leather',qty:2}], output:{item:'mystic_skirt',qty:1}},
      {id:'craft_mystic_boots',  name:'Mystic Boots',      level:22,xp:192,time:3.5,input:[{item:'moonpetal',qty:1},{item:'leather',qty:2}], output:{item:'mystic_boots',qty:1}},
      {id:'craft_mystic_gloves', name:'Mystic Gloves',     level:24,xp:208,time:3.5,input:[{item:'moonpetal',qty:1},{item:'leather',qty:2}], output:{item:'mystic_gloves',qty:1}},
      {id:'craft_mage_cape',     name:'Mage Cape',         level:35,xp:360,time:4.5,input:[{item:'moonpetal',qty:3},{item:'silverleaf',qty:5}],output:{item:'mage_cape',qty:1}},
      {id:'craft_topaz_ring',    name:'Topaz Ring',        level:15,xp:120, time:3.5,input:[{item:'topaz',qty:1},{item:'bronze_bar',qty:1}],  output:{item:'topaz_ring',qty:1}},
      {id:'craft_sapphire_ring', name:'Sapphire Ring',     level:25,xp:240, time:4.0,input:[{item:'sapphire',qty:1},{item:'iron_bar',qty:1}], output:{item:'sapphire_ring',qty:1}},
      {id:'craft_ruby_ring',     name:'Ruby Ring',         level:35,xp:400,time:4.0,input:[{item:'ruby',qty:1},{item:'steel_bar',qty:1}],    output:{item:'ruby_ring',qty:1}},
      {id:'craft_emerald_ring',  name:'Emerald Ring',      level:45,xp:600,time:4.5,input:[{item:'emerald',qty:1},{item:'mithril_bar',qty:1}],output:{item:'emerald_ring',qty:1}},
      {id:'craft_diamond_ring',  name:'Diamond Ring',      level:55,xp:1000,time:5.0,input:[{item:'diamond',qty:1},{item:'adamant_bar',qty:1}],output:{item:'diamond_ring',qty:1}},
      {id:'craft_onyx_ring',     name:'Onyx Ring',         level:65,xp:1600,time:5.5,input:[{item:'onyx',qty:1},{item:'obsidian_bar',qty:1}], output:{item:'onyx_ring',qty:1}},
      {id:'craft_topaz_amulet',  name:'Topaz Amulet',      level:20,xp:160, time:4.0,input:[{item:'topaz',qty:1},{item:'iron_bar',qty:1}],    output:{item:'topaz_amulet',qty:1}},
      {id:'craft_sapphire_amulet',name:'Sapphire Amulet',  level:30,xp:300, time:4.5,input:[{item:'sapphire',qty:1},{item:'steel_bar',qty:1}],output:{item:'sapphire_amulet',qty:1}},
      {id:'craft_ruby_amulet',   name:'Ruby Amulet',       level:40,xp:480,time:5.0,input:[{item:'ruby',qty:1},{item:'mithril_bar',qty:1}],  output:{item:'ruby_amulet',qty:1}},
      {id:'craft_emerald_amulet',name:'Emerald Amulet',    level:50,xp:720,time:5.0,input:[{item:'emerald',qty:1},{item:'adamant_bar',qty:1}],output:{item:'emerald_amulet',qty:1}},
      {id:'craft_diamond_amulet',name:'Diamond Amulet',    level:60,xp:1200,time:5.5,input:[{item:'diamond',qty:1},{item:'obsidian_bar',qty:1}],output:{item:'diamond_amulet',qty:1}},
      {id:'craft_onyx_amulet',   name:'Onyx Amulet',       level:70,xp:2000,time:6.0,input:[{item:'onyx',qty:1},{item:'obsidian_bar',qty:2}], output:{item:'onyx_amulet',qty:1}},
    ],
    alchemy: [
      {id:'brew_healing_i', name:'Healing Potion I', level:1, xp:60,time:3.0,input:[{item:'silverleaf',qty:3}],                 output:{item:'potion_healing_i',qty:1}},
      {id:'brew_healing_ii',name:'Healing Potion II',level:25,xp:200,time:4.0,input:[{item:'bloodroot',qty:3}],                  output:{item:'potion_healing_ii',qty:1}},
      {id:'brew_healing_iii',name:'Healing Potion III',level:50,xp:480,time:5.0,input:[{item:'moonpetal',qty:3}],               output:{item:'potion_healing_iii',qty:1}},
      {id:'brew_strength',  name:'Strength Potion',  level:15,xp:120,time:3.5,input:[{item:'silverleaf',qty:2},{item:'bloodroot',qty:1}],output:{item:'potion_strength',qty:1}},
      {id:'brew_defence',   name:'Defence Potion',   level:20,xp:140,time:3.5,input:[{item:'silverleaf',qty:1},{item:'bloodroot',qty:2}],output:{item:'potion_defence',qty:1}},
      {id:'brew_accuracy',  name:'Accuracy Potion',  level:35,xp:280,time:4.0,input:[{item:'moonpetal',qty:2},{item:'bloodroot',qty:1}], output:{item:'potion_accuracy',qty:1}},
      {id:'brew_speed',     name:'Haste Potion',     level:55,xp:640,time:5.5,input:[{item:'voidbloom',qty:2},{item:'moonpetal',qty:1}],output:{item:'potion_speed',qty:1}},
    ],
  },

  thievingTargets: [
    {id:'pickpocket_farmer',name:'Farmer',level:1, xp:32,  time:2.5,stunChance:0.20,stunTime:3,gold:{min:1,max:5},   loot:[{item:'potato_seed',qty:1,chance:0.30},{item:'onion_seed',qty:1,chance:0.15}]},
    {id:'pickpocket_guard', name:'Guard', level:15,xp:88, time:3.0,stunChance:0.25,stunTime:4,gold:{min:5,max:20},  loot:[{item:'iron_ore',qty:1,chance:0.10}]},
    {id:'pickpocket_merchant',name:'Merchant',level:30,xp:200,time:3.5,stunChance:0.30,stunTime:5,gold:{min:15,max:50},loot:[{item:'herb_seed',qty:1,chance:0.20},{item:'sapphire',qty:1,chance:0.05}]},
    {id:'pickpocket_noble', name:'Noble', level:45,xp:360, time:4.0,stunChance:0.35,stunTime:5,gold:{min:30,max:100},loot:[{item:'blood_seed',qty:1,chance:0.15},{item:'ruby',qty:1,chance:0.05}]},
    {id:'pickpocket_wizard',name:'Wizard',level:60,xp:640,time:4.5,stunChance:0.40,stunTime:6,gold:{min:50,max:200},loot:[{item:'moon_seed',qty:1,chance:0.10},{item:'rune_essence',qty:5,chance:0.20},{item:'chaos_rune',qty:3,chance:0.10}]},
  ],

  statusEffects: {
    burn:   {id:'burn',   name:'Burn',   color:'#d67338',desc:'Damage over time. Stacks multiplicatively.',tick:2.0,baseDmg:5},
    poison: {id:'poison', name:'Poison', color:'#5ab04b',desc:'Minor damage. Explodes at 7 stacks.',tick:2.0,baseDmg:3,explodeStacks:7,explodeDmg:80},
    freeze: {id:'freeze', name:'Freeze', color:'#4a9ed4',desc:'Triples damage on next hit.',tick:2.0,baseDmg:2},
    bleed:  {id:'bleed',  name:'Bleed',  color:'#a02a2a',desc:'Damage over time from crits.',tick:1.5,baseDmg:4},
  },

  monsters: {
    chicken:      {id:'chicken',     name:'Chicken',       hp:25,  maxHit:3,  attackSpeed:2.8,combatLevel:1, style:'melee', evasion:{melee:5, ranged:5, magic:5}, xp:20,  gold:{min:0,max:2},  alignment:'NN',drops:[{item:'feather',qty:1,chance:0.50},{item:'bones',qty:1,chance:1.0}]},
    rat:          {id:'rat',         name:'Giant Rat',     hp:40,  maxHit:5,  attackSpeed:2.6,combatLevel:3, style:'melee', evasion:{melee:8, ranged:8, magic:5}, xp:32,  gold:{min:1,max:5},  alignment:'CN',drops:[{item:'bones',qty:1,chance:1.0},{item:'leather',qty:1,chance:0.30}]},
    goblin:       {id:'goblin',      name:'Goblin',        hp:60,  maxHit:8,  attackSpeed:2.6,combatLevel:5, style:'melee', evasion:{melee:12,ranged:10,magic:8}, xp:48, gold:{min:3,max:12}, alignment:'CE',drops:[{item:'bones',qty:1,chance:1.0},{item:'bronze_sword',qty:1,chance:0.05},{item:'bronze_shield',qty:1,chance:0.05}]},
    skeleton:     {id:'skeleton',    name:'Skeleton',      hp:100, maxHit:12, attackSpeed:2.4,combatLevel:10,style:'melee', evasion:{melee:18,ranged:15,magic:10},xp:72, gold:{min:5,max:20}, alignment:'NE',drops:[{item:'bones',qty:2,chance:1.0},{item:'iron_sword',qty:1,chance:0.05}]},
    bandit:       {id:'bandit',      name:'Bandit',        hp:150, maxHit:18, attackSpeed:2.4,combatLevel:15,style:'melee', evasion:{melee:25,ranged:20,magic:15},xp:100, gold:{min:10,max:40},alignment:'CN',drops:[{item:'bones',qty:1,chance:1.0},{item:'iron_plate',qty:1,chance:0.03},{item:'iron_helm',qty:1,chance:0.05},{item:'leather',qty:1,chance:0.30}]},
    wolf:         {id:'wolf',        name:'Dire Wolf',     hp:200, maxHit:22, attackSpeed:2.2,combatLevel:20,style:'melee', evasion:{melee:30,ranged:25,magic:15},xp:128, gold:{min:8,max:30}, alignment:'NN',drops:[{item:'bones',qty:1,chance:1.0},{item:'wolf_pelt',qty:1,chance:0.40},{item:'leather',qty:2,chance:0.40}]},
    troll:        {id:'troll',       name:'Troll',         hp:350, maxHit:30, attackSpeed:3.0,combatLevel:28,style:'melee', evasion:{melee:35,ranged:30,magic:20},xp:180, gold:{min:15,max:60},alignment:'CE',drops:[{item:'big_bones',qty:1,chance:1.0},{item:'steel_plate',qty:1,chance:0.03},{item:'iron_ore',qty:2,chance:0.15}]},
    dark_mage:    {id:'dark_mage',   name:'Dark Mage',     hp:280, maxHit:35, attackSpeed:2.6,combatLevel:32,style:'magic', evasion:{melee:15,ranged:20,magic:45},xp:220, gold:{min:20,max:80},alignment:'NE',drops:[{item:'bones',qty:1,chance:1.0},{item:'chaos_rune',qty:5,chance:0.20},{item:'mystic_staff',qty:1,chance:0.02},{item:'mystic_robe',qty:1,chance:0.03}]},
    shadow_archer:{id:'shadow_archer',name:'Shadow Archer',hp:320, maxHit:32, attackSpeed:2.2,combatLevel:35,style:'ranged',evasion:{melee:20,ranged:40,magic:25},xp:240, gold:{min:20,max:70},alignment:'CE',drops:[{item:'bones',qty:1,chance:1.0},{item:'steel_arrows',qty:10,chance:0.30},{item:'maple_shortbow',qty:1,chance:0.03},{item:'studded_body',qty:1,chance:0.04}]},
    ogre:         {id:'ogre',        name:'Ogre',          hp:500, maxHit:40, attackSpeed:3.2,combatLevel:40,style:'melee', evasion:{melee:40,ranged:35,magic:25},xp:300, gold:{min:25,max:100},alignment:'CE',drops:[{item:'big_bones',qty:1,chance:1.0},{item:'mithril_ore',qty:2,chance:0.10},{item:'hard_leather',qty:1,chance:0.20}]},
    wyvern:       {id:'wyvern',      name:'Wyvern',        hp:700, maxHit:55, attackSpeed:2.4,combatLevel:50,style:'ranged',evasion:{melee:50,ranged:55,magic:35},xp:1600,gold:{min:40,max:150},alignment:'CN',drops:[{item:'big_bones',qty:2,chance:1.0},{item:'wyvern_scale',qty:1,chance:0.25},{item:'adamant_ore',qty:2,chance:0.08},{item:'yew_longbow',qty:1,chance:0.02}]},
    demon:        {id:'demon',       name:'Demon',         hp:900, maxHit:70, attackSpeed:2.6,combatLevel:60,style:'magic', evasion:{melee:35,ranged:40,magic:65},xp:2240,gold:{min:60,max:200},alignment:'CE',drops:[{item:'big_bones',qty:2,chance:1.0},{item:'death_rune',qty:5,chance:0.15},{item:'void_staff',qty:1,chance:0.01},{item:'adept_robe',qty:1,chance:0.02}]},
    dragon:       {id:'dragon',      name:'Dragon',        hp:1500,maxHit:90, attackSpeed:2.8,combatLevel:75,style:'melee', evasion:{melee:70,ranged:65,magic:50},xp:3200,gold:{min:100,max:400},alignment:'NE',drops:[{item:'dragon_bones',qty:1,chance:1.0},{item:'dragon_hide',qty:1,chance:0.50},{item:'obsidian_ore',qty:3,chance:0.10},{item:'dragon_scimitar',qty:1,chance:0.01}]},
    void_walker:  {id:'void_walker', name:'Void Walker',   hp:2000,maxHit:110,attackSpeed:2.2,combatLevel:85,style:'magic', evasion:{melee:60,ranged:55,magic:80},xp:4480,gold:{min:150,max:500},alignment:'CE',drops:[{item:'dragon_bones',qty:2,chance:1.0},{item:'death_rune',qty:10,chance:0.20},{item:'elder_staff',qty:1,chance:0.005},{item:'archmage_robe',qty:1,chance:0.01}]},
    ashfall_titan:{id:'ashfall_titan',name:'Ashfall Titan',hp:5000,maxHit:150,attackSpeed:3.0,combatLevel:99,style:'melee', evasion:{melee:90,ranged:85,magic:70},xp:8000,gold:{min:500,max:2000},alignment:'CE',drops:[{item:'dragon_bones',qty:5,chance:1.0},{item:'ashfire_blade',qty:1,chance:0.005},{item:'ashfall_amulet',qty:1,chance:0.002},{item:'obsidian_bar',qty:5,chance:0.15}]},
  },

  combatAreas: [
    {id:'farm',         name:'Farmlands',       monsters:['chicken','rat'],           levelReq:1, desc:'Peaceful farmlands with weak creatures.'},
    {id:'forest',       name:'Darkwood Forest', monsters:['goblin','skeleton','wolf'],levelReq:5, desc:'A dense forest teeming with danger.'},
    {id:'bandit_camp',  name:'Bandit Camp',     monsters:['bandit','shadow_archer'],  levelReq:15,desc:'A fortified camp of outlaws.'},
    {id:'mountain',     name:'Ironpeak Mountain',monsters:['troll','ogre'],           levelReq:25,desc:'Treacherous mountain paths.'},
    {id:'dark_tower',   name:'Dark Tower',      monsters:['dark_mage','demon'],       levelReq:35,desc:'A tower of dark sorcery.'},
    {id:'dragons_lair', name:'Dragon\'s Lair',  monsters:['wyvern','dragon'],         levelReq:50,desc:'The volcanic lair of dragonkind.'},
    {id:'void_rift',    name:'The Void Rift',   monsters:['void_walker'],             levelReq:70,desc:'A tear in reality leaking void energy.'},
    {id:'ashfall_crater',name:'Ashfall Crater', monsters:['ashfall_titan'],           levelReq:85,desc:'The epicenter of the great cataclysm.'},
  ],

  dungeons: [
    {id:'goblin_den',     name:'Goblin Den',       waves:['goblin','goblin','goblin','goblin','goblin'],levelReq:5, rewards:[{item:'iron_sword',qty:1,chance:0.20},{item:'iron_shield',qty:1,chance:0.15}],desc:'A smelly cave full of goblins.'},
    {id:'bandit_fortress',name:'Bandit Fortress',  waves:['bandit','bandit','shadow_archer','bandit','shadow_archer','bandit'],levelReq:20,rewards:[{item:'steel_sword',qty:1,chance:0.15},{item:'steel_plate',qty:1,chance:0.10}],desc:'The bandit stronghold.'},
    {id:'troll_cave',     name:'Troll Stronghold', waves:['troll','troll','ogre','troll','ogre'],levelReq:30,rewards:[{item:'mithril_sword',qty:1,chance:0.10},{item:'mithril_plate',qty:1,chance:0.08}],desc:'A cave ruled by ogres.'},
    {id:'dark_sanctum',   name:'Dark Sanctum',     waves:['dark_mage','dark_mage','demon','dark_mage','demon','demon'],levelReq:45,rewards:[{item:'void_staff',qty:1,chance:0.08},{item:'death_rune',qty:20,chance:0.30},{item:'void_cape',qty:1,chance:0.03}],desc:'Forbidden dark magic.'},
    {id:'dragon_peak',    name:'Dragon Peak',      waves:['wyvern','wyvern','dragon','wyvern','dragon','dragon'],levelReq:60,rewards:[{item:'obsidian_sword',qty:1,chance:0.08},{item:'obsidian_plate',qty:1,chance:0.05},{item:'dragon_scimitar',qty:1,chance:0.05}],desc:'Where elder dragons roost.'},
    {id:'void_abyss',     name:'The Void Abyss',   waves:['void_walker','void_walker','void_walker','demon','void_walker','void_walker'],levelReq:75,rewards:[{item:'elder_staff',qty:1,chance:0.05},{item:'ancient_ring',qty:1,chance:0.02}],desc:'Deepest void rift.'},
    {id:'ashfall_sanctum',name:'Ashfall Sanctum',  waves:['dragon','void_walker','ashfall_titan'],levelReq:90,rewards:[{item:'ashfire_blade',qty:1,chance:0.03},{item:'ashfall_amulet',qty:1,chance:0.01}],desc:'Face the Ashfall Titan.'},
  ],

  abilities: [
    {id:'power_strike', name:'Power Strike', style:'melee', desc:'+100% damage for 10s.',cooldown:15,tacticsReq:1, effect:{buff:{stat:'damageMult',value:2,duration:10}}},
    {id:'quick_shot',   name:'Quick Shot',   style:'ranged',desc:'Instant ranged shot, +50% damage.', cooldown:12,tacticsReq:1, effect:{instantDmg:true,dmgMult:1.5}},
    {id:'fireball',     name:'Fireball',     style:'magic', desc:'80 magic damage + Burn (3 stacks).',cooldown:18,tacticsReq:1, effect:{directDmg:80,burn:3}},
    {id:'war_cry',      name:'War Cry',      style:'any',   desc:'+25% damage for 15s.',            cooldown:60,tacticsReq:10,effect:{buff:{stat:'damageMult',value:1.25,duration:15}}},
    {id:'ice_blast',    name:'Ice Blast',    style:'magic', desc:'Freezes target (5 stacks).',      cooldown:25,tacticsReq:10,effect:{freeze:5}},
    {id:'venom_strike', name:'Venom Strike', style:'melee', desc:'Apply Poison (2 stacks).',        cooldown:20,tacticsReq:15,effect:{poison:2}},
    {id:'execute',      name:'Execute',      style:'melee', desc:'3x damage if target below 30% HP.',cooldown:30,tacticsReq:25,effect:{execute:3}},
    {id:'heal',         name:'Heal',         style:'any',   desc:'Restore 30% of max HP.',          cooldown:45,tacticsReq:20,effect:{heal:0.30}},
    {id:'shadow_step',  name:'Shadow Step',  style:'melee', desc:'Dodge next attack + deal 50 dmg.',cooldown:20,tacticsReq:12,effect:{directDmg:50,buff:{stat:'dodgeNext',value:1,duration:5}}},
    {id:'soul_drain',   name:'Soul Drain',   style:'magic', desc:'60 damage + heal 50% dealt.',     cooldown:22,tacticsReq:18,effect:{directDmg:60,lifesteal:0.5}},
    {id:'rallying_cry', name:'Rallying Cry', style:'any',   desc:'+15% Defence for 20s.',           cooldown:40,tacticsReq:15,effect:{buff:{stat:'defenceBonus',value:15,duration:20}}},
    {id:'double_shot',  name:'Double Shot',  style:'ranged',desc:'Two rapid shots at 80% damage.',  cooldown:16,tacticsReq:12,effect:{instantDmg:true,dmgMult:0.8,hits:2}},
  ],

  worldBosses: [
    {id:'blight_warden',name:'The Blight Warden',hp:15000,maxHit:140,combatLevel:80, style:'melee',attackSpeed:2.5,evasion:{melee:70,ranged:60,magic:55},desc:'A plague-ridden titan.',          respawn:3600, xp:32000,gold:{min:2000,max:5000}, rewards:[{item:'dragon_bones',qty:3,chance:1.0},{item:'obsidian_plate',qty:1,chance:0.10},{item:'diamond',qty:3,chance:0.50}]},
    {id:'storm_reaver', name:'Storm Reaver',     hp:22000,maxHit:170,combatLevel:90, style:'magic',attackSpeed:2.2,evasion:{melee:60,ranged:55,magic:80},desc:'A lightning-wreathed horror.',    respawn:7200, xp:56000,gold:{min:4000,max:8000}, rewards:[{item:'dragon_bones',qty:4,chance:1.0},{item:'elder_staff',qty:1,chance:0.08},{item:'ancient_ring',qty:1,chance:0.05}]},
    {id:'ashen_overlord',name:'The Ashen Overlord',hp:40000,maxHit:220,combatLevel:110,style:'melee',attackSpeed:2.4,evasion:{melee:90,ranged:85,magic:75},desc:'The burnt king of the first age.',respawn:14400,xp:128000,gold:{min:10000,max:25000},rewards:[{item:'dragon_bones',qty:6,chance:1.0},{item:'ashfire_blade',qty:1,chance:0.15},{item:'ashfall_amulet',qty:1,chance:0.08}]},
  ],

  shop: [
    {item:'raw_shrimp',price:5,category:'food'},{item:'raw_trout',price:15,category:'food'},{item:'raw_salmon',price:35,category:'food'},{item:'raw_lobster',price:80,category:'food'},
    {item:'feather',price:3,category:'materials'},{item:'rune_essence',price:5,category:'materials'},{item:'leather',price:15,category:'materials'},
    {item:'fire_rune',price:12,category:'runes'},{item:'water_rune',price:12,category:'runes'},{item:'earth_rune',price:12,category:'runes'},{item:'air_rune',price:12,category:'runes'},
    {item:'chaos_rune',price:60,category:'runes'},{item:'death_rune',price:150,category:'runes'},
    {item:'potato_seed',price:5,category:'seeds'},{item:'onion_seed',price:10,category:'seeds'},{item:'herb_seed',price:25,category:'seeds'},{item:'blood_seed',price:60,category:'seeds'},
    {item:'enchant_scroll',price:500,category:'special'},
    {item:'bronze_sword',price:30,category:'equipment'},{item:'bronze_shield',price:25,category:'equipment'},{item:'bronze_helm',price:20,category:'equipment'},{item:'bronze_plate',price:50,category:'equipment'},{item:'bronze_legs',price:35,category:'equipment'},
    {item:'apprentice_wand',price:50,category:'equipment'},{item:'oak_shortbow',price:40,category:'equipment'},
  ],

  achievements: [
    {id:'first_tree',      name:'Lumberjack',      desc:'Chop your first tree.',          check:(g)=>g.stats.totalActions.woodcutting>=1},
    {id:'first_ore',       name:'Prospector',      desc:'Mine your first ore.',           check:(g)=>g.stats.totalActions.mining>=1},
    {id:'first_fish',      name:'Angler',          desc:'Catch your first fish.',         check:(g)=>g.stats.totalActions.fishing>=1},
    {id:'first_kill',      name:'Warrior',         desc:'Defeat your first monster.',     check:(g)=>g.stats.monstersKilled>=1},
    {id:'first_dungeon',   name:'Dungeon Crawler', desc:'Complete your first dungeon.',   check:(g)=>g.stats.dungeonsCompleted>=1},
    {id:'first_quest',     name:'Adventurer',      desc:'Complete your first quest.',     check:(g)=>(g.quests?.completed?.length||0)>=1},
    {id:'five_quests',     name:'Seasoned',        desc:'Complete 5 quests.',             check:(g)=>(g.quests?.completed?.length||0)>=5},
    {id:'level_10',        name:'Apprentice',      desc:'Reach level 10 in any skill.',   check:(g)=>Object.values(g.skills).some(s=>s.level>=10)},
    {id:'level_25',        name:'Journeyman',      desc:'Reach level 25 in any skill.',   check:(g)=>Object.values(g.skills).some(s=>s.level>=25)},
    {id:'level_50',        name:'Expert',          desc:'Reach level 50 in any skill.',   check:(g)=>Object.values(g.skills).some(s=>s.level>=50)},
    {id:'level_99',        name:'Master',          desc:'Reach level 99 in any skill.',   check:(g)=>Object.values(g.skills).some(s=>s.level>=99)},
    {id:'gold_1000',       name:'Coin Purse',      desc:'Accumulate 1,000 gold.',         check:(g)=>g.gold>=1000},
    {id:'gold_100000',     name:'Wealthy',         desc:'Accumulate 100,000 gold.',       check:(g)=>g.gold>=100000},
    {id:'gold_1000000',    name:'Millionaire',     desc:'Accumulate 1,000,000 gold.',     check:(g)=>g.gold>=1000000},
    {id:'kill_100',        name:'Slayer',          desc:'Defeat 100 monsters.',           check:(g)=>g.stats.monstersKilled>=100},
    {id:'kill_1000',       name:'Annihilator',     desc:'Defeat 1,000 monsters.',         check:(g)=>g.stats.monstersKilled>=1000},
    {id:'slay_dragon',     name:'Dragonslayer',    desc:'Defeat a Dragon.',               check:(g)=>g.stats.uniqueKills&&g.stats.uniqueKills.dragon},
    {id:'slay_titan',      name:'Titanfall',       desc:'Defeat the Ashfall Titan.',      check:(g)=>g.stats.uniqueKills&&g.stats.uniqueKills.ashfall_titan},
    {id:'all_skills_10',   name:'Well-Rounded',    desc:'Get all skills to level 10.',    check:(g)=>Object.values(g.skills).every(s=>s.level>=10)},
    {id:'total_level_500', name:'Dedicated',       desc:'Reach a total level of 500.',    check:(g)=>Object.values(g.skills).reduce((a,s)=>a+s.level,0)>=500},
    {id:'reputation_hero', name:'Renowned Hero',   desc:'Reach 10,000 rep with any faction.',check:(g)=>Object.values(g.reputation||{}).some(r=>r>=10000)},
    {id:'world_boss',      name:'Worldbreaker',    desc:'Defeat a World Boss.',           check:(g)=>(g.stats.worldBossKills||0)>0},
  ],

  spells: [
    {id:'wind_strike',  name:'Wind Strike', level:1, maxHit:12, runes:[{item:'air_rune',qty:1}],                          desc:'A basic air attack.'},
    {id:'water_strike', name:'Water Strike',level:5, maxHit:18, runes:[{item:'water_rune',qty:1},{item:'air_rune',qty:1}], desc:'A bolt of water magic.'},
    {id:'earth_strike', name:'Earth Strike',level:10,maxHit:25, runes:[{item:'earth_rune',qty:1},{item:'air_rune',qty:1}], desc:'Hurl a chunk of earth.'},
    {id:'fire_strike',  name:'Fire Strike', level:15,maxHit:35, runes:[{item:'fire_rune',qty:2}],                          desc:'Launch a fireball.',statusChance:{burn:0.20}},
    {id:'wind_bolt',    name:'Wind Bolt',   level:25,maxHit:50, runes:[{item:'air_rune',qty:2},{item:'chaos_rune',qty:1}], desc:'A powerful gust of wind.'},
    {id:'fire_bolt',    name:'Fire Bolt',   level:35,maxHit:70, runes:[{item:'fire_rune',qty:3},{item:'chaos_rune',qty:1}],desc:'An intense fire bolt.',statusChance:{burn:0.30}},
    {id:'fire_blast',   name:'Fire Blast',  level:50,maxHit:100,runes:[{item:'fire_rune',qty:5},{item:'death_rune',qty:1}],desc:'A devastating fire blast.',statusChance:{burn:0.45}},
    {id:'void_surge',   name:'Void Surge',  level:70,maxHit:150,runes:[{item:'death_rune',qty:3},{item:'chaos_rune',qty:3}],desc:'Channel the void.',statusChance:{poison:0.20,burn:0.20}},
  ],

  equipmentSlots: ['weapon','shield','head','body','legs','boots','gloves','ring','amulet','cape','ammo'],
};

if (typeof module !== 'undefined') module.exports = GAME_DATA;

// ============================================================
// v3.0 EXPANSION — Prayer, Pets, Slayer, Spellbooks, Monster Families
// ============================================================

// ── PRAYER SYSTEM ────────────────────────────────────────
GAME_DATA.skills.prayer = {id:'prayer',name:'Prayer',type:'combat',icon:'sparkle',desc:'Bury bones for prayer points. Activate prayers for passive combat buffs.'};
GAME_DATA.skills.slayer = {id:'slayer',name:'Slayer',type:'combat',icon:'target',desc:'Complete assigned kill tasks for Slayer XP and Slayer Coins.'};

GAME_DATA.boneValues = {
  bones: { points:4, xp:4.5 },
  big_bones: { points:15, xp:15 },
  dragon_bones: { points:72, xp:72 },
  // new bone types
  frost_bones: { points:30, xp:35 },
  ash_bones: { points:50, xp:55 },
  void_bones: { points:100, xp:120 },
};

// Add new bone items
GAME_DATA.items.frost_bones = {id:'frost_bones',name:'Frost Bones',type:'resource',subtype:'misc',sellPrice:40,sprite:'misc-bone',desc:'Bones of a frost creature. High prayer value.'};
GAME_DATA.items.ash_bones = {id:'ash_bones',name:'Ash Bones',type:'resource',subtype:'misc',sellPrice:80,sprite:'misc-bone',desc:'Charred bones from Ashborn creatures.'};
GAME_DATA.items.void_bones = {id:'void_bones',name:'Void Bones',type:'resource',subtype:'misc',sellPrice:200,sprite:'misc-bone',desc:'Bones warped by void energy.'};

GAME_DATA.prayers = [
  {id:'thick_skin',      name:'Thick Skin',      level:1,  pointCost:1,  desc:'+5% Defence.',         bonus:{defenceBonus:5}},
  {id:'burst_of_str',    name:'Burst of Strength',level:4,  pointCost:1,  desc:'+5% Strength.',        bonus:{strengthBonus:5}},
  {id:'clarity_of_thought',name:'Clarity of Thought',level:7,pointCost:1,desc:'+5% Attack.',           bonus:{attackBonus:5}},
  {id:'sharp_eye',       name:'Sharp Eye',        level:8,  pointCost:1,  desc:'+5% Ranged.',          bonus:{rangedBonus:5}},
  {id:'mystic_will',     name:'Mystic Will',      level:9,  pointCost:1,  desc:'+5% Magic.',           bonus:{magicBonus:5}},
  {id:'rock_skin',       name:'Rock Skin',        level:10, pointCost:3,  desc:'+10% Defence.',        bonus:{defenceBonus:10}},
  {id:'superhuman_str',  name:'Superhuman Strength',level:13,pointCost:3, desc:'+10% Strength.',       bonus:{strengthBonus:10}},
  {id:'improved_reflexes',name:'Improved Reflexes',level:16, pointCost:3, desc:'+10% Attack.',         bonus:{attackBonus:10}},
  {id:'hawk_eye',        name:'Hawk Eye',         level:26, pointCost:3,  desc:'+10% Ranged.',         bonus:{rangedBonus:10}},
  {id:'mystic_lore',     name:'Mystic Lore',      level:27, pointCost:3,  desc:'+10% Magic.',          bonus:{magicBonus:10}},
  {id:'steel_skin',      name:'Steel Skin',       level:28, pointCost:5,  desc:'+15% Defence.',        bonus:{defenceBonus:15}},
  {id:'ultimate_str',    name:'Ultimate Strength', level:31, pointCost:5,  desc:'+15% Strength.',      bonus:{strengthBonus:15}},
  {id:'incredible_reflexes',name:'Incredible Reflexes',level:34,pointCost:5,desc:'+15% Attack.',       bonus:{attackBonus:15}},
  {id:'eagle_eye',       name:'Eagle Eye',        level:44, pointCost:5,  desc:'+15% Ranged.',         bonus:{rangedBonus:15}},
  {id:'mystic_might',    name:'Mystic Might',     level:45, pointCost:5,  desc:'+15% Magic.',          bonus:{magicBonus:15}},
  {id:'piety',           name:'Piety',            level:70, pointCost:8,  desc:'+20% Atk, +23% Str, +25% Def.', bonus:{attackBonus:20,strengthBonus:23,defenceBonus:25}},
  {id:'rigour',          name:'Rigour',           level:74, pointCost:8,  desc:'+20% Ranged, +25% Def.', bonus:{rangedBonus:20,defenceBonus:25}},
  {id:'augury',          name:'Augury',           level:77, pointCost:8,  desc:'+25% Magic, +25% Def.', bonus:{magicBonus:25,defenceBonus:25}},
  {id:'protect_melee',   name:'Protect from Melee',level:43,pointCost:6,  desc:'Reduce melee damage by 40%.',  bonus:{protectMelee:40}},
  {id:'protect_ranged',  name:'Protect from Ranged',level:40,pointCost:6, desc:'Reduce ranged damage by 40%.', bonus:{protectRanged:40}},
  {id:'protect_magic',   name:'Protect from Magic',level:37,pointCost:6,  desc:'Reduce magic damage by 40%.',  bonus:{protectMagic:40}},
];

// ── PET SYSTEM ───────────────────────────────────────────
GAME_DATA.pets = [
  // Skilling pets
  {id:'beaver',   name:'Rocky the Beaver', source:'woodcutting', dropRate:0.0001, bonus:{type:'gatherSpeed', skill:'woodcutting', value:3}, desc:'A tiny beaver. +3% Woodcutting speed.'},
  {id:'golem',    name:'Golem Jr.',        source:'mining',      dropRate:0.0001, bonus:{type:'gatherSpeed', skill:'mining',      value:3}, desc:'A mini golem. +3% Mining speed.'},
  {id:'heron',    name:'Ashen Heron',      source:'fishing',     dropRate:0.0001, bonus:{type:'gatherSpeed', skill:'fishing',     value:3}, desc:'A scarred heron. +3% Fishing speed.'},
  {id:'tangleroot',name:'Tangleroot',      source:'farming',     dropRate:0.0005, bonus:{type:'farmYield', value:15},                       desc:'A walking root. +15% Farming yield.'},
  {id:'squirrel', name:'Char Squirrel',    source:'foraging',    dropRate:0.0001, bonus:{type:'gatherSpeed', skill:'foraging',    value:3}, desc:'A burnt squirrel. +3% Foraging speed.'},
  {id:'raccoon',  name:'Bandit Raccoon',   source:'thieving',    dropRate:0.00015,bonus:{type:'thievingGold', value:10},                    desc:'A sneaky raccoon. +10% Thieving gold.'},
  {id:'phoenix',  name:'Cinderwing',       source:'cooking',     dropRate:0.00008,bonus:{type:'burnReduction', value:5},                    desc:'A tiny phoenix. -5% Burn chance.'},
  {id:'smithy_hammer',name:'Smithy',       source:'smithing',    dropRate:0.0001, bonus:{type:'craftSpeed', skill:'smithing',     value:3}, desc:'A living hammer. +3% Smithing speed.'},
  // Combat pets
  {id:'baby_dragon',name:'Baby Dragon',    source:'dragon',      dropRate:0.002,  bonus:{type:'combatDmg', value:3},                        desc:'A baby dragon. +3% combat damage.'},
  {id:'shadow_imp',name:'Shadow Imp',      source:'demon',       dropRate:0.003,  bonus:{type:'magicDmg', value:5},                         desc:'A shadow imp. +5% magic damage.'},
  {id:'void_wisp',name:'Void Wisp',        source:'void_walker', dropRate:0.005,  bonus:{type:'evasion', value:5},                          desc:'A void wisp. +5% evasion.'},
  {id:'ash_sprite',name:'Ash Sprite',      source:'ashfall_titan',dropRate:0.01,  bonus:{type:'allXp', value:2},                            desc:'An ash sprite. +2% all XP.'},
  // World boss pets
  {id:'blight_pup',name:'Blighted Pup',    source:'blight_warden',dropRate:0.02, bonus:{type:'poisonChance', value:10},                     desc:'A plagued pup. +10% poison chance.'},
  {id:'storm_cub', name:'Storm Cub',       source:'storm_reaver', dropRate:0.015,bonus:{type:'freezeChance', value:10},                     desc:'A storm cub. +10% freeze chance.'},
  {id:'ashen_shade',name:'Ashen Shade',    source:'ashen_overlord',dropRate:0.01,bonus:{type:'burnChance', value:10},                       desc:'An ashen shade. +10% burn chance.'},
  // New monster family pets
  {id:'ashling_pet',name:'Tamed Ashling',  source:'ashling',      dropRate:0.003, bonus:{type:'fireResist', value:5},                       desc:'A tamed ashling. +5% fire resistance.'},
  {id:'frost_sprite',name:'Frost Sprite',  source:'frost_wraith', dropRate:0.003, bonus:{type:'freezeResist', value:5},                     desc:'A frost sprite. +5% freeze resistance.'},
  {id:'blood_pup', name:'Bloodfang Pup',   source:'bloodfang_alpha',dropRate:0.005,bonus:{type:'bleedDmg', value:8},                       desc:'A bloodfang pup. +8% bleed damage.'},
];

// ── SLAYER SYSTEM ────────────────────────────────────────
GAME_DATA.slayerTasks = {
  easy:   {tier:'easy',   name:'Easy',   slayerReq:1,  combatReq:1,  killRange:[15,30],  coinReward:5,  monsters:['chicken','rat','goblin']},
  normal: {tier:'normal', name:'Normal', slayerReq:10, combatReq:15, killRange:[20,40],  coinReward:12, monsters:['skeleton','bandit','wolf']},
  hard:   {tier:'hard',   name:'Hard',   slayerReq:25, combatReq:30, killRange:[30,60],  coinReward:25, monsters:['troll','dark_mage','shadow_archer','ogre','ashling','ember_wraith']},
  elite:  {tier:'elite',  name:'Elite',  slayerReq:45, combatReq:50, killRange:[40,80],  coinReward:50, monsters:['wyvern','demon','frost_wraith','bloodfang_alpha','ash_golem']},
  master: {tier:'master', name:'Master', slayerReq:70, combatReq:75, killRange:[50,120], coinReward:100,monsters:['dragon','void_walker','hollow_lord','frost_drake']},
};

GAME_DATA.slayerShop = [
  {id:'slayer_helm',    name:'Slayer Helm',      cost:500,  type:'equipment', itemId:'slayer_helm',     desc:'A helm that boosts damage vs slayer task targets.'},
  {id:'slayer_ring',    name:'Slayer Ring',       cost:300,  type:'equipment', itemId:'slayer_ring',     desc:'Teleports to slayer task monster areas.'},
  {id:'auto_slayer',    name:'Auto-Slayer',       cost:1000, type:'upgrade',   desc:'Automatically assigns a new task when one is completed.'},
  {id:'task_skip',      name:'Skip Task',         cost:30,   type:'consumable',desc:'Skip your current slayer task.'},
  {id:'task_extend',    name:'Extend Task',       cost:50,   type:'consumable',desc:'Double your current task kill count for +50% coins.'},
  {id:'broad_arrows',   name:'Broad Arrows (100)',cost:100,  type:'item',      itemId:'broad_arrows',   desc:'Arrows effective vs slayer creatures.'},
];

// Slayer items
GAME_DATA.items.slayer_helm = {id:'slayer_helm',name:'Slayer Helm',type:'armor',slot:'head',stats:{attackBonus:3,strengthBonus:3,defenceBonus:10,rangedBonus:3,magicBonus:3,damageReduction:2},levelReq:{defence:10,slayer:20},sellPrice:0,sprite:'helm-iron',desc:'+15% damage and accuracy vs slayer targets.',unique:true,slayerBonus:15};
GAME_DATA.items.slayer_ring = {id:'slayer_ring',name:'Slayer Ring',type:'armor',slot:'ring',stats:{attackBonus:4,strengthBonus:2},levelReq:{slayer:15},sellPrice:0,sprite:'ring-ruby',desc:'+5% Slayer XP.',unique:true,slayerXpBonus:5};
GAME_DATA.items.broad_arrows = {id:'broad_arrows',name:'Broad Arrows',type:'ammo',subtype:'arrow',ammoType:'arrow',rangedBonus:12,sellPrice:5,sprite:'arrow-steel',desc:'Effective vs slayer creatures. +20% damage on task.'};

// ── SPELLBOOKS ───────────────────────────────────────────
GAME_DATA.spellbooks = {
  standard: { id:'standard', name:'Standard', desc:'The basic spellbook.', spellIds: GAME_DATA.spells.map(s=>s.id) },
  pyromancy: {
    id:'pyromancy', name:'Pyromancy', desc:'Fire magic. High damage, Burn effects.', unlockReq:{magic:20},
    color:'#d63a1a',
  },
  cryomancy: {
    id:'cryomancy', name:'Cryomancy', desc:'Ice magic. Control and Freeze effects.', unlockReq:{magic:25},
    color:'#4a9ed4',
  },
  blood_magic: {
    id:'blood_magic', name:'Blood Magic', desc:'Dark healing. Lifesteal and Bleed.', unlockReq:{magic:35},
    color:'#a02a2a',
  },
  void_magic: {
    id:'void_magic', name:'Void Magic', desc:'Forbidden void spells. Devastating but costly.', unlockReq:{magic:55},
    color:'#7a3ac4',
  },
};

// Add new spells for each spellbook
GAME_DATA.pyromancySpells = [
  {id:'ember_bolt',  name:'Ember Bolt',  level:20, maxHit:40,  runes:[{item:'fire_rune',qty:3}],                         desc:'A bolt of embers.',statusChance:{burn:0.35},book:'pyromancy'},
  {id:'flame_wave',  name:'Flame Wave',  level:30, maxHit:65,  runes:[{item:'fire_rune',qty:5}],                         desc:'A wave of fire.',statusChance:{burn:0.50},book:'pyromancy'},
  {id:'inferno',     name:'Inferno',     level:45, maxHit:95,  runes:[{item:'fire_rune',qty:5},{item:'chaos_rune',qty:2}],desc:'Engulf in flame. +3 burn stacks.',statusChance:{burn:0.80},burnStacks:3,book:'pyromancy'},
  {id:'pyroclasm',   name:'Pyroclasm',   level:60, maxHit:130, runes:[{item:'fire_rune',qty:8},{item:'death_rune',qty:2}],desc:'Massive fire explosion.',statusChance:{burn:1.0},burnStacks:5,book:'pyromancy'},
  {id:'solar_flare', name:'Solar Flare', level:75, maxHit:180, runes:[{item:'fire_rune',qty:10},{item:'death_rune',qty:3},{item:'chaos_rune',qty:3}],desc:'Channel the sun itself.',statusChance:{burn:1.0},burnStacks:7,book:'pyromancy'},
];

GAME_DATA.cryomancySpells = [
  {id:'frost_bolt',   name:'Frost Bolt',   level:25, maxHit:35,  runes:[{item:'water_rune',qty:3}],                         desc:'A bolt of ice.',statusChance:{freeze:0.30},book:'cryomancy'},
  {id:'glacial_spike', name:'Glacial Spike',level:35, maxHit:55, runes:[{item:'water_rune',qty:5}],                         desc:'A spike of pure ice.',statusChance:{freeze:0.50},book:'cryomancy'},
  {id:'blizzard',     name:'Blizzard',     level:50, maxHit:85,  runes:[{item:'water_rune',qty:5},{item:'air_rune',qty:3}], desc:'An ice storm.',statusChance:{freeze:0.70},freezeStacks:3,book:'cryomancy'},
  {id:'absolute_zero',name:'Absolute Zero',level:65, maxHit:120, runes:[{item:'water_rune',qty:8},{item:'death_rune',qty:2}],desc:'Freeze reality.',statusChance:{freeze:1.0},freezeStacks:5,book:'cryomancy'},
  {id:'permafrost',   name:'Permafrost',   level:80, maxHit:160, runes:[{item:'water_rune',qty:10},{item:'death_rune',qty:3}],desc:'Eternal ice imprisonment.',statusChance:{freeze:1.0},freezeStacks:8,book:'cryomancy'},
];

GAME_DATA.bloodMagicSpells = [
  {id:'blood_bolt',   name:'Blood Bolt',   level:35, maxHit:45,  runes:[{item:'death_rune',qty:1},{item:'chaos_rune',qty:1}],desc:'Drains life. Heals 25% of damage.',lifesteal:0.25,book:'blood_magic'},
  {id:'sanguine_burst',name:'Sanguine Burst',level:45,maxHit:70, runes:[{item:'death_rune',qty:2},{item:'chaos_rune',qty:2}],desc:'Blood explosion. Heals 30%, applies Bleed.',lifesteal:0.30,statusChance:{bleed:0.50},book:'blood_magic'},
  {id:'hemorrhage',   name:'Hemorrhage',   level:55, maxHit:90,  runes:[{item:'death_rune',qty:3},{item:'chaos_rune',qty:2}],desc:'Massive bleed. 5 stacks.',statusChance:{bleed:1.0},bleedStacks:5,lifesteal:0.20,book:'blood_magic'},
  {id:'blood_pact',   name:'Blood Pact',   level:70, maxHit:130, runes:[{item:'death_rune',qty:5},{item:'chaos_rune',qty:3}],desc:'Sacrifice 10% HP for massive damage + full heal on kill.',lifesteal:0.40,selfDmg:0.10,book:'blood_magic'},
  {id:'crimson_tide',  name:'Crimson Tide', level:85, maxHit:200, runes:[{item:'death_rune',qty:8},{item:'chaos_rune',qty:5}],desc:'A tide of blood. Heals 50%, Bleed 7 stacks.',lifesteal:0.50,statusChance:{bleed:1.0},bleedStacks:7,book:'blood_magic'},
];

GAME_DATA.voidMagicSpells = [
  {id:'void_bolt',    name:'Void Bolt',    level:55, maxHit:70,  runes:[{item:'death_rune',qty:2},{item:'chaos_rune',qty:2}],desc:'A bolt from the void.',statusChance:{poison:0.30},book:'void_magic'},
  {id:'null_wave',    name:'Null Wave',    level:65, maxHit:100, runes:[{item:'death_rune',qty:3},{item:'chaos_rune',qty:3}],desc:'Reality warps. Ignores 30% defence.',defIgnore:0.30,book:'void_magic'},
  {id:'entropy_blast',name:'Entropy Blast',level:75, maxHit:140, runes:[{item:'death_rune',qty:5},{item:'chaos_rune',qty:4}],desc:'Entropy consumes. All status 2 stacks.',statusChance:{burn:0.5,poison:0.5,freeze:0.5,bleed:0.5},book:'void_magic'},
  {id:'dimensional_rift',name:'Dimensional Rift',level:85,maxHit:180,runes:[{item:'death_rune',qty:7},{item:'chaos_rune',qty:5}],desc:'Open a rift. Deals HP% damage.',hpPercent:0.10,book:'void_magic'},
  {id:'oblivion',     name:'Oblivion',     level:95, maxHit:250, runes:[{item:'death_rune',qty:10},{item:'chaos_rune',qty:8}],desc:'Erase from existence. Highest void damage.',statusChance:{burn:1.0,poison:1.0},burnStacks:3,book:'void_magic'},
];

// ── NEW MONSTER FAMILIES ─────────────────────────────────
// Ashborn family
GAME_DATA.monsters.ashling = {id:'ashling',name:'Ashling',hp:180,maxHit:20,attackSpeed:2.4,combatLevel:12,style:'magic',evasion:{melee:15,ranged:10,magic:20},xp:1280,gold:{min:5,max:15},alignment:'CN',family:'ashborn',drops:[{item:'ash_bones',qty:1,chance:0.60},{item:'fire_rune',qty:3,chance:0.30},{item:'bones',qty:1,chance:1.0}],weakness:'frost'};
GAME_DATA.monsters.ember_wraith = {id:'ember_wraith',name:'Ember Wraith',hp:400,maxHit:38,attackSpeed:2.2,combatLevel:30,style:'magic',evasion:{melee:25,ranged:20,magic:40},xp:800,gold:{min:15,max:50},alignment:'CE',family:'ashborn',drops:[{item:'ash_bones',qty:1,chance:0.80},{item:'fire_rune',qty:5,chance:0.25},{item:'chaos_rune',qty:2,chance:0.15}],weakness:'frost'};
GAME_DATA.monsters.ash_golem = {id:'ash_golem',name:'Ash Golem',hp:800,maxHit:60,attackSpeed:2.8,combatLevel:45,style:'melee',evasion:{melee:50,ranged:45,magic:30},xp:1440,gold:{min:30,max:100},alignment:'NN',family:'ashborn',drops:[{item:'ash_bones',qty:2,chance:1.0},{item:'obsidian_ore',qty:2,chance:0.12},{item:'big_bones',qty:1,chance:0.50}],weakness:'frost'};

// Hollowed family
GAME_DATA.monsters.hollow_soldier = {id:'hollow_soldier',name:'Hollow Soldier',hp:250,maxHit:25,attackSpeed:2.4,combatLevel:18,style:'melee',evasion:{melee:22,ranged:18,magic:12},xp:1792,gold:{min:8,max:25},alignment:'NE',family:'hollowed',drops:[{item:'bones',qty:1,chance:1.0},{item:'iron_sword',qty:1,chance:0.08},{item:'leather',qty:1,chance:0.25}]};
GAME_DATA.monsters.hollow_knight = {id:'hollow_knight',name:'Hollow Knight',hp:550,maxHit:45,attackSpeed:2.6,combatLevel:38,style:'melee',evasion:{melee:40,ranged:35,magic:20},xp:1040,gold:{min:20,max:70},alignment:'NE',family:'hollowed',drops:[{item:'big_bones',qty:1,chance:1.0},{item:'steel_plate',qty:1,chance:0.05},{item:'mithril_sword',qty:1,chance:0.03}]};
GAME_DATA.monsters.hollow_lord = {id:'hollow_lord',name:'Hollow Lord',hp:1200,maxHit:80,attackSpeed:2.4,combatLevel:65,style:'melee',evasion:{melee:65,ranged:60,magic:40},xp:2880,gold:{min:60,max:200},alignment:'NE',family:'hollowed',drops:[{item:'big_bones',qty:2,chance:1.0},{item:'adamant_plate',qty:1,chance:0.05},{item:'obsidian_sword',qty:1,chance:0.02}]};

// Frostwraith family
GAME_DATA.monsters.frost_spirit = {id:'frost_spirit',name:'Frost Spirit',hp:300,maxHit:28,attackSpeed:2.2,combatLevel:22,style:'magic',evasion:{melee:18,ranged:15,magic:35},xp:560,gold:{min:10,max:35},alignment:'CN',family:'frostwraith',drops:[{item:'frost_bones',qty:1,chance:0.70},{item:'water_rune',qty:5,chance:0.30},{item:'bones',qty:1,chance:1.0}],weakness:'fire'};
GAME_DATA.monsters.frost_wraith = {id:'frost_wraith',name:'Frost Wraith',hp:650,maxHit:50,attackSpeed:2.0,combatLevel:42,style:'magic',evasion:{melee:30,ranged:25,magic:55},xp:1280,gold:{min:25,max:80},alignment:'CE',family:'frostwraith',drops:[{item:'frost_bones',qty:1,chance:1.0},{item:'water_rune',qty:8,chance:0.20},{item:'chaos_rune',qty:3,chance:0.15}],weakness:'fire'};
GAME_DATA.monsters.frost_drake = {id:'frost_drake',name:'Frost Drake',hp:1800,maxHit:100,attackSpeed:2.4,combatLevel:72,style:'ranged',evasion:{melee:55,ranged:70,magic:45},xp:3520,gold:{min:80,max:300},alignment:'CN',family:'frostwraith',drops:[{item:'frost_bones',qty:2,chance:1.0},{item:'dragon_hide',qty:1,chance:0.30},{item:'dragon_bones',qty:1,chance:0.50}],weakness:'fire'};

// Bloodfang family
GAME_DATA.monsters.bloodfang_wolf = {id:'bloodfang_wolf',name:'Bloodfang Wolf',hp:350,maxHit:30,attackSpeed:2.0,combatLevel:25,style:'melee',evasion:{melee:28,ranged:22,magic:15},xp:608,gold:{min:10,max:40},alignment:'CE',family:'bloodfang',drops:[{item:'bones',qty:1,chance:1.0},{item:'wolf_pelt',qty:1,chance:0.50},{item:'leather',qty:2,chance:0.30}]};
GAME_DATA.monsters.razorback = {id:'razorback',name:'Razorback',hp:600,maxHit:52,attackSpeed:2.4,combatLevel:40,style:'melee',evasion:{melee:38,ranged:32,magic:20},xp:1152,gold:{min:20,max:65},alignment:'CE',family:'bloodfang',drops:[{item:'big_bones',qty:1,chance:1.0},{item:'hard_leather',qty:1,chance:0.30},{item:'bear_pelt',qty:1,chance:0.20}]};
GAME_DATA.monsters.bloodfang_alpha = {id:'bloodfang_alpha',name:'Bloodfang Alpha',hp:1400,maxHit:95,attackSpeed:2.2,combatLevel:68,style:'melee',evasion:{melee:60,ranged:55,magic:35},xp:3040,gold:{min:60,max:250},alignment:'CE',family:'bloodfang',drops:[{item:'big_bones',qty:2,chance:1.0},{item:'dragon_hide',qty:1,chance:0.15},{item:'wyvern_scale',qty:2,chance:0.20}]};

// ── NEW COMBAT AREAS ─────────────────────────────────────
GAME_DATA.combatAreas.push(
  {id:'ashen_wastes',  name:'The Ashen Wastes',  monsters:['ashling','ember_wraith','ash_golem'],         levelReq:12, desc:'Scorched earth where Ashborn creatures dwell.',family:'ashborn'},
  {id:'hollow_ruins',  name:'Hollow Ruins',      monsters:['hollow_soldier','hollow_knight','hollow_lord'],levelReq:18, desc:'Crumbling ruins haunted by hollow warriors.',family:'hollowed'},
  {id:'frozen_reach',  name:'The Frozen Reach',  monsters:['frost_spirit','frost_wraith','frost_drake'],  levelReq:22, desc:'A permafrost wasteland of ice creatures.',family:'frostwraith'},
  {id:'bloodfang_den', name:'Bloodfang Den',     monsters:['bloodfang_wolf','razorback','bloodfang_alpha'],levelReq:25, desc:'The lair of the savage Bloodfang pack.',family:'bloodfang'},
);

// ── NEW DUNGEONS ─────────────────────────────────────────
GAME_DATA.dungeons.push(
  {id:'ashen_depths',  name:'Ashen Depths',   waves:['ashling','ashling','ember_wraith','ember_wraith','ash_golem','ash_golem'],levelReq:30,rewards:[{item:'obsidian_ore',qty:5,chance:0.40},{item:'ash_bones',qty:3,chance:0.60}],desc:'Deep into the ash vents.'},
  {id:'frozen_tomb',   name:'The Frozen Tomb', waves:['frost_spirit','frost_spirit','frost_wraith','frost_wraith','frost_drake'],levelReq:50,rewards:[{item:'frost_bones',qty:5,chance:0.50},{item:'diamond',qty:2,chance:0.20},{item:'elder_staff',qty:1,chance:0.03}],desc:'An ancient tomb sealed in ice.'},
  {id:'bloodfang_arena',name:'Bloodfang Arena',waves:['bloodfang_wolf','bloodfang_wolf','razorback','razorback','bloodfang_alpha','bloodfang_alpha'],levelReq:55,rewards:[{item:'dragon_hide',qty:2,chance:0.30},{item:'obsidian_bar',qty:3,chance:0.20},{item:'bloodfang_cleaver',qty:1,chance:0.04}],desc:'Fight for honor in the bloodpits.'},
  {id:'hollow_citadel', name:'Hollow Citadel', waves:['hollow_soldier','hollow_soldier','hollow_knight','hollow_knight','hollow_lord','hollow_lord','hollow_lord'],levelReq:65,rewards:[{item:'adamant_plate',qty:1,chance:0.15},{item:'obsidian_plate',qty:1,chance:0.08},{item:'ancient_ring',qty:1,chance:0.03}],desc:'The throne room of the Hollow Lord.'},
);

// ── MORE NPCs ────────────────────────────────────────────
GAME_DATA.npcs.push(
  {id:'greybeard',  name:'Greybeard',       faction:null,           title:'Hermit Sage',     desc:'A wise hermit who teaches prayer.',  location:'Ashfall Monastery'},
  {id:'vex',        name:'Vex the Tracker',  faction:'bloodfang_clan',title:'Slayer Master',  desc:'Assigns slayer tasks. Respects skill.',location:'The Hunting Grounds'},
  {id:'lyra',       name:'Lyra Frostweaver', faction:'veiled_circle', title:'Cryomancer',     desc:'A mage who studies ice magic.',        location:'Frozen Spire'},
  {id:'tormund',    name:'Tormund Ashborn',  faction:null,           title:'Ashborn Scholar', desc:'Studies the creatures of the ash.',    location:'Ashen Wastes Camp'},
  {id:'elena',      name:'Elena Brightshield',faction:'silver_order', title:'Knight Captain', desc:'Defends the realm from the hollow.',  location:'Hollow Watch'},
  {id:'morrigan',   name:'Morrigan',         faction:'veiled_circle', title:'Blood Mage',     desc:'An outcast practicing blood magic.',  location:'The Crimson Library'},
  {id:'dorn',       name:'Dorn Ironfist',    faction:'ashen_guild',   title:'Blacksmith Elder',desc:'Master smith with ancient knowledge.',location:'The Great Forge'},
);

// ── MORE QUESTS ──────────────────────────────────────────
GAME_DATA.quests.push(
  // Greybeard quest chain — Prayer introduction
  {id:'grey_1',npc:'greybeard',name:'The Way of Prayer',desc:'Bury 20 bones at the monastery.',objectives:[{type:'bury_bones',qty:20}],rewards:{gold:100,xp:{prayer:200}},prereq:null},
  {id:'grey_2',npc:'greybeard',name:'Stronger Faith',desc:'Bury 10 big bones.',objectives:[{type:'bury_big_bones',qty:10}],rewards:{gold:300,xp:{prayer:500}},prereq:'grey_1'},
  {id:'grey_3',npc:'greybeard',name:'Dragon Devotion',desc:'Bury 5 dragon bones.',objectives:[{type:'bury_dragon_bones',qty:5}],rewards:{gold:1000,xp:{prayer:2000}},prereq:'grey_2'},
  {id:'grey_4',npc:'greybeard',name:'Piety of Ash',desc:'Reach Prayer level 43.',objectives:[{type:'skill_level',skill:'prayer',level:43}],rewards:{gold:2000,xp:{prayer:5000}},prereq:'grey_3'},

  // Vex quest chain — Slayer introduction
  {id:'vex_1',npc:'vex',name:'First Assignment',desc:'Complete 3 slayer tasks.',objectives:[{type:'slayer_tasks',qty:3}],rewards:{gold:200,xp:{slayer:300}},prereq:null},
  {id:'vex_2',npc:'vex',name:'Proving Your Worth',desc:'Complete 10 slayer tasks.',objectives:[{type:'slayer_tasks',qty:10}],rewards:{gold:800,xp:{slayer:1000}},prereq:'vex_1'},
  {id:'vex_3',npc:'vex',name:'Slayer of Beasts',desc:'Kill 100 monsters on slayer tasks.',objectives:[{type:'slayer_kills',qty:100}],rewards:{gold:1500,xp:{slayer:2500}},prereq:'vex_2'},
  {id:'vex_4',npc:'vex',name:'Master Slayer',desc:'Reach Slayer level 50.',objectives:[{type:'skill_level',skill:'slayer',level:50}],rewards:{gold:5000,xp:{slayer:5000},items:[{item:'slayer_helm',qty:1}]},prereq:'vex_3'},

  // Lyra quest chain — Cryomancy
  {id:'lyra_1',npc:'lyra',name:'Ice Affinity',desc:'Kill 15 Frost Spirits.',objectives:[{type:'kill',monster:'frost_spirit',qty:15}],rewards:{gold:400,xp:{magic:600},rep:{veiled_circle:300}},prereq:null,faction:'veiled_circle'},
  {id:'lyra_2',npc:'lyra',name:'Frozen Knowledge',desc:'Collect 50 water runes.',objectives:[{type:'gather',item:'water_rune',qty:50}],rewards:{gold:800,xp:{magic:1200},rep:{veiled_circle:500}},prereq:'lyra_1'},
  {id:'lyra_3',npc:'lyra',name:'Wraith Hunter',desc:'Kill 5 Frost Wraiths.',objectives:[{type:'kill',monster:'frost_wraith',qty:5}],rewards:{gold:1500,xp:{magic:2500},rep:{veiled_circle:800}},prereq:'lyra_2'},
  {id:'lyra_4',npc:'lyra',name:'Drake Slayer',desc:'Kill a Frost Drake.',objectives:[{type:'kill',monster:'frost_drake',qty:1}],rewards:{gold:3000,xp:{magic:5000},rep:{veiled_circle:1500}},prereq:'lyra_3'},

  // Tormund quest chain — Ashborn creatures
  {id:'tor_1',npc:'tormund',name:'Ash Samples',desc:'Kill 20 Ashlings.',objectives:[{type:'kill',monster:'ashling',qty:20}],rewards:{gold:300,xp:{attack:400,magic:400}},prereq:null},
  {id:'tor_2',npc:'tormund',name:'Ember Study',desc:'Kill 10 Ember Wraiths.',objectives:[{type:'kill',monster:'ember_wraith',qty:10}],rewards:{gold:600,xp:{magic:800}},prereq:'tor_1'},
  {id:'tor_3',npc:'tormund',name:'Golem Core',desc:'Kill 3 Ash Golems.',objectives:[{type:'kill',monster:'ash_golem',qty:3}],rewards:{gold:1200,xp:{strength:1500,defence:1000}},prereq:'tor_2'},
  {id:'tor_4',npc:'tormund',name:'Ashborn Codex',desc:'Complete the Ashen Depths dungeon.',objectives:[{type:'dungeon',dungeon:'ashen_depths',qty:1}],rewards:{gold:2500,xp:{attack:3000,magic:3000}},prereq:'tor_3'},

  // Elena quest chain — Hollow creatures
  {id:'elena_1',npc:'elena',name:'Hollow Patrol',desc:'Kill 20 Hollow Soldiers.',objectives:[{type:'kill',monster:'hollow_soldier',qty:20}],rewards:{gold:400,xp:{attack:500,defence:500},rep:{silver_order:300}},prereq:null,faction:'silver_order'},
  {id:'elena_2',npc:'elena',name:'Knight Fall',desc:'Kill 10 Hollow Knights.',objectives:[{type:'kill',monster:'hollow_knight',qty:10}],rewards:{gold:1000,xp:{attack:1200,defence:800},rep:{silver_order:500}},prereq:'elena_1'},
  {id:'elena_3',npc:'elena',name:'Lord of Hollows',desc:'Kill 3 Hollow Lords.',objectives:[{type:'kill',monster:'hollow_lord',qty:3}],rewards:{gold:2500,xp:{attack:3000,defence:2000},rep:{silver_order:1000}},prereq:'elena_2'},
  {id:'elena_4',npc:'elena',name:'Citadel Siege',desc:'Complete the Hollow Citadel dungeon.',objectives:[{type:'dungeon',dungeon:'hollow_citadel',qty:1}],rewards:{gold:5000,xp:{attack:5000,strength:3000,defence:3000},rep:{silver_order:2000}},prereq:'elena_3'},

  // Morrigan quest chain — Blood Magic
  {id:'morr_1',npc:'morrigan',name:'Blood Harvest',desc:'Collect 30 death runes.',objectives:[{type:'gather',item:'death_rune',qty:30}],rewards:{gold:500,xp:{magic:800}},prereq:null},
  {id:'morr_2',npc:'morrigan',name:'Crimson Practice',desc:'Kill 20 creatures using magic.',objectives:[{type:'magic_kills',qty:20}],rewards:{gold:800,xp:{magic:1500}},prereq:'morr_1'},
  {id:'morr_3',npc:'morrigan',name:'Blood Pact Ritual',desc:'Collect 50 chaos runes and 30 death runes.',objectives:[{type:'gather',item:'chaos_rune',qty:50},{type:'gather',item:'death_rune',qty:30}],rewards:{gold:2000,xp:{magic:3000}},prereq:'morr_2'},
  {id:'morr_4',npc:'morrigan',name:'The Crimson Tide',desc:'Kill a Demon using blood magic.',objectives:[{type:'kill',monster:'demon',qty:1}],rewards:{gold:4000,xp:{magic:5000}},prereq:'morr_3'},

  // Dorn quest chain — Smithing mastery
  {id:'dorn_1',npc:'dorn',name:'Bulk Iron',desc:'Smith 30 iron bars.',objectives:[{type:'craft',item:'iron_bar',qty:30}],rewards:{gold:300,xp:{smithing:400},rep:{ashen_guild:200}},prereq:null,faction:'ashen_guild'},
  {id:'dorn_2',npc:'dorn',name:'Steel Mastery',desc:'Smith 20 steel swords.',objectives:[{type:'craft',item:'steel_sword',qty:20}],rewards:{gold:800,xp:{smithing:1200},rep:{ashen_guild:400}},prereq:'dorn_1'},
  {id:'dorn_3',npc:'dorn',name:'Mithril Challenge',desc:'Smith 10 mithril platebodies.',objectives:[{type:'craft',item:'mithril_plate',qty:10}],rewards:{gold:2000,xp:{smithing:3000},rep:{ashen_guild:700}},prereq:'dorn_2'},
  {id:'dorn_4',npc:'dorn',name:'The Ashsteel Secret',desc:'Reach Smithing level 70 and smith 5 obsidian bars.',objectives:[{type:'skill_level',skill:'smithing',level:70},{type:'craft',item:'obsidian_bar',qty:5}],rewards:{gold:5000,xp:{smithing:5000},rep:{ashen_guild:1500}},prereq:'dorn_3'},
);

// ── MORE ACHIEVEMENTS ────────────────────────────────────
GAME_DATA.achievements.push(
  {id:'prayer_10',     name:'Faithful',       desc:'Reach Prayer level 10.',    check:(g)=>g.skills.prayer&&g.skills.prayer.level>=10},
  {id:'prayer_43',     name:'Protected',      desc:'Reach Prayer level 43.',    check:(g)=>g.skills.prayer&&g.skills.prayer.level>=43},
  {id:'slayer_10',     name:'Task Hunter',    desc:'Reach Slayer level 10.',    check:(g)=>g.skills.slayer&&g.skills.slayer.level>=10},
  {id:'slayer_50',     name:'Beast Slayer',   desc:'Reach Slayer level 50.',    check:(g)=>g.skills.slayer&&g.skills.slayer.level>=50},
  {id:'first_pet',     name:'Pet Collector',  desc:'Obtain your first pet.',    check:(g)=>(g.pets||[]).length>=1},
  {id:'five_pets',     name:'Menagerie',      desc:'Collect 5 pets.',           check:(g)=>(g.pets||[]).length>=5},
  {id:'ten_quests',    name:'Questmaster',    desc:'Complete 10 quests.',       check:(g)=>(g.quests?.completed?.length||0)>=10},
  {id:'twenty_quests', name:'Lorekeeper',     desc:'Complete 20 quests.',       check:(g)=>(g.quests?.completed?.length||0)>=20},
  {id:'all_families',  name:'Bestiary',       desc:'Kill one of each monster family.',check:(g)=>{const u=g.stats.uniqueKills||{};return u.ashling&&u.hollow_soldier&&u.frost_spirit&&u.bloodfang_wolf;}},
  {id:'slay_100_tasks',name:'Professional',   desc:'Complete 100 slayer tasks.',check:(g)=>(g.stats.slayerTasksCompleted||0)>=100},
);

// ── PVP LOOT TABLE ───────────────────────────────────────
GAME_DATA.pvpLoot = [
  {item:'potion_healing_ii', qty:3, chance:0.40, minLevel:1},
  {item:'potion_strength',   qty:2, chance:0.25, minLevel:10},
  {item:'potion_defence',    qty:2, chance:0.25, minLevel:10},
  {item:'chaos_rune',        qty:10,chance:0.30, minLevel:15},
  {item:'death_rune',        qty:5, chance:0.20, minLevel:30},
  {item:'steel_arrows',      qty:30,chance:0.30, minLevel:10},
  {item:'mithril_arrows',    qty:15,chance:0.20, minLevel:25},
  {item:'ruby',              qty:1, chance:0.10, minLevel:20},
  {item:'emerald',           qty:1, chance:0.08, minLevel:30},
  {item:'diamond',           qty:1, chance:0.05, minLevel:45},
  {item:'mithril_bar',       qty:3, chance:0.12, minLevel:30},
  {item:'adamant_bar',       qty:2, chance:0.08, minLevel:45},
  {item:'obsidian_bar',      qty:1, chance:0.04, minLevel:60},
  {item:'enchant_scroll',    qty:1, chance:0.06, minLevel:40},
  {item:'dragon_bones',      qty:2, chance:0.10, minLevel:50},
];

// ── NECROMANCY SPELLBOOK ─────────────────────────────────
GAME_DATA.spellbooks.necromancy = {
  id:'necromancy', name:'Necromancy', desc:'Dark arts. Drain life, curse enemies, raise undead.', unlockReq:{necromancy:1,magic:20},
  color:'#5a2a5a',
};

GAME_DATA.necromancySpells = [
  {id:'soul_siphon',  name:'Soul Siphon',  level:1,  maxHit:30,  runes:[{item:'death_rune',qty:1}],                         desc:'Drain life. Heal 20% dealt.',lifesteal:0.20,book:'necromancy'},
  {id:'bone_spike',   name:'Bone Spike',   level:10, maxHit:50,  runes:[{item:'death_rune',qty:2}],                         desc:'Hurl bone shards.',statusChance:{bleed:0.30},book:'necromancy'},
  {id:'wither',       name:'Wither',       level:20, maxHit:40,  runes:[{item:'death_rune',qty:2},{item:'chaos_rune',qty:1}],desc:'Wither target. Poison 3 stacks.',statusChance:{poison:0.80},book:'necromancy'},
  {id:'dark_pact',    name:'Dark Pact',    level:35, maxHit:90,  runes:[{item:'death_rune',qty:3},{item:'chaos_rune',qty:2}],desc:'Sacrifice 5% HP for big damage + heal on kill.',selfDmg:0.05,lifesteal:0.35,book:'necromancy'},
  {id:'corpse_explosion',name:'Corpse Explosion',level:50,maxHit:120,runes:[{item:'death_rune',qty:5},{item:'chaos_rune',qty:3}],desc:'Detonate nearby corpses. AOE damage.',statusChance:{burn:0.40,bleed:0.40},book:'necromancy'},
  {id:'raise_dead',   name:'Raise Dead',   level:65, maxHit:80,  runes:[{item:'death_rune',qty:4},{item:'chaos_rune',qty:4}],desc:'Summon skeleton ally for 30s. Attacks every 3s.',buff:{stat:'summonDmg',value:25,duration:30},book:'necromancy'},
  {id:'death_mark',   name:'Death Mark',   level:80, maxHit:160, runes:[{item:'death_rune',qty:8},{item:'chaos_rune',qty:5}],desc:'Mark target for death. All damage +30% for 10s.',statusChance:{burn:0.5,poison:0.5,bleed:0.5},buff:{stat:'damageMult',value:1.3,duration:10},book:'necromancy'},
  {id:'reaper',       name:'Reaper',       level:95, maxHit:220, runes:[{item:'death_rune',qty:12},{item:'chaos_rune',qty:8}],desc:'Channel the Reaper. Devastating dark damage.',statusChance:{poison:1.0,bleed:1.0},lifesteal:0.40,book:'necromancy'},
];

// Add necromancy to spellbook getSpellsForActiveBook map (handled in engine)

// ── MONSTER SVG ART ──────────────────────────────────────
// Detailed SVG silhouettes for each monster rendered in combat
GAME_DATA.monsterArt = {
  chicken:     '<svg viewBox="0 0 80 80"><ellipse cx="40" cy="50" rx="18" ry="14" fill="#d4a83a"/><circle cx="40" cy="34" r="10" fill="#d4a83a"/><polygon points="40,28 44,32 36,32" fill="#c44040"/><circle cx="37" cy="32" r="1.5" fill="#1a1a1f"/><polygon points="48,34 56,36 48,38" fill="#d4a83a"/><path d="M30 62 L28 72 L32 72 L34 62" fill="#c47a3a"/><path d="M46 62 L44 72 L48 72 L50 62" fill="#c47a3a"/></svg>',
  rat:         '<svg viewBox="0 0 80 80"><ellipse cx="40" cy="48" rx="22" ry="12" fill="#5a4a3a"/><circle cx="58" cy="42" r="8" fill="#5a4a3a"/><circle cx="56" cy="40" r="1.5" fill="#c44040"/><circle cx="60" cy="40" r="1.5" fill="#c44040"/><path d="M64 42 Q72 40 68 38" fill="none" stroke="#7a5a3a" stroke-width="1"/><path d="M64 44 Q72 44 68 42" fill="none" stroke="#7a5a3a" stroke-width="1"/><path d="M18 48 Q8 44 4 50 Q8 52 18 48" fill="#5a4a3a"/><ellipse cx="54" cy="34" rx="4" ry="6" fill="#6a5a4a"/></svg>',
  goblin:      '<svg viewBox="0 0 80 80"><rect x="30" y="40" width="20" height="24" rx="4" fill="#5a8a3e"/><circle cx="40" cy="34" r="12" fill="#5a8a3e"/><circle cx="36" cy="32" r="2" fill="#c44040"/><circle cx="44" cy="32" r="2" fill="#c44040"/><path d="M36 38 Q40 42 44 38" fill="none" stroke="#3a5a1a" stroke-width="1.5"/><polygon points="28,28 32,20 36,30" fill="#5a8a3e"/><polygon points="52,28 48,20 44,30" fill="#5a8a3e"/><rect x="50" y="36" width="16" height="3" rx="1" fill="#7a8294"/><path d="M28 62 L26 72 L32 72" fill="#3a5a1a"/><path d="M52 62 L54 72 L48 72" fill="#3a5a1a"/></svg>',
  skeleton:    '<svg viewBox="0 0 80 80"><rect x="36" y="36" width="8" height="28" fill="#e8e0d4"/><circle cx="40" cy="28" r="12" fill="#e8e0d4"/><circle cx="36" cy="26" r="3" fill="#1a1a1f"/><circle cx="44" cy="26" r="3" fill="#1a1a1f"/><path d="M36 34 L40 36 L44 34" fill="none" stroke="#1a1a1f" stroke-width="1"/><path d="M32 40 L20 36" stroke="#e8e0d4" stroke-width="3"/><path d="M48 40 L60 36" stroke="#e8e0d4" stroke-width="3"/><path d="M36 64 L34 74 L38 74" fill="#e8e0d4"/><path d="M44 64 L46 74 L42 74" fill="#e8e0d4"/><rect x="36" y="44" width="8" height="2" fill="#c4b8a4"/><rect x="36" y="50" width="8" height="2" fill="#c4b8a4"/></svg>',
  bandit:      '<svg viewBox="0 0 80 80"><rect x="32" y="38" width="16" height="26" rx="3" fill="#5a3a2a"/><circle cx="40" cy="28" r="11" fill="#c4a87a"/><rect x="28" y="20" width="24" height="6" rx="2" fill="#3a2a1a"/><circle cx="36" cy="28" r="1.5" fill="#1a1a1f"/><circle cx="44" cy="28" r="1.5" fill="#1a1a1f"/><rect x="34" y="32" width="12" height="3" rx="1" fill="#2a1a1a"/><path d="M48 42 L62 34" stroke="#7a8294" stroke-width="2.5"/><polygon points="62,34 66,30 64,38" fill="#7a8294"/><path d="M32 64 L30 74" stroke="#3a2a1a" stroke-width="4"/><path d="M48 64 L50 74" stroke="#3a2a1a" stroke-width="4"/></svg>',
  wolf:        '<svg viewBox="0 0 80 80"><ellipse cx="36" cy="48" rx="22" ry="14" fill="#5a5a5a"/><circle cx="56" cy="38" r="10" fill="#5a5a5a"/><circle cx="54" cy="36" r="2" fill="#c4a83a"/><circle cx="60" cy="36" r="2" fill="#c4a83a"/><path d="M62 42 L68 42" fill="none" stroke="#5a5a5a" stroke-width="1.5"/><polygon points="50,30 48,22 52,28" fill="#5a5a5a"/><polygon points="58,30 60,22 56,28" fill="#5a5a5a"/><path d="M14 48 Q6 44 8 52" fill="#5a5a5a"/><path d="M24 60 L22 70" stroke="#3a3a3a" stroke-width="3"/><path d="M48 60 L46 70" stroke="#3a3a3a" stroke-width="3"/></svg>',
  troll:       '<svg viewBox="0 0 80 80"><rect x="26" y="32" width="28" height="34" rx="6" fill="#6a7a5a"/><circle cx="40" cy="22" r="14" fill="#6a7a5a"/><circle cx="34" cy="20" r="3" fill="#c44040"/><circle cx="46" cy="20" r="3" fill="#c44040"/><path d="M34 30 Q40 34 46 30" fill="none" stroke="#3a4a2a" stroke-width="2"/><rect x="34" y="28" width="3" height="4" fill="#e8e0d4"/><rect x="43" y="28" width="3" height="4" fill="#e8e0d4"/><path d="M54 40 L68 32" stroke="#5a3a1a" stroke-width="4" stroke-linecap="round"/><path d="M24 64 L20 76" stroke="#4a5a3a" stroke-width="5"/><path d="M56 64 L60 76" stroke="#4a5a3a" stroke-width="5"/></svg>',
  dragon:      '<svg viewBox="0 0 80 80"><ellipse cx="40" cy="50" rx="24" ry="16" fill="#5a8a3e"/><circle cx="56" cy="32" r="12" fill="#5a8a3e"/><circle cx="54" cy="30" r="2.5" fill="#c4a83a"/><circle cx="60" cy="30" r="2.5" fill="#c4a83a"/><path d="M64 36 L70 34" fill="none" stroke="#5a8a3e" stroke-width="2"/><polygon points="48,22 44,12 50,18" fill="#5a8a3e"/><polygon points="58,22 62,12 56,18" fill="#5a8a3e"/><path d="M24 38 Q8 24 12 38 Q4 34 16 44" fill="#4a7a2e" opacity="0.8"/><path d="M56 38 Q72 24 68 38 Q76 34 64 44" fill="#4a7a2e" opacity="0.8"/><path d="M16 50 Q6 48 8 56" fill="#5a8a3e"/><polygon points="60,36 66,38 64,34" fill="#e8e0d4"/></svg>',
  demon:       '<svg viewBox="0 0 80 80"><rect x="28" y="32" width="24" height="30" rx="4" fill="#8a2a2a"/><circle cx="40" cy="24" r="12" fill="#8a2a2a"/><circle cx="36" cy="22" r="2.5" fill="#d63a1a"/><circle cx="44" cy="22" r="2.5" fill="#d63a1a"/><path d="M36 30 Q40 34 44 30" fill="none" stroke="#5a1a1a" stroke-width="2"/><polygon points="30,16 26,6 34,14" fill="#5a1a1a"/><polygon points="50,16 54,6 46,14" fill="#5a1a1a"/><path d="M22 38 Q10 30 14 42" fill="#6a1a1a" opacity="0.8"/><path d="M58 38 Q70 30 66 42" fill="#6a1a1a" opacity="0.8"/><path d="M36 60 Q34 68 40 72 Q46 68 44 60" fill="#8a2a2a"/></svg>',
  void_walker: '<svg viewBox="0 0 80 80"><ellipse cx="40" cy="44" rx="18" ry="26" fill="#3a1a5a" opacity="0.8"/><circle cx="40" cy="28" r="10" fill="#5a2a8a"/><circle cx="37" cy="26" r="3" fill="#b585e0"/><circle cx="43" cy="26" r="3" fill="#b585e0"/><circle cx="37" cy="26" r="1" fill="#fff"/><circle cx="43" cy="26" r="1" fill="#fff"/><path d="M20 44 Q10 38 16 50" fill="#3a1a5a" opacity="0.6"/><path d="M60 44 Q70 38 64 50" fill="#3a1a5a" opacity="0.6"/><circle cx="24" cy="36" r="2" fill="#b585e0" opacity="0.4"/><circle cx="56" cy="40" r="1.5" fill="#b585e0" opacity="0.3"/><circle cx="32" cy="60" r="1" fill="#b585e0" opacity="0.5"/></svg>',
  ashfall_titan:'<svg viewBox="0 0 80 80"><rect x="22" y="20" width="36" height="46" rx="8" fill="#3a1a0a"/><circle cx="40" cy="14" r="14" fill="#3a1a0a"/><circle cx="34" cy="12" r="3.5" fill="#d63a1a"/><circle cx="46" cy="12" r="3.5" fill="#d63a1a"/><circle cx="34" cy="12" r="1.5" fill="#ff8040"/><circle cx="46" cy="12" r="1.5" fill="#ff8040"/><path d="M34 22 Q40 26 46 22" fill="none" stroke="#d63a1a" stroke-width="2"/><path d="M18 30 Q4 20 10 36" fill="#3a1a0a"/><path d="M62 30 Q76 20 70 36" fill="#3a1a0a"/><path d="M22 66 L16 78" stroke="#2a0a00" stroke-width="6"/><path d="M58 66 L64 78" stroke="#2a0a00" stroke-width="6"/><path d="M30 28 L28 20" stroke="#d63a1a" stroke-width="1.5" opacity="0.6"/><path d="M50 28 L52 20" stroke="#d63a1a" stroke-width="1.5" opacity="0.6"/><ellipse cx="40" cy="40" rx="8" ry="4" fill="#d63a1a" opacity="0.3"/></svg>',
  ashling:     '<svg viewBox="0 0 80 80"><ellipse cx="40" cy="44" rx="14" ry="20" fill="#d67338" opacity="0.8"/><circle cx="40" cy="28" r="10" fill="#d67338"/><circle cx="36" cy="26" r="2" fill="#ff8040"/><circle cx="44" cy="26" r="2" fill="#ff8040"/><path d="M34 20 Q36 12 40 16 Q44 12 46 20" fill="#d63a1a" opacity="0.6"/><ellipse cx="40" cy="64" rx="8" ry="4" fill="#d63a1a" opacity="0.4"/></svg>',
  frost_wraith:'<svg viewBox="0 0 80 80"><ellipse cx="40" cy="44" rx="16" ry="24" fill="#4a9ed4" opacity="0.5"/><circle cx="40" cy="26" r="11" fill="#7ac4e8" opacity="0.7"/><circle cx="36" cy="24" r="2.5" fill="#fff"/><circle cx="44" cy="24" r="2.5" fill="#fff"/><circle cx="36" cy="24" r="1" fill="#4a9ed4"/><circle cx="44" cy="24" r="1" fill="#4a9ed4"/><path d="M22 40 Q12 34 18 46" fill="#4a9ed4" opacity="0.3"/><path d="M58 40 Q68 34 62 46" fill="#4a9ed4" opacity="0.3"/><circle cx="30" cy="50" r="2" fill="#fff" opacity="0.3"/><circle cx="52" cy="44" r="1.5" fill="#fff" opacity="0.2"/></svg>',
  hollow_lord: '<svg viewBox="0 0 80 80"><rect x="28" y="30" width="24" height="34" rx="4" fill="#3a3a4a"/><circle cx="40" cy="22" r="12" fill="#4a4a5a"/><circle cx="36" cy="20" r="2.5" fill="#8a3a3a"/><circle cx="44" cy="20" r="2.5" fill="#8a3a3a"/><rect x="30" y="14" width="20" height="4" rx="1" fill="#7a5a1a"/><polygon points="40,10 38,4 42,4" fill="#c4a83a"/><path d="M52 36 L66 28" stroke="#7a8294" stroke-width="3"/><polygon points="66,28 70,24 68,32" fill="#7a8294"/><path d="M28 36 L18 42" stroke="#4a4a5a" stroke-width="3"/><ellipse cx="18" cy="42" rx="6" ry="8" fill="#3a3a4a"/></svg>',
  bloodfang_alpha:'<svg viewBox="0 0 80 80"><ellipse cx="38" cy="46" rx="24" ry="16" fill="#5a2a2a"/><circle cx="58" cy="34" r="12" fill="#5a2a2a"/><circle cx="56" cy="32" r="2.5" fill="#c44040"/><circle cx="62" cy="32" r="2.5" fill="#c44040"/><path d="M64 38 Q68 36 66 40" fill="none" stroke="#7a3a3a" stroke-width="1.5"/><polygon points="52,24 48,14 54,22" fill="#5a2a2a"/><polygon points="60,24 64,14 58,22" fill="#5a2a2a"/><path d="M58 40 L64 38" stroke="#8a3a3a" stroke-width="1"/><rect x="56" y="36" width="2" height="4" fill="#e8e0d4"/><rect x="62" y="36" width="2" height="4" fill="#e8e0d4"/><path d="M14 46 Q4 42 8 52" fill="#5a2a2a"/><path d="M24 60 L20 72" stroke="#3a1a1a" stroke-width="4"/><path d="M50 60 L48 72" stroke="#3a1a1a" stroke-width="4"/></svg>',
};

// ================================================================
// v4.0 MASSIVE CONTENT EXPANSION
// Enchanting, 200+ new items, expanded skills, new sprites
// ================================================================

// ── ENCHANTING SYSTEM ────────────────────────────────────
// Enchanting creates enhanced versions of equipment
// Formula: base item + enchant scroll + runes = enchanted item

// Enchanted weapon items
const _enchItems = [
  // Enchanted Swords
  ['ench_iron_sword','Enchanted Iron Sword','weapon','weapon','melee',2.4,{attackBonus:18,strengthBonus:15},{attack:10},80,'sword-iron','An iron sword humming with power.'],
  ['ench_steel_sword','Enchanted Steel Sword','weapon','weapon','melee',2.2,{attackBonus:32,strengthBonus:26},{attack:20},250,'sword-steel','Steel blade crackling with energy.'],
  ['ench_mithril_sword','Enchanted Mithril Sword','weapon','weapon','melee',2.0,{attackBonus:48,strengthBonus:38},{attack:30},700,'sword-mithril','Mithril longsword of arcane might.'],
  ['ench_adamant_sword','Enchanted Adamant Sword','weapon','weapon','melee',2.0,{attackBonus:68,strengthBonus:56},{attack:40},2000,'sword-adamant','Adamantite blade of destruction.'],
  ['ench_obsidian_sword','Enchanted Obsidian Blade','weapon','weapon','melee',1.8,{attackBonus:92,strengthBonus:78,magicBonus:15},{attack:50},6000,'sword-obsidian','Obsidian edge infused with void.'],
  // Enchanted Bows
  ['ench_maple_bow','Enchanted Maple Bow','weapon','weapon','ranged',2.0,{rangedBonus:40},{ranged:30},350,'bow-maple','Maple bow with wind enchantment.'],
  ['ench_yew_bow','Enchanted Yew Longbow','weapon','weapon','ranged',2.4,{rangedBonus:62},{ranged:40},1000,'bow-yew','Yew bow pulsing with energy.'],
  ['ench_elder_bow','Enchanted Elder Bow','weapon','weapon','ranged',1.8,{rangedBonus:85},{ranged:55},5000,'bow-elder','Elder bow of piercing light.'],
  // Enchanted Staves
  ['ench_mystic_staff','Enchanted Mystic Staff','weapon','weapon','magic',2.4,{magicBonus:30},{magic:20},350,'staff-mystic','Staff radiating arcane energy.'],
  ['ench_void_staff','Enchanted Void Staff','weapon','weapon','magic',2.0,{magicBonus:60},{magic:40},2000,'staff-void','Void staff of infinite darkness.'],
  ['ench_elder_staff','Enchanted Elder Staff','weapon','weapon','magic',1.8,{magicBonus:88},{magic:55},8000,'staff-elder','Elder staff of supreme power.'],
  // Enchanted Armor
  ['ench_steel_plate','Enchanted Steel Plate','armor','body',null,null,{defenceBonus:32,damageReduction:6},{defence:20},400,'body-steel','Steel plate with magic ward.'],
  ['ench_mithril_plate','Enchanted Mithril Plate','armor','body',null,null,{defenceBonus:48,damageReduction:9},{defence:30},1200,'body-mithril','Mithril plate of resilience.'],
  ['ench_adamant_plate','Enchanted Adamant Plate','armor','body',null,null,{defenceBonus:68,damageReduction:14},{defence:40},3500,'body-adamant','Adamant plate of fortification.'],
  ['ench_obsidian_plate','Enchanted Obsidian Plate','armor','body',null,null,{defenceBonus:90,damageReduction:18},{defence:50},10000,'body-obsidian','Obsidian plate of invulnerability.'],
  // Enchanted Shields
  ['ench_steel_shield','Enchanted Steel Shield','armor','shield',null,null,{defenceBonus:22,damageReduction:6},{defence:20},200,'shield-steel','Steel shield with magic barrier.'],
  ['ench_mithril_shield','Enchanted Mithril Shield','armor','shield',null,null,{defenceBonus:35,damageReduction:9},{defence:30},600,'shield-mithril','Mithril shield of warding.'],
  ['ench_adamant_shield','Enchanted Adamant Shield','armor','shield',null,null,{defenceBonus:52,damageReduction:12},{defence:40},1600,'shield-adamant','Adamant shield of the sentinel.'],
  // Enchanted Helms
  ['ench_steel_helm','Enchanted Steel Helm','armor','head',null,null,{defenceBonus:15,damageReduction:3},{defence:20},150,'helm-steel','Steel helm with mind ward.'],
  ['ench_mithril_helm','Enchanted Mithril Helm','armor','head',null,null,{defenceBonus:24,damageReduction:5},{defence:30},450,'helm-mithril','Mithril helm of clarity.'],
  // Enchanted Boots
  ['ench_steel_boots','Enchanted Steel Boots','armor','boots',null,null,{defenceBonus:12,speedBonus:3},{defence:20},120,'boots-steel','Steel boots of swiftness.'],
  ['ench_mithril_boots','Enchanted Mithril Boots','armor','boots',null,null,{defenceBonus:20,speedBonus:5},{defence:30},380,'boots-mithril','Mithril boots of haste.'],
  // Enchanted Dragonhide
  ['ench_dragon_body','Enchanted Dragonhide Body','armor','body',null,null,{defenceBonus:42,rangedBonus:60},{defence:30,ranged:45},3000,'body-dragon','Dragonhide body of precision.'],
  ['ench_dragon_chaps','Enchanted Dragonhide Chaps','armor','legs',null,null,{defenceBonus:30,rangedBonus:42},{defence:30,ranged:45},2000,'chaps-dragon','Dragonhide chaps of agility.'],
  // Enchanted Robes
  ['ench_adept_robe','Enchanted Adept Robe','armor','body',null,null,{defenceBonus:18,magicBonus:50},{magic:35},1800,'robe-adept','Adept robe of the arcane.'],
  ['ench_archmage_robe','Enchanted Archmage Robe','armor','body',null,null,{defenceBonus:28,magicBonus:72},{magic:55},6000,'robe-archmage','Archmage robe of supremacy.'],
];

for (const [id,name,type,slot,style,speed,stats,req,price,sprite,desc] of _enchItems) {
  const item = {id,name,type,slot,stats,levelReq:req,sellPrice:price,sprite,desc,enchanted:true};
  if (style) item.style = style;
  if (speed) item.attackSpeed = speed;
  GAME_DATA.items[id] = item;
}

// Enchanting materials
GAME_DATA.items.enchant_dust = {id:'enchant_dust',name:'Enchant Dust',type:'resource',subtype:'misc',sellPrice:15,sprite:'misc-essence',desc:'Magical dust from crushing runes.'};
GAME_DATA.items.arcane_shard = {id:'arcane_shard',name:'Arcane Shard',type:'resource',subtype:'misc',sellPrice:80,sprite:'gem-purple',desc:'A shard of crystallized magic.'};
GAME_DATA.items.void_crystal = {id:'void_crystal',name:'Void Crystal',type:'resource',subtype:'misc',sellPrice:300,sprite:'gem-black',desc:'A crystal pulsing with void energy.'};
GAME_DATA.items.celestial_essence = {id:'celestial_essence',name:'Celestial Essence',type:'resource',subtype:'misc',sellPrice:500,sprite:'gem-white',desc:'Essence of starlight.'};

// Charms for Summoning
GAME_DATA.items.gold_charm = {id:'gold_charm',name:'Gold Charm',type:'resource',subtype:'misc',sellPrice:5,sprite:'misc-coin',desc:'A golden charm. Used in Summoning.'};
GAME_DATA.items.green_charm = {id:'green_charm',name:'Green Charm',type:'resource',subtype:'misc',sellPrice:15,sprite:'gem-green',desc:'A green charm. Used in Summoning.'};
GAME_DATA.items.crimson_charm = {id:'crimson_charm',name:'Crimson Charm',type:'resource',subtype:'misc',sellPrice:30,sprite:'gem-red',desc:'A crimson charm. Used in Summoning.'};
GAME_DATA.items.blue_charm = {id:'blue_charm',name:'Blue Charm',type:'resource',subtype:'misc',sellPrice:60,sprite:'gem-blue',desc:'A blue charm. Used in Summoning.'};

// New consumables
GAME_DATA.items.super_strength = {id:'super_strength',name:'Super Strength Potion',type:'potion',buff:{stat:'strengthBonus',value:18,duration:180},sellPrice:120,sprite:'potion-orange',desc:'+18 Str 180s.'};
GAME_DATA.items.super_defence = {id:'super_defence',name:'Super Defence Potion',type:'potion',buff:{stat:'defenceBonus',value:18,duration:180},sellPrice:120,sprite:'potion-blue',desc:'+18 Def 180s.'};
GAME_DATA.items.super_attack = {id:'super_attack',name:'Super Attack Potion',type:'potion',buff:{stat:'attackBonus',value:18,duration:180},sellPrice:120,sprite:'potion-green',desc:'+18 Atk 180s.'};
GAME_DATA.items.ranging_potion = {id:'ranging_potion',name:'Ranging Potion',type:'potion',buff:{stat:'rangedBonus',value:15,duration:120},sellPrice:100,sprite:'potion-green',desc:'+15 Range 120s.'};
GAME_DATA.items.magic_potion = {id:'magic_potion',name:'Magic Potion',type:'potion',buff:{stat:'magicBonus',value:15,duration:120},sellPrice:100,sprite:'potion-purple',desc:'+15 Magic 120s.'};
GAME_DATA.items.antifire = {id:'antifire',name:'Antifire Potion',type:'potion',buff:{stat:'fireResist',value:50,duration:300},sellPrice:200,sprite:'potion-red',desc:'50% fire damage resist 5min.'};
GAME_DATA.items.antivenom = {id:'antivenom',name:'Antivenom Potion',type:'potion',buff:{stat:'venomResist',value:100,duration:300},sellPrice:250,sprite:'potion-green',desc:'Poison immunity 5min.'};
GAME_DATA.items.prayer_potion = {id:'prayer_potion',name:'Prayer Potion',type:'potion',prayerRestore:50,sellPrice:180,sprite:'potion-yellow',desc:'Restores 50 prayer points.'};
GAME_DATA.items.super_restore = {id:'super_restore',name:'Super Restore',type:'potion',prayerRestore:100,heals:200,sellPrice:350,sprite:'potion-yellow',desc:'Restores 100 PP + heals 200.'};

// New arrow tiers
GAME_DATA.items.obsidian_arrows = {id:'obsidian_arrows',name:'Obsidian Arrows',type:'ammo',subtype:'arrow',ammoType:'arrow',rangedBonus:38,sellPrice:80,sprite:'arrow-adamant',desc:'Obsidian-tipped arrows.'};
GAME_DATA.items.dragon_arrows = {id:'dragon_arrows',name:'Dragon Arrows',type:'ammo',subtype:'arrow',ammoType:'arrow',rangedBonus:50,sellPrice:150,sprite:'arrow-adamant',desc:'Dragon-scale arrows. Deadly.'};
GAME_DATA.items.ashfire_arrows = {id:'ashfire_arrows',name:'Ashfire Arrows',type:'ammo',subtype:'arrow',ammoType:'arrow',rangedBonus:65,sellPrice:300,sprite:'arrow-adamant',desc:'Arrows forged in ashfire.'};

// New fish + food tiers
GAME_DATA.items.raw_dark_crab = {id:'raw_dark_crab',name:'Raw Dark Crab',type:'resource',subtype:'fish',sellPrice:300,sprite:'fish-deep',desc:'A deep-sea dark crab.'};
GAME_DATA.items.dark_crab = {id:'dark_crab',name:'Dark Crab',type:'food',heals:550,sellPrice:600,sprite:'food-meal',desc:'Cooked dark crab. +550 HP.'};
GAME_DATA.items.raw_manta = {id:'raw_manta',name:'Raw Manta Ray',type:'resource',subtype:'fish',sellPrice:500,sprite:'fish-boss',desc:'A massive manta ray.'};
GAME_DATA.items.manta_ray = {id:'manta_ray',name:'Manta Ray',type:'food',heals:750,sellPrice:1000,sprite:'food-meal',desc:'Cooked manta ray. +750 HP.'};

// New ores + bars
GAME_DATA.items.runite_ore = {id:'runite_ore',name:'Runite Ore',type:'resource',subtype:'ore',sellPrice:500,sprite:'ore-mithril',desc:'Rare blue-green ore.'};
GAME_DATA.items.runite_bar = {id:'runite_bar',name:'Runite Bar',type:'resource',subtype:'bar',sellPrice:1200,sprite:'bar-mithril',desc:'A refined runite ingot.'};
GAME_DATA.items.ashsteel_ore = {id:'ashsteel_ore',name:'Ashsteel Ore',type:'resource',subtype:'ore',sellPrice:800,sprite:'ore-obsidian',desc:'Ore forged in volcanic ash.'};
GAME_DATA.items.ashsteel_bar = {id:'ashsteel_bar',name:'Ashsteel Bar',type:'resource',subtype:'bar',sellPrice:2000,sprite:'bar-obsidian',desc:'Ashsteel ingot. Legendary.'};

// Ashsteel weapons
GAME_DATA.items.ashsteel_sword = {id:'ashsteel_sword',name:'Ashsteel Longsword',type:'weapon',slot:'weapon',style:'melee',attackSpeed:1.8,stats:{attackBonus:105,strengthBonus:90},levelReq:{attack:65},sellPrice:15000,sprite:'sword-ashfire',desc:'A longsword of ashsteel.',unique:true};
GAME_DATA.items.ashsteel_bow = {id:'ashsteel_bow',name:'Ashsteel Bow',type:'weapon',slot:'weapon',style:'ranged',attackSpeed:1.6,stats:{rangedBonus:100},levelReq:{ranged:65},sellPrice:15000,sprite:'bow-ashwood',ammoType:'arrow',desc:'A bow strung with ashsteel wire.',unique:true};
GAME_DATA.items.ashsteel_staff = {id:'ashsteel_staff',name:'Ashsteel Staff',type:'weapon',slot:'weapon',style:'magic',attackSpeed:1.6,stats:{magicBonus:105},levelReq:{magic:65},sellPrice:15000,sprite:'staff-voidseer',desc:'A staff crowned with ashsteel.',unique:true};
GAME_DATA.items.ashsteel_plate = {id:'ashsteel_plate',name:'Ashsteel Platebody',type:'armor',slot:'body',stats:{defenceBonus:85,damageReduction:16},levelReq:{defence:65},sellPrice:12000,sprite:'body-obsidian',desc:'Ashsteel platebody. Near-indestructible.',unique:true};
GAME_DATA.items.ashsteel_helm = {id:'ashsteel_helm',name:'Ashsteel Helm',type:'armor',slot:'head',stats:{defenceBonus:42,damageReduction:8},levelReq:{defence:65},sellPrice:6000,sprite:'helm-obsidian',desc:'Ashsteel helm of the forge.',unique:true};
GAME_DATA.items.ashsteel_legs = {id:'ashsteel_legs',name:'Ashsteel Platelegs',type:'armor',slot:'legs',stats:{defenceBonus:60,damageReduction:12},levelReq:{defence:65},sellPrice:8000,sprite:'legs-obsidian',desc:'Ashsteel platelegs.',unique:true};
GAME_DATA.items.ashsteel_shield = {id:'ashsteel_shield',name:'Ashsteel Shield',type:'armor',slot:'shield',stats:{defenceBonus:65,damageReduction:15},levelReq:{defence:65},sellPrice:8000,sprite:'shield-obsidian',desc:'Ashsteel shield. Immovable.',unique:true};

// New herbs + seeds
GAME_DATA.items.dragonbloom = {id:'dragonbloom',name:'Dragonbloom',type:'resource',subtype:'herb',sellPrice:400,sprite:'herb-red',desc:'Extremely rare volcanic herb.'};
GAME_DATA.items.dragon_seed = {id:'dragon_seed',name:'Dragonbloom Seed',type:'seed',growTime:7200,yield:'dragonbloom',sellPrice:100,sprite:'misc-seed',desc:'2 hour grow time.'};
GAME_DATA.items.celestial_herb = {id:'celestial_herb',name:'Celestial Herb',type:'resource',subtype:'herb',sellPrice:600,sprite:'herb-silver',desc:'A herb that glows with starlight.'};

// New logs
GAME_DATA.items.spirit_log = {id:'spirit_log',name:'Spirit Log',type:'resource',subtype:'log',sellPrice:500,sprite:'log-pale',desc:'Log from a spirit tree. Glows faintly.'};

// ── ENCHANTING RECIPES ───────────────────────────────────
GAME_DATA.recipes.enchanting = [
  // Dust creation
  {id:'crush_fire',   name:'Crush Fire Runes',   level:1,  xp:20,  time:2.0,input:[{item:'fire_rune',qty:5}],  output:{item:'enchant_dust',qty:1}},
  {id:'crush_chaos',  name:'Crush Chaos Runes',  level:15, xp:60, time:2.0,input:[{item:'chaos_rune',qty:3}], output:{item:'enchant_dust',qty:2}},
  {id:'crush_death',  name:'Crush Death Runes',  level:30, xp:120, time:2.0,input:[{item:'death_rune',qty:2}], output:{item:'enchant_dust',qty:3}},
  {id:'make_shard',   name:'Create Arcane Shard', level:25, xp:160, time:4.0,input:[{item:'enchant_dust',qty:5},{item:'enchant_scroll',qty:1}],output:{item:'arcane_shard',qty:1}},
  {id:'make_void_crystal',name:'Create Void Crystal',level:50,xp:400,time:6.0,input:[{item:'arcane_shard',qty:3},{item:'death_rune',qty:10}],output:{item:'void_crystal',qty:1}},
  {id:'make_celestial',name:'Create Celestial Essence',level:70,xp:800,time:8.0,input:[{item:'void_crystal',qty:2},{item:'diamond',qty:1}],output:{item:'celestial_essence',qty:1}},
  // Weapon enchantments
  {id:'ench_iron_sw',  name:'Enchant Iron Sword',   level:10, xp:100, time:5.0,input:[{item:'iron_sword',qty:1},{item:'enchant_dust',qty:3},{item:'fire_rune',qty:5}],output:{item:'ench_iron_sword',qty:1}},
  {id:'ench_steel_sw', name:'Enchant Steel Sword',  level:25, xp:240, time:6.0,input:[{item:'steel_sword',qty:1},{item:'arcane_shard',qty:1},{item:'chaos_rune',qty:5}],output:{item:'ench_steel_sword',qty:1}},
  {id:'ench_mith_sw',  name:'Enchant Mithril Sword',level:40, xp:480,time:7.0,input:[{item:'mithril_sword',qty:1},{item:'arcane_shard',qty:2},{item:'death_rune',qty:5}],output:{item:'ench_mithril_sword',qty:1}},
  {id:'ench_adam_sw',  name:'Enchant Adamant Sword', level:55, xp:880,time:8.0,input:[{item:'adamant_sword',qty:1},{item:'void_crystal',qty:1},{item:'death_rune',qty:10}],output:{item:'ench_adamant_sword',qty:1}},
  {id:'ench_obs_sw',   name:'Enchant Obsidian Blade',level:70,xp:1600,time:10.0,input:[{item:'obsidian_sword',qty:1},{item:'celestial_essence',qty:1},{item:'death_rune',qty:15}],output:{item:'ench_obsidian_sword',qty:1}},
  // Bow enchantments
  {id:'ench_maple_bw', name:'Enchant Maple Bow',    level:30, xp:320, time:6.0,input:[{item:'maple_shortbow',qty:1},{item:'arcane_shard',qty:1},{item:'air_rune',qty:10}],output:{item:'ench_maple_bow',qty:1}},
  {id:'ench_yew_bw',   name:'Enchant Yew Longbow',  level:45, xp:640,time:7.0,input:[{item:'yew_longbow',qty:1},{item:'void_crystal',qty:1},{item:'air_rune',qty:15}],output:{item:'ench_yew_bow',qty:1}},
  {id:'ench_elder_bw', name:'Enchant Elder Bow',    level:65, xp:1280,time:9.0,input:[{item:'elder_bow',qty:1},{item:'celestial_essence',qty:1},{item:'chaos_rune',qty:10}],output:{item:'ench_elder_bow',qty:1}},
  // Staff enchantments
  {id:'ench_myst_st',  name:'Enchant Mystic Staff', level:25, xp:240, time:5.0,input:[{item:'mystic_staff',qty:1},{item:'arcane_shard',qty:1},{item:'chaos_rune',qty:5}],output:{item:'ench_mystic_staff',qty:1}},
  {id:'ench_void_st',  name:'Enchant Void Staff',   level:45, xp:640,time:7.0,input:[{item:'void_staff',qty:1},{item:'void_crystal',qty:1},{item:'death_rune',qty:8}],output:{item:'ench_void_staff',qty:1}},
  {id:'ench_elder_st', name:'Enchant Elder Staff',  level:65, xp:1280,time:9.0,input:[{item:'elder_staff',qty:1},{item:'celestial_essence',qty:1},{item:'death_rune',qty:15}],output:{item:'ench_elder_staff',qty:1}},
  // Armor enchantments
  {id:'ench_st_plate', name:'Enchant Steel Plate',  level:25, xp:200, time:6.0,input:[{item:'steel_plate',qty:1},{item:'arcane_shard',qty:1},{item:'earth_rune',qty:10}],output:{item:'ench_steel_plate',qty:1}},
  {id:'ench_mi_plate', name:'Enchant Mithril Plate',level:40, xp:400,time:7.0,input:[{item:'mithril_plate',qty:1},{item:'void_crystal',qty:1},{item:'earth_rune',qty:15}],output:{item:'ench_mithril_plate',qty:1}},
  {id:'ench_ad_plate', name:'Enchant Adamant Plate', level:55, xp:800,time:8.0,input:[{item:'adamant_plate',qty:1},{item:'void_crystal',qty:2}],output:{item:'ench_adamant_plate',qty:1}},
  {id:'ench_ob_plate', name:'Enchant Obsidian Plate',level:70, xp:1520,time:10.0,input:[{item:'obsidian_plate',qty:1},{item:'celestial_essence',qty:2}],output:{item:'ench_obsidian_plate',qty:1}},
  // Shield enchantments
  {id:'ench_st_shield',name:'Enchant Steel Shield', level:20, xp:160, time:5.0,input:[{item:'steel_shield',qty:1},{item:'enchant_dust',qty:5},{item:'earth_rune',qty:8}],output:{item:'ench_steel_shield',qty:1}},
  {id:'ench_mi_shield',name:'Enchant Mithril Shield',level:35,xp:320,time:6.0,input:[{item:'mithril_shield',qty:1},{item:'arcane_shard',qty:2}],output:{item:'ench_mithril_shield',qty:1}},
  {id:'ench_ad_shield',name:'Enchant Adamant Shield',level:50,xp:640,time:7.0,input:[{item:'adamant_shield',qty:1},{item:'void_crystal',qty:1}],output:{item:'ench_adamant_shield',qty:1}},
  // Helm/boot enchantments
  {id:'ench_st_helm',  name:'Enchant Steel Helm',   level:20, xp:120, time:4.0,input:[{item:'steel_helm',qty:1},{item:'enchant_dust',qty:4},{item:'water_rune',qty:5}],output:{item:'ench_steel_helm',qty:1}},
  {id:'ench_mi_helm',  name:'Enchant Mithril Helm', level:35, xp:280, time:5.0,input:[{item:'mithril_helm',qty:1},{item:'arcane_shard',qty:1}],output:{item:'ench_mithril_helm',qty:1}},
  {id:'ench_st_boots', name:'Enchant Steel Boots',  level:20, xp:120, time:4.0,input:[{item:'steel_boots',qty:1},{item:'enchant_dust',qty:4},{item:'air_rune',qty:5}],output:{item:'ench_steel_boots',qty:1}},
  {id:'ench_mi_boots', name:'Enchant Mithril Boots',level:35, xp:280, time:5.0,input:[{item:'mithril_boots',qty:1},{item:'arcane_shard',qty:1}],output:{item:'ench_mithril_boots',qty:1}},
  // Dragonhide enchantments
  {id:'ench_d_body',   name:'Enchant Dragonhide Body',level:50,xp:720,time:7.0,input:[{item:'dragon_body',qty:1},{item:'void_crystal',qty:1},{item:'chaos_rune',qty:8}],output:{item:'ench_dragon_body',qty:1}},
  {id:'ench_d_chaps',  name:'Enchant Dragonhide Chaps',level:48,xp:600,time:6.5,input:[{item:'dragon_chaps',qty:1},{item:'void_crystal',qty:1},{item:'chaos_rune',qty:6}],output:{item:'ench_dragon_chaps',qty:1}},
  // Robe enchantments
  {id:'ench_a_robe',   name:'Enchant Adept Robe',   level:45, xp:560,time:6.0,input:[{item:'adept_robe',qty:1},{item:'void_crystal',qty:1},{item:'death_rune',qty:5}],output:{item:'ench_adept_robe',qty:1}},
  {id:'ench_am_robe',  name:'Enchant Archmage Robe',level:65, xp:1200,time:8.0,input:[{item:'archmage_robe',qty:1},{item:'celestial_essence',qty:1},{item:'death_rune',qty:10}],output:{item:'ench_archmage_robe',qty:1}},
];

// ── EXPANDED GATHERING ───────────────────────────────────
// New fishing spots
GAME_DATA.gatheringActions.fishing.push(
  {id:'fish_dark_crab',name:'Dark Crab Spot',level:85,xp:1600,time:9.0,loot:[{item:'raw_dark_crab',qty:1}],masteryId:'darkcrab'},
  {id:'fish_manta',   name:'Manta Ray Depths',level:92,xp:2000,time:10.0,loot:[{item:'raw_manta',qty:1}],masteryId:'manta'},
);
// New mining
GAME_DATA.gatheringActions.mining.push(
  {id:'mine_runite',  name:'Runite Rock',   level:80,xp:1200,time:10.0,loot:[{item:'runite_ore',qty:1}],masteryId:'runite',gemChance:0.06},
  {id:'mine_ashsteel',name:'Ashsteel Vein', level:90,xp:1800,time:12.0,loot:[{item:'ashsteel_ore',qty:1}],masteryId:'ashsteel',gemChance:0.08},
);
// New woodcutting
GAME_DATA.gatheringActions.woodcutting.push(
  {id:'chop_spirit', name:'Spirit Tree', level:85,xp:1600,time:8.0,loot:[{item:'spirit_log',qty:1}],masteryId:'spirit'},
);
// New foraging
GAME_DATA.gatheringActions.foraging.push(
  {id:'forage_dragon',name:'Dragonbloom Fields',level:85,xp:1400,time:9.0,loot:[{item:'dragonbloom',qty:1}],masteryId:'dragonbloom'},
  {id:'forage_celestial',name:'Celestial Garden',level:95,xp:2000,time:11.0,loot:[{item:'celestial_herb',qty:1}],masteryId:'celestial'},
);

// ── EXPANDED RECIPES ─────────────────────────────────────
// New cooking
GAME_DATA.recipes.cooking.push(
  {id:'cook_dark_crab',name:'Cook Dark Crab', level:85,xp:1800,time:5.0,input:[{item:'raw_dark_crab',qty:1}],output:{item:'dark_crab',qty:1},burnChance:0.08},
  {id:'cook_manta',   name:'Cook Manta Ray',  level:92,xp:600,time:6.0,input:[{item:'raw_manta',qty:1}], output:{item:'manta_ray',qty:1},burnChance:0.06},
);
// New smithing
GAME_DATA.recipes.smithing.push(
  {id:'smelt_runite',   name:'Smelt Runite Bar',   level:80,xp:1400,time:9.0,input:[{item:'runite_ore',qty:1},{item:'coal_ore',qty:10}],output:{item:'runite_bar',qty:1}},
  {id:'smelt_ashsteel', name:'Smelt Ashsteel Bar', level:90,xp:550,time:12.0,input:[{item:'ashsteel_ore',qty:1},{item:'coal_ore',qty:14}],output:{item:'ashsteel_bar',qty:1}},
  {id:'smith_ashsteel_sword',name:'Ashsteel Longsword',level:92,xp:800,time:12.0,input:[{item:'ashsteel_bar',qty:5}],output:{item:'ashsteel_sword',qty:1}},
  {id:'smith_ashsteel_plate',name:'Ashsteel Platebody',level:94,xp:1000,time:14.0,input:[{item:'ashsteel_bar',qty:7}],output:{item:'ashsteel_plate',qty:1}},
  {id:'smith_ashsteel_helm', name:'Ashsteel Helm',     level:91,xp:600,time:10.0,input:[{item:'ashsteel_bar',qty:3}],output:{item:'ashsteel_helm',qty:1}},
  {id:'smith_ashsteel_legs', name:'Ashsteel Platelegs',level:93,xp:900,time:12.0,input:[{item:'ashsteel_bar',qty:5}],output:{item:'ashsteel_legs',qty:1}},
  {id:'smith_ashsteel_shield',name:'Ashsteel Shield',  level:92,xp:700,time:11.0,input:[{item:'ashsteel_bar',qty:4}],output:{item:'ashsteel_shield',qty:1}},
);
// New fletching
GAME_DATA.recipes.fletching.push(
  {id:'fletch_obsidian_arrows',name:'Obsidian Arrows (15)',level:70,xp:800,time:4.0,input:[{item:'yew_log',qty:1},{item:'obsidian_bar',qty:1}],output:{item:'obsidian_arrows',qty:15}},
  {id:'fletch_dragon_arrows', name:'Dragon Arrows (15)', level:80,xp:1200,time:4.5,input:[{item:'elder_log',qty:1},{item:'dragon_bones',qty:1}],output:{item:'dragon_arrows',qty:15}},
  {id:'fletch_ashfire_arrows', name:'Ashfire Arrows (15)',level:90,xp:1800,time:5.0,input:[{item:'ash_log',qty:2},{item:'ashsteel_bar',qty:1}],output:{item:'ashfire_arrows',qty:15}},
  {id:'fletch_ashsteel_bow',  name:'Ashsteel Bow',       level:88,xp:2000,time:8.0,input:[{item:'spirit_log',qty:3},{item:'ashsteel_bar',qty:2}],output:{item:'ashsteel_bow',qty:1}},
);
// New alchemy
GAME_DATA.recipes.alchemy.push(
  {id:'brew_super_str',name:'Super Strength',level:45,xp:400,time:5.0,input:[{item:'moonpetal',qty:2},{item:'bloodroot',qty:2}],output:{item:'super_strength',qty:1}},
  {id:'brew_super_def',name:'Super Defence', level:48,xp:400,time:5.0,input:[{item:'moonpetal',qty:2},{item:'silverleaf',qty:3}],output:{item:'super_defence',qty:1}},
  {id:'brew_super_atk',name:'Super Attack',  level:50,xp:400,time:5.0,input:[{item:'moonpetal',qty:2},{item:'voidbloom',qty:1}],output:{item:'super_attack',qty:1}},
  {id:'brew_ranging',  name:'Ranging Potion', level:40,xp:320, time:4.5,input:[{item:'bloodroot',qty:2},{item:'voidbloom',qty:1}],output:{item:'ranging_potion',qty:1}},
  {id:'brew_magic',    name:'Magic Potion',   level:42,xp:340, time:4.5,input:[{item:'moonpetal',qty:1},{item:'voidbloom',qty:2}],output:{item:'magic_potion',qty:1}},
  {id:'brew_antifire', name:'Antifire',       level:55,xp:520,time:5.5,input:[{item:'dragonbloom',qty:1},{item:'bloodroot',qty:2}],output:{item:'antifire',qty:1}},
  {id:'brew_antivenom',name:'Antivenom',      level:58,xp:560,time:5.5,input:[{item:'voidbloom',qty:2},{item:'ashblossom',qty:1}],output:{item:'antivenom',qty:1}},
  {id:'brew_prayer',   name:'Prayer Potion',  level:35,xp:240, time:4.0,input:[{item:'silverleaf',qty:3},{item:'bloodroot',qty:2}],output:{item:'prayer_potion',qty:1}},
  {id:'brew_restore',  name:'Super Restore',  level:63,xp:720,time:6.0,input:[{item:'dragonbloom',qty:1},{item:'celestial_herb',qty:1}],output:{item:'super_restore',qty:1}},
);

// New thieving targets
GAME_DATA.thievingTargets.push(
  {id:'pickpocket_knight',name:'Knight',level:75,xp:880,time:5.0,stunChance:0.45,stunTime:7,gold:{min:80,max:300},loot:[{item:'diamond',qty:1,chance:0.03},{item:'enchant_scroll',qty:1,chance:0.08}]},
  {id:'pickpocket_king',  name:'King',  level:90,xp:1400,time:5.5,stunChance:0.50,stunTime:8,gold:{min:150,max:500},loot:[{item:'onyx',qty:1,chance:0.02},{item:'celestial_essence',qty:1,chance:0.03}]},
);

// Add charm drops to monsters
for (const [mId, mon] of Object.entries(GAME_DATA.monsters)) {
  if (mon.combatLevel >= 5 && mon.combatLevel < 20)  mon.drops.push({item:'gold_charm',qty:1,chance:0.15});
  if (mon.combatLevel >= 20 && mon.combatLevel < 40) mon.drops.push({item:'green_charm',qty:1,chance:0.12});
  if (mon.combatLevel >= 40 && mon.combatLevel < 65) mon.drops.push({item:'crimson_charm',qty:1,chance:0.10});
  if (mon.combatLevel >= 65)                          mon.drops.push({item:'blue_charm',qty:1,chance:0.08});
}

// ── EXPANDED SHOP ────────────────────────────────────────
GAME_DATA.shop.push(
  {item:'enchant_scroll',price:500,category:'special'},
  {item:'enchant_dust',price:30,category:'materials'},
  {item:'prayer_potion',price:400,category:'potions'},
  {item:'super_strength',price:250,category:'potions'},
  {item:'super_defence',price:250,category:'potions'},
  {item:'super_attack',price:250,category:'potions'},
  {item:'ranging_potion',price:200,category:'potions'},
  {item:'magic_potion',price:200,category:'potions'},
  {item:'antifire',price:400,category:'potions'},
  {item:'dragon_seed',price:250,category:'seeds'},
  {item:'obsidian_arrows',price:200,category:'equipment'},
  {item:'dragon_arrows',price:400,category:'equipment'},
  {item:'broad_arrows',price:50,category:'equipment'},
);

// ── MORE ACHIEVEMENTS ────────────────────────────────────
GAME_DATA.achievements.push(
  {id:'enchant_1',     name:'Enchanter',       desc:'Enchant your first item.',    check:(g)=>(g.stats.totalActions.enchanting||0)>=1},
  {id:'enchant_master',name:'Master Enchanter',desc:'Reach Enchanting level 50.',  check:(g)=>g.skills.enchanting&&g.skills.enchanting.level>=50},
  {id:'level_99_any',  name:'Maxed',           desc:'Reach level 99 in any skill.',check:(g)=>Object.values(g.skills).some(s=>s.level>=99)},
  {id:'total_1000',    name:'Legendary',       desc:'Total level 1000+.',          check:(g)=>Object.values(g.skills).reduce((a,s)=>a+s.level,0)>=1000},
  {id:'gold_10m',      name:'Tycoon',          desc:'Hold 10,000,000 gold.',       check:(g)=>g.gold>=10000000},
  {id:'kill_5000',     name:'Decimator',       desc:'Kill 5,000 monsters.',        check:(g)=>g.stats.monstersKilled>=5000},
  {id:'kill_10000',    name:'Genocide',         desc:'Kill 10,000 monsters.',      check:(g)=>g.stats.monstersKilled>=10000},
  {id:'cook_no_burn',  name:'Iron Chef',       desc:'Cook 100 food without burning.',check:(g)=>(g.stats.totalActions.cooking||0)>=100},
  {id:'full_ashsteel', name:'Ashsteel Warrior', desc:'Equip full Ashsteel armor.', check:(g)=>g.equipment.head==='ashsteel_helm'&&g.equipment.body==='ashsteel_plate'&&g.equipment.legs==='ashsteel_legs'},
  {id:'all_bosses',    name:'Boss Hunter',     desc:'Kill all 3 world bosses.',    check:(g)=>{const u=g.stats.uniqueKills||{};return u.blight_warden&&u.storm_reaver&&u.ashen_overlord;}},
  {id:'all_dungeons',  name:'Dungeon Master',  desc:'Complete all dungeons.',      check:(g)=>(g.stats.dungeonsCompleted||0)>=11},
  {id:'fifty_quests',  name:'Questaholic',     desc:'Complete 48 quests.',         check:(g)=>(g.quests?.completed?.length||0)>=48},
);

console.log('[Ashfall] v4.0 expansion loaded:', Object.keys(GAME_DATA.items).length, 'items');

// ── STORYLINE QUESTS ─────────────────────────────────────
// Multi-step quest chains with narrative and alignment impact
GAME_DATA.storylines = [
  {
    id:'main_story', name:'The Ashfall Prophecy', desc:'Uncover the truth behind the endless ash.',
    chapters: [
      {
        id:'ms_1', name:'Chapter 1: Awakening',
        steps: [
          {id:'ms_1_1',text:'Old Pete tells you of a strange light in the Darkwood. He begs you to investigate.',objective:{type:'kill',monster:'rat',qty:5},reward:{xp:{attack:200},gold:50},alignShift:{direction:'good',amount:5}},
          {id:'ms_1_2',text:'Rats were guarding a strange rune-carved bone. Pete says to bring it to Commander Elara at Silverhold.',objective:{type:'collect',item:'bones',qty:3},reward:{xp:{defence:200},gold:100},alignShift:{direction:'lawful',amount:3}},
          {id:'ms_1_3',text:'Elara recognizes the markings as the Ashen Script—the language of the first fall. She asks you to prove your worth by slaying goblins threatening the road.',objective:{type:'kill',monster:'goblin',qty:10},reward:{xp:{strength:500,attack:300},gold:300,items:[{item:'steel_sword',qty:1}],rep:{silver_order:500}},alignShift:{direction:'good',amount:5}},
        ]
      },
      {
        id:'ms_2', name:'Chapter 2: The Merchant\'s Shadow',
        steps: [
          {id:'ms_2_1',text:'Merchant Garrick has information about the Ashen Script, but demands payment. Steal 500 gold worth of goods... or earn it honestly.',objective:{type:'gold',amount:500},reward:{xp:{thieving:400},gold:200},alignShift:null},
          {id:'ms_2_2',text:'Garrick reveals that Krolgar the Butcher has been collecting Ashen artifacts. Infiltrate his hideout and defeat his guards.',objective:{type:'kill',monster:'bandit',qty:15},reward:{xp:{attack:600,strength:400},gold:500,rep:{bloodfang_clan:-200,silver_order:300}},alignShift:{direction:'lawful',amount:5}},
          {id:'ms_2_3',text:'Among Krolgar\'s plunder, you find an Ashen Tablet. But Krolgar catches you. He offers a deal: work for him, or fight.',objective:{type:'choice',options:['join_krolgar','fight_krolgar']},reward:{xp:{diplomacy:500}},alignShift:null},
        ]
      },
      {
        id:'ms_3', name:'Chapter 3: The Veiled Truth',
        steps: [
          {id:'ms_3_1',text:'Archivist Ilyana can decode the Ashen Tablet, but needs you to gather rare materials from the depths.',objective:{type:'collect',item:'death_rune',qty:20},reward:{xp:{magic:800},gold:600,rep:{veiled_circle:500}},alignShift:{direction:'chaotic',amount:3}},
          {id:'ms_3_2',text:'The tablet speaks of the Ashfall Titan—a being that caused the world to burn. It sleeps beneath the Ashen Peaks. But first, you must grow stronger.',objective:{type:'skill',skill:'attack',level:30},reward:{xp:{attack:1000,defence:1000},gold:1000},alignShift:null},
          {id:'ms_3_3',text:'Ilyana warns that waking the Titan requires sacrifice. Dark Mages have been feeding it souls. Stop them.',objective:{type:'kill',monster:'dark_mage',qty:20},reward:{xp:{magic:1200,prayer:500},gold:2000,items:[{item:'enchant_scroll',qty:3}],rep:{veiled_circle:1000}},alignShift:{direction:'good',amount:10}},
        ]
      },
      {
        id:'ms_4', name:'Chapter 4: The Ashfall',
        steps: [
          {id:'ms_4_1',text:'The Titan stirs. Dragons and demons flood the surface. Forge Ashsteel weapons to stand a chance.',objective:{type:'skill',skill:'smithing',level:50},reward:{xp:{smithing:2000},gold:3000},alignShift:null},
          {id:'ms_4_2',text:'Slay the beasts pouring from the rift. Each kill weakens the Titan\'s grip on this realm.',objective:{type:'kill',monster:'dragon',qty:5},reward:{xp:{attack:3000,strength:3000,defence:2000},gold:5000,items:[{item:'void_crystal',qty:2}]},alignShift:{direction:'good',amount:15}},
          {id:'ms_4_3',text:'The Ashfall Titan awakens. Face it.',objective:{type:'kill',monster:'ashfall_titan',qty:1},reward:{xp:{attack:10000,strength:10000,defence:10000,hitpoints:5000},gold:25000,items:[{item:'celestial_essence',qty:5},{item:'ashsteel_bar',qty:10}]},alignShift:{direction:'good',amount:25}},
        ]
      },
    ]
  },
  {
    id:'dark_path', name:'The Dark Path', desc:'Embrace the darkness. Serve the Ashfall.',
    chapters: [
      {
        id:'dp_1', name:'Whispers in the Dark',
        steps: [
          {id:'dp_1_1',text:'A voice in the shadows offers power. All it asks is a simple task—kill 10 wolves and bring their pelts as tribute.',objective:{type:'kill',monster:'wolf',qty:10},reward:{xp:{strength:500},gold:200},alignShift:{direction:'evil',amount:5}},
          {id:'dp_1_2',text:'The voice is pleased. It reveals a hidden cache of dark runes. Take them and learn the forbidden art of Necromancy.',objective:{type:'collect',item:'death_rune',qty:15},reward:{xp:{necromancy:800,magic:400},gold:400},alignShift:{direction:'evil',amount:8}},
          {id:'dp_1_3',text:'Your first test of loyalty: destroy a Silver Order patrol. They are the enemies of progress.',objective:{type:'kill',monster:'skeleton',qty:20},reward:{xp:{necromancy:1000,strength:600},gold:800,rep:{silver_order:-1000,bloodfang_clan:500}},alignShift:{direction:'evil',amount:15}},
        ]
      },
      {
        id:'dp_2', name:'The Blood Price',
        steps: [
          {id:'dp_2_1',text:'Krolgar recognizes your dark aura. He offers the Bloodfang\'s allegiance—if you prove yourself in combat.',objective:{type:'kill',monster:'ogre',qty:10},reward:{xp:{attack:1500,strength:1500},gold:2000,rep:{bloodfang_clan:1000}},alignShift:{direction:'chaotic',amount:10}},
          {id:'dp_2_2',text:'The Bloodfang Clan demands you master the dark arts. Reach Necromancy 20 and demonstrate your power.',objective:{type:'skill',skill:'necromancy',level:20},reward:{xp:{necromancy:2000},gold:3000,items:[{item:'void_crystal',qty:3}]},alignShift:{direction:'evil',amount:10}},
          {id:'dp_2_3',text:'Your dark patron reveals itself: the Ashfall Titan. It doesn\'t want to be stopped—it wants to be served. Feed it by slaying its enemies.',objective:{type:'kill',monster:'demon',qty:10},reward:{xp:{necromancy:5000,magic:3000},gold:10000,items:[{item:'celestial_essence',qty:3}]},alignShift:{direction:'evil',amount:25}},
        ]
      },
    ]
  },
];

console.log('[Ashfall] Storylines loaded:', GAME_DATA.storylines.length, 'quest chains');

// ================================================================
// v5.1 MASSIVE UPDATE: Bazaar, Item Sets, Thieving, Art, Items
// ================================================================

// ── JEWELRY + ACCESSORIES ────────────────────────────────
const _jewelry = [
  ['gold_ring','Gold Ring','armor','ring',null,null,{attackBonus:4,strengthBonus:2},{},200,'ring-gold','A simple gold band.'],
  ['ruby_ring','Ruby Ring','armor','ring',null,null,{attackBonus:8,strengthBonus:6},{attack:15},600,'ring-red','A ring set with a ruby.'],
  ['diamond_ring','Diamond Ring','armor','ring',null,null,{attackBonus:14,strengthBonus:10,defenceBonus:6},{attack:30},2000,'ring-white','Brilliant diamond ring.'],
  ['onyx_ring','Onyx Ring','armor','ring',null,null,{attackBonus:18,strengthBonus:14,defenceBonus:10},{attack:45},5000,'ring-black','Dark onyx ring of power.'],
  ['berserker_ring','Berserker Ring','armor','ring',null,null,{strengthBonus:24,attackBonus:12},{attack:55,strength:55},15000,'ring-red','Maximizes raw strength.',true],
  ['archers_ring','Archer\'s Ring','armor','ring',null,null,{rangedBonus:22,attackBonus:8},{ranged:55},15000,'ring-green','Precision-crafted for rangers.',true],
  ['seers_ring','Seer\'s Ring','armor','ring',null,null,{magicBonus:22,defenceBonus:8},{magic:55},15000,'ring-blue','Channels arcane focus.',true],
  ['gold_amulet','Gold Amulet','armor','amulet',null,null,{defenceBonus:6},{},300,'amulet-gold','A golden amulet.'],
  ['ruby_amulet','Ruby Amulet','armor','amulet',null,null,{strengthBonus:10,attackBonus:8},{attack:20},800,'amulet-red','Ruby amulet of power.'],
  ['fury_amulet','Amulet of Fury','armor','amulet',null,null,{attackBonus:16,strengthBonus:14,defenceBonus:16,rangedBonus:8,magicBonus:8},{attack:40,defence:40},8000,'amulet-fury','The ultimate amulet.',true],
  ['glory_amulet','Amulet of Glory','armor','amulet',null,null,{attackBonus:12,strengthBonus:10,defenceBonus:8},{attack:30},3000,'amulet-gold','A blessed amulet.'],
  ['occult_necklace','Occult Necklace','armor','amulet',null,null,{magicBonus:20,defenceBonus:4},{magic:50},10000,'amulet-purple','Boosts magic power.',true],
  ['obsidian_cape','Obsidian Cape','armor','cape',null,null,{defenceBonus:12,damageReduction:3},{defence:30},2000,'cape-black','Dark obsidian cape.'],
  ['fire_cape','Fire Cape','armor','cape',null,null,{attackBonus:8,strengthBonus:8,defenceBonus:14,damageReduction:5},{defence:45},20000,'cape-red','Cape of living flame.',true],
  ['ava_accumulator','Ava\'s Accumulator','armor','cape',null,null,{rangedBonus:16,defenceBonus:4},{ranged:40},5000,'cape-green','Retrieves ammo automatically.',true],
  ['mage_cape','Archmage Cape','armor','cape',null,null,{magicBonus:16,defenceBonus:6},{magic:50},8000,'cape-blue','Cape of arcane mastery.',true],
  ['leather_gloves','Leather Gloves','armor','gloves',null,null,{defenceBonus:2},{},50,'gloves-brown','Basic protection.'],
  ['combat_bracelet','Combat Bracelet','armor','gloves',null,null,{attackBonus:10,strengthBonus:8,defenceBonus:8},{attack:30},2500,'gloves-steel','All-round combat bracers.'],
  ['barrows_gloves','Barrows Gloves','armor','gloves',null,null,{attackBonus:16,strengthBonus:14,defenceBonus:16,rangedBonus:14,magicBonus:10},{attack:50,defence:50},25000,'gloves-red','The best gloves.',true],
];
for (const [id,name,type,slot,style,speed,stats,req,price,sprite,desc,unique] of _jewelry) {
  const item = {id,name,type,slot,stats,levelReq:req||{},sellPrice:price,sprite,desc};
  if (unique) item.unique = true;
  GAME_DATA.items[id] = item;
}

// ── THIEVING OVERHAUL ────────────────────────────────────
GAME_DATA.thievingTargets = [
  {id:'pickpocket_man',name:'Man',level:1,xp:8,time:3.0,stunChance:0.20,stunTime:3,gold:{min:1,max:10},
   loot:[{item:'bones',qty:1,chance:0.10}]},
  {id:'pickpocket_farmer',name:'Farmer',level:10,xp:15,time:3.5,stunChance:0.25,stunTime:4,gold:{min:5,max:25},
   loot:[{item:'potato_seed',qty:1,chance:0.15},{item:'onion_seed',qty:1,chance:0.10},{item:'feather',qty:3,chance:0.20}]},
  {id:'pickpocket_warrior',name:'Warrior',level:25,xp:35,time:4.0,stunChance:0.30,stunTime:5,gold:{min:15,max:60},
   loot:[{item:'iron_sword',qty:1,chance:0.05},{item:'steel_arrows',qty:5,chance:0.15},{item:'potion_healing_i',qty:1,chance:0.10}]},
  {id:'pickpocket_rogue',name:'Rogue',level:32,xp:50,time:4.0,stunChance:0.30,stunTime:5,gold:{min:20,max:80},
   loot:[{item:'chaos_rune',qty:3,chance:0.12},{item:'death_rune',qty:1,chance:0.05},{item:'leather',qty:2,chance:0.20},{item:'topaz',qty:1,chance:0.04}]},
  {id:'pickpocket_guard',name:'Guard',level:40,xp:70,time:4.5,stunChance:0.35,stunTime:5,gold:{min:25,max:100},
   loot:[{item:'steel_sword',qty:1,chance:0.03},{item:'sapphire',qty:1,chance:0.05},{item:'chaos_rune',qty:5,chance:0.10},{item:'steel_plate',qty:1,chance:0.02}]},
  {id:'pickpocket_merchant',name:'Wealthy Merchant',level:50,xp:100,time:4.5,stunChance:0.35,stunTime:6,gold:{min:40,max:200},
   loot:[{item:'ruby',qty:1,chance:0.06},{item:'emerald',qty:1,chance:0.04},{item:'gold_ring',qty:1,chance:0.03},{item:'gold_amulet',qty:1,chance:0.03},{item:'enchant_scroll',qty:1,chance:0.05}]},
  {id:'pickpocket_paladin',name:'Paladin',level:60,xp:150,time:5.0,stunChance:0.40,stunTime:6,gold:{min:50,max:250},
   loot:[{item:'diamond',qty:1,chance:0.04},{item:'prayer_potion',qty:1,chance:0.08},{item:'ruby_amulet',qty:1,chance:0.02},{item:'adamant_sword',qty:1,chance:0.01}]},
  {id:'pickpocket_knight',name:'Knight',level:75,xp:220,time:5.0,stunChance:0.45,stunTime:7,gold:{min:80,max:300},
   loot:[{item:'diamond',qty:1,chance:0.06},{item:'enchant_scroll',qty:1,chance:0.08},{item:'glory_amulet',qty:1,chance:0.01},{item:'obsidian_cape',qty:1,chance:0.005}]},
  {id:'pickpocket_king',name:'King',level:90,xp:350,time:5.5,stunChance:0.50,stunTime:8,gold:{min:150,max:500},
   loot:[{item:'onyx',qty:1,chance:0.03},{item:'celestial_essence',qty:1,chance:0.02},{item:'diamond_ring',qty:1,chance:0.01},{item:'void_crystal',qty:1,chance:0.03}]},
  // Stalls
  {id:'steal_cake',name:'Cake Stall',level:5,xp:10,time:2.5,stunChance:0.15,stunTime:3,gold:{min:0,max:0},
   loot:[{item:'cooked_meat',qty:1,chance:0.70},{item:'bread',qty:1,chance:0.50}],isStall:true},
  {id:'steal_silk',name:'Silk Stall',level:20,xp:25,time:3.0,stunChance:0.25,stunTime:4,gold:{min:10,max:30},
   loot:[{item:'leather',qty:2,chance:0.60},{item:'hard_leather',qty:1,chance:0.30}],isStall:true},
  {id:'steal_gem',name:'Gem Stall',level:45,xp:80,time:4.0,stunChance:0.40,stunTime:6,gold:{min:0,max:0},
   loot:[{item:'topaz',qty:1,chance:0.30},{item:'sapphire',qty:1,chance:0.20},{item:'ruby',qty:1,chance:0.15},{item:'emerald',qty:1,chance:0.10},{item:'diamond',qty:1,chance:0.03}],isStall:true},
  {id:'steal_magic',name:'Magic Stall',level:65,xp:150,time:4.5,stunChance:0.45,stunTime:7,gold:{min:0,max:0},
   loot:[{item:'fire_rune',qty:10,chance:0.40},{item:'chaos_rune',qty:5,chance:0.30},{item:'death_rune',qty:3,chance:0.20},{item:'enchant_dust',qty:2,chance:0.15},{item:'arcane_shard',qty:1,chance:0.05}],isStall:true},
];

// Simple food items for thieving
GAME_DATA.items.bread = {id:'bread',name:'Bread',type:'food',heals:50,sellPrice:5,sprite:'food-basic',desc:'A loaf of bread. +50 HP.'};
GAME_DATA.items.cooked_meat = {id:'cooked_meat',name:'Cooked Meat',type:'food',heals:30,sellPrice:3,sprite:'food-basic',desc:'Simple cooked meat. +30 HP.'};

// ── REMAINING MONSTER ART ────────────────────────────────
Object.assign(GAME_DATA.monsterArt, {
  shadow_archer:'<svg viewBox="0 0 80 80"><rect x="32" y="34" width="16" height="28" rx="3" fill="#2a2a3a"/><circle cx="40" cy="24" r="11" fill="#2a2a3a"/><circle cx="36" cy="22" r="2" fill="#8a3a5a"/><circle cx="44" cy="22" r="2" fill="#8a3a5a"/><rect x="30" y="18" width="20" height="5" rx="2" fill="#1a1a2a"/><path d="M28 40 Q16 30 20 44" fill="#2a2a3a" opacity="0.6"/><path d="M52 40 L70 28" stroke="#5a4a3a" stroke-width="2"/><path d="M70 28 L74 24 L68 28 L72 32 L70 28" fill="#5a4a3a"/><path d="M32 62 L30 72" stroke="#1a1a2a" stroke-width="3"/><path d="M48 62 L50 72" stroke="#1a1a2a" stroke-width="3"/></svg>',
  ogre:'<svg viewBox="0 0 80 80"><rect x="22" y="28" width="36" height="40" rx="8" fill="#7a6a4a"/><circle cx="40" cy="18" r="16" fill="#7a6a4a"/><circle cx="34" cy="16" r="3" fill="#4a3a1a"/><circle cx="46" cy="16" r="3" fill="#4a3a1a"/><path d="M34 26 Q40 30 46 26" fill="none" stroke="#4a3a1a" stroke-width="2"/><rect x="35" y="24" width="3" height="4" fill="#e8e0d4"/><rect x="42" y="24" width="3" height="4" fill="#e8e0d4"/><path d="M58 36 L72 28" stroke="#5a4a2a" stroke-width="5" stroke-linecap="round"/><path d="M22 68 L16 78" stroke="#5a4a2a" stroke-width="6"/><path d="M58 68 L64 78" stroke="#5a4a2a" stroke-width="6"/></svg>',
  wyvern:'<svg viewBox="0 0 80 80"><ellipse cx="38" cy="50" rx="20" ry="14" fill="#5a6a4a"/><circle cx="56" cy="36" r="10" fill="#5a6a4a"/><circle cx="54" cy="34" r="2" fill="#c4a83a"/><circle cx="60" cy="34" r="2" fill="#c4a83a"/><path d="M62 40 L68 38" stroke="#5a6a4a" stroke-width="1.5"/><polygon points="50,28 46,18 54,26" fill="#5a6a4a"/><path d="M22 40 Q6 26 14 42 Q2 36 18 48" fill="#4a5a3a" opacity="0.7"/><path d="M54 40 Q70 26 66 42 Q78 36 62 48" fill="#4a5a3a" opacity="0.7"/><path d="M18 50 Q8 48 10 58" fill="#5a6a4a"/><path d="M28 62 L24 72" stroke="#3a4a2a" stroke-width="3"/><path d="M48 62 L44 72" stroke="#3a4a2a" stroke-width="3"/></svg>',
  dark_mage:'<svg viewBox="0 0 80 80"><path d="M30 36 L30 68 L50 68 L50 36" fill="#2a1a3a"/><circle cx="40" cy="28" r="10" fill="#c4a87a"/><circle cx="37" cy="26" r="1.5" fill="#5a2a8a"/><circle cx="43" cy="26" r="1.5" fill="#5a2a8a"/><polygon points="40,10 30,28 50,28" fill="#2a1a3a"/><polygon points="40,6 38,10 42,10" fill="#5a2a8a"/><path d="M24 40 L12 34" stroke="#5a2a8a" stroke-width="2"/><circle cx="12" cy="34" r="4" fill="#5a2a8a" opacity="0.5"/><path d="M56 40 L64 36" stroke="#2a1a3a" stroke-width="2"/><path d="M64 36 L64 20" stroke="#5a3a2a" stroke-width="2.5"/><circle cx="64" cy="18" r="3" fill="#b585e0" opacity="0.6"/></svg>',
  lesser_demon:'<svg viewBox="0 0 80 80"><rect x="30" y="34" width="20" height="28" rx="4" fill="#6a2a2a"/><circle cx="40" cy="26" r="10" fill="#6a2a2a"/><circle cx="37" cy="24" r="2" fill="#c44040"/><circle cx="43" cy="24" r="2" fill="#c44040"/><polygon points="32,18 28,8 36,16" fill="#4a1a1a"/><polygon points="48,18 52,8 44,16" fill="#4a1a1a"/><path d="M28 40 Q18 34 22 46" fill="#4a1a1a" opacity="0.6"/><path d="M52 40 Q62 34 58 46" fill="#4a1a1a" opacity="0.6"/><path d="M38 60 Q36 68 40 72 Q44 68 42 60" fill="#6a2a2a"/></svg>',
  ice_troll:'<svg viewBox="0 0 80 80"><rect x="26" y="30" width="28" height="36" rx="6" fill="#8aB4c8"/><circle cx="40" cy="20" r="14" fill="#8aB4c8"/><circle cx="34" cy="18" r="3" fill="#4a7a9a"/><circle cx="46" cy="18" r="3" fill="#4a7a9a"/><path d="M34 28 Q40 32 46 28" fill="none" stroke="#5a8a9a" stroke-width="2"/><rect x="34" y="26" width="3" height="4" fill="#e8e0d4"/><rect x="43" y="26" width="3" height="4" fill="#e8e0d4"/><path d="M54 38 L68 30" stroke="#6a94a8" stroke-width="4" stroke-linecap="round"/><circle cx="30" cy="42" r="3" fill="#c8e8f8" opacity="0.3"/><circle cx="50" cy="48" r="2" fill="#c8e8f8" opacity="0.3"/></svg>',
  shadow_beast:'<svg viewBox="0 0 80 80"><ellipse cx="40" cy="46" rx="24" ry="18" fill="#1a1a2a" opacity="0.9"/><circle cx="34" cy="38" r="4" fill="#8a3a5a"/><circle cx="46" cy="38" r="4" fill="#8a3a5a"/><circle cx="34" cy="38" r="1.5" fill="#fff"/><circle cx="46" cy="38" r="1.5" fill="#fff"/><path d="M16 46 Q6 40 12 52" fill="#1a1a2a" opacity="0.6"/><path d="M64 46 Q74 40 68 52" fill="#1a1a2a" opacity="0.6"/><circle cx="24" cy="52" r="2" fill="#5a2a3a" opacity="0.4"/><circle cx="56" cy="50" r="1.5" fill="#5a2a3a" opacity="0.3"/><ellipse cx="40" cy="64" rx="16" ry="4" fill="#1a1a2a" opacity="0.4"/></svg>',
  corrupted_golem:'<svg viewBox="0 0 80 80"><rect x="24" y="24" width="32" height="40" rx="6" fill="#4a4a5a"/><rect x="30" y="12" width="20" height="16" rx="4" fill="#4a4a5a"/><circle cx="36" cy="18" r="3" fill="#c44040"/><circle cx="44" cy="18" r="3" fill="#c44040"/><path d="M18 32 L8 28" stroke="#4a4a5a" stroke-width="6" stroke-linecap="round"/><path d="M62 32 L72 28" stroke="#4a4a5a" stroke-width="6" stroke-linecap="round"/><path d="M24 64 L20 76" stroke="#3a3a4a" stroke-width="6"/><path d="M56 64 L60 76" stroke="#3a3a4a" stroke-width="6"/><rect x="32" y="36" width="16" height="3" fill="#c44040" opacity="0.5"/><rect x="32" y="44" width="16" height="3" fill="#c44040" opacity="0.3"/></svg>',
  phoenix:'<svg viewBox="0 0 80 80"><ellipse cx="40" cy="48" rx="16" ry="14" fill="#d67338"/><circle cx="40" cy="32" r="10" fill="#d4a83a"/><circle cx="37" cy="30" r="2" fill="#c44040"/><circle cx="43" cy="30" r="2" fill="#c44040"/><polygon points="40,24 38,18 42,18" fill="#d63a1a"/><path d="M24 40 Q8 28 16 44 Q4 38 20 50" fill="#d63a1a" opacity="0.7"/><path d="M56 40 Q72 28 64 44 Q76 38 60 50" fill="#d63a1a" opacity="0.7"/><path d="M34 22 Q30 12 36 18" fill="#ff8040" opacity="0.6"/><path d="M46 22 Q50 12 44 18" fill="#ff8040" opacity="0.6"/><path d="M36 60 Q34 68 40 74 Q46 68 44 60" fill="#d63a1a" opacity="0.8"/><ellipse cx="40" cy="74" rx="8" ry="3" fill="#d63a1a" opacity="0.3"/></svg>',
  ash_guardian:'<svg viewBox="0 0 80 80"><rect x="26" y="22" width="28" height="44" rx="6" fill="#3a2a1a"/><rect x="30" y="10" width="20" height="18" rx="4" fill="#3a2a1a"/><circle cx="36" cy="16" r="3" fill="#d63a1a"/><circle cx="44" cy="16" r="3" fill="#d63a1a"/><circle cx="36" cy="16" r="1" fill="#ff8040"/><circle cx="44" cy="16" r="1" fill="#ff8040"/><path d="M20 30 L6 22" stroke="#3a2a1a" stroke-width="5" stroke-linecap="round"/><path d="M60 30 L74 22" stroke="#3a2a1a" stroke-width="5" stroke-linecap="round"/><ellipse cx="40" cy="40" rx="6" ry="4" fill="#d63a1a" opacity="0.3"/><path d="M26 66 L20 78" stroke="#2a1a0a" stroke-width="6"/><path d="M54 66 L60 78" stroke="#2a1a0a" stroke-width="6"/></svg>',
  abyssal_horror:'<svg viewBox="0 0 80 80"><ellipse cx="40" cy="42" rx="26" ry="22" fill="#2a1a3a" opacity="0.8"/><circle cx="32" cy="34" r="5" fill="#b585e0"/><circle cx="48" cy="34" r="5" fill="#b585e0"/><circle cx="40" cy="42" r="3" fill="#8a3a8a"/><circle cx="32" cy="34" r="2" fill="#fff"/><circle cx="48" cy="34" r="2" fill="#fff"/><path d="M20 50 Q10 56 16 62 Q8 58 18 54" fill="#3a1a4a" opacity="0.6"/><path d="M60 50 Q70 56 64 62 Q72 58 62 54" fill="#3a1a4a" opacity="0.6"/><path d="M30 58 Q26 68 32 72" fill="#2a1a3a" opacity="0.5"/><path d="M50 58 Q54 68 48 72" fill="#2a1a3a" opacity="0.5"/><path d="M38 58 Q40 70 42 58" fill="#2a1a3a" opacity="0.5"/><circle cx="22" cy="40" r="2" fill="#b585e0" opacity="0.3"/><circle cx="58" cy="44" r="1.5" fill="#b585e0" opacity="0.3"/></svg>',
  ashfall_warden:'<svg viewBox="0 0 80 80"><rect x="24" y="20" width="32" height="46" rx="6" fill="#5a3a1a"/><circle cx="40" cy="12" r="14" fill="#5a3a1a"/><rect x="28" y="6" width="24" height="6" rx="2" fill="#c9873e"/><polygon points="40,2 38,6 42,6" fill="#d4a83a"/><circle cx="34" cy="12" r="3" fill="#d63a1a"/><circle cx="46" cy="12" r="3" fill="#d63a1a"/><path d="M34 20 Q40 24 46 20" fill="none" stroke="#3a2a0a" stroke-width="2"/><path d="M56 28 L70 20" stroke="#7a8294" stroke-width="3"/><polygon points="70,20 74,16 72,24" fill="#7a8294"/><path d="M24 28 L14 34" stroke="#5a3a1a" stroke-width="3"/><ellipse cx="14" cy="34" rx="6" ry="8" fill="#4a3a1a"/><path d="M24 66 L18 78" stroke="#3a2a0a" stroke-width="5"/><path d="M56 66 L62 78" stroke="#3a2a0a" stroke-width="5"/></svg>',
});

// ── NPC PORTRAITS ────────────────────────────────────────
GAME_DATA.npcArt = {
  old_pete:'<svg viewBox="0 0 60 60"><circle cx="30" cy="24" r="14" fill="#c4a87a"/><circle cx="26" cy="22" r="2" fill="#4a3a2a"/><circle cx="34" cy="22" r="2" fill="#4a3a2a"/><path d="M26 30 Q30 34 34 30" fill="none" stroke="#7a5a3a" stroke-width="1.5"/><path d="M18 18 Q22 8 30 10 Q38 8 42 18" fill="#aaa" stroke="none"/><rect x="24" y="34" width="12" height="20" rx="3" fill="#5a4a3a"/><path d="M22 38 L14 44" stroke="#5a4a3a" stroke-width="2.5"/><path d="M14 44 L14 56" stroke="#7a5a3a" stroke-width="2"/></svg>',
  elara:'<svg viewBox="0 0 60 60"><circle cx="30" cy="22" r="12" fill="#d4b89a"/><circle cx="27" cy="20" r="1.5" fill="#3a5a8a"/><circle cx="33" cy="20" r="1.5" fill="#3a5a8a"/><path d="M18 14 Q22 6 30 8 Q38 6 42 14" fill="#c4a83a" stroke="none"/><rect x="18" y="12" width="24" height="4" rx="1" fill="#7a8294"/><polygon points="30,8 28,4 32,4" fill="#c4a83a"/><rect x="24" y="32" width="12" height="22" rx="2" fill="#7a8294"/><rect x="22" y="32" width="16" height="6" rx="1" fill="#9da4b4"/><path d="M20 36 L12 42" stroke="#7a8294" stroke-width="2"/><path d="M40 36 L48 30" stroke="#7a8294" stroke-width="2.5"/><polygon points="48,30 52,26 50,34" fill="#9da4b4"/></svg>',
  garrick:'<svg viewBox="0 0 60 60"><circle cx="30" cy="24" r="12" fill="#c4a87a"/><circle cx="27" cy="22" r="1.5" fill="#3a2a1a"/><circle cx="33" cy="22" r="1.5" fill="#3a2a1a"/><path d="M26 28 Q30 30 34 28" fill="none" stroke="#7a5a3a" stroke-width="1"/><path d="M24 16 Q26 10 30 12 Q34 10 36 16" fill="#5a3a2a"/><rect x="24" y="32" width="12" height="20" rx="2" fill="#5a8a3e"/><path d="M18 36 L10 40" stroke="#5a3a2a" stroke-width="2"/><rect x="8" y="38" width="6" height="10" rx="1" fill="#c4a83a"/></svg>',
  krolgar:'<svg viewBox="0 0 60 60"><circle cx="30" cy="22" r="14" fill="#8a6a4a"/><circle cx="26" cy="20" r="2.5" fill="#c44040"/><circle cx="34" cy="20" r="2.5" fill="#c44040"/><path d="M26 28 Q30 32 34 28" fill="none" stroke="#5a3a1a" stroke-width="2"/><rect x="27" y="26" width="2" height="3" fill="#e8e0d4"/><rect x="31" y="26" width="2" height="3" fill="#e8e0d4"/><path d="M18 14 Q20 8 26 12" fill="#5a3a1a"/><path d="M42 14 Q40 8 34 12" fill="#5a3a1a"/><rect x="22" y="34" width="16" height="22" rx="3" fill="#5a2a2a"/><path d="M18 38 L6 30" stroke="#5a3a1a" stroke-width="3"/><polygon points="6,30 2,26 4,34" fill="#7a8294"/></svg>',
  ilyana:'<svg viewBox="0 0 60 60"><circle cx="30" cy="22" r="12" fill="#d4c4b0"/><circle cx="27" cy="20" r="1.5" fill="#5a2a8a"/><circle cx="33" cy="20" r="1.5" fill="#5a2a8a"/><path d="M16 16 Q20 4 30 6 Q40 4 44 16" fill="#2a1a3a" stroke="none"/><path d="M16 16 Q14 24 18 30" fill="#2a1a3a"/><path d="M44 16 Q46 24 42 30" fill="#2a1a3a"/><rect x="24" y="32" width="12" height="22" rx="2" fill="#3a1a5a"/><path d="M20 36 L12 32" stroke="#3a1a5a" stroke-width="2"/><path d="M12 32 L12 18" stroke="#5a3a2a" stroke-width="2"/><circle cx="12" cy="16" r="3" fill="#b585e0" opacity="0.6"/></svg>',
};

// ── ITEM SETS ────────────────────────────────────────────
GAME_DATA.presetSlots = ['weapon','head','body','legs','boots','shield','gloves','ring','amulet','cape','ammo'];

console.log('[Ashfall] v5.1 expansion loaded:', Object.keys(GAME_DATA.items).length, 'items,', Object.keys(GAME_DATA.monsterArt).length, 'monster arts');

// ── NEW MONSTERS ─────────────────────────────────────────
Object.assign(GAME_DATA.monsters, {
  lesser_demon: {id:'lesser_demon',name:'Lesser Demon',hp:600,maxHit:50,attackSpeed:2.6,combatLevel:45,style:'magic',evasion:{melee:30,ranged:35,magic:50},xp:1200,gold:{min:30,max:120},alignment:'CE',drops:[{item:'big_bones',qty:1,chance:1.0},{item:'death_rune',qty:3,chance:0.15},{item:'chaos_rune',qty:8,chance:0.20},{item:'gold_ring',qty:1,chance:0.03},{item:'ruby',qty:1,chance:0.04}]},
  ice_troll:    {id:'ice_troll',name:'Ice Troll',hp:450,maxHit:35,attackSpeed:2.8,combatLevel:35,style:'melee',evasion:{melee:35,ranged:30,magic:20},xp:720,gold:{min:20,max:80},alignment:'CE',drops:[{item:'big_bones',qty:1,chance:1.0},{item:'sapphire',qty:1,chance:0.06},{item:'mithril_ore',qty:2,chance:0.12},{item:'water_rune',qty:10,chance:0.20}]},
  shadow_beast: {id:'shadow_beast',name:'Shadow Beast',hp:800,maxHit:60,attackSpeed:2.2,combatLevel:55,style:'melee',evasion:{melee:50,ranged:45,magic:40},xp:1800,gold:{min:40,max:160},alignment:'NE',drops:[{item:'big_bones',qty:2,chance:1.0},{item:'death_rune',qty:5,chance:0.18},{item:'onyx',qty:1,chance:0.02},{item:'obsidian_ore',qty:2,chance:0.10}]},
  corrupted_golem:{id:'corrupted_golem',name:'Corrupted Golem',hp:2500,maxHit:80,attackSpeed:3.4,combatLevel:70,style:'melee',evasion:{melee:60,ranged:55,magic:30},xp:2800,gold:{min:80,max:300},alignment:'NN',drops:[{item:'dragon_bones',qty:1,chance:0.50},{item:'runite_ore',qty:3,chance:0.12},{item:'adamant_plate',qty:1,chance:0.03},{item:'diamond',qty:1,chance:0.05},{item:'void_crystal',qty:1,chance:0.02}]},
  phoenix:      {id:'phoenix',name:'Phoenix',hp:1800,maxHit:95,attackSpeed:2.0,combatLevel:80,style:'magic',evasion:{melee:55,ranged:50,magic:75},xp:4000,gold:{min:120,max:400},alignment:'NG',drops:[{item:'dragon_bones',qty:2,chance:1.0},{item:'fire_rune',qty:20,chance:0.30},{item:'dragonbloom',qty:1,chance:0.15},{item:'celestial_essence',qty:1,chance:0.03},{item:'fire_cape',qty:1,chance:0.005}]},
  ash_guardian: {id:'ash_guardian',name:'Ash Guardian',hp:3000,maxHit:120,attackSpeed:2.6,combatLevel:90,style:'melee',evasion:{melee:75,ranged:70,magic:55},xp:6000,gold:{min:200,max:600},alignment:'NN',drops:[{item:'dragon_bones',qty:3,chance:1.0},{item:'ashsteel_ore',qty:2,chance:0.15},{item:'celestial_essence',qty:1,chance:0.05},{item:'berserker_ring',qty:1,chance:0.003},{item:'fury_amulet',qty:1,chance:0.002}]},
  abyssal_horror:{id:'abyssal_horror',name:'Abyssal Horror',hp:4000,maxHit:140,attackSpeed:2.4,combatLevel:95,style:'magic',evasion:{melee:60,ranged:55,magic:85},xp:8000,gold:{min:300,max:800},alignment:'CE',drops:[{item:'void_bones',qty:2,chance:1.0},{item:'death_rune',qty:15,chance:0.25},{item:'celestial_essence',qty:2,chance:0.08},{item:'occult_necklace',qty:1,chance:0.003},{item:'barrows_gloves',qty:1,chance:0.002}]},
});

// ── NEW COMBAT AREAS ─────────────────────────────────────
GAME_DATA.combatAreas.push(
  {id:'frozen_caverns',name:'Frozen Caverns',levelReq:30,desc:'Ice-coated tunnels crawling with frost beasts.',monsters:['ice_troll','wolf']},
  {id:'demon_pit',name:'Demon Pit',levelReq:40,desc:'A rift into the lower planes. Demons pour out endlessly.',monsters:['lesser_demon','dark_mage']},
  {id:'shadow_realm',name:'Shadow Realm',levelReq:50,desc:'A dimension of pure darkness. Few return.',monsters:['shadow_beast','shadow_archer','void_walker']},
  {id:'golem_forge',name:'Golem Forge',levelReq:65,desc:'Ancient constructs guard this ruined forge.',monsters:['corrupted_golem','ogre']},
  {id:'phoenix_nest',name:'Phoenix Nest',levelReq:75,desc:'The burning aerie of the immortal phoenix.',monsters:['phoenix','dragon']},
  {id:'ash_citadel',name:'Ash Citadel',levelReq:85,desc:'The final fortress. Guardians of immense power.',monsters:['ash_guardian','ashfall_titan']},
  {id:'abyssal_rift',name:'Abyssal Rift',levelReq:90,desc:'The void between worlds. Unspeakable horrors dwell here.',monsters:['abyssal_horror','void_walker','demon']},
);

// Monster art for new monsters
Object.assign(GAME_DATA.monsterArt, {
  lesser_demon: GAME_DATA.monsterArt.lesser_demon || GAME_DATA.monsterArt.demon,
  ice_troll: GAME_DATA.monsterArt.ice_troll || GAME_DATA.monsterArt.troll,
  shadow_beast: GAME_DATA.monsterArt.shadow_beast || GAME_DATA.monsterArt.void_walker,
  corrupted_golem: GAME_DATA.monsterArt.corrupted_golem || GAME_DATA.monsterArt.troll,
  phoenix: GAME_DATA.monsterArt.phoenix || GAME_DATA.monsterArt.dragon,
  ash_guardian: GAME_DATA.monsterArt.ash_guardian || GAME_DATA.monsterArt.ashfall_titan,
  abyssal_horror: GAME_DATA.monsterArt.abyssal_horror || GAME_DATA.monsterArt.void_walker,
});

// Add charm drops to new monsters
for (const [mId, mon] of Object.entries(GAME_DATA.monsters)) {
  if (!mon.drops.some(d => d.item.includes('charm'))) {
    if (mon.combatLevel >= 5 && mon.combatLevel < 20)  mon.drops.push({item:'gold_charm',qty:1,chance:0.15});
    else if (mon.combatLevel >= 20 && mon.combatLevel < 40) mon.drops.push({item:'green_charm',qty:1,chance:0.12});
    else if (mon.combatLevel >= 40 && mon.combatLevel < 65) mon.drops.push({item:'crimson_charm',qty:1,chance:0.10});
    else if (mon.combatLevel >= 65) mon.drops.push({item:'blue_charm',qty:1,chance:0.08});
  }
}

// New crafting recipes for jewelry
GAME_DATA.recipes.crafting.push(
  {id:'craft_gold_ring',name:'Gold Ring',level:5,xp:15,time:3.0,input:[{item:'gold_bar',qty:1}],output:{item:'gold_ring',qty:1}},
  {id:'craft_ruby_ring',name:'Ruby Ring',level:20,xp:40,time:4.0,input:[{item:'gold_bar',qty:1},{item:'ruby',qty:1}],output:{item:'ruby_ring',qty:1}},
  {id:'craft_diamond_ring',name:'Diamond Ring',level:40,xp:80,time:5.0,input:[{item:'gold_bar',qty:2},{item:'diamond',qty:1}],output:{item:'diamond_ring',qty:1}},
  {id:'craft_onyx_ring',name:'Onyx Ring',level:60,xp:150,time:6.0,input:[{item:'gold_bar',qty:2},{item:'onyx',qty:1}],output:{item:'onyx_ring',qty:1}},
  {id:'craft_gold_amulet',name:'Gold Amulet',level:8,xp:20,time:3.5,input:[{item:'gold_bar',qty:2}],output:{item:'gold_amulet',qty:1}},
  {id:'craft_ruby_amulet',name:'Ruby Amulet',level:25,xp:50,time:4.5,input:[{item:'gold_bar',qty:2},{item:'ruby',qty:1}],output:{item:'ruby_amulet',qty:1}},
  {id:'craft_glory_amulet',name:'Amulet of Glory',level:45,xp:100,time:6.0,input:[{item:'gold_bar',qty:3},{item:'diamond',qty:1},{item:'enchant_dust',qty:5}],output:{item:'glory_amulet',qty:1}},
  {id:'craft_obsidian_cape',name:'Obsidian Cape',level:50,xp:120,time:7.0,input:[{item:'obsidian_bar',qty:3},{item:'hard_leather',qty:5}],output:{item:'obsidian_cape',qty:1}},
  {id:'craft_combat_bracelet',name:'Combat Bracelet',level:35,xp:70,time:5.0,input:[{item:'gold_bar',qty:2},{item:'sapphire',qty:1},{item:'ruby',qty:1}],output:{item:'combat_bracelet',qty:1}},
  {id:'craft_leather_gloves',name:'Leather Gloves',level:1,xp:5,time:2.0,input:[{item:'leather',qty:2}],output:{item:'leather_gloves',qty:1}},
);

console.log('[Ashfall] v5.2 loaded:', Object.keys(GAME_DATA.monsters).length, 'monsters,', GAME_DATA.combatAreas.length, 'areas');

// ================================================================
// v5.3 FISHING ZONES (50 fish), WILDERNESS PVP, DEATH MECHANICS
// ================================================================

// ── 50 FISH + ZONE SYSTEM ────────────────────────────────
// Each zone has a pool of fish you can catch. You don't always
// get the same fish - RNG picks from the zone's pool based on
// weight. Higher level fish are rarer.

// Raw fish items (new ones)
const _newFish = [
  ['raw_sardine','Raw Sardine','resource','fish',4,'A small oily fish.'],
  ['raw_herring','Raw Herring','resource','fish',6,'A silver herring.'],
  ['raw_anchovy','Raw Anchovy','resource','fish',3,'Tiny but useful.'],
  ['raw_mackerel','Raw Mackerel','resource','fish',8,'A striped mackerel.'],
  ['raw_tuna','Raw Tuna','resource','fish',20,'A hefty tuna.'],
  ['raw_bass','Raw Bass','resource','fish',25,'A largemouth bass.'],
  ['raw_pike','Raw Pike','resource','fish',15,'A freshwater pike.'],
  ['raw_catfish','Raw Catfish','resource','fish',12,'A whiskered catfish.'],
  ['raw_carp','Raw Carp','resource','fish',10,'A common carp.'],
  ['raw_cod','Raw Cod','resource','fish',18,'Atlantic cod.'],
  ['raw_snapper','Raw Snapper','resource','fish',35,'A red snapper.'],
  ['raw_barracuda','Raw Barracuda','resource','fish',45,'A fierce barracuda.'],
  ['raw_monkfish','Raw Monkfish','resource','fish',60,'An ugly but tasty fish.'],
  ['raw_shark','Raw Shark','resource','fish',100,'A dangerous catch.'],
  ['raw_sea_turtle','Raw Sea Turtle','resource','fish',150,'A massive sea turtle.'],
  ['raw_ray','Raw Manta Ray','resource','fish',200,'Enormous and graceful.'],
  ['raw_karambwan','Raw Karambwan','resource','fish',80,'A poisonous delicacy.'],
  ['raw_eel','Raw Eel','resource','fish',30,'A slippery eel.'],
  ['raw_cave_eel','Raw Cave Eel','resource','fish',40,'An underground eel.'],
  ['raw_lava_eel','Raw Lava Eel','resource','fish',120,'Lives in magma pools.'],
  ['raw_infernal_eel','Raw Infernal Eel','resource','fish',180,'Burns to the touch.'],
  ['raw_sacred_eel','Raw Sacred Eel','resource','fish',250,'A blessed serpent.'],
  ['raw_anglerfish','Raw Anglerfish','resource','fish',140,'Deep sea predator.'],
  ['raw_ice_fish','Raw Ice Fish','resource','fish',90,'Found in frozen waters.'],
  ['raw_void_fish','Raw Void Fish','resource','fish',300,'From between dimensions.'],
  ['raw_ghost_fish','Raw Ghost Fish','resource','fish',160,'Translucent and eerie.'],
  ['raw_golden_tench','Raw Golden Tench','resource','fish',400,'Extremely rare.'],
  ['raw_ash_crab','Raw Ash Crab','resource','fish',220,'Volcanic crustacean.'],
  ['raw_kraken_tentacle','Kraken Tentacle','resource','fish',500,'A trophy catch.'],
  ['raw_leviathan_scale','Leviathan Scale','resource','fish',350,'Shimmers with power.'],
];
for (const [id,name,type,sub,price,desc] of _newFish) {
  if (!GAME_DATA.items[id]) GAME_DATA.items[id] = {id,name,type,subtype:sub,sellPrice:price,sprite:'fish-basic',desc};
}

// Cooked versions
const _cookedFish = [
  ['sardine','Sardine','food',20,6],['herring','Herring','food',30,8],['anchovy','Anchovy','food',15,5],
  ['mackerel','Mackerel','food',40,12],['tuna','Tuna','food',100,30],['bass','Bass','food',120,35],
  ['pike','Pike','food',60,18],['catfish','Catfish','food',50,15],['carp','Carp','food',35,12],
  ['cod','Cod','food',80,25],['snapper','Snapper','food',160,50],['barracuda','Barracuda','food',200,60],
  ['monkfish','Monkfish','food',300,80],['shark','Shark','food',450,130],['sea_turtle','Sea Turtle','food',600,200],
  ['karambwan','Karambwan','food',350,100],['eel','Eel','food',80,35],['cave_eel','Cave Eel','food',120,50],
  ['lava_eel','Lava Eel','food',400,150],['infernal_eel','Infernal Eel','food',550,220],['sacred_eel','Sacred Eel','food',700,300],
  ['ice_fish','Ice Fish','food',380,110],['void_fish','Void Fish','food',800,400],['ghost_fish','Ghost Fish','food',500,200],
  ['golden_tench','Golden Tench','food',900,500],['ash_crab','Ash Crab','food',650,280],
];
for (const [id,name,type,heals,price] of _cookedFish) {
  if (!GAME_DATA.items[id]) GAME_DATA.items[id] = {id,name,type,heals,sellPrice:price,sprite:'food-meal',desc:`Cooked ${name.toLowerCase()}. +${heals} HP.`};
}

// Fishing Zones - replace single-fish spots with zone pools
GAME_DATA.fishingZones = [
  {id:'shore_pond',name:'Shore Pond',level:1,desc:'Calm shallow waters.',fish:[
    {item:'raw_shrimp',weight:40,xp:10},{item:'raw_sardine',weight:30,xp:12},{item:'raw_anchovy',weight:20,xp:8},{item:'raw_herring',weight:10,xp:18}
  ],time:3.0},
  {id:'river_bend',name:'River Bend',level:10,desc:'A gentle river teeming with life.',fish:[
    {item:'raw_trout',weight:30,xp:30},{item:'raw_pike',weight:25,xp:35},{item:'raw_carp',weight:25,xp:20},{item:'raw_catfish',weight:15,xp:28},{item:'raw_herring',weight:5,xp:18}
  ],time:3.5},
  {id:'lake_crossing',name:'Lake Crossing',level:20,desc:'A wide lake with diverse catches.',fish:[
    {item:'raw_salmon',weight:25,xp:50},{item:'raw_bass',weight:25,xp:55},{item:'raw_pike',weight:20,xp:35},{item:'raw_catfish',weight:15,xp:28},{item:'raw_trout',weight:10,xp:30},{item:'raw_eel',weight:5,xp:45}
  ],time:4.0},
  {id:'coastal_reef',name:'Coastal Reef',level:30,desc:'Rocky coastline with saltwater species.',fish:[
    {item:'raw_lobster',weight:25,xp:70},{item:'raw_cod',weight:25,xp:60},{item:'raw_mackerel',weight:20,xp:45},{item:'raw_snapper',weight:15,xp:85},{item:'raw_cave_eel',weight:10,xp:65},{item:'raw_tuna',weight:5,xp:90}
  ],time:4.5},
  {id:'deep_ocean',name:'Deep Ocean',level:45,desc:'Far from shore. Big game fish lurk.',fish:[
    {item:'raw_swordfish',weight:25,xp:120},{item:'raw_tuna',weight:20,xp:90},{item:'raw_barracuda',weight:20,xp:110},{item:'raw_snapper',weight:15,xp:85},{item:'raw_monkfish',weight:12,xp:140},{item:'raw_shark',weight:5,xp:180},{item:'raw_karambwan',weight:3,xp:160}
  ],time:5.5},
  {id:'sunken_cavern',name:'Sunken Cavern',level:55,desc:'Underground waterways. Strange creatures.',fish:[
    {item:'raw_cave_eel',weight:25,xp:65},{item:'raw_monkfish',weight:25,xp:140},{item:'raw_karambwan',weight:20,xp:160},{item:'raw_ghost_fish',weight:15,xp:200},{item:'raw_ice_fish',weight:10,xp:180},{item:'raw_anglerfish',weight:5,xp:220}
  ],time:6.0},
  {id:'frozen_trawl',name:'Frozen Trawl',level:65,desc:'Ice-crusted waters of the north.',fish:[
    {item:'raw_ice_fish',weight:30,xp:180},{item:'raw_shark',weight:25,xp:250},{item:'raw_anglerfish',weight:20,xp:220},{item:'raw_sea_turtle',weight:12,xp:300},{item:'raw_ghost_fish',weight:8,xp:200},{item:'raw_sacred_eel',weight:5,xp:350}
  ],time:7.0},
  {id:'volcanic_pools',name:'Volcanic Pools',level:75,desc:'Bubbling magma-heated pools.',fish:[
    {item:'raw_lava_eel',weight:30,xp:280},{item:'raw_infernal_eel',weight:25,xp:350},{item:'raw_ash_crab',weight:20,xp:320},{item:'raw_shark',weight:12,xp:250},{item:'raw_dark_crab',weight:8,xp:380},{item:'raw_sacred_eel',weight:5,xp:400}
  ],time:8.0},
  {id:'abyssal_depths',name:'Abyssal Depths',level:85,desc:'The deepest ocean trenches.',fish:[
    {item:'raw_sea_turtle',weight:25,xp:300},{item:'raw_dark_crab',weight:25,xp:380},{item:'raw_manta',weight:15,xp:450},{item:'raw_void_fish',weight:12,xp:500},{item:'raw_sacred_eel',weight:10,xp:400},{item:'raw_leviathan_scale',weight:5,xp:600},{item:'raw_golden_tench',weight:3,xp:700},{item:'raw_kraken_tentacle',weight:2,xp:800}
  ],time:10.0},
];

// Cooking recipes for new fish
const _cookRecipes = [
  ['sardine',1,8,2],['herring',5,12,2.5],['anchovy',1,6,2],['mackerel',10,18,2.5],
  ['tuna',25,50,3],['bass',28,55,3],['pike',15,30,3],['catfish',12,25,2.5],['carp',8,18,2.5],
  ['cod',20,40,3],['snapper',35,65,3.5],['barracuda',42,80,3.5],['monkfish',50,100,4],
  ['shark',60,150,4.5],['sea_turtle',70,200,5],['karambwan',55,130,4],['eel',22,40,3],
  ['cave_eel',30,55,3.5],['lava_eel',65,170,5],['infernal_eel',75,220,5],['sacred_eel',82,280,5.5],
  ['ice_fish',58,140,4.5],['void_fish',88,350,6],['ghost_fish',68,180,5],
  ['golden_tench',92,400,6],['ash_crab',78,250,5.5],
];
for (const [id,level,xp,time] of _cookRecipes) {
  if (!GAME_DATA.recipes.cooking.find(r=>r.output?.item===id)) {
    GAME_DATA.recipes.cooking.push({id:'cook_'+id,name:'Cook '+id.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),level,xp,time,input:[{item:'raw_'+id,qty:1}],output:{item:id,qty:1},burnChance:Math.max(0.02,0.15-level*0.001)});
  }
}

// ── WILDERNESS PVP SYSTEM ────────────────────────────────
GAME_DATA.wildernessLevels = [
  {id:'wild_1',name:'Wilderness (Lv 1-10)',minCb:1,maxCb:10,monsters:['rat','goblin','skeleton'],pvpChance:0.05},
  {id:'wild_2',name:'Wilderness (Lv 10-25)',minCb:10,maxCb:25,monsters:['bandit','wolf','skeleton'],pvpChance:0.08},
  {id:'wild_3',name:'Wilderness (Lv 25-45)',minCb:25,maxCb:45,monsters:['troll','dark_mage','shadow_archer'],pvpChance:0.10},
  {id:'wild_4',name:'Wilderness (Lv 45-65)',minCb:45,maxCb:65,monsters:['demon','lesser_demon','wyvern'],pvpChance:0.12},
  {id:'wild_5',name:'Deep Wilderness (Lv 65+)',minCb:65,maxCb:99,monsters:['dragon','void_walker','ash_guardian'],pvpChance:0.15},
];

// ── PROTECTION JEWELRY ───────────────────────────────────
// These items save you from full death at the cost of 2% total XP
GAME_DATA.items.ring_of_life = {id:'ring_of_life',name:'Ring of Life',type:'armor',slot:'ring',stats:{defenceBonus:2},levelReq:{},sellPrice:5000,sprite:'ring-gold',desc:'Saves you from death ONCE. Costs 2% total XP. Consumed on use.',deathSave:true,unique:true};
GAME_DATA.items.phoenix_necklace = {id:'phoenix_necklace',name:'Phoenix Necklace',type:'armor',slot:'amulet',stats:{defenceBonus:4,magicBonus:4},levelReq:{},sellPrice:8000,sprite:'amulet-red',desc:'Revives you at 30% HP on lethal damage. Consumed. Costs 2% XP.',deathSave:true,unique:true};

// Crafting recipes for protection jewelry
GAME_DATA.recipes.crafting.push(
  {id:'craft_ring_of_life',name:'Ring of Life',level:55,xp:200,time:8.0,input:[{item:'diamond_ring',qty:1},{item:'celestial_essence',qty:1}],output:{item:'ring_of_life',qty:1}},
  {id:'craft_phoenix_necklace',name:'Phoenix Necklace',level:65,xp:300,time:10.0,input:[{item:'ruby_amulet',qty:1},{item:'celestial_essence',qty:2},{item:'dragonbloom',qty:1}],output:{item:'phoenix_necklace',qty:1}},
);

// ── SPELLS: TELEHOME + TELEBLOCK ─────────────────────────
GAME_DATA.spells.push(
  {id:'telehome',name:'TeleHome',level:25,maxHit:0,runes:[{item:'fire_rune',qty:3},{item:'air_rune',qty:5}],desc:'Teleport out of wilderness combat. Can be blocked.',isTeleport:true},
);

// TeleBlock for PvP - 35% chance to work, 5 min cooldown, blocks for 10 combat ticks
GAME_DATA.pvpSpells = [
  {id:'teleblock',name:'TeleBlock',level:35,runes:[{item:'chaos_rune',qty:3},{item:'death_rune',qty:1}],desc:'35% chance to block enemy teleport for 10 combat rounds. 5 min cooldown.',blockChance:0.35,blockDuration:10,cooldown:300},
];

console.log('[Ashfall] v5.3 loaded: Fishing zones, wilderness PvP, protection jewelry');
console.log('  Fish items:', Object.keys(GAME_DATA.items).filter(k=>k.startsWith('raw_')).length);
console.log('  Cooking recipes:', GAME_DATA.recipes.cooking.length);

// ================================================================
// v5.4 INCANTATION CRAFTING (Runecrafting)
// ================================================================

// ── PURE ESSENCE (higher tier essence for advanced runes) ──
GAME_DATA.items.pure_essence = {id:'pure_essence',name:'Pure Essence',type:'resource',subtype:'misc',sellPrice:8,sprite:'misc-essence',desc:'Purified magical essence. Required for advanced runes.'};

// Add pure essence mining at higher level
GAME_DATA.gatheringActions.mining.push(
  {id:'mine_pure_essence',name:'Pure Essence',level:30,xp:40,time:2.5,loot:[{item:'pure_essence',qty:1}],masteryId:'pure_ess',gemChance:0},
);

// ── ALL RUNE TYPES ───────────────────────────────────────
// Elemental (basic - rune essence)
// Already exist: fire_rune, water_rune, earth_rune, air_rune

// Catalytic + Advanced (pure essence required)
const _newRunes = [
  ['mind_rune','Mind Rune','resource','rune',4,'rune-cyan','Weakens the mind of foes.'],
  ['body_rune','Body Rune','resource','rune',4,'rune-blue','Channels bodily energy.'],
  ['cosmic_rune','Cosmic Rune','resource','rune',15,'rune-purple','Channels cosmic energy for enchanting.'],
  ['nature_rune','Nature Rune','resource','rune',30,'rune-green','Used in alchemy and binding spells.'],
  ['law_rune','Law Rune','resource','rune',45,'rune-white','Used in teleportation magic.'],
  ['astral_rune','Astral Rune','resource','rune',50,'rune-cyan','Used in lunar magic.'],
  ['blood_rune','Blood Rune','resource','rune',80,'rune-red','Fuels blood magic spells.'],
  ['soul_rune','Soul Rune','resource','rune',120,'rune-purple','Contains trapped soul energy.'],
  ['wrath_rune','Wrath Rune','resource','rune',200,'rune-red','The most destructive rune. Pure fury.'],
];
for (const [id,name,type,sub,price,sprite,desc] of _newRunes) {
  if (!GAME_DATA.items[id]) GAME_DATA.items[id] = {id,name,type,subtype:sub,sellPrice:price,sprite,desc};
}

// ── ALTARS ────────────────────────────────────────────────
// Each altar is used to craft a specific rune type
// Altars define: which rune, what essence, level req, xp, multiplier at higher levels
GAME_DATA.altars = [
  {id:'air_altar',    name:'Air Altar',    rune:'air_rune',    essence:'rune_essence', level:1,  xp:5,  baseQty:1, desc:'A weathered stone circle open to the sky. Wind howls through carved channels.'},
  {id:'mind_altar',   name:'Mind Altar',   rune:'mind_rune',   essence:'rune_essence', level:2,  xp:6,  baseQty:1, desc:'A pulsing crystalline altar. Thoughts echo louder near it.'},
  {id:'water_altar',  name:'Water Altar',  rune:'water_rune',  essence:'rune_essence', level:5,  xp:7,  baseQty:1, desc:'An altar submerged in a grotto pool. Water glows blue around it.'},
  {id:'earth_altar',  name:'Earth Altar',  rune:'earth_rune',  essence:'rune_essence', level:9,  xp:8,  baseQty:1, desc:'Buried deep underground. Roots wrap its surface.'},
  {id:'fire_altar',   name:'Fire Altar',   rune:'fire_rune',   essence:'rune_essence', level:14, xp:9,  baseQty:1, desc:'A scorching altar wreathed in perpetual flame.'},
  {id:'body_altar',   name:'Body Altar',   rune:'body_rune',   essence:'rune_essence', level:20, xp:10, baseQty:1, desc:'An organic altar that pulses like a heartbeat.'},
  {id:'cosmic_altar', name:'Cosmic Altar', rune:'cosmic_rune', essence:'pure_essence', level:27, xp:14, baseQty:1, desc:'Floats among starlight in a pocket dimension.'},
  {id:'chaos_altar',  name:'Chaos Altar',  rune:'chaos_rune',  essence:'pure_essence', level:35, xp:18, baseQty:1, desc:'An unstable altar crackling with raw chaotic energy.'},
  {id:'astral_altar', name:'Astral Altar', rune:'astral_rune', essence:'pure_essence', level:40, xp:20, baseQty:1, desc:'A silver altar bathed in moonlight. Only visible at night.'},
  {id:'nature_altar', name:'Nature Altar', rune:'nature_rune', essence:'pure_essence', level:44, xp:22, baseQty:1, desc:'Overgrown with living vines. Nature itself guards this altar.'},
  {id:'law_altar',    name:'Law Altar',    rune:'law_rune',    essence:'pure_essence', level:54, xp:28, baseQty:1, desc:'A perfectly symmetrical marble altar radiating order.'},
  {id:'death_altar',  name:'Death Altar',  rune:'death_rune',  essence:'pure_essence', level:65, xp:35, baseQty:1, desc:'A bone-white altar in a realm of perpetual twilight.'},
  {id:'blood_altar',  name:'Blood Altar',  rune:'blood_rune',  essence:'pure_essence', level:77, xp:45, baseQty:1, desc:'Crimson veins run through this altar. It demands sacrifice.'},
  {id:'soul_altar',   name:'Soul Altar',   rune:'soul_rune',   essence:'pure_essence', level:90, xp:60, baseQty:1, desc:'Whispers of the dead surround this ethereal altar.'},
  {id:'wrath_altar',  name:'Wrath Altar',  rune:'wrath_rune',  essence:'pure_essence', level:95, xp:80, baseQty:1, desc:'The final altar. Reality fractures around its surface. Only the most powerful incantors dare approach.'},
];

// ── INCANTATION CRAFTING RECIPES ─────────────────────────
// Generated from altars: 1 essence = 1 rune (+ bonus qty at higher levels)
GAME_DATA.recipes.incantation = [];
for (const altar of GAME_DATA.altars) {
  // Single craft
  GAME_DATA.recipes.incantation.push({
    id: 'craft_' + altar.rune,
    name: 'Craft ' + GAME_DATA.items[altar.rune].name,
    level: altar.level,
    xp: altar.xp,
    time: 2.0,
    input: [{item: altar.essence, qty: 1}],
    output: {item: altar.rune, qty: altar.baseQty},
    altar: altar.id,
    altarName: altar.name,
    altarDesc: altar.desc,
  });
  // Bulk craft (10x)
  GAME_DATA.recipes.incantation.push({
    id: 'craft_' + altar.rune + '_x10',
    name: 'Craft ' + GAME_DATA.items[altar.rune].name + ' (x10)',
    level: altar.level + 5,
    xp: altar.xp * 10,
    time: 15.0,
    input: [{item: altar.essence, qty: 10}],
    output: {item: altar.rune, qty: 10},
    altar: altar.id,
    altarName: altar.name,
  });
}

// ── MULTIPLIER TIERS (bonus runes at higher levels) ──────
// At certain levels above the altar requirement, you craft extra runes per essence
// This is applied in the engine during completeAction
GAME_DATA.runeMultipliers = [
  {levelsAbove: 0,  mult: 1},    // base
  {levelsAbove: 10, mult: 2},    // double runes
  {levelsAbove: 25, mult: 3},    // triple
  {levelsAbove: 45, mult: 4},    // quad
  {levelsAbove: 70, mult: 5},    // quintuple
  {levelsAbove: 90, mult: 6},    // max multiplier
];

// ── UPDATE SPELLS TO USE NEW RUNES ───────────────────────
// Add spells that use the new rune types
GAME_DATA.spells.push(
  {id:'mind_blast',   name:'Mind Blast',   level:20, maxHit:35, runes:[{item:'mind_rune',qty:2},{item:'air_rune',qty:2}], desc:'Stun the target briefly.', statusChance:{freeze:0.15}},
  {id:'cosmic_bolt',  name:'Cosmic Bolt',  level:40, maxHit:65, runes:[{item:'cosmic_rune',qty:1},{item:'chaos_rune',qty:1}], desc:'A bolt of cosmic energy.'},
  {id:'nature_bind',  name:'Nature Bind',  level:50, maxHit:50, runes:[{item:'nature_rune',qty:2},{item:'earth_rune',qty:3}], desc:'Roots hold the target. Poison stacks.', statusChance:{poison:0.50}},
  {id:'blood_barrage', name:'Blood Barrage',level:70, maxHit:95, runes:[{item:'blood_rune',qty:2},{item:'death_rune',qty:2},{item:'soul_rune',qty:1}], desc:'Devastating blood magic. Heals 15% of damage dealt.', lifesteal:0.15},
  {id:'soul_split',   name:'Soul Split',   level:80, maxHit:85, runes:[{item:'soul_rune',qty:2},{item:'blood_rune',qty:1}], desc:'Split enemy soul. Heal 25% dealt.', lifesteal:0.25},
  {id:'wrath_of_ash', name:'Wrath of Ash', level:92, maxHit:150,runes:[{item:'wrath_rune',qty:3},{item:'death_rune',qty:3},{item:'blood_rune',qty:2}], desc:'The ultimate destructive spell. Burns and bleeds.', statusChance:{burn:0.80,bleed:0.80}},
);

// Add new runes to shop
GAME_DATA.shop.push(
  {item:'mind_rune',price:10,category:'runes'},
  {item:'body_rune',price:10,category:'runes'},
  {item:'cosmic_rune',price:40,category:'runes'},
  {item:'nature_rune',price:80,category:'runes'},
  {item:'law_rune',price:120,category:'runes'},
  {item:'pure_essence',price:12,category:'materials'},
);

console.log('[Ashfall] v5.4 loaded: Incantation Crafting');
console.log('  Altars:', GAME_DATA.altars.length);
console.log('  Rune recipes:', GAME_DATA.recipes.incantation.length);
console.log('  Spells:', GAME_DATA.spells.length);

// ================================================================
// v5.5 ITEM RARITY SYSTEM + EXPANDED DROPS
// ================================================================

// ── RARITY TIERS ─────────────────────────────────────────
GAME_DATA.rarities = {
  common:    {id:'common',    name:'Common',    color:'#a0a0a0', weight:100},
  uncommon:  {id:'uncommon',  name:'Uncommon',  color:'#4a8a3e', weight:50},
  rare:      {id:'rare',      name:'Rare',      color:'#4a90d4', weight:20},
  epic:      {id:'epic',      name:'Epic',      color:'#b585e0', weight:8},
  legendary: {id:'legendary', name:'Legendary', color:'#d4a83a', weight:3},
  mythic:    {id:'mythic',    name:'Mythic',    color:'#c44040', weight:1},
};

// Assign rarity to ALL items
(function assignRarities() {
  for (const [id, item] of Object.entries(GAME_DATA.items)) {
    if (item.rarity) continue; // already assigned
    // Mythic: best-in-slot uniques
    if (['barrows_gloves','fire_cape','berserker_ring','archers_ring','seers_ring','fury_amulet','occult_necklace','ava_accumulator','mage_cape'].includes(id)) {
      item.rarity = 'mythic';
    }
    // Legendary: ashsteel gear, enchanted obsidian, protection jewelry
    else if (id.startsWith('ashsteel_') || id.includes('ench_obsidian') || id.includes('ench_elder') || ['ring_of_life','phoenix_necklace','dragon_scimitar'].includes(id)) {
      item.rarity = 'legendary';
    }
    // Epic: enchanted adamant/mithril, dragon gear, high-end
    else if (id.includes('ench_adamant') || id.includes('ench_mithril') || id.includes('ench_dragon') || id.includes('ench_archmage') || id.includes('ench_adept') || id.startsWith('dragon_') && item.type === 'weapon' || ['onyx_ring','diamond_ring','glory_amulet','combat_bracelet','obsidian_cape','void_crystal','celestial_essence','onyx'].includes(id)) {
      item.rarity = 'epic';
    }
    // Rare: enchanted steel, mid-tier gear, gems
    else if (id.includes('ench_steel') || id.includes('ench_maple') || id.includes('ench_mystic') || id.startsWith('adamant_') || id.startsWith('obsidian_') || ['ruby_ring','ruby_amulet','diamond','emerald','arcane_shard','enchant_scroll','wrath_rune','soul_rune','blood_rune'].includes(id)) {
      item.rarity = 'rare';
    }
    // Uncommon: mithril gear, mid resources, decent consumables
    else if (id.startsWith('mithril_') || id.startsWith('steel_') && item.type !== 'resource' || ['ruby','sapphire','death_rune','chaos_rune','cosmic_rune','nature_rune','law_rune','astral_rune','super_strength','super_defence','super_attack','prayer_potion','super_restore','gold_ring','gold_amulet','shark','manta_ray','dark_crab','sacred_eel','void_fish','golden_tench'].includes(id)) {
      item.rarity = 'uncommon';
    }
    // Common: everything else
    else {
      item.rarity = 'common';
    }
  }
})();

// ── EXPANDED MONSTER DROP TABLES ─────────────────────────
// Add rare/unique drops to monsters that are missing them
const _dropExpansions = {
  goblin: [{item:'topaz',qty:1,chance:0.03},{item:'leather_gloves',qty:1,chance:0.02}],
  skeleton: [{item:'mind_rune',qty:5,chance:0.15},{item:'body_rune',qty:3,chance:0.10}],
  bandit: [{item:'gold_ring',qty:1,chance:0.02},{item:'ruby',qty:1,chance:0.02}],
  wolf: [{item:'gold_charm',qty:1,chance:0.12}],
  troll: [{item:'nature_rune',qty:5,chance:0.08},{item:'combat_bracelet',qty:1,chance:0.005}],
  dark_mage: [{item:'cosmic_rune',qty:3,chance:0.12},{item:'astral_rune',qty:2,chance:0.08},{item:'law_rune',qty:1,chance:0.05}],
  shadow_archer: [{item:'obsidian_arrows',qty:10,chance:0.08}],
  ogre: [{item:'nature_rune',qty:8,chance:0.10},{item:'onyx_ring',qty:1,chance:0.003}],
  wyvern: [{item:'law_rune',qty:3,chance:0.10},{item:'diamond_ring',qty:1,chance:0.004}],
  demon: [{item:'blood_rune',qty:3,chance:0.08},{item:'soul_rune',qty:1,chance:0.03}],
  dragon: [{item:'blood_rune',qty:5,chance:0.10},{item:'soul_rune',qty:2,chance:0.05},{item:'dragon_arrows',qty:15,chance:0.08}],
  void_walker: [{item:'soul_rune',qty:5,chance:0.12},{item:'wrath_rune',qty:1,chance:0.03},{item:'seers_ring',qty:1,chance:0.002}],
  lesser_demon: [{item:'blood_rune',qty:2,chance:0.10},{item:'cosmic_rune',qty:3,chance:0.15}],
  shadow_beast: [{item:'soul_rune',qty:2,chance:0.06},{item:'archers_ring',qty:1,chance:0.002}],
  corrupted_golem: [{item:'wrath_rune',qty:1,chance:0.04},{item:'glory_amulet',qty:1,chance:0.005}],
  phoenix: [{item:'wrath_rune',qty:2,chance:0.06},{item:'celestial_essence',qty:1,chance:0.05}],
  ash_guardian: [{item:'wrath_rune',qty:3,chance:0.08},{item:'ashsteel_bar',qty:1,chance:0.05}],
  abyssal_horror: [{item:'wrath_rune',qty:5,chance:0.10},{item:'soul_rune',qty:5,chance:0.15}],
  ashfall_titan: [{item:'wrath_rune',qty:8,chance:0.20},{item:'celestial_essence',qty:3,chance:0.15},{item:'ashsteel_bar',qty:3,chance:0.10}],
  ashling: [{item:'fire_rune',qty:10,chance:0.20},{item:'blood_rune',qty:2,chance:0.05}],
  frost_wraith: [{item:'water_rune',qty:15,chance:0.25},{item:'astral_rune',qty:3,chance:0.08},{item:'ice_fish',qty:1,chance:0.10}],
  hollow_lord: [{item:'death_rune',qty:8,chance:0.15},{item:'soul_rune',qty:3,chance:0.06},{item:'enchant_scroll',qty:1,chance:0.05}],
  bloodfang_alpha: [{item:'blood_rune',qty:5,chance:0.12},{item:'ruby_amulet',qty:1,chance:0.03}],
  ice_troll: [{item:'water_rune',qty:8,chance:0.20},{item:'cosmic_rune',qty:2,chance:0.06}],
};
for (const [mId, newDrops] of Object.entries(_dropExpansions)) {
  if (GAME_DATA.monsters[mId]) {
    for (const drop of newDrops) {
      if (!GAME_DATA.monsters[mId].drops.some(d => d.item === drop.item)) {
        GAME_DATA.monsters[mId].drops.push(drop);
      }
    }
  }
}

// Also expand world boss rewards
for (const wb of GAME_DATA.worldBosses) {
  if (!wb.rewards) wb.rewards = [];
  if (wb.id === 'blight_warden') { wb.rewards.push({item:'soul_rune',qty:10,chance:0.30}); wb.rewards.push({item:'ring_of_life',qty:1,chance:0.01}); }
  if (wb.id === 'storm_reaver') { wb.rewards.push({item:'wrath_rune',qty:5,chance:0.25}); wb.rewards.push({item:'phoenix_necklace',qty:1,chance:0.008}); }
  if (wb.id === 'ashen_overlord') { wb.rewards.push({item:'wrath_rune',qty:10,chance:0.30}); wb.rewards.push({item:'barrows_gloves',qty:1,chance:0.005}); wb.rewards.push({item:'fury_amulet',qty:1,chance:0.003}); }
}

console.log('[Ashfall] v5.5 loaded: Rarity system, expanded drops');
console.log('  Mythic items:', Object.values(GAME_DATA.items).filter(i=>i.rarity==='mythic').length);
console.log('  Legendary:', Object.values(GAME_DATA.items).filter(i=>i.rarity==='legendary').length);
console.log('  Epic:', Object.values(GAME_DATA.items).filter(i=>i.rarity==='epic').length);
console.log('  Rare:', Object.values(GAME_DATA.items).filter(i=>i.rarity==='rare').length);
console.log('  Uncommon:', Object.values(GAME_DATA.items).filter(i=>i.rarity==='uncommon').length);

// ── BUG FIX: Missing gold_ore + gold_bar ─────────────────
GAME_DATA.items.gold_ore = {id:'gold_ore',name:'Gold Ore',type:'resource',subtype:'ore',sellPrice:60,sprite:'ore-gold',desc:'A shimmering gold ore.',rarity:'uncommon'};
GAME_DATA.items.gold_bar = {id:'gold_bar',name:'Gold Bar',type:'resource',subtype:'bar',sellPrice:150,sprite:'bar-gold',desc:'A refined gold ingot.',rarity:'uncommon'};

// Mining spot for gold
GAME_DATA.gatheringActions.mining.push(
  {id:'mine_gold',name:'Gold Vein',level:40,xp:120,time:6.0,loot:[{item:'gold_ore',qty:1}],masteryId:'gold',gemChance:0.05},
);

// Smelting recipe
GAME_DATA.recipes.smithing.push(
  {id:'smelt_gold',name:'Smelt Gold Bar',level:40,xp:80,time:5.0,input:[{item:'gold_ore',qty:1}],output:{item:'gold_bar',qty:1}},
);

// Add gold ore to some monster drops
GAME_DATA.monsters.ogre.drops.push({item:'gold_ore',qty:2,chance:0.08});
GAME_DATA.monsters.dragon.drops.push({item:'gold_ore',qty:3,chance:0.12});

console.log('[Ashfall] Gold ore/bar fix applied. Items:', Object.keys(GAME_DATA.items).length);

// ── MORE ACHIEVEMENTS ────────────────────────────────────
GAME_DATA.achievements.push(
  {id:'runecraft_1',  name:'Rune Apprentice',   desc:'Craft your first rune.',     check:(g)=>(g.stats.totalActions.incantation||0)>=1},
  {id:'runecraft_50', name:'Rune Adept',         desc:'Incantation level 50.',      check:(g)=>g.skills.incantation?.level>=50},
  {id:'runecraft_99', name:'Rune Master',        desc:'Incantation level 99.',      check:(g)=>g.skills.incantation?.level>=99},
  {id:'pvp_first',    name:'First Blood',        desc:'Win your first PvP fight.',  check:(g)=>(g.stats.pvpKills||0)>=1},
  {id:'pvp_10',       name:'Serial Killer',      desc:'Win 10 PvP fights.',         check:(g)=>(g.stats.pvpKills||0)>=10},
  {id:'pvp_streak_5', name:'Unstoppable',        desc:'PvP streak of 5.',           check:(g)=>(g.stats.pvpBestStreak||0)>=5},
  {id:'wild_survivor',name:'Wilderness Survivor', desc:'Survive 50 wilderness fights.',check:(g)=>(g.stats.pvpKills||0)+(g.stats.monstersKilled||0)>=50},
  {id:'fish_50_types',name:'Master Angler',      desc:'Catch 50+ different fish.',  check:(g)=>{const f=Object.keys(g.bank).filter(k=>k.startsWith('raw_'));return f.length>=15;}},
  {id:'jeweler',      name:'Jeweler',            desc:'Craft 5 pieces of jewelry.', check:(g)=>(g.stats.itemsCrafted||0)>=5},
  {id:'crit_machine', name:'Critical Mass',      desc:'Land a 100+ damage crit.',   check:(g)=>(g.stats.highestHit||0)>=100},
  {id:'millionaire',  name:'Millionaire',        desc:'Hold 1,000,000 gold.',       check:(g)=>g.gold>=1000000},
  {id:'dark_side',    name:'Dark Side',          desc:'Shift to Evil alignment.',   check:(g)=>g.alignment?.includes('evil')},
  {id:'full_mythic',  name:'Mythic Collector',   desc:'Own 3+ mythic items.',       check:(g)=>{let c=0;for(const[k,v]of Object.entries(g.bank)){if(v>0&&GAME_DATA?.items[k]?.rarity==='mythic')c++;}for(const v of Object.values(g.equipment)){if(v&&GAME_DATA?.items[v]?.rarity==='mythic')c++;}return c>=3;}},
  {id:'bazaar_seller', name:'Merchant Prince',   desc:'Sell an item on the Bazaar.',check:(g)=>(g.stats.bazaarSales||0)>=1},
  {id:'story_ch1',    name:'Chapter 1 Complete', desc:'Complete Ashfall Prophecy Ch1.',check:(g)=>g.storyline?.main_story?.chapter>=1},
);

console.log('[Ashfall] Final achievements:', GAME_DATA.achievements.length);

// ================================================================
// v5.7 SUMMONING SYSTEM
// ================================================================

// ── SUMMONING TOKENS (pouches) ───────────────────────────
// Familiars are created from charms + secondary ingredients
// Each familiar provides a passive combat buff while active

const _familiars = [
  // Tier 1 - Gold Charm familiars
  {id:'spirit_wolf',   name:'Spirit Wolf',    level:1,  charm:'gold_charm',charmQty:1,  secondary:'bones',         secQty:5,  shards:5,  xp:5,   buff:{stat:'attackBonus',value:3},      duration:600, desc:'A ghostly wolf. +3 Attack bonus.'},
  {id:'dreadfowl',     name:'Dreadfowl',      level:4,  charm:'gold_charm',charmQty:1,  secondary:'feather',       secQty:10, shards:8,  xp:10,  buff:{stat:'rangedBonus',value:3},      duration:600, desc:'A spectral bird. +3 Ranged bonus.'},
  {id:'spirit_spider', name:'Spirit Spider',  level:10, charm:'gold_charm',charmQty:2,  secondary:'leather',       secQty:5,  shards:12, xp:20,  buff:{stat:'defenceBonus',value:5},     duration:600, desc:'A venomous spider. +5 Defence.'},
  {id:'granite_crab',  name:'Granite Crab',   level:16, charm:'gold_charm',charmQty:2,  secondary:'iron_ore',      secQty:5,  shards:15, xp:30,  buff:{stat:'defenceBonus',value:8},     duration:900, desc:'A rocky crab. +8 Defence.'},

  // Tier 2 - Green Charm familiars
  {id:'spirit_scorpion',name:'Spirit Scorpion',level:19, charm:'green_charm',charmQty:1, secondary:'bones',         secQty:10, shards:20, xp:40,  buff:{stat:'strengthBonus',value:5},    duration:900, desc:'A venomous scorpion. +5 Strength.'},
  {id:'spirit_tz_kih', name:'Spirit Mosquito', level:25, charm:'green_charm',charmQty:2, secondary:'big_bones',     secQty:3,  shards:25, xp:60,  buff:{stat:'attackBonus',value:8},      duration:900, desc:'Drains enemy HP. +8 Attack.'},
  {id:'pyrelord',      name:'Pyrelord',        level:32, charm:'green_charm',charmQty:2, secondary:'fire_rune',     secQty:20, shards:30, xp:80,  buff:{stat:'magicBonus',value:8},       duration:900, desc:'A fire elemental. +8 Magic.'},
  {id:'void_spinner',  name:'Void Spinner',    level:34, charm:'green_charm',charmQty:3, secondary:'chaos_rune',    secQty:10, shards:35, xp:90,  buff:{stat:'damageReduction',value:3},  duration:1200,desc:'Absorbs damage. +3% DR.'},

  // Tier 3 - Crimson Charm familiars
  {id:'spirit_jelly',  name:'Spirit Jelly',    level:43, charm:'crimson_charm',charmQty:1,secondary:'sapphire',     secQty:2,  shards:40, xp:120, buff:{stat:'defenceBonus',value:12},    duration:1200,desc:'A gelatinous guard. +12 Defence.'},
  {id:'bloater',       name:'Bloater',         level:49, charm:'crimson_charm',charmQty:2,secondary:'raw_shark',    secQty:3,  shards:50, xp:150, buff:{stat:'strengthBonus',value:10},   duration:1200,desc:'A bloated beast. +10 Strength.'},
  {id:'war_tortoise',  name:'War Tortoise',    level:55, charm:'crimson_charm',charmQty:2,secondary:'gold_bar',     secQty:2,  shards:55, xp:180, buff:{stat:'defenceBonus',value:15,damageReduction:4},duration:1500,desc:'A heavily armored tortoise. +15 Def, +4% DR.'},
  {id:'iron_titan',    name:'Iron Titan',      level:68, charm:'crimson_charm',charmQty:3,secondary:'runite_bar',   secQty:2,  shards:70, xp:250, buff:{stat:'strengthBonus',value:15,attackBonus:10}, duration:1500,desc:'A metal giant. +15 Str, +10 Atk.'},

  // Tier 4 - Blue Charm familiars (best)
  {id:'bunyip',        name:'Bunyip',          level:60, charm:'blue_charm',charmQty:1,  secondary:'raw_shark',     secQty:5,  shards:60, xp:200, buff:{stat:'healOverTime',value:20},    duration:1200,desc:'Heals 20 HP per attack. Passive regen.'},
  {id:'unicorn',       name:'Unicorn Stallion',level:72, charm:'blue_charm',charmQty:2,  secondary:'diamond',       secQty:2,  shards:75, xp:300, buff:{stat:'healOverTime',value:40,defenceBonus:10},duration:1500,desc:'Heals 40 HP/atk. +10 Defence.'},
  {id:'steel_titan',   name:'Steel Titan',     level:80, charm:'blue_charm',charmQty:3,  secondary:'ashsteel_bar',  secQty:2,  shards:90, xp:400, buff:{stat:'strengthBonus',value:20,attackBonus:15,rangedBonus:15},duration:1800,desc:'Ultimate combat familiar. +20 Str, +15 Atk/Rng.'},
  {id:'pack_yak',      name:'Pack Yak',        level:85, charm:'blue_charm',charmQty:3,  secondary:'obsidian_bar',  secQty:3,  shards:95, xp:450, buff:{stat:'defenceBonus',value:20,damageReduction:6,healOverTime:30},duration:1800,desc:'Tank familiar. +20 Def, +6% DR, heals 30/atk.'},
  {id:'phoenix_familiar',name:'Phoenix',       level:95, charm:'blue_charm',charmQty:5,  secondary:'celestial_essence',secQty:2,shards:120,xp:600,buff:{stat:'damageMult',value:1.10,healOverTime:50},duration:2400,desc:'THE ultimate familiar. +10% all damage. Heals 50/atk.'},
];

// Spirit shards item
GAME_DATA.items.spirit_shards = {id:'spirit_shards',name:'Spirit Shards',type:'resource',subtype:'misc',sellPrice:1,sprite:'misc-shard',desc:'Tiny magical shards. Currency for summoning.',rarity:'common'};

// Pouch items (each familiar creates a pouch)
for (const f of _familiars) {
  GAME_DATA.items[f.id+'_pouch'] = {
    id:f.id+'_pouch', name:f.name+' Pouch', type:'pouch', subtype:'summoning',
    sellPrice: f.shards * 2, sprite:'misc-pouch', desc:f.desc,
    familiar:f.id, buff:f.buff, duration:f.duration,
    rarity: f.level >= 80 ? 'legendary' : f.level >= 55 ? 'epic' : f.level >= 30 ? 'rare' : 'uncommon',
  };
}

GAME_DATA.familiars = _familiars;

// Summoning recipes (create pouches from charms + secondaries + shards)
GAME_DATA.recipes.summoning = [];
for (const f of _familiars) {
  GAME_DATA.recipes.summoning.push({
    id: 'summon_' + f.id,
    name: f.name + ' Pouch',
    level: f.level,
    xp: f.xp,
    time: 4.0,
    input: [
      {item: f.charm, qty: f.charmQty},
      {item: f.secondary, qty: f.secQty},
      {item: 'spirit_shards', qty: f.shards},
    ],
    output: {item: f.id + '_pouch', qty: 1},
  });
}

// Spirit shards in shop and as monster drops
GAME_DATA.shop.push({item:'spirit_shards',price:2,category:'materials'});

// Add spirit shard drops to mid-high level monsters
for (const [mId, mon] of Object.entries(GAME_DATA.monsters)) {
  if (mon.combatLevel >= 25 && !mon.drops.some(d=>d.item==='spirit_shards')) {
    const qty = Math.floor(mon.combatLevel / 10);
    mon.drops.push({item:'spirit_shards', qty, chance: 0.30});
  }
}

console.log('[Ashfall] v5.7 Summoning loaded:', _familiars.length, 'familiars,', GAME_DATA.recipes.summoning.length, 'recipes');
console.log('  Items:', Object.keys(GAME_DATA.items).length);

// ── MISSING MONSTER ART ──────────────────────────────────
Object.assign(GAME_DATA.monsterArt, {
  ember_wraith:'<svg viewBox="0 0 80 80"><ellipse cx="40" cy="44" rx="16" ry="24" fill="#d67338" opacity="0.6"/><circle cx="40" cy="28" r="10" fill="#d4a83a" opacity="0.8"/><circle cx="36" cy="26" r="2.5" fill="#ff8040"/><circle cx="44" cy="26" r="2.5" fill="#ff8040"/><circle cx="36" cy="26" r="1" fill="#fff"/><circle cx="44" cy="26" r="1" fill="#fff"/><path d="M30 40 Q18 34 24 48" fill="#d67338" opacity="0.4"/><path d="M50 40 Q62 34 56 48" fill="#d67338" opacity="0.4"/><path d="M36 20 Q34 10 38 16" fill="#ff8040" opacity="0.5"/><path d="M44 20 Q46 10 42 16" fill="#ff8040" opacity="0.5"/><ellipse cx="40" cy="68" rx="10" ry="4" fill="#d63a1a" opacity="0.3"/></svg>',
  ash_golem:'<svg viewBox="0 0 80 80"><rect x="24" y="22" width="32" height="42" rx="6" fill="#4a3a2a"/><rect x="30" y="10" width="20" height="18" rx="4" fill="#4a3a2a"/><circle cx="36" cy="16" r="3" fill="#d63a1a"/><circle cx="44" cy="16" r="3" fill="#d63a1a"/><path d="M18 30 L6 24" stroke="#4a3a2a" stroke-width="6" stroke-linecap="round"/><path d="M62 30 L74 24" stroke="#4a3a2a" stroke-width="6" stroke-linecap="round"/><path d="M24 64 L18 78" stroke="#3a2a1a" stroke-width="6"/><path d="M56 64 L62 78" stroke="#3a2a1a" stroke-width="6"/><rect x="30" y="36" width="20" height="3" fill="#d63a1a" opacity="0.4"/><rect x="32" y="44" width="16" height="2" fill="#d63a1a" opacity="0.3"/></svg>',
  hollow_soldier:'<svg viewBox="0 0 80 80"><rect x="32" y="34" width="16" height="28" rx="3" fill="#4a4a5a"/><circle cx="40" cy="26" r="10" fill="#5a5a6a"/><rect x="30" y="20" width="20" height="6" rx="2" fill="#7a8294"/><circle cx="36" cy="26" r="2" fill="#3a1a1a"/><circle cx="44" cy="26" r="2" fill="#3a1a1a"/><path d="M48 38 L60 30" stroke="#7a8294" stroke-width="2.5"/><polygon points="60,30 64,26 62,34" fill="#7a8294"/><path d="M32 40 L24 44" stroke="#4a4a5a" stroke-width="2"/><ellipse cx="24" cy="44" rx="5" ry="7" fill="#5a5a6a"/><path d="M32 62 L30 72" stroke="#3a3a4a" stroke-width="3.5"/><path d="M48 62 L50 72" stroke="#3a3a4a" stroke-width="3.5"/></svg>',
  hollow_knight:'<svg viewBox="0 0 80 80"><rect x="30" y="32" width="20" height="30" rx="3" fill="#3a3a4a"/><circle cx="40" cy="22" r="12" fill="#4a4a5a"/><rect x="28" y="14" width="24" height="6" rx="2" fill="#c9873e"/><polygon points="40,10 38,4 42,4" fill="#d4a83a"/><circle cx="36" cy="22" r="2.5" fill="#c44040"/><circle cx="44" cy="22" r="2.5" fill="#c44040"/><path d="M50 38 L64 28" stroke="#9da4b4" stroke-width="3"/><polygon points="64,28 68,24 66,32" fill="#9da4b4"/><path d="M30 40 L18 44" stroke="#4a4a5a" stroke-width="3"/><ellipse cx="18" cy="44" rx="7" ry="9" fill="#5a5a6a"/><path d="M30 62 L28 74" stroke="#2a2a3a" stroke-width="4"/><path d="M50 62 L52 74" stroke="#2a2a3a" stroke-width="4"/></svg>',
  frost_spirit:'<svg viewBox="0 0 80 80"><ellipse cx="40" cy="44" rx="14" ry="22" fill="#7ac4e8" opacity="0.5"/><circle cx="40" cy="26" r="10" fill="#a8d8f0" opacity="0.7"/><circle cx="36" cy="24" r="2" fill="#fff"/><circle cx="44" cy="24" r="2" fill="#fff"/><circle cx="36" cy="24" r="0.8" fill="#4a9ed4"/><circle cx="44" cy="24" r="0.8" fill="#4a9ed4"/><path d="M28 38 Q18 32 24 46" fill="#7ac4e8" opacity="0.3"/><path d="M52 38 Q62 32 56 46" fill="#7ac4e8" opacity="0.3"/><circle cx="32" cy="52" r="2" fill="#c8e8f8" opacity="0.4"/><circle cx="50" cy="48" r="1.5" fill="#c8e8f8" opacity="0.3"/><line x1="36" y1="16" x2="36" y2="8" stroke="#c8e8f8" stroke-width="1" opacity="0.5"/><line x1="44" y1="16" x2="44" y2="8" stroke="#c8e8f8" stroke-width="1" opacity="0.5"/></svg>',
  frost_drake:'<svg viewBox="0 0 80 80"><ellipse cx="38" cy="50" rx="20" ry="14" fill="#6aA4c8"/><circle cx="56" cy="36" r="10" fill="#6aA4c8"/><circle cx="54" cy="34" r="2" fill="#c8e8f8"/><circle cx="60" cy="34" r="2" fill="#c8e8f8"/><path d="M62 40 L68 38" stroke="#6aA4c8" stroke-width="1.5"/><polygon points="50,28 46,18 54,26" fill="#6aA4c8"/><polygon points="58,28 62,18 56,26" fill="#6aA4c8"/><path d="M22 42 Q8 30 14 44 Q4 38 18 50" fill="#5a94b8" opacity="0.6"/><path d="M54 42 Q68 30 64 44 Q74 38 58 50" fill="#5a94b8" opacity="0.6"/><path d="M18 50 Q8 48 10 58" fill="#6aA4c8"/><circle cx="30" cy="44" r="2" fill="#c8e8f8" opacity="0.3"/></svg>',
  bloodfang_wolf:'<svg viewBox="0 0 80 80"><ellipse cx="36" cy="48" rx="22" ry="14" fill="#5a2a2a"/><circle cx="56" cy="38" r="10" fill="#5a2a2a"/><circle cx="54" cy="36" r="2.5" fill="#c44040"/><circle cx="60" cy="36" r="2.5" fill="#c44040"/><path d="M62 42 Q66 40 64 44" stroke="#7a3a3a" stroke-width="1"/><polygon points="50,30 48,20 54,28" fill="#5a2a2a"/><polygon points="58,30 62,20 56,28" fill="#5a2a2a"/><rect x="56" y="40" width="2" height="3" fill="#e8e0d4"/><rect x="60" y="40" width="2" height="3" fill="#e8e0d4"/><path d="M14 48 Q4 44 8 54" fill="#5a2a2a"/><path d="M24 60 L20 72" stroke="#3a1a1a" stroke-width="4"/><path d="M48 60 L46 72" stroke="#3a1a1a" stroke-width="4"/></svg>',
  razorback:'<svg viewBox="0 0 80 80"><ellipse cx="40" cy="48" rx="24" ry="16" fill="#5a4a3a"/><circle cx="58" cy="40" r="10" fill="#5a4a3a"/><circle cx="56" cy="38" r="2" fill="#c44040"/><circle cx="62" cy="38" r="2" fill="#c44040"/><path d="M64 44 Q70 42 68 46" stroke="#4a3a2a" stroke-width="1.5"/><rect x="58" y="42" width="2" height="4" fill="#e8e0d4"/><rect x="62" y="42" width="2" height="4" fill="#e8e0d4"/><path d="M30 36 L32 28 L36 36 L40 28 L44 36 L48 28 L52 36" fill="none" stroke="#7a5a3a" stroke-width="2"/><path d="M16 48 Q6 44 10 54" fill="#5a4a3a"/><path d="M26 62 L22 74" stroke="#3a2a1a" stroke-width="4"/><path d="M54 62 L50 74" stroke="#3a2a1a" stroke-width="4"/></svg>',
});

// ── MORE DUNGEONS ────────────────────────────────────────
GAME_DATA.dungeons.push(
  {id:'frozen_depths',name:'Frozen Depths',waves:['ice_troll','ice_troll','frost_wraith','ice_troll','frost_wraith','frost_wraith'],levelReq:35,rewards:[{item:'sapphire',qty:3,chance:0.40},{item:'ice_fish',qty:5,chance:0.30},{item:'astral_rune',qty:10,chance:0.25}],desc:'Ice caverns filled with frozen horrors.'},
  {id:'shadow_labyrinth',name:'Shadow Labyrinth',waves:['shadow_archer','shadow_beast','shadow_archer','shadow_beast','shadow_beast','void_walker'],levelReq:55,rewards:[{item:'death_rune',qty:15,chance:0.35},{item:'soul_rune',qty:5,chance:0.20},{item:'archers_ring',qty:1,chance:0.01}],desc:'A maze of pure darkness.'},
  {id:'ashsteel_foundry',name:'Ashsteel Foundry',waves:['corrupted_golem','ash_guardian','corrupted_golem','ash_guardian','corrupted_golem','ash_guardian','ashfall_titan'],levelReq:85,rewards:[{item:'ashsteel_bar',qty:5,chance:0.30},{item:'wrath_rune',qty:10,chance:0.25},{item:'berserker_ring',qty:1,chance:0.008},{item:'fury_amulet',qty:1,chance:0.005}],desc:'The ultimate dungeon. Forge golems and guardians defend the foundry.'},
);

// ── MORE WORLD BOSS CONTENT ──────────────────────────────
GAME_DATA.worldBosses.push(
  {id:'void_emperor',name:'The Void Emperor',hp:60000,maxHit:280,combatLevel:120,style:'magic',attackSpeed:2.0,evasion:{melee:80,ranged:75,magic:95},desc:'Ruler of the void between worlds. Reality bends around him.',respawn:21600,xp:200000,gold:{min:15000,max:40000},rewards:[{item:'void_bones',qty:5,chance:1.0},{item:'wrath_rune',qty:15,chance:0.40},{item:'celestial_essence',qty:5,chance:0.20},{item:'occult_necklace',qty:1,chance:0.01},{item:'barrows_gloves',qty:1,chance:0.008}]},
);

console.log('[Ashfall] v5.9 loaded: All monster art complete, new dungeons');
console.log('  Monster art:', Object.keys(GAME_DATA.monsterArt).length);
console.log('  Dungeons:', GAME_DATA.dungeons.length);
console.log('  World Bosses:', GAME_DATA.worldBosses.length);

// ── MULTI-MOB ENCOUNTERS ─────────────────────────────────
// These are special encounters where multiple mobs attack at once.
// 3+ mobs REQUIRE prayer protection or you take +50% damage.
GAME_DATA.multiMobEncounters = [
  {id:'goblin_ambush',     name:'Goblin Ambush',      mobs:['goblin','goblin','goblin'],      levelReq:10, desc:'Three goblins jump you at once!'},
  {id:'bandit_gang',       name:'Bandit Gang',        mobs:['bandit','bandit','shadow_archer'], levelReq:20, desc:'A gang of bandits and their archer. Use prayers!'},
  {id:'troll_pack',        name:'Troll Pack',         mobs:['troll','troll'],                  levelReq:30, desc:'Two trolls charge you simultaneously.'},
  {id:'demon_invasion',    name:'Demon Invasion',     mobs:['lesser_demon','lesser_demon','dark_mage'], levelReq:50, desc:'A rift tears open. Demons pour through. PRAYERS REQUIRED.'},
  {id:'dragon_nest',       name:'Dragon Nest',        mobs:['dragon','dragon'],                levelReq:70, desc:'You disturb a nesting pair of dragons.'},
  {id:'void_rift',         name:'Void Rift',          mobs:['void_walker','void_walker','abyssal_horror'], levelReq:85, desc:'The void tears open. THREE abominations emerge. MAXIMUM DANGER.'},
  {id:'ashfall_apocalypse', name:'Ashfall Apocalypse', mobs:['ash_guardian','ashfall_titan','corrupted_golem'], levelReq:90, desc:'The citadel sends its champions. The ultimate multi-mob fight.'},
];

// Add multi-mob button to some combat areas
GAME_DATA.combatAreas.forEach(area => {
  area.multiMobs = GAME_DATA.multiMobEncounters.filter(e => e.levelReq <= area.levelReq + 10 && e.levelReq >= area.levelReq - 10);
});

console.log('[Ashfall] Multi-mob encounters:', GAME_DATA.multiMobEncounters.length);

// ── ADDITIONAL QUESTS: Crafting, Skilling & Exploration chains ──────────────
GAME_DATA.quests.push(

  // ── Zara (Herbalist) quest chain ─────────────────────────────────────────
  {id:'zara_1',npc:'zara',name:'Picking Season',
   desc:'Gather 30 ashbloom herbs for a restorative tincture.',
   objectives:[{type:'gather',item:'ashbloom',qty:30}],
   rewards:{gold:200,xp:{foraging:400,herblore:200}},prereq:null},
  {id:'zara_2',npc:'zara',name:'The Poisoner\'s Cure',
   desc:'Brew 5 antidote potions to treat sick villagers.',
   objectives:[{type:'craft',item:'antidote_potion',qty:5}],
   rewards:{gold:350,xp:{herblore:600}},prereq:'zara_1'},
  {id:'zara_3',npc:'zara',name:'Rare Components',
   desc:'Collect 20 voidblooms from the deep forest.',
   objectives:[{type:'gather',item:'voidbloom',qty:20}],
   rewards:{gold:700,xp:{foraging:800,herblore:500}},prereq:'zara_2'},
  {id:'zara_4',npc:'zara',name:'Master Herbalist',
   desc:'Reach Herblore level 40.',
   objectives:[{type:'skill_level',skill:'herblore',level:40}],
   rewards:{gold:2000,xp:{herblore:3000},items:[{item:'herb_pouch',qty:1}]},prereq:'zara_3'},

  // ── Brennan (Blacksmith) quest chain ─────────────────────────────────────
  {id:'bren_1',npc:'garrick',name:'Steel Ambitions',
   desc:'Smelt 10 steel bars at the foundry.',
   objectives:[{type:'craft',item:'steel_bar',qty:10}],
   rewards:{gold:300,xp:{smithing:400}},prereq:null},
  {id:'bren_2',npc:'garrick',name:'The Armourer\'s Touch',
   desc:'Smith a full set of iron armour (helm, body, legs).',
   objectives:[{type:'craft',item:'iron_full_helm',qty:1},{type:'craft',item:'iron_platebody',qty:1},{type:'craft',item:'iron_platelegs',qty:1}],
   rewards:{gold:600,xp:{smithing:800}},prereq:'bren_1'},
  {id:'bren_3',npc:'garrick',name:'The Mithril Trial',
   desc:'Smith 5 mithril bars and a mithril sword.',
   objectives:[{type:'craft',item:'mithril_bar',qty:5},{type:'craft',item:'mithril_sword',qty:1}],
   rewards:{gold:1500,xp:{smithing:2000}},prereq:'bren_2'},
  {id:'bren_4',npc:'garrick',name:'Master of the Forge',
   desc:'Reach Smithing level 60.',
   objectives:[{type:'skill_level',skill:'smithing',level:60}],
   rewards:{gold:5000,xp:{smithing:5000},items:[{item:'smithing_gloves',qty:1}]},prereq:'bren_3'},

  // ── Captain Rena (Sailor) quest chain — Fishing ───────────────────────────
  {id:'rena_1',npc:'rena',name:'First Catch',
   desc:'Fish 20 shrimp from the coastal waters.',
   objectives:[{type:'gather',item:'shrimp',qty:20}],
   rewards:{gold:80,xp:{fishing:200}},prereq:null},
  {id:'rena_2',npc:'rena',name:'Deep Sea Provisions',
   desc:'Catch 10 swordfish for the ship\'s galley.',
   objectives:[{type:'gather',item:'swordfish',qty:10}],
   rewards:{gold:300,xp:{fishing:600}},prereq:'rena_1'},
  {id:'rena_3',npc:'rena',name:'Shark Hunt',
   desc:'Reel in 5 sharks from the deep waters.',
   objectives:[{type:'gather',item:'shark',qty:5}],
   rewards:{gold:800,xp:{fishing:1500}},prereq:'rena_2'},
  {id:'rena_4',npc:'rena',name:'Master Angler',
   desc:'Reach Fishing level 76.',
   objectives:[{type:'skill_level',skill:'fishing',level:76}],
   rewards:{gold:4000,xp:{fishing:4000},items:[{item:'dragon_harpoon',qty:1}]},prereq:'rena_3'},

  // ── Scout Mira (Explorer) quest chain ─────────────────────────────────────
  {id:'mira_1',npc:'mira',name:'Into the Wild',
   desc:'Survive 5 wilderness encounters.',
   objectives:[{type:'kill',monster:'bandit',qty:5}],
   rewards:{gold:200,xp:{hitpoints:400,defence:200}},prereq:null},
  {id:'mira_2',npc:'mira',name:'Dungeon Delver',
   desc:'Complete the Goblin Warren dungeon.',
   objectives:[{type:'dungeon',dungeon:'goblin_warren',qty:1}],
   rewards:{gold:500,xp:{attack:600,strength:600}},prereq:'mira_1'},
  {id:'mira_3',npc:'mira',name:'Dragon Country',
   desc:'Survive the Dragon\'s Lair dungeon.',
   objectives:[{type:'dungeon',dungeon:'dragon_lair',qty:1}],
   rewards:{gold:2000,xp:{attack:2500,defence:1500}},prereq:'mira_2'},
  {id:'mira_4',npc:'mira',name:'Apex Predator',
   desc:'Kill one of every world boss.',
   objectives:[{type:'kill',monster:'ash_titan',qty:1},{type:'kill',monster:'void_emperor',qty:1}],
   rewards:{gold:10000,xp:{attack:8000,strength:8000,defence:8000},items:[{item:'explorer_ring',qty:1}]},prereq:'mira_3'},

  // ── Sage Aldric (Runecrafting) quest chain ────────────────────────────────
  {id:'aldric_1',npc:'ilyana',name:'Rune Basics',
   desc:'Craft 50 mind runes at the altar.',
   objectives:[{type:'craft',item:'mind_rune',qty:50}],
   rewards:{gold:150,xp:{runecrafting:300}},prereq:null},
  {id:'aldric_2',npc:'ilyana',name:'Water Forms',
   desc:'Craft 100 water runes.',
   objectives:[{type:'craft',item:'water_rune',qty:100}],
   rewards:{gold:400,xp:{runecrafting:700}},prereq:'aldric_1'},
  {id:'aldric_3',npc:'ilyana',name:'The Death Altar',
   desc:'Craft 50 death runes.',
   objectives:[{type:'craft',item:'death_rune',qty:50}],
   rewards:{gold:1200,xp:{runecrafting:2000}},prereq:'aldric_2'},
  {id:'aldric_4',npc:'ilyana',name:'Runemaster',
   desc:'Reach Runecrafting level 44.',
   objectives:[{type:'skill_level',skill:'runecrafting',level:44}],
   rewards:{gold:3000,xp:{runecrafting:4000,magic:2000},items:[{item:'wrath_rune',qty:20}]},prereq:'aldric_3'},

);

// ── NEW NPCs for the above chains ─────────────────────────────────────────
GAME_DATA.npcs.push(
  {id:'zara',   name:'Zara',      faction:null, title:'Herbalist',   desc:'A wise woman who knows every plant in the forest.',   location:'Forest Edge'},
  {id:'rena',   name:'Captain Rena', faction:null, title:'Sea Captain', desc:'A grizzled captain who knows the coast like her own hand.', location:'Harbour'},
  {id:'mira',   name:'Scout Mira', faction:null, title:'Scout',       desc:'A daring explorer who maps dangerous territories.',    location:'Outpost'},
);

console.log('[Ashfall] v6.0 quests loaded:', GAME_DATA.quests.length, 'total quests');

// ── ADDITIONAL QUESTS: Crafting, Skilling and Exploration chains ─────────────
GAME_DATA.quests.push(
  {id:'zara_1',npc:'zara',name:'Picking Season',desc:'Gather 30 ashbloom herbs.',objectives:[{type:'gather',item:'ashbloom',qty:30}],rewards:{gold:200,xp:{foraging:400,herblore:200}},prereq:null},
  {id:'zara_2',npc:'zara',name:"The Poisoner's Cure",desc:'Brew 5 antidote potions.',objectives:[{type:'craft',item:'antidote_potion',qty:5}],rewards:{gold:350,xp:{herblore:600}},prereq:'zara_1'},
  {id:'zara_3',npc:'zara',name:'Rare Components',desc:'Collect 20 voidblooms.',objectives:[{type:'gather',item:'voidbloom',qty:20}],rewards:{gold:700,xp:{foraging:800,herblore:500}},prereq:'zara_2'},
  {id:'zara_4',npc:'zara',name:'Master Herbalist',desc:'Reach Herblore level 40.',objectives:[{type:'skill_level',skill:'herblore',level:40}],rewards:{gold:2000,xp:{herblore:3000},items:[{item:'herb_pouch',qty:1}]},prereq:'zara_3'},

  {id:'bren_1',npc:'garrick',name:'Steel Ambitions',desc:'Smelt 10 steel bars.',objectives:[{type:'craft',item:'steel_bar',qty:10}],rewards:{gold:300,xp:{smithing:400}},prereq:null},
  {id:'bren_2',npc:'garrick',name:"The Armourer's Touch",desc:'Smith an iron full helm, platebody, and platelegs.',objectives:[{type:'craft',item:'iron_full_helm',qty:1},{type:'craft',item:'iron_platebody',qty:1},{type:'craft',item:'iron_platelegs',qty:1}],rewards:{gold:600,xp:{smithing:800}},prereq:'bren_1'},
  {id:'bren_3',npc:'garrick',name:'The Mithril Trial',desc:'Smelt 5 mithril bars.',objectives:[{type:'craft',item:'mithril_bar',qty:5}],rewards:{gold:1500,xp:{smithing:2000}},prereq:'bren_2'},
  {id:'bren_4',npc:'garrick',name:'Master of the Forge',desc:'Reach Smithing level 60.',objectives:[{type:'skill_level',skill:'smithing',level:60}],rewards:{gold:5000,xp:{smithing:5000},items:[{item:'smithing_gloves',qty:1}]},prereq:'bren_3'},

  {id:'rena_1',npc:'rena',name:'First Catch',desc:'Fish 20 shrimp.',objectives:[{type:'gather',item:'shrimp',qty:20}],rewards:{gold:80,xp:{fishing:200}},prereq:null},
  {id:'rena_2',npc:'rena',name:'Deep Sea Provisions',desc:'Catch 10 swordfish.',objectives:[{type:'gather',item:'swordfish',qty:10}],rewards:{gold:300,xp:{fishing:600}},prereq:'rena_1'},
  {id:'rena_3',npc:'rena',name:'Shark Hunt',desc:'Reel in 5 sharks.',objectives:[{type:'gather',item:'shark',qty:5}],rewards:{gold:800,xp:{fishing:1500}},prereq:'rena_2'},
  {id:'rena_4',npc:'rena',name:'Master Angler',desc:'Reach Fishing level 76.',objectives:[{type:'skill_level',skill:'fishing',level:76}],rewards:{gold:4000,xp:{fishing:4000},items:[{item:'dragon_harpoon',qty:1}]},prereq:'rena_3'},

  {id:'mira_1',npc:'mira',name:'Into the Wild',desc:'Kill 5 bandits in the wilderness.',objectives:[{type:'kill',monster:'bandit',qty:5}],rewards:{gold:200,xp:{hitpoints:400,defence:200}},prereq:null},
  {id:'mira_2',npc:'mira',name:'Dungeon Delver',desc:'Complete the Goblin Warren dungeon.',objectives:[{type:'dungeon',dungeon:'goblin_warren',qty:1}],rewards:{gold:500,xp:{attack:600,strength:600}},prereq:'mira_1'},
  {id:'mira_3',npc:'mira',name:'Dragon Country',desc:"Complete the Dragon's Lair dungeon.",objectives:[{type:'dungeon',dungeon:'dragon_lair',qty:1}],rewards:{gold:2000,xp:{attack:2500,defence:1500}},prereq:'mira_2'},
  {id:'mira_4',npc:'mira',name:'Apex Predator',desc:'Slay the Ash Titan world boss.',objectives:[{type:'kill',monster:'ash_titan',qty:1}],rewards:{gold:10000,xp:{attack:8000,strength:8000,defence:8000},items:[{item:'explorer_ring',qty:1}]},prereq:'mira_3'},

  {id:'aldric_1',npc:'ilyana',name:'Rune Basics',desc:'Craft 50 mind runes.',objectives:[{type:'craft',item:'mind_rune',qty:50}],rewards:{gold:150,xp:{runecrafting:300}},prereq:null},
  {id:'aldric_2',npc:'ilyana',name:'Water Forms',desc:'Craft 100 water runes.',objectives:[{type:'craft',item:'water_rune',qty:100}],rewards:{gold:400,xp:{runecrafting:700}},prereq:'aldric_1'},
  {id:'aldric_3',npc:'ilyana',name:'The Death Altar',desc:'Craft 50 death runes.',objectives:[{type:'craft',item:'death_rune',qty:50}],rewards:{gold:1200,xp:{runecrafting:2000}},prereq:'aldric_2'},
  {id:'aldric_4',npc:'ilyana',name:'Runemaster',desc:'Reach Runecrafting level 44.',objectives:[{type:'skill_level',skill:'runecrafting',level:44}],rewards:{gold:3000,xp:{runecrafting:4000,magic:2000},items:[{item:'wrath_rune',qty:20}]},prereq:'aldric_3'}
);

// ── New NPCs ────────────────────────────────────────────────────────────────
if (!GAME_DATA.npcs.find(n=>n.id==='zara'))
  GAME_DATA.npcs.push({id:'zara',name:'Zara',faction:null,title:'Herbalist',desc:'A wise woman who knows every plant in the forest.',location:'Forest Edge'});
if (!GAME_DATA.npcs.find(n=>n.id==='rena'))
  GAME_DATA.npcs.push({id:'rena',name:'Captain Rena',faction:null,title:'Sea Captain',desc:'A grizzled captain who knows the coast like her own hand.',location:'Harbour'});
if (!GAME_DATA.npcs.find(n=>n.id==='mira'))
  GAME_DATA.npcs.push({id:'mira',name:'Scout Mira',faction:null,title:'Scout',desc:'A daring explorer who maps dangerous territories.',location:'Outpost'});

console.log('[Ashfall] v6.0: Quests now total', GAME_DATA.quests.length, '| NPCs:', GAME_DATA.npcs.length);

// ── NEW QUESTS: EXPANDED CHAINS WITH LEVEL REQS + PREREQS ──────────────────
GAME_DATA.quests.push(
  // ── ZARA (HERBALIST) chain ──────────────────────────────
  {id:'zara_1',npc:'zara',name:'Herb Hunt',desc:'Gather 20 silver herbs from the forest.',
    objectives:[{type:'gather',item:'silver_herb',qty:20}],
    rewards:{gold:300,xp:{foraging:400,herblore:200}},
    prereq:null,reqLevels:{foraging:10},reqQuests:[],
    art:'<svg viewBox="0 0 48 48"><rect x="22" y="28" width="4" height="16" rx="1" fill="#3a5a1a"/><ellipse cx="24" cy="22" rx="12" ry="9" fill="#4a7a28"/><ellipse cx="19" cy="17" rx="6" ry="5" fill="#c8d8e0"/><circle cx="15" cy="22" r="2" fill="#b8c8d0" opacity=".7"/></svg>'},
  {id:'zara_2',npc:'zara',name:'Brew the Cure',desc:'Brew 5 defence potions for the sick villagers.',
    objectives:[{type:'craft',item:'defence_potion',qty:5}],
    rewards:{gold:600,xp:{herblore:800}},
    prereq:'zara_1',reqLevels:{herblore:20,foraging:15},reqQuests:['zara_1'],
    art:'<svg viewBox="0 0 48 48"><path d="M16 10 L32 10 L32 16 L38 32 Q38 40 24 40 Q10 40 10 32 L16 16 Z" fill="#204080" stroke="#1a1a1f" stroke-width="1"/><rect x="15" y="8" width="18" height="5" rx="2" fill="#5a4a3a"/><ellipse cx="24" cy="32" rx="9" ry="4" fill="#3060a0" opacity=".5"/></svg>'},
  {id:'zara_3',npc:'zara',name:'Voidbloom Harvest',desc:'Collect 10 voidblooms from the Ashen Vale.',
    objectives:[{type:'gather',item:'voidbloom',qty:10}],
    rewards:{gold:1200,xp:{foraging:1500,herblore:500}},
    prereq:'zara_2',reqLevels:{foraging:30,herblore:25},reqQuests:['zara_2'],
    art:'<svg viewBox="0 0 48 48"><rect x="22" y="28" width="4" height="16" rx="1" fill="#0a0810"/><ellipse cx="24" cy="21" rx="12" ry="9" fill="#100a18"/><circle cx="18" cy="16" r="2" fill="#9050d0" opacity=".8"/><circle cx="30" cy="20" r="2" fill="#8040c0" opacity=".7"/></svg>'},
  {id:'zara_4',npc:'zara',name:"Master Alchemist's Trial",desc:'Brew a Saradomin Brew and a Super Restore.',
    objectives:[{type:'craft',item:'saradomin_brew',qty:1},{type:'craft',item:'super_restore_potion',qty:1}],
    rewards:{gold:5000,xp:{herblore:5000},items:[{item:'master_herbalist_cape',qty:1}]},
    prereq:'zara_3',reqLevels:{herblore:65,foraging:45},reqQuests:['zara_3','ilyana_2'],
    art:'<svg viewBox="0 0 48 48"><path d="M16 10 L32 10 L32 16 L38 32 Q38 40 24 40 Q10 40 10 32 L16 16 Z" fill="#3060c0" stroke="#1a1a1f" stroke-width="1"/><rect x="15" y="8" width="18" height="5" rx="2" fill="#5a4a3a"/><path d="M24 16 L25.5 21 L30 19 L26.5 23 L30 27 L25.5 25 L24 30 L22.5 25 L18 27 L21.5 23 L18 19 L22.5 21Z" fill="#80b0ff" opacity=".7"/></svg>'},

  // ── CAPTAIN RENA (FISHING) chain ─────────────────────────
  {id:'rena_1',npc:'rena',name:'First Catch',desc:'Catch 30 trout from the river.',
    objectives:[{type:'craft',item:'trout',qty:30}],
    rewards:{gold:200,xp:{fishing:400}},
    prereq:null,reqLevels:{fishing:10},reqQuests:[],
    art:'<svg viewBox="0 0 48 48"><ellipse cx="24" cy="40" rx="20" ry="5" fill="#1a3a6a" opacity=".3"/><path d="M6 24 Q14 14 26 18 Q38 22 42 18 Q40 28 26 30 Q12 30 6 24Z" fill="#6a8a5a"/><circle cx="10" cy="22" r="2" fill="#1a1a1a"/></svg>'},
  {id:'rena_2',npc:'rena',name:'Deep Sea Haul',desc:'Catch 20 lobsters and 10 swordfish.',
    objectives:[{type:'craft',item:'lobster',qty:20},{type:'craft',item:'swordfish',qty:10}],
    rewards:{gold:800,xp:{fishing:1200}},
    prereq:'rena_1',reqLevels:{fishing:35},reqQuests:['rena_1'],
    art:'<svg viewBox="0 0 48 48"><ellipse cx="24" cy="40" rx="18" ry="5" fill="#1a3a6a" opacity=".3"/><ellipse cx="24" cy="24" rx="9" ry="12" fill="#c03838"/><circle cx="20" cy="16" r="2.5" fill="#1a1a1a"/><circle cx="28" cy="16" r="2.5" fill="#1a1a1a"/></svg>'},
  {id:'rena_3',npc:'rena',name:'Anglerfish Legend',desc:'Catch 15 anglerfish from the deep.',
    objectives:[{type:'craft',item:'anglerfish',qty:15}],
    rewards:{gold:3000,xp:{fishing:4000}},
    prereq:'rena_2',reqLevels:{fishing:60},reqQuests:['rena_2'],
    art:'<svg viewBox="0 0 48 48"><ellipse cx="24" cy="40" rx="20" ry="5" fill="#1a3a6a" opacity=".3"/><path d="M6 26 Q10 16 22 18 Q34 20 40 16 Q38 28 22 32 Q10 32 6 26Z" fill="#3a3020"/><circle cx="10" cy="5" r="3" fill="#d4b020" opacity=".9"/></svg>'},
  {id:'rena_4',npc:'rena',name:'Leviathan Hunt',desc:'Reel in the legendary Leviathan.',
    objectives:[{type:'craft',item:'leviathan_fillet',qty:1}],
    rewards:{gold:10000,xp:{fishing:10000},items:[{item:'master_fisher_rod',qty:1}]},
    prereq:'rena_3',reqLevels:{fishing:85},reqQuests:['rena_3'],
    art:'<svg viewBox="0 0 48 48"><path d="M2 24 Q10 12 24 15 Q38 18 46 14 Q44 30 24 34 Q10 32 2 24Z" fill="#1e2840"/><circle cx="6" cy="22" r="3" fill="#1a1a1a"/><circle cx="6" cy="22" r="1.5" fill="#e04040" opacity=".8"/></svg>'},

  // ── SCOUT MIRA (EXPLORATION) chain ──────────────────────
  {id:'mira_1',npc:'mira',name:'Into the Wild',desc:'Mine 50 coal and gather 20 blood herbs.',
    objectives:[{type:'gather',item:'coal_ore',qty:50},{type:'gather',item:'blood_herb',qty:20}],
    rewards:{gold:400,xp:{mining:500,foraging:300}},
    prereq:null,reqLevels:{mining:20,foraging:20},reqQuests:[],
    art:'<svg viewBox="0 0 48 48"><polygon points="6,40 24,5 42,40" fill="#383830"/><polygon points="12,34 24,11 36,34" fill="#484840"/><circle cx="18" cy="29" r="5" fill="#141410"/><circle cx="30" cy="27" r="5" fill="#1a1a14"/></svg>'},
  {id:'mira_2',npc:'mira',name:'Dungeon Delver',desc:'Complete the Goblin Caves dungeon.',
    objectives:[{type:'dungeon',dungeon:'goblin_caves',qty:1}],
    rewards:{gold:1500,xp:{attack:2000,defence:1000}},
    prereq:'mira_1',reqLevels:{attack:25,defence:20},reqQuests:['mira_1'],
    art:'<svg viewBox="0 0 48 48"><path d="M4 40 L4 20 Q4 10 14 10 L34 10 Q44 10 44 20 L44 40Z" fill="#2a2020"/><rect x="18" y="24" width="12" height="16" rx="2" fill="#1a1a1a"/><ellipse cx="24" cy="18" rx="8" ry="5" fill="#3a2020"/></svg>'},
  {id:'mira_3',npc:'mira',name:'Dragon Country',desc:'Slay 3 dragons in the Dragon Lair.',
    objectives:[{type:'kill',monster:'dragon',qty:3}],
    rewards:{gold:8000,xp:{attack:5000,strength:3000,defence:3000,slayer:2000}},
    prereq:'mira_2',reqLevels:{attack:60,strength:55,defence:50,slayer:50},reqQuests:['mira_2','elara_4'],
    art:'<svg viewBox="0 0 48 48"><circle cx="28" cy="22" r="12" fill="#4a6028"/><path d="M18 20 Q4 12 2 22 Q8 24 18 24Z" fill="#2a4018"/><circle cx="25" cy="19" r="3" fill="#e06000" opacity=".95"/><circle cx="33" cy="18" r="3" fill="#e06000" opacity=".95"/></svg>'},
  {id:'mira_4',npc:'mira',name:'Apex Predator',desc:'Defeat the Ashfall Titan.',
    objectives:[{type:'kill',monster:'ashfall_titan',qty:1}],
    rewards:{gold:50000,xp:{attack:20000,strength:15000,defence:15000,slayer:10000},items:[{item:'apex_hunter_amulet',qty:1}]},
    prereq:'mira_3',reqLevels:{attack:85,strength:80,defence:80,slayer:75},reqQuests:['mira_3'],
    art:'<svg viewBox="0 0 48 48"><ellipse cx="22" cy="36" rx="16" ry="10" fill="#3a5020"/><circle cx="28" cy="22" r="12" fill="#4a6028"/><path d="M24 12 Q22 4 20 2" stroke="#5a7030" stroke-width="2.5" stroke-linecap="round" fill="none"/><circle cx="25" cy="19" r="3" fill="#e06000" opacity=".95"/></svg>'},

  // ── ALDRIC (RUNECRAFTING) chain ─────────────────────────
  {id:'aldric_1',npc:'aldric',name:'Rune Basics',desc:'Craft 50 fire runes at the Fire Altar.',
    objectives:[{type:'craft',item:'fire_rune',qty:50}],
    rewards:{gold:250,xp:{runecrafting:500}},
    prereq:null,reqLevels:{runecrafting:1},reqQuests:[],
    art:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="10" fill="#c03818"/><circle cx="24" cy="24" r="7" fill="#d04820"/><path d="M24 16 Q28 20 26 25 Q24 28 24 32 Q20 28 22 25 Q20 20 24 16Z" fill="#ff8030" opacity=".8"/></svg>'},
  {id:'aldric_2',npc:'aldric',name:'Water Forms',desc:'Craft 100 water runes and 50 earth runes.',
    objectives:[{type:'craft',item:'water_rune',qty:100},{type:'craft',item:'earth_rune',qty:50}],
    rewards:{gold:600,xp:{runecrafting:1200}},
    prereq:'aldric_1',reqLevels:{runecrafting:15},reqQuests:['aldric_1'],
    art:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="10" fill="#1a60a0"/><path d="M24 15 Q30 21 28 26 Q26 30 24 30 Q22 30 20 26 Q18 21 24 15Z" fill="#60c0e8" opacity=".8"/></svg>'},
  {id:'aldric_3',npc:'aldric',name:'Death Altar',desc:'Craft 30 death runes and reach Runecrafting 50.',
    objectives:[{type:'craft',item:'death_rune',qty:30},{type:'skill',skill:'runecrafting',level:50}],
    rewards:{gold:3000,xp:{runecrafting:5000,magic:2000}},
    prereq:'aldric_2',reqLevels:{runecrafting:44,magic:30},reqQuests:['aldric_2'],
    art:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="10" fill="#280a40"/><path d="M24 15 L28 22 Q28 28 24 28 Q20 28 20 22Z" fill="#9040c0" opacity=".7"/><circle cx="22" cy="22" r="1.5" fill="#c060e0" opacity=".8"/><circle cx="26" cy="22" r="1.5" fill="#c060e0" opacity=".8"/></svg>'},
  {id:'aldric_4',npc:'aldric',name:'Runemaster',desc:'Craft 20 wrath runes and 20 soul runes.',
    objectives:[{type:'craft',item:'wrath_rune',qty:20},{type:'craft',item:'soul_rune',qty:20}],
    rewards:{gold:15000,xp:{runecrafting:15000,magic:5000},items:[{item:'master_runecrafter_hat',qty:1}]},
    prereq:'aldric_3',reqLevels:{runecrafting:75,magic:70},reqQuests:['aldric_3','ilyana_4'],
    art:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="10" fill="#6a1808"/><path d="M26 15 L20 24 L25 24 L22 33 L28 22 L23 22Z" fill="#ffd020" opacity=".9"/></svg>'},

  // ── GUILDMASTER TORAN (SMITHING MASTERY) chain ──────────
  {id:'toran_1',npc:'garrick',name:'Steel Standard',desc:'Smith 30 steel platebodies.',
    objectives:[{type:'craft',item:'steel_platebody',qty:30}],
    rewards:{gold:1500,xp:{smithing:2000}},
    prereq:'garrick_2',reqLevels:{smithing:40},reqQuests:['garrick_2'],
    art:'<svg viewBox="0 0 48 48"><rect x="10" y="34" width="28" height="7" rx="2" fill="#4a4a44"/><path d="M14 32 L18 18 L30 18 L34 32Z" fill="#9da4b4"/><circle cx="24" cy="24" r="3" fill="#606878"/></svg>'},
  {id:'toran_2',npc:'garrick',name:'Mithril Mastery',desc:'Smith a full set of mithril armor.',
    objectives:[{type:'craft',item:'mithril_platebody',qty:1},{type:'craft',item:'mithril_platelegs',qty:1},{type:'craft',item:'mithril_helm',qty:1}],
    rewards:{gold:5000,xp:{smithing:8000}},
    prereq:'toran_1',reqLevels:{smithing:55,mining:45},reqQuests:['toran_1'],
    art:'<svg viewBox="0 0 48 48"><rect x="10" y="34" width="28" height="7" rx="2" fill="#3a3c48"/><path d="M14 32 L18 18 L30 18 L34 32Z" fill="#4a7ab0"/><circle cx="24" cy="24" r="3" fill="#3a6aa0"/></svg>'},
  {id:'toran_3',npc:'garrick',name:'The Ashsteel Forge',desc:'Smelt 10 ashsteel bars and smith an ashsteel sword.',
    objectives:[{type:'craft',item:'ashsteel_bar',qty:10},{type:'craft',item:'ashsteel_sword',qty:1}],
    rewards:{gold:20000,xp:{smithing:20000,mining:5000},items:[{item:'master_smithing_hammer',qty:1}]},
    prereq:'toran_2',reqLevels:{smithing:80,mining:75},reqQuests:['toran_2','mira_2'],
    art:'<svg viewBox="0 0 48 48"><rect x="10" y="32" width="28" height="12" rx="3" fill="#1a0a08"/><path d="M12 32 Q18 18 24 14 Q30 18 36 32" fill="#c03010" opacity=".9"/><circle cx="20" cy="29" r="2.5" fill="#ff5020" opacity=".6"/></svg>'},
);

console.log('[Ashfall] Expanded quests loaded. Total:', GAME_DATA.quests.length);
