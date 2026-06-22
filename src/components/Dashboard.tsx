/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserProfile, TestHistoryEntry } from '../types';
import KeyboardHeatmap from './KeyboardHeatmap';
import { 
  Flame, 
  Star, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Trash2, 
  History, 
  AlertCircle,
  HelpCircle,
  Cloud,
  ShieldCheck
} from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  history: TestHistoryEntry[];
  language: 'uz' | 'en';
  onClearHistoryTrigger: () => void;
  onPracticeProblemKeys: (keys: string[]) => void;
  onLinkGoogle?: () => void;
}

export default function Dashboard({
  profile,
  setProfile,
  history,
  language,
  onClearHistoryTrigger,
  onPracticeProblemKeys,
  onLinkGoogle
}: DashboardProps) {

  // Helper: Format raw active seconds into proper humans readable HH:MM:SS string
  const formatTotalTime = (secondsTotal: number) => {
    if (!secondsTotal || secondsTotal <= 0) return "00:00:00";
    const hrs = Math.floor(secondsTotal / 3600);
    const mins = Math.floor((secondsTotal % 3600) / 60);
    const secs = secondsTotal % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  // Helper: Clean up fractional float durations and format cleanly in Uzbek / English
  const formatTestDuration = (secondsVal: number): string => {
    if (!secondsVal || secondsVal <= 0) {
      return language === 'uz' ? '0 soniya' : '0 seconds';
    }

    const s = Math.round(secondsVal);
    if (s < 60) {
      return language === 'uz' ? `${s} soniya` : `${s} seconds`;
    }

    const mins = Math.floor(s / 60);
    const remainingSecs = s % 60;

    if (remainingSecs === 0) {
      return language === 'uz' ? `${mins} Daqiqa` : `${mins} Minute(s)`;
    }

    return language === 'uz' 
      ? `${mins} Daqiqa ${remainingSecs} soniya` 
      : `${mins} Min ${remainingSecs} Sec`;
  };

  // Lifetime summaries calculations
  const totalEntries = history.length;
  const lifetimeAvgWpm = totalEntries > 0 
    ? Math.round(history.reduce((acc, h) => acc + h.wpm, 0) / totalEntries) 
    : 0;
  const lifetimeAvgAccuracy = totalEntries > 0 
    ? Math.round(history.reduce((acc, h) => acc + h.accuracy, 0) / totalEntries) 
    : 100;
  const lifetimeTotalSeconds = history.reduce((acc, h) => acc + h.durationSeconds, 0);

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto p-2">
      
      {/* 1. Header welcome brand */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs bg-slate-100 text-slate-800 font-bold px-3 py-1 bg-slate-200/50 rounded-full tracking-wide border border-slate-250/50">
              {language === 'uz' ? 'O\'quvchi boshqaruv paneli' : 'Student control panel'}
            </span>
            <span className="text-xs bg-cyan-150 text-cyan-800 border-cyan-200/50 font-bold px-3 py-1 bg-cyan-100/40 rounded-full tracking-wide border">
              {language === 'uz' ? 'Yaratuvchi: Doniyor Kamolov' : 'Created by: Doniyor Kamolov'}
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-850 tracking-tight mt-1.5/1">
            {language === 'uz' 
              ? `Tanishganimizdan xursandmiz, ${profile.fullName || 'Do\'st'}!` 
              : `Welcome back, ${profile.fullName || 'Friend'}!`}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'uz' 
              ? "Ushbu xavfsiz sahifada Doniyor Kamolov tomonidan taqdim etilgan doimiy yutuqlaringiz va klaviatura tahlillari saqlanadi."
              : "This workspace, designed by Doniyor Kamolov, tracks your secure performance records and keyboard accuracy hotspots."}
          </p>
        </div>

        {/* Global Streak Metrics Indicator */}
        <div className="flex items-center space-x-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-3xl shadow-md shrink-0">
          <Flame className="w-6 h-6 text-white animate-bounce" />
          <div className="text-left leading-tight">
            <span className="block text-[8px] tracking-wider uppercase opacity-80">
              {language === 'uz' ? "KUNLIK FAОLLIK CHIZIG'I" : "DAILY STREAK COUNTER"}
            </span>
            <span className="text-lg font-black font-mono">
              {profile.streak} kun ketma-ket 🔥
            </span>
          </div>
        </div>
      </div>

      {/* Cloud Sync Status Indicator Banner */}
      {profile.authType === 'google' ? (
        <div className="p-4 bg-emerald-50/70 border border-emerald-200/60 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black text-emerald-600 uppercase tracking-widest block">
                {language === 'uz' ? "BULUTLI SINXRONIZATSIYA FAOLLASHTIRILGAN" : "CLOUD REALTIME SYNC ACTIVE"}
              </span>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {language === 'uz' 
                  ? "Barcha natijalaringiz va yulduzlaringiz Doniyor Kamolov platformasi bulutiga xavfsiz saqlanmoqda. Boshqa telefondan yoki noutbukdan xuddi shu Google akkauntingiz orqali kirsangiz, barcha erishgan natijalaringiz avtomatik yuklanadi!"
                  : "Excellent! Your complete lessons progression and history entries are locked on Google Cloud. Log in on any other smartphone or desktop with your Google account to get your data instantly synced!"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-600 shrink-0 bg-white border border-emerald-200/50 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>CLOUD SAVED</span>
          </div>
        </div>
      ) : (
        <div className="p-5 bg-indigo-50/80 border border-indigo-200/70 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start space-x-3.5">
            <div className="w-11 h-11 bg-indigo-100/80 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
              <Cloud className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-black text-indigo-600 uppercase tracking-widest block">
                {language === 'uz' ? "SINOV REJIMIDAGI MEHMON" : "GUEST OFFLINE-ONLY EXPERIMENT"}
              </span>
              <h4 className="text-sm font-bold text-slate-800 tracking-tight mt-0.5">
                {language === 'uz' ? "Hozir boshqa telefondan kirsangiz natijalar ko'rinmaydi!" : "Login to view progress on other devices!"}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-normal max-w-xl">
                {language === 'uz' 
                  ? "Siz mehmon rejimidansiz. Natijalaringiz hozirgi noutbukingiz brauzeridagina saqlanadi. Istalgan qurilmadan kirish, ulkan yulduzlar yo'qolishining oldini olish uchun Google profilingizni bog'lang!"
                  : "You are practicing in guest mode on this device. Connecting your Google Account will permanently link your stats so you can log in on any phone or notebook seamlessly."}
              </p>
            </div>
          </div>
          
          {onLinkGoogle && (
            <button
              id="dashboard-link-google-btn"
              onClick={onLinkGoogle}
              className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl shadow-sm text-xs font-black tracking-wide flex items-center justify-center space-x-2 transition cursor-pointer shrink-0"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>{language === 'uz' ? "Google bilan Bog'lash" : "Link Google Account"}</span>
            </button>
          )}
        </div>
      )}

      {/* 2. Lifetime Highlights Metrics grids */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* WPM speed averages */}
        <div className="bg-white border border-slate-250/60 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="w-10 h-10 bg-cyan-50 border border-cyan-100 rounded-xl flex items-center justify-center text-cyan-600">
            <TrendingUp className="w-5 h-5 text-cyan-550" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">O'rtacha WPM</span>
            <span className="text-2xl font-black text-slate-900 font-mono block tracking-tight">
              {lifetimeAvgWpm} <span className="text-xs font-sans text-slate-500 font-normal">DSS</span>
            </span>
            <span className="text-[10px] text-slate-450 block font-normal">Umrbod tezlik o'rtachasi</span>
          </div>
        </div>

        {/* Accuracy averages */}
        <div className="bg-white border border-slate-250/60 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="w-10 h-10 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
            <CheckCircle className="w-5 h-5 text-emerald-555" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">O'rtacha Aniqlik</span>
            <span className="text-2xl font-black text-indigo-950 font-mono block tracking-tight">
              {lifetimeAvgAccuracy}%
            </span>
            <span className="text-[10px] text-slate-450 block font-normal">Harflar to'g'rilik foizi</span>
          </div>
        </div>

        {/* Stars sum metrics */}
        <div className="bg-white border border-slate-250/60 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-xl flex items-center justify-center text-amber-500">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Jami Yulduzlar</span>
            <span className="text-2xl font-black text-slate-900 font-mono block tracking-tight">
              {profile.totalStars} <span className="text-xs font-sans text-slate-500 font-normal">⭐</span>
            </span>
            <span className="text-[10px] text-slate-450 block font-normal">Akademiya yutuqlari</span>
          </div>
        </div>

        {/* Cumulative Typing Session duration HH:MM:SS */}
        <div className="bg-white border border-slate-250/60 rounded-3xl p-5 shadow-sm space-y-2">
          <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-500">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Yozish Vaqti</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono block tracking-tight">
              {formatTotalTime(lifetimeTotalSeconds)}
            </span>
            <span className="text-[10px] text-slate-450 block font-normal">Uzluksiz yozilgan muddat</span>
          </div>
        </div>
      </div>

      {/* 3. Keyboard precision Heatmap module layer mount */}
      <KeyboardHeatmap
        profile={profile}
        onPracticeProblemKeys={onPracticeProblemKeys}
      />

      {/* 4. Examination trials histories log section */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6 md:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <History className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-bold text-slate-850">
              O'quv Mashqlari va Sinov Imtihonlari Tarixi
            </h3>
          </div>

          {history.length > 0 && (
            <button
              id="clear-history-trigger-button"
              onClick={onClearHistoryTrigger}
              className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-650 text-slate-600 font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-all text-rose-500 border border-transparent hover:border-rose-200 cursor-pointer self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Natijalarni tozalash</span>
            </button>
          )}
        </div>

        {/* History table list */}
        {history.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-slate-150">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase text-[10px] tracking-wider">
                  <th className="px-5 py-3 text-left">SINOV MATN NOMI</th>
                  <th className="px-5 py-3 text-center">TEZLIK (WPM)</th>
                  <th className="px-5 py-3 text-center">TILING / IMLO SIFATI</th>
                  <th className="px-5 py-3 text-center">SINOV VAQTI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((h, index) => (
                  <tr key={h.id || index} className="hover:bg-slate-50/50 transition-all text-slate-700">
                    <td className="px-5 py-3.5 font-sans font-bold text-slate-850 text-xs sm:text-sm">
                      {h.name}
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-cyan-600">
                      {h.wpm} WPM
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${h.accuracy >= 95 ? 'bg-emerald-50 text-emerald-700' : (h.accuracy >= 85 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700')}`}>
                        {h.accuracy}% imlo
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center font-sans text-xs text-slate-500">
                      {formatTestDuration(h.durationSeconds)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-2 border border-dashed border-slate-200 rounded-2xl">
            <AlertCircle className="w-8 h-8 text-slate-300 animate-pulse" />
            <p className="text-sm font-semibold text-slate-500">
              Hozircha hech qanday natijalar mavjud emas.
            </p>
            <p className="text-xs text-slate-400 max-w-sm">
              Chap menyudan "Tezlik Sinovi" yoki "Klaviatura Akademiyasi" darslariga o'ting va birinchi imtihoningizni boshlang!
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
