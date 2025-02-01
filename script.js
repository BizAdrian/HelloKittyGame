let gameState = {
  isRunning: true,
  obstacleIntervals: []
};

const CONTAINER_WIDTH = 800;
let dynamicGap = 250;
let gameSpeed = 5;
let lastSpeedAdjustedScore = 0;

const helloKitty = document.getElementById('hello-kitty');
const obstacles = [
  document.getElementById('lavadora'),
  document.getElementById('lavavajillas'),
  document.getElementById('universidad')
];
const scoreElement = document.getElementById('score');
const gameContainer = document.getElementById('game-container');
const backgroundMusic = document.getElementById('background-music');

// Variables for jump handling
let isJumping = false,
  jumpHeight = 130,
  gravity = 5,
  position = 50,
  score = 0;

// Detect jump key press (space or up arrow)
document.addEventListener('keydown', event => {
  if ((event.code === 'Space' || event.code === 'ArrowUp') && !isJumping && gameState.isRunning) {
    jump();
    startMusic(); // Inicia la música al saltar
  }
});

// Detect touch for mobile devices
gameContainer.addEventListener('touchstart', () => {
  if (!isJumping && gameState.isRunning) {
    jump();
    startMusic(); // Inicia la música al saltar
  }
});

function jump() {
  isJumping = true;
  let upInterval = setInterval(() => {
    if (position >= jumpHeight) {
      clearInterval(upInterval);
      let downInterval = setInterval(() => {
        if (position <= 50) {
          clearInterval(downInterval);
          isJumping = false;
        }
        position -= gravity;
        helloKitty.style.bottom = `${position}px`;
      }, 20);
    }
    position += gravity;
    helloKitty.style.bottom = `${position}px`;
  }, 20);
}

function startMusic() {
  if (backgroundMusic.paused) {
    backgroundMusic.loop = true;
    backgroundMusic.play();
  }
}

function stopMusic() {
  if (!backgroundMusic.paused) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; // Reinicia la música al principio
  }
}

// Generic function to move an obstacle
function moveObstacle(obstacle, index) {
  let position = CONTAINER_WIDTH + (index * dynamicGap);
  const interval = setInterval(() => {
    if (!gameState.isRunning) return;

    position -= gameSpeed;
    obstacle.style.left = `${position}px`;

    // Reiniciar posición con variación aleatoria
    if (position < -50) {
      position = CONTAINER_WIDTH + dynamicGap + Math.random() * 200; // Aleatoriedad en el espacio
      score++;
      scoreElement.textContent = `Puntaje: ${score}`;
      adjustGameSpeed();
    }

    checkCollision(obstacle, position);
  }, 20);

  return interval;
}

// Ajustar velocidad y frecuencia
function adjustGameSpeed() {
  if (score % 5 === 0 && score !== lastSpeedAdjustedScore) {
    // Aumentar velocidad pero reducir espacio (más dificultad)
    gameSpeed += 0.7;
    dynamicGap = Math.max(150, dynamicGap - 20); // Nunca menos de 150px
    lastSpeedAdjustedScore = score;
    
    const currentPositions = obstacles.map(() => CONTAINER_WIDTH + dynamicGap + Math.random() * 200);
    gameState.obstacleIntervals.forEach(interval => clearInterval(interval));
    gameState.obstacleIntervals = obstacles.map((obstacle, index) => {
      obstacle.style.left = `${currentPositions[index]}px`;
      return moveObstacle(obstacle, index);
    });
  }
}

function checkCollision(obstacle, obstaclePosition) {
  const kittyBottom = parseInt(helloKitty.style.bottom) || 0;
  const kittyLeft = parseInt(window.getComputedStyle(helloKitty).left);
  const kittyWidth = helloKitty.offsetWidth;
  const obstacleWidth = obstacle.offsetWidth;

  if (
    obstaclePosition < kittyLeft + kittyWidth &&
    obstaclePosition + obstacleWidth > kittyLeft &&
    kittyBottom <= 50
  ) {
    gameOver();
  }
}

function gameOver() {
  gameState.isRunning = false;
  gameState.obstacleIntervals.forEach(interval => clearInterval(interval));
  stopMusic();

  gameContainer.style.filter = 'blur(5px)';
  gameContainer.style.pointerEvents = 'none';

  // Game Over Text
  const gameOverText = document.createElement('div');
  gameOverText.className = 'game-over-text';
  gameOverText.textContent = 'Game Over Awosia :P';
  document.body.appendChild(gameOverText);

  // Final Score
  const finalScore = document.createElement('div');
  finalScore.className = 'final-score'; 
  finalScore.textContent = `Tu puntuación: ${score}`;
  document.body.appendChild(finalScore);

  // Restart Button
  const restartButton = document.createElement('button');
  restartButton.className = 'restart-button';
  restartButton.textContent = 'Reiniciar';
  document.body.appendChild(restartButton);

  // Restart logic
  restartButton.addEventListener('click', () => {
    document.body.removeChild(restartButton);
    document.body.removeChild(finalScore);
    document.body.removeChild(gameOverText);
    gameContainer.style.filter = 'none';
    gameContainer.style.pointerEvents = 'auto';
    resetGame();
  });
}

function resetGame() {
  dynamicGap = 300;
  gameState.obstacleIntervals.forEach(interval => clearInterval(interval));
  gameState.obstacleIntervals = [];

  obstaclePositions = [600, 900, 1200]; // Reinicia posiciones iniciales
  score = 0;
  position = 50;
  gameSpeed = 5; // Reinicia la velocidad
  gameState.isRunning = true;

  obstacles.forEach((obstacle, index) => {
    obstacle.style.left = `${obstaclePositions[index]}px`;
  });
  helloKitty.style.bottom = '50px';
  scoreElement.textContent = `Puntaje: ${score}`;

  startMusic();
  gameState.obstacleIntervals = obstacles.map((obstacle, index) => moveObstacle(obstacle, index));
}

// Start the game
gameState.obstacleIntervals = obstacles.map((obstacle, index) => moveObstacle(obstacle, index));