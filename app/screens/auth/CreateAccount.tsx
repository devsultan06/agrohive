import React, { useState } from "react";
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
import Socials from "../../components/auth/Socials";
import {
  registerSchema,
  RegisterSchemaType,
} from "../../schemas/registerSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SuccessModal from "../../components/auth/SuccessModal";

export default function CreateAccount({ navigation }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterSchemaType) => {
    console.log("✅ Form data:", data);
    setShowModal(true);

    // You can now call your API to create the account
  };

  const onError = (errors: any) => {
    console.log("❌ Form validation errors:", errors);
  };

  const handleGoToLogin = () => {
    setShowModal(false);
    navigation.navigate("Login");
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
            onChangeText={(text) => setValue("name", text)}
          />
          {errors.name && (
            <Text style={styles.error}>{errors.name.message}</Text>
          )}

          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            onChangeText={(text) => setValue("email", text)}
          />
          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}

          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input2, { flex: 1 }]}
              placeholder="Enter password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              onChangeText={(text) => setValue("password", text)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Image
                source={
                  showPassword
                    ? require("../../assets/off.png")
                    : require("../../assets/on.png")
                }
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>

          {errors.password && (
            <Text style={styles.error}>{errors.password.message}</Text>
          )}
        </View>

        {/* Create Account Button */}
        <TouchableOpacity
          style={[styles.createButton, isSubmitting && { opacity: 0.6 }]}
          onPress={handleSubmit(onSubmit, onError)}
          disabled={isSubmitting}
        >
          <Text style={styles.createButtonText}>Create account</Text>
          <Image
            source={require("../../assets/User-plus.png")}
            style={{ width: 22, height: 22 }}
          />
        </TouchableOpacity>

        {/* Divider */}
        <Text style={styles.orText}>Or sign up with</Text>

        <Socials />

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

        <SuccessModal
          message="You have successfully created your account"
          visible={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleGoToLogin}
        />
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
  header: {
    alignItems: "center",
    marginTop: 20,
  },
  topSection: {
    width: "100%",
    height: "100%",
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F2F2F2",
    backgroundColor: "#FAFAFA",
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 10,
    height: 48,
  },

  eyeIcon: {
    width: 24,
    height: 24,
  },

  input: {
    height: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#F2F2F2",
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 12,
    marginBottom: 10,
    fontSize: 14,
    color: "#000000",
    lineHeight: 20,
    fontFamily: "Poppins-Regular",
  },

  input2: {
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
  error: { color: "red", fontSize: 12, marginBottom: 12 },
});
