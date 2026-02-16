import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const FORECAST = [
  { day: "Tue", temp: "32°C", icon: "sunny", status: "Sunny" },
  { day: "Wed", temp: "29°C", icon: "rainy", status: "Rain" },
  { day: "Thu", temp: "30°C", icon: "partly-sunny", status: "Cloudy" },
  { day: "Fri", temp: "31°C", icon: "sunny", status: "Sunny" },
  { day: "Sat", temp: "28°C", icon: "rainy", status: "Heavy Rain" },
  { day: "Sun", temp: "33°C", icon: "sunny", status: "Sunny" },
];

export default function WeatherScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 px-5 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="#1D2939" />
          </TouchableOpacity>
          <Text className="text-[20px] font-bold text-[#1D2939] font-parkinsans-bold">
            Weather Forecast
          </Text>
        </View>

        {/* Current Weather Card */}
        <View className="bg-[#FAFAFA] rounded-2xl p-6 mb-6 border border-gray-100 items-center">
          <Text className="text-[16px] font-medium text-gray-500 mb-2 font-poppins">
            Ajah, Lagos
          </Text>
          <Text className="text-[14px] text-gray-400 mb-6 font-poppins">
            Mon, 27 Nov 2023
          </Text>

          <View className="items-center mb-6">
            <Ionicons name="sunny" size={80} color="#FFD700" />
            <Text className="text-[48px] font-bold text-[#1C6206] font-parkinsans-bold mt-2">
              35°C
            </Text>
            <Text className="text-[18px] font-medium text-[#1D2939] font-poppins">
              Sunny & Hot
            </Text>
          </View>

          <View className="flex-row justify-between w-full px-4">
            <View className="items-center">
              <Feather name="wind" size={20} color="#667085" />
              <Text className="text-[12px] text-gray-500 mt-1 font-poppins">
                Wind
              </Text>
              <Text className="text-[14px] font-bold text-[#1D2939] font-poppins-bold">
                12 km/h
              </Text>
            </View>
            <View className="items-center">
              <Ionicons name="water-outline" size={20} color="#667085" />
              <Text className="text-[12px] text-gray-500 mt-1 font-poppins">
                Humidity
              </Text>
              <Text className="text-[14px] font-bold text-[#1D2939] font-poppins-bold">
                72%
              </Text>
            </View>
            <View className="items-center">
              <Feather name="umbrella" size={20} color="#667085" />
              <Text className="text-[12px] text-gray-500 mt-1 font-poppins">
                Rain
              </Text>
              <Text className="text-[14px] font-bold text-[#1D2939] font-poppins-bold">
                0%
              </Text>
            </View>
          </View>
        </View>

        {/* Farming Tip */}
        <View className="bg-green-50 p-4 rounded-xl mb-8 flex-row items-start">
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#1C6206"
          />
          <View className="ml-3 flex-1">
            <Text className="text-[14px] font-bold text-[#1C6206] mb-1 font-poppins-bold">
              Farming Advisory
            </Text>
            <Text className="text-[12px] text-[#1C6206] leading-5 font-poppins">
              High temperature expected today. Ensure sufficient irrigation for
              your crops early in the morning or late evening to prevent heat
              stress.
            </Text>
          </View>
        </View>

        {/* 7-Day Forecast */}
        <Text className="text-[18px] font-bold text-[#1D2939] mb-4 font-parkinsans-bold">
          Next 7 Days
        </Text>
        <View className="gap-3 mb-10">
          {FORECAST.map((item, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between bg-white p-4 rounded-xl border border-gray-50"
            >
              <Text className="text-[14px] font-medium text-[#1D2939] w-12 font-poppins">
                {item.day}
              </Text>
              <View className="flex-row items-center gap-2 flex-1 justify-center">
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={item.status.includes("Rain") ? "#667085" : "#FFD700"}
                />
                <Text className="text-[14px] text-gray-500 font-poppins">
                  {item.status}
                </Text>
              </View>
              <Text className="text-[14px] font-bold text-[#1D2939] font-poppins-bold">
                {item.temp}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
