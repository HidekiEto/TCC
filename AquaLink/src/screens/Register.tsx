import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Platform, StyleSheet, Dimensions } from "react-native";
import RegisterForm from "../components/Register/registerForm";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { LinearGradient } from "expo-linear-gradient";
import { CheckBox } from "react-native-elements";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";

const { width, height } = Dimensions.get('window');

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
      // Criar usuário com email e senha
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Atualizar o perfil do usuário com o nome
      await updateProfile(userCredential.user, {
        displayName: name,
      });
      
      console.log("Usuário criado com sucesso:", userCredential.user.uid);
      Alert.alert("Sucesso", "Conta criada com sucesso!");
      navigation.navigate("Home");
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      let errorMessage = "Não foi possível criar a conta. Verifique os dados.";
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este email já está em uso.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Email inválido.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "A senha é muito fraca.";
      }
      
      Alert.alert("Erro", errorMessage);
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
          <Text style={styles.title}>
            Vamos te cadastrar.
          </Text>
          <Text style={styles.subtitle}>
            Insira suas informações!
          </Text>
        </View>

        
        <View style={styles.formContainer}>
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
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === "ios");
                if (selectedDate) {
                  setBirthdate(selectedDate);
                }
              }}
            />
          )}

          {/* Checkbox - exatamente como na imagem */}
          <CheckBox
            checked={checked}
            onPress={() => setChecked(!checked)}
            containerStyle={styles.checkboxContainer}
            textStyle={styles.checkboxText}
            title="Manter Conectado"
          />

          {/* Botão - exatamente como na imagem */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleRegister}
          >
            <Text style={styles.createButtonText}>
              Criar Conta
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer - exatamente como na imagem */}
        <View style={styles.termsContainer}>
          <Text style={styles.termsText}>
            Ao criar uma conta, você concorda com a{" "}
            <Text style={styles.linkText}>política de privacidade</Text> e aceita os{" "}
            <Text style={styles.linkText}>termos e condições</Text> do AquaLink.
          </Text>
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
    justifyContent: 'space-between',
  },
  headerContainer: {
    paddingTop: height * 0.08,
    paddingBottom: 20,
    alignItems: 'flex-start',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '300',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 10,
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 25,
    paddingLeft: 0,
    marginLeft: 0,
  },
  checkboxText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '400',
  },
  createButton: {
    backgroundColor: '#27D5E8',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    alignSelf: 'center',
    width: '80%',
    marginTop: 10,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  termsContainer: {
    paddingBottom: 30,
    paddingHorizontal: 10,
  },
  termsText: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '300',
    color: '#666',
    lineHeight: 16,
  },
  linkText: {
    textDecorationLine: 'underline',
    color: '#666',
  },
});
