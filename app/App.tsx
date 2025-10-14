import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./screens/SplashScreen";
import HomeScreen from "./screens/Home";
import AppLoading from "expo-app-loading";
import { useFonts } from "expo-font";

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Parkinsans-Regular": require("./assets/fonts/Parkinsans-Regular.ttf"),
    "Parkinsans-Bold": require("./assets/fonts/Parkinsans-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
