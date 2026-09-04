import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import InspectionTable from '../components/InspectionTable';
import LoadingState from '../components/LoadingState';
import { inspectionService } from '../services/inspectionService';
import { ClipboardList, Filter } from 'lucide-react';

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

  if (loading) return <LoadingState message="Loading Legal Metrology Queue..." />;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-extrabold text-slate-900">
              Admin Inspection Verification Queue
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Legal Metrology Officer workflow for evaluating mandatory declarations, confirming violations, and issuing decisions.
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
