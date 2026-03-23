import React, { useEffect } from "react";
import { Text } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";

interface ToastProps {
  message: string;
  visible: boolean;
  onHide?: () => void;
  duration?: number;
}

export const Toast = ({
  message,
  visible,
  onHide,
  duration = 2000,
}: ToastProps) => {
  useEffect(() => {
    if (visible && onHide) {
      const timer = setTimeout(onHide, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, onHide, duration]);

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeInUp.springify()}
      exiting={FadeOutUp.springify()}
      style={{
        position: "absolute",
        top: 60,
        alignSelf: "center",
        backgroundColor: "white",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 5,
        borderBottomWidth: 3,
        borderBottomColor: "#1C6206",
        zIndex: 100,
        width: "80%",
        alignItems: "center",
      }}
    >
      <Text className="text-[#1D2939] font-bold font-poppins text-[14px]">
        {message}
      </Text>
    </Animated.View>
  );
};
