// RenderComponentSlides.tsx
import React from "react";
import { View, Text, Dimensions } from "react-native";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { Line } from "@shopify/react-native-skia";

interface SlideItem {
  key: string;
  text?: string;
  info1?: string;
  info2?: string;
}

interface RenderComponentSlidesProps {
  item: SlideItem;
}

const { width } = Dimensions.get("window");

export const RenderComponentSlides: React.FC<RenderComponentSlidesProps> = ({ item }) => {
  const gradientColors: LinearGradientProps["colors"] =
    item.key === "2" ? 
          ["#3498db", "white", "#3498db"] :
          ["#1DBF84", "white", "#1DBF84"];


  return (
    <View
      style={{
        width, 
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          backgroundColor: 'white',
          borderColor: item.key === "2" ? "#3498db" : "#1DBF84",
          borderWidth: 1,
          width: width * 0.85, 
          height: 100,
          borderRadius: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      > 
        <Text style={{ color: item.key == "2" ? "#3498db" : "#1dbf84",  fontSize: 20, textAlign: "center" }}>
          {item.text}
        </Text>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          className="h-[1px] w-[80%] mt-2"
        />
        {item.info1 && (
          <Text
            style={{
              color: item.key == "2" ? "#3498db" : "#1dbf84",
              fontSize: 14,
              textAlign: "center",
              marginTop: 8,
            }}
          >
            {item.info1}
          </Text>
        )}

        {item.info2 && (
          <Text
            style={{
              color: item.key == "2" ? "#3498db" : "#1dbf84",
              fontSize: 14,
              
              marginTop: 8,
            }}
          >
            {item.info2}
          </Text>
        )}
      </View> 
    </View>
  );
};
