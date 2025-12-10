import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EnterOtp({ navigation }: any) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);

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

  const handleSubmit = () => {
    const code = otp.join("");
    console.log("Entered OTP:", code);
    if (code.length === 4) {
      navigation.navigate("ResetPassword");
      // handle verification logi
    } else {
      alert("Please enter a 4-digit code");
    }
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
        </TouchableOpacity>{" "}
        <View className="mt-[55px] items-center">
          <Text className="text-lg font-bold text-[#1D2939] font-parkinsans-bold mb-2">
            Enter the code
          </Text>
          <Text className="text-xs text-black opacity-50 text-center font-poppins mb-10 w-[85%] leading-[18px]">
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
                className={`w-12 h-[50px] border rounded-[4px] text-center text-sm text-[#1C6206] bg-[#FAFAFA] font-poppins-semibold ${
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
            <Text className="text-sm text-[#A0A4A8] font-poppins">
              Didn’t receive the code?{" "}
            </Text>
            <TouchableOpacity>
              <Text className="text-xs text-[#1C6206] font-poppins">
                Resend
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Send OTP Button */}
        <TouchableOpacity
          className="bg-[#1C6206] h-14 rounded-full justify-center items-center mt-auto mb-[30px]"
          onPress={handleSubmit}
        >
          <Text className="text-white text-base font-medium font-poppins-semibold">
            Verify and proceed
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
}
