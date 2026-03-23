import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import {
  fetchWeatherByCoords,
  fetchForecastByCoords,
  WeatherData,
  ForecastData,
} from "../../services/weather/weather.service";
import { WeatherSkeleton } from "../../components/skeletons/WeatherSkeleton";

export default function WeatherScreen() {
  const navigation = useNavigation<any>();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        let lat = 6.4582;
        let lon = 3.5263; // Default Ajah

        if (status === "granted") {
          let location = await Location.getCurrentPositionAsync({});
          lat = location.coords.latitude;
          lon = location.coords.longitude;
        }

        const [weatherData, forecastData] = await Promise.all([
          fetchWeatherByCoords(lat, lon),
          fetchForecastByCoords(lat, lon),
        ]);

        setWeather(weatherData);
        setForecast(forecastData);
      } catch (error) {
        console.error("WeatherScreen error:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const getAdvisory = () => {
    if (!weather) return "Loading farming advisory...";
    if (weather.temp > 30) {
      return "High temperature expected today. Ensure sufficient irrigation for your crops early in the morning or late evening to prevent heat stress.";
    } else if (weather.description.includes("rain")) {
      return "Rainfall detected. Delay non-essential irrigation and protect recently applied fertilizers from runoff.";
    }
    return "Weather conditions are favorable for most field operations today.";
  };

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

        {isLoading ? (
          <WeatherSkeleton />
        ) : (
          <>
            {/* Current Weather Card */}
            <View className="bg-[#FAFAFA] rounded-2xl p-6 mb-6 border border-gray-100 items-center">
              <Text className="text-[16px] font-medium text-gray-500 mb-2 font-poppins">
                {weather?.name || "Ajah, Lagos"}
              </Text>
              <Text className="text-[14px] text-gray-400 mb-6 font-poppins">
                {weather?.date || "Mon, 27 Nov 2023"}
              </Text>

              <View className="items-center mb-6">
                <Ionicons
                  name={
                    weather?.description.includes("rain") ? "rainy" : "sunny"
                  }
                  size={80}
                  color={
                    weather?.description.includes("rain")
                      ? "#667085"
                      : "#FFD700"
                  }
                />
                <Text className="text-[48px] font-bold text-[#1C6206] font-parkinsans-bold mt-2">
                  {weather?.temp}°C
                </Text>
                <Text className="text-[18px] font-medium text-[#1D2939] font-poppins capitalize">
                  {weather?.description}
                </Text>
              </View>

              <View className="flex-row justify-between w-full px-4">
                <View className="items-center">
                  <Feather name="wind" size={20} color="#667085" />
                  <Text className="text-[12px] text-gray-500 mt-1 font-poppins">
                    Wind
                  </Text>
                  <Text className="text-[14px] font-bold text-[#1D2939] font-poppins-bold">
                    {weather?.windSpeed} km/h
                  </Text>
                </View>
                <View className="items-center">
                  <Ionicons name="water-outline" size={20} color="#667085" />
                  <Text className="text-[12px] text-gray-500 mt-1 font-poppins">
                    Humidity
                  </Text>
                  <Text className="text-[14px] font-bold text-[#1D2939] font-poppins-bold">
                    {weather?.humidity}%
                  </Text>
                </View>
                <View className="items-center">
                  <Feather name="umbrella" size={20} color="#667085" />
                  <Text className="text-[12px] text-gray-500 mt-1 font-poppins">
                    Prec.
                  </Text>
                  <Text className="text-[14px] font-bold text-[#1D2939] font-poppins-bold">
                    {weather?.description.includes("rain") ? "High" : "0%"}
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
                  {getAdvisory()}
                </Text>
              </View>
            </View>

            {/* 7-Day Forecast */}
            <Text className="text-[18px] font-bold text-[#1D2939] mb-4 font-parkinsans-bold">
              Next {forecast.length} Days
            </Text>
            <View className="gap-3 mb-10">
              {forecast.map((item, index) => (
                <View
                  key={index}
                  className="flex-row items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
                >
                  <Text className="text-[14px] font-medium text-[#1D2939] w-12 font-poppins">
                    {item.day}
                  </Text>
                  <View className="flex-row items-center gap-2 flex-1 justify-center">
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={
                        item.status.toLowerCase().includes("rain")
                          ? "#667085"
                          : "#FFD700"
                      }
                    />
                    <Text className="text-[14px] text-gray-500 font-poppins capitalize">
                      {item.status.toLowerCase()}
                    </Text>
                  </View>
                  <Text className="text-[14px] font-bold text-[#1D2939] font-poppins-bold">
                    {item.temp}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
