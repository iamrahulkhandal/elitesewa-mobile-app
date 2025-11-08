import React from 'react';
import { View, TextInput, Text } from 'react-native';

const PricingAndDuration = ({ formData, onChange, errors }) => {
  return (
    <View>
      <TextInput
        value={formData.price}
        onChangeText={(value) => onChange('price', value)}
        placeholder="Price"
        keyboardType="numeric"
        style={styles.input}
      />
      {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

      <TextInput
        value={formData.discount}
        onChangeText={(value) => onChange('discount', value)}
        placeholder="Discount (%)"
        keyboardType="numeric"
        style={styles.input}
      />
      {errors.discount && <Text style={styles.errorText}>{errors.discount}</Text>}

      <TextInput
        value={formData.duration}
        onChangeText={(value) => onChange('duration', value)}
        placeholder="Duration (e.g. 1 hour)"
        style={styles.input}
      />
      {errors.duration && <Text style={styles.errorText}>{errors.duration}</Text>}
    </View>
  );
};

const styles = {
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginVertical: 5,
  },
};

export default PricingAndDuration;
