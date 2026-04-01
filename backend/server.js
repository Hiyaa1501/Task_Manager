require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Using bcryptjs for better compatibility
const jwt = require('jsonwebtoken');

// --- DATABASE & MODELS ---
const sequelize = require('./config/db');
const User = require('./models/User');
const Task = require('./models/Task');

// --- ROUTES ---
const taskRoutes = require('./routes/tasks'); 

const app = express();

// --- MIDDLEWARE ---
app.use(cors({
    origin: '*', // Allows your frontend to talk to this backend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// --- BASE ROUTE ---
app.get('/', (req, res) => {
    res.send("<h1>🚀 Task Manager Backend is Live!</h1>");
});

// --- API ROUTES ---
app.use('/api/tasks', taskRoutes);

// SIGNUP
app.post('/api/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: "User created!" });
    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(500).json({ message: "Signup failed", error: err.message });
    }
});

// LOGIN
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });
        
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        const secret = process.env.JWT_SECRET || "hiya_secret_key";
        const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });

        res.json({ token, username: user.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// START SERVER 
const PORT = process.env.PORT || 10000;

sequelize.sync({ alter: true }).then(() => {
    console.log("✅ Database synced successfully");
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error("Database sync failed:", err.message);
});