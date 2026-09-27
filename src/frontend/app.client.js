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
            initializeAudioUpload();
            initializeTokenConfig();
            initializeVoicePreview();
            initializeVoiceCopy();
            initializeSecurityBanner();
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
                
                const audioPlayer = document.getElementById('audioPlayer');
                const downloadBtn = document.getElementById('downloadBtn');
                
                let contentType = response.headers.get('Content-Type') || 'audio/mpeg';
                let isFallback = true;
                if (window.MediaSource && MediaSource.isTypeSupported(contentType)) {
                    isFallback = false;
                }
                
                if (isFallback) {
                    const audioBlob = await response.blob();
                    const audioUrl = URL.createObjectURL(audioBlob);
                    audioPlayer.src = audioUrl;
                    downloadBtn.href = audioUrl;
                    
                    loading.style.display = 'none';
                    success.style.display = 'block';
                } else {
                    loading.style.display = 'none';
                    success.style.display = 'block';
                    
                    const mediaSource = new MediaSource();
                    const audioUrl = URL.createObjectURL(mediaSource);
                    audioPlayer.src = audioUrl;
                    
                    const reader = response.body.getReader();
                    const downloadedChunks = [];
                    
                    mediaSource.addEventListener('sourceopen', async () => {
                        const sourceBuffer = mediaSource.addSourceBuffer(contentType);
                        let isAppending = false;
                        let appendQueue = [];
                        
                        sourceBuffer.addEventListener('updateend', () => {
                            isAppending = false;
                            processAppendQueue();
                        });
                        
                        function processAppendQueue() {
                            if (!isAppending && appendQueue.length > 0 && !sourceBuffer.updating) {
                                isAppending = true;
                                sourceBuffer.appendBuffer(appendQueue.shift());
                            }
                        }
                        
                        try {
                            while (true) {
                                const { done, value } = await reader.read();
                                if (done) {
                                    const checkEnd = setInterval(() => {
                                        if (!sourceBuffer.updating && appendQueue.length === 0) {
                                            if (mediaSource.readyState === 'open') {
                                                mediaSource.endOfStream();
                                            }
                                            clearInterval(checkEnd);
                                        }
                                    }, 50);
                                    
                                    const finalBlob = new Blob(downloadedChunks, { type: contentType });
                                    downloadBtn.href = URL.createObjectURL(finalBlob);
                                    break;
                                }
                                
                                downloadedChunks.push(value);
                                appendQueue.push(value);
                                processAppendQueue();
                                
                                if (audioPlayer.paused && downloadedChunks.length === 1) {
                                    audioPlayer.play().catch(e => console.log('Autoplay prevented:', e));
                                }
                            }
                        } catch (e) {
                            console.error('流式读取或播放错误:', e);
                            if (mediaSource.readyState === 'open') {
                                mediaSource.endOfStream('network');
                            }
                        }
                    });
                }
                
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
            const audiobookMode = document.getElementById('audiobookMode');

            ttsMode.addEventListener('click', function() { switchMode('tts'); });
            transcriptionMode.addEventListener('click', function() { switchMode('transcription'); });
            remoteMode.addEventListener('click', function() { switchMode('remote'); });
            if(audiobookMode) audiobookMode.addEventListener('click', function() { switchMode('audiobook'); });
        }

        // 切换功能模式
        function switchMode(mode) {
            const ttsMode = document.getElementById('ttsMode');
            const transcriptionMode = document.getElementById('transcriptionMode');
            const remoteMode = document.getElementById('remoteMode');
            const audiobookMode = document.getElementById('audiobookMode');
            
            const mainContent = document.getElementById('ttsMainContent') || document.querySelector('.main-content');
            const transcriptionContainer = document.getElementById('transcriptionContainer');
            const remoteContainer = document.getElementById('remoteContainer');
            const audiobookContainer = document.getElementById('audiobookContainer');

            currentMode = mode;

            ttsMode.classList.remove('active');
            transcriptionMode.classList.remove('active');
            remoteMode.classList.remove('active');
            if(audiobookMode) audiobookMode.classList.remove('active');

            mainContent.style.display = 'none';
            if(transcriptionContainer) transcriptionContainer.style.display = 'none';
            if(remoteContainer) remoteContainer.style.display = 'none';
            if(audiobookContainer) audiobookContainer.style.display = 'none';

            if (mode === 'tts') {
                ttsMode.classList.add('active');
                mainContent.style.display = 'block';
            } else if (mode === 'transcription') {
                transcriptionMode.classList.add('active');
                if(transcriptionContainer) transcriptionContainer.style.display = 'block';
            } else if (mode === 'remote') {
                remoteMode.classList.add('active');
                if(remoteContainer) remoteContainer.style.display = 'block';
            } else if (mode === 'audiobook') {
                if(audiobookMode) audiobookMode.classList.add('active');
                if(audiobookContainer) audiobookContainer.style.display = 'block';
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

        function copyTextToClipboard(text) {
            if (navigator.clipboard && window.isSecureContext) {
                return navigator.clipboard.writeText(text).catch(() => fallbackCopyText(text));
            }
            return fallbackCopyText(text);
        }

        function fallbackCopyText(text) {
            return new Promise((resolve, reject) => {
                try {
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    textarea.style.position = 'fixed';
                    textarea.style.left = '-999999px';
                    textarea.style.top = '-999999px';
                    document.body.appendChild(textarea);
                    textarea.focus();
                    textarea.select();
                    const successful = document.execCommand('copy');
                    textarea.remove();
                    if (successful) resolve();
                    else reject(new Error('execCommand failed'));
                } catch (err) {
                    reject(err);
                }
            });
        }

        function initializeVoiceCopy() {
            function handleVoiceCopy(btnElement, textElement) {
                const voiceSelect = document.getElementById('voice');
                const voice = voiceSelect ? voiceSelect.value : '';
                if (!voice) return;

                copyTextToClipboard(voice).then(() => {
                    if (textElement) {
                        const originalText = textElement.textContent;
                        textElement.textContent = '已复制！';
                        setTimeout(() => { textElement.textContent = originalText; }, 2000);
                    }
                    const previewStatus = document.getElementById('previewStatus');
                    if (previewStatus) {
                        previewStatus.textContent = '✅ 已复制音色名：' + voice;
                        setTimeout(() => {
                            if (previewStatus.textContent.includes(voice)) {
                                previewStatus.textContent = '使用固定示例，不会影响当前文本';
                            }
                        }, 3500);
                    }
                }).catch(() => {
                    alert('复制失败，请手动记录当前音色名：' + voice);
                });
            }

            const copyVoiceBtn = document.getElementById('copyVoiceBtn');
            if (copyVoiceBtn) {
                copyVoiceBtn.addEventListener('click', function() {
                    handleVoiceCopy(this, document.getElementById('copyVoiceBtnText'));
                });
            }

            const copyVoiceSelectBtn = document.getElementById('copyVoiceSelectBtn');
            if (copyVoiceSelectBtn) {
                copyVoiceSelectBtn.addEventListener('click', function() {
                    handleVoiceCopy(this, document.getElementById('copyVoiceSelectText'));
                });
            }
        }

        function initializeSecurityBanner() {
            const banner = document.getElementById('noPasswordBanner');
            if (!banner) return;
            const hasPassword = banner.getAttribute('data-has-password') === 'true';
            const isDismissed = localStorage.getItem('cf_voice_no_password_dismissed') === 'true';

            if (!hasPassword && !isDismissed) {
                banner.style.display = 'block';
            }

            const dismissBtns = [
                document.getElementById('dismissPasswordBannerBtn'),
                document.getElementById('dismissPasswordBannerBtn2')
            ];
            dismissBtns.forEach(btn => {
                if (btn) {
                    btn.addEventListener('click', function() {
                        banner.style.display = 'none';
                        localStorage.setItem('cf_voice_no_password_dismissed', 'true');
                    });
                }
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


// ========== Audiobook Feature ==========
(function() {
    let abChunks = [];
    let abCurrentIndex = 0;
    
    // Ping-Pong buffering for gapless playback
    let abAudio1 = new Audio();
    let abAudio2 = new Audio();
    let useAudio1 = true;
    let activeAudio = abAudio1;
    
    let isPlaying = false;
    let nextChunkLoaded = false;
    let preloadedBlobUrl = null;
    let currentSettingsKey = '';
    // UI Elements - Setup Area
    const setupArea = document.getElementById('abSetupArea');
    const playerArea = document.getElementById('abPlayerArea');
    const inputText = document.getElementById('abInputText');
    const fileInput = document.getElementById('abFileInput');
    const uploadBtn = document.getElementById('abUploadBtn');
    const fileHint = document.getElementById('abFileHint');
    const startBtn = document.getElementById('abStartBtn');
    const loadTextBtn = document.getElementById('abLoadTextBtn');
    
    // Setup Controls
    const setupVoiceGender = document.getElementById('abSetupVoiceGender');
    const setupVoiceScene = document.getElementById('abSetupVoiceScene');
    const setupVoiceSelect = document.getElementById('abSetupVoiceSelect');
    const setupStyleSelect = document.getElementById('abSetupStyleSelect');
    const setupSpeedSelect = document.getElementById('abSetupSpeedSelect');
    const setupPitchSelect = document.getElementById('abSetupPitchSelect');

    // UI Elements - Player Area
    const readerView = document.getElementById('abReaderView');
    const progressText = document.getElementById('abProgressText');
    const progressBar = document.getElementById('abProgressBar');
    const playPauseBtn = document.getElementById('abPlayPauseBtn');
    const exitBtn = document.getElementById('abExitBtn');
    const prevBtn = document.getElementById('abPrevBtn');
    const nextBtn = document.getElementById('abNextBtn');

    // Player Controls
    const voiceGender = document.getElementById('abVoiceGender');
    const voiceScene = document.getElementById('abVoiceScene');
    const voiceSelect = document.getElementById('abVoiceSelect');
    const styleSelect = document.getElementById('abStyleSelect');
    const speedSelect = document.getElementById('abSpeedSelect');
    const pitchSelect = document.getElementById('abPitchSelect');
    
    if(!setupArea) return;

    const voiceProfiles = {
        'zh-CN-XiaoxiaoNeural': ['female', 'general'],
        'zh-CN-XiaoyiNeural': ['female', 'shortvideo'],
        'zh-CN-XiaochenNeural': ['female', 'general'],
        'zh-CN-XiaohanNeural': ['female', 'formal'],
        'zh-CN-XiaomengNeural': ['female', 'story'],
        'zh-CN-XiaomoNeural': ['female', 'story'],
        'zh-CN-XiaoqiuNeural': ['female', 'formal'],
        'zh-CN-XiaoruiNeural': ['female', 'general'],
        'zh-CN-XiaoshuangNeural': ['female', 'shortvideo'],
        'zh-CN-XiaoxuanNeural': ['female', 'general'],
        'zh-CN-XiaoyanNeural': ['female', 'story'],
        'zh-CN-XiaoyouNeural': ['female', 'story'],
        'zh-CN-XiaozhenNeural': ['female', 'formal'],
        'zh-CN-YunxiNeural': ['male', 'general'],
        'zh-CN-YunyangNeural': ['male', 'shortvideo'],
        'zh-CN-YunjianNeural': ['male', 'formal'],
        'zh-CN-YunfengNeural': ['male', 'story'],
        'zh-CN-YunhaoNeural': ['male', 'shortvideo'],
        'zh-CN-YunxiaNeural': ['male', 'shortvideo'],
        'zh-CN-YunyeNeural': ['male', 'shortvideo'],
        'zh-CN-YunzeNeural': ['male', 'formal']
    };

    function applyVoiceFilter(genderEl, sceneEl, voiceEl) {
        if (!genderEl || !sceneEl || !voiceEl) return;
        let firstVisible = null;
        [...voiceEl.options].forEach(opt => {
            const prof = voiceProfiles[opt.value];
            const visible = prof && (genderEl.value === 'all' || prof[0] === genderEl.value) && (sceneEl.value === 'all' || prof[1] === sceneEl.value);
            opt.hidden = !visible;
            if (visible && !firstVisible) firstVisible = opt;
        });
        if (voiceEl.selectedOptions[0]?.hidden && firstVisible) {
            voiceEl.value = firstVisible.value;
        }
    }

    // Sync helpers
    function syncSetupToPlayer() {
        if (voiceGender && setupVoiceGender) voiceGender.value = setupVoiceGender.value;
        if (voiceScene && setupVoiceScene) voiceScene.value = setupVoiceScene.value;
        applyVoiceFilter(voiceGender, voiceScene, voiceSelect);
        if (voiceSelect && setupVoiceSelect) voiceSelect.value = setupVoiceSelect.value;
        if (styleSelect && setupStyleSelect) styleSelect.value = setupStyleSelect.value;
        if (speedSelect && setupSpeedSelect) speedSelect.value = setupSpeedSelect.value;
        if (pitchSelect && setupPitchSelect) pitchSelect.value = setupPitchSelect.value;
        saveAudiobookSettings();
    }

    function syncPlayerToSetup() {
        if (setupVoiceGender && voiceGender) setupVoiceGender.value = voiceGender.value;
        if (setupVoiceScene && voiceScene) setupVoiceScene.value = voiceScene.value;
        applyVoiceFilter(setupVoiceGender, setupVoiceScene, setupVoiceSelect);
        if (setupVoiceSelect && voiceSelect) setupVoiceSelect.value = voiceSelect.value;
        if (setupStyleSelect && styleSelect) setupStyleSelect.value = styleSelect.value;
        if (setupSpeedSelect && speedSelect) setupSpeedSelect.value = speedSelect.value;
        if (setupPitchSelect && pitchSelect) setupPitchSelect.value = pitchSelect.value;
        saveAudiobookSettings();
    }

    function saveAudiobookSettings() {
        if (!voiceSelect) return;
        localStorage.setItem('ab_voice', voiceSelect.value);
        localStorage.setItem('ab_gender', voiceGender?.value || 'all');
        localStorage.setItem('ab_scene', voiceScene?.value || 'all');
        localStorage.setItem('ab_style', styleSelect?.value || 'general');
        localStorage.setItem('ab_speed', speedSelect?.value || '1.0');
        localStorage.setItem('ab_pitch', pitchSelect?.value || '0');
    }

    function loadAudiobookSettings() {
        const savedGender = localStorage.getItem('ab_gender') || 'all';
        const savedScene = localStorage.getItem('ab_scene') || 'all';
        const savedVoice = localStorage.getItem('ab_voice') || 'zh-CN-XiaoxiaoNeural';
        const savedStyle = localStorage.getItem('ab_style') || 'general';
        const savedSpeed = localStorage.getItem('ab_speed') || '1.0';
        const savedPitch = localStorage.getItem('ab_pitch') || '0';

        [setupVoiceGender, voiceGender].forEach(el => { if (el) el.value = savedGender; });
        [setupVoiceScene, voiceScene].forEach(el => { if (el) el.value = savedScene; });

        applyVoiceFilter(setupVoiceGender, setupVoiceScene, setupVoiceSelect);
        applyVoiceFilter(voiceGender, voiceScene, voiceSelect);

        [setupVoiceSelect, voiceSelect].forEach(el => { if (el) el.value = savedVoice; });
        [setupStyleSelect, styleSelect].forEach(el => { if (el) el.value = savedStyle; });
        [setupSpeedSelect, speedSelect].forEach(el => { if (el) el.value = savedSpeed; });
        [setupPitchSelect, pitchSelect].forEach(el => { if (el) el.value = savedPitch; });
    }

    // Bind setup filter listeners
    if (setupVoiceGender) {
        setupVoiceGender.addEventListener('change', () => {
            applyVoiceFilter(setupVoiceGender, setupVoiceScene, setupVoiceSelect);
            syncSetupToPlayer();
        });
    }
    if (setupVoiceScene) {
        setupVoiceScene.addEventListener('change', () => {
            applyVoiceFilter(setupVoiceGender, setupVoiceScene, setupVoiceSelect);
            syncSetupToPlayer();
        });
    }
    if (setupVoiceSelect) {
        setupVoiceSelect.addEventListener('change', syncSetupToPlayer);
    }
    if (setupStyleSelect) setupStyleSelect.addEventListener('change', syncSetupToPlayer);
    if (setupSpeedSelect) setupSpeedSelect.addEventListener('change', syncSetupToPlayer);
    if (setupPitchSelect) setupPitchSelect.addEventListener('change', syncSetupToPlayer);

    // Bind player filter & settings listeners
    function onPlayerSettingChange() {
        syncPlayerToSetup();
        if (isPlaying) {
            nextChunkLoaded = false;
            jumpTo(abCurrentIndex);
        }
    }

    if (voiceGender) {
        voiceGender.addEventListener('change', () => {
            applyVoiceFilter(voiceGender, voiceScene, voiceSelect);
            onPlayerSettingChange();
        });
    }
    if (voiceScene) {
        voiceScene.addEventListener('change', () => {
            applyVoiceFilter(voiceGender, voiceScene, voiceSelect);
            onPlayerSettingChange();
        });
    }
    if (voiceSelect) voiceSelect.addEventListener('change', onPlayerSettingChange);
    if (styleSelect) styleSelect.addEventListener('change', onPlayerSettingChange);
    if (speedSelect) speedSelect.addEventListener('change', onPlayerSettingChange);
    if (pitchSelect) pitchSelect.addEventListener('change', onPlayerSettingChange);

    // Remove markdown symbols and format
    function stripMarkdown(text) {
        return text
            .replace(/!\[.*?\]\(.*?\)/g, '') // images
            .replace(/\[(.*?)\]\(.*?\)/g, '$1') // links
            .replace(/[#*_>~]/g, '') // markdown symbols
            .replace(/---|===/g, ''); // hr
    }

    // Split text into chunks for TTS (smart grouping to improve natural prosody)
    function splitTextToChunks(text) {
        const raw = stripMarkdown(text);
        const tokens = raw.split(/([。！？\n]+)/); // Split keeping delimiters
        const chunks = [];
        let current = '';
        
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            current += token;
            
            // If the token is a delimiter, we check if we should push the chunk.
            // Push if the accumulated string is long enough, OR if there's a newline (paragraph end).
            if (token.match(/^[。！？\n]+$/)) {
                if (token.includes('\n') || current.length >= 150) {
                    chunks.push(current);
                    current = '';
                }
            }
        }
        if (current) chunks.push(current);
        return chunks;
    }

    function renderReaderView() {
        readerView.innerHTML = '';
        abChunks.forEach((chunk, index) => {
            const span = document.createElement('span');
            span.className = 'sentence';
            span.innerText = chunk;
            span.dataset.index = index;
            span.addEventListener('click', () => jumpTo(index));
            readerView.appendChild(span);
        });
    }

    function updateHighlight() {
        document.querySelectorAll('.ab-reader-view .sentence').forEach(el => {
            el.classList.remove('active');
        });
        const activeSpan = document.querySelector(`.ab-reader-view .sentence[data-index="${abCurrentIndex}"]`);
        if (activeSpan) {
            activeSpan.classList.add('active');
            activeSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        progressText.innerText = `${abCurrentIndex + 1} / ${abChunks.length}`;
        progressBar.max = Math.max(0, abChunks.length - 1);
        progressBar.value = abCurrentIndex;

        // Save progress
        localStorage.setItem('audiobook_progress', abCurrentIndex);
        
        // Save text digest for verifying same book
        if(abChunks.length > 0) {
            const digest = abChunks[0].substring(0, 20);
            localStorage.setItem('audiobook_digest', digest);
        }
    }

    async function fetchTTSBlob(text, voice, speed, pitch, style) {
        const headers = {};
        const pwd = localStorage.getItem('access_password');
        if (pwd) headers['Authorization'] = 'Bearer ' + pwd;
        headers['Content-Type'] = 'application/json';

        const res = await fetch('/v1/audio/speech', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                input: text.trim(),
                voice: voice,
                speed: speed,
                pitch: pitch,
                style: style || 'general'
            })
        });
        if(!res.ok) {
            throw new Error('TTS Request failed');
        }
        const blob = await res.blob();
        return URL.createObjectURL(blob);
    }

    async function playCurrent() {
        if(abCurrentIndex >= abChunks.length) {
            isPlaying = false;
            playPauseBtn.innerHTML = '<span class="ab-icon">▶</span>播放';
            return;
        }

        updateHighlight();
        const chunk = abChunks[abCurrentIndex];
        const voice = voiceSelect ? voiceSelect.value : 'zh-CN-XiaoxiaoNeural';
        const speed = speedSelect ? speedSelect.value : 1.0;
        const pitch = pitchSelect ? pitchSelect.value : '0';
        const style = styleSelect ? styleSelect.value : 'general';
        const settingsKey = `${voice}_${speed}_${pitch}_${style}`;
        
        const cleanText = chunk.trim();
        if (!cleanText) {
            abCurrentIndex++;
            return playCurrent();
        }
        
        try {
            const standbyAudio = useAudio1 ? abAudio2 : abAudio1;
            
            if(nextChunkLoaded && currentSettingsKey === settingsKey && standbyAudio.src) {
                // The standby audio already has the next chunk preloaded and decoded
                activeAudio = standbyAudio;
                useAudio1 = !useAudio1; // flip active role
            } else {
                activeAudio.pause();
                activeAudio.removeAttribute('src');
                activeAudio.load();
                playPauseBtn.innerHTML = '<span class="ab-icon">⏳</span>缓冲';
                const blobUrl = await fetchTTSBlob(chunk, voice, speed, pitch, style);
                activeAudio.src = blobUrl;
                currentSettingsKey = settingsKey;
            }
            
            await activeAudio.play();
            isPlaying = true;
            playPauseBtn.innerHTML = '<span class="ab-icon">⏸</span>暂停';
            
            // Pre-fetch next into the new standby audio
            if (abCurrentIndex + 1 < abChunks.length) {
                nextChunkLoaded = false;
                let nextIndex = abCurrentIndex + 1;
                while (nextIndex < abChunks.length && !abChunks[nextIndex].trim()) {
                    nextIndex++;
                }
                if (nextIndex < abChunks.length) {
                    fetchTTSBlob(abChunks[nextIndex], voice, speed, pitch, style).then(url => {
                        const newStandby = useAudio1 ? abAudio2 : abAudio1;
                        if(newStandby.src) URL.revokeObjectURL(newStandby.src);
                        newStandby.src = url; // Preload so browser decodes it in background
                        currentSettingsKey = settingsKey;
                        nextChunkLoaded = true;
                    }).catch(e => console.error(e));
                }
            } else {
                nextChunkLoaded = false;
            }
        } catch(e) {
            console.error('播放失败:', e);
            playPauseBtn.innerHTML = '<span class="ab-icon">▶</span>播放';
            isPlaying = false;
            alert('获取语音失败，请检查网络或授权码');
        }
    }

    const onAudioEnded = () => {
        abCurrentIndex++;
        playCurrent();
    };

    abAudio1.onended = onAudioEnded;
    abAudio2.onended = onAudioEnded;

    function jumpTo(index) {
        abCurrentIndex = Math.max(0, Math.min(index, abChunks.length - 1));
        nextChunkLoaded = false;
        abAudio1.pause();
        abAudio2.pause();
        abAudio1.removeAttribute('src');
        abAudio2.removeAttribute('src');
        playCurrent();
    }

    playPauseBtn.addEventListener('click', () => {
        if(isPlaying) {
            activeAudio.pause();
            isPlaying = false;
            playPauseBtn.innerHTML = '<span class="ab-icon">▶</span>播放';
        } else {
            if(activeAudio.src && !activeAudio.ended) {
                activeAudio.play();
                isPlaying = true;
                playPauseBtn.innerHTML = '<span class="ab-icon">⏸</span>暂停';
            } else {
                playCurrent();
            }
        }
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (abCurrentIndex > 0) {
                jumpTo(abCurrentIndex - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (abCurrentIndex + 1 < abChunks.length) {
                jumpTo(abCurrentIndex + 1);
            }
        });
    }

    progressBar.addEventListener('input', (e) => {
        const index = parseInt(e.target.value);
        if(index !== abCurrentIndex) {
            jumpTo(index);
        }
    });

    startBtn.addEventListener('click', () => {
        const text = inputText.value.trim();
        if(!text) {
            alert('请输入或上传文本');
            return;
        }
        
        abChunks = splitTextToChunks(text);
        if(abChunks.length === 0) return;
        
        // Ensure settings are synced to player
        syncSetupToPlayer();

        setupArea.style.display = 'none';
        playerArea.style.display = 'block';
        
        renderReaderView();
        
        // Restore progress if matching text
        const savedDigest = localStorage.getItem('audiobook_digest');
        const currentDigest = abChunks[0].substring(0, 20);
        if(savedDigest === currentDigest) {
            const savedIndex = parseInt(localStorage.getItem('audiobook_progress'));
            if(!isNaN(savedIndex) && savedIndex >= 0 && savedIndex < abChunks.length) {
                abCurrentIndex = savedIndex;
            } else {
                abCurrentIndex = 0;
            }
        } else {
            abCurrentIndex = 0;
            localStorage.setItem('audiobook_fulltext', text);
        }
        
        jumpTo(abCurrentIndex);
    });

    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if(!file) return;
        if (fileHint) {
            fileHint.textContent = `已载入: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            inputText.value = e.target.result;
        };
        reader.readAsText(file);
    });

    function exitAudiobook() {
        abAudio1.pause();
        abAudio2.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '<span class="ab-icon">▶</span>播放';
        nextChunkLoaded = false;
        if (abAudio1.src) URL.revokeObjectURL(abAudio1.src);
        if (abAudio2.src) URL.revokeObjectURL(abAudio2.src);
        abAudio1.removeAttribute('src');
        abAudio2.removeAttribute('src');
        setupArea.style.display = 'block';
        playerArea.style.display = 'none';
    }

    if (loadTextBtn) loadTextBtn.addEventListener('click', exitAudiobook);
    if (exitBtn) exitBtn.addEventListener('click', exitAudiobook);
    
    // Auto restore if previous text or settings exist
    window.addEventListener('DOMContentLoaded', () => {
        loadAudiobookSettings();
        const savedText = localStorage.getItem('audiobook_fulltext');
        if(savedText) {
            inputText.value = savedText;
        }
    });

})();
// ========== End Audiobook Feature ==========


