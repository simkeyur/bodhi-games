import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyAZoI3PgK9erxMt2YbqzY9nKu7yJoEplhk",
    authDomain: "bodhi-games.firebaseapp.com",
    projectId: "bodhi-games",
    storageBucket: "bodhi-games.firebasestorage.app",
    messagingSenderId: "235542106170",
    appId: "1:235542106170:web:c4389e3fdef84b71b6a503",
    measurementId: "G-W2W5Y5LE92"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
