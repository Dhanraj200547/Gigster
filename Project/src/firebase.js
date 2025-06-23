// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth , setPersistence, browserLocalPersistence } from "firebase/auth"; // ✅ ADD THIS LINE
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "Your-apiKey",
  authDomain: "Your-authDomain",
  projectId: "Your-ProjectID",
  storageBucket: "Your-Storage-Bucket",
  messagingSenderId: "Your-messagingsenderid",
  appId: "Your-appid"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // ✅ This now works

const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence);
export { auth, db };
