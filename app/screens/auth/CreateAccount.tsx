import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
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
    <SafeAreaView className="flex-1 bg-white px-6">
      <ImageBackground
        source={require("../../assets/bg-app.png")}
        className="w-full h-full"
        resizeMode="cover"
      >
        {/* Title */}
        <View className="items-center mt-5">
          <Text className="text-xl font-bold font-parkinsans-bold text-[#1D2939]">
            Create account
          </Text>
          <Text className="text-xs text-black opacity-40 font-poppins mt-[5px] leading-[14px]">
            Enter details below to create an account.
          </Text>
        </View>

        {/* Profile Image */}
        <View className="self-center my-5 relative">
          <Image
            source={{
              uri: "https://i.pravatar.cc/150?img=12",
            }}
            className="w-[90px] h-[90px] rounded-[74px]"
          />
          <TouchableOpacity className="absolute bottom-0 right-0 h-[29px] bg-white rounded-[74px] p-[7px] shadow-sm">
            <Image
              source={require("../../assets/Camera.png")}
              className="w-[17px] h-[17px]"
            />
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <View className="mb-5 mt-[23px]">
          <Text className="text-xs text-black font-poppins mb-[9px]">Name</Text>
          <TextInput
            className="h-12 rounded-md border border-[#F2F2F2] bg-[#FAFAFA] px-3 mb-[10px] text-sm text-black font-poppins leading-5"
            placeholder="Enter your full name here"
            placeholderTextColor="#999"
            onChangeText={(text) => setValue("name", text)}
          />
          {errors.name && (
            <Text className="text-red-500 text-xs mb-3">
              {errors.name.message}
            </Text>
          )}

          <Text className="text-xs text-black font-poppins mb-[9px]">
            Email address
          </Text>
          <TextInput
            className="h-12 rounded-md border border-[#F2F2F2] bg-[#FAFAFA] px-3 mb-[10px] text-sm text-black font-poppins leading-5"
            placeholder="Enter email address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            onChangeText={(text) => setValue("email", text)}
          />
          {errors.email && (
            <Text className="text-red-500 text-xs mb-3">
              {errors.email.message}
            </Text>
          )}

          <Text className="text-xs text-black font-poppins mb-[9px]">
            Password
          </Text>
          <View className="flex-row items-center border border-[#F2F2F2] bg-[#FAFAFA] rounded-md px-3 mb-[10px] h-12">
            <TextInput
              className="flex-1 text-sm text-black font-poppins leading-5"
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
        </View>

        {/* Create Account Button */}
        <TouchableOpacity
          className={`flex-row items-center justify-center bg-[#1C6206] p-[10px] h-14 rounded-full mb-5 gap-2 ${
            isSubmitting ? "opacity-60" : ""
          }`}
          onPress={handleSubmit(onSubmit, onError)}
          disabled={isSubmitting}
        >
          <Text className="text-white text-base font-medium font-poppins">
            Create account
          </Text>
          <Image
            source={require("../../assets/User-plus.png")}
            className="w-[22px] h-[22px]"
          />
        </TouchableOpacity>

        {/* Divider */}
        <Text className="text-center text-black opacity-50 font-poppins mb-[14px]">
          Or sign up with
        </Text>

        <Socials />

        {/* Login Link */}
        <Text className="text-center text-black/50 text-xs mt-2.5 font-poppins">
          Already have an account?{" "}
          <Text
            className="text-[#1C6206] font-medium font-poppins-semibold"
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
