// ============================================================
// ASHFALL IDLE - Firebase Configuration
// ============================================================
// 
// SETUP INSTRUCTIONS:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project called "ashfall-idle"
// 3. In Authentication → Sign-in method, enable:
//    - Anonymous
//    - Email/Password
// 4. In Realtime Database → Create Database → Start in test mode
// 5. In Firestore Database → Create Database → Start in test mode
// 6. Go to Project Settings → General → Your apps → Add web app
// 7. Copy the firebaseConfig object below and replace the placeholders
//
// SECURITY RULES (set these in Firebase Console):
//
// Realtime Database rules:
// {
//   "rules": {
//     "chat": {
//       ".read": true,
//       ".write": "auth != null",
//       "$messageId": {
//         ".validate": "newData.hasChildren(['uid','name','text','timestamp'])"
//       }
//     }
//   }
// }
//
// Firestore rules:
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /players/{userId} {
//       allow read: if true;
//       allow write: if request.auth != null && request.auth.uid == userId;
//     }
//     match /pvp_queue/{docId} {
//       allow read, write: if request.auth != null;
//     }
//     match /pvp_results/{docId} {
//       allow read: if request.auth != null;
//       allow write: if request.auth != null;
//     }
//     match /bounties/{docId} {
//       allow read: if true;
//       allow write: if request.auth != null;
//     }
//     match /leaderboard/{docId} {
//       allow read: if true;
//       allow write: if request.auth != null;
//     }
//   }
// }
// ============================================================

const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Set to true once you've filled in the config above
const FIREBASE_ENABLED = FIREBASE_CONFIG.apiKey !== "";
