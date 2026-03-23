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
import * as ImagePicker from "expo-image-picker";
import { Image, ActivityIndicator } from "react-native";

export default function CreatePostScreen() {
  const navigation = useNavigation<any>();
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addPost, draftContent, setDraftContent, clearDraftContent } =
    usePostStore();

  useEffect(() => {
    if (draftContent) {
      setPostContent(draftContent);
    }
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setSelectedImage({
        uri: asset.uri,
        type: "image/jpeg",
        name: "post-image.jpg",
      });
    }
  };

  const handlePost = async () => {
    if (!postContent.trim()) return;

    setIsSubmitting(true);
    try {
      await addPost(postContent, selectedImage);
      clearDraftContent();
      setToastVisible(true);
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setIsSubmitting(false);
    }
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

          {selectedImage && (
            <View className="relative mt-4">
              <Image
                source={{ uri: selectedImage.uri }}
                className="w-full h-48 rounded-xl bg-gray-100"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-black/50 w-8 h-8 rounded-full justify-center items-center"
              >
                <Ionicons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Footer Actions */}
        <View className="px-5 py-4 border-t border-gray-50 flex-row items-center justify-between bg-white">
          <View className="flex-row items-center gap-6">
            <TouchableOpacity onPress={pickImage}>
              <Feather name="image" size={24} color="#667085" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Feather name="plus" size={24} color="#667085" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handlePost}
            className={`px-8 py-3 rounded-full flex-row items-center ${postContent.trim() && !isSubmitting ? "bg-[#1C6206]" : "bg-[#E4E7EC]"}`}
            disabled={!postContent.trim() || isSubmitting}
          >
            {isSubmitting && (
              <ActivityIndicator size="small" color="white" className="mr-2" />
            )}
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
