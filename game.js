const cat = document.getElementById("cat");
const coinDisplay = document.getElementById("coins");
const shopCoinDisplay = document.getElementById("shopCoins");
const flash = document.getElementById("flash");

let coins = parseInt(localStorage.getItem("coins")) || 0;
let isJumping = false;
let gameInterval;
let speed = 5;
let isNight = false;
let isPlaying = false;
let selectedCharacter = localStorage.getItem("character") || "cat";
let ownedBackground = localStorage.getItem("bgNight") === "true";
let ownedCharacters = JSON.parse(localStorage.getItem("ownedCharacters")) || ["cat"];

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
  obstacle.classList.add(Math.random() < 0.5 ? "cactus" : "rock");
  obstacle.style.right = "-30px";
  document.getElementById("gameArea").appendChild(obstacle);

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
  if (!ownedCharacters.includes(name)) {
    alert("اول باید این شخصیت رو بخری!");
    return;
  }

  selectedCharacter = name;
  localStorage.setItem("character", name);
  document.getElementById("selectedCharacterName").textContent = selectedCharacter;
  document.getElementById("selectedCharacterPreview").style.backgroundImage = `url('${selectedCharacter}.png')`;
  alert("شخصیت انتخاب شد: " + name);
}

function buyCharacter(name, cost) {
  if (ownedCharacters.includes(name)) {
    alert("قبلاً این شخصیت رو خریدی!");
    return;
  }

  if (coins >= cost) {
    coins -= cost;
    ownedCharacters.push(name);
    localStorage.setItem("ownedCharacters", JSON.stringify(ownedCharacters));
    localStorage.setItem("coins", coins);
    coinDisplay.textContent = coins;
    shopCoinDisplay.textContent = coins;
    alert("شخصیت " + name + " خریداری شد!");
  } else {
    alert("سکه کافی نداری! برای خرید " + name + " باید " + cost + " سکه داشته باشی.");
  }
}

