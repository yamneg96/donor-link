import { eventBus, EventType, DomainEvent } from '../events';
import { notificationService } from '../../infrastructure/services/notificationService';
import { logger } from '../../config';
import { User } from '../../modules/users/models/User';
import { Role } from '../constants';

/**
 * IntelligenceSubscriber
 * 
 * Listens for ML-driven events and triggers global integrations 
 * like push notifications, admin alerts, and automated campaigns.
 */
export class IntelligenceSubscriber {
  
  static initialize() {
    logger.info('[IntelligenceSubscriber] Initializing notification hooks...');

    // 1. Handle predicted shortages (Proactive Intervention)
    eventBus.onEvent(EventType.SHORTAGE_PREDICTED, async (event: DomainEvent) => {
      const { hospitalId, bloodType, riskLevel, riskScore, recommendation } = event.payload as any;
      
      if (riskLevel === 'high' || riskLevel === 'critical') {
        logger.info(`[IntelligenceSubscriber] Proactive alert for ${bloodType} at ${hospitalId}`);
        
        // Notify National Admins
        await notificationService.broadcastNotification(
          { role: Role.NATIONAL_ADMIN },
          `Predicted Shortage: ${bloodType}`,
          `AI models predict a high risk of ${bloodType} depletion at hospital ${hospitalId.slice(-6).toUpperCase()} within 48h.`,
          { type: 'AI_INSIGHT', hospitalId, bloodType, riskLevel }
        );
      }
    });

    // 2. Handle redistribution recommendations (Strategic Logistics)
    eventBus.onEvent(EventType.REDISTRIBUTION_RECOMMENDED, async (event: DomainEvent) => {
      const { target_hospital_id, blood_type, units_needed, recommendation } = event.payload as any;
      
      logger.info(`[IntelligenceSubscriber] Redistribution suggested for ${blood_type}`);

      // Notify Regional Admins responsible for this zone
      await notificationService.broadcastNotification(
        { role: Role.REGIONAL_ADMIN },
        'Strategic Logsitics Insight',
        `AI recommends moving ${units_needed} units of ${blood_type} to ${target_hospital_id.slice(-6).toUpperCase()} to optimize regional supply.`,
        { type: 'REDISTRIBUTION', recommendation }
      );
    });

    // 3. Handle actual emergency escalations (Immediate Action)
    eventBus.onEvent(EventType.EMERGENCY_ESCALATED, async (event: DomainEvent) => {
      const { hospitalId, bloodType, urgency, region } = event.payload as any;
      
      logger.info(`[IntelligenceSubscriber] ESCALATING EMERGENCY: ${bloodType} in ${region}`);

      // Notify all matching donors in the region
      await notificationService.broadcastNotification(
        { role: Role.DONOR, region, bloodType },
        'URGENT: Blood Needed Now',
        `An emergency shortage of ${bloodType} has been detected in your area. Your donation can save lives today.`,
        { type: 'EMERGENCY_CALL', hospitalId, bloodType, urgency }
      );
    });
    
    // 4. Handle anomaly detection (System Integrity)
    eventBus.onEvent(EventType.ANOMALY_DETECTED, async (event: DomainEvent) => {
      const { metricName, anomalyCount, criticalCount } = event.payload as any;
      
      if (criticalCount > 0) {
        await notificationService.broadcastNotification(
          { role: Role.SUPER_ADMIN },
          'System Integrity Alert',
          `Critical anomalies detected in ${metricName}. Possible sensor failure or supply chain breach.`,
          { type: 'SECURITY_ALERT', metricName, criticalCount }
        );
      }
    });
  }
}
