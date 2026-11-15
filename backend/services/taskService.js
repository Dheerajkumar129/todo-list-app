const Task = require('../models/Task');
const { getIsConnected } = require('../config/db');
const { groupTasksByWeek } = require('../utils/weekUtils');
const { getInitialSeedTasks } = require('../seedData');

// In-memory fallback store
let memoryTasks = getInitialSeedTasks();

// Seed MongoDB if empty on initial connect
let mongoSeedAttempted = false;
async function ensureMongoSeed() {
  if (!getIsConnected() || mongoSeedAttempted) return;
  try {
    const count = await Task.countDocuments();
    if (count === 0) {
      const seeds = getInitialSeedTasks().map(t => {
        const { _id, ...rest } = t;
        return rest;
      });
      await Task.insertMany(seeds);
      console.log('[MongoDB] Seeded initial sample tasks.');
    }
    mongoSeedAttempted = true;
  } catch (err) {
    console.error('[MongoDB] Error seeding initial tasks:', err.message);
  }
}

/**
 * Get all tasks sorted by dateTime
 */
async function getAllTasks() {
  if (getIsConnected()) {
    await ensureMongoSeed();
    return await Task.find().sort({ dateTime: 1 }).lean();
  } else {
    return [...memoryTasks].sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  }
}

/**
 * Get tasks grouped by week (Monday to Sunday) with summary cards data
 */
async function getWeeklyGroupedTasks() {
  const tasks = await getAllTasks();
  return groupTasksByWeek(tasks);
}

/**
 * Search tasks by keyword in title or description
 */
async function searchTasks(query) {
  if (!query || !query.trim()) {
    return await getAllTasks();
  }
  const term = query.trim().toLowerCase();

  if (getIsConnected()) {
    await ensureMongoSeed();
    const regex = new RegExp(term, 'i');
    return await Task.find({
      $or: [{ title: regex }, { description: regex }]
    })
      .sort({ dateTime: 1 })
      .lean();
  } else {
    return memoryTasks
      .filter(
        t =>
          (t.title && t.title.toLowerCase().includes(term)) ||
          (t.description && t.description.toLowerCase().includes(term))
      )
      .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  }
}

/**
 * Get single task by ID
 */
async function getTaskById(id) {
  if (getIsConnected()) {
    return await Task.findById(id).lean();
  } else {
    const task = memoryTasks.find(t => String(t._id) === String(id));
    return task || null;
  }
}

/**
 * Create a new task
 * Mandatory: title, dateTime
 * Optional: description, priority, status
 */
async function createTask(data) {
  const { title, description, dateTime, priority, status } = data;

  if (!title || !title.trim()) {
    throw new Error('Title is mandatory');
  }
  if (!dateTime) {
    throw new Error('Date and Time is mandatory');
  }

  const parsedDate = new Date(dateTime);
  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid Date and Time format');
  }

  const payload = {
    title: title.trim(),
    description: (description || '').trim(),
    dateTime: parsedDate.toISOString(),
    priority: ['Low', 'Medium', 'High'].includes(priority) ? priority : 'Medium',
    status: status === 'Completed' ? 'Completed' : 'In Progress'
  };

  if (getIsConnected()) {
    const newTask = await Task.create(payload);
    return newTask.toObject();
  } else {
    const newTask = {
      _id: 'task_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryTasks.push(newTask);
    return newTask;
  }
}

/**
 * Update an existing task
 */
async function updateTask(id, data) {
  const { title, description, dateTime, priority, status } = data;

  const updates = {};
  if (title !== undefined) {
    if (!title.trim()) throw new Error('Title cannot be empty');
    updates.title = title.trim();
  }
  if (description !== undefined) {
    updates.description = description.trim();
  }
  if (dateTime !== undefined) {
    const parsedDate = new Date(dateTime);
    if (isNaN(parsedDate.getTime())) throw new Error('Invalid Date and Time format');
    updates.dateTime = parsedDate.toISOString();
  }
  if (priority !== undefined) {
    if (!['Low', 'Medium', 'High'].includes(priority)) {
      throw new Error('Priority must be Low, Medium, or High');
    }
    updates.priority = priority;
  }
  if (status !== undefined) {
    if (!['In Progress', 'Completed'].includes(status)) {
      throw new Error('Status must be In Progress or Completed');
    }
    updates.status = status;
  }

  if (getIsConnected()) {
    const updated = await Task.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).lean();
    if (!updated) throw new Error('Task not found');
    return updated;
  } else {
    const index = memoryTasks.findIndex(t => String(t._id) === String(id));
    if (index === -1) throw new Error('Task not found');

    memoryTasks[index] = {
      ...memoryTasks[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return memoryTasks[index];
  }
}

/**
 * Delete a task
 */
async function deleteTask(id) {
  if (getIsConnected()) {
    const deleted = await Task.findByIdAndDelete(id).lean();
    if (!deleted) throw new Error('Task not found');
    return deleted;
  } else {
    const index = memoryTasks.findIndex(t => String(t._id) === String(id));
    if (index === -1) throw new Error('Task not found');
    const [deleted] = memoryTasks.splice(index, 1);
    return deleted;
  }
}

/**
 * Toggle task status between 'In Progress' and 'Completed'
 */
async function toggleTaskStatus(id, explicitStatus) {
  const existing = await getTaskById(id);
  if (!existing) throw new Error('Task not found');

  const newStatus =
    explicitStatus || (existing.status === 'Completed' ? 'In Progress' : 'Completed');

  return await updateTask(id, { status: newStatus });
}

module.exports = {
  getAllTasks,
  getWeeklyGroupedTasks,
  searchTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus
};
