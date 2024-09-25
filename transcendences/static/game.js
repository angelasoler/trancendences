
// vairaveis glabais para controle do jogo
let canvas, context

// Tamanhos
const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 7;

// Posições iniciais
let paddle1Y, paddle2Y, ballX, ballY;

// Velocidades;
let ballSpeedX = 5;
let ballSpeedY = 5;
let paddleSpeed = 10;

// Controles do jogador
let upPressed = false;
let downPressed = false;

let animationFrameId;


function initGame() {
    // Configurações do canvas
    canvas = document.getElementById('gameCanvas');
    context = canvas.getContext('2d');
    
    paddle1Y = (canvas.height - paddleHeight) / 2;
    paddle2Y = (canvas.height - paddleHeight) / 2;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;

    // Adicionar event listeners para teclas
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    // Iniciar o jogo
    draw();
}

function stopGame() {
    // Cancelar o loop de animação
    cancelAnimationFrame(animationFrameId);

    // Remover event listeners
    document.removeEventListener('keydown', keyDownHandler);
    document.removeEventListener('keyup', keyUpHandler);
}

function keyDownHandler(e) {
    if (e.key === 'ArrowUp') {
        upPressed = true;
    } else if (e.key === 'ArrowDown') {
        downPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'ArrowUp') {
        upPressed = false;
    } else if (e.key === 'ArrowDown') {
        downPressed = false;
    }
}

// Função principal de desenho
function draw() {
    // Limpar o canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar o paddle esquerdo (controlado pelo jogador)
    context.fillStyle = 'white';
    context.fillRect(0, paddle1Y, paddleWidth, paddleHeight);

    // Desenhar o paddle direito (IA simples)
    context.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);

    // Desenhar a bola
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    context.fill();

    // Mover a bola
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Colisão com as paredes superior e inferior
    if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Colisão com o paddle esquerdo
    if (ballX - ballRadius < paddleWidth) {
        if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else {
            // Ponto para o oponente
            resetBall();
        }
    }

    // Colisão com o paddle direito
    if (ballX + ballRadius > canvas.width - paddleWidth) {
        if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else {
            // Ponto para o jogador
            resetBall();
        }
    }

    // Mover o paddle do jogador
    if (upPressed && paddle1Y > 0) {
        paddle1Y -= paddleSpeed;
    } else if (downPressed && paddle1Y < canvas.height - paddleHeight) {
        paddle1Y += paddleSpeed;
    }

    // Mover o paddle do oponente (IA simples)
    if (paddle2Y + paddleHeight / 2 < ballY) {
        paddle2Y += paddleSpeed - 5;
    } else {
        paddle2Y -= paddleSpeed - 5;
    }

    animationFrameId = requestAnimationFrame(draw);
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';

    if (sectionId === 'game') {
        stopGame();
        initGame();
    }
    else
        stopGame();
}

// Exibir a seção inicial ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    showSection('home');
});

