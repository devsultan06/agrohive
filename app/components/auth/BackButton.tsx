import React from "react";
import { StyleSheet, TouchableOpacity, Image, Text } from "react-native";

export default function BackButton({ navigation }: any) {
  return (
    <TouchableOpacity
      style={styles.backContainer}
      onPress={() => navigation.navigate("Login")}
    >
      <Image
        source={require("../../assets/arrow-left.png")}
        style={styles.arrowIcon}
      />
      <Text style={styles.backText}>Back to login</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  arrowIcon: {
    width: 24,
    height: 24,
  },
  backContainer: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  backText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Poppins-Regular",
  },
});
