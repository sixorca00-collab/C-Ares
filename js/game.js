// ==================================================
// REFERENCIAS DOM
// ==================================================
const player = document.getElementById("player");
const enemy = document.getElementById("enemy");
const log = document.getElementById("battle-log");
<<<<<<< HEAD
const buttons = document.querySelectorAll("button");
const background = document.getElementById("background");

=======
const background = document.getElementById("background");

// HUD
>>>>>>> dev-juan
const playerLifeBar = document.getElementById("player-life");
const enemyLifeBar = document.getElementById("enemy-life");

// RESULT SCREEN
const resultScreen = document.getElementById("result-screen");
const resultText = document.getElementById("result-text");
<<<<<<< HEAD
=======
const btnRestart = document.getElementById("btn-restart");
const btnMenu = document.getElementById("btn-menu");

// ACCIONES
const btnA = document.getElementById("btn-a");
const btnS = document.getElementById("btn-s");
const btnD = document.getElementById("btn-d");
const btnF = document.getElementById("btn-f");
>>>>>>> dev-juan

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
<<<<<<< HEAD
  buttons.forEach(btn => btn.disabled = lock);
=======
  [btnA, btnS, btnD, btnF].forEach(btn => btn.disabled = lock);
>>>>>>> dev-juan
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
<<<<<<< HEAD
      playTurn({
        attacker: "player",
        action: "attack",
        hit: true,
        damage: 15,
        text: "Ares usó Ataque 1"
      });
      break;

    case "S":
      playTurn({
        attacker: "player",
        action: "attack",
        hit: true,
        damage: 22,
        text: "Ares usó Ataque 2"
      });
      break;

    case "D":
      playTurn({
        attacker: "player",
        action: "defend",
        hit: false,
        text: "Ares se defendió"
      });
      break;

    case "F":
      playTurn({
        attacker: "player",
        action: "skill",
        hit: true,
        damage: 30,
        text: "Ares usó Especial"
      });
=======
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
>>>>>>> dev-juan
      break;
  }
}

// ==================================================
<<<<<<< HEAD
// TECLADO A S D F
// ==================================================
document.addEventListener("keydown", (e) => {
  const key = e.key.toUpperCase();
  if (["A", "S", "D", "F"].includes(key)) {
    highlightButton(key);
    selectAction(key);
  }
});

function highlightButton(key) {
  const btn = document.getElementById(`btn-${key.toLowerCase()}`);
  if (!btn) return;
  btn.classList.add("active");
  setTimeout(() => btn.classList.remove("active"), 150);
}

=======
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

>>>>>>> dev-juan
// ==================================================
// MOTOR DE ESCENA
// ==================================================
function playTurn(result) {
  clearAnimations();
  log.textContent = result.text;

<<<<<<< HEAD
  if (result.attacker === "player") {
    animatePlayer(result);
  } else {
    animateEnemy(result);
  }
=======
  if (result.attacker === "player") animatePlayer(result);
  else animateEnemy(result);
>>>>>>> dev-juan
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
<<<<<<< HEAD
  playTurn({
    attacker: "enemy",
    action: "attack",
    hit: true,
    damage: 12,
    text: "El enemigo atacó"
  });
=======
  playTurn({attacker:"enemy", action:"attack", hit:true, damage:12, text:"El enemigo atacó"});
>>>>>>> dev-juan
}

// ==================================================
// FIN DE COMBATE
// ==================================================
function checkBattleEnd() {
<<<<<<< HEAD
  if (enemyHP <= 0) {
    endBattle(true);
    return true;
  }
  if (playerHP <= 0) {
    endBattle(false);
    return true;
  }
=======
  if (enemyHP <= 0) return endBattle(true);
  if (playerHP <= 0) return endBattle(false);
>>>>>>> dev-juan
  return false;
}

function endBattle(win) {
  gameOver = true;
  lockMenu(true);

  resultText.textContent = win ? "¡GANASTE!" : "PERDISTE";
  resultText.style.color = win ? "#4caf50" : "#f44336";

<<<<<<< HEAD
  setTimeout(() => {
    resultScreen.classList.remove("d-none");
  }, 600);
}

// ==================================================
// SPA
// ==================================================
=======
  resultScreen.classList.remove("d-none");
}

// ==================================================
// SPA / BOTONES MODAL
// ==================================================
btnRestart.addEventListener("click", restartBattle);
btnMenu.addEventListener("click", goToMenu);

>>>>>>> dev-juan
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
<<<<<<< HEAD
=======

>>>>>>> dev-juan
  lockMenu(false);
}

function goToMenu() {
<<<<<<< HEAD
  restartBattle();
  log.textContent = "Menú principal (placeholder)";
=======
  window.location.href = "index.html";
>>>>>>> dev-juan
}

// ==================================================
// INIT
// ==================================================
setRandomBackground();
updateLifeBars();
log.textContent = "¡Comienza el combate! · Tu turno";
<<<<<<< HEAD
=======
lockMenu(false);
>>>>>>> dev-juan
