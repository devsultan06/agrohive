import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { usePostStore } from "../../store/usePostStore";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Toast } from "../../components/Toast";

export default function CreatePostScreen() {
  const navigation = useNavigation<any>();
  const [postContent, setPostContent] = useState("");
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const { addPost, draftContent, setDraftContent, clearDraftContent } =
    usePostStore();

  useEffect(() => {
    if (draftContent) {
      setPostContent(draftContent);
    }
  }, []);

  const handlePost = () => {
    if (!postContent.trim()) return;

    const newPost = {
      id: Date.now().toString(),
      user: {
        name: "AGBOHOR Boluwa", // Using current user's name from profile
        avatar: { uri: "https://i.pravatar.cc/150?img=12" }, // Using avatar from profile
      },
      date: "Just now",
      content: postContent,
      likes: 0,
      comments: 0,
      isLiked: false,
      isSaved: false,
    };

    addPost(newPost);
    clearDraftContent();
    setToastVisible(true);
    setTimeout(() => {
      navigation.goBack();
    }, 1500);
  };

  const handleBack = () => {
    if (postContent.trim() && postContent !== draftContent) {
      setShowDraftModal(true);
    } else {
      navigation.goBack();
    }
  };

  const handleSaveDraft = () => {
    setDraftContent(postContent);
    setShowDraftModal(false);
    navigation.goBack();
  };

  const handleDiscardDraft = () => {
    clearDraftContent();
    setShowDraftModal(false);
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
            onPress={handleBack}
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

      <ConfirmationModal
        visible={showDraftModal}
        title="Save as draft?"
        message="You can continue from where you stopped"
        confirmText="Save"
        cancelText="Discard"
        onConfirm={handleSaveDraft}
        onCancel={handleDiscardDraft}
        type="success"
      />

      <Toast
        message="Post added successfully"
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
}
