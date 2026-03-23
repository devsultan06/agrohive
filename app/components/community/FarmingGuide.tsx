import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGuides, useIncrementViews } from "../../hooks/useGuides";
import { Video, ResizeMode } from "expo-av";

const { width, height } = Dimensions.get("window");

export default function FarmingGuide() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: guides, isLoading, refetch, isError } = useGuides(searchQuery);
  const incrementViewsMutation = useIncrementViews();
  const [refreshing, setRefreshing] = useState(false);
  const videoRef = useRef<any>(null);

  // Video Player State
  const [playingVideo, setPlayingVideo] = useState<{
    id: string;
    url: string;
    title: string;
  } | null>(null);
  const [viewedInSession, setViewedInSession] = useState<Set<string>>(
    new Set(),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handlePlay = (id: string, url: string, title: string) => {
    // 📊 Session Logic: Only increment views once per app session for each video
    if (!viewedInSession.has(id)) {
      incrementViewsMutation.mutate(id);
      setViewedInSession((prev) => new Set(prev).add(id));
    }

    setPlayingVideo({ id, url, title });
  };

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Hero Section */}
        <View className="px-5 pt-6 pb-4">
          <Text className="text-[20px] font-bold text-[#1D2939] text-center mb-2 font-parkinsans-bold">
            Master Modern Farming Tools
          </Text>
          <Text className="text-[14px] text-gray-500 text-center leading-5 px-4 font-poppins">
            Explore our video guides to learn how to use cutting-edge
            agricultural tools.
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
          {isLoading && !refreshing ? (
            <View className="py-20 justify-center items-center">
              <ActivityIndicator size="large" color="#1C6206" />
            </View>
          ) : guides && guides.length > 0 ? (
            guides.map((item) => (
              <View
                key={item.id}
                className="mb-6 mx-5 bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm shadow-gray-200"
              >
                <View className="relative h-[233px] w-full bg-gray-100">
                  <Image
                    source={
                      item.thumbnailUrl
                        ? { uri: item.thumbnailUrl }
                        : require("../../assets/r3.png")
                    }
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <View className="absolute inset-0 justify-center items-center bg-black/20">
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        handlePlay(item.id, item.videoUrl, item.title)
                      }
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

                  {(item.duration || item.views > 0) && (
                    <View className="absolute bottom-4 left-4 right-4 flex-row justify-between items-center">
                      <View className="bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-md">
                        <Text className="text-white text-[10px] font-medium font-poppins">
                          {item.views.toLocaleString()} views
                        </Text>
                      </View>
                      {item.duration && (
                        <View className="bg-black/60 px-2 py-1 rounded-md">
                          <Text className="text-white text-xs font-medium font-poppins">
                            {item.duration}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>

                <View className="p-5">
                  <Text className="text-[18px] font-bold text-[#1D2939] font-parkinsans-bold mb-2">
                    {item.title}
                  </Text>
                  <Text
                    className="text-[14px] text-gray-500 leading-6 font-poppins"
                    numberOfLines={3}
                  >
                    {item.description}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <View className="flex-1 justify-center items-center px-10 pt-10">
              <View className="w-20 h-20 bg-gray-50 rounded-full justify-center items-center mb-4">
                <Ionicons
                  name={isError ? "alert-circle-outline" : "videocam-outline"}
                  size={40}
                  color="#98A2B3"
                />
              </View>
              <Text className="text-[18px] font-bold text-[#1D2939] font-parkinsans-bold mb-2 text-center">
                {isError ? "Network error" : "No guides found"}
              </Text>
              <Text className="text-gray-500 text-center font-poppins text-[14px]">
                {isError
                  ? "Failed to fetch guides. Please pull down to refresh."
                  : searchQuery
                    ? "Try searching for different farming topics or tools."
                    : "Be the first to share something with the community!"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 📹 Fullscreen Video Player Modal */}
      <Modal
        visible={!!playingVideo}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setPlayingVideo(null)}
      >
        <View className="flex-1 bg-black justify-center">
          <TouchableOpacity
            onPress={() => setPlayingVideo(null)}
            className="absolute top-12 right-6 z-10 w-10 h-10 bg-white/20 rounded-full items-center justify-center backdrop-blur-md"
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          {playingVideo && (
            <Video
              ref={videoRef}
              source={{ uri: playingVideo.url }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              useNativeControls
              style={{ width: width, height: height * 0.4 }}
              onPlaybackStatusUpdate={(status: any) => {
                if (status.didJustFinish) {
                  videoRef.current?.setPositionAsync(0);
                }
              }}
              onError={(e) => console.log("Video Error:", e)}
            />
          )}

          <View className="px-6 mt-8">
            <Text className="text-white text-[20px] font-bold font-parkinsans-bold mb-2">
              {playingVideo?.title}
            </Text>
            <ScrollView className="max-h-[200px]">
              <Text className="text-gray-400 text-[14px] font-poppins leading-6">
                {guides?.find((g) => g.id === playingVideo?.id)?.description}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
