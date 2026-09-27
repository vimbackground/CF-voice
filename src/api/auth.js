import { AUTH_COOKIE_NAME } from '../config.js';
import { hmacSha256, bytesToBase64 } from '../utils/crypto.js';
import { jsonError } from '../utils/http.js';

export async function createPageSession(env) {
    const signature = await hmacSha256(new TextEncoder().encode(env.ACCESS_PASSWORD), 'voicecraft-page-access-v1');
    return await bytesToBase64(signature);
}

export async function hasValidPageSession(request, env) {
    const cookie = request.headers.get('Cookie') || '';
    const matched = cookie.match(new RegExp(`(?:^|;\\s*)${AUTH_COOKIE_NAME}=([^;]+)`));
    return !!matched && matched[1] === await createPageSession(env);
}

export function hasValidApiKey(request, env) {
    if (!env.API_ACCESS_KEY) return true;
    const bearer = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
    const apiKey = request.headers.get('x-api-key') || bearer;
    return apiKey === env.API_ACCESS_KEY;
}

export async function handleLogin(request, env) {
    if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
    if (!env.ACCESS_PASSWORD) return new Response('页面访问密码未启用', { status: 404 });
    try {
        const { password } = await request.json();
        if (typeof password !== 'string' || password !== env.ACCESS_PASSWORD) {
            return jsonError('密码不正确', 'password', 'invalid_password', 401);
        }
        const token = await createPageSession(env);
        return new Response(JSON.stringify({ ok: true }), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store',
                'Set-Cookie': `${AUTH_COOKIE_NAME}=${token}; Path=/; Max-Age=604800; HttpOnly; Secure; SameSite=Lax`
            }
        });
    } catch (_) {
        return jsonError('请求格式错误', null, 'invalid_request');
    }
}
