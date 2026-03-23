import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { usePostStore } from "../../store/usePostStore";
import { toggleFollow } from "../../services/users/profile.service";
import { Toast } from "../Toast";
import { useUserProfile } from "../../hooks/useUserProfile";
import PostItem from "./PostItem";

export default function AgroConnect() {
  const navigation = useNavigation<any>();
  const { data: currentUser } = useUserProfile();
  const [searchQuery, setSearchQuery] = useState("");
  const {
    posts,
    toggleLike,
    fetchPosts,
    isLoading,
    toggleBookmark,
    toggleFollowAuthor,
  } = usePostStore();
  const [refreshing, setRefreshing] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  const handleQuickFollow = async (userId: string, userName: string) => {
    try {
      await toggleFollowAuthor(userId);
      setToastMessage(
        !posts.find((p) => p.user.id === userId)?.isFollowing
          ? `Following ${userName}`
          : `Unfollowed ${userName}`,
      );
      setToastVisible(true);
    } catch (error) {
      console.error("Follow failed:", error);
    }
  };

  const filteredPosts = posts.filter(
    (item) =>
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-5 pt-2 pb-4"></View>

        {/* Search */}
        <View className="px-5 mb-6 flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center h-[50px] bg-[#FAFAFA] rounded-2xl px-4 border border-gray-100">
            <Ionicons name="search" size={20} color="#98A2B3" />
            <TextInput
              placeholder="Search community posts..."
              placeholderTextColor="#98A2B3"
              className="flex-1 ml-3 font-poppins text-[14px]"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity className="w-[50px] h-[50px] bg-[#FAFAFA] border border-gray-100 rounded-2xl justify-center items-center">
            <Ionicons name="options-outline" size={24} color="#1C6206" />
          </TouchableOpacity>
        </View>

        {/* Feed List */}
        <View>
          {isLoading && !refreshing ? (
            <View className="flex-1 justify-center items-center pt-20">
              <ActivityIndicator size="large" color="#1C6206" />
            </View>
          ) : filteredPosts.length === 0 ? (
            <View className="flex-1 justify-center items-center px-10 pt-10">
              <View className="w-20 h-20 bg-gray-50 rounded-full justify-center items-center mb-4">
                <Ionicons name="search-outline" size={40} color="#98A2B3" />
              </View>
              <Text className="text-[18px] font-bold text-[#1D2939] font-parkinsans-bold mb-2">
                No posts found
              </Text>
              <Text className="text-gray-500 text-center font-poppins text-[14px]">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Be the first to share something with the community!"}
              </Text>
            </View>
          ) : (
            filteredPosts.map((item) => (
              <PostItem
                key={item.id}
                item={item}
                onLike={toggleLike}
                onBookmark={toggleBookmark}
                onFollow={handleQuickFollow}
                currentUserId={currentUser?.id}
                navigation={navigation}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => navigation.navigate("CreatePost")}
        className="absolute bottom-6 right-5 w-14 h-14 bg-[#1C6206] rounded-full justify-center items-center shadow-lg shadow-[#1C6206]/20"
        style={{ elevation: 5 }}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>

      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
}
