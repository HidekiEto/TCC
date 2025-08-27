import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Inputs from '../components/Register/registerForm';
import { LinearGradient } from 'expo-linear-gradient';
import CheckBox from '../components/CheckBox';

import '../../global.css'

export default function Register() {
  const [checked, setChecked] = useState(false);

  return (
    <LinearGradient
  colors={['#1081C7', '#27D5E8', '#FFFFFF']}
  locations={[0.3, 0.9, 1]} 
  start={{ x: 0, y: 0 }}
  end={{ x: 0, y: 0.25 }}
  className="flex-1"
>
      <View className="flex-1 px-5">
        <Text className="mt-20 text-white font-bold text-4xl">
          Vamos te cadastrar.
        </Text>
        <Text className="text-white text-xl mt-2">
          Insira suas informações!
        </Text>

        <Inputs/>

      <View className="flex-2 top-[10%]"> 
        <CheckBox
          checked={checked}
          onChange={setChecked}
          label="Manter conectado"
        />
        <TouchableOpacity
          className="bg-[#27D5E8] h-14 justify-center items-center rounded-2xl w-[70%] self-center shadow-md elevation-5 my-2.5"
          onPress={() => './Home'}
        >
          <Text className="text-white font-bold text-base text-center">
            Criar Conta
          </Text>
        </TouchableOpacity>

        <Text className="text-center text-[10px] font-thin mt-2.5">
          Ao criar uma conta, você concorda com a{' '}
          <Text className="underline">política de privacidade</Text> e aceita os{' '}
          <Text className="underline">termos e condições</Text> do Aqualink
        </Text>
        </View>
      </View>
    </LinearGradient>
  );
}
