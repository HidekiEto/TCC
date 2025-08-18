import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CheckBox = ({ checked, onChange, label }) => (
  <TouchableOpacity style={styles.container} onPress={() => onChange(!checked)}>
    <View style={[styles.box, checked && styles.checkedBox]}>
      {checked && <View style={styles.innerBox} />}
    </View>
    {label && <Text style={styles.label}>{label}</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  box: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#1081C7',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkedBox: {
    borderColor: '#007AFF',
  },
  innerBox: {
    width: 12,
    height: 12,
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    color: '#1081C7',
  },
});

export default CheckBox;
