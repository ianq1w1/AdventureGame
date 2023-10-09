const gravity = 1;
const ground = 400;
var canJump = true;

var blockCount = 0



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
    this.jumpPower = 50;
  }

  isOnBlock() {
    for (const block of blocks) {
      if (
        this.position.x < block.x + blockWidth &&
        this.position.x + 40 > block.x &&
        this.position.y + 40 > block.y &&
        this.position.y < block.y + blockHeight
      ) {
        blockCount++
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
    this.position.x += this.jumpPower;

     this.energy = Math.max(0, this.energy - 10);
  }

  superJump() {
    if (this.energy >= 50) {
      this.position.y -= this.jumpPower * 3;
      this.position.x += this.jumpPower * 3;
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
    x += blockWidth + Math.random() * 5;
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
          alert('sua pontuação foi de:' + blockCount + 'blocos')
          generateBlocks();
          player.position = { x: 50, y: 350 };
          player.hp = 10;
        }
      } else if (block.type === 'energy') {
        //player.energy += 10
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



/*function enableJump() {
  canJump = true;
}*/

document.addEventListener('keyup', (event) => {
  if (event.code === 'Space' && canJump) {
    if(player.isOnBlock()){
    if (player.energy >= 50) {
      if(player.isOnBlock())
      player.superJump();
    } else {
      player.jump();
    }
  }
    //canJump = false; // Desabilita o salto temporariamente
    //setTimeout(enableJump, 500); // Habilita o salto após 1 segundo
  }
});

/*document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowDown' && event.code === 'Space') {
    player.superJump();
  }
});*/



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