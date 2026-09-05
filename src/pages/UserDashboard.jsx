import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import InspectionTable from '../components/InspectionTable';
import LoadingState from '../components/LoadingState';
import { inspectionService } from '../services/inspectionService';
import { dashboardService } from '../services/dashboardService';
import { PlusCircle, ClipboardList, CheckCircle2, Clock, XCircle, Building2 } from 'lucide-react';

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
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-200">
            <Building2 className="w-3.5 h-3.5" />
            <span>Enforcement Zone 4 — Delhi Directorate</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Inspection Officer Desk — Rahul Mehta
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Enforce Legal Metrology (Packaged Commodities) Rules, 2011. Upload product packaging labels for statutory compliance verification.
          </p>
        </div>

        <Link
          to="/user/new-inspection"
          className="px-5 py-3 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-md flex items-center justify-center gap-2 transition shrink-0"
        >
          <PlusCircle className="w-4.5 h-4.5" />
          <span>New Product Inspection</span>
        </Link>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Inspections"
          value={stats.total}
          icon={ClipboardList}
          color="blue"
          subtitle="Submitted for verification"
        />
        <StatCard
          title="Verified Compliant"
          value={stats.approved}
          icon={CheckCircle2}
          color="emerald"
          subtitle="Passed Rule 6 requirements"
        />
        <StatCard
          title="Under Officer Review"
          value={stats.underReview}
          icon={Clock}
          color="amber"
          subtitle="Queued for officer evaluation"
        />
        <StatCard
          title="Rejected / Non-Compliant"
          value={stats.rejected}
          icon={XCircle}
          color="rose"
          subtitle="Flagged for Rule 6 violations"
        />
      </div>

      {/* Recent Inspections Data Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">
            Recent Inspection Submissions
          </h2>
          <Link
            to="/user/inspection-history"
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
          >
            <span>View Complete Log</span>
            <span>→</span>
          </Link>
        </div>

        <InspectionTable
          inspections={inspections}
          role="user"
          title="Field Submissions Ledger"
          showFilters={true}
        />
      </div>
    </div>
  );
}
