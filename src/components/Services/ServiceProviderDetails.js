import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from 'react-native';

const ServiceProviderDetails = ({ formData, onChange, errors }) => {
  const [certification, setCertification] = useState('');

  const handleAddCertification = () => {
    if (certification.trim()) {
      const updatedCertifications = [...formData.serviceProvider.certifications, certification.trim()];
      onChange('serviceProvider.certifications', updatedCertifications);
      setCertification(''); // Clear the input after adding
    } else {
      Alert.alert('Validation Error', 'Please enter a valid certification.');
    }
  };

  const handleRemoveCertification = (index) => {
    const updatedCertifications = formData.serviceProvider.certifications.filter((_, i) => i !== index);
    onChange('serviceProvider.certifications', updatedCertifications);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Provider Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter provider's name"
        value={formData.serviceProvider.name}
        onChangeText={(value) => onChange('serviceProvider.name', value)}
      />
      {errors.providerName && <Text style={styles.errorText}>{errors.providerName}</Text>}

      <Text style={styles.label}>Experience (in years)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter experience in years"
        keyboardType="numeric"
        value={formData.serviceProvider.experience.toString()} // Ensure it's a string
        onChangeText={(value) => onChange('serviceProvider.experience', value.replace(/[^0-9]/g, ''))} // Allow only numbers
      />
      {errors.experience && <Text style={styles.errorText}>{errors.experience}</Text>}

      <Text style={styles.label}>Certifications</Text>
      <View style={styles.certificationsContainer}>
        {formData.serviceProvider.certifications.map((cert, index) => (
          <View key={index} style={styles.certificationItem}>
            <Text style={styles.certificationText}>{cert}</Text>
            <TouchableOpacity onPress={() => handleRemoveCertification(index)}>
              <Text style={styles.removeCertificationText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Add a certification"
        value={certification}
        onChangeText={setCertification} // Directly set the certification input
      />
      <TouchableOpacity onPress={handleAddCertification} style={styles.addCertificationButton}>
        <Text style={styles.addCertificationText}>Add Certification</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Contact Information</Text>
      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={formData.serviceProvider.contact.phone}
        onChangeText={(value) => onChange('serviceProvider.contact.phone', value)}
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter email"
        keyboardType="email-address"
        value={formData.serviceProvider.contact.email}
        onChangeText={(value) => onChange('serviceProvider.contact.email', value)}
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  certificationsContainer: {
    marginBottom: 10,
  },
  certificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  certificationText: {
    fontSize: 14,
  },
  removeCertificationText: {
    color: 'red',
  },
  addCertificationButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  addCertificationText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
});

export default ServiceProviderDetails;
