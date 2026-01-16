const playButton = document.getElementById("playButton");
const containerPlay = document.getElementById("containerPlayConformation");

playButton.addEventListener("click", () => {
    containerPlay.classList.add("active");
});

containerPlay.addEventListener("click", (e) => {
    if (e.target === containerPlay) {
        containerPlay.classList.remove("active");
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        containerPlay.classList.remove("active");
    }
});
