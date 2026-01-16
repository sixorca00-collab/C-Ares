// ==================================================
// REFERENCIAS DOM
// ==================================================
const player = document.getElementById("player");
const enemy = document.getElementById("enemy");
const log = document.getElementById("battle-log");
const background = document.getElementById("background");

// HUD
const playerLifeBar = document.getElementById("player-life");
const enemyLifeBar = document.getElementById("enemy-life");

// RESULT SCREEN
const resultScreen = document.getElementById("result-screen");
const resultText = document.getElementById("result-text");
const btnRestart = document.getElementById("btn-restart");
const btnMenu = document.getElementById("btn-menu");

// ACCIONES
const btnA = document.getElementById("btn-a");
const btnS = document.getElementById("btn-s");
const btnD = document.getElementById("btn-d");
const btnF = document.getElementById("btn-f");

// ==================================================
// FONDOS ALEATORIOS
// ==================================================
const backgrounds = [
  "./assets/backgrounds/bg1.jpg",
  "./assets/backgrounds/bg2.jpg",
  "./assets/backgrounds/bg3.jpg"
];

function setRandomBackground() {
  const bg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  background.style.backgroundImage = `url(${bg})`;
}

// ==================================================
// ESTADO DEL JUEGO
// ==================================================
let currentTurn = "player";
let menuLocked = false;
let gameOver = false;

let playerHP = 100;
let enemyHP = 100;

// ==================================================
// UTILIDADES UI
// ==================================================
function lockMenu(lock) {
  menuLocked = lock;
  [btnA, btnS, btnD, btnF].forEach(btn => btn.disabled = lock);
}

function clearAnimations() {
  player.classList.remove("attack", "hit", "defend");
  enemy.classList.remove("attack", "hit", "defend");
}

// ==================================================
// VIDA (VISUAL)
// ==================================================
function updateLifeBars() {
  playerLifeBar.style.width = playerHP + "%";
  enemyLifeBar.style.width = enemyHP + "%";

  setLifeColor(playerLifeBar, playerHP);
  setLifeColor(enemyLifeBar, enemyHP);
}

function setLifeColor(bar, hp) {
  if (hp > 50) bar.style.background = "#4caf50";
  else if (hp > 20) bar.style.background = "#ffc107";
  else bar.style.background = "#f44336";
}

// ==================================================
// ACCIONES DEL JUGADOR (BOTONES + TECLADO)
// ==================================================
function selectAction(key) {
  if (menuLocked || currentTurn !== "player" || gameOver) return;

  lockMenu(true);

  switch (key) {
    case "A":
      playTurn({attacker: "player", action: "attack", hit: true, damage: 15, text: "Ares usó Ataque 1"});
      break;
    case "S":
      playTurn({attacker: "player", action: "attack", hit: true, damage: 22, text: "Ares usó Ataque 2"});
      break;
    case "D":
      playTurn({attacker: "player", action: "defend", hit: false, text: "Ares se defendió"});
      break;
    case "F":
      playTurn({attacker: "player", action: "skill", hit: true, damage: 100, text: "Ares usó Especial"});
      break;
  }
}

// ==================================================
// BOTONES
// ==================================================
btnA.addEventListener("click", () => selectAction("A"));
btnS.addEventListener("click", () => selectAction("S"));
btnD.addEventListener("click", () => selectAction("D"));
btnF.addEventListener("click", () => selectAction("F"));

// ==================================================
// TECLADO
// ==================================================
document.addEventListener("keydown", (e) => {
  const key = e.key.toUpperCase();
  if (["A","S","D","F"].includes(key)) selectAction(key);
});

// ==================================================
// MOTOR DE ESCENA
// ==================================================
function playTurn(result) {
  clearAnimations();
  log.textContent = result.text;

  if (result.attacker === "player") animatePlayer(result);
  else animateEnemy(result);
}

// ==================================================
// ANIMACIONES
// ==================================================
function animatePlayer(result) {
  if (result.action === "attack" || result.action === "skill") {
    player.classList.add("attack");

    if (result.hit) {
      setTimeout(() => {
        enemy.classList.add("hit");
        enemyHP = Math.max(enemyHP - result.damage, 0);
        updateLifeBars();
        checkBattleEnd();
      }, 200);
    }

    endTurn("enemy", 700);
  }

  if (result.action === "defend") {
    player.classList.add("defend");
    endTurn("enemy", 600);
  }
}

function animateEnemy(result) {
  enemy.classList.add("attack");

  if (result.hit) {
    setTimeout(() => {
      player.classList.add("hit");
      playerHP = Math.max(playerHP - result.damage, 0);
      updateLifeBars();
      checkBattleEnd();
    }, 200);
  }

  endTurn("player", 700);
}

// ==================================================
// TURNOS
// ==================================================
function endTurn(next, delay) {
  setTimeout(() => {
    clearAnimations();
    currentTurn = next;

    if (currentTurn === "player" && !gameOver) {
      lockMenu(false);
      log.textContent += " · Tu turno";
    } else if (!gameOver) {
      setTimeout(enemyAI, 600);
    }
  }, delay);
}

// ==================================================
// IA TEMPORAL
// ==================================================
function enemyAI() {
  playTurn({attacker:"enemy", action:"attack", hit:true, damage:12, text:"El enemigo atacó"});
}

// ==================================================
// FIN DE COMBATE
// ==================================================
function checkBattleEnd() {
  if (enemyHP <= 0) return endBattle(true);
  if (playerHP <= 0) return endBattle(false);
  return false;
}

function endBattle(win) {
  gameOver = true;
  lockMenu(true);

  resultText.textContent = win ? "¡GANASTE!" : "PERDISTE";
  resultText.style.color = win ? "#4caf50" : "#f44336";

  resultScreen.classList.remove("d-none");
}

// ==================================================
// SPA / BOTONES MODAL
// ==================================================
btnRestart.addEventListener("click", restartBattle);
btnMenu.addEventListener("click", goToMenu);

function restartBattle() {
  gameOver = false;
  currentTurn = "player";

  playerHP = 100;
  enemyHP = 100;

  updateLifeBars();
  setRandomBackground();
  clearAnimations();

  resultScreen.classList.add("d-none");
  log.textContent = "¡Comienza el combate! · Tu turno";

  lockMenu(false);
}

function goToMenu() {
  window.location.href = "index.html";
}

// ==================================================
// INIT
// ==================================================
setRandomBackground();
updateLifeBars();
log.textContent = "¡Comienza el combate! · Tu turno";
lockMenu(false);
