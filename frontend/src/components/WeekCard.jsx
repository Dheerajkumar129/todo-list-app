import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Plus,
  CheckCircle2,
  Circle,
  Inbox
} from 'lucide-react';
import ProgressBar from './ProgressBar';
import TaskItem from './TaskItem';

export default function WeekCard({
  week,
  isExpanded,
  onToggleExpand,
  onToggleStatus,
  onEditTask,
  onDeleteTask,
  onAddTaskToWeek
}) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'OPEN' | 'COMPLETED'

  const filteredTasks = week.tasks.filter((t) => {
    if (filter === 'OPEN') return t.status !== 'Completed';
    if (filter === 'COMPLETED') return t.status === 'Completed';
    return true;
  });

  return (
    <div
      className={`rounded-2xl transition-all duration-200 border bg-white overflow-hidden shadow-sm ${
        isExpanded
          ? 'border-blue-300 ring-2 ring-blue-500/10 shadow-md mb-4'
          : 'border-slate-200/90 hover:border-slate-300 mb-3'
      }`}
    >
      {/* Week Header / Summary Card (Clickable to Expand) */}
      <div
        onClick={onToggleExpand}
        className="p-4 cursor-pointer select-none bg-white hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                <Calendar className="w-3.5 h-3.5" />
                {week.isCurrentWeek ? 'This Week' : 'Weekly Plan'}
              </span>

              <h3 className="text-sm font-bold text-slate-800 tracking-tight">
                {week.label}
              </h3>
            </div>

            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Monday – Sunday
            </p>
          </div>

          {/* Expand/Collapse Chevron */}
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 transition-transform">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-blue-600" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </div>

        {/* Task Summary Badges & Progress Bar */}
        <div className="mt-3.5 pt-3 border-t border-slate-100">
          <ProgressBar
            openCount={week.openTasksCount}
            completedCount={week.completedTasksCount}
          />
        </div>
      </div>

      {/* Expanded Detailed Task List */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 bg-slate-50/40 border-t border-slate-100 animate-fadeIn">
          {/* Subheader with Filter Tabs and Quick Add */}
          <div className="flex items-center justify-between gap-2 py-2 mb-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-200/70 p-0.5 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filter === 'ALL'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({week.tasks.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('OPEN')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filter === 'OPEN'
                    ? 'bg-white text-blue-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Open ({week.openTasksCount})
              </button>
              <button
                type="button"
                onClick={() => setFilter('COMPLETED')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  filter === 'COMPLETED'
                    ? 'bg-white text-emerald-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Done ({week.completedTasksCount})
              </button>
            </div>

            {/* Quick Add Task for this Week */}
            <button
              type="button"
              onClick={() => onAddTaskToWeek(week.startDate)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-2.5 py-1.5 rounded-xl border border-blue-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Task
            </button>
          </div>

          {/* Swipe Hint (Helper for User Flow) */}
          <div className="text-[11px] text-slate-400 mb-2 flex items-center justify-between px-1">
            <span>💡 Swipe left on a task to delete</span>
            <span>{filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Tasks Container */}
          {filteredTasks.length === 0 ? (
            <div className="py-8 text-center bg-white rounded-2xl border border-dashed border-slate-200 p-4">
              <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">No tasks found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {filter === 'ALL'
                  ? 'There are no tasks scheduled for this week.'
                  : `No ${filter.toLowerCase()} tasks in this week.`}
              </p>
              <button
                type="button"
                onClick={() => onAddTaskToWeek(week.startDate)}
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Schedule a Task
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onToggleStatus={onToggleStatus}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
