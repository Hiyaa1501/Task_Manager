require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('./config/db');
const User = require('./models/User');
const Task = require('./models/tasks'); // Ensure the filename is correct (tasks.js)
const taskRoutes = require('./routes/tasks'); // Path to your task.js routes

const app = express();

// --- MIDDLEWARE ---
// --- MIDDLEWARE ---
app.use(cors({
    origin: 'https://hiyaa1501.github.io', // Your specific GitHub frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express.json());
app.use(express.json());

// --- ROUTES ---

// 1. Home Route
app.get('/', (req, res) => {
    res.send("<h1>Backend is officially Running!</h1>");
});

// 2. Task Routes (Linked here to fix your Connection Refused/404 errors)
app.use('/api/tasks', taskRoutes);

// 3. SIGNUP ROUTE
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: "User created!" });
    } catch (err) {
        res.status(500).json({ error: "Signup failed: " + err.message });
    }
});

// 4. LOGIN ROUTE
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        // Create a JWT Token (Using "hiya_secret_key" to match your middleware)
        const secret = process.env.JWT_SECRET || "hiya_secret_key";
        const token = jwt.sign({ id: user.id }, "hiya_secret_key", { expiresIn: '1h' });

        res.json({ token, username: user.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- DATABASE SYNC & SERVER START ---
const PORT = 5000;

// Using { alter: true } ensures the 'userId' column is added to your Tasks table automatically
sequelize.sync({ alter: true }).then(() => {
    console.log("Database synced (Tables updated)");
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Database sync failed:", err.message);
});