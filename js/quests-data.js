// ================================================================
// ASHFALL IDLE — quests-data.js  v3.0 (OSRS-Style Quest Overhaul)
// Multi-stage quests, NPC dialogue, quest-specific drops, QP gates,
// difficulty tiers, branching dialogue, unique quest items.
// ================================================================

if (!GAME_DATA.quests) GAME_DATA.quests = [];
if (!GAME_DATA.dailyQuests) GAME_DATA.dailyQuests = [];
if (!GAME_DATA.questItems) GAME_DATA.questItems = {};

// ── DIFFICULTY TIER CONFIG
GAME_DATA.questDifficulties = {
  novice:       { label:'Novice',       color:'#7dcc44', icon:'◆',   qpRange:[1,2] },
  intermediate: { label:'Intermediate', color:'#4db8ff', icon:'◆◆',  qpRange:[2,4] },
  experienced:  { label:'Experienced',  color:'#d4a83a', icon:'◆◆◆', qpRange:[4,6] },
  master:       { label:'Master',       color:'#c44040', icon:'◆◆◆◆',qpRange:[6,8] },
  grandmaster:  { label:'Grandmaster',  color:'#9b59b6', icon:'★',   qpRange:[8,12] },
};

// ── QUEST ITEM DEFINITIONS
function _questItem(id, def) {
  GAME_DATA.questItems[id] = { id, ...def };
  if (!GAME_DATA.items[id]) {
    GAME_DATA.items[id] = {
      id, name: def.name, type:'quest', subtype:'quest',
      sellPrice: 0, tradeable: false, desc: def.desc || 'A quest item.',
      sprite: def.sprite || 'misc-scroll', rarity: 'uncommon', questItem: true,
    };
  }
}

_questItem('vex_letter',         { name:"Vex's Sealed Letter",  desc:"A letter from Elder Vex, sealed with wax."});
_questItem('hollow_sigil',       { name:'Hollow Sigil',          desc:'A strange sigil torn from a Hollow Knight. It pulses with void energy.'});
_questItem('ashbloom_sample',    { name:'Ashbloom Sample',       desc:'A rare flower that grows only in volcanic soil.'});
_questItem('lyra_orders',        { name:"Captain Lyra's Orders", desc:'Sealed military orders from Captain Lyra.'});
_questItem('old_kings_journal',  { name:"Old King's Journal",    desc:'A tattered journal belonging to the last king of the east.'});
_questItem('bloodfang_token',    { name:'Bloodfang Token',       desc:'A carved bone token proving membership in the Bloodfang Clan.'});
_questItem('morrigan_ledger',    { name:"Morrigan's Ledger",     desc:'An encoded ledger of Bloodfang operations.'});
_questItem('void_shard',         { name:'Void Shard',            desc:'A crystallized fragment of void energy. It hums with power.'});
_questItem('void_anchor',        { name:'Void Anchor',           desc:'A device that stabilizes void rifts. Incredibly dangerous.'});
_questItem('ancient_tome',       { name:'Ancient Tome',          desc:'A tome written in a language older than the Ashfall.'});
_questItem('phoenix_feather_q',  { name:'Phoenix Tail Feather',  desc:'A single feather from a true phoenix. Radiates warmth.'});
_questItem('forge_blueprint',    { name:'Forge Blueprint',       desc:'Schematics for an ancient forge of incredible power.'});
_questItem('dragon_egg_fragment',{ name:'Dragon Egg Fragment',   desc:'A shard of a petrified dragon egg.'});
_questItem('cursed_amulet',      { name:'Cursed Amulet',         desc:'An amulet that whispers in the dark. Do not wear it.'});
_questItem('purified_amulet',    { name:'Purified Amulet',       desc:'The curse has been lifted. A powerful protective ward remains.'});
_questItem('silver_order_badge', { name:'Silver Order Badge',    desc:'An official badge of the Silver Order militia.'});
_questItem('dorn_manifest',      { name:"Dorn's Manifest",       desc:'A list of the most dangerous creatures in the Ashfall.'});
_questItem('elena_research',     { name:"Elena's Research Notes", desc:'Detailed notes on herb mutations caused by volcanic ash.'});
_questItem('tormund_alloy',      { name:'Experimental Alloy',    desc:'A new metal alloy Tormund is developing.'});
_questItem('skeleton_key',       { name:'Skeleton Key',          desc:'Opens any standard lock. Single use.'});
_questItem('goblin_war_plans',   { name:'Goblin War Plans',      desc:'Crude but effective battle plans drawn in charcoal.'});
_questItem('shadow_essence',     { name:'Shadow Essence',        desc:'Concentrated darkness in a vial. Cold to the touch.'});
_questItem('void_compass',       { name:'Void Compass',          desc:'Points toward the strongest nearby void energy source.'});
_questItem('ashen_crown_shard',  { name:'Ashen Crown Shard',     desc:'One piece of the shattered Ashen Crown.'});
_questItem('overlord_seal',      { name:"Overlord's Seal",       desc:'The personal seal of the Ashen Overlord. Burns those unworthy.'});
_questItem('cannon_mould',       { name:'Cannon Mould',          desc:'A dwarven mould for casting cannon components.'});
_questItem('enchanted_chisel',   { name:'Enchanted Chisel',      desc:'A chisel imbued with precision magic. Improves crafting.'});
_questItem('ritual_components',  { name:'Ritual Components',     desc:'Bones, runes, and ash arranged for a dark ritual.'});
_questItem('dawn_crystal',       { name:'Dawn Crystal',          desc:'A crystal that glows with the light of a sun long gone.'});
_questItem('explorers_ring',     { name:"Explorer's Ring",       desc:'Teleport to any discovered area once per hour. Quest reward.'});
_questItem('lumberjack_hat',     { name:'Lumberjack Hat',        desc:'+2.5% Woodcutting XP. Quest reward.'});
_questItem('prospector_helm',    { name:'Prospector Helm',       desc:'+2.5% Mining XP. Quest reward.'});
_questItem('void_ward',          { name:'Void Ward',             desc:'Reduces void damage by 15%. Quest reward.'});
_questItem('ancient_staff',      { name:'Ancient Staff',         desc:'Unlocks Ancient Magicks when equipped. Quest reward.'});
_questItem('slayer_ring',        { name:'Slayer Ring',           desc:'Teleport to any Slayer area. +5% Slayer XP. Quest reward.'});
_questItem('xp_lamp_small',     { name:'Small XP Lamp',         desc:'Grants 1,000 XP in any skill of your choice.'});
_questItem('xp_lamp_medium',    { name:'Medium XP Lamp',        desc:'Grants 5,000 XP in any skill of your choice.'});
_questItem('xp_lamp_large',     { name:'Large XP Lamp',         desc:'Grants 15,000 XP in any skill of your choice.'});
_questItem('xp_lamp_huge',      { name:'Huge XP Lamp',          desc:'Grants 50,000 XP in any skill of your choice.'});
_questItem('antique_lamp',      { name:'Antique Lamp',          desc:'Grants 100,000 XP in any skill of your choice.'});

// ── HELPERS
function _quest(def) {
  def.difficulty = def.difficulty || 'novice';
  def.length     = def.length || 'short';
  def.qpRequired = def.qpRequired || 0;
  def.combatLevel = def.combatLevel || 0;
  def.stages     = def.stages || [];
  def.questDrops = def.questDrops || [];
  def.questItems = def.questItems || [];
  if (!GAME_DATA.quests.find(q => q.id === def.id)) GAME_DATA.quests.push(def);
}
function _daily(def) {
  if (!GAME_DATA.dailyQuests.find(q => q.id === def.id)) GAME_DATA.dailyQuests.push(def);
}

// ═══════════════════════════════════════════════════════════
//  NOVICE QUESTS (QP 1-2, no QP req)
// ═══════════════════════════════════════════════════════════

_quest({id:'ashen_beginnings',name:'Ashen Beginnings',series:'The Ashen Path',difficulty:'novice',length:'short',qp:1,qpRequired:0,combatLevel:3,desc:'The world is buried in ash. Elder Vex needs proof you can survive before he wastes resources on you.',npcId:'elder_vex',levelReqs:{},prereqs:[],
stages:[
{id:'start',type:'dialogue',npcId:'elder_vex',dialogue:[{speaker:'elder_vex',text:"Another survivor stumbles in from the wastes. Tell me — can you actually fight, or are you just another mouth to feed?"},{speaker:'elder_vex',text:"Don't answer that. Words are ash. Show me. Train your combat, gather resources, prove you can carry your weight."},{speaker:'player',choices:[{text:"I'll prove myself. What do you need?",next:'accept',tone:'determined'},{text:"Who are you to question me?",next:'defiant'}]}],transitions:{accept:'stage_train',defiant:'stage_defiant'}},
{id:'stage_defiant',type:'dialogue',npcId:'elder_vex',dialogue:[{speaker:'elder_vex',text:"Ha! Spirit. Good. You'll need it. But spirit alone won't stop a Hollow from eating your face. Get out there and train."}],transitions:{default:'stage_train'}},
{id:'stage_train',type:'objectives',journalText:"Elder Vex wants proof you can survive. Train your basic skills and eliminate the vermin infesting the farmlands.",objectives:[{type:'skill_level',skill:'woodcutting',level:5,qty:1,desc:'Reach Woodcutting level 5'},{type:'skill_level',skill:'mining',level:5,qty:1,desc:'Reach Mining level 5'},{type:'kill',monster:'chicken',qty:10,desc:'Kill 10 Chickens'},{type:'skill_level',skill:'cooking',level:5,qty:1,desc:'Reach Cooking level 5'}],onComplete:'stage_return'},
{id:'stage_return',type:'dialogue',npcId:'elder_vex',dialogue:[{speaker:'elder_vex',text:"You're still alive. I'm mildly impressed."},{speaker:'elder_vex',text:"Take this gear — you've earned it. The Goblin Wastes to the east are getting worse. When you're ready, come talk to me again."}],transitions:{default:'complete'}}],
rewards:{xp:{attack:500,woodcutting:500,mining:500},gold:500,qp:1,items:[{id:'iron_sword',qty:1}],unlocks:'Unlocks: Goblin Wastes combat area.'}});

_quest({id:'cooks_burden',name:"Cook's Burden",series:'Settlement Tales',difficulty:'novice',length:'short',qp:1,qpRequired:0,combatLevel:0,desc:"Henrick the cook is overwhelmed. The settlement's food supply is dwindling and the Elder's council meets tonight.",npcId:'cook_henrick',levelReqs:{cooking:5},prereqs:[],
stages:[
{id:'start',type:'dialogue',npcId:'cook_henrick',dialogue:[{speaker:'cook_henrick',text:"Oh, thank the embers! Someone who doesn't look like they'll pass out if I hand them a knife."},{speaker:'cook_henrick',text:"The council meets tonight, and I need to feed twenty people with what amounts to three potatoes and a prayer. Can you help?"},{speaker:'player',choices:[{text:"What do you need?",next:'accept'},{text:"Sounds like a you problem.",next:'refuse'}]}],transitions:{accept:'stage_gather',refuse:null}},
{id:'stage_gather',type:'objectives',journalText:"Henrick needs raw ingredients for the council feast.",objectives:[{type:'gather',item:'raw_shrimp',qty:15,desc:'Catch 15 Raw Shrimp'},{type:'gather',item:'raw_chicken',qty:10,desc:'Collect 10 Raw Chicken'},{type:'gather',item:'logs',qty:20,desc:'Chop 20 Logs for the cookfire'}],onComplete:'stage_cook'},
{id:'stage_cook',type:'dialogue',npcId:'cook_henrick',dialogue:[{speaker:'cook_henrick',text:"Excellent! Now I need you to cook some of this. My hands are full with the main course."}],transitions:{default:'stage_cook_obj'}},
{id:'stage_cook_obj',type:'objectives',journalText:"Cook the raw ingredients for Henrick.",objectives:[{type:'craft',item:'cooked_shrimp',qty:10,desc:'Cook 10 Shrimp'},{type:'craft',item:'cooked_chicken',qty:5,desc:'Cook 5 Chicken'}],onComplete:'stage_done'},
{id:'stage_done',type:'dialogue',npcId:'cook_henrick',dialogue:[{speaker:'cook_henrick',text:"You've saved my skin. The council will eat well tonight."},{speaker:'cook_henrick',text:"Take this. It's not much, but it might help you on your journey."}],transitions:{default:'complete'}}],
rewards:{xp:{cooking:800,fishing:400},gold:300,qp:1,items:[{id:'xp_lamp_small',qty:1}]}});

_quest({id:'goblin_diplomacy',name:'Goblin Diplomacy',series:'The Ashen Path',difficulty:'novice',length:'medium',qp:2,qpRequired:0,combatLevel:8,desc:"The goblins of the eastern wastes have been raiding supply caravans. Elder Vex wants to try talking before fighting.",npcId:'elder_vex',levelReqs:{attack:5},prereqs:['ashen_beginnings'],
stages:[
{id:'start',type:'dialogue',npcId:'elder_vex',dialogue:[{speaker:'elder_vex',text:"The goblins hit another caravan last night. Three dead."},{speaker:'elder_vex',text:"Take this letter to the goblin chieftain. Maybe we can negotiate."},{speaker:'player',choices:[{text:"I'll try diplomacy first.",next:'accept',alignShift:{direction:'good',amount:3}},{text:"Just let me kill them all.",next:'accept_violent',alignShift:{direction:'evil',amount:3}}]}],giveItems:[{id:'vex_letter',qty:1}],transitions:{accept:'stage_approach',accept_violent:'stage_approach'}},
{id:'stage_approach',type:'objectives',journalText:"Approach the goblin camp. Fight through their outer defenses.",objectives:[{type:'kill',monster:'goblin',qty:15,desc:'Fight through 15 Goblins to reach the chieftain'}],onComplete:'stage_chieftain'},
{id:'stage_chieftain',type:'dialogue',npcId:'elder_vex',dialogue:[{speaker:'narrator',text:"The goblin chieftain glares at you from his makeshift throne."},{speaker:'goblin_chief',text:"HUMAN COME TO DIE? Or human come to TALK?"},{speaker:'player',choices:[{text:"[Show letter] We want peace.",next:'peace_path'},{text:"[Draw weapon] Your raids end now.",next:'war_path'}]}],consumeItems:[{item:'vex_letter',qty:1}],transitions:{peace_path:'stage_peace',war_path:'stage_war'}},
{id:'stage_peace',type:'dialogue',npcId:'elder_vex',dialogue:[{speaker:'goblin_chief',text:"Grukk read letter. Grukk's people HUNGRY. You bring 20 cooked meat, Grukk stop raids."}],transitions:{default:'stage_food'}},
{id:'stage_food',type:'objectives',journalText:"Bring 20 cooked chicken to the goblin camp as a peace offering.",objectives:[{type:'gather',item:'cooked_chicken',qty:20,desc:'Bring 20 Cooked Chicken'}],onComplete:'stage_peace_done'},
{id:'stage_peace_done',type:'dialogue',npcId:'elder_vex',dialogue:[{speaker:'goblin_chief',text:"Grukk impressed. Take war plans. Trust."},{speaker:'narrator',text:"The chieftain hands you crude maps and battle plans."}],giveItems:[{id:'goblin_war_plans',qty:1}],transitions:{default:'stage_report'}},
{id:'stage_war',type:'objectives',journalText:"Destroy the goblin camp's defenses.",objectives:[{type:'kill',monster:'goblin',qty:30,desc:'Slaughter 30 more Goblins'}],onComplete:'stage_war_done'},
{id:'stage_war_done',type:'dialogue',npcId:'elder_vex',dialogue:[{speaker:'narrator',text:"The goblin camp lies in ruins. On the chieftain's body, you find crude war plans."}],giveItems:[{id:'goblin_war_plans',qty:1}],transitions:{default:'stage_report'}},
{id:'stage_report',type:'dialogue',npcId:'elder_vex',dialogue:[{speaker:'elder_vex',text:"It's done. These war plans show goblin tunnel networks we didn't know about. Valuable intelligence."}],consumeItems:[{item:'goblin_war_plans',qty:1}],transitions:{default:'complete'}}],
rewards:{xp:{attack:1500,strength:1000,diplomacy:500},gold:1000,qp:2,items:[{id:'steel_scimitar',qty:1}],unlocks:'Unlocks: Goblin Tunnels shortcut.'}});

_quest({id:'restless_dead',name:'The Restless Dead',series:'Settlement Tales',difficulty:'novice',length:'short',qp:1,qpRequired:0,combatLevel:10,desc:'Skeletons are rising from the old crypts near the settlement.',npcId:'elder_vex',levelReqs:{attack:8},prereqs:[],
stages:[
{id:'start',type:'dialogue',npcId:'elder_vex',dialogue:[{speaker:'elder_vex',text:"The dead are walking again. Find out what's causing it."},{speaker:'player',choices:[{text:"I'll investigate the crypts.",next:'accept'}]}],transitions:{accept:'stage_kill'}},
{id:'stage_kill',type:'objectives',journalText:"Clear the skeletons from the old crypts and search for the source.",objectives:[{type:'kill',monster:'skeleton',qty:25,desc:'Destroy 25 Skeletons'}],onComplete:'stage_find'},
{id:'stage_find',type:'dialogue',npcId:'elder_vex',dialogue:[{speaker:'narrator',text:"Among the shattered bones, you find a pulsing cursed amulet wedged into the crypt's altar."}],giveItems:[{id:'cursed_amulet',qty:1}],transitions:{default:'stage_return'}},
{id:'stage_return',type:'dialogue',npcId:'elder_vex',dialogue:[{speaker:'elder_vex',text:"A cursed amulet? Someone placed this deliberately. I'll have Morrigan examine it."}],consumeItems:[{item:'cursed_amulet',qty:1}],transitions:{default:'complete'}}],
rewards:{xp:{attack:1000,prayer:800},gold:600,qp:1,items:[{id:'xp_lamp_small',qty:1}]}});

_quest({id:'trial_of_the_forge',name:'Trial of the Forge',series:'Settlement Tales',difficulty:'novice',length:'short',qp:1,qpRequired:0,combatLevel:0,desc:"Tormund Greybeard needs a new apprentice. Prove your smithing skills.",npcId:'greybeard_tormund',levelReqs:{smithing:10},prereqs:[],
stages:[
{id:'start',type:'dialogue',npcId:'greybeard_tormund',dialogue:[{speaker:'greybeard_tormund',text:"You want to use my forge? Prove you know which end of a hammer to hold."},{speaker:'player',choices:[{text:"Challenge accepted.",next:'accept'}]}],transitions:{accept:'stage_smith'}},
{id:'stage_smith',type:'objectives',journalText:"Demonstrate your smithing skills for Tormund.",objectives:[{type:'gather',item:'iron_ore',qty:30,desc:'Mine 30 Iron Ore'},{type:'gather',item:'coal',qty:30,desc:'Mine 30 Coal'},{type:'craft',item:'steel_bar',qty:15,desc:'Smelt 15 Steel Bars'},{type:'skill_level',skill:'smithing',level:15,qty:1,desc:'Reach Smithing level 15'}],onComplete:'stage_done'},
{id:'stage_done',type:'dialogue',npcId:'greybeard_tormund',dialogue:[{speaker:'greybeard_tormund',text:"Hmph. Not terrible. Take this prospector's helm and consider yourself welcome at my forge."}],transitions:{default:'complete'}}],
rewards:{xp:{smithing:2000,mining:1500},gold:800,qp:1,items:[{id:'prospector_helm',qty:1}],unlocks:"Unlocks: Tormund's advanced smithing recipes."}});

_quest({id:'lost_apprentice',name:'The Lost Apprentice',series:'Settlement Tales',difficulty:'novice',length:'short',qp:1,qpRequired:0,combatLevel:5,desc:"Elena's apprentice went foraging near the Darkwood and hasn't returned.",npcId:'herbalist_elena',levelReqs:{},prereqs:[],
stages:[
{id:'start',type:'dialogue',npcId:'herbalist_elena',dialogue:[{speaker:'herbalist_elena',text:"My apprentice, Finn — he went to gather herbs two days ago and hasn't come back. Please find him."},{speaker:'player',choices:[{text:"I'll find him.",next:'accept'}]}],transitions:{accept:'stage_search'}},
{id:'stage_search',type:'objectives',journalText:"Search the Darkwood Forest for Finn.",objectives:[{type:'kill',monster:'wolf',qty:10,desc:'Clear 10 Dire Wolves'},{type:'kill',monster:'goblin',qty:5,desc:'Drive off 5 Goblins'}],onComplete:'stage_found'},
{id:'stage_found',type:'dialogue',npcId:'herbalist_elena',dialogue:[{speaker:'narrator',text:"You find Finn huddled in a hollow tree. He's scared but unharmed."}],transitions:{default:'stage_return'}},
{id:'stage_return',type:'dialogue',npcId:'herbalist_elena',dialogue:[{speaker:'herbalist_elena',text:"Finn! Thank goodness. Take this lumberjack hat — Finn found it in the forest."}],transitions:{default:'complete'}}],
rewards:{xp:{woodcutting:500,attack:300},gold:200,qp:1,items:[{id:'lumberjack_hat',qty:1}]}});

// ═══════════════════════════════════════════════════════════
//  INTERMEDIATE QUESTS (QP 2-4, 3+ QP req)
// ═══════════════════════════════════════════════════════════

_quest({id:'into_the_wastes',name:'Into the Wastes',series:'The Ashen Path',difficulty:'intermediate',length:'medium',qp:3,qpRequired:3,combatLevel:20,desc:'Bandit warlords have fortified the eastern wastes. Break their hold on the trade routes.',npcId:'elder_vex',levelReqs:{attack:10,defence:10},prereqs:['ashen_beginnings'],
stages:[
{id:'start',type:'dialogue',npcId:'elder_vex',dialogue:[{speaker:'elder_vex',text:"The real threat is the bandits. They've fortified the eastern passes and demand tribute from every caravan."},{speaker:'player',choices:[{text:"I'll clear the passes.",next:'accept'}]}],transitions:{accept:'stage_clear'}},
{id:'stage_clear',type:'objectives',journalText:"Break the bandit stranglehold on the eastern trade routes.",objectives:[{type:'kill',monster:'goblin',qty:50,desc:'Kill 50 Goblins'},{type:'kill',monster:'bandit',qty:20,desc:'Kill 20 Bandits'},{type:'gather',item:'iron_ore',qty:100,desc:'Mine 100 Iron Ore'},{type:'skill_level',skill:'smithing',level:15,qty:1,desc:'Reach Smithing level 15'}],onComplete:'stage_boss'},
{id:'stage_boss',type:'dialogue',npcId:'elder_vex',dialogue:[{speaker:'narrator',text:"The bandit captain drops a letter sealed with an unfamiliar sigil. It's addressed to the Hollow Lord."}],giveItems:[{id:'lyra_orders',qty:1}],transitions:{default:'stage_return'}},
{id:'stage_return',type:'dialogue',npcId:'elder_vex',dialogue:[{speaker:'elder_vex',text:"The bandits were puppets of the Hollow? The Hollow Lord is marshaling forces. Captain Lyra needs to see this."}],transitions:{default:'complete'}}],
rewards:{xp:{attack:2000,strength:2000,mining:1000,smithing:1000},gold:2000,qp:3,items:[{id:'steel_scimitar',qty:1},{id:'steel_plate',qty:1}],unlocks:'Unlocks: Eastern trade route. Bandit Camp area.'}});

_quest({id:'bloodfang_initiation',name:'The Bloodfang Initiation',series:'Bloodfang Legacy',difficulty:'intermediate',length:'medium',qp:3,qpRequired:3,combatLevel:15,desc:"The Bloodfang Clan controls the underworld. Morrigan offers a way in — if you can prove your skills.",npcId:'shadow_morrigan',levelReqs:{thieving:20},prereqs:[],
stages:[
{id:'start',type:'dialogue',npcId:'shadow_morrigan',dialogue:[{speaker:'shadow_morrigan',text:"You've got quick hands. Complete three trials and you'll earn a Bloodfang token."},{speaker:'player',choices:[{text:"What are the trials?",next:'accept'},{text:"I don't deal with criminals.",next:'refuse'}]}],transitions:{accept:'stage_trial1',refuse:null}},
{id:'stage_trial1',type:'objectives',journalText:"Trial 1: Prove your pickpocketing skills.",objectives:[{type:'thieve',target:'pickpocket_farmer',qty:50,desc:'Pickpocket 50 Farmers'},{type:'thieve',target:'pickpocket_warrior',qty:25,desc:'Pickpocket 25 Warriors'}],onComplete:'stage_trial2_intro'},
{id:'stage_trial2_intro',type:'dialogue',npcId:'shadow_morrigan',dialogue:[{speaker:'shadow_morrigan',text:"Not bad. Now acquire lockpicks and advance your skills."}],transitions:{default:'stage_trial2'}},
{id:'stage_trial2',type:'objectives',journalText:"Trial 2: Acquire tools and improve your skills.",objectives:[{type:'gather',item:'lockpick',qty:10,desc:'Obtain 10 Lockpicks'},{type:'skill_level',skill:'thieving',level:35,qty:1,desc:'Reach Thieving level 35'}],onComplete:'stage_trial3_intro'},
{id:'stage_trial3_intro',type:'dialogue',npcId:'shadow_morrigan',dialogue:[{speaker:'shadow_morrigan',text:"Final trial. Recover a ledger from the guard quarters."}],transitions:{default:'stage_trial3'}},
{id:'stage_trial3',type:'objectives',journalText:"Trial 3: Recover Morrigan's ledger.",objectives:[{type:'kill',monster:'guard',qty:10,desc:'Deal with 10 Guards'}],questDrops:[{monster:'guard',item:'morrigan_ledger',chance:1.0,onlyOnce:true,desc:'The ledger.'}],onComplete:'stage_return'},
{id:'stage_return',type:'dialogue',npcId:'shadow_morrigan',dialogue:[{speaker:'shadow_morrigan',text:"Welcome to the Bloodfang Clan. Take this token."}],consumeItems:[{item:'morrigan_ledger',qty:1}],giveItems:[{id:'bloodfang_token',qty:1}],transitions:{default:'complete'}}],
rewards:{xp:{thieving:15000},gold:12000,qp:3,items:[{id:'ring_of_wealth',qty:1},{id:'bloodfang_token',qty:1}],unlocks:'Unlocks: Rogue title. Bloodfang Den shops.'}});

_quest({id:'seeds_of_hope',name:'Seeds of Hope',series:"Nature's Call",difficulty:'intermediate',length:'medium',qp:2,qpRequired:2,combatLevel:0,desc:'Elena believes she can develop ash-resistant crops with your help.',npcId:'herbalist_elena',levelReqs:{farming:15},prereqs:[],
stages:[
{id:'start',type:'dialogue',npcId:'herbalist_elena',dialogue:[{speaker:'herbalist_elena',text:"The volcanic ash changes everything. But some plants adapt. I need samples."},{speaker:'player',choices:[{text:"I'll help.",next:'accept'}]}],transitions:{accept:'stage_grow'}},
{id:'stage_grow',type:'objectives',journalText:"Grow crops and gather samples.",objectives:[{type:'harvest',item:'potato',qty:50,desc:'Harvest 50 Potatoes'},{type:'harvest',item:'onion',qty:30,desc:'Harvest 30 Onions'},{type:'skill_level',skill:'farming',level:25,qty:1,desc:'Reach Farming level 25'}],onComplete:'stage_research'},
{id:'stage_research',type:'dialogue',npcId:'herbalist_elena',dialogue:[{speaker:'herbalist_elena',text:"I need ashbloom samples from the volcanic fields. They only grow near active vents."}],giveItems:[{id:'elena_research',qty:1}],transitions:{default:'stage_ashbloom'}},
{id:'stage_ashbloom',type:'objectives',journalText:"Gather ashbloom samples from volcanic areas.",objectives:[{type:'kill',monster:'ashling',qty:15,desc:'Clear 15 Ashlings from the volcanic fields'}],questDrops:[{monster:'ashling',item:'ashbloom_sample',chance:0.3,desc:'An ashbloom growing near the ashling.'}],onComplete:'stage_done'},
{id:'stage_done',type:'dialogue',npcId:'herbalist_elena',dialogue:[{speaker:'herbalist_elena',text:"Ashbloom! I can synthesize ash-resistant compounds. You've given the settlement a future."}],consumeItems:[{item:'ashbloom_sample',qty:1},{item:'elena_research',qty:1}],transitions:{default:'complete'}}],
rewards:{xp:{farming:5000},gold:3000,qp:2,items:[{id:'ranarr_seed',qty:5},{id:'supercompost',qty:10},{id:'xp_lamp_small',qty:1}],unlocks:'Unlocks: Ash-resistant crop plots.'}});

_quest({id:'first_assignment',name:'First Assignment',series:"The Slayer's Way",difficulty:'intermediate',length:'medium',qp:2,qpRequired:2,combatLevel:15,desc:'Dorn the Slayer Master has work for those willing to hunt the dangerous.',npcId:'slayer_master_dorn',levelReqs:{slayer:1},prereqs:[],
stages:[
{id:'start',type:'dialogue',npcId:'slayer_master_dorn',dialogue:[{speaker:'slayer_master_dorn',text:"You want to be a Slayer? Complete basic tasks. Prove you can follow orders."},{speaker:'player',choices:[{text:"Assign me a task, Slayer Master.",next:'accept'}]}],transitions:{accept:'stage_tasks'}},
{id:'stage_tasks',type:'objectives',journalText:"Complete Slayer tasks for Dorn.",objectives:[{type:'slayer_tasks',qty:3,desc:'Complete 3 Slayer tasks'},{type:'skill_level',skill:'slayer',level:10,qty:1,desc:'Reach Slayer level 10'}],onComplete:'stage_helm'},
{id:'stage_helm',type:'dialogue',npcId:'slayer_master_dorn',dialogue:[{speaker:'slayer_master_dorn',text:"Three tasks, no complaints. Take this helm. You're a Slayer now. Barely."}],transitions:{default:'complete'}}],
rewards:{xp:{slayer:2000,attack:1000},gold:1500,qp:2,items:[{id:'slayer_helm',qty:1}],unlocks:'Unlocks: Slayer task system.'}});

_quest({id:'dragon_slayer',name:'Dragon Slayer',series:'The Ashen Path',difficulty:'intermediate',length:'long',qp:4,qpRequired:5,combatLevel:40,desc:"A dragon has made its lair in the mountains. Captain Lyra believes slaying it will prove the settlement's strength.",npcId:'captain_lyra',levelReqs:{attack:25,defence:20,hitpoints:25},prereqs:['into_the_wastes'],
stages:[
{id:'start',type:'dialogue',npcId:'captain_lyra',dialogue:[{speaker:'captain_lyra',text:"A true dragon in the northern peaks. If a lone warrior were to slay it... that would send a message."},{speaker:'captain_lyra',text:"You'll need to prepare. Train your combat and forge steel for an anti-dragonfire shield."},{speaker:'player',choices:[{text:"I'll slay the dragon.",next:'accept'}]}],transitions:{accept:'stage_prepare'}},
{id:'stage_prepare',type:'objectives',journalText:"Prepare for the dragon hunt.",objectives:[{type:'skill_level',skill:'attack',level:30,qty:1,desc:'Reach Attack level 30'},{type:'skill_level',skill:'defence',level:25,qty:1,desc:'Reach Defence level 25'},{type:'craft',item:'steel_bar',qty:30,desc:'Smelt 30 Steel Bars'}],onComplete:'stage_hunt'},
{id:'stage_hunt',type:'dialogue',npcId:'captain_lyra',dialogue:[{speaker:'captain_lyra',text:"You're ready. The dragon lairs in the Phoenix Nest area. Go. Kill it. Come back alive."}],transitions:{default:'stage_kill'}},
{id:'stage_kill',type:'objectives',journalText:"Hunt the dragon.",objectives:[{type:'kill',monster:'dragon',qty:1,desc:'Slay the Dragon'}],questDrops:[{monster:'dragon',item:'dragon_egg_fragment',chance:1.0,onlyOnce:true,desc:'A fragment of a petrified dragon egg.'}],onComplete:'stage_return'},
{id:'stage_return',type:'dialogue',npcId:'captain_lyra',dialogue:[{speaker:'captain_lyra',text:"You actually did it. A dragon slayer. The Order will remember this."},{speaker:'captain_lyra',text:"Take this badge — you're one of us now."}],consumeItems:[{item:'dragon_egg_fragment',qty:1}],giveItems:[{id:'silver_order_badge',qty:1}],transitions:{default:'complete'}}],
rewards:{xp:{attack:5000,strength:5000,defence:5000,hitpoints:3000},gold:8000,qp:4,items:[{id:'xp_lamp_medium',qty:2},{id:'silver_order_badge',qty:1}],unlocks:'Unlocks: Silver Order reputation. Dragon hunting grounds.'}});

_quest({id:'enchanted_chisel_q',name:'The Enchanted Chisel',series:'Settlement Tales',difficulty:'intermediate',length:'short',qp:2,qpRequired:5,combatLevel:0,desc:'Tormund heard rumors of an enchanted chisel in the old dwarven ruins.',npcId:'greybeard_tormund',levelReqs:{crafting:25,mining:20},prereqs:['trial_of_the_forge'],
stages:[
{id:'start',type:'dialogue',npcId:'greybeard_tormund',dialogue:[{speaker:'greybeard_tormund',text:"The Enchanted Chisel. Made by old dwarven masters. Get me it and I'll make it worth your while."},{speaker:'player',choices:[{text:"I'll find the chisel.",next:'accept'}]}],transitions:{accept:'stage_dig'}},
{id:'stage_dig',type:'objectives',journalText:"Search the dwarven ruins.",objectives:[{type:'skill_level',skill:'mining',level:25,qty:1,desc:'Reach Mining level 25'},{type:'kill',monster:'skeleton',qty:20,desc:'Clear 20 Skeletons'}],questDrops:[{monster:'skeleton',item:'enchanted_chisel',chance:0.15,onlyOnce:true,desc:'An ornate chisel among the bones.'}],onComplete:'stage_return'},
{id:'stage_return',type:'dialogue',npcId:'greybeard_tormund',dialogue:[{speaker:'greybeard_tormund',text:"The Enchanted Chisel! Keep it — you earned it."}],transitions:{default:'complete'}}],
rewards:{xp:{crafting:3000,mining:2000},gold:2000,qp:2,items:[{id:'enchanted_chisel',qty:1}],unlocks:'Enchanted Chisel — +5% crafting success rate.'}});

_quest({id:'pet_tamers_journey',name:"Pet Tamer's Journey",series:'Companion Tales',difficulty:'intermediate',length:'medium',qp:3,qpRequired:5,combatLevel:30,desc:"Prove yourself as a tamer by bonding with creatures across the Ashfall.",npcId:'elder_vex',levelReqs:{},prereqs:['ashen_beginnings'],
stages:[
{id:'start',type:'dialogue',npcId:'elder_vex',dialogue:[{speaker:'elder_vex',text:"Some creatures can be tamed. Find a pet and prove you can fight alongside one."},{speaker:'player',choices:[{text:"I'll find a companion.",next:'accept'}]}],transitions:{accept:'stage_bond'}},
{id:'stage_bond',type:'objectives',journalText:"Find combat pets and prove yourself.",objectives:[{type:'pets',qty:1,desc:'Obtain your first combat pet'},{type:'kill',monster:'dragon',qty:50,desc:'Kill 50 Dragons with your pet'},{type:'pets',qty:3,desc:'Collect 3 different pets'}],onComplete:'stage_done'},
{id:'stage_done',type:'dialogue',npcId:'elder_vex',dialogue:[{speaker:'elder_vex',text:"Three companions. Take these magic secateurs."}],transitions:{default:'complete'}}],
rewards:{xp:{hitpoints:10000},gold:25000,qp:3,items:[{id:'secateurs_magic',qty:1}],unlocks:'Magic Secateurs — +10% herb yield.'}});

// ═══════════════════════════════════════════════════════════
//  EXPERIENCED QUESTS (QP 4-6, 10+ QP req)
// ═══════════════════════════════════════════════════════════

_quest({id:'hollow_awakening',name:'The Hollow Awakening',series:'The Ashen Path',difficulty:'experienced',length:'long',qp:5,qpRequired:10,combatLevel:45,desc:'The Hollow were soldiers once. Captain Lyra has uncovered the truth of their origin.',npcId:'captain_lyra',levelReqs:{attack:30,defence:25,hitpoints:30},prereqs:['dragon_slayer'],
stages:[
{id:'start',type:'dialogue',npcId:'captain_lyra',dialogue:[{speaker:'captain_lyra',text:"The Hollow weren't created by the Ashfall. They were created by the last king — he traded his soldiers' souls for immortality."},{speaker:'captain_lyra',text:"The Hollow Sigil is the key. If we collect one, we might understand the curse."},{speaker:'player',choices:[{text:"I'll find the Sigil.",next:'accept'}]}],transitions:{accept:'stage_hunt'}},
{id:'stage_hunt',type:'objectives',journalText:"Fight the Hollow and recover a Sigil from their knights.",objectives:[{type:'kill',monster:'hollow_soldier',qty:100,desc:'Defeat 100 Hollow Soldiers'},{type:'kill',monster:'hollow_knight',qty:25,desc:'Defeat 25 Hollow Knights'}],questDrops:[{monster:'hollow_knight',item:'hollow_sigil',chance:0.15,desc:'A sigil pulses with void energy.'}],onComplete:'stage_sigil'},
{id:'stage_sigil',type:'dialogue',npcId:'captain_lyra',dialogue:[{speaker:'captain_lyra',text:"The Sigil confirms everything. The Hollow Lord was once General Aldric — our greatest commander."},{speaker:'captain_lyra',text:"We can use this to access the Shadow Sanctum. That's where the Hollow Lord dwells."}],consumeItems:[{item:'hollow_sigil',qty:1}],transitions:{default:'complete'}}],
rewards:{xp:{attack:8000,strength:8000,defence:8000,prayer:5000},gold:10000,qp:5,items:[{id:'obsidian_cape',qty:1},{id:'xp_lamp_medium',qty:1}],unlocks:'Unlocks: Shadow Sanctum dungeon.'}});

_quest({id:'flames_of_ashfall',name:'Flames of Ashfall',series:'The Burning Throne',difficulty:'experienced',length:'long',qp:4,qpRequired:10,combatLevel:40,desc:'A dark mage channels volcanic energy into something terrible.',npcId:'shadow_morrigan',levelReqs:{magic:30,hitpoints:25},prereqs:['restless_dead'],
stages:[
{id:'start',type:'dialogue',npcId:'shadow_morrigan',dialogue:[{speaker:'shadow_morrigan',text:"That cursed amulet was Pyromantic magic. Someone is channeling volcanic energy. Find out who."},{speaker:'player',choices:[{text:"I'll hunt them down.",next:'accept'}]}],transitions:{accept:'stage_hunt'}},
{id:'stage_hunt',type:'objectives',journalText:"Hunt dark mages for evidence.",objectives:[{type:'kill',monster:'dark_mage',qty:30,desc:'Defeat 30 Dark Mages'},{type:'gather',item:'chaos_rune',qty:200,desc:'Gather 200 Chaos Runes'},{type:'skill_level',skill:'magic',level:40,qty:1,desc:'Reach Magic level 40'}],onComplete:'stage_discovery'},
{id:'stage_discovery',type:'dialogue',npcId:'shadow_morrigan',dialogue:[{speaker:'shadow_morrigan',text:"There's a Pyromancy spellbook hidden in the volcanic caves. Someone broke the seal. Find it."}],transitions:{default:'complete'}}],
rewards:{xp:{magic:10000,defence:3000},gold:8000,qp:4,items:[{id:'mystic_robe',qty:1},{id:'fire_rune',qty:500},{id:'xp_lamp_medium',qty:1}],unlocks:'Unlocks: Pyromancy Spellbook.'}});

_quest({id:'artillerists_calling',name:"Artillerist's Calling",series:"Artillerist's Path",difficulty:'experienced',length:'long',qp:4,qpRequired:12,combatLevel:45,desc:'Build the legendary Dwarf Cannon.',npcId:'greybeard_tormund',levelReqs:{smithing:35,ranged:40},prereqs:['into_the_wastes'],
stages:[
{id:'start',type:'dialogue',npcId:'greybeard_tormund',dialogue:[{speaker:'greybeard_tormund',text:"Blueprints from the old dwarven kingdoms. A multi-target ranged weapon — the Dwarf Cannon."},{speaker:'player',choices:[{text:"Let's build it.",next:'accept'}]}],giveItems:[{id:'cannon_mould',qty:1}],transitions:{accept:'stage_train'}},
{id:'stage_train',type:'objectives',journalText:"Train and gather materials.",objectives:[{type:'skill_level',skill:'smithing',level:40,qty:1,desc:'Reach Smithing 40'},{type:'skill_level',skill:'ranged',level:40,qty:1,desc:'Reach Ranged 40'},{type:'craft',item:'steel_bar',qty:50,desc:'Smelt 50 Steel Bars'},{type:'kill',monster:'hollow_knight',qty:30,desc:'Slay 30 Hollow Knights'}],onComplete:'stage_forge'},
{id:'stage_forge',type:'objectives',journalText:"Forge the cannon components.",objectives:[{type:'craft',item:'cannon_base',qty:1,desc:'Smith Cannon Base'},{type:'craft',item:'cannon_stand',qty:1,desc:'Smith Cannon Stand'},{type:'craft',item:'cannon_barrels',qty:1,desc:'Smith Cannon Barrels'},{type:'craft',item:'cannon_furnace',qty:1,desc:'Smith Cannon Furnace'}],onComplete:'stage_done'},
{id:'stage_done',type:'dialogue',npcId:'greybeard_tormund',dialogue:[{speaker:'greybeard_tormund',text:"You actually built it. Fine dwarven engineering."}],consumeItems:[{item:'cannon_mould',qty:1}],transitions:{default:'complete'}}],
rewards:{xp:{smithing:8000,ranged:8000,defence:3000},gold:12000,qp:4,items:[{id:'dwarf_cannon',qty:1},{id:'cannonball',qty:200}],unlocks:'Unlocks: Dwarf Cannon.'}});

_quest({id:'herbalists_trial',name:"The Herbalist's Trial",series:"Nature's Call",difficulty:'experienced',length:'medium',qp:4,qpRequired:10,combatLevel:0,desc:'Pass Elena\'s alchemy trial to earn the Herb Sack.',npcId:'herbalist_elena',levelReqs:{alchemy:35,farming:30},prereqs:['seeds_of_hope'],
stages:[
{id:'start',type:'dialogue',npcId:'herbalist_elena',dialogue:[{speaker:'herbalist_elena',text:"The militia needs potions. Prove you can brew them and I'll give you something special."},{speaker:'player',choices:[{text:"What do you need?",next:'accept'}]}],transitions:{accept:'stage_brew'}},
{id:'stage_brew',type:'objectives',journalText:"Brew combat potions for the militia.",objectives:[{type:'craft',item:'super_strength',qty:10,desc:'Brew 10 Super Strength'},{type:'craft',item:'prayer_potion',qty:10,desc:'Brew 10 Prayer Potions'},{type:'gather',item:'voidbloom',qty:20,desc:'Forage 20 Voidbloom'},{type:'skill_level',skill:'alchemy',level:45,qty:1,desc:'Reach Alchemy 45'}],onComplete:'stage_done'},
{id:'stage_done',type:'dialogue',npcId:'herbalist_elena',dialogue:[{speaker:'herbalist_elena',text:"Perfect potency. Take this herb sack — it auto-collects herbs while skilling."}],transitions:{default:'complete'}}],
rewards:{xp:{alchemy:12000,farming:5000},gold:8000,qp:4,items:[{id:'herb_sack',qty:1},{id:'xp_lamp_medium',qty:1}],unlocks:'Unlocks: Herb Sack.'}});

_quest({id:'shadow_of_order',name:'Shadow of the Order',series:'The Ashen Path',difficulty:'experienced',length:'long',qp:5,qpRequired:15,combatLevel:50,desc:'The Silver Order has a traitor feeding information to the Hollow Lord.',npcId:'captain_lyra',levelReqs:{attack:35,defence:30,thieving:20},prereqs:['hollow_awakening'],
stages:[
{id:'start',type:'dialogue',npcId:'captain_lyra',dialogue:[{speaker:'captain_lyra',text:"We have a traitor. Three patrols ambushed on routes only officers knew. I need someone from outside to investigate."},{speaker:'player',choices:[{text:"I'll find the traitor.",next:'accept'}]}],transitions:{accept:'stage_investigate'}},
{id:'stage_investigate',type:'objectives',journalText:"Search the Silver Order for evidence.",objectives:[{type:'kill',monster:'guard',qty:5,desc:'Interrogate 5 Guards'},{type:'thieve',target:'pickpocket_warrior',qty:20,desc:"Search 20 Warriors' belongings"}],questDrops:[{monster:'guard',item:'shadow_essence',chance:0.5,onlyOnce:true,desc:'Shadow Essence falls from a guard.'}],onComplete:'stage_evidence'},
{id:'stage_evidence',type:'dialogue',npcId:'captain_lyra',dialogue:[{speaker:'captain_lyra',text:"Shadow Essence — void magic. The traitor is corrupted. Hunt void walkers to flush them out."}],consumeItems:[{item:'shadow_essence',qty:1}],transitions:{default:'stage_flush'}},
{id:'stage_flush',type:'objectives',journalText:"Hunt void walkers to draw out the traitor.",objectives:[{type:'kill',monster:'void_walker',qty:30,desc:'Kill 30 Void Walkers'},{type:'kill',monster:'shadow_beast',qty:15,desc:'Kill 15 Shadow Beasts'}],onComplete:'stage_reveal'},
{id:'stage_reveal',type:'dialogue',npcId:'captain_lyra',dialogue:[{speaker:'captain_lyra',text:"It was Lieutenant Harken. Arrested. You saved the Silver Order. Take the Explorer's Ring."}],transitions:{default:'complete'}}],
rewards:{xp:{attack:12000,defence:10000,thieving:8000},gold:15000,qp:5,items:[{id:'explorers_ring',qty:1},{id:'xp_lamp_medium',qty:2}],unlocks:'Unlocks: Silver Order inner sanctum.'}});

_quest({id:'curse_of_amulet',name:'Curse of the Amulet',series:'Ancient Mysteries',difficulty:'experienced',length:'medium',qp:4,qpRequired:12,combatLevel:35,desc:"The cursed amulet isn't done with you. Morrigan says it needs to be purified — or harnessed.",npcId:'shadow_morrigan',levelReqs:{magic:25,prayer:20},prereqs:['restless_dead'],
stages:[
{id:'start',type:'dialogue',npcId:'shadow_morrigan',dialogue:[{speaker:'shadow_morrigan',text:"That amulet whispers even sealed in lead. I can purify it — or we can harness its power."},{speaker:'player',choices:[{text:"[Purify] Let's cleanse it.",next:'purify',alignShift:{direction:'good',amount:5}},{text:"[Harness] Can we use the curse?",next:'harness',alignShift:{direction:'evil',amount:5}}]}],transitions:{purify:'stage_purify',harness:'stage_harness'}},
{id:'stage_purify',type:'objectives',journalText:"Gather components to purify the cursed amulet.",objectives:[{type:'kill',monster:'dark_mage',qty:20,desc:'Kill 20 Dark Mages'},{type:'skill_level',skill:'prayer',level:30,qty:1,desc:'Reach Prayer 30'},{type:'gather',item:'bones',qty:50,desc:'Collect 50 Bones'}],onComplete:'stage_purify_done'},
{id:'stage_purify_done',type:'dialogue',npcId:'shadow_morrigan',dialogue:[{speaker:'shadow_morrigan',text:"The curse is lifted. What remains is a protective ward."}],giveItems:[{id:'purified_amulet',qty:1}],transitions:{default:'complete'}},
{id:'stage_harness',type:'objectives',journalText:"Gather shadow essence to channel the curse.",objectives:[{type:'kill',monster:'shadow_beast',qty:15,desc:'Kill 15 Shadow Beasts'},{type:'skill_level',skill:'magic',level:35,qty:1,desc:'Reach Magic 35'}],onComplete:'stage_harness_done'},
{id:'stage_harness_done',type:'dialogue',npcId:'shadow_morrigan',dialogue:[{speaker:'shadow_morrigan',text:"Bold choice. The amulet amplifies dark magic now."}],giveItems:[{id:'cursed_amulet',qty:1}],transitions:{default:'complete'}}],
rewards:{xp:{prayer:8000,magic:8000},gold:6000,qp:4,items:[{id:'xp_lamp_medium',qty:1}]}});

// ═══════════════════════════════════════════════════════════
//  MASTER QUESTS (QP 6-8, 25+ QP req)
// ═══════════════════════════════════════════════════════════

_quest({id:'the_void_rift',name:'The Void Rift',series:'The Burning Throne',difficulty:'master',length:'very_long',qp:7,qpRequired:25,combatLevel:70,desc:"A rift to the void has opened. The Void Emperor's influence bleeds through.",npcId:'shadow_morrigan',levelReqs:{magic:60,hitpoints:60,defence:50},prereqs:['flames_of_ashfall'],
stages:[
{id:'start',type:'dialogue',npcId:'shadow_morrigan',dialogue:[{speaker:'shadow_morrigan',text:"The Void Rift grows. If the Emperor pushes through, that's extinction."},{speaker:'shadow_morrigan',text:"We need void dust to craft an anchor to destabilize the rift."},{speaker:'player',choices:[{text:"Tell me what to do.",next:'accept'}]}],transitions:{accept:'stage_gather'}},
{id:'stage_gather',type:'objectives',journalText:"Gather void shards from void walkers.",objectives:[{type:'kill',monster:'void_walker',qty:200,desc:'Kill 200 Void Walkers'},{type:'skill_level',skill:'magic',level:75,qty:1,desc:'Reach Magic 75'}],questDrops:[{monster:'void_walker',item:'void_shard',chance:0.05,desc:'A void shard.'}],onComplete:'stage_craft'},
{id:'stage_craft',type:'dialogue',npcId:'shadow_morrigan',dialogue:[{speaker:'shadow_morrigan',text:"Good. Now collect dust and complete the dungeon to place the anchor."}],transitions:{default:'stage_anchor'}},
{id:'stage_anchor',type:'objectives',journalText:"Collect void dust and complete the Void Rift dungeon.",objectives:[{type:'gather',item:'void_dust',qty:50,desc:'Collect 50 Void Dust'},{type:'dungeon',dungeon:'void_rift',qty:1,desc:'Complete Void Rift dungeon'}],onComplete:'stage_seal'},
{id:'stage_seal',type:'dialogue',npcId:'shadow_morrigan',dialogue:[{speaker:'shadow_morrigan',text:"The anchor holds. We've bought time. Take this staff — you'll need it."}],consumeItems:[{item:'void_shard',qty:1}],transitions:{default:'complete'}}],
rewards:{xp:{magic:50000,hitpoints:20000},gold:50000,qp:7,items:[{id:'void_staff',qty:1},{id:'void_ward',qty:1},{id:'xp_lamp_large',qty:2}],unlocks:'Unlocks: Void Magic Spellbook. Void Emperor world boss.'}});

_quest({id:'master_slayer',name:'Master Slayer',series:"The Slayer's Way",difficulty:'master',length:'very_long',qp:6,qpRequired:25,combatLevel:65,desc:"Prove your mastery of the Slayer arts.",npcId:'slayer_master_dorn',levelReqs:{slayer:50},prereqs:['first_assignment'],
stages:[
{id:'start',type:'dialogue',npcId:'slayer_master_dorn',dialogue:[{speaker:'slayer_master_dorn',text:"Twenty-five hard tasks. Then the abyssal demons. Survive that, and I'll call you Master."},{speaker:'player',choices:[{text:"I'm ready.",next:'accept'}]}],giveItems:[{id:'dorn_manifest',qty:1}],transitions:{accept:'stage_grind'}},
{id:'stage_grind',type:'objectives',journalText:"Complete 25 Slayer tasks.",objectives:[{type:'slayer_tasks',qty:25,desc:'Complete 25 tasks'},{type:'skill_level',skill:'slayer',level:65,qty:1,desc:'Reach Slayer 65'}],onComplete:'stage_abyssal'},
{id:'stage_abyssal',type:'dialogue',npcId:'slayer_master_dorn',dialogue:[{speaker:'slayer_master_dorn',text:"Now for the real test. Abyssal demons. Kill fifty."}],transitions:{default:'stage_hunt'}},
{id:'stage_hunt',type:'objectives',journalText:"Hunt 50 Abyssal Demons.",objectives:[{type:'kill',monster:'abyssal_horror',qty:50,desc:'Slay 50 Abyssal Demons'}],onComplete:'stage_done'},
{id:'stage_done',type:'dialogue',npcId:'slayer_master_dorn',dialogue:[{speaker:'slayer_master_dorn',text:"You're a Master Slayer now. Only three others alive hold this title."}],consumeItems:[{item:'dorn_manifest',qty:1}],transitions:{default:'complete'}}],
rewards:{xp:{slayer:40000,attack:15000,strength:15000},gold:30000,qp:6,items:[{id:'abyssal_whip',qty:1},{id:'slayer_ring',qty:1},{id:'xp_lamp_large',qty:1}],unlocks:'Unlocks: Master Slayer title.'}});

_quest({id:'song_of_elders',name:'Song of the Elders',series:'Ancient Mysteries',difficulty:'master',length:'long',qp:6,qpRequired:30,combatLevel:55,desc:'A ritual that could reveal the true cause of the Ashfall.',npcId:'elder_vex',levelReqs:{prayer:40,magic:40},prereqs:['hollow_awakening','flames_of_ashfall'],
stages:[
{id:'start',type:'dialogue',npcId:'elder_vex',dialogue:[{speaker:'elder_vex',text:"The Song of the Elders can pierce the veil between past and present. We can see the moment the Ashfall began."},{speaker:'player',choices:[{text:"What components?",next:'accept'}]}],transitions:{accept:'stage_components'}},
{id:'stage_components',type:'objectives',journalText:"Gather ritual components.",objectives:[{type:'gather',item:'dragon_bones',qty:25,desc:'Collect 25 Dragon Bones'},{type:'gather',item:'death_rune',qty:100,desc:'Gather 100 Death Runes'},{type:'gather',item:'soul_rune',qty:50,desc:'Gather 50 Soul Runes'},{type:'skill_level',skill:'prayer',level:50,qty:1,desc:'Reach Prayer 50'}],onComplete:'stage_ritual'},
{id:'stage_ritual',type:'dialogue',npcId:'elder_vex',dialogue:[{speaker:'elder_vex',text:"The Ashfall was a weapon. The Void Emperor used the king's ritual to tear open the boundary between worlds."},{speaker:'elder_vex',text:"It can be reversed. The Ashen Overlord guards the key."}],giveItems:[{id:'ancient_tome',qty:1}],transitions:{default:'complete'}}],
rewards:{xp:{prayer:25000,magic:20000,hitpoints:15000},gold:25000,qp:6,items:[{id:'ancient_staff',qty:1},{id:'xp_lamp_large',qty:2}],unlocks:'Unlocks: Ancient Magicks.'}});

_quest({id:'forge_eternal',name:'The Forge Eternal',series:'Settlement Tales',difficulty:'master',length:'long',qp:6,qpRequired:28,combatLevel:60,desc:'Build an ancient forge of incredible power.',npcId:'greybeard_tormund',levelReqs:{smithing:60,mining:55},prereqs:['artillerists_calling'],
stages:[
{id:'start',type:'dialogue',npcId:'greybeard_tormund',dialogue:[{speaker:'greybeard_tormund',text:"The Forge Eternal. It can work any metal with perfect precision. But building it requires materials from the deepest mountains."},{speaker:'player',choices:[{text:"Tell me what you need.",next:'accept'}]}],giveItems:[{id:'forge_blueprint',qty:1}],transitions:{accept:'stage_materials'}},
{id:'stage_materials',type:'objectives',journalText:"Gather rare materials for the Forge Eternal.",objectives:[{type:'gather',item:'runite_ore',qty:50,desc:'Mine 50 Runite Ore'},{type:'gather',item:'obsidian_ore',qty:100,desc:'Mine 100 Obsidian Ore'},{type:'gather',item:'ashsteel_ore',qty:30,desc:'Mine 30 Ashsteel Ore'},{type:'kill',monster:'ash_golem',qty:50,desc:'Kill 50 Ash Golems'},{type:'skill_level',skill:'smithing',level:65,qty:1,desc:'Reach Smithing 65'}],onComplete:'stage_build'},
{id:'stage_build',type:'dialogue',npcId:'greybeard_tormund',dialogue:[{speaker:'narrator',text:"Over several days, you construct the Forge Eternal. It ignites with an otherworldly blue flame."},{speaker:'greybeard_tormund',text:"By the old gods... it works."}],consumeItems:[{item:'forge_blueprint',qty:1}],giveItems:[{id:'tormund_alloy',qty:1}],transitions:{default:'complete'}}],
rewards:{xp:{smithing:40000,mining:30000},gold:35000,qp:6,items:[{id:'xp_lamp_large',qty:2},{id:'tormund_alloy',qty:1}],unlocks:'Unlocks: Forge Eternal.'}});

_quest({id:'friend_of_wild',name:'Friend of the Wild',series:'Companion Tales',difficulty:'master',length:'long',qp:6,qpRequired:30,combatLevel:60,desc:'Something is poisoning the land. Track the source and save what remains.',npcId:'herbalist_elena',levelReqs:{farming:50,alchemy:40},prereqs:['herbalists_trial','pet_tamers_journey'],
stages:[
{id:'start',type:'dialogue',npcId:'herbalist_elena',dialogue:[{speaker:'herbalist_elena',text:"The animals are dying from something in the soil. I've traced it to a corrupted water source."},{speaker:'player',choices:[{text:"I'll save the wildlife.",next:'accept'}]}],transitions:{accept:'stage_hunt'}},
{id:'stage_hunt',type:'objectives',journalText:"Track the corruption to its source.",objectives:[{type:'kill',monster:'corrupted_golem',qty:30,desc:'Kill 30 Corrupted Golems'},{type:'kill',monster:'phoenix',qty:10,desc:'Defeat 10 Phoenixes'},{type:'gather',item:'voidbloom',qty:50,desc:'Collect 50 Voidbloom'}],onComplete:'stage_cure'},
{id:'stage_cure',type:'dialogue',npcId:'herbalist_elena',dialogue:[{speaker:'herbalist_elena',text:"Void energy seeping through cracks in the earth. With these samples, I can develop an antidote."}],transitions:{default:'complete'}}],
rewards:{xp:{farming:20000,alchemy:15000,hitpoints:10000},gold:20000,qp:6,items:[{id:'xp_lamp_large',qty:3}],unlocks:"Unlocks: Nature's Blessing — +5% farming yield."}});

// ═══════════════════════════════════════════════════════════
//  GRANDMASTER (QP 8-12, 45+ QP req)
// ═══════════════════════════════════════════════════════════

_quest({id:'while_world_burns',name:'While the World Burns',series:'The Ashen Path',difficulty:'grandmaster',length:'very_long',qp:10,qpRequired:45,combatLevel:85,desc:'The Ashen Overlord stirs. The Void Emperor pushes. Every ally converges for the final reckoning.',npcId:'elder_vex',levelReqs:{attack:70,defence:65,hitpoints:70,magic:60,prayer:50},prereqs:['hollow_awakening','the_void_rift','song_of_elders','shadow_of_order'],
stages:[
{id:'start',type:'dialogue',npcId:'elder_vex',dialogue:[{speaker:'elder_vex',text:"It's time. The Ashen Overlord has declared war. The Void Emperor pushes through the weakened rift."},{speaker:'elder_vex',text:"Every quest you've completed, every ally you've earned — it was all leading to this."},{speaker:'elder_vex',text:"Captain Lyra commands the Silver Order. Morrigan has the Bloodfang. Dorn's Slayers are ready."},{speaker:'player',choices:[{text:"For the Ashfall.",next:'accept'}]}],transitions:{accept:'stage_rally'}},
{id:'stage_rally',type:'objectives',journalText:"Rally forces and prepare for the final battle.",objectives:[{type:'kill',monster:'void_walker',qty:100,desc:'Destroy 100 Void Walker scouts'},{type:'kill',monster:'hollow_lord',qty:25,desc:'Kill 25 Hollow Lords'},{type:'kill',monster:'ashfall_titan',qty:10,desc:'Defeat 10 Ashfall Titans'},{type:'gather',item:'dragon_bones',qty:50,desc:'Stockpile 50 Dragon Bones'}],onComplete:'stage_assault'},
{id:'stage_assault',type:'dialogue',npcId:'captain_lyra',dialogue:[{speaker:'captain_lyra',text:"The army is assembled. You take the Infernal Forge. We take the Rift."}],transitions:{default:'stage_forge_assault'}},
{id:'stage_forge_assault',type:'objectives',journalText:"Assault the Infernal Forge.",objectives:[{type:'kill',monster:'ash_guardian',qty:30,desc:'Break through 30 Ash Guardians'},{type:'kill',monster:'abyssal_horror',qty:20,desc:'Destroy 20 Abyssal Horrors'}],questDrops:[{monster:'ash_guardian',item:'ashen_crown_shard',chance:0.1,desc:'A shard of the Ashen Crown.'},{monster:'abyssal_horror',item:'overlord_seal',chance:0.05,onlyOnce:true,desc:"The Overlord's seal."}],onComplete:'stage_finale'},
{id:'stage_finale',type:'dialogue',npcId:'elder_vex',dialogue:[{speaker:'narrator',text:"The Infernal Forge lies shattered. The Ashen Overlord is broken, forced back into the volcanic depths."},{speaker:'elder_vex',text:"We won. For now. You are the Champion of the Ashfall."},{speaker:'captain_lyra',text:"The Silver Order stands with you. Always."},{speaker:'shadow_morrigan',text:"The Bloodfang respects you. Don't let it go to your head."},{speaker:'slayer_master_dorn',text:"Finest warrior I've ever trained."}],consumeItems:[{item:'ashen_crown_shard',qty:1},{item:'overlord_seal',qty:1}],giveItems:[{id:'dawn_crystal',qty:1}],transitions:{default:'complete'}}],
rewards:{xp:{attack:100000,strength:100000,defence:100000,hitpoints:100000,magic:50000,prayer:50000},gold:250000,qp:10,items:[{id:'antique_lamp',qty:3},{id:'dawn_crystal',qty:1}],unlocks:'Unlocks: Champion of the Ashfall title. Dawn Crystal — permanent 10% XP boost.'}});

// ── DAILY QUESTS
_daily({id:'daily_kills',name:'Monster Hunter',desc:'Kill 50 monsters.',objectives:[{type:'kill_any',qty:50,desc:'Kill 50 monsters'}],rewards:{gold:500,xp:{hitpoints:1000}},cooldown:86400000});
_daily({id:'daily_gather',name:'Resource Run',desc:'Gather 30 resources.',objectives:[{type:'gather_any',qty:30,desc:'Gather 30 resources'}],rewards:{gold:400,xp:{mining:800,foraging:800}},cooldown:86400000});
_daily({id:'daily_cook',name:'Feed the Camp',desc:'Cook 20 food items.',objectives:[{type:'craft_cooking',qty:20,desc:'Cook 20 food'}],rewards:{gold:350,xp:{cooking:600}},cooldown:86400000});
_daily({id:'daily_smith',name:'Arms Run',desc:'Smith or craft 10 items.',objectives:[{type:'craft_any',qty:10,desc:'Craft 10 items'}],rewards:{gold:600,xp:{smithing:1000,crafting:800}},cooldown:86400000});
_daily({id:'daily_thieve',name:'Silent Work',desc:'Pickpocket 30 targets.',objectives:[{type:'thieve_any',qty:30,desc:'Pickpocket 30'}],rewards:{gold:800,xp:{thieving:1500}},cooldown:86400000});
_daily({id:'daily_slayer',name:'Slayer Duty',desc:'Complete a Slayer task.',objectives:[{type:'slayer_tasks',qty:1,desc:'Complete 1 task'}],rewards:{gold:700,xp:{slayer:2000}},cooldown:86400000});
_daily({id:'daily_dungeon',name:'Dungeon Delver',desc:'Complete any dungeon.',objectives:[{type:'dungeon_any',qty:1,desc:'Complete a dungeon'}],rewards:{gold:1500,xp:{attack:2000,defence:2000}},cooldown:86400000});

console.log('[Ashfall] quests-data.js v3.0 loaded. Quests:', GAME_DATA.quests.length, '| Dailies:', GAME_DATA.dailyQuests.length, '| Quest items:', Object.keys(GAME_DATA.questItems).length);
