import crypto from 'crypto';
import Razorpay from 'razorpay';

export class RazorpayAdminService {
  public createRazorpayClient(keyId: string, keySecret: string): Razorpay {
    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }

  public verifyPaymentSignature(params: {
    orderId: string;
    paymentId: string;
    signature: string;
    keySecret: string;
  }): boolean {
    const { orderId, paymentId, signature, keySecret } = params;
    if (!orderId || !paymentId || !signature || !keySecret) {
      return false;
    }

    try {
      const payload = `${orderId}|${paymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(payload)
        .digest('hex');

      const expectedBuf = Buffer.from(expectedSignature, 'utf8');
      const signatureBuf = Buffer.from(signature, 'utf8');

      if (expectedBuf.length !== signatureBuf.length) {
        return false;
      }

      return crypto.timingSafeEqual(expectedBuf, signatureBuf);
    } catch (err) {
      console.error('[RazorpayAdminService] Signature error:', err);
      return false;
    }
  }

  public verifyWebhookSignature(params: {
    rawBody: string | Buffer;
    signature: string;
    webhookSecret: string;
  }): boolean {
    const { rawBody, signature, webhookSecret } = params;
    if (!rawBody || !signature || !webhookSecret) {
      return false;
    }

    try {
      const bodyBuffer = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody, 'utf8');
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(bodyBuffer)
        .digest('hex');

      const expectedBuf = Buffer.from(expectedSignature, 'utf8');
      const signatureBuf = Buffer.from(signature, 'utf8');

      if (expectedBuf.length !== signatureBuf.length) {
        return false;
      }

      return crypto.timingSafeEqual(expectedBuf, signatureBuf);
    } catch (err) {
      console.error('[RazorpayAdminService] Webhook signature error:', err);
      return false;
    }
  }
}

export const razorpayAdminService = new RazorpayAdminService();
