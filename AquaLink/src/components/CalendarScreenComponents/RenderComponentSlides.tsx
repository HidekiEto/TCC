import React from "react";
import { View, Text } from "react-native";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";

interface SlideItem {
  key: string;
  text?: string;
  subtitle?: string;
}

interface RenderComponentSlidesProps {
  item: SlideItem;
}

export const RenderComponentSlides: React.FC<RenderComponentSlidesProps> = ({ item }) => {
 
  const gradientColors: LinearGradientProps["colors"] =
    item.key === "2"
      ? ["#084F8C", "#27D5E8"]
      : ["#27E8A4", "#1DBF84"];

  return (
    <View className="flex-1 items-center justify-center ">
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: 200, height: 100, alignItems: "center", justifyContent: "center", borderRadius: 16 }}
      >
        <Text className="text-white text-center text-xl font-latoRegular leading-snug px-5">
          {item.text}
        </Text>
        <Text className="text-white text-center text-sm font-latoRegular leading-snug px-5 mt-2">
          {item.subtitle}
        </Text>
      </LinearGradient>
    </View>
  );
};
