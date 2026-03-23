import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { usePostStore } from "../../store/usePostStore";
import { useUserProfile } from "../../hooks/useUserProfile";
import PostItem from "../../components/community/PostItem";

export default function UserPostsScreen() {
  const navigation = useNavigation<any>();
  const { posts, toggleLike, toggleBookmark } = usePostStore();
  const { data: user } = useUserProfile();

  const userPosts = useMemo(() => {
    if (!user) return [];
    return posts.filter((post) => post.user.id === user.id);
  }, [posts, user]);

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
          My Posts
        </Text>
      </View>

      {userPosts.length > 0 ? (
        <FlatList
          data={userPosts}
          renderItem={({ item }) => (
            <PostItem
              item={item}
              onLike={toggleLike}
              onBookmark={toggleBookmark}
              currentUserId={user?.id}
              navigation={navigation}
              showFollow={false}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 justify-center items-center px-10">
          <View className="w-20 h-20 bg-gray-50 rounded-full justify-center items-center mb-4">
            <Ionicons name="document-text-outline" size={40} color="#98A2B3" />
          </View>
          <Text className="text-[18px] font-bold text-[#1D2939] font-parkinsans-bold mb-2">
            No posts yet
          </Text>
          <Text className="text-gray-500 text-center font-poppins text-[14px]">
            Share your farming journey with the community!
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
