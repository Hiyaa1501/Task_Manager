require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('./config/db');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// Home Route
app.get('/', (req, res) => {
    res.send("<h1>Backend is officially Running!</h1>");
});

// --- SIGNUP ROUTE ---
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

// --- LOGIN ROUTE (The missing piece!) ---
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // 1. Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ message: "User not found" });

        // 2. Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        // 3. Create a JWT Token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "my_super_secret_key", { expiresIn: '1h' });

        res.json({ token, username: user.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 5000;
sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});