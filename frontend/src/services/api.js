/**
 * API Service for To-Do List App
 * Connects to Express Backend with automatic localStorage fallback for high resilience
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Fallback seed tasks for standalone/offline runs
function getInitialLocalTasks() {
  const saved = localStorage.getItem('elektrix_tasks');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse cached tasks:', e);
    }
  }

  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() + diffToMonday);

  const makeDate = (days, h, m) => {
    const d = new Date(thisMonday);
    d.setDate(thisMonday.getDate() + days);
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };

  const initial = [
    {
      _id: 'task-1',
      title: 'Design Review & Feedback Sync',
      description: 'Review Figma wireframes with the UI/UX team and finalize component specs',
      dateTime: makeDate(-4, 11, 0),
      priority: 'High',
      status: 'Completed'
    },
    {
      _id: 'task-2',
      title: 'Database Schema Migration',
      description: 'Prepare Mongoose models and indexes for task scheduling',
      dateTime: makeDate(-2, 14, 30),
      priority: 'Medium',
      status: 'Completed'
    },
    {
      _id: 'task-3',
      title: 'Implement Weekly Task Grouping',
      description: 'Group tasks by Monday-Sunday calendar weeks with open and completed counters',
      dateTime: makeDate(0, 10, 0),
      priority: 'High',
      status: 'Completed'
    },
    {
      _id: 'task-4',
      title: 'Swipe Left to Delete Task Gesture',
      description: 'Add smooth touch swipe gesture on task items to reveal delete action button',
      dateTime: makeDate(1, 15, 0),
      priority: 'High',
      status: 'In Progress'
    },
    {
      _id: 'task-5',
      title: 'Real-time Keyword Search',
      description: 'Filter tasks instantly by title and description keywords with modal view',
      dateTime: makeDate(2, 16, 30),
      priority: 'Medium',
      status: 'In Progress'
    },
    {
      _id: 'task-6',
      title: 'Team Retrospective & Demo',
      description: 'Weekly sprint retrospective and product walkthrough with stakeholders',
      dateTime: makeDate(4, 17, 0),
      priority: 'Low',
      status: 'In Progress'
    },
    {
      _id: 'task-7',
      title: 'Deploy to Cloud & Configure Netlify',
      description: 'Set up continuous deployment pipeline on Netlify with backend API connection',
      dateTime: makeDate(7, 10, 0),
      priority: 'High',
      status: 'In Progress'
    },
    {
      _id: 'task-8',
      title: 'End-to-End User Testing',
      description: 'Test mobile touch responsiveness and CRUD workflows on real devices',
      dateTime: makeDate(9, 14, 0),
      priority: 'Medium',
      status: 'In Progress'
    }
  ];

  localStorage.setItem('elektrix_tasks', JSON.stringify(initial));
  return initial;
}

function saveLocalTasks(tasks) {
  localStorage.setItem('elektrix_tasks', JSON.stringify(tasks));
}

// Client-side week grouping helper for fallback mode
function groupTasksLocally(tasks) {
  const weeksMap = new Map();
  const now = new Date();

  // Helper for Monday to Sunday
  function getRange(dInput) {
    const d = new Date(dInput);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const mon = new Date(d);
    mon.setDate(d.getDate() + diff);
    mon.setHours(0, 0, 0, 0);

    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    sun.setHours(23, 59, 59, 999);

    const y = mon.getFullYear();
    const m = String(mon.getMonth() + 1).padStart(2, '0');
    const dStr = String(mon.getDate()).padStart(2, '0');
    const weekId = `${y}-${m}-${dStr}`;
    const sStr = mon.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const eStr = sun.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return { weekId, startDate: mon.toISOString(), endDate: sun.toISOString(), label: `${sStr} – ${eStr}` };
  }

  const currentRange = getRange(now);

  for (const t of tasks) {
    const range = getRange(t.dateTime);
    if (!weeksMap.has(range.weekId)) {
      weeksMap.set(range.weekId, {
        weekId: range.weekId,
        startDate: range.startDate,
        endDate: range.endDate,
        label: range.label,
        isCurrentWeek: range.weekId === currentRange.weekId,
        openTasksCount: 0,
        completedTasksCount: 0,
        totalTasksCount: 0,
        tasks: []
      });
    }

    const group = weeksMap.get(range.weekId);
    group.tasks.push(t);
    group.totalTasksCount += 1;
    if (t.status === 'Completed') {
      group.completedTasksCount += 1;
    } else {
      group.openTasksCount += 1;
    }
  }

  if (!weeksMap.has(currentRange.weekId)) {
    weeksMap.set(currentRange.weekId, {
      weekId: currentRange.weekId,
      startDate: currentRange.startDate,
      endDate: currentRange.endDate,
      label: currentRange.label,
      isCurrentWeek: true,
      openTasksCount: 0,
      completedTasksCount: 0,
      totalTasksCount: 0,
      tasks: []
    });
  }

  const sorted = Array.from(weeksMap.values()).sort((a, b) => a.weekId.localeCompare(b.weekId));
  for (const w of sorted) {
    w.tasks.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  }
  return sorted;
}

export const api = {
  // Fetch weekly tasks
  async getWeeklyTasks() {
    try {
      const res = await fetch(`${API_BASE}/tasks/weekly`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.info('[API] Backend unavailable, using responsive local storage store.');
      const local = getInitialLocalTasks();
      return groupTasksLocally(local);
    }
  },

  // Search tasks
  async searchTasks(query) {
    try {
      const res = await fetch(`${API_BASE}/tasks/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.data;
    } catch (err) {
      const local = getInitialLocalTasks();
      const q = (query || '').toLowerCase().trim();
      return local.filter(
        t =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }
  },

  // Create task
  async createTask(taskData) {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('[API] Using local fallback for createTask:', err.message);
      const local = getInitialLocalTasks();
      const newTask = {
        _id: 'task_' + Date.now().toString(36),
        title: taskData.title.trim(),
        description: (taskData.description || '').trim(),
        dateTime: new Date(taskData.dateTime).toISOString(),
        priority: taskData.priority || 'Medium',
        status: taskData.status || 'In Progress',
        createdAt: new Date().toISOString()
      };
      local.push(newTask);
      saveLocalTasks(local);
      return newTask;
    }
  },

  // Update task
  async updateTask(id, taskData) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('[API] Using local fallback for updateTask:', err.message);
      const local = getInitialLocalTasks();
      const idx = local.findIndex(t => String(t._id) === String(id));
      if (idx !== -1) {
        local[idx] = { ...local[idx], ...taskData, updatedAt: new Date().toISOString() };
        saveLocalTasks(local);
        return local[idx];
      }
      throw err;
    }
  },

  // Toggle status
  async toggleStatus(id, newStatus) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('[API] Using local fallback for toggleStatus:', err.message);
      const local = getInitialLocalTasks();
      const idx = local.findIndex(t => String(t._id) === String(id));
      if (idx !== -1) {
        const targetStatus = newStatus || (local[idx].status === 'Completed' ? 'In Progress' : 'Completed');
        local[idx].status = targetStatus;
        local[idx].updatedAt = new Date().toISOString();
        saveLocalTasks(local);
        return local[idx];
      }
      throw err;
    }
  },

  // Delete task
  async deleteTask(id) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      return data.data;
    } catch (err) {
      console.warn('[API] Using local fallback for deleteTask:', err.message);
      const local = getInitialLocalTasks();
      const filtered = local.filter(t => String(t._id) !== String(id));
      saveLocalTasks(filtered);
      return { id };
    }
  }
};
