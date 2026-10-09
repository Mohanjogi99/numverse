import { adminDb } from '../config/firebaseAdmin';

export type PaymentStatus =
  | 'created'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export interface PaymentRecord {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  paymentId?: string;
  amount: number;
  currency: 'INR';
  status: PaymentStatus;
  reportId?: string;
  testId?: string;
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
  failureReason?: string;
  razorpaySignatureVerified: boolean;
  webhookVerified: boolean;
  idempotencyKey?: string;
}

export interface Entitlement {
  id: string;
  userId: string;
  productId: string;
  reportId?: string;
  testId?: string;
  sourcePaymentId: string;
  status: 'active' | 'revoked';
  grantedAt: string;
  updatedAt?: string;
  expiresAt: null;
}

export class PaymentAdminStorage {
  public getEntitlementKey(userId: string, productId?: string, reportId?: string): string {
    const cleanUser = userId || 'guest_user';
    const cleanProduct = (productId || 'combo').toLowerCase();
    const cleanReport = reportId || 'global';
    return `ent_${cleanUser}_${cleanProduct}_${cleanReport}`;
  }

  public async getPaymentByOrderId(orderId: string): Promise<PaymentRecord | null> {
    try {
      const docSnap = await adminDb.collection('payments').doc(orderId).get();
      if (docSnap.exists) {
        return docSnap.data() as PaymentRecord;
      }
    } catch (err) {
      console.error('[PaymentAdminStorage] getPaymentByOrderId error:', err);
    }
    return null;
  }

  public async savePaymentRecord(payment: PaymentRecord): Promise<void> {
    const cleaned: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(payment)) {
      if (v !== undefined) cleaned[k] = v;
    }
    await adminDb.collection('payments').doc(payment.orderId).set(cleaned, { merge: true });
  }

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
      console.warn(`[PaymentAdminStorage] Cannot update unknown order ${params.orderId}`);
      return null;
    }

    const updated: PaymentRecord = {
      ...existing,
      status: params.newStatus,
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

  public async getEntitlement(
    userId: string,
    productId: string,
    reportId?: string
  ): Promise<Entitlement | null> {
    const key = this.getEntitlementKey(userId, productId, reportId);
    try {
      const docSnap = await adminDb.collection('entitlements').doc(key).get();
      if (docSnap.exists) {
        return docSnap.data() as Entitlement;
      }
    } catch (err) {
      console.error('[PaymentAdminStorage] getEntitlement error:', err);
    }
    return null;
  }

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

    const cleaned: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(entitlement)) {
      if (v !== undefined) cleaned[k] = v;
    }
    await adminDb.collection('entitlements').doc(key).set(cleaned, { merge: true });
    return entitlement;
  }

  public async revokeEntitlement(userId: string, productId: string, reportId?: string): Promise<void> {
    const key = this.getEntitlementKey(userId, productId, reportId);
    const existing = await this.getEntitlement(userId, productId, reportId);
    if (existing) {
      const revoked: Entitlement = {
        ...existing,
        status: 'revoked',
        updatedAt: new Date().toISOString(),
      };
      await adminDb.collection('entitlements').doc(key).set(revoked, { merge: true });
    }
  }

  public async checkUserEntitlement(
    userId: string,
    productId: string,
    reportId?: string
  ): Promise<{ hasAccess: boolean; isFree: boolean; entitlement?: Entitlement }> {
    if (productId === 'free' || productId === 'free10') {
      return { hasAccess: true, isFree: true };
    }

    const direct = await this.getEntitlement(userId, productId, reportId);
    if (direct && direct.status === 'active') {
      return { hasAccess: true, isFree: false, entitlement: direct };
    }

    if (productId !== 'combo') {
      const combo = await this.getEntitlement(userId, 'combo', reportId);
      if (combo && combo.status === 'active') {
        return { hasAccess: true, isFree: false, entitlement: combo };
      }
    }

    return { hasAccess: false, isFree: false };
  }
}

export const paymentAdminStorage = new PaymentAdminStorage();
