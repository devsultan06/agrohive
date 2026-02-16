import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { usePostStore, Post } from "../../store/usePostStore";
import { useSavedPostStore } from "../../store/useSavedPostStore";

export default function UserPostsScreen() {
  const navigation = useNavigation<any>();
  const { posts, toggleLike } = usePostStore();
  const { toggleSavePost, isPostSaved } = useSavedPostStore();

  const userPosts = useMemo(() => {
    return posts.filter((post) => post.user.name === "AGBOHOR Boluwa");
  }, [posts]);

  const renderPostItem = ({ item }: { item: any }) => (
    <View className="bg-white p-4 mb-4 rounded-[20px] border border-gray-100 shadow-sm mx-5">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <Image
            source={item.user.avatar} // Ensure this handles both require and URI
            className="w-10 h-10 rounded-full bg-gray-200"
          />
          <View className="ml-3 flex-1">
            <View className="flex-row items-center">
              <Text className="text-[14px] font-bold text-[#1D2939] font-parkinsans-bold">
                {item.user.name}
              </Text>
              <Text className="text-[12px] text-gray-400 font-poppins ml-2">
                {item.date}
              </Text>
              <Text className="text-[12px] text-gray-400 font-poppins mx-1">
                •
              </Text>
              <TouchableOpacity>
                <Ionicons
                  name="ellipsis-horizontal"
                  size={16}
                  color="#98A2B3"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Post Image */}
      {item.image && (
        <View className="h-[250px] w-full rounded-2xl overflow-hidden mb-3 bg-gray-100">
          <Image
            source={item.image}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      )}

      {/* Actions */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            className="flex-row items-center gap-1"
            onPress={() => toggleLike(item.id)}
          >
            <Ionicons
              name={item.isLiked ? "heart" : "heart-outline"}
              size={22}
              color={item.isLiked ? "#F04438" : "#1D2939"}
            />
            <Text className="text-[12px] text-[#1D2939] font-medium font-poppins">
              {item.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center gap-1"
            onPress={() => navigation.navigate("PostDetails", { post: item })}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#1D2939" />
            <Text className="text-[12px] text-[#1D2939] font-medium font-poppins">
              {item.comments}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Feather name="download" size={20} color="#1D2939" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => toggleSavePost(item)}>
          <Ionicons
            name={isPostSaved(item.id) ? "bookmark" : "bookmark-outline"}
            size={20}
            color={isPostSaved(item.id) ? "#1C6206" : "#1D2939"}
          />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="mb-3">
        <Text className="text-[14px] text-[#1D2939] leading-[22px] font-poppins">
          {item.content}
        </Text>
      </View>
    </View>
  );

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
          renderItem={renderPostItem}
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
