import { aiReportService } from '../services/aiReportService';
import { StructuredFusionInput } from '../types/aiReport';
import { AI_BACKEND_CONFIG } from '../config/aiConfig';

const smokeBenchmarkProfile: StructuredFusionInput = {
  dominantNumber: 7,
  dominantTheme: 'Adventure',
  secondaryNumber: 6,
  secondaryTheme: 'Protection',
  personalityType: 'Explorer',
  primaryDimension: 'Curiosity',
  secondaryDimension: 'Independence',
  finalDimensions: {
    independence: 78,
    social: 57,
    curiosity: 86,
    leadership: 64,
    emotional: 65,
    stability: 50,
  },
  loveProfile: { score: 64, scoreBand: 'Strong', headline: 'Balanced Relational Harmony' },
  careerProfile: { score: 75, scoreBand: 'Very Strong', headline: 'High Strategic Agency' },
  moneyProfile: { score: 68, scoreBand: 'Strong', headline: 'Prudent Resource Management' },
  communicationProfile: { score: 66, scoreBand: 'Strong', headline: 'Clear, Receptive Dialogue' },
  learningProfile: { score: 76, scoreBand: 'Very Strong', headline: 'Rapid Inquiry & Mastery' },
  growthProfile: { score: 72, scoreBand: 'Strong', headline: 'Adventurous Explorer Trajectory' },
};

export async function runOpenAISmokeTest(): Promise<{
  executed: boolean;
  success: boolean;
  message: string;
  details?: unknown;
}> {
  const apiKey = AI_BACKEND_CONFIG.apiKey;

  if (!apiKey) {
    return {
      executed: false,
      success: true,
      message: 'OpenAI smoke test skipped because secure API credentials are not configured in environment.',
    };
  }

  console.log(`🚀 [OpenAI Smoke Test] Running controlled test using model: ${AI_BACKEND_CONFIG.model}...`);

  try {
    const result = await aiReportService.generateReport(smokeBenchmarkProfile, 'en', { maxRetries: 1 });

    if (result.success && result.content) {
      return {
        executed: true,
        success: true,
        message: 'OpenAI smoke test succeeded with valid structured output.',
        details: {
          title: result.content.title,
          tokens: result.usage?.totalTokens,
          estimatedCostUsd: result.usage?.estimatedCostUsd,
          durationMs: result.usage?.durationMs,
        },
      };
    } else {
      return {
        executed: true,
        success: false,
        message: `OpenAI smoke test failed: ${result.error?.message || 'Unknown error'}`,
        details: result.error,
      };
    }
  } catch (err) {
    return {
      executed: true,
      success: false,
      message: `OpenAI smoke test encountered an exception: ${(err as Error).message}`,
    };
  }
}
