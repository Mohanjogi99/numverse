import {
  SingleDigit,
  DigitFrequencyMap,
  DigitDistributionMap,
  DominantNumber,
  DimensionScores,
  NumberAnalysisResult,
  NumberThemeName,
} from '../types/number';
import { NUMBER_INFLUENCE_MATRIX, NUMBER_ENGINE_VERSION } from '../data/influenceMatrix';
import { NUMBER_PROFILES } from '../data/numberProfiles';

/**
 * Normalizes an arbitrary mobile phone number input into pure digits.
 * Strips out spaces, brackets, dashes, '+' signs, and standard country code prefixes.
 */
export function normalizeMobileNumber(input: string): string {
  if (!input) return '';
  // Remove all non-digit characters
  let digits = input.replace(/\D/g, '');

  // Handle common country code prefixes if formatted with standard 12/11 digits
  // E.g., India +91 (12 digits starting with 91) -> strip 91 if 12 digits
  if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  } else if (digits.length === 11 && digits.startsWith('1')) {
    // E.g., US/Canada 1-xxx-xxx-xxxx
    digits = digits.slice(1);
  }

  return digits;
}

/**
 * Counts the occurrence of each digit 0 through 9 in the provided digit string.
 */
export function countDigits(numberString: string): DigitFrequencyMap {
  const frequency: DigitFrequencyMap = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  };

  for (const char of numberString) {
    const digit = parseInt(char, 10);
    if (!isNaN(digit) && digit >= 0 && digit <= 9) {
      frequency[digit as SingleDigit] += 1;
    }
  }

  return frequency;
}

/**
 * Calculates percentage distribution (0 - 100) for each digit in the frequency map.
 */
export function calculateDistribution(frequency: DigitFrequencyMap): DigitDistributionMap {
  const total = Object.values(frequency).reduce((acc, count) => acc + count, 0);

  const distribution: DigitDistributionMap = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  };

  if (total === 0) return distribution;

  for (let d = 0; d <= 9; d++) {
    const digit = d as SingleDigit;
    distribution[digit] = Math.round((frequency[digit] / total) * 1000) / 10;
  }

  return distribution;
}

/**
 * Determines the dominant numbers sorted by frequency descending.
 */
export function getDominantNumbers(frequency: DigitFrequencyMap): DominantNumber[] {
  const total = Object.values(frequency).reduce((acc, count) => acc + count, 0);
  if (total === 0) return [];

  const entries = (Object.keys(frequency) as unknown as SingleDigit[])
    .map((d) => {
      const digit = Number(d) as SingleDigit;
      return {
        digit,
        count: frequency[digit],
        percentage: total > 0 ? Math.round((frequency[digit] / total) * 1000) / 10 : 0,
        theme: NUMBER_PROFILES[digit].theme as NumberThemeName,
      };
    })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count || a.digit - b.digit);

  if (entries.length === 0) return [];

  const maxCount = entries[0].count;

  return entries.map((item, index) => ({
    ...item,
    isPrimary: index === 0 || item.count === maxCount,
  }));
}

/**
 * Computes deterministic 6-dimension scores from digit frequencies using the Influence Matrix.
 */
export function calculateDimensionScores(frequency: DigitFrequencyMap): DimensionScores {
  const totalDigits = Object.values(frequency).reduce((acc, count) => acc + count, 0);

  if (totalDigits === 0) {
    return {
      independence: 50,
      social: 50,
      curiosity: 50,
      leadership: 50,
      emotional: 50,
      stability: 50,
    };
  }

  let weightedIndependence = 0;
  let weightedSocial = 0;
  let weightedCuriosity = 0;
  let weightedLeadership = 0;
  let weightedEmotional = 0;
  let weightedStability = 0;

  for (let d = 0; d <= 9; d++) {
    const digit = d as SingleDigit;
    const count = frequency[digit];
    if (count > 0) {
      const matrixRow = NUMBER_INFLUENCE_MATRIX[digit];
      weightedIndependence += matrixRow.independence * count;
      weightedSocial += matrixRow.social * count;
      weightedCuriosity += matrixRow.curiosity * count;
      weightedLeadership += matrixRow.leadership * count;
      weightedEmotional += matrixRow.emotional * count;
      weightedStability += matrixRow.stability * count;
    }
  }

  return {
    independence: Math.round(weightedIndependence / totalDigits),
    social: Math.round(weightedSocial / totalDigits),
    curiosity: Math.round(weightedCuriosity / totalDigits),
    leadership: Math.round(weightedLeadership / totalDigits),
    emotional: Math.round(weightedEmotional / totalDigits),
    stability: Math.round(weightedStability / totalDigits),
  };
}

/**
 * Pure deterministic pipeline for analyzing a mobile number.
 */
export function analyzeMobile(input: string): NumberAnalysisResult {
  const normalized = normalizeMobileNumber(input);
  const frequency = countDigits(normalized);
  const distribution = calculateDistribution(frequency);
  const dominantList = getDominantNumbers(frequency);
  const dimensionScores = calculateDimensionScores(frequency);

  const primaryDigit: SingleDigit = dominantList.length > 0 ? dominantList[0].digit : 0;
  const secondaryDigit: SingleDigit | null =
    dominantList.length > 1 && dominantList[1].count > 0 ? dominantList[1].digit : null;

  const id = `na_${Date.now()}_${normalized.slice(-4) || '0000'}`;

  return {
    id,
    inputRaw: input,
    normalizedNumber: normalized,
    totalDigits: normalized.length,
    digitFrequency: frequency,
    digitDistribution: distribution,
    dominantNumbers: dominantList,
    primaryNumber: primaryDigit,
    secondaryNumber: secondaryDigit,
    dimensionScores,
    engineVersion: NUMBER_ENGINE_VERSION,
    calculatedAt: new Date().toISOString(),
    disclaimer:
      'This analysis is designed solely for self-reflection and entertainment. It does not constitute psychological assessment or predictive advice.',
  };
}
