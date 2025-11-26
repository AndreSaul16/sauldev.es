import OpenAI from 'openai';

// Logging para diagnóstico
console.log('🔍 Chat Function: Iniciando...');
console.log('OPENAI_KEY_API existe:', !!process.env.OPENAI_KEY_API);
console.log('OPENAI_ASSISTANT_ID:', process.env.OPENAI_ASSISTANT_ID);

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
    console.log('📥 Request recibido:', event.httpMethod);

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
        console.log('❌ Método no permitido:', event.httpMethod);
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        // Parse del body
        const { threadId, message } = JSON.parse(event.body);
        console.log('📝 Mensaje:', message?.substring(0, 50) + '...');

        // Validación de entrada
        if (!message || typeof message !== 'string') {
            console.log('❌ Mensaje inválido');
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Message is required and must be a string' }),
            };
        }

        // Limitar longitud del mensaje
        if (message.length > 500) {
            console.log('❌ Mensaje muy largo');
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Message is too long (max 500 characters)' }),
            };
        }

        // Verificar que las variables de entorno estén configuradas
        if (!process.env.OPENAI_KEY_API || !ASSISTANT_ID) {
            console.error('❌ Variables de entorno faltantes');
            console.error('OPENAI_KEY_API:', !!process.env.OPENAI_KEY_API);
            console.error('ASSISTANT_ID:', ASSISTANT_ID);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Server configuration error',
                    details: 'Missing environment variables'
                }),
            };
        }

        let currentThreadId = threadId;

        // Crear nuevo thread si no existe
        if (!currentThreadId) {
            console.log('🆕 Creando nuevo thread...');
            const thread = await openai.beta.threads.create();
            currentThreadId = thread.id;
            console.log('✅ Thread creado:', currentThreadId);
        }

        // Añadir mensaje del usuario al thread
        console.log('💬 Añadiendo mensaje al thread...');
        await openai.beta.threads.messages.create(currentThreadId, {
            role: 'user',
            content: message,
        });

        // Ejecutar el asistente
        console.log('🤖 Ejecutando asistente...');
        const run = await openai.beta.threads.runs.create(currentThreadId, {
            assistant_id: ASSISTANT_ID,
        });
        console.log('✅ Run creado:', run.id);

        // Esperar a que el asistente complete la respuesta
        let runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);
        let attempts = 0;
        const maxAttempts = 30; // 30 segundos máximo

        console.log('⏳ Esperando respuesta...');
        while (runStatus.status !== 'completed' && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar 1 segundo
            runStatus = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);
            attempts++;
            console.log(`⏳ Intento ${attempts}/${maxAttempts} - Status: ${runStatus.status}`);

            // Si el run falla
            if (runStatus.status === 'failed' || runStatus.status === 'cancelled' || runStatus.status === 'expired') {
                console.error('❌ Run falló:', runStatus.status);
                throw new Error(`Run failed with status: ${runStatus.status}`);
            }
        }

        // Timeout
        if (attempts >= maxAttempts) {
            console.error('❌ Timeout esperando respuesta');
            return {
                statusCode: 408,
                headers,
                body: JSON.stringify({ error: 'Request timeout' }),
            };
        }

        // Obtener los mensajes del thread
        console.log('📨 Obteniendo mensajes...');
        const messages = await openai.beta.threads.messages.list(currentThreadId);

        // El mensaje más reciente del asistente
        const assistantMessage = messages.data.find(msg => msg.role === 'assistant');

        if (!assistantMessage) {
            console.error('❌ No se encontró respuesta del asistente');
            throw new Error('No assistant response found');
        }

        // Extraer el contenido del mensaje
        const responseText = assistantMessage.content[0].text.value;
        console.log('✅ Respuesta obtenida:', responseText.substring(0, 50) + '...');

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                threadId: currentThreadId,
                response: responseText,
            }),
        };

    } catch (error) {
        console.error('❌ Error en chat function:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Failed to process chat message',
                details: error.message,
                type: error.name
            }),
        };
    }
};
