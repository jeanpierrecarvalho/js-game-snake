// Import stylesheets
import './style.css';

// Constants
const canvas: HTMLCanvasElement | null = document.querySelector('#board');
const ctx: CanvasRenderingContext2D | null = canvas?.getContext('2d');
const font: string = 'Consolas, monospace';
const box: number = 20;
const width: number = box * 21;
const height: number = box * 21;

// Initial snake and food positions
const initialPoint: { x: number; y: number } = {
  x: (width - box) / 2,
  y: (height - box) / 2,
};

const snake: { x: number; y: number }[] = [initialPoint];
const food: { x: number; y: number } = {
  x: Math.floor(Math.random() * 20 + 1) * box,
  y: Math.floor(Math.random() * 20 + 1) * box,
};

// Game variables
let ms: number = 120; // milliseconds between each frame
let score: number = 0;
let record: number = 0;
let dir: string = 'none';

// Controller function to handle keyboard input
const controller = (e: KeyboardEvent): void => {
  if (e.key === 'r') {
    restart();
  } else if (
    e.key.startsWith('Arrow') &&
    dir !== e.key.substring(5).toLowerCase()
  ) {
    dir = e.key.substring(5).toLowerCase();
  }
};

// Function to clear the canvas
const clearCanvas = (): void => {
  if (ctx) {
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, width, height);
  }
};

// Function to restart the game
const restart = (): void => {
  clearInterval(game);
  snake[0] = initialPoint;
  snake.length = 1;
  ms = 120;
  dir = 'none';
  game = setInterval(loop, ms);
};

// Function to update apple coordinates
const updateAppleCoordinates = (): void => {
  food.x = Math.floor(Math.random() * 20 + 1) * box;
  food.y = Math.floor(Math.random() * 20 + 1) * box;
};

// Function to spawn an apple randomly
const spawnApple = (): void => {
  if (ctx) {
    if (snake.some((elem) => elem.x === food.x && elem.y === food.y)) {
      updateAppleCoordinates();
      spawnApple();
    } else {
      ctx.fillStyle = 'red';
      ctx.fillRect(food.x, food.y, box, box);
    }
  }
};

// Function to show the score
const showScore = (): void => {
  if (ctx) {
    ctx.fillStyle = 'white';
    ctx.font = `${box}px ${font}`;
    ctx.fillText(`Score: ${score}`, box - 4, box);
    ctx.fillText(`Record: ${record}`, width - box * 6.25, box);
  }
};

// Function to show Game Over screen
const showGameOver = (): void => {
  clearCanvas();
  showScore();
  if (ctx) {
    ctx.fillText('Press r to restart', box * 5.5, height / 2 + box * 1.5);
    ctx.font = `bold ${box * 3}px ${font}`;
    ctx.fillText('Game Over!', box * 2.25, height / 2);
  }
};

// Function to stop the game
const stopGame = (): void => {
  clearInterval(game);
  setTimeout(showGameOver, 500);
};

// Main game loop
const loop = (): void => {
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

    // Increase difficulty by 5% for each apple eaten (up to a maximum of 250 score)
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

  // Draw the snake
  snake.forEach((elem, index) => {
    if (ctx) {
      ctx.fillStyle = index === 0 ? 'blue' : 'cyan';
      ctx.fillRect(elem.x, elem.y, box, box);
    }
  });
};

// Start the game loop
let game = setInterval(loop, ms);
document.addEventListener('keydown', controller);
