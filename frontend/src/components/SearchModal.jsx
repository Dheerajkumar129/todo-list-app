import React, { useState, useEffect } from 'react';
import { Search, X, Calendar, Clock, Edit2, Trash2, Check, AlertCircle } from 'lucide-react';
import { formatDateTime, getPriorityMeta } from '../utils/dateUtils';

export default function SearchModal({
  isOpen,
  onClose,
  onSearch,
  onEditTask,
  onDeleteTask,
  onToggleStatus
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const data = await onSearch(searchTerm);
        setResults(data || []);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm, isOpen, onSearch]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white sm:rounded-3xl shadow-2xl border border-slate-100 flex flex-col h-full sm:h-auto sm:max-h-[85vh] overflow-hidden">
        {/* Search Header Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search tasks by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-100 border-none text-sm font-medium focus:ring-2 focus:ring-blue-500/20 focus:bg-white text-slate-800 transition-all placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1"
          >
            Cancel
          </button>
        </div>

        {/* Results Info */}
        <div className="px-5 py-2 bg-slate-50 text-xs font-semibold text-slate-500 flex items-center justify-between border-b border-slate-100">
          <span>
            {loading ? 'Searching...' : `${results.length} task${results.length !== 1 ? 's' : ''} found`}
          </span>
          {searchTerm && <span>for "{searchTerm}"</span>}
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {results.length === 0 && !loading && (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-slate-600">No matching tasks</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Try searching for different keywords like "Review", "Deploy", or "Design".
              </p>
            </div>
          )}

          {results.map((task) => {
            const isCompleted = task.status === 'Completed';
            const priorityMeta = getPriorityMeta(task.priority);

            return (
              <div
                key={task._id}
                className="p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-300 transition-all"
              >
                <div className="flex items-start gap-3">
                  {/* Status Toggle */}
                  <button
                    type="button"
                    onClick={() => onToggleStatus(task)}
                    className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-300 hover:border-blue-500'
                    }`}
                  >
                    {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>

                  {/* Task Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-sm font-semibold leading-tight ${
                          isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'
                        }`}
                      >
                        {task.title}
                      </h4>
                      {task.priority && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${priorityMeta.bg}`}
                        >
                          {priorityMeta.label}
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDateTime(task.dateTime)}</span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onEditTask(task);
                          }}
                          className="px-2 py-1 rounded-lg text-blue-600 hover:bg-blue-50 flex items-center gap-1 text-xs font-semibold"
                        >
                          <Edit2 className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteTask(task)}
                          className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-1 text-xs font-semibold"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
