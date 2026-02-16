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

// Mock Data for Feed
const FEED_DATA = [
  {
    id: "1",
    user: {
      name: "Suarau uthman",
      avatar: require("../../assets/icon.png"), // Placeholder
    },
    date: "Jul 21",
    content:
      "Hello, fellow farmers! 🌱\nI'm offering my trusted precision agriculture drone for sale. This drone has been a game-changer for monitoring crop health, optimizing irrigation, and improving yields. It's in excellent condition, and I'm only selling it because I've upgraded to a newer mode...",
    image: require("../../assets/r2.png"), // Drone image
    likes: 10,
    comments: 6,
    isLiked: false,
    isSaved: false,
  },
];

export default function AgroConnect() {
  const [searchQuery, setSearchQuery] = useState("");

  const renderPostItem = ({ item }: { item: any }) => (
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
          <TouchableOpacity className="flex-row items-center gap-1">
            <Ionicons name="heart-outline" size={22} color="#1D2939" />
            <Text className="text-[12px] text-[#1D2939] font-medium font-poppins">
              {item.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center gap-1">
            <Ionicons name="chatbubble-outline" size={20} color="#1D2939" />
            <Text className="text-[12px] text-[#1D2939] font-medium font-poppins">
              {item.comments}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Feather name="download" size={20} color="#1D2939" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={20} color="#1D2939" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="mb-3">
        <Text className="text-[14px] text-[#1D2939] leading-[22px] font-poppins">
          {item.content}
        </Text>
        <TouchableOpacity>
          <Text className="text-[#1C6206] text-[12px] font-bold font-poppins mt-1">
            Show more
          </Text>
        </TouchableOpacity>
      </View>

      {/* Add Comment Input */}
      <View className="flex-row items-center mt-2 pt-3 border-t border-gray-50">
        <Image
          source={require("../../../assets/icon.png")} // Current user avatar placeholder
          className="w-6 h-6 rounded-full bg-gray-200 mr-2"
        />
        <TextInput
          placeholder="Add a comment..."
          placeholderTextColor="#98A2B3"
          className="flex-1 text-[12px] font-poppins text-[#1D2939] h-8"
        />
        <TouchableOpacity className="bg-gray-50 p-1.5 rounded-full">
          <Ionicons name="add" size={16} color="#1C6206" />
        </TouchableOpacity>
      </View>
    </View>
  );

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
        <View>
          {FEED_DATA.map((item) => (
            <View key={item.id}>{renderPostItem({ item })}</View>
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        className="absolute bottom-6 right-5 w-14 h-14 bg-white rounded-full justify-center items-center shadow-lg shadow-[#1C6206]/20 border border-gray-50"
        style={{ elevation: 5 }}
      >
        <Ionicons name="add" size={30} color="#1C6206" />
      </TouchableOpacity>
    </View>
  );
}
