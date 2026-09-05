import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { inspectionService } from '../services/inspectionService';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import { CheckCircle2, Send, ArrowRight, LayoutDashboard, FileText } from 'lucide-react';

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
    <div className="max-w-3xl mx-auto space-y-6 py-6 text-center">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold text-emerald-700 uppercase">
            Legal Metrology Officer Action Executed
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Review Submitted & Result Issued
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Inspection decision for product '<strong className="text-slate-800">{inspection.productName}</strong>' has been logged into the enforcement ledger.
          </p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-w-md mx-auto text-left space-y-2 text-xs">
          <div className="flex justify-between border-b border-slate-200 pb-1.5">
            <span className="text-slate-400 font-mono">Inspection ID:</span>
            <span className="font-mono font-bold text-slate-900">{inspection.id}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-1.5">
            <span className="text-slate-400 font-mono">Final Status:</span>
            <StatusBadge status={inspection.status} size="sm" />
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-1.5">
            <span className="text-slate-400 font-mono">Compliance Score:</span>
            <span className="font-mono font-extrabold text-blue-700">{inspection.score}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-mono">Verified Officer:</span>
            <span className="font-bold text-slate-800">{inspection.verifiedBy}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/admin/queue"
            className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md flex items-center justify-center gap-2"
          >
            <span>Return to Inspection Queue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to={`/reports?id=${inspection.id}`}
            className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Preview Official PDF Report</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
