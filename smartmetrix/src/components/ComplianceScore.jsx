import React from 'react';
import { getScoreCategory } from '../utils/status';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

export default function ComplianceScore({ score = 0 }) {
  const category = getScoreCategory(score);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = "#2c6837"; // verified
  let textColor = "text-emerald-700";
  let badgeBg = "bg-emerald-50 text-emerald-800 border-emerald-200";
  let Icon = ShieldCheck;

  if (score < 60) {
    strokeColor = "#833225"; // non-compliant
    textColor = "text-rose-700";
    badgeBg = "bg-rose-50 text-rose-800 border-rose-200";
    Icon = ShieldX;
  } else if (score < 90) {
    strokeColor = "#855c18"; // needs review
    textColor = "text-amber-700";
    badgeBg = "bg-amber-50 text-amber-800 border-amber-200";
    Icon = ShieldAlert;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        Packaging Compliance Score
      </span>

      <div className="relative w-32 h-32 flex items-center justify-center my-3">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#e7ebea"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={strokeColor}
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-extrabold tracking-tight ${textColor}`}>
            {score}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            / 100
          </span>
        </div>
      </div>

      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${badgeBg}`}>
        <Icon className="w-4 h-4" />
        <span>{category.label}</span>
      </div>

      <p className="mt-3 text-[11px] text-slate-500 text-center max-w-[210px] leading-relaxed">
        Legal Metrology (Packaged Commodities) Rules, 2011 Section 6 evaluation.
      </p>
    </div>
  );
}
