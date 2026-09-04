import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';
import NotificationDropdown from './NotificationDropdown';
import { Scale, PlusCircle, History, FileText, User, LogOut, LayoutDashboard, Menu, X, Building2 } from 'lucide-react';

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

  const links = isUser ? [
    { label: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
    { label: 'New Inspection', path: '/user/new-inspection', icon: PlusCircle },
    { label: 'Log', path: '/user/inspection-history', icon: History },
    { label: 'Reports', path: '/reports', icon: FileText }
  ] : [
    { label: 'Desk', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Queue', path: '/admin/queue', icon: History },
    { label: 'Rules', path: '/admin/rules', icon: Scale },
    { label: 'Reports', path: '/reports', icon: FileText }
  ];

  return (
    <header className="no-print sticky top-0 z-50 px-4 pt-4 pb-2">
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="max-w-7xl mx-auto glass-panel rounded-2xl px-4 sm:px-6 h-16 flex items-center justify-between"
      >
        {/* Brand Logo */}
        <Link to={isAdmin ? '/admin/dashboard' : '/user/dashboard'} className="flex items-center gap-3 group relative overflow-hidden">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30"
          >
            <Scale className="w-5 h-5" />
          </motion.div>
          <div>
            <div className="text-base font-extrabold tracking-tight text-white flex items-center gap-1 font-sans text-glow">
              SmartMetri<span className="text-blue-400">X</span>
            </div>
            <div className="text-[9px] text-slate-400 font-medium tracking-widest uppercase">
              Compliance Engine
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 p-1 bg-slate-800/50 rounded-xl border border-slate-700/50">
          {links.map((link) => {
            const IconComp = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="relative px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 group transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-slate-700/80 border border-slate-600/50 rounded-lg shadow-md"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <IconComp className={`w-4 h-4 relative z-10 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-blue-300'}`} />
                <span className={`relative z-10 ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Identity & Notifications */}
        <div className="flex items-center gap-3">
          <NotificationDropdown role={currentUser.roleKey} />

          <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-700/50">
            <div className="text-right leading-tight">
              <div className="text-xs font-bold text-slate-100">{currentUser.name}</div>
              <div className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                {currentUser.role}
              </div>
            </div>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full border-2 border-slate-700 object-cover shadow-lg"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="p-2 ml-2 text-slate-400 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/50 border border-transparent rounded-xl transition-all"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </header>
  );
}
