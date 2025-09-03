import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/navigation/NavigationContainer";
import Slides from "./src/components/InitialSlider";
import SplashScreen from "./src/screens/SplashScreen";
import { useAppFonts } from "./src/hooks/useAppFonts";

export default function App() {
  const fontsLoaded = useAppFonts(); // chama o hook (internamente já previne/oculta splash)

  // demais hooks (ex.: useState, useEffect) sempre declarados aqui
  const [showSplash, setShowSplash] = useState(true);
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    (async () => {
      const seen = await AsyncStorage.getItem("@aqualink_seen_intro");
      if (seen) setShowNav(true);
    })();
  }, []);

  // Se quiser, pode continuar a usar sua tela Splash customizada enquanto fontsLoaded=false,
  // mas com expo-splash-screen você pode simplesmente renderizar sua navegação quando fontsLoaded true.
  if (!fontsLoaded) return null;

  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
}
