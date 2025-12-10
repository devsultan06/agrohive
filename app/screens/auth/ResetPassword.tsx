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
import SuccessModal from "../../components/auth/SuccessModal";

export default function ResetPassword({ navigation }: any) {
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);

  const handleReset = () => {
    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }
    setShowModal(true);
  };

  const handleGoToLogin = () => {
    setShowModal(false);
    navigation.navigate("Login");
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
            Reset Password
          </Text>
          <Text className="text-xs text-black opacity-40 text-center font-poppins mb-10 w-[80%] mx-auto">
            Create a strong password that you’ll remember.
          </Text>

          <Text className="text-xs text-black mb-2 font-poppins">
            New Password
          </Text>
          <TextInput
            className="h-12 rounded-md border border-[#F2F2F2] bg-[#FAFAFA] px-3 text-sm font-poppins text-black mb-5"
            placeholder="Enter new password"
            placeholderTextColor="#999"
            secureTextEntry
            onChangeText={setPassword}
          />

          <Text className="text-xs text-black mb-2 font-poppins">
            Confirm Password
          </Text>
          <TextInput
            className="h-12 rounded-md border border-[#F2F2F2] bg-[#FAFAFA] px-3 text-sm font-poppins text-black mb-5"
            placeholder="Confirm password"
            placeholderTextColor="#999"
            secureTextEntry
            onChangeText={setConfirm}
          />

          <TouchableOpacity
            className="bg-[#1C6206] h-14 rounded-full justify-center items-center mt-64"
            onPress={handleReset}
          >
            <Text className="text-white text-base font-medium font-poppins">
              Change Password
            </Text>
          </TouchableOpacity>
        </View>

        <SuccessModal
          message="You have successfully reset your password"
          visible={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleGoToLogin}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
