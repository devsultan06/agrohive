import React from "react";
import { View, TouchableOpacity, Image } from "react-native";

export default function Socials({ navigation }: any) {
  return (
    <View className="flex-row justify-center gap-5 mb-10">
      <TouchableOpacity
        className="bg-white rounded-lg h-[50px] w-[50px] items-center justify-center"
        style={{
          elevation: 3,
          boxShadow: "2px 2px 8px 0 rgba(146, 179, 189, 0.20)",
        }}
      >
        <Image
          source={require("../../assets/google.png")}
          className="w-6 h-6"
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-white rounded-lg h-[50px] w-[50px] items-center justify-center"
        style={{
          elevation: 3,
          boxShadow: "2px 2px 8px 0 rgba(146, 179, 189, 0.20)",
        }}
      >
        <Image
          source={require("../../assets/apple.png")}
          className="w-6 h-6"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}
