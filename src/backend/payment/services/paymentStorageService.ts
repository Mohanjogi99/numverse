import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../services/firebase';
import { PaymentRecord, Entitlement, PaymentStatus } from '../../../types/payment';

const PAYMENT_MEMORY_CACHE = new Map<string, PaymentRecord>();
const ENTITLEMENT_MEMORY_CACHE = new Map<string, Entitlement>();

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

export class PaymentStorageService {
  /**
   * Helper to build a unique entitlement key.
   */
  public getEntitlementKey(userId: string, productId?: string, reportId?: string): string {
    const cleanUser = userId || 'guest_user';
    const cleanProduct = (productId || 'combo').toLowerCase();
    const cleanReport = reportId || 'global';
    return `ent_${cleanUser}_${cleanProduct}_${cleanReport}`;
  }

  /**
   * Retrieves an existing payment record by Razorpay order ID.
   */
  public async getPaymentByOrderId(orderId: string): Promise<PaymentRecord | null> {
    if (PAYMENT_MEMORY_CACHE.has(orderId)) {
      return PAYMENT_MEMORY_CACHE.get(orderId)!;
    }

    try {
      if (db && typeof getDoc === 'function' && typeof db.app === 'object' && db.app.name) {
        const docRef = doc(db, 'payments', orderId);
        const snapshot = await withTimeout(getDoc(docRef), 600);
        if (snapshot && typeof snapshot.exists === 'function' && snapshot.exists()) {
          const data = snapshot.data() as PaymentRecord;
          PAYMENT_MEMORY_CACHE.set(orderId, data);
          return data;
        }
      }
    } catch (err) {
      console.warn('[PaymentStorageService] Error reading payment from Firestore:', err);
    }

    return null;
  }

  /**
   * Saves a newly created payment order record.
   */
  public async savePaymentRecord(payment: PaymentRecord): Promise<void> {
    PAYMENT_MEMORY_CACHE.set(payment.orderId, payment);

    try {
      if (db && typeof setDoc === 'function' && typeof db.app === 'object' && db.app.name) {
        const docRef = doc(db, 'payments', payment.orderId);
        await withTimeout(setDoc(docRef, sanitizeDocForFirestore(payment), { merge: true }), 600);
      }
    } catch (err) {
      console.warn('[PaymentStorageService] Could not write payment to Firestore:', err);
    }
  }

  /**
   * Updates payment record status enforcing valid state machine transitions.
   */
  public async updatePaymentStatus(params: {
    orderId: string;
    newStatus: PaymentStatus;
    paymentId?: string;
    verifiedAt?: string;
    failureReason?: string;
    signatureVerified?: boolean;
    webhookVerified?: boolean;
  }): Promise<PaymentRecord | null> {
    const existing = await this.getPaymentByOrderId(params.orderId);
    if (!existing) {
      console.warn(`[PaymentStorageService] Cannot update unknown order: ${params.orderId}`);
      return null;
    }

    // State machine transition validation
    const current = existing.status;
    const target = params.newStatus;

    const allowedTransitions: Record<PaymentStatus, PaymentStatus[]> = {
      created: ['authorized', 'captured', 'failed'],
      authorized: ['captured', 'failed'],
      captured: ['refunded', 'partially_refunded'],
      failed: ['captured'], // only via verified payment event
      refunded: [],
      partially_refunded: ['refunded'],
    };

    if (current !== target && !allowedTransitions[current]?.includes(target)) {
      console.warn(
        `[PaymentStorageService] Illegal state transition rejected: ${current} -> ${target} for order ${params.orderId}`
      );
      return null;
    }

    const updated: PaymentRecord = {
      ...existing,
      status: target,
      paymentId: params.paymentId || existing.paymentId,
      verifiedAt: params.verifiedAt || existing.verifiedAt,
      failureReason: params.failureReason || existing.failureReason,
      razorpaySignatureVerified:
        params.signatureVerified !== undefined
          ? params.signatureVerified
          : existing.razorpaySignatureVerified,
      webhookVerified:
        params.webhookVerified !== undefined
          ? params.webhookVerified
          : existing.webhookVerified,
      updatedAt: new Date().toISOString(),
    };

    await this.savePaymentRecord(updated);
    return updated;
  }

  /**
   * Retrieves an entitlement record.
   */
  public async getEntitlement(
    userId: string,
    productId: string,
    reportId?: string
  ): Promise<Entitlement | null> {
    const key = this.getEntitlementKey(userId, productId, reportId);

    if (ENTITLEMENT_MEMORY_CACHE.has(key)) {
      return ENTITLEMENT_MEMORY_CACHE.get(key)!;
    }

    try {
      if (db && typeof getDoc === 'function' && typeof db.app === 'object' && db.app.name) {
        const docRef = doc(db, 'entitlements', key);
        const snapshot = await withTimeout(getDoc(docRef), 600);
        if (snapshot && typeof snapshot.exists === 'function' && snapshot.exists()) {
          const data = snapshot.data() as Entitlement;
          ENTITLEMENT_MEMORY_CACHE.set(key, data);
          return data;
        }
      }
    } catch (err) {
      console.warn('[PaymentStorageService] Error reading entitlement from Firestore:', err);
    }

    return null;
  }

  /**
   * Idempotently grants a premium product entitlement to a user.
   */
  public async grantEntitlement(params: {
    userId: string;
    productId: string;
    reportId?: string;
    testId?: string;
    sourcePaymentId: string;
  }): Promise<Entitlement> {
    const key = this.getEntitlementKey(params.userId, params.productId, params.reportId);

    const entitlement: Entitlement = {
      id: key,
      userId: params.userId,
      productId: params.productId,
      reportId: params.reportId,
      testId: params.testId,
      sourcePaymentId: params.sourcePaymentId,
      status: 'active',
      grantedAt: new Date().toISOString(),
      expiresAt: null,
    };

    ENTITLEMENT_MEMORY_CACHE.set(key, entitlement);

    try {
      if (db && typeof setDoc === 'function' && typeof db.app === 'object' && db.app.name) {
        const docRef = doc(db, 'entitlements', key);
        await withTimeout(setDoc(docRef, sanitizeDocForFirestore(entitlement), { merge: true }), 600);
      }
    } catch (err) {
      console.warn('[PaymentStorageService] Could not write entitlement to Firestore:', err);
    }

    return entitlement;
  }

  /**
   * Saves or updates an entitlement record directly.
   */
  public async saveEntitlement(entitlement: Entitlement): Promise<void> {
    const key = this.getEntitlementKey(entitlement.userId, entitlement.productId, entitlement.reportId);
    ENTITLEMENT_MEMORY_CACHE.set(key, entitlement);
    if (entitlement.id && entitlement.id !== key) {
      ENTITLEMENT_MEMORY_CACHE.set(entitlement.id, entitlement);
    }

    try {
      if (db && typeof setDoc === 'function' && typeof db.app === 'object' && db.app.name) {
        const docRef = doc(db, 'entitlements', key);
        await withTimeout(setDoc(docRef, sanitizeDocForFirestore(entitlement), { merge: true }), 600);
      }
    } catch (err) {
      console.warn('[PaymentStorageService] Could not write entitlement to Firestore:', err);
    }
  }

  /**
   * Revokes an entitlement (e.g. after a refund).
   */
  public async revokeEntitlement(userId: string, productId: string, reportId?: string): Promise<void> {
    const key = this.getEntitlementKey(userId, productId, reportId);
    const existing = await this.getEntitlement(userId, productId, reportId);
    if (existing) {
      const revoked: Entitlement = {
        ...existing,
        status: 'revoked',
        updatedAt: new Date().toISOString(),
      };
      ENTITLEMENT_MEMORY_CACHE.set(key, revoked);
      try {
        if (db && typeof setDoc === 'function' && typeof db.app === 'object' && db.app.name) {
          const docRef = doc(db, 'entitlements', key);
          await withTimeout(setDoc(docRef, sanitizeDocForFirestore(revoked), { merge: true }), 600);
        }
      } catch (err) {
        console.warn('[PaymentStorageService] Could not revoke entitlement in Firestore:', err);
      }
    }
  }

  /**
   * Clears in-memory caches (for testing and isolated state).
   */
  public clearAll(): void {
    PAYMENT_MEMORY_CACHE.clear();
    ENTITLEMENT_MEMORY_CACHE.clear();
  }
}

export const paymentStorageService = new PaymentStorageService();
export const paymentStorage = paymentStorageService;
