/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  getStoredProfile, 
  saveStoredProfile, 
  getStoredHistory, 
  saveStoredHistory, 
  addHistoryEntry, 
  calculateUpdatedStreak, 
  clearAllStorageData,
  INITIAL_PROFILE
} from './utils/storage';
import { UserProfile, TestHistoryEntry } from './types';
import WelcomeModal from './components/WelcomeModal';
import Sidebar from './components/Sidebar';
import SpeedTest from './components/SpeedTest';
import Academy from './components/Academy';
import Dashboard from './components/Dashboard';
import Leaderboard from './components/Leaderboard';
import { THEMES } from './utils/theme';

import { 
  AlertTriangle, 
  RotateCcw,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Award
} from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<TestHistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'speedtest' | 'academy' | 'dashboard' | 'leaderboard'>('dashboard');
  
  // App language setting (uz = Uzbek, en = English) saved in localstorage
  const [language, setLanguage] = useState<'uz' | 'en'>('uz');

  // Custom trouble keys practice sequence
  const [practiceKeys, setPracticeKeys] = useState<string[] | null>(null);

  // Safe custom modals state - avoiding native sandbox-blocking confirm() popups
  const [showAccountResetModal, setShowAccountResetModal] = useState(false);
  const [showHistoryClearModal, setShowHistoryClearModal] = useState(false);

  // Prestige cycle achievement popup alerts
  const [showCycleUpgradeAlert, setShowCycleUpgradeAlert] = useState(false);

  // Load profile and history on mount
  useEffect(() => {
    const isNew = localStorage.getItem('dk_lang_v2') as 'uz' | 'en' | null;
    if (isNew) {
      setLanguage(isNew);
    }

    const loadedProfile = getStoredProfile();
    const loadedHistory = getStoredHistory();

    setHistory(loadedHistory);

    if (loadedProfile.fullName) {
      // Calculate daily streaks
      const streakCalc = calculateUpdatedStreak(loadedProfile.lastActiveDate, loadedProfile.streak);
      const updatedProfile = {
        ...loadedProfile,
        streak: streakCalc.streak,
        lastActiveDate: streakCalc.todayStr
      };
      setProfile(updatedProfile);
      saveStoredProfile(updatedProfile);
    } else {
      setProfile(loadedProfile);
    }
  }, []);

  // Save profile and sync to localStorage whenever it changes
  useEffect(() => {
    if (profile && profile.fullName) {
      saveStoredProfile(profile);

      // Check if they completed all 60 lessons of the cycle to prompt Prestige Cycle Mode!
      let allCompletedCount = 0;
      for (let i = 1; i <= 60; i++) {
        if ((profile.lessonStars[i.toString()] || 0) >= 1) {
          allCompletedCount++;
        }
      }
      
      // If completed all 60 lessons and NOT already on alt cycle, alert them of Prestige Mode!
      if (allCompletedCount === 60 && !profile.isAlternativeCycle) {
        setShowCycleUpgradeAlert(true);
      }
    }
  }, [profile]);

  // Sync language with storage
  const handleSetLanguage = (lang: 'uz' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('dk_lang_v2', lang);
  };

  const handleWelcomeComplete = (fullName: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const newProfile: UserProfile = {
      ...INITIAL_PROFILE,
      fullName,
      lastActiveDate: todayStr,
      streak: 1
    };
    setProfile(newProfile);
    saveStoredProfile(newProfile);
    setActiveTab('dashboard');
  };

  // Safe History recording
  const handleSaveHistory = (entry: Omit<TestHistoryEntry, 'id' | 'date'>) => {
    const updated = addHistoryEntry(entry);
    setHistory(updated);
  };

  // Safe profile clear operation (Hard reset)
  const handleProfileHardReset = () => {
    clearAllStorageData();
    setHistory([]);
    setProfile({ ...INITIAL_PROFILE });
    setActiveTab('dashboard');
    setShowAccountResetModal(false);
  };

  // Safe trial history clear
  const handleClearHistory = () => {
    saveStoredHistory([]);
    setHistory([]);
    setShowHistoryClearModal(false);
  };

  // Triggered targeted lessons practice based on keys heatmap
  const handlePracticeProblemKeys = (keys: string[]) => {
    setPracticeKeys(keys);
    setActiveTab('speedtest');
  };

  // Cancel keys practice sequence
  const handleClearPracticeKeys = () => {
    setPracticeKeys(null);
  };

  // Proceed with Elite Prestige cycle
  const handlePrestigeUpgrade = () => {
    if (profile) {
      const resetLessonsMap: Record<string, boolean> = {
        '1': true,
        '21': true,
        '41': true
      };
      
      const upgradedProfile: UserProfile = {
        ...profile,
        isAlternativeCycle: true,
        unlockedLessons: resetLessonsMap,
        lessonStars: {},
        lessonWpm: {},
        lessonAccuracy: {}
      };
      setProfile(upgradedProfile);
      setShowCycleUpgradeAlert(false);
      setActiveTab('academy');
    }
  };

  // Show onboarding modal if fullName not registered
  if (!profile || !profile.fullName) {
    return <WelcomeModal onComplete={handleWelcomeComplete} />;
  }

  // Dynamic Theme layout matching
  const activeThemeId = profile?.theme || 'classic';
  const themeConfig = THEMES[activeThemeId] || THEMES.classic;

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen ${themeConfig.appBg} font-sans transition-all duration-300`}>
      
      {/* 1. Sidebar Nav Section panel */}
      <Sidebar
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={handleSetLanguage}
        onResetTrigger={() => setShowAccountResetModal(true)}
      />

      {/* 2. Primary Page workspace render views */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto print:p-0">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'speedtest' && (
            <SpeedTest
              profile={profile}
              setProfile={setProfile}
              onSaveHistory={handleSaveHistory}
              language={language}
              practiceKeys={practiceKeys}
              clearPracticeKeys={handleClearPracticeKeys}
            />
          )}

          {activeTab === 'academy' && (
            <Academy
              profile={profile}
              setProfile={setProfile}
              onSaveHistory={handleSaveHistory}
              language={language}
            />
          )}

          {activeTab === 'dashboard' && (
            <Dashboard
              profile={profile}
              setProfile={setProfile}
              history={history}
              language={language}
              onClearHistoryTrigger={() => setShowHistoryClearModal(true)}
              onPracticeProblemKeys={handlePracticeProblemKeys}
            />
          )}

          {activeTab === 'leaderboard' && profile && (
            <Leaderboard
              profile={profile}
              language={language}
            />
          )}
        </div>
      </main>

      {/* SAFE CUSTOM CONFIRM MODAL: 1. Profile Account Hard Reset confirmation */}
      {showAccountResetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-150 shadow-2xl space-y-5 text-center">
            <div className="mx-auto w-12 h-12 bg-rose-50 border border-rose-200 text-rose-550 rounded-full flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-bold text-slate-900">
                {language === 'uz' ? "Hisobni Boshidan Boshlash?" : "Completely Reset Account?"}
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-normal">
                {language === 'uz' 
                  ? "Ushbu amalni ortga qaytarib bo'lmaydi! Ismingiz, erishgan barcha yulduzlaringiz, kunlik faollik chizig'ingiz, klaviatura xatolar tahlili va yozishlar tarixi butunlay yo'q qilinadi."
                  : "Caution! This action is irreversible. All of your custom stats, stars, streaks, trial history lists and profile name configurations will be erased."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                id="modal-confirm-profile-reset"
                onClick={handleProfileHardReset}
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl text-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{language === 'uz' ? "Ha, Butunlay O'chirish" : "Yes, Erase Profile"}</span>
              </button>
              <button
                onClick={() => setShowAccountResetModal(false)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition-all cursor-pointer"
              >
                {language === 'uz' ? "Bekor qilish" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAFE CUSTOM CONFIRM MODAL: 2. Trial histories list deletion confirmation */}
      {showHistoryClearModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-150 shadow-2xl space-y-5 text-center">
            <div className="mx-auto w-12 h-12 bg-rose-50 border border-rose-200 text-rose-550 rounded-full flex items-center justify-center text-rose-600">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h4 className="text-xl font-bold text-slate-900">
                {language === 'uz' ? "Natijalar Tarixini Tozalash?" : "Wipe Trial History?"}
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 leading-normal">
                {language === 'uz' 
                  ? "Klaviaturadagi barcha mashq va tezlik sinovi tarixiy hisobotlarini o'chirmoqchimisiz? Yulduzlar hamda darslar ochilishi saqlanib qoladi."
                  : "Are you sure you want to clear your keyboard trial statistics array? Your cumulative lesson stars and unlocks remain perfectly intact."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                id="modal-confirm-history-clear"
                onClick={handleClearHistory}
                className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl text-sm transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>{language === 'uz' ? "Ha, Tozalash" : "Yes, Purge History"}</span>
              </button>
              <button
                onClick={() => setShowHistoryClearModal(false)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition-all cursor-pointer"
              >
                {language === 'uz' ? "Bekor qilish" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETECTED ELITE COMPLETION MODE: 3. Prestige Cycle Upgrade Congratulations Banner Modal */}
      {showCycleUpgradeAlert && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white rounded-3xl p-6 md:p-8 max-w-lg w-full border border-cyan-500/30 shadow-2xl space-y-6 text-center relative overflow-hidden">
            
            {/* Spinning background neon radial */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-cyan-400 to-indigo-500 p-0.5 rounded-full flex items-center justify-center shadow-lg shadow-cyan-400/20">
              <div className="bg-slate-950 w-full h-full rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-cyan-400 animate-pulse fill-cyan-400" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-widest text-cyan-300 uppercase font-extrabold px-3 py-1 bg-cyan-900/40 border border-cyan-400/20 rounded-full">
                {language === 'uz' ? "CHOLG'U PRESTIJ YANGILANISHI" : "SUPREME ELITE PRESTIGE CYCLING"}
              </span>
              <h3 className="text-2xl font-black tracking-tight pt-2">
                {language === 'uz' ? "Oliy To'liq Muvaffaqiyat!" : "Supreme Academy Graduation!"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
                {language === 'uz' 
                  ? "Siz akademiya darslarining barcha 60 tasini muvaffaqiyatli yakunladingiz! Endi siz 'Prestij' rejimini faollashtirishingiz mumkin. Bu darslar matnini mutlaqo yangicha, murakkab dasturchi va IT formatidagi matnlarga o'zgartiradi."
                  : "Incredible mastery! You graduated all 60 base courses. Activating 'Prestige' cycle updates resets progression, granting you an entirely fresh, complex developer-focused alternative textbook matrix!"}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={handlePrestigeUpgrade}
                className="w-full py-4 bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-black rounded-2xl text-sm transition-all cursor-pointer shadow-lg hover:shadow-cyan-400/20 active:scale-95 flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4 text-slate-950" />
                <span>{language === 'uz' ? "Har dumlari bilan Prestijga o'tish ✨" : "Activate Elite Prestige Mode ✨"}</span>
              </button>
              <button
                onClick={() => setShowCycleUpgradeAlert(false)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold rounded-2xl text-xs transition-all cursor-pointer"
              >
                {language === 'uz' ? "Yo'q, keyinchalik sinab ko'raman" : "Later, keep current state"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
