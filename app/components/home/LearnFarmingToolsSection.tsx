import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  fetchGuides,
  FarmingGuide,
} from "../../services/community/guide.service";

export default function LearnFarmingToolsSection() {
  const navigation = useNavigation<any>();
  const [guides, setGuides] = useState<FarmingGuide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGuides = async () => {
      try {
        const data = await fetchGuides();
        // Only take the first 2 as requested
        setGuides(data.slice(0, 2));
      } catch (err) {
        console.error("Failed to load guides:", err);
      } finally {
        setLoading(false);
      }
    };
    loadGuides();
  }, []);

  if (loading && guides.length === 0) {
    return (
      <View className="mb-6 h-[100px] justify-center items-center">
        <ActivityIndicator color="#1C6206" />
      </View>
    );
  }

  if (guides.length === 0) return null;

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-[14px] font-bold text-[#1D2939] font-parkinsans-bold">
          Learn farming tools
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Main", {
              screen: "Community",
              params: { activeTab: "Farming Guide" },
            })
          }
        >
          <Text className="text-[12px] underline text-[#1C6206] font-medium font-poppins">
            See all videos
          </Text>
        </TouchableOpacity>
      </View>

      <View className="space-y-4">
        {guides.map((guide) => (
          <View
            key={guide.id}
            className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm shadow-gray-200 mb-4"
          >
            <View className="relative h-[233px] w-full">
              {guide.thumbnailUrl ? (
                <Image
                  source={{ uri: guide.thumbnailUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-full bg-gray-100 items-center justify-center">
                  <Ionicons name="image-outline" size={48} color="#D1D5DB" />
                </View>
              )}
              <View className="absolute inset-0 justify-center items-center bg-black/20">
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="w-14 h-14 rounded-full bg-[#1C6206] justify-center items-center border-4 border-white/30"
                  onPress={() =>
                    navigation.navigate("Main", {
                      screen: "Community",
                      params: { activeTab: "Farming Guide" },
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
                {guide.title}
              </Text>
              <Text
                className="text-[13px] text-gray-500 leading-5 font-poppins"
                numberOfLines={3}
              >
                {guide.description}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
