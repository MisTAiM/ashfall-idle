// ============================================================
// ASHFALL IDLE - Sprite System (Procedural SVG icons per item)
// ============================================================

const SPRITE_PALETTE = {
  bronze:'#a06a3c',iron:'#7a8294',steel:'#9da4b4',mithril:'#7ab8c8',adamant:'#4a8a5e',obsidian:'#2a1530',ashfire:'#d63a1a',dragon:'#5a8a3e',silver:'#c8d4e0',
  red:'#c44040',blue:'#4a7ec4',green:'#3a9e5c',yellow:'#c4a83a',purple:'#8a5ec4',pale:'#d4d8e0',brown:'#7a4a2a',dark:'#3a2a1a',gold:'#d4a83a',black:'#1a1a1f',white:'#e8eaf2',copper:'#c47a3a',tin:'#a4a8b4',coal:'#1f1f25',orange:'#d67338',
};

function spriteFor(spriteId) {
  if (!spriteId) return defaultSprite();
  const [type, variant] = spriteId.split('-');
  const color = SPRITE_PALETTE[variant] || '#8a8e9c';

  switch (type) {
    case 'log': return `<svg viewBox="0 0 32 32"><ellipse cx="8" cy="16" rx="4" ry="6" fill="${color}" stroke="${shade(color,-30)}" stroke-width="1"/><rect x="8" y="10" width="18" height="12" fill="${color}" stroke="${shade(color,-30)}" stroke-width="1"/><ellipse cx="26" cy="16" rx="3" ry="6" fill="${shade(color,-15)}"/><circle cx="26" cy="16" r="2" fill="${shade(color,-30)}"/></svg>`;
    case 'ore': return `<svg viewBox="0 0 32 32"><polygon points="6,22 10,8 18,6 26,12 24,24 14,26" fill="${color}" stroke="${shade(color,-30)}" stroke-width="1"/><polygon points="10,18 14,12 20,16 18,22" fill="${shade(color,15)}" opacity="0.7"/></svg>`;
    case 'bar': return `<svg viewBox="0 0 32 32"><rect x="4" y="12" width="24" height="8" fill="${color}" stroke="${shade(color,-30)}" stroke-width="1" rx="1"/><rect x="4" y="12" width="24" height="3" fill="${shade(color,20)}" opacity="0.6"/></svg>`;
    case 'gem': return `<svg viewBox="0 0 32 32"><polygon points="16,4 26,12 22,26 10,26 6,12" fill="${color}" stroke="${shade(color,-30)}" stroke-width="1"/><polygon points="16,4 26,12 22,16 16,12" fill="${shade(color,30)}" opacity="0.7"/><polygon points="16,4 6,12 10,16 16,12" fill="${shade(color,15)}" opacity="0.5"/></svg>`;
    case 'fish': return `<svg viewBox="0 0 32 32"><path d="M4 16 L10 12 L22 12 Q28 14 28 16 Q28 18 22 20 L10 20 Z" fill="${variant==='boss'?'#5a3030':variant==='deep'?'#2a3a4a':'#7a8a9a'}" stroke="#000" stroke-width="1"/><path d="M4 16 L0 12 L0 20 Z" fill="${variant==='boss'?'#5a3030':variant==='deep'?'#2a3a4a':'#7a8a9a'}"/><circle cx="22" cy="14" r="1.5" fill="#000"/></svg>`;
    case 'food': return `<svg viewBox="0 0 32 32"><circle cx="16" cy="20" r="10" fill="${variant==='veg'?'#a06a3c':'#c47a3a'}" stroke="${shade('#7a4a2a',-30)}" stroke-width="1"/><ellipse cx="16" cy="16" rx="8" ry="3" fill="${shade(variant==='veg'?'#a06a3c':'#c47a3a',20)}"/></svg>`;
    case 'herb': return `<svg viewBox="0 0 32 32"><path d="M16 28 L16 14" stroke="${shade(color,-50)}" stroke-width="2"/><ellipse cx="11" cy="12" rx="4" ry="6" fill="${color}" transform="rotate(-30 11 12)"/><ellipse cx="21" cy="12" rx="4" ry="6" fill="${color}" transform="rotate(30 21 12)"/><ellipse cx="16" cy="8" rx="3" ry="5" fill="${shade(color,15)}"/></svg>`;
    case 'potion': return `<svg viewBox="0 0 32 32"><path d="M12 6 L20 6 L20 12 L24 22 Q24 26 20 26 L12 26 Q8 26 8 22 L12 12 Z" fill="${color}" stroke="#1a1a1f" stroke-width="1"/><rect x="11" y="4" width="10" height="3" fill="#5a4a3a"/><ellipse cx="16" cy="20" rx="5" ry="3" fill="${shade(color,30)}" opacity="0.6"/></svg>`;
    case 'rune': return `<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="11" fill="${shade(color,-40)}" stroke="${color}" stroke-width="1.5"/><path d="M11 11 L21 21 M21 11 L11 21" stroke="${color}" stroke-width="2"/><circle cx="16" cy="16" r="3" fill="${color}"/></svg>`;
    case 'arrow': return `<svg viewBox="0 0 32 32"><line x1="6" y1="22" x2="24" y2="10" stroke="#7a4a2a" stroke-width="2"/><polygon points="24,10 28,8 26,14" fill="${color}" stroke="#000" stroke-width="0.5"/><polygon points="6,22 4,26 8,24" fill="#3a4a3a"/></svg>`;
    case 'sword': return `<svg viewBox="0 0 32 32"><polygon points="16,2 19,5 19,22 13,22 13,5" fill="${color}" stroke="#1a1a1f" stroke-width="1"/><line x1="16" y1="2" x2="16" y2="22" stroke="${shade(color,40)}" stroke-width="1"/><rect x="9" y="22" width="14" height="2" fill="#5a4a3a"/><rect x="14" y="24" width="4" height="6" fill="#3a2a1a"/></svg>`;
    case 'axe': return `<svg viewBox="0 0 32 32"><line x1="16" y1="6" x2="16" y2="28" stroke="#5a3a1a" stroke-width="2"/><path d="M14 6 Q4 8 6 16 Q14 14 16 12 Z" fill="${color}" stroke="#1a1a1f" stroke-width="1"/><path d="M18 6 Q28 8 26 16 Q18 14 16 12 Z" fill="${color}" stroke="#1a1a1f" stroke-width="1"/></svg>`;
    case 'mace': return `<svg viewBox="0 0 32 32"><line x1="16" y1="14" x2="16" y2="28" stroke="#5a3a1a" stroke-width="2"/><circle cx="16" cy="10" r="6" fill="${color}" stroke="#1a1a1f" stroke-width="1"/><path d="M16 4 L18 7 L16 10 L14 7 Z M22 10 L19 12 L16 10 L19 8 Z M16 16 L14 13 L16 10 L18 13 Z M10 10 L13 8 L16 10 L13 12 Z" fill="${shade(color,-20)}"/></svg>`;
    case 'dagger': return `<svg viewBox="0 0 32 32"><polygon points="16,4 18,7 18,18 14,18 14,7" fill="${color}" stroke="#1a1a1f" stroke-width="1"/><rect x="11" y="18" width="10" height="2" fill="#5a4a3a"/><rect x="14" y="20" width="4" height="6" fill="#3a2a1a"/></svg>`;
    case 'bow': return `<svg viewBox="0 0 32 32"><path d="M8 4 Q22 4 22 16 Q22 28 8 28" fill="none" stroke="${color}" stroke-width="2"/><line x1="8" y1="4" x2="8" y2="28" stroke="#d4d8e0" stroke-width="1"/></svg>`;
    case 'wand': return `<svg viewBox="0 0 32 32"><line x1="6" y1="26" x2="22" y2="10" stroke="#5a3a1a" stroke-width="2"/><polygon points="22,10 26,6 28,8 24,12" fill="${color}" stroke="#1a1a1f" stroke-width="0.5"/><circle cx="25" cy="9" r="2" fill="${shade(color,40)}" opacity="0.7"/></svg>`;
    case 'staff': return `<svg viewBox="0 0 32 32"><line x1="16" y1="8" x2="16" y2="30" stroke="#5a3a1a" stroke-width="2"/><circle cx="16" cy="6" r="5" fill="${color}" stroke="#1a1a1f" stroke-width="1"/><circle cx="16" cy="6" r="2" fill="${shade(color,40)}"/></svg>`;
    case 'shield': return `<svg viewBox="0 0 32 32"><path d="M16 4 L26 8 L26 18 Q26 24 16 28 Q6 24 6 18 L6 8 Z" fill="${color}" stroke="#1a1a1f" stroke-width="1.5"/><path d="M16 8 L22 10 L22 18 Q22 22 16 24 Q10 22 10 18 L10 10 Z" fill="none" stroke="${shade(color,30)}" stroke-width="1"/></svg>`;
    case 'helm': return `<svg viewBox="0 0 32 32"><path d="M8 14 Q8 6 16 6 Q24 6 24 14 L24 22 L20 22 L20 18 L18 18 L18 22 L14 22 L14 18 L12 18 L12 22 L8 22 Z" fill="${color}" stroke="#1a1a1f" stroke-width="1"/></svg>`;
    case 'body': return `<svg viewBox="0 0 32 32"><path d="M8 6 L24 6 L26 12 L26 26 L20 26 L20 18 L12 18 L12 26 L6 26 L6 12 Z" fill="${color}" stroke="#1a1a1f" stroke-width="1"/><circle cx="16" cy="14" r="2" fill="${shade(color,-30)}"/></svg>`;
    case 'legs': return `<svg viewBox="0 0 32 32"><rect x="8" y="6" width="16" height="6" fill="${color}" stroke="#1a1a1f" stroke-width="1"/><polygon points="8,12 14,12 13,28 9,28" fill="${color}" stroke="#1a1a1f" stroke-width="1"/><polygon points="18,12 24,12 23,28 19,28" fill="${color}" stroke="#1a1a1f" stroke-width="1"/></svg>`;
    case 'cowl': return `<svg viewBox="0 0 32 32"><path d="M6 8 Q16 4 26 8 L26 24 Q22 28 16 28 Q10 28 6 24 Z" fill="${color}" stroke="#1a1a1f" stroke-width="1"/><circle cx="16" cy="18" r="5" fill="${shade(color,-30)}"/></svg>`;
    case 'chaps': return `<svg viewBox="0 0 32 32"><polygon points="8,6 14,6 14,28 10,28" fill="${color}" stroke="#1a1a1f" stroke-width="1"/><polygon points="18,6 24,6 22,28 18,28" fill="${color}" stroke="#1a1a1f" stroke-width="1"/></svg>`;
    case 'hat': return `<svg viewBox="0 0 32 32"><path d="M16 4 L20 22 L12 22 Z" fill="${color}" stroke="#1a1a1f" stroke-width="1"/><ellipse cx="16" cy="22" rx="12" ry="3" fill="${shade(color,-20)}" stroke="#1a1a1f" stroke-width="1"/></svg>`;
    case 'robe': return `<svg viewBox="0 0 32 32"><path d="M10 6 L22 6 L26 16 L24 28 L8 28 L6 16 Z" fill="${color}" stroke="#1a1a1f" stroke-width="1"/><line x1="16" y1="6" x2="16" y2="28" stroke="${shade(color,-20)}" stroke-width="1"/></svg>`;
    case 'skirt': return `<svg viewBox="0 0 32 32"><path d="M10 6 L22 6 L26 28 L6 28 Z" fill="${color}" stroke="#1a1a1f" stroke-width="1"/></svg>`;
    case 'boots': return `<svg viewBox="0 0 32 32"><path d="M8 8 L16 8 L16 22 L24 22 L24 28 L8 28 Z" fill="${color}" stroke="#1a1a1f" stroke-width="1"/></svg>`;
    case 'gloves': return `<svg viewBox="0 0 32 32"><path d="M10 8 L22 8 L24 20 Q24 26 20 26 L12 26 Q8 26 8 20 Z" fill="${color}" stroke="#1a1a1f" stroke-width="1"/><line x1="13" y1="12" x2="13" y2="20" stroke="${shade(color,-30)}" stroke-width="1"/><line x1="16" y1="12" x2="16" y2="20" stroke="${shade(color,-30)}" stroke-width="1"/><line x1="19" y1="12" x2="19" y2="20" stroke="${shade(color,-30)}" stroke-width="1"/></svg>`;
    case 'cape': return `<svg viewBox="0 0 32 32"><path d="M10 4 L22 4 L26 28 L6 28 Z" fill="${color}" stroke="#1a1a1f" stroke-width="1"/><line x1="16" y1="4" x2="16" y2="28" stroke="${shade(color,-30)}" stroke-width="1"/></svg>`;
    case 'ring': return `<svg viewBox="0 0 32 32"><circle cx="16" cy="18" r="8" fill="none" stroke="${SPRITE_PALETTE.gold}" stroke-width="3"/><polygon points="16,8 19,12 16,16 13,12" fill="${color}" stroke="#1a1a1f" stroke-width="0.5"/></svg>`;
    case 'amulet': return `<svg viewBox="0 0 32 32"><path d="M6 6 Q16 4 26 6" fill="none" stroke="${SPRITE_PALETTE.gold}" stroke-width="1.5"/><polygon points="16,12 22,18 16,28 10,18" fill="${color}" stroke="#1a1a1f" stroke-width="1"/><circle cx="16" cy="18" r="2" fill="${shade(color,30)}"/></svg>`;
    case 'misc':
      if (variant === 'feather') return `<svg viewBox="0 0 32 32"><path d="M16 4 Q22 8 22 18 Q20 24 16 28 Q12 24 10 18 Q10 8 16 4 Z" fill="#d4d8e0" stroke="#7a8e9e" stroke-width="1"/><line x1="16" y1="4" x2="16" y2="28" stroke="#7a8e9e" stroke-width="1"/></svg>`;
      if (variant === 'leather') return `<svg viewBox="0 0 32 32"><polygon points="6,8 26,6 28,22 24,28 8,26 4,18" fill="#7a4a2a" stroke="#3a2a1a" stroke-width="1"/></svg>`;
      if (variant === 'bone') return `<svg viewBox="0 0 32 32"><circle cx="8" cy="8" r="4" fill="#e8e0d4"/><circle cx="24" cy="24" r="4" fill="#e8e0d4"/><rect x="8" y="6" width="20" height="4" fill="#e8e0d4" transform="rotate(45 8 8)"/></svg>`;
      if (variant === 'pelt') return `<svg viewBox="0 0 32 32"><path d="M6 6 Q16 2 26 6 Q28 16 26 26 Q16 30 6 26 Q4 16 6 6 Z" fill="#7a5a3a" stroke="#3a2a1a" stroke-width="1"/><circle cx="12" cy="12" r="1" fill="#3a2a1a"/><circle cx="20" cy="12" r="1" fill="#3a2a1a"/></svg>`;
      if (variant === 'scale') return `<svg viewBox="0 0 32 32"><path d="M16 6 Q24 10 22 16 Q24 22 16 26 Q8 22 10 16 Q8 10 16 6 Z" fill="#5a8a3e" stroke="#1a3a0a" stroke-width="1"/></svg>`;
      if (variant === 'essence') return `<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="10" fill="#d4d8e0" stroke="#7a8e9e" stroke-width="1" opacity="0.6"/><circle cx="16" cy="16" r="5" fill="#fff" opacity="0.4"/></svg>`;
      if (variant === 'scroll') return `<svg viewBox="0 0 32 32"><circle cx="6" cy="16" r="4" fill="#7a5a3a"/><circle cx="26" cy="16" r="4" fill="#7a5a3a"/><rect x="6" y="12" width="20" height="8" fill="#e8d4a8"/></svg>`;
      if (variant === 'coin') return `<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="11" fill="#d4a83a" stroke="#7a5a1a" stroke-width="1"/><text x="16" y="20" text-anchor="middle" fill="#7a5a1a" font-size="10" font-weight="bold">G</text></svg>`;
      if (variant === 'seed') return `<svg viewBox="0 0 32 32"><ellipse cx="16" cy="16" rx="6" ry="8" fill="#7a4a2a" stroke="#3a2a1a" stroke-width="1"/><path d="M16 8 L16 4" stroke="#3a8a1a" stroke-width="2"/></svg>`;
      return defaultSprite();
    default: return defaultSprite();
  }
}

function defaultSprite() {
  return `<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="10" fill="#7a8294" stroke="#4a5264" stroke-width="1"/><text x="16" y="21" text-anchor="middle" fill="#fff" font-size="14">?</text></svg>`;
}

function shade(hex, percent) {
  const f = parseInt(hex.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent) / 100;
  const R = f >> 16, G = (f >> 8) & 0xFF, B = f & 0xFF;
  const r = Math.round((t - R) * p) + R;
  const g = Math.round((t - G) * p) + G;
  const b = Math.round((t - B) * p) + B;
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Inject sprite rendering helper for UI
window.renderItemSprite = function(itemId, size = 32) {
  const item = GAME_DATA.items[itemId];
  if (!item) return '';
  return `<span class="item-sprite" style="width:${size}px;height:${size}px;display:inline-block;flex-shrink:0">${spriteFor(item.sprite)}</span>`;
};
