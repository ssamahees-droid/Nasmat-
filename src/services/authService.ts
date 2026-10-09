/**
 * Authentication Service for «نسمة حياة»
 * 
 * Implements Anonymous-First Authentication and Seamless Account Linking
 * with Zero-Trust Security.
 * 
 * Security Principles:
 * 1. ZERO Hardcoded Admin Emails: No email comparison exists in client code.
 * 2. Server-Authoritative Roles: Admin and specialist privileges are derived exclusively
 *    from Firebase Custom Claims (signed JWT token issued server-side).
 * 3. Graceful Guest Fallback: If Anonymous provider is not yet turned on in Firebase Console,
 *    falls back to a stable local guest identifier without throwing or crashing.
 * 4. Protected Profile Writes: Client can never self-assign 'admin', 'therapist', or elevate roles.
 */

import { 
  signInAnonymously, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  linkWithPopup, 
  linkWithCredential,
  EmailAuthProvider,
  User as FirebaseUser,
  UserCredential,
  signOut
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';

import { auth, db, isFirebaseConfigured } from './firebaseClient';

export interface AppUserProfile {
  uid: string;
  isAnonymous: boolean;
  displayName?: string | null;
  email?: string | null;
  role: 'user' | 'admin' | 'therapist' | 'anonymous';
  createdAt?: unknown;
  lastLoginAt?: unknown;
}

const LOCAL_GUEST_KEY = 'nesmat_guest_uid_v1';

/**
 * Returns a stable local guest UID used for local operations
 * when offline or when anonymous auth provider is pending in Firebase Console.
 */
export function getGuestUid(): string {
  let guestId = localStorage.getItem(LOCAL_GUEST_KEY);
  if (!guestId) {
    guestId = 'guest_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem(LOCAL_GUEST_KEY, guestId);
  }
  return guestId;
}

/**
 * Returns the effective UID: current authenticated Firebase UID or local guest UID.
 */
export function getEffectiveUserId(): string {
  return auth?.currentUser?.uid || getGuestUid();
}

/**
 * Initializes or restores an anonymous session without forcing user sign-in.
 * Preserves existing session if user is already signed in.
 * Gracefully handles 'auth/admin-restricted-operation' if provider is pending.
 */
export async function initAnonymousAuth(): Promise<FirebaseUser | null> {
  const firebaseAuth = auth;
  if (!firebaseAuth || !isFirebaseConfigured) {
    return null;
  }

  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
      unsubscribe();
      if (currentUser) {
        // User already has an active session (anonymous or linked)
        try {
          await ensureUserProfileDocument(currentUser);
        } catch (err) {
          console.warn('[Auth] Notice syncing user profile doc:', err);
        }
        resolve(currentUser);
      } else {
        // No active session: attempt anonymous sign in
        try {
          const cred = await signInAnonymously(firebaseAuth);
          await ensureUserProfileDocument(cred.user);
          resolve(cred.user);
        } catch (error: any) {
          if (error?.code === 'auth/admin-restricted-operation') {
            // Expected when Anonymous provider is not yet enabled in Firebase Console
            console.info('[Auth] Anonymous provider is not enabled in Firebase Console yet. Operating in secure local guest mode.');
          } else {
            console.warn('[Auth] Anonymous sign-in notice:', error?.message || error);
          }
          // Do not throw: Resolve null to let the app continue seamlessly in local-first mode
          resolve(null);
        }
      }
    });
  });
}

/**
 * Ensures the Firestore `/users/{uid}` document exists for this user session.
 * STRICT: Does NOT set or elevate any admin privileges from client-side.
 */
export async function ensureUserProfileDocument(user: FirebaseUser): Promise<void> {
  if (!db) return;

  const userDocRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(userDocRef);

    if (!snap.exists()) {
      // New profile creation: base role only (anonymous or standard user)
      const initialRole = user.isAnonymous ? 'anonymous' : 'user';
      await setDoc(userDocRef, {
        uid: user.uid,
        isAnonymous: user.isAnonymous,
        displayName: user.displayName || (user.isAnonymous ? 'زائر' : 'مستخدم'),
        email: user.email || null,
        role: initialRole,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp()
      }, { merge: true });
    } else {
      // Profile update: NEVER touch or overwrite the 'role' field from client
      await setDoc(userDocRef, {
        isAnonymous: user.isAnonymous,
        email: user.email || snap.data()?.email || null,
        displayName: user.displayName || snap.data()?.displayName,
        lastLoginAt: serverTimestamp()
      }, { merge: true });
    }
  } catch (err) {
    console.warn('[Auth] Unable to update profile doc in Firestore (client may be offline):', err);
  }
}

/**
 * Verifies if the current user possesses admin authority exclusively via 
 * cryptographically verified Firebase Custom Claims issued server-side.
 */
export async function checkServerAdminClaim(forceRefresh = false): Promise<boolean> {
  if (!auth || !auth.currentUser) return false;
  try {
    const tokenResult = await auth.currentUser.getIdTokenResult(forceRefresh);
    return tokenResult.claims.role === 'admin' || Boolean(tokenResult.claims.admin);
  } catch (error) {
    console.warn('[Auth] Error checking admin custom claim:', error);
    return false;
  }
}

/**
 * Retrieves the verified server-side role from token claims.
 */
export async function getServerAuthoritativeRole(forceRefresh = false): Promise<'admin' | 'therapist' | 'user' | 'anonymous'> {
  if (!auth || !auth.currentUser) return 'anonymous';
  if (auth.currentUser.isAnonymous) return 'anonymous';

  try {
    const tokenResult = await auth.currentUser.getIdTokenResult(forceRefresh);
    if (tokenResult.claims.role === 'admin' || Boolean(tokenResult.claims.admin)) {
      return 'admin';
    }
    if (tokenResult.claims.role === 'therapist' || tokenResult.claims.role === 'specialist') {
      return 'therapist';
    }
    return 'user';
  } catch {
    return 'user';
  }
}

/**
 * Links the active anonymous session to a Google account.
 * Crucial: The `uid` remains identical, preserving all local and cloud data.
 */
export async function linkAnonymousWithGoogle(): Promise<{ user: FirebaseUser; success: boolean }> {
  if (!auth || !auth.currentUser) {
    throw new Error('No active user session to link.');
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  try {
    const cred: UserCredential = await linkWithPopup(auth.currentUser, provider);
    await ensureUserProfileDocument(cred.user);
    return { user: cred.user, success: true };
  } catch (error: unknown) {
    console.error('[Auth] Failed to link Google account:', error);
    throw error;
  }
}

/**
 * Links the active anonymous session with Email & Password.
 * Crucial: The `uid` remains identical.
 */
export async function linkAnonymousWithEmail(email: string, password: string): Promise<{ user: FirebaseUser; success: boolean }> {
  if (!auth || !auth.currentUser) {
    throw new Error('No active user session to link.');
  }

  const credential = EmailAuthProvider.credential(email, password);

  try {
    const cred: UserCredential = await linkWithCredential(auth.currentUser, credential);
    await ensureUserProfileDocument(cred.user);
    return { user: cred.user, success: true };
  } catch (error: unknown) {
    console.error('[Auth] Failed to link Email account:', error);
    throw error;
  }
}

/**
 * Gets the current authenticated user synchronously.
 */
export function getCurrentUser(): FirebaseUser | null {
  return auth?.currentUser || null;
}

/**
 * Subscribes to authentication state changes.
 */
export function onAuthChange(callback: (user: FirebaseUser | null) => void): () => void {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

/**
 * Signs out the current user.
 */
export async function signOutUser(): Promise<void> {
  if (!auth) return;
  await signOut(auth);
}
