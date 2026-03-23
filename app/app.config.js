require("dotenv/config");

module.exports = {
  expo: {
    name: "agrohive",
    slug: "agrohive",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/logo.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/logo.png",
      resizeMode: "contain",
      backgroundColor: "#1C6206",
    },
    ios: {
      bundleIdentifier: "com.devsultan.agrohive", // This is your unique iOS ID
      supportsTablet: true,
      infoPlist: {
        UIAppFonts: [
          "assets/fonts/Parkinsans-Regular.ttf",
          "assets/fonts/Parkinsans-Bold.ttf",
        ],
      },
    },

    android: {
      package: "com.devsultan.agrohive", // This is your unique Android ID
      adaptiveIcon: {
        foregroundImage: "./assets/logo.png",
        backgroundColor: "#1C6206",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    web: {
      bundler: "metro",
      favicon: "./assets/logo.png",
    },
    plugins: [
      "expo-font",
      "expo-secure-store",
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme:
            process.env.GOOGLE_IOS_URL_SCHEME ||
            "com.googleusercontent.apps.your-ios-client-id",
        },
      ],
    ],
    extra: {
      apiBaseUrl: process.env.API_URL || "http://localhost:4000",
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "[GCP_API_KEY]",
      googleWebClientId: process.env.GOOGLE_WEB_CLIENT_ID,
      googleAndroidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
      googleIosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
      eas: {
        projectId: "279b6cef-437e-458f-a437-864090abb2a0",
      },
    },
    owner: "devsultan06",
  },
};
