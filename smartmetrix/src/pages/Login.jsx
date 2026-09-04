import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import { DEMO_USERS } from '../data/users';
import { Scale, User, ShieldCheck, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[20%] h-[20%] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Brand */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md text-center"
      >
        <motion.div
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.6 }}
          className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 to-blue-400 items-center justify-center text-white shadow-xl shadow-blue-500/30"
        >
          <Scale className="w-7 h-7" />
        </motion.div>
        <h1 className="mt-5 text-3xl font-black text-white tracking-tight text-glow">
          SmartMetri<span className="text-blue-400">X</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400 font-medium">
          Legal Metrology enforcement & verification portal
        </p>
      </motion.div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="glass-panel rounded-2xl py-8 px-6 sm:px-8 space-y-6">
          {/* Role switcher */}
          <div className="p-1.5 bg-slate-800/60 rounded-xl border border-slate-700/50 grid grid-cols-2 gap-1.5">
            <motion.button
              type="button"
              onClick={() => handleRoleToggle('user')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`py-2.5 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                selectedRole === 'user'
                  ? 'bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg shadow-blue-900/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Inspection Officer</span>
            </motion.button>
            <motion.button
              type="button"
              onClick={() => handleRoleToggle('admin')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`py-2.5 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
                selectedRole === 'admin'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-400 text-white shadow-lg shadow-indigo-900/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verification Officer</span>
            </motion.button>
          </div>

          {/* Demo profile */}
          <motion.div
            key={selectedRole}
            initial={{ opacity: 0, x: selectedRole === 'admin' ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 glass-card rounded-xl flex items-center gap-3"
          >
            <img
              src={DEMO_USERS[selectedRole].avatar}
              alt="Demo account"
              className="w-11 h-11 rounded-full border-2 border-slate-600 object-cover shrink-0 shadow-lg"
            />
            <div className="text-left text-xs leading-tight">
              <div className="font-bold text-white text-sm">{DEMO_USERS[selectedRole].name}</div>
              <div className={selectedRole === 'admin' ? 'font-semibold text-indigo-400' : 'font-semibold text-blue-400'}>
                {DEMO_USERS[selectedRole].role}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">{DEMO_USERS[selectedRole].department}</div>
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Official email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/60 border border-slate-600/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-800/60 border border-slate-600/50 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-600 text-blue-500 focus:ring-blue-500"
                />
                <span>Remember session</span>
              </label>
              <span className="text-slate-600 text-[11px] font-mono">Demo auth mode</span>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 px-4 text-sm font-bold text-white bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-600 hover:to-blue-400 rounded-xl shadow-xl shadow-blue-900/50 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating…</span>
              ) : (
                <>
                  <span>Log in as {DEMO_USERS[selectedRole].name}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            This application runs in <span className="text-slate-300 font-semibold">demo authentication mode</span> for Smart India Hackathon testing.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
