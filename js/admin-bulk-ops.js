// ============================================================
// ASHFALL IDLE — BULK OPERATIONS v1.0
// Edit multiple items/monsters at once
// ============================================================

class BulkOperations {
  constructor() {
    this.selectedItems = new Set();
    this.selectedMonsters = new Set();
  }

  toggleItemSelection(itemId) {
    if (this.selectedItems.has(itemId)) {
      this.selectedItems.delete(itemId);
    } else {
      this.selectedItems.add(itemId);
    }
  }

  toggleMonsterSelection(monsterId) {
    if (this.selectedMonsters.has(monsterId)) {
      this.selectedMonsters.delete(monsterId);
    } else {
      this.selectedMonsters.add(monsterId);
    }
  }

  selectAllItems() {
    Object.keys(GAME_DATA.items).forEach(id => this.selectedItems.add(id));
  }

  selectAllMonsters() {
    Object.keys(GAME_DATA.monsters || {}).forEach(id => this.selectedMonsters.add(id));
  }

  clearSelection() {
    this.selectedItems.clear();
    this.selectedMonsters.clear();
  }

  bulkChangePrices(items, newPrices) {
    if (!adminRoles.hasPermission('edit:item')) {
      adminRoles.showAccessDenied('edit items');
      return 0;
    }

    let changed = 0;
    items.forEach(itemId => {
      const mult = newPrices[itemId] || 1;
      GAME_DATA.items[itemId].sellPrice = Math.round((GAME_DATA.items[itemId].sellPrice || 0) * mult);
      changed++;
    });

    adminRoles.logAudit('BULK_PRICE_UPDATE', { count: changed });
    return changed;
  }

  bulkChangeRarity(items, newRarity) {
    if (!adminRoles.hasPermission('edit:item')) {
      adminRoles.showAccessDenied('edit items');
      return 0;
    }

    let changed = 0;
    items.forEach(itemId => {
      GAME_DATA.items[itemId].rarity = newRarity;
      changed++;
    });

    adminRoles.logAudit('BULK_RARITY_UPDATE', { count: changed, rarity: newRarity });
    return changed;
  }

  bulkDeleteItems(items) {
    if (!adminRoles.hasPermission('delete:item')) {
      adminRoles.showAccessDenied('delete items');
      return 0;
    }

    if (!confirm(`Delete ${items.length} items? This cannot be undone.`)) return 0;

    let deleted = 0;
    items.forEach(itemId => {
      delete GAME_DATA.items[itemId];
      deleted++;
    });

    adminRoles.logAudit('BULK_ITEM_DELETE', { count: deleted });
    return deleted;
  }

  bulkDeleteMonsters(monsters) {
    if (!adminRoles.hasPermission('delete:monster')) {
      adminRoles.showAccessDenied('delete monsters');
      return 0;
    }

    if (!confirm(`Delete ${monsters.length} monsters? This cannot be undone.`)) return 0;

    let deleted = 0;
    monsters.forEach(monsterId => {
      delete GAME_DATA.monsters[monsterId];
      deleted++;
    });

    adminRoles.logAudit('BULK_MONSTER_DELETE', { count: deleted });
    return deleted;
  }

  renderBulkPanel() {
    return `
      <div class="adm-section">
        <h3>⚡ Bulk Operations</h3>
        
        <div style="margin-bottom:12px">
          <strong>Selected Items: ${this.selectedItems.size}</strong>
          ${this.selectedItems.size > 0 ? `
            <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:8px">
              <button class="btn btn-xs" onclick="bulkOps.bulkChangePrices(Array.from(bulkOps.selectedItems), {'*': 1.1}); ui.toast({type:'success', text:'Prices increased 10%'}); ui.renderPage('admin')">📈 +10% Price</button>
              <button class="btn btn-xs" onclick="bulkOps.bulkChangePrices(Array.from(bulkOps.selectedItems), {'*': 0.9}); ui.toast({type:'success', text:'Prices decreased 10%'}); ui.renderPage('admin')">📉 -10% Price</button>
              <button class="btn btn-xs" onclick="bulkOps.bulkChangeRarity(Array.from(bulkOps.selectedItems), 'rare'); ui.toast({type:'success', text:'Changed to rare'}); ui.renderPage('admin')">🔷 Set Rare</button>
              <button class="btn btn-xs btn-danger" onclick="let c = bulkOps.bulkDeleteItems(Array.from(bulkOps.selectedItems)); if(c>0){ui.toast({type:'success', text:c+' items deleted'}); ui.renderPage('admin')}">🗑 Delete All</button>
              <button class="btn btn-xs" onclick="bulkOps.clearSelection(); ui.renderPage('admin')">✕ Clear</button>
            </div>
          ` : ''}
        </div>

        <div style="margin-bottom:12px">
          <strong>Selected Monsters: ${this.selectedMonsters.size}</strong>
          ${this.selectedMonsters.size > 0 ? `
            <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:8px">
              <button class="btn btn-xs" onclick="bulkOps.bulkDeleteMonsters(Array.from(bulkOps.selectedMonsters)); ui.renderPage('admin')">🗑 Delete All</button>
              <button class="btn btn-xs" onclick="bulkOps.clearSelection(); ui.renderPage('admin')">✕ Clear</button>
            </div>
          ` : ''}
        </div>

        <div style="background:rgba(0,0,0,0.2); padding:10px; border-radius:6px; font-size:12px; color:var(--text-dim)">
          💡 Click items/monsters to select them, then use bulk actions above
        </div>
      </div>
    `;
  }
}

const bulkOps = new BulkOperations();
