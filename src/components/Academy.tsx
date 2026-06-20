/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  Lock, 
  Unlock, 
  Star, 
  ChevronRight, 
  RotateCcw, 
  ArrowLeft, 
  Cpu, 
  CheckCircle, 
  FileText, 
  Printer, 
  X,
  Keyboard,
  Globe,
  Flame,
  AlertCircle,
  Clock,
  Play
} from 'lucide-react';
import { LESSONS, Lesson, getLessonsByStage } from '../data/lessons';
import { UserProfile, TestHistoryEntry } from '../types';

interface AcademyProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onSaveHistory: (entry: Omit<TestHistoryEntry, 'id' | 'date'>) => void;
  language: 'uz' | 'en';
}

export default function Academy({
  profile,
  setProfile,
  onSaveHistory,
  language
}: AcademyProps) {
  const [selectedStage, setSelectedStage] = useState<'boshlangich' | 'orta' | 'mukammal'>('boshlangich');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Lesson interactive typing states
  const [charIndex, setCharIndex] = useState(0);
  const [typedStatuses, setTypedStatuses] = useState<('untyped' | 'correct' | 'incorrect')[]>([]);
  const [lessonTimerActive, setLessonTimerActive] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);

  // Active metrics
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [correctTyped, setCorrectTyped] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  // Refs for tracking up to date values in closures
  const totalTypedRef = useRef(0);
  const correctTypedRef = useRef(0);

  // Sync refs on state changes
  useEffect(() => {
    totalTypedRef.current = totalTyped;
  }, [totalTyped]);

  useEffect(() => {
    correctTypedRef.current = correctTyped;
  }, [correctTyped]);

  // Sound toggler
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Developer Bypass "Unlock All" Mode
  const [overrideUnlockAll, setOverrideUnlockAll] = useState(false);

  // Completed lesson results overlay
  const [showResultSheet, setShowResultSheet] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);

  // Selected certificate to render print view
  const [printCertificateStage, setPrintCertificateStage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const charSpanRef = useRef<HTMLSpanElement>(null);
  
  // Track focus status of Academy typing zone
  const [isFocused, setIsFocused] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sound buzzer play tone
  const playBeep = (freq: number, dur: number) => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setTimeout(() => {
        try {
          osc.stop();
          ctx.close();
        } catch (_) {}
      }, dur);
    } catch (_) {}
  };

  // Stage details definitions
  const stageDetails = {
    boshlangich: {
      nameUz: "Boshlang'ich Bosqich",
      nameEn: "Beginner Stage",
      accent: "from-cyan-500 to-blue-600",
      bgUz: "Uy qatoridan boshlab klaviaturadagi barcha asosiy harflarni qaramasdan yozish darslari.",
      bgEn: "Master home row characters, simple words, and alphabetical muscle memory.",
      lessonsRange: [1, 20]
    },
    orta: {
      nameUz: "O'rta Bosqich",
      nameEn: "Intermediate Stage",
      accent: "from-amber-500 to-orange-600",
      bgUz: "Katta harflar, tinish belgilari, hamda o'zbek tiliga xos bo'lgan o' va g' tovushlari.",
      bgEn: "Proper shifted capitals, common punctuation layouts, and longer prose sentences.",
      lessonsRange: [21, 40]
    },
    mukammal: {
      nameUz: "Mukammal Bosqich",
      nameEn: "Advanced Stage",
      accent: "from-purple-500 to-indigo-600",
      bgUz: "Raqamlar, qavslar, matematik belgilar hamda veb dasturchilar uchun HTML/CSS/JS kodlari.",
      bgEn: "Numerical strings, custom symbols, mathematical equations, and active developer code scripts.",
      lessonsRange: [41, 60]
    }
  };

  // Get active lessons with correct titles and text according to prestige cycle
  const currentLessons = LESSONS.filter(l => l.stage === selectedStage).map(lesson => {
    let text = language === 'uz' ? lesson.textUz : lesson.textEn;
    // Alternative text for Prestige Cycle
    if (profile.isAlternativeCycle) {
      text = language === 'uz' ? lesson.altTextUz : lesson.altTextEn;
    }
    return {
      ...lesson,
      text
    };
  });

  // Safe checks if a specific lesson ID is unlocked
  const isLessonUnlocked = (lessonId: number) => {
    if (overrideUnlockAll) return true;

    // First lessons of all 3 stages are absolutely unlocked as per user instruction!
    if (lessonId === 1 || lessonId === 21 || lessonId === 41) {
      return true;
    }

    // Otherwise, standard consecutive unlocking: is unlocked only if previous lesson ID has stars in profile
    const previousLessonId = lessonId - 1;
    const hasPassedPrev = (profile.lessonStars[previousLessonId.toString()] || 0) >= 1;
    
    return hasPassedPrev || !!profile.unlockedLessons[lessonId.toString()];
  };

  // Launch a selected lesson
  const startLesson = (lesson: { id: number; number: number; text: string; titleUz: string; titleEn: string; targetKeys: string; descriptionUz: string; descriptionEn: string }) => {
    setActiveLesson(lesson as any);
    setCharIndex(0);
    setTypedStatuses(new Array(lesson.text.length).fill('untyped'));
    setLessonTimerActive(false);
    setLessonFinished(false);
    setShowResultSheet(false);
    setElapsedSeconds(0);
    setTotalTyped(0);
    setCorrectTyped(0);
    setMistakes(0);
    
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = null;
    setStartTime(null);
  };

  // Close active lesson
  const closeLesson = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = null;
    setActiveLesson(null);
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Handle typing inside active lessons
  const handleLessonKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!activeLesson || lessonFinished) return;

    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }

    if (e.key === 'Backspace') {
      if (charIndex > 0) {
        const prevIdx = charIndex - 1;
        setCharIndex(prevIdx);
        setTypedStatuses(prev => {
          const updated = [...prev];
          updated[prevIdx] = 'untyped';
          return updated;
        });
        if (typedStatuses[prevIdx] === 'correct') {
          setCorrectTyped(c => Math.max(0, c - 1));
        }
      }
      return;
    }

    if (e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) {
      return;
    }

    // Launch timer on first char typed
    if (!lessonTimerActive && charIndex === 0) {
      setLessonTimerActive(true);
      setStartTime(Date.now());
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }

    const expectedChar = activeLesson.text[charIndex];
    const typedChar = e.key;

    // Track keyboard errors
    const expectedLetterUpper = expectedChar.toUpperCase();
    const isAlphabet = /^[A-Z;,.]$/.test(expectedLetterUpper);

    const updatedStatuses = [...typedStatuses];

    if (typedChar === expectedChar) {
      playBeep(440, 40);
      updatedStatuses[charIndex] = 'correct';
      setCorrectTyped(prev => prev + 1);

      if (isAlphabet) {
        setProfile(prev => {
          const totalMap = { ...prev.keyTotal };
          totalMap[expectedLetterUpper] = (totalMap[expectedLetterUpper] || 0) + 1;
          return { ...prev, keyTotal: totalMap };
        });
      }
    } else {
      playBeep(220, 80);
      updatedStatuses[charIndex] = 'incorrect';
      setMistakes(prev => prev + 1);

      if (isAlphabet) {
        setProfile(prev => {
          const totalMap = { ...prev.keyTotal };
          const errMap = { ...prev.keyErrors };
          totalMap[expectedLetterUpper] = (totalMap[expectedLetterUpper] || 0) + 1;
          errMap[expectedLetterUpper] = (errMap[expectedLetterUpper] || 0) + 1;
          return { ...prev, keyTotal: totalMap, keyErrors: errMap };
        });
      }
    }

    setTypedStatuses(updatedStatuses);
    setTotalTyped(prev => prev + 1);
    
    const nextIndex = charIndex + 1;
    setCharIndex(nextIndex);

    // Check if lesson is completed
    if (nextIndex >= activeLesson.text.length) {
      finishActiveLesson();
    }
  };

  // Conclude lesson
  const finishActiveLesson = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = null;
    setLessonTimerActive(false);
    setLessonFinished(true);

    const actualSeconds = startTime ? Math.round((Date.now() - startTime) / 1000) : elapsedSeconds;
    const finalMinutes = Math.max(0.01, actualSeconds / 60);
    const finalWpm = Math.max(0, Math.round((correctTypedRef.current / 5) / finalMinutes));
    const finalAccuracy = totalTypedRef.current > 0 ? Math.round((correctTypedRef.current / totalTypedRef.current) * 100) : 100;

    // Give stars based on accurate typing:
    // >= 95 -> 3 stars, 85-94 -> 2 stars, < 85 -> 1 star
    let computedStars = 1;
    if (finalAccuracy >= 95) computedStars = 3;
    else if (finalAccuracy >= 85) computedStars = 2;

    setEarnedStars(computedStars);

    // Update profile
    const lessonIdStr = activeLesson!.id.toString();
    const oldStars = profile.lessonStars[lessonIdStr] || 0;
    const starDiff = Math.max(0, computedStars - oldStars);

    setProfile(prev => {
      const updatedStarsMap = { ...prev.lessonStars, [lessonIdStr]: Math.max(oldStars, computedStars) };
      const updatedWpmMap = { ...prev.lessonWpm, [lessonIdStr]: Math.max(prev.lessonWpm[lessonIdStr] || 0, finalWpm) };
      const updatedAccMap = { ...prev.lessonAccuracy, [lessonIdStr]: Math.max(prev.lessonAccuracy[lessonIdStr] || 0, finalAccuracy) };
      
      // Auto unlock NEXT lesson ID immediately
      const nextLessonId = activeLesson!.id + 1;
      const updatedUnlocked = { ...prev.unlockedLessons };
      if (nextLessonId <= 60) {
        updatedUnlocked[nextLessonId.toString()] = true;
      }

      return {
        ...prev,
        totalStars: prev.totalStars + starDiff,
        lessonStars: updatedStarsMap,
        lessonWpm: updatedWpmMap,
        lessonAccuracy: updatedAccMap,
        unlockedLessons: updatedUnlocked
      };
    });

    // Save into history database
    onSaveHistory({
      wpm: finalWpm,
      accuracy: finalAccuracy,
      durationSeconds: elapsedSeconds,
      language: language,
      type: 'lesson',
      name: language === 'uz' 
        ? `${stageDetails[selectedStage].nameUz}: ${activeLesson!.number}-dars`
        : `${stageDetails[selectedStage].nameEn}: Lesson ${activeLesson!.number}`
    });

    setShowResultSheet(true);
  };

  // Advance to next progressive lesson inside active sequence
  const handleGoToNextLesson = () => {
    setShowResultSheet(false);
    const nextLessonId = activeLesson!.id + 1;
    if (nextLessonId <= 40 && selectedStage === 'boshlangich' && nextLessonId > 20) {
      // Crossed boundary to Intermediate stage, switch stages accordingly
      setSelectedStage('orta');
    } else if (nextLessonId <= 60 && selectedStage === 'orta' && nextLessonId > 40) {
      // Crossed boundary to Advanced stage
      setSelectedStage('mukammal');
    }

    const nextLessonRaw = LESSONS.find(l => l.id === nextLessonId);
    if (nextLessonRaw) {
      let text = language === 'uz' ? nextLessonRaw.textUz : nextLessonRaw.textEn;
      if (profile.isAlternativeCycle) {
        text = language === 'uz' ? nextLessonRaw.altTextUz : nextLessonRaw.altTextEn;
      }
      startLesson({ ...nextLessonRaw, text });
    } else {
      // Completed last lesson of 60
      setActiveLesson(null);
    }
  };

  // Scroll active elements nicely
  useEffect(() => {
    if (charIndex > 0 && charSpanRef.current) {
      charSpanRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }, [charIndex]);

  // Check if all 20 lessons of the selected stage are completed to unlock printable certification
  const isStageFullyCompleted = (stage: 'boshlangich' | 'orta' | 'mukammal') => {
    const range = stageDetails[stage].lessonsRange;
    for (let currentId = range[0]; currentId <= range[1]; currentId++) {
      const stars = profile.lessonStars[currentId.toString()] || 0;
      if (stars < 1) return false;
    }
    return true;
  };

  // Calculate Average statistics for printable SVG certificates
  const calculateStageAverages = (stage: 'boshlangich' | 'orta' | 'mukammal') => {
    const range = stageDetails[stage].lessonsRange;
    let totalWpm = 0;
    let totalAcc = 0;
    let count = 0;

    for (let currentId = range[0]; currentId <= range[1]; currentId++) {
      const wpm = profile.lessonWpm[currentId.toString()] || 0;
      const acc = profile.lessonAccuracy[currentId.toString()] || 0;
      totalWpm += wpm;
      totalAcc += acc;
      count++;
    }

    return {
      avgWpm: count > 0 ? Math.round(totalWpm / count) : 0,
      avgAccuracy: count > 0 ? Math.round(totalAcc / count) : 0
    };
  };

  // Print certificates
  const triggerCertificatePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2">
      
      {/* 1. Stage selection banners */}
      {!activeLesson && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-850 tracking-tight">
                🎓 {language === 'uz' ? "Klaviatura Akademiyasi" : "Keyboard Academy Course"}
              </h2>
              <p className="text-sm text-slate-500 max-w-xl">
                {language === 'uz' 
                  ? "Barcha 3 asosiy bosqichni to'liq ochib berdik. Istalgan darajadan mashqni boshlash erkinligiga egasiz!"
                  : "All 3 levels are accessible with absolute entry freedom. Start practicing exactly where you feel comfortable!"}
              </p>
            </div>

            {/* Unlock All cheat toggle buttons */}
            <div className="flex items-center space-x-3 bg-slate-100 p-2 rounded-2xl border border-slate-200">
              <Cpu className="w-5 h-5 text-indigo-600" />
              <div className="text-left">
                <span className="block text-[10px] font-black font-mono text-slate-400 uppercase">TEKSHIRUVCHILAR UCHUN</span>
                <span className="text-xs font-bold text-slate-700">Darslarni qo'shish qulfini echish</span>
              </div>
              <button
                id="developer-unlock-all-toggle"
                onClick={() => setOverrideUnlockAll(!overrideUnlockAll)}
                className={`px-3.5 py-1.5 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${overrideUnlockAll ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-300'}`}
              >
                {overrideUnlockAll ? "Echilgan ✅" : "Ochish (Cheat)"}
              </button>
            </div>
          </div>

          {/* Chronological Stage selector tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(['boshlangich', 'orta', 'mukammal'] as const).map(stage => {
              const active = selectedStage === stage;
              const details = stageDetails[stage];
              const completed = isStageFullyCompleted(stage);

              return (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`border p-5 rounded-3xl text-left transition-all relative overflow-hidden flex flex-col justify-between h-48 cursor-pointer ${active ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-102 ring-4 ring-cyan-500/10' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] uppercase font-mono tracking-widest font-extrabold px-2.5 py-1 rounded-md text-white bg-gradient-to-r ${details.accent}`}>
                        {stage === 'boshlangich' ? "BOSHLANG'ICH" : (stage === 'orta' ? "O'RTA" : "MUKAMMAL")}
                      </span>
                      {completed && (
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                          Bajarildi ✅
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black tracking-tight pt-1">
                      {language === 'uz' ? details.nameUz : details.nameEn}
                    </h3>
                    <p className={`text-xs leading-normal ${active ? 'text-slate-300' : 'text-slate-500'}`}>
                      {language === 'uz' ? details.bgUz : details.bgEn}
                    </p>
                  </div>

                  {/* Complete stars indicator metrics in badge */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-150/10 mt-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider opacity-60">
                      20 ta progressiv dars
                    </span>
                    <span className="text-xs font-bold text-amber-500 inline-flex items-center">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                      {(() => {
                        let stars = 0;
                        const r = details.lessonsRange;
                        for (let cur = r[0]; cur <= r[1]; cur++) {
                          stars += profile.lessonStars[cur.toString()] || 0;
                        }
                        return `${stars} / 60`;
                      })()}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Certificate reward banner card */}
          {isStageFullyCompleted(selectedStage) && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-indigo-900 to-slate-950 border border-cyan-500/30 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-cyan-500/10 border border-cyan-500/25 p-3 rounded-2xl text-cyan-400 mt-1 flex-shrink-0">
                  <Award className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold tracking-tight">Tabriklaymiz! Siz sertifikatga loyiq topildingiz!</h3>
                  <p className="text-xs text-slate-300 leading-normal max-w-xl">
                    Siz <strong className="text-cyan-400">{stageDetails[selectedStage].nameUz}</strong>-ning barcha 20 ta darsini to'liq yetuklik darajasida tugatdingiz. Maxsus SVG sertifikatni yuk yuklab oling.
                  </p>
                </div>
              </div>

              <button
                id="generate-stage-certificate-button"
                onClick={() => setPrintCertificateStage(selectedStage)}
                className="px-6 py-3.5 bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-900 font-extrabold text-sm rounded-2xl flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-cyan-400/10 shrink-0"
              >
                <FileText className="w-4 h-4 text-slate-900" />
                <span>Bosqich sertifikatini olish</span>
              </button>
            </motion.div>
          )}

          {/* Stage lessons list grid */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800">
              Bosqich darsliklar ro'yxati (1 - 20)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentLessons.map((lesson) => {
                const unlocked = isLessonUnlocked(lesson.id);
                const starsCount = profile.lessonStars[lesson.id.toString()] || 0;
                const topWpm = profile.lessonWpm[lesson.id.toString()] || 0;

                return (
                  <button
                    key={lesson.id}
                    id={`academy-lesson-card-${lesson.id}`}
                    disabled={!unlocked}
                    onClick={() => startLesson(lesson)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-36 transition-all group relative ${unlocked ? 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60 cursor-pointer' : 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed opacity-60'}`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono tracking-wider font-extrabold text-slate-400 group-hover:text-slate-600">
                          {lesson.number}-mashq
                        </span>
                        {unlocked ? (
                          <span className="text-cyan-600 text-xs flex items-center">
                            {starsCount > 0 ? (
                              <span className="text-amber-500 font-mono font-bold flex items-center gap-0.5 text-[11px]">
                                {[...Array(starsCount)].map((_, si) => <span key={si}>★</span>)}
                              </span>
                            ) : (
                              <Unlock className="w-3.5 h-3.5 opacity-40 text-slate-400" />
                            )}
                          </span>
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>

                      <h4 className={`text-sm font-black tracking-tight truncate ${unlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                        {language === 'uz' ? lesson.titleUz : lesson.titleEn}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        Tugmalar: {lesson.targetKeys}
                      </p>
                    </div>

                    {unlocked && topWpm > 0 && (
                      <div className="pt-2 border-t border-slate-200 mt-2 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span>Eng yuqori: </span>
                        <strong>{topWpm} WPM</strong>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* 2. Reading and typing section active drill */}
      {activeLesson && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Back to stage select card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex items-center justify-between">
            <button
              id="academy-lesson-exit-button"
              onClick={closeLesson}
              className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 font-semibold text-sm cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
              <span>Bosqich tanlashga qaytish</span>
            </button>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold block text-slate-400">
                {stageDetails[selectedStage].nameUz} &bull; {activeLesson.number}-dars
              </span>
              <h4 className="text-base font-black text-slate-800 tracking-tight">
                {language === 'uz' ? activeLesson.titleUz : activeLesson.titleEn}
              </h4>
            </div>
          </div>

          {/* Interactive Metrik Bar during test */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Live WPM speed */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 border border-indigo-950/20 shadow-sm flex items-center space-x-3.5">
              <div className="bg-slate-800 p-2.5 rounded-xl text-cyan-400">
                <ChevronRight className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block">Tezlik</span>
                <span className="text-xl font-extrabold tracking-tight font-mono text-cyan-200">
                  {(() => {
                    const pass = Math.max(0.01, elapsedSeconds / 60);
                    return Math.round((correctTyped / 5) / pass);
                  })()} <span className="text-xs font-sans text-slate-400">DSS</span>
                </span>
              </div>
            </div>

            {/* Live accuracy */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 border border-indigo-950/20 shadow-sm flex items-center space-x-3.5">
              <div className="bg-slate-800 p-2.5 rounded-xl text-emerald-400">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block">Aniqlik %</span>
                <span className="text-xl font-extrabold tracking-tight font-mono text-emerald-300">
                  {totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100}%
                </span>
              </div>
            </div>

            {/* Error mistakes count */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 border border-indigo-950/20 shadow-sm flex items-center space-x-3.5">
              <div className="bg-slate-800 p-2.5 rounded-xl text-rose-400">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block">Xatolar</span>
                <span className="text-xl font-extrabold tracking-tight font-mono text-rose-300">
                  {mistakes}
                </span>
              </div>
            </div>

            {/* Live time elapsed second calculator */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 border border-indigo-950/20 shadow-sm flex items-center space-x-3.5">
              <div className="bg-slate-800 p-2.5 rounded-xl text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block">Sarflangan Vaqt</span>
                <span className="text-xl font-extrabold tracking-tight font-mono text-amber-300">
                  {elapsedSeconds}s
                </span>
              </div>
            </div>
          </div>

          {/* Description of active lesson instructions guidance */}
          <div className="p-4 bg-indigo-50 border border-indigo-200/50 rounded-2xl text-left text-xs sm:text-sm text-indigo-900 leading-relaxed font-medium">
            💡 {language === 'uz' ? activeLesson.descriptionUz : activeLesson.descriptionEn}
          </div>

          {/* Core Interactive Typing Area */}
          {!lessonFinished ? (
            <div className="relative">
              <div
                id="academy-lesson-focus-zone"
                ref={containerRef}
                onKeyDown={handleLessonKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                tabIndex={0}
                className="w-full min-h-[160px] p-6 md:p-8 bg-slate-900 border border-slate-800 shadow-inner rounded-3xl outline-none focus:ring-4 focus:ring-cyan-500/10 text-slate-300 transition-all cursor-pointer relative overflow-hidden"
              >
                {/* Click-to-activate start overlay with explicit button */}
                {!isFocused && (
                  <div 
                    onClick={() => containerRef.current?.focus()}
                    className="absolute inset-0 z-10 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all duration-300"
                  >
                    <div className="bg-slate-900 border border-slate-700/50 p-6 rounded-3xl max-w-sm flex flex-col items-center shadow-2xl animate-fade-in">
                      <Play className="w-12 h-12 text-cyan-400 fill-cyan-400 animate-pulse mb-3" />
                      <h4 className="text-xl font-extrabold text-white uppercase tracking-wider mb-2">
                        {language === 'uz' ? "DARSNI BOSHLASH" : "ACTIVATE LESSON"}
                      </h4>
                      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                        {language === 'uz' 
                          ? "Yaxshi natija va barmoq masqlarini boshlash uchun ushbu oyna ustiga bosing yoki quyidagi tugmani kiriting."
                          : "Click the button below or anywhere inside this box to activate the keyboard and start typing."}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          containerRef.current?.focus();
                        }}
                        className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-black rounded-xl text-xs hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
                      >
                        {language === 'uz' ? "⚡ BOSHLASH (START)" : "⚡ START LESSON"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Custom Monospaced typography with whole-word wrapping */}
                <div className="text-2xl md:text-3xl font-mono leading-relaxed tracking-wider select-none text-slate-400 flex flex-wrap gap-y-2 whitespace-pre-wrap text-left antialiased">
                  {(() => {
                    // Segment text into whole words, bundling the space character at the end of each word.
                    // This is used for perfect non-splitting, word-by-word responsive text-wrapping layout.
                    const words: { id: number; chars: { char: string; absIndex: number }[] }[] = [];
                    let currentWord: { id: number; chars: { char: string; absIndex: number }[] } = { id: 0, chars: [] };
                    let wordId = 0;
                    
                    for (let i = 0; i < activeLesson.text.length; i++) {
                      const char = activeLesson.text[i];
                      currentWord.chars.push({ char, absIndex: i });
                      
                      if (char === ' ' || char === '\n') {
                        words.push(currentWord);
                        wordId++;
                        currentWord = { id: wordId, chars: [] };
                      }
                    }
                    
                    if (currentWord.chars.length > 0) {
                      words.push(currentWord);
                    }

                    return words.map((word) => (
                      <span key={word.id} className="inline-block whitespace-nowrap">
                        {word.chars.map(({ char, absIndex }) => {
                          let charClass = 'text-slate-400 transition-all';
                          let isCursor = absIndex === charIndex;

                          if (absIndex < charIndex) {
                            charClass = typedStatuses[absIndex] === 'correct' 
                              ? 'text-emerald-400 font-semibold bg-emerald-500/10 rounded-sm' 
                              : 'text-rose-500 bg-rose-500/15 rounded-sm px-0.5 border border-rose-500/30';
                          }

                          return (
                            <span
                              key={absIndex}
                              ref={isCursor ? charSpanRef : null}
                              className={`relative inline-block ${charClass} ${isCursor ? 'text-white border-b-2 border-cyan-400' : ''}`}
                              style={{ minWidth: char === ' ' ? '12px' : 'auto' }}
                            >
                              {isCursor && (
                                <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan-400 animate-pulse h-full" />
                              )}
                              {char}
                            </span>
                          );
                        })}
                      </span>
                    ));
                  })()}
                </div>
              </div>
            </div>
          ) : (
            /* Result assessment sheet after completing dars */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-slate-200 p-8 rounded-3xl shadow-lg text-center space-y-6"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-500">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-3xl font-black text-slate-800 tracking-tight">Dars yakunlandi!</h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Siz ushbu mashg'ulotni muvaffaqiyatli topshirdingiz. Quyida erishgan natijangiz ko'rsatkichlari berildi.
                </p>
              </div>

              {/* Dynamic 3 stars visual effect */}
              <div className="flex justify-center space-x-3 text-4xl">
                {[1, 2, 3].map(starNum => (
                  <span
                    key={starNum}
                    className={`transition-all duration-500 transform ${starNum <= earnedStars ? 'text-amber-500 scale-115 text-gold-glow animate-bounce' : 'text-slate-200'}`}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Stat metrics cards bento blocks */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-xl mx-auto">
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Tezlik</span>
                  <span className="text-2xl font-black text-slate-900 font-mono">
                    {(() => {
                      const finalMinutes = Math.max(0.01, elapsedSeconds / 60);
                      return Math.round((correctTyped / 5) / finalMinutes);
                    })()} <span className="text-xs font-sans text-slate-400">WPM</span>
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Aniqlik</span>
                  <span className="text-2xl font-black text-slate-900 font-mono">
                    {totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100}%
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Sinf balli</span>
                  <span className="text-2xl font-black text-slate-900 font-mono">
                    {earnedStars} yulduz
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Vaqt</span>
                  <span className="text-2xl font-black text-slate-900 font-mono">
                    {elapsedSeconds}s
                  </span>
                </div>
              </div>

              {/* Retry & Next course CTA items */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
                <button
                  id="academy-retry-lesson-button"
                  onClick={() => startLesson(activeLesson)}
                  className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-2xl transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4 shadow-sm" />
                  <span>Qaytadan urinish</span>
                </button>

                <button
                  id="academy-next-lesson-button"
                  onClick={handleGoToNextLesson}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-cyan-400 font-bold text-sm rounded-2xl transition-all cursor-pointer flex items-center justify-center space-x-2 shadow-lg"
                >
                  <span>Keyingi darsga o'tish</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

        </div>
      )}

      {/* 3. Printable High-fidelity CSS/SVG Certificate overlay view */}
      {printCertificateStage && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col overflow-y-auto p-4 md:p-8">
          
          {/* Action dialog sheet controls */}
          <div className="max-w-4xl mx-auto w-full flex items-center justify-between py-4 border-b border-white/10 text-white mb-6 print:hidden">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-cyan-400 animate-pulse" />
              <span className="text-base font-bold">Bitiruv Sertifikatini chop etish / PDF olish</span>
            </div>

            <div className="flex items-center space-x-4">
              <button
                id="print-trigger-action-button"
                onClick={triggerCertificatePrint}
                className="px-5 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-2 cursor-pointer transition-transform"
              >
                <Printer className="w-4 h-4 text-slate-950" />
                <span>Printer / PDF formatda yuklash</span>
              </button>

              <button
                onClick={() => setPrintCertificateStage(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 p-2 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-200" />
              </button>
            </div>
          </div>

          {/* SVG Frame Document Layout print ready */}
          <div className="flex-1 flex items-center justify-center py-6">
            <div 
              id="graduation-certificate-document"
              className="bg-slate-950/40 p-4 md:p-8 rounded-3xl border-4 border-double border-cyan-500/40 max-w-4xl w-full text-white shadow-2xl relative overflow-hidden backdrop-blur-md font-sans print:border-none print:shadow-none print:p-0 print:bg-white print:text-black"
              style={{ minHeight: '600px' }}
            >
              {/* Radial neon circle stamps decor */}
              <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none print:hidden" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none print:hidden" />

              <div className="border border-cyan-500/20 p-8 md:p-12 text-center flex flex-col justify-between h-full space-y-8 print:border-slate-300">
                
                {/* Certificate header */}
                <div className="space-y-4">
                  <div className="flex justify-center">
                    {/* Glowing gold medal logo */}
                    <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 relative">
                      <Award className="w-10 h-10 text-cyan-400 fill-cyan-400" />
                      <div className="absolute -inset-1 rounded-full border border-cyan-400/20 animate-pulse pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h1 className="text-3xl font-black tracking-widest bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent uppercase print:text-slate-800">
                      YUTUQ SERTIFIKATI
                    </h1>
                    <p className="text-xs font-mono tracking-widest text-slate-450 uppercase uppercase">
                      DK-TYPING PROFESSIONAL KEYBOARD PLATFORM
                    </p>
                  </div>
                </div>

                {/* Main certification award line */}
                <div className="space-y-5">
                  <span className="text-xs text-slate-400 uppercase tracking-widest block font-medium">Ushbu hujjat tantanali ravishda topshiriladi:</span>
                  
                  <h2 className="text-3xl md:text-4.5xl font-black tracking-tight text-white underline decoration-2 decoration-cyan-400 underline-offset-8 print:text-slate-950">
                    {profile.fullName || "Ism Familiya"}
                  </h2>

                  <p className="text-sm md:text-base text-slate-300 max-w-xl mx-auto leading-relaxed print:text-slate-700">
                    Siz <strong className="text-cyan-400 print:text-indigo-900">{stageDetails[printCertificateStage as 'boshlangich'].nameUz}</strong>-ning barcha 20 ta darsidan iborat o'quv dasturini, barmoq ko'nikmalari hamda mushak xotirasi drill treninglarini a'lo darajaga yakunlab, professional va tezkor yozish qobiliyatini tasdiqlaganligingiz munosabati bilan taqdirlanasiz.
                  </p>
                </div>

                {/* Averaged progress statistic elements */}
                <div className="grid grid-cols-3 gap-4 border-t border-b border-cyan-500/20 py-4 max-w-lg mx-auto print:border-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">O'rtacha Tezlik</span>
                    <strong className="text-xl md:text-2xl text-cyan-400 font-mono print:text-indigo-950">
                      {calculateStageAverages(printCertificateStage as 'boshlangich').avgWpm} WPM
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Imlo Aniqligi</span>
                    <strong className="text-xl md:text-2xl text-emerald-400 font-mono print:text-indigo-950">
                      {calculateStageAverages(printCertificateStage as 'boshlangich').avgAccuracy}%
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Daraja</span>
                    <strong className="text-xs md:text-sm text-amber-400 uppercase font-extrabold block mt-1 print:text-indigo-950">
                      {printCertificateStage === 'boshlangich' ? "Boshlang'ich" : (printCertificateStage === 'orta' ? "O'rta" : "Mukammal")}
                    </strong>
                  </div>
                </div>

                {/* Verifier credentials footer lines */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-6 gap-6">
                  <div className="text-left space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase">Taqdim etilgan sana:</span>
                    <h5 className="text-xs text-slate-200 font-bold font-mono">
                      {new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </h5>
                  </div>

                  <div className="flex items-center space-x-3 bg-slate-900/60 p-3 rounded-2xl border border-white/5 print:hidden">
                    {/* Custom verification barcode / QR replica */}
                    <div className="w-10 h-10 bg-white p-1 rounded-lg">
                      <svg className="w-8 h-8 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="20" rx="2" />
                        <rect x="5" y="5" width="4" height="4" />
                        <rect x="15" y="5" width="4" height="4" />
                        <rect x="5" y="15" width="4" height="4" />
                        <path d="M15 15h4v4h-4z M10 10h4v4h-4z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <span className="block text-[8px] font-mono text-cyan-455">ID VA VERIFIKATSIYA</span>
                      <span className="text-[10px] font-mono text-slate-400 block tracking-widest uppercase">
                        DK-CERT-{printCertificateStage.toUpperCase()}-{Math.floor(1000 + Math.random() * 9000)}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
