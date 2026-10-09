export type AnalyticsEventType =
  | 'page_view'
  | 'number_analysis_start'
  | 'number_analysis_started'
  | 'number_analysis_complete'
  | 'number_analysis_completed'
  | 'personality_test_start'
  | 'personality_test_started'
  | 'personality_test_complete'
  | 'personality_test_completed'
  | 'theme_card_clicked'
  | 'tier_selected'
  | 'premium_cta_clicked'
  | 'checkout_viewed'
  | 'checkout_initiated'
  | 'share_clicked';

export interface AnalyticsEventPayload {
  eventName: AnalyticsEventType;
  properties?: Record<string, string | number | boolean | null | undefined>;
  timestamp?: string;
}

class AnalyticsService {
  private _isInitialized = false;

  public init() {
    this._isInitialized = true;
    if (import.meta.env.DEV) {
      console.log('📊 [AnalyticsService] Initialized in development mode.', this._isInitialized);
    }
  }

  public logEvent(
    eventName: AnalyticsEventType,
    properties?: Record<string, string | number | boolean | null | undefined>
  ) {
    const payload: AnalyticsEventPayload = {
      eventName,
      properties,
      timestamp: new Date().toISOString(),
    };

    if (import.meta.env.DEV) {
      console.log(`📊 [Analytics Event]: ${eventName}`, properties || {});
    }

    // Future integration with Firebase Analytics or GA4
    try {
      if (
        typeof window !== 'undefined' &&
        (window as unknown as { gtag?: (type: string, name: string, props?: unknown) => void }).gtag
      ) {
        (window as unknown as { gtag: (type: string, name: string, props?: unknown) => void }).gtag(
          'event',
          eventName,
          properties
        );
      }
    } catch {
      // safe fallback
    }

    return payload;
  }
}

export const analytics = new AnalyticsService();
