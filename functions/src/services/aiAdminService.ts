import OpenAI from 'openai';
import { adminDb } from '../config/firebaseAdmin';

export interface AIReportContent {
  title: string;
  signatureSentence: string;
  summary: string;
  strengths: string[];
  challenges: string[];
  relationships: string;
  career: string;
  money: string;
  communication: string;
  learning: string;
  growth: string;
  story: string;
}

export class AIAdminService {
  public async generateAIReport(params: {
    apiKey: string;
    model?: string;
    fusionInput: Record<string, unknown>;
    language?: 'en' | 'hi';
  }): Promise<AIReportContent> {
    const openai = new OpenAI({ apiKey: params.apiKey });
    const model = params.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';
    const language = params.language || 'en';

    const systemPrompt = `You are a psychological and numerological narrative author for Number Story.
Analyze the provided multi-layered fusion profile and write a structured, deeply resonant self-discovery narrative.
Tone: Warm, insightful, non-deterministic, empowering.
Language: ${language === 'hi' ? 'Hindi (Devanagari script with natural phrasing)' : 'English'}.
Output ONLY valid JSON adhering strictly to the required schema with all fields populated.`;

    const userPrompt = `Generate a complete Number Story narrative report for the following fusion profile:
${JSON.stringify(params.fusionInput, null, 2)}`;

    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 3000,
    });

    const raw = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(raw) as AIReportContent;
    return parsed;
  }

  public async saveReportToFirestore(params: {
    reportId: string;
    userId?: string;
    language: string;
    content: AIReportContent;
    model: string;
  }): Promise<void> {
    await adminDb.collection('fusionReports').doc(params.reportId).set(
      {
        reportId: params.reportId,
        userId: params.userId || 'guest_user',
        language: params.language,
        aiContent: params.content,
        aiModel: params.model,
        status: 'ready',
        generatedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  }
}

export const aiAdminService = new AIAdminService();
