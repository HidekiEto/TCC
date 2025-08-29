import * as React from 'react';
import { TextInput, TextInputProps } from 'react-native-paper';


interface InputProps extends TextInputProps {
  label: string;
  placeholder: string;
}

const Input: React.FC<InputProps> = ({ label, placeholder, ...props }) => {
  return (
    <TextInput
      mode="outlined"
      label={label}
      placeholder={placeholder}
      activeOutlineColor="#1081C7"
      outlineColor="#1081C7"
      {...props} 
    />
  );
};

export default Input;
