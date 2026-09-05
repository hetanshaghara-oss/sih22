import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import InspectionTable from '../components/InspectionTable';
import LoadingState from '../components/LoadingState';
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
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-200">
            <Building2 className="w-3.5 h-3.5" />
            <span>Central Verification Directorate — Head Office</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Verification Officer Portal — Officer Priya Sharma
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Evaluate mandatory packaging declarations, confirm legal violations under Legal Metrology Rules 2011, and issue statutory decisions.
          </p>
        </div>

        <Link
          to="/admin/queue"
          className="px-5 py-3 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-md flex items-center justify-center gap-2 transition shrink-0"
        >
          <span>Open Verification Queue</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Admin Stat Cards (5 Required Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Inspections"
          value={stats.total.toLocaleString()}
          icon={BarChart3}
          color="blue"
        />
        <StatCard
          title="Pending Review"
          value={stats.pendingReview}
          icon={Clock}
          color="amber"
          subtitle="Awaiting officer evaluation"
        />
        <StatCard
          title="Verified Compliant"
          value={stats.verified.toLocaleString()}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Rejected / Non-Compliant"
          value={stats.rejected}
          icon={XCircle}
          color="rose"
        />
        <StatCard
          title="Needs Correction"
          value={stats.needsCorrection}
          icon={AlertTriangle}
          color="purple"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Distribution Donut */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Compliance Status Distribution</h3>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">Rule 6 Evaluation</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.complianceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {charts.complianceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inspections Over Time Area Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Inspection Volume & Enforcement Trends</h3>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">2026 Directives</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.monthlyTrends}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="Total" stroke="#1e3a8a" fill="#3b82f6" fillOpacity={0.12} />
                <Area type="monotone" dataKey="Verified" stroke="#059669" fill="#10b981" fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Violations by Legal Metrology Rule Category */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Rule Violation Breakdown</h3>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">Section 6 Infractions</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.violationsByCategory} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="category" type="category" width={160} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#e11d48" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Category Distribution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Commodity Category Breakdown</h3>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">Packaged Commodities</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.categoryBreakdown}>
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* High-Priority Queue Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">
            Pending Officer Verification Ledger
          </h2>
          <Link
            to="/admin/queue"
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            <span>Open Verification Desk</span>
            <span>→</span>
          </Link>
        </div>

        <InspectionTable
          inspections={inspections}
          role="admin"
          title="Active Submissions Queue"
          showFilters={true}
        />
      </div>
    </div>
  );
}
