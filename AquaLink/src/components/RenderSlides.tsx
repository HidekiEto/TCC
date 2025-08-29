import { View, Text, Image, ImageSourcePropType, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface SlideItem {
  topContent?: boolean;
  component: React.ReactNode;
  text?: string;
  image?: ImageSourcePropType;
}

interface RenderSlidesProps {
  item: SlideItem;
}

export default function RenderSlides({ item }: RenderSlidesProps) {
  return (
    <LinearGradient
      colors={["#084F8C", "#27D5E8"]}
      style={StyleSheet.absoluteFillObject}
    >
      {item.topContent ? (
        <View className="items-center justify-start mt-16">
          {item.component}
          {item.text && (
            <Text className="text-white text-center text-4xl font-latoRegular mt-2">
              {item.text}
            </Text>
          )}
        </View>
      ) : (
        <View className="items-center justify-center">
          {item.component}
          {item.text && (
            <Text className="text-white text-4xl text-center font-latoRegular mt-2">
              {item.text}
            </Text>
          )}
          {item.image && <Image source={item.image} />}
        </View>
      )}
    </LinearGradient>
  );
}
