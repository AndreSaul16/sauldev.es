import admin from 'firebase-admin';

// Inicializar Firebase Admin
NEWSLETTER: 'newsletter',
    CONTACTS: 'contacts',
        CHALLENGES: 'challenges'
};

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

            if (!process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
                throw new Error('Missing Firebase Admin credentials');
            }

            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
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
    return db;
}

function throwWrapper(err) {
    throw err;
}

export { admin };
