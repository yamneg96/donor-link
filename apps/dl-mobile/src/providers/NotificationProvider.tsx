import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { registerForPushNotificationsAsync } from '../notifications/registerPush';
import { setupNotificationHandlers } from '../notifications/notificationHandler';
import { notificationApi } from '../api/notifications';
import { useAuthStore } from '../store/authStore';

interface NotificationContextType {
  pushToken: string | null;
  notification: Notifications.Notification | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContent = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContent must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    // 1. Setup foreground and click handlers
    const cleanupHandlers = setupNotificationHandlers();

    // 2. Listen for incoming notifications when app is foregrounded
    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    // 3. Register for push notifications
    const registerToken = async () => {
      try {
        console.log('[NotificationProvider] Registering for push notifications...');
        const token = await registerForPushNotificationsAsync();
        
        if (token && isMounted) {
          setPushToken(token);
          // If authenticated, send token to backend
          if (isAuthenticated) {
            await notificationApi.savePushToken(token);
            console.log('[NotificationProvider] Push token saved to backend.');
          }
        }
      } catch (error) {
        console.error('[NotificationProvider] Registration failed:', error);
      }
    };

    registerToken();

    return () => {
      isMounted = false;
      cleanupHandlers();
      foregroundSubscription.remove();
    };
  }, [isAuthenticated]);

  return (
    <NotificationContext.Provider value={{ pushToken, notification }}>
      {children}
    </NotificationContext.Provider>
  );
};
