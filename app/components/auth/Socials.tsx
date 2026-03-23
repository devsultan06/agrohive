import React, { useEffect } from "react";
import { View, TouchableOpacity, Image, Alert } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Constants from "expo-constants";
import { useMutation } from "@tanstack/react-query";
import { requestGoogleLogin } from "../../services/auth/googleLogin.service";
import { registerForPushNotificationsAsync } from "../../services/notifications/pushNotifications.service";
import Toast from "react-native-toast-message";

export default function Socials({ navigation }: any) {
  const googleWebClientId = Constants.expoConfig?.extra?.googleWebClientId;
  const googleIosClientId = Constants.expoConfig?.extra?.googleIosClientId;

  useEffect(() => {
    if (googleWebClientId) {
      GoogleSignin.configure({
        webClientId: googleWebClientId,
        iosClientId: googleIosClientId,
        offlineAccess: true,
      });
    }
  }, [googleWebClientId, googleIosClientId]);

  const googleMutation = useMutation({
    mutationFn: requestGoogleLogin,
    onSuccess: (res) => {
      console.log("✅ Google Login successful:", res);
      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    },
    onError: (err: any) => {
      console.log("❌ Google Login failed:", err);
      Toast.show({
        type: "error",
        text1: "Google Sign-In Failed",
        text2: err.message || "An error occurred",
      });
    },
  });

  const handleGoogleLogin = async () => {
    if (!googleWebClientId || googleWebClientId.includes("your-google-web")) {
      Alert.alert(
        "Configuration Missing",
        "Google Web Client ID is not configured. Please add it to your .env file.",
      );
      return;
    }

    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        throw new Error("No ID Token received from Google");
      }

      // Try to get push token
      let fcmToken;
      try {
        fcmToken = await registerForPushNotificationsAsync();
      } catch (e) {
        console.warn("Could not get push token for Google Login", e);
      }

      googleMutation.mutate({ idToken, fcmToken });
    } catch (error: any) {
      console.log("Google Sign-In Error:", error);
      if (error.code !== "SIGN_IN_CANCELLED") {
        Alert.alert("Error", error.message || "Google Sign-In failed");
      }
    }
  };

  return (
    <View className="flex-row justify-center gap-5 mb-10">
      <TouchableOpacity
        className="bg-white rounded-lg h-[50px] w-[50px] items-center justify-center"
        style={{
          elevation: 3,
          boxShadow: "2px 2px 8px 0 rgba(146, 179, 189, 0.20)",
        }}
        onPress={handleGoogleLogin}
        disabled={googleMutation.isPending}
      >
        <Image
          source={require("../../assets/google.png")}
          className="w-6 h-6"
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-white rounded-lg h-[50px] w-[50px] items-center justify-center"
        style={{
          elevation: 3,
          boxShadow: "2px 2px 8px 0 rgba(146, 179, 189, 0.20)",
        }}
      >
        <Image
          source={require("../../assets/apple.png")}
          className="w-6 h-6"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}
