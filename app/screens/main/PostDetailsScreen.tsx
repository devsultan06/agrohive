import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

// Mock Comments Data
const INITIAL_COMMENTS = [
  {
    id: "1",
    user: {
      name: "Tunde Adebayo",
      avatar: require("../../assets/icon.png"), // Placeholder
    },
    content: "Is this still available? I'm interested.",
    time: "2h ago",
  },
  {
    id: "2",
    user: {
      name: "Chinedu Okeke",
      avatar: require("../../assets/icon.png"), // Placeholder
    },
    content: "Great machine! I used one last season.",
    time: "5h ago",
  },
];

export default function PostDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { post } = route.params;
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(INITIAL_COMMENTS);

  const handleSendComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      user: {
        name: "Me", // In a real app, use the current user's name
        avatar: require("../../assets/icon.png"),
      },
      content: commentText,
      time: "Just now",
    };

    setComments([...comments, newComment]);
    setCommentText("");
  };

  const renderCommentItem = ({ item }: { item: any }) => (
    <View className="flex-row mb-4 px-5">
      <Image
        source={item.user.avatar}
        className="w-10 h-10 rounded-full bg-gray-200 mr-3"
      />
      <View className="flex-1 bg-gray-50 p-3 rounded-2xl rounded-tl-none">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-[14px] font-bold text-[#1D2939] font-parkinsans-bold">
            {item.user.name}
          </Text>
          <Text className="text-[12px] text-gray-400 font-poppins">
            {item.time}
          </Text>
        </View>
        <Text className="text-[14px] text-[#344054] font-poppins leading-5">
          {item.content}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-2 pb-4 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 justify-center items-center"
        >
          <Ionicons name="chevron-back" size={24} color="#1D2939" />
        </TouchableOpacity>
        <Text className="text-[18px] font-bold text-[#1D2939] font-parkinsans-bold">
          Post
        </Text>
        <View className="w-10" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View className="mb-4">
              {/* Original Post */}
              <View className="p-5 border-b border-gray-100 mb-2">
                {/* User Header */}
                <View className="flex-row items-center mb-3">
                  <Image
                    source={post.user.avatar}
                    className="w-10 h-10 rounded-full bg-gray-200 mr-3"
                  />
                  <View>
                    <Text className="text-[16px] font-bold text-[#1D2939] font-parkinsans-bold">
                      {post.user.name}
                    </Text>
                    <Text className="text-[12px] text-gray-400 font-poppins">
                      {post.date}
                    </Text>
                  </View>
                </View>

                {/* Content */}
                <Text className="text-[14px] text-[#1D2939] leading-6 font-poppins mb-3">
                  {post.content}
                </Text>

                {/* Image */}
                {post.image && (
                  <View className="h-[250px] w-full rounded-2xl overflow-hidden mb-3 bg-gray-100">
                    <Image
                      source={post.image}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                )}

                {/* Stats */}
                <View className="flex-row items-center gap-4 pt-2">
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="heart-outline" size={22} color="#1D2939" />
                    <Text className="text-[12px] text-[#1D2939] font-medium font-poppins">
                      {post.likes}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Ionicons
                      name="chatbubble-outline"
                      size={20}
                      color="#1D2939"
                    />
                    <Text className="text-[12px] text-[#1D2939] font-medium font-poppins">
                      {comments.length}
                    </Text>
                  </View>
                </View>
              </View>
              <Text className="px-5 text-[16px] font-bold text-[#1D2939] font-parkinsans-bold mb-2">
                Comments
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Comment Input Footer */}
        <View className="p-4 bg-white border-t border-gray-100 flex-row items-center">
          <Image
            source={require("../../assets/icon.png")}
            className="w-8 h-8 rounded-full bg-gray-200 mr-3"
          />
          <View className="flex-1 bg-gray-50 rounded-full px-4 h-12 flex-row items-center border border-gray-200">
            <TextInput
              placeholder="Add a comment..."
              placeholderTextColor="#98A2B3"
              value={commentText}
              onChangeText={setCommentText}
              className="flex-1 text-[14px] font-poppins text-[#1D2939] h-full"
            />
            {commentText.trim().length > 0 && (
              <TouchableOpacity onPress={handleSendComment}>
                <Text className="text-[#1C6206] font-bold font-poppins ml-2">
                  Post
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
