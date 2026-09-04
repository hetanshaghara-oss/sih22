import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';

export default function UserLayout() {
  return (
    <div className="min-h-screen flex text-slate-100 selection:bg-blue-600 selection:text-white">
      <div className="flex-1 flex flex-col min-w-0 overflow-visible relative">
        {/* Subtle glow orb in background */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none z-0" />
        
        <div className="relative z-50 w-full">
          <Navbar />
        </div>
        
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:px-12 pb-24 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
