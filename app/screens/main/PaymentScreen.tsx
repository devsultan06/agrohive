import React, { useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { usePaystack } from "react-native-paystack-webview";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { order, email } = route.params || {};
  const { popup } = usePaystack();

  const initiated = React.useRef(false);

  useEffect(() => {
    if (!order || initiated.current) return;
    initiated.current = true;

    // Auto-start checkout
    popup.checkout({
      email: email || "user@example.com",
      amount: Number(order.totalAmount),
      reference: `PAY-${order.orderNumber}-${Date.now()}`,
      onSuccess: (res: any) => {
        console.log("Payment success:", res);
        navigation.navigate("Orders");
      },
      onCancel: () => {
        console.log("Payment cancelled");
        navigation.goBack();
      },
      onError: (err: any) => {
        console.error("Payment error:", err);
        navigation.goBack();
      },
    });
  }, [order, email, popup, navigation]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#1C6206" />
        <Text className="mt-4 text-gray-500 font-poppins">
          Initialising secure payment...
        </Text>
      </View>
    </SafeAreaView>
  );
}
