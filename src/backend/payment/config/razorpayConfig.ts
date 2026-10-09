export const RAZORPAY_CONFIG = {
  // Public Key ID (may be provided to the checkout modal)
  get keyId(): string {
    return process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder_key';
  },

  // Secret Key (Server-Only - NEVER expose to client)
  get keySecret(): string {
    return process.env.RAZORPAY_KEY_SECRET || 'mock_test_key_secret_number_story';
  },

  // Webhook Secret (Server-Only)
  get webhookSecret(): string {
    return process.env.RAZORPAY_WEBHOOK_SECRET || 'mock_test_webhook_secret_number_story';
  },

  // Environment mode
  get isTestMode(): boolean {
    return this.keyId.startsWith('rzp_test_');
  },

  // Has live credentials configured
  get hasCredentials(): boolean {
    return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
  },
};
