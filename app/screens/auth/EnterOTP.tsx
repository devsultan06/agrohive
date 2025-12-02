import React, { useRef, useState } from "react";
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

export default function EnterOtp({ navigation }: any) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < inputs.current.length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const code = otp.join("");
    console.log("Entered OTP:", code);
    if (code.length === 4) {
      navigation.navigate("ResetPassword");
      // handle verification logi
    } else {
      alert("Please enter a 4-digit code");
    }
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
        </TouchableOpacity>{" "}
        <View style={styles.content}>
          <Text style={styles.title}>Enter the code</Text>
          <Text style={styles.subtitle}>
            We’ve sent a 4-digit code to your email. Please enter it below to
            verify your identity.
          </Text>

          {/* OTP Inputs */}
          <View style={styles.otpContainer}>
            {otp.map((value, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputs.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  value || inputs.current[index]?.isFocused()
                    ? { borderColor: "#1C6206" }
                    : null,
                ]}
                keyboardType="number-pad"
                maxLength={1}
                value={value}
                onChangeText={(text) => handleChange(text, index)}
              />
            ))}
          </View>

          {/* Resend */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn’t receive the code? </Text>
            <TouchableOpacity>
              <Text style={styles.resendLink}>Resend</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Send OTP Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Verify and proceed</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bg: {
    flex: 1,
    width: "100%",
    height: "100%",
    paddingHorizontal: 24,
  },

  arrowIcon: {
    width: 24,
    height: 24,
  },
  backContainer: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  backText: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Poppins-Regular",
  },

  content: {
    marginTop: 55,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1D2939",
    fontFamily: "Parkinsans-Bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: "#000",
    opacity: 0.5,
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    marginBottom: 40,
    lineHeight: 18,
    width: "85%",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    width: "90%",
    marginBottom: 25,
  },
  otpInput: {
    width: 48,
    height: 50,
    borderWidth: 1,
    borderColor: "#F2F2F2",
    borderRadius: 4,
    textAlign: "center",
    fontSize: 14,
    color: "#1C6206",
    backgroundColor: "#FAFAFA",
    fontFamily: "Poppins-SemiBold",
  },
  resendContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  resendText: {
    fontSize: 14,
    color: "#A0A4A8",
    fontFamily: "Poppins-Regular",
  },
  resendLink: {
    fontSize: 12,
    color: "#1C6206",
    fontFamily: "Poppins-Regular",
  },
  button: {
    backgroundColor: "#1C6206",
    height: 56,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Poppins-SemiBold",
  },
});
