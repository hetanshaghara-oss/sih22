import React from 'react';
import { Clock, CheckCircle2, User, ShieldCheck } from 'lucide-react';

export default function Timeline({ events = [] }) {
  if (!events || events.length === 0) return null;

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Clock className="w-4 h-4 text-blue-600" />
        <h4 className="text-sm font-bold text-slate-800">Inspection Audit Timeline</h4>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {events.map((event, idx) => (
          <div key={idx} className="relative group">
            {/* Circle node */}
            <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center shadow-2xs">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>{event.title}</span>
                <span className="text-[11px] font-mono text-slate-400 font-normal">{event.date}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 font-medium">
                <User className="w-3 h-3 text-slate-400" />
                <span>{event.actor}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
