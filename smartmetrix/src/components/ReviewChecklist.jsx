import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, MinusCircle, FileCheck } from 'lucide-react';

export default function ReviewChecklist({ declarations = [], onChange }) {
  const handleStatusChange = (index, newStatus) => {
    const updated = [...declarations];
    updated[index] = { ...updated[index], status: newStatus };
    if (onChange) onChange(updated);
  };

  const statusOptions = [
    { key: 'valid', label: 'Compliant', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20', icon: CheckCircle2 },
    { key: 'needs_review', label: 'Needs Review', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20', icon: AlertTriangle },
    { key: 'invalid', label: 'Non-Compliant', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30 hover:bg-rose-500/20', icon: XCircle },
    { key: 'missing', label: 'Missing', color: 'text-slate-400 bg-slate-800 border-slate-700 hover:bg-slate-700', icon: MinusCircle }
  ];

  return (
    <div className="glass-panel border border-slate-700/50 rounded-2xl overflow-hidden shadow-xs font-sans">
      <div className="p-4 bg-slate-900/80 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-white">
            Mandatory Packaging Declarations Evaluation
          </h3>
        </div>
        <span className="text-xs font-semibold text-blue-400 font-mono">
          Rule 6 Checklist
        </span>
      </div>

      <div className="divide-y divide-slate-800">
        {declarations.map((item, idx) => (
          <div key={idx} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-800/30 transition">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-blue-400">{item.rule || `LM-00${idx+1}`}</span>
                <span className="text-xs font-bold text-white">{item.label}</span>
              </div>
              <p className="text-xs text-slate-300 mt-1 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-700/50 font-mono font-medium">
                {item.value || 'Not provided'}
              </p>
            </div>

            {/* Toggle Status Buttons */}
            <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
              {statusOptions.map((opt) => {
                const IconComp = opt.icon;
                const isSelected = item.status === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleStatusChange(idx, opt.key)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
                      isSelected
                        ? `${opt.color} ring-1 ring-blue-500 shadow-md`
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <IconComp className={`w-3.5 h-3.5 ${isSelected ? '' : 'text-slate-500'}`} />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
