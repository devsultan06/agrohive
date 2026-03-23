import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import {
  registerForPushNotificationsAsync,
  updateFcmToken,
} from "../services/notifications/pushNotifications.service";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

import { useNavigation } from "@react-navigation/native";

export const usePushNotifications = (isAuthenticated: boolean) => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const navigation = useNavigation<any>();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      registerForPushNotificationsAsync().then((token) => {
        if (token) {
          setExpoPushToken(token);
          updateFcmToken(token);
        }
      });

      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          console.log("Notification Received:", notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log("Notification Tapped:", response);
          const data = response.notification.request.content.data;

          if (data?.screen) {
            if (data.screen === "Marketplace") {
              // Map legacy "Marketplace" name to our current tab name "Market"
              navigation.navigate("Market");
            } else {
              navigation.navigate(data.screen, data.params);
            }
          }
        });

      return () => {
        if (notificationListener.current) {
          notificationListener.current.remove();
        }
        if (responseListener.current) {
          responseListener.current.remove();
        }
      };
    }
  }, [isAuthenticated]);

  return { expoPushToken };
};
