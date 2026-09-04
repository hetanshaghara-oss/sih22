import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Info, AlertTriangle, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { inspectionService } from '../services/inspectionService';
import { useNavigate } from 'react-router-dom';

export default function NotificationDropdown({ role = 'user' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifs();
  }, [role]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifs = async () => {
    const data = await inspectionService.getNotifications(role);
    setNotifications(data);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkRead = async (id, inspectionId) => {
    await inspectionService.markNotificationRead(id);
    loadNotifs();
    setIsOpen(false);
    if (inspectionId) {
      if (role === 'admin') {
        navigate(`/admin/review/${inspectionId}`);
      } else {
        navigate(`/user/inspection-result/${inspectionId}`);
      }
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-700/60 rounded-xl transition-all shadow-sm"
        title="Inspection Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-4 px-1 bg-rose-500 text-white font-mono text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-slate-950 shadow-md shadow-rose-500/40 animate-pulse">
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl z-[100] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white tracking-wide">Inspection Alerts & Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-md font-mono font-bold">
                  {unreadCount} unread
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-88 overflow-y-auto divide-y divide-slate-800/60">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  <Bell className="w-6 h-6 text-slate-600 mx-auto mb-2 opacity-50" />
                  No new notifications found.
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleMarkRead(n.id, n.inspectionId)}
                    className={`p-3.5 text-xs transition cursor-pointer flex items-start gap-3.5 ${
                      !n.read
                        ? 'bg-blue-950/40 hover:bg-blue-900/40 border-l-4 border-l-blue-400'
                        : 'hover:bg-slate-800/50 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {n.type === 'success' && (
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                      )}
                      {n.type === 'error' && (
                        <div className="w-6 h-6 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                        </div>
                      )}
                      {n.type === 'warning' && (
                        <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        </div>
                      )}
                      {n.type === 'info' && (
                        <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                          <Info className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-white text-xs leading-snug">{n.title}</div>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed line-clamp-2">{n.message}</p>
                      <span className="text-[10px] font-mono text-slate-400 mt-1.5 block">{n.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-slate-950/80 border-t border-slate-800 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-[11px] font-semibold text-slate-400 hover:text-white transition"
              >
                Close Notification Menu
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
