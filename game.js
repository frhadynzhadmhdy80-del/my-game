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
  document.getElementById("gameover").style.display = "none";
  gameArea.innerHTML = '<div id="cat"></div>';
  const newCat = document.getElementById("cat");

  isPlaying = true;
  document.getElementById("game").style.display = "block";
  document.getElementById("controls").style.display = "block";
  document.getElementById("creator").style.display = "block";

  newCat.style.backgroundImage = `url('${selectedCharacter}-walk.png')`;
  newCat.style.animation = "walk 0.5s steps(3) infinite";
  newCat.style.width = "50px";
  newCat.style.height = "50px";
  newCat.style.position = "absolute";
  newCat.style.bottom = "40px";
  newCat.style.left = "100px";

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
  const catRect = document.getElementById("cat").getBoundingClientRect();

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

function showGameOver() {
  isPlaying = false;
  document.getElementById("controls").style.display = "none";
  document.getElementById("creator").style.display = "none";
  document.getElementById("gameover").style.display = "block";
}

function backToMenu() {
  hideAll();
  document.getElementById("menu").style.display = "block";
  coinDisplay.textContent = coins;
}
