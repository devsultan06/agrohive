import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { orderService } from "../../services/order/order.service";

export default function OrderDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { orderId } = route.params;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const res = await orderService.getOrderDetails(orderId);
      setOrder(res.data);
    } catch (err) {
      console.error("Fetch order details error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "text-[#1C6206] bg-green-100";
      case "shipped":
        return "text-blue-600 bg-blue-100";
      case "processing":
        return "text-orange-600 bg-orange-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      case "placed":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading || !order) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#1C6206" />
      </SafeAreaView>
    );
  }

  const statusStyle = getStatusColor(order.status);
  const statusTextColor = statusStyle.split(" ")[0];
  const statusBgColor = statusStyle.split(" ")[1];

  // Map statusHistory to timeline steps
  const steps = order.statusHistory.map((h: any) => ({
    title:
      h.status.charAt(0) + h.status.slice(1).toLowerCase().replace("_", " "),
    date:
      new Date(h.createdAt).toLocaleDateString() +
      " " +
      new Date(h.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    completed: true,
    status: h.status,
  }));

  // Add future steps if not yet reached
  const allStatuses = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentStatusIndex = allStatuses.indexOf(order.status);

  if (
    order.status !== "CANCELLED" &&
    currentStatusIndex < allStatuses.length - 1
  ) {
    for (let i = currentStatusIndex + 1; i < allStatuses.length; i++) {
      steps.push({
        title: allStatuses[i].charAt(0) + allStatuses[i].slice(1).toLowerCase(),
        date: "Expected soon",
        completed: false,
        status: allStatuses[i],
      });
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-2 mb-4 border-b border-gray-100 pb-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="#1D2939" />
        </TouchableOpacity>
        <Text className="text-[18px] font-bold text-[#1D2939] font-parkinsans-bold">
          Order Details
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Order Number and Status */}
        <View className="px-5 mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-[20px] font-bold text-[#1D2939] font-parkinsans-bold">
              {order.orderNumber}
            </Text>
            <View className={`px-3 py-1.5 rounded-full ${statusBgColor}`}>
              <Text
                className={`text-[12px] font-bold font-poppins capitalize ${statusTextColor}`}
              >
                {order.status.toLowerCase()}
              </Text>
            </View>
          </View>
          <Text className="text-[14px] text-gray-500 font-poppins">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {/* Tracking Timeline */}
        <View className="px-5 mb-8">
          <Text className="text-[16px] font-bold text-[#1D2939] mb-4 font-parkinsans-bold">
            Order Status
          </Text>
          <View className="pl-2">
            {steps.map((step: any, index: number) => (
              <View key={index} className="flex-row items-start min-h-[60px]">
                {/* Visual Line */}
                <View className="items-center mr-4" style={{ width: 24 }}>
                  <View
                    className={`w-4 h-4 rounded-full border-2 ${
                      step.completed
                        ? "bg-[#1C6206] border-[#1C6206]"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  {index < steps.length - 1 && (
                    <View
                      className={`w-[2px] flex-1 my-1 ${
                        step.completed && steps[index + 1]?.completed
                          ? "bg-[#1C6206]"
                          : "bg-gray-200"
                      }`}
                    />
                  )}
                </View>
                {/* Text Content */}
                <View className="-mt-1 flex-1">
                  <Text
                    className={`text-[14px] font-bold font-poppins ${
                      step.completed ? "text-[#1D2939]" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </Text>
                  <Text className="text-[12px] text-gray-500 font-poppins">
                    {step.date}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Items List */}
        <View className="px-5 mb-6">
          <Text className="text-[16px] font-bold text-[#1D2939] mb-4 font-parkinsans-bold">
            Items ({order.items?.length || 0})
          </Text>
          <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            {order.items?.map((item: any, index: number) => (
              <View
                key={index}
                className={`flex-row items-center py-3 ${
                  index < order.items.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
              >
                <View className="w-16 h-16 bg-white rounded-lg p-1 mr-4 border border-gray-100">
                  {item.product?.imageUrl ? (
                    <Image
                      source={{ uri: item.product.imageUrl }}
                      className="w-full h-full rounded-md"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="flex-1 bg-gray-100 items-center justify-center">
                      <Ionicons name="cube" size={24} color="#D1D5DB" />
                    </View>
                  )}
                </View>
                <View className="flex-1">
                  <Text
                    className="text-[14px] font-bold text-[#1D2939] font-parkinsans-bold"
                    numberOfLines={1}
                  >
                    {item.product?.name}
                  </Text>
                  <Text className="text-[12px] text-gray-500 font-poppins">
                    Quantity: {item.quantity}
                  </Text>
                </View>
                <Text className="text-[14px] font-bold text-[#1D2939] font-poppins-bold">
                  ₦{item.price?.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Order Summary */}
        <View className="px-5 mb-8">
          <Text className="text-[16px] font-bold text-[#1D2939] mb-4 font-parkinsans-bold">
            Order Summary
          </Text>
          <View className="bg-gray-100 rounded-2xl p-5">
            <View className="flex-row justify-between mb-3">
              <Text className="text-[14px] text-gray-500 font-poppins">
                Subtotal
              </Text>
              <Text className="text-[14px] font-bold text-[#1D2939] font-poppins">
                ₦{order.totalAmount?.toLocaleString()}
              </Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-[14px] text-gray-500 font-poppins">
                Delivery Fee
              </Text>
              <Text className="text-[14px] font-bold text-[#1D2939] font-poppins">
                ₦0
              </Text>
            </View>
            <View className="h-[1px] bg-gray-200 my-2" />
            <View className="flex-row justify-between">
              <Text className="text-[16px] font-bold text-[#1D2939] font-parkinsans-bold">
                Total
              </Text>
              <Text className="text-[18px] font-bold text-[#1C6206] font-parkinsans-bold">
                ₦{order.totalAmount?.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Support Button */}
        <View className="px-5">
          <TouchableOpacity className="flex-row justify-center items-center h-[50px] border border-gray-200 rounded-full bg-white">
            <Ionicons name="headset-outline" size={20} color="#344054" />
            <Text className="text-[#344054] font-bold font-poppins ml-2">
              Contact Support
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
