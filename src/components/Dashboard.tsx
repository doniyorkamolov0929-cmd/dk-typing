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
  HelpCircle
} from 'lucide-react';

interface DashboardProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  history: TestHistoryEntry[];
  language: 'uz' | 'en';
  onClearHistoryTrigger: () => void;
  onPracticeProblemKeys: (keys: string[]) => void;
}

export default function Dashboard({
  profile,
  setProfile,
  history,
  language,
  onClearHistoryTrigger,
  onPracticeProblemKeys
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
          <span className="text-xs bg-slate-100 text-slate-800 font-bold px-3 py-1 bg-slate-200/50 rounded-full tracking-wide">
            {language === 'uz' ? 'O\'quvchi boshqaruv paneli' : 'Student control panel'}
          </span>
          <h2 className="text-2xl font-black text-slate-850 tracking-tight mt-1">
            {language === 'uz' 
              ? `Tanishganimizdan xursandmiz, ${profile.fullName || 'Do\'st'}!` 
              : `Welcome back, ${profile.fullName || 'Friend'}!`}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'uz' 
              ? "Ushbu sahifada sizning doimiy yutuqlaringiz, klaviatura tahlillari hamda yozish tarixi saqlanadi."
              : "Monitor your overall typing performance, key accuracy hotspots, and training sessions."}
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
