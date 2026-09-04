import React from 'react';
import { PackageSearch } from 'lucide-react';

export default function EmptyState({
  title = "No Records Found",
  description = "No inspection entries meet your current filter or search criteria.",
  icon: Icon = PackageSearch,
  actionLabel,
  onAction
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center glass-panel rounded-2xl border border-slate-700/50 my-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 shadow-lg shadow-blue-500/20">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-white text-glow">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed font-medium">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 rounded-xl shadow-lg shadow-blue-900/50 transition-all hover:scale-105 active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
