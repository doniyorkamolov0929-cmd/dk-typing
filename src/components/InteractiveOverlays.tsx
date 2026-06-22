import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { respondToFriendRequest, updateGameRequest } from '../lib/sync';
import { UserPlus, Gamepad2, Check, X } from 'lucide-react';

interface OverlayProps {
  profile: UserProfile;
  language: 'uz' | 'en';
  onPlayMultiplayer: (roomId: string) => void;
}

export default function InteractiveOverlays({ profile, language, onPlayMultiplayer }: OverlayProps) {
  const [incomingFriendRequests, setIncomingFriendRequests] = useState<any[]>([]);
  const [incomingGameRequests, setIncomingGameRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!profile.uid || profile.authType !== 'google') return;

    const frQ = query(collection(db, 'friendRequests'), where('toUid', '==', profile.uid), where('status', '==', 'pending'));
    const frUnsub = onSnapshot(frQ, (snap) => {
      const arr: any[] = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setIncomingFriendRequests(arr);
    }, (err) => console.warn(err));

    const grQ = query(collection(db, 'gameRequests'), where('toUid', '==', profile.uid), where('status', '==', 'pending'));
    const grUnsub = onSnapshot(grQ, (snap) => {
      const arr: any[] = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setIncomingGameRequests(arr.filter(a => Date.now() - a.timestamp < 180000));
    }, (err) => console.warn(err));

    const ogQ = query(collection(db, 'gameRequests'), where('fromUid', '==', profile.uid), where('status', '==', 'accepted'));
    const ogUnsub = onSnapshot(ogQ, (snap) => {
      snap.forEach(d => {
         const data = d.data();
         if (Date.now() - data.timestamp < 180000) {
            onPlayMultiplayer(data.roomId);
         }
      });
    }, (err) => console.warn(err));

    return () => {
      frUnsub();
      grUnsub();
      ogUnsub();
    };
  }, [profile.uid, onPlayMultiplayer]);

  const onAcceptFriend = async (req: any) => {
    await respondToFriendRequest(req.id, 'accepted', req.fromUid, req.toUid);
  };
  const onRejectFriend = async (req: any) => {
    await respondToFriendRequest(req.id, 'rejected', req.fromUid, req.toUid);
  };

  const onAcceptGame = async (req: any) => {
    await updateGameRequest(req.id, 'accepted');
    onPlayMultiplayer(req.roomId);
  };
  const onRejectGame = async (req: any) => {
    await updateGameRequest(req.id, 'declined');
  };

  return (
    <>
      <AnimatePresence>
        {incomingFriendRequests.map((req) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[1000] bg-slate-900 border border-indigo-500/30 p-5 rounded-2xl shadow-2xl shadow-indigo-500/20 max-w-sm"
          >
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                <UserPlus className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="space-y-3">
                <p className="text-sm text-slate-200">
                  <strong className="text-white">{req.fromName}</strong> 
                  {language === 'uz' ? " sizni do'stlikka taklif qilyapti." : " sent you a friend request."}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => onAcceptFriend(req)} className="flex-1 py-1.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {language === 'uz' ? "Qo'shish" : "Accept"}
                  </button>
                  <button onClick={() => onRejectFriend(req)} className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg flex items-center justify-center gap-1">
                    <X className="w-3.5 h-3.5" /> {language === 'uz' ? "Rad etish" : "Decline"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {incomingGameRequests.map((req) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, top: -100 }}
            animate={{ opacity: 1, top: 24 }}
            exit={{ opacity: 0, top: -100 }}
            className="fixed left-1/2 -translate-x-1/2 z-[1000] bg-gradient-to-br from-emerald-900 to-slate-900 border border-emerald-500/50 p-6 rounded-3xl shadow-2xl shadow-emerald-500/20 w-11/12 max-w-md"
          >
            <div className="flex flex-col text-center items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <Gamepad2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-white">
                  {req.fromName} {language === 'uz' ? "bilan poygami?" : "wants to race?"}
                </h3>
                <p className="text-sm text-slate-300">
                  {language === 'uz' 
                    ? "1 daqiqalik matn yozish poygasiga taklif!"
                    : "Challenge to a 1 minute typing race!"}
                </p>
              </div>
              <div className="w-full flex gap-3 mt-2">
                <button onClick={() => onRejectGame(req)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold rounded-xl transition-colors">
                  {language === 'uz' ? "Yo'q" : "No"}
                </button>
                <button onClick={() => onAcceptGame(req)} className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 text-sm font-black tracking-wide rounded-xl shadow-lg transition-transform active:scale-95">
                  {language === 'uz' ? "HA" : "ACCEPT"}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
}
