import { makeCORSHeaders, jsonError } from '../utils/http.js';

export async function handleAudioTranscription(request, env = {}) {
    try {
        if (request.method !== 'POST') return jsonError('只支持POST方法', 'method', 'method_not_allowed', 405);

        const contentType = request.headers.get("content-type") || "";
        if (!contentType.includes("multipart/form-data")) {
            return jsonError('请求必须使用multipart/form-data格式', 'content-type', 'invalid_content_type');
        }

        const formData = await request.formData();
        const audioFile = formData.get('file');
        const customToken = formData.get('token');
        const provider = formData.get('provider') || 'siliconflow';
        const model = formData.get('model') || (provider === 'siliconflow' ? 'FunAudioLLM/SenseVoiceSmall' : 'whisper-1');
        const baseUrl = formData.get('base_url');
        const language = formData.get('language');
        const prompt = formData.get('prompt');
        const responseFormat = formData.get('response_format');

        if (!audioFile) return jsonError('未找到音频文件', 'file', 'missing_file');
        if (audioFile.size > 10 * 1024 * 1024) return jsonError('音频文件大小不能超过10MB', 'file', 'file_too_large');

        const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/flac', 'audio/aac', 'audio/ogg', 'audio/webm', 'audio/amr', 'audio/3gpp'];
        const isValidType = allowedTypes.some(type => 
            audioFile.type.includes(type) || audioFile.name.toLowerCase().match(/\.(mp3|wav|m4a|flac|aac|ogg|webm|amr|3gp)$/i)
        );

        if (!isValidType) {
            return jsonError('不支持的音频文件格式，请上传mp3、wav、m4a、flac、aac、ogg、webm、amr或3gp格式的文件', 'file', 'invalid_file_type');
        }

        if (!['siliconflow', 'openai-compatible'].includes(provider)) {
            return jsonError('provider 必须为 siliconflow 或 openai-compatible', 'provider', 'invalid_provider');
        }
        if (provider === 'openai-compatible' && (!baseUrl || !/^https:\/\//i.test(baseUrl))) {
            return jsonError('兼容服务需要有效的 HTTPS base_url', 'base_url', 'invalid_base_url');
        }
        if (provider === 'openai-compatible' && !customToken) {
            return jsonError('使用兼容服务时必须提供该服务自己的 API Key', 'token', 'missing_api_key', 401);
        }
        
        const token = provider === 'siliconflow' ? (customToken || env.STT_API_KEY) : customToken;
        if (!token) return jsonError('请提供 API Key，或由部署者配置 STT_API_KEY', 'token', 'missing_api_key', 401);

        const apiFormData = new FormData();
        apiFormData.append('file', audioFile);
        apiFormData.append('model', model);
        if (language) apiFormData.append('language', language);
        if (prompt) apiFormData.append('prompt', prompt);
        if (responseFormat) apiFormData.append('response_format', responseFormat);

        const endpoint = provider === 'siliconflow'
            ? 'https://api.siliconflow.cn/v1/audio/transcriptions'
            : baseUrl.replace(/\/$/, '') + '/audio/transcriptions';
            
        const apiResponse = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: apiFormData
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error('API错误:', apiResponse.status, errorText);
            
            let errorMessage = '语音转录服务暂时不可用';
            if (apiResponse.status === 401) errorMessage = 'API Token无效，请检查您的配置';
            else if (apiResponse.status === 429) errorMessage = '请求过于频繁，请稍后再试';
            else if (apiResponse.status === 413) errorMessage = '音频文件太大，请选择较小的文件';

            return new Response(JSON.stringify({
                error: { message: errorMessage, type: "api_error", param: null, code: "transcription_api_error" }
            }), {
                status: apiResponse.status,
                headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
            });
        }

        const transcriptionResult = await apiResponse.json();
        return new Response(JSON.stringify(transcriptionResult), {
            headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
        });

    } catch (error) {
        console.error("语音转录处理失败:", error);
        return new Response(JSON.stringify({
            error: { message: "语音转录处理失败", type: "api_error", param: null, code: "transcription_processing_error" }
        }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
        });
    }
}
