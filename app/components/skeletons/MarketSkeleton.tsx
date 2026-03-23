import React from "react";
import { View, Dimensions } from "react-native";
import { Skeleton } from "../Skeleton";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 40 - 15) / 2;

export const MarketSkeleton = () => (
  <View className="flex-1 px-5 pt-4 bg-white">
    {/* Header Skeleton */}
    <View className="flex-row justify-between items-center mb-6">
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

    {/* Search Bar Skeleton */}
    <Skeleton
      width="100%"
      height={50}
      borderRadius={25}
      style={{ marginBottom: 20 }}
    />

    {/* Filter Chips Skeleton */}
    <View className="flex-row gap-3 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} width={80} height={32} borderRadius={16} />
      ))}
    </View>

    {/* Product Grid Skeleton */}
    <View className="flex-row flex-wrap justify-between">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <View key={i} style={{ width: ITEM_WIDTH, marginBottom: 20 }}>
          <Skeleton
            width={ITEM_WIDTH}
            height={120}
            borderRadius={8}
            style={{ marginBottom: 8 }}
          />
          <View className="px-1">
            <View className="flex-row justify-between items-center mb-2">
              <Skeleton width="60%" height={12} borderRadius={4} />
              <Skeleton width="20%" height={12} borderRadius={4} />
            </View>
            <View className="flex-row justify-between items-center">
              <Skeleton width="40%" height={14} borderRadius={4} />
              <Skeleton width={40} height={20} borderRadius={10} />
            </View>
          </View>
        </View>
      ))}
    </View>
  </View>
);
