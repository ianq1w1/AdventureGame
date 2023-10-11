const gravity = 1;
const ground = 400;
var canJump = true;

var blockCount = 0
var blockInGame = 0

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
    let currentNode = blocksLinkedList.head;
    while (currentNode !== null) {
      const block = currentNode.block;
      if (
        this.position.x < block.x + blockWidth &&
        this.position.x + 40 > block.x &&
        this.position.y + 40 > block.y &&
        this.position.y < block.y + blockHeight
      ) {
        return true;
      }
      currentNode = currentNode.next;
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

class Node {
  constructor(block) {
    this.block = block;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  append(block) {
    const newNode = new Node(block);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      return;
    }

    this.tail.next = newNode;
    this.tail = newNode;
  }
}

const blocksLinkedList = new LinkedList(); // Criando uma lista encadeada para armazenar os blocos

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const blockWidth = 50;
const blockHeight = 20;
const player = new Player();


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

function generateBlocks() {
  let x = 0;
  blocksLinkedList.head = null;
  blocksLinkedList.tail = null;

  while (x < canvas.width) {
    const type = Math.random() < 0.2 ? 'explosive' : Math.random() < 0.2 ? 'energy' : 'normal';
    const block = new Block(type, x, canvas.height - blockHeight);
    blocksLinkedList.append(block);
    x += blockWidth + Math.random() * 5;
  }
}

function drawBlocks() {
  let currentNode = blocksLinkedList.head;
  while (currentNode !== null) {
    const block = currentNode.block;
    ctx.fillStyle = block.type === 'explosive' ? 'red' : block.type === 'energy' ? 'green' : 'blue';
    ctx.fillRect(block.x, block.y, blockWidth, blockHeight);
    currentNode = currentNode.next;
  }
}

let lastBlockTouched = null;

function checkCollisions() {
  let energyBlock = null;
  let currentNode = blocksLinkedList.head;
  while (currentNode !== null) {
    const block = currentNode.block;
    if (
      player.position.x < block.x + blockWidth &&
      player.position.x + 40 > block.x &&
      player.position.y + 40 > block.y &&
      player.position.y < block.y + blockHeight
    ) {
      if (block.type === 'explosive') {
        player.hp -= 1;
        player.position.y -= player.jumpPower;
        player.position.x += player.jumpPower;
        console.log(player.hp);
        if (player.hp <= 0) {
          alert('Sua pontuação foi de: ' + blockCount + ' blocos');
          generateBlocks();
          player.position = { x: 50, y: 350 };
          player.hp = 10;
          blockCount = 0;
        }
      } else if (block.type === 'energy') {
        if (energyBlock !== block) {
          energyBlock = block;
          player.energy = Math.min(player.energy + 10, 50);
          console.log('Energia do jogador:', player.energy);
        }
      }
    }

    if (lastBlockTouched !== null) {
      if (player.position.x + 40 < lastBlockTouched.x) {
        lastBlockTouched = null;
      }
    }
    currentNode = currentNode.next;
  }
}


function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Aplica a gravidade
  player.applyGravity();

  drawBlocks();
  drawPlayer(); 

  currentNode = 0

  //corrigir salvamento do ultimo bloco pisado em relação ao canva, e á linked list 


  if (player.position.x > canvas.width) {
    // Save the last block and generate new blocks
    
    //blocks = [lastBlock];
    currentNode = currentNode.next
    blocksLinkedList.head = currentNode 
    generateBlocks();
    player.position.x = 50;
  }

  document.getElementById('hpInfo').textContent = 'HP: ' + player.hp;
  document.getElementById('blockCountInfo').textContent = 'Blocos pulados: ' + blockCount;

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
    blockCount++
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