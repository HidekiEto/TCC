import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { CheckBox } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';

import Input from '../components/Input'; 
import '../../global.css'

export default function Login() {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully");
      navigation.navigate('Home');
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <LinearGradient
        colors={['#1081C7', '#27D5E8', '#FFFFFF']}
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
        onChangeText={(text) => setEmail(text)}
      />

      <View className="relative justify-center mt-4">
        <Input
          label="Senha"
          placeholder="Digite sua senha"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={!passwordVisible}
        />
        <TouchableOpacity
          className="absolute right-3 top-9"
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
        <Text className="text-xs text-[#555] mr-2">Esqueci minha senha</Text>
      </View>

      <View className="flex-row justify-around mt-5">
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          className="bg-[#27D5E8] py-3 px-10 rounded-md"
        >
          <Text className="text-[#084F8C] text-base font-bold text-center">Acessar</Text>
        </TouchableOpacity>

        <TouchableOpacity className="border border-[#27D5E8] py-3 px-9 rounded-md">
          <Text className="text-[#084F8C] text-base font-bold text-center">Cadastrar</Text>
        </TouchableOpacity>
      </View>


      <View className="flex-row items-center my-6">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-2 text-sm text-gray-500">Ou continue com</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>

      <View className="flex-row justify-around mx-12">
        <Image source={require('../assets/Google.png')} className="w-12 h-12" />
        <Image source={require('../assets/Facebook.png')} className="w-12 h-12" />
      </View>
    </LinearGradient>
  );
}
