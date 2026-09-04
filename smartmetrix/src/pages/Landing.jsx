import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  ShieldCheck,
  ArrowRight,
  Building2,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const WORKFLOW = [
  {
    step: '01',
    title: 'Scan packaging',
    desc: 'Field officer photographs the front panel, rear declarations, and MRP stamp at full resolution.'
  },
  {
    step: '02',
    title: 'Extract declarations',
    desc: 'Optical parsing reads net quantity, MRP, packing date, and consumer-care details off the label.'
  },
  {
    step: '03',
    title: 'Officer review',
    desc: 'A verification officer checks the highlighted regions against Rule 6 and confirms any violation.'
  },
  {
    step: '04',
    title: 'Issue report',
    desc: 'The system generates a statutory compliance certificate with a timestamped audit trail.'
  }
];

const RULES = [
  {
    ref: 'Rule 6(1)(a–b)',
    title: 'Product name & manufacturer',
    desc: 'Generic commodity identity and the complete registered manufacturer or importer address.'
  },
  {
    ref: 'Rule 6(1)(c–d)',
    title: 'Net quantity & MRP',
    desc: 'Standard metric-unit declaration and the maximum retail price shown in ₹ format.'
  },
  {
    ref: 'Rule 6(1)(e–f)',
    title: 'Packing date & consumer care',
    desc: 'Month and year of packing, plus a working helpline number and email address.'
  }
];

export default function Landing() {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans">
      {/* Official header */}
      <header className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-blue-600 flex items-center justify-center text-white">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-white">
                SmartMetri<span className="text-blue-400">X</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Department of Consumer Affairs — Legal Metrology
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 rounded-md flex items-center gap-2 transition shadow-md shadow-blue-500/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Officer Login</span>
            </Link>
          </div>
        </div>
        <div className="h-2 tick-rule text-slate-700" />
      </header>

      {/* Hero */}
      <section className="border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono text-blue-300 border border-blue-900 bg-blue-950/60 rounded px-2.5 py-1">
              <Building2 className="w-3.5 h-3.5" />
              <span>Legal Metrology (Packaged Commodities) Rules, 2011</span>
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight leading-[1.08] text-white">
              Every packet, checked against the rule it must satisfy.
            </h1>

            <p className="mt-5 text-sm sm:text-base text-slate-400 leading-relaxed max-w-lg">
              SmartMetriX reads product packaging, extracts the mandatory statutory
              declarations, and flags what fails Rule 6 — so enforcement officers spend
              their time on judgment calls, not label-reading.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/rules-registry"
                className="px-6 py-3 text-xs font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 rounded-md flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/20"
              >
                <span>View Rules Registry</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#workflow"
                className="px-6 py-3 text-xs font-bold text-slate-200 bg-transparent hover:bg-slate-900 border border-slate-700 rounded-md text-center transition"
              >
                Inspection Workflow
              </a>
            </div>

            <div className="mt-10 flex items-center gap-6 text-[11px] font-mono text-slate-500">
              <span>Smart India Hackathon prototype</span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span>Problem statement SIH-PS34</span>
            </div>
          </div>

          {/* Right: a real inspection read-out, not a generic stat card */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                <span className="text-[11px] font-mono text-slate-400">
                  INSPECTION LM-2026-00842
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-900">
                  Partially compliant
                </span>
              </div>

              <div className="grid grid-cols-5">
                <div className="col-span-2 border-r border-slate-800">
                  <img
                    src="https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600"
                    alt="India Gate Basmati Rice packaging sample"
                    className="w-full h-full object-cover min-h-[220px]"
                  />
                </div>

                <div className="col-span-3 p-4 space-y-2.5 font-mono text-[12px]">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-500">Product</span>
                    <span className="text-slate-200">India Gate Basmati 5kg</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-500">MRP</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ₹590.00
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-500">Net quantity</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 5 kg
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-500">Date of packing</span>
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> low contrast
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-slate-500">Compliance score</span>
                    <span className="text-amber-300 font-bold">78 / 100</span>
                  </div>
                </div>
              </div>

              <div className="px-4 py-2.5 bg-slate-950/60 border-t border-slate-800 text-[11px] text-slate-400">
                Officer remark: packing-month stamp needs a clearer photo before sign-off.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow — genuinely sequential, so numbered steps are earned here */}
      <section id="workflow" className="bg-slate-900/40 border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-white">How an inspection moves</h2>
            <p className="mt-2 text-sm text-slate-400">
              Four steps, from the officer's camera to a statutory decision.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-4">
            {WORKFLOW.map((item, idx) => (
              <div
                key={item.step}
                className={`p-5 ${idx !== 0 ? 'md:border-l border-slate-800' : ''}`}
              >
                <div className="font-mono text-xs text-blue-400">{item.step}</div>
                <h3 className="mt-2 text-sm font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statutory coverage — read as a rule registry, not a feature grid */}
      <section id="rules" className="bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-white">
              What Rule 6 requires on every packet
            </h2>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              Every pre-packaged commodity sold in India carries a fixed set of
              mandatory declarations. SmartMetriX checks each one automatically.
            </p>
          </div>

          <div className="mt-8 border border-slate-800 rounded-lg divide-y divide-slate-800 overflow-hidden">
            {RULES.map((rule) => (
              <div
                key={rule.ref}
                className="p-5 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 hover:bg-slate-900/50 transition"
              >
                <div className="sm:col-span-3 font-mono text-xs text-blue-400">{rule.ref}</div>
                <div className="sm:col-span-3 text-sm font-semibold text-white">{rule.title}</div>
                <div className="sm:col-span-6 text-xs text-slate-400 leading-relaxed">
                  {rule.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
