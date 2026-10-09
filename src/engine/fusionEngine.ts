import { NumberAnalysisResult, DimensionScores } from '../types/number';
import { PersonalityAssessmentResult, PersonalityTypeArchetype } from '../types/personality';
import {
  FusionAnalysisResult,
  FusionIdentity,
  FusionPillars,
  PillarProfile,
  DimensionAlignment,
  FusionSnapshot,
} from '../types/fusion';
import { NUMBER_ENGINE_VERSION } from '../data/influenceMatrix';
import { getScoreBand } from '../config/constants';
import { PERSONALITY_ARCHETYPES } from '../data/personalityTypes';

export const FUSION_REPORT_VERSION = '1.0.0';

const DIMENSION_LABELS: Record<keyof DimensionScores, string> = {
  curiosity: 'Curiosity & Exploration',
  independence: 'Independence & Autonomy',
  leadership: 'Strategic Leadership & Agency',
  social: 'Social & Interpersonal Synergy',
  emotional: 'Emotional Connection & Empathy',
  stability: 'Grounding & Stability',
};

// Theme adjective mapping for Fusion Identity
const THEME_ADJECTIVES: Record<number, string> = {
  0: 'Harmonious', // Balance -> Harmonious Connector
  1: 'Ambitious',  // Money -> Ambitious Builder
  2: 'Collaborative', // Partnership
  3: 'Driven',     // Success
  4: 'Caring',     // Love -> Caring Leader
  5: 'Independent', // Freedom -> Independent Empath
  6: 'Steadfast',  // Protection
  7: 'Adventurous', // Adventure -> Adventurous Explorer
  8: 'Strategic',  // Power -> Strategic Leader
  9: 'Transformative', // Transformation
};

/**
 * Calculates Number Money Influence (0-100) deterministically from the Number Analysis Result.
 */
export function calculateNumberMoneyInfluence(numberResult: NumberAnalysisResult): number {
  const isDigit1Dominant = numberResult.dominantNumbers?.some((d) => d.digit === 1) || false;
  const digit1Count = numberResult.digitFrequency?.[1] || 0;
  
  if (isDigit1Dominant) {
    return Math.min(100, Math.max(70, 75 + digit1Count * 5));
  }
  
  const baseFromDimensions =
    (numberResult.dimensionScores?.independence || 50) * 0.45 +
    (numberResult.dimensionScores?.stability || 50) * 0.35 +
    (numberResult.dimensionScores?.leadership || 50) * 0.20;
    
  if (digit1Count > 0) {
    return Math.min(100, Math.round(baseFromDimensions * 0.8 + (digit1Count * 15 + 40) * 0.2));
  }
  
  return Math.min(100, Math.max(0, Math.round(baseFromDimensions)));
}

/**
 * Generates a memorable, meaningful Fusion Identity from the dominant Number Theme and Personality Archetype.
 */
export function generateFusionIdentity(
  primaryNumber: number,
  themeName: string,
  archetype: PersonalityTypeArchetype
): FusionIdentity {
  const adjective = THEME_ADJECTIVES[primaryNumber] || 'Dynamic';
  const cleanArchetypeTitle = archetype.title.replace(/^The\s+/i, '');

  let name = `${adjective} ${cleanArchetypeTitle}`;

  // Custom polished overrides for classical archetypes
  if (themeName.toLowerCase() === 'power' && archetype.id === 'strategist') {
    name = 'Strategic Leader';
  } else if (themeName.toLowerCase() === 'balance' && archetype.id === 'connector') {
    name = 'Harmonious Connector';
  } else if (themeName.toLowerCase() === 'love' && archetype.id === 'leader') {
    name = 'Caring Leader';
  } else if (themeName.toLowerCase() === 'freedom' && archetype.id === 'empath') {
    name = 'Independent Empath';
  } else if (themeName.toLowerCase() === 'money' && archetype.id === 'builder') {
    name = 'Ambitious Builder';
  } else if (themeName.toLowerCase() === 'adventure' && archetype.id === 'explorer') {
    name = 'Adventurous Explorer';
  }

  const tagline = `Blending the ${themeName.toLowerCase()} frequency of number ${primaryNumber} with the ${archetype.title.toLowerCase()} archetype.`;

  return {
    name,
    numberTheme: themeName,
    archetypeTitle: archetype.title,
    tagline,
    blendAdjective: adjective,
    archetype,
  };
}

/**
 * Deterministically computes the 6 Pillar Profiles using exact formulas.
 */
export function calculatePillarProfiles(
  fusedScores: DimensionScores,
  numberResult: NumberAnalysisResult,
  fusionIdentity: FusionIdentity
): FusionPillars {
  const { curiosity, independence, leadership, social, emotional, stability } = fusedScores;

  // 1. Love Profile Formula:
  // Love = Emotional * 0.45 + Social * 0.30 + Independence * 0.25
  const rawLove = emotional * 0.45 + social * 0.30 + independence * 0.25;
  const loveScore = Math.min(100, Math.max(0, Math.round(rawLove)));
  const loveBand = getScoreBand(loveScore);

  const loveProfile: PillarProfile = {
    key: 'love',
    title: 'Love & Relational Dynamics',
    score: loveScore,
    scoreBand: loveBand,
    headline:
      loveScore >= 75
        ? 'Deep Empathy with Healthy Autonomy'
        : loveScore >= 50
        ? 'Balanced Relational Harmony'
        : 'Self-Sustaining Relational Rhythm',
    summary: `Your relational profile suggests an alignment of ${loveBand.label.toLowerCase()} emotional attunement (${emotional}) and thoughtful social connection (${social}). You thrive with partners who honor your independence while nurturing authentic vulnerability.`,
    strengths: [
      'Empathetic and compassionate communication with loved ones',
      'Respect for healthy personal boundaries and emotional space',
      'Desire for authentic, growth-oriented partnership',
    ],
    growthAdvice: [
      'Express your emotional needs directly rather than expecting partners to intuitively sense them.',
      'Allow shared vulnerability to deepen intimacy without fearing loss of independence.',
    ],
    reflectionPrompt: 'How can you create space this week for both deep intimacy and personal solitude in your closest relationships?',
  };

  // 2. Career Profile Formula:
  // Career = Leadership * 0.30 + Curiosity * 0.25 + Independence * 0.25 + Stability * 0.20
  const rawCareer = leadership * 0.30 + curiosity * 0.25 + independence * 0.25 + stability * 0.20;
  const careerScore = Math.min(100, Math.max(0, Math.round(rawCareer)));
  const careerBand = getScoreBand(careerScore);

  const careerProfile: PillarProfile = {
    key: 'career',
    title: 'Career & Professional Trajectory',
    score: careerScore,
    scoreBand: careerBand,
    headline:
      careerScore >= 75
        ? 'High Strategic Agency & Exploratory Leadership'
        : careerScore >= 50
        ? 'Pragmatic Initiative & Collaborative Execution'
        : 'Focused Specialist & Autonomous Contributor',
    summary: `Your vocational profile suggests a blend of strategic leadership (${leadership}), intellectual curiosity (${curiosity}), and autonomous execution (${independence}). You flourish in dynamic environments that reward initiative and innovative problem solving.`,
    strengths: [
      'Proactive initiative and calculated risk-taking',
      'Multidisciplinary synthesis and quick learning curve',
      'Ability to design clear operational roadmaps amidst ambiguity',
    ],
    growthAdvice: [
      'Delegate operational tasks early to protect your strategic thinking time.',
      'Align your daily professional goals with enduring long-term values.',
    ],
    reflectionPrompt: 'Which professional initiative currently offers you the highest combination of autonomy, curiosity, and measurable impact?',
  };

  // 3. Money Mindset Formula:
  // Money = Independence * 0.35 + Stability * 0.25 + Leadership * 0.25 + Number Money Influence * 0.15
  const numberMoneyInfluence = calculateNumberMoneyInfluence(numberResult);
  const rawMoney =
    independence * 0.35 + stability * 0.25 + leadership * 0.25 + numberMoneyInfluence * 0.15;
  const moneyScore = Math.min(100, Math.max(0, Math.round(rawMoney)));
  const moneyBand = getScoreBand(moneyScore);

  const moneyProfile: PillarProfile = {
    key: 'money',
    title: 'Money & Wealth Mindset',
    score: moneyScore,
    scoreBand: moneyBand,
    headline:
      moneyScore >= 75
        ? 'Strategic Wealth Building & Financial Sovereignty'
        : moneyScore >= 50
        ? 'Prudent Resource Management & Stability'
        : 'Value-First Financial Orientation',
    summary: `Your financial profile reflects an orientation toward financial sovereignty (${independence}), practical grounding (${stability}), and decisive resource allocation. Your numeric money resonance score is ${numberMoneyInfluence}.`,
    strengths: [
      'Long-term perspective on wealth accumulation and financial security',
      'Disciplined allocation and practical risk management',
      'High motivation for financial self-reliance',
    ],
    growthAdvice: [
      'Balance cautious financial preservation with well-researched calculated growth investments.',
      'Regularly review your spending alignment against your true personal priorities.',
    ],
    reflectionPrompt: 'What financial milestone would grant you the greatest sense of personal freedom over the next three years?',
  };

  // 4. Communication Profile Formula:
  // Communication = Social * 0.35 + Emotional * 0.25 + Leadership * 0.20 + Curiosity * 0.20
  const rawComm = social * 0.35 + emotional * 0.25 + leadership * 0.20 + curiosity * 0.20;
  const commScore = Math.min(100, Math.max(0, Math.round(rawComm)));
  const commBand = getScoreBand(commScore);

  const communicationProfile: PillarProfile = {
    key: 'communication',
    title: 'Communication & Interpersonal Style',
    score: commScore,
    scoreBand: commBand,
    headline:
      commScore >= 75
        ? 'Inspirational, Articulate & Empathetic Presence'
        : commScore >= 50
        ? 'Clear, Receptive & Balanced Dialogue'
        : 'Reflective, Focused & Thoughtful Exchange',
    summary: `Your interpersonal profile indicates a communication style rooted in active engagement (${social}) and empathetic resonance (${emotional}). You excel at conveying intricate concepts with warmth and persuasive clarity.`,
    strengths: [
      'Diplomatic tact and natural consensus-building ability',
      'Clarity in articulating complex concepts to diverse audiences',
      'Receptive listening and emotional validation',
    ],
    growthAdvice: [
      'Practice radical candor during tough conversations without fearing interpersonal discomfort.',
      'Check for mutual understanding before transitioning to action steps.',
    ],
    reflectionPrompt: 'Where could more transparent, assertive communication unlock clarity in your current projects?',
  };

  // 5. Learning Profile Formula:
  // Learning = Curiosity * 0.45 + Stability * 0.25 + Independence * 0.30
  const rawLearning = curiosity * 0.45 + stability * 0.25 + independence * 0.30;
  const learningScore = Math.min(100, Math.max(0, Math.round(rawLearning)));
  const learningBand = getScoreBand(learningScore);

  const learningProfile: PillarProfile = {
    key: 'learning',
    title: 'Learning & Cognitive Style',
    score: learningScore,
    scoreBand: learningBand,
    headline:
      learningScore >= 75
        ? 'Rapid Multidisciplinary Inquiry & Autonomous Mastery'
        : learningScore >= 50
        ? 'Methodical Skill Acquisition & Pragmatic Synthesis'
        : 'Deep Specialized Focus & Focused Absorption',
    summary: `Your cognitive profile shows high curiosity (${curiosity}) powered by autonomous learning instincts (${independence}). You absorb knowledge most effectively when given room to experiment and synthesize connections across disparate fields.`,
    strengths: [
      'Fast comprehension of novel frameworks and unconventional models',
      'Autonomous drive to investigate root causes and first principles',
      'Ability to integrate theoretical knowledge into practical tools',
    ],
    growthAdvice: [
      'Complete one deep learning project before initiating multiple new inquiries.',
      'Document your insights systematically to compound your intellectual capital over time.',
    ],
    reflectionPrompt: 'What single skill or subject, if mastered over the next quarter, would create the greatest leverage for you?',
  };

  // 6. Growth Profile (Synthesis of growth vectors, blind spots, and developmental vectors)
  const sortedDimensions = (Object.keys(fusedScores) as (keyof DimensionScores)[]).sort(
    (a, b) => fusedScores[b] - fusedScores[a]
  );
  const topDim = sortedDimensions[0];
  const bottomDim = sortedDimensions[sortedDimensions.length - 1];

  const rawGrowth = (fusedScores[topDim] + (100 - fusedScores[bottomDim])) / 2;
  const growthScore = Math.min(100, Math.max(0, Math.round(rawGrowth)));
  const growthBand = getScoreBand(growthScore);

  const growthProfile: PillarProfile = {
    key: 'growth',
    title: 'Personal Growth & Potential Vectors',
    score: growthScore,
    scoreBand: growthBand,
    headline: `${fusionIdentity.name} Evolutionary Trajectory`,
    summary: `Your primary strength centers on ${DIMENSION_LABELS[topDim].toLowerCase()} (${fusedScores[topDim]}), while your most fruitful expansion vector lies in consciously developing ${DIMENSION_LABELS[bottomDim].toLowerCase()} (${fusedScores[bottomDim]}).`,
    strengths: [
      `Exceptional natural baseline in ${DIMENSION_LABELS[topDim].toLowerCase()}`,
      'High self-awareness and capacity for structured self-reflection',
      'Resilient adaptability when integrating feedback into daily routines',
    ],
    growthAdvice: [
      `Introduce small, recurring habits that reinforce ${DIMENSION_LABELS[bottomDim].toLowerCase()}.`,
      `Leverage your dominant strength in ${DIMENSION_LABELS[topDim].toLowerCase()} to scaffold new developmental challenges.`,
    ],
    reflectionPrompt: `What is one concrete boundary or routine you can establish today to nurture your growth in ${DIMENSION_LABELS[bottomDim].toLowerCase()}?`,
  };

  return {
    love: loveProfile,
    career: careerProfile,
    money: moneyProfile,
    communication: communicationProfile,
    learning: learningProfile,
    growth: growthProfile,
  };
}

/**
 * Deterministically blends Number Analysis with Personality Assessment using exact 40% / 60% weighting.
 *
 * Final Dimension Score = (Number Score × 0.40) + (Personality Test Score × 0.60)
 */
export function fuseNumberAndPersonality(
  numberResult: NumberAnalysisResult,
  personalityResult: PersonalityAssessmentResult
): FusionAnalysisResult {
  const dimensions: (keyof DimensionScores)[] = [
    'curiosity',
    'independence',
    'leadership',
    'social',
    'emotional',
    'stability',
  ];

  const fusedScores: DimensionScores = {
    curiosity: 0,
    independence: 0,
    leadership: 0,
    social: 0,
    emotional: 0,
    stability: 0,
  };

  const alignments: DimensionAlignment[] = [];
  let totalDelta = 0;

  // Exact 40% Number + 60% Personality scoring formula
  for (const dim of dimensions) {
    const numScore = numberResult.dimensionScores[dim] || 50;
    const persScore = personalityResult.dimensionScores[dim] || 50;

    // Exact formula: (Number * 0.40) + (Personality * 0.60)
    const fused = Math.min(100, Math.max(0, Math.round(numScore * 0.40 + persScore * 0.60)));
    fusedScores[dim] = fused;

    const delta = Math.abs(numScore - persScore);
    totalDelta += delta;

    let status: 'harmonic' | 'complementary' | 'tension' = 'harmonic';
    let insight = '';

    if (delta <= 15) {
      status = 'harmonic';
      insight = `Your number patterns strongly align with your self-reported ${DIMENSION_LABELS[dim].toLowerCase()} disposition.`;
    } else if (delta <= 35) {
      status = 'complementary';
      insight = `Your conscious personality dynamically balances your latent numeric frequency in ${DIMENSION_LABELS[dim].toLowerCase()}.`;
    } else {
      status = 'tension';
      insight = `A creative dynamic tension exists between your number frequency (${numScore}) and your active responses (${persScore}) in ${DIMENSION_LABELS[dim].toLowerCase()}.`;
    }

    alignments.push({
      dimension: dim,
      numberScore: numScore,
      personalityScore: persScore,
      delta,
      status,
      insight,
    });
  }

  // Synergy score: higher when delta is lower, bounded 60-98 for encouraging engagement
  const averageDelta = totalDelta / dimensions.length;
  const synergyScore = Math.max(60, Math.min(98, Math.round(100 - averageDelta * 0.75)));

  // Determine Fusion Identity
  const primaryNumber = numberResult.primaryNumber;
  const dominantTheme = numberResult.dominantNumbers[0]?.theme || 'Balance';
  const archetype = personalityResult.primaryArchetype || PERSONALITY_ARCHETYPES['explorer'];
  const fusionIdentity = generateFusionIdentity(primaryNumber, dominantTheme, archetype);

  // Compute 6 Pillar Profiles using exact formulas
  const pillars = calculatePillarProfiles(fusedScores, numberResult, fusionIdentity);

  // Build immutable snapshot architecture
  const snapshotId = `snap_${Date.now()}_${numberResult.id.slice(-4)}_${personalityResult.id.slice(-4)}`;
  const snapshot: FusionSnapshot = {
    snapshotId,
    engineVersion: NUMBER_ENGINE_VERSION,
    reportVersion: FUSION_REPORT_VERSION,
    timestamp: new Date().toISOString(),
    inputs: {
      mobileInputRaw: numberResult.inputRaw,
      answersCount: personalityResult.answers.length,
      tier: personalityResult.tier,
    },
    numberMetrics: {
      dominantDigits: numberResult.dominantNumbers.map((d) => d.digit),
      dimensionScores: numberResult.dimensionScores,
    },
    personalityMetrics: {
      primaryArchetypeId: personalityResult.primaryArchetype.id,
      secondaryArchetypeId: personalityResult.secondaryArchetype?.id,
      dimensionScores: personalityResult.dimensionScores,
    },
    fusedDimensionScores: fusedScores,
    pillarScores: {
      love: pillars.love.score,
      career: pillars.career.score,
      money: pillars.money.score,
      communication: pillars.communication.score,
      learning: pillars.learning.score,
      growth: pillars.growth.score,
    },
  };

  const fusionNarrative = {
    coreTheme: fusionIdentity.name,
    summary: `Your fusion profile illustrates an intentional synthesis between your ${dominantTheme.toLowerCase()} number rhythm and your ${archetype.title.toLowerCase()} mindset. This creates a cohesive balance between innate numeric resonance (40%) and active assessment responses (60%).`,
    primaryStrength: `Strong harmonic resonance across ${alignments.filter((a) => a.status === 'harmonic').map((a) => a.dimension).join(', ') || 'core dimensions'}, providing clear inner direction.`,
    potentialBlindspot: `Balancing creative tensions where active assessment responses diverge from latent numeric patterns.`,
    growthOpportunity: `Translating your ${pillars.growth.title.toLowerCase()} insights into intentional life habits.`,
  };

  return {
    id: `fusion_${Date.now()}_${numberResult.id.slice(-4)}_${personalityResult.id.slice(-4)}`,
    numberAnalysisId: numberResult.id,
    personalityAssessmentId: personalityResult.id,
    numberResult,
    personalityResult,
    fusionIdentity,
    fusedDimensionScores: fusedScores,
    pillars,
    alignments,
    overallSynergyScore: synergyScore,
    fusionNarrative,
    snapshot,
    calculatedAt: new Date().toISOString(),
    engineVersion: NUMBER_ENGINE_VERSION,
    reportVersion: FUSION_REPORT_VERSION,
  };
}
