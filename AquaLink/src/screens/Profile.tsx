import React, { Suspense } from "react";
import { Text, View, TouchableOpacity, ScrollView, Dimensions, StatusBar, ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNavigation from "../components/BottomNavigation";
import AvatarComponent from "../components/ProfileComponents/Avatar";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
// Espaçamento horizontal dinâmico: 5% da largura da tela
const dynamicGap = width * 0.05;

// carregamento dinâmico robusto para módulos com export default ou export nomeado
const Graphic = React.lazy(() =>
  import("../components/ProfileComponents/Graphic").then((mod) => {
    const comp =
      (mod as any).default ??
      (mod as any).Graphic ??
      (mod as any).graphic ??
      (mod as any);
    return { default: comp as React.ComponentType<any> };
  })
);

export default function Profile() {
  return (
    
    <LinearGradient
      colors={["#1081C7", "#27D5E8", "#FFFFFF"]}
      locations={[0.2, 0.8, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.25 }}
      className="flex-1"
    >
    <StatusBar backgroundColor="#1081C7" />
      <SafeAreaView className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
         
          <View
            className="flex-row items-center px-6 mt-4"
            style={{ columnGap: dynamicGap }}
          >
            <AvatarComponent />

            <View className="flex-1">
              <Text
                className="text-2xl font-latoBold text-white"
                numberOfLines={1}
              >
                Heny & Bibi
              </Text>
              <Text
                className="text-white text-base font-bold"
                numberOfLines={1}
              >
                eusouogoat@gmail.com
              </Text>

              <TouchableOpacity className="bg-white py-3 px-5 rounded-full w-44 mt-5 flex-row items-center justify-center self-start shadow-md">
                <MaterialCommunityIcons
                  name="account-edit"
                  size={20}
                  color="#084F8C"
                  style={{ marginRight: 6 }}
                />
                <Text className="text-[#084F8C] text-base font-bold">
                  Editar Perfil
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-10 px-6 top-[5%]">
            <Text className="text-2xl font-latoBold text-black mb-2">
              Visão Geral do Consumo
            </Text>
            <Text className="text-sm text-[#151515] mb-5 font-[poppinsRegular]">
              Média p/dia:{" "}
              <Text className="font-bold text-[#084F8C]">2240 mls</Text>
            </Text>
          </View>

          <View className="flex-1 items-center justify-center px-4 top-[10%]">
            <Suspense
              fallback={
                <View style={styles.fallback}>
                  <ActivityIndicator size="large" />
                </View>
              }
            >
              <Graphic />
            </Suspense>
          </View>
        </ScrollView>

        
        <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <BottomNavigation />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fallback: {
    height: 240,
    alignItems: "center",
    justifyContent: "center",
  },
});
