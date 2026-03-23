import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import Socials from "../../components/auth/Socials";
import {
  registerSchema,
  RegisterSchemaType,
} from "../../schemas/registerSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SuccessModal from "../../components/auth/SuccessModal";
import { useMutation } from "@tanstack/react-query";
import { requestRegister } from "../../services/auth/register.service";

import * as ImagePicker from "expo-image-picker";

export default function CreateAccount({ navigation }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  const handleProfilePicturePress = () => {
    Alert.alert("Update Profile Picture", "Choose an option", [
      {
        text: "Camera",
        onPress: () => openCamera(),
      },
      {
        text: "Photo Library",
        onPress: () => openImageLibrary(),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const openCamera = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();

    if (!granted) {
      Alert.alert(
        "Permission Required",
        "Camera permission is required to take photos.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const openImageLibrary = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!granted) {
      Alert.alert(
        "Permission Required",
        "Photo library permission is required to select photos.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const registerMutation = useMutation({
    mutationFn: requestRegister,
    onSuccess: (res) => {
      console.log("✅ Registration successful:", res);
      navigation.navigate("EnterOTP", {
        email: res.email,
        context: "register",
      });
    },
    onError: (err: any) => {
      console.log("❌ Registration failed:", err);
      Toast.show({
        type: "error",
        text1: "Registration Failed",
        text2: err.message || "Something went wrong",
      });
    },
  });

  const onSubmit = (data: RegisterSchemaType) => {
    let imageObj = undefined;
    if (image) {
      const match = /\.(\w+)$/.exec(image);
      const type = match ? `image/${match[1]}` : `image`;
      imageObj = {
        uri: image,
        name: `profile.${match ? match[1] : "jpg"}`,
        type,
      };
    }

    registerMutation.mutate({
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      phone: data.phone,
      location: data.location,
      bio: data.bio,
      image: imageObj,
    });
  };

  const onError = (errors: any) => {
    console.log("❌ Form validation errors:", errors);
  };

  return (
    <View className="flex-1">
      <ImageBackground
        source={require("../../assets/bg-app.png")}
        className="flex-1"
        resizeMode="cover"
      >
        <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            <ScrollView
              className="flex-1 px-6"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 60 }}
            >
              {/* Title */}
              <View className="items-center mt-5">
                <Text className="text-[16px] font-bold font-parkinsans-bold text-[#1D2939]">
                  Create account
                </Text>
                <Text className="text-[12px] text-black opacity-40 font-poppins mt-[5px] leading-[14px]">
                  Enter details below to create an account.
                </Text>
              </View>

              {/* Profile Image */}
              <View className="self-center my-8 relative">
                <View className="w-[100px] h-[100px] rounded-full bg-white overflow-hidden items-center justify-center">
                  <Image
                    source={{
                      uri: image || "https://avatar.iran.liara.run/public/31",
                    }}
                    className="w-full h-full"
                  />
                </View>
                <TouchableOpacity
                  className="absolute bottom-0 right-0 w-[32px] h-[32px] bg-white rounded-full p-[7px] shadow-md items-center justify-center border border-gray-100"
                  onPress={handleProfilePicturePress}
                >
                  <Image
                    source={require("../../assets/Camera.png")}
                    className="w-[18px] h-[18px]"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              {/* Input Fields */}
              <View className="mb-5">
                <Text className="text-[12px] text-black font-poppins mb-[9px]">
                  Full Name
                </Text>
                <TextInput
                  className="h-[48px] rounded-md border border-[#F2F2F2] bg-[#FAFAFA] px-[12px] mb-[20px] text-[14px] text-black font-poppins leading-5"
                  placeholder="Enter your full name here"
                  placeholderTextColor="#999"
                  onChangeText={(text) => setValue("fullName", text)}
                />
                {errors.fullName && (
                  <Text className="text-red-500 text-xs mb-3">
                    {errors.fullName.message}
                  </Text>
                )}

                <Text className="text-[12px] text-black font-poppins mb-[9px]">
                  Email address
                </Text>
                <TextInput
                  className="h-[48px] rounded-md border border-[#F2F2F2] bg-[#FAFAFA] px-[12px] mb-[20px] text-[14px] text-black font-poppins leading-5"
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

                <Text className="text-[12px] text-black font-poppins mb-[9px]">
                  Password
                </Text>
                <View className="flex-row items-center border border-[#F2F2F2] bg-[#FAFAFA] rounded-md px-[12px] mb-[20px] h-[48px]">
                  <TextInput
                    className="flex-1 text-[14px] text-black font-poppins leading-5"
                    placeholder="Enter password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    onChangeText={(text) => setValue("password", text)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
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

                <Text className="text-[12px] text-black font-poppins mb-[9px]">
                  Phone (Optional)
                </Text>
                <TextInput
                  className="h-[48px] rounded-md border border-[#F2F2F2] bg-[#FAFAFA] px-[12px] mb-[20px] text-[14px] text-black font-poppins leading-5"
                  placeholder="Enter phone number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  onChangeText={(text) => setValue("phone", text)}
                />

                <Text className="text-[12px] text-black font-poppins mb-[9px]">
                  Location (Optional)
                </Text>
                <TextInput
                  className="h-[48px] rounded-md border border-[#F2F2F2] bg-[#FAFAFA] px-[12px] mb-[20px] text-[14px] text-black font-poppins leading-5"
                  placeholder="E.g., Lagos, Nigeria"
                  placeholderTextColor="#999"
                  onChangeText={(text) => setValue("location", text)}
                />

                <Text className="text-[12px] text-black font-poppins mb-[9px]">
                  Bio (Optional)
                </Text>
                <TextInput
                  className="h-[48px] rounded-md border border-[#F2F2F2] bg-[#FAFAFA] px-[12px] mb-[32px] text-[14px] text-black font-poppins leading-5"
                  placeholder="Tell us about yourself"
                  placeholderTextColor="#999"
                  onChangeText={(text) => setValue("bio", text)}
                />
              </View>

              {/* Create Account Button */}
              <TouchableOpacity
                className={`flex-row items-center justify-center bg-[#1C6206] p-[10px] h-[56px] rounded-full mb-5 gap-2 ${
                  isSubmitting || registerMutation.isPending ? "opacity-60" : ""
                }`}
                onPress={handleSubmit(onSubmit, onError)}
                disabled={isSubmitting || registerMutation.isPending}
              >
                <Text className="text-white text-[16px] font-medium font-poppins">
                  Create account
                </Text>
                <Image
                  source={require("../../assets/User-plus.png")}
                  className="w-[22px] h-[22px]"
                />
              </TouchableOpacity>

              {/* Divider */}
              <Text className="text-center text-black text-[14px] opacity-50 font-poppins mb-[14px]">
                Or sign up with
              </Text>

              <Socials />

              {/* Login Link */}
              <Text className="text-center text-black/50 text-[12px] mt-2.5 font-poppins">
                Already have an account?{" "}
                <Text
                  className="text-[#1C6206] font-medium font-poppins-semibold"
                  onPress={() => navigation.navigate("Login")}
                >
                  Log in
                </Text>
              </Text>

              {/* Success Modal removed - navigation happens automatically on registration success */}
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
