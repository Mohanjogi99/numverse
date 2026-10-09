import { FusionAnalysisResult } from '../types/fusion';
import {
  StructuredFusionInput,
  SupportedLanguage,
  StructuredAIReportContent,
  GenerateAIReportResponse,
} from '../types/aiReport';

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
   * Generates a deterministic, structured narrative report for client-side preview.
   */
  private generateClientNarrative(
    fusion: FusionAnalysisResult,
    lang: SupportedLanguage
  ): StructuredAIReportContent {
    const isHindi = lang === 'hi';
    const primaryNum = fusion.numberResult.primaryNumber;
    const arch = fusion.personalityResult.primaryArchetype;
    const theme = fusion.numberResult.dominantNumbers[0]?.theme || 'Balance';

    if (isHindi) {
      return {
        title: `नंबर ${primaryNum} और ${arch.title} का व्यक्तिगत विश्लेषण`,
        signatureSentence: `आपकी मुख्य शक्ति अंक ${primaryNum} (${theme}) की स्पष्टता और ${arch.title} की अंतर्दृष्टि के अनूठे संगम में निहित है।`,
        summary: `यह व्यक्तिगत रिपोर्ट आपके अंक पैटर्न और व्यक्तित्व आयामों के संतुलन को रेखांकित करती है। आपका दृष्टिकोण विचारशील और रणनीतिक है।`,
        strengths: [
          `प्राकृतिक निर्णय क्षमता और अंक ${primaryNum} का अनुशासन`,
          `${arch.title} के अनुसार परिस्थितियों का गहरा और संतुलित अवलोकन`,
          `चुनौतियों के समय व्यावहारिक और रचनात्मक समाधान खोजना`,
          `रिश्तों और कार्यक्षेत्र में विश्वसनीयता बनाए रखना`,
        ],
        challenges: [
          `अत्यधिक आत्म-विश्लेषण के कारण कभी-कभी निर्णयों में देरी`,
          `दूसरों से भी अपनी जैसी उच्च कार्यक्षमता की अपेक्षा रखना`,
          `कार्य और व्यक्तिगत जीवन के बीच सीमाएं तय करने में कठिनाई`,
        ],
        relationships: `संबंधों में आप ईमानदारी और बौद्धिक जुड़ाव को प्राथमिकता देते हैं। अंक ${primaryNum} आपको स्थिरता प्रदान करता है, जबकि आपका व्यक्तित्व दूसरों के दृष्टिकोण को समझने में मदद करता है।`,
        career: `करियर में आप उन भूमिकाओं में उत्कृष्ट प्रदर्शन करते हैं जहाँ रणनीतिक सोच, स्वायत्तता और समस्या-समाधान की आवश्यकता होती है।`,
        money: `वित्तीय मामलों में आपका दृष्टिकोण व्यावहारिक और संतुलित है। आप अनावश्यक जोखिम के बजाय सुनियोजित निवेश और दीर्घकालिक सुरक्षा को चुनते हैं।`,
        communication: `आपका संवाद स्पष्ट, संक्षेप और उद्देश्यपूर्ण होता है। आप सतही बातों के बजाय सार्थक चर्चाओं को महत्व देते हैं।`,
        learning: `सीखने की प्रक्रिया में आप सैद्धांतिक ज्ञान के साथ-साथ व्यावहारिक अनुप्रयोग को समझना पसंद करते हैं।`,
        growth: `व्यक्तिगत विकास के लिए अपने अंतर्ज्ञान पर भरोसा करना और विश्राम के लिए समय निकालना अत्यंत लाभकारी होगा।`,
        story: `आपकी यात्रा अंक ${primaryNum} की मूल ऊर्जा और ${arch.title} के व्यक्तित्व लक्षणों का एक सुंदर सामंजस्य दर्शाती है। आप जीवन के विभिन्न क्षेत्रों में जागरूकता और उद्देश्य के साथ आगे बढ़ रहे हैं।`,
      };
    }

    return {
      title: `The Story of Number ${primaryNum} & The ${arch.title}`,
      signatureSentence: `Your distinct identity is shaped by the disciplined clarity of Number ${primaryNum} (${theme}) harmonized with the natural intuition of the ${arch.title}.`,
      summary: `This comprehensive self-reflection report highlights the synergy between your numerical patterns and psychological personality dimensions. You possess a methodical yet adaptable framework for navigating life's core pillars.`,
      strengths: [
        `Sharp analytical clarity anchored by Number ${primaryNum}'s core discipline`,
        `Empathetic and thoughtful situational perspective from your ${arch.title} archetype`,
        `Resilient problem-solving under uncertainty and evolving environments`,
        `Consistent trustworthiness in collaborative and interpersonal relationships`,
      ],
      challenges: [
        `Occasional tendency to over-analyze scenarios before initiating swift execution`,
        `High internal standards that can create friction when collaborating with differing paces`,
        `Balancing boundary-setting between intense focus and restorative rest`,
      ],
      relationships: `In relationships, you prioritize emotional depth and intellectual authenticity. Your core number provides grounded stability, while your archetype fosters open-minded empathy and genuine connection.`,
      career: `Professionally, you thrive in environments that reward strategic autonomy, nuanced problem solving, and long-term vision rather than repetitive micromanagement.`,
      money: `Your financial mindset blends prudent risk management with calculated growth, preferring structured security and value-driven decisions over speculative trends.`,
      communication: `Your communication style is articulate, objective, and purpose-driven, valuing clarity and substance over ambiguous discourse.`,
      learning: `You absorb knowledge most effectively through conceptual frameworks paired with real-world experimentation and hands-on synthesis.`,
      growth: `Your primary growth opportunity lies in trusting your intuitive judgment and celebrating incremental milestones without premature self-criticism.`,
      story: `Your Number Story is an evolving synthesis of structured discipline and reflective consciousness. By acknowledging the strengths of Number ${primaryNum} and the perspective of the ${arch.title}, you navigate life with purpose, balance, and intentional clarity.`,
    };
  }

  /**
   * Requests report generation through the client service with local caching.
   */
  public async requestAIReport(
    fusion: FusionAnalysisResult,
    language: SupportedLanguage = 'en',
    forceRegenerate = false
  ): Promise<GenerateAIReportResponse> {
    const cacheKey = `ns_ai_report_${fusion.id}_${language}`;

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
              model: 'client-cached',
              promptVersion: '1.0',
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
        model: 'client-engine-v1',
        promptVersion: '1.0',
        generatedAt: new Date().toISOString(),
        isFromCache: false,
      },
    };
  }
}

export const aiReportClientService = new AIReportClientService();
