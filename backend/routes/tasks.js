const express = require("express");
const router = express.Router();
const Task = require("../models/tasks"); 
const auth = require('../middleware/authMiddleware'); 

// 1. READ (Get all tasks)
// Added 'auth' to ensure only logged-in users see their tasks
router.get("/", auth, async (req, res) => {
    try {
        // req.user.id is the ID we extracted from the JWT token in your middleware
        const tasks = await Task.findAll({
            where: { 
                userId: req.user.id // This is the "Magic Filter"
            }
        });
        
        res.json(tasks);
    } catch (error) {
        console.error("Fetch Error:", error.message);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// 2. CREATE (Add a new task)
router.post("/", auth, async (req, res) => {
    try {
        const { title } = req.body;

        // CRITICAL: You must pass the userId to the database
        const newTask = await Task.create({ 
        title: req.body.title, 
        userId: req.user.id  // This 'id' must exist in your Task model!
    });

        res.status(201).json(newTask);
    } catch (error) {
        // This will print the EXACT reason for the 400 error in your VS Code Terminal
        console.error("SQL ERROR:", error.message); 
        res.status(400).json({ message: "Failed to create task", error: error.message });
    }
});

// 3. UPDATE (Mark as done / Edit)
router.put("/:id", auth, async (req, res) => {
    try {
        const [updatedRows] = await Task.update(req.body, { 
            where: { id: req.params.id } 
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task Updated" });
    } catch (error) {
        res.status(400).json({ message: "Update failed", error: error.message });
    }
});

// 4. DELETE
router.delete("/:id", auth, async (req, res) => {
    try {
        const result = await Task.destroy({
            where: { 
                id: req.params.id, 
                userId: req.user.id // Only delete if the note belongs to THIS user
            }
        });
        
        if (result === 0) {
            return res.status(403).json({ message: "You don't have permission to delete this!" });
        }
        res.json({ message: "Note deleted successfully" });
    } catch (err) {
        res.status(500).send("Error deleting note");
    }
});

module.exports = router;