function realizarAtaque(atacante, enemigo){
    const probFallo = 0.15;
    const probCritico = 0.20;
    const multiCritico = 1.5;
    
    const random = Math.random();
    let daño = 0;
    let resultado = "";

    if( random < probFallo){
        daño = 0;
        resultado = "Fallo";
    }else if(random < probFallo + probCritico){
        daño = atacante.ataque * multiCritico;
        resultado = "Critico";
    }else{
        daño = atacante.ataque;
        resultado = "Normal";
    }
    enemigo.vida -= daño;
    return{
        resultado: resultado, 
        daño: daño,
        vidaRestante: enemigo.vida
    }
}

export default realizarAtaque;