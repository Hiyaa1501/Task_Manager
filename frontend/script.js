const API = "https://task-manager-3k9d.onrender.com/api";

// --- UI ANIMATION ---
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

if(signUpButton) signUpButton.addEventListener('click', () => container.classList.add('right-panel-active'));
if(signInButton) signInButton.addEventListener('click', () => container.classList.remove('right-panel-active'));

// Helper to disable buttons during fetch (Prevents duplicate requests during Render wake-up)
const setLoader = (formId, isLoading) => {
    const form = document.getElementById(formId);
    const button = form.querySelector('button');
    if (isLoading) {
        button.disabled = true;
        button.innerText = "Connecting... (Waking up server)";
    } else {
        button.disabled = false;
        button.innerText = formId === 'signupForm' ? "Sign Up" : "Sign In";
    }
};

// --- SIGNUP LOGIC ---
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        setLoader('signupForm', true);

        const username = document.getElementById("signupName").value;
        const email = document.getElementById("signupEmail").value;
        const password = document.getElementById("signupPassword").value;

        try {
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
            alert("The server is taking a moment to wake up. Please wait 30 seconds and try again.");
        } finally {
            setLoader('signupForm', false);
        }
    });
}

// --- LOGIN LOGIC ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        setLoader('loginForm', true);

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {
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
            alert("Connection failed. Render may be restarting the service. Please try again shortly.");
        } finally {
            setLoader('loginForm', false);
        }
    });
}