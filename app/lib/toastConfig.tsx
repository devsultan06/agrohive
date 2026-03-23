import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ToastConfig } from "react-native-toast-message";
import { Feather } from "@expo/vector-icons";

export const toastConfig: ToastConfig = {
  success: (props) => (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: "#1C6206" }]}>
        <Feather name="check" size={18} color="white" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{props.text1}</Text>
        <Text style={styles.message}>{props.text2}</Text>
      </View>
    </View>
  ),

  error: (props) => (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: "#ef4444" }]}>
        <Feather name="alert-circle" size={18} color="white" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{props.text1}</Text>
        <Text style={styles.message}>{props.text2}</Text>
      </View>
    </View>
  ),

  info: (props) => (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: "#3b82f6" }]}>
        <Feather name="info" size={18} color="white" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{props.text1}</Text>
        <Text style={styles.message}>{props.text2}</Text>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 4,
    marginTop: 10,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontFamily: "Parkinsans-Bold",
    color: "#1D2939",
    marginBottom: 1,
  },
  message: {
    fontSize: 13,
    fontFamily: "Poppins-Regular",
    color: "#667085",
  },
});
