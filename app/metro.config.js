const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// --- Enable SVG support ----
config.transformer.babelTransformerPath = require.resolve(
  "react-native-svg-transformer"
);

config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);

config.resolver.sourceExts.push("svg");

// --- Export with NativeWind ---
module.exports = withNativeWind(config, {
  input: "./global.css",
});
