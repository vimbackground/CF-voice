const fs = require('fs');
let code = fs.readFileSync('src/frontend/app.client.js', 'utf8');

const oldInit = `        function initializeModeSwitcher() {
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
        }`;

const newInit = `        function initializeModeSwitcher() {
            const ttsMode = document.getElementById('ttsMode');
            const transcriptionMode = document.getElementById('transcriptionMode');
            const remoteMode = document.getElementById('remoteMode');
            const audiobookMode = document.getElementById('audiobookMode');

            ttsMode.addEventListener('click', function() { switchMode('tts'); });
            transcriptionMode.addEventListener('click', function() { switchMode('transcription'); });
            remoteMode.addEventListener('click', function() { switchMode('remote'); });
            if(audiobookMode) audiobookMode.addEventListener('click', function() { switchMode('audiobook'); });
        }`;

const oldSwitch = `        // 切换功能模式
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

        }`;

const newSwitch = `        // 切换功能模式
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
        }`;

// Replace ignoring \r\n vs \n
function normalize(str) {
    return str.replace(/\r\n/g, '\n').trim();
}
code = code.replace(/\r\n/g, '\n');

if (code.includes(normalize(oldInit))) {
    code = code.replace(normalize(oldInit), normalize(newInit));
} else {
    console.log('oldInit not found');
}

if (code.includes(normalize(oldSwitch))) {
    code = code.replace(normalize(oldSwitch), normalize(newSwitch));
} else {
    console.log('oldSwitch not found');
}

fs.writeFileSync('src/frontend/app.client.js', code);
console.log('Done replacement');
