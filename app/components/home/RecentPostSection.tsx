import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { usePostStore } from "../../store/usePostStore";

const RecentPostItem = ({ recentPost }: { recentPost: any }) => {
  const navigation = useNavigation<any>();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!recentPost) return null;

  return (
    <View
      key={recentPost.id}
      className="rounded-2xl bg-white border border-gray-100 p-4 mb-6 shadow-sm shadow-gray-200"
    >
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center gap-2">
          <Image
            source={recentPost.user.avatar}
            className="w-10 h-10 rounded-full bg-gray-200"
          />
          <View>
            <Text className="text-[14px] font-bold text-[#1D2939] font-parkinsans-bold">
              {recentPost.user.name}
            </Text>
            <Text className="text-[10px] text-gray-400 font-poppins">
              {recentPost.date}
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <Text className="text-[#1C6206] text-[12px] font-bold font-poppins">
            Follow
          </Text>
        </TouchableOpacity>
      </View>

      {recentPost.image && (
        <View className="h-[200px] w-full rounded-xl bg-gray-100 overflow-hidden mb-3">
          <Image
            source={recentPost.image}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      )}

      <View className="flex-row items-center gap-4 mb-2">
        <View className="flex-row items-center gap-1">
          <Ionicons name="heart-outline" size={20} color="#1D2939" />
          <Text className="text-[12px] text-[#1D2939] font-medium font-poppins">
            {recentPost.likes}
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="chatbubble-outline" size={19} color="#1D2939" />
          <Text className="text-[12px] text-[#1D2939] font-medium font-poppins">
            {recentPost.comments}
          </Text>
        </View>
        <Feather name="download" size={19} color="#1D2939" />
        <View className="flex-1 items-end">
          <Ionicons name="bookmark-outline" size={19} color="#1D2939" />
        </View>
      </View>

      <View className="mb-3">
        <Text
          className="text-[13px] text-[#1D2939] font-poppins leading-5"
          numberOfLines={isExpanded ? undefined : 3}
        >
          {recentPost.content}
        </Text>
        {recentPost.content.length > 100 && (
          <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
            <Text className="text-[#1C6206] text-[12px] font-bold font-poppins mt-1">
              {isExpanded ? "Show less" : "Show more"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Add Comment Input */}
      <TouchableOpacity
        className="flex-row items-center mt-3 pt-3 border-t border-gray-50"
        onPress={() => navigation.navigate("PostDetails", { post: recentPost })}
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

export default function RecentPostSection() {
  const navigation = useNavigation<any>();
  const { posts } = usePostStore();
  const recentPost = posts[0];

  if (!recentPost) return null;

  return (
    <View>
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-[14px] font-bold text-[#1D2939] font-parkinsans-bold">
          Recent post
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Community", { activeTab: "AgroConnect" })
          }
        >
          <Text className="text-[12px] underline text-[#1C6206] font-medium font-poppins">
            See all posts
          </Text>
        </TouchableOpacity>
      </View>
      <RecentPostItem recentPost={recentPost} />
    </View>
  );
}
