import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Keyboard, HelpCircle, Loader2, LogIn, User, Globe } from 'lucide-react';
import { auth, googleProvider, signInWithPopup } from '../lib/firebase';
import { loadUserProfile, loadUserHistory, saveUserProfile } from '../lib/sync';
import { UserProfile, TestHistoryEntry } from '../types';
import { INITIAL_PROFILE } from '../utils/storage';

interface WelcomeModalProps {
  onComplete: (profile: UserProfile, history?: TestHistoryEntry[]) => void;
  language: 'uz' | 'en';
  setLanguage: (lang: 'uz' | 'en') => void;
}

export default function WelcomeModal({ onComplete, language, setLanguage }: WelcomeModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLgInLoading, setIsLgInLoading] = useState(false);
  const [showGuestForm, setShowGuestForm] = useState(false);

  // Handle Google OAuth authentication
  const handleGoogleSignIn = async () => {
    setIsLgInLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user) throw new Error("Google access failed");

      // Load remote profile
      const remoteProfile = await loadUserProfile(user.uid);
      const remoteHistory = await loadUserHistory(user.uid);

      if (remoteProfile) {
        // Logged in with existing cloud progress
        const updatedProfile: UserProfile = {
          ...INITIAL_PROFILE,
          ...remoteProfile,
          uid: user.uid,
          authType: 'google',
          email: user.email || undefined,
          photoURL: user.photoURL || undefined
        };
        onComplete(updatedProfile, remoteHistory);
      } else {
        // First-time user, initialize new profile
        const todayStr = new Date().toISOString().split('T')[0];
        const newProfile: UserProfile = {
          ...INITIAL_PROFILE,
          id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
          uid: user.uid,
          authType: 'google',
          email: user.email || undefined,
          photoURL: user.photoURL || undefined,
          fullName: user.displayName || "Taniqli O'quvchi",
          lastActiveDate: todayStr,
          streak: 1
        };
        // Back up to firestore right away
        await saveUserProfile(user.uid, newProfile);
        onComplete(newProfile, []);
      }
    } catch (e: any) {
      console.error(e);
      // Format the error message for better debugging
      const errorMessage = e?.message || "Noma'lum xatolik";
      setError(
        language === 'uz'
          ? `Google orqali kirishda xatolik yuz berdi: ${errorMessage}`
          : `An error occurred during Google Sign-In: ${errorMessage}`
      );
    } finally {
      setIsLgInLoading(false);
    }
  };

  // Handle Guest form submission
  const handleSubmitGuest = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanFirst = firstName.trim();
    const cleanLast = lastName.trim();

    if (!cleanFirst || !cleanLast) {
      setError(
        language === 'uz'
          ? "Iltimos, ismingiz va familiyangizni to'liq kiriting!"
          : "Please enter both your first name and last name!"
      );
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const guestProfile: UserProfile = {
      ...INITIAL_PROFILE,
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      authType: 'guest',
      fullName: `${cleanFirst} ${cleanLast}`,
      lastActiveDate: todayStr,
      streak: 1
    };

    onComplete(guestProfile, []);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden p-4">
      {/* Moving mesh graphic theme wrapper background */}
      <div 
        className="absolute inset-0 transition-all duration-1000 animate-gradient-slow"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #030712 100%)',
          backgroundSize: '400% 400%',
        }}
      />

      {/* Floating subtle radial decorative lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Central Onboarding Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl p-8 max-w-md w-full text-white overflow-hidden"
      >
        {/* Language selector in upper corner */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setLanguage(language === 'uz' ? 'en' : 'uz')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-cyan-200 hover:bg-white/10 transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="uppercase font-bold">{language === 'uz' ? 'EN' : 'UZ'}</span>
          </button>
        </div>

        {/* Subtle decorative outline glass light */}
        <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-3xl" />

        <div className="flex flex-col items-center text-center space-y-6">
          {/* Official speedometer SVG logo */}
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 blur-lg opacity-75" />
            <div className="relative bg-slate-950 border border-white/10 p-4 rounded-2xl flex items-center justify-center shadow-xl w-20 h-20">
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
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-300 bg-clip-text text-transparent uppercase font-mono">
              DK-TYPING
            </h1>
            <p className="text-[10px] tracking-widest text-cyan-400 font-mono uppercase font-black">
              {language === 'uz' ? "Yozish Tezligi Platformasi" : "Keyboard Speed Academy"}
            </p>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
            {language === 'uz' 
              ? "Platformamizga xush kelibsiz! Har qanday qurilmadan o'z natijalaringizni ko'rish hamda saqlab qolish uchun Google orqali tizmga kiring yoki mehmon sifatida darslarni boshlang."
              : "Welcome to our platform! Log in with Google to sync your typing progress across any device, or start as a guest right away."}
          </p>

          <div className="w-full space-y-4 pt-2">
            {/* 1. Google Sign-In Button */}
            <button
              id="google-signin-button"
              disabled={isLgInLoading}
              onClick={handleGoogleSignIn}
              className="w-full py-3.5 px-5 bg-white text-slate-900 font-extrabold text-sm rounded-2xl shadow-xl hover:bg-slate-100 transition-all duration-300 flex items-center justify-center space-x-3 cursor-pointer disabled:opacity-50"
            >
              {isLgInLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              )}
              <span>{language === 'uz' ? "Google orqali kirish" : "Sign in with Google"}</span>
            </button>

            {/* Separator / Divider */}
            <div className="flex items-center my-2 text-[10px] text-slate-500 font-mono uppercase tracking-widest">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="px-3">{language === 'uz' ? "yoki" : "or"}</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* 2. Guest Login Expand Trigger */}
            {!showGuestForm ? (
              <button
                id="guest-signin-expand"
                onClick={() => setShowGuestForm(true)}
                className="w-full py-3 px-5 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-300 font-bold text-sm rounded-2xl transition duration-200 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>{language === 'uz' ? "Mehmon sifatida kirish" : "Continue as Guest"}</span>
              </button>
            ) : (
              <motion.form 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                onSubmit={handleSubmitGuest} 
                className="space-y-4 text-left"
              >
                <div className="grid grid-cols-2 gap-3">
                  <input
                    id="first-name-input"
                    type="text"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      setError('');
                    }}
                    placeholder={language === 'uz' ? "Ismingiz" : "First Name"}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white outline-none font-sans text-sm focus:border-cyan-500 placeholder-slate-500 transition-all"
                  />
                  <input
                    id="last-name-input"
                    type="text"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      setError('');
                    }}
                    placeholder={language === 'uz' ? "Familiyangiz" : "Last Name"}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white outline-none font-sans text-sm focus:border-cyan-500 placeholder-slate-500 transition-all"
                  />
                </div>

                <button
                  id="onboarding-submit-button"
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-extrabold text-sm rounded-xl shadow-lg hover:opacity-95 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Keyboard className="w-4 h-4" />
                  <span>{language === 'uz' ? "Mashg'ulotni Boshlash" : "Start Practice"}</span>
                </button>
              </motion.form>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-rose-400 text-xs font-semibold text-center bg-rose-950/50 py-2.5 px-4 rounded-xl border border-rose-800/40"
              >
                {error}
              </motion.div>
            )}
          </div>
        </div>

        {/* Info footer note */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 text-center text-slate-500 text-[10px] font-mono uppercase tracking-wider">
          DK-Typing Cloud Sync active
        </div>
      </motion.div>
    </div>
  );
}
