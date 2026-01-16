const playButton = document.getElementById("playButton");
const containerPlay = document.getElementById("containerPlayConformation");
const overlay = document.getElementById("overlay");
const bgMusic = document.getElementById("bgMusic");

playButton.addEventListener("click", () => {
  containerPlay.classList.add("active");
  overlay.classList.add("active");
  bgMusic.volume = 0.9;
  bgMusic.play();
});

const closeModal = () => {
  containerPlay.classList.remove("active");
  overlay.classList.remove("active");
};

overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});
