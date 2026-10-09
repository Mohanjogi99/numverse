import { describe, it, expect } from 'vitest';
import {
  normalizeMobileNumber,
  countDigits,
  calculateDistribution,
  getDominantNumbers,
  calculateDimensionScores,
  analyzeMobile,
} from '../engine/numberEngine';
import { reduceToSingleDigit, analyzeDateOfBirth } from '../engine/dobEngine';
import {
  calculatePersonalityDimensionScores,
  determineArchetype,
  evaluatePersonalityTest,
} from '../engine/personalityEngine';
import { fuseNumberAndPersonality } from '../engine/fusionEngine';
import { PERSONALITY_ARCHETYPES } from '../data/personalityTypes';
import { getQuestionsForTier } from '../data/personalityQuestions';
import { PRODUCTS } from '../config/products';
import { getScoreBand } from '../config/constants';
import { isValidPhoneNumber, isValidDobString } from '../utils/validation';

describe('Number Engine Suite', () => {
  it('normalizes mobile numbers correctly', () => {
    expect(normalizeMobileNumber('+91 74157-66779')).toBe('7415766779');
    expect(normalizeMobileNumber('98765 43210')).toBe('9876543210');
    expect(normalizeMobileNumber('09876543210')).toBe('9876543210');
    expect(normalizeMobileNumber('1-800-555-0199')).toBe('8005550199');
  });

  it('counts digit frequencies accurately', () => {
    const freq = countDigits('7415766779');
    expect(freq[7]).toBe(4);
    expect(freq[6]).toBe(2);
    expect(freq[1]).toBe(1);
    expect(freq[4]).toBe(1);
    expect(freq[5]).toBe(1);
    expect(freq[9]).toBe(1);
    expect(freq[0]).toBe(0);
    expect(freq[2]).toBe(0);
    expect(freq[3]).toBe(0);
    expect(freq[8]).toBe(0);
  });

  it('calculates digit distribution percentages correctly', () => {
    const freq = countDigits('7415766779');
    const dist = calculateDistribution(freq);
    expect(dist[7]).toBe(40);
    expect(dist[6]).toBe(20);
    expect(dist[1]).toBe(10);
  });

  it('determines dominant and supporting numbers without fabrication', () => {
    const freq = countDigits('7415766779');
    const dominant = getDominantNumbers(freq);
    expect(dominant[0].digit).toBe(7);
    expect(dominant[0].theme).toBe('Adventure');
    expect(dominant[0].isPrimary).toBe(true);
    expect(dominant[1].digit).toBe(6);
    expect(dominant[1].theme).toBe('Protection');
  });

  it('calculates deterministic dimension scores from matrix v1.0', () => {
    const freq = countDigits('7415766779');
    const scores = calculateDimensionScores(freq);
    expect(scores.curiosity).toBeGreaterThanOrEqual(70);
    expect(scores.independence).toBeGreaterThanOrEqual(65);
  });

  it('runs complete analyzeMobile pipeline', () => {
    const result = analyzeMobile('7415766779');
    expect(result.primaryNumber).toBe(7);
    expect(result.totalDigits).toBe(10);
    expect(result.dominantNumbers[0].theme).toBe('Adventure');
    expect(result.engineVersion).toBe('1.0');
  });
});

describe('DOB Engine Suite', () => {
  it('reduces numbers to single digits 0-9', () => {
    expect(reduceToSingleDigit(1995)).toBe(6); // 1+9+9+5 = 24 -> 2+4 = 6
    expect(reduceToSingleDigit(24)).toBe(6);
    expect(reduceToSingleDigit(7)).toBe(7);
  });

  it('analyzes date of birth deterministically', () => {
    const res = analyzeDateOfBirth('1995-08-24');
    expect(res.day).toBe(24);
    expect(res.month).toBe(8);
    expect(res.year).toBe(1995);
    expect(res.dayNumber).toBe(6); // 2+4 = 6
    expect(res.coreLifeNumber).toBe(2); // (24 + 8 + 1995) = 2027 -> 2+0+2+7 = 11 -> 1+1 = 2
  });
});

describe('Personality Engine & 10 Archetypes', () => {
  it('provides question subsets for free (10), standard (25), and complete (50)', () => {
    expect(getQuestionsForTier('free')).toHaveLength(10);
    expect(getQuestionsForTier('standard')).toHaveLength(25);
    expect(getQuestionsForTier('complete')).toHaveLength(50);
  });

  it('calculates 6 dimensions from answers', () => {
    const answers = [
      { questionId: 'q1', selectedOptionId: 'opt_5', value: 5 }, // curiosity
      { questionId: 'q2', selectedOptionId: 'opt_5', value: 5 }, // independence
      { questionId: 'q3', selectedOptionId: 'opt_3', value: 3 }, // leadership
      { questionId: 'q4', selectedOptionId: 'opt_3', value: 3 }, // social
      { questionId: 'q5', selectedOptionId: 'opt_3', value: 3 }, // emotional
      { questionId: 'q6', selectedOptionId: 'opt_3', value: 3 }, // stability
    ];
    const scores = calculatePersonalityDimensionScores(answers);
    expect(scores.curiosity).toBe(100);
    expect(scores.independence).toBe(100);
  });

  it('maps high curiosity & independence to Explorer archetype', () => {
    const scores = {
      curiosity: 95,
      independence: 90,
      leadership: 40,
      social: 45,
      emotional: 40,
      stability: 35,
    };
    const { primaryArchetype } = determineArchetype(scores);
    expect(primaryArchetype.id).toBe('explorer');
    expect(primaryArchetype.title).toBe('The Explorer');
  });

  it('contains all 10 distinct personality archetypes with full facets', () => {
    const archetypes = Object.values(PERSONALITY_ARCHETYPES);
    expect(archetypes).toHaveLength(10);
    archetypes.forEach((a) => {
      expect(a.title).toBeTruthy();
      expect(a.coreTraits.length).toBeGreaterThanOrEqual(3);
      expect(a.strengths.length).toBeGreaterThanOrEqual(3);
      expect(a.challenges.length).toBeGreaterThanOrEqual(2);
      expect(a.relationships).toBeTruthy();
      expect(a.career).toBeTruthy();
      expect(a.growth).toBeTruthy();
    });
  });

  it('evaluates complete personality test assessment', () => {
    const answers = [
      { questionId: 'q1', selectedOptionId: 'opt_5', value: 5 },
      { questionId: 'q2', selectedOptionId: 'opt_4', value: 4 },
      { questionId: 'q3', selectedOptionId: 'opt_3', value: 3 },
      { questionId: 'q4', selectedOptionId: 'opt_4', value: 4 },
      { questionId: 'q5', selectedOptionId: 'opt_3', value: 3 },
      { questionId: 'q6', selectedOptionId: 'opt_2', value: 2 },
      { questionId: 'q7', selectedOptionId: 'opt_5', value: 5 },
      { questionId: 'q8', selectedOptionId: 'opt_4', value: 4 },
      { questionId: 'q9', selectedOptionId: 'opt_3', value: 3 },
      { questionId: 'q10', selectedOptionId: 'opt_4', value: 4 },
    ];
    const result = evaluatePersonalityTest('free', answers);
    expect(result.tier).toBe('free');
    expect(result.totalQuestions).toBe(10);
    expect(result.primaryArchetype).toBeTruthy();
  });
});

describe('Fusion Engine Suite', () => {
  it('fuses number analysis and personality assessment deterministically', () => {
    const numResult = analyzeMobile('7415766779');
    const persResult = evaluatePersonalityTest('free', [
      { questionId: 'q1', selectedOptionId: 'opt_5', value: 5 },
      { questionId: 'q2', selectedOptionId: 'opt_5', value: 5 },
      { questionId: 'q3', selectedOptionId: 'opt_3', value: 3 },
      { questionId: 'q4', selectedOptionId: 'opt_3', value: 3 },
      { questionId: 'q5', selectedOptionId: 'opt_3', value: 3 },
      { questionId: 'q6', selectedOptionId: 'opt_3', value: 3 },
      { questionId: 'q7', selectedOptionId: 'opt_5', value: 5 },
      { questionId: 'q8', selectedOptionId: 'opt_5', value: 5 },
      { questionId: 'q9', selectedOptionId: 'opt_3', value: 3 },
      { questionId: 'q10', selectedOptionId: 'opt_3', value: 3 },
    ]);

    const fusion = fuseNumberAndPersonality(numResult, persResult);
    expect(fusion.overallSynergyScore).toBeGreaterThanOrEqual(60);
    expect(fusion.alignments).toHaveLength(6);
    expect(fusion.fusionNarrative.coreTheme).toBeTruthy();
  });
});

describe('Configuration and Validation', () => {
  it('verifies product tiers configuration', () => {
    expect(PRODUCTS.free.price).toBe(0);
    expect(PRODUCTS.standard.price).toBe(49);
    expect(PRODUCTS.complete.price).toBe(99);
    expect(PRODUCTS.combo.price).toBe(149);
    expect(PRODUCTS.combo.badge).toBe('BEST VALUE');
  });

  it('validates score bands correctly without negative labels', () => {
    expect(getScoreBand(95).label).toBe('Highly Prominent');
    expect(getScoreBand(80).label).toBe('Very Strong');
    expect(getScoreBand(65).label).toBe('Strong');
    expect(getScoreBand(50).label).toBe('Moderate');
    expect(getScoreBand(20).label).toBe('Less Prominent');
  });

  it('validates phone numbers and birth dates', () => {
    expect(isValidPhoneNumber('9876543210')).toBe(true);
    expect(isValidPhoneNumber('+91 98765-43210')).toBe(true);
    expect(isValidPhoneNumber('123')).toBe(false);
    expect(isValidDobString('1995-08-24')).toBe(true);
    expect(isValidDobString('invalid-date')).toBe(false);
  });
});
