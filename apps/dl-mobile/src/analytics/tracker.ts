export type AnalyticsEvent = 
  | { name: 'login'; params: { method: 'email' | 'biometric' | 'google' } }
  | { name: 'registration'; params: { step: number } }
  | { name: 'donation_booking'; params: { hospitalId: string; bloodType: string } }
  | { name: 'emergency_response'; params: { requestId: string } }
  | { name: 'campaign_join'; params: { campaignId: string } }
  | { name: 'referral'; params: { code: string } };

export const tracker = {
  trackEvent: (event: AnalyticsEvent) => {
    console.log(`[Analytics] Event: ${event.name}`, event.params);
    // Integrate with Firebase/Mixpanel here
  },
  
  trackScreen: (screenName: string) => {
    console.log(`[Analytics] Screen: ${screenName}`);
  },
};
