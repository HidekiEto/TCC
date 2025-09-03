import React from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation, NavigationProp } from "@react-navigation/native";

import "../../global.css";
import type { RootStackParamList } from "../types/navigation";

export default function Welcome() {
  const navigation = useNavigation<NavigationProp<RootStackParamList, "Welcome">>();

  return (
    <View className="flex-1 bg-[#1081C7]">
      <StatusBar backgroundColor="#1081C7" barStyle="light-content" />

      <Animatable.View delay={600} animation="fadeInUp" className="flex-1 px-5">
        <Text className="mt-20 text-4xl font-bold text-white font-poppins">
          Bem Vindo!
        </Text>
        <Text className="text-2xl text-white font-poppins font-thin mt-2">
          Sua experiência com{"\n"}Aqualink acaba de começar.
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Register")}
          className="absolute self-center bg-[#27D5E8] w-3/5 rounded-md items-center py-2 mt-10 bottom-12 shadow-md elevation-5 h-12 justify-center"
        >
          <Text className="text-white font-poppins">Nova Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          className="absolute bottom-0 self-center border-b border-white"
        >
          <Text className="text-white font-poppins">Já possuo uma Conta</Text>
        </TouchableOpacity>
      </Animatable.View>

      <View className="flex-3 bg-[#1081C7] top-5">
        <Animatable.Image
          animation="flipInY"
          source={require("../assets/fitFemale.png")}
          resizeMode="contain"
          className="w-full mt-10"
        />
      </View>
    </View>
  );
}
