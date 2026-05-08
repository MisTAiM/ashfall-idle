// ================================================================
// ASHFALL IDLE — quest-system.js  v3.0
// Patches Engine + UI for OSRS-style multi-stage quest system.
// Loads AFTER engine.js and ui.js.
// ================================================================

(function(){
'use strict';

const E = GameEngine.prototype;
const U = GameUI.prototype;

// ── ENGINE: Override acceptQuest for multi-stage ─────────
const _origAccept = E.acceptQuest;
E.acceptQuest = function(questId) {
  const q = GAME_DATA.quests.find(x => x.id === questId); if (!q) return;
  if (this.state.quests.completed.includes(questId)) { this.emit('notification',{type:'warn',text:'Quest already completed.'}); return; }
  if (this.state.quests.active.includes(questId)) { this.emit('notification',{type:'warn',text:'Quest already active.'}); return; }

  // QP gate
  const playerQP = this.state.questPoints || 0;
  if ((q.qpRequired||0) > playerQP) {
    this.emit('notification',{type:'warn',text:`Requires ${q.qpRequired} Quest Points (you have ${playerQP}).`}); return;
  }

  // Prereqs
  const prereqs = q.prereqs || [];
  for (const pre of prereqs) {
    if (!this.state.quests.completed.includes(pre)) {
      const preQ = GAME_DATA.quests.find(x=>x.id===pre);
      this.emit('notification',{type:'warn',text:`Complete "${preQ?.name||pre}" first.`}); return;
    }
  }

  // Level reqs
  if (q.levelReqs) {
    for (const [sk, lv] of Object.entries(q.levelReqs)) {
      if ((this.state.skills[sk]?.level||1) < lv) {
        this.emit('notification',{type:'warn',text:`Requires ${GAME_DATA.skills[sk]?.name||sk} level ${lv}.`}); return;
      }
    }
  }

  // Multi-stage: find first non-dialogue stage or process dialogue immediately
  this.state.quests.active.push(questId);

  // Initialize stage tracking
  if (!this.state.quests.stages) this.state.quests.stages = {};
  
  if (q.stages && q.stages.length > 0) {
    // Find first objectives stage
    const firstStage = q.stages[0];
    this.state.quests.stages[questId] = { currentStageId: firstStage.id, stageHistory: [] };
    
    // Process initial dialogue stage(s) — auto-advance through dialogue to first objectives
    this._processQuestStage(questId);
  } else {
    // Legacy flat quest — init all progress to 0. Tracking will fill on next tick.
    this.state.quests.progress[questId] = (q.objectives||[]).map(() => 0);
    if (!this.state.quests._readyToComplete) this.state.quests._readyToComplete = {};
  }

  this.emit('notification',{type:'success',text:`Quest accepted: ${q.name}`});
  this.emit('questsChanged');
};

// ── ENGINE: Process quest stage transitions ──────────────
E._processQuestStage = function(questId) {
  const q = GAME_DATA.quests.find(x => x.id === questId); if (!q || !q.stages) return;
  if (!this.state.quests.stages) this.state.quests.stages = {};
  const stageState = this.state.quests.stages[questId];
  if (!stageState) return;

  const stage = q.stages.find(s => s.id === stageState.currentStageId);
  if (!stage) return;

  // Give items from stage
  if (stage.giveItems) {
    for (const it of stage.giveItems) this.addItem(it.id, it.qty);
  }

  if (stage.type === 'dialogue') {
    // Show dialogue modal via UI event
    this.emit('questDialogue', { questId, stage, quest: q });
    // Don't auto-advance — UI will call advanceQuestStage when dialogue is dismissed
  } else if (stage.type === 'objectives') {
    // Initialize progress for this stage's objectives
    this.state.quests.progress[questId] = (stage.objectives||[]).map((obj, i) => {
      if (obj.type === 'skill_level') return (this.state.skills[obj.skill]?.level||1) >= obj.level ? obj.qty : 0;
      return 0;
    });
  }
};

// ── ENGINE: Advance to next quest stage ──────────────────
E.advanceQuestStage = function(questId, nextStageId) {
  const q = GAME_DATA.quests.find(x => x.id === questId); if (!q || !q.stages) return;
  if (!this.state.quests.stages) this.state.quests.stages = {};
  const stageState = this.state.quests.stages[questId];
  if (!stageState) return;

  const currentStage = q.stages.find(s => s.id === stageState.currentStageId);
  
  // Consume items if current stage requires it
  if (currentStage?.consumeItems) {
    for (const it of currentStage.consumeItems) {
      this.removeItem(it.item, it.qty);
    }
  }

  // Handle alignment shifts from choices
  if (nextStageId === 'complete') {
    this.completeQuest(questId);
    return;
  }

  if (!nextStageId) {
    // Quest refused or dead end
    const idx = this.state.quests.active.indexOf(questId);
    if (idx >= 0) this.state.quests.active.splice(idx, 1);
    delete this.state.quests.stages[questId];
    delete this.state.quests.progress[questId];
    this.emit('notification',{type:'info',text:'Quest declined.'});
    this.emit('questsChanged');
    return;
  }

  stageState.stageHistory.push(stageState.currentStageId);
  stageState.currentStageId = nextStageId;
  delete this.state.quests.progress[questId]; // clear old progress

  this._processQuestStage(questId);
  this.emit('questsChanged');
};

// ── ENGINE: Override quest tracking — handles multi-stage, legacy flat, AND dailies ──
const _origTrack = E._trackAllQuests;

// Shared objective matcher used by all quest types
function _matchObj(obj, type, data, state) {
  switch(obj.type) {
    case 'kill':         return type==='kill' && obj.monster===data.monster ? data.qty : 0;
    case 'kill_any':     return type==='kill' ? data.qty : 0;
    case 'gather':       return type==='gather' && obj.item===data.item ? data.qty : 0;
    case 'gather_any':   return type==='gather' ? data.qty : 0;
    case 'harvest':      return type==='harvest' && obj.item===data.item ? data.qty : 0;
    case 'craft':        return type==='craft' && obj.item===data.item ? data.qty : 0;
    case 'craft_any':    return type==='craft' ? data.qty : 0;
    case 'craft_cooking':return type==='craft' && GAME_DATA.items[data.item]?.type==='food' ? data.qty : 0;
    case 'thieve':       return type==='thieve' && obj.target===data.target ? data.qty : 0;
    case 'thieve_any':   return type==='thieve' ? data.qty : 0;
    case 'dungeon':      return type==='dungeon' && obj.dungeon===data.dungeon ? 1 : 0;
    case 'dungeon_any':  return type==='dungeon' ? 1 : 0;
    case 'slayer_tasks': return type==='slayer_tasks' ? -(state.stats.slayerTasksCompleted||0) : 0; // negative = absolute set
    case 'slayer_kills': return type==='kill' && state.combat?.onSlayerTask ? data.qty : 0;
    case 'skill_level':  return type==='skill_level' && obj.skill===data.skill ? -((state.skills[obj.skill]?.level||1)>=obj.level?obj.qty:0) : 0;
    case 'gold':         return -(Math.min(obj.qty, state.gold));
    case 'pets':         return -(Math.min(obj.qty, (state.pets||[]).length));
    case 'magic_kills':  return type==='magic_kills' ? (data.qty||0) : 0;
    case 'bury_bones': case 'bury_big_bones': case 'bury_dragon_bones':
      return type===obj.type ? (data.qty||1) : 0;
    default: return 0;
  }
}

function _trackObjectives(objectives, progress, type, data, state) {
  let updated = false;
  (objectives||[]).forEach((obj, i) => {
    const cur = progress[i]||0;
    if (cur >= obj.qty) return;
    const result = _matchObj(obj, type, data, state);
    if (result < 0) { // Absolute set (negative convention)
      progress[i] = Math.min(obj.qty, -result);
      updated = true;
    } else if (result > 0) { // Incremental add
      progress[i] = Math.min(obj.qty, cur + result);
      updated = true;
    }
  });
  return updated;
}

E._trackAllQuests = function(type, data) {
  // ── 1. Track active main quests ──
  for (const qId of [...this.state.quests.active]) {
    const q = GAME_DATA.quests.find(x => x.id === qId); if (!q) continue;
    
    if (q.stages && q.stages.length > 0) {
      // MULTI-STAGE quest
      const stageState = this.state.quests.stages?.[qId];
      if (!stageState) continue;
      const stage = q.stages.find(s => s.id === stageState.currentStageId);
      if (!stage || stage.type !== 'objectives') continue;
      
      const p = this.state.quests.progress[qId] || [];
      if (_trackObjectives(stage.objectives, p, type, data, this.state)) {
        this.state.quests.progress[qId] = p;
      }
      // Auto-advance when all objectives met
      if ((stage.objectives||[]).every((_, i) => (p[i]||0) >= stage.objectives[i].qty)) {
        if (stage.onComplete) this.advanceQuestStage(qId, stage.onComplete);
      }
    } else if (q.objectives && q.objectives.length > 0) {
      // LEGACY FLAT quest (no stages, uses q.objectives directly)
      const p = this.state.quests.progress[qId] || [];
      if (_trackObjectives(q.objectives, p, type, data, this.state)) {
        this.state.quests.progress[qId] = p;
      }
      // Flag as ready — do NOT auto-complete. Player must click "Turn In".
      if (q.objectives.every((_, i) => (p[i]||0) >= q.objectives[i].qty)) {
        if (!this.state.quests._readyToComplete) this.state.quests._readyToComplete = {};
        if (!this.state.quests._readyToComplete[qId]) {
          this.state.quests._readyToComplete[qId] = true;
          this.emit('notification',{type:'success',text:`Quest ready to turn in: ${q.name}`});
          this.emit('questsChanged');
        }
      }
    }
  }

  // ── 2. Track daily quests ──
  for (const qId of [...((this.state.dailyQuests?.active)||[])]) {
    const q = (GAME_DATA.dailyQuests||[]).find(x => x.id === qId); if (!q) continue;
    const prog = this.state.dailyQuests?.progress || {};
    const p = prog[qId] || [];
    if (_trackObjectives(q.objectives, p, type, data, this.state)) {
      prog[qId] = p;
    }
    if ((q.objectives||[]).every((_, i) => (p[i]||0) >= q.objectives[i].qty)) {
      this._completeDailyQuest(qId);
    }
  }
};

// ── ENGINE: Quest-specific drops ─────────────────────────
E.checkQuestDrop = function(monsterId) {
  const drops = [];
  for (const qId of this.state.quests.active) {
    const q = GAME_DATA.quests.find(x => x.id === qId); if (!q) continue;
    const stageState = this.state.quests.stages?.[qId];
    if (!stageState) continue;
    const stage = q.stages?.find(s => s.id === stageState.currentStageId);
    if (!stage) continue;
    
    // Check stage-level quest drops
    const stageDrops = stage.questDrops || [];
    // Also check quest-level drops
    const questDrops = q.questDrops || [];
    const allDrops = [...stageDrops, ...questDrops];
    
    for (const qd of allDrops) {
      if (qd.monster !== monsterId) continue;
      if (qd.onlyOnce && (this.state.bank[qd.item]||0) > 0) continue;
      if (Math.random() < qd.chance) {
        this.addItem(qd.item, 1);
        drops.push(qd);
        this.emit('notification',{type:'achievement',text:`Quest item: ${GAME_DATA.items[qd.item]?.name || qd.item}!`});
        // Also track as gather for quest progress
        this.trackQuestProgress('gather', {item: qd.item, qty: 1});
      }
    }
  }
  return drops;
};

// ── ENGINE: Get current stage info ───────────────────────
E.getQuestStageInfo = function(questId) {
  const q = GAME_DATA.quests.find(x => x.id === questId);
  if (!q || !q.stages) return null;
  const stageState = this.state.quests.stages?.[questId];
  if (!stageState) return null;
  const stage = q.stages.find(s => s.id === stageState.currentStageId);
  const stageIndex = q.stages.indexOf(stage);
  const totalStages = q.stages.length;
  return { stage, stageIndex, totalStages, stageState };
};

// ── ENGINE: Save migration — ensure stages object exists ─
const _origMigrate = E.migrateSave;
E.migrateSave = function(s) {
  if (_origMigrate) s = _origMigrate.call(this, s);
  if (!s.quests) s.quests = { active:[], completed:[], progress:{} };
  if (!s.quests.stages) s.quests.stages = {};
  if (!s.quests.progress) s.quests.progress = {};
  
  // Migrate old flat quests to new stage format
  for (const qId of (s.quests.active || [])) {
    const q = GAME_DATA.quests.find(x => x.id === qId);
    if (q && q.stages && q.stages.length > 0 && !s.quests.stages[qId]) {
      const firstObjStage = q.stages.find(st => st.type === 'objectives') || q.stages[0];
      s.quests.stages[qId] = { currentStageId: firstObjStage.id, stageHistory: [] };
    }
  }

  // Recalculate QP from all completed quests (handles retroactive QP from patched legacy quests)
  let correctQP = 0;
  for (const qId of (s.quests.completed || [])) {
    const q = GAME_DATA.quests.find(x => x.id === qId);
    if (q && q.qp) correctQP += q.qp;
  }
  if (correctQP !== (s.questPoints || 0)) {
    console.log(`[Ashfall] QP migration: ${s.questPoints||0} → ${correctQP} (recalculated from ${s.quests.completed.length} completed quests)`);
    s.questPoints = correctQP;
  }
  return s;
};


// ══════════════════════════════════════════════════════════
//  UI: Quest Journal Overhaul
// ══════════════════════════════════════════════════════════

// ── UI: Dialogue modal ──────────────────────────────────
U.showQuestDialogue = function(data) {
  const { questId, stage, quest } = data;
  const lines = stage.dialogue || [];
  const npc = GAME_DATA.npcs[stage.npcId || quest.npcId] || {};
  const diffConf = GAME_DATA.questDifficulties[quest.difficulty] || {};

  let html = `<div class="quest-dialogue-overlay" id="quest-dialogue-overlay">
    <div class="quest-dialogue-modal">
      <div class="qdm-header">
        <span class="qdm-quest-name" style="color:${diffConf.color||'#c9873e'}">${quest.name}</span>
        <span class="qdm-stage">${diffConf.label||'Quest'}</span>
      </div>
      <div class="qdm-body" id="qdm-body"></div>
      <div class="qdm-footer" id="qdm-footer"></div>
    </div>
  </div>`;
  
  // Inject into DOM
  let overlay = document.getElementById('quest-dialogue-overlay');
  if (overlay) overlay.remove();
  document.body.insertAdjacentHTML('beforeend', html);
  overlay = document.getElementById('quest-dialogue-overlay');

  let lineIdx = 0;
  const body = document.getElementById('qdm-body');
  const footer = document.getElementById('qdm-footer');

  const showLine = () => {
    if (lineIdx >= lines.length) {
      // End of dialogue — find default transition
      const trans = stage.transitions || {};
      const defaultNext = trans.default || Object.values(trans)[0];
      footer.innerHTML = `<button class="btn qdm-btn" id="qdm-continue">Continue</button>`;
      document.getElementById('qdm-continue').onclick = () => {
        overlay.remove();
        this.engine.advanceQuestStage(questId, defaultNext);
      };
      return;
    }

    const line = lines[lineIdx];
    
    if (line.speaker === 'player' && line.choices) {
      // Show choice buttons
      let choiceHtml = '<div class="qdm-choices">';
      for (const choice of line.choices) {
        choiceHtml += `<button class="btn qdm-choice-btn" data-next="${choice.next||''}">${choice.text}</button>`;
      }
      choiceHtml += '</div>';
      body.innerHTML += choiceHtml;
      
      // Bind choice handlers
      body.querySelectorAll('.qdm-choice-btn').forEach(btn => {
        btn.onclick = () => {
          const next = btn.dataset.next;
          const trans = stage.transitions || {};
          const targetStage = trans[next] || next;
          overlay.remove();
          if (!targetStage) {
            // Refused quest
            this.engine.advanceQuestStage(questId, null);
          } else {
            this.engine.advanceQuestStage(questId, targetStage);
          }
        };
      });
      return;
    }

    // Normal dialogue line
    const speakerName = line.speaker === 'narrator' ? '' :
      line.speaker === 'player' ? 'You' :
      (GAME_DATA.npcs[line.speaker]?.name || line.speaker.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()));
    
    const speakerClass = line.speaker === 'narrator' ? 'qdm-narrator' : 
      line.speaker === 'player' ? 'qdm-player' : 'qdm-npc';
    
    body.innerHTML += `<div class="qdm-line ${speakerClass}">
      ${speakerName ? `<span class="qdm-speaker">${speakerName}:</span>` : ''}
      <span class="qdm-text">${line.text}</span>
    </div>`;
    
    lineIdx++;
    
    // Auto-show next or wait for click
    if (lineIdx < lines.length && !(lines[lineIdx].speaker === 'player' && lines[lineIdx].choices)) {
      footer.innerHTML = `<button class="btn qdm-btn" id="qdm-next">Next</button>`;
      document.getElementById('qdm-next').onclick = () => showLine();
    } else {
      showLine(); // Show choices or end
    }

    // Scroll to bottom
    body.scrollTop = body.scrollHeight;
  };

  showLine();
};

// ── UI: Enhanced Quest Page ─────────────────────────────
const _origRenderQuests = U.renderQuestsPage;
U.renderQuestsPage = function(el) {
  const s = this.engine.state;
  const qp = s.questPoints || 0;
  const totalQP = GAME_DATA.quests.reduce((sum,q)=>sum+(q.qp||0),0);
  // Only count completed quests that still exist in GAME_DATA
  const validCompleted = (s.quests.completed||[]).filter(id => GAME_DATA.quests.find(q=>q.id===id));
  const completedCount = validCompleted.length;
  const totalQuests = GAME_DATA.quests.length;

  // Quest filter state
  if (!this._questFilter) this._questFilter = 'all';
  if (!this._questSearch) this._questSearch = '';

  let html = this.header('Quest Journal','scroll',`${completedCount}/${totalQuests} quests · ${qp}/${totalQP} QP`,null);

  // QP Banner
  const qpPct = Math.min(100, qp/Math.max(1,totalQP)*100).toFixed(1);
  html += `<div class="qp-banner">
    <div class="qp-crown">👑</div>
    <div class="qp-center">
      <div class="qp-num">${qp} <span class="qp-of">/ ${totalQP}</span></div>
      <div class="qp-label">Quest Points</div>
      <div class="qp-bar-wrap"><div class="qp-bar"><div class="qp-fill" style="width:${qpPct}%"></div></div></div>
    </div>
    <div class="qp-progress-tag">${completedCount}/${totalQuests} done</div>
  </div>`;

  // Filter bar
  const diffs = ['all','novice','intermediate','experienced','master','grandmaster'];
  html += `<div class="quest-filter-bar">
    <input type="text" class="quest-search" placeholder="Search quests..." value="${this._questSearch}" oninput="ui._questSearch=this.value;ui.renderPage('quests')">
    <div class="quest-diff-filters">
      ${diffs.map(d => {
        const dc = d === 'all' ? '#c9873e' : GAME_DATA.questDifficulties[d]?.color || '#aaa';
        const active = this._questFilter === d ? 'qdf-active' : '';
        const label = d === 'all' ? 'All' : GAME_DATA.questDifficulties[d]?.label || d;
        return `<button class="qdf-btn ${active}" style="--dc:${dc}" onclick="ui._questFilter='${d}';ui.renderPage('quests')">${label}</button>`;
      }).join('')}
    </div>
  </div>`;

  // Daily quests section
  const dailies = GAME_DATA.dailyQuests || [];
  const dState = s.dailyQuests || { active:[], completed:[], progress:{} };
  const msLeft = 86400000 - (Date.now() % 86400000);
  const hLeft = Math.floor(msLeft/3600000), mLeft = Math.floor((msLeft%3600000)/60000);
  
  html += `<div class="quest-section">
    <div class="qs-header"><span class="qs-title">Daily Quests</span><span class="qs-timer">Resets ${hLeft}h ${mLeft}m</span></div>
    <div class="daily-grid">`;
  for (const dq of dailies) {
    const done = (dState.completed||[]).includes(dq.id);
    const prog = (dState.progress||{})[dq.id]||(dq.objectives||[]).map(()=>0);
    const pct = (dq.objectives||[]).reduce((acc,obj,i)=>acc+(prog[i]||0)/Math.max(1,obj.qty),0)/Math.max(1,(dq.objectives||[]).length)*100;
    const rewardStr = [dq.rewards.gold?`${this.fmt(dq.rewards.gold)}g`:'',...Object.entries(dq.rewards.xp||{}).map(([sk,xp])=>`+${this.fmt(xp)} ${GAME_DATA.skills[sk]?.name||sk}`)].filter(Boolean).join(' · ');
    html += `<div class="daily-card ${done?'daily-done':''}">
      <div class="dc-header"><span class="dc-name">${done?'✓ ':''} ${dq.name}</span>${done?'<span class="dc-done-badge">Complete</span>':''}</div>
      <div class="dc-desc">${dq.desc}</div>
      <div class="dc-prog-bar"><div class="dc-prog-fill" style="width:${done?100:pct.toFixed(0)}%"></div></div>
      <div class="dc-reward">${rewardStr}</div>
    </div>`;
  }
  html += '</div></div>';

  // Active quests
  const activeQuests = s.quests.active.map(id => GAME_DATA.quests.find(x=>x.id===id)).filter(Boolean);
  if (activeQuests.length > 0) {
    html += `<div class="quest-section"><div class="qs-header"><span class="qs-title">Active Quests (${activeQuests.length})</span></div>`;
    for (const q of activeQuests) {
      html += this._renderActiveQuestCard(q, s);
    }
    html += '</div>';
  }

  // Available / Locked / Completed
  const searchLower = this._questSearch.toLowerCase();
  const filterDiff = this._questFilter;

  let allQuests = GAME_DATA.quests.filter(q => {
    if (searchLower && !q.name.toLowerCase().includes(searchLower) && !(q.series||'').toLowerCase().includes(searchLower)) return false;
    if (filterDiff !== 'all' && q.difficulty !== filterDiff) return false;
    return true;
  });

  // Available
  const available = allQuests.filter(q => {
    if (s.quests.completed.includes(q.id)||s.quests.active.includes(q.id)) return false;
    const prereqs=q.prereqs||[];
    if (!prereqs.every(p=>s.quests.completed.includes(p))) return false;
    return true;
  });

  if (available.length > 0) {
    html += `<div class="quest-section"><div class="qs-header"><span class="qs-title">Available (${available.length})</span></div>`;
    const series = {};
    for (const q of available) { const s2=q.series||'Other'; if(!series[s2])series[s2]=[]; series[s2].push(q); }
    for (const [ser, quests] of Object.entries(series)) {
      html += `<div class="quest-series-group"><div class="qsg-label">${ser}</div>`;
      for (const q of quests) {
        html += this._renderAvailableQuestCard(q, s);
      }
      html += '</div>';
    }
    html += '</div>';
  }

  // Locked
  const locked = allQuests.filter(q => {
    if (s.quests.completed.includes(q.id)||s.quests.active.includes(q.id)) return false;
    if (available.includes(q)) return false;
    return true;
  });

  if (locked.length > 0) {
    html += `<div class="quest-section"><div class="qs-header"><span class="qs-title">Locked (${locked.length})</span></div><div class="locked-quest-grid">`;
    for (const q of locked) {
      const diffConf = GAME_DATA.questDifficulties[q.difficulty]||{};
      const prereqs=q.prereqs||[];
      const missing=prereqs.filter(p=>!s.quests.completed.includes(p)).map(p=>GAME_DATA.quests.find(x=>x.id===p)?.name||p);
      const needsQP = (q.qpRequired||0) > (s.questPoints||0);
      html += `<div class="locked-quest-card">
        <div class="lqc-header">
          <span class="lqc-name">🔒 ${q.name}</span>
          <span class="lqc-diff" style="color:${diffConf.color||'#888'}">${diffConf.label||''}</span>
        </div>
        ${missing.length?`<div class="lqc-req">Complete: ${missing.join(', ')}</div>`:''}
        ${needsQP?`<div class="lqc-req">Requires ${q.qpRequired} QP</div>`:''}
        <span class="lqc-qp">+${q.qp||0} QP</span>
      </div>`;
    }
    html += '</div></div>';
  }

  // Completed
  const completedQuests = allQuests.filter(q => s.quests.completed.includes(q.id));
  if (completedQuests.length > 0) {
    html += `<div class="quest-section"><div class="qs-header"><span class="qs-title">Completed (${completedQuests.length})</span></div><div class="completed-grid">`;
    for (const q of completedQuests) {
      const diffConf = GAME_DATA.questDifficulties[q.difficulty]||{};
      html += `<div class="completed-quest">
        <span class="cq-check">✓</span>
        <span class="cq-name">${q.name}</span>
        <span class="cq-diff" style="color:${diffConf.color||'#888'}">${diffConf.icon||''}</span>
        <span class="cq-qp">+${q.qp||0} QP</span>
      </div>`;
    }
    html += '</div></div>';
  }

  el.innerHTML = html;
};

// ── UI: Render active quest card with stage info ─────────
U._renderActiveQuestCard = function(q, s) {
  const diffConf = GAME_DATA.questDifficulties[q.difficulty]||{};
  const stageInfo = this.engine.getQuestStageInfo(q.id);
  
  let objectivesHtml = '';
  let journalText = '';
  let stageLabel = '';
  
  if (stageInfo && stageInfo.stage) {
    const stage = stageInfo.stage;
    stageLabel = `Stage ${stageInfo.stageState.stageHistory.length + 1}`;
    journalText = stage.journalText || '';
    
    if (stage.type === 'objectives') {
      const prog = s.quests.progress[q.id]||[];
      objectivesHtml = (stage.objectives||[]).map((obj,i) => {
        const done = prog[i]||0; const pct = Math.min(100,done/Math.max(1,obj.qty)*100);
        const complete = done >= obj.qty;
        return `<div class="qo-row ${complete?'qo-done':''}">
          <span class="qo-check">${complete?'✓':''}</span>
          <div class="qo-label">${obj.desc}</div>
          <span class="qo-count">${this.fmt(Math.min(done,obj.qty))}/${this.fmt(obj.qty)}</span>
          <div class="qo-bar"><div class="qo-fill" style="width:${pct.toFixed(0)}%"></div></div>
        </div>`;
      }).join('');
    } else if (stage.type === 'dialogue') {
      objectivesHtml = `<div class="qo-dialogue-prompt">
        <button class="btn btn-xs" onclick="ui.engine.emit('questDialogue',{questId:'${q.id}',stage:GAME_DATA.quests.find(x=>x.id==='${q.id}').stages.find(s=>s.id==='${stage.id}'),quest:GAME_DATA.quests.find(x=>x.id==='${q.id}')})">
          Talk to ${GAME_DATA.npcs[stage.npcId||q.npcId]?.name || 'NPC'}
        </button>
      </div>`;
    }
  } else {
    // Legacy flat quest
    const prog = s.quests.progress[q.id]||[];
    objectivesHtml = (q.objectives||[]).map((obj,i) => {
      const done = prog[i]||0; const pct = Math.min(100,done/Math.max(1,obj.qty)*100);
      const complete = done >= obj.qty;
      return `<div class="qo-row ${complete?'qo-done':''}">
        <span class="qo-check">${complete?'✓':''}</span>
        <div class="qo-label">${obj.desc}</div>
        <span class="qo-count">${this.fmt(Math.min(done,obj.qty))}/${this.fmt(obj.qty)}</span>
        <div class="qo-bar"><div class="qo-fill" style="width:${pct.toFixed(0)}%"></div></div>
      </div>`;
    }).join('');
  }

  // Rewards
  const rewHtml = `<div class="qcf-rewards-row">
    ${q.rewards.gold ? `<span class="qcf-gold">${this.fmt(q.rewards.gold)}g</span>` : ''}
    ${q.rewards.qp  ? `<span class="qcf-qp-reward">+${q.rewards.qp} QP</span>` : ''}
    ${Object.entries(q.rewards.xp||{}).map(([sk,xp])=>`<span class="qcf-xp">+${this.fmt(xp)} ${GAME_DATA.skills[sk]?.name||sk}</span>`).join('')}
    ${(q.rewards.items||[]).map(it=>`<span class="qcf-item">${GAME_DATA.items[it.id||it.item]?.name||it.id||it.item} x${it.qty}</span>`).join('')}
  </div>
  ${q.rewards.unlocks ? `<div class="qcf-unlocks">${q.rewards.unlocks}</div>` : ''}`;

  return `<div class="quest-card-full">
    <div class="qcf-header">
      <div>
        <div class="qcf-name">${q.name}</div>
        <div class="qcf-meta">
          <span class="qcf-series">${q.series||''}</span>
          <span class="qcf-diff" style="color:${diffConf.color||'#888'}">${diffConf.label||''} ${diffConf.icon||''}</span>
          ${stageLabel?`<span class="qcf-stage-label">${stageLabel}</span>`:''}
        </div>
      </div>
      <div class="qcf-qp-badge">+${q.qp||0} QP</div>
    </div>
    ${journalText?`<div class="qcf-journal">${journalText}</div>`:
      `<div class="qcf-desc">${q.desc}</div>`}
    <div class="qcf-objectives">${objectivesHtml}</div>
    <div class="qcf-rewards-block">
      <div class="qcf-rewards-label">Rewards:</div>
      ${rewHtml}
    </div>
    <div style="display:flex;gap:8px;margin-top:8px">
      ${(s.quests._readyToComplete?.[q.id]) ? `<button class="btn btn-xs btn-turnin" onclick="game.turnInQuest('${q.id}')">Turn In Quest</button>` : ''}
      <button class="btn btn-xs btn-danger" onclick="if(confirm('Abandon quest?'))game.abandonQuest('${q.id}')">Abandon</button>
    </div>
  </div>`;
};

// ── UI: Render available quest card ──────────────────────
U._renderAvailableQuestCard = function(q, s) {
  const diffConf = GAME_DATA.questDifficulties[q.difficulty]||{};
  const lreqs = q.levelReqs||{};
  const meetsLevel = Object.entries(lreqs).every(([sk,lv])=>(s.skills[sk]?.level||1)>=lv);
  const meetsQP = (q.qpRequired||0) <= (s.questPoints||0);
  const canAccept = meetsLevel && meetsQP;
  const lacking = Object.entries(lreqs).filter(([sk,lv])=>(s.skills[sk]?.level||1)<lv).map(([sk,lv])=>`${GAME_DATA.skills[sk]?.name||sk} ${lv}`);

  const lengthLabels = {short:'Short',medium:'Medium',long:'Long',very_long:'Very Long'};

  return `<div class="quest-available-card ${canAccept?'':'qa-locked'}">
    <div class="qa-header">
      <div>
        <div class="qa-name">${q.name}</div>
        <div class="qa-meta">
          <span class="qa-series">${q.series||''}</span>
          <span class="qa-diff" style="color:${diffConf.color||'#888'}">${diffConf.label||''} ${diffConf.icon||''}</span>
          <span class="qa-length">${lengthLabels[q.length]||q.length}</span>
          ${q.combatLevel?`<span class="qa-combat">Combat ${q.combatLevel}+</span>`:''}
        </div>
      </div>
      <span class="qa-qp">+${q.qp||0} QP</span>
    </div>
    <div class="qa-desc">${q.desc}</div>
    ${!meetsQP?`<div class="qa-reqs">Requires ${q.qpRequired} QP (you have ${s.questPoints||0})</div>`:''}
    ${lacking.length?`<div class="qa-reqs">Requires: ${lacking.join(', ')}</div>`:''}
    <div class="qa-preview-rewards">
      ${q.rewards.gold?`<span>${this.fmt(q.rewards.gold)}g</span>`:''}
      ${q.rewards.qp?`<span>+${q.rewards.qp} QP</span>`:''}
      ${q.rewards.unlocks?`<span>${q.rewards.unlocks.split('.')[0]}</span>`:''}
    </div>
    <button class="btn btn-xs" onclick="game.acceptQuest('${q.id}')" ${canAccept?'':'disabled'}>Accept Quest</button>
  </div>`;
};

// ── UI: Bind dialogue event ─────────────────────────────
const _origInit = U.init;
if (_origInit) {
  U.init = function() {
    _origInit.call(this);
    this.engine.on('questDialogue', (data) => this.showQuestDialogue(data));
  };
} else {
  // Fallback: hook after construction
  const _origBind = U.bindEngine;
  if (_origBind) {
    U.bindEngine = function() {
      _origBind.call(this);
      this.engine.on('questDialogue', (data) => this.showQuestDialogue(data));
    };
  }
}

// ── ENGINE: Turn in a quest (manual completion for legacy quests) ─
E.turnInQuest = function(questId) {
  if (!this.state.quests._readyToComplete?.[questId]) return;
  delete this.state.quests._readyToComplete[questId];
  this.completeQuest(questId);
};

// ── ENGINE: Override abandonQuest ────────────────────────
E.abandonQuest = function(questId) {
  const i = this.state.quests.active.indexOf(questId);
  if (i >= 0) {
    this.state.quests.active.splice(i, 1);
    delete this.state.quests.progress[questId];
    if (this.state.quests.stages) delete this.state.quests.stages[questId];
    if (this.state.quests._readyToComplete) delete this.state.quests._readyToComplete[questId];
    this.emit('questsChanged');
  }
};

// ── NPC: Add Cook Henrick ────────────────────────────────
if (GAME_DATA.npcs && !GAME_DATA.npcs.cook_henrick) {
  GAME_DATA.npcs.cook_henrick = {
    id: 'cook_henrick', name: 'Henrick', portrait: 'henrick', location: 'ashfall_village',
    role: 'Settlement Cook',
    dialogue: {
      greeting: "Oi! Need something cooked? I'm the only chef left who hasn't lost all their fingers.",
      idle: [
        "If the ash gets into the flour one more time, I swear I'll just serve it and call it a feature.",
        "The trick to survival? Never cook on an empty stomach. Worst mistakes happen when you're hungry.",
        "Shrimp's surprisingly common in the underground rivers. Who knew?",
      ],
    },
    questGiver: ['cooks_burden'],
  };
}

// ── ONE-TIME MIGRATION: QP recalc + missing reward items ─
// Runs after engine is fully initialized. Self-marks so it only runs once per version.
const MIGRATION_KEY = '_questMigration_v3_2';

function _runQuestMigration(engine) {
  const s = engine.state;
  if (!s || !s.quests) return;
  if (s[MIGRATION_KEY]) return;

  console.log('[Ashfall] Running quest migration v3.2...');
  let qpBefore = s.questPoints || 0;
  let itemsGranted = [];

  if (!s.quests.stages) s.quests.stages = {};
  if (!s.quests.progress) s.quests.progress = {};
  if (!s.quests._readyToComplete) s.quests._readyToComplete = {};

  // 1. Clean orphaned completed quest IDs (quests that no longer exist in GAME_DATA)
  const orphaned = (s.quests.completed || []).filter(id => !GAME_DATA.quests.find(q => q.id === id));
  if (orphaned.length > 0) {
    console.log(`[Ashfall] Removing ${orphaned.length} orphaned completed quest IDs:`, orphaned);
    s.quests.completed = s.quests.completed.filter(id => GAME_DATA.quests.find(q => q.id === id));
  }

  // 2. Recalculate QP from all VALID completed quests
  let correctQP = 0;
  for (const qId of (s.quests.completed || [])) {
    const q = GAME_DATA.quests.find(x => x.id === qId);
    if (q && q.qp) correctQP += q.qp;
  }
  s.questPoints = correctQP;

  // 3. Grant missing reward items from completed quests
  for (const qId of (s.quests.completed || [])) {
    const q = GAME_DATA.quests.find(x => x.id === qId);
    if (!q || !q.rewards || !q.rewards.items) continue;
    for (const ri of q.rewards.items) {
      const itemId = ri.id || ri.item;
      const qty = ri.qty || 1;
      if (!itemId) continue;
      if ((s.bank[itemId] || 0) === 0) {
        engine.addItem(itemId, qty);
        itemsGranted.push({ name: GAME_DATA.items[itemId]?.name || itemId, qty });
      }
    }
  }

  // 4. Migrate active multi-stage quests missing stage state
  for (const qId of (s.quests.active || [])) {
    const q = GAME_DATA.quests.find(x => x.id === qId);
    if (q && q.stages && q.stages.length > 0 && !s.quests.stages[qId]) {
      const firstObjStage = q.stages.find(st => st.type === 'objectives') || q.stages[0];
      s.quests.stages[qId] = { currentStageId: firstObjStage.id, stageHistory: [] };
    }
  }

  // 5. Clean orphaned active quest IDs
  s.quests.active = (s.quests.active || []).filter(id => GAME_DATA.quests.find(q => q.id === id));

  s[MIGRATION_KEY] = Date.now();

  if (correctQP !== qpBefore || orphaned.length > 0) {
    engine.emit('notification', {
      type: 'achievement',
      text: `Quest Points recalculated: ${correctQP} QP (${s.quests.completed.length} quests)`
    });
  }
  if (itemsGranted.length > 0) {
    const names = itemsGranted.map(i => `${i.name}${i.qty > 1 ? ' x' + i.qty : ''}`);
    engine.emit('notification', {
      type: 'achievement',
      text: `Retroactive quest rewards: ${names.join(', ')}`
    });
  }

  console.log(`[Ashfall] Migration v3.2 complete. QP: ${qpBefore} → ${correctQP}. Orphans removed: ${orphaned.length}. Items granted: ${itemsGranted.length}`);
  engine.emit('questsChanged');
}

// Ensure dialogue event binding + run migration after engine init
setTimeout(() => {
  if (typeof ui !== 'undefined' && ui.engine) {
    ui.engine.on('questDialogue', (data) => {
      if (!document.getElementById('quest-dialogue-overlay')) {
        ui.showQuestDialogue(data);
      }
    });
    // Run one-time migration
    _runQuestMigration(ui.engine);
  } else if (typeof game !== 'undefined') {
    _runQuestMigration(game);
  }
}, 800);

console.log('[Ashfall] quest-system.js v3.1 loaded. Multi-stage quest engine active.');

})();
