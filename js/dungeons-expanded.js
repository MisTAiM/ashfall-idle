// ================================================================
// ASHFALL IDLE — Dungeons Expanded + Party System
// 5 new dungeons, 20+ monsters (all with SVG art), new items,
// and Firebase-backed party system for multiplayer raids.
// ================================================================

// ── ITEM HELPER ─────────────────────────────────────────────────
function _itemDE(id, def) {
  if (!GAME_DATA.items[id]) GAME_DATA.items[id] = { id, ...def };
}

// ================================================================
// NEW MONSTERS — All with complete stats and SVG art
// ================================================================

// ── CATACOMBS OF DECAY (Undead Theme) ───────────────────────────
GAME_DATA.monsters.bone_crawler = {
  id:'bone_crawler', name:'Bone Crawler', hp:350, maxHit:22, attackSpeed:2.2,
  combatLevel:55, style:'melee',
  evasion:{melee:25,ranged:20,magic:15}, xp:90, gold:{min:5,max:30},
  alignment:'CE',
  drops:[{item:'bones',qty:2,chance:1.0},{item:'death_rune',qty:3,chance:0.15}],
  desc:'A mass of animated bones skittering across the crypt floor.',
};
GAME_DATA.monsters.tomb_wraith = {
  id:'tomb_wraith', name:'Tomb Wraith', hp:550, maxHit:34, attackSpeed:2.0,
  combatLevel:72, style:'magic',
  evasion:{melee:30,ranged:35,magic:50}, xp:150, gold:{min:10,max:60},
  alignment:'CE',
  drops:[{item:'big_bones',qty:2,chance:1.0},{item:'soul_rune',qty:5,chance:0.12},{item:'mystic_top',qty:1,chance:0.02}],
  desc:'A spectral guardian bound to the tomb. Magic attacks drain prayer.',
  prayerDrain:3,
};
GAME_DATA.monsters.lich_apprentice = {
  id:'lich_apprentice', name:'Lich Apprentice', hp:800, maxHit:42, attackSpeed:2.4,
  combatLevel:95, style:'magic',
  evasion:{melee:40,ranged:45,magic:65}, xp:250, gold:{min:20,max:100},
  alignment:'CE',
  drops:[{item:'dragon_bones',qty:1,chance:0.50},{item:'death_rune',qty:8,chance:0.25},{item:'blood_rune',qty:5,chance:0.20}],
  desc:'An aspiring lich still learning the dark arts. Powerful magic attacks.',
};
GAME_DATA.monsters.crypt_guardian = {
  id:'crypt_guardian', name:'Crypt Guardian', hp:1200, maxHit:55, attackSpeed:2.8,
  combatLevel:120, style:'melee',
  evasion:{melee:65,ranged:55,magic:40}, xp:400, gold:{min:40,max:180},
  alignment:'CE',
  drops:[{item:'dragon_bones',qty:2,chance:1.0},{item:'adamant_bar',qty:3,chance:0.15},{item:'crypt_plate',qty:1,chance:0.03}],
  desc:'An armored undead sentinel. Extremely tough. Guards the deepest tombs.',
};

// ── SERPENT'S LAIR (Poison/Snake Theme) ─────────────────────────
GAME_DATA.monsters.venom_snake = {
  id:'venom_snake', name:'Venom Snake', hp:400, maxHit:28, attackSpeed:1.8,
  combatLevel:60, style:'melee',
  evasion:{melee:35,ranged:30,magic:20}, xp:110, gold:{min:5,max:25},
  alignment:'CE',
  drops:[{item:'snake_hide',qty:1,chance:0.40},{item:'antipoison',qty:1,chance:0.20}],
  desc:'A fast-striking venomous serpent. Applies poison on hit.',
  poisonDmg:3,
};
GAME_DATA.monsters.basilisk_hatch = {
  id:'basilisk_hatch', name:'Basilisk Hatchling', hp:600, maxHit:32, attackSpeed:2.4,
  combatLevel:75, style:'ranged',
  evasion:{melee:40,ranged:50,magic:30}, xp:170, gold:{min:15,max:60},
  alignment:'CE',
  drops:[{item:'snake_hide',qty:2,chance:0.30},{item:'ruby',qty:1,chance:0.10}],
  desc:'A young basilisk with a petrifying gaze. Ranged attacks.',
};
GAME_DATA.monsters.serpent_guard = {
  id:'serpent_guard', name:'Serpent Guard', hp:900, maxHit:45, attackSpeed:2.6,
  combatLevel:100, style:'melee',
  evasion:{melee:55,ranged:50,magic:35}, xp:280, gold:{min:25,max:120},
  alignment:'CN',
  drops:[{item:'snake_hide',qty:3,chance:0.50},{item:'serpent_fang',qty:1,chance:0.08}],
  desc:'A humanoid serpent warrior wielding a poisoned spear.',
  poisonDmg:5,
};
GAME_DATA.monsters.naga_priestess = {
  id:'naga_priestess', name:'Naga Priestess', hp:1500, maxHit:58, attackSpeed:2.2,
  combatLevel:140, style:'magic',
  evasion:{melee:50,ranged:55,magic:75}, xp:500, gold:{min:50,max:250},
  alignment:'CE',
  drops:[{item:'dragon_bones',qty:2,chance:0.60},{item:'blood_rune',qty:10,chance:0.25},{item:'serpentine_helm',qty:1,chance:0.02}],
  desc:'The high priestess of the serpent cult. Devastating magic and healing.',
  healsAllies:true, healAmount:80, healInterval:5,
};

// ── THE INFERNAL PIT (Demon Theme) ──────────────────────────────
GAME_DATA.monsters.lesser_demon = {
  id:'lesser_demon', name:'Lesser Demon', hp:500, maxHit:30, attackSpeed:2.4,
  combatLevel:65, style:'melee',
  evasion:{melee:30,ranged:25,magic:30}, xp:130, gold:{min:10,max:50},
  alignment:'CE',
  drops:[{item:'big_bones',qty:1,chance:1.0},{item:'fire_rune',qty:10,chance:0.20}],
  desc:'A minor demon from the infernal planes. Weak but numerous.',
};
GAME_DATA.monsters.hellhound = {
  id:'hellhound', name:'Hellhound', hp:700, maxHit:38, attackSpeed:2.0,
  combatLevel:85, style:'melee',
  evasion:{melee:45,ranged:40,magic:30}, xp:200, gold:{min:0,max:0},
  alignment:'CE',
  drops:[{item:'big_bones',qty:1,chance:1.0},{item:'hard_clue',qty:1,chance:0.02}],
  desc:'A ferocious demonic hound with burning fur. Fast and relentless.',
};
GAME_DATA.monsters.imp_overlord = {
  id:'imp_overlord', name:'Imp Overlord', hp:1000, maxHit:48, attackSpeed:2.2,
  combatLevel:110, style:'magic',
  evasion:{melee:45,ranged:50,magic:60}, xp:350, gold:{min:30,max:150},
  alignment:'CE',
  drops:[{item:'dragon_bones',qty:1,chance:0.40},{item:'death_rune',qty:12,chance:0.20},{item:'infernal_axe',qty:1,chance:0.01}],
  desc:'A powerful imp that has risen to command legions. Fire magic specialist.',
};
GAME_DATA.monsters.abyssal_demon = {
  id:'abyssal_demon', name:'Abyssal Demon', hp:1600, maxHit:60, attackSpeed:2.4,
  combatLevel:150, style:'melee',
  evasion:{melee:70,ranged:65,magic:50}, xp:550, gold:{min:50,max:200},
  alignment:'CE',
  drops:[{item:'dragon_bones',qty:2,chance:0.80},{item:'abyssal_whip',qty:1,chance:0.005},{item:'infernal_ash',qty:3,chance:0.30}],
  desc:'A terrifying demon from the Abyss. Teleports unpredictably. Slayer favourite.',
};
GAME_DATA.monsters.infernal_drake = {
  id:'infernal_drake', name:'Infernal Drake', hp:2200, maxHit:72, attackSpeed:2.8,
  combatLevel:180, style:'melee',
  evasion:{melee:75,ranged:70,magic:55}, xp:700, gold:{min:80,max:350},
  alignment:'CE',
  drops:[{item:'dragon_bones',qty:3,chance:1.0},{item:'dragon_heart',qty:1,chance:0.05},{item:'infernal_claw',qty:1,chance:0.02}],
  desc:'A lesser dragon corrupted by infernal fire. Breathes hellfire.',
};

// ── VOID RIFT (Void Theme) ──────────────────────────────────────
GAME_DATA.monsters.void_leech = {
  id:'void_leech', name:'Void Leech', hp:600, maxHit:25, attackSpeed:1.8,
  combatLevel:80, style:'magic',
  evasion:{melee:40,ranged:45,magic:55}, xp:180, gold:{min:0,max:0},
  alignment:'CE',
  drops:[{item:'void_shard',qty:1,chance:0.15},{item:'soul_rune',qty:4,chance:0.20}],
  desc:'A parasitic void creature that drains life force. Heals from damage dealt.',
  prayerDrain:5,
};
GAME_DATA.monsters.reality_bender = {
  id:'reality_bender', name:'Reality Bender', hp:1200, maxHit:50, attackSpeed:2.4,
  combatLevel:130, style:'magic',
  evasion:{melee:50,ranged:55,magic:80}, xp:420, gold:{min:30,max:150},
  alignment:'CE',
  drops:[{item:'void_crystal',qty:1,chance:0.12},{item:'death_rune',qty:15,chance:0.20},{item:'astral_rune',qty:8,chance:0.15}],
  desc:'A creature that warps reality itself. Attack style changes unpredictably.',
};
GAME_DATA.monsters.null_walker = {
  id:'null_walker', name:'Null Walker', hp:1800, maxHit:62, attackSpeed:2.6,
  combatLevel:160, style:'melee',
  evasion:{melee:65,ranged:60,magic:70}, xp:600, gold:{min:60,max:300},
  alignment:'CE',
  drops:[{item:'void_crystal',qty:2,chance:0.10},{item:'blood_rune',qty:12,chance:0.25},{item:'null_blade',qty:1,chance:0.01}],
  desc:'A being from the space between realities. Its strikes erase matter.',
};
GAME_DATA.monsters.void_titan = {
  id:'void_titan', name:'Void Titan', hp:3000, maxHit:80, attackSpeed:3.0,
  combatLevel:200, style:'melee',
  evasion:{melee:85,ranged:80,magic:65}, xp:1000, gold:{min:100,max:500},
  alignment:'CE',
  drops:[{item:'void_crystal',qty:3,chance:0.20},{item:'void_shard',qty:2,chance:0.30},{item:'void_warden_helm',qty:1,chance:0.008}],
  desc:'An immense construct of void energy. Nearly indestructible.',
};

// ── ASCENDANT SPIRE (Elite/Mixed Theme) ─────────────────────────
GAME_DATA.monsters.ascendant_knight = {
  id:'ascendant_knight', name:'Ascendant Knight', hp:2000, maxHit:65, attackSpeed:2.4,
  combatLevel:175, style:'melee',
  evasion:{melee:80,ranged:75,magic:55}, xp:650, gold:{min:80,max:400},
  alignment:'LN',
  drops:[{item:'dragon_bones',qty:2,chance:0.80},{item:'runite_bar',qty:4,chance:0.20},{item:'ascendant_plate',qty:1,chance:0.008}],
  desc:'A holy warrior ascended beyond mortality. Impervious to most attacks.',
};
GAME_DATA.monsters.ascendant_mage = {
  id:'ascendant_mage', name:'Ascendant Mage', hp:1600, maxHit:75, attackSpeed:2.0,
  combatLevel:190, style:'magic',
  evasion:{melee:55,ranged:60,magic:90}, xp:750, gold:{min:100,max:500},
  alignment:'LN',
  drops:[{item:'dragon_bones',qty:2,chance:0.80},{item:'soul_rune',qty:10,chance:0.25},{item:'ascendant_staff',qty:1,chance:0.005}],
  desc:'A mage who has transcended death. Casts devastating spells.',
};
GAME_DATA.monsters.ascendant_archer = {
  id:'ascendant_archer', name:'Ascendant Archer', hp:1400, maxHit:70, attackSpeed:1.8,
  combatLevel:185, style:'ranged',
  evasion:{melee:60,ranged:85,magic:55}, xp:700, gold:{min:90,max:450},
  alignment:'LN',
  drops:[{item:'dragon_bones',qty:2,chance:0.80},{item:'arrowheads_rune',qty:50,chance:0.15},{item:'ascendant_bow',qty:1,chance:0.005}],
  desc:'An ascended marksman. Each arrow strikes with divine force.',
};
GAME_DATA.monsters.ascendant_lord = {
  id:'ascendant_lord', name:'Ascendant Lord', hp:5000, maxHit:95, attackSpeed:2.6,
  combatLevel:250, style:'melee',
  evasion:{melee:90,ranged:85,magic:80}, xp:2000, gold:{min:200,max:1000},
  alignment:'LN',
  drops:[{item:'dragon_bones',qty:5,chance:1.0},{item:'celestial_fragment',qty:3,chance:0.20},{item:'ascendant_crown',qty:1,chance:0.003}],
  desc:'The lord of the Spire. A being of pure celestial power. The ultimate challenge.',
};

// ── NEW DUNGEON-SPECIFIC ITEMS ──────────────────────────────────
_itemDE('snake_hide', { name:'Snake Hide', type:'resource', rarity:'common', sellPrice:20, desc:'Tough serpent skin. Used in crafting.' });
_itemDE('serpent_fang', { name:'Serpent Fang', type:'resource', rarity:'rare', sellPrice:500, desc:'A venomous fang. Crafting component for poisoned weapons.' });
_itemDE('antipoison', { name:'Antipoison', type:'potion', heals:0, clearPoison:true, sellPrice:50, desc:'Cures poison.' });
_itemDE('hard_clue', { name:'Hard Clue Scroll', type:'quest', rarity:'uncommon', sellPrice:0, desc:'A challenging clue scroll. Contains valuable rewards.' });
_itemDE('infernal_ash', { name:'Infernal Ash', type:'resource', rarity:'uncommon', sellPrice:80, desc:'Ash from a demon. Used in prayer training.' });
_itemDE('infernal_claw', { name:'Infernal Claw', type:'resource', rarity:'rare', sellPrice:2000, desc:'A razor-sharp claw from an Infernal Drake.' });
_itemDE('null_blade', {
  name:'Null Blade', type:'weapon', slot:'weapon', style:'melee',
  attackSpeed:2.0, stats:{attackBonus:118, strengthBonus:128}, levelReq:{attack:78},
  rarity:'legendary', sellPrice:35000,
  specCost:50, specEffect:{type:'null_strike', mult:1.50, ignoreDefPct:50},
  desc:'A blade forged from void energy. Spec: 150% damage, ignores 50% defence.',
});
_itemDE('void_warden_helm', {
  name:'Void Warden Helm', type:'armor', slot:'head', rarity:'legendary', sellPrice:0,
  stats:{defenceBonus:85, strengthBonus:12, magicBonus:12, rangedBonus:12, damageReduction:2},
  levelReq:{defence:78},
  desc:'A helm infused with void warden power. Hybrid stats. Unsellable.',
});
_itemDE('crypt_plate', {
  name:'Crypt Platebody', type:'armor', slot:'body', rarity:'rare', sellPrice:8000,
  stats:{defenceBonus:95, strengthBonus:14, damageReduction:2},
  levelReq:{defence:55},
  desc:'Armor salvaged from the Crypt Guardian. Strong mid-tier plate.',
});
_itemDE('serpentine_helm', {
  name:'Serpentine Helm', type:'armor', slot:'head', rarity:'legendary', sellPrice:0,
  stats:{defenceBonus:70, strengthBonus:5, damageReduction:2},
  levelReq:{defence:75},
  passiveEffect:{ type:'venom_immunity', desc:'Immune to poison and venom while worn.' },
  desc:'A helm carved from serpent scales. Grants poison immunity. Unsellable.',
});
_itemDE('abyssal_whip', {
  name:'Abyssal Whip', type:'weapon', slot:'weapon', style:'melee',
  attackSpeed:1.8, stats:{attackBonus:82, strengthBonus:82}, levelReq:{attack:70},
  rarity:'legendary', sellPrice:50000,
  specCost:50, specEffect:{type:'whip_crack', mult:1.20, energyDrain:10},
  desc:'An iconic whip from the Abyss. Fast attacks. Spec: 120% + drain run energy.',
});
_itemDE('infernal_axe', {
  name:'Infernal Axe', type:'weapon', slot:'weapon', style:'melee',
  attackSpeed:2.4, stats:{attackBonus:90, strengthBonus:105}, levelReq:{attack:60, strength:60},
  rarity:'rare', sellPrice:15000,
  desc:'A demonic axe. Good mid-tier weapon with high strength bonus.',
});
_itemDE('ascendant_plate', {
  name:'Ascendant Platebody', type:'armor', slot:'body', rarity:'mythic', sellPrice:0,
  stats:{defenceBonus:200, strengthBonus:22, damageReduction:5},
  levelReq:{defence:82},
  desc:'Armor of the Ascendant Knights. Near-endgame defensive body. Unsellable.',
});
_itemDE('ascendant_staff', {
  name:'Ascendant Staff', type:'weapon', slot:'weapon', style:'magic',
  attackSpeed:2.2, stats:{magicBonus:135, attackBonus:25}, levelReq:{magic:82},
  rarity:'mythic', sellPrice:0, providesAllRunes:true,
  desc:'Staff wielded by Ascendant Mages. Unlimited all runes. Unsellable.',
});
_itemDE('ascendant_bow', {
  name:'Ascendant Bow', type:'weapon', slot:'weapon', style:'ranged',
  attackSpeed:2.0, stats:{rangedBonus:130, attackBonus:15}, levelReq:{ranged:82},
  rarity:'mythic', sellPrice:0,
  specCost:40, specEffect:{type:'holy_arrow', mult:1.60, hits:2},
  desc:'A divine bow. Spec: 2 hits at 160%. Unsellable.',
});
_itemDE('ascendant_crown', {
  name:'Ascendant Crown', type:'armor', slot:'head', rarity:'mythic', sellPrice:0,
  stats:{defenceBonus:100, strengthBonus:18, magicBonus:18, rangedBonus:18, damageReduction:4},
  levelReq:{defence:85},
  desc:'The crown of the Ascendant Lord. Best-in-slot hybrid head piece. Unsellable.',
});

// ── NEW DUNGEONS ────────────────────────────────────────────────
GAME_DATA.dungeons.push(
  {
    id:'catacombs_of_decay', name:'Catacombs of Decay', levelReq:40,
    waves:['bone_crawler','bone_crawler','tomb_wraith','bone_crawler','tomb_wraith','lich_apprentice','tomb_wraith','crypt_guardian'],
    rewards:[{item:'big_bones',qty:10,chance:0.60},{item:'death_rune',qty:15,chance:0.30},{item:'crypt_plate',qty:1,chance:0.03}],
    desc:'Ancient catacombs filled with restless undead. 8 waves of decay.'
  },
  {
    id:'serpents_lair', name:"Serpent's Lair", levelReq:60,
    waves:['venom_snake','venom_snake','basilisk_hatch','venom_snake','basilisk_hatch','serpent_guard','basilisk_hatch','serpent_guard','serpent_guard','naga_priestess'],
    rewards:[{item:'snake_hide',qty:10,chance:0.50},{item:'serpent_fang',qty:2,chance:0.15},{item:'serpentine_helm',qty:1,chance:0.02}],
    desc:"The lair of the Naga cult. 10 waves of venomous creatures."
  },
  {
    id:'infernal_pit', name:'The Infernal Pit', levelReq:75,
    waves:['lesser_demon','lesser_demon','hellhound','lesser_demon','hellhound','imp_overlord','hellhound','abyssal_demon','imp_overlord','abyssal_demon','abyssal_demon','infernal_drake'],
    rewards:[{item:'infernal_ash',qty:8,chance:0.50},{item:'dragon_bones',qty:5,chance:0.35},{item:'infernal_claw',qty:1,chance:0.10},{item:'abyssal_whip',qty:1,chance:0.005}],
    desc:'A gateway to the infernal planes. 12 waves of demonic horror.'
  },
  {
    id:'void_rift', name:'Void Rift', levelReq:90,
    waves:['void_leech','void_leech','reality_bender','void_leech','reality_bender','null_walker','reality_bender','null_walker','null_walker','void_titan'],
    rewards:[{item:'void_crystal',qty:3,chance:0.30},{item:'void_shard',qty:2,chance:0.20},{item:'null_blade',qty:1,chance:0.01},{item:'void_warden_helm',qty:1,chance:0.008}],
    desc:'A tear in reality leaking void creatures. 10 waves of existential terror.'
  },
  {
    id:'ascendant_spire', name:'Ascendant Spire', levelReq:105,
    waves:['ascendant_knight','ascendant_archer','ascendant_knight','ascendant_mage','ascendant_archer','ascendant_knight','ascendant_mage','ascendant_archer','ascendant_knight','ascendant_mage','ascendant_knight','ascendant_archer','ascendant_mage','ascendant_knight','ascendant_lord'],
    rewards:[{item:'celestial_fragment',qty:5,chance:0.30},{item:'dragon_bones',qty:10,chance:0.50},{item:'ascendant_plate',qty:1,chance:0.008},{item:'ascendant_crown',qty:1,chance:0.003}],
    desc:'The ultimate dungeon. 15 waves of ascended warriors. Only the worthy survive.'
  },
);

// ── MONSTER SVG ART ─────────────────────────────────────────────
if (!GAME_DATA.monsterArt) GAME_DATA.monsterArt = {};
Object.assign(GAME_DATA.monsterArt, {

  // Bone Crawler — skittering mass of bones
  bone_crawler: `<svg viewBox="0 0 80 80"><defs><radialGradient id="bc-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#e8e0d0" stop-opacity="0.1"/><stop offset="100%" stop-color="#e8e0d0" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="55" rx="25" ry="12" fill="#2a2218" stroke="#5a4a30" stroke-width="1.5"/><circle cx="30" cy="50" r="6" fill="#e8e0d0" opacity="0.8"/><circle cx="42" cy="48" r="5" fill="#e8e0d0" opacity="0.7"/><circle cx="52" cy="52" r="5.5" fill="#e8e0d0" opacity="0.8"/><path d="M20 58 Q12 62 8 70" stroke="#d8d0c0" stroke-width="2.5" fill="none"/><path d="M22 54 Q14 50 10 44" stroke="#d8d0c0" stroke-width="2.5" fill="none"/><path d="M60 58 Q68 62 72 70" stroke="#d8d0c0" stroke-width="2.5" fill="none"/><path d="M58 54 Q66 50 70 44" stroke="#d8d0c0" stroke-width="2.5" fill="none"/><circle cx="34" cy="42" r="8" fill="#e8e0d0"/><circle cx="30" cy="40" r="3" fill="#1a1208"/><circle cx="30" cy="40" r="1.5" fill="#c44040" opacity="0.9"/><circle cx="38" cy="40" r="3" fill="#1a1208"/><circle cx="38" cy="40" r="1.5" fill="#c44040" opacity="0.9"/><path d="M30 48 L32 46 L34 48 L36 46 L38 48" stroke="#d8d0c0" stroke-width="1" fill="none"/></svg>`,

  // Tomb Wraith — spectral hooded figure
  tomb_wraith: `<svg viewBox="0 0 80 80"><defs><radialGradient id="tw-g" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="#4a6aaa" stop-opacity="0.15"/><stop offset="100%" stop-color="#4a6aaa" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="45" rx="30" ry="35" fill="url(#tw-g)"/><path d="M22 30 Q40 22 58 30 L62 72 Q40 80 18 72Z" fill="#0a0c18" stroke="#4a6aaa" stroke-width="1" opacity="0.8"/><path d="M20 32 Q30 20 40 22 Q50 20 60 32" fill="#0a0c18" stroke="#4a6aaa" stroke-width="1.5"/><circle cx="34" cy="30" r="4" fill="#040810"/><circle cx="34" cy="30" r="2.5" fill="#4a8acc" opacity="0.9"/><circle cx="34" cy="30" r="1" fill="#ccf0ff"/><circle cx="46" cy="30" r="4" fill="#040810"/><circle cx="46" cy="30" r="2.5" fill="#4a8acc" opacity="0.9"/><circle cx="46" cy="30" r="1" fill="#ccf0ff"/><path d="M18 40 Q10 48 12 58" stroke="#0a0c18" stroke-width="5" fill="none" opacity="0.7"/><path d="M62 40 Q70 48 68 58" stroke="#0a0c18" stroke-width="5" fill="none" opacity="0.7"/><path d="M12 56 Q8 62 14 66" stroke="#4a6aaa" stroke-width="1" fill="none" opacity="0.4"/><path d="M68 56 Q72 62 66 66" stroke="#4a6aaa" stroke-width="1" fill="none" opacity="0.4"/></svg>`,

  // Lich Apprentice — robed skeleton with glowing staff
  lich_apprentice: `<svg viewBox="0 0 80 80"><path d="M28 35 Q40 28 52 35 L56 72 Q40 78 24 72Z" fill="#1a0828" stroke="#6a20a0" stroke-width="1.5"/><path d="M30 34 Q40 26 50 34" fill="#1a0828" stroke="#9b30d0" stroke-width="1.5"/><circle cx="40" cy="24" r="10" fill="#e8e0d0"/><circle cx="36" cy="22" r="3" fill="#0a0004"/><circle cx="36" cy="22" r="1.5" fill="#9b30d0" opacity="0.9"/><circle cx="44" cy="22" r="3" fill="#0a0004"/><circle cx="44" cy="22" r="1.5" fill="#9b30d0" opacity="0.9"/><path d="M36 28 L38 27 L40 28 L42 27 L44 28" stroke="#d8d0c0" stroke-width="1" fill="none"/><path d="M26 38 Q18 44 14 55" stroke="#e8e0d0" stroke-width="3" fill="none"/><path d="M54 38 Q62 44 66 55" stroke="#e8e0d0" stroke-width="3" fill="none"/><path d="M14 55 L10 75" stroke="#5a3a1a" stroke-width="2.5" stroke-linecap="round"/><circle cx="10" cy="10" r="6" fill="#9b30d0" opacity="0.5"/><path d="M10 16 L10 75" stroke="#5a3a1a" stroke-width="2.5"/><circle cx="10" cy="10" r="3" fill="#e0a0ff"/></svg>`,

  // Crypt Guardian — heavy armored skeleton warrior
  crypt_guardian: `<svg viewBox="0 0 80 80"><rect x="18" y="38" width="44" height="32" rx="5" fill="#1a1818" stroke="#4a4a5a" stroke-width="2"/><rect x="22" y="62" width="14" height="16" rx="3" fill="#141414" stroke="#3a3a4a" stroke-width="1"/><rect x="44" y="62" width="14" height="16" rx="3" fill="#141414" stroke="#3a3a4a" stroke-width="1"/><ellipse cx="40" cy="40" rx="8" ry="4" fill="#1a1818" stroke="#4a4a5a" stroke-width="1.5"/><circle cx="40" cy="52" r="8" fill="#0a0a10" stroke="#c44040" stroke-width="1.5"/><path d="M34 52 L40 46 L46 52 L40 58Z" fill="#c44040" opacity="0.5"/><rect x="6" y="40" width="16" height="28" rx="7" fill="#141414" stroke="#3a3a4a" stroke-width="1"/><rect x="58" y="40" width="16" height="28" rx="7" fill="#141414" stroke="#3a3a4a" stroke-width="1"/><rect x="14" y="20" width="52" height="22" rx="6" fill="#1a1818" stroke="#4a4a5a" stroke-width="2"/><rect x="22" y="26" width="12" height="6" rx="1" fill="#0a0608"/><rect x="24" y="28" width="8" height="2" fill="#c44040" opacity="0.8"/><rect x="46" y="26" width="12" height="6" rx="1" fill="#0a0608"/><rect x="48" y="28" width="8" height="2" fill="#c44040" opacity="0.8"/><path d="M6 68 L2 78 M10 68 L8 78" stroke="#8a8a9a" stroke-width="2" stroke-linecap="round"/><path d="M66 42 L72 30 M68 30 L76 30" stroke="#8a8a9a" stroke-width="2.5"/></svg>`,

  // Venom Snake — coiled green serpent
  venom_snake: `<svg viewBox="0 0 80 80"><path d="M20 60 Q10 50 15 38 Q22 28 35 32 Q42 20 55 25 Q65 30 60 42 Q55 50 62 58 Q68 65 55 70 Q40 75 25 68Z" fill="#1a4a10" stroke="#3a8a20" stroke-width="1.5"/><path d="M30 58 Q25 50 28 42 Q32 36 40 34" stroke="#2a6a18" stroke-width="1" fill="none" opacity="0.5"/><circle cx="50" cy="28" r="6" fill="#1a4a10" stroke="#3a8a20" stroke-width="1"/><circle cx="48" cy="26" r="2" fill="#0a0a02"/><circle cx="48" cy="26" r="1" fill="#e8cc20" opacity="0.9"/><circle cx="53" cy="26" r="2" fill="#0a0a02"/><circle cx="53" cy="26" r="1" fill="#e8cc20" opacity="0.9"/><path d="M55 32 Q58 34 60 32 Q62 30 58 28" stroke="#c44040" stroke-width="1.5" fill="none"/><path d="M60 30 L66 28 M60 30 L66 32" stroke="#c44040" stroke-width="1"/><circle cx="28" cy="45" r="3" fill="#2a6a18" opacity="0.4"/><circle cx="45" cy="55" r="3.5" fill="#2a6a18" opacity="0.3"/></svg>`,

  // Basilisk Hatchling — small dragon-lizard with glowing eyes
  basilisk_hatch: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="55" rx="22" ry="14" fill="#3a4a2a" stroke="#5a6a3a" stroke-width="1.5"/><path d="M22 48 Q14 42 18 54" fill="#3a4a2a"/><path d="M58 48 Q66 42 62 54" fill="#3a4a2a"/><circle cx="52" cy="42" r="12" fill="#3a4a2a" stroke="#5a6a3a" stroke-width="1.5"/><circle cx="48" cy="40" r="3.5" fill="#080a02"/><circle cx="48" cy="40" r="2" fill="#e8cc20" opacity="0.9"/><circle cx="56" cy="40" r="3.5" fill="#080a02"/><circle cx="56" cy="40" r="2" fill="#e8cc20" opacity="0.9"/><path d="M58 48 Q62 50 60 46" stroke="#3a4a2a" stroke-width="1.5" fill="none"/><path d="M42 34 L40 26 M48 32 L48 24 M54 34 L56 26" stroke="#5a6a3a" stroke-width="1.5" stroke-linecap="round"/><path d="M22 60 L18 72" stroke="#2a3a1a" stroke-width="3"/><path d="M58 60 L62 72" stroke="#2a3a1a" stroke-width="3"/></svg>`,

  // Serpent Guard — humanoid snake warrior
  serpent_guard: `<svg viewBox="0 0 80 80"><rect x="24" y="38" width="32" height="28" rx="5" fill="#1a3a10" stroke="#3a6a20" stroke-width="1.5"/><rect x="28" y="60" width="10" height="16" rx="3" fill="#143008" stroke="#2a5a14" stroke-width="1"/><rect x="42" y="60" width="10" height="16" rx="3" fill="#143008" stroke="#2a5a14" stroke-width="1"/><path d="M32 28 Q40 22 48 28" fill="#2a5a14" stroke="#3a6a20" stroke-width="1"/><circle cx="40" cy="22" r="10" fill="#2a5a14" stroke="#3a6a20" stroke-width="1.5"/><circle cx="36" cy="20" r="2.5" fill="#0a0a02"/><circle cx="36" cy="20" r="1.2" fill="#e8cc20" opacity="0.9"/><circle cx="44" cy="20" r="2.5" fill="#0a0a02"/><circle cx="44" cy="20" r="1.2" fill="#e8cc20" opacity="0.9"/><rect x="10" y="40" width="14" height="24" rx="6" fill="#143008" stroke="#2a5a14" stroke-width="1"/><rect x="56" y="40" width="14" height="24" rx="6" fill="#143008" stroke="#2a5a14" stroke-width="1"/><path d="M68 64 L72 30 M70 30 L74 30" stroke="#5a4a3a" stroke-width="2"/><circle cx="72" cy="28" r="3" fill="#4a8a20" opacity="0.6"/></svg>`,

  // Naga Priestess — half-snake half-woman, ornate
  naga_priestess: `<svg viewBox="0 0 80 80"><path d="M25 55 Q15 60 12 70 Q10 78 20 78 Q30 78 35 72" fill="#1a4a10" stroke="#3a8a20" stroke-width="1.5"/><path d="M55 55 Q65 60 68 70 Q70 78 60 78 Q50 78 45 72" fill="#1a4a10" stroke="#3a8a20" stroke-width="1.5"/><path d="M25 35 Q40 28 55 35 L58 58 Q40 64 22 58Z" fill="#1a3a10" stroke="#4a8a20" stroke-width="1.5"/><circle cx="40" cy="52" r="5" fill="#0a0a02" stroke="#c9873e" stroke-width="1.5"/><circle cx="40" cy="52" r="3" fill="#c9873e" opacity="0.7"/><path d="M22 38 Q14 44 12 54" stroke="#2a5a14" stroke-width="5" fill="none"/><path d="M58 38 Q66 44 68 54" stroke="#2a5a14" stroke-width="5" fill="none"/><circle cx="40" cy="22" r="11" fill="#2a5a14" stroke="#4a8a20" stroke-width="1.5"/><circle cx="35" cy="20" r="3" fill="#0a0a02"/><circle cx="35" cy="20" r="1.5" fill="#c9873e" opacity="0.9"/><circle cx="45" cy="20" r="3" fill="#0a0a02"/><circle cx="45" cy="20" r="1.5" fill="#c9873e" opacity="0.9"/><path d="M32 12 L28 4 M40 10 L40 2 M48 12 L52 4" stroke="#c9873e" stroke-width="1.5" stroke-linecap="round"/><circle cx="28" cy="4" r="2" fill="#c9873e" opacity="0.6"/><circle cx="40" cy="2" r="2.5" fill="#c9873e" opacity="0.7"/><circle cx="52" cy="4" r="2" fill="#c9873e" opacity="0.6"/></svg>`,

  // Lesser Demon — winged red demon
  lesser_demon: `<svg viewBox="0 0 80 80"><ellipse cx="40" cy="48" rx="18" ry="14" fill="#5a1a1a" stroke="#8a2a2a" stroke-width="1.5"/><rect x="28" y="58" width="10" height="14" rx="3" fill="#4a1414" stroke="#6a2020" stroke-width="1"/><rect x="42" y="58" width="10" height="14" rx="3" fill="#4a1414" stroke="#6a2020" stroke-width="1"/><circle cx="40" cy="30" r="10" fill="#5a1a1a" stroke="#8a2a2a" stroke-width="1.5"/><circle cx="36" cy="28" r="2.5" fill="#0a0202"/><circle cx="36" cy="28" r="1.2" fill="#e8cc20"/><circle cx="44" cy="28" r="2.5" fill="#0a0202"/><circle cx="44" cy="28" r="1.2" fill="#e8cc20"/><path d="M36 36 L38 34 L40 36 L42 34 L44 36" stroke="#e8e0d0" stroke-width="1" fill="none"/><path d="M32 22 L28 14 M48 22 L52 14" stroke="#5a1a1a" stroke-width="2" stroke-linecap="round"/><path d="M24 38 Q10 28 8 40 Q10 50 24 46" fill="#4a1414" stroke="#6a2020" stroke-width="1" opacity="0.7"/><path d="M56 38 Q70 28 72 40 Q70 50 56 46" fill="#4a1414" stroke="#6a2020" stroke-width="1" opacity="0.7"/><path d="M36 72 Q34 78 38 78 Q42 78 40 72" stroke="#5a1a1a" stroke-width="2" fill="none"/></svg>`,

  // Hellhound — fiery canine
  hellhound: `<svg viewBox="0 0 80 80"><ellipse cx="35" cy="50" rx="22" ry="14" fill="#4a1a08" stroke="#8a3a10" stroke-width="1.5"/><circle cx="55" cy="40" r="10" fill="#4a1a08" stroke="#8a3a10" stroke-width="1.5"/><circle cx="52" cy="38" r="2.5" fill="#0a0402"/><circle cx="52" cy="38" r="1.2" fill="#e8cc20" opacity="0.9"/><circle cx="58" cy="38" r="2.5" fill="#0a0402"/><circle cx="58" cy="38" r="1.2" fill="#e8cc20" opacity="0.9"/><path d="M60 44 Q64 42 62 46" stroke="#4a1a08" stroke-width="1.5" fill="none"/><polygon points="48,32 46,22 52,30" fill="#4a1a08"/><polygon points="56,32 60,22 54,30" fill="#4a1a08"/><path d="M14 48 Q4 44 8 54" fill="#4a1a08"/><path d="M22 62 L18 74" stroke="#3a1208" stroke-width="3.5"/><path d="M48 62 L46 74" stroke="#3a1208" stroke-width="3.5"/><path d="M30 42 Q34 38 38 42" stroke="#c44020" stroke-width="1.5" fill="none" opacity="0.5"/><path d="M42 46 Q46 42 50 46" stroke="#e88030" stroke-width="1" fill="none" opacity="0.4"/><circle cx="20" cy="44" r="2" fill="#e88030" opacity="0.3"/></svg>`,

  // Imp Overlord — large imp with fire crown
  imp_overlord: `<svg viewBox="0 0 80 80"><path d="M25 35 Q40 28 55 35 L58 62 Q40 70 22 62Z" fill="#3a0a0a" stroke="#8a2a2a" stroke-width="1.5"/><circle cx="40" cy="50" r="6" fill="#0a0202" stroke="#c44020" stroke-width="1.5"/><circle cx="40" cy="50" r="3" fill="#c44020" opacity="0.7"/><circle cx="40" cy="50" r="1.5" fill="#e8cc20"/><rect x="20" y="38" width="12" height="22" rx="5" fill="#3a0a0a" stroke="#6a1a1a" stroke-width="1"/><rect x="48" y="38" width="12" height="22" rx="5" fill="#3a0a0a" stroke="#6a1a1a" stroke-width="1"/><circle cx="40" cy="22" r="12" fill="#3a0a0a" stroke="#8a2a2a" stroke-width="1.5"/><circle cx="35" cy="20" r="3" fill="#0a0202"/><circle cx="35" cy="20" r="1.5" fill="#e88030" opacity="0.9"/><circle cx="45" cy="20" r="3" fill="#0a0202"/><circle cx="45" cy="20" r="1.5" fill="#e88030" opacity="0.9"/><path d="M30 12 L26 4 M36 10 L34 2 M40 9 L40 0 M44 10 L46 2 M50 12 L54 4" stroke="#e88030" stroke-width="2" stroke-linecap="round"/><circle cx="26" cy="4" r="2" fill="#c44020" opacity="0.6"/><circle cx="40" cy="0" r="2.5" fill="#e88030" opacity="0.7"/><circle cx="54" cy="4" r="2" fill="#c44020" opacity="0.6"/></svg>`,

  // Abyssal Demon — dark warped demon
  abyssal_demon: `<svg viewBox="0 0 80 80"><defs><radialGradient id="ad-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#5a0a5a" stop-opacity="0.15"/><stop offset="100%" stop-color="#5a0a5a" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="45" rx="30" ry="30" fill="url(#ad-g)"/><ellipse cx="40" cy="50" rx="20" ry="16" fill="#1a0a1a" stroke="#5a2060" stroke-width="2"/><circle cx="40" cy="30" r="12" fill="#1a0a1a" stroke="#5a2060" stroke-width="2"/><circle cx="35" cy="28" r="3.5" fill="#080408"/><circle cx="35" cy="28" r="2" fill="#9b30d0" opacity="0.9"/><circle cx="35" cy="27" r="0.8" fill="#e0a0ff"/><circle cx="45" cy="28" r="3.5" fill="#080408"/><circle cx="45" cy="28" r="2" fill="#9b30d0" opacity="0.9"/><circle cx="45" cy="27" r="0.8" fill="#e0a0ff"/><path d="M30 20 L26 12 M50 20 L54 12" stroke="#5a2060" stroke-width="2.5" stroke-linecap="round"/><path d="M22 40 Q10 35 8 48 Q10 58 22 52" fill="#1a0a1a" stroke="#3a1040" stroke-width="1" opacity="0.7"/><path d="M58 40 Q70 35 72 48 Q70 58 58 52" fill="#1a0a1a" stroke="#3a1040" stroke-width="1" opacity="0.7"/><path d="M28 64 L24 74" stroke="#1a0a1a" stroke-width="4"/><path d="M52 64 L56 74" stroke="#1a0a1a" stroke-width="4"/><circle cx="12" cy="32" r="2" fill="#9b30d0" opacity="0.3"/><circle cx="68" cy="36" r="2" fill="#9b30d0" opacity="0.3"/></svg>`,

  // Infernal Drake — lesser fire dragon
  infernal_drake: `<svg viewBox="0 0 80 80"><ellipse cx="38" cy="52" rx="22" ry="15" fill="#5a1a08" stroke="#8a3a10" stroke-width="1.5"/><circle cx="56" cy="38" r="11" fill="#5a1a08" stroke="#8a3a10" stroke-width="1.5"/><circle cx="53" cy="36" r="3" fill="#0a0402"/><circle cx="53" cy="36" r="1.5" fill="#e8cc20" opacity="0.9"/><circle cx="60" cy="36" r="3" fill="#0a0402"/><circle cx="60" cy="36" r="1.5" fill="#e8cc20" opacity="0.9"/><path d="M62 42 Q66 40 64 44" stroke="#5a1a08" stroke-width="1.5" fill="none"/><path d="M64 40 L70 38" stroke="#c44020" stroke-width="1.5"/><path d="M64 42 L70 44" stroke="#c44020" stroke-width="1.5"/><polygon points="48,30 44,18 54,28" fill="#5a1a08"/><polygon points="58,30 62,18 56,28" fill="#5a1a08"/><path d="M20 44 Q6 30 10 46 Q2 40 16 52" fill="#4a1208" opacity="0.7"/><path d="M56 44 Q70 30 68 46 Q76 40 60 52" fill="#4a1208" opacity="0.7"/><path d="M16 52 Q6 50 8 60" fill="#5a1a08"/><path d="M24 64 L20 76" stroke="#3a1208" stroke-width="4"/><path d="M52 64 L50 76" stroke="#3a1208" stroke-width="4"/><circle cx="30" cy="46" r="3" fill="#c44020" opacity="0.4"/><circle cx="44" cy="50" r="2.5" fill="#e88030" opacity="0.3"/></svg>`,

  // Void Leech — parasitic void blob
  void_leech: `<svg viewBox="0 0 80 80"><defs><radialGradient id="vl-g" cx="50%" cy="50%" r="60%"><stop offset="0%" stop-color="#9b30d0" stop-opacity="0.15"/><stop offset="100%" stop-color="#9b30d0" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="50" rx="25" ry="20" fill="url(#vl-g)"/><ellipse cx="40" cy="52" rx="22" ry="16" fill="#080010" stroke="#6a0aaa" stroke-width="1.5"/><ellipse cx="40" cy="52" rx="16" ry="11" fill="#0c0018" stroke="#5a0a8a" stroke-width="0.8" stroke-dasharray="3 2"/><circle cx="40" cy="42" r="6" fill="#040008"/><circle cx="40" cy="42" r="4" fill="#9b30d0" opacity="0.8"/><circle cx="40" cy="42" r="2" fill="#e0a0ff"/><circle cx="40" cy="41" r="0.8" fill="#fff" opacity="0.8"/><path d="M20 58 Q14 65 18 72" stroke="#6a0aaa" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M60 58 Q66 65 62 72" stroke="#6a0aaa" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M34 66 Q30 72 34 78" stroke="#5a0a8a" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M46 66 Q50 72 46 78" stroke="#5a0a8a" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="18" cy="72" r="3" fill="#9b30d0" opacity="0.5"/><circle cx="62" cy="72" r="3" fill="#9b30d0" opacity="0.5"/></svg>`,

  // Reality Bender — shifting geometric entity
  reality_bender: `<svg viewBox="0 0 80 80"><defs><radialGradient id="rb-g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#9b30d0" stop-opacity="0.2"/><stop offset="100%" stop-color="#9b30d0" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="40" rx="35" ry="35" fill="url(#rb-g)"/><polygon points="40,12 62,30 58,56 22,56 18,30" fill="#060010" stroke="#9b30d0" stroke-width="2"/><polygon points="40,18 56,32 52,52 28,52 24,32" fill="#0c0020" stroke="#6a1a8a" stroke-width="1" opacity="0.6"/><circle cx="40" cy="35" r="8" fill="#040008"/><circle cx="40" cy="35" r="6" fill="#9b30d0" opacity="0.85"/><circle cx="40" cy="35" r="3.5" fill="#c060f0"/><circle cx="40" cy="34" r="1.5" fill="#fff" opacity="0.8"/><path d="M22 56 Q18 62 22 68 Q28 72 32 66" stroke="#6a0aaa" stroke-width="2" fill="none" opacity="0.5"/><path d="M58 56 Q62 62 58 68 Q52 72 48 66" stroke="#6a0aaa" stroke-width="2" fill="none" opacity="0.5"/><polygon points="8,20 14,14 16,22" fill="#9b30d0" opacity="0.3"/><polygon points="72,18 66,12 64,20" fill="#9b30d0" opacity="0.3"/><polygon points="10,62 16,58 14,66" fill="#6a0aaa" opacity="0.25"/><polygon points="70,60 64,56 66,64" fill="#6a0aaa" opacity="0.25"/></svg>`,

  // Null Walker — humanoid void entity with no face
  null_walker: `<svg viewBox="0 0 80 80"><defs><radialGradient id="nw-g" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#9b30d0" stop-opacity="0.15"/><stop offset="100%" stop-color="#9b30d0" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="45" rx="30" ry="35" fill="url(#nw-g)"/><path d="M28 38 Q40 32 52 38 L56 68 Q40 74 24 68Z" fill="#04000a" stroke="#6a0aaa" stroke-width="1.5"/><rect x="18" y="40" width="12" height="26" rx="5" fill="#04000a" stroke="#5a0a8a" stroke-width="1"/><rect x="50" y="40" width="12" height="26" rx="5" fill="#04000a" stroke="#5a0a8a" stroke-width="1"/><circle cx="40" cy="24" r="12" fill="#04000a" stroke="#9b30d0" stroke-width="2"/><rect x="32" y="18" width="16" height="12" rx="4" fill="#08001a" stroke="#6a0aaa" stroke-width="1"/><path d="M34 22 Q40 18 46 22" stroke="#9b30d0" stroke-width="1" fill="none" opacity="0.4"/><path d="M34 26 Q40 30 46 26" stroke="#9b30d0" stroke-width="1" fill="none" opacity="0.4"/><path d="M16 66 L12 76 M20 66 L18 76" stroke="#6a0aaa" stroke-width="2" stroke-linecap="round"/><path d="M60 66 L64 76 M56 66 L58 76" stroke="#6a0aaa" stroke-width="2" stroke-linecap="round"/><circle cx="14" cy="35" r="2" fill="#9b30d0" opacity="0.3"/><circle cx="66" cy="38" r="2" fill="#9b30d0" opacity="0.3"/></svg>`,

  // Void Titan — massive void construct
  void_titan: `<svg viewBox="0 0 80 80"><defs><radialGradient id="vt-g" cx="50%" cy="60%" r="55%"><stop offset="0%" stop-color="#9b30d0" stop-opacity="0.25"/><stop offset="100%" stop-color="#9b30d0" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="50" rx="38" ry="30" fill="url(#vt-g)"/><rect x="14" y="52" width="18" height="24" rx="4" fill="#04000a" stroke="#6a0aaa" stroke-width="2"/><rect x="48" y="52" width="18" height="24" rx="4" fill="#04000a" stroke="#6a0aaa" stroke-width="2"/><rect x="8" y="22" width="64" height="34" rx="8" fill="#04000a" stroke="#9b30d0" stroke-width="2.5"/><circle cx="40" cy="38" r="10" fill="#08001a" stroke="#9b30d0" stroke-width="2"/><circle cx="40" cy="38" r="7" fill="#9b30d0" opacity="0.7"/><circle cx="40" cy="38" r="4" fill="#c060f0"/><circle cx="40" cy="37" r="2" fill="#fff" opacity="0.8"/><path d="M8 32 L72 32 M8 48 L72 48" stroke="#5a0a8a" stroke-width="0.8" opacity="0.4"/><rect x="-2" y="26" width="14" height="28" rx="6" fill="#04000a" stroke="#6a0aaa" stroke-width="1.5"/><rect x="68" y="26" width="14" height="28" rx="6" fill="#04000a" stroke="#6a0aaa" stroke-width="1.5"/><rect x="18" y="8" width="44" height="18" rx="6" fill="#04000a" stroke="#9b30d0" stroke-width="2"/><rect x="24" y="12" width="12" height="6" rx="1" fill="#08001a"/><rect x="26" y="14" width="8" height="2" fill="#9b30d0" opacity="0.8"/><rect x="44" y="12" width="12" height="6" rx="1" fill="#08001a"/><rect x="46" y="14" width="8" height="2" fill="#9b30d0" opacity="0.8"/><path d="M-2 52 L-6 60 M4 54 L2 62" stroke="#6a0aaa" stroke-width="2.5" stroke-linecap="round"/><path d="M82 52 L86 60 M76 54 L78 62" stroke="#6a0aaa" stroke-width="2.5" stroke-linecap="round"/></svg>`,

  // Ascendant Knight — golden armored warrior
  ascendant_knight: `<svg viewBox="0 0 80 80"><rect x="22" y="36" width="36" height="30" rx="4" fill="#1a1410" stroke="#c9873e" stroke-width="2"/><circle cx="40" cy="50" r="6" fill="#0a0804" stroke="#c9873e" stroke-width="1.5"/><polygon points="40,46 44,50 40,54 36,50" fill="#c9873e" opacity="0.6"/><rect x="26" y="60" width="11" height="16" rx="3" fill="#141008" stroke="#8a6a20" stroke-width="1"/><rect x="43" y="60" width="11" height="16" rx="3" fill="#141008" stroke="#8a6a20" stroke-width="1"/><rect x="10" y="38" width="14" height="26" rx="6" fill="#141008" stroke="#8a6a20" stroke-width="1"/><rect x="56" y="38" width="14" height="26" rx="6" fill="#141008" stroke="#8a6a20" stroke-width="1"/><rect x="18" y="14" width="44" height="24" rx="6" fill="#1a1410" stroke="#c9873e" stroke-width="2"/><rect x="24" y="20" width="12" height="6" rx="1" fill="#0a0604"/><rect x="26" y="22" width="8" height="2" fill="#c9873e" opacity="0.9"/><rect x="44" y="20" width="12" height="6" rx="1" fill="#0a0604"/><rect x="46" y="22" width="8" height="2" fill="#c9873e" opacity="0.9"/><path d="M30 14 L28 8 M40 12 L40 6 M50 14 L52 8" stroke="#c9873e" stroke-width="2" stroke-linecap="round"/><path d="M8 64 L4 74 M12 64 L10 74" stroke="#8a8a9a" stroke-width="2"/><path d="M62 40 L68 28 M66 28 L72 28" stroke="#c9873e" stroke-width="2.5"/></svg>`,

  // Ascendant Mage — golden robed mage
  ascendant_mage: `<svg viewBox="0 0 80 80"><path d="M25 34 Q40 26 55 34 L60 74 Q40 80 20 74Z" fill="#1a1410" stroke="#c9873e" stroke-width="1.5"/><path d="M28 40 Q40 36 52 40" stroke="#8a6a20" stroke-width="0.8" fill="none" opacity="0.5"/><path d="M24 55 Q40 50 56 55" stroke="#8a6a20" stroke-width="0.8" fill="none" opacity="0.5"/><circle cx="40" cy="48" r="5" fill="#0a0604" stroke="#c9873e" stroke-width="1.5"/><circle cx="40" cy="48" r="3" fill="#c9873e" opacity="0.7"/><path d="M22 38 Q14 44 10 55" stroke="#1a1410" stroke-width="6" fill="none"/><path d="M58 38 Q66 44 70 55" stroke="#1a1410" stroke-width="6" fill="none"/><circle cx="40" cy="20" r="10" fill="#1a1410" stroke="#c9873e" stroke-width="2"/><circle cx="36" cy="18" r="2.5" fill="#0a0604"/><circle cx="36" cy="18" r="1.2" fill="#c9873e" opacity="0.9"/><circle cx="44" cy="18" r="2.5" fill="#0a0604"/><circle cx="44" cy="18" r="1.2" fill="#c9873e" opacity="0.9"/><path d="M10 55 L6 76" stroke="#5a3a1a" stroke-width="2.5" stroke-linecap="round"/><circle cx="6" cy="4" r="5" fill="#c9873e" opacity="0.5"/><circle cx="6" cy="4" r="3" fill="#e8c060"/><path d="M6 9 L6 76" stroke="#5a3a1a" stroke-width="2.5"/></svg>`,

  // Ascendant Archer — golden ranged warrior
  ascendant_archer: `<svg viewBox="0 0 80 80"><path d="M26 35 Q40 30 54 35 L56 65 Q40 70 24 65Z" fill="#1a1410" stroke="#c9873e" stroke-width="1.5"/><rect x="28" y="60" width="10" height="14" rx="3" fill="#141008" stroke="#8a6a20" stroke-width="1"/><rect x="42" y="60" width="10" height="14" rx="3" fill="#141008" stroke="#8a6a20" stroke-width="1"/><circle cx="40" cy="22" r="10" fill="#1a1410" stroke="#c9873e" stroke-width="2"/><circle cx="36" cy="20" r="2.5" fill="#0a0604"/><circle cx="36" cy="20" r="1.2" fill="#c9873e" opacity="0.9"/><circle cx="44" cy="20" r="2.5" fill="#0a0604"/><circle cx="44" cy="20" r="1.2" fill="#c9873e" opacity="0.9"/><path d="M30 14 Q34 10 40 12 Q46 10 50 14" fill="#1a1410" stroke="#8a6a20" stroke-width="1"/><rect x="14" y="38" width="12" height="22" rx="5" fill="#141008" stroke="#8a6a20" stroke-width="1"/><rect x="54" y="38" width="12" height="22" rx="5" fill="#141008" stroke="#8a6a20" stroke-width="1"/><path d="M66 48 Q74 38 66 28" stroke="#5a3a1a" stroke-width="2" fill="none"/><path d="M66 30 L66 46" stroke="#c9873e" stroke-width="0.8"/><path d="M14 48 L8 22" stroke="#c9873e" stroke-width="1.5"/><polygon points="8,22 6,16 10,18" fill="#c9873e"/></svg>`,

  // Ascendant Lord — massive golden being with halo
  ascendant_lord: `<svg viewBox="0 0 80 80"><defs><radialGradient id="al-g" cx="50%" cy="30%" r="60%"><stop offset="0%" stop-color="#c9873e" stop-opacity="0.25"/><stop offset="100%" stop-color="#c9873e" stop-opacity="0"/></radialGradient></defs><ellipse cx="40" cy="40" rx="38" ry="38" fill="url(#al-g)"/><rect x="18" y="34" width="44" height="32" rx="5" fill="#1a1410" stroke="#c9873e" stroke-width="2.5"/><circle cx="40" cy="48" r="8" fill="#0a0604" stroke="#c9873e" stroke-width="2"/><circle cx="40" cy="48" r="5" fill="#c9873e" opacity="0.7"/><circle cx="40" cy="48" r="2.5" fill="#ffe080"/><rect x="22" y="60" width="14" height="18" rx="4" fill="#141008" stroke="#8a6a20" stroke-width="1.5"/><rect x="44" y="60" width="14" height="18" rx="4" fill="#141008" stroke="#8a6a20" stroke-width="1.5"/><ellipse cx="14" cy="40" rx="8" ry="6" fill="#141008" stroke="#c9873e" stroke-width="1.5"/><ellipse cx="66" cy="40" rx="8" ry="6" fill="#141008" stroke="#c9873e" stroke-width="1.5"/><path d="M8 42 L6 48 M10 44 L8 50" stroke="#c9873e" stroke-width="2" stroke-linecap="round"/><rect x="6" y="38" width="12" height="24" rx="5" fill="#141008" stroke="#8a6a20" stroke-width="1"/><rect x="62" y="38" width="12" height="24" rx="5" fill="#141008" stroke="#8a6a20" stroke-width="1"/><rect x="16" y="10" width="48" height="26" rx="7" fill="#1a1410" stroke="#c9873e" stroke-width="2.5"/><rect x="24" y="18" width="12" height="6" rx="1" fill="#0a0604"/><rect x="26" y="20" width="8" height="2" fill="#c9873e" opacity="0.9"/><rect x="44" y="18" width="12" height="6" rx="1" fill="#0a0604"/><rect x="46" y="20" width="8" height="2" fill="#c9873e" opacity="0.9"/><circle cx="40" cy="4" r="0" fill="none" stroke="#c9873e" stroke-width="1.5" opacity="0.6"/><ellipse cx="40" cy="8" rx="22" ry="6" fill="none" stroke="#c9873e" stroke-width="1.5" opacity="0.4"/><path d="M24 10 L20 2 M32 8 L30 0 M40 6 L40 -2 M48 8 L50 0 M56 10 L60 2" stroke="#c9873e" stroke-width="2" stroke-linecap="round"/></svg>`,

});

console.log('[Ashfall] Dungeons Expanded: Monsters:', 
  ['bone_crawler','tomb_wraith','lich_apprentice','crypt_guardian','venom_snake','basilisk_hatch',
   'serpent_guard','naga_priestess','lesser_demon','hellhound','imp_overlord','abyssal_demon',
   'infernal_drake','void_leech','reality_bender','null_walker','void_titan','ascendant_knight',
   'ascendant_mage','ascendant_archer','ascendant_lord'].filter(id => GAME_DATA.monsters[id]).length);
console.log('[Ashfall] Dungeons Expanded: Art:', 
  ['bone_crawler','tomb_wraith','lich_apprentice','crypt_guardian','venom_snake','basilisk_hatch',
   'serpent_guard','naga_priestess','lesser_demon','hellhound','imp_overlord','abyssal_demon',
   'infernal_drake','void_leech','reality_bender','null_walker','void_titan','ascendant_knight',
   'ascendant_mage','ascendant_archer','ascendant_lord'].filter(id => GAME_DATA.monsterArt[id]).length);

// ================================================================
// ================================================================
// PARTY SYSTEM — Full implementation
// Formation, NPC companions, ready check, raid launch,
// combat integration, damage simulation, loot distribution.
// ================================================================

// ── NPC COMPANIONS (fill empty party slots) ─────────────────────
GAME_DATA.npcCompanions = [
  { id:'merc_warrior', name:'Ashborne Warrior', combatLevel:60, style:'melee', maxHit:18, attackSpeed:2.4, hp:400, dps:7.5, desc:'A mercenary swordsman. Decent melee DPS.', unlockLevel:30 },
  { id:'merc_ranger',  name:'Duskwood Ranger',  combatLevel:65, style:'ranged', maxHit:16, attackSpeed:2.0, hp:350, dps:8, desc:'An elven archer. Fast ranged attacks.', unlockLevel:35 },
  { id:'merc_mage',    name:'Ashen Sorcerer',   combatLevel:60, style:'magic',  maxHit:20, attackSpeed:2.2, hp:300, dps:9, desc:'A mage from the Ashfall wastes. Strong magic DPS.', unlockLevel:40 },
  { id:'merc_tank',    name:'Iron Sentinel',     combatLevel:80, style:'melee',  maxHit:12, attackSpeed:3.0, hp:800, dps:4, desc:'A heavily armored tank. Absorbs boss attacks.', unlockLevel:50 },
  { id:'merc_healer',  name:'Cinderveil Cleric', combatLevel:70, style:'magic',  maxHit:10, attackSpeed:2.4, hp:350, dps:4, desc:'A healer. Restores party HP every 8 seconds.', unlockLevel:45, heals:true, healAmt:15, healInterval:8 },
  { id:'merc_elite_war', name:'Obsidian Champion', combatLevel:100, style:'melee', maxHit:30, attackSpeed:2.2, hp:600, dps:14, desc:'An elite warrior. High DPS.', unlockLevel:70 },
  { id:'merc_elite_rng', name:'Voidtouched Sniper', combatLevel:100, style:'ranged', maxHit:28, attackSpeed:1.8, hp:500, dps:15, desc:'An elite marksman. Highest ranged DPS.', unlockLevel:75 },
  { id:'merc_elite_mag', name:'Netherbane Warlock', combatLevel:100, style:'magic', maxHit:35, attackSpeed:2.4, hp:450, dps:14, desc:'An elite warlock. Devastating magic.', unlockLevel:80 },
];

// ── PARTY CONFIG ────────────────────────────────────────────────
GAME_DATA.partySystem = {
  maxSize: 4,
  raidBonuses: {
    1: { hpMult:1.0,  dmgMult:1.0  },
    2: { hpMult:0.85, dmgMult:1.08 },
    3: { hpMult:0.70, dmgMult:1.12 },
    4: { hpMult:0.60, dmgMult:1.18 },
  },
  raidTargets: [
    { id:'theatre',  name:'Theatre of Ash',        levelReq:80  },
    { id:'chambers', name:'Chambers of the Ashen King', levelReq:90 },
    { id:'gwd_bandos', name:'GWD: Bandos',         levelReq:80  },
    { id:'gwd_armadyl', name:'GWD: Armadyl',       levelReq:80  },
    { id:'gwd_saradomin', name:'GWD: Saradomin',   levelReq:80  },
    { id:'gwd_zamorak', name:'GWD: Zamorak',       levelReq:80  },
    { id:'corporeal_lair', name:'Corporeal Beast',  levelReq:95  },
    { id:'nightmare_arena', name:'Nightmare',       levelReq:100 },
  ],
};

// ── PARTY ENGINE ────────────────────────────────────────────────
GameEngine.prototype.initPartySystem = function() {
  if (!this.state.party) {
    this.state.party = {
      active:false, id:null, name:null, leader:null,
      members:[], npcMembers:[], raidTarget:null,
      readyCheck:false, allReady:false,
      raidActive:false, raidStarted:false,
      chat:[],
      memberStatus:{}, totalPartyDmg:0,
    };
  }
  // Patch old saves missing new fields
  const p = this.state.party;
  if (!p.npcMembers) p.npcMembers = [];
  if (p.raidTarget === undefined) p.raidTarget = null;
  if (!p.memberStatus) p.memberStatus = {};
  if (p.totalPartyDmg === undefined) p.totalPartyDmg = 0;
  if (p.readyCheck === undefined) p.readyCheck = false;
  if (p.allReady === undefined) p.allReady = false;
  if (p.raidStarted === undefined) p.raidStarted = false;
  if (!p.chat) p.chat = [];
  if (!p.members) p.members = [];
};

GameEngine.prototype.createParty = function(partyName) {
  this.initPartySystem();
  if (this.state.party.active) { this.emit('notification',{type:'warn',text:'Already in a party.'}); return; }
  if (!online?.isOnline || !online?.user) { this.emit('notification',{type:'warn',text:'Must be logged in to create a party.'}); return; }
  const partyId = 'party_' + Date.now() + '_' + Math.random().toString(36).substr(2,6);
  const playerName = this.state.playerName || online.displayName || 'Player';
  const cl = this.getCombatLevel();
  this.state.party = {
    active:true, id:partyId, name:partyName || 'Raid Party',
    leader:playerName,
    members:[{ id:online.user.uid, name:playerName, combatLevel:cl, role:'leader', ready:true, isPlayer:true }],
    npcMembers:[], raidTarget:null,
    readyCheck:false, allReady:false,
    raidActive:false, raidStarted:false,
    chat:[], memberStatus:{}, totalPartyDmg:0,
  };
  this.emit('notification',{type:'success',text:`Party "${partyName||'Raid Party'}" created!`});
  this._syncPartyToFirebase();
  this._startPartyListeners();
  // Send system message via RTDB
  online.sendPartyChat(partyId, `📢 Party "${partyName||'Raid Party'}" created by ${playerName}`);
};

// ── RE-RENDER PARTY PAGE ON REAL-TIME UPDATES ───────────────────
// Engine events trigger UI re-render when on party page
(function() {
  const _origInit = GameEngine.prototype.initPartySystem;
  let _boundPartyEvents = false;
  GameEngine.prototype.initPartySystem = function() {
    _origInit.call(this);
    if (!_boundPartyEvents) {
      _boundPartyEvents = true;
      this.on('partyUpdate', () => { if (window.ui?.currentPage === 'party') window.ui.renderPage('party'); });
      this.on('partyChat', () => {
        // Only update chat log, not full page re-render (avoids losing input focus)
        const chatLog = document.getElementById('partyChatLog');
        if (!chatLog || window.ui?.currentPage !== 'party') return;
        const p = this.state.party;
        chatLog.innerHTML = (p.chat||[]).slice(-30).map(msg=>`<div class="party-chat-msg"><span class="party-chat-sender">${msg.sender}:</span> <span class="party-chat-text">${msg.text}</span></div>`).join('');
        chatLog.scrollTop = chatLog.scrollHeight;
      });
    }
  };
})();

GameEngine.prototype.addNpcCompanion = function(npcId) {
  this.initPartySystem();
  const p = this.state.party;
  if (!p.active) { this.emit('notification',{type:'warn',text:'Create a party first.'}); return; }
  const totalSize = p.members.length + p.npcMembers.length;
  if (totalSize >= GAME_DATA.partySystem.maxSize) { this.emit('notification',{type:'warn',text:'Party is full (4 max).'}); return; }
  const npc = GAME_DATA.npcCompanions.find(n => n.id === npcId);
  if (!npc) { this.emit('notification',{type:'warn',text:'Companion not found.'}); return; }
  if (this.getCombatLevel() < npc.unlockLevel) { this.emit('notification',{type:'warn',text:`Requires combat level ${npc.unlockLevel} to hire.`}); return; }
  if (p.npcMembers.find(n => n.id === npcId)) { this.emit('notification',{type:'warn',text:'Already in party.'}); return; }
  p.npcMembers.push({ ...npc, ready:true, isNpc:true });
  p.chat.push({sender:'System',text:`${npc.name} joins the party.`,time:Date.now()});
  this.emit('notification',{type:'success',text:`${npc.name} hired!`});
};

GameEngine.prototype.removeNpcCompanion = function(npcId) {
  const p = this.state.party;
  if (!p?.active) return;
  p.npcMembers = p.npcMembers.filter(n => n.id !== npcId);
};

GameEngine.prototype.setRaidTarget = function(targetId) {
  const p = this.state.party;
  if (!p?.active) return;
  const target = GAME_DATA.partySystem.raidTargets.find(t => t.id === targetId);
  if (!target) return;
  if (this.getCombatLevel() < target.levelReq) { this.emit('notification',{type:'warn',text:`Requires combat level ${target.levelReq}.`}); return; }
  p.raidTarget = targetId;
  p.chat.push({sender:'System',text:`Raid target set: ${target.name}`,time:Date.now()});
  this.emit('notification',{type:'info',text:`Target: ${target.name}`});
};

GameEngine.prototype.startReadyCheck = function() {
  const p = this.state.party;
  if (!p?.active || !p.raidTarget) { this.emit('notification',{type:'warn',text:'Set a raid target first.'}); return; }
  p.readyCheck = true; p.allReady = false;
  // Player is always ready, NPCs are always ready
  p.members.forEach(m => { if (m.isPlayer) m.ready = true; });
  p.npcMembers.forEach(m => m.ready = true);
  this._checkAllReady();
  p.chat.push({sender:'System',text:'Ready check started!',time:Date.now()});
};

GameEngine.prototype._checkAllReady = function() {
  const p = this.state.party;
  const allMembersReady = p.members.every(m => m.ready);
  const allNpcsReady = p.npcMembers.every(m => m.ready);
  p.allReady = allMembersReady && allNpcsReady && (p.members.length + p.npcMembers.length >= 1);
};

GameEngine.prototype.launchPartyRaid = function() {
  const p = this.state.party;
  if (!p?.active || !p.raidTarget) { this.emit('notification',{type:'warn',text:'No raid target set.'}); return; }
  const totalSize = p.members.length + p.npcMembers.length;
  if (totalSize < 1) { this.emit('notification',{type:'warn',text:'Need at least 1 member.'}); return; }

  // Initialize member combat status
  p.memberStatus = {};
  for (const m of p.npcMembers) {
    p.memberStatus[m.id] = { hp:m.hp, maxHp:m.hp, alive:true, dps:m.dps, totalDmg:0, name:m.name, style:m.style, heals:m.heals||false, healAmt:m.healAmt||0, healTimer:0, healInterval:m.healInterval||99 };
  }
  p.totalPartyDmg = 0;
  p.raidActive = true; p.raidStarted = true;
  p.readyCheck = false;

  p.chat.push({sender:'System',text:`Raid launched: ${p.raidTarget}! ${totalSize} members.`,time:Date.now()});
  this.emit('notification',{type:'achievement',text:`Party raid starting with ${totalSize} members!`});

  // Launch the actual raid/dungeon
  const target = p.raidTarget;
  if (target === 'theatre') { this.startTheatreOfAsh?.(); }
  else if (target === 'chambers') { this.startChambersOfAsh?.(); }
  else {
    // Dungeon — start it with party scaling
    const dungeon = GAME_DATA.dungeons.find(d => d.id === target);
    if (dungeon) { this.startDungeon?.(target); }
  }
};

// ── PARTY COMBAT TICK — simulates NPC member damage ─────────────
GameEngine.prototype.tickPartyMembers = function(dt) {
  const p = this.state.party;
  if (!p?.raidActive || !p.raidStarted) return;
  const c = this.state.combat;
  if (!c?.active) return;

  for (const [id, ms] of Object.entries(p.memberStatus)) {
    if (!ms.alive) continue;

    // NPC takes some boss damage (10% of boss attacks go to NPCs)
    // This is simulated — boss doesn't literally target them

    // NPC deals damage to the boss
    const dmgThisTick = ms.dps * dt;
    const actualDmg = Math.floor(dmgThisTick);
    if (actualDmg > 0 && c.monsterHp > 0) {
      c.monsterHp -= actualDmg;
      ms.totalDmg += actualDmg;
      p.totalPartyDmg += actualDmg;
    }

    // Healer logic
    if (ms.heals && ms.alive) {
      ms.healTimer += dt;
      if (ms.healTimer >= ms.healInterval) {
        ms.healTimer = 0;
        const heal = ms.healAmt;
        c.playerHp = Math.min(c.playerHp + heal, this.getMaxHp());
        // Also heal NPC members
        for (const [oid, oms] of Object.entries(p.memberStatus)) {
          if (oms.alive) oms.hp = Math.min(oms.hp + Math.floor(heal/2), oms.maxHp);
        }
      }
    }

    // Random chance NPC takes damage from boss AoE (5% per tick)
    if (Math.random() < 0.05 * dt) {
      const bossMon = GAME_DATA.monsters[c.monster];
      if (bossMon) {
        const aoe = Math.floor(Math.random() * bossMon.maxHit * 0.3);
        ms.hp -= aoe;
        if (ms.hp <= 0) { ms.hp = 0; ms.alive = false; ms.dps = 0;
          p.chat.push({sender:'System',text:`${ms.name} has fallen!`,time:Date.now()});
        }
      }
    }
  }
};

// ── PARTY BONUS HOOKS INTO COMBAT ───────────────────────────────
GameEngine.prototype.getPartyBonus = function() {
  const p = this.state.party;
  if (!p?.active || !p.raidActive) return { hpMult:1, dmgMult:1, size:1 };
  const size = p.members.length + p.npcMembers.filter(n => {
    const ms = p.memberStatus[n.id];
    return !ms || ms.alive;
  }).length;
  const bonus = GAME_DATA.partySystem.raidBonuses[Math.min(size, 4)] || { hpMult:1, dmgMult:1 };
  return { ...bonus, size };
};

// Hook into playerAttack to apply party damage bonus
const _origPlayerAttack = GameEngine.prototype.playerAttack;
GameEngine.prototype.playerAttack = function(monster) {
  // Temporarily store party bonus for use inside the attack
  this._partyDmgMult = this.getPartyBonus().dmgMult;
  return _origPlayerAttack.call(this, monster);
};

// Hook into the main tick to run party member simulation
const _origEmitParty = GameEngine.prototype.emit;
GameEngine.prototype.emit = function(event, data) {
  _origEmitParty.call(this, event, data);
  if (event === 'tick' && this.state.party?.raidActive) {
    this.tickPartyMembers(0.6);
  }
};

// ── REAL-TIME LISTENER MANAGEMENT ────────────────────────────────
GameEngine.prototype._startPartyListeners = function() {
  const p = this.state.party;
  if (!p?.active || !p.id) return;

  // Firestore listener: party document changes (members join/leave, ready status, raid target)
  online.startPartyListener(p.id, (data) => {
    if (!this.state.party?.active) return;
    // Merge remote members with local state (keep NPCs local)
    if (data.members) this.state.party.members = data.members;
    if (data.raidTarget !== undefined) this.state.party.raidTarget = data.raidTarget;
    if (data.raidActive !== undefined) this.state.party.raidActive = data.raidActive;
    if (data.leaderName) this.state.party.leader = data.leaderName;
    this.emit('partyUpdate', this.state.party);
  });

  // RTDB listener: real-time party chat
  online.startPartyChatListener(p.id, (msgs) => {
    if (!this.state.party?.active) return;
    this.state.party.chat = msgs.map(m => ({ sender:m.name||'System', text:m.text, time:m.timestamp }));
    this.emit('partyChat', this.state.party.chat);
  });
};

GameEngine.prototype._stopPartyListeners = function() {
  online.stopPartyListener();
  online.stopPartyChatListener();
};

// ── FIREBASE SYNC ───────────────────────────────────────────────
GameEngine.prototype._syncPartyToFirebase = function() {
  const p = this.state.party;
  if (!p?.active || !p.id || !online?.isOnline) return;
  online.syncPartyState(p.id, {
    name:p.name, leader:online.user?.uid, leaderName:p.leader,
    members:p.members.filter(m=>m.isPlayer),
    raidTarget:p.raidTarget, raidActive:p.raidActive||false,
    createdAt:Date.now(), status:'open',
  });
};

// ── JOIN / LEAVE / INVITE ───────────────────────────────────────
GameEngine.prototype.joinParty = function(partyId) {
  this.initPartySystem();
  if (this.state.party.active) { this.emit('notification',{type:'warn',text:'Leave current party first.'}); return; }
  if (!online?.isOnline || !online?.user) { this.emit('notification',{type:'warn',text:'Must be logged in.'}); return; }
  this._joinPartyFromFirebase(partyId);
};

GameEngine.prototype._joinPartyFromFirebase = async function(partyId) {
  try {
    const doc = await online.firestore.collection('parties').doc(partyId).get();
    if (!doc.exists) { this.emit('notification',{type:'warn',text:'Party not found.'}); return; }
    const data = doc.data();
    if ((data.members?.length||0) >= GAME_DATA.partySystem.maxSize) { this.emit('notification',{type:'warn',text:'Party is full.'}); return; }
    const me = { id:online.user.uid, name:this.state.playerName||online.displayName||'Player', combatLevel:this.getCombatLevel(), role:'member', ready:false, isPlayer:true };
    const members = [...(data.members||[]), me];
    await online.firestore.collection('parties').doc(partyId).update({ members });
    this.state.party = {
      active:true, id:partyId, name:data.name, leader:data.leaderName,
      members, npcMembers:[], raidTarget:data.raidTarget,
      readyCheck:false, allReady:false, raidActive:data.raidActive||false, raidStarted:false,
      chat:[], memberStatus:{}, totalPartyDmg:0,
    };
    this._startPartyListeners();
    online.sendPartyChat(partyId, `${me.name} joined the party.`);
    this.emit('notification',{type:'success',text:`Joined "${data.name}"!`});
  } catch(e) { this.emit('notification',{type:'danger',text:'Join failed: '+e.message}); }
};

GameEngine.prototype.leaveParty = function() {
  if (!this.state.party?.active) return;
  const p = this.state.party;
  const name = p.name;
  // Remove self from Firebase party doc
  if (online?.isOnline && online?.user && p.id) {
    const remaining = p.members.filter(m => m.id !== online.user.uid);
    if (remaining.length === 0) {
      // Last member — delete party
      online.firestore?.collection('parties').doc(p.id).delete().catch(()=>{});
    } else {
      online.firestore?.collection('parties').doc(p.id).update({ members:remaining }).catch(()=>{});
    }
    online.sendPartyChat(p.id, `${this.state.playerName||'Player'} left the party.`);
  }
  this._stopPartyListeners();
  this.state.party = { active:false, id:null, name:null, leader:null, members:[], npcMembers:[], raidTarget:null, readyCheck:false, allReady:false, raidActive:false, raidStarted:false, chat:[], memberStatus:{}, totalPartyDmg:0 };
  this.emit('notification',{type:'info',text:`Left party "${name}".`});
};

GameEngine.prototype.inviteToParty = function(playerName) {
  if (!this.state.party?.active) { this.emit('notification',{type:'warn',text:'Create a party first.'}); return; }
  const total = this.state.party.members.length + this.state.party.npcMembers.length;
  if (total >= GAME_DATA.partySystem.maxSize) { this.emit('notification',{type:'warn',text:'Party full (4).'}); return; }
  this._sendPartyInvite(playerName);
};

GameEngine.prototype._sendPartyInvite = async function(playerName) {
  try {
    if (!online?.firestore || !online?.user) return;
    const results = await online.searchPlayersForParty(playerName);
    const exact = results.find(r => r.name.toLowerCase() === playerName.toLowerCase()) || results[0];
    if (!exact) { this.emit('notification',{type:'warn',text:`"${playerName}" not found.`}); return; }
    await online.firestore.collection('inbox').add({
      to:exact.uid, from:online.user.uid, fromName:this.state.playerName||online.displayName||'Player',
      type:'party_invite', partyId:this.state.party.id, partyName:this.state.party.name,
      timestamp:Date.now(), read:false,
    });
    online.sendPartyChat(this.state.party.id, `Invite sent to ${exact.name}`);
    this.emit('notification',{type:'success',text:`Invite sent to ${exact.name}!`});
  } catch(e) { this.emit('notification',{type:'warn',text:'Invite failed: '+e.message}); }
};

// ── PARTY CHAT (uses RTDB real-time) ────────────────────────────
GameEngine.prototype.partyChat = function(msg) {
  const p = this.state.party;
  if (!p?.active || !msg || !p.id) return;
  online.sendPartyChat(p.id, msg);
};

// ── RAID TARGET + SYNC ──────────────────────────────────────────
GameEngine.prototype.setRaidTarget = function(targetId) {
  const p = this.state.party;
  if (!p?.active) return;
  const target = GAME_DATA.partySystem.raidTargets.find(t => t.id === targetId);
  if (!target) return;
  if (this.getCombatLevel() < target.levelReq) { this.emit('notification',{type:'warn',text:`Requires combat level ${target.levelReq}.`}); return; }
  p.raidTarget = targetId;
  this._syncPartyToFirebase();
  online.sendPartyChat(p.id, `Raid target set: ${target.name}`);
  this.emit('notification',{type:'info',text:`Target: ${target.name}`});
};

GameEngine.prototype.findRaidGroup = async function() {
  return await online.findOpenParties();
};

// ── PARTY PAGE UI ───────────────────────────────────────────────
UI.prototype.renderPartyPage = function(el) {
  try {
  const s = this.engine.state;
  this.engine.initPartySystem();
  const p = s.party;
  const cl = this.engine.getCombatLevel();
  const isOnline = online?.isOnline && online?.user;
  let html = this.header('Party System','combat','Form a party with players or NPC companions. Tackle raids together.',null);

  if (!isOnline) {
    html += `<div class="toa-locked"><div class="toa-lock-title">Login Required</div><div class="toa-lock-desc">You must be logged in to use the Party System. Go to Account to sign in.</div></div>`;
    el.innerHTML = html; return;
  }

  if (!p.active) {
    // ── CREATE / JOIN ───────────────────────────────────
    html += `<div class="party-create-section">
      <div class="party-create-title">Create a Party</div>
      <div class="party-create-form"><input type="text" id="partyNameInput" class="input-field" placeholder="Party name..." maxlength="24" /><button class="btn btn-sm" onclick="game.createParty(document.getElementById('partyNameInput').value)">Create</button></div>
      <div class="party-divider">— or join via ID —</div>
      <div class="party-create-form"><input type="text" id="partyCodeInput" class="input-field" placeholder="Party ID..." /><button class="btn btn-sm" onclick="game.joinParty(document.getElementById('partyCodeInput').value)">Join</button></div>
    </div>`;

    // ── PLAYER SEARCH ───────────────────────────────────
    html += `<div class="party-create-section">
      <div class="party-create-title">Search Players</div>
      <div class="party-create-form"><input type="text" id="playerSearchInput" class="input-field" placeholder="Search by name (min 2 chars)..." oninput="ui._debouncePlayerSearch(this.value)" /><button class="btn btn-xs" onclick="ui._doPlayerSearch(document.getElementById('playerSearchInput').value)">Search</button></div>
      <div id="playerSearchResults" class="party-search-results"></div>
    </div>`;

    html += `<div class="party-bonuses-info"><div class="party-create-title">Party Raid Bonuses</div>
      <div class="party-bonus-row"><span>2 Members</span><span>Boss HP ×0.85, Your Damage +8%</span></div>
      <div class="party-bonus-row"><span>3 Members</span><span>Boss HP ×0.70, Your Damage +12%</span></div>
      <div class="party-bonus-row"><span>4 Members</span><span>Boss HP ×0.60, Your Damage +18%</span></div>
    </div>`;

    // NPC companions
    html += `<div class="ce-section-title">NPC Companions</div><p style="color:var(--text-dim);font-size:12px;margin-bottom:8px">Create a party first, then hire NPC companions to fill empty slots.</p>`;
    for (const npc of GAME_DATA.npcCompanions) {
      const locked = cl < npc.unlockLevel;
      html += `<div class="ce-boss-card ${locked?'locked':''}"><div class="ce-bc-info"><div class="ce-bc-name">${npc.name}</div><div class="ce-bc-stats">Cb Lv${npc.combatLevel} · ${npc.style} · ${npc.dps} DPS · ${npc.hp} HP${npc.heals?' · Healer':''}</div><div class="ce-bc-desc">${npc.desc}</div><div class="ce-bc-set">Unlock: Combat Level ${npc.unlockLevel} ${locked?`(You: ${cl})`:' ✓'}</div></div>${locked?'<div class="locked-overlay">Lv '+npc.unlockLevel+'</div>':''}</div>`;
    }

    // Raid Group Finder
    html += `<div class="party-finder-section"><div class="party-create-title">Open Raid Groups</div><button class="btn btn-xs" onclick="ui._loadOpenGroups()">Refresh</button><div id="raidFinderResults" style="margin-top:8px"></div></div>`;
  } else {
    // ── ACTIVE PARTY (with live data) ───────────────────
    const totalSize = p.members.length + p.npcMembers.length;
    const bonus = this.engine.getPartyBonus();
    html += `<div class="party-active-section">
      <div class="party-header-row"><div class="party-name-display">${p.name}</div><div class="party-id-display">ID: <code onclick="navigator.clipboard?.writeText('${p.id}');game.emit('notification',{type:'info',text:'Party ID copied!'})" style="cursor:pointer" title="Click to copy">${p.id?.substring(0,20)}...</code></div></div>`;

    // Members (real players from Firebase)
    html += `<div class="party-create-title">Players (${p.members.length})</div>`;
    for (const m of p.members) {
      const isSelf = m.id === online?.user?.uid;
      html += `<div class="party-member-row"><span class="party-member-name">${m.name} ${m.role==='leader'?'<span style="color:var(--amber)">Leader</span>':''} ${isSelf?'<span style="color:#4aaa50">(You)</span>':''}</span><span class="party-member-level">Cb ${m.combatLevel} ${m.ready?'<span style="color:#4aaa50">Ready</span>':''}</span></div>`;
    }

    // NPC members
    if (p.npcMembers.length) {
      html += `<div class="party-create-title">Companions (${p.npcMembers.length})</div>`;
      for (const n of p.npcMembers) {
        const ms = p.memberStatus[n.id];
        const alive = !ms || ms.alive;
        html += `<div class="party-member-row"><span class="party-member-name">${n.name} <span style="color:var(--text-dim);font-size:10px">${n.style}${n.heals?' · Healer':''} · ${n.dps} DPS</span></span><span class="party-member-level">${alive?(ms?`${ms.hp}/${ms.maxHp} HP`:'Ready'):'<span style="color:#cc4444">Fallen</span>'} <button class="btn btn-xs" style="padding:1px 6px;font-size:10px" onclick="game.removeNpcCompanion('${n.id}')">×</button></span></div>`;
      }
    }

    // Hire NPCs + invite
    if (totalSize < 4) {
      html += `<div class="ce-section-title">Add Members (${totalSize}/4)</div>`;
      html += `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">`;
      for (const npc of GAME_DATA.npcCompanions) {
        const locked = cl < npc.unlockLevel;
        const already = p.npcMembers.find(n=>n.id===npc.id);
        if (!locked && !already) html += `<button class="btn btn-xs" onclick="game.addNpcCompanion('${npc.id}')" title="${npc.desc}">${npc.name}</button>`;
      }
      html += `</div>`;
      html += `<div class="party-create-title">Invite Player</div>
        <div class="party-create-form"><input type="text" id="partyInviteSearch" class="input-field" placeholder="Search player name..." oninput="ui._debouncePartyInviteSearch(this.value)" /><button class="btn btn-xs" onclick="game.inviteToParty(document.getElementById('partyInviteSearch').value)">Invite</button></div>
        <div id="partyInviteResults" class="party-search-results"></div>`;
    }

    // Raid target
    html += `<div class="ce-section-title">Raid Target</div><div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">`;
    for (const t of GAME_DATA.partySystem.raidTargets) {
      const sel = p.raidTarget === t.id;
      const tLocked = cl < t.levelReq;
      html += `<button class="btn btn-xs ${sel?'btn-active':''}" ${tLocked?'disabled':''} onclick="game.setRaidTarget('${t.id}')">${t.name}${tLocked?' (Lv'+t.levelReq+')':''}</button>`;
    }
    html += `</div>`;

    // Status + launch
    if (p.raidTarget) {
      const targetName = GAME_DATA.partySystem.raidTargets.find(t=>t.id===p.raidTarget)?.name || p.raidTarget;
      html += `<div class="party-bonuses-info" style="margin-bottom:12px">
        <div class="party-bonus-row"><span>Target</span><span>${targetName}</span></div>
        <div class="party-bonus-row"><span>Party Size</span><span>${totalSize}</span></div>
        <div class="party-bonus-row"><span>Boss HP Mult</span><span>×${bonus.hpMult.toFixed(2)}</span></div>
        <div class="party-bonus-row"><span>Damage Bonus</span><span>+${Math.round((bonus.dmgMult-1)*100)}%</span></div>
      </div>`;
      html += `<button class="btn btn-lg toa-enter-btn" onclick="game.launchPartyRaid()">Launch Raid</button>`;
    }

    // NPC raid status
    if (p.raidActive && Object.keys(p.memberStatus).length > 0) {
      html += `<div class="ce-section-title">Raid Status</div>`;
      for (const [id, ms] of Object.entries(p.memberStatus)) {
        html += `<div class="party-member-row"><span class="party-member-name">${ms.name}</span><span style="font-size:11px">${ms.alive?`<span style="color:#4aaa50">${ms.hp}/${ms.maxHp}</span> · ${ms.totalDmg.toLocaleString()} dmg`:'<span style="color:#cc4444">Fallen</span>'}</span></div>`;
      }
      html += `<div class="party-bonus-row" style="margin-top:4px"><span>Total NPC Damage</span><span>${p.totalPartyDmg.toLocaleString()}</span></div>`;
    }

    // Real-time chat (from RTDB)
    html += `<div class="party-chat-section"><div class="party-create-title">Party Chat <span style="color:var(--text-dim);font-size:10px">Live</span></div>
      <div class="party-chat-log" id="partyChatLog">${(p.chat||[]).slice(-30).map(msg=>`<div class="party-chat-msg"><span class="party-chat-sender">${msg.sender}:</span> <span class="party-chat-text">${msg.text}</span></div>`).join('')}</div>
      <div class="party-chat-input-row">
        <input type="text" id="partyChatInput" class="input-field" placeholder="Message..." maxlength="200" onkeypress="if(event.key==='Enter'){game.partyChat(this.value);this.value='';}" />
        <button class="btn btn-xs" onclick="const i=document.getElementById('partyChatInput');game.partyChat(i.value);i.value='';">Send</button>
      </div>
    </div>`;

    html += `<button class="btn btn-sm btn-danger" style="margin-top:12px" onclick="game.leaveParty()">Leave Party</button>`;
    html += `</div>`;
  }
  el.innerHTML = html;

  // Auto-scroll chat
  const chatLog = document.getElementById('partyChatLog');
  if (chatLog) chatLog.scrollTop = chatLog.scrollHeight;

  } catch(e) { el.innerHTML = `<div class="bank-empty" style="color:#cc6666">Party page error: ${e.message}<br><small>${e.stack?.split('\\n')[1]||''}</small></div>`; console.error('[Party UI]', e); }
};

// ── PLAYER SEARCH (debounced) ───────────────────────────────────
UI.prototype._debouncePlayerSearch = function(query) {
  clearTimeout(this._playerSearchTimer);
  this._playerSearchTimer = setTimeout(() => this._doPlayerSearch(query), 400);
};
UI.prototype._doPlayerSearch = async function(query) {
  const container = document.getElementById('playerSearchResults');
  if (!container) return;
  if (!query || query.length < 2) { container.innerHTML = ''; return; }
  container.innerHTML = '<div style="color:var(--text-dim);font-size:12px;padding:8px">Searching...</div>';
  const results = await online.searchPlayersForParty(query);
  if (!results.length) { container.innerHTML = '<div style="color:var(--text-dim);font-size:12px;padding:8px">No players found.</div>'; return; }
  container.innerHTML = results.map(r => `<div class="party-search-row">
    <span class="party-search-name">${r.name}</span>
    <span class="party-search-info">Cb ${r.combatLevel} · Total ${r.totalLevel} ${r.online?'<span style="color:#4aaa50">Online</span>':'<span style="color:var(--text-dim)">Offline</span>'}</span>
    <button class="btn btn-xs" onclick="game.inviteToParty('${r.name}')">Invite</button>
  </div>`).join('');
};

// ── PARTY INVITE SEARCH (debounced) ─────────────────────────────
UI.prototype._debouncePartyInviteSearch = function(query) {
  clearTimeout(this._partyInviteTimer);
  this._partyInviteTimer = setTimeout(() => this._doPartyInviteSearch(query), 400);
};
UI.prototype._doPartyInviteSearch = async function(query) {
  const container = document.getElementById('partyInviteResults');
  if (!container) return;
  if (!query || query.length < 2) { container.innerHTML = ''; return; }
  container.innerHTML = '<div style="color:var(--text-dim);font-size:12px;padding:4px">Searching...</div>';
  const results = await online.searchPlayersForParty(query);
  if (!results.length) { container.innerHTML = '<div style="color:var(--text-dim);font-size:12px;padding:4px">No players found.</div>'; return; }
  container.innerHTML = results.slice(0,8).map(r => `<div class="party-search-row">
    <span class="party-search-name">${r.name}</span>
    <span class="party-search-info">Cb ${r.combatLevel} ${r.online?'<span style="color:#4aaa50">●</span>':'<span style="color:#666">●</span>'}</span>
    <button class="btn btn-xs" onclick="game.inviteToParty('${r.name}')">Invite</button>
  </div>`).join('');
};

// ── OPEN GROUPS FINDER ──────────────────────────────────────────
UI.prototype._loadOpenGroups = async function() {
  const container = document.getElementById('raidFinderResults');
  if (!container) return;
  container.innerHTML = '<div style="color:var(--text-dim);font-size:12px;padding:8px">Loading...</div>';
  const groups = await online.findOpenParties();
  if (!groups.length) { container.innerHTML = '<div class="party-finder-empty">No open groups found. Create your own!</div>'; return; }
  container.innerHTML = groups.map(g => {
    const targetName = GAME_DATA.partySystem.raidTargets.find(t=>t.id===g.raidTarget)?.name || g.raidTarget || 'No target';
    return `<div class="party-finder-result"><span>${g.name}</span><span>${g.leader}</span><span>${g.members}/${g.maxSize}</span><span style="color:var(--text-dim);font-size:11px">${targetName}</span><button class="btn btn-xs" onclick="game.joinParty('${g.id}')">Join</button></div>`;
  }).join('');
};

// ── COMBAT HOOKS — apply party bonuses to actual combat ─────────
// Hook _setupCombat to reduce boss HP when in party raid
const _origSetupCombat = GameEngine.prototype._setupCombat;
GameEngine.prototype._setupCombat = function(monster, monsterId) {
  _origSetupCombat.call(this, monster, monsterId);
  const bonus = this.getPartyBonus();
  if (bonus.size > 1 && this.state.party?.raidActive) {
    this.state.combat.monsterHp = Math.floor(this.state.combat.monsterHp * bonus.hpMult);
    this.state.party.chat.push({sender:'System',text:`Boss HP scaled to ${Math.round(bonus.hpMult*100)}% (${bonus.size} members)`,time:Date.now()});
  }
};

// Hook getStatTotal to boost damage stats when in party raid
const _origGetStatTotal = GameEngine.prototype.getStatTotal;
GameEngine.prototype.getStatTotal = function(stat) {
  let val = _origGetStatTotal.call(this, stat);
  if (this.state.party?.raidActive && (stat === 'strengthBonus' || stat === 'rangedBonus' || stat === 'magicBonus')) {
    const bonus = this.getPartyBonus();
    if (bonus.dmgMult > 1) val = Math.floor(val * bonus.dmgMult);
  }
  return val;
};

console.log('[Ashfall] Party System v2 loaded — NPC companions:', GAME_DATA.npcCompanions.length);
console.log('[Ashfall] Dungeons Expanded + Party System: Complete.');
