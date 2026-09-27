import { handleLogin, hasValidPageSession, hasValidApiKey } from './api/auth.js';
import { handleFileUpload, getVoice, normalizeOpenAiVoice, outputFormatFor } from './api/tts.js';
import { handleAudioTranscription } from './api/stt.js';
import { makeCORSHeaders, jsonError } from './utils/http.js';
import { APP_VERSION } from './config.js';
import HTML_PAGE from './frontend/index.html';
import LOGIN_PAGE from './frontend/login.html';
import APP_CSS from './frontend/app.css';
import APP_JS from './frontend/app.client.js';

export async function handleRequest(request, env = {}) {
    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                ...makeCORSHeaders(),
                "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
                "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers") || "Authorization"
            }
        });
    }

    const requestUrl = new URL(request.url);
    const path = requestUrl.pathname;

    if (path === "/app.css") {
        return new Response(APP_CSS, { headers: { "Content-Type": "text/css; charset=utf-8", "Cache-Control": "max-age=86400" } });
    }
    if (path === "/app.client.js") {
        return new Response(APP_JS, { headers: { "Content-Type": "application/javascript; charset=utf-8", "Cache-Control": "max-age=86400" } });
    }

    if (path === "/v1/version") {
        return new Response(JSON.stringify({
            name: "cf-voice",
            version: APP_VERSION,
            changelog_url: "https://github.com/vimbackground/CF-voice/blob/master/CHANGELOG.md"
        }), {
            headers: {
                "Content-Type": "application/json",
                ...makeCORSHeaders()
            }
        });
    }

    if (path === '/auth/login') {
        return handleLogin(request, env);
    }

    if (path.startsWith('/v1/') && !hasValidApiKey(request, env)) {
        return jsonError('API Key 无效或未提供', null, 'invalid_api_key', 401);
    }

    if (path === "/" || path === "/index.html") {
        if (env.ACCESS_PASSWORD && !(await hasValidPageSession(request, env))) {
            return new Response(LOGIN_PAGE, { 
                status: 401, 
                headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } 
            });
        }
        const renderedHtml = HTML_PAGE.replaceAll('{{APP_VERSION}}', APP_VERSION);
        return new Response(renderedHtml, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                ...makeCORSHeaders()
            }
        });
    }

    if (path === "/v1/audio/transcriptions") {
        return handleAudioTranscription(request, env);
    }

    if (path === "/v1/audio/speech") {
        try {
            const contentType = request.headers.get("content-type") || "";
            
            if (contentType.includes("multipart/form-data")) {
                return await handleFileUpload(request);
            }
            
            const requestBody = await request.json();
            const {
                input,
                voice = "zh-CN-XiaoxiaoNeural",
                model = "tts-1",
                speed = '1.0',
                volume = '0',
                pitch = '0',
                style = "general",
                response_format = "mp3"
            } = requestBody;

            if (typeof input !== 'string' || !input.trim()) {
                return jsonError('input 是必填字符串', 'input', 'invalid_input', 400);
            }
            if (!['mp3', 'wav', 'opus', 'pcm'].includes(response_format)) {
                return jsonError('支持 response_format: mp3、wav、opus 或 pcm', 'response_format', 'invalid_response_format', 400);
            }
            
            const voiceName = normalizeOpenAiVoice(voice);
            const outputFormat = outputFormatFor(response_format);

            let rate = parseInt(String((parseFloat(speed) - 1.0) * 100));
            let numVolume = parseInt(String(parseFloat(volume) * 100));
            let numPitch = parseInt(pitch);
            
            return await getVoice(
                input,
                voiceName,
                rate >= 0 ? `+${rate}%` : `${rate}%`,
                numPitch >= 0 ? `+${numPitch}Hz` : `${numPitch}Hz`,
                numVolume >= 0 ? `+${numVolume}%` : `${numVolume}%`,
                style,
                outputFormat
            );

        } catch (error) {
            console.error("Error:", error);
            return new Response(JSON.stringify({
                error: { message: error.message, type: "api_error", param: null, code: "edge_tts_error" }
            }), {
                status: 500,
                headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
            });
        }
    }

    return new Response("Not Found", { status: 404 });
}
