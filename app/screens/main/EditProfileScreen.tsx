import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyProfile } from "../../services/users/profile.service";
import { UserAvatar } from "../../components/UserAvatar";
import Toast from "react-native-toast-message";
import { useUserProfile } from "../../hooks/useUserProfile";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { data: user } = useUserProfile();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [avatar, setAvatar] = useState<string | undefined>("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setBio(user.bio || "");
      setLocation(user.location || "");
      setAvatar(user.avatarUrl || "");
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your profile has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: error.message || "Failed to update profile",
      });
    },
  });

  const pickImage = async (useCamera: boolean) => {
    let result;
    if (useCamera) {
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();
      if (!granted) {
        Toast.show({
          type: "error",
          text1: "Permission Denied",
          text2: "Camera permission is required to take photos.",
        });
        return;
      }
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
    } else {
      const { granted } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) {
        Toast.show({
          type: "error",
          text1: "Permission Denied",
          text2: "Photo library permission is required to select photos.",
        });
        return;
      }
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handlePickImage = () => {
    Alert.alert("Profile Picture", "Choose an option", [
      { text: "Camera", onPress: () => pickImage(true) },
      { text: "Gallery", onPress: () => pickImage(false) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSave = () => {
    // Basic validation
    if (!fullName.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }

    let imageObj = undefined;
    if (avatar && avatar.startsWith("file://")) {
      const match = /\.(\w+)$/.exec(avatar);
      const type = match ? `image/${match[1]}` : `image`;
      imageObj = {
        uri: avatar,
        name: `avatar.${match ? match[1] : "jpg"}`,
        type,
      };
    }

    mutation.mutate({
      fullName,
      phone,
      location,
      bio,
      image: imageObj,
    });
  };

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      {/* Header */}
      <View className="px-5 pt-2 pb-4 border-b border-gray-100 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center"
        >
          <Ionicons name="arrow-back" size={24} color="#1D2939" />
        </TouchableOpacity>
        <Text className="text-[18px] font-bold text-[#1D2939] font-parkinsans-bold">
          Edit Profile
        </Text>
        <View className="w-10" />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        >
          {/* Avatar Section */}
          <View className="items-center mb-8">
            <View className="relative">
              <UserAvatar
                uri={avatar}
                fullName={fullName}
                size={100}
                className=""
              />
              <TouchableOpacity
                onPress={handlePickImage}
                className="absolute bottom-0 right-0 bg-[#1C6206] p-2 rounded-full border-2 border-white shadow-sm"
              >
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <Text className="text-[12px] text-gray-500 mt-2 font-poppins">
              Tap to change profile picture
            </Text>
          </View>

          {/* Form Fields */}
          <View className="gap-5">
            <View>
              <Text className="text-[12px] font-medium text-[#344054] mb-1.5 font-poppins">
                Full Name
              </Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter full name"
                className="h-[48px] border border-gray-200 rounded-lg px-4 font-poppins text-[#1D2939] bg-gray-50"
              />
            </View>

            <View>
              <Text className="text-[12px] font-medium text-[#344054] mb-1.5 font-poppins">
                Email Address
              </Text>
              <TextInput
                value={email}
                editable={false}
                placeholder="Enter email address"
                className="h-[48px] border border-gray-200 rounded-lg px-4 font-poppins text-gray-400 bg-gray-50"
              />
            </View>

            <View>
              <Text className="text-[12px] font-medium text-[#344054] mb-1.5 font-poppins">
                Phone Number
              </Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                className="h-[48px] border border-gray-200 rounded-lg px-4 font-poppins text-[#1D2939] bg-gray-50"
              />
            </View>

            <View>
              <Text className="text-[12px] font-medium text-[#344054] mb-1.5 font-poppins">
                Location
              </Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Enter city, state"
                className="h-[48px] border border-gray-200 rounded-lg px-4 font-poppins text-[#1D2939] bg-gray-50"
              />
            </View>

            <View>
              <Text className="text-[12px] font-medium text-[#344054] mb-1.5 font-poppins">
                Bio
              </Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="h-[100px] border border-gray-200 rounded-lg p-4 font-poppins text-[#1D2939] bg-gray-50"
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSave}
            disabled={mutation.isPending}
            className={`mt-10 h-[56px] rounded-full justify-center items-center ${
              mutation.isPending ? "bg-gray-300" : "bg-[#1C6206]"
            }`}
          >
            <Text className="text-white font-parkinsans-bold text-[16px]">
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
