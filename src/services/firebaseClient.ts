/**
 * Firebase Client Setup & Offline-First Persistence for «نسمة الحياة»
 * 
 * Configured automatically with the provisioned AI Studio Firebase project.
 * Uses Firestore with persistent IndexedDB multi-tab cache for seamless offline support.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  Firestore 
} from 'firebase/firestore';

import appletConfig from '../../firebase-applet-config.json';

export interface FirebaseConfigOptions {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  firestoreDatabaseId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export const firebaseConfig: FirebaseConfigOptions = {
  apiKey: appletConfig.apiKey || import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: appletConfig.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: appletConfig.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  firestoreDatabaseId: appletConfig.firestoreDatabaseId || undefined,
  storageBucket: appletConfig.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: appletConfig.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: appletConfig.appId || import.meta.env.VITE_FIREBASE_APP_ID || ''
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId
);

let appInstance: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    
    // Auth initialization (ready for anonymous-first authentication)
    authInstance = getAuth(appInstance);
    
    // Initialize Firestore with custom databaseId and IndexedDB Multi-Tab Offline Cache
    try {
      firestoreInstance = initializeFirestore(appInstance, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
      }, firebaseConfig.firestoreDatabaseId);
    } catch {
      // Fallback to standard getFirestore if cache already active
      firestoreInstance = firebaseConfig.firestoreDatabaseId
        ? getFirestore(appInstance, firebaseConfig.firestoreDatabaseId)
        : getFirestore(appInstance);
    }
  } catch (error) {
    console.warn('[Firebase] Client initialization notice:', error);
  }
}

export const app = appInstance;
export const auth = authInstance;
export const db = firestoreInstance;
