import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { inspectionService } from '../services/inspectionService';
import ComplianceScore from '../components/ComplianceScore';
import StatusBadge from '../components/StatusBadge';
import ViolationCard from '../components/ViolationCard';
import Timeline from '../components/Timeline';
import LoadingState from '../components/LoadingState';
import BoundingBoxOverlay from '../components/BoundingBoxOverlay';
import PremiumCard from '../components/PremiumCard';
import { Download, ArrowLeft, ShieldCheck, AlertCircle, FileSpreadsheet, Building2 } from 'lucide-react';

export default function InspectionResult() {
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

  if (loading || !inspection) {
    return <LoadingState message="Fetching inspection results & legal score..." />;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-700/50">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/user/dashboard" className="text-slate-400 hover:text-white transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-mono text-sm font-bold text-blue-400">{inspection.id}</span>
            <StatusBadge status={inspection.status} size="sm" />
          </div>
          <h1 className="text-2xl font-black text-white mt-1 text-glow">
            {inspection.productName}
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Manufacturer: {inspection.manufacturer} | Submitted: {inspection.submittedAt}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/reports?id=${inspection.id}`}
            className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 rounded-xl shadow-lg shadow-blue-900/50 flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Official Legal Report</span>
          </Link>
        </div>
      </div>

      {/* Main Score & Remarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left: Compliance Score */}
        <div className="md:col-span-4">
          <ComplianceScore score={inspection.score} />
        </div>

        {/* Right: Officer Remarks & Status Overview */}
        <div className="md:col-span-8 glass-panel p-6 rounded-2xl border border-slate-700/50 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Verification Officer Assessment</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                Verified By: {inspection.verifiedBy || 'Pending Review Officer'}
              </span>
            </div>

            <div className="mt-4 p-4 bg-slate-900/80 border border-slate-700/60 rounded-xl space-y-2">
              <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">Official Officer Remarks:</div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {inspection.adminRemarks || "Your inspection is currently queued for administrative verification by the Legal Metrology officer."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="p-2.5 glass-card rounded-lg border border-slate-700/50">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Priority</div>
              <div className="font-bold text-white mt-0.5">{inspection.priority || 'Normal'}</div>
            </div>
            <div className="p-2.5 glass-card rounded-lg border border-slate-700/50">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Category</div>
              <div className="font-bold text-white mt-0.5">{inspection.category}</div>
            </div>
            <div className="p-2.5 glass-card rounded-lg border border-slate-700/50">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Violations Flagged</div>
              <div className="font-bold text-rose-400 mt-0.5">{inspection.violations.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Uploaded Packaging Bounding Box Analysis */}
      {inspection.images && inspection.images.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-400" />
            <span>Packaging Label AI Region Analysis</span>
          </h3>
          <BoundingBoxOverlay image={inspection.images[0]} />
        </div>
      )}

      {/* Legal Metrology Rule Checklist breakdown */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 space-y-4">
        <h3 className="text-sm font-bold text-white border-b border-slate-700/50 pb-3">
          Rule 6 Mandatory Declarations Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {inspection.declarations?.map((item, idx) => (
            <div key={idx} className="p-3 glass-card rounded-xl border border-slate-700/50 flex items-center justify-between text-xs">
              <div>
                <span className="font-mono text-[10px] text-blue-400 font-bold">{item.rule}</span>
                <div className="font-bold text-white">{item.label}</div>
                <div className="text-slate-400 mt-0.5 font-mono">{item.value}</div>
              </div>
              <StatusBadge status={item.status} size="sm" showIcon={false} />
            </div>
          ))}
        </div>
      </div>

      {/* Identified Violations Section */}
      {inspection.violations && inspection.violations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-rose-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400" />
            <span>Flagged Compliance Violations ({inspection.violations.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inspection.violations.map((vio) => (
              <ViolationCard key={vio.id} violation={vio} isAdmin={false} />
            ))}
          </div>
        </div>
      )}

      {/* Audit Timeline */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
        <Timeline events={inspection.auditTimeline} />
      </div>
    </div>
  );
}
