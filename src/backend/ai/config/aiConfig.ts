import { SupportedLanguage } from '../types/aiReport';

export interface AIModelPricing {
  promptCostPerMillion: number;
  completionCostPerMillion: number;
}

export const MODEL_PRICING_REGISTRY: Record<string, AIModelPricing> = {
  'gpt-4o-mini': { promptCostPerMillion: 0.15, completionCostPerMillion: 0.6 },
  'gpt-4o': { promptCostPerMillion: 2.5, completionCostPerMillion: 10.0 },
  'gpt-4.5-preview': { promptCostPerMillion: 75.0, completionCostPerMillion: 150.0 },
  'gpt-6-luna': { promptCostPerMillion: 0.1, completionCostPerMillion: 0.4 }, // Luna low-cost forward compatibility
};

export const AI_BACKEND_CONFIG = {
  // Server-only OpenAI API Key (Never expose to client or VITE_ variables)
  get apiKey(): string | undefined {
    return process.env.OPENAI_API_KEY;
  },

  // Dynamic model configuration
  get model(): string {
    return process.env.OPENAI_MODEL || 'gpt-4o-mini';
  },

  // Versioned Prompt
  PROMPT_VERSION: '1.0',

  // Limits
  MAX_OUTPUT_TOKENS: 3000,
  MAX_RETRIES: 2,
  MAX_GENERATION_ATTEMPTS: 3,

  // Languages
  SUPPORTED_LANGUAGES: ['en', 'hi'] as SupportedLanguage[],
  DEFAULT_LANGUAGE: 'en' as SupportedLanguage,
};

export function isSupportedLanguage(lang: unknown): lang is SupportedLanguage {
  return typeof lang === 'string' && AI_BACKEND_CONFIG.SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
}

export function calculateEstimatedCost(
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  const pricing = MODEL_PRICING_REGISTRY[model] || MODEL_PRICING_REGISTRY['gpt-4o-mini'];
  const promptCost = (promptTokens / 1_000_000) * pricing.promptCostPerMillion;
  const completionCost = (completionTokens / 1_000_000) * pricing.completionCostPerMillion;
  return Number((promptCost + completionCost).toFixed(6));
}
