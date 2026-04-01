const API = "http://localhost:5001/api";

// --- UI ANIMATION ---
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

if(signUpButton) signUpButton.addEventListener('click', () => container.classList.add('right-panel-active'));
if(signInButton) signInButton.addEventListener('click', () => container.classList.remove('right-panel-active'));

// --- SIGNUP LOGIC ---
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById("signupName").value;
        const email = document.getElementById("signupEmail").value;
        const password = document.getElementById("signupPassword").value;

        try {
            // MATCHED TO SERVER.JS: /api/signup
            const res = await fetch(`${API}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password })
            });
            const data = await res.json();
            
            if (res.ok) {
                alert("Signup successful! Please sign in.");
                container.classList.remove('right-panel-active');
            } else {
                alert("Signup failed: " + (data.message || data.error || "Unknown error"));
            }
        } catch (err) {
            console.error("Signup Catch:", err);
            alert("Cannot connect to server. Ensure backend is running on 5001.");
        }
    });
}

// --- LOGIN LOGIC ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {
            // MATCHED TO SERVER.JS: /api/login
            const res = await fetch(`${API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok && data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.username);
                window.location.href = "dashboard.html";
            } else {
                alert(data.message || "Invalid credentials!");
            }
        } catch (err) {
            console.error("Login Catch:", err);
            alert("Login failed. Check backend connection.");
        }
    });
}