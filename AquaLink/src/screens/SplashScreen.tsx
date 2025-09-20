import React, { useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet } from "react-native";
import Title from "../components/Title";
import { LinearGradient } from "expo-linear-gradient";


import { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';

interface SplashScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

export default function SplashScreen({ navigation }: SplashScreenProps) {
  useEffect(() => {
    console.log('[SplashScreen] Montou');
    const { auth } = require('../config/firebase');
    let navigated = false;
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      console.log('[SplashScreen] onAuthStateChanged', user);
      if (!navigated) {
        navigated = true;
        if (user) {
          console.log('[SplashScreen] Usuário autenticado, navegando para Home');
          navigation.navigate('Home');
        } else {
          console.log('[SplashScreen] Usuário não autenticado, navegando para InitialSlidesScreen');
          navigation.navigate('InitialSlidesScreen');
        }
      }
    });
    // Fallback timeout para garantir navegação
    const timeout = setTimeout(() => {
      if (!navigated) {
        navigated = true;
        console.log('[SplashScreen] Timeout atingido, navegando para InitialSlidesScreen');
        navigation.navigate('InitialSlidesScreen');
      }
    }, 3000);
    return () => {
      unsubscribe();
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
