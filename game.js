const cat = document.getElementById("cat");
const scoreDisplay = document.getElementById("score");
const highscoreDisplay = document.getElementById("highscore");
const shopScoreDisplay = document.getElementById("shopScore");
const gameArea = document.getElementById("game");
const flash = document.getElementById("flash");

let score = 0;
let highscore = localStorage.getItem("highscore") || 0;
let isJumping = false;
let gameInterval;
let speed = 5;
let isNight = false;
let isPlaying = false;
let selectedCharacter = localStorage.getItem("character") || "cat";
let ownedBackground = localStorage.getItem("bgNight") === "true";

highscoreDisplay.textContent = highscore;

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
      if (catBottom >= 80) score++;
    }

    if (pos > 600) {
      clearInterval(move);
      obstacle.remove();
      score++;
      scoreDisplay.textContent = score;
      shopScoreDisplay.textContent = score;

      if (score > highscore) {
        highscore = score;
        localStorage.setItem("highscore", highscore);
        highscoreDisplay.textContent = highscore;
      }

      if (score % 10 === 0 && speed < 15) speed += 0.5;
      if (score % 15 === 0 && ownedBackground) {
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
  document.getElementById("scoreboard").style.display = "block";
  document.getElementById("controls").style.display = "block";
  document.getElementById("creator").style.display = "block";

  cat.style.backgroundImage = `url('${selectedCharacter}.png')`;

  clearInterval(gameInterval);
  score = 0;
  speed = 5;
  scoreDisplay.textContent = score;
  shopScoreDisplay.textContent = score;
  gameInterval = setInterval(createObstacle, 2000);
}

function showTutorial() {
  hideAll();
  document.getElementById("tutorial").style.display = "block";
}

function showShop() {
  hideAll();
  document.getElementById("shop").style.display = "block";
  shopScoreDisplay.textContent = score;
}

function showCharacterSelect() {
  hideAll();
  document.getElementById("characterSelect").style.display = "block";
}

function selectCharacter(name) {
  selectedCharacter = name;
  localStorage.setItem("character", name);
  alert("شخصیت انتخاب شد: " + name);
}

function buyBackground() {
  if (score >= 15) {
    ownedBackground = true;
    localStorage.setItem("bgNight", "true");
    alert("پس‌زمینه شب خریداری شد!");
  } else {
    alert("امتیاز کافی نداری! حداقل ۱۵ امتیاز لازم است.");
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
    "menu", "tutorial", "shop", "characterSelect",
    "game", "scoreboard", "controls", "creator", "gameover"
  ];
  sections.forEach(id => {
    document.getElementById(id).style.display = "none";
  });

  isPlaying = false;
  clearInterval(gameInterval);
  document.querySelectorAll(".obstacle").forEach(ob => ob.remove());
}
