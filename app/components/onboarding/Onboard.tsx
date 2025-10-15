import { useNavigation } from "@react-navigation/native";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
  PanResponder,
  PanResponderInstance,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";
import type { StackNavigationProp } from "@react-navigation/stack";

const { width, height } = Dimensions.get("window");

const SCREENS = [
  {
    id: 1,
    title: "Welcome to AgroHive: The Future of Farming",
    subtitle:
      "Transform farming with drone technology and real-time data for better decision-making",
    bgImage: require("../../assets/home.png"),
    bgColor: "#1C6206",
  },
  {
    id: 2,
    title: "Empowering Farmers with Technology",
    subtitle:
      "Get real-time crop insights, market trends, and modern farming tools—right at your fingertips",
    bgImage: require("../../assets/home2.png"),
    bgColor: "#1C6206",
  },
  {
    id: 3,
    title: "The Future of Farming is Here and It’s Connected",
    subtitle:
      "Join a global network of tech-savvy farmers transforming agriculture with smart solutions",
    bgImage: require("../../assets/home3.png"),
    bgColor: "#1C6206",
  },
];

const CircularProgress = ({
  progress,
  size,
  strokeWidth,
  color,
}: {
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const circleRef = useRef<any>(null);
  const halfCircle = size / 2;
  const circleCircumference = 2 * Math.PI * (halfCircle - strokeWidth / 2);
  const navigation = useNavigation();
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();

    animatedValue.addListener((value) => {
      if (circleRef?.current) {
        const strokeDashoffset =
          circleCircumference - (circleCircumference * value.value) / 100;
        circleRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });

    return () => animatedValue.removeAllListeners();
  }, [progress]);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={halfCircle}
          cy={halfCircle}
          r={halfCircle - strokeWidth / 2}
          stroke="#E5E5E7"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          ref={circleRef}
          cx={halfCircle}
          cy={halfCircle}
          r={halfCircle - strokeWidth / 2}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circleCircumference}
          strokeDashoffset={circleCircumference}
          strokeLinecap="round"
          transform={`rotate(-90 ${halfCircle} ${halfCircle})`}
        />
      </Svg>
    </View>
  );
};

type RootStackParamList = {
  CreateAccount: undefined;
  // add other routes here if needed
};

export default function Onboarding() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const greenProgress = useRef(new Animated.Value(0)).current;
  const ringProgress = useRef(new Animated.Value(0)).current;
  const panResponder = useRef<PanResponderInstance | null>(null);

  useEffect(() => {
    const newProgress = ((currentIndex + 1) / SCREENS.length) * 100;

    Animated.spring(greenProgress, {
      toValue: newProgress,
      useNativeDriver: false,
      bounciness: 8,
    }).start();

    Animated.spring(ringProgress, {
      toValue: newProgress,
      useNativeDriver: false,
      bounciness: 8,
    }).start();
  }, [currentIndex]);

  useEffect(() => {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (e, gestureState) => {
        const threshold = 50;
        if (gestureState.dx > threshold && currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        } else if (
          gestureState.dx < -threshold &&
          currentIndex < SCREENS.length - 1
        ) {
          setCurrentIndex(currentIndex + 1);
        }
      },
    });
  }, [currentIndex]);

  const handleSkip = () => {
    setCurrentIndex(SCREENS.length - 1);
  };

  const handleNext = () => {
    if (currentIndex < SCREENS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate("CreateAccount");
    }
  };

  const screenScale = greenProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 1.05],
  });

  const buttonScale = greenProgress.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.95],
  });

  const screen = SCREENS[currentIndex];

  return (
    <View style={styles.wrapper}>
      <SafeAreaView
        style={styles.container}
        edges={["right", "left", "bottom"]}
      >
        <Animated.View
          style={[
            styles.topSection,
            {
              transform: [{ scale: screenScale }],
            },
          ]}
          {...(panResponder.current ? panResponder.current.panHandlers : {})}
        >
          <ImageBackground
            source={screen.bgImage}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            {currentIndex === SCREENS.length - 1 && (
              <View style={styles.overlayImageContainer}>
                <Image
                  source={require("../../assets/circle.png")}
                  style={styles.overlayImage}
                  resizeMode="contain"
                />
              </View>
            )}

            <View style={styles.header}>
              {currentIndex < SCREENS.length - 1 && (
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={handleSkip}
                >
                  <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
              )}
            </View>
          </ImageBackground>
        </Animated.View>

        <View style={styles.bottomSection}>
          <View style={styles.dotsContainer}>
            {SCREENS.map((_, index) => {
              const source: number =
                index === currentIndex
                  ? require("../../assets/active.png") // active dot image
                  : require("../../assets/inactive.png"); // inactive dot image

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setCurrentIndex(index)} // jump to this slide
                >
                  <Image
                    source={source}
                    style={[
                      styles.dotImage,
                      index === currentIndex
                        ? styles.activeDotImage
                        : styles.inactiveDotImage,
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.title}>{screen.title}</Text>

          <Text style={styles.subtitle}>{screen.subtitle}</Text>

          <View style={styles.buttonContainer}>
            {currentIndex === SCREENS.length - 1 ? (
              <Animated.View
                style={[
                  {
                    transform: [{ scale: buttonScale }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.getStartedButton,
                    { backgroundColor: screen.bgColor },
                  ]}
                  onPress={handleNext}
                  activeOpacity={0.8}
                >
                  <Text style={styles.getStartedText}>Get started</Text>
                  <View style={styles.getStartedArrow}>
                    <Text style={styles.getStartedArrowText}>→</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ) : (
              <View style={styles.progressContainer}>
                <CircularProgress
                  progress={((currentIndex + 1) / SCREENS.length) * 100}
                  size={90}
                  strokeWidth={2}
                  color={screen.bgColor}
                />

                <Animated.View
                  style={[
                    styles.buttonInner,
                    {
                      transform: [{ scale: buttonScale }],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={[
                      styles.nextButton,
                      { backgroundColor: screen.bgColor },
                    ]}
                    onPress={handleNext}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.nextButtonText}>→</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topSection: {
    height: height * 0.55,
    width: "100%",
    overflow: "hidden",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
  },
  overlayImageContainer: {
    position: "absolute",
    top: "-22%",
    left: "42%",
    transform: [{ translateX: -width * 0.3 }, { translateY: -50 }],
    zIndex: 5,
  },
  overlayImage: {
    width: width * 0.7,
    height: height * 0.9,
  },

  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 20,
    paddingHorizontal: 12,
    zIndex: 10,
  },

  skipButton: {
    backgroundColor: "rgba(28, 98, 6, 0.2)",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 200,
    cursor: "pointer",
  },
  skipText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 500,
  },

  bottomSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    minHeight: height * 0.45,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 32,
    marginTop: -30,
    justifyContent: "center",
  },
  dotImage: {
    height: 8,
    resizeMode: "contain",
  },
  activeDotImage: {
    width: 45,
  },
  inactiveDotImage: {
    width: 8,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    fontFamily: "Parkinsans-SemiBold",
    textAlign: "center",
    width: "80%",
    marginBottom: 12,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.6)",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    marginBottom: 40,
    width: "90%",
    lineHeight: 24,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  progressContainer: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  buttonInner: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  nextButton: {
    width: 71.286,
    height: 72,
    borderRadius: 1000,
    backgroundColor: "#1C6206",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nextButtonText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  getStartedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 32,
    paddingRight: 3.5,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: "#1C6206",
    minWidth: 220,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  getStartedText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Poppins-SemiBold",
    color: "#fff",
    flex: 1,
    marginLeft: 10,
  },
  getStartedArrow: {
    width: 48,
    height: 48,
    borderRadius: 100,
    backgroundColor: "#237909",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 26,
  },
  getStartedArrowText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  hintText: {
    fontSize: 12,
    color: "#999",
    marginTop: 8,
  },
});
