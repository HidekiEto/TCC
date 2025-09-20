import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, GestureResponderEvent, StyleSheet, Dimensions } from "react-native";
import { CheckBox } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from "../types/navigation";

import Input from "../components/Input";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get('window');


export default function Login() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

  const handleLogin = async (e: GestureResponderEvent) => {

    e.preventDefault?.(); 
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // Se o checkbox estiver marcado, salva o token
      if (checked && user?.uid) {
        // Salva o UID e token de acesso
        await AsyncStorage.setItem('userToken', user.uid);
        await AsyncStorage.setItem('keepLoggedIn', 'true');
        console.log('Manter conectado está ATIVADO');
      } else {
        await AsyncStorage.setItem('keepLoggedIn', 'false');
        console.log('Manter conectado está DESATIVADO');
      }
      console.log("User logged in successfully");
      navigation.navigate("Home");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <LinearGradient
      colors={["#084F8C", "#27D5E8", "#FFFFFF"]}
      locations={[0.2, 0.8, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.20 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Acesse</Text>
          <Text style={styles.subtitle}>com E-mail e senha</Text>
        </View>

        <View style={styles.formContainer}>
          <Input
            label="E-mail"
            placeholder="Digite seu E-mail"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.passwordContainer}>
            <Input
              label="Senha"
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Ionicons
                name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#777"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.optionsContainer}>
            <CheckBox
              title="Manter Conectado"
              checked={checked}
              onPress={() => setChecked(!checked)}
              checkedColor="#1081C7"
              uncheckedColor="#1081C7"
              containerStyle={styles.checkboxContainer}
              textStyle={styles.checkboxText}
            />
            <TouchableOpacity onPress={() => console.log("Esqueci minha senha pressionado")}>
              <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleLogin}
              style={styles.loginButton}
            >
              <Text style={styles.loginButtonText}>Acessar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate("Register" as never)}
              style={styles.registerButton}
            >
              <Text style={styles.registerButtonText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Ou continue com</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity onPress={() => console.log("Login com Google")}>
              <Image source={require("../assets/Google.png")} style={styles.socialIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log("Login com Facebook")}>
              <Image source={require("../assets/Facebook.png")} style={styles.socialIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 40,
    alignItems: 'flex-start',
    paddingTop: height * 0.05,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: '300',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  passwordContainer: {
    position: 'relative',
    marginTop: 20,
    
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: '40%',
    transform: [{ translateY: -11 }],
  },
  optionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 20,
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  checkboxText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'normal',
  },
  forgotPasswordText: {
    fontSize: 12,
    color: '#555',
    marginRight: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#27D5E8',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    minWidth: width * 0.35,
    alignItems: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  registerButton: {
    borderWidth: 1,
    borderColor: '#27D5E8',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 8,
    minWidth: width * 0.35,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#27D5E8',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  dividerText: {
    marginHorizontal: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 30,
  },
  socialIcon: {
    width: 48,
    height: 48,
  },
});
