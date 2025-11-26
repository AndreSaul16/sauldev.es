import admin from 'firebase-admin';

// Inicializar Firebase Admin solo una vez
let firebaseApp;

function initializeFirebase() {
    if (!firebaseApp) {
        // Verificar que las variables de entorno estén configuradas
        if (!process.env.FIREBASE_PROJECT_ID ||
            !process.env.FIREBASE_PRIVATE_KEY ||
            !process.env.FIREBASE_CLIENT_EMAIL) {
            throw new Error('Missing Firebase environment variables');
        }

        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            }),
        });
    }
    return firebaseApp;
}

// Headers CORS
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
};

// Validación de email
function isValidEmail(email) {
    if (!email) return true; // Email es opcional
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validación de teléfono
function isValidPhone(phone) {
    if (!phone) return true; // Teléfono es opcional
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return phoneRegex.test(phone);
}

// Sanitización básica (eliminar HTML)
function sanitize(text) {
    if (!text) return '';
    return text.replace(/<[^>]*>/g, '').trim();
}

// Rate limiting simple (en memoria - mejor usar Redis en producción)
const contactAttempts = new Map();

function checkRateLimit(ip) {
    const now = Date.now();
    const attempts = contactAttempts.get(ip) || [];

    // Filtrar intentos de la última hora
    const recentAttempts = attempts.filter(time => now - time < 3600000);

    if (recentAttempts.length >= 3) {
        return false; // Excedió límite de 3 por hora
    }

    recentAttempts.push(now);
    contactAttempts.set(ip, recentAttempts);

    // Limpiar entradas antiguas cada 100 requests
    if (contactAttempts.size > 100) {
        const oneHourAgo = now - 3600000;
        for (const [key, value] of contactAttempts) {
            if (value.every(time => time < oneHourAgo)) {
                contactAttempts.delete(key);
            }
        }
    }

    return true;
}

export const handler = async (event) => {
    // Manejar preflight CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    // Solo aceptar POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        // Parse del body
        const { name, message, email, phone } = JSON.parse(event.body);

        // Validaciones básicas
        if (!name || typeof name !== 'string') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'El nombre es requerido' }),
            };
        }

        if (!message || typeof message !== 'string') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'El mensaje es requerido' }),
            };
        }

        // Validar longitudes
        if (name.length > 100) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'El nombre es demasiado largo (máx 100 caracteres)' }),
            };
        }

        if (message.length > 1000) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'El mensaje es demasiado largo (máx 1000 caracteres)' }),
            };
        }

        // Validar formatos de email y teléfono
        if (email && !isValidEmail(email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'El formato del email no es válido' }),
            };
        }

        if (phone && !isValidPhone(phone)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'El formato del teléfono no es válido' }),
            };
        }

        // Rate limiting por IP
        const ip = event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown';

        if (!checkRateLimit(ip)) {
            return {
                statusCode: 429,
                headers,
                body: JSON.stringify({
                    error: 'Demasiados intentos. Por favor, espera una hora antes de intentar nuevamente.'
                }),
            };
        }

        // Sanitizar inputs
        const sanitizedName = sanitize(name);
        const sanitizedMessage = sanitize(message);
        const sanitizedEmail = email ? sanitize(email) : null;
        const sanitizedPhone = phone ? sanitize(phone) : null;

        // Generar ID único basado en el nombre (normalizado)
        const contactId = sanitizedName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
            .replace(/[^a-z0-9]/g, '-')      // Reemplazar caracteres especiales por guiones
            .replace(/-+/g, '-')              // Múltiples guiones a uno solo
            .replace(/^-|-$/g, '');           // Eliminar guiones al inicio/final

        // Inicializar Firebase
        initializeFirebase();
        const db = admin.firestore();

        // Referencia al documento del contacto
        const contactRef = db.collection('contacts').doc(contactId);

        // Verificar si el contacto ya existe
        const contactDoc = await contactRef.get();

        const now = admin.firestore.Timestamp.now();
        const messageData = {
            content: sanitizedMessage,
            timestamp: now,
            ip: ip,
            userAgent: event.headers['user-agent'] || 'unknown'
        };

        if (contactDoc.exists) {
            // El contacto ya existe - añadir nuevo mensaje al historial
            const existingData = contactDoc.data();

            // Actualizar email/phone si se proporcionaron nuevos valores
            const updates = {
                messages: admin.firestore.FieldValue.arrayUnion(messageData),
                lastContactAt: now
            };

            // Solo actualizar email/phone si se proporcionan y son diferentes
            if (sanitizedEmail && sanitizedEmail !== existingData.email) {
                updates.email = sanitizedEmail;
            }
            if (sanitizedPhone && sanitizedPhone !== existingData.phone) {
                updates.phone = sanitizedPhone;
            }

            await contactRef.update(updates);

            console.log(`[${new Date().toISOString()}] Contact updated: ${contactId} from ${ip}`);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: '¡Gracias por tu mensaje! Hemos actualizado tu información. Saúl se pondrá en contacto contigo pronto.',
                    contactId: contactId,
                    isUpdate: true
                }),
            };

        } else {
            // Nuevo contacto - crear documento
            const newContactData = {
                name: sanitizedName,
                email: sanitizedEmail,
                phone: sanitizedPhone,
                messages: [messageData],
                createdAt: now,
                lastContactAt: now
            };

            await contactRef.set(newContactData);

            console.log(`[${new Date().toISOString()}] Contact created: ${contactId} from ${ip}`);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: '¡Gracias! Tu mensaje ha sido enviado exitosamente. Saúl se pondrá en contacto contigo pronto.',
                    contactId: contactId,
                    isUpdate: false
                }),
            };
        }

    } catch (error) {
        console.error('Error in save-contact function:', error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Error al procesar tu mensaje. Por favor, intenta nuevamente.',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }),
        };
    }
};
