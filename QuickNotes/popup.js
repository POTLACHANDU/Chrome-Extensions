const contentArea = document.getElementById('content-area');

// Function to display the "Create New Note" interface
function showCreateNote() {
  contentArea.innerHTML = `
    <h2>Create New Note</h2>
    <input id="note-title" type="text" placeholder="File Name" />
    <textarea id="note-body" placeholder="Write your note here..."></textarea>
    <button id="save-note">Save Note</button>
  `;

  // Save note to localStorage
  document.getElementById('save-note').addEventListener('click', () => {
    const title = document.getElementById('note-title').value.trim();
    const body = document.getElementById('note-body').value.trim();

    if (!title || !body) {
      alert('Both title and body are required.');
      return;
    }

    // Save note to localStorage
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push({ title, body });
    localStorage.setItem('notes', JSON.stringify(notes));

    alert('Note saved successfully!');
    document.getElementById('note-title').value = '';
    document.getElementById('note-body').value = '';
  });
}

// Function to display saved notes
function showSavedNotes() {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  if (notes.length === 0) {
    contentArea.innerHTML = '<p>No saved notes found.</p>';
    return;
  }

  contentArea.innerHTML = `
    <h2>Saved Notes</h2>
    <div id="notes-list">
      ${notes
        .map(
          (note, index) => `
        <div class="note-item" data-index="${index}">
          <span>${note.title}</span>
          <button class="download-btn" data-index="${index}">Download</button>
          <button class="edit-btn" data-index="${index}">Edit</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
        </div>
      `
        )
        .join('')}
    </div>
  `;

  // Attach event listeners for download, edit, and delete
  document.querySelectorAll('.download-btn').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const index = event.target.dataset.index;
      downloadNote(notes[index]);
    });
  });

  document.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const index = event.target.dataset.index;
      editNote(index, notes);
    });
  });

  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const index = event.target.dataset.index;
      deleteNote(index);
    });
  });
}

// Function to download a note as a .txt file
function downloadNote(note) {
  const blob = new Blob([note.body], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${note.title}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// Function to edit a note
function editNote(index, notes) {
  const note = notes[index];
  contentArea.innerHTML = `
    <h2>Edit Note</h2>
    <input id="note-title" type="text" value="${note.title}" />
    <textarea id="note-body">${note.body}</textarea>
    <button id="save-note">Save Changes</button>
  `;

  // Save the edited note back to localStorage
  document.getElementById('save-note').addEventListener('click', () => {
    const title = document.getElementById('note-title').value.trim();
    const body = document.getElementById('note-body').value.trim();

    if (!title || !body) {
      alert('Both title and body are required.');
      return;
    }

    notes[index] = { title, body };
    localStorage.setItem('notes', JSON.stringify(notes));

    alert('Note updated successfully!');
    showSavedNotes();
  });
}

// Function to delete a note
function deleteNote(index) {
  const notes = JSON.parse(localStorage.getItem('notes')) || [];
  notes.splice(index, 1); // Remove the note from the array
  localStorage.setItem('notes', JSON.stringify(notes)); // Update storage
  alert('Note deleted successfully!');
  showSavedNotes(); // Refresh the list
}

// Event listeners for menu buttons
document.getElementById('create-note').addEventListener('click', showCreateNote);
document.getElementById('show-notes').addEventListener('click', showSavedNotes);

// Show "Create New Note" by default
showCreateNote();
