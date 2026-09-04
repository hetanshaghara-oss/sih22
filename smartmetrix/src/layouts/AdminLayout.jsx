import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <div className="relative z-50">
        <Navbar />
      </div>
      <div className="flex-1 flex max-w-7xl w-full mx-auto relative z-10">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <footer className="no-print bg-slate-900 text-slate-400 py-4 text-center text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-[11px] text-slate-500">
          <span>SmartMetriX Admin Cell v2.4</span>
          <span>Legal Metrology Verification Officer Portal</span>
        </div>
      </footer>
    </div>
  );
}
