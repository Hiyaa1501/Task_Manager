const express = require("express");
const router = express.Router();
const Task = require("../models/Task"); 
const auth = require('../middleware/authMiddleware');

// GET ALL USER TASKS
router.get("/", auth, async (req, res) => {
    try {
        const tasks = await Task.findAll({ where: { userId: req.user.id } });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
});

// CREATE TASK
router.post("/", auth, async (req, res) => {
    try {
        const newTask = await Task.create({ 
            title: req.body.title, 
            is_important: req.body.is_important || false, // Default to false if not provided
            userId: req.user.id 
        });
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: "Create failed", error: error.message });
    }
});

// UPDATE TASK (Starring and Title Editing)
router.put("/:id", auth, async (req, res) => {
    try {
        const { title, is_important } = req.body;
        const [updatedRows] = await Task.update(
            { title, is_important }, 
            { where: { id: req.params.id, userId: req.user.id } }
        );

        if (updatedRows === 0) return res.status(404).json({ message: "Unauthorized or not found" });
        res.json({ message: "Updated" });
    } catch (error) {
        res.status(400).json({ message: "Update failed", error: error.message });
    }
});

// DELETE TASK
router.delete("/:id", auth, async (req, res) => {
    try {
        const result = await Task.destroy({ where: { id: req.params.id, userId: req.user.id } });
        if (result === 0) return res.status(403).json({ message: "Unauthorized or not found" });
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
});

module.exports = router;