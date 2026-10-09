import { describe, it, expect, beforeEach } from 'vitest';
import { getProductById } from '../config/products';
import { createOrderHandler } from '../backend/payment/handlers/createOrderHandler';
import { verifyPaymentHandler } from '../backend/payment/handlers/verifyPaymentHandler';
import { handleRazorpayWebhook } from '../backend/payment/handlers/webhookHandler';
import { checkUserEntitlement, hasActiveEntitlement } from '../backend/payment/handlers/entitlementHandler';
import { paymentStorage } from '../backend/payment/services/paymentStorageService';
import { verifyRazorpaySignature, generateMockSignature } from '../backend/payment/services/razorpayService';
import { RAZORPAY_CONFIG } from '../backend/payment/config/razorpayConfig';

describe('Phase 5 - Razorpay Payment & Secure Premium Unlock', () => {
  beforeEach(() => {
    paymentStorage.clearAll();
  });

  describe('1. Product Catalog & Server-Side Pricing', () => {
    it('should define the 4 official products with correct prices in INR and Paise', () => {
      const free = getProductById('free');
      expect(free).toBeDefined();
      expect(free?.priceInr).toBe(0);
      expect(free?.amountInPaise).toBe(0);

      const standard = getProductById('standard');
      expect(standard).toBeDefined();
      expect(standard?.priceInr).toBe(49);
      expect(standard?.amountInPaise).toBe(4900);

      const complete = getProductById('complete');
      expect(complete).toBeDefined();
      expect(complete?.priceInr).toBe(99);
      expect(complete?.amountInPaise).toBe(9900);

      const combo = getProductById('combo');
      expect(combo).toBeDefined();
      expect(combo?.priceInr).toBe(149);
      expect(combo?.amountInPaise).toBe(14900);
      expect(combo?.badge).toContain('VALUE');
    });

    it('should support product alias lookups (free10, standard25, complete50, combo149)', () => {
      expect(getProductById('free10')?.id).toBe('free');
      expect(getProductById('standard25')?.id).toBe('standard');
      expect(getProductById('complete50')?.id).toBe('complete');
      expect(getProductById('combo149')?.id).toBe('combo');
    });

    it('should return undefined for unknown product IDs', () => {
      expect(getProductById('invalid-product')).toBeUndefined();
    });
  });

  describe('2. Order Creation & Protection', () => {
    it('should create a valid order with server-calculated price for combo', async () => {
      const res = await createOrderHandler({
        productId: 'combo',
        userId: 'user_123',
        userEmail: 'user@example.com',
      });

      expect(res.success).toBe(true);
      expect(res.orderId).toBeDefined();
      expect(res.amount).toBe(14900);
      expect(res.currency).toBe('INR');
      expect(res.product?.id).toBe('combo');

      // Verify stored record in payment storage
      const record = await paymentStorage.getPaymentByOrderId(res.orderId!);
      expect(record).toBeDefined();
      expect(record?.status).toBe('created');
      expect(record?.amount).toBe(14900);
      expect(record?.userId).toBe('user_123');
    });

    it('should auto-grant entitlement for free product without creating payment order', async () => {
      const res = await createOrderHandler({
        productId: 'free',
        userId: 'user_free',
      });

      expect(res.success).toBe(true);
      expect(res.amount).toBe(0);
      expect(res.orderId).toContain('free_');

      // Verify entitlement exists
      const ent = await checkUserEntitlement('user_free', 'free');
      expect(ent.hasAccess).toBe(true);
      expect(ent.entitlement?.status).toBe('active');
    });

    it('should reject order creation for invalid product ID', async () => {
      const res = await createOrderHandler({
        productId: 'fake_product',
        userId: 'user_123',
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain('Invalid product ID');
    });

    it('should detect if user already has an active entitlement for the product', async () => {
      // First grant entitlement
      await paymentStorage.saveEntitlement({
        id: 'ent_user1_combo',
        userId: 'user1',
        productId: 'combo',
        sourcePaymentId: 'pay_test_user1',
        status: 'active',
        source: 'payment',
        grantedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: null,
      });

      const res = await createOrderHandler({
        productId: 'combo',
        userId: 'user1',
      });

      expect(res.success).toBe(true);
      expect(res.alreadyPurchased).toBe(true);
    });
  });

  describe('3. Cryptographic Signature Verification', () => {
    it('should verify genuine HMAC-SHA256 signature generated with key secret', () => {
      const orderId = 'order_test_12345';
      const paymentId = 'pay_test_98765';
      const secret = 'test_secret_key_12345';

      const validSig = generateMockSignature(orderId, paymentId, secret);
      const isVerified = verifyRazorpaySignature(orderId, paymentId, validSig, secret);
      expect(isVerified).toBe(true);
    });

    it('should reject tampered or forged signatures', () => {
      const orderId = 'order_test_12345';
      const paymentId = 'pay_test_98765';
      const secret = 'test_secret_key_12345';

      const forgedSig = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0';
      const isVerified = verifyRazorpaySignature(orderId, paymentId, forgedSig, secret);
      expect(isVerified).toBe(false);
    });

    it('should reject signature if secret is mismatched', () => {
      const orderId = 'order_test_12345';
      const paymentId = 'pay_test_98765';
      const validSig = generateMockSignature(orderId, paymentId, 'secret_1');
      const isVerified = verifyRazorpaySignature(orderId, paymentId, validSig, 'secret_2');
      expect(isVerified).toBe(false);
    });
  });

  describe('4. Payment Verification & State Machine Transitions', () => {
    it('should transition payment status from created -> captured upon valid signature', async () => {
      // Step 1: Create Order
      const orderRes = await createOrderHandler({
        productId: 'combo',
        userId: 'user_payer',
      });
      const orderId = orderRes.orderId!;
      const paymentId = 'pay_real_999';
      const signature = generateMockSignature(orderId, paymentId);

      // Step 2: Verify Payment
      const verifyRes = await verifyPaymentHandler({
        orderId,
        paymentId,
        signature,
        userId: 'user_payer',
        productId: 'combo',
      });

      expect(verifyRes.success).toBe(true);
      expect(verifyRes.verified).toBe(true);
      expect(verifyRes.entitlement).toBeDefined();
      expect(verifyRes.entitlement?.status).toBe('active');

      // Step 3: Check Payment Record State
      const payment = await paymentStorage.getPaymentByOrderId(orderId);
      expect(payment?.status).toBe('captured');
      expect(payment?.paymentId).toBe(paymentId);
    });

    it('should reject verification when signature is invalid and not grant entitlement', async () => {
      const orderRes = await createOrderHandler({
        productId: 'complete',
        userId: 'user_tamperer',
      });
      const orderId = orderRes.orderId!;

      const verifyRes = await verifyPaymentHandler({
        orderId,
        paymentId: 'pay_tampered',
        signature: 'invalid_forged_signature_12345',
        userId: 'user_tamperer',
      });

      expect(verifyRes.success).toBe(false);
      expect(verifyRes.verified).toBe(false);
      expect(verifyRes.error?.toLowerCase()).toContain('verification failed');

      // Check entitlement is NOT granted
      const hasAccess = await hasActiveEntitlement('user_tamperer', 'complete');
      expect(hasAccess).toBe(false);
    });

    it('should be idempotent: subsequent verification of captured payment returns existing entitlement', async () => {
      const orderRes = await createOrderHandler({
        productId: 'standard',
        userId: 'user_idempotent',
      });
      const orderId = orderRes.orderId!;
      const paymentId = 'pay_idem_123';
      const signature = generateMockSignature(orderId, paymentId);

      const firstVerify = await verifyPaymentHandler({
        orderId,
        paymentId,
        signature,
        userId: 'user_idempotent',
      });
      expect(firstVerify.success).toBe(true);

      const secondVerify = await verifyPaymentHandler({
        orderId,
        paymentId,
        signature,
        userId: 'user_idempotent',
      });
      expect(secondVerify.success).toBe(true);
      expect(secondVerify.entitlement?.id).toBe(firstVerify.entitlement?.id);
    });
  });

  describe('5. Webhook Handling & Redundancy', () => {
    it('should process payment.captured webhook and provision entitlement', async () => {
      // Create initial order
      const orderRes = await createOrderHandler({
        productId: 'combo',
        userId: 'user_webhook',
      });
      const orderId = orderRes.orderId!;
      const paymentId = 'pay_hook_123';

      const webhookPayload = {
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: paymentId,
              order_id: orderId,
              amount: 14900,
              currency: 'INR',
              status: 'captured',
            },
          },
        },
      };

      const rawBody = JSON.stringify(webhookPayload);
      const signature = generateMockSignature(rawBody, '', RAZORPAY_CONFIG.webhookSecret);

      const res = await handleRazorpayWebhook({
        rawBody,
        signature,
        payload: webhookPayload,
      });

      expect(res.success).toBe(true);
      expect(res.event).toBe('payment.captured');

      // Check payment status updated
      const payment = await paymentStorage.getPaymentByOrderId(orderId);
      expect(payment?.status).toBe('captured');

      // Check user entitlement active
      const hasAccess = await hasActiveEntitlement('user_webhook', 'combo');
      expect(hasAccess).toBe(true);
    });

    it('should process payment.failed webhook and mark record failed', async () => {
      const orderRes = await createOrderHandler({
        productId: 'standard',
        userId: 'user_failed',
      });
      const orderId = orderRes.orderId!;

      const webhookPayload = {
        event: 'payment.failed',
        payload: {
          payment: {
            entity: {
              id: 'pay_fail_000',
              order_id: orderId,
              amount: 4900,
              currency: 'INR',
              status: 'failed',
              error_code: 'BAD_REQUEST_ERROR',
              error_description: 'Payment was declined by bank',
            },
          },
        },
      };

      const rawBody = JSON.stringify(webhookPayload);
      const signature = generateMockSignature(rawBody, '', RAZORPAY_CONFIG.webhookSecret);

      const res = await handleRazorpayWebhook({
        rawBody,
        signature,
        payload: webhookPayload,
      });

      expect(res.success).toBe(true);
      const payment = await paymentStorage.getPaymentByOrderId(orderId);
      expect(payment?.status).toBe('failed');
      expect(payment?.failureReason).toContain('declined');
    });

    it('should process refund.created webhook and revoke entitlement', async () => {
      // First setup captured payment and entitlement
      const orderRes = await createOrderHandler({
        productId: 'complete',
        userId: 'user_refund',
      });
      const orderId = orderRes.orderId!;
      const paymentId = 'pay_refund_123';
      const signature = generateMockSignature(orderId, paymentId);

      await verifyPaymentHandler({
        orderId,
        paymentId,
        signature,
        userId: 'user_refund',
      });

      // Verify entitlement was active
      expect(await hasActiveEntitlement('user_refund', 'complete')).toBe(true);

      // Webhook for refund
      const webhookPayload = {
        event: 'refund.created',
        payload: {
          payment: {
            entity: {
              id: paymentId,
              order_id: orderId,
              amount: 9900,
              amount_refunded: 9900,
              status: 'refunded',
            },
          },
        },
      };

      const rawBody = JSON.stringify(webhookPayload);
      const webhookSignature = generateMockSignature(rawBody, '', RAZORPAY_CONFIG.webhookSecret);

      const res = await handleRazorpayWebhook({
        rawBody,
        signature: webhookSignature,
        payload: webhookPayload,
      });

      expect(res.success).toBe(true);

      // Verify entitlement is revoked
      expect(await hasActiveEntitlement('user_refund', 'complete')).toBe(false);
    });
  });

  describe('6. Entitlement Hierarchy & Access Control', () => {
    it('should grant access to standard and complete reports if user purchased combo', async () => {
      // User buys combo
      await paymentStorage.saveEntitlement({
        id: 'ent_combo_user',
        userId: 'combo_user',
        productId: 'combo',
        sourcePaymentId: 'pay_test_combo',
        status: 'active',
        source: 'payment',
        grantedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: null,
      });

      // Combo user should have access to standard, complete, and combo
      expect(await hasActiveEntitlement('combo_user', 'standard')).toBe(true);
      expect(await hasActiveEntitlement('combo_user', 'complete')).toBe(true);
      expect(await hasActiveEntitlement('combo_user', 'combo')).toBe(true);
    });

    it('should NOT grant access to combo report if user only purchased standard', async () => {
      // User buys standard (₹49)
      await paymentStorage.saveEntitlement({
        id: 'ent_std_user',
        userId: 'std_user',
        productId: 'standard',
        sourcePaymentId: 'pay_test_std',
        status: 'active',
        source: 'payment',
        grantedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: null,
      });

      expect(await hasActiveEntitlement('std_user', 'standard')).toBe(true);
      expect(await hasActiveEntitlement('std_user', 'complete')).toBe(false);
      expect(await hasActiveEntitlement('std_user', 'combo')).toBe(false);
    });

    it('should grant access to free features for all users without purchase', async () => {
      expect(await hasActiveEntitlement('anon_user', 'free')).toBe(true);
      expect(await hasActiveEntitlement('anon_user', 'free10')).toBe(true);
      expect(await hasActiveEntitlement('anon_user', 'combo')).toBe(false);
    });
  });

  describe('7. Security Audit & Edge Case Scenarios', () => {
    it('handles callback and webhook arriving in either order safely (Webhook First -> Callback Second)', async () => {
      const orderRes = await createOrderHandler({
        productId: 'combo',
        userId: 'user_race_1',
      });
      const orderId = orderRes.orderId!;
      const paymentId = 'pay_race_hook_first';

      // 1. Webhook arrives first
      const webhookPayload = {
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: paymentId,
              order_id: orderId,
              amount: 14900,
              currency: 'INR',
              status: 'captured',
            },
          },
        },
      };
      const rawBody = JSON.stringify(webhookPayload);
      const webhookSig = generateMockSignature(rawBody, '', RAZORPAY_CONFIG.webhookSecret);

      const hookRes = await handleRazorpayWebhook({ rawBody, signature: webhookSig, payload: webhookPayload });
      expect(hookRes.success).toBe(true);

      // 2. Client verification callback arrives second
      const clientSig = generateMockSignature(orderId, paymentId);
      const callbackRes = await verifyPaymentHandler({
        orderId,
        paymentId,
        signature: clientSig,
        userId: 'user_race_1',
      });

      expect(callbackRes.success).toBe(true);
      expect(callbackRes.verified).toBe(true);
      expect(await hasActiveEntitlement('user_race_1', 'combo')).toBe(true);
    });

    it('handles duplicate webhook events idempotently without creating duplicate state', async () => {
      const orderRes = await createOrderHandler({
        productId: 'combo',
        userId: 'user_dup_webhook',
      });
      const orderId = orderRes.orderId!;
      const paymentId = 'pay_dup_123';

      const webhookPayload = {
        event: 'payment.captured',
        payload: {
          payment: {
            entity: {
              id: paymentId,
              order_id: orderId,
              amount: 14900,
              currency: 'INR',
              status: 'captured',
            },
          },
        },
      };
      const rawBody = JSON.stringify(webhookPayload);
      const webhookSig = generateMockSignature(rawBody, '', RAZORPAY_CONFIG.webhookSecret);

      const firstCall = await handleRazorpayWebhook({ rawBody, signature: webhookSig, payload: webhookPayload });
      const secondCall = await handleRazorpayWebhook({ rawBody, signature: webhookSig, payload: webhookPayload });

      expect(firstCall.success).toBe(true);
      expect(secondCall.success).toBe(true);
      expect(await hasActiveEntitlement('user_dup_webhook', 'combo')).toBe(true);
    });

    it('denies AI report generation for users without active combo entitlement', async () => {
      const { generateAIReport } = await import('../backend/ai/handlers/generateAIReportHandler');
      const unentitledUserId = 'unentitled_user_999';

      const res = await generateAIReport({
        reportId: 'rep_unauthorized_test',
        userId: unentitledUserId,
        language: 'en',
        fusionInput: {
          dominantNumber: 1,
          dominantTheme: 'Initiative',
          personalityType: 'Visionary',
          primaryDimension: 'Leadership',
          finalDimensions: { independence: 80, social: 60, curiosity: 70, leadership: 90, emotional: 50, stability: 60 },
          loveProfile: { score: 70, scoreBand: 'Strong', headline: 'Direct Relational Harmony' },
          careerProfile: { score: 90, scoreBand: 'Exceptional', headline: 'Executive Leadership' },
          moneyProfile: { score: 80, scoreBand: 'Strong', headline: 'Prudent Asset Growth' },
          communicationProfile: { score: 75, scoreBand: 'Strong', headline: 'Direct Dialogue' },
          learningProfile: { score: 85, scoreBand: 'Very Strong', headline: 'Strategic Mastery' },
          growthProfile: { score: 78, scoreBand: 'Strong', headline: 'Intentional Growth & Agency' },
        },
      });

      expect(res.success).toBe(false);
      expect(res.status).toBe('locked');
      expect(res.error?.category).toBe('AUTH_ERROR');
    });
  });
});

