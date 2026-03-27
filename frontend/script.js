const API = "http://localhost:5000";

// Signup Logic
async function signup() {
    const email = document.getElementById("sEmail").value;
    const password = document.getElementById("sPassword").value;

    const res = await fetch(API + "/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    if (res.ok) {
        alert("Signup successful! Redirecting to login...");
        document.getElementById("sEmail").value = "";
        document.getElementById("sPassword").value = "";
        toggleAuth();
    } else {
        alert("Signup failed. Try a different email.");
    }
}

// Login Logic
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(API + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid email or password!");
    }
}

// UI Toggle Function
function toggleAuth() {
    const signupCard = document.getElementById('signup-card');
    const loginCard = document.getElementById('login-card');
    if (signupCard.style.display === 'none') {
        signupCard.style.display = 'block';
        loginCard.style.display = 'none';
    } else {
        signupCard.style.display = 'none';
        loginCard.style.display = 'block';
    }
}

// Dashboard Functions (For when you are logged in)
async function getTasks() {
    const res = await fetch(API + "/tasks", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    });
    const tasks = await res.json();
    const list = document.getElementById("taskList");
    if (list) {
        list.innerHTML = tasks.map(t => `
            <li>${t.title} <button onclick="deleteTask(${t.id})">Delete</button></li>
        `).join('');
    }
}

if (window.location.pathname.includes("dashboard.html")) {
    getTasks();
}