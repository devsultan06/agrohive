import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Onboarding from "../components/onboarding/Onboard";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <Onboarding />
      </View>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topSection: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
