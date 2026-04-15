const API = "https://task-manager-3k9d.onrender.com/api";
let isShowingImportantOnly = false;
let allTasks = [];

// READ
async function fetchTasks() {
    const token = localStorage.getItem('token');
    const notesContainer = document.getElementById('notesContainer');
    if (!notesContainer || !token) {
        if (!token) window.location.href = "index.html";
        return;
    }
    try {
        const res = await fetch(`${API}/tasks`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.status === 401) {
            localStorage.clear();
            window.location.href = "index.html";
            return;
        }
        allTasks = await res.json();
        renderTasks();
    } catch (err) {
        console.error("Fetch failed:", err.message);
    }
}

function renderTasks() {
    const notesContainer = document.getElementById('notesContainer');
    const searchQuery = (document.getElementById('searchInput')?.value || '').toLowerCase();

    let tasks = allTasks;
    if (isShowingImportantOnly) tasks = tasks.filter(t => t.is_important);
    if (searchQuery) tasks = tasks.filter(t => t.title.toLowerCase().includes(searchQuery));

    notesContainer.innerHTML = "";

    if (tasks.length === 0) {
        notesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fa-regular fa-note-sticky empty-icon"></i>
                <p>${searchQuery ? 'No notes match your search.' : isShowingImportantOnly ? 'No important notes yet.' : 'No notes yet. Add one!'}</p>
            </div>`;
        return;
    }

    tasks.forEach(task => {
        const noteCard = document.createElement('div');
        noteCard.className = "note-card";
        if (task.is_important) noteCard.classList.add('is-important');
        const starClass = task.is_important ? "star-btn saved" : "star-btn";
        const dateStr = task.created_at
            ? new Date(task.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            : '';

        noteCard.innerHTML = `
            <textarea id="input-${task.id}" onblur="updateTaskTitle(${task.id})">${task.title}</textarea>
            ${dateStr ? `<span class="note-date">${dateStr}</span>` : ''}
            <div class="note-actions">
                <button id="star-${task.id}" class="${starClass}" onclick="toggleImportant(${task.id}, ${task.is_important})" title="Mark important">
                    <i class="fa-solid fa-star"></i>
                </button>
                <button class="delete-btn" onclick="confirmDelete(${task.id})" title="Delete note">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
            <div class="delete-confirm hidden" id="confirm-${task.id}">
                <span>Delete this note?</span>
                <button onclick="deleteTask(${task.id})">Yes</button>
                <button onclick="cancelDelete(${task.id})">No</button>
            </div>
        `;
        notesContainer.appendChild(noteCard);
    });
}

// Filter (client-side, no extra API call)
window.filterNotes = function() { renderTasks(); }

// CREATE
window.addTask = async function() {
    const taskInput = document.getElementById('taskInput');
    const title = taskInput.value.trim();
    const token = localStorage.getItem('token');
    if (!title) { taskInput.focus(); return; }
    try {
        const res = await fetch(`${API}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ title })
        });
        if (res.ok) {
            taskInput.value = "";
            toggleAddForm();
            fetchTasks();
        }
    } catch (err) { console.error("Add task failed:", err.message); }
}

// UPDATE: toggle important
window.toggleImportant = async function(id, currentState) {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API}/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ is_important: !currentState })
        });
        if (res.ok) fetchTasks();
    } catch (err) { console.error("Toggle failed", err.message); }
}

// UPDATE: edit title (saves on blur, not on every keystroke)
window.updateTaskTitle = async function(id) {
    const newTitle = document.getElementById(`input-${id}`).value.trim();
    if (!newTitle) return;
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API}/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ title: newTitle })
        });
        if (!res.ok) { fetchTasks(); }
    } catch (err) { console.error("Title update failed", err.message); fetchTasks(); }
}

// DELETE with inline confirm
window.confirmDelete = function(id) {
    document.getElementById(`confirm-${id}`).classList.remove('hidden');
}
window.cancelDelete = function(id) {
    document.getElementById(`confirm-${id}`).classList.add('hidden');
}
window.deleteTask = async function(id) {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API}/tasks/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) fetchTasks();
    } catch (err) { console.error("Delete failed", err.message); }
}

// NAV
window.toggleAddForm = function() {
    const form = document.getElementById('addForm');
    form.classList.toggle('hidden');
    if (!form.classList.contains('hidden')) document.getElementById('taskInput').focus();
}

window.showAllNotes = function() {
    isShowingImportantOnly = false;
    document.getElementById('allNotesBtn').classList.add('active');
    document.getElementById('importantBtn').classList.remove('active');
    renderTasks();
}

window.showImportantNotes = function() {
    isShowingImportantOnly = true;
    document.getElementById('importantBtn').classList.add('active');
    document.getElementById('allNotesBtn').classList.remove('active');
    renderTasks();
}

window.logout = function() {
    localStorage.clear();
    window.location.href = "index.html";
}

fetchTasks();