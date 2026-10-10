import { FusionAnalysisResult } from '../types/fusion';
import {
  StructuredFusionInput,
  SupportedLanguage,
  StructuredAIReportContent,
  GenerateAIReportResponse,
} from '../types/aiReport';
import { buildDeepDossier } from './deepDossierBuilder';

export class AIReportClientService {
  /**
   * Sanitizes a client-side FusionAnalysisResult into a privacy-safe StructuredFusionInput.
   * Strips out raw mobile numbers, dates of birth, emails, or personal identifiers.
   */
  public sanitizeProfileForAI(fusion: FusionAnalysisResult): StructuredFusionInput {
    return {
      dominantNumber: fusion.numberResult.primaryNumber,
      dominantTheme: fusion.numberResult.dominantNumbers[0]?.theme || 'Balance',
      secondaryNumber: fusion.numberResult.secondaryNumber,
      secondaryTheme: fusion.numberResult.dominantNumbers[1]?.theme || null,
      personalityType: fusion.personalityResult.primaryArchetype.title,
      primaryDimension: fusion.personalityResult.primaryDimension,
      secondaryDimension: fusion.personalityResult.secondaryDimension,
      finalDimensions: fusion.fusedDimensionScores,
      loveProfile: {
        score: fusion.pillars.love.score,
        scoreBand: fusion.pillars.love.scoreBand.label,
        headline: fusion.pillars.love.headline,
      },
      careerProfile: {
        score: fusion.pillars.career.score,
        scoreBand: fusion.pillars.career.scoreBand.label,
        headline: fusion.pillars.career.headline,
      },
      moneyProfile: {
        score: fusion.pillars.money.score,
        scoreBand: fusion.pillars.money.scoreBand.label,
        headline: fusion.pillars.money.headline,
      },
      communicationProfile: {
        score: fusion.pillars.communication.score,
        scoreBand: fusion.pillars.communication.scoreBand.label,
        headline: fusion.pillars.communication.headline,
      },
      learningProfile: {
        score: fusion.pillars.learning.score,
        scoreBand: fusion.pillars.learning.scoreBand.label,
        headline: fusion.pillars.learning.headline,
      },
      growthProfile: {
        score: fusion.pillars.growth.score,
        scoreBand: fusion.pillars.growth.scoreBand.label,
        headline: fusion.pillars.growth.headline,
      },
    };
  }

  /**
   * Generates a deterministic, structured 5,000+ words 12-chapter comprehensive narrative dossier.
   */
  private generateClientNarrative(
    fusion: FusionAnalysisResult,
    lang: SupportedLanguage
  ): StructuredAIReportContent {
    return buildDeepDossier(fusion, lang);
  }

  /**
   * Requests report generation through the client service with local caching.
   */
  public async requestAIReport(
    fusion: FusionAnalysisResult,
    language: SupportedLanguage = 'en',
    forceRegenerate = false
  ): Promise<GenerateAIReportResponse> {
    const cacheKey = `ns_ai_report_v2_${fusion.id}_${language}`;

    if (!forceRegenerate) {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as StructuredAIReportContent;
          return {
            success: true,
            status: 'ready',
            reportId: fusion.id,
            language,
            aiContent: parsed,
            metadata: {
              model: 'client-cached-5000w',
              promptVersion: '2.0',
              generatedAt: new Date().toISOString(),
              isFromCache: true,
            },
          };
        } catch (e) {
          console.warn('[AIReportClientService] Error reading cached AI story', e);
        }
      }
    }

    // Generate structured narrative report
    const aiContent = this.generateClientNarrative(fusion, language);

    sessionStorage.setItem(cacheKey, JSON.stringify(aiContent));

    return {
      success: true,
      status: 'ready',
      reportId: fusion.id,
      language,
      aiContent,
      metadata: {
        model: 'deep-dossier-engine-v2',
        promptVersion: '2.0',
        generatedAt: new Date().toISOString(),
        isFromCache: false,
      },
    };
  }
}

export const aiReportClientService = new AIReportClientService();

