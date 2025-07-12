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
const toggleJunkDrawerBtn = document.getElementById('toggle-junk-drawer');
const addNoteBtn = document.getElementById('add-note');
const notesContainer = document.getElementById('notes-container');

const wordCount = document.getElementById('word-count');

// State
let currentProject = null;
let projects = {};
let currentSceneIndex = null;

// Load from localStorage
window.onload = () => {
  const saved = localStorage.getItem('drafting-projects');
  if (saved) projects = JSON.parse(saved);
  renderProjects();
};

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
createProjectBtn.onclick = () => {
  const name = newProjectInput.value.trim();
  if (!name || projects[name]) return;
  projects[name] = {
    storyCheck: '',
    scenes: []
  };
  newProjectInput.value = '';
  saveProjects();
  renderProjects();
};

// Load project
function loadProject(name) {
  currentProject = name;
  storyCheckInput.value = projects[name].storyCheck || '';
  outlineContainer.innerHTML = '';
  projects[name].scenes.forEach((scene, index) => {
    const btn = document.createElement('button');
    btn.textContent = scene.title || `Scene ${index + 1}`;
    btn.onclick = () => editScene(index);
    outlineContainer.appendChild(btn);
  });
  storyCheckSection.classList.remove('hidden');
  outlineSection.classList.remove('hidden');
  sceneEditor.classList.add('hidden');
  drawer.classList.add('hidden');
}

// Save Story Check
saveStoryCheckBtn.onclick = () => {
  if (!currentProject) return;
  projects[currentProject].storyCheck = storyCheckInput.value;
  saveProjects();
};

// Add Scene
addSceneBtn.onclick = () => {
  if (!currentProject) return;
  const newScene = {
    title: `Scene ${projects[currentProject].scenes.length + 1}`,
    text: '',
    notes: {}
  };
  projects[currentProject].scenes.push(newScene);
  saveProjects();
  loadProject(currentProject);
};

// Edit Scene
function editScene(index) {
  currentSceneIndex = index;
  const scene = projects[currentProject].scenes[index];
  sceneTitle.textContent = `✍️ ${scene.title}`;
  sceneText.value = scene.text || '';
  sceneEditor.classList.remove('hidden');
  drawer.classList.add('hidden');
  updateWordCount();
}

// Save Scene
saveSceneBtn.onclick = () => {
  if (!currentProject || currentSceneIndex === null) return;
  projects[currentProject].scenes[currentSceneIndex].text = sceneText.value;
  saveProj
