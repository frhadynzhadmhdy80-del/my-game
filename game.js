// عناصر اصلی
const cat = document.getElementById("cat");
const coinDisplay = document.getElementById("coins");
const shopCoinDisplay = document.getElementById("shopCoins");
const flash = document.getElementById("flash");
const gameArea = document.getElementById("gameArea");

// متغیرها
let coins = parseInt(localStorage.getItem("coins")) || 0;
let isJumping = false;
let isPlaying = false;
let selectedCharacter = localStorage.getItem("character") || "cat";
let ownedCharacters = JSON.parse(localStorage.getItem("ownedCharacters")) || ["cat"];
let catPos = 100;
let moveInterval;
let obstacleInterval;

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
  catPos = 100;
  cat.style.left = catPos + "px";

  moveInterval = setInterval(() => {
    catPos += 4;
    cat.style.left = catPos + "px";
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
    const overlapY = obsRect.bottom > catRect.top && obsRect.top < catRect.bottom;

    if (overlapX && overlapY) {
      clearInterval(moveInterval);
      clearInterval(obstacleInterval);
      flashScreen();
      showGameOver();
    }
  });
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
  document.getElementById("selectedCharacterPreview").style.backgroundImage = `url('${selectedCharacter}-walk.png')`;

  const shopContainer = document.getElementById("shopCharacters");
  shopContainer.innerHTML = "";

  for (let key in characterList) {
    const char = characterList[key];
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${char.name} (${char.cost} سکه)</p>
      <button onclick="buyCharacter('${key}', ${char.cost})">خرید</button>
      <button onclick="selectCharacter('${key}')">انتخاب</button>
    `;
    shopContainer.appendChild(div);
  }
}

function selectCharacter(name) {
  if (!ownedCharacters.includes(name)) {
    alert("اول باید این شخصیت رو بخری!");
    return;
  }

  selectedCharacter = name;
  localStorage.setItem("character", name);
  document.getElementById("selectedCharacterName").textContent = selectedCharacter;
  document.getElementById("selectedCharacterPreview").style.backgroundImage = `url('${selectedCharacter}-walk.png')`;
  alert("شخصیت انتخاب شد: " + name);
}

function buyCharacter(name, cost) {
  if (ownedCharacters.includes(name)) {
    alert("قبلاً خریدی!");
    return;
  }

  if (coins >= cost) {
    coins -= cost;
    ownedCharacters.push(name);
    localStorage.setItem("ownedCharacters", JSON.stringify(ownedCharacters));
    localStorage.setItem("coins", coins);
    coinDisplay.textContent = coins;
    shopCoinDisplay.textContent = coins;
    alert("شخصیت خریداری شد!");
  } else {
    alert("سکه کافی نداری!");
  }
}

function showGameOver() {
  isPlaying = false;
  document.getElementById("gameover").style.display = "block";
}

function backToMenu() {
  hideAll();
  document.getElementById("menu").style.display = "block";
  coinDisplay.textContent = coins;
}
