import React from 'react';
import type { KeyboardTypeOptions } from 'react-native';
import { View, Text, TextInput, StyleSheet } from 'react-native';

type InputFieldProps = {
  label: string;
  value?: string;
  onChange?: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  /** Defaults to editable; pass false for read-only rows. */
  editable?: boolean;
  multiline?: boolean;
};

const InputField = ({ label, value, onChange, placeholder, keyboardType, editable }: InputFieldProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}  
        placeholder={placeholder}
        keyboardType={keyboardType}
        editable={editable !== undefined ? editable : true}
      />
    </View>  
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  label: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    color: 'inherit',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 10,
    height: 45,
  },
});

export default InputField;
