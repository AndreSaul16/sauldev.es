import React, { createContext, useContext, useState, useEffect } from 'react';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signOut, onAuthStateChanged } from 'firebase/auth';


// Firebase Configuration (Client)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Start loading to check auth state

    useEffect(() => {
        // Listen for Firebase Auth state changes
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({ email: firebaseUser.email, uid: firebaseUser.uid });
                setIsAuthenticated(true);
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const register = async (email) => {
        setIsLoading(true);
        try {
            // Step 1: Get registration options from server
            const optionsRes = await fetch('/.netlify/functions/webauthn-register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ step: 'generate-options', email, rpID: RP_ID }),
            });

            if (!optionsRes.ok) {
                const error = await optionsRes.json();
                throw new Error(error.error || 'Failed to get registration options');
            }

            const options = await optionsRes.json();

            // Step 2: Start registration with WebAuthn
            const attResp = await startRegistration(options);

            // Step 3: Verify registration on server
            const verifyRes = await fetch('/.netlify/functions/webauthn-register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    step: 'verify-registration',
                    email,
                    response: attResp,
                }),
            });

            if (!verifyRes.ok) {
                const error = await verifyRes.json();
                throw new Error(error.error || 'Failed to verify registration');
            }

            const { verified, token } = await verifyRes.json();

            if (verified && token) {
                console.log('Registration successful. Auto-logging in with Firebase...');
                // Auto-login with Firebase Custom Token
                await signInWithCustomToken(auth, token);
                console.log('Firebase Auto-login successful');
                return { success: true };
            } else if (verified) {
                return { success: true };
            }

            throw new Error('Registration verification failed');
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };



    const login = async (email) => {
        setIsLoading(true);
        try {
            // Step 1: Get registration options from server
            const optionsRes = await fetch('/.netlify/functions/webauthn-register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ step: 'generate-options', email, rpID: RP_ID }),
            });

            if (!optionsRes.ok) {
                const error = await optionsRes.json();
                throw new Error(error.error || 'Failed to get authentication options');
            }

            const options = await optionsRes.json();

            // Step 2: Start authentication with WebAuthn
            const authResp = await startAuthentication(options);

            // Step 3: Verify authentication on server
            const verifyRes = await fetch('/.netlify/functions/webauthn-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    step: 'verify-authentication',
                    email,
                    response: authResp,
                }),
            });

            if (!verifyRes.ok) {
                const error = await verifyRes.json();
                throw new Error(error.error || 'Failed to verify authentication');
            }

            const { verified, token } = await verifyRes.json();

            if (verified && token) {
                // Sign in with Firebase Custom Token
                await signInWithCustomToken(auth, token);
                return { success: true };
            }

            throw new Error('Authentication verification failed');
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        register,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
