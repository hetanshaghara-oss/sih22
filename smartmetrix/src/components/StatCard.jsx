import React from 'react';

export default function StatCard({ title, value, icon: Icon, trend, color = "blue", subtitle }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200"
  };

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{title}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl md:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
            {value}
          </span>
          {trend && (
            <span className="text-xs font-bold text-emerald-600">
              {trend}
            </span>
          )}
        </div>
        {subtitle && <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>}
      </div>

      {Icon && (
        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${colorMap[color] || colorMap.blue}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
