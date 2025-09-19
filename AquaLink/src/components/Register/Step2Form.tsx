import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { CheckBox } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
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
  keepConnected?: boolean;
  setKeepConnected?: (v: boolean) => void;
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
  keepConnected,
  setKeepConnected,
}: Step2FormProps) {
  // Se não vier do pai, cria local
  const [checked, setChecked] = useState(false);
  const isChecked = keepConnected !== undefined ? keepConnected : checked;
  const setIsChecked = setKeepConnected !== undefined ? setKeepConnected : setChecked;

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

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={setGender}
          style={styles.picker}
        >
          <Picker.Item label="Gênero" value="" />
          <Picker.Item label="Masculino" value="Masculino" />
          <Picker.Item label="Feminino" value="Feminino" />
          <Picker.Item label="Outro" value="Outro" />
        </Picker>
      </View>

      <Input
        label="Peso"
        placeholder="Peso (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      <CheckBox
        title="Manter conectado"
        checked={isChecked}
        onPress={() => setIsChecked(!isChecked)}
        checkedColor="#084F8C"
        uncheckedColor="#084F8C"
        containerStyle={{ backgroundColor: 'transparent', borderWidth: 0, padding: 0, margin: 0 }}
        textStyle={{ fontSize: 14, color: '#084F8C' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#084F8C',
    marginBottom: 10,
    overflow: 'hidden',
  },
  pickerLabel: {
    fontSize: 13,
    color: '#084F8C',
    marginLeft: 10,
    marginTop: 8,
    marginBottom: -2,
  },
  picker: {
    height: 50,
    color: '#084F8C',
    marginHorizontal: 10,
  },
});