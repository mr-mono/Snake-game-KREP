// Prevent page refresh on mobile (pull-to-refresh)
if ('ontouchstart' in window || navigator.maxTouchPoints) {
    window.addEventListener('touchmove', function(event) {
        event.preventDefault(); // Disable pull-to-refresh behavior
    }, { passive: false });
}

// Game setup
const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");

// Set base grid size (normal size without scaling)
const baseGridSize = 20;

// Define initial game speed (in milliseconds)
const initialGameSpeed = 150; // Initial speed for the game loop
let gameSpeed = initialGameSpeed; // Initial game speed

// Calculate canvas size based on screen size
const calculateCanvasSize = () => {
  const maxWidth = window.innerWidth * 0.9; // 90% of the screen width
  const maxHeight = window.innerHeight * 0.7; // 70% of the screen height

  // Set canvas size with a maximum limit, maintaining the square aspect ratio
  const canvasSize = Math.min(maxWidth, maxHeight);

  // Set the canvas width and height
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  // Adjust grid size based on the canvas size
  return Math.floor(canvasSize / 20); // Scale grid size to fit the screen
};

let gridSize = calculateCanvasSize();  // Initial grid size calculation based on screen

let score = 1;
let gameOver = false;  // Flag to check if the game is over

// Snake initial position and body (start slightly above the bottom)
let snake = [{ 
  x: Math.floor(canvas.width / 2 / gridSize) * gridSize, 
  y: Math.floor(canvas.height * 0.7 / gridSize) * gridSize // Start 70% down the canvas
}];
let direction = { x: 0, y: -gridSize };  // Initial movement direction is UP

// Food position
let food = { x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize, y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize };

// Load the snake and food images
const snakeImage = new Image();
snakeImage.src = "snake.png";  // Ensure snake.png is the correct size
const foodImage = new Image();
foodImage.src = "food.png";    // Ensure food.png is the correct size

// Variables for touch tracking
let touchX = 0;
let touchY = 0;

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
  document.getElementById("score").textContent = `solami ${score}`;  // Display "solami" with the score
}

function moveSnake() {
  if (gameOver) return;  // If the game is over, don't move the snake

  let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Check for collision with walls
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
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
    score += 1;  // Increase score by 1
    generateFood();  // Generate new food after eating
  } else {
    snake.pop();  // Remove the last segment if no food was eaten
  }
}

function generateFood() {
  // Ensure food is placed on the grid (multiples of gridSize)
  food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
  food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;

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

// Update direction based on touch position
function updateSnakeDirection() {
  const snakeHead = snake[0];

  // Convert touch position to canvas coordinates
  const canvasRect = canvas.getBoundingClientRect();
  const touchCanvasX = touchX - canvasRect.left;
  const touchCanvasY = touchY - canvasRect.top;

  // Calculate the difference between touch and snake head
  const deltaX = touchCanvasX - (snakeHead.x + gridSize / 2);
  const deltaY = touchCanvasY - (snakeHead.y + gridSize / 2);

  // Update direction based on the touch position
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0 && direction.x === 0) {
      direction = { x: gridSize, y: 0 }; // Move RIGHT
    } else if (deltaX < 0 && direction.x === 0) {
      direction = { x: -gridSize, y: 0 }; // Move LEFT
    }
  } else {
    if (deltaY > 0 && direction.y === 0) {
      direction = { x: 0, y: gridSize }; // Move DOWN
    } else if (deltaY < 0 && direction.y === 0) {
      direction = { x: 0, y: -gridSize }; // Move UP
    }
  }
}

// Touch events for mobile controls
canvas.addEventListener("touchstart", (e) => {
  touchX = e.touches[0].clientX;
  touchY = e.touches[0].clientY;
});

canvas.addEventListener("touchmove", (e) => {
  touchX = e.touches[0].clientX;
  touchY = e.touches[0].clientY;
});

// Handle keyboard input for snake direction
document.addEventListener('keydown', (e) => {
    const newDirection = { x: direction.x, y: direction.y }; // Copy current direction

    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) newDirection.x = 0, newDirection.y = -gridSize;
            break;
        case 'ArrowDown':
            if (direction.y === 0) newDirection.x = 0, newDirection.y = gridSize;
            break;
        case 'ArrowLeft':
            if (direction.x === 0) newDirection.x = -gridSize, newDirection.y = 0;
            break;
        case 'ArrowRight':
            if (direction.x === 0) newDirection.x = gridSize, newDirection.y = 0;
            break;
    }

    // Check if the new direction causes a self-collision
    const newHead = {
        x: snake[0].x + newDirection.x,
        y: snake[0].y + newDirection.y
    };

    // Check if the new head position is not colliding with the body
    if (!snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        direction = newDirection; // Update direction if safe
    }
});



// Reset the game
function resetGame() {
  if (gameLoopID) {
    clearTimeout(gameLoopID); // Stop any existing game loop
  }

  gameOver = false;
  gameSpeed = initialGameSpeed; // Reset the game speed
  document.getElementById("game-over-container").style.display = "none"; // Hide the game over message
  
  // Reset snake position and direction to start further down and move up
  snake = [{ 
    x: Math.floor(canvas.width / 2 / gridSize) * gridSize, 
    y: Math.floor(canvas.height * 0.7 / gridSize) * gridSize // Start 70% down the canvas
  }];
  direction = { x: 0, y: -gridSize }; // Initial direction is UP
  score = 1; // Reset score to 1
  
  generateFood(); // Generate new food
  gameLoop(); // Restart the game loop with the initial game speed
}

// Game loop function
let gameLoopID;
function gameLoop() {
  if (!gameOver) {
   // updateSnakeDirection(); // Adjust direction based on touch
    moveSnake();
    draw();
    gameLoopID = setTimeout(gameLoop, gameSpeed); // Schedule next iteration
  }
}

// Add this to ensure that the game starts properly when the window is resized
window.addEventListener('resize', () => {
  gridSize = calculateCanvasSize(); // Recalculate grid size on resize
});

// Call this to generate the initial food and start the loop
generateFood();
gameLoop();

// Ensure the "Play Again" button calls the resetGame function
document.getElementById("reset-button").onclick = resetGame; // Add an event listener to the button
