import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/navigation/NavigationContainer";
import { useAppFonts } from "./src/hooks/useAppFonts";
import { Text, View, StyleSheet } from "react-native";
import SplashScreen from "./src/screens/SplashScreen";
import Slides from "./src/components/InitialSlider";
import { BLEProvider } from "./src/contexts/BLEProvider";

export default function App() {
  const fontsLoaded = useAppFonts();
  const [showSplash, setShowSplash] = useState(true);
  const [showNav, setShowNav] = useState(false);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Initialize app when fonts are loaded
    if (fontsLoaded) {
      const timer = setTimeout(() => {
        setAppReady(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  // Show loading screen while fonts are loading or app is initializing
  if (!fontsLoaded || !appReady) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando AquaLink...</Text>
      </View>
    );
  }

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // Show navigation with BLE provider or initial slides
  return showNav ? (
    <BLEProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </BLEProvider>
  ) : (
    <View style={styles.fullScreen}>
      <Slides onDone={() => setShowNav(true)} />
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
