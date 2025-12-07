import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    enableGuestMode: () => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithGoogle: async () => { },
    enableGuestMode: () => { },
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error: any) {
            console.error("Error signing in with Google", error);
            alert(`Sign In Failed: ${error.message}\n\nPlease check if 'bodhi-games.web.app' is in Firebase Console > Authentication > Settings > Authorized Domains.`);
        }
    };

    const enableGuestMode = () => {
        localStorage.setItem('guestMode', 'true');
        // Force re-render or handle via local state if needed elsewhere
        // But for LandingPage logic, checking localStorage is enough
        // Ideally we'd wrap this better, but for "Remove Google Auth locally", this suffices
        window.location.reload();
    };

    const logout = async () => {
        try {
            localStorage.removeItem('guestMode');
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, enableGuestMode, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
