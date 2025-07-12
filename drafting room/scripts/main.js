// Project management for Drafting Room

// Grab DOM elements
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
const wordCount = document.getElementById('word-count');
const sceneGoal = document.getElementById('scene-goal');
const sceneEmotion = document.getElementById('scene-emotion');
const sceneCharacters = document.getElementById('scene-characters');
const desireSlider = document.getElementById('desire-slider');
const conflictSlider = document.getElementById('conflict-slider');
const revealSlider = document.getElementById('reveal-slider');

function showSection(id) {
  sceneEditor.classList.add('hidden');
  outlineSection.classList.add('hidden');
  storyCheckSection.classList.add('hidden');
  document.getElementById(id).classList.remove('hidden');
}

// Utility helpers
function saveProjectData(name, data) {
  localStorage.setItem(`project:${name}`, JSON.stringify(data));
}

function loadProjectData(name) {
  const raw = localStorage.getItem(`project:${name}`);
  return raw ? JSON.parse(raw) : null;
}

function listAllProjects() {
  return Object.keys(localStorage)
    .filter(k => k.startsWith('project:'))
    .map(k => k.slice(8));
}

// App state
let currentProject = null;
let currentSceneId = null;

// ------------------------ UI Rendering ------------------------ //
function refreshProjectList() {
  projectList.innerHTML = '';
  listAllProjects().forEach(name => {
    const btn = document.createElement('button');
    btn.textContent = name;
    btn.addEventListener('click', () => switchProject(name));
    projectList.appendChild(btn);
  });
}

function renderOutline() {
  if (!currentProject) return;
  outlineContainer.innerHTML = '';
  currentProject.scenes.forEach(scene => {
    const btn = document.createElement('button');
    btn.textContent = scene.title || 'Scene';
    btn.addEventListener('click', () => openScene(scene.id));
    outlineContainer.appendChild(btn);
  });
}

function updateWordCount() {
  const text = sceneText.value.trim();
  const count = text ? text.split(/\s+/).length : 0;
  wordCount.textContent = `Words: ${count}`;
}

// ------------------------ Actions ------------------------ //
function createProject() {
  const name = newProjectInput.value.trim();
  if (!name) return;
  const data = {
    name,
    scenes: [],
    notes: [],
    storyCheck: '',
    createdAt: Date.now()
  };
  saveProjectData(name, data);
  newProjectInput.value = '';
  currentProject = data;
  refreshProjectList();
  switchProject(name);
}

function switchProject(name) {
  const data = loadProjectData(name);
  if (!data) return;
  currentProject = data;
  storyCheckInput.value = data.storyCheck || '';
  renderOutline();
  storyCheckSection.classList.remove('hidden');
  outlineSection.classList.remove('hidden');
  sceneEditor.classList.add('hidden');
  currentSceneId = null;
}

function saveStoryCheck() {
  if (!currentProject) return;
  currentProject.storyCheck = storyCheckInput.value;
  saveProjectData(currentProject.name, currentProject);
}

function addScene() {
  if (!currentProject) return;
  const id = `scene-${Date.now()}`;
  const scene = { id, title: `Scene ${currentProject.scenes.length + 1}` };
  currentProject.scenes.push(scene);
  saveProjectData(currentProject.name, currentProject);
  renderOutline();
}

function openScene(sceneId) {
  currentSceneId = sceneId;
  fetch(`projects/${currentProject.name}/scenes/${sceneId}.json`)
    .then(res => res.json())
    .then(data => {
      sceneTitle.textContent = `✍️ Editing ${data.title}`;
      sceneText.value = data.content || '';
      sceneGoal.value = data.goal || '';
      sceneEmotion.value = data.emotion || '';
      sceneCharacters.value = data.characters || '';
      desireSlider.value = data.desire || 0;
      conflictSlider.value = data.conflict || 0;
      revealSlider.value = data.reveal || 0;
      updateWordCount();
      showSection('scene-editor');
    });
}

function saveScene() {
  if (!currentProject || !currentSceneId) return;

  const data = {
    title: sceneTitle.textContent.replace('✍️ Editing ', ''),
    content: sceneText.value,
    goal: sceneGoal.value,
    emotion: sceneEmotion.value,
    characters: sceneCharacters.value,
    desire: parseInt(desireSlider.value),
    conflict: parseInt(conflictSlider.value),
    reveal: parseInt(revealSlider.value)
  };

  fetch(`projects/${currentProject.name}/scenes/${currentSceneId}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(() => {
    alert('Scene saved!');
  });
}

function closeScene() {
  sceneEditor.classList.add('hidden');
  outlineSection.classList.remove('hidden');
  currentSceneId = null;
}

// ------------------------ Event Listeners ------------------------ //
window.addEventListener('load', refreshProjectList);
createProjectBtn.addEventListener('click', createProject);
saveStoryCheckBtn.addEventListener('click', saveStoryCheck);
addSceneBtn.addEventListener('click', addScene);
saveSceneBtn.addEventListener('click', saveScene);
closeSceneBtn.addEventListener('click', closeScene);
sceneText.addEventListener('input', updateWordCount);
