import React, { useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StatusBar, StyleSheet, Dimensions, Image, Animated } from "react-native";
import * as Animatable from "react-native-animatable";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import type { RootStackParamList } from "../types/navigation";

const { width, height } = Dimensions.get('window');

export default function Welcome() {
  const navigation = useNavigation<NavigationProp<RootStackParamList, "Welcome">>();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <LinearGradient
        colors={["#084F8C", "#27D5E8"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <StatusBar backgroundColor="#084F8C" barStyle="light-content" />

        <View style={styles.content}>
          <Animatable.View 
            style={styles.headerContainer}
            animation="fadeInUp"
            duration={1000}
            delay={200}
          >
            <Text style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.subtitle}>
              Sua experiência com{'\n'}
              <Text style={styles.aquaLinkText}>AquaLink</Text> acaba de começar.
            </Text>
          </Animatable.View>

          <Animatable.View 
            style={styles.buttonContainer}
            animation="fadeInUp"
            duration={1000}
            delay={400}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Nova Conta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Já possuo uma Conta</Text>
            </TouchableOpacity>
          </Animatable.View>

          <Animatable.View 
            style={styles.imageContainer}
            animation="fadeInUp"
            duration={1200}
            delay={600}
          >
            <Image
              source={require("../assets/fitFemale.png")}
              resizeMode="contain"
              style={styles.image}
            />
          </Animatable.View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
  },
  headerContainer: {
    alignItems: 'flex-start',
    marginTop: height * 0.12,
    marginBottom: height * 0.05,
    paddingLeft: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    fontWeight: '300',
    lineHeight: 22,
  },
  aquaLinkText: {
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  primaryButton: {
    backgroundColor: '#27D5E8',
    width: width * 0.75,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    paddingBottom: 3,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '400',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 0,
  },
  image: {
    width: width * 2,
    height: width * 0.8,
  },
});