import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import { UserProfile, TestHistoryEntry } from "../types";

// Merge local profile and firestore profile by taking the maximum or latest of each metric
export function mergeProfiles(local: UserProfile, remote: UserProfile): UserProfile {
  const merged: UserProfile = { ...local };

  // Set fullName from remote if empty locally, or vice versa
  merged.fullName = remote.fullName || local.fullName;
  
  // Choose the higher streak or use latest activity date
  if (remote.streak > local.streak) {
    merged.streak = remote.streak;
  }
  
  // Merge totalStars (take maximum)
  merged.totalStars = Math.max(local.totalStars || 0, remote.totalStars || 0);

  // Merge theme and sound preferences
  merged.theme = remote.theme || local.theme || 'classic';
  merged.soundEnabled = remote.soundEnabled !== undefined ? remote.soundEnabled : local.soundEnabled;
  merged.soundType = remote.soundType || local.soundType || 'blue';
  
  // Merge unlockedLessons keys
  const localUnlocked = local.unlockedLessons || {};
  const remoteUnlocked = remote.unlockedLessons || {};
  const mergedUnlocked = { ...localUnlocked, ...remoteUnlocked };
  
  // Always ensure default keys are open
  mergedUnlocked['1'] = true;
  mergedUnlocked['21'] = true;
  mergedUnlocked['41'] = true;
  merged.unlockedLessons = mergedUnlocked;

  // Merge lessonStars (take maximum stars)
  const localStars = local.lessonStars || {};
  const remoteStars = remote.lessonStars || {};
  const mergedStars = { ...localStars };

  Object.keys(remoteStars).forEach(key => {
    mergedStars[key] = Math.max(mergedStars[key] || 0, remoteStars[key] || 0);
  });
  merged.lessonStars = mergedStars;

  // Merge lessonWpm (take maximum speed)
  const localWpm = local.lessonWpm || {};
  const remoteWpm = remote.lessonWpm || {};
  const mergedWpm = { ...localWpm };

  Object.keys(remoteWpm).forEach(key => {
    mergedWpm[key] = Math.max(mergedWpm[key] || 0, remoteWpm[key] || 0);
  });
  merged.lessonWpm = mergedWpm;

  // Merge lessonAccuracy (take maximum accuracy)
  const localAcc = local.lessonAccuracy || {};
  const remoteAcc = remote.lessonAccuracy || {};
  const mergedAcc = { ...localAcc };

  Object.keys(remoteAcc).forEach(key => {
    mergedAcc[key] = Math.max(mergedAcc[key] || 0, remoteAcc[key] || 0);
  });
  merged.lessonAccuracy = mergedAcc;

  // Merge keyErrors and keyTotal sum
  const localKeyErrors = local.keyErrors || {};
  const remoteKeyErrors = remote.keyErrors || {};
  const mergedKeyErrors = { ...localKeyErrors };
  Object.keys(remoteKeyErrors).forEach(key => {
    mergedKeyErrors[key] = (mergedKeyErrors[key] || 0) + remoteKeyErrors[key];
  });
  merged.keyErrors = mergedKeyErrors;

  const localKeyTotal = local.keyTotal || {};
  const remoteKeyTotal = remote.keyTotal || {};
  const mergedKeyTotal = { ...localKeyTotal };
  Object.keys(remoteKeyTotal).forEach(key => {
    mergedKeyTotal[key] = (mergedKeyTotal[key] || 0) + remoteKeyTotal[key];
  });
  merged.keyTotal = mergedKeyTotal;

  // Merge cycle setting
  merged.isAlternativeCycle = local.isAlternativeCycle || remote.isAlternativeCycle;

  // Merge custom metadata fields
  if (remote.id) merged.id = remote.id;

  return merged;
}

// Fetch user profile from Firestore or initialize it if it doesn't exist
export async function loadUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDocRef = doc(db, "users", uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
  } catch (error) {
    console.warn("Could not load user profile from Firestore:", error);
  }
  return null;
}

// Upload/sync user profile to Firestore
export async function saveUserProfile(uid: string, profile: UserProfile): Promise<void> {
  try {
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, profile, { merge: true });
  } catch (error) {
    console.warn("Could not save user profile to Firestore:", error);
  }
}

// Fetch test history from Firestore
export async function loadUserHistory(uid: string): Promise<TestHistoryEntry[]> {
  try {
    const historyDocRef = doc(db, "users", uid, "data", "history");
    const docSnap = await getDoc(historyDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return (data.entries || []) as TestHistoryEntry[];
    }
  } catch (error) {
    console.warn("Could not load user history from Firestore:", error);
  }
  return [];
}

// Save history entries to Firestore
export async function saveUserHistory(uid: string, history: TestHistoryEntry[]): Promise<void> {
  try {
    const historyDocRef = doc(db, "users", uid, "data", "history");
    await setDoc(historyDocRef, { entries: history });
  } catch (error) {
    console.warn("Could not save user history to Firestore:", error);
  }
}

// Save leaderboard entries directly to Firestore
export async function saveLeaderboardEntry(
  id: string,
  fullName: string,
  wpm: number,
  totalStars: number,
  streak: number
): Promise<void> {
  try {
    if (!id || !fullName) return;
    const docRef = doc(db, "leaderboard", id);
    await setDoc(docRef, {
      id,
      fullName,
      wpm: Number(wpm) || 0,
      totalStars: Number(totalStars) || 0,
      streak: Number(streak) || 0,
      updatedAt: Date.now()
    }, { merge: true });
  } catch (error) {
    console.warn("Could not save leaderboard entry to Firestore:", error);
  }
}

// Friend Request functions
export async function searchUserByAccountId(accountId: string): Promise<UserProfile | null> {
  try {
    const q = query(collection(db, "users"), where("accountId", "==", accountId.trim()), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.warn("Could not search user:", error);
    return null;
  }
}

export async function sendFriendRequest(fromUser: UserProfile, toAccountId: string) {
  try {
    if (!fromUser.uid || !fromUser.accountId) return;
    const toUser = await searchUserByAccountId(toAccountId);
    if (!toUser || !toUser.uid) throw new Error("User not found");

    const reqRef = doc(collection(db, 'friendRequests'));
    await setDoc(reqRef, {
      fromUid: fromUser.uid,
      fromAccountId: fromUser.accountId,
      fromName: fromUser.fullName,
      toUid: toUser.uid,
      status: 'pending',
      timestamp: Date.now()
    });
  } catch (error) {
    console.warn("Could not send friend request:", error);
  }
}

export async function respondToFriendRequest(reqId: string, status: 'accepted' | 'rejected', fromUid: string, toUid: string) {
  try {
    // Update request
    const reqRef = doc(db, 'friendRequests', reqId);
    await setDoc(reqRef, { status }, { merge: true });

    if (status === 'accepted') {
      // Add friend to each other's friends list
      const user1Ref = doc(db, 'users', toUid);
      const user2Ref = doc(db, 'users', fromUid);

      const snap1 = await getDoc(user1Ref);
      const snap2 = await getDoc(user2Ref);

      if (snap1.exists()) {
        const d1 = snap1.data() as UserProfile;
        const friends1 = d1.friends || [];
        if (!friends1.includes(fromUid)) {
          friends1.push(fromUid);
          await setDoc(user1Ref, { friends: friends1 }, { merge: true });
        }
      }

      if (snap2.exists()) {
        const d2 = snap2.data() as UserProfile;
        const friends2 = d2.friends || [];
        if (!friends2.includes(toUid)) {
          friends2.push(toUid);
          await setDoc(user2Ref, { friends: friends2 }, { merge: true });
        }
      }
    }
  } catch (error) {
    console.warn("Could not respond to friend request:", error);
  }
}

// Presence logic
export async function pingOnlineStatus(uid: string) {
  try {
    const ref = doc(db, "presence", uid);
    await setDoc(ref, { lastSeen: Date.now() }, { merge: true });
  } catch (error) {
    // Ignore presence errors
  }
}

// Game requests (1 minute typing test)
export async function sendGameRequest(fromUid: string, fromName: string, toUid: string) {
  try {
    const reqRef = doc(collection(db, 'gameRequests'));
    await setDoc(reqRef, {
      fromUid,
      fromName,
      toUid,
      status: 'pending',
      timestamp: Date.now(),
      roomId: `room_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    });
  } catch (e) {
    console.warn("Could not send game request", e);
  }
}

export async function updateGameRequest(reqId: string, status: 'accepted' | 'declined') {
  try {
    const reqRef = doc(db, 'gameRequests', reqId);
    await setDoc(reqRef, { status }, { merge: true });
  } catch(e) {
    console.warn(e);
  }
}

export async function getOnlineStatuses(uids: string[]): Promise<Record<string, boolean>> {
  const result: Record<string, boolean> = {};
  if (!uids.length) return result;
  try {
    const q = query(collection(db, "presence"), where("__name__", "in", uids.slice(0, 30)));
    const snap = await getDocs(q);
    snap.forEach((d) => {
      const data = d.data();
      // Considered online if pinged within last 60 seconds
      result[d.id] = Date.now() - (data.lastSeen || 0) < 60_000;
    });
  } catch (error) {
    console.warn(error);
  }
  return result;
}

export async function getLeaderboardEntries(): Promise<any[]> {
  try {
    const q = query(
      collection(db, "leaderboard"),
      orderBy("totalStars", "desc"),
      limit(100)
    );
    const snap = await getDocs(q);
    const list: any[] = [];
    snap.forEach((docSnap) => {
      if (docSnap.exists()) {
        list.push(docSnap.data());
      }
    });
    return list;
  } catch (error) {
    console.warn("Could not load leaderboard entries from Firestore:", error);
    return [];
  }
}
