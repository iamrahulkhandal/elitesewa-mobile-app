// /src/screens/GeneralRepairServiceScreen.js
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, List, Button } from 'react-native-paper';

const GeneralRepairServiceScreen = () => {
  const service = {
    id: '5',
    name: 'General Repair Services',
    heading: 'Premium Car Repair Service',
    description: "Our premium car repair service ensures your vehicle is in top condition. We offer comprehensive checks and repairs to keep your car running smoothly.",
    price: 999,
    features: [
      { id: '1', feature: 'Engine Diagnostics' },
      { id: '2', feature: 'Brake Repairs' },
      { id: '3', feature: 'Transmission Services' },
      { id: '4', feature: 'Suspension Repairs' }
    ],
    additionalInfo: [
      { id: '1', feature: 'Service Duration: 1.5 hours' },
      { id: '2', feature: 'Available in all locations' },
      { id: '3', feature: '24/7 Customer Support' }
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>{service.heading}</Text>
      <Text style={styles.description}>{service.description}</Text>
      <Text style={styles.price}>Price: ₹{service.price}</Text>
      
      <Text style={styles.sectionTitle}>Features:</Text>
      <List.Section>
        {service.features.map(feature => (
          <List.Item key={feature.id} title={feature.feature} />
        ))}
      </List.Section>

      <Text style={styles.sectionTitle}>Additional Information:</Text>
      <List.Section>
        {service.additionalInfo.map(info => (
          <List.Item key={info.id} title={info.feature} />
        ))}
      </List.Section>

      <Button mode="contained" style={styles.button}>
        Book Now
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  },
});

export default GeneralRepairServiceScreen;
