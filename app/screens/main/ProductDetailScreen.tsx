import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCartStore } from "../../store/useCartStore";
import { Toast } from "../../components/Toast";
import ReviewModal from "../../components/ReviewModal";
import { useReviews } from "../../hooks/useReviews";
import { useCreateReview } from "../../services/products/reviews.service";
import { useFavorites } from "../../hooks/useFavorites";
import { useToggleFavorite } from "../../services/products/favorites.service";
import { format } from "date-fns";
import { ActivityIndicator } from "react-native";

const { width } = Dimensions.get("window");

const SIZES = ["Small", "Medium", "Large", "Extra Large"];

export default function ProductDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { product } = route.params || {};
  const { addItem, items, updateQuantity } = useCartStore();

  const [selectedSize, setSelectedSize] = useState("Medium");
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [reviewModalVisible, setReviewModalVisible] = useState(false);

  const { data: apiReviews, isLoading: reviewsLoading } = useReviews(
    product?.id,
  );
  const createReviewMutation = useCreateReview();

  const { data: favorites = [] } = useFavorites();
  const { mutate: toggleFavorite } = useToggleFavorite();
  const isFavorite = favorites.some((f: any) => f.id === product?.id);

  const handleReviewSubmit = async (rating: number, comment: string) => {
    try {
      await createReviewMutation.mutateAsync({
        productId: product.id,
        rating,
        comment,
      });
      setToastMessage("Review submitted!");
      setToastVisible(true);
    } catch (error: any) {
      setToastMessage(error.message || "Failed to submit review");
      setToastVisible(true);
    }
  };

  // Get current quantity from cart
  const currentQty = items.find((i) => i.id === product?.id)?.quantity || 0;

  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500 font-poppins">Product not found</Text>
      </SafeAreaView>
    );
  }

  const handleAddToCart = () => {
    addItem({ ...product, quantity: 1, size: selectedSize });
    setToastMessage("Added to cart!");
    setToastVisible(true);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Product Image */}
      <View className="relative" style={{ height: width * 0.75 }}>
        <Image
          source={
            product.imageUrl
              ? { uri: product.imageUrl }
              : require("../../assets/rotavator.png")
          }
          className="w-full h-full"
          resizeMode="cover"
        />

        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute top-12 left-5 w-10 h-10 bg-white/80 rounded-full justify-center items-center"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        {/* Favorite Button */}
        <TouchableOpacity
          onPress={() => toggleFavorite(product.id)}
          className="absolute top-12 right-5 w-10 h-10 bg-white/80 rounded-full justify-center items-center"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color="red"
          />
        </TouchableOpacity>
      </View>

      {/* Product Details */}
      <ScrollView
        className="flex-1 bg-white"
        style={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          marginTop: -24,
        }}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="px-6 pt-6">
          {/* Product Name */}
          <Text className="text-[24px] font-bold text-[#1D2939] mb-2 font-parkinsans-bold">
            {product.name}
          </Text>

          {/* Price */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-[20px] font-bold text-[#1D2939] font-parkinsans-bold">
              ₦{product.price.toLocaleString()}
            </Text>
            {product.stock < 10 && product.stock > 0 && (
              <View className="bg-orange-50 px-2 py-1 rounded">
                <Text className="text-orange-600 text-[10px] font-bold font-poppins uppercase">
                  Limited Stock
                </Text>
              </View>
            )}
          </View>

          {/* Stock Indicator (Jumia Style) */}
          <View className="mb-6 border border-[#F2F4F7] p-3 rounded-xl bg-[#FAFAFA]">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-[12px] text-[#667085] font-poppins">
                {product.stock > 0
                  ? `${product.stock} items left`
                  : "Out of stock"}
              </Text>
              {product.stock > 0 && (
                <Text className="text-[10px] text-gray-400 font-poppins italic">
                  Available in store
                </Text>
              )}
            </View>
            <View className="h-2 bg-[#EAECF0] rounded-full overflow-hidden">
              <View
                className={`h-full rounded-full ${
                  product.stock > 10 ? "bg-[#12B76A]" : "bg-[#F04438]"
                }`}
                style={{
                  width: `${Math.min(100, (product.stock / 50) * 100)}%`,
                }}
              />
            </View>
          </View>

          {/* Description */}
          <Text className="text-[14px] text-gray-600 leading-6 mb-6 font-poppins">
            {product.description ||
              "Efficient and precise for spraying fertilizers and pesticides, covering large areas with ease while saving time and resources."}
          </Text>

          {/* Select Size */}
          <Text className="text-[14px] font-medium text-[#1D2939] mb-3 font-poppins">
            Select size
          </Text>

          <TouchableOpacity
            onPress={() => setShowSizeDropdown(!showSizeDropdown)}
            className="flex-row items-center justify-between bg-white border border-gray-200 rounded-xl px-4 h-14 mb-4"
          >
            <Text className="text-[14px] text-[#1D2939] font-poppins">
              {selectedSize}
            </Text>
            <Ionicons
              name={showSizeDropdown ? "chevron-up" : "chevron-down"}
              size={20}
              color="#98A2B3"
            />
          </TouchableOpacity>

          {/* Size Dropdown */}
          {showSizeDropdown && (
            <View className="bg-white border border-gray-200 rounded-xl mb-4 overflow-hidden">
              {SIZES.map((size, index) => (
                <TouchableOpacity
                  key={size}
                  onPress={() => {
                    setSelectedSize(size);
                    setShowSizeDropdown(false);

                    // If item is already in cart, update its size
                    if (currentQty > 0) {
                      const cartItem = items.find((i) => i.id === product.id);
                      if (cartItem) {
                        // Update the item with new size
                        addItem({ ...product, quantity: 0, size: size });
                      }
                    }
                  }}
                  className={`px-4 py-3 ${
                    index !== SIZES.length - 1 ? "border-b border-gray-100" : ""
                  } ${selectedSize === size ? "bg-green-50" : ""}`}
                >
                  <Text
                    className={`text-[14px] font-poppins ${
                      selectedSize === size
                        ? "text-[#1C6206] font-bold"
                        : "text-[#1D2939]"
                    }`}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Reviews Header */}
          <View className="flex-row justify-between items-center mt-6 mb-4">
            <Text className="text-[18px] font-bold text-[#1D2939] font-parkinsans-bold">
              Reviews ({apiReviews?.length || 0})
            </Text>
            <TouchableOpacity onPress={() => setReviewModalVisible(true)}>
              <Text className="text-[#1C6206] font-bold font-poppins">
                Write a review
              </Text>
            </TouchableOpacity>
          </View>

          {/* Reviews List */}
          <View className="gap-4 mb-6">
            {reviewsLoading ? (
              <ActivityIndicator color="#1C6206" />
            ) : apiReviews && apiReviews.length > 0 ? (
              apiReviews.map((review: any) => (
                <View
                  key={review.id}
                  className="bg-gray-50 p-4 rounded-xl border border-gray-100"
                >
                  <View className="flex-row justify-between mb-2">
                    <Text className="font-bold text-[#1D2939] font-parkinsans-bold">
                      {review.user?.fullName}
                    </Text>
                    <Text className="text-gray-400 text-[12px] font-poppins">
                      {format(new Date(review.createdAt), "MMM d")}
                    </Text>
                  </View>
                  <View className="flex-row mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name={star <= review.rating ? "star" : "star-outline"}
                        size={14}
                        color="#FFD700"
                      />
                    ))}
                  </View>
                  <Text className="text-gray-600 text-[13px] font-poppins leading-5">
                    {review.comment}
                  </Text>
                </View>
              ))
            ) : (
              <View className="py-8 items-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <Ionicons name="chatbox-outline" size={48} color="#98A2B3" />
                <Text className="text-gray-500 font-poppins mt-2 text-center px-4">
                  No reviews yet. Be the first to share your experience with
                  this {product.name.toLowerCase()}!
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Section */}
      <View
        className="absolute bottom-[30px] left-0 right-0 bg-white px-6 py-4"
        style={{}}
      >
        {currentQty === 0 ? (
          /* Add to Cart Button - Full Width */
          <TouchableOpacity
            onPress={handleAddToCart}
            disabled={product.stock <= 0}
            className={`h-14 rounded-full justify-center items-center ${
              product.stock <= 0 ? "bg-gray-300" : "bg-[#1C6206]"
            }`}
          >
            <Text className="text-white font-bold text-[16px] font-poppins">
              {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </Text>
          </TouchableOpacity>
        ) : (
          /* Quantity Controls */
          <View className="flex-row items-center bg-[#1C6206] rounded-full h-14 px-4 justify-between">
            <TouchableOpacity
              onPress={() => updateQuantity(product.id, -1)}
              className="w-10 h-10 justify-center items-center"
            >
              <Text className="text-white font-bold text-[24px]">-</Text>
            </TouchableOpacity>

            <Text className="text-[18px] font-bold text-white font-parkinsans-bold">
              {currentQty}
            </Text>

            <TouchableOpacity
              onPress={() => updateQuantity(product.id, 1)}
              className="w-10 h-10 justify-center items-center"
            >
              <Text className="text-white font-bold text-[24px]">+</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ReviewModal
        visible={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        onSubmit={handleReviewSubmit}
      />

      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </View>
  );
}
