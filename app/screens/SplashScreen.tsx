import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { View, Image, StyleSheet, ImageBackground, Text } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RootStackParamList = {
  Auth: { screen: string } | undefined;
  Main: undefined;
};

interface SplashScreenProps {
  onLayoutRootView?: () => void;
}

export default function SplashScreen({ onLayoutRootView }: SplashScreenProps) {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "Auth">>();

  useEffect(() => {
    const checkNavigation = async () => {
      try {
        const token = await SecureStore.getItemAsync("token");
        const hasCompletedOnboarding = await AsyncStorage.getItem(
          "onboarding_completed",
        );

        // Artificial delay for splash visibility
        await new Promise((resolve) => setTimeout(resolve, 3000));

        if (token) {
          navigation.replace("Main");
        } else if (hasCompletedOnboarding === "true") {
          navigation.replace("Auth", { screen: "Login" });
        } else {
          navigation.replace("Auth", { screen: "Onboarding" });
        }
      } catch (error) {
        console.error("Navigation error:", error);
        navigation.replace("Auth");
      }
    };

    checkNavigation();
  }, [navigation]);

  useEffect(() => {
    onLayoutRootView?.(); // call the callback to hide splash
  }, []);

  return (
    <View className="flex-1" onLayout={onLayoutRootView}>
      <View className="h-[100%] w-[100%] bg-white items-center justify-center">
        <ImageBackground
          source={require("../assets/splash.png")}
          className="h-[100%] w-[100%] bg-white items-center justify-center"
          resizeMode="cover"
        >
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text className="text-white mb-[12px]  text-[32px] font-[700] font-[Parkinsans-Bold]">
            Agrohive
          </Text>
          <Text className="text-white text-center text-[16px] w-[60%] mb-[20px]  font-[400] font-[Parkinsans-Regular]">
            Harvesting hope, one farmer at a time
          </Text>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 126,
    height: 111,
  },
});
