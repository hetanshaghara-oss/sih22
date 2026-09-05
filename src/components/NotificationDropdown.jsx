import React, { useState, useEffect } from 'react';
import { Bell, Check, Info, AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { inspectionService } from '../services/inspectionService';
import { useNavigate } from 'react-router-dom';

export default function NotificationDropdown({ role = 'user' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifs();
  }, [role]);

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
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white font-mono text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold">Inspection Notifications</span>
            </div>
            <span className="px-2 py-0.5 text-[10px] bg-slate-800 rounded font-mono">
              {unreadCount} unread
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No notifications found.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkRead(n.id, n.inspectionId)}
                  className={`p-3 text-xs hover:bg-slate-50 transition cursor-pointer flex items-start gap-3 ${
                    !n.read ? 'bg-blue-50/40 font-semibold' : ''
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    {n.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600" />}
                    {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                    {n.type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-900">{n.title}</div>
                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                    <span className="text-[10px] font-mono text-slate-400 mt-1 block">{n.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
            <button
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-semibold text-slate-600 hover:text-slate-900"
            >
              Close Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
