import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const ProfileMenuItem = ({
  icon,
  label,
  count,
  onPress,
}: {
  icon: any;
  label: string;
  count?: number;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between py-[20px] border-b border-gray-50 mx-4"
  >
    <View className="flex-row items-center">
      {icon}
      <Text className="text-[14px] font-medium text-[#1D2939] ml-3 font-poppins">
        {label}
      </Text>
    </View>
    <View className="flex-row items-center">
      {count !== undefined && (
        <View className="bg-gray-100 rounded-full px-2 py-1 mr-2">
          <Text className="text-[12px] text-gray-500 font-poppins">
            {count}
          </Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={20} color="#98A2B3" />
    </View>
  </TouchableOpacity>
);

export default function PublicProfileScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = route.params || {};
  const [isFollowing, setIsFollowing] = useState(false);

  // Fallback if no user passed
  const profileUser = user || {
    name: "Farm Expert",
    avatar: { uri: "https://i.pravatar.cc/150?img=3" },
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Back Button */}
        <View className="px-5 pt-2 mb-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 justify-center items-center"
          >
            <Ionicons name="arrow-back" size={24} color="#1D2939" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View className="items-center mb-8 px-5">
          <View className="w-[100px] h-[100px] rounded-full border-4 border-white shadow-sm overflow-hidden bg-gray-200 mb-4">
            <Image source={profileUser.avatar} className="w-full h-full" />
          </View>

          <Text className="text-[20px] font-bold text-[#101828] font-parkinsans-bold text-center">
            {profileUser.name}
          </Text>
          <Text className="text-[14px] text-gray-500 font-poppins mt-1 mb-4 text-center">
            Maize Farmer • Lagos, Nigeria
          </Text>

          {/* Stats */}
          <View className="flex-row items-center gap-6 mb-6">
            <View className="items-center">
              <Text className="text-[16px] font-bold text-[#1D2939] font-parkinsans-bold">
                1.2k
              </Text>
              <Text className="text-[12px] text-gray-400 font-poppins">
                Followers
              </Text>
            </View>
            <View className="w-[1px] h-8 bg-gray-200" />
            <View className="items-center">
              <Text className="text-[16px] font-bold text-[#1D2939] font-parkinsans-bold">
                85
              </Text>
              <Text className="text-[12px] text-gray-400 font-poppins">
                Following
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row items-center gap-3 w-full justify-center">
            <TouchableOpacity
              onPress={() => setIsFollowing(!isFollowing)}
              className={`flex-1 h-[48px] rounded-full flex-row justify-center items-center ${
                isFollowing ? "bg-white border border-gray-200" : "bg-[#1C6206]"
              }`}
            >
              <Text
                className={`text-[14px] font-bold font-poppins ml-2 ${
                  isFollowing ? "text-[#1D2939]" : "text-white"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Chat", { user: profileUser })}
              className="flex-1 h-[48px] bg-gray-50 rounded-full flex-row justify-center items-center border border-gray-200"
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={20}
                color="#1D2939"
              />
              <Text className="text-[14px] font-bold text-[#1D2939] ml-2 font-poppins">
                Message
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Items */}
        <View className="bg-white rounded-[20px] mx-5 border border-black/[0.03] mb-6">
          <ProfileMenuItem
            icon={
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#344054"
              />
            }
            label="All posts"
            count={5}
            onPress={() => {
              // TODO: Navigate to filtered posts view
              // navigation.navigate("UserPosts", { userId: profileUser.id });
            }}
          />
          <ProfileMenuItem
            icon={
              <Ionicons name="chatbubble-outline" size={20} color="#344054" />
            }
            label="Comments"
            count={12}
            onPress={() => {}}
          />
          <ProfileMenuItem
            icon={<Ionicons name="heart-outline" size={20} color="#344054" />}
            label="Likes"
            count={24}
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
