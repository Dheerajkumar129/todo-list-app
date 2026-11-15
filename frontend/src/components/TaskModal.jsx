import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, AlignLeft, CheckCircle2, Clock } from 'lucide-react';
import { toDateTimeLocalString } from '../utils/dateUtils';

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  taskToEdit = null,
  initialDate = null
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('In Progress');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(taskToEdit);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setDateTime(toDateTimeLocalString(taskToEdit.dateTime));
      setPriority(taskToEdit.priority || 'Medium');
      setStatus(taskToEdit.status || 'In Progress');
      setError('');
    } else {
      setTitle('');
      setDescription('');
      // Default to initialDate if provided, or current time
      setDateTime(toDateTimeLocalString(initialDate || new Date()));
      setPriority('Medium');
      setStatus('In Progress');
      setError('');
    }
  }, [taskToEdit, initialDate, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is mandatory');
      return;
    }
    if (!dateTime) {
      setError('Date & Time is mandatory');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await onSave({
        title: title.trim(),
        description: description.trim(),
        dateTime: new Date(dateTime).toISOString(),
        priority,
        status
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityOptions = [
    { value: 'Low', color: 'border-emerald-200 text-emerald-700 bg-emerald-50 active:bg-emerald-100' },
    { value: 'Medium', color: 'border-amber-200 text-amber-700 bg-amber-50 active:bg-amber-100' },
    { value: 'High', color: 'border-rose-200 text-rose-700 bg-rose-50 active:bg-rose-100' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fadeIn">
      {/* Modal Dialog Sheet */}
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEditing ? 'Update task attributes and schedule' : 'Add details to schedule in the weekly calendar'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Title (Mandatory) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Finish Weekly Report"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-800"
            />
          </div>

          {/* Description (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5 text-slate-400" />
              Description <span className="text-slate-400 text-[10px] font-normal">(optional)</span>
            </label>
            <textarea
              placeholder="Add extra context, notes or checklist..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {/* Date & Time (Mandatory) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Date & Time <span className="text-rose-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 bg-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Task will be organized into its corresponding Monday–Sunday week card.
            </p>
          </div>

          {/* Priority (Optional) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Flag className="w-3.5 h-3.5 text-slate-400" />
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {priorityOptions.map((opt) => {
                const isSelected = priority === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPriority(opt.value)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? `${opt.color} ring-2 ring-blue-500 shadow-xs font-bold`
                        : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    {opt.value}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status (Only in Edit mode) */}
          {isEditing && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('In Progress')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    status === 'In Progress'
                      ? 'bg-blue-50 border-blue-300 text-blue-700 ring-2 ring-blue-500 shadow-xs'
                      : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  In Progress (Open)
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('Completed')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    status === 'Completed'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700 ring-2 ring-emerald-500 shadow-xs'
                      : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  Completed (Closed)
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
