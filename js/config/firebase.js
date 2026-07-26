// Import the core Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Your Firebase config object (Copy this from your Firebase Console)
// NOTE: It's safe to put this in the frontend. Security relies on Firebase Rules, not hiding keys.
const firebaseConfig = {
    apiKey: "AIzaSyAFG62-4bNYm3IrA7arB56kQsb-jl9WlAc",
  authDomain: "aadproject-1114e.firebaseapp.com",
  projectId: "aadproject-1114e",
  storageBucket: "aadproject-1114e.firebasestorage.app",
  messagingSenderId: "943915836863",
  appId: "1:943915836863:web:33f0a7b5d012b42aa46d0a"
};

// Initialize the Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Authentication and export it so other modules can use it
export const auth = getAuth(app);