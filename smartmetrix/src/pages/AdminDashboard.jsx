import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StatCard from '../components/StatCard';
import InspectionTable from '../components/InspectionTable';
import LoadingState from '../components/LoadingState';
import PremiumCard from '../components/PremiumCard';
import { dashboardService } from '../services/dashboardService';
import { inspectionService } from '../services/inspectionService';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { ShieldCheck, Clock, CheckCircle2, XCircle, AlertTriangle, BarChart3, ArrowRight, Building2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// Static color map to prevent Tailwind from purging dynamic class strings in production
const colorMap = {
  blue:    'bg-blue-500/10 border-blue-500/30 text-blue-400',
  amber:   'bg-amber-500/10 border-amber-500/30 text-amber-400',
  emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  rose:    'bg-rose-500/10 border-rose-500/30 text-rose-400',
  purple:  'bg-purple-500/10 border-purple-500/30 text-purple-400',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    const data = await dashboardService.getDashboardStats();
    const allInspections = await inspectionService.getInspections();

    setStats(data.adminStats);
    setCharts(data.charts);
    setInspections(allInspections);
    setLoading(false);
  };

  if (loading || !stats) return <LoadingState message="Loading Legal Metrology Analytics..." />;

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
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2" />
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>Central Verification Directorate — Head Office</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight text-glow">
              Verification Officer Portal
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-xl font-medium">
              Evaluate mandatory packaging declarations, confirm legal violations under Legal Metrology Rules 2011.
            </p>
          </div>

          <Link
            to="/admin/queue"
            className="px-6 py-4 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 rounded-2xl shadow-xl shadow-indigo-900/50 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <span>Open Verification Queue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </PremiumCard>
      </motion.div>

      {/* Admin Stat Cards */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { title: "Total", value: stats.total.toLocaleString(), icon: BarChart3, color: "blue" },
          { title: "Pending", value: stats.pendingReview, icon: Clock, color: "amber" },
          { title: "Verified", value: stats.verified.toLocaleString(), icon: CheckCircle2, color: "emerald" },
          { title: "Rejected", value: stats.rejected, icon: XCircle, color: "rose" },
          { title: "Correction", value: stats.needsCorrection, icon: AlertTriangle, color: "purple" }
        ].map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <PremiumCard tiltIntensity={20} className="h-full group">
              <div className={`p-2.5 rounded-xl border ${colorMap[stat.color]} w-fit mb-3 group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.title}</div>
              <div className="text-2xl font-black text-white text-glow mt-1">{stat.value}</div>
            </PremiumCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Distribution Donut */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-5 space-y-4 min-w-0">
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
            <h3 className="text-sm font-bold text-white">Compliance Status Distribution</h3>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">Rule 6</span>
          </div>
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={charts.complianceDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  {charts.complianceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#262b2a', border: '1px solid #39413f', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: '#adb8b6' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Inspections Over Time */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-5 space-y-4 min-w-0">
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
            <h3 className="text-sm font-bold text-white">Inspection Volume & Trends</h3>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">2026</span>
          </div>
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthlyTrends}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#838f8d' }} />
                <YAxis tick={{ fontSize: 11, fill: '#838f8d' }} />
                <Tooltip contentStyle={{ backgroundColor: '#262b2a', border: '1px solid #39413f', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#adb8b6' }} />
                <Area type="monotone" dataKey="Total" stroke="#38ab8c" fill="#38ab8c" fillOpacity={0.15} />
                <Area type="monotone" dataKey="Verified" stroke="#559f5f" fill="#559f5f" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Violations by Category */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-5 space-y-4 min-w-0">
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
            <h3 className="text-sm font-bold text-white">Rule Violation Breakdown</h3>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">Section 6</span>
          </div>
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.violationsByCategory} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11, fill: '#838f8d' }} />
                <YAxis dataKey="category" type="category" width={115} tick={{ fontSize: 10, fill: '#838f8d' }} />
                <Tooltip contentStyle={{ backgroundColor: '#262b2a', border: '1px solid #39413f', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#bd5344" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Product Category Distribution */}
        <motion.div variants={itemVariants} className="glass-panel rounded-2xl p-5 space-y-4 min-w-0">
          <div className="flex items-center justify-between border-b border-slate-700/50 pb-3">
            <h3 className="text-sm font-bold text-white">Commodity Category Breakdown</h3>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">Packaged Commodities</span>
          </div>
          <div className="h-64 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.categoryBreakdown}>
                <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#838f8d' }} />
                <YAxis tick={{ fontSize: 11, fill: '#838f8d' }} />
                <Tooltip contentStyle={{ backgroundColor: '#262b2a', border: '1px solid #39413f', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#38ab8c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>

      {/* Verification Ledger */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-extrabold text-white text-glow">
            Pending Officer Verification Ledger
          </h2>
          <Link
            to="/admin/queue"
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <span>Open Verification Desk</span>
            <span>→</span>
          </Link>
        </div>

        <div className="glass-panel rounded-2xl p-1 overflow-hidden">
          <InspectionTable
            inspections={inspections}
            role="admin"
            title="Active Submissions Queue"
            showFilters={true}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
