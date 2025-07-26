// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDbRmGAY3PytA2MLZag8n9FbiasZVoacdY",
  authDomain: "aira-web-app.firebaseapp.com",
  databaseURL:
    "https://aira-web-app-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "aira-web-app",
  storageBucket: "aira-web-app.appspot.com",
  messagingSenderId: "1069296455146",
  appId: "1:1069296455146:web:bd6dfdbd5f67b1acec37693",
  measurementId: "G-H8KHT2XVFE",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); // untuk Realtime Database

export { db };
