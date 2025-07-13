// File: games/rate.js

let currentIndex = 0;
let currentVignette = null;

function loadVignette() {
  currentVignette = vignetteData[currentIndex];
  document.getElementById("vignette-text").textContent = currentVignette.text;
  document.getElementById("feedback").style.display = "none";
  document.querySelector(".result-message").textContent = "";
  document.querySelector(".explanation").textContent = "";
  document.getElementById("guess-form").reset();
}

function submitGuess(guess) {
  const correct = currentVignette.answer.toLowerCase();
  const explanation = currentVignette.options.find(opt => opt.label === correct)?.explanation || "";

  const resultText = guess === correct ? "✅ Correct!" : `❌ Nope — it was ${correct.toUpperCase()}`;
  document.querySelector(".result-message").textContent = resultText;
  document.querySelector(".explanation").textContent = explanation;
  document.getElementById("feedback").style.display = "block";
}

function nextVignette() {
  currentIndex++;
  if (currentIndex >= vignetteData.length) {
    currentIndex = 0; // loop back to start
  }
  loadVignette();
}

// Intercept form submit
const form = document.getElementById("guess-form");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const selected = form.querySelector("input[name='strength']:checked");
  if (selected) {
    submitGuess(selected.value);
  }
});

// Initial load
loadVignette();
