const API = "https://task-manager-3k9d.onrender.com/api";
let isShowingImportantOnly = false; 

//1. READ: Fetch and Render Notes

async function fetchTasks() {
    const token = localStorage.getItem('token');
    const notesContainer = document.getElementById('notesContainer'); 
    
    // Safety check: Ensure user is logged in and UI exists
    if (!notesContainer || !token) {
        if (!token) window.location.href = "index.html";
        return;
    }

    try {
        const res = await fetch(`${API}/tasks`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        // If token is invalid or expired
        if (res.status === 401) { 
            localStorage.clear();
            window.location.href = "index.html"; 
            return; 
        }

        let tasks = await res.json();

        // Handle the "Important" filter toggle
        if (isShowingImportantOnly) {
            tasks = tasks.filter(t => t.is_important);
        }

        // Clear and Redraw UI
        notesContainer.innerHTML = ""; 
        
        if (tasks.length === 0) {
            notesContainer.innerHTML = `<p style="color: #666; text-align: center; margin-top: 20px;">No notes found here...</p>`;
            return;
        }

        tasks.forEach(task => {
            const noteCard = document.createElement('div');
            noteCard.className = "note-card"; 
            const starClass = task.is_important ? "star-btn saved" : "star-btn";

            noteCard.innerHTML = `
                <textarea id="input-${task.id}" onchange="updateTaskTitle(${task.id})">${task.title}</textarea>
                <div class="note-actions">
                    <button id="star-${task.id}" class="${starClass}" onclick="toggleImportant(${task.id}, ${task.is_important})">
                        <i class="fa-solid fa-star"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
            notesContainer.appendChild(noteCard);
        });
    } catch (err) { 
        console.error("Fetch failed:", err.message); 
    }
}

//2. CREATE: Add New Note

async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const title = taskInput.value.trim();
    const token = localStorage.getItem('token'); 
    
    if (!title) return alert("Please enter a note title!");

    try {
        const res = await fetch(`${API}/tasks`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ title })
        });

        if (res.ok) { 
            taskInput.value = ""; 
            fetchTasks(); 
        }
    } catch (err) { 
        console.error("Add task failed:", err.message);
    }
}

// 3. UPDATE: Toggle Star (Important)

async function toggleImportant(id, currentState) {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API}/tasks/${id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ is_important: !currentState })
        });
        
        if (res.ok) fetchTasks(); 
    } catch (err) { 
        console.error("Toggle failed", err.message); 
    }
}

//4. UPDATE: Edit Note Title (Auto-save on change)
 
async function updateTaskTitle(id) {
    const newTitle = document.getElementById(`input-${id}`).value;
    const token = localStorage.getItem('token');
    
    try {
        const res = await fetch(`${API}/tasks/${id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json", 
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ title: newTitle })
        });
        
        if (!res.ok) throw new Error("Update failed");
    } catch (err) { 
        console.error("Title update failed", err.message);
        fetchTasks(); // Revert to database state on failure
    }
}

//5. DELETE: Remove Note
 
async function deleteTask(id) {
    const token = localStorage.getItem('token');
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
        const res = await fetch(`${API}/tasks/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (res.ok) fetchTasks();
    } catch (err) { 
        console.error("Delete failed", err.message); 
    }
}

//6. NAVBAR: Tab Filtering
window.showAllNotes = function() {
    isShowingImportantOnly = false;
    document.getElementById('allNotesBtn').classList.add('active');
    document.getElementById('importantBtn').classList.remove('active');
    fetchTasks();
}

window.showImportantNotes = function() {
    isShowingImportantOnly = true;
    document.getElementById('importantBtn').classList.add('active');
    document.getElementById('allNotesBtn').classList.remove('active');
    fetchTasks();
}

//7. AUTH: Sign Out
window.logout = function() {
    localStorage.clear();
    window.location.href = "index.html";
}

// Initial Load
fetchTasks();