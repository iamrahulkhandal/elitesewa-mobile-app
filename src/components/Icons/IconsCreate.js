import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env'; // Import the environment variable
import { Picker } from '@react-native-picker/picker'; // Import the Picker component

const IconsCreate = () => {
  const [name, setName] = useState('');
  const [unicode, setUnicode] = useState('');
  const [label, setLabel] = useState('');
  const [library, setLibrary] = useState('');
  const [type, setType] = useState('solid'); // Default type

  const handleSubmit = async () => {
    // Validate that all fields are filled
    if (!name || !unicode || !label || !library || !type) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    // Create the icon data structure with type included
    const iconData = {
      type, // Include the type field for the icon type
      icons: [
        {
          name,
          unicode,
          label,
          library,
          // The type for the individual icon details needs to match the expected structure
          type, // Ensure this type corresponds to the expected structure for icons
        },
      ],
    };

    try {
      const response = await axios.post(`${API_URL}/api/icons`, iconData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Icon created successfully!');
        // Reset fields after successful submission
        setName('');
        setUnicode('');
        setLabel('');
        setLibrary('');
        setType('solid'); // Reset type to default
      } else {
        Alert.alert('Error', 'Failed to create icon.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Something went wrong: ' + error.response?.data?.message || 'Unknown error');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Unicode"
        value={unicode}
        onChangeText={setUnicode}
      />
      <TextInput
        style={styles.input}
        placeholder="Label"
        value={label}
        onChangeText={setLabel}
      />
      <TextInput
        style={styles.input}
        placeholder="Library"
        value={library}
        onChangeText={setLibrary}
      />
      <Picker
        selectedValue={type}
        style={styles.picker}
        onValueChange={(itemValue) => setType(itemValue)}
      >
        <Picker.Item label="Solid" value="solid" />
        <Picker.Item label="Brands" value="brands" />
        <Picker.Item label="Outlined" value="outlined" />
        <Picker.Item label="Filled" value="filled" />
        <Picker.Item label="Social" value="social" />
        <Picker.Item label="Services" value="services" />
        <Picker.Item label="Car Services" value="car_services" />
        <Picker.Item label="Cleaning Services" value="cleaning_services" />
      </Picker>
      <Button title="Create Icon" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 12,
  },
});

export default IconsCreate;
