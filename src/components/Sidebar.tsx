/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Keyboard, 
  Award, 
  BarChart2, 
  Flame, 
  Star, 
  Download, 
  Globe, 
  User, 
  RotateCcw,
  Monitor,
  Smartphone,
  ChevronRight,
  Trophy,
  LogOut
} from 'lucide-react';
import { UserProfile } from '../types';
import { THEMES } from '../utils/theme';

interface SidebarProps {
  profile: UserProfile;
  activeTab: 'speedtest' | 'academy' | 'dashboard' | 'leaderboard' | 'profile';
  setActiveTab: (tab: 'speedtest' | 'academy' | 'dashboard' | 'leaderboard' | 'profile') => void;
  language: 'uz' | 'en';
  setLanguage: (lang: 'uz' | 'en') => void;
  onResetTrigger: () => void;
  onSignOut?: () => void;
}

export default function Sidebar({
  profile,
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  onResetTrigger,
  onSignOut
}: SidebarProps) {
  // PWA state tracking
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [guideTab, setGuideTab] = useState<'windows' | 'android' | 'ios'>('windows');

  useEffect(() => {
    // Check if the browser supports beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detect iOS safari environment
    const isApple = 
      /iPad|iPhone|iPod/.test(navigator.userAgent) && 
      !(window as any).MSStream;
    setIsIOS(isApple);
    if (isApple) {
      setGuideTab('ios');
    }

    // Check if already in standalone display mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    setShowInstallGuide(true);
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstallable(false);
          setDeferredPrompt(null);
        }
      } catch (_) {}
    }
  };

  const activeThemeId = profile.theme || 'classic';
  const theme = THEMES[activeThemeId] || THEMES.classic;

  return (
    <div className={`w-full lg:w-80 ${theme.sidebarBg} text-white flex flex-col border-r border-slate-800 flex-shrink-0 transition-colors duration-300`}>
      
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Neon speedometer SVG logo */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 0 1 10 10c0 1-.3 2-.9 2.9M2.1 14.9C1.3 14 1 13 1 12A10 10 0 0 1 11.2 2"/>
              <circle cx="12" cy="12" r="1" />
              <path d="m11 12.5H3" />
              <path d="m12 12 4-6" strokeWidth="2.5"/>
            </svg>
          </div>
          <div>
            <span className="text-xl font-black bg-gradient-to-r from-white via-cyan-100 to-cyan-300 bg-clip-text text-transparent tracking-tight">
              DK-Typing
            </span>
            <span className="block text-[9px] font-mono text-cyan-400/80 tracking-widest uppercase">
              PROFESSIONAL
            </span>
          </div>
        </div>

        {/* Short language switch indicator bubble inside header */}
        <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setLanguage('uz')}
            className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${language === 'uz' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            UZ
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${language === 'en' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
          >
            EN
          </button>
        </div>
      </div>

      {/* User Mini Profile Information Block */}
      {profile.fullName && (
        <div className="mx-4 mt-6 p-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              {profile.photoURL ? (
                <img 
                  src={profile.photoURL} 
                  referrerPolicy="no-referrer" 
                  alt={profile.fullName} 
                  className="w-10 h-10 rounded-xl object-cover flex-shrink-0" 
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {profile.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
              )}
              <div className="overflow-hidden">
                <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-cyan-400">
                  {profile.authType === 'google' ? "Google" : "Mehmon"}
                </span>
                <p className="text-sm font-bold truncate text-white max-w-[135px]">
                  {profile.fullName}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/25 px-2 py-1.5 rounded-xl flex-shrink-0">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
              <span className="text-xs font-extrabold text-amber-400 font-mono">
                {profile.streak}
              </span>
            </div>
          </div>

          {/* Quick inline auth signout or signin links */}
          <button
            onClick={() => setActiveTab('profile')}
            className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-slate-800 transition-all rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center justify-center space-x-1.5 cursor-pointer mt-1"
          >
            <User className="w-3 h-3" />
            <span>{language === 'uz' ? "Profilga kirish" : "Go to Profile"}</span>
          </button>
        </div>
      )}

      {/* Primary Navigation Tabs */}
      <div className="p-4 flex-1 space-y-1.5 overflow-y-auto">
        <button
          onClick={() => setActiveTab('speedtest')}
          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all font-sans font-medium text-sm text-left group cursor-pointer ${activeTab === 'speedtest' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/10' : 'text-slate-300 hover:bg-slate-800/50'}`}
        >
          <div className="flex items-center space-x-3">
            <Keyboard className="w-5 h-5 flex-shrink-0" />
            <span>{language === 'uz' ? 'Tezlik Sinovi' : 'Speed test'}</span>
          </div>
          <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${activeTab === 'speedtest' ? 'text-slate-950' : 'text-slate-400'}`} />
        </button>

        <button
          onClick={() => setActiveTab('academy')}
          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all font-sans font-medium text-sm text-left group cursor-pointer ${activeTab === 'academy' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/10' : 'text-slate-300 hover:bg-slate-800/50'}`}
        >
          <div className="flex items-center space-x-3">
            <Award className="w-5 h-5 flex-shrink-0" />
            <div className="flex items-center space-x-2">
              <span>{language === 'uz' ? 'Klaviatura Akademiyasi' : 'Keyboard Academy'}</span>
              {profile.isAlternativeCycle && (
                <span className="text-[9px] bg-indigo-900 border border-indigo-700 text-indigo-200 px-1.5 py-0.5 rounded font-mono font-bold animate-pulse">
                  PRESTIGE
                </span>
              )}
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${activeTab === 'academy' ? 'text-slate-950' : 'text-slate-400'}`} />
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all font-sans font-medium text-sm text-left group cursor-pointer ${activeTab === 'dashboard' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/10' : 'text-slate-300 hover:bg-slate-800/50'}`}
        >
          <div className="flex items-center space-x-3">
            <BarChart2 className="w-5 h-5 flex-shrink-0" />
            <span>{language === 'uz' ? "Analitika va Statistika" : "Analytics & Board"}</span>
          </div>
          <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${activeTab === 'dashboard' ? 'text-slate-950' : 'text-slate-400'}`} />
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all font-sans font-medium text-sm text-left group cursor-pointer ${activeTab === 'leaderboard' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/10' : 'text-slate-300 hover:bg-slate-800/50'}`}
        >
          <div className="flex items-center space-x-3">
            <Trophy className="w-5 h-5 flex-shrink-0" />
            <span>{language === 'uz' ? "Reyting" : "Leaderboard"}</span>
          </div>
          <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${activeTab === 'leaderboard' ? 'text-slate-950' : 'text-slate-400'}`} />
        </button>

        {/* Stars counter item */}
        <div className="px-4 py-3.5 bg-slate-950/25 border border-slate-800/50 rounded-xl flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs text-slate-300 font-sans">
              {language === 'uz' ? "To'plangan Yulduzlar" : "Total Stars Earned"}
            </span>
          </div>
          <span className="text-sm font-extrabold text-amber-400 font-mono">
            {profile.totalStars} / 180 ⭐
          </span>
        </div>
      </div>

      {/* Windows and devices download card */}
      <div className="p-4 border-t border-slate-800">
        <div className="p-4 bg-gradient-to-br from-slate-950 to-slate-900 border border-cyan-500/20 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-start space-x-3">
            <div className="bg-slate-800/80 p-2 rounded-xl flex items-center justify-center text-cyan-400">
              <Monitor className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h5 className="text-xs font-extrabold text-white tracking-wide uppercase font-sans flex items-center space-x-1.5">
                <span>{language === 'uz' ? "Windowsga yuklab olish" : "Download for Windows"}</span>
              </h5>
              <p className="text-[11px] text-slate-400 leading-normal">
                {language === 'uz' 
                  ? "DK-Typing ilovasini kompyuterni o'ziga alohida dastur sifatida bepul o'rnating." 
                  : "Install DK-Typing as an offline application directly on your desktop device."}
              </p>
            </div>
          </div>

          <button
            id="install-pwa-button"
            onClick={handleInstallClick}
            className="w-full mt-3 py-2 bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow shadow-cyan-400/10"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'uz' ? "Ilovani O'rnatish" : "Install Applet"}</span>
          </button>
        </div>
      </div>

      {/* Profile Hard Reset Box footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
        <button
          id="profile-hard-reset-button"
          onClick={onResetTrigger}
          className="flex items-center space-x-2 hover:text-rose-400 transition-colors cursor-pointer py-1 text-[11px] uppercase tracking-wider font-mono font-bold"
        >
          <RotateCcw className="w-3.5 h-3.5 text-rose-400 animate-spin-reverse" />
          <span>{language === 'uz' ? "Hisobni Boshidan Boshlash" : "Reset entire profile"}</span>
        </button>

        <span className="font-mono text-[10px] text-slate-600">v2.1</span>
      </div>

      {/* Universal Install Guide Modal */}
      {showInstallGuide && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-[110] overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-xl w-full text-white space-y-6 shadow-2xl relative">
            
            {/* Close button */}
            <button 
              onClick={() => setShowInstallGuide(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-xl transition cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center space-y-1.5 pt-2">
              <div className="mx-auto w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-2xl flex items-center justify-center">
                <Download className="w-6 h-6 animate-bounce" />
              </div>
              <h4 className="text-xl font-black bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
                {language === 'uz' ? "DK-Typing Ilovasini O'rnatish (PWA)" : "Install DK-Typing App"}
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                {language === 'uz'
                  ? "DK-Typing ilovasini Windows kompyuteringiz yoki telefoningizga o'rnatib, uni alohida dastur ko'rinishida tezkor va oflayn ishlating!"
                  : "Install the app on Windows PC or mobile devices and turn it into a standalone offline desktop/mobile program!"}
              </p>
            </div>

            {/* Platform Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-1 rounded-2xl border border-slate-800">
              <button
                onClick={() => setGuideTab('windows')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${guideTab === 'windows' ? 'bg-cyan-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Windows (PC)</span>
                <span className="sm:hidden">Windows</span>
              </button>
              <button
                onClick={() => setGuideTab('android')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${guideTab === 'android' ? 'bg-cyan-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Android</span>
                <span className="sm:hidden">Android</span>
              </button>
              <button
                onClick={() => setGuideTab('ios')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer ${guideTab === 'ios' ? 'bg-cyan-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}`}
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.1 16.67C20.08 16.74 19.67 18.11 18.71 19.5M15.97 4.17C16.63 3.37 17.07 2.28 16.95 1C16 1.04 14.9 1.6 14.24 2.38C13.68 3.04 13.19 4.14 13.34 5.4C14.39 5.48 15.4 4.89 15.97 4.17Z" />
                </svg>
                <span className="hidden sm:inline">iOS (iPhone)</span>
                <span className="sm:hidden">iOS</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="bg-slate-950/40 border border-slate-800/85 p-4 rounded-2xl min-h-[160px] text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
              {guideTab === 'windows' && (
                <div className="space-y-3">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl text-xs flex items-start space-x-2">
                    <span className="text-base flex-shrink-0">⚠️</span>
                    <p className="leading-normal">
                      {language === 'uz'
                        ? "DIQQAT: Ushbu dastur hozirda brauzer ramkasi (iframe) ichida turganligi uchun uni bu yerdan to'g'ridan-to'g'ri o'rnatib bo'lmasligi mumkin. Bu cheklovni chetlab o'tish uchun avval ilovani Yangi Tabda ochib oling."
                        : "ATTENTION: Because you are viewing inside workspace/iframe limits, direct PWA trigger might be paused. To download and get the installation popup, please open the app in a New Tab first."}
                    </p>
                  </div>
                  
                  <div className="flex justify-center py-1">
                    <button
                      onClick={() => window.open(window.location.origin, '_blank')}
                      className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-black rounded-xl text-xs hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer flex items-center space-x-2"
                    >
                      <Globe className="w-4 h-4 text-slate-950" />
                      <span>{language === 'uz' ? "ILOVANI YANGI TABDA OCHISH" : "OPEN APP IN NEW TAB"}</span>
                    </button>
                  </div>

                  <div className="space-y-2 text-slate-350">
                    <p><strong className="text-cyan-400">1-qadam:</strong> {language === 'uz' ? "Yuqoridagi tugma orqali ilovani to'liq yangi tabda oching." : "Launch the app inside a new clean tab using the selector above."}</p>
                    <p><strong className="text-cyan-400">2-qadam:</strong> {language === 'uz' ? "Kompyuter (Windows) manzillar qatori (URL bar) o'ng sarlavhasidagi o'rnatish 🖥️ belgisini toping." : "On Windows, find the small install application icon on the right end of your URL bar."}</p>
                    <p><strong className="text-cyan-400">3-qadam:</strong> {language === 'uz' ? "U ustiga bosing va 'O'rnatish' (Install) tugmasini tanlang. Ilova desktopingizga alohida Windows programmasi kabi joylashadi." : "Click on it and press 'Install'. It compiles the standalone app on your desktop automatically!"}</p>
                  </div>
                </div>
              )}

              {guideTab === 'android' && (
                <div className="space-y-2 text-slate-350">
                  <p className="text-slate-200 font-bold">{language === 'uz' ? "Android tizimida o'rnatish:" : "On Android system:"}</p>
                  <p><strong className="text-cyan-400">1-qadam:</strong> {language === 'uz' ? "Qurilmangizda Google Chrome orqali ushbu saytni oching." : "Open this website on Google Chrome browser in your smartphone."}</p>
                  <p><strong className="text-cyan-400">2-qadam:</strong> {language === 'uz' ? "Telefoningiz o'ng tepasidagi 3 ta nuqta (menyu) darsligini bosing." : "Tap the horizontal 3-dots general settings button."}</p>
                  <p><strong className="text-cyan-400">3-qadam:</strong> {language === 'uz' ? "Ro'yxatdan 'Ilovani o'rnatish' (Install app) yoki 'Ekran sahifasiga qo'shish' belgisini tanlang va tasdiqlang." : "Tap on 'Install App' or 'Add to home screen' and accept the confirmation prompt!"}</p>
                </div>
              )}

              {guideTab === 'ios' && (
                <div className="space-y-2 text-slate-350">
                  <p className="text-slate-200 font-bold">{language === 'uz' ? "iPhone va iPad qurilmalari yo'riqnomasi:" : "iPhone & iPad manual process:"}</p>
                  <p><strong className="text-cyan-400">1-qadam:</strong> {language === 'uz' ? "Ilovani mutlaqo Safari brauzeri orqali oching." : "Open the application specifically inside standard iOS Safari browser."}</p>
                  <p><strong className="text-cyan-400">2-qadam:</strong> {language === 'uz' ? "Pastki paneldagi 'Share' (Ulashish) 📤 belgisini bosing." : "Press the sharing icon 📤 from Safari's bottom toolbar."}</p>
                  <p><strong className="text-cyan-400">3-qadam:</strong> {language === 'uz' ? "Ochilgan ro'yxatdan 'Asosiy ekranga qo'shish' (Add to Home Screen) menyusiga kirib, yuqoridagi 'Qo'shish' (Add) tugmasini bosing." : "Scroll down the sharing sheet and choose 'Add to Home Screen' ➕ and confirm. It creates the direct icon on your Home screen."}</p>
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowInstallGuide(false)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition cursor-pointer border border-slate-700/50"
              >
                {language === 'uz' ? "Yopish" : "Close"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
