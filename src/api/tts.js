import { tokenInfo, TOKEN_REFRESH_BEFORE_EXPIRY } from '../config.js';
import { sign } from '../utils/crypto.js';
import { makeCORSHeaders, delay, jsonError } from '../utils/http.js';
import { escapeXmlText, optimizedTextSplit } from '../utils/text.js';

export function normalizeOpenAiVoice(voice) {
    const aliases = { alloy: 'en-US-GuyNeural', echo: 'en-US-AndrewNeural', fable: 'en-GB-RyanNeural', onyx: 'en-US-DavisNeural', nova: 'en-US-AriaNeural', shimmer: 'en-US-JennyNeural' };
    return aliases[String(voice).toLowerCase()] || voice;
}

export function outputFormatFor(responseFormat) {
    return { mp3: 'audio-24khz-48kbitrate-mono-mp3', wav: 'riff-24khz-16bit-mono-pcm', pcm: 'raw-24khz-16bit-mono-pcm', opus: 'ogg-24khz-16bit-mono-opus' }[responseFormat] || 'audio-24khz-48kbitrate-mono-mp3';
}

export function contentTypeFor(outputFormat) {
    if (outputFormat.startsWith('riff-')) return 'audio/wav';
    if (outputFormat.startsWith('raw-')) return 'audio/pcm';
    if (outputFormat.startsWith('ogg-')) return 'audio/ogg';
    return 'audio/mpeg';
}

function getSsml(text, voiceName, rate, pitch, volume, style, slien = 0) {
    const escapedText = escapeXmlText(text);
    let slien_str = '';
    if (slien > 0) {
        slien_str = `<break time="${slien}ms" />`;
    }
    return `<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" version="1.0" xml:lang="zh-CN"> 
                <voice name="${voiceName}"> 
                    <mstts:express-as style="${style}"  styledegree="2.0" role="default" > 
                        <prosody rate="${rate}" pitch="${pitch}" volume="${volume}">${escapedText}</prosody> 
                    </mstts:express-as> 
                    ${slien_str}
                </voice> 
            </speak>`;
}

async function getEndpoint() {
    const now = Date.now() / 1000;
    if (tokenInfo.token && tokenInfo.expiredAt && now < tokenInfo.expiredAt - TOKEN_REFRESH_BEFORE_EXPIRY) {
        return tokenInfo.endpoint;
    }
    const endpointUrl = "https://dev.microsofttranslator.com/apps/endpoint?api-version=1.0";
    const clientId = crypto.randomUUID().replace(/-/g, "");
    try {
        const response = await fetch(endpointUrl, {
            method: "POST",
            headers: {
                "Accept-Language": "zh-Hans",
                "X-ClientVersion": "4.0.530a 5fe1dc6c",
                "X-UserId": "0f04d16a175c411e",
                "X-HomeGeographicRegion": "zh-Hans-CN",
                "X-ClientTraceId": clientId,
                "X-MT-Signature": await sign(endpointUrl),
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
                "Content-Type": "application/json; charset=utf-8",
                "Content-Length": "0",
                "Accept-Encoding": "gzip"
            }
        });
        if (!response.ok) throw new Error(`获取endpoint失败: ${response.status}`);
        const data = await response.json();
        const jwt = data.t.split(".")[1];
        const decodedJwt = JSON.parse(atob(jwt));
        tokenInfo.endpoint = data;
        tokenInfo.token = data.t;
        tokenInfo.expiredAt = decodedJwt.exp;
        return data;
    } catch (error) {
        console.error("获取endpoint失败:", error);
        if (tokenInfo.token) {
            console.log("使用过期的缓存token");
            return tokenInfo.endpoint;
        }
        throw error;
    }
}

async function getAudioChunk(text, voiceName, rate, pitch, volume, style, outputFormat = 'audio-24khz-48kbitrate-mono-mp3', maxRetries = 3) {
    const retryDelay = 500; 
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const endpoint = await getEndpoint();
            const url = `https://${endpoint.r}.tts.speech.microsoft.com/cognitiveservices/v1`;
            
            let m = text.match(/\[(\d+)\]\s*?$/);
            let slien = 0;
            if (m && m.length == 2) {
                slien = parseInt(m[1]);
                text = text.replace(m[0], '');
            }
            
            if (!text.trim()) throw new Error("文本块为空");
            if (text.length > 2000) throw new Error(`文本块过长: ${text.length} 字符，最大支持2000字符`);
            
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": endpoint.t,
                    "Content-Type": "application/ssml+xml",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
                    "X-Microsoft-OutputFormat": outputFormat
                },
                body: getSsml(text, voiceName, rate, pitch, volume, style, slien)
            });

            if (!response.ok) {
                const errorText = await response.text();
                if (response.status === 429) {
                    if (attempt < maxRetries) {
                        console.log(`频率限制，第${attempt + 1}次重试，等待${retryDelay * (attempt + 1)}ms`);
                        await delay(retryDelay * (attempt + 1));
                        continue;
                    }
                    throw new Error(`请求频率过高，已重试${maxRetries}次仍失败`);
                } else if (response.status >= 500) {
                    if (attempt < maxRetries) {
                        console.log(`服务器错误，第${attempt + 1}次重试，等待${retryDelay * (attempt + 1)}ms`);
                        await delay(retryDelay * (attempt + 1));
                        continue;
                    }
                    throw new Error(`Edge TTS服务器错误: ${response.status} ${errorText}`);
                } else {
                    throw new Error(`Edge TTS API错误: ${response.status} ${errorText}`);
                }
            }
            return await response.blob();
        } catch (error) {
            if (attempt === maxRetries) throw new Error(`音频生成失败（已重试${maxRetries}次）: ${error.message}`);
            if (error.message.includes('fetch') || error.message.includes('network')) {
                console.log(`网络错误，第${attempt + 1}次重试，等待${retryDelay * (attempt + 1)}ms`);
                await delay(retryDelay * (attempt + 1));
                continue;
            }
            throw error;
        }
    }
}

async function processBatchedAudioChunks(chunks, voiceName, rate, pitch, volume, style, outputFormat, batchSize = 3, delayMs = 800) {
    const audioChunks = [];
    for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        console.log(`正在处理批次 ${Math.floor(i/batchSize) + 1}/${Math.ceil(chunks.length/batchSize)}`);
        
        const batchPromises = batch.map(chunk => 
            getAudioChunk(chunk, voiceName, rate, pitch, volume, style, outputFormat)
        );
        try {
            const batchResults = await Promise.all(batchPromises);
            audioChunks.push(...batchResults);
            if (i + batchSize < chunks.length) {
                await delay(delayMs);
            }
        } catch (error) {
            console.error(`批次处理失败:`, error);
            throw error;
        }
    }
    return audioChunks;
}

export async function getVoice(text, voiceName = "zh-CN-XiaoxiaoNeural", rate = '+0%', pitch = '+0Hz', volume = '+0%', style = "general", outputFormat = "audio-24khz-48kbitrate-mono-mp3") {
    try {
        const cleanText = text.trim();
        if (!cleanText) throw new Error("文本内容为空");
        if (cleanText.length > 1500 && outputFormat !== 'audio-24khz-48kbitrate-mono-mp3') {
            throw new Error('长文本合成当前仅支持 MP3 输出；WAV、Opus 和 PCM 请分段生成');
        }
        
        if (cleanText.length <= 1500) {
            const audioBlob = await getAudioChunk(cleanText, voiceName, rate, pitch, volume, style, outputFormat);
            return new Response(audioBlob, {
                headers: {
                    "Content-Type": contentTypeFor(outputFormat),
                    ...makeCORSHeaders()
                }
            });
        }

        const chunks = optimizedTextSplit(cleanText, 1500);
        if (chunks.length > 40) {
            throw new Error(`文本过长，分块数量(${chunks.length})超过限制。请缩短文本或分批处理。`);
        }
        
        console.log(`文本已分为 ${chunks.length} 个块进行处理`);
        const audioChunks = await processBatchedAudioChunks(chunks, voiceName, rate, pitch, volume, style, outputFormat, 3, 800);
        const concatenatedAudio = new Blob(audioChunks, { type: 'audio/mpeg' });
        
        return new Response(concatenatedAudio, {
            headers: {
                "Content-Type": contentTypeFor(outputFormat),
                ...makeCORSHeaders()
            }
        });
    } catch (error) {
        console.error("语音合成失败:", error);
        return new Response(JSON.stringify({
            error: {
                message: error.message || String(error),
                type: "api_error",
                param: `${voiceName}, ${rate}, ${pitch}, ${volume}, ${style}, ${outputFormat}`,
                code: "edge_tts_error"
            }
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                ...makeCORSHeaders()
            }
        });
    }
}

export async function handleFileUpload(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const voice = formData.get('voice') || 'zh-CN-XiaoxiaoNeural';
        const speed = formData.get('speed') || '1.0';
        const volume = formData.get('volume') || '0';
        const pitch = formData.get('pitch') || '0';
        const style = formData.get('style') || 'general';
        const responseFormat = formData.get('response_format') || 'mp3';

        if (!file) return jsonError('未找到上传的文件', 'file', 'missing_file');
        if (!file.type.includes('text/') && !file.name.toLowerCase().endsWith('.txt')) {
            return jsonError('不支持的文件类型，请上传txt文件', 'file', 'invalid_file_type');
        }
        if (file.size > 500 * 1024) return jsonError('文件大小超过限制（最大500KB）', 'file', 'file_too_large');
        
        const text = await file.text();
        if (!text.trim()) return jsonError('文件内容为空', 'file', 'empty_file');
        if (text.length > 10000) return jsonError('文本内容过长（最大10000字符）', 'file', 'text_too_long');

        let rate = parseInt(String((parseFloat(speed) - 1.0) * 100));
        let numVolume = parseInt(String(parseFloat(volume) * 100));
        let numPitch = parseInt(pitch);

        const outputFormat = outputFormatFor(responseFormat);

        return await getVoice(
            text,
            voice,
            rate >= 0 ? `+${rate}%` : `${rate}%`,
            numPitch >= 0 ? `+${numPitch}Hz` : `${numPitch}Hz`,
            numVolume >= 0 ? `+${numVolume}%` : `${numVolume}%`,
            style,
            outputFormat
        );

    } catch (error) {
        console.error("文件上传处理失败:", error);
        return new Response(JSON.stringify({
            error: { message: "文件处理失败", type: "api_error", param: null, code: "file_processing_error" }
        }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...makeCORSHeaders() }
        });
    }
}
