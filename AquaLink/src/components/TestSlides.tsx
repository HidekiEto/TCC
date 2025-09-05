import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface TestSlidesProps {
  onDone: () => void;
}

export default function TestSlides({ onDone }: TestSlidesProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#084F8C", "#27D5E8"]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>AquaLink</Text>
          <Text style={styles.subtitle}>A garrafa inteligente 100% brasileira.</Text>
          
          <TouchableOpacity
            style={styles.button}
            onPress={onDone}
          >
            <Text style={styles.buttonText}>Iniciar Experiência</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width,
    height,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: 'white',
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
