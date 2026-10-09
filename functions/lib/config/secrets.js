"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openaiApiKeySecret = exports.razorpayWebhookSecretSecret = exports.razorpayKeySecretSecret = exports.razorpayKeyIdSecret = void 0;
const params_1 = require("firebase-functions/params");
/**
 * Secret definitions managed by Google Cloud Secret Manager / Firebase CLI.
 * Bound explicitly to individual Cloud Functions.
 */
exports.razorpayKeyIdSecret = (0, params_1.defineSecret)('RAZORPAY_KEY_ID');
exports.razorpayKeySecretSecret = (0, params_1.defineSecret)('RAZORPAY_KEY_SECRET');
exports.razorpayWebhookSecretSecret = (0, params_1.defineSecret)('RAZORPAY_WEBHOOK_SECRET');
exports.openaiApiKeySecret = (0, params_1.defineSecret)('OPENAI_API_KEY');
//# sourceMappingURL=secrets.js.map