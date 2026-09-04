import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import EmptyState from './EmptyState';
import { Search, Filter, Eye, ShieldCheck, ChevronRight, ArrowUpDown, X } from 'lucide-react';

export default function InspectionTable({
  inspections = [],
  role = 'user', // user or admin
  title = "Inspections Records",
  showFilters = true
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('submittedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter Logic
  const filtered = inspections.filter((item) => {
    const matchesSearch =
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort Logic
  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (sortField === 'score') {
      valA = Number(valA || 0);
      valB = Number(valB || 0);
    }
    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-700/50 shadow-xs overflow-hidden font-sans">
      {/* Header & Controls */}
      {showFilters && (
        <div className="p-4 sm:p-5 border-b border-slate-700/50 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-extrabold text-white text-glow">{title}</h3>
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30 rounded-full">
              {filtered.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-auto flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search ID, product, brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-1.5 flex-1 sm:flex-initial">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-medium text-slate-200 bg-transparent focus:outline-none cursor-pointer w-full"
              >
                <option value="all" className="bg-slate-900 text-white">All Statuses</option>
                <option value="compliant" className="bg-slate-900 text-white">Compliant</option>
                <option value="partially_compliant" className="bg-slate-900 text-white">Partially Compliant</option>
                <option value="under_review" className="bg-slate-900 text-white">Under Review</option>
                <option value="needs_correction" className="bg-slate-900 text-white">Needs Correction</option>
                <option value="non_compliant" className="bg-slate-900 text-white">Non-Compliant</option>
              </select>
            </div>

            {(searchTerm || statusFilter !== 'all') && (
              <button
                onClick={handleClearFilters}
                className="p-2 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition shrink-0"
                title="Clear Filters"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/80 border-b border-slate-700/50 font-bold text-slate-400 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4 cursor-pointer hover:text-white transition" onClick={() => handleSort('id')}>
                <div className="flex items-center gap-1">
                  <span>Inspection ID</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-white transition" onClick={() => handleSort('productName')}>
                <div className="flex items-center gap-1">
                  <span>Product / Brand</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-white transition" onClick={() => handleSort('submittedAt')}>
                <div className="flex items-center gap-1">
                  <span>Submitted Date</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-white transition" onClick={() => handleSort('score')}>
                <div className="flex items-center gap-1">
                  <span>Score</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-500" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-8">
                  <EmptyState
                    title="No Matching Inspections"
                    description="No packaging inspections match your current search and filter selections."
                    actionLabel="Reset Search Filters"
                    onAction={handleClearFilters}
                  />
                </td>
              </tr>
            ) : (
              sorted.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white">{item.productName}</div>
                    <div className="text-[11px] text-slate-400">{item.manufacturer}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium">
                    <span className="px-2 py-0.5 bg-slate-800/80 border border-slate-700/60 rounded text-[11px] text-slate-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                    {item.submittedAt}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-mono font-extrabold text-xs ${
                      item.score >= 90 ? 'text-emerald-400' : item.score >= 60 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {item.score}%
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {role === 'admin' ? (
                      <Link
                        to={`/admin/review/${item.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-500 hover:to-blue-400 rounded-lg shadow-md transition-all hover:scale-105 active:scale-95"
                      >
                        <span>Review</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <Link
                        to={`/user/inspection-result/${item.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-300 glass-card hover:text-white rounded-lg transition-all hover:scale-105 active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-400" />
                        <span>View Result</span>
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
