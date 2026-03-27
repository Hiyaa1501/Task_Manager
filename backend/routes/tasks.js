const express = require("express");
const router = express.Router();
const Task = require("../models/tasks"); 
const auth = require('../middleware/authMiddleware'); 

// 1. READ (Get all tasks)
// Added 'auth' to ensure only logged-in users see their tasks
router.get("/", auth, async (req, res) => {
    try {
        const tasks = await Task.findAll();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// 2. CREATE (Add a new task)
router.post("/", auth, async (req, res) => {
    try {
        const { title, description } = req.body;

        // validation
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const newTask = await Task.create({
            title,
            description,
        });

        res.status(201).json(newTask);
    } catch (error) {
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
        const deletedRows = await Task.destroy({ 
            where: { id: req.params.id } 
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task Deleted" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed", error: error.message });
    }
});

module.exports = router;