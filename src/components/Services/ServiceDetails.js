// src/components/ServiceDetails.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { REACT_NATIVE_SERVER_URL } from '@env';

const ServiceDetails = () => {
  const route = useRoute();
  const { serviceId } = route.params; // Get the service ID from the route parameters
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axios.get(`${REACT_NATIVE_SERVER_URL}/api/services/${serviceId}`);
        setService(response.data);
      } catch (error) {
        console.error(error);
        setError('Failed to load service details.');
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{service.title}</Text>
      <Text style={styles.subtitle}>{service.subtitle}</Text>
      <Text style={styles.description}>{service.description}</Text>
      <Text style={styles.price}>Price: ${service.price}</Text>
      {/* Add more fields as needed */}
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  description: {
    fontSize: 16,
    marginVertical: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});

export default ServiceDetails;
