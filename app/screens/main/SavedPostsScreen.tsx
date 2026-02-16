import React from "react";
import { View, Text, TouchableOpacity, Image, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSavedPostStore, Post } from "../../store/useSavedPostStore";

export default function SavedPostsScreen() {
  const navigation = useNavigation<any>();
  const { savedPosts, toggleSavePost } = useSavedPostStore();

  const renderPostItem = ({ item }: { item: Post }) => (
    <View className="bg-white p-4 mb-4 rounded-[20px] border border-gray-100 shadow-sm mx-5">
      {/*... Reuse post item rendering logic or component... */}
      {/* For brevity, I'll copy the core structure but simplified for list view */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center flex-1">
          <Image
            source={item.user.avatar}
            className="w-10 h-10 rounded-full bg-gray-200"
          />
          <View className="ml-3 flex-1">
            <Text className="text-[14px] font-bold text-[#1D2939] font-parkinsans-bold">
              {item.user.name}
            </Text>
            <Text className="text-[12px] text-gray-400 font-poppins">
              {item.date}
            </Text>
          </View>
        </View>
      </View>

      <Text className="text-[14px] text-[#1D2939] leading-[22px] font-poppins mb-3">
        {item.content}
      </Text>

      {item.image && (
        <View className="h-[200px] w-full rounded-2xl overflow-hidden mb-3 bg-gray-100">
          <Image
            source={item.image}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      )}

      <View className="flex-row justify-end">
        <TouchableOpacity
          onPress={() => toggleSavePost(item)}
          className="flex-row items-center"
        >
          <Ionicons name="bookmark" size={20} color="#1C6206" />
          <Text className="text-[#1C6206] text-[12px] font-bold ml-1 font-poppins">
            Remove
          </Text>
        </TouchableOpacity>
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
          Saved Posts
        </Text>
      </View>

      {savedPosts.length > 0 ? (
        <FlatList
          data={savedPosts}
          renderItem={renderPostItem}
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
