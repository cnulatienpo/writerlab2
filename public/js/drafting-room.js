// ===============================================
// DRAFTING ROOM - INTEGRATED FUNCTIONALITY
// ===============================================

// DOM Elements
const projectList = document.getElementById('project-list');
const createProjectBtn = document.getElementById('create-project');
const newProjectInput = document.getElementById('new-project-name');

const storyCheckSection = document.getElementById('story-check');
const storyCheckInput = document.getElementById('story-check-input');
const saveStoryCheckBtn = document.getElementById('save-story-check');

const outlineSection = document.getElementById('outline');
const outlineContainer = document.getElementById('outline-container');
const addSceneBtn = document.getElementById('add-scene');

const sceneEditor = document.getElementById('scene-editor');
const sceneTitle = document.getElementById('scene-title');
const sceneText = document.getElementById('scene-text');
const saveSceneBtn = document.getElementById('save-scene');
const closeSceneBtn = document.getElementById('close-scene');

const drawer = document.getElementById('slideout-drawer');
const toggleDrawerBtn = document.getElementById('toggle-drawer');

const junkDrawer = document.getElementById('junk-drawer');
const toggleJunkDrawerBtn = document.getElementById('toggle-junk');
const addNoteBtn = document.getElementById('add-note');
const notesContainer = document.getElementById('notes-container');

const wordCount = document.getElementById('word-count');
const visualizerSection = document.getElementById('visualizer-section');
const toggleVisualizerBtn = document.getElementById('toggle-visualizer');

const feedbackTray = document.getElementById('feedback-tray');
const feedbackContent = document.getElementById('feedback-content');

// Scene Notes Inputs
const sceneGoal = document.getElementById('scene-goal');
const sceneEmotion = document.getElementById('scene-emotion');
const sceneCharacters = document.getElementById('scene-characters');
const desireSlider = document.getElementById('desire-slider');
const conflictSlider = document.getElementById('conflict-slider');
const revealSlider = document.getElementById('reveal-slider');

// State
let currentProject = null;
let projects = {};
let currentSceneIndex = null;
let autosaveTimer;

// ===============================================
// CORE PROJECT MANAGEMENT
// ===============================================

// Load from localStorage
function loadProjects() {
  const saved = localStorage.getItem('drafting-projects');
  if (saved) projects = JSON.parse(saved);
}

// Save to localStorage
function saveProjects() {
  localStorage.setItem('drafting-projects', JSON.stringify(projects));
}

// Render all projects
function renderProjects() {
  projectList.innerHTML = '';
  Object.keys(projects).forEach(name => {
    const div = document.createElement('div');
    div.textContent = name;
    div.classList.add('project-entry');
    div.onclick = () => loadProject(name);
    projectList.appendChild(div);
  });
}

// Create project
function createProject() {
  const name = newProjectInput.value.trim();
  if (!name || projects[name]) return;
  projects[name] = {
    storyCheck: '',
    scenes: []
  };
  newProjectInput.value = '';
  saveProjects();
  renderProjects();
}

// Load project
function loadProject(name) {
  currentProject = name;
  storyCheckInput.value = projects[name].storyCheck || '';
  renderOutline();
  storyCheckSection.classList.remove('hidden');
  outlineSection.classList.remove('hidden');
  sceneEditor.classList.add('hidden');
  drawer.classList.add('hidden');
  updateSceneSidebar();
}

// Save Story Check
function saveStoryCheck() {
  if (!currentProject) return;
  projects[currentProject].storyCheck = storyCheckInput.value;
  saveProjects();
}

// ===============================================
// SCENE MANAGEMENT
// ===============================================

// Update word count
function updateWordCount() {
  const text = sceneText.value.trim();
  const count = text ? text.split(/\s+/).length : 0;
  wordCount.textContent = `Words: ${count}`;
}

// Render outline
function renderOutline() {
  outlineContainer.innerHTML = '';
  projects[currentProject].scenes.forEach((scene, index) => {
    const btn = document.createElement('div');
    btn.textContent = scene.title || `Scene ${index + 1}`;
    btn.classList.add('scene-card');
    btn.onclick = () => editScene(index);
    outlineContainer.appendChild(btn);
  });
}

// Add Scene
function addScene() {
  if (!currentProject) return;
  const title = prompt('Scene title:') || `Scene ${projects[currentProject].scenes.length + 1}`;
  const newScene = {
    title: title,
    text: '',
    notes: {}
  };
  projects[currentProject].scenes.push(newScene);
  saveProjects();
  renderOutline();
  updateSceneSidebar();
}

// Edit Scene
function editScene(index) {
  currentSceneIndex = index;
  const scene = projects[currentProject].scenes[index];
  sceneTitle.textContent = `✍️ ${scene.title}`;
  sceneText.value = scene.text || '';
  
  // Load scene notes
  const notes = scene.notes || {};
  sceneGoal.value = notes.goal || '';
  sceneEmotion.value = notes.emotion || '';
  sceneCharacters.value = notes.characters || '';
  desireSlider.value = notes.desire || 0;
  conflictSlider.value = notes.conflict || 0;
  revealSlider.value = notes.reveal || 0;
  
  sceneEditor.classList.remove('hidden');
  outlineSection.classList.add('hidden');
  drawer.classList.add('hidden');
  updateWordCount();
}

// Save Scene
function saveScene() {
  if (!currentProject || currentSceneIndex === null) return;
  
  const scene = projects[currentProject].scenes[currentSceneIndex];
  scene.text = sceneText.value;
  scene.notes = {
    goal: sceneGoal.value,
    emotion: sceneEmotion.value,
    characters: sceneCharacters.value,
    desire: parseInt(desireSlider.value),
    conflict: parseInt(conflictSlider.value),
    reveal: parseInt(revealSlider.value)
  };
  
  saveProjects();
  renderOutline();
  updateSceneSidebar();
  
  // Auto-analyze scene with Ray Ray
  if (scene.text.trim()) {
    analyzeSceneWithRayRay(scene);
  }
}

// Auto-save scene
function autosaveScene() {
  clearTimeout(autosaveTimer);
  autosaveTimer = setTimeout(() => {
    saveScene();
    updateWordCount();
  }, 1000);
}

// Close Scene Editor
function closeScene() {
  saveScene();
  currentSceneIndex = null;
  sceneEditor.classList.add('hidden');
  outlineSection.classList.remove('hidden');
  drawer.classList.add('hidden');
}

// Update Scene Sidebar
function updateSceneSidebar() {
  const sceneList = document.getElementById('scene-list');
  sceneList.innerHTML = '';
  
  if (currentProject && projects[currentProject]) {
    projects[currentProject].scenes.forEach((scene, index) => {
      const li = document.createElement('li');
      li.textContent = scene.title || `Scene ${index + 1}`;
      li.onclick = () => editScene(index);
      if (index === currentSceneIndex) {
        li.classList.add('active');
      }
      sceneList.appendChild(li);
    });
  }
}

// ===============================================
// SCENE NOTES MANAGEMENT
// ===============================================

// Save scene notes
function saveSceneNotes() {
  if (!currentProject || currentSceneIndex === null) return;
  const scene = projects[currentProject].scenes[currentSceneIndex];
  scene.notes = {
    goal: sceneGoal.value,
    emotion: sceneEmotion.value,
    characters: sceneCharacters.value,
    desire: parseInt(desireSlider.value),
    conflict: parseInt(conflictSlider.value),
    reveal: parseInt(revealSlider.value)
  };
  saveProjects();
}

// ===============================================
// JUNK DRAWER NOTES
// ===============================================

const JUNK_KEY = 'junkDrawerNotes';
let junkDrawerNotes = [];

function saveJunkDrawer(notes) {
  localStorage.setItem(JUNK_KEY, JSON.stringify(notes));
}

function appendJunkNote(note) {
  const wrapper = document.createElement('div');
  wrapper.className = 'junk-note-wrapper';

  const textarea = document.createElement('textarea');
  textarea.value = note.content;
  textarea.dataset.id = note.id;
  textarea.addEventListener('input', (e) => {
    const id = e.target.dataset.id;
    const idx = junkDrawerNotes.findIndex(n => n.id === id);
    if (idx !== -1) {
      junkDrawerNotes[idx].content = e.target.value;
      saveJunkDrawer(junkDrawerNotes);
    }
  });

  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  delBtn.addEventListener('click', () => {
    const idx = junkDrawerNotes.findIndex(n => n.id === note.id);
    if (idx !== -1) {
      junkDrawerNotes.splice(idx, 1);
      saveJunkDrawer(junkDrawerNotes);
      wrapper.remove();
    }
  });

  wrapper.appendChild(textarea);
  wrapper.appendChild(delBtn);
  notesContainer.appendChild(wrapper);
}

function loadJunkDrawer() {
  const data = localStorage.getItem(JUNK_KEY);
  junkDrawerNotes = data ? JSON.parse(data) : [];
  notesContainer.innerHTML = '';
  junkDrawerNotes.forEach(note => appendJunkNote(note));
}

function addJunkNote() {
  const note = { id: `note-${Date.now()}`, content: '' };
  junkDrawerNotes.push(note);
  appendJunkNote(note);
  saveJunkDrawer(junkDrawerNotes);
}

// ===============================================
// VISUALIZER FUNCTIONS
// ===============================================

function toggleLayer(layerId) {
  const el = document.getElementById(layerId);
  if (!el) return;
  el.style.display = (el.style.display === 'none') ? 'block' : 'none';
}

function drawMotifLayer(data) {
  const canvas = document.getElementById('motif-layer');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Background
  ctx.fillStyle = 'rgba(178, 215, 255, 0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Title
  ctx.fillStyle = '#17496b';
  ctx.font = "24px 'Space Grotesk', sans-serif";
  ctx.fillText("Motif Map", 20, 40);
  
  // Sample visualization
  if (data && data.motifs) {
    data.motifs.forEach((motif, index) => {
      ctx.fillStyle = '#2481c7';
      ctx.fillRect(50 + index * 60, 80, 40, motif.count * 10);
      ctx.fillStyle = '#17496b';
      ctx.font = "12px 'Space Grotesk', sans-serif";
      ctx.fillText(motif.word, 50 + index * 60, 75);
    });
  }
}

function drawEmotionLayer(data) {
  const canvas = document.getElementById('emotion-layer');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = 'rgba(255, 224, 178, 0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#885518';
  ctx.font = "24px 'Space Grotesk', sans-serif";
  ctx.fillText("Emotion Heatmap", 20, 40);
}

function drawCharacterLayer(data) {
  const canvas = document.getElementById('character-layer');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = 'rgba(226, 178, 255, 0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#532766';
  ctx.font = "24px 'Space Grotesk', sans-serif";
  ctx.fillText("Character Timeline", 20, 40);
}

function drawPacingLayer(data) {
  const canvas = document.getElementById('pacing-layer');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = 'rgba(178, 255, 226, 0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#176b56';
  ctx.font = "24px 'Space Grotesk', sans-serif";
  ctx.fillText("Pacing Graph", 20, 40);
}

function drawStructureLayer(data) {
  const canvas = document.getElementById('structure-layer');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = 'rgba(255, 250, 178, 0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#99861d';
  ctx.font = "24px 'Space Grotesk', sans-serif";
  ctx.fillText("Structure Flow", 20, 40);
}

function drawThemeLayer(data) {
  const canvas = document.getElementById('theme-layer');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = 'rgba(255, 194, 178, 0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = '#a0341a';
  ctx.font = "24px 'Space Grotesk', sans-serif";
  ctx.fillText("Theme Network", 20, 40);
}

function redrawAllLayers(data) {
  drawMotifLayer(data);
  drawEmotionLayer(data);
  drawCharacterLayer(data);
  drawPacingLayer(data);
  drawStructureLayer(data);
  drawThemeLayer(data);
}

// ===============================================
// RAY RAY CHAT FUNCTIONALITY
// ===============================================

function toggleRayRay() {
  const container = document.getElementById('rayray-container');
  const arrow = container.querySelector('#rayray-header span:last-child');
  
  container.classList.toggle('open');
  arrow.textContent = container.classList.contains('open') ? '▼' : '▶';
}

function getAllScenes() {
  if (!currentProject || !projects[currentProject]) return [];
  return projects[currentProject].scenes;
}

function addFeedbackToTray(sceneTitle, feedback) {
  feedbackContent.innerHTML = `
    <strong>${sceneTitle}</strong><br>
    ${feedback}
  `;
}

function analyzeSceneWithRayRay(scene) {
  const messages = [
    {
      role: "system",
      content: "You are Ray Ray, a helpful writing assistant. Analyze the given scene and provide constructive feedback focusing on narrative elements, pacing, and character development. Keep your response concise and actionable."
    },
    {
      role: "user",
      content: `Please analyze this scene: "${scene.title}"\n\n${scene.text}`
    }
  ];

  fetch('/api/deepseek/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages,
      temperature: 0.7,
      max_tokens: 300
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const feedback = data.choices[0].message.content;
      addFeedbackToTray(scene.title, feedback);
      
      // Update visualization with analysis
      redrawAllLayers({
        motifs: [
          { word: "tension", count: 3 },
          { word: "conflict", count: 2 },
          { word: "resolve", count: 1 }
        ]
      });
    }
  })
  .catch(error => {
    console.error('Error getting Ray Ray feedback:', error);
    addFeedbackToTray(scene.title, 'Error getting feedback. Please try again.');
  });
}

function sendRayRay() {
  const input = document.getElementById('rayray-input');
  const msg = input.value.trim();
  if (!msg) return;

  // Display user message
  const messages = document.getElementById('rayray-messages');
  const userMsg = document.createElement('div');
  userMsg.style.color = '#85e1ff';
  userMsg.textContent = "You: " + msg;
  messages.appendChild(userMsg);

  // Find scene context
  const scenes = getAllScenes();
  let foundScene = null;
  for (let scene of scenes) {
    if (msg.toLowerCase().includes(scene.title.toLowerCase())) {
      foundScene = scene;
      break;
    }
  }

  // Show loading
  const loadingMsg = document.createElement('div');
  loadingMsg.style.color = '#ffe877';
  loadingMsg.textContent = 'Ray Ray: Thinking...';
  messages.appendChild(loadingMsg);

  // Call Ray Ray API
  const chatMessages = [
    {
      role: "system",
      content: "You are Ray Ray, a helpful writing assistant. Respond to the user's question about their writing. If they mention a specific scene, provide targeted feedback."
    },
    {
      role: "user",
      content: foundScene 
        ? `${msg}\n\nScene context: "${foundScene.title}"\n${foundScene.text}`
        : msg
    }
  ];

  fetch('/api/deepseek/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 200
    })
  })
  .then(response => response.json())
  .then(data => {
    messages.removeChild(loadingMsg);
    
    const botMsg = document.createElement('div');
    botMsg.style.color = '#ffe877';
    botMsg.style.marginBottom = '8px';
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      botMsg.textContent = "Ray Ray: " + data.choices[0].message.content;
      
      if (foundScene) {
        addFeedbackToTray(foundScene.title, data.choices[0].message.content);
      }
    } else {
      botMsg.textContent = "Ray Ray: I'm having trouble understanding. Could you rephrase that?";
    }
    
    messages.appendChild(botMsg);
    messages.scrollTop = messages.scrollHeight;
  })
  .catch(error => {
    messages.removeChild(loadingMsg);
    console.error('Error:', error);
    
    const botMsg = document.createElement('div');
    botMsg.style.color = '#ffe877';
    botMsg.textContent = "Ray Ray: Sorry, I'm having connection issues. Please try again.";
    messages.appendChild(botMsg);
    messages.scrollTop = messages.scrollHeight;
  });

  input.value = "";
}

// ===============================================
// EVENT LISTENERS
// ===============================================

// Project management
createProjectBtn.onclick = createProject;
saveStoryCheckBtn.onclick = saveStoryCheck;

// Scene management
addSceneBtn.onclick = addScene;
saveSceneBtn.onclick = saveScene;
closeSceneBtn.onclick = closeScene;
sceneText.addEventListener('input', autosaveScene);

// Scene notes auto-save
[sceneGoal, sceneEmotion, sceneCharacters, desireSlider, conflictSlider, revealSlider].forEach(el => {
  el.addEventListener('input', saveSceneNotes);
});

// UI toggles
toggleDrawerBtn.onclick = () => drawer.classList.toggle('hidden');
toggleJunkDrawerBtn.onclick = () => junkDrawer.classList.toggle('hidden');
toggleVisualizerBtn.onclick = () => {
  visualizerSection.classList.toggle('hidden');
  if (!visualizerSection.classList.contains('hidden')) {
    redrawAllLayers();
  }
};

// Junk drawer
addNoteBtn.onclick = addJunkNote;

// ===============================================
// INITIALIZATION
// ===============================================

window.onload = function() {
  loadProjects();
  renderProjects();
  loadJunkDrawer();
  redrawAllLayers();
  
  // Initialize Ray Ray with welcome message
  const rayrayMessages = document.getElementById('rayray-messages');
  const welcomeMsg = document.createElement('div');
  welcomeMsg.style.color = '#ffe877';
  welcomeMsg.textContent = 'Ray Ray: Hello! I\'m here to help you with your writing. Ask me about your scenes or writing techniques!';
  rayrayMessages.appendChild(welcomeMsg);
};