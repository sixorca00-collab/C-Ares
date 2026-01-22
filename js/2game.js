// ==================================================
// PERSONAJES DISPONIBLES
// ==================================================
const characters = {
  arco: {
    nombre: "Arco",
    vida: 70,
    ataque: 18,
    probFallo: 0.30,
    probCritico: 0.35,
    multiCritico: 2.0,
    idle: "./assets/characters/ArqueroEstandar.png",
    attack: "./assets/characters/ArqueroAtaque.png",
    defend: "./assets/characters/ArcoDefensa.png",
    skill: "./assets/characters/ArqueroUlti.png"
  },
  escudo: {
    nombre: "Escudo",
    vida: 140,
    ataque: 12,
    probFallo: 0.10,
    probCritico: 0.10,
    multiCritico: 1.3,
    idle: "./assets/characters/EscuderoEstandar.png",
    attack: "./assets/characters/EscuderoAtaque.png",
    defend: "./assets/characters/EscuderoDefensa.png",
    skill: "./assets/characters/EscuderoUlti.png"
  },
  espada: {
    nombre: "Espada",
    vida: 100,
    ataque: 20,
    probFallo: 0.15,
    probCritico: 0.20,
    multiCritico: 1.5,
    idle: "./assets/characters/EspadaEstandarr.png",
    attack: "./assets/characters/EspadaAtaque.png",
    defend: "./assets/characters/EspadaDefensa.png",
    skill: "./assets/characters/EspadaUlti.png"
  },
  lanza: {
    nombre: "Lanza",
    vida: 90,
    ataque: 25,
    probFallo: 0.20,
    probCritico: 0.25,
    multiCritico: 1.7,
    idle: "./assets/characters/LanzaEstandarr.png",
    attack: "./assets/characters/LanzaAtaque.png",
    defend: "./assets/characters/LanzaDefensa.png",
    skill: "./assets/characters/LanzaUlti.png"
  }
};

// ==================================================
// ESTADO DEL JUEGO
// ==================================================
let player1Character = null;
let player2Character = null;

let player1HP = characters.vida;
let player2HP = 0;


let currentTurn = "player1";
let menuLocked = false;
let gameOver = false;

// ==================================================
// REFERENCIAS DOM
// ==================================================
const player1 = document.getElementById("player1");
const player2 = document.getElementById("player2");

const log = document.createElement("div");
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

const player1LifeBar = document.getElementById("player1-life");
const player2LifeBar = document.getElementById("player2-life");

const resultScreen = document.getElementById("result-screen");
const resultText = document.getElementById("result-text");

// ==================================================
// FONDOS ALEATORIOS
// ==================================================
const backgrounds = ["./assets/WallpaperCombat.webp"];

function setRandomBackground() {
  const bg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  background.style.backgroundImage = `url(${bg})`;
}

// ==================================================
// UTILIDADES UI
// ==================================================
function lockMenu(lock) {
  menuLocked = lock;
}

function clearAnimations() {
  player1.classList.remove("attack", "hit", "defend");
  player2.classList.remove("attack", "hit", "defend");

  if (player1Character) player1.src = characters[player1Character].idle;
  if (player2Character) player2.src = characters[player2Character].idle;
}

function updateLifeBars() {
  const p1Percent = (player1HP / player1MaxHP) * 100;
  const p2Percent = (player2HP / player2MaxHP) * 100;

  player1LifeBar.style.width = p1Percent + "%";
  player2LifeBar.style.width = p2Percent + "%";

  setLifeColor(player1LifeBar, p1Percent);
  setLifeColor(player2LifeBar, p2Percent);
}

function setLifeColor(bar, percent) {
  if (percent > 50) bar.style.background = "#4caf50";
  else if (percent > 20) bar.style.background = "#ffb700ff";
  else bar.style.background = "#f44336";
}

// ==================================================
// CARGA DE PERSONAJES DESDE STORAGE
// ==================================================
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

  initializeHP();
}

let player1MaxHP = 0;
let player2MaxHP = 0;

function initializeHP() {
  if (player1Character) {
    player1MaxHP = characters[player1Character].vida;
    player1HP = player1MaxHP;
  }

  if (player2Character) {
    player2MaxHP = characters[player2Character].vida;
    player2HP = player2MaxHP;
  }

  updateLifeBars();
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
      case "A": {
        const atk = calculateAttack("player1");
        result = {
          attacker: "player1",
          action: "attack",
          hit: atk.hit,
          damage: atk.damage,
          text: `Jugador 1 atacó (${atk.result})`
        };
        break;
      }
      case "S": result = {attacker:"player1", action:"attack", hit:true, damage:22, text:"Jugador 1 usó Ataque 2"}; break;
      case "D": result = {attacker:"player1", action:"defend", hit:false, text:"Jugador 1 se defendió"}; break;
      case "F": result = {attacker:"player1", action:"skill", hit:true, damage:30, text:"Jugador 1 usó Especial"}; break;
      default: lockMenu(false); return;
    }
  } else if(player === "player2"){
    switch(key){
      case "J": {
        const atk = calculateAttack("player2");
        result = {
          attacker: "player2",
          action: "attack",
          hit: atk.hit,
          damage: atk.damage,
          text: `Jugador 2 atacó (${atk.result})`
        };
        break;
      }
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
// ANIMACIONES
// ==================================================
function animatePlayer(result, attackerEl, targetEl, nextPlayer){
  const character = result.attacker === "player1" ? player1Character : player2Character;

  if(result.action === "attack" || result.action === "skill"){
    attackerEl.src = characters[character][result.action];
    attackerEl.classList.add("attack");

    if(result.hit){
      setTimeout(()=>{
        targetEl.classList.add("hit");
        if(result.attacker === "player1") {
          player2HP = Math.max(player2HP - result.damage, 0);
          console.log(player2HP)
        } else {
          player1HP = Math.max(player1HP - result.damage, 0);
        }
        updateLifeBars();
        checkBattleEnd();
      }, 200);
    }
  } else if(result.action === "defend"){
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
  player1HP = player1Character ? characters[player1Character].vida : player1HP;
  player2HP = player2Character ? characters[player2Character].vida : player2HP;
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
// CALCULAR DAÑO
// ==================================================
function calculateAttack(attacker) {
  const characterKey = attacker === "player1" ? player1Character : player2Character;
  const stats = characters[characterKey];

  const random = Math.random();
  let damage = 0;
  let hit = true;
  let result = "Normal";

  if (random < stats.probFallo) {
    hit = false;
    damage = 0;
    result = "Falló";
  } else if (random < stats.probFallo + stats.probCritico) {
    damage = stats.ataque * stats.multiCritico;
    result = "Crítico";
  } else {
    damage = stats.ataque;
  }

  return { hit, damage: Math.round(damage), result };
}

// ==================================================
// SKILL 2
// ==================================================
function calculateSpecialAttack(attacker, type) {
  // lógica específica por ataque
}
// ==================================================
// INICIALIZACIÓN
// ==================================================
window.addEventListener("load", () => {
  setRandomBackground();
  loadPlayersFromStorage();
  lockMenu(false);
  log.textContent = "¡Comienza el combate! · Turno de Jugador 1";
});