import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/authService';
import { DEMO_USERS } from '../data/users';
import NotificationDropdown from './NotificationDropdown';
import { Scale, PlusCircle, History, FileText, User, LogOut, LayoutDashboard, Menu, X, Building2 } from 'lucide-react';

export default function Navbar() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser() || DEMO_USERS.user);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(authService.getCurrentUser() || DEMO_USERS.user);
  }, [location]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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

        {/* Right side: Notifications + User + Hamburger */}
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
            className="hidden sm:flex p-2 ml-2 text-slate-400 hover:text-white hover:bg-rose-500/20 hover:border-rose-500/50 border border-transparent rounded-xl transition-all"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </motion.button>

          {/* Hamburger — mobile only */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/60 border border-slate-700/50 transition-all"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </motion.div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="md:hidden max-w-7xl mx-auto mt-2 glass-panel rounded-2xl px-4 py-4 space-y-1 origin-top"
          >
            {/* User Identity */}
            <div className="flex items-center gap-3 px-3 py-2.5 mb-2 border-b border-slate-700/50">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full border-2 border-slate-700 object-cover"
              />
              <div className="leading-tight">
                <div className="text-xs font-bold text-white">{currentUser.name}</div>
                <div className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">{currentUser.role}</div>
              </div>
            </div>

            {/* Nav Links */}
            {links.map((link) => {
              const IconComp = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all mt-1 border-t border-slate-700/50 pt-3"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
