// ==================================================
// REFERENCIAS DOM
// ==================================================
const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");
const log = document.createElement("div"); // Creamos un log interno temporal
log.style.position = "fixed";
log.style.top = "100px";
log.style.left = "50%";
log.style.transform = "translateX(-50%)";
log.style.color = "white";
log.style.fontFamily = "sans-serif";
log.style.fontSize = "18px";
log.style.zIndex = "20";
document.body.appendChild(log);

const background = document.getElementById("background");

// HUD
const player1LifeBar = document.getElementById("player1-life");
const player2LifeBar = document.getElementById("player2-life");

// RESULT SCREEN
const resultScreen = document.getElementById("result-screen");
const resultText = document.getElementById("result-text");

// ==================================================
// FONDOS ALEATORIOS
// ==================================================
const backgrounds = [
  "./assets/WallpaperCombat.webp",
];

function setRandomBackground() {
  const bg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  background.style.backgroundImage = `url(${bg})`;
}

// ==================================================
// ESTADO DEL JUEGO
// ==================================================
let currentTurn = "player1";
let menuLocked = false;
let gameOver = false;

let player1HP = 100;
let player2HP = 100;

// 👉 NUEVO: personajes seleccionados
let player1Character = null;
let player2Character = null;

// ==================================================
// UTILIDADES UI
// ==================================================
function lockMenu(lock) {
  menuLocked = lock;
}

function clearAnimations() {
  player1.classList.remove("attack", "hit", "defend");
  player2.classList.remove("attack", "hit", "defend");

  // 👉 Volver a imagen idle
  if (player1Character) {
    player1.src = characters[player1Character].idle;
  }
  if (player2Character) {
    player2.src = characters[player2Character].idle;
  }
}

// ==================================================
// VIDA (VISUAL)
// ==================================================
function updateLifeBars() {
  player1LifeBar.style.width = player1HP + "%";
  player2LifeBar.style.width = player2HP + "%";
  setLifeColor(player1LifeBar, player1HP);
  setLifeColor(player2LifeBar, player2HP);
}

function setLifeColor(bar, hp){
  if(hp > 50) bar.style.background = "#4caf50";
  else if(hp > 20) bar.style.background = "#ffb700ff";
  else bar.style.background = "#f44336";
}

// ==================================================
// ACCIONES DE JUGADORES
// ==================================================
function selectAction(player, key) {
  if(menuLocked || currentTurn !== player || gameOver) return;

  lockMenu(true);
  let result;

  if(player === "player1"){
    switch(key){
      case "A": result = {attacker:"player1", action:"attack", hit:true, damage:15, text:"Jugador 1 usó Ataque 1"}; break;
      case "S": result = {attacker:"player1", action:"attack", hit:true, damage:22, text:"Jugador 1 usó Ataque 2"}; break;
      case "D": result = {attacker:"player1", action:"defend", hit:false, text:"Jugador 1 se defendió"}; break;
      case "F": result = {attacker:"player1", action:"skill", hit:true, damage:30, text:"Jugador 1 usó Especial"}; break;
      default: lockMenu(false); return;
    }
  } else if(player === "player2"){
    switch(key){
      case "J": result = {attacker:"player2", action:"attack", hit:true, damage:15, text:"Jugador 2 usó Ataque 1"}; break;
      case "K": result = {attacker:"player2", action:"attack", hit:true, damage:22, text:"Jugador 2 usó Ataque 2"}; break;
      case "L": result = {attacker:"player2", action:"defend", hit:false, text:"Jugador 2 se defendió"}; break;
      case "Ñ": result = {attacker:"player2", action:"skill", hit:true, damage:30, text:"Jugador 2 usó Especial"}; break;
      default: lockMenu(false); return;
    }
  }

  playTurn(result);
}

// ==================================================
// TECLADO
// ==================================================
document.addEventListener("keydown", (e)=>{
  const key = e.key.toUpperCase();
  if(["A","S","D","F"].includes(key)) selectAction("player1", key);
  if(["J","K","L","Ñ"].includes(key)) selectAction("player2", key);
});

// ==================================================
// MOTOR DE ESCENA
// ==================================================
function playTurn(result){
  clearAnimations();
  log.textContent = result.text;

  if(result.attacker === "player1") {
    animatePlayer(result, player1, player2, "player2");
  } else {
    animatePlayer(result, player2, player1, "player1");
  }
}

// ==================================================
// ANIMACIONES (👉 CAMBIO DE IMAGEN AQUÍ)
// ==================================================
function animatePlayer(result, attackerEl, targetEl, nextPlayer){
  const character =
    result.attacker === "player1"
      ? player1Character
      : player2Character;

  if(result.action === "attack" || result.action === "skill"){
    attackerEl.src = characters[character][result.action];
    attackerEl.classList.add("attack");

    if(result.hit){
      setTimeout(()=>{
        targetEl.classList.add("hit");
        if(result.attacker === "player1") {
          player2HP = Math.max(player2HP - result.damage, 0);
        } else {
          player1HP = Math.max(player1HP - result.damage, 0);
        }
        updateLifeBars();
        checkBattleEnd();
      }, 200);
    }
  }
  else if(result.action === "defend"){
    attackerEl.src = characters[character].defend;
    attackerEl.classList.add("defend");
  }

  endTurn(nextPlayer, 700);
}

// ==================================================
// TURNOS
// ==================================================
function endTurn(next, delay){
  setTimeout(()=>{
    clearAnimations();
    currentTurn = next;
    if(!gameOver) lockMenu(false);
    log.textContent += ` · Turno de ${currentTurn === "player1" ? "Jugador 1" : "Jugador 2"}`;
  }, delay);
}

// ==================================================
// FIN DE COMBATE
// ==================================================
function checkBattleEnd(){
  if(player1HP <= 0) return endBattle("player2");
  if(player2HP <= 0) return endBattle("player1");
}

function endBattle(winner){
  gameOver = true;
  lockMenu(true);
  resultText.textContent = winner === "player1" ? "¡Jugador 1 GANÓ!" : "¡Jugador 2 GANÓ!";
  resultText.style.color = "#4caf50";
  resultScreen.classList.remove("d-none");
}

// ==================================================
// BOTONES RESULT SCREEN
// ==================================================
function restartBattle(){
  player1HP = 100;
  player2HP = 100;
  currentTurn = "player1";
  gameOver = false;
  updateLifeBars();
  setRandomBackground();
  clearAnimations();
  resultScreen.classList.add("d-none");
  lockMenu(false);
  log.textContent = "¡Comienza el combate! · Turno de Jugador 1";
}

function goToMenu(){
  window.location.href = "index.html";
}

// ==================================================
// CARGA DE PERSONAJES DESDE SELECCIÓN
// ==================================================
const characters = {
  arco: {
    idle: "./assets/characters/ArqueroEstandar.png",
    attack: "./assets/characters/ArqueroAtaque.png",
    defend: "./assets/characters/ArcoDefensa.png",
    skill: "./assets/characters/ArqueroUlti.png"
  },
  escudo: {
    idle: "./assets/characters/EscuderoEstandar.png",
    attack: "./assets/characters/EscuderoAtaque.png",
    defend: "./assets/characters/EscuderoDefensa.png",
    skill: "./assets/characters/EscuderoUlti.png"
  },
  espada: {
    idle: "./assets/characters/EspadaEstandarr.png",
    attack: "./assets/characters/EspadaAtaque.png",
    defend: "./assets/characters/EspadaDefensa.png",
    skill: "./assets/characters/EspadaUlti.png"
  },
  lanza: {
    idle: "./assets/characters/LanzaEstandarr.png",
    attack: "./assets/characters/LanzaAtaque.png",
    defend: "./assets/characters/LanzaDefensa.png",
    skill: "./assets/characters/LanzaUlti.png"
  }
};

function loadPlayersFromStorage() {
  const p1 = localStorage.getItem("player1");
  const p2 = localStorage.getItem("player2");

  if (p1 && characters[p1]) {
    player1Character = p1;
    player1.src = characters[p1].idle;
  }

  if (p2 && characters[p2]) {
    player2Character = p2;
    player2.src = characters[p2].idle;
  }
}

// ==================================================
// INIT
// ==================================================
setRandomBackground();
loadPlayersFromStorage();
updateLifeBars();
lockMenu(false);
log.textContent = "¡Comienza el combate! · Turno de Jugador 1";
