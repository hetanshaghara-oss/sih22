import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { inspectionService } from '../services/inspectionService';
import ComplianceScore from '../components/ComplianceScore';
import StatusBadge from '../components/StatusBadge';
import ViolationCard from '../components/ViolationCard';
import Timeline from '../components/Timeline';
import LoadingState from '../components/LoadingState';
import BoundingBoxOverlay from '../components/BoundingBoxOverlay';
import PackageOnlineComparison from '../components/PackageOnlineComparison';
import WebVerificationPanel from '../components/WebVerificationPanel';
import { Download, ArrowLeft, ShieldCheck, AlertCircle, FileSpreadsheet, ShoppingBag, Globe } from 'lucide-react';

export default function InspectionResult() {
  const { id } = useParams();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('audit'); // 'audit' | 'online_comparison' | 'web_verification'

  const loadInspection = useCallback(async () => {
    setLoading(true);
    const data = await inspectionService.getInspectionById(id);
    setInspection(data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadInspection();
  }, [loadInspection]);

  if (loading || !inspection) {
    return <LoadingState message="Fetching inspection results & legal score..." />;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/user/dashboard" className="text-slate-400 hover:text-slate-700 transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-mono text-sm font-bold text-slate-500">{inspection.id}</span>
            <StatusBadge status={inspection.status} size="sm" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            {inspection.productName}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manufacturer: {inspection.manufacturer} | Submitted: {inspection.submittedAt}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/reports?id=${inspection.id}`}
            className="px-5 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-md flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download Official PDF Report</span>
          </Link>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 ${
            activeTab === 'audit' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Legal Metrology Audit Report</span>
        </button>

        <button
          onClick={() => setActiveTab('online_comparison')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 ${
            activeTab === 'online_comparison' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Package vs. Online Listing Comparison</span>
        </button>

        <button
          onClick={() => setActiveTab('web_verification')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition flex items-center gap-2 ${
            activeTab === 'web_verification' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Web Verification & Rule Engine</span>
        </button>
      </div>

      {activeTab === 'audit' ? (
        <>
          {/* Main Score & Remarks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Left: Compliance Score */}
            <div className="md:col-span-4">
              <ComplianceScore score={inspection.score} />
            </div>

            {/* Right: Officer Remarks & Status Overview */}
            <div className="md:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Verification Officer Assessment</span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    Verified By: {inspection.verifiedBy || 'Pending Review Officer'}
                  </span>
                </div>

                <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-slate-700">Official Officer Remarks:</div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {inspection.adminRemarks || "Your inspection is currently queued for administrative verification by the Legal Metrology officer."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Priority</div>
                  <div className="font-bold text-slate-800 mt-0.5">{inspection.priority || 'Normal'}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Category</div>
                  <div className="font-bold text-slate-800 mt-0.5">{inspection.category}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Violations Flagged</div>
                  <div className="font-bold text-rose-600 mt-0.5">{inspection.violations?.length || 0}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Packaging Bounding Box Analysis */}
          {inspection.images && inspection.images.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-600" />
                <span>Packaging Label AI Region Analysis</span>
              </h3>
              <BoundingBoxOverlay image={inspection.images[0]} />
            </div>
          )}

          {/* Legal Metrology Rule Checklist breakdown */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              Rule 6 Mandatory Declarations Breakdown
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {inspection.declarations?.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 font-bold">{item.rule}</span>
                    <div className="font-bold text-slate-900">{item.label}</div>
                    <div className="text-slate-600 mt-0.5 font-mono">{item.value}</div>
                  </div>
                  <StatusBadge status={item.status} size="sm" showIcon={false} />
                </div>
              ))}
            </div>
          </div>

          {/* Identified Violations Section */}
          {inspection.violations && inspection.violations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-900 text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
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
          <Timeline events={inspection.auditTimeline} />
        </>
      ) : activeTab === 'online_comparison' ? (
        <PackageOnlineComparison
          scannedPackageData={{
            productName: inspection.productName,
            brand: inspection.brand,
            mrp: inspection.mrp,
            netQuantity: inspection.netQuantity,
            manufacturer: inspection.manufacturer,
            countryOfOrigin: inspection.countryOfOrigin
          }}
          webVerificationResult={inspection.webVerificationResult}
        />
      ) : (
        <WebVerificationPanel
          webVerificationResult={inspection.webVerificationResult}
          ruleEngineResult={inspection.ruleEngineResult}
        />
      )}
    </div>
  );
}
