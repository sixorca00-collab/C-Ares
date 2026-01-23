// ==================================================
// SKILL 2
// ==================================================
const skill2Attacks = {
  arco: {
    precision: {
      name: "Disparo Preciso",
      damage: 12,
      probFallo: 0,
      probCritico: 0.15,
      multiCritico: 1.5
    }
  },
  escudo: {
    bash: {
      name: "Embate",
      damage: 10,
      debuff: {
        type: "weaken",
        value: 0.3
      }
    }
  },
  espada: {
    combo: {
      name: "Combo",
      hits: [12, 12]
    }
  },
  lanza: {
    pierce: {
      name: "Perforar",
      damage: 35,
      probFallo: 0.50
    }
  }
};

// ==================================================
// SKILL 3 - HABILIDADES DEFENSIVAS
// ==================================================
const skill3Defenses = {
  arco: {
    name: "Esquiva Rápida",
    effect: "evasion", // Aumenta probabilidad de esquivar
    value: 0.3, // +30% de evasión
    duration: 2 // turnos
  },
  escudo: {
    name: "Bloqueo Defensivo",
    effect: "blockAndCounter", // NUEVO EFECTO: Bloquea y contraataca
    blockChance: 0.8, // 80% de bloquear el ataque
    counterMultiplier: 0.2, // Devuelve 50% del daño
    duration: 1 // turno
  },
  espada: {
    name: "Guardia Alta",
    effect: "damageReduction", // Reduce daño recibido
    value: 0.4, // Reduce 40% del daño
    duration: 2 // turnos
  },
  lanza: {
    name: "Retirada Defensiva",
    effect: "shield", // Escudo que absorbe daño
    value: 25, // Absorbe 25 de daño
    duration: 1 // turno
  }
};

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

let player1HP = 0;
let player2HP = 0;
let player1MaxHP = 0;
let player2MaxHP = 0;

let player1Debuff = null;
let player2Debuff = null;

// Nuevas variables para Skill 3
let player1DefenseBuff = null;
let player2DefenseBuff = null;
let player1DefenseTurns = 0;
let player2DefenseTurns = 0;
let player1StoredDamage = 0; // Daño almacenado para contraataque del Escudo
let player2StoredDamage = 0; // Daño almacenado para contraataque del Escudo

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
// APLICAR DEBUFF
// ==================================================
function applyDebuff(attacker, debuff) {
  const target = attacker === "player1" ? "player2" : "player1";
  
  if (target === "player1") {
    player1Debuff = debuff;
    const targetName = characters[player1Character]?.nombre || "Jugador 1";
    log.textContent += ` · ${targetName} fue debilitado (${debuff.value*100}% menos daño en su próximo ataque)`;
  } else {
    player2Debuff = debuff;
    const targetName = characters[player2Character]?.nombre || "Jugador 2";
    log.textContent += ` · ${targetName} fue debilitado (${debuff.value*100}% menos daño en su próximo ataque)`;
  }
}

// ==================================================
// APLICAR SKILL 3 (DEFENSA)
// ==================================================
function applyDefenseSkill(player, skill) {
  const target = player === "player1" ? "player1" : "player2";
  
  if (target === "player1") {
    player1DefenseBuff = skill;
    player1DefenseTurns = skill.duration;
    player1StoredDamage = 0; // Resetear daño almacenado
    const playerName = characters[player1Character]?.nombre || "Jugador 1";
    log.textContent += ` · ${playerName} usó ${skill.name}`;
  } else {
    player2DefenseBuff = skill;
    player2DefenseTurns = skill.duration;
    player2StoredDamage = 0; // Resetear daño almacenado
    const playerName = characters[player2Character]?.nombre || "Jugador 2";
    log.textContent += ` · ${playerName} usó ${skill.name}`;
  }
}

// ==================================================
// APLICAR CONTRAATAQUE DEL ESCUDO
// ==================================================
function applyShieldCounterAttack(defender, storedDamage) {
  if (storedDamage > 0) {
    setTimeout(() => {
      const target = defender === "player1" ? player2 : player1;
      const attacker = defender === "player1" ? "player1" : "player2";
      
      target.classList.add("hit");
      const defenderName = characters[defender === "player1" ? player1Character : player2Character].nombre;
      log.textContent += ` · ${defenderName} devuelve ${storedDamage} daño`;
      
      if (defender === "player1") {
        // Jugador 1 contraataca a Jugador 2
        player2HP = Math.max(player2HP - storedDamage, 0);
      } else {
        // Jugador 2 contraataca a Jugador 1
        player1HP = Math.max(player1HP - storedDamage, 0);
      }
      
      updateLifeBars();
      checkBattleEnd();
    }, 500);
  }
}

// ==================================================
// CALCULAR ATAQUE NORMAL (CON DEFENSAS MODIFICADAS)
// ==================================================
function calculateAttack(attacker) {
  const characterKey = attacker === "player1" ? player1Character : player2Character;
  const target = attacker === "player1" ? "player2" : "player1";
  const stats = characters[characterKey];
  
  // Verificar si el atacante tiene debuff
  const debuff = attacker === "player1" ? player1Debuff : player2Debuff;
  let effectiveAttack = stats.ataque;
  
  if (debuff && debuff.type === "weaken") {
    effectiveAttack = Math.round(stats.ataque * (1 - debuff.value));
    if (attacker === "player1") {
      player1Debuff = null;
    } else {
      player2Debuff = null;
    }
  }

  // Verificar si el objetivo tiene buff de defensa
  const defenseBuff = target === "player1" ? player1DefenseBuff : player2DefenseBuff;
  const defenseTurns = target === "player1" ? player1DefenseTurns : player2DefenseTurns;
  
  let damage = 0;
  let hit = true;
  let result = "Normal";
  let storedDamage = 0;
  let blocked = false;

  // Aplicar efectos de defensa si existen
  if (defenseBuff && defenseTurns > 0) {
    switch(defenseBuff.effect) {
      case "evasion":
        // Aumentar probabilidad de fallo
        const evasionChance = Math.random();
        if (evasionChance < defenseBuff.value) {
          hit = false;
          damage = 0;
          result = "Esquivado";
        }
        break;
        
      case "damageReduction":
        effectiveAttack = Math.round(effectiveAttack * (1 - defenseBuff.value));
        result = `Reducido (${defenseBuff.value*100}%)`;
        break;
        
      case "blockAndCounter":
        // Verificar si bloquea el ataque (80% de probabilidad)
        const blockChance = Math.random();
        if (blockChance < defenseBuff.blockChance) {
          blocked = true;
          result = "Bloqueado";
        }
        break;
    }
    
    // Reducir duración del buff (excepto para bloqueo que se maneja diferente)
    if (defenseBuff.effect !== "blockAndCounter") {
      if (target === "player1") {
        player1DefenseTurns--;
        if (player1DefenseTurns <= 0) {
          player1DefenseBuff = null;
        }
      } else {
        player2DefenseTurns--;
        if (player2DefenseTurns <= 0) {
          player2DefenseBuff = null;
        }
      }
    }
  }

  // Cálculo normal de ataque
  if (hit && !blocked) {
    const random = Math.random();
    
    if (random < stats.probFallo) {
      hit = false;
      damage = 0;
      result = "Falló";
    } else if (random < stats.probFallo + stats.probCritico) {
      damage = effectiveAttack * stats.multiCritico;
      result = "Crítico";
    } else {
      damage = effectiveAttack;
    }
  }

  // Aplicar escudo si existe
  if (defenseBuff && defenseBuff.effect === "shield" && defenseTurns > 0 && hit && !blocked) {
    const shieldValue = defenseBuff.value;
    const absorbed = Math.min(shieldValue, damage);
    damage = Math.max(0, damage - shieldValue);
    result += ` (Escudo absorbió ${absorbed})`;
    
    if (target === "player1") {
      player1DefenseTurns--;
      if (player1DefenseTurns <= 0) {
        player1DefenseBuff = null;
      }
    } else {
      player2DefenseTurns--;
      if (player2DefenseTurns <= 0) {
        player2DefenseBuff = null;
      }
    }
  }
  
  // Manejar bloqueo y contraataque del Escudo
  if (defenseBuff && defenseBuff.effect === "blockAndCounter" && defenseTurns > 0) {
    // Calcular el daño que hubiera hecho el atacante
    let potentialDamage = 0;
    if (hit && !blocked) {
      potentialDamage = damage;
    } else {
      // Si falló o fue bloqueado, calculamos el daño base que hubiera hecho
      const random = Math.random();
      if (random < stats.probFallo) {
        potentialDamage = 0;
      } else if (random < stats.probFallo + stats.probCritico) {
        potentialDamage = effectiveAttack * stats.multiCritico;
      } else {
        potentialDamage = effectiveAttack;
      }
    }
    
    // Almacenar 50% del daño potencial para contraataque
    storedDamage = Math.round(potentialDamage * defenseBuff.counterMultiplier);
    
    if (target === "player1") {
      player1StoredDamage = storedDamage;
      player1DefenseTurns = 0; // Se consume inmediatamente
      player1DefenseBuff = null;
      
      if (blocked) {
        result = `Bloqueado · Devuelve ${storedDamage} daño`;
      } else {
        result += ` · Devuelve ${storedDamage} daño`;
      }
    } else {
      player2StoredDamage = storedDamage;
      player2DefenseTurns = 0; // Se consume inmediatamente
      player2DefenseBuff = null;
      
      if (blocked) {
        result = `Bloqueado · Devuelve ${storedDamage} daño`;
      } else {
        result += ` · Devuelve ${storedDamage} daño`;
      }
    }
    
    // Si el ataque fue bloqueado, no se aplica daño al defensor
    if (blocked) {
      damage = 0;
    }
  }

  return { 
    hit, 
    damage: Math.round(damage), 
    result, 
    storedDamage,
    blocked 
  };
}

// ==================================================
// CALCULAR SKILL 2
// ==================================================
function calculateSkill2Attack(attacker) {
  const characterKey = attacker === "player1" ? player1Character : player2Character;
  const characterStats = characters[characterKey];
  const skill2Data = skill2Attacks[characterKey];
  
  if (!skill2Data) return null;
  
  // Obtener el primer ataque disponible
  const attackKey = Object.keys(skill2Data)[0];
  const attack = skill2Data[attackKey];
  
  const random = Math.random();
  let damage = attack.damage || 0;
  let hit = true;
  let result = attack.name;
  
  // Manejar daño de combo (múltiples golpes)
  if (attack.hits) {
    damage = attack.hits.reduce((sum, hitDamage) => sum + hitDamage, 0);
    result += ` (${attack.hits.length} golpes)`;
  }
  
  // Verificar fallo
  if (attack.probFallo && random < attack.probFallo) {
    hit = false;
    damage = 0;
    result += " (Falló)";
  } 
  // Verificar crítico
  else if (attack.probCritico && random < (attack.probFallo || 0) + (attack.probCritico || 0)) {
    damage = Math.round(damage * (attack.multiCritico || characterStats.multiCritico));
    result += " (Crítico)";
  }
  
  // Aplicar debuff si existe
  let debuff = null;
  if (hit && attack.debuff) {
    debuff = attack.debuff;
  }
  
  return { 
    hit, 
    damage: Math.round(damage), 
    result,
    debuff
  };
}

// ==================================================
// ACCIONES DE JUGADORES (CON SKILL 3)
// ==================================================
function selectAction(player, key) {
  if (menuLocked || currentTurn !== player || gameOver) return;
  lockMenu(true);

  let result;

  if (player === "player1") {
    switch (key) {
      case "A": {
        const atk = calculateAttack("player1");
        result = {
          attacker: "player1",
          action: "attack",
          hit: atk.hit,
          damage: atk.damage,
          storedDamage: atk.storedDamage,
          blocked: atk.blocked,
          text: `Jugador 1 atacó (${atk.result})`
        };
        break;
      }
      case "S": {
        const atk = calculateSkill2Attack("player1");
        if (atk) {
          result = {
            attacker: "player1",
            action: "skill2",
            hit: atk.hit,
            damage: atk.damage,
            debuff: atk.debuff,
            storedDamage: 0,
            blocked: false,
            text: `Jugador 1 usó ${atk.result}`
          };
        }
        break;
      }
      case "D": {
        const charKey = player1Character;
        const defenseSkill = skill3Defenses[charKey];
        if (defenseSkill) {
          applyDefenseSkill("player1", defenseSkill);
          result = {
            attacker: "player1",
            action: "skill3",
            hit: false,
            damage: 0,
            storedDamage: 0,
            blocked: false,
            text: `Jugador 1 usó ${defenseSkill.name}`
          };
        }
        break;
      }
      case "F": {
        result = {
          attacker: "player1",
          action: "skill",
          hit: true,
          damage: 30,
          storedDamage: 0,
          blocked: false,
          text: "Jugador 1 usó Especial"
        };
        break;
      }
      default: lockMenu(false); return;
    }
  } else if (player === "player2") {
    switch (key) {
      case "J": {
        const atk = calculateAttack("player2");
        result = {
          attacker: "player2",
          action: "attack",
          hit: atk.hit,
          damage: atk.damage,
          storedDamage: atk.storedDamage,
          blocked: atk.blocked,
          text: `Jugador 2 atacó (${atk.result})`
        };
        break;
      }
      case "K": {
        const atk = calculateSkill2Attack("player2");
        if (atk) {
          result = {
            attacker: "player2",
            action: "skill2",
            hit: atk.hit,
            damage: atk.damage,
            debuff: atk.debuff,
            storedDamage: 0,
            blocked: false,
            text: `Jugador 2 usó ${atk.result}`
          };
        }
        break;
      }
      case "L": {
        const charKey = player2Character;
        const defenseSkill = skill3Defenses[charKey];
        if (defenseSkill) {
          applyDefenseSkill("player2", defenseSkill);
          result = {
            attacker: "player2",
            action: "skill3",
            hit: false,
            damage: 0,
            storedDamage: 0,
            blocked: false,
            text: `Jugador 2 usó ${defenseSkill.name}`
          };
        }
        break;
      }
      case "Ñ": {
        result = {
          attacker: "player2",
          action: "skill",
          hit: true,
          damage: 30,
          storedDamage: 0,
          blocked: false,
          text: "Jugador 2 usó Especial"
        };
        break;
      }
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
  
  // Mostrar información adicional sobre debuffs y defensas
  let statusInfo = "";
  if (player1Debuff) {
    const charName = characters[player1Character]?.nombre || "Jugador 1";
    statusInfo += ` [${charName} debilitado]`;
  }
  if (player2Debuff) {
    const charName = characters[player2Character]?.nombre || "Jugador 2";
    statusInfo += ` [${charName} debilitado]`;
  }
  if (player1DefenseBuff) {
    const charName = characters[player1Character]?.nombre || "Jugador 1";
    statusInfo += ` [${charName} con ${player1DefenseBuff.name} (${player1DefenseTurns}t)]`;
  }
  if (player2DefenseBuff) {
    const charName = characters[player2Character]?.nombre || "Jugador 2";
    statusInfo += ` [${charName} con ${player2DefenseBuff.name} (${player2DefenseTurns}t)]`;
  }
  
  log.textContent = result.text + statusInfo;

  if(result.attacker === "player1") {
    animatePlayer(result, player1, player2, "player2");
  } else {
    animatePlayer(result, player2, player1, "player1");
  }
}

// ==================================================
// ANIMACIONES (MODIFICADA PARA EL ESCUDO)
// ==================================================
function animatePlayer(result, attackerEl, targetEl, nextPlayer){
  const character = result.attacker === "player1" ? player1Character : player2Character;
  const charData = characters[character];
  
  // Determinar qué imagen mostrar según la acción
  if(result.action === "attack"){
    attackerEl.src = charData.attack;
    attackerEl.classList.add("attack");
  } else if(result.action === "skill2" || result.action === "skill"){
    // Usar la misma imagen de skill para ambas habilidades especiales
    attackerEl.src = charData.skill;
    attackerEl.classList.add("attack");
  } else if(result.action === "skill3"){
    attackerEl.src = charData.defend;
    attackerEl.classList.add("defend");
  }

  // Aplicar daño si corresponde
  if((result.action === "attack" || result.action === "skill" || result.action === "skill2") && result.hit){
    setTimeout(()=>{
      // Solo mostrar animación de golpe si el ataque no fue bloqueado
      if (!result.blocked) {
        targetEl.classList.add("hit");
      }
      
      // Aplicar daño principal (si no fue bloqueado)
      if(result.attacker === "player1") {
        if (!result.blocked) {
          player2HP = Math.max(player2HP - result.damage, 0);
        }
        // Aplicar contraataque del Escudo si existe
        if (result.storedDamage > 0) {
          applyShieldCounterAttack("player2", result.storedDamage);
        }
      } else {
        if (!result.blocked) {
          player1HP = Math.max(player1HP - result.damage, 0);
        }
        // Aplicar contraataque del Escudo si existe
        if (result.storedDamage > 0) {
          applyShieldCounterAttack("player1", result.storedDamage);
        }
      }
      
      // Aplicar debuff si existe (solo en Skill 2)
      if(result.debuff && result.action === "skill2") {
        applyDebuff(result.attacker, result.debuff);
      }
      
      updateLifeBars();
      checkBattleEnd();
    }, 200);
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
  
  // Resetear todos los estados
  player1Debuff = null;
  player2Debuff = null;
  player1DefenseBuff = null;
  player2DefenseBuff = null;
  player1DefenseTurns = 0;
  player2DefenseTurns = 0;
  player1StoredDamage = 0;
  player2StoredDamage = 0;
  
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
// INICIALIZACIÓN
// ==================================================
window.addEventListener("load", () => {
  setRandomBackground();
  loadPlayersFromStorage();
  lockMenu(false);
  log.textContent = "¡Comienza el combate! · Turno de Jugador 1";
});
