// Import stylesheets
import './style.css';

const canvas: HTMLCanvasElement = document.querySelector('#board');
const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
const font = 'Consolas, monospace';

const box = 20;
const width = box * 21;
const height = box * 21;

const initialPoint = {
  x: (width - box) / 2,
  y: (height - box) / 2,
};

const snake = [initialPoint];

const food = {
  x: Math.floor(Math.random() * 20 + 1) * box,
  y: Math.floor(Math.random() * 20 + 1) * box,
};

let ms = 120;
let score = 0;
let record = 0;
let dir = 'none';

const controller = (e: KeyboardEvent) => {
  if (e.key === 'r') restart();
  else if (e.key === 'ArrowLeft' && dir !== 'right') dir = 'left';
  else if (e.key === 'ArrowUp' && dir !== 'down') dir = 'up';
  else if (e.key === 'ArrowRight' && dir !== 'left') dir = 'right';
  else if (e.key === 'ArrowDown' && dir !== 'up') dir = 'down';
};

const clearCanvas = () => {
  ctx.fillStyle = 'gray';
  ctx.fillRect(0, 0, width, height);
};

const restart = () => {
  clearInterval(game);
  snake[0] = initialPoint;
  snake.length = 1;
  ms = 120;
  dir = 'none';
  game = setInterval(loop, ms);
};

const updateAppleCoordinates = () => {
  food.x = Math.floor(Math.random() * 20 + 1) * box;
  food.y = Math.floor(Math.random() * 20 + 1) * box;
};

// Spawn a apple randomly
const spawnApple = () => {
  if (snake.some((elem) => elem.x === food.x && elem.y === food.y)) {
    updateAppleCoordinates();
    spawnApple();
  } else {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);
  }
};

// Show Score
const showScore = () => {
  ctx.fillStyle = 'white';
  ctx.font = `${box}px ${font}`;
  ctx.fillText(`Score: ${score}`, box - 4, box);
  ctx.fillText(`Record: ${record}`, width - box * 6.25, box);
};

// Show Game Over
const showGameOver = () => {
  clearCanvas();
  showScore();
  ctx.fillText('Press r to restart', box * 5.5, height / 2 + box * 1.5);
  ctx.font = `bold ${box * 3}px ${font}`;
  ctx.fillText('Game Over!', box * 2.25, height / 2);
};

// Stop the game
const stopGame = () => {
  clearInterval(game);
  setTimeout(showGameOver, 500);
};

// Looping to run the game
const loop = () => {
  clearCanvas();
  showScore();
  spawnApple();

  // Setting the snake position
  let [px, py] = [snake[0].x, snake[0].y];
  let [ax, ay] = [food.x, food.y];

  if (dir === 'left') px -= box;
  else if (dir === 'up') py -= box;
  else if (dir === 'right') px += box;
  else if (dir === 'down') py += box;

  // Boundaries
  if (px >= width) px = 0;
  if (px < 0) px = width;
  if (py >= height) py = 0;
  if (py < 0) py = height;

  if (px === ax && py === ay) {
    score += 10;

    // Setting more 5% of difficult for each apple
    if (score <= 250) {
      ms = Math.round(ms * 0.95);
    }

    updateAppleCoordinates();
    clearInterval(game);
    game = setInterval(loop, ms);
  } else {
    snake.pop();
  }

  if (snake.some((elem) => px === elem.x && py === elem.y)) {
    stopGame();
  } else {
    snake.unshift({ x: px, y: py });
  }

  snake.forEach((elem, index) => {
    ctx.fillStyle = index === 0 ? 'blue' : 'cyan';
    ctx.fillRect(elem.x, elem.y, box, box);
  });
};

let game = setInterval(loop, ms);
document.addEventListener('keydown', controller);
