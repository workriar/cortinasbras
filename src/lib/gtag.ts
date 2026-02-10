/**
 * Google Analytics / Google Ads Tracking Utilities
 * 
 * Centralizes gtag event tracking for type-safety and reusability
 */

// Extend Window interface to include gtag
declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

/**
 * Track lead conversion event in Google Ads
 * 
 * Fires when a new lead is successfully submitted through any form
 * Conversion ID: AW-17672945118/1K53CJyU4d4bEN77jutB
 * 
 * @example
 * ```typescript
 * // After successful form submission
 * trackLeadConversion();
 * ```
 */
export function trackLeadConversion() {
    if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'conversion', {
            'send_to': 'AW-17672945118/1K53CJyU4d4bEN77jutB'
        });

        if (process.env.NODE_ENV === 'development') {
            console.log('📊 Google Ads Conversion tracked: AW-17672945118/1K53CJyU4d4bEN77jutB');
        }
    } else if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ gtag not available - conversion tracking skipped');
    }
}
