import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LEGAL_METROLOGY_RULES } from '../data/rules';
import { Scale, ShieldCheck, ArrowLeft, Search, Filter, CheckCircle2, AlertCircle, BookOpen, FileText } from 'lucide-react';

export default function RulesRegistry() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('All');

  const filteredRules = LEGAL_METROLOGY_RULES.filter((rule) => {
    const matchesSearch =
      rule.declaration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.ruleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.legalReference.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity = selectedSeverity === 'All' || rule.severity === selectedSeverity;

    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans relative overflow-hidden flex flex-col">
      {/* Ambient background glow */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Official Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/20"
              >
                <Scale className="w-5 h-5" />
              </motion.div>
              <div>
                <div className="text-lg font-bold tracking-tight text-white flex items-center gap-1">
                  SmartMetri<span className="text-blue-400">X</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  Department of Consumer Affairs — Legal Metrology
                </div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition flex items-center gap-1.5 border border-slate-700/50"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 rounded-xl flex items-center gap-2 transition shadow-md shadow-blue-500/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Officer Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full relative z-10 space-y-8">
        {/* Page Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Statutory Gazette Mandate & Gazette Amendments 2022</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Legal Metrology Rules Registry (2011 & Amendments)
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Comprehensive repository of mandatory package declaration rules enforced by the SmartMetriX automated compliance verification engine under the Legal Metrology (Packaged Commodities) Rules, 2011 and subsequent amendments.
              </p>
            </div>
            <div className="shrink-0 flex md:flex-col items-start md:items-end justify-between gap-2">
              <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>8 Statutory Rules Active</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Rule 6 Statutory Matrix</span>
            </div>
          </div>
        </motion.div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search rule number, declaration, or reference..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-2">
              <Filter className="w-3.5 h-3.5 text-blue-400" />
              <span>Severity:</span>
            </div>
            {['All', 'High', 'Medium', 'Low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedSeverity === sev
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRules.map((rule, idx) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="glass-panel p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-400 px-2.5 py-1 bg-blue-950/60 rounded-lg border border-blue-900/50">
                      {rule.ruleNumber}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                      ID: {rule.id}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border flex items-center gap-1 ${
                      rule.severity === 'High'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : rule.severity === 'Medium'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    <AlertCircle className="w-3 h-3" />
                    {rule.severity} Severity
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                  {rule.declaration}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {rule.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-400 font-mono truncate">
                  <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{rule.legalReference}</span>
                </div>
                <span className="px-2 py-0.5 bg-slate-800/60 rounded text-[10px] text-slate-300 font-medium shrink-0">
                  {rule.version}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredRules.length === 0 && (
          <div className="glass-panel p-12 rounded-2xl text-center text-slate-400 space-y-3">
            <Search className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold">No statutory rules match your current search or severity filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSeverity('All');
              }}
              className="px-4 py-2 bg-slate-800 text-xs font-bold text-white rounded-xl hover:bg-slate-700 transition"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Disclaimer Footer Note */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Statutory rules are continuously parsed and verified against official Ministry gazette notifications.</span>
          </div>
          <span className="font-mono text-[10px] text-slate-500 font-bold uppercase shrink-0">
            Rule 6 Statutory Engine v2.4
          </span>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="bg-slate-950 text-slate-500 py-6 text-center text-xs border-t border-slate-800/80 mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-200">SmartMetriX</span> — Legal Metrology (Packaged Commodities) Rules, 2011 Platform
          </div>
          <div className="text-[11px] text-slate-500">
            Smart India Hackathon Prototype | Department of Consumer Affairs
          </div>
        </div>
      </footer>
    </div>
  );
}
