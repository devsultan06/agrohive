import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  ForgotPasswordSchemaType,
} from "../../schemas/forgotPasswordSchema";
import BackButton from "../../components/auth/BackButton";

export default function ForgotPassword({ navigation }: any) {
  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordSchemaType) => {
    console.log("✅ Forgot Password data:", data);
    navigation.navigate("EnterOTP");

    // handle OTP sending logic here
  };

  const onError = (errors: any) => {
    console.log("❌ Validation Errors:", errors);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/bg-app.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        <BackButton />

        <View style={styles.content}>
          <Text style={styles.title}>Forgot password?</Text>
          <Text style={styles.subtitle}>
            Enter your email address, and we’ll send a one-time code to verify
            your identity
          </Text>

          {/* Email Field */}
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => setValue("email", text)}
          />
          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}

          {/* Send OTP Button */}
          <TouchableOpacity
            style={[styles.button, isSubmitting && { opacity: 0.6 }]}
            onPress={handleSubmit(onSubmit, onError)}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
    paddingHorizontal: 24,
  },
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
  content: {
    marginTop: 55,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1D2939",
    textAlign: "center",
    fontFamily: "Parkinsans-Bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: "#000",
    opacity: 0.4,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    marginBottom: 40,
    width: "80%",
    marginHorizontal: "auto",
  },
  label: {
    fontSize: 12,
    color: "#000",
    marginBottom: 8,
    fontFamily: "Poppins-Regular",
  },
  input: {
    height: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#F2F2F2",
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#000",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1C6206",
    height: 56,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 346,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Poppins-Regular",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 12,
  },
});
