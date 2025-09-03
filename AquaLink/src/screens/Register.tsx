import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import RegisterForm from "../components/Register/registerForm";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { LinearGradient } from "expo-linear-gradient";
import { CheckBox } from "react-native-elements";
import { registerUser } from "../services/firebaseService";

import "../../global.css";

export default function Register() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [checked, setChecked] = useState<boolean>(false);

  const formatDate = (d: Date | null) => {
    if (!d) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const confirmPasswords = (): boolean => {
    if (!password || !confirmPassword) {
      Alert.alert("Erro", "Preencha ambos os campos de senha.");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!name || !email) {
      Alert.alert("Erro", "Preencha nome e e-mail.");
      return;
    }
    if (!birthdate) {
      Alert.alert("Erro", "Informe sua data de nascimento.");
      return;
    }
    if (!confirmPasswords()) return;

    try {
      const user = await registerUser(email, password, {
        name,
        email,
        birthdate: birthdate?.toISOString(),
      });
      console.log("Usuário criado com sucesso:", user.uid);
      navigation.navigate("Home");
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      Alert.alert("Erro", "Não foi possível criar a conta. Verifique os dados.");
    }
  };

  return (
    <LinearGradient
      colors={["#1081C7", "#27D5E8", "#FFFFFF"]}
      locations={[0.3, 0.9, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.25 }}
      className="flex-1"
    >
      <View className="flex-1 px-5 justify-between">
        {/* Top: título e subtítulo */}
        <View className="pt-12">
          <Text className="text-white font-bold text-4xl">
            Vamos te cadastrar.
          </Text>
          <Text className="text-white text-xl mt-2">
            Insira suas informações!
          </Text>
        </View>

        {/* Middle: inputs centralizados + botão e checkbox logo abaixo */}
        <View className="flex-1 justify-center">
          <View >
            <RegisterForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              birthdateFormatted={formatDate(birthdate)}
              onBirthdateFocus={() => setShowDatePicker(true)}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
            />

            {showDatePicker && (
              <DateTimePicker
                value={birthdate ?? new Date(2000, 0, 1)}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={(_e, d) => {
                  setShowDatePicker(Platform.OS === "ios");
                  if (d) setBirthdate(d);
                }}
              />
            )}
          </View>

          <CheckBox
            checked={checked}
            onPress={() => setChecked(!checked)}
            containerStyle={{
              backgroundColor: "transparent",
              borderWidth: 0,
              alignItems: "center",
            }}
            title="Manter conectado"
            className="bg-transparent border-0 mt-[20%]"
          />

          <TouchableOpacity
            className="bg-[#27D5E8] h-14 justify-center items-center rounded-2xl w-[70%] self-center shadow-md elevation-5 my-4"
            onPress={handleRegister}
          >
            <Text className="text-white font-bold text-base text-center">
              Criar Conta
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom: termos e políticas fixos no final */}
        <View className="pb-6">
          <Text className="text-center text-[10px] font-thin">
            Ao criar uma conta, você concorda com a{" "}
            <Text className="underline">política de privacidade</Text> e aceita os{" "}
            <Text className="underline">termos e condições</Text> do Aqualink
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
