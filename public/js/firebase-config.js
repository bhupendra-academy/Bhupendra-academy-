/**
 * 🔒 ULTIMATE DIGITAL EMPIRE - FIREBASE CONFIGURATION
 * यो फाइलले तपाईंको वेबसाइटलाई Google को सुरक्षित सर्भर (Firebase) सँग जोड्छ।
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// हामी पछि Firebase बाट कोड निकालेर यहाँ राख्नेछौं
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "bhupendra-empire.firebaseapp.com",
  projectId: "bhupendra-empire",
  storageBucket: "bhupendra-empire.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

console.log("✅ Firebase Server Connection Initialized Successfully!");
