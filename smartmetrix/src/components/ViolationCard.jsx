import React from 'react';
import { AlertCircle, AlertTriangle, Check, X, ShieldAlert } from 'lucide-react';

export default function ViolationCard({ violation, onConfirm, onDismiss, isAdmin = false }) {
  if (!violation) return null;

  const severityColors = {
    High: "bg-rose-100 text-rose-800 border-rose-200",
    Medium: "bg-amber-100 text-amber-800 border-amber-200",
    Low: "bg-blue-100 text-blue-800 border-blue-200"
  };

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-2xs hover:border-slate-300 transition space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
            <ShieldAlert className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-slate-500">{violation.ruleId || 'LM-RULE'}</span>
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${severityColors[violation.severity] || severityColors.Medium}`}>
                {violation.severity} Severity
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-1">
              {violation.title}
            </h4>
          </div>
        </div>

        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
          {violation.status || 'Pending Review'}
        </span>
      </div>

      <p className="text-xs text-slate-600 pl-10 leading-relaxed">
        {violation.remarks || violation.description}
      </p>

      {violation.evidenceImage && (
        <div className="pl-10 flex items-center gap-2 text-xs text-slate-500 font-mono">
          <span className="font-semibold text-slate-700">Evidence Source:</span>
          <span className="px-2 py-0.5 bg-slate-100 rounded border border-slate-200">{violation.evidenceImage}</span>
        </div>
      )}

      {isAdmin && (
        <div className="pl-10 pt-2 flex items-center gap-2 border-t border-slate-100">
          <button
            onClick={() => onConfirm && onConfirm(violation.id)}
            className="px-3 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md flex items-center gap-1 transition"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Confirm Violation</span>
          </button>
          <button
            onClick={() => onDismiss && onDismiss(violation.id)}
            className="px-3 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md flex items-center gap-1 transition"
          >
            <X className="w-3.5 h-3.5" />
            <span>Dismiss</span>
          </button>
        </div>
      )}
    </div>
  );
}
