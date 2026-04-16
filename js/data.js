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
    {id:'pete_1',npc:'old_pete',name:'A Helping Hand',desc:'Bring 10 oak logs for the fireplace.',objectives:[{type:'gather',item:'oak_log',qty:10}],rewards:{gold:50,xp:{woodcutting:100}},prereq:null},
    {id:'pete_2',npc:'old_pete',name:'Rat Trouble',desc:'Kill 5 giant rats.',objectives:[{type:'kill',monster:'rat',qty:5}],rewards:{gold:100,xp:{attack:150,strength:150}},prereq:'pete_1'},
    {id:'pete_3',npc:'old_pete',name:'A Warm Meal',desc:'Cook 10 shrimp for the children.',objectives:[{type:'craft',item:'shrimp',qty:10}],rewards:{gold:75,xp:{cooking:200}},prereq:'pete_2'},
    {id:'pete_4',npc:'old_pete',name:'Goblin Menace',desc:'Slay 10 goblins.',objectives:[{type:'kill',monster:'goblin',qty:10}],rewards:{gold:200,xp:{attack:300,strength:300}},prereq:'pete_3'},
    {id:'elara_1',npc:'elara',name:'The First Test',desc:'Slay 20 skeletons.',objectives:[{type:'kill',monster:'skeleton',qty:20}],rewards:{gold:300,xp:{attack:500,strength:500,defence:500},rep:{silver_order:300}},prereq:null,faction:'silver_order'},
    {id:'elara_2',npc:'elara',name:'Banditry Must End',desc:'Kill 10 bandits.',objectives:[{type:'kill',monster:'bandit',qty:10}],rewards:{gold:500,xp:{attack:750,strength:750},rep:{silver_order:400}},prereq:'elara_1'},
    {id:'elara_3',npc:'elara',name:'Trolls of Ironpeak',desc:'Hunt 5 trolls.',objectives:[{type:'kill',monster:'troll',qty:5}],rewards:{gold:1000,xp:{attack:1500,strength:1500,defence:800},rep:{silver_order:600}},prereq:'elara_2'},
    {id:'elara_4',npc:'elara',name:'Dragonslayer',desc:'Slay a Dragon.',objectives:[{type:'kill',monster:'dragon',qty:1}],rewards:{gold:5000,xp:{attack:5000,strength:5000,defence:3000},rep:{silver_order:2000},items:[{item:'silver_champion_sword',qty:1}]},prereq:'elara_3'},
    {id:'garrick_1',npc:'garrick',name:'Bulk Order: Iron',desc:'Deliver 50 iron ore.',objectives:[{type:'gather',item:'iron_ore',qty:50}],rewards:{gold:500,xp:{mining:300},rep:{ashen_guild:200}},prereq:null,faction:'ashen_guild'},
    {id:'garrick_2',npc:'garrick',name:'Finished Goods',desc:'Smith 20 steel bars.',objectives:[{type:'craft',item:'steel_bar',qty:20}],rewards:{gold:1000,xp:{smithing:500},rep:{ashen_guild:300}},prereq:'garrick_1'},
    {id:'garrick_3',npc:'garrick',name:'Exotic Imports',desc:'Source 10 rubies.',objectives:[{type:'gather',item:'ruby',qty:10}],rewards:{gold:2000,xp:{mining:800},rep:{ashen_guild:500}},prereq:'garrick_2'},
    {id:'garrick_4',npc:'garrick',name:'Merchant Prince',desc:'Accumulate 100,000 gold.',objectives:[{type:'gold',qty:100000}],rewards:{gold:10000,xp:{trading:5000},rep:{ashen_guild:1500}},prereq:'garrick_3'},
    {id:'krolgar_1',npc:'krolgar',name:'Crush the Weak',desc:'Kill 20 chickens.',objectives:[{type:'kill',monster:'chicken',qty:20}],rewards:{gold:100,xp:{strength:300},rep:{bloodfang_clan:200}},prereq:null,faction:'bloodfang_clan'},
    {id:'krolgar_2',npc:'krolgar',name:'Rob the Nobles',desc:'Pickpocket 10 nobles.',objectives:[{type:'thieve',target:'pickpocket_noble',qty:10}],rewards:{gold:500,xp:{thieving:500},rep:{bloodfang_clan:400}},prereq:'krolgar_1'},
    {id:'krolgar_3',npc:'krolgar',name:'The Ogre Hunt',desc:'Slay 3 ogres.',objectives:[{type:'kill',monster:'ogre',qty:3}],rewards:{gold:1500,xp:{strength:2000},rep:{bloodfang_clan:800}},prereq:'krolgar_2'},
    {id:'krolgar_4',npc:'krolgar',name:'Blood and Fire',desc:'Slay a demon.',objectives:[{type:'kill',monster:'demon',qty:1}],rewards:{gold:3000,xp:{strength:3500,attack:1000},rep:{bloodfang_clan:1500},items:[{item:'bloodfang_cleaver',qty:1}]},prereq:'krolgar_3'},
    {id:'ilyana_1',npc:'ilyana',name:'Essence Gathering',desc:'Bring 100 rune essence.',objectives:[{type:'gather',item:'rune_essence',qty:100}],rewards:{gold:200,xp:{magic:500},rep:{veiled_circle:300}},prereq:null,faction:'veiled_circle'},
    {id:'ilyana_2',npc:'ilyana',name:'Forbidden Herbs',desc:'Procure 20 voidblooms.',objectives:[{type:'gather',item:'voidbloom',qty:20}],rewards:{gold:800,xp:{foraging:1000,magic:500},rep:{veiled_circle:500}},prereq:'ilyana_1'},
    {id:'ilyana_3',npc:'ilyana',name:'Dark Magic Study',desc:'Bring 30 death runes.',objectives:[{type:'gather',item:'death_rune',qty:30}],rewards:{gold:1500,xp:{magic:2000},rep:{veiled_circle:800}},prereq:'ilyana_2'},
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
      {id:'chop_oak',    name:'Oak Tree',    level:1, xp:10, time:3.0, loot:[{item:'oak_log',qty:1}],    masteryId:'oak'},
      {id:'chop_willow', name:'Willow Tree', level:15,xp:25, time:3.5, loot:[{item:'willow_log',qty:1}], masteryId:'willow'},
      {id:'chop_maple',  name:'Maple Tree',  level:30,xp:55, time:4.0, loot:[{item:'maple_log',qty:1}],  masteryId:'maple'},
      {id:'chop_yew',    name:'Yew Tree',    level:45,xp:100,time:5.0, loot:[{item:'yew_log',qty:1}],    masteryId:'yew'},
      {id:'chop_elder',  name:'Elder Tree',  level:60,xp:180,time:6.0, loot:[{item:'elder_log',qty:1}],  masteryId:'elder'},
      {id:'chop_ashwood',name:'Ashwood Tree',level:75,xp:300,time:7.0, loot:[{item:'ash_log',qty:1}],    masteryId:'ashwood'},
    ],
    mining: [
      {id:'mine_copper', name:'Copper Rock', level:1, xp:8,  time:3.0,loot:[{item:'copper_ore',qty:1}], masteryId:'copper',gemChance:0.01},
      {id:'mine_tin',    name:'Tin Rock',    level:1, xp:8,  time:3.0,loot:[{item:'tin_ore',qty:1}],    masteryId:'tin',   gemChance:0.01},
      {id:'mine_iron',   name:'Iron Rock',   level:15,xp:22, time:4.0,loot:[{item:'iron_ore',qty:1}],   masteryId:'iron',  gemChance:0.02},
      {id:'mine_coal',   name:'Coal Rock',   level:25,xp:35, time:4.5,loot:[{item:'coal_ore',qty:1}],   masteryId:'coal',  gemChance:0.02},
      {id:'mine_mithril',name:'Mithril Rock',level:40,xp:70, time:5.5,loot:[{item:'mithril_ore',qty:1}],masteryId:'mithril',gemChance:0.03},
      {id:'mine_adamant',name:'Adamant Rock',level:55,xp:130,time:7.0,loot:[{item:'adamant_ore',qty:1}],masteryId:'adamant',gemChance:0.04},
      {id:'mine_obsidian',name:'Obsidian Vein',level:70,xp:220,time:8.0,loot:[{item:'obsidian_ore',qty:1}],masteryId:'obsidian',gemChance:0.05},
      {id:'mine_essence',name:'Rune Essence', level:1, xp:5,  time:2.0,loot:[{item:'rune_essence',qty:1}],masteryId:'essence',gemChance:0},
    ],
    fishing: [
      {id:'fish_shrimp',   name:'Shrimp Spot',     level:1, xp:5,  time:3.0,loot:[{item:'raw_shrimp',qty:1}],    masteryId:'shrimp'},
      {id:'fish_trout',    name:'Trout Spot',      level:10,xp:15, time:3.5,loot:[{item:'raw_trout',qty:1}],     masteryId:'trout'},
      {id:'fish_salmon',   name:'Salmon Spot',     level:25,xp:35, time:4.0,loot:[{item:'raw_salmon',qty:1}],    masteryId:'salmon'},
      {id:'fish_lobster',  name:'Lobster Spot',    level:35,xp:65, time:4.5,loot:[{item:'raw_lobster',qty:1}],   masteryId:'lobster'},
      {id:'fish_swordfish',name:'Swordfish Spot',  level:50,xp:120,time:5.5,loot:[{item:'raw_swordfish',qty:1}], masteryId:'swordfish'},
      {id:'fish_angler',   name:'Anglerfish Spot', level:65,xp:200,time:7.0,loot:[{item:'raw_anglerfish',qty:1}],masteryId:'angler'},
      {id:'fish_leviathan',name:'Leviathan Depths',level:80,xp:350,time:9.0,loot:[{item:'raw_leviathan',qty:1}], masteryId:'leviathan'},
    ],
    foraging: [
      {id:'forage_silver',name:'Silverleaf Patch', level:1, xp:8,  time:3.0,loot:[{item:'silverleaf',qty:1}],masteryId:'silverleaf'},
      {id:'forage_blood', name:'Bloodroot Thicket',level:20,xp:25, time:4.0,loot:[{item:'bloodroot',qty:1}], masteryId:'bloodroot'},
      {id:'forage_moon',  name:'Moonpetal Grove',  level:40,xp:60, time:5.5,loot:[{item:'moonpetal',qty:1}], masteryId:'moonpetal'},
      {id:'forage_void',  name:'Voidbloom Rift',   level:60,xp:130,time:7.0,loot:[{item:'voidbloom',qty:1}], masteryId:'voidbloom'},
      {id:'forage_ash',   name:'Ashblossom Fields',level:75,xp:250,time:8.5,loot:[{item:'ashblossom',qty:1}],masteryId:'ashblossom'},
    ],
    hunting: [
      {id:'hunt_rabbit',name:'Rabbit Snare', level:1, xp:8,  time:4.0, loot:[{item:'leather',qty:1},{item:'bones',qty:1}], masteryId:'rabbit'},
      {id:'hunt_wolf',  name:'Wolf Tracking',level:15,xp:25, time:5.0, loot:[{item:'wolf_pelt',qty:1},{item:'bones',qty:1}],masteryId:'wolf'},
      {id:'hunt_bear',  name:'Bear Tracking',level:35,xp:60, time:6.5, loot:[{item:'bear_pelt',qty:1},{item:'hard_leather',qty:1},{item:'big_bones',qty:1}],masteryId:'bear'},
      {id:'hunt_wyvern',name:'Wyvern Hunt',  level:55,xp:150,time:8.0, loot:[{item:'wyvern_scale',qty:1},{item:'hard_leather',qty:1}],masteryId:'wyvern'},
      {id:'hunt_dragon',name:'Young Dragon', level:75,xp:320,time:10.0,loot:[{item:'dragon_hide',qty:1},{item:'dragon_bones',qty:1}],masteryId:'dragon'},
    ],
  },

  recipes: {
    cooking: [
      {id:'cook_shrimp',   name:'Cook Shrimp',    level:1, xp:10, time:2.0,input:[{item:'raw_shrimp',qty:1}],    output:{item:'shrimp',qty:1},         burnChance:0.30},
      {id:'cook_trout',    name:'Cook Trout',     level:10,xp:25, time:2.5,input:[{item:'raw_trout',qty:1}],     output:{item:'trout',qty:1},          burnChance:0.25},
      {id:'cook_salmon',   name:'Cook Salmon',    level:25,xp:50, time:3.0,input:[{item:'raw_salmon',qty:1}],    output:{item:'salmon',qty:1},         burnChance:0.20},
      {id:'cook_lobster',  name:'Cook Lobster',   level:35,xp:80, time:3.0,input:[{item:'raw_lobster',qty:1}],   output:{item:'lobster',qty:1},        burnChance:0.18},
      {id:'cook_swordfish',name:'Cook Swordfish', level:50,xp:140,time:3.5,input:[{item:'raw_swordfish',qty:1}], output:{item:'swordfish',qty:1},      burnChance:0.15},
      {id:'cook_angler',   name:'Cook Anglerfish',level:65,xp:220,time:4.0,input:[{item:'raw_anglerfish',qty:1}],output:{item:'anglerfish',qty:1},     burnChance:0.12},
      {id:'cook_leviathan',name:'Cook Leviathan', level:80,xp:400,time:5.0,input:[{item:'raw_leviathan',qty:1}], output:{item:'leviathan_steak',qty:1},burnChance:0.10},
    ],
    smithing: [
      {id:'smelt_bronze',  name:'Smelt Bronze Bar',  level:1, xp:8,  time:3.0,input:[{item:'copper_ore',qty:1},{item:'tin_ore',qty:1}], output:{item:'bronze_bar',qty:1}},
      {id:'smelt_iron',    name:'Smelt Iron Bar',    level:15,xp:20, time:4.0,input:[{item:'iron_ore',qty:1}],                          output:{item:'iron_bar',qty:1}},
      {id:'smelt_steel',   name:'Smelt Steel Bar',   level:25,xp:40, time:5.0,input:[{item:'iron_ore',qty:1},{item:'coal_ore',qty:2}],  output:{item:'steel_bar',qty:1}},
      {id:'smelt_mithril', name:'Smelt Mithril Bar', level:40,xp:80, time:6.0,input:[{item:'mithril_ore',qty:1},{item:'coal_ore',qty:4}],output:{item:'mithril_bar',qty:1}},
      {id:'smelt_adamant', name:'Smelt Adamant Bar', level:55,xp:150,time:7.0,input:[{item:'adamant_ore',qty:1},{item:'coal_ore',qty:6}],output:{item:'adamant_bar',qty:1}},
      {id:'smelt_obsidian',name:'Smelt Obsidian Bar',level:70,xp:280,time:8.0,input:[{item:'obsidian_ore',qty:1},{item:'coal_ore',qty:8}],output:{item:'obsidian_bar',qty:1}},
      {id:'smith_bronze_sword',name:'Bronze Sword',   level:1, xp:15, time:4.0,input:[{item:'bronze_bar',qty:2}], output:{item:'bronze_sword',qty:1}},
      {id:'smith_iron_sword',  name:'Iron Sword',     level:15,xp:35, time:5.0,input:[{item:'iron_bar',qty:2}],   output:{item:'iron_sword',qty:1}},
      {id:'smith_steel_sword', name:'Steel Sword',    level:25,xp:70, time:5.0,input:[{item:'steel_bar',qty:2}],  output:{item:'steel_sword',qty:1}},
      {id:'smith_mithril_sword',name:'Mithril Sword', level:40,xp:140,time:6.0,input:[{item:'mithril_bar',qty:3}],output:{item:'mithril_sword',qty:1}},
      {id:'smith_adamant_sword',name:'Adamant Sword', level:55,xp:260,time:7.0,input:[{item:'adamant_bar',qty:3}],output:{item:'adamant_sword',qty:1}},
      {id:'smith_obsidian_sword',name:'Obsidian Blade',level:70,xp:500,time:9.0,input:[{item:'obsidian_bar',qty:4}],output:{item:'obsidian_sword',qty:1}},
      {id:'smith_iron_axe',    name:'Iron Battleaxe',  level:18,xp:40, time:5.5,input:[{item:'iron_bar',qty:3}],   output:{item:'iron_battleaxe',qty:1}},
      {id:'smith_steel_axe',   name:'Steel Battleaxe', level:28,xp:85, time:6.0,input:[{item:'steel_bar',qty:3}],  output:{item:'steel_battleaxe',qty:1}},
      {id:'smith_mithril_axe', name:'Mithril Battleaxe',level:43,xp:170,time:7.0,input:[{item:'mithril_bar',qty:4}],output:{item:'mithril_battleaxe',qty:1}},
      {id:'smith_iron_mace',   name:'Iron Mace',       level:13,xp:28, time:4.5,input:[{item:'iron_bar',qty:1}],   output:{item:'iron_mace',qty:1}},
      {id:'smith_steel_mace',  name:'Steel Mace',      level:23,xp:60, time:5.0,input:[{item:'steel_bar',qty:2}],  output:{item:'steel_mace',qty:1}},
      {id:'smith_iron_dagger', name:'Iron Dagger',     level:8, xp:18, time:3.0,input:[{item:'iron_bar',qty:1}],   output:{item:'iron_dagger',qty:1}},
      {id:'smith_steel_dagger',name:'Steel Dagger',    level:18,xp:38, time:3.5,input:[{item:'steel_bar',qty:1}],  output:{item:'steel_dagger',qty:1}},
      {id:'smith_bronze_shield',name:'Bronze Shield',  level:1, xp:12, time:3.5,input:[{item:'bronze_bar',qty:2}], output:{item:'bronze_shield',qty:1}},
      {id:'smith_iron_shield', name:'Iron Shield',     level:15,xp:30, time:4.5,input:[{item:'iron_bar',qty:2}],   output:{item:'iron_shield',qty:1}},
      {id:'smith_steel_shield',name:'Steel Shield',    level:25,xp:60, time:5.0,input:[{item:'steel_bar',qty:3}],  output:{item:'steel_shield',qty:1}},
      {id:'smith_mithril_shield',name:'Mithril Shield',level:40,xp:130,time:6.0,input:[{item:'mithril_bar',qty:4}],output:{item:'mithril_shield',qty:1}},
      {id:'smith_bronze_helm', name:'Bronze Helm',     level:1, xp:10, time:3.0,input:[{item:'bronze_bar',qty:1}], output:{item:'bronze_helm',qty:1}},
      {id:'smith_iron_helm',   name:'Iron Helm',       level:10,xp:22, time:4.0,input:[{item:'iron_bar',qty:1}],   output:{item:'iron_helm',qty:1}},
      {id:'smith_steel_helm',  name:'Steel Helm',      level:20,xp:45, time:4.5,input:[{item:'steel_bar',qty:2}],  output:{item:'steel_helm',qty:1}},
      {id:'smith_mithril_helm',name:'Mithril Helm',    level:35,xp:100,time:5.0,input:[{item:'mithril_bar',qty:2}],output:{item:'mithril_helm',qty:1}},
      {id:'smith_adamant_helm',name:'Adamant Helm',    level:50,xp:200,time:6.0,input:[{item:'adamant_bar',qty:3}],output:{item:'adamant_helm',qty:1}},
      {id:'smith_bronze_plate',name:'Bronze Platebody',level:5, xp:25, time:5.0,input:[{item:'bronze_bar',qty:3}], output:{item:'bronze_plate',qty:1}},
      {id:'smith_iron_plate',  name:'Iron Platebody',  level:15,xp:50, time:6.0,input:[{item:'iron_bar',qty:3}],   output:{item:'iron_plate',qty:1}},
      {id:'smith_steel_plate', name:'Steel Platebody', level:30,xp:100,time:7.0,input:[{item:'steel_bar',qty:5}],  output:{item:'steel_plate',qty:1}},
      {id:'smith_mithril_plate',name:'Mithril Platebody',level:45,xp:200,time:8.0,input:[{item:'mithril_bar',qty:5}],output:{item:'mithril_plate',qty:1}},
      {id:'smith_adamant_plate',name:'Adamant Platebody',level:60,xp:400,time:9.0,input:[{item:'adamant_bar',qty:5}],output:{item:'adamant_plate',qty:1}},
      {id:'smith_bronze_legs', name:'Bronze Platelegs',level:3, xp:18, time:4.0,input:[{item:'bronze_bar',qty:2}], output:{item:'bronze_legs',qty:1}},
      {id:'smith_iron_legs',   name:'Iron Platelegs',  level:12,xp:35, time:5.0,input:[{item:'iron_bar',qty:2}],   output:{item:'iron_legs',qty:1}},
      {id:'smith_steel_legs',  name:'Steel Platelegs', level:25,xp:70, time:5.5,input:[{item:'steel_bar',qty:3}],  output:{item:'steel_legs',qty:1}},
      {id:'smith_mithril_legs',name:'Mithril Platelegs',level:40,xp:150,time:6.5,input:[{item:'mithril_bar',qty:3}],output:{item:'mithril_legs',qty:1}},
      {id:'smith_adamant_legs',name:'Adamant Platelegs',level:55,xp:300,time:7.5,input:[{item:'adamant_bar',qty:4}],output:{item:'adamant_legs',qty:1}},
      {id:'smith_iron_boots',  name:'Iron Boots',     level:12,xp:25, time:4.0,input:[{item:'iron_bar',qty:1}],   output:{item:'iron_boots',qty:1}},
      {id:'smith_steel_boots', name:'Steel Boots',    level:22,xp:50, time:4.5,input:[{item:'steel_bar',qty:2}],  output:{item:'steel_boots',qty:1}},
      {id:'smith_mithril_boots',name:'Mithril Boots', level:37,xp:120,time:5.5,input:[{item:'mithril_bar',qty:2}],output:{item:'mithril_boots',qty:1}},
      {id:'smith_iron_gauntlets',name:'Iron Gauntlets',level:11,xp:23,time:4.0,input:[{item:'iron_bar',qty:1}],   output:{item:'iron_gauntlets',qty:1}},
      {id:'smith_steel_gauntlets',name:'Steel Gauntlets',level:21,xp:48,time:4.5,input:[{item:'steel_bar',qty:2}],output:{item:'steel_gauntlets',qty:1}},
      {id:'smith_mithril_gauntlets',name:'Mithril Gauntlets',level:36,xp:115,time:5.5,input:[{item:'mithril_bar',qty:2}],output:{item:'mithril_gauntlets',qty:1}},
    ],
    fletching: [
      {id:'fletch_bronze_arrows',name:'Bronze Arrows (15)', level:1, xp:10, time:2.0,input:[{item:'oak_log',qty:1},{item:'bronze_bar',qty:1}], output:{item:'bronze_arrows',qty:15}},
      {id:'fletch_iron_arrows',  name:'Iron Arrows (15)',   level:15,xp:25, time:2.5,input:[{item:'oak_log',qty:1},{item:'iron_bar',qty:1}],   output:{item:'iron_arrows',qty:15}},
      {id:'fletch_steel_arrows', name:'Steel Arrows (15)',  level:30,xp:50, time:3.0,input:[{item:'willow_log',qty:1},{item:'steel_bar',qty:1}],output:{item:'steel_arrows',qty:15}},
      {id:'fletch_mithril_arrows',name:'Mithril Arrows (15)',level:45,xp:90,time:3.0,input:[{item:'maple_log',qty:1},{item:'mithril_bar',qty:1}],output:{item:'mithril_arrows',qty:15}},
      {id:'fletch_adamant_arrows',name:'Adamant Arrows (15)',level:60,xp:160,time:3.5,input:[{item:'yew_log',qty:1},{item:'adamant_bar',qty:1}],output:{item:'adamant_arrows',qty:15}},
      {id:'fletch_oak_shortbow', name:'Oak Shortbow',       level:5, xp:15, time:3.5,input:[{item:'oak_log',qty:2}],    output:{item:'oak_shortbow',qty:1}},
      {id:'fletch_willow_bow',   name:'Willow Shortbow',    level:20,xp:40, time:4.0,input:[{item:'willow_log',qty:2}], output:{item:'willow_shortbow',qty:1}},
      {id:'fletch_maple_bow',    name:'Maple Shortbow',     level:35,xp:80, time:4.5,input:[{item:'maple_log',qty:3}],  output:{item:'maple_shortbow',qty:1}},
      {id:'fletch_yew_bow',      name:'Yew Longbow',        level:50,xp:150,time:5.0,input:[{item:'yew_log',qty:3}],    output:{item:'yew_longbow',qty:1}},
      {id:'fletch_elder_bow',    name:'Elder Bow',          level:65,xp:280,time:6.0,input:[{item:'elder_log',qty:4}],   output:{item:'elder_bow',qty:1}},
      {id:'fletch_ashwood_bow',  name:'Ashwood Bow',        level:78,xp:450,time:7.0,input:[{item:'ash_log',qty:5}],    output:{item:'ashwood_bow',qty:1}},
    ],
    crafting: [
      {id:'craft_leather',       name:'Tan Leather',       level:1, xp:8, time:2.0,input:[{item:'bones',qty:2}],                             output:{item:'leather',qty:1}},
      {id:'craft_hard_leather',  name:'Tan Hard Leather',  level:25,xp:25,time:3.0,input:[{item:'big_bones',qty:2},{item:'leather',qty:2}],   output:{item:'hard_leather',qty:1}},
      {id:'craft_leather_boots', name:'Leather Boots',     level:5, xp:15,time:3.0,input:[{item:'leather',qty:2}],     output:{item:'leather_boots',qty:1}},
      {id:'craft_leather_gloves',name:'Leather Gloves',    level:8, xp:18,time:3.0,input:[{item:'leather',qty:2}],     output:{item:'leather_gloves',qty:1}},
      {id:'craft_leather_cape',  name:'Leather Cape',      level:10,xp:22,time:3.5,input:[{item:'leather',qty:3}],     output:{item:'leather_cape',qty:1}},
      {id:'craft_leather_cowl',  name:'Leather Cowl',      level:7, xp:18,time:3.0,input:[{item:'leather',qty:2}],     output:{item:'leather_cowl',qty:1}},
      {id:'craft_leather_body',  name:'Leather Body',      level:10,xp:30,time:4.0,input:[{item:'leather',qty:4}],     output:{item:'leather_body',qty:1}},
      {id:'craft_leather_chaps', name:'Leather Chaps',     level:9, xp:25,time:3.5,input:[{item:'leather',qty:3}],     output:{item:'leather_chaps',qty:1}},
      {id:'craft_studded_cowl',  name:'Studded Cowl',      level:20,xp:40,time:3.5,input:[{item:'leather',qty:2},{item:'iron_bar',qty:1}],output:{item:'studded_cowl',qty:1}},
      {id:'craft_studded_body',  name:'Studded Body',      level:25,xp:60,time:4.0,input:[{item:'leather',qty:4},{item:'iron_bar',qty:2}],output:{item:'studded_body',qty:1}},
      {id:'craft_studded_chaps', name:'Studded Chaps',     level:22,xp:48,time:3.5,input:[{item:'leather',qty:3},{item:'iron_bar',qty:1}],output:{item:'studded_chaps',qty:1}},
      {id:'craft_hard_cowl',     name:'Hard Leather Cowl', level:30,xp:70, time:4.0,input:[{item:'hard_leather',qty:2}],output:{item:'hard_leather_cowl',qty:1}},
      {id:'craft_hard_body',     name:'Hard Leather Body', level:35,xp:110,time:5.0,input:[{item:'hard_leather',qty:4}],output:{item:'hard_leather_body',qty:1}},
      {id:'craft_hard_chaps',    name:'Hard Leather Chaps',level:32,xp:85, time:4.5,input:[{item:'hard_leather',qty:3}],output:{item:'hard_leather_chaps',qty:1}},
      {id:'craft_dragon_cowl',   name:'Dragonhide Cowl',   level:45,xp:180,time:5.0,input:[{item:'dragon_hide',qty:2}], output:{item:'dragon_cowl',qty:1}},
      {id:'craft_dragon_body',   name:'Dragonhide Body',   level:55,xp:280,time:6.0,input:[{item:'dragon_hide',qty:4}], output:{item:'dragon_body',qty:1}},
      {id:'craft_dragon_chaps',  name:'Dragonhide Chaps',  level:50,xp:220,time:5.5,input:[{item:'dragon_hide',qty:3}], output:{item:'dragon_chaps',qty:1}},
      {id:'craft_ranger_boots',  name:'Ranger Boots',      level:20,xp:40,time:3.5,input:[{item:'leather',qty:3}],     output:{item:'ranger_boots',qty:1}},
      {id:'craft_ranger_gloves', name:'Ranger Gloves',     level:18,xp:38,time:3.5,input:[{item:'leather',qty:2}],     output:{item:'ranger_gloves',qty:1}},
      {id:'craft_ranger_cape',   name:'Ranger Cape',       level:35,xp:90,time:4.0,input:[{item:'hard_leather',qty:3}],output:{item:'ranger_cape',qty:1}},
      {id:'craft_warrior_cape',  name:'Warrior Cape',      level:35,xp:90,time:4.0,input:[{item:'hard_leather',qty:3},{item:'iron_bar',qty:2}],output:{item:'warrior_cape',qty:1}},
      {id:'craft_app_hat',       name:'Apprentice Hat',    level:5, xp:18,time:3.0,input:[{item:'silverleaf',qty:2},{item:'leather',qty:1}],output:{item:'apprentice_hat',qty:1}},
      {id:'craft_app_robe',      name:'Apprentice Robe',   level:8, xp:25,time:3.5,input:[{item:'silverleaf',qty:3},{item:'leather',qty:2}],output:{item:'apprentice_robe',qty:1}},
      {id:'craft_app_skirt',     name:'Apprentice Skirt',  level:6, xp:20,time:3.0,input:[{item:'silverleaf',qty:2},{item:'leather',qty:1}],output:{item:'apprentice_skirt',qty:1}},
      {id:'craft_mystic_hat',    name:'Mystic Hat',        level:25,xp:55,time:4.0,input:[{item:'moonpetal',qty:2},{item:'leather',qty:2}], output:{item:'mystic_hat',qty:1}},
      {id:'craft_mystic_robe',   name:'Mystic Robe',       level:28,xp:75,time:4.5,input:[{item:'moonpetal',qty:3},{item:'leather',qty:3}], output:{item:'mystic_robe',qty:1}},
      {id:'craft_mystic_skirt',  name:'Mystic Skirt',      level:26,xp:62,time:4.0,input:[{item:'moonpetal',qty:2},{item:'leather',qty:2}], output:{item:'mystic_skirt',qty:1}},
      {id:'craft_mystic_boots',  name:'Mystic Boots',      level:22,xp:48,time:3.5,input:[{item:'moonpetal',qty:1},{item:'leather',qty:2}], output:{item:'mystic_boots',qty:1}},
      {id:'craft_mystic_gloves', name:'Mystic Gloves',     level:24,xp:52,time:3.5,input:[{item:'moonpetal',qty:1},{item:'leather',qty:2}], output:{item:'mystic_gloves',qty:1}},
      {id:'craft_mage_cape',     name:'Mage Cape',         level:35,xp:90,time:4.5,input:[{item:'moonpetal',qty:3},{item:'silverleaf',qty:5}],output:{item:'mage_cape',qty:1}},
      {id:'craft_topaz_ring',    name:'Topaz Ring',        level:15,xp:30, time:3.5,input:[{item:'topaz',qty:1},{item:'bronze_bar',qty:1}],  output:{item:'topaz_ring',qty:1}},
      {id:'craft_sapphire_ring', name:'Sapphire Ring',     level:25,xp:60, time:4.0,input:[{item:'sapphire',qty:1},{item:'iron_bar',qty:1}], output:{item:'sapphire_ring',qty:1}},
      {id:'craft_ruby_ring',     name:'Ruby Ring',         level:35,xp:100,time:4.0,input:[{item:'ruby',qty:1},{item:'steel_bar',qty:1}],    output:{item:'ruby_ring',qty:1}},
      {id:'craft_emerald_ring',  name:'Emerald Ring',      level:45,xp:150,time:4.5,input:[{item:'emerald',qty:1},{item:'mithril_bar',qty:1}],output:{item:'emerald_ring',qty:1}},
      {id:'craft_diamond_ring',  name:'Diamond Ring',      level:55,xp:250,time:5.0,input:[{item:'diamond',qty:1},{item:'adamant_bar',qty:1}],output:{item:'diamond_ring',qty:1}},
      {id:'craft_onyx_ring',     name:'Onyx Ring',         level:65,xp:400,time:5.5,input:[{item:'onyx',qty:1},{item:'obsidian_bar',qty:1}], output:{item:'onyx_ring',qty:1}},
      {id:'craft_topaz_amulet',  name:'Topaz Amulet',      level:20,xp:40, time:4.0,input:[{item:'topaz',qty:1},{item:'iron_bar',qty:1}],    output:{item:'topaz_amulet',qty:1}},
      {id:'craft_sapphire_amulet',name:'Sapphire Amulet',  level:30,xp:75, time:4.5,input:[{item:'sapphire',qty:1},{item:'steel_bar',qty:1}],output:{item:'sapphire_amulet',qty:1}},
      {id:'craft_ruby_amulet',   name:'Ruby Amulet',       level:40,xp:120,time:5.0,input:[{item:'ruby',qty:1},{item:'mithril_bar',qty:1}],  output:{item:'ruby_amulet',qty:1}},
      {id:'craft_emerald_amulet',name:'Emerald Amulet',    level:50,xp:180,time:5.0,input:[{item:'emerald',qty:1},{item:'adamant_bar',qty:1}],output:{item:'emerald_amulet',qty:1}},
      {id:'craft_diamond_amulet',name:'Diamond Amulet',    level:60,xp:300,time:5.5,input:[{item:'diamond',qty:1},{item:'obsidian_bar',qty:1}],output:{item:'diamond_amulet',qty:1}},
      {id:'craft_onyx_amulet',   name:'Onyx Amulet',       level:70,xp:500,time:6.0,input:[{item:'onyx',qty:1},{item:'obsidian_bar',qty:2}], output:{item:'onyx_amulet',qty:1}},
    ],
    alchemy: [
      {id:'brew_healing_i', name:'Healing Potion I', level:1, xp:15,time:3.0,input:[{item:'silverleaf',qty:3}],                 output:{item:'potion_healing_i',qty:1}},
      {id:'brew_healing_ii',name:'Healing Potion II',level:25,xp:50,time:4.0,input:[{item:'bloodroot',qty:3}],                  output:{item:'potion_healing_ii',qty:1}},
      {id:'brew_healing_iii',name:'Healing Potion III',level:50,xp:120,time:5.0,input:[{item:'moonpetal',qty:3}],               output:{item:'potion_healing_iii',qty:1}},
      {id:'brew_strength',  name:'Strength Potion',  level:15,xp:30,time:3.5,input:[{item:'silverleaf',qty:2},{item:'bloodroot',qty:1}],output:{item:'potion_strength',qty:1}},
      {id:'brew_defence',   name:'Defence Potion',   level:20,xp:35,time:3.5,input:[{item:'silverleaf',qty:1},{item:'bloodroot',qty:2}],output:{item:'potion_defence',qty:1}},
      {id:'brew_accuracy',  name:'Accuracy Potion',  level:35,xp:70,time:4.0,input:[{item:'moonpetal',qty:2},{item:'bloodroot',qty:1}], output:{item:'potion_accuracy',qty:1}},
      {id:'brew_speed',     name:'Haste Potion',     level:55,xp:160,time:5.5,input:[{item:'voidbloom',qty:2},{item:'moonpetal',qty:1}],output:{item:'potion_speed',qty:1}},
    ],
  },

  thievingTargets: [
    {id:'pickpocket_farmer',name:'Farmer',level:1, xp:8,  time:2.5,stunChance:0.20,stunTime:3,gold:{min:1,max:5},   loot:[{item:'potato_seed',qty:1,chance:0.30},{item:'onion_seed',qty:1,chance:0.15}]},
    {id:'pickpocket_guard', name:'Guard', level:15,xp:22, time:3.0,stunChance:0.25,stunTime:4,gold:{min:5,max:20},  loot:[{item:'iron_ore',qty:1,chance:0.10}]},
    {id:'pickpocket_merchant',name:'Merchant',level:30,xp:50,time:3.5,stunChance:0.30,stunTime:5,gold:{min:15,max:50},loot:[{item:'herb_seed',qty:1,chance:0.20},{item:'sapphire',qty:1,chance:0.05}]},
    {id:'pickpocket_noble', name:'Noble', level:45,xp:90, time:4.0,stunChance:0.35,stunTime:5,gold:{min:30,max:100},loot:[{item:'blood_seed',qty:1,chance:0.15},{item:'ruby',qty:1,chance:0.05}]},
    {id:'pickpocket_wizard',name:'Wizard',level:60,xp:160,time:4.5,stunChance:0.40,stunTime:6,gold:{min:50,max:200},loot:[{item:'moon_seed',qty:1,chance:0.10},{item:'rune_essence',qty:5,chance:0.20},{item:'chaos_rune',qty:3,chance:0.10}]},
  ],

  statusEffects: {
    burn:   {id:'burn',   name:'Burn',   color:'#d67338',desc:'Damage over time. Stacks multiplicatively.',tick:2.0,baseDmg:5},
    poison: {id:'poison', name:'Poison', color:'#5ab04b',desc:'Minor damage. Explodes at 7 stacks.',tick:2.0,baseDmg:3,explodeStacks:7,explodeDmg:80},
    freeze: {id:'freeze', name:'Freeze', color:'#4a9ed4',desc:'Triples damage on next hit.',tick:2.0,baseDmg:2},
    bleed:  {id:'bleed',  name:'Bleed',  color:'#a02a2a',desc:'Damage over time from crits.',tick:1.5,baseDmg:4},
  },

  monsters: {
    chicken:      {id:'chicken',     name:'Chicken',       hp:25,  maxHit:3,  attackSpeed:2.8,combatLevel:1, style:'melee', evasion:{melee:5, ranged:5, magic:5}, xp:5,  gold:{min:0,max:2},  alignment:'NN',drops:[{item:'feather',qty:1,chance:0.50},{item:'bones',qty:1,chance:1.0}]},
    rat:          {id:'rat',         name:'Giant Rat',     hp:40,  maxHit:5,  attackSpeed:2.6,combatLevel:3, style:'melee', evasion:{melee:8, ranged:8, magic:5}, xp:8,  gold:{min:1,max:5},  alignment:'CN',drops:[{item:'bones',qty:1,chance:1.0},{item:'leather',qty:1,chance:0.30}]},
    goblin:       {id:'goblin',      name:'Goblin',        hp:60,  maxHit:8,  attackSpeed:2.6,combatLevel:5, style:'melee', evasion:{melee:12,ranged:10,magic:8}, xp:12, gold:{min:3,max:12}, alignment:'CE',drops:[{item:'bones',qty:1,chance:1.0},{item:'bronze_sword',qty:1,chance:0.05},{item:'bronze_shield',qty:1,chance:0.05}]},
    skeleton:     {id:'skeleton',    name:'Skeleton',      hp:100, maxHit:12, attackSpeed:2.4,combatLevel:10,style:'melee', evasion:{melee:18,ranged:15,magic:10},xp:18, gold:{min:5,max:20}, alignment:'NE',drops:[{item:'bones',qty:2,chance:1.0},{item:'iron_sword',qty:1,chance:0.05}]},
    bandit:       {id:'bandit',      name:'Bandit',        hp:150, maxHit:18, attackSpeed:2.4,combatLevel:15,style:'melee', evasion:{melee:25,ranged:20,magic:15},xp:25, gold:{min:10,max:40},alignment:'CN',drops:[{item:'bones',qty:1,chance:1.0},{item:'iron_plate',qty:1,chance:0.03},{item:'iron_helm',qty:1,chance:0.05},{item:'leather',qty:1,chance:0.30}]},
    wolf:         {id:'wolf',        name:'Dire Wolf',     hp:200, maxHit:22, attackSpeed:2.2,combatLevel:20,style:'melee', evasion:{melee:30,ranged:25,magic:15},xp:32, gold:{min:8,max:30}, alignment:'NN',drops:[{item:'bones',qty:1,chance:1.0},{item:'wolf_pelt',qty:1,chance:0.40},{item:'leather',qty:2,chance:0.40}]},
    troll:        {id:'troll',       name:'Troll',         hp:350, maxHit:30, attackSpeed:3.0,combatLevel:28,style:'melee', evasion:{melee:35,ranged:30,magic:20},xp:45, gold:{min:15,max:60},alignment:'CE',drops:[{item:'big_bones',qty:1,chance:1.0},{item:'steel_plate',qty:1,chance:0.03},{item:'iron_ore',qty:2,chance:0.15}]},
    dark_mage:    {id:'dark_mage',   name:'Dark Mage',     hp:280, maxHit:35, attackSpeed:2.6,combatLevel:32,style:'magic', evasion:{melee:15,ranged:20,magic:45},xp:55, gold:{min:20,max:80},alignment:'NE',drops:[{item:'bones',qty:1,chance:1.0},{item:'chaos_rune',qty:5,chance:0.20},{item:'mystic_staff',qty:1,chance:0.02},{item:'mystic_robe',qty:1,chance:0.03}]},
    shadow_archer:{id:'shadow_archer',name:'Shadow Archer',hp:320, maxHit:32, attackSpeed:2.2,combatLevel:35,style:'ranged',evasion:{melee:20,ranged:40,magic:25},xp:60, gold:{min:20,max:70},alignment:'CE',drops:[{item:'bones',qty:1,chance:1.0},{item:'steel_arrows',qty:10,chance:0.30},{item:'maple_shortbow',qty:1,chance:0.03},{item:'studded_body',qty:1,chance:0.04}]},
    ogre:         {id:'ogre',        name:'Ogre',          hp:500, maxHit:40, attackSpeed:3.2,combatLevel:40,style:'melee', evasion:{melee:40,ranged:35,magic:25},xp:75, gold:{min:25,max:100},alignment:'CE',drops:[{item:'big_bones',qty:1,chance:1.0},{item:'mithril_ore',qty:2,chance:0.10},{item:'hard_leather',qty:1,chance:0.20}]},
    wyvern:       {id:'wyvern',      name:'Wyvern',        hp:700, maxHit:55, attackSpeed:2.4,combatLevel:50,style:'ranged',evasion:{melee:50,ranged:55,magic:35},xp:100,gold:{min:40,max:150},alignment:'CN',drops:[{item:'big_bones',qty:2,chance:1.0},{item:'wyvern_scale',qty:1,chance:0.25},{item:'adamant_ore',qty:2,chance:0.08},{item:'yew_longbow',qty:1,chance:0.02}]},
    demon:        {id:'demon',       name:'Demon',         hp:900, maxHit:70, attackSpeed:2.6,combatLevel:60,style:'magic', evasion:{melee:35,ranged:40,magic:65},xp:140,gold:{min:60,max:200},alignment:'CE',drops:[{item:'big_bones',qty:2,chance:1.0},{item:'death_rune',qty:5,chance:0.15},{item:'void_staff',qty:1,chance:0.01},{item:'adept_robe',qty:1,chance:0.02}]},
    dragon:       {id:'dragon',      name:'Dragon',        hp:1500,maxHit:90, attackSpeed:2.8,combatLevel:75,style:'melee', evasion:{melee:70,ranged:65,magic:50},xp:200,gold:{min:100,max:400},alignment:'NE',drops:[{item:'dragon_bones',qty:1,chance:1.0},{item:'dragon_hide',qty:1,chance:0.50},{item:'obsidian_ore',qty:3,chance:0.10},{item:'dragon_scimitar',qty:1,chance:0.01}]},
    void_walker:  {id:'void_walker', name:'Void Walker',   hp:2000,maxHit:110,attackSpeed:2.2,combatLevel:85,style:'magic', evasion:{melee:60,ranged:55,magic:80},xp:280,gold:{min:150,max:500},alignment:'CE',drops:[{item:'dragon_bones',qty:2,chance:1.0},{item:'death_rune',qty:10,chance:0.20},{item:'elder_staff',qty:1,chance:0.005},{item:'archmage_robe',qty:1,chance:0.01}]},
    ashfall_titan:{id:'ashfall_titan',name:'Ashfall Titan',hp:5000,maxHit:150,attackSpeed:3.0,combatLevel:99,style:'melee', evasion:{melee:90,ranged:85,magic:70},xp:500,gold:{min:500,max:2000},alignment:'CE',drops:[{item:'dragon_bones',qty:5,chance:1.0},{item:'ashfire_blade',qty:1,chance:0.005},{item:'ashfall_amulet',qty:1,chance:0.002},{item:'obsidian_bar',qty:5,chance:0.15}]},
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
    {id:'power_strike', name:'Power Strike', style:'melee', desc:'Next attack deals +100% damage.',cooldown:15,tacticsReq:1, effect:{damageMult:2}},
    {id:'quick_shot',   name:'Quick Shot',   style:'ranged',desc:'Instant shot with +50% damage.', cooldown:12,tacticsReq:1, effect:{instantMult:1.5}},
    {id:'fireball',     name:'Fireball',     style:'magic', desc:'Big magic hit + Burn (3 stacks).',cooldown:18,tacticsReq:1, effect:{magicDmg:80,burn:3}},
    {id:'war_cry',      name:'War Cry',      style:'any',   desc:'+25% damage for 15s.',            cooldown:60,tacticsReq:10,effect:{buff:{stat:'damageMult',value:1.25,duration:15}}},
    {id:'ice_blast',    name:'Ice Blast',    style:'magic', desc:'Freezes target (5 stacks).',      cooldown:25,tacticsReq:10,effect:{freeze:5}},
    {id:'venom_strike', name:'Venom Strike', style:'melee', desc:'Apply Poison (2 stacks).',        cooldown:20,tacticsReq:15,effect:{poison:2}},
    {id:'execute',      name:'Execute',      style:'melee', desc:'Triple damage if target < 30% HP.',cooldown:30,tacticsReq:25,effect:{execute:3}},
    {id:'heal',         name:'Heal',         style:'any',   desc:'Restore 30% of max HP.',          cooldown:45,tacticsReq:20,effect:{heal:0.30}},
  ],

  worldBosses: [
    {id:'blight_warden',name:'The Blight Warden',hp:15000,maxHit:140,combatLevel:80, style:'melee',attackSpeed:2.5,evasion:{melee:70,ranged:60,magic:55},desc:'A plague-ridden titan.',          respawn:3600, xp:2000,gold:{min:2000,max:5000}, rewards:[{item:'dragon_bones',qty:3,chance:1.0},{item:'obsidian_plate',qty:1,chance:0.10},{item:'diamond',qty:3,chance:0.50}]},
    {id:'storm_reaver', name:'Storm Reaver',     hp:22000,maxHit:170,combatLevel:90, style:'magic',attackSpeed:2.2,evasion:{melee:60,ranged:55,magic:80},desc:'A lightning-wreathed horror.',    respawn:7200, xp:3500,gold:{min:4000,max:8000}, rewards:[{item:'dragon_bones',qty:4,chance:1.0},{item:'elder_staff',qty:1,chance:0.08},{item:'ancient_ring',qty:1,chance:0.05}]},
    {id:'ashen_overlord',name:'The Ashen Overlord',hp:40000,maxHit:220,combatLevel:110,style:'melee',attackSpeed:2.4,evasion:{melee:90,ranged:85,magic:75},desc:'The burnt king of the first age.',respawn:14400,xp:8000,gold:{min:10000,max:25000},rewards:[{item:'dragon_bones',qty:6,chance:1.0},{item:'ashfire_blade',qty:1,chance:0.15},{item:'ashfall_amulet',qty:1,chance:0.08}]},
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
