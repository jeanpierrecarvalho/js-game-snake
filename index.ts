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

const controller = (event: KeyboardEvent) => {
  if (event.key === 'r') console.log('Restarting the game...');
  else if (event.key === 'ArrowRight') console.log('Arrow Right');
  else if (event.key === 'ArrowLeft') console.log('Arrow Left');
  else if (event.key === 'ArrowUp') console.log('Arrow Up');
  else if (event.key === 'ArrowDown') console.log('Arrow Down');
};

const clearCanvas = () => {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
};

const loop = () => {
  clearCanvas();

  let [px, py] = [snake[0].x, snake[0].y];

  px -= box;

  snake.unshift({ x: px, y: py });

  snake.forEach((elem, index) => {
    ctx.fillStyle = index === 0 ? 'lime' : 'green';
    ctx.fillRect(elem.x, elem.y, box, box);
  });
};

let game = setInterval(loop, ms);
document.addEventListener('keydown', controller);
