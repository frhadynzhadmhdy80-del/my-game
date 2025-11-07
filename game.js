function showGameOver(){
  isPlaying = false;
  document.getElementById("controls").style.display = "none";
  document.getElementById("creator").style.display = "none";
  document.getElementById("gameover").style.display = "block";
}

function startGame() {
  hideAll(); // این خط باعث می‌شه صفحه‌ی باخت هم مخفی بشه
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


