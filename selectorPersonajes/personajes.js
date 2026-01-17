const cards = document.querySelectorAll(".card");//busca todas las tarjetas (.card)

const currentPlayerText = document.getElementById("currentPlayer"); //muestra que jugador esta escogiendo (titulo)

const goBattleBtn = document.getElementById("goBattle"); //boton de ir a la arena

let selected = [];      //array vacio
let currentPlayer = 1;  //

cards.forEach(card => {
  card.addEventListener("click", () => {
    if (selected.length >= 2) return;

    card.classList.add("flipped");
    selected.push(card.dataset.character);

    if (currentPlayer === 1) {
      currentPlayer = 2;
      currentPlayerText.textContent = "2";
    }

    if (selected.length === 2) {
      goBattleBtn.disabled = false;
    }
  });
});

goBattleBtn.addEventListener("click", () => {
  localStorage.setItem("player1", selected[0]);
  localStorage.setItem("player2", selected[1]);

  window.location.href = "../Combat.html"; 
});
