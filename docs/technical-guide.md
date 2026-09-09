# CF-voice 技术与部署指南

本指南面向部署者和开发者。产品功能与普通使用说明请见项目根目录的 [README](../README.md)。

## 一键部署

在 README 中点击 **Deploy to Cloudflare Workers** 按钮，Cloudflare 会基于当前仓库创建并部署 Worker。完成后可通过 Worker 分配的域名访问网页。

## 手动部署

前提：已安装 Node.js，且已登录 Cloudflare 账号。

```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

本地预览：

```bash
wrangler dev
```

Worker 名称和环境名称在 [wrangler.toml](../wrangler.toml) 中维护。

## Secrets 与网页访问密码

不要将 API Key 或访问密码提交到仓库。通过 Wrangler Secret 配置：

```bash
# 为硅基流动配置默认 STT 密钥（可选）
wrangler secret put STT_API_KEY

# 启用网页入口访问密码（可选）
wrangler secret put ACCESS_PASSWORD

# 启用 /v1/* API 专用访问密钥（可选）
wrangler secret put API_ACCESS_KEY
```

配置 `ACCESS_PASSWORD` 后，`/` 和 `/index.html` 会显示密码页。成功验证后客户端会获得 7 天有效的 `HttpOnly`、`Secure` Cookie。所有 `/v1/*` API 都不会被网页密码墙拦截。删除该 Secret 后，网页访问保护自动关闭。

若配置 `API_ACCESS_KEY`，所有 `/v1/*` 请求都必须在 `Authorization: Bearer <key>` 或 `x-api-key: <key>` 中携带该密钥；网页的 OpenTTS 设置区也会显示对应输入框。未配置时 API 保持公开兼容。网页访问密码不是 API Key，不能用于保护调用额度。普通用户配置示例见 [用户指南](user-guide.md)。

## API

### TTS：`POST /v1/audio/speech`

请求体为 JSON。兼容常见 OpenAI TTS 字段，并提供 Edge TTS 扩展参数。

```json
{
  "model": "tts-1",
  "input": "你好，这是一个测试。",
  "voice": "zh-CN-XiaoxiaoNeural",
  "speed": 1.0,
  "response_format": "mp3",
  "pitch": "0",
  "volume": "0",
  "style": "general"
}
```

`response_format` 支持 `mp3`、`wav`、`opus`、`pcm`。也可使用 OpenAI 常见音色别名 `alloy`、`echo`、`fable`、`onyx`、`nova`、`shimmer`，服务会映射到对应 Edge 音色。接口成功时直接返回音频二进制。

TXT 文件可用 `multipart/form-data` 提交到同一路径，字段为 `file`、`voice`、`speed`、`pitch`、`style`、`response_format`。

### STT：`POST /v1/audio/transcriptions`

使用 `multipart/form-data`：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `file` | 是 | 音频文件，最大 10MB |
| `provider` | 否 | `siliconflow`（默认）或 `openai-compatible` |
| `model` | 否 | 识别模型；硅基流动默认 `FunAudioLLM/SenseVoiceSmall` |
| `token` | 视服务商而定 | 硅基流动未提供时使用 `STT_API_KEY`；使用 `openai-compatible` 时必须提供该服务自己的 Key |
| `base_url` | 兼容服务时必填 | HTTPS Base URL，例如 `https://api.example.com/v1` |
| `language`、`prompt`、`response_format` | 否 | 原样转发给兼容服务 |

服务将向硅基流动或 `${base_url}/audio/transcriptions` 发起请求，并把转录 JSON 结果返回。

## CORS 与限制

- 已启用跨域请求，允许 `GET`、`HEAD`、`POST`、`OPTIONS`。
- TXT 上传上限为 500KB；音频上传上限为 10MB。
- 长文本会自动分块合成；单次最多 40 块。
- Edge TTS 是上游依赖，频率限制或上游异常会以 API 错误形式返回。
