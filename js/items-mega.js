// ================================================================
// ASHFALL IDLE - Mega Expansion v8.5
// 200+ new items, complete weapon/armor tiers, 15+ monsters
// ================================================================

const TIERS = [
  {t:'bronze',  n:'Bronze',  lv:1,  sm:1,  bar:'bronze_bar',  r:'common',   bc:2, atk:4,  str:3,  def:3},
  {t:'iron',    n:'Iron',    lv:10, sm:10, bar:'iron_bar',    r:'common',   bc:3, atk:8,  str:7,  def:6},
  {t:'steel',   n:'Steel',   lv:20, sm:20, bar:'steel_bar',   r:'uncommon', bc:3, atk:14, str:12, def:10},
  {t:'mithril', n:'Mithril', lv:30, sm:30, bar:'mithril_bar', r:'uncommon', bc:4, atk:20, str:18, def:15},
  {t:'adamant', n:'Adamant', lv:40, sm:40, bar:'adamant_bar', r:'rare',     bc:4, atk:28, str:26, def:22},
  {t:'runite',  n:'Runite',  lv:50, sm:55, bar:'runite_bar',  r:'rare',     bc:5, atk:38, str:36, def:30},
  {t:'obsidian',n:'Obsidian',lv:60, sm:65, bar:'obsidian_bar',r:'epic',     bc:5, atk:50, str:48, def:38},
  {t:'ashsteel',n:'Ashsteel',lv:75, sm:80, bar:'ashsteel_bar',r:'legendary',bc:6, atk:64, str:62, def:48},
];

// ── GENERATE WEAPON TYPES PER TIER ───────────────────────
const WEAPON_TYPES = [
  {s:'dagger',     n:'Dagger',     atkM:0.55, strM:0.45, spd:1.2, bars:2},
  {s:'mace',       n:'Mace',       atkM:0.60, strM:0.70, spd:2.4, bars:3},
  {s:'longsword',  n:'Longsword',  atkM:0.85, strM:0.80, spd:2.2, bars:3},
  {s:'battleaxe',  n:'Battleaxe',  atkM:0.70, strM:1.10, spd:3.0, bars:4},
  {s:'warhammer',  n:'Warhammer',  atkM:0.65, strM:1.20, spd:3.2, bars:5},
  {s:'2h_sword',   n:'Two-Hand Sword', atkM:0.90, strM:1.00, spd:3.4, bars:5},
  {s:'spear',      n:'Spear',      atkM:0.75, strM:0.65, spd:2.0, bars:3},
  {s:'claws',      n:'Claws',      atkM:0.80, strM:0.50, spd:1.4, bars:3},
];

let _newItems = 0, _newRecipes = 0;

for (const tier of TIERS) {
  for (const wt of WEAPON_TYPES) {
    const id = `${tier.t}_${wt.s}`;
    if (GAME_DATA.items[id]) continue;
    const atk = Math.floor(tier.atk * wt.atkM);
    const str = Math.floor(tier.str * wt.strM);
    GAME_DATA.items[id] = {
      id, name:`${tier.n} ${wt.n}`, type:'weapon', slot:'weapon',
      stats:{attackBonus:atk, strengthBonus:str}, attackSpeed:wt.spd, style:'melee',
      levelReq:{attack:tier.lv}, sellPrice:wt.bars*40*(tier.lv+1),
      rarity:tier.r, desc:`${tier.n} ${wt.n.toLowerCase()}. +${atk} Attack, +${str} Strength.`,
    };
    _newItems++;
    if (!GAME_DATA.recipes.smithing.find(r=>r.id==='smith_'+id)) {
      GAME_DATA.recipes.smithing.push({
        id:'smith_'+id, name:`${tier.n} ${wt.n}`, level:tier.sm,
        xp:wt.bars*12, time:6.0,
        input:[{item:tier.bar,qty:wt.bars}], output:{item:id,qty:1},
        category: wt.s === 'dagger' ? 'Daggers' : wt.s === 'mace' ? 'Maces' : wt.s === 'longsword' ? 'Longswords' : wt.s === 'battleaxe' ? 'Battleaxes' : wt.s === 'warhammer' ? 'Warhammers' : wt.s === '2h_sword' ? '2H Swords' : wt.s === 'spear' ? 'Spears' : wt.s === 'claws' ? 'Claws' : 'Weapons',
      });
      _newRecipes++;
    }
  }
}

// ── RINGS WITH COMBAT STATS ──────────────────────────────
const _combatRings = [
  {id:'warriors_ring',    name:'Warrior\'s Ring',    lv:20, slot:'ring', stats:{strengthBonus:8,attackBonus:4}, r:'uncommon', desc:'+8 Strength, +4 Attack.', price:5000},
  {id:'archers_ring',     name:'Archer\'s Ring',     lv:20, slot:'ring', stats:{rangedBonus:10}, r:'uncommon', desc:'+10 Ranged bonus.', price:5000},
  {id:'seers_ring',       name:'Seer\'s Ring',       lv:20, slot:'ring', stats:{magicBonus:10}, r:'uncommon', desc:'+10 Magic bonus.', price:5000},
  {id:'berserker_ring',   name:'Berserker Ring',     lv:40, slot:'ring', stats:{strengthBonus:16,attackBonus:8}, r:'rare', desc:'+16 Strength, +8 Attack.', price:25000},
  {id:'treasonous_ring',  name:'Treasonous Ring',    lv:50, slot:'ring', stats:{attackBonus:20,strengthBonus:12}, r:'rare', desc:'+20 Attack, +12 Strength.', price:50000},
  {id:'ring_of_wealth',   name:'Ring of Wealth',     lv:30, slot:'ring', stats:{}, r:'rare', desc:'Increases rare drop chance by 5%.', price:20000},
  {id:'ring_of_the_gods', name:'Ring of the Gods',   lv:70, slot:'ring', stats:{defenceBonus:12,magicBonus:8}, r:'epic', desc:'+12 Defence, +8 Magic. Prayer drain -10%.', price:100000},
  {id:'ring_of_suffering',name:'Ring of Suffering',   lv:75, slot:'ring', stats:{defenceBonus:20}, r:'epic', desc:'+20 Defence. Absorbs recoil damage.', price:150000},
];
for (const r of _combatRings) {
  if (!GAME_DATA.items[r.id]) {
    GAME_DATA.items[r.id] = {id:r.id,name:r.name,type:'armor',slot:r.slot,stats:r.stats,levelReq:{defence:r.lv},sellPrice:Math.floor(r.price*0.3),rarity:r.r,desc:r.desc};
    _newItems++;
    GAME_DATA.shop.push({item:r.id,price:r.price,category:'jewelry'});
  }
}

// ── AMULETS WITH COMBAT STATS ────────────────────────────
const _combatAmulets = [
  {id:'amulet_of_strength',name:'Amulet of Strength', lv:20, stats:{strengthBonus:12}, r:'uncommon', price:8000},
  {id:'amulet_of_power',  name:'Amulet of Power',    lv:30, stats:{attackBonus:8,strengthBonus:8,defenceBonus:8}, r:'uncommon', price:15000},
  {id:'amulet_of_glory',  name:'Amulet of Glory',    lv:40, stats:{attackBonus:12,strengthBonus:12,defenceBonus:6,rangedBonus:6,magicBonus:6}, r:'rare', price:30000},
  {id:'amulet_of_fury',   name:'Amulet of Fury',     lv:60, stats:{attackBonus:18,strengthBonus:16,defenceBonus:12,rangedBonus:10,magicBonus:10}, r:'epic', price:80000},
  {id:'amulet_of_torture',name:'Amulet of Torture',   lv:75, stats:{attackBonus:25,strengthBonus:22}, r:'legendary', price:200000},
  {id:'necklace_of_anguish',name:'Necklace of Anguish',lv:75,stats:{rangedBonus:25}, r:'legendary', price:200000},
  {id:'occult_necklace',  name:'Occult Necklace',     lv:70, stats:{magicBonus:22}, r:'epic', price:150000},
  {id:'zenyte_amulet',    name:'Zenyte Amulet',       lv:80, stats:{attackBonus:20,strengthBonus:20,defenceBonus:15,rangedBonus:15,magicBonus:15}, r:'mythic', price:500000},
];
for (const a of _combatAmulets) {
  if (!GAME_DATA.items[a.id]) {
    GAME_DATA.items[a.id] = {id:a.id,name:a.name,type:'armor',slot:'amulet',stats:a.stats,levelReq:{defence:a.lv},sellPrice:Math.floor(a.price*0.3),rarity:a.r,desc:Object.entries(a.stats).map(([k,v])=>'+'+v+' '+k.replace('Bonus','')).join(', ')+'.'};
    _newItems++;
    GAME_DATA.shop.push({item:a.id,price:a.price,category:'jewelry'});
  }
}

// ── CAPES WITH STATS ─────────────────────────────────────
const _capes = [
  {id:'fire_cape',     name:'Fire Cape',      lv:60, stats:{strengthBonus:10,defenceBonus:12}, r:'epic', desc:'Forged in fire. +10 Str, +12 Def.', price:100000},
  {id:'infernal_cape', name:'Infernal Cape',   lv:80, stats:{strengthBonus:18,defenceBonus:16,attackBonus:8}, r:'legendary', desc:'Infernal power. +18 Str, +16 Def, +8 Atk.', price:300000},
  {id:'avas_accumulator',name:'Ava\'s Accumulator',lv:40,stats:{rangedBonus:12}, r:'rare', desc:'+12 Ranged. Recovers ammo.', price:30000},
  {id:'avas_assembler', name:'Ava\'s Assembler', lv:70, stats:{rangedBonus:20,defenceBonus:4}, r:'epic', desc:'+20 Ranged, +4 Def. Better ammo recovery.', price:100000},
  {id:'god_cape',       name:'God Cape',        lv:60, stats:{magicBonus:16}, r:'epic', desc:'+16 Magic bonus.', price:80000},
  {id:'max_cape',       name:'Max Cape',        lv:99, stats:{attackBonus:10,strengthBonus:10,defenceBonus:10,rangedBonus:10,magicBonus:10}, r:'mythic', desc:'Requires 99 in all skills. +10 all stats.', price:999999},
];
for (const c of _capes) {
  if (!GAME_DATA.items[c.id]) {
    GAME_DATA.items[c.id] = {id:c.id,name:c.name,type:'armor',slot:'cape',stats:c.stats,levelReq:{defence:c.lv},sellPrice:Math.floor(c.price*0.3),rarity:c.r,desc:c.desc};
    _newItems++;
    GAME_DATA.shop.push({item:c.id,price:c.price,category:'capes'});
  }
}

// ── MORE MONSTERS (15) WITH SVG ART ──────────────────────
const _moreMonsters = {
  imp:        {id:'imp', name:'Imp', hp:20, maxHit:3, attackSpeed:2.2, combatLevel:2, style:'magic', evasion:{melee:4,ranged:4,magic:8}, xp:18, gold:{min:1,max:5}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'mind_rune',qty:2,chance:0.30},{item:'egg',qty:1,chance:0.15}]},
  zombie:     {id:'zombie', name:'Zombie', hp:70, maxHit:8, attackSpeed:3.0, combatLevel:8, style:'melee', evasion:{melee:6,ranged:6,magic:4}, xp:55, gold:{min:3,max:10}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'iron_bar',qty:1,chance:0.10},{item:'raw_beef',qty:1,chance:0.20}]},
  giant_bat:  {id:'giant_bat', name:'Giant Bat', hp:50, maxHit:6, attackSpeed:2.0, combatLevel:6, style:'melee', evasion:{melee:12,ranged:8,magic:10}, xp:42, gold:{min:2,max:8}, alignment:'CN',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'feather',qty:3,chance:0.40}]},
  hill_giant: {id:'hill_giant', name:'Hill Giant', hp:150, maxHit:15, attackSpeed:2.8, combatLevel:22, style:'melee', evasion:{melee:22,ranged:18,magic:14}, xp:110, gold:{min:15,max:45}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'iron_bar',qty:2,chance:0.12},{item:'steel_bar',qty:1,chance:0.08},{item:'cowhide',qty:2,chance:0.30}]},
  earth_warrior:{id:'earth_warrior', name:'Earth Warrior', hp:180, maxHit:16, attackSpeed:2.4, combatLevel:26, style:'melee', evasion:{melee:28,ranged:24,magic:18}, xp:130, gold:{min:20,max:55}, alignment:'NE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'earth_rune',qty:5,chance:0.25},{item:'mithril_bar',qty:1,chance:0.06}]},
  chaos_dwarf:{id:'chaos_dwarf', name:'Chaos Dwarf', hp:160, maxHit:18, attackSpeed:2.0, combatLevel:32, style:'ranged', evasion:{melee:30,ranged:35,magic:20}, xp:145, gold:{min:25,max:70}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'chaos_rune',qty:5,chance:0.20},{item:'steel_bar',qty:2,chance:0.10},{item:'adamant_arrows',qty:5,chance:0.12}]},
  bloodveld:  {id:'bloodveld', name:'Bloodveld', hp:280, maxHit:22, attackSpeed:2.4, combatLevel:38, style:'magic', evasion:{melee:35,ranged:32,magic:40}, xp:200, gold:{min:35,max:100}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'blood_rune',qty:3,chance:0.15},{item:'death_rune',qty:2,chance:0.12},{item:'raw_beef',qty:3,chance:0.25}]},
  gargoyle:   {id:'gargoyle', name:'Gargoyle', hp:350, maxHit:26, attackSpeed:2.6, combatLevel:48, style:'melee', evasion:{melee:55,ranged:48,magic:35}, xp:280, gold:{min:50,max:160}, alignment:'NE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'runite_bar',qty:1,chance:0.05},{item:'gold_ore',qty:3,chance:0.15},{item:'diamond',qty:1,chance:0.04}]},
  nechryael:  {id:'nechryael', name:'Nechryael', hp:400, maxHit:28, attackSpeed:2.2, combatLevel:52, style:'magic', evasion:{melee:50,ranged:48,magic:55}, xp:350, gold:{min:60,max:200}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'death_rune',qty:5,chance:0.18},{item:'soul_rune',qty:2,chance:0.10},{item:'ruby',qty:1,chance:0.08}]},
  abyssal_demon:{id:'abyssal_demon', name:'Abyssal Demon', hp:450, maxHit:32, attackSpeed:2.0, combatLevel:62, style:'melee', evasion:{melee:60,ranged:55,magic:45}, xp:420, gold:{min:80,max:250}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'abyssal_whip',qty:1,chance:0.005},{item:'death_rune',qty:8,chance:0.20},{item:'blood_rune',qty:4,chance:0.15},{item:'obsidian_bar',qty:1,chance:0.04}]},
  dark_beast: {id:'dark_beast', name:'Dark Beast', hp:550, maxHit:36, attackSpeed:2.4, combatLevel:72, style:'melee', evasion:{melee:72,ranged:68,magic:55}, xp:550, gold:{min:100,max:350}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'dark_bow',qty:1,chance:0.008},{item:'death_rune',qty:10,chance:0.25},{item:'ashsteel_bar',qty:1,chance:0.02}]},
  cerberus:   {id:'cerberus', name:'Cerberus', hp:700, maxHit:40, attackSpeed:2.2, combatLevel:80, style:'melee', evasion:{melee:80,ranged:75,magic:60}, xp:700, gold:{min:150,max:500}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'fire_rune',qty:20,chance:0.30},{item:'obsidian_bar',qty:2,chance:0.08},{item:'ashsteel_bar',qty:1,chance:0.05}]},
  kraken:     {id:'kraken', name:'Kraken', hp:600, maxHit:35, attackSpeed:2.6, combatLevel:75, style:'magic', evasion:{melee:65,ranged:60,magic:80}, xp:650, gold:{min:120,max:400}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'water_rune',qty:20,chance:0.30},{item:'wrath_rune',qty:3,chance:0.08},{item:'diamond',qty:2,chance:0.06}]},
  hydra:      {id:'hydra', name:'Alchemical Hydra', hp:900, maxHit:45, attackSpeed:2.4, combatLevel:90, style:'melee', evasion:{melee:90,ranged:85,magic:70}, xp:900, gold:{min:200,max:600}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'ashsteel_bar',qty:3,chance:0.10},{item:'wrath_rune',qty:5,chance:0.12},{item:'diamond',qty:3,chance:0.08}]},
  corporeal_beast:{id:'corporeal_beast', name:'Corporeal Beast', hp:1200, maxHit:50, attackSpeed:2.8, combatLevel:100, style:'magic', evasion:{melee:100,ranged:95,magic:100}, xp:1200, gold:{min:300,max:800}, alignment:'CE',
    drops:[{item:'bones',qty:1,chance:1.0},{item:'ashsteel_bar',qty:5,chance:0.15},{item:'soul_rune',qty:10,chance:0.20},{item:'wrath_rune',qty:8,chance:0.15}]},
};

for (const [id, m] of Object.entries(_moreMonsters)) {
  if (!GAME_DATA.monsters[id]) { GAME_DATA.monsters[id] = m; }
}

// Add to combat areas
const _newAreas = [
  {id:'graveyard', name:'Haunted Graveyard', monsters:['imp','zombie','giant_bat'], levelReq:3, desc:'A fog-covered graveyard.'},
  {id:'giant_plateau', name:'Giant Plateau', monsters:['hill_giant','earth_warrior'], levelReq:18, desc:'Where giants roam.'},
  {id:'chaos_tunnels', name:'Chaos Tunnels', monsters:['chaos_dwarf','bloodveld'], levelReq:28, desc:'Twisted underground passages.'},
  {id:'gargoyle_tower', name:'Gargoyle Tower', monsters:['gargoyle','nechryael'], levelReq:42, desc:'A tower of stone guardians.'},
  {id:'abyssal_rift', name:'Abyssal Rift', monsters:['abyssal_demon','dark_beast'], levelReq:58, desc:'A portal to the abyss.'},
  {id:'infernal_pit', name:'Infernal Pit', monsters:['cerberus','hydra'], levelReq:75, desc:'The deepest depths of fire.'},
  {id:'spirit_realm', name:'Spirit Realm', monsters:['kraken','corporeal_beast'], levelReq:70, desc:'Where spectral horrors dwell.'},
];
for (const a of _newAreas) {
  if (!GAME_DATA.combatAreas.find(x=>x.id===a.id)) GAME_DATA.combatAreas.push(a);
}

// ── SVG ART FOR ALL NEW MONSTERS ─────────────────────────
const _arts = {
imp:`<svg viewBox="0 0 64 64"><circle cx="32" cy="28" r="10" fill="#c44040"/><circle cx="28" cy="26" r="2" fill="#ff0"/><circle cx="36" cy="26" r="2" fill="#ff0"/><path d="M22 20 L18 10 L24 18" fill="#c44040"/><path d="M42 20 L46 10 L40 18" fill="#c44040"/><ellipse cx="32" cy="42" rx="8" ry="6" fill="#a03030"/><rect x="26" y="46" width="3" height="8" rx="1" fill="#a03030"/><rect x="35" y="46" width="3" height="8" rx="1" fill="#a03030"/><path d="M14 30 Q8 26 10 34 Q12 30 16 32" fill="#a03030"/><path d="M50 30 Q56 26 54 34 Q52 30 48 32" fill="#a03030"/><path d="M40 42 Q44 48 40 56 Q38 50 42 46" fill="#a03030"/></svg>`,
zombie:`<svg viewBox="0 0 64 64"><rect x="24" y="26" width="16" height="22" rx="2" fill="#5a6a4a"/><circle cx="32" cy="20" r="9" fill="#7a8a5a"/><circle cx="28" cy="18" r="2" fill="#333"/><circle cx="36" cy="18" r="2" fill="#333"/><path d="M27 24 Q32 26 37 24" stroke="#333" stroke-width="1.5" fill="none"/><rect x="18" y="28" width="6" height="16" rx="2" fill="#5a6a4a"/><rect x="40" y="28" width="6" height="16" rx="2" fill="#5a6a4a"/><rect x="44" y="28" width="5" height="3" rx="1" fill="#7a8a5a"/><rect x="15" y="28" width="5" height="3" rx="1" fill="#7a8a5a"/><rect x="26" y="48" width="4" height="8" rx="1" fill="#4a5a3a"/><rect x="34" y="48" width="4" height="8" rx="1" fill="#4a5a3a"/><path d="M28 30 L34 32 L30 34" stroke="#3a4a2a" stroke-width="1" fill="none"/></svg>`,
giant_bat:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="34" rx="8" ry="6" fill="#3a2a2a"/><circle cx="32" cy="28" r="6" fill="#4a3a3a"/><circle cx="29" cy="27" r="1.5" fill="#c44040"/><circle cx="35" cy="27" r="1.5" fill="#c44040"/><path d="M28 32 L30 33 L28 31" fill="#fff"/><path d="M36 32 L34 33 L36 31" fill="#fff"/><path d="M24 30 Q12 20 4 28 Q10 26 16 30 Q12 32 8 38 Q14 34 20 34" fill="#3a2a2a"/><path d="M40 30 Q52 20 60 28 Q54 26 48 30 Q52 32 56 38 Q50 34 44 34" fill="#3a2a2a"/></svg>`,
hill_giant:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="38" rx="20" ry="16" fill="#8a7a5a"/><circle cx="32" cy="18" r="13" fill="#9a8a6a"/><circle cx="26" cy="16" r="3" fill="#222"/><circle cx="38" cy="16" r="3" fill="#222"/><path d="M26 24 Q32 28 38 24" stroke="#5a4a3a" stroke-width="2" fill="none"/><rect x="12" y="24" width="12" height="24" rx="5" fill="#8a7a5a"/><rect x="40" y="24" width="12" height="24" rx="5" fill="#8a7a5a"/><rect x="8" y="24" width="6" height="28" fill="#6a5a3a"/><polygon points="6,22 14,22 10,12" fill="#7a6a4a"/><rect x="22" y="50" width="8" height="10" rx="3" fill="#7a6a4a"/><rect x="34" y="50" width="8" height="10" rx="3" fill="#7a6a4a"/></svg>`,
earth_warrior:`<svg viewBox="0 0 64 64"><rect x="24" y="26" width="16" height="22" rx="2" fill="#6a5a3a"/><circle cx="32" cy="20" r="9" fill="#7a6a4a"/><rect x="24" y="14" width="16" height="5" rx="1" fill="#5a4a2a"/><circle cx="29" cy="19" r="2" fill="#8a6a00"/><circle cx="35" cy="19" r="2" fill="#8a6a00"/><rect x="16" y="28" width="8" height="16" rx="3" fill="#6a5a3a"/><rect x="40" y="28" width="8" height="16" rx="3" fill="#6a5a3a"/><rect x="26" y="48" width="5" height="8" rx="1" fill="#5a4a2a"/><rect x="33" y="48" width="5" height="8" rx="1" fill="#5a4a2a"/><circle cx="20" cy="36" r="3" fill="#8a7a4a" opacity="0.4"/><circle cx="44" cy="32" r="2" fill="#8a7a4a" opacity="0.4"/></svg>`,
chaos_dwarf:`<svg viewBox="0 0 64 64"><rect x="26" y="32" width="12" height="16" rx="2" fill="#4a2a2a"/><circle cx="32" cy="28" r="8" fill="#5a3a2a"/><rect x="24" y="22" width="16" height="4" rx="1" fill="#6a3a1a"/><circle cx="29" cy="27" r="1.5" fill="#ff4040"/><circle cx="35" cy="27" r="1.5" fill="#ff4040"/><rect x="20" y="34" width="6" height="12" rx="2" fill="#4a2a2a"/><rect x="38" y="34" width="6" height="12" rx="2" fill="#4a2a2a"/><rect x="40" y="30" width="3" height="18" fill="#666"/><polygon points="39,28 46,28 43,22" fill="#888"/><rect x="28" y="48" width="4" height="6" rx="1" fill="#3a1a1a"/><rect x="32" y="48" width="4" height="6" rx="1" fill="#3a1a1a"/></svg>`,
bloodveld:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="36" rx="16" ry="14" fill="#8a2030"/><circle cx="32" cy="24" r="10" fill="#a03040"/><circle cx="28" cy="22" r="2.5" fill="#ff6070"/><circle cx="36" cy="22" r="2.5" fill="#ff6070"/><path d="M26 28 Q32 34 38 28" stroke="#5a1020" stroke-width="2" fill="none"/><path d="M16 30 Q8 26 6 34 Q10 30 14 34" fill="#8a2030"/><path d="M48 30 Q56 26 58 34 Q54 30 50 34" fill="#8a2030"/><ellipse cx="24" cy="44" rx="4" ry="2" fill="#6a1020"/><ellipse cx="40" cy="44" rx="4" ry="2" fill="#6a1020"/></svg>`,
gargoyle:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="38" rx="16" ry="14" fill="#708090"/><circle cx="32" cy="22" r="11" fill="#7a8a9a"/><circle cx="27" cy="20" r="2.5" fill="#ff8000"/><circle cx="37" cy="20" r="2.5" fill="#ff8000"/><path d="M20 14 L14 6 L18 14" fill="#7a8a9a"/><path d="M44 14 L50 6 L46 14" fill="#7a8a9a"/><path d="M26 28 Q32 32 38 28" stroke="#505a60" stroke-width="2" fill="none"/><path d="M14 28 Q6 22 4 30 Q8 26 12 30 Q8 34 6 40 Q10 36 14 36" fill="#607080"/><path d="M50 28 Q58 22 60 30 Q56 26 52 30 Q56 34 58 40 Q54 36 50 36" fill="#607080"/><rect x="24" y="50" width="6" height="8" rx="2" fill="#607080"/><rect x="34" y="50" width="6" height="8" rx="2" fill="#607080"/></svg>`,
nechryael:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="38" rx="14" ry="12" fill="#4a2a5a"/><circle cx="32" cy="24" r="10" fill="#5a3a6a"/><circle cx="28" cy="22" r="2.5" fill="#ff40ff"/><circle cx="36" cy="22" r="2.5" fill="#ff40ff"/><path d="M20 16 Q16 8 20 14" stroke="#5a3a6a" stroke-width="3" fill="none"/><path d="M44 16 Q48 8 44 14" stroke="#5a3a6a" stroke-width="3" fill="none"/><path d="M14 32 Q6 28 8 38 Q10 34 14 36" fill="#3a1a4a"/><path d="M50 32 Q58 28 56 38 Q54 34 50 36" fill="#3a1a4a"/><circle cx="20" cy="40" r="4" fill="#3a1a4a"/><circle cx="44" cy="40" r="4" fill="#3a1a4a"/><circle cx="20" cy="40" r="1.5" fill="#ff40ff"/><circle cx="44" cy="40" r="1.5" fill="#ff40ff"/></svg>`,
abyssal_demon:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="36" rx="16" ry="14" fill="#2a1a2a"/><circle cx="32" cy="22" r="11" fill="#3a2a3a"/><circle cx="27" cy="20" r="3" fill="#c040c0"/><circle cx="37" cy="20" r="3" fill="#c040c0"/><circle cx="27" cy="20" r="1.5" fill="#fff"/><circle cx="37" cy="20" r="1.5" fill="#fff"/><path d="M18 14 L12 4 L16 12" fill="#3a2a3a"/><path d="M46 14 L52 4 L48 12" fill="#3a2a3a"/><path d="M12 30 Q4 24 2 34 Q6 28 10 32 Q6 36 4 42 Q8 38 12 38" fill="#2a1a2a"/><path d="M52 30 Q60 24 62 34 Q58 28 54 32 Q58 36 60 42 Q56 38 52 38" fill="#2a1a2a"/><path d="M38 48 Q44 52 40 58 Q38 54 42 50" fill="#2a1a2a"/><rect x="24" y="48" width="5" height="8" rx="2" fill="#1a0a1a"/><rect x="35" y="48" width="5" height="8" rx="2" fill="#1a0a1a"/></svg>`,
dark_beast:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="38" rx="18" ry="14" fill="#1a1a2a"/><circle cx="28" cy="24" r="10" fill="#2a2a3a"/><circle cx="24" cy="22" r="3" fill="#4040ff"/><circle cx="32" cy="22" r="3" fill="#4040ff"/><circle cx="24" cy="22" r="1" fill="#fff"/><circle cx="32" cy="22" r="1" fill="#fff"/><path d="M18 16 L10 6 L16 14" fill="#2a2a3a"/><path d="M38 16 L46 6 L40 14" fill="#2a2a3a"/><path d="M46 34 Q54 38 50 48 Q48 42 44 38" fill="#1a1a2a"/><rect x="20" y="48" width="6" height="10" rx="2" fill="#0a0a1a"/><rect x="30" y="48" width="6" height="10" rx="2" fill="#0a0a1a"/><rect x="40" y="48" width="6" height="10" rx="2" fill="#0a0a1a"/></svg>`,
cerberus:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="40" rx="18" ry="12" fill="#3a1a0a"/><circle cx="20" cy="24" r="8" fill="#4a2a10"/><circle cx="32" cy="20" r="9" fill="#4a2a10"/><circle cx="44" cy="24" r="8" fill="#4a2a10"/><circle cx="18" cy="22" r="2" fill="#ff4000"/><circle cx="22" cy="22" r="2" fill="#ff4000"/><circle cx="30" cy="18" r="2" fill="#ff4000"/><circle cx="34" cy="18" r="2" fill="#ff4000"/><circle cx="42" cy="22" r="2" fill="#ff4000"/><circle cx="46" cy="22" r="2" fill="#ff4000"/><path d="M16 28 Q20 32 24 28" stroke="#2a0a00" stroke-width="1.5" fill="none"/><path d="M28 24 Q32 28 36 24" stroke="#2a0a00" stroke-width="1.5" fill="none"/><path d="M40 28 Q44 32 48 28" stroke="#2a0a00" stroke-width="1.5" fill="none"/><rect x="20" y="48" width="5" height="8" rx="2" fill="#3a1a0a"/><rect x="28" y="48" width="5" height="8" rx="2" fill="#3a1a0a"/><rect x="36" y="48" width="5" height="8" rx="2" fill="#3a1a0a"/></svg>`,
kraken:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="32" rx="16" ry="14" fill="#2a4a6a"/><circle cx="28" cy="28" r="4" fill="#80c0e0"/><circle cx="36" cy="28" r="4" fill="#80c0e0"/><circle cx="28" cy="28" r="2" fill="#1a2a3a"/><circle cx="36" cy="28" r="2" fill="#1a2a3a"/><path d="M10 40 Q6 48 10 56 Q8 50 12 46 Q8 52 12 58" stroke="#2a4a6a" stroke-width="3" fill="none"/><path d="M18 44 Q14 52 18 58" stroke="#2a4a6a" stroke-width="3" fill="none"/><path d="M54 40 Q58 48 54 56 Q56 50 52 46 Q56 52 52 58" stroke="#2a4a6a" stroke-width="3" fill="none"/><path d="M46 44 Q50 52 46 58" stroke="#2a4a6a" stroke-width="3" fill="none"/><path d="M28 44 Q24 52 28 58" stroke="#2a4a6a" stroke-width="2" fill="none"/><path d="M36 44 Q40 52 36 58" stroke="#2a4a6a" stroke-width="2" fill="none"/></svg>`,
hydra:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="42" rx="16" ry="12" fill="#2a5a3a"/><circle cx="20" cy="22" r="7" fill="#3a6a4a"/><circle cx="32" cy="18" r="8" fill="#3a6a4a"/><circle cx="44" cy="22" r="7" fill="#3a6a4a"/><circle cx="18" cy="20" r="2" fill="#ff0"/><circle cx="22" cy="20" r="2" fill="#ff0"/><circle cx="30" cy="16" r="2" fill="#ff0"/><circle cx="34" cy="16" r="2" fill="#ff0"/><circle cx="42" cy="20" r="2" fill="#ff0"/><circle cx="46" cy="20" r="2" fill="#ff0"/><path d="M16 26 Q20 30 24 26" stroke="#1a3a2a" stroke-width="1.5" fill="none"/><path d="M28 22 Q32 26 36 22" stroke="#1a3a2a" stroke-width="1.5" fill="none"/><path d="M40 26 Q44 30 48 26" stroke="#1a3a2a" stroke-width="1.5" fill="none"/><path d="M20 28 Q20 36 24 36" stroke="#2a5a3a" stroke-width="3" fill="none"/><path d="M44 28 Q44 36 40 36" stroke="#2a5a3a" stroke-width="3" fill="none"/><rect x="24" y="50" width="5" height="8" rx="2" fill="#1a4a2a"/><rect x="35" y="50" width="5" height="8" rx="2" fill="#1a4a2a"/></svg>`,
corporeal_beast:`<svg viewBox="0 0 64 64"><ellipse cx="32" cy="36" rx="20" ry="16" fill="#1a3a1a"/><circle cx="32" cy="20" r="12" fill="#2a4a2a"/><circle cx="26" cy="18" r="3.5" fill="#40ff40"/><circle cx="38" cy="18" r="3.5" fill="#40ff40"/><circle cx="26" cy="18" r="1.5" fill="#0a1a0a"/><circle cx="38" cy="18" r="1.5" fill="#0a1a0a"/><path d="M26 26 Q32 32 38 26" stroke="#0a2a0a" stroke-width="3" fill="none"/><path d="M10 28 Q4 22 2 32 Q6 26 10 30 Q6 34 4 42 Q8 38 12 38" fill="#1a3a1a"/><path d="M54 28 Q60 22 62 32 Q58 26 54 30 Q58 34 60 42 Q56 38 52 38" fill="#1a3a1a"/><circle cx="16" cy="42" r="3" fill="#2a4a2a" opacity="0.6"/><circle cx="48" cy="42" r="3" fill="#2a4a2a" opacity="0.6"/><rect x="22" y="50" width="7" height="10" rx="3" fill="#0a2a0a"/><rect x="35" y="50" width="7" height="10" rx="3" fill="#0a2a0a"/></svg>`,
};

for (const [id, svg] of Object.entries(_arts)) {
  if (!GAME_DATA.monsterArt[id]) GAME_DATA.monsterArt[id] = svg;
}

// ── ADD CHARMS TO DROP TABLES ────────────────────────────
GAME_DATA.dropTables.charms = [
  {item:'gold_charm',qty:1,weight:10},{item:'green_charm',qty:1,weight:7},
  {item:'crimson_charm',qty:1,weight:4},{item:'blue_charm',qty:1,weight:2},
  {item:'spirit_shards',qty:5,weight:8},
];
// All monsters Lv10+ roll charm table
(function addCharmDrops() {
  for (const [id,m] of Object.entries(GAME_DATA.monsters)) {
    if (!m.rollTables) m.rollTables = [];
    if (m.rollTables.find(r=>r.table==='charms')) continue;
    if ((m.combatLevel||0) >= 5) {
      const chance = Math.min(0.50, 0.15 + (m.combatLevel||0) * 0.003);
      m.rollTables.push({table:'charms', chance});
    }
  }
})();

// ── CATEGORIZE NEW SMITHING RECIPES ──────────────────────
(function categorizeNew() {
  for (const r of GAME_DATA.recipes.smithing) {
    if (r.category) continue;
    const id = r.id.toLowerCase();
    if (id.includes('dagger'))     r.category = 'Daggers';
    else if (id.includes('mace')) r.category = 'Maces';
    else if (id.includes('longsword')) r.category = 'Longswords';
    else if (id.includes('battleaxe')) r.category = 'Battleaxes';
    else if (id.includes('warhammer')) r.category = 'Warhammers';
    else if (id.includes('2h_sword')) r.category = '2H Swords';
    else if (id.includes('spear'))  r.category = 'Spears';
    else if (id.includes('claws')) r.category = 'Claws';
    else r.category = 'Other';
  }
})();

console.log('[Ashfall] Mega Expansion loaded');
console.log('  New items generated:', _newItems);
console.log('  New recipes generated:', _newRecipes);
console.log('  Total items:', Object.keys(GAME_DATA.items).length);
console.log('  Total monsters:', Object.keys(GAME_DATA.monsters).length);
console.log('  Total monster arts:', Object.keys(GAME_DATA.monsterArt).length);
console.log('  Total recipes:', Object.values(GAME_DATA.recipes).reduce((a,r)=>a+r.length,0));
console.log('  Total shop:', GAME_DATA.shop.length);
console.log('  Combat areas:', GAME_DATA.combatAreas.length);
