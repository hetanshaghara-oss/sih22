import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import InspectionTable from '../components/InspectionTable';
import LoadingState from '../components/LoadingState';
import PremiumCard from '../components/PremiumCard';
import { inspectionService } from '../services/inspectionService';
import { History } from 'lucide-react';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PremiumCard tiltIntensity={5} className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/15 rounded-full blur-[60px] -z-10 translate-x-1/3 -translate-y-1/3" />
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white text-glow">
              Inspection History & Audit Archive
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Searchable, filterable ledger of all product compliance inspections.
            </p>
          </div>
        </div>
      </PremiumCard>

      <div className="glass-panel rounded-2xl p-1 overflow-hidden">
        <InspectionTable
          inspections={inspections}
          role="user"
          title="Complete Enforcement Audit Records"
          showFilters={true}
        />
      </div>
    </motion.div>
  );
}
