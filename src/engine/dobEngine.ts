import { SingleDigit, DobAnalysisResult } from '../types/number';
import { countDigits, calculateDimensionScores } from './numberEngine';
import { NUMBER_ENGINE_VERSION } from '../data/influenceMatrix';

/**
 * Reduces any positive integer into a single digit 0-9 by summing digits recursively.
 */
export function reduceToSingleDigit(num: number): SingleDigit {
  if (num < 0) num = Math.abs(num);
  while (num > 9) {
    num = num
      .toString()
      .split('')
      .reduce((sum, char) => sum + parseInt(char, 10), 0);
  }
  return num as SingleDigit;
}

/**
 * Deterministically analyzes a Date of Birth (YYYY-MM-DD or DD/MM/YYYY).
 */
export function analyzeDateOfBirth(rawDateInput: string): DobAnalysisResult {
  const digitsOnly = rawDateInput.replace(/\D/g, '');
  
  // Standard parsing
  const dateObj = new Date(rawDateInput);
  const isValidDate = !isNaN(dateObj.getTime());
  
  let day = 1;
  let month = 1;
  let year = 2000;

  if (isValidDate) {
    day = dateObj.getUTCDate();
    month = dateObj.getUTCMonth() + 1;
    year = dateObj.getUTCFullYear();
  } else if (digitsOnly.length >= 8) {
    day = parseInt(digitsOnly.slice(0, 2), 10) || 1;
    month = parseInt(digitsOnly.slice(2, 4), 10) || 1;
    year = parseInt(digitsOnly.slice(4, 8), 10) || 2000;
  }

  // Calculate Core Life Number (Sum of all digits in date)
  const coreLifeNumber = reduceToSingleDigit(day + month + year);
  const dayNumber = reduceToSingleDigit(day);

  // Compute digit frequencies across the full date representation
  const dateDigitString = `${day}${month}${year}`;
  const digitFrequency = countDigits(dateDigitString);
  const dimensionScores = calculateDimensionScores(digitFrequency);

  const id = `dob_${Date.now()}_${day}_${month}_${year}`;

  return {
    id,
    rawDate: rawDateInput,
    day,
    month,
    year,
    coreLifeNumber,
    dayNumber,
    digitFrequency,
    dimensionScores,
    calculatedAt: new Date().toISOString(),
    engineVersion: NUMBER_ENGINE_VERSION,
  };
}
