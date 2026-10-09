import { DimensionScores } from './number';

export type PersonalityTier = 'free' | 'standard' | 'complete' | 'quick' | 'deep';

export interface PersonalityQuestionOption {
  id: string;
  label: string;
  weight: number; // 1 to 5 scale
  dimensionDeltas?: Partial<DimensionScores>;
}

export interface PersonalityQuestion {
  id: string;
  text: string;
  category: 'curiosity' | 'independence' | 'leadership' | 'social' | 'emotional' | 'stability';
  tier: PersonalityTier[];
  options: PersonalityQuestionOption[];
  reversed?: boolean;
  dimensionKey: keyof DimensionScores;
}

export interface PersonalityAnswer {
  questionId: string;
  selectedOptionId: string;
  value: number; // 1 to 5
}

export interface PersonalityTypeArchetype {
  id: string; // e.g. "explorer", "leader", "empath", etc.
  code: string;
  title: string;
  subtitle: string;
  tagline: string;
  summary: string;
  coreTraits: string[];
  strengths: string[];
  challenges: string[];
  relationships: string;
  career: string;
  communication: string;
  learning: string;
  growth: string;
  primaryDimension: keyof DimensionScores;
  secondaryDimension?: keyof DimensionScores;
  idealEnvironments?: string[];
}

export interface PersonalityAssessmentResult {
  id: string;
  tier: PersonalityTier;
  answers: PersonalityAnswer[];
  totalQuestions: number;
  dimensionScores: DimensionScores;
  primaryArchetype: PersonalityTypeArchetype;
  secondaryArchetype?: PersonalityTypeArchetype;
  primaryDimension: keyof DimensionScores;
  secondaryDimension?: keyof DimensionScores;
  completedAt: string;
  engineVersion: string;
}
