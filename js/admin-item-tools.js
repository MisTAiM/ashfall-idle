// ============================================================
// ASHFALL IDLE — ENHANCED ITEM TOOLS v1.0
// Item duplicate, preview, stat comparison, balance checker
// ============================================================

class EnhancedItemTools {
  duplicateItem(itemId) {
    if (!adminRoles.hasPermission('create:item')) {
      adminRoles.showAccessDenied('create items');
      return;
    }

    const original = GAME_DATA.items[itemId];
    if (!original) {
      if (typeof ui !== 'undefined') {
        ui.toast({ type: 'danger', text: 'Item not found' });
      }
      return;
    }

    // Open create form with pre-filled data
    const newId = `${itemId}_copy_${Date.now()}`;
    const form = {
      id: newId,
      name: original.name + ' (Copy)',
      desc: original.desc || '',
      type: original.type,
      slot: original.slot || '',
      style: original.style || '',
      rarity: original.rarity || 'common',
      sellPrice: original.sellPrice || 0,
      attackSpeed: original.attackSpeed || 2.4,
      heals: original.heals || 0,
      stats: { ...original.stats || {} }
    };

    // Store in temp and open create tab
    window._itemDuplicateData = form;
    if (typeof ui !== 'undefined') {
      ui._admCreateMode = 'item_duplicate';
      ui._admItemDuplicateData = form;
      ui.renderPage('admin');
    }
  }

  getItemStats(itemId) {
    const item = GAME_DATA.items[itemId];
    if (!item) return null;

    return {
      id: itemId,
      name: item.name,
      rarity: item.rarity || 'common',
      type: item.type,
      price: item.sellPrice || 0,
      attackBonus: item.stats?.attackBonus || 0,
      strengthBonus: item.stats?.strengthBonus || 0,
      defenceBonus: item.stats?.defenceBonus || 0,
      magicBonus: item.stats?.magicBonus || 0,
      rangedBonus: item.stats?.rangedBonus || 0,
      damageReduction: item.stats?.damageReduction || 0
    };
  }

  calculateBalanceScore(itemStats) {
    let score = 0;
    score += Math.abs(itemStats.attackBonus) * 0.5;
    score += Math.abs(itemStats.strengthBonus) * 0.7;
    score += Math.abs(itemStats.defenceBonus) * 0.6;
    score += Math.abs(itemStats.magicBonus) * 0.6;
    score += Math.abs(itemStats.rangedBonus) * 0.5;
    score += Math.abs(itemStats.damageReduction) * 0.8;
    return Math.round(score * 10) / 10;
  }

  compareItems(itemId1, itemId2) {
    const item1 = this.getItemStats(itemId1);
    const item2 = this.getItemStats(itemId2);

    if (!item1 || !item2) return null;

    const diff = {
      itemId1,
      itemId2,
      item1,
      item2,
      differences: {
        price: item2.price - item1.price,
        attack: item2.attackBonus - item1.attackBonus,
        strength: item2.strengthBonus - item1.strengthBonus,
        defence: item2.defenceBonus - item1.defenceBonus,
        magic: item2.magicBonus - item1.magicBonus,
        ranged: item2.rangedBonus - item1.rangedBonus,
        damageReduction: item2.damageReduction - item1.damageReduction
      },
      score1: this.calculateBalanceScore(item1),
      score2: this.calculateBalanceScore(item2)
    };

    return diff;
  }

  renderItemPreview(itemId) {
    const item = GAME_DATA.items[itemId];
    if (!item) return '<div style="color:#f00">Item not found</div>';

    const rarity = GAME_DATA.rarities?.[item.rarity];
    const rarityColor = rarity?.color || '#aaa';

    return `
      <div style="background:rgba(0,0,0,0.3); padding:15px; border-radius:6px; border:2px solid ${rarityColor}33">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px">
          <div style="width:80px; height:80px; background:rgba(0,0,0,0.2); border-radius:4px; display:flex; align-items:center; justify-content:center; border:2px solid ${rarityColor}">
            ${item._customImage ? `<img src="${item._customImage}" style="max-width:78px; max-height:78px; object-fit:contain">` : `<div style="font-size:40px">${item.icon || '?'}</div>`}
          </div>
          <div style="flex:1">
            <div style="font-size:16px; font-weight:bold; color:${rarityColor}">${item.name}</div>
            <div style="font-size:12px; color:var(--text-dim); margin-bottom:8px">${item.id}</div>
            <div style="display:flex; gap:8px">
              <span style="background:${rarityColor}44; color:${rarityColor}; padding:2px 8px; border-radius:3px; font-size:11px">${item.rarity || 'common'}</span>
              <span style="background:#66666644; color:#aaa; padding:2px 8px; border-radius:3px; font-size:11px">${item.type || 'item'}</span>
              ${item.slot ? `<span style="background:#88888844; color:#aaa; padding:2px 8px; border-radius:3px; font-size:11px">${item.slot}</span>` : ''}
            </div>
          </div>
        </div>
        
        <div style="font-size:12px; color:var(--text-dim); margin-bottom:12px">${item.desc || ''}</div>

        ${item.stats ? `
          <div style="background:rgba(0,0,0,0.2); padding:10px; border-radius:4px; margin-bottom:12px">
            <div style="font-size:11px; color:#c9873e; margin-bottom:6px">Combat Stats:</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:11px">
              ${item.stats.attackBonus ? `<div>Attack: <strong style="color:#7dcc44">+${item.stats.attackBonus}</strong></div>` : ''}
              ${item.stats.strengthBonus ? `<div>Strength: <strong style="color:#7dcc44">+${item.stats.strengthBonus}</strong></div>` : ''}
              ${item.stats.defenceBonus ? `<div>Defence: <strong style="color:#7dcc44">+${item.stats.defenceBonus}</strong></div>` : ''}
              ${item.stats.magicBonus ? `<div>Magic: <strong style="color:#7dcc44">+${item.stats.magicBonus}</strong></div>` : ''}
              ${item.stats.rangedBonus ? `<div>Ranged: <strong style="color:#7dcc44">+${item.stats.rangedBonus}</strong></div>` : ''}
              ${item.stats.damageReduction ? `<div>Reduction: <strong style="color:#7dcc44">${item.stats.damageReduction}%</strong></div>` : ''}
            </div>
          </div>
        ` : ''}

        <div style="display:flex; justify-content:space-between; font-size:12px">
          <div>Price: <strong>${item.sellPrice || 0} gold</strong></div>
          <div>Balance Score: <strong style="color:#ffd700">${this.calculateBalanceScore(this.getItemStats(itemId))}</strong></div>
        </div>
      </div>
    `;
  }

  renderComparisonUI(itemId1, itemId2) {
    const comparison = this.compareItems(itemId1, itemId2);
    if (!comparison) return '<div style="color:#f00">Cannot compare</div>';

    const { item1, item2, differences, score1, score2 } = comparison;

    return `
      <div style="background:rgba(0,0,0,0.2); padding:15px; border-radius:6px">
        <h4 style="margin-top:0; color:#c9873e">Item Comparison</h4>
        
        <div style="display:grid; grid-template-columns:1fr 50px 1fr; gap:12px; margin-bottom:15px">
          <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:4px">
            <div style="font-weight:bold; color:#c9873e; margin-bottom:8px">${item1.name}</div>
            <div style="font-size:11px; color:var(--text-dim)">Balance: <strong style="color:#ffd700">${score1}</strong></div>
          </div>
          <div style="display:flex; align-items:center; justify-content:center; font-size:20px">⚔</div>
          <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:4px">
            <div style="font-weight:bold; color:#c9873e; margin-bottom:8px">${item2.name}</div>
            <div style="font-size:11px; color:var(--text-dim)">Balance: <strong style="color:#ffd700">${score2}</strong></div>
          </div>
        </div>

        <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:4px; font-size:12px">
          <div style="margin-bottom:8px; padding-bottom:8px; border-bottom:1px solid rgba(201,135,62,0.2)">
            <div>Attack: ${item1.attackBonus} ${this._diffArrow(differences.attack)} ${item2.attackBonus}</div>
            <div>Strength: ${item1.strengthBonus} ${this._diffArrow(differences.strength)} ${item2.strengthBonus}</div>
            <div>Defence: ${item1.defenceBonus} ${this._diffArrow(differences.defence)} ${item2.defenceBonus}</div>
          </div>
          <div>Price: ${item1.price}g ${this._diffArrow(differences.price)} ${item2.price}g</div>
        </div>
      </div>
    `;
  }

  _diffArrow(diff) {
    if (diff > 0) return '<span style="color:#7dcc44">↑</span>';
    if (diff < 0) return '<span style="color:#ff6b6b">↓</span>';
    return '<span style="color:#aaa">→</span>';
  }

  analyzeItemBalance(itemId) {
    const item = this.getItemStats(itemId);
    if (!item) return null;

    const warnings = [];
    const score = this.calculateBalanceScore(item);

    // Check for suspiciously high stats
    if (item.attackBonus > 50) warnings.push('⚠ Attack bonus very high');
    if (item.strengthBonus > 50) warnings.push('⚠ Strength bonus very high');
    if (item.defenceBonus > 50) warnings.push('⚠ Defence bonus very high');

    // Check for negative stats
    if (item.price <= 0 && item.type !== 'quest') warnings.push('⚠ Free item - check intentional');

    // Check rarity match
    const rarityPriceMap = { common: 100, uncommon: 500, rare: 2000, epic: 10000, legendary: 50000, mythic: 100000 };
    const expectedPrice = rarityPriceMap[item.rarity] || 100;
    if (item.price < expectedPrice * 0.5) warnings.push(`⚠ Price too low for ${item.rarity}`);

    return {
      score,
      warnings,
      rating: score < 5 ? '🟢 Low' : score < 15 ? '🟡 Medium' : score < 30 ? '🟠 High' : '🔴 Extreme'
    };
  }
}

// Global instance
const enhancedItemTools = new EnhancedItemTools();
