import React from "react";
import { Modal, View, Text, TouchableOpacity, Image } from "react-native";

interface SuccessModalProps {
  message: string;

  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  message,
  visible,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <View className="bg-white rounded-2xl p-[43px] items-center w-[90%]">
          <Image
            source={require("../../assets/success.png")} // ✅ your success icon
            className="w-[100px] h-[100px] mb-5 rounded-full p-3 bg-[#1C6206]/[0.16]"
          />
          <Text className="text-[28px] font-bold text-[#1C6206] mb-2 font-poppins-bold">
            Congratulations!
          </Text>
          <Text className="text-black text-base opacity-40 text-center font-poppins mb-8">
            {message}
          </Text>

          <TouchableOpacity
            className="bg-[#1C6206] p-[10px] flex-row gap-2 justify-center items-center rounded-full w-full h-14"
            onPress={onConfirm}
          >
            <Text className="text-white text-base font-medium font-poppins">
              Go to login
            </Text>
            <Image
              source={require("../../assets/arrow.png")} // ✅ your arrow icon
              className="w-3 h-[14px]"
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;
