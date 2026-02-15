import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, Platform } from "react-native";
import { Feather, Ionicons, SimpleLineIcons } from "@expo/vector-icons";

// Screens
import HomeScreen from "../screens/main/HomeScreen";
import CommunityScreen from "../screens/main/CommunityScreen";
import CartScreen from "../screens/main/CartScreen";
import FavoriteScreen from "../screens/main/FavoriteScreen";
import ProfileScreen from "../screens/main/ProfileScreen";

// Icons
import HomeIcon from "../assets/home.svg";
import HomeActiveIcon from "../assets/home-active.svg";
import MarketIcon from "../assets/market.svg";
import MarketActiveIcon from "../assets/market-active.svg";
import CommunityIcon from "../assets/community.svg";
import CommunityActiveIcon from "../assets/community-active.svg";
import SettingIcon from "../assets/Setting.svg";
import ProfileIcon from "../assets/Profile.svg";
import ProfileActiveIcon from "../assets/Profile-active.svg";
import MarketScreen from "../screens/main/MarketScreen";

const CartIcon = (props: any) => (
  <Ionicons name="cart-outline" size={24} color={props.color || "#98A2B3"} />
);
const CartActiveIcon = (props: any) => (
  <Ionicons name="cart" size={24} color={props.color || "#1C6206"} />
);

const Tab = createBottomTabNavigator();

const renderTabIcon = (
  focused: boolean,
  ActiveIcon: any,
  InactiveIcon: any,
  label: string,
) => (
  <View
    style={{
      backgroundColor: focused ? "#1C6206" : "transparent",
      borderRadius: 999,
      paddingHorizontal: focused ? 16 : 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      minWidth: focused ? 100 : "auto",
      height: 50,
    }}
  >
    {focused ? (
      <ActiveIcon width={20} height={20} color="white" />
    ) : (
      <InactiveIcon width={20} height={20} />
    )}
    {focused && (
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={{
          color: "white",
          fontSize: 13,
          fontFamily: "Poppins-SemiBold",
        }}
      >
        {label}
      </Text>
    )}
  </View>
);

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#FAFAFA",
          height: Platform.OS === "ios" ? 85 : 70,
          paddingBottom: Platform.OS === "ios" ? 30 : 15,
          paddingTop: 10,
          paddingHorizontal: 30,
          elevation: 0,
          borderTopWidth: 1,
          borderTopColor: "#F2F4F7",
        },
        tabBarItemStyle: {
          width: "auto", // Allow items to autosize
          paddingHorizontal: 10, // Add some spacing between items
        },
        tabBarActiveTintColor: "#1C6206",
        tabBarInactiveTintColor: "#98A2B3",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            renderTabIcon(focused, HomeActiveIcon, HomeIcon, "Home"),
        }}
      />
      <Tab.Screen
        name="Market"
        component={MarketScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            renderTabIcon(focused, MarketActiveIcon, MarketIcon, "Market"),
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            renderTabIcon(
              focused,
              CommunityActiveIcon,
              CommunityIcon,
              "Community",
            ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            renderTabIcon(focused, CartActiveIcon, CartIcon, "Cart"),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            renderTabIcon(focused, ProfileActiveIcon, ProfileIcon, "Profile"),
        }}
      />
    </Tab.Navigator>
  );
}
