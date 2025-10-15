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

export default function CreateAccount({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>
          Enter details below to create an account.
        </Text>
      </View>

      {/* Profile Image */}
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: "https://i.pravatar.cc/150?img=12",
          }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.cameraButton}>
          <Image
            source={require("../../assets/Camera.png")}
            style={{ width: 17, height: 17 }}
          />
        </TouchableOpacity>
      </View>

      {/* Input Fields */}
      <View style={styles.form}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name here"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
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
      </View>

      {/* Create Account Button */}
      <TouchableOpacity style={styles.createButton}>
        <Text style={styles.createButtonText}>Create account</Text>
        <Image
          source={require("../../assets/User-plus.png")}
          style={{ width: 22, height: 22 }}
        />
      </TouchableOpacity>

      {/* Divider */}
      <Text style={styles.orText}>Or sign up with</Text>

      {/* Social Buttons */}
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

      {/* Login Link */}
      <Text style={styles.footerText}>
        Already have an account?{" "}
        <Text
          style={styles.loginLink}
          onPress={() => navigation.navigate("Login")}
        >
          Log in
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
    marginTop: 20,
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
  avatarContainer: {
    alignSelf: "center",
    marginVertical: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 74,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    height: 29,
    boxShadow: "0 0 2.227px 0.742px rgba(123, 162, 183, 0.08)",
    backgroundColor: "#FFFFFF",
    borderRadius: 74,
    padding: 7,
  },
  form: {
    marginBottom: 20,
    marginTop: 23,
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
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1C6206",
    padding: 10,
    height: 56,
    borderRadius: 100,
    marginBottom: 20,
    gap: 8,
  },
  createButtonText: {
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
    marginBottom: 14,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginBottom: 20,
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
  footerText: {
    textAlign: "center",
    color: "rgba(0, 0, 0, 0.5)",
    fontSize: 12,
    marginTop: 10,
    fontFamily: "Poppins-Regular",
    fontWeight: "400",
  },
  loginLink: {
    color: "#1C6206",
    fontWeight: 500,
    fontFamily: "Poppins-SemiBold",
  },
});
