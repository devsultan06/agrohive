import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  Alert,
} from "react-native";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation } from "@tanstack/react-query";
import { requestVerifyEmail } from "../../services/auth/verifyEmail.service";
import { requestResendOtp } from "../../services/auth/resendOtp.service";
import SuccessModal from "../../components/auth/SuccessModal";
import * as SecureStore from "expo-secure-store";
import { registerForPushNotificationsAsync } from "../../services/notifications/pushNotifications.service";

export default function EnterOtp({ navigation, route }: any) {
  const { email, context } = route?.params || {};
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showModal, setShowModal] = useState(false);
  const inputs = useRef<(TextInput | null)[]>([]);

  const verifyMutation = useMutation({
    mutationFn: requestVerifyEmail,
    onSuccess: async (res) => {
      // Save tokens
      await SecureStore.setItemAsync("token", res.access_token);
      await SecureStore.setItemAsync("refreshToken", res.refresh_token);
      setShowModal(true);
    },
    onError: (err: any) => {
      Toast.show({
        type: "error",
        text1: "Verification Failed",
        text2: err.message || "Invalid OTP",
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: requestResendOtp,
    onSuccess: (res) => {
      Toast.show({
        type: "success",
        text1: "Code Sent",
        text2: res.message || "A new code has been sent.",
      });
    },
    onError: (err: any) => {
      Toast.show({
        type: "error",
        text1: "Resend Failed",
        text2: err.message || "An error occurred",
      });
    },
  });

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < inputs.current.length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (!email) {
      Alert.alert("Error", "Email not found to resend OTP");
      return;
    }
    resendMutation.mutate({ email });
  };

  const handleSubmit = async () => {
    const code = otp.join("");
    if (code.length === 4) {
      if (context === "forgotPassword") {
        navigation.navigate("ResetPassword", { email, code });
      } else {
        // Try to get push token before verifying
        let fcmToken;
        try {
          fcmToken = await registerForPushNotificationsAsync();
        } catch (e) {
          console.warn("Could not get push token for welcome notification", e);
        }
        verifyMutation.mutate({ email, code, fcmToken });
      }
    } else {
      Alert.alert("Invalid Input", "Please enter a 4-digit code");
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Main" }],
    });
  };

  return (
    <View className="flex-1">
      <ImageBackground
        source={require("../../assets/bg-app.png")}
        className="flex-1"
        resizeMode="cover"
      >
        <SafeAreaView className="flex-1 px-6" edges={["top", "left", "right"]}>
          <TouchableOpacity
            className="mt-10 flex-row items-center gap-[5px]"
            onPress={() => navigation.navigate("Login")}
          >
            <Image
              source={require("../../assets/arrow-left.png")}
              className="w-6 h-6"
            />
            <Text className="text-[14px] text-black font-poppins">
              Back to login
            </Text>
          </TouchableOpacity>

          <View className="mt-[55px] items-center">
            <Text className="text-[16px] font-bold text-[#1D2939] font-parkinsans-bold mb-2">
              Enter the code
            </Text>
            <Text className="text-[12px] text-black opacity-50 text-center font-poppins mb-10 w-[85%] leading-[18px]">
              We’ve sent a 4-digit code to your email. Please enter it below to
              verify your identity.
            </Text>

            {/* OTP Inputs */}
            <View className="flex-row justify-center gap-2 w-[90%] mb-[25px]">
              {otp.map((value, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputs.current[index] = ref;
                  }}
                  className={`w-[48px] h-[50px] border rounded-[4px] text-center text-sm text-[#1C6206] bg-[#FAFAFA] font-poppins-semibold ${
                    value || inputs.current[index]?.isFocused()
                      ? "border-[#1C6206]"
                      : "border-[#F2F2F2]"
                  }`}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={value}
                  onChangeText={(text) => handleChange(text, index)}
                />
              ))}
            </View>

            {/* Resend */}
            <View className="flex-row mt-[10px]">
              <Text className="text-[14px] text-[#A0A4A8] font-poppins">
                Didn’t receive the code?{" "}
              </Text>
              <TouchableOpacity
                onPress={handleResend}
                disabled={resendMutation.isPending}
              >
                <Text
                  className={`text-[14px] text-[#1C6206] font-poppins ${resendMutation.isPending ? "opacity-50" : ""}`}
                >
                  Resend
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Send OTP Button */}
          <TouchableOpacity
            className={`bg-[#1C6206] h-[56px] rounded-full justify-center items-center mt-auto mb-[30px] ${verifyMutation.isPending ? "opacity-60" : ""}`}
            onPress={handleSubmit}
            disabled={verifyMutation.isPending}
          >
            <Text className="text-white text-[16px] font-medium font-poppins-semibold">
              {verifyMutation.isPending ? "Verifying..." : "Verify and proceed"}
            </Text>
          </TouchableOpacity>
          <SuccessModal
            message="Authentication Successful"
            visible={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleModalConfirm}
          />
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
