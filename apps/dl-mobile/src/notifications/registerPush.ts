import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { granted: existingGranted } = await Notifications.getPermissionsAsync() as any;
    let finalGranted = existingGranted;
    if (!existingGranted) {
      const { granted } = await Notifications.requestPermissionsAsync() as any;
      finalGranted = granted;
    }
    if (!finalGranted) {
      console.log('Failed to get push token for push notification!');
      return;
    }
    
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })).data;
    console.log("Push Token: ", token);
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}
