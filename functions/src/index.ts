import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import {
  razorpayKeyIdSecret,
  razorpayKeySecretSecret,
  razorpayWebhookSecretSecret,
  openaiApiKeySecret,
} from './config/secrets';
import { getProductById } from './config/products';
import { paymentAdminStorage, PaymentRecord } from './services/paymentAdminStorage';
import { razorpayAdminService } from './services/razorpayAdminService';
import { aiAdminService } from './services/aiAdminService';
import { adminDb } from './config/firebaseAdmin';

/**
 * 1. createRazorpayOrder - Cloud Function (Callable)
 * Authoritatively creates a Razorpay order from server product configuration.
 */
export const createRazorpayOrder = onCall(
  {
    secrets: [razorpayKeyIdSecret, razorpayKeySecretSecret],
    cors: true,
  },
  async (request) => {
    const data = request.data || {};
    const { productId, reportId, testId, idempotencyKey } = data;
    const userId = request.auth?.uid || data.userId || 'guest_user';

    // 1. Authoritative Product Lookup
    const product = getProductById(productId);
    if (!product) {
      throw new HttpsError(
        'invalid-argument',
        `Invalid product ID: '${productId}'. Product does not exist.`
      );
    }

    // 2. Free Products Check
    if (product.amountInPaise === 0 || !product.premium) {
      await paymentAdminStorage.grantEntitlement({
        userId,
        productId: product.id,
        reportId,
        testId,
        sourcePaymentId: 'free_tier_grant',
      });
      return {
        success: true,
        orderId: `free_${Date.now()}`,
        amount: 0,
        currency: 'INR',
        productId: product.id,
        product,
        alreadyPurchased: true,
      };
    }

    // 3. Already Purchased Check
    const existing = await paymentAdminStorage.getEntitlement(userId, product.id, reportId);
    if (existing && existing.status === 'active') {
      return {
        success: true,
        productId: product.id,
        product,
        alreadyPurchased: true,
      };
    }

    // 4. Create Razorpay Order
    const keyId = razorpayKeyIdSecret.value();
    const keySecret = razorpayKeySecretSecret.value();

    if (!keyId || !keySecret) {
      throw new HttpsError(
        'failed-precondition',
        'Payment gateway configuration is missing on the server.'
      );
    }

    const razorpay = razorpayAdminService.createRazorpayClient(keyId, keySecret);
    const receipt = `rcpt_${userId.slice(-6)}_${Date.now()}`;

    try {
      const order = await razorpay.orders.create({
        amount: product.amountInPaise,
        currency: 'INR',
        receipt,
        notes: {
          userId,
          productId: product.id,
          reportId: reportId || '',
          testId: testId || '',
        },
      });

      // 5. Save internal payment record
      const paymentRecord: PaymentRecord = {
        id: `payrec_${order.id}`,
        userId,
        productId: product.id,
        orderId: order.id,
        amount: product.amountInPaise,
        currency: 'INR',
        status: 'created',
        reportId,
        testId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        razorpaySignatureVerified: false,
        webhookVerified: false,
        idempotencyKey,
      };

      await paymentAdminStorage.savePaymentRecord(paymentRecord);

      return {
        success: true,
        orderId: order.id,
        amount: product.amountInPaise,
        currency: 'INR',
        keyId,
        productId: product.id,
        product,
        alreadyPurchased: false,
      };
    } catch (err) {
      console.error('[createRazorpayOrder] Razorpay API error:', err);
      throw new HttpsError('internal', 'Unable to initiate payment order with Razorpay.');
    }
  }
);

/**
 * 2. verifyRazorpayPayment - Cloud Function (Callable)
 * Verifies cryptographic HMAC-SHA256 signature and unlocks entitlement.
 */
export const verifyRazorpayPayment = onCall(
  {
    secrets: [razorpayKeySecretSecret],
    cors: true,
  },
  async (request) => {
    const data = request.data || {};
    const { orderId, paymentId, signature, productId, reportId } = data;
    const userId = request.auth?.uid || data.userId || 'guest_user';

    if (!orderId || !paymentId || !signature) {
      throw new HttpsError(
        'invalid-argument',
        'Missing required verification parameters (orderId, paymentId, or signature).'
      );
    }

    // 1. Authoritative payment record lookup
    const paymentRecord = await paymentAdminStorage.getPaymentByOrderId(orderId);
    if (!paymentRecord) {
      throw new HttpsError('not-found', 'Order record not found in payment registry.');
    }

    const effectiveProductId = productId || paymentRecord.productId || 'combo';
    const effectiveReportId = reportId || paymentRecord.reportId;

    // Check if already captured and verified
    if (paymentRecord.status === 'captured' && paymentRecord.razorpaySignatureVerified) {
      const existingEnt = await paymentAdminStorage.getEntitlement(
        userId,
        effectiveProductId,
        effectiveReportId
      );
      return {
        success: true,
        verified: true,
        orderId,
        paymentId,
        entitlementId: existingEnt?.id,
        entitlement: existingEnt,
      };
    }

    // 2. Cryptographic HMAC Signature Verification
    const keySecret = razorpayKeySecretSecret.value();
    const isSignatureValid = razorpayAdminService.verifyPaymentSignature({
      orderId,
      paymentId,
      signature,
      keySecret,
    });

    if (!isSignatureValid) {
      await paymentAdminStorage.updatePaymentStatus({
        orderId,
        newStatus: 'failed',
        paymentId,
        failureReason: 'Cryptographic signature mismatch.',
        signatureVerified: false,
      });

      throw new HttpsError('permission-denied', 'Invalid payment signature. Verification failed.');
    }

    // 3. Update status to captured
    await paymentAdminStorage.updatePaymentStatus({
      orderId,
      newStatus: 'captured',
      paymentId,
      verifiedAt: new Date().toISOString(),
      signatureVerified: true,
    });

    // 4. Grant Entitlement
    const entitlement = await paymentAdminStorage.grantEntitlement({
      userId,
      productId: effectiveProductId,
      reportId: effectiveReportId,
      testId: paymentRecord.testId,
      sourcePaymentId: paymentId,
    });

    return {
      success: true,
      verified: true,
      orderId,
      paymentId,
      entitlementId: entitlement.id,
      entitlement,
    };
  }
);

/**
 * 3. handleRazorpayWebhook - Cloud Function (HTTPS Webhook)
 * Verifies exact raw request body signature and processes asynchronous payment events.
 */
export const handleRazorpayWebhook = onRequest(
  {
    secrets: [razorpayWebhookSecretSecret],
  },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const signature = req.headers['x-razorpay-signature'] as string;
    const rawBody = req.rawBody; // Exact raw Buffer provided by Firebase Functions
    const webhookSecret = razorpayWebhookSecretSecret.value();

    if (!rawBody || !signature || !webhookSecret) {
      res.status(400).send('Missing webhook payload or signature.');
      return;
    }

    // 1. Verify Webhook Signature
    const isValid = razorpayAdminService.verifyWebhookSignature({
      rawBody,
      signature,
      webhookSecret,
    });

    if (!isValid) {
      console.warn('[handleRazorpayWebhook] Invalid webhook signature rejected.');
      res.status(400).send('Invalid signature.');
      return;
    }

    let eventPayload: {
      event: string;
      payload?: {
        payment?: {
          entity?: {
            id: string;
            order_id: string;
            amount: number;
            status: string;
            notes?: Record<string, string>;
            error_description?: string;
          };
        };
      };
    };

    try {
      eventPayload = JSON.parse(rawBody.toString('utf8'));
    } catch {
      res.status(400).send('Invalid JSON.');
      return;
    }

    const eventName = eventPayload.event;
    const paymentEntity = eventPayload.payload?.payment?.entity;

    // 2. Handle Payment Captured
    if (eventName === 'payment.captured' && paymentEntity) {
      const orderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;
      const existing = await paymentAdminStorage.getPaymentByOrderId(orderId);
      const userId = paymentEntity.notes?.userId || existing?.userId || 'guest_user';
      const productId = paymentEntity.notes?.productId || existing?.productId || 'combo';
      const reportId = paymentEntity.notes?.reportId || existing?.reportId;
      const testId = paymentEntity.notes?.testId || existing?.testId;

      await paymentAdminStorage.updatePaymentStatus({
        orderId,
        newStatus: 'captured',
        paymentId,
        verifiedAt: new Date().toISOString(),
        webhookVerified: true,
      });

      await paymentAdminStorage.grantEntitlement({
        userId,
        productId,
        reportId,
        testId,
        sourcePaymentId: paymentId,
      });

      res.status(200).json({ status: 'ok', event: eventName });
      return;
    }

    // 3. Handle Payment Failed
    if (eventName === 'payment.failed' && paymentEntity) {
      const orderId = paymentEntity.order_id;
      const failureReason = paymentEntity.error_description || 'Payment failed during processing.';

      await paymentAdminStorage.updatePaymentStatus({
        orderId,
        newStatus: 'failed',
        paymentId: paymentEntity.id,
        failureReason,
        webhookVerified: true,
      });

      res.status(200).json({ status: 'ok', event: eventName });
      return;
    }

    // 4. Handle Refund
    if ((eventName === 'refund.created' || eventName === 'refund.processed') && paymentEntity) {
      const orderId = paymentEntity.order_id;
      const existing = await paymentAdminStorage.getPaymentByOrderId(orderId);

      await paymentAdminStorage.updatePaymentStatus({
        orderId,
        newStatus: 'refunded',
        paymentId: paymentEntity.id,
        webhookVerified: true,
      });

      if (existing) {
        await paymentAdminStorage.revokeEntitlement(
          existing.userId,
          existing.productId,
          existing.reportId
        );
      }

      res.status(200).json({ status: 'ok', event: eventName });
      return;
    }

    res.status(200).json({ status: 'ignored', event: eventName });
  }
);

/**
 * 4. generateAIReport - Cloud Function (Callable)
 * Generates personalized AI narrative reports for users with active combo entitlement.
 */
export const generateAIReport = onCall(
  {
    secrets: [openaiApiKeySecret],
    cors: true,
    timeoutSeconds: 120,
    memory: '512MiB',
  },
  async (request) => {
    const data = request.data || {};
    const { reportId, fusionInput, language, forceRegenerate } = data;
    const userId = request.auth?.uid || data.userId || 'guest_user';

    if (!reportId || !fusionInput) {
      throw new HttpsError('invalid-argument', 'Missing reportId or fusionInput profile.');
    }

    // 1. Entitlement Authorization Check
    const entitlement = await paymentAdminStorage.checkUserEntitlement(userId, 'combo', reportId);
    if (!entitlement.hasAccess) {
      throw new HttpsError(
        'permission-denied',
        'Premium combo entitlement is required to generate AI narrative reports.'
      );
    }

    // 2. Idempotency Cache Check
    if (!forceRegenerate) {
      const existingDoc = await adminDb.collection('fusionReports').doc(reportId).get();
      if (existingDoc.exists) {
        const existingData = existingDoc.data();
        if (existingData?.status === 'ready' && existingData?.aiContent) {
          return {
            success: true,
            status: 'ready',
            reportId,
            language: existingData.language || language || 'en',
            aiContent: existingData.aiContent,
            metadata: {
              model: existingData.aiModel,
              generatedAt: existingData.generatedAt || new Date().toISOString(),
              isFromCache: true,
            },
          };
        }
      }
    }

    // 3. OpenAI Generation
    const apiKey = openaiApiKeySecret.value();
    if (!apiKey) {
      throw new HttpsError('failed-precondition', 'OpenAI API key configuration is missing on the server.');
    }

    try {
      const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
      const aiContent = await aiAdminService.generateAIReport({
        apiKey,
        model,
        fusionInput,
        language: language === 'hi' ? 'hi' : 'en',
      });

      // 3. Save Report in Firestore
      await aiAdminService.saveReportToFirestore({
        reportId,
        userId,
        language: language || 'en',
        content: aiContent,
        model,
      });

      return {
        success: true,
        status: 'ready',
        reportId,
        language: language || 'en',
        aiContent,
        metadata: {
          model,
          generatedAt: new Date().toISOString(),
        },
      };
    } catch (err) {
      console.error('[generateAIReport] Error generating report:', err);
      throw new HttpsError('internal', "We couldn't generate your personalized story right now.");
    }
  }
);
