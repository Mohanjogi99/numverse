import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import {
  StoredAIReportDocument,
  StructuredAIReportContent,
  AIUsageMetadata,
  AIErrorCategory,
  SupportedLanguage,
} from '../types/aiReport';
import { AI_BACKEND_CONFIG } from '../config/aiConfig';

const MEMORY_CACHE = new Map<string, StoredAIReportDocument>();

function sanitizeDocForFirestore(docObj: object): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(docObj)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs = 600): Promise<T | null> {
  try {
    const timer = new Promise<null>((resolve) => setTimeout(() => resolve(null), timeoutMs));
    return await Promise.race([promise, timer]);
  } catch {
    return null;
  }
}

export class ReportStorageService {
  private getDocKey(reportId: string, language: string, promptVersion: string): string {
    return `${reportId}_${language}_${promptVersion}`;
  }

  /**
   * Retrieves an existing completed AI report from Firestore or memory cache for idempotency.
   */
  public async getExistingReport(
    reportId: string,
    language: SupportedLanguage = 'en',
    promptVersion: string = AI_BACKEND_CONFIG.PROMPT_VERSION
  ): Promise<StoredAIReportDocument | null> {
    const key = this.getDocKey(reportId, language, promptVersion);

    // 1. Check in-memory cache first
    if (MEMORY_CACHE.has(key)) {
      const cached = MEMORY_CACHE.get(key)!;
      if (cached.status === 'ready' && cached.aiContent) {
        return cached;
      }
    }

    // 2. Query Firestore if available with timeout protection
    try {
      if (db && typeof getDoc === 'function' && typeof db.app === 'object' && db.app.name) {
        const docRef = doc(db, 'fusionReports', key);
        const snapshot = await withTimeout(getDoc(docRef), 600);
        if (snapshot && typeof snapshot.exists === 'function' && snapshot.exists()) {
          const data = snapshot.data() as StoredAIReportDocument;
          MEMORY_CACHE.set(key, data);
          return data;
        }
      }
    } catch (err) {
      console.warn('[ReportStorageService] Firestore query error, falling back to cache:', err);
    }

    return null;
  }

  /**
   * Marks a report as currently processing to avoid concurrent duplicate requests.
   */
  public async markReportProcessing(
    reportId: string,
    language: SupportedLanguage = 'en',
    userId?: string
  ): Promise<void> {
    const key = this.getDocKey(reportId, language, AI_BACKEND_CONFIG.PROMPT_VERSION);
    const docData: StoredAIReportDocument = {
      reportId,
      userId,
      status: 'processing',
      language,
      aiModel: AI_BACKEND_CONFIG.model,
      promptVersion: AI_BACKEND_CONFIG.PROMPT_VERSION,
      engineVersion: '1.0',
      reportVersion: '1.0',
      generationAttemptCount: 1,
    };

    MEMORY_CACHE.set(key, docData);

    try {
      if (db && typeof setDoc === 'function' && typeof db.app === 'object' && db.app.name) {
        const docRef = doc(db, 'fusionReports', key);
        await withTimeout(setDoc(docRef, sanitizeDocForFirestore(docData), { merge: true }), 600);
      }
    } catch (err) {
      console.warn('[ReportStorageService] Could not write processing state to Firestore:', err);
    }
  }

  /**
   * Saves completed, validated AI report content to Firestore and memory cache.
   */
  public async saveCompletedReport(params: {
    reportId: string;
    language: SupportedLanguage;
    aiContent: StructuredAIReportContent;
    usage?: AIUsageMetadata;
    attemptCount: number;
    userId?: string;
  }): Promise<StoredAIReportDocument> {
    const key = this.getDocKey(params.reportId, params.language, AI_BACKEND_CONFIG.PROMPT_VERSION);

    const docData: StoredAIReportDocument = {
      reportId: params.reportId,
      userId: params.userId,
      status: 'ready',
      language: params.language,
      aiContent: params.aiContent,
      aiModel: AI_BACKEND_CONFIG.model,
      promptVersion: AI_BACKEND_CONFIG.PROMPT_VERSION,
      engineVersion: '1.0',
      reportVersion: '1.0',
      usage: params.usage,
      generatedAt: new Date().toISOString(),
      generationAttemptCount: params.attemptCount,
    };

    MEMORY_CACHE.set(key, docData);

    try {
      if (db && typeof setDoc === 'function' && typeof db.app === 'object' && db.app.name) {
        const docRef = doc(db, 'fusionReports', key);
        await withTimeout(setDoc(docRef, sanitizeDocForFirestore(docData), { merge: true }), 600);
      }
    } catch (err) {
      console.warn('[ReportStorageService] Could not save completed report to Firestore:', err);
    }

    return docData;
  }

  /**
   * Records a failed generation state.
   */
  public async saveFailedReport(params: {
    reportId: string;
    language: SupportedLanguage;
    errorCategory: AIErrorCategory;
    errorMessage: string;
    attemptCount: number;
    userId?: string;
  }): Promise<void> {
    const key = this.getDocKey(params.reportId, params.language, AI_BACKEND_CONFIG.PROMPT_VERSION);

    const docData: StoredAIReportDocument = {
      reportId: params.reportId,
      userId: params.userId,
      status: 'failed',
      language: params.language,
      aiModel: AI_BACKEND_CONFIG.model,
      promptVersion: AI_BACKEND_CONFIG.PROMPT_VERSION,
      engineVersion: '1.0',
      reportVersion: '1.0',
      errorCategory: params.errorCategory,
      errorMessage: params.errorMessage,
      generationAttemptCount: params.attemptCount,
    };

    MEMORY_CACHE.set(key, docData);

    try {
      if (db && typeof setDoc === 'function' && typeof db.app === 'object' && db.app.name) {
        const docRef = doc(db, 'fusionReports', key);
        await withTimeout(setDoc(docRef, sanitizeDocForFirestore(docData), { merge: true }), 600);
      }
    } catch (err) {
      console.warn('[ReportStorageService] Could not save failed state to Firestore:', err);
    }
  }
}

export const reportStorageService = new ReportStorageService();
