import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const DUMMY_MESSAGES = [
  {
    id: "1",
    text: "Hello! I saw your recent post about the maize harvest. It looks fantastic! 🌽",
    sender: "them",
    time: "09:41 AM",
  },
  {
    id: "2",
    text: "Thank you! Yes, we had a really good yield this season. The new irrigation system really helped.",
    sender: "me",
    time: "09:42 AM",
  },
  {
    id: "3",
    text: "That's great to hear. I've been thinking about upgrading my irrigation too. Did you use drip or sprinkler?",
    sender: "them",
    time: "09:45 AM",
  },
  {
    id: "4",
    text: "We went with drip irrigation. It saves a lot of water and targets the roots directly. Highly recommend it! 💧",
    sender: "me",
    time: "09:46 AM",
  },
];

export default function ChatScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = route.params || {};
  const [messages, setMessages] = useState(DUMMY_MESSAGES);
  const [inputText, setInputText] = useState("");

  const chatUser = user || {
    name: "Farm Expert",
    avatar: { uri: "https://i.pravatar.cc/150?img=3" },
    isOnline: true,
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInputText("");
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.sender === "me";
    return (
      <View
        className={`flex-row mb-4 ${isMe ? "justify-end" : "justify-start"}`}
      >
        {!isMe && (
          <Image
            source={chatUser.avatar}
            className="w-8 h-8 rounded-full bg-gray-200 mr-2 self-end mb-1"
          />
        )}
        <View
          className={`max-w-[75%] px-4 py-3 rounded-2xl ${
            isMe
              ? "bg-[#1C6206] rounded-br-none"
              : "bg-gray-100 rounded-bl-none"
          }`}
        >
          <Text
            className={`text-[14px] font-poppins ${
              isMe ? "text-white" : "text-[#1D2939]"
            }`}
          >
            {item.text}
          </Text>
          <Text
            className={`text-[10px] mt-1 text-right ${
              isMe ? "text-green-200" : "text-gray-400"
            }`}
          >
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 pt-2 pb-4 border-b border-gray-100 flex-row items-center justify-between bg-white z-10">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-3 p-1"
          >
            <Ionicons name="arrow-back" size={24} color="#1D2939" />
          </TouchableOpacity>
          <View>
            <View className="relative">
              <Image
                source={chatUser.avatar}
                className="w-10 h-10 rounded-full bg-gray-200"
              />
              <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </View>
          </View>
          <View className="ml-3">
            <Text className="text-[16px] font-bold text-[#1D2939] font-parkinsans-bold">
              {chatUser.name}
            </Text>
            <Text className="text-[12px] text-green-600 font-poppins font-medium">
              Online
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="call-outline" size={24} color="#1D2939" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View className="px-5 py-3 border-t border-gray-100 bg-white flex-row items-center">
          <TouchableOpacity className="mr-3">
            <Ionicons name="add-circle-outline" size={28} color="#667085" />
          </TouchableOpacity>
          <View className="flex-1 flex-row items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200 min-h-[44px]">
            <TextInput
              placeholder="Type a message..."
              value={inputText}
              onChangeText={setInputText}
              className="flex-1 font-poppins text-[#1D2939] text-[14px]"
              multiline
            />
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="happy-outline" size={20} color="#98A2B3" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim()}
            className={`ml-3 w-11 h-11 rounded-full justify-center items-center ${
              inputText.trim() ? "bg-[#1C6206]" : "bg-gray-100"
            }`}
          >
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() ? "white" : "#98A2B3"}
              style={{ marginLeft: 2 }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
