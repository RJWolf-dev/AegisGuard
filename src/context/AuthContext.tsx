import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  doc, setDoc, getDoc, updateDoc, collection, query, 
  orderBy, limit, getDocs, onSnapshot, increment 
} from 'firebase/firestore';
import { auth, db, initAnonymousAuth, logOut, handleFirestoreError, OperationType } from '../firebase';
import { CyberLearning } from '../types/security';
import { INITIAL_CYBER_LEARNINGS } from '../data/initialLearnings';

export interface UserProfileData {
  userId: string;
  email?: string;
  displayName?: string;
  streakDays: number;
  completedTips: string[];
  completedGuides: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserScanHistoryItem {
  id: string;
  scanType: 'browser' | 'url' | 'password' | 'breach';
  score: number;
  severity: string;
  summary: string;
  target?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profile: UserProfileData | null;
  scans: UserScanHistoryItem[];
  cyberLearnings: CyberLearning[];
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateCompletedTip: (tipId: string) => Promise<void>;
  updateCompletedGuide: (guideId: string) => Promise<void>;
  logScanResult: (scan: {
    scanType: 'browser' | 'url' | 'password' | 'breach';
    score: number;
    severity: string;
    summary: string;
    target?: string;
  }) => Promise<void>;
  addLearning: (learning: CyberLearning) => Promise<void>;
  upvoteLearning: (learningId: string) => Promise<void>;
  synthesizeAndStoreLearning: (
    contextText: string, 
    sourceType?: 'chat_conversation' | 'threat_analysis' | 'user_observation'
  ) => Promise<CyberLearning | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [scans, setScans] = useState<UserScanHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('aegis_local_scans');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [cyberLearnings, setCyberLearnings] = useState<CyberLearning[]>(INITIAL_CYBER_LEARNINGS);

  // 1. Automatically initialize anonymous Firebase Authentication in background
  useEffect(() => {
    initAnonymousAuth();
  }, []);

  // 2. Subscribe to Collective Cyber Learnings in Firestore
  useEffect(() => {
    const learningsColPath = 'cyber_learnings';
    const unsubLearnings = onSnapshot(collection(db, 'cyber_learnings'), async (snapshot) => {
      if (snapshot.empty) {
        try {
          for (const item of INITIAL_CYBER_LEARNINGS) {
            await setDoc(doc(db, 'cyber_learnings', item.id), item);
          }
        } catch (err) {
          console.warn('Seeding initial learnings:', err);
        }
      } else {
        const items: CyberLearning[] = [];
        snapshot.forEach(docSnap => {
          items.push(docSnap.data() as CyberLearning);
        });
        items.sort((a, b) => b.upvotes - a.upvotes || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setCyberLearnings(items);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, learningsColPath);
    });

    return () => unsubLearnings();
  }, []);

  // 3. Background Auth State & User Profile & Scan History synchronization
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocPath = `users/${currentUser.uid}`;
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userDocRef);

          if (!snap.exists()) {
            let localTips = ['tip-1'];
            let localGuides: string[] = [];
            try {
              const savedTips = localStorage.getItem('aegis_completed_tips');
              if (savedTips) localTips = JSON.parse(savedTips);
              const savedG = localStorage.getItem('aegis_guide_steps');
              if (savedG) {
                const parsed = JSON.parse(savedG);
                localGuides = Object.keys(parsed).filter(k => parsed[k]);
              }
            } catch {
              // ignore
            }

            const initialProfile: UserProfileData = {
              userId: currentUser.uid,
              displayName: 'Cyber Defender',
              streakDays: Math.max(1, localTips.length),
              completedTips: localTips,
              completedGuides: localGuides,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };

            await setDoc(userDocRef, initialProfile);
            setProfile(initialProfile);
          } else {
            setProfile(snap.data() as UserProfileData);
          }
        } catch (err) {
          console.warn('Profile read status in background:', err);
        }

        // Real-time listener for profile changes
        const unsubDoc = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfileData);
          }
        }, (err) => {
          console.warn('Background profile sync:', err);
        });

        // Load persisted scan logs from Firestore
        try {
          const scansQuery = query(collection(db, 'users', currentUser.uid, 'scans'), orderBy('createdAt', 'desc'), limit(15));
          const scanSnaps = await getDocs(scansQuery);
          const loadedScans: UserScanHistoryItem[] = [];
          scanSnaps.forEach(s => loadedScans.push(s.data() as UserScanHistoryItem));
          if (loadedScans.length > 0) {
            setScans(loadedScans);
            try {
              localStorage.setItem('aegis_local_scans', JSON.stringify(loadedScans));
            } catch {}
          }
        } catch (err) {
          console.warn('Background scans query:', err);
        }

        setLoading(false);
        return () => unsubDoc();
      } else {
        // Fallback local profile if offline or anonymous auth initializing
        let localTips = ['tip-1'];
        let localGuides: string[] = [];
        try {
          const savedTips = localStorage.getItem('aegis_completed_tips');
          if (savedTips) localTips = JSON.parse(savedTips);
          const savedG = localStorage.getItem('aegis_guide_steps');
          if (savedG) {
            const parsed = JSON.parse(savedG);
            localGuides = Object.keys(parsed).filter(k => parsed[k]);
          }
        } catch {}

        setProfile({
          userId: 'local_anonymous_session',
          displayName: 'Cyber Defender',
          streakDays: Math.max(1, localTips.length),
          completedTips: localTips,
          completedGuides: localGuides,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    // Seamless background auto-auth
    await initAnonymousAuth();
  };

  const signOutUser = async () => {
    try {
      await logOut();
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  const updateCompletedTip = async (tipId: string) => {
    // Always update local storage first for instant feedback
    try {
      const saved = localStorage.getItem('aegis_completed_tips');
      const list = saved ? JSON.parse(saved) : [];
      if (!list.includes(tipId)) {
        const updated = [...list, tipId];
        localStorage.setItem('aegis_completed_tips', JSON.stringify(updated));
      }
    } catch {}

    // Update in Firestore in the background
    if (user) {
      const path = `users/${user.uid}`;
      try {
        const currentList = profile?.completedTips || [];
        if (!currentList.includes(tipId)) {
          const updatedTips = [...currentList, tipId];
          const updatedStreak = updatedTips.length;
          const ref = doc(db, 'users', user.uid);
          await updateDoc(ref, {
            completedTips: updatedTips,
            streakDays: updatedStreak,
            updatedAt: new Date().toISOString()
          });
        }
      } catch (err) {
        console.warn('Background tip sync to Firestore:', err);
      }
    } else {
      setProfile(prev => prev ? {
        ...prev,
        completedTips: prev.completedTips.includes(tipId) ? prev.completedTips : [...prev.completedTips, tipId],
        streakDays: prev.completedTips.includes(tipId) ? prev.streakDays : prev.streakDays + 1
      } : null);
    }
  };

  const updateCompletedGuide = async (guideId: string) => {
    try {
      const saved = localStorage.getItem('aegis_guide_steps');
      const map = saved ? JSON.parse(saved) : {};
      map[guideId] = !map[guideId];
      localStorage.setItem('aegis_guide_steps', JSON.stringify(map));
    } catch {}

    if (user) {
      const path = `users/${user.uid}`;
      try {
        const currentList = profile?.completedGuides || [];
        const updatedGuides = currentList.includes(guideId)
          ? currentList.filter(id => id !== guideId)
          : [...currentList, guideId];

        const ref = doc(db, 'users', user.uid);
        await updateDoc(ref, {
          completedGuides: updatedGuides,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Background guide sync to Firestore:', err);
      }
    } else {
      setProfile(prev => prev ? {
        ...prev,
        completedGuides: prev.completedGuides.includes(guideId)
          ? prev.completedGuides.filter(id => id !== guideId)
          : [...prev.completedGuides, guideId]
      } : null);
    }
  };

  const logScanResult = async (scan: {
    scanType: 'browser' | 'url' | 'password' | 'breach';
    score: number;
    severity: string;
    summary: string;
    target?: string;
  }) => {
    const scanId = `scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Mask personal target for local storage privacy
    const maskedTarget = scan.target 
      ? (scan.scanType === 'breach' || scan.scanType === 'password')
        ? scan.target.includes('@')
          ? scan.target.replace(/^(.)(.*)(@.*)$/, (_, first, middle, domain) => `${first}${'*'.repeat(Math.min(middle.length, 5))}${domain}`)
          : `${scan.target.slice(0, 2)}***${scan.target.slice(-2)}`
        : scan.target.slice(0, 500)
      : undefined;

    const newScan: UserScanHistoryItem = {
      id: scanId,
      scanType: scan.scanType,
      score: scan.score,
      severity: scan.severity,
      summary: scan.summary.slice(0, 500),
      target: maskedTarget,
      createdAt: new Date().toISOString()
    };

    // Update local client state and storage immediately
    setScans(prev => [newScan, ...prev.slice(0, 19)]);
    try {
      const saved = localStorage.getItem('aegis_local_scans');
      const list = saved ? JSON.parse(saved) : [];
      localStorage.setItem('aegis_local_scans', JSON.stringify([newScan, ...list.slice(0, 19)]));
    } catch {}

    // Strict Zero-Cloud-Storage for Personal Data:
    // When saving the telemetry audit record to Firestore, NEVER store personal identifiers,
    // emails, usernames, phone numbers, or passwords. Only generic cybersecurity diagnostic metadata.
    if (user) {
      try {
        const scanDocRef = doc(db, 'users', user.uid, 'scans', scanId);
        const cloudRecord: {
          id: string;
          userId: string;
          scanType: 'browser' | 'url' | 'password' | 'breach';
          score: number;
          severity: string;
          summary: string;
          target?: string;
          createdAt: string;
        } = {
          id: scanId,
          userId: user.uid,
          scanType: scan.scanType,
          score: scan.score,
          severity: scan.severity,
          summary: scan.scanType === 'breach'
            ? 'Identity exposure scan completed across public databases, dark web stealer logs, and data broker registries.'
            : scan.scanType === 'password'
            ? 'Cryptographic password entropy and crack-time evaluation conducted.'
            : scan.summary.slice(0, 500),
          createdAt: new Date().toISOString()
        };

        // Only allow non-personal URL targets for threat reports; breach/password targets are NEVER stored in cloud
        if (scan.scanType === 'url' && scan.target && !scan.target.includes('@')) {
          cloudRecord.target = scan.target.slice(0, 200);
        }

        await setDoc(scanDocRef, cloudRecord);
      } catch (err) {
        console.warn('Background scan log to Firestore:', err);
      }
    }
  };

  // Add a newly synthesized or submitted cyber learning to Firestore
  const addLearning = async (learning: CyberLearning) => {
    const path = `cyber_learnings/${learning.id}`;
    try {
      await setDoc(doc(db, 'cyber_learnings', learning.id), learning);
      setCyberLearnings(prev => [learning, ...prev.filter(l => l.id !== learning.id)]);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  // Upvote / Validate a learned insight in Firestore
  const upvoteLearning = async (learningId: string) => {
    const path = `cyber_learnings/${learningId}`;
    try {
      await updateDoc(doc(db, 'cyber_learnings', learningId), {
        upvotes: increment(1)
      });
      setCyberLearnings(prev => prev.map(l => l.id === learningId ? { ...l, upvotes: l.upvotes + 1 } : l));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  // Synthesize learning from any chat text or threat scenario and save directly to Firebase
  const synthesizeAndStoreLearning = async (
    contextText: string,
    sourceType: 'chat_conversation' | 'threat_analysis' | 'user_observation' = 'chat_conversation'
  ): Promise<CyberLearning | null> => {
    try {
      const res = await fetch('/api/synthesize-learning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contextText, sourceType })
      });
      const data = await res.json();
      if (data.status === 'success' && data.data) {
        const learning: CyberLearning = data.data;
        await addLearning(learning);
        return learning;
      }
      return null;
    } catch (err) {
      console.error('Error synthesizing learning:', err);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        profile,
        scans,
        cyberLearnings,
        signIn,
        signOut: signOutUser,
        updateCompletedTip,
        updateCompletedGuide,
        logScanResult,
        addLearning,
        upvoteLearning,
        synthesizeAndStoreLearning
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
