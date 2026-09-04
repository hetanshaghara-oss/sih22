import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { User, ShieldCheck, Mail, Phone, MapPin, Building2, Clock, Key, ArrowRight } from 'lucide-react';

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const navigate = useNavigate();

  const handleRoleSwitch = (newRoleKey) => {
    const switched = authService.switchRole(newRoleKey);
    setCurrentUser(switched);
    if (newRoleKey === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/user/dashboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-24 h-24 rounded-2xl border-2 border-blue-500 object-cover shadow-md shrink-0"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-black text-slate-900">{currentUser.name}</h1>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-extrabold rounded-full border border-blue-200 uppercase">
                {currentUser.role}
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-600 flex items-center justify-center sm:justify-start gap-1.5">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>{currentUser.department}</span>
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 font-mono pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {currentUser.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Last Login: {currentUser.lastLogin}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Official Email</span>
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>{currentUser.email}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Helpline / Contact</span>
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-blue-600" />
              <span>{currentUser.phone}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Badge / Officer ID</span>
            <div className="font-mono font-bold text-blue-700 text-sm">
              {currentUser.badgeNumber}
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Access Scope</span>
            <div className="font-bold text-slate-800">
              {currentUser.roleKey === 'admin' ? 'Central Directorate Verification & Rules Cell' : 'Field Inspection & Label Submission'}
            </div>
          </div>
        </div>
      </div>

      {/* Role Switcher Demo Card */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Demo Role Simulation Switcher</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Switch between Inspection Officer and Verification Officer roles for SIH demo testing.
            </p>
          </div>
          <span className="px-2 py-0.5 text-[10px] bg-amber-950 text-amber-300 border border-amber-800 rounded font-mono">
            Demo Mode
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => handleRoleSwitch('user')}
            className={`w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition ${
              currentUser.roleKey === 'user'
                ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Switch to Inspection Officer (Rahul Mehta)</span>
          </button>

          <button
            onClick={() => handleRoleSwitch('admin')}
            className={`w-full sm:w-auto px-5 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition ${
              currentUser.roleKey === 'admin'
                ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
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
