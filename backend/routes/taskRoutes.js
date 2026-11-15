const express = require('express');
const router = express.Router();
const taskService = require('../services/taskService');

/**
 * @route   GET /api/tasks/weekly
 * @desc    Get tasks grouped by week (Monday to Sunday) with summary card counts
 */
router.get('/weekly', async (req, res) => {
  try {
    const weeklyData = await taskService.getWeeklyGroupedTasks();
    res.json({
      success: true,
      count: weeklyData.length,
      data: weeklyData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/tasks/search
 * @desc    Search tasks using keywords (title, description)
 */
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    const tasks = await taskService.searchTasks(query);
    res.json({
      success: true,
      query,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks
 */
router.get('/', async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/tasks/:id
 * @desc    Get single task
 */
router.get('/:id', async (req, res) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 */
router.post('/', async (req, res) => {
  try {
    const newTask = await taskService.createTask(req.body);
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update an existing task
 */
router.put('/:id', async (req, res) => {
  try {
    const updated = await taskService.updateTask(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updated
    });
  } catch (error) {
    const status = error.message === 'Task not found' ? 404 : 400;
    res.status(status).json({ success: false, message: error.message });
  }
});

/**
 * @route   PATCH /api/tasks/:id/status
 * @desc    Update task status (Completed or In Progress)
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await taskService.toggleTaskStatus(req.params.id, status);
    res.json({
      success: true,
      message: `Task marked as ${updated.status}`,
      data: updated
    });
  } catch (error) {
    const status = error.message === 'Task not found' ? 404 : 400;
    res.status(status).json({ success: false, message: error.message });
  }
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await taskService.deleteTask(req.params.id);
    res.json({
      success: true,
      message: 'Task deleted successfully',
      data: deleted
    });
  } catch (error) {
    const status = error.message === 'Task not found' ? 404 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
});

module.exports = router;
