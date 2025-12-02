import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SuccessModal from "../../components/auth/SuccessModal";

export default function ResetPassword({ navigation }: any) {
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);

  const handleReset = () => {
    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }
    setShowModal(true);
  };

  const handleGoToLogin = () => {
    setShowModal(false);
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../../assets/bg-app.png")}
        style={styles.bg}
        resizeMode="cover"
      >
        <TouchableOpacity
          style={styles.backContainer}
          onPress={() => navigation.navigate("Login")}
        >
          <Image
            source={require("../../assets/arrow-left.png")}
            style={styles.arrowIcon}
          />
          <Text style={styles.backText}>Back to login</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Create a strong password that you’ll remember.
          </Text>

          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            secureTextEntry
            onChangeText={setPassword}
          />

          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            secureTextEntry
            onChangeText={setConfirm}
          />

          <TouchableOpacity style={styles.button} onPress={handleReset}>
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>
        </View>

        <SuccessModal
          message="You have successfully reset your password"
          visible={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleGoToLogin}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  bg: { flex: 1, width: "100%", height: "100%", paddingHorizontal: 24 },
  arrowIcon: { width: 24, height: 24 },
  backContainer: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  backText: { fontSize: 14, color: "#000", fontFamily: "Poppins-Regular" },
  content: { marginTop: 55 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1D2939",
    textAlign: "center",
    fontFamily: "Parkinsans-Bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: "#000",
    opacity: 0.4,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    marginBottom: 40,
    width: "80%",
    marginHorizontal: "auto",
  },
  label: {
    fontSize: 12,
    color: "#000",
    marginBottom: 8,
    fontFamily: "Poppins-Regular",
  },
  input: {
    height: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#F2F2F2",
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#000",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1C6206",
    height: 56,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 256,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Poppins-Regular",
  },
});
