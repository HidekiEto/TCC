import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, GestureResponderEvent } from "react-native";
import { CheckBox } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { signInUser } from "../services/firebaseService";
import { RootStackParamList } from "../types/navigation";

import Input from "../components/Input";
import "../../global.css";


export default function Login() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

  const handleLogin = async (e: GestureResponderEvent) => {
    e.preventDefault?.(); 
    try {
      await signInUser(email, password);
      console.log("User logged in successfully");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#1081C7", "#27D5E8", "#FFFFFF"]}
      locations={[0.2, 0.5, 0.8]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.25 }}
      className="flex-1 justify-center p-5"
    >
      <View className="mb-8">
        <Text className="text-2xl font-bold text-[#222]">Acesse</Text>
        <Text className="text-sm text-[#666] mt-1">com E-mail e senha</Text>
      </View>

      <Input
        label="E-mail"
        placeholder="Digite seu E-mail"
        value={email}
        onChangeText={setEmail}
      />

      <View className="relative justify-center mt-4">
  <Input
    label="Senha"
    placeholder="Digite sua senha"
    value={password}
    onChangeText={setPassword}
    secureTextEntry={!passwordVisible}
  />
  <TouchableOpacity
    className="absolute right-5"
    style={{ top: '50%', transform: [{ translateY: -10 }] }} // 11 é metade do tamanho do ícone (22)
    onPress={() => setPasswordVisible(!passwordVisible)}
  >
    <Ionicons
      name={passwordVisible ? "eye-off-outline" : "eye-outline"}
      size={22}
      color="#777"
    />
  </TouchableOpacity>
</View>


      <View className="flex-row items-center justify-between mt-6 mb-5">
        <CheckBox
          title="Lembrar senha"
          checked={checked}
          onPress={() => setChecked(!checked)}
          checkedColor="#1081C7"
          uncheckedColor="#1081C7"
          containerStyle={{ backgroundColor: "transparent", borderWidth: 0, padding: 0, margin: 0 }}
          textStyle={{ fontSize: 14, color: "#333", fontWeight: "normal" }}
        />
        <TouchableOpacity onPress={() => console.log("Esqueci minha senha pressionado")}>
        <Text className="text-xs text-[#555] mr-2">Esqueci minha senha</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-around mt-5">
        <TouchableOpacity
          onPress={handleLogin}
          className="bg-[#27D5E8] py-3 px-10 rounded-md"
        >
          <Text className="text-white text-base font-bold text-center">Acessar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
        onPress={() => navigation.navigate("Register" as never)}
        className="border border-[#27D5E8] py-3 px-9 rounded-md">
          <Text className="text-[#27D5E8] text-base font-bold text-center">Cadastrar</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center my-6">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-2 text-sm text-gray-500">Ou continue com</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      <View className="flex-row justify-evenly">
        <TouchableOpacity onPress={() => console.log("Login com Google")}>
        <Image source={require("../assets/Google.png")} className="w-12 h-12" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log("Login com Facebook")}>
        <Image source={require("../assets/Facebook.png")} className="w-12 h-12" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
