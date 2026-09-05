import React from 'react';

export default function LoadingState({ message = "Loading inspection details..." }) {
  return (
    <div className="p-8 space-y-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-center space-x-3 mb-6">
        <div className="w-5 h-5 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-700">{message}</span>
      </div>

      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-slate-200 rounded-md w-1/3" />
        <div className="h-32 bg-slate-200 rounded-xl w-full" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-slate-200 rounded-xl" />
          <div className="h-24 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
