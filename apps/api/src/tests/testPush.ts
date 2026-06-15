import { Expo, ExpoPushMessage } from "expo-server-sdk";

// Create Expo SDK client
const expo = new Expo();

async function sendTestPush() {
  // 👇 Replace with your real Expo push token from the app
  const pushToken = "ExponentPushToken[xxxxxxxxxxxxxxxxxxxx]";

  // Validate token
  if (!Expo.isExpoPushToken(pushToken)) {
    throw new Error(`Invalid Expo push token: ${pushToken}`);
  }

  const messages: ExpoPushMessage[] = [
    {
      to: pushToken,
      sound: "default",
      title: "🔥 Test Notification",
      body: "This is a backend test push from DonorLink API",
      data: { type: "test" },
    },
  ];

  try {
    const chunks = expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      const tickets = await expo.sendPushNotificationsAsync(chunk);
      console.log("Tickets:", tickets);
    }
  } catch (error) {
    console.error("Push error:", error);
  }
}

sendTestPush();