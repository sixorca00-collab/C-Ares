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
let currentTurn = "player1"; // turnos: player1, player2
let menuLocked = false;
let gameOver = false;

let player1HP = 100;
let player2HP = 100;

// ==================================================
// UTILIDADES UI
// ==================================================
function lockMenu(lock) {
  menuLocked = lock;
}

function clearAnimations() {
  player1.classList.remove("attack", "hit", "defend");
  player2.classList.remove("attack", "hit", "defend");
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
  if(hp>50) bar.style.background="#4caf50";
  else if(hp>20) bar.style.background="#ffc107";
  else bar.style.background="#f44336";
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

  if(result.attacker==="player1") animatePlayer(result, player1, player2, "player2");
  else animatePlayer(result, player2, player1, "player1");
}

// ==================================================
// ANIMACIONES
// ==================================================
function animatePlayer(result, attackerEl, targetEl, nextPlayer){
  if(result.action==="attack"||result.action==="skill"){
    attackerEl.classList.add("attack");
    if(result.hit){
      setTimeout(()=>{
        targetEl.classList.add("hit");
        if(result.attacker==="player1") player2HP = Math.max(player2HP - result.damage,0);
        else player1HP = Math.max(player1HP - result.damage,0);
        updateLifeBars();
        checkBattleEnd();
      },200);
    }
  }
  else if(result.action==="defend"){
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
  if(player1HP<=0) return endBattle("player2");
  if(player2HP<=0) return endBattle("player1");
}

function endBattle(winner){
  gameOver=true;
  lockMenu(true);
  resultText.textContent = winner==="player1"?"¡Jugador 1 GANÓ!":"¡Jugador 2 GANÓ!";
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
// INIT
// ==================================================
setRandomBackground();
updateLifeBars();
lockMenu(false);
log.textContent = "¡Comienza el combate! · Turno de Jugador 1";
