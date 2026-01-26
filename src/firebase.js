import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { env, validateEnvVars } from "./utils/env";

let auth;

// Validate environment variables on app initialization
try {
  if (!validateEnvVars()) {
    console.error('Missing required environment variables. Please check your .env file.');
    // Don't throw error, let the app continue with fallback behavior
  }

  const firebaseConfig = env.firebase;
  console.log('Firebase config:', firebaseConfig); // Debug log

  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  
  console.log('Firebase initialized successfully'); // Debug log
} catch (error) {
  console.error('Firebase initialization failed:', error);
  // Create a mock auth object to prevent crashes
  auth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
    signOut: () => Promise.resolve(),
    signInWithEmailAndPassword: () => Promise.reject(new Error('Firebase not initialized')),
    createUserWithEmailAndPassword: () => Promise.reject(new Error('Firebase not initialized'))
  };
}

export { auth };
