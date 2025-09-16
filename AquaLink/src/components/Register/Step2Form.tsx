import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Input from "../Input";

interface Step2FormProps {
  height: string;
  setHeight: (v: string) => void;
  birthdateFormatted: string;
  onBirthdateFocus: () => void;
  gender: string;
  setGender: (v: string) => void;
  weight: string;
  setWeight: (v: string) => void;
}

export default function Step2Form({
  height,
  setHeight,
  birthdateFormatted,
  onBirthdateFocus,
  gender,
  setGender,
  weight,
  setWeight,
}: Step2FormProps) {
  return (
    <View style={styles.container}>
      <Input
        label="Altura"
        placeholder="Altura (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
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
        label="Gênero"
        placeholder="Gênero"
        value={gender}
        onChangeText={setGender}
      />

      <Input
        label="Peso"
        placeholder="Peso (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
});