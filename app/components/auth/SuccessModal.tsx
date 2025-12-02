import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

interface SuccessModalProps {
  message: string;

  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  message,
  visible,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Image
            source={require("../../assets/success.png")} // ✅ your success icon
            style={styles.icon}
          />
          <Text style={styles.title}>Congratulations!</Text>
          <Text style={styles.subtitle}>{message}</Text>

          <TouchableOpacity style={styles.button} onPress={onConfirm}>
            <Text style={styles.buttonText}>Go to login</Text>
            <Image
              source={require("../../assets/arrow.png")} // ✅ your arrow icon
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 43,
    alignItems: "center",
    width: "90%",
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderRadius: 100,
    padding: 12,
    backgroundColor: "rgba(28, 98, 6, 0.16)",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1C6206",
    marginBottom: 8,
    fontFamily: "Poppins-Bold",
  },
  subtitle: {
    color: "#000000",
    fontSize: 16,
    opacity: 0.4,
    textAlign: "center",
    fontFamily: "Poppins-Regular",

    marginBottom: 32,
  },
  button: {
    backgroundColor: "#1C6206",
    padding: 10,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    width: "100%",
    height: 56,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Poppins-Regular",
  },

  arrowIcon: {
    width: 12,
    height: 14,
  },
});
