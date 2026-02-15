import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function TermsOfServiceScreen() {
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
          Terms of Service
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

        {/* Agreement to Terms */}
        <View className="mb-6">
          <Text className="text-[16px] font-bold text-[#1D2939] mb-3 font-parkinsans-bold">
            Agreement to Terms
          </Text>
          <Text className="text-[14px] text-gray-600 leading-6 font-poppins">
            By accessing and using AgroHive, you accept and agree to be bound by
            the terms and provisions of this agreement. If you do not agree to
            these terms, please do not use our services.
          </Text>
        </View>

        {/* Use of Services */}
        <View className="mb-6">
          <Text className="text-[16px] font-bold text-[#1D2939] mb-3 font-parkinsans-bold">
            Use of Services
          </Text>
          <Text className="text-[14px] text-gray-600 leading-6 mb-3 font-poppins">
            You agree to use our services only for lawful purposes and in
            accordance with these Terms. You agree not to:
          </Text>
          <View className="ml-4">
            <View className="flex-row mb-2">
              <Text className="text-[14px] text-gray-600 mr-2 font-poppins">
                •
              </Text>
              <Text className="text-[14px] text-gray-600 flex-1 font-poppins">
                Use the service in any way that violates applicable laws
              </Text>
            </View>
            <View className="flex-row mb-2">
              <Text className="text-[14px] text-gray-600 mr-2 font-poppins">
                •
              </Text>
              <Text className="text-[14px] text-gray-600 flex-1 font-poppins">
                Engage in any fraudulent or deceptive practices
              </Text>
            </View>
            <View className="flex-row mb-2">
              <Text className="text-[14px] text-gray-600 mr-2 font-poppins">
                •
              </Text>
              <Text className="text-[14px] text-gray-600 flex-1 font-poppins">
                Interfere with or disrupt the service or servers
              </Text>
            </View>
            <View className="flex-row mb-2">
              <Text className="text-[14px] text-gray-600 mr-2 font-poppins">
                •
              </Text>
              <Text className="text-[14px] text-gray-600 flex-1 font-poppins">
                Attempt to gain unauthorized access to any part of the service
              </Text>
            </View>
          </View>
        </View>

        {/* Account Responsibilities */}
        <View className="mb-6">
          <Text className="text-[16px] font-bold text-[#1D2939] mb-3 font-parkinsans-bold">
            Account Responsibilities
          </Text>
          <Text className="text-[14px] text-gray-600 leading-6 font-poppins">
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account. You must notify us immediately of any unauthorized use of
            your account.
          </Text>
        </View>

        {/* Orders and Payments */}
        <View className="mb-6">
          <Text className="text-[16px] font-bold text-[#1D2939] mb-3 font-parkinsans-bold">
            Orders and Payments
          </Text>
          <Text className="text-[14px] text-gray-600 leading-6 mb-3 font-poppins">
            When you place an order through AgroHive:
          </Text>
          <View className="ml-4">
            <View className="flex-row mb-2">
              <Text className="text-[14px] text-gray-600 mr-2 font-poppins">
                •
              </Text>
              <Text className="text-[14px] text-gray-600 flex-1 font-poppins">
                All prices are subject to change without notice
              </Text>
            </View>
            <View className="flex-row mb-2">
              <Text className="text-[14px] text-gray-600 mr-2 font-poppins">
                •
              </Text>
              <Text className="text-[14px] text-gray-600 flex-1 font-poppins">
                We reserve the right to refuse or cancel any order
              </Text>
            </View>
            <View className="flex-row mb-2">
              <Text className="text-[14px] text-gray-600 mr-2 font-poppins">
                •
              </Text>
              <Text className="text-[14px] text-gray-600 flex-1 font-poppins">
                Payment must be received before order processing
              </Text>
            </View>
            <View className="flex-row mb-2">
              <Text className="text-[14px] text-gray-600 mr-2 font-poppins">
                •
              </Text>
              <Text className="text-[14px] text-gray-600 flex-1 font-poppins">
                Delivery times are estimates and not guaranteed
              </Text>
            </View>
          </View>
        </View>

        {/* Returns and Refunds */}
        <View className="mb-6">
          <Text className="text-[16px] font-bold text-[#1D2939] mb-3 font-parkinsans-bold">
            Returns and Refunds
          </Text>
          <Text className="text-[14px] text-gray-600 leading-6 font-poppins">
            We offer a 7-day return policy for unused items in original
            packaging. Refunds will be processed within 7-10 business days after
            we receive the returned item. Shipping costs are non-refundable.
          </Text>
        </View>

        {/* Limitation of Liability */}
        <View className="mb-6">
          <Text className="text-[16px] font-bold text-[#1D2939] mb-3 font-parkinsans-bold">
            Limitation of Liability
          </Text>
          <Text className="text-[14px] text-gray-600 leading-6 font-poppins">
            AgroHive shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages resulting from your use of or
            inability to use the service.
          </Text>
        </View>

        {/* Changes to Terms */}
        <View className="mb-6">
          <Text className="text-[16px] font-bold text-[#1D2939] mb-3 font-parkinsans-bold">
            Changes to Terms
          </Text>
          <Text className="text-[14px] text-gray-600 leading-6 font-poppins">
            We reserve the right to modify these terms at any time. We will
            notify users of any material changes. Your continued use of the
            service after such modifications constitutes your acceptance of the
            updated terms.
          </Text>
        </View>

        {/* Contact Information */}
        <View className="mb-6">
          <Text className="text-[16px] font-bold text-[#1D2939] mb-3 font-parkinsans-bold">
            Contact Information
          </Text>
          <Text className="text-[14px] text-gray-600 leading-6 font-poppins">
            For questions about these Terms of Service, please contact us at:
          </Text>
          <Text className="text-[14px] text-[#1C6206] mt-2 font-poppins">
            legal@agrohive.com
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
