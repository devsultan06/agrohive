import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function OrderDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { order } = route.params;

  // Mock timeline steps
  const steps = [
    { title: "Order Placed", date: order.date, completed: true },
    { title: "Processing", date: order.date, completed: true },
    {
      title: "Shipped",
      date: "Feb 11, 2026",
      completed: ["shipped", "delivered"].includes(order.status),
    },
    {
      title: "Delivered",
      date: "Feb 12, 2026",
      completed: order.status === "delivered",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-[#1C6206] bg-green-100";
      case "shipped":
        return "text-blue-600 bg-blue-100";
      case "processing":
        return "text-orange-600 bg-orange-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const statusStyle = getStatusColor(order.status);
  const statusTextColor = statusStyle.split(" ")[0];
  const statusBgColor = statusStyle.split(" ")[1];

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
        {/* Order ID and Status */}
        <View className="px-5 mb-6">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-[20px] font-bold text-[#1D2939] font-parkinsans-bold">
              {order.id}
            </Text>
            <View className={`px-3 py-1.5 rounded-full ${statusBgColor}`}>
              <Text
                className={`text-[12px] font-bold font-poppins capitalize ${statusTextColor}`}
              >
                {order.status}
              </Text>
            </View>
          </View>
          <Text className="text-[14px] text-gray-500 font-poppins">
            Placed on {order.date}
          </Text>
        </View>

        {/* Tracking Timeline */}
        <View className="px-5 mb-8">
          <Text className="text-[16px] font-bold text-[#1D2939] mb-4 font-parkinsans-bold">
            Order Status
          </Text>
          <View className="pl-2">
            {steps.map((step, index) => (
              <View key={index} className="flex-row items-start h-16">
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
                        step.completed ? "bg-[#1C6206]" : "bg-gray-200"
                      }`}
                    />
                  )}
                </View>
                {/* Text Content */}
                <View className="-mt-1">
                  <Text
                    className={`text-[14px] font-bold font-poppins ${
                      step.completed ? "text-[#1D2939]" : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </Text>
                  {step.completed && (
                    <Text className="text-[12px] text-gray-500 font-poppins">
                      {step.date}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Items List */}
        <View className="px-5 mb-6">
          <Text className="text-[16px] font-bold text-[#1D2939] mb-4 font-parkinsans-bold">
            Items ({order.items})
          </Text>
          <View className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            {order.products.map((product: any, index: number) => (
              <View
                key={index}
                className={`flex-row items-center py-3 ${
                  index < order.products.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
              >
                <View className="w-16 h-16 bg-white rounded-lg p-1 mr-4 border border-gray-100">
                  <Image
                    source={product.image}
                    className="w-full h-full rounded-md"
                    resizeMode="cover"
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className="text-[14px] font-bold text-[#1D2939] font-parkinsans-bold"
                    numberOfLines={1}
                  >
                    {product.name}
                  </Text>
                  <Text className="text-[12px] text-gray-500 font-poppins">
                    Quantity: 1{" "}
                    {/* Mock quantity since previous mocked data didn't have specific qty per item */}
                  </Text>
                </View>
                <Text className="text-[14px] font-bold text-[#1D2939] font-poppins-bold">
                  ₦{order.total.toLocaleString()}{" "}
                  {/* Placeholder price since per-item price wasn't passed, showing total for demo */}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Shipping & Payment Info */}
        <View className="px-5 mb-6">
          <Text className="text-[16px] font-bold text-[#1D2939] mb-4 font-parkinsans-bold">
            Delivery Details
          </Text>
          <View className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            {/* Address */}
            <View className="flex-row mb-6">
              <View className="w-10 h-10 bg-green-50 rounded-full justify-center items-center mr-4">
                <Ionicons name="location-outline" size={20} color="#1C6206" />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-bold text-[#1D2939] font-poppins mb-1">
                  Delivery Address
                </Text>
                <Text className="text-[13px] text-gray-500 font-poppins leading-5">
                  12, Victoria Island, Lagos State, Nigeria
                </Text>
              </View>
            </View>

            {/* Payment */}
            <View className="flex-row">
              <View className="w-10 h-10 bg-green-50 rounded-full justify-center items-center mr-4">
                <Ionicons name="card-outline" size={20} color="#1C6206" />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-bold text-[#1D2939] font-poppins mb-1">
                  Payment Method
                </Text>
                <Text className="text-[13px] text-gray-500 font-poppins">
                  **** **** **** 4242
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View className="px-5 mb-8">
          <Text className="text-[16px] font-bold text-[#1D2939] mb-4 font-parkinsans-bold">
            Order Summary
          </Text>
          <View className="bg-gray-50 rounded-2xl p-5">
            <View className="flex-row justify-between mb-3">
              <Text className="text-[14px] text-gray-500 font-poppins">
                Subtotal
              </Text>
              <Text className="text-[14px] font-bold text-[#1D2939] font-poppins">
                ₦{order.total.toLocaleString()}
              </Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-[14px] text-gray-500 font-poppins">
                Delivery Fee
              </Text>
              <Text className="text-[14px] font-bold text-[#1D2939] font-poppins">
                ₦2,500
              </Text>
            </View>
            <View className="h-[1px] bg-gray-200 my-2" />
            <View className="flex-row justify-between">
              <Text className="text-[16px] font-bold text-[#1D2939] font-parkinsans-bold">
                Total
              </Text>
              <Text className="text-[18px] font-bold text-[#1C6206] font-parkinsans-bold">
                ₦{(order.total + 2500).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Need Help Button */}
        <View className="px-5">
          <TouchableOpacity className="flex-row justify-center items-center h-[50px] border border-gray-200 rounded-full bg-white">
            <Ionicons name="headset-outline" size={20} color="#344054" />
            <Text className="text-[#344054] font-bold font-poppins ml-2">
              Need Help?
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
