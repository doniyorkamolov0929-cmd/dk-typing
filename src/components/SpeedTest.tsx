/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  AlertCircle, 
  TrendingUp, 
  CheckCircle,
  Clock,
  Play,
  Palette,
  Terminal,
  Layers,
  Sparkles,
  Award,
  BookOpen,
  History,
  Info,
  RefreshCw
} from 'lucide-react';
import { getRandomTestText } from '../data/sentences';
import { UserProfile, TestHistoryEntry } from '../types';
import { THEMES, ThemeColors } from '../utils/theme';
import { playKeySound, playErrorSound } from '../utils/audio';

interface SpeedTestProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onSaveHistory: (entry: Omit<TestHistoryEntry, 'id' | 'date'>) => void;
  language: 'uz' | 'en';
  practiceKeys: string[] | null;
  clearPracticeKeys: () => void;
}

export default function SpeedTest({
  profile,
  setProfile,
  onSaveHistory,
  language,
  practiceKeys,
  clearPracticeKeys
}: SpeedTestProps) {
  // Grab active theme configuration
  const activeThemeId = profile.theme || 'classic';
  const theme: ThemeColors = THEMES[activeThemeId] || THEMES.classic;

  // Sound settings
  const soundEnabled = profile.soundEnabled !== false;
  const activeSoundType = profile.soundType || 'blue';

  // State options: 4 main modes + Code mode
  const [activeMode, setActiveMode] = useState<'time' | 'words' | 'quote' | 'zen' | 'code'>('time');
  const [selectedDuration, setSelectedDuration] = useState<number>(60); // 15, 30, 60, 120 seconds
  const [selectedWordCount, setSelectedWordCount] = useState<number>(25); // 10, 25, 50, 100 words
  const [selectedCodeLang, setSelectedCodeLang] = useState<string>('javascript'); // javascript, python, html_css, cpp

  // Standard speed test timers and countdown
  const [timeLeft, setTimeLeft] = useState(60);
  const [testActive, setTestActive] = useState(false);
  const [testFinished, setTestFinished] = useState(false);

  // Focus and sentence states
  const [sourceText, setSourceText] = useState('');
  const [typedStatuses, setTypedStatuses] = useState<('untyped' | 'correct' | 'incorrect')[]>([]);
  const [charIndex, setCharIndex] = useState(0);

  // Live statistical counters
  const [totalTypedKeys, setTotalTypedKeys] = useState(0);
  const [correctTypedKeys, setCorrectTypedKeys] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);

  // Keep references to active typed keys close for the timers
  const totalTypedKeysRef = useRef(0);
  const correctTypedKeysRef = useRef(0);

  useEffect(() => {
    totalTypedKeysRef.current = totalTypedKeys;
  }, [totalTypedKeys]);

  useEffect(() => {
    correctTypedKeysRef.current = correctTypedKeys;
  }, [correctTypedKeys]);

  // Timestamps
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Focus reference
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Confirming prompt alert triggers
  const [showConfigAlert, setShowConfigAlert] = useState<{ type: string; value: any } | null>(null);

  // Setup / reset typing text
  const initializeTest = (
    modeVal: 'time' | 'words' | 'quote' | 'zen' | 'code' = activeMode,
    durationVal: number = selectedDuration,
    wordCountVal: number = selectedWordCount,
    codeLangVal: string = selectedCodeLang,
    forceNewText: boolean = true
  ) => {
    // Clear countdown interval
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    startTimeRef.current = null;

    setTimeLeft(durationVal);
    setElapsedSeconds(0);
    setCharIndex(0);
    setTotalTypedKeys(0);
    setCorrectTypedKeys(0);
    setMistakesCount(0);
    setTestActive(false);
    setTestFinished(false);

    if (forceNewText || !sourceText) {
      // Focus custom critical troubleshooting characters if passed
      let text = '';
      if (practiceKeys && practiceKeys.length > 0) {
        const sampleSet = language === 'uz' 
          ? ["katta dars", "qiyinchilik", "mukammal bosqich", "shirin so'z", "boshlang'ich", "ishlab chiquvchi", "analitika xaritasi"] 
          : ["quick focus", "expert key training", "problem solver", "vibrant structure", "typist capability"];
        
        let generated = "";
        for (let i = 0; i < 15; i++) {
          const randWord = sampleSet[Math.floor(Math.random() * sampleSet.length)];
          const focusPart = practiceKeys.map(k => k.toUpperCase() + k.toLowerCase()).join('');
          generated += `${randWord} ${focusPart} `;
        }
        text = generated.trim();
      } else {
        // Standard random selector
        text = getRandomTestText(language, modeVal, codeLangVal, modeVal === 'words' ? Math.ceil(wordCountVal / 6) : 3);
        // Crop exactly to word limits if mode is words
        if (modeVal === 'words') {
          const words = text.split(/\s+/);
          text = words.slice(0, wordCountVal).join(" ");
        }
      }

      setSourceText(text);
      setTypedStatuses(new Array(text.length).fill('untyped'));
    } else {
      setTypedStatuses(new Array(sourceText.length).fill('untyped'));
    }
  };

  // Setup default test on mount or modes changes
  useEffect(() => {
    initializeTest(activeMode, selectedDuration, selectedWordCount, selectedCodeLang, true);
  }, [language, practiceKeys, activeMode, selectedDuration, selectedWordCount, selectedCodeLang]);

  // Clean timer handle
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Countdown timer loop
  const startCountdown = () => {
    setTestActive(true);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      // Track actual elapsed seconds
      setElapsedSeconds(prev => {
        const nextSec = prev + 1;
        
        setTimeLeft(t => {
          if (t <= 1) {
            finishTest(nextSec);
            return 0;
          }
          return t - 1;
        });

        return nextSec;
      });
    }, 1000);
  };

  // Conclude the typing session
  const finishTest = (finalElapsed: number = elapsedSeconds) => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setTestActive(false);
    setTestFinished(true);

    const activeSeconds = Math.max(1, finalElapsed);
    const minutes = activeSeconds / 60;
    
    // Calculate net WPM: (correct characters / 5) / minutes
    const finalWpm = Math.max(0, Math.round((correctTypedKeysRef.current / 5) / minutes));
    const finalAccuracy = totalTypedKeysRef.current > 0 
      ? Math.round((correctTypedKeysRef.current / totalTypedKeysRef.current) * 100) 
      : 100;

    let testName = "";
    if (practiceKeys) {
      testName = language === 'uz' ? "Muammoli harflar mashqi" : "Problem keys heavy drill";
    } else {
      switch (activeMode) {
        case 'time':
          testName = language === 'uz' ? `${selectedDuration} soniyalik test` : `${selectedDuration}s timed test`;
          break;
        case 'words':
          testName = language === 'uz' ? `${selectedWordCount} talik so'z testi` : `${selectedWordCount} words mode`;
          break;
        case 'quote':
          testName = language === 'uz' ? "Klassik iqtibos yozish" : "Classic wise quote";
          break;
        case 'code':
          testName = `Code: ${selectedCodeLang.toUpperCase()}`;
          break;
        case 'zen':
          testName = language === 'uz' ? "Zen sokin yozish" : "Zen focused writing";
          break;
      }
    }

    // Save report to localStorage timeline
    onSaveHistory({
      wpm: finalWpm,
      accuracy: finalAccuracy,
      durationSeconds: activeSeconds,
      language: language,
      type: 'speedtest',
      name: testName
    });

    // Provide stars dynamically based on precision
    let starsEarned = 1;
    if (finalAccuracy >= 98 && finalWpm >= 40) starsEarned = 3;
    else if (finalAccuracy >= 90) starsEarned = 2;

    setProfile(prev => ({
      ...prev,
      totalStars: Math.min(180, prev.totalStars + starsEarned)
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (testFinished) return;

    // Prevent scrolling keys default spacebar action
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }

    // Capture Backspace
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
          setCorrectTypedKeys(c => Math.max(0, c - 1));
        }
      }
      return;
    }

    // Ignore commands
    if (e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) {
      return;
    }

    // Start timer on first keystroke
    if (!testActive && !testFinished && charIndex === 0) {
      startCountdown();
    }

    const expectedChar = sourceText[charIndex];
    const typedChar = e.key;

    // Heatmap statistics tracker
    const expectedLetterUpper = expectedChar.toUpperCase();
    const isAlphabet = /^[A-Z;,.{}()\[\]<>:;=+\-'"_]$/.test(expectedLetterUpper);

    const updatedStatuses = [...typedStatuses];

    if (typedChar === expectedChar) {
      // Correct character typed
      if (soundEnabled) playKeySound(activeSoundType);
      updatedStatuses[charIndex] = 'correct';
      setCorrectTypedKeys(prev => prev + 1);

      if (isAlphabet) {
        setProfile(prev => {
          const totalMap = { ...prev.keyTotal };
          totalMap[expectedLetterUpper] = (totalMap[expectedLetterUpper] || 0) + 1;
          return { ...prev, keyTotal: totalMap };
        });
      }
    } else {
      // Inaccurate character typed
      if (soundEnabled) playErrorSound();
      updatedStatuses[charIndex] = 'incorrect';
      setMistakesCount(prev => prev + 1);

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
    setTotalTypedKeys(prev => prev + 1);
    
    const nextCharIndex = charIndex + 1;
    setCharIndex(nextCharIndex);

    // End condition for text completion modes (Words, Quote, Code)
    if (nextCharIndex >= sourceText.length) {
      setTimeout(() => {
        finishTest(elapsedSeconds || 1);
      }, 50);
    }
  };

  // Seamlessly append text in Zen and Timed modes when approaching the end
  useEffect(() => {
    if ((activeMode === 'zen' || activeMode === 'time') && sourceText.length > 0 && sourceText.length - charIndex < 80 && !testFinished) {
      const extraText = getRandomTestText(language, activeMode, selectedCodeLang, 2);
      setSourceText(prev => prev + " " + extraText);
      setTypedStatuses(prev => [...prev, 'untyped', ...new Array(extraText.length + 1).fill('untyped')]);
    }
  }, [charIndex, sourceText, language, testFinished, activeMode]);

  useEffect(() => {
    if (activeCharRef.current) {
      activeCharRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }, [charIndex]);

  // Handle Mode Change
  const triggerModeChange = (mode: typeof activeMode) => {
    if (testActive && charIndex > 0) {
      setShowConfigAlert({ type: 'mode', value: mode });
    } else {
      setActiveMode(mode);
      initializeTest(mode, selectedDuration, selectedWordCount, selectedCodeLang, true);
    }
  };

  // Helper selectors
  const liveMinutes = Math.max(0.01, (elapsedSeconds || (Date.now() - (startTimeRef.current || Date.now())) / 1000) / 60);
  const liveWpm = Math.round((correctTypedKeys / 5) / liveMinutes);
  const liveAccuracy = totalTypedKeys > 0 ? Math.round((correctTypedKeys / totalTypedKeys) * 100) : 100;

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-2">
      
      {/* 1. TOP PROFESSIONAL CONFIGURATION BAR */}
      <div className={`p-6 rounded-3xl border transition-all ${theme.cardBg} outline-none flex flex-col gap-5`}>
        
        {/* Row 1: Logo, Title and Mode Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider font-mono">
              {practiceKeys ? "Zaif tugmalar mashqi" : (language === 'uz' ? "DK-Typing tezlik testi" : "Custom speed drills")}
            </span>
            <h2 className="text-2xl font-black tracking-tight mt-1 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{language === 'uz' ? "Yozish Rejimlari va Sozlamalar" : "Custom Training Arena"}</span>
            </h2>
          </div>

          {/* Core Mode Toggles */}
          {!practiceKeys && (
            <div className={`flex flex-wrap bg-slate-950/40 p-1.5 rounded-2xl border ${theme.border} shadow-inner`}>
              {(['time', 'words', 'quote', 'zen', 'code'] as const).map(mode => (
                <button
                  key={mode}
                  id={`mode-toggle-${mode}`}
                  onClick={() => triggerModeChange(mode)}
                  className={`px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeMode === mode ? 'bg-cyan-500 text-slate-950 font-black shadow' : `${theme.textSecondary} hover:text-white`}`}
                >
                  {mode === 'time' && (language === 'uz' ? '⏱️ Vaqt' : '⏱️ Time')}
                  {mode === 'words' && (language === 'uz' ? '🆎 Soʻzlar' : '🆎 Words')}
                  {mode === 'quote' && (language === 'uz' ? '💬 Iqtibos' : '💬 Quotes')}
                  {mode === 'zen' && (language === 'uz' ? '🧘 Zen' : '🧘 Zen')}
                  {mode === 'code' && (language === 'uz' ? '💻 Dasturchi' : '💻 Code')}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Row 2: Subsettings Panel of Selected Mode */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/20">
          
          {/* Left panel: Mode specific variables (intervals, limits, code languages) */}
          <div className="flex flex-wrap items-center gap-2">
            
            {!practiceKeys && (
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-mono lowercase ${theme.textSecondary}`}>{language === 'uz' ? "vaqt:" : "dur:"}</span>
                <div className="flex bg-slate-950/20 p-1 rounded-xl">
                  {[15, 30, 60, 120].map(sec => (
                    <button
                      key={sec}
                      onClick={() => {
                        setSelectedDuration(sec);
                        initializeTest(activeMode, sec, selectedWordCount, selectedCodeLang, true);
                      }}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${selectedDuration === sec ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : `${theme.textSecondary} hover:text-white`}`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeMode === 'words' && (
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-mono lowercase ${theme.textSecondary}`}>{language === 'uz' ? "so'z soni:" : "words:"}</span>
                <div className="flex bg-slate-950/20 p-1 rounded-xl">
                  {[10, 25, 50, 100].map(words => (
                    <button
                      key={words}
                      onClick={() => {
                        setSelectedWordCount(words);
                        initializeTest('words', selectedDuration, words, selectedCodeLang, true);
                      }}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${selectedWordCount === words ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : `${theme.textSecondary} hover:text-white`}`}
                    >
                      {words}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeMode === 'code' && (
              <div className="flex items-center space-x-2 flex-wrap">
                <span className={`text-xs font-mono lowercase ${theme.textSecondary}`}>{language === 'uz' ? "til:" : "lang:"}</span>
                <div className="flex bg-slate-950/20 p-1 rounded-xl flex-wrap">
                  {[
                    { id: 'javascript', label: 'JavaScript' },
                    { id: 'python', label: 'Python' },
                    { id: 'html_css', label: 'HTML/CSS' },
                    { id: 'cpp', label: 'C++' }
                  ].map(langNode => (
                    <button
                      key={langNode.id}
                      onClick={() => {
                        setSelectedCodeLang(langNode.id);
                        initializeTest('code', selectedDuration, selectedWordCount, langNode.id, true);
                      }}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${selectedCodeLang === langNode.id ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : `${theme.textSecondary} hover:text-white`}`}
                    >
                      {langNode.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeMode === 'quote' && (
              <span className={`text-xs font-mono flex items-center space-x-2 ${theme.textSecondary}`}>
                <Award className="w-4 h-4 text-emerald-400" />
                <span>{language === 'uz' ? "Allomalar va mutafakkirlar aforizmlari matni yuklandi" : "Inspirational & historical code quotes loaded."}</span>
              </span>
            )}

            {activeMode === 'zen' && (
              <span className={`text-xs font-mono flex items-center space-x-2 ${theme.textSecondary}`}>
                <CheckCircle className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                <span>{language === 'uz' ? "Sokin Zen mashqi: Hech qanday taymer va bosimlarsiz yozing" : "Zen state activated. No timer clocks or live metrics to distract your mind."}</span>
              </span>
            )}
          </div>

          {/* Right panel: Custom Themes, Sound Options and Volume Toggle */}
          <div className="flex flex-wrap items-center justify-end gap-3 self-end md:self-auto">
            
            {/* Theme Select Trigger */}
            <div className="flex items-center space-x-1 bg-slate-950/20 p-1 rounded-xl border border-slate-800/40">
              <Palette className="w-4 h-4 text-cyan-400 ml-1.5" />
              <select
                id="site-theme-selector"
                value={activeThemeId}
                onChange={(e) => {
                  const newTheme = e.target.value as any;
                  setProfile(prev => ({ ...prev, theme: newTheme }));
                }}
                className="bg-transparent text-xs font-bold border-none text-slate-250 py-1 px-1 rounded cursor-pointer outline-none focus:ring-0 [&>option]:bg-slate-900 [&>option]:text-white"
              >
                <option value="classic">{language === 'uz' ? "Slate Mavzu" : "Slate Theme"}</option>
                <option value="dracula">{language === 'uz' ? "Dracula Mavzu" : "Dracula Dark"}</option>
                <option value="nord">{language === 'uz' ? "Nord Moviy" : "Nordic Frost"}</option>
                <option value="cyberpunk">{language === 'uz' ? "Kiberpank Neon" : "Cyberpunk"}</option>
                <option value="retro">{language === 'uz' ? "Krem Qog'oz" : "Retro Cream"}</option>
              </select>
            </div>

            {/* Sound Switch Selector Selector */}
            {soundEnabled && (
              <div className="flex items-center space-x-1 bg-slate-950/20 p-1 rounded-xl border border-slate-800/40">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono ml-1.5">{language === 'uz' ? "klavish:" : "switch:"}</span>
                <select
                  id="key-sound-type-selector"
                  value={activeSoundType}
                  onChange={(e) => {
                    const newSound = e.target.value as any;
                    setProfile(prev => ({ ...prev, soundType: newSound }));
                  }}
                  className="bg-transparent text-[11px] font-mono font-bold border-none text-cyan-400 py-1 px-1 rounded cursor-pointer outline-none focus:ring-0 [&>option]:bg-slate-900 [&>option]:text-white"
                >
                  <option value="blue">Cherry Blue (Crisp Click)</option>
                  <option value="brown">Cherry Brown (Silent tact)</option>
                  <option value="typewriter">Retro Typewriter</option>
                  <option value="beep">Digital Beep</option>
                </select>
              </div>
            )}

            {/* Sound Toggle Button */}
            <button
              onClick={() => {
                setProfile(prev => ({ ...prev, soundEnabled: !soundEnabled }));
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${soundEnabled ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white'}`}
              title={language === 'uz' ? "Tovushlarni sozlash" : "Toggle Clicks Feedback"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </div>

      {/* 2. REPUTATION REAL-TIME METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Net Speed Card */}
        <div className={`p-4 rounded-3xl border shadow-md flex items-center space-x-3.5 relative overflow-hidden transition-all ${theme.cardBg} ${theme.border}`}>
          <div className="bg-cyan-500/10 p-2.5 rounded-2xl text-cyan-500 flex-shrink-0">
            <TrendingUp className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className={`text-[10px] uppercase font-mono tracking-widest block opacity-70 ${theme.textSecondary}`}>WPM ({language === 'uz' ? "tezlik" : "net speed"})</span>
            <span className={`text-xl font-black font-mono block ${theme.textPrimary}`}>
              {testActive ? liveWpm : (testFinished ? liveWpm : 0)} <span className="text-xs font-sans text-slate-400">DSS</span>
            </span>
          </div>
        </div>

        {/* Accurracy Percentage */}
        <div className={`p-4 rounded-3xl border shadow-md flex items-center space-x-3.5 transition-all ${theme.cardBg} ${theme.border}`}>
          <div className="bg-emerald-500/10 p-2.5 rounded-2xl text-emerald-500 flex-shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className={`text-[10px] uppercase font-mono tracking-widest block opacity-70 ${theme.textSecondary}`}>{language === 'uz' ? "Aniqlik %" : "Accuracy %"}</span>
            <span className={`text-xl font-black font-mono block text-emerald-500`}>
              {testActive ? liveAccuracy : (testFinished ? liveAccuracy : 100)}%
            </span>
          </div>
        </div>

        {/* Mistake Errors Counter */}
        <div className={`p-4 rounded-3xl border shadow-md flex items-center space-x-3.5 transition-all ${theme.cardBg} ${theme.border}`}>
          <div className="bg-rose-500/10 p-2.5 rounded-2xl text-rose-500 flex-shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <span className={`text-[10px] uppercase font-mono tracking-widest block opacity-70 ${theme.textSecondary}`}>{language === 'uz' ? "Soniya/Xato" : "Mistakes"}</span>
            <span className={`text-xl font-black font-mono block text-rose-500`}>
              {mistakesCount} <span className="text-[10px] font-sans text-slate-400">{language === 'uz' ? "xato" : "errs"}</span>
            </span>
          </div>
        </div>

        {/* Circular Countdown/Timer */}
        <div className={`p-4 rounded-3xl border shadow-md flex items-center space-x-3.5 transition-all ${theme.cardBg} ${theme.border}`}>
          <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
            <svg className="w-10 h-10 transform -rotate-90">
              <circle cx="20" cy="20" r="17" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="2.5" fill="transparent" />
              <circle
                cx="20"
                cy="20"
                r="17"
                className="stroke-cyan-500 transition-all duration-300"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray="106.8"
                strokeDashoffset={106.8 - (106.8 * timeLeft) / selectedDuration}
              />
            </svg>
            <span className={`absolute text-[11px] font-mono font-black ${theme.textPrimary}`}>{timeLeft}</span>
          </div>
          <div>
            <span className={`text-[10px] uppercase font-mono tracking-widest block opacity-70 ${theme.textSecondary}`}>
              {language === 'uz' ? "Taymer (Qoldi)" : "Time Left"}
            </span>
            <span className={`text-xs font-bold font-mono block ${theme.textPrimary}`}>
              {timeLeft}s / {selectedDuration}s
              <span className="text-[9px] font-normal text-slate-400 ml-1">({elapsedSeconds}s)</span>
            </span>
          </div>
        </div>

      </div>

      {/* 3. DYNAMIC WRAPPED TYPING KEYPAD CONTAINER SHEET */}
      {!testFinished ? (
        <div className="relative">
          <div
            id="typing-test-focus-zone"
            ref={containerRef}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            tabIndex={0}
            className={`w-full min-h-[190px] p-6 md:p-8 rounded-3xl outline-none duration-300 ${theme.typingBoxBg} focus:ring-4 focus:ring-cyan-500/10 shadow-inner relative transition-colors`}
          >
            {/* Click to start cover page overlay node */}
            {!isFocused && (
              <div 
                onClick={() => containerRef.current?.focus()}
                className="absolute inset-0 z-10 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center cursor-pointer rounded-3xl transition-opacity animate-fade-in"
              >
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-3xl max-w-sm flex flex-col items-center shadow-2xl">
                  <Play className="w-10 h-10 text-cyan-400 fill-cyan-400 animate-pulse mb-3" />
                  <h4 className="text-lg font-black tracking-wider uppercase mb-1.5 text-white">
                    {language === 'uz' ? "⚡ KLAVIATURANI FAOL QILISH" : "⚡ ENGAGE KEYBOARD"}
                  </h4>
                  <p className="text-xs text-slate-400 mb-4 leading-normal">
                    {language === 'uz' 
                      ? "Kompyuteringiz kursorini darslik oyna ustiga bosing va istalgan klavish yordamida yozishni boshlang."
                      : "Click inside the box or push the start banner button below to prepare your virtual typing keys focus."}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      containerRef.current?.focus();
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-indigo-505 text-slate-950 font-extrabold rounded-xl text-xs hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                  >
                    {language === 'uz' ? "⚡ BOSHLASH (START)" : "⚡ START TRAINING"}
                  </button>
                </div>
              </div>
            )}

            {/* Structured character matrices text sheet */}
            <div className="text-xl md:text-2xl font-mono leading-relaxed tracking-wide select-none flex flex-wrap gap-y-2.5 whitespace-pre-wrap text-left antialiased">
              {(() => {
                // Whole-word bundling for non-orphaned beautiful wrapping on modern small screens
                const words: { id: number; chars: { char: string; absIndex: number }[] }[] = [];
                let currentWord: { id: number; chars: { char: string; absIndex: number }[] } = { id: 0, chars: [] };
                let currentWordId = 0;

                for (let i = 0; i < sourceText.length; i++) {
                  const char = sourceText[i];
                  currentWord.chars.push({ char, absIndex: i });

                  if (char === ' ' || char === '\n') {
                    words.push(currentWord);
                    currentWordId++;
                    currentWord = { id: currentWordId, chars: [] };
                  }
                }

                if (currentWord.chars.length > 0) {
                  words.push(currentWord);
                }

                return words.map(wordObject => (
                  <span key={wordObject.id} className="inline-block whitespace-nowrap mr-2">
                    {wordObject.chars.map(({ char, absIndex }) => {
                      let charClass = "text-slate-500 opacity-60";
                      const isCursor = absIndex === charIndex;

                      // Correct or wrong state highlights
                      if (absIndex < charIndex) {
                        charClass = typedStatuses[absIndex] === 'correct' 
                          ? `${theme.correctChar}` 
                          : `${theme.incorrectChar}`;
                      }

                      return (
                        <span
                          key={absIndex}
                          ref={isCursor ? activeCharRef : null}
                          className={`relative inline-block transition-all ${charClass} ${isCursor ? 'text-cyan-400 border-b-2 border-cyan-400 animate-pulse font-extrabold' : ''}`}
                          style={{ minWidth: char === ' ' ? '10px' : 'auto' }}
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

            {/* Dynamic Zen Mode special actions bar */}
            {activeMode === 'zen' && testActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute right-4 bottom-4"
              >
                <button
                  onClick={() => finishTest(elapsedSeconds || 1)}
                  className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer transition-all"
                >
                  {language === 'uz' ? "🏁 Sinovni Tugallash" : "🏁 Finish Session"}
                </button>
              </motion.div>
            )}

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 mt-2 px-1">
            <span className="flex items-center space-x-1.5 font-mono">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>{language === 'uz' ? "Harakat: Klaviaturaga qaramasdan yozing. To'g'ri yozish mushak xotirasini kuchaytiradi." : "Keep fingers straight. Precision drills expand muscle reflexes."}</span>
            </span>
            <span className="font-mono text-[11px] bg-slate-100 p-1 px-2 rounded-lg border border-slate-200">
              {language === 'uz' ? "Oqim" : "Pointer"}: {charIndex} / {sourceText.length}
            </span>
          </div>

        </div>
      ) : (
        /* 4. POST-SESSION DETAILED REPORT SHEETS CARD */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-8 rounded-3xl border transition-all text-center space-y-7 relative overflow-hidden ${theme.cardBg}`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-450/10">
            <CheckCircle className="w-8 h-8 animate-bounce" />
          </div>

          <div className="space-y-1">
            <h3 className={`text-3xl font-black tracking-tight font-sans ${theme.textPrimary}`}>
              {language === 'uz' ? "Muvaffaqiyatli Tamomlandi!" : "Evaluation Complete!"}
            </h3>
            <p className={`text-sm max-w-md mx-auto leading-relaxed ${theme.textSecondary}`}>
              {language === 'uz' 
                ? "Yozish mashg'uloti muvaffaqiyatli yakunlandi. Natijangiz profil statistikasiga qo'shildi va millisekundli dactology saqlandi." 
                : "You completed the typing exercise. Your performance metrics were compiled and logged under secure browser caches."}
            </p>
          </div>

          {/* Bento analytics grids */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto pt-2">
            
            <div className={`border rounded-2xl p-4 text-center transition-all ${theme.typingBoxBg} ${theme.border}`}>
              <span className={`text-[10px] font-mono tracking-wider uppercase block ${theme.textSecondary}`}>{language === 'uz' ? "Tezlik" : "Speed"}</span>
              <span className="text-3xl font-black text-cyan-400 font-mono">
                {liveWpm} <span className="text-xs font-sans text-slate-500">WPM</span>
              </span>
              <span className={`block text-[10px] mt-1 ${theme.textSecondary}`}>{language === 'uz' ? "so'z / daqiqa" : "Words per Min"}</span>
            </div>

            <div className={`border rounded-2xl p-4 text-center transition-all ${theme.typingBoxBg} ${theme.border}`}>
              <span className={`text-[10px] font-mono tracking-wider uppercase block ${theme.textSecondary}`}>{language === 'uz' ? "Imlo" : "Accuracy"}</span>
              <span className="text-3xl font-black text-emerald-450 font-mono">
                {liveAccuracy}%
              </span>
              <span className={`block text-[10px] mt-1 ${theme.textSecondary}`}>{language === 'uz' ? "to'g'rilik foizi" : "Letter precision"}</span>
            </div>

            <div className={`border rounded-2xl p-4 text-center transition-all ${theme.typingBoxBg} ${theme.border}`}>
              <span className={`text-[10px] font-mono tracking-wider uppercase block ${theme.textSecondary}`}>{language === 'uz' ? "Bugungi Xato" : "Total Errs"}</span>
              <span className="text-3xl font-black text-rose-450 font-mono">
                {mistakesCount}
              </span>
              <span className={`block text-[10px] mt-1 ${theme.textSecondary}`}>{language === 'uz' ? "bosilgan xato" : "Keyboard faults"}</span>
            </div>

            <div className={`border rounded-2xl p-4 text-center transition-all ${theme.typingBoxBg} ${theme.border}`}>
              <span className={`text-[10px] font-mono tracking-wider uppercase block ${theme.textSecondary}`}>{language === 'uz' ? "Yutuq bahosi" : "Star rating"}</span>
              <span className="text-2xl font-black text-amber-500 font-mono inline-flex items-center space-x-0.5 justify-center mt-1">
                <span>{liveAccuracy >= 98 && liveWpm >= 40 ? "⭐⭐⭐" : (liveAccuracy >= 90 ? "⭐⭐" : "⭐")}</span>
              </span>
              <span className={`block text-[10px] mt-1 ${theme.textSecondary}`}>{language === 'uz' ? "tajriba bahosi" : "Level grading"}</span>
            </div>

          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-sm mx-auto">
            <button
              id="speed-test-restart-button"
              onClick={() => initializeTest(activeMode, selectedDuration, selectedWordCount, selectedCodeLang, true)}
              className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm rounded-2xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
            >
              <RotateCcw className="w-4 h-4 text-slate-950" />
              <span>{language === 'uz' ? "Yangi test boshlash" : "Start Fresh Trial"}</span>
            </button>
          </div>

        </motion.div>
      )}

      {/* 5. METRIC UPDATE DESKTOP SAFETY ALERT */}
      <div className={`p-5 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${theme.cardBg} ${theme.border}`}>
        <div className="flex items-start space-x-3.5">
          <div className="bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl text-emerald-400 flex-shrink-0">
            <History className="w-5 h-5 animate-spin-slow" />
          </div>
          <div className="space-y-0.5 text-left">
            <h5 className={`text-sm font-bold uppercase tracking-wider flex items-center space-x-2 ${theme.textPrimary}`}>
              <span>{language === 'uz' ? "DK-Typing Ma'lumotlarni Himoyalash Tizimi" : "DK-Typing Local Security"}</span>
              <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-mono px-2 py-0.5 rounded-full uppercase font-bold">
                {language === 'uz' ? "faol" : "secured"}
              </span>
            </h5>
            <p className={`text-xs leading-normal max-w-2xl ${theme.textSecondary}`}>
              {language === 'uz'
                ? "DK-Typing yangilanganda va sayt yangi versiyasi serverga yuklanganda barcha yutuqlaringiz, ismingiz va darslar saqlab qolinadi (LocalStorage sinxron hisobi). Hech qanday natija o'chib ketmaydi."
                : "Your personal statistics are guarded perfectly inside your device's persistent LocalStorage cache. System hot-reloads will never clear your results structure."}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            // Trigger local refresh representing the update/yangilash functionality without losing data
            window.location.reload();
          }}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center space-x-2 whitespace-nowrap border ${theme.accentHover}`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{language === 'uz' ? "Hozir Yangilash" : "Reload and Check"}</span>
        </button>
      </div>

      {/* Standard warning modals if changing values on live sessions */}
      {showConfigAlert && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-800 shadow-2xl text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h4 className="text-lg font-bold text-white">Yozish mashqini to'xtatishni istaysizmi?</h4>
            
            <p className="text-sm text-slate-400">
              Faol tezlik testi hozirda davom etmoqda. Agar hozir rejimni o'zgartirsangiz, ushbu sessiya natijalari saqlanmaydi.
            </p>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => {
                  const targetVal = showConfigAlert.value;
                  setActiveMode(targetVal);
                  initializeTest(targetVal, selectedDuration, selectedWordCount, selectedCodeLang, true);
                  setShowConfigAlert(null);
                }}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl text-sm transition-all cursor-pointer"
              >
                Ha, to'xtatilsin
              </button>
              <button
                onClick={() => setShowConfigAlert(null)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-2xl text-sm transition-all cursor-pointer text-white"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Word calculations helper for exact limits feedback
function wordCountLeft(fullText: string, cursorIndex: number): number {
  if (!fullText) return 0;
  const remainingPart = fullText.slice(cursorIndex).trim();
  if (!remainingPart) return 0;
  return remainingPart.split(/\s+/).length;
}
