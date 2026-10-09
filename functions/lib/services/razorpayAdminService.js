"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.razorpayAdminService = exports.RazorpayAdminService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const razorpay_1 = __importDefault(require("razorpay"));
class RazorpayAdminService {
    createRazorpayClient(keyId, keySecret) {
        return new razorpay_1.default({
            key_id: keyId,
            key_secret: keySecret,
        });
    }
    verifyPaymentSignature(params) {
        const { orderId, paymentId, signature, keySecret } = params;
        if (!orderId || !paymentId || !signature || !keySecret) {
            return false;
        }
        try {
            const payload = `${orderId}|${paymentId}`;
            const expectedSignature = crypto_1.default
                .createHmac('sha256', keySecret)
                .update(payload)
                .digest('hex');
            const expectedBuf = Buffer.from(expectedSignature, 'utf8');
            const signatureBuf = Buffer.from(signature, 'utf8');
            if (expectedBuf.length !== signatureBuf.length) {
                return false;
            }
            return crypto_1.default.timingSafeEqual(expectedBuf, signatureBuf);
        }
        catch (err) {
            console.error('[RazorpayAdminService] Signature error:', err);
            return false;
        }
    }
    verifyWebhookSignature(params) {
        const { rawBody, signature, webhookSecret } = params;
        if (!rawBody || !signature || !webhookSecret) {
            return false;
        }
        try {
            const bodyBuffer = Buffer.isBuffer(rawBody) ? rawBody : Buffer.from(rawBody, 'utf8');
            const expectedSignature = crypto_1.default
                .createHmac('sha256', webhookSecret)
                .update(bodyBuffer)
                .digest('hex');
            const expectedBuf = Buffer.from(expectedSignature, 'utf8');
            const signatureBuf = Buffer.from(signature, 'utf8');
            if (expectedBuf.length !== signatureBuf.length) {
                return false;
            }
            return crypto_1.default.timingSafeEqual(expectedBuf, signatureBuf);
        }
        catch (err) {
            console.error('[RazorpayAdminService] Webhook signature error:', err);
            return false;
        }
    }
}
exports.RazorpayAdminService = RazorpayAdminService;
exports.razorpayAdminService = new RazorpayAdminService();
//# sourceMappingURL=razorpayAdminService.js.map