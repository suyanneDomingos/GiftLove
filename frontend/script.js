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
const BG_VOLUME = 0.2; // volume base do bgMusic
bgMusic.volume = BG_VOLUME;

// Lista de músicas das cartas
const musics = [
    "audio/my-love-mine-all-mine.mp3",
    "audio/cant-help-falling.mp3",
    "audio/just-the-two.mp3",
    "audio/outro-lugar.mp3",
    "audio/velha-infancia.mp3",
    "audio/como-um-menino.mp3"
];

let currentAudio = null;

// =================== Funções de Áudio =================== //
function playSound(soundId) {
    if (!soundEnabled) return;
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => console.log('Autoplay bloqueado.'));
    }
}

function playMusic(index) {
    // Para música anterior da carta
    if (currentAudio) fadeOutAudio(currentAudio, 500);

    // Abaixa bgMusic para volume baixo (não zero)
    fadeVolume(bgMusic, 0.05, 500);

    // Toca música da carta
    const audio = new Audio(musics[index]);
    audio.volume = musicEnabled ? 0.6 : 0;
    audio.loop = true; // para tocar até fechar
    audio.play().catch(() => console.log('Autoplay bloqueado.'));
    currentAudio = audio;
}

function fadeVolume(audio, targetVolume, duration = 500) {
    if (!audio) return;
    const step = 50;
    const diff = targetVolume - audio.volume;
    const increment = diff / (duration / step);

    const interval = setInterval(() => {
        if ((increment > 0 && audio.volume < targetVolume) ||
            (increment < 0 && audio.volume > targetVolume)) {
            audio.volume += increment;
        } else {
            audio.volume = targetVolume;
            clearInterval(interval);
        }
    }, step);
}

function fadeOutAudio(audio, duration = 500) {
    if (!audio) return;
    const step = 50;
    const decrement = audio.volume / (duration / step);

    const interval = setInterval(() => {
        if (audio.volume - decrement > 0) {
            audio.volume -= decrement;
        } else {
            audio.volume = 0;
            audio.pause();
            audio.currentTime = 0;
            clearInterval(interval);
        }
    }, step);
}

// =================== Funções para Abrir/Fechar Cartas =================== //

// Função para abrir uma carta específica
function openLetter(letterId) {
    const letter = document.getElementById(letterId);
    if (!letter) return;

    // Pausar música de fundo se estiver tocando
    const wasPlaying = !bgMusic.paused;
    
    // Tocar som de carta
    playSound('paperSound');
    
    // Mostrar overlay
    overlay.classList.add('active');
    
    // Mostrar carta
    letter.classList.add('show');
    letter.dataset.wasPlaying = wasPlaying;
    
    // Pausar bgMusic se estiver tocando
    if (wasPlaying) {
        bgMusic.pause();
    }
    
    // Tocar música específica da carta (se houver)
    const musicIndex = parseInt(letter.getAttribute('data-music') || 0, 10);
    if (musicIndex >= 0 && musicEnabled) {
        playMusic(musicIndex);
    }
    
    // Criar confetes
    createConfetti();
}

// Função para fechar carta
function closeLetter() {
    // Fechar todas as cartas abertas
    document.querySelectorAll('.letter.show').forEach(letter => {
        const wasPlaying = letter.dataset.wasPlaying === 'true';
        
        // Esconder carta
        letter.classList.remove('show');
        
        // Retomar música se estava tocando antes
        if (wasPlaying && musicEnabled) {
            bgMusic.play().catch(() => console.log('Autoplay bloqueado.'));
        }
    });
    
    // Remover overlay se não houver mais cartas abertas
    if (document.querySelectorAll('.letter.show').length === 0) {
        overlay.classList.remove('active');
    }
    
    // Parar música da carta atual
    if (currentAudio) {
        fadeOutAudio(currentAudio, 500);
        currentAudio = null;
    }
    
    // Restaurar volume do bgMusic
    fadeVolume(bgMusic, musicEnabled ? BG_VOLUME : 0, 500);
}

// =================== Eventos =================== //

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

// Abrir carta (atualizada)
papers.forEach(paper => {
    paper.addEventListener('click', function() {
        if (!presentOpened) return;

        const letterNum = parseInt(this.dataset.letter, 10);
        const letterId = `letter${letterNum}`;
        
        openLetter(letterId);
        
        // Efeito visual na carta pequena
        this.classList.add('clicked');
        setTimeout(() => this.classList.remove('clicked'), 500);
    });
});

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

// =================== Confetes =================== //
function createConfetti() {
    const colors = ['#ff0000','#00ff00','#0000ff','#ffff00','#ff00ff'];
    for (let i = 0; i < 20; i++) {
        const c = document.createElement('div');
        c.style.cssText = `
            position: fixed;
            width: 10px; height: 10px;
            background: ${colors[Math.floor(Math.random()*colors.length)]};
            top: 0; left: ${Math.random()*100}vw;
            border-radius: 50%;
            animation: confettiFall 1s linear forwards;
            z-index: 9999;
        `;
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 1000);
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

// =================== Tartaruga =================== //
function showTartarugaMessage() {
    playSound('paperSound');
    overlay.classList.add('active');
    tartarugaMessage.classList.add('show');

    if (musicEnabled) fadeVolume(bgMusic, 0.05, 500);

    createTartarugaConfetti();
}

function closeTartarugaMessage() {
    tartarugaMessage.classList.remove('show');
    overlay.classList.remove('active');
    fadeVolume(bgMusic, musicEnabled ? BG_VOLUME : 0, 500);
}

function createTartarugaConfetti() {
    const colors = ['#99CD85','#CFE0BC','#7FA653','#63783D','#2E7D32'];
    for (let i = 0; i < 30; i++) {
        const c = document.createElement('div');
        c.style.cssText = `
            position: fixed;
            width: ${Math.random()*15+5}px;
            height: ${Math.random()*15+5}px;
            background: ${colors[Math.floor(Math.random()*colors.length)]};
            top: 0; left: ${Math.random()*100}vw;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            animation: confettiFall ${Math.random()*1+0.5}s linear forwards;
            z-index: 9999;
        `;
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 1500);
    }
}

turtle?.addEventListener('click', showTartarugaMessage);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Adicionar eventos aos botões de fechar nas cartas
    document.querySelectorAll('.letter .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeLetter);
    });
    
    // Precarregar áudios
    document.querySelectorAll('audio').forEach(audio => audio.load());
    console.log('Presente carregado!');
});