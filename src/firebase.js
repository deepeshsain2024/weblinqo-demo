import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";

// firebase configurations key value
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase app with the above configuration
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication instance
const auth = getAuth(app);

// GoogleAuthProvider: Allows users to sign in with their Google account.
const googleProvider = new GoogleAuthProvider();

// TwitterAuthProvider: Allows users to sign in with their Twitter account.
const twitterProvider = new TwitterAuthProvider();

export { auth, googleProvider, twitterProvider };
