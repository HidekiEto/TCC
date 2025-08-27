import React from "react";
import { Text, View } from "react-native";
import { useFonts } from "expo-font";

const Title = () => {
  const [fontsLoaded] = useFonts({
    poppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    poppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View className="flex-row ">
      <Text className="text-white text-[50px] font-[poppinsBold] leading-[60px]">Aqua</Text>
      <Text className="text-white text-[50px] font-[poppinsRegular] leading-[60px]">Link</Text>
    </View>
  );
};

export default Title;
