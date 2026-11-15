import React from 'react';

export default function ProgressBar({ openCount = 0, completedCount = 0, size = 'md' }) {
  const total = openCount + completedCount;
  const percentage = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  const heightClass = size === 'sm' ? 'h-1.5' : 'h-2.5';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs mb-1.5">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            {openCount} Open
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {completedCount} Completed
          </span>
        </div>
        <span className="font-semibold text-slate-700">{percentage}%</span>
      </div>

      <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClass} p-0.5`}>
        <div
          className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
