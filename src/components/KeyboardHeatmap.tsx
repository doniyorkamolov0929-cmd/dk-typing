/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile } from '../types';
import { RefreshCw, Play, AlertTriangle } from 'lucide-react';

interface KeyboardHeatmapProps {
  profile: UserProfile;
  onPracticeProblemKeys: (keys: string[]) => void;
}

export default function KeyboardHeatmap({ profile, onPracticeProblemKeys }: KeyboardHeatmapProps) {
  // Key rows for QWERTY representation
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.']
  ];

  // Helper to calculate statistics for a given key
  const getKeyStats = (key: string) => {
    const k = key.toUpperCase();
    const errors = profile.keyErrors[k] || 0;
    const total = profile.keyTotal[k] || 0;
    
    let errorRate = 0;
    if (total > 0) {
      errorRate = (errors / total) * 100;
    }

    return { errors, total, errorRate };
  };

  // Get problem keys (keys with error rate >= 20% and total typed >= 5, errors > 2)
  const getProblemKeysList = () => {
    const list: { key: string; errorRate: number; errors: number; total: number }[] = [];
    Object.keys(profile.keyTotal).forEach(k => {
      const total = profile.keyTotal[k] || 0;
      const errors = profile.keyErrors[k] || 0;
      if (total >= 5 && errors > 2) {
        const rate = (errors / total) * 100;
        if (rate >= 20) {
          list.push({ key: k, errorRate: rate, errors, total });
        }
      }
    });
    return list.sort((a, b) => b.errorRate - a.errorRate);
  };

  const problemKeys = getProblemKeysList();

  // Color mapper based on error rates
  const getKeyClass = (key: string) => {
    const { total, errorRate, errors } = getKeyStats(key);
    
    if (total === 0) {
      return 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
    }

    if (errors > 2 && errorRate >= 20) {
      // High/critical error: thick crimson gradient
      return 'bg-gradient-to-br from-red-500 to-rose-600 border-red-600 text-white font-extrabold shadow-sm scale-95 shadow-red-500/20';
    } else if (errors >= 2 && errorRate >= 8) {
      // Moderate error: soft pink/rose style
      return 'bg-rose-100 border-rose-300 text-rose-800 font-semibold';
    } else {
      // Safe key: soft emerald-green tint or clean standard grey
      return 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100';
    }
  };

  const handlePracticeClick = () => {
    if (problemKeys.length > 0) {
      const keysToPractice = problemKeys.map(pk => pk.key.toLowerCase());
      onPracticeProblemKeys(keysToPractice);
    } else {
      // Default to home row keys practice if no problem keys found
      onPracticeProblemKeys(['a', 's', 'd', 'f', 'j', 'k', 'l']);
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">
            Klaviatura Aniqligi Issiqlik Xaritasi (Heatmap)
          </h3>
          <p className="text-sm text-slate-500">
            Xatolik foiziga asosan ranglangan interaktiv virtual klaviatura. Barmoq ko'nikmalaringizni nazorat qiling.
          </p>
        </div>

        {/* Action practicing trouble buttons */}
        <button
          id="practice-problem-keys-button"
          onClick={handlePracticeClick}
          className="flex items-center justify-center space-x-2 px-5 py-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-semibold text-sm transition-all shadow-md cursor-pointer self-start md:self-auto"
        >
          <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
          <span>
            {problemKeys.length > 0 
              ? "Muammoli Tugmalarni Mashq Qilish" 
              : "Asosiy Tugmalarni Mashq Qilish"}
          </span>
        </button>
      </div>

      {/* Visual Keyboard Grid */}
      <div className="space-y-2.5 max-w-3xl mx-auto p-4 bg-slate-100 rounded-2xl border border-slate-200/60 shadow-inner">
        {rows.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1 md:gap-1.5">
            {/* Shift Row Adjustments Indent Spacer */}
            {rIdx === 1 && <div className="w-2.5 md:w-3" />}
            {rIdx === 2 && <div className="w-5 md:w-6" />}

            {row.map(key => {
              const { errorRate, total } = getKeyStats(key);
              return (
                <div
                  key={key}
                  className={`w-9 h-11 sm:w-11 sm:h-12 md:w-14 md:h-14 flex flex-col items-center justify-between py-1.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all select-none group relative ${getKeyClass(key)}`}
                >
                  <span className="text-sm sm:text-base">{key}</span>
                  <span className="text-[9px] scale-90 sm:scale-100 text-slate-400 group-hover:text-slate-600 font-mono">
                    {total > 0 ? `${Math.round(errorRate)}%` : '0%'}
                  </span>

                  {/* Hover stats tool-tip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-slate-900 text-white rounded-lg text-[10px] sm:text-xs whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-10 shadow-lg border border-slate-700">
                    <div>Tugma: <strong className="text-cyan-400">{key}</strong></div>
                    <div>Yozildi: {total} marta</div>
                    <div>Xatolar: {profile.keyErrors[key.toUpperCase()] || 0} marta</div>
                    <div>Xatolik: {total > 0 ? Math.round(errorRate) : 0}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Spacebar Row */}
        <div className="flex justify-center mt-2.5">
          <div className="w-56 sm:w-72 md:w-96 h-10 sm:h-11 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-[10px] uppercase tracking-widest font-mono shadow-sm">
            probel
          </div>
        </div>
      </div>

      {/* Legend and lists of focus issues */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-150">
        <div className="flex items-center space-x-2.5">
          <div className="w-4 h-4 rounded bg-slate-50 border border-slate-200" />
          <span className="text-xs text-slate-600">Yozilmagan yoki Mukammal (0% - 7%, xatolar &lt; 2)</span>
        </div>
        <div className="flex items-center space-x-2.5">
          <div className="w-4 h-4 rounded bg-rose-100 border border-rose-300" />
          <span className="text-xs text-slate-600">O'rtacha xatolik (8% - 19%, xatolar &gt;= 2)</span>
        </div>
        <div className="flex items-center space-x-2.5">
          <div className="w-4 h-4 rounded bg-red-500 border border-red-600 shadow-sm" />
          <span className="text-xs text-slate-600">{"Yuqori muammo (>= 20%, xatolar > 2)"}</span>
        </div>
      </div>

      {/* Troubled Keys descriptive items */}
      {problemKeys.length > 0 ? (
        <div className="p-4 bg-rose-50 border border-rose-200/50 rounded-2xl flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5 animate-bounce" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-900">Sizda qiyinchilik tug'diruvchi harflar aniqlandi!</h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {problemKeys.slice(0, 5).map(pk => (
                <span key={pk.key} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-rose-100 border border-rose-200 text-rose-800 text-xs font-mono">
                  <strong>'{pk.key}'</strong>: {Math.round(pk.errorRate)}% xato ({pk.errors}/{pk.total})
                </span>
              ))}
            </div>
            <p className="text-xs text-rose-700/80 mt-1">
              "Muammoli tugmalarni mashq qilish" tugmasini bosing va ushbu harflardan ko'proq foydalanadigan maxsus mashqni boshlang.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50 border border-emerald-200/40 rounded-2xl">
          <p className="text-xs text-emerald-800 font-medium">
            Ajoyib natija! Hozircha sizda muntazam xatoga uchraydigan zaif harflar aniqlanmadi. Klaviaturada yozayotganda barmoqlaringiz aniq va toza harakatlanmoqda.
          </p>
        </div>
      )}
    </div>
  );
}
