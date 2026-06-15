const GAME_WIDTH = 480;
const GAME_HEIGHT = 700;
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;

const paddle = {
    x: GAME_WIDTH / 2 - 50,
    y: GAME_HEIGHT - 40,
    width: 100,
    height: 14,
    speed: 7
};

const ball = {
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2,
    radius: 10,
    dx: 4,
    dy: -4
};

let score = 0;
let gameRunning = true;
let gameOver = false;

function getGameX(clientX) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = GAME_WIDTH / rect.width;
    return (clientX - rect.left) * scaleX;
}

const keys = {};
document.addEventListener('keydown', function(e) {
    keys[e.key] = true;
    e.preventDefault();
});
document.addEventListener('keyup', function(e) {
    keys[e.key] = false;
    e.preventDefault();
});

canvas.addEventListener('mousemove', function(e) {
    if (gameOver) return;canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    if (gameOver) { restartGame(); return; }
    const gameX = getGameX(e.touches[0].clientX);
    paddle.x = gameX - paddle.width / 2;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > GAME_WIDTH) paddle.x = GAME_WIDTH - paddle.width;
}, { passive: false });

canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    if (gameOver) return;
    const gameX = getGameX(e.touches[0].clientX);
    paddle.x = gameX - paddle.width / 2;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > GAME_WIDTH) paddle.x = GAME_WIDTH - paddle.width;
}, { passive: false });

    function update() {
    if (!gameRunning) return;

    // Teclat
    if (keys['ArrowLeft'] || keys['a']) paddle.x -= paddle.speed;
    if (keys['ArrowRight'] || keys['d']) paddle.x += paddle.speed;

    // Limitar pala
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > GAME_WIDTH) paddle.x = GAME_WIDTH - paddle.width;

    // Moure pilota
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Rebots laterals i superior
    if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= GAME_WIDTH) ball.dx = -ball.dx;
    if (ball.y - ball.radius <= 0) ball.dy = -ball.dy;

    // Col·lisió amb la pala
    if (ball.dy > 0 &&
        ball.y + ball.radius >= paddle.y &&
        ball.y - ball.radius <= paddle.y + paddle.height &&
        ball.x + ball.radius >= paddle.x &&
        ball.x - ball.radius <= paddle.x + paddle.width) {
        ball.dy = -ball.dy;
        ball.y = paddle.y - ball.radius;
        ball.dx *= 1.02;
        ball.dy *= 1.02;
        score++;
        document.getElementById('score').textContent = score;
    }

    // Game Over
    if (ball.y - ball.radius > GAME_HEIGHT) {
        gameRunning = false;
        gameOver = true;
        document.getElementById('score').textContent =
            'Game Over! Puntuació: ' + score + ' (toca per reiniciar)';
    }
}

function draw() {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Línia central discontínua
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.setLineDash([10, 15]);
    ctx.beginPath();
    ctx.moveTo(0, GAME_HEIGHT / 2);
    ctx.lineTo(GAME_WIDTH, GAME_HEIGHT / 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Pala
    ctx.fillStyle = '#0ff';
    ctx.shadowColor = '#0ff';
    ctx.shadowBlur = 15;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // Pilota
    ctx.shadowColor = '#fff';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Game Over
    if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        ctx.fillStyle = '#fff';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20);
        ctx.font = '18px Arial';
        ctx.fillText('Toca per reiniciar', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20);
        ctx.textAlign = 'start';
    }
}

    function restartGame() {
    score = 0;
    document.getElementById('score').textContent = '0';
    ball.x = GAME_WIDTH / 2;
    ball.y = GAME_HEIGHT / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * 4;
    ball.dy = -4;
    paddle.x = GAME_WIDTH / 2 - 50;
    gameOver = false;
    gameRunning = true;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
