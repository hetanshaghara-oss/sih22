import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { inspectionService } from '../services/inspectionService';
import StatusBadge from '../components/StatusBadge';
import Timeline from '../components/Timeline';
import LoadingState from '../components/LoadingState';
import BoundingBoxOverlay from '../components/BoundingBoxOverlay';
import { ArrowLeft, Download } from 'lucide-react';

export default function InspectionDetails() {
  const { id } = useParams();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInspection();
  }, [id]);

  const loadInspection = async () => {
    setLoading(true);
    const data = await inspectionService.getInspectionById(id);
    setInspection(data);
    setLoading(false);
  };

  if (loading || !inspection) return <LoadingState message="Loading inspection record..." />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      <div className="flex items-center justify-between glass-panel p-6 rounded-2xl border border-slate-700/50">
        <div className="flex items-center gap-3">
          <Link to="/user/inspection-history" className="text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-400">{inspection.id}</span>
              <StatusBadge status={inspection.status} size="sm" />
            </div>
            <h1 className="text-xl font-bold text-white mt-0.5 text-glow">{inspection.productName}</h1>
          </div>
        </div>

        <Link
          to={`/reports?id=${inspection.id}`}
          className="px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 rounded-xl shadow-md flex items-center gap-1.5 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Report PDF</span>
        </Link>
      </div>

      {inspection.images && inspection.images.length > 0 && (
        <BoundingBoxOverlay image={inspection.images[0]} />
      )}

      <div className="glass-panel p-6 rounded-2xl border border-slate-700/50">
        <Timeline events={inspection.auditTimeline} />
      </div>
    </div>
  );
}
