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

// Função para tocar som
function playSound(soundId) {
    if (!soundEnabled) return;
    
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => {
            console.log('Autoplay bloqueado. Clique em algo primeiro.');
        });
    }
}

// Abrir presente
caixa.addEventListener('click', function() {
    if (!presentOpened) {
        presentOpened = true;
        playSound('openSound');
        
        // Tocar música de fundo
        if (musicEnabled) {
            const bgMusic = document.getElementById('backgroundMusic');
            bgMusic.play().catch(e => {
                console.log('Clique no botão de música para ativar');
            });
        }
        
        // Mostrar as cartas embaixo do presente
        if (cartasContainer) {
            cartasContainer.classList.add('visible');
        }
        
        // Animar o presente
        const container = document.querySelector('.container');
        if (container) {
            container.style.transform = 'rotate(-15deg) translateY(-3rem)';
            setTimeout(() => {
                container.style.transform = 'rotate(0) translateY(0)';
            }, 300);
        }
    }
});

// Abrir cartas
papers.forEach(paper => {
    paper.addEventListener('click', function() {
        if (!presentOpened) return;
        
        const letterNum = this.getAttribute('data-letter');
        const letter = document.getElementById(`letter${letterNum}`);
        
        if (letter) {
            playSound('paperSound');
            
            // Mostrar overlay
            overlay.classList.add('active');
            
            // Mostrar carta
            letter.classList.add('show');
            
            // Adicionar confetes
            createConfetti();
            
            // Opcional: Dar feedback visual na carta clicada
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 500);
        }
    });
});

// Fechar carta
function closeLetter() {
    document.querySelectorAll('.letter').forEach(letter => {
        letter.classList.remove('show');
    });
    overlay.classList.remove('active');
}

// Fechar ao clicar no overlay
overlay.addEventListener('click', closeLetter);

// Controles de áudio
document.getElementById('musicToggle').addEventListener('click', function() {
    const bgMusic = document.getElementById('backgroundMusic');
    musicEnabled = !musicEnabled;
    
    if (musicEnabled) {
        bgMusic.play();
        this.classList.remove('muted');
    } else {
        bgMusic.pause();
        this.classList.add('muted');
    }
});

document.getElementById('soundToggle').addEventListener('click', function() {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
        this.classList.remove('muted');
    } else {
        this.classList.add('muted');
    }
});

// Confetes simples
function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: 0;
            left: ${Math.random() * 100}vw;
            border-radius: 50%;
            animation: confettiFall 1s linear forwards;
            z-index: 9999;
        `;
        
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 1000);
    }
}

// Adicionar estilo de animação para confetes
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Função para mostrar mensagem da tartaruga
function showTartarugaMessage() {
    playSound('paperSound'); 
    overlay.classList.add('active');
    tartarugaMessage.classList.add('show');
    
    // Adicionar confetes especiais
    createTartarugaConfetti();
}

// Função para fechar mensagem da tartaruga
function closeTartarugaMessage() {
    tartarugaMessage.classList.remove('show');
    overlay.classList.remove('active');
}

// Adicionar evento de clique na tartaruga
if (turtle) {
    turtle.addEventListener('click', function() {
        showTartarugaMessage();
    });
}

// Confetes especiais para a tartaruga
function createTartarugaConfetti() {
    const colors = ['#99CD85', '#CFE0BC', '#7FA653', '#63783D', '#2E7D32'];
    
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: ${Math.random() * 15 + 5}px;
            height: ${Math.random() * 15 + 5}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: 0;
            left: ${Math.random() * 100}vw;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            animation: confettiFall ${Math.random() * 1 + 0.5}s linear forwards;
            z-index: 9999;
        `;
        
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 1500);
    }
}

// Fechar overlay fecha tanto cartas quanto mensagem da tartaruga
overlay.addEventListener('click', function() {
    closeTartarugaMessage();
    closeLetter();
});

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    console.log('Presente carregado ');
    
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.load();
    });
});