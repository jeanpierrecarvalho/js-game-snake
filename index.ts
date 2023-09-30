// Import stylesheets
import './style.css';

const canvas: HTMLCanvasElement = document.querySelector('#board');
const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

const box = 20;
const width = box * 21;
const height = box * 21;

const initialPoint = {
  x: (width - box) / 2,
  y: (height - box) / 2,
};

const snake = [initialPoint];

let ms = 120;
let dir = 'none';

const controller = (e) => {
  if (e.keyCode === 82) dir = 'none';
  else if (e.keyCode === 37 && dir !== 'right') dir = 'left';
  else if (e.keyCode === 38 && dir !== 'down') dir = 'up';
  else if (e.keyCode === 39 && dir !== 'left') dir = 'right';
  else if (e.keyCode === 40 && dir !== 'up') dir = 'down';
};

const clearCanvas = () => {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
};

const loop = () => {
  clearCanvas();

  // Setting the snake position
  let [px, py] = [snake[0].x, snake[0].y];

  if (dir === 'left') px -= box;
  else if (dir === 'up') py -= box;
  else if (dir === 'right') px += box;
  else if (dir === 'down') py += box;

  // Boundaries
  if (px >= width) px = 0;
  if (px < 0) px = width;
  if (py >= height) py = 0;
  if (py < 0) py = height;

  snake.unshift({ x: px, y: py });

  // Drawing the snake
  snake.forEach((elem, index) => {
    ctx.fillStyle = index === 0 ? 'lime' : 'green';
    ctx.fillRect(elem.x, elem.y, box, box);
  });
};

let game = setInterval(loop, ms);
document.addEventListener('keydown', controller);
