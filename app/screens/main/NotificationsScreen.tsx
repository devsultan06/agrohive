import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Dummy Data
const NOTIFICATIONS = [
  {
    id: "1",
    type: "order",
    title: "Order Delivered",
    message:
      "Your order #12345 has been successfully delivered. Enjoy your products!",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "promo",
    title: "20% Off on Tools",
    message:
      "Limited time offer! Get 20% off on all agricultural tools. Shop now.",
    time: "5 hours ago",
    read: true,
  },
  {
    id: "3",
    type: "system",
    title: "Account Update",
    message: "Your profile information has been successfully updated.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "4",
    type: "order",
    title: "Order Shipped",
    message: "Your order #12345 is on its way! Track your shipment.",
    time: "2 days ago",
    read: true,
  },
];

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "order":
      return (
        <View className="w-10 h-10 rounded-full bg-green-100 justify-center items-center">
          <Ionicons name="cube-outline" size={20} color="#1C6206" />
        </View>
      );
    case "promo":
      return (
        <View className="w-10 h-10 rounded-full bg-orange-100 justify-center items-center">
          <Ionicons name="pricetag-outline" size={20} color="#F79009" />
        </View>
      );
    case "system":
      return (
        <View className="w-10 h-10 rounded-full bg-blue-100 justify-center items-center">
          <Ionicons name="settings-outline" size={20} color="#007AFF" />
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
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const renderItem = ({ item }: { item: any }) => (
    <View
      className={`flex-row p-4 mb-3 rounded-xl border ${
        item.read
          ? "bg-white border-gray-100"
          : "bg-green-50/50 border-green-100"
      }`}
    >
      <NotificationIcon type={item.type} />
      <View className="flex-1 ml-3">
        <View className="flex-row justify-between items-start">
          <Text
            className={`text-[14px] font-bold font-parkinsans-bold mb-1 ${
              item.read ? "text-[#1D2939]" : "text-[#1C6206]"
            }`}
          >
            {item.title}
          </Text>
          <Text className="text-[10px] text-gray-400 font-poppins">
            {item.time}
          </Text>
        </View>
        <Text className="text-[12px] text-gray-600 font-poppins leading-5">
          {item.message}
        </Text>
      </View>
    </View>
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
        <TouchableOpacity onPress={markAllAsRead}>
          <Text className="text-[12px] font-medium text-[#1C6206] font-poppins">
            Mark all as read
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {notifications.length === 0 ? (
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
