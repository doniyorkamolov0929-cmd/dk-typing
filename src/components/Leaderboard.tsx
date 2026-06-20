/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Sparkles, 
  Search, 
  Plus, 
  Zap, 
  Star, 
  Flame, 
  Award, 
  TrendingUp, 
  RefreshCw, 
  X, 
  ChevronRight,
  UserPlus,
  Compass
} from 'lucide-react';
import { UserProfile } from '../types';
import { THEMES } from '../utils/theme';

interface LeaderboardProps {
  profile: UserProfile;
  language: 'uz' | 'en';
}

interface Competitor {
  id: string;
  fullName: string;
  wpm: number;
  totalStars: number;
  streak: number;
  isCustom?: boolean;
  isBot?: boolean;
  avatarColor: string;
}

// Honest non-lying target challenge bots for competitive practice calibration
const PRACTICE_BOTS: Competitor[] = [
  { id: 'bot-1', fullName: "🏆 Doniyor Kamolov (Asoschi)", wpm: 122, totalStars: 180, streak: 124, isBot: true, avatarColor: 'from-amber-500 to-yellow-500' },
  { id: 'bot-2', fullName: "⚡ Master Bot (Maqsadli tezlik)", wpm: 88, totalStars: 165, streak: 42, isBot: true, avatarColor: 'from-purple-500 to-indigo-500' },
  { id: 'bot-3', fullName: "🌱 Boshlang'ich Bot (Maqsadli tezlik)", wpm: 35, totalStars: 42, streak: 6, isBot: true, avatarColor: 'from-lime-500 to-green-500' },
];

export default function Leaderboard({ profile, language }: LeaderboardProps) {
  // Competitor state: default is empty (only the current user) to prevent deceptive fake listing!
  const [competitors, setCompetitors] = useState<Competitor[]>(() => {
    const saved = localStorage.getItem('dk_typing_rivals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {
        return [];
      }
    }
    return [];
  });

  // Track if practicing with system benchmark milestone bots is enabled
  const [showBots, setShowBots] = useState<boolean>(() => {
    return localStorage.getItem('dk_typing_show_bots') === 'true';
  });

  // Metric tab filter
  const [activeMetric, setActiveMetric] = useState<'stars' | 'wpm' | 'streak'>('stars');
  // Competitor search query text
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom competitor creation forms modal state
  const [showAddRivalModal, setShowAddRivalModal] = useState(false);
  const [newRivalName, setNewRivalName] = useState('');
  const [newRivalWpm, setNewRivalWpm] = useState(50);
  const [newRivalStars, setNewRivalStars] = useState(60);
  const [newRivalStreak, setNewRivalStreak] = useState(7);

  const activeThemeId = profile.theme || 'classic';
  const theme = THEMES[activeThemeId] || THEMES.classic;

  // Function to calculate user WPM metrics based on lesson and test completions
  const userTopWpm = useMemo(() => {
    let top = 15; // default fallback base rate
    // Check WPM in lessonStars
    Object.values(profile.lessonWpm).forEach(w => {
      if (w > top) top = w;
    });
    return top;
  }, [profile.lessonWpm]);

  // Merge current live user into the leaderboard
  const combinedLeaderboard = useMemo(() => {
    // Generate user item
    const userCompetitor: Competitor = {
      id: 'live-user-id',
      fullName: `${profile.fullName || (language === 'uz' ? "O'quvchi" : "Learner")} (Siz)`,
      wpm: userTopWpm,
      totalStars: profile.totalStars,
      streak: profile.streak,
      avatarColor: 'from-cyan-500 to-emerald-500'
    };

    const activeList = showBots ? [...competitors, ...PRACTICE_BOTS] : competitors;

    // Filter duplicates of user's name if any
    const listWithoutUser = activeList.filter(c => c.fullName.toLowerCase() !== (profile.fullName || '').toLowerCase());
    const merged = [userCompetitor, ...listWithoutUser];

    // Sort based on active metric
    return merged.sort((a, b) => {
      if (activeMetric === 'stars') {
        if (b.totalStars !== a.totalStars) return b.totalStars - a.totalStars;
        return b.wpm - a.wpm; // TIE breaker: Wpm
      } else if (activeMetric === 'wpm') {
        if (b.wpm !== a.wpm) return b.wpm - a.wpm;
        return b.totalStars - a.totalStars; // TIE breaker: Stars
      } else {
        if (b.streak !== a.streak) return b.streak - a.streak;
        return b.wpm - a.wpm; // TIE breaker: Wpm
      }
    });
  }, [competitors, showBots, profile, userTopWpm, activeMetric, language]);

  // Search filtered list
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return combinedLeaderboard;
    return combinedLeaderboard.filter(c => 
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [combinedLeaderboard, searchQuery]);

  // Get index/position of the active user
  const userRankIndex = useMemo(() => {
    return combinedLeaderboard.findIndex(c => c.id === 'live-user-id');
  }, [combinedLeaderboard]);

  // Find who is above the user to generate motivational battle cards
  const rivalAboveUser = useMemo(() => {
    if (userRankIndex > 0) {
      return combinedLeaderboard[userRankIndex - 1];
    }
    return null;
  }, [combinedLeaderboard, userRankIndex]);

  // Save competitors list
  const saveRivals = (updated: Competitor[]) => {
    setCompetitors(updated);
    localStorage.setItem('dk_typing_rivals', JSON.stringify(updated));
  };

  // Add custom rival handler
  const handleAddRival = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRivalName.trim()) return;

    const gradients = [
      'from-pink-500 to-rose-500',
      'from-purple-500 to-indigo-500',
      'from-blue-500 to-violet-500',
      'from-cyan-500 to-teal-500',
      'from-emerald-500 to-green-500',
      'from-yellow-400 to-orange-500',
      'from-indigo-500 to-rose-500'
    ];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];

    const newCompetitor: Competitor = {
      id: `custom-rival-${Date.now()}`,
      fullName: newRivalName.trim(),
      wpm: Number(newRivalWpm),
      totalStars: Number(newRivalStars),
      streak: Number(newRivalStreak),
      isCustom: true,
      avatarColor: randomGradient
    };

    const updated = [...competitors, newCompetitor];
    saveRivals(updated);

    // Reset fields
    setNewRivalName('');
    setNewRivalWpm(50);
    setNewRivalStars(60);
    setNewRivalStreak(7);
    setShowAddRivalModal(false);
  };

  // Reset rivals back to default list
  const handleResetRivals = () => {
    saveRivals([]);
    setShowBots(false);
    localStorage.setItem('dk_typing_show_bots', 'false');
  };

  // Podium (Top 3) elements derived from sorted combined list
  const podiumList = useMemo(() => {
    const list: (Competitor & { rank: number })[] = [];
    if (combinedLeaderboard[0]) list.push({ ...combinedLeaderboard[0], rank: 1 });
    if (combinedLeaderboard[1]) list.push({ ...combinedLeaderboard[1], rank: 2 });
    if (combinedLeaderboard[2]) list.push({ ...combinedLeaderboard[2], rank: 3 });
    return list;
  }, [combinedLeaderboard]);

  return (
    <div className="space-y-6 text-slate-100">
      
      {/* 1. Header Hero section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900/60 border border-slate-800/80 rounded-3xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1.5 text-left">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-mono tracking-wider text-cyan-400 uppercase font-bold">
            <Trophy className="w-3.5 h-3.5" />
            <span>{language === 'uz' ? "KASBIY REYTING VA MAHORAT" : "COMPETITIVE MASTERY BOARD"}</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            {language === 'uz' ? "Talabalar Reytingi" : "Leaderboard Matrix"}
          </h2>
          <p className="text-xs text-slate-450 max-w-xl">
            {language === 'uz'
              ? "Platformadagi barcha talabalarning o'rganish natijalari. Mashqlarni davom ettirib o'z reytingingizni oshiring!"
              : "Compare your performance with instructors and virtual coders globally in real-time."}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="add-custom-rival-btn"
            onClick={() => setShowAddRivalModal(true)}
            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black rounded-xl flex items-center space-x-2 cursor-pointer transition-all active:scale-95 shadow-lg shadow-cyan-500/15"
          >
            <UserPlus className="w-4 h-4" />
            <span>{language === 'uz' ? "Do'st qo'shish (Musobaqa)" : "Add Opponent"}</span>
          </button>

          <button
            onClick={handleResetRivals}
            title={language === 'uz' ? "Standart holatga qaytarish" : "Restore defaults"}
            className="p-2.5 bg-slate-950 hover:bg-slate-850 text-slate-400 rounded-xl border border-slate-800/80 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Motivational Goal Challenger Cards */}
      {rivalAboveUser && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-indigo-950/40 border border-cyan-500/20 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-left"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-xl text-cyan-400 shrink-0">
              <Zap className="w-6 h-6 animate-bounce text-cyan-400" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-extrabold px-2 py-0.5 bg-cyan-900/30 border border-cyan-400/25 rounded-md">
                {language === 'uz' ? "YANGI MARRA" : "UPCOMING OVERTAKE"}
              </span>
              <p className="text-xs sm:text-sm text-slate-200">
                {language === 'uz' ? (
                  <span>
                    Siz reytingda <strong>{userRankIndex + 1}-o'rinda</strong> turibsiz. Sizdan o'zib turgan <strong>{rivalAboveUser.fullName}</strong>-dan o'tib ketishingizga oz qoldi!
                  </span>
                ) : (
                  <span>
                    You are currently ranked <strong>#{userRankIndex + 1}</strong>. You are very close to overtaking <strong>{rivalAboveUser.fullName}</strong>!
                  </span>
                )}
              </p>
              <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-3">
                {activeMetric === 'stars' && (
                  <span>
                    🏆 {language === 'uz' ? "Farq" : "Gap"}: <strong>{rivalAboveUser.totalStars - profile.totalStars} {language === 'uz' ? "Ta yulduz" : "Stars"}</strong>
                  </span>
                )}
                {activeMetric === 'wpm' && (
                  <span>
                    ⚡ {language === 'uz' ? "Tezlik farqi" : "Speed gap"}: <strong>{rivalAboveUser.wpm - userTopWpm} WPM</strong>
                  </span>
                )}
                {activeMetric === 'streak' && (
                  <span>
                    🔥 {language === 'uz' ? "Kunlar farqi" : "Streak gap"}: <strong>{rivalAboveUser.streak - profile.streak} {language === 'uz' ? "kun" : "days"}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="shrink-0">
            <span className="text-xs bg-cyan-400/10 text-cyan-400 font-extrabold px-3 py-1.5 rounded-xl border border-cyan-400/20">
              {language === 'uz' ? "Harakat qiling! 🚀" : "Keep practicing! 🚀"}
            </span>
          </div>
        </motion.div>
      )}

      {/* 3. Luxurious 3D Podium Cards for Top 3 */}
      {podiumList.length > 0 && (
        <div className={podiumList.length === 1 
          ? "flex justify-center pt-5 max-w-md mx-auto w-full" 
          : "grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-5 max-w-4xl mx-auto"
        }>
          {/* Rank 2 (Silver) Podium rendering */}
          {podiumList.find(p => p.rank === 2) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="order-2 md:order-1 bg-slate-900/40 border border-slate-700/65 rounded-3xl p-5 text-center relative flex flex-col items-center justify-between"
              style={{ minHeight: '260px' }}
            >
              <div className="absolute top-3 left-3 bg-slate-800 text-slate-300 text-[10px] font-mono font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-slate-700/60 shadow">
                🥈 {language === 'uz' ? "2-O'RINDAGI" : "Rank 2"}
              </div>
              
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-350 to-slate-450 p-0.5 mt-4 shadow-lg">
                <div className="bg-slate-950 w-full h-full rounded-[14px] flex items-center justify-center text-white text-lg font-black">
                  {podiumList.find(p => p.rank === 2)?.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              </div>

              <div className="my-3 text-center space-y-1">
                <h4 className="font-black text-white text-base truncate max-w-[180px]">
                  {podiumList.find(p => p.rank === 2)?.fullName}
                </h4>
                <div className="flex items-center justify-center space-x-1 text-slate-400 font-mono text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="font-extrabold text-amber-500">{podiumList.find(p => p.rank === 2)?.totalStars}</span>
                  <span className="opacity-40">&bull;</span>
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-extrabold text-cyan-450">{podiumList.find(p => p.rank === 2)?.wpm} WPM</span>
                </div>
              </div>

              <div className="w-full bg-slate-900 border border-slate-800 py-1.5 rounded-xl text-[11px] font-mono text-slate-300 flex items-center justify-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{podiumList.find(p => p.rank === 2)?.streak} {language === 'uz' ? "kunlik seriya" : "days streak"}</span>
              </div>
            </motion.div>
          )}

          {/* Rank 1 (Gold) Podium rendering - Bigger, highlighted visual presence */}
          {podiumList.find(p => p.rank === 1) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="order-1 md:order-2 bg-gradient-to-b from-amber-950/20 to-slate-900/40 border-2 border-amber-500/50 rounded-3xl p-6 text-center relative flex flex-col items-center justify-between shadow-xl shadow-amber-500/5"
              style={{ minHeight: '300px' }}
            >
              <div className="absolute top-3 bg-gradient-to-r from-amber-500 to-yellow-450 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full shadow-lg flex items-center space-x-1 animate-pulse">
                <span>🥇</span>
                <span className="font-sans leading-none">{language === 'uz' ? "CHEMPION" : "CHAMPION"}</span>
              </div>
              
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-405 to-amber-700 p-0.5 mt-8 shadow-2xl">
                <div className="bg-slate-950 w-full h-full rounded-[14px] flex items-center justify-center text-white text-xl font-black relative">
                  {podiumList.find(p => p.rank === 1)?.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  <Sparkles className="w-4 h-4 text-amber-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
              </div>

              <div className="my-3 text-center space-y-1">
                <h4 className="font-black text-amber-300 text-lg truncate max-w-[210px] flex items-center justify-center gap-1">
                  <span>{podiumList.find(p => p.rank === 1)?.fullName}</span>
                </h4>
                <div className="flex items-center justify-center space-x-1.5 text-slate-300 font-mono text-sm pt-0.5">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="font-extrabold text-amber-400">{podiumList.find(p => p.rank === 1)?.totalStars}</span>
                  <span className="opacity-40">&bull;</span>
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-cyan-400">{podiumList.find(p => p.rank === 1)?.wpm} WPM</span>
                </div>
              </div>

              <div className="w-full bg-amber-500/10 border border-amber-500/20 py-2 rounded-xl text-xs font-mono text-amber-400 flex items-center justify-center space-x-1.5">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                <span className="font-bold">{podiumList.find(p => p.rank === 1)?.streak} {language === 'uz' ? "kunlik seriya" : "days streak"}</span>
              </div>
            </motion.div>
          )}

          {/* Rank 3 (Bronze) Podium rendering */}
          {podiumList.find(p => p.rank === 3) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="order-3 bg-slate-900/40 border border-slate-700/65 rounded-3xl p-5 text-center relative flex flex-col items-center justify-between"
              style={{ minHeight: '260px' }}
            >
              <div className="absolute top-3 left-3 bg-slate-800 text-amber-700 text-[10px] font-mono font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-slate-700/60 shadow">
                🥉 {language === 'uz' ? "3-O'RINDAGI" : "Rank 3"}
              </div>
              
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-805 p-0.5 mt-4 shadow-lg">
                <div className="bg-slate-950 w-full h-full rounded-[14px] flex items-center justify-center text-white text-lg font-black">
                  {podiumList.find(p => p.rank === 3)?.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              </div>

              <div className="my-3 text-center space-y-1">
                <h4 className="font-black text-white text-base truncate max-w-[180px]">
                  {podiumList.find(p => p.rank === 3)?.fullName}
                </h4>
                <div className="flex items-center justify-center space-x-1 text-slate-400 font-mono text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span className="font-extrabold text-amber-500">{podiumList.find(p => p.rank === 3)?.totalStars}</span>
                  <span className="opacity-40">&bull;</span>
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-extrabold text-cyan-450">{podiumList.find(p => p.rank === 3)?.wpm} WPM</span>
                </div>
              </div>

              <div className="w-full bg-slate-900 border border-slate-800 py-1.5 rounded-xl text-[11px] font-mono text-slate-300 flex items-center justify-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{podiumList.find(p => p.rank === 3)?.streak} {language === 'uz' ? "kunlik seriya" : "days streak"}</span>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* 4. Controls, filters, search and competitor grid listing */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-3xl p-6 space-y-6">
        
        {/* Navigation Tabs (Sorting metrics switches) & Search bar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex flex-wrap gap-1.5 text-slate-400">
            <button
              onClick={() => setActiveMetric('stars')}
              className={`px-4 py-2 text-xs font-black rounded-xl cursor-pointer transition-all flex items-center space-x-2 ${
                activeMetric === 'stars' ? 'bg-cyan-500 text-slate-950 shadow shadow-cyan-500/10' : 'hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'uz' ? "Yulduzlar bo'yicha" : "By stars"}</span>
            </button>
            <button
              onClick={() => setActiveMetric('wpm')}
              className={`px-4 py-2 text-xs font-black rounded-xl cursor-pointer transition-all flex items-center space-x-2 ${
                activeMetric === 'wpm' ? 'bg-cyan-500 text-slate-950 shadow shadow-cyan-500/10' : 'hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'uz' ? "Yozish tezligi (WPM)" : "By typing speed"}</span>
            </button>
            <button
              onClick={() => setActiveMetric('streak')}
              className={`px-4 py-2 text-xs font-black rounded-xl cursor-pointer transition-all flex items-center space-x-2 ${
                activeMetric === 'streak' ? 'bg-cyan-500 text-slate-950 shadow shadow-cyan-500/10' : 'hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'uz' ? "Faollik (Kunlar)" : "By active streak"}</span>
            </button>
          </div>

          {/* Search bar layout */}
          <div className="relative w-full xl:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={language === 'uz' ? "Talabalarni qidirish..." : "Search typists..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800/80 pl-10 pr-4 py-2.5 rounded-2xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Toggle options bar for full transparency & zero deception */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/35 border border-slate-850 p-4 rounded-2xl">
          <p className="text-xs text-slate-400 max-w-lg text-left">
            {language === 'uz' 
              ? "Reytingda faqat siz kiritgan haqiqiy do'stlar chiqadi. Qiyoslash uchun standart ko'rsatkichli botlarni yoqishingiz mumkin."
              : "Only you and peers you manually add will be visible. You can enable benchmark bots to gauge standards."}
          </p>
          <label className="flex items-center space-x-2.5 text-xs text-slate-300 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800/85 cursor-pointer hover:border-cyan-500/30 transition-all select-none shrink-0 font-sans font-semibold">
            <input
              type="checkbox"
              checked={showBots}
              onChange={(e) => {
                const checked = e.target.checked;
                setShowBots(checked);
                localStorage.setItem('dk_typing_show_bots', String(checked));
              }}
              className="accent-cyan-500 w-4 h-4 cursor-pointer"
            />
            <span>{language === 'uz' ? "Mashq Botlarini chiqarish (Taqqoslash)" : "Show standard benchmarking bots"}</span>
          </label>
        </div>

        {/* Competitor lists layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[10px] font-mono tracking-widest text-slate-500 uppercase">
                <th className="py-3 px-4 font-bold">{language === 'uz' ? "O'rin" : "Rank"}</th>
                <th className="py-3 px-4 font-bold">{language === 'uz' ? "Ism Familiya" : "Full name"}</th>
                <th className="py-3 px-4 font-bold">{language === 'uz' ? "Yozish Tezligi" : "Speed"}</th>
                <th className="py-3 px-4 font-bold">{language === 'uz' ? "Yulduzlar" : "Stars"}</th>
                <th className="py-3 px-4 font-bold">{language === 'uz' ? "Faollik silsilasi" : "Streak"}</th>
                <th className="py-3 px-4 font-bold">&nbsp;</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/45">
              {filteredList.map((competitor, idx) => {
                const isUser = competitor.id === 'live-user-id';
                const originalIndex = combinedLeaderboard.findIndex(c => c.id === competitor.id);
                const actualRank = originalIndex + 1;

                return (
                  <tr
                    key={competitor.id}
                    className={`group transition-colors ${
                      isUser
                        ? 'bg-cyan-500/5 hover:bg-cyan-500/10'
                        : 'hover:bg-slate-800/15'
                    }`}
                  >
                    {/* Position indexing */}
                    <td className="py-4 px-4 font-mono font-black text-sm text-slate-400">
                      {actualRank === 1 ? (
                        <span className="text-amber-400 text-base">🥇</span>
                      ) : actualRank === 2 ? (
                        <span className="text-slate-350 text-base">🥈</span>
                      ) : actualRank === 3 ? (
                        <span className="text-amber-650 text-base">🥉</span>
                      ) : (
                        <span>#{actualRank}</span>
                      )}
                    </td>

                    {/* Competitor Name with dynamic user bubble */}
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3 text-left">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${competitor.avatarColor} p-0.5 flex-shrink-0`}>
                          <div className="bg-slate-950 w-full h-full rounded-[10px] flex items-center justify-center text-xs font-black text-white">
                            {competitor.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <span className={`text-sm font-black transition-colors ${isUser ? 'text-cyan-400' : 'text-white'}`}>
                            {competitor.fullName}
                          </span>
                          {isUser && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 bg-cyan-400/10 border border-cyan-400/25 text-cyan-400 text-[9px] font-mono tracking-wider font-extrabold rounded uppercase leading-none">
                              {language === 'uz' ? 'Siz' : 'You'}
                            </span>
                          )}
                          {competitor.isCustom && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-350 text-[9px] font-mono tracking-wider font-extrabold rounded uppercase leading-none">
                              {language === 'uz' ? "Do'st" : "Friend"}
                            </span>
                          )}
                          {competitor.isBot && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[9px] font-mono tracking-wider font-extrabold rounded uppercase leading-none">
                              {language === 'uz' ? 'Tizim Boti' : 'System Bot'}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Typing WPM rate */}
                    <td className="py-4 px-4 font-mono">
                      <div className="text-sm font-black text-white">{competitor.wpm} WPM</div>
                      <div className="text-[10px] text-slate-500">{language === 'uz' ? "Oliy daraja" : "Best raw rate"}</div>
                    </td>

                    {/* Academy Stars progress count */}
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center space-x-1.5 font-mono text-sm font-extrabold text-amber-500">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>{competitor.totalStars}</span>
                      </div>
                    </td>

                    {/* Streaks active days count */}
                    <td className="py-4 px-4">
                      <div className="inline-flex items-center space-x-1.5 font-mono text-sm font-bold text-slate-300">
                        <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>{competitor.streak} {language === 'uz' ? "kun" : "days"}</span>
                      </div>
                    </td>

                    {/* Quick rival row controls */}
                    <td className="py-4 px-4 text-right">
                      {competitor.isCustom && (
                        <button
                          onClick={() => {
                            const updated = competitors.filter(c => c.id !== competitor.id);
                            saveRivals(updated);
                          }}
                          className="p-1 px-2.5 bg-slate-900 hover:bg-rose-950 hover:text-rose-400 text-slate-500 text-[10px] font-mono rounded-lg border border-slate-800 hover:border-rose-900 transition-all cursor-pointer"
                        >
                          {language === 'uz' ? "O'chirish" : "Remove"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center space-y-3">
                    <Compass className="w-10 h-10 text-slate-600 mx-auto stroke-1 animate-pulse" />
                    <p className="text-sm text-slate-400 font-medium">
                      {language === 'uz' ? "Sizning so'rovingizga mos talaba topilmadi." : "No matching competitors found."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Create Rival Modal Dialog Box */}
      {showAddRivalModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-cyan-400" />
                <h4 className="text-lg font-black text-white">
                  {language === 'uz' ? "Musobaqdosh Qo'shish" : "Add Competitor Rival"}
                </h4>
              </div>
              <button
                onClick={() => setShowAddRivalModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRival} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase">
                  {language === 'uz' ? "Ism Familiyasi" : "Opponent name"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Behruz Olimov"
                  value={newRivalName}
                  onChange={(e) => setNewRivalName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-850 p-3 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-slate-400 uppercase">
                    WPM (Yozish tezligi)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    value={newRivalWpm || ''}
                    onChange={(e) => setNewRivalWpm(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-850 p-3 rounded-xl text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-mono font-bold text-slate-400 uppercase">
                    {language === 'uz' ? "Yulduzlar" : "Stars Count"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="180"
                    value={newRivalStars || ''}
                    onChange={(e) => setNewRivalStars(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-850 p-3 rounded-xl text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-slate-400 uppercase">
                  {language === 'uz' ? "Kuchli Seriya (kunlar)" : "Active Streak Days"}
                </label>
                <input
                  type="number"
                  min="0"
                  max="365"
                  value={newRivalStreak || ''}
                  onChange={(e) => setNewRivalStreak(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-850 p-3 rounded-xl text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-900">
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:opacity-95 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer shadow-lg active:scale-97"
                >
                  {language === 'uz' ? "Saqlash va Musobaqadoshni kiritish" : "Save Competitor"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddRivalModal(false)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-350 font-bold text-xs rounded-xl border border-slate-800 transition-all cursor-pointer"
                >
                  {language === 'uz' ? "Bekor qilish" : "Cancel"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
