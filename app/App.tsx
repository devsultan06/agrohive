import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./screens/SplashScreen";
import { useFonts } from "expo-font";
import * as SplashScreen2 from "expo-splash-screen";
import { useCallback } from "react";
import AuthNavigator from "./navigation/AuthNavigator";
import MainNavigator from "./navigation/MainNavigator";
import FavoriteScreen from "./screens/main/FavoriteScreen";
import NotificationsScreen from "./screens/main/NotificationsScreen";
import FAQScreen from "./screens/main/FAQScreen";
import ChangePasswordScreen from "./screens/main/ChangePasswordScreen";
import PrivacyPolicyScreen from "./screens/main/PrivacyPolicyScreen";
import TermsOfServiceScreen from "./screens/main/TermsOfServiceScreen";
import OrdersScreen from "./screens/main/OrdersScreen";
import ProductDetailScreen from "./screens/main/ProductDetailScreen";
import ShippingAddressesScreen from "./screens/main/ShippingAddressesScreen";
import AddAddressScreen from "./screens/main/AddAddressScreen";
import CreatePostScreen from "./screens/main/CreatePostScreen";
import PostDetailsScreen from "./screens/main/PostDetailsScreen";
import SavedPostsScreen from "./screens/main/SavedPostsScreen";
import "./global.css";
const Stack = createStackNavigator();

// Prevent the splash screen from auto-hiding
SplashScreen2.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Parkinsans-Regular": require("./assets/fonts/Parkinsans-Regular.ttf"),
    "Parkinsans-Bold": require("./assets/fonts/Parkinsans-Bold.ttf"),
    "Parkinsans-SemiBold": require("./assets/fonts/Parkinsans-SemiBold.ttf"),
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
  });
  // Callback to hide splash when ready
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen2.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // keep splash screen visible
  }
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" options={{ headerShown: false }}>
          {(props) => (
            <SplashScreen {...props} onLayoutRootView={onLayoutRootView} />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Favorite"
          component={FavoriteScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="FAQ"
          component={FAQScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TermsOfService"
          component={TermsOfServiceScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Orders"
          component={OrdersScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ShippingAddresses"
          component={ShippingAddressesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddAddress"
          component={AddAddressScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreatePost"
          component={CreatePostScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PostDetails"
          component={PostDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SavedPosts"
          component={SavedPostsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
