import React, { useState, useEffect } from 'react';
import InspectionTable from '../components/InspectionTable';
import LoadingState from '../components/LoadingState';
import { inspectionService } from '../services/inspectionService';
import { History, Shield } from 'lucide-react';

export default function InspectionHistory() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInspections();
  }, []);

  const loadInspections = async () => {
    setLoading(true);
    const data = await inspectionService.getInspections();
    setInspections(data);
    setLoading(false);
  };

  if (loading) return <LoadingState message="Loading inspection log archive..." />;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-600" />
          <h1 className="text-xl font-extrabold text-slate-900">
            Inspection History & Audit Archive
          </h1>
        </div>
        <p className="text-xs text-slate-500">
          Searchable, filterable ledger of all product compliance inspections performed by your enforcement unit.
        </p>
      </div>

      <InspectionTable
        inspections={inspections}
        role="user"
        title="Complete Enforcement Audit Records"
        showFilters={true}
      />
    </div>
  );
}
