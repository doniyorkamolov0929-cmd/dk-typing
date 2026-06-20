/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  fullName: string;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalStars: number;
  unlockedLessons: Record<string, boolean>; // e.g., 'uz-1': true, etc.
  lessonStars: Record<string, number>; // e.g., 'uz-1': 3
  lessonWpm: Record<string, number>; // e.g., 'uz-1': 45
  lessonAccuracy: Record<string, number>; // e.g., 'uz-1': 95
  keyErrors: Record<string, number>; // e.g., 'A': 12
  keyTotal: Record<string, number>; // e.g., 'A': 100
  isAlternativeCycle: boolean; // For elite prestige alternative lesson texts
  theme?: 'classic' | 'dracula' | 'nord' | 'cyberpunk' | 'retro'; // Custom styling themes
  soundEnabled?: boolean; // Audible keypad sounds
  soundType?: 'blue' | 'brown' | 'typewriter' | 'beep'; // Cherry MX switches or classic typewriter
}

export interface TestHistoryEntry {
  id: string;
  date: string; // ISO String
  wpm: number;
  accuracy: number;
  durationSeconds: number;
  language: 'uz' | 'en';
  type: 'speedtest' | 'lesson';
  name: string; // "1 Daqiqalik Test" or "Boshlang'ich: 1-dars"
}
