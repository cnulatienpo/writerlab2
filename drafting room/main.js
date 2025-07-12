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

function updateWordCount() {
  const text = sceneText.value.trim();
  const count = text ? text.split(/\s+/).length : 0;
  wordCount.textContent = `Words: ${count}`;
}

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
function saveScene() {
  if (!activeProject || activeSceneIndex === null) return;

  const sceneTitle = document.getElementById("scene-title").textContent;
  const content = document.getElementById("scene-text").value;
  const goal = document.getElementById("scene-goal").value;
  const emotion = document.getElementById("scene-emotion").value;
  const characters = document.getElementById("scene-characters").value;
  const desire = document.getElementById("desire-slider").value;
  const conflict = document.getElementById("conflict-slider").value;
  const reveal = document.getElementById("reveal-slider").value;

  const sceneData = {
    title: sceneTitle,
    content,
    goal,
    emotion,
    characters,
    desire,
    conflict,
    reveal
  };

  const sceneFile = `projects/${activeProject}/scene-${activeSceneIndex}.json`;
  saveFile(sceneFile, JSON.stringify(sceneData));
}


  // Scene Notes Inputs
const sceneGoal = document.getElementById('scene-goal');
const sceneEmotion = document.getElementById('scene-emotion');
const sceneCharacters = document.getElementById('scene-characters');
const desireSlider = document.getElementById('desire-slider');
const conflictSlider = document.getElementById('conflict-slider');
const revealSlider = document.getElementById('reveal-slider');

// Load scene notes into drawer
function loadSceneNotes() {
  const scene = projects[currentProject].scenes[currentSceneIndex];
  const notes = scene.notes || {};

  sceneGoal.value = notes.goal || '';
  sceneEmotion.value = notes.emotion || '';
  sceneCharacters.value = notes.characters || '';
  desireSlider.value = notes.desire || 0;
  conflictSlider.value = notes.conflict || 0;
  revealSlider.value = notes.reveal || 0;

  function openScene(index) {
  activeSceneIndex = index;
  const sceneFile = `projects/${activeProject}/scene-${index}.json`;

  loadFile(sceneFile, (data) => {
    const scene = JSON.parse(data || "{}");

    document.getElementById("scene-title").textContent = scene.title || `Scene ${index + 1}`;
    document.getElementById("scene-text").value = scene.content || "";
    document.getElementById("scene-goal").value = scene.goal || "";
    document.getElementById("scene-emotion").value = scene.emotion || "";
    document.getElementById("scene-characters").value = scene.characters || "";
    document.getElementById("desire-slider").value = scene.desire || 0;
    document.getElementById("conflict-slider").value = scene.conflict || 0;
    document.getElementById("reveal-slider").value = scene.reveal || 0;

    document.getElementById("scene-editor").classList.remove("hidden");
    document.getElementById("outline").classList.add("hidden");
  });
}

}

// Save drawer changes live
function saveSceneNotes() {
  if (!currentProject || currentSceneIndex === null) return;
  const scene = projects[currentProject].scenes[currentSceneIndex];
  scene.notes = {
    goal: sceneGoal.value,
    emotion: sceneEmotion.value,
    characters: sceneCharacters.value,
    desire: parseInt(desireSlider.value),
    conflict: parseInt(conflictSlider.value),
    reveal: parseInt(revealSlider.value),
  };
  saveProjects();
}

// Events to save on input
[sceneGoal, sceneEmotion, sceneCharacters,
 desireSlider, conflictSlider, revealSlider].forEach(el => {
  el.addEventListener('input', saveSceneNotes);
});

// Extend editScene to load notes
function editScene(index) {
  currentSceneIndex = index;
  const scene = projects[currentProject].scenes[index];
  sceneTitle.textContent = `✍️ ${scene.title}`;
  sceneText.value = scene.text || '';
  sceneEditor.classList.remove('hidden');
  drawer.classList.add('hidden');
  updateWordCount();
  loadSceneNotes();
}


  // Junk Drawer Elements
let junkNotes = [];

// Load Junk Drawer from localStorage
function loadJunkDrawer() {
  const data = localStorage.getItem('junkdrawer');
  junkNotes = data ? JSON.parse(data) : [];
  renderJunkDrawer();
}

// Save to localStorage
function saveJunkDrawer() {
  localStorage.setItem('junkdrawer', JSON.stringify(junkNotes));
}

// Create Note Element
function createNoteElement(note, index) {
  const noteDiv = document.createElement('div');
  noteDiv.className = 'note';
  noteDiv.contentEditable = true;
  noteDiv.innerText = note.text || '';
  noteDiv.style.backgroundColor = note.color || '#ffff88';
  noteDiv.style.left = note.x + 'px';
  noteDiv.style.top = note.y + 'px';
  noteDiv.setAttribute('data-index', index);

  // Dragging logic
  noteDiv.onmousedown = function (e) {
    const shiftX = e.clientX - noteDiv.getBoundingClientRect().left;
    const shiftY = e.clientY - noteDiv.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      noteDiv.style.left = pageX - shiftX + 'px';
      noteDiv.style.top = pageY - shiftY + 'px';
      junkNotes[index].x = pageX - shiftX;
      junkNotes[index].y = pageY - shiftY;
      saveJunkDrawer();
    }

    function onMouseMove(e) {
      moveAt(e.pageX, e.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    noteDiv.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove);
      noteDiv.onmouseup = null;
    };
  };

  // Right click = delete
  noteDiv.oncontextmenu = function (e) {
    e.preventDefault();
    junkNotes.splice(index, 1);
    saveJunkDrawer();
    renderJunkDrawer();
  };

  // Double click = change color
  noteDiv.ondblclick = function () {
    const colors = ['#ffff88', '#ffd8d8', '#d8ffd8', '#d8d8ff'];
    const currentColor = junkNotes[index].color || colors[0];
    const nextColor = colors[(colors.indexOf(currentColor) + 1) % colors.length];
    junkNotes[index].color = nextColor;
    saveJunkDrawer();
    renderJunkDrawer();
  };

  // Save content changes
  noteDiv.oninput = function () {
    junkNotes[index].text = noteDiv.innerText;
    saveJunkDrawer();
  };

  return noteDiv;
}

// Render all notes
function renderJunkDrawer() {
  notesContainer.innerHTML = '';
  junkNotes.forEach((note, index) => {
    const noteEl = createNoteElement(note, index);
    notesContainer.appendChild(noteEl);
  });
}

// Create new note
addNoteBtn.addEventListener('click', () => {
  const newNote = {
    text: '',
    color: '#ffff88',
    x: 50,
    y: 50
  };
  junkNotes.push(newNote);
  saveJunkDrawer();
  renderJunkDrawer();
});

// Toggle Drawer
toggleJunkDrawer.addEventListener('click', () => {
  junkDrawer.classList.toggle('hidden');
});

// Initialize
loadJunkDrawer();


  // --- STICKY NOTES ---
let notes = JSON.parse(localStorage.getItem('junkdrawer')) || [];

function saveNotes() {
  localStorage.setItem('junkdrawer', JSON.stringify(notes));
}

function renderNotes() {
  const container = document.getElementById('notes-container');
  container.innerHTML = '';
  notes.forEach((note, i) => {
    const div = document.createElement('div');
    div.className = 'sticky-note';
    div.contentEditable = true;
    div.style.backgroundColor = note.color;
    div.style.left = note.x + 'px';
    div.style.top = note.y + 'px';
    div.innerText = note.text;

    div.addEventListener('input', () => {
      note.text = div.innerText;
      saveNotes();
    });

    div.setAttribute('draggable', 'true');

    div.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', i);
    });

    div.addEventListener('dragend', (e) => {
      const rect = e.target.getBoundingClientRect();
      note.x = rect.left;
      note.y = rect.top;
      saveNotes();
    });

    container.appendChild(div);
  });
}

function addStickyNote() {
  const newNote = {
    text: '',
    color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    x: 100,
    y: 100
  };
  notes.push(newNote);
  saveNotes();
  renderNotes();
}

document.getElementById('add-note').addEventListener('click', addStickyNote);

// Initial render
renderNotes();

function saveFile(path, data) {
  localStorage.setItem(path, data);
}

function loadFile(path, callback) {
  const data = localStorage.getItem(path);
  callback(data);
}

// ------------------------------------------------------------
// Storage-backed functionality using functions from storage.js
// ------------------------------------------------------------

const {
  createProject: createProjectStorage,
  listProjects,
  saveNotes: saveNotesStorage,
  loadNotes,
  saveScene: saveSceneStorage,
  loadScene,
  loadOutline,
  listScenes
} = window;

let currentSceneId = null;

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function refreshOutline() {
  if (!currentProject) return;
  outlineContainer.innerHTML = '';
  const scenes = listScenes(currentProject).sort();
  scenes.forEach(sceneKey => {
    const match = sceneKey.match(/^scene(.+)\.json$/);
    if (!match) return;
    const id = match[1];
    const data = loadScene(currentProject, id) || {};
    const card = document.createElement('div');
    card.classList.add('scene-card');
    card.textContent = data.title || `Scene ${id}`;
    card.onclick = () => openScene(id);
    outlineContainer.appendChild(card);
  });
}

function handleAddScene() {
  if (!currentProject) return;
  const title = prompt('Scene title?');
  if (!title) return;
  const id = `${slugify(title)}-${Date.now()}`;
  saveSceneStorage(currentProject, id, { title });
  refreshOutline();
}

function handleBackToOutline() {
  currentSceneId = null;
  sceneEditor.classList.add('hidden');
  outlineSection.classList.remove('hidden');
  drawer.classList.add('hidden');
}

function refreshProjectList() {
  projectList.innerHTML = '';
  const projects = listProjects();
  Object.keys(projects).forEach(name => {
    const div = document.createElement('div');
    div.textContent = name;
    div.classList.add('project-entry');
    div.onclick = () => selectProject(name);
    projectList.appendChild(div);
  });
}

function selectProject(name) {
  currentProject = name;
  const notes = loadNotes(name);
  storyCheckInput.value = notes || '';

  outlineContainer.innerHTML = '';
  refreshOutline();

  storyCheckSection.classList.remove('hidden');
  outlineSection.classList.remove('hidden');
  sceneEditor.classList.add('hidden');
  drawer.classList.add('hidden');
}

function openScene(id) {
  currentSceneId = id;
  const data = loadScene(currentProject, id) || {};
  sceneTitle.textContent = `✍️ ${data.title || 'Scene ' + id}`;
  sceneText.value = data.content || '';
  sceneGoal.value = data.goal || '';
  sceneEmotion.value = data.emotion || '';
  sceneCharacters.value = data.characters || '';
  desireSlider.value = data.desire || 0;
  conflictSlider.value = data.conflict || 0;
  revealSlider.value = data.reveal || 0;
  updateWordCount();

  sceneEditor.classList.remove('hidden');
  outlineSection.classList.add('hidden');
  drawer.classList.add('hidden');
}

function handleCreateProject() {
  const name = newProjectInput.value.trim();
  if (!name) return;
  try {
    createProjectStorage(name);
    newProjectInput.value = '';
    refreshProjectList();
  } catch (err) {
    console.error(err);
  }
}

function handleSaveNotes() {
  if (!currentProject) return;
  const text = storyCheckInput.value;
  saveNotesStorage(currentProject, text);
}

function handleSaveScene() {
  if (!currentProject || currentSceneId === null) return;
  const sceneData = {
    title: sceneTitle.textContent.replace('✍️ ', ''),
    content: sceneText.value,
    goal: sceneGoal.value,
    emotion: sceneEmotion.value,
    characters: sceneCharacters.value,
    desire: parseInt(desireSlider.value),
    conflict: parseInt(conflictSlider.value),
    reveal: parseInt(revealSlider.value)
  };
  saveSceneStorage(currentProject, currentSceneId, sceneData);
}

createProjectBtn.onclick = handleCreateProject;
saveStoryCheckBtn.onclick = handleSaveNotes;
saveSceneBtn.onclick = handleSaveScene;
addSceneBtn.onclick = handleAddScene;
closeSceneBtn.onclick = handleBackToOutline;
sceneText.addEventListener('input', updateWordCount);

window.onload = refreshProjectList;

// expose for other scripts if needed
window.selectProject = selectProject;
window.openScene = openScene;
