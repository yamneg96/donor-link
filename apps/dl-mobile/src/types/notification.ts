export enum NotificationType {
  EMERGENCY = 'EMERGENCY',
  CAMPAIGN = 'CAMPAIGN',
  APPOINTMENT = 'APPOINTMENT',
  ELIGIBILITY = 'ELIGIBILITY',
  ACHIEVEMENT = 'ACHIEVEMENT',
  GENERAL = 'GENERAL',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}
