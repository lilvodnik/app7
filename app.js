document.addEventListener('DOMContentLoaded', () => {
    const noteInput = document.getElementById('note-input');
    const addNoteBtn = document.getElementById('add-note-btn');
    const notesList = document.getElementById('notes-list');
    const offlineStatus = document.getElementById('offline-status');
    
    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    loadNotes();
    
    addNoteBtn.addEventListener('click', addNote);
    noteInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            addNote();
        }
    });
    
    function updateOnlineStatus() {
        if (navigator.onLine) {
            offlineStatus.classList.add('hidden');
        } else {
            offlineStatus.classList.remove('hidden');
        }
    }
    
    function addNote() {
        const noteText = noteInput.value.trim();
        if (noteText === '') return;
        
        const newNote = {
            id: Date.now(),
            content: noteText,
            date: new Date().toLocaleString()
        };
        
        saveNote(newNote);
        renderNote(newNote);
        noteInput.value = '';
        noteInput.focus();
    }
    
    function saveNote(note) {
        let notes = getNotes();
        notes.unshift(note); 
        localStorage.setItem('notes', JSON.stringify(notes));
    }
    
    function getNotes() {
        const notes = localStorage.getItem('notes');
        return notes ? JSON.parse(notes) : [];
    }
    
    function loadNotes() {
        const notes = getNotes();
        notes.forEach(note => renderNote(note));
    }
    
    function renderNote(note) {
        const noteElement = document.createElement('div');
        noteElement.className = 'note';
        noteElement.innerHTML = `
            <div class="note-content">${note.content}</div>
            <div class="note-date">${note.date}</div>
            <div class="note-actions">
                <button class="delete-btn" data-id="${note.id}">Удалить</button>
            </div>
        `;
        
        if (notesList.firstChild) {
            notesList.insertBefore(noteElement, notesList.firstChild);
        } else {
            notesList.appendChild(noteElement);
        }
        
        noteElement.querySelector('.delete-btn').addEventListener('click', () => {
            deleteNote(note.id);
            noteElement.remove();
        });
    }
    
    function deleteNote(id) {
        let notes = getNotes();
        notes = notes.filter(note => note.id !== id);
        localStorage.setItem('notes', JSON.stringify(notes));
    }
});