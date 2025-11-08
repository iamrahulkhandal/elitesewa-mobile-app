import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Import Picker component

const BasicInfo = ({ formData, onChange, errors }) => {
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        placeholder="Enter title"
        value={formData.title}
        onChangeText={(text) => handleChange('title', text)}
        style={styles.input}
      />
      {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

      <Text style={styles.label}>Subtitle:</Text>
      <TextInput
        placeholder="Enter subtitle"
        value={formData.subtitle}
        onChangeText={(text) => handleChange('subtitle', text)}
        style={styles.input}
      />
      {errors.subtitle && <Text style={styles.errorText}>{errors.subtitle}</Text>}

      <Text style={styles.label}>Type:</Text>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={formData.type}
          onValueChange={(value) => handleChange('type', value)}
        >
          <Picker.Item label="Select Type" value="" />
          <Picker.Item label="Type1" value="Type1" />
          <Picker.Item label="Type2" value="Type2" />
          <Picker.Item label="Type3" value="Type3" />
        </Picker>
      </View>
      {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}

      <Text style={styles.label}>Short Description:</Text>
      <TextInput
        placeholder="Enter short description"
        value={formData.shortDescription}
        onChangeText={(text) => handleChange('shortDescription', text)}
        style={styles.input}
        multiline
        numberOfLines={2}
      />
      {errors.shortDescription && <Text style={styles.errorText}>{errors.shortDescription}</Text>}

      <Text style={styles.label}>Description:</Text>
      <TextInput
        placeholder="Enter detailed description"
        value={formData.description}
        onChangeText={(text) => handleChange('description', text)}
        style={styles.input}
        multiline
        numberOfLines={4}
      />
      {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

      <Text style={styles.label}>Name:</Text>
      <TextInput
        placeholder="Enter name"
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
        style={styles.input}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: -5,
    marginBottom: 10,
  },
});

export default BasicInfo;
