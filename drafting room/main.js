// Simple localStorage-based save/load
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

// Notes System
let notes = loadData('junkdrawer') || [];

function renderNotes() {
  const drawer = document.getElementById('junk-drawer');
  drawer.innerHTML = '';

  notes.forEach((note, index) => {
    const div = document.createElement('div');
    div.className = 'note';
    div.style.left = note.x + 'px';
    div.style.top = note.y + 'px';

    const textarea = document.createElement('textarea');
    textarea.value = note.text;
    textarea.oninput = () => {
      notes[index].text = textarea.value;
      saveData('junkdrawer', notes);
    };

    const del = document.createElement('button');
    del.className = 'delete-note';
    del.innerText = 'x';
    del.onclick = () => {
      notes.splice(index, 1);
      saveData('junkdrawer', notes);
      renderNotes();
    };

    div.appendChild(textarea);
    div.appendChild(del);
    drawer.appendChild(div);
  });
}

function addNote() {
  notes.push({ text: '', x: 10, y: 10 });
  saveData('junkdrawer', notes);
  renderNotes();
}

document.addEventListener('DOMContentLoaded', () => {
  renderNotes();
  document.getElementById('add-note-btn').onclick = addNote;
});
