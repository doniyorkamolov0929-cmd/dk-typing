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
import { saveLeaderboardEntry, getLeaderboardEntries, searchUserByAccountId, sendFriendRequest, getOnlineStatuses, sendGameRequest } from '../lib/sync';

interface LeaderboardProps {
  profile: UserProfile;
  language: 'uz' | 'en';
  onLinkGoogle?: () => Promise<void>;
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

export default function Leaderboard({ profile, language, onLinkGoogle }: LeaderboardProps) {
  // Competitor state: default is empty (only the current user) to prevent deceptive fake listing!
  const [competitors, setCompetitors] = React.useState<Competitor[]>(() => {
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

  // Load live students rankings from backend server to show users connected from other browsers/phones!
  const [liveStudents, setLiveStudents] = React.useState<Competitor[]>([]);
  const [onlineStatuses, setOnlineStatuses] = React.useState<Record<string, boolean>>({});

  // Track if practicing with system benchmark milestone bots is enabled
  const [showBots, setShowBots] = React.useState<boolean>(() => {
    return localStorage.getItem('dk_typing_show_bots') === 'true';
  });

  // Metric tab filter
  const [activeMetric, setActiveMetric] = React.useState<'stars' | 'wpm' | 'streak'>('stars');
  // Competitor search query text
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Custom competitor creation forms modal state
  const [showAddRivalModal, setShowAddRivalModal] = React.useState(false);
  const [friendSearchId, setFriendSearchId] = React.useState('');
  const [foundFriend, setFoundFriend] = React.useState<UserProfile | null>(null);
  const [searchStatus, setSearchStatus] = React.useState<'idle'|'searching'|'not_found'>('idle');
  const [requestStatus, setRequestStatus] = React.useState<'idle'|'sending'|'sent'>('idle');

  const activeThemeId = profile.theme || 'classic';
  const theme = THEMES[activeThemeId] || THEMES.classic;

  // Function to calculate user WPM metrics based on lesson and test completions
  const userTopWpm = React.useMemo(() => {
    let top = 15; // default fallback base rate
    // Check WPM in lessonStars
    Object.values(profile.lessonWpm).forEach(w => {
      if (w > top) top = w;
    });
    return top;
  }, [profile.lessonWpm]);

  // Master award exporter block
  const handleDownloadAwardImage = (tier: 'certificate' | 'diploma' | 'medal') => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1130;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw premium background gradient
    const gradient = ctx.createRadialGradient(800, 565, 100, 800, 565, 1000);
    if (tier === 'medal') {
      gradient.addColorStop(0, '#111827');
      gradient.addColorStop(1, '#020617');
    } else if (tier === 'diploma') {
      gradient.addColorStop(0, '#151c2c');
      gradient.addColorStop(1, '#050a15');
    } else {
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(1, '#020617');
    }
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ornament colors
    const primaryColor = tier === 'medal' ? '#e2e8f0' : tier === 'diploma' ? '#fbbf24' : '#22d3ee';
    const secondaryColor = tier === 'medal' ? '#94a3b8' : tier === 'diploma' ? '#d97706' : '#0891b2';

    // Borders
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

    // Decorative arcs
    const corners = [
      { x: 48, y: 48, sideX: 1, sideY: 1 },
      { x: canvas.width - 48, y: 48, sideX: -1, sideY: 1 },
      { x: 48, y: canvas.height - 48, sideX: 1, sideY: -1 },
      { x: canvas.width - 48, y: canvas.height - 48, sideX: -1, sideY: -1 },
    ];
    corners.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x + c.sideX * 30, c.y + c.sideY * 30, 30, 0, Math.PI * 2);
      ctx.closePath();
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Draw Stamp Seal
    ctx.beginPath();
    ctx.arc(800, 160, 64, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = primaryColor;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Inside seal ring
    ctx.beginPath();
    ctx.arc(800, 160, 56, 0, Math.PI * 2);
    ctx.closePath();
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Emblem char
    ctx.font = "bold 44px sans-serif";
    ctx.fillStyle = secondaryColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(tier === 'medal' ? "🎖️" : "★", 800, 160);

    // Label header
    ctx.fillStyle = '#94a3b8';
    ctx.font = "bold 16px monospace";
    ctx.letterSpacing = "6px";
    ctx.fillText("DK-TYPING PROFESSIONAL ACADEMY PLATFORM", 800, 270);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 58px sans-serif";
    const docTitle = tier === 'medal' ? "OLIY FAXRIY OLTIN MEDAL VARAQI" : tier === 'diploma' ? "YUKSAK AKADEMIYA DIPLOMI" : "KASBIY YUTUQ SERTIFIKATI";
    ctx.fillText(docTitle, 800, 350);

    // Subtitle
    ctx.fillStyle = primaryColor;
    ctx.font = "bold 18px monospace";
    ctx.fillText(tier === 'medal' ? "SUPREME ELITE INTUITIVE MASTER DECREE" : tier === 'diploma' ? "NIGHTINGALE ELITE GRADUATE HONOR" : "O'QUV DASTURI MUVAFFAQIYATLI YAKUNLANGANLIGI", 800, 400);

    // Solemn
    ctx.fillStyle = '#cbd5e1';
    ctx.font = "italic 18px sans-serif";
    ctx.fillText("Ushbu oliy va nufuzli maqom tantanali ravishda topshiriladi:", 800, 470);

    // Student name
    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 48px sans-serif";
    ctx.fillText(profile.fullName || "Taniqli O'quvchi", 800, 540);

    // Bar line
    ctx.fillStyle = primaryColor;
    ctx.fillRect(500, 565, 600, 4);

    // Body
    ctx.fillStyle = '#cbd5e1';
    ctx.font = "20px sans-serif";
    let textLines: string[] = [];
    if (tier === 'medal') {
      textLines = [
        `Siz platformadagi mashg'ulotlarning barcha murakkab va professional uzoq darajalarida`,
        `450 dan ortiq muqaddas oltin yulduzlarni to'liq to'plab, eng yuqori oliy natijalarni o'rnatdingiz.`,
        `DK-Typing Akademiyasi sizining ushbu favqulodda tirishqoqlik va cheksiz iqtidoringizni alohida tasdiqlaydi.`
      ];
    } else if (tier === 'diploma') {
      textLines = [
        `Siz platformadagi o'quv dasturlarida 360 dan ortiq oltin yulduzlarni to'plash baxtiga erishdingiz`,
        `va ushbu orqali platformaning nufuzli maxsus "Yuksak Akademiya Diplomi" g'olibiga aylandingiz.`,
        `Ushbu mukofot sizning yuqori uzoqlikdagi texnik mahorat va yuksak irodangiz haqiqiy namunasidir.`
      ];
    } else {
      textLines = [
        `Siz platformamizda 180 dan ortiq yulduzlarni muvaffaqiyatli to'plab, professional sertifikatga loyiq topildingiz.`,
        `Ushbu sertifikat sizning tezkor va sifatli mushak xotirangiz ko'rsatkichidan dalolat beruvchi`,
        `hamda kelgusi kasbiy mukammallikda xizmat qiladigan asosiy yutuqlaringizdan biri hisoblanadi.`
      ];
    }

    let startY = 620;
    textLines.forEach(l => {
      ctx.fillText(l, 800, startY);
      startY += 30;
    });

    // Draw Stats Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(500, 740, 600, 100, 16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Stats
    ctx.fillStyle = primaryColor;
    ctx.font = "bold 28px monospace";
    ctx.fillText(`${userTopWpm} WPM`, 610, 785);
    ctx.fillStyle = '#94a3b8';
    ctx.font = "12px sans-serif";
    ctx.fillText("SINOV TEZLIGI", 610, 815);

    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 15px sans-serif";
    ctx.fillText(tier === 'medal' ? "MEDALLI O'QUVCHI" : tier === 'diploma' ? "DIPLOM SOHIBI" : "SERTIFIKATLANGAN", 800, 785);
    ctx.fillStyle = '#94a3b8';
    ctx.font = "12px sans-serif";
    ctx.fillText(tier === 'medal' ? "OLTIN UNVON" : tier === 'diploma' ? "KATTA AKADEMIYA" : "BOSQICH KOMPLET", 800, 815);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = "bold 28px monospace";
    ctx.fillText(`${profile.totalStars} Stars`, 980, 785);
    ctx.fillStyle = '#94a3b8';
    ctx.font = "12px sans-serif";
    ctx.fillText("JAMI TO'PLANGAN", 980, 815);

    // Footer Dates & Signatures
    const dateFormatted = new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(dateFormatted, 250, 950);
    ctx.fillStyle = '#94a3b8';
    ctx.font = "12px sans-serif";
    ctx.fillText("TAQDIM ETILGAN SANA", 250, 980);

    const docID = `DK-${tier.toUpperCase().slice(0, 4)}-${Math.floor(10000 + Math.random() * 90000)}`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = "10px monospace";
    ctx.fillText(docID, 800, 955);
    ctx.fillText("Tasdiqlash: verify.dk-typing.uz / Doniyor Kamolov", 800, 975);

    ctx.fillStyle = '#fbbf24';
    ctx.font = "bold 18px cursive, serif";
    ctx.fillText("Doniyor Kamolov", 1350, 940);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(1200, 955);
    ctx.lineTo(1500, 955);
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = "12px sans-serif";
    ctx.fillText("PLATFORMA ASOSCHISI & DIREKTOR", 1350, 975);

    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${profile.fullName || "Oquvchi"}_DK-Typing_${tier === 'medal' ? "SupremeMedal" : tier === 'diploma' ? "Diplom" : "Sertifikat"}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    }
  };


  // Sync self telemetry stats to Firebase Firestore if logged in with Google
  React.useEffect(() => {
    if (profile.fullName && profile.authType === 'google' && profile.uid) {
      saveLeaderboardEntry(
        profile.uid,
        profile.fullName,
        userTopWpm,
        profile.totalStars,
        profile.streak
      ).catch(e => console.warn("Failed self score sync to Firestore:", e));
    }
  }, [profile.fullName, profile.id, profile.uid, profile.authType, profile.totalStars, profile.streak, userTopWpm]);

  // Load live rankings periodically from Firestore
  React.useEffect(() => {
    const fetchLiveRankings = async () => {
      try {
        const dataList = await getLeaderboardEntries();
        if (dataList && dataList.length > 0) {
          const gradients = [
            'from-emerald-500 to-teal-500',
            'from-pink-500 to-rose-500',
            'from-purple-500 to-indigo-500',
            'from-blue-500 to-violet-500',
            'from-cyan-500 to-teal-500',
            'from-yellow-400 to-orange-500'
          ];
          const myId = profile.uid || profile.id || 'live-user-id';
          const list = dataList
            .filter((u: any) => u.id !== myId) // don't repeat self
            .map((u: any, idx: number) => ({
              id: u.id,
              fullName: u.fullName,
              wpm: Number(u.wpm) || 0,
              totalStars: Number(u.totalStars) || 0,
              streak: Number(u.streak) || 0,
              avatarColor: gradients[idx % gradients.length],
              isCustom: false // real student
            }));
          setLiveStudents(list);

          const uids = list.map(u => u.id);
          const statuses = await getOnlineStatuses(uids);
          setOnlineStatuses(statuses);
        }
      } catch (e) {
        console.warn("Live profiles sync error:", e);
      }
    };

    fetchLiveRankings();
    const interval = setInterval(fetchLiveRankings, 10000);
    return () => clearInterval(interval);
  }, [profile.id, profile.uid]);

  // Merge current live user into the leaderboard
  const combinedLeaderboard = React.useMemo(() => {
    // Generate user item
    const userCompetitor: Competitor = {
      id: 'live-user-id',
      fullName: `${profile.fullName || (language === 'uz' ? "O'quvchi" : "Learner")} (Siz)`,
      wpm: userTopWpm,
      totalStars: profile.totalStars,
      streak: profile.streak,
      avatarColor: 'from-cyan-500 to-emerald-500'
    };

    const activeList = showBots 
      ? [...competitors, ...liveStudents, ...PRACTICE_BOTS] 
      : [...competitors, ...liveStudents];

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
  }, [competitors, liveStudents, showBots, profile, userTopWpm, activeMetric, language]);

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

  const handleSearchFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendSearchId || friendSearchId.length !== 5) return;
    setSearchStatus('searching');
    setFoundFriend(null);
    setRequestStatus('idle');
    try {
      const u = await searchUserByAccountId(friendSearchId);
      if (u) {
        setFoundFriend(u);
        setSearchStatus('idle');
      } else {
        setSearchStatus('not_found');
      }
    } catch {
      setSearchStatus('not_found');
    }
  };

  const handleSendFriendRequest = async () => {
    if (!foundFriend) return;
    setRequestStatus('sending');
    await sendFriendRequest(profile, foundFriend.accountId!);
    setRequestStatus('sent');
    setTimeout(() => {
      setShowAddRivalModal(false);
      setFoundFriend(null);
      setFriendSearchId('');
      setRequestStatus('idle');
    }, 2000);
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

        {profile.authType === 'google' && (
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
        )}
      </div>

      {profile.authType !== 'google' ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/40 border border-slate-800/80 p-8 md:p-12 rounded-3xl text-center space-y-6 max-w-2xl mx-auto relative overflow-hidden backdrop-blur-md"
        >
          {/* visual ornaments */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-500/20">
            <Trophy className="w-8 h-8 text-slate-950" />
          </div>

          <div className="space-y-3">
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {language === 'uz' ? "Reytingda Qatnashish va Ko'rish" : "Join the Live Board"}
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              {language === 'uz' ? (
                <span>
                  Siz hozirda <strong>Mehmon (Guest)</strong> hisobidan foydalanyapsiz.
                  <br className="hidden sm:block" />
                  Reytingni ko'rish, unda qatnashish va tizimdagi barcha talabalarning natijalarini ko'rish uchun Google hisobingiz orqali kiring!
                  <br /><br />
                  <span className="text-cyan-400 font-semibold text-xs py-1.5 px-3 bg-cyan-950/40 border border-cyan-500/20 rounded-xl inline-block mt-1">
                    🔒 Darslardagi barcha yulduzlar va natijalar mutlaqo o'chib ketmaydi hamda to'liq saqlanadi!
                  </span>
                </span>
              ) : (
                <span>
                  You are currently using a Guest account.
                  <br className="hidden sm:block" />
                  To view and participate in the live student rankings, please log in with your Google account.
                  <br /><br />
                  <span className="text-cyan-400 font-semibold text-xs py-1.5 px-3 bg-cyan-950/40 border border-cyan-500/20 rounded-xl inline-block mt-1">
                    🔒 All stars and achievements from lessons will be perfectly preserved!
                  </span>
                </span>
              )}
            </p>
          </div>

          <div className="pt-2">
            <button
              id="ranking-google-login-btn"
              onClick={onLinkGoogle}
              className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-black rounded-2xl flex items-center space-x-3 mx-auto cursor-pointer transition-all active:scale-95 shadow-xl shadow-cyan-500/10 text-xs uppercase tracking-wider"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.354 0 10.58-4.47 10.58-10.75 0-.725-.075-1.275-.175-1.965H12.24z"/>
              </svg>
              <span>{language === 'uz' ? "Google hisob bilan bog'lash" : "Connect with Google"}</span>
            </button>
          </div>
        </motion.div>
      ) : (
        <>
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
              ? "Reytingda tizimdan ro'yxatdan o'tgan barcha o'quvchilar chiqadi. Do'stlaringiz va o'zingizning o'rningizni solishtiring."
              : "All registered students appear on the leaderboard. Compare your ranking with your friends and peers."}
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
                          {(() => {
                            const isFriend = profile.friends?.includes(competitor.id);
                            if (isFriend) {
                              return (
                                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[9px] font-mono tracking-wider font-extrabold rounded uppercase leading-none shadow-[0_0_8px_rgba(99,102,241,0.2)]">
                                  {language === 'uz' ? "Do'st" : "Friend"}
                                </span>
                              );
                            }
                            if (competitor.isCustom && !isFriend) {
                               return (
                                <span className="ml-2 inline-flex items-center px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-350 text-[9px] font-mono tracking-wider font-extrabold rounded uppercase leading-none">
                                  {language === 'uz' ? "Kiritilgan" : "Custom"}
                                </span>
                               );
                            }
                            return null;
                          })()}
                          {competitor.isBot && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[9px] font-mono tracking-wider font-extrabold rounded uppercase leading-none">
                              {language === 'uz' ? 'Tizim Boti' : 'System Bot'}
                            </span>
                          )}
                          {/* Live connection dot */}
                          {!isUser && !competitor.isBot && !competitor.isCustom && (
                             <span className="ml-2 inline-flex items-center">
                               {onlineStatuses[competitor.id] ? (
                                  <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                  </span>
                               ) : (
                                  <span className="flex h-2 w-2 rounded-full bg-slate-700"></span>
                               )}
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
                      {profile.friends?.includes(competitor.id) && onlineStatuses[competitor.id] && (
                        <button
                          onClick={() => {
                            sendGameRequest(profile.uid!, profile.fullName, competitor.id);
                            alert(language === 'uz' ? "Chaqiriq yuborildi!" : "Challenge sent!");
                          }}
                          className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-[11px] font-black tracking-wide rounded-lg shadow-lg active:scale-95 transition-all"
                        >
                          {language === 'uz' ? "O'YNASH" : "PLAY"}
                        </button>
                      )}
                      {competitor.isCustom && (
                        <button
                          onClick={() => {
                            const updated = competitors.filter(c => c.id !== competitor.id);
                            saveRivals(updated);
                          }}
                          className="ml-2 p-1 px-2.5 bg-slate-900 hover:bg-rose-950 hover:text-rose-400 text-slate-500 text-[10px] font-mono rounded-lg border border-slate-800 hover:border-rose-900 transition-all cursor-pointer"
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
                <UserPlus className="w-5 h-5 text-cyan-400" />
                <h4 className="text-lg font-black text-white">
                  {language === 'uz' ? "Do'st Qo'shish (ID orqali)" : "Add Friend by ID"}
                </h4>
              </div>
              <button
                onClick={() => setShowAddRivalModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSearchFriend} className="space-y-4 pt-2">
              <div className="space-y-1.5 flex gap-2 items-end">
                <div className="flex-1 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-400 uppercase">
                    {language === 'uz' ? "Do'stingizning 5 xonali ID si" : "Friend's 5-digit ID"}
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    required
                    placeholder="Masalan: 12345"
                    value={friendSearchId}
                    onChange={(e) => setFriendSearchId(e.target.value.replace(/[^0-9A-Z]/ig, ''))}
                    className="w-full bg-slate-900 border border-slate-850 p-3.5 rounded-xl text-lg font-mono tracking-[0.5em] font-medium text-center text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 uppercase"
                  />
                </div>
                <button
                  type="submit"
                  disabled={searchStatus === 'searching' || friendSearchId.length !== 5}
                  className="px-6 py-3.5 bg-slate-800 hover:bg-cyan-500 hover:text-slate-900 text-slate-300 rounded-xl transition-all font-bold disabled:opacity-50 cursor-pointer"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {searchStatus === 'not_found' && (
              <div className="text-center p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <p className="text-rose-400 font-bold text-sm">
                  {language === 'uz' ? "Bunday ID li foydalanuvchi topilmadi!" : "User with this ID not found!"}
                </p>
              </div>
            )}

            {foundFriend && (
              <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-4 space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg text-lg">
                    {foundFriend.fullName.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-lg">{foundFriend.fullName}</h5>
                    <p className="text-cyan-400 text-xs font-mono">ID: {foundFriend.accountId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-sm mb-2">
                  <div className="bg-slate-900/50 rounded-lg p-2 border border-slate-800">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 mx-auto mb-1" />
                    <span className="font-bold text-white">{foundFriend.totalStars || 0}</span>
                  </div>
                  <div className="bg-slate-900/50 rounded-lg p-2 border border-slate-800">
                    <Flame className="w-4 h-4 text-rose-500 fill-rose-500 mx-auto mb-1" />
                    <span className="font-bold text-white">{foundFriend.streak || 0}</span>
                  </div>
                </div>

                <button
                  onClick={handleSendFriendRequest}
                  disabled={requestStatus !== 'idle'}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-black text-sm rounded-xl transition-all cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {requestStatus === 'sending' ? (
                     language === 'uz' ? "Jo'natilmoqda..." : "Sending..."
                  ) : requestStatus === 'sent' ? (
                     language === 'uz' ? "Taklif jo'natildi!" : "Request Sent!"
                  ) : (
                    language === 'uz' ? "Do'stlik taklifini jo'natish" : "Send Friend Request"
                  )}
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
      </>
      )}

      {/* 6. Star Progressions & Highly Elite Rewards Block */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden text-left mb-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[10px] font-mono tracking-widest uppercase font-extrabold">
            🎖️ TIERED ELITE REWARDS & PROGRESSION
          </div>
          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Professional Yulduzlar va Unvonlar Kechimi
          </h3>
          <p className="text-xs text-slate-400 max-w-xl">
            Siz mashqlardan to'plagan har bir oltin yulduzingiz sizni ulug'vor mukofotlarga va maxsus sertifikatlarga yaqinlashtiradi.
          </p>
        </div>

        {/* Global Total Stars Progress bar */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Akademiya bo'yicha jami progress:</span>
            <span className="text-sm font-bold text-amber-500 flex items-center gap-1 font-mono">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              {profile.totalStars} yulduz to'plandi
            </span>
          </div>

          {/* Elegant fluid progressive gauge */}
          <div className="w-full bg-slate-950 h-3.5 rounded-full overflow-hidden border border-slate-800/50 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-amber-500 to-indigo-505 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (profile.totalStars / 450) * 100)}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0 ⭐</span>
            <span>180 ⭐ Sertifikat</span>
            <span>360 ⭐ Diplom</span>
            <span>450+ ⭐ Supreme Oltin Medal</span>
          </div>
        </div>

        {/* Three Grid Cards for each elite Reward Tier */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Tier 1: Sertifikat (180 stars) */}
          <div className={`border p-5 rounded-2xl flex flex-col justify-between space-y-4 relative overflow-hidden backdrop-blur ${profile.totalStars >= 180 ? 'bg-slate-905/40 border-cyan-500/30' : 'bg-slate-950/20 border-slate-900 opacity-60'}`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/25 px-2.5 py-0.5 rounded-md">
                  180 YULDUZ MARRASI
                </span>
                {profile.totalStars >= 180 ? (
                  <span className="text-[10px] text-emerald-400 font-bold">Ochildi ✅</span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-bold">Qulflangan 🔒</span>
                )}
              </div>
              <h4 className="font-extrabold text-white text-base">Haqiqiy Kasbiy Sertifikat</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Akademiya darslari bo'yicha musofatli 180 yulduz yig'gandan so'ng topshiriladigan zamonaviy guvohnoma.
              </p>
            </div>

            <button
              id="download-award-certificate-180"
              disabled={profile.totalStars < 180}
              onClick={() => handleDownloadAwardImage('certificate')}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                profile.totalStars >= 180 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/10 hover:opacity-95' 
                  : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Sertifikatni Yuklash</span>
            </button>
          </div>

          {/* Tier 2: Diplom (360 stars) */}
          <div className={`border p-5 rounded-2xl flex flex-col justify-between space-y-4 relative overflow-hidden backdrop-blur ${profile.totalStars >= 360 ? 'bg-slate-905/40 border-amber-500/30' : 'bg-slate-950/20 border-slate-900 opacity-60'}`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-amber-500 bg-amber-950/40 border border-amber-500/25 px-2.5 py-0.5 rounded-md">
                  360 YULDUZ MARRASI
                </span>
                {profile.totalStars >= 360 ? (
                  <span className="text-[10px] text-emerald-400 font-bold">Ochildi ✅</span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-bold">Qulflangan 🔒</span>
                )}
              </div>
              <h4 className="font-extrabold text-white text-base">Yuksak Akademiya Diplomi</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Platformadagi barcha bosh va o'rta bosqichlarni to'g'ri o'zlashtirgan tajribali bitiruvchi uchun nufuzli diplom.
              </p>
            </div>

            <button
              id="download-award-diploma-360"
              disabled={profile.totalStars < 360}
              onClick={() => handleDownloadAwardImage('diploma')}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                profile.totalStars >= 360 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/10 hover:opacity-95' 
                  : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Oliy Diplomni Yuklash</span>
            </button>
          </div>

          {/* Tier 3: Supreme Oltin Medal (450+ stars) */}
          <div className={`border p-5 rounded-2xl flex flex-col justify-between space-y-4 relative overflow-hidden backdrop-blur ${profile.totalStars >= 450 ? 'bg-slate-905/40 border-indigo-500/30' : 'bg-slate-950/20 border-slate-900 opacity-60'}`}>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-indigo-400 bg-indigo-950/40 border border-indigo-500/25 px-2.5 py-0.5 rounded-md">
                  450 YULDUZ MAQOMI
                </span>
                {profile.totalStars >= 450 ? (
                  <span className="text-[10px] text-emerald-400 font-bold">Ochildi ✅</span>
                ) : (
                  <span className="text-[10px] text-slate-500 font-bold">Qulflangan 🔒</span>
                )}
              </div>
              <h4 className="font-extrabold text-white text-base">Oliy Medalli Faxriy Varaq</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dasturlash hamda klaviatura akademiyalarida barcha mashqlarni va professional darslarni to'liq tamomlagan master.
              </p>
            </div>

            <button
              id="download-award-medal-450"
              disabled={profile.totalStars < 450}
              onClick={() => handleDownloadAwardImage('medal')}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                profile.totalStars >= 450 
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/10 hover:opacity-95' 
                  : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Supreme Sharaf Varaqi</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}


