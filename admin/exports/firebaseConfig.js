
// Firebase Core
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";

// Firebase Auth
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// Firebase Firestore
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// Firebase Storage
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyBXZcSYdspfi2jBipwUFeNmKZgU02ksg8c",
  authDomain: "contentmanagement-8af61.firebaseapp.com",
  projectId: "contentmanagement-8af61",
  storageBucket: "contentmanagement-8af61.firebasestorage.app",
  messagingSenderId: "579537581112",
  appId: "1:579537581112:web:736c7faafaf1391ce1e2cd",
  measurementId: "G-ZPWGF7YMPE"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// --- Export only what is needed ---
export { app, db, auth, storage };


/// import { db, auth, storage } from "https://contenthub.guru/admin/exports/firebaseConfig.js";


import confetti from 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.module.mjs';
export { confetti };