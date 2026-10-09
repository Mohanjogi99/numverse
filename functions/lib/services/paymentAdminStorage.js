"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentAdminStorage = exports.PaymentAdminStorage = void 0;
const firebaseAdmin_1 = require("../config/firebaseAdmin");
class PaymentAdminStorage {
    getEntitlementKey(userId, productId, reportId) {
        const cleanUser = userId || 'guest_user';
        const cleanProduct = (productId || 'combo').toLowerCase();
        const cleanReport = reportId || 'global';
        return `ent_${cleanUser}_${cleanProduct}_${cleanReport}`;
    }
    async getPaymentByOrderId(orderId) {
        try {
            const docSnap = await firebaseAdmin_1.adminDb.collection('payments').doc(orderId).get();
            if (docSnap.exists) {
                return docSnap.data();
            }
        }
        catch (err) {
            console.error('[PaymentAdminStorage] getPaymentByOrderId error:', err);
        }
        return null;
    }
    async savePaymentRecord(payment) {
        const cleaned = {};
        for (const [k, v] of Object.entries(payment)) {
            if (v !== undefined)
                cleaned[k] = v;
        }
        await firebaseAdmin_1.adminDb.collection('payments').doc(payment.orderId).set(cleaned, { merge: true });
    }
    async updatePaymentStatus(params) {
        const existing = await this.getPaymentByOrderId(params.orderId);
        if (!existing) {
            console.warn(`[PaymentAdminStorage] Cannot update unknown order ${params.orderId}`);
            return null;
        }
        const updated = {
            ...existing,
            status: params.newStatus,
            paymentId: params.paymentId || existing.paymentId,
            verifiedAt: params.verifiedAt || existing.verifiedAt,
            failureReason: params.failureReason || existing.failureReason,
            razorpaySignatureVerified: params.signatureVerified !== undefined
                ? params.signatureVerified
                : existing.razorpaySignatureVerified,
            webhookVerified: params.webhookVerified !== undefined
                ? params.webhookVerified
                : existing.webhookVerified,
            updatedAt: new Date().toISOString(),
        };
        await this.savePaymentRecord(updated);
        return updated;
    }
    async getEntitlement(userId, productId, reportId) {
        const key = this.getEntitlementKey(userId, productId, reportId);
        try {
            const docSnap = await firebaseAdmin_1.adminDb.collection('entitlements').doc(key).get();
            if (docSnap.exists) {
                return docSnap.data();
            }
        }
        catch (err) {
            console.error('[PaymentAdminStorage] getEntitlement error:', err);
        }
        return null;
    }
    async grantEntitlement(params) {
        const key = this.getEntitlementKey(params.userId, params.productId, params.reportId);
        const entitlement = {
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
        const cleaned = {};
        for (const [k, v] of Object.entries(entitlement)) {
            if (v !== undefined)
                cleaned[k] = v;
        }
        await firebaseAdmin_1.adminDb.collection('entitlements').doc(key).set(cleaned, { merge: true });
        return entitlement;
    }
    async revokeEntitlement(userId, productId, reportId) {
        const key = this.getEntitlementKey(userId, productId, reportId);
        const existing = await this.getEntitlement(userId, productId, reportId);
        if (existing) {
            const revoked = {
                ...existing,
                status: 'revoked',
                updatedAt: new Date().toISOString(),
            };
            await firebaseAdmin_1.adminDb.collection('entitlements').doc(key).set(revoked, { merge: true });
        }
    }
    async checkUserEntitlement(userId, productId, reportId) {
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
exports.PaymentAdminStorage = PaymentAdminStorage;
exports.paymentAdminStorage = new PaymentAdminStorage();
//# sourceMappingURL=paymentAdminStorage.js.map