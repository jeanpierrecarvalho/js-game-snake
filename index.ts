import './style.css';

class SnakeGame {
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  font: string;
  box: number;
  width: number;
  height: number;
  snake: { x: number; y: number }[];
  food: { x: number; y: number };
  ms: number;
  score: number;
  record: number;
  dir: string;
  game: any;

  constructor() {
    this.canvas = document.querySelector('#board');
    this.ctx = this.canvas?.getContext('2d');
    this.font = 'Consolas, monospace';
    this.box = 20;
    this.width = this.box * 21;
    this.height = this.box * 21;
    this.snake = [
      { x: (this.width - this.box) / 2, y: (this.height - this.box) / 2 },
    ];
    this.food = {
      x: Math.floor(Math.random() * 20 + 1) * this.box,
      y: Math.floor(Math.random() * 20 + 1) * this.box,
    };
    this.ms = 120;
    this.score = 0;
    this.record = 0;
    this.dir = 'none';
    this.game = setInterval(this.loop.bind(this), this.ms);
    document.addEventListener('keydown', this.controller.bind(this));
  }

  clearCanvas(): void {
    if (this.ctx) {
      this.ctx.fillStyle = 'gray';
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }

  updateAppleCoordinates(): void {
    this.food.x = Math.floor(Math.random() * 20 + 1) * this.box;
    this.food.y = Math.floor(Math.random() * 20 + 1) * this.box;
  }

  spawnApple(): void {
    if (this.ctx) {
      if (
        this.snake.some(
          (elem) => elem.x === this.food.x && elem.y === this.food.y
        )
      ) {
        this.updateAppleCoordinates();
        this.spawnApple();
      } else {
        this.ctx.fillStyle = 'red';
        this.ctx.fillRect(this.food.x, this.food.y, this.box, this.box);
      }
    }
  }

  showScore(): void {
    if (this.ctx) {
      this.ctx.fillStyle = 'white';
      this.ctx.font = `${this.box}px ${this.font}`;
      this.ctx.fillText(`Score: ${this.score}`, this.box - 4, this.box);
      this.ctx.fillText(
        `Record: ${this.record}`,
        this.width - this.box * 6.25,
        this.box
      );
    }
  }

  showGameOver(): void {
    this.clearCanvas();
    this.showScore();
    if (this.ctx) {
      this.ctx.fillText(
        'Press r to restart',
        this.box * 5.5,
        this.height / 2 + this.box * 1.5
      );
      this.ctx.font = `bold ${this.box * 3}px ${this.font}`;
      this.ctx.fillText('Game Over!', this.box * 2.25, this.height / 2);
    }
  }

  stopGame(): void {
    clearInterval(this.game);
    setTimeout(this.showGameOver.bind(this), 500);
  }

  controller(e: KeyboardEvent): void {
    if (e.key === 'r') {
      this.restart();
    } else if (
      e.key.startsWith('Arrow') &&
      this.dir !== e.key.substring(5).toLowerCase()
    ) {
      this.dir = e.key.substring(5).toLowerCase();
    }
  }

  restart(): void {
    clearInterval(this.game);
    this.snake = [
      { x: (this.width - this.box) / 2, y: (this.height - this.box) / 2 },
    ];
    this.ms = 120;
    this.dir = 'none';
    this.score = 0;
    this.game = setInterval(this.loop.bind(this), this.ms);
  }

  loop(): void {
    this.clearCanvas();
    this.showScore();
    this.spawnApple();

    let [px, py] = [this.snake[0].x, this.snake[0].y];
    let [ax, ay] = [this.food.x, this.food.y];

    if (this.dir === 'left') px -= this.box;
    else if (this.dir === 'up') py -= this.box;
    else if (this.dir === 'right') px += this.box;
    else if (this.dir === 'down') py += this.box;

    if (px >= this.width) px = 0;
    if (px < 0) px = this.width;
    if (py >= this.height) py = 0;
    if (py < 0) py = this.height;

    if (px === ax && py === ay) {
      this.score += 10;

      if (this.score <= 250) {
        this.ms = Math.round(this.ms * 0.95);
      }

      this.updateAppleCoordinates();
      clearInterval(this.game);
      this.game = setInterval(this.loop.bind(this), this.ms);
    } else {
      this.snake.pop();
    }

    if (this.snake.some((elem) => px === elem.x && py === elem.y)) {
      this.stopGame();
    } else {
      this.snake.unshift({ x: px, y: py });
    }

    this.snake.forEach((elem, index) => {
      if (this.ctx) {
        this.ctx.fillStyle = index === 0 ? 'blue' : 'cyan';
        this.ctx.fillRect(elem.x, elem.y, this.box, this.box);
      }
    });
  }
}

new SnakeGame();
