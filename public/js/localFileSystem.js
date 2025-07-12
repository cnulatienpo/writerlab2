const PROJECT_INDEX_KEY = 'draftingroom_projects.json';

function loadProjectsIndex() {
  const data = localStorage.getItem(PROJECT_INDEX_KEY);
  return data ? JSON.parse(data) : {};
}

function saveProjectsIndex(index) {
  localStorage.setItem(PROJECT_INDEX_KEY, JSON.stringify(index));
}

function getKey(projectName, filename) {
  const safeName = encodeURIComponent(projectName);
  return `draftingroom_${safeName}_${filename}`;
}

export function createProject(projectName, metadata = {}) {
  const index = loadProjectsIndex();
  if (index[projectName]) throw new Error('Project already exists');
  index[projectName] = {
    createdAt: new Date().toISOString(),
    ...metadata
  };
  saveProjectsIndex(index);
}

export function deleteProject(projectName) {
  const index = loadProjectsIndex();
  delete index[projectName];
  saveProjectsIndex(index);

  const prefix = getKey(projectName, '');
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix)) {
      localStorage.removeItem(key);
    }
  }
}

export function listProjects() {
  return loadProjectsIndex();
}

export function saveNotes(projectName, notesData) {
  localStorage.setItem(getKey(projectName, 'notes.json'), JSON.stringify(notesData));
}

export function loadNotes(projectName) {
  const data = localStorage.getItem(getKey(projectName, 'notes.json'));
  return data ? JSON.parse(data) : null;
}

export function saveOutline(projectName, outlineData) {
  localStorage.setItem(getKey(projectName, 'outline.json'), JSON.stringify(outlineData));
}

export function loadOutline(projectName) {
  const data = localStorage.getItem(getKey(projectName, 'outline.json'));
  return data ? JSON.parse(data) : null;
}

export function saveScene(projectName, sceneId, sceneData) {
  const filename = `scene${sceneId}.json`;
  localStorage.setItem(getKey(projectName, filename), JSON.stringify(sceneData));
}

export function loadScene(projectName, sceneId) {
  const filename = `scene${sceneId}.json`;
  const data = localStorage.getItem(getKey(projectName, filename));
  return data ? JSON.parse(data) : null;
}

export function listScenes(projectName) {
  const base = getKey(projectName, '');
  const scenes = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(base + 'scene')) {
      scenes.push(key.slice(base.length));
    }
  }
  return scenes;
}
