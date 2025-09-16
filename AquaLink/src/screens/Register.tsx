import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, Platform, StyleSheet, Dimensions, Image } from "react-native";
import Step1Form from "../components/Register/Step1Form";
import Step2Form from "../components/Register/Step2Form";
import StepIndicator from "../components/Register/StepIndicator";
import RegisterLoadingScreen from "../components/Register/RegisterLoadingScreen";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { LinearGradient } from "expo-linear-gradient";
import { CheckBox } from "react-native-elements";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function Register() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
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

  const validateStep1 = (): boolean => {
    if (!name.trim()) {
      Alert.alert("Erro", "Preencha o nome completo.");
      return false;
    }
    if (!email.trim()) {
      Alert.alert("Erro", "Preencha o e-mail.");
      return false;
    }
    if (!password) {
      Alert.alert("Erro", "Preencha a senha.");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return false;
    }
    if (!confirmPassword) {
      Alert.alert("Erro", "Confirme sua senha.");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!height.trim()) {
      Alert.alert("Erro", "Preencha a altura.");
      return false;
    }
    if (!birthdate) {
      Alert.alert("Erro", "Informe sua data de nascimento.");
      return false;
    }
    if (!gender.trim()) {
      Alert.alert("Erro", "Informe o gênero.");
      return false;
    }
    if (!weight.trim()) {
      Alert.alert("Erro", "Preencha o peso.");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    }
  };

  const handleRegister = async () => {
    if (!validateStep2()) return;

    setIsLoading(true);

    try {
      // Criar usuário com email e senha
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Atualizar o perfil do usuário com o nome
      await updateProfile(userCredential.user, {
        displayName: name,
      });
      
      console.log("Usuário criado com sucesso:", userCredential.user.uid);
      
      // Simular tempo de criação da conta
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert("Sucesso", "Conta criada com sucesso!");
        navigation.navigate("Home");
      }, 2000);
      
    } catch (error: any) {
      setIsLoading(false);
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

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Sua experiência está prestes a começar!";
      case 2:
        return "Conte-nos um pouco mais sobre você.";
      default:
        return "";
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1:
        return "";
      case 2:
        return "";
      default:
        return "";
    }
  };

  if (isLoading) {
    return <RegisterLoadingScreen />;
  }

  return (
    <LinearGradient
      colors={["#27D5E8", "#FFFFFF"]}
      locations={[0.4, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} totalSteps={2} />
        
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>
            {getStepTitle()}
          </Text>
          {getStepSubtitle() && (
            <Text style={styles.subtitle}>
              {getStepSubtitle()}
            </Text>
          )}
        </View>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {currentStep === 1 && (
            <Step1Form
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
            />
          )}

          {currentStep === 2 && (
            <Step2Form
              height={height}
              setHeight={setHeight}
              birthdateFormatted={formatDate(birthdate)}
              onBirthdateFocus={() => setShowDatePicker(true)}
              gender={gender}
              setGender={setGender}
              weight={weight}
              setWeight={setWeight}
            />
          )}

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

          {/* Checkbox - only on step 2 */}
          {currentStep === 2 && (
            <CheckBox
              checked={checked}
              onPress={() => setChecked(!checked)}
              containerStyle={styles.checkboxContainer}
              textStyle={styles.checkboxText}
              title="Manter Conectado"
            />
          )}

          {/* Navigation Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={currentStep === 1 ? handleNext : handleRegister}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === 1 ? "Próximo" : "Criar Conta"}
              </Text>
              {currentStep === 1 && (
                <Ionicons name="arrow-forward" size={20} color="white" style={styles.arrowIcon} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer - only on step 2 */}
        {currentStep === 2 && (
          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              Ao criar uma conta, você concorda com a{" "}
              <Text style={styles.linkText}>política de privacidade</Text> e aceita os{" "}
              <Text style={styles.linkText}>termos e condições</Text> do AquaLink.
            </Text>
          </View>
        )}
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
  logoContainer: {
    alignItems: 'center',
    paddingTop: height * 0.06,
    paddingBottom: 10,
  },
  logo: {
    width: 120,
    height: 60,
  },
  headerContainer: {
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 28,
    marginBottom: 8,
    textAlign: 'center',
    width: '100%',
  },
  subtitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '300',
    textAlign: 'center',
    width: '100%',
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
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  nextButton: {
    backgroundColor: '#084F8C',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    width: '80%',
    flexDirection: 'row',
    gap: 10,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  arrowIcon: {
    marginLeft: 5,
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
