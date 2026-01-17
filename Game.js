import lanza from "./Characters/Lanza.js";
import espada from "./Characters/Espada.js";
import escudo from "./Characters/Escudo.js";
import arco from "./Characters/Arco.js";
import realizarAtaque from "./ataque.js";


let jugador1 = lanza;
let jugador2 = espada;

let turno = 1; // 1 = jugador1, 2 = jugador2
let juegoTerminado = false;

function atacar() {
  if (juegoTerminado) return;

  let atacante;
  let defensor;

  if (turno === 1) {
    atacante = jugador1;
    defensor = jugador2;
  } else {
    atacante = jugador2;
    defensor = jugador1;
  }

  const resultado = realizarAtaque(atacante, defensor);

  console.log(
    `${atacante.nombre} ataca (${resultado.resultado}) y causa ${resultado.daño} de daño`
  );

  // Evitar vida negativa
  if (defensor.vida < 0) {
    defensor.vida = 0;
  }

  console.log(`${defensor.nombre} tiene ${defensor.vida} de vida`);

  // Verificar muerte
  if (defensor.vida === 0) {
    console.log(`${atacante.nombre} gana la pelea`);
    juegoTerminado = true;
    return;
  }

  // Cambiar turno
  turno = turno === 1 ? 2 : 1;
  console.log(`Turno de: ${turno === 1 ? jugador1.nombre : jugador2.nombre}`);
}

// Control del ataque (teclado)
document.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    atacar();
  }
});