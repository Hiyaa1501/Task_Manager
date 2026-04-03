const express = require("express");
const bcrypt = require("bcryptjs"); // Using bcryptjs for better compatibility
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// MATCHED TO FRONTEND: changed /register to /signup
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Validation check
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashed
        });

        res.status(201).json({ message: "User created successfully!" });
    } catch (err) {
        // Handle duplicate email errors from Sequelize
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: "Signup failed", error: err.message });
    }
});

module.exports = router;