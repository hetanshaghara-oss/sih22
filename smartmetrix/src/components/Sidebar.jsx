import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { DEMO_USERS } from '../data/users';
import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  BarChart3,
  Scale,
  Users,
  Settings,
  ShieldAlert
} from 'lucide-react';

export default function Sidebar({ activeTab, onTabChange }) {
  const location = useLocation();
  const currentUser = authService.getCurrentUser() || DEMO_USERS.admin;

  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { key: 'queue', label: 'Inspection Queue', icon: ClipboardList, path: '/admin/queue' },
    { key: 'all', label: 'All Inspections', icon: ShieldAlert, path: '/admin/queue?status=all' },
    { key: 'verified', label: 'Verified', icon: CheckCircle2, path: '/admin/queue?status=compliant' },
    { key: 'rejected', label: 'Rejected', icon: XCircle, path: '/admin/queue?status=non_compliant' },
    { key: 'needs_review', label: 'Needs Review', icon: AlertTriangle, path: '/admin/queue?status=under_review' },
    { key: 'reports', label: 'Reports', icon: FileText, path: '/reports' },
    { key: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/dashboard' },
    { key: 'rules', label: 'Rules Registry', icon: Scale, path: '/admin/rules' },
    { key: 'users', label: 'Users & Officers', icon: Users, path: '/profile' },
    { key: 'settings', label: 'Settings', icon: Settings, path: '/profile' }
  ];

  return (
    <aside className="no-print w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] p-4 border-r border-slate-800 shrink-0 hidden md:block">
      <div className="mb-6 px-3 py-2 bg-slate-800/80 rounded-xl border border-slate-700/60">
        <div className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">
          Role Active
        </div>
        <div className="text-xs font-bold text-white mt-0.5">{currentUser.role} ({currentUser.roleKey === 'admin' ? 'Admin' : 'Officer'})</div>
        <div className="text-[11px] text-slate-400">{currentUser.department}</div>
      </div>

      <div className="space-y-1">
        {menuItems.map((item) => {
          const IconComp = item.icon;
          const isActive = location.pathname === item.path || activeTab === item.key;
          return (
            <Link
              key={item.key}
              to={item.path}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-2xs font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
