import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { Toast } from "../../components/Toast";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFavoriteStore } from "../../store/useFavoriteStore";
import { useCartStore } from "../../store/useCartStore";

const { width } = Dimensions.get("window");

export default function FavoriteScreen() {
  const navigation = useNavigation<any>();
  const { favorites, toggleFavorite, clearFavorites } = useFavoriteStore();
  const { addItem, items, updateQuantity } = useCartStore();
  const [toastVisible, setToastVisible] = useState(false);

  const getItemQty = (id: string) => {
    return items.find((item) => item.id === id)?.quantity || 0;
  };

  const handleAddToCart = (item: any) => {
    addItem({ ...item, quantity: 1 });
    setToastVisible(true);
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear Favorites",
      "Are you sure you want to remove all items from your favorites?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: clearFavorites },
      ],
    );
  };

  const renderProductItem = ({ item }: { item: any }) => (
    <View
      className="bg-white mb-4 flex-row items-center p-3 rounded-xl border border-gray-100"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <Image
        source={item.image}
        className="w-20 h-20 rounded-lg bg-gray-200"
        resizeMode="cover"
      />

      <View className="flex-1 ml-4 justify-between h-20 py-1">
        <View>
          <Text className="text-[14px] font-bold text-[#1D2939] font-parkinsans-bold mb-1">
            {item.name}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text className="text-[12px] text-gray-500 ml-1 font-poppins">
              {item.rating.toFixed(1)}
            </Text>
          </View>
        </View>

        <Text className="text-[14px] font-bold text-[#1C6206] font-poppins-bold">
          ₦{item.price.toLocaleString()}
        </Text>
      </View>

      <View className="justify-between h-20 items-end">
        <TouchableOpacity onPress={() => toggleFavorite(item)}>
          <Ionicons name="heart" size={20} color="red" />
        </TouchableOpacity>

        {getItemQty(item.id) > 0 ? (
          <View className="flex-row items-center bg-[#1C6206] rounded-full h-[28px] px-1">
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, -1)}
              className="px-2"
            >
              <Text className="text-white font-bold">-</Text>
            </TouchableOpacity>
            <Text className="text-white text-[10px] font-bold font-poppins-bold mx-1">
              {getItemQty(item.id)}
            </Text>
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, 1)}
              className="px-2"
            >
              <Text className="text-white font-bold">+</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => handleAddToCart(item)}
            className="bg-[#1C6206] px-3 py-1.5 rounded-full"
          >
            <Text className="text-white text-[10px] font-bold font-poppins-bold">
              Add to cart
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white px-5 pt-2">
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="#1D2939" />
          </TouchableOpacity>
          <Text className="text-[20px] font-bold text-[#1D2939] font-parkinsans-bold">
            My Favorites
          </Text>
        </View>
        {favorites.length > 0 && (
          <TouchableOpacity
            onPress={handleClearAll}
            className="w-10 h-10 bg-red-50 rounded-full justify-center items-center"
          >
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        )}
      </View>

      {favorites.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <View className="w-20 h-20 bg-gray-50 rounded-full justify-center items-center mb-4">
            <Ionicons name="heart-outline" size={40} color="#98A2B3" />
          </View>
          <Text className="text-[#1D2939] font-bold text-[18px] font-parkinsans-bold mb-2">
            No favorites yet
          </Text>
          <Text className="text-gray-500 text-center px-10 font-poppins text-[14px]">
            Start adding products you like to your wishlist!
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Market")}
            className="mt-8 bg-[#1C6206] px-8 py-3 rounded-full"
          >
            <Text className="text-white font-bold font-poppins">
              Explore Products
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      <Toast
        message="Added to cart"
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
}
