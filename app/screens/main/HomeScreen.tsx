import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MenuIcon from "../../assets/menu.svg";
import { useNavigation } from "@react-navigation/native";
import { useFavoriteStore } from "../../store/useFavoriteStore";
import { Toast } from "../../components/Toast";
import RecentPostSection from "../../components/home/RecentPostSection";
import LearnFarmingToolsSection from "../../components/home/LearnFarmingToolsSection";
import FarmProductsSection from "../../components/home/FarmProductsSection";

const { width } = Dimensions.get("window");

import { useUserStore } from "../../store/useUserStore";
import { SideMenu } from "../../components/SideMenu";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [toastVisible, setToastVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useUserStore();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="px-5 pt-2"
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-[31px]">
          <View className="flex-row items-center gap-3">
            <Image
              source={{
                uri: user.avatar || "https://i.pravatar.cc/150?img=12",
              }}
              className="w-10 h-10 rounded-full bg-gray-200"
            />
            <View>
              <Text className="text-[16px] font-bold text-[#000000] font-parkinsans-bold">
                Hi {user.name.split(" ")[0]},
              </Text>
              <Text className="text-[12px] text-gray-500 font-poppins">
                Good afternoon.
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            className="w-[44px] h-[44px] bg-white rounded-full justify-center items-center"
            style={{
              shadowColor: "#92B3BD",
              shadowOffset: { width: 1.497, height: 1.497 },
              shadowOpacity: 0.2,
              shadowRadius: 5.986,
              elevation: 5, // Android fallback
            }}
          >
            <MenuIcon width={17} height={17} />
          </TouchableOpacity>
        </View>

        {/* Weather Update */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-[14px] font-bold text-[#1D2939] font-parkinsans-bold">
            Weather Update
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Weather")}>
            <Text className="text-[12px] underline text-[#1C6206] font-medium font-poppins">
              See forecast
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Weather")}
          className="bg-[#FAFAFA] rounded-2xl p-5 mb-6 border border-gray-100"
        >
          <View className="flex-row justify-between mb-4">
            <View>
              <Text className="text-[12px] text-gray-500 mb-[4px] font-poppins">
                Ajah Lago, Mon 27 Nov 2023
              </Text>
              <Text className="text-[20px] mb-[4px] font-bold text-[#1C6206] font-parkinsans-bold">
                35°C
              </Text>
              <Text className="text-[12px] text-[#1D2939] font-poppins">
                Humidity 72%
              </Text>
            </View>
            <View className="items-center">
              <View className="mb-1">
                <Ionicons name="cloud-outline" size={40} color="#A0A0A0" />
                <View className="absolute top-0 right-0">
                  <Ionicons name="sunny" size={20} color="#FFD700" />
                </View>
              </View>
              <Text className="text-[12px] font-medium text-[#1D2939] font-poppins">
                Cloudy
              </Text>
            </View>
          </View>
          <View className="h-[1px] bg-gray-200 w-full mb-3" />
          <Text className="text-[12px] text-gray-500 font-poppins">
            Today is a good day to apply insecticide
          </Text>
        </TouchableOpacity>

        {/* Farm Products */}
        <FarmProductsSection />

        {/* Recent Post */}
        <RecentPostSection />

        {/* Learn Farming Tools */}
        <LearnFarmingToolsSection />
        <Toast
          message="Added to cart"
          visible={toastVisible}
          onHide={() => setToastVisible(false)}
        />
        <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
      </ScrollView>
    </SafeAreaView>
  );
}
