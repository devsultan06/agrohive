import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Falsy,
  RecursiveArray,
  RegisteredStyle,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const [postContent, setPostContent] = useState("");

  const handlePost = () => {
    // Logic to handle posting content would go here
    console.log("Post content:", postContent);
    navigation.goBack();
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-2 pb-4 border-gray-100">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 justify-center items-center"
          >
            <Ionicons name="chevron-back" size={24} color="#1D2939" />
          </TouchableOpacity>
          <Text className="text-[18px] font-bold text-[#1D2939] font-parkinsans-bold">
            Start a post
          </Text>
          <View className="w-10" />
        </View>

        <View className="flex-1 px-5 pt-4">
          <TextInput
            placeholder="What do you want to talk about?"
            placeholderTextColor="#98A2B3"
            multiline
            textAlignVertical="top"
            style={{
              flex: 1,
              fontSize: 16,
              fontFamily: "Poppins-Regular",
              lineHeight: 24,
              padding: 0,
            }}
            value={postContent}
            onChangeText={setPostContent}
            autoFocus
          />
        </View>

        {/* Footer Actions */}
        <View className="px-5 py-4 border-t border-gray-50 flex-row items-center justify-between bg-white">
          <View className="flex-row items-center gap-6">
            <TouchableOpacity>
              <Feather name="image" size={24} color="#667085" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Feather name="plus" size={24} color="#667085" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handlePost}
            className={`px-8 py-3 rounded-full ${postContent.trim() ? "bg-[#1C6206]" : "bg-[#E4E7EC]"}`}
            disabled={!postContent.trim()}
          >
            <Text
              className={`font-bold font-poppins text-[16px] ${postContent.trim() ? "text-white" : "text-[#98A2B3]"}`}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
