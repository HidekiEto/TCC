import * as React from 'react';
import { TextInput, TextInputProps } from 'react-native-paper';


interface InputProps extends TextInputProps {
  label: string;
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  className?: string; 
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  className, 
  ...props
}) => {
  return (
    <TextInput
      mode="outlined"
      label={label}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      activeOutlineColor="#1081C7"
      outlineColor="#1081C7"
      {...props}
    />
  );
};

export default Input;
