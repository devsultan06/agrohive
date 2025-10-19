import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Socials from "../../components/auth/Socials";
import { loginSchema, LoginSchemaType } from "../../schemas/loginSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Login({ navigation }: any) {
  const [rememberMe, setRememberMe] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  // Load saved credentials on component mount
  useEffect(() => {
    loadSavedCredentials();
  }, []);

  const loadSavedCredentials = async () => {
    try {
      const savedCredentials = await AsyncStorage.getItem("loginCredentials");
      if (savedCredentials) {
        const { email, rememberMe: savedRememberMe } =
          JSON.parse(savedCredentials);
        if (savedRememberMe) {
          setValue("email", email);
          setRememberMe(true);
          console.log("✅ Loaded saved email");
        }
      }
    } catch (error) {
      console.log("❌ Error loading saved credentials:", error);
    }
  };

  const saveCredentials = async (email: string, rememberMe: boolean) => {
    try {
      if (rememberMe) {
        const credentials = {
          email,
          rememberMe: true,
        };
        await AsyncStorage.setItem(
          "loginCredentials",
          JSON.stringify(credentials)
        );
        console.log("✅ Email saved");
      } else {
        // Remove saved credentials if remember me is unchecked
        await AsyncStorage.removeItem("loginCredentials");
        console.log("✅ Saved email removed");
      }
    } catch (error) {
      console.log("❌ Error saving credentials:", error);
    }
  };

  const onSubmit = async (data: LoginSchemaType) => {
    console.log("✅ Form data:", data);

    // Save only email if remember me is checked
    await saveCredentials(data.email, rememberMe);

    // You can now call your API to login
  };

  const onError = (errors: any) => {
    console.log("❌ Form validation errors:", errors);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/bg-app.png")}
        style={styles.topSection}
        resizeMode="cover"
      >
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
            onChangeText={(text) => setValue("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#999"
            secureTextEntry
            onChangeText={(text) => setValue("password", text)}
          />
          {errors.password && (
            <Text style={styles.error}>{errors.password.message}</Text>
          )}

          {/* Remember Me & Forgot Password */}
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.rememberContainer}
              onPress={() => {
                const newRememberMe = !rememberMe;
                setRememberMe(newRememberMe);

                // If unchecking remember me, clear saved credentials
                if (!newRememberMe) {
                  AsyncStorage.removeItem("loginCredentials");
                  console.log("✅ Cleared saved credentials");
                }
              }}
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
        <TouchableOpacity
          style={[styles.loginButton, isSubmitting && { opacity: 0.6 }]}
          onPress={handleSubmit(onSubmit, onError)}
          disabled={isSubmitting}
        >
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
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  topSection: {
    width: "100%",
    height: "100%",
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
  error: { color: "red", fontSize: 12, marginBottom: 12 },
});
