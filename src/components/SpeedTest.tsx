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
  HelpCircle,
  Clock,
  Play
} from 'lucide-react';
import { getRandomParagraph } from '../data/sentences';
import { UserProfile, TestHistoryEntry } from '../types';

interface SpeedTestProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  onSaveHistory: (entry: Omit<TestHistoryEntry, 'id' | 'date'>) => void;
  language: 'uz' | 'en';
  practiceKeys: string[] | null; // For targeted keyboard trouble practice
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
  // Durations: 1m, 2m, 3m, 5m (seconds)
  const durations = [60, 120, 180, 300];
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [testActive, setTestActive] = useState(false);
  const [testFinished, setTestFinished] = useState(false);

  // Sound effects toggler
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Source text variables
  const [sourceText, setSourceText] = useState('');
  const [typedStatuses, setTypedStatuses] = useState<('untyped' | 'correct' | 'incorrect')[]>([]);
  const [charIndex, setCharIndex] = useState(0);

  // Statistics counters
  const [totalTypedKeys, setTotalTypedKeys] = useState(0);
  const [correctTypedKeys, setCorrectTypedKeys] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);

  // Refs for tracking up to date values in closures
  const totalTypedKeysRef = useRef(0);
  const correctTypedKeysRef = useRef(0);

  // Sync refs on state changes
  useEffect(() => {
    totalTypedKeysRef.current = totalTypedKeys;
  }, [totalTypedKeys]);

  useEffect(() => {
    correctTypedKeysRef.current = correctTypedKeys;
  }, [correctTypedKeys]);

  // Timestamps for real-time tracking
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Input listener and scroll positioning references
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  
  // Track focus status of typing zone
  const [isFocused, setIsFocused] = useState(false);

  // Alert confirming changing parameters
  const [showConfigAlert, setShowConfigAlert] = useState<{ type: 'lang' | 'timer', value: any } | null>(null);

  // Play simple synth sound for audio feedback
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

  // Generate sentences
  const generateNewTestText = (keysToFocus: string[] | null) => {
    if (keysToFocus && keysToFocus.length > 0) {
      // Focus practice: generate a text heavy in specifically requested keys
      const sampleSet = language === 'uz' 
        ? ["katta dars", "qiyinchilik", "mukammal bosqich", "shirin so'z", "boshlang'ich", "ishlab chiquvchi", "analitika xaritasi"] 
        : ["quick focus", "expert key training", "problem solver", "vibrant structure", "typist capability"];
      
      let generated = "";
      for (let i = 0; i < 15; i++) {
        const randWord = sampleSet[Math.floor(Math.random() * sampleSet.length)];
        const focusPart = keysToFocus.map(k => k.toUpperCase() + k.toLowerCase()).join('');
        generated += `${randWord} ${focusPart} `;
      }
      return generated.trim();
    } else {
      return getRandomParagraph(language, 3);
    }
  };

  // Setup current test session
  const initializeTest = (duration: number = selectedDuration, forceNewText: boolean = true) => {
    // Reset timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    startTimeRef.current = null;

    setTimeLeft(duration);
    setElapsedSeconds(0);
    setCharIndex(0);
    setTotalTypedKeys(0);
    setCorrectTypedKeys(0);
    setMistakesCount(0);
    setTestActive(false);
    setTestFinished(false);

    if (forceNewText || !sourceText) {
      const generated = generateNewTestText(practiceKeys);
      setSourceText(generated);
      setTypedStatuses(new Array(generated.length).fill('untyped'));
    } else {
      setTypedStatuses(new Array(sourceText.length).fill('untyped'));
    }
  };

  // Trigger setup on load
  useEffect(() => {
    initializeTest(selectedDuration, true);
  }, [language, practiceKeys]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Live timer interval loop
  const startCountdown = () => {
    setTestActive(true);
    startTimeRef.current = Date.now();
    
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          finishTest();
          return 0;
        }
        setElapsedSeconds(selectedDuration - (prev - 1));
        return prev - 1;
      });
    }, 1000);
  };

  // Conclude the test
  const finishTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setTestActive(false);
    setTestFinished(true);

    // Calculate final metrics
    const finalMinutes = selectedDuration / 60;
    // Solely count correct typed keys for typing speed calculation
    const finalWpm = Math.max(0, Math.round((correctTypedKeysRef.current / 5) / finalMinutes));
    const finalAccuracy = totalTypedKeysRef.current > 0 ? Math.round((correctTypedKeysRef.current / totalTypedKeysRef.current) * 100) : 100;

    // Trigger save history
    onSaveHistory({
      wpm: finalWpm,
      accuracy: finalAccuracy,
      durationSeconds: selectedDuration,
      language: language,
      type: 'speedtest',
      name: practiceKeys 
        ? (language === 'uz' ? "Muammoli tugmalar mashqi" : "Problem keys training")
        : (language === 'uz' ? `${selectedDuration / 60} Daqiqalik Test` : `${selectedDuration / 60} Min Speed Test`)
    });

    // Update global streak, stars (giving 1 star if completed speed test, up to 3 stars if perfect)
    let starsEarned = 1;
    if (finalAccuracy >= 95) starsEarned = 3;
    else if (finalAccuracy >= 85) starsEarned = 2;

    setProfile(prev => {
      return {
        ...prev,
        totalStars: prev.totalStars + starsEarned
      };
    });
  };

  // Unlimited text appended seamlessly when kursor nears the end
  useEffect(() => {
    if (sourceText.length > 0 && sourceText.length - charIndex < 100 && !testFinished) {
      // Fetch some more random sentences
      const nextParagraph = getRandomParagraph(language, 2);
      setSourceText(prev => prev + " " + nextParagraph);
      setTypedStatuses(prev => [...prev, 'untyped', ...new Array(nextParagraph.length).fill('untyped')]);
    }
  }, [charIndex, sourceText, language, testFinished]);

  // Handle typing inputs
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (testFinished) return;

    // Prevent scrolling default browser actions for spacebar
    if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
    }

    // Capture backspaces
    if (e.key === 'Backspace') {
      if (charIndex > 0) {
        const prevIdx = charIndex - 1;
        setCharIndex(prevIdx);
        
        // Remove correctness status
        setTypedStatuses(prev => {
          const updated = [...prev];
          updated[prevIdx] = 'untyped';
          return updated;
        });

        // Let backspace reduce correct character counts if they deleted a correct key
        if (typedStatuses[prevIdx] === 'correct') {
          setCorrectTypedKeys(c => Math.max(0, c - 1));
        }
      }
      return;
    }

    // Ignore systemic helper commands
    if (e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) {
      return;
    }

    // First keystroke activates timer
    if (!testActive && !testFinished && charIndex === 0) {
      startCountdown();
    }

    const expectedChar = sourceText[charIndex];
    const typedChar = e.key;

    // Safe profiling updates on keys error rate
    const expectedLetterUpper = expectedChar.toUpperCase();
    const isAlphabet = /^[A-Z;,.]$/.test(expectedLetterUpper);

    const updatedStatuses = [...typedStatuses];

    if (typedChar === expectedChar) {
      // SUCCESS key typed
      playBeep(440, 50); // perfect normal key click tone
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
      // MISSED key typed
      playBeep(220, 100); // deeper error buzzer tone
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
    setCharIndex(prev => prev + 1);
  };

  // Always keep kursor visible scrolling beautifully
  useEffect(() => {
    if (activeCharRef.current) {
      activeCharRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }, [charIndex]);

  // Confirming reconfiguration without breaking browser sandbox window rules
  const handleDurationChangeClick = (d: number) => {
    if (testActive && charIndex > 0) {
      setShowConfigAlert({ type: 'timer', value: d });
    } else {
      setSelectedDuration(d);
      initializeTest(d, true);
    }
  };

  // Calculated Realtime values
  const minutesPassed = Math.max(0.01, elapsedSeconds / 60);
  const liveWpm = Math.round((correctTypedKeys / 5) / minutesPassed);
  const liveAccuracy = totalTypedKeys > 0 ? Math.round((correctTypedKeys / totalTypedKeys) * 100) : 100;

  // Render clock circle SVG helper
  const strokeDashoffset = 282.6 - (282.6 * timeLeft) / selectedDuration;

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-2">
      
      {/* Configuration Header Card */}
      <div className="bg-white border border-slate-200 outline-none rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs bg-cyan-100 text-cyan-800 font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider font-mono">
            {practiceKeys ? "Zaif mashq" : (language === 'uz' ? "Maxsus tezlik testi" : "Custom speed test")}
          </span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
            {practiceKeys 
              ? (language === 'uz' ? "Muammoli harflarga yo'naltirilgan dars" : "Troublesome Keys Heavy Drill")
              : (language === 'uz' ? "Vaqt bilan belgilangan mashq" : "Timed Practice Session")}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'uz' 
              ? "Vaqtni tanlang va yozishni boshlang. Soniya taymer birinchi tugma bosilganda o'z-o'zidan ishga tushadi."
              : "Select duration and begin typing. The clock starts automatically on your first keystroke."}
          </p>
        </div>

        {/* Dynamic Selector Timers */}
        {!practiceKeys && (
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start md:self-auto shadow-inner">
            {durations.map(d => (
              <button
                key={d}
                id={`duration-selector-${d}`}
                onClick={() => handleDurationChangeClick(d)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${selectedDuration === d ? 'bg-slate-900 text-cyan-400 font-extrabold shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {d < 60 ? `${d} soniya` : `${d / 60} Daqiqa`}
              </button>
            ))}
          </div>
        )}

        {/* Control toggler buttons */}
        <div className="flex items-center space-x-3 self-end md:self-auto">
          {practiceKeys && (
            <button
              onClick={() => {
                clearPracticeKeys();
                initializeTest(selectedDuration, true);
              }}
              className="px-3 py-1.5 bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-300 cursor-pointer"
            >
              Ushbu zaif mashqni bekor qilish
            </button>
          )}

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${soundEnabled ? 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200 text-cyan-600' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'}`}
            title={language === 'uz' ? "Tovush effektlarini sozlash" : "Toggle Sound Feedback"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Interactive Metrik Bar during test */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Real-time WPM speed card */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-sm flex items-center space-x-3.5">
          <div className="bg-slate-800 p-2.5 rounded-xl text-cyan-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block">WPM (Net speed)</span>
            <span className="text-xl font-extrabold tracking-tight font-mono text-cyan-200">
              {testActive ? liveWpm : (testFinished ? liveWpm : 0)} <span className="text-xs font-sans text-slate-400">DSS</span>
            </span>
          </div>
        </div>

        {/* Live accuracy rate card */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-sm flex items-center space-x-3.5">
          <div className="bg-slate-800 p-2.5 rounded-xl text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block">Aniqlik %</span>
            <span className="text-xl font-extrabold tracking-tight font-mono text-emerald-300">
              {testActive ? liveAccuracy : (testFinished ? liveAccuracy : 100)}%
            </span>
          </div>
        </div>

        {/* Correct metrics total letters */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-sm flex items-center space-x-3.5">
          <div className="bg-slate-800 p-2.5 rounded-xl text-indigo-400">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block">Xatolar soni</span>
            <span className="text-xl font-extrabold tracking-tight font-mono text-rose-300">
              {mistakesCount}
            </span>
          </div>
        </div>

        {/* Active clock circular dial */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-sm flex items-center space-x-3.5">
          {/* Circular countdown SVG logic */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg className="w-10 h-10 transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="18"
                className="stroke-slate-800"
                strokeWidth="2.5"
                fill="transparent"
              />
              <circle
                cx="20"
                cy="20"
                r="18"
                className="stroke-cyan-400 transition-all duration-300"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray="113"
                strokeDashoffset={113 - (113 * timeLeft) / selectedDuration}
              />
            </svg>
            <span className="absolute text-[10px] font-mono font-bold text-cyan-300">
              {timeLeft}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block">Qolgan vaqt</span>
            <span className="text-sm font-bold font-sans text-slate-300">
              {timeLeft} soniya
            </span>
          </div>
        </div>
      </div>

      {/* Primary interactive monospaced active character sheet */}
      {!testFinished ? (
        <div className="relative">
          <div
            id="typing-test-focus-zone"
            ref={containerRef}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            tabIndex={0}
            className="w-full min-h-[160px] p-6 md:p-8 bg-slate-900 border border-slate-800 shadow-inner rounded-3xl outline-none focus:ring-4 focus:ring-cyan-500/20 text-slate-300 transition-all cursor-pointer relative overflow-hidden"
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
                    {language === 'uz' ? "MASHQNI BOSHLASH" : "ACTIVATE PRACTICE"}
                  </h4>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    {language === 'uz' 
                      ? "Yozishni boshlash hamda klaviaturangiz darsini boshlash uchun ushbu oyna ustiga bosing yoki quyidagi tugmani kiriting."
                      : "Click the button below or anywhere inside this box to activate the keyboard and start typing."}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      containerRef.current?.focus();
                    }}
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-black rounded-xl text-xs hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
                  >
                    {language === 'uz' ? "⚡ BOSHLASH (START)" : "⚡ START PRACTICE"}
                  </button>
                </div>
              </div>
            )}

            {/* Custom Monospaced typography with whole-word wrapping */}
            <div className="text-2xl md:text-3xl font-mono leading-relaxed tracking-wider select-none text-slate-400 flex flex-wrap gap-x-2 whitespace-pre-wrap text-left antialiased">
              {(() => {
                // Segment text into whole words, bundling the space character at the end of each word.
                // This is used for perfect non-splitting, word-by-word responsive text-wrapping layout.
                const words: { id: number; chars: { char: string; absIndex: number }[] }[] = [];
                let currentWord: { id: number; chars: { char: string; absIndex: number }[] } = { id: 0, chars: [] };
                let wordId = 0;
                
                for (let i = 0; i < sourceText.length; i++) {
                  const char = sourceText[i];
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
                          ref={isCursor ? activeCharRef : null}
                          className={`relative inline-block ${charClass} ${isCursor ? 'text-white border-b-2 border-cyan-400' : ''}`}
                          style={{ minWidth: char === ' ' ? '12px' : 'auto' }}
                        >
                          {/* Blinking actual cursor line on left element border */}
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
          
          <div className="flex items-center justify-between text-xs text-slate-400 mt-2 px-1">
            <span>Klaviaturada yozayotganda barmoqlaringizga qaramaslikka intiling.</span>
            <span>Pozitsiya: {charIndex} / {sourceText.length}</span>
          </div>
        </div>
      ) : (
        /* Detailed post-test analytical sheet layout card */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-slate-200 p-8 rounded-3xl shadow-lg relative overflow-hidden"
        >
          {/* Gold sparkles background decor elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl" />

          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-500">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">
                Sinov Muvaffaqiyatli Yakunlandi!
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Siz {selectedDuration / 60} daqiqalik yozish sinovini to'liq bajardingiz. Natijangiz statistika boshqaruv paneliga kiritildi.
              </p>
            </div>

            {/* Performance metrics breakdown bento grids */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto pt-4">
              <div className="bg-slate-50 border border-slate-200/85 relative rounded-2xl p-4 text-center">
                <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block">Tezlik</span>
                <span className="text-3xl font-black text-slate-900 font-mono">
                  {liveWpm} <span className="text-xs font-sans text-slate-500">WPM</span>
                </span>
                <span className="block text-[10px] text-slate-500 mt-1">Daqiqada so'zlar</span>
              </div>

              <div className="bg-slate-50 border border-slate-200/85 relative rounded-2xl p-4 text-center">
                <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block">Aniq Harflar</span>
                <span className="text-3xl font-black text-slate-900 font-mono">
                  {liveAccuracy}%
                </span>
                <span className="block text-[10px] text-slate-500 mt-1">Imlo foizi</span>
              </div>

              <div className="bg-slate-50 border border-slate-200/85 relative rounded-2xl p-4 text-center">
                <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block">Xatoliklar</span>
                <span className="text-3xl font-black text-rose-600 font-mono">
                  {mistakesCount}
                </span>
                <span className="block text-[10px] text-slate-500 mt-1">Klaviaturadagi xato</span>
              </div>

              <div className="bg-slate-50 border border-slate-200/85 relative rounded-2xl p-4 text-center">
                <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block">Jarayon</span>
                <span className="text-3xl font-black text-amber-500 font-mono inline-flex items-center space-x-1 justify-center">
                  <span>
                    {liveAccuracy >= 95 ? "⭐⭐⭐" : (liveAccuracy >= 85 ? "⭐⭐" : "⭐")}
                  </span>
                </span>
                <span className="block text-[10px] text-slate-500 mt-1">Muvaffaqiyat bahosi</span>
              </div>
            </div>

            {/* Actions for repeating tests */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 max-w-sm mx-auto">
              <button
                id="speed-test-restart-button"
                onClick={() => initializeTest(selectedDuration, true)}
                className="w-full py-4.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold text-sm rounded-2xl flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Yangi test boshlash</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Safe confirmation alerts built inside react state to prevent sandbox problems with native prompts */}
      {showConfigAlert && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-150 shadow-2xl text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-rose-50 border border-rose-200 text-rose-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h4 className="text-lg font-bold text-slate-900">Mashqni to'xtatishni istaysizmi?</h4>
            
            <p className="text-sm text-slate-500">
              Faol tezlik sinov jarayoni joriy vaqtda davom etmoqda. Agar hozir parametrni o'zgartirsangiz, ushbu test natijasi saqlanmaydi.
            </p>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => {
                  const targetVal = showConfigAlert.value;
                  setSelectedDuration(targetVal);
                  initializeTest(targetVal, true);
                  setShowConfigAlert(null);
                }}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-2xl text-sm transition-all cursor-pointer"
              >
                Ha, qat'iy boshlash
              </button>
              <button
                onClick={() => setShowConfigAlert(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition-all cursor-pointer"
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
