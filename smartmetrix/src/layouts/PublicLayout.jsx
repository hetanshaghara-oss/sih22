import React from 'react';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <div className="flex-1">
        <Outlet />
      </div>
      <footer className="bg-slate-950 text-slate-500 py-8 text-center text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
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
