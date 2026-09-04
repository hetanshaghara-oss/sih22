import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { inspectionService } from '../services/inspectionService';
import StatusBadge from '../components/StatusBadge';
import PremiumCard from '../components/PremiumCard';
import { CheckCircle2, Clock, Loader2, ArrowRight, ShieldCheck, FileText, LayoutDashboard } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function InspectionProcessing() {
  const { id } = useParams();
  const [inspection, setInspection] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    loadInspection();

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
  }, [id]);

  const loadInspection = async () => {
    const data = await inspectionService.getInspectionById(id);
    setInspection(data);
  };

  const steps = [
    { title: "Image received & logged into registry", desc: "Packaging photos secured with SHA-256 checksum." },
    { title: "Image quality & resolution checked", desc: "DPI, blur coefficient, and lighting contrast verified." },
    { title: "Label bounding regions detected", desc: "AI model identified front panel, rear text, and MRP stamp." },
    { title: "OCR information extraction completed", desc: "Extracted Net Quantity, MRP, Date, and Consumer Helpline." },
    { title: "Legal Metrology 2011 compliance check", desc: "Rule 6 mandatory declaration matrix verified." }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-3xl mx-auto space-y-8 py-4"
    >
      {/* Success Hero Card */}
      <motion.div variants={itemVariants}>
        <PremiumCard tiltIntensity={5} className="text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -z-10 -translate-y-1/2" />
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
            className="w-16 h-16 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20"
          >
            <CheckCircle2 className="w-9 h-9" />
          </motion.div>

          <div className="mt-4">
            <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest">
              Submission Received
            </span>
            <h1 className="text-2xl font-black text-white mt-1 text-glow">
              Inspection Submitted Successfully
            </h1>
            <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
              Your product packaging inspection has been logged and assigned to the Legal Metrology Verification Officer.
            </p>
          </div>

          {/* Metadata Badge Pill */}
          <div className="inline-flex items-center gap-4 px-5 py-3 mt-4 bg-slate-800/60 border border-slate-700/50 rounded-xl text-xs backdrop-blur-sm">
            <div>
              <span className="text-slate-500 font-mono text-[10px] block">INSPECTION ID</span>
              <span className="font-mono font-extrabold text-white text-sm">{id}</span>
            </div>
            <div className="w-px h-6 bg-slate-700" />
            <div>
              <span className="text-slate-500 font-mono text-[10px] block">CURRENT STATUS</span>
              <StatusBadge status="under_review" size="sm" />
            </div>
          </div>
        </PremiumCard>
      </motion.div>

      {/* Visual Step Processing Timeline */}
      <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">
              Automated Processing & Verification Pipeline
            </h3>
          </div>
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
            Processing
          </span>
        </div>

        <div className="space-y-3">
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isDone = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                className={`p-4 rounded-xl border transition-all flex items-start gap-4 ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : isCurrent
                    ? 'bg-blue-500/10 border-blue-500/30 ring-2 ring-blue-500/20'
                    : 'bg-slate-800/30 border-slate-700/50'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isDone ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center animate-spin shadow-lg shadow-blue-500/30">
                      <Loader2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-400 font-mono text-xs flex items-center justify-center font-bold">
                      {stepNum}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className={isDone ? 'text-emerald-400' : isCurrent ? 'text-blue-400' : 'text-slate-500'}>
                      {step.title}
                    </span>
                    <span className={`text-[10px] font-mono ${isDone ? 'text-emerald-500' : isCurrent ? 'text-blue-400' : 'text-slate-600'}`}>
                      {isDone ? 'COMPLETED' : isCurrent ? 'IN PROGRESS...' : 'PENDING'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="p-4 glass-card rounded-xl text-xs flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white">Estimated Status:</span>
            <p className="text-slate-400 mt-0.5">
              Your inspection is currently under administrative review by Officer Priya Sharma (Legal Metrology Verification Cell). Results will update automatically.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <Link
          to={`/user/inspection-result/${id}`}
          className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 rounded-xl shadow-xl shadow-blue-900/50 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <FileText className="w-4 h-4" />
          <span>Track Inspection Result</span>
        </Link>
        <Link
          to="/user/dashboard"
          className="w-full sm:w-auto px-6 py-3 text-sm font-bold text-slate-300 glass-card rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <LayoutDashboard className="w-4 h-4 text-slate-400" />
          <span>Return to Dashboard</span>
        </Link>
      </motion.div>
    </motion.div>
  );
}
