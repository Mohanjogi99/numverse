import { describe, it, expect, beforeEach } from 'vitest';
import {
  validateFusionInput,
  validateStructuredAIResponse,
} from '../backend/ai/validators/aiReportValidator';
import {
  buildSystemPrompt,
  buildUserPrompt,
  REPORT_OUTPUT_JSON_SCHEMA,
} from '../backend/ai/prompts/reportPromptV1';
import {
  isSupportedLanguage,
  calculateEstimatedCost,
} from '../backend/ai/config/aiConfig';
import { generateAIReport } from '../backend/ai/handlers/generateAIReportHandler';
import { reportStorageService } from '../backend/ai/services/reportStorageService';
import { StructuredFusionInput, StructuredAIReportContent } from '../backend/ai/types/aiReport';

describe('Phase 4: OpenAI AI Report Generation Architecture', () => {
  const benchmarkProfile: StructuredFusionInput = {
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
    loveProfile: {
      score: 64,
      scoreBand: 'Strong',
      headline: 'Balanced Relational Harmony',
    },
    careerProfile: {
      score: 75,
      scoreBand: 'Very Strong',
      headline: 'High Strategic Agency & Exploratory Leadership',
    },
    moneyProfile: {
      score: 68,
      scoreBand: 'Strong',
      headline: 'Prudent Resource Management & Stability',
    },
    communicationProfile: {
      score: 66,
      scoreBand: 'Strong',
      headline: 'Clear, Receptive & Balanced Dialogue',
    },
    learningProfile: {
      score: 76,
      scoreBand: 'Very Strong',
      headline: 'Rapid Multidisciplinary Inquiry & Autonomous Mastery',
    },
    growthProfile: {
      score: 72,
      scoreBand: 'Strong',
      headline: 'Adventurous Explorer Evolutionary Trajectory',
    },
  };

  const validSampleAIOutput: StructuredAIReportContent = {
    title: 'The Path of the Adventurous Explorer',
    signatureSentence:
      'Your profile reflects an innate drive to uncover novel horizons while maintaining grounded personal integrity.',
    summary:
      'Your profile suggests an agile combination of curiosity and independence. You flourish when granted the freedom to investigate new concepts while holding a clear sense of purpose.',
    strengths: [
      'Exceptional inquisitiveness and rapid multidisciplinary learning',
      'Autonomous decision-making with high personal accountability',
      'Resilient adaptability in unstructured environments',
    ],
    challenges: [
      'May feel restless when restricted by rigid routines',
      'Could balance spontaneous exploration with systematic completion',
    ],
    relationships:
      'In personal relationships, you tend to value authentic emotional connection paired with healthy mutual independence. You appreciate companions who share your zest for new experiences while offering a calm, supportive presence.',
    career:
      'Your professional dynamic suggests a strong inclination toward exploratory research, creative strategy, and autonomous leadership where innovative ideas can be tested rapidly.',
    money:
      'Your financial mindset reflects an emphasis on financial sovereignty and pragmatic resource management to support long-term freedom rather than superficial display.',
    communication:
      'You communicate with conceptual clarity and genuine warmth, enjoying conversations that explore meaningful possibilities rather than mundane small talk.',
    learning:
      'Your learning style is highly self-directed and inquiry-driven, absorbing deep knowledge through hands-on experimentation and first-principles synthesis.',
    growth:
      'Establishing gentle daily follow-through rituals allows your imaginative breakthroughs to translate into enduring real-world achievements.',
    story:
      'From an early age, the rhythm of adventure and discovery has guided your worldview. Number 7 provides an underlying pulse of intellectual exploration, while your Explorer archetype equips you with the autonomy to forge uncharted paths.\n\nYou perceive life not as a fixed destination, but as an ongoing laboratory of ideas. When faced with complex challenges, your instinct is to dissect the situation from multiple perspectives, synthesizing unconventional insights that others might overlook.\n\nBy anchoring your curious nature with grounded daily habits, you create a powerful container where your inventive energy transforms into lasting, purposeful contributions.',
  };

  describe('1. Profile Input Validation', () => {
    it('validates a complete, correctly formatted benchmark profile', () => {
      const result = validateFusionInput(benchmarkProfile);
      expect(result.isValid).toBe(true);
      expect(result.data?.dominantNumber).toBe(7);
      expect(result.data?.dominantTheme).toBe('Adventure');
    });

    it('rejects profile with missing dominant number or out-of-range number', () => {
      const invalid = { ...benchmarkProfile, dominantNumber: 15 };
      const result = validateFusionInput(invalid);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('dominantNumber');
    });

    it('rejects profile with missing or invalid dimension score', () => {
      const invalid = {
        ...benchmarkProfile,
        finalDimensions: { ...benchmarkProfile.finalDimensions, curiosity: 150 },
      };
      const result = validateFusionInput(invalid);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('curiosity');
    });
  });

  describe('2. Structured AI Output Validation', () => {
    it('validates a conforming 12-section AI response object', () => {
      const result = validateStructuredAIResponse(validSampleAIOutput);
      expect(result.isValid).toBe(true);
      expect(result.data?.title).toBe('The Path of the Adventurous Explorer');
      expect(result.data?.strengths).toHaveLength(3);
      expect(result.data?.challenges).toHaveLength(2);
    });

    it('rejects output missing required string fields', () => {
      const incomplete = { ...validSampleAIOutput } as Partial<StructuredAIReportContent>;
      delete incomplete.story;
      const result = validateStructuredAIResponse(incomplete);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('story');
    });

    it('rejects output with empty array for strengths or challenges', () => {
      const invalid = { ...validSampleAIOutput, strengths: [] };
      const result = validateStructuredAIResponse(invalid);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('strengths');
    });
  });

  describe('3. System & User Prompt Construction', () => {
    it('constructs versioned English system prompt with strict non-deterministic constraints', () => {
      const prompt = buildSystemPrompt('en');
      expect(prompt).toContain('Number Story');
      expect(prompt).toContain('Your profile suggests');
      expect(prompt).toContain('Do NOT provide medical diagnoses');
      expect(prompt).toContain('Do NOT give financial advice');
      expect(prompt).toContain('Do NOT make deterministic future predictions');
    });

    it('constructs Hindi system prompt with Devanagari guidance', () => {
      const prompt = buildSystemPrompt('hi');
      expect(prompt).toContain('LANGUAGE REQUIREMENT (HINDI)');
      expect(prompt).toContain('Devanagari');
      expect(prompt).toContain('Number Story');
    });

    it('builds sanitized user prompt without leaking raw credentials or instructions', () => {
      const userPrompt = buildUserPrompt(benchmarkProfile, 'en');
      expect(userPrompt).toContain('"dominantNumber": 7');
      expect(userPrompt).toContain('"dominantTheme": "Adventure"');
      expect(userPrompt).toContain('"personalityType": "Explorer"');
      expect(userPrompt).not.toContain('API_KEY');
      expect(userPrompt).not.toContain('phoneNumber');
    });

    it('verifies strict JSON schema compliance', () => {
      expect(REPORT_OUTPUT_JSON_SCHEMA.required).toHaveLength(12);
      expect(REPORT_OUTPUT_JSON_SCHEMA.additionalProperties).toBe(false);
    });
  });

  describe('4. Language & Cost Estimation', () => {
    it('validates supported languages (en, hi) and rejects unsupported ones', () => {
      expect(isSupportedLanguage('en')).toBe(true);
      expect(isSupportedLanguage('hi')).toBe(true);
      expect(isSupportedLanguage('fr')).toBe(false);
      expect(isSupportedLanguage('es')).toBe(false);
    });

    it('calculates token cost estimation accurately', () => {
      // 1000 prompt tokens ($0.15/1M) = $0.00015, 1000 completion tokens ($0.60/1M) = $0.00060 -> $0.00075
      const cost = calculateEstimatedCost('gpt-4o-mini', 1000, 1000);
      expect(cost).toBe(0.00075);
    });
  });

  describe('5. Idempotency & Storage Handling', () => {
    beforeEach(async () => {
      // Seed a completed report
      await reportStorageService.saveCompletedReport({
        reportId: 'rep_test_idempotent',
        language: 'en',
        aiContent: validSampleAIOutput,
        attemptCount: 1,
      });
    });

    it('returns existing cached report without re-executing OpenAI call (idempotency)', async () => {
      const response = await generateAIReport({
        reportId: 'rep_test_idempotent',
        language: 'en',
        fusionInput: benchmarkProfile,
        forceRegenerate: false,
      });

      expect(response.success).toBe(true);
      expect(response.status).toBe('ready');
      expect(response.metadata?.isFromCache).toBe(true);
      expect(response.aiContent?.title).toBe('The Path of the Adventurous Explorer');
    });
  });

  describe('6. Error Handling & Refusal Mapping', () => {
    it('returns controlled error response when invalid report ID is provided', async () => {
      const response = await generateAIReport({
        reportId: '',
        language: 'en',
        fusionInput: benchmarkProfile,
      });

      expect(response.success).toBe(false);
      expect(response.error?.category).toBe('VALIDATION_ERROR');
    });
  });

  describe('7. Controlled Smoke Test Runner', () => {
    it('executes smoke test handler gracefully whether credentials are set or absent', async () => {
      const { runOpenAISmokeTest } = await import('../backend/ai/scripts/smokeTest');
      const result = await runOpenAISmokeTest();
      expect(result).toBeDefined();
      expect(typeof result.success).toBe('boolean');
      expect(result.message).toBeTruthy();
    });
  });
});
