// Game setup
const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const gridSize = 20; // Normal grid size
const scaledSize = gridSize * 1.6; // 30% bigger size
const canvasSize = 520;    // Game window size
let score = 0;
let gameOver = false;  // Flag to check if the game is over

// Snake initial position and body
let snake = [{ x: 130, y: 130 }];
let direction = { x: scaledSize, y: 0 };

// Food position
let food = { x: 260, y: 260 };

// Load the snake and food images
const snakeImage = new Image();
snakeImage.src = "snake.png";  // Make sure your snake.png is 30% larger
const foodImage = new Image();
foodImage.src = "food.png";    // Make sure your food.png is 30% larger

// Game functions
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

  // Draw the snake (with the new larger size)
  for (let i = 0; i < snake.length; i++) {
    ctx.drawImage(snakeImage, snake[i].x, snake[i].y, scaledSize, scaledSize);
  }

  // Draw the food (with the new larger size)
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
  snake = [{ x: 130, y: 130 }];
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
  gameLoopID = setTimeout(gameLoop, 100);  // Repeat every 100ms (controls speed)
}

// Start the game
generateFood();
gameLoop();
