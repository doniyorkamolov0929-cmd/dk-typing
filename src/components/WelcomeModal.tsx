/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Keyboard, HelpCircle } from 'lucide-react';

interface WelcomeModalProps {
  onComplete: (fullName: string) => void;
}

export default function WelcomeModal({ onComplete }: WelcomeModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();

    if (!cleanFirst || !cleanLast) {
      setError("Iltimos, ismingiz va familiyangizni to'liq kiriting!");
      return;
    }

    onComplete(`${cleanFirst} ${cleanLast}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4">
      {/* Moving mesh graphic theme wrapper background */}
      <div 
        className="absolute inset-0 transition-all duration-1000 animate-gradient-slow"
        style={{
          background: 'linear-gradient(135deg, #130CB7 0%, #1a1575 50%, #52E5E7 100%)',
          backgroundSize: '400% 400%',
        }}
      />

      {/* Floating subtle radial decorative lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Central Onboarding Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 max-w-md w-full text-white overflow-hidden"
      >
        {/* Subtle decorative outline glass light */}
        <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-3xl" />

        <div className="flex flex-col items-center text-center space-y-6">
          {/* Official speedometer SVG logo "DK TYPING SPEED • WPM" */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 blur-lg opacity-75" />
            <div className="relative bg-slate-900 border border-white/20 p-4 rounded-2xl flex items-center justify-center shadow-xl w-20 h-20">
              <svg className="w-12 h-12 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 0 1 10 10c0 1-.3 2-.9 2.9M2.1 14.9C1.3 14 1 13 1 12A10 10 0 0 1 11.2 2" strokeDasharray="3 3"/>
                <circle cx="12" cy="12" r="1" />
                <path d="m19 19-3.5-3.5" />
                <path d="M11 12.5H3" />
                <path d="m12 12 4-6" className="animate-pulse" strokeWidth="2.5"/>
              </svg>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-300 bg-clip-text text-transparent">
              DK-TYPING
            </h1>
            <p className="text-xs tracking-widest text-cyan-200 font-mono uppercase">
              Yozish Tezligi Platformasi
            </p>
          </div>

          <p className="text-sm text-slate-200/90 font-sans leading-relaxed">
            Mashq qilish va sertifikatlar olish uchun ismingiz hamda familiyangizni kiriting. Ma'lumotlaringiz brauzeringizda xavfsiz saqlanadi.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-5 text-left">
            {/* First Name Input */}
            <div className="relative group">
              <input
                id="first-name-input"
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setError('');
                }}
                placeholder="Ismingiz"
                className="w-full px-5 py-4 bg-white/5 border border-white/20 rounded-2xl text-white outline-none font-sans text-base transition-all duration-300 focus:border-cyan-400 focus:bg-white/10 placeholder-slate-400"
              />
            </div>

            {/* Last Name Input */}
            <div className="relative group">
              <input
                id="last-name-input"
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setError('');
                }}
                placeholder="Familiyangiz"
                className="w-full px-5 py-4 bg-white/5 border border-white/20 rounded-2xl text-white outline-none font-sans text-base transition-all duration-300 focus:border-cyan-400 focus:bg-white/10 placeholder-slate-400"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-rose-400 text-xs font-medium text-center bg-rose-500/10 py-2.5 px-4 rounded-xl border border-rose-500/20"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              id="onboarding-submit-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-900 font-bold text-base rounded-2xl shadow-xl hover:shadow-cyan-400/20 transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center space-x-2"
            >
              <Keyboard className="w-5 h-5 text-slate-900" />
              <span>Mashg'ulotni Boshlash</span>
            </motion.button>
          </form>
        </div>

        {/* Humility footer note */}
        <div className="mt-8 pt-4 border-t border-white/10 text-center text-slate-400 text-xs">
          100% Serversiz &bull; Mahalliy Saqlash
        </div>
      </motion.div>
    </div>
  );
}
