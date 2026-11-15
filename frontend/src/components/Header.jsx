import React from 'react';
import { Search, Calendar, CheckCircle2, ListTodo, Smartphone, Monitor } from 'lucide-react';

export default function Header({
  totalOpen = 0,
  totalCompleted = 0,
  onOpenSearch,
  isMobileFrame,
  onToggleFrame
}) {
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  return (
    <header className="px-5 pt-6 pb-4 bg-white/95 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100/60 inline-flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {today}
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            To-Do List
          </h1>
        </div>

        {/* Top Actions: Search + Frame Toggle */}
        <div className="flex items-center gap-2">
          {/* Desktop Frame Mode Toggle */}
          <button
            type="button"
            onClick={onToggleFrame}
            className="hidden sm:flex w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 items-center justify-center transition-colors"
            title={isMobileFrame ? 'Expand to Full Width' : 'Switch to Mobile Frame'}
          >
            {isMobileFrame ? (
              <Monitor className="w-4 h-4" />
            ) : (
              <Smartphone className="w-4 h-4" />
            )}
          </button>

          {/* Search Trigger Button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-10 h-10 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs border border-blue-100 transition-all active:scale-95"
            title="Search tasks"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Global Quick Stats */}
      <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
        <span className="inline-flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          {totalOpen} Open
        </span>
        <span className="inline-flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          {totalCompleted} Completed
        </span>
        <span className="text-slate-400 font-normal ml-auto text-[11px]">
          Monday – Sunday weeks
        </span>
      </div>
    </header>
  );
}
