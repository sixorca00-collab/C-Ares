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
// SKILL 4 - ULTIMATE HABILITIES
// ==================================================
const ultimateAttacks = {
  arco: {
    name: "Lluvia de Flechas",
    damage: 45,
    condition: {
      type: "distance", // Requiere distancia (turnos sin recibir daño)
      value: 2, // 2 turnos sin ser golpeado
      current: 0
    },
    effect: "pierce", // Ignora defensas
    description: "Dispara una lluvia de flechas que ignora defensas"
  },
  escudo: {
    name: "Regeneración Titanica",
    damage: 25,
    condition: {
      type: "damageTaken", // Requiere haber recibido cierto daño
      value: 50, // Haber recibido 50+ de daño en total
      current: 0
    },
    effect: "selfHeal", //Se cura a sí mismo
    healMultiplier: 0.4, // Se cura 40% del daño máximo
    description: "El Escudo se regenera con fuerza titánica"
  },
  espada: {
    name: "Asalto Definitivo",
    damage: 50,
    condition: {
      type: "combo", // Requiere combo de ataques exitosos
      value: 3, // 3 ataques seguidos que impacten
      current: 0
    },
    effect: "execute", // Daño extra si el enemigo está bajo cierta vida
    executeThreshold: 0.3, // +50% daño si enemigo <30% vida
    description: "Ataque devastador tras una racha de éxitos"
  },
  lanza: {
    name: "Estocada Perfecta",
    damage: 40,
    condition: {
      type: "precision", // Requiere precisión (no fallar ataques)
      value: 2, // 2 ataques seguidos sin fallar
      current: 0
    },
    effect: "stun", // Aturde al enemigo (pierde 1 turno)
    stunChance: 0.7, // 70% de aturdir
    description: "Estocada precisa que puede aturdir al oponente"
  }
};

// Añadir al estado del juego
let player1UltimateReady = false;
let player2UltimateReady = false;

let player1TurnsWithoutDamage = 0;
let player2TurnsWithoutDamage = 0;

let player1TotalDamageTaken = 0;
let player2TotalDamageTaken = 0;

let player1ComboCount = 0;
let player2ComboCount = 0;

let player1PrecisionCount = 0;
let player2PrecisionCount = 0;

let player1Stunned = false;
let player2Stunned = false;
let player1StunTurns = 0;
let player2StunTurns = 0;

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
// FUNCIONES AUXILIARES ULTIMATE
// ==================================================
function resetUltimateCondition(player) {
  if (player === "player1") {
    const ultimate = ultimateAttacks[player1Character];
    if (ultimate) {
      switch(ultimate.condition.type) {
        case "distance": player1TurnsWithoutDamage = 0; break;
        case "damageTaken": player1TotalDamageTaken = 0; break;
        case "combo": player1ComboCount = 0; break;
        case "precision": player1PrecisionCount = 0; break;
      }
    }
  } else {
    const ultimate = ultimateAttacks[player2Character];
    if (ultimate) {
      switch(ultimate.condition.type) {
        case "distance": player2TurnsWithoutDamage = 0; break;
        case "damageTaken": player2TotalDamageTaken = 0; break;
        case "combo": player2ComboCount = 0; break;
        case "precision": player2PrecisionCount = 0; break;
      }
    }
  }
}

function getUltimateConditionText(player) {
  const characterKey = player === "player1" ? player1Character : player2Character;
  const ultimate = ultimateAttacks[characterKey];
  const isReady = player === "player1" ? player1UltimateReady : player2UltimateReady;
  
  if (!ultimate) return "";
  
  if (isReady) return "¡ULTIMATE LISTO!";
  
  switch(ultimate.condition.type) {
    case "distance":
      const turns = player === "player1" ? player1TurnsWithoutDamage : player2TurnsWithoutDamage;
      return `(${turns}/${ultimate.condition.value} turnos sin daño)`;
      
    case "damageTaken":
      const damage = player === "player1" ? player1TotalDamageTaken : player2TotalDamageTaken;
      return `(${damage}/${ultimate.condition.value} daño recibido)`;
      
    case "combo":
      const combo = player === "player1" ? player1ComboCount : player2ComboCount;
      return `(${combo}/${ultimate.condition.value} ataques seguidos)`;
      
    case "precision":
      const precision = player === "player1" ? player1PrecisionCount : player2PrecisionCount;
      return `(${precision}/${ultimate.condition.value} ataques sin fallar)`;
  }
  
  return "";
}

// ==================================================
// APLICAR EFECTOS DE ULTIMATE
// ==================================================
function applyUltimateEffect(attacker, effect, ultimate) {
  if (effect === "stun") {
    const target = attacker === "player1" ? "player2" : "player1";
    if (target === "player1") {
      player1Stunned = true;
      player1StunTurns = 1;
      log.textContent += ` · ${characters[player2Character].nombre} aturde a ${characters[player1Character].nombre}`;
    } else {
      player2Stunned = true;
      player2StunTurns = 1;
      log.textContent += ` · ${characters[player1Character].nombre} aturde a ${characters[player2Character].nombre}`;
    }
  }
  
  if (effect === "shield" && ultimate.effect === "shieldAllies") {
    const target = attacker === "player1" ? "player1" : "player2";
    if (target === "player1") {
      player1DefenseBuff = {
        name: "Muro Impenetrable",
        effect: "shield",
        value: ultimate.shieldValue,
        duration: 2
      };
      player1DefenseTurns = 2;
      log.textContent += ` · ${characters[player1Character].nombre} obtiene escudo de ${ultimate.shieldValue}`;
    } else {
      player2DefenseBuff = {
        name: "Muro Impenetrable",
        effect: "shield",
        value: ultimate.shieldValue,
        duration: 2
      };
      player2DefenseTurns = 2;
      log.textContent += ` · ${characters[player2Character].nombre} obtiene escudo de ${ultimate.shieldValue}`;
    }
  }
  
  // NUEVO: EFECTO DE CURACIÓN
  if (effect === "selfHeal") {
    const target = attacker === "player1" ? "player1" : "player2";
    const charKey = target === "player1" ? player1Character : player2Character;
    const maxHP = characters[charKey].vida;
    const healAmount = Math.round(maxHP * ultimate.healMultiplier);
    
    if (target === "player1") {
      player1HP = Math.min(player1HP + healAmount, maxHP);
      log.textContent += ` · ${characters[player1Character].nombre} se cura ${healAmount} HP`;
    } else {
      player2HP = Math.min(player2HP + healAmount, maxHP);
      log.textContent += ` · ${characters[player2Character].nombre} se cura ${healAmount} HP`;
    }
    
    // Actualizar barras de vida
    updateLifeBars();
  }
}
// ==================================================
// CALCULAR ULTIMATE
// ==================================================
function calculateUltimateAttack(attacker) {
  const characterKey = attacker === "player1" ? player1Character : player2Character;
  const ultimate = ultimateAttacks[characterKey];
  
  if (!ultimate || !(attacker === "player1" ? player1UltimateReady : player2UltimateReady)) {
    return null;
  }
  
  let damage = ultimate.damage;
  let result = ultimate.name;
  let effect = ultimate.effect;
  
  // Aplicar efectos especiales
  switch(ultimate.effect) {
    case "pierce":
      result += " (Perfora defensas)";
      break;
      
    case "execute":
      const targetHP = attacker === "player1" ? player2HP : player1HP;
      const targetMaxHP = attacker === "player1" ? player2MaxHP : player1MaxHP;
      const hpPercent = targetHP / targetMaxHP;
      
      if (hpPercent < ultimate.executeThreshold) {
        damage = Math.round(damage * 1.5);
        result += " (Ejecución +50%)";
      }
      break;
      
    case "stun":
      const stunRoll = Math.random();
      if (stunRoll < ultimate.stunChance) {
        effect = "stun";
        result += " (¡Aturde!)";
      } else {
        effect = null; // No aplica stun
        result += " (Sin efecto)";
      }
      break;
      
    case "selfHeal":
      // Para el Escudo, calculamos la curación
      const charKey = attacker === "player1" ? player1Character : player2Character;
      const maxHP = characters[charKey].vida;
      const healAmount = Math.round(maxHP * ultimate.healMultiplier);
      result += ` (Cura ${healAmount} HP)`;
      break;
  }
  
  return {
    hit: true,
    damage: Math.round(damage),
    result,
    effect,
    ultimate: ultimate
  };
}

// ==================================================
// ACTUALIZAR CONDICIONES DE ULTIMATE
// ==================================================
function updateUltimateConditions(attacker, result) {
  const attackerKey = attacker === "player1" ? "player1" : "player2";
  const targetKey = attacker === "player1" ? "player2" : "player1";
  
  // Actualizar condiciones para el ATACANTE
  if (attackerKey === "player1" && player1Character) {
    const ultimate = ultimateAttacks[player1Character];
    
    if (ultimate.condition.type === "combo") {
      if (result.hit && (result.action === "attack" || result.action === "skill2")) {
        player1ComboCount++;
        if (player1ComboCount >= ultimate.condition.value) {
          player1UltimateReady = true;
        }
      } else if (!result.hit) {
        player1ComboCount = 0; // Reset combo si falla
      }
    }
    
    if (ultimate.condition.type === "precision") {
      if (result.action === "attack" || result.action === "skill2") {
        if (result.hit) {
          player1PrecisionCount++;
          if (player1PrecisionCount >= ultimate.condition.value) {
            player1UltimateReady = true;
          }
        } else {
          player1PrecisionCount = 0; // Reset precisión si falla
        }
      }
    }
  }
  
  if (attackerKey === "player2" && player2Character) {
    const ultimate = ultimateAttacks[player2Character];
    
    if (ultimate.condition.type === "combo") {
      if (result.hit && (result.action === "attack" || result.action === "skill2")) {
        player2ComboCount++;
        if (player2ComboCount >= ultimate.condition.value) {
          player2UltimateReady = true;
        }
      } else if (!result.hit) {
        player2ComboCount = 0;
      }
    }
    
    if (ultimate.condition.type === "precision") {
      if (result.action === "attack" || result.action === "skill2") {
        if (result.hit) {
          player2PrecisionCount++;
          if (player2PrecisionCount >= ultimate.condition.value) {
            player2UltimateReady = true;
          }
        } else {
          player2PrecisionCount = 0;
        }
      }
    }
  }
  
  // Actualizar condiciones para el OBJETIVO (daño recibido)
  if (result.damage > 0) {
    if (targetKey === "player1") {
      player1TotalDamageTaken += result.damage;
      player1TurnsWithoutDamage = 0; // Reset contador de distancia
      
      const ultimate = ultimateAttacks[player1Character];
      if (ultimate && ultimate.condition.type === "damageTaken") {
        if (player1TotalDamageTaken >= ultimate.condition.value) {
          player1UltimateReady = true;
        }
      }
    } else {
      player2TotalDamageTaken += result.damage;
      player2TurnsWithoutDamage = 0;
      
      const ultimate = ultimateAttacks[player2Character];
      if (ultimate && ultimate.condition.type === "damageTaken") {
        if (player2TotalDamageTaken >= ultimate.condition.value) {
          player2UltimateReady = true;
        }
      }
    }
  } else {
    // Incrementar contador de distancia si no recibió daño
    if (targetKey === "player1") {
      player1TurnsWithoutDamage++;
      const ultimate = ultimateAttacks[player1Character];
      if (ultimate && ultimate.condition.type === "distance") {
        if (player1TurnsWithoutDamage >= ultimate.condition.value) {
          player1UltimateReady = true;
        }
      }
    } else {
      player2TurnsWithoutDamage++;
      const ultimate = ultimateAttacks[player2Character];
      if (ultimate && ultimate.condition.type === "distance") {
        if (player2TurnsWithoutDamage >= ultimate.condition.value) {
          player2UltimateReady = true;
        }
      }
    }
  }
}

// ==================================================
// ACCIONES DE JUGADORES
// ==================================================
function selectAction(player, key) {
  if (menuLocked || currentTurn !== player || gameOver) return;
  
  // Verificar si está aturdido
  if ((player === "player1" && player1Stunned) || (player === "player2" && player2Stunned)) {
    log.textContent = `${player === "player1" ? characters[player1Character].nombre : characters[player2Character].nombre} está aturdido y no puede actuar`;
    if (player === "player1") {
      player1Stunned = false;
      player1StunTurns = 0;
    } else {
      player2Stunned = false;
      player2StunTurns = 0;
    }
    endTurn(player === "player1" ? "player2" : "player1", 1000);
    return;
  }
  
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
        updateUltimateConditions("player1", result);
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
          updateUltimateConditions("player1", result);
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
        // ULTIMATE
        const atk = calculateUltimateAttack("player1");
        if (atk) {
          result = {
            attacker: "player1",
            action: "ultimate",
            hit: atk.hit,
            damage: atk.damage,
            storedDamage: 0,
            blocked: false,
            effect: atk.effect,
            ultimate: atk.ultimate,
            text: `Jugador 1 usó ULTIMATE: ${atk.result}`
          };
          // Resetear ultimate después de usarlo
          player1UltimateReady = false;
          resetUltimateCondition("player1");
        } else {
          result = {
            attacker: "player1",
            action: "ultimate",
            hit: false,
            damage: 0,
            storedDamage: 0,
            blocked: false,
            text: "¡Ultimate no disponible! " + getUltimateConditionText("player1")
          };
        }
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
        updateUltimateConditions("player2", result);
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
          updateUltimateConditions("player2", result);
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
        // ULTIMATE (tecla Ñ)
        const atk = calculateUltimateAttack("player2");
        if (atk) {
          result = {
            attacker: "player2",
            action: "ultimate",
            hit: atk.hit,
            damage: atk.damage,
            storedDamage: 0,
            blocked: false,
            effect: atk.effect,
            ultimate: atk.ultimate,
            text: `Jugador 2 usó ULTIMATE: ${atk.result}`
          };
          // Resetear ultimate después de usarlo
          player2UltimateReady = false;
          resetUltimateCondition("player2");
        } else {
          result = {
            attacker: "player2",
            action: "ultimate",
            hit: false,
            damage: 0,
            storedDamage: 0,
            blocked: false,
            text: "¡Ultimate no disponible! " + getUltimateConditionText("player2")
          };
        }
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
function playTurn(result) {
  clearAnimations();
  
  let statusInfo = "";
  
  // Info de debuffs y defensas
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
  
  // Info de stun
  if (player1Stunned) {
    const charName = characters[player1Character]?.nombre || "Jugador 1";
    statusInfo += ` [${charName} aturdido]`;
  }
  if (player2Stunned) {
    const charName = characters[player2Character]?.nombre || "Jugador 2";
    statusInfo += ` [${charName} aturdido]`;
  }
  
  // Info de ultimate (solo si no está listo)
  if (!player1UltimateReady && player1Character) {
    const conditionText = getUltimateConditionText("player1");
    if (conditionText) {
      statusInfo += ` [Ultimate: ${conditionText}]`;
    }
  }
  if (!player2UltimateReady && player2Character) {
    const conditionText = getUltimateConditionText("player2");
    if (conditionText) {
      statusInfo += ` [Ultimate: ${conditionText}]`;
    }
  }
  
  log.textContent = result.text + statusInfo;

  if (result.attacker === "player1") {
    animatePlayer(result, player1, player2, "player2");
  } else {
    animatePlayer(result, player2, player1, "player1");
  }
}

// ==================================================
// ANIMACIONES (MODIFICADA PARA EL ESCUDO)
// ==================================================
function animatePlayer(result, attackerEl, targetEl, nextPlayer) {
  const character = result.attacker === "player1" ? player1Character : player2Character;
  const charData = characters[character];
  
  // Determinar qué imagen mostrar según la acción
  if (result.action === "attack") {
    attackerEl.src = charData.attack;
    attackerEl.classList.add("attack");
  } else if (result.action === "skill2" || result.action === "skill" || result.action === "ultimate") {
    attackerEl.src = charData.skill;
    attackerEl.classList.add("attack");
  } else if (result.action === "skill3") {
    attackerEl.src = charData.defend;
    attackerEl.classList.add("defend");
  }

  // Aplicar daño si corresponde
  if ((result.action === "attack" || result.action === "skill" || result.action === "skill2" || result.action === "ultimate") && result.hit) {
    setTimeout(() => {
      if (!result.blocked) {
        targetEl.classList.add("hit");
      }
      
      // Aplicar daño principal
      if (result.attacker === "player1") {
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
      
      // Aplicar efectos especiales
      if (result.debuff && result.action === "skill2") {
        applyDebuff(result.attacker, result.debuff);
      }
      
      if (result.effect && result.action === "ultimate") {
        applyUltimateEffect(result.attacker, result.effect, result.ultimate);
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
function restartBattle() {
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
  
  // Resetear ultimate
  player1UltimateReady = false;
  player2UltimateReady = false;
  player1TurnsWithoutDamage = 0;
  player2TurnsWithoutDamage = 0;
  player1TotalDamageTaken = 0;
  player2TotalDamageTaken = 0;
  player1ComboCount = 0;
  player2ComboCount = 0;
  player1PrecisionCount = 0;
  player2PrecisionCount = 0;
  player1Stunned = false;
  player2Stunned = false;
  player1StunTurns = 0;
  player2StunTurns = 0;
  
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
