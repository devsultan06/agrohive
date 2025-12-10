import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./screens/SplashScreen";
import { useFonts } from "expo-font";
import * as SplashScreen2 from "expo-splash-screen";
import { useCallback } from "react";
import AuthNavigator from "./navigation/AuthNavigator";
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
