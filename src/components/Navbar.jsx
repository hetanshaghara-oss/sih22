import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import NotificationDropdown from './NotificationDropdown';
import { Scale, PlusCircle, History, FileText, User, LogOut, LayoutDashboard, Menu, X, Shield, Building2 } from 'lucide-react';

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
  }, [location]);

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const isUser = currentUser.roleKey === 'user';
  const isAdmin = currentUser.roleKey === 'admin';

  const userNavLinks = [
    { label: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
    { label: 'New Inspection', path: '/user/new-inspection', icon: PlusCircle },
    { label: 'Inspection Log', path: '/user/inspection-history', icon: History },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Profile', path: '/profile', icon: User }
  ];

  const adminNavLinks = [
    { label: 'Verification Desk', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Inspection Queue', path: '/admin/queue', icon: History },
    { label: 'Rules Registry', path: '/admin/rules', icon: Scale },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Profile', path: '/profile', icon: User }
  ];

  const links = isUser ? userNavLinks : adminNavLinks;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800 shadow-xs font-sans">
      {/* Official Department Sub-bar */}
      <div className="bg-slate-950 px-4 py-1 text-[11px] font-medium border-b border-slate-800/80 text-slate-400 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-slate-300">Department of Consumer Affairs</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-400">Legal Metrology (Packaged Commodities) Rules, 2011</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-mono text-slate-300 font-semibold uppercase">Enforcement Portal Active</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={isAdmin ? '/admin/dashboard' : '/user/dashboard'} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-600 transition">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-extrabold tracking-tight text-white flex items-center gap-1 font-sans">
              SmartMetri<span className="text-blue-400">X</span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Packaging Compliance System
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1">
          {links.map((link) => {
            const IconComp = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-2xs'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Identity & Notifications */}
        <div className="flex items-center gap-3">
          <NotificationDropdown role={currentUser.roleKey} />

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-800">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full border border-slate-700 object-cover"
            />
            <div className="text-left leading-tight">
              <div className="text-xs font-bold text-slate-200">{currentUser.name}</div>
              <div className="text-[10px] font-semibold text-blue-400 uppercase">
                {currentUser.role}
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {links.map((link) => {
            const IconComp = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 flex items-center gap-2"
              >
                <IconComp className="w-4 h-4 text-blue-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
