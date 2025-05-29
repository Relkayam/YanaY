const turtle = document.querySelector('.turtle');
const obstacle = document.querySelector('.obstacle');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOver');
const restartButton = document.getElementById('restartButton');

let score = 0;
let isJumping = false;
let isGameOver = false;
let animationFrame = null;
let turtlePosition = 100; // Starting X position
let moveSpeed = 5; // Movement speed for arrow keys
let jumpForwardSpeed = 3; // Forward movement speed during jump
let isMovingForward = false;
let isMovingBackward = false;
let obstacleSpeed = 5; // Initial obstacle speed
let speedIncreaseInterval = null;

// Speed increase function
function increaseSpeed() {
    obstacleSpeed += 2; // Increase speed by 2 pixels per frame every 20 seconds
    console.log('Speed increased to:', obstacleSpeed);
}

// Handle keyboard controls
function handleKeyDown(e) {
    if (isGameOver) return;

    switch(e.code) {
        case 'Space':
            if (!isJumping) {
                jump();
            }
            break;
        case 'ArrowRight':
            isMovingForward = true;
            break;
        case 'ArrowLeft':
            isMovingBackward = true;
            break;
    }
}

function handleKeyUp(e) {
    switch(e.code) {
        case 'ArrowRight':
            isMovingForward = false;
            break;
        case 'ArrowLeft':
            isMovingBackward = false;
            break;
    }
}

// Jump function
function jump() {
    isJumping = true;
    turtle.classList.add('jumping');
    
    // Forward movement during jump
    let jumpInterval = setInterval(() => {
        if (!isGameOver && isJumping) {
            turtlePosition += jumpForwardSpeed;
            updateTurtlePosition();
        }
    }, 16);

    setTimeout(() => {
        if (!isGameOver) {
            turtle.classList.remove('jumping');
            isJumping = false;
            clearInterval(jumpInterval);
        }
    }, 500);
}

// Update turtle position
function updateTurtlePosition() {
    // Keep turtle within screen bounds
    if (turtlePosition < 0) turtlePosition = 0;
    if (turtlePosition > window.innerWidth - 100) turtlePosition = window.innerWidth - 100;
    
    turtle.style.left = `${turtlePosition}px`;
}

// Move turtle based on arrow keys
function moveTurtle() {
    if (isMovingForward) {
        turtlePosition += moveSpeed;
    }
    if (isMovingBackward) {
        turtlePosition -= moveSpeed;
    }
    updateTurtlePosition();
    
    if (!isGameOver) {
        requestAnimationFrame(moveTurtle);
    }
}

// Move obstacle
function moveObstacle() {
    let position = window.innerWidth;
    
    function move() {
        if (position < -50) {
            // Obstacle passed successfully
            position = window.innerWidth;
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
        } else {
            position -= obstacleSpeed; // Use the variable speed
        }
        
        obstacle.style.right = `${window.innerWidth - position}px`;

        // Collision detection
        const turtleRect = turtle.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            turtleRect.right > obstacleRect.left &&
            turtleRect.left < obstacleRect.right &&
            turtleRect.bottom > obstacleRect.top &&
            turtleRect.top < obstacleRect.bottom &&
            !isJumping
        ) {
            gameOver();
            return;
        }

        if (!isGameOver) {
            animationFrame = requestAnimationFrame(move);
        }
    }

    move();
}

// Game over function
function gameOver() {
    isGameOver = true;
    gameOverScreen.classList.remove('hidden');
    
    // Stop all animations and intervals
    if (animationFrame) {
        cancelAnimationFrame(animationFrame);
    }
    if (speedIncreaseInterval) {
        clearInterval(speedIncreaseInterval);
    }
    
    // Remove jumping class if game ends during jump
    turtle.classList.remove('jumping');
    
    // Stop head and tail animations
    document.querySelector('.head').style.animation = 'none';
    document.querySelector('.tail').style.animation = 'none';
}

// Restart game function
function restartGame() {
    isGameOver = false;
    isJumping = false;
    isMovingForward = false;
    isMovingBackward = false;
    score = 0;
    turtlePosition = 100;
    obstacleSpeed = 5; // Reset obstacle speed
    scoreDisplay.textContent = 'Score: 0';
    gameOverScreen.classList.add('hidden');
    obstacle.style.right = '-50px';
    updateTurtlePosition();
    
    // Restore animations
    document.querySelector('.head').style.animation = 'head 0.5s alternate infinite';
    document.querySelector('.tail').style.animation = 'tail 0.5s alternate infinite';
    
    // Start speed increase interval
    if (speedIncreaseInterval) {
        clearInterval(speedIncreaseInterval);
    }
    speedIncreaseInterval = setInterval(increaseSpeed, 20000); // Increase speed every 20 seconds
    
    // Start movements
    moveObstacle();
    moveTurtle();
}

// Event listeners
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
restartButton.addEventListener('click', restartGame);

// Start the game
moveObstacle();
moveTurtle();
// Start speed increase interval
speedIncreaseInterval = setInterval(increaseSpeed, 20000); 