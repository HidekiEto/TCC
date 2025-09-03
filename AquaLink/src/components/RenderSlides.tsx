import { View, Text, Image, ImageSourcePropType, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface SlideItem {
  key?: string;
  component: React.ReactNode;
  text?: string;
  image?: ImageSourcePropType;
}

interface RenderSlidesProps {
  item: SlideItem;
}

export default function RenderSlides({ item }: RenderSlidesProps) {
  const isKey1 = item.key === "1"; // verifica se a key é 1

  return (
    <LinearGradient
      colors={["#084F8C", "#27D5E8"]}
      style={StyleSheet.absoluteFillObject}
    >
      <View
        className={`flex-1 items-center ${
          isKey1 ? "justify-center" : "justify-start mt-16"
        }`}
      >
        {item.component}

        {item.text && (
          <Text className="text-white text-center text-4xl font-latoRegular mt-2">
            {item.text}
          </Text>
        )}

        {item.image && <Image source={item.image} />}
      </View>
    </LinearGradient>
  );
}
