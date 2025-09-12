import React from "react";
import { Text, View } from "react-native";
import { BottomMenu } from "../components/BottomNavigation";
import { MaterialIcons } from "@expo/vector-icons";

export default function Dashboard() {
  return (
    <View className="flex-1">
      <View>
        <Text style={{fontWeight: 600}}>Este é o seu painel de controle </Text>
        <Text style={{fontWeight: 200}}> Garrafa conectada </Text>
      </View>

      <View style={{flexDirection: "row", width: "100%", alignSelf: "center"}}>
        <MaterialIcons name="dashboard" size={30} color="#AAAAAA" />
        <Text style={{fontWeight: 200, fontSize: 20, marginTop: 40}}> Dashboard<Text style={{fontWeight: 400}}> /Visão Geral </Text> <Text> Últimos 30 dias: </Text> </Text>
        
      </View>

      <BottomMenu />
    </View>
  );
}
