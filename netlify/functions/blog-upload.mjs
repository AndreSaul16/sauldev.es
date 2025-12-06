import { getDb, COLLECTIONS } from './utils/firebase-admin.mjs';

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
};

/**
 * Verify user authentication
 */
async function verifyAuth(authHeader) {
    try {
        if (!authHeader) return null;

        const userData = JSON.parse(authHeader);

        // Verificar que el usuario existe en Firestore
        const db = getDb();
        const userDoc = await db.collection(COLLECTIONS.USERS).doc(userData.email).get();

        return userDoc.exists ? userData : null;
    } catch (error) {
        console.error('Auth verification error:', error);
        return null;
    }
}

function parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
        return { metadata: {}, content: content };
    }

    const frontmatter = match[1];
    const body = match[2];

    const metadata = {};
    frontmatter.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) return;

        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();

        if (!key || !value) return;

        if (value.startsWith('[') && value.endsWith(']')) {
            metadata[key] = value
                .slice(1, -1)
                .split(',')
                .map(v => v.trim().replace(/^['"]|['"]$/g, ''))
                .filter(v => v);
        } else {
            metadata[key] = value.replace(/^['"]|['"]$/g, '');
        }
    });

    return { metadata, content: body };
}

function generateSlug(title) {
    return title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

function calculateReadingTime(content) {
    const text = content
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`]*`/g, '')
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[.*?\]\(.*?\)/g, '')
        .replace(/[#*_~`]/g, '');

    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);

    if (minutes < 1) return '< 1 min';
    if (minutes === 1) return '1 min';
    return `${minutes} min`;
}

function countWords(content) {
    const text = content
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`]*`/g, '')
        .replace(/[#*_~`]/g, '');

    return text.trim().split(/\s+/).length;
}

function extractExcerpt(content, maxLength = 200) {
    const text = content
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`]*`/g, '')
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/^#+\s+/gm, '')
        .replace(/[*_~`]/g, '')
        .trim();

    if (text.length <= maxLength) return text;

    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    return truncated.substring(0, lastSpace) + '...';
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
        const user = await verifyAuth(event.headers.authorization);
        if (!user) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'No autorizado. Debes iniciar sesión.' }),
            };
        }

        const { filename, content } = JSON.parse(event.body);

        if (!filename || !content) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Filename and content required' }),
            };
        }

        if (!filename.endsWith('.md')) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Solo se permiten archivos .md' }),
            };
        }

        const { metadata, content: body } = parseFrontmatter(content);

        const title = metadata.title || filename.replace('.md', '');
        if (!title || title.trim() === '') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'El título es requerido' }),
            };
        }

        if (!body || body.trim() === '') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'El contenido es requerido' }),
            };
        }

        const now = new Date();
        const post = {
            id: Date.now().toString(),
            slug: generateSlug(title),
            title: title,
            date: metadata.date || now.toISOString().split('T')[0],
            tags: metadata.tags || [],
            excerpt: metadata.excerpt || extractExcerpt(body),
            content: body,
            readingTime: calculateReadingTime(body),
            wordCount: countWords(body),
            author: user.email,
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        };

        // Guardar post en Firestore
        const db = getDb();
        await db.collection(COLLECTIONS.POSTS).doc(post.id).set(post);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, post }),
        };

    } catch (error) {
        console.error('Error in blog-upload:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
