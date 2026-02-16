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
import { useUserStore } from "../../store/useUserStore";
import { Toast } from "../../components/Toast";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, updateUser } = useUserStore();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [bio, setBio] = useState(user.bio);
  const [location, setLocation] = useState(user.location);
  const [avatar, setAvatar] = useState(user.avatar);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setBio(user.bio);
    setLocation(user.location);
    setAvatar(user.avatar);
  }, [user]);

  const handlePickImage = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert(
        "Permission Required",
        "Photo library permission is required to select photos.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    // Basic validation
    if (!name.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }

    updateUser({
      name,
      email,
      phone,
      bio,
      location,
      avatar,
    });

    setToastVisible(true);
    setTimeout(() => {
      navigation.goBack();
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
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
          contentContainerStyle={{ padding: 20 }}
        >
          {/* Avatar Section */}
          <View className="items-center mb-8">
            <View className="relative">
              <View className="w-[100px] h-[100px] rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-sm">
                <Image
                  source={{
                    uri: avatar || "https://i.pravatar.cc/150?img=12",
                  }}
                  className="w-full h-full"
                />
              </View>
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
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                className="bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 h-[48px] font-poppins text-[#1D2939]"
                placeholderTextColor="#98A2B3"
              />
            </View>

            <View>
              <Text className="text-[12px] font-medium text-[#344054] mb-1.5 font-poppins">
                Email Address
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                className="bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 h-[48px] font-poppins text-[#1D2939]"
                placeholderTextColor="#98A2B3"
              />
            </View>

            <View>
              <Text className="text-[12px] font-medium text-[#344054] mb-1.5 font-poppins">
                Phone Number
              </Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                className="bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 h-[48px] font-poppins text-[#1D2939]"
                placeholderTextColor="#98A2B3"
              />
            </View>

            <View>
              <Text className="text-[12px] font-medium text-[#344054] mb-1.5 font-poppins">
                Location
              </Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="City, Country"
                className="bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 h-[48px] font-poppins text-[#1D2939]"
                placeholderTextColor="#98A2B3"
              />
            </View>

            <View>
              <Text className="text-[12px] font-medium text-[#344054] mb-1.5 font-poppins">
                Bio
              </Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself..."
                multiline
                numberOfLines={4}
                className="bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 pt-3 h-[100px] font-poppins text-[#1D2939]"
                placeholderTextColor="#98A2B3"
                textAlignVertical="top"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer / Save Button */}
      <View className="p-5">
        <TouchableOpacity
          onPress={handleSave}
          className="bg-[#1C6206] h-[50px] rounded-full justify-center items-center shadow-sm"
        >
          <Text className="text-white font-bold text-[16px] font-poppins">
            Save Changes
          </Text>
        </TouchableOpacity>
      </View>

      <Toast
        message="Profile updated successfully"
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </SafeAreaView>
  );
}
