import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ_DATA = [
  {
    id: "1",
    question: "How do I track my order?",
    answer:
      "You can track your order in the 'Orders' section of your profile. Once dispatched, you'll receive a tracking link via email.",
  },
  {
    id: "2",
    question: "Do you offer international shipping?",
    answer:
      "Currently, we only ship within Nigeria. We are working on expanding our services to other countries soon.",
  },
  {
    id: "3",
    question: "Can I return a product if I'm not satisfied?",
    answer:
      "Yes, we have a 7-day return policy for unused items in original packaging. Please check our Returns Policy page for more details.",
  },
  {
    id: "4",
    question: "How do I contact customer support?",
    answer:
      "You can reach us via the 'Contact Us' button below or email support@agrohive.com. We typically respond within 24 hours.",
  },
  {
    id: "5",
    question: "Is payment secure on AgroHive?",
    answer:
      "Absolutely. We use industry-standard encryption and trusted payment gateways to ensure your transaction details are safe.",
  },
];

const AccordionItem = ({
  item,
  expanded,
  onPress,
}: {
  item: any;
  expanded: boolean;
  onPress: () => void;
}) => {
  return (
    <View className="mb-4 bg-white rounded-xl border border-gray-100 overflow-hidden">
      <TouchableOpacity
        onPress={onPress}
        className="flex-row justify-between items-center p-4 bg-gray-50/50"
      >
        <Text className="text-[14px] font-bold text-[#1D2939] font-parkinsans-bold flex-1 mr-4">
          {item.question}
        </Text>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#667085"
        />
      </TouchableOpacity>

      {expanded && (
        <View className="p-4 bg-white border-t border-gray-100">
          <Text className="text-[13px] text-gray-600 font-poppins leading-5">
            {item.answer}
          </Text>
        </View>
      )}
    </View>
  );
};

export default function FAQScreen() {
  const navigation = useNavigation<any>();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredFAQs = FAQ_DATA.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView className="flex-1 bg-white px-5 pt-2">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center mr-4"
        >
          <Ionicons name="arrow-back" size={24} color="#1D2939" />
        </TouchableOpacity>
        <Text className="text-[20px] font-bold text-[#1D2939] font-parkinsans-bold">
          Help & Support
        </Text>
      </View>

      {/* Search */}
      <View className="flex-row items-center bg-gray-50 rounded-xl px-4 h-12 mb-6 border border-gray-100">
        <Ionicons name="search" size={20} color="#98A2B3" />
        <TextInput
          placeholder="Search for answers..."
          placeholderTextColor="#98A2B3"
          className="flex-1 ml-3 font-poppins text-[14px] text-[#1D2939]"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* FAQs List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Text className="text-[16px] font-bold text-[#1D2939] mb-4 font-parkinsans-bold">
          Frequently Asked Questions
        </Text>

        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((item) => (
            <AccordionItem
              key={item.id}
              item={item}
              expanded={expandedId === item.id}
              onPress={() => toggleExpand(item.id)}
            />
          ))
        ) : (
          <View className="py-10 justify-center items-center">
            <Text className="text-gray-500 font-poppins text-center">
              No results found for "{searchQuery}"
            </Text>
          </View>
        )}

        {/* Contact Support */}
        <View className="mt-8 bg-green-50 rounded-2xl p-6 items-center">
          <View className="w-12 h-12 bg-white rounded-full justify-center items-center mb-4 shadow-sm">
            <Ionicons name="chatbubbles" size={24} color="#1C6206" />
          </View>
          <Text className="text-[16px] font-bold text-[#1D2939] mb-2 font-parkinsans-bold">
            Still have questions?
          </Text>
          <Text className="text-[12px] text-gray-500 text-center mb-6 font-poppins px-4">
            Can't find the answer you're looking for? Please chat to our
            friendly team.
          </Text>
          <TouchableOpacity className="bg-[#1C6206] px-6 py-3 rounded-full w-full items-center">
            <Text className="text-white font-bold font-poppins">
              Get in touch
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
