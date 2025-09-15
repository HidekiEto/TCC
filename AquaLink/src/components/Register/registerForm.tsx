import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      <Input
        label="Nome Completo"
        placeholder="Nome Completo"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity onPress={onBirthdateFocus}>
        <Input
          label="Data de Nascimento"
          placeholder="Data de Nascimento"
          value={birthdateFormatted}
          editable={false}
        />
      </TouchableOpacity>

      <Input
        label="Email"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        label="Senha"
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Input
        label="Confirme sua Senha"
        placeholder="Confirme sua Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
});