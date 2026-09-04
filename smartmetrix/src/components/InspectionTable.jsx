import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { Search, Filter, Eye, ShieldCheck, ChevronRight, ArrowUpDown } from 'lucide-react';

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

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header & Controls */}
      {showFilters && (
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-800">{title}</h3>
            <span className="px-2 py-0.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-full">
              {filtered.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by ID, product, manufacturer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-medium text-slate-700 bg-transparent focus:outline-hidden cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="compliant">Compliant</option>
                <option value="partially_compliant">Partially Compliant</option>
                <option value="under_review">Under Review</option>
                <option value="needs_correction">Needs Correction</option>
                <option value="non_compliant">Non-Compliant</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-100/70 border-b border-slate-200 font-bold text-slate-700 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('id')}>
                <div className="flex items-center gap-1">
                  <span>Inspection ID</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('productName')}>
                <div className="flex items-center gap-1">
                  <span>Product / Brand</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('submittedAt')}>
                <div className="flex items-center gap-1">
                  <span>Submitted Date</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 cursor-pointer" onClick={() => handleSort('score')}>
                <div className="flex items-center gap-1">
                  <span>Score</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-10 text-slate-500">
                  No inspection records match your selected criteria.
                </td>
              </tr>
            ) : (
              sorted.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {item.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{item.productName}</div>
                    <div className="text-[11px] text-slate-500">{item.manufacturer}</div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {item.submittedAt}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`font-mono font-extrabold text-xs ${item.score >= 90 ? 'text-emerald-600' : item.score >= 60 ? 'text-amber-600' : 'text-rose-600'
                        }`}>
                        {item.score}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    {role === 'admin' ? (
                      <Link
                        to={`/admin/review/${item.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-2xs transition"
                      >
                        <span>Review</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <Link
                        to={`/user/inspection-result/${item.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
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
