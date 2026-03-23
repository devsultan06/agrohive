import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const CHATS = [
  {
    id: "1",
    user: {
      name: "Farm Expert",
      avatar: { uri: "https://i.pravatar.cc/150?img=3" },
      isOnline: true,
    },
    lastMessage: "That's great to hear. I've been thinking about...",
    time: "09:45 AM",
    unread: 0,
  },
  {
    id: "2",
    user: {
      name: "Green Valley Farms",
      avatar: { uri: "https://i.pravatar.cc/150?img=8" },
      isOnline: false,
    },
    lastMessage: "Is the fertilizer still available? I need 20 bags.",
    time: "2 hrs ago",
    unread: 2,
  },
  {
    id: "3",
    user: {
      name: "John Doe",
      avatar: { uri: "https://i.pravatar.cc/150?img=12" },
      isOnline: true,
    },
    lastMessage: "Thanks for the tips! The crop yield improved.",
    time: "Yesterday",
    unread: 0,
  },
  {
    id: "4",
    user: {
      name: "AgroAssist Support",
      avatar: { uri: "https://i.pravatar.cc/150?img=60" }, // Placeholder for support
      isOnline: false,
    },
    lastMessage: "Your query ticket #402 has been resolved.",
    time: "Mon",
    unread: 0,
  },
];

export default function MessageListScreen() {
  const navigation = useNavigation<any>();

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Chat", { user: item.user })}
      className="flex-row items-center p-4 bg-white mb-[1px]"
    >
      <View className="relative">
        <Image
          source={item.user.avatar}
          className="w-[50px] h-[50px] rounded-full bg-gray-200"
        />
        {item.user.isOnline && (
          <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
        )}
      </View>

      <View className="flex-1 ml-4 border-b border-gray-50 pb-4">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-[16px] font-bold text-[#1D2939] font-parkinsans-bold">
            {item.user.name}
          </Text>
          <Text
            className={`text-[11px] font-poppins ${
              item.unread > 0 ? "text-[#1C6206] font-bold" : "text-gray-400"
            }`}
          >
            {item.time}
          </Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text
            numberOfLines={1}
            className={`text-[13px] flex-1 mr-4 font-poppins ${
              item.unread > 0 ? "text-[#1D2939] font-medium" : "text-gray-500"
            }`}
          >
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View className="w-5 h-5 bg-[#1C6206] rounded-full justify-center items-center">
              <Text className="text-[10px] text-white font-bold font-poppins">
                {item.unread}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 pt-2 pb-4 border-b border-gray-100 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="#1D2939" />
          </TouchableOpacity>
          <Text className="text-[20px] font-bold text-[#1D2939] font-parkinsans-bold">
            Messages
          </Text>
        </View>
        <TouchableOpacity className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center">
          <Ionicons name="create-outline" size={24} color="#1D2939" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={CHATS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
