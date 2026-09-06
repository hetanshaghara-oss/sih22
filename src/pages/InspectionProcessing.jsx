import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { inspectionService } from '../services/inspectionService';
import StatusBadge from '../components/StatusBadge';
import { CheckCircle2, Clock, Loader2, ShieldCheck, FileText, LayoutDashboard } from 'lucide-react';

export default function InspectionProcessing() {
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(1);

  const loadInspection = useCallback(async () => {
    await inspectionService.getInspectionById(id);
  }, [id]);

  useEffect(() => {
    loadInspection();

    // Step animation loop
    const t1 = setTimeout(() => setCurrentStep(2), 600);
    const t2 = setTimeout(() => setCurrentStep(3), 1200);
    const t3 = setTimeout(() => setCurrentStep(4), 1800);
    const t4 = setTimeout(() => setCurrentStep(5), 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [loadInspection]);

  const steps = [
    { title: "Image received & logged into registry", desc: "Packaging photos secured with SHA-256 checksum." },
    { title: "Image quality & resolution checked", desc: "DPI, blur coefficient, and lighting contrast verified." },
    { title: "Label bounding regions detected", desc: "AI model identified front panel, rear text, and MRP stamp." },
    { title: "OCR information extraction completed", desc: "Extracted Net Quantity, MRP, Date, and Consumer Helpline." },
    { title: "Legal Metrology 2011 compliance check", desc: "Rule 6 mandatory declaration matrix verified." }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Success Hero Card */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md text-center space-y-4 relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div>
          <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-widest">
            Submission Received
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Inspection Submitted Successfully
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
            Your product packaging inspection has been logged and assigned to the Legal Metrology Verification Officer.
          </p>
        </div>

        {/* Metadata Badge Pill */}
        <div className="inline-flex items-center gap-4 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <div>
            <span className="text-slate-400 font-mono text-[10px] block">INSPECTION ID</span>
            <span className="font-mono font-extrabold text-slate-900 text-sm">{id}</span>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <div>
            <span className="text-slate-400 font-mono text-[10px] block">CURRENT STATUS</span>
            <StatusBadge status="under_review" size="sm" />
          </div>
        </div>
      </div>

      {/* Visual Step Processing Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Automated Processing & Verification Pipeline
            </h3>
          </div>
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200 rounded">
            Demo Processing Mode
          </span>
        </div>

        <div className="space-y-4">
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isDone = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${
                  isDone
                    ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                    : isCurrent
                    ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-500/20'
                    : 'bg-slate-50/50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center animate-spin">
                      <Loader2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 font-mono text-xs flex items-center justify-center font-bold">
                      {stepNum}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className={isDone ? 'text-emerald-900' : isCurrent ? 'text-blue-900' : 'text-slate-500'}>
                      {step.title}
                    </span>
                    <span className="text-[10px] font-mono">
                      {isDone ? 'COMPLETED' : isCurrent ? 'IN PROGRESS...' : 'PENDING'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-slate-900 text-slate-300 rounded-xl text-xs flex items-start gap-3 border border-slate-800">
          <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white">Estimated Status:</span>
            <p className="text-slate-300 mt-0.5">
              Your inspection is currently under administrative review by Officer Priya Sharma (Legal Metrology Verification Cell). Results will update automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Link
          to={`/user/inspection-result/${id}`}
          className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-md flex items-center justify-center gap-2 transition"
        >
          <FileText className="w-4 h-4" />
          <span>Track Inspection Result</span>
        </Link>
        <Link
          to="/user/dashboard"
          className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs flex items-center justify-center gap-2 transition"
        >
          <LayoutDashboard className="w-4 h-4 text-slate-500" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
