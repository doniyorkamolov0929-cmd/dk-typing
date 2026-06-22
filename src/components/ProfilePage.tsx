import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, IdCard, Trash2, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileProps {
  profile: UserProfile;
  language: 'uz' | 'en';
  onProfileUpdate: (updated: UserProfile) => void;
  onSignOut: () => void;
  onResetData: () => void;
}

export default function Profile({
  profile,
  language,
  onProfileUpdate,
  onSignOut,
  onResetData
}: ProfileProps) {
  const [nameInput, setNameInput] = useState(profile.fullName || "");
  const [idInput, setIdInput] = useState(profile.accountId || "");
  const [saveStatus, setSaveStatus] = useState<'' | 'saving' | 'saved'>('');

  const handleSave = () => {
    setSaveStatus('saving');
    
    // Only update if valid
    const cleanId = idInput.trim().slice(0, 5);
    const cleanName = nameInput.trim();

    onProfileUpdate({
      ...profile,
      fullName: cleanName || profile.fullName,
      accountId: cleanId || profile.accountId
    });

    setTimeout(() => setSaveStatus('saved'), 600);
    setTimeout(() => setSaveStatus(''), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900/40 border border-slate-800/80 p-6 md:p-8 rounded-3xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-xl shadow-cyan-500/20">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt={profile.fullName} className="w-full h-full rounded-2xl object-cover" />
              ) : (
                profile.fullName.substring(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  {profile.fullName}
                </h1>
                <span className="px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-wider rounded-lg">
                  ID: {profile.accountId || 'YOOQ'}
                </span>
              </div>
              <p className="text-sm text-slate-400">
                {profile.authType === 'google' ? profile.email : (language === 'uz' ? "Mehmon hisobi" : "Guest Account")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Settings Form */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-6 backdrop-blur-md">
          <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {language === 'uz' ? "Shaxsiy Ma'lumotlar" : "Personal Info"}
              </h2>
              <p className="text-xs text-slate-400">
                {language === 'uz' ? "Ismingiz va ID raqamingizni tahrirlash" : "Edit your name and ID"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                {language === 'uz' ? "Ism Familiya" : "Full Name"}
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900 transition-all font-medium"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                {language === 'uz' ? "Besh xonali ID raqam" : "5-Digit ID"}
              </label>
              <input
                type="text"
                maxLength={5}
                value={idInput}
                onChange={(e) => setIdInput(e.target.value.replace(/[^0-9A-Z]/ig, ''))}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 focus:bg-slate-900 transition-all font-medium uppercase font-mono tracking-wider"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-black rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/15"
            >
              {saveStatus === 'saving' ? (
                 <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full"
                  />
              ) : saveStatus === 'saved' ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{language === 'uz' ? "Saqlandi!" : "Saved!"}</span>
                </>
              ) : (
                <span>{language === 'uz' ? "Saqlash" : "Save Changes"}</span>
              )}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-rose-950/10 border border-rose-900/30 rounded-3xl p-6 md:p-8 space-y-6 backdrop-blur-md">
          <div className="flex items-center gap-3 border-b border-rose-900/30 pb-4">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-rose-400">
                {language === 'uz' ? "Xavfli Hudud" : "Danger Zone"}
              </h2>
              <p className="text-xs text-rose-500/70">
                {language === 'uz' ? "Hisobni o'chirish yoki profilni yangilash" : "Delete data or reset profile"}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <button
              onClick={onResetData}
              className="w-full py-3.5 bg-slate-900 hover:bg-rose-950/50 text-rose-400 border border-slate-800 hover:border-rose-900 transition-all font-bold text-sm rounded-xl flex items-center justify-center space-x-2 group"
            >
              <Trash2 className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span>{language === 'uz' ? "Hisobni boshidan boshlash" : "Reset Account & Data"}</span>
            </button>

            <button
              onClick={onSignOut}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all font-bold text-sm rounded-xl flex items-center justify-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>{language === 'uz' ? "Profildan chiqish" : "Sign Out"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
