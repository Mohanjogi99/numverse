import { SingleDigit, DimensionScores } from './number';

export type ReportTier = 'basic' | 'premium' | 'complete';

export interface ReportSection {
  id: string;
  title: string;
  subtitle?: string;
  content: string[];
  bulletPoints?: string[];
  isLocked?: boolean;
}

export interface UserReport {
  id: string;
  userId?: string;
  tier: ReportTier;
  targetType: 'mobile' | 'dob' | 'personality' | 'fusion';
  targetIdentifier: string; // e.g. masked mobile, birth date string
  dominantTheme: string;
  primaryNumber: SingleDigit;
  dimensionScores: DimensionScores;
  sections: ReportSection[];
  shareableToken: string;
  isPurchased: boolean;
  createdAt: string;
  updatedAt: string;
  disclaimer: string;
}
