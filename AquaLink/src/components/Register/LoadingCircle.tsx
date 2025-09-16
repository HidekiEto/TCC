import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LiquidGauge } from '../HomeComponents/LiquidGauge';

interface LoadingCircleProps {
  progress: number; // valor de 0 a 100
  text?: string;
}

const LoadingCircle: React.FC<LoadingCircleProps> = ({ progress, text }) => {
  return (
    <View style={styles.container}>
      <LiquidGauge value={progress} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#084F8C',
    fontWeight: 'bold',
  },
});

export default LoadingCircle;
