import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CalendarCompontent from "../components/CalendarScreenComponents/CalendarComponent";
import { BottomMenu } from "../components/BottomNavigation";
import { ComponentSlides } from "../components/CalendarScreenComponents/SliderComponent";

import { useFonts } from "expo-font";

export default function CalendarScreen() {
  const [fontsLoaded] = useFonts({
      poppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
      poppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    });

    if (!fontsLoaded) {
      return null;
    }

  return (
    <View className="flex-1 bg-white">
      <Text className="text-3xl mx-6 font-latoBold color-[#27D5E8] mt-10 mb-3 font-[poppinsRegular]">
        Calendário
      </Text>
      <View className="flex-1 bg-white mb-3 ">
        <CalendarCompontent />
      </View>
          <LinearGradient
            colors={["black", "white", "black"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            className="h-[1px] mx-5 mb-3 top-[5%]"
          />
         
        <ComponentSlides />  
      <BottomMenu />
    </View>
  );
}
