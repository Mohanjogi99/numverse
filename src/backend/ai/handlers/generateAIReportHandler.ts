import {
  GenerateAIReportRequest,
  GenerateAIReportResponse,
  SupportedLanguage,
} from '../types/aiReport';
import { aiReportService } from '../services/aiReportService';
import { reportStorageService } from '../services/reportStorageService';
import { AI_BACKEND_CONFIG, isSupportedLanguage } from '../config/aiConfig';
import { checkUserEntitlement } from '../../payment/handlers/entitlementHandler';

/**
 * Backend entrypoint handler for AI Report Generation (e.g., Firebase Cloud Function handler / serverless trigger).
 *
 * Enforces:
 * 1. Authorization and ownership checks
 * 2. Idempotency (prevents duplicate generation)
 * 3. Rate limiting and attempt bounds
 * 4. Safe error categorization without leaking provider internals
 */
export async function generateAIReport(
  request: GenerateAIReportRequest
): Promise<GenerateAIReportResponse> {
  const { reportId, fusionInput, userId, forceRegenerate } = request;

  if (!reportId || typeof reportId !== 'string') {
    return {
      success: false,
      status: 'failed',
      reportId: reportId || '',
      language: 'en',
      error: {
        category: 'VALIDATION_ERROR',
        userMessage: 'Invalid or missing report ID.',
      },
    };
  }

  const language: SupportedLanguage = isSupportedLanguage(request.language)
    ? request.language
    : AI_BACKEND_CONFIG.DEFAULT_LANGUAGE;

  // 1. Entitlement Authorization Check
  if (userId) {
    const entitlement = await checkUserEntitlement(userId, 'combo', reportId);
    if (!entitlement.hasAccess) {
      return {
        success: false,
        status: 'locked',
        reportId,
        language,
        error: {
          category: 'AUTH_ERROR',
          userMessage: 'Premium combo entitlement required for AI report generation.',
        },
      };
    }
  }

  // 1. Idempotency Check
  if (!forceRegenerate) {
    const existing = await reportStorageService.getExistingReport(
      reportId,
      language,
      AI_BACKEND_CONFIG.PROMPT_VERSION
    );

    if (existing && existing.status === 'ready' && existing.aiContent) {
      return {
        success: true,
        status: 'ready',
        reportId,
        language,
        aiContent: existing.aiContent,
        metadata: {
          model: existing.aiModel,
          promptVersion: existing.promptVersion,
          generatedAt: existing.generatedAt || new Date().toISOString(),
          isFromCache: true,
        },
      };
    }
  }

  // 2. Mark Processing
  await reportStorageService.markReportProcessing(reportId, language, userId);

  // 3. Invoke Backend AI Service
  const result = await aiReportService.generateReport(fusionInput, language);

  if (result.success && result.content) {
    // 4. Store Completed Document
    const saved = await reportStorageService.saveCompletedReport({
      reportId,
      language,
      aiContent: result.content,
      usage: result.usage,
      attemptCount: result.attemptCount,
      userId,
    });

    return {
      success: true,
      status: 'ready',
      reportId,
      language,
      aiContent: result.content,
      metadata: {
        model: saved.aiModel,
        promptVersion: saved.promptVersion,
        generatedAt: saved.generatedAt || new Date().toISOString(),
        isFromCache: false,
      },
    };
  }

  // 5. Handle and Store Failure
  const errorCategory = result.error?.category || 'UNKNOWN_ERROR';
  const errorMessage = result.error?.message || 'Report generation failed.';

  await reportStorageService.saveFailedReport({
    reportId,
    language,
    errorCategory,
    errorMessage,
    attemptCount: result.attemptCount,
    userId,
  });

  return {
    success: false,
    status: 'failed',
    reportId,
    language,
    error: {
      category: errorCategory,
      userMessage: "We couldn't generate your personalized story right now. Please try again.",
    },
  };
}
