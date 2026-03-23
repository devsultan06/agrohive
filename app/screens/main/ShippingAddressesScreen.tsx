import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useAddressStore, Address } from "../../store/useAddressStore";

export default function ShippingAddressesScreen() {
  const navigation = useNavigation<any>();
  const { addresses, selectedAddress, selectAddress, deleteAddress } =
    useAddressStore();

  const handleSelect = (address: Address) => {
    selectAddress(address);
    // If user came from cart, nav back to cart might be nice
    // but for now just selecting is enough.
    // If we want to automatically go back after selection:
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const renderAddressItem = ({ item }: { item: Address }) => {
    const isSelected = selectedAddress?.id === item.id;

    return (
      <TouchableOpacity
        onPress={() => handleSelect(item)}
        className={`bg-white rounded-[20px] p-5 border ${
          isSelected ? "border-[#1C6206]" : "border-black/[0.03]"
        } mb-4`}
        style={
          isSelected
            ? {
                shadowColor: "#1C6206",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }
            : {}
        }
      >
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <View
              className={`w-8 h-8 ${isSelected ? "bg-[#1C6206]" : "bg-gray-50"} rounded-full justify-center items-center mr-2`}
            >
              <Ionicons
                name={
                  item.label === "Home" ? "home-outline" : "business-outline"
                }
                size={18}
                color={isSelected ? "white" : "#1D2939"}
              />
            </View>
            <Text className="text-[16px] font-bold text-[#1D2939] font-parkinsans-bold">
              {item.label}
            </Text>
            {item.isDefault && (
              <View className="bg-[#1C6206]/10 px-2 py-0.5 rounded-full ml-2">
                <Text className="text-[#1C6206] text-[10px] font-bold font-poppins">
                  DEFAULT
                </Text>
              </View>
            )}
            {isSelected && !item.isDefault && (
              <View className="bg-blue-50 px-2 py-0.5 rounded-full ml-2">
                <Text className="text-blue-600 text-[10px] font-bold font-poppins">
                  SELECTED
                </Text>
              </View>
            )}
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("AddAddress", { address: item })
              }
              className="mr-3"
            >
              <Feather name="edit-2" size={18} color="#98A2B3" />
            </TouchableOpacity>
            {isSelected && (
              <Ionicons name="checkmark-circle" size={24} color="#1C6206" />
            )}
          </View>
        </View>

        <Text className="text-[14px] font-medium text-[#344054] mb-1 font-poppins">
          {item.fullName}
        </Text>
        <Text className="text-[14px] text-gray-500 mb-3 font-poppins leading-5">
          {item.address}
        </Text>
        <Text className="text-[14px] text-gray-500 font-poppins">
          {item.phone}
        </Text>

        {!isSelected && (
          <View className="flex-row justify-end mt-2">
            <TouchableOpacity
              onPress={() => deleteAddress(item.id)}
              className="flex-row items-center"
            >
              <Ionicons name="trash-outline" size={16} color="#F04438" />
              <Text className="text-[#F04438] text-[12px] font-bold ml-1 font-poppins">
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
          Shipping Addresses
        </Text>
      </View>

      {addresses.length === 0 ? (
        <View className="flex-1 justify-center items-center px-10">
          <View className="w-20 h-20 bg-gray-50 rounded-full justify-center items-center mb-4">
            <Ionicons name="location-outline" size={40} color="#98A2B3" />
          </View>
          <Text className="text-[#1D2939] font-bold text-[18px] font-parkinsans-bold mb-2">
            No addresses found
          </Text>
          <Text className="text-gray-500 text-center font-poppins text-[14px]">
            Please add an address to continue your shopping experience.
          </Text>
        </View>
      ) : (
        <FlatList
          data={addresses}
          renderItem={renderAddressItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Button Fixed at Bottom */}
      <View className="absolute bottom-10 left-5 right-5">
        <TouchableOpacity
          onPress={() => navigation.navigate("AddAddress")}
          className="bg-[#1C6206] h-[56px] rounded-full flex-row justify-center items-center"
          style={{
            shadowColor: "#1C6206",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Ionicons name="add" size={24} color="white" />
          <Text className="text-white font-bold text-[16px] font-medium font-poppins-semibold ml-2">
            Add New Address
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
