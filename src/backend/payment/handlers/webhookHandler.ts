import { razorpayService } from '../services/razorpayService';
import { paymentStorageService } from '../services/paymentStorageService';

export interface WebhookResult {
  success: boolean;
  event?: string;
  processed: boolean;
  error?: string;
}

/**
 * Backend Webhook Handler: Handles asynchronous Razorpay webhook events with HMAC signature verification.
 */
export async function handleRazorpayWebhook(
  paramsOrBody: string | { rawBody: string; signature: string; payload?: unknown },
  possibleSignature?: string
): Promise<WebhookResult> {
  const rawBody = typeof paramsOrBody === 'string' ? paramsOrBody : paramsOrBody?.rawBody;
  const signature = typeof paramsOrBody === 'string' ? possibleSignature || '' : paramsOrBody?.signature;

  if (!rawBody || !signature) {
    return {
      success: false,
      processed: false,
      error: 'Missing webhook body or signature header.',
    };
  }

  // 1. Verify Webhook Signature
  const isValid = razorpayService.verifyWebhookSignature({
    rawBody,
    signature,
  });

  if (!isValid) {
    console.warn('[handleRazorpayWebhook] Invalid webhook signature rejected.');
    return {
      success: false,
      processed: false,
      error: 'Invalid webhook signature.',
    };
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
      refund?: {
        entity?: {
          id: string;
          payment_id: string;
          amount: number;
        };
      };
    };
  };

  try {
    eventPayload = JSON.parse(rawBody);
  } catch (err) {
    return {
      success: false,
      processed: false,
      error: `Webhook JSON parsing failed: ${(err as Error).message}`,
    };
  }

  const eventName = eventPayload.event;
  const paymentEntity = eventPayload.payload?.payment?.entity;

  // 2. Handle Payment Captured
  if (eventName === 'payment.captured' && paymentEntity) {
    const orderId = paymentEntity.order_id;
    const paymentId = paymentEntity.id;
    const existing = await paymentStorageService.getPaymentByOrderId(orderId);
    const userId = paymentEntity.notes?.userId || existing?.userId || 'guest_user';
    const productId = paymentEntity.notes?.productId || existing?.productId || 'combo';
    const reportId = paymentEntity.notes?.reportId || existing?.reportId;
    const testId = paymentEntity.notes?.testId || existing?.testId;

    await paymentStorageService.updatePaymentStatus({
      orderId,
      newStatus: 'captured',
      paymentId,
      verifiedAt: new Date().toISOString(),
      webhookVerified: true,
    });

    await paymentStorageService.grantEntitlement({
      userId,
      productId,
      reportId,
      testId,
      sourcePaymentId: paymentId,
    });

    return {
      success: true,
      event: eventName,
      processed: true,
    };
  }

  // 3. Handle Payment Failed
  if (eventName === 'payment.failed' && paymentEntity) {
    const orderId = paymentEntity.order_id;
    const failureReason = paymentEntity.error_description || 'Payment failed during processing.';

    await paymentStorageService.updatePaymentStatus({
      orderId,
      newStatus: 'failed',
      paymentId: paymentEntity.id,
      failureReason,
      webhookVerified: true,
    });

    return {
      success: true,
      event: eventName,
      processed: true,
    };
  }

  // 4. Handle Refund
  if ((eventName === 'refund.created' || eventName === 'refund.processed') && paymentEntity) {
    const orderId = paymentEntity.order_id;
    const existingPayment = await paymentStorageService.getPaymentByOrderId(orderId);

    await paymentStorageService.updatePaymentStatus({
      orderId,
      newStatus: 'refunded',
      paymentId: paymentEntity.id,
      webhookVerified: true,
    });

    if (existingPayment) {
      await paymentStorageService.revokeEntitlement(
        existingPayment.userId,
        existingPayment.productId,
        existingPayment.reportId
      );
    }

    return {
      success: true,
      event: eventName,
      processed: true,
    };
  }

  return {
    success: true,
    event: eventName,
    processed: false,
  };
}
