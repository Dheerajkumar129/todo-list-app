import React, { useState, useRef } from 'react';
import { Check, Clock, AlertCircle, Trash2, Edit2, ChevronRight } from 'lucide-react';
import { formatDateTime, getPriorityMeta, isOverdue } from '../utils/dateUtils';

export default function TaskItem({
  task,
  onToggleStatus,
  onEdit,
  onDelete
}) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);

  const isCompleted = task.status === 'Completed';
  const priorityMeta = getPriorityMeta(task.priority);
  const overdue = isOverdue(task.dateTime, task.status);

  // Touch Swipe handlers
  const handleTouchStart = (e) => {
    startXRef.current = e.touches[0].clientX;
    currentXRef.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!isSwiping) return;
    currentXRef.current = e.touches[0].clientX;
    const diff = currentXRef.current - startXRef.current;
    
    // Only allow swipe left (diff < 0), max -88px
    if (diff < 0) {
      const offset = Math.max(diff, -88);
      setSwipeOffset(offset);
    } else if (swipeOffset < 0) {
      // Swiping back right to close
      const offset = Math.min(0, swipeOffset + diff);
      setSwipeOffset(offset);
    }
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    // Snap to open (-80px) if pulled more than 35px left, otherwise snap closed
    if (swipeOffset < -35) {
      setSwipeOffset(-80);
    } else {
      setSwipeOffset(0);
    }
  };

  // Close swipe if tapped
  const handleCardClick = (e) => {
    if (swipeOffset < 0) {
      e.stopPropagation();
      setSwipeOffset(0);
      return;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl mb-2.5 select-none bg-slate-50 group">
      {/* Background Action: Delete Button revealed by Swipe Left */}
      <div className="absolute inset-y-0 right-0 w-20 bg-rose-500 flex items-center justify-center rounded-r-2xl z-0 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task);
          }}
          className="w-full h-full flex flex-col items-center justify-center text-white active:bg-rose-600 transition-colors"
          title="Delete Task"
        >
          <Trash2 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-semibold tracking-wide uppercase">Delete</span>
        </button>
      </div>

      {/* Foreground Task Card */}
      <div
        className={`relative z-10 bg-white border border-slate-200/80 rounded-2xl p-3.5 transition-transform duration-150 ${
          isSwiping ? '' : 'transition-transform'
        } ${isCompleted ? 'bg-slate-50/70 border-slate-200/60' : 'hover:border-slate-300'}`}
        style={{ transform: `translateX(${swipeOffset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleCardClick}
      >
        <div className="flex items-start gap-3">
          {/* Status Checkbox / Toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStatus(task);
            }}
            className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 border ${
              isCompleted
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-200'
                : 'border-slate-300 bg-white hover:border-blue-500 active:scale-95'
            }`}
            title={isCompleted ? 'Mark as In Progress' : 'Mark as Completed'}
          >
            {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          {/* Task Info */}
          <div className="flex-1 min-w-0" onClick={() => onEdit(task)}>
            <div className="flex items-start justify-between gap-2">
              <h4
                className={`text-sm font-semibold leading-snug line-clamp-2 transition-all ${
                  isCompleted ? 'text-slate-400 line-through' : 'text-slate-800'
                }`}
              >
                {task.title}
              </h4>

              {/* Priority Chip */}
              {task.priority && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 border ${priorityMeta.bg}`}
                >
                  {priorityMeta.label}
                </span>
              )}
            </div>

            {/* Optional Description */}
            {task.description && (
              <p
                className={`text-xs mt-1 leading-relaxed line-clamp-2 ${
                  isCompleted ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {task.description}
              </p>
            )}

            {/* Metadata Footer: Date, Time, Overdue Alert, Quick Actions */}
            <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className={`w-3.5 h-3.5 ${overdue ? 'text-rose-500' : 'text-slate-400'}`} />
                <span className={overdue ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                  {formatDateTime(task.dateTime)}
                </span>
                {overdue && (
                  <span className="text-[10px] text-rose-500 font-semibold bg-rose-50 px-1.5 py-0.2 rounded">
                    Overdue
                  </span>
                )}
              </div>

              {/* Action Buttons (visible on hover / tap) */}
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                  className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit task"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete task (or swipe left)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
