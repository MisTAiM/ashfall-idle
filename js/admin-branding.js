// ============================================================
// ASHFALL IDLE — BRANDING EDITOR v1.0
// Logo, favicon, colors, title management
// ============================================================

class BrandingEditor {
  constructor() {
    this.config = {
      logo: null,
      favicon: null,
      gameTitle: 'Ashfall Idle',
      accentColor: '#c9873e',
      secondaryColor: '#ff6b6b',
      customCSS: ''
    };
    this.init();
  }

  async init() {
    if (!online?.db) return;
    
    try {
      const snap = await online.db.ref('/config/branding').once('value');
      const data = snap.val();
      if (data) {
        this.config = { ...this.config, ...data };
        this.apply();
      }
    } catch (e) {
      console.error('[Branding] Load failed:', e);
    }
  }

  apply() {
    // Update page title
    if (this.config.gameTitle) {
      document.title = this.config.gameTitle;
    }

    // Update favicon
    if (this.config.favicon) {
      let link = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = this.config.favicon;
    }

    // Update accent colors
    if (this.config.accentColor) {
      document.documentElement.style.setProperty('--accent', this.config.accentColor);
    }
    if (this.config.secondaryColor) {
      document.documentElement.style.setProperty('--accent-secondary', this.config.secondaryColor);
    }

    // Apply custom CSS
    if (this.config.customCSS) {
      let style = document.getElementById('branding-custom-css');
      if (!style) {
        style = document.createElement('style');
        style.id = 'branding-custom-css';
        document.head.appendChild(style);
      }
      style.textContent = this.config.customCSS;
    }

    // Update sidebar logo if exists
    const logoDiv = document.querySelector('.sidebar-logo-area');
    if (logoDiv && this.config.logo) {
      logoDiv.innerHTML = `<img src="${this.config.logo}" style="max-width:160px; max-height:80px; object-fit: contain;">`;
    }
  }

  async save() {
    if (!adminRoles.hasPermission('edit:settings')) {
      adminRoles.showAccessDenied('edit branding');
      return;
    }

    try {
      await online.db.ref('/config/branding').set(this.config);
      adminRoles.logAudit('BRANDING_UPDATE', this.config);
      
      if (typeof ui !== 'undefined') {
        ui.toast({ type: 'success', text: 'Branding updated!' });
      }
      
      this.apply();
      return true;
    } catch (e) {
      console.error('[Branding] Save failed:', e);
      if (typeof ui !== 'undefined') {
        ui.toast({ type: 'danger', text: 'Save failed: ' + e.message });
      }
      return false;
    }
  }

  async uploadLogo(file) {
    if (!file) return;
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Resize to max 500x250
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          const maxW = 500, maxH = 250;
          if (w > maxW || h > maxH) {
            const scale = Math.min(maxW / w, maxH / h);
            w = Math.floor(w * scale);
            h = Math.floor(h * scale);
          }
          canvas.width = w;
          canvas.height = h;
          canvas.getContext('2d').drawImage(img, 0, 0, w, h);
          
          this.config.logo = canvas.toDataURL('image/png', 0.9);
          resolve(this.config.logo);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  async uploadFavicon(file) {
    if (!file) return;
    
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Resize to 64x64 for favicon
          const canvas = document.createElement('canvas');
          canvas.width = 64;
          canvas.height = 64;
          canvas.getContext('2d').drawImage(img, 0, 0, 64, 64);
          
          this.config.favicon = canvas.toDataURL('image/png', 0.95);
          resolve(this.config.favicon);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  renderUI() {
    return `
      <div class="adm-section" style="max-width:600px">
        <h3>🎨 Game Branding & Appearance</h3>
        
        <div style="margin-bottom:20px; padding:15px; background:rgba(201,135,62,0.1); border:1px solid rgba(201,135,62,0.2); border-radius:6px">
          <h4 style="margin-top:0; color:#c9873e">Logo Preview</h4>
          <div id="branding-logo-preview" style="width:100%; height:120px; background:rgba(0,0,0,0.2); border-radius:4px; display:flex; align-items:center; justify-content:center; margin-bottom:10px">
            ${this.config.logo ? `<img src="${this.config.logo}" style="max-width:100%; max-height:100%; object-fit:contain">` : '<div style="color:#666">No logo</div>'}
          </div>
          <div style="display:flex; gap:8px">
            <input type="file" id="branding-logo-upload" accept="image/*" style="display:none" onchange="brandingEditor.uploadLogo(this.files[0]).then(()=>brandingEditor.renderBrandingTab())">
            <button class="btn btn-sm" onclick="document.getElementById('branding-logo-upload').click()">📤 Upload Logo</button>
            ${this.config.logo ? `<button class="btn btn-sm btn-danger" onclick="brandingEditor.config.logo=null;brandingEditor.renderBrandingTab()">Delete</button>` : ''}
          </div>
        </div>

        <div style="margin-bottom:20px; padding:15px; background:rgba(201,135,62,0.1); border:1px solid rgba(201,135,62,0.2); border-radius:6px">
          <h4 style="margin-top:0; color:#c9873e">Favicon Preview</h4>
          <div id="branding-favicon-preview" style="width:80px; height:80px; background:rgba(0,0,0,0.2); border-radius:4px; display:flex; align-items:center; justify-content:center; margin-bottom:10px">
            ${this.config.favicon ? `<img src="${this.config.favicon}" style="width:64px; height:64px">` : '<div style="color:#666">No favicon</div>'}
          </div>
          <div style="display:flex; gap:8px">
            <input type="file" id="branding-favicon-upload" accept="image/*" style="display:none" onchange="brandingEditor.uploadFavicon(this.files[0]).then(()=>brandingEditor.renderBrandingTab())">
            <button class="btn btn-sm" onclick="document.getElementById('branding-favicon-upload').click()">📤 Upload Favicon</button>
            ${this.config.favicon ? `<button class="btn btn-sm btn-danger" onclick="brandingEditor.config.favicon=null;brandingEditor.renderBrandingTab()">Delete</button>` : ''}
          </div>
        </div>

        <div class="adm-edit-grid">
          <label>Game Title</label>
          <input type="text" id="branding-title" class="bank-search-input" value="${this.config.gameTitle}" placeholder="Ashfall Idle" oninput="brandingEditor.config.gameTitle=this.value">
          
          <label>Accent Color (Primary)</label>
          <input type="color" id="branding-accent" class="bank-search-input" value="${this.config.accentColor}" onchange="brandingEditor.config.accentColor=this.value">
          
          <label>Secondary Color</label>
          <input type="color" id="branding-secondary" class="bank-search-input" value="${this.config.secondaryColor}" onchange="brandingEditor.config.secondaryColor=this.value">
          
          <label style="grid-column:1/-1; color:#c9873e; margin-top:10px">Advanced: Custom CSS</label>
          <textarea id="branding-css" class="bank-search-input" style="grid-column:1/-1; height:120px; font-family:monospace; font-size:12px" placeholder=".sidebar { background: custom; }" oninput="brandingEditor.config.customCSS=this.value">${this.config.customCSS}</textarea>
        </div>

        <div style="margin-top:16px; display:flex; gap:8px">
          <button class="btn btn-sm" onclick="brandingEditor.save()">💾 Save Changes</button>
          <button class="btn btn-sm" onclick="brandingEditor.apply()">👁 Preview</button>
        </div>

        <div style="margin-top:12px; font-size:11px; color:var(--text-dim)">
          💡 Changes apply in real-time. Browser restart needed for favicon change to show.
        </div>
      </div>
    `;
  }

  renderBrandingTab() {
    if (typeof ui !== 'undefined') {
      ui.renderPage('admin');
    }
  }
}

// Global instance
const brandingEditor = new BrandingEditor();
