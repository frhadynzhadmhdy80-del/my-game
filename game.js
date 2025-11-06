const cat = document.getElementById("cat");
const coinDisplay = document.getElementById("coins");
const shopCoinDisplay = document.getElementById("shopCoins");
const gameArea = document.getElementById("game");
const flash = document.getElementById("flash");

let coins = parseInt(localStorage.getItem("coins")) || 0;
let isJumping = false;
let gameInterval;
let speed = 5;
let isNight = false;
let isPlaying = false;
let selectedCharacter = localStorage.getItem("character") || "cat";
let ownedBackground = localStorage.getItem("bgNight") === "true";

coinDisplay.textContent = coins;

function jump() {
  if (!isJumping) {
    isJumping = true;
    cat.style.bottom = "120px";
    setTimeout(() => {
      cat.style.bottom = "40px";
      isJumping = false;
    }, 600);
  }
}

document.addEventListener("keydown", function(e) {
  if (e.code === "Space" && !isJumping && isPlaying) {
    jump();
  }
});

function flashScreen() {
  flash.style.display = "block";
  document.body.style.animation = "shake 0.3s";
  setTimeout(() => {
    flash.style.display = "none";
    document.body.style.animation = "";
  }, 300);
}

function createObstacle() {
  if (!isPlaying) return;

  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");

  const type = Math.random();
  obstacle.classList.add(type < 0.5 ? "cactus" : "rock");

  obstacle.style.right = "-30px";
  gameArea.appendChild(obstacle);

  let pos = -30;
  let passed = false;
  const move = setInterval(() => {
    if (!isPlaying) {
      clearInterval(move);
      obstacle.remove();
      return;
    }

    pos += speed;
    obstacle.style.right = pos + "px";

    const catBottom = parseInt(window.getComputedStyle(cat).bottom);
    if (pos > 500 && pos < 580 && catBottom < 80) {
      clearInterval(move);
      obstacle.remove();
      document.querySelectorAll(".obstacle").forEach(ob => ob.remove());
      flashScreen();
      showGameOver();
    }

    if (!passed && pos > 580) {
      passed = true;
      if (catBottom >= 80) coins++;
    }

    if (pos > 600) {
      clearInterval(move);
      obstacle.remove();
      coins++;
      coinDisplay.textContent = coins;
      shopCoinDisplay.textContent = coins;
      localStorage.setItem("coins", coins);

      if (coins % 10 === 0 && speed < 15) speed += 0.5;
      if (coins % 15 === 0 && ownedBackground) {
        document.body.style.background = isNight
          ? "linear-gradient(to bottom, #cceeff, #ffffff)"
          : "linear-gradient(to bottom, #0d1b2a, #1b263b)";
        isNight = !isNight;
      }
    }
  }, 20);
}

function startGame() {
  hideAll();
  isPlaying = true;
  document.getElementById("game").style.display = "block";
  document.getElementById("controls").style.display = "block";
  document.getElementById("creator").style.display = "block";

  cat.style.backgroundImage = `url('${selectedCharacter}.png')`;

  clearInterval(gameInterval);
  speed = 5;
  coinDisplay.textContent = coins;
  shopCoinDisplay.textContent = coins;
  gameInterval = setInterval(createObstacle, 2000);
}

function showTutorial() {
  hideAll();
  document.getElementById("tutorial").style.display = "block";
}

function showShop() {
  hideAll();
  document.getElementById("shop").style.display = "block";
  shopCoinDisplay.textContent = coins;

  document.getElementById("selectedCharacterName").textContent = selectedCharacter;
  document.getElementById("selectedCharacterPreview").style.backgroundImage = `url('${selectedCharacter}.png')`;
}

function selectCharacter(name) {
  selectedCharacter = name;
  localStorage.setItem("character", name);
  alert("شخصیت انتخاب شد: " + name);

  document.getElementById("selectedCharacterName").textContent = selectedCharacter;
  document.getElementById("selectedCharacterPreview").style.backgroundImage = `url('${selectedCharacter}.png')`;
}

function buyBackground() {
  if (coins >= 15) {
    ownedBackground = true;
    localStorage.setItem("bgNight", "true");
    coins -= 15;
    localStorage.setItem("coins", coins);
    coinDisplay.textContent = coins;
    shopCoinDisplay.textContent = coins;
    alert("پس‌زمینه شب خریداری شد!");
  } else {
    alert("سکه کافی نداری! حداقل ۱۵ سکه لازم است.");
  }
}

function backToMenu() {
  hideAll();
  document.getElementById("menu").style.display = "block";
}

function showGameOver() {
  hideAll();
  isPlaying = false;
  document.getElementById("gameover").style.display = "block";
}

function hideAll() {
  const sections = [
    "menu", "tutorial", "shop",
    "game", "controls", "creator", "gameover"
  ];
  sections.forEach(id => {
    document.getElementById(id).style.display = "none";
  });

  isPlaying = false;
  clearInterval(gameInterval);
  document.querySelectorAll(".obstacle").forEach(ob => ob.remove());
}
