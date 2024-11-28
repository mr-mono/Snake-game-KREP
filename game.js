// Game setup
const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");

// Set grid size (normal size without scaling)
const gridSize = 20; // Base grid size (each square of the grid is 20px)

// Increased canvas size (size remains the same)
const canvasSize = 640;  // Increased canvas size (640px x 640px)
canvas.width = canvasSize;
canvas.height = canvasSize;

let score = 0;
let gameOver = false;  // Flag to check if the game is over

// Snake initial position and body (start slightly above the bottom)
let snake = [{ x: 260, y: canvas.height - (2 * gridSize) }];  // Snake starts slightly higher from the bottom
let direction = { x: 0, y: -gridSize };  // Initial movement direction is UP

// Food position
let food = { x: 300, y: 300 };  // Initial food position

// Load the snake and food images
const snakeImage = new Image();
snakeImage.src = "snake.png";  // Ensure snake.png is the correct size
const foodImage = new Image();
foodImage.src = "food.png";    // Ensure food.png is the correct size

// Game functions
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Draw the snake (without resizing the image)
  for (let i = 0; i < snake.length; i++) {
    ctx.drawImage(snakeImage, snake[i].x, snake[i].y, gridSize, gridSize);
  }

  // Draw the food (without resizing the image)
  ctx.drawImage(foodImage, food.x, food.y, gridSize, gridSize);

  // Update the score display
  document.getElementById("score").textContent = `Score: ${score}`;
}

function moveSnake() {
  if (gameOver) return;  // If the game is over, don't move the snake

  let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check for collision with walls
  if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
    endGame(); // Game over if the snake hits the wall
  }

  // Check for collision with itself
  for (let i = 0; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame(); // Game over if the snake collides with itself
    }
  }

  // Add the new head to the snake array
  snake.unshift(head);

  // Check if the snake has eaten the food
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    generateFood();  // Generate new food after eating
  } else {
    snake.pop();  // Remove the last segment if no food was eaten
  }
}

function generateFood() {
  // Ensure food is placed on the grid (multiples of gridSize)
  food.x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
  food.y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;

  // Prevent food from appearing where the snake is
  for (let i = 0; i < snake.length; i++) {
    if (food.x === snake[i].x && food.y === snake[i].y) {
      generateFood();  // Try again if food overlaps with the snake
    }
  }
}

function endGame() {
  gameOver = true;  // Set the gameOver flag to true
  clearTimeout(gameLoopID);  // Stop the game loop
  document.getElementById("game-over-container").style.display = "block"; // Show game over message and button
}

// Event listener for key presses (arrow keys)
document.addEventListener("keydown", (e) => {
  if (gameOver) return;  // Don't accept new key presses after the game is over
  if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -gridSize };
  if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: gridSize };
  if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -gridSize, y: 0 };
  if (e.key === "ArrowRight" && direction.x === 0) direction = { x: gridSize, y: 0 };
});
// Touch control variables
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Touch events for mobile controls
canvas.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

canvas.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].clientX;
  touchEndY = e.changedTouches[0].clientY;
  
  handleTouchSwipe();
});

function handleTouchSwipe() {
  // Calculate swipe direction
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  // If swipe is mostly horizontal
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0 && direction.x === 0) {  // Swipe right
      direction = { x: gridSize, y: 0 };
    } else if (deltaX < 0 && direction.x === 0) {  // Swipe left
      direction = { x: -gridSize, y: 0 };
    }
  }
  // If swipe is mostly vertical
  else {
    if (deltaY > 0 && direction.y === 0) {  // Swipe down
      direction = { x: 0, y: gridSize };
    } else if (deltaY < 0 && direction.y === 0) {  // Swipe up
      direction = { x: 0, y: -gridSize };
    }
  }
}
// Reset the game
function resetGame() {
  gameOver = false;
  document.getElementById("game-over-container").style.display = "none";  // Hide the game over message
  
  // Reset snake position (slightly higher from the bottom) and direction to UP
  snake = [{ x: 260, y: canvas.height - (2 * gridSize) }];
  direction = { x: 0, y: -gridSize };  // Initial direction is UP
  score = 0;  // Reset score
  generateFood();  // Generate new food
  gameLoop();  // Restart the game loop
}

// Game loop
let gameLoopID;
function gameLoop() {
  moveSnake();
  draw();
  gameLoopID = setTimeout(gameLoop, 150);  // Increase the interval to slow down snake movement (150ms)
}

// Start the game
generateFood();
gameLoop();
