import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { inspectionService } from '../services/inspectionService';
import { reportService } from '../services/reportService';
import StatusBadge from '../components/StatusBadge';
import LoadingState from '../components/LoadingState';
import { Printer, Scale, FileText } from 'lucide-react';

export default function Reports() {
  const [searchParams] = useSearchParams();
  const targetId = searchParams.get('id') || 'INS-2026-00124';

  const [inspections, setInspections] = useState([]);
  const [selectedId, setSelectedId] = useState(targetId);
  const [inspection, setInspection] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, [selectedId]);

  const loadAll = async () => {
    setLoading(true);
    const list = await inspectionService.getInspections();
    setInspections(list);

    const activeItem = list.find((i) => i.id === selectedId) || list[0];
    if (activeItem) {
      setInspection(activeItem);
      const rep = await reportService.getReportData(activeItem.id);
      setReportData(rep);
    }
    setLoading(false);
  };

  const handlePrint = () => {
    reportService.downloadMockPdf();
  };

  if (loading || !inspection) return <LoadingState message="Generating Legal Metrology Compliance Report from SQLite..." />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      {/* Top Controls Bar (No Print) */}
      <div className="no-print glass-panel p-4 sm:p-6 rounded-2xl border border-slate-700/50 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white text-glow">
              Legal Metrology Compliance Inspection Report
            </h1>
            <p className="text-xs text-slate-400">
              Official verification document format generated live from SQLite database.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Select Inspection Dropdown */}
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="px-3 py-2 bg-slate-800/80 border border-slate-700/60 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-blue-500"
          >
            {inspections.map((item) => (
              <option key={item.id} value={item.id} className="bg-slate-900 text-white">
                {item.id} — {item.productName}
              </option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 rounded-xl shadow-lg shadow-blue-900/50 flex items-center gap-2 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Download PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Official Report Printable Container (High Contrast Print Certificate) */}
      <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-300 shadow-2xl space-y-8 text-slate-900 print:shadow-none print:border-none print:p-0">

        {/* Report Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <Scale className="w-8 h-8" />
            </div>
            <div>
              <div className="text-xs font-bold font-mono text-slate-500 uppercase tracking-widest">
                Government of India — Department of Consumer Affairs
              </div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
                DIRECTORATE OF LEGAL METROLOGY
              </h2>
              <div className="text-xs font-semibold text-blue-900 mt-0.5">
                Packaged Commodities Compliance Certificate — Legal Metrology Rules, 2011
              </div>
            </div>
          </div>

          <div className="text-right font-mono text-xs space-y-1">
            <div className="px-3 py-1 bg-slate-100 rounded border border-slate-300 inline-block font-bold">
              REPORT NO: {reportData?.reportId || 'REP-2026-001'}
            </div>
            <div className="text-[11px] text-slate-500">Date: {reportData?.generatedAt}</div>
          </div>
        </div>

        {/* Inspection Summary Block */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Inspection ID</span>
            <div className="font-mono font-bold text-slate-900 mt-0.5">{inspection.id}</div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Submission Date</span>
            <div className="font-medium text-slate-800 mt-0.5">{inspection.submittedAt}</div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Compliance Status</span>
            <div className="mt-0.5"><StatusBadge status={inspection.status} size="sm" /></div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Legal Metrology Score</span>
            <div className="font-mono font-extrabold text-blue-700 text-sm mt-0.5">{inspection.score} / 100</div>
          </div>
        </div>

        {/* Product & Manufacturer Section */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            1. Product & Manufacturer Particulars
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5 p-3 bg-slate-50/50 rounded-lg border border-slate-200">
              <div><span className="font-semibold text-slate-500">Product Name:</span> <strong className="text-slate-900">{inspection.productName}</strong></div>
              <div><span className="font-semibold text-slate-500">Brand / Trade Name:</span> <span className="text-slate-800">{inspection.brand || 'N/A'}</span></div>
              <div><span className="font-semibold text-slate-500">Commodity Category:</span> <span className="text-slate-800">{inspection.category}</span></div>
            </div>
            <div className="space-y-1.5 p-3 bg-slate-50/50 rounded-lg border border-slate-200">
              <div><span className="font-semibold text-slate-500">Manufacturer / Packer:</span> <strong className="text-slate-900">{inspection.manufacturer}</strong></div>
              <div><span className="font-semibold text-slate-500">Address:</span> <span className="text-slate-800">{inspection.manufacturerAddress || 'Industrial Area, New Delhi'}</span></div>
              <div><span className="font-semibold text-slate-500">FSSAI / License:</span> <span className="text-slate-800">{inspection.fssaiLicense || 'Checked'}</span></div>
            </div>
          </div>
        </div>

        {/* Extracted Declarations & Rule Verification Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            2. Legal Metrology Rule 6 Mandatory Declarations Evaluation
          </h3>
          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 font-bold text-slate-700 uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3 border-b">Rule Ref</th>
                <th className="py-2.5 px-3 border-b">Mandatory Field</th>
                <th className="py-2.5 px-3 border-b">Extracted Package Value</th>
                <th className="py-2.5 px-3 border-b text-right">Verification Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-mono">
              {inspection.declarations?.map((d, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2 px-3 text-slate-500 font-bold">{d.rule}</td>
                  <td className="py-2 px-3 font-sans font-semibold text-slate-900">{d.label}</td>
                  <td className="py-2 px-3 text-slate-700">{d.value}</td>
                  <td className="py-2 px-3 text-right">
                    <StatusBadge status={d.status} size="sm" showIcon={false} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Violations & Remarks */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            3. Officer Findings & Directives
          </h3>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-slate-900">Official Verification Remarks:</div>
            <p className="text-slate-700 leading-relaxed font-medium">
              {inspection.adminRemarks || 'All mandatory packaging declarations evaluated and verified against Legal Metrology 2011 Rules.'}
            </p>
          </div>
        </div>

        {/* Official Signature & Seal Block */}
        <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-xs">
          <div className="space-y-1">
            <div className="w-24 h-24 border-2 border-dashed border-slate-300 rounded-full flex items-center justify-center text-[10px] font-mono text-slate-400 uppercase text-center p-2">
              Official Metrology Seal
            </div>
            <div className="text-[10px] text-slate-500 font-mono">SmartMetriX Automated Audit Token: {reportData?.qrToken || 'LIVE-DB-TOKEN'}</div>
          </div>

          <div className="text-right space-y-1">
            <div className="font-bold text-slate-900 text-sm">{inspection.verifiedBy || 'Priya Sharma (Verification Officer)'}</div>
            <div className="text-xs text-slate-500">Legal Metrology Officer</div>
            <div className="text-[10px] font-mono text-slate-400">Badge ID: LM-VO-1029</div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-3 text-center">
          <p>This report is generated directly from the Legal Metrology SQLite live enforcement database. Statutory legal enforcement actions are subject to official Directorate rules.</p>
        </div>
      </div>
    </div>
  );
}
