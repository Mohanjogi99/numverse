import {
  StructuredAIReportContent,
  StructuredFusionInput,
} from '../types/aiReport';

export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  error?: string;
}

/**
 * Validates that an incoming profile meets all schema requirements before calling AI.
 */
export function validateFusionInput(input: unknown): ValidationResult<StructuredFusionInput> {
  if (!input || typeof input !== 'object') {
    return { isValid: false, error: 'Profile input must be a valid non-null object.' };
  }

  const p = input as Partial<StructuredFusionInput>;

  if (typeof p.dominantNumber !== 'number' || p.dominantNumber < 0 || p.dominantNumber > 9) {
    return { isValid: false, error: 'Invalid or missing dominantNumber (must be 0-9).' };
  }

  if (!p.dominantTheme || typeof p.dominantTheme !== 'string') {
    return { isValid: false, error: 'Missing dominantTheme string.' };
  }

  if (!p.personalityType || typeof p.personalityType !== 'string') {
    return { isValid: false, error: 'Missing personalityType string.' };
  }

  if (!p.primaryDimension || typeof p.primaryDimension !== 'string') {
    return { isValid: false, error: 'Missing primaryDimension string.' };
  }

  if (!p.finalDimensions || typeof p.finalDimensions !== 'object') {
    return { isValid: false, error: 'Missing finalDimensions object.' };
  }

  const requiredDims = ['curiosity', 'independence', 'leadership', 'social', 'emotional', 'stability'] as const;
  for (const dim of requiredDims) {
    const val = (p.finalDimensions as unknown as Record<string, number>)[dim];
    if (typeof val !== 'number' || isNaN(val) || val < 0 || val > 100) {
      return { isValid: false, error: `Invalid dimension score for ${dim}: must be number 0-100.` };
    }
  }

  const requiredPillars = ['loveProfile', 'careerProfile', 'moneyProfile', 'communicationProfile', 'learningProfile', 'growthProfile'] as const;
  for (const pillar of requiredPillars) {
    const pObj = p[pillar];
    if (!pObj || typeof pObj !== 'object' || typeof pObj.score !== 'number') {
      return { isValid: false, error: `Missing or invalid pillar profile: ${pillar}.` };
    }
  }

  return { isValid: true, data: input as StructuredFusionInput };
}

/**
 * Validates the raw JSON output from OpenAI against the required structured schema.
 */
export function validateStructuredAIResponse(rawOutput: unknown): ValidationResult<StructuredAIReportContent> {
  if (!rawOutput || typeof rawOutput !== 'object') {
    return { isValid: false, error: 'OpenAI output must be a non-null object.' };
  }

  const obj = rawOutput as Record<string, unknown>;

  const stringFields = [
    'title',
    'signatureSentence',
    'summary',
    'relationships',
    'career',
    'money',
    'communication',
    'learning',
    'growth',
    'story',
  ] as const;

  for (const field of stringFields) {
    const val = obj[field];
    if (typeof val !== 'string' || val.trim().length === 0) {
      return { isValid: false, error: `Field '${field}' is required and must be a non-empty string.` };
    }
  }

  const arrayFields = ['strengths', 'challenges'] as const;
  for (const field of arrayFields) {
    const arr = obj[field];
    if (!Array.isArray(arr) || arr.length === 0) {
      return { isValid: false, error: `Field '${field}' is required and must be a non-empty array of strings.` };
    }
    for (let i = 0; i < arr.length; i++) {
      if (typeof arr[i] !== 'string' || (arr[i] as string).trim().length === 0) {
        return { isValid: false, error: `Item at index ${i} in '${field}' must be a non-empty string.` };
      }
    }
  }

  const content: StructuredAIReportContent = {
    title: (obj.title as string).trim(),
    signatureSentence: (obj.signatureSentence as string).trim(),
    summary: (obj.summary as string).trim(),
    strengths: (obj.strengths as string[]).map((s) => s.trim()),
    challenges: (obj.challenges as string[]).map((c) => c.trim()),
    relationships: (obj.relationships as string).trim(),
    career: (obj.career as string).trim(),
    money: (obj.money as string).trim(),
    communication: (obj.communication as string).trim(),
    learning: (obj.learning as string).trim(),
    growth: (obj.growth as string).trim(),
    story: (obj.story as string).trim(),
  };

  return { isValid: true, data: content };
}
