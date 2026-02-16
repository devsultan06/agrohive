import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function LearnFarmingToolsSection() {
  const navigation = useNavigation<any>();

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-[14px] font-bold text-[#1D2939] font-parkinsans-bold">
          Learn farming tools
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Community", { activeTab: "Farming Guide" })
          }
        >
          <Text className="text-[12px] underline text-[#1C6206] font-medium font-poppins">
            See all videos
          </Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm shadow-gray-200">
        <View className="relative h-[233px] w-full">
          <Image
            source={require("../../assets/r3.png")} // Thumbnail for Robotic plant cultivator
            className="w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 justify-center items-center bg-black/20">
            <TouchableOpacity
              activeOpacity={0.8}
              className="w-14 h-14 rounded-full bg-[#1C6206] justify-center items-center border-4 border-white/30"
              onPress={() =>
                navigation.navigate("Community", {
                  activeTab: "Farming Guide",
                })
              }
            >
              <Ionicons
                name="play"
                size={24}
                color="white"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View className="p-4">
          <Text className="text-[16px] font-bold text-[#1D2939] font-parkinsans-bold mb-2">
            Robotic plant cultivator
          </Text>
          <Text className="text-[13px] text-gray-500 leading-5 font-poppins">
            Learn how to use the Robotic Plant Cultivator to automate planting,
            save time, and boost productivity. Watch now to revolutionize your
            farming!
          </Text>
        </View>
      </View>
    </View>
  );
}
