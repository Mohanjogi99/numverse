import { VerifyPaymentRequest, VerifyPaymentResponse } from '../../../types/payment';
import { razorpayService } from '../services/razorpayService';
import { paymentStorageService } from '../services/paymentStorageService';

/**
 * Backend Handler: Server-side cryptographic signature verification and entitlement grant.
 * Never unlocks premium content without verified HMAC signature.
 */
export async function verifyRazorpayPayment(
  request: VerifyPaymentRequest
): Promise<VerifyPaymentResponse> {
  const { orderId, paymentId, signature, productId, reportId } = request;
  const userId = request.userId || 'guest_user';

  if (!orderId || !paymentId || !signature) {
    return {
      success: false,
      verified: false,
      orderId: orderId || '',
      error: 'Missing required verification parameters (orderId, paymentId, or signature).',
    };
  }

  // 1. Retrieve authoritative payment record
  const paymentRecord = await paymentStorageService.getPaymentByOrderId(orderId);
  if (!paymentRecord) {
    return {
      success: false,
      verified: false,
      orderId,
      error: 'Order record not found in payment registry.',
    };
  }

  const effectiveProductId = productId || paymentRecord.productId || 'combo';
  const effectiveReportId = reportId || paymentRecord.reportId;

  // Check if already verified and captured
  if (paymentRecord.status === 'captured' && paymentRecord.razorpaySignatureVerified) {
    const existingEnt = await paymentStorageService.getEntitlement(userId, effectiveProductId, effectiveReportId);
    return {
      success: true,
      verified: true,
      orderId,
      paymentId,
      entitlementId: existingEnt?.id,
      entitlement: existingEnt || undefined,
    };
  }

  // 2. Cryptographic HMAC Signature Verification
  const isSignatureValid = razorpayService.verifyPaymentSignature({
    orderId,
    paymentId,
    signature,
  });

  if (!isSignatureValid) {
    await paymentStorageService.updatePaymentStatus({
      orderId,
      newStatus: 'failed',
      paymentId,
      failureReason: 'Cryptographic signature mismatch.',
      signatureVerified: false,
    });

    return {
      success: false,
      verified: false,
      orderId,
      error: 'Invalid payment signature. Verification failed.',
    };
  }

  // 3. Update Payment Status to Captured
  const updatedPayment = await paymentStorageService.updatePaymentStatus({
    orderId,
    newStatus: 'captured',
    paymentId,
    verifiedAt: new Date().toISOString(),
    signatureVerified: true,
  });

  if (!updatedPayment) {
    return {
      success: false,
      verified: false,
      orderId,
      error: 'Failed to update payment status state machine.',
    };
  }

  // 4. Grant Entitlement
  const entitlement = await paymentStorageService.grantEntitlement({
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

export const verifyPaymentHandler = verifyRazorpayPayment;

