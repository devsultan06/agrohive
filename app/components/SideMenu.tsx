import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Logo2 from "../assets/logo2.svg";

const { width } = Dimensions.get("window");

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

const MENU_ITEMS = [
  { icon: "person-outline", label: "Profile", screen: "Profile" },
  { icon: "cart-outline", label: "My Cart", screen: "Cart" },
  { icon: "heart-outline", label: "Favorite", screen: "Favorite" },
  { icon: "cube-outline", label: "Orders", screen: "Orders" },
  {
    icon: "notifications-outline",
    label: "Notifications",
    screen: "Notifications",
  },
  { icon: "bookmark-outline", label: "Saved Posts", screen: "SavedPosts" },
  { icon: "help-circle-outline", label: "FAQ's", screen: "FAQ" },
];

export const SideMenu: React.FC<SideMenuProps> = ({ visible, onClose }) => {
  const navigation = useNavigation<any>();
  const translateX = useSharedValue(-width);
  const opacity = useSharedValue(0);
  const [showModal, setShowModal] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      translateX.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateX.value = withTiming(-width, { duration: 300 }, () => {
        runOnJS(setShowModal)(false);
      });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleNavigation = (screen: string) => {
    onClose(); // Trigger close animation

    // Check for Tab Screens
    if (
      screen === "Home" ||
      screen === "Market" ||
      screen === "Community" ||
      screen === "Cart" ||
      screen === "Profile"
    ) {
      navigation.navigate("Main", { screen: screen });
    } else {
      // Stack Screens
      navigation.navigate(screen);
    }
  };

  if (!showModal) return null;

  return (
    <Modal
      transparent
      visible={showModal}
      onRequestClose={onClose}
      animationType="none"
    >
      <View className="flex-1 flex-row">
        {/* Backdrop */}
        <Animated.View
          className="absolute inset-0 bg-black/50"
          style={animatedBackdropStyle}
        >
          <TouchableOpacity
            className="flex-1"
            onPress={onClose}
            activeOpacity={1}
          />
        </Animated.View>

        <Animated.View
          className="bg-white h-full px-6 shadow-xl z-50 rounded-r-[32px] w-[75%]"
          style={animatedStyle}
        >
          <View className="flex-1 pt-40 items-center">
            {/* Logo */}
            <View className="flex-row items-center gap-3 mb-10">
              <Logo2 width={40} height={40} />
              <Text className="text-[24px] font-bold text-[#000] font-parkinsans-bold">
                AgroHive
              </Text>
            </View>

            {/* Menu Items */}
            <View className="gap-[50px]">
              {MENU_ITEMS.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center gap-4"
                  onPress={() => handleNavigation(item.screen)}
                >
                  <Ionicons name={item.icon as any} size={24} color="#667085" />
                  <Text className="text-[16px] text-[#1D2939] font-poppins font-medium">
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Divider */}
          <View className="h-[1px] bg-gray-100 mb-8 w-full" />

          {/* Sign Out */}
          <TouchableOpacity
            className="flex-row items-center gap-4 mb-12 self-center"
            onPress={() => console.log("Sign Out")}
          >
            <Ionicons name="log-out-outline" size={24} color="#667085" />
            <Text className="text-[16px] text-[#1D2939] font-poppins font-medium">
              Sign Out
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};
