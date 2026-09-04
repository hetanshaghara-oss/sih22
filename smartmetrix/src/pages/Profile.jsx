import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import LoadingState from '../components/LoadingState';
import { User, ShieldCheck, Mail, Phone, MapPin, Building2, Clock, Key } from 'lucide-react';

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  };

  const handleRoleSwitch = async (newRoleKey) => {
    setLoading(true);
    const switched = await authService.switchRole(newRoleKey);
    if (switched) {
      setCurrentUser(switched);
    }
    setLoading(false);
    if (newRoleKey === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/user/dashboard');
    }
  };

  if (!currentUser) return <LoadingState message="Loading officer profile..." />;

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Profile Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-700/50 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 rounded-2xl border-2 border-blue-500 object-cover shadow-lg shadow-blue-500/20 shrink-0"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-white text-glow">{currentUser.name}</h1>
              <span className="px-3 py-1 bg-blue-500/15 text-blue-400 text-xs font-extrabold rounded-full border border-blue-500/30 uppercase">
                {currentUser.role}
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-300 flex items-center justify-center sm:justify-start gap-1.5">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>{currentUser.department}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 font-mono pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                {currentUser.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Last Login: {currentUser.lastLogin}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-700/50 text-xs">
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/50 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Official Email</span>
            <div className="font-bold text-white flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>{currentUser.email}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/50 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Helpline / Contact</span>
            <div className="font-bold text-white flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-blue-400" />
              <span>{currentUser.phone}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/50 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Badge / Officer ID</span>
            <div className="font-mono font-bold text-blue-400 text-sm">
              {currentUser.badgeNumber}
            </div>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-700/50 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Access Scope</span>
            <div className="font-bold text-slate-200">
              {currentUser.roleKey === 'admin' ? 'Central Directorate Verification & Rules Cell' : 'Field Inspection & Label Submission'}
            </div>
          </div>
        </div>
      </div>

      {/* Role Switcher Card */}
      <div className="p-6 glass-panel text-white rounded-2xl border border-slate-700/50 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Live Officer Role Switcher</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Switch between Inspection Officer and Verification Officer accounts in the SQLite database.
            </p>
          </div>
          <span className="px-2.5 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full font-mono font-bold">
            Live SQLite Auth
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => handleRoleSwitch('user')}
            disabled={loading}
            className={`w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
              currentUser.roleKey === 'user'
                ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-lg shadow-blue-900/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Switch to Inspection Officer (Rahul Mehta)</span>
          </button>

          <button
            onClick={() => handleRoleSwitch('admin')}
            disabled={loading}
            className={`w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all ${
              currentUser.roleKey === 'admin'
                ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-lg shadow-indigo-900/50'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Switch to Verification Officer (Priya Sharma)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
