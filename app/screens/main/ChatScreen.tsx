import React, { useState, useEffect } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { io, Socket } from "socket.io-client";
import { BASE_URL, http } from "../../lib/fetch";
import * as SecureStore from "expo-secure-store";
import { useUserProfile } from "../../hooks/useUserProfile";

export default function ChatScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  // We expect user to come from route params, e.g. { id: '...', name: '...', avatar: '...' }
  const { user } = route.params || {};
  
  const { data: currentUser } = useUserProfile();
  
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const chatUser = user || {
    id: "farmer-123", // Fallback ID for testing
    name: "Farm Expert",
    avatar: { uri: "https://i.pravatar.cc/150?img=3" },
  };

  useEffect(() => {
    let newSocket: Socket;

    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await http.get<any[]>(`/api/v1/chat/history/${chatUser.id}`);
        if (response.success) {
          const history = response.data.map((msg: any) => ({
            id: msg.id,
            text: msg.content,
            sender: msg.senderId === currentUser?.id ? "me" : "them",
            time: new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));
          setMessages(history);
        }
      } catch (error) {
        console.error("Failed to fetch history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const initSocket = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      // Extract raw base URL, removing api/v1 if it's there
      const socketUrl = BASE_URL?.replace("/api/v1", "") || "http://localhost:4000";

      newSocket = io(socketUrl, {
        auth: { token },
      });

      newSocket.on("connect", () => {
        console.log("🟢 Connected to WebSocket Server");
        // Join 1-to-1 room right away
        if (currentUser?.id && chatUser.id) {
          newSocket.emit("joinRoom", { targetUserId: chatUser.id });
          // Check if the other user is online
          newSocket.emit("checkStatus", { targetUserId: chatUser.id });
        }
      });

      // Listen for status response
      newSocket.on("statusResponse", (data) => {
        console.log("👤 Status Response:", data);
        setIsOnline(data.isOnline);
      });

      // Listen for incoming incoming messages
      newSocket.on("receiveMessage", (message) => {
        console.log("📨 Received Message:", message);
        
        setMessages((prev) => {
          // Prevent duplicates if we optimistically added it
          if (prev.find((m) => m.id === message.id)) return prev;

          const isMe = message.senderId === currentUser?.id;
          
          return [
            ...prev,
            {
              id: message.id,
              text: message.content,
              sender: isMe ? "me" : "them",
              time: new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ];
        });
      });

      newSocket.on("disconnect", () => {
        console.log("🔴 Disconnected from WebSocket Server");
        setIsOnline(false);
      });

      setSocket(newSocket);
    };

    if (currentUser?.id) {
      fetchHistory();
      initSocket();
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [currentUser?.id, chatUser.id]);

  const handleSend = () => {
    if (!inputText.trim() || !socket || !currentUser) return;

    // Send payload to backend
    socket.emit("sendMessage", {
      targetUserId: chatUser.id,
      content: inputText,
    });

    // Optimistically update the UI
    const optimisticMessage = {
      id: Date.now().toString() + "_optimistic",
      text: inputText,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
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
            source={chatUser.avatar?.uri ? { uri: chatUser.avatar.uri } : chatUser.avatar}
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
                source={chatUser.avatar?.uri ? { uri: chatUser.avatar.uri } : chatUser.avatar}
                className="w-10 h-10 rounded-full bg-gray-200"
              />
              <View className={`absolute bottom-0 right-0 w-3 h-3 ${isOnline ? "bg-green-500" : "bg-gray-300"} rounded-full border-2 border-white`} />
            </View>
          </View>
          <View className="ml-3">
            <Text className="text-[16px] font-bold text-[#1D2939] font-parkinsans-bold">
              {chatUser.name}
            </Text>
            <Text className={`text-[12px] ${isOnline ? "text-green-600" : "text-gray-400"} font-poppins font-medium`}>
              {isOnline ? "Online" : "Offline"}
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
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-20">
            <Text className="text-gray-400 font-poppins">No messages yet. Say hello!</Text>
          </View>
        }
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
