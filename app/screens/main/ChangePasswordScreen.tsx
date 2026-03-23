import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../services/users/profile.service";
import { Toast } from "../../components/Toast";

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const mutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setToastVisible(true);
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    },
    onError: (error: any) => {
      Alert.alert("Error", error.message || "Failed to change password");
    },
  });

  const handleSave = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    mutation.mutate({ currentPassword, newPassword });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-5 pt-2"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="flex-row items-center mb-8">
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

          {/* Form */}
          <View className="gap-6">
            <View>
              <Text className="text-[14px] font-medium text-gray-700 mb-2 font-poppins">
                Current Password
              </Text>
              <View className="relative">
                <TextInput
                  secureTextEntry={!showCurrent}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  className="bg-gray-100 rounded-xl p-4 text-[#1D2939] font-poppins text-[14px]"
                  placeholder="Enter current password"
                />
                <TouchableOpacity
                  onPress={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-4"
                >
                  <Ionicons
                    name={showCurrent ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#667085"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="text-[14px] font-medium text-gray-700 mb-2 font-poppins">
                New Password
              </Text>
              <View className="relative">
                <TextInput
                  secureTextEntry={!showNew}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  className="bg-gray-100 rounded-xl p-4 text-[#1D2939] font-poppins text-[14px]"
                  placeholder="At least 6 characters"
                />
                <TouchableOpacity
                  onPress={() => setShowNew(!showNew)}
                  className="absolute right-4 top-4"
                >
                  <Ionicons
                    name={showNew ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#667085"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text className="text-[14px] font-medium text-gray-700 mb-2 font-poppins">
                Confirm New Password
              </Text>
              <View className="relative">
                <TextInput
                  secureTextEntry={!showConfirm}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  className="bg-gray-100 rounded-xl p-4 text-[#1D2939] font-poppins text-[14px]"
                  placeholder="Repeat new password"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-4"
                >
                  <Ionicons
                    name={showConfirm ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#667085"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={mutation.isPending}
            className="bg-[#1C6206] rounded-full h-14 justify-center items-center mt-12 shadow-sm"
          >
            {mutation.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-[16px] font-parkinsans-bold">
                Update Password
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <Toast
        visible={toastVisible}
        message="Password updated successfully!"
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
}
