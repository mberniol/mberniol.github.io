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
