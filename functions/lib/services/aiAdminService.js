"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiAdminService = exports.AIAdminService = void 0;
const openai_1 = __importDefault(require("openai"));
const firebaseAdmin_1 = require("../config/firebaseAdmin");
class AIAdminService {
    async generateAIReport(params) {
        const openai = new openai_1.default({ apiKey: params.apiKey });
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
        const parsed = JSON.parse(raw);
        return parsed;
    }
    async saveReportToFirestore(params) {
        await firebaseAdmin_1.adminDb.collection('fusionReports').doc(params.reportId).set({
            reportId: params.reportId,
            userId: params.userId || 'guest_user',
            language: params.language,
            aiContent: params.content,
            aiModel: params.model,
            status: 'ready',
            generatedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }, { merge: true });
    }
}
exports.AIAdminService = AIAdminService;
exports.aiAdminService = new AIAdminService();
//# sourceMappingURL=aiAdminService.js.map