import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { env, validateEnvVars } from "./utils/env";

// Validate environment variables on app initialization
if (!validateEnvVars()) {
  throw new Error('Missing required environment variables. Please check your .env file.');
}

const firebaseConfig = env.firebase;

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
