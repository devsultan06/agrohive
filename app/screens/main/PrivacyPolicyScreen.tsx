import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation<any>();

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
          Privacy Policy
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-5"
      >
        {/* Last Updated */}
        <Text className="text-[12px] text-gray-500 mb-6 font-poppins">
          Last updated: February 15, 2026
        </Text>

        {/* Introduction */}
        <View className="mb-6">
          <Text className="text-[16px] font-bold text-[#1D2939] mb-3 font-parkinsans-bold">
            Introduction
          </Text>
          <Text className="text-[14px] text-gray-600 leading-6 font-poppins">
            Welcome to AgroHive. We respect your privacy and are committed to
            protecting your personal data. This privacy policy will inform you
            about how we look after your personal data when you visit our app
            and tell you about your privacy rights.
          </Text>
        </View>

        {/* Information We Collect */}
        <View className="mb-6">
          <Text className="text-[16px] font-bold text-[#1D2939] mb-3 font-parkinsans-bold">
            Information We Collect
          </Text>
          <Text className="text-[14px] text-gray-600 leading-6 mb-3 font-poppins">
            We may collect, use, store and transfer different kinds of personal
            data about you:
          </Text>
          <View className="ml-4">
            <View className="flex-row mb-2">
              <Text className="text-[14px] text-gray-600 mr-2 font-poppins">
                •
              </Text>
              <Text className="text-[14px] text-gray-600 flex-1 font-poppins">
                Identity Data: name, username, profile picture
              </Text>
            </View>
            <View className="flex-row mb-2">
              <Text className="text-[14px] text-gray-600 mr-2 font-poppins">
                •
              </Text>
              <Text className="text-[14px] text-gray-600 flex-1 font-poppins">
                Contact Data: email address, phone number, delivery addresses
              </Text>
            </View>
            <View className="flex-row mb-2">
              <Text className="text-[14px] text-gray-600 mr-2 font-poppins">
                •
              </Text>
              <Text className="text-[14px] text-gray-600 flex-1 font-poppins">
                Transaction Data: details about payments and orders
              </Text>
            </View>
            <View className="flex-row mb-2">
              <Text className="text-[14px] text-gray-600 mr-2 font-poppins">
                •
              </Text>
              <Text className="text-[14px] text-gray-600 flex-1 font-poppins">
                Technical Data: device information, IP address, browser type
              </Text>
            </View>
          </View>
        </View>

        {/* How We Use Your Information */}
        <View className="mb-6">
          <Text className="text-[16px] font-bold text-[#1D2939] mb-3 font-parkinsans-bold">
            How We Use Your Information
          </Text>
          <Text className="text-[14px] text-gray-600 leading-6 mb-3 font-poppins">
            We use your personal data for the following purposes:
          </Text>
          <View className="ml-4">
            <View className="flex-row mb-2">
              <Text className="text-[14px] text-gray-600 mr-2 font-poppins">
                •
              </Text>
              <Text className="text-[14px] text-gray-600 flex-1 font-poppins">
                To process and deliver your orders
              </Text>
            </View>
            <View className="flex-row mb-2">
              <Text className="text-[14px] text-gray-600 mr-2 font-poppins">
                •
              </Text>
              <Text className="text-[14px] text-gray-600 flex-1 font-poppins">
                To manage your account and provide customer support
              </Text>
            </View>
            <View className="flex-row mb-2">
              <Text className="text-[14px] text-gray-600 mr-2 font-poppins">
                •
              </Text>
              <Text className="text-[14px] text-gray-600 flex-1 font-poppins">
                To send you important updates and promotional offers
              </Text>
            </View>
            <View className="flex-row mb-2">
              <Text className="text-[14px] text-gray-600 mr-2 font-poppins">
                •
              </Text>
              <Text className="text-[14px] text-gray-600 flex-1 font-poppins">
                To improve our services and user experience
              </Text>
            </View>
          </View>
        </View>

        {/* Data Security */}
        <View className="mb-6">
          <Text className="text-[16px] font-bold text-[#1D2939] mb-3 font-parkinsans-bold">
            Data Security
          </Text>
          <Text className="text-[14px] text-gray-600 leading-6 font-poppins">
            We have implemented appropriate security measures to prevent your
            personal data from being accidentally lost, used, or accessed in an
            unauthorized way. We limit access to your personal data to those
            employees and partners who have a business need to know.
          </Text>
        </View>

        {/* Your Rights */}
        <View className="mb-6">
          <Text className="text-[16px] font-bold text-[#1D2939] mb-3 font-parkinsans-bold">
            Your Rights
          </Text>
          <Text className="text-[14px] text-gray-600 leading-6 mb-3 font-poppins">
            Under data protection laws, you have rights including:
          </Text>
          <View className="ml-4">
            <View className="flex-row mb-2">
              <Text className="text-[14px] text-gray-600 mr-2 font-poppins">
                •
              </Text>
              <Text className="text-[14px] text-gray-600 flex-1 font-poppins">
                Request access to your personal data
              </Text>
            </View>
            <View className="flex-row mb-2">
              <Text className="text-[14px] text-gray-600 mr-2 font-poppins">
                •
              </Text>
              <Text className="text-[14px] text-gray-600 flex-1 font-poppins">
                Request correction of your personal data
              </Text>
            </View>
            <View className="flex-row mb-2">
              <Text className="text-[14px] text-gray-600 mr-2 font-poppins">
                •
              </Text>
              <Text className="text-[14px] text-gray-600 flex-1 font-poppins">
                Request deletion of your personal data
              </Text>
            </View>
            <View className="flex-row mb-2">
              <Text className="text-[14px] text-gray-600 mr-2 font-poppins">
                •
              </Text>
              <Text className="text-[14px] text-gray-600 flex-1 font-poppins">
                Withdraw consent at any time
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Us */}
        <View className="mb-6">
          <Text className="text-[16px] font-bold text-[#1D2939] mb-3 font-parkinsans-bold">
            Contact Us
          </Text>
          <Text className="text-[14px] text-gray-600 leading-6 font-poppins">
            If you have any questions about this privacy policy or our privacy
            practices, please contact us at:
          </Text>
          <Text className="text-[14px] text-[#1C6206] mt-2 font-poppins">
            privacy@agrohive.com
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
