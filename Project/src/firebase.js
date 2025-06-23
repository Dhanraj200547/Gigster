// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth , setPersistence, browserLocalPersistence } from "firebase/auth"; // ✅ ADD THIS LINE
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDaWeWT-rkcj4jDRcC19GzZr94SlNzzWgA",
  authDomain: "gigster-cbf2b.firebaseapp.com",
  projectId: "gigster-cbf2b",
  storageBucket: "gigster-cbf2b.firebasestorage.app",
  messagingSenderId: "775391808452",
  appId: "1:775391808452:web:4bef73fdfecc2a7bfd7291"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // ✅ This now works

const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence);
export { auth, db };