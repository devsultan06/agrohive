import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Socials from "./Socials";

export default function Login({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title}>Log in</Text>
        <Text style={styles.subtitle}>
          Enter details below to log in to account.
        </Text>
      </View>

      {/* Input Fields */}
      <View style={styles.form}>
        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Remember Me & Forgot Password */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.rememberContainer}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View
              style={[styles.checkbox, rememberMe && styles.checkboxActive]}
            >
              {rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.rememberText}>Remember me</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>

      {/* Divider */}
      <Text style={styles.orText}>Or Log in with</Text>

      <Socials />

      {/* Sign Up Link */}
      <Text style={styles.footerText}>
        Don't have an account?{" "}
        <Text
          style={styles.signupLink}
          onPress={() => navigation.navigate("CreateAccount")}
        >
          sign up
        </Text>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 36,
    marginBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Parkinsans-Bold",
    color: "#1D2939",
  },
  subtitle: {
    fontSize: 12,
    color: "#000000",
    fontFamily: "Poppins-Regular",
    opacity: 0.4,
    marginTop: 5,
    lineHeight: 14,
  },
  form: {
    marginBottom: 30,
  },
  label: {
    fontSize: 12,
    fontWeight: "400",
    color: "#000",
    fontFamily: "Poppins-Regular",
    marginBottom: 9,
  },
  input: {
    height: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#F2F2F2",
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 12,
    marginBottom: 20,
    fontSize: 14,
    color: "#000000",
    lineHeight: 20,
    fontFamily: "Poppins-Regular",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.51)",
    backgroundColor: "#fff",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: "#1C6206",
    borderColor: "#1C6206",
  },
  checkmark: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  rememberText: {
    fontSize: 14,
    lineHeight: 24,
    color: "#A0A4A8",
    fontFamily: "Poppins-Regular",
  },
  forgotText: {
    fontSize: 14,
    color: "#1C6206",
    fontFamily: "Poppins-Regular",
    fontWeight: "500",
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: "#1C6206",
    padding: 10,
    height: 56,
    borderRadius: 100,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Poppins-Regular",
  },
  orText: {
    textAlign: "center",
    color: "#000000",
    opacity: 0.5,
    fontFamily: "Poppins-Regular",
    marginBottom: 20,
    fontSize: 14,
  },
  footerText: {
    textAlign: "center",
    color: "rgba(0, 0, 0, 0.5)",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    fontWeight: "400",
  },
  signupLink: {
    color: "#1C6206",
    fontWeight: "500",
    fontFamily: "Poppins-SemiBold",
  },
});
