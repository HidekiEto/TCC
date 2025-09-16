import React from 'react';
import { View, StyleSheet } from 'react-native';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const renderDot = (stepNumber: number) => {
    const isActive = stepNumber === currentStep;
    const isCompleted = stepNumber < currentStep;
    
    return (
      <View
        key={stepNumber}
        style={[
          styles.dot,
          isActive ? styles.activeDot : styles.inactiveDot,
          isCompleted ? styles.completedDot : {}
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, index) => renderDot(index + 1))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingTop: 40,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
  },
  inactiveDot: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  completedDot: {
    backgroundColor: '#FFFFFF',
  },
});