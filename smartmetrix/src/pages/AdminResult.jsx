import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { inspectionService } from '../services/inspectionService';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import { CheckCircle2, ArrowRight, FileText } from 'lucide-react';

export default function AdminResult() {
  const { id } = useParams();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInspection();
  }, [id]);

  const loadInspection = async () => {
    setLoading(true);
    const data = await inspectionService.getInspectionById(id);
    setInspection(data);
    setLoading(false);
  };

  if (loading || !inspection) return <LoadingState message="Loading confirmation..." />;

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 text-center font-sans">
      <div className="glass-panel p-8 rounded-2xl border border-slate-700/50 space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">
            Legal Metrology Officer Action Executed
          </span>
          <h1 className="text-2xl font-black text-white mt-1 text-glow">
            Review Submitted & Result Issued
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
            Inspection decision for product '<strong className="text-slate-200">{inspection.productName}</strong>' has been logged into the enforcement ledger.
          </p>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl max-w-md mx-auto text-left space-y-2 text-xs">
          <div className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400 font-mono">Inspection ID:</span>
            <span className="font-mono font-bold text-blue-400">{inspection.id}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400 font-mono">Final Status:</span>
            <StatusBadge status={inspection.status} size="sm" />
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400 font-mono">Compliance Score:</span>
            <span className="font-mono font-extrabold text-emerald-400">{inspection.score}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-mono">Verified Officer:</span>
            <span className="font-bold text-slate-200">{inspection.verifiedBy}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/admin/queue"
            className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 rounded-xl shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2 transition-all"
          >
            <span>Return to Inspection Queue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to={`/reports?id=${inspection.id}`}
            className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-slate-300 glass-card hover:text-white rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Preview Official PDF Report</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
