import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  useNotifications,
  useMarkAllAsRead,
  useMarkAsRead,
} from "../../hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { NotificationType } from "../../services/notifications/notifications.service";

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case "ORDER_UPDATE":
      return (
        <View className="w-10 h-10 rounded-full bg-green-100 justify-center items-center">
          <Ionicons name="cube-outline" size={20} color="#1C6206" />
        </View>
      );
    case "PROMOTION":
      return (
        <View className="w-10 h-10 rounded-full bg-orange-100 justify-center items-center">
          <Ionicons name="pricetag-outline" size={20} color="#F79009" />
        </View>
      );
    case "SYSTEM":
      return (
        <View className="w-10 h-10 rounded-full bg-blue-100 justify-center items-center">
          <Ionicons name="settings-outline" size={20} color="#007AFF" />
        </View>
      );
    case "LIKE":
      return (
        <View className="w-10 h-10 rounded-full bg-red-100 justify-center items-center">
          <Ionicons name="heart" size={20} color="#F04438" />
        </View>
      );
    case "COMMENT":
      return (
        <View className="w-10 h-10 rounded-full bg-purple-100 justify-center items-center">
          <Ionicons name="chatbubble" size={20} color="#7F56D9" />
        </View>
      );
    case "FOLLOW":
      return (
        <View className="w-10 h-10 rounded-full bg-teal-100 justify-center items-center">
          <Ionicons name="person-add" size={20} color="#0D9488" />
        </View>
      );
    case "WELCOME":
      return (
        <View className="w-10 h-10 rounded-full bg-green-100 justify-center items-center">
          <Ionicons name="sparkles" size={20} color="#1C6206" />
        </View>
      );
    default:
      return (
        <View className="w-10 h-10 rounded-full bg-gray-100 justify-center items-center">
          <Ionicons name="notifications-outline" size={20} color="#667085" />
        </View>
      );
  }
};

export default function NotificationsScreen() {
  const navigation = useNavigation<any>();
  const { data: notifications = [], isLoading } = useNotifications();
  const markAllReadMutation = useMarkAllAsRead();
  const markAsReadMutation = useMarkAsRead();

  const handleMarkAllAsRead = () => {
    markAllReadMutation.mutate();
  };

  const handleNotificationPress = (item: any) => {
    // 1. Mark as read if not already
    if (!item.isRead) {
      markAsReadMutation.mutate(item.id);
    }

    // 2. Handle Navigation based on metadata
    if (item.metadata?.screen) {
      if (item.metadata.screen === "Marketplace") {
        // Assuming Main is the tab navigator and Shop is the marketplace tab
        navigation.navigate("Main", { screen: "Shop" });
      } else {
        navigation.navigate(item.metadata.screen, item.metadata.params);
      }
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => handleNotificationPress(item)}
      className={`flex-row p-4 mb-3 rounded-xl border ${
        item.isRead
          ? "bg-white border-gray-100"
          : "bg-green-50/50 border-green-100"
      }`}
    >
      <NotificationIcon type={item.type} />
      <View className="flex-1 ml-3">
        <View className="flex-row justify-between items-start">
          <Text
            className={`text-[14px] font-bold font-parkinsans-bold mb-1 ${
              item.isRead ? "text-[#1D2939]" : "text-[#1C6206]"
            }`}
          >
            {item.title}
          </Text>
          <Text className="text-[10px] text-gray-400 font-poppins">
            {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
          </Text>
        </View>
        <Text className="text-[12px] text-gray-600 font-poppins leading-5">
          {item.message}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white px-5 pt-2">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="#1D2939" />
          </TouchableOpacity>
          <Text className="text-[20px] font-bold text-[#1D2939] font-parkinsans-bold">
            Notifications
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleMarkAllAsRead}
          disabled={notifications.length === 0 || markAllReadMutation.isPending}
        >
          <Text
            className={`text-[12px] font-medium font-poppins ${
              notifications.length === 0 ? "text-gray-300" : "text-[#1C6206]"
            }`}
          >
            Mark all as read
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#1C6206" />
        </View>
      ) : notifications.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <View className="w-20 h-20 bg-gray-50 rounded-full justify-center items-center mb-4">
            <Ionicons
              name="notifications-off-outline"
              size={40}
              color="#98A2B3"
            />
          </View>
          <Text className="text-[#1D2939] font-bold text-[18px] font-parkinsans-bold mb-2">
            No notifications
          </Text>
          <Text className="text-gray-500 text-center px-10 font-poppins text-[14px]">
            You're all caught up! Check back later for updates.
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}
