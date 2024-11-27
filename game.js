// Game setup
const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const gridSize = 20 * 1.3; // 30% bigger
const canvasSize = 520;    // 30% bigger canvas size
let score = 0;

// Snake initial position and body
let snake = [{ x: 130, y: 130 }]; // Adjust starting position if necessary
let direction = { x: gridSize, y: 0 };

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
    ctx.drawImage(snakeImage, snake[i].x, snake[i].y, gridSize * 1.3, gridSize * 1.3);
  }

  // Draw the food (with the new larger size)
  ctx.drawImage(foodImage, food.x, food.y, gridSize * 1.3, gridSize * 1.3);

  // Update the score display
  document.getElementById("score").textContent = score;
}

function moveSnake() {
  let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check for collision with walls
  if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
    resetGame();
  }

  // Check for collision with itself
  for (let i = 0; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
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

function resetGame() {
  snake = [{ x: 130, y: 130 }];
  direction = { x: gridSize, y: 0 };
  score = 0;
  generateFood();
}

// Event listener for key presses (arrow keys)
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction.y === 0) direction = { x: 0, y: -gridSize };
  if (e.key === "ArrowDown" && direction.y === 0) direction = { x: 0, y: gridSize };
  if (e.key === "ArrowLeft" && direction.x === 0) direction = { x: -gridSize, y: 0 };
  if (e.key === "ArrowRight" && direction.x === 0) direction = { x: gridSize, y: 0 };
});

// Game loop
function gameLoop() {
  moveSnake();
  draw();
  setTimeout(gameLoop, 100);  // Repeat every 100ms (controls speed)
}

// Start the game
generateFood();
gameLoop();
