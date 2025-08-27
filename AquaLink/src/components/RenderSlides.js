import { View, Text, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function RenderSlides({ item }) {
  return (
    <LinearGradient
      colors={["#084F8C", "#27D5E8"]}
      className="flex-1 items-center justify-center font-latoRegular"
    >
      {item.topContent ? (
        <View className="flex-1 items-center justify-start mt-16 ">
          {item.component}
          {item.text && (
            <Text className="text-white text-center text-4xl font-latoRegular mt-2">
              {item.text}
            </Text>
          )}
        </View>
      ) : (
        <View className="flex-1 items-center justify-center">
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
