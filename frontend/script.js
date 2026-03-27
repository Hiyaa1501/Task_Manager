const API = "http://localhost:5000";

// Signup
async function signup() {
  await fetch(API + "/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: document.getElementById("sEmail").value,
      password: document.getElementById("sPassword").value
    })
  });
  alert("Signup successful");
}

// Login
async function login() {
  const res = await fetch(API + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  });

  const data = await res.json();
  localStorage.setItem("token", data.token);
  window.location.href = "dashboard.html";
}

// Get Tasks
async function getTasks() {
  const res = await fetch(API + "/tasks", {
    headers: {
      Authorization: localStorage.getItem("token")
    }
  });

  const tasks = await res.json();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${task.title}
      <button onclick="deleteTask(${task.id})">Delete</button>
    `;
    list.appendChild(li);
  });
}

// Add Task
async function addTask() {
  await fetch(API + "/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    },
    body: JSON.stringify({
      title: document.getElementById("taskInput").value
    })
  });

  getTasks();
}

// Delete Task
async function deleteTask(id) {
  await fetch(API + "/tasks/" + id, {
    method: "DELETE",
    headers: {
      Authorization: localStorage.getItem("token")
    }
  });

  getTasks();
}

// Load tasks automatically on dashboard
if (window.location.pathname.includes("dashboard.html")) {
  getTasks();
}