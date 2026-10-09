import { describe, it, expect } from 'vitest';
import {
  fuseNumberAndPersonality,
  generateFusionIdentity,
  calculatePillarProfiles,
  calculateNumberMoneyInfluence,
} from '../engine/fusionEngine';
import { determineArchetype, evaluatePersonalityTest } from '../engine/personalityEngine';
import { analyzeMobile } from '../engine/numberEngine';
import { PERSONALITY_ARCHETYPES } from '../data/personalityTypes';
import { DimensionScores } from '../types/number';

describe('Phase 3: Deterministic Fusion Engine & Premium Report Engine', () => {
  describe('1. 40% Number + 60% Personality Scoring Weighting', () => {
    it('calculates exact 40/60 blended dimension scores', () => {
      const numberRes = analyzeMobile('9876543210');
      const personalityRes = evaluatePersonalityTest('free', [
        { questionId: 'q1', selectedOptionId: 'opt_5', value: 5 }, // curiosity: 100
        { questionId: 'q2', selectedOptionId: 'opt_5', value: 5 }, // independence: 100
        { questionId: 'q3', selectedOptionId: 'opt_1', value: 1 }, // leadership: 0
        { questionId: 'q4', selectedOptionId: 'opt_1', value: 1 }, // social: 0
        { questionId: 'q5', selectedOptionId: 'opt_3', value: 3 }, // emotional: 50
        { questionId: 'q6', selectedOptionId: 'opt_3', value: 3 }, // stability: 50
        { questionId: 'q7', selectedOptionId: 'opt_5', value: 5 },
        { questionId: 'q8', selectedOptionId: 'opt_5', value: 5 },
        { questionId: 'q9', selectedOptionId: 'opt_3', value: 3 },
        { questionId: 'q10', selectedOptionId: 'opt_3', value: 3 },
      ]);

      const fusion = fuseNumberAndPersonality(numberRes, personalityRes);

      const dimensions: (keyof DimensionScores)[] = [
        'curiosity',
        'independence',
        'leadership',
        'social',
        'emotional',
        'stability',
      ];

      for (const dim of dimensions) {
        const numScore = numberRes.dimensionScores[dim];
        const persScore = personalityRes.dimensionScores[dim];
        const expected = Math.min(100, Math.max(0, Math.round(numScore * 0.4 + persScore * 0.6)));
        expect(fusion.fusedDimensionScores[dim]).toBe(expected);
      }
    });
  });

  describe('2. Exact Pillar Profile Formulas', () => {
    const fusedScores: DimensionScores = {
      curiosity: 80,
      independence: 70,
      leadership: 60,
      social: 75,
      emotional: 65,
      stability: 55,
    };

    const mockNumRes = analyzeMobile('9876543210');
    const mockIdentity = generateFusionIdentity(7, 'Adventure', PERSONALITY_ARCHETYPES.explorer);

    it('calculates Love score = Emotional × 0.45 + Social × 0.30 + Independence × 0.25', () => {
      const pillars = calculatePillarProfiles(fusedScores, mockNumRes, mockIdentity);
      const expectedLove = Math.round(65 * 0.45 + 75 * 0.30 + 70 * 0.25);
      expect(pillars.love.score).toBe(expectedLove);
    });

    it('calculates Career score = Leadership × 0.30 + Curiosity × 0.25 + Independence × 0.25 + Stability × 0.20', () => {
      const pillars = calculatePillarProfiles(fusedScores, mockNumRes, mockIdentity);
      const expectedCareer = Math.round(60 * 0.30 + 80 * 0.25 + 70 * 0.25 + 55 * 0.20);
      expect(pillars.career.score).toBe(expectedCareer);
    });

    it('calculates Money score = Independence × 0.35 + Stability × 0.25 + Leadership × 0.25 + Number Money Influence × 0.15', () => {
      const moneyInfluence = calculateNumberMoneyInfluence(mockNumRes);
      const pillars = calculatePillarProfiles(fusedScores, mockNumRes, mockIdentity);
      const expectedMoney = Math.round(70 * 0.35 + 55 * 0.25 + 60 * 0.25 + moneyInfluence * 0.15);
      expect(pillars.money.score).toBe(expectedMoney);
    });

    it('calculates Communication score = Social × 0.35 + Emotional × 0.25 + Leadership × 0.20 + Curiosity × 0.20', () => {
      const pillars = calculatePillarProfiles(fusedScores, mockNumRes, mockIdentity);
      const expectedComm = Math.round(75 * 0.35 + 65 * 0.25 + 60 * 0.20 + 80 * 0.20);
      expect(pillars.communication.score).toBe(expectedComm);
    });

    it('calculates Learning score = Curiosity × 0.45 + Stability × 0.25 + Independence × 0.30', () => {
      const pillars = calculatePillarProfiles(fusedScores, mockNumRes, mockIdentity);
      const expectedLearning = Math.round(80 * 0.45 + 55 * 0.25 + 70 * 0.30);
      expect(pillars.learning.score).toBe(expectedLearning);
    });
  });

  describe('3. Personality Archetype Resolution & Secondary Dimension Rule (>= 65)', () => {
    it('resolves Curiosity + Independence = Explorer', () => {
      const scores: DimensionScores = {
        curiosity: 90,
        independence: 80,
        leadership: 30,
        social: 20,
        emotional: 40,
        stability: 30,
      };
      const res = determineArchetype(scores);
      expect(res.primaryArchetype.id).toBe('explorer');
      expect(res.secondaryDimension).toBe('independence');
    });

    it('resolves Leadership + Independence = Leader', () => {
      const scores: DimensionScores = {
        leadership: 95,
        independence: 85,
        curiosity: 40,
        social: 20,
        emotional: 30,
        stability: 40,
      };
      const res = determineArchetype(scores);
      expect(res.primaryArchetype.id).toBe('leader');
    });

    it('resolves Emotional + Social = Empath', () => {
      const scores: DimensionScores = {
        emotional: 90,
        social: 75,
        curiosity: 30,
        independence: 20,
        leadership: 10,
        stability: 30,
      };
      const res = determineArchetype(scores);
      expect(res.primaryArchetype.id).toBe('empath');
    });

    it('resolves Curiosity + Stability = Thinker', () => {
      const scores: DimensionScores = {
        curiosity: 88,
        stability: 72,
        independence: 40,
        social: 20,
        emotional: 30,
        leadership: 30,
      };
      const res = determineArchetype(scores);
      expect(res.primaryArchetype.id).toBe('thinker');
    });

    it('resolves Stability + Independence = Builder', () => {
      const scores: DimensionScores = {
        stability: 90,
        independence: 80,
        curiosity: 30,
        social: 20,
        emotional: 30,
        leadership: 40,
      };
      const res = determineArchetype(scores);
      expect(res.primaryArchetype.id).toBe('builder');
    });

    it('resolves Social + Emotional = Connector', () => {
      const scores: DimensionScores = {
        social: 92,
        emotional: 70,
        curiosity: 30,
        independence: 20,
        leadership: 40,
        stability: 30,
      };
      const res = determineArchetype(scores);
      expect(res.primaryArchetype.id).toBe('connector');
    });

    it('resolves Leadership + Curiosity = Challenger', () => {
      const scores: DimensionScores = {
        leadership: 90,
        curiosity: 75,
        independence: 50,
        social: 30,
        emotional: 20,
        stability: 30,
      };
      const res = determineArchetype(scores);
      expect(res.primaryArchetype.id).toBe('challenger');
    });

    it('resolves Stability + Emotional = Harmonizer', () => {
      const scores: DimensionScores = {
        stability: 85,
        emotional: 70,
        curiosity: 30,
        independence: 20,
        leadership: 20,
        social: 50,
      };
      const res = determineArchetype(scores);
      expect(res.primaryArchetype.id).toBe('harmonizer');
    });

    it('resolves Curiosity + Social = Creator', () => {
      const scores: DimensionScores = {
        curiosity: 85,
        social: 70,
        independence: 40,
        emotional: 50,
        leadership: 20,
        stability: 30,
      };
      const res = determineArchetype(scores);
      expect(res.primaryArchetype.id).toBe('creator');
    });

    it('resolves Leadership + Stability = Strategist', () => {
      const scores: DimensionScores = {
        leadership: 90,
        stability: 75,
        curiosity: 50,
        independence: 50,
        social: 30,
        emotional: 20,
      };
      const res = determineArchetype(scores);
      expect(res.primaryArchetype.id).toBe('strategist');
    });

    it('ignores secondary dimension when second highest score is < 65', () => {
      const scores: DimensionScores = {
        curiosity: 85,
        independence: 58, // < 65 -> not considered as secondary
        leadership: 30,
        social: 20,
        emotional: 20,
        stability: 20,
      };
      const res = determineArchetype(scores);
      expect(res.primaryArchetype.id).toBe('explorer');
      expect(res.secondaryDimension).toBeUndefined();
      expect(res.secondaryArchetype).toBeUndefined();
    });
  });

  describe('4. Fusion Identity Generation', () => {
    it('generates exact identities for prompt benchmark cases', () => {
      expect(generateFusionIdentity(7, 'Adventure', PERSONALITY_ARCHETYPES.explorer).name).toBe(
        'Adventurous Explorer'
      );
      expect(generateFusionIdentity(4, 'Love', PERSONALITY_ARCHETYPES.leader).name).toBe(
        'Caring Leader'
      );
      expect(generateFusionIdentity(1, 'Money', PERSONALITY_ARCHETYPES.builder).name).toBe(
        'Ambitious Builder'
      );
      expect(generateFusionIdentity(5, 'Freedom', PERSONALITY_ARCHETYPES.empath).name).toBe(
        'Independent Empath'
      );
      expect(generateFusionIdentity(8, 'Power', PERSONALITY_ARCHETYPES.strategist).name).toBe(
        'Strategic Leader'
      );
      expect(generateFusionIdentity(0, 'Balance', PERSONALITY_ARCHETYPES.connector).name).toBe(
        'Harmonious Connector'
      );
    });
  });

  describe('5. Snapshot Architecture & Report Versioning', () => {
    it('creates an immutable, fully populated snapshot on fusion generation', () => {
      const numberRes = analyzeMobile('9876543210');
      const personalityRes = evaluatePersonalityTest('complete', [
        { questionId: 'q1', selectedOptionId: 'opt_5', value: 5 },
        { questionId: 'q2', selectedOptionId: 'opt_5', value: 5 },
        { questionId: 'q3', selectedOptionId: 'opt_4', value: 4 },
        { questionId: 'q4', selectedOptionId: 'opt_3', value: 3 },
        { questionId: 'q5', selectedOptionId: 'opt_4', value: 4 },
      ]);

      const fusion = fuseNumberAndPersonality(numberRes, personalityRes);

      expect(fusion.engineVersion).toBe('1.0');
      expect(fusion.reportVersion).toBe('1.0.0');
      expect(fusion.snapshot).toBeDefined();
      expect(fusion.snapshot.snapshotId).toContain('snap_');
      expect(fusion.snapshot.pillarScores.love).toBe(fusion.pillars.love.score);
      expect(fusion.snapshot.pillarScores.career).toBe(fusion.pillars.career.score);
      expect(fusion.snapshot.pillarScores.money).toBe(fusion.pillars.money.score);
      expect(fusion.snapshot.personalityMetrics.primaryArchetypeId).toBe(
        personalityRes.primaryArchetype.id
      );
    });
  });
});
