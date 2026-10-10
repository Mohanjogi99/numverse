import { SingleDigit, DimensionScores } from './number';

export type SupportedLanguage = 'en' | 'hi';

export type AIReportStatus = 'locked' | 'processing' | 'ready' | 'failed';

export type AIErrorCategory =
  | 'CONFIGURATION_ERROR'
  | 'AUTH_ERROR'
  | 'VALIDATION_ERROR'
  | 'OPENAI_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'TIMEOUT_ERROR'
  | 'OUTPUT_VALIDATION_ERROR'
  | 'STORAGE_ERROR'
  | 'UNKNOWN_ERROR';

export interface ReportChapter {
  id: string;
  chapterNumber: number;
  title: string;
  hindiTitle: string;
  wordCount: number;
  content: string;
  keyInsights: string[];
  actionableRitual?: string;
}

export interface StructuredAIReportContent {
  title: string;
  signatureSentence: string;
  summary: string;
  strengths: string[];
  challenges: string[];
  relationships: string;
  career: string;
  money: string;
  communication: string;
  learning: string;
  growth: string;
  story: string;

  // 5,000+ Words 12-Chapter Deep Dossier Extensions
  totalWordCount?: number;
  chapters?: ReportChapter[];
  coreIdentityChapter?: string;
  archetypeDnaChapter?: string;
  subconsciousFusionChapter?: string;
  loveChapter?: string;
  careerChapter?: string;
  moneyChapter?: string;
  communicationChapter?: string;
  learningChapter?: string;
  growthChapter?: string;
  tensionMatrixChapter?: string;
  biographicalEpicStory?: string;
  actionBlueprintChapter?: string;
}

export interface StructuredFusionInput {
  dominantNumber: SingleDigit;
  dominantTheme: string;
  secondaryNumber?: SingleDigit | null;
  secondaryTheme?: string | null;
  personalityType: string;
  primaryDimension: string;
  secondaryDimension?: string;
  finalDimensions: DimensionScores;
  loveProfile: {
    score: number;
    scoreBand: string;
    headline: string;
  };
  careerProfile: {
    score: number;
    scoreBand: string;
    headline: string;
  };
  moneyProfile: {
    score: number;
    scoreBand: string;
    headline: string;
  };
  communicationProfile: {
    score: number;
    scoreBand: string;
    headline: string;
  };
  learningProfile: {
    score: number;
    scoreBand: string;
    headline: string;
  };
  growthProfile: {
    score: number;
    scoreBand: string;
    headline: string;
  };
}

export interface AIUsageMetadata {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  durationMs: number;
}

export interface StoredAIReportDocument {
  reportId: string;
  userId?: string;
  status: AIReportStatus;
  language: SupportedLanguage;
  aiContent?: StructuredAIReportContent;
  aiModel: string;
  promptVersion: string;
  engineVersion: string;
  reportVersion: string;
  usage?: AIUsageMetadata;
  generatedAt?: string;
  generationAttemptCount: number;
  errorCategory?: AIErrorCategory;
  errorMessage?: string;
}

export interface GenerateAIReportRequest {
  reportId: string;
  language?: SupportedLanguage;
  fusionInput: StructuredFusionInput;
  userId?: string;
  forceRegenerate?: boolean;
}

export interface GenerateAIReportResponse {
  success: boolean;
  status: AIReportStatus;
  reportId: string;
  language: SupportedLanguage;
  aiContent?: StructuredAIReportContent;
  error?: {
    category: AIErrorCategory;
    userMessage: string;
  };
  metadata?: {
    model: string;
    promptVersion: string;
    generatedAt: string;
    isFromCache: boolean;
  };
}
