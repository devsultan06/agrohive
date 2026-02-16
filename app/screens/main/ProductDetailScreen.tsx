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
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: "John Doe",
      rating: 5,
      comment: "I loved this product! It worked exactly as described.",
      date: "Feb 10",
    },
    {
      id: 2,
      user: "Sarah Smith",
      rating: 4,
      comment: "Good quality, fast delivery.",
      date: "Feb 12",
    },
  ]);

  const handleReviewSubmit = (rating: number, comment: string) => {
    const newReview = {
      id: Date.now(),
      user: "Me",
      rating,
      comment,
      date: "Just now",
    };
    setReviews([newReview, ...reviews]);
    setToastMessage("Review submitted!");
    setToastVisible(true);
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
          source={product.image}
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
          <Text className="text-[20px] font-bold text-[#1D2939] mb-4 font-parkinsans-bold">
            ₦{product.price.toLocaleString()}
          </Text>

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
              Reviews ({reviews.length})
            </Text>
            <TouchableOpacity onPress={() => setReviewModalVisible(true)}>
              <Text className="text-[#1C6206] font-bold font-poppins">
                Write a review
              </Text>
            </TouchableOpacity>
          </View>

          {/* Reviews List */}
          <View className="gap-4 mb-6">
            {reviews.map((review) => (
              <View
                key={review.id}
                className="bg-gray-50 p-4 rounded-xl border border-gray-100"
              >
                <View className="flex-row justify-between mb-2">
                  <Text className="font-bold text-[#1D2939] font-parkinsans-bold">
                    {review.user}
                  </Text>
                  <Text className="text-gray-400 text-[12px] font-poppins">
                    {review.date}
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
            ))}
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
            className="h-14 rounded-full bg-[#1C6206] justify-center items-center"
          >
            <Text className="text-white font-bold text-[16px] font-poppins">
              Add to Cart
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
