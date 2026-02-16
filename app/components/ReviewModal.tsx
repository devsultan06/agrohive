import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export default function ReviewModal({
  visible,
  onClose,
  onSubmit,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit(rating, comment);
    setRating(0);
    setComment("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/50">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="bg-white rounded-t-[32px] p-6 h-[60%]"
            >
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-[20px] font-bold text-[#1D2939] font-parkinsans-bold">
                  Write a Review
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#1D2939" />
                </TouchableOpacity>
              </View>

              <View className="items-center mb-8">
                <Text className="text-[14px] text-gray-500 font-poppins mb-4">
                  How would you rate your experience?
                </Text>
                <View className="flex-row gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                    >
                      <Ionicons
                        name={rating >= star ? "star" : "star-outline"}
                        size={40}
                        color={rating >= star ? "#FFD700" : "#E4E7EC"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Text className="text-[14px] font-bold text-[#1D2939] mb-2 font-poppins">
                Your Review
              </Text>
              <TextInput
                placeholder="Share your thoughts about this product..."
                placeholderTextColor="#98A2B3"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={comment}
                onChangeText={setComment}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-4 h-[120px] font-poppins text-[#1D2939] mb-6"
              />

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={rating === 0}
                className={`h-[56px] rounded-full justify-center items-center ${
                  rating > 0 ? "bg-[#1C6206]" : "bg-gray-200"
                }`}
              >
                <Text
                  className={`text-[16px] font-bold font-poppins ${
                    rating > 0 ? "text-white" : "text-gray-400"
                  }`}
                >
                  Submit Review
                </Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
