export type SingleDigit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type NumberThemeName =
  | 'Balance'
  | 'Money'
  | 'Partnership'
  | 'Success'
  | 'Love'
  | 'Freedom'
  | 'Protection'
  | 'Adventure'
  | 'Power'
  | 'Transformation';

export interface NumberProfile {
  number: SingleDigit;
  theme: NumberThemeName;
  tagline: string;
  description: string;
  strengths: string[];
  challenges: string[];
  relationship: string;
  career: string;
  money: string;
  communication: string;
  learning: string;
  growth: string;
  colorHex: string;
  accentClass: string;
}

export interface DimensionScores {
  independence: number;
  social: number;
  curiosity: number;
  leadership: number;
  emotional: number;
  stability: number;
}

export type DimensionKey = keyof DimensionScores;

export interface DimensionInfluenceMatrixRow {
  independence: number;
  social: number;
  curiosity: number;
  leadership: number;
  emotional: number;
  stability: number;
}

export type NumberInfluenceMatrix = Record<SingleDigit, DimensionInfluenceMatrixRow>;

export type DigitFrequencyMap = Record<SingleDigit, number>;

export type DigitDistributionMap = Record<SingleDigit, number>; // percentages (0-100)

export interface DominantNumber {
  digit: SingleDigit;
  count: number;
  percentage: number;
  theme: NumberThemeName;
  isPrimary: boolean;
}

export interface NumberAnalysisResult {
  id: string;
  inputRaw: string;
  normalizedNumber: string;
  totalDigits: number;
  digitFrequency: DigitFrequencyMap;
  digitDistribution: DigitDistributionMap;
  dominantNumbers: DominantNumber[];
  primaryNumber: SingleDigit;
  secondaryNumber: SingleDigit | null;
  dimensionScores: DimensionScores;
  engineVersion: string;
  calculatedAt: string;
  disclaimer: string;
}

export interface DobAnalysisResult {
  id: string;
  rawDate: string;
  day: number;
  month: number;
  year: number;
  coreLifeNumber: SingleDigit;
  dayNumber: SingleDigit;
  digitFrequency: DigitFrequencyMap;
  dimensionScores: DimensionScores;
  calculatedAt: string;
  engineVersion: string;
}
