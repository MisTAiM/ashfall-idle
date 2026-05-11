// ============================================================
// ASHFALL IDLE — MEDIA MANAGER v1.0
// Image gallery, batch upload, cropping, organization
// ============================================================

class MediaManager {
  constructor() {
    this.uploads = {};
    this.imageCache = {};
  }

  renderGallery() {
    if (!adminRoles.hasPermission('view:images')) {
      return '<div style="color:#f00">Access denied</div>';
    }

    let html = `
      <div class="adm-section">
        <h3>🖼 Media Library</h3>
        
        <div style="margin-bottom:15px; padding:15px; background:rgba(201,135,62,0.1); border:2px dashed rgba(201,135,62,0.4); border-radius:6px; text-align:center; cursor:pointer" onclick="document.getElementById('batch-upload').click()" id="upload-drop-zone">
          <div style="font-size:16px; margin-bottom:8px">📤 Drag files here or click to upload</div>
          <div style="font-size:12px; color:var(--text-dim)">PNG, JPG, WebP, SVG (max 5 files)</div>
          <input type="file" id="batch-upload" multiple accept="image/*" style="display:none" onchange="mediaManager.handleBatchUpload(this.files)">
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(120px, 1fr)); gap:10px">
          ${this.getAllImages().map(img => `
            <div style="background:rgba(0,0,0,0.3); border-radius:6px; overflow:hidden; position:relative; aspect-ratio:1">
              <img src="${img.dataUrl}" style="width:100%; height:100%; object-fit:cover; cursor:pointer" title="${img.name}" onclick="mediaManager.showImageModal('${img.id}')">
              <div style="position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,0.8); padding:4px; font-size:10px; color:#aaa; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap">${img.name}</div>
              <button class="btn btn-xs" style="position:absolute; top:4px; right:4px; opacity:0.8" onclick="mediaManager.deleteImage('${img.id}')">✕</button>
            </div>
          `).join('')}
        </div>

        ${Object.keys(GAME_DATA.items).filter(id => GAME_DATA.items[id]._customImage).length > 0 ? `
          <h4 style="margin-top:20px; color:#c9873e">Item Images (${Object.keys(GAME_DATA.items).filter(id => GAME_DATA.items[id]._customImage).length})</h4>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(80px, 1fr)); gap:8px">
            ${Object.entries(GAME_DATA.items).filter(([id, item]) => item._customImage).map(([id, item]) => `
              <div style="background:rgba(0,0,0,0.3); border-radius:4px; padding:4px; text-align:center">
                <img src="${item._customImage}" style="width:64px; height:64px; object-fit:contain; margin-bottom:4px">
                <div style="font-size:10px; color:#aaa">${item.name.substring(0, 10)}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        ${Object.keys(GAME_DATA.monsterArt || {}).length > 0 ? `
          <h4 style="margin-top:20px; color:#c9873e">Monster Images (${Object.keys(GAME_DATA.monsterArt || {}).length})</h4>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(100px, 1fr)); gap:8px">
            ${Object.entries(GAME_DATA.monsterArt).slice(0, 20).map(([id, art]) => `
              <div style="background:rgba(0,0,0,0.3); border-radius:4px; padding:4px; text-align:center; font-size:40px; height:100px; display:flex; align-items:center; justify-content:center; border:1px solid rgba(201,135,62,0.2)">
                ${art.includes('<img') ? '<img src="' + art.match(/src="([^"]+)"/)?.[1] + '" style="height:80px; max-width:80px; object-fit:contain">' : 'SVG'}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;

    return html;
  }

  getAllImages() {
    const images = [];
    
    // Collect item images
    Object.entries(GAME_DATA.items).forEach(([id, item]) => {
      if (item._customImage) {
        images.push({ id: `item_${id}`, name: item.name, dataUrl: item._customImage });
      }
    });

    // Collect monster images (if stored as dataUrl)
    Object.entries(GAME_DATA.monsterArt || {}).forEach(([id, art]) => {
      if (art.startsWith('data:')) {
        images.push({ id: `monster_${id}`, name: id, dataUrl: art });
      }
    });

    return images;
  }

  async handleBatchUpload(files) {
    if (!adminRoles.hasPermission('upload:image')) {
      adminRoles.showAccessDenied('upload images');
      return;
    }

    if (files.length > 5) {
      if (typeof ui !== 'undefined') {
        ui.toast({ type: 'warning', text: 'Max 5 files at once' });
      }
      return;
    }

    let successCount = 0;
    for (const file of files) {
      try {
        const result = await this.resizeImage(file);
        // Store in temp - user assigns to item/monster in next step
        this.uploads[Date.now() + Math.random()] = result;
        successCount++;
      } catch (e) {
        console.error('Upload failed:', e);
      }
    }

    if (typeof ui !== 'undefined') {
      ui.toast({ type: 'success', text: `${successCount}/${files.length} uploaded` });
      ui.renderPage('admin');
    }
  }

  resizeImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          const maxW = 512, maxH = 512;
          if (w > maxW || h > maxH) {
            const scale = Math.min(maxW / w, maxH / h);
            w = Math.floor(w * scale);
            h = Math.floor(h * scale);
          }
          canvas.width = w;
          canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          
          resolve({
            dataUrl: canvas.toDataURL('image/png', 0.90),
            width: w,
            height: h,
            fileName: file.name
          });
        };
        img.onerror = () => reject('Invalid image');
        img.src = e.target.result;
      };
      reader.onerror = () => reject('File read failed');
      reader.readAsDataURL(file);
    });
  }

  showImageModal(imageId) {
    const images = this.getAllImages();
    const image = images.find(img => img.id === imageId);
    if (!image) return;

    const modal = `
      <div style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.9); z-index:9999; display:flex; align-items:center; justify-content:center; padding:20px" onclick="if(event.target===this)this.remove()">
        <div style="background:#1a1b20; border:2px solid #c9873e; border-radius:8px; padding:20px; max-width:90vw; max-height:90vh; display:flex; flex-direction:column">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px">
            <h3 style="margin:0; color:#c9873e">${image.name}</h3>
            <button class="btn btn-xs" onclick="this.closest('[style*=background:rgba]').remove()">✕</button>
          </div>
          <img src="${image.dataUrl}" style="max-width:600px; max-height:500px; object-fit:contain; border-radius:6px; margin-bottom:15px">
          <div style="display:flex; gap:8px; justify-content:flex-end">
            <button class="btn btn-sm" onclick="mediaManager.downloadImage('${image.id}')">⬇ Download</button>
            <button class="btn btn-sm btn-danger" onclick="mediaManager.deleteImage('${image.id}');this.closest('[style*=background:rgba]').remove()">🗑 Delete</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modal);
  }

  downloadImage(imageId) {
    const images = this.getAllImages();
    const image = images.find(img => img.id === imageId);
    if (!image) return;

    const a = document.createElement('a');
    a.href = image.dataUrl;
    a.download = `${image.name}.png`;
    a.click();
  }

  deleteImage(imageId) {
    if (!adminRoles.hasPermission('delete:image')) {
      adminRoles.showAccessDenied('delete images');
      return;
    }

    if (!confirm('Delete this image?')) return;

    const [type, id] = imageId.split('_');
    
    if (type === 'item') {
      delete GAME_DATA.items[id]._customImage;
    } else if (type === 'monster') {
      delete GAME_DATA.monsterArt[id];
    }

    adminRoles.logAudit('IMAGE_DELETE', { imageId });
    if (typeof ui !== 'undefined') {
      ui.toast({ type: 'success', text: 'Image deleted' });
      ui.renderPage('admin');
    }
  }

  setupDragAndDrop() {
    const zone = document.getElementById('upload-drop-zone');
    if (!zone) return;

    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.style.background = 'rgba(201,135,62,0.2)';
    });

    zone.addEventListener('dragleave', () => {
      zone.style.background = '';
    });

    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.style.background = '';
      this.handleBatchUpload(e.dataTransfer.files);
    });
  }
}

// Global instance
const mediaManager = new MediaManager();
