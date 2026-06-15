import { eventBus, EventType } from '../events';
import { NotificationService } from '../../modules/notifications/services/notificationService';
import { Role } from '../constants';

export class NotificationSubscriber {
  static init() {
    // Listen for New Emergency Declarations
    eventBus.on(EventType.EMERGENCY_DECLARED, async (data) => {
      console.log('[NotificationSubscriber] Handling EMERGENCY_DECLARED');
      
      const payload = {
        title: '🚨 EMERGENCY BLOOD NEEDED',
        body: `Urgent demand for ${data.bloodTypes?.join(', ') || 'blood'} detected. Your donation can save lives now.`,
        type: 'EMERGENCY',
        data: { id: data.emergencyId, severity: data.severity }
      };

      // 1. Notify all donors
      await NotificationService.notifyDonors(payload);

      // 2. Notify all hospital staff (for coordination)
      await NotificationService.notifyHospitals({
        ...payload,
        title: '📢 BROADCAST: Emergency Blood Shortage',
        body: 'A national emergency has been declared. Please review stock levels and coordinate dispatches if available.'
      });
    });

    // Listen for New Campaigns
    eventBus.on(EventType.CAMPAIGN_TRIGGERED, async (data) => {
      console.log('[NotificationSubscriber] Handling CAMPAIGN_TRIGGERED');

      const payload = {
        title: '🩸 New Blood Drive: ' + (data.title || 'Support Lives'),
        body: `Join us at ${data.location || 'the coordination center'} for a life-saving campaign. Schedule your appointment today!`,
        type: 'CAMPAIGN',
        data: { id: data.campaignId }
      };

      // Notify all donors
      await NotificationService.notifyDonors(payload);
    });
    
    console.log('[NotificationSubscriber] Initialized and listening for events');
  }
}
