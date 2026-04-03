require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const sequelize = require('./config/db');
const User = require('./models/User');
const Task = require('./models/Task');
const taskRoutes = require('./routes/tasks');

const app = express();

// --- MIDDLEWARE ---
app.use(cors({ origin: '*' })); // Allows your Render frontend to connect
app.use(express.json());

// --- ROUTES ---
app.use('/api/tasks', taskRoutes);

// Signup Logic
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: "User created!" });
    } catch (err) {
        res.status(500).json({ message: "Signup failed", error: err.message });
    }
});

// Login Logic
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "hiya_secret_key", { expiresIn: '1h' });
        res.json({ token, username: user.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- RENDER DEPLOYMENT ---
const PORT = process.env.PORT || 10000;
sequelize.sync({ alter: true }).then(() => {
    console.log("✅ Database & Security Sync Complete");
    app.listen(PORT, '0.0.0.0', () => console.log(`Server live on ${PORT}`));
}).catch(err => console.error("Sync Error:", err.message));