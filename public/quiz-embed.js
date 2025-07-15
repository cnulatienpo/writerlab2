// Quiz component for embedding in type profile pages
function createQuiz() {
  const quizHtml = `
    <div id="quiz-container" style="margin-top: 3rem; padding: 2rem; border-top: 2px solid #333;">
      <h2 style="margin-bottom: 1.5rem; color: #f4f4f4;">Test Your Writer Type</h2>
      <p style="margin-bottom: 1rem; line-height: 1.4;">Think this might be your type? Take our quick quiz to find out!</p>
      <div id="quiz-questions"></div>
      <button id="quiz-submit" style="margin-top: 1.5rem; padding: 0.75rem 1.5rem; font-size: 1rem; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; background: #f4f4f4; color: #111; display: none;">Submit Quiz</button>
      <div id="quiz-result" style="margin-top: 1.5rem; display: none;"></div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', quizHtml);
  
  // Load and display quiz
  loadQuiz();
}

async function loadQuiz() {
  try {
    const [qText, keyText] = await Promise.all([
      fetch('/quiz_data/quiz_questions').then(r => r.text()),
      fetch('/quiz_data/quiz_answer_key').then(r => r.text())
    ]);
    
    const questions = parseQuestions(qText);
    const answerKey = parseAnswerKey(keyText);
    
    displayQuiz(questions, answerKey);
  } catch (error) {
    console.error('Error loading quiz:', error);
    document.getElementById('quiz-questions').innerHTML = '<p>Error loading quiz. Please try again later.</p>';
  }
}

function parseQuestions(text) {
  const lines = text.split(/\r?\n/);
  const questions = [];
  let current = null;
  
  lines.forEach(line => {
    const questionMatch = line.match(/^(\d+)\.\s*(.+)/);
    if (questionMatch) {
      if (current) questions.push(current);
      current = { question: questionMatch[2], answers: [] };
    } else if (line.trim() !== '' && current) {
      current.answers.push(line.trim());
    }
  });
  
  if (current) questions.push(current);
  return questions;
}

function parseAnswerKey(text) {
  const map = {};
  text.split(/\r?\n/).forEach(line => {
    const match = line.match(/^(\d+)\s+(.+)/);
    if (match) {
      map[match[1]] = match[2].trim();
    }
  });
  return map;
}

function displayQuiz(questions, answerKey) {
  const questionsDiv = document.getElementById('quiz-questions');
  
  questions.forEach((q, i) => {
    const questionDiv = document.createElement('div');
    questionDiv.style.marginBottom = '1.5rem';
    questionDiv.style.padding = '1rem';
    questionDiv.style.border = '1px solid #333';
    questionDiv.style.borderRadius = '8px';
    
    const questionTitle = document.createElement('h3');
    questionTitle.textContent = q.question;
    questionTitle.style.marginBottom = '0.5rem';
    questionDiv.appendChild(questionTitle);
    
    const answersDiv = document.createElement('div');
    answersDiv.style.display = 'flex';
    answersDiv.style.flexDirection = 'column';
    answersDiv.style.gap = '0.5rem';
    
    q.answers.forEach((answer, idx) => {
      const label = document.createElement('label');
      label.style.cursor = 'pointer';
      label.style.padding = '0.5rem';
      label.style.borderRadius = '4px';
      label.style.transition = 'background-color 0.2s';
      
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = `q${i}`;
      input.value = idx + 1;
      input.style.marginRight = '0.5rem';
      
      label.appendChild(input);
      label.appendChild(document.createTextNode(answer));
      
      label.addEventListener('mouseenter', () => {
        label.style.backgroundColor = '#222';
      });
      
      label.addEventListener('mouseleave', () => {
        label.style.backgroundColor = 'transparent';
      });
      
      answersDiv.appendChild(label);
    });
    
    questionDiv.appendChild(answersDiv);
    questionsDiv.appendChild(questionDiv);
  });
  
  document.getElementById('quiz-submit').style.display = 'block';
  document.getElementById('quiz-submit').onclick = () => submitQuiz(questions, answerKey);
}

function submitQuiz(questions, answerKey) {
  const selections = [...document.querySelectorAll('input[type=radio]:checked')];
  
  if (selections.length !== questions.length) {
    alert('Please answer all questions before submitting.');
    return;
  }
  
  const counts = {};
  selections.forEach(selection => {
    const value = selection.value;
    counts[value] = (counts[value] || 0) + 1;
  });
  
  const maxCount = Math.max(...Object.values(counts));
  const winners = Object.keys(counts).filter(key => counts[key] === maxCount);
  
  const resultDiv = document.getElementById('quiz-result');
  resultDiv.innerHTML = '';
  resultDiv.style.display = 'block';
  
  if (winners.length > 1) {
    const p = document.createElement('p');
    p.textContent = 'You have a tie! Choose your preferred writer type:';
    resultDiv.appendChild(p);
    
    winners.forEach(num => {
      const type = answerKey[num];
      const button = document.createElement('button');
      button.textContent = type;
      button.style.margin = '0.5rem';
      button.style.padding = '0.5rem 1rem';
      button.style.border = 'none';
      button.style.borderRadius = '4px';
      button.style.cursor = 'pointer';
      button.style.backgroundColor = '#333';
      button.style.color = '#f4f4f4';
      button.onclick = () => showResult(type);
      resultDiv.appendChild(button);
    });
  } else {
    showResult(answerKey[winners[0]]);
  }
}

function showResult(type) {
  const slug = type.split(/[\s/]/)[0].toLowerCase();
  localStorage.setItem('writerType', slug);
  
  const resultDiv = document.getElementById('quiz-result');
  resultDiv.innerHTML = `
    <h3>Your Writer Type: ${type}</h3>
    <p>Based on your responses, you're a ${type}!</p>
    <div style="margin-top: 1rem;">
      <button onclick="location.href='/profile/${slug}'" style="margin-right: 1rem; padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; background: #f4f4f4; color: #111;">
        View Full Profile
      </button>
      <button onclick="location.href='/elements.html'" style="padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; background: #333; color: #f4f4f4;">
        Start Writing Game
      </button>
    </div>
  `;
}

// Initialize quiz when page loads
document.addEventListener('DOMContentLoaded', createQuiz);