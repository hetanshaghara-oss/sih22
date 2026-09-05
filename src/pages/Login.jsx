import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { DEMO_USERS } from '../data/users';
import { Scale, Lock, User, ShieldCheck, ArrowRight, Building2 } from 'lucide-react';

export default function Login() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'admin' ? 'admin' : 'user';

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [email, setEmail] = useState(DEMO_USERS[initialRole].email);
  const [password, setPassword] = useState('demo123456');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRoleToggle = (role) => {
    setSelectedRole(role);
    setEmail(DEMO_USERS[role].email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(async () => {
      await authService.login(selectedRole);
      setLoading(false);
      if (selectedRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Brand */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 items-center justify-center text-white shadow-xl">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">SmartMetri<span className="text-blue-500">X</span></h2>
        <p className="text-xs text-slate-400 font-medium">
          Legal Metrology Enforcement & Verification Portal
        </p>
      </div>

      {/* Main Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 py-8 px-4 shadow-2xl rounded-2xl sm:px-10 space-y-6">

          {/* Role Switcher */}
          <div className="p-1 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => handleRoleToggle('user')}
              className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                selectedRole === 'user'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Inspection Officer</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleToggle('admin')}
              className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                selectedRole === 'admin'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verification Officer</span>
            </button>
          </div>

          {/* Selected Demo Profile Card */}
          <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center gap-3">
            <img
              src={DEMO_USERS[selectedRole].avatar}
              alt="Demo Avatar"
              className="w-10 h-10 rounded-full border border-slate-700 object-cover shrink-0"
            />
            <div className="text-left text-xs leading-tight">
              <div className="font-bold text-white">{DEMO_USERS[selectedRole].name}</div>
              <div className="text-blue-400 font-semibold">{DEMO_USERS[selectedRole].role}</div>
              <div className="text-[10px] text-slate-500">{DEMO_USERS[selectedRole].department}</div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Official Email Address
              </label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember session</span>
              </label>
              <span className="text-slate-500 text-[11px]">Demo Auth Mode</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Login as {DEMO_USERS[selectedRole].name}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo Identity Disclaimer */}
          <div className="text-[11px] text-slate-500 text-center leading-relaxed">
            <p>This application operates in <span className="text-slate-300 font-semibold">Demo Authentication Mode</span> for Smart India Hackathon testing.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
