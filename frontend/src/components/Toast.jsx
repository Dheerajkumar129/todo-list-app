import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type !== 'error';

  return (
    <div className="fixed bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 animate-bounce-short">
      <div
        className={`px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold border ${
          isSuccess
            ? 'bg-slate-900 text-white border-slate-800'
            : 'bg-rose-600 text-white border-rose-700'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        ) : (
          <AlertCircle className="w-4 h-4 text-white shrink-0" />
        )}
        <span>{toast.message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
