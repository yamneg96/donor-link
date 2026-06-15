import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

export function setupNotificationHandlers() {
  // Handle notification when app is running in foreground
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  // Handle click/response to notification
  const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    const type = data?.type;
    const id = data?.id;

    if (type && id) {
      switch (type) {
        case 'EMERGENCY':
        case 'REQUEST':
          router.push(`/request/${id}`);
          break;
        case 'CAMPAIGN':
          router.push(`/campaign/${id}`);
          break;
        case 'APPOINTMENT':
          router.push('/notifications');
          break;
        default:
          router.push('/notifications');
      }
    }
  });

  return () => subscription.remove();
}
