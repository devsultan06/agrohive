import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
    <SafeAreaView className="flex-1 bg-white">
      <ImageBackground
        source={require("../../assets/bg-app.png")}
        className="flex-1 w-full h-full px-6"
        resizeMode="cover"
      >
        <TouchableOpacity
          className="mt-10 flex-row items-center gap-[5px]"
          onPress={() => navigation.navigate("Login")}
        >
          <Image
            source={require("../../assets/arrow-left.png")}
            className="w-6 h-6"
          />
          <Text className="text-sm text-black font-poppins">Back to login</Text>
        </TouchableOpacity>
        <View className="mt-[55px]">
          <Text className="text-xl font-bold text-[#1D2939] text-center font-parkinsans-bold mb-2">
            Forgot password?
          </Text>
          <Text className="text-xs text-black opacity-40 text-center font-poppins mb-10 w-[80%] mx-auto">
            Enter your email address, and we’ll send a one-time code to verify
            your identity
          </Text>

          {/* Email Field */}
          <Text className="text-xs text-black mb-2 font-poppins">
            Email address
          </Text>
          <TextInput
            className="h-12 rounded-md border border-[#F2F2F2] bg-[#FAFAFA] px-3 text-sm font-poppins text-black mb-5"
            placeholder="Enter email address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={(text) => setValue("email", text)}
          />
          {errors.email && (
            <Text className="text-red-500 text-xs mb-3">
              {errors.email.message}
            </Text>
          )}

          {/* Send OTP Button */}
          <TouchableOpacity
            className={`bg-[#1C6206] h-14 rounded-full justify-center items-center mt-[346px] ${
              isSubmitting ? "opacity-60" : ""
            }`}
            onPress={handleSubmit(onSubmit, onError)}
            disabled={isSubmitting}
          >
            <Text className="text-white text-base font-medium font-poppins">
              Send OTP
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
