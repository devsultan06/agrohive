import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "danger" | "warning" | "success";
}

export default function ConfirmationModal({
  visible,
  title,
  message,
  confirmText,
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  type = "warning",
}: ConfirmationModalProps) {
  let iconColor = "#F79009";
  let iconBgColor = "bg-orange-100";
  let confirmBgColor = "bg-[#F79009]";
  let iconName: any = "warning";

  if (type === "danger") {
    iconColor = "#F04438";
    iconBgColor = "bg-red-100";
    confirmBgColor = "bg-[#F04438]";
    iconName = "alert-circle";
  } else if (type === "success") {
    iconColor = "#1C6206";
    iconBgColor = "bg-[#ECFDF3]";
    confirmBgColor = "bg-[#1C6206]";
    iconName = "checkmark-circle";
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center items-center bg-black/50 px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm items-center">
          {/* Icon */}
          <View
            className={`w-12 h-12 ${iconBgColor} rounded-full justify-center items-center mb-4`}
          >
            <Ionicons name={iconName} size={24} color={iconColor} />
          </View>

          {/* Title */}
          <Text className="text-[18px] font-bold text-[#1D2939] text-center mb-2 font-parkinsans-bold">
            {title}
          </Text>

          {/* Message */}
          <Text className="text-[14px] text-gray-600 text-center mb-6 font-poppins leading-5">
            {message}
          </Text>

          {/* Buttons */}
          <View className="gap-3 w-full">
            <TouchableOpacity
              onPress={onConfirm}
              className={`${confirmBgColor} h-12 rounded-full justify-center items-center w-full`}
            >
              <Text className="text-white font-bold text-[14px] font-poppins">
                {confirmText}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onCancel}
              className="bg-gray-100 h-12 rounded-full justify-center items-center w-full"
            >
              <Text className="text-[#344054] font-bold text-[14px] font-poppins">
                {cancelText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
