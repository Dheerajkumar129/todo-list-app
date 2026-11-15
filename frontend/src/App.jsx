import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Calendar,
  Layers,
  Inbox,
  RefreshCw,
  Sparkles,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import Header from './components/Header';
import WeekCard from './components/WeekCard';
import TaskModal from './components/TaskModal';
import SearchModal from './components/SearchModal';
import Toast from './components/Toast';
import { api } from './services/api';

export default function App() {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedWeekId, setExpandedWeekId] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [initialDateForNewTask, setInitialDateForNewTask] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Fetch all tasks grouped by Monday - Sunday weeks
  const fetchWeeklyTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getWeeklyTasks();
      setWeeks(data || []);

      // Automatically expand current week, or first week if current not found
      if (data && data.length > 0) {
        const currentWeek = data.find((w) => w.isCurrentWeek);
        setExpandedWeekId(currentWeek ? currentWeek.weekId : data[0].weekId);
      }
    } catch (err) {
      console.error('Failed to load weekly tasks:', err);
      showToast('Could not sync with backend. Local mode active.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeeklyTasks();
  }, [fetchWeeklyTasks]);

  // Overall statistics across all weeks
  const totalOpen = weeks.reduce((sum, w) => sum + (w.openTasksCount || 0), 0);
  const totalCompleted = weeks.reduce((sum, w) => sum + (w.completedTasksCount || 0), 0);

  // Toggle Week Card expansion
  const handleToggleExpandWeek = (weekId) => {
    setExpandedWeekId((prev) => (prev === weekId ? null : weekId));
  };

  // Open modal to create task
  const handleOpenCreateModal = (suggestedDate = null) => {
    setTaskToEdit(null);
    setInitialDateForNewTask(suggestedDate || new Date());
    setIsTaskModalOpen(true);
  };

  // Open modal to edit task
  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setInitialDateForNewTask(null);
    setIsTaskModalOpen(true);
  };

  // Save Task (Create or Edit)
  const handleSaveTask = async (formData) => {
    try {
      if (taskToEdit) {
        await api.updateTask(taskToEdit._id, formData);
        showToast('Task updated successfully');
      } else {
        await api.createTask(formData);
        showToast('Task scheduled successfully');
      }
      await fetchWeeklyTasks();
    } catch (err) {
      showToast(err.message || 'Error saving task', 'error');
      throw err;
    }
  };

  // Status toggle (In Progress <-> Completed)
  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';

    // Optimistic UI update
    setWeeks((prevWeeks) =>
      prevWeeks.map((week) => {
        const hasTask = week.tasks.some((t) => t._id === task._id);
        if (!hasTask) return week;

        const updatedTasks = week.tasks.map((t) =>
          t._id === task._id ? { ...t, status: newStatus } : t
        );

        const openCount = updatedTasks.filter((t) => t.status !== 'Completed').length;
        const completedCount = updatedTasks.filter((t) => t.status === 'Completed').length;

        return {
          ...week,
          tasks: updatedTasks,
          openTasksCount: openCount,
          completedTasksCount: completedCount
        };
      })
    );

    try {
      await api.toggleStatus(task._id, newStatus);
      showToast(newStatus === 'Completed' ? 'Task marked as completed! 🎉' : 'Task marked as In Progress');
    } catch (err) {
      showToast('Failed to update task status', 'error');
      fetchWeeklyTasks(); // rollback
    }
  };

  // Delete Task
  const handleDeleteTask = async (task) => {
    // Optimistic UI update
    setWeeks((prevWeeks) =>
      prevWeeks.map((week) => {
        const filteredTasks = week.tasks.filter((t) => t._id !== task._id);
        const openCount = filteredTasks.filter((t) => t.status !== 'Completed').length;
        const completedCount = filteredTasks.filter((t) => t.status === 'Completed').length;

        return {
          ...week,
          tasks: filteredTasks,
          openTasksCount: openCount,
          completedTasksCount: completedCount
        };
      })
    );

    try {
      await api.deleteTask(task._id);
      showToast('Task deleted');
    } catch (err) {
      showToast('Failed to delete task', 'error');
      fetchWeeklyTasks(); // rollback
    }
  };

  // Search Tasks
  const handleSearchTasks = async (query) => {
    return await api.searchTasks(query);
  };

  return (
    <div className="min-h-screen bg-slate-900 py-0 sm:py-8 flex flex-col items-center justify-center">
      {/* Container: Toggles between sleek Mobile App Frame & Full Width */}
      <div
        className={`w-full transition-all duration-300 ${
          isMobileFrame
            ? 'max-w-md sm:rounded-[40px] sm:shadow-2xl sm:border-[8px] sm:border-slate-800'
            : 'max-w-3xl sm:rounded-2xl shadow-xl'
        } bg-slate-50 min-h-screen sm:min-h-[880px] flex flex-col relative overflow-hidden`}
      >
        {/* Mobile Device Top Speaker Bar (Only visible in frame mode on desktop) */}
        {isMobileFrame && (
          <div className="hidden sm:flex items-center justify-center pt-2 pb-1 bg-white">
            <div className="w-16 h-1 bg-slate-200 rounded-full"></div>
          </div>
        )}

        {/* Top Header */}
        <Header
          totalOpen={totalOpen}
          totalCompleted={totalCompleted}
          onOpenSearch={() => setIsSearchOpen(true)}
          isMobileFrame={isMobileFrame}
          onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 pb-28 overflow-y-auto">
          {loading ? (
            <div className="py-24 text-center">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
              <p className="text-xs font-semibold text-slate-500">Loading your weekly tasks...</p>
            </div>
          ) : weeks.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl p-6 border border-slate-200">
              <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No tasks created yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Create tasks with title, date & time, priority, and see them organized into Monday–Sunday weeks.
              </p>
              <button
                type="button"
                onClick={() => handleOpenCreateModal()}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Your First Task
              </button>
            </div>
          ) : (
            <div>
              {/* Weekly Cards Section */}
              <div className="space-y-1">
                {weeks.map((week) => (
                  <WeekCard
                    key={week.weekId}
                    week={week}
                    isExpanded={expandedWeekId === week.weekId}
                    onToggleExpand={() => handleToggleExpandWeek(week.weekId)}
                    onToggleStatus={handleToggleStatus}
                    onEditTask={handleOpenEditModal}
                    onDeleteTask={handleDeleteTask}
                    onAddTaskToWeek={handleOpenCreateModal}
                  />
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Floating Action Button (Add Task) */}
        <div className="fixed sm:absolute bottom-6 right-6 z-40">
          <button
            type="button"
            onClick={() => handleOpenCreateModal()}
            className="group flex items-center gap-2 pl-4 pr-5 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-xl shadow-blue-500/30 transition-all"
            title="Create Task"
          >
            <Plus className="w-5 h-5 stroke-[2.5] transition-transform group-hover:rotate-90 duration-200" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Task Creation & Edit Modal */}
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSave={handleSaveTask}
          taskToEdit={taskToEdit}
          initialDate={initialDateForNewTask}
        />

        {/* Search Modal */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onSearch={handleSearchTasks}
          onEditTask={handleOpenEditModal}
          onDeleteTask={handleDeleteTask}
          onToggleStatus={handleToggleStatus}
        />

        {/* Toast Feedback */}
        <Toast toast={toast} onClose={() => setToast(null)} />
      </div>
    </div>
  );
}
