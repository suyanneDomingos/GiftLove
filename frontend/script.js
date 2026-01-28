// Configurações
let soundEnabled = true;
let musicEnabled = true;
let presentOpened = false;

// Elementos
const caixa = document.querySelector('.caixa');
const papers = document.querySelectorAll('.paper');
const cartasContainer = document.querySelector('.cartas-container');
const tartarugaMessage = document.getElementById('tartarugaMessage');
const turtle = document.querySelector('.turtle');
const overlay = document.createElement('div');
overlay.className = 'overlay';
document.body.appendChild(overlay);

// Música de fundo
const bgMusic = document.getElementById('backgroundMusic');
bgMusic.volume = 0.6;

// Lista de músicas das cartas
const musics = [
    "audio/my-love-mine-all-mine.mp3",  // Carta 1
    "audio/cant-help-falling.mp3",      // Carta 2
    "audio/just-the-two.mp3",           // Carta 3
    "audio/outro-lugar.mp3",            // Carta 4
    "audio/velha-infancia.mp3",         // Carta 5
    "audio/assim-como-um-menino.mp3"    // Carta 6
];

let currentAudio = null;

// Função para tocar sons de efeitos
function playSound(soundId) {
    if (!soundEnabled) return;
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => console.log('Autoplay bloqueado.'));
    }
}

// Função para tocar música das cartas
function playMusic(index) {
    // Para música anterior da carta
    if (currentAudio) {
        fadeOutAudio(currentAudio, 500);
        currentAudio = null;
    }

    // Silencia música de fundo suavemente
    fadeVolume(bgMusic, 0, 500);

    const musicFile = musics[index];
    const audio = new Audio(musicFile);
    audio.volume = musicEnabled ? 0.6 : 0;
    audio.play().catch(() => console.log('Autoplay bloqueado. Clique em algo primeiro.'));
    currentAudio = audio;
}

// Função de fade para áudio (subir ou descer volume)
function fadeVolume(audio, targetVolume, duration = 500) {
    if (!audio) return;

    const step = 50;
    const difference = targetVolume - audio.volume;
    const increment = difference / (duration / step);

    const fadeInterval = setInterval(() => {
        if ((increment > 0 && audio.volume < targetVolume) || (increment < 0 && audio.volume > targetVolume)) {
            audio.volume += increment;
        } else {
            audio.volume = targetVolume;
            clearInterval(fadeInterval);
        }
    }, step);
}

// Fade out suave de uma música (para carta)
function fadeOutAudio(audio, duration = 500) {
    if (!audio) return;

    const step = 50;
    const decrement = audio.volume / (duration / step);

    const fadeInterval = setInterval(() => {
        if (audio.volume - decrement > 0) {
            audio.volume -= decrement;
        } else {
            audio.volume = 0;
            audio.pause();
            audio.currentTime = 0;
            clearInterval(fadeInterval);
        }
    }, step);
}

// Abrir presente
caixa.addEventListener('click', () => {
    if (presentOpened) return;
    presentOpened = true;
    playSound('openSound');

    if (musicEnabled) bgMusic.play();

    cartasContainer?.classList.add('visible');

    const container = document.querySelector('.container');
    if (container) {
        container.style.transform = 'rotate(-15deg) translateY(-3rem)';
        setTimeout(() => container.style.transform = 'rotate(0) translateY(0)', 300);
    }
});

// Abrir carta
papers.forEach(paper => {
    paper.addEventListener('click', function() {
        if (!presentOpened) return;
        const letterNum = this.dataset.letter;
        const letter = document.getElementById(`letter${letterNum}`);
        if (!letter) return;

        playSound('paperSound');
        overlay.classList.add('active');
        letter.classList.add('show');

        createConfetti();
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 500);

        // Tocar música da carta
        playMusic(letterNum - 1);
    });
});

// Fechar carta
function closeLetter() {
    document.querySelectorAll('.letter').forEach(letter => letter.classList.remove('show'));
    overlay.classList.remove('active');

    if (currentAudio) {
        fadeOutAudio(currentAudio, 500);
        currentAudio = null;
    }

    // Restaura música de fundo com fade
    fadeVolume(bgMusic, musicEnabled ? 0.6 : 0, 500);
}

// Controles de áudio
document.getElementById('musicToggle').addEventListener('click', function() {
    musicEnabled = !musicEnabled;
    if (musicEnabled) bgMusic.play();
    else bgMusic.pause();
    this.classList.toggle('muted', !musicEnabled);

    if (currentAudio) currentAudio.volume = musicEnabled ? 0.6 : 0;
});

document.getElementById('soundToggle').addEventListener('click', function() {
    soundEnabled = !soundEnabled;
    this.classList.toggle('muted', !soundEnabled);
});

// Overlay fecha cartas e tartaruga
overlay.addEventListener('click', () => {
    closeLetter();
    closeTartarugaMessage();
});

// Confetes simples
function createConfetti() {
    const colors = ['#ff0000','#00ff00','#0000ff','#ffff00','#ff00ff'];
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px; height: 10px;
            background: ${colors[Math.floor(Math.random()*colors.length)]};
            top: 0;
            left: ${Math.random()*100}vw;
            border-radius: 50%;
            animation: confettiFall 1s linear forwards;
            z-index: 9999;
        `;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 1000);
    }
}

// Estilo confetes
const style = document.createElement('style');
style.textContent = `
@keyframes confettiFall {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
}`;
document.head.appendChild(style);

// Mensagem da tartaruga
function showTartarugaMessage() {
    playSound('paperSound');
    overlay.classList.add('active');
    tartarugaMessage.classList.add('show');

    // Silencia bgMusic e toca se necessário
    if (musicEnabled) {
        fadeVolume(bgMusic, 0, 500);
    }

    createTartarugaConfetti();
}

function closeTartarugaMessage() {
    tartarugaMessage.classList.remove('show');
    overlay.classList.remove('active');

    fadeVolume(bgMusic, musicEnabled ? 0.6 : 0, 500);
}

// Confetes especiais para tartaruga
function createTartarugaConfetti() {
    const colors = ['#99CD85','#CFE0BC','#7FA653','#63783D','#2E7D32'];
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random()*15+5}px;
            height: ${Math.random()*15+5}px;
            background: ${colors[Math.floor(Math.random()*colors.length)]};
            top: 0;
            left: ${Math.random()*100}vw;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            animation: confettiFall ${Math.random()*1+0.5}s linear forwards;
            z-index: 9999;
        `;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 1500);
    }
}

// Clique na tartaruga
turtle?.addEventListener('click', showTartarugaMessage);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('audio').forEach(audio => audio.load());
    console.log('Presente carregado!');
});
