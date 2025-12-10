import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { View, Image, StyleSheet, ImageBackground, Text } from "react-native";

type RootStackParamList = {
  Auth: undefined;
};

interface SplashScreenProps {
  onLayoutRootView?: () => void;
}

export default function SplashScreen({ onLayoutRootView }: SplashScreenProps) {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "Auth">>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Auth");
    }, 4000);

    return () => clearTimeout(timer);
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
