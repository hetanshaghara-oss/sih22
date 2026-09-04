import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import InspectionTable from '../components/InspectionTable';
import LoadingState from '../components/LoadingState';
import { inspectionService } from '../services/inspectionService';
import { ClipboardList } from 'lucide-react';

export default function AdminQueue() {
  const [searchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQueue();
  }, []);

  const loadQueue = async () => {
    setLoading(true);
    const data = await inspectionService.getInspections();
    setInspections(data);
    setLoading(false);
  };

  if (loading) return <LoadingState message="Loading Legal Metrology Queue from SQLite Database..." />;

  return (
    <div className="space-y-6 font-sans">
      <div className="glass-panel p-6 rounded-2xl border border-slate-700/50 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-extrabold text-white text-glow">
              Admin Inspection Verification Queue
            </h1>
          </div>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Legal Metrology Officer workflow for evaluating mandatory declarations, confirming violations, and issuing decisions. Loaded from SQLite database.
          </p>
        </div>
      </div>

      <InspectionTable
        inspections={inspections}
        role="admin"
        title="Active Review Ledger"
        showFilters={true}
      />
    </div>
  );
}
