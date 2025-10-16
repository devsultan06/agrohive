import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";

export default function Socials({ navigation }: any) {
  return (
    <View style={styles.socialContainer}>
      <TouchableOpacity style={styles.socialButton}>
        <Image
          source={require("../../assets/google.png")}
          style={styles.socialIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.socialButton}>
        <Image
          source={require("../../assets/apple.png")}
          style={styles.socialIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 40,
  },
  socialButton: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 3,
    boxShadow: "2px 2px 8px 0 rgba(146, 179, 189, 0.20)",
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
