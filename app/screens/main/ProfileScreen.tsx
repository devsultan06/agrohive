import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ConfirmationModal from "../../components/ConfirmationModal";
import { useSavedPostStore } from "../../store/useSavedPostStore";
import { usePostStore } from "../../store/usePostStore";

const ProfileMenuItem = ({
  icon,
  label,
  value,
  onPress,
  showChevron = true,
  rightElement,
}: {
  icon: any;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={!onPress}
    className="flex-row items-center justify-between py-[20px] border-b border-gray-50"
  >
    <View className="flex-row items-center">
      {icon}
      <Text className="text-[14px] font-medium text-[#1D2939] ml-3 font-poppins">
        {label}
      </Text>
    </View>
    <View className="flex-row items-center">
      {rightElement}
      {value && (
        <Text className="text-[12px] text-gray-400 font-poppins mr-2">
          {value}
        </Text>
      )}
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color="#98A2B3" />
      )}
    </View>
  </TouchableOpacity>
);

import { useUserStore } from "../../store/useUserStore";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { savedPosts } = useSavedPostStore();
  const { getPostsByUser } = usePostStore();
  const { user } = useUserStore();
  const userPostsCount = getPostsByUser(user.name).length;

  const handleLogout = () => {
    setShowLogoutModal(false);
    // TODO: Clear user session/tokens
    navigation.replace("Auth");
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    // TODO: Call delete account API
    navigation.replace("Auth");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Background Pattern */}
      <Image
        source={require("../../assets/bg-app.png")}
        className="absolute top-0 w-full h-[300px]"
        resizeMode="cover"
      />

      <SafeAreaView className="flex-1">
        {/* Header / Profile Info - Fixed */}
        <View className="items-center mt-4 mb-4">
          <View className="relative">
            <View className="w-[100px] h-[100px] rounded-full border-4 border-white shadow-sm overflow-hidden bg-gray-200">
              <Image
                source={{
                  uri: user.avatar || "https://i.pravatar.cc/150?img=12",
                }}
                className="w-full h-full"
              />
            </View>
          </View>

          <Text className="text-[20px] font-bold text-[#101828] mt-4 font-parkinsans-bold">
            {user.name}
          </Text>

          {/* Bio */}
          {user.bio && (
            <Text className="text-[12px] text-gray-500 mt-2 font-poppins text-center px-10 leading-[18px]">
              {user.bio}
            </Text>
          )}

          {/* Followers/Following Stats */}
          <View className="flex-row items-center mt-5 gap-8">
            <View className="items-center">
              <Text className="text-[18px] font-bold text-[#101828] font-parkinsans-bold">
                {(user.followers ?? 0) >= 1000
                  ? ((user.followers ?? 0) / 1000).toFixed(1) + "k"
                  : (user.followers ?? 0)}
              </Text>
              <Text className="text-[12px] text-gray-400 font-poppins">
                Followers
              </Text>
            </View>
            <View className="w-[1px] h-8 bg-gray-100" />
            <View className="items-center">
              <Text className="text-[18px] font-bold text-[#101828] font-parkinsans-bold">
                {user.following ?? 0}
              </Text>
              <Text className="text-[12px] text-gray-400 font-poppins">
                Following
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate("EditProfile")}
            className="mt-6 bg-white/80 px-8 py-2.5 rounded-full border border-gray-200 flex-row items-center shadow-sm"
          >
            <Feather name="edit-2" size={14} color="#344054" />
            <Text className="text-[12px] font-medium text-[#344054] ml-2 font-poppins">
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>

        {/* Menu Sections - Scrollable */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-5">
            {/* Section 1 */}
            <View className="bg-white rounded-[20px] p-4 border border-black/[0.03] mb-6">
              <ProfileMenuItem
                icon={
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color="#344054"
                  />
                }
                label="All posts"
                value={userPostsCount.toString()}
                onPress={() => navigation.navigate("UserPosts")}
              />
              <ProfileMenuItem
                icon={
                  <Ionicons name="bookmark-outline" size={20} color="#344054" />
                }
                label="Bookmarks"
                value={savedPosts.length.toString()}
                onPress={() => navigation.navigate("SavedPosts")}
              />
              <ProfileMenuItem
                icon={
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color="#344054"
                  />
                }
                label="Notifications"
                onPress={() => navigation.navigate("NotificationSettings")}
              />
            </View>

            {/* Section 2 */}
            <View className="bg-white rounded-[20px] p-4 border border-black/[0.03] mb-6">
              <ProfileMenuItem
                icon={
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#344054"
                  />
                }
                label="Change password"
                onPress={() => navigation.navigate("ChangePassword")}
              />
              <ProfileMenuItem
                icon={
                  <Ionicons
                    name="help-circle-outline"
                    size={20}
                    color="#344054"
                  />
                }
                label="Help"
                onPress={() => navigation.navigate("FAQ")}
              />
            </View>

            {/* Section 3: Purchases */}
            <View className="bg-white rounded-[20px] p-4 border border-black/[0.03] mb-6">
              <ProfileMenuItem
                icon={
                  <Ionicons name="cube-outline" size={20} color="#344054" />
                }
                label="My Orders"
                onPress={() => navigation.navigate("Orders")}
              />
              <ProfileMenuItem
                icon={
                  <Ionicons name="location-outline" size={20} color="#344054" />
                }
                label="Shipping Addresses"
                onPress={() => navigation.navigate("ShippingAddresses")}
              />
            </View>

            {/* Section 4: Legal */}
            <View className="bg-white rounded-[20px] p-4 border border-black/[0.03] mb-6">
              <ProfileMenuItem
                icon={
                  <Ionicons name="trash-outline" size={20} color="#F04438" />
                }
                label="Delete Account"
                onPress={() => setShowDeleteModal(true)}
              />
              <ProfileMenuItem
                icon={
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={20}
                    color="#344054"
                  />
                }
                label="Privacy Policy"
                onPress={() => navigation.navigate("PrivacyPolicy")}
              />
              <ProfileMenuItem
                icon={
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color="#344054"
                  />
                }
                label="Terms of Service"
                onPress={() => navigation.navigate("TermsOfService")}
              />
            </View>

            {/* App Version */}
            <Text className="text-center text-[12px] text-gray-400 mb-6 font-poppins">
              Version 1.0.0
            </Text>

            {/* Log Out */}
            <TouchableOpacity
              className="flex-row items-center justify-center p-4 rounded-[20px] bg-white border border-black/[0.03] mb-8"
              onPress={() => setShowLogoutModal(true)}
            >
              <Ionicons name="log-out-outline" size={20} color="#F04438" />
              <Text className="text-[14px] font-bold text-[#F04438] ml-2 font-poppins">
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={showLogoutModal}
        title="Log Out"
        message="Are you sure you want to log out of your account?"
        confirmText="Log Out"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        type="warning"
      />

      {/* Delete Account Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteModal}
        title="Delete Account"
        message="This action cannot be undone. All your data will be permanently deleted."
        confirmText="Delete Account"
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
        type="danger"
      />
    </View>
  );
}
