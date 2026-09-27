# 更新日志 (Changelog)

本项目遵循 [Semantic Versioning 2.0.0](https://semver.org/lang/zh-CN/) 语义化版本规范，所有重要变更均记录于此。

格式参考 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)。

---

## [v2.0.0] - 2026-09-27

### 🚀 架构重大重构 (Major Refactor)
- **告别巨石单文件**：彻底重构原本近 2900 行的 `index.js`，建立分层模块化工程目录体系：
  - `src/api/`：认证（`auth.js`）、文字转语音（`tts.js`）、语音转文字（`stt.js`）业务逻辑独立封装。
  - `src/utils/`：抽离密码学（`crypto.js`）、HTTP/CORS（`http.js`）及文本分段/转义（`text.js`）等工具函数。
  - `src/frontend/`：前后端代码彻底分离，页面结构与样式独立存放。
- **前后端资源完全解耦**：
  - 提取出独立的 `index.html` 与 `login.html` 模板。
  - 剥离原内嵌 CSS 与客户端 JS 为独立的 `app.css` 与 `app.client.js`，恢复完整的 IDE 语法高亮与前端开发体验。
  - 新增静态资源专属路由，并配置客户端缓存策略（`Cache-Control: max-age=86400`）。
- **零外部运行时依赖构建**：
  - 在 `wrangler.toml` 中配置原生 ES Modules Text Rules，使 HTML、CSS 与客户端脚本均能被 Wrangler 原生打包，不引入任何 npm 外部依赖包或复杂打包工具（Webpack/Vite）。

---

## [v1.1.0] - 2026-09-10

### ✨ 新特性与生态兼容 (Features)
- **品牌确立**：项目正式重命名为 **CF-voice**。
- **双层安全防护体系**：
  - **网页端访问密码 (`ACCESS_PASSWORD`)**：基于 HMAC-SHA256 签名签发 7 天有效的 `HttpOnly`、`Secure` Cookie，提供优雅的密码登录墙。
  - **接口端访问密钥 (`API_ACCESS_KEY`)**：保护所有 `/v1/*` 接口，支持 `Bearer` 与 `x-api-key` 鉴权，实现网页与自动化调用权限的清晰隔离。
- **远程调用面板 (Remote Panel)**：
  - 新增“远程调用”独立标签页，自动生成当前部署实例的标准 OpenAI API Base URL 与端点说明。
  - 内置 OpenAI 官方音色别名（`alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`）到 Edge Neural 的自动映射逻辑。
- **精选中文体验**：
  - 精炼收录 21 款优质微软普通话 Neural 音色（13 款女声 + 8 款男声）。
  - 支持按性别与适用场景（通用/讲解、正式/商务、故事/情感、短视频/活动）分类筛选。
  - 增加“试听当前音色”功能，生成前无需输入完整文本即可快速预览声音效果。
- **STT 自定义扩展**：
  - 语音转文字支持接入任意兼容 OpenAI 规范的第三方端点，支持自定义 `base_url` 与自备 API Key。

### 📚 文档完善 (Documentation)
- 新增独立的《[技术与部署指南](docs/technical-guide.md)》，详细说明环境变量、Secrets 与接口参数。
- 新增面向非技术用户的《[普通用户指南](docs/user-guide.md)》，解释网页密码与客户端 API Key 的区别，并提供常见客户端配置指引。

---

## [v1.0.0] - 2025-09-02

### ✨ 首个双向语音正式版 (Initial Major Release)
- **双向语音交互 (TTS ⇄ STT)**：
  - 集成硅基流动 API（`FunAudioLLM/SenseVoiceSmall` 模型），新增 `/v1/audio/transcriptions` 接口。
  - 实现双向功能切换界面，支持文字转语音与语音转文字模式无缝互转。
- **音频上传与在线转写**：
  - 支持拖拽上传 `mp3`, `wav`, `m4a`, `flac`, `aac`, `ogg`, `webm`, `amr`, `3gp` 等 9 种常见音频格式（单文件上限 10MB）。
  - 转录结果支持一键复制、原地编辑，并提供“转为语音”反向回填到 TTS 输入框的一键闭环功能。
- **国际化多语言支持**：
  - 内置 i18n 语言框架，支持中文、英文、日文、韩文、西班牙文、法文、德文和俄文 8 国语言动态切换。

---

## [v0.1.0] - 2025-08-12

### 🐣 原型验证与长文本分片 (MVP)
- **Edge Neural TTS 接入**：基于 Cloudflare Workers 边缘计算实现免配置的微软 Edge 神经网络语音合成。
- **格式与参数调节**：支持 MP3、WAV、Opus 与 PCM 格式输出；支持语速、音调及多种表达风格微调。
- **TXT 文件上传**：支持直接上传纯文本 TXT 文件转语音。
- **攻克边缘环境限制**：
  - 针对 Cloudflare Workers 的子请求（subrequests）上限与微软上游限流，实现智能标点断句分片（`optimizedTextSplit`）。
  - 引入批量并发控制（3 个并发/批）与批次延迟（800ms），保障长文本合成的高稳定性。
