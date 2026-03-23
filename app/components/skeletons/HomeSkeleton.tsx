import React from "react";
import { View } from "react-native";
import { Skeleton } from "../Skeleton";

export const HomeSkeleton = () => (
  <View className="flex-1 px-5 pt-4">
    {/* Header Skeleton */}
    <View className="flex-row justify-between items-center mb-8">
      <View className="flex-row items-center gap-3">
        <Skeleton width={40} height={40} borderRadius={20} />
        <View>
          <Skeleton
            width={80}
            height={16}
            borderRadius={4}
            style={{ marginBottom: 4 }}
          />
          <Skeleton width={100} height={12} borderRadius={4} />
        </View>
      </View>
      <View className="flex-row gap-2">
        <Skeleton width={44} height={44} borderRadius={22} />
        <Skeleton width={44} height={44} borderRadius={22} />
      </View>
    </View>

    {/* Weather Card Skeleton */}
    <Skeleton
      width={120}
      height={20}
      borderRadius={4}
      style={{ marginBottom: 12 }}
    />
    <View className="bg-[#FAFAFA] rounded-2xl p-5 mb-6 border border-gray-100">
      <View className="flex-row justify-between mb-4">
        <View>
          <Skeleton
            width={140}
            height={14}
            borderRadius={4}
            style={{ marginBottom: 8 }}
          />
          <Skeleton
            width={60}
            height={24}
            borderRadius={4}
            style={{ marginBottom: 8 }}
          />
          <Skeleton width={80} height={14} borderRadius={4} />
        </View>
        <View className="items-center">
          <Skeleton
            width={40}
            height={40}
            borderRadius={20}
            style={{ marginBottom: 4 }}
          />
          <Skeleton width={50} height={12} borderRadius={4} />
        </View>
      </View>
      <Skeleton width="100%" height={40} borderRadius={12} />
    </View>

    {/* Post Feed Skeleton */}
    <View className="flex-row justify-between items-center mb-4">
      <Skeleton width={100} height={20} borderRadius={4} />
      <Skeleton width={60} height={14} borderRadius={4} />
    </View>
    {[1, 2].map((i) => (
      <View key={i} className="mb-6">
        <Skeleton
          width="100%"
          height={200}
          borderRadius={16}
          style={{ marginBottom: 12 }}
        />
        <View className="flex-row items-center gap-3">
          <Skeleton width={32} height={32} borderRadius={16} />
          <View className="flex-1">
            <Skeleton
              width="60%"
              height={14}
              borderRadius={4}
              style={{ marginBottom: 4 }}
            />
            <Skeleton width="40%" height={10} borderRadius={4} />
          </View>
        </View>
      </View>
    ))}
  </View>
);
