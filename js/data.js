// ============================================================
// ASHFALL IDLE - Complete Game Data
// ============================================================

const GAME_DATA = {
  // ── XP TABLE ──────────────────────────────────────────────
  xpTable: (() => {
    const t = [0];
    for (let i = 1; i <= 120; i++) {
      t[i] = Math.floor(t[i - 1] + Math.floor(i + 300 * Math.pow(2, i / 7)) / 4);
    }
    return t;
  })(),

  // ── SKILLS ────────────────────────────────────────────────
  skills: {
    // Gathering
    woodcutting:  { id:'woodcutting',  name:'Woodcutting',  type:'gathering', icon:'axe',        desc:'Chop trees for logs used in Firemaking, Fletching, and crafting.' },
    mining:       { id:'mining',       name:'Mining',       type:'gathering', icon:'pickaxe',    desc:'Mine rocks for ores and gems used in Smithing and Crafting.' },
    fishing:      { id:'fishing',      name:'Fishing',      type:'gathering', icon:'fish',       desc:'Catch fish to be cooked into food for combat healing.' },
    foraging:     { id:'foraging',     name:'Foraging',     type:'gathering', icon:'herb',       desc:'Gather herbs, mushrooms, and rare plants from the wilds.' },
    // Artisan
    cooking:      { id:'cooking',      name:'Cooking',      type:'artisan',   icon:'cauldron',   desc:'Cook raw food into edible meals that heal during combat.' },
    smithing:     { id:'smithing',     name:'Smithing',     type:'artisan',   icon:'anvil',      desc:'Smelt ores into bars and forge weapons and armor.' },
    fletching:    { id:'fletching',    name:'Fletching',    type:'artisan',   icon:'bow',        desc:'Craft bows, arrows, and ranged ammunition from wood and feathers.' },
    crafting:     { id:'crafting',     name:'Crafting',     type:'artisan',   icon:'ring',       desc:'Create jewelry, leather armor, and accessories.' },
    alchemy:      { id:'alchemy',      name:'Alchemy',      type:'artisan',   icon:'potion',     desc:'Brew powerful potions from herbs and secondary ingredients.' },
    enchanting:   { id:'enchanting',   name:'Enchanting',   type:'artisan',   icon:'sparkle',    desc:'Imbue equipment with magical properties using runes and essences.' },
    // Combat
    attack:       { id:'attack',       name:'Attack',       type:'combat',    icon:'sword',      desc:'Determines melee accuracy. Higher Attack means more consistent hits.' },
    strength:     { id:'strength',     name:'Strength',     type:'combat',    icon:'fist',       desc:'Determines melee max hit. Higher Strength deals more damage.' },
    defence:      { id:'defence',      name:'Defence',      type:'combat',    icon:'shield',     desc:'Reduces incoming damage. Determines armor effectiveness.' },
    hitpoints:    { id:'hitpoints',    name:'Hitpoints',    type:'combat',    icon:'heart',      desc:'Your health pool. Higher Hitpoints lets you survive longer fights.' },
    ranged:       { id:'ranged',       name:'Ranged',       type:'combat',    icon:'target',     desc:'Governs ranged accuracy and damage with bows and thrown weapons.' },
    magic:        { id:'magic',        name:'Magic',        type:'combat',    icon:'wand',       desc:'Controls spell accuracy and damage. Uses runes as ammunition.' },
    // Support
    farming:      { id:'farming',      name:'Farming',      type:'support',   icon:'seedling',   desc:'Grow crops and herbs passively. Runs alongside other skills.' },
    thieving:     { id:'thieving',     name:'Thieving',     type:'support',   icon:'mask',       desc:'Pickpocket NPCs for gold, seeds, and rare items.' },
  },

  // ── ITEMS ─────────────────────────────────────────────────
  items: {
    // === LOGS ===
    oak_log:      { id:'oak_log',      name:'Oak Log',       type:'resource', subtype:'log',  sellPrice:2,  icon:'log',      desc:'A sturdy oak log.' },
    willow_log:   { id:'willow_log',   name:'Willow Log',    type:'resource', subtype:'log',  sellPrice:5,  icon:'log',      desc:'A flexible willow log.' },
    maple_log:    { id:'maple_log',    name:'Maple Log',     type:'resource', subtype:'log',  sellPrice:15, icon:'log',      desc:'A dense maple log.' },
    yew_log:      { id:'yew_log',      name:'Yew Log',       type:'resource', subtype:'log',  sellPrice:40, icon:'log',      desc:'A prized yew log, ideal for bows.' },
    elder_log:    { id:'elder_log',    name:'Elder Log',     type:'resource', subtype:'log',  sellPrice:100,icon:'log',      desc:'An ancient elder log pulsing with faint energy.' },
    ash_log:      { id:'ash_log',      name:'Ashwood Log',   type:'resource', subtype:'log',  sellPrice:250,icon:'log',      desc:'Charred ashwood from the Scorched Reach.' },

    // === ORES ===
    copper_ore:   { id:'copper_ore',   name:'Copper Ore',    type:'resource', subtype:'ore',  sellPrice:3,  icon:'ore',      desc:'A chunk of copper ore.' },
    tin_ore:      { id:'tin_ore',      name:'Tin Ore',       type:'resource', subtype:'ore',  sellPrice:3,  icon:'ore',      desc:'A chunk of tin ore.' },
    iron_ore:     { id:'iron_ore',     name:'Iron Ore',      type:'resource', subtype:'ore',  sellPrice:10, icon:'ore',      desc:'A lump of iron ore.' },
    coal_ore:     { id:'coal_ore',     name:'Coal',          type:'resource', subtype:'ore',  sellPrice:15, icon:'ore',      desc:'Black coal used as smelting fuel.' },
    mithril_ore:  { id:'mithril_ore',  name:'Mithril Ore',   type:'resource', subtype:'ore',  sellPrice:50, icon:'ore',      desc:'A gleaming blue-green ore.' },
    adamant_ore:  { id:'adamant_ore',  name:'Adamant Ore',   type:'resource', subtype:'ore',  sellPrice:120,icon:'ore',      desc:'A dark green ore of extreme density.' },
    obsidian_ore: { id:'obsidian_ore', name:'Obsidian Ore',  type:'resource', subtype:'ore',  sellPrice:300,icon:'ore',      desc:'Volcanic glass forged deep underground.' },

    // === BARS ===
    bronze_bar:   { id:'bronze_bar',   name:'Bronze Bar',    type:'resource', subtype:'bar',  sellPrice:8,   icon:'bar',     desc:'An alloy of copper and tin.' },
    iron_bar:     { id:'iron_bar',     name:'Iron Bar',      type:'resource', subtype:'bar',  sellPrice:25,  icon:'bar',     desc:'A refined iron ingot.' },
    steel_bar:    { id:'steel_bar',    name:'Steel Bar',     type:'resource', subtype:'bar',  sellPrice:50,  icon:'bar',     desc:'Iron alloyed with coal for strength.' },
    mithril_bar:  { id:'mithril_bar',  name:'Mithril Bar',   type:'resource', subtype:'bar',  sellPrice:150, icon:'bar',     desc:'A bar of lightweight, resilient mithril.' },
    adamant_bar:  { id:'adamant_bar',  name:'Adamant Bar',   type:'resource', subtype:'bar',  sellPrice:350, icon:'bar',     desc:'An incredibly hard adamantite bar.' },
    obsidian_bar: { id:'obsidian_bar', name:'Obsidian Bar',  type:'resource', subtype:'bar',  sellPrice:800, icon:'bar',     desc:'Molten obsidian forged into solid form.' },

    // === GEMS ===
    topaz:        { id:'topaz',        name:'Topaz',         type:'resource', subtype:'gem',  sellPrice:50,  icon:'gem',     desc:'A warm amber gemstone.' },
    sapphire:     { id:'sapphire',     name:'Sapphire',      type:'resource', subtype:'gem',  sellPrice:100, icon:'gem',     desc:'A brilliant blue sapphire.' },
    ruby:         { id:'ruby',         name:'Ruby',          type:'resource', subtype:'gem',  sellPrice:200, icon:'gem',     desc:'A fiery red ruby.' },
    emerald:      { id:'emerald',      name:'Emerald',       type:'resource', subtype:'gem',  sellPrice:300, icon:'gem',     desc:'A vibrant green emerald.' },
    diamond:      { id:'diamond',      name:'Diamond',       type:'resource', subtype:'gem',  sellPrice:500, icon:'gem',     desc:'A flawless diamond of extraordinary clarity.' },
    onyx:         { id:'onyx',         name:'Onyx',          type:'resource', subtype:'gem',  sellPrice:1500,icon:'gem',     desc:'A jet-black onyx radiating dark energy.' },

    // === RAW FISH ===
    raw_shrimp:   { id:'raw_shrimp',   name:'Raw Shrimp',    type:'resource', subtype:'fish', sellPrice:1,   icon:'rawfish', desc:'A tiny shrimp.' },
    raw_trout:    { id:'raw_trout',    name:'Raw Trout',     type:'resource', subtype:'fish', sellPrice:5,   icon:'rawfish', desc:'A fresh trout.' },
    raw_salmon:   { id:'raw_salmon',   name:'Raw Salmon',    type:'resource', subtype:'fish', sellPrice:12,  icon:'rawfish', desc:'A glistening salmon.' },
    raw_lobster:  { id:'raw_lobster',  name:'Raw Lobster',   type:'resource', subtype:'fish', sellPrice:30,  icon:'rawfish', desc:'A large, red lobster.' },
    raw_swordfish:{ id:'raw_swordfish',name:'Raw Swordfish', type:'resource', subtype:'fish', sellPrice:65,  icon:'rawfish', desc:'A mighty swordfish.' },
    raw_anglerfish:{ id:'raw_anglerfish',name:'Raw Anglerfish',type:'resource',subtype:'fish',sellPrice:150, icon:'rawfish', desc:'A deep-sea anglerfish with bioluminescent lure.' },
    raw_leviathan:{ id:'raw_leviathan',name:'Raw Leviathan', type:'resource', subtype:'fish', sellPrice:400, icon:'rawfish', desc:'An enormous primordial fish.' },

    // === COOKED FOOD ===
    shrimp:       { id:'shrimp',       name:'Shrimp',        type:'food', heals:20,   sellPrice:3,   icon:'food', desc:'Cooked shrimp. Heals 20 HP.' },
    trout:        { id:'trout',        name:'Trout',         type:'food', heals:50,   sellPrice:12,  icon:'food', desc:'Cooked trout. Heals 50 HP.' },
    salmon:       { id:'salmon',       name:'Salmon',        type:'food', heals:90,   sellPrice:25,  icon:'food', desc:'Cooked salmon. Heals 90 HP.' },
    lobster:      { id:'lobster',      name:'Lobster',       type:'food', heals:160,  sellPrice:60,  icon:'food', desc:'Cooked lobster. Heals 160 HP.' },
    swordfish:    { id:'swordfish',    name:'Swordfish',     type:'food', heals:250,  sellPrice:120, icon:'food', desc:'Cooked swordfish. Heals 250 HP.' },
    anglerfish:   { id:'anglerfish',   name:'Anglerfish',    type:'food', heals:400,  sellPrice:300, icon:'food', desc:'Cooked anglerfish. Heals 400 HP.' },
    leviathan_steak:{ id:'leviathan_steak',name:'Leviathan Steak',type:'food',heals:650,sellPrice:800,icon:'food',desc:'Seared leviathan. Heals 650 HP.' },

    // === HERBS ===
    silverleaf:   { id:'silverleaf',   name:'Silverleaf',    type:'resource', subtype:'herb', sellPrice:5,   icon:'herb', desc:'A common silvery herb.' },
    bloodroot:    { id:'bloodroot',    name:'Bloodroot',     type:'resource', subtype:'herb', sellPrice:15,  icon:'herb', desc:'A deep red root with healing properties.' },
    moonpetal:    { id:'moonpetal',    name:'Moonpetal',     type:'resource', subtype:'herb', sellPrice:40,  icon:'herb', desc:'A pale flower that blooms only at night.' },
    voidbloom:    { id:'voidbloom',    name:'Voidbloom',     type:'resource', subtype:'herb', sellPrice:100, icon:'herb', desc:'A dark purple bloom from the abyss.' },
    ashblossom:   { id:'ashblossom',   name:'Ashblossom',    type:'resource', subtype:'herb', sellPrice:250, icon:'herb', desc:'A fire-resistant flower from volcanic soil.' },

    // === POTIONS ===
    potion_healing_i:   { id:'potion_healing_i',   name:'Healing Potion I',   type:'potion', heals:100,  sellPrice:20,  icon:'potion', desc:'Restores 100 HP instantly.' },
    potion_healing_ii:  { id:'potion_healing_ii',  name:'Healing Potion II',  type:'potion', heals:300,  sellPrice:80,  icon:'potion', desc:'Restores 300 HP instantly.' },
    potion_healing_iii: { id:'potion_healing_iii', name:'Healing Potion III', type:'potion', heals:600,  sellPrice:200, icon:'potion', desc:'Restores 600 HP instantly.' },
    potion_strength:    { id:'potion_strength',    name:'Strength Potion',    type:'potion', buff:{stat:'strengthBonus',value:10,duration:120}, sellPrice:50,  icon:'potion', desc:'+10 Strength bonus for 120s.' },
    potion_defence:     { id:'potion_defence',     name:'Defence Potion',     type:'potion', buff:{stat:'defenceBonus',value:10,duration:120},  sellPrice:50,  icon:'potion', desc:'+10 Defence bonus for 120s.' },
    potion_accuracy:    { id:'potion_accuracy',    name:'Accuracy Potion',    type:'potion', buff:{stat:'accuracyBonus',value:15,duration:120}, sellPrice:60,  icon:'potion', desc:'+15% Accuracy for 120s.' },
    potion_speed:       { id:'potion_speed',       name:'Haste Potion',       type:'potion', buff:{stat:'speedBonus',value:20,duration:60},     sellPrice:150, icon:'potion', desc:'+20% Attack Speed for 60s.' },

    // === FEATHERS & MISC ===
    feather:      { id:'feather',      name:'Feather',       type:'resource', subtype:'misc', sellPrice:1,   icon:'feather', desc:'A light feather for fletching.' },
    leather:      { id:'leather',      name:'Leather',       type:'resource', subtype:'misc', sellPrice:8,   icon:'leather', desc:'Tanned animal hide.' },
    bones:        { id:'bones',        name:'Bones',         type:'resource', subtype:'misc', sellPrice:5,   icon:'bone',    desc:'Monster bones. Can be buried for prayer XP.' },
    big_bones:    { id:'big_bones',    name:'Big Bones',     type:'resource', subtype:'misc', sellPrice:20,  icon:'bone',    desc:'Large bones from powerful creatures.' },
    dragon_bones: { id:'dragon_bones', name:'Dragon Bones',  type:'resource', subtype:'misc', sellPrice:100, icon:'bone',    desc:'Bones from a slain dragon.' },
    rune_essence: { id:'rune_essence', name:'Rune Essence',  type:'resource', subtype:'misc', sellPrice:2,   icon:'essence', desc:'A blank magical essence ready to be inscribed.' },
    fire_rune:    { id:'fire_rune',    name:'Fire Rune',     type:'resource', subtype:'rune', sellPrice:5,   icon:'rune',    desc:'A rune imbued with fire magic.' },
    water_rune:   { id:'water_rune',   name:'Water Rune',    type:'resource', subtype:'rune', sellPrice:5,   icon:'rune',    desc:'A rune imbued with water magic.' },
    earth_rune:   { id:'earth_rune',   name:'Earth Rune',    type:'resource', subtype:'rune', sellPrice:5,   icon:'rune',    desc:'A rune imbued with earth magic.' },
    air_rune:     { id:'air_rune',     name:'Air Rune',      type:'resource', subtype:'rune', sellPrice:5,   icon:'rune',    desc:'A rune imbued with air magic.' },
    chaos_rune:   { id:'chaos_rune',   name:'Chaos Rune',    type:'resource', subtype:'rune', sellPrice:25,  icon:'rune',    desc:'A volatile rune of chaos magic.' },
    death_rune:   { id:'death_rune',   name:'Death Rune',    type:'resource', subtype:'rune', sellPrice:60,  icon:'rune',    desc:'A dark rune of death magic.' },
    enchant_scroll:{ id:'enchant_scroll',name:'Enchant Scroll',type:'resource',subtype:'misc',sellPrice:200, icon:'scroll',  desc:'A scroll used in enchanting rituals.' },
    gold_coin:    { id:'gold_coin',    name:'Gold',          type:'currency', sellPrice:0,    icon:'coin',    desc:'The universal currency of Ashfall.' },

    // === SEEDS ===
    potato_seed:  { id:'potato_seed',  name:'Potato Seed',   type:'seed', growTime:300,  yield:'potato',       sellPrice:1,   icon:'seed', desc:'Grows into potatoes. 5 min grow time.' },
    onion_seed:   { id:'onion_seed',   name:'Onion Seed',    type:'seed', growTime:600,  yield:'onion',        sellPrice:3,   icon:'seed', desc:'Grows into onions. 10 min grow time.' },
    herb_seed:    { id:'herb_seed',    name:'Herb Seed',     type:'seed', growTime:900,  yield:'silverleaf',   sellPrice:8,   icon:'seed', desc:'Grows into silverleaf herbs. 15 min grow time.' },
    blood_seed:   { id:'blood_seed',   name:'Bloodroot Seed',type:'seed', growTime:1800, yield:'bloodroot',    sellPrice:20,  icon:'seed', desc:'Grows into bloodroot. 30 min grow time.' },
    moon_seed:    { id:'moon_seed',    name:'Moonpetal Seed',type:'seed', growTime:3600, yield:'moonpetal',    sellPrice:50,  icon:'seed', desc:'Grows into moonpetal. 60 min grow time.' },

    // === FARM PRODUCE ===
    potato:       { id:'potato',       name:'Potato',        type:'food', heals:10,  sellPrice:3,   icon:'food', desc:'A raw potato. Heals 10 HP.' },
    onion:        { id:'onion',        name:'Onion',         type:'food', heals:15,  sellPrice:5,   icon:'food', desc:'A pungent onion. Heals 15 HP.' },

    // === ARROWS ===
    bronze_arrows:  { id:'bronze_arrows',  name:'Bronze Arrows',  type:'ammo', subtype:'arrow', ammoType:'arrow', rangedBonus:2,   sellPrice:1,  icon:'arrow', desc:'Basic bronze-tipped arrows.' },
    iron_arrows:    { id:'iron_arrows',    name:'Iron Arrows',    type:'ammo', subtype:'arrow', ammoType:'arrow', rangedBonus:5,   sellPrice:3,  icon:'arrow', desc:'Iron-tipped arrows.' },
    steel_arrows:   { id:'steel_arrows',   name:'Steel Arrows',   type:'ammo', subtype:'arrow', ammoType:'arrow', rangedBonus:10,  sellPrice:8,  icon:'arrow', desc:'Steel-tipped arrows.' },
    mithril_arrows: { id:'mithril_arrows', name:'Mithril Arrows', type:'ammo', subtype:'arrow', ammoType:'arrow', rangedBonus:18,  sellPrice:20, icon:'arrow', desc:'Mithril-tipped arrows.' },
    adamant_arrows: { id:'adamant_arrows', name:'Adamant Arrows', type:'ammo', subtype:'arrow', ammoType:'arrow', rangedBonus:28,  sellPrice:45, icon:'arrow', desc:'Adamant-tipped arrows.' },

    // === MELEE WEAPONS ===
    bronze_sword:  { id:'bronze_sword',  name:'Bronze Sword',   type:'weapon', slot:'weapon', style:'melee',  attackSpeed:2.4, stats:{ attackBonus:5,   strengthBonus:4   }, levelReq:{attack:1},  sellPrice:15,   icon:'sword', desc:'A basic bronze blade.' },
    iron_sword:    { id:'iron_sword',    name:'Iron Sword',     type:'weapon', slot:'weapon', style:'melee',  attackSpeed:2.4, stats:{ attackBonus:12,  strengthBonus:10  }, levelReq:{attack:10}, sellPrice:50,   icon:'sword', desc:'A reliable iron sword.' },
    steel_sword:   { id:'steel_sword',   name:'Steel Sword',    type:'weapon', slot:'weapon', style:'melee',  attackSpeed:2.4, stats:{ attackBonus:22,  strengthBonus:18  }, levelReq:{attack:20}, sellPrice:150,  icon:'sword', desc:'A well-forged steel blade.' },
    mithril_sword: { id:'mithril_sword', name:'Mithril Sword',  type:'weapon', slot:'weapon', style:'melee',  attackSpeed:2.2, stats:{ attackBonus:35,  strengthBonus:28  }, levelReq:{attack:30}, sellPrice:400,  icon:'sword', desc:'A gleaming mithril longsword.' },
    adamant_sword: { id:'adamant_sword', name:'Adamant Sword',  type:'weapon', slot:'weapon', style:'melee',  attackSpeed:2.2, stats:{ attackBonus:50,  strengthBonus:42  }, levelReq:{attack:40}, sellPrice:1000, icon:'sword', desc:'A dark green adamantite blade.' },
    obsidian_sword:{ id:'obsidian_sword',name:'Obsidian Blade',  type:'weapon', slot:'weapon', style:'melee', attackSpeed:2.0, stats:{ attackBonus:72,  strengthBonus:60  }, levelReq:{attack:50}, sellPrice:3000, icon:'sword', desc:'A razor-sharp blade of volcanic glass.' },
    ashfire_blade: { id:'ashfire_blade', name:'Ashfire Blade',   type:'weapon', slot:'weapon', style:'melee',  attackSpeed:1.8, stats:{ attackBonus:95,  strengthBonus:80  }, levelReq:{attack:60}, sellPrice:10000,icon:'sword', desc:'A legendary blade forged in ashfire.' },
    dragon_scimitar:{ id:'dragon_scimitar',name:'Dragon Scimitar',type:'weapon',slot:'weapon', style:'melee', attackSpeed:2.0, stats:{ attackBonus:85,  strengthBonus:70  }, levelReq:{attack:55}, sellPrice:8000, icon:'sword', desc:'A curved blade made from dragon scale.' },

    // === RANGED WEAPONS ===
    oak_shortbow:  { id:'oak_shortbow',  name:'Oak Shortbow',   type:'weapon', slot:'weapon', style:'ranged', attackSpeed:2.4, stats:{ rangedBonus:8   }, levelReq:{ranged:1},  sellPrice:20,   icon:'bow', ammoType:'arrow', desc:'A simple oak bow.' },
    willow_shortbow:{ id:'willow_shortbow',name:'Willow Shortbow',type:'weapon',slot:'weapon',style:'ranged',attackSpeed:2.2, stats:{ rangedBonus:16  }, levelReq:{ranged:15}, sellPrice:60,   icon:'bow', ammoType:'arrow', desc:'A supple willow bow.' },
    maple_shortbow:{ id:'maple_shortbow',name:'Maple Shortbow', type:'weapon', slot:'weapon', style:'ranged', attackSpeed:2.2, stats:{ rangedBonus:28  }, levelReq:{ranged:30}, sellPrice:200,  icon:'bow', ammoType:'arrow', desc:'A sturdy maple bow.' },
    yew_longbow:   { id:'yew_longbow',   name:'Yew Longbow',    type:'weapon', slot:'weapon', style:'ranged', attackSpeed:2.6, stats:{ rangedBonus:45  }, levelReq:{ranged:40}, sellPrice:600,  icon:'bow', ammoType:'arrow', desc:'A powerful yew longbow.' },
    elder_bow:     { id:'elder_bow',     name:'Elder Bow',      type:'weapon', slot:'weapon', style:'ranged', attackSpeed:2.0, stats:{ rangedBonus:65  }, levelReq:{ranged:55}, sellPrice:3000, icon:'bow', ammoType:'arrow', desc:'A bow carved from ancient elder wood.' },

    // === MAGIC WEAPONS ===
    apprentice_wand:{ id:'apprentice_wand',name:'Apprentice Wand',type:'weapon',slot:'weapon',style:'magic', attackSpeed:2.4, stats:{ magicBonus:5   }, levelReq:{magic:1},  sellPrice:25,   icon:'wand', desc:'A novice mage wand.' },
    mystic_staff:  { id:'mystic_staff',  name:'Mystic Staff',   type:'weapon', slot:'weapon', style:'magic',  attackSpeed:2.6, stats:{ magicBonus:20  }, levelReq:{magic:20}, sellPrice:200,  icon:'wand', desc:'A staff thrumming with magical energy.' },
    void_staff:    { id:'void_staff',    name:'Void Staff',     type:'weapon', slot:'weapon', style:'magic',  attackSpeed:2.2, stats:{ magicBonus:45  }, levelReq:{magic:40}, sellPrice:1200, icon:'wand', desc:'A staff channeling void energy.' },
    elder_staff:   { id:'elder_staff',   name:'Elder Staff',    type:'weapon', slot:'weapon', style:'magic',  attackSpeed:2.0, stats:{ magicBonus:70  }, levelReq:{magic:55}, sellPrice:5000, icon:'wand', desc:'An ancient staff of immense power.' },

    // === SHIELDS ===
    bronze_shield: { id:'bronze_shield', name:'Bronze Shield',  type:'armor', slot:'shield', stats:{ defenceBonus:3,  damageReduction:1 }, levelReq:{defence:1},  sellPrice:10,  icon:'shield', desc:'A basic bronze shield.' },
    iron_shield:   { id:'iron_shield',   name:'Iron Shield',    type:'armor', slot:'shield', stats:{ defenceBonus:8,  damageReduction:2 }, levelReq:{defence:10}, sellPrice:40,  icon:'shield', desc:'A sturdy iron shield.' },
    steel_shield:  { id:'steel_shield',  name:'Steel Shield',   type:'armor', slot:'shield', stats:{ defenceBonus:15, damageReduction:4 }, levelReq:{defence:20}, sellPrice:120, icon:'shield', desc:'A reinforced steel shield.' },
    mithril_shield:{ id:'mithril_shield',name:'Mithril Shield', type:'armor', slot:'shield', stats:{ defenceBonus:25, damageReduction:6 }, levelReq:{defence:30}, sellPrice:350, icon:'shield', desc:'A lightweight mithril shield.' },
    adamant_shield:{ id:'adamant_shield',name:'Adamant Shield', type:'armor', slot:'shield', stats:{ defenceBonus:38, damageReduction:8 }, levelReq:{defence:40}, sellPrice:900, icon:'shield', desc:'An incredibly tough adamant shield.' },

    // === HELMETS ===
    bronze_helm:   { id:'bronze_helm',   name:'Bronze Helm',    type:'armor', slot:'head', stats:{ defenceBonus:2,  damageReduction:0 }, levelReq:{defence:1},  sellPrice:8,   icon:'helm', desc:'A bronze helmet.' },
    iron_helm:     { id:'iron_helm',     name:'Iron Helm',      type:'armor', slot:'head', stats:{ defenceBonus:5,  damageReduction:1 }, levelReq:{defence:10}, sellPrice:30,  icon:'helm', desc:'An iron helmet.' },
    steel_helm:    { id:'steel_helm',    name:'Steel Helm',     type:'armor', slot:'head', stats:{ defenceBonus:10, damageReduction:2 }, levelReq:{defence:20}, sellPrice:90,  icon:'helm', desc:'A steel full helm.' },
    mithril_helm:  { id:'mithril_helm',  name:'Mithril Helm',   type:'armor', slot:'head', stats:{ defenceBonus:16, damageReduction:3 }, levelReq:{defence:30}, sellPrice:250, icon:'helm', desc:'A mithril helmet.' },
    adamant_helm:  { id:'adamant_helm',  name:'Adamant Helm',   type:'armor', slot:'head', stats:{ defenceBonus:24, damageReduction:5 }, levelReq:{defence:40}, sellPrice:600, icon:'helm', desc:'An adamant full helm.' },

    // === BODY ARMOR ===
    bronze_plate:  { id:'bronze_plate',  name:'Bronze Platebody', type:'armor', slot:'body', stats:{ defenceBonus:5,  damageReduction:1 }, levelReq:{defence:1},  sellPrice:20,   icon:'armor', desc:'Bronze plate armor.' },
    iron_plate:    { id:'iron_plate',    name:'Iron Platebody',   type:'armor', slot:'body', stats:{ defenceBonus:12, damageReduction:2 }, levelReq:{defence:10}, sellPrice:80,   icon:'armor', desc:'Iron plate armor.' },
    steel_plate:   { id:'steel_plate',   name:'Steel Platebody',  type:'armor', slot:'body', stats:{ defenceBonus:22, damageReduction:4 }, levelReq:{defence:20}, sellPrice:250,  icon:'armor', desc:'Steel plate armor.' },
    mithril_plate: { id:'mithril_plate', name:'Mithril Platebody',type:'armor', slot:'body', stats:{ defenceBonus:35, damageReduction:6 }, levelReq:{defence:30}, sellPrice:700,  icon:'armor', desc:'Mithril plate armor.' },
    adamant_plate: { id:'adamant_plate', name:'Adamant Platebody',type:'armor', slot:'body', stats:{ defenceBonus:50, damageReduction:9 }, levelReq:{defence:40}, sellPrice:2000, icon:'armor', desc:'Adamant plate armor.' },
    obsidian_plate:{ id:'obsidian_plate',name:'Obsidian Platebody',type:'armor',slot:'body', stats:{ defenceBonus:70, damageReduction:12}, levelReq:{defence:50}, sellPrice:6000, icon:'armor', desc:'Obsidian plate armor.' },

    // === LEG ARMOR ===
    bronze_legs:   { id:'bronze_legs',   name:'Bronze Platelegs', type:'armor', slot:'legs', stats:{ defenceBonus:3,  damageReduction:0 }, levelReq:{defence:1},  sellPrice:12,  icon:'legs', desc:'Bronze leg armor.' },
    iron_legs:     { id:'iron_legs',     name:'Iron Platelegs',   type:'armor', slot:'legs', stats:{ defenceBonus:8,  damageReduction:1 }, levelReq:{defence:10}, sellPrice:50,  icon:'legs', desc:'Iron leg armor.' },
    steel_legs:    { id:'steel_legs',    name:'Steel Platelegs',  type:'armor', slot:'legs', stats:{ defenceBonus:15, damageReduction:3 }, levelReq:{defence:20}, sellPrice:160, icon:'legs', desc:'Steel leg armor.' },
    mithril_legs:  { id:'mithril_legs',  name:'Mithril Platelegs',type:'armor', slot:'legs', stats:{ defenceBonus:24, damageReduction:4 }, levelReq:{defence:30}, sellPrice:450, icon:'legs', desc:'Mithril leg armor.' },
    adamant_legs:  { id:'adamant_legs',  name:'Adamant Platelegs',type:'armor', slot:'legs', stats:{ defenceBonus:36, damageReduction:7 }, levelReq:{defence:40}, sellPrice:1200,icon:'legs', desc:'Adamant leg armor.' },

    // === BOOTS ===
    leather_boots: { id:'leather_boots', name:'Leather Boots',  type:'armor', slot:'boots', stats:{ defenceBonus:1 }, levelReq:{defence:1},  sellPrice:5,   icon:'boots', desc:'Simple leather boots.' },
    iron_boots:    { id:'iron_boots',    name:'Iron Boots',     type:'armor', slot:'boots', stats:{ defenceBonus:4 }, levelReq:{defence:10}, sellPrice:25,  icon:'boots', desc:'Iron-plated boots.' },
    steel_boots:   { id:'steel_boots',   name:'Steel Boots',    type:'armor', slot:'boots', stats:{ defenceBonus:8 }, levelReq:{defence:20}, sellPrice:75,  icon:'boots', desc:'Steel-plated boots.' },

    // === GLOVES ===
    leather_gloves:{ id:'leather_gloves',name:'Leather Gloves', type:'armor', slot:'gloves', stats:{ attackBonus:1 },  levelReq:{defence:1},  sellPrice:5,  icon:'gloves', desc:'Simple leather gloves.' },
    iron_gloves:   { id:'iron_gloves',   name:'Iron Gauntlets', type:'armor', slot:'gloves', stats:{ attackBonus:3, strengthBonus:2 }, levelReq:{defence:10}, sellPrice:30, icon:'gloves', desc:'Iron gauntlets.' },

    // === JEWELRY ===
    topaz_ring:    { id:'topaz_ring',    name:'Topaz Ring',     type:'armor', slot:'ring', stats:{ attackBonus:2, strengthBonus:1 },  sellPrice:100,  icon:'ring', desc:'A ring set with a topaz.' },
    sapphire_ring: { id:'sapphire_ring', name:'Sapphire Ring',  type:'armor', slot:'ring', stats:{ defenceBonus:3, damageReduction:1 }, sellPrice:200,  icon:'ring', desc:'A ring set with a sapphire.' },
    ruby_ring:     { id:'ruby_ring',     name:'Ruby Ring',      type:'armor', slot:'ring', stats:{ strengthBonus:5 },  sellPrice:400,  icon:'ring', desc:'A ring set with a ruby.' },
    emerald_ring:  { id:'emerald_ring',  name:'Emerald Ring',   type:'armor', slot:'ring', stats:{ rangedBonus:5 },    sellPrice:600,  icon:'ring', desc:'A ring set with an emerald.' },
    diamond_ring:  { id:'diamond_ring',  name:'Diamond Ring',   type:'armor', slot:'ring', stats:{ attackBonus:5, strengthBonus:5, defenceBonus:5 }, sellPrice:1000, icon:'ring', desc:'A brilliant diamond ring.' },
    topaz_amulet:  { id:'topaz_amulet',  name:'Topaz Amulet',   type:'armor', slot:'amulet', stats:{ attackBonus:3 },  sellPrice:120,  icon:'amulet', desc:'An amulet set with topaz.' },
    sapphire_amulet:{ id:'sapphire_amulet',name:'Sapphire Amulet',type:'armor',slot:'amulet',stats:{ defenceBonus:5 }, sellPrice:250,  icon:'amulet', desc:'An amulet set with sapphire.' },
    ruby_amulet:   { id:'ruby_amulet',   name:'Ruby Amulet',    type:'armor', slot:'amulet', stats:{ strengthBonus:8 }, sellPrice:500,  icon:'amulet', desc:'An amulet set with ruby.' },

    // === UNIQUE / BOSS DROPS ===
    ancient_ring:  { id:'ancient_ring',  name:'Ancient Ring',   type:'armor', slot:'ring', stats:{ attackBonus:8, strengthBonus:8, defenceBonus:8, magicBonus:8, rangedBonus:8 }, sellPrice:5000, icon:'ring', desc:'An ancient ring humming with primordial power.' },
    ashfall_amulet:{ id:'ashfall_amulet',name:'Ashfall Amulet', type:'armor', slot:'amulet', stats:{ attackBonus:12, strengthBonus:10, damageReduction:5 }, sellPrice:15000, icon:'amulet', desc:'The legendary Ashfall Amulet, forged in the eruption that ended an age.' },
    void_cape:     { id:'void_cape',     name:'Void Cape',      type:'armor', slot:'cape', stats:{ defenceBonus:10, damageReduction:3, magicBonus:15 }, sellPrice:8000, icon:'cape', desc:'A cape woven from void energy.' },
  },

  // ── GATHERING ACTIONS ─────────────────────────────────────
  gatheringActions: {
    woodcutting: [
      { id:'chop_oak',     name:'Oak Tree',     level:1,  xp:10,  time:3.0, loot:[{item:'oak_log',qty:1}],    masteryId:'oak' },
      { id:'chop_willow',  name:'Willow Tree',  level:15, xp:25,  time:3.5, loot:[{item:'willow_log',qty:1}], masteryId:'willow' },
      { id:'chop_maple',   name:'Maple Tree',   level:30, xp:55,  time:4.0, loot:[{item:'maple_log',qty:1}],  masteryId:'maple' },
      { id:'chop_yew',     name:'Yew Tree',     level:45, xp:100, time:5.0, loot:[{item:'yew_log',qty:1}],    masteryId:'yew' },
      { id:'chop_elder',   name:'Elder Tree',   level:60, xp:180, time:6.0, loot:[{item:'elder_log',qty:1}],  masteryId:'elder' },
      { id:'chop_ashwood', name:'Ashwood Tree',  level:75, xp:300, time:7.0, loot:[{item:'ash_log',qty:1}],   masteryId:'ashwood' },
    ],
    mining: [
      { id:'mine_copper',  name:'Copper Rock',   level:1,  xp:8,   time:3.0, loot:[{item:'copper_ore',qty:1}],  masteryId:'copper', gemChance:0.01 },
      { id:'mine_tin',     name:'Tin Rock',      level:1,  xp:8,   time:3.0, loot:[{item:'tin_ore',qty:1}],     masteryId:'tin',    gemChance:0.01 },
      { id:'mine_iron',    name:'Iron Rock',     level:15, xp:22,  time:4.0, loot:[{item:'iron_ore',qty:1}],    masteryId:'iron',   gemChance:0.02 },
      { id:'mine_coal',    name:'Coal Rock',     level:25, xp:35,  time:4.5, loot:[{item:'coal_ore',qty:1}],    masteryId:'coal',   gemChance:0.02 },
      { id:'mine_mithril', name:'Mithril Rock',  level:40, xp:70,  time:5.5, loot:[{item:'mithril_ore',qty:1}], masteryId:'mithril',gemChance:0.03 },
      { id:'mine_adamant', name:'Adamant Rock',  level:55, xp:130, time:7.0, loot:[{item:'adamant_ore',qty:1}], masteryId:'adamant',gemChance:0.04 },
      { id:'mine_obsidian',name:'Obsidian Vein',  level:70, xp:220, time:8.0, loot:[{item:'obsidian_ore',qty:1}],masteryId:'obsidian',gemChance:0.05 },
      { id:'mine_essence', name:'Rune Essence',  level:1,  xp:5,   time:2.0, loot:[{item:'rune_essence',qty:1}],masteryId:'essence',gemChance:0 },
    ],
    fishing: [
      { id:'fish_shrimp',    name:'Shrimp Spot',     level:1,  xp:5,   time:3.0, loot:[{item:'raw_shrimp',qty:1}],    masteryId:'shrimp' },
      { id:'fish_trout',     name:'Trout Spot',      level:10, xp:15,  time:3.5, loot:[{item:'raw_trout',qty:1}],     masteryId:'trout' },
      { id:'fish_salmon',    name:'Salmon Spot',     level:25, xp:35,  time:4.0, loot:[{item:'raw_salmon',qty:1}],    masteryId:'salmon' },
      { id:'fish_lobster',   name:'Lobster Spot',    level:35, xp:65,  time:4.5, loot:[{item:'raw_lobster',qty:1}],   masteryId:'lobster' },
      { id:'fish_swordfish', name:'Swordfish Spot',  level:50, xp:120, time:5.5, loot:[{item:'raw_swordfish',qty:1}], masteryId:'swordfish' },
      { id:'fish_angler',    name:'Anglerfish Spot', level:65, xp:200, time:7.0, loot:[{item:'raw_anglerfish',qty:1}],masteryId:'angler' },
      { id:'fish_leviathan', name:'Leviathan Depths',level:80, xp:350, time:9.0, loot:[{item:'raw_leviathan',qty:1}], masteryId:'leviathan' },
    ],
    foraging: [
      { id:'forage_silver',  name:'Silverleaf Patch', level:1,  xp:8,   time:3.0, loot:[{item:'silverleaf',qty:1}],  masteryId:'silverleaf' },
      { id:'forage_blood',   name:'Bloodroot Thicket',level:20, xp:25,  time:4.0, loot:[{item:'bloodroot',qty:1}],   masteryId:'bloodroot' },
      { id:'forage_moon',    name:'Moonpetal Grove',  level:40, xp:60,  time:5.5, loot:[{item:'moonpetal',qty:1}],   masteryId:'moonpetal' },
      { id:'forage_void',    name:'Voidbloom Rift',   level:60, xp:130, time:7.0, loot:[{item:'voidbloom',qty:1}],   masteryId:'voidbloom' },
      { id:'forage_ash',     name:'Ashblossom Fields',level:75, xp:250, time:8.5, loot:[{item:'ashblossom',qty:1}],  masteryId:'ashblossom' },
    ],
  },

  // ── ARTISAN RECIPES ───────────────────────────────────────
  recipes: {
    cooking: [
      { id:'cook_shrimp',    name:'Cook Shrimp',     level:1,  xp:10,  time:2.0, input:[{item:'raw_shrimp',qty:1}],    output:{item:'shrimp',qty:1},       burnChance:0.30 },
      { id:'cook_trout',     name:'Cook Trout',      level:10, xp:25,  time:2.5, input:[{item:'raw_trout',qty:1}],     output:{item:'trout',qty:1},        burnChance:0.25 },
      { id:'cook_salmon',    name:'Cook Salmon',     level:25, xp:50,  time:3.0, input:[{item:'raw_salmon',qty:1}],    output:{item:'salmon',qty:1},       burnChance:0.20 },
      { id:'cook_lobster',   name:'Cook Lobster',    level:35, xp:80,  time:3.0, input:[{item:'raw_lobster',qty:1}],   output:{item:'lobster',qty:1},      burnChance:0.18 },
      { id:'cook_swordfish', name:'Cook Swordfish',  level:50, xp:140, time:3.5, input:[{item:'raw_swordfish',qty:1}], output:{item:'swordfish',qty:1},    burnChance:0.15 },
      { id:'cook_angler',    name:'Cook Anglerfish', level:65, xp:220, time:4.0, input:[{item:'raw_anglerfish',qty:1}],output:{item:'anglerfish',qty:1},   burnChance:0.12 },
      { id:'cook_leviathan', name:'Cook Leviathan',  level:80, xp:400, time:5.0, input:[{item:'raw_leviathan',qty:1}], output:{item:'leviathan_steak',qty:1},burnChance:0.10 },
    ],
    smithing: [
      { id:'smelt_bronze',   name:'Smelt Bronze Bar',  level:1,  xp:8,   time:3.0, input:[{item:'copper_ore',qty:1},{item:'tin_ore',qty:1}],       output:{item:'bronze_bar',qty:1} },
      { id:'smelt_iron',     name:'Smelt Iron Bar',    level:15, xp:20,  time:4.0, input:[{item:'iron_ore',qty:1}],                                output:{item:'iron_bar',qty:1} },
      { id:'smelt_steel',    name:'Smelt Steel Bar',   level:25, xp:40,  time:5.0, input:[{item:'iron_ore',qty:1},{item:'coal_ore',qty:2}],        output:{item:'steel_bar',qty:1} },
      { id:'smelt_mithril',  name:'Smelt Mithril Bar', level:40, xp:80,  time:6.0, input:[{item:'mithril_ore',qty:1},{item:'coal_ore',qty:4}],     output:{item:'mithril_bar',qty:1} },
      { id:'smelt_adamant',  name:'Smelt Adamant Bar', level:55, xp:150, time:7.0, input:[{item:'adamant_ore',qty:1},{item:'coal_ore',qty:6}],     output:{item:'adamant_bar',qty:1} },
      { id:'smelt_obsidian', name:'Smelt Obsidian Bar',level:70, xp:280, time:8.0, input:[{item:'obsidian_ore',qty:1},{item:'coal_ore',qty:8}],    output:{item:'obsidian_bar',qty:1} },
      { id:'smith_bronze_sword',name:'Bronze Sword',   level:1,  xp:15,  time:4.0, input:[{item:'bronze_bar',qty:2}],  output:{item:'bronze_sword',qty:1} },
      { id:'smith_iron_sword',  name:'Iron Sword',     level:15, xp:35,  time:5.0, input:[{item:'iron_bar',qty:2}],    output:{item:'iron_sword',qty:1} },
      { id:'smith_steel_sword', name:'Steel Sword',    level:25, xp:70,  time:5.0, input:[{item:'steel_bar',qty:2}],   output:{item:'steel_sword',qty:1} },
      { id:'smith_mithril_sword',name:'Mithril Sword', level:40, xp:140, time:6.0, input:[{item:'mithril_bar',qty:3}], output:{item:'mithril_sword',qty:1} },
      { id:'smith_adamant_sword',name:'Adamant Sword', level:55, xp:260, time:7.0, input:[{item:'adamant_bar',qty:3}], output:{item:'adamant_sword',qty:1} },
      { id:'smith_obsidian_sword',name:'Obsidian Blade',level:70,xp:500, time:9.0, input:[{item:'obsidian_bar',qty:4}],output:{item:'obsidian_sword',qty:1} },
      { id:'smith_bronze_shield',name:'Bronze Shield',  level:1,  xp:12,  time:3.5, input:[{item:'bronze_bar',qty:2}], output:{item:'bronze_shield',qty:1} },
      { id:'smith_iron_shield',  name:'Iron Shield',    level:15, xp:30,  time:4.5, input:[{item:'iron_bar',qty:2}],   output:{item:'iron_shield',qty:1} },
      { id:'smith_steel_shield', name:'Steel Shield',   level:25, xp:60,  time:5.0, input:[{item:'steel_bar',qty:3}],  output:{item:'steel_shield',qty:1} },
      { id:'smith_bronze_helm', name:'Bronze Helm',     level:1,  xp:10,  time:3.0, input:[{item:'bronze_bar',qty:1}], output:{item:'bronze_helm',qty:1} },
      { id:'smith_iron_helm',   name:'Iron Helm',       level:10, xp:22,  time:4.0, input:[{item:'iron_bar',qty:1}],   output:{item:'iron_helm',qty:1} },
      { id:'smith_steel_helm',  name:'Steel Helm',      level:20, xp:45,  time:4.5, input:[{item:'steel_bar',qty:2}],  output:{item:'steel_helm',qty:1} },
      { id:'smith_bronze_plate',name:'Bronze Platebody', level:5,  xp:25,  time:5.0, input:[{item:'bronze_bar',qty:3}], output:{item:'bronze_plate',qty:1} },
      { id:'smith_iron_plate',  name:'Iron Platebody',   level:15, xp:50,  time:6.0, input:[{item:'iron_bar',qty:3}],   output:{item:'iron_plate',qty:1} },
      { id:'smith_steel_plate', name:'Steel Platebody',  level:30, xp:100, time:7.0, input:[{item:'steel_bar',qty:5}],  output:{item:'steel_plate',qty:1} },
      { id:'smith_mithril_plate',name:'Mithril Platebody',level:45,xp:200,time:8.0, input:[{item:'mithril_bar',qty:5}], output:{item:'mithril_plate',qty:1} },
      { id:'smith_bronze_legs', name:'Bronze Platelegs', level:3,  xp:18,  time:4.0, input:[{item:'bronze_bar',qty:2}], output:{item:'bronze_legs',qty:1} },
      { id:'smith_iron_legs',   name:'Iron Platelegs',   level:12, xp:35,  time:5.0, input:[{item:'iron_bar',qty:2}],   output:{item:'iron_legs',qty:1} },
      { id:'smith_steel_legs',  name:'Steel Platelegs',  level:25, xp:70,  time:5.5, input:[{item:'steel_bar',qty:3}],  output:{item:'steel_legs',qty:1} },
    ],
    fletching: [
      { id:'fletch_bronze_arrows',name:'Bronze Arrows (15)', level:1,  xp:10,  time:2.0, input:[{item:'oak_log',qty:1},{item:'bronze_bar',qty:1}],  output:{item:'bronze_arrows',qty:15} },
      { id:'fletch_iron_arrows',  name:'Iron Arrows (15)',   level:15, xp:25,  time:2.5, input:[{item:'oak_log',qty:1},{item:'iron_bar',qty:1}],    output:{item:'iron_arrows',qty:15} },
      { id:'fletch_steel_arrows', name:'Steel Arrows (15)',  level:30, xp:50,  time:3.0, input:[{item:'willow_log',qty:1},{item:'steel_bar',qty:1}],output:{item:'steel_arrows',qty:15} },
      { id:'fletch_oak_shortbow', name:'Oak Shortbow',       level:5,  xp:15,  time:3.5, input:[{item:'oak_log',qty:2}],  output:{item:'oak_shortbow',qty:1} },
      { id:'fletch_willow_bow',   name:'Willow Shortbow',    level:20, xp:40,  time:4.0, input:[{item:'willow_log',qty:2}],output:{item:'willow_shortbow',qty:1} },
      { id:'fletch_maple_bow',    name:'Maple Shortbow',     level:35, xp:80,  time:4.5, input:[{item:'maple_log',qty:3}], output:{item:'maple_shortbow',qty:1} },
      { id:'fletch_yew_bow',      name:'Yew Longbow',        level:50, xp:150, time:5.0, input:[{item:'yew_log',qty:3}],   output:{item:'yew_longbow',qty:1} },
      { id:'fletch_elder_bow',    name:'Elder Bow',          level:65, xp:280, time:6.0, input:[{item:'elder_log',qty:4}],  output:{item:'elder_bow',qty:1} },
    ],
    crafting: [
      { id:'craft_leather',       name:'Tan Leather',        level:1,  xp:8,   time:2.0, input:[{item:'bones',qty:2}],      output:{item:'leather',qty:1} },
      { id:'craft_leather_boots', name:'Leather Boots',      level:5,  xp:15,  time:3.0, input:[{item:'leather',qty:2}],    output:{item:'leather_boots',qty:1} },
      { id:'craft_leather_gloves',name:'Leather Gloves',     level:8,  xp:18,  time:3.0, input:[{item:'leather',qty:2}],    output:{item:'leather_gloves',qty:1} },
      { id:'craft_topaz_ring',    name:'Topaz Ring',         level:15, xp:30,  time:3.5, input:[{item:'topaz',qty:1},{item:'bronze_bar',qty:1}],  output:{item:'topaz_ring',qty:1} },
      { id:'craft_sapphire_ring', name:'Sapphire Ring',      level:25, xp:60,  time:4.0, input:[{item:'sapphire',qty:1},{item:'iron_bar',qty:1}], output:{item:'sapphire_ring',qty:1} },
      { id:'craft_ruby_ring',     name:'Ruby Ring',          level:35, xp:100, time:4.0, input:[{item:'ruby',qty:1},{item:'steel_bar',qty:1}],    output:{item:'ruby_ring',qty:1} },
      { id:'craft_emerald_ring',  name:'Emerald Ring',       level:45, xp:150, time:4.5, input:[{item:'emerald',qty:1},{item:'mithril_bar',qty:1}],output:{item:'emerald_ring',qty:1} },
      { id:'craft_diamond_ring',  name:'Diamond Ring',       level:55, xp:250, time:5.0, input:[{item:'diamond',qty:1},{item:'adamant_bar',qty:1}],output:{item:'diamond_ring',qty:1} },
      { id:'craft_topaz_amulet',  name:'Topaz Amulet',       level:20, xp:40,  time:4.0, input:[{item:'topaz',qty:1},{item:'iron_bar',qty:1}],    output:{item:'topaz_amulet',qty:1} },
      { id:'craft_sapphire_amulet',name:'Sapphire Amulet',   level:30, xp:75,  time:4.5, input:[{item:'sapphire',qty:1},{item:'steel_bar',qty:1}],output:{item:'sapphire_amulet',qty:1} },
      { id:'craft_ruby_amulet',   name:'Ruby Amulet',        level:40, xp:120, time:5.0, input:[{item:'ruby',qty:1},{item:'mithril_bar',qty:1}],  output:{item:'ruby_amulet',qty:1} },
    ],
    alchemy: [
      { id:'brew_healing_i',  name:'Healing Potion I',  level:1,  xp:15,  time:3.0, input:[{item:'silverleaf',qty:3}],                     output:{item:'potion_healing_i',qty:1} },
      { id:'brew_healing_ii', name:'Healing Potion II', level:25, xp:50,  time:4.0, input:[{item:'bloodroot',qty:3}],                      output:{item:'potion_healing_ii',qty:1} },
      { id:'brew_healing_iii',name:'Healing Potion III',level:50, xp:120, time:5.0, input:[{item:'moonpetal',qty:3}],                      output:{item:'potion_healing_iii',qty:1} },
      { id:'brew_strength',   name:'Strength Potion',   level:15, xp:30,  time:3.5, input:[{item:'silverleaf',qty:2},{item:'bloodroot',qty:1}], output:{item:'potion_strength',qty:1} },
      { id:'brew_defence',    name:'Defence Potion',     level:20, xp:35,  time:3.5, input:[{item:'silverleaf',qty:1},{item:'bloodroot',qty:2}], output:{item:'potion_defence',qty:1} },
      { id:'brew_accuracy',   name:'Accuracy Potion',    level:35, xp:70,  time:4.0, input:[{item:'moonpetal',qty:2},{item:'bloodroot',qty:1}], output:{item:'potion_accuracy',qty:1} },
      { id:'brew_speed',      name:'Haste Potion',       level:55, xp:160, time:5.5, input:[{item:'voidbloom',qty:2},{item:'moonpetal',qty:1}], output:{item:'potion_speed',qty:1} },
    ],
  },

  // ── THIEVING TARGETS ──────────────────────────────────────
  thievingTargets: [
    { id:'pickpocket_farmer', name:'Farmer',      level:1,  xp:8,   time:2.5, stunChance:0.20, stunTime:3, gold:{min:1,max:5},   loot:[{item:'potato_seed',qty:1,chance:0.30},{item:'onion_seed',qty:1,chance:0.15}] },
    { id:'pickpocket_guard',  name:'Guard',       level:15, xp:22,  time:3.0, stunChance:0.25, stunTime:4, gold:{min:5,max:20},  loot:[{item:'iron_ore',qty:1,chance:0.10}] },
    { id:'pickpocket_merchant',name:'Merchant',   level:30, xp:50,  time:3.5, stunChance:0.30, stunTime:5, gold:{min:15,max:50}, loot:[{item:'herb_seed',qty:1,chance:0.20},{item:'sapphire',qty:1,chance:0.05}] },
    { id:'pickpocket_noble',  name:'Noble',       level:45, xp:90,  time:4.0, stunChance:0.35, stunTime:5, gold:{min:30,max:100},loot:[{item:'blood_seed',qty:1,chance:0.15},{item:'ruby',qty:1,chance:0.05}] },
    { id:'pickpocket_wizard', name:'Wizard',      level:60, xp:160, time:4.5, stunChance:0.40, stunTime:6, gold:{min:50,max:200},loot:[{item:'moon_seed',qty:1,chance:0.10},{item:'rune_essence',qty:5,chance:0.20},{item:'chaos_rune',qty:3,chance:0.10}] },
  ],

  // ── MONSTERS ──────────────────────────────────────────────
  monsters: {
    chicken:       { id:'chicken',       name:'Chicken',        hp:25,    maxHit:3,    attackSpeed:2.8, combatLevel:1,  style:'melee', evasion:{melee:5,ranged:5,magic:5},       xp:5,   gold:{min:0,max:2},   drops:[{item:'feather',qty:1,chance:0.50},{item:'bones',qty:1,chance:1.0}] },
    rat:           { id:'rat',           name:'Giant Rat',      hp:40,    maxHit:5,    attackSpeed:2.6, combatLevel:3,  style:'melee', evasion:{melee:8,ranged:8,magic:5},       xp:8,   gold:{min:1,max:5},   drops:[{item:'bones',qty:1,chance:1.0},{item:'leather',qty:1,chance:0.30}] },
    goblin:        { id:'goblin',        name:'Goblin',         hp:60,    maxHit:8,    attackSpeed:2.6, combatLevel:5,  style:'melee', evasion:{melee:12,ranged:10,magic:8},     xp:12,  gold:{min:3,max:12},  drops:[{item:'bones',qty:1,chance:1.0},{item:'bronze_sword',qty:1,chance:0.05},{item:'bronze_shield',qty:1,chance:0.05}] },
    skeleton:      { id:'skeleton',      name:'Skeleton',       hp:100,   maxHit:12,   attackSpeed:2.4, combatLevel:10, style:'melee', evasion:{melee:18,ranged:15,magic:10},    xp:18,  gold:{min:5,max:20},  drops:[{item:'bones',qty:2,chance:1.0},{item:'iron_sword',qty:1,chance:0.05}] },
    bandit:        { id:'bandit',        name:'Bandit',         hp:150,   maxHit:18,   attackSpeed:2.4, combatLevel:15, style:'melee', evasion:{melee:25,ranged:20,magic:15},    xp:25,  gold:{min:10,max:40}, drops:[{item:'bones',qty:1,chance:1.0},{item:'iron_plate',qty:1,chance:0.03},{item:'iron_helm',qty:1,chance:0.05}] },
    wolf:          { id:'wolf',          name:'Dire Wolf',      hp:200,   maxHit:22,   attackSpeed:2.2, combatLevel:20, style:'melee', evasion:{melee:30,ranged:25,magic:15},    xp:32,  gold:{min:8,max:30},  drops:[{item:'bones',qty:1,chance:1.0},{item:'leather',qty:2,chance:0.40}] },
    troll:         { id:'troll',         name:'Troll',          hp:350,   maxHit:30,   attackSpeed:3.0, combatLevel:28, style:'melee', evasion:{melee:35,ranged:30,magic:20},    xp:45,  gold:{min:15,max:60}, drops:[{item:'big_bones',qty:1,chance:1.0},{item:'steel_plate',qty:1,chance:0.03}] },
    dark_mage:     { id:'dark_mage',     name:'Dark Mage',      hp:280,   maxHit:35,   attackSpeed:2.6, combatLevel:32, style:'magic', evasion:{melee:15,ranged:20,magic:45},    xp:55,  gold:{min:20,max:80}, drops:[{item:'bones',qty:1,chance:1.0},{item:'chaos_rune',qty:5,chance:0.20},{item:'mystic_staff',qty:1,chance:0.02}] },
    shadow_archer: { id:'shadow_archer', name:'Shadow Archer',  hp:320,   maxHit:32,   attackSpeed:2.2, combatLevel:35, style:'ranged',evasion:{melee:20,ranged:40,magic:25},    xp:60,  gold:{min:20,max:70}, drops:[{item:'bones',qty:1,chance:1.0},{item:'steel_arrows',qty:10,chance:0.30},{item:'maple_shortbow',qty:1,chance:0.03}] },
    ogre:          { id:'ogre',          name:'Ogre',           hp:500,   maxHit:40,   attackSpeed:3.2, combatLevel:40, style:'melee', evasion:{melee:40,ranged:35,magic:25},    xp:75,  gold:{min:25,max:100},drops:[{item:'big_bones',qty:1,chance:1.0},{item:'mithril_ore',qty:2,chance:0.10}] },
    wyvern:        { id:'wyvern',        name:'Wyvern',         hp:700,   maxHit:55,   attackSpeed:2.4, combatLevel:50, style:'ranged',evasion:{melee:50,ranged:55,magic:35},    xp:100, gold:{min:40,max:150},drops:[{item:'big_bones',qty:2,chance:1.0},{item:'adamant_ore',qty:2,chance:0.08},{item:'yew_longbow',qty:1,chance:0.02}] },
    demon:         { id:'demon',         name:'Demon',          hp:900,   maxHit:70,   attackSpeed:2.6, combatLevel:60, style:'magic', evasion:{melee:35,ranged:40,magic:65},    xp:140, gold:{min:60,max:200},drops:[{item:'big_bones',qty:2,chance:1.0},{item:'death_rune',qty:5,chance:0.15},{item:'void_staff',qty:1,chance:0.01}] },
    dragon:        { id:'dragon',        name:'Dragon',         hp:1500,  maxHit:90,   attackSpeed:2.8, combatLevel:75, style:'melee', evasion:{melee:70,ranged:65,magic:50},    xp:200, gold:{min:100,max:400},drops:[{item:'dragon_bones',qty:1,chance:1.0},{item:'obsidian_ore',qty:3,chance:0.10},{item:'dragon_scimitar',qty:1,chance:0.01}] },
    void_walker:   { id:'void_walker',   name:'Void Walker',    hp:2000,  maxHit:110,  attackSpeed:2.2, combatLevel:85, style:'magic', evasion:{melee:60,ranged:55,magic:80},    xp:280, gold:{min:150,max:500},drops:[{item:'dragon_bones',qty:2,chance:1.0},{item:'death_rune',qty:10,chance:0.20},{item:'elder_staff',qty:1,chance:0.005}] },
    ashfall_titan: { id:'ashfall_titan', name:'Ashfall Titan',  hp:5000,  maxHit:150,  attackSpeed:3.0, combatLevel:99, style:'melee', evasion:{melee:90,ranged:85,magic:70},    xp:500, gold:{min:500,max:2000},drops:[{item:'dragon_bones',qty:5,chance:1.0},{item:'ashfire_blade',qty:1,chance:0.005},{item:'ashfall_amulet',qty:1,chance:0.002},{item:'obsidian_bar',qty:5,chance:0.15}] },
  },

  // ── COMBAT AREAS ──────────────────────────────────────────
  combatAreas: [
    { id:'farm',          name:'Farmlands',       monsters:['chicken','rat'],                   levelReq:1,  desc:'Peaceful farmlands with weak creatures.' },
    { id:'forest',        name:'Darkwood Forest', monsters:['goblin','skeleton','wolf'],        levelReq:5,  desc:'A dense forest teeming with danger.' },
    { id:'bandit_camp',   name:'Bandit Camp',     monsters:['bandit','shadow_archer'],          levelReq:15, desc:'A fortified camp of outlaws.' },
    { id:'mountain',      name:'Ironpeak Mountain',monsters:['troll','ogre'],                   levelReq:25, desc:'Treacherous mountain paths.' },
    { id:'dark_tower',    name:'Dark Tower',      monsters:['dark_mage','demon'],               levelReq:35, desc:'A tower of dark sorcery.' },
    { id:'dragons_lair',  name:'Dragon\'s Lair',  monsters:['wyvern','dragon'],                 levelReq:50, desc:'The volcanic lair of dragonkind.' },
    { id:'void_rift',     name:'The Void Rift',   monsters:['void_walker'],                     levelReq:70, desc:'A tear in reality leaking void energy.' },
    { id:'ashfall_crater',name:'Ashfall Crater',  monsters:['ashfall_titan'],                   levelReq:85, desc:'The epicenter of the great cataclysm.' },
  ],

  // ── DUNGEONS ──────────────────────────────────────────────
  dungeons: [
    { id:'goblin_den',     name:'Goblin Den',          waves:['goblin','goblin','goblin','goblin','goblin'], bossId:'goblin',  levelReq:5,  rewards:[{item:'iron_sword',qty:1,chance:0.20},{item:'iron_shield',qty:1,chance:0.15}], desc:'A smelly cave full of goblins.' },
    { id:'bandit_fortress',name:'Bandit Fortress',     waves:['bandit','bandit','shadow_archer','bandit','shadow_archer','bandit'], bossId:'bandit', levelReq:20, rewards:[{item:'steel_sword',qty:1,chance:0.15},{item:'steel_plate',qty:1,chance:0.10}], desc:'The heavily defended bandit stronghold.' },
    { id:'troll_cave',     name:'Troll Stronghold',    waves:['troll','troll','ogre','troll','ogre'],        bossId:'ogre',    levelReq:30, rewards:[{item:'mithril_sword',qty:1,chance:0.10},{item:'mithril_plate',qty:1,chance:0.08}], desc:'A cave system ruled by a massive ogre.' },
    { id:'dark_sanctum',   name:'Dark Sanctum',        waves:['dark_mage','dark_mage','demon','dark_mage','demon','demon'], bossId:'demon', levelReq:45, rewards:[{item:'void_staff',qty:1,chance:0.08},{item:'death_rune',qty:20,chance:0.30},{item:'void_cape',qty:1,chance:0.03}], desc:'A sanctum of forbidden dark magic.' },
    { id:'dragon_peak',    name:'Dragon Peak',         waves:['wyvern','wyvern','dragon','wyvern','dragon','dragon'], bossId:'dragon', levelReq:60, rewards:[{item:'obsidian_sword',qty:1,chance:0.08},{item:'obsidian_plate',qty:1,chance:0.05},{item:'dragon_scimitar',qty:1,chance:0.05}], desc:'The summit where elder dragons roost.' },
    { id:'void_abyss',     name:'The Void Abyss',      waves:['void_walker','void_walker','void_walker','demon','void_walker','void_walker'], bossId:'void_walker', levelReq:75, rewards:[{item:'elder_staff',qty:1,chance:0.05},{item:'ancient_ring',qty:1,chance:0.02}], desc:'The deepest void rift, teeming with horrors.' },
    { id:'ashfall_sanctum', name:'Ashfall Sanctum',     waves:['dragon','void_walker','ashfall_titan'], bossId:'ashfall_titan', levelReq:90, rewards:[{item:'ashfire_blade',qty:1,chance:0.03},{item:'ashfall_amulet',qty:1,chance:0.01}], desc:'The final challenge. Face the Ashfall Titan.' },
  ],

  // ── SHOP ITEMS ────────────────────────────────────────────
  shop: [
    { item:'raw_shrimp',    price:5,    category:'food' },
    { item:'raw_trout',     price:15,   category:'food' },
    { item:'raw_salmon',    price:35,   category:'food' },
    { item:'raw_lobster',   price:80,   category:'food' },
    { item:'feather',       price:3,    category:'materials' },
    { item:'rune_essence',  price:5,    category:'materials' },
    { item:'fire_rune',     price:12,   category:'runes' },
    { item:'water_rune',    price:12,   category:'runes' },
    { item:'earth_rune',    price:12,   category:'runes' },
    { item:'air_rune',      price:12,   category:'runes' },
    { item:'chaos_rune',    price:60,   category:'runes' },
    { item:'death_rune',    price:150,  category:'runes' },
    { item:'potato_seed',   price:5,    category:'seeds' },
    { item:'onion_seed',    price:10,   category:'seeds' },
    { item:'herb_seed',     price:25,   category:'seeds' },
    { item:'blood_seed',    price:60,   category:'seeds' },
    { item:'enchant_scroll',price:500,  category:'special' },
    { item:'bronze_sword',  price:30,   category:'equipment' },
    { item:'bronze_shield', price:25,   category:'equipment' },
    { item:'bronze_helm',   price:20,   category:'equipment' },
    { item:'bronze_plate',  price:50,   category:'equipment' },
    { item:'bronze_legs',   price:35,   category:'equipment' },
  ],

  // ── ACHIEVEMENTS ──────────────────────────────────────────
  achievements: [
    { id:'first_tree',      name:'Lumberjack',          desc:'Chop your first tree.',              check: (g) => g.stats.totalActions.woodcutting >= 1 },
    { id:'first_ore',       name:'Prospector',          desc:'Mine your first ore.',               check: (g) => g.stats.totalActions.mining >= 1 },
    { id:'first_fish',      name:'Angler',              desc:'Catch your first fish.',             check: (g) => g.stats.totalActions.fishing >= 1 },
    { id:'first_kill',      name:'Warrior',             desc:'Defeat your first monster.',         check: (g) => g.stats.monstersKilled >= 1 },
    { id:'first_dungeon',   name:'Dungeon Crawler',     desc:'Complete your first dungeon.',       check: (g) => g.stats.dungeonsCompleted >= 1 },
    { id:'level_10',        name:'Apprentice',          desc:'Reach level 10 in any skill.',       check: (g) => Object.values(g.skills).some(s => s.level >= 10) },
    { id:'level_25',        name:'Journeyman',          desc:'Reach level 25 in any skill.',       check: (g) => Object.values(g.skills).some(s => s.level >= 25) },
    { id:'level_50',        name:'Expert',              desc:'Reach level 50 in any skill.',       check: (g) => Object.values(g.skills).some(s => s.level >= 50) },
    { id:'level_99',        name:'Master',              desc:'Reach level 99 in any skill.',       check: (g) => Object.values(g.skills).some(s => s.level >= 99) },
    { id:'gold_1000',       name:'Coin Purse',          desc:'Accumulate 1,000 gold.',             check: (g) => g.gold >= 1000 },
    { id:'gold_100000',     name:'Wealthy',             desc:'Accumulate 100,000 gold.',           check: (g) => g.gold >= 100000 },
    { id:'gold_1000000',    name:'Millionaire',         desc:'Accumulate 1,000,000 gold.',         check: (g) => g.gold >= 1000000 },
    { id:'kill_100',        name:'Slayer',              desc:'Defeat 100 monsters.',               check: (g) => g.stats.monstersKilled >= 100 },
    { id:'kill_1000',       name:'Annihilator',         desc:'Defeat 1,000 monsters.',             check: (g) => g.stats.monstersKilled >= 1000 },
    { id:'slay_dragon',     name:'Dragonslayer',        desc:'Defeat a Dragon.',                   check: (g) => g.stats.uniqueKills && g.stats.uniqueKills.dragon },
    { id:'slay_titan',      name:'Titanfall',           desc:'Defeat the Ashfall Titan.',          check: (g) => g.stats.uniqueKills && g.stats.uniqueKills.ashfall_titan },
    { id:'all_skills_10',   name:'Well-Rounded',        desc:'Get all skills to level 10.',        check: (g) => Object.values(g.skills).every(s => s.level >= 10) },
    { id:'total_level_500', name:'Dedicated',           desc:'Reach a total level of 500.',        check: (g) => Object.values(g.skills).reduce((a,s) => a + s.level, 0) >= 500 },
  ],

  // ── SPELLS ────────────────────────────────────────────────
  spells: [
    { id:'wind_strike',   name:'Wind Strike',   level:1,  maxHit:12,  runes:[{item:'air_rune',qty:1}],                          desc:'A basic air attack.' },
    { id:'water_strike',  name:'Water Strike',  level:5,  maxHit:18,  runes:[{item:'water_rune',qty:1},{item:'air_rune',qty:1}], desc:'A bolt of water magic.' },
    { id:'earth_strike',  name:'Earth Strike',  level:10, maxHit:25,  runes:[{item:'earth_rune',qty:1},{item:'air_rune',qty:1}], desc:'Hurl a chunk of earth.' },
    { id:'fire_strike',   name:'Fire Strike',   level:15, maxHit:35,  runes:[{item:'fire_rune',qty:2}],                          desc:'Launch a fireball.' },
    { id:'wind_bolt',     name:'Wind Bolt',     level:25, maxHit:50,  runes:[{item:'air_rune',qty:2},{item:'chaos_rune',qty:1}],  desc:'A powerful gust of wind.' },
    { id:'fire_bolt',     name:'Fire Bolt',     level:35, maxHit:70,  runes:[{item:'fire_rune',qty:3},{item:'chaos_rune',qty:1}], desc:'An intense fire bolt.' },
    { id:'fire_blast',    name:'Fire Blast',    level:50, maxHit:100, runes:[{item:'fire_rune',qty:5},{item:'death_rune',qty:1}], desc:'A devastating fire blast.' },
    { id:'void_surge',    name:'Void Surge',    level:70, maxHit:150, runes:[{item:'death_rune',qty:3},{item:'chaos_rune',qty:3}],desc:'Channel the void to obliterate foes.' },
  ],

  // ── EQUIPMENT SLOTS ───────────────────────────────────────
  equipmentSlots: ['weapon','shield','head','body','legs','boots','gloves','ring','amulet','cape','ammo'],
};

// Export for use
if (typeof module !== 'undefined') module.exports = GAME_DATA;
