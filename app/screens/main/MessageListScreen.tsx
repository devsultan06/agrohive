import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  RefreshControl,
  ActivityIndicator 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { http } from "../../lib/fetch";
import { formatDistanceToNow } from "date-fns";

export default function MessageListScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConversations = useCallback(async () => {
    try {
      const response = await http.get<any[]>("/api/v1/chat/conversations");
      if (response.success) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchConversations();
    }
  }, [isFocused, fetchConversations]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  const renderItem = ({ item }: { item: any }) => {
    const { otherUser, lastMessage, lastMessageAt, roomId } = item;
    
    // Map backend user to UI expected format
    const displayUser = {
      id: otherUser.id,
      name: otherUser.fullName,
      avatar: otherUser.avatarUrl ? { uri: otherUser.avatarUrl } : { uri: `https://ui-avatars.com/api/?name=${otherUser.fullName}&background=random` },
    };

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("Chat", { user: displayUser })}
        className="flex-row items-center p-4 bg-white mb-[1px]"
      >
        <View className="relative">
          <Image
            source={displayUser.avatar}
            className="w-[50px] h-[50px] rounded-full bg-gray-200"
          />
        </View>

        <View className="flex-1 ml-4 border-b border-gray-50 pb-4">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-[16px] font-bold text-[#1D2939] font-parkinsans-bold">
              {displayUser.name}
            </Text>
            <Text className="text-[11px] font-poppins text-gray-400">
              {formatDistanceToNow(new Date(lastMessageAt), { addSuffix: true })}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text
              numberOfLines={1}
              className="text-[13px] text-gray-500 flex-1 mr-4 font-poppins"
            >
              {lastMessage}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#1C6206" />
        </View>
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={(item) => item.roomId}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-20 px-10">
              <View className="w-20 h-20 bg-gray-50 rounded-full justify-center items-center mb-4">
                <Ionicons name="chatbubbles-outline" size={40} color="#98A2B3" />
              </View>
              <Text className="text-[18px] font-bold text-[#1D2939] font-parkinsans-bold mb-2">
                No messages yet
              </Text>
              <Text className="text-gray-500 text-center font-poppins text-[14px]">
                Start a conversation with a farmer or seller to see them here.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
