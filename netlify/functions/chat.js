import OpenAI from 'openai';

// Inicializar cliente de OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY_API,
});

const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

// Configuración de CORS
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
};

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
        const { threadId, message } = JSON.parse(event.body);

        // Validación de entrada
        if (!message || typeof message !== 'string') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Message is required and must be a string' }),
            };
        }

        // Limitar longitud del mensaje
        if (message.length > 500) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Message is too long (max 500 characters)' }),
            };
        }

        // Verificar que las variables de entorno estén configuradas
        if (!process.env.OPENAI_KEY_API || !ASSISTANT_ID) {
            console.error('Missing environment variables');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Server configuration error' }),
            };
        }

        let currentThreadId = threadId;

        // Crear nuevo thread si no existe
        if (!currentThreadId) {
            const thread = await openai.beta.threads.create();
            currentThreadId = thread.id;
        }

        // Añadir mensaje del usuario al thread
        await openai.beta.threads.messages.create(currentThreadId, {
            role: 'user',
            content: message,
        });

        // Ejecutar el asistente
        const run = await openai.beta.threads.runs.create(currentThreadId, {
            assistant_id: ASSISTANT_ID,
        });

        // Esperar a que el asistente complete la respuesta
        let runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);
        let attempts = 0;
        const maxAttempts = 30; // 30 segundos máximo

        while (runStatus.status !== 'completed' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
            runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);
            attempts++;

            // Si el run falla
            if (runStatus.status === 'failed' || runStatus.status === 'cancelled' || runStatus.status === 'expired') {
                throw new Error(`Run failed with status: ${runStatus.status}`);
            }
        }

        // Timeout
        if (attempts >= maxAttempts) {
            return {
                statusCode: 408,
                headers,
                body: JSON.stringify({ error: 'Request timeout' }),
            };
        }

        // Obtener los mensajes del thread
        const messages = await openai.beta.threads.messages.list(currentThreadId);

        // El mensaje más reciente del asistente
        const assistantMessage = messages.data.find(msg => msg.role === 'assistant');

        if (!assistantMessage) {
            throw new Error('No assistant response found');
        }

        // Extraer el contenido del mensaje
        const responseText = assistantMessage.content[0].text.value;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                threadId: currentThreadId,
                response: responseText,
            }),
        };

    } catch (error) {
        console.error('Error in chat function:', error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to process chat message',
                details: error.message
            }),
        };
    }
};
