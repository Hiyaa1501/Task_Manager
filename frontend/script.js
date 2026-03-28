const API = "http://localhost:5000/api"; // Added /api to match your backend

// --- ANIMATION LOGIC ---
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => container.classList.add('right-panel-active'));
signInButton.addEventListener('click', () => container.classList.remove('right-panel-active'));

// --- SIGNUP LOGIC ---
// Note: We listen for the 'submit' event on the form itself
const signupForm = document.querySelector('.sign-up-container form');
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Grabbing values from your index.html IDs
    const username = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    try {
        const res = await fetch(API + "/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Signup successful! Please sign in.");
            container.classList.remove('right-panel-active'); // Slide back to login
        } else {
            alert("Signup failed: " + (data.message || data.error));
        }
    } catch (err) {
        alert("Cannot connect to server. Is the backend running?");
    }
});

// --- LOGIN LOGIC ---
const loginForm = document.querySelector('.sign-in-container form');
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // These IDs must exist in your index.html login section
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const res = await fetch(API + "/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        localStorage.setItem('token', data.token);

        if (data.token) {
            localStorage.setItem("token", data.token); // Save the key!
            window.location.href = "dashboard.html";    // Go to dashboard
        } else {
            alert("Invalid email or password!");
        }
    } catch (err) {
        alert("Login failed. Check console for details.");
    }
});

async function addTask() {
    const taskInput = document.getElementById('taskInput');
    const title = taskInput.value;
    const token = localStorage.getItem('token'); 

    if (!title) return alert("Please type a task!");

    try {
        const res = await fetch(API + "/tasks", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // This tells the server WHO you are
            },
            body: JSON.stringify({ title: title })
        });

        if (res.ok) {
            taskInput.value = ""; 
            fetchTasks();        
        } else {
            alert("Session expired. Please login again.");
            window.location.href = "index.html";
        }
    } catch (err) {
        console.error("Error:", err);
        alert("Server is not responding!");
    }
}

// 2. Function to Load Tasks from MySQL
async function fetchTasks() {
    const token = localStorage.getItem('token');
    const taskList = document.getElementById('taskList'); // Ensure this ID is in your HTML

    try {
        const res = await fetch(API + "/tasks", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        const tasks = await res.json();
        taskList.innerHTML = ""; 

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${task.title}</span>
                <button onclick="deleteTask(${task.id})">Delete</button>
            `;
            taskList.appendChild(li);
        });
    } catch (err) {
        console.log("Could not load tasks.");
    }
}

fetchTasks();