import React from "react";
import { View, Text, Image } from "react-native";

interface UserAvatarProps {
  uri?: string | null;
  fullName?: string;
  size?: number;
  className?: string;
}

export const UserAvatar = ({
  uri,
  fullName,
  size = 40,
  className = "",
}: UserAvatarProps) => {
  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  if (uri && uri.startsWith("http")) {
    return (
      <View
        className={`bg-gray-200 overflow-hidden ${className}`}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      >
        <Image source={{ uri }} className="w-full h-full" />
      </View>
    );
  }

  // Fallback to initials circle
  return (
    <View
      className={`bg-[#1C6206] items-center justify-center ${className}`}
      style={{ width: size, height: size, borderRadius: size / 2 }}
    >
      <Text className="text-white font-bold" style={{ fontSize: size * 0.4 }}>
        {initials}
      </Text>
    </View>
  );
};
