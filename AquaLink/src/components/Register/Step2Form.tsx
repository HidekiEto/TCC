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
      {/* Linha com Altura e Peso lado a lado */}
      <View style={styles.rowContainer}>
        <View style={styles.halfWidth}>
          <Input
            label="Altura"
            placeholder="Altura (cm)"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.halfWidth}>
          <Input
            label="Peso"
            placeholder="Peso (kg)"
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
        </View>
      </View>

      <TouchableOpacity onPress={onBirthdateFocus} activeOpacity={0.7}>
        <Input
          label="Data de Nascimento"
          placeholder="DD/MM/AAAA"
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
          <Picker.Item label="Selecione o Gênero" value="" />
          <Picker.Item label="Masculino" value="Masculino" />
          <Picker.Item label="Feminino" value="Feminino" />
          <Picker.Item label="Outro" value="Outro" />
        </Picker>
      </View>

      <CheckBox
        title="Manter conectado"
        checked={isChecked}
        onPress={() => setIsChecked(!isChecked)}
        checkedColor="#666666"
        uncheckedColor="#999999"
        containerStyle={{ 
          backgroundColor: 'transparent', 
          borderWidth: 0, 
          padding: 0, 
          margin: 0,
          alignSelf: 'center',
          marginTop: 5,
        }}
        textStyle={{ fontSize: 14, color: '#666666', fontWeight: '400' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#084F8C',
    overflow: 'hidden',
    height: 50,
    justifyContent: 'center',
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
  },
});