export const APP_CONFIG = {
  APP_NAME: 'Numverse',
  TAGLINE: 'Numbers की दुनिया',
  SECONDARY_TAGLINE: 'Numbers की दुनिया — भविष्य में कई personality tools जोड़ने की गुंजाइश।',
  DESCRIPTION:
    'Numverse: Numbers की दुनिया — Explore your number patterns, archetypes, and multi-dimensional personality tools in a unified universe.',
  DISCLAIMER:
    'Numverse is designed for entertainment and self-reflection. It is not a scientifically validated psychological assessment and does not provide medical, financial, professional, or guaranteed future predictions.',
  VERSION: '2.0.0',
};

export const DIMENSION_INFO = {
  curiosity: {
    label: 'Curiosity',
    description: 'Inquisitiveness, open-minded exploration, and enthusiasm for new ideas.',
    icon: 'Sparkles',
  },
  independence: {
    label: 'Independence',
    description: 'Autonomous initiative, self-reliance, and individual agency.',
    icon: 'Compass',
  },
  leadership: {
    label: 'Leadership',
    description: 'Strategic direction, decisive action, and organizational drive.',
    icon: 'Crown',
  },
  social: {
    label: 'Social Connection',
    description: 'Interpersonal empathy, collaborative harmony, and relational rapport.',
    icon: 'Users',
  },
  emotional: {
    label: 'Emotional Sensitivity',
    description: 'Depth of feeling, empathy, intuitive awareness, and heartfelt connection.',
    icon: 'Heart',
  },
  stability: {
    label: 'Stability',
    description: 'Grounded consistency, order, reliability, and steady perseverance.',
    icon: 'Shield',
  },
} as const;

export interface ScoreBand {
  min: number;
  max: number;
  label: string;
  badgeClass: string;
}

export const SCORE_BANDS: ScoreBand[] = [
  { min: 90, max: 100, label: 'Highly Prominent', badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { min: 75, max: 89, label: 'Very Strong', badgeClass: 'bg-purple-100 text-purple-800 border-purple-200' },
  { min: 60, max: 74, label: 'Strong', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200' },
  { min: 40, max: 59, label: 'Moderate', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' },
  { min: 0, max: 39, label: 'Less Prominent', badgeClass: 'bg-zinc-100 text-zinc-600 border-zinc-200' },
];

export function getScoreBand(score: number): ScoreBand {
  return (
    SCORE_BANDS.find((band) => score >= band.min && score <= band.max) || {
      min: 0,
      max: 39,
      label: 'Less Prominent',
      badgeClass: 'bg-zinc-100 text-zinc-600 border-zinc-200',
    }
  );
}
