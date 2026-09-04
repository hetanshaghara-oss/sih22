import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StatCard from '../components/StatCard';
import InspectionTable from '../components/InspectionTable';
import LoadingState from '../components/LoadingState';
import PremiumCard from '../components/PremiumCard';
import { inspectionService } from '../services/inspectionService';
import { dashboardService } from '../services/dashboardService';
import { PlusCircle, ClipboardList, CheckCircle2, Clock, XCircle, Building2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function UserDashboard() {
  const [inspections, setInspections] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await inspectionService.getInspections();
    const dashStats = await dashboardService.getDashboardStats();
    setInspections(data);
    setStats(dashStats.userStats);
    setLoading(false);
  };

  if (loading || !stats) {
    return <LoadingState message="Loading Inspection Officer Dashboard..." />;
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 font-sans"
    >
      {/* Top Banner */}
      <motion.div variants={itemVariants}>
        <PremiumCard className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden" tiltIntensity={5}>
          {/* Decorative mesh */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2" />
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[11px] font-bold mb-3 shadow-inner">
              <Building2 className="w-3.5 h-3.5" />
              <span>Enforcement Zone 4 — Delhi Directorate</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight text-glow">
              Inspection Officer Desk
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-xl font-medium leading-relaxed">
              Enforce Legal Metrology Rules, 2011. Upload product packaging labels for automated AI statutory compliance verification.
            </p>
          </div>

          <Link
            to="/user/new-inspection"
            className="px-6 py-4 text-sm font-bold text-white bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 rounded-2xl shadow-xl shadow-blue-900/50 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <PlusCircle className="w-5 h-5" />
            <span>New Product Inspection</span>
          </Link>
        </PremiumCard>
      </motion.div>

      {/* Metric Cards Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Inspections", value: stats.total, icon: ClipboardList, color: "blue", sub: "Submitted" },
          { title: "Verified Compliant", value: stats.approved, icon: CheckCircle2, color: "emerald", sub: "Passed Rule 6" },
          { title: "Under Review", value: stats.underReview, icon: Clock, color: "amber", sub: "Queued" },
          { title: "Non-Compliant", value: stats.rejected, icon: XCircle, color: "rose", sub: "Flagged violations" }
        ].map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants}>
             <PremiumCard tiltIntensity={20} className="h-full group">
               <div className="flex items-center justify-between mb-4">
                 <div className={`p-3 rounded-xl bg-${stat.color}-500/10 border border-${stat.color}-500/30 text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                   <stat.icon className="w-5 h-5" />
                 </div>
               </div>
               <div className="space-y-1">
                 <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{stat.title}</div>
                 <div className="text-3xl font-black text-white text-glow">{stat.value}</div>
                 <div className="text-[10px] font-medium text-slate-500">{stat.sub}</div>
               </div>
             </PremiumCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Inspections Data Table */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-extrabold text-white text-glow">
            Recent Inspection Submissions
          </h2>
          <Link
            to="/user/inspection-history"
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <span>View Complete Log</span>
            <span>→</span>
          </Link>
        </div>

        <div className="glass-panel rounded-2xl p-1 overflow-hidden">
          <InspectionTable
            inspections={inspections}
            role="user"
            title="Field Submissions Ledger"
            showFilters={true}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
