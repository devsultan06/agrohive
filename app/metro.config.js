// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// SVG Support
config.transformer.babelTransformerPath =
  require.resolve("react-native-svg-transformer");

config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg"
);

config.resolver.sourceExts.push("svg");

// NativeWind support
module.exports = withNativeWind(config, {
  input: "./global.css",
});
