import { defineSecret } from 'firebase-functions/params';

/**
 * Secret definitions managed by Google Cloud Secret Manager / Firebase CLI.
 * Bound explicitly to individual Cloud Functions.
 */
export const razorpayKeyIdSecret = defineSecret('RAZORPAY_KEY_ID');
export const razorpayKeySecretSecret = defineSecret('RAZORPAY_KEY_SECRET');
export const razorpayWebhookSecretSecret = defineSecret('RAZORPAY_WEBHOOK_SECRET');
export const openaiApiKeySecret = defineSecret('OPENAI_API_KEY');
