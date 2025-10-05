import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  const renderStep = (stepNumber: number) => {
    const isActive = stepNumber === currentStep;
    const isCompleted = stepNumber < currentStep;
    
    return (
      <React.Fragment key={stepNumber}>
       
        {stepNumber > 1 && (
          <View style={[
            styles.line,
            (isCompleted || isActive) ? styles.lineActive : styles.lineInactive
          ]} />
        )}
        
       
        <View style={[
          styles.circle,
          isActive ? styles.circleActive : (isCompleted ? styles.circleCompleted : styles.circleInactive)
        ]}>
          {isActive && (
            <Text style={styles.stepNumber}>{stepNumber}</Text>
          )}
        </View>
      </React.Fragment>
    );
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, index) => renderStep(index + 1))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#084F8C',
  },
  circleCompleted: {
    backgroundColor: '#084F8C',
    borderWidth: 0,
  },
  circleInactive: {
    backgroundColor: '#084F8C',
    borderWidth: 0,
  },
  stepNumber: {
    color: '#084F8C',
    fontSize: 14,
    fontWeight: 'bold',
  },
  line: {
    width: 40,
    height: 2,
  },
  lineActive: {
    backgroundColor: '#084F8C',
  },
  lineInactive: {
    backgroundColor: '#084F8C',
  },
});