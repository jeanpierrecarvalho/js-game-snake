// Import stylesheets
import './style.css';

const controller = (event: KeyboardEvent) => {
  if (event.key === 'r') console.log('Restarting the game...');
  else if (event.key === 'ArrowRight') console.log('Arrow Right');
  else if (event.key === 'ArrowLeft') console.log('Arrow Left');
  else if (event.key === 'ArrowUp') console.log('Arrow Up');
  else if (event.key === 'ArrowDown') console.log('Arrow Down');
};

document.addEventListener('keydown', controller);
