import { Entitlement } from '../../../types/payment';
import { getProductById } from '../../../config/products';
import { paymentStorageService } from '../services/paymentStorageService';

export interface EntitlementCheckResult {
  hasAccess: boolean;
  isFree: boolean;
  entitlement?: Entitlement;
}

/**
 * Backend Entitlement Checker: Verifies whether a user has legitimate access to a premium product/report.
 */
export async function checkUserEntitlement(
  userId: string,
  productId: string,
  reportId?: string
): Promise<EntitlementCheckResult> {
  const product = getProductById(productId);

  // 1. Free products are always accessible
  if (!product || !product.premium || product.amountInPaise === 0) {
    const directEntitlement = await paymentStorageService.getEntitlement(
      userId,
      product?.id || productId,
      reportId
    );
    return {
      hasAccess: true,
      isFree: true,
      entitlement: directEntitlement || {
        id: `ent_${userId}_${product?.id || productId}`,
        userId,
        productId: product?.id || productId,
        sourcePaymentId: 'free_tier_grant',
        status: 'active',
        grantedAt: new Date().toISOString(),
        expiresAt: null,
      },
    };
  }

  // 2. Check direct entitlement for this product & report
  const directEntitlement = await paymentStorageService.getEntitlement(
    userId,
    product.id,
    reportId
  );

  if (directEntitlement && directEntitlement.status === 'active') {
    return {
      hasAccess: true,
      isFree: false,
      entitlement: directEntitlement,
    };
  }

  // 3. Check if user owns the superset 'combo' tier (which unlocks all features)
  if (product.id !== 'combo') {
    const comboEntitlement = await paymentStorageService.getEntitlement(
      userId,
      'combo',
      reportId
    );

    if (comboEntitlement && comboEntitlement.status === 'active') {
      return {
        hasAccess: true,
        isFree: false,
        entitlement: comboEntitlement,
      };
    }
  }

  return {
    hasAccess: false,
    isFree: false,
  };
}

export async function hasActiveEntitlement(
  userId: string,
  productId: string,
  reportId?: string
): Promise<boolean> {
  const result = await checkUserEntitlement(userId, productId, reportId);
  return result.hasAccess;
}

