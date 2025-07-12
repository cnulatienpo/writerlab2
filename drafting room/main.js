// Utilities
function $(id) {
  return document.getElementById(id);
}

// Persistent State
let projects = JSON.parse(localStorage.getItem('projects')) || {};
let currentProject = null;
let currentSceneIndex = null;

// DOM Elements
const projectList = $('project-list');
const sceneEditor = $('scene-editor');
const outline = $('outline');
const storyCheck = $('story-check');
const sceneTitle = $('scene-title');
const sceneText = $('scene-text');
const wordCount = $('word-count');

// UI Toggles
$('toggle-junk-drawer').onclick = () => {
  $('junk-drawer').classList.toggle('hidden');
};

$('toggle-drawer').onclick = () => {
  $('slideout-drawer').classList.toggle('hidden');
};

$('create-project').onclick = () => {
  const name = $('new-project-name').value.trim();
  if (!name || projects[name]) return;
  projects[name] = {
    storyCheck: '',
    scenes: []
  };
  $('new-project-name').value = '';
  saveProjects();
  renderProjectList();
};

function saveProjects() {
  localStorage.setItem('projects', JSON.stringify(projects));
}

function renderProjectList() {
  projectList.innerHTML = '';
  Object.keys(projects).forEach(name => {
    const btn = document.createElement('button');
    btn.textContent = name;
    btn.onclick = () => loadProject(name);
    projectList.appendChild(btn);
  });
}

function loadProject(name) {
  currentProject = name;
  currentSceneIndex = null;
  $('story-check-input').value = projects[name].storyCheck || '';
  $('outline-container').innerHTML = '';
  renderOutline();
  storyCheck.classList.remove('hidden');
  outline.classList.remove('hidden');
  sceneEditor.classList.add('hidden');
}

$('save-story-check').onclick = () => {
  if (!currentProject) return;
  projects[currentProject].storyCheck = $('story-check-input').value;
  saveProjects();
};

$('add-scene').onclick = () => {
  if (!currentProject) return;
  const newScene = {
    title: `Scene ${projects[currentProject].scenes.length + 1}`,
    text: '',
    goal: '',
    emotion: '',
    characters: '',
    sliders: {
      desire: 0,
      conflict: 0,
      reveal: 0
    }
  };
  projects[currentProject].scenes.push(newScene);
  saveProjects();
  renderOutline();
};

function renderOutline() {
  const container = $('outline-container');
  container.innerHTML = '';
  projects[currentProject].scenes.forEach((scene, index) => {
    const btn = document.createElement('button');
    btn.textContent = scene.title;
    btn.onclick = () => openScene(index);
    container.appendChild(btn);
  });
}

function openScene(index) {
  currentSceneIndex = index;
  const scene = projects[currentProject].scenes[index];
  sceneEditor.classList.remove('hidden');
  sceneTitle.textContent = `✍️ ${scene.title}`;
  sceneText.value = scene.text || '';
  wordCount.textContent = `Words: ${scene.text.split(/\s+/).filter(w => w).length}`;

  $('scene-goal').value = scene.goal || '';
  $('scene-emotion').value = scene.emotion || '';
  $('scene-characters').value = scene.characters || '';
  $('desire-slider').value = scene.sliders.desire;
  $('conflict-slider').value = scene.sliders.conflict;
  $('reveal-slider').value = scene.sliders.reveal;
}

sceneText.addEventListener('input', () => {
  const count = sceneText.value.split(/\s+/).filter(w => w).length;
  wordCount.textContent = `Words: ${count}`;
});

$('save-scene').onclick = () => {
  if (currentSceneIndex === null) return;
  const scene = projects[currentProject].scenes[currentSceneIndex];
  scene.text = sceneText.value;
  scene.goal = $('scene-goal').value;
  scene.emotion = $('scene-emotion').value;
  scene.characters = $('scene-characters').value;
  scene.sliders.desire = parseInt($('desire-slider').value);
  scene.sliders.conflict = parseInt($('conflict-slider').value);
  scene.sliders.reveal = parseInt($('reveal-slider').value);
  saveProjects();
};

$('close-scene').onclick = () => {
  sceneEditor.classList.add('hidden');
};

// Junk Drawer Notes
$('add-note').onclick = () => {
  const note = document.createElement('textarea');
  note.placeholder = 'Scratch something down...';
  note.classList.add('junk-note');
  note.addEventListener('input', saveJunkDrawer);
  $('notes-container').appendChild(note);
  saveJunkDrawer();
};

function saveJunkDrawer() {
  const notes = Array.from(document.querySelectorAll('.junk-note')).map(n => n.value);
  localStorage.setItem('junkDrawerNotes', JSON.stringify(notes));
}

function loadJunkDrawer() {
  const notes = JSON.parse(localStorage.getItem('junkDrawerNotes')) || [];
  const container = $('notes-container');
  container.innerHTML = '';
  notes.forEach(text => {
    const note = document.createElement('textarea');
    note.classList.add('junk-note');
    note.value = text;
    note.addEventListener('input', saveJunkDrawer);
    container.appendChild(note);
  });
}

// Init
renderProjectList();
loadJunkDrawer();
