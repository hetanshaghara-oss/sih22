import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  ShieldCheck,
  Scan,
  FileCheck,
  FileSpreadsheet,
  ArrowRight,
  Building2,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
  Eye,
  Award,
  BookOpen
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen font-sans">
      {/* Official Government Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-xs">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-white">SmartMetri<span className="text-blue-400">X</span></div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Department of Consumer Affairs • Legal Metrology</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login?role=user"
              className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
            >
              Inspection Officer Login
            </Link>
            <Link
              to="/login?role=admin"
              className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-600 rounded-lg shadow-2xs transition"
            >
              Verification Portal
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-20 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-blue-300 text-xs font-medium mb-6">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Legal Metrology (Packaged Commodities) Rules, 2011 Compliance</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-4xl mx-auto text-white">
            Smarter Packaged Commodity Compliance Inspection
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Scan product packaging labels, verify mandatory statutory declarations, identify non-compliance issues, and streamline enforcement workflows.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login?role=user"
              className="w-full sm:w-auto px-7 py-3.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-600 rounded-xl shadow-md flex items-center justify-center gap-2 transition"
            >
              <span>Start Product Inspection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login?role=admin"
              className="w-full sm:w-auto px-7 py-3.5 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition"
            >
              Verification Officer Desk
            </Link>
          </div>

          {/* Clean Interactive Packaging Inspection Card */}
          <div className="mt-14 max-w-4xl mx-auto bg-white text-slate-900 rounded-2xl p-6 shadow-xl border border-slate-200 text-left space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-700" />
                <h3 className="text-sm font-bold text-slate-900">Packaging Compliance Audit Sample</h3>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md">
                Rule 6 Standard Format
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Product Sample</span>
                <h4 className="text-xs font-bold text-slate-900 mt-0.5">India Gate Basmati Rice 5kg</h4>
                <img
                  src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400"
                  alt="Packaging Sample"
                  className="w-full h-32 object-cover rounded-lg mt-2 border border-slate-200"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Declarations Verification</span>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span>MRP:</span> <strong className="text-emerald-700">₹590.00 ✓</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span>Net Qty:</span> <strong className="text-emerald-700">5 kg ✓</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span>Date of Mfg:</span> <strong className="text-amber-700">Needs Review ⚠</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Consumer Care:</span> <strong className="text-emerald-700">Verified ✓</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Compliance Score</span>
                  <div className="text-3xl font-black text-amber-700 mt-1">78 / 100</div>
                  <div className="text-xs font-bold text-amber-800 uppercase mt-0.5">Partially Compliant</div>
                </div>
                <div className="p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900">
                  Officer Remark: Packing month stamp exhibits low contrast.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Workflow */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-extrabold text-slate-900">Four-Step Inspection Workflow</h2>
            <p className="mt-2 text-xs text-slate-500">
              Designed for field enforcement officers and legal metrology review authorities.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">1. Scan Packaging</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Field inspector captures high-resolution photographs of front, rear, and MRP label panels.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">2. Extract Declarations</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Optical character parsing extracts Net Quantity, MRP, Packaging Date, and Helpline details.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">3. Officer Review</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verification officer reviews region highlights, evaluates Rule 6 compliance, and confirms violations.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center text-xs font-bold">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900">4. Issue Report</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                System generates an official statutory compliance certificate with timestamped audit timeline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statutory Rules Matrix */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Statutory Provisions</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">
              Legal Metrology (Packaged Commodities) Rules, 2011 Coverage
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Every pre-packaged commodity sold in India must contain mandatory declarations specified under Section 6.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
              <div className="font-mono font-bold text-blue-700">Rule 6(1)(a) & (b)</div>
              <h4 className="font-bold text-slate-900">Product Name & Manufacturer Details</h4>
              <p className="text-slate-500">Generic commodity identity and complete registered manufacturer/importer address.</p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
              <div className="font-mono font-bold text-blue-700">Rule 6(1)(c) & (d)</div>
              <h4 className="font-bold text-slate-900">Net Quantity & MRP Declaration</h4>
              <p className="text-slate-500">Standard metric unit declaration and Maximum Retail Price in ₹ symbol format.</p>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
              <div className="font-mono font-bold text-blue-700">Rule 6(1)(e) & (f)</div>
              <h4 className="font-bold text-slate-900">Packaging Date & Consumer Care</h4>
              <p className="text-slate-500">Month & year of packing along with complete telephone helpline and email address.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
