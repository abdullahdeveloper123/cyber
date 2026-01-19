import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmLUc08gSFE20zgcUuEWjtrzZqVTauwJ4",
  authDomain: "cyber-d0f6e.firebaseapp.com",
  projectId: "cyber-d0f6e",
  storageBucket: "cyber-d0f6e.firebasestorage.app",
  messagingSenderId: "1097801045709",
  appId: "1:1097801045709:web:d42f0106e6dc933cccfb84"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
