const cat = document.getElementById("cat");
const coinDisplay = document.getElementById("coins");
const shopCoinDisplay = document.getElementById("shopCoins");
const flash = document.getElementById("flash");
const gameArea = document.getElementById("gameArea");

let coins = parseInt(localStorage.getItem("coins")) || 0;
let isJumping = false;
let isPlaying = false;
let selectedCharacter = localStorage.getItem("character") || "cat";
let ownedCharacters = JSON.parse(localStorage.getItem("ownedCharacters")) || ["cat"];
let moveInterval;
let obstacleInterval;
let spacePressed = false;
let bgPos = 0;

const characterList = {
  cat: { name: "گربه", cost: 0 },
  fox: { name: "روباه", cost: 10 },
  rabbit: { name: "خرگوش", cost: 15 },
  panda: { name: "پاندا", cost: 20 }
};

coinDisplay.textContent = coins;

function hideAll() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("tutorial").style.display = "none";
  document.getElementById("shop").style.display = "none";
  document.getElementById("game").style.display = "none";
  document.getElementById("controls").style.display = "none";
  document.getElementById("creator").style.display = "none";
  document.getElementById("gameover").style.display = "none";
}

document.addEventListener("keydown", function(e) {
  if (e.code === "Space" && !spacePressed && !isJumping && isPlaying) {
    spacePressed = true;
    jump();
  }
});

document.addEventListener("keyup", function(e) {
  if (e.code === "Space") {
    spacePressed = false;
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

function flashScreen() {
  flash.style.display = "block";
  setTimeout(() => {
    flash.style.display = "none";
  }, 300);
}

function startGame() {
  hideAll();
  isPlaying = true;
  document.getElementById("game").style.display = "block";
  document.getElementById("controls").style.display = "block";
  document.getElementById("creator").style.display = "block";

  cat.style.backgroundImage = `url('${selectedCharacter}-walk.png')`;
  cat.style.animation = "walk 0.5s steps(3) infinite";

  bgPos = 0;
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
        localStorage.setItem("coins", coins);
      }
    });

    checkCollision();
  }, 50);

  obstacleInterval = setInterval(createObstacle, 2000);
}

function createObstacle() {
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  obstacle.classList.add(Math.random() < 0.5 ? "cactus" : "rock");
  obstacle.style.left = "600px";
  obstacle.style.bottom = "40px";
  gameArea.appendChild(obstacle);
}

function checkCollision() {
  const catRect = cat.getBoundingClientRect();

  document.querySelectorAll(".obstacle").forEach(obstacle => {
    const obsRect = obstacle.getBoundingClientRect();

    const overlapX = obsRect.left < catRect.right && obsRect.right > catRect.left;
    const overlapY = obsRect.bottom > catRect
