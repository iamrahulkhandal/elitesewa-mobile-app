import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

type DropdownProps = { label: string; selectedValue: any; onValueChange: (...args: any[]) => void; options?: any[] };

const Dropdown = ({ label, selectedValue, onValueChange, options = [] }: DropdownProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
      >
        <Picker.Item label="Select an option" value="" />
        {options.length > 0 &&
          options.map((option: any, index: number) => (
            <Picker.Item key={index} label={option} value={option} />
          ))}
      </Picker>
      </View>
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
  pickerContainer: {
    width: '100%', // Full width of the parent container
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical:1,
    justifyContent: 'center',
    height:50
  },
  
});

export default Dropdown;
