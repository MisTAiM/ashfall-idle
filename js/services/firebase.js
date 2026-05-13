// ============================================================
// ASHFALL IDLE - Firebase Configuration
// ============================================================

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAKS7aORUwM26E0ntl-WTR8xvIEEzVVSBQ",
  authDomain: "ashfall-idle.firebaseapp.com",
  databaseURL: "https://ashfall-idle-default-rtdb.firebaseio.com",
  projectId: "ashfall-idle",
  storageBucket: "ashfall-idle.firebasestorage.app",
  messagingSenderId: "604916389322",
  appId: "1:604916389322:web:55cdcc5e693a30c8c2eb33",
  measurementId: "G-09QST3K1DT"
};

const FIREBASE_ENABLED = FIREBASE_CONFIG.apiKey !== "";

// Admin check — UID is hashed, never stored in plain text
const ADMIN_HASHES = ['9460f531720fa1addfb91877a949862bfa0c33fb87836d542c1c2853c40719fb'];
let _isAdminVerified = false;

async function verifyAdmin(uid) {
  if (!uid) { _isAdminVerified = false; return false; }
  try {
    const encoded = new TextEncoder().encode(uid);
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    _isAdminVerified = ADMIN_HASHES.includes(hashHex);
    return _isAdminVerified;
  } catch(e) {
    _isAdminVerified = false;
    return false;
  }
}

function isAdmin() { return _isAdminVerified; }

// Legacy compat — some code checks ADMIN_UIDS directly
const ADMIN_UIDS = { includes: () => _isAdminVerified };
