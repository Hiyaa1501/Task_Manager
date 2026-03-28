const API = "http://localhost:5000/api";

// --- 1. CREATE: Add a new Note ---
async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const title = taskInput.value;
    const token = localStorage.getItem('token'); 

    if (!title) return alert("Please type a note!");

    try {
        const res = await fetch(API + "/tasks", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ title: title })
        });

        if (res.ok) {
            taskInput.value = ""; 
            fetchTasks(); 
        } else if (res.status === 401) {
            alert("Session expired. Please login again.");
            window.location.href = "index.html";
        }
    } catch (err) {
        alert("Server connection failed.");
    }
}

// --- 2. READ: Fetch and display Notes ---
async function fetchTasks() {
    const token = localStorage.getItem('token');
    const notesContainer = document.getElementById('notesContainer'); 

    if (!notesContainer) return;

    try {
        const res = await fetch(API + "/tasks", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.status === 401) {
            window.location.href = "index.html";
            return;
        }

        const tasks = await res.json();
        notesContainer.innerHTML = ""; 

        tasks.forEach(task => {
            const noteCard = document.createElement('div');
            
            // --- UPDATED: Using Class Name instead of inline style ---
            noteCard.className = "note-card"; 
            
            noteCard.innerHTML = `
                <textarea id="input-${task.id}">${task.title}</textarea>
                <div class="note-actions">
                    <button class="save-btn" onclick="updateTask(${task.id})">Save</button>
                    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;
            notesContainer.appendChild(noteCard);
        });
    } catch (err) {
        console.error("Error loading tasks:", err);
    }
}

// --- 3. UPDATE ---
async function updateTask(id) {
    const newTitle = document.getElementById(`input-${id}`).value;
    const token = localStorage.getItem('token');
    
    const res = await fetch(`${API}/tasks/${id}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ title: newTitle })
    });

    if (res.ok) {
        alert("Note updated!");
    }
}

// --- 4. DELETE ---
async function deleteTask(id) {
    const token = localStorage.getItem('token');
    if (!confirm("Delete this note?")) return;

    const res = await fetch(`${API}/tasks/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
        fetchTasks();
    }
}

// Initial Load
fetchTasks();
