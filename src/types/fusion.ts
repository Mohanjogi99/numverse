import { NumberAnalysisResult, DimensionScores } from './number';
import { PersonalityAssessmentResult, PersonalityTypeArchetype } from './personality';
import { ScoreBand } from '../config/constants';

export type PillarKey = 'love' | 'career' | 'money' | 'communication' | 'learning' | 'growth';

export interface DimensionAlignment {
  dimension: keyof DimensionScores;
  numberScore: number;
  personalityScore: number;
  delta: number;
  status: 'harmonic' | 'complementary' | 'tension';
  insight: string;
}

export interface FusionIdentity {
  name: string; // e.g., "Adventurous Explorer"
  numberTheme: string; // e.g., "Adventure"
  archetypeTitle: string; // e.g., "Explorer"
  tagline: string;
  blendAdjective: string;
  archetype: PersonalityTypeArchetype;
}

export interface PillarProfile {
  key: PillarKey;
  title: string;
  score: number; // 0-100
  scoreBand: ScoreBand;
  headline: string;
  summary: string;
  strengths: string[];
  growthAdvice: string[];
  reflectionPrompt: string;
}

export interface FusionPillars {
  love: PillarProfile;
  career: PillarProfile;
  money: PillarProfile;
  communication: PillarProfile;
  learning: PillarProfile;
  growth: PillarProfile;
}

export interface FusionSnapshot {
  snapshotId: string;
  engineVersion: string;
  reportVersion: string;
  timestamp: string;
  inputs: {
    mobileInputRaw?: string;
    dobInputRaw?: string;
    answersCount: number;
    tier: string;
  };
  numberMetrics: {
    dominantDigits: number[];
    dimensionScores: DimensionScores;
  };
  personalityMetrics: {
    primaryArchetypeId: string;
    secondaryArchetypeId?: string;
    dimensionScores: DimensionScores;
  };
  fusedDimensionScores: DimensionScores;
  pillarScores: Record<PillarKey, number>;
}

export interface FusionAnalysisResult {
  id: string;
  numberAnalysisId: string;
  personalityAssessmentId: string;
  numberResult: NumberAnalysisResult;
  personalityResult: PersonalityAssessmentResult;
  fusionIdentity: FusionIdentity;
  fusedDimensionScores: DimensionScores;
  pillars: FusionPillars;
  alignments: DimensionAlignment[];
  overallSynergyScore: number; // 0-100
  fusionNarrative: {
    coreTheme: string;
    summary: string;
    primaryStrength: string;
    potentialBlindspot: string;
    growthOpportunity: string;
  };
  snapshot: FusionSnapshot;
  calculatedAt: string;
  engineVersion: string;
  reportVersion: string;
}
