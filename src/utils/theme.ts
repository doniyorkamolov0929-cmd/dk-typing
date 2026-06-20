/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ThemeColors {
  id: 'classic' | 'dracula' | 'nord' | 'cyberpunk' | 'retro';
  nameUz: string;
  nameEn: string;
  appBg: string; // Tailwind bg class for outer layout
  cardBg: string; // Tailwind bg class for cards
  sidebarBg: string; // Tailwind bg class for sidebar
  border: string; // Tailwind border styling
  textPrimary: string; // Primary readable text class
  textSecondary: string; // Description text class
  accent: string; // Primay accent color (cyan/pink etc)
  accentHover: string;
  accentBtn: string; // Primary button color class
  accentBtnText: string;
  focusAccent: string; // focus border class
  correctChar: string; // styling for correct letters
  incorrectChar: string; // styling for incorrect letters
  typingBoxBg: string; // typing container bg
}

export const THEMES: Record<ThemeColors['id'], ThemeColors> = {
  classic: {
    id: 'classic',
    nameUz: 'Klassik Slate (Asosiy)',
    nameEn: 'Classic Slate (Default)',
    appBg: 'bg-slate-50 text-slate-900',
    cardBg: 'bg-white border-slate-200 shadow-sm',
    sidebarBg: 'bg-slate-900 border-slate-800',
    border: 'border-slate-200',
    textPrimary: 'text-slate-800',
    textSecondary: 'text-slate-500',
    accent: 'text-cyan-600',
    accentHover: 'hover:bg-cyan-100 border-cyan-200 text-cyan-600',
    accentBtn: 'bg-zinc-900 hover:bg-zinc-800 text-cyan-400',
    accentBtnText: 'text-white',
    focusAccent: 'focus:ring-cyan-500/20',
    correctChar: 'text-emerald-500 font-semibold bg-emerald-500/10 rounded-sm',
    incorrectChar: 'text-rose-550 bg-rose-500/15 rounded-sm px-0.5 border border-rose-500/30',
    typingBoxBg: 'bg-slate-900 border-slate-800 text-slate-300'
  },
  dracula: {
    id: 'dracula',
    nameUz: 'Drakula (Tungi)',
    nameEn: 'Dracula (Dark Theme)',
    appBg: 'bg-slate-950 text-slate-100',
    cardBg: 'bg-slate-900/60 border-slate-800 border shadow-lg',
    sidebarBg: 'bg-slate-950 border-slate-900',
    border: 'border-slate-805',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    accent: 'text-pink-400',
    accentHover: 'hover:bg-pink-950/30 border-pink-500/20 text-pink-400',
    accentBtn: 'bg-pink-600 hover:bg-pink-500 text-white',
    accentBtnText: 'text-white',
    focusAccent: 'focus:ring-pink-500/20',
    correctChar: 'text-emerald-400 font-semibold bg-emerald-500/10 rounded',
    incorrectChar: 'text-rose-400 bg-rose-500/20 rounded px-0.5 border border-rose-500/30',
    typingBoxBg: 'bg-slate-950/80 border-slate-800 text-slate-300'
  },
  nord: {
    id: 'nord',
    nameUz: 'Arktika Frost (Sokin)',
    nameEn: 'Nordic Frost (Clean)',
    appBg: 'bg-slate-900 text-slate-100',
    cardBg: 'bg-[#3b4252] border border-[#434c5e] shadow-md',
    sidebarBg: 'bg-[#2e3440] border-[#3b4252]',
    border: 'border-[#434c5e]',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-300',
    accent: 'text-sky-400',
    accentHover: 'hover:bg-sky-900/30 border-sky-400/25 text-sky-450',
    accentBtn: 'bg-[#4c566a] hover:bg-[#5e81ac] text-sky-305',
    accentBtnText: 'text-white',
    focusAccent: 'focus:ring-sky-400/20',
    correctChar: 'text-emerald-300 font-semibold bg-emerald-500/15 rounded',
    incorrectChar: 'text-rose-350 bg-rose-500/20 rounded px-0.5 border border-rose-500/40',
    typingBoxBg: 'bg-[#2e3440] border-[#3b4252] text-slate-200'
  },
  cyberpunk: {
    id: 'cyberpunk',
    nameUz: 'Kiberpank (Neon)',
    nameEn: 'Cyberpunk Neon (Vibrant)',
    appBg: 'bg-black text-[#facc15]',
    cardBg: 'bg-neutral-950 border border-emerald-500/20 shadow-neon',
    sidebarBg: 'bg-neutral-950 border-neutral-800',
    border: 'border-emerald-500/10',
    textPrimary: 'text-[#facc15] font-semibold',
    textSecondary: 'text-neutral-400',
    accent: 'text-emerald-400',
    accentHover: 'hover:bg-emerald-950/30 border-emerald-500/20 text-emerald-450',
    accentBtn: 'bg-emerald-500 text-black font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:bg-emerald-400',
    accentBtnText: 'text-black',
    focusAccent: 'focus:ring-emerald-500/25',
    correctChar: 'text-emerald-400 font-semibold bg-emerald-500/15 rounded border border-emerald-500/30',
    incorrectChar: 'text-[#ff5555] bg-red-950/40 rounded px-0.5 border border-red-500/50',
    typingBoxBg: 'bg-black border border-emerald-500/30 text-emerald-400 font-mono text-shadow-neon'
  },
  retro: {
    id: 'retro',
    nameUz: 'Krem Qogʻoz (Sariq)',
    nameEn: 'Cream Retro (Eye-Safe)',
    appBg: 'bg-[#fdf6e3] text-[#586e75]',
    cardBg: 'bg-[#f5ebd5] border border-[#e3d3b5] shadow-sm',
    sidebarBg: 'bg-[#073642] border-[#0a4858]',
    border: 'border-[#e3d3b5]',
    textPrimary: 'text-[#586e75]',
    textSecondary: 'text-[#93a1a1]',
    accent: 'text-[#b58900]',
    accentHover: 'hover:bg-[#eee8d5] border-[#b58900]/30 text-[#b58900]',
    accentBtn: 'bg-[#859900] hover:bg-[#6c7d00] text-white',
    accentBtnText: 'text-white',
    focusAccent: 'focus:ring-[#b58900]/20',
    correctChar: 'text-emerald-800 font-semibold bg-green-700/10 rounded',
    incorrectChar: 'text-rose-850 bg-rose-500/15 rounded px-0.5 border border-rose-500/30',
    typingBoxBg: 'bg-[#eee8d5] border-[#dfd5bc] text-[#586e75]'
  }
};
