// Environment variables validation utility

const requiredEnvVars = [
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_AUTH_DOMAIN',
  'REACT_APP_FIREBASE_PROJECT_ID',
  'REACT_APP_FIREBASE_STORAGE_BUCKET',
  'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
  'REACT_APP_FIREBASE_APP_ID',
  'REACT_APP_FAKE_STORE_API_URL',
  'REACT_APP_PLACEHOLDER_IMAGE_URL'
];

export const validateEnvVars = () => {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('Missing required environment variables:');
    missingVars.forEach(varName => {
      console.error(`- ${varName}`);
    });
    console.error('Please check your .env file and ensure all required variables are set.');
    return false;
  }
  
  return true;
};

// Export environment variables with fallbacks
export const env = {
  firebase: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
  },
  api: {
    fakeStoreUrl: process.env.REACT_APP_FAKE_STORE_API_URL || 'https://fakestoreapi.com',
    placeholderImageUrl: process.env.REACT_APP_PLACEHOLDER_IMAGE_URL || 'https://via.placeholder.com'
  },
  social: {
    twitter: process.env.REACT_APP_TWITTER_URL || 'https://twitter.com',
    facebook: process.env.REACT_APP_FACEBOOK_URL || 'https://facebook.com',
    tiktok: process.env.REACT_APP_TIKTOK_URL || 'https://tiktok.com',
    instagram: process.env.REACT_APP_INSTAGRAM_URL || 'https://instagram.com'
  }
};