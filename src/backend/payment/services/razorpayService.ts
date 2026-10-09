import crypto from 'crypto';
import Razorpay from 'razorpay';
import { RAZORPAY_CONFIG } from '../config/razorpayConfig';

export interface RazorpayOrderResult {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export class RazorpayService {
  private razorpayInstance: Razorpay | null = null;

  private getInstance(): Razorpay | null {
    if (!this.razorpayInstance && RAZORPAY_CONFIG.hasCredentials) {
      this.razorpayInstance = new Razorpay({
        key_id: RAZORPAY_CONFIG.keyId,
        key_secret: RAZORPAY_CONFIG.keySecret,
      });
    }
    return this.razorpayInstance;
  }

  /**
   * Creates a new Razorpay order server-side.
   */
  public async createOrder(params: {
    amount: number; // in paise
    currency: string;
    receipt: string;
    notes?: Record<string, string>;
  }): Promise<RazorpayOrderResult> {
    const instance = this.getInstance();

    if (instance) {
      try {
        const order = await instance.orders.create({
          amount: params.amount,
          currency: params.currency,
          receipt: params.receipt,
          notes: params.notes,
        });

        return {
          id: order.id,
          amount: Number(order.amount),
          currency: order.currency,
          receipt: order.receipt || params.receipt,
          status: order.status,
        };
      } catch (err) {
        console.error('[RazorpayService] Order creation API error:', err);
        throw new Error(`Razorpay order creation failed: ${(err as Error).message}`);
      }
    }

    // Deterministic Mock/Sandbox Order for Test Mode / Decoupled Preview
    const mockOrderId = `order_test_${Date.now()}_${params.receipt.slice(-6)}`;
    return {
      id: mockOrderId,
      amount: params.amount,
      currency: params.currency,
      receipt: params.receipt,
      status: 'created',
    };
  }

  /**
   * Cryptographically verifies the Razorpay payment signature using HMAC SHA256.
   *
   * Expected: HMAC-SHA256(order_id + "|" + payment_id, key_secret) === signature
   */
  public verifyPaymentSignature(params: {
    orderId: string;
    paymentId: string;
    signature: string;
    secret?: string;
  }): boolean {
    const { orderId, paymentId, signature } = params;
    const secret = params.secret || RAZORPAY_CONFIG.keySecret;

    if (!orderId || !paymentId || !signature) {
      return false;
    }

    if (!secret) {
      return false;
    }

    try {
      const payload = `${orderId}|${paymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      const expectedBuf = Buffer.from(expectedSignature, 'utf8');
      const signatureBuf = Buffer.from(signature, 'utf8');

      if (expectedBuf.length !== signatureBuf.length) {
        return false;
      }

      return crypto.timingSafeEqual(expectedBuf, signatureBuf);
    } catch (err) {
      console.error('[RazorpayService] Signature verification error:', err);
      return false;
    }
  }

  /**
   * Cryptographically verifies incoming Razorpay webhook signature.
   */
  public verifyWebhookSignature(params: {
    rawBody: string;
    signature: string;
    secret?: string;
  }): boolean {
    const { rawBody, signature } = params;
    const secret = params.secret || RAZORPAY_CONFIG.webhookSecret;

    if (!rawBody || !signature) {
      return false;
    }

    if (!secret) {
      // In test mode without secret configured
      return RAZORPAY_CONFIG.isTestMode;
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');

      const expectedBuf = Buffer.from(expectedSignature, 'utf8');
      const signatureBuf = Buffer.from(signature, 'utf8');

      if (expectedBuf.length !== signatureBuf.length) {
        return false;
      }

      return crypto.timingSafeEqual(expectedBuf, signatureBuf);
    } catch (err) {
      console.error('[RazorpayService] Webhook verification error:', err);
      return false;
    }
  }
}

export const razorpayService = new RazorpayService();

export function generateMockSignature(
  orderIdOrBody: string,
  paymentId = '',
  secret = RAZORPAY_CONFIG.keySecret
): string {
  const payload = paymentId ? `${orderIdOrBody}|${paymentId}` : orderIdOrBody;
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret?: string
): boolean {
  return razorpayService.verifyPaymentSignature({ orderId, paymentId, signature, secret });
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret?: string
): boolean {
  return razorpayService.verifyWebhookSignature({ rawBody, signature, secret });
}
