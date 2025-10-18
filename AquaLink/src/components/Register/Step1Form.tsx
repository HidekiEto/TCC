import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Input from "../Input";
import { FontAwesome5 } from '@expo/vector-icons';

interface Step1FormProps {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
}

export default function Step1Form({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}: Step1FormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Input
        label="Nome Completo"
        placeholder="Nome Completo"
        value={name}
        onChangeText={setName}
      />

      <Input
        label="Email"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.inputWrapper}>
        <Input
          label="Senha"
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.iconOverlay}
          onPress={() => setShowPassword((prev) => !prev)}
          activeOpacity={0.7}
        >
          <FontAwesome5
            name={showPassword ? "eye-slash" : "eye"}
            size={18}
            color="#084F8C"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputWrapper}>
        <Input
          label="Confirme sua Senha"
          placeholder="Confirme sua Senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity
          style={styles.iconOverlay}
          onPress={() => setShowConfirmPassword((prev) => !prev)}
          activeOpacity={0.7}
        >
          <FontAwesome5
            name={showConfirmPassword ? "eye-slash" : "eye"}
            size={18}
            color="#084F8C"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  inputWrapper: {
    position: 'relative',
  },
  iconOverlay: {
    position: 'absolute',
    right: 15,
    bottom: 30,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});