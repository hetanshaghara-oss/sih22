import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, MinusCircle, FileCheck } from 'lucide-react';

export default function ReviewChecklist({ declarations = [], onChange }) {
  const handleStatusChange = (index, newStatus) => {
    const updated = [...declarations];
    updated[index] = { ...updated[index], status: newStatus };
    if (onChange) onChange(updated);
  };

  const statusOptions = [
    { key: 'valid', label: 'Compliant', color: 'text-emerald-700 bg-emerald-50 border-emerald-300 hover:bg-emerald-100', icon: CheckCircle2 },
    { key: 'needs_review', label: 'Needs Review', color: 'text-amber-800 bg-amber-50 border-amber-300 hover:bg-amber-100', icon: AlertTriangle },
    { key: 'invalid', label: 'Non-Compliant', color: 'text-rose-700 bg-rose-50 border-rose-300 hover:bg-rose-100', icon: XCircle },
    { key: 'missing', label: 'Missing', color: 'text-slate-700 bg-slate-100 border-slate-300 hover:bg-slate-200', icon: MinusCircle }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs font-sans">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-blue-700" />
          <h3 className="text-sm font-bold text-slate-900">
            Mandatory Packaging Declarations Evaluation
          </h3>
        </div>
        <span className="text-xs font-semibold text-slate-500 font-mono">
          Rule 6 Checklist
        </span>
      </div>

      <div className="divide-y divide-slate-200">
        {declarations.map((item, idx) => (
          <div key={idx} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/50 transition">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-blue-700">{item.rule || `LM-00${idx+1}`}</span>
                <span className="text-xs font-bold text-slate-900">{item.label}</span>
              </div>
              <p className="text-xs text-slate-700 mt-1 bg-slate-50 px-2.5 py-1 rounded border border-slate-200 font-mono font-medium">
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
                    className={`px-2.5 py-1 rounded-md border text-xs font-bold flex items-center gap-1 transition ${
                      isSelected
                        ? `${opt.color} ring-1 ring-blue-600 shadow-2xs`
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <IconComp className={`w-3.5 h-3.5 ${isSelected ? '' : 'text-slate-400'}`} />
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
