import React, { useState, useEffect } from "react";
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
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

import { usePostStore } from "../../store/usePostStore";
import { addComment, getPostById } from "../../services/posts/posts.service";
import { useUserProfile } from "../../hooks/useUserProfile";

const LetterAvatar = ({
  name,
  size = 40,
  textSize = 16,
}: {
  name: string;
  size?: number;
  textSize?: number;
}) => (
  <View
    style={{ width: size, height: size }}
    className="rounded-full bg-[#F0FDF4] border border-[#BBF7D0] items-center justify-center"
  >
    <Text
      style={{ fontSize: textSize }}
      className="text-[#1C6206] font-parkinsans-bold uppercase"
    >
      {name?.charAt(0) || "U"}
    </Text>
  </View>
);

export default function PostDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { post: initialPost } = route.params;
  const { data: currentUser } = useUserProfile();

  const [post, setPost] = useState<any>(initialPost);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<any[]>(
    initialPost.commentsList || [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFullPost = async () => {
    try {
      const fullPost = await getPostById(initialPost.id);
      // Map backend to frontend format manually here if needed or use the store
      const mappedComments =
        fullPost.comments?.map((c: any) => ({
          id: c.id,
          content: c.content,
          time: "Recently",
          user: {
            id: c.user.id,
            name: c.user.fullName,
            avatar: c.user.avatarUrl ? { uri: c.user.avatarUrl } : null,
          },
        })) || [];

      setPost({
        ...initialPost,
        likes: fullPost.likesCount,
        comments: fullPost.commentsCount,
      });
      setComments(mappedComments);
    } catch (error) {
      console.error("Failed to fetch post details:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFullPost();
  }, [initialPost.id]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchFullPost();
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const newComment = await addComment(post.id, commentText);

      setComments((prev) => [
        {
          id: newComment.id,
          user: {
            id: newComment.user.id,
            name: newComment.user.fullName,
            avatar: newComment.user.avatarUrl
              ? { uri: newComment.user.avatarUrl }
              : null,
          },
          content: newComment.content,
          time: "Just now",
        },
        ...prev,
      ]);
      setCommentText("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCommentItem = ({ item }: { item: any }) => (
    <View className="flex-row mb-4 px-5">
      {item.user.avatar ? (
        <Image
          source={
            typeof item.user.avatar === "string"
              ? { uri: item.user.avatar }
              : item.user.avatar
          }
          className="w-10 h-10 rounded-full bg-gray-200 mr-3"
        />
      ) : (
        <View className="mr-3">
          <LetterAvatar name={item.user.name} size={40} textSize={15} />
        </View>
      )}
      <View className="flex-1 bg-gray-50 p-3 rounded-2xl rounded-tl-none border border-gray-100/50">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-[14px] font-bold text-[#1D2939] font-parkinsans-bold">
            {item.user.name}
          </Text>
          <Text className="text-[11px] text-gray-400 font-poppins">
            {item.time}
          </Text>
        </View>
        <Text className="text-[13px] text-[#344054] font-poppins leading-5">
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
          Post Details
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
              <View className="p-5 border-b border-gray-50 mb-2">
                {/* User Header */}
                <View className="flex-row items-center mb-3">
                  {post.user.avatar ? (
                    <Image
                      source={
                        typeof post.user.avatar === "string"
                          ? { uri: post.user.avatar }
                          : post.user.avatar
                      }
                      className="w-10 h-10 rounded-full bg-gray-200 mr-3"
                    />
                  ) : (
                    <View className="mr-3">
                      <LetterAvatar
                        name={post.user.name}
                        size={40}
                        textSize={16}
                      />
                    </View>
                  )}
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
                <Text className="text-[15px] text-[#344054] leading-6 font-poppins mb-4">
                  {post.content}
                </Text>

                {/* Image */}
                {post.image && (
                  <View className="h-[250px] w-full rounded-2xl overflow-hidden mb-4 bg-gray-50 border border-gray-100">
                    <Image
                      source={post.image}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                )}

                {/* Stats */}
                <View className="flex-row items-center gap-5 pt-2">
                  <View className="flex-row items-center gap-1.5">
                    <Ionicons name="heart-outline" size={22} color="#1D2939" />
                    <Text className="text-[13px] text-[#1D2939] font-bold font-poppins">
                      {post.likes}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1.5">
                    <Feather name="message-circle" size={20} color="#1D2939" />
                    <Text className="text-[13px] text-[#1D2939] font-bold font-poppins">
                      {comments.length}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="px-5 py-2">
                <Text className="text-[16px] font-bold text-[#1D2939] font-parkinsans-bold">
                  Responses
                </Text>
              </View>

              {isLoading && (
                <View className="py-10 flex-row justify-center items-center gap-2">
                  <ActivityIndicator size="small" color="#1C6206" />
                  <Text className="text-[#98A2B3] text-[13px] font-poppins">
                    Listening to farmers...
                  </Text>
                </View>
              )}
            </View>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />

        {/* Comment Input Footer */}
        <View className="p-4 bg-white border-t border-gray-100 flex-row items-center">
          {currentUser?.avatarUrl ? (
            <Image
              source={{ uri: currentUser.avatarUrl }}
              className="w-9 h-9 rounded-full bg-gray-200 mr-3"
            />
          ) : (
            <View className="mr-3">
              <LetterAvatar
                name={currentUser?.fullName || "Me"}
                size={36}
                textSize={14}
              />
            </View>
          )}
          <View className="flex-1 bg-[#F9FAFB] rounded-2xl px-4 py-1.5 flex-row items-center border border-gray-100 focus-within:bg-white focus-within:border-[#1C6206]/30 transition-all">
            <TextInput
              placeholder="Contribute your expert tip..."
              placeholderTextColor="#98A2B3"
              value={commentText}
              onChangeText={setCommentText}
              multiline
              className="flex-1 text-[14px] font-poppins text-[#1D2939] min-h-[40px] pt-2"
            />
            {(commentText.trim().length > 0 || isSubmitting) && (
              <TouchableOpacity
                onPress={handleSendComment}
                disabled={isSubmitting}
                className="bg-[#1C6206] px-4 py-2 rounded-xl shadow-sm shadow-[#1C6206]/20 ml-2"
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-bold font-poppins text-[12px] uppercase">
                    Send
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
