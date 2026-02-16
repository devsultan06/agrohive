import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";
import { useSavedPostStore } from "../../store/useSavedPostStore";
import { usePostStore } from "../../store/usePostStore";

export default function AgroConnect() {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");
  const { posts, toggleLike } = usePostStore();
  const { toggleSavePost, isPostSaved } = useSavedPostStore();

  const PostItem = ({ item }: { item: any }) => {
    const navigation = useNavigation<any>();
    const { toggleLike } = usePostStore();
    const { toggleSavePost, isPostSaved } = useSavedPostStore();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <View className="bg-white p-4 mb-4 rounded-[20px] border border-gray-100 shadow-sm mx-5">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <Image
              source={item.user.avatar}
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
          <TouchableOpacity>
            <Text className="text-[#1C6206] text-[12px] font-bold font-poppins">
              Follow
            </Text>
          </TouchableOpacity>
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
          <Text
            className="text-[14px] text-[#1D2939] leading-[22px] font-poppins"
            numberOfLines={isExpanded ? undefined : 3}
          >
            {item.content}
          </Text>
          {item.content.length > 100 && (
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              <Text className="text-[#1C6206] text-[12px] font-bold font-poppins mt-1">
                {isExpanded ? "Show less" : "Show more"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Add Comment Input */}
        <TouchableOpacity
          className="flex-row items-center mt-2 pt-3 border-t border-gray-50"
          onPress={() => navigation.navigate("PostDetails", { post: item })}
        >
          <Image
            source={require("../../assets/icon.png")} // Current user avatar placeholder
            className="w-6 h-6 rounded-full bg-gray-200 mr-2"
          />
          <View className="flex-1 h-8 justify-center">
            <Text className="text-[12px] font-poppins text-[#98A2B3]">
              Add a comment...
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Search Bar */}
        <View className="px-5 flex-row items-center mb-6 mt-4 gap-3">
          <View className="flex-1 flex-row items-center bg-gray-50 border border-gray-100 h-[50px] rounded-xl px-4">
            <Ionicons name="search-outline" size={20} color="#98A2B3" />
            <TextInput
              placeholder="Search for products or devices.."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-2 font-poppins text-[#1D2939]"
              placeholderTextColor="#98A2B3"
            />
          </View>
          <TouchableOpacity className="w-[50px] h-[50px] bg-white border border-gray-100 rounded-xl justify-center items-center">
            <Ionicons name="options-outline" size={24} color="#1C6206" />
          </TouchableOpacity>
        </View>

        {/* Feed List */}
        {/* Feed List */}
        <View>
          {(() => {
            const filteredPosts = posts.filter(
              (item) =>
                item.content
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()) ||
                item.user.name
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()),
            );

            if (filteredPosts.length === 0) {
              return (
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
              );
            }

            return filteredPosts.map((item) => (
              <View key={item.id}>
                <PostItem item={item} />
              </View>
            ));
          })()}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => navigation.navigate("CreatePost")}
        className="absolute bottom-6 right-5 w-14 h-14 bg-white rounded-full justify-center items-center shadow-lg shadow-[#1C6206]/20 border border-gray-50"
        style={{ elevation: 5 }}
      >
        <Ionicons name="add" size={30} color="#1C6206" />
      </TouchableOpacity>
    </View>
  );
}
