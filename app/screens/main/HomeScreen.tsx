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
import * as Location from "expo-location";
import {
  fetchWeatherByCoords,
  WeatherData,
} from "../../services/weather/weather.service";
import { useEffect } from "react";
import { Toast } from "../../components/Toast";
import RecentPostSection from "../../components/home/RecentPostSection";
import LearnFarmingToolsSection from "../../components/home/LearnFarmingToolsSection";
import FarmProductsSection from "../../components/home/FarmProductsSection";

const { width } = Dimensions.get("window");

import { SideMenu } from "../../components/SideMenu";
import { UserAvatar } from "../../components/UserAvatar";
import { useUserProfile } from "../../hooks/useUserProfile";
import { HomeSkeleton } from "../../components/skeletons/HomeSkeleton";

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [toastVisible, setToastVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [weather, setWeather] = useState<WeatherData | null>({
    temp: 35,
    humidity: 72,
    windSpeed: 12,
    description: "clear sky",
    name: "Ajah Lago",
    date: new Date().toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  });
  const [locationError, setLocationError] = useState<string | null>(null);
  const { data: user, isError, error } = useUserProfile();

  useEffect(() => {
    if (user) console.log("👤 Profile loaded successfully:", user.fullName);
    if (isError) console.log("❌ Profile fetch failed:", error);
  }, [user, isError, error]);

  useEffect(() => {
    (async () => {
      // Set default weather immediately to stop skeleton hang
      fetchWeatherByCoords(6.4582, 3.5263).then((defaultWeather) => {
        setWeather(defaultWeather);
      });

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLocationError("Permission to access location was denied");
        return;
      }

      try {
        // Try to get real location in background
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        const data = await fetchWeatherByCoords(
          location.coords.latitude,
          location.coords.longitude,
        );
        setWeather(data);
      } catch (error) {
        console.log("Location fetch status:", error);
      }
    })();
  }, []);

  if (!user || !weather) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <HomeSkeleton />
      </SafeAreaView>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning.";
    if (hour < 17) return "Good afternoon.";
    return "Good evening.";
  };

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
            <UserAvatar
              uri={user.avatarUrl}
              fullName={user.fullName}
              size={40}
            />
            <View>
              <Text className="text-[16px] font-bold text-[#000000] font-parkinsans-bold">
                Hi {user.fullName ? user.fullName.split(" ")[0] : "User"},
              </Text>
              <Text className="text-[12px] text-gray-500 font-poppins">
                {getGreeting()}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => navigation.navigate("MessageList")}
              className="w-[44px] h-[44px] bg-white rounded-full justify-center items-center"
              style={{
                shadowColor: "#92B3BD",
                shadowOffset: { width: 1.497, height: 1.497 },
                shadowOpacity: 0.2,
                shadowRadius: 5.986,
                elevation: 5,
              }}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={22}
                color="#1C6206"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              className="w-[44px] h-[44px] bg-white rounded-full justify-center items-center"
              style={{
                shadowColor: "#92B3BD",
                shadowOffset: { width: 1.497, height: 1.497 },
                shadowOpacity: 0.2,
                shadowRadius: 5.986,
                elevation: 5,
              }}
            >
              <MenuIcon width={17} height={17} />
            </TouchableOpacity>
          </View>
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
                {weather
                  ? `${weather.name}, ${weather.date}`
                  : "Ajah Lago, Mon 27 Nov 2023"}
              </Text>
              <Text className="text-[20px] mb-[4px] font-bold text-[#1C6206] font-parkinsans-bold">
                {weather ? `${weather.temp}°C` : "--°C"}
              </Text>
              <Text className="text-[12px] text-[#1D2939] font-poppins">
                Humidity {weather ? `${weather.humidity}%` : "--%"}
              </Text>
            </View>
            <View className="items-center">
              <View className="mb-1">
                <Ionicons
                  name={
                    weather?.description.includes("rain")
                      ? "rainy-outline"
                      : "cloud-outline"
                  }
                  size={40}
                  color="#A0A0A0"
                />
                <View className="absolute top-0 right-0">
                  <Ionicons name="sunny" size={20} color="#FFD700" />
                </View>
              </View>
              <Text className="text-[12px] font-medium text-[#1D2939] font-poppins capitalize">
                {weather ? weather.description : "Loading..."}
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
