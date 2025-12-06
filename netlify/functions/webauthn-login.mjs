import {
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { getDb, COLLECTIONS, admin } from './utils/firebase-admin.mjs';

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
        const { step, email, response } = JSON.parse(event.body);

        if (step === 'generate-options') {
            const user = await getUser(email);

            if (!user || !user.credentials || user.credentials.length === 0) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'User not found or no credentials registered' }),
                };
            }

            const options = await generateAuthenticationOptions({
                rpID: RP_ID,
                allowCredentials: user.credentials.map(cred => ({
                    id: cred.id || cred.credentialID,
                    type: 'public-key',
                    transports: cred.transports,
                })),
                userVerification: 'preferred',
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

        } else if (step === 'verify-authentication') {
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
            const expectedEmail = email;

            // BORRAR CHALLENGE (Atomicidad)
            await db.collection(COLLECTIONS.CHALLENGES).doc(email).delete();

            if (!expectedEmail) { // Redundant logic removal, kept for flow
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Email context missing' }),
                };
            }

            const user = await getUser(expectedEmail);

            if (!user) {
                return {
                    statusCode: 404,
                    headers,
                    body: JSON.stringify({ error: 'User not found' }),
                };
            }

            // Find the credential that matches the response id
            const credential = user.credentials.find(cred => (cred.id || cred.credentialID) === response.id);

            if (!credential) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ error: 'Credential not found' }),
                };
            }

            const authenticator = {
                credentialID: Buffer.from(credential.id || credential.credentialID, 'base64url'),
                credentialPublicKey: Buffer.from(credential.publicKey || credential.credentialPublicKey, 'base64url'),
                counter: credential.counter,
            };

            const verification = await verifyAuthenticationResponse({
                response,
                expectedChallenge,
                expectedOrigin: ORIGIN,
                expectedRPID: RP_ID,
                authenticator,
            });

            if (verification.verified) {
                // Generar Custom Token de Firebase
                const customToken = await admin.auth().createCustomToken(expectedEmail);

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        verified: true,
                        token: customToken,
                        email: expectedEmail
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
        console.error('Error in webauthn-login:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
