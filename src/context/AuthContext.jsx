import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                // Check if user has a role stored
                try {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists()) {
                        setRole(userDoc.data().role);
                    }
                } catch (err) {
                    console.log('Firestore not configured yet, using local role');
                    const savedRole = localStorage.getItem('cnis_role');
                    if (savedRole) setRole(savedRole);
                }
            } else {
                setUser(null);
                setRole(null);
            }
            // Only set loading false once we've tried to get the role or confirmed no user
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return result.user;
        } catch (error) {
            console.warn('Firebase login notice, activating Demo mode fallback:', error);
            const errStr = (String(error?.code || '') + ' ' + String(error?.message || '')).toLowerCase();
            
            // Demo mode fallback for invalid API keys, popup blocks, unauthorized domain or offline
            if (
                errStr.includes('api-key') ||
                errStr.includes('configuration-not-found') ||
                errStr.includes('unauthorized-domain') ||
                errStr.includes('popup') ||
                errStr.includes('network') ||
                !import.meta.env.VITE_FIREBASE_API_KEY
            ) {
                const demoUser = {
                    uid: 'demo-asha-worker-' + Date.now(),
                    displayName: 'ASHA Worker (Demo)',
                    email: 'asha.worker@cnis.gov.in',
                    photoURL: null,
                    isDemo: true
                };
                setUser(demoUser);
                return demoUser;
            }
            throw error;
        }
    };

    const logout = async () => {
        try {
            if (user && !user.isDemo) {
                // Clear the role from Firestore so they are reprompted on next login
                try {
                    await setDoc(doc(db, 'users', user.uid), {
                        role: null,
                        updatedAt: new Date().toISOString()
                    }, { merge: true });
                } catch (err) {
                    console.log('Could not clear role from Firestore on logout');
                }
            }
            await signOut(auth);
        } catch (e) {
            // Demo mode or other signOut error
        }
        setUser(null);
        setRole(null);
        localStorage.removeItem('cnis_role');
    };

    const selectRole = async (selectedRole) => {
        setRole(selectedRole);
        localStorage.setItem('cnis_role', selectedRole);
        if (user && !user.isDemo) {
            try {
                await setDoc(doc(db, 'users', user.uid), {
                    role: selectedRole,
                    email: user.email,
                    displayName: user.displayName,
                    updatedAt: new Date().toISOString()
                }, { merge: true });
            } catch (err) {
                console.log('Could not save role to Firestore');
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, loginWithGoogle, logout, selectRole }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
