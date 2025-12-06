import admin from 'firebase-admin';

const COLLECTIONS = {
    USERS: 'users',
    POSTS: 'posts',
    NEWSLETTER: 'newsletter',
    CONTACTS: 'contacts',
    CHALLENGES: 'challenges'
};

let db;

export function getDb() {
    if (!admin.apps.length) {
        try {
            console.log('🔥 Initializing Firebase Admin...');
            let privateKey = process.env.FIREBASE_PRIVATE_KEY;

            if (privateKey) {
                if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
                    privateKey = privateKey.slice(1, -1);
                }
                privateKey = privateKey.replace(/\\n/g, '\n');
            }

            // Usar VITE_FIREBASE_PROJECT_ID como fallback (es la que existe en Netlify)
            const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;

            if (!process.env.FIREBASE_CLIENT_EMAIL || !privateKey || !projectId) {
                throw new Error('Missing Firebase Admin credentials: ' +
                    (!projectId ? 'PROJECT_ID ' : '') +
                    (!process.env.FIREBASE_CLIENT_EMAIL ? 'CLIENT_EMAIL ' : '') +
                    (!privateKey ? 'PRIVATE_KEY' : ''));
            }

            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: projectId,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: privateKey,
                }),
            });
            console.log('✅ Firebase Admin initialized successfully');
        } catch (error) {
            console.error('❌ Firebase Admin initialization error:', error);
            throwWrapper(error);
        }
    }

    if (!db) {
        db = admin.firestore();
    }
    return db;
}

function throwWrapper(err) {
    throw err;
}

export { admin, COLLECTIONS };
