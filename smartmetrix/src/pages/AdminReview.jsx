import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { inspectionService } from '../services/inspectionService';
import { authService } from '../services/authService';
import BoundingBoxOverlay from '../components/BoundingBoxOverlay';
import ReviewChecklist from '../components/ReviewChecklist';
import ViolationCard from '../components/ViolationCard';
import LoadingState from '../components/LoadingState';
import { ArrowLeft, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Send } from 'lucide-react';

export default function AdminReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [inspection, setInspection] = useState(null);
  const [declarations, setDeclarations] = useState([]);
  const [violations, setViolations] = useState([]);
  const [decision, setDecision] = useState('partially_compliant');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    loadInspection();
  }, [id]);

  const loadInspection = async () => {
    setLoading(true);
    const data = await inspectionService.getInspectionById(id);
    if (data) {
      setInspection(data);
      setDeclarations(data.declarations || []);
      setViolations(data.violations || []);
      setDecision(data.status === 'under_review' ? 'partially_compliant' : data.status);
      setAdminRemarks(data.adminRemarks || 'Manufacturing date declaration could not be verified from the submitted images. Please provide a clearer image of the rear label.');
    }
    setLoading(false);
  };

  const handleConfirmViolation = (vioId) => {
    setViolations((prev) =>
      prev.map((v) => (v.id === vioId ? { ...v, status: 'Confirmed' } : v))
    );
  };

  const handleDismissViolation = (vioId) => {
    setViolations((prev) =>
      prev.map((v) => (v.id === vioId ? { ...v, status: 'Dismissed' } : v))
    );
  };

  const handleFinalSubmission = async () => {
    setSaving(true);
    const officerAttribution = currentUser
      ? `${currentUser.name} (${currentUser.role})`
      : 'Priya Sharma (Verification Officer)';

    const reviewPayload = {
      status: decision,
      declarations,
      violations,
      adminRemarks,
      verifiedBy: officerAttribution
    };

    await inspectionService.reviewInspection(id, reviewPayload);

    setTimeout(() => {
      setSaving(false);
      setShowConfirmModal(false);
      navigate(`/admin/result/${id}`);
    }, 400);
  };

  if (loading || !inspection) return <LoadingState message="Opening Legal Metrology Inspection Review Studio..." />;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-700/50">
        <div className="flex items-center gap-3">
          <Link to="/admin/queue" className="text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-400">{inspection.id}</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded uppercase">
                Under Officer Review
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-0.5 text-glow">
              Review: {inspection.productName}
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Manufacturer: {inspection.manufacturer} | Submitter: {inspection.submittedBy} ({inspection.submittedByBadge})
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowConfirmModal(true)}
          className="px-6 py-3 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 rounded-xl shadow-lg shadow-indigo-900/50 flex items-center gap-2 transition"
        >
          <Send className="w-4 h-4" />
          <span>Finalize Officer Review</span>
        </button>
      </div>

      {/* Main Review Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Image Viewer with Bounding Box Overlays */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-2xl border border-slate-700/50 p-4 text-white space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold">Uploaded Evidence Packaging</span>
              <span className="text-[11px] font-mono text-slate-400">{inspection.images?.length || 1} image(s)</span>
            </div>

            {inspection.images && inspection.images.length > 0 ? (
              <BoundingBoxOverlay image={inspection.images[0]} />
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">No label image provided</div>
            )}
          </div>
        </div>

        {/* Right Column: Mandatory Declaration Checklist & Violations */}
        <div className="lg:col-span-7 space-y-6">
          {/* Declaration Checklist */}
          <ReviewChecklist
            declarations={declarations}
            onChange={(updated) => setDeclarations(updated)}
          />

          {/* Violations Management */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Flagged Legal Metrology Violations ({violations.length})</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">Click to confirm or dismiss</span>
            </div>

            <div className="space-y-3">
              {violations.map((vio) => (
                <ViolationCard
                  key={vio.id}
                  violation={vio}
                  isAdmin={true}
                  onConfirm={handleConfirmViolation}
                  onDismiss={handleDismissViolation}
                />
              ))}
            </div>
          </div>

          {/* Officer Decision Form Section */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 space-y-5">
            <div className="border-b border-slate-700/50 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <span>Official Officer Enforcement Decision</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Select final compliance classification under Legal Metrology Rules, 2011.
              </p>
            </div>

            {/* Decision Radio Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${decision === 'compliant'
                    ? 'border-emerald-500 bg-emerald-500/15 ring-1 ring-emerald-500 shadow-md'
                    : 'border-slate-700/50 bg-slate-900/60 hover:bg-slate-800/60'
                  }`}
              >
                <input
                  type="radio"
                  name="decision"
                  value="compliant"
                  checked={decision === 'compliant'}
                  onChange={(e) => setDecision(e.target.value)}
                  className="text-emerald-500 focus:ring-emerald-500"
                />
                <div>
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Compliant
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Passes all Rule 6 provisions.</div>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${decision === 'partially_compliant'
                    ? 'border-amber-500 bg-amber-500/15 ring-1 ring-amber-500 shadow-md'
                    : 'border-slate-700/50 bg-slate-900/60 hover:bg-slate-800/60'
                  }`}
              >
                <input
                  type="radio"
                  name="decision"
                  value="partially_compliant"
                  checked={decision === 'partially_compliant'}
                  onChange={(e) => setDecision(e.target.value)}
                  className="text-amber-500 focus:ring-amber-500"
                />
                <div>
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Partially Compliant
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Minor defects or unreadable stamp.</div>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${decision === 'non_compliant'
                    ? 'border-rose-500 bg-rose-500/15 ring-1 ring-rose-500 shadow-md'
                    : 'border-slate-700/50 bg-slate-900/60 hover:bg-slate-800/60'
                  }`}
              >
                <input
                  type="radio"
                  name="decision"
                  value="non_compliant"
                  checked={decision === 'non_compliant'}
                  onChange={(e) => setDecision(e.target.value)}
                  className="text-rose-500 focus:ring-rose-500"
                />
                <div>
                  <div className="text-xs font-bold text-rose-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Non-Compliant / Rejected
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Mandatory omissions or violations.</div>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${decision === 'needs_correction'
                    ? 'border-purple-500 bg-purple-500/15 ring-1 ring-purple-500 shadow-md'
                    : 'border-slate-700/50 bg-slate-900/60 hover:bg-slate-800/60'
                  }`}
              >
                <input
                  type="radio"
                  name="decision"
                  value="needs_correction"
                  checked={decision === 'needs_correction'}
                  onChange={(e) => setDecision(e.target.value)}
                  className="text-purple-500 focus:ring-purple-500"
                />
                <div>
                  <div className="text-xs font-bold text-purple-400 flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5" /> Request Correction
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Return to submitter for clearer image.</div>
                </div>
              </label>
            </div>

            {/* Remarks TextArea */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Official Verification Remarks & Directive
              </label>
              <textarea
                rows="3"
                value={adminRemarks}
                onChange={(e) => setAdminRemarks(e.target.value)}
                placeholder="Enter officer notes or corrective instructions for submitter..."
                className="w-full p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-xs font-medium text-white focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>

            <button
              onClick={() => setShowConfirmModal(true)}
              className="w-full py-3.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 rounded-xl shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Save Review & Return Result to Submitter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-panel rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-700/60 bg-slate-900/95">
            <div className="flex items-center gap-3 text-indigo-400">
              <ShieldCheck className="w-8 h-8" />
              <div>
                <h3 className="text-base font-extrabold text-white">Confirm Legal Decision</h3>
                <p className="text-xs text-slate-400">Legal Metrology Officer Directives</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to mark inspection <strong className="font-mono text-blue-400">{id}</strong> as{' '}
              <span className="font-bold text-indigo-400 uppercase">{decision.replace('_', ' ')}</span>? The result and updated score will be returned to officer {inspection.submittedBy}.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleFinalSubmission}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 rounded-lg shadow-md transition disabled:opacity-50"
              >
                {saving ? 'Submitting Result...' : 'Confirm & Send Result'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
