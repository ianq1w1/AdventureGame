const gravity = 1;
const ground = 400;


class Block {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
  }
}

class Player {
  constructor() {
    this.hp = 10;
    this.energy = 0;
    this.position = { x: 50, y: 350 }; // Initial position
    this.jumpPower = 30;
  }

  isOnBlock() {
    for (const block of blocks) {
      if (
        this.position.x < block.x + blockWidth &&
        this.position.x + 40 > block.x &&
        this.position.y + 40 > block.y &&
        this.position.y < block.y + blockHeight
      ) {
        return true;
      }
    }
    return false;
  }

  applyGravity() {
    // Aplica a gravidade apenas se o jogador não estiver em cima de um bloco
    if (!this.isOnBlock() && this.position.y < ground) {
      this.position.y += gravity;
    } else if (this.position.y >= ground) {
      this.position.y = ground;  // Corrige a posição para estar no solo
    }
  }

  jump() {
    this.position.y -= this.jumpPower;
    this.position.x += this.jumpPower
    this.energy = Math.max(0, this.energy - 10);
  }

  superJump() {
    if (this.energy >= 50) {
      this.position.y -= this.jumpPower * 3;
      this.energy = 0;
    }
  }
}



const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const blockWidth = 50;
const blockHeight = 20;
const player = new Player();
let blocks = [];





function generateBlocks() {
  blocks = [];
  let x = 0;
  while (x < canvas.width) {
    const type = Math.random() < 0.2 ? 'explosive' : Math.random() < 0.2 ? 'energy' : 'normal';
    const block = new Block(type, x, canvas.height - blockHeight);
    blocks.push(block);
    x += blockWidth + Math.random() * 100;
  }
}

function drawBlocks() {
  for (const block of blocks) {
    ctx.fillStyle = block.type === 'explosive' ? 'red' : block.type === 'energy' ? 'green' : 'blue';
    ctx.fillRect(block.x, block.y, blockWidth, blockHeight);
  }
}



function drawPlayer() {
  var horseImage = new Image();
  horseImage.src = 'imgs/cavalo.png';
  if (horseImage.complete) {
    ctx.drawImage(horseImage, player.position.x, player.position.y, 40, 40);

  } else {
    ctx.fillStyle = 'black'; //caso o cavalo não carregue
    ctx.fillRect(player.position.x, player.position.y, 40, 40);
  }
}




function checkCollisions() {
  for (const block of blocks) {
    if (
      player.position.x < block.x + blockWidth &&
      player.position.x + 40 > block.x &&
      player.position.y + 40 > block.y &&
      player.position.y < block.y + blockHeight
    ) {
      if (block.type === 'explosive') {
        player.hp -= 1;
        if (player.hp <= 0) {
          alert('Game over! Your score: ' + blocks.length);
          generateBlocks();
          player.position = { x: 50, y: 350 };
          player.hp = 10;
        }
      } else if (block.type === 'energy') {
        player.energy = Math.min(player.energy + 10, 50);
      }
    }
  }
}




function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Aplica a gravidade
  player.applyGravity();

  drawBlocks();
  drawPlayer();

  if (player.position.x > canvas.width) {
    // Save the last block and generate new blocks
    const lastBlock = blocks[blocks.length - 1];
    blocks = [lastBlock];
    generateBlocks();
    player.position.x = 50;
  }

  checkCollisions();

  requestAnimationFrame(gameLoop);
}
generateBlocks();
gameLoop();


document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    if (player.energy >= 50) {
      player.superJump();
    } else {
      player.jump();
    }
  }
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowDown' && event.code === 'Space') {
    player.superJump();
  }
});



// Apartir daqui é relacionado a Musica
const minhaMusica = document.getElementById('minhaMusica');
const playPauseButton = document.getElementById('playPauseButton');

playPauseButton.addEventListener('click', () => {
  if (minhaMusica.paused) {
    minhaMusica.play();
    playPauseButton.textContent = '⏸️ Pausar';
  } else {
    minhaMusica.pause();
    playPauseButton.textContent = '▶️ Reproduzir';
  }
});