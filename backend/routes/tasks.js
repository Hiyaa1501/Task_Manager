const express = require("express");
const router = express.Router();
const Task = require("../models/Task"); // Assuming you have a Task model

// 1. READ (Get all tasks)
router.get("/", async (req, res) => {
    const tasks = await Task.findAll();
    res.json(tasks);
});

// 2. CREATE (Add a new task)
router.post("/", async (req, res) => {
    const newTask = await Task.create(req.body);
    res.status(201).json(newTask);
});

// 3. UPDATE (Mark as done)
router.put("/:id", async (req, res) => {
    await Task.update(req.body, { where: { id: req.params.id } });
    res.send("Task Updated");
});

// 4. DELETE
router.delete("/:id", async (req, res) => {
    await Task.destroy({ where: { id: req.params.id } });
    res.send("Task Deleted");
});

module.exports = router;