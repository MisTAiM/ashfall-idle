// ============================================================
// ASHFALL IDLE — GAME ANALYZER & BALANCE CHECKER v1.0
// Analyze game health, flag balance issues, give recommendations
// ============================================================

class GameAnalyzer {
  analyzeGameHealth() {
    return {
      items: this.analyzeItems(),
      monsters: this.analyzeMonsters(),
      economy: this.analyzeEconomy(),
      content: this.analyzeContent(),
      timestamp: new Date().toISOString()
    };
  }

  analyzeItems() {
    const items = Object.entries(GAME_DATA.items);
    const warnings = [];
    const stats = {
      total: items.length,
      byRarity: {},
      byType: {},
      avgPrice: 0,
      priceRange: { min: Infinity, max: 0 }
    };

    let totalPrice = 0;

    items.forEach(([id, item]) => {
      // Count by rarity
      stats.byRarity[item.rarity] = (stats.byRarity[item.rarity] || 0) + 1;

      // Count by type
      stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;

      // Price analysis
      const price = item.sellPrice || 0;
      totalPrice += price;
      stats.priceRange.min = Math.min(stats.priceRange.min, price);
      stats.priceRange.max = Math.max(stats.priceRange.max, price);

      // Warnings
      if (!item.name) warnings.push(`⚠ Item ${id}: Missing name`);
      if (!item.type) warnings.push(`⚠ Item ${id}: Missing type`);
      if (price < 0) warnings.push(`⚠ Item ${id}: Negative price`);
      
      const stats_obj = item.stats;
      if (stats_obj) {
        if ((stats_obj.attackBonus || 0) > 100) warnings.push(`⚠ Item ${id}: Attack bonus suspiciously high`);
        if ((stats_obj.strengthBonus || 0) > 100) warnings.push(`⚠ Item ${id}: Strength bonus suspiciously high`);
      }
    });

    stats.avgPrice = Math.round(totalPrice / items.length) || 0;

    return { stats, warnings: warnings.slice(0, 10) };
  }

  analyzeMonsters() {
    const monsters = Object.entries(GAME_DATA.monsters || {});
    const warnings = [];
    const stats = {
      total: monsters.length,
      byStyle: {},
      levelRange: { min: Infinity, max: 0 },
      hpRange: { min: Infinity, max: 0 },
      avgXP: 0
    };

    let totalXP = 0;

    monsters.forEach(([id, monster]) => {
      // Count by style
      stats.byStyle[monster.style] = (stats.byStyle[monster.style] || 0) + 1;

      // Level range
      stats.levelRange.min = Math.min(stats.levelRange.min, monster.combatLevel || 0);
      stats.levelRange.max = Math.max(stats.levelRange.max, monster.combatLevel || 0);

      // HP range
      stats.hpRange.min = Math.min(stats.hpRange.min, monster.hp || 0);
      stats.hpRange.max = Math.max(stats.hpRange.max, monster.hp || 0);

      totalXP += monster.xp || 0;

      // Warnings
      if (!monster.name) warnings.push(`⚠ Monster ${id}: Missing name`);
      if (!monster.hp) warnings.push(`⚠ Monster ${id}: Missing HP`);
      if (monster.hp > monster.combatLevel * 10) warnings.push(`⚠ Monster ${id}: HP too high for level`);
      if (!monster.drops || monster.drops.length === 0) warnings.push(`⚠ Monster ${id}: No drops`);
    });

    stats.avgXP = Math.round(totalXP / monsters.length) || 0;

    return { stats, warnings: warnings.slice(0, 10) };
  }

  analyzeEconomy() {
    const stats = {
      totalItemValue: 0,
      itemTypes: {},
      goldPerMonster: { min: Infinity, max: 0, avg: 0 }
    };

    Object.values(GAME_DATA.items).forEach(item => {
      stats.totalItemValue += item.sellPrice || 0;
      stats.itemTypes[item.type] = (stats.itemTypes[item.type] || 0) + 1;
    });

    let totalGold = 0, monsterCount = 0;
    Object.values(GAME_DATA.monsters || {}).forEach(m => {
      const goldMax = m.gold?.max || 0;
      totalGold += goldMax;
      monsterCount++;
      stats.goldPerMonster.min = Math.min(stats.goldPerMonster.min, goldMax);
      stats.goldPerMonster.max = Math.max(stats.goldPerMonster.max, goldMax);
    });

    stats.goldPerMonster.avg = Math.round(totalGold / monsterCount) || 0;

    return stats;
  }

  analyzeContent() {
    return {
      quests: (GAME_DATA.quests || []).length,
      recipes: Object.values(GAME_DATA.recipes || {}).reduce((a, v) => a + (Array.isArray(v) ? v.length : 0), 0),
      npcs: Object.keys(GAME_DATA.npcs || {}).length,
      combatAreas: (GAME_DATA.combatAreas || []).length,
      spells: (GAME_DATA.spells || []).length
    };
  }

  getRecommendations(analysis) {
    const recs = [];

    // Item recommendations
    if (analysis.items.stats.total < 50) {
      recs.push('📦 Add more items – consider expanding the item pool');
    }

    // Monster recommendations
    if (analysis.monsters.stats.total < 20) {
      recs.push('💀 Add more monsters – combat variety is low');
    }

    // Content recommendations
    if (analysis.content.quests < 10) {
      recs.push('📜 Add more quests – players need more content');
    }

    // Economy recommendations
    if (analysis.economy.goldPerMonster.avg < 10) {
      recs.push('💰 Increase gold drops – economy feels tight');
    }

    return recs.slice(0, 5);
  }

  renderAnalysisReport() {
    const analysis = this.analyzeGameHealth();
    const recs = this.getRecommendations(analysis);

    return `
      <div class="adm-section">
        <h3>📊 Game Health Analysis</h3>

        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-bottom:15px">
          <div style="background:rgba(125,204,68,0.1); padding:12px; border-radius:6px; border-left:3px solid #7dcc44">
            <div style="font-size:12px; color:var(--text-dim)">Total Items</div>
            <div style="font-size:24px; font-weight:bold; color:#7dcc44">${analysis.items.stats.total}</div>
          </div>
          <div style="background:rgba(255,107,107,0.1); padding:12px; border-radius:6px; border-left:3px solid #ff6b6b">
            <div style="font-size:12px; color:var(--text-dim)">Total Monsters</div>
            <div style="font-size:24px; font-weight:bold; color:#ff6b6b">${analysis.monsters.stats.total}</div>
          </div>
          <div style="background:rgba(255,215,0,0.1); padding:12px; border-radius:6px; border-left:3px solid #ffd700">
            <div style="font-size:12px; color:var(--text-dim)">Total Quests</div>
            <div style="font-size:24px; font-weight:bold; color:#ffd700">${analysis.content.quests}</div>
          </div>
        </div>

        <h4 style="color:#c9873e; margin-top:15px">📈 Statistics</h4>
        <div style="background:rgba(0,0,0,0.2); padding:12px; border-radius:6px; margin-bottom:15px; font-size:12px">
          <div><strong>Item Types:</strong> ${Object.keys(analysis.items.stats.byType).length} types</div>
          <div><strong>Rarity Distribution:</strong> ${Object.entries(analysis.items.stats.byRarity).map(([r, c]) => `${r}(${c})`).join(', ')}</div>
          <div><strong>Price Range:</strong> ${analysis.items.stats.priceRange.min} - ${analysis.items.stats.priceRange.max} gold</div>
          <div style="margin-top:8px"><strong>Monster Levels:</strong> ${analysis.monsters.stats.levelRange.min} - ${analysis.monsters.stats.levelRange.max}</div>
          <div><strong>Avg XP per Kill:</strong> ${analysis.monsters.stats.avgXP}</div>
          <div><strong>Avg Gold per Monster:</strong> ${analysis.economy.goldPerMonster.avg}</div>
        </div>

        ${analysis.items.warnings.length > 0 ? `
          <h4 style="color:#ff6b6b">⚠️ Item Warnings (${analysis.items.warnings.length})</h4>
          <div style="background:rgba(255,107,107,0.1); padding:10px; border-radius:6px; margin-bottom:15px; font-size:11px">
            ${analysis.items.warnings.map(w => `<div>• ${w}</div>`).join('')}
          </div>
        ` : ''}

        ${analysis.monsters.warnings.length > 0 ? `
          <h4 style="color:#ff6b6b">⚠️ Monster Warnings (${analysis.monsters.warnings.length})</h4>
          <div style="background:rgba(255,107,107,0.1); padding:10px; border-radius:6px; margin-bottom:15px; font-size:11px">
            ${analysis.monsters.warnings.map(w => `<div>• ${w}</div>`).join('')}
          </div>
        ` : ''}

        ${recs.length > 0 ? `
          <h4 style="color:#ffd700">💡 Recommendations</h4>
          <div style="background:rgba(255,215,0,0.1); padding:10px; border-radius:6px; font-size:11px">
            ${recs.map(r => `<div>• ${r}</div>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }
}

const gameAnalyzer = new GameAnalyzer();
