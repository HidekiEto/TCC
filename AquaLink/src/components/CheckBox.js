import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function Checkbox() {
  const [checked, setChecked] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const toggleCheck = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();

    setChecked(!checked);
  };

  return (
    <TouchableOpacity 
      onPress={toggleCheck} 
      className="flex-row items-center justify-center m-1.5"
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
        className={`
          w-7 h-7 rounded-lg border 
          ${checked ? 'border-blue-900 bg-white' : 'border-blue-900 bg-white'} 
          items-center justify-center mr-2.5
        `}
      >
        {checked && <MaterialIcons name="check" size={20} color="#082862" />}
      </Animated.View>
      <Text className="text-blue-900 text-base">Manter Conectado</Text>
    </TouchableOpacity>
  );
}
