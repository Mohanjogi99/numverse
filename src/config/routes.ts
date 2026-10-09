export const ROUTES = {
  HOME: '/',
  NUMBER_ANALYSIS: '/number-analysis',
  NUMBER_RESULT: '/number-result/:id',
  PERSONALITY_TEST: '/personality-test',
  PERSONALITY_TEST_TIER: '/personality-test/:tier',
  PERSONALITY_RESULT: '/personality-result/:id',
  CHECKOUT: '/checkout/:productId',
  PAYMENT_SUCCESS: '/payment-success',
  PAYMENT_FAILED: '/payment-failed',
  REPORT: '/report/:id',
  SHARE: '/share/:id',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  ABOUT: '/about',
  PERSONALITY_TYPES: '/personality-types',
  PERSONALITY_TYPE_DETAIL: '/personality-types/:type',
  NUMBER_DETAIL: '/number/:number',

  // Admin Routes (Protected Architecture)
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_QUESTIONS: '/admin/questions',
  ADMIN_NUMBERS: '/admin/numbers',
  ADMIN_PERSONALITY_TYPES: '/admin/personality-types',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_REPORTS: '/admin/reports',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_ANALYTICS: '/admin/analytics',
  ADMIN_AI: '/admin/ai',
  ADMIN_AUDIT_LOGS: '/admin/audit-logs',
  ADMIN_SETTINGS: '/admin/settings',
} as const;

export const buildNumberResultUrl = (id: string) => `/number-result/${id}`;
export const buildPersonalityResultUrl = (id: string) => `/personality-result/${id}`;
export const buildReportUrl = (id: string) => `/report/${id}`;
export const buildShareUrl = (id: string) => `/share/${id}`;
export const buildNumberDetailUrl = (num: number) => `/number/${num}`;
export const buildPersonalityTierUrl = (tier: string) => `/personality-test/${tier}`;
export const buildPersonalityTypeUrl = (type: string) => `/personality-types/${type}`;
export const buildCheckoutUrl = (productId: string) => `/checkout/${productId}`;
