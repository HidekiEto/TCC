import React from "react";
import { Text, View } from "react-native";
import BottomNavigation  from "../components/BottomNavigation";

export default function Info() {
  return (
    <View className="flex-1">
      <Text>Perfil</Text>
      <BottomNavigation />
    </View>
  );
}
