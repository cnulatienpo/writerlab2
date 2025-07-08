// File: js/compare.js

let vignetteData = [];
let currentIndex = 0;
let currentEntry = null;

window.onload = async function () {
  const res = await fetch('../data/compare-the-vignettes.json');
  vignetteData = await res.json();
  currentIndex = 0;
  showVignette();
};

function showVignette() {
  currentEntry = vignetteData[currentIndex];
  const element = currentEntry.element.toLowerCase();

  const textA = currentEntry.vignette_a.text.map(line => {
    return line.highlight
      ? `<span class="highlight-${element}">${line.sentence}</span>`
      : line.sentence;
  }).join(' ');

  const textB = currentEntry.vignette_b.text.map(line => {
    return line.highlight
      ? `<span class="highlight-${element}">${line.sentence}</span>`
      : line.sentence;
  }).join(' ');

  document.getElementById('text-a').innerHTML = textA;
  document.getElementById('text-b').innerHTML = textB;
  document.getElementById('feedback').style.display = 'none';
  document.getElementById('choice').style.display = 'block';
}

function submitAnswer(choice) {
  const correct = currentEntry.correct_answer;
  const feedback = currentEntry.feedback;
  let text = '';
  if (choice === correct) {
    text = `✅ Correct! ${feedback}`;
  } else {
    text = `❌ Not quite. ${feedback}`;
  }
  document.getElementById('feedback-text').textContent = text;
  document.getElementById('feedback').style.display = 'block';
  document.getElementById('choice').style.display = 'none';
}

function nextVignette() {
  currentIndex++;
  if (currentIndex >= vignetteData.length) {
    currentIndex = 0; // or end the game
    alert('That was the last one! Starting over.');
  }
  showVignette();
}
