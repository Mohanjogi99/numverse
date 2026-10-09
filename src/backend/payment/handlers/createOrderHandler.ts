import { CreateOrderRequest, CreateOrderResponse, PaymentRecord } from '../../../types/payment';
import { getProductById } from '../../../config/products';
import { razorpayService } from '../services/razorpayService';
import { paymentStorageService } from '../services/paymentStorageService';
import { RAZORPAY_CONFIG } from '../config/razorpayConfig';

/**
 * Backend Handler: Creates a Razorpay order from authoritative server configuration.
 * Never accepts price or currency from the client.
 */
export async function createRazorpayOrder(
  request: CreateOrderRequest
): Promise<CreateOrderResponse> {
  const { productId, reportId, testId, idempotencyKey } = request;
  const userId = request.userId || 'guest_user';

  // 1. Authoritative Product Lookup
  const product = getProductById(productId);
  if (!product) {
    return {
      success: false,
      error: `Invalid product ID: '${productId}'. Product does not exist.`,
    };
  }

  // 2. Free Products Check
  if (product.amountInPaise === 0 || !product.premium) {
    await paymentStorageService.grantEntitlement({
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
  const existingEntitlement = await paymentStorageService.getEntitlement(
    userId,
    product.id,
    reportId
  );
  if (existingEntitlement && existingEntitlement.status === 'active') {
    return {
      success: true,
      productId: product.id,
      product,
      alreadyPurchased: true,
    };
  }

  // 4. Create Order on Razorpay
  const receipt = `rcpt_${userId.slice(-6)}_${Date.now()}`;
  try {
    const order = await razorpayService.createOrder({
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

    // 5. Store Initial Payment Record
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

    await paymentStorageService.savePaymentRecord(paymentRecord);

    return {
      success: true,
      orderId: order.id,
      amount: product.amountInPaise,
      currency: 'INR',
      keyId: RAZORPAY_CONFIG.keyId,
      productId: product.id,
      product,
      alreadyPurchased: false,
    };
  } catch (err) {
    console.error('[createRazorpayOrder] Order creation error:', err);
    return {
      success: false,
      error: 'Unable to initiate payment order. Please try again.',
    };
  }
}

export const createOrderHandler = createRazorpayOrder;

