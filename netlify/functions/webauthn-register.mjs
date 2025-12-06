import {
    generateRegistrationOptions,
    verifyRegistrationResponse,
} from '@simplewebauthn/server';
import { getDb, COLLECTIONS, admin } from './utils/firebase-admin.mjs';

const RP_NAME = 'SaulDev Portfolio';
const RP_ID = process.env.RP_ID || 'localhost';
const ORIGIN = process.env.ORIGIN || 'http://localhost:8888';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
};

/**
 * Get user by email from Firestore
 */
async function getUser(email) {
    try {
        const db = getDb();
        const userDoc = await db.collection(COLLECTIONS.USERS).doc(email).get();
        return userDoc.exists ? userDoc.data() : null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}

/**
 * Save user to Firestore
 */
async function saveUser(email, credentials) {
    try {
        const db = getDb();
        const userData = {
            email,
            credentials,
            registeredAt: new Date().toISOString(),
        };

        await db.collection(COLLECTIONS.USERS).doc(email).set(userData);
        return true;
    } catch (error) {
        console.error('Error saving user:', error);
        throw error;
    }
}

export const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        const { step, email, response, rpID } = JSON.parse(event.body);

        // Use provided rpID or fallback to default
        const effectiveRPID = rpID || RP_ID;
        console.log('Using RP_ID:', effectiveRPID);

        if (step === 'generate-options') {
            const existingUser = await getUser(email);

            console.log('Existing user check:', { email, existingUser: !!existingUser });

            if (existingUser) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'User already exists' }),
                };
            }

            // Convert email to Uint8Array for userID
            const userIDBuffer = new TextEncoder().encode(email);

            const options = await generateRegistrationOptions({
                rpName: RP_NAME,
                rpID: effectiveRPID,
                userID: userIDBuffer,
                userName: email,
                attestationType: 'none',
                authenticatorSelection: {
                    authenticatorAttachment: 'platform',
                    residentKey: 'preferred',
                    userVerification: 'preferred',
                },
            });

            // GUARDAR CHALLENGE EN FIRESTORE
            const db = getDb();
            await db.collection(COLLECTIONS.CHALLENGES).doc(email).set({
                challenge: options.challenge,
                createdAt: new Date().toISOString()
            });

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(options),
            };

        } else if (step === 'verify-registration') {
            const db = getDb();
            const challengeDoc = await db.collection(COLLECTIONS.CHALLENGES).doc(email).get();

            if (!challengeDoc.exists) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Challenge not found or expired' }),
                };
            }

            const { challenge: expectedChallenge } = challengeDoc.data();

            // BORRAR CHALLENGE (Atomicidad)
            await db.collection(COLLECTIONS.CHALLENGES).doc(email).delete();

            const verification = await verifyRegistrationResponse({
                response,
                expectedChallenge,
                expectedOrigin: ORIGIN, // Note: Origin might also need to be dynamic for non-localhost/prod, but start with RP_ID
                expectedRPID: effectiveRPID,
            });

            if (verification.verified) {
                const registrationInfo = verification.registrationInfo;

                const credentialID = registrationInfo.credentialID || registrationInfo.credential?.id;
                const credentialPublicKey = registrationInfo.credentialPublicKey || registrationInfo.credential?.publicKey;
                const counter = registrationInfo.counter !== undefined ? registrationInfo.counter : 0;

                const credentials = [{
                    id: Buffer.from(credentialID).toString('base64url'),
                    publicKey: Buffer.from(credentialPublicKey).toString('base64url'),
                    counter,
                    transports: response.response.transports || []
                }];

                console.log('Saving new user credentials:', { email, credentials });
                await saveUser(email, credentials);

                // Generar Custom Token
                const customToken = await admin.auth().createCustomToken(email);

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        verified: true,
                        token: customToken,
                        email: email
                    }),
                };
            } else {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Verification failed' }),
                };
            }
        }

        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ error: 'Invalid step' }),
        };

    } catch (error) {
        console.error('Error in webauthn-register:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
