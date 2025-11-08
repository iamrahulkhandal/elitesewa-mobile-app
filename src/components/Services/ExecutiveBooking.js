import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { REACT_NATIVE_SERVER_URL } from '@env';

const ExecutiveBooking = ({ navigation }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Access user and role from Redux store
  const userId = useSelector((state) => state.auth.userId);
  const role = useSelector((state) => state.auth.role);

  const fetchPayments = async () => {
    if (!userId || !role) return;
    setLoading(true);
    try {
      const response = await axios.get(`${REACT_NATIVE_SERVER_URL}/api/payment/${role}/${userId}`);
      setPayments(response.data.payments || []);
    } catch (error) {
      console.error('Error fetching payment listings:', error.message);
      Alert.alert('Error', 'Unable to fetch payment listings. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPayments();
  };

  // Fetch data when screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchPayments();
    }, [userId, role])
  );

  const handleCancelBooking = async (paymentId) => {
    try {
      await axios.put(`${REACT_NATIVE_SERVER_URL}/api/payment/${paymentId}/cancel`);
      Alert.alert('Success', 'Booking has been cancelled successfully.');
      fetchPayments(); // Refresh the list after cancellation
    } catch (error) {
      console.error('Error cancelling booking:', error.message);
      Alert.alert('Error', 'Failed to cancel booking. Please try again.');
    }
  };

  const renderPaymentItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('BookingDetails', { item_id: item._id })}>
      <Text style={styles.title}>Plan: {item.planId?.name || 'N/A'}</Text>
      <Text style={styles.text}>Service: {item.serviceId?.name || 'N/A'}</Text>
      <Text style={styles.text}>User: {item.userId?.name || 'N/A'}</Text>
      <Text style={styles.text}>Payment Status: {item.status}</Text>
      <Text style={styles.text}>Service Status: {item.service}</Text>
      </TouchableOpacity>
      {item.service === 'PENDING' ? (
        <TouchableOpacity
          style={[styles.button, styles.pendingButton]}
          onPress={() => navigation.navigate('ExecutiveServicesCreate', { item_id: item._id })}
        >
          <Text style={styles.buttonText}>Service Pending</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, styles.completeButton]}>
          <Text style={styles.buttonText}>Service Complete</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (loading && !refreshing) {
    return <ActivityIndicator size="large" color="#F37254" style={styles.loading} />;
  }

  return (
    <FlatList
      data={payments}
      keyExtractor={(item) => item._id}
      renderItem={renderPaymentItem}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      contentContainerStyle={styles.list}
      ListEmptyComponent={
        !loading && <Text style={styles.emptyText}>No payments found.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 10,
  },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  button: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  pendingButton: {
    backgroundColor: '#f39c12',
  },
  completeButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
});

export default ExecutiveBooking;
