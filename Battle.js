function realizarAtaque(atacante, enemigo) {
  const random = Math.random();
  let daño = 0;
  let resultado = "";

  if (random < atacante.probFallo) {
    resultado = "Fallo";

  } else if (random < atacante.probFallo + atacante.probCritico) {
    daño = atacante.ataque * atacante.multiCritico;
    resultado = "Critico";

  } else {
    daño = atacante.ataque;
    resultado = "Normal";
  }

  enemigo.vida -= daño;
  if (enemigo.vida < 0) enemigo.vida = 0;

  return {
    resultado,
    daño,
    vidaRestante: enemigo.vida
  };
}

export default realizarAtaque;
