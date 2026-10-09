"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAIReport = exports.handleRazorpayWebhook = exports.verifyRazorpayPayment = exports.createRazorpayOrder = void 0;
const https_1 = require("firebase-functions/v2/https");
const secrets_1 = require("./config/secrets");
const products_1 = require("./config/products");
const paymentAdminStorage_1 = require("./services/paymentAdminStorage");
const razorpayAdminService_1 = require("./services/razorpayAdminService");
const aiAdminService_1 = require("./services/aiAdminService");
const firebaseAdmin_1 = require("./config/firebaseAdmin");
/**
 * 1. createRazorpayOrder - Cloud Function (Callable)
 * Authoritatively creates a Razorpay order from server product configuration.
 */
exports.createRazorpayOrder = (0, https_1.onCall)({
    secrets: [secrets_1.razorpayKeyIdSecret, secrets_1.razorpayKeySecretSecret],
    cors: true,
}, async (request) => {
    const data = request.data || {};
    const { productId, reportId, testId, idempotencyKey } = data;
    const userId = request.auth?.uid || data.userId || 'guest_user';
    // 1. Authoritative Product Lookup
    const product = (0, products_1.getProductById)(productId);
    if (!product) {
        throw new https_1.HttpsError('invalid-argument', `Invalid product ID: '${productId}'. Product does not exist.`);
    }
    // 2. Free Products Check
    if (product.amountInPaise === 0 || !product.premium) {
        await paymentAdminStorage_1.paymentAdminStorage.grantEntitlement({
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
    const existing = await paymentAdminStorage_1.paymentAdminStorage.getEntitlement(userId, product.id, reportId);
    if (existing && existing.status === 'active') {
        return {
            success: true,
            productId: product.id,
            product,
            alreadyPurchased: true,
        };
    }
    // 4. Create Razorpay Order
    const keyId = secrets_1.razorpayKeyIdSecret.value();
    const keySecret = secrets_1.razorpayKeySecretSecret.value();
    if (!keyId || !keySecret) {
        throw new https_1.HttpsError('failed-precondition', 'Payment gateway configuration is missing on the server.');
    }
    const razorpay = razorpayAdminService_1.razorpayAdminService.createRazorpayClient(keyId, keySecret);
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
        const paymentRecord = {
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
        await paymentAdminStorage_1.paymentAdminStorage.savePaymentRecord(paymentRecord);
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
    }
    catch (err) {
        console.error('[createRazorpayOrder] Razorpay API error:', err);
        throw new https_1.HttpsError('internal', 'Unable to initiate payment order with Razorpay.');
    }
});
/**
 * 2. verifyRazorpayPayment - Cloud Function (Callable)
 * Verifies cryptographic HMAC-SHA256 signature and unlocks entitlement.
 */
exports.verifyRazorpayPayment = (0, https_1.onCall)({
    secrets: [secrets_1.razorpayKeySecretSecret],
    cors: true,
}, async (request) => {
    const data = request.data || {};
    const { orderId, paymentId, signature, productId, reportId } = data;
    const userId = request.auth?.uid || data.userId || 'guest_user';
    if (!orderId || !paymentId || !signature) {
        throw new https_1.HttpsError('invalid-argument', 'Missing required verification parameters (orderId, paymentId, or signature).');
    }
    // 1. Authoritative payment record lookup
    const paymentRecord = await paymentAdminStorage_1.paymentAdminStorage.getPaymentByOrderId(orderId);
    if (!paymentRecord) {
        throw new https_1.HttpsError('not-found', 'Order record not found in payment registry.');
    }
    const effectiveProductId = productId || paymentRecord.productId || 'combo';
    const effectiveReportId = reportId || paymentRecord.reportId;
    // Check if already captured and verified
    if (paymentRecord.status === 'captured' && paymentRecord.razorpaySignatureVerified) {
        const existingEnt = await paymentAdminStorage_1.paymentAdminStorage.getEntitlement(userId, effectiveProductId, effectiveReportId);
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
    const keySecret = secrets_1.razorpayKeySecretSecret.value();
    const isSignatureValid = razorpayAdminService_1.razorpayAdminService.verifyPaymentSignature({
        orderId,
        paymentId,
        signature,
        keySecret,
    });
    if (!isSignatureValid) {
        await paymentAdminStorage_1.paymentAdminStorage.updatePaymentStatus({
            orderId,
            newStatus: 'failed',
            paymentId,
            failureReason: 'Cryptographic signature mismatch.',
            signatureVerified: false,
        });
        throw new https_1.HttpsError('permission-denied', 'Invalid payment signature. Verification failed.');
    }
    // 3. Update status to captured
    await paymentAdminStorage_1.paymentAdminStorage.updatePaymentStatus({
        orderId,
        newStatus: 'captured',
        paymentId,
        verifiedAt: new Date().toISOString(),
        signatureVerified: true,
    });
    // 4. Grant Entitlement
    const entitlement = await paymentAdminStorage_1.paymentAdminStorage.grantEntitlement({
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
});
/**
 * 3. handleRazorpayWebhook - Cloud Function (HTTPS Webhook)
 * Verifies exact raw request body signature and processes asynchronous payment events.
 */
exports.handleRazorpayWebhook = (0, https_1.onRequest)({
    secrets: [secrets_1.razorpayWebhookSecretSecret],
}, async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).send('Method Not Allowed');
        return;
    }
    const signature = req.headers['x-razorpay-signature'];
    const rawBody = req.rawBody; // Exact raw Buffer provided by Firebase Functions
    const webhookSecret = secrets_1.razorpayWebhookSecretSecret.value();
    if (!rawBody || !signature || !webhookSecret) {
        res.status(400).send('Missing webhook payload or signature.');
        return;
    }
    // 1. Verify Webhook Signature
    const isValid = razorpayAdminService_1.razorpayAdminService.verifyWebhookSignature({
        rawBody,
        signature,
        webhookSecret,
    });
    if (!isValid) {
        console.warn('[handleRazorpayWebhook] Invalid webhook signature rejected.');
        res.status(400).send('Invalid signature.');
        return;
    }
    let eventPayload;
    try {
        eventPayload = JSON.parse(rawBody.toString('utf8'));
    }
    catch {
        res.status(400).send('Invalid JSON.');
        return;
    }
    const eventName = eventPayload.event;
    const paymentEntity = eventPayload.payload?.payment?.entity;
    // 2. Handle Payment Captured
    if (eventName === 'payment.captured' && paymentEntity) {
        const orderId = paymentEntity.order_id;
        const paymentId = paymentEntity.id;
        const existing = await paymentAdminStorage_1.paymentAdminStorage.getPaymentByOrderId(orderId);
        const userId = paymentEntity.notes?.userId || existing?.userId || 'guest_user';
        const productId = paymentEntity.notes?.productId || existing?.productId || 'combo';
        const reportId = paymentEntity.notes?.reportId || existing?.reportId;
        const testId = paymentEntity.notes?.testId || existing?.testId;
        await paymentAdminStorage_1.paymentAdminStorage.updatePaymentStatus({
            orderId,
            newStatus: 'captured',
            paymentId,
            verifiedAt: new Date().toISOString(),
            webhookVerified: true,
        });
        await paymentAdminStorage_1.paymentAdminStorage.grantEntitlement({
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
        await paymentAdminStorage_1.paymentAdminStorage.updatePaymentStatus({
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
        const existing = await paymentAdminStorage_1.paymentAdminStorage.getPaymentByOrderId(orderId);
        await paymentAdminStorage_1.paymentAdminStorage.updatePaymentStatus({
            orderId,
            newStatus: 'refunded',
            paymentId: paymentEntity.id,
            webhookVerified: true,
        });
        if (existing) {
            await paymentAdminStorage_1.paymentAdminStorage.revokeEntitlement(existing.userId, existing.productId, existing.reportId);
        }
        res.status(200).json({ status: 'ok', event: eventName });
        return;
    }
    res.status(200).json({ status: 'ignored', event: eventName });
});
/**
 * 4. generateAIReport - Cloud Function (Callable)
 * Generates personalized AI narrative reports for users with active combo entitlement.
 */
exports.generateAIReport = (0, https_1.onCall)({
    secrets: [secrets_1.openaiApiKeySecret],
    cors: true,
    timeoutSeconds: 120,
    memory: '512MiB',
}, async (request) => {
    const data = request.data || {};
    const { reportId, fusionInput, language, forceRegenerate } = data;
    const userId = request.auth?.uid || data.userId || 'guest_user';
    if (!reportId || !fusionInput) {
        throw new https_1.HttpsError('invalid-argument', 'Missing reportId or fusionInput profile.');
    }
    // 1. Entitlement Authorization Check
    const entitlement = await paymentAdminStorage_1.paymentAdminStorage.checkUserEntitlement(userId, 'combo', reportId);
    if (!entitlement.hasAccess) {
        throw new https_1.HttpsError('permission-denied', 'Premium combo entitlement is required to generate AI narrative reports.');
    }
    // 2. Idempotency Cache Check
    if (!forceRegenerate) {
        const existingDoc = await firebaseAdmin_1.adminDb.collection('fusionReports').doc(reportId).get();
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
    const apiKey = secrets_1.openaiApiKeySecret.value();
    if (!apiKey) {
        throw new https_1.HttpsError('failed-precondition', 'OpenAI API key configuration is missing on the server.');
    }
    try {
        const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
        const aiContent = await aiAdminService_1.aiAdminService.generateAIReport({
            apiKey,
            model,
            fusionInput,
            language: language === 'hi' ? 'hi' : 'en',
        });
        // 3. Save Report in Firestore
        await aiAdminService_1.aiAdminService.saveReportToFirestore({
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
    }
    catch (err) {
        console.error('[generateAIReport] Error generating report:', err);
        throw new https_1.HttpsError('internal', "We couldn't generate your personalized story right now.");
    }
});
//# sourceMappingURL=index.js.map