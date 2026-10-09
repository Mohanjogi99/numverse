export type UserRole = 'user' | 'subscriber' | 'admin';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  isAnonymous: boolean;
  createdAt: string;
  lastLoginAt: string;
  preferences?: {
    theme?: 'light' | 'dark' | 'system';
    emailNotifications?: boolean;
  };
  savedAnalyses?: string[];
  purchasedReports?: string[];
}
