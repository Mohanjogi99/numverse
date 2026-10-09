import {
  PersonalityAnswer,
  PersonalityAssessmentResult,
  PersonalityTier,
  PersonalityTypeArchetype,
} from '../types/personality';
import { DimensionScores } from '../types/number';
import { PERSONALITY_QUESTIONS } from '../data/personalityQuestions';
import { PERSONALITY_ARCHETYPES } from '../data/personalityTypes';
import { NUMBER_ENGINE_VERSION } from '../data/influenceMatrix';

/**
 * Deterministically computes 6-dimension scores from personality test answers.
 * Maps 1-5 Likert scale options to normalized 0-100 dimension scores.
 */
export function calculatePersonalityDimensionScores(answers: PersonalityAnswer[]): DimensionScores {
  const totals: Record<keyof DimensionScores, { sum: number; count: number }> = {
    curiosity: { sum: 0, count: 0 },
    independence: { sum: 0, count: 0 },
    leadership: { sum: 0, count: 0 },
    social: { sum: 0, count: 0 },
    emotional: { sum: 0, count: 0 },
    stability: { sum: 0, count: 0 },
  };

  for (const ans of answers) {
    const question = PERSONALITY_QUESTIONS.find((q) => q.id === ans.questionId);
    if (!question) continue;

    const dim = question.dimensionKey;
    const rawVal = ans.value || 3; // default neutral
    const scoreVal = question.reversed
      ? Math.round(((5 - rawVal) / 4) * 100)
      : Math.round(((rawVal - 1) / 4) * 100);

    totals[dim].sum += scoreVal;
    totals[dim].count += 1;
  }

  const result: DimensionScores = {
    curiosity: 50,
    independence: 50,
    leadership: 50,
    social: 50,
    emotional: 50,
    stability: 50,
  };

  (Object.keys(totals) as (keyof DimensionScores)[]).forEach((dim) => {
    if (totals[dim].count > 0) {
      result[dim] = Math.min(100, Math.max(0, Math.round(totals[dim].sum / totals[dim].count)));
    }
  });

  return result;
}

/**
 * Maps calculated dimension scores to the closest matching personality archetype among the 10 types.
 */
export function determineArchetype(scores: DimensionScores): {
  primaryArchetype: PersonalityTypeArchetype;
  secondaryArchetype?: PersonalityTypeArchetype;
  primaryDimension: keyof DimensionScores;
  secondaryDimension?: keyof DimensionScores;
} {
  const sortedDimensions = (Object.keys(scores) as (keyof DimensionScores)[]).sort(
    (a, b) => scores[b] - scores[a]
  );

  const primaryDim = sortedDimensions[0];
  const secondaryDim = sortedDimensions[1];
  const hasSecondary = scores[secondaryDim] >= 65;

  const pairKey = `${primaryDim}+${secondaryDim}`;

  // Deterministic 10-archetype mapping table
  const EXACT_PAIR_MAP: Record<string, string> = {
    'curiosity+independence': 'explorer',
    'independence+curiosity': 'explorer',
    'leadership+independence': 'leader',
    'independence+leadership': 'leader',
    'emotional+social': 'empath',
    'social+emotional': 'connector',
    'curiosity+stability': 'thinker',
    'stability+curiosity': 'thinker',
    'stability+independence': 'builder',
    'independence+stability': 'builder',
    'leadership+curiosity': 'challenger',
    'curiosity+leadership': 'challenger',
    'stability+emotional': 'harmonizer',
    'emotional+stability': 'harmonizer',
    'curiosity+social': 'creator',
    'social+curiosity': 'creator',
    'leadership+stability': 'strategist',
    'stability+leadership': 'strategist',
  };

  const SINGLE_DIM_MAP: Record<keyof DimensionScores, string> = {
    curiosity: 'explorer',
    leadership: 'leader',
    emotional: 'empath',
    stability: 'builder',
    social: 'connector',
    independence: 'explorer',
  };

  const chosenKey = EXACT_PAIR_MAP[pairKey] || SINGLE_DIM_MAP[primaryDim] || 'explorer';

  const primaryArchetype = PERSONALITY_ARCHETYPES[chosenKey] || PERSONALITY_ARCHETYPES['explorer'];

  let secondaryArchetype: PersonalityTypeArchetype | undefined = undefined;
  if (hasSecondary) {
    const secondaryKey = SINGLE_DIM_MAP[secondaryDim];
    if (secondaryKey && secondaryKey !== chosenKey && PERSONALITY_ARCHETYPES[secondaryKey]) {
      secondaryArchetype = PERSONALITY_ARCHETYPES[secondaryKey];
    } else {
      const candidates = Object.values(PERSONALITY_ARCHETYPES).filter(
        (a) => a.id !== primaryArchetype.id && (a.primaryDimension === secondaryDim || a.secondaryDimension === secondaryDim)
      );
      if (candidates.length > 0) {
        secondaryArchetype = candidates[0];
      }
    }
  }

  return {
    primaryArchetype,
    secondaryArchetype,
    primaryDimension: primaryDim,
    secondaryDimension: hasSecondary ? secondaryDim : undefined,
  };
}

/**
 * Deterministic evaluation pipeline for personality tests.
 */
export function evaluatePersonalityTest(
  tier: PersonalityTier,
  answers: PersonalityAnswer[]
): PersonalityAssessmentResult {
  const dimensionScores = calculatePersonalityDimensionScores(answers);
  const { primaryArchetype, secondaryArchetype, primaryDimension, secondaryDimension } =
    determineArchetype(dimensionScores);

  return {
    id: `pa_${Date.now()}_${tier}`,
    tier,
    answers,
    totalQuestions: answers.length,
    dimensionScores,
    primaryArchetype,
    secondaryArchetype,
    primaryDimension,
    secondaryDimension,
    completedAt: new Date().toISOString(),
    engineVersion: NUMBER_ENGINE_VERSION,
  };
}
