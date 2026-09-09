const TOKEN_REFRESH_BEFORE_EXPIRY = 3 * 60;
const AUTH_COOKIE_NAME = 'voicecraft_access';
let tokenInfo = {
    endpoint: null,
    token: null,
    expiredAt: null
};

// HTML 页面模板
const HTML_PAGE = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-i18n="page.title">CF-voice - AI-Powered Voice Processing Platform</title>
    <meta name="description" content="" data-i18n-content="page.description">
    <meta name="keywords" content="" data-i18n-content="page.keywords">
    <style>
        :root {
            --primary-color: #2563eb;
            --primary-hover: #1d4ed8;
            --secondary-color: #64748b;
            --success-color: #059669;
            --warning-color: #d97706;
            --error-color: #dc2626;
            --background-color: #f8fafc;
            --surface-color: #ffffff;
            --text-primary: #0f172a;
            --text-secondary: #475569;  
            --border-color: #e2e8f0;
            --border-focus: #3b82f6;
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            --radius-sm: 6px;
            --radius-md: 8px;
            --radius-lg: 12px;
            --radius-xl: 16px;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: var(--background-color);
            color: var(--text-primary);
            line-height: 1.6;
            min-height: 100vh;
        }
        
        .container {
            max-width: 1080px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .main-content, .transcription-container, .remote-container {
            background: var(--surface-color);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--border-color);
            overflow: visible;
            max-width: 900px;
            margin: 0 auto;
        }
        
        .form-container {
            padding: 26px;
        }
        
        .form-group {
            margin-bottom: 16px;
        }
        
        .form-label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: var(--text-primary);
            font-size: 0.875rem;
        }
        
        .form-input, .form-select, .form-textarea {
            width: 100%;
            padding: 12px 16px;
            border: 2px solid var(--border-color);
            border-radius: var(--radius-md);
            font-size: 16px;
            color: var(--text-primary);
            background: var(--surface-color);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .form-input:focus, .form-select:focus, .form-textarea:focus {
            outline: none;
            border-color: var(--border-focus);
            box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
        }
        
        .form-textarea {
            min-height: 120px;
            resize: vertical;
            font-family: inherit;
        }
        
        .controls-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 12px;
            margin-bottom: 18px;
        }
        .voice-filter-grid { margin-bottom: 12px; }
        #voice { min-width: 0; }
        #voiceControl { grid-column: auto; }
        #textInputArea .form-textarea, #fileDropZone { height: 190px; min-height: 190px; }
        #fileDropZone { display: flex; align-items: center; justify-content: center; }

        .utility-row { display: flex; gap: 10px; align-items: center; margin: -4px 0 16px; }
        .btn-outline { background: #fff; color: var(--primary-color); border: 1px solid var(--border-focus); padding: 9px 13px; border-radius: var(--radius-md); cursor: pointer; font-weight: 600; }
        .settings-panel { background: #f8fafc; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 14px; margin-bottom: 16px; }
        .settings-panel summary { cursor: pointer; font-weight: 700; color: var(--text-primary); }
        .settings-panel .controls-grid { margin: 14px 0 0; }
        .settings-help { color: var(--text-secondary); font-size: .78rem; margin-top: 6px; }
        .voice-table-wrap { overflow-x: auto; margin-top: 14px; }
        .voice-table { width: 100%; border-collapse: collapse; font-size: .82rem; white-space: nowrap; }
        .voice-table th, .voice-table td { padding: 8px 10px; text-align: left; border-bottom: 1px solid var(--border-color); }
        .voice-table th { color: var(--text-secondary); font-weight: 700; }
        .voice-table code { color: var(--primary-hover); font-size: .8rem; }
        .app-bar { max-width: 900px; margin: 0 auto 14px; padding: 0 4px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .brand-mark { color: var(--primary-color); font-size: 1.2rem; font-weight: 800; letter-spacing: .02em; white-space: nowrap; }
        
        .btn-primary {
            width: 100%;
            background: var(--primary-color);
            color: white;
            border: none;
            padding: 16px 32px;
            font-size: 16px;
            font-weight: 600;
            border-radius: var(--radius-md);
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .btn-primary:hover:not(:disabled) {
            background: var(--primary-hover);
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
        }
        
        .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .btn-secondary {
            background: var(--success-color);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: var(--radius-md);
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-weight: 500;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .btn-secondary:hover {
            background: #047857;
            transform: translateY(-1px);
        }
        
        .result-container {
            margin-top: 32px;
            padding: 24px;
            background: var(--background-color);
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-color);
            display: none;
        }
        
        .audio-player {
            width: 100%;
            margin-bottom: 16px;
            border-radius: var(--radius-md);
        }
        
        .error-message {
            color: var(--error-color);
            background: #fef2f2;
            border: 1px solid #fecaca;
            padding: 16px;
            border-radius: var(--radius-md);
            margin-top: 16px;
            font-weight: 500;
        }
        
        .loading-container {
            text-align: center;
            padding: 32px 20px;
        }
        
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border-color);
            border-top: 3px solid var(--primary-color);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
        }
        
        .loading-text {
            color: var(--text-secondary);
            font-weight: 500;
        }
        
        .wechat-promotion {
            margin-top: 40px;
            background: var(--surface-color);
            border-radius: var(--radius-xl);
            box-shadow: var(--shadow-md);
            border: 1px solid var(--border-color);
            overflow: hidden;
        }
        
        .promotion-header {
            background: #f1f5f9;
            padding: 20px 30px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .promotion-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 8px;
        }
        
        .promotion-subtitle {
            color: var(--text-secondary);
            font-size: 0.875rem;
        }
        
        .promotion-content {
            padding: 30px;
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 24px;
            align-items: center;
        }
        
        .qr-code {
            width: 120px;
            height: 120px;
            border: 2px solid var(--border-color);
            border-radius: var(--radius-lg);
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .qr-code img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .promotion-info h3 {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: 12px;
        }
        
        .promotion-info p {
            color: var(--text-secondary);
            margin-bottom: 16px;
            line-height: 1.6;
        }
        
        .benefits-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .benefits-list li {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin-bottom: 8px;
        }
        
        .benefits-list li:before {
            content: "✓";
            color: var(--success-color);
            font-weight: bold;
            font-size: 1rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .fade-in {
            animation: fadeIn 0.3s ease-out;
        }
        
        /* 输入方式选择优化样式 */
        .input-method-tabs {
            display: flex;
            gap: 4px;
            margin-bottom: 20px;
            background: var(--background-color);
            padding: 4px;
            border-radius: var(--radius-lg);
            border: 1px solid var(--border-color);
        }
        
        .tab-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 14px 20px;
            border: none;
            background: transparent;
            color: var(--text-secondary);
            border-radius: var(--radius-md);
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }
        
        .tab-btn:hover {
            color: var(--primary-color);
            background: rgba(37, 99, 235, 0.05);
        }
        
        .tab-btn.active {
            background: var(--primary-color);
            color: white;
            box-shadow: var(--shadow-sm);
            transform: translateY(-1px);
        }
        
        .tab-btn .tab-icon {
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.1);
            font-size: 0.875rem;
        }
        
        .tab-btn:not(.active) .tab-icon {
            background: rgba(100, 116, 139, 0.1);
        }
        
        .file-upload-container {
            width: 100%;
        }
        
        .file-drop-zone {
            border: 2px dashed var(--border-color);
            border-radius: var(--radius-lg);
            padding: 48px 24px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            background: linear-gradient(135deg, var(--background-color) 0%, rgba(248, 250, 252, 0.8) 100%);
            position: relative;
            overflow: hidden;
        }
        
        .file-drop-zone::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .file-drop-zone:hover::before,
        .file-drop-zone.dragover::before {
            opacity: 1;
        }
        
        .file-drop-zone:hover,
        .file-drop-zone.dragover {
            border-color: var(--primary-color);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);
        }
        
        .file-drop-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
            position: relative;
            z-index: 1;
        }
        
        .file-drop-icon {
            width: 64px;
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, var(--primary-color) 0%, #3b82f6 100%);
            border-radius: var(--radius-lg);
            color: white;
            margin-bottom: 8px;
            box-shadow: var(--shadow-md);
            position: relative;
        }
        
        .file-drop-text {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--text-primary);
            margin: 0;
            line-height: 1.4;
        }
        
        .file-drop-hint {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin: 0;
            padding: 8px 16px;
            background: rgba(100, 116, 139, 0.1);
            border-radius: var(--radius-sm);
        }
        
        .file-info {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            background: linear-gradient(135deg, var(--surface-color) 0%, rgba(248, 250, 252, 0.5) 100%);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            margin-top: 16px;
            box-shadow: var(--shadow-sm);
            transition: all 0.2s ease;
        }
        
        .file-info:hover {
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
        }
        
        .file-details {
            display: flex;
            flex-direction: column;
            gap: 6px;
            flex: 1;
        }
        
        .file-name {
            font-weight: 600;
            color: var(--text-primary);
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .file-name::before {
            content: '';
            width: 16px;
            height: 16px;
            background: var(--primary-color);
            border-radius: 3px;
            opacity: 0.8;
            flex-shrink: 0;
        }
        
        .file-size {
            font-size: 0.8rem;
            color: var(--text-secondary);
            background: rgba(100, 116, 139, 0.1);
            padding: 2px 8px;
            border-radius: 4px;
            display: inline-block;
            width: fit-content;
        }
        
        .file-remove-btn {
            width: 32px;
            height: 32px;
            border: none;
            background: var(--error-color);
            color: white;
            border-radius: var(--radius-md);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.875rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 600;
        }
        
        .file-remove-btn:hover {
            background: #b91c1c;
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        }
        
        /* 主功能切换器样式 */
        .mode-switcher {
            display: flex;
            gap: 8px;
        }
        
        .mode-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 7px 10px;
            border: 1px solid var(--border-color);
            background: var(--surface-color);
            color: var(--text-secondary);
            border-radius: var(--radius-md);
            font-size: .82rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            white-space: nowrap;
        }
        
        .mode-btn:hover {
            border-color: var(--primary-color);
            color: var(--primary-color);
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }
        
        .mode-btn.active {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
        }
        
        .mode-icon {
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* 语音转录界面样式 */
        .audio-upload-zone {
            border: 2px dashed var(--border-color);
            border-radius: var(--radius-lg);
            padding: 48px 24px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            background: linear-gradient(135deg, var(--background-color) 0%, rgba(248, 250, 252, 0.8) 100%);
            position: relative;
            overflow: hidden;
        }
        
        .audio-upload-zone::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .audio-upload-zone:hover::before,
        .audio-upload-zone.dragover::before {
            opacity: 1;
        }
        
        .audio-upload-zone:hover,
        .audio-upload-zone.dragover {
            border-color: var(--primary-color);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);
        }
        
        .token-config {
            display: flex;
            gap: 20px;
            margin-bottom: 16px;
        }
        
        .token-option {
            display: flex;
            align-items: center;
        }
        
        .token-label {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-weight: 500;
            color: var(--text-secondary);
            transition: color 0.2s ease;
        }
        
        .token-label:hover {
            color: var(--text-primary);
        }
        
        .token-label input[type="radio"] {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 2px solid var(--border-color);
            margin: 0;
            cursor: pointer;
            accent-color: var(--primary-color);
        }
        
        .transcription-result {
            margin-top: 20px;
        }
        
        .result-actions {
            display: flex;
            gap: 12px;
            margin-top: 16px;
            flex-wrap: wrap;
        }
        
        .result-actions .btn-secondary {
            flex: 1;
            min-width: 140px;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 16px;
            }
            
            .form-container {
                padding: 24px;
            }
            
            .controls-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }
            
            .promotion-content {
                grid-template-columns: 1fr;
                text-align: center;
                gap: 20px;
            }
            
            .qr-code {
                margin: 0 auto;
            }
            
            .input-method-tabs {
                gap: 2px;
                padding: 2px;
            }
            
            .tab-btn {
                padding: 12px 16px;
                font-size: 0.85rem;
                gap: 8px;
            }
            
            .tab-btn .tab-icon {
                width: 18px;
                height: 18px;
            }
            
            .file-drop-zone {
                padding: 32px 16px;
            }
            
            .file-drop-icon {
                width: 56px;
                height: 56px;
            }
            
            .file-info {
                padding: 16px;
                flex-direction: column;
                gap: 12px;
                align-items: flex-start;
            }
            
            .file-remove-btn {
                align-self: flex-end;
            }
            
            /* 移动端模式切换器样式 */
            .mode-switcher {
                padding: 0 16px;
                margin-bottom: 20px;
                flex-direction: column;
                gap: 12px;
            }
            
            .mode-btn {
                max-width: none;
                padding: 14px 20px;
                font-size: 0.9rem;
                gap: 8px;
            }
            
            .mode-icon {
                width: 20px;
                height: 20px;
            }
            
            /* 移动端语音转录界面样式 */
            .audio-upload-zone {
                padding: 32px 16px;
            }
            
            .token-config {
                flex-direction: column;
                gap: 12px;
            }
            
            .result-actions {
                flex-direction: column;
            }
            
            .result-actions .btn-secondary {
                min-width: auto;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="app-bar">
            <div class="brand-mark">CF-voice · 中文语音工具</div>
            <div class="mode-switcher">
            <button type="button" class="mode-btn active" id="ttsMode">
                <span class="mode-icon">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                    </svg>
                </span>
                <span>文字转语音</span>
            </button>
            <button type="button" class="mode-btn" id="transcriptionMode">
                <span class="mode-icon">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 9m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/>
                        <path d="M9 17v4"/>
                        <path d="M12 13a3 3 0 0 0 3 -3"/>
                        <path d="M15 9.5v-3a3 3 0 0 0 -3 -3h-1"/>
                        <path d="M19 8v8"/>
                        <path d="M17 9v6"/>
                        <path d="M21 9v6"/>
                    </svg>
                </span>
                <span>语音转文字</span>
            </button>
            <button type="button" class="mode-btn" id="remoteMode"><span>远程调用</span></button>
            </div>
        </div>
        <div class="remote-container" id="remoteContainer" style="display: none;">
            <div class="form-container" id="remoteFormContainer">
                <p class="settings-help">在此查看 OpenTTS / OpenAI 兼容调用地址、输出格式、API Key 和可复制音色名称。</p>
            </div>
        </div>
        
        <div class="main-content">
            <div class="form-container">
                <form id="ttsForm">
                    <!-- 输入方式选择 -->
                    <div class="form-group">
                        <label class="form-label">选择输入方式</label>
                        <div class="input-method-tabs">
                            <button type="button" class="tab-btn active" id="textInputTab">
                                <span class="tab-icon">
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                                    </svg>
                                </span>
                                <span>手动输入</span>
                            </button>
                            <button type="button" class="tab-btn" id="fileUploadTab">
                                <span class="tab-icon">
                                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                                    </svg>
                                </span>
                                <span>上传文件</span>
                            </button>
                        </div>
                    </div>

                    <!-- 手动输入区域 -->
                    <div class="form-group" id="textInputArea">
                        <label class="form-label" for="text">输入文本</label>
                        <textarea class="form-textarea" id="text" placeholder="请输入要转换为语音的文本内容，支持中文、英文、数字等..." required></textarea>
                    </div>

                    <!-- 文件上传区域 -->
                    <div class="form-group" id="fileUploadArea" style="display: none;">
                        <label class="form-label" for="fileInput">上传txt文件</label>
                        <div class="file-upload-container">
                            <div class="file-drop-zone" id="fileDropZone">
                                <div class="file-drop-content">
                                    <div class="file-drop-icon">
                                        <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2L13.09 8.26L19 7L17.74 13.09L24 12L17.74 10.91L19 5L13.09 6.26L12 0L10.91 6.26L5 5L6.26 10.91L0 12L6.26 13.09L5 19L10.91 17.74L12 24L13.09 17.74L19 19L17.74 13.09L24 12Z"/>
                                            <path d="M14 2H6A2 2 0 0 0 4 4V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V8L14 2M18 20H6V4H13V9H18V20Z"/>
                                        </svg>
                                    </div>
                                    <p class="file-drop-text">拖拽txt文件到此处，或点击选择文件</p>
                                    <p class="file-drop-hint">支持txt格式，最大500KB</p>
                                </div>
                                <input type="file" id="fileInput" accept=".txt,text/plain" style="display: none;">
                            </div>
                            <div class="file-info" id="fileInfo" style="display: none;">
                                <div class="file-details">
                                    <span class="file-name" id="fileName"></span>
                                    <span class="file-size" id="fileSize"></span>
                                </div>
                                <button type="button" class="file-remove-btn" id="fileRemoveBtn">✕</button>
                            </div>
                        </div>
                    </div>
                
                    <div class="controls-grid voice-filter-grid">
                        <div class="form-group"><label class="form-label" for="voiceGender">性别筛选</label><select class="form-select" id="voiceGender"><option value="all">全部</option><option value="female">女声</option><option value="male">男声</option></select></div>
                        <div class="form-group"><label class="form-label" for="voiceScene">适用场景</label><select class="form-select" id="voiceScene"><option value="all">全部场景</option><option value="general">通用 / 讲解</option><option value="formal">正式 / 商务</option><option value="story">故事 / 情感</option><option value="shortvideo">短视频 / 活动</option></select></div>
                    </div>
                    <div class="controls-grid">
                        <div class="form-group" id="voiceControl">
                            <label class="form-label" for="voice">语音选择</label>
                            <select class="form-select" id="voice">
                                <option value="zh-CN-XiaoxiaoNeural">晓晓 (女声·温柔)</option>
                                <option value="zh-CN-YunxiNeural">云希 (男声·清朗)</option>
                                <option value="zh-CN-YunyangNeural">云扬 (男声·阳光)</option>
                                <option value="zh-CN-XiaoyiNeural">晓伊 (女声·甜美)</option>
                                <option value="zh-CN-YunjianNeural">云健 (男声·稳重)</option>
                                <option value="zh-CN-XiaochenNeural">晓辰 (女声·知性)</option>
                                <option value="zh-CN-XiaohanNeural">晓涵 (女声·优雅)</option>
                                <option value="zh-CN-XiaomengNeural">晓梦 (女声·梦幻)</option>
                                <option value="zh-CN-XiaomoNeural">晓墨 (女声·文艺)</option>
                                <option value="zh-CN-XiaoqiuNeural">晓秋 (女声·成熟)</option>
                                <option value="zh-CN-XiaoruiNeural">晓睿 (女声·智慧)</option>
                                <option value="zh-CN-XiaoshuangNeural">晓双 (女声·活泼)</option>
                                <option value="zh-CN-XiaoxuanNeural">晓萱 (女声·清新)</option>
                                <option value="zh-CN-XiaoyanNeural">晓颜 (女声·柔美)</option>
                                <option value="zh-CN-XiaoyouNeural">晓悠 (女声·悠扬)</option>
                                <option value="zh-CN-XiaozhenNeural">晓甄 (女声·端庄)</option>
                                <option value="zh-CN-YunfengNeural">云枫 (男声·磁性)</option>
                                <option value="zh-CN-YunhaoNeural">云皓 (男声·豪迈)</option>
                                <option value="zh-CN-YunxiaNeural">云夏 (男声·热情)</option>
                                <option value="zh-CN-YunyeNeural">云野 (男声·野性)</option>
                                <option value="zh-CN-YunzeNeural">云泽 (男声·深沉)</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="speed">语速调节</label>
                            <select class="form-select" id="speed">
                                <option value="0.5">🐌 很慢</option>
                                <option value="0.75">🚶 慢速</option>
                                <option value="1.0" selected>⚡ 正常</option>
                                <option value="1.25">🏃 快速</option>
                                <option value="1.5">🚀 很快</option>
                                <option value="2.0">💨 极速</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="pitch">音调高低</label>
                            <select class="form-select" id="pitch">
                                <option value="-50">📉 很低沉</option>
                                <option value="-25">📊 低沉</option>
                                <option value="0" selected>🎵 标准</option>
                                <option value="25">📈 高亢</option>
                                <option value="50">🎶 很高亢</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="style">语音风格</label>
                            <select class="form-select" id="style">
                                <option value="general" selected>🎭 通用风格</option>
                                <option value="assistant">🤖 智能助手</option>
                                <option value="chat">💬 聊天对话</option>
                                <option value="customerservice">📞 客服专业</option>
                                <option value="newscast">📺 新闻播报</option>
                                <option value="affectionate">💕 亲切温暖</option>
                                <option value="calm">😌 平静舒缓</option>
                                <option value="cheerful">😊 愉快欢乐</option>
                                <option value="gentle">🌸 温和柔美</option>
                                <option value="lyrical">🎼 抒情诗意</option>
                                <option value="serious">🎯 严肃正式</option>
                            </select>
                        </div>
                    </div>

                    <div class="utility-row">
                        <button type="button" class="btn-outline" id="previewVoiceBtn">▶ 试听当前音色</button>
                        <span class="settings-help" id="previewStatus">使用固定示例，不会影响当前文本</span>
                    </div>

                    <section class="settings-panel" id="openTtsSettings">
                        <div class="form-label">OpenTTS / OpenAI 兼容设置</div>
                        <p class="settings-help">接口地址：<code>/v1/audio/speech</code>。支持 OpenAI 的 input、model、voice、response_format、speed；扩展参数为 pitch、volume、style。</p>
                        <div class="controls-grid">
                            <div class="form-group"><label class="form-label" for="apiBaseDisplay">API Base URL</label><input class="form-input" id="apiBaseDisplay" readonly></div>
                            <div class="form-group"><label class="form-label" for="responseFormat">输出格式</label><select class="form-select" id="responseFormat"><option value="mp3">MP3</option><option value="wav">WAV</option><option value="opus">Opus</option><option value="pcm">PCM</option></select></div>
                            <div class="form-group"><label class="form-label" for="apiKeyInput">CF-voice API Key（可选）</label><input class="form-input" id="apiKeyInput" type="password" autocomplete="off" placeholder="部署者启用 API 保护时填写"></div>
                        </div>
                        <div class="voice-table-wrap">
                            <table class="voice-table"><thead><tr><th>普通话女声</th><th>可复制音色名称</th><th>推荐场景</th></tr></thead><tbody>
                                <tr><td>晓晓</td><td><code>zh-CN-XiaoxiaoNeural</code></td><td>通用、文章朗读</td></tr><tr><td>晓伊</td><td><code>zh-CN-XiaoyiNeural</code></td><td>轻松、儿童内容</td></tr><tr><td>晓辰</td><td><code>zh-CN-XiaochenNeural</code></td><td>课程、知识讲解</td></tr><tr><td>晓涵</td><td><code>zh-CN-XiaohanNeural</code></td><td>品牌、正式朗读</td></tr><tr><td>晓梦</td><td><code>zh-CN-XiaomengNeural</code></td><td>故事、情感内容</td></tr><tr><td>晓墨</td><td><code>zh-CN-XiaomoNeural</code></td><td>散文、文化内容</td></tr><tr><td>晓秋</td><td><code>zh-CN-XiaoqiuNeural</code></td><td>访谈、说明内容</td></tr><tr><td>晓睿</td><td><code>zh-CN-XiaoruiNeural</code></td><td>问答、产品讲解</td></tr><tr><td>晓双</td><td><code>zh-CN-XiaoshuangNeural</code></td><td>短视频、活动播报</td></tr><tr><td>晓萱</td><td><code>zh-CN-XiaoxuanNeural</code></td><td>生活方式内容</td></tr><tr><td>晓颜</td><td><code>zh-CN-XiaoyanNeural</code></td><td>舒缓、情感文案</td></tr><tr><td>晓悠</td><td><code>zh-CN-XiaoyouNeural</code></td><td>长文、故事内容</td></tr><tr><td>晓甄</td><td><code>zh-CN-XiaozhenNeural</code></td><td>公告、商务介绍</td></tr>
                            </tbody></table>
                            <table class="voice-table"><thead><tr><th>普通话男声</th><th>可复制音色名称</th><th>推荐场景</th></tr></thead><tbody>
                                <tr><td>云希</td><td><code>zh-CN-YunxiNeural</code></td><td>通用、日常讲解</td></tr><tr><td>云扬</td><td><code>zh-CN-YunyangNeural</code></td><td>短视频、活动内容</td></tr><tr><td>云健</td><td><code>zh-CN-YunjianNeural</code></td><td>课程、企业内容</td></tr><tr><td>云枫</td><td><code>zh-CN-YunfengNeural</code></td><td>故事、纪录片旁白</td></tr><tr><td>云皓</td><td><code>zh-CN-YunhaoNeural</code></td><td>宣传、激励文案</td></tr><tr><td>云夏</td><td><code>zh-CN-YunxiaNeural</code></td><td>客服、活动播报</td></tr><tr><td>云野</td><td><code>zh-CN-YunyeNeural</code></td><td>创意、潮流内容</td></tr><tr><td>云泽</td><td><code>zh-CN-YunzeNeural</code></td><td>新闻、正式介绍</td></tr>
                            </tbody></table>
                        </div>
                    </section>
                    
                    <button type="submit" class="btn-primary" id="generateBtn">
                        <span>🎙️</span>
                        <span>开始生成语音</span>
                    </button>
            </form>
            
                <div id="result" class="result-container">
                    <div id="loading" class="loading-container" style="display: none;">
                        <div class="loading-spinner"></div>
                        <p class="loading-text" id="loadingText">正在生成语音，请稍候...</p>
                        <div class="progress-info" id="progressInfo" style="margin-top: 12px; font-size: 0.875rem; color: var(--text-secondary);"></div>
                    </div>
                    
                    <div id="success" style="display: none;">
                        <audio id="audioPlayer" class="audio-player" controls></audio>
                        <a id="downloadBtn" class="btn-secondary" download="speech.mp3">
                            <span>📥</span>
                            <span>下载音频文件</span>
                        </a>
                    </div>
                    
                    <div id="error" class="error-message" style="display: none;"></div>
                </div>
            </div>
        </div>
        
        <!-- 语音转录界面 -->
        <div class="transcription-container" id="transcriptionContainer" style="display: none;">
            <div class="form-container">
                <form id="transcriptionForm">
                    <div class="form-group">
                        <label class="form-label">上传音频文件</label>
                        <div class="audio-upload-zone" id="audioDropZone">
                            <div class="file-drop-content">
                                <div class="file-drop-icon">
                                    <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                                        <path d="M14 2v6h6"/>
                                        <path d="M12 18v-6"/>
                                        <path d="M9 15l3-3 3 3"/>
                                    </svg>
                                </div>
                                <p class="file-drop-text">拖拽音频文件到此处，或点击选择文件</p>
                                <p class="file-drop-hint">支持mp3、wav、m4a、flac、aac、ogg、webm、amr、3gp格式，最大10MB</p>
                            </div>
                            <input type="file" id="audioFileInput" accept=".mp3,.wav,.m4a,.flac,.aac,.ogg,.webm,.amr,.3gp,audio/*" style="display: none;">
                        </div>
                        <div class="file-info" id="audioFileInfo" style="display: none;">
                            <div class="file-details">
                                <span class="file-name" id="audioFileName"></span>
                                <span class="file-size" id="audioFileSize"></span>
                            </div>
                            <button type="button" class="file-remove-btn" id="audioFileRemoveBtn">✕</button>
                        </div>
                    </div>

                    <details class="settings-panel" open>
                        <summary>STT 服务设置</summary>
                        <div class="controls-grid">
                            <div class="form-group"><label class="form-label" for="sttProvider">服务商</label><select class="form-select" id="sttProvider"><option value="siliconflow">硅基流动</option><option value="openai-compatible">任意 OpenAI 兼容服务</option></select></div>
                            <div class="form-group"><label class="form-label" for="sttModel">模型</label><input class="form-input" id="sttModel" value="FunAudioLLM/SenseVoiceSmall" placeholder="whisper-1 / 模型 ID"></div>
                            <div class="form-group stt-custom-field" style="display:none"><label class="form-label" for="sttBaseUrl">兼容服务 Base URL</label><input class="form-input" id="sttBaseUrl" placeholder="https://api.example.com/v1"></div>
                            <div class="form-group"><label class="form-label" for="tokenInput">API Key（仅本次请求使用）</label><input type="password" class="form-input" id="tokenInput" placeholder="可选：部署者配置默认密钥时可留空"></div>
                        </div>
                        <p class="settings-help">兼容服务将接收标准 multipart 字段：file、model、language、prompt、response_format。</p>
                    </details>

                    <button type="submit" class="btn-primary" id="transcribeBtn">
                        <span>🎧</span>
                        <span>开始语音转录</span>
                    </button>
                </form>

                <div id="transcriptionResult" class="result-container">
                    <div id="transcriptionLoading" class="loading-container" style="display: none;">
                        <div class="loading-spinner"></div>
                        <p class="loading-text" id="transcriptionLoadingText">正在转录音频，请稍候...</p>
                        <div class="progress-info" id="transcriptionProgressInfo" style="margin-top: 12px; font-size: 0.875rem; color: var(--text-secondary);"></div>
                    </div>
                    
                    <div id="transcriptionSuccess" style="display: none;">
                        <div class="transcription-result">
                            <label class="form-label">转录结果</label>
                            <textarea class="form-textarea" id="transcriptionText" 
                                      placeholder="转录结果将在这里显示..." readonly></textarea>
                            <div class="result-actions">
                                <button type="button" class="btn-secondary" id="copyTranscriptionBtn">
                                    <span>📋</span>
                                    <span>复制文本</span>
                                </button>
                                <button type="button" class="btn-secondary" id="editTranscriptionBtn">
                                    <span>✏️</span>
                                    <span>编辑文本</span>
                                </button>
                                <button type="button" class="btn-secondary" id="useForTtsBtn">
                                    <span>🎙️</span>
                                    <span>转为语音</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div id="transcriptionError" class="error-message" style="display: none;"></div>
                </div>
            </div>
        </div>
        
    </div>

    <script>
        let selectedFile = null;
        let currentInputMethod = 'text'; // 'text' or 'file'
        let currentMode = 'tts'; // 'tts' or 'transcription'
        let selectedAudioFile = null;

        // 国际化翻译数据
        const translations = {
            en: {
                'page.title': 'CF-voice - AI-Powered Voice Processing Platform',
                'page.description': 'CF-voice is an AI-powered platform that converts text to speech and speech to text with 20+ voice options, lightning fast processing, completely free to use.',
                'page.keywords': 'text to speech,AI voice synthesis,online TTS,voice generator,free voice tools,speech to text,voice transcription',
                'lang.current': 'English',
                'lang.en': 'English',
                'lang.zh': '中文',
                'lang.ja': '日本語',
                'lang.ko': '한국어',
                'lang.es': 'Español',
                'lang.fr': 'Français',
                'lang.de': 'Deutsch',
                'lang.ru': 'Русский',
                'header.title': 'CF-voice',
                'header.subtitle': 'AI-Powered Voice Processing Platform',
                'header.feature1': '20+ Voice Options',
                'header.feature2': 'Lightning Fast',
                'header.feature3': 'Completely Free',
                'header.feature4': 'Download Support',
                'mode.tts': 'Text to Speech',
                'mode.transcription': 'Speech to Text'
            },
            zh: {
                'page.title': 'CF-voice - AI驱动的语音处理平台',
                'page.description': 'CF-voice是一个AI驱动的平台，支持文字转语音和语音转文字，拥有20+种语音选项，闪电般的处理速度，完全免费使用。',
                'page.keywords': '文字转语音,AI语音合成,在线TTS,语音生成器,免费语音工具,语音转文字,语音转录',
                'lang.current': '中文',
                'lang.en': 'English',
                'lang.zh': '中文',
                'lang.ja': '日本語',
                'lang.ko': '한국어',
                'lang.es': 'Español',
                'lang.fr': 'Français',
                'lang.de': 'Deutsch',
                'lang.ru': 'Русский',
                'header.title': 'CF-voice',
                'header.subtitle': 'AI驱动的语音处理平台',
                'header.feature1': '20+种语音选项',
                'header.feature2': '闪电般快速',
                'header.feature3': '完全免费',
                'header.feature4': '支持下载',
                'mode.tts': '文字转语音',
                'mode.transcription': '语音转文字'
            },
            ja: {
                'page.title': 'CF-voice - AI音声処理プラットフォーム',
                'page.description': 'CF-voiceはAI駆動のプラットフォームで、テキスト読み上げと音声テキスト変換に対応。20以上の音声オプション、高速処理、完全無料でご利用いただけます。',
                'page.keywords': 'テキスト読み上げ,AI音声合成,オンラインTTS,音声ジェネレーター,無料音声ツール,音声テキスト変換,音声転写',
                'lang.current': '日本語',
                'lang.en': 'English',
                'lang.zh': '中文',
                'lang.ja': '日本語',
                'lang.ko': '한국어',
                'lang.es': 'Español',
                'lang.fr': 'Français',
                'lang.de': 'Deutsch',
                'lang.ru': 'Русский',
                'header.title': 'CF-voice',
                'header.subtitle': 'AI音声処理プラットフォーム',
                'header.feature1': '20以上の音声オプション',
                'header.feature2': '高速処理',
                'header.feature3': '完全無料',
                'header.feature4': 'ダウンロード対応',
                'mode.tts': 'テキスト読み上げ',
                'mode.transcription': '音声テキスト変換'
            },
            ko: {
                'page.title': 'CF-voice - AI 음성 처리 플랫폼',
                'page.description': 'CF-voice는 AI 기반 플랫폼으로 텍스트 음성 변환과 음성 텍스트 변환을 지원합니다. 20개 이상의 음성 옵션, 빠른 처리 속도, 완전 무료로 이용하실 수 있습니다.',
                'page.keywords': '텍스트 음성 변환,AI 음성 합성,온라인 TTS,음성 생성기,무료 음성 도구,음성 텍스트 변환,음성 전사',
                'lang.current': '한국어',
                'lang.en': 'English',
                'lang.zh': '中文',
                'lang.ja': '日本語',
                'lang.ko': '한국어',
                'lang.es': 'Español',
                'lang.fr': 'Français',
                'lang.de': 'Deutsch',
                'lang.ru': 'Русский',
                'header.title': 'CF-voice',
                'header.subtitle': 'AI 음성 처리 플랫폼',
                'header.feature1': '20개 이상의 음성 옵션',
                'header.feature2': '빠른 처리',
                'header.feature3': '완전 무료',
                'header.feature4': '다운로드 지원',
                'mode.tts': '텍스트 음성 변환',
                'mode.transcription': '음성 텍스트 변환'
            },
            es: {
                'page.title': 'CF-voice - Plataforma de Procesamiento de Voz con IA',
                'page.description': 'CF-voice es una plataforma impulsada por IA que convierte texto a voz y voz a texto con más de 20 opciones de voz, procesamiento ultrarrápido, completamente gratis.',
                'page.keywords': 'texto a voz,síntesis de voz IA,TTS en línea,generador de voz,herramientas de voz gratis,voz a texto,transcripción de voz',
                'lang.current': 'Español',
                'lang.en': 'English',
                'lang.zh': '中文',
                'lang.ja': '日本語',
                'lang.ko': '한국어',
                'lang.es': 'Español',
                'lang.fr': 'Français',
                'lang.de': 'Deutsch',
                'lang.ru': 'Русский',
                'header.title': 'CF-voice',
                'header.subtitle': 'Plataforma de Procesamiento de Voz con IA',
                'header.feature1': 'Más de 20 Opciones de Voz',
                'header.feature2': 'Ultrarrápido',
                'header.feature3': 'Completamente Gratis',
                'header.feature4': 'Soporte de Descarga',
                'mode.tts': 'Texto a Voz',
                'mode.transcription': 'Voz a Texto'
            },
            fr: {
                'page.title': 'CF-voice - Plateforme de Traitement Vocal IA',
                'page.description': 'CF-voice est une plateforme alimentée par IA qui convertit le texte en parole et la parole en texte avec plus de 20 options vocales, traitement ultra-rapide, entièrement gratuit.',
                'page.keywords': 'texte vers parole,synthèse vocale IA,TTS en ligne,générateur vocal,outils vocaux gratuits,parole vers texte,transcription vocale',
                'lang.current': 'Français',
                'lang.en': 'English',
                'lang.zh': '中文',
                'lang.ja': '日本語',
                'lang.ko': '한국어',
                'lang.es': 'Español',
                'lang.fr': 'Français',
                'lang.de': 'Deutsch',
                'lang.ru': 'Русский',
                'header.title': 'CF-voice',
                'header.subtitle': 'Plateforme de Traitement Vocal IA',
                'header.feature1': 'Plus de 20 Options Vocales',
                'header.feature2': 'Ultra-rapide',
                'header.feature3': 'Entièrement Gratuit',
                'header.feature4': 'Support de Téléchargement',
                'mode.tts': 'Texte vers Parole',
                'mode.transcription': 'Parole vers Texte'
            },
            de: {
                'page.title': 'CF-voice - KI-gestützte Sprachverarbeitungsplattform',
                'page.description': 'CF-voice ist eine KI-gestützte Sprachverarbeitungsplattform, die Text in Sprache und Sprache in Text umwandelt, mit über 20 Sprachoptionen, blitzschneller Verarbeitung, völlig kostenlos.',
                'page.keywords': 'Text zu Sprache,KI-Sprachsynthese,Online-TTS,Sprachgenerator,kostenlose Sprachtools,Sprache zu Text,Sprachtranskription',
                'lang.current': 'Deutsch',
                'lang.en': 'English',
                'lang.zh': '中文',
                'lang.ja': '日本語',
                'lang.ko': '한국어',
                'lang.es': 'Español',
                'lang.fr': 'Français',
                'lang.de': 'Deutsch',
                'lang.ru': 'Русский',
                'header.title': 'CF-voice',
                'header.subtitle': 'KI-gestützte Sprachverarbeitungsplattform',
                'header.feature1': 'Über 20 Sprachoptionen',
                'header.feature2': 'Blitzschnell',
                'header.feature3': 'Völlig Kostenlos',
                'header.feature4': 'Download-Unterstützung',
                'mode.tts': 'Text zu Sprache',
                'mode.transcription': 'Sprache zu Text'
            },
            ru: {
                'page.title': 'CF-voice - ИИ-платформа обработки голоса',
                'page.description': 'CF-voice - это платформа на базе ИИ, которая преобразует текст в речь и речь в текст с более чем 20 голосовыми опциями, молниеносной обработкой, совершенно бесплатно.',
                'page.keywords': 'текст в речь,ИИ синтез речи,онлайн TTS,генератор голоса,бесплатные голосовые инструменты,речь в текст,транскрипция речи',
                'lang.current': 'Русский',
                'lang.en': 'English',
                'lang.zh': '中文',
                'lang.ja': '日本語',
                'lang.ko': '한국어',
                'lang.es': 'Español',
                'lang.fr': 'Français',
                'lang.de': 'Deutsch',
                'lang.ru': 'Русский',
                'header.title': 'CF-voice',
                'header.subtitle': 'ИИ-платформа обработки голоса',
                'header.feature1': 'Более 20 голосовых опций',
                'header.feature2': 'Молниеносно',
                'header.feature3': 'Совершенно Бесплатно',
                'header.feature4': 'Поддержка Загрузки',
                'mode.tts': 'Текст в Речь',
                'mode.transcription': 'Речь в Текст'
            }
        };

        // 国际化功能
        function detectLanguage() {
            // 检测浏览器语言
            const browserLang = navigator.language || navigator.userLanguage;
            const shortLang = browserLang.split('-')[0];
            
            // 检查是否支持该语言
            if (translations[shortLang]) {
                return shortLang;
            }
            
            // 默认返回英语
            return 'en';
        }

        function setLanguage(lang) {
            currentLanguage = lang;
            localStorage.setItem('voicecraft-language', lang);
            
            // 更新页面语言属性
            document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
            
            // 应用翻译
            applyTranslations();
            
        }

        function applyTranslations() {
            const langData = translations[currentLanguage];
            
            // 更新所有带有 data-i18n 属性的元素
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (langData[key]) {
                    element.textContent = langData[key];
                }
            });
            
            // 更新 meta 标签
            document.querySelectorAll('[data-i18n-content]').forEach(element => {
                const key = element.getAttribute('data-i18n-content');
                if (langData[key]) {
                    element.setAttribute('content', langData[key]);
                }
            });
            
            // 更新页面标题
            if (langData['page.title']) {
                document.title = langData['page.title'];
            }
        }

        function updateLanguageSwitcher() {
            const langFlags = {
                'en': '🇺🇸',
                'zh': '🇨🇳',
                'ja': '🇯🇵',
                'ko': '🇰🇷',
                'es': '🇪🇸',
                'fr': '🇫🇷',
                'de': '🇩🇪',
                'ru': '🇷🇺'
            };
            
            const langData = translations[currentLanguage];
            document.getElementById('currentLangFlag').textContent = langFlags[currentLanguage];
            document.getElementById('currentLangName').textContent = langData['lang.current'];
            
            // 更新选中状态
            document.querySelectorAll('.language-option').forEach(option => {
                option.classList.remove('active');
                if (option.getAttribute('data-lang') === currentLanguage) {
                    option.classList.add('active');
                }
            });
        }

        // 初始化页面
        document.addEventListener('DOMContentLoaded', function() {
            // 初始化国际化
            initializeI18n();
            
            // 初始化其他功能
            initializeInputMethodTabs();
            initializeVoiceFilters();
            initializeFileUpload();
            initializeModeSwitcher();
            initializeRemotePanel();
            initializeAudioUpload();
            initializeTokenConfig();
            initializeVoicePreview();
            document.getElementById('apiBaseDisplay').value = window.location.origin + '/v1';
        });

        // 初始化输入方式切换
        function initializeInputMethodTabs() {
            const textInputTab = document.getElementById('textInputTab');
            const fileUploadTab = document.getElementById('fileUploadTab');
            const textInputArea = document.getElementById('textInputArea');
            const fileUploadArea = document.getElementById('fileUploadArea');

            textInputTab.addEventListener('click', function() {
                currentInputMethod = 'text';
                textInputTab.classList.add('active');
                fileUploadTab.classList.remove('active');
                textInputArea.style.display = 'block';
                fileUploadArea.style.display = 'none';
                document.getElementById('text').required = true;
            });

            fileUploadTab.addEventListener('click', function() {
                currentInputMethod = 'file';
                fileUploadTab.classList.add('active');
                textInputTab.classList.remove('active');
                textInputArea.style.display = 'none';
                fileUploadArea.style.display = 'block';
                document.getElementById('text').required = false;
            });
        }

        function initializeVoiceFilters() {
            const gender = document.getElementById('voiceGender');
            const scene = document.getElementById('voiceScene');
            const voice = document.getElementById('voice');
            document.querySelector('.voice-filter-grid').appendChild(document.getElementById('voiceControl'));
            const profiles = {
                'zh-CN-XiaoxiaoNeural': ['female', 'general'], 'zh-CN-XiaoyiNeural': ['female', 'shortvideo'], 'zh-CN-XiaochenNeural': ['female', 'general'], 'zh-CN-XiaohanNeural': ['female', 'formal'], 'zh-CN-XiaomengNeural': ['female', 'story'], 'zh-CN-XiaomoNeural': ['female', 'story'], 'zh-CN-XiaoqiuNeural': ['female', 'formal'], 'zh-CN-XiaoruiNeural': ['female', 'general'], 'zh-CN-XiaoshuangNeural': ['female', 'shortvideo'], 'zh-CN-XiaoxuanNeural': ['female', 'general'], 'zh-CN-XiaoyanNeural': ['female', 'story'], 'zh-CN-XiaoyouNeural': ['female', 'story'], 'zh-CN-XiaozhenNeural': ['female', 'formal'], 'zh-CN-YunxiNeural': ['male', 'general'], 'zh-CN-YunyangNeural': ['male', 'shortvideo'], 'zh-CN-YunjianNeural': ['male', 'formal'], 'zh-CN-YunfengNeural': ['male', 'story'], 'zh-CN-YunhaoNeural': ['male', 'shortvideo'], 'zh-CN-YunxiaNeural': ['male', 'shortvideo'], 'zh-CN-YunyeNeural': ['male', 'shortvideo'], 'zh-CN-YunzeNeural': ['male', 'formal']
            };
            function filterVoices() {
                let firstVisible = null;
                [...voice.options].forEach(option => {
                    const profile = profiles[option.value];
                    const visible = profile && (gender.value === 'all' || profile[0] === gender.value) && (scene.value === 'all' || profile[1] === scene.value);
                    option.hidden = !visible;
                    if (visible && !firstVisible) firstVisible = option;
                });
                if (voice.selectedOptions[0]?.hidden && firstVisible) voice.value = firstVisible.value;
            }
            gender.addEventListener('change', filterVoices);
            scene.addEventListener('change', filterVoices);
        }

        function apiHeaders(headers = {}) {
            const apiKey = document.getElementById('apiKeyInput')?.value.trim();
            return apiKey ? { ...headers, 'Authorization': 'Bearer ' + apiKey } : headers;
        }

        // 初始化文件上传功能
        function initializeFileUpload() {
            const fileDropZone = document.getElementById('fileDropZone');
            const fileInput = document.getElementById('fileInput');
            const fileInfo = document.getElementById('fileInfo');
            const fileRemoveBtn = document.getElementById('fileRemoveBtn');

            // 点击上传区域
            fileDropZone.addEventListener('click', function() {
                fileInput.click();
            });

            // 文件选择
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    handleFileSelect(file);
                }
            });

            // 拖拽功能
            fileDropZone.addEventListener('dragover', function(e) {
                e.preventDefault();
                fileDropZone.classList.add('dragover');
            });

            fileDropZone.addEventListener('dragleave', function(e) {
                e.preventDefault();
                fileDropZone.classList.remove('dragover');
            });

            fileDropZone.addEventListener('drop', function(e) {
                e.preventDefault();
                fileDropZone.classList.remove('dragover');
                const file = e.dataTransfer.files[0];
                if (file) {
                    handleFileSelect(file);
                }
            });

            // 移除文件
            fileRemoveBtn.addEventListener('click', function() {
                selectedFile = null;
                fileInput.value = '';
                fileInfo.style.display = 'none';
                fileDropZone.style.display = 'block';
            });
        }

        // 处理文件选择
        function handleFileSelect(file) {
            // 验证文件类型
            if (!file.type.includes('text/') && !file.name.toLowerCase().endsWith('.txt')) {
                alert('请选择txt格式的文本文件');
                return;
            }

            // 验证文件大小
            if (file.size > 500 * 1024) {
                alert('文件大小不能超过500KB');
                return;
            }

            selectedFile = file;
            
            // 显示文件信息
            document.getElementById('fileName').textContent = file.name;
            document.getElementById('fileSize').textContent = formatFileSize(file.size);
            document.getElementById('fileInfo').style.display = 'flex';
            document.getElementById('fileDropZone').style.display = 'none';
        }

        // 格式化文件大小
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        // 表单提交处理
        document.getElementById('ttsForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const voice = document.getElementById('voice').value;
            const speed = document.getElementById('speed').value;
            const pitch = document.getElementById('pitch').value;
            const style = document.getElementById('style').value;
            const responseFormat = document.getElementById('responseFormat').value;
            
            const generateBtn = document.getElementById('generateBtn');
            const resultContainer = document.getElementById('result');
            const loading = document.getElementById('loading');
            const success = document.getElementById('success');
            const error = document.getElementById('error');
            
            // 验证输入
            if (currentInputMethod === 'text') {
                const text = document.getElementById('text').value;
                if (!text.trim()) {
                    alert('请输入要转换的文本内容');
                    return;
                }
            } else if (currentInputMethod === 'file') {
                if (!selectedFile) {
                    alert('请选择要上传的txt文件');
                    return;
                }
            }
            
            // 重置状态
            resultContainer.style.display = 'block';
            loading.style.display = 'block';
            success.style.display = 'none';
            error.style.display = 'none';
            generateBtn.disabled = true;
            generateBtn.textContent = '生成中...';
            
            try {
                let response;
                let textLength = 0;
                
                // 更新加载提示
                const loadingText = document.getElementById('loadingText');
                const progressInfo = document.getElementById('progressInfo');
                
                if (currentInputMethod === 'text') {
                    // 手动输入文本
                    const text = document.getElementById('text').value;
                    textLength = text.length;
                    
                    // 根据文本长度显示不同的提示
                    if (textLength > 3000) {
                        loadingText.textContent = '正在处理长文本，请耐心等待...';
                        progressInfo.textContent = '文本长度: ' + textLength + ' 字符，预计需要 ' + (Math.ceil(textLength / 1500) * 2) + ' 秒';
                    } else {
                        loadingText.textContent = '正在生成语音，请稍候...';
                        progressInfo.textContent = '文本长度: ' + textLength + ' 字符';
                    }
                    
                    response = await fetch('/v1/audio/speech', {
                        method: 'POST',
                        headers: apiHeaders({
                            'Content-Type': 'application/json',
                        }),
                        body: JSON.stringify({
                            input: text,
                            voice: voice,
                            speed: parseFloat(speed),
                            pitch: pitch,
                            style: style,
                            response_format: responseFormat
                        })
                    });
                } else {
                    // 文件上传
                    loadingText.textContent = '正在处理上传的文件...';
                    progressInfo.textContent = '文件: ' + selectedFile.name + ' (' + formatFileSize(selectedFile.size) + ')';
                    
                    const formData = new FormData();
                    formData.append('file', selectedFile);
                    formData.append('voice', voice);
                    formData.append('speed', speed);
                    formData.append('pitch', pitch);
                    formData.append('style', style);
                    formData.append('response_format', responseFormat);
                    
                    response = await fetch('/v1/audio/speech', {
                        method: 'POST',
                        headers: apiHeaders(),
                        body: formData
                    });
                }
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || '生成失败');
                }
                
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                
                // 显示音频播放器
                const audioPlayer = document.getElementById('audioPlayer');
                const downloadBtn = document.getElementById('downloadBtn');
                
                audioPlayer.src = audioUrl;
                downloadBtn.href = audioUrl;
                
                loading.style.display = 'none';
                success.style.display = 'block';
                
            } catch (err) {
                loading.style.display = 'none';
                error.style.display = 'block';
                
                // 根据错误类型显示不同的提示
                if (err.message.includes('Too many subrequests')) {
                    error.textContent = '错误: 文本过长导致请求过多，请缩短文本内容或分段处理';
                } else if (err.message.includes('频率限制') || err.message.includes('429')) {
                    error.textContent = '错误: 请求过于频繁，请稍后再试';
                } else if (err.message.includes('分块数量') && err.message.includes('超过限制')) {
                    error.textContent = '错误: ' + err.message;
                } else {
                    error.textContent = '错误: ' + err.message;
                }
            } finally {
                generateBtn.disabled = false;
                generateBtn.innerHTML = '<span>🎙️</span><span>开始生成语音</span>';
            }
        });

        // 初始化模式切换器
        function initializeModeSwitcher() {
            const ttsMode = document.getElementById('ttsMode');
            const transcriptionMode = document.getElementById('transcriptionMode');
            const remoteMode = document.getElementById('remoteMode');
            const mainContent = document.querySelector('.main-content');
            const transcriptionContainer = document.getElementById('transcriptionContainer');

            ttsMode.addEventListener('click', function() {
                switchMode('tts');
            });

            transcriptionMode.addEventListener('click', function() {
                switchMode('transcription');
            });
            remoteMode.addEventListener('click', function() { switchMode('remote'); });
        }

        function initializeRemotePanel() {
            const settings = document.getElementById('openTtsSettings');
            document.getElementById('remoteFormContainer').appendChild(settings);
        }

        // 切换功能模式
        function switchMode(mode) {
            const ttsMode = document.getElementById('ttsMode');
            const transcriptionMode = document.getElementById('transcriptionMode');
            const remoteMode = document.getElementById('remoteMode');
            const mainContent = document.querySelector('.main-content');
            const transcriptionContainer = document.getElementById('transcriptionContainer');
            const remoteContainer = document.getElementById('remoteContainer');

            currentMode = mode;

            if (mode === 'tts') {
                // 切换到TTS模式
                ttsMode.classList.add('active');
                transcriptionMode.classList.remove('active');
                remoteMode.classList.remove('active');
                mainContent.style.display = 'block';
                transcriptionContainer.style.display = 'none';
                remoteContainer.style.display = 'none';
            } else if (mode === 'transcription') {
                // 切换到语音转录模式
                transcriptionMode.classList.add('active');
                ttsMode.classList.remove('active');
                remoteMode.classList.remove('active');
                mainContent.style.display = 'none';
                transcriptionContainer.style.display = 'block';
                remoteContainer.style.display = 'none';
            } else {
                remoteMode.classList.add('active');
                ttsMode.classList.remove('active');
                transcriptionMode.classList.remove('active');
                mainContent.style.display = 'none';
                transcriptionContainer.style.display = 'none';
                remoteContainer.style.display = 'block';
            }

        }

        // 初始化音频上传功能
        function initializeAudioUpload() {
            const audioDropZone = document.getElementById('audioDropZone');
            const audioFileInput = document.getElementById('audioFileInput');
            const audioFileInfo = document.getElementById('audioFileInfo');
            const audioFileRemoveBtn = document.getElementById('audioFileRemoveBtn');

            // 点击上传区域
            audioDropZone.addEventListener('click', function() {
                audioFileInput.click();
            });

            // 文件选择
            audioFileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    handleAudioFileSelect(file);
                }
            });

            // 拖拽功能
            audioDropZone.addEventListener('dragover', function(e) {
                e.preventDefault();
                audioDropZone.classList.add('dragover');
            });

            audioDropZone.addEventListener('dragleave', function(e) {
                e.preventDefault();
                audioDropZone.classList.remove('dragover');
            });

            audioDropZone.addEventListener('drop', function(e) {
                e.preventDefault();
                audioDropZone.classList.remove('dragover');
                const file = e.dataTransfer.files[0];
                if (file) {
                    handleAudioFileSelect(file);
                }
            });

            // 移除文件
            audioFileRemoveBtn.addEventListener('click', function() {
                selectedAudioFile = null;
                audioFileInput.value = '';
                audioFileInfo.style.display = 'none';
                audioDropZone.style.display = 'block';
            });
        }

        // 处理音频文件选择
        function handleAudioFileSelect(file) {
            // 验证文件类型
            const allowedTypes = [
                'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/flac', 'audio/aac',
                'audio/ogg', 'audio/webm', 'audio/amr', 'audio/3gpp'
            ];
            
            const isValidType = allowedTypes.some(type => 
                file.type.includes(type) || 
                file.name.toLowerCase().match(/\.(mp3|wav|m4a|flac|aac|ogg|webm|amr|3gp)$/i)
            );

            if (!isValidType) {
                alert('请选择音频格式的文件（mp3、wav、m4a、flac、aac、ogg、webm、amr、3gp）');
                return;
            }

            // 验证文件大小（限制为10MB）
            if (file.size > 10 * 1024 * 1024) {
                alert('音频文件大小不能超过10MB');
                return;
            }

            selectedAudioFile = file;
            
            // 显示文件信息
            document.getElementById('audioFileName').textContent = file.name;
            document.getElementById('audioFileSize').textContent = formatFileSize(file.size);
            document.getElementById('audioFileInfo').style.display = 'flex';
            document.getElementById('audioDropZone').style.display = 'none';
        }

        // 初始化Token配置
        function initializeTokenConfig() {
            document.getElementById('sttProvider').addEventListener('change', function() {
                document.querySelectorAll('.stt-custom-field').forEach(el => el.style.display = this.value === 'openai-compatible' ? 'block' : 'none');
                document.getElementById('sttModel').value = this.value === 'siliconflow' ? 'FunAudioLLM/SenseVoiceSmall' : 'whisper-1';
            });
        }

        function initializeVoicePreview() {
            document.getElementById('previewVoiceBtn').addEventListener('click', async function() {
                const button = this;
                const status = document.getElementById('previewStatus');
                button.disabled = true;
                status.textContent = '正在生成试听…';
                try {
                    const response = await fetch('/v1/audio/speech', { method: 'POST', headers: apiHeaders({'Content-Type': 'application/json'}), body: JSON.stringify({ input: '你好，这是当前音色的试听示例。', voice: document.getElementById('voice').value, speed: parseFloat(document.getElementById('speed').value), pitch: document.getElementById('pitch').value, style: document.getElementById('style').value, response_format: document.getElementById('responseFormat').value }) });
                    if (!response.ok) throw new Error((await response.json()).error?.message || '试听失败');
                    const audio = new Audio(URL.createObjectURL(await response.blob()));
                    audio.play();
                    status.textContent = '正在播放试听';
                    audio.onended = () => { status.textContent = '试听完成'; URL.revokeObjectURL(audio.src); };
                } catch (error) { status.textContent = '试听失败：' + error.message; }
                finally { button.disabled = false; }
            });
        }

        // 处理语音转录表单提交
        document.getElementById('transcriptionForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const transcribeBtn = document.getElementById('transcribeBtn');
            const transcriptionResult = document.getElementById('transcriptionResult');
            const transcriptionLoading = document.getElementById('transcriptionLoading');
            const transcriptionSuccess = document.getElementById('transcriptionSuccess');
            const transcriptionError = document.getElementById('transcriptionError');
            
            // 验证音频文件
            if (!selectedAudioFile) {
                alert('请选择要转录的音频文件');
                return;
            }
            
            const customToken = document.getElementById('tokenInput').value;
            const provider = document.getElementById('sttProvider').value;
            const model = document.getElementById('sttModel').value.trim();
            const baseUrl = document.getElementById('sttBaseUrl').value.trim();
            if (!model || (provider === 'openai-compatible' && (!baseUrl || !customToken))) {
                alert('请填写模型；使用兼容服务时还需要 Base URL 和该服务自己的 API Key');
                return;
            }
            
            // 重置状态
            transcriptionResult.style.display = 'block';
            transcriptionLoading.style.display = 'block';
            transcriptionSuccess.style.display = 'none';
            transcriptionError.style.display = 'none';
            transcribeBtn.disabled = true;
            transcribeBtn.textContent = '转录中...';
            
            // 更新加载提示
            const loadingText = document.getElementById('transcriptionLoadingText');
            const progressInfo = document.getElementById('transcriptionProgressInfo');
            loadingText.textContent = '正在转录音频，请稍候...';
            progressInfo.textContent = '文件: ' + selectedAudioFile.name + ' (' + formatFileSize(selectedAudioFile.size) + ')';
            
            try {
                // 构建FormData
                const formData = new FormData();
                formData.append('file', selectedAudioFile);
                
                formData.append('provider', provider);
                formData.append('model', model);
                if (customToken) formData.append('token', customToken);
                if (baseUrl) formData.append('base_url', baseUrl);
                
                const response = await fetch('/v1/audio/transcriptions', {
                    method: 'POST',
                    headers: apiHeaders(),
                    body: formData
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || '转录失败');
                }
                
                const result = await response.json();
                
                // 显示转录结果
                document.getElementById('transcriptionText').value = result.text || '';
                transcriptionLoading.style.display = 'none';
                transcriptionSuccess.style.display = 'block';
                
            } catch (err) {
                transcriptionLoading.style.display = 'none';
                transcriptionError.style.display = 'block';
                transcriptionError.textContent = '错误: ' + err.message;
            } finally {
                transcribeBtn.disabled = false;
                transcribeBtn.innerHTML = '<span>🎧</span><span>开始语音转录</span>';
            }
        });

        // 复制转录结果
        document.getElementById('copyTranscriptionBtn').addEventListener('click', function() {
            const transcriptionText = document.getElementById('transcriptionText');
            transcriptionText.select();
            document.execCommand('copy');
            
            // 临时改变按钮文本
            const originalText = this.innerHTML;
            this.innerHTML = '<span>✅</span><span>已复制</span>';
            setTimeout(() => {
                this.innerHTML = originalText;
            }, 2000);
        });

        // 编辑转录结果
        document.getElementById('editTranscriptionBtn').addEventListener('click', function() {
            const transcriptionText = document.getElementById('transcriptionText');
            const isReadonly = transcriptionText.readOnly;
            
            if (isReadonly) {
                transcriptionText.readOnly = false;
                transcriptionText.focus();
                this.innerHTML = '<span>💾</span><span>保存编辑</span>';
            } else {
                transcriptionText.readOnly = true;
                this.innerHTML = '<span>✏️</span><span>编辑文本</span>';
            }
        });

        // 转为语音功能
        document.getElementById('useForTtsBtn').addEventListener('click', function() {
            const transcriptionText = document.getElementById('transcriptionText').value;
            
            if (!transcriptionText.trim()) {
                alert('转录结果为空，无法转换为语音');
                return;
            }
            
            // 切换到TTS模式
            switchMode('tts');
            
            // 将转录文本填入TTS文本框
            document.getElementById('text').value = transcriptionText;
            
            // 滚动到TTS区域
            document.querySelector('.main-content').scrollIntoView({ behavior: 'smooth' });
        });

        // 初始化国际化
        function initializeI18n() {
            document.documentElement.lang = 'zh-CN';
            document.title = 'CF-voice · 中文语音工具';
        }

    </script>
</body>
</html>
`;

const LOGIN_PAGE = `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>CF-voice · 访问验证</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f8fafc;color:#0f172a;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.card{width:min(360px,calc(100% - 40px));box-sizing:border-box;background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:30px;box-shadow:0 10px 15px -3px rgb(0 0 0/.1)}h1{margin:0 0 8px;font-size:1.45rem;color:#2563eb}p{margin:0 0 22px;color:#475569;font-size:.9rem}input,button{width:100%;box-sizing:border-box;border-radius:8px;font-size:16px}input{padding:12px;border:1px solid #cbd5e1;margin-bottom:12px}button{padding:12px;border:0;background:#2563eb;color:#fff;font-weight:700;cursor:pointer}button:disabled{opacity:.65}.error{min-height:20px;margin-top:10px;color:#dc2626;font-size:.85rem}</style></head>
<body><main class="card"><h1>CF-voice</h1><p>请输入访问密码以使用网页界面。</p><form id="login"><input id="password" type="password" autocomplete="current-password" placeholder="访问密码" required autofocus><button>进入</button><div class="error" id="error"></div></form></main>
<script>document.getElementById('login').addEventListener('submit',async e=>{e.preventDefault();const b=e.target.querySelector('button'),err=document.getElementById('error');b.disabled=true;err.textContent='';try{const r=await fetch('/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:document.getElementById('password').value})});if(!r.ok)throw new Error('密码不正确');location.replace('/')}catch(x){err.textContent=x.message}finally{b.disabled=false}})</script></body></html>`;

export default {
    async fetch(request, env, ctx) {
        return handleRequest(request, env);
    }
};

async function handleRequest(request, env = {}) {
    if (request.method === "OPTIONS") {
        return handleOptions(request);
    }




    const requestUrl = new URL(request.url);
    const path = requestUrl.pathname;

    // 网页访问控制只作用于页面入口；/v1/* 始终保持可供程序调用。
    if (path === '/auth/login') {
        return handleLogin(request, env);
    }

    if (path.startsWith('/v1/') && !hasValidApiKey(request, env)) {
        return jsonError('API Key 无效或未提供', null, 'invalid_api_key', 401);
    }

    // 返回前端页面
    if (path === "/" || path === "/index.html") {
        if (env.ACCESS_PASSWORD && !(await hasValidPageSession(request, env))) {
            return new Response(LOGIN_PAGE, { status: 401, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
        }
        return new Response(HTML_PAGE, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                ...makeCORSHeaders()
            }
        });
    }

    if (path === "/v1/audio/transcriptions") {
        try {
            return await handleAudioTranscription(request, env);
        } catch (error) {
            console.error("Audio transcription error:", error);
            return new Response(JSON.stringify({
                error: {
                    message: error.message,
                    type: "api_error",
                    param: null,
                    code: "transcription_error"
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

    if (path === "/v1/audio/speech") {
        try {
            const contentType = request.headers.get("content-type") || "";
            
            // 处理文件上传
            if (contentType.includes("multipart/form-data")) {
                return await handleFileUpload(request);
            }
            
            // 处理JSON请求（原有功能）
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
            const response = await getVoice(
                input,
                voiceName,
                rate >= 0 ? `+${rate}%` : `${rate}%`,
                numPitch >= 0 ? `+${numPitch}Hz` : `${numPitch}Hz`,
                numVolume >= 0 ? `+${numVolume}%` : `${numVolume}%`,
                style,
                outputFormat
            );

            return response;

        } catch (error) {
            console.error("Error:", error);
            return new Response(JSON.stringify({
                error: {
                    message: error.message,
                    type: "api_error",
                    param: null,
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

    // 默认返回 404
    return new Response("Not Found", { status: 404 });
}

async function handleOptions(request) {
    return new Response(null, {
        status: 204,
        headers: {
            ...makeCORSHeaders(),
            "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
            "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers") || "Authorization"
        }
    });
}

async function handleLogin(request, env) {
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

async function createPageSession(env) {
    const signature = await hmacSha256(new TextEncoder().encode(env.ACCESS_PASSWORD), 'voicecraft-page-access-v1');
    return await bytesToBase64(signature);
}

async function hasValidPageSession(request, env) {
    const cookie = request.headers.get('Cookie') || '';
    const matched = cookie.match(new RegExp(`(?:^|;\\s*)${AUTH_COOKIE_NAME}=([^;]+)`));
    return !!matched && matched[1] === await createPageSession(env);
}

function hasValidApiKey(request, env) {
    if (!env.API_ACCESS_KEY) return true;
    const bearer = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
    const apiKey = request.headers.get('x-api-key') || bearer;
    return apiKey === env.API_ACCESS_KEY;
}

function jsonError(message, param, code, status = 400) {
    return new Response(JSON.stringify({ error: { message, type: 'invalid_request_error', param, code } }), { status, headers: { 'Content-Type': 'application/json', ...makeCORSHeaders() } });
}

function normalizeOpenAiVoice(voice) {
    const aliases = { alloy: 'en-US-GuyNeural', echo: 'en-US-AndrewNeural', fable: 'en-GB-RyanNeural', onyx: 'en-US-DavisNeural', nova: 'en-US-AriaNeural', shimmer: 'en-US-JennyNeural' };
    return aliases[String(voice).toLowerCase()] || voice;
}

function outputFormatFor(responseFormat) {
    return { mp3: 'audio-24khz-48kbitrate-mono-mp3', wav: 'riff-24khz-16bit-mono-pcm', pcm: 'raw-24khz-16bit-mono-pcm', opus: 'ogg-24khz-16bit-mono-opus' }[responseFormat] || 'audio-24khz-48kbitrate-mono-mp3';
}

function contentTypeFor(outputFormat) {
    if (outputFormat.startsWith('riff-')) return 'audio/wav';
    if (outputFormat.startsWith('raw-')) return 'audio/pcm';
    if (outputFormat.startsWith('ogg-')) return 'audio/ogg';
    return 'audio/mpeg';
}

// 添加延迟函数
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 优化文本分块函数
function optimizedTextSplit(text, maxChunkSize = 1500) {
    const chunks = [];
    const sentences = text.split(/[。！？\n]/);
    let currentChunk = '';
    
    for (const sentence of sentences) {
        const trimmedSentence = sentence.trim();
        if (!trimmedSentence) continue;
        
        // 如果单个句子就超过最大长度，按字符分割
        if (trimmedSentence.length > maxChunkSize) {
            if (currentChunk) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
            }
            
            // 按字符分割长句子
            for (let i = 0; i < trimmedSentence.length; i += maxChunkSize) {
                chunks.push(trimmedSentence.slice(i, i + maxChunkSize));
            }
        } else if ((currentChunk + trimmedSentence).length > maxChunkSize) {
            // 当前块加上新句子会超过限制，先保存当前块
            if (currentChunk) {
                chunks.push(currentChunk.trim());
            }
            currentChunk = trimmedSentence;
        } else {
            // 添加到当前块
            currentChunk += (currentChunk ? '。' : '') + trimmedSentence;
        }
    }
    
    // 添加最后一个块
    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }
    
    return chunks.filter(chunk => chunk.length > 0);
}

// 批量处理音频块
async function processBatchedAudioChunks(chunks, voiceName, rate, pitch, volume, style, outputFormat, batchSize = 3, delayMs = 1000) {
    const audioChunks = [];
    
    for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const batchPromises = batch.map(async (chunk, index) => {
            try {
                // 为每个请求添加小延迟，避免同时发送
                if (index > 0) {
                    await delay(index * 200);
                }
                return await getAudioChunk(chunk, voiceName, rate, pitch, volume, style, outputFormat);
            } catch (error) {
                console.error(`处理音频块失败 (批次 ${Math.floor(i/batchSize) + 1}, 块 ${index + 1}):`, error);
                throw error;
            }
        });
        
        try {
            const batchResults = await Promise.all(batchPromises);
            audioChunks.push(...batchResults);
            
            // 批次间延迟
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

async function getVoice(text, voiceName = "zh-CN-XiaoxiaoNeural", rate = '+0%', pitch = '+0Hz', volume = '+0%', style = "general", outputFormat = "audio-24khz-48kbitrate-mono-mp3") {
    try {
        // 文本预处理
        const cleanText = text.trim();
        if (!cleanText) {
            throw new Error("文本内容为空");
        }
        if (cleanText.length > 1500 && outputFormat !== 'audio-24khz-48kbitrate-mono-mp3') {
            throw new Error('长文本合成当前仅支持 MP3 输出；WAV、Opus 和 PCM 请分段生成');
        }
        
        // 如果文本很短，直接处理
        if (cleanText.length <= 1500) {
            const audioBlob = await getAudioChunk(cleanText, voiceName, rate, pitch, volume, style, outputFormat);
            return new Response(audioBlob, {
                headers: {
                    "Content-Type": contentTypeFor(outputFormat),
                    ...makeCORSHeaders()
                }
            });
        }

        // 优化的文本分块
        const chunks = optimizedTextSplit(cleanText, 1500);
        
        // 检查分块数量，防止超过CloudFlare限制
        if (chunks.length > 40) {
            throw new Error(`文本过长，分块数量(${chunks.length})超过限制。请缩短文本或分批处理。`);
        }
        
        console.log(`文本已分为 ${chunks.length} 个块进行处理`);

        // 批量处理音频块，控制并发数量和频率
        const audioChunks = await processBatchedAudioChunks(
            chunks, 
            voiceName, 
            rate, 
            pitch, 
            volume, 
            style, 
            outputFormat,
            3,  // 每批处理3个
            800 // 批次间延迟800ms
        );

        // 将音频片段拼接起来
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



//获取单个音频数据（增强错误处理和重试机制）
async function getAudioChunk(text, voiceName, rate, pitch, volume, style, outputFormat = 'audio-24khz-48kbitrate-mono-mp3', maxRetries = 3) {
    const retryDelay = 500; // 重试延迟500ms
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const endpoint = await getEndpoint();
            const url = `https://${endpoint.r}.tts.speech.microsoft.com/cognitiveservices/v1`;
            
            // 处理文本中的延迟标记
            let m = text.match(/\[(\d+)\]\s*?$/);
            let slien = 0;
            if (m && m.length == 2) {
                slien = parseInt(m[1]);
                text = text.replace(m[0], '');
            }
            
            // 验证文本长度
            if (!text.trim()) {
                throw new Error("文本块为空");
            }
            
            if (text.length > 2000) {
                throw new Error(`文本块过长: ${text.length} 字符，最大支持2000字符`);
            }
            
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
                
                // 根据错误类型决定是否重试
                if (response.status === 429) {
                    // 频率限制，需要重试
                    if (attempt < maxRetries) {
                        console.log(`频率限制，第${attempt + 1}次重试，等待${retryDelay * (attempt + 1)}ms`);
                        await delay(retryDelay * (attempt + 1));
                        continue;
                    }
                    throw new Error(`请求频率过高，已重试${maxRetries}次仍失败`);
                } else if (response.status >= 500) {
                    // 服务器错误，可以重试
                    if (attempt < maxRetries) {
                        console.log(`服务器错误，第${attempt + 1}次重试，等待${retryDelay * (attempt + 1)}ms`);
                        await delay(retryDelay * (attempt + 1));
                        continue;
                    }
                    throw new Error(`Edge TTS服务器错误: ${response.status} ${errorText}`);
                } else {
                    // 客户端错误，不重试
                    throw new Error(`Edge TTS API错误: ${response.status} ${errorText}`);
                }
            }

            return await response.blob();
            
        } catch (error) {
            if (attempt === maxRetries) {
                // 最后一次重试失败
                throw new Error(`音频生成失败（已重试${maxRetries}次）: ${error.message}`);
            }
            
            // 如果是网络错误或其他可重试错误
            if (error.message.includes('fetch') || error.message.includes('network')) {
                console.log(`网络错误，第${attempt + 1}次重试，等待${retryDelay * (attempt + 1)}ms`);
                await delay(retryDelay * (attempt + 1));
                continue;
            }
            
            // 其他错误直接抛出
            throw error;
        }
    }
}

// XML文本转义函数
function escapeXmlText(text) {
    return text
        .replace(/&/g, '&amp;')   // 必须首先处理 &
        .replace(/</g, '&lt;')    // 处理 <
        .replace(/>/g, '&gt;')    // 处理 >
        .replace(/"/g, '&quot;')  // 处理 "
        .replace(/'/g, '&apos;'); // 处理 '
}

function getSsml(text, voiceName, rate, pitch, volume, style, slien = 0) {
    // 对文本进行XML转义
    const escapedText = escapeXmlText(text);
    
    let slien_str = '';
    if (slien > 0) {
        slien_str = `<break time="${slien}ms" />`
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

    // 获取新token
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

        if (!response.ok) {
            throw new Error(`获取endpoint失败: ${response.status}`);
        }

        const data = await response.json();
        const jwt = data.t.split(".")[1];
        const decodedJwt = JSON.parse(atob(jwt));

        tokenInfo = {
            endpoint: data,
            token: data.t,
            expiredAt: decodedJwt.exp
        };

        return data;

    } catch (error) {
        console.error("获取endpoint失败:", error);
        // 如果有缓存的token，即使过期也尝试使用
        if (tokenInfo.token) {
            console.log("使用过期的缓存token");
            return tokenInfo.endpoint;
        }
        throw error;
    }
}



function makeCORSHeaders() {
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-api-key",
        "Access-Control-Max-Age": "86400"
    };
}

async function hmacSha256(key, data) {
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        key,
        { name: "HMAC", hash: { name: "SHA-256" } },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data));
    return new Uint8Array(signature);
}

async function base64ToBytes(base64) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function bytesToBase64(bytes) {
    return btoa(String.fromCharCode.apply(null, bytes));
}

function uuid() {
    return crypto.randomUUID().replace(/-/g, "");
}

async function sign(urlStr) {
    const url = urlStr.split("://")[1];
    const encodedUrl = encodeURIComponent(url);
    const uuidStr = uuid();
    const formattedDate = dateFormat();
    const bytesToSign = `MSTranslatorAndroidApp${encodedUrl}${formattedDate}${uuidStr}`.toLowerCase();
    const decode = await base64ToBytes("oik6PdDdMnOXemTbwvMn9de/h9lFnfBaCWbGMMZqqoSaQaqUOqjVGm5NqsmjcBI1x+sS9ugjB55HEJWRiFXYFw==");
    const signData = await hmacSha256(decode, bytesToSign);
    const signBase64 = await bytesToBase64(signData);
    return `MSTranslatorAndroidApp::${signBase64}::${formattedDate}::${uuidStr}`;
}

function dateFormat() {
    const formattedDate = (new Date()).toUTCString().replace(/GMT/, "").trim() + " GMT";
    return formattedDate.toLowerCase();
}

// 处理文件上传的函数
async function handleFileUpload(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const voice = formData.get('voice') || 'zh-CN-XiaoxiaoNeural';
        const speed = formData.get('speed') || '1.0';
        const volume = formData.get('volume') || '0';
        const pitch = formData.get('pitch') || '0';
        const style = formData.get('style') || 'general';
        const responseFormat = formData.get('response_format') || 'mp3';

        // 验证文件
        if (!file) {
            return new Response(JSON.stringify({
                error: {
                    message: "未找到上传的文件",
                    type: "invalid_request_error",
                    param: "file",
                    code: "missing_file"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 验证文件类型
        if (!file.type.includes('text/') && !file.name.toLowerCase().endsWith('.txt')) {
            return new Response(JSON.stringify({
                error: {
                    message: "不支持的文件类型，请上传txt文件",
                    type: "invalid_request_error",
                    param: "file",
                    code: "invalid_file_type"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 验证文件大小（限制为500KB）
        if (file.size > 500 * 1024) {
            return new Response(JSON.stringify({
                error: {
                    message: "文件大小超过限制（最大500KB）",
                    type: "invalid_request_error",
                    param: "file",
                    code: "file_too_large"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 读取文件内容
        const text = await file.text();
        
        // 验证文本内容
        if (!text.trim()) {
            return new Response(JSON.stringify({
                error: {
                    message: "文件内容为空",
                    type: "invalid_request_error",
                    param: "file",
                    code: "empty_file"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 文本长度限制（10000字符）
        if (text.length > 10000) {
            return new Response(JSON.stringify({
                error: {
                    message: "文本内容过长（最大10000字符）",
                    type: "invalid_request_error",
                    param: "file",
                    code: "text_too_long"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 处理参数格式，与原有逻辑保持一致
        let rate = parseInt(String((parseFloat(speed) - 1.0) * 100));
        let numVolume = parseInt(String(parseFloat(volume) * 100));
        let numPitch = parseInt(pitch);

        // 调用TTS服务
        return await getVoice(
            text,
            voice,
            rate >= 0 ? `+${rate}%` : `${rate}%`,
            numPitch >= 0 ? `+${numPitch}Hz` : `${numPitch}Hz`,
            numVolume >= 0 ? `+${numVolume}%` : `${numVolume}%`,
            style,
            responseFormat === 'wav' ? 'riff-24khz-16bit-mono-pcm' : 'audio-24khz-48kbitrate-mono-mp3'
        );

    } catch (error) {
        console.error("文件上传处理失败:", error);
        return new Response(JSON.stringify({
            error: {
                message: "文件处理失败",
                type: "api_error",
                param: null,
                code: "file_processing_error"
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

// 处理语音转录的函数
async function handleAudioTranscription(request, env = {}) {
    try {
        // 验证请求方法
        if (request.method !== 'POST') {
            return new Response(JSON.stringify({
                error: {
                    message: "只支持POST方法",
                    type: "invalid_request_error",
                    param: "method",
                    code: "method_not_allowed"
                }
            }), {
                status: 405,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        const contentType = request.headers.get("content-type") || "";
        
        // 验证Content-Type
        if (!contentType.includes("multipart/form-data")) {
            return new Response(JSON.stringify({
                error: {
                    message: "请求必须使用multipart/form-data格式",
                    type: "invalid_request_error",
                    param: "content-type",
                    code: "invalid_content_type"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 解析FormData
        const formData = await request.formData();
        const audioFile = formData.get('file');
        const customToken = formData.get('token');
        const provider = formData.get('provider') || 'siliconflow';
        const model = formData.get('model') || (provider === 'siliconflow' ? 'FunAudioLLM/SenseVoiceSmall' : 'whisper-1');
        const baseUrl = formData.get('base_url');
        const language = formData.get('language');
        const prompt = formData.get('prompt');
        const responseFormat = formData.get('response_format');

        // 验证音频文件
        if (!audioFile) {
            return new Response(JSON.stringify({
                error: {
                    message: "未找到音频文件",
                    type: "invalid_request_error",
                    param: "file",
                    code: "missing_file"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 验证文件大小（限制为10MB）
        if (audioFile.size > 10 * 1024 * 1024) {
            return new Response(JSON.stringify({
                error: {
                    message: "音频文件大小不能超过10MB",
                    type: "invalid_request_error",
                    param: "file",
                    code: "file_too_large"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 验证音频文件格式
        const allowedTypes = [
            'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/flac', 'audio/aac',
            'audio/ogg', 'audio/webm', 'audio/amr', 'audio/3gpp'
        ];
        
        const isValidType = allowedTypes.some(type => 
            audioFile.type.includes(type) || 
            audioFile.name.toLowerCase().match(/\.(mp3|wav|m4a|flac|aac|ogg|webm|amr|3gp)$/i)
        );

        if (!isValidType) {
            return new Response(JSON.stringify({
                error: {
                    message: "不支持的音频文件格式，请上传mp3、wav、m4a、flac、aac、ogg、webm、amr或3gp格式的文件",
                    type: "invalid_request_error",
                    param: "file",
                    code: "invalid_file_type"
                }
            }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        if (!['siliconflow', 'openai-compatible'].includes(provider)) {
            return jsonError('provider 必须为 siliconflow 或 openai-compatible', 'provider', 'invalid_provider');
        }
        if (provider === 'openai-compatible' && (!baseUrl || !/^https:\/\//i.test(baseUrl))) {
            return jsonError('兼容服务需要有效的 HTTPS base_url', 'base_url', 'invalid_base_url');
        }
        // 默认密钥仅能用于固定的硅基流动端点，绝不能转发至调用方指定的地址。
        if (provider === 'openai-compatible' && !customToken) {
            return jsonError('使用兼容服务时必须提供该服务自己的 API Key', 'token', 'missing_api_key', 401);
        }
        const token = provider === 'siliconflow' ? (customToken || env.STT_API_KEY) : customToken;
        if (!token) return jsonError('请提供 API Key，或由部署者配置 STT_API_KEY', 'token', 'missing_api_key', 401);

        // 构建发送到硅基流动API的FormData
        const apiFormData = new FormData();
        apiFormData.append('file', audioFile);
        apiFormData.append('model', model);
        if (language) apiFormData.append('language', language);
        if (prompt) apiFormData.append('prompt', prompt);
        if (responseFormat) apiFormData.append('response_format', responseFormat);

        // 发送请求到硅基流动API
        const endpoint = provider === 'siliconflow'
            ? 'https://api.siliconflow.cn/v1/audio/transcriptions'
            : baseUrl.replace(/\/$/, '') + '/audio/transcriptions';
        const apiResponse = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: apiFormData
        });

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error('硅基流动API错误:', apiResponse.status, errorText);
            
            let errorMessage = '语音转录服务暂时不可用';
            
            if (apiResponse.status === 401) {
                errorMessage = 'API Token无效，请检查您的配置';
            } else if (apiResponse.status === 429) {
                errorMessage = '请求过于频繁，请稍后再试';
            } else if (apiResponse.status === 413) {
                errorMessage = '音频文件太大，请选择较小的文件';
            }

            return new Response(JSON.stringify({
                error: {
                    message: errorMessage,
                    type: "api_error",
                    param: null,
                    code: "transcription_api_error"
                }
            }), {
                status: apiResponse.status,
                headers: {
                    "Content-Type": "application/json",
                    ...makeCORSHeaders()
                }
            });
        }

        // 获取转录结果
        const transcriptionResult = await apiResponse.json();

        // 返回转录结果
        return new Response(JSON.stringify(transcriptionResult), {
            headers: {
                "Content-Type": "application/json",
                ...makeCORSHeaders()
            }
        });

    } catch (error) {
        console.error("语音转录处理失败:", error);
        return new Response(JSON.stringify({
            error: {
                message: "语音转录处理失败",
                type: "api_error",
                param: null,
                code: "transcription_processing_error"
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

