import React, { useState, useEffect } from 'react';
import { rulesService } from '../services/rulesService';
import LoadingState from '../components/LoadingState';
import { Scale, Info, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Rules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    setLoading(true);
    const data = await rulesService.getRules();
    setRules(data);
    setLoading(false);
  };

  if (loading) return <LoadingState message="Loading Legal Metrology Rules Registry from Database..." />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl font-extrabold text-white text-glow">
              Legal Metrology Rules Registry (2011 & Amendments)
            </h1>
          </div>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Rule provisions enforced by SmartMetriX automated compliance verification engine. Loaded live from SQLite database.
          </p>
        </div>
        <span className="px-3.5 py-1.5 bg-blue-500/10 text-blue-300 text-xs font-bold rounded-xl border border-blue-500/30">
          Statutory Gazette 2022 Mandate
        </span>
      </div>

      {/* Rules Registry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="p-5 glass-panel border border-slate-700/60 rounded-2xl shadow-lg hover:border-blue-500/50 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-xs font-bold text-blue-400 px-2.5 py-1 bg-blue-950/80 rounded border border-blue-900/60">
                  {rule.id} — {rule.ruleNumber}
                </span>
                <h3 className="text-base font-bold text-white mt-2">
                  {rule.declaration}
                </h3>
              </div>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {rule.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {rule.description}
            </p>

            <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">{rule.legalReference}</span>
              <span className={`font-bold px-2.5 py-0.5 rounded text-[10px] ${
                rule.severity === 'High' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {rule.severity} Severity
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer Banner */}
      <div className="p-4 glass-panel text-slate-200 rounded-2xl text-xs flex items-center justify-between border border-slate-700/60">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Rule source and amendment versions are dynamically synchronized with the central Legal Metrology SQLite database.</span>
        </div>
        <span className="font-mono text-[10px] text-slate-400 font-bold uppercase">Live Database Sync</span>
      </div>
    </div>
  );
}
