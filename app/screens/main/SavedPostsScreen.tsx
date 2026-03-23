import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { usePostStore } from "../../store/usePostStore";
import PostItem from "../../components/community/PostItem";
import { useUserProfile } from "../../hooks/useUserProfile";

export default function SavedPostsScreen() {
  const navigation = useNavigation<any>();
  const { bookmarks, toggleBookmark, fetchBookmarks, toggleLike } =
    usePostStore();
  const { data: user } = useUserProfile();

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-2 mb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 justify-center items-center mr-2"
        >
          <Ionicons name="arrow-back" size={24} color="#1D2939" />
        </TouchableOpacity>
        <Text className="text-[20px] font-bold text-[#1D2939] font-parkinsans-bold">
          Saved Posts
        </Text>
      </View>

      {bookmarks.length > 0 ? (
        <FlatList
          data={bookmarks}
          renderItem={({ item }) => (
            <PostItem
              item={item}
              onLike={toggleLike}
              onBookmark={toggleBookmark}
              currentUserId={user?.id}
              navigation={navigation}
              showFollow={item.user.id !== user?.id}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 justify-center items-center px-10">
          <View className="w-20 h-20 bg-gray-50 rounded-full justify-center items-center mb-4">
            <Ionicons name="bookmark-outline" size={40} color="#98A2B3" />
          </View>
          <Text className="text-[18px] font-bold text-[#1D2939] font-parkinsans-bold mb-2">
            No saved posts yet
          </Text>
          <Text className="text-gray-500 text-center font-poppins text-[14px]">
            Bookmark posts you find interesting to read them later here!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
