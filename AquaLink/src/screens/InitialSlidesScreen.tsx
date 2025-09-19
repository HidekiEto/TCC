import React from "react";
import InitialSlider from "../components/InitialSlider";
import { View, StyleSheet } from "react-native";
import { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';

interface InitialSlidesScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

export default function InitialSlidesScreen({ navigation }: InitialSlidesScreenProps) {
  return (
    <View style={styles.container}>
      <InitialSlider
        onDone={() => navigation.navigate("Welcome")}
        onNavigateToWelcome={() => navigation.navigate("Welcome")}
        onNavigateToRegister={() => navigation.navigate("Register")}
        onNavigateToLogin={() => navigation.navigate("Login")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
