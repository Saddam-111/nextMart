import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "nextmartauth.firebaseapp.com",
  projectId: "nextmartauth",
  storageBucket: "nextmartauth.firebasestorage.app",
  messagingSenderId: "583963172514",
  appId: "1:583963172514:web:b0e96aaa796c90705c81fb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()


export {auth, provider}