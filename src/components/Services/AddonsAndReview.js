import React from 'react';
import {View, Text, TextInput, Switch, StyleSheet} from 'react-native';

const AddonsAndReview = ({formData, onChange, errors}) => {
  return (
    <View>
      <TextInput
        value={formData.addons.join(', ')}
        onChangeText={value =>
          onChange(
            'addons',
            value.split(',').map(addon => addon.trim()),
          )
        }
        placeholder="Addons (comma separated)"
        style={styles.input}
      />
      {errors.addons && <Text style={styles.errorText}>{errors.addons}</Text>}

      <Text style={styles.label}>Cancellation Policy:</Text>
      <TextInput
        style={[
          styles.input,
          errors.cancellationPolicy ? styles.errorInput : null,
        ]}
        value={formData.cancellationPolicy}
        onChangeText={value => onChange('cancellationPolicy', value)}
        placeholder="Enter cancellation policy"
        multiline
      />
      {errors.cancellationPolicy && (
        <Text style={styles.errorText}>{errors.cancellationPolicy}</Text>
      )}

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Accept Terms and Conditions</Text>
        <Switch
          value={formData.terms}
          onValueChange={value => onChange('terms', value)}
        />
      </View>
      {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
  errorInput: {
    borderColor: 'red',
  },
});

export default AddonsAndReview;
