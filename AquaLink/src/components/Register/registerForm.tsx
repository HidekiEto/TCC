import React from "react";
import { View, TouchableOpacity } from "react-native";
import Input from "../Input";

interface RegisterFormProps {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  birthdateFormatted: string;
  onBirthdateFocus: () => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
}

export default function RegisterForm({
  name,
  setName,
  email,
  setEmail,
  birthdateFormatted,
  onBirthdateFocus,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}: RegisterFormProps){
  return (
    <View className="p-5 gap-5 top-[20%]">
      <Input
        label="Nome"
        placeholder="Seu nome completo"
        value={name}
        onChangeText={setName}
      />

      <Input
        label="E-mail"
        placeholder="Digite seu E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Envolvi o Input com TouchableOpacity para detectar o toque mesmo com editable={false} */}
      <TouchableOpacity activeOpacity={1} onPress={onBirthdateFocus}>
        <Input
          label="Data de Nascimento"
          placeholder="DD/MM/AAAA"
          value={birthdateFormatted}
          editable={false} // continua não editável (sem teclado)
        />
      </TouchableOpacity>

      <Input
        label="Senha"
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Input
        label="Confirmar senha"
        placeholder="Repita sua senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
    </View>
  );
}