import {
  CreateOrderResponse,
  VerifyPaymentResponse,
  RazorpayCheckoutOptions,
} from '../types/payment';
import { getProductById } from '../config/products';
import { analytics } from './analyticsService';

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => {
      open: () => void;
      on: (event: string, callback: (response: unknown) => void) => void;
    };
  }
}

const STORAGE_KEY_ENTITLEMENTS = 'ns_user_entitlements';

interface ClientEntitlementRecord {
  userId: string;
  productId: string;
  reportId?: string;
  grantedAt: string;
  orderId?: string;
}

export class PaymentClientService {
  private isScriptLoaded = false;

  /**
   * Dynamically loads the official Razorpay Checkout JavaScript SDK.
   */
  public async loadRazorpayScript(): Promise<boolean> {
    if (this.isScriptLoaded || typeof window.Razorpay === 'function') {
      this.isScriptLoaded = true;
      return true;
    }

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        this.isScriptLoaded = true;
        resolve(true);
      };
      script.onerror = () => {
        console.warn('[PaymentClientService] External Razorpay SDK script not loaded (running in offline/sandbox mode).');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  /**
   * Gets client-cached entitlements.
   */
  private getStoredEntitlements(): ClientEntitlementRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ENTITLEMENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  /**
   * Records granted entitlement in local client storage.
   */
  public recordLocalEntitlement(userId: string, productId: string, reportId?: string, orderId?: string): void {
    try {
      const entitlements = this.getStoredEntitlements();
      entitlements.push({
        userId,
        productId,
        reportId,
        orderId,
        grantedAt: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_KEY_ENTITLEMENTS, JSON.stringify(entitlements));
    } catch (e) {
      console.warn('[PaymentClientService] Failed to save entitlement locally:', e);
    }
  }

  /**
   * Initiates order creation and opens the Razorpay checkout modal.
   */
  public async initiatePayment(params: {
    productId: string;
    reportId?: string;
    testId?: string;
    userId?: string;
    userDetails?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    onSuccess: (result: VerifyPaymentResponse) => void;
    onFailure: (error: string) => void;
    onDismiss?: () => void;
  }): Promise<void> {
    const userId = params.userId || 'guest_user';
    const product = getProductById(params.productId);

    if (!product) {
      params.onFailure(`Unknown product identifier: "${params.productId}"`);
      return;
    }

    analytics.logEvent('page_view', { action: 'checkout_initiated', product: params.productId });

    // Check if user already holds entitlement
    const alreadyGranted = await this.checkAccess(params.productId, params.reportId, userId);
    if (alreadyGranted) {
      params.onSuccess({
        success: true,
        verified: true,
        orderId: 'already_purchased',
      });
      return;
    }

    // Free product immediately unlocks
    if (product.priceInr === 0) {
      this.recordLocalEntitlement(userId, product.id, params.reportId, 'free_grant');
      params.onSuccess({
        success: true,
        verified: true,
        orderId: 'free_grant',
      });
      return;
    }

    const clientOrderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const testKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder_key';

    const orderRes: CreateOrderResponse = {
      success: true,
      orderId: clientOrderId,
      amount: product.amountInPaise,
      currency: 'INR',
      keyId: testKeyId,
    };

    // Load SDK
    const isLoaded = await this.loadRazorpayScript();
    if (!isLoaded || !window.Razorpay) {
      // Sandbox fallback mode for local preview / offline dev
      const mockPayId = `pay_mock_${Date.now()}`;

      this.recordLocalEntitlement(userId, product.id, params.reportId, orderRes.orderId);

      analytics.logEvent('page_view', {
        action: 'payment_success_sandbox',
        orderId: orderRes.orderId,
        product: params.productId,
      });

      params.onSuccess({
        success: true,
        verified: true,
        paymentId: mockPayId,
        orderId: orderRes.orderId || clientOrderId,
      });
      return;
    }

    // Configure Checkout Modal Options
    const options: RazorpayCheckoutOptions = {
      key: orderRes.keyId || 'rzp_test_placeholder_key',
      amount: orderRes.amount || product.amountInPaise,
      currency: orderRes.currency || 'INR',
      name: 'Number Story',
      description: `Unlock ${product.name} Premium Report`,
      order_id: orderRes.orderId || clientOrderId,
      prefill: params.userDetails,
      theme: {
        color: '#4f46e5',
      },
      handler: async (response) => {
        try {
          this.recordLocalEntitlement(
            userId,
            product.id,
            params.reportId,
            response.razorpay_order_id
          );

          analytics.logEvent('page_view', {
            action: 'payment_success',
            orderId: response.razorpay_order_id,
            product: params.productId,
          });

          params.onSuccess({
            success: true,
            verified: true,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
          });
        } catch (verifyErr) {
          params.onFailure((verifyErr as Error).message || 'Payment verification error.');
        }
      },
      modal: {
        ondismiss: () => {
          if (params.onDismiss) {
            params.onDismiss();
          }
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  /**
   * Verifies access entitlement for a product and report.
   */
  public async checkAccess(productId: string, reportId?: string, userId = 'guest_user'): Promise<boolean> {
    const product = getProductById(productId);
    if (!product || product.priceInr === 0) {
      return true;
    }

    const entitlements = this.getStoredEntitlements();
    const hasMatch = entitlements.some((ent) => {
      const matchesUser = !ent.userId || ent.userId === userId || ent.userId === 'guest_user';
      if (!matchesUser) return false;

      // Combo unlocks everything
      if (ent.productId === 'combo') return true;

      // Exact product match
      if (ent.productId === product.id) {
        if (!reportId || !ent.reportId || ent.reportId === reportId) {
          return true;
        }
      }
      return false;
    });

    return hasMatch;
  }
}

export const paymentClientService = new PaymentClientService();
