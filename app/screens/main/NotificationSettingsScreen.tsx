import React, { useState } from "react";
import { View, Text, Switch, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const NotificationSettingItem = ({
  label,
  description,
  value,
  onValueChange,
}: {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
}) => (
  <View className="flex-row items-center justify-between py-4 border-b border-gray-100">
    <View className="flex-1 pr-4">
      <Text className="text-[14px] font-medium text-[#1D2939] font-poppins">
        {label}
      </Text>
      {description && (
        <Text className="text-[12px] text-gray-400 mt-1 font-poppins">
          {description}
        </Text>
      )}
    </View>
    <Switch
      value={value}
      onValueChange={onValueChange}
      trackColor={{ false: "#E4E7EC", true: "#1C6206" }}
      thumbColor={"#FFFFFF"}
      ios_backgroundColor="#E4E7EC"
    />
  </View>
);

export default function NotificationSettingsScreen() {
  const navigation = useNavigation<any>();

  // State for different notification types
  const [likes, setLikes] = useState(true);
  const [comments, setComments] = useState(true);
  const [follows, setFollows] = useState(true);
  const [mentions, setMentions] = useState(true);

  const [orders, setOrders] = useState(true);
  const [promos, setPromos] = useState(false);

  const [weather, setWeather] = useState(true);
  const [pests, setPests] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 py-4 flex-row items-center border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#1D2939" />
        </TouchableOpacity>
        <Text className="text-[18px] font-bold text-[#1D2939] font-parkinsans-bold">
          Notification Settings
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {/* Community Section */}
        <View className="mb-6">
          <Text className="text-[16px] font-bold text-[#1C6206] mb-2 mt-4 font-parkinsans-bold">
            Community Activity
          </Text>
          <NotificationSettingItem
            label="Likes"
            description="Notify when someone likes your post"
            value={likes}
            onValueChange={setLikes}
          />
          <NotificationSettingItem
            label="Comments"
            description="Notify when someone comments on your post"
            value={comments}
            onValueChange={setComments}
          />
          <NotificationSettingItem
            label="New Followers"
            description="Notify when someone starts following you"
            value={follows}
            onValueChange={setFollows}
          />
          <NotificationSettingItem
            label="Mentions"
            description="Notify when you are mentioned in a post"
            value={mentions}
            onValueChange={setMentions}
          />
        </View>

        {/* Market Section */}
        <View className="mb-6">
          <Text className="text-[16px] font-bold text-[#1C6206] mb-2 font-parkinsans-bold">
            Market & Orders
          </Text>
          <NotificationSettingItem
            label="Order Updates"
            description="Status updates for your purchases"
            value={orders}
            onValueChange={setOrders}
          />
          <NotificationSettingItem
            label="Promotions & Discounts"
            description="Get notified about sales and special offers"
            value={promos}
            onValueChange={setPromos}
          />
        </View>

        {/* Farming Alerts Section */}
        <View className="mb-6">
          <Text className="text-[16px] font-bold text-[#1C6206] mb-2 font-parkinsans-bold">
            Farming Alerts
          </Text>
          <NotificationSettingItem
            label="Weather Alerts"
            description="Severe weather warnings for your area"
            value={weather}
            onValueChange={setWeather}
          />
          <NotificationSettingItem
            label="Pest Outbreaks"
            description="Alerts about local pest threats"
            value={pests}
            onValueChange={setPests}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
