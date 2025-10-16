import React, { useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet, Dimensions, StatusBar } from "react-native";
import Title from "../components/Title";
import { LinearGradient } from "expo-linear-gradient";
import { GoogleSignin } from '@react-native-google-signin/google-signin';


import { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

export default function SplashScreen({ navigation }: SplashScreenProps) {
  useEffect(() => {
    console.log('[SplashScreen] 🚀 Montou');
    const { auth } = require('../config/firebase');
    const { signOut } = require('firebase/auth');
    let navigated = false;
    
    const checkAuthAndNavigate = async () => {
     
      const keepLoggedIn = await AsyncStorage.getItem('keepLoggedIn');
      const slidesVistos = await AsyncStorage.getItem('slidesVistos');
      
      console.log(' keepLoggedIn:', keepLoggedIn);
      console.log(' slidesVistos:', slidesVistos);
     
      if (keepLoggedIn !== 'true' && auth.currentUser) {
        console.log(' Manter conectado DESATIVADO, fazendo logout...');
        try {
          // Limpa sessão do Google para garantir que o seletor de contas apareça no próximo login
          try { await GoogleSignin.signOut(); } catch {}
          try { await GoogleSignin.revokeAccess(); } catch {}
          await signOut(auth);
          console.log(' Logout automático realizado');
        } catch (e) {
          console.error(' Erro ao fazer logout:', e);
        }
      }
      
      const unsubscribe = auth.onAuthStateChanged(async (user: any) => {
        console.log('[SplashScreen] 🔍 onAuthStateChanged, user:', user?.uid);
        if (!navigated) {
          navigated = true;
          
          if (user && keepLoggedIn === 'true') {
           
            console.log('Usuário autenticado + manter conectado → Home');
            navigation.navigate('Home');
          } else {
            
            if (slidesVistos === 'true') {
           
              console.log(' Sem auth ou sem manter conectado → Login');
              navigation.navigate('Login');
            } else {
              
              console.log(' Primeira vez → InitialSlides');
              navigation.navigate('InitialSlidesScreen');
            }
          }
        }
      });
      
      return unsubscribe;
    };
    
    const unsubscribePromise = checkAuthAndNavigate();
    
   
    const timeout = setTimeout(async () => {
      if (!navigated) {
        navigated = true;
        const slidesVistos = await AsyncStorage.getItem('slidesVistos');
        if (slidesVistos === 'true') {
          console.log(' Timeout → Login');
          navigation.navigate('Login');
        } else {
          console.log('Timeout → InitialSlides');
          navigation.navigate('InitialSlidesScreen');
        }
      }
    }, 3000);
    
    return () => {
      unsubscribePromise.then(unsub => unsub());
      clearTimeout(timeout);
    };
  }, [navigation]);

  return (
    <LinearGradient
      colors={["#084F8C", "#27D5E8"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <StatusBar 
        backgroundColor="#084F8C" 
        barStyle="light-content" 
        translucent={false}
      />
      <Title />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
