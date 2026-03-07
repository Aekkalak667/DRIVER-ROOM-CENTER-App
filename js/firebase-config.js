// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBRFYXUbIpl0JzGqkxZj5DpCRy1Y9bIsR0",
    authDomain: "driver-room-center.firebaseapp.com",
    projectId: "driver-room-center",
    storageBucket: "driver-room-center.firebasestorage.app",
    messagingSenderId: "623145108000",
    appId: "1:623145108000:web:b9e905fe7cc0b41307b245"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Expose to window for access in non-module scripts if needed
window.firebaseApp = app;
window.db = db;
window.auth = auth;

console.log("🔥 Firebase initialized successfully");

export { app, db, auth };
