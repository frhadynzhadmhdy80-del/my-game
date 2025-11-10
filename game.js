const cat = document.getElementById("cat");
const coinDisplay = document.getElementById("coins");
const gameover = document.getElementById("gameover");
const gameArea = document.getElementById("gameArea");

let coins = 0;
let isJumping = false;
let isPlaying = false;
let moveInterval;
let obstacleInterval;
let bgPos = 0;

document.addEventListener("keydown", function(e) {
  if (e.code === "Space" && !isJumping && isPlaying) {
    jump();
  }
});

function jump() {
  isJumping = true;
  cat.style.bottom = "120px";
  setTimeout(() => {
    cat.style.bottom = "40px";
    isJumping = false;
  }, 600);
}

function startGame() {
  gameover.style.display = "none";
  gameArea.innerHTML = '<div id="cat"></div>';
  const newCat = document.getElementById("cat");
  newCat.style = cat.style.cssText;

  coins = 0;
  coinDisplay.textContent = coins;
  isPlaying = true;

  moveInterval = setInterval(() => {
    bgPos -= 2;
    gameArea.style.backgroundPosition = `${bgPos}px 0`;

    document.querySelectorAll(".obstacle").forEach(obstacle => {
      let left = parseInt(obstacle.style.left);
      obstacle.style.left = (left - 4) + "px";

      if (left < -50) {
        obstacle.remove();
        coins++;
        coinDisplay.textContent = coins;
      }
    });

    checkCollision();
  }, 50);

  obstacleInterval = setInterval(createObstacle, 2000);
}

function createObstacle() {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  obstacle.style.left = "600px";
  gameArea.appendChild(obstacle);
}

function checkCollision() {
  const catRect = document.getElementById("cat").getBoundingClientRect();

  document.querySelectorAll(".obstacle").forEach(obstacle => {
    const obsRect = obstacle.getBoundingClientRect();

    const overlapX = obsRect.left < catRect.right && obsRect.right > catRect.left;
    const overlapY = obsRect.bottom > catRect.top && obsRect.top < catRect.bottom;

    if (overlapX && overlapY) {
      clearInterval(moveInterval);
      clearInterval(obstacleInterval);
      isPlaying = false;
      gameover.style.display = "block";
    }
  });
}

startGame();
