import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <span className="font-mono text-xs font-bold text-rose-600 uppercase">Error 404</span>
        <h1 className="text-2xl font-black text-slate-900">Requested Inspection Page Not Found</h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          The URL or inspection record resource you requested does not exist or has been archived.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Link
          to="/user/dashboard"
          className="px-5 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl flex items-center gap-2"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Return to User Dashboard</span>
        </Link>
        <Link
          to="/"
          className="px-5 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl"
        >
          <span>Landing Page</span>
        </Link>
      </div>
    </div>
  );
}
