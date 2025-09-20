import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/navigation/NavigationContainer";
import { useAppFonts } from "./src/hooks/useAppFonts";
import { Text, View, StyleSheet, Animated } from "react-native";
import SplashScreen from "./src/screens/SplashScreen";
import Slides from "./src/components/InitialSlider";
import BLEProvider from "./src/contexts/BLEProvider";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./src/types/navigation";
import { DataProvider } from "./src/contexts/DataContext";
import { DbProvider } from "./src/contexts/DbContext";


export default function App() {
  const fontsLoaded = useAppFonts();
  useEffect(() => {

    if (fontsLoaded) {
      const timer = setTimeout(() => {
        setAppReady(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);


  if (!fontsLoaded || !appReady) {

    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando AquaLink...</Text>
      </View>
    );
  }



  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  const handleNavigateToWelcome = () => {
    console.log("Welcome slide reached");
  };

  const handleNavigateToRegister = () => {
    console.log(" Iniciando navegação para Register...");
    setInitialRoute("Register");
    setShowNav(true);

    Animated.timing(navigationOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      console.log(" Navegação para Register completada!");
    });
  };

  const handleNavigateToLogin = () => {
    console.log(" Iniciando navegação para Login...");
    setInitialRoute("Login");
    setShowNav(true);

    Animated.timing(navigationOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      console.log(" Navegação para Login completada!");
    });
  };


  return showNav ? (
    <Animated.View style={{ flex: 1, opacity: navigationOpacity }}>
      <DataProvider>
        <DbProvider>
          <BLEProvider>
            <NavigationContainer>
              <Navigation/>
            </NavigationContainer>
          </BLEProvider>
        </DbProvider>
      </DataProvider>
    </Animated.View>
  ) : (
    <View style={styles.fullScreen}>
      <Slides
        onDone={() => {
          console.log("Slides done");
        }}
        onNavigateToWelcome={handleNavigateToWelcome}
        onNavigateToRegister={handleNavigateToRegister}
        onNavigateToLogin={handleNavigateToLogin}
      />
    </View>

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
