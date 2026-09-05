import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-200">SmartMetriX</span> — Legal Metrology Packaged Commodities Compliance Engine
          </div>
          <div className="text-slate-500 text-[11px]">
            Smart India Hackathon Prototype (SIH PS34) | Confidential Enforcement Portal
          </div>
        </div>
      </footer>
    </div>
  );
}
