import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Toast } from "../../components/Toast";

export default function ChangePasswordScreen() {
  const navigation = useNavigation<any>();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleChangePassword = () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setToastMessage("Please fill in all fields");
      setToastVisible(true);
      return;
    }

    if (newPassword.length < 8) {
      setToastMessage("New password must be at least 8 characters");
      setToastVisible(true);
      return;
    }

    if (newPassword !== confirmPassword) {
      setToastMessage("Passwords do not match");
      setToastVisible(true);
      return;
    }

    // TODO: Call API to change password
    // For now, simulate success
    setToastMessage("Password changed successfully!");
    setToastVisible(true);

    // Clear fields and navigate back after delay
    setTimeout(() => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      navigation.goBack();
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header */}
          <View className="flex-row items-center px-5 pt-2 mb-8">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center mr-4"
            >
              <Ionicons name="arrow-back" size={24} color="#1D2939" />
            </TouchableOpacity>
            <Text className="text-[20px] font-bold text-[#1D2939] font-parkinsans-bold">
              Change Password
            </Text>
          </View>

          <View className="px-5">
            {/* Info Card */}
            <View className="bg-blue-50 p-4 rounded-xl mb-6 flex-row">
              <Ionicons name="information-circle" size={20} color="#007AFF" />
              <Text className="text-[12px] text-gray-600 ml-3 flex-1 font-poppins">
                Your new password must be at least 8 characters long and
                different from your current password.
              </Text>
            </View>

            {/* Current Password */}
            <View className="mb-6">
              <Text className="text-[14px] font-medium text-[#344054] mb-2 font-poppins">
                Current Password
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 h-14 border border-gray-100">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#98A2B3"
                />
                <TextInput
                  placeholder="Enter current password"
                  placeholderTextColor="#98A2B3"
                  className="flex-1 ml-3 font-poppins text-[14px] text-[#1D2939]"
                  secureTextEntry={!showCurrentPassword}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  <Ionicons
                    name={
                      showCurrentPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color="#98A2B3"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Password */}
            <View className="mb-6">
              <Text className="text-[14px] font-medium text-[#344054] mb-2 font-poppins">
                New Password
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 h-14 border border-gray-100">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#98A2B3"
                />
                <TextInput
                  placeholder="Enter new password"
                  placeholderTextColor="#98A2B3"
                  className="flex-1 ml-3 font-poppins text-[14px] text-[#1D2939]"
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#98A2B3"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm New Password */}
            <View className="mb-8">
              <Text className="text-[14px] font-medium text-[#344054] mb-2 font-poppins">
                Confirm New Password
              </Text>
              <View className="flex-row items-center bg-gray-50 rounded-xl px-4 h-14 border border-gray-100">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#98A2B3"
                />
                <TextInput
                  placeholder="Re-enter new password"
                  placeholderTextColor="#98A2B3"
                  className="flex-1 ml-3 font-poppins text-[14px] text-[#1D2939]"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color="#98A2B3"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Requirements */}
            <View className="bg-gray-50 p-4 rounded-xl mb-8">
              <Text className="text-[12px] font-bold text-[#344054] mb-3 font-poppins">
                Password Requirements:
              </Text>
              <View className="space-y-2">
                <View className="flex-row items-center mb-2">
                  <Ionicons
                    name={
                      newPassword.length >= 8
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={newPassword.length >= 8 ? "#1C6206" : "#98A2B3"}
                  />
                  <Text className="text-[12px] text-gray-600 ml-2 font-poppins">
                    At least 8 characters
                  </Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <Ionicons
                    name={
                      /[A-Z]/.test(newPassword)
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={/[A-Z]/.test(newPassword) ? "#1C6206" : "#98A2B3"}
                  />
                  <Text className="text-[12px] text-gray-600 ml-2 font-poppins">
                    One uppercase letter
                  </Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <Ionicons
                    name={
                      /[0-9]/.test(newPassword)
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={/[0-9]/.test(newPassword) ? "#1C6206" : "#98A2B3"}
                  />
                  <Text className="text-[12px] text-gray-600 ml-2 font-poppins">
                    One number
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons
                    name={
                      newPassword === confirmPassword && newPassword.length > 0
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={
                      newPassword === confirmPassword && newPassword.length > 0
                        ? "#1C6206"
                        : "#98A2B3"
                    }
                  />
                  <Text className="text-[12px] text-gray-600 ml-2 font-poppins">
                    Passwords match
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Button at Bottom - Outside ScrollView */}
        <View className="absolute bottom-10 left-5 right-5">
          <TouchableOpacity
            onPress={handleChangePassword}
            className="bg-[#1C6206] h-[56px] rounded-full justify-center items-center"
          >
            <Text className="text-white font-bold text-[16px] font-medium font-poppins-semibold">
              Change Password
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
}
