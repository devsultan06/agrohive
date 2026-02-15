import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
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
  const [showPassword, setShowPassword] = useState(false);

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
          JSON.stringify(credentials),
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

    // Navigate to Main screen (reset history so user can't go back to login)
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
  };

  const onError = (errors: any) => {
    console.log("❌ Form validation errors:", errors);
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6">
      <ImageBackground
        source={require("../../assets/bg-app.png")}
        className="flex-1 w-full h-full"
        resizeMode="cover"
      >
        {/* Title */}
        <View className="items-center mt-9 mb-10">
          <Text className="text-[16px] font-bold text-[#1D2939] font-parkinsans-bold">
            Log in
          </Text>
          <Text className="text-[12px] text-black opacity-40 mt-[5px] font-poppins leading-[14px]">
            Enter details below to log in to account.
          </Text>
        </View>

        {/* Input Fields */}
        <View className="mb-[30px]">
          <Text className="text-[12px] text-black mb-[9px] font-poppins">
            Email address
          </Text>
          <TextInput
            className="h-[48px] rounded-md border border-[#F2F2F2] bg-[#FAFAFA] px-[12px] text-[14px] font-poppins text-black mb-[10px]"
            placeholder="Enter email address"
            placeholderTextColor="#999"
            onChangeText={(text) => setValue("email", text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && (
            <Text className="text-red-500 text-xs mb-3">
              {errors.email.message}
            </Text>
          )}

          <Text className="text-[12px] text-black mb-[9px] font-poppins">
            Password
          </Text>
          <View className="flex-row items-center border border-[#F2F2F2] bg-[#FAFAFA] rounded-md px-[12px] mb-[10px] h-[48px]">
            <TextInput
              className="flex-1 text-[14px] text-black font-poppins leading-5"
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
                className="w-6 h-6"
              />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text className="text-red-500 text-xs mb-3">
              {errors.password.message}
            </Text>
          )}

          {/* Remember Me & Forgot Password */}
          <View className="flex-row justify-between items-center mb-8">
            <TouchableOpacity
              className="flex-row items-center"
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
                className={`w-5 h-5 rounded-md border border-black/50 bg-white mr-2 justify-center items-center ${
                  rememberMe ? "bg-[#1C6206] border-[#1C6206]" : ""
                }`}
              >
                {rememberMe && (
                  <Text className="text-white text-[10px] font-bold">✓</Text>
                )}
              </View>
              <Text className="text-[14px] text-[#A0A4A8] font-poppins leading-6">
                Remember me
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text className="text-[14px] text-[#1C6206] font-bold font-[500] font-poppins leading-6">
                Forgot password?
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          className={`bg-[#1C6206] h-[56px] rounded-full justify-center items-center mb-[30px] ${
            isSubmitting ? "opacity-60" : ""
          }`}
          onPress={handleSubmit(onSubmit, onError)}
          disabled={isSubmitting}
        >
          <Text className="text-white text-[16px] font-medium font-poppins">
            Log in
          </Text>
        </TouchableOpacity>

        {/* Divider */}
        <Text className="text-center text-black opacity-50 font-poppins mb-[30px] text-[14px]">
          Or Log in with
        </Text>

        <Socials />

        {/* Sign Up Link */}
        <Text className="text-center text-black/50 text-[12px] font-poppins">
          Don't have an account?{" "}
          <Text
            className="text-[#1C6206] font-poppins-semibold font-medium"
            onPress={() => navigation.navigate("CreateAccount")}
          >
            sign up
          </Text>
        </Text>
      </ImageBackground>
    </SafeAreaView>
  );
}
