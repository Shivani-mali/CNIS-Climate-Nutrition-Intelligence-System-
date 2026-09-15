import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoPlaceholderKey123456789",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "cnis-intelligent-system-v1.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "cnis-intelligent-system-v1",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "cnis-intelligent-system-v1.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456"
};

let app, auth, googleProvider, db, storage;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    db = getFirestore(app);
    storage = getStorage(app);
} catch (err) {
    console.warn('[Firebase] Warning during initialization, falling back to mock context:', err);
}

export { app, auth, googleProvider, db, storage };
export default app;
