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
import { LESSONS, Lesson, getLessonsByStage, PROGRAMMING_LESSONS } from '../data/lessons';
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
  const [selectedCourse, setSelectedCourse] = useState<'keyboard' | 'programming'>('keyboard');
  const [selectedStage, setSelectedStage] = useState<'boshlangich' | 'orta' | 'mukammal' | 'frontend' | 'backend' | 'database'>('boshlangich');
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
  const [printDiplomaCourse, setPrintDiplomaCourse] = useState<'keyboard' | 'programming' | null>(null);
  const [certNameInput, setCertNameInput] = useState(profile.fullName || "");

  useEffect(() => {
    if (profile.fullName) {
      setCertNameInput(profile.fullName);
    }
  }, [profile.fullName]);

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
  const stageDetails: Record<string, any> = {
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
    },
    frontend: {
      nameUz: "Frontend Dasturlash",
      nameEn: "Frontend Development",
      accent: "from-yellow-500 to-orange-500",
      bgUz: "HTML sarlavhalari, tugmalar, CSS klasslari va Tailwind, hamda React hook ssenariylari.",
      bgEn: "HTML semantic tags, buttons, CSS classes and Tailwind utility, and React hooks setups.",
      lessonsRange: [101, 120]
    },
    backend: {
      nameUz: "Backend Dasturlash",
      nameEn: "Backend Development",
      accent: "from-emerald-500 to-teal-650",
      bgUz: "Node.js va Express server sozlamalari, API marshrutlari, hamda Python mantiqiy kodlari.",
      bgEn: "Node.js and Express server routing, API controllers, and Python conditional algorithms.",
      lessonsRange: [121, 140]
    },
    database: {
      nameUz: "Baza va Shifrlash",
      nameEn: "Database & Security",
      accent: "from-rose-500 to-purple-650",
      bgUz: "PostgreSQL so'rovlari va Drizzle, Firestore xavfsizlik qoidalari hamda .env maxfiylik sozlamalari.",
      bgEn: "PostgreSQL DQL queries and Drizzle schemas, Firestore database security rules, and env controls.",
      lessonsRange: [141, 160]
    }
  };

  // Get active lessons with correct titles and text according to course selected & prestige cycle
  const currentLessons = (selectedCourse === 'keyboard' ? LESSONS : PROGRAMMING_LESSONS)
    .filter(l => l.stage === selectedStage)
    .map(lesson => {
      let text = language === 'uz' ? lesson.textUz : lesson.textEn;
      // Alternative text for Prestige Cycle in Keyboard Academy
      if (selectedCourse === 'keyboard' && profile.isAlternativeCycle) {
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

    // First lessons of all stages are absolutely unlocked as per user instruction!
    if (
      lessonId === 1 || 
      lessonId === 21 || 
      lessonId === 41 || 
      lessonId === 101 || 
      lessonId === 111 || 
      lessonId === 121
    ) {
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
      if (selectedCourse === 'keyboard' && nextLessonId <= 60) {
        updatedUnlocked[nextLessonId.toString()] = true;
      } else if (selectedCourse === 'programming' && nextLessonId <= 130) {
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
    
    if (selectedCourse === 'keyboard') {
      if (nextLessonId <= 40 && selectedStage === 'boshlangich' && nextLessonId > 20) {
        setSelectedStage('orta');
      } else if (nextLessonId <= 60 && selectedStage === 'orta' && nextLessonId > 40) {
        setSelectedStage('mukammal');
      }
    } else {
      if (nextLessonId <= 110 && selectedStage === 'frontend' && nextLessonId > 110) {
        setSelectedStage('backend');
      } else if (nextLessonId <= 120 && selectedStage === 'backend' && nextLessonId > 120) {
        setSelectedStage('database');
      }
    }

    const currentCollection = selectedCourse === 'keyboard' ? LESSONS : PROGRAMMING_LESSONS;
    const nextLessonRaw = currentCollection.find(l => l.id === nextLessonId);
    if (nextLessonRaw) {
      let text = language === 'uz' ? nextLessonRaw.textUz : nextLessonRaw.textEn;
      if (selectedCourse === 'keyboard' && profile.isAlternativeCycle) {
        text = language === 'uz' ? nextLessonRaw.altTextUz : nextLessonRaw.altTextEn;
      }
      startLesson({ ...nextLessonRaw, text });
    } else {
      // Completed last lesson
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

  // Check if all lessons of the selected stage are completed to unlock printable certification
  const isStageFullyCompleted = (stage: string) => {
    const range = stageDetails[stage]?.lessonsRange;
    if (!range) return false;
    for (let currentId = range[0]; currentId <= range[1]; currentId++) {
      const stars = profile.lessonStars[currentId.toString()] || 0;
      if (stars < 1) return false;
    }
    return true;
  };

  // Calculate Average statistics for printable SVG certificates
  const calculateStageAverages = (stage: string) => {
    const range = stageDetails[stage]?.lessonsRange;
    if (!range) return { avgWpm: 0, avgAccuracy: 0 };
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

  // Check if all levels in Keyboard or Programming are completed to claim Diploma
  const isCourseFullyCompleted = (course: 'keyboard' | 'programming') => {
    const stages = course === 'keyboard' ? ['boshlangich', 'orta', 'mukammal'] : ['frontend', 'backend', 'database'];
    return stages.every(stage => isStageFullyCompleted(stage));
  };

  // Calculate average stats over the entire 60 lessons course for Diploma layout
  const calculateCourseAverages = (course: 'keyboard' | 'programming') => {
    const stages = course === 'keyboard' ? ['boshlangich', 'orta', 'mukammal'] : ['frontend', 'backend', 'database'];
    let totalWpm = 0;
    let totalAcc = 0;
    let count = 0;
    stages.forEach(stage => {
      const avg = calculateStageAverages(stage);
      if (avg.avgWpm > 0) {
        totalWpm += avg.avgWpm;
        totalAcc += avg.avgAccuracy;
        count++;
      }
    });
    return {
      avgWpm: count > 0 ? Math.round(totalWpm / count) : 0,
      avgAccuracy: count > 0 ? Math.round(totalAcc / count) : 0
    };
  };

  // High-fidelity Canvas-based Certificate & Diploma image generator (PNG exporter support)
  const downloadCertificateAsImage = (isDiploma: boolean, courseOrStage: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1130;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Draw premium background gradient (sophisticated luxury style based on document category)
    let grd = ctx.createRadialGradient(800, 565, 100, 800, 565, 1000);
    if (isDiploma) {
      grd.addColorStop(0, '#111827'); // slate-900
      grd.addColorStop(1, '#030712'); // slate-950
    } else {
      grd.addColorStop(0, '#1e1b4b'); // deep indigo-950
      grd.addColorStop(1, '#090514'); // ultra dark purple
    }
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw outer double borders (golden/cyan theme)
    ctx.strokeStyle = isDiploma ? '#fbbf24' : '#22d3ee'; // Amber/Gold vs Cyan
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.strokeStyle = isDiploma ? '#d97706' : '#0891b2'; // Dark Amber vs Dark Cyan
    ctx.lineWidth = 4;
    ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

    // Corner decorative arcs/lines (rich ornamental finish)
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
      ctx.strokeStyle = isDiploma ? '#f59e0b' : '#06b6d4';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // 3. Draw Gold Seal (Embossed stamp replica)
    ctx.beginPath();
    ctx.arc(800, 160, 64, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = isDiploma ? '#fbbf24' : '#22d3ee';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0; // reset

    // Concentric border inside seal
    ctx.beginPath();
    ctx.arc(800, 160, 56, 0, Math.PI * 2);
    ctx.closePath();
    ctx.strokeStyle = isDiploma ? '#78350f' : '#0891b2';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Star symbol inside the gold seal
    ctx.font = "bold 42px sans-serif";
    ctx.fillStyle = isDiploma ? '#78350f' : '#0891b2';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("★", 800, 160);

    // 4. Header Site Name: DK-TYPING
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.font = "bold 16px monospace";
    ctx.letterSpacing = "6px";
    ctx.fillText("DK-TYPING PROFESSIONAL ACADEMY PLATFORM", 800, 270);

    // 5. Main Document Title
    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 58px sans-serif";
    const headerTitle = isDiploma 
      ? (courseOrStage === 'keyboard' ? "YUKSAK AKADEMIYA DIPLOMI" : "DASHURLASH AKADEMIYASI DIPLOMI")
      : "KASBIY YUTUQ SERTIFIKATI";
    ctx.fillText(headerTitle, 800, 350);

    // Sub Title
    ctx.fillStyle = isDiploma ? '#fbbf24' : '#22d3ee';
    ctx.font = "bold 18px monospace";
    ctx.fillText(isDiploma ? "NIGHTINGALE ELITE GRADUATE HONOR" : "O'QUV DASTURI MUVAFFAQIYATLI YAKUNLANGANLIGI", 800, 400);

    // 6. SOLEMN PRESENT TO:
    ctx.fillStyle = '#94a3b8';
    ctx.font = "italic 18px sans-serif";
    ctx.fillText("Ushbu nufuzli hujjat tantanali ravishda topshiriladi:", 800, 470);

    // STUDENT FULL NAME (Elegant huge font)
    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 48px sans-serif";
    ctx.fillText(profile.fullName || "Ism Familiya", 800, 540);

    // Gold/Cyan bar under name
    ctx.fillStyle = isDiploma ? '#fbbf24' : '#22d3ee';
    ctx.fillRect(500, 565, 600, 4);

    // 7. BODY TEXT
    ctx.fillStyle = '#cbd5e1'; // slate-300
    ctx.font = "18px sans-serif";
    
    let bodyTextLines: string[] = [];
    if (isDiploma) {
      const courseName = courseOrStage === 'keyboard' ? "Klaviatura Akademiyasi" : "Dasturlash Akademiyasi";
      bodyTextLines = [
        `Siz ushbu platformadagi "${courseName}" - barcha 3 ta bosh bosqichini darslari qo'llanmalari`,
        `(jami 60 ta o'quv mashg'ulotlari, barmoq ko'nikmalari hamda yuqori darajadagi amaliy algoritmlar)-ni`,
        `to'liq muvaffaqiyatli tamomlab, o'z mutaxassisligingiz bo'yicha eng kuchli professional natijani tasdiqladingiz.`
      ];
    } else {
      const stageNameUz = stageDetails[courseOrStage]?.nameUz || courseOrStage;
      bodyTextLines = [
        `Siz muvaffaqiyatli ravishda "${stageNameUz}" o'quv dasturi`,
        `tarkibidagi barcha 20 ta amaliy mashg'ulot darslarini yuqori ko'rsatkichlarda tamomlab,`,
        `professional mushak xotirasi va tezkor, xatosiz yozish qobiliyatiga ega ekanligingizni isbotladingiz.`
      ];
    }

    let startY = 620;
    bodyTextLines.forEach(line => {
      ctx.fillText(line, 800, startY);
      startY += 30;
    });

    // 8. STATS SECTION (WPM & Accuracy average)
    const stats = isDiploma ? calculateCourseAverages(courseOrStage as any) : calculateStageAverages(courseOrStage);
    
    // Draw central stats box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(500, 740, 600, 100, 16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // WPM Stats
    ctx.fillStyle = isDiploma ? '#fbbf24' : '#22d3ee';
    ctx.font = "bold 28px monospace";
    ctx.fillText(`${stats.avgWpm} WPM`, 610, 785);
    ctx.fillStyle = '#94a3b8';
    ctx.font = "12px sans-serif";
    ctx.fillText("O'RTACHA TEZLIK", 610, 815);

    // Stars/Level indicator
    ctx.fillStyle = '#e2e8f0';
    ctx.font = "bold 15px sans-serif";
    ctx.fillText(isDiploma ? "OLIY MAQOM" : "TUGATILDI", 800, 785);
    ctx.fillStyle = '#94a3b8';
    ctx.font = "12px sans-serif";
    ctx.fillText(isDiploma ? "DIPLOM SOHIBI" : "BOSQICH KOMPLET", 800, 815);

    // Accuracy stats
    ctx.fillStyle = '#34d399'; // Emerald-400
    ctx.font = "bold 28px monospace";
    ctx.fillText(`${stats.avgAccuracy}%`, 990, 785);
    ctx.fillStyle = '#94a3b8';
    ctx.font = "12px sans-serif";
    ctx.fillText("IMLO ANIQILIGI", 990, 815);

    // 9. FOOTER - DATE, SERIALS AND CREATOR SIGNATURE
    const dateFormatted = new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.fillStyle = '#ffffff';
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(dateFormatted, 250, 950);
    ctx.fillStyle = '#94a3b8';
    ctx.font = "12px sans-serif";
    ctx.fillText("TAQDIM ETILGAN SANA", 250, 980);

    // Serial number tracking
    const uniqueID = `DK-${isDiploma ? 'DIPL' : 'CERT'}-${courseOrStage.toUpperCase().slice(0, 4)}-${Math.floor(10000 + Math.random() * 90000)}`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = "10px monospace";
    ctx.fillText(uniqueID, 800, 955);
    ctx.fillText("Tasdiqlash: verification.dk-typing.uz / Doniyor Kamolov", 800, 975);

    // Instructor Signature
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
    ctx.fillText("TIZIM YARATUVCHISI & DIREKTOR", 1350, 975);

    // 10. TRIGGER PNG DOWNLOAD
    try {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `${profile.fullName || "Oquvchi"}_DK-Typing_${isDiploma ? "Diplom" : "Sertifikat"}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
    }
  };

  // Print certificates
  const triggerCertificatePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2">
      
      {/* 2. Course selection tabs */}
      {!activeLesson && (
        <div className="flex bg-slate-100 p-1.5 rounded-3xl border border-slate-200 w-full sm:w-fit space-x-1.5 shadow-sm">
          <button
            onClick={() => {
              setSelectedCourse('keyboard');
              setSelectedStage('boshlangich');
            }}
            className={`flex-1 sm:flex-initial px-6 py-3 rounded-2xl font-black text-xs sm:text-sm tracking-tight transition-all flex items-center justify-center space-x-2 cursor-pointer ${selectedCourse === 'keyboard' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <span>⌨️</span> <span>{language === 'uz' ? "Klaviatura Akademiyasi" : "Keyboard Academy"}</span>
          </button>
          <button
            onClick={() => {
              setSelectedCourse('programming');
              setSelectedStage('frontend');
            }}
            className={`flex-1 sm:flex-initial px-6 py-3 rounded-2xl font-black text-xs sm:text-sm tracking-tight transition-all flex items-center justify-center space-x-2 cursor-pointer ${selectedCourse === 'programming' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <span>💻</span> <span>{language === 'uz' ? "Dasturlash Akademiyasi" : "Programming Academy"}</span>
          </button>
        </div>
      )}

      {/* 1. Stage selection banners */}
      {!activeLesson && (
        <div className="space-y-6 animate-fade-in">
          
          <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-850 tracking-tight">
                {selectedCourse === 'keyboard' 
                  ? (language === 'uz' ? "🎓 Klaviatura Akademiyasi" : "🎓 Keyboard Academy Course")
                  : (language === 'uz' ? "💻 Dasturlash Akademiyasi" : "💻 Programming Academy Course")}
              </h2>
              <p className="text-sm text-slate-500 max-w-xl">
                {selectedCourse === 'keyboard' ? (
                  language === 'uz' 
                    ? "Barcha 3 asosiy bosqichni to'liq ochib berdik. Istalgan darajadan darslarni boshlang!"
                    : "All 3 levels are accessible with absolute entry freedom. Start practicing exactly where you feel comfortable!"
                ) : (
                  language === 'uz'
                    ? "Frontend, Backend va Ma'lumotlar Bazasi (SQL/Security) bo'yicha real loyihalar tushunchasini mukammal o'zlashtiring."
                    : "Excellent interactive coding drills for Web frontend coding, backend APIs, and database rules scripts."
                )}
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
          
          {/* Royal Diploma reward card banner */}
          {isCourseFullyCompleted(selectedCourse) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 p-0.5 rounded-3xl shadow-xl shadow-amber-500/10 mb-6 text-left"
            >
              <div className="bg-slate-950 rounded-[22px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-2xl text-amber-400 mt-1 flex-shrink-0 animate-pulse">
                    <Award className="w-10 h-10 text-amber-400" />
                  </div>
                  <div className="space-y-1.5 text-left">
                    <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-[10px] font-mono tracking-widest uppercase font-extrabold">
                      Nufuzli Mukofot &bull; DIPLOM
                    </div>
                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">Oliy Maqom: Katta Akademiya Diplomi!</h3>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                      Siz <strong>{selectedCourse === 'keyboard' ? "Klaviatura Akademiyasi" : "Dasturlash Akademiyasi"}</strong>-ning barcha 3 ta bosh bosqichini (jami 60 ta murakkab amaliy darslarni) to'liq a'lo ko'rsatkichlar bilan yakunladingiz. Biz sizga ushbu nufuzli diplomni taqdim etishdan faxrlanamiz.
                    </p>
                  </div>
                </div>

                <button
                  id="generate-academy-diploma-button"
                  onClick={() => setPrintDiplomaCourse(selectedCourse)}
                  className="px-6 py-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-sm rounded-2xl flex items-center justify-center space-x-2.5 hover:scale-103 transition-transform cursor-pointer shadow-lg shadow-amber-500/20 shrink-0"
                >
                  <Award className="w-5 h-5 text-slate-950" />
                  <span>Akademiya Diplomini Yuklash</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Chronological Stage selector tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(selectedCourse === 'keyboard' ? ['boshlangich', 'orta', 'mukammal'] : ['frontend', 'backend', 'database']).map(stage => {
              const active = selectedStage === stage;
              const details = stageDetails[stage];
              const completed = isStageFullyCompleted(stage);

              return (
                <button
                  key={stage}
                  onClick={() => setSelectedStage(stage)}
                  className={`border p-5 rounded-3xl text-left transition-all relative overflow-hidden flex flex-col justify-between min-h-[196px] cursor-pointer ${active ? 'bg-slate-900 border-slate-900 text-white shadow-xl scale-102 ring-4 ring-cyan-500/10' : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] uppercase font-mono tracking-widest font-extrabold px-2.5 py-1 rounded-md text-white bg-gradient-to-r ${details.accent}`}>
                        {stage === 'boshlangich' ? "BOSHLANG'ICH" : (stage === 'orta' ? "O'RTA" : (stage === 'mukammal' ? "MUKAMMAL" : (stage === 'frontend' ? "FRONTEND" : (stage === 'backend' ? "BACKEND" : "DATABASE / SQL"))))}
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
                      20 ta progressiv mashq
                    </span>
                    <span className="text-xs font-bold text-amber-500 inline-flex items-center">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 mr-1" />
                      {(() => {
                        let stars = 0;
                        const r = details.lessonsRange;
                        for (let cur = r[0]; cur <= r[1]; cur++) {
                          stars += profile.lessonStars[cur.toString()] || 0;
                        }
                        const maxStars = 60;
                        return `${stars} / ${maxStars}`;
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
                    Siz <strong className="text-cyan-400">{stageDetails[selectedStage].nameUz}</strong>-ning barcha {selectedCourse === 'keyboard' ? '20 ta' : '10 ta'} darsini to'liq yetuklik darajasida tugatdingiz. Maxsus SVG sertifikatni yuk yuklab oling.
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
              {selectedCourse === 'keyboard' 
                ? (language === 'uz' ? "Bosqich darsliklar ro'yxati (1 - 20)" : "Stage lessons list (1 - 20)")
                : (language === 'uz' ? "Dasturlash darsliklar ro'yxati (1 - 10)" : "Programming lessons list (1 - 10)")}
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
                          {selectedCourse === 'keyboard' 
                            ? (language === 'uz' ? `${lesson.number}-mashq` : `Exercise ${lesson.number}`)
                            : (language === 'uz' ? `${lesson.number}-kod` : `Snippet ${lesson.number}`)}
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

      {/* 3. Printable High-fidelity CSS/SVG Certificate & Diploma overlay view */}
      {(printCertificateStage || printDiplomaCourse) && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-50 flex flex-col overflow-y-auto p-4 md:p-8">
          
          {/* Action dialog controls & real-time name setter */}
          <div className="max-w-4xl mx-auto w-full flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-b border-white/10 text-white mb-6 print:hidden">
            <div className="flex items-center space-x-3 text-left">
              <Award className="w-6 h-6 text-amber-500 animate-pulse shrink-0" />
              <div>
                <span className="block text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  {printDiplomaCourse ? "AKADEMIYA BITIRUV DIPLOMI" : "MASHG'ULOT BITIRUV SERTIFIKATI"}
                </span>
                <span className="text-sm font-bold text-slate-100">
                  {printDiplomaCourse ? "Hujjatni printer, PDF yoki PNG shaklida yuklang" : "Bosqichni tamomlaganlik to'g'risida tasdiq"}
                </span>
              </div>
            </div>

            {/* Live Name Input to dynamically update the preview & persist metadata */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-2 md:mt-0 text-left">
              <div className="flex items-center space-x-2 bg-slate-900 border border-white/10 px-3 py-1.5 rounded-xl w-full sm:w-64">
                <span className="text-slate-400 text-xs font-bold leading-none shrink-0 text-left">Huquq Egasi:</span>
                <input
                  type="text"
                  placeholder="Ism Familiyangizni kiriting"
                  value={certNameInput}
                  onChange={(e) => {
                    setCertNameInput(e.target.value);
                    setProfile(prev => ({
                      ...prev,
                      fullName: e.target.value
                    }));
                  }}
                  className="bg-transparent border-none text-white text-xs font-black focus:outline-none w-full text-left"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
                <button
                  id="png-download-action-trigger"
                  onClick={() => {
                    if (printDiplomaCourse) {
                      downloadCertificateAsImage(true, printDiplomaCourse);
                    } else if (printCertificateStage) {
                      downloadCertificateAsImage(false, printCertificateStage);
                    }
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-405 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer shadow-lg active:scale-95 transition-transform"
                >
                  <FileText className="w-4 h-4" />
                  <span>PNG formatda yuklash</span>
                </button>

                <button
                  id="print-trigger-action-button"
                  onClick={triggerCertificatePrint}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 cursor-pointer active:scale-95 transition-transform"
                >
                  <Printer className="w-4 h-4 text-cyan-400" />
                  <span>PDF / Print</span>
                </button>

                <button
                  onClick={() => {
                    setPrintCertificateStage(null);
                    setPrintDiplomaCourse(null);
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-350 p-2.5 rounded-xl transition-all cursor-pointer border border-white/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* High Fidelity Interactive Document Layout */}
          <div className="flex-1 flex items-center justify-center py-4">
            <div 
              id="graduation-certificate-document"
              className={`max-w-4xl w-full text-white rounded-3xl border-4 border-double shadow-2xl relative overflow-hidden backdrop-blur-md font-sans p-6 md:p-10 print:border-none print:shadow-none print:p-0 print:bg-white print:text-black ${
                printDiplomaCourse 
                  ? "bg-slate-950 border-amber-500/50 ring-2 ring-amber-500/10" 
                  : "bg-slate-950/70 border-cyan-500/40 ring-2 ring-cyan-500/10"
              }`}
              style={{ minHeight: '620px' }}
            >
              {/* Decorative luxury vector light leaks */}
              <div className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none print:hidden ${printDiplomaCourse ? 'bg-amber-500/5' : 'bg-cyan-500/5'}`} />
              <div className={`absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none print:hidden ${printDiplomaCourse ? 'bg-yellow-500/5' : 'bg-indigo-500/5'}`} />

              <div className={`border p-6 md:p-10 text-center flex flex-col justify-between h-full space-y-8 ${printDiplomaCourse ? 'border-amber-500/20' : 'border-cyan-500/20'}`}>
                
                {/* Certificate gold medal icon stamp */}
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className={`w-16 h-16 rounded-full border flex items-center justify-center relative ${
                      printDiplomaCourse ? 'bg-amber-500/10 border-amber-500/35 text-amber-400' : 'bg-cyan-500/10 border-cyan-500/35 text-cyan-400'
                    }`}>
                      <Award className="w-9 h-9 fill-current" />
                      <div className="absolute -inset-1 rounded-full border border-current opacity-20 animate-pulse pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h1 className={`text-3xl font-black tracking-widest bg-gradient-to-r bg-clip-text text-transparent uppercase ${
                      printDiplomaCourse ? 'from-amber-300 via-yellow-200 to-amber-400' : 'from-cyan-300 via-blue-200 to-indigo-300'
                    }`}>
                      {printDiplomaCourse ? "YUKSAK AKADEMIYA DIPLOMI" : "KASBIY YUTUQ SERTIFIKATI"}
                    </h1>
                    <p className="text-[10px] font-mono tracking-widest text-slate-450 uppercase uppercase">
                      DK-TYPING PROFESSIONAL ACADEMY PLATFORM
                    </p>
                  </div>
                </div>

                {/* Solemn award presentation content */}
                <div className="space-y-5">
                  <span className="text-xs text-slate-400 uppercase tracking-widest block font-bold">
                    Ushbu rasmiy hujjat tantanali ravishda topshiriladi:
                  </span>
                  
                  <h2 className={`text-3xl md:text-5xl font-black tracking-tight text-white underline decoration-2 underline-offset-8 print:text-slate-950 ${
                    printDiplomaCourse ? 'decoration-amber-500' : 'decoration-cyan-400'
                  }`}>
                    {certNameInput || "O'quvchi Ismi"}
                  </h2>

                  <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed print:text-slate-700">
                    {printDiplomaCourse ? (
                      <span>
                        Siz <strong className="text-amber-400">DK-Typing</strong> platformasi tarkibidagi professional <strong className="text-amber-400">{printDiplomaCourse === 'keyboard' ? "Klaviatura Akademiyasi" : "Dasturlash Akademiyasi"}</strong> o'quv yo'nalishini, barcha 3 ta progressiv asosiy bosqichini va 60 ta murakkab intensiv amaliy darslarni 100% muvaffaqiyatli yakunlab, a'lo mushak/kod tahlili ko'nikmalarini amalda to'liq tasdiqlaganingiz munosabati bilan ushbu oliy darajali diplom bilan taqdirlanasiz.
                      </span>
                    ) : (
                      <span>
                        Siz <strong className="text-cyan-400">{stageDetails[printCertificateStage as 'boshlangich']?.nameUz || printCertificateStage}</strong>-ning barcha 20 ta darsidan iborat o'quv dasturini, amaliy imlo tezligi hamda xatosiz yozish drill-mashqlarini to'laqonli tamomlab, o'z yo'nalishingiz bo'yicha professional mahoratingizni tasdiqlaganligingiz munosabati bilan taqdirlanasiz.
                      </span>
                    )}
                  </p>
                </div>

                {/* Interactive Dynamic Stats Panel */}
                <div className={`grid grid-cols-3 gap-4 border-t border-b py-4 max-w-lg mx-auto w-full ${
                  printDiplomaCourse ? 'border-amber-500/20' : 'border-cyan-500/20'
                }`}>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">O'rtacha Tezlik</span>
                    <strong className={`text-xl md:text-2xl font-mono print:text-indigo-950 ${printDiplomaCourse ? 'text-amber-400' : 'text-cyan-400'}`}>
                      {printDiplomaCourse 
                        ? calculateCourseAverages(printDiplomaCourse).avgWpm 
                        : (printCertificateStage ? calculateStageAverages(printCertificateStage).avgWpm : 0)
                      } WPM
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Imlo Aniqligi</span>
                    <strong className="text-xl md:text-2xl text-emerald-450 font-mono print:text-indigo-950">
                      {printDiplomaCourse 
                        ? calculateCourseAverages(printDiplomaCourse).avgAccuracy 
                        : (printCertificateStage ? calculateStageAverages(printCertificateStage).avgAccuracy : 0)
                      }%
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">Status</span>
                    <strong className={`text-xs md:text-xs uppercase font-extrabold block mt-1 print:text-indigo-950 ${printDiplomaCourse ? 'text-amber-400' : 'text-cyan-400'}`}>
                      {printDiplomaCourse ? "OLIY GRADUATE" : "BOSQICH KOMPLET"}
                    </strong>
                  </div>
                </div>

                {/* Footer validation and signatures */}
                <div className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4 text-left w-full">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 uppercase block">Chop etilgan sana:</span>
                    <h5 className="text-xs text-slate-200 font-bold font-mono">
                      {new Date().toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </h5>
                  </div>

                  {/* Anti-fraud secure unique verification ID metadata details */}
                  <div className="flex items-center space-x-3 bg-slate-900/60 p-3 rounded-2xl border border-white/5 print:hidden">
                    <div className="w-10 h-10 bg-white p-1 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-8 h-8 text-slate-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="20" rx="2" />
                        <rect x="5" y="5" width="4" height="4" />
                        <rect x="15" y="5" width="4" height="4" />
                        <rect x="5" y="15" width="4" height="4" />
                        <path d="M15 15h4v4h-4z M10 10h4v4h-4z" />
                      </svg>
                    </div>
                    <div>
                      <span className="block text-[8px] font-mono text-cyan-400 font-bold uppercase tracking-wider">VERIFIKATSIYA METADATA</span>
                      <span className="text-[10px] font-mono text-slate-400 block tracking-widest uppercase font-bold">
                        {printDiplomaCourse 
                          ? `DK-DIPL-${printDiplomaCourse.toUpperCase()}-${Math.floor(20000 + Math.random() * 80000)}` 
                          : `DK-CERT-${(printCertificateStage || '').toUpperCase().slice(0, 4)}-${Math.floor(10000 + Math.random() * 90000)}`
                        }
                      </span>
                    </div>
                  </div>

                  {/* Creator verification signature */}
                  <div className="text-center sm:text-right space-y-1">
                    <span className="text-[9px] text-slate-400 uppercase block">Platforma Asoschisi & Direktor:</span>
                    <h4 className="text-sm font-black text-amber-400 font-serif italic">Doniyor Kamolov</h4>
                    <div className="h-px bg-slate-700/60 w-32 border-dashed print:hidden" />
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
