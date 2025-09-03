export default function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // adicione este plugin como último
      "react-native-reanimated/plugin"
    ],
  };
};