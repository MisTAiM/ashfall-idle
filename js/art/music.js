// ================================================================
// ASHFALL IDLE — music-player.js
// Persistent background music player with soft volume, play/pause,
// volume slider. Remembers state in localStorage.
// ================================================================

(function(){
'use strict';

const TRACK = { src:'assets/Ember-Seers_Oath.mp3', title:"Ember Seer's Oath" };
const STORAGE_KEY = 'ashfall_music_prefs';
const DEFAULT_VOL = 0.15; // soft default

// ── Load saved prefs ─────────────────────────────────────
function loadPrefs() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch(e) { return {}; }
}
function savePrefs(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch(e) {}
}

// ── Create audio element ─────────────────────────────────
const audio = new Audio(TRACK.src);
audio.loop = true;
audio.preload = 'auto';

const prefs = loadPrefs();
audio.volume = prefs.volume !== undefined ? prefs.volume : DEFAULT_VOL;
let isPlaying = false;
let userInteracted = false;
let expanded = false;

// ── Build UI ─────────────────────────────────────────────
function buildPlayer() {
  if (document.getElementById('af-music-player')) return;

  const el = document.createElement('div');
  el.id = 'af-music-player';
  el.innerHTML = `
    <button class="afm-toggle" id="afm-toggle" title="Music">
      <span class="afm-icon" id="afm-icon">♫</span>
    </button>
    <div class="afm-panel" id="afm-panel">
      <div class="afm-track" id="afm-track">${TRACK.title}</div>
      <div class="afm-controls">
        <button class="afm-play" id="afm-play" title="Play / Pause">▶</button>
        <div class="afm-vol-wrap">
          <span class="afm-vol-icon">🔈</span>
          <input type="range" class="afm-vol" id="afm-vol" min="0" max="100" value="${Math.round(audio.volume*100)}">
          <span class="afm-vol-pct" id="afm-vol-pct">${Math.round(audio.volume*100)}%</span>
        </div>
      </div>
      <div class="afm-progress-wrap">
        <div class="afm-progress" id="afm-progress"><div class="afm-progress-fill" id="afm-progress-fill"></div></div>
        <span class="afm-time" id="afm-time">0:00</span>
      </div>
    </div>
  `;
  document.body.appendChild(el);

  // Toggle panel
  document.getElementById('afm-toggle').addEventListener('click', () => {
    expanded = !expanded;
    document.getElementById('afm-panel').classList.toggle('afm-open', expanded);
    document.getElementById('afm-toggle').classList.toggle('afm-active', expanded);
  });

  // Play/Pause
  document.getElementById('afm-play').addEventListener('click', () => {
    userInteracted = true;
    if (isPlaying) {
      audio.pause();
      setPlayState(false);
    } else {
      audio.play().then(() => setPlayState(true)).catch(()=>{});
    }
  });

  // Volume
  document.getElementById('afm-vol').addEventListener('input', (e) => {
    const v = parseInt(e.target.value) / 100;
    audio.volume = v;
    document.getElementById('afm-vol-pct').textContent = Math.round(v*100) + '%';
    savePrefs({ volume: v, wasPlaying: isPlaying });
  });

  // Progress bar click to seek
  document.getElementById('afm-progress').addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });

  // Update progress
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    const fill = document.getElementById('afm-progress-fill');
    if (fill) fill.style.width = pct + '%';
    const mins = Math.floor(audio.currentTime / 60);
    const secs = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
    const timeEl = document.getElementById('afm-time');
    if (timeEl) timeEl.textContent = `${mins}:${secs}`;
  });
}

function setPlayState(playing) {
  isPlaying = playing;
  const btn = document.getElementById('afm-play');
  const icon = document.getElementById('afm-icon');
  if (btn) btn.textContent = playing ? '⏸' : '▶';
  if (icon) icon.classList.toggle('afm-playing', playing);
  savePrefs({ volume: audio.volume, wasPlaying: playing });
}

// ── Auto-play on first user interaction (browser requirement) ───
function tryAutoPlay() {
  if (userInteracted) return;
  const p = loadPrefs();
  if (p.wasPlaying === false) return; // user explicitly paused last time
  audio.play().then(() => {
    userInteracted = true;
    setPlayState(true);
  }).catch(() => {
    // Browser blocked autoplay — wait for any click
    const handler = () => {
      const p2 = loadPrefs();
      if (p2.wasPlaying !== false) {
        audio.play().then(() => setPlayState(true)).catch(()=>{});
      }
      userInteracted = true;
      document.removeEventListener('click', handler);
      document.removeEventListener('keydown', handler);
    };
    document.addEventListener('click', handler, { once: false });
    document.addEventListener('keydown', handler, { once: false });
  });
}

// ── Init when game app is visible ────────────────────────
function init() {
  const app = document.getElementById('game-app');
  if (!app || app.style.display === 'none') {
    setTimeout(init, 500);
    return;
  }
  buildPlayer();
  tryAutoPlay();
}

if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}

console.log('[Ashfall] music-player.js loaded. Track:', TRACK.title);

})();
