import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, Platform, StyleSheet, Dimensions, Image, KeyboardAvoidingView, Keyboard, Animated } from "react-native";
import Step1Form from "../components/Register/Step1Form";
import Step2Form from "../components/Register/Step2Form";
import StepIndicator from "../components/Register/StepIndicator";
import RegisterLoadingScreen from "../components/Register/RegisterLoadingScreen";
import LoadingCircle from "../components/Register/LoadingCircle";
import Title from "../components/Title";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { LinearGradient } from "expo-linear-gradient";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');



export default function Register() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
 
  const [headerHeight] = useState(new Animated.Value(1));
  const [logoPosition] = useState(new Animated.Value(1));
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [userHeight, setUserHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [checked, setChecked] = useState<boolean>(false);


  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
       
        Animated.parallel([
          Animated.timing(headerHeight, {
            toValue: 0.3, 
            duration: 250,
            useNativeDriver: false,
          }),
          Animated.timing(logoPosition, {
            toValue: 0.6, 
            duration: 250,
            useNativeDriver: false,
          }),
        ]).start();
      }
    );

    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
       
        Animated.parallel([
          Animated.timing(headerHeight, {
            toValue: 1,
            duration: 250,
            useNativeDriver: false,
          }),
          Animated.timing(logoPosition, {
            toValue: 1,
            duration: 250,
            useNativeDriver: false,
          }),
        ]).start();
      }
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

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
    if (!userHeight.trim()) {
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
    setLoadingProgress(0);
    // Simula progresso de loading
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setLoadingProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 150);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // Salva dados extras no Firestore
      try {
        const { doc, setDoc } = await import('firebase/firestore');
        const { firestore } = await import('../config/firebase');
        await setDoc(doc(firestore, "users", userCredential.user.uid), {
          name,
          email,
          height,
          weight,
          gender,
          birthdate: birthdate ? birthdate.toISOString() : ""
        });
      } catch (e) {
        console.error("Erro ao salvar dados extras:", e);
      }

      // Se o checkbox estiver marcado, salva o UID/token
      if (checked && userCredential.user?.uid) {
        await AsyncStorage.setItem('userToken', userCredential.user.uid);
        await AsyncStorage.setItem('keepLoggedIn', 'true');
      }
      if (!checked) {
        await AsyncStorage.setItem('keepLoggedIn', 'false');
      }

      console.log("Usuário criado com sucesso:", userCredential.user.uid);

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
  return <LoadingCircle progress={loadingProgress} text={loadingProgress < 100 ? "Conectando..." : "Finalizando..."} />;
  }

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.topHalfWrapper,
          {
            flex: headerHeight.interpolate({
              inputRange: [0.3, 1],
              outputRange: [0.5, 1],
            }),
          }
        ]}
      >
        <LinearGradient
          colors={["#084F8C", "#27D5E8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.topHalf}
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: headerHeight,
                transform: [{
                  scale: headerHeight.interpolate({
                    inputRange: [0.3, 1],
                    outputRange: [0.8, 1],
                  }),
                }]
              }
            ]}
          >
            <View style={styles.titleContainer}>
              <Title />
            </View>
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
          </Animated.View>
        </LinearGradient>
      </Animated.View>
      
 
      <Animated.View 
        style={[
          styles.logoFixedWrapper,
          {
            opacity: logoPosition.interpolate({
              inputRange: [0.6, 1],
              outputRange: [0, 1], 
            }),
            transform: [{
              scale: logoPosition.interpolate({
                inputRange: [0.6, 1],
                outputRange: [0.5, 1], 
              }),
            }]
          }
        ]}
      >
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      

      <Animated.View 
        style={[
          styles.stepIndicatorWrapper,
          {
            opacity: logoPosition.interpolate({
              inputRange: [0.6, 1],
              outputRange: [0, 1], 
            }),
          }
        ]}
      >
        <StepIndicator currentStep={currentStep} totalSteps={2} />
      </Animated.View>
      
      <View style={styles.bottomHalf}>
        <View style={styles.content}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={isKeyboardVisible ? height * 0.05 : height * 0.18}
          >
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
                  height={userHeight}
                  setHeight={setUserHeight}
                  birthdateFormatted={formatDate(birthdate)}
                  onBirthdateFocus={() => setShowDatePicker(true)}
                  gender={gender}
                  setGender={setGender}
                  weight={weight}
                  setWeight={setWeight}
                  keepConnected={checked}
                  setKeepConnected={setChecked}
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
            {currentStep === 2 && (
              <View style={styles.termsContainer}>
                <Text style={styles.termsText}>
                  Ao criar uma conta, você concorda com a{" "}
                  <Text style={styles.linkText}>política de privacidade</Text> e aceita os{" "}
                  <Text style={styles.linkText}>termos e condições</Text> do AquaLink.
                </Text>
              </View>
            )}
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  topHalfWrapper: {
    overflow: 'visible', 
    position: 'relative',
  },
  topHalf: {
    flex: 1,
    borderRadius: 5,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  bottomHalf: {
    flex: 3,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'flex-start',
  },
  titleContainer: {
    alignItems: 'center',
    paddingTop: height * 0.06,
    paddingBottom: 10,
  },
  logoFixedWrapper: {
    position: 'absolute',
    top: (height / 4) - 40, // height/4 é onde termina o topHalf (flex:1 de 4 partes), -40 para centralizar (metade do logo 80/2)
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  stepIndicatorWrapper: {
    position: 'absolute',
    top: (height / 4) + 50, 
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#27D5E8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  headerContainer: {
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontWeight: '100',
    fontSize: 18,
    marginTop: -20,
    textAlign: 'center',
    width: '100%',
  },
  subtitle: {
    color: 'white',
    fontSize: 13,
    fontWeight: '300',
    textAlign: 'center',
    width: '100%',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 0,
    paddingTop: 90, 
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
