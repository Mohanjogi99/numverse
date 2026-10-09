import OpenAI from 'openai';
import {
  StructuredFusionInput,
  SupportedLanguage,
  StructuredAIReportContent,
  AIUsageMetadata,
  AIErrorCategory,
} from '../types/aiReport';
import {
  AI_BACKEND_CONFIG,
  isSupportedLanguage,
  calculateEstimatedCost,
} from '../config/aiConfig';
import {
  buildSystemPrompt,
  buildUserPrompt,
  REPORT_OUTPUT_JSON_SCHEMA,
} from '../prompts/reportPromptV1';
import {
  validateFusionInput,
  validateStructuredAIResponse,
} from '../validators/aiReportValidator';

export interface GenerationServiceResult {
  success: boolean;
  content?: StructuredAIReportContent;
  usage?: AIUsageMetadata;
  error?: {
    category: AIErrorCategory;
    message: string;
    details?: string;
  };
  attemptCount: number;
}

/**
 * Backend AI service responsible for generating structured narrative reports via OpenAI.
 */
export class AIReportService {
  private openaiClient: OpenAI | null = null;

  constructor(customApiKey?: string) {
    const key = customApiKey || AI_BACKEND_CONFIG.apiKey;
    if (key) {
      this.openaiClient = new OpenAI({
        apiKey: key,
        dangerouslyAllowBrowser: true,
      });
    }
  }

  private getClient(): OpenAI {
    if (!this.openaiClient) {
      const key = AI_BACKEND_CONFIG.apiKey;
      if (!key) {
        throw new Error('MISSING_API_KEY: OPENAI_API_KEY is not configured in backend environment.');
      }
      this.openaiClient = new OpenAI({
        apiKey: key,
        dangerouslyAllowBrowser: true,
      });
    }
    return this.openaiClient;
  }

  /**
   * Generates a validated structured report from a deterministic Fusion profile.
   */
  public async generateReport(
    profile: StructuredFusionInput,
    rawLanguage: string = 'en',
    options?: { model?: string; maxRetries?: number }
  ): Promise<GenerationServiceResult> {
    const startTime = Date.now();

    // 1. Language validation
    const language: SupportedLanguage = isSupportedLanguage(rawLanguage)
      ? rawLanguage
      : AI_BACKEND_CONFIG.DEFAULT_LANGUAGE;

    // 2. Profile input validation
    const profileValidation = validateFusionInput(profile);
    if (!profileValidation.isValid || !profileValidation.data) {
      return {
        success: false,
        attemptCount: 0,
        error: {
          category: 'VALIDATION_ERROR',
          message: profileValidation.error || 'Invalid fusion profile supplied.',
        },
      };
    }

    const validatedProfile = profileValidation.data;
    const model = options?.model || AI_BACKEND_CONFIG.model;
    const maxRetries = options?.maxRetries ?? AI_BACKEND_CONFIG.MAX_RETRIES;

    let attempt = 0;
    let lastError: { category: AIErrorCategory; message: string; details?: string } = {
      category: 'UNKNOWN_ERROR',
      message: 'Unknown generation error.',
    };

    while (attempt < maxRetries) {
      attempt++;
      try {
        let client: OpenAI;
        try {
          client = this.getClient();
        } catch (clientErr) {
          return {
            success: false,
            attemptCount: attempt,
            error: {
              category: 'CONFIGURATION_ERROR',
              message: (clientErr as Error).message || 'OpenAI client configuration error.',
            },
          };
        }

        const systemPrompt = buildSystemPrompt(language);
        const userPrompt = buildUserPrompt(validatedProfile, language);

        // OpenAI Responses / Chat Completion with strict JSON Schema
        const completion = await client.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'number_story_reflection_report',
              strict: true,
              schema: REPORT_OUTPUT_JSON_SCHEMA,
            },
          },
          max_completion_tokens: AI_BACKEND_CONFIG.MAX_OUTPUT_TOKENS,
          store: false,
        });

        const choice = completion.choices?.[0];
        const rawContent = choice?.message?.content;

        if (choice?.finish_reason === 'length') {
          lastError = {
            category: 'OUTPUT_VALIDATION_ERROR',
            message: 'Model response exceeded maximum allowed token length.',
          };
          continue; // retry
        }

        if (!rawContent) {
          lastError = {
            category: 'OPENAI_ERROR',
            message: 'OpenAI returned an empty response.',
          };
          continue; // retry
        }

        let parsedJson: unknown;
        try {
          parsedJson = JSON.parse(rawContent);
        } catch (parseErr) {
          lastError = {
            category: 'OUTPUT_VALIDATION_ERROR',
            message: 'Failed to parse JSON response from OpenAI.',
            details: (parseErr as Error).message,
          };
          continue; // retry
        }

        // 3. Structured output schema validation
        const outputValidation = validateStructuredAIResponse(parsedJson);
        if (!outputValidation.isValid || !outputValidation.data) {
          lastError = {
            category: 'OUTPUT_VALIDATION_ERROR',
            message: outputValidation.error || 'AI output did not match required schema.',
          };
          continue; // retry
        }

        // 4. Calculate usage and metrics
        const durationMs = Date.now() - startTime;
        const promptTokens = completion.usage?.prompt_tokens || 0;
        const completionTokens = completion.usage?.completion_tokens || 0;
        const totalTokens = completion.usage?.total_tokens || (promptTokens + completionTokens);
        const estimatedCostUsd = calculateEstimatedCost(model, promptTokens, completionTokens);

        const usage: AIUsageMetadata = {
          promptTokens,
          completionTokens,
          totalTokens,
          estimatedCostUsd,
          durationMs,
        };

        return {
          success: true,
          content: outputValidation.data,
          usage,
          attemptCount: attempt,
        };
      } catch (err: unknown) {
        const errorObj = err as { status?: number; code?: string; message?: string };
        const status = errorObj.status;

        if (status === 401 || status === 403) {
          return {
            success: false,
            attemptCount: attempt,
            error: {
              category: 'AUTH_ERROR',
              message: 'OpenAI authentication failed. Verify API credentials.',
              details: errorObj.message,
            },
          };
        } else if (status === 429) {
          lastError = {
            category: 'RATE_LIMIT_ERROR',
            message: 'OpenAI rate limit reached.',
            details: errorObj.message,
          };
        } else if (status && status >= 500) {
          lastError = {
            category: 'OPENAI_ERROR',
            message: 'OpenAI service unavailable.',
            details: errorObj.message,
          };
        } else {
          lastError = {
            category: 'OPENAI_ERROR',
            message: errorObj.message || 'OpenAI request failed.',
          };
        }
      }
    }

    return {
      success: false,
      attemptCount: attempt,
      error: lastError,
    };
  }
}

// Singleton backend instance
export const aiReportService = new AIReportService();
