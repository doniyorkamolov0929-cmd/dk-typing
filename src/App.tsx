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
import ProfilePage from './components/ProfilePage';
import InteractiveOverlays from './components/InteractiveOverlays';
import MultiplayerRace from './components/MultiplayerRace';
import { THEMES } from './utils/theme';
import { auth, onAuthStateChanged, signOut, googleProvider, signInWithPopup, db } from './lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { loadUserProfile, loadUserHistory, saveUserProfile, saveUserHistory, mergeProfiles, pingOnlineStatus, updateGameRequest } from './lib/sync';

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
  const [activeTab, setActiveTab] = useState<'speedtest' | 'academy' | 'dashboard' | 'leaderboard' | 'profile'>('dashboard');
  
  // App language setting (uz = Uzbek, en = English) saved in localstorage
  const [language, setLanguage] = useState<'uz' | 'en'>('uz');

  // Multiplayer Room
  const [activeGameRoomId, setActiveGameRoomId] = useState<string | null>(null);

  // Custom trouble keys practice sequence
  const [practiceKeys, setPracticeKeys] = useState<string[] | null>(null);

  // Safe custom modals state - avoiding native sandbox-blocking confirm() popups
  const [showAccountResetModal, setShowAccountResetModal] = useState(false);
  const [showHistoryClearModal, setShowHistoryClearModal] = useState(false);

  // Prestige cycle achievement popup alerts
  const [showCycleUpgradeAlert, setShowCycleUpgradeAlert] = useState(false);

  // Load initial local config on mount
  useEffect(() => {
    const lang = localStorage.getItem('dk_lang_v2') as 'uz' | 'en' | null;
    if (lang) {
      setLanguage(lang);
    }

    const loadedProfile = getStoredProfile();
    const loadedHistory = getStoredHistory();
    setHistory(loadedHistory);

    if (loadedProfile.fullName) {
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

  // Sync state with Firebase Auth Status changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User authenticated with Google
        try {
          const remoteProfile = await loadUserProfile(firebaseUser.uid);
          const remoteHistory = await loadUserHistory(firebaseUser.uid);
          
          const localProfile = getStoredProfile();
          const localHistory = getStoredHistory();

          let finalProfile = remoteProfile
            ? mergeProfiles(localProfile, remoteProfile)
            : {
                ...localProfile,
                fullName: firebaseUser.displayName || localProfile.fullName,
              };

          // Set Google-specific credentials
          finalProfile = {
            ...finalProfile,
            uid: firebaseUser.uid,
            authType: 'google',
            email: firebaseUser.email || undefined,
            photoURL: firebaseUser.photoURL || undefined
          };

          // Merge history lists
          const historyMap = new Map<string, TestHistoryEntry>();
          [...remoteHistory, ...localHistory].forEach(item => {
            if (item?.id) {
              historyMap.set(item.id, item);
            }
          });
          const finalHistory = Array.from(historyMap.values()).sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          setProfile(finalProfile);
          saveStoredProfile(finalProfile);
          setHistory(finalHistory);
          saveStoredHistory(finalHistory);

          // Back up merged values back to the cloud database
          await saveUserProfile(firebaseUser.uid, finalProfile);
          await saveUserHistory(firebaseUser.uid, finalHistory);
        } catch (err) {
          console.warn("Cloud merge warning on auth state change:", err);
        }
      } else {
        // Logged out
        const localProfile = getStoredProfile();
        if (localProfile.authType === 'google') {
          // Switch active memory back to guest
          const guestProfile: UserProfile = {
            ...localProfile,
            uid: undefined,
            authType: 'guest',
            email: undefined,
            photoURL: undefined
          };
          setProfile(guestProfile);
          saveStoredProfile(guestProfile);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Presence Pinger
  useEffect(() => {
    if (profile?.uid && profile.authType === 'google') {
      // Ping immediately
      pingOnlineStatus(profile.uid);
      // Then every 30s
      const it = setInterval(() => pingOnlineStatus(profile.uid!), 30_000);
      return () => clearInterval(it);
    }
  }, [profile?.uid, profile?.authType]);

  // Save profile & sync to localStorage/cloud whenever it changes locally
  useEffect(() => {
    if (profile && profile.fullName) {
      saveStoredProfile(profile);

      // Trigger cloud upload if logged in with Google
      if (profile.uid && profile.authType === 'google') {
        saveUserProfile(profile.uid, profile);
      }

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

  // Sync history updates to the cloud if logged in
  useEffect(() => {
    if (profile && profile.uid && profile.authType === 'google' && history) {
      saveUserHistory(profile.uid, history);
    }
  }, [history, profile?.uid]);

  // Sync language with storage
  const handleSetLanguage = (lang: 'uz' | 'en') => {
    setLanguage(lang);
    localStorage.setItem('dk_lang_v2', lang);
  };

  const handleWelcomeComplete = (updatedProfile: UserProfile, initialHistory?: TestHistoryEntry[]) => {
    setProfile(updatedProfile);
    saveStoredProfile(updatedProfile);
    if (initialHistory) {
      setHistory(initialHistory);
      saveStoredHistory(initialHistory);
    }
    setActiveTab('dashboard');
  };

  // Google sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      const currentLocal = getStoredProfile();
      const guestProfile: UserProfile = {
        ...currentLocal,
        uid: undefined,
        authType: 'guest',
        email: undefined,
        photoURL: undefined
      };
      setProfile(guestProfile);
      saveStoredProfile(guestProfile);
    } catch (e) {
      console.warn("Sign out fail:", e);
    }
  };

  // Associate a guest user profile with a Google account (onboarded guests linking)
  const handleLinkGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user && profile) {
        const remoteProfile = await loadUserProfile(user.uid);
        const remoteHistory = await loadUserHistory(user.uid);

        let finalProfile = remoteProfile
          ? mergeProfiles(profile, remoteProfile)
          : { ...profile };

        finalProfile = {
          ...finalProfile,
          uid: user.uid,
          authType: 'google',
          email: user.email || undefined,
          photoURL: user.photoURL || undefined
        };

        const historyMap = new Map<string, TestHistoryEntry>();
        [...remoteHistory, ...history].forEach(item => {
          if (item?.id) {
            historyMap.set(item.id, item);
          }
        });
        const finalHistory = Array.from(historyMap.values()).sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setProfile(finalProfile);
        saveStoredProfile(finalProfile);
        setHistory(finalHistory);
        saveStoredHistory(finalHistory);

        // Upload merged state to Firebase
        await saveUserProfile(user.uid, finalProfile);
        await saveUserHistory(user.uid, finalHistory);
      }
    } catch (error) {
      console.warn("Could not link Google account (user may have closed popup):", error);
    }
  };

  // Safe History recording
  const handleSaveHistory = (entry: Omit<TestHistoryEntry, 'id' | 'date'>) => {
    const updated = addHistoryEntry(entry);
    setHistory(updated);
  };

  const handleUpdateProfileData = async (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    saveStoredProfile(updatedProfile);
    if (updatedProfile.uid && updatedProfile.authType === 'google') {
      await saveUserProfile(updatedProfile.uid, updatedProfile);
    }
  };

  // Safe profile clear operation (Hard reset)
  const handleProfileHardReset = async () => {
    if (auth.currentUser) {
      await signOut(auth);
    }
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
    return (
      <WelcomeModal 
        onComplete={handleWelcomeComplete} 
        language={language}
        setLanguage={handleSetLanguage}
      />
    );
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
        onSignOut={handleSignOut}
      />

      {/* 2. Primary Page workspace render views */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto print:p-0">
        <div className="max-w-5xl mx-auto">
          {activeGameRoomId ? (
            <MultiplayerRace
              profile={profile}
              language={language}
              roomId={activeGameRoomId}
              onLeave={() => setActiveGameRoomId(null)}
            />
          ) : (
            <>
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
                  onLinkGoogle={handleLinkGoogle}
                />
              )}

              {activeTab === 'leaderboard' && (
                <Leaderboard
                  profile={profile}
                  language={language}
                  onLinkGoogle={handleLinkGoogle}
                />
              )}

              {activeTab === 'profile' && (
                <ProfilePage
                  profile={profile}
                  language={language}
                  onProfileUpdate={handleUpdateProfileData}
                  onSignOut={handleSignOut}
                  onResetData={() => setShowAccountResetModal(true)}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Overlays */}
      <InteractiveOverlays profile={profile} language={language} onPlayMultiplayer={setActiveGameRoomId} />

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
