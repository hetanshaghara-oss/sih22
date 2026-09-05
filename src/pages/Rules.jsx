import React from 'react';
import { LEGAL_METROLOGY_RULES } from '../data/rules';
import { Scale, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Rules() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-extrabold text-slate-900">
              Legal Metrology Rules Registry (2011 & Amendments)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Rule provisions enforced by SmartMetriX automated compliance verification engine.
          </p>
        </div>
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200">
          Statutory Gazette 2022 Mandate
        </span>
      </div>

      {/* Rules Registry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LEGAL_METROLOGY_RULES.map((rule) => (
          <div
            key={rule.id}
            className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs hover:border-indigo-300 transition space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded border border-indigo-100">
                  {rule.id} — {rule.ruleNumber}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {rule.declaration}
                </h3>
              </div>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {rule.status}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {rule.description}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-mono">{rule.legalReference}</span>
              <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                rule.severity === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
              }`}>
                {rule.severity} Severity
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer Banner */}
      <div className="p-4 bg-slate-900 text-slate-300 rounded-2xl text-xs flex items-center justify-between border border-slate-800">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Rule source and amendment versions will be dynamically connected to official regulatory gazette data via backend API.</span>
        </div>
        <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">SIH Prototype Matrix</span>
      </div>
    </div>
  );
}
