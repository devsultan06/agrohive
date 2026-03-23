import React, { useState, memo } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { UserAvatar } from "../UserAvatar";

interface PostItemProps {
  item: any;
  onLike: (id: string) => void;
  onBookmark: (id: string) => void;
  onFollow?: (id: string, name: string) => void;
  currentUserId?: string;
  navigation: any;
  showFollow?: boolean;
}

const PostItem = memo(
  ({
    item,
    onLike,
    onBookmark,
    onFollow,
    currentUserId,
    navigation,
    showFollow = true,
  }: PostItemProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
      <View className="bg-white p-4 mb-4 rounded-[20px] border border-gray-100 shadow-sm mx-5">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity
            className="flex-row items-center flex-1"
            onPress={() =>
              navigation.navigate("PublicProfile", { user: item.user })
            }
          >
            <UserAvatar
              uri={
                item.user.avatar?.uri ||
                (typeof item.user.avatar === "string" ? item.user.avatar : null)
              }
              fullName={item.user.name}
              size={40}
            />
            <View className="ml-3 flex-1">
              <View className="flex-row items-center">
                <Text className="text-[14px] font-bold text-[#1D2939] font-parkinsans-bold">
                  {item.user.name}
                </Text>
                <Text className="text-[12px] text-gray-400 font-poppins ml-2">
                  {item.date}
                </Text>
              </View>
              <Text className="text-[11px] text-gray-400 font-poppins">
                @{item.user.username}
              </Text>
            </View>
          </TouchableOpacity>
          {showFollow && currentUserId !== item.user.id && onFollow && (
            <TouchableOpacity
              onPress={() => onFollow(item.user.id, item.user.name)}
            >
              <Text className="text-[#1C6206] text-[12px] font-bold font-poppins">
                {item.isFollowing ? "Unfollow" : "Follow"}
              </Text>
            </TouchableOpacity>
          )}
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

        {/* Content */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text
            className="text-[14px] text-[#475467] font-poppins leading-5 mb-4"
            numberOfLines={isExpanded ? undefined : 3}
          >
            {item.content}
          </Text>
        </TouchableOpacity>

        {/* Stats */}
        <View className="flex-row items-center justify-between pt-3 border-t border-gray-50">
          <View className="flex-row items-center gap-5">
            <TouchableOpacity
              onPress={() => onLike(item.id)}
              className="flex-row items-center gap-1.5"
            >
              <Ionicons
                name={item.isLiked ? "heart" : "heart-outline"}
                size={22}
                color={item.isLiked ? "#F04438" : "#667085"}
              />
              <Text className="text-[13px] text-[#667085] font-poppins">
                {item.likes}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("PostDetails", { post: item })}
              className="flex-row items-center gap-1.5"
            >
              <Feather name="message-circle" size={20} color="#667085" />
              <Text className="text-[13px] text-[#667085] font-poppins">
                {item.comments}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center gap-1.5">
              <Feather name="share-2" size={18} color="#667085" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => onBookmark(item.id)}>
            <Ionicons
              name={item.isSaved ? "bookmark" : "bookmark-outline"}
              size={20}
              color={item.isSaved ? "#1C6206" : "#667085"}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

export default PostItem;
