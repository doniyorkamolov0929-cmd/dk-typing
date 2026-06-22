/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, TestHistoryEntry } from '../types';

const PROFILE_KEY = 'dk_typing_profile_v2';
const HISTORY_KEY = 'dk_typing_history_v2';

export const INITIAL_PROFILE: UserProfile = {
  fullName: '',
  streak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalStars: 0,
  unlockedLessons: {
    '1': true,   // Beginner Lesson 1
    '21': true,  // Intermediate Lesson 1 (Always open!)
    '41': true   // Advanced Lesson 1 (Always open!)
  },
  lessonStars: {},
  lessonWpm: {},
  lessonAccuracy: {},
  keyErrors: {},
  keyTotal: {},
  isAlternativeCycle: false,
  theme: 'classic',
  soundEnabled: true,
  soundType: 'blue'
};

// Safe access to localStorage
export function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) {
      const defaultProfile = { ...INITIAL_PROFILE };
      defaultProfile.id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      defaultProfile.accountId = Math.floor(10000 + Math.random() * 90000).toString();
      saveStoredProfile(defaultProfile);
      return defaultProfile;
    }
    const parsed = JSON.parse(raw);
    let needSave = false;
    if (!parsed.id) {
      parsed.id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      needSave = true;
    }
    if (!parsed.accountId) {
      parsed.accountId = Math.floor(10000 + Math.random() * 90000).toString();
      needSave = true;
    }
    if (needSave) {
      saveStoredProfile(parsed);
    }
    
    // Ensure 1, 21, and 41 are unlocked by default as per the requirement
    const unlocked = { ...parsed.unlockedLessons };
    unlocked['1'] = true;
    unlocked['21'] = true;
    unlocked['41'] = true;

    return {
      ...INITIAL_PROFILE,
      ...parsed,
      unlockedLessons: unlocked
    };
  } catch (e) {
    console.error("Storage read failed, returning default profile:", e);
    return { ...INITIAL_PROFILE };
  }
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("Storage write failed:", e);
  }
}

export function getStoredHistory(): TestHistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Storage history read failed:", e);
    return [];
  }
}

export function saveStoredHistory(history: TestHistoryEntry[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error("Storage history write failed:", e);
  }
}

export function addHistoryEntry(entry: Omit<TestHistoryEntry, 'id' | 'date'>): TestHistoryEntry[] {
  const history = getStoredHistory();
  const fullEntry: TestHistoryEntry = {
    ...entry,
    id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    date: new Date().toISOString()
  };
  const updated = [fullEntry, ...history];
  saveStoredHistory(updated);
  return updated;
}

export function calculateUpdatedStreak(lastDateStr: string, currentStreak: number): { streak: number; todayStr: string } {
  const todayStr = new Date().toISOString().split('T')[0];
  if (!lastDateStr) {
    return { streak: 1, todayStr };
  }

  if (lastDateStr === todayStr) {
    return { streak: currentStreak || 1, todayStr };
  }

  const lastActive = new Date(lastDateStr);
  const today = new Date(todayStr);
  const diffTime = Math.abs(today.getTime() - lastActive.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return { streak: (currentStreak || 0) + 1, todayStr };
  } else if (diffDays > 1) {
    return { streak: 1, todayStr };
  }

  return { streak: currentStreak || 1, todayStr };
}

export function clearAllStorageData(): void {
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error("Failed to clear local storage:", e);
  }
}
