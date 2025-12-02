import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { View, Image, StyleSheet, ImageBackground, Text } from "react-native";

type RootStackParamList = {
  Onboarding: undefined;
};

interface SplashScreenProps {
  onLayoutRootView?: () => void;
}

export default function SplashScreen({ onLayoutRootView }: SplashScreenProps) {
  const navigation =
    useNavigation<StackNavigationProp<RootStackParamList, "Onboarding">>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate("Onboarding");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigation]);

  useEffect(() => {
    onLayoutRootView?.(); // call the callback to hide splash
  }, []);
  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <View style={styles.topSection}>
        <ImageBackground
          source={require("../assets/splash.png")}
          style={styles.topSection}
          resizeMode="cover"
        >
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Agrohive</Text>
          <Text style={styles.subtitle}>
            Harvesting hope, one farmer at a time
          </Text>
        </ImageBackground>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 12,
    fontFamily: "Parkinsans-Bold",
  },
  subtitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 400,
    marginBottom: 20,
    fontFamily: "Parkinsans-Regular",
    width: "60%",
    textAlign: "center",
  },

  logo: {
    width: 126,
    height: 111,
  },
});
