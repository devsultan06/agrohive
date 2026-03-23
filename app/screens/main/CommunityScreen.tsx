import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import FarmingGuide from "../../components/community/FarmingGuide";
import AgroConnect from "../../components/community/AgroConnect";

export default function CommunityScreen() {
  const route = useRoute<any>();
  const [activeTab, setActiveTab] = useState("AgroConnect");

  useEffect(() => {
    if (route.params?.activeTab) {
      setActiveTab(route.params.activeTab);
    }
  }, [route.params]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Tabs */}
      <View className="flex-row border-b border-gray-100 px-5 pt-2">
        <TouchableOpacity
          onPress={() => setActiveTab("AgroConnect")}
          className={`flex-1 pb-4 items-center ${
            activeTab === "AgroConnect"
              ? "border-b-2 border-[#1C6206]"
              : "border-b-2 border-transparent"
          }`}
        >
          <Text
            className={`text-[16px] font-medium font-poppins ${
              activeTab === "AgroConnect" ? "text-[#1C6206]" : "text-gray-400"
            }`}
          >
            AgroConnect
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("Farming Guide")}
          className={`flex-1 pb-4 items-center ${
            activeTab === "Farming Guide"
              ? "border-b-2 border-[#1C6206]"
              : "border-b-2 border-transparent"
          }`}
        >
          <Text
            className={`text-[16px] font-medium font-poppins ${
              activeTab === "Farming Guide" ? "text-[#1C6206]" : "text-gray-400"
            }`}
          >
            Farming Guide
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "Farming Guide" ? <FarmingGuide /> : <AgroConnect />}
    </SafeAreaView>
  );
}
