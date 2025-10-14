import React from "react";
import { View, Image, StyleSheet, ImageBackground, Text } from "react-native";
import { Dimensions } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      {/* Top half with background image */}
      <View style={styles.topSection}>
        <ImageBackground
          source={require("../assets/stroke.png")} // 👈 your background image
          style={styles.topSection}
          resizeMode="cover"
        >
          <Text style={styles.title}>Agrohive</Text>
          {/* <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          /> */}
        </ImageBackground>
      </View>

      {/* Bottom half (white background) */}
      <View style={styles.bottomSection}>
        {/* You can add text or buttons here later */}
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topSection: {
    width: "100%", // 👈 full width
    height: height * 0.6, // 👈 takes half the screen vertically
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#fff",
    fontSize: 61,
    fontWeight: 700,
    marginBottom: 20,
    fontFamily: "Parkinsans-Bold",
  },
  bottomSection: {
    flex: 1,
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
  },
});
