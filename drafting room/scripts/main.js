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
let currentSceneIndex = null;

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
  currentProject.scenes.forEach((scene, idx) => {
    const btn = document.createElement('button');
    btn.textContent = scene.title || `Scene ${idx + 1}`;
    btn.addEventListener('click', () => openScene(idx));
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
  currentSceneIndex = null;
}

function saveStoryCheck() {
  if (!currentProject) return;
  currentProject.storyCheck = storyCheckInput.value;
  saveProjectData(currentProject.name, currentProject);
}

function addScene() {
  if (!currentProject) return;
  const scene = { title: `Scene ${currentProject.scenes.length + 1}`, text: '' };
  currentProject.scenes.push(scene);
  saveProjectData(currentProject.name, currentProject);
  renderOutline();
}

function openScene(index) {
  currentSceneIndex = index;
  const scene = currentProject.scenes[index];
  sceneTitle.textContent = `✍️ ${scene.title}`;
  sceneText.value = scene.text || '';
  sceneEditor.classList.remove('hidden');
  outlineSection.classList.add('hidden');
  updateWordCount();
}

function saveScene() {
  if (currentProject && currentSceneIndex !== null) {
    currentProject.scenes[currentSceneIndex].text = sceneText.value;
    saveProjectData(currentProject.name, currentProject);
    updateWordCount();
  }
}

function closeScene() {
  sceneEditor.classList.add('hidden');
  outlineSection.classList.remove('hidden');
  currentSceneIndex = null;
}

// ------------------------ Event Listeners ------------------------ //
window.addEventListener('load', refreshProjectList);
createProjectBtn.addEventListener('click', createProject);
saveStoryCheckBtn.addEventListener('click', saveStoryCheck);
addSceneBtn.addEventListener('click', addScene);
saveSceneBtn.addEventListener('click', saveScene);
closeSceneBtn.addEventListener('click', closeScene);
sceneText.addEventListener('input', updateWordCount);
