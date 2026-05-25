import { Expo } from "expo-server-sdk";

const expo = new Expo();

export const sendPushNotifications = async (tokens, { title, body, data = {} }) => {
  const messages = tokens
    .filter((token) => Expo.isExpoPushToken(token))
    .map((token) => ({ to: token, sound: "default", title, body, data }));

  if (!messages.length) return;

  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    try {
      await expo.sendPushNotificationsAsync(chunk);
    } catch {
      console.error("Push notification chunk failed");
    }
  }
};
