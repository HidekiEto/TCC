import * as React from 'react';
import { TextInput } from 'react-native-paper';

const Input = ({ label, placeholder, value, onChangeText }) => {
  return (
    <TextInput
      mode="outlined"
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      activeOutlineColor='#1081C7'
      outlineColor='#1081C7'

    />
  );
};

export default Input;
