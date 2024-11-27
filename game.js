// Game setup
const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");

// Set grid size and scale factor for the images (100% bigger)
const gridSize = 20; // Base grid size
const scaledSize = gridSize * 2;  // 100% bigger size (40px if gridSize is 20)

// Increased canvas size
const canvasSize = 640;  // Increased canvas size (640px x 640px)
canvas.width = canvasSize;
canvas.height = canvasSize;

let score = 0;
let gameOver = false;  // Flag to check if the game is over

// Snake initial position and body
let snake = [{ x: 260, y: 260 }];
let direction = { x: scaledSize, y: 0 };

// Food position
let food = { x: 300, y: 300 };

// Load the snake and food images
const snakeImage = new Image();
snakeImage.src = "snake.png";  // Ensure snake.png is big enough for scaling
const foodImage = new Image();
foodImage.src = "food.png";    // Ensure food.png is big enough for scaling

// Game functions
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Draw the snake (with the new 100% larger size)
  for (let i = 0; i < snake.length; i++) {
    ctx.drawImage(snakeImage, snake[i].x, snake[i].y, scaledSize, scaledSize);
  }

  // Draw the food (with the new 100% larger size)
  ctx.drawImage(foodImage, food.x, food.y, scaledSize, scaledSize);

  // Update the score display
  document.getElementById("score").textContent = score;
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
    generateFood();
  } else {
    snake.pop();  // Remove the last segment if no food was eaten
  }
}

function generateFood() {
  food.x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
  food.y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
}

function endGame() {
  gameOver = true;  // Set the gameOver flag to true
  clearTimeout(gameLoopID);  // Stop the game loop
  document.getElementById("game-over-container").style.display = "block"; // Show game over message and button
}

// Event listener for key presses (arrow keys)
document.addEventListener("keydown", (e) => {
  if (gameOver) return;  // Don't accept new key presses after the game is over
  if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -scaledSize };
  if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: scaledSize };
  if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -scaledSize, y: 0 };
  if (e.key === "ArrowRight" && direction.x === 0) direction = { x: scaledSize, y: 0 };
});

// Reset the game
function resetGame() {
  gameOver = false;
  document.getElementById("game-over-container").style.display = "none";  // Hide the game over message
  snake = [{ x: 260, y: 260 }];
  direction = { x: scaledSize, y: 0 };
  score = 0;
  generateFood();
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
