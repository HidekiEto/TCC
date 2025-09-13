import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/navigation/NavigationContainer";
import { useAppFonts } from "./src/hooks/useAppFonts";
import { AuthProvider } from "./src/store/AuthContext";

export default function App() {
  const fontsLoaded = useAppFonts();

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </AuthProvider>
  );
}
