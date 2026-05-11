// ============================================================
// ASHFALL ADMIN — ACTUAL DASHBOARD WIDGETS
// These REALLY render with real data
// ============================================================

class DashboardWidgets {
  constructor() {
    this.s = game?.state;
  }

  renderQuickStats() {
    const items = Object.keys(GAME_DATA.items).length;
    const monsters = Object.keys(GAME_DATA.monsters || {}).length;
    const quests = (GAME_DATA.quests || []).length;
    const recipes = Object.values(GAME_DATA.recipes || {}).reduce((a, v) => a + (Array.isArray(v) ? v.length : 0), 0);
    const skills = Object.keys(this.s?.skills || {}).length;

    return `
      <div class="adm-section">
        <h3>📊 Quick Stats</h3>
        <div style="display:grid; grid-template-columns:repeat(5,1fr); gap:12px">
          <div style="background:rgba(125,204,68,0.15); padding:12px; border-radius:6px; text-align:center">
            <div style="font-size:11px; color:var(--text-dim)">Items</div>
            <div style="font-size:24px; font-weight:bold; color:#7dcc44">${items}</div>
          </div>
          <div style="background:rgba(255,107,107,0.15); padding:12px; border-radius:6px; text-align:center">
            <div style="font-size:11px; color:var(--text-dim)">Monsters</div>
            <div style="font-size:24px; font-weight:bold; color:#ff6b6b">${monsters}</div>
          </div>
          <div style="background:rgba(255,215,0,0.15); padding:12px; border-radius:6px; text-align:center">
            <div style="font-size:11px; color:var(--text-dim)">Quests</div>
            <div style="font-size:24px; font-weight:bold; color:#ffd700">${quests}</div>
          </div>
          <div style="background:rgba(201,135,62,0.15); padding:12px; border-radius:6px; text-align:center">
            <div style="font-size:11px; color:var(--text-dim)">Recipes</div>
            <div style="font-size:24px; font-weight:bold; color:#c9873e">${recipes}</div>
          </div>
          <div style="background:rgba(100,150,255,0.15); padding:12px; border-radius:6px; text-align:center">
            <div style="font-size:11px; color:var(--text-dim)">Skills</div>
            <div style="font-size:24px; font-weight:bold; color:#6496ff">${skills}</div>
          </div>
        </div>
      </div>
    `;
  }

  renderRecentEdits() {
    if (typeof changelog === 'undefined') return '';
    const recent = changelog.getRecentActivity?.(8) || [];
    if (recent.length === 0) return `<div class="adm-section"><h3>📝 Recent Edits</h3><div style="color:var(--text-dim)">No edits yet</div></div>`;

    return `
      <div class="adm-section">
        <h3>📝 Recent Edits</h3>
        <div style="max-height:180px; overflow-y:auto; font-size:12px">
          ${recent.map(act => `
            <div style="padding:8px; border-bottom:1px solid rgba(201,135,62,0.1); display:flex; justify-content:space-between">
              <span><strong>${act.action}</strong> by ${act.user}</span>
              <span style="color:var(--text-dim)">${new Date(act.timestamp).toLocaleTimeString()}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderGameHealth() {
    if (typeof gameAnalyzer === 'undefined') return '';
    const health = gameAnalyzer.analyzeGameHealth?.();
    if (!health) return '';

    const score = health.overallScore || 0;
    const color = score > 80 ? '#7dcc44' : score > 60 ? '#ffd700' : '#ff6b6b';

    return `
      <div class="adm-section">
        <h3>❤️ Game Health</h3>
        <div style="background:rgba(0,0,0,0.2); padding:12px; border-radius:6px">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px">
            <div>Overall Score</div>
            <div style="font-size:28px; font-weight:bold; color:${color}">${score.toFixed(0)}%</div>
          </div>
          <div style="background:rgba(0,0,0,0.3); height:8px; border-radius:4px; overflow:hidden">
            <div style="background:${color}; height:100%; width:${score}%; transition:width 0.3s"></div>
          </div>
          ${health.warnings?.length > 0 ? `
            <div style="margin-top:12px; font-size:11px; color:#ff6b6b">
              <strong>⚠️ ${health.warnings.length} issues found</strong>
            </div>
          ` : `<div style="margin-top:12px; font-size:11px; color:#7dcc44">✅ No major issues</div>`}
        </div>
      </div>
    `;
  }

  renderQuickActions() {
    return `
      <div class="adm-section">
        <h3>⚡ Quick Actions</h3>
        <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:8px">
          <button class="btn btn-sm" onclick="ui._admMaxAll(); ui.toast({type:'success',text:'All maxed'}); ui.renderPage('admin')" style="font-size:11px">📈 Max All</button>
          <button class="btn btn-sm" onclick="game.state.gold = (game.state.gold||0) + 1000000; ui.toast({type:'success',text:'+1M gold'}); ui.renderPage('admin')" style="font-size:11px">💰 +1M Gold</button>
          <button class="btn btn-sm" onclick="ui._admFullHeal(); ui.renderPage('admin')" style="font-size:11px">❤️ Heal</button>
          <button class="btn btn-sm" onclick="ui._admGiveAllItems(); ui.renderPage('admin')" style="font-size:11px">📦 All Items</button>
          <button class="btn btn-sm" onclick="ui._admCompleteQuests(); ui.renderPage('admin')" style="font-size:11px">✅ All Quests</button>
          <button class="btn btn-sm" onclick="game.saveGame(); ui.toast({type:'success',text:'Saved'})" style="font-size:11px">💾 Save</button>
        </div>
      </div>
    `;
  }

  renderItemWarnings() {
    const items = GAME_DATA.items || {};
    const warnings = [];

    Object.entries(items).forEach(([id, item]) => {
      if (!item.name) warnings.push({ item: id, issue: 'No name' });
      if (!item.examine) warnings.push({ item: id, issue: 'No examine text' });
      if (item.stats && Object.keys(item.stats).length === 0) warnings.push({ item: id, issue: 'No stats' });
      if (!item.buyPrice && !item.sellPrice) warnings.push({ item: id, issue: 'No price' });
    });

    if (warnings.length === 0) {
      return `<div class="adm-section"><h3>⚠️ Item Warnings</h3><div style="color:#7dcc44">✅ No item issues</div></div>`;
    }

    return `
      <div class="adm-section">
        <h3>⚠️ Item Warnings (${warnings.length})</h3>
        <div style="max-height:160px; overflow-y:auto; font-size:11px">
          ${warnings.slice(0, 20).map(w => `
            <div style="padding:6px; border-bottom:1px solid rgba(255,107,107,0.1)">
              <strong>${w.item}</strong>: ${w.issue}
            </div>
          `).join('')}
          ${warnings.length > 20 ? `<div style="padding:6px; color:var(--text-dim)">...${warnings.length - 20} more</div>` : ''}
        </div>
      </div>
    `;
  }

  renderMonsterWarnings() {
    const monsters = GAME_DATA.monsters || {};
    const warnings = [];

    Object.entries(monsters).forEach(([id, mon]) => {
      if (!mon.name) warnings.push({ monster: id, issue: 'No name' });
      if (!mon.examine) warnings.push({ monster: id, issue: 'No examine' });
      if (mon.lifepoints <= 0) warnings.push({ monster: id, issue: 'Invalid HP' });
      if (!mon.drops || mon.drops.length === 0) warnings.push({ monster: id, issue: 'No drops' });
    });

    if (warnings.length === 0) {
      return `<div class="adm-section"><h3>⚠️ Monster Warnings</h3><div style="color:#7dcc44">✅ No monster issues</div></div>`;
    }

    return `
      <div class="adm-section">
        <h3>⚠️ Monster Warnings (${warnings.length})</h3>
        <div style="max-height:160px; overflow-y:auto; font-size:11px">
          ${warnings.slice(0, 20).map(w => `
            <div style="padding:6px; border-bottom:1px solid rgba(255,107,107,0.1)">
              <strong>${w.monster}</strong>: ${w.issue}
            </div>
          `).join('')}
          ${warnings.length > 20 ? `<div style="padding:6px; color:var(--text-dim)">...${warnings.length - 20} more</div>` : ''}
        </div>
      </div>
    `;
  }

  renderEconomyStats() {
    const s = this.s;
    const totalGoldInGame = s?.gold || 0;
    const bankValue = Object.entries(s?.bank || {}).reduce((sum, [itemId, qty]) => {
      const item = GAME_DATA.items?.[itemId];
      return sum + (item?.sellPrice || 0) * qty;
    }, 0);
    const totalWealth = totalGoldInGame + bankValue;

    return `
      <div class="adm-section">
        <h3>💰 Economy Stats</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px">
          <div style="background:rgba(201,135,62,0.15); padding:12px; border-radius:6px">
            <div style="font-size:11px; color:var(--text-dim)">Gold in Bank</div>
            <div style="font-size:18px; font-weight:bold; color:#c9873e">${ui.fmt(totalGoldInGame)}</div>
          </div>
          <div style="background:rgba(255,215,0,0.15); padding:12px; border-radius:6px">
            <div style="font-size:11px; color:var(--text-dim)">Bank Items Value</div>
            <div style="font-size:18px; font-weight:bold; color:#ffd700">${ui.fmt(bankValue)}</div>
          </div>
          <div style="background:rgba(100,200,100,0.15); padding:12px; border-radius:6px; grid-column:1/-1">
            <div style="font-size:11px; color:var(--text-dim)">Total Wealth</div>
            <div style="font-size:20px; font-weight:bold; color:#64c864">${ui.fmt(totalWealth)}</div>
          </div>
        </div>
      </div>
    `;
  }

  renderContentSummary() {
    const s = this.s;
    const completedQuests = (s?.quests?.completed || []).length;
    const totalQuests = (GAME_DATA.quests || []).length;
    const avgSkillLevel = Object.values(s?.skills || {}).reduce((a, sk) => a + (sk.level || 1), 0) / Object.keys(s?.skills || {}).length;
    const combatLevel = game?.getCombatLevel?.() || 1;

    return `
      <div class="adm-section">
        <h3>📚 Content Summary</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:12px">
          <div>
            <div style="color:var(--text-dim)">Quests Complete</div>
            <div style="font-size:18px; font-weight:bold; color:#7dcc44">${completedQuests} / ${totalQuests}</div>
          </div>
          <div>
            <div style="color:var(--text-dim)">Avg Skill Level</div>
            <div style="font-size:18px; font-weight:bold; color:#6496ff">${avgSkillLevel.toFixed(1)}</div>
          </div>
          <div>
            <div style="color:var(--text-dim)">Combat Level</div>
            <div style="font-size:18px; font-weight:bold; color:#ff6b6b">${combatLevel}</div>
          </div>
          <div>
            <div style="color:var(--text-dim)">Monster Kills</div>
            <div style="font-size:18px; font-weight:bold; color:#c9873e">${ui.fmt(s?.stats?.monstersKilled || 0)}</div>
          </div>
        </div>
      </div>
    `;
  }
}

const dashWidgets = new DashboardWidgets();
