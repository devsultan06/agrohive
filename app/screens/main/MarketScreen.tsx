import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MenuIcon from "../../assets/menu.svg";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Toast } from "../../components/Toast";
import { SideMenu } from "../../components/SideMenu";
import { useFavoriteStore } from "../../store/useFavoriteStore";
import { useNavigation } from "@react-navigation/native";

// Generated Images
const ROTAVATOR_IMG = require("../../assets/rotavator.png");
const ECOWAGON_IMG = require("../../assets/ecowagon.png");
const MINI_TRACTOR_IMG = require("../../assets/mini_tractor.png");
const DRONE_SPRAYER_IMG = require("../../assets/drone_sprayer.png");
const ROBOTIC_CULTIVATOR_IMG = require("../../assets/r3.png");
const AGRI_DRONE_IMG = require("../../assets/r2.png");
const SEED_PLANTER_IMG = require("../../assets/r1.png");

const MARKET_PRODUCTS = [
  {
    id: "1",
    name: "Rotavator",
    rating: 4.8,
    price: 899.0,
    image: ROTAVATOR_IMG,
    category: "New Products",
    description:
      "Heavy-duty rotavator designed for efficient soil preparation. Features multiple blade configurations for varying soil types.",
  },
  {
    id: "2",
    name: "EcoWagon",
    rating: 4.5,
    price: 899.0,
    image: ECOWAGON_IMG,
    category: "New Products",
    description:
      "Eco-friendly agricultural wagon perfect for transporting crops and tools across the farm with minimal effort.",
  },
  {
    id: "3",
    name: "Mini Tractor",
    rating: 3.9,
    price: 899.0,
    image: MINI_TRACTOR_IMG,
    category: "UK Used",
    description:
      "Versatile mini tractor ideal for small to medium farms. Compact design makes it easy to maneuver in tight spaces.",
  },
  {
    id: "4",
    name: "Drone Sprayer",
    rating: 5.0,
    price: 899.0,
    image: DRONE_SPRAYER_IMG,
    category: "New Products",
    description:
      "High-precision drone sprayer ensuring uniform application of fertilizers and pesticides while protecting your health.",
  },
  {
    id: "5",
    name: "Robotic plant cultivator",
    rating: 4.7,
    price: 32000.0,
    image: ROBOTIC_CULTIVATOR_IMG,
    category: "New Products",
    description:
      "Autonomous robotic cultivator that uses AI to distinguish between crops and weeds, providing 24/7 labor-free maintenance.",
  },
  {
    id: "6",
    name: "Agricultural drone",
    rating: 4.2,
    price: 32000.0,
    image: AGRI_DRONE_IMG,
    category: "New Products",
    description:
      "All-weather agricultural drone for mapping and thermal imaging, helping you optimize crop yields through data-driven insights.",
  },
  {
    id: "7",
    name: "Seed planter machine",
    rating: 4.0,
    price: 32000.0,
    image: SEED_PLANTER_IMG,
    category: "UK Used",
    description:
      "Precision seed planter that ensures optimal depth and spacing for various seed types, significantly improving germination rates.",
  },
];

const FILTERS = ["All products", "New Products", "UK Used"];

const { width } = Dimensions.get("window");

import { useUserStore } from "../../store/useUserStore";

export default function MarketScreen() {
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState("All products");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);

  // Toast State
  const [toastVisible, setToastVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const { favorites, toggleFavorite } = useFavoriteStore();
  const { user } = useUserStore();

  const filteredProducts = MARKET_PRODUCTS.filter((product) => {
    // 1. Category Filter
    const matchesCategory =
      activeFilter === "All products" || product.category === activeFilter;

    // 2. Search Filter
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // 3. Price Filter
    const price = product.price;
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    const matchesPrice = price >= min && price <= max;

    // 4. Rating Filter
    const matchesRating = product.rating >= minRating;

    return matchesCategory && matchesSearch && matchesPrice && matchesRating;
  });

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setModalVisible(false);
  };

  const renderProductItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("ProductDetail", { product: item })}
        activeOpacity={0.8}
      >
        <Animated.View
          entering={FadeInDown.delay(index * 100).springify()}
          className="bg-white mb-4"
          style={{
            borderRadius: 8,
            width: (width - 40 - 15) / 2, // (Screen width - padding - gap) / 2
            marginRight: index % 2 === 0 ? 15 : 0, // Add margin only to left item
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
              className="w-full h-[120px] bg-gray-200"
              style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
              resizeMode="cover"
            />
            <TouchableOpacity
              className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full"
              onPress={() => toggleFavorite(item)}
            >
              <Ionicons
                name={
                  favorites.some((f) => f.id === item.id)
                    ? "heart"
                    : "heart-outline"
                }
                size={18}
                color="red"
              />
            </TouchableOpacity>
          </View>

          <View className="px-[8px] pb-[12px]">
            <View className="flex-row justify-between items-center mb-1">
              <Text
                className="text-[12px] font-bold text-[#1D2939] font-poppins-bold flex-1 mr-1"
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="star" size={12} color="#FFD700" />
                <Text className="text-[10px] text-gray-500 ml-1 font-poppins">
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
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-5 pt-2 flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
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
              elevation: 5,
            }}
          >
            <MenuIcon width={17} height={17} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center mb-6 gap-3">
          <View className="flex-1 h-[50px] bg-[#FAFAFA] rounded-2xl flex-row items-center px-4 border border-gray-100">
            <Ionicons name="search" size={20} color="#98A2B3" />
            <TextInput
              placeholder="Search for products or devices.."
              placeholderTextColor="#98A2B3"
              className="flex-1 ml-3 font-poppins text-[14px] text-[#1D2939]"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="w-[50px] h-[50px] bg-[#FAFAFA] rounded-2xl justify-center items-center border border-gray-100"
          >
            <Ionicons name="options-outline" size={24} color="#1C6206" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View className="mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {FILTERS.map((filter, index) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`px-5 py-3 rounded-full mr-3 border ${
                  activeFilter === filter
                    ? "bg-[#1C6206] border-[#1C6206]"
                    : "bg-[#FAFAFA] border-gray-100"
                }`}
              >
                <Text
                  className={`text-[12px] font-medium font-poppins ${
                    activeFilter === filter ? "text-white" : "text-[#98A2B3]"
                  }`}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product Grid */}
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, flexGrow: 1 }}
          columnWrapperStyle={
            filteredProducts.length > 0
              ? { justifyContent: "flex-start" }
              : undefined
          }
          ListEmptyComponent={() => (
            <View className="flex-1 justify-center items-center mt-20">
              <Ionicons name="search-outline" size={48} color="#98A2B3" />
              <Text className="text-[#98A2B3] font-poppins text-[14px] mt-4 text-center">
                No products found matching your search.
              </Text>
            </View>
          )}
        />

        {/* Filter Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View className="flex-1 justify-end bg-black/50">
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="bg-white rounded-t-3xl p-6 h-[60%]">
                  <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-[18px] font-bold text-[#1D2939] font-parkinsans-bold">
                      Filter Products
                    </Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Ionicons name="close" size={24} color="#1D2939" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Price Range */}
                    <Text className="text-[14px] font-bold text-[#1D2939] mb-3 font-parkinsans-bold">
                      Price Range (NGN)
                    </Text>
                    <View className="flex-row items-center gap-4 mb-6">
                      <View className="flex-1">
                        <Text className="text-[12px] text-gray-500 mb-1 font-poppins">
                          Min Price
                        </Text>
                        <TextInput
                          className="bg-[#FAFAFA] h-[48px] rounded-xl px-4 border border-gray-100 font-poppins"
                          placeholder="0"
                          keyboardType="numeric"
                          value={minPrice}
                          onChangeText={setMinPrice}
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-[12px] text-gray-500 mb-1 font-poppins">
                          Max Price
                        </Text>
                        <TextInput
                          className="bg-[#FAFAFA] h-[48px] rounded-xl px-4 border border-gray-100 font-poppins"
                          placeholder="Max"
                          keyboardType="numeric"
                          value={maxPrice}
                          onChangeText={setMaxPrice}
                        />
                      </View>
                    </View>

                    {/* Minimum Rating */}
                    <Text className="text-[14px] font-bold text-[#1D2939] mb-3 font-parkinsans-bold">
                      Minimum Rating
                    </Text>
                    <View className="flex-row justify-between mb-8">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                          key={star}
                          onPress={() => setMinRating(star)}
                          className={`w-[50px] h-[40px] rounded-lg justify-center items-center border ${
                            minRating === star
                              ? "bg-[#1C6206] border-[#1C6206]"
                              : "bg-[#FAFAFA] border-gray-100"
                          }`}
                        >
                          <View className="flex-row items-center gap-1">
                            <Text
                              className={`text-[14px] font-bold ${
                                minRating === star
                                  ? "text-white"
                                  : "text-[#1D2939]"
                              }`}
                            >
                              {star}
                            </Text>
                            <Ionicons
                              name="star"
                              size={12}
                              color={minRating === star ? "#FFD700" : "#98A2B3"}
                            />
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row gap-4 mt-auto mb-6">
                      <TouchableOpacity
                        onPress={clearFilters}
                        className="flex-1 h-[50px] rounded-full border border-[#1C6206] justify-center items-center"
                      >
                        <Text className="text-[#1C6206] font-bold font-poppins">
                          Reset
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        className="flex-1 h-[50px] rounded-full bg-[#1C6206] justify-center items-center"
                      >
                        <Text className="text-white font-bold font-poppins">
                          Apply Filter
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Toast Notification */}
        <Toast
          message="Added to cart"
          visible={toastVisible}
          onHide={() => setToastVisible(false)}
        />
        <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />
      </View>
    </SafeAreaView>
  );
}
