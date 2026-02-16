import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Mock Data for Videos
const VIDEO_GUIDES = [
  {
    id: "1",
    title: "Robotic plant cultivator",
    description:
      "Learn how to use the Robotic Plant Cultivator to automate planting, save time, and boost productivity. Watch now to revolutionize your farming!",
    thumbnail: require("../../assets/r3.png"),
    duration: "4:32",
  },
  {
    id: "2",
    title: "Agricultural drone",
    description:
      "Master the art of aerial crop monitoring and precision spraying with our comprehensive guide on Agricultural Drones.",
    thumbnail: require("../../assets/r2.png"),
    duration: "6:15",
  },
  {
    id: "3",
    title: "Smart Irrigation Systems",
    description:
      "Discover how to set up and manage smart irrigation systems to optimize water usage and improve crop yield.",
    thumbnail: require("../../assets/drone_sprayer.png"),
    duration: "5:45",
  },
];

export default function FarmingGuide() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGuides = VIDEO_GUIDES.filter((guide) =>
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View className="px-5 pt-6 pb-4">
        <Text className="text-[20px] font-bold text-[#1D2939] text-center mb-2 font-parkinsans-bold">
          Master Modern Farming Tools
        </Text>
        <Text className="text-[14px] text-gray-500 text-center leading-5 px-4 font-poppins">
          Explore our video guides to learn how to use cutting-edge agricultural
          tools.
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-5 flex-row items-center mb-6 gap-3">
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

      {/* Video List */}
      <View className="pb-24">
        {filteredGuides.length > 0 ? (
          filteredGuides.map((item) => (
            <View
              key={item.id}
              className="mb-6 mx-5 bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm shadow-gray-200"
            >
              <View className="relative h-[233px] w-full">
                <Image
                  source={item.thumbnail}
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <View className="absolute inset-0 justify-center items-center bg-black/20">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="w-14 h-14 rounded-full bg-[#1C6206] justify-center items-center border-4 border-white/30"
                  >
                    <Ionicons
                      name="play"
                      size={24}
                      color="white"
                      style={{ marginLeft: 4 }}
                    />
                  </TouchableOpacity>
                </View>

                <View className="absolute bottom-4 right-4 bg-black/60 px-2 py-1 rounded-md">
                  <Text className="text-white text-xs font-medium font-poppins">
                    {item.duration}
                  </Text>
                </View>
              </View>

              <View className="p-5">
                <Text className="text-[18px] font-bold text-[#1D2939] font-parkinsans-bold mb-2">
                  {item.title}
                </Text>
                <Text className="text-[14px] text-gray-500 leading-6 font-poppins">
                  {item.description}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View className="flex-1 justify-center items-center px-10 pt-10">
            <View className="w-20 h-20 bg-gray-50 rounded-full justify-center items-center mb-4">
              <Ionicons name="videocam-outline" size={40} color="#98A2B3" />
            </View>
            <Text className="text-[18px] font-bold text-[#1D2939] font-parkinsans-bold mb-2">
              No guides found
            </Text>
            <Text className="text-gray-500 text-center font-poppins text-[14px]">
              Try searching for different farming topics or tools.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
