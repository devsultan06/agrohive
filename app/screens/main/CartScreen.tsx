import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useCartStore } from "../../store/useCartStore";
import { useAddressStore } from "../../store/useAddressStore";

export default function CartScreen() {
  const navigation = useNavigation<any>();
  const { items, removeItem, updateQuantity } = useCartStore();
  const { selectedAddress } = useAddressStore();
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);

  const handleRemoveItem = (id: string) => {
    setItemToDelete(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      removeItem(itemToDelete);
      setDeleteModalVisible(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setItemToDelete(null);
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const deliveryFee = items.length > 0 ? 2000 : 0;
  const total = subtotal + deliveryFee;

  const renderItem = ({ item }: { item: any }) => (
    <View
      className="flex-row items-center bg-white p-4 mb-4"
      style={{
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.03)",
      }}
    >
      <Image
        source={item.image}
        className="w-[80px] h-[80px] rounded-xl bg-gray-100"
        resizeMode="cover"
      />
      <View className="flex-1 ml-4 justify-between h-[80px]">
        <View className="flex-row justify-between items-start">
          <View className="flex-1 mr-2">
            <Text
              className="text-[14px] font-bold text-[#1D2939] font-parkinsans-bold"
              numberOfLines={2}
            >
              {item.name}
            </Text>
            {item.size && (
              <Text className="text-[12px] text-gray-500 font-poppins mt-1">
                Size: {item.size}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
            <Ionicons name="trash-outline" size={20} color="#F04438" />
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center mt-auto">
          <Text className="text-[14px] font-bold text-[#1D2939] font-poppins-bold">
            ₦{(item.price * item.quantity).toLocaleString()}
          </Text>
          <View className="flex-row items-center border border-gray-200 rounded-lg h-[32px]">
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, -1)}
              className="w-[32px] justify-center items-center border-r border-gray-200 h-full"
            >
              <Text className="text-[#1D2939] font-bold">-</Text>
            </TouchableOpacity>
            <View className="w-[40px] justify-center items-center h-full">
              <Text className="text-[#1D2939] font-bold">{item.quantity}</Text>
            </View>
            <TouchableOpacity
              onPress={() => updateQuantity(item.id, 1)}
              className="w-[32px] justify-center items-center border-l border-gray-200 h-full"
            >
              <Text className="text-[#1D2939] font-bold">+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]">
      <View className="flex-1">
        {/* Header */}
        <View className="px-5 py-4 flex-row justify-between items-center border-b border-gray-100">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#1D2939" />
          </TouchableOpacity>
          <Text className="text-[18px] font-bold text-[#1D2939] font-parkinsans-bold">
            My Cart
          </Text>
          <TouchableOpacity>
            <Ionicons name="share-social-outline" size={24} color="#1D2939" />
          </TouchableOpacity>
        </View>

        {/* List */}
        {items.length > 0 ? (
          <>
            <FlatList
              data={items}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 20, paddingBottom: 150 }}
              showsVerticalScrollIndicator={false}
            />

            {/* Footer Summary */}
            <View
              className="absolute bottom-0 left-[20px] right-[20px] bg-white rounded-3xl shadow-lg p-6 mb-4"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 10,
              }}
            >
              {/* Shipping Address Section */}
              <View className="mb-4 pb-4 border-b border-gray-100">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-[12px] text-gray-400 font-poppins font-medium">
                    Deliver to
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("ShippingAddresses")}
                  >
                    <Text className="text-[12px] text-[#1C6206] font-poppins font-bold">
                      Change
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="location-outline" size={16} color="#1D2939" />
                  <Text
                    className="text-[14px] text-[#1D2939] font-poppins ml-2 flex-1"
                    numberOfLines={1}
                  >
                    {selectedAddress
                      ? selectedAddress.address
                      : "Add a shipping address"}
                  </Text>
                </View>
              </View>

              <Text className="text-[16px] font-bold text-[#1D2939] mb-4 font-parkinsans-bold">
                Cart Summary
              </Text>

              <View className="flex-row justify-between mb-3">
                <Text className="text-[14px] text-gray-500 font-poppins">
                  Subtotal
                </Text>
                <Text className="text-[14px] font-bold text-[#1D2939] font-poppins-bold">
                  ₦{subtotal.toLocaleString()}
                </Text>
              </View>

              <View className="flex-row justify-between mb-4 pb-4 border-b border-gray-100">
                <Text className="text-[14px] text-gray-500 font-poppins">
                  Delivery fees
                </Text>
                <Text className="text-[14px] font-bold text-[#1D2939] font-poppins-bold">
                  ₦{deliveryFee.toLocaleString()}
                </Text>
              </View>

              <View className="flex-row justify-between mb-6">
                <Text className="text-[16px] font-bold text-[#1D2939] font-parkinsans-bold">
                  Total :
                </Text>
                <Text className="text-[18px] font-bold text-[#1D2939] font-parkinsans-bold">
                  ₦{total.toLocaleString()}
                </Text>
              </View>

              <TouchableOpacity className="bg-[#1C6206] h-[50px] rounded-full justify-center items-center">
                <Text className="text-white font-bold text-[16px] font-poppins-bold">
                  Checkout
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View className="flex-1 justify-center items-center px-4">
            <View className="w-20 h-20 bg-gray-100 rounded-full justify-center items-center mb-4">
              <Ionicons name="cart-outline" size={40} color="#98A2B3" />
            </View>
            <Text className="text-[18px] font-bold text-[#1D2939] font-parkinsans-bold mb-2">
              Your cart is empty
            </Text>
            <Text className="text-[14px] text-gray-500 font-poppins text-center mb-6">
              Looks like you haven't added any items to your cart yet.
            </Text>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-[#1C6206] px-6 py-3 rounded-full"
            >
              <Text className="text-white font-bold font-poppins-bold">
                Start Shopping
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          visible={deleteModalVisible}
          transparent
          animationType="fade"
          onRequestClose={cancelDelete}
        >
          <View
            className="flex-1 justify-center items-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <View className="bg-white rounded-2xl p-[43px] items-center w-[90%]">
              <View className="w-[100px] h-[100px] mb-5 rounded-full justify-center items-center bg-[#F04438]/[0.16]">
                <Ionicons name="trash-outline" size={50} color="#F04438" />
              </View>

              <Text className="text-[28px] font-bold text-[#1D2939] mb-2 font-poppins-bold text-center">
                Delete Item
              </Text>
              <Text className="text-black text-base opacity-40 text-center font-poppins mb-8">
                Are you sure you want to delete this item?
              </Text>

              <TouchableOpacity
                className="bg-[#F04438] p-[10px] justify-center items-center rounded-full w-full h-14 mb-3"
                onPress={confirmDelete}
              >
                <Text className="text-white text-base font-medium font-poppins">
                  Delete
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-white border border-gray-300 p-[10px] justify-center items-center rounded-full w-full h-14"
                onPress={cancelDelete}
              >
                <Text className="text-[#1D2939] text-base font-medium font-poppins">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
