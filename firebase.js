import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBd6kHpgJiijYYVnUT6QC7tivEmoK5pb4g",
  authDomain: "vero-eleganza.firebaseapp.com",
  projectId: "vero-eleganza",
  storageBucket: "vero-eleganza.firebasestorage.app",
  messagingSenderId: "36550058481",
  appId: "1:36550058481:web:4dabdcb149fac4ec53a450",
  measurementId: "G-2155JBQ3FS"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, doc, getDoc, getDocs, setDoc, updateDoc };
