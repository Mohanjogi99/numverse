import {
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from './firebase';
import { UserProfile } from '../types/user';

export async function loginAnonymously(): Promise<User | null> {
  try {
    if (!auth || !auth.app) return null;
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (err) {
    console.error('Anonymous login error:', err);
    return null;
  }
}

export async function loginWithGoogle(): Promise<User | null> {
  try {
    if (!auth || !auth.app) return null;
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    return cred.user;
  } catch (err) {
    console.error('Google login error:', err);
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    if (auth && auth.app) {
      await signOut(auth);
    }
  } catch (err) {
    console.error('Sign out error:', err);
  }
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  if (!auth || !auth.app) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export function formatUserProfile(user: User | null): UserProfile | null {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || (user.isAnonymous ? 'Guest Explorer' : 'Member'),
    photoURL: user.photoURL,
    role: 'user',
    isAnonymous: user.isAnonymous,
    createdAt: user.metadata.creationTime || new Date().toISOString(),
    lastLoginAt: user.metadata.lastSignInTime || new Date().toISOString(),
  };
}
