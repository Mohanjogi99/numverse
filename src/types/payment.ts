export type PaymentCurrency = 'INR';

export type PaymentStatus =
  | 'created'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'refunded'
  | 'partially_refunded';

export interface PaymentRecord {
  id: string; // Internal ID
  userId: string;
  productId: string;
  orderId: string; // Razorpay Order ID (e.g. order_xxx)
  paymentId?: string; // Razorpay Payment ID (e.g. pay_xxx)
  amount: number; // In paise (e.g. 14900 for ₹149)
  currency: PaymentCurrency;
  status: PaymentStatus;
  reportId?: string;
  testId?: string;
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
  failureReason?: string;
  razorpaySignatureVerified: boolean;
  webhookVerified: boolean;
  idempotencyKey?: string;
}

import type { ProductTier } from '../config/products';

export interface Entitlement {
  id: string; // e.g. ent_userId_productId_reportId
  userId: string;
  productId: string;
  reportId?: string;
  testId?: string;
  sourcePaymentId: string;
  status: 'active' | 'revoked';
  source?: 'payment' | 'admin' | 'promo';
  grantedAt: string;
  createdAt?: string;
  updatedAt?: string;
  expiresAt: null; // One-time purchase, perpetual
}

export interface CreateOrderRequest {
  productId: string;
  userId?: string;
  userEmail?: string;
  reportId?: string;
  testId?: string;
  idempotencyKey?: string;
}

export interface CreateOrderResponse {
  success: boolean;
  orderId?: string;
  amount?: number; // In paise
  currency?: PaymentCurrency;
  keyId?: string;
  productId?: string;
  product?: ProductTier;
  alreadyPurchased?: boolean;
  error?: string;
}

export interface VerifyPaymentRequest {
  orderId: string;
  paymentId: string;
  signature: string;
  productId?: string;
  userId?: string;
  reportId?: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  verified: boolean;
  orderId: string;
  paymentId?: string;
  entitlementId?: string;
  entitlement?: Entitlement;
  error?: string;
}

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: PaymentCurrency;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: {
    ondismiss?: () => void;
  };
}
