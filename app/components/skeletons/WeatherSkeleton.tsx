import React from "react";
import { View } from "react-native";
import { Skeleton } from "../Skeleton";

export const WeatherSkeleton = () => (
  <View>
    {/* Current Weather Card Skeleton */}
    <View className="bg-[#FAFAFA] rounded-2xl p-6 mb-6 border border-gray-100 items-center">
      <Skeleton
        width={100}
        height={16}
        borderRadius={4}
        style={{ marginBottom: 8 }}
      />
      <Skeleton
        width={120}
        height={14}
        borderRadius={4}
        style={{ marginBottom: 24 }}
      />

      <View className="items-center mb-6">
        <Skeleton
          width={80}
          height={80}
          borderRadius={40}
          style={{ marginBottom: 8 }}
        />
        <Skeleton
          width={80}
          height={40}
          borderRadius={8}
          style={{ marginBottom: 8 }}
        />
        <Skeleton width={100} height={18} borderRadius={4} />
      </View>

      <View className="flex-row justify-between w-full px-4">
        {[1, 2, 3].map((i) => (
          <View key={i} className="items-center">
            <Skeleton
              width={24}
              height={24}
              borderRadius={12}
              style={{ marginBottom: 4 }}
            />
            <Skeleton
              width={40}
              height={12}
              borderRadius={4}
              style={{ marginBottom: 4 }}
            />
            <Skeleton width={50} height={14} borderRadius={4} />
          </View>
        ))}
      </View>
    </View>

    {/* Advisory Skeleton */}
    <View className="bg-green-50 p-4 rounded-xl mb-8 flex-row items-start">
      <Skeleton width={24} height={24} borderRadius={12} />
      <View className="ml-3 flex-1">
        <Skeleton
          width={120}
          height={16}
          borderRadius={4}
          style={{ marginBottom: 6 }}
        />
        <Skeleton
          width="100%"
          height={12}
          borderRadius={4}
          style={{ marginBottom: 4 }}
        />
        <Skeleton width="80%" height={12} borderRadius={4} />
      </View>
    </View>

    {/* Forecast Skeleton */}
    <Skeleton
      width={100}
      height={20}
      borderRadius={4}
      style={{ marginBottom: 16 }}
    />
    <View className="gap-3 mb-10">
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          className="flex-row items-center justify-between bg-white p-4 rounded-xl border border-gray-100"
        >
          <Skeleton width={40} height={16} borderRadius={4} />
          <View className="flex-row items-center gap-2">
            <Skeleton width={20} height={20} borderRadius={10} />
            <Skeleton width={60} height={14} borderRadius={4} />
          </View>
          <Skeleton width={40} height={16} borderRadius={4} />
        </View>
      ))}
    </View>
  </View>
);
