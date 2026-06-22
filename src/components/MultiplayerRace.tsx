import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { getRandomTestText } from '../data/sentences';
import { Swords, Loader2, Trophy, ArrowRight, X } from 'lucide-react';

interface Props {
  profile: UserProfile;
  language: 'uz' | 'en';
  roomId: string;
  onLeave: () => void;
}

export default function MultiplayerRace({ profile, language, roomId, onLeave }: Props) {
  const [roomData, setRoomData] = useState<any>(null);
  const [typed, setTyped] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [status, setStatus] = useState<'waiting' | 'countdown' | 'playing' | 'finished'>('waiting');
  
  const [words, setWords] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync with Firestore doc
  useEffect(() => {
    if (!roomId) return;
    const unsub = onSnapshot(doc(db, 'rooms', roomId), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setRoomData(d);
        if (words.length === 0 && d.seedText) {
          setWords(d.seedText.split(' '));
        }
        
        if (d.status === 'countdown' && status === 'waiting') {
          setStatus('countdown');
        } else if (d.status === 'playing' && status === 'countdown') {
          setStatus('playing');
        } else if (d.status === 'finished' && status === 'playing') {
          setStatus('finished');
        }
      } else {
        // Init room if we are creator
        if (status === 'waiting') {
           const initialText = getRandomTestText(language, 'time', 'javascript', 3);
           setWords(initialText.split(' '));
           setDoc(doc(db, 'rooms', roomId), {
             seedText: initialText,
             status: 'waiting',
             players: {
                [profile.uid!]: { name: profile.fullName, progress: 0, wpm: 0, ready: true }
             }
           });
        }
      }
    }, (error) => {
      console.warn('Room snapshot error:', error);
    });
    return unsub;
  }, [roomId]);

  // Join room
  useEffect(() => {
    if (!profile.uid || !roomData || roomData.players[profile.uid]) return;
    setDoc(doc(db, 'rooms', roomId), {
      players: {
        ...roomData.players,
        [profile.uid]: { name: profile.fullName, progress: 0, wpm: 0, ready: true }
      }
    }, { merge: true });
  }, [roomData, profile.uid, roomId]);

  // Check start condition
  useEffect(() => {
    if (status !== 'waiting' || !roomData || !roomData.players) return;
    const pKeys = Object.keys(roomData.players);
    if (pKeys.length === 2) {
      // Both joined, start countdown if we are "host" (just first one alphabetically to avoid double writes)
      const sortedKeys = [...pKeys].sort();
      if (profile.uid === sortedKeys[0]) {
         setDoc(doc(db, 'rooms', roomId), { ...roomData, status: 'countdown', startAt: Date.now() + 4000 });
      }
    }
  }, [roomData, status, profile.uid, roomId]);

  // Countdown and Game Loop
  useEffect(() => {
    let i: any;
    if (status === 'countdown' && roomData?.startAt) {
      i = setInterval(() => {
        const diff = roomData.startAt - Date.now();
        if (diff <= 0) {
          setStatus('playing');
          if (inputRef.current) inputRef.current.focus();
        }
      }, 100);
    } else if (status === 'playing' && roomData?.startAt) {
      i = setInterval(() => {
        const elapsed = (Date.now() - roomData.startAt) / 1000;
        const remaining = Math.max(0, 60 - Math.floor(elapsed));
        setTimeLeft(remaining);
        
        if (remaining === 0) {
           setStatus('finished');
           setDoc(doc(db, 'rooms', roomId), { status: 'finished' }, { merge: true });
        }
      }, 1000);
    }
    return () => clearInterval(i);
  }, [status, roomData?.startAt, roomId]);

  // Calculate WPM and sync
  useEffect(() => {
    if (status !== 'playing' || !roomData?.startAt || !profile.uid) return;
    const wordsTyped = typed.trim().split(' ').length;
    const elapsedMinutes = (Date.now() - roomData.startAt) / 60000;
    const rawWpm = Math.floor(wordsTyped / elapsedMinutes) || 0;
    
    // Sync to DB every second max or on typing
    const id = setTimeout(() => {
      setDoc(doc(db, 'rooms', roomId), {
        players: {
          ...roomData.players,
          [profile.uid]: { ...roomData.players[profile.uid], progress: wordsTyped, wpm: rawWpm }
        }
      }, { merge: true });
    }, 500);
    return () => clearTimeout(id);
  }, [typed, status]);

  const opponentInfo = React.useMemo(() => {
    if (!roomData?.players) return null;
    const ops = Object.keys(roomData.players).filter(id => id !== profile.uid);
    if (!ops.length) return null;
    return { ...roomData.players[ops[0]], id: ops[0] };
  }, [roomData, profile.uid]);

  const selfInfo = roomData?.players?.[profile.uid!];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in pt-8 pb-16">
      
      {/* Header Info */}
      <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-sm font-bold text-slate-400">{language === 'uz' ? "Siz" : "You"}</p>
            <p className="text-xl font-black text-cyan-400">{selfInfo?.wpm || 0} WPM</p>
          </div>
          <Swords className="w-8 h-8 text-amber-500 mx-4" />
          <div className="text-center">
            <p className="text-sm font-bold text-slate-400">{opponentInfo?.name || (language === 'uz' ? "Kutilmoqda..." : "Waiting...")}</p>
            <p className="text-xl font-black text-rose-400">{opponentInfo?.wpm || 0} WPM</p>
          </div>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-widest">{language === 'uz' ? "Vaqt" : "Time"}</p>
            <p className={`text-4xl font-black font-mono ${timeLeft <= 10 ? 'text-rose-500 animate-pulse' : 'text-slate-100'}`}>
              {timeLeft}s
            </p>
          </div>
          <button onClick={onLeave} className="p-3 bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-6">
         <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-400">
              <span className="text-cyan-400">{profile.fullName}</span>
              <span>{selfInfo?.progress || 0} / {words.length}</span>
            </div>
            <div className="h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
               <motion.div 
                 className="h-full bg-cyan-500" 
                 animate={{ width: `${Math.min(100, ((selfInfo?.progress||0) / words.length) * 100)}%` }} 
                 transition={{ ease: 'linear' }}
               />
            </div>
         </div>
         {opponentInfo && (
           <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-400">
              <span className="text-rose-400">{opponentInfo.name}</span>
              <span>{opponentInfo.progress || 0} / {words.length}</span>
            </div>
            <div className="h-4 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
               <motion.div 
                 className="h-full bg-rose-500" 
                 animate={{ width: `${Math.min(100, ((opponentInfo.progress||0) / words.length) * 100)}%` }} 
                 transition={{ ease: 'linear' }}
               />
            </div>
           </div>
         )}
      </div>

      {/* Game Area */}
      {status === 'waiting' && (
         <div className="py-20 text-center">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white tracking-tight">
              {language === 'uz' ? "Raqib ulanishi kutilmoqda..." : "Waiting for opponent..."}
            </h2>
         </div>
      )}

      {status === 'countdown' && (
         <div className="py-20 text-center">
            <h2 className="text-8xl font-black text-white font-mono animate-bounce drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              {Math.max(1, Math.ceil(((roomData?.startAt || 0) - Date.now()) / 1000))}
            </h2>
         </div>
      )}

      {(status === 'playing' || status === 'finished') && (
        <div 
          onClick={() => inputRef.current?.focus()}
          className="bg-slate-900/40 border border-slate-800/80 p-8 rounded-3xl text-left relative overflow-hidden font-mono text-2xl leading-relaxed text-slate-500 flex flex-wrap gap-x-3 gap-y-2 cursor-text"
        >
          {status === 'finished' && (
            <div className="absolute inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-center justify-center">
               <div className="text-center p-8 bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl">
                 <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                 <h2 className="text-3xl font-black text-white mb-2">
                   {selfInfo?.wpm === opponentInfo?.wpm ? (language === 'uz' ? 'DURANG!' : 'DRAW!') : 
                    ((selfInfo?.wpm||0) > (opponentInfo?.wpm||0) ? (language === 'uz' ? "SIZ YUTDINGIZ!" : "YOU WON!") : (language === 'uz' ? `MAG'LUBIYAT` : "YOU LOST"))}
                 </h2>
                 <p className="text-slate-400 text-lg">
                   {selfInfo?.wpm} WPM <span className="text-slate-600 px-2 lg px-2">vs</span> {opponentInfo?.wpm} WPM
                 </p>
                 <button onClick={onLeave} className="mt-6 px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl">
                   {language === 'uz' ? "Orqaga" : "Go Back"}
                 </button>
               </div>
            </div>
          )}

          {words.join(' ').split('').map((char, index) => {
            let color = 'text-slate-500';
            let bg = '';
            // Basic matching highlighting
            if (index < typed.length) {
              if (typed[index] === char) {
                color = 'text-slate-200';
              } else {
                color = 'text-rose-400';
                bg = 'bg-rose-500/20';
              }
            } else if (index === typed.length) {
              bg = 'bg-cyan-500/20 shadow-[0_0_8px_rgba(6,182,212,0.5)]';
              color = 'text-cyan-400';
            }
            return (
              <span key={index} className={`${color} ${bg} rounded-sm transition-colors duration-75 inline-block`}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}

          {/* Hidden input field for mobile/desktop unified input */}
          <input
            ref={inputRef}
            type="text"
            className="absolute opacity-0 -z-10"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={status !== 'playing'}
            autoFocus
          />
        </div>
      )}
    </div>
  );
}
