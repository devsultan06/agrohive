import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useOrders } from "../../hooks/useOrders";

const getStatusConfig = (status: string) => {
  const s = status.toLowerCase();
  switch (s) {
    case "delivered":
      return {
        label: "Delivered",
        bgColor: "bg-green-100",
        textColor: "text-[#1C6206]",
        icon: "checkmark-circle",
      };
    case "shipped":
      return {
        label: "Shipped",
        bgColor: "bg-blue-100",
        textColor: "text-blue-600",
        icon: "airplane",
      };
    case "processing":
      return {
        label: "Processing",
        bgColor: "bg-orange-100",
        textColor: "text-orange-600",
        icon: "time",
      };
    case "placed":
      return {
        label: "Placed",
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
        icon: "cart-outline",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        bgColor: "bg-red-100",
        textColor: "text-red-600",
        icon: "close-circle",
      };
    default:
      return {
        label: status,
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
        icon: "help-circle",
      };
  }
};

export default function OrdersScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<"all" | "active" | "completed">(
    "all",
  );
  const { orders, loading, refresh } = useOrders();

  const filteredOrders = orders.filter((order) => {
    const s = order.status.toLowerCase();
    if (activeTab === "all") return true;
    if (activeTab === "active")
      return ["placed", "processing", "shipped"].includes(s);
    if (activeTab === "completed")
      return ["delivered", "cancelled"].includes(s);
    return true;
  });

  const renderOrderItem = ({ item }: { item: any }) => {
    const statusConfig = getStatusConfig(item.status);

    return (
      <TouchableOpacity
        className="bg-white rounded-[20px] p-4 border border-black/[0.03] mb-4"
        onPress={() =>
          navigation.navigate("OrderDetails", { orderId: item.id })
        }
        activeOpacity={0.7}
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-3">
          <View>
            <Text className="text-[14px] font-bold text-[#1D2939] font-parkinsans-bold">
              {item.orderNumber}
            </Text>
            <Text className="text-[12px] text-gray-500 font-poppins mt-1">
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View
            className={`${statusConfig.bgColor} px-3 py-1.5 rounded-full flex-row items-center`}
          >
            <Ionicons
              name={statusConfig.icon as any}
              size={14}
              color={
                statusConfig.textColor === "text-[#1C6206]" ? "#1C6206" : "#667"
              } // Fallback for color replacement
            />
            <Text
              className={`${statusConfig.textColor} text-[12px] font-bold ml-1 font-poppins`}
            >
              {statusConfig.label}
            </Text>
          </View>
        </View>

        {/* Product Images Snippet (Showing first product only if multi not available) */}
        <View className="flex-row mb-3">
          {item.items?.map((orderItem: any, index: number) => (
            <View
              key={index}
              className="w-16 h-16 bg-gray-50 rounded-lg mr-2 overflow-hidden"
            >
              {orderItem.product?.imageUrl ? (
                <Image
                  source={{ uri: orderItem.product.imageUrl }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="flex-1 bg-gray-100 items-center justify-center">
                  <Ionicons name="cube" size={24} color="#D1D5DB" />
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Footer */}
        <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
          <View>
            <Text className="text-[12px] text-gray-500 font-poppins">
              Total Amount
            </Text>
            <Text className="text-[16px] font-bold text-[#1D2939] font-parkinsans-bold">
              ₦{item.totalAmount?.toLocaleString()}
            </Text>
          </View>
          <TouchableOpacity
            className="flex-row items-center"
            onPress={() =>
              navigation.navigate("OrderDetails", { orderId: item.id })
            }
          >
            <Text className="text-[12px] font-medium text-[#1C6206] mr-1 font-poppins">
              View Details
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#1C6206" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-2 mb-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="#1D2939" />
        </TouchableOpacity>
        <Text className="text-[20px] font-bold text-[#1D2939] font-parkinsans-bold">
          My Orders
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row px-5 mb-4">
        <TouchableOpacity
          onPress={() => setActiveTab("all")}
          className={`flex-1 py-3 rounded-full mr-2 ${
            activeTab === "all" ? "bg-[#1C6206]" : "bg-gray-100"
          }`}
        >
          <Text
            className={`text-center text-[12px] font-bold font-poppins ${
              activeTab === "all" ? "text-white" : "text-gray-600"
            }`}
          >
            All Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("active")}
          className={`flex-1 py-3 rounded-full mr-2 ${
            activeTab === "active" ? "bg-[#1C6206]" : "bg-gray-100"
          }`}
        >
          <Text
            className={`text-center text-[12px] font-bold font-poppins ${
              activeTab === "active" ? "text-white" : "text-gray-600"
            }`}
          >
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("completed")}
          className={`flex-1 py-3 rounded-full ${
            activeTab === "completed" ? "bg-[#1C6206]" : "bg-gray-100"
          }`}
        >
          <Text
            className={`text-center text-[12px] font-bold font-poppins ${
              activeTab === "completed" ? "text-white" : "text-gray-600"
            }`}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {loading && orders.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#1C6206" />
        </View>
      ) : filteredOrders.length === 0 ? (
        <View className="flex-1 justify-center items-center px-10">
          <View className="w-20 h-20 bg-gray-50 rounded-full justify-center items-center mb-4">
            <Ionicons name="receipt-outline" size={40} color="#98A2B3" />
          </View>
          <Text className="text-[#1D2939] font-bold text-[18px] font-parkinsans-bold mb-2">
            No orders found
          </Text>
          <Text className="text-gray-500 text-center font-poppins text-[14px]">
            {activeTab === "all"
              ? "You haven't placed any orders yet."
              : `No ${activeTab} orders found.`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refresh}
              colors={["#1C6206"]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
