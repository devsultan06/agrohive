import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Toast } from "../../components/Toast";
import { useAddressStore, Address } from "../../store/useAddressStore";

export default function AddAddressScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const editingAddress = route.params?.address;
  const { addAddress, updateAddress } = useAddressStore();

  const [label, setLabel] = useState(editingAddress?.label || "Home");
  const [fullName, setFullName] = useState(editingAddress?.fullName || "");
  const [phone, setPhone] = useState(editingAddress?.phone || "");
  const [address, setAddress] = useState(editingAddress?.address || "");
  const [city, setCity] = useState(editingAddress?.city || "");
  const [state, setState] = useState(editingAddress?.state || "");
  const [isDefault, setIsDefault] = useState(
    editingAddress?.isDefault || false,
  );

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleSave = () => {
    if (!fullName || !phone || !address) {
      setToastMessage("Please fill in all required fields");
      setToastVisible(true);
      return;
    }

    const addressData: Address = {
      id: editingAddress?.id || Math.random().toString(36).substr(2, 9),
      label,
      fullName,
      phone,
      address: `${address}${city ? `, ${city}` : ""}${state ? `, ${state}` : ""}`,
      isDefault,
    };

    if (editingAddress) {
      updateAddress(addressData);
      setToastMessage("Address updated successfully");
    } else {
      addAddress(addressData);
      setToastMessage("Address added successfully");
    }

    setToastVisible(true);

    setTimeout(() => {
      navigation.goBack();
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center px-5 pt-2 mb-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center mr-4"
          >
            <Ionicons name="arrow-back" size={24} color="#1D2939" />
          </TouchableOpacity>
          <Text className="text-[20px] font-bold text-[#1D2939] font-parkinsans-bold">
            {editingAddress ? "Edit Address" : "Add New Address"}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        >
          {/* Label Selection */}
          <Text className="text-[14px] font-medium text-[#344054] mb-3 font-poppins">
            Address Label
          </Text>
          <View className="flex-row mb-6">
            {["Home", "Office", "Other"].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setLabel(item)}
                className={`px-6 py-2 rounded-full mr-2 border ${
                  label === item
                    ? "bg-[#1C6206] border-[#1C6206]"
                    : "bg-white border-gray-200"
                }`}
              >
                <Text
                  className={`text-[14px] font-medium font-poppins ${
                    label === item ? "text-white" : "text-gray-500"
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Full Name */}
          <View className="mb-5">
            <Text className="text-[14px] font-medium text-[#344054] mb-2 font-poppins">
              Full Name*
            </Text>
            <TextInput
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              className="bg-gray-50 h-14 rounded-xl px-4 font-poppins text-[#1D2939] border border-gray-100"
            />
          </View>

          {/* Phone Number */}
          <View className="mb-5">
            <Text className="text-[14px] font-medium text-[#344054] mb-2 font-poppins">
              Phone Number*
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="+234 000 000 0000"
              keyboardType="phone-pad"
              className="bg-gray-50 h-14 rounded-xl px-4 font-poppins text-[#1D2939] border border-gray-100"
            />
          </View>

          {/* Address */}
          <View className="mb-5">
            <Text className="text-[14px] font-medium text-[#344054] mb-2 font-poppins">
              Street Address*
            </Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="House number and street name"
              multiline
              className="bg-gray-50 h-24 rounded-xl px-4 py-3 font-poppins text-[#1D2939] border border-gray-100"
            />
          </View>

          {/* City & State */}
          <View className="flex-row mb-5">
            <View className="flex-1 mr-2">
              <Text className="text-[14px] font-medium text-[#344054] mb-2 font-poppins">
                City
              </Text>
              <TextInput
                value={city}
                onChangeText={setCity}
                placeholder="Ikeja"
                className="bg-gray-50 h-14 rounded-xl px-4 font-poppins text-[#1D2939] border border-gray-100"
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-[14px] font-medium text-[#344054] mb-2 font-poppins">
                State
              </Text>
              <TextInput
                value={state}
                onChangeText={setState}
                placeholder="Lagos"
                className="bg-gray-50 h-14 rounded-xl px-4 font-poppins text-[#1D2939] border border-gray-100"
              />
            </View>
          </View>

          {/* Default Switch */}
          <View className="flex-row justify-between items-center py-4 border-t border-gray-100 mt-2">
            <View>
              <Text className="text-[14px] font-bold text-[#1D2939] font-parkinsans-bold">
                Set as Default Address
              </Text>
              <Text className="text-[12px] text-gray-500 font-poppins">
                Make this your primary shipping address
              </Text>
            </View>
            <Switch
              value={isDefault}
              onValueChange={setIsDefault}
              trackColor={{ false: "#D1D5DB", true: "#1C6206" }}
              thumbColor={
                Platform.OS === "ios"
                  ? "#FFFFFF"
                  : isDefault
                    ? "#FFFFFF"
                    : "#F4F3F4"
              }
            />
          </View>
        </ScrollView>

        {/* Save Button */}
        <View className="absolute bottom-10 left-5 right-5">
          <TouchableOpacity
            onPress={handleSave}
            className="bg-[#1C6206] h-[56px] rounded-full justify-center items-center"
          >
            <Text className="text-white font-bold text-[16px] font-medium font-poppins-semibold">
              {editingAddress ? "Update Address" : "Save Address"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Toast
        message={toastMessage}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
}
