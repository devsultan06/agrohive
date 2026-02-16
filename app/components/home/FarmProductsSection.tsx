import React from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFavoriteStore } from "../../store/useFavoriteStore";

const FARM_PRODUCTS = [
  {
    id: "4",
    name: "Drone Sprayer",
    rating: 5.0,
    price: 899.0,
    image: require("../../assets/drone_sprayer.png"),
    description:
      "Advanced drone technology for precise crop spraying. Covers up to 10 hectares per hour with minimal waste and high efficiency.",
  },
  {
    id: "6",
    name: "Agricultural Drone",
    rating: 5.0,
    price: 32000.0,
    image: require("../../assets/r2.png"),
    description:
      "Multi-functional agricultural drone equipped with high-resolution sensors for crop monitoring and health assessment.",
  },
  {
    id: "1",
    name: "Rotavator",
    rating: 4.8,
    price: 899.0,
    image: require("../../assets/rotavator.png"),
    description:
      "Heavy-duty rotavator designed for efficient soil preparation. Features multiple blade configurations for varying soil types.",
  },
  {
    id: "2",
    name: "EcoWagon",
    rating: 4.5,
    price: 899.0,
    image: require("../../assets/ecowagon.png"),
    description:
      "Eco-friendly agricultural wagon perfect for transporting crops and tools across the farm with minimal effort.",
  },
];

export default function FarmProductsSection() {
  const navigation = useNavigation<any>();
  const { favorites, toggleFavorite } = useFavoriteStore();

  const renderProductItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("ProductDetail", { product: item })}
        activeOpacity={0.8}
      >
        <View
          className="bg-white mr-[16px] w-[160px] mb-2"
          style={{
            borderRadius: 8,
            shadowColor: "rgba(48, 57, 60, 0.07)",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <View className="relative mb-[8px]">
            <Image
              source={item.image}
              className="w-full h-[100px] bg-gray-200"
              style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
              resizeMode="cover"
            />
            <TouchableOpacity
              className="absolute top-2 right-2 bg-white/80 p-1 rounded-full"
              onPress={() => toggleFavorite(item)}
            >
              <Ionicons
                name={
                  favorites.some((f) => f.id === item.id)
                    ? "heart"
                    : "heart-outline"
                }
                size={16}
                color="red"
              />
            </TouchableOpacity>
          </View>

          <View className="px-[8px] pb-[12px]">
            <View className="flex-row justify-between items-center mb-[15px]">
              <Text
                className="text-[12px] font-bold text-[#1D2939] font-poppins-bold flex-1 mr-1"
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text className="text-[12px] text-gray-500 ml-1 font-poppins">
                  {item.rating.toFixed(1)}
                </Text>
              </View>
            </View>
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-[12px] font-bold text-[#1D2939] font-poppins-bold">
                ₦{item.price.toLocaleString()}
              </Text>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("ProductDetail", { product: item })
                }
                className="bg-[#1C6206] px-3 py-1.5 rounded-full"
              >
                <Text className="text-white text-[10px] font-bold font-poppins-bold">
                  View
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-[8px]">
        <Text className="text-[14px] font-bold text-[#1D2939] font-parkinsans-bold">
          Farm products
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Market")}>
          <Text className="text-[12px] underline text-[#1C6206] font-medium font-poppins">
            View all
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={FARM_PRODUCTS}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
