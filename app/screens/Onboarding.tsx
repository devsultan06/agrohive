import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Onboarding from "../components/onboarding/Onboard";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-white">
        <Onboarding />
      </View>
    </SafeAreaView>
  );
}

