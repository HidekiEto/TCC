import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/navigation/NavigationContainer";
import { useAppFonts } from "./src/hooks/useAppFonts";
import { Text, View, StyleSheet, Animated } from "react-native";
import SplashScreen from "./src/screens/SplashScreen";
import Slides from "./src/components/InitialSlider";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BLEProvider } from "./src/contexts/BLEProvider";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./src/types/navigation";

export default function App() {
  const fontsLoaded = useAppFonts();
  useEffect(() => {
    console.log("[App] fontsLoaded:", fontsLoaded);
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    console.log("[App] Carregando fontes...");
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando AquaLink...</Text>
      </View>
    );
  }
  console.log("[App] Fontes carregadas, renderizando Navigation...");
  return (
    <BLEProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </BLEProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  fullScreen: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
