import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import CalendarCompontent from "../components/CalendarScreenComponents/CalendarComponent";
import  BottomNavigation  from "../components/BottomNavigation";
import SliderComponent from "../components/CalendarScreenComponents/SliderComponent";
import { EvilIcons } from '@expo/vector-icons';

import { useAppFonts } from "../hooks/useAppFonts";

export default function CalendarScreen() {
  const fontsLoaded = useAppFonts();
  if (!fontsLoaded) return null;

  return (
    <View className="flex-1 bg-white">

<View className="flex-row items-center justify-start  ">
      <EvilIcons name="calendar" size={50} color="#27D5E8"/>
      <Text className="text-3xl font-latoBold color-[#27D5E8] mt-5 mb-3 font-[poppinsRegular]">
        Calendário
      </Text>
</View>
      <View className="flex-1 bg-white mb-3 ">
        <CalendarCompontent />
      </View>
          <LinearGradient
            colors={["black", "white", "black"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            className="h-[1px] mx-5 mb-3 top-[5%]"
          />
         
        <SliderComponent />  
      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <BottomNavigation />
        </View>
    </View>
  );
}
