// ============================================================
// ASHFALL IDLE — EXPORT/IMPORT SYSTEM v1.0
// Backup and restore items, monsters, config
// ============================================================

class DataManager {
  exportItems() {
    const data = {
      version: '1.0',
      type: 'items',
      timestamp: new Date().toISOString(),
      count: Object.keys(GAME_DATA.items).length,
      items: GAME_DATA.items
    };

    this.downloadJSON(data, 'items-backup.json');
    adminRoles.logAudit('EXPORT_ITEMS', { count: data.count });
  }

  exportMonsters() {
    const data = {
      version: '1.0',
      type: 'monsters',
      timestamp: new Date().toISOString(),
      count: Object.keys(GAME_DATA.monsters || {}).length,
      monsters: GAME_DATA.monsters
    };

    this.downloadJSON(data, 'monsters-backup.json');
    adminRoles.logAudit('EXPORT_MONSTERS', { count: data.count });
  }

  exportAllData() {
    const data = {
      version: '1.0',
      type: 'full-backup',
      timestamp: new Date().toISOString(),
      items: GAME_DATA.items,
      monsters: GAME_DATA.monsters,
      recipes: GAME_DATA.recipes,
      quests: GAME_DATA.quests,
      config: {
        branding: brandingEditor?.config
      }
    };

    this.downloadJSON(data, `ashfall-backup-${Date.now()}.json`);
    adminRoles.logAudit('EXPORT_FULL', { timestamp: data.timestamp });
  }

  importItems(file) {
    if (!adminRoles.hasPermission('edit:item')) {
      adminRoles.showAccessDenied('import items');
      return;
    }

    this.readJSONFile(file).then(data => {
      if (data.type !== 'items') {
        alert('Wrong file type - expected items backup');
        return;
      }

      const result = confirm(`Import ${data.count} items? Current items will be replaced.`);
      if (!result) return;

      GAME_DATA.items = data.items;
      adminRoles.logAudit('IMPORT_ITEMS', { count: data.count });
      
      if (typeof ui !== 'undefined') {
        ui.toast({ type: 'success', text: `${data.count} items imported` });
        ui.renderPage('admin');
      }
    });
  }

  importMonsters(file) {
    if (!adminRoles.hasPermission('edit:monster')) {
      adminRoles.showAccessDenied('import monsters');
      return;
    }

    this.readJSONFile(file).then(data => {
      if (data.type !== 'monsters') {
        alert('Wrong file type - expected monsters backup');
        return;
      }

      const result = confirm(`Import ${data.count} monsters? Current monsters will be replaced.`);
      if (!result) return;

      GAME_DATA.monsters = data.monsters;
      adminRoles.logAudit('IMPORT_MONSTERS', { count: data.count });
      
      if (typeof ui !== 'undefined') {
        ui.toast({ type: 'success', text: `${data.count} monsters imported` });
        ui.renderPage('admin');
      }
    });
  }

  downloadJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  readJSONFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const data = JSON.parse(e.target.result);
          resolve(data);
        } catch (err) {
          reject('Invalid JSON file');
        }
      };
      reader.onerror = () => reject('File read failed');
      reader.readAsText(file);
    });
  }

  renderBackupUI() {
    return `
      <div class="adm-section">
        <h3>💾 Data Backup & Restore</h3>

        <div style="background:rgba(125,204,68,0.1); padding:12px; border-radius:6px; margin-bottom:12px; border-left:3px solid #7dcc44">
          <h4 style="margin-top:0; color:#7dcc44">⬇️ Export (Download)</h4>
          <div style="display:flex; gap:8px; flex-wrap:wrap">
            <button class="btn btn-sm" onclick="dataManager.exportItems()">📦 Export Items</button>
            <button class="btn btn-sm" onclick="dataManager.exportMonsters()">💀 Export Monsters</button>
            <button class="btn btn-sm" onclick="dataManager.exportAllData()">🗄️ Full Backup</button>
          </div>
          <div style="font-size:11px; color:var(--text-dim); margin-top:8px">Creates JSON file you can save locally</div>
        </div>

        <div style="background:rgba(255,215,0,0.1); padding:12px; border-radius:6px; border-left:3px solid #ffd700">
          <h4 style="margin-top:0; color:#ffd700">⬆️ Import (Upload)</h4>
          
          <div style="margin-bottom:12px">
            <input type="file" id="import-items-file" accept=".json" style="display:none" onchange="dataManager.importItems(this.files[0])">
            <button class="btn btn-sm" onclick="document.getElementById('import-items-file').click()">📦 Import Items</button>
          </div>

          <div style="margin-bottom:12px">
            <input type="file" id="import-monsters-file" accept=".json" style="display:none" onchange="dataManager.importMonsters(this.files[0])">
            <button class="btn btn-sm" onclick="document.getElementById('import-monsters-file').click()">💀 Import Monsters</button>
          </div>

          <div style="font-size:11px; color:var(--text-dim)">Select JSON backup file to restore</div>
        </div>
      </div>
    `;
  }
}

const dataManager = new DataManager();
